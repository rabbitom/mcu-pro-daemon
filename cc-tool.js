var exec = require('./exec.js');
var spawn = require('./spawn.js');

const cctoolcmd = 'cc-tool.run';

class cctool {

    constructor() {
    }

    getStatus() {
        return exec(cctoolcmd, ['-a']).then(result => {
            var text = result.stdout;
            var lines = text.split('\n');
            var object = {};
            for(var line of lines) {
                var parts = line.split(', ');
                for(var part of parts) {
                    var kv = cctool.parseKeyValue(part);
                    if(kv) {
                        object[kv.key] = kv.value;
                    }
                }
            }
            return Promise.resolve(object);
        });
    }

    static parseKeyValue(str) {
        var parts = str.match(/^\s*(.*): (.*)$/);
        if((parts != null) && (parts.length == 3)) {
            return {
                key: parts[1],
                value: parts[2]
            };
        }
        else
            return null;
    }

    static parseProgramArgs(configs) {
        var args = ['-v', '-e', '-w', '../' + configs.file];
        if(configs.mac)
            args = args.concat(['-b', configs.mac]);
        return args;
    }

    // programLive(configs, callbacks) {
    //     var args = cctool.parseProgramArgs(configs);
    //     spawn(cctoolcmd, args, callbacks);
    // }

    // program(configs) {
    //     var args = cctool.parseProgramArgs(configs);
    //     return exec(cctoolcmd, args).then(result=>{
    //         console.log('stdout: ' + resut.stdout);
    //         return Promise.resolve(result.stdout);
    //     }, (error)=>{
    //         return Promise.reject(error.toString());
    //     })
    // }

    program(configs) {
        var args = cctool.parseProgramArgs(configs);
        return new Promise((resolve, reject)=>{
            var output = '';
            spawn(cctoolcmd, args, {
                onOutput: data=>{
                    output += data.toString();
                },
                onClose: code=>{
                    console.log(output);//output logged is merged, but the response string is not, length of output is 6262
                    if(code == 0)
                        resolve(output);
                    else
                        reject(output);
                }
            });
        });
    }
}

module.exports = cctool;
