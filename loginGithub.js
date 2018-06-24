
const { BrowserWindow } = require("electron").remote;
const path = require('path');
const $ = require('jquery');
const electron = require('electron');
const base64 = require('base-64');
var githubFunctions = require('./helper/github_functions');
var ls = require('local-storage');
var cryptoHelper = require('./helper/crypto_helper');
var randomBytes = require('randombytes');

var window = BrowserWindow.getAllWindows()[0];

ls("GITHUB_CLIENT_ID", '442dbe2e6a65ceb60986')
ls("GITHUB_CLIENT_SECRET", '09dbd96778555bde134c32b1b7699016f39fc27c')

const AUTH_URL_PATH = 'https://api.github.com/authorizations';
var TOKEN = "";

function login(name, pwd, callback) {
    const bytes = name.trim() + ':' + pwd.trim();
    const encoded = base64.encode(bytes);
    return fetch(AUTH_URL_PATH, {
        method: 'POST',
        headers: {
            'Authorization' : 'Basic ' + encoded,
            'User-Agent': 'GitHub Issue Browser',
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            'client_id': ls('GITHUB_CLIENT_ID'),
            'client_secret': ls('GITHUB_CLIENT_SECRET'),
            'scopes': ['user', 'repo'],
            'note': 'not abuse'
        })
    })
        .then((response) => {
            const isValid = response.status < 400;
            const body = response._bodyInit;
            return response.json().then((json) => {
                if (isValid) {
                    ls("username", name);
                    ls('token', json.token);
                    callback(null, "Login Successful");
                } else {
                    callback(json.message, null);
                }
            });
        });
}

function errorLog(message){
    $('#errorpassword').toggleClass("trigger");
    $('#errorpassword').html('<img id="errorsign" src="./images/error.svg" alt="FaStack Logo" width="2000" height="2000"><b>Error</b>: ' + message);
    var id = setTimeout(function(){
        $('#errorpassword').removeClass("trigger");
    }, 2000);
    return id;
}

$(document).ready(function() {
    $('#login').on('submit', function(evt) {
        evt.preventDefault();
        var btn = $(this).find("input[type=submit]:focus" );
        if (btn[0].id === "github"){
            $("#logoHome").replaceWith("<img id=\"logoHome\" src=\"./images/git_icon.svg\" alt=\"FaStack Logo\" width=\"100\" height=\"100\">");
            $("#login").replaceWith("<form id=\"loginGithub\">\n" +
                "            <center><input id=\"topInput\" type=\"text\" placeholder=\"Username\" name=\"username\"></center><br>\n" +
                "            <center><span id=\"errorusername\">    </span></center>\n" +
                "            <center><input type=\"password\" placeholder=\"Password\" name=\"password\"></center><br>\n" +
                "            <center><input type=\"submit\" id=\"login\" value=\"Login With Github\"></center>\n" +
                "        </form>");
        };
        var timeoutId = "";
        $('#loginGithub').on('submit', function(evt){
            clearTimeout(timeoutId);
            evt.preventDefault();
            var inputs = $("form :input").serializeArray();
            var username = inputs[0].value;
            var password = inputs[1].value;
            var emptyUser = false;
            var emptyPass = false;
            if (username === ""){
                emptyUser = true;
            }
            if (password === ""){
                emptyPass = true;
            }

            if (emptyUser){
                if (emptyPass){
                    timeoutId = errorLog("Username and password fields cannot be empty");
                } else {
                    timeoutId = errorLog("Username field cannot be empty");
                }
            } else {
                if (emptyPass){
                    timeoutId = errorLog("Password field cannot be empty");
                } else {
                    $('#errorpassword').text("");
                    $('#errorpassword').removeClass("trigger");
                }
            }
            if (username !== "" && password !== "") {
                login(username, password, function (error, result) {
                    if (error) {
                        if (error.indexOf("Bad credentials") !== -1){
                            timeoutId = errorLog("Either the username or password were incorrect");
                        } else {
                            timeoutId = errorLog(error);
                        }

                    } else {
                        githubFunctions.checkFastackRepoExists(ls('token'), username, password, username, function(err, result){
                            if (result[0] !== ""){
                                var hashed = cryptoHelper.hashPassword(password, result[1]);
                                ls('hashed_pwd', hashed.hash.toString());
                                ls('repoName', result[0]);
                                window.location.replace("./stack/stack.html");
                            } else {
                                var salt = randomBytes(128).toString();
                                var hashed = cryptoHelper.hashPassword(password, salt);
                                ls('saltncrypt', cryptoHelper.encrypt(salt, password));
                                ls('hashed_pwd', hashed.hash.toString());
                                window.location.replace("./stack/stack_name.html");
                            }
                        });
                    }
                });
            }
        });
    });
});
