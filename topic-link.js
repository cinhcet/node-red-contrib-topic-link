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

  function matchTopic(a, b) {
    if(a == b) return true;
    if(b == '#') return true;

    var aSplit = a.split('/');
    var bSplit = b.split('/');

    for(let i = 0; i < aSplit.length; i++) {
      if(bSplit[i] == '#') {
        return true;
      } else if(bSplit[i] != '+' && bSplit[i] != aSplit[i]) {
        return false;
      }
    } 

    return aSplit.length == bSplit.length;
  }

  function connectNodes() {
    for(let linkInNode of linkInNodes) {
      for(let linkOutNode of linkOutNodes) {
        if(matchTopic(linkOutNode.topic, linkInNode.topic)) {
          linkInNode.connectedNodes.add(linkOutNode);
          linkOutNode.connectedNodes.add(linkInNode);
        }
      }
    }
  }

  function topicLinkIn(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.topic = config.topic;

    node.connectedNodes = new Set();
    
    linkInNodes.add(node);

    connectNodes();

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
    node.connectedNodes = new Set();

    linkOutNodes.add(node);

    connectNodes();

    node.on('input', function(m, send, done) {
      node.connectedNodes.forEach(function(n) {
        n.send(m);
      });
      if(done) {
        done();
      }
    });

    node.on('close', function() {
      linkOutNodes.delete(node);
    });
  }
  RED.nodes.registerType("topic-link out", topicLinkOut);
}
