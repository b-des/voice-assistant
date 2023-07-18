const vosk = require('vosk')

const fs = require("fs");
const axios = require("axios");
const sound = require("sound-play");
const path = require("path");
const mic = require("mic");
const ffi = require("ffi-napi");

ffi.DynamicLibrary('/home/node/app/libvosk.so')