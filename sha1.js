var sha1 = require('sha1');

function encode(num){
  var encoded = sha1(num);
  return encoded.substring(0,5);
}
module.exports.encode = encode;
