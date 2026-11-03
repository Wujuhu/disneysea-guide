/* Official facts checked 2026-11-01. Editorial intensity and tips are suggestions. */
window.DISNEY_DATA = {
  checked: '2026-11-01',
  party:{adults:2,children:0},
  sources: {
    map: 'https://www.tokyodisneyresort.jp/sc/tds/map.html',
    pdf: 'https://media2.tokyodisneyresort.jp/home/download/map/TDS_map_sc.pdf',
    attractions: 'https://www.tokyodisneyresort.jp/en/tds/attraction.html',
    dpa: 'https://www.tokyodisneyresort.jp/en/tdr/guide/app_service/disneypremieraccess.html',
    app: 'https://www.tokyodisneyresort.jp/en/tdr/guide/app.html',
    services: 'https://faq-en.tokyodisneyresort.jp/answer/680ba05101fdf7431bafb6b0/',
    mobileOrder: 'https://www.tokyodisneyresort.jp/en/tdr/guide/app_service/mobileorder.html',
    dining: 'https://www.tokyodisneyresort.jp/en/tdr/guide/app_service/priorityseating/',
    calendar: 'https://www.tokyodisneyresort.jp/en/tds/monthly/calendar.html'
  },
  areas: [
    {id:'harbor', name:'地中海港湾', en:'Mediterranean Harbor', color:'#a36536', x:1390, y:1450, description:'入园后首先到达的海港。看水景、乘贡多拉，也从这里出发前往各区域。'},
    {id:'american', name:'美国海滨', en:'American Waterfront', color:'#b34d57', x:870, y:1310, description:'复古街区、大轮船和港口小镇，玩具总动员与惊魂古塔都在这里。'},
    {id:'port', name:'发现港', en:'Port Discovery', color:'#806719', x:1210, y:885, description:'未来感海港，可以和尼莫一起冒险，也可乘电气化铁路往返美国海滨。'},
    {id:'delta', name:'失落河三角洲', en:'Lost River Delta', color:'#297557', x:1890, y:670, description:'丛林与古代遗迹主题，集中两项较刺激的冒险项目。'},
    {id:'fantasy', name:'梦幻泉乡', en:'Fantasy Springs', color:'#466ca2', x:2570, y:330, description:'冰雪奇缘、长发公主和小飞侠的故事世界，位于离主入口较远的一端。'},
    {id:'arabian', name:'阿拉伯海岸', en:'Arabian Coast', color:'#80589a', x:2210, y:1280, description:'宫殿、飞毯与辛巴达的故事，适合在热门项目之间安排几段轻松体验。'},
    {id:'mermaid', name:'美人鱼礁湖', en:'Mermaid Lagoon', color:'#b35883', x:1770, y:990, description:'小美人鱼主题区域。部分项目在室内的川顿王海底王国，适合避雨和休息。'},
    {id:'mysterious', name:'神秘岛', en:'Mysterious Island', color:'#147f88', x:1530, y:1070, description:'以火山为地标的尼莫船长基地，地心探险和海底两万里就在这里。'}
  ],
  attractions: [
    {id:255, no:'80', name:'安娜与艾莎的冰雪之旅', short:'冰雪奇缘', en:"Anna and Elsa's Frozen Journey", aliases:'Frozen 冰雪奇缘 安娜 艾莎 Elsa', area:'fantasy', x:2777,y:460, kind:'乘船 · 故事体验', intensity:2, height:0, duration:'约 6.5 分钟', indoor:true, dpa:2500, priority:true, recommended:true, description:'坐上小船，跟随安娜与艾莎重温《冰雪奇缘》的故事。音乐、场景和角色表演是主角，也有黑暗和带速度感的片段。', fit:'喜欢冰雪奇缘、音乐与沉浸式故事的游客。', caution:'未设最低身高，但需能独立保持稳定坐姿；并非全程平缓漂流。', tip:'如果这是你的必玩，入园后先查看 DPA 库存和可选时段。没有买到也可查看普通队列，别把“未买 DPA”理解为“不能玩”。', closures:[['2027-04-07','2027-04-30']]},
    {id:219,no:'2',name:'翱翔：梦幻奇航',short:'Soaring 梦幻奇航',en:'Soaring: Fantastic Flight',aliases:'奇幻飞行 飞越地平线 飞跃地平线 Soaring 梦幻飞行',area:'harbor',x:1800,y:1372,kind:'飞行模拟 · 巨幕',intensity:2,height:102,duration:'约 5 分钟',indoor:true,dpa:2500,priority:true,recommended:true,description:'先走进飞行博物馆，再坐上悬空的“飞行器”，跟随巨幕影像飞越世界风景，感受风与气味。不是在室外真正飞行。',fit:'喜欢壮阔风景、想体验飞行感的游客。',caution:'身高须满 102 cm。恐高、容易晕动或孕期游客不宜体验，乘坐前请看官方限制。',tip:'你听说的“奇幻飞行”通常指这个项目。它与冰雪奇缘相距较远，购买 DPA 时先留意时段，避免反复横穿园区。',closures:[['2027-04-10','2027-04-11']]},
    {id:256,no:'81',name:'乐佩公主天灯盛会',short:'长发公主',en:"Rapunzel's Lantern Festival",aliases:'长发公主 乐佩 Rapunzel Tangled',area:'fantasy',x:2568,y:622,kind:'乘船 · 音乐场景',intensity:1,height:0,duration:'约 5 分钟',dpa:2000,recommended:true,description:'乘船进入《魔发奇缘》的故事，欣赏乐佩与尤金的相遇，以及被天灯照亮的浪漫场景。',fit:'喜欢长发公主、浪漫布景和温和项目的游客。',caution:'有黑暗场景，具体乘坐与儿童陪同要求请查看官方介绍。',tip:'可和冰雪奇缘、小飞侠安排在同一片区域，减少折返。DPA 是可选项，按你的偏好与预算取舍。'},
    {id:257,no:'78',name:'小飞侠梦幻岛历险记',short:'小飞侠',en:"Peter Pan's Never Land Adventure",aliases:'Peter Pan 小飞侠 彼得潘 梦幻岛',area:'fantasy',x:2400,y:503,kind:'3D · 动感冒险',intensity:2,height:102,duration:'约 6 分钟',indoor:true,dpa:2000,recommended:true,description:'戴上 3D 眼镜，登上飞船，和小飞侠、奇妙仙子一起在梦幻岛冒险，迎战虎克船长。',fit:'喜欢沉浸影像、冒险剧情且不易晕动的游客。',caution:'身高须满 102 cm；车辆会旋转、晃动，容易晕 3D 或晕车的游客谨慎选择。',tip:'这与迪士尼乐园的小飞侠项目不同。可以和梦幻泉乡其他项目一起安排，先评估自己对 3D 的耐受。'},
    {id:223,no:'110',name:'地心探险之旅',short:'地心探险',en:'Journey to the Center of the Earth',aliases:'地心 Journey 火山',area:'mysterious',x:1500,y:1133,kind:'高速冒险 · 黑暗乘骑',intensity:3,height:117,duration:'约 3 分钟',dpa:2000,recommended:true,description:'乘地底探险车进入火山下的世界。前半段观察奇异洞穴，后段突遇危险，快速冲出地底。',fit:'想体验园区标志性刺激项目的游客。',caution:'身高须满 117 cm；有高速、黑暗和惊吓元素，孕期及特定健康状况不宜乘坐。',tip:'火山是找路的好地标。怕失重的同行者可在同一区选择海底两万里，不必全队都参加。',closures:[['2027-01-08','2027-03-08']]},
    {id:218,no:'30',name:'玩具总动员疯狂游戏屋',short:'玩具总动员',en:'Toy Story Mania!',aliases:'Toy Story 胡迪 巴斯光年',area:'american',x:913,y:1725,kind:'3D · 射击游戏',intensity:1,height:0,duration:'约 7 分钟',indoor:true,dpa:2000,recommended:true,description:'戴上 3D 眼镜，乘车进入玩具世界，和胡迪、巴斯光年一起挑战一系列互动射击小游戏。',fit:'喜欢互动游戏、想和同行者比比分的游客。',caution:'有旋转、较大音量和黑暗场景；需能在移动载具中独立坐稳。',tip:'很适合一起玩，但未必是每位首次游客都需要买 DPA 的项目。先把预算留给自己的必玩。'},
    {id:243,no:'27',name:'惊魂古塔',short:'惊魂古塔',en:'Tower of Terror',aliases:'Tower 跳楼机 恐怖古塔',area:'american',x:785,y:1572,kind:'自由落体 · 惊悚故事',intensity:3,height:102,duration:null,dpa:1500,recommended:true,description:'在神秘的海陶大饭店里搭乘电梯，体验围绕失踪事件展开的故事和突然升降。',fit:'喜欢失重感、惊悚氛围的游客。',caution:'身高须满 102 cm；包含突然坠落与惊吓，请认真查看官方乘坐限制。',tip:'对自由落体不适的游客可以直接跳过，建筑外观本身也值得欣赏。',closures:[['2026-09-28','2026-11-05'],['2027-05-10','2027-06-30']]},
    {id:222,no:'63',name:'印第安纳琼斯冒险旅程',short:'印第安纳琼斯',en:'Indiana Jones Adventure: Temple of the Crystal Skull',aliases:'Indiana Jones 水晶骷髅 魔宫 夺宝奇兵',area:'delta',x:1882,y:768,kind:'越野车 · 遗迹冒险',intensity:3,height:117,duration:null,indoor:true,dpa:1500,dpaFrom:'2026-11-30',recommended:true,description:'乘坐探险车深入水晶骷髅魔宫，在遗迹中经历颠簸、急转和突如其来的危险场景。',fit:'喜欢电影式冒险、能接受明显晃动的游客。',caution:'身高须满 117 cm；有强烈颠簸与惊吓元素。',tip:'官方公布 DPA 从 2026 年 11 月 30 日起适用；此前不能按“可以买 DPA”安排它。',closures:[['2025-08-18','2026-11-29']]},
    {id:242,no:'65',name:'忿怒双神',short:'忿怒双神',en:'Raging Spirits',aliases:'Raging Spirits 愤怒双神 过山车',area:'delta',x:2155,y:770,kind:'过山车 · 360° 翻转',intensity:3,height:117,maxHeight:195,duration:null,dpa:1500,recommended:true,description:'高速穿过古代神像的遗迹，体验带有 360 度翻转的户外过山车。',fit:'喜欢翻转过山车的刺激项目爱好者。',caution:'身高须在 117–195 cm 范围内，另有健康和乘坐限制。',tip:'翻转是它最直接的特点。想减少等待可以查看当天 DPA 或现场单人通道安排。',closures:[['2027-03-17','2027-04-10']]},
    {id:235,no:'90',name:'辛巴达传奇之旅',short:'辛巴达',en:"Sindbad's Storybook Voyage",aliases:'Sindbad Sinbad 辛巴达 老虎',area:'arabian',x:2288,y:906,kind:'乘船 · 音乐故事',intensity:1,height:0,duration:null,indoor:true,recommended:true,description:'和辛巴达、小老虎一起乘船出航，在音乐与童话布景中展开一场海上冒险。',fit:'喜欢温和体验、音乐故事的游客和家庭。',caution:'有室内黑暗场景，儿童陪同等要求请看官方介绍。',tip:'热门项目之间可以穿插这类温和体验。等待时间仍以当天 App 为准，不保证随时无需排队。',closures:[['2027-03-17','2027-04-16']]},
    {id:224,no:'109',name:'海底两万里',short:'海底两万里',en:'20,000 Leagues Under the Sea',aliases:'20000 海底 潜水艇',area:'mysterious',x:1606,y:1193,kind:'潜水艇主题 · 黑暗乘骑',intensity:2,height:0,duration:null,indoor:true,description:'坐进小型潜水艇主题载具，透过舷窗探索神秘的海底世界，观察沉船与奇异生命。',fit:'喜欢探索气氛、愿意接受黑暗场景的游客。',caution:'有黑暗、较大音效和幽闭感，怕黑的孩子可能需要提前了解。',tip:'和地心探险在同一区，可以安排成一组。没有最低身高不等于没有乘坐限制。',closures:[['2027-05-10','2027-06-18']]},
    {id:230,no:'1',name:'威尼斯贡多拉游船',short:'贡多拉游船',en:'Venetian Gondolas',aliases:'威尼斯 Gondola 贡多拉',area:'harbor',x:1283,y:1615,kind:'乘船 · 海港风景',intensity:1,height:0,duration:'约 11.5 分钟',description:'由船夫带领，乘贡多拉穿过运河，从水面欣赏意式建筑与地中海港湾。',fit:'想慢下来、欣赏园区风景的游客。',caution:'可能因天气、水上演出等暂停运营，需按现场指引上下船。',tip:'适合放在节奏较松的一段。不要把它当作全天持续可用的跨区交通。'},
    {id:258,no:'79',name:'奇妙仙子妙妙小车',short:'奇妙仙子小车',en:"Fairy Tinker Bell's Busy Buggies",aliases:'Tinker Bell 叮当 仙子',area:'fantasy',x:2480,y:409,kind:'小车 · 四季花园',intensity:1,height:0,duration:'约 2 分钟',description:'帮奇妙仙子配送包裹，坐着小车经过仙子山谷中代表四季的花园场景。',fit:'喜欢小巧细节、仙子主题的游客和家庭。',caution:'车辆会旋转，需能独立保持稳定坐姿。',tip:'梦幻泉乡内的轻松选项，不提供 DPA。仍需查看当天普通排队情况。'},
    {id:247,no:'56',name:'海底巡游艇：尼莫和好友的海洋世界',short:'尼莫海底巡游艇',en:'Nemo & Friends SeaRider',aliases:'Nemo Dory 多莉 尼莫 海底总动员',area:'port',x:1355,y:809,kind:'动感影院 · 海底冒险',intensity:2,height:90,duration:'约 5 分钟',indoor:true,description:'搭乘仿佛缩小成鱼的潜水艇，跟随尼莫、多莉和海洋伙伴，在动感座椅与影像中探索海底。',fit:'喜欢海底总动员、能接受动感影像的游客。',caution:'身高须满 90 cm；座椅会晃动，容易晕车的游客谨慎选择。',tip:'它是模拟器，不是缓缓漂流的小船。对晕动敏感的人先看清体验类型。'},
    {id:244,no:'4',name:'要塞探险',short:'要塞探险',en:'Fortress Explorations',aliases:'Fortress 要塞 大帆船',area:'harbor',x:1384,y:1184,kind:'步行探索 · 互动装置',intensity:1,height:0,duration:'自由探索',description:'走进要塞和帆船，探索航海、天文与科学主题的互动装置，按自己的节奏发现小细节。',fit:'喜欢自由探索、暂时不想排乘骑队列的游客。',caution:'部分空间昏暗，有楼梯和高低变化；无障碍路线请咨询工作人员。',tip:'适合放在预约之间的空档。这里另有“达芬奇挑战”，是日文地图解谜体验。',related:245},
    {id:245,no:'4B',name:'要塞探险：达芬奇挑战',short:'达芬奇挑战',en:'Fortress Explorations: The Leonardo Challenge',aliases:'Leonardo 达芬奇 解谜',area:'harbor',x:1438,y:1230,kind:'步行解谜 · 日文地图',intensity:1,height:0,duration:'自由探索',description:'在要塞探险内领取任务地图，依据线索寻找答案，完成与达芬奇有关的探索任务。',fit:'喜欢解谜，能够理解日文任务提示的游客。',caution:'任务地图仅提供日文；项目开放时段可能与园区不同。',tip:'和要塞探险共享区域，地图的 4B 是本导览区分两个体验的标注。无需把它们当作相距很远的两站。',related:244},
    {id:246,no:'26',name:'龟龟漫谈',short:'龟龟漫谈',en:'Turtle Talk',aliases:'Turtle Crush 海龟 对话',area:'american',x:788,y:1400,kind:'互动剧场 · 日语交流',intensity:1,height:0,duration:null,indoor:true,description:'在 S.S. 哥伦比亚号的海底展望室，与《海底总动员》里的海龟 Crush 互动聊天。',fit:'能听懂日语、喜欢即兴互动的游客。',caution:'主要以日语对话展开，不懂日语可能错过笑点和互动内容。',tip:'不是以大型舞台表演为主的项目。若行程紧、又不懂日语，可以降低优先级。'},
    {id:233,no:'31',name:'大都会交通工具',short:'复古汽车',en:'Big City Vehicles',aliases:'Big City 复古车 汽车',area:'american',x:1003,y:1392,kind:'复古汽车 · 观光',intensity:1,height:0,duration:'约 10 分钟',description:'乘坐不同造型的古董汽车，在美国海滨的街道上慢慢游览。',fit:'喜欢复古车、想欣赏街景的游客。',caution:'运行路线和运营可能受现场情况影响。',tip:'把它视为短途观光体验，不要用它保证跨区赶上 DPA 时段。',closures:[['2026-11-10','2026-12-25']]},
    {id:232,no:'28',name:'电气化铁路 · 美国海滨站',short:'铁路 · 美国海滨',en:'DisneySea Electric Railway (American Waterfront)',aliases:'Railway 铁路 小火车 交通',area:'american',x:1020,y:1518,kind:'高架列车 · 区域交通',intensity:1,height:0,duration:'约 2.5 分钟',indoor:true,description:'从美国海滨乘高架复古电车前往发现港，沿途俯瞰海滨街景。',fit:'想体验交通项目，或减少一段步行的游客。',caution:'乘车本身也可能排队，请把等车时间算进去。',tip:'它不是围绕全园一周的小火车；另一端是发现港。',closures:[['2027-01-08','2027-02-10']]},
    {id:231,no:'55',name:'电气化铁路 · 发现港站',short:'铁路 · 发现港',en:'DisneySea Electric Railway (Port Discovery)',aliases:'Railway 铁路 小火车 交通',area:'port',x:1467,y:904,kind:'高架列车 · 区域交通',intensity:1,height:0,duration:'约 2.5 分钟',indoor:true,description:'从发现港乘高架电车返回美国海滨，以不同视角看看园区。',fit:'想前往美国海滨、顺便体验复古列车的游客。',caution:'两站分别列出方便定位，属于同一种交通体验。',tip:'要赶预约时先比较等车和步行，不一定乘车更快。',closures:[['2027-01-08','2027-02-10']]},
    {id:227,no:'3',name:'渡轮航线 · 地中海港湾',short:'渡轮 · 地中海',en:'DisneySea Transit Steamer Line (Mediterranean Harbor)',aliases:'Steamer Transit 渡轮 交通',area:'harbor',x:1526,y:1365,kind:'轮船 · 区域交通',intensity:1,height:0,duration:'约 7 分钟',description:'从地中海港湾乘蒸汽轮船主题游船，前往园区深处的失落河三角洲。',fit:'喜欢水上风景、想体验交通项目的游客。',caution:'可能因水上演出、天气或检修暂停，路线请以现场为准。',tip:'这个站点的检修与其他站点可能不同，不能看到一处停运就推断全线都关闭。',closures:[['2026-08-04','2026-11-30'],['2027-05-10','2027-07-08']]},
    {id:228,no:'29',name:'渡轮航线 · 美国海滨',short:'渡轮 · 美国海滨',en:'DisneySea Transit Steamer Line (American Waterfront)',aliases:'Steamer Transit 渡轮 交通',area:'american',x:1039,y:1228,kind:'轮船 · 环游观光',intensity:1,height:0,duration:'约 13 分钟',description:'从美国海滨出发，乘船欣赏园区水道与海港景致。',fit:'想坐下来欣赏风景、放缓节奏的游客。',caution:'此站主要为环游观光，航线与运营以现场为准。',tip:'不要把这一站默认当成去梦幻泉乡的捷径，先确认航线终点。'},
    {id:229,no:'64',name:'渡轮航线 · 失落河三角洲',short:'渡轮 · 失落河',en:'DisneySea Transit Steamer Line (Lost River Delta)',aliases:'Steamer Transit 渡轮 交通',area:'delta',x:1855,y:855,kind:'轮船 · 区域交通',intensity:1,height:0,duration:null,description:'从丛林码头登船，沿水道向地中海港湾方向航行，欣赏不同主题海港。',fit:'希望用水上交通返回入口一侧的游客。',caution:'演出与现场运营可能影响航线，登船前确认去向。',tip:'先看 App 或问工作人员是否运行，再决定是否把它安排为回程。'},
    {id:236,no:'88',name:'沙漠商队旋转木马',short:'旋转木马',en:'Caravan Carousel',aliases:'Caravan Carousel 木马 神灯',area:'arabian',x:2066,y:1170,kind:'旋转木马 · 双层宫殿',intensity:1,height:0,duration:null,description:'在阿拉伯宫殿中的双层旋转木马上，选择骆驼、神灯精灵等不同造型的坐骑。',fit:'喜欢经典游乐设施和宫殿场景的游客。',caution:'不同坐骑和座位有各自的乘坐要求，按工作人员指引选择。',tip:'适合顺路体验，不必为了收集全部项目而专门跨园折返。'},
    {id:220,no:'89',name:'茉莉公主的飞天魔毯',short:'茉莉飞毯',en:"Jasmine's Flying Carpets",aliases:'Jasmine 茉莉 飞毯 阿拉丁',area:'arabian',x:2256,y:844,kind:'旋转升降 · 飞毯',intensity:1,height:0,duration:null,description:'登上飞毯，在茉莉公主的花园上空旋转，并通过操纵改变飞行感受。',fit:'喜欢轻度旋转、想体验户外项目的游客。',caution:'有旋转与升降，需要能独立稳定坐好。',tip:'对旋转敏感的人可以选择同区的辛巴达，把体力用在更喜欢的项目上。'},
    {id:226,no:'91',name:'神灯剧场',short:'神灯剧场',en:'The Magic Lamp Theater',aliases:'Magic Lamp 神灯 精灵 阿拉丁',area:'arabian',x:2151,y:1174,kind:'真人表演 · 3D 影像',intensity:1,height:0,duration:null,indoor:true,description:'欣赏魔术师和神灯精灵带来的演出，把真人表演、3D 影像与剧场效果结合在一起。',fit:'喜欢喜剧和舞台效果、想坐下休息的游客。',caution:'主要使用日语，有 3D 影像、黑暗与音效。',tip:'按剧场一场一场入场，排队时间不能只靠队伍长短判断。',closures:[['2026-12-08','2026-12-22']]},
    {id:237,no:'100',name:'小胖的飞鱼云霄飞车',short:'飞鱼过山车',en:"Flounder's Flying Fish Coaster",aliases:'Flounder 小胖 飞鱼 过山车',area:'mermaid',x:1910,y:928,kind:'小型过山车 · 户外',intensity:2,height:90,duration:'约 1 分钟',description:'乘坐飞鱼造型的小型过山车，在美人鱼礁湖的户外轨道上穿行。',fit:'想尝试较短过山车、身高达到要求的游客。',caution:'身高须满 90 cm，仍有速度感、转弯和起伏。',tip:'体量较小也不代表完全不刺激，先观察运行再决定。'},
    {id:238,no:'99',name:'史卡托的寄居蟹',short:'寄居蟹',en:"Scuttle's Scooters",aliases:'Scuttle 寄居蟹 海鸥',area:'mermaid',x:1907,y:1060,kind:'旋转小车 · 户外',intensity:1,height:0,duration:'约 1.5 分钟',description:'坐在寄居蟹造型的载具上，围绕海鸥史卡托转圈、改变朝向。',fit:'喜欢小型旋转设施的游客。',caution:'车辆有旋转；需符合独立坐稳等要求。',tip:'这是美人鱼礁湖的户外项目，和室内海底王国不是同一层空间。'},
    // Indoor experiences share one building-entrance pin on the main map.
    {id:202,no:'97',name:'爱丽儿游乐场',short:'爱丽儿游乐场',en:"Ariel's Playground",aliases:'Ariel 爱丽儿 小美人鱼 游乐场',area:'mermaid',x:1810,y:1015,kind:'室内探索 · 游乐空间',intensity:1,height:0,duration:'自由探索',indoor:true,description:'在爱丽儿和伙伴们的海底世界里，自由探索洞穴、宝藏与不同游乐空间。',fit:'喜欢自主探索、想从乘骑项目中休息一下的家庭。',caution:'部分区域黑暗、有音效或令人紧张的角色；各区域规则不同。',tip:'位于川顿王海底王国室内，地图在美人鱼礁湖的建筑入口附近统一标注。'},
    {id:239,no:'98',name:'跳跃水母',short:'跳跃水母',en:"Jumpin' Jellyfish",aliases:'Jellyfish 水母',area:'mermaid',x:1810,y:1015,kind:'缓慢升降 · 室内',intensity:1,height:0,duration:'约 1 分钟',indoor:true,description:'坐在贝壳中，随着水母主题设施缓缓上升、下降，看看室内海底王国。',fit:'喜欢轻缓升降、可独立坐稳的游客。',caution:'虽无最低身高，仍需独立保持稳定坐姿，儿童陪同依官方规定。',tip:'它不是惊魂古塔那种自由落体，但怕高的孩子仍可能不适。'},
    {id:240,no:'101',name:'河豚气球竞赛',short:'河豚气球',en:'Blowfish Balloon Race',aliases:'Blowfish 河豚 气球',area:'mermaid',x:1810,y:1015,kind:'旋转升降 · 室内',intensity:1,height:0,duration:'约 1.5 分钟',indoor:true,description:'坐进贝壳吊篮，跟着河豚气球升到空中，围绕中心旋转。',fit:'喜欢旋转设施、想体验室内项目的游客。',caution:'有旋转和高度变化，不适合对旋转很敏感的人。',tip:'同在室内海底王国，可与水母、爱丽儿游乐场一起了解。'},
    {id:241,no:'103',name:'旋转海藻杯',short:'海藻杯',en:'The Whirlpool',aliases:'Whirlpool 咖啡杯 海藻杯',area:'mermaid',x:1810,y:1015,kind:'旋转杯 · 室内',intensity:2,height:0,duration:null,indoor:true,description:'坐入海藻杯，在漩涡般的轨道上旋转，感受类似旋转茶杯的乐趣。',fit:'喜欢转圈、对晕动不敏感的游客。',caution:'旋转感较明显，刺激程度为本导览的主观提示。',tip:'吃饭后不必立刻玩旋转类项目，可以先安排散步或温和的乘船体验。'},
    {id:221,no:'102',name:'美人鱼礁湖剧场',short:'美人鱼剧场',en:'Mermaid Lagoon Theater',aliases:'Mermaid Theater 小美人鱼 剧场',area:'mermaid',x:1810,y:1015,kind:'室内剧场',intensity:1,height:0,duration:null,indoor:true,description:'位于川顿王海底王国的剧场设施。保留位置，方便理解园区地图。',fit:'了解园区布局的游客。',caution:'官方目前列为暂停运营，恢复日期待定。',tip:'不要把它排进必玩行程；这里的停运不代表整个美人鱼礁湖关闭。',closures:[['2020-07-01',null]]}
  ]
};

