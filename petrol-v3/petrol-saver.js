'use strict';

// A recipe records brew-water weight before any post-brew dilution.
const saverRatio = 14.1;
const saverKeys = ['usual', 'benchmark'];
const saverEmpty = () => ({ brews: 0, grams: 0, towardsNext: 0 });

function updateEvoSavings(previous, dose, water, usualDose) {
 const totals = { ...previous };
 const milestones = [];
 const references = { usual: usualDose, benchmark: water / saverRatio };
 for (const key of saverKeys) {
  const reference = references[key];
  if (!Number.isFinite(reference) || reference <= 0) continue;
  const row = previous[key] || saverEmpty();
  const difference = reference - dose;
  const towardsNext = row.towardsNext + difference;
  const earned = difference > 0 && towardsNext + 1e-8 >= dose;
  totals[key] = {
   brews: row.brews + 1,
   grams: row.grams + difference,
   towardsNext: earned ? Math.max(0, towardsNext - dose) : towardsNext
  };
  if (earned) milestones.push(key);
 }
 return { totals, milestone: milestones[0] };
}

document.addEventListener('DOMContentLoaded', () => {
 const by = id => document.getElementById(id);
 const storageKey = 'kode-petrol-saver-v1';
 const phase = by('simPhase');
 const app = by('kob-app');
 const button = document.createElement('button');
 button.id = 'petrolLogBrew';
 button.type = 'button';
 button.textContent = 'Log tasted brew';
 button.hidden = true;
 by('foundationSummary').append(button);

 const history = document.createElement('button');
 history.className = 'station-link';
 history.type = 'button';
 history.textContent = 'Saver Ticket';
 app.querySelector('.petrol-start-panel .station-support').append(history);

 const dialog = document.createElement('dialog');
 dialog.id = 'petrolSaver';
 dialog.className = 'petrol-dialog';
 dialog.setAttribute('aria-labelledby', 'petrolSaverTitle');
 dialog.innerHTML = `
  <form method="dialog"><button autofocus>Close</button></form>
  <h2 id="petrolSaverTitle">Saver Ticket</h2>
  <p data-saver-message role="status"></p>
  <p>Find the taste you want and make your coffee go further. Good for your palate and your pocket, with less coffee needed per brew.</p>
  <div class="petrol-saver-summary"></div>
  <details><summary>Why Brew Ratio Bloat?</summary>
   <p>Barista Hustle reported an average ratio of 1:14.1 across the six 2026 World Brewers Cup finalists. We match brew-water weight when comparing doses. Barista Hustle suggests that judges’ emphasis on descriptor accuracy may encourage higher doses.</p>
   <p><a href="https://www.baristahustle.com/brew-ratio-bloat/" target="_blank" rel="noopener noreferrer">Read Brew Ratio Bloat</a></p>
  </details>
  <details><summary>What if this scaled up?</summary>
   <p>At 250 g of brew water, the finalists’ benchmark is about 17.7 g. If one million cups used 14 g instead and drinkers enjoyed the result, that would be about 3.7 tonnes less coffee used. This is an illustrative scenario.</p>
  </details>`;
 app.append(dialog);

 let totals = {};
 function stored() {
  try {
   const value = JSON.parse(localStorage.getItem(storageKey) || 'null');
   if (!value) return totals;
   return Object.fromEntries(saverKeys.filter(key => {
    const row = value[key];
    return row && Number.isInteger(row.brews) && row.brews >= 0 &&
     Number.isFinite(row.grams) && Number.isFinite(row.towardsNext);
   }).map(key => [key, value[key]]));
  } catch { return totals; }
 }
 function usualDose(water) {
  try {
   const id = localStorage.getItem('kode-petrol-usual');
   const recipes = JSON.parse(localStorage.getItem('kode-v3-saved-recipes-v1') || '[]');
   const recipe = recipes.find(item => item.id === id && Number(item.size) === water);
   return Number(recipe?.dose || recipe?.details?.dose);
  } catch { return NaN; }
 }
 const names = { usual: 'My usual', benchmark: 'Brew Ratio Bloat' };
 const grams = value => new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 }).format(value);
 function render(message) {
  dialog.querySelector('[data-saver-message]').textContent = message;
  const list = dialog.querySelector('.petrol-saver-summary');
  list.replaceChildren();
  for (const key of saverKeys) {
   const row = totals[key];
   if (!row) continue;
   const card = document.createElement('div');
   const title = document.createElement('strong');
   title.textContent = names[key];
   const detail = document.createElement('div');
   detail.textContent = grams(Math.abs(row.grams)) + ' g ' + (row.grams < 0 ? 'more coffee used' : 'saved') +
    ' across ' + row.brews + (row.brews === 1 ? ' brew' : ' brews');
   card.append(title, detail);
   list.append(card);
  }
  if (!dialog.open) dialog.showModal();
 }
 history.onclick = () => {
  totals = stored();
  render(Object.keys(totals).length ? 'Your savings across tasted brews.' : 'Log a brew after tasting to start tracking.');
 };

 let logged = false;
 const complete = () => {
  if (window.kodeLearningRun) return false;
  if (window.kodePlannedDilution || window.kodeSavedDilution) return phase.textContent === 'Dilution complete';
  return phase.textContent === 'Brew complete';
 };
 function sync() {
  if (phase.textContent === 'Ready to bloom') logged = false;
  button.hidden = logged || !complete();
 }
 new MutationObserver(sync).observe(phase, { childList: true, characterData: true, subtree: true });
 button.onclick = () => {
  if (logged || !complete()) return;
  const water = Number(by('brew_water').value);
  const dose = Number(by('brew_dose').value);
  if (!Number.isFinite(water) || water <= 0 || !Number.isFinite(dose) || dose <= 0) return;
  logged = true;
  sync();
  const { totals: updated, milestone } = updateEvoSavings(stored(), dose, water, usualDose(water));
  totals = updated;
  let message = milestone ? 'You’ve saved enough coffee for one more EVO brew compared with ' + names[milestone] + '.' : '';
  try { localStorage.setItem(storageKey, JSON.stringify(totals)); }
  catch { message = [message, 'This browser could not save your totals for next time.'].filter(Boolean).join(' '); }
  if (message) render(message);
  else {
   button.textContent = 'Brew logged';
   button.hidden = false;
   button.disabled = true;
   setTimeout(() => {
    button.textContent = 'Log tasted brew';
    button.disabled = false;
    sync();
   }, 1500);
  }
 };
 sync();
});
