const vosk = require('vosk');

const fs = require("fs");
const {Readable} = require("stream");
const wav = require("wav");
const intentProcessor = require("./intent-processor");

MODEL_PATH = "vosk-model-small-uk-v3-small"
FILE_NAME = "./test.wav"

if (!fs.existsSync(MODEL_PATH)) {
    console.log("Please download the model from https://alphacephei.com/vosk/models and unpack as " + MODEL_PATH + " in the current folder.")
    process.exit()
}

if (process.argv.length > 2)
    FILE_NAME = process.argv[2]

vosk.setLogLevel(0);
const model = new vosk.Model(MODEL_PATH);

const wfReader = new wav.Reader();
const wfReadable = new Readable().wrap(wfReader);



/*
fs.createReadStream(FILE_NAME, {'highWaterMark': 4096}).pipe(wfReader).on('finish',
    function (err) {
        model.free();
    });
*/

const recognize = async () => {
    console.log('recognize');
    wfReader.on('format', async ({audioFormat, sampleRate, channels}) => {
        if (audioFormat != 1 || channels != 1) {
            console.error("Audio file must be WAV format mono PCM.");
            process.exit(1);
        }
        const rec = new vosk.Recognizer({model: model, sampleRate: sampleRate});
        rec.setMaxAlternatives(10);
        rec.setWords(true);
        rec.setPartialWords(true);
        for await (const data of wfReadable) {
            const end_of_speech = rec.acceptWaveform(data);
            if (end_of_speech) {
                let value = rec.result().alternatives[0].text;
                console.log(JSON.stringify(value, null, 4));
                await intentProcessor.processIntent(value)
            } else {
                //console.log(JSON.stringify(rec.partialResult(), null, 4));
            }
        }
        //console.log(JSON.stringify(rec.finalResult(rec), null, 4));
        rec.free();
    });

 /*   let stream = fs.createReadStream(FILE_NAME, {'highWaterMark': 4096}).pipe(wfReader).on('finish',
        function (err) {
            console.log("finish")
            model.free();
        }).on('data', function (chunk) {
        console.log(chunk);
    });
*/
    let buffer = fs.readFileSync('audio.wav');
    const rec = new vosk.Recognizer({model: model, sampleRate: 16000});
    rec.setMaxAlternatives(10);
    rec.setWords(true);
    rec.setPartialWords(true);
    //for await (const data of wfReadable) {
        const end_of_speech = rec.acceptWaveform(buffer);
        if (end_of_speech) {
            let value = rec.result().alternatives[0].text;
            console.log(JSON.stringify(value, null, 4));
            await intentProcessor.processIntent(value)
        } else {
            //console.log(JSON.stringify(rec.partialResult(), null, 4));
        }
    //}
    console.log(JSON.stringify(rec.finalResult(rec), null, 4));
    rec.free();

    fs.writeFileSync('audio.wav', '')
}

module.exports = {
    recognize
}