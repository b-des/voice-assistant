const {
    Porcupine,
    BuiltinKeyword,
}= require("@picovoice/porcupine-node");
const {PvRecorder} = require("@picovoice/pvrecorder-node");


let interrupted = false;



const accessKey = ""
let porcupine = new Porcupine(
    accessKey,
    [BuiltinKeyword.GRASSHOPPER, BuiltinKeyword.BUMBLEBEE],
    [0.5, 0.65]
);



const frameLength = porcupine.frameLength;


const recorder = new PvRecorder(frameLength, 0);
recorder.start();

recorder.read().then(d => {
    console.log(d)
    const keywordIndex = porcupine.process(d);
    if (keywordIndex === 0) {
        // detected `porcupine
        console.log('detected `GRASSHOPPER')
        //return true;
    } else if (keywordIndex === 1) {
        // detected `bumblebee`
        console.log('detected `BUMBLEBEE')
        //return true;
    }
})

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