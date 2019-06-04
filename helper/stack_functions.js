const base64 = require('base-64');
var ls = require('local-storage');
var cryptoHelper = require('./crypto_helper');

exports.createTask = function(taskName, startDate, creationDate, completionDate, ignoreDates, timeHours, timeMins, priority, description, tags, notes) {
    var taskObject = {
        taskName: taskName,
        startDate: startDate,
        creationDate: creationDate,
        completionDate: completionDate,
        ignoreDates: ignoreDates,
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
        var encrypted = cryptoHelper.encrypt(task[key].toString(), ls('key'));
        encTask[key] = encrypted;
    }
    return encTask;   
}

exports.generateTranslate = function(stack_length, index) {
    var height = 90/(stack_length-1);
    var overhead = -40/(stack_length-1);
    if (stack_length > 6){
        height = 90/5;
        overhead = -40/5;
    }
    var translate = index>0?"height: " + height + "%; transform: translateY(" + overhead*index + "vh); ":"height: 50%;";
    translate = translate + " z-index: " + (stack_length-index) + ";";
    overhead = overhead + 2/(stack_length-1);
    return [translate, overhead];
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
//+ </h2>':'<h2>'+decrypted['taskName']+'
//<th><h2>${decrypted['taskName'].length>12?decrypted['taskName'].slice(0,12)+"...":decrypted['taskName']}</h2></th>
exports.generateTaskHTML = function(index, translate, decrypted,overhead) {
    return '<div id="t' + index + '" class="task taskName" style="' + translate + '">' +
            `<table align="center" ${index!=0?"style='position:absolute; top: "+ -overhead*1.1+"vh;'":""}>
            <tr>
              <th><h2 class="header">${decrypted['taskName']}</h2></th>
              <th style="text-align:right;"><h2>active</h2></th>            
            </tr>
            ${!decrypted['ignoreDates']?
            `<tr>
              <th>From: </th>
              <td>${new Date(decrypted['startDate']).toLocaleString().replace(/:00 |,/gi, '')}</td>
            </tr>
            <tr>
              <th>To: </th>
              <td>${new Date(decrypted['completionDate']).toLocaleString().replace(/:00 |,/gi, '')}</td>
            </tr>`:``
            }
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
            </div>`;
}

exports.generateFullStackHTML = function(){
    var return_val = "";
    var stack_length = ls('stack').length;
    for (var index = 0; index < stack_length; index++){
        var result = this.generateTranslate(stack_length, index);
        var translate = result[0];
        var overhead = result[1];
        // Since we deal with Firefox and Chrome only
        var decrypted = this.decryptTask(ls('stack')[index]);
        return_val += this.generateTaskHTML(index, translate, decrypted, overhead);
    }
    return return_val;
}


exports.displayStatus = function(){
    var return_val = "";
    var stack_length = ls('stack').length;
    for (var index = 0; index < stack_length; index++){
        var result = this.generateTranslate(stack_length, index);
        var translate = result[0];
        var overhead = result[1];
        // Since we deal with Firefox and Chrome only
        var decrypted = this.decryptTask(ls('stack')[index]);
        return_val += this.generateTaskHTML(index, translate, decrypted, overhead);
    }
    return return_val;
}


exports.decryptTask = function(task){
    var decTask = {};
    if (!ls('key')) {
        return task;
    }
    for (var key in task) {
        var decrypted = cryptoHelper.decrypt(task[key], ls('key'));
        if (key == "ignoreDates"){
            decTask[key] = (decrypted === 'true');
        } else {
            decTask[key] = decrypted;
        }
        
    }      
    return decTask;   
}