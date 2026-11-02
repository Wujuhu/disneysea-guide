/* Planning budgets are editorial estimates, not measured live wait times. */
(() => {
  const D=window.DISNEY_DATA;
  const all=new Map([...D.attractions,...D.shows,...D.dining].map(item=>[item.id,item]));
  const minute=time=>{const [h,m]=time.split(':').map(Number);return h*60+m;};
  const clock=value=>`${String(Math.floor(value/60)).padStart(2,'0')}:${String(Math.round(value%60)).padStart(2,'0')}`;
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
    function ride(item,early=false){const b={...budgets[item.id],...(early?morningBudgets[item.id]:{})};add({kind:'ride',itemId:item.id,title:item.short,start:cursor,end:cursor+b.block,...b});}
    function assessDPA(){const start=Math.max(cursor,opening+90);if(cursor<start)add({kind:'free',title:'就近短队或休息',start:cursor,end:start});add({kind:'dpa-check',title:'看排队，决定是否买 DPA',start,end:start+5,description:'约 10–11 点评估长队项目。DPA 可能售完，必玩项目应先确认余量。'});}
    add({kind:'arrival',title:'抵达入口',start:opening-45,end:opening,description:'预留安检与入园时间。'});
    add({kind:'prepare',title:'入园，查看队列',start:opening,end:opening+5,description:'短队先玩；本方案不预先购买 DPA。'});
    if(rides.length)ride(rides.shift(),true);
    const dayTimes=showTimes(20001,date),nightTimes=showTimes(20002,date);
    const dayTentative=dayTimes===null;
    const dayStart=dayTentative?Math.max(opening+150,cursor+25):dayTimes?.map(minute).find(t=>t>=cursor+25);
    if(dayStart!=null){
      const nextBlock=rides.length?(morningBudgets[rides[0].id]?.block||budgets[rides[0].id].block):Infinity;
      if(rides.length&&cursor+nextBlock+15<=dayStart-20)ride(rides.shift(),true);
      if(Math.max(cursor,opening+90)+5<=dayStart-20)assessDPA();
      if(cursor<dayStart-20)add({kind:'walk',title:'返回海港，沿途拍照',start:cursor,end:dayStart-20,description:'回到地中海港湾岸边，给找观赏位置留出余量。'});
      add({kind:'show',itemId:20001,title:all.get(20001).name+(dayTentative?'（场次待公布）':''),start:dayStart-20,end:dayStart+15,showStart:dayTentative?null:dayStart,ride:15,prepare:20,tentative:dayTentative});
    }
    if(!rows.some(row=>row.kind==='dpa-check'))assessDPA();
    const lunchStart=Math.max(cursor+5,opening+120);
    if(cursor<lunchStart)add({kind:'free',title:'海港散步或短暂休息',start:cursor,end:lunchStart});
    add({kind:'meal',restaurantId:30001,title:'午餐 · 尚比尼兄弟餐厅',start:lunchStart,end:lunchStart+40,description:'就在地中海港湾。提前在 App 点餐，取餐预留约 10–15 分钟，按选定时段到店。'});
    const nightTentative=nightTimes===null;
    const nightStart=nightTentative?Math.min(opening+615,closing-75):nightTimes?.length?minute(nightTimes[0]):null;
    const rideDeadline=nightStart!=null?nightStart-100:closing-85;
    for(const item of rides){
      if(cursor+budgets[item.id].block>rideDeadline){unavailable.push(item);continue;}
      ride(item);
    }
    const dinnerStart=cursor;
    add({kind:'meal',restaurantId:30002,title:'晚餐 · 纽约美味房',start:dinnerStart,end:Math.min(dinnerStart+40,closing-40),description:'在美国海滨用餐和休息，可用 App 移动点餐；吃完再返回海港或出口。'});
    if(nightStart!=null){
      if(cursor<nightStart-30)add({kind:'free',title:'返回海港 · 机动时间',start:cursor,end:nightStart-30,description:'步行预留约 20–30 分钟，其余时间可购物、休息；加玩前先看实时队列。'});
      add({kind:'show',itemId:20002,title:all.get(20002).name+(nightTentative?'（场次待公布）':''),start:nightStart-30,end:nightStart+30,showStart:nightTentative?null:nightStart,ride:30,prepare:30,optional:true,tentative:nightTentative});
    }
    if(cursor<closing)add({kind:'exit',title:'自由活动，预留离园时间',start:cursor,end:closing,description:'不再安排长队项目，按当天闭园时间离园。'});
    const unresolvedShows=D.shows.filter(show=>showTimes(show.id,date)===null&&!isClosed(show,date)&&!rows.some(row=>row.itemId===show.id));
    const stops=rows.filter(row=>row.itemId).map(row=>({...all.get(row.itemId),order:0,tentative:Boolean(row.tentative)}));
    stops.forEach((item,index)=>item.order=index+1);
    const routePoints=rows.filter(row=>row.itemId||row.restaurantId).map(row=>({...all.get(row.itemId||row.restaurantId),tentative:Boolean(row.tentative)}));
    return {date,knownHours,opening,closing,rows,stops,routePoints,substitutions,unavailable,unresolvedShows,dpaBudget:rows.filter(row=>row.kind==='ride'&&row.dpa).reduce((sum,row)=>sum+(all.get(row.itemId).dpa||0),0)};
  }
  window.GuidePlanner={plan,hours,showTimes,clock,isClosed};
})();
