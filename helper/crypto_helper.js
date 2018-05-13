const base64 = require('base-64');
const algorithm = 'aes-256-ctr';
var CryptoJS = require("crypto-js");
var pbkdf2 = require('pbkdf2')

exports.encrypt = function(text, password){
    return base64.encode(CryptoJS.AES.encrypt(text, password).toString().replace(/\//g, "*"));
};

exports.decrypt = function(text, password){
    try {
        var decryptedText = CryptoJS.AES.decrypt(base64.decode(text).replace(/\*/g, "/"), password).toString(CryptoJS.enc.Utf8);
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