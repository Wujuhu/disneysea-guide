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
  }
  assert.equal(plan.dpaExampleCost,plan.dpaActions.reduce((sum,action)=>sum+action.pairPrice,0));
}
for(let day=1;day<=30;day++){
  const date=`2026-11-${String(day).padStart(2,'0')}`,plan=P.plan(date);
  checkDPA(date,plan);
  let previous=-Infinity;
  for(const row of plan.rows){
    assert(row.start>=previous,`${date}: overlapping ${row.title}`);
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
assert.equal(feb6.dpaActions[0].start,10*60);
assert.equal(feb6.dpaExampleCost,9000);
const distance=points=>points.slice(1).reduce((sum,item,index)=>sum+Math.hypot(item.x-points[index].x,item.y-points[index].y),0);
const oldRoute=[219,224,20001,30001,222,242,243,30002,20002].map(id=>all.get(id));
assert(distance(feb6.routePoints)<distance(oldRoute),'the revised loop should reduce geographic backtracking');
assert(feb6.stops.findIndex(item=>item.id===20001)<feb6.stops.findIndex(item=>item.id===224),'finish the harbor show before heading into the park');
assert(feb6.stops.findIndex(item=>item.id===242)<feb6.stops.findIndex(item=>item.id===222),'cross Lost River Delta from east to west');
console.log('PASS: 58 daily plans; no overlaps, closed rides or invented showtimes; adult route, less backtracking and DPA purchase eligibility verified.');
console.log(JSON.stringify({reference:'2027-02-06',dpaExampleCostForTwo:feb6.dpaExampleCost,route:feb6.rows.map(row=>({time:row.tentative?'场次待公布（已留预算）':P.clock(row.start)+'-'+P.clock(row.end),title:row.title})),dpa:feb6.dpaActions.map(action=>({buy:P.clock(action.start),target:P.clock(action.targetStart),next:P.clock(action.nextEligible),title:action.title}))},null,2));
