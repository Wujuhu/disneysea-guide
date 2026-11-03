/* Queue, walking and meal durations are planning budgets, not live wait times. */
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
    222:{ride:3,queue:'50–70',walk:15,block:95},
    242:{ride:1.5,queue:'40–60',walk:20,block:85},
    243:{ride:2,queue:'50–80',walk:30,block:120},
    255:{ride:6.5,queue:'60–100',walk:15,block:130},
    218:{ride:7,queue:'60–90',walk:15,block:115},
    235:{ride:10,queue:'10–25',walk:15,block:50},
    257:{ride:6,queue:'50–70',walk:15,block:95},
    256:{ride:5,queue:'40–60',walk:15,block:85},
    224:{ride:5,queue:'15–35',walk:15,block:55}
  };
  const dpaBudgets={255:{queue:'10–20',walk:15,block:50},243:{queue:'10–20',walk:30,block:55},242:{queue:'10–20',walk:20,block:45}};
  const morningBudgets={219:{queue:'15–35',walk:10,block:55},223:{queue:'20–40',walk:10,block:55},224:{queue:'10–20',walk:10,block:40}};
  const replacements={219:[255,218],223:[224,235,256],222:[235],242:[235],243:[218,256]};
  // Approach Fantasy Springs from Raging Spirits, then leave toward Indiana Jones and Port Discovery.
  const loopOrder=[223,224,235,242,255,256,257,222,243,218];
  function dpaActionsFor(rows,date,opening){
    const priority=[255,243,242,222,257,256,223,218,219];
    const candidates=rows.filter(row=>row.kind==='ride'&&all.get(row.itemId).dpa&&(!all.get(row.itemId).dpaFrom||date>=all.get(row.itemId).dpaFrom)).sort((a,b)=>priority.indexOf(a.itemId)-priority.indexOf(b.itemId));
    const actions=[];let purchaseAt=opening+1;
    for(const row of candidates){
      if(actions.length===4)break;
      const targetStart=Math.ceil((row.start+row.walk)/5)*5;
      if(targetStart<purchaseAt+5)continue;
      let anchorRowIndex=rows.findIndex(entry=>entry.start<=purchaseAt&&purchaseAt<entry.end),phase=rows[anchorRowIndex];
      if(!phase)continue;
      if(phase.kind==='ride'&&purchaseAt>=phase.end-phase.ride){
        purchaseAt=phase.end;anchorRowIndex=rows.findIndex(entry=>entry.start<=purchaseAt&&purchaseAt<entry.end);phase=rows[anchorRowIndex];
      }
      if(!phase||targetStart<purchaseAt+5)continue;
      const item=all.get(row.itemId),nextEligible=nextDpaTime(purchaseAt,targetStart);
      const context=phase.kind==='prepare'?'入园后先查':phase.kind==='ride'?`排${all.get(phase.itemId).short}的队时查`:phase.kind==='meal'?'吃饭休息时查':phase.kind==='show'?'等演出入场时查':'在海港休息时查';
      actions.push({kind:'dpa-check',dpaItemId:item.id,title:`DPA · ${item.short}`,start:purchaseAt,end:purchaseAt,targetStart,nextEligible,anchorRowIndex,pairPrice:item.dpa*D.party.adults,planned:Boolean(row.usesDpa),description:`${context}。${row.usesDpa?'本段按买到此 DPA 的等待时间预算；没买到时，先比较普通队列，再删减后续项目。':'可选：普通排队已留预算，队长且愿意付费再买。'}`});
      purchaseAt=nextEligible;
    }
    return actions;
  }
  function plan(date){
    const park=hours(date),knownHours=Boolean(park),opening=minute(park?.open||'09:00'),closing=minute(park?.close||'21:00');
    const rows=[],substitutions=[],unavailable=[],used=new Set(),rides=[];
    const available=item=>!isClosed(item,date);
    // Early-closing days also budget Raging Spirits DPA to keep the longer loop practical.
    const plannedDpa=new Set([255,243,...(closing-opening<660?[242]:[])]);
    for(const coreId of D.coreIds){
      const core=all.get(coreId);let item=core;
      if(!available(core)){
        const replacement=(replacements[coreId]||[]).find(id=>!used.has(id)&&available(all.get(id)));
        if(!replacement){unavailable.push(core);continue;}
        item=all.get(replacement);substitutions.push({from:core,to:item});
      }
      if(!used.has(item.id)){used.add(item.id);rides.push(item);}
    }
    const fantasyId=[255,256].find(id=>available(all.get(id)));
    if(fantasyId&&!used.has(fantasyId)){rides.push(all.get(fantasyId));used.add(fantasyId);}
    let cursor=opening;
    const add=row=>{rows.push(row);cursor=Math.max(cursor,row.end);};
    function ride(item,early=false){
      const usesDpa=!early&&plannedDpa.has(item.id)&&Boolean(item.dpa)&&(!item.dpaFrom||date>=item.dpaFrom);
      const b={...budgets[item.id],...(early?morningBudgets[item.id]:{}),...(usesDpa?dpaBudgets[item.id]:{})};
      const viaAreas=[],notes=[];
      if(item.id===242){viaAreas.push('mermaid','arabian');notes.push('经美人鱼礁湖、阿拉伯海岸往园区深处走，随后去梦幻泉乡。');}
      if(item.area==='fantasy')notes.push('在梦幻泉乡游玩；结束后从同一片连接区出来，顺路去印第安纳琼斯。');
      if(item.id===222&&rows.some(row=>all.get(row.itemId)?.area==='fantasy'))notes.push('从梦幻泉乡出来后玩印第安纳琼斯，接着向发现港走。');
      if(item.area==='american'){viaAreas.push('port');notes.push('经发现港步行到美国海滨，不再回园区深处。');}
      if(usesDpa)notes.push('按买到 DPA 预算；若没买到，普通队列可能明显更久，优先缩减同区项目或放弃此项，别为追时段横穿全园。');
      add({kind:'ride',itemId:item.id,title:item.short,start:cursor,end:cursor+b.block,...b,usesDpa,viaAreas,description:notes.join('')});
    }
    add({kind:'arrival',title:'抵达入口',start:opening-45,end:opening,description:'预留安检与入园时间。'});
    add({kind:'prepare',title:'入园，先查梦幻泉乡 DPA',start:opening,end:opening+5,description:'两张门票放进同一 App 群组；优先查冰雪奇缘下午的时段，同时查看想吃的餐厅能否提前点餐。'});
    if(rides.length)ride(rides.shift(),true);
    rides.sort((a,b)=>loopOrder.indexOf(a.id)-loopOrder.indexOf(b.id));
    const dayTimes=available(all.get(20001))?showTimes(20001,date):[],nightTimes=available(all.get(20002))?showTimes(20002,date):[];
    const dayTentative=dayTimes===null,dayStart=dayTentative?Math.max(opening+150,cursor+25):dayTimes.map(minute).find(t=>t>=cursor+25);
    if(dayStart!=null){
      if(cursor<dayStart-20)add({kind:'break',title:'海港附近自由活动',start:cursor,end:dayStart-20,description:'在海港附近休息、拍照，顺手查下一张 DPA；先不去远区，以免为花船折返。场次公布后再调整这段余量。'});
      add({kind:'show',itemId:20001,title:all.get(20001).name+(dayTentative?'（场次待公布）':''),start:dayStart-20,end:dayStart+15,showStart:dayTentative?null:dayStart,ride:15,prepare:20,tentative:dayTentative});
    }
    const lunchStart=Math.max(cursor,opening+120);
    if(cursor<lunchStart)add({kind:'break',title:'海港附近休息',start:cursor,end:lunchStart,description:'在附近休息，不为固定餐厅绕路。'});
    add({kind:'meal',title:'午餐与休息 · 就近自选',start:cursor,end:cursor+30,description:'只留约 30 分钟简餐预算，不指定餐厅。若想吃需订座或热门餐厅，提前看“吃饭”页的操作时点；正式桌餐另留 60–90 分钟。'});
    const nightTentative=nightTimes===null,nightStart=nightTentative?Math.min(opening+615,closing-75):nightTimes.length?minute(nightTimes[0]):null;
    const rideDeadline=nightStart!=null?nightStart-75:closing-45;
    for(const item of rides){
      const usesDpa=plannedDpa.has(item.id)&&item.dpa&&(!item.dpaFrom||date>=item.dpaFrom),block=usesDpa?(dpaBudgets[item.id]?.block||budgets[item.id].block):budgets[item.id].block;
      if(cursor+block>rideDeadline){unavailable.push(item);continue;}
      ride(item);
    }
    add({kind:'meal',title:'晚餐与休息 · 就近自选',start:cursor,end:Math.min(cursor+30,closing-15),description:'在当前区域就近吃饭，不把餐厅接入路线。移动点餐提前选好时段；若订了桌餐，按实际预约调整后续活动。'});
    if(nightStart!=null){
      if(cursor<nightStart-30)add({kind:'walk',title:'沿美国海滨回到海港',start:cursor,end:nightStart-30,description:'步行约 15–20 分钟，其余余量用于休息；不再折返远端项目。'});
      add({kind:'show',itemId:20002,title:all.get(20002).name+(nightTentative?'（场次待公布）':''),start:nightStart-30,end:nightStart+30,showStart:nightTentative?null:nightStart,ride:30,prepare:30,optional:true,tentative:nightTentative});
    }
    if(cursor<closing)add({kind:'exit',title:'海港夜景、购物后离园',start:cursor,end:closing,description:'按当前余量休息、购物或在附近加玩；不再为远处项目走回头路。'});
    const unresolvedShows=D.shows.filter(show=>showTimes(show.id,date)===null&&available(show)&&!rows.some(row=>row.itemId===show.id));
    const stops=rows.filter(row=>row.itemId&&['ride','explore'].includes(row.kind)).map((row,index)=>({...all.get(row.itemId),order:index+1}));
    const routePoints=stops.map(item=>({...item}));
    const dpaActions=dpaActionsFor(rows,date,opening),areaNames=new Map(D.areas.map(area=>[area.id,area.name]));
    const routeAreas=rows.flatMap(row=>[...(row.viaAreas||[]),...(row.itemId?[all.get(row.itemId).area]:[])]).filter((area,index,list)=>area!==list[index-1]);
    const dpaBudget=rows.filter(row=>row.usesDpa).reduce((sum,row)=>sum+all.get(row.itemId).dpa*D.party.adults,0);
    return {date,knownHours,opening,closing,rows,stops,routePoints,substitutions,unavailable,unresolvedShows,dpaActions,party:D.party,routeSummary:routeAreas.map(area=>areaNames.get(area)).join(' → '),dpaExampleCost:dpaActions.reduce((sum,action)=>sum+action.pairPrice,0),dpaBudget};
  }
  window.GuidePlanner={plan,hours,showTimes,clock,isClosed,nextDpaTime};
})();
