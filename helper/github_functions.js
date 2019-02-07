const base64 = require('base-64');
const algorithm = 'aes-256-ctr';
var CryptoJS = require("crypto-js");
var cryptoHelper = require('./crypto_helper');
var async = require('async');
var GitHub = require('github-api');
var Repository = require('github-api/dist/components/Repository');
var gh = null;



function createNewGithub(token){
  if (!gh){
    gh = new GitHub({
      token: token
    });
  }
}


exports.makeRepo = function(token, repoName, privateRepos, callback){
  createNewGithub(token);
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
  createNewGithub(token);
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
exports.getProfile = function(token, callback){
  createNewGithub(token);
  gh.getUser().getProfile(function(err, response){
    if (err) {
      return callback(err);
    } else {
      return callback(null, response);
    }
  });
};

exports.getPlan = function(token, callback){
  createNewGithub(token);
  this.getProfile(token, function(err, profile){
    if (err){
      return callback(err);
    } else {
      return callback(null, profile.plan);
    }
  })
};

exports.getUsername = function(token, callback){
  createNewGithub(token);
  this.getProfile(token, function(err, profile){
    if (err){
      return callback(err);
    } else {
      return callback(null, profile.login);
    }
  })
};


exports.getContent = function(token, username, filepath, repoName, callback){
  createNewGithub(token);
  fetch("https://api.github.com/repos/" + username + "/" + repoName + "/contents/" + filepath, {
    method: 'GET',
    headers: {
      'Authorization': 'token ' + token,
    }
  }).then((response) => {
    const isValid = response.status < 400;
    const body = response._bodyInit;
    return response.json().then((json) => {
      if (isValid) {
        json['repoName'] = repoName;
        return callback(null, json)
      } else {
        return callback(json.message, null);
      }
    });
  });
}

exports.checkFastackRepoExists = function(token, username, callback){
  createNewGithub(token);
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
          var temp = this;
          var found = false;
          async.map(nameArray, async.apply(this.getContent, token, username, ""), function(err, contentArray){
            for (var repoCount = 0; repoCount < contentArray.length; repoCount++){
              for (var fileCount = 0; fileCount < contentArray[repoCount].length; fileCount++) {
                if (contentArray[repoCount][fileCount].name === username) {
                  found = true;
                  temp.getContent(token, username, username, json[repoCount].name, function(err, contentInfo){
                    if (err){
                      return callback('Unable to get file contents.', null);
                    }
                    return callback(null, [contentInfo['repoName'], contentInfo['content']]);
                  });
                } else if (repoCount === contentArray.length - 1 && fileCount === contentArray[repoCount].length - 1 && found === false){
                  console.log(found);
                  return callback(null, ["", ""]);
                }
              }
            }
          });
        } else {
          return callback(json.message, null);
        }
      });
    });
}

exports.checkFileExists = function(token, username, repoName, folderLevel, filename, callback){
  createNewGithub(token);
  this.getContent(token, username, folderLevel, repoName, function(err, contentArray){
    if (err){
      return callback(err, "");
    }
    for (var fileCount = 0; fileCount < contentArray.length; fileCount++) {
      if (contentArray[fileCount].name == filename) {
        return callback(null, contentArray[fileCount].name);
      }
    }
    return callback(null, "");
  });
}



exports.createFile = function(token, username, repoName, filename, fileContent, callback){
  createNewGithub(token);
  fetch("https://api.github.com/repos/" + username + "/" + repoName + "/contents/" + filename, {
    method: 'PUT',
    headers: {
      'Authorization': 'token ' + token,
    },
    body: JSON.stringify({
      'content': btoa(fileContent),
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
};