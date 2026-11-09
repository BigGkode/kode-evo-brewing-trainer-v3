'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const $=id=>document.getElementById(id),names=['Tea-like','Delicate','Bright','Classic','Rich','Intense'],tds=[1.19,1.23,1.28,1.34,1.39,1.45];
 const section=document.createElement('section');section.id='recipeDilutionPlan';section.innerHTML='<label hidden><input type="checkbox" id="planDilution"> Finish with dilution</label><strong>3 · Choose your finished strength</strong><div id="planDilutionFields" hidden><label>Finished strength<select id="planDilutionStrength"></select></label><p id="planDilutionSummary"></p></div>';$('foundationChoice').querySelector('.choice-bottom').before(section);
 let source=null,preferredFinish=null,restoredPlan=null;try{const saved=localStorage.getItem('kode-v3-finished-strength');if(saved!==null&&Number(saved)>=0&&Number(saved)<=4)preferredFinish=Number(saved)}catch{}
 function showPlanReview(plan){
  const review=document.createElement('p');
  review.id='plannedDilutionReview';
  review.className='planned-dilution-review';
  review.textContent='Brew '+names[plan.source]+' → finish '+names[plan.target]+' · add '+plan.water+' g water after brewing';
  $('brewRecipeOverlayContent').append(review);
 }
 function refresh(){const existing=$('plannedDilutionReview');if(existing)existing.remove();const current=Number($('trainerStrength').value);if(source!==current){source=current;if(preferredFinish===null)preferredFinish=Math.max(0,current-1);$('planDilutionStrength').innerHTML=names.slice(0,5).map((n,i)=>'<option value="'+i+'">'+n+'</option>').reverse().join('');$('planDilutionStrength').value=String(preferredFinish);window.kodePlannedDilution=null;}const dilutionPath=window.kodeBrewPath==='dilution';section.hidden=!dilutionPath;if(dilutionPath)$('planDilution').checked=true;else $('planDilution').checked=false;const enabled=$('planDilution').checked;$('planDilutionFields').hidden=!enabled;if(!enabled){
  if (!window.kodeDilutionEnabled || restoredPlan?.source!==current || restoredPlan?.size!==Number($('brew_water').value)) restoredPlan=null;
  window.kodePlannedDilution=restoredPlan;
  if (restoredPlan) showPlanReview(restoredPlan);
  return;
 }const target=Number($('planDilutionStrength').value);if(target>=current){window.kodePlannedDilution=null;$('planDilutionSummary').textContent='Your finish stays '+names[target]+'. Choose a stronger starting brew to dilute to it.';$('choiceNext').disabled=true;return;}$('choiceNext').disabled=false;const mass=Number($('brew_water').value)-2*Number($('brew_dose').value),water=Math.round(Math.max(0,mass*(tds[current]/tds[target]-1)));window.kodePlannedDilution={target,water,source:current};showPlanReview(window.kodePlannedDilution);$('planDilutionSummary').replaceChildren();const instruction=document.createElement('strong');instruction.textContent='Add '+water+' g water after brewing';const estimate=document.createElement('span');estimate.textContent='Estimated finished drink: '+Math.round(mass+water)+' g';$('planDilutionSummary').append(instruction,estimate);}
 document.querySelectorAll('[data-foundation-strength]').forEach(button=>button.addEventListener('click',refresh));document.querySelectorAll('[data-brew-size]').forEach(button=>button.addEventListener('click',refresh));refresh();
 document.addEventListener('kode-path-change',()=>{restoredPlan=null;refresh();const heading=$('foundationChoice').querySelector('.choice-heading');if(window.kodeBrewPath==='dilution'){heading.querySelector('h2').textContent='Brew strong. Make it yours.';heading.querySelector('p').textContent='Choose your brew size and starting strength, then choose how you would like your finished coffee.';$('brewRouteName').textContent='EVO 2 · Brew strong, then dilute';}else{heading.querySelector('h2').textContent='Brew to your strength.';heading.querySelector('p').textContent='Choose your size and strength. Brew, let it drain, enjoy.';}});
 $('planDilution').onchange=refresh;$('planDilutionStrength').onchange=()=>{preferredFinish=Number($('planDilutionStrength').value);try{localStorage.setItem('kode-v3-finished-strength',String(preferredFinish))}catch{}refresh()};$('choiceNext').addEventListener('click',event=>{if(window.kodeBrewPath==='dilution'&&Number($('planDilutionStrength').value)>=Number($('trainerStrength').value)){event.preventDefault();event.stopImmediatePropagation();refresh()}},true);
 new MutationObserver(()=>{if($('brewRecipeOverlay').open)refresh();}).observe($('brewRecipeOverlay'),{attributes:true,attributeFilter:['open']});
 $('dilutionAfterBrew').addEventListener('click',()=>{const plan=window.kodePlannedDilution;if(!plan)return;const choice=$('dilutionStrengths').querySelector('[data-finish="'+plan.target+'"]');choice?.click();});
 window.restoreKodeDilutionPlan=plan=>{
  const target=names.indexOf(({Robust:'Rich',Bold:'Intense'})[plan?.target]||plan?.target);
  const source=Number($('trainerStrength').value);
  if (!window.kodeDilutionEnabled || target<0 || target>=source || !Number.isFinite(plan.water) || plan.water<0 || plan.water>1000) return false;
  restoredPlan={target,source,water:plan.water,size:Number($('brew_water').value),restored:true};
  refresh();
  return window.kodePlannedDilution===restoredPlan;
 };
 let autoEntered=false;
 function enterPlannedDilution(){const phase=$('simPhase').textContent;if(phase==='Ready to bloom')autoEntered=false;if(phase==='Brew complete'&&window.kodePlannedDilution&&!window.kodeLearningRun&&!autoEntered){autoEntered=true;$('dilutionAfterBrew').click();}}
 window.continueKodePlannedDilution=enterPlannedDilution;
 new MutationObserver(enterPlannedDilution).observe($('simPhase'),{childList:true});
 $('foundationStartOver').addEventListener('click',()=>{source=null;restoredPlan=null;window.kodePlannedDilution=null;$('planDilution').checked=false;});
});
