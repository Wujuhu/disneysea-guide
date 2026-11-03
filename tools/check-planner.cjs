const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),context={window:{}};
for(const file of ['data.js','planner.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const D=context.window.DISNEY_DATA,P=context.window.GuidePlanner;
const all=new Map([...D.attractions,...D.shows,...D.dining].map(item=>[item.id,item]));
assert.equal(D.attractions.length,31);assert.equal(D.shows.length,2);
assert(!all.has(246)&&!all.has(257));assert.equal(D.excludedAttractions.length,2);
assert(D.excludedAttractions.some(item=>item.id===257),'Peter Pan is hidden by default');
assert.equal(D.dining.length,23);assert.equal(D.dining.filter(item=>item.service==='seating').length,6);assert.equal(D.dining.filter(item=>item.service==='mobile-required').length,3);
for(const item of D.dining){assert(['seating','mobile-required','counter','snack'].includes(item.service));assert(Number.isFinite(item.x)&&Number.isFinite(item.y));assert(item.oneLine&&item.en&&item.url.startsWith('https://www.tokyodisneyresort.jp/'));}
assert(P.isClosed(D.dining.find(item=>item.officialId===432),'2027-02-06'),'Sakura is officially closed during the trip window');
for(const item of [...D.attractions,...D.excludedAttractions]){assert(item.oneLine&&item.durationLabel,`missing description/duration: ${item.id}`);assert(!item.oneLine.includes('\ufffd'));}
assert(D.attractions.find(item=>item.id===242).oneLine.includes('360°'));
assert.equal(D.party.adults,2);assert.equal(D.party.children,0);
assert.equal(P.nextDpaTime(600,960),660,'a later entry unlocks the next different attraction after 60 minutes');
assert.equal(P.nextDpaTime(600,630),630,'an earlier entry unlocks the next different attraction after 30 minutes');
function checkPlan(date){
  const plan=P.plan(date);let previous=plan.rows[0].start;
  for(const row of plan.rows){
    assert.equal(row.start,previous,`${date}: overlap or unexplained gap before ${row.title}`);
    assert(row.end>=row.start&&row.end<=plan.closing,`${date}: invalid time budget for ${row.title}`);previous=row.end;
    assert(!row.restaurantId,`${date}: restaurant attached to itinerary`);
    if(row.itemId)assert(!P.isClosed(all.get(row.itemId),date),`${date}: closed experience included`);
    if(row.kind==='show'&&!row.tentative)assert(P.showTimes(row.itemId,date).includes(P.clock(row.showStart)),`${date}: invented performance time`);
    if(row.usesDpa){const item=all.get(row.itemId);assert(item.dpa&&(!item.dpaFrom||date>=item.dpaFrom));assert(plan.dpaActions.some(action=>action.dpaItemId===item.id&&action.planned),`${date}: planned DPA has no purchasing reminder`);}
  }
  assert.equal(previous,plan.closing);
  assert.equal(new Set(plan.stops.map(item=>item.id)).size,plan.stops.length);
  assert(plan.stops.every((stop,index)=>stop.order===index+1));
  assert.equal(plan.routePoints.length,plan.stops.length);
  assert(plan.routePoints.every(item=>item.type!=='restaurant'&&item.type!=='show'&&item.id!==257));
  assert.equal(plan.stops.length,plan.rows.filter(row=>row.itemId&&['ride','explore'].includes(row.kind)).length,'only play activities receive route numbers');
  assert(plan.rows.filter(row=>row.kind==='meal').every(row=>!row.itemId&&!row.restaurantId));
  for(const [index,action] of plan.dpaActions.entries()){
    const item=all.get(action.dpaItemId),anchor=plan.rows[action.anchorRowIndex];
    assert(item.dpa&&(!item.dpaFrom||date>=item.dpaFrom));
    assert(plan.rows.some(row=>row.kind==='ride'&&row.itemId===item.id));
    assert(action.targetStart>=action.start+5&&action.targetStart<plan.closing);
    if(index)assert(action.start>=plan.dpaActions[index-1].nextEligible,`${date}: buying before eligible`);
    assert.equal(action.nextEligible,P.nextDpaTime(action.start,action.targetStart));
    assert.equal(action.pairPrice,item.dpa*2);
    assert(anchor&&action.start>=anchor.start&&action.start<anchor.end,`${date}: note attached to wrong activity`);
  }
  assert.equal(plan.dpaExampleCost,plan.dpaActions.reduce((sum,action)=>sum+action.pairPrice,0));
  assert.equal(plan.dpaBudget,plan.rows.filter(row=>row.usesDpa).reduce((sum,row)=>sum+all.get(row.itemId).dpa*2,0));
  return plan;
}
for(const [month,days] of [['2026-11',30],['2027-02',28]])for(let day=1;day<=days;day++){
  const date=`${month}-${String(day).padStart(2,'0')}`,plan=checkPlan(date);assert(plan.knownHours);
  if(month==='2027-02'){assert(!plan.stops.some(item=>item.id===223));assert(plan.stops.some(item=>item.id===224));for(const row of plan.rows.filter(row=>row.kind==='show')){assert(row.tentative);assert.equal(row.showStart,null);}}
}
for(let day=1;day<=6;day++){
  const plan=P.plan(`2027-02-0${day}`),order=id=>plan.stops.findIndex(item=>item.id===id);
  for(const id of [219,224,242,255,222,243])assert(order(id)>=0,`missing required loop stop: ${id}`);
  assert(order(224)<order(242)&&order(242)<order(255)&&order(255)<order(222)&&order(222)<order(243),'loop must visit Fantasy Springs between Raging Spirits and Indiana Jones');
  assert(plan.rows.findIndex(row=>row.itemId===20001)<plan.rows.findIndex(row=>row.itemId===224),'the show reservation stays in the itinerary without becoming a route stop');
  assert.equal(plan.dpaActions[0].dpaItemId,255,'check Frozen immediately after entering');
  assert.equal(plan.dpaActions[0].start,plan.opening+1);
}
const full=P.plan('2026-11-30');assert.equal(full.substitutions.length,0);assert(D.coreIds.every(id=>full.stops.some(item=>item.id===id)));
const feb5=P.plan('2027-02-05'),feb6=P.plan('2027-02-06');
assert.equal(P.clock(feb5.closing),'18:30');assert(!feb5.rows.some(row=>row.itemId===20002));
assert.equal(feb6.rows.filter(row=>row.kind==='show'&&row.tentative).length,2);
assert.equal(feb5.dpaBudget,11000);assert.equal(feb6.dpaBudget,8000);assert.equal(feb6.dpaExampleCost,14000);
assert(!feb6.rows.find(row=>row.kind==='ride').usesDpa);
assert(P.isClosed(all.get(20002),'2027-02-05'));assert(!P.isClosed(all.get(20002),'2027-02-06'));
assert.equal(P.showTimes(20002,'2027-02-06'),null);
assert(feb6.rows.some(row=>row.itemId===20002&&row.tentative),'unpublished shows must remain in the itinerary without joining the route');
const future=P.plan('2027-01-12');assert.equal(future.knownHours,false);assert.equal(P.showTimes(20001,'2027-01-12'),null);
console.log('PASS: 58 daily plans, restaurant-free route, Fantasy Springs loop, confirmed closures, unpublished shows and DPA purchase eligibility.');
console.log(JSON.stringify({date:feb6.date,budgetForTwo:feb6.dpaBudget,route:feb6.rows.map(row=>({time:row.tentative?'场次待公布（已留预算）':P.clock(row.start)+'–'+P.clock(row.end),title:row.title})),dpa:feb6.dpaActions.map(action=>({buy:P.clock(action.start),target:P.clock(action.targetStart),next:P.clock(action.nextEligible),planned:action.planned,title:action.title}))},null,2));
