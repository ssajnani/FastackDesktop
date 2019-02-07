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
};


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
  var repo = new Repository(username + "/" + repoName, gh.__auth, "https://api.github.com");
  repo.getContents("master", "", true, function(err, response){
    if (err){
      return callback(err.message, null);
    } else {
      response['repoName'] = repoName;
      return callback(null, response)
    }
  });
};

exports.checkFastackRepoExists = function(username, token, callback){
  createNewGithub(token);
  gh.getUser().listRepos(function(err, response){
    if (err){
      return callback(err);
    } else {
      var temp = this;
      var repoArray = response.map(function(item) { return item.name;});
      async.map(repoArray, async.apply(this.getContent, token, username, ""), function (err, contentArray) {
        if (err){
          return callback(err);
        } else {
          var repoSize = contentArray.length;
          for (var repoCount = 0; repoCount < repoSize; repoCount++) {
            var numFiles = contentArray[repoCount].length;
            for (var fileCount = 0; fileCount < numFiles; fileCount++) {
              if (contentArray[repoCount][fileCount].name === username) {
                temp.getContent(username, username, response[repoCount].name, function (err, contentInfo) {
                  if (err) {
                    return callback('Unable to get file contents.', null);
                  }
                  return callback(null, [contentInfo['repoName'], contentInfo['content']]);
                });
              }
            }
          }
          return callback(null, ["", ""]);
        }
      });
    }

  }.bind(this));
};

exports.checkFileExists = function(token, username, repoName, folderLevel, filename, callback){
  createNewGithub(token);
  this.getContent(token, username, folderLevel, repoName, function(err, contentArray){
    if (err){
      return callback(err, "");
    }
    var numFiles = contentArray.length;
    for (var fileCount = 0; fileCount < numFiles; fileCount++) {
      if (contentArray[fileCount].name == filename) {
        return callback(null, contentArray[fileCount].name);
      }
    }
    return callback(null, "");
  });
}

exports.createFile = function(token, username, repoName, filename, fileContent, callback){
  fetch("https://api.github.com/repos/" + username + "/" + repoName + "/contents/" + filename, {
    method: 'PUT',
    headers: {
      'Authorization': 'token ' + token,
    },
    body: JSON.stringify({
      'content': fileContent,
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