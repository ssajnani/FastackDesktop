var stackFunctions = require('../helper/stack_functions');

function getCreateSettings(callback) {
  githubFunctions.checkFileExists(ls('token'), ls('username'), ls('repoName'), "settings", function (err, contentArray) {
    if (err == null && contentArray === "") {
      githubFunctions.createUpdateFile(ls('token'), ls('username'), ls('repoName'), "settings", JSON.stringify(settings), function (err, result) {
        if (err) {
          $('#errorreponame').text("Cannot create a settings file in the repository: " + err.message);
          return callback(err.message, null)
        } else {
          return callback(null, "success")
        }
      });
    } else {
      githubFunctions.getContent(ls('token'), ls('username'), "settings", ls('repoName'), function (err, settingsResults) {
        if (err) {
          $('#errorreponame').text("Cannot get a settings file from the repository: " + err.message);
          return callback(err.message, null);
        } else {
          return callback(null, JSON.parse(atob(settingsResults['content'])));
        }
      });
    }
  });
}
function setGlobalVariables(settingsObject) {
  globalShortcut.unregister(settingsObject.openClose);
  globalShortcut.unregister(settingsObject.newTask);
  globalShortcut.register(settingsObject.openClose, function () {
    if (remote.getCurrentWindow().isVisible()) {
      remote.getCurrentWindow().hide();
    } else {
      remote.getCurrentWindow().show();
    }
  });
  globalShortcut.register(settingsObject.newTask, function () {
      window.location.replace("./createTask.html");
    });
  globalShortcut.register(settingsObject.clockIn, function () {
    stackFunctions.clockIn(0);
  });
  globalShortcut.register(settingsObject.clockOut, function () {
    stackFunctions.clockOut();
  });

  globalShortcut.register('alt+o', function () {
    window.location.replace('./settings.html');
  });
    
}
var settings = {
  "openClose": "alt+z",
  "nextPageTask": "Alt+Down",
  "prevPageTask": "Alt+Up",
  "newTask": "alt+n",
  "clockIn": "alt+c",
  "clockOut": "alt+v"
};

$(document).ready(function () {
  
  getCreateSettings(function (err, result) {
    if (!err && result !== "success") {
      settings = result;
    }
    ls('settings', settings);
    console.log(result);
    setGlobalVariables(result);
    if (result.skipTutorial !== true) {

    }
  });
});