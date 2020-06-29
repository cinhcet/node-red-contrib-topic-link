/**
 * Copyright (c) 2020 cinhcet
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
  "use strict";

  var linkInNodes = new Set();
  var linkOutNodes = new Set();

  const matchTopic = require('./topicMatch');

  function topicLinkIn(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.config = config;
    node.topic = config.topic;

    node.connectedNodes = new Set();

    linkInNodes.add(node);

    if(config.topic !== "") {
      for(let linkOutNode of linkOutNodes) {
        let inferredTopic = matchTopic(linkOutNode.topic, node.topic);
        if(inferredTopic) {
          node.connectedNodes.add(linkOutNode);
          linkOutNode.connectedNodes.set(node, inferredTopic);
        }
      }
    }

    node.on('input', function(m, send, done) {
      if(m.topic !== "") {
        node.topic = m.topic;
        node.connectedNodes.forEach(function(n) {
          n.connectedNodes.delete(node);
        });
        for(let linkOutNode of linkOutNodes) {
          let inferredTopic = matchTopic(linkOutNode.topic, m.topic);
          if(inferredTopic) {
            node.connectedNodes.add(linkOutNode);
            linkOutNode.connectedNodes.set(node, inferredTopic);
          }
        }
        done();
      } else {
        done('topic not set');
      }
    });

    node.on('close', function() {
      linkInNodes.delete(node);
      node.connectedNodes.forEach(function(n) {
        n.connectedNodes.delete(node);
      });
    });
  }

  RED.nodes.registerType("topic-link in", topicLinkIn);

  function topicLinkOut(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.topic = config.topic;
    node.connectedNodes = new Map();

    if(node.topic !== '') {
      linkOutNodes.add(node);

      for(let linkInNode of linkInNodes) {
        let inferredTopic = matchTopic(node.topic, linkInNode.topic);
        if(inferredTopic) {
          linkInNode.connectedNodes.add(node);
          node.connectedNodes.set(linkInNode, inferredTopic);
        }
      }
    }

    node.on('input', function(m, send, done) {
      if(node.topic !== '') {
        for(let [n, topic] of node.connectedNodes) {
          let sendMsg = node.connectedNodes.size == 1 ? m : RED.util.cloneMessage(m);
          if(n.config.appendTopic === true) {
            sendMsg.topic = topic;
          }
          n.send(sendMsg);
        }
        done();
      } else if(m.topic !== '') {
        for(let linkInNode of linkInNodes) {
          let inferredTopic = matchTopic(m.topic, linkInNode.topic);
          if(inferredTopic) {
            let sendMsg = linkInNodes.size == 1 ? m : RED.util.cloneMessage(m);
            sendMsg.topic = inferredTopic;
            linkInNode.send(sendMsg);
          }
        }
        done();
      } else {
        done('neither the topic has been configured or the topic property of the message is set');
      }
    });

    node.on('close', function() {
      linkOutNodes.delete(node);
      node.connectedNodes.forEach(function(n) {
        n.connectedNodes.delete(node);
      });
    });
  }
  RED.nodes.registerType("topic-link out", topicLinkOut);
}
