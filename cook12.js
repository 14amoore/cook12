/* globals Tone, chrome */
//Q's: How do I use asnyc results in other places i.e. envelopes?
// counters
let previousCookieCount = 0;
let newCookieCount = 0;
let previousSeshCount = 0;
let newSeshCount = 0;
let previousSecureCount = 0;
let newSecureCount = 0;
// setInterval names
let streamCookies;
let streamSession;
let streamSecure;

const dripSynth = new Tone.MetalSynth({
  frequency: 10000,
  envelope: { attack: 0.001, decay: 1.4, release: 0.2 },
  harmonicity: 2,
  modulationIndex: 500,
  resonance: 2000,
  octaves: 1.5
});

let panner;

const bassSynth = new Tone.MembraneSynth({
  envelope: {
    sustain: 1,
    release: 1,
    attackCurve: 'ripple',
    releaseCurve: 'ripple'
  }
});

const droneSynth = new Tone.NoiseSynth();

function awaitSecureCookies() {
  return new Promise(function getSecureCookies(resolve) {
    chrome.cookies.getAll({ secure: true }, secureCooks => {
      const cCure = secureCooks.length;
      resolve(cCure);
    });
  });
}

function awaitNonSecureCookies() {
  return new Promise(function getNonSecureCookies(resolve) {
    chrome.cookies.getAll({ secure: false }, nonSecureCooks => {
      const nCure = nonSecureCooks.length;
      resolve(nCure);
    });
  });
}

async function secureCall() {
  const secureCooks = await awaitSecureCookies();
  const notSecureCooks = await awaitNonSecureCookies();
  // newSecureCount = secureCooks - previousSecureCount;
  // previousSecureCount = secureCooks;
  console.log(
    `there are ${secureCooks} cookies marked as secure and ${notSecureCooks} marked as not secure.`
  );
  if (secureCooks > notSecureCooks) {
    panner = new Tone.Panner(-1);
    bassSynth.connect(panner);
    panner.toMaster();
  } else if (notSecureCooks > secureCooks) {
    panner = new Tone.Panner(1);
    bassSynth.connect(panner);
    panner.toMaster();
  } else {
    panner = new Tone.Panner(0);
    bassSynth.connect(panner);
    panner.toMaster();
  }
}

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
  // console.log(`there are ${sessionCookies} marked as session`);
  newSeshCount = sessionCookies - previousSeshCount;
  previousSeshCount = sessionCookies;
  console.log(newSeshCount);
  if (newSeshCount > 0) {
    bassSynth.triggerAttackRelease('D1', newSeshCount);
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
  // bassSynth.toMaster();
  startBtn.disabled = true;
};

const startSecure = () => {
  console.log('start secure sounds');
  streamSecure = setInterval(secureCall, 5000);
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

const stopSecure = () => {
  clearInterval(streamSecure);
  console.log('secure cookie sound stopped');
  startBtn.disabled = false;
};

startBtn.addEventListener('click', startStream);
startBtn.addEventListener('click', startSession);
startBtn.addEventListener('click', startSecure);

stopBtn.addEventListener('click', stopStream);
stopBtn.addEventListener('click', stopSession);
stopBtn.addEventListener('click', stopSecure);

const testFunc = function test() {
  alert('this is a test');
  console.log('here');
};

const testButton = document.querySelector('#test');
testButton.addEventListener('click', testFunc);
