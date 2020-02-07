/* globals Tone, chrome */
let previousCookieCount = 0;
let newCookieCount = 0;
let previousSeshCount = 0;
let newSeshCount = 0;
let streamCookies;
let streamSession;

const dripSynth = new Tone.MetalSynth({
  frequency: 10000,
  envelope: { attack: 0.001, decay: 1.4, release: 0.2 },
  harmonicity: 2,
  modulationIndex: 500,
  resonance: 2000,
  octaves: 1.5
});

const flutterSynth = new Tone.MembraneSynth({
  envelope: {
    sustain: 0.5,
    attackCurve: 'ripple',
    releaseCurve: 'ripple'
  }
});

function awaitSessionCookies() {
  return new Promise(function getSessionCookies(resolve) {
    chrome.cookies.getAll({ session: false }, sessionCooks => {
      const sesh = sessionCooks.length;
      resolve(sesh);
    });
  });
}

async function sessionCall() {
  const sessionCookies = await awaitSessionCookies();
  console.log(`there are ${sessionCookies} marked as session`);
  newSeshCount = sessionCookies - previousSeshCount;
  previousSeshCount = sessionCookies;
  if (newSeshCount > 0) {
    flutterSynth.triggerAttackRelease('C1', newCookieCount);
  }
  return sessionCookies;
}

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
  // const sessionCookies = await awaitSessionCookies();
  newCookieCount = latestCookies - previousCookieCount;
  previousCookieCount = latestCookies;
  console.log(newCookieCount);
  // console.log(`there are ${sessionCookies} marked as session.`);

  if (newCookieCount > 0) {
    // console.log(previousCookieCount);
    // noiseSynth.triggerAttackRelease(newCookieCount);
    dripSynth.triggerAttackRelease(newCookieCount);
  }
  // return { first: newCookieCount, second: sessionCookies };
  return latestCookies;
}

const startBtn = document.querySelector('#start');
const stopBtn = document.querySelector('#stop');

const startStream = () => {
  console.log('start drip');
  streamCookies = setInterval(cookieCall, 250);
  dripSynth.toMaster();
  startBtn.disabled = true;
};

const startSession = () => {
  console.log('start session sounds');
  streamSession = setInterval(sessionCall, 500);
  flutterSynth.toMaster();
  startBtn.disabled = true;
};

const stopStream = () => {
  clearInterval(streamCookies);
  console.log('stop');
  startBtn.disabled = false;
};

const stopSession = () => {
  clearInterval(streamSession);
  console.log('session cookie sound stopped');
  startBtn.disabled = false;
};

startBtn.addEventListener('click', startStream);
startBtn.addEventListener('click', startSession);

stopBtn.addEventListener('click', stopStream);
stopBtn.addEventListener('click', stopSession);

const testFunc = function test() {
  alert('this is a test');
  console.log('here');
};

const testButton = document.querySelector('#test');
testButton.addEventListener('click', testFunc);
