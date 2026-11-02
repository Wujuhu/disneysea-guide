/* Planning budgets are editorial estimates, not measured live wait times. */
(() => {
  const D=window.DISNEY_DATA;
  const all=new Map([...D.attractions,...D.shows,...D.dining].map(item=>[item.id,item]));
  const minute=time=>{const [h,m]=time.split(':').map(Number);return h*60+m;};
  const clock=value=>`${String(Math.floor(value/60)).padStart(2,'0')}:${String(Math.round(value%60)).padStart(2,'0')}`;
  const nextDpaTime=(purchasedAt,entryStart)=>Math.min(purchasedAt+60,entryStart);
  const isClosed=(item,date)=>item.closures.some(([start,end])=>date>=start&&(!end||date<=end));
  function hours(date){const calendar=D.parkCalendars[date.slice(0,7)],day=Number(date.slice(8));return calendar&&day>=1&&day<=calendar.days?{...(calendar.exceptions[date]||{open:calendar.open,close:calendar.close}),url:calendar.url}:null;}
  function showTimes(id,date){if(isClosed(all.get(id),date))return [];return D.showSchedule[date]?.[id]??null;}
  const budgets={
    219:{ride:5,queue:'45–70',walk:10,block:90},
    223:{ride:3,queue:'35–60',walk:15,block:80},
    222:{ride:3,queue:'60–80',walk:15,block:100},
    242:{ride:1.5,queue:'40–60',walk:10,block:75},
    243:{ride:2,queue:'50–80',walk:25,block:110},
    255:{ride:6.5,queue:'60–80',walk:20,block:110},
    218:{ride:7,queue:'60–90',walk:20,block:120},
    235:{ride:10,queue:'10–25',walk:15,block:50},
    257:{ride:6,queue:'50–70',walk:15,block:95},
    256:{ride:5,queue:'40–60',walk:15,block:85}
    ,224:{ride:5,queue:'15–35',walk:15,block:55}
  };
  const morningBudgets={
    219:{queue:'15–35',walk:10,block:55},
    223:{queue:'20–40',walk:10,block:55},
    224:{queue:'10–20',walk:10,block:40}
  };
  const replacements={219:[255,218],223:[224,235,256],222:[255,257],242:[257,235],243:[218,256]};
  const loopOrder=[223,224,235,255,256,257,242,222,247,243,218];
  function dpaActionsFor(rows,date,opening,knownHours){
    const priority=[243,242,222,255,257,256,223,218];
    const candidates=rows.filter(row=>row.kind==='ride').filter(row=>{const item=all.get(row.itemId);return item.dpa&&(!item.dpaFrom||date>=item.dpaFrom);}).sort((a,b)=>priority.indexOf(a.itemId)-priority.indexOf(b.itemId));
    const actions=[];let purchaseAt=opening+60;
    const timeLabel=value=>knownHours?clock(value):`开园后 ${Math.floor((value-opening)/60)}:${String((value-opening)%60).padStart(2,'0')}`;
    for(const row of candidates){
      if(actions.length===3)break;
      const targetStart=Math.ceil((row.start+row.walk)/5)*5;
      if(targetStart<purchaseAt+5)continue;
      const item=all.get(row.itemId),nextEligible=nextDpaTime(purchaseAt,targetStart),phase=rows.find(entry=>entry.start<=purchaseAt&&purchaseAt<entry.end);
      const context=phase?.kind==='ride'?`在${all.get(phase.itemId).short}这一站排队或休息时`:phase?.kind==='meal'?`${all.get(phase.restaurantId).meal}时`:phase?.kind==='show'?'等花船或演出时':actions.length===0?'翱翔排队中或结束后':'在海港等场或休息时';
      actions.push({kind:'dpa-check',dpaItemId:item.id,title:`DPA · ${item.short}`,start:purchaseAt,end:purchaseAt,targetStart,nextEligible,pairPrice:item.dpa*D.party.adults,description:`${context}查看余量，合适再买。若 ${timeLabel(purchaseAt)} 付款，最早 ${timeLabel(nextEligible)} 可买另一项目。`});
      purchaseAt=nextEligible;
    }
    return actions;
  }
  function plan(date){
    const park=hours(date),knownHours=Boolean(park),opening=minute(park?.open||'09:00'),closing=minute(park?.close||'21:00');
    const rows=[],substitutions=[],unavailable=[],used=new Set(),rides=[];
    for(const coreId of D.coreIds){
      const core=all.get(coreId);
      let item=core;
      if(isClosed(core,date)){
        const replacement=(replacements[coreId]||[]).find(id=>!used.has(id)&&!isClosed(all.get(id),date));
        if(!replacement){unavailable.push(core);continue;}
        item=all.get(replacement);substitutions.push({from:core,to:item});
      }
      if(used.has(item.id))continue;
      used.add(item.id);rides.push(item);
    }
    let cursor=opening;
    function add(row){rows.push(row);if(row.end!=null)cursor=Math.max(cursor,row.end);}
    function ride(item,early=false){
      const b={...budgets[item.id],...(early?morningBudgets[item.id]:{})},previous=rows.findLast(row=>row.itemId||row.restaurantId);
      if(item.id===242&&[223,224].includes(previous?.itemId)){b.walk+=5;b.block+=5;}
      if(item.id===222&&previous?.itemId===242){b.walk-=5;b.block-=5;}
      add({kind:'ride',itemId:item.id,title:item.short,start:cursor,end:cursor+b.block,...b});
    }
    add({kind:'arrival',title:'抵达入口',start:opening-45,end:opening,description:'预留安检与入园时间。'});
    add({kind:'prepare',title:'两位成人入园，查看队列',start:opening,end:opening+5,description:'先把两张门票加入同一 App 群组。翱翔短队先玩；若它是必玩且库存紧，入园就先查 DPA。'});
    if(rides.length)ride(rides.shift(),true);
    rides.sort((a,b)=>loopOrder.indexOf(a.id)-loopOrder.indexOf(b.id));
    const dayTimes=showTimes(20001,date),nightTimes=showTimes(20002,date);
    const dayTentative=dayTimes===null;
    const dayStart=dayTentative?Math.max(opening+150,cursor+25):dayTimes?.map(minute).find(t=>t>=cursor+25);
    if(dayStart!=null){
      if(cursor<dayStart-20)add({kind:'free',title:'留在海港，拍照或就近短队',start:cursor,end:dayStart-20,description:'可看贡多拉、要塞探险的短队；不先去火山再折返看花船。'});
      add({kind:'show',itemId:20001,title:all.get(20001).name+(dayTentative?'（场次待公布）':''),start:dayStart-20,end:dayStart+15,showStart:dayTentative?null:dayStart,ride:15,prepare:20,tentative:dayTentative});
    }
    const lunchStart=Math.max(cursor+5,opening+120);
    if(cursor<lunchStart)add({kind:'free',title:'海港散步或短暂休息',start:cursor,end:lunchStart});
    add({kind:'meal',restaurantId:30001,title:'午餐 · 尚比尼兄弟餐厅',start:lunchStart,end:lunchStart+30,description:'看完花船就近吃饭。两位成人按提前移动点餐、取餐和简餐合计约 30 分钟预算。'});
    const nightTentative=nightTimes===null;
    const nightStart=nightTentative?Math.min(opening+615,closing-75):nightTimes?.length?minute(nightTimes[0]):null;
    const rideDeadline=nightStart!=null?nightStart-75:closing-45;
    for(const item of rides){
      if(cursor+budgets[item.id].block>rideDeadline){unavailable.push(item);continue;}
      ride(item);
    }
    const dinnerStart=cursor;
    add({kind:'meal',restaurantId:30002,title:'晚餐 · 纽约美味房',start:dinnerStart,end:Math.min(dinnerStart+30,closing-15),description:'在美国海滨完成古塔后吃饭，步行、移动点餐取餐和简餐合计约 30 分钟预算；随后回海港。'});
    if(nightStart!=null){
      if(cursor<nightStart-30)add({kind:'walk',title:'沿美国海滨回到海港',start:cursor,end:nightStart-30,description:'两位成人步行约 15 分钟预算；若余量更大，可休息或购物，不再折返远端项目。'});
      add({kind:'show',itemId:20002,title:all.get(20002).name+(nightTentative?'（场次待公布）':''),start:nightStart-30,end:nightStart+30,showStart:nightTentative?null:nightStart,ride:30,prepare:30,optional:true,tentative:nightTentative});
    }
    if(cursor<closing)add({kind:'exit',title:'自由活动，预留离园时间',start:cursor,end:closing,description:'不再安排长队项目，按当天闭园时间离园。'});
    const unresolvedShows=D.shows.filter(show=>showTimes(show.id,date)===null&&!isClosed(show,date)&&!rows.some(row=>row.itemId===show.id));
    const stops=rows.filter(row=>row.itemId).map(row=>({...all.get(row.itemId),order:0,tentative:Boolean(row.tentative)}));
    stops.forEach((item,index)=>item.order=index+1);
    const routePoints=rows.filter(row=>row.itemId||row.restaurantId).map(row=>({...all.get(row.itemId||row.restaurantId),tentative:Boolean(row.tentative)}));
    const dpaActions=dpaActionsFor(rows,date,opening,knownHours),areaNames=new Map(D.areas.map(area=>[area.id,area.name]));
    const routeAreas=routePoints.map(item=>item.area).filter((area,index,list)=>area!==list[index-1]);
    return {date,knownHours,opening,closing,rows,stops,routePoints,substitutions,unavailable,unresolvedShows,dpaActions,party:D.party,routeSummary:routeAreas.map(area=>areaNames.get(area)).join(' → '),dpaExampleCost:dpaActions.reduce((sum,action)=>sum+action.pairPrice,0),dpaBudget:0};
  }
  window.GuidePlanner={plan,hours,showTimes,clock,isClosed,nextDpaTime};
})();
