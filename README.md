# node-red-contrib-topic-link

Send messages within Node-RED based on specified topics.
* Supports basic wildcards like `#` and `+`.
* Like MQTT nodes, but without broker, i.e. all messages are routed internally only.
* In addition to MQTT topic rules, it also allows to PUBLISH on a topic that contains the `+` wildcard.
* The nodes are connected on startup/deploy, leading to efficient message passing.
* Supports dynamic topic setting via incomming messages.
However, in this case, it is less efficient, since it has to loop over all `topic-link in` nodes to find a match.


The idea behind these two nodes is to have a link node with wildcards, but without the overhead of serialization, sending to broker, receiving from broker, deserialization if done via MQTT.