window.DISNEY_DATA.attractions.forEach(item => {
  item.image = `assets/attractions/${item.id}.jpg`;
  item.url = `https://www.tokyodisneyresort.jp/en/tds/attraction/detail/${item.id}/`;
  item.closures ||= [];
});

// One-sentence descriptions keep the map focused on what each experience actually does.
{
  const simple = {
    255:['乘船看故事','坐船穿过《冰雪奇缘》的故事场景，听经典歌曲，途中有倒退和滑落。'],
    219:['模拟飞行','坐上悬空座椅，对着巨幕“飞”过世界各地，配合风和气味营造飞行感。'],
    256:['乘船看天灯','坐小船进入《魔发奇缘》的故事，最后欣赏满天灯火的浪漫场景。'],
    257:['3D 动感冒险','戴 3D 眼镜坐上会摇晃、转向的小船，跟小飞侠飞进梦幻岛冒险。'],
    223:['高速探险车','坐车进入火山内部看地底奇景，最后突然加速，冲出火山。'],
    218:['互动射击','坐小车、戴 3D 眼镜，用发射器打靶得分，可以和同行的人比比分。'],
    243:['跳楼机','坐在电梯里，体验突然上升和下坠，是带故事场景的跳楼机。'],
    222:['颠簸探险车','坐会颠簸、急转的越野车穿过遗迹，沿途遇到机关和惊险场景。'],
    242:['翻转过山车','在古代遗迹中高速穿行，中途会来一次 360° 翻转。'],
    235:['乘船听音乐','坐船跟辛巴达和小老虎去冒险，一路看人偶、听音乐，节奏比较轻松。'],
    224:['潜艇探险','坐进潜水艇造型的小车，透过舷窗看海底布景和神秘生物。'],
    230:['观光游船','乘船夫划的贡多拉，慢慢游过运河，欣赏意大利风格的建筑。'],
    258:['旋转小车','坐小车穿过仙子花园，帮奇妙仙子送包裹，小车会转圈。'],
    247:['动感影院','坐在会晃动的座椅上，跟着银幕里的尼莫和多莉去海底冒险。'],
    244:['自由探索','走进要塞和帆船，自己探索楼梯、房间与航海主题的互动装置。'],
    245:['日文解谜','在要塞里拿着日文任务地图找线索，完成达芬奇主题的解谜任务。'],
    246:['日语互动','在剧场里和银幕上的海龟用日语聊天互动。'],
    233:['复古汽车','坐古董汽车慢慢逛美国海滨，沿途看街景。'],
    232:['高架小火车','乘复古高架小火车，从美国海滨去发现港。'],
    231:['高架小火车','乘复古高架小火车，从发现港返回美国海滨。'],
    227:['跨区游船','从地中海港湾登船，沿水道去失落河三角洲。'],
    228:['环游观光船','从美国海滨登船，坐着环游园区水道、看海港风景。'],
    229:['跨区游船','从失落河三角洲登船，沿水道往地中海港湾方向走。'],
    236:['旋转木马','在双层宫殿里，骑着骆驼、神灯精灵等造型的旋转木马转圈。'],
    220:['旋转飞毯','坐飞毯绕圈飞行，可以控制升降和前后倾斜。'],
    226:['3D 魔术剧场','坐着看真人魔术与神灯精灵的 3D 表演，主要对白是日语。'],
    237:['小型过山车','坐飞鱼造型的小过山车，在短轨道上转弯、上下起伏。'],
    238:['旋转小车','坐寄居蟹造型的小车绕圈，小车还会转向。'],
    202:['室内游乐场','在小美人鱼的室内世界自由走动，探索洞穴和游乐空间。'],
    239:['缓慢升降','坐在水母下的贝壳座椅里，缓缓升高、再降下来。'],
    240:['旋转吊篮','坐在河豚气球下的吊篮里，升到半空后绕圈旋转。'],
    241:['旋转茶杯','坐进海藻造型的杯子里转圈，玩法类似旋转茶杯。'],
    221:['室内剧场','小美人鱼主题剧场，目前暂停运营。']
  };
  window.DISNEY_DATA.attractions.forEach(item => {
    [item.playType,item.oneLine] = simple[item.id];
  });
  window.DISNEY_DATA.excluded = [{id:246,name:'龟龟漫谈',reason:'主要是日语聊天互动，按当前出游偏好隐藏。'},{id:257,name:'小飞侠梦幻岛历险记',reason:'按你的要求隐藏小飞侠项目。'}];
  window.DISNEY_DATA.excludedAttractions = window.DISNEY_DATA.attractions.filter(item => window.DISNEY_DATA.excluded.some(excluded => excluded.id === item.id));
  window.DISNEY_DATA.attractions = window.DISNEY_DATA.attractions.filter(item => !window.DISNEY_DATA.excluded.some(excluded => excluded.id === item.id));
  window.DISNEY_DATA.hours = {
    month:'2026-11', open:'09:00', close:'21:00',
    exceptions:{'2026-11-27':{open:'09:00',close:'18:30'}},
    checked:'2026-11-01'
  };
  const boundaries = {
    harbor:'M1200 1280 1350 1150 1450 1180 1480 1220 1550 1290 1800 1255 1960 1380 1950 1580 2070 1880 1900 2000 1710 2080 1450 2090 1300 2000 1170 1760 1220 1580 1130 1450 1140 1360Z',
    american:'M1010 1000 1160 1040 1240 1110 1200 1280 1140 1360 1130 1450 1220 1580 1170 1760 1300 2000 1130 2020 980 1880 820 1830 730 1680 660 1490 680 1340 800 1200 900 1090Z',
    port:'M1150 780 1260 690 1430 690 1560 745 1510 850 1560 970 1460 1030 1350 1020 1240 1110 1160 1040 1010 1000 1060 880Z',
    delta:'M1560 745 1660 660 1740 585 1870 540 2020 565 2180 645 2220 760 2190 850 2070 910 1950 895 1840 915 1720 860 1600 900 1510 850Z',
    fantasy:'M2220 760 2270 660 2300 520 2380 410 2440 285 2520 280 2610 330 2730 315 2850 325 2920 400 2900 530 2790 600 2730 690 2590 730 2450 760Z',
    arabian:'M2190 850 2290 770 2380 805 2370 935 2300 1040 2250 1130 2180 1220 2070 1230 1995 1170 2030 1060 2070 990 2070 910Z',
    mermaid:'M1840 915 1950 895 2070 910 2070 990 2030 1060 1995 1170 1870 1170 1740 1090 1710 1010 1750 945Z',
    mysterious:'M1460 1030 1600 900 1720 860 1840 915 1750 945 1710 1010 1740 1090 1870 1170 1800 1255 1550 1290 1480 1220 1450 1180 1350 1150 1320 1100Z'
  };
  window.DISNEY_DATA.areas.forEach(area => { area.boundary = boundaries[area.id]; });
  window.DISNEY_DATA.shows = [
    {id:20001,no:'日',type:'show',name:'白天花船 · 25 周年水上迎宾',short:'白天花船',en:'Sparkling Jubilee Celebration',aliases:'花船 花车 巡游 游行 水上迎宾 周年',area:'harbor',x:1320,y:1460,playType:'花船迎宾',oneLine:'米奇和朋友们乘装饰花船在海港亮相，岸边一起看人物、听音乐、庆祝 25 周年。',durationMinutes:15,intensity:1,recommended:true,image:'assets/shows/day.jpg',url:'https://www.tokyodisneyresort.jp/en/tds/show/detail/7404/',scheduleUrl:'https://www.tokyodisneyresort.jp/en/tds/show/schedule/7404/',closures:[['2027-04-01',null]]},
    {id:20002,no:'夜',type:'show',name:'Believe! 夜间水上秀',short:'夜间水上秀',en:'Believe! Sea of Dreams',aliases:'Believe 夜秀 水上秀 花船 花车 巡游 烟火 灯光',area:'harbor',x:1565,y:1540,playType:'花船灯光秀',oneLine:'在海港岸边欣赏大型花船、音乐、灯光、投影与烟火效果组成的夜间演出。',durationMinutes:30,intensity:1,dpa:2500,recommended:true,image:'assets/shows/night.jpg',url:'https://www.tokyodisneyresort.jp/en/tds/show/detail/967/',scheduleUrl:'https://www.tokyodisneyresort.jp/en/tds/show/schedule/967/',closures:[['2026-11-27','2026-11-27'],['2027-01-06','2027-02-05'],['2027-02-19','2027-02-19'],['2027-03-05','2027-03-05'],['2027-04-23','2027-04-23']]}
  ];
  window.DISNEY_DATA.showSchedule = {};
  for(let day=1;day<=30;day++) {
    const date=`2026-11-${String(day).padStart(2,'0')}`;
    window.DISNEY_DATA.showSchedule[date]={
      20001:day<=9?['11:30','14:00','16:00']:day===10?['11:15','14:45']:['10:30','14:00'],
      20002:day===27?[]:[day<=8?'19:15':'19:30']
    };
  }
  window.DISNEY_DATA.coreIds=[219,223,222,242,243];
  window.DISNEY_DATA.planningWindow={start:'2027-02-01',end:'2027-02-06',reference:'2027-02-06',version:'2027-02-01-to-06'};
  window.DISNEY_DATA.parkCalendars={
    '2026-11':{days:30,open:'09:00',close:'21:00',exceptions:{'2026-11-27':{open:'09:00',close:'18:30'}},url:'https://www.tokyodisneyresort.jp/en/tds/monthly/calendar/202611/'},
    '2027-02':{days:28,open:'09:00',close:'21:00',exceptions:{'2027-02-05':{open:'09:00',close:'18:30'},'2027-02-19':{open:'09:00',close:'18:30'}},url:'https://www.tokyodisneyresort.jp/en/tds/monthly/calendar/202702/'}
  };
  window.DISNEY_DATA.dpaShows=[
    {name:'Believe! 夜间水上秀',price:2500},
    {name:'Dance the Globe!',price:2500},
    {name:'Dreams Take Flight',price:2500}
  ];
  window.DISNEY_DATA.dining=[
    {id:30001,type:'restaurant',name:'尚比尼兄弟餐厅',short:'尚比尼兄弟餐厅',en:"Zambini Brothers' Ristorante",meal:'餐厅',area:'harbor',x:1638,y:1404,oneLine:'地中海港湾的意式简餐店。',image:'assets/dining/lunch.jpg',url:'https://www.tokyodisneyresort.jp/en/tds/restaurant/detail/403/',closures:[]},
    {id:30002,type:'restaurant',name:'纽约美味房',short:'纽约美味房',en:'New York Deli',meal:'餐厅',area:'american',x:1158,y:1545,oneLine:'美国海滨的三明治简餐店。',image:'assets/dining/dinner.jpg',url:'https://www.tokyodisneyresort.jp/en/tds/restaurant/detail/422/',closures:[]}
  ];
}

window.DISNEY_DATA.indoorArea = {
  id:40001,type:'group',name:'美人鱼礁湖 · 室内区',short:'美人鱼礁湖 · 室内区',en:"Triton's Kingdom",area:'mermaid',x:1810,y:1015,
  oneLine:'在《小美人鱼》的海底世界里，选择想玩的室内项目。',
  image:'assets/attractions/202.jpg',imageAlt:'美人鱼礁湖室内的游乐空间',
  url:window.DISNEY_DATA.sources.attractions,closures:[],items:[202,239,240,241,221]
};

{
 const officialNames={"230": "威尼斯贡多拉游船", "219": "翱翔：梦幻奇航", "227": "迪士尼海洋渡轮航线（地中海港湾）", "244": "要塞探险", "245": "要塞探险“挑战李奥纳多”", "246": "龟龟漫谈", "243": "惊魂古塔", "232": "迪士尼海洋电气化铁路（美国海滨）", "228": "迪士尼海洋渡轮航线（美国海滨）", "218": "玩具总动员疯狂游戏屋", "233": "大都会交通工具", "231": "迪士尼海洋电气化铁路（发现港）", "247": "海底巡游艇：尼莫和好友的海洋世界", "222": "印第安纳琼斯冒险旅程：水晶骷髅头魔宫", "229": "迪士尼海洋渡轮航线（失落河三角洲）", "242": "忿怒双神", "255": "安娜与艾莎的冰雪之旅", "257": "小飞侠梦幻岛历险记", "258": "奇妙仙子妙妙小车", "256": "乐佩公主天灯盛会", "236": "沙漠商队旋转木马", "220": "茉莉公主的飞天魔毯", "235": "辛巴达传奇之旅", "226": "神灯剧场", "202": "爱丽儿游乐场", "239": "跳跃水母", "238": "史卡托的寄居蟹", "237": "小胖的飞鱼云霄飞车", "240": "河豚气球竞赛", "221": "美人鱼礁湖剧场", "241": "旋转海藻杯", "224": "海底两万里", "223": "地心探险之旅"};
 const shortNames={"222": "印第安纳琼斯", "247": "海底巡游艇", "245": "挑战李奥纳多", "232": "电气化铁路（美国海滨）", "231": "电气化铁路（发现港）", "227": "渡轮航线（地中海港湾）", "228": "渡轮航线（美国海滨）", "229": "渡轮航线（失落河三角洲）"};
 window.DISNEY_DATA.attractions.forEach(item=>{item.aliases+=' '+item.name+' '+item.short;item.name=officialNames[item.id]||item.name;item.short=shortNames[item.id]||item.name;item.url=`https://www.tokyodisneyresort.jp/sc/tds/attraction/detail/${item.id}/`;});
 const day=window.DISNEY_DATA.shows.find(item=>item.id===20001);day.name='闪耀欢腾庆典';day.short=day.name;day.aliases+=' 白天花船 25周年水上迎宾';day.url='https://www.tokyodisneyresort.jp/sc/tds/show/detail/7404/';
 const night=window.DISNEY_DATA.shows.find(item=>item.id===20002);night.name='坚信！～梦想之海～';night.short=night.name;night.aliases+=' Believe 夜间水上秀';night.url='https://www.tokyodisneyresort.jp/sc/tds/show/detail/967/';
 window.DISNEY_DATA.dpaShows=[{name:'坚信！～梦想之海～',en:'Believe! Sea of Dreams',price:2500},{name:'舞动全球！',en:'Dance the Globe!',price:2500},{name:'梦想起飞',en:'Dreams Take Flight',price:2500}];
 window.DISNEY_DATA.dining.push(
  {id:30003,type:'restaurant',snack:true,name:'烟熏火鸡腿',short:'火鸡腿',en:'Smoked Turkey Leg',meal:'小吃',venue:'充电小站',price:1200,area:'harbor',x:1458,y:1204,oneLine:'在要塞探险附近的小吃店“充电小站”（Refrescos）购买。',image:'assets/dining/turkey.jpg',url:'https://www.tokyodisneyresort.jp/en/food/128/',closures:[]},
  {id:30004,type:'restaurant',snack:true,name:'辣味熏鸡腿',short:'鸡腿',en:'Spicy Smoked Chicken Leg',meal:'小吃',venue:'失落河小厨',price:800,area:'delta',x:2068,y:799,oneLine:'在“失落河小厨”购买，靠近忿怒双神；这是鸡腿，不是火鸡腿。',image:'assets/dining/chicken.jpg',imageAlt:'失落河小厨外观',url:'https://www.tokyodisneyresort.jp/en/tds/restaurant/food/461/',closures:[]}
 );
}

