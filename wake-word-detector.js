const {
    Porcupine,
    BuiltinKeyword,
} = require("@picovoice/porcupine-node");
const {PvRecorder} = require("@picovoice/pvrecorder-node");

const util = require("util");
const EventEmitter = require("events");

let interrupted = false;

DEVICE_INDEX = process.env.DEVICE_INDEX || 0
ACCESS_KEY = process.env.ACCESS_KEY || ""


const accessKey = ""
let porcupine = new Porcupine(
    accessKey,
    [BuiltinKeyword.GRASSHOPPER, BuiltinKeyword.BUMBLEBEE],
    [0.5, 0.65]
);


const frameLength = porcupine.frameLength;


const recorder = new PvRecorder(frameLength, DEVICE_INDEX);

//recorder.start();


async function detected() {
    while (!interrupted) {
        const pcm = await recorder.read();
        const keywordIndex = porcupine.process(pcm);
        if (keywordIndex === 0) {
            // detected `porcupine
            console.log('detected `GRASSHOPPER')
            //return true;
        } else if (keywordIndex === 1) {
            // detected `bumblebee`
            console.log('detected `BUMBLEBEE')
            //return true;
        }
    }
}


//util.inherits(someFunc, EventEmitter);

/*someFunc.on("data", function(data){
    console.log(data);
});*/

class WakeWordDetector extends EventEmitter {

    immediate = null;

    someFunc = async (cb) => {
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
        recorder.start()
        this.someFunc(() => {
            this.write('With ES6')
            console.log('done');
        })

    }

    stop() {
        clearImmediate(this.immediate);
        recorder.stop()
    }
}

const wakeWordDetector = new WakeWordDetector();

wakeWordDetector.on('data', (data) => {
    console.log(`Received data: "${data}"`);

    setTimeout(() => {
        wakeWordDetector.stop()
    }, 3000)
});

wakeWordDetector.start()
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
    listenForWakeWord
}