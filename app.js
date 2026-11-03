(() => {
  'use strict';
  const D = window.DISNEY_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icons = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const escapeHTML = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const allAttractions=[...D.attractions,...D.excludedAttractions];
  const catalogue=[...D.coreIds.map(id=>allAttractions.find(item=>item.id===id)),...D.shows,...allAttractions.filter(item=>!D.coreIds.includes(item.id)),...D.dining];
  const transportIds=new Set([227,228,229,231,232,233]);
  const itemCategory=item=>item.type==='restaurant'?'restaurant':item.type==='show'?'show':transportIds.has(item.id)?'other':'attraction';
  const categoryNames={all:'全部',attraction:'项目',show:'演出',restaurant:'餐厅',other:'其他',hidden:'隐藏'};
  const indoorIds = new Set(D.indoorArea.items);
  const mapItemId = id => indoorIds.has(id) ? D.indoorArea.id : id;
  const mapCatalogue = [...catalogue.filter(item=>item.type!=='restaurant'&&!indoorIds.has(item.id)),D.indoorArea];
  const byId = new Map([...catalogue,D.indoorArea].map(item => [item.id, item]));
  const P=window.GuidePlanner;
  const areas = new Map(D.areas.map(area => [area.id, area]));
  const STORAGE_KEY = 'disneysea-guide:v1';
  let persisted = {};
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); if (value && typeof value === 'object' && !Array.isArray(value)) persisted = value; } catch { /* Storage is optional, including file:// and private browsing. */ }
  const state = {
    view: 'map', guideSection:'#day-route', category:'all', filter: 'all', area: 'all', query: '', selected: null,
    visitDate: persisted.planWindow===D.planningWindow.version && /^\d{4}-\d{2}-\d{2}$/.test(persisted.visitDate || '') && !Number.isNaN(Date.parse(persisted.visitDate)) ? persisted.visitDate : D.planningWindow.reference,
    showRoute: typeof persisted.showRoute==='boolean'?persisted.showRoute:true,
    showHidden:typeof persisted.showHidden==='boolean'?persisted.showHidden:Boolean(persisted.showExcluded||persisted.hideClosed===false),
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
  const hiddenReasons=item=>{
    const reasons=[],closure=closureOn(item),manual=D.excluded.find(entry=>entry.id===item.id);
    if(closure)reasons.push({kind:'official',label:'官方停运',text:`官方停运：${formatDate(closure[0])}${closure[1]?'–'+formatDate(closure[1]):' 起，恢复时间待公布'}`});
    if(manual)reasons.push({kind:'user',label:'用户主动隐藏',text:`用户主动隐藏：${manual.reason}`});
    return reasons;
  };
  const eligible=item=>state.showHidden||hiddenReasons(item).length===0;
  const mapEligible=item=>item.id===D.indoorArea.id?item.items.some(id=>eligible(byId.get(id))):eligible(item);
  const durationText=item=>item.durationLabel||(item.durationMinutes?`约 ${item.durationMinutes} 分钟`:item.duration||'按现场体验安排');
  const diningMethod=item=>item.service==='seating'?'可预约座位':`无需预约${item.mobileOrder?item.service==='mobile-required'?' · 须手机点餐':' · 可手机点餐':''}`;
  const diningIcon=item=>item.stall?'stall':'food';
  function seatingTimingText(){
    const [year,month,day]=dateForStatus().split('-').map(Number),priorMonth=month===1?12:month-1,priorDays=new Date(Date.UTC(year,month-1,0)).getUTCDate();
    return day<=priorDays?`${month} 月 ${day} 日用餐：${priorMonth} 月 ${day} 日日本时间 10:00（北京时间 09:00）起可订。`:'提前一个月开放订座；上月没有同一天时，以官方预约页显示的开放日为准。';
  }
  const mobileOrderHTML=item=>`<section class="detail-booking">${item?'<h3>手机点餐怎么点？</h3>':'<h2 class="reading-subtitle">手机点餐怎么点？</h2>'}<p>使用东京迪士尼度假区官方 App（<span lang="en">Tokyo Disney Resort App</span>，英文版），登录 MyDisney，入园后操作：</p><ol><li>打开 <span lang="en">My Plan → Disney Mobile Order</span>，${item?`选择“${escapeHTML(item.name)}”`:'选择餐厅'}。</li><li>选择来店时段、餐点和数量，点 <span lang="en">Add to Cart</span>（加入购物车）。</li><li>选择付款方式，核对后点 <span lang="en">Place Order</span>（确认订单）。</li><li>在所选时段到店后，打开订单点 <span lang="en">I'm Here</span>（我已到店），再按 App 显示的取餐号码取餐。</li></ol><a class="source-link" href="${D.sources.mobileOrder}" target="_blank" rel="noopener noreferrer">官方 App 下载与点餐步骤 ${icons('external')}</a></section>`;
  const mapName=item=>item.type==='show'?'演出':({219:'翱翔',223:'地心探险',255:'冰雪奇缘',256:'长发公主',257:'小飞侠',230:'贡多拉',247:'尼莫',231:'小火车',232:'小火车',227:'渡轮',228:'渡轮',229:'渡轮',40001:'室内区'})[item.id]||item.short;
  const englishLine=item=>{const name=escapeHTML(item?.en||'');return name?`<small class="detail-original" lang="en">${name}</small>`:'';};

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({visitDate:state.visitDate,showRoute:state.showRoute,showHidden:state.showHidden,mapOrientation:state.mapOrientation,navCollapsed:state.navCollapsed,listCollapsed:state.listCollapsed,planWindow:D.planningWindow.version})); return true; } catch { return false; }
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
      const reasons=hiddenReasons(item);
      if(state.category==='hidden'){if(!reasons.length)return false;}
      else if(!eligible(item))return false;
      if(!['all','hidden'].includes(state.category)&&itemCategory(item)!==state.category)return false;
      if (state.area !== 'all' && item.area !== state.area) return false;
      if (q && !`${item.name}${item.short}${item.en}${item.aliases}${areas.get(item.area).name}${indoorIds.has(item.id)?D.indoorArea.name+D.indoorArea.en:''}`.normalize('NFKC').toLowerCase().replace(/\s+/g,'').includes(q)) return false;
      if (state.filter === 'recommended' && !D.coreIds.includes(item.id)) return false;
      if (state.filter === 'gentle' && item.intensity !== 1) return false;
      if (state.filter === 'thrill' && item.intensity !== 3) return false;
      if (state.filter === 'dpa' && !hasDPA(item)) return false;
      if (state.filter === 'indoor' && !item.indoor) return false;
      if (state.filter === 'show' && item.type!=='show') return false;
      if (state.filter === 'seating' && item.service!=='seating') return false;
      if (state.filter === 'walk-in' && (item.type!=='restaurant'||item.service==='seating')) return false;
      if (state.filter === 'official-hidden' && !reasons.some(reason=>reason.kind==='official')) return false;
      if (state.filter === 'user-hidden' && !reasons.some(reason=>reason.kind==='user')) return false;
      return true;
    });
  }
  function renderResults() {
    currentResults = matchedItems();
    const count = currentResults.length;
    $('#result-count').textContent = `${count} 个`;
    const labels = {all:state.category==='all'?'探索全园':state.category==='hidden'?'隐藏项目与原因':categoryNames[state.category],recommended:'星标项目',gentle:'温和体验',thrill:'刺激冒险',dpa:'DPA 适用',indoor:'室内项目',show:'花船与水上秀',seating:'可预约座位','walk-in':'无需预约','official-hidden':'官方停运','user-hidden':'用户主动隐藏'};
    $('#list-title').textContent = state.query ? '搜索结果' : state.area !== 'all' ? areas.get(state.area).name : labels[state.filter];
    const extraOptions=state.category==='hidden'?[['all','全部隐藏原因'],['official-hidden','官方停运'],['user-hidden','用户主动隐藏']]:state.category==='restaurant'?[['all','全部餐厅'],['seating','可预约座位'],['walk-in','无需预约']]:[['all','全部类型'],['recommended','星标项目'],['dpa','DPA 适用'],['gentle','温和体验'],['thrill','刺激冒险'],['indoor','室内项目']];
    $('#extra-filter').innerHTML=extraOptions.map(([value,label])=>`<option value="${value}">${label}</option>`).join('');$('#extra-filter').value=state.filter;
    $('#show-hidden').checked=state.showHidden;
    $('#hidden-filter-note').textContent=`${formatDate(dateForStatus())} · 未公布场次保留`;
    $('#hidden-list-note').hidden=state.category!=='hidden';
    $('#clear-filter').hidden = state.category==='all'&&state.filter === 'all' && state.area === 'all' && !state.query;
    $$('#filters button').forEach(b => { const active=b.dataset.category===state.category; b.classList.toggle('active',active); b.setAttribute('aria-pressed',String(active)); });
    $('#attraction-list').innerHTML = count ? currentResults.map(item => {
      const area=areas.get(item.area),reasons=hiddenReasons(item),stop=activePlan?.stops.find(stop=>stop.id===item.id);
      return `<article class="attraction-row ${state.selected===item.id?'selected':''}" style="--area-color:${area.color}"><button class="attraction-open" data-select="${item.id}" aria-label="查看${escapeHTML(item.name)}详情"><div class="list-photo ${item.image?'':'list-symbol'}">${item.image?`<img src="${item.image}" alt="" loading="lazy" width="80" height="70">`:icons(diningIcon(item))}${stop?`<span class="list-order">${stop.order}</span>`:''}</div><span class="list-copy"><strong>${item.short}${D.coreIds.includes(item.id)?icons('star'):''}</strong><span class="row-tags"><span>${item.stall?'路边小摊':categoryNames[itemCategory(item)]}</span><span>${item.type==='restaurant'?diningMethod(item):item.playType}</span>${item.type==='restaurant'?'':`<span>${durationText(item)}</span>`}</span>${reasons.length?`<span class="row-hidden-reason">${reasons.map(reason=>escapeHTML(reason.text)).join('<br>')}</span>`:''}</span></button></article>`;
    }).join('') : `<div class="empty-state">${icons('search')}<h3>没有找到匹配项目</h3><p>试试项目的中文名、英文名，或放宽筛选。</p><button class="outline-button" data-action="clear-filters">查看全部项目</button></div>`;
    const ids=new Set(currentResults.map(item=>mapItemId(item.id)));
    $$('.map-pin').forEach(pin => { const item=byId.get(Number(pin.dataset.select));pin.hidden=!mapEligible(item); pin.classList.toggle('is-filtered-out',!ids.has(item.id)); pin.classList.toggle('is-selected',item.id===mapItemId(state.selected)); pin.classList.toggle('is-closed',Boolean(closureOn(item)));pin.classList.toggle('has-dpa',hasDPA(item)&&!closureOn(item)); });
    $$('.dining-pin').forEach(pin=>{const item=byId.get(Number(pin.dataset.select));pin.hidden=!eligible(item);pin.classList.toggle('is-selected',item.id===state.selected);pin.classList.toggle('is-filtered-out',!ids.has(item.id));});
    $$('.area-boundary').forEach(region=>region.classList.toggle('area-active',region.dataset.area===state.area));
    $('.map-caption strong').textContent=state.area==='all'?'东京迪士尼海洋':areas.get(state.area).name;
    const available=catalogue.filter(eligible);$('.map-total').textContent=state.category==='all'&&state.area==='all'&&state.filter==='all'&&!state.query?`${available.filter(item=>item.type!=='show'&&item.type!=='restaurant').length} 项目 · ${available.filter(item=>item.type==='show').length} 演出 · ${available.filter(item=>item.type==='restaurant').length} 餐饮`:`${count} 个${state.category==='all'?'匹配':categoryNames[state.category]}`;
    renderRouteOverlay();
  }
  function clearFilters() {
    state.query=''; state.area='all'; state.filter='all';state.category='all';
    $('#search').value='';$('#area-filter').value='all';renderResults();fitMap();
  }
  function setShowHidden(show){
    state.showHidden=show;persist();renderRoute();renderResults();
    if(state.selected)renderDetail(byId.get(state.selected));
    if(state.view==='map')fitMap();
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
  function showReferenceHTML(item,compact=false){
    const ref=D.showReferences[item.id];if(!ref)return '';
    if(compact)return `<p class="show-reference-note"><strong>往期参考</strong> ${formatDate(ref.date)}：${ref.times.join(' / ')}<br>日本时间；仅参考，非所选日期场次。</p>`;
    return `<section class="detail-schedule historical-schedule"><h3>往期时间参考</h3><p>${formatDate(ref.date)} · 本导览保存的排期</p><ul class="show-time-list">${ref.times.map(time=>`<li><time>${time}</time></li>`).join('')}</ul><small>日本时间；只用于了解大致时段，不代表 ${formatDate(dateForStatus())} 的演出安排。</small><a class="source-link" href="${ref.sourceUrl}" target="_blank" rel="noopener noreferrer">官方场次页 ${icons('external')}</a></section>`;
  }
  function renderDetail(item) {
    const area=areas.get(item.area),closure=closureOn(item),panel=$('#detail-panel');panel.hidden=false;
    const isGroup=item.type==='group',hasPhoto=!isGroup&&Boolean(item.image);panel.classList.toggle('is-indoor-area',isGroup);
    const status=closure?'':item.type==='restaurant'?`<span class="detail-status">${diningMethod(item)}${item.price?' · ¥'+number(item.price):''}</span>`:hasDPA(item)?`<span class="detail-status">DPA ¥${number(item.dpa)} / 人 / 次</span>`:'';
    const reasons=hiddenReasons(item),hiddenDetails=reasons.length?`<section class="detail-hidden"><h3>隐藏原因</h3>${reasons.map(reason=>`<p>${escapeHTML(reason.text)}</p>`).join('')}${!state.showHidden?'<button class="inline-guide-link" data-action="show-hidden">在地图和普通清单中显示隐藏项目</button>':''}</section>`:'';
    const booking=item.service==='seating'?`<section class="detail-booking"><h3>如何提前预约座位？</h3><p>${seatingTimingText()}</p><ol><li>打开官方订座网页，注册或登录 MyDisney。</li><li>选择用餐日期、${D.party.adults} 位成人、“${escapeHTML(item.name)}”和用餐时段，查询空位。</li><li>核对信息，确认预约并保存结果。</li></ol><a class="source-link" href="${D.sources.restaurantBooking}" target="_blank" rel="noopener noreferrer">打开官方订座页 ${icons('external')}</a></section>`:'';
    const diningDetails=item.type==='restaurant'?`${booking}${item.mobileOrder?mobileOrderHTML(item):''}${item.mapLocationNote?`<p class="quiet-note">${item.mapLocationNote}</p>`:''}`:'';
    const timing=!isGroup&&item.type!=='restaurant'?`<p class="detail-duration">${durationText(item)}<small>${item.durationIsEstimate?'导览建议，不含排队':'体验时长，不含排队'}</small></p>`:'';
    const times=item.type==='show'?P.showTimes(item.id,dateForStatus()):null;
    const showSchedule=item.type==='show'?`<section class="detail-schedule"><h3>${formatDate(dateForStatus())} 演出时间</h3>${times===null?'<p>该日场次尚未公布。官方通常在前一个月 8 日左右公布下月安排。</p>':times.length?`<ul class="show-time-list">${times.map(time=>`<li><time>${time}</time></li>`).join('')}</ul><small>日本时间</small>`:'<p>该日停演。</p>'}</section>${showReferenceHTML(item)}`:'';
    const back=indoorIds.has(item.id)?`<button class="detail-back" data-select="${D.indoorArea.id}">${icons('arrow')}返回室内区</button>`:'';
    const children=item.type==='group'?`<ul class="indoor-projects" aria-label="室内项目">${item.items.filter(id=>eligible(byId.get(id))).map(id=>{const child=byId.get(id);return `<li><button class="indoor-project" data-select="${id}" aria-label="查看${escapeHTML(child.name)}详情"><img src="${child.image}" alt="" width="48" height="48" loading="lazy"><span class="indoor-project-copy"><strong>${child.name}</strong><small>${child.playType} · ${durationText(child)}${closureOn(child)?'<span class="tag closed">暂停运营</span>':''}</small></span>${icons('arrow')}</button></li>`;}).join('')}</ul>`:'';
    const close=`<button class="detail-close icon-button" data-action="close-detail" aria-label="关闭项目详情">${icons('close')}</button>`;
    const title=`<h2>${item.name}${D.coreIds.includes(item.id)?icons('star'):''}</h2>`;
    panel.innerHTML=`${hasPhoto?`<div class="detail-photo"><img src="${item.image}" alt="${escapeHTML(item.imageAlt||item.name)}" width="800" height="450">${close}</div>`:''}<div class="detail-content">${back}${!hasPhoto?`<div class="detail-group-heading">${title}${close}</div>`:title}${englishLine(item)}${isGroup?'':`<p class="detail-description">${item.oneLine}</p>`}${timing}${status}${hiddenDetails}${diningDetails}${showSchedule}${children}</div><div class="detail-footer"><button class="primary-button" data-action="${item.type==='restaurant'?'go-dining':'go-route'}">${icons(item.type==='restaurant'?'food':'route')}${item.type==='restaurant'?'查看用餐攻略':'查看一日时间表'}</button><a class="detail-official" href="${item.type==='show'?item.scheduleUrl:item.url}" target="_blank" rel="noopener noreferrer">${item.type==='group'?'官方项目目录':item.type==='show'?'官方场次':'官方详情'} ${icons('external')}</a></div>`;panel.scrollTop=0;
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
    $('#show-cards').innerHTML=D.shows.filter(eligible).map(item=>`<article class="show-reference-item"><button class="show-row" data-select="${item.id}"><span>${item.name}</span><span>${showTimeText(item)} · ${item.durationMinutes} 分钟</span>${icons('arrow')}</button>${showReferenceHTML(item,true)}</article>`).join('')||'<p>当前停运筛选下没有可显示的演出。</p>';
  }
  function renderDining() {
    const foodRow=item=>`<button class="food-row" data-select="${item.id}">${icons(diningIcon(item))}<span>${item.name}<small>${areas.get(item.area).name} · ${diningMethod(item)}${item.venue?' · '+item.venue:''}${item.showDiningUrl?' · 演出区另订':''}</small>${hiddenReasons(item).length?`<small class="row-hidden-reason">${hiddenReasons(item).map(reason=>escapeHTML(reason.text)).join('；')}</small>`:''}</span>${item.price?`<b>¥${number(item.price)}</b>`:''}${icons('arrow')}</button>`;
    const dining=D.dining.filter(eligible);
    $('#seating-options').innerHTML=dining.filter(item=>item.service==='seating').map(foodRow).join('');
    $('#walkin-options').innerHTML=dining.filter(item=>item.service!=='seating'&&!item.stall).map(foodRow).join('');
    $('#snack-options').innerHTML=dining.filter(item=>item.service!=='seating'&&item.stall).map(foodRow).join('');
    $('#dining-closure-note').textContent=D.dining.filter(item=>closureOn(item)).map(item=>`${item.name}：${formatDate(closureOn(item)[0])}–${formatDate(closureOn(item)[1])} 停运。`).join(' ');
    $('#booking-example').textContent=seatingTimingText();
    $('#mobile-order-instructions').innerHTML=mobileOrderHTML();
  }
  function renderDPA(){
    const ordered=[...D.coreIds.map(id=>byId.get(id)),...allAttractions.filter(item=>item.dpa&&!D.coreIds.includes(item.id))].filter(eligible);
    $('#dpa-table-body').innerHTML=ordered.map(item=>`<tr><td><button data-select="${item.id}">${item.short}${D.coreIds.includes(item.id)?icons('star'):''}</button>${hiddenReasons(item).map(reason=>`<span class="table-closed">${reason.label}</span>`).join('')}</td><td>¥${number(item.dpa)}</td></tr>`).join('');
    $('#show-dpa-list').innerHTML=D.dpaShows.filter(item=>{const show=D.shows.find(show=>show.name===item.name);return !show||eligible(show);}).map(item=>`<p class="show-dpa-row"><span>${item.name}</span><strong>¥${number(item.price)}</strong></p>`).join('')+'<p>白天花船无 DPA；可用演出的名额以官方 App 为准。</p>';
    const planned=activePlan.rows.filter(row=>row.usesDpa).map(row=>byId.get(row.itemId).short).join('、');
    const budget=activePlan.dpaBudget?`这份草案按 ${planned} 买到 DPA 来留时间，两位成人约 ${number(activePlan.dpaBudget)} 日元。没买到时，需要增加排队时间或删减项目。`:'本日已排项目按普通排队预算。';
    $('#dpa-plan-cost').textContent=budget+(activePlan.dpaExampleCost>activePlan.dpaBudget?` 旁注还列了可选购买；若全部购买，两人合计约 ${number(activePlan.dpaExampleCost)} 日元。`:'');
    $('#route-dpa-budget').textContent=budget;
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
    $('#route-profile').textContent=`${D.party.adults} 位成人 · 逆时针主环线｜${activePlan.routeSummary}`;
    const changes=[...activePlan.substitutions.map(change=>`${change.from.short}检修 → ${change.to.short}`),...activePlan.unavailable.map(item=>`${item.short}本次未排入，按现场队列取舍。`)];
    $('#route-changes').hidden=!changes.length;$('#route-change-list').textContent=changes.join('；');
    const relative=value=>{const delta=value-activePlan.opening;return delta<0?`开园前 ${-delta} 分钟`:`开园后 ${Math.floor(delta/60)}:${String(delta%60).padStart(2,'0')}`;};
    const clock=value=>activePlan.knownHours?P.clock(value):relative(value);
    const headings='<div class="timeline-column-headings"><span>整体行程</span><span>DPA 并行操作</span></div>';
    $('#route-timeline').innerHTML=headings+activePlan.rows.map((row,index)=>{
      const item=row.itemId||row.restaurantId?byId.get(row.itemId||row.restaurantId):null,order=row.kind==='arrival'?0:row.itemId?activePlan.stops.find(stop=>stop.id===row.itemId)?.order:null;
      const time=row.tentative?`<time class="relative-time">${row.itemId===20001?'午前预留':'晚间预留'}</time><small class="stop-end">${row.end-row.start} 分钟预算</small>`:`<time>${clock(row.start)}</time><small class="stop-end">– ${clock(row.end)}</small>`;
      const facts=row.kind==='ride'?`体验 ${row.ride} 分钟 <span>·</span> ${row.usesDpa?'DPA 通道预算':'排队预算'} ${row.queue} 分钟 <span>·</span> 步行约 ${row.walk} 分钟`:row.kind==='explore'?`自由探索约 ${row.ride} 分钟 <span>·</span> 步行约 ${row.walk} 分钟`:row.kind==='show'?`${row.tentative?'场次待公布':P.clock(row.showStart)+' 开演'} <span>·</span> 表演 ${row.ride} 分钟`:'';
      const title=item?(row.kind==='show'?item.name:row.kind==='meal'?`${item.meal} · ${item.name}`:item.short):row.title;
      const actions=activePlan.dpaActions.filter(action=>action.anchorRowIndex===index);
      const notes=actions.map(action=>{const target=byId.get(action.dpaItemId);return `<article class="dpa-note" data-buy="${action.start}"><div class="dpa-note-heading">${icons('ticket')}<time>${clock(action.start)}</time><span>${action.planned?'查 DPA':'可选 DPA'}</span></div><button data-select="${target.id}">${target.short}</button><p class="dpa-target">目标 ${clock(action.targetStart)} 前后使用</p><p>${D.party.adults} 人 ${number(action.pairPrice)} 日元 · 若此时付款，下张最早 ${clock(action.nextEligible)}</p><p>${escapeHTML(action.description)}</p></article>`;}).join('');
      return `<div class="timeline-item" data-start="${row.start}" data-end="${row.end}"><article class="timed-stop ${row.kind}"><div class="stop-time">${time}</div><div class="stop-body"><div class="stop-title">${order!=null?`<span class="stop-number">${order}</span>`:icons(row.kind==='show'?(row.itemId===20001?'boat':'moon'):row.kind==='meal'?'food':row.kind==='walk'?'arrow':'route')}${item?`<button data-select="${item.id}">${title}${D.coreIds.includes(item.id)?icons('star'):''}</button>`:`<h3>${title}</h3>`}</div>${facts?`<div class="step-facts">${facts}</div>`:''}${row.description?`<p class="step-note">${escapeHTML(row.description)}</p>`:''}</div></article><aside class="dpa-side-list" aria-label="本段 DPA 操作">${notes}</aside>${notes?'<svg class="timeline-branch" aria-hidden="true" focusable="false"></svg>':''}</div>`;
    }).join('');
    renderShows();renderDPA();renderDining();renderRouteOverlay();queueTimelineLayout();
  }
  function renderRouteOverlay(){
    if(!activePlan||!$('#map-route'))return;
    $('#route-visible').checked=state.showRoute;$('#map-route').hidden=!state.showRoute;
    $('#map-legend').innerHTML=`<span class="legend-order">1</span>项目顺序 <i class="legend-dot"></i>其他项目 ${icons('star')}重点 ${icons('boat')}演出 ${icons('food')}餐厅 ${icons('stall')}小摊 <i class="legend-dpa" title="DPA 适用设施，实际名额以官方 App 为准"></i><span class="visually-hidden">绿色外圈：</span>DPA适用`;
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
      if(row.kind==='ride')lines.push(`  体验约 ${row.ride} 分钟；${row.usesDpa?'DPA 通道预算':'排队预算'} ${row.queue} 分钟；步行约 ${row.walk} 分钟。`);
      if(row.kind==='show')lines.push(`  ${row.tentative?'具体场次待公布':'官方开演 '+P.clock(row.showStart)}；表演 ${row.ride} 分钟；提前预留 ${row.prepare} 分钟找位置。`);
      if(row.kind==='explore')lines.push(`  自由探索约 ${row.ride} 分钟；步行约 ${row.walk} 分钟。`);
      if(row.description)lines.push('  '+row.description);
      lines.push('');
    }
    if(activePlan.dpaActions.length){lines.push('DPA 并行操作（在主行程的排队、等场或用餐间隙进行）');for(const action of activePlan.dpaActions)lines.push(`${time(action.start)}  ${action.title}；争取 ${time(action.targetStart)} 前后体验；下一张最早 ${time(action.nextEligible)}；${D.party.adults} 人 ${number(action.pairPrice)} 日元。`, '  '+action.description);lines.push(`示例全部购买：${D.party.adults} 位成人合计约 ${number(activePlan.dpaExampleCost)} 日元；未预订，可按需只买几项。`);}
    lines.push($('#route-dpa-budget').textContent,'餐厅不接入路线，午晚餐就近自选。',$('#booking-example').textContent,...activePlan.substitutions.map(change=>`${change.from.name}检修 → ${change.to.name}`),...activePlan.unavailable.map(item=>`${item.short}本次未排入，请结合 DPA 和现场队列重新取舍。`),D.sources.calendar,D.sources.dpa,D.sources.dining,D.sources.mobileOrder);
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
    const entryLeft=entry.hidden?entryX:Math.max(18,Math.min(width-entry.offsetWidth+6,entryX));
    entry.style.left=`${entryLeft}px`;entry.style.top=`${entryY}px`;
    const viewportRect=viewport.getBoundingClientRect(),controlRect=$('.map-controls').getBoundingClientRect();
    const controls={x:controlRect.left-viewportRect.left-4,y:controlRect.top-viewportRect.top-4,w:controlRect.width+8,h:controlRect.height+8};
    const routeIds=new Set(activePlan.stops.map(item=>mapItemId(item.id)));
    const visible=mapNodes.filter(node=>!node.button.hidden).map(node=>{
      const p=point(node.item),isRoute=routeIds.has(node.item.id),star=D.coreIds.includes(node.item.id),core=$('.pin-core,.dining-core',node.button).getBoundingClientRect();
      const cx=core.left+core.width/2,cy=core.top+core.height/2,bounds={l:core.width/2,r:core.width/2,t:core.height/2,b:core.height/2};
      const starBox=$('.pin-star',node.button)?.getBoundingClientRect();
      if(starBox?.width){bounds.l=Math.max(bounds.l,cx-starBox.left);bounds.r=Math.max(bounds.r,starBox.right-cx);bounds.t=Math.max(bounds.t,cy-starBox.top);bounds.b=Math.max(bounds.b,starBox.bottom-cy);}
      return {...node,p,x:view.x+p.x*view.scale,y:view.y+p.y*view.scale,...bounds,isRoute,priority:node.item.id===mapItemId(state.selected)?-1:(isRoute||node.item.type==='show')?0:node.item.type==='restaurant'?1:star?2:3};
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
    const routePoints=[{stageX:(entryLeft-view.x)/view.scale,stageY:entryPoint.y},...activePlan.routePoints.map(item=>positionMap.get(mapItemId(item.id))||{stageX:point(item).x,stageY:point(item).y})];
    $('#map-route').innerHTML=`<svg class="route-lines" viewBox="0 0 ${MAP_W} ${MAP_H}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="route-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="#ac175f" stroke="none"/></marker></defs>${routePoints.slice(1).map((to,index)=>{const from=routePoints[index],d=`M${from.stageX} ${from.stageY}L${to.stageX} ${to.stageY}`;return `<path class="route-halo" d="${d}"/><path class="route-segment" d="${d}" marker-end="url(#route-arrow)"/>`;}).join('')}</svg>`;
    mapNodes.forEach(node=>node.label.classList.remove('is-visible'));
    const fixedLabels=$$('.entry-label',viewport).filter(element=>!element.hidden).map(element=>{const r=element.getBoundingClientRect();return {x:r.left-viewportRect.left-3,y:r.top-viewportRect.top-3,w:r.width+6,h:r.height+6};});
    const occupied=[...placed,controls,...fixedLabels];
    const panel=$('#detail-panel');
    if(!panel.hidden){const r=panel.getBoundingClientRect();occupied.push({x:r.left-viewportRect.left,y:r.top-viewportRect.top,w:r.width,h:r.height});}
    const labels=visible.filter(node=>node.isRoute||node.item.type==='show'||(!viewport.classList.contains('is-dragging')&&(node.item.id===hoveredMarker||node.button.matches(':focus-visible'))));
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
    $('#map-dining').innerHTML=D.dining.map(item=>{const p=point(item);return `<button class="dining-pin ${item.snack?'snack-pin':''} ${item.stall?'stall-pin':''}" style="left:${p.x}px;top:${p.y}px" data-select="${item.id}" aria-label="${item.stall?'路边小摊':'餐厅'}：${item.name}"><span class="dining-core">${icons(diningIcon(item))}</span><span class="pin-label">${item.short}</span></button>`;}).join('');
    $('#map-labels').innerHTML=[...mapCatalogue,...D.dining].map(item=>`<span class="map-name" data-label-for="${item.id}">${escapeHTML(mapName(item))}</span>`).join('');
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
    if(target.dataset.category){state.category=target.dataset.category;state.filter='all';closeDetail(false);renderResults();return;}
    if(target.dataset.area){selectArea(target.dataset.area);return;}
    if(target.dataset.mobile){$('#workspace').classList.toggle('mobile-list',target.dataset.mobile==='list');updateMobileButtons(target.dataset.mobile);if(target.dataset.mobile==='map')requestAnimationFrame(fitMap);return;}
    if(target.dataset.action==='clear-filters')clearFilters();
    if(target.dataset.action==='close-detail')closeDetail();
    if(target.dataset.action==='go-route'){closeDetail(false);setView('guide');setHash('#day-route');scrollToGuideSection('#day-route');}
    if(target.dataset.action==='go-dining'){closeDetail(false);scrollToGuideSection('#dining-guide');setHash('#dining-guide');}
    if(target.dataset.action==='go-dpa'){scrollToGuideSection('#dpa-guide');setHash('#dpa-guide');}
    if(target.dataset.action==='show-hidden')setShowHidden(true);
  });
  $('#search').addEventListener('input',event=>{state.query=event.target.value;closeDetail(false);renderResults();});
  $('#extra-filter').addEventListener('change',event=>{state.filter=event.target.value;closeDetail(false);renderResults();});
  $('#area-filter').addEventListener('change',event=>{state.area=event.target.value;closeDetail(false);renderResults();fitResults();});
  $('#clear-filter').addEventListener('click',clearFilters);
  $('#show-hidden').addEventListener('change',event=>setShowHidden(event.target.checked));
  $('#toggle-orientation').addEventListener('click',()=>{state.mapOrientation=state.mapOrientation==='north'?'official':'north';applyMapOrientation();persist();});
  $('#toggle-navigation').addEventListener('click',()=>{state.navCollapsed=!state.navCollapsed;applyPanelLayout();persist();});
  $('#toggle-project-list').addEventListener('click',()=>{if(innerWidth<=760){const show=!$('#workspace').classList.contains('mobile-list');$('#workspace').classList.toggle('mobile-list',show);updateMobileButtons(show?'list':'map');if(!show)requestAnimationFrame(fitMap);}else{state.listCollapsed=!state.listCollapsed;applyPanelLayout();persist();}});
  window.addEventListener('resize',applyPanelLayout);
  $('#zoom-in').addEventListener('click',()=>zoomAt(view.zoom*1.35));$('#zoom-out').addEventListener('click',()=>zoomAt(view.zoom/1.35));$('#reset-map').addEventListener('click',fitMap);
  $('#retry-map').addEventListener('click',()=>{const img=$('.map-art image'),url=`assets/official-map.jpg?retry=${Date.now()}`;img.setAttribute('href',url);const check=new Image();check.onload=()=>{$('#map-error').hidden=true;};check.onerror=()=>toast('仍未加载成功，请检查 assets 文件夹是否完整。');check.src=url;});
  $('#visit-date').value=dateForStatus();
  $('#visit-date').addEventListener('change',event=>{state.visitDate=event.target.value||D.planningWindow.reference;event.target.value=state.visitDate;persist();renderHours();renderRoute();renderResults();if(state.selected)renderDetail(byId.get(state.selected));});
  $('#route-to-map').addEventListener('click',()=>{state.query='';state.area='all';state.filter='all';state.category='all';state.showRoute=true;persist();$('#search').value='';$('#area-filter').value='all';$('#workspace').classList.remove('mobile-list');updateMobileButtons('map');setView('map');renderResults();requestAnimationFrame(fitMap);});
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
  new ResizeObserver(()=>{const footerHeight=$('.map-bottom').getBoundingClientRect().height;$('.map-panel').style.setProperty('--map-footer-height',footerHeight+'px');queueMapLayout();}).observe($('.map-bottom'));
  D.areas.forEach(area=>{const option=document.createElement('option');option.value=area.id;option.textContent=area.name;$('#area-filter').append(option);});
  applyPanelLayout();applyMapOrientation(false);renderMap();renderHours();renderRoute();renderResults();navigateHash();
  document.fonts?.ready.then(()=>{queueMapLayout();queueTimelineLayout();});
})();

