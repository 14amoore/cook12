/* globals Tone, chrome */
let previousCookieCount = 0;
let newCookieCount = 0;
// let latestCookies;
let streamCookies;

const noiseVol = new Tone.Volume(-20);

const noiseSynth = new Tone.NoiseSynth({
  noise: { type: 'pink' },
  envelope: { attack: 0, decay: 0.1, sustain: 1 }
});

const dripSynth = new Tone.MetalSynth({
  frequency: 10000,
  envelope: { attack: 0.001, decay: 1.4, release: 0.2 },
  harmonicity: 2,
  modulationIndex: 1,
  resonance: 1000,
  octaves: 1.5
});

function awaitTotalCookies() {
  return new Promise(function getCookies(resolve) {
    chrome.cookies.getAll({}, cookies => {
      const sustain = Math.floor(cookies.length / 10);
      resolve(sustain);
    });
  });
}

async function cookieCall() {
  // console.log('calling');
  const latestCookies = await awaitTotalCookies();
  newCookieCount = latestCookies - previousCookieCount;
  previousCookieCount = latestCookies;
  console.log(newCookieCount);
  if (newCookieCount > 0) {
    // console.log(previousCookieCount);
    // noiseSynth.triggerAttackRelease(newCookieCount);
    dripSynth.triggerAttackRelease(newCookieCount);
  }
  return newCookieCount;
}

const startBtn = document.querySelector('#start');
const stopBtn = document.querySelector('#stop');

const startStream = () => {
  console.log('start');
  // console.log(`Playing noise for ${previousCookieCount} seconds.`);
  streamCookies = setInterval(cookieCall, 250);
  // noiseSynth.triggerAttackRelease(previousCookieCount);
  // noiseSynth.chain(noiseVol, Tone.Master);
  dripSynth.toMaster();
  startBtn.disabled = true;
};

const stopStream = () => {
  clearInterval(streamCookies);
  console.log('stop');
  startBtn.disabled = false;
};

startBtn.addEventListener('click', startStream);

stopBtn.addEventListener('click', stopStream);

const testFunc = function test() {
  alert('this is a test');
  console.log('here');
};

const testButton = document.querySelector('#test');
testButton.addEventListener('click', testFunc);
