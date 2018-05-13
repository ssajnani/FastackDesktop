
const { BrowserWindow } = require("electron").remote;
const path = require('path')
const $ = require('jquery');
const electron = require('electron');
const base64 = require('base-64');
var ls = require('local-storage');
var githubFunctions = require('../helper/github_functions');


var window = BrowserWindow.getAllWindows()[0];


$(document).ready(function() {
    $('#createrepo').on('click', function() {
        var repoName = $("#reponame")[0].value;
        $('#errorreponame').text("");
        var reRepo = /^[A-Za-z0-9_.-]+$/;
        if (repoName === "") {
            $('#errorreponame').text("Repository name cannot be empty.");
        } else if (! reRepo.test(repoName)) {
            $('#errorreponame').text("Repository name can only contain the following characters: upper/lower case alphabets, underscores, periods, and dashes.");
        } else {
            githubFunctions.getPlan(ls('token'), function (err, plan) {
                if (plan.hasOwnProperty('private_repos')) {
                    var privateRepo = false;
                    if (plan.private_repos > 0) {
                        privateRepo = true;
                    }
                    githubFunctions.makeRepo(ls('token'), repoName, privateRepo, function (err, result) {
                        if (err) {
                            $('#errorreponame').text("Cannot make a private repository: " + err);
                        } else {
                            githubFunctions.createFile(ls('token'), ls('username'), repoName, ls('identifierFile'), ls('saltncrypt'), function (err, result) {
                                if (err) {
                                    $('#errorreponame').text("Cannot create an identifier file in the repository: " + err);
                                } else {
                                    window.location.replace("./stack.html");
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    $('#works').on('click', function() {
        window.location.replace("./stack_info.html");
    });
    $('#repoBack').on('click', function() {
        window.location.replace("./stack_name.html");
    });
});

