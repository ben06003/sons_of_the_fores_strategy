// 流派詳細攻略
// 文字中的 {{English Name}} 會自動顯示為「台服名稱 + 國際服英文 + 圖示」（對照表見 data/names.js）
// 寶石連結：字串前加 * 表示主技能、? 表示可選
(function () {
  "use strict";

  // ======================================================================
  // 共用：聖宗「魔幻（Archmage）」章節拓荒流程（整理自惡魔貓 3.30 教學表格）
  // ======================================================================
  const ARCHMAGE_ACTS = [
    {
      act: "A1", level: "1–13", title: "熔岩翻騰＋神聖火舌圖騰開荒",
      steps: [
        "【小技巧】開場先創一隻遊俠，拿 {{Momentum}}（等等串在 {{Leap Slam}} 上，聖堂武僧買不到 {{Momentum}} 和 {{Faster Attacks}}），順便把商店的藍色法術寶石掃空，水、卷軸和寶石全丟進倉庫後換回聖堂武僧。",
        "打死西拉克（Hillock）後：{{Rolling Magma}} 開荒。",
        "打破鳥蛋後，點水聲之淵傳送門到醫療箱任務 → 回家拿 {{Quicksilver Flask}}。",
        "進水淵走到橋前開傳送門（等等回來打螃蟹）。",
        "踩監獄傳送點後回家拿輔助寶石，換成下面的連結。節奏：放 {{Holy Flame Totem}}＋{{Flame Wall}} 就能開始衝，遇到藍怪才補 {{Rolling Magma}}。",
        "打螃蟹 → 回監獄 → 【昇華】監獄試煉 → 打典獄長後直接登出到新點。",
        "不滅之火 → 踩海妖洞窟傳點 → 回船墓打船長 → 打海妖。",
      ],
      links: [
        { slot: "主技能", gems: ["*Rolling Magma", "Elemental Proliferation", "Combustion"] },
        { slot: "圖騰", gems: ["*Holy Flame Totem", "Summon Phantasm", "Added Lightning Damage"] },
        { slot: "位移", gems: ["Frostblink", "Arcane Surge"], note: "秘能波動只需 2 等，記得升級" },
        { slot: "輔助", gems: ["Flame Wall"] },
      ],
    },
    {
      act: "A2", level: "13–23", title: "拿捷技能、開始衝刺",
      steps: [
        "打白色巨獸 → 踩危機岔路 → 回家拿跑水。",
        "【昇華】罪孽之殿試煉。",
        "回家拿 {{Herald of Ash}}、{{Herald of Thunder}}。",
        "跑織網者巢穴 → 回家拿 {{Faster Casting}}，習慣 {{Flame Dash}} 的話可以串在上面。洞色不對就塞冰冷／閃電傷害；缺敏捷先跟商人買翠玉護身符補。",
        "打克雷格 → 打歐克（踩古樹前的點）→ 打阿莉亞（或幫她）。",
        "打死隊長開印 → 【昇華】靜謐陵墓試煉。",
        "推球（古代封印）走 S 型就不會撞死路 → 回家拿 {{Wave of Conviction}}。",
        "進瀑布走到瓦爾金字塔頂端打瓦爾全能 → 直接重登回家，傳到第三章。",
      ],
    },
    {
      act: "A3", level: "23–33", title: "Lv28 烈焰風暴 → Lv31 轉「魔幻烈焰風暴」＋第一次迷宮",
      steps: [
        "打隊長，記得等卡爾莉莎站起來跟她說話 → 直奔火葬場 → 【昇華】火葬場試煉。",
        "打完派蒂後回家拿 {{Determination}}（聖宗在第三章開頭就能拿，點完光環圈就可以開）。開了 {{Determination}} 就關掉兩個捷技能，新手更不容易死。",
        "跟卡爾麗莎買詛咒 {{Elemental Weakness}}、{{Conductivity}}：先放 {{Elemental Weakness}}（魔幻火雨同時有火和電傷，前期元素要害較好），{{Conductivity}} 放身上練，等 POB 傷害比較高再換。",
        "下水道拿三顆雕像 → 【昇華】黑石陵墓試煉。",
        "激戰廣場 → 拿絲線之軸 → 海港拿餘燼 → 重登 → 找達拉夫人。",
        "打格拉維奇將軍後（約 Lv28）換成 {{Firestorm}} 連結（見下方）。",
        "月影之殿打派蒂 → 回家拿點數。抓幽魂：進河道後施放 {{Blasphemy}}，按 Esc 設定中預設 A 鍵可看名字。",
        "圖書館黃金之頁解完後（約 Lv31）→ <b>立刻轉換到魔幻烈焰風暴</b>：烈焰風暴打擊數超高，非常適合魔幻的高基礎點傷，至此開始爽玩。",
        "回第二章購買 {{Arcane Cloak}}＋{{Automation}}＋{{Arcane Surge}}；平常打圖放 {{Armageddon Brand}} 讓敵人燃燒，打王再丟烈焰風暴。不想一直喝藍水可以關掉自動化，打王時再手動開秘能披風。",
        "迷宮花園有最後一個昇華試煉 → Lv28～33 跑<b>第一次迷宮</b>。",
        "打神主。",
      ],
      links: [
        { slot: "Lv28 主技能", gems: ["*Firestorm", "Concentrated Effect", "Faster Casting", "Inspiration"], note: "洞不夠由前往後串" },
        { slot: "Lv31 魔幻（主技能）", gems: ["*Firestorm", "Archmage", "Inspiration", "Concentrated Effect"] },
        { slot: "位移", gems: ["Frostblink", "Archmage"], note: "讓霜漣之瞬也能秒白怪" },
        { slot: "光環", gems: ["Eternal Blessing", "Determination"], note: "有自信可換迅捷" },
        { slot: "秘能披風", gems: ["Arcane Cloak", "Automation", "Arcane Surge"] },
        { slot: "移動（看雙持權杖或拿盾）", gems: ["Shield Charge", "Faster Attacks", "Momentum"] },
        { slot: "可選", gems: ["?Wave of Conviction"], note: "打王多按可扣 15% 抗，不需要也夠用" },
      ],
    },
    {
      act: "A4", level: "33–40", title: "洞色連線不夠不用強求",
      steps: [
        "打福爾拿旗子 → 開啟礦坑門。",
        "礦坑第二層救完人 → 打大決鬥場。",
        "打岡姆 → 打瑪拉凱。",
      ],
    },
    {
      act: "A5", level: "40–45", title: "",
      steps: [
        "拿探測棒後往上拿眼睛 → 直奔善。",
        "聖物間拿奇塔弗折磨 → 回家 → 打奇塔弗。",
      ],
    },
    {
      act: "A6", level: "45–50", title: "注意：此章開始抗性 -30%",
      steps: [
        "拿眼睛打卡魯神 → 【昇華】監獄試煉。",
        "打薛朗，打完打火山羊王。",
        "進森林先踩點 → 左上濕地打蟲女王 → 回家拿天賦點、順便換水。",
        "回森林走右下到南部森林 → 打海神王。",
      ],
    },
    {
      act: "A7", level: "50–55", title: "第二次迷宮",
      steps: [
        "危機岔路踩點 → 【昇華】靜謐陵墓試煉。",
        "罪孽之殿打鑰匙（中間有個壞掉的製圖儀，它正對出去的方向就是第二層樓梯）→ 第二層【昇華】試煉。",
        "打古斯特千面神。",
        "北部森林遇到螢火蟲洞穴時開門 → 一路跑到艾爾卡莉神殿前踩點 → 回家進門拿螢火蟲 → 打絕望之母。",
        "跑<b>第二次迷宮</b>（殘酷迷宮）。",
        "打艾爾卡莉。",
      ],
    },
    {
      act: "A8", level: "55–60", title: "",
      steps: [
        "下水道打完德瑞後往右走。",
        "解十字架任務（通道門口會有大拱門＋橋）。",
        "日耀神殿拿石頭 → 橫跨海港大橋過去踩點 → 月影神殿拿石頭。",
      ],
    },
    {
      act: "A9", level: "60–64", title: "",
      steps: [
        "拿風暴之刃 → 下張地圖拿蜥蜴毒 → 回家。",
        "礦坑通道【昇華】試煉。",
        "採石場打卡洛翰 → 打將軍拿煉獄之粉。",
        "回家交東西拿瓶中閃電 → 打右上蠍子神 → 回家交任務 → 打三巨頭。",
        "回到月影神殿前的點 → 【昇華】大澡堂＋空中花園試煉。",
      ],
    },
    {
      act: "A10", level: "64–68", title: "第三次迷宮 → 打奇塔弗進輿圖",
      steps: [
        "到摧殘大廣場開門，先踩葬骨禮堂前的點。",
        "打褻瀆之間拿聖杖 → 踩傳點回家（不能登出）→ 回家釋放善 → 回剛才的門打衝突地帶的天賦點（范尼達）。",
        "葬骨禮堂【昇華】試煉。",
        "跑<b>第三次迷宮</b>（無情迷宮）。",
        "打奇塔弗 → 恭喜進入輿圖階段！記得打 /played 和 /passives 確認時間與天賦點。",
      ],
    },
    {
      act: "A11", level: "68+", title: "尾聲（奧瑞亞）→ 進入輿圖",
      steps: [
        "POE1 本篇只有 10 章；打完奇塔弗會進入「尾聲」城鎮（poedb 標為 Act 11），這裡沒有新的練功地圖，是轉入輿圖的準備階段。",
        "注意：打完 A10 奇塔弗後全抗性再 -30%（總共 -60%），<b>先把元素抗性補回 75%</b> 再開始跑圖。",
        "到城鎮商人（莉莉．羅斯）買齊缺少的寶石，把練功裝換成下方「裝備進程 ①」的過渡裝。",
        "依照各流派的轉換時機換主技能、重洗天賦（魔力堆疊天賦）。",
        "到基拉克處開始輿圖，先打白圖累積貨幣，再往黃圖、紅圖推進。",
      ],
    },
  ];

  // 共用：章節練功期間的連結（Spicysushi / 某雷 POB 的 1–60 等技能組）
  const LEVELING_STAGES = [
    {
      title: "Lv1–17", when: "A1～A2",
      links: [
        { slot: "主技能", gems: ["*Rolling Magma", "Combustion", "Elemental Proliferation"] },
        { slot: "位移", gems: ["Frostblink", "Arcane Surge"] },
        { slot: "移動", gems: ["Leap Slam", "Momentum", "?Shield Charge"], note: "雙持攻速 1.55 以上的劍可以更快躍擊" },
        { slot: "輔助", gems: ["Holy Flame Totem"] },
        { slot: "輔助", gems: ["Flame Wall"] },
      ],
    },
    {
      title: "Lv17–28", when: "A2～A3",
      links: [
        { slot: "主技能", gems: ["*Rolling Magma", "Combustion", "Elemental Proliferation", "?Cruelty"] },
        { slot: "位移", gems: ["Frostblink", "Arcane Surge"] },
        { slot: "移動", gems: ["Leap Slam", "Momentum"] },
        { slot: "捷", gems: ["Herald of Thunder", "Herald of Ice"] },
        { slot: "輔助", gems: ["Holy Flame Totem"] },
        { slot: "輔助", gems: ["Flame Wall"] },
      ],
    },
    {
      title: "Lv28–40", when: "A3～A4",
      desc: "烈焰風暴 3 藍 1 紅或 2 藍 2 紅，38 等換上 {{Unleash}}。",
      links: [
        { slot: "主技能", gems: ["*Firestorm", "Cruelty", "Combustion", "Arcane Surge", "?Fire Penetration", "?Faster Casting", "?Unleash"] },
        { slot: "位移", gems: ["Frostblink", "Arcane Surge", "Wave of Conviction"] },
        { slot: "移動", gems: ["Leap Slam", "Momentum", "Faster Attacks"] },
        { slot: "光環", gems: ["Haste", "?Anger", "?Grace"], note: "怕死就換優雅" },
        { slot: "輔助", gems: ["Holy Flame Totem"] },
        { slot: "詛咒", gems: ["Flammability"] },
      ],
    },
    {
      title: "Lv41–60", when: "A5～A8",
      desc: "在 Lv50 左右點 {{Mind Over Matter}}，光環換成 {{Eternal Blessing}}＋50% 保留光環提高生存，有空洞可加 {{Arcane Cloak}}。",
      links: [
        { slot: "主技能", gems: ["*Firestorm", "Cruelty", "Combustion", "Unleash", "?Fire Penetration", "?Faster Casting"] },
        { slot: "位移", gems: ["Frostblink", "Arcane Surge", "Wave of Conviction"] },
        { slot: "移動", gems: ["Leap Slam", "Momentum", "Faster Attacks"] },
        { slot: "光環", gems: ["Haste", "?Anger", "?Grace"] },
        { slot: "輔助", gems: ["Holy Flame Totem"] },
        { slot: "詛咒", gems: ["Flammability"] },
      ],
    },
  ];

  // 共用：昇華順序
  const ASC_DEVILCAT = [
    { lab: "普通迷宮（A3，Lv28–33）", node: "{{Arcane Blessing}}", note: "秘能波動／秘能披風強化" },
    { lab: "殘酷迷宮（A7）", node: "{{Divine Guidance}}", note: "增加魔力＋10% 承受傷害轉由魔力扣除" },
    { lab: "無情迷宮（A10）", node: "{{Conviction of Power}}", note: "4 暴擊球＋4 耐力球" },
    { lab: "終極迷宮（輿圖）", node: "{{Sanctuary of Thought}}", note: "" },
  ];

  // 共用：魔幻聖宗的黃裝
  const ARCHMAGE_RARES = [
    {
      slot: "武器（雙持法杖）", sockets: "BBB", base: ["Profane Wand", "Tornado Wand", "Sage Wand", "Prophecy Wand"],
      stats: [
        { k: "最大魔力（Maximum Mana）", v: "+90～+147", must: true },
        { k: "施放速度（Cast Speed）", v: "18～24%", must: true },
        { k: "法術傷害（Spell Damage）", v: "45～69%" },
        { k: "法術暴擊率（Spell Crit Chance，轉暴擊後）", v: "80%+" },
        { k: "附加閃電傷害（Adds Lightning to Spells，前期）", v: "~70 均傷" },
      ],
      note: "不怕死可雙持法杖；72 等與 83 等時到賭博商人（金幣）買法杖，此時才會出現 T2／T1 施放速度。拿到接近 POB 的法杖就停手存金幣，之後做重組。",
    },
    {
      slot: "頭盔", sockets: "BBBB", base: ["Hubris Circlet", "Steel Circlet"],
      stats: [
        { k: "最大魔力", v: "+50～+67", must: true },
        { k: "最大生命（Maximum Life）", v: "+70 以上", must: true },
        { k: "元素抗性", v: "補到 75%" },
        { k: "混沌抗性（可選）", v: "+20% 以上" },
      ],
      note: "之後換 {{Kitava's Thirst}}（觸發型）或 {{Mindspiral}}（魔力當護盾）。",
    },
    {
      slot: "胸甲（6 連）", sockets: "BBBBBB", base: ["Conquest Chainmail", "Widowsilk Robe", "Sadist Garb"],
      stats: [
        { k: "最大生命", v: "+110～+156", must: true },
        { k: "最大魔力", v: "+50～+63", must: true },
        { k: "專注時回復 30% 魔力與護盾（Recover Mana when you Focus）", v: "工藝" },
        { k: "元素抗性", v: "補缺口" },
      ],
      note: "主技能放在 6 連；之後換 {{Cloak of Defiance}}。",
    },
    {
      slot: "手套", sockets: "BBBB", base: ["Crusader Gloves", "Arcanist Gloves", "Legion Gloves"],
      stats: [
        { k: "最大生命", v: "+60～+118", must: true },
        { k: "最大魔力", v: "+35～+67", must: true },
        { k: "元素抗性", v: "補缺口" },
        { k: "專注時增加攻擊與施放速度（工藝）", v: "31～36%" },
        { k: "命中時施加閃電曝曬（Eldritch 隱含）", v: "後期" },
      ],
    },
    {
      slot: "鞋子", sockets: "BBBB", base: ["Crusader Boots", "Sorcerer Boots", "Carnal Boots", "Murder Boots"],
      stats: [
        { k: "移動速度（Movement Speed）", v: "25～30%", must: true },
        { k: "最大生命", v: "+60～+120", must: true },
        { k: "最大魔力", v: "+25～+60" },
        { k: "元素抗性", v: "補缺口" },
        { k: "擊殺時獲得猛攻（Onslaught on Kill）", v: "後期" },
      ],
    },
    {
      slot: "腰帶", base: ["Heavy Belt", "Stygian Vise", "Leather Belt"],
      stats: [
        { k: "最大生命", v: "+85～+132", must: true },
        { k: "最大魔力", v: "+45～+54", must: true },
        { k: "力量（Strength）", v: "+25～+35" },
        { k: "元素／混沌抗性", v: "補缺口" },
      ],
      note: "深淵腰帶可再插一顆生命＋魔力＋施放速度的深淵珠寶。",
    },
    {
      slot: "項鍊", base: ["Jade Amulet", "Citrine Amulet", "Turquoise Amulet"],
      stats: [
        { k: "塗油：{{Mind Drinker}}", v: "Allocates", must: true },
        { k: "最大魔力", v: "+35～+73", must: true },
        { k: "最大生命", v: "+50 以上" },
        { k: "敏捷／力量（補屬性）", v: "+20～+55" },
        { k: "施放速度", v: "10～20%" },
      ],
      note: "之後換 {{Atziri's Foible}} 或穢生 {{Voice of the Storm}}。",
    },
    {
      slot: "戒指 ×2", base: ["Moonstone Ring", "Amethyst Ring", "Two-Stone Ring"],
      stats: [
        { k: "最大生命", v: "+58～+70", must: true },
        { k: "最大魔力", v: "+36～+66", must: true },
        { k: "施放速度（工藝可做 +10%）", v: "12～14%" },
        { k: "元素／混沌抗性", v: "補缺口" },
        { k: "降低技能魔力消耗（工藝）", v: "可選" },
      ],
    },
  ];

  // ======================================================================
  window.POE_GUIDES = {
    shared: {
      patchNote: "<b>3.30「Covens of Umbra」（2026/11/13 開放）</b>：官方改版說明中，聖宗的調整只出現在 Ruthless 模式；{{Archmage}}、{{Mind Over Matter}}、{{Hexblast}}、{{Ice Nova of Frostbolts}}、{{Ball Lightning of Orbiting}}、{{Shock Nova of Procession}}、{{Kitava's Thirst}} 在 3.30 都沒有改動。真正影響魔幻流的是 <b>3.29</b>：{{Archmage}} 附加閃電由未保留魔力的 10–16% 降為 8–14%、純閃電法術魔力消耗 +25%、{{Arcane Cloak}} 固定為消耗魔力的 10%；{{Hexblast}} 冷卻改為 1 秒。以下 3.29 以前的 POB 數值可能略有落差。",
      archmageActs: ARCHMAGE_ACTS,
      ascDevilcat: ASC_DEVILCAT,
    },
    guides: {
      // ------------------------------------------------------------------
      "聖堂武僧-聖宗-魔力流-咒術枯萎": {
        hero: "Hexblast",
        subtitle: "Archmage Hexblast Hierophant｜魔幻咒術枯萎聖宗",
        basis: "章節流程來自惡魔貓的 3.30 教學表格；技能組與裝備來自某雷（3.29 POB，主技能已改為 {{Hexblast of Contradiction}}）與惡魔貓影片中的 POB（Lv80 實戰角色）。3.30 若有平衡調整，請以遊戲內數值為準。",
        summary: [
          "以 {{Archmage}} 將「未保留最大魔力」轉成大量閃電點傷，搭配 {{Mind Over Matter}} 與聖宗昇華把魔力當成第二條血。主技能 {{Hexblast}} 會引爆敵人身上的咒術造成大量傷害，搭配 {{Blasphemy}} 光環持續上咒，刷圖範圍大、單體也強。",
          "表格評價：刷圖 強／打王 強／總評 強——「穩定首發的選擇，無短版」。",
        ],
        pros: ["魔力堆疊同時提升傷害與坑度，裝備需求單純（生命＋魔力＋施速＋抗性）", "一身黃裝就能打紅藍王", "{{Hexblast of Contradiction}} 等於白撿約 30% 傷害"],
        cons: ["需要解決「怪身上要有咒術」的問題（褻瀆光環、{{Mark of Submission}}、{{Windscream}}）", "藍量吃緊時要靠秘能波動／啟發維持", "魔力回復不夠時手感會卡"],
        mechanics: [
          "{{Hexblast}} 擊中帶有咒術的敵人時會移除咒術並造成額外傷害；某雷改用 {{Hexblast of Contradiction}}，單體傷害不吃範圍，所以拿掉 {{Concentrated Effect}}，改在鞋子上補範圍。",
          "上咒來源：{{Blasphemy}}＋{{Elemental Weakness}}（武器），{{Conductivity}} 放在 {{Mark of Submission}} 戒指，命中時自動上咒；{{Windscream}} 鞋子可多一個詛咒並增加咒術範圍 50%。",
          "{{Arcane Cloak}}＋{{Automation}} 自動施放，提供大量點傷與魔力回復。",
        ],
        ascendancy: "ascDevilcat",
        acts: "archmageActs",
        actsIntro: "惡魔貓的建議：<b>有 3 次昇華、且拿到 {{Hexblast of Contradiction}} 後再轉</b>。硬要直接在章節玩也可以，差別只是把烈焰風暴換成咒術枯萎；這樣昇華改成第一次點「30% 魔力」、第二次點「魔力增加 100% 範圍」。",
        actSwitch: {
          A10: "【轉換時機】打完無情迷宮、有 {{Hexblast of Contradiction}} 後：把 6 連的 {{Firestorm}} 換成 {{Hexblast of Contradiction}}，並把 {{Blasphemy}}＋{{Elemental Weakness}} 掛上（見下方「早期輿圖」連結）。",
        },
        stages: [
          ...LEVELING_STAGES,
          {
            title: "早期輿圖", when: "A10 後～白圖／黃圖",
            links: [
              { slot: "胸甲 6 連", sockets: "BBBBBB", gems: ["*Hexblast", "Spell Echo", "Archmage", "Intensify", "Inspiration", "?Arcane Surge", "?Lightning Penetration"] },
              { slot: "手套", sockets: "BBB", gems: ["Arcane Cloak", "Automation", "More Duration"] },
              { slot: "鞋子", sockets: "BBBB", gems: ["Frostblink of Wintry Blast", "Archmage", "Faster Casting", "Spell Echo"] },
              { slot: "武器 1", sockets: "BBB", gems: ["Eternal Blessing", "Frostblink", "Elemental Weakness", "Blasphemy"] },
              { slot: "武器 2", sockets: "BBB", gems: ["Frost Shield", "Sigil of Power", "Arcanist Brand"] },
              { slot: "戒指（{{Mark of Submission}}）", sockets: "G", gems: ["Conductivity"] },
            ],
          },
          {
            title: "Lv90 完成形", when: "紅圖／打王",
            links: [
              { slot: "胸甲 6 連", sockets: "BBBBBB", gems: ["*Hexblast of Contradiction", "Archmage", "Spell Echo", "Arcane Surge", "Cooldown Recovery", "Lightning Penetration"] },
              { slot: "武器 1", gems: ["Eternal Blessing", "Frostblink", "Blasphemy", "Elemental Weakness"] },
              { slot: "武器 2", gems: ["Sigil of Power", "Frost Shield", "Arcanist Brand"] },
              { slot: "鞋子", gems: ["Arcane Cloak", "More Duration", "Automation", "Arcane Surge"] },
              { slot: "手套", gems: ["Frostblink of Wintry Blast", "Faster Casting", "Spell Echo", "Archmage"] },
              { slot: "戒指", gems: ["Conductivity"] },
            ],
          },
          {
            title: "終局變體：{{Unholy Trinity}}", when: "高預算",
            links: [
              { slot: "主技能", gems: ["*Hexblast of Contradiction", "Archmage", "Cooldown Recovery", "Unholy Trinity", "Spell Echo", "Arcane Surge"] },
              { slot: "光環", gems: ["Eternal Blessing", "Frostblink", "Blasphemy", "Punishment"] },
            ],
          },
        ],
        raresIntro: "魔幻流的黃裝邏輯很單純：<b>每個部位都要「生命＋魔力」</b>，剩下的詞綴拿來補抗性、施放速度與屬性。抗性務必補滿 75%。",
        rares: ARCHMAGE_RARES,
        phases: [
          {
            title: "① 過完章節（過渡裝）", when: "Lv68～80｜白圖",
            desc: ["參考惡魔貓影片中的 Lv80 實戰角色：全身黃裝，只求生命、魔力、抗性補滿。武器先用一把法杖＋一面法術盾，副手放 {{Faun's Horn}} 交換武器跑任務。"],
            items: [
              { slot: "武器", name: "黃法杖：+137 魔力、19% 施速、47% 法傷、78% 法術暴擊", rare: true },
              { slot: "副手", name: "黃法術盾（Chiming Spirit Shield）：法傷＋魔力＋抗性", rare: true },
              { slot: "頭盔", name: "Thrillsteel", why: "前期提供猛攻，可用任何生命＋魔力的黃頭盔取代" },
              { slot: "其他", name: "全身黃裝：生命＋魔力＋抗性", rare: true },
            ],
            links: [
              { slot: "胸甲", gems: ["*Hexblast of Contradiction", "Arcane Surge", "Archmage", "Spell Echo", "Lightning Penetration"] },
              { slot: "頭盔", gems: ["Increased Area of Effect", "Blasphemy", "Elemental Weakness", "Eternal Blessing"] },
              { slot: "手套", gems: ["Frostblink", "Arcane Surge", "Lightning Warp", "Culling Strike"] },
              { slot: "鞋子", gems: ["Summon Flame Golem", "Arcane Cloak", "Automation"] },
              { slot: "副手", gems: ["More Duration", "Increased Area of Effect", "Sigil of Power"] },
              { slot: "武器", gems: ["Momentum", "Shield Charge", "Faster Attacks"] },
            ],
          },
          {
            title: "② 早期輿圖", when: "T1～T10",
            desc: ["補上傳奇解決上咒與抗性，雙持黃法杖。"],
            items: [
              { slot: "戒指", name: "Mark of Submission", why: "命中時施放插槽中的咒術（放 {{Conductivity}}）" },
              { slot: "戒指", name: "Dream Fragments", why: "免疫冰凍／冰緩＋20% 最大魔力＋魔力回復" },
              { slot: "武器 ×2", name: "Tornado Wand：附加閃電、26% 法傷、+89 魔力、10～13% 施速", rare: true },
              { slot: "胸甲", name: "Conquest Chainmail 6 連：+156 生命、+63 魔力、專注回魔", rare: true },
            ],
          },
          {
            title: "③ 紅圖／Lv90", when: "T11～T16",
            items: [
              { slot: "項鍊", name: "Voice of the Storm", why: "穢生版本會配置 {{Mind Drinker}}，+50% 閃電傷害、+20% 最大魔力" },
              { slot: "手套", name: "Wyrmsign", why: "每個耐力球降低 4% 魔力消耗，滿耐力球時獲得狂暴" },
              { slot: "鞋子", name: "Windscream", why: "多一個詛咒＋咒術範圍 +50%" },
              { slot: "武器 ×2", name: "Profane Wand：38% 施速、+127 魔力、45～54% 法傷", rare: true },
              { slot: "腰帶", name: "Stygian Vise：+132 生命、+30% 混抗、+45 魔力＋深淵珠寶", rare: true },
            ],
          },
          {
            title: "④ 終局", when: "T17／Uber 王",
            desc: ["某雷的「誓約」配置：換成 {{Pledge of Hands}} 6 連法杖（內建高等 {{Spell Echo}}、大量最大魔力與法術格擋），雙戒指換成施速＋生命＋魔力的月光石戒指。"],
            items: [
              { slot: "武器", name: "Pledge of Hands", why: "6 連法杖：100% 最大魔力、內建法術回響、格擋" },
              { slot: "戒指 ×2", name: "Moonstone Ring：施速 22%、+70 生命、+66 魔力", rare: true },
            ],
            links: [
              { slot: "法杖 6 連", sockets: "BBBBBB", gems: ["*Hexblast of Contradiction", "Archmage", "Arcane Surge", "Cooldown Recovery", "Lightning Penetration", "Hypothermia"] },
            ],
          },
        ],
        sources: [
          { label: "惡魔貓：魔幻咒術枯萎聖宗 保母級拓荒教學（YouTube）", url: "https://youtu.be/f5M1nZvq6uA" },
          { label: "惡魔貓：3.30 某雷的魔幻火雨轉咒術枯萎章節拓荒（Google 表格）", url: "https://docs.google.com/spreadsheets/d/1p1ynqtbYmDRj37AFwT5eNN6njZghUCMewLvNA-evVO4/edit?gid=2109325450" },
          { label: "惡魔貓影片 POB（Lv80）", url: "https://pobb.in/PmcClEFjGtkw" },
          { label: "某雷：我的開荒焚絕 全屏魔蠱爆炸大法師（YouTube，3.29）", url: "https://youtu.be/BLcxK4BRdbs" },
          { label: "某雷 POB（含 1–90 等技能／天賦／裝備組）", url: "https://poedb.tw/pob/gJlc3mD29n" },
        ],
      },

      // ------------------------------------------------------------------
      "聖堂武僧-聖宗-魔力流-冰霜新星．寒冰彈": {
        hero: "Ice Nova of Frostbolts",
        subtitle: "Archmage Ice Nova of Frostbolts Hierophant｜魔幻冰霜新星．寒冰彈聖宗",
        basis: "技能組、天賦與裝備來自 Spicysushi 的 3.27 POB（含 1–60 等練功組、早期輿圖、Lv90、轉暴擊、T17、Uber 配置）與 goratha 的 3.25 POB；章節流程沿用惡魔貓 3.30 的魔幻火雨開荒。3.30 若有平衡調整，請以遊戲內數值為準。",
        summary: [
          "用 {{Frostbolt}} 在地上放置大量緩慢的寒冰彈，再以 {{Ice Nova of Frostbolts}} 從每一顆寒冰彈的位置同時炸出冰霜新星。搭配 {{Archmage}} 魔力堆疊與 {{Mind Over Matter}}，單體爆發極高。",
          "表格評價：刷圖 中／打王 中／總評 中。",
        ],
        pros: ["單體爆發高，Uber 王表現好", "裝備邏輯和其他魔幻流相同，可共用", "有完整的轉暴擊、格擋進階路線"],
        cons: ["需要先放寒冰彈，刷圖手感比咒術枯萎慢", "{{Ice Nova of Frostbolts}} 寶石偏貴，需要在迷宮神聖泉源轉換或購買", "操作較多（寒冰彈＋新星兩段）"],
        mechanics: [
          "頭盔放 {{Frostbolt}}＋{{Greater Volley}}＋{{Slower Projectiles}}，一次射出多顆慢速寒冰彈；6 連主技能 {{Ice Nova of Frostbolts}} 會以每顆寒冰彈為中心施放新星。",
          "goratha 建議：<b>至少用烈焰風暴打到殘酷迷宮</b>，之前沒有範圍與施速，太早轉手感很差。沒有寶石的話可用烈焰風暴刷商人迷宮或終極迷宮來取得。",
          "{{Kitava's Thirst}} 可讓寒冰彈自動觸發（魔力消耗 ≥100 時），變成一鍵流，但頭盔數值很差（還會降低施放速度）。",
        ],
        ascendancy: [
          { lab: "普通迷宮", node: "{{Conviction of Power}}", note: "4 暴擊球＋4 耐力球（Spicysushi POB）" },
          { lab: "殘酷迷宮", node: "{{Divine Guidance}}", note: "" },
          { lab: "無情迷宮", node: "{{Sanctuary of Thought}}", note: "" },
          { lab: "終極迷宮", node: "{{Arcane Blessing}}", note: "也可依惡魔貓順序點" },
        ],
        acts: "archmageActs",
        actsIntro: "章節照惡魔貓的魔幻火雨流程走即可（A3 Lv31 轉魔幻烈焰風暴）。轉冰霜新星的時機：<b>至少打完殘酷迷宮（A7）</b>，並且已經拿到 {{Ice Nova of Frostbolts}}。",
        actSwitch: {
          A7: "【轉換時機】殘酷迷宮後若已有 {{Ice Nova of Frostbolts}}：6 連換成 {{Ice Nova of Frostbolts}}＋{{Archmage}}＋{{Spell Echo}}＋{{Intensify}}＋{{Inspiration}}，頭盔放 {{Frostbolt}}＋{{Greater Volley}}＋{{Slower Projectiles}}。",
        },
        stages: [
          ...LEVELING_STAGES,
          {
            title: "早期輿圖", when: "A10 後～白圖／黃圖",
            links: [
              { slot: "胸甲 6 連", sockets: "BBBBBB", gems: ["*Ice Nova of Frostbolts", "Spell Echo", "Archmage", "Intensify", "Inspiration", "?Arcane Surge", "?Lightning Penetration"] },
              { slot: "頭盔", sockets: "BBBB", gems: ["Frostbolt", "Greater Volley", "Slower Projectiles", "Punishment"] },
              { slot: "手套", gems: ["Arcane Cloak", "Automation", "More Duration"] },
              { slot: "鞋子", gems: ["Frostblink of Wintry Blast", "Archmage", "Faster Casting", "Spell Echo"] },
              { slot: "武器 1", gems: ["Eternal Blessing", "Grace", "?Purity of Elements", "Frostblink"] },
              { slot: "武器 2", gems: ["Frost Shield", "Sigil of Power", "Arcanist Brand"] },
            ],
          },
          {
            title: "Lv90", when: "紅圖",
            links: [
              { slot: "胸甲 6 連", gems: ["*Ice Nova of Frostbolts", "Archmage", "Spell Echo", "Lightning Penetration", "Intensify", "Inspiration"] },
              { slot: "頭盔", gems: ["Frostbolt", "Greater Volley", "Slower Projectiles", "Punishment"] },
              { slot: "武器 1", gems: ["Eternal Blessing", "Purity of Elements", "Frostblink"] },
              { slot: "武器 2", gems: ["Sigil of Power", "Frost Shield", "Arcanist Brand"] },
              { slot: "鞋子", gems: ["Arcane Cloak", "More Duration", "Automation", "Arcane Surge"] },
              { slot: "手套", gems: ["Frostblink of Wintry Blast", "Faster Casting", "Spell Echo", "Archmage"] },
            ],
          },
          {
            title: "Uber 打王", when: "終局",
            links: [
              { slot: "胸甲 6 連", gems: ["*Ice Nova of Frostbolts", "Archmage", "Inspiration", "Intensify", "Spell Echo", "Arcane Surge"] },
              { slot: "頭盔", gems: ["Frostbolt", "Greater Volley", "Assassin's Mark", "Conductivity"] },
              { slot: "鞋子", gems: ["Zealotry", "Eternal Blessing"] },
              { slot: "鞋子", gems: ["Clarity", "Arrogance"] },
              { slot: "手套", gems: ["Arcanist Brand", "Elemental Weakness", "Punishment", "Frost Shield"] },
              { slot: "武器 2", gems: ["Arcane Cloak", "More Duration", "Sigil of Power"] },
              { slot: "武器 1", gems: ["Frostblink of Wintry Blast", "Faster Casting", "Spell Echo"] },
            ],
          },
        ],
        raresIntro: "與其他魔幻流相同：<b>每個部位都要「生命＋魔力」</b>。轉暴擊後法杖要加上法術暴擊率；goratha 的 3.25 版本建議戒指工藝「降低魔力消耗」。",
        rares: ARCHMAGE_RARES,
        phases: [
          {
            title: "① 過完章節（過渡裝）", when: "Lv68～80｜白圖",
            desc: ["沿用烈焰風暴期間的黃裝，先補滿抗性。goratha 前期用權杖（Tyrant's Sekhem：附加閃電、24% 施速、+115 魔力）＋法術盾，搭配 {{Mindspiral}} 與 {{Valako's Sign}}。"],
            items: [
              { slot: "頭盔", name: "Mindspiral", why: "15% 最大魔力轉為能量護盾＋17% 承受傷害回收為魔力" },
              { slot: "戒指", name: "Valako's Sign", why: "對感電敵人傷害＋偷取生命，前期便宜" },
              { slot: "戒指", name: "Dream Fragments", why: "免疫冰凍／冰緩＋20% 最大魔力" },
              { slot: "武器", name: "黃權杖或法杖：附加閃電、施速、+100 以上魔力", rare: true },
            ],
          },
          {
            title: "② 早期輿圖 → Lv90", when: "T1～T16",
            items: [
              { slot: "武器 ×2", name: "Profane Wand：38% 施速、+127 魔力、45～54% 法傷", rare: true },
              { slot: "腰帶", name: "Stygian Vise＋深淵珠寶", rare: true },
              { slot: "胸甲", name: "Conquest Chainmail 6 連（生命＋魔力＋專注回魔）", rare: true },
            ],
          },
          {
            title: "③ 轉暴擊（Crit Swap）", when: "紅圖／異界之石",
            desc: ["Spicysushi 的轉暴擊重點：在能量球輪盤點「免疫感電」精通；手套有曝曬隱含時把反轉精通換成曝曬；法杖工藝暴擊率；拿不到 {{Kitava's Thirst}} 閃電偷取腐化就繼續用 {{Valako's Sign}} 或手套隱含。"],
            items: [
              { slot: "項鍊", name: "Atziri's Foible", why: "+120 魔力、22% 最大魔力、大量魔力回復；之後加上魔力催化劑" },
              { slot: "胸甲", name: "Cloak of Defiance", why: "內建 {{Mind Over Matter}}、+200 以上魔力" },
              { slot: "頭盔", name: "Kitava's Thirst", why: "魔力消耗 ≥100 自動觸發插槽法術（寒冰彈）" },
              { slot: "戒指", name: "Anathema", why: "腐化版本；詛咒上限等於最大暴擊球數" },
              { slot: "戒指", name: "Kikazaru", why: "穢生版本：每等 +2 最大魔力、降低 60% 詛咒效果" },
              { slot: "手套", name: "Legion Gloves：閃電曝曬、+118 生命、+67 魔力、專注施速", rare: true },
              { slot: "鞋子", name: "Carnal Boots：4% 行動速度、+110 生命、+60 魔力、移速、猛攻", rare: true },
            ],
            links: [
              { slot: "胸甲 6 連", gems: ["*Ice Nova of Frostbolts", "Archmage", "Inspiration", "Intensify", "Spell Echo", "Arcane Surge"] },
              { slot: "頭盔（{{Kitava's Thirst}}）", gems: ["Frostbolt", "Greater Volley", "Punishment", "Elemental Weakness"] },
              { slot: "手套", gems: ["Clarity", "Arrogance"] },
              { slot: "手套", gems: ["Eternal Blessing", "Grace"] },
              { slot: "武器 1", gems: ["Arcanist Brand", "Conductivity", "Assassin's Mark"] },
            ],
          },
          {
            title: "④ 終局：T17（暴擊＋格擋）", when: "T17／Uber",
            desc: ["T17 拿掉霜漣之瞬上的法術回響方便閃機制；{{Svalinn}} 遠比黃盾好；{{Red Nightmare}} 也是格擋大提升；格擋足夠可拔掉偷取節點；要開全詞綴 T17 需要一顆 {{Temporal Chains}} 的 {{Balance of Terror}} 對付行動速度降低詞綴。"],
            items: [
              { slot: "腰帶", name: "Hyperboreus", why: "前期解決暴擊問題；長期仍以 Stygian Vise 生存較好" },
              { slot: "副手", name: "Svalinn", why: "格擋大幅提升（價格高）" },
              { slot: "珠寶", name: "Red Nightmare", why: "更多格擋" },
              { slot: "藥劑", name: "Rumi's Concoction", why: "格擋藥劑" },
              { slot: "藥劑", name: "Atziri's Promise", why: "元素轉混沌＋偷取" },
              { slot: "武器", name: "重組法杖（Recombinated Profane Wand）", rare: true },
            ],
          },
        ],
        sources: [
          { label: "Spicysushi：My Starter for 3.27 — Archmage Ice Nova of Frostbolts（YouTube）", url: "https://youtu.be/BPa_okC9pyc" },
          { label: "Spicysushi 完整 POB（1–60 練功／早期輿圖／Lv90／暴擊／T17／Uber）", url: "https://pobb.in/zPBgU7oGZTTe" },
          { label: "Spicysushi 終局 POB（無 Mageblood）＋製作教學", url: "https://pobb.in/DiZ6f68Dud3b" },
          { label: "Spicysushi 練功影片", url: "https://www.youtube.com/watch?v=tDZIMC5pvj0" },
          { label: "goratha POB（3.25 冰霜新星，早期／紅圖／終局三套）", url: "https://pobb.in/CczyTCadnJaW" },
          { label: "惡魔貓：3.30 魔幻火雨章節拓荒表格", url: "https://docs.google.com/spreadsheets/d/1p1ynqtbYmDRj37AFwT5eNN6njZghUCMewLvNA-evVO4/edit?gid=2109325450" },
        ],
      },

      // ------------------------------------------------------------------
      "聖堂武僧-聖宗-魔力流-天雷之珠-軌跡": {
        hero: "Ball Lightning",
        subtitle: "Archmage Ball Lightning of Orbiting Hierophant｜魔幻天雷之珠．軌跡聖宗",
        basis: "Palsteron 的影片與 POB 為 3.24（含 A1～A10 每章天賦樹）；終局技能組來自惡魔貓表格附的 Ball Lightning of Orbiting POB（67 等天賦）；章節流程沿用惡魔貓 3.30 的魔幻火雨開荒。舊版數值與 3.30 可能有差異，請以遊戲內為準。",
        summary: [
          "{{Ball Lightning of Orbiting}} 的雷球會環繞在角色身邊，走到哪電到哪；搭配 {{Archmage}} 的大量點傷與 {{Slower Projectiles}} 延長命中次數，刷圖非常順。",
          "表格評價：刷圖 中／打王 中／總評 中。",
        ],
        pros: ["環繞雷球邊走邊清，刷圖不用瞄準", "與其他魔幻流共用裝備，轉換成本低", "Palsteron 有每一章的天賦樹可以照抄"],
        cons: ["單體要貼近王，打王需要走位", "主要參考資料版本較舊（3.24～3.25）", "需要轉換寶石（軌跡）"],
        mechanics: [
          "Palsteron：章節前期隨意升級（推薦 {{Rolling Magma}}），A4 重洗成閃電，A10 後重洗成魔力堆疊。Lv28 拿到天雷之珠、Lv31 可接 {{Archmage}}。",
          "惡魔貓表格標題即「魔幻火雨轉咒術枯萎／天雷之珠軌跡」——也可以照火雨流程走完章節，再換成天雷之珠．軌跡。",
        ],
        ascendancy: [
          { lab: "普通迷宮", node: "{{Arcane Blessing}}", note: "惡魔貓順序" },
          { lab: "殘酷迷宮", node: "{{Divine Guidance}}", note: "" },
          { lab: "無情迷宮", node: "{{Sanctuary of Thought}}", note: "或 {{Conviction of Power}}" },
          { lab: "終極迷宮", node: "{{Illuminated Devotion}}", note: "Palsteron／67 等 POB 的選擇" },
        ],
        acts: "archmageActs",
        actsIntro: "兩種走法：① 照惡魔貓的魔幻火雨流程走完章節，A10 後換成天雷之珠．軌跡；② 照 Palsteron 的 3.24 練功 POB：A1～A3 隨意（熔岩翻騰），<b>A4 重洗成閃電</b>使用 {{Ball Lightning}}，A10 後再重洗成魔力流。",
        actSwitch: {
          A4: "【Palsteron 路線】A4 重洗成閃電：{{Ball Lightning}}＋{{Pinpoint}}＋{{Slower Projectiles}}＋{{Unleash}}，副技能 {{Orb of Storms}}＋{{Power Charge On Critical}}＋{{Added Lightning Damage}}＋{{Culling Strike}}。",
          A10: "【轉換時機】打完奇塔弗、重洗成魔力流後換成 {{Ball Lightning of Orbiting}} 6 連（見下方連結）。",
        },
        stages: [
          {
            title: "Palsteron 練功組", when: "A4～A10（閃電路線）",
            links: [
              { slot: "主技能", gems: ["*Ball Lightning", "Pinpoint", "Slower Projectiles", "Unleash"] },
              { slot: "副技能", gems: ["Orb of Storms", "Power Charge On Critical", "Added Lightning Damage", "Culling Strike"] },
              { slot: "光環", gems: ["Grace", "Haste"] },
              { slot: "移動", gems: ["Shield Charge", "Faster Attacks", "Momentum"] },
              { slot: "詛咒", gems: ["Arcanist Brand", "Wave of Conviction", "Conductivity"] },
              { slot: "位移", gems: ["Frostblink"] },
            ],
          },
          ...LEVELING_STAGES,
          {
            title: "早期輿圖（Palsteron Early）", when: "白圖／黃圖",
            links: [
              { slot: "胸甲 6 連", sockets: "BBBBBB", gems: ["*Ball Lightning", "Archmage", "Slower Projectiles", "Spell Echo", "Inspiration", "Lightning Penetration"] },
              { slot: "手套", gems: ["Frostblink of Wintry Blast", "Faster Casting", "Culling Strike"], note: "還沒有轉換霜漣之瞬時改用 {{Lightning Warp}}＋{{Faster Casting}}＋{{Less Duration}}＋{{Swift Affliction}}" },
              { slot: "武器 2", gems: ["Wave of Conviction", "Arcanist Brand", "Conductivity"] },
              { slot: "鞋子", gems: ["Eternal Blessing", "Purity of Elements"] },
              { slot: "武器 1", gems: ["Clarity", "Arrogance"] },
              { slot: "頭盔", gems: ["Arcane Cloak", "Arcane Surge", "Increased Duration"] },
              { slot: "其他", gems: ["Enduring Cry"] },
            ],
          },
          {
            title: "軌跡完成形（67 等天賦 POB）", when: "紅圖",
            links: [
              { slot: "胸甲 6 連", sockets: "BBBBBB", gems: ["*Ball Lightning of Orbiting", "Inspiration", "Spell Echo", "Archmage", "Lightning Penetration", "Slower Projectiles"] },
              { slot: "頭盔", sockets: "BBBB", gems: ["Arcane Cloak", "Arcane Surge", "Increased Duration", "Automation"] },
              { slot: "鞋子", sockets: "BBBB", gems: ["Frostblink of Wintry Blast", "Frostblink", "Archmage", "Faster Casting"] },
              { slot: "手套", gems: ["Grace", "Wrath", "Eternal Blessing"] },
              { slot: "武器 1", gems: ["Punishment", "Hex Bloom"] },
              { slot: "武器 2", gems: ["Frost Shield", "Sigil of Power", "Increased Duration"] },
            ],
          },
        ],
        raresIntro: "與其他魔幻流相同：<b>每個部位都要「生命＋魔力」</b>。Palsteron 的早期黃裝只要求生命、魔力、抗性與兩把施速法杖，門檻很低。",
        rares: ARCHMAGE_RARES,
        phases: [
          {
            title: "① 過完章節（Palsteron Early）", when: "白圖",
            desc: ["全身黃裝：生命＋魔力＋抗性；雙持 Profane Wand（施速 32～35%、+88 魔力、50～66% 法傷）。"],
            items: [
              { slot: "戒指", name: "Valako's Sign", why: "對感電敵人增傷＋偷取" },
              { slot: "武器 ×2", name: "Profane Wand：施速、+88 魔力、法傷", rare: true },
              { slot: "胸甲", name: "Widowsilk Robe 6 連：能量護盾、抗性、+45 魔力", rare: true },
              { slot: "項鍊", name: "Citrine Amulet：塗油 {{Mind Drinker}}、+67 魔力、生命、抗性", rare: true },
            ],
          },
          {
            title: "② 中期（Palsteron Mid）", when: "黃圖～紅圖",
            items: [
              { slot: "頭盔", name: "Mindspiral", why: "15% 最大魔力轉能量護盾" },
              { slot: "武器 ×2", name: "Profane Wand：+124 魔力、67～82% 法傷、施速", rare: true },
            ],
          },
          {
            title: "③ 紅圖（軌跡 POB）", when: "T11～T16",
            items: [
              { slot: "武器", name: "Prophecy Wand：69% 法傷、23% 施速、104% 法術暴擊、+104 魔力", rare: true },
              { slot: "武器 2", name: "Profane Wand：31% 施速、+194 魔力", rare: true },
              { slot: "胸甲", name: "Destroyer Regalia 6 連：+111 生命、抗性", rare: true },
              { slot: "戒指 ×2", name: "Coral Ring：+85 生命、14% 施速、+8% 全抗", rare: true },
              { slot: "項鍊", name: "Blue Pearl Amulet：塗油 Alacrity、魔力回復、施速", rare: true },
            ],
          },
          {
            title: "④ 終局", when: "異界之石／Uber",
            desc: ["可參考同為魔幻聖宗的冰霜新星終局裝：{{Atziri's Foible}}、{{Cloak of Defiance}}、{{Kitava's Thirst}} 等，並依天雷之珠的需求保留 {{Slower Projectiles}}。"],
          },
        ],
        sources: [
          { label: "Palsteron：[3.24] Archmage Ball Lightning Hierophant（YouTube）", url: "https://youtu.be/RRzgay9ekqo" },
          { label: "Palsteron 練功 POB（A1～A10 每章天賦）", url: "https://pobb.in/LypnRCncMivZ" },
          { label: "Palsteron Early POB", url: "https://pobb.in/yyl0QU4jIvHg" },
          { label: "Palsteron Mid POB", url: "https://pobb.in/ssP0dtTCJS1C" },
          { label: "Ball Lightning of Orbiting POB（惡魔貓表格附的 67 等天賦）", url: "https://pobb.in/Py0735IrTIY5" },
          { label: "Palsteron 練功影片", url: "https://youtu.be/I3dWWMDoOKs" },
          { label: "惡魔貓：3.30 魔幻火雨轉咒術枯萎／天雷之珠軌跡章節拓荒表格", url: "https://docs.google.com/spreadsheets/d/1p1ynqtbYmDRj37AFwT5eNN6njZghUCMewLvNA-evVO4/edit?gid=2109325450" },
        ],
      },

      // ------------------------------------------------------------------
      "聖堂武僧-聖宗-魔力流-閃電新星．行進": {
        hero: "Shock Nova of Procession",
        subtitle: "Archmage Shock Nova of Procession Hierophant｜魔幻閃電新星．行進聖宗",
        basis: "主要依據 DapperDD 的 <b>3.30</b> 攻略與 POB（練功／前期／中期／終局，作者表示 3.30 版本未變動）；逐章連結參考 Lexyu 的 3.28 POB（poe-vault 已標註平衡調整後不再推薦）。章節路線沿用惡魔貓的魔幻火雨流程。",
        summary: [
          "{{Shock Nova of Procession}}（3.28 新增的轉換寶石）會在前方一路產生閃電新星，搭配 {{Archmage}} 的魔力轉閃電點傷刷圖。DapperDD 的 3.30 配置把 {{Crackling Lance}} 和閃電新星放在同一組 6 連：<b>閃電新星清圖、碎裂光槍打王</b>（依情況只按其中一個）。",
          "表格評價：刷圖 中／打王 中／總評 中（原表未附教學連結，以下為另外找到的來源）。",
        ],
        pros: ["3.30 有現役作者更新的 POB", "前期全靠便宜傳奇（{{Stone of Lazhwar}}、{{Mindspiral}}、{{Valako's Sign}} 都約 1c）", "法術格擋＋魔力護盾，坦度不錯"],
        cons: ["3.29 削弱：魔幻輔助 10–16% → 8–14%、純閃電法術魔力消耗 +25%、閃電新星．行進傷害範圍改為 105–948", "Lexyu 版本已被標為不推薦，建議以 DapperDD 3.30 版本為主", "要兩個主技能切換（清圖／打王）"],
        mechanics: [
          "DapperDD 的提醒：到 A3 時會有三種技能可選（{{Crackling Lance}}、{{Shock Nova of Procession}}、{{Firestorm}}），<b>不要同時插多個主技能</b>，挑一個用就好。",
          "{{Rainbowstride}} 超過 5–10c 就買黃鞋，改點左上「秘術守護」補法術格擋（3 點）。",
          "ds_lily（Mobalytics）建議大約 3000 魔力（Lv65–70）才轉閃電新星；Peuget2 則在 Lv44 轉。",
        ],
        ascendancy: [
          { lab: "普通迷宮", node: "{{Divine Guidance}}", note: "DapperDD／Lexyu 都先點這個" },
          { lab: "殘酷迷宮", node: "{{Sanctuary of Thought}}", note: "" },
          { lab: "無情迷宮", node: "{{Arcane Blessing}}", note: "" },
          { lab: "終極迷宮", node: "{{Conviction of Power}}", note: "" },
        ],
        acts: "archmageActs",
        actsIntro: "兩種走法都可以：① <b>火雨路線</b>：照惡魔貓流程（熔岩翻騰 → A3 魔幻烈焰風暴），Lv44～70 之間再轉閃電新星（Peuget2、ds_lily 的做法）；② <b>閃電路線</b>：照 DapperDD／Lexyu，一開始就用閃電技能，每章的連結寫在下方綠框。",
        actSwitch: {
          A1: "【閃電路線】{{Spark}} 起手，之後換 {{Arc}}（Lexyu），或 DapperDD 的 {{Lightning Tendrils}}＋{{Arcane Surge}}＋{{Added Lightning Damage}}；副技能 {{Orb of Storms}}，移動 {{Shield Charge}}，光環 {{Clarity}}。",
          A2: "【閃電路線】{{Arc}}＋{{Arcane Surge}}＋{{Added Lightning Damage}}（或 {{Combustion}}），加上 {{Wave of Conviction}}、{{Arcane Cloak}}、{{Herald of Thunder}}。",
          A3: "【閃電路線】4 連改為 {{Arc}}＋{{Arcane Surge}}＋{{Archmage}}＋{{Lightning Penetration}}；DapperDD 在這裡選一個主技能（{{Crackling Lance}}／{{Shock Nova of Procession}}／{{Firestorm}}）接 {{Archmage}}＋{{Arcane Surge}}。{{Arcane Cloak}}＋{{Automation}}＋{{More Duration}}，{{Frostblink}}＋{{Conductivity}}。",
          A4: "【閃電路線】主技能加上 {{Spell Echo}}；光環 {{Eternal Blessing}}＋{{Purity of Elements}}，並放 {{Sigil of Power}}。",
          A5: "【閃電路線】A5～A10 主技能逐步做到 6 連：{{Arc}}＋{{Archmage}}＋{{Spell Echo}}＋{{Arcane Surge}}＋{{Lightning Penetration}}＋{{Added Lightning Damage}}。DapperDD 在 A5～A7（Lv42～52）點 {{Mind Over Matter}}。",
          A11: "【轉換時機】Lexyu 在早期輿圖轉 {{Shock Nova of Procession}}；DapperDD 在 Lv65～75 改用「前期 POB」。",
        },
        stages: [
          {
            title: "前期（DapperDD Early）", when: "白圖～黃圖",
            links: [
              { slot: "胸甲 6 連", sockets: "BBBBBB", gems: ["*Shock Nova of Procession", "Crackling Lance", "Arcane Surge", "Spell Echo", "Intensify", "Archmage", "Inspiration"], note: "清圖用閃電新星、打王用碎裂光槍" },
              { slot: "武器 1", sockets: "BBB", gems: ["Purity of Elements", "Eternal Blessing", "Conductivity"] },
              { slot: "副手", sockets: "BBB", gems: ["Arcane Cloak", "Automation", "More Duration"] },
              { slot: "鞋子", sockets: "BBBB", gems: ["Faster Casting", "Archmage", "Frostblink of Wintry Blast", "Spell Echo"] },
              { slot: "頭盔", sockets: "BBBB", gems: ["Sigil of Power", "More Duration", "Increased Area of Effect", "Frost Shield"] },
              { slot: "手套", sockets: "BBBB", gems: ["Clarity", "Arrogance", "Faster Casting", "Flame Dash"] },
            ],
          },
          {
            title: "中期（DapperDD Mid）", when: "紅圖",
            links: [
              { slot: "胸甲 6 連", gems: ["*Crackling Lance", "Spell Echo", "Archmage", "Overloaded Intensity", "Intensify", "Inspiration", "?Shock Nova of Procession"] },
              { slot: "頭盔", gems: ["Arcanist Brand", "Assassin's Mark", "Conductivity", "Elemental Weakness"] },
              { slot: "武器 1", gems: ["Purity of Elements", "Eternal Blessing", "Frost Shield"] },
              { slot: "手套", gems: ["Clarity", "Arrogance", "Flame Dash", "Sigil of Power"] },
            ],
          },
          {
            title: "終局（DapperDD End）", when: "異界之石／Uber",
            links: [
              { slot: "胸甲 6 連", gems: ["*Shock Nova of Procession", "Crackling Lance", "Greater Spell Echo", "Archmage", "Intensify", "Overloaded Intensity", "Arcane Surge"] },
              { slot: "手套", gems: ["Frostblink of Wintry Blast", "Faster Casting", "Archmage", "Arcane Surge"] },
              { slot: "鞋子", gems: ["Flame Dash", "Frost Shield", "Eternal Blessing", "Wrath"] },
              { slot: "副手", gems: ["Arcane Cloak", "More Duration", "Automation"] },
              { slot: "武器 1", gems: ["Sigil of Power", "Arrogance", "Clarity"] },
              { slot: "頭盔", gems: ["Conductivity", "Arcanist Brand", "Elemental Weakness"] },
            ],
          },
          {
            title: "Lexyu 純閃電新星（暴擊版）", when: "T16（參考）",
            links: [
              { slot: "胸甲 6 連", gems: ["*Shock Nova of Procession", "Archmage", "Spell Echo", "Arcane Surge", "Increased Critical Damage", "Increased Critical Strikes"] },
              { slot: "頭盔", gems: ["Conductivity", "Elemental Weakness", "Punishment", "Enfeeble"] },
              { slot: "移動", gems: ["Shield Charge", "Faster Attacks", "Mark On Hit", "Assassin's Mark"] },
              { slot: "光環", gems: ["Eternal Blessing", "Vaal Haste"] },
            ],
          },
        ],
        raresIntro: "與其他魔幻流相同：<b>每個部位都要「生命＋魔力」</b>。Odealo 的優先順序：抗性補滿 → 最大魔力 → 最大生命 → 施放速度 → 暴擊傷害 → 法術傷害 → 混沌抗性。手套優先找「命中施加閃電曝曬」與「震懾」的 Eldritch 隱含。",
        rares: [
          {
            slot: "武器（法杖）", sockets: "BBB", base: ["Profane Wand", "Heathen Wand"],
            stats: [
              { k: "法術傷害", v: "54～109%", must: true },
              { k: "施放速度", v: "29～44%", must: true },
              { k: "最大魔力", v: "+89～+172", must: true },
              { k: "法術暴擊率", v: "78%+（中期起）" },
              { k: "雙倍傷害機率（工藝）", v: "4～5%" },
            ],
          },
          {
            slot: "副手（盾）", sockets: "BBB", base: ["Champion Kite Shield", "Titanium Spirit Shield"],
            stats: [
              { k: "格擋率提高", v: "74～80%", must: true },
              { k: "法術格擋", v: "11% 以上" },
              { k: "最大生命／魔力", v: "+69～+103" },
              { k: "元素／混沌抗性", v: "補缺口" },
            ],
          },
          {
            slot: "胸甲（6 連）", sockets: "BBBBBB", base: ["Elegant Ringmail", "Twilight Regalia"],
            stats: [
              { k: "最大生命", v: "+174～+186", must: true },
              { k: "最大魔力", v: "+64" },
              { k: "法術暴擊傷害", v: "+22%（後期）" },
              { k: "抗性", v: "補缺口" },
            ],
            note: "中期可用 {{Inpulsa's Broken Heart}}（感電怪死亡爆炸，刷圖很爽）。",
          },
          {
            slot: "手套", sockets: "BBBB", base: ["Warlock Gloves", "Conjurer Gloves"],
            stats: [
              { k: "命中施加閃電曝曬（Eldritch）", v: "-11～-12%", must: true },
              { k: "最大生命", v: "+99～+117", must: true },
              { k: "最大魔力", v: "+64～+70", must: true },
              { k: "範圍效果／範圍傷害（工藝）", v: "10～16%" },
              { k: "15% 機率震懾（Eldritch）", v: "後期" },
            ],
          },
          {
            slot: "項鍊", base: ["Turquoise Amulet", "Jade Amulet"],
            stats: [
              { k: "塗油：{{As The Mountain}}（前中期）／{{Whispers of Doom}}（終局）", v: "Allocates", must: true },
              { k: "最大生命", v: "+78～+102", must: true },
              { k: "最大魔力", v: "+70", must: true },
              { k: "施放速度", v: "20%" },
              { k: "全域暴擊傷害（終局）", v: "+35～41%" },
            ],
          },
          {
            slot: "戒指／腰帶", base: ["Amethyst Ring", "Leather Belt"],
            stats: [
              { k: "最大生命", v: "+73～+130", must: true },
              { k: "最大魔力", v: "+21～+60" },
              { k: "混沌抗性", v: "+27～+40%" },
              { k: "+1 最小耐力球", v: "好用" },
              { k: "力量／敏捷（補屬性）", v: "+30～+53" },
            ],
          },
        ],
        phases: [
          {
            title: "① 過完章節（DapperDD 起手傳奇）", when: "Lv65～80｜白圖",
            desc: ["DapperDD：這套起手用很多傳奇，但都非常便宜，依序購買。"],
            items: [
              { slot: "項鍊", name: "Stone of Lazhwar", why: "第一個買，約 1c；施速＋法術格擋＋魔力" },
              { slot: "頭盔", name: "Mindspiral", why: "約 1c；最大魔力轉能量護盾，生存大幅提升" },
              { slot: "戒指", name: "Valako's Sign", why: "約 1c；最簡單的偷取來源（3.29 起 +100～150 魔力）" },
              { slot: "鞋子", name: "Rainbowstride", why: "法術格擋＋魔力；超過 5–10c 就買黃鞋" },
              { slot: "武器", name: "Heathen Wand：29% 施速、54% 法傷、+89 魔力", rare: true },
              { slot: "副手", name: "Champion Kite Shield：77% 格擋率", rare: true },
              { slot: "胸甲", name: "Elegant Ringmail 6 連：+174 生命", rare: true },
            ],
          },
          {
            title: "② 中期", when: "黃圖～紅圖",
            items: [
              { slot: "胸甲", name: "Inpulsa's Broken Heart", why: "感電怪死亡爆炸，清圖大提升" },
              { slot: "戒指", name: "Anathema", why: "詛咒上限＝最大暴擊球數" },
              { slot: "手套", name: "Warlock Gloves：閃電曝曬、感電擴散、+113 生命、+64 魔力", rare: true },
              { slot: "項鍊", name: "Turquoise Amulet：塗油 {{As The Mountain}}、20% 施速、+78 生命、+70 魔力", rare: true },
            ],
          },
          {
            title: "③ 終局（DapperDD End）", when: "異界之石／Uber",
            desc: ["DapperDD 終局約 3178 生命／4667 能量護盾／6966 魔力，碎裂光槍約 45M DPS。"],
            items: [
              { slot: "鞋子", name: "Skyforth", why: "暴擊得暴擊球、保留效率、暈眩門檻改以魔力計算" },
              { slot: "腰帶", name: "Darkness Enthroned", why: "兩個深淵插槽，珠寶效果 +100%" },
              { slot: "戒指", name: "Berek's Respite", why: "擊殺感電敵人時擴散感電" },
              { slot: "武器", name: "Profane Wand：109% 法傷、44% 施速、+172 魔力、雙倍傷害", rare: true },
              { slot: "副手", name: "Titanium Spirit Shield：法術格擋、+103 生命、全抗", rare: true },
              { slot: "胸甲", name: "Twilight Regalia（破裂）：+186 生命、+22% 法術暴傷", rare: true },
            ],
          },
          {
            title: "④ 其他終局選項", when: "高預算",
            desc: ["研究來源提到的升級：{{Greater Spell Echo}}、轉暴擊、{{Forbidden Flesh}}＋{{Forbidden Flame}}（審判者「狂熱之器」，3.29 已削弱）、{{Kitava's Thirst}}＋{{Anathema}} 疊詛咒、穢生 {{Cloak of Defiance}}、{{Svalinn}}、{{Mageblood}}、{{Watcher's Eye}}（清晰詞綴）。"],
          },
        ],
        sources: [
          { label: "DapperDD：PoE 3.30 Archmage Hierophant Crackling Lance/Shock Nova League Starter Guide（YouTube）", url: "https://www.youtube.com/watch?v=vYTrCTsUxm0" },
          { label: "DapperDD 練功 POB（Act 1～10 天賦）", url: "https://pobb.in/Tidm0DokphXW" },
          { label: "DapperDD 前期 POB", url: "https://pobb.in/eqhQq_ntYt5V" },
          { label: "DapperDD 中期 POB", url: "https://pobb.in/dqgKXrPUT6Ak" },
          { label: "DapperDD 終局 POB", url: "https://pobb.in/RXjcnnu1hAv1" },
          { label: "Lexyu（poe-vault）Shock Nova of Procession Hierophant 3.28（已標註不推薦）", url: "https://www.poe-vault.com/guides/shock-nova-of-procession-hierophant-build-guide" },
          { label: "Lexyu POB（Act 1～10 逐章技能與天賦）", url: "https://pobb.in/MUd6RZ69d268" },
          { label: "Odealo：[3.29] Shock Nova of Procession Hierophant", url: "https://odealo.com/articles/shock-nova-of-procession-hierophant" },
          { label: "Mobalytics（ds_lily，3.28）", url: "https://mobalytics.gg/poe/builds/shock-nova-of-procession-archmage" },
          { label: "Mobalytics（Peuget2，3.28）", url: "https://mobalytics.gg/poe/builds/shock-nova-heirophant-league-starter" },
          { label: "3.30.0 官方改版說明", url: "https://www.pathofexile.com/forum/view-thread/4013680" },
        ],
      },
    },
  };
})();
