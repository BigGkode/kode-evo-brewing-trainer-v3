'use strict';
document.addEventListener('DOMContentLoaded', () => {
 const by = id => document.getElementById(id);
 const home = by('brewWelcome');
 const names = ['Delicate', 'Bright', 'Classic', 'Rich', 'Intense'];
 const colours = ['#dfc7a5', '#c29c72', '#96643f', '#70472f', '#4e301f'];
 let destination = 3;
 let route = 'Foundation';

 const screen = document.createElement('div');
 screen.className = 'station-home';
 screen.innerHTML = `
  <h2>Meet EVO<span>.</span></h2>
  <p><strong>The brewing system designed for the FB45.</strong></p>
  <p>Brew to your taste. Get more from less coffee.</p>
  <button type="button" class="station-link" data-open="homeWhyEvo">Why EVO?</button>
  <h3>Find your strength</h3>
  <p class="station-hint">Choose your destination.</p>
  <div class="station-rail" role="group" aria-label="Strength stations"></div>
  <div class="station-ticket">
   <span class="station-kicker">YOUR BREW TICKET</span>
   <h4 class="station-destination"></h4>
   <p class="station-route-summary"></p>
   <div class="station-routes" role="group" aria-label="Brewing route">
    <button type="button" data-route="Foundation">Foundation</button>
    <button type="button" data-route="Dilution">Dilution</button>
   </div>
   <p class="station-route-note" hidden>Intense is only available through Foundation.</p>
   <ol class="station-journey" aria-label="Brew journey"></ol>
   <button type="button" class="station-continue"></button>
  </div>
  <div class="station-support">
   <button type="button" class="station-link" data-open="startLearning">Show me how</button>
   <button type="button" class="station-link" data-open="welcomeDiscover">Discover the FB45</button>
   <button type="button" class="station-link" data-open="equipmentSetup">Equipment &amp; setup</button>
  </div>`;
 home.prepend(screen);
 home.classList.add('station-landing');
 const choice = by('foundationChoice');
 const size = by('brewSizePicker');
 const strengthTitle = by('brewStrengthHeading');
 const cups = choice.querySelector('.foundation-cups');
 const footer = choice.querySelector('.choice-bottom');
 const progress = document.createElement('ol');
 progress.className = 'station-journey station-setup-journey';
 progress.setAttribute('aria-label', 'Brew journey');
 choice.classList.add('station-setup');
 size.before(strengthTitle, cups);
 footer.before(progress);
 by('brewSizeHeading').textContent = 'Choose your brew size';
 const quick = document.createElement('div');
 quick.className = 'station-quick';
 quick.hidden = true;
 quick.innerHTML = `
  
  <div class="petrol-station-intro"><h2 tabindex="-1">Explore brews</h2></div>
  <ol class="station-journey station-quick-journey" aria-label="Brew journey"></ol>
  <div class="station-quick-heading"><h3 class="petrol-choice-label" data-station-heading>Find your strength</h3><div class="station-quick-via" hidden><strong data-quick-to></strong></div><div class="station-rail" role="group" aria-label="Strength stations"></div></div>
  <div class="petrol-water-choice">
   <h3 class="petrol-choice-label">Choose your size</h3><div class="petrol-size-options" role="group" aria-label="Brew water"></div>
  </div>
  <div class="station-ticket">
   <div class="petrol-choice-label">Your brew ticket</div><div class="petrol-ticket-head"><h4 class="station-destination"></h4><p class="station-route-summary" data-quick-route></p></div>
   <div class="station-quick-amounts">
    <div><span>COFFEE DOSE</span><strong data-quick-dose></strong></div>
    <div><span>BREW WATER</span><strong data-quick-water></strong></div>
   </div>
   <div class="station-water-add" data-water-add hidden></div><p data-quick-yield></p>
   <div class="petrol-ticket-routes" hidden><button type="button" data-quick-foundation hidden>Use Foundation</button><button type="button" data-quick-dilution>Use Dilution</button><span data-quick-dilution-note hidden>Intense is only available through Foundation.</span></div>
  </div>
  <button type="button" class="station-continue petrol-go-brew" data-quick-brew>Go to brewing →</button>
  <div class="station-quick-links"><button type="button" data-quick-help>Preparation help</button></div>`;
 choice.prepend(quick);
 const q = selector => quick.querySelector(selector);
 const sizeButtons = [...size.querySelectorAll('[data-brew-size]')];
 const quickRail = q('.station-rail');
 const quickHome = document.createElement('button');
 quickHome.type = 'button';
 quickHome.className = 'petrol-quick-home';
 quickHome.textContent = '‹ Home';
 const header = by('kob-app').querySelector('header');
 header.prepend(quickHome);
 quickHome.onclick = () => by('methodHome').click();
 let strengthChosen = false;
 let waterChosen = false;
 by('methodHome').addEventListener('click', () => {
  strengthChosen = false;
  waterChosen = false;
 });
 const quickSizes = sizeButtons.map(option => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = option.dataset.brewSize + ' g';
  button.onclick = () => {
   waterChosen = true;
   option.click();
   renderSetup();
  };
  q('.petrol-size-options').append(button);
  return button;
 });
 q('[data-quick-foundation]').onclick = () => by('methodFoundation').click();
 q('[data-quick-dilution]').onclick = () => {
  const strength = Number(by('trainerStrength').value);
  if (!window.kodeDilutionEnabled || strength >= 5) return;
  const water = window.getFoundationBrewSize();
  by('beginDilutionMethod').click();
  cups.querySelector('[data-foundation-strength="5"]').click();
  const finish = by('planDilutionStrength');
  finish.value = String(strength);
  finish.dispatchEvent(new Event('change', { bubbles: true }));
  window.setFoundationBrewSize(water);
  renderSetup();
 };
 populateRail(quickRail, strength => {
  strengthChosen = true;
  if (window.kodeBrewPath !== 'dilution') destination = strength;
  cups.querySelector('[data-foundation-strength="' + strength + '"]').click();
  render();
  renderSetup();
 });
 function openQuickRecipe(action) {
  by('choiceNext').click();
  if (by('brewRecipeOverlay').open) by(action).click();
 }
 q('[data-quick-brew]').onclick = () => openQuickRecipe('recipeContinue');
 q('[data-quick-help]').onclick = () => openQuickRecipe('recipeShowPreparation');

 function renderSetup() {
  const dilution = window.kodeBrewPath === 'dilution';
  const finish = Number(by('planDilutionStrength').value);
  const plan = window.kodePlannedDilution;
  const simple = !window.kodeLearningRun && window.kodeEvoLevel === 1 && (!dilution || (finish >= 1 && finish < 5 && !!plan));
  choice.classList.toggle('station-quick-active', simple);
  quick.hidden = !simple;
  if (simple) {
   const selected = Number(by('trainerStrength').value);
   const water = window.getFoundationBrewSize();
   const dose = Number(by('brew_dose').value);
   const title = q('.station-destination');
   const target = dilution ? finish : selected;
   title.textContent = names[target - 1];
   title.style.setProperty('--bean', colours[target - 1]);
   title.classList.toggle('petrol-delicate', target === 1);
   q('[data-quick-route]').textContent = dilution ? 'Dilution · Destination' : 'Foundation · Direct';
   q('.station-quick-via').hidden = !dilution;
   q('[data-station-heading]').textContent = dilution ? 'Choose your starting station' : 'Find your strength';
   q('.petrol-ticket-routes').hidden = !window.kodeDilutionEnabled;
   q('[data-quick-foundation]').hidden = !dilution;
   q('[data-quick-dilution]').hidden = dilution || selected === 5;
   q('[data-quick-dilution-note]').hidden = dilution || selected !== 5;
   q('[data-quick-to]').textContent = 'To ' + names[target - 1] + ' · Via ' + names[selected - 1];
   quickRail.setAttribute('aria-label', dilution ? 'Starting station' : 'Change strength');
   [...quickRail.children].forEach((button, i) => { button.hidden = dilution && i + 1 <= target; });
   quickRail.style.setProperty('--station-count', dilution ? 5 - target : 5);
   markRail(quickRail, selected);
   quickSizes.forEach((button, i) => button.setAttribute('aria-pressed', String(Number(sizeButtons[i].dataset.brewSize) === water)));
   q('[data-quick-brew]').textContent = 'Brew ' + names[target - 1] + ' →';
   const journey = dilution ? ['Plan brew', 'Brew', 'Add water', 'Taste'] : ['Choose strength', 'Set size', 'Brew', 'Taste'];
   q('.station-quick-journey').replaceChildren(...journey.map((label, i) => {
    const item = document.createElement('li');
    item.textContent = label;
    const completed = !dilution && (i === 0 && strengthChosen || i === 1 && waterChosen);
    if (completed) {
     item.classList.add('petrol-step-done');
     item.setAttribute('aria-label', label + ', complete');
    }
    if (i === (dilution || !strengthChosen ? 0 : waterChosen ? 2 : 1)) item.setAttribute('aria-current', 'step');
    return item;
   }));
   const add = q('[data-water-add]');
   add.hidden = !dilution;
   add.textContent = dilution ? 'After brewing, add ' + plan.water + ' g water' : '';
   q('[data-quick-help]').hidden = dilution;
   q('[data-quick-water]').textContent = water + ' g';
   q('[data-quick-dose]').textContent = dose + ' g';
   q('[data-quick-yield]').textContent = 'Estimated in cup: about ' + Math.round(water - 2 * dose + (dilution ? plan.water : 0)) + ' g';
  }
  strengthTitle.textContent = dilution ? 'Choose your starting station' : 'Your strength station';
  const steps = dilution ? ['Plan brew', 'Brew', 'Add water', 'Taste'] : ['Choose size', 'Brew', 'Taste'];
  progress.replaceChildren(...steps.map((step, i) => {
   const item = document.createElement('li');
   item.textContent = step;
   if (i === 0) item.setAttribute('aria-current', 'step');
   return item;
  }));
 }
 document.addEventListener('kode-path-change', renderSetup);
 new MutationObserver(renderSetup).observe(choice,{attributes:true,attributeFilter:['hidden']});
 new MutationObserver(renderSetup).observe(by('choiceRecipe'),{childList:true});
 new MutationObserver(renderSetup).observe(by('planDilutionSummary'),{childList:true});
 renderSetup();
 const find = selector => screen.querySelector(selector);
 const rail = find('.station-rail');
 function populateRail(container, onSelect) {
  names.forEach((name, i) => {
   const button = document.createElement('button');
   button.type = 'button';
   button.textContent = name;
   button.style.setProperty('--bean', colours[i]);
   button.onclick = () => onSelect(i + 1);
   container.append(button);
  });
 }
 function markRail(container, selected) {
  [...container.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i + 1 === selected)));
 }
 populateRail(rail, strength => { destination = strength; render(); });
 const routes = find('.station-routes');
 routes.addEventListener('click', event => {
  const button = event.target.closest('button[data-route]');
  if (!button || button.disabled) return;
  route = button.dataset.route;
  render();
 });
 screen.querySelectorAll('[data-open]').forEach(button => {
  button.onclick = () => by(button.dataset.open).click();
 });
 const next = find('.station-continue');
 next.onclick = () => {
  const dilution = route === 'Dilution' && window.kodeDilutionEnabled;
  by(dilution ? 'beginDilutionMethod' : 'startMaking').click();
  by('foundationChoice').querySelector('[data-foundation-strength="' + (dilution ? 5 : destination) + '"]').click();
  if (dilution) {
   const finish = by('planDilutionStrength');
   finish.value = String(destination);
   finish.dispatchEvent(new Event('change', { bubbles:true }));
  }
  renderSetup();
  if (!quick.hidden) quick.scrollIntoView({ block:'start' });
  else by('brewSizeHeading').scrollIntoView({ block:'nearest' });
 };
 function render() {
  const available = !!window.kodeDilutionEnabled;
  const last = destination === names.length;
  if (!available || last) route = 'Foundation';
  const direct = route === 'Foundation';
  const name = names[destination - 1];
  markRail(rail, destination);
  routes.hidden = !available;
  [...routes.children].forEach(button => {
   button.disabled = last && button.dataset.route === 'Dilution';
   button.setAttribute('aria-pressed', String(button.dataset.route === route));
  });
  find('.station-route-note').hidden = !available || !last;
  find('.station-destination').textContent = name;
  find('.station-destination').style.setProperty('--bean', colours[destination - 1]);
  find('.station-route-summary').textContent = direct ? 'Foundation · Direct' : 'From Intense → To ' + name;
  const steps = direct ? ['Choose size', 'Brew', 'Taste'] : ['Plan brew', 'Brew', 'Add water', 'Taste'];
  find('.station-journey').replaceChildren(...steps.map(step => {
   const item = document.createElement('li');
   item.textContent = step;
   return item;
  }));
  find('[data-open="startLearning"]').hidden = window.kodeShowLearningHome === false;
  next.textContent = 'Continue to ' + name + ' →';
 }
 new MutationObserver(render).observe(home, { attributes:true, attributeFilter:['hidden'] });
 const sync = window.syncKodeTrialMode;
 window.syncKodeTrialMode = () => { sync(); render(); renderSetup(); };
 render();
});
