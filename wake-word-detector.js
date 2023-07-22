const {
    Porcupine,
    BuiltinKeyword,
} = require("@picovoice/porcupine-node");
const {PvRecorder} = require("@picovoice/pvrecorder-node");

const util = require("util");
const EventEmitter = require("events");
const mic = require("mic");

const recorderPCM = require('node-record-lpcm16')
const fs = require('fs')

const file = fs.createWriteStream('test.wav', { encoding: 'binary' })

const recording = recorderPCM.record()
recording.process.on("data", () => {
    console.log('data');
})
recording.stream().pipe(file)

recording.start()

let interrupted = false;

DEVICE_INDEX = process.env.DEVICE_INDEX || 0
ACCESS_KEY = process.env.ACCESS_KEY || ""


let porcupine = new Porcupine(
    ACCESS_KEY,
    [BuiltinKeyword.GRASSHOPPER, BuiltinKeyword.BUMBLEBEE],
    [0.5, 0.65]
);

//porcupine._frameLength = 4096;

const frameLength = porcupine.frameLength;


const recorder = new PvRecorder(frameLength, 0);



//recorder.start();


//util.inherits(someFunc, EventEmitter);

/*someFunc.on("data", function(data){
    console.log(data);
});*/

class WakeWordDetector extends EventEmitter {

    immediate = null;
    onPause = false;

    someFunc = async (cb) => {
        if(this.onPause){
            return;
        }
        const pcm = await recorder.read();
        const keywordIndex = porcupine.process(pcm);
        if (keywordIndex === 0) {
            // detected `porcupine
            console.log('detected `GRASSHOPPER')
            if (cb) {
                cb();
            }

            this.write('GRASSHOPPER')

            //return true;
        } else if (keywordIndex === 1) {
            // detected `bumblebee`
            console.log('detected `BUMBLEBEE')
            if (cb) {
                cb();
            }

            this.write('BUMBLEBEE')
            //return true;
        }
        this.immediate = setImmediate(this.someFunc, cb);
    }

    write(data) {
        this.emit('data', data);
    }

    start() {
        this.onPause = false;
        recorder.start()
        this.someFunc(() => {
            console.log('done');
        })

    }

    stop() {
        this.onPause = true;
        clearImmediate(this.immediate);
        recorder.stop()
        //recorder.release();
    }
}

const wakeWordDetector = new WakeWordDetector();

wakeWordDetector.on('data', (data) => {
    console.log(`Received data: "${data}"`);

    setTimeout(() => {
        wakeWordDetector.stop()
    }, 3000)
});

//wakeWordDetector.start()


//stream.write('With ES6')

//setImmediate(someFunc);


//process.stdin.resume();

/*
(async function () {
    try {
        //await detected();
    } catch (e) {
        console.error(e.toString());
    }
})();*/

const listenForWakeWord = () => {
    return new Promise(async (resolve, reject) => {
        while (!interrupted) {
            const pcm = await recorder.read();
            const keywordIndex = porcupine.process(pcm);
            if (keywordIndex === 0) {
                // detected `porcupine
                console.log('detected `GRASSHOPPER')
                //return GRASSHOPPER;
                resolve('GRASSHOPPER')
            } else if (keywordIndex === 1) {
                // detected `bumblebee`
                console.log('detected `BUMBLEBEE')
                //return BUMBLEBEE;
                interrupted = true;
                resolve('BUMBLEBEE')
            }
        }
    })
}


/*listenForWakeWord().then(res => {
    console.log(res)
})*/


module.exports = {
    WakeWordDetector
}