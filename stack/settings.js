var stackFunctions = require('../helper/stack_functions');

function updateSettings(callback){
  githubFunctions.createUpdateFile(ls('token'), ls('username'), ls('repoName'), "settings", JSON.stringify(ls('settings')), function (err, result) {
    if (err) {
      $('#errorreponame').text("Cannot create a settings file in the repository: " + err.message);
      return callback(err.message, null)
    } else {
      return callback(null, "success")
    }
  });
}

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
  globalShortcut.unregisterAll();
  globalShortcut.register(settingsObject.OpenCloseWindow, function () {
    if (remote.getCurrentWindow().isVisible()) {
      remote.getCurrentWindow().hide();
    } else {
      remote.getCurrentWindow().show();
    }
  });
  globalShortcut.register(settingsObject.NewTask, function () {
      window.location.replace("./createTask.html");
    });
  globalShortcut.register(settingsObject.ClockIn, function () {
    stackFunctions.clockIn(0);
  });
  globalShortcut.register(settingsObject.ClockOut, function () {
    stackFunctions.clockOut();
  });

  globalShortcut.register(settingsObject.Settings, function () {
    window.location.replace('./settings.html');
  });
    
}
var settings = {
  "OpenCloseWindow": "alt+z",
  "NextPageTask": "Alt+Down",
  "PreviousPageTask": "Alt+Up",
  "NewTask": "alt+n",
  "ClockIn": "alt+c",
  "ClockOut": "alt+v", 
  "Settings": "alt+s"
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
