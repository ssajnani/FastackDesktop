const { BrowserWindow, globalShortcut} = require("electron").remote;
const path = require('path');
const $ = require('jquery');
var remote = require("electron").remote;
const electron = require('electron');
const base64 = require('base-64');
var ls = require('local-storage');
var githubFunctions = require('../helper/github_functions');
var {ipcRenderer} = require('electron');

var window = BrowserWindow.getFocusedWindow();


$(document).ready(function() {
    var newSet = "ctrl+l"
    globalShortcut.register(newSet, function () {
        remote.getCurrentWindow().show();
    });
});