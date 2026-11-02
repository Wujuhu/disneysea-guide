const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const context={window:{}};
for(const file of ['data.js','planner.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const D=context.window.DISNEY_DATA,P=context.window.GuidePlanner;
const all=new Map([...D.attractions,...D.shows,...D.dining].map(item=>[item.id,item]));
assert.equal(D.attractions.length,32);
assert.equal(D.shows.length,2);
assert(!all.has(246));
assert.equal(D.excludedAttractions.length,1);
assert.equal(D.excludedAttractions[0].id,246);
for(const item of [...D.attractions,...D.excludedAttractions]){assert(item.oneLine&&item.durationLabel,`missing plain description or duration: ${item.id}`);assert(!item.oneLine.includes('\ufffd'));}
assert(D.attractions.find(item=>item.id===242).oneLine.includes('360°'));
assert.equal(D.party.adults,2);
assert.equal(D.party.children,0);
assert.equal(P.nextDpaTime(600,995),660,'a later entry window unlocks another attraction after 60 minutes');
assert.equal(P.nextDpaTime(600,630),630,'an earlier entry window unlocks another attraction before 60 minutes');
function checkDPA(date,plan){
  for(const [index,action] of plan.dpaActions.entries()){
    const item=all.get(action.dpaItemId);
    assert(item.dpa&&(!item.dpaFrom||date>=item.dpaFrom),`${date}: DPA not offered for this attraction/date`);
    assert(plan.rows.some(row=>row.kind==='ride'&&row.itemId===item.id),`${date}: DPA reminder targets an unscheduled ride`);
    assert(action.targetStart>=action.start+5&&action.targetStart<plan.closing,`${date}: unusable target window`);
    if(index)assert(action.start>=plan.dpaActions[index-1].nextEligible,`${date}: next purchase is too early`);
    assert.equal(action.pairPrice,item.dpa*2);
    const anchor=plan.rows[action.anchorRowIndex];assert(anchor&&action.start>=anchor.start&&action.start<=anchor.end,`${date}: DPA note is not attached to its current activity`);
  }
  assert.equal(plan.dpaExampleCost,plan.dpaActions.reduce((sum,action)=>sum+action.pairPrice,0));
}
for(let day=1;day<=30;day++){
  const date=`2026-11-${String(day).padStart(2,'0')}`,plan=P.plan(date);
  checkDPA(date,plan);
  let previous=plan.rows[0].start;
  for(const row of plan.rows){
    assert(row.start>=previous,`${date}: overlapping ${row.title}`);
    assert.equal(row.start,previous,`${date}: unexplained gap before ${row.title}`);
    assert(row.end>=row.start,`${date}: negative duration`);
    assert(row.end<=plan.closing,`${date}: exceeds closing time`);
    previous=row.end;
    if(row.itemId)assert(!P.isClosed(all.get(row.itemId),date),`${date}: closed experience included`);
    if(row.kind==='show'&&!row.tentative)assert(P.showTimes(row.itemId,date).includes(P.clock(row.showStart)),`${date}: invented performance time`);
  }
  assert.equal(new Set(plan.stops.map(item=>item.id)).size,plan.stops.length);
  assert(plan.stops.every((stop,index)=>stop.order===index+1));
  assert.equal(plan.routePoints.filter(item=>item.type==='restaurant').length,2);
  assert.equal(plan.routePoints.length,plan.stops.length+2);
  assert(plan.rows.filter(row=>row.kind==='meal').every(row=>all.get(row.restaurantId)?.type==='restaurant'));
}
const first=P.plan('2026-11-01');
assert.equal(first.substitutions.length,2);
assert(first.stops.some(item=>item.id===255));
assert(!first.stops.some(item=>item.id===222));
const early=P.plan('2026-11-27');
assert.equal(P.clock(early.closing),'18:30');
assert(!early.stops.some(item=>item.id===20002));
const full=P.plan('2026-11-30');
assert.equal(full.substitutions.length,0);
assert(D.coreIds.every(id=>full.stops.some(item=>item.id===id)));
const future=P.plan('2027-01-12');
assert.equal(future.knownHours,false);
assert.equal(P.showTimes(20001,'2027-01-12'),null);
assert(!future.stops.some(item=>item.id===223));
for(let day=1;day<=28;day++){
  const date=`2027-02-${String(day).padStart(2,'0')}`,plan=P.plan(date);
  checkDPA(date,plan);
  assert(plan.knownHours);
  let previous=-Infinity;
  for(const row of plan.rows){assert(row.start>=previous&&row.end>=row.start&&row.end<=plan.closing,date);previous=row.end;if(row.itemId)assert(!P.isClosed(all.get(row.itemId),date));if(row.kind==='show'){assert(row.tentative);assert.equal(row.showStart,null);}}
  assert(!plan.stops.some(item=>item.id===223));
  assert(plan.stops.some(item=>item.id===224));
}
const feb5=P.plan('2027-02-05'),feb6=P.plan('2027-02-06');
assert.equal(P.clock(feb5.closing),'18:30');
assert(!feb5.stops.some(item=>item.id===20002));
assert.equal(feb6.rows.filter(row=>row.kind==='show'&&row.tentative).length,2);
assert.equal(feb6.dpaBudget,0);
assert(!feb6.rows.find(row=>row.kind==='ride').dpa);
assert.equal(feb6.dpaActions.length,3);
assert.equal(feb6.dpaActions[0].start,10*60+10);
assert.equal(feb6.dpaExampleCost,9000);
const distance=points=>points.slice(1).reduce((sum,item,index)=>sum+Math.hypot(item.x-points[index].x,item.y-points[index].y),0);
const oldRoute=[219,224,20001,30001,222,242,243,30002,20002].map(id=>all.get(id));
const comparedIds=new Set(oldRoute.map(item=>item.id));
assert(distance(feb6.routePoints.filter(item=>comparedIds.has(item.id)))<distance(oldRoute),'the core route should reduce geographic backtracking');
assert(feb6.stops.findIndex(item=>item.id===20001)<feb6.stops.findIndex(item=>item.id===224),'finish the harbor show before heading into the park');
assert(feb6.stops.findIndex(item=>item.id===242)<feb6.stops.findIndex(item=>item.id===222),'visit adjacent Lost River Delta stops consecutively before heading to American Waterfront');
const filtered=P.plan('2027-02-06',{hideClosedDuringWindow:true});
assert(P.closedDuringWindow(all.get(223))&&P.closedDuringWindow(all.get(20002)));
assert(!P.isClosed(all.get(20002),'2027-02-06'),'period filtering must not rewrite actual day-specific closure facts');
assert(!filtered.stops.some(item=>item.id===20002));
assert(filtered.stops.some(item=>item.id===230)&&filtered.stops.some(item=>item.id===244),'fill the morning with nearby activities');
assert(filtered.stops.some(item=>item.id===218),'use the evening for Toy Story when no night show is selected');
assert.equal(filtered.dpaActions.length,4);
assert.equal(filtered.dpaExampleCost,13000);
checkDPA('2027-02-06',filtered);
assert(filtered.dpaActions.find(action=>action.dpaItemId===218).start>=filtered.rows.find(row=>row.itemId===224).end,'operate after getting off the submarine');
for(let day=1;day<=6;day++){const date=`2027-02-0${day}`,plan=P.plan(date,{hideClosedDuringWindow:true});checkDPA(date,plan);for(const row of plan.rows)if(row.itemId)assert(!P.closedDuringWindow(all.get(row.itemId)));}
console.log('PASS: continuous daily plans, adult morning activities, interval closures, recoverable exclusions, durations and parallel DPA eligibility verified.');
console.log(JSON.stringify({reference:'2027-02-06',dpaExampleCostForTwo:feb6.dpaExampleCost,route:feb6.rows.map(row=>({time:row.tentative?'场次待公布（已留预算）':P.clock(row.start)+'-'+P.clock(row.end),title:row.title})),dpa:feb6.dpaActions.map(action=>({buy:P.clock(action.start),target:P.clock(action.targetStart),next:P.clock(action.nextEligible),title:action.title}))},null,2));
