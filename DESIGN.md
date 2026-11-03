---
name: "海洋漫游"
description: "东京迪士尼海洋中文地图与一日攻略的现有视觉规范"
colors:
  teal: "#126d68"
  teal-dark: "#10625e"
  teal-light: "#e6f3ef"
  route: "#ac175f"
  gold: "#986b27"
  gold-light: "#fff2d9"
  dpa-label: "#795620"
  hidden-reason: "#865b29"
  dpa-ring: "#20d65a"
  dpa-ring-edge: "#075331"
  core-pin: "#936620"
  show-day: "#b66d13"
  show-night: "#663da1"
  area-harbor: "#a36536"
  area-american: "#b34d57"
  area-port: "#806719"
  area-delta: "#297557"
  area-fantasy: "#466ca2"
  area-arabian: "#80589a"
  area-mermaid: "#b35883"
  area-mysterious: "#147f88"
  ink: "#173c47"
  secondary: "#566f75"
  page: "#f6f8f7"
  white: "#fff"
  line: "#dce5e3"
  muted: "#edf2f0"
  search-surface: "#f3f6f5"
  focus: "#d99833"
typography:
  headline:
    fontFamily: "'Guide Sans', 'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "31px"
    fontWeight: 650
    lineHeight: 1.5
    letterSpacing: ".01em"
  title:
    fontFamily: "'Guide Sans', 'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "21px"
    fontWeight: 650
    lineHeight: 1.45
  body:
    fontFamily: "'Guide Sans', 'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.65
  body-reading:
    fontFamily: "'Guide Sans', 'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.95
  body-detail:
    fontFamily: "'Guide Sans', 'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "'Guide Sans', 'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontFamily: "'Guide Sans', 'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.65
  action:
    fontFamily: "'Guide Sans', 'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    fontWeight: 550
    lineHeight: 1.5
  navigation:
    fontFamily: "'Guide Sans', 'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.65
rounded:
  chip: "6px"
  button: "7px"
  field: "8px"
  diamond: "9px"
  card: "10px"
  panel: "12px"
  base: "14px"
  sheet: "18px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  panel: "22px"
  section: "32px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.white}"
    typography: "{typography.action}"
    rounded: "{rounded.button}"
    padding: "10px 15px"
  button-primary-hover:
    backgroundColor: "{colors.teal-dark}"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.button}"
    padding: "10px 15px"
  button-text:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "7px 0"
  search-field:
    backgroundColor: "{colors.search-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0 11px"
    height: "43px"
  navigation-active:
    textColor: "{colors.teal}"
    typography: "{typography.navigation}"
    padding: "0 8px"
  filter-chip:
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.chip}"
    padding: "5px 10px"
  filter-chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.caption}"
    rounded: "{rounded.chip}"
    padding: "5px 10px"
  dpa-tag:
    backgroundColor: "{colors.gold-light}"
    textColor: "{colors.dpa-label}"
    padding: "2px 4px"
  checklist-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "22px"
  show-marker-day:
    backgroundColor: "{colors.show-day}"
    textColor: "{colors.white}"
    rounded: "{rounded.diamond}"
    width: "17px"
    height: "17px"
  show-marker-night:
    backgroundColor: "{colors.show-night}"
    textColor: "{colors.white}"
    rounded: "{rounded.diamond}"
    width: "17px"
    height: "17px"
  timeline-number:
    backgroundColor: "{colors.route}"
    textColor: "{colors.white}"
    rounded: "{rounded.circle}"
    width: "23px"
    height: "23px"
---

# Design System: 海洋漫游

## Overview

**Creative North Star: "海港游客中心"**

海港游客中心的视觉方向来自既有 surface 约定：白色与浅雾色承托内容，深海色负责阅读，青绿提示操作。界面保持紧凑、平实，地图和真实项目照片承担主要识别工作。

同一套字形、细边框、温和圆角连接地图与攻略；强阴影只用于浮在内容之上的控件和面板。表达服务于查找、理解与安排，不增加宣传式文案。

**Key Characteristics:**

- 清楚的中文层级，英文名作为辅助。
- 颜色、图形和文字共同表达状态。
- 地图点位与清单、详情、时间表相互对应。
- 电脑与手机沿用同一套控件，按空间改变排布。

记录日期：2026-11-01。依据 `index.html`、`styles.css` 的最终覆盖规则、`app.js`、`data.js` 与 `planner.js`，并参照已保存的桌面和手机截图。数值是源码声明，不是新增测量；未渲染的旧样式不纳入组件。产品事实见 `PRODUCT.md`，本页布局约定见 `.impeccable/surface.md`。

