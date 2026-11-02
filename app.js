(() => {
  'use strict';
  const D = window.DISNEY_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icons = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const escapeHTML = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const allAttractions=[...D.attractions,...D.excludedAttractions];
  const catalogue=[...D.coreIds.map(id=>allAttractions.find(item=>item.id===id)),...D.shows,...allAttractions.filter(item=>!D.coreIds.includes(item.id))];
  const excludedIds=new Set(D.excluded.map(item=>item.id));
  const indoorIds = new Set(D.indoorArea.items);
  const mapItemId = id => indoorIds.has(id) ? D.indoorArea.id : id;
  const mapCatalogue = [...catalogue.filter(item=>!indoorIds.has(item.id)),D.indoorArea];
  const byId = new Map([...catalogue,...D.dining,D.indoorArea].map(item => [item.id, item]));
  const P=window.GuidePlanner;
  const areas = new Map(D.areas.map(area => [area.id, area]));
  const STORAGE_KEY = 'disneysea-guide:v1';
  let persisted = {};
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); if (value && typeof value === 'object' && !Array.isArray(value)) persisted = value; } catch { /* Storage is optional, including file:// and private browsing. */ }
  const state = {
    view: 'map', guideSection:'#day-route', filter: 'all', area: 'all', query: '', selected: null,
    visitDate: persisted.planWindow===D.planningWindow.version && /^\d{4}-\d{2}-\d{2}$/.test(persisted.visitDate || '') && !Number.isNaN(Date.parse(persisted.visitDate)) ? persisted.visitDate : D.planningWindow.reference,
    showRoute: typeof persisted.showRoute==='boolean'?persisted.showRoute:true,
    showExcluded:typeof persisted.showExcluded==='boolean'?persisted.showExcluded:false,
    hideClosed:typeof persisted.hideClosed==='boolean'?persisted.hideClosed:true,
    mapOrientation:['north','official'].includes(persisted.mapOrientation)?persisted.mapOrientation:'north',
    navCollapsed:persisted.navCollapsed===true,
    listCollapsed:persisted.listCollapsed===true
  };
  let currentResults = catalogue;
  let activePlan;
  let previousDetailFocus = null;
  let toastTimer;
  const dateForStatus = () => state.visitDate || D.planningWindow.reference;
  const formatDate = value => value ? value.replace(/-/g, '.') : '待定';
  const closureOn = (item, date = dateForStatus()) => item.closures.find(([start, end]) => date >= start && (!end || date <= end));
  const hasDPA = item => Boolean(item.dpa && (!item.dpaFrom || dateForStatus() >= item.dpaFrom));
  const number = n => new Intl.NumberFormat('en-US').format(n);
  const eligible=item=>(state.showExcluded||!excludedIds.has(item.id))&&(!state.hideClosed||!closureOn(item));
  const mapEligible=item=>item.id===D.indoorArea.id?item.items.some(id=>eligible(byId.get(id))):eligible(item);
  const durationText=item=>item.durationLabel||(item.durationMinutes?`约 ${item.durationMinutes} 分钟`:item.duration||'按现场体验安排');
  const englishName=item=>escapeHTML(item.en||'');
  const englishLine=(item,className='project-en')=>item?.en?`<small class="${className}" lang="en" title="${englishName(item)}">${englishName(item)}</small>`:'';

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({visitDate:state.visitDate,showRoute:state.showRoute,showExcluded:state.showExcluded,hideClosed:state.hideClosed,mapOrientation:state.mapOrientation,navCollapsed:state.navCollapsed,listCollapsed:state.listCollapsed,planWindow:D.planningWindow.version})); return true; } catch { return false; }
  }
  function syncListToggle(){
    const expanded=innerWidth<=760?$('#workspace').classList.contains('mobile-list'):!state.listCollapsed,label=expanded?'收起项目列表':'展开项目列表';
    $('#toggle-project-list').setAttribute('aria-expanded',String(expanded));$('#toggle-project-list').setAttribute('aria-label',label);$('#toggle-project-list').title=label;
  }
  function applyPanelLayout(){
    document.body.classList.toggle('nav-collapsed',state.navCollapsed);$('#workspace').classList.toggle('explorer-collapsed',state.listCollapsed);
    const label=state.navCollapsed?'展开导航栏':'收起导航栏';$('#toggle-navigation').setAttribute('aria-expanded',String(!state.navCollapsed));$('#toggle-navigation').setAttribute('aria-label',label);$('#toggle-navigation').title=label;$('#toggle-navigation span').textContent=state.navCollapsed?'展开导航':'收起导航';
    syncListToggle();
  }
  function toast(message) {
    const el = $('#toast'); el.textContent = message; el.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 3000);
  }
  function setHash(hash) { try { history.replaceState(null, '', hash); } catch { /* Navigation still works in restrictive local contexts. */ } }
  function updateNavigation(){
    $$('#side-nav button').forEach(button=>{const active=button.dataset.view==='map'?state.view==='map':state.view==='guide'&&button.dataset.section===state.guideSection;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
    $('#guide-title').textContent=({'#day-route':'一日行程','#dpa-guide':'DPA','#dining-guide':'吃饭'})[state.guideSection];
  }
  function setView(view, updateHash = true) {
    state.view = view;
    $('#map-view').hidden = view !== 'map'; $('#guide-view').hidden = view !== 'guide';
    updateNavigation();
    if (updateHash) setHash(`#${view}`);
    if (view === 'map') requestAnimationFrame(() => fitMap());
    else {renderRoute();$('#guide-scroll').scrollTop=0;}
    window.scrollTo({top:0, behavior:'instant'});
  }
  function matchedItems() {
    const q = state.query.normalize('NFKC').toLowerCase().replace(/\s+/g,'');
    return catalogue.filter(item => {
      if(!eligible(item))return false;
      if (state.area !== 'all' && item.area !== state.area) return false;
      if (q && !`${item.name}${item.short}${item.en}${item.aliases}${areas.get(item.area).name}${indoorIds.has(item.id)?D.indoorArea.name+D.indoorArea.en:''}`.normalize('NFKC').toLowerCase().replace(/\s+/g,'').includes(q)) return false;
      if (state.filter === 'recommended' && !D.coreIds.includes(item.id)) return false;
      if (state.filter === 'gentle' && item.intensity !== 1) return false;
      if (state.filter === 'thrill' && item.intensity !== 3) return false;
      if (state.filter === 'dpa' && !hasDPA(item)) return false;
      if (state.filter === 'indoor' && !item.indoor) return false;
      if (state.filter === 'show' && item.type!=='show') return false;
      return true;
    });
  }
  function renderResults() {
    currentResults = matchedItems();
    const count = currentResults.length;
    $('#result-count').textContent = `${count} 个`;
    const labels = {all:'探索全部项目',recommended:'星标项目',gentle:'慢一点，也很好玩',thrill:'来一点心跳加速',dpa:'可选付费尊享卡',indoor:'在室内继续探索',show:'花船与水上秀'};
    $('#list-title').textContent = state.query ? '搜索结果' : state.area !== 'all' ? areas.get(state.area).name : labels[state.filter];
    $('#extra-filter').value=['gentle','thrill','indoor'].includes(state.filter)?state.filter:'all';
    $('#hide-closed').checked=state.hideClosed;$('#toggle-excluded').textContent=state.showExcluded?'隐藏排除':'显示排除';$('#toggle-excluded').setAttribute('aria-pressed',String(state.showExcluded));
    $('#closure-filter-note').textContent=`${formatDate(dateForStatus())} · 未公布场次保留`;
    $('#clear-filter').hidden = state.filter === 'all' && state.area === 'all' && !state.query;
    $$('#filters button').forEach(b => { const active=b.dataset.filter===state.filter; b.classList.toggle('active',active); b.setAttribute('aria-pressed',String(active)); });
    $('#attraction-list').innerHTML = count ? currentResults.map(item => {
      const area=areas.get(item.area), closed=closureOn(item),stop=activePlan?.stops.find(stop=>stop.id===item.id);
      return `<article class="attraction-row ${state.selected===item.id?'selected':''}" style="--area-color:${area.color}"><button class="attraction-open" data-select="${item.id}" aria-label="查看${escapeHTML(item.name)}详情"><div class="list-photo"><img src="${item.image}" alt="" loading="lazy" width="80" height="70">${stop?`<span class="list-order">${stop.order}</span>`:''}</div><span class="list-copy"><strong>${item.short}${D.coreIds.includes(item.id)?icons('star'):''}</strong>${englishLine(item)}<span class="row-tags"><span>${item.playType}</span><span>${durationText(item)}</span>${closed?`<span class="tag closed">${item.type==='show'?'停演':'检修'}</span>`:''}${excludedIds.has(item.id)?'<span class="tag">排除</span>':''}</span></span></button></article>`;
    }).join('') : `<div class="empty-state">${icons('search')}<h3>没有找到匹配项目</h3><p>试试项目的中文名、英文名，或放宽筛选。</p><button class="outline-button" data-action="clear-filters">查看全部项目</button></div>`;
    const ids=new Set(currentResults.map(item=>mapItemId(item.id)));
    $$('.map-pin').forEach(pin => { const item=byId.get(Number(pin.dataset.select));pin.hidden=!mapEligible(item); pin.classList.toggle('is-filtered-out',!ids.has(item.id)); pin.classList.toggle('is-selected',item.id===mapItemId(state.selected)); pin.classList.toggle('is-closed',Boolean(closureOn(item)));pin.classList.toggle('has-dpa',hasDPA(item)&&!closureOn(item)); });
    $$('.dining-pin').forEach(pin=>pin.classList.toggle('is-selected',Number(pin.dataset.select)===state.selected));
    $$('.area-boundary').forEach(region=>region.classList.toggle('area-active',region.dataset.area===state.area));
    $('.map-caption strong').textContent=state.area==='all'?'东京迪士尼海洋':areas.get(state.area).name;
    const available=catalogue.filter(eligible);$('.map-total').textContent=state.area==='all'&&state.filter==='all'&&!state.query?`${available.filter(item=>item.type!=='show').length} 个项目 · ${available.filter(item=>item.type==='show').length} 场演出`:`${count} 个匹配`;
    renderRouteOverlay();
  }
  function clearFilters() {
    state.query=''; state.area='all'; state.filter='all';
    $('#search').value='';$('#area-filter').value='all';renderResults();fitMap();
  }
  function selectItem(id, focusDetail = true) {
    const item=byId.get(id);if(!item)return;
    if (state.view!=='map') setView('map');
    const origin=document.activeElement;
    if(!origin.closest('#detail-panel')) {
      const originId=origin.dataset.select;
      const container=origin.closest('#attraction-list')?'#attraction-list':origin.closest('#map-pins')?'#map-pins':origin.closest('#map-dining')?'#map-dining':null;
      previousDetailFocus={node:origin,selector:container&&originId?`${container} [data-select="${originId}"]`:null,itemId:id};
    }
    state.selected=id;
    if(item.type!=='restaurant'&&!currentResults.some(entry=>item.type==='group'?indoorIds.has(entry.id):entry.id===id)){ clearFilters(); }
    $('#workspace').classList.remove('mobile-list');
    updateMobileButtons('map');
    renderDetail(item);renderResults();
    setHash(`#project-${id}`);
    requestAnimationFrame(()=>{focusMap(item);if(focusDetail)$('#detail-panel').focus({preventScroll:true});});
  }
  function showTimeText(item){if(closureOn(item))return '所选日期已公布停演';const times=P.showTimes(item.id,dateForStatus());return times===null?'场次待公布':times.length?times.join(' / '):'所选日期暂无场次';}
  function renderDetail(item) {
    const area=areas.get(item.area),closure=closureOn(item),panel=$('#detail-panel');panel.hidden=false;
    const isGroup=item.type==='group';panel.classList.toggle('is-indoor-area',isGroup);
    const status=closure?`<span class="detail-status closed">${formatDate(closure[0])} — ${closure[1]?formatDate(closure[1]):'待定'} ${item.type==='show'?'停演':'检修'}</span>`:item.type==='restaurant'?`<span class="detail-status">${item.snack?'¥'+number(item.price):'可移动点餐'}</span>`:hasDPA(item)?`<span class="detail-status">DPA ¥${number(item.dpa)} / 人 / 次</span>`:'';
    const timing=!isGroup&&item.type!=='restaurant'?`<p class="detail-duration">${durationText(item)}<small>${item.durationIsEstimate?'导览建议，不含排队':'体验时长，不含排队'}</small></p>`:'';
    const times=item.type==='show'?P.showTimes(item.id,dateForStatus()):null;
    const showSchedule=item.type==='show'?`<section class="detail-schedule"><h3>${formatDate(dateForStatus())} 演出时间</h3>${times===null?'<p>该日场次尚未公布。官方通常在前一个月 8 日左右公布下月安排。</p>':times.length?`<ul class="show-time-list">${times.map(time=>`<li><time>${time}</time></li>`).join('')}</ul><small>日本时间</small>`:'<p>该日停演。</p>'}</section>`:'';
    const back=indoorIds.has(item.id)?`<button class="detail-back" data-select="${D.indoorArea.id}">${icons('arrow')}返回室内区</button>`:'';
    const children=item.type==='group'?`<ul class="indoor-projects" aria-label="室内项目">${item.items.filter(id=>eligible(byId.get(id))).map(id=>{const child=byId.get(id);return `<li><button class="indoor-project" data-select="${id}" aria-label="查看${escapeHTML(child.name)}详情"><img src="${child.image}" alt="" width="48" height="48" loading="lazy"><span class="indoor-project-copy"><strong>${child.name}</strong>${englishLine(child)}<small>${child.playType} · ${durationText(child)}${closureOn(child)?'<span class="tag closed">暂停运营</span>':''}</small></span>${icons('arrow')}</button></li>`;}).join('')}</ul>`:'';
    const close=`<button class="detail-close icon-button" data-action="close-detail" aria-label="关闭项目详情">${icons('close')}</button>`;
    const title=`<h2>${item.name}${D.coreIds.includes(item.id)?icons('star'):''}</h2>`;
    panel.innerHTML=`${isGroup?'':`<div class="detail-photo"><img src="${item.image}" alt="${escapeHTML(item.imageAlt||item.name)}" width="800" height="450">${close}</div>`}<div class="detail-content">${back}${isGroup?`<div class="detail-group-heading">${title}${close}</div>`:title}${englishLine(item,'detail-original')}${isGroup?'':`<p class="detail-description">${item.oneLine}</p>`}${timing}${status}${showSchedule}${children}</div><div class="detail-footer"><button class="primary-button" data-action="go-route">${icons('route')}查看一日时间表</button><a class="detail-official" href="${item.type==='show'?item.scheduleUrl:item.url}" target="_blank" rel="noopener noreferrer">${item.type==='group'?'官方项目目录':item.type==='show'?'官方场次':'官方详情'} ${icons('external')}</a></div>`;panel.scrollTop=0;
  }
  function closeDetail(returnFocus=true) {
    state.selected=null;$('#detail-panel').hidden=true;renderResults();setHash('#map');
    if(returnFocus&&previousDetailFocus) {
      const candidates=[previousDetailFocus.selector?$(previousDetailFocus.selector):null,previousDetailFocus.node,$(`#map-pins [data-select="${mapItemId(previousDetailFocus.itemId)}"]`),$(`#map-dining [data-select="${previousDetailFocus.itemId}"]`),$('#search'),viewport];
      const target=candidates.find(node=>node?.isConnected&&node.getClientRects().length&&getComputedStyle(node).visibility!=='hidden');
      target?.focus({preventScroll:true});
    }
  }
  function renderHours() {
    const date=dateForStatus(),hours=P.hours(date);
    $('#park-hours').innerHTML=hours?`<span><b>${hours.open}</b> 开园</span><span><b>${hours.close}</b> 闭园</span><small>日本时间</small>`:'<span>该日期的营业时间请查看官方日历</span>';
    $('#park-hours').classList.toggle('early-close',Boolean(hours&&hours.close!=='21:00'));
    $('.hours-strip>a').href=hours?.url||D.sources.calendar;
  }
  function renderShows() {
    $('#show-cards').innerHTML=D.shows.filter(eligible).map(item=>`<button class="show-row" data-select="${item.id}"><span>${item.name}${englishLine(item)}</span><span>${showTimeText(item)} · ${item.durationMinutes} 分钟</span>${icons('arrow')}</button>`).join('')||'<p>当前停运筛选下没有可显示的演出。</p>';
  }
  function renderDining() {
    $('#dining-options').innerHTML=D.dining.filter(item=>!item.snack).map(item=>`<button class="food-row" data-select="${item.id}">${icons('food')}<span>${item.meal} · ${item.name}${englishLine(item)}</span>${icons('arrow')}</button>`).join('');
    $('#snack-options').innerHTML=D.dining.filter(item=>item.snack).map(item=>`<button class="food-row" data-select="${item.id}">${icons('food')}<span>${item.name}${englishLine(item)}<small>${item.venue}</small></span><b>¥${number(item.price)}</b>${icons('arrow')}</button>`).join('');
    const [year,month,day]=dateForStatus().split('-').map(Number),priorMonth=month===1?12:month-1,priorDays=new Date(Date.UTC(year,month-1,0)).getUTCDate();
    $('#booking-example').textContent=day<=priorDays?`${month} 月 ${day} 日用餐：${priorMonth} 月 ${day} 日 10:00 起可订；当天 09:00 也可查看空位。`:'通常从用餐前一个月开放；具体日期和当日名额以官方预约页为准。';
  }
  function renderDPA(){
    const ordered=[...D.coreIds.map(id=>byId.get(id)),...D.attractions.filter(item=>item.dpa&&!D.coreIds.includes(item.id))].filter(eligible);
    $('#dpa-table-body').innerHTML=ordered.map(item=>`<tr><td><button data-select="${item.id}">${item.short}${D.coreIds.includes(item.id)?icons('star'):''}</button>${englishLine(item)}${closureOn(item)?'<span class="table-closed">检修</span>':''}</td><td>¥${number(item.dpa)}</td></tr>`).join('');
    $('#show-dpa-list').innerHTML=D.dpaShows.filter(item=>{const show=D.shows.find(show=>show.name===item.name);return !show||eligible(show);}).map(item=>`<p class="show-dpa-row"><span>${item.name}${englishLine(item)}</span><strong>¥${number(item.price)}</strong></p>`).join('')+'<p>白天花船无 DPA；可用演出的名额以官方 App 为准。</p>';
    $('#dpa-plan-cost').textContent=activePlan.dpaActions.length?`当前时间表的 ${activePlan.dpaActions.length} 项示例若全部购买，${D.party.adults} 位成人合计约 ${number(activePlan.dpaExampleCost)} 日元。可按等待时间和预算只买其中几项；这不是已购票。`:'';
  }
  let timelineFrame=0;
  function queueTimelineLayout(){if(!timelineFrame)timelineFrame=requestAnimationFrame(()=>{timelineFrame=0;layoutTimelineBranches();});}
  function layoutTimelineBranches(){
    if(state.view!=='guide'||state.guideSection!=='#day-route')return;
    for(const wrapper of $$('.timeline-item')){
      const svg=$('.timeline-branch',wrapper);if(!svg)continue;
      const box=wrapper.getBoundingClientRect(),main=$('.timed-stop',wrapper).getBoundingClientRect();if(!box.width||!box.height)continue;
      svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);svg.style.width=box.width+'px';svg.style.height=box.height+'px';
      const start=Number(wrapper.dataset.start),end=Number(wrapper.dataset.end),mobile=innerWidth<=760;
      svg.innerHTML=$$('.dpa-note',wrapper).map(note=>{
        const rect=note.getBoundingClientRect(),fraction=Math.max(0,Math.min(1,(Number(note.dataset.buy)-start)/Math.max(1,end-start)));
        const sx=mobile?60:main.right-box.left+6,sy=main.top-box.top+18+fraction*Math.max(0,main.height-36),tx=rect.left-box.left-6,ty=rect.top-box.top+20,mid=sx+(tx-sx)*.5;
        const d=mobile?`M${sx} ${sy}V${ty}H${tx}`:`M${sx} ${sy}H${mid}V${ty}H${tx}`;
        return `<path d="${d}"/><circle cx="${sx}" cy="${sy}" r="3"/>`;
      }).join('');
    }
  }
  function renderRoute() {
    activePlan=P.plan(dateForStatus());
    $('#route-profile').textContent=`${D.party.adults} 位成人 · 无儿童｜${activePlan.routeSummary}`;
    const changes=[...activePlan.substitutions.map(change=>`${change.from.short}检修 → ${change.to.short}`),...activePlan.unavailable.map(item=>`${item.short}本次未排入，按现场队列取舍。`)];
    $('#route-changes').hidden=!changes.length;$('#route-change-list').textContent=changes.join('；');
    const relative=value=>{const delta=value-activePlan.opening;return delta<0?`开园前 ${-delta} 分钟`:`开园后 ${Math.floor(delta/60)}:${String(delta%60).padStart(2,'0')}`;};
    const clock=value=>activePlan.knownHours?P.clock(value):relative(value);
    const headings='<div class="timeline-column-headings"><span>整体行程</span><span>DPA 并行操作</span></div>';
    $('#route-timeline').innerHTML=headings+activePlan.rows.map((row,index)=>{
      const item=row.itemId||row.restaurantId?byId.get(row.itemId||row.restaurantId):null,order=row.itemId?activePlan.stops.find(stop=>stop.id===row.itemId)?.order:null;
      const time=row.tentative?`<time class="relative-time">${row.itemId===20001?'午前预留':'晚间预留'}</time><small class="stop-end">${row.end-row.start} 分钟预算</small>`:`<time>${clock(row.start)}</time><small class="stop-end">– ${clock(row.end)}</small>`;
      const facts=row.kind==='ride'?`体验 ${row.ride} 分钟 <span>·</span> 排队预算 ${row.queue} 分钟 <span>·</span> 步行约 ${row.walk} 分钟`:row.kind==='explore'?`自由探索约 ${row.ride} 分钟 <span>·</span> 步行约 ${row.walk} 分钟`:row.kind==='show'?`${row.tentative?'场次待公布':P.clock(row.showStart)+' 开演'} <span>·</span> 表演 ${row.ride} 分钟`:'';
      const title=item?(row.kind==='show'?item.name:row.kind==='meal'?`${item.meal} · ${item.name}`:item.short):row.title;
      const actions=activePlan.dpaActions.filter(action=>action.anchorRowIndex===index);
      const notes=actions.map(action=>{const target=byId.get(action.dpaItemId);return `<article class="dpa-note" data-buy="${action.start}"><div class="dpa-note-heading">${icons('ticket')}<time>${clock(action.start)}</time><span>查 DPA</span></div><button data-select="${target.id}">${target.short}</button>${englishLine(target,'dpa-note-en')}<p class="dpa-target">争取 ${clock(action.targetStart)} 前后体验</p><p>${D.party.adults} 人 ${number(action.pairPrice)} 日元 · 下一张最早 ${clock(action.nextEligible)}</p><p>${escapeHTML(action.description)}</p></article>`;}).join('');
      return `<div class="timeline-item" data-start="${row.start}" data-end="${row.end}"><article class="timed-stop ${row.kind}"><div class="stop-time">${time}</div><div class="stop-body"><div class="stop-title">${order?`<span class="stop-number">${order}</span>`:icons(row.kind==='meal'?'food':row.kind==='walk'?'arrow':'route')}${item?`<button data-select="${item.id}">${title}${D.coreIds.includes(item.id)?icons('star'):''}</button>`:`<h3>${title}</h3>`}</div>${item?englishLine(item,'stop-en'):''}${facts?`<div class="step-facts">${facts}</div>`:''}${row.description?`<p class="step-note">${escapeHTML(row.description)}</p>`:''}</div></article><aside class="dpa-side-list" aria-label="本段 DPA 操作">${notes}</aside>${notes?'<svg class="timeline-branch" aria-hidden="true" focusable="false"></svg>':''}</div>`;
    }).join('');
    renderShows();renderDPA();renderDining();renderRouteOverlay();queueTimelineLayout();
  }
  function renderRouteOverlay(){
    if(!activePlan||!$('#map-route'))return;
    $('#route-visible').checked=state.showRoute;$('#map-route').hidden=!state.showRoute;
    $('#map-legend').innerHTML=`<span class="legend-order">1</span>游玩顺序 <i class="legend-dot"></i>其他项目 ${icons('star')}重点 ${icons('food')}吃饭 <i class="legend-dpa" title="DPA 适用设施，实际名额以官方 App 为准"></i><span class="visually-hidden">绿色外圈：</span>DPA适用`;
    const stops=activePlan.stops;
    $$('.map-pin').forEach(pin=>{const item=byId.get(Number(pin.dataset.select)),stop=stops.find(stop=>mapItemId(stop.id)===item.id);pin.classList.toggle('is-route-stop',Boolean(stop));pin.classList.toggle('other-pin',!stop);$('.pin-core',pin).innerHTML=stop?`<span class="pin-value">${stop.order}</span>`:item.type==='show'?icons(item.id===20001?'boat':'moon'):'';pin.setAttribute('aria-label',`${stop?'第 '+stop.order+' 站，':''}${item.name}，${areas.get(item.area).name}${hasDPA(item)&&!closureOn(item)?'，DPA适用':''}`);});
    queueMapLayout();
  }
  function exportRoute(){
    const time=value=>activePlan.knownHours?P.clock(value):`开园后 ${value-activePlan.opening} 分钟`;
    const lines=['东京迪士尼海洋 · 两位成人一日计划',`参考日期：${dateForStatus()}`,activePlan.knownHours?`营业时间：${P.clock(activePlan.opening)}–${P.clock(activePlan.closing)}（日本时间）`:'未收录该日营业时间；下列为开园后的预算顺序。',activePlan.routeSummary,'排队、步行与用餐均为预算。DPA 目标时段是示例，按实际库存、预约和官方演出安排调整。','下一张其他项目 DPA：付款满 60 分钟或当前卡的体验时段开始，取较早；以 App 提示为准。',''];
    for(const row of activePlan.rows){
      const when=row.tentative?(row.itemId===20001?'午前预留':'晚间预留'):time(row.start)+(row.end>row.start?'–'+time(row.end):'');
      lines.push(`${when}  ${row.title}`);
      if(row.kind==='ride')lines.push(`  体验约 ${row.ride} 分钟；排队预算 ${row.queue} 分钟；步行约 ${row.walk} 分钟。`);
      if(row.kind==='show')lines.push(`  ${row.tentative?'具体场次待公布':'官方开演 '+P.clock(row.showStart)}；表演 ${row.ride} 分钟；提前预留 ${row.prepare} 分钟找位置。`);
      if(row.kind==='explore')lines.push(`  自由探索约 ${row.ride} 分钟；步行约 ${row.walk} 分钟。`);
      if(row.description)lines.push('  '+row.description);
      lines.push('');
    }
    if(activePlan.dpaActions.length){lines.push('DPA 并行操作（在主行程的排队、等场或用餐间隙进行）');for(const action of activePlan.dpaActions)lines.push(`${time(action.start)}  ${action.title}；争取 ${time(action.targetStart)} 前后体验；下一张最早 ${time(action.nextEligible)}；${D.party.adults} 人 ${number(action.pairPrice)} 日元。`, '  '+action.description);lines.push(`示例全部购买：${D.party.adults} 位成人合计约 ${number(activePlan.dpaExampleCost)} 日元；未预订，可按需只买几项。`);}
    lines.push(...activePlan.substitutions.map(change=>`${change.from.name}检修 → ${change.to.name}`),...activePlan.unavailable.map(item=>`${item.short}本次未排入，请结合 DPA 和现场队列重新取舍。`),D.sources.calendar,D.sources.dpa);
    const blob=new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`迪士尼海洋时间表-${dateForStatus()}.txt`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('时间表已导出。');
  }

  // Map coordinates refer to the official source image rendered in a 3776 × 2670 coordinate space.
  const viewport=$('#map-viewport'),stage=$('#map-stage');
  // The official compass points 15 degrees below image-right: rotate -105 degrees for north-up.
  const SOURCE_W=1260,SOURCE_H=1080,NORTH_ROTATION=-105;
  let cos=1,sin=0,minX=0,minY=0,MAP_W=SOURCE_W,MAP_H=SOURCE_H;
  const rawRotate=(x,y)=>({x:cos*x-sin*y,y:sin*x+cos*y});
  // Fit the park perimeter after rotation, rather than the blank corners of the source image.
  const tokens=$('#park-clip path').getAttribute('d').match(/[A-Za-z]|-?\d+(?:\.\d+)?/g),perimeter=[];
  let coordinateIndex=0,command='M',sourceX=0,sourceY=0;
  while(coordinateIndex<tokens.length){
    if(/[A-Za-z]/.test(tokens[coordinateIndex])){command=tokens[coordinateIndex++];if(command==='Z')continue;}
    if(command==='M'||command==='L'){sourceX=Number(tokens[coordinateIndex++]);sourceY=Number(tokens[coordinateIndex++]);command='L';}
    else if(command==='H')sourceX=Number(tokens[coordinateIndex++]);
    else if(command==='V')sourceY=Number(tokens[coordinateIndex++]);
    else break;
    perimeter.push({x:(sourceX-580)/2450*SOURCE_W,y:(sourceY-40)/2100*SOURCE_H});
  }
  const rotatePoint=(x,y)=>{const p=rawRotate(x,y);return {x:p.x-minX,y:p.y-minY};};
  const view={x:0,y:0,scale:1,base:1,zoom:1};
  const point=item=>rotatePoint((item.x-580)/2450*SOURCE_W,(item.y-40)/2100*SOURCE_H);
  let mapNodes=[],mapLayoutFrame=0,hoveredMarker=null;
  function applyMapOrientation(refit=true){
    const north=state.mapOrientation==='north',rotation=north?NORTH_ROTATION:0,angle=rotation*Math.PI/180;
    cos=Math.cos(angle);sin=Math.sin(angle);
    const points=perimeter.map(p=>rawRotate(p.x,p.y));minX=Math.min(...points.map(p=>p.x));minY=Math.min(...points.map(p=>p.y));MAP_W=Math.max(...points.map(p=>p.x))-minX;MAP_H=Math.max(...points.map(p=>p.y))-minY;
    stage.style.width=MAP_W+'px';stage.style.height=MAP_H+'px';$('#map-geography').style.transform=`matrix(${cos},${sin},${-sin},${cos},${-minX},${-minY})`;viewport.style.setProperty('--map-bearing',rotation+'deg');
    const label=north?'北向朝上':'官方方向',next=north?'切换为官方方向':'切换为北向朝上';$('#toggle-orientation span').textContent=label;$('#toggle-orientation').setAttribute('aria-pressed',String(north));$('#toggle-orientation').setAttribute('aria-label',label+'，'+next);$('#toggle-orientation').title=next;
    $('.north-indicator svg').style.transform=`rotate(${rotation+15}deg)`;$('.north-indicator').setAttribute('aria-label',north?'正北朝上，左西右东':'官方原图方向，北指向右下方');
    $('.map-art').setAttribute('aria-label',`东京迪士尼海洋园区地图，${north?'上北下南、左西右东':'采用官方原图方向，北指向右下方'}；项目名称保持正向。`);
    if(refit){fitMap();if(state.selected)focusMap(byId.get(state.selected));}
  }
  function ensureFocusedMarker(node){
    requestAnimationFrame(()=>{
      if(!viewport.clientWidth||document.activeElement!==node.button||pointers.size){queueMapLayout();return;}
      viewport.scrollLeft=0;viewport.scrollTop=0;
      const r=$('.pin-core,.dining-core',node.button).getBoundingClientRect(),v=viewport.getBoundingClientRect(),padding=28;
      if(r.left<v.left+padding||r.right>v.right-padding||r.top<v.top+padding||r.bottom>v.bottom-padding){view.x+=v.left+v.width/2-(r.left+r.width/2);view.y+=v.top+v.height/2-(r.top+r.height/2);drawMap();}
      else queueMapLayout();
    });
  }
  const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
  function queueMapLayout(){if(!mapLayoutFrame)mapLayoutFrame=requestAnimationFrame(()=>{mapLayoutFrame=0;layoutMapMarkers();});}
  function layoutMapMarkers(){
    const width=viewport.clientWidth,height=viewport.clientHeight;
    if(!width||!height||!activePlan)return;
    const entry=$('.entry-label',viewport),entryPoint=rotatePoint(475,1020),entryX=view.x+entryPoint.x*view.scale,entryY=view.y+entryPoint.y*view.scale;
    entry.hidden=entryX<0||entryX>width||entryY<0||entryY>height;
    entry.style.left=`${Math.max(entry.offsetWidth/2+6,Math.min(width-entry.offsetWidth/2-6,entryX))}px`;entry.style.top=`${entryY}px`;
    const viewportRect=viewport.getBoundingClientRect(),controlRect=$('.map-controls').getBoundingClientRect();
    const controls={x:controlRect.left-viewportRect.left-4,y:controlRect.top-viewportRect.top-4,w:controlRect.width+8,h:controlRect.height+8};
    const routeIds=new Set(activePlan.stops.map(item=>mapItemId(item.id)));
    const visible=mapNodes.filter(node=>!node.button.hidden).map(node=>{
      const p=point(node.item),isRoute=routeIds.has(node.item.id),star=D.coreIds.includes(node.item.id),core=$('.pin-core,.dining-core',node.button).getBoundingClientRect();
      const cx=core.left+core.width/2,cy=core.top+core.height/2,bounds={l:core.width/2,r:core.width/2,t:core.height/2,b:core.height/2};
      const starBox=$('.pin-star',node.button)?.getBoundingClientRect();
      if(starBox?.width){bounds.l=Math.max(bounds.l,cx-starBox.left);bounds.r=Math.max(bounds.r,starBox.right-cx);bounds.t=Math.max(bounds.t,cy-starBox.top);bounds.b=Math.max(bounds.b,starBox.bottom-cy);}
      return {...node,p,x:view.x+p.x*view.scale,y:view.y+p.y*view.scale,...bounds,isRoute,priority:node.item.id===mapItemId(state.selected)?-1:isRoute?0:node.item.type==='restaurant'?1:star?2:3};
    }).sort((a,b)=>a.priority-b.priority||a.item.id-b.item.id);
    const placed=[],offsets=[[0,0]];
    for(const radius of [16,28,40,52])for(const [x,y] of [[0,-1],[1,0],[0,1],[-1,0],[.707,-.707],[.707,.707],[-.707,.707],[-.707,-.707]])offsets.push([x*radius,y*radius]);
    const positionMap=new Map(),leaders=[];
    for(const node of visible){
      const inside=node.x>=0&&node.x<=width&&node.y>=0&&node.y<=height;
      let best=null;
      for(const [dx,dy] of offsets){
        const box={x:node.x+dx-node.l-2,y:node.y+dy-node.t-2,w:node.l+node.r+4,h:node.t+node.b+4};
        let cost=dx*dx+dy*dy;
        for(const occupied of placed)cost+=overlap(box,occupied)*120;
        if(inside){cost+=overlap(box,controls)*150;cost+=(Math.max(0,4-box.x)+Math.max(0,4-box.y)+Math.max(0,box.x+box.w-width+4)+Math.max(0,box.y+box.h-height+4))*1500;}
        if(!best||cost<best.cost)best={dx,dy,box,cost};
        if(cost===0)break;
      }
      node.x+=best.dx;node.y+=best.dy;node.stageX=node.p.x+best.dx/view.scale;node.stageY=node.p.y+best.dy/view.scale;
      node.button.style.left=`${node.x}px`;node.button.style.top=`${node.y}px`;
      node.button.classList.toggle('is-pointer-hovered',node.item.id===hoveredMarker);
      placed.push(best.box);positionMap.set(node.item.id,node);
      if(Math.hypot(best.dx,best.dy)>2)leaders.push(`<path d="M${view.x+node.p.x*view.scale} ${view.y+node.p.y*view.scale}L${node.x} ${node.y}"/>`);
    }
    const routePoints=activePlan.routePoints.map(item=>positionMap.get(mapItemId(item.id))||{stageX:point(item).x,stageY:point(item).y});
    $('#map-route').innerHTML=`<svg class="route-lines" viewBox="0 0 ${MAP_W} ${MAP_H}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="route-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="#ac175f" stroke="none"/></marker></defs>${routePoints.slice(1).map((to,index)=>{const from=routePoints[index],d=`M${from.stageX} ${from.stageY}L${to.stageX} ${to.stageY}`;return `<path class="route-halo" d="${d}"/><path class="route-segment" d="${d}" marker-end="url(#route-arrow)"/>`;}).join('')}</svg>`;
    mapNodes.forEach(node=>node.label.classList.remove('is-visible'));
    const fixedLabels=$$('.entry-label',viewport).filter(element=>!element.hidden).map(element=>{const r=element.getBoundingClientRect();return {x:r.left-viewportRect.left-3,y:r.top-viewportRect.top-3,w:r.width+6,h:r.height+6};});
    const occupied=[...placed,controls,...fixedLabels];
    const panel=$('#detail-panel');
    if(!panel.hidden){const r=panel.getBoundingClientRect();occupied.push({x:r.left-viewportRect.left,y:r.top-viewportRect.top,w:r.width,h:r.height});}
    const labels=visible.filter(node=>node.isRoute||(!viewport.classList.contains('is-dragging')&&(node.item.id===hoveredMarker||node.button.matches(':focus-visible'))));
    labels.sort((a,b)=>(a.item.id===hoveredMarker?-1:0)-(b.item.id===hoveredMarker?-1:0)||a.priority-b.priority);
    for(const node of labels){
      if(node.x<0||node.y<0||node.x>width||node.y>height)continue;
      const w=Math.min(node.label.offsetWidth,width-12),h=node.label.offsetHeight,gap=7;
      const positions=[[node.r+gap,-h/2],[-node.l-gap-w,-h/2],[-w/2,-node.t-gap-h],[-w/2,node.b+gap],[node.r+gap,-node.t-h],[-node.l-gap-w,-node.t-h],[node.r+gap,node.b],[-node.l-gap-w,node.b]];
      for(const shift of [22,44])positions.push([-w/2,-node.t-gap-h-shift],[-w/2,node.b+gap+shift]);
      let best=null;
      for(const [dx,dy] of positions){
        const x=Math.max(6,Math.min(width-w-6,node.x+dx)),y=Math.max(6,Math.min(height-h-6,node.y+dy));
        const box={x,y,w,h};let cost=Math.hypot(dx,dy)*.1;
        for(const rect of occupied)cost+=overlap(box,rect)*25;
        if(!best||cost<best.cost)best={x,y,box,cost};
      }
      node.label.style.left=`${best.x}px`;node.label.style.top=`${best.y}px`;
      node.label.classList.add('is-visible');occupied.push(best.box);
      const edgeX=Math.max(best.x,Math.min(best.x+best.box.w,node.x)),edgeY=Math.max(best.y,Math.min(best.y+best.box.h,node.y));
      if(Math.hypot(edgeX-node.x,edgeY-node.y)>28)leaders.push(`<path class="name-leader" d="M${node.x} ${node.y}L${edgeX} ${edgeY}"/>`);
    }
    $('#map-leaders').innerHTML=`<svg viewBox="0 0 ${width} ${height}">${leaders.join('')}</svg>`;
  }
  function constrainPan() {
    const w=viewport.clientWidth,h=viewport.clientHeight,pad=65;
    view.x=Math.min(w-pad,Math.max(pad-MAP_W*view.scale,view.x));
    view.y=Math.min(h-pad,Math.max(pad-MAP_H*view.scale,view.y));
  }
  function drawMap() {
    constrainPan();stage.style.transform=`translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
    stage.style.setProperty('--inverse-scale',String(1/view.scale));stage.classList.toggle('is-zoomed',view.zoom>1.7);stage.classList.toggle('is-overview',view.zoom<=1.2);
    $('#zoom-level').textContent=`${Math.round(view.zoom*100)}%`;
    $('#zoom-in').disabled=view.zoom>=4;$('#zoom-out').disabled=view.zoom<=1;
    queueMapLayout();
  }
  function fitMap() {
    if(!viewport.clientWidth||!viewport.clientHeight)return;
    hoveredMarker=null;
    view.base=Math.min(viewport.clientWidth/MAP_W,viewport.clientHeight/MAP_H)*.95;
    view.zoom=1;view.scale=view.base;view.x=(viewport.clientWidth-MAP_W*view.scale)/2;view.y=(viewport.clientHeight-MAP_H*view.scale)/2;drawMap();
  }
  function zoomAt(next, x=viewport.clientWidth/2,y=viewport.clientHeight/2) {
    hoveredMarker=null;
    const old=view.scale;view.zoom=Math.max(1,Math.min(4,next));view.scale=view.base*view.zoom;
    view.x=x-(x-view.x)/old*view.scale;view.y=y-(y-view.y)/old*view.scale;drawMap();
  }
  function focusMap(item) {
    hoveredMarker=null;
    const p=point(item),mobile=window.innerWidth<=760;
    const panel=$('#detail-panel'),rect=viewport.getBoundingClientRect();
    panel.style.maxHeight=mobile?`${Math.max(160,Math.min(innerHeight*.72,innerHeight-rect.top-90))}px`:'';
    view.zoom=mobile?2.5:1.7;view.scale=view.base*view.zoom;
    const panelRect=panel.getBoundingClientRect();
    const availableWidth=mobile?viewport.clientWidth:Math.max(120,panelRect.left-rect.left-12);
    const availableHeight=mobile?Math.max(40,Math.min(viewport.clientHeight,panelRect.top-rect.top-10)):viewport.clientHeight;
    view.x=availableWidth*.48-p.x*view.scale;view.y=availableHeight*.5-p.y*view.scale;drawMap();
  }
  function fitResults() {
    if(!currentResults.length)return;
    if(currentResults.length===catalogue.length){fitMap();return;}
    const coords=currentResults.map(point),xs=coords.map(p=>p.x),ys=coords.map(p=>p.y);
    const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
    view.scale=Math.min(view.base*3,viewport.clientWidth/(right-left+260),viewport.clientHeight/(bottom-top+260));
    view.zoom=Math.max(1,Math.min(4,view.scale/view.base));view.scale=view.base*view.zoom;
    view.x=viewport.clientWidth/2-(left+right)/2*view.scale;view.y=viewport.clientHeight/2-(top+bottom)/2*view.scale;drawMap();
  }
  function renderMap() {
    $('#map-pins').innerHTML=mapCatalogue.map(item=>{const p=point(item),special=item.type==='show';return `<button class="map-pin ${special?'show-pin show-'+item.id:''}" style="left:${p.x}px;top:${p.y}px;--pin-color:${areas.get(item.area).color}" data-select="${item.id}" aria-label="${item.name}，${areas.get(item.area).name}"><span class="pin-core"></span><span class="pin-label">${item.short}</span>${D.coreIds.includes(item.id)?`<span class="pin-star">${icons('star')}</span>`:''}</button>`;}).join('');
    $('#map-dining').innerHTML=D.dining.map(item=>{const p=point(item);return `<button class="dining-pin ${item.snack?'snack-pin':''}" style="left:${p.x}px;top:${p.y}px" data-select="${item.id}" aria-label="${item.meal}：${item.name}"><span class="dining-core">${icons('food')}</span><span class="pin-label">${item.snack?item.short:item.meal+' · '+item.short}</span></button>`;}).join('');
    $('#map-labels').innerHTML=[...mapCatalogue,...D.dining].map(item=>`<span class="map-name" data-label-for="${item.id}"><strong>${escapeHTML(item.type==='restaurant'?(item.snack?item.short:item.name):item.short)}</strong>${englishLine(item,'map-en')}</span>`).join('');
    mapNodes=[...mapCatalogue,...D.dining].map(item=>({item,button:$(`[data-select="${item.id}"]`,item.type==='restaurant'?$('#map-dining'):$('#map-pins')),label:$(`[data-label-for="${item.id}"]`)}));
    for(const node of mapNodes){
      node.button.addEventListener('pointerenter',()=>{hoveredMarker=node.item.id;queueMapLayout();});
      node.button.addEventListener('pointermove',()=>{if(!pointers.size&&hoveredMarker!==node.item.id){hoveredMarker=node.item.id;queueMapLayout();}});
      node.button.addEventListener('pointerleave',()=>{if(hoveredMarker===node.item.id)hoveredMarker=null;queueMapLayout();});
      node.button.addEventListener('focus',()=>ensureFocusedMarker(node));node.button.addEventListener('blur',queueMapLayout);
    }
    $('#map-areas').innerHTML=`<svg class="region-boundaries" viewBox="580 40 2450 2100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${D.areas.map(area=>`<path class="region-halo" d="${area.boundary}"/><path class="area-boundary" d="${area.boundary}" data-area="${area.id}" style="--area-color:${area.color}"/>`).join('')}</svg>`;
    const checkImage=new Image();checkImage.onload=()=>{$('#map-error').hidden=true;};checkImage.onerror=()=>{$('#map-error').hidden=false;};checkImage.src='assets/official-map.jpg';
  }
  const pointers=new Map();let drag=null;let pinch=null;let suppressClick=false;
  viewport.addEventListener('scroll',()=>{if(viewport.scrollLeft||viewport.scrollTop){viewport.scrollLeft=0;viewport.scrollTop=0;const focused=mapNodes.find(node=>node.button===document.activeElement);if(focused)ensureFocusedMarker(focused);else queueMapLayout();}});
  viewport.addEventListener('pointerdown',event=>{
    if(event.button!==0&&event.pointerType!=='touch')return;
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    const interactive=event.target.closest('button,.area-boundary');
    if(!interactive){viewport.setPointerCapture(event.pointerId);event.preventDefault();}
    if(pointers.size===1)drag={x:event.clientX,y:event.clientY,viewX:view.x,viewY:view.y,moved:false};
    if(pointers.size===2){const [a,b]=[...pointers.values()];pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),zoom:view.zoom};}
  });
  viewport.addEventListener('pointermove',event=>{
    if(!pointers.has(event.pointerId))return;
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(pointers.size===2&&pinch){const [a,b]=[...pointers.values()],rect=viewport.getBoundingClientRect();zoomAt(pinch.zoom*Math.hypot(a.x-b.x,a.y-b.y)/pinch.distance,(a.x+b.x)/2-rect.left,(a.y+b.y)/2-rect.top);suppressClick=true;return;}
    if(drag){const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(Math.hypot(dx,dy)>5){drag.moved=true;suppressClick=true;hoveredMarker=null;viewport.setPointerCapture(event.pointerId);viewport.classList.add('is-dragging');}if(drag.moved){view.x=drag.viewX+dx;view.y=drag.viewY+dy;drawMap();}}
  });
  function endPointer(event){pointers.delete(event.pointerId);pinch=null;drag=null;viewport.classList.remove('is-dragging');if(pointers.size===1){const remaining=[...pointers.values()][0];drag={x:remaining.x,y:remaining.y,viewX:view.x,viewY:view.y,moved:false};}if(!pointers.size)setTimeout(()=>{suppressClick=false;},0);queueMapLayout();}
  viewport.addEventListener('pointerleave',()=>{hoveredMarker=null;queueMapLayout();});
  viewport.addEventListener('pointerup',endPointer);viewport.addEventListener('pointercancel',endPointer);window.addEventListener('pointerup',endPointer);window.addEventListener('pointercancel',endPointer);
  viewport.addEventListener('lostpointercapture',event=>{if(pointers.has(event.pointerId))endPointer(event);});
  viewport.addEventListener('wheel',event=>{event.preventDefault();const rect=viewport.getBoundingClientRect();zoomAt(view.zoom*Math.exp(-event.deltaY*.0015),event.clientX-rect.left,event.clientY-rect.top);},{passive:false});
  viewport.addEventListener('keydown',event=>{
    if(event.target!==viewport)return;
    const delta=50;
    if(event.key==='+'||event.key==='=')zoomAt(view.zoom*1.3);
    else if(event.key==='-')zoomAt(view.zoom/1.3);
    else if(event.key==='0')fitMap();
    else if(event.key==='ArrowLeft')view.x+=delta;
    else if(event.key==='ArrowRight')view.x-=delta;
    else if(event.key==='ArrowUp')view.y+=delta;
    else if(event.key==='ArrowDown')view.y-=delta;
    else return;
    event.preventDefault();drawMap();
  });
  function updateMobileButtons(mode){$$('[data-mobile]').forEach(b=>{b.classList.toggle('active',b.dataset.mobile===mode);b.setAttribute('aria-pressed',String(b.dataset.mobile===mode));});syncListToggle();}
  function selectArea(areaId){state.area=areaId;$('#area-filter').value=state.area;closeDetail(false);renderResults();fitResults();}
  function scrollToGuideSection(hash) {
    const target=hash==='#shows-guide'?'#day-route':hash;
    state.guideSection=target;
    if(state.view!=='guide')setView('guide',false);
    $$('.guide-content>.tab-pane').forEach(panel=>{const active='#'+panel.id===target;panel.classList.toggle('active',active);panel.classList.toggle('show',active);});
    updateNavigation();const scroller=$('#guide-scroll');scroller.scrollTop=0;
    if(hash==='#shows-guide'){bootstrap.Collapse.getOrCreateInstance($('#show-information'),{toggle:false}).show();scroller.scrollTop+=$('#shows-guide').getBoundingClientRect().top-scroller.getBoundingClientRect().top-12;}
    queueTimelineLayout();
  }

  document.addEventListener('click',event=>{
    const jump=event.target.closest('.guide-jump a');
    if(jump){event.preventDefault();const hash=jump.getAttribute('href');if(state.view!=='guide')setView('guide',false);setHash(hash);scrollToGuideSection(hash);return;}
    const region=event.target.closest('.area-boundary');if(region){if(!suppressClick)selectArea(region.dataset.area);return;}
    const target=event.target.closest('button');if(!target||target.disabled)return;
    if(target.dataset.select){if(!suppressClick)selectItem(Number(target.dataset.select));return;}
    if(target.dataset.section){closeDetail(false);scrollToGuideSection(target.dataset.section);setHash(target.dataset.section);return;}
    if(target.dataset.view){closeDetail(false);setView(target.dataset.view);return;}
    if(target.dataset.filter){state.filter=target.dataset.filter;closeDetail(false);renderResults();return;}
    if(target.dataset.area){selectArea(target.dataset.area);return;}
    if(target.dataset.mobile){$('#workspace').classList.toggle('mobile-list',target.dataset.mobile==='list');updateMobileButtons(target.dataset.mobile);if(target.dataset.mobile==='map')requestAnimationFrame(fitMap);return;}
    if(target.dataset.action==='clear-filters')clearFilters();
    if(target.dataset.action==='close-detail')closeDetail();
    if(target.dataset.action==='go-route'){closeDetail(false);setView('guide');setHash('#day-route');scrollToGuideSection('#day-route');}
  });
  $('#search').addEventListener('input',event=>{state.query=event.target.value;closeDetail(false);renderResults();});
  $('#extra-filter').addEventListener('change',event=>{state.filter=event.target.value;closeDetail(false);renderResults();});
  $('#area-filter').addEventListener('change',event=>{state.area=event.target.value;closeDetail(false);renderResults();fitResults();});
  $('#clear-filter').addEventListener('click',clearFilters);
  $('#hide-closed').addEventListener('change',event=>{state.hideClosed=event.target.checked;closeDetail(false);renderRoute();renderResults();persist();fitMap();});
  $('#toggle-excluded').addEventListener('click',()=>{state.showExcluded=!state.showExcluded;closeDetail(false);renderResults();persist();});
  $('#toggle-orientation').addEventListener('click',()=>{state.mapOrientation=state.mapOrientation==='north'?'official':'north';applyMapOrientation();persist();});
  $('#toggle-navigation').addEventListener('click',()=>{state.navCollapsed=!state.navCollapsed;applyPanelLayout();persist();});
  $('#toggle-project-list').addEventListener('click',()=>{if(innerWidth<=760){const show=!$('#workspace').classList.contains('mobile-list');$('#workspace').classList.toggle('mobile-list',show);updateMobileButtons(show?'list':'map');if(!show)requestAnimationFrame(fitMap);}else{state.listCollapsed=!state.listCollapsed;applyPanelLayout();persist();}});
  window.addEventListener('resize',applyPanelLayout);
  $('#zoom-in').addEventListener('click',()=>zoomAt(view.zoom*1.35));$('#zoom-out').addEventListener('click',()=>zoomAt(view.zoom/1.35));$('#reset-map').addEventListener('click',fitMap);
  $('#retry-map').addEventListener('click',()=>{const img=$('.map-art image'),url=`assets/official-map.jpg?retry=${Date.now()}`;img.setAttribute('href',url);const check=new Image();check.onload=()=>{$('#map-error').hidden=true;};check.onerror=()=>toast('仍未加载成功，请检查 assets 文件夹是否完整。');check.src=url;});
  $('#visit-date').value=dateForStatus();
  $('#visit-date').addEventListener('change',event=>{state.visitDate=event.target.value||D.planningWindow.reference;event.target.value=state.visitDate;persist();renderHours();renderRoute();renderResults();if(state.selected)renderDetail(byId.get(state.selected));});
  $('#route-to-map').addEventListener('click',()=>{state.query='';state.area='all';state.filter='all';state.showRoute=true;persist();$('#search').value='';$('#area-filter').value='all';$('#workspace').classList.remove('mobile-list');updateMobileButtons('map');setView('map');renderResults();requestAnimationFrame(fitMap);});
  $('#route-visible').addEventListener('change',event=>{state.showRoute=event.target.checked;persist();renderRouteOverlay();});
  $('#export-route').addEventListener('click',exportRoute);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&state.selected)closeDetail();
    if(event.key==='/'&&!event.ctrlKey&&!event.metaKey&&!/input|textarea|select/i.test(event.target.tagName)){event.preventDefault();setView('map');$('#workspace').classList.add('mobile-list');updateMobileButtons('list');$('#search').focus();}
  });
  function navigateHash(){const hash=location.hash;const match=hash.match(/^#project-(\d+)$/);if(match&&byId.has(Number(match[1])))selectItem(Number(match[1]),false);else if(['#guide','#dpa-guide','#dining-guide','#day-route','#shows-guide'].includes(hash)){scrollToGuideSection(hash==='#guide'?'#day-route':hash);}else if(hash!=='#main'){if(state.selected)closeDetail(false);setView('map',false);}}
  window.addEventListener('hashchange',navigateHash);
  let lastWidth=0,lastHeight=0;
  new ResizeObserver(entries=>{const {width,height}=entries[0].contentRect;if(width&&height&&(width!==lastWidth||height!==lastHeight)){lastWidth=width;lastHeight=height;fitMap();if(state.selected)focusMap(byId.get(state.selected));}}).observe(viewport);
  new ResizeObserver(queueTimelineLayout).observe($('#route-timeline'));
  D.areas.forEach(area=>{const option=document.createElement('option');option.value=area.id;option.textContent=area.name;$('#area-filter').append(option);});
  applyPanelLayout();applyMapOrientation(false);renderMap();renderHours();renderRoute();renderResults();navigateHash();
  document.fonts?.ready.then(()=>{queueMapLayout();queueTimelineLayout();});
})();

