const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>', {
    url: 'http://localhost/'
});

global.window = dom.window;
global.localStorage = {
    data: {},
    getItem: function (k) { return this.data[k] || null; },
    setItem: function (k, v) { this.data[k] = v; },
    keys: function () { return Object.keys(this.data); },
    removeItem: function (k) { delete this.data[k]; }
};

// Start fixed time
const mockTime = 10000;
global.Date.now = () => mockTime;

// Load the script
const scriptContent = fs.readFileSync('client/public/game-integration.js', 'utf8');
eval(scriptContent);

window.GameTracker.setupPopGame('TEST1');
window.GameTracker.recordCorrect({ balloon: 'popped' });

// Advanced time by 90 seconds
global.Date.now = () => mockTime + 90000;

window.GameTracker.end();

console.log(JSON.stringify(global.localStorage.data, null, 2));
