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
 const find = selector => screen.querySelector(selector);
 const rail = find('.station-rail');
 names.forEach((name, i) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = name;
  button.style.setProperty('--bean', colours[i]);
  button.onclick = () => { destination = i + 1; render(); };
  rail.append(button);
 });
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
  by('brewSizeHeading').scrollIntoView({ block:'nearest' });
 };
 function render() {
  const available = !!window.kodeDilutionEnabled;
  const last = destination === names.length;
  if (!available || last) route = 'Foundation';
  const direct = route === 'Foundation';
  const name = names[destination - 1];
  [...rail.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i + 1 === destination)));
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
 window.syncKodeTrialMode = () => { sync(); render(); };
 render();
});
