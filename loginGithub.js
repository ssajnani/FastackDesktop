
const { remote } = require('electron');
const { BrowserWindow } = remote;
const path = require('path');
const $ = require('jquery');
const electron = require('electron');
const base64 = require('base-64');
var githubFunctions = require('./helper/github_functions');
var ls = require('local-storage');
var cryptoHelper = require('./helper/crypto_helper');
var randomBytes = require('randombytes');
var TOKEN_URL = 'https://fastack.herokuapp.com/authenticate/';

var window = remote.getCurrentWindow();

ls("GITHUB_CLIENT_ID", '442dbe2e6a65ceb60986');

const AUTH_URL_PATH = 'https://api.github.com/authorizations';
var TOKEN = "";





$(document).ready(function() {


    $('#login').on('submit', function(evt) {
        evt.preventDefault();
        var btn = $(this).find("input[type=submit]:focus" );
        if (btn[0].id === "github"){
          var authWindow = new BrowserWindow({ width: 800, height: 800, show: false, 'node-integration': false });
          var githubUrl = 'https://github.com/login/oauth/authorize?';
          var authUrl = githubUrl + 'client_id=' + ls('GITHUB_CLIENT_ID');
          authWindow.loadURL(authUrl);
          remote.getCurrentWindow().hide();
          authWindow.show();
          runOAuthWindowFunctions(authWindow);


        };
    });



    function handleCallback (url) {
      var raw_code = /code=([^&]*)/.exec(url) || null;
      var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
      var error = /\?error=(.+)$/.exec(url);

      loggedIn = true;
      // If there is a code, proceed to get token from github
      if (code) {
        getToken(code, function(result){

          ls("token", result);
          githubFunctions.getUsername(ls("token"), function(err, username){
            if (err){
              console.log(err);
            } else {
              ls("username", username);
              ls('repoName', "");
              githubFunctions.checkFastackRepoExists(ls('token'), ls('username'), function(err, result){
                if (result[0]){
                  if (result[1]){
                    console.log(result[1]);
                    ls('repoName', result[0]);
                    ls('encryptedSecret', atob(result[1]));
                    window.location.replace("./stack/stack_name.html");
                  } else {
                    window.location.replace("./stack/stack.html");
                  }
                } else {
                  ls("reponame", "");
                  ls("encstackdata", false);
                  ls("stackpass", "");
                  window.location.replace("./stack/stack_name.html");
                }
              });
            }
          });
        });
        return;
      } else if (error) {
        alert('Oops! Something went wrong and we couldn\'t' +
          'log you in using Github. Please try again.');
        return;
      }
    }

    function getToken(code, callback){
      $.getJSON(TOKEN_URL+code, function(data) {
        return callback(data.token);
      });
    }

    // Handle the response from GitHub
    function runOAuthWindowFunctions(window){
      var loggedIn = false;
      window.webContents.on('will-navigate', function (event, url) {
        window.hide();
        loggedIn = true;
        handleCallback(url);
      });

      window.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
        handleCallback(newUrl);
      });

      // Reset the authWindow on close
      window.on('close', function() {
        if(!loggedIn){
          remote.getCurrentWindow().show();
        }
      }, false);
    }

});
