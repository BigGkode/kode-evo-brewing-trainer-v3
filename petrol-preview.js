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

 home.querySelector('h2').innerHTML = 'Your perfect brew.<br>Designed by you,<br>for you.';
 const choices = document.createElement('div');
 choices.className = 'petrol-choices';
 choices.innerHTML = `
  <button type="button" data-petrol-start="learn"><strong>Learn EVO</strong><small>Make a reference brew with Show me how.</small></button>
  <button type="button" data-petrol-start="explore"><strong>Explore brews</strong><small>Find your strength and choose a size.</small></button>
  <button type="button" data-petrol-start="recipes"><strong>My recipes</strong><small>Open a saved recipe.</small></button>`;

 const icon = path => '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
 const choiceIcons = [
  '<path d="M12 6C9 3 5 3 2 4v14c4-1 7 0 10 3 3-3 6-4 10-3V4c-3-1-7-1-10 2v15"/>',
  '<circle cx="12" cy="12" r="9"/><path d="m15.8 8.2-2.2 5.4-5.4 2.2 2.2-5.4z"/>',
  '<path d="M6 4h12v16l-6-4-6 4z"/>'
 ];
 [...choices.children].forEach((button, index) => {
  const copy = document.createElement('span');
  copy.append(...button.childNodes);
  button.innerHTML = icon(choiceIcons[index]);
  button.append(copy);
  button.insertAdjacentHTML('beforeend', '<span aria-hidden="true">›</span>');
 });
 const heading = home.querySelector('h2');
 const exploreHeading = home.querySelector('h3');
 const startPanel = document.createElement('section');
 const explorePanel = document.createElement('section');
 startPanel.className = 'petrol-start-panel';
 explorePanel.className = 'petrol-explore-panel';
 const support = home.querySelector('.station-support');
 const ticket = home.querySelector('.station-ticket');
 const next = ticket.querySelector('.station-continue');
 function showStart(exploring = false) {
  startPanel.hidden = exploring;
  explorePanel.hidden = !exploring;
 }
 startPanel.innerHTML = '<p class="petrol-eyebrow">Welcome to EVO<br>The FB45 brewing system</p>';
 explorePanel.innerHTML = '<p class="petrol-eyebrow">Strength stations</p>';
 startPanel.append(heading, choices, support);
 for (const button of support.querySelectorAll('[data-open="startLearning"]')) button.classList.add('petrol-redundant');
 explorePanel.append(exploreHeading, home.querySelector('.station-hint'), rail, ticket, next);
 home.replaceChildren(startPanel, explorePanel);
 showStart();
 by('methodHome').addEventListener('click', () => showStart());

 home.addEventListener('click', event => {
  if (event.target.closest('[data-open="startLearning"]')) setCompact(false);
  const choice = event.target.closest('[data-petrol-start]')?.dataset.petrolStart;
  if (choice === 'learn') {
   setCompact(false);
   by('startLearning').click();
  }
  if (choice === 'explore') {
   showStart(true);
   exploreHeading.tabIndex = -1;
   exploreHeading.focus({ preventScroll: true });
   home.scrollIntoView({ block: 'start' });
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
  if (!voice.checked) speech?.cancel();
 });

 const settings = by('userSettings');
 const form = settings.querySelector('form');
 const status = by('settingsStatus');
 const section = (title, ids = []) => {
  const group = document.createElement('fieldset');
  group.className = 'petrol-settings-group';
  const legend = document.createElement('legend');
  legend.textContent = title;
  group.append(legend);
  for (const id of ids) {
   const field = by(id);
   group.append(field.closest('label') || field);
  }
  form.insertBefore(group, status);
  return group;
 };
 const startup = section('Start screen');
 startup.innerHTML += `
  <label>Open EVO at
   <select data-start-screen>
    <option value="learn">Learn EVO</option>
    <option value="explore">Explore brews</option>
    <option value="usual">Brew my usual</option>
   </select>
  </label>
  <p class="settings-speed-note">Applies the next time you open this preview.</p>
  <label>Choose a saved recipe for your usual<select data-usual-recipe></select></label>
  <button type="button" data-save-usual>Save as my usual</button>
  <p class="settings-speed-note">Changes to today’s brew are separate from your saved recipe.</p>`;
 section('Brew preferences', ['settingSize', 'settingStrength', 'settingRemember']);
 const equipment = section('Equipment', ['settingKettle', 'settingTraditionalRate']);
 const flowNote = [...form.children].find(element => element.textContent.startsWith('Traditional kettle:'));
 if (flowNote) equipment.append(flowNote);
 const display = section('Guidance & display', ['settingGuidance', 'settingSound', 'settingSpeed', 'settingReduced', 'settingLarge']);
 const speedNote = [...form.children].find(element => element.textContent.startsWith('For learning or previewing.'));
 if (speedNote) by('settingSpeed').closest('label').after(speedNote);
 display.querySelector('legend').insertAdjacentHTML('afterend', `
  <label>Default brew view
   <select data-default-brew-view><option value="illustrated">Illustrated</option><option value="compact">Compact</option></select>
  </label>
  <label><input type="checkbox" data-settings-voice> Voice alerts</label>`);
 section('Brew routes', ['settingDilution']);
 section('Advanced techniques').insertAdjacentHTML('beforeend', '<p class="settings-speed-note">Two temperatures and Vacuum are unavailable in this preview.</p>');
 section('Brewing modes').insertAdjacentHTML('beforeend', '<p class="settings-speed-note">EVO Pro and BH Freestyle are unavailable in this preview.</p>');
 by('settingLearning').closest('label').hidden = true;

 const start = startup.querySelector('[data-start-screen]');
 const usual = startup.querySelector('[data-usual-recipe]');
 const saveUsual = startup.querySelector('[data-save-usual]');
 const defaultView = display.querySelector('[data-default-brew-view]');
 const settingsVoice = display.querySelector('[data-settings-voice]');
 settingsVoice.disabled = !supported;
 function readText(key, fallback) {
  try { return localStorage.getItem('kode-petrol-' + key) ?? fallback; }
  catch { return fallback; }
 }
 function eligibleRecipes() {
  try {
   const items = JSON.parse(localStorage.getItem('kode-v3-saved-recipes-v1') || '[]');
   return Array.isArray(items) ? items.filter(item => item?.id && !item.temperature && !item.vacuum) : [];
  } catch { return []; }
 }
 function refreshSettings() {
  start.value = readText('start', 'learn');
  defaultView.value = read('compact') ? 'compact' : 'illustrated';
  settingsVoice.checked = voice.checked;
  const recipes = eligibleRecipes();
  usual.replaceChildren(new Option(recipes.length ? 'Choose a saved recipe' : 'No eligible saved recipes yet', ''));
  for (const recipe of recipes) usual.add(new Option(recipe.name || 'Saved recipe', recipe.id));
  usual.value = readText('usual', '');
  if (!usual.value) usual.selectedIndex = 0;
  saveUsual.disabled = !usual.value;
 }
 by('userSettingsButton').addEventListener('click', refreshSettings);
 start.addEventListener('change', () => save('start', start.value));
 usual.addEventListener('change', () => { saveUsual.disabled = !usual.value; });
 saveUsual.addEventListener('click', () => {
  if (!usual.value) return;
  save('usual', usual.value);
  status.textContent = 'Usual recipe saved on this device.';
 });
 defaultView.addEventListener('change', () => {
  setCompact(defaultView.value === 'compact');
  save('compact', compact.checked);
 });
 settingsVoice.addEventListener('change', () => {
  voice.checked = settingsVoice.checked;
  voice.dispatchEvent(new Event('change'));
 });
 by('settingsReset').addEventListener('click', () => {
  save('start', 'learn');
  save('usual', '');
  setCompact(false);
  save('compact', false);
  voice.checked = false;
  voice.dispatchEvent(new Event('change'));
  refreshSettings();
 });

 function applyStartScreen() {
  if (by('brewWelcome').hidden) by('methodHome').click();
  const mode = readText('start', 'learn');
  if (mode === 'learn') return;
  if (mode === 'usual') {
   const id = readText('usual', '');
   const recipe = eligibleRecipes().find(item => item.id === id);
   if (recipe && (!recipe.dilution || window.kodeDilutionEnabled)) {
    by('myRecipesButton').click();
    const button = [...by('savedRecipeList').querySelectorAll('button[data-load]')]
     .find(candidate => candidate.dataset.load === id && !candidate.disabled);
    if (button) {
     button.click();
     return;
    }
    by('recipeLibrary').close();
   }
   const note = document.createElement('p');
   note.textContent = 'Your usual is unavailable. Choose a strength below or select a saved recipe in Settings.';
   note.setAttribute('role', 'status');
   rail.before(note);
  }
  choices.querySelector('[data-petrol-start="explore"]').click();
 }
 requestAnimationFrame(() => requestAnimationFrame(applyStartScreen));

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
