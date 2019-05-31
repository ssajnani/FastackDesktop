const base64 = require('base-64');
var ls = require('local-storage');
var cryptoHelper = require('./crypto_helper');

exports.createTask = function(taskName, startDate, creationDate, completionDate, timeHours, timeMins, priority, description, tags, notes) {
    var taskObject = {
        taskName: taskName,
        startDate: startDate,
        creationDate: creationDate,
        completionDate: completionDate,
        timeHours: timeHours,
        timeMins: timeMins,
        priority: priority,
        description: description,
        tags: tags,
        notes: notes
    }
    return taskObject;
}

exports.encryptTask = function(task){
    var encTask = {};
    if (!ls('key')) {
        return task;
    }
    for (var key in task) {
        console.log(task[key]);
        console.log(ls('key'));
        var encrypted = cryptoHelper.encrypt(task[key], ls('key'));
        encTask[key] = encrypted;
    }
    return encTask;   
}

exports.generateTranslate = function(stack_length, index) {
    var height = 90/(stack_length-1);
    var translate = "height: 50%;";
    var overhead = -40/(stack_length-1);
    if (stack_length > 6){
        height = 90/5;
        overhead = -40/5;
    }
    if (index > 0){
        translate = "height: " + height + "%; top: " + overhead*index + "vh; z-index: " + -index + ";";
    }
    translate = translate + " background: #00A89D; border:5px solid white;";
    return translate;
}

exports.getRandomTheme = function() {
    let utf8Encode = new TextEncoder();
    var bytesArray = utf8Encode.encode('{"input": [[0,168,157],[100,129,16],"N",[0,0,0],"N"], "model":"ui"}');
    $.ajax({
        url: 'http://colormind.io/api/',
        type: 'POST',
        contentType: 'application/octet-stream',  
        data: bytesArray,
        async: false,
        processData: false,
        success: function(result){
            
        }, error: function(error){
            console.log(error);
        }
        });
}

exports.generateTaskHTML = function(index, translate, decrypted) {
    return '<div id="t' + index + '" class="task" style="' + translate + '">' +
            `<table ${index!=0?"style='position:absolute;bottom:10%;'":""}>
            <tr>
              <th style="text-align:left;"><h3>${decrypted['taskName'].length>15?decrypted['taskName'].slice(0,15)+"...":decrypted['taskName']}</h3></th>
              <th><h3>active</h3></th>            
            </tr>
            ${index==0?`<tr>
              <td>Start By: </td>
              <td>${decrypted['startDate']}</td>
            </tr>
            <tr>
              <td>Complete By: </td>
              <td>${decrypted['completionDate']}</td>
            </tr>
            <tr>
              <td>Created At: </td>
              <td>${decrypted['creationDate']}<br></td>
            </tr>
            <tr>
              <td>Duration: </td>
              <td>${decrypted['timeHours']} hours ${decrypted['timeMins']} mins<br></td>
            </tr>
            <tr>
              <td>Priority: </td>
              <td>${decrypted['priority']}<br></td>
            </tr>
            <tr>
              <td>Tags: </td>
              <td>${decrypted['tags']}<br></td>
            </tr>
            </table>
            </div>`:'</div>'}`;
}

exports.decryptTask = function(task){
    var decTask = {};
    if (!ls('key')) {
        return task;
    }
    for (var key in task) {
        var decrypted = cryptoHelper.decrypt(task[key], ls('key'));
        decTask[key] = decrypted;
    }      
    return decTask;   
}