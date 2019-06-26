const ioHook = require('iohook');


exports.startTextAnalyzer = function(){
    ioHook.on("keyup", event => {
    console.log(event); // {keychar: 'f', keycode: 19, rawcode: 15, type: 'keup'}
    });

    ioHook.start();
}