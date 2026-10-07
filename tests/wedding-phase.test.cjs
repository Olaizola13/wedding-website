const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const script = fs.readFileSync(path.join(__dirname, '../js/wedding-phase.js'), 'utf8');
const cutoff = Date.parse('2026-10-18T05:00:00+02:00');

function loadPhase(time, page = 'wedding.html?lang=es') {
    let now = time;
    const classes = new Set();
    const timers = [];
    const events = {};
    const redirects = [];
    let reloads = 0;
    const url = new URL(page, 'https://wedding.example/');
    const document = {
        hidden: false,
        documentElement: { classList: { add: name => classes.add(name) } },
        addEventListener: (name, callback) => { events[name] = callback; }
    };
    const window = {
        location: {
            href: url.href, pathname: url.pathname,
            replace: target => redirects.push(target), reload: () => { reloads++; }
        },
        setTimeout: (callback, delay) => timers.push({ callback, delay }),
        addEventListener: (name, callback) => { events[name] = callback; }
    };
    vm.runInNewContext(script, { window, document, URL, Date: { now: () => now, parse: Date.parse } });
    return {
        window, document, classes, timers, events, redirects,
        setTime: value => { now = value; }, get reloads() { return reloads; }
    };
}

test('invitation stays active until the final millisecond before 05:00', () => {
    const state = loadPhase(cutoff - 1, 'rsvp.html?lang=de');
    assert.equal(state.window.weddingPhase.isAfterWedding, false);
    assert.equal(state.redirects.length, 0);
    assert.equal(state.classes.size, 0);
    assert.equal(state.timers[0].delay, 1);
});

test('thank-you phase starts exactly at 05:00 Spain time', () => {
    assert.equal(cutoff, Date.parse('2026-10-18T03:00:00Z'));
    for (const time of [cutoff, cutoff + 86400000]) {
        const state = loadPhase(time);
        assert.equal(state.window.weddingPhase.isAfterWedding, true);
        assert.ok(state.classes.has('after-wedding'));
        assert.equal(state.redirects.length, 0);
        assert.equal(state.timers.length, 0);
    }
});

test('every retired bookmark redirects to the homepage with its language', () => {
    for (const page of ['rsvp', 'locations', 'transport', 'travel', 'kids', 'accommodations', 'thank-you']) {
        const state = loadPhase(cutoff, `${page}.html?lang=de#old-section`);
        assert.deepEqual(state.redirects, ['https://wedding.example/wedding.html?lang=de']);
        assert.ok(state.classes.has('retired-wedding-page'));
    }
});

test('retained pages and recommendation subpages stay available', () => {
    for (const page of ['index', 'wedding', 'memories', 'gifts', 'lovestory', 'recommendations', 'rec_dayout', 'rec_gastronomy', 'rec_history', 'rec_practical', 'rec_region', 'rec_sights']) {
        assert.equal(loadPhase(cutoff, `${page}.html`).redirects.length, 0);
    }
});

test('an open tab reloads at the cutoff and timers never overflow', () => {
    const state = loadPhase(Date.parse('2026-10-07T00:00:00Z'));
    assert.equal(state.timers[0].delay, 60000);
    state.setTime(cutoff);
    state.timers[0].callback();
    assert.equal(state.reloads, 1);
});

test('sleeping tabs and back-cache pages recheck the cutoff', () => {
    for (const event of ['visibilitychange', 'pageshow']) {
        const state = loadPhase(cutoff - 1000);
        state.events[event]();
        assert.equal(state.reloads, 0);
        state.setTime(cutoff + 1000);
        state.events[event]();
        assert.equal(state.reloads, 1);
    }
});

test('every HTML entry point loads the phase guard before other scripts', () => {
    const root = path.join(__dirname, '..');
    for (const name of fs.readdirSync(root).filter(name => name.endsWith('.html'))) {
        const html = fs.readFileSync(path.join(root, name), 'utf8');
        assert.match(html.match(/<script\b[^>]*>/)?.[0] || '', /src="\/js\/wedding-phase\.js"/, name);
    }
});
