'use strict';

document.addEventListener('DOMContentLoaded', () => {
 const by = id => document.getElementById(id);
 const app = by('kob-app');
 const home = app.querySelector('.station-home');
 const rail = home.querySelector('.station-rail');
 const toolbar = app.querySelector('.foundation-toolbar');
 const read = key => {
  try { return localStorage.getItem('kode-petrol-' + key) === 'true'; }
  catch { return false; }
 };
 const save = (key, value) => {
  try { localStorage.setItem('kode-petrol-' + key, String(value)); }
  catch { /* Preferences still work for this visit. */ }
 };

 home.querySelector('h2').textContent = 'Your perfect brew. Designed by you, for you.';
 const choices = document.createElement('div');
 choices.className = 'petrol-choices';
 choices.innerHTML = `
  <button type="button" data-petrol-start="learn"><strong>Learn EVO</strong><small>Make a reference brew, step by step.</small></button>
  <button type="button" data-petrol-start="explore"><strong>Explore brews</strong><small>Find your strength and choose a size.</small></button>
  <button type="button" data-petrol-start="recipes"><strong>My recipes</strong><small>Open a saved recipe.</small></button>`;
 home.querySelector('h3').before(choices);
 home.addEventListener('click', event => {
  if (event.target.closest('[data-open="startLearning"]')) setCompact(false);
  const choice = event.target.closest('[data-petrol-start]')?.dataset.petrolStart;
  if (choice === 'learn') {
   setCompact(false);
   by('startLearning').click();
  }
  if (choice === 'explore') {
   rail.querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true });
   rail.scrollIntoView({ block: 'center' });
  }
  if (choice === 'recipes') {
   setCompact(read('compact'));
   by('myRecipesButton').click();
  }
  if (event.target.closest('.station-continue')) setCompact(read('compact'));
 });

 const options = document.createElement('div');
 options.className = 'petrol-brew-options';
 options.innerHTML = '<label><input type="checkbox" data-compact> Compact view</label><label><input type="checkbox" data-voice> Voice alerts</label>';
 toolbar.append(options);
 const compact = options.querySelector('[data-compact]');
 const voice = options.querySelector('[data-voice]');
 function setCompact(enabled) {
  compact.checked = enabled;
  app.classList.toggle('petrol-compact', enabled);
 }
 setCompact(read('compact'));
 compact.addEventListener('change', () => {
  setCompact(compact.checked);
  save('compact', compact.checked);
 });
 const speech = window.speechSynthesis;
 const supported = !!speech && typeof window.SpeechSynthesisUtterance === 'function';
 voice.disabled = !supported;
 voice.checked = supported && read('voice');
 if (!supported) voice.closest('label').title = 'Voice alerts are unavailable in this browser';
 voice.addEventListener('change', () => {
  save('voice', voice.checked);
  if (!voice.checked) speech.cancel();
 });

 let lastPhase;
 let warnedFor;
 let previousTime = 0;
 window.kodePetrolCue = (state, segment, target, nextPour, seconds, waiting) => {
  if (!state.hasStarted || state.time < previousTime) {
   lastPhase = undefined;
   warnedFor = undefined;
  }
  previousTime = state.time;
  if (!voice.checked || !state.hasStarted || document.hidden || !app.classList.contains('brew-screen')) return;
  if (!state.running && waiting === null && !state.complete) return;
  const phase = state.complete ? 'complete' : waiting !== null ? 'waiting' : segment.start;
  let cue;
  if (phase !== lastPhase) {
   lastPhase = phase;
   if (state.complete) cue = 'Brew complete.';
   else if (waiting !== null) cue = 'Ready for your next pour.';
   else if (target !== null) cue = 'Pour to ' + Math.round(target) + ' grams total.';
   else if (nextPour) cue = 'Let the coffee rest.';
   else cue = 'Let the brew drain.';
  } else if (state.running && nextPour && seconds > 0 && seconds <= 5 && warnedFor !== nextPour.start) {
   warnedFor = nextPour.start;
   cue = 'Next pour in ' + seconds + ' seconds.';
  }
  if (cue) {
   const utterance = new SpeechSynthesisUtterance(cue);
   utterance.lang = 'en-GB';
   speech.cancel();
   speech.speak(utterance);
  }
 };
});
