const topicMatch = require('./topicMatch');

const cases = [
  ['topic', 'topic', 'topic'],
  ['/topic', '/topic', '/topic'],
  ['/topic/hallo', '/topic/hallo', '/topic/hallo'],
  ['/topic', 'topic', null],
  ['topic', 'TOPIC', null],
  ['hello', 'hel lo', null],
  ['hel lo', 'hel lo', 'hel lo'],
  ['topic/hello', 'topic', null],
  ['topic', 'topic/+', null],
  ['topic', 'topic/#', 'topic'],
  ['topic/bla', 'topic/#', 'topic/bla'],
  ['topic/bla/hello', 'topic/#', 'topic/bla/hello'],
  ['topic', 'topic/+/#', null],
  ['topic/', 'topic/+/#', 'topic/'],
  ['topic//', 'topic/+/#', 'topic//'],
  ['topic/bla/hello/yellow/water', 'topic/+/+/yellow/#', 'topic/bla/hello/yellow/water'],
  ['topic/hello', '+/+', 'topic/hello'],
  ['/topic', '/+', '/topic'],
  ['topic/+', 'topic/bla', 'topic/bla'],
  ['topic/+', 'topic/bla/hello', null],
  ['topic/#', 'topic/bla', null],
  ['topic/#', 'topic', null],
  ['topic/+/control', 'topic/bla/control', 'topic/bla/control'],
  ['topic/+/control', 'topic/bla/#', 'topic/bla/control'],
  ['topic/+/hello/control', 'topic/bla/+/control', 'topic/bla/hello/control'],
  ['topic/+/+/control/+', 'topic/hello/yellow/control/green', 'topic/hello/yellow/control/green'],
  ['topic/+/+/control/+', 'topic/hello/yellow/noControl/green', null],
  ['topic/+/+/control/+', 'topic/hello/yellow/+/green', 'topic/hello/yellow/control/green'],
  ['topic/+/+/control/+', 'topic/hello/yellow/#', 'topic/hello/yellow/control/+'],
  ['topic/#/bla', 'topic/hello/bla', null],
  ['topic/+/control', 'topic/hello/noControl', null],
  ['topic/+/hello', 'topic/+/+', 'topic/+/hello']
];

var fail = 0;
var good = 0;
cases.forEach(function(c) {
  prediction = topicMatch(c[0], c[1]);
  //console.log(c[0], c[1], prediction);
  if(prediction === c[2]) {
    good++;
  } else {
    fail++;
    console.log('fail', c, prediction);
  }
});

console.log('\n===============================================================');
if(fail) {
  console.log('TEST FAILED:', fail, 'of', fail+good, 'failed');
} else {
  console.log('TEST SUCCEEDED: all', good, 'correct');
}