## Colors

- **Primary：** 海港青绿用于主要按钮、当前导航、链接和操作提示；深青绿用于主要按钮悬停，浅青绿用于轻量反馈。
- **Secondary：** 路线紫红连接顺序线、连线开关和游玩序号。赭金承载 DPA 信息；白天花船用琥珀，夜间演出用紫色。餐厅使用深海色底的餐具图标。
- **Tertiary：** 八个 `area-*` 色来自数据中的海港映射，连结边界、普通点位和图片上的分区小标签。边界默认用海港色混合透明底（11%），悬停、键盘焦点或选中时加强（24%）；白色描边让分界与复杂底图分开。
- **Neutral：** 深海文字用于主体，次要文字降低辅助信息层级；浅雾页面、白色表面和柔和边线形成底层结构。搜索与图片占位沿用各自浅底。

sidecar 的八阶色条按现有颜色生成，仅供面板预览；它们不是实现中已有的完整色阶。

**The Semantic Color Rule.** 用青绿识别操作，用紫红识别顺序；付费、停运和待公布状态都同时写出文字。

## Typography

全站沿用 frontmatter 中的字体栈。本地 `assets/guide-sans.woff2` 是 Noto Sans SC 子集，以 `Guide Sans` 注册；只提供静态常规字重（400），其余字重由 `font-synthesis: weight` 合成，不是多字重或可变字体。

- **标题：** 攻略首屏使用 headline；手机缩为（24px）。地图标题是紧凑工具栏文字：桌面（20px）、手机（19px）。详情标题使用 title，手机为（22px）。
- **阅读：** 正文使用 body，攻略导语使用 body-reading；项目的一句话玩法使用 body-detail。详情英文名为辅助层级（12px）。
- **控件：** 按钮使用 action，桌面主导航使用 navigation；手机主导航缩为（13px）。辅助标签以 caption 和 label 为主；项目清单名称为（14px）。
- **数字：** 时间、价格、点位与路线编号使用等宽数字特性 `tabular-nums`，不另配等宽字体。

**The One Typeface Rule.** 沿用本地 Guide Sans 与既有后备字体，用字号、字重和间距建立层级，不再加入装饰字体。

## Layout

当前地图页是操作界面，攻略页是顺序阅读界面；二者共享满高侧边导航和组件。间距与圆角尚未完全变量化，frontmatter 记录的是已用重复值，不要求重写现有 CSS。

- **应用外壳：** body 为 100dvh 两列，外层不滚动。侧栏常规宽 148px，大屏 164px，紧凑桌面 124px；地图、时间表、DPA、吃饭纵向切换，选中项用浅青绿底。
- **面板收起：** 导航收起为 48px 图标栏，保留四个页面入口、可访问名称及底部展开按钮。桌面项目列表可独立完全收起，展开按钮始终位于地图栏左端；手机沿用地图／列表切换。
- **电脑地图：** 内容区四周 12px，地图工作区 flex 填满剩余高度，无旧的最小／最大高度限制。项目清单宽 270px，大屏 300px、紧凑桌面 236px；地图栏高 44px，底部只保留来源入口，统一隐藏开关在清单头部。
- **手机地图：** 760px 及以下侧栏宽 56px，图标配短标签，内容边距 8px。地图和清单仍可切换，双按钮在底部独立控制行；地图控制器按实际页脚高度定位，不遮住换行后的图例。区域、类型和搜索只淡化不匹配地图点位，统一“显示隐藏项目”开关实际控制官方停运与用户主动隐藏点位。
- **详情：** 桌面在地图右侧浮出，基础宽度 338px；手机贴底并从侧栏右缘开始，保留侧边导航。内容可滚动，手机最大高度结合可见地图空间动态限制。
- **攻略：** 顶部只留当前内容标题和日期／营业时间，页面切换均在侧栏。正文在独立滚动区填满剩余高度，DPA 和用餐阅读内容最大宽 1020px。
- **时间表：** 主栏是连续的实际活动及起止预算；时间表最大宽 940px；DPA 旁栏常规宽 292px、列距 24px，紧凑桌面 236px／20px；大屏不再加宽列距。连线从活动区间中的操作时点通向旁注；手机将旁注缩进到该活动下方，仍保留连线，不把购票当作主行程中的独立停靠。

