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
    ,224:{ride:5,queue:'15–35',walk:15,block:55},
    230:{ride:11.5,queue:'10–20',walk:12,block:45},
    244:{ride:20,queue:'0',walk:5,block:25}
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
    const actions=[];let purchaseAt=opening+70;
    const timeLabel=value=>knownHours?clock(value):`开园后 ${Math.floor((value-opening)/60)}:${String((value-opening)%60).padStart(2,'0')}`;
    for(const row of candidates){
      if(actions.length===4)break;
      const targetStart=Math.ceil((row.start+row.walk)/5)*5;
      if(targetStart<purchaseAt+5)continue;
      let anchorRowIndex=rows.findIndex(entry=>entry.start<=purchaseAt&&purchaseAt<entry.end),phase=rows[anchorRowIndex],afterRide=false;
      if(phase?.kind==='ride'&&purchaseAt>=phase.end-phase.ride){purchaseAt=phase.end;afterRide=true;}
      const item=all.get(row.itemId),nextEligible=nextDpaTime(purchaseAt,targetStart);
      const context=afterRide?`${all.get(phase.itemId).short}结束后`:phase?.kind==='ride'?`排${all.get(phase.itemId).short}的队时`:phase?.kind==='explore'?`在${all.get(phase.itemId).short}休息时`:phase?.kind==='meal'?`${all.get(phase.restaurantId).meal}时`:phase?.kind==='show'?'等花船或演出入场时':'在海港短暂停留时';
      actions.push({kind:'dpa-check',dpaItemId:item.id,title:`DPA · ${item.short}`,start:purchaseAt,end:purchaseAt,targetStart,nextEligible,anchorRowIndex,pairPrice:item.dpa*D.party.adults,description:`${context}查看余量，有合适时段再买。`});
      purchaseAt=nextEligible;
    }
    return actions;
  }
  function plan(date){
    const park=hours(date),knownHours=Boolean(park),opening=minute(park?.open||'09:00'),closing=minute(park?.close||'21:00');
    const rows=[],substitutions=[],unavailable=[],used=new Set(),rides=[];
    const unavailableForPlan=item=>isClosed(item,date);
    for(const coreId of D.coreIds){
      const core=all.get(coreId);
      let item=core;
      if(unavailableForPlan(core)){
        const replacement=(replacements[coreId]||[]).find(id=>!used.has(id)&&!unavailableForPlan(all.get(id)));
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
    const dayTimes=unavailableForPlan(all.get(20001))?[]:showTimes(20001,date),nightTimes=unavailableForPlan(all.get(20002))?[]:showTimes(20002,date);
    const dayTentative=dayTimes===null;
    const dayStart=dayTentative?Math.max(opening+150,cursor+25):dayTimes?.map(minute).find(t=>t>=cursor+25);
    const morningCutoff=dayStart!=null?dayStart-20:opening+135;
    for(const id of [230,244]){
      const item=all.get(id),b=budgets[id];
      if(!used.has(id)&&!unavailableForPlan(item)&&cursor+b.block<=morningCutoff){
        add({kind:id===244?'explore':'ride',itemId:id,title:item.short,start:cursor,end:cursor+b.block,...b,description:id===230?'先步行到运河乘贡多拉；如果队伍超出预算或临时停运，就直接去要塞探险。':'沿海港探索帆船、楼梯和房间，按约 20 分钟控制停留，随后去看花船。'});used.add(id);
      }
    }
    if(dayStart!=null){
      if(cursor<dayStart-20)add({kind:'walk',title:'走到海港岸边找观赏位置',start:cursor,end:dayStart-20,description:'结束附近项目后沿海港步行；余量不足时缩短要塞停留，不跨区折返。'});
      add({kind:'show',itemId:20001,title:all.get(20001).name+(dayTentative?'（场次待公布）':''),start:dayStart-20,end:dayStart+15,showStart:dayTentative?null:dayStart,ride:15,prepare:20,tentative:dayTentative});
    }
    const lunchStart=Math.max(cursor+5,opening+120);
    if(cursor<lunchStart)add({kind:'walk',title:'步行到尚比尼兄弟餐厅',start:cursor,end:lunchStart,description:'看完花船后沿海港走到餐厅。'});
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
    if(nightStart==null&&!used.has(218)&&!unavailableForPlan(all.get(218))&&cursor+budgets[218].block<=closing-15){ride(all.get(218));used.add(218);}
    if(cursor<closing)add({kind:'exit',title:'海港夜景、购物后离园',start:cursor,end:closing,description:'沿美国海滨或地中海港湾回入口，给最后步行、取物和离园留出时间。'});
    const unresolvedShows=D.shows.filter(show=>showTimes(show.id,date)===null&&!unavailableForPlan(show)&&!rows.some(row=>row.itemId===show.id));
    const stops=rows.filter(row=>row.itemId).map(row=>({...all.get(row.itemId),order:0,tentative:Boolean(row.tentative)}));
    stops.forEach((item,index)=>item.order=index+1);
    const routePoints=rows.filter(row=>row.itemId||row.restaurantId).map(row=>({...all.get(row.itemId||row.restaurantId),tentative:Boolean(row.tentative)}));
    const dpaActions=dpaActionsFor(rows,date,opening,knownHours),areaNames=new Map(D.areas.map(area=>[area.id,area.name]));
    const routeAreas=routePoints.map(item=>item.area).filter((area,index,list)=>area!==list[index-1]);
    return {date,knownHours,opening,closing,rows,stops,routePoints,substitutions,unavailable,unresolvedShows,dpaActions,party:D.party,routeSummary:routeAreas.map(area=>areaNames.get(area)).join(' → '),dpaExampleCost:dpaActions.reduce((sum,action)=>sum+action.pairPrice,0),dpaBudget:0};
  }
  window.GuidePlanner={plan,hours,showTimes,clock,isClosed,nextDpaTime};
})();
