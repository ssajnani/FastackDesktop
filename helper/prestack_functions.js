const base64 = require('base-64');
var ls = require('local-storage');
var githubFunctions = require('../helper/github_functions');

exports.lookForStack = function(callback) {
    githubFunctions.getContent(ls('token'), ls('username'), "", ls('repoName'), function (err, contentArray) {
      if (err) {
        return callback(err, null);
      }
      largestYear = 0;
      var fileNum = contentArray.length;
      for (var fileCount = 0; fileCount < fileNum; fileCount++) {
        var fourDigits = /^\d{4}$/;
        if (fourDigits.test(contentArray[fileCount].name)) {
          if (parseInt(contentArray[fileCount].name) > largestYear) {
            largestYear = parseInt(contentArray[fileCount].name)
          }
        }
      }
      if (largestYear === 0) {
        return callback(null, null);
      }
      githubFunctions.getContent(ls('token'), ls('username'), largestYear, ls('repoName'), function (err, contentArray) {
        if (err) {
          return callback(err, null);
        }
        largestMonth = 0;
        var fileNum = contentArray.length;
        for (var fileCount = 0; fileCount < fileNum; fileCount++) {
          var twoDigits = /^\d{1,2}$/;
          if (twoDigits.test(contentArray[fileCount].name)) {
            if (parseInt(contentArray[fileCount].name) > largestMonth) {
              largestMonth = parseInt(contentArray[fileCount].name)
            }
          }
        }
        if (largestMonth === 0) {
          return callback(null, null);
        }
        githubFunctions.getContent(ls('token'), ls('username'), largestYear + "/" + largestMonth, ls('repoName'), function (err, contentArray) {
          if (err) {
            return callback(err, null);
          }
          largestDay = 0
          var fileNum = contentArray.length
          for (var fileCount = 0; fileCount < fileNum; fileCount++) {
            var twoDigits = /^\d{1,2}$/;
            if (twoDigits.test(contentArray[fileCount].name)) {
              if (parseInt(contentArray[fileCount].name) > largestDay) {
                largestDay = parseInt(contentArray[fileCount].name)
              }
            }
          }
          if (largestDay === 0) {
            return callback(null, null);
          } else {
            githubFunctions.getContent(ls('token'), ls('username'), largestYear + "/" + largestMonth + "/" + largestDay, ls('repoName'), function (err, results) {
              if (err) {
                console.log(err);
                return callback(err, null);
              } else {
                stack = JSON.parse(base64.decode(results['content']));
                console.log(stack);
                return callback(null, stack); 
              }
            });
          }
        });
      });
    });
  }
