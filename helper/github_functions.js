const base64 = require('base-64');
const algorithm = 'aes-256-ctr';
var CryptoJS = require("crypto-js");
var cryptoHelper = require('./crypto_helper');
var async = require('async');


exports.makeRepo = function(token, repoName, privateRepos, callback){
    fetch("https://api.github.com/user/repos", {
        method: 'POST',
        headers: {
            'Authorization' : 'token ' + token,
        },
        body: JSON.stringify({
            'name': repoName,
            'auto_init': true,
            'private': privateRepos,
            'gitignore_template': 'nanoc'
        })
    })
        .then((response) => {
            const isValid = response.status < 400;
            const body = response._bodyInit;
            response.json().then((json) => {
                if (isValid) {
                    console.log("success");
                    return callback(null, "success");
                } else {
                    console.log(json);
                    return callback(json.message, null);
                }
            });
        });
}

exports.getPlan = function(token, callback){
    fetch("https://api.github.com/user", {
        method: 'GET',
        headers: {
            'Authorization' : 'token ' + token,
        }
    })
        .then((response) => {
            const isValid = response.status < 400;
            const body = response._bodyInit;
            return response.json().then((json) => {
                if (isValid) {
                    return callback(null, json.plan);
                } else {
                    return callback(json.message, null);
                }
            });
        });
}

exports.checkFastackRepoExists = function(token, username, password, filename, callback){
    fetch("https://api.github.com/user/repos?visibility=all&affiliation=owner", {
        method: 'GET',
        headers: {
            'Authorization' : 'token ' + token,
        }
    })
        .then((response) => {
            const isValid = response.status < 400;
            const body = response._bodyInit;
            response.json().then((json) => {
                if (isValid) {
                    var nameArray = json.map(function(item) { return item.name});
                    async.map(nameArray, async.apply(this.getContent, token, username), function(err, contentArray){
                        for (var repoCount = 0; repoCount < contentArray.length; repoCount++){
                            for (var fileCount = 0; fileCount < contentArray[repoCount].length; fileCount++) {
                                if (cryptoHelper.decrypt(contentArray[repoCount][fileCount].name, password) == username) {
                                    return callback(null, [json[repoCount].name, cryptoHelper.decrypt(contentArray[repoCount][fileCount].name, password)]);
                                }
                            }
                        }
                        return callback(null, ["", ""]);
                    });
                } else {
                    return callback(json.message, null);
                }
            });
        });
}

exports.getContent = function(token, username, repoName, callback){
    fetch("https://api.github.com/repos/" + username + "/" + repoName + "/contents/", {
        method: 'GET',
        headers: {
            'Authorization': 'token ' + token,
        }
    }).then((response) => {
        const isValid = response.status < 400;
        const body = response._bodyInit;
        return response.json().then((json) => {
            if (isValid) {
                return callback(null, json)
            } else {
                return callback(json.message, null);
            }
        });
    });
}

exports.createFile = function(token, username, repoName, filename, fileContent, callback){
    fetch("https://api.github.com/repos/" + username + "/" + repoName + "/contents/" + filename, {
        method: 'PUT',
        headers: {
            'Authorization': 'token ' + token,
        },
        body: JSON.stringify({
            'content': filename,
            'message': filename
        })
    }).then((response) => {
        const isValid = response.status < 400;
        const body = response._bodyInit;
        return response.json().then((json) => {
            if (isValid) {
                return callback(null, json);
            } else {
                return callback(json.message, null);
            }
        });
    });
}