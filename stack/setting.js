

$(document).ready(function () {
    function openClose(e) {
        if (e.key != "Escape"){
            console.log(e);
            if ($('#openClose').val() == "Listening"){
                console.log('here');
                $('#openClose').val(e.key);
            } else {
                var prev = $('#openClose').val();
                if (prev[-1] == prev[-2]){
                    prev = prev.slice(0, -1);
                }
                console.log(e.key);
                $('#openClose').val(prev + "+" + e.key);
            }
        } else {
            window.removeEventListener('keydown');
        }
      }
    getCreateSettings(function(err, result){
        $('#openClose').val(result.openClose);
        $('#openClose').focusin(function(){
            $('#openClose').val('Listening');
            window.addEventListener('keydown', openClose);
        });
    });
    
  
});