// Plain-language activity descriptions and experience duration; queues are separate.
{
  const D=window.DISNEY_DATA;
  const durations={"218":7,"219":5,"220":1.5,"221":14,"222":3,"223":3,"224":5,"226":23,"227":7,"228":13,"229":6,"230":11.5,"231":2.5,"232":2.5,"233":10,"235":10,"236":2.5,"237":1,"238":1.5,"239":1,"240":1.5,"241":1.5,"242":1.5,"243":2,"246":30,"247":5,"255":6.5,"256":5,"257":6,"258":2};
  const estimates={"202":[20,30],"244":[20,30],"245":[20,40]};
  const descriptions={
  "202": "在室内游乐场自由走动，探索洞穴、房间和不同的游玩装置。",
  "218": "戴 3D 眼镜坐小车，用发射器打靶计分，可以和同行者比得分。",
  "219": "坐在悬空座椅上看巨幕模拟飞行，座椅配合移动，还会有风和气味。",
  "220": "坐飞毯绕圈飞行，可以操纵载具升降和前后倾斜。",
  "221": "坐在室内剧场看《小美人鱼》主题表演；目前暂停运营。",
  "222": "坐越野探险车穿过遗迹布景，途中会颠簸、急转，并遇到机关和惊吓。",
  "223": "坐探险车看地底洞穴，后半段突然加速，并冲出火山下坡。",
  "224": "坐小型潜水艇看窗外的海底布景，配合灯光和音效模拟下潜探险。",
  "226": "坐在剧场里看真人魔术与神灯精灵的 3D 影像，主要对白是日语。",
  "227": "坐小轮船从地中海港湾前往失落河三角洲，沿途看园区水道。",
  "228": "坐小轮船从美国海滨出发环游园区水道，适合坐着看风景。",
  "229": "坐小轮船从失落河三角洲沿水道返回地中海港湾。",
  "230": "坐船夫撑的贡多拉慢慢游过运河，看两岸建筑和桥下的水道。",
  "231": "坐高架小火车，从发现港返回美国海滨。",
  "232": "坐高架小火车，从美国海滨前往发现港，沿途俯瞰街景。",
  "233": "坐复古汽车在美国海滨的街道上慢慢绕行，主要是观光。",
  "235": "坐船经过一段段人偶和布景，听音乐看辛巴达的故事，节奏比较平缓。",
  "236": "在双层旋转木马上，骑骆驼、神灯精灵等造型的坐骑绕圈。",
  "237": "坐飞鱼造型的小过山车，经过短轨道上的转弯、起伏和下坡。",
  "238": "坐寄居蟹造型的小车绕圈，车身还会转向，有时倒着走。",
  "239": "坐在水母下的贝壳座椅里，缓缓升高，再降下来。",
  "240": "坐在河豚气球下的吊篮里，升到半空后绕圈旋转。",
  "241": "坐进海藻造型的杯子里连续转圈，玩法类似旋转咖啡杯。",
  "242": "坐高速过山车经过急弯和起伏，中途有一次 360° 倒转。",
  "243": "坐在电梯里随剧情突然升起和下坠，有明显失重、黑暗和惊吓。",
  "244": "自己步行探索海边要塞和帆船，爬楼梯、看房间和航海互动装置。",
  "245": "拿日文任务地图，在要塞里找线索、做解谜任务，需要看懂日文说明。",
  "246": "隔着屏幕和海龟 Crush 用日语聊天，角色会现场回答观众。",
  "247": "坐在会摇晃的座椅上看尼莫和多莉的海底影片，座椅动作跟着画面走。",
  "255": "坐船经过《冰雪奇缘》的故事场景，听歌曲，途中有倒退和滑落。",
  "256": "坐船看《魔发奇缘》的故事，最后进入布满天灯的室内场景。",
  "257": "戴 3D 眼镜坐会摇晃、转向的小船，跟着小飞侠的故事在画面中飞行。",
  "258": "坐小车穿过仙子花园，沿途看场景，小车会旋转和转向。"
};
  for(const item of [...D.attractions,...D.excludedAttractions]){
    item.oneLine=descriptions[item.id];
    if(durations[item.id]!=null){const minutes=durations[item.id],whole=Math.floor(minutes),seconds=Math.round((minutes-whole)*60);item.durationMinutes=minutes;item.durationIsEstimate=false;item.durationLabel=seconds?`约 ${whole} 分 ${seconds} 秒`:`约 ${whole} 分钟`;}
    else {const range=estimates[item.id];item.durationIsEstimate=true;item.durationLabel=`建议 ${range[0]}–${range[1]} 分钟`;}
  }
}
// Dining service and closure facts checked against official venue pages on 2026-11-03.
{
  const D=window.DISNEY_DATA;
  const venue=(id,officialId,name,en,area,x,y,service,oneLine,options={})=>({id,officialId,type:'restaurant',name,short:name,en,area,x,y,service,oneLine,meal:'餐厅',url:`https://www.tokyodisneyresort.jp/sc/tds/restaurant/detail/${officialId}/`,closures:[],checked:'2026-11-03',...options});
  D.dining.forEach(item=>Object.assign(item,{service:item.snack?'snack':'counter',mobileOrder:!item.snack,checked:'2026-11-03'}));
  D.dining.push(
    venue(30412,412,'麦哲伦',"Magellan's",'harbor',1422,1243,'seating','海边要塞里的正式西式餐厅。'),
    venue(30408,408,'卡纳雷托餐馆','Ristorante di Canaletto','harbor',1221,1584,'seating','运河边的意式餐馆，提供披萨和意大利面。'),
    venue(30425,425,'S.S.哥伦比亚餐厅','S.S. Columbia Dining Room','american',716,1343,'seating','位于 S.S.哥伦比亚号大轮船内的西式餐厅。'),
    venue(30429,429,'泰迪罗斯福欢饮厅','The Teddy Roosevelt Lounge','american',745,1361,'seating','大轮船里的休息酒廊，提供餐点和饮品。'),
    venue(30432,432,'樱花餐厅','Restaurant Sakura','american',1075,1395,'seating','美国海滨的日式餐厅。',{closures:[['2027-01-06','2027-06-30']]}),
    venue(30451,451,'水平线海湾餐厅','Horizon Bay Restaurant','port',1433,966,'seating','发现港的西式餐厅。'),
    venue(30409,409,'阿伦黛尔皇家宴会厅','Royal Banquet of Arendelle','fantasy',2678,482,'mobile-required','《冰雪奇缘》城堡里的主题餐厅。',{mobileOrder:true}),
    venue(30413,413,'可爱小鸭餐厅','The Snuggly Duckling','fantasy',2618,576,'mobile-required','《魔发奇缘》主题的汉堡餐厅。',{mobileOrder:true,aliases:'丑小鸭 长发公主餐厅'}),
    venue(30414,414,'瞭望台野餐','Lookout Cookout','fantasy',2434,435,'mobile-required','梦幻岛主题的轻食餐厅。',{mobileOrder:true}),
    venue(30446,446,'鳕鱼岬锦标美食','Cape Cod Cook-Off','american',1159,1157,'counter','鳕鱼岬的汉堡简餐店；此处指普通用餐区，演出用餐区须另外预约。',{mobileOrder:true,showDiningUrl:'https://www.tokyodisneyresort.jp/en/tds/restaurant/detail/447/'}),
    venue(30456,456,'米格勒黄金国快餐中心',"Miguel's El Dorado Cantina",'delta',1743,870,'counter','失落河三角洲的柜台简餐店。',{mobileOrder:true,closures:[['2026-11-03','2026-11-12']]}),
    venue(30459,459,'犹加敦基地营烧烤','Yucatan Base Camp Grill','delta',2020,795,'counter','失落河三角洲遗迹旁的烧烤简餐店。',{mobileOrder:true}),
    venue(30463,463,'凯兹堡餐饮广场','Casbah Food Court','arabian',2178,1114,'counter','阿拉伯海岸的咖喱简餐店。',{mobileOrder:true,aliases:'卡斯巴 咖喱'}),
    venue(30468,468,'赛巴斯丁加力骚厨房',"Sebastian's Calypso Kitchen",'mermaid',1865,1010,'counter','美人鱼礁湖室内的简餐店。',{mobileOrder:true,mapLocationNote:'位于室内区；地图标在建筑入口附近，非室内精确位置。'}),
    venue(30418,418,'火山餐厅','Vulcania Restaurant','mysterious',1702,1166,'counter','神秘岛洞穴里的中式餐厅。'),
    venue(30410,410,'奥肯好食',"Oaken's OK Foods",'fantasy',2642,489,'snack','梦幻泉乡的路边小吃店，供应手拿餐点。',{mobileOrder:true,snack:true}),
    venue(30465,465,'芝麻开门','Open Sesame','arabian',2195,959,'snack','阿拉伯海岸卖吉拿棒的小铺。',{snack:true}),
    venue(30450,450,'海边小吃','Seaside Snacks','port',1163,981,'snack','发现港的路边小吃铺。',{snack:true}),
    venue(30421,421,'鹦鹉螺号小厨','Nautilus Galley','mysterious',1600,1148,'counter','神秘岛水边的小吃店，供应手拿餐点。',{mobileOrder:true})
  );
  D.dining.forEach(item=>{item.stall=Boolean(item.snack||item.officialId===421);item.aliases=item.aliases||'';item.playType=item.service==='seating'?'可预约座位':'无需预约';});
  D.sources.restaurantBooking='https://reserve.tokyodisneyresort.jp/en/restaurant/search/';
  // Past schedule snapshot saved during the 2026-11-01 official-source check.
  // Rechecked against the currently published 2026-11-03 schedule; never used by the planner.
  D.showReferences=Object.fromEntries(D.shows.map(item=>[item.id,{date:'2026-11-01',times:[...D.showSchedule['2026-11-01'][item.id]],sourceUrl:item.scheduleUrl,checked:'2026-11-01',corroboratedDate:'2026-11-03'}]));
  D.serviceChecked='2026-11-03';
}
