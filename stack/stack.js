const { BrowserWindow, globalShortcut} = require("electron").remote;
const path = require('path');
const $ = require('jquery');
var remote = require("electron").remote;
const electron = require('electron');
const base64 = require('base-64');
var ls = require('local-storage');
var githubFunctions = require('../helper/github_functions');
var {ipcRenderer} = require('electron');
var cryptoHelper = require('../helper/crypto_helper');

var window = BrowserWindow.getFocusedWindow();


$(document).ready(function() {
    window.transparent = true;
    var settings = {
        "open": "alt+z",
        "close": "alt+x"
    };
    githubFunctions.checkFileExists(ls('token'), ls('username'), ls('repoName'), "settings", function(err, contentArray){
        if (err == null && contentArray === ""){
            githubFunctions.createFile(ls('token'), ls('username'), ls('repoName'), "settings", base64.encode(JSON.stringify(settings)), function (err, result) {
                if (err) {
                    console.log(err);
                    $('#errorreponame').text("Cannot create a settings file in the repository: " + err);
                } else {
                    console.log('Successfuly saved settings.')
                }
            });
        } else {
            githubFunctions.getContent(ls('token'), ls('username'), contentArray, ls('repoName'), function(err, settingsResults){
                if (err){
                    console.log(err.message);
                } else {
                    settings = JSON.parse(base64.decode(settingsResults['content']));
                }
            });
        }
    });
    function setGlobalVariables(settingsObject){
        globalShortcut.register(settingsObject.open, function () {
            remote.getCurrentWindow().show();
        });
        globalShortcut.register(settingsObject.close, function () {
            remote.getCurrentWindow().hide();
        });
    }
    setGlobalVariables(settings);

    function createTask

});