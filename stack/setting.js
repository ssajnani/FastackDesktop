

$(document).ready(function () {
    function keyDown(shortcut) {
        return function curried_func(e) {
            var settings = ls('settings');
            if (e.key != "Escape"){

                if ($('#' + shortcut).val() == "Listening"){
                    $('#' + shortcut).val(e.key);
                    settings[shortcut] = e.key;
                } else {
                    if (!$('#' + shortcut).val().split('+').includes(e.key)){
                        var sc = $('#' + shortcut).val() + "+" + e.key;
                        $('#' + shortcut).val(sc);
                        settings[shortcut] = sc;
                    }
                }
                ls('settings', settings);
            } else {
                window.removeEventListener('keydown', keyDown(shortcut));
            }
        }
    }
    getCreateSettings(function(err, result){
        $.each(ls('settings'), function(i, val){

            $(".tab").append(
                `<div class="taskInput">
                        <label for="tname">`+ i.match(/[A-Z][a-z]+/g).map(x => x).join(' ').trim() +`</label><br><br>
                        <input readonly id="` + i +`" type="text" name="openClose" value="`+val+`">
                    </div><br></br>`
            );
            $('#' + i).focusin(function(){
                $('#' + i).val('Listening');
                var curried = keyDown(i);
                window.addEventListener('keydown', curried);
                $('#' + i).focusout(function(){
                    if($('#' + i).val() == "Listening"){
                        $('#' + i).val(result[i]);
                    }
                    window.removeEventListener('keydown', curried);
                });
            });
            
          });
        
    });
    $('#updateSettings').on('submit', function(){
        updateSettings(function(err, result){
            if(err){
                console.log(err);
            }
        })
        window.location.replace('./stack.html');
    });
  
});