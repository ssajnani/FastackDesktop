const base64 = require('base-64');
const algorithm = 'aes-256-ctr';
var CryptoJS = require("crypto-js");
var pbkdf2 = require('pbkdf2')

exports.encrypt = function(text, password){
    return btoa(CryptoJS.AES.encrypt(text, password).toString().replace(/\//g, "*"));
};

exports.decrypt = function(text, password){
    try {
        var decryptedText = CryptoJS.AES.decrypt(atob(text).replace(/\*/g, "/"), password).toString(CryptoJS.enc.Utf8);
        return decryptedText;
    } catch (err){
        return ""
    }
};

exports.hashPassword = function(password, salt) {
    var iterations = 10000;
    var hash = pbkdf2.pbkdf2Sync(password, salt, iterations, 125, 'sha512');
    return {
        salt: salt,
        hash: hash,
        iterations: iterations
    };
};

exports.generateRandomNumberOfLength = function(size) {
  var randomLength = Math.floor(Math.random()*length);
  return Math.floor(Math.pow(10, randomLength-1) + Math.random() * (Math.pow(10, randomLength) - Math.pow(10, randomLength-1) - 1));
};