断点以 sidecar 的 `extensions.breakpoints` 为索引，最终覆盖关系以 CSS 为准。

## Elevation & Depth

常规项目清单、攻略和价格表主要靠细边框与浅底分组。地图点位、名称、控制器、详情面板和手机切换器使用柔和阴影说明浮层关系。DPA 旁注用浅赭底、细上边线和连线表达并行操作。

**The Overlay Depth Rule.** 普通内容用底色和细边框分层；阴影说明浮层关系，不为每个内容块加阴影。

## Shapes

按钮与输入框采用小圆角，内容容器采用较大的温和圆角；手机详情只在上缘使用面板圆角。路线内项目显示圆形顺序号，其余项目只留实心小圆点。演出点位为约 24px 的独立圆角菱形（17px 圆芯旋转 45°），花船／月亮图标反向旋转保持正立，不占游玩编号；餐饮是圆角方形餐具标记。图标沿用内联 SVG 的圆端点、圆连接和常规线宽，不用表情符号代替操作图标。

## Components

当前交互更新（2026-11-03）：主入口改为侧边导航，嵌套用餐页签、折叠区和开关仍使用本地 Bootstrap 5.3.8；删除攻略长图、宣传标题、重复次级说明以及两个新手提示入口。固定星标采用 Bootstrap Icons，普通项目为深色白边圆点，分区无粗边界。

地图名称统一为 11px。路线项目名称及“演出”短标签常显；全部餐饮和其余未入选项目仅悬停／键盘聚焦显示。标签使用独立、低于图标的图层，自动避开图标、其他标签和固定控件；较远标签以细线关联。密集图标以少量屏幕偏移避让，并保留指向真实锚点的细线。只让实际图形接收指针，避免透明按钮区域抢占附近点位。底图和路线使用 transform 相机，标记、标签及引线在独立的屏幕坐标层定位，不再嵌套反向缩放。视口采用 overflow:clip，键盘聚焦自动定位，手机详情保留选中图标的可视空间。分区 SVG 不再获取焦点，键盘使用原有园区筛选框操作。

- **主要、描边与文字按钮：** 主按钮填青绿，次操作白底描边，辅助动作仅保留文字和线形图标。基础按钮最小高度（40px）；详情手机按钮为（45px）。颜色过渡短促，禁用状态降低透明度（0.4）并使用不可用指针。
- **搜索与筛选：** 搜索框有固定高度、浅底和搜索图标，聚焦时框线转青绿并增加浅色外圈。筛选按钮默认白底细边，选中为深海底白字；同时维护 `aria-pressed`，重置入口仅在需要时出现。搜索无结果时提供一句解释和返回全部项目的按钮。
- **隐藏分类与开关：** “隐藏”分类始终列出全部隐藏记录和原因，可按官方停运／用户主动隐藏筛选。默认关闭“显示隐藏项目”，打开后同步恢复普通清单、地图、室内子项目、演出、餐饮与 DPA 价格表中的隐藏记录。官方停运写出日期，用户主动隐藏写出偏好原因；两类原因可并存，未公布演出场次不算停运。开关保存到本地，兼容旧的两项设置。原因文字采用 hidden-reason 色，清单桌面 12px、手机 11px，详情 14px。
- **导航：** 侧栏选中项为浅青绿底、青绿文字；手机地图／清单切换器以深海底白字表示选中。均保留文字标签，不再使用顶端页面页签。
- **项目清单与详情：** 清单分全部、项目、演出、餐厅、其他（交通）、隐藏六类。显示照片或统一餐具图标、中文名、玩法、体验时长与必要状态。项目详情为照片、通俗的一句话玩法、特色、时长和必要价格／隐藏原因／日期场次，再接时间表入口与官方链接。餐厅详情显示用餐方式、预约时点和原因；没有真实照片的新餐厅省略图片区，使用标题旁关闭按钮。自由探索时长标成导览建议。关闭后返回可见来源控件。
- **英文原名：** 只在当前项目详情的中文标题下显示 12px 次级英文，可换行完整阅读，使用 lang=en。地图、列表、时间表、DPA 旁注和室内子项目清单仅显示中文；点开子项目后再显示其英文原名。
- **室内区汇总：** 全园主图在美人鱼礁湖的建筑入口附近只放“美人鱼礁湖 · 室内区”一个点，移除独立室内图。数据保留 5 个子项目，详情按停运筛选显示相应照片、名称、玩法与时长；点击后进入单项目详情，并可返回室内区。搜索仍按小项目匹配，地图统一定位汇总点。
- **地图点位与分区：** 数据包含 31 个常规项目／车站、2 个用户主动隐藏项目、2 个演出点及 23 个餐厅／小吃记录。路线圆芯统一为 24px，演出以 17px 方形旋转成约 24px 的菱形；餐厅标记 20px，小吃 18px，普通点 14px，固定星标 12px。尺寸不随缩放、悬停或选中放大。区域／类型／搜索只淡化不匹配项；实际显隐由统一隐藏开关控制。分区仅有轻淡底色，不恢复矩形焦点框、粗边界或大块分区名称。
- **朝向与坐标：** “北向朝上”依官方原图北针逆时针约 105°；“官方方向”使用原图 0°，北针指向右下方。原图、分区和数据点同步变换，名称与数字保持正向。切换后重新适配园区轮廓，选中项目仍定位在可见区域；data.js 保留原图坐标。
- **DPA 绿圈：** 按所选日期判断服务适用与已确认停运。适用标记的白边换为 3px 亮绿，内收的 1px 深绿边缘增强不同底图上的对比；圆芯边界尺寸保持 24px／14px，键盘焦点仍有独立提示。图例说明“DPA适用”，名额以 App 为准。
- **路线与时间表：** 紫红线带白色底描边和方向箭头。入口为 0 号节点，使用与项目一致的 24px 圆芯，标签“入口”置于旁侧；先从入口连到第 1 项，其后只有游玩项目参与连线和连续编号，序号与时间表的游玩项目一一对应；演出及餐厅只保留独立标记，午晚餐只留就近自选的简餐预算。关闭“显示连线”只隐藏线，序号、圆点、演出大标记和餐厅图标保留。路线按逆时针方向加入梦幻泉乡，先忿怒双神、再冰雪奇缘、再印第安纳琼斯，随后经发现港到美国海滨；梦幻泉乡进出有一段共用连接区。地图入口显示“0 入口”，两场水上秀都标“演出”，其他路线名称采用短名。未公布演出仍显示预留与待公布；日期及替代安排由数据和计划器决定。
- **价格与用餐：** 用餐子页签为“提前订座／先手机点餐／无需订座”，覆盖 6 家建议订座、3 家须手机点餐及 14 个无需订座的快餐／小吃记录。餐厅分类可进一步按用餐方式筛选。预约列明提前一个月 10:00、当天网上 09:00 和门口余位 10:00，均为日本时间，关键例子并列北京时间。简餐各约 30 分钟、正式桌餐 60–90 分钟均标为导览建议。
- **DPA 规则与预算：** 入园后购买，各项目／时段分别看余票；后续补票没有官方公布的固定时刻。再次购买按付款后 60 分钟与使用开始时间的较早值，用 10:00→11:00、10:00→10:30 两个例子说明。主行程旁注区分计划依赖与可选购买；普通日两位成人按冰雪奇缘、古塔 DPA 约 ¥8,000，提前闭园日加忿怒双神约 ¥11,000，均为有票前提下的草案。
- **次级说明：** 出发检查卡、长图、标语和新手弹窗已移除；教程细节采用折叠组件，地图来源保留原生折叠入口。

全局键盘焦点采用明显外描边（3px，外偏移 4px）；搜索框和地图区域有各自的焦点处理。详情桌面入场为（250ms）短位移，手机为（200ms）淡入；控件过渡通常为（150–200ms）。启用减少动态效果时关闭动画、过渡与平滑滚动。这里只记录已实现行为，不代表完成了全面辅助技术或对比度审计。

## Do's and Don'ts

### Do

- Do 保持简短中文和明确状态；项目玩法只用一句话。
- Do 沿用实际照片、官方底图及其来源记录；图标保持细线条。
- Do 保留键盘焦点、文字标签和减少动态效果支持。
- Do 同步地图序号与时间表顺序，给未知场次保留明确的待公布文字。
- Do 按 PRODUCT.md 与 surface.md 延续当前范围，新增界面先复用现有组件。

### Don't

- Don't 在地图上叠加大块海港名称或用不透明色块盖住底图。
- Don't 把紫红连线画成精确步行导航，或只靠颜色区分演出与项目。
- Don't 恢复收藏入口、长篇适合人群说明或未渲染的旧组件。
- Don't 把默认日期草案、排队预算或未公布场次表现为已确认安排。
- Don't 声称存在未提供的字体字重、实时数据或未执行的可访问性验证。

