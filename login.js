
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

$(document).ready(function() {
    $('#loginGithub').on('submit', function(evt){
        evt.preventDefault();
        var inputs = $("form :input").serializeArray();
        var username = inputs[0].value;
        var password = inputs[1].value;
        if (username === ""){
            $('#errorusername').text("Username cannot be empty.");
        } else {
            $('#errorusername').text("")
        }
        if (password === ""){
            $('#errorpassword').text("Password cannot be empty.");
            $('#errorpassword').css("font-size", "16px");
        } else {
            $('#errorpassword').text("")
            $('#errorpassword').css("font-size", "16px");
        }
        if (username !== "" && password !== "") {
            login(username, password, function (error, result) {
                if (error) {
                    $('#errorpassword').text("Error: " + error);
                    $('#errorpassword').css("font-size", "20px");
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
