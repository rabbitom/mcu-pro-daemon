var exec = require('child_process').exec;

function exec_promise(cmd, args) {
    return new Promise((resolve, reject)=>{
        var cmdLine = [cmd].concat(args).join(' ');
        exec(cmdLine, {}, (error, stdout, stderr)=>{
            if(error)
                reject(error);
            else
                resolve({
                    stdout: stdout,
                    stderr: stderr
                });
        }); 
    });
}

module.exports = exec_promise;