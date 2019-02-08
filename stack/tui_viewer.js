const {remote} = require('electron');
const {BrowserWindow, globalShortcut} = remote;
const path = require('path');
const $ = require('jquery');
var Editor = require('tui-editor');
const electron = require('electron');
const base64 = require('base-64');
var ls = require('local-storage')
var ipcRenderer = require('electron').ipcRenderer;
var githubFunctions = require('../helper/github_functions');
var cryptoHelper = require('../helper/crypto_helper');
require('tui-editor/dist/tui-editor-extChart');
require('tui-editor/dist/tui-editor-extUML');

var window = BrowserWindow.getFocusedWindow();


$(document).ready(function () {
  var editor = new Editor({
    el: document.querySelector('#editSectionViewer'),
    width: '300',
    height: '500',
    exts: ['scrollSync', 'uml', {
      name: 'chart',
      maxWidth: 200,
      maxHeight: 300
    }, 'mark', 'table', 'taskCounter']
  });
  setTimeout(function(){
    $("button:contains('Preview')").click();
  }, 1000);

  ipcRenderer.on('get_data_write', function(event, store){
    editor.setValue(store);
  })
});