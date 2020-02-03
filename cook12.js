let cTotal = 0;
let newCTotal = 0;

function awaitTotalCookies() {
  return new Promise(function getCookies(resolve) {
    chrome.cookies.getAll({}, cookies => {
      resolve(cookies.length);
    });
  });
}

async function cookieCall() {
  console.log('calling');
  const result = await awaitTotalCookies();
  const a = result - 10;
  console.log(`you have ${a} cookies. plus ten`);
  return a;
}

const startBtn = document.querySelector('#start');
const stopBtn = document.querySelector('#stop');

const startStream = () => {
  streamCookies = setInterval(cookieCall, 1000);
  console.log('start');
  startBtn.disabled = true;
};

startBtn.addEventListener('click', startStream);

stopBtn.addEventListener('click', () => {
  clearInterval(streamCookies);
  console.log('stop');
  startBtn.disabled = false;
});

const testFunc = function test() {
  alert('this is a test');
  console.log('here');
};

const testButton = document.querySelector('#test');
testButton.addEventListener('click', testFunc);
