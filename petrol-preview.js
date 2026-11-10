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

 const wordmark = '<svg viewBox="0 0 248 86" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 14h52v10H17v16h35v10H17v16h41v10H6zM73 14h13l27 48 27-48h13l-35 62h-10z"/><ellipse cx="192" cy="45" rx="31" ry="29" fill="none" stroke="currentColor" stroke-width="10"/><path d="m204 38 24-25" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="240" cy="71" r="5" fill="#f06459"/></svg>';
 const promise = 'Find the taste you want. Use only the coffee you need.';
 home.querySelector('h2').textContent = promise;
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
 startPanel.innerHTML = '<div class="petrol-welcome-art" aria-hidden="true"><svg viewBox="0 0 360 130" focusable="false"><path d="M90 6 Q90 88 30 114" opacity="0.55"/><path d="M105 6 Q105 88 55 114" opacity="0.63"/><path d="M120 6 Q120 88 80 114" opacity="0.70"/><path d="M135 6 Q135 88 105 114" opacity="0.78"/><path d="M150 6 Q150 88 130 114" opacity="0.85"/><path d="M165 6 Q165 88 155 114" opacity="0.93"/><path d="M180 6 Q180 88 180 114" opacity="1.00"/><path d="M195 6 Q195 88 205 114" opacity="0.93"/><path d="M210 6 Q210 88 230 114" opacity="0.85"/><path d="M225 6 Q225 88 255 114" opacity="0.78"/><path d="M240 6 Q240 88 280 114" opacity="0.70"/><path d="M255 6 Q255 88 305 114" opacity="0.63"/><path d="M270 6 Q270 88 330 114" opacity="0.55"/></svg></div><div class="petrol-hero-mark" role="img" aria-label="EVO">' + wordmark + '</div><p class="petrol-eyebrow">Welcome to EVO · The FB45 brewing system</p>';
 explorePanel.innerHTML = '<h2>Meet EVO<span>.</span></h2><p class="petrol-intro">The brewing system designed for the FB45.</p><p class="petrol-promise">' + promise + '</p>';
 startPanel.append(heading, choices, support);
 for (const button of support.querySelectorAll('[data-open="startLearning"]')) button.classList.add('petrol-redundant');
 explorePanel.append(exploreHeading, home.querySelector('.station-hint'), rail, ticket, next);
 home.replaceChildren(startPanel, explorePanel);
 showStart();
 by('methodHome').addEventListener('click', () => {
  showStart();
  refreshUsualCard();
 });

 const meet = document.createElement('dialog');
 meet.id = 'petrolMeetEvo';
 meet.className = 'petrol-dialog';
 meet.setAttribute('aria-labelledby', 'petrolMeetTitle');
 meet.innerHTML = '<form method="dialog"><button autofocus>‹ Back</button></form><div class="petrol-welcome-art" aria-hidden="true"><svg viewBox="0 0 360 130" focusable="false"><path d="M90 6 Q90 88 30 114" opacity="0.55"/><path d="M105 6 Q105 88 55 114" opacity="0.63"/><path d="M120 6 Q120 88 80 114" opacity="0.70"/><path d="M135 6 Q135 88 105 114" opacity="0.78"/><path d="M150 6 Q150 88 130 114" opacity="0.85"/><path d="M165 6 Q165 88 155 114" opacity="0.93"/><path d="M180 6 Q180 88 180 114" opacity="1.00"/><path d="M195 6 Q195 88 205 114" opacity="0.93"/><path d="M210 6 Q210 88 230 114" opacity="0.85"/><path d="M225 6 Q225 88 255 114" opacity="0.78"/><path d="M240 6 Q240 88 280 114" opacity="0.70"/><path d="M255 6 Q255 88 305 114" opacity="0.63"/><path d="M270 6 Q270 88 330 114" opacity="0.55"/></svg></div><h2 id="petrolMeetTitle">Meet EVO</h2><p>The brewing system designed for the FB45.</p><p>' + promise + '</p><p>Learn the technique, then explore the strength stations to find what tastes right to you.</p><p class="petrol-meet-paused" hidden>Your brew is paused. Return to it when you’re ready.</p>';
 app.append(meet);
 const title = app.querySelector('header .banner-app-title');
 const meetButton = document.createElement('button');
 meetButton.type = 'button';
 meetButton.className = 'petrol-header-mark';
 meetButton.setAttribute('aria-label', 'EVO · Meet EVO');
 meetButton.innerHTML = wordmark;
 title.replaceChildren(meetButton);
 meetButton.onclick = () => {
  const wasRunning = !!window.kodeBrewState?.running;
  if (wasRunning) by('simPlay').click();
  meet.querySelector('.petrol-meet-paused').hidden = !wasRunning;
  meet.showModal();
 };

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
  if (choice === 'usual' && !loadUsual()) showStart(true);
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
 const controls = toolbar.querySelector('.playback-controls');
 const secondary = document.createElement('details');
 secondary.className = 'petrol-playback-options';
 secondary.innerHTML = '<summary>More</summary><div></div>';
 controls.append(secondary);
 const speed = by('simSpeed');
 speed.setAttribute('aria-label', 'Playback speed');
 secondary.lastElementChild.append(speed, options);
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
 const preferences = section('Brew preferences', ['settingSize', 'settingStrength', 'settingPrintSize', 'settingRemember']);
 const equipment = section('Equipment & setup', ['settingKettle', 'settingTraditionalRate']);
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
 const routes = section('Brew routes', ['settingDilution']);
 form.insertBefore(display, preferences);
 form.insertBefore(routes, equipment);
 const equipmentLink = [...form.children].find(node => node.tagName === 'BUTTON' && node.textContent.trim() === 'FB45 & setup');
 if (equipmentLink) equipment.append(equipmentLink);
 for (const [name, copy] of [
  ['Advanced techniques', 'Two temperatures and Vacuum are unavailable in this preview.'],
  ['Brewing modes', 'EVO Pro and BH Freestyle are unavailable in this preview.']
 ]) {
  const group = document.createElement('details');
  group.className = 'petrol-settings-group';
  const summary = document.createElement('summary');
  summary.textContent = name;
  const description = document.createElement('p');
  description.textContent = copy;
  group.append(summary, description);
  form.insertBefore(group, status);
 }
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
  refreshUsualCard();
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
  refreshUsualCard();
 });

 const recipeCard = choices.querySelector('[data-petrol-start="recipes"]');
 function getUsual() {
  return eligibleRecipes().find(item => item.id === readText('usual', ''));
 }
 function refreshUsualCard() {
  const recipe = getUsual();
  const available = recipe && (!recipe.dilution || window.kodeDilutionEnabled);
  recipeCard.dataset.petrolStart = available ? 'usual' : 'recipes';
  recipeCard.querySelector('strong').textContent = available ? 'Brew my usual' : 'My recipes';
  recipeCard.querySelector('small').textContent = available ? recipe.name + ' · ' + recipe.size + ' g water' : 'Open a saved recipe.';
  choices.classList.toggle('has-usual', !!available);
 }
 function loadUsual() {
  const recipe = getUsual();
  if (!recipe || (recipe.dilution && !window.kodeDilutionEnabled)) return false;
  by('myRecipesButton').click();
  const button = [...by('savedRecipeList').querySelectorAll('button[data-load]')]
   .find(candidate => candidate.dataset.load === recipe.id && !candidate.disabled);
  if (button) {
   setCompact(read('compact'));
   button.click();
   return true;
  }
  by('recipeLibrary').close();
  return false;
 }
 function applyStartScreen() {
  if (by('brewWelcome').hidden) by('methodHome').click();
  refreshUsualCard();
  const mode = readText('start', 'learn');
  if (mode === 'learn' || (mode === 'usual' && loadUsual())) return;
  if (mode === 'usual') {
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
