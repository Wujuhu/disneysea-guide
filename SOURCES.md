# 一、资料与素材来源

所有事实核对日期：2026-11-01。以下均为东京迪士尼度假区官方资料；项目逐条来源保存在 `research/sources.json`。

2026-11-02 补核：[迪士尼尊享卡官方规则](https://www.tokyodisneyresort.jp/sc/tdr/guide/app_service/disneypremieraccess.html)中的再次购买资格、同行人员选票、当前价格与取消限制。时间表中的购买时点和目标体验时间是本项目为两位成人编排的示例，不是官方放票时刻或已取得的预约。

同日逐项核对 30 个固定乘骑／剧场体验时长，记录于 `research/experience-facts.json`；3 个自由探索类项目使用明确标注的导览建议停留范围。中文玩法为本项目重新概括，不沿用营销形容。

[2027 年 2 月 6 日官方日历](https://www.tokyodisneyresort.jp/en/tds/daily/calendar/20270206/)仍显示演出场次未确定；[花船月度安排](https://www.tokyodisneyresort.jp/en/tds/show/schedule/7404/)与[夜秀月度安排](https://www.tokyodisneyresort.jp/en/tds/show/schedule/967/)目前公布十一月场次，并说明下月安排通常在前月 8 日左右发布。

地图朝向依据同一份官方 PDF 底图中的指北针校准：蓝色北针朝原图右下约 15°，因此渲染时逆时针约 105°，使北朝上、东朝右。原始图片与原始点位数据保留，变换在代码中完成；网页项目文字保持正向，底图自带的小字随图片旋转。

英文原名沿用现有官方英文项目资料；室内汇总入口采用 Triton's Kingdom，该称呼可见[官方室内餐厅介绍](https://www.tokyodisneyresort.jp/en/tds/restaurant/detail/468/)。绿色外圈依据当前日期的 DPA 适用字段和官方停运区间，不查询或推断实时库存；未公布的演出时刻不参与隐藏判断。

## 1. 地图与项目

- [官方园区地图](https://www.tokyodisneyresort.jp/en/tds/map.html)
- [简体中文园区地图 PDF](https://media2.tokyodisneyresort.jp/home/download/map/TDS_map_sc.pdf)
- [官方项目目录与停运计划](https://www.tokyodisneyresort.jp/en/tds/attraction.html)
- [冰雪奇缘项目](https://www.tokyodisneyresort.jp/en/tds/attraction/detail/255/)
- [Soaring 项目](https://www.tokyodisneyresort.jp/en/tds/attraction/detail/219/)
- [Aquatopia 已于 2026-09-14 结束运营的官方活动说明](https://www.tokyodisneyresort.jp/en/topics/event/summer2026/tds.html)

原始官方 PDF 缓存在 `research/official-map.pdf`，完整嵌入图像在 `research/Im0.jpg`。交付的 `assets/official-map.jpg` 与原始嵌入图像同源，网页内只做视窗裁切与交互覆盖，未用 AI 重绘地形。点位人工对应官方图像编号；达芬奇挑战的 4B 为本导览附加编号。

## 2. DPA 与 App

- [迪士尼尊享卡：适用项目、价格及规则](https://www.tokyodisneyresort.jp/en/tdr/guide/app_service/disneypremieraccess.html)
- [官方 App 各服务区别及免费优先通行证结束日期](https://faq-en.tokyodisneyresort.jp/answer/680ba05101fdf7431bafb6b0/)
- [DPA 购买问答](https://faq-en.tokyodisneyresort.jp/answer/680ba05101fdf7431bafb6b8/)
- [官方 App](https://www.tokyodisneyresort.jp/en/tdr/guide/app.html)

核对时冰雪奇缘与 Soaring 的 DPA 均为每人每次 ¥2,500。忿怒双神已列入 DPA，印第安纳琼斯从 2026-11-30 起适用。免费 40 周年优先通行证已于 2026-08-31 结束。这些事实不能沿用更早的攻略代替。

## 3. 用餐

- [Disney Mobile Order：操作流程及适用餐厅](https://www.tokyodisneyresort.jp/en/tdr/guide/app_service/mobileorder.html)
- [Priority Seating：预约规则及餐厅目录](https://www.tokyodisneyresort.jp/en/tdr/guide/app_service/priorityseating.html)
- [Royal Banquet of Arendelle](https://www.tokyodisneyresort.jp/en/tds/restaurant/detail/409/)
- [The Snuggly Duckling](https://www.tokyodisneyresort.jp/en/tds/restaurant/detail/413/)

核对时以上两家梦幻泉乡餐厅明确要求通过移动点餐下单。到店后点击 I'm Here 才开始处理付款与备餐。移动点餐不预留餐桌；优先入座是另一种服务，仍可能等待空桌。页面列举的其他餐厅可从官方移动点餐目录继续查看。

## 4. 图片与字体

园区地图与项目照片来自官方公开页面，版权属于 Disney、Disney/Pixar 及相关权利人。此项目是本地使用的非官方导览，引用和存储不代表取得图片的再许可；未来公开发布前应确认相应素材使用条件。网页已保留版权署名和官方来源入口，交付 JPEG 与 WebP 均嵌入了来源元数据。

字体为 [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC)，通过 Google Fonts 获取后按页面字符制作 WOFF2 子集。SIL Open Font License 1.1 原文保存在 `assets/FONT-LICENSE.txt`。SVG 图标与站点标识为本项目的简洁几何图形。

## 5. 2027 年 2 月窗口与水上演出

- [二月营业日历](https://www.tokyodisneyresort.jp/en/tds/monthly/calendar/202702/)：5 日、19 日 18:30 闭园，其余已列日期 09:00–21:00。
- [2 月 1 日安排](https://www.tokyodisneyresort.jp/en/tds/daily/calendar/20270201/)：演出场次尚未确定，Believe! 列入停演。
- [2 月 6 日安排](https://www.tokyodisneyresort.jp/en/tds/daily/calendar/20270206/)：未列演出停演，但场次尚未确定，不能据此承诺具体演出。
- [地心探险](https://www.tokyodisneyresort.jp/en/tds/attraction/detail/223/)：2027-01-08 至 2027-03-08 检修。
- [海底两万里](https://www.tokyodisneyresort.jp/en/tds/attraction/detail/224/)：约 5 分钟，作为就近替代。
- [白天花船介绍](https://www.tokyodisneyresort.jp/en/tds/show/detail/7404/)：Sparkling Jubilee Celebration，约 15 分钟，活动期至 2027-03-31。
- [白天花船场次](https://www.tokyodisneyresort.jp/en/tds/show/schedule/7404/)：已收录 2026 年 11 月表，未臆造二月场次。
- [Believe! 介绍与停演](https://www.tokyodisneyresort.jp/en/tds/show/detail/967/)：约 30 分钟，停演包括 2027-01-06 至 02-04 及 02-05。
- [Believe! 场次](https://www.tokyodisneyresort.jp/en/tds/show/schedule/967/)：已收录 2026 年 11 月表，二月显示待公布。

官方说明月度场次通常在前一个月 8 日左右公布。二月出行需在 2027 年 1 月上旬复核。

演出照片来自官方 CDN：day.jpg 对应 show/2748_main_visual_name_1.jpg，night.jpg 对应 show/2067_main_visual_name_1.jpg，均已嵌入来源元数据。

planner.js 的排队、步行与机动时长是编辑预算，只有实际体验时长和已公布场次来自官方；界面及导出保留此区分。

## 6. 可选用餐点（不接入路线）

- [尚比尼兄弟餐厅](https://www.tokyodisneyresort.jp/en/tds/restaurant/detail/403/)：地中海港湾，支持移动点餐，为海港附近的可选简餐。
- [纽约美味房](https://www.tokyodisneyresort.jp/en/tds/restaurant/detail/422/)：美国海滨，支持移动点餐，为美国海滨的可选简餐。

位置对应官方中文地图中的 21、47 号设施；这些官方编号仅用于数据核对，不作为地图交互标记显示。照片分别来自官方 CDN 的 restaurant/572_main_visual_name_1.jpg、restaurant/642_main_visual_name_1.jpg，并嵌入了来源。营业和可取餐时段以当天 App 为准，不沿用园区开闭园时间推断餐厅营业。

## 7. 官方中文名称、小吃与 UI 组件

- [官方简体中文项目目录](https://www.tokyodisneyresort.jp/sc/tds/attraction/detail/219/)：页尾列出完整项目名称，映射保存在 research/official-names.json。修正“挑战李奥纳多”等正式名称；常见旧称仅保留作搜索别名。
- [烟熏火鸡腿官方菜单](https://www.tokyodisneyresort.jp/en/food/128/)：参考价 ¥1,200，在地中海港湾的充电小站（Refrescos）售卖。
- [失落河小厨官方菜单](https://www.tokyodisneyresort.jp/en/tds/restaurant/food/461/)：辣味熏鸡腿参考价 ¥800，与火鸡腿区分。餐厅外观图的替代文字明确为场馆外观。
- [Bootstrap 5.3 官方文档](https://getbootstrap.com/docs/5.3/getting-started/introduction/)：本地保存 5.3.8 CSS 和 JS，已按官方 SHA-384 校验；许可位于 assets/vendor/bootstrap/LICENSE。
- [Bootstrap Icons 星标](https://icons.getbootstrap.com/icons/star-fill/)：本地 SVG 与许可保存在 assets/vendor/bootstrap-icons/。

清晨等待和 DPA 购买时机是规划策略，不是官方客流保证。普通排队预算与实际库存分开表达，不把“10 点多再评估”写成库存保证。


## 8. 餐饮分类与 DPA 规则补核（2026-11-03）

- [官方优先入座](https://www.tokyodisneyresort.jp/en/tdr/guide/app_service/priorityseating/)：海洋列有 6 家适用餐厅；提前一个月 10:00，入园当天网上 09:00，门口当日余位 10:00 起。属于建议提前订座，现场有空位时仍可能用餐。
- [官方梦幻泉乡 FAQ](https://faq-en.tokyodisneyresort.jp/answer/6838947bb5f9218ff51a969e/)：阿伦黛尔、可爱小鸭、瞭望台三家须用手机点餐，入园后可以下单。是否有固定座位不能决定要不要预约。
- [官方移动点餐](https://www.tokyodisneyresort.jp/en/tdr/guide/app_service/mobileorder.html)：记录哪些店可选手机点餐；手机点餐不等于优先入座。
- [樱花餐厅](https://www.tokyodisneyresort.jp/en/tds/restaurant/detail/432/)：2027-01-06 至 06-30 停运；[米格勒](https://www.tokyodisneyresort.jp/en/tds/restaurant/detail/456/)：2026-11-03 至 11-12 停运。
- 23 个餐厅／小吃记录及各自官方页面、服务类型、已知停运区间见 research/dining-facts.json。点位对照官方中文图人工标注；赛巴斯丁只标室内区入口附近。新餐厅用统一餐具图标，不复用其他餐厅照片。
- [DPA 入园条件](https://faq-en.tokyodisneyresort.jp/answer/680ba05401fdf7431bafb773/)、[购买与余量](https://faq-en.tokyodisneyresort.jp/answer/680ba05101fdf7431bafb6b8/)、[再次购买与价格](https://www.tokyodisneyresort.jp/en/tdr/guide/app_service/disneypremieraccess.html)：入园后购买、单项选时段、名额有限；另一项目按付款后 60 分钟／本张开始使用时间的较早值；同项目等用完或时段结束；项目和演出分开计算。
- 在核对的官方说明中没有统一每小时全项目一起补票的时刻表；页面不承诺售罄后再放票。规则来源与边界见 research/service-rules.json。

排队、DPA 通道等候、步行与餐饮时长仍是导览预算。环线加入冰雪奇缘后，普通营业日按冰雪奇缘、古塔 DPA 预算，两位成人约 ¥8,000；提前闭园日另加忿怒双神约 ¥3,000。并不表示已买到或保证库存。


## 9. 演出参考与餐饮图标补充（2026-11-03）

演出参考沿用 2026-11-01 核对时保留的官方场次快照：白天花船 11:30／14:00／16:00，Believe! 19:15（日本时间）。当前[白天官方场次](https://www.tokyodisneyresort.jp/en/tds/show/schedule/7404/)和[夜秀官方场次](https://www.tokyodisneyresort.jp/en/tds/show/schedule/967/)中的 2026-11-03 行与这些时段一致。记录见 research/show-references.json。旧日历会随日期滚动；界面将其独立标成历史参考，绝不写入未来所选日期场次或规划器。

[官方优先入座规则](https://www.tokyodisneyresort.jp/en/tdr/guide/app_service/priorityseating/)中的 Book Now 指向[官方订座搜索](https://reserve.tokyodisneyresort.jp/en/restaurant/search/)。本导览只提供操作说明与入口，不代为登录或预约。棚顶／餐具是导览的显示分组，订座、移动点餐和现场排队仍由独立 service 字段判断；不会因使用餐具图标就推断必须订座。

本次餐饮界面改为“可预约座位／无需预约”两类，手机点餐和小摊均可属于无需预约。手机点餐步骤再次对照[官方移动点餐说明](https://www.tokyodisneyresort.jp/en/tdr/guide/app_service/mobileorder.html)：使用 Tokyo Disney Resort App（英文版），My Plan → Disney Mobile Order，选择餐厅、来店时段、餐点和数量，Add to Cart 后核对付款方式并点 Place Order；到店后在 App 点 I'm Here，再按号码取餐。界面只保留游客需要操作的步骤，不列餐厅内部处理或现场安排。


## 10. 项目与餐饮图册（2026-11-03）

新增 166 张对应官方图片，覆盖 33 个项目和 23 条餐饮记录，每条 2–4 张。图像与所属项目／店铺逐一对应，来源以各自官方详情相册和店铺菜单链接为准；如[麦哲伦环境](https://www.tokyodisneyresort.jp/en/tds/restaurant/detail/412/)、[麦哲伦餐点](https://www.tokyodisneyresort.jp/en/food/3688/)、[阿伦黛尔环境](https://www.tokyodisneyresort.jp/en/tds/restaurant/detail/409/)及[阿伦黛尔肉丸饭](https://www.tokyodisneyresort.jp/en/food/4446/)。鳕鱼岬与奥肯本轮使用已核对的环境图；其他 21 条餐饮记录另配各店菜单中的餐点示例。S.S.哥伦比亚的季节套餐图片明确标注为 2026 圣诞季，不作为二月菜单承诺。

完整逐图来源、原图 URL、相应菜单页、核对日期、尺寸和文件哈希见 research/gallery-sources.json。额外的电气化铁路（美国海滨）与大都会交通工具照片沿用已核对封面的官方媒体组，下载后逐图核对；无法识别的第三张铁路候选图未收录。全部 166 张新素材已通过图片联系表核对，无跨店或跨项目混用。WebP 只做等比例缩小和压缩，最长边 1280px，合计约 14.9 MB；每张嵌入来源网页、原图 URL、检索日期和权利人说明。图片保留原权利归属，不因收录而获得开放再许可。

详情不自动轮播，用户可前后切换、点击缩略图、使用键盘方向键或在手机上滑动；主图可打开大图，图下注明逐图来源。图片以完整显示为原则，不用裁切填满主图；餐点图只作示例，实际菜品以所选日期的官方菜单为准。原有演出照片继续沿用既有来源。
