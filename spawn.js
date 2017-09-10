const spawn = require('child_process').spawn;

function spawn_callback(cmd, args, callbacks) {
    const ls = spawn(cmd, args);
    if(callbacks.onOutput)
        ls.stdout.on('data', callbacks.onOutput);
    if(callbacks.onError)
        ls.stderr.on('data', callbacks.onError);
    if(callbacks.onClose)
        ls.on('close', callbacks.onClose);
}

module.exports = spawn_callback;