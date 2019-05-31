const {remote} = require('electron');
const {BrowserWindow, globalShortcut} = remote;
const path = require('path');
const $ = require('jquery');
var Editor = require('tui-editor');
const electron = require('electron');
const base64 = require('base-64');
var ls = require('local-storage');
var githubFunctions = require('../helper/github_functions');
var {ipcRenderer} = require('electron').remote;
var cryptoHelper = require('../helper/crypto_helper');
var conversions = require('../helper/conversions');
var stackFunctions = require('../helper/stack_functions');
require('tui-editor/dist/tui-editor-extChart');
require('tui-editor/dist/tui-editor-extUML');

var window = BrowserWindow.getFocusedWindow();


$(document).ready(function () {
    var stack_length = ls('stack').length;
    for (var index = 0; index < stack_length; index++){
        var translate = stackFunctions.generateTranslate(stack_length, index);
        // Since we deal with Firefox and Chrome only
        var decrypted = stackFunctions.decryptTask(ls('stack')[index]);
        $(".s1").append(stackFunctions.generateTaskHTML(index, translate, decrypted));

        

    }
});