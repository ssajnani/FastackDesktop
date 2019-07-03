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
  console.log(settingsObject);
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
    
  globalShortcut.register(settingsObject.PopTask, function () {
    var stack = ls('stack');
    if (stack['incomplete'].length > 0){
    $(".task").first().hide("drop", {direction: "up"}, 1000);
      setTimeout(function(){
        stack['complete'].push(stack['incomplete'][0]);
        stack['incomplete'].shift(); 
        ls('stack', stack);
        $('.s1').empty();
        $('.s1').append(stackFunctions.generateFullStackHTML());
        if (ls('stack')['incomplete'].length == 0){
          window.location.replace('./createTask.html');
        }  
      }, 1000);
      
    }
  });
    
}
var settings = {
  "OpenCloseWindow": "alt+z",
  "NextPageTask": "Alt+Down",
  "PreviousPageTask": "Alt+Up",
  "NewTask": "alt+n",
  "ClockIn": "alt+c",
  "ClockOut": "alt+v", 
  "Settings": "alt+s",
  "PopTask": "alt+p"
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
