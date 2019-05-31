
exports.convertHex = function (hex,opacity){
  hex = hex.replace('#','');
  r = parseInt(hex.substring(0,2), 16);
  g = parseInt(hex.substring(2,4), 16);
  b = parseInt(hex.substring(4,6), 16);
  result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
  return result;
};

exports.rgbToHex = function (rgb) { 
  var hex1 = Number(rgb[0]).toString(16);
  if (hex1.length < 2) {
       hex1 = "0" + hex1;
  }
  var hex2 = Number(rgb[1]).toString(16);
  if (hex2.length < 2) {
       hex2 = "0" + hex2;
  }
  var hex3 = Number(rgb[2]).toString(16);
  if (hex3.length < 2) {
       hex3 = "0" + hex3;
  }
  return "#" + hex1 + hex2 + hex3;
};

