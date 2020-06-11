module.exports = function(a, b) {
  if(a == b) return a;
  if(b == '#') return a;
  
  var aSplit = a.split('/');
  var bSplit = b.split('/');
  
  var inferredTopic = [];

  for(let i = 0; i < aSplit.length + 1; i++) {
    if(bSplit[i] == '#') {
      return inferredTopic.concat(aSplit.slice(i)).join('/');
    } else if(aSplit[i] == '+') {
      inferredTopic.push(bSplit[i]);
      continue;
    } else if(bSplit[i] != '+' && bSplit[i] != aSplit[i]) {
      return null;
    }
    if(i < aSplit.length) inferredTopic.push(aSplit[i]);
  } 
  
  if(aSplit.length == bSplit.length) {
    return inferredTopic.join('/');
  } else {
    return null;
  }
}