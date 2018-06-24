const { BrowserWindow, globalShortcut } = require("electron").remote;
const path = require('path');
const $ = require('jquery');
var remote = require("electron").remote;
const electron = require('electron');
const base64 = require('base-64');
var ls = require('local-storage');
var githubFunctions = require('../helper/github_functions');
var { ipcRenderer } = require('electron').remote;
var cryptoHelper = require('../helper/crypto_helper');

var window = BrowserWindow.getFocusedWindow();


$(document).ready(function() {
    $("body").css("background-color", "transparent");
    function getCreateSettings(callback) {
        githubFunctions.checkFileExists(ls('token'), ls('username'), ls('repoName'), "", "settings", function (err, contentArray) {
            if (err == null && contentArray === "") {
                githubFunctions.createFile(ls('token'), ls('username'), ls('repoName'), "settings", base64.encode(JSON.stringify(settings)), function (err, result) {
                    if (err) {
                        $('#errorreponame').text("Cannot create a settings file in the repository: " + err.message);
                        return callback(err.message, null)
                    } else {
                        return callback(null, "success")
                    }
                });
            } else {
                githubFunctions.getContent(ls('token'), ls('username'), contentArray, ls('repoName'), function (err, settingsResults) {
                    if (err) {
                        $('#errorreponame').text("Cannot get a settings file from the repository: " + err.message)
                        return callback (err.message, null);
                    } else {
                        return callback(null, JSON.parse(base64.decode(settingsResults['content'])));
                    }
                });
            }
        });
    }

    function lookForStack(callback) {
        githubFunctions.getContent(ls('token'), ls('username'), "", ls('repoName'), function(err, contentArray){
            if (err){
                return callback(err, null);
            }
            largestYear = 0
            for (var fileCount = 0; fileCount < contentArray.length; fileCount++) {
                var fourDigits = /^\d{4}$/;
                if (fourDigits.test(contentArray[fileCount].name)) {
                    if (Integer.parseInt(contentArray[fileCount].name) > largestYear) {
                        largestYear = Integer.parseInt(contentArray[fileCount].name)
                    }
                }
            }
            if (largestYear === 0){
                return callback(null, null);
            }
            githubFunctions.getContent(ls('token'), ls('username'), Integer.toString(largestYear), ls('repoName'), function(err, contentArray) {
                if (err){
                    return callback(err, null);
                }
                largestMonth = 0
                for (var fileCount = 0; fileCount < contentArray.length; fileCount++) {
                    var twoDigits = /^\d{2}$/;
                    if (twoDigits.test(contentArray[fileCount].name)) {
                        if (Integer.parseInt(contentArray[fileCount].name) > largestMonth) {
                            largestMonth = Integer.parseInt(contentArray[fileCount].name)
                        }
                    }
                }
                if (largestMonth === 0){
                    return callback(null, null);
                }
                githubFunctions.getContent(ls('token'), ls('username'), Integer.toString(largestYear) + "/" + Integer.toString(largestMonth), ls('repoName'), function(err, contentArray) {
                    if (err) {
                        return callback(err, null);
                    }
                    largestDay = 0
                    for (var fileCount = 0; fileCount < contentArray.length; fileCount++) {
                        var twoDigits = /^\d{2}$/;
                        if (twoDigits.test(contentArray[fileCount].name)) {
                            if (Integer.parseInt(contentArray[fileCount].name) > largestDay) {
                                largestDay = Integer.parseInt(contentArray[fileCount].name)
                            }
                        }
                    }
                    if (largestDay === 0){
                        return callback(null, null);
                    } else {
                        githubFunctions.getContent(ls('token'), ls('username'), Integer.toString(largestYear) + "/" + Integer.toString(largestMonth) + "/" + Integer.toString(largestDay), ls('repoName'), function (err, results) {
                            if (err) {
                                return callback(err, null);
                            } else {
                                stack = JSON.parse(base64.decode(results['content']));
                                return callback(null, stack);
                            }
                        });
                    }
                });
            });
        });
    }

    function setGlobalVariables(settingsObject){
        globalShortcut.register(settingsObject.openClose, function () {
            if (remote.getCurrentWindow().isVisible()){
                remote.getCurrentWindow().hide();
            } else {
                remote.getCurrentWindow().show();
            }
        });
    }
    function fixStepIndicator(n) {
        // This function removes the "active" class of all steps...
        var i, x = document.getElementsByClassName("step");
        for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
        }
        //... and adds the "active" class on the current step:
        x[n].className += " active";
    }

    //function createTask
    function createTask(stack){
        stack
    }

    $('#tdate').bind('input propertychange', function() {
        console.log($('#tdate').val());
    });

    let screen = electron.screen;
    let displays = screen.getAllDisplays();
    var width = 0;
    for (var displayInd = 0; displayInd < displays.length; displayInd++) {
        width = width + displays[displayInd].bounds.width;
    }
    window.resizeTo(300, 600);

    var stack = [];
    lookForStack(function(err, stackValue){
        if (err){
            $('#errorreponame').text("Cannot get the current stack from the repository: " + err.message);
        } else if (stackValue){
            stack = stackValue;
        }
        if (stack.length === 0){
            $('#createtask').on('click', function() {
                console.log("GOTHERE");
            });
        } else {

        }

    });
    var settings = {
        "openClose": "alt+z",
        "nextPageTask": "Alt+Down",
        "prevPageTask": "Alt+Up"
    };
    getCreateSettings(function(err, result){
        if (!err && result !== "success") {
            settings = result;
        }
        setGlobalVariables(result);
        if (result.skipTutorial !== true){

        }
    });

    var currentTab = 0; // Current tab is set to be the first tab (0)
    showTab(currentTab); // Display the crurrent tab

    function showTab(n) {
        // This function will display the specified tab of the form...
        var x = document.getElementsByClassName("tab");
        x[n].style.display = "block";
        //... and fix the Previous/Next buttons:
        if (n === 0) {
            if (globalShortcut.isRegistered(settings.prevPageTask)) {
                globalShortcut.unregister(settings.prevPageTask);
            }
            $('#bottomText').html("<i class=\"arrow down\"></i> [" + settings.nextPageTask + "] ");
            globalShortcut.register(settings.nextPageTask, function () {
                nextPrev(1)
            });
        } else if (n === (x.length - 1)) {
            $("#bottomText").html("<i class=\"arrow up\"></i> [" + settings.prevPageTask + "] ");
            if (globalShortcut.isRegistered(settings.nextPageTask)) {
                globalShortcut.unregister(settings.nextPageTask);
            }
            if (!globalShortcut.isRegistered(settings.prevPageTask)) {
                globalShortcut.register(settings.prevPageTask, function () {
                    nextPrev(-1)
                });
            }
        } else {
            $("#bottomText").html("<i class=\"arrow down\"></i> [" + settings.nextPageTask + "]  <i class=\"arrow up\"></i> [" + settings.prevPageTask + "] ");
            if (!(globalShortcut.isRegistered(settings.prevPageTask))) {
                globalShortcut.register(settings.prevPageTask, function () {
                    nextPrev(-1)
                });
            }
            if (!(globalShortcut.isRegistered(settings.nextPageTask))) {
                globalShortcut.register(settings.nextPageTask, function () {
                    nextPrev(1)
                });
            }
        }
        //... and run a function that will display the correct step indicator:
        fixStepIndicator(n)
    }

    function nextPrev(n) {
        // This function will figure out which tab to display
        var x = document.getElementsByClassName("tab");
        // Exit the function if any field in the current tab is invalid:
        //if (n == 1 && !validateForm()) return false;
        // Hide the current tab:
        x[currentTab].style.display = "none";
        // Increase or decrease the current tab by 1:
        currentTab = currentTab + n;
        // if you have reached the end of the form...
        if (currentTab >= x.length) {
            // ... the form gets submitted:
            document.getElementById("regForm").submit();
            return false;
        }
        // Otherwise, display the correct tab:
        showTab(currentTab);
    }

    function validateForm() {
        // This function deals with validation of the form fields
        var x, y, i, valid = true;
        x = document.getElementsByClassName("tab");
        y = x[currentTab].getElementsByTagName("input");
        // A loop that checks every input field in the current tab:
        for (i = 0; i < y.length; i++) {
            // If a field is empty...
            if (y[i].value == "") {
                // add an "invalid" class to the field:
                y[i].className += " invalid";
                // and set the current valid status to false
                valid = false;
            }
        }
        // If the valid status is true, mark the step as finished and valid:
        if (valid) {
            document.getElementsByClassName("step")[currentTab].className += " finish";
        }
        return valid; // return the valid status
    }

});