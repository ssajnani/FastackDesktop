
const { remote } = require('electron');
const { BrowserWindow } = remote;
const path = require('path')
const $ = require('jquery');
const electron = require('electron');
const base64 = require('base-64');
var ls = require('local-storage');
var githubFunctions = require('../helper/github_functions');
var conversions = require('../helper/conversions');
var randomBytes = require('randombytes');
var cryptoHelper = require('../helper/crypto_helper');


var window = BrowserWindow.getAllWindows()[0];


$(document).ready(function () {
  remote.getCurrentWindow().show();
  function repoAlreadyExists(){
    if (ls("repoName")){
      $("#encstackdata").hide();
      $("#reponame").hide();
      $("#checkBoxText").hide();
      $('#stackpass').css('opacity', 1);
      $('#stackpass').prop('disabled', false);
      $("#repoSubmit").val("Decrypt Repo");
      $("#works").hide();
    }
  }
  function handleInputAndHistory() {
    $("#reponame").val(ls("repoNameInput"));
    $("#encstackdata").prop("checked", ls("encstackdata"));
    $("#stackpass").val(ls("stackpass"));
    if ($("#encstackdata").prop("checked")) {
      $('#stackpass').css('opacity', 1);
      $('#stackpass').prop('disabled', false);
    } else {
      $('#stackpass').css('opacity', 0);
      $('#stackpass').prop('disabled', true);
    }
    $("#encstackdata").change(function () {
      if (this.checked) {
        $('#stackpass').css('opacity', 1);
        $('#stackpass').prop('disabled', false);
      } else {
        $('#stackpass').css('opacity', 0);
        $('#stackpass').prop('disabled', true);
      }
    });
  }

  handleInputAndHistory();
  repoAlreadyExists();
  $('#repoBack').on('click', function () {
    window.location.replace("./stack_name.html");
    console.log(ls("encstackdata"));
  });
  $('#works').on('click', function () {
    ls("repoNameInput", $("#reponame").val());
    ls("encstackdata", $("#encstackdata").prop("checked"));
    ls("stackpass", $("#stackpass").val());


    window.location.replace("./stack_info.html");

  });
  var id = null;
  function errorLog(message) {
    if (id){
      clearTimeout(id);
      id = null;
    }
    $('#errorDropdown').addClass("trigger");
    $('#errorDropdown').html('<img id="errorsign" src="../images/error.svg" alt="FaStack Logo" width="2000" height="2000"><b>Error</b>: ' + message);
    id = setTimeout(function () {
      $('#errorDropdown').removeClass("trigger");
    }, 4000);
  }


  if (ls('platform') === "Github"){
    $('#RepoNameSubmit').on('submit', function (evt) {
      evt.preventDefault();
      var repoName = $("#reponame")[0].value;
      $('#errorreponame').text("");
      var reRepo = /^[A-Za-z0-9_.-]+$/;
      if (repoName === "" && !ls("repoName")) {
        errorLog("Repository name cannot be empty.");
      } else if (!reRepo.test(repoName) && !ls("repoName")) {
        errorLog("Repository name can only contain: upper/lower case alphabets, underscores, periods, and dashes.");
      } else if (!ls("repoName") && $('#encstackdata').prop('checked') && $('#stackpass').val() === "") {
        errorLog("Stack password cannot be empty.");
      } else {
        var password = $('#stackpass').val();
        if (!ls("repoName")){
          githubFunctions.getPlan(ls('token'), function (err, plan) {
            if (plan.hasOwnProperty('private_repos')) {
              var privateRepo = false;
              if (plan.private_repos > 0) {
                privateRepo = true;
              }
              githubFunctions.makeRepo(ls('token'), repoName, privateRepo, function (err, result) {
                if (err) {
                  errorLog("Repository creation failed: Ensure a repository with the same name does not exist.");
                } else {
                  var fileContent = "";
                  if ($('#encstackdata').prop('checked')){
                    var salt = randomBytes(128).toString();
                    var randomString = cryptoHelper.generateRandomNumberOfLength(128);
                    var hashed = cryptoHelper.hashPassword(password, salt);
                    var saltEncrypt = cryptoHelper.encrypt(salt, password);
                    var randomNumHashEncrypt = cryptoHelper.encrypt(randomString + hashed.hash.toString(), password);
                    fileContent = saltEncrypt + "\n" + randomNumHashEncrypt;
                  }

                  githubFunctions.createFile(ls('token'), ls('username'), repoName, ls('username'), fileContent, function (err, result) {
                    if (err) {
                      $('#errorreponame').text("Cannot create an identifier file in the repository: " + err);
                    } else {
                      ls('stackPassword', password);
                      ls('repoName', repoName);
                      window.location.replace("./createTask.html");
                    }
                  });
                }
              });
            }
          });
        } else {
          var encryptSecrets = ls("encryptedSecret").split(/\n/);
          var salt = cryptoHelper.decrypt(encryptSecrets[0], password);
          var randHash = cryptoHelper.decrypt(encryptSecrets[1], password);
          var hashedPass = cryptoHelper.hashPassword(password, salt);
          if (randHash.endsWith(hashedPass.hash.toString())){
            ls('repoName', repoName);
            ls('stackPassword', password);
            window.location.replace("./createTask.html");
          } else {
            errorLog("An invalid password was provided.")
          }
        }

      }
    });
  } else if (ls('platform') === "Dropbox"){

  }

});

