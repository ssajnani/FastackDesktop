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
//<th><h2>${decrypted['taskName'].length>12?decrypted['taskName'].slice(0,12)+"...":decrypted['taskName']}</h2></th>
exports.generateTaskHTML = function(index, translate, decrypted) {
    return '<div id="t' + index + '" class="task" style="' + translate + '">' +
            `<table align="center" ${index!=0?"style='position:absolute;bottom:10%;left:5%;'":""}>
            <tr>
              <th>${decrypted['taskName'].length>12?'<marquee style="width:80%" scrollamount="5" behavior="scroll" direction="left"><h2>'+decrypted['taskName']+'</h2></marquee>':'<h2>'+decrypted['taskName']+'</h2>'}</th>
              <th style="text-align:right;"><h2>active</h2></th>            
            </tr>
            ${index==0?`
            <tr>
              <th>From: </th>
              <td>${new Date(decrypted['startDate']).toLocaleString().replace(/:00 |,/gi, '')}</td>
            </tr>
            <tr>
              <th>To: </th>
              <td>${new Date(decrypted['completionDate']).toLocaleString().replace(/:00 |,/gi, '')}</td>
            </tr>
            <tr>
              <th>Duration: </th>
              <td>${decrypted['timeHours']} hours ${decrypted['timeMins']} mins<br></td>
            </tr>
            <tr>
              <th>Priority: </th>
              <td>${decrypted['priority']}<br></td>
            </tr>
            <tr>
              <th>Tags: </th>
              <td>${decrypted['tags']}<br></td>
            </tr>
            <tr>
              <th>Created At: </th>
              <td>${new Date(decrypted['creationDate']).toLocaleString().replace(/:00 |,/gi, '')}<br></td>
            </tr>
            </table>
            </div>`:'</table></div>'}`;
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