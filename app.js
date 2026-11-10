/* 雪國手帖：2027 三月滑雪計畫 — 互動邏輯與雪場資料 */
const yen=n=>'¥'+Math.round(n).toLocaleString('en-US');
const ntd=n=>'NT$'+Math.round(n).toLocaleString('en-US');
const dots=v=>'●'.repeat(v)+'<i>'+'●'.repeat(5-v)+'</i>';
const regionName=r=>r==='hokkaido'?'北海道':'本州';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tagOf=q=>q?'<span class="off">查詢</span>':'<span class="est">估</span>';
const hm=m=>{const h=Math.floor(m/60),r=m%60;return h?(r?`${h}h${String(r).padStart(2,'0')}`:`${h}h`):`${r}m`;};

const CRIT=[{k:'beg',n:'初學友善'},{k:'zh',n:'中文教學'},{k:'acc',n:'交通方便'},{k:'mar',n:'三月雪況'},{k:'price',n:'價格親民'},{k:'onsen',n:'溫泉度假'},{k:'fun',n:'雪場外好玩'}];

/* 交通路段：k=類型 m=分鐘 c=單程每人日圓 q=是否查詢值 */
const L={
  kix:{k:'rail',t:'大阪市區 → 關西機場',m:50,c:1000,q:false},
  chk:{k:'walk',t:'報到、安檢、候機',m:70,c:0,q:true},
  lcc:{k:'plane',t:'關西 → 新千歲（廉航，含託運行李）',m:150,c:10000,q:false},
  jal:{k:'plane',t:'關西 → 新千歲（JAL Japan Explorer Pass，含行李）',m:150,c:10800,q:true},
  shin:{k:'walk',t:'大阪市區 → 新大阪',m:15,c:0,q:true}
};
const R=[
 {id:'rusutsu',zh:'留壽都',ja:'RUSUTSU',region:'hokkaido',pref:'北海道・虻田郡',tag:'一個度假村包辦所有事',map:'ルスツリゾート',art:'rusutsu',
  s:{beg:4,zh:5,acc:3,mar:5,price:2,onsen:4,fun:3},lift:16700,liftOff:true,liftNote:'窗口價，全日本最貴等級',season:'約至 4 月上旬',snow:['◎','◎','○'],
  routes:[{n:'飛機＋巴士（廉航）',legs:[L.kix,L.chk,L.lcc,{k:'bus',t:'新千歲 → 留壽都（巴士）',m:105,c:4500,q:false}]},
          {n:'飛機＋巴士（JAL 外國旅客票）',legs:[L.kix,L.chk,L.jal,{k:'bus',t:'新千歲 → 留壽都（巴士）',m:105,c:4500,q:false}]}],
  stay:{near:{w:'留壽都度假村',lodge:18000},far:null,farNote:'最近的洞爺湖溫泉開車約 40 分鐘，沒有方便的公車。大家都住度假村。'},
  plus:['三座山 37 條雪道，人比二世谷少','園區內有官方中文雪校，可用魔毯區教新手','住宿、溫泉、餐廳都在度假村裡'],
  minus:['雪票是 8 座裡最貴的','園區外幾乎沒有地方可逛']},
 {id:'niseko',zh:'二世谷',ja:'NISEKO',region:'hokkaido',pref:'北海道・俱知安',tag:'最國際化，餐廳酒吧最多',map:'ニセコ東急 グラン・ヒラフ',art:'niseko',
  s:{beg:4,zh:5,acc:3,mar:4,price:1,onsen:4,fun:5},lift:12600,liftOff:true,liftNote:'3/1–22 價格，3/23 起降到 ¥8,800',season:'比羅夫至 5/5',snow:['◎','◎','○'],
  routes:[{n:'飛機＋巴士（廉航）',legs:[L.kix,L.chk,L.lcc,{k:'bus',t:'新千歲 → 比羅夫（巴士）',m:140,c:5000,q:false}]},
          {n:'飛機＋巴士（JAL 外國旅客票）',legs:[L.kix,L.chk,L.jal,{k:'bus',t:'新千歲 → 比羅夫（巴士）',m:140,c:5000,q:false}]}],
  stay:{near:{w:'比羅夫（滑進滑出）',lodge:22000},far:{w:'俱知安町市區',lodge:9000,commute:1000,hrs:0.6,q:false,note:'巴士約 15 分鐘'}},
  plus:['中英文教練最多，課程選擇多','夜滑開到 3/22','比羅夫村有很多餐廳和酒吧'],
  minus:['住宿和雪票都偏貴','熱門區人多，要早點去排纜車']},
 {id:'furano',zh:'富良野',ja:'FURANO',region:'hokkaido',pref:'北海道・富良野市',tag:'三月底雪況最穩的內陸乾雪',map:'富良野スキー場',art:'furano',
  s:{beg:4,zh:3,acc:3,mar:5,price:3,onsen:4,fun:3},lift:8500,liftOff:false,liftNote:'26-27 尚未公布',season:'至 5 月上旬',snow:['◎','◎','◎'],
  routes:[{n:'飛機＋巴士（廉航）',legs:[L.kix,L.chk,L.lcc,{k:'bus',t:'新千歲 → 富良野（巴士）',m:130,c:5000,q:false}]},
          {n:'飛機＋JR（廉航，可用北海道周遊券）',legs:[L.kix,L.chk,L.lcc,{k:'rail',t:'新千歲 → 札幌 → 富良野（JR）',m:170,c:5500,q:false}]}],
  stay:{near:{w:'新富良野王子飯店（滑進滑出）',lodge:14000},far:{w:'富良野市區',lodge:8000,commute:1500,hrs:0.5,q:false,note:'車程約 10 分鐘'}},
  plus:['初中高雪道比例 4：4：2','新富良野王子飯店可滑進滑出','離富良野市區約 10 分鐘'],
  minus:['中文教練比較少','新千歲過去要 2 小時多']},
 {id:'kiroro',zh:'Kiroro',ja:'KIRORO',region:'hokkaido',pref:'北海道・赤井川村',tag:'雪量大，離札幌小樽近',map:'キロロリゾート',art:'kiroro',
  s:{beg:4,zh:4,acc:4,mar:5,price:2,onsen:4,fun:2},lift:11000,liftOff:false,liftNote:'26-27 尚未公布',season:'至 5 月上旬',snow:['◎','◎','◎'],
  routes:[{n:'飛機＋巴士（廉航）',legs:[L.kix,L.chk,L.lcc,{k:'bus',t:'新千歲 → Kiroro（巴士）',m:100,c:4000,q:false}]},
          {n:'飛機＋巴士（JAL 外國旅客票）',legs:[L.kix,L.chk,L.jal,{k:'bus',t:'新千歲 → Kiroro（巴士）',m:100,c:4000,q:false}]}],
  stay:{near:{w:'Kiroro 度假村',lodge:20000},far:{w:'小樽市區',lodge:8000,commute:3000,hrs:1.5,q:false,note:'付費巴士約 40 分鐘'}},
  plus:['降雪量大，三月到五月都有好雪','離小樽約 40 分鐘，可以順便逛','有中文、英文課程'],
  minus:['度假村型，周邊沒有小鎮','山區天氣多變，纜車偶爾停駛']},
 {id:'tomamu',zh:'TOMAMU',ja:'星野 TOMAMU',region:'hokkaido',pref:'北海道・占冠村',tag:'度假村設施最完整',map:'星野リゾート トマム スキー場',art:'tomamu',
  s:{beg:5,zh:3,acc:4,mar:5,price:3,onsen:5,fun:3},lift:9000,liftOff:false,liftNote:'26-27 尚未公布',season:'約至 4 月上旬',snow:['◎','◎','○'],
  routes:[{n:'飛機＋JR（廉航，可用北海道周遊券）',legs:[L.kix,L.chk,L.lcc,{k:'rail',t:'新千歲 → TOMAMU（JR）',m:90,c:5000,q:false}]},
          {n:'飛機＋JR（JAL 外國旅客票）',legs:[L.kix,L.chk,L.jal,{k:'rail',t:'新千歲 → TOMAMU（JR）',m:90,c:5000,q:false}]}],
  stay:{near:{w:'星野 TOMAMU 度假村',lodge:18000},far:null,farNote:'TOMAMU 在山裡，最近的城鎮開車也要 30 分鐘以上。大家都住度假村。'},
  plus:['29 條雪道，初學到高級都有','新千歲坐 JR 就到，不用轉巴士','冬天有冰之村，滑雪以外也好玩'],
  minus:['度假村內吃飯消費偏高','星宇套裝是從台灣出發，大阪出發用不到']},
 {id:'gala',zh:'GALA湯澤',ja:'GALA YUZAWA',region:'honshu',pref:'新潟縣・湯澤町',tag:'下了新幹線就是雪場',map:'GALA湯沢スキー場',art:'gala',
  s:{beg:5,zh:2,acc:4,mar:3,price:4,onsen:3,fun:3},lift:8000,liftOff:true,liftNote:'網路購買 ¥7,500',season:'雪道至 5/5',snow:['○','○','△'],
  routes:[{n:'新幹線（經東京）',legs:[L.shin,{k:'rail',t:'新大阪 → 東京 → 越後湯澤（新幹線）',m:240,c:18590,q:true},{k:'rail',t:'越後湯澤 → GALA湯澤',m:5,c:0,q:false}]}],
  stay:{near:{w:'越後湯澤站周邊（溫泉街）',lodge:10000,commute:0,hrs:0.3},far:{w:'東京，每天新幹線來回',lodge:9000,commute:13800,hrs:2.8,q:false,note:'東京↔越後湯澤單程約 ¥6,900，可用東京廣域周遊券'}},
  plus:['日本唯一有自己新幹線站的雪場','雪票 ¥8,000，是比較裡最便宜的之一','出站就能租全套裝備'],
  minus:['本季南區停止營業，雪道變少','週末日本人一日遊很擠','三月下旬雪容易變濕重']},
 {id:'karuizawa',zh:'輕井澤王子',ja:'KARUIZAWA PRINCE',region:'honshu',pref:'長野縣・輕井澤町',tag:'最適合第一次碰雪的人',map:'軽井沢プリンスホテルスキー場',art:'karuizawa',
  s:{beg:5,zh:4,acc:4,mar:2,price:4,onsen:3,fun:5},lift:8000,liftOff:true,liftNote:'依日期 ¥8,000–13,000',season:'至 3/31',snow:['○','△','△'],
  routes:[{n:'新幹線（經東京）',legs:[L.shin,{k:'rail',t:'新大阪 → 東京 → 輕井澤（新幹線）',m:255,c:18600,q:true},{k:'walk',t:'輕井澤站 → 雪場（步行）',m:10,c:0,q:true}]},
          {n:'雷鳥號＋北陸新幹線（北陸拱型周遊券）',legs:[{k:'rail',t:'大阪 → 敦賀（特急雷鳥號）',m:80,c:0,q:false},{k:'rail',t:'敦賀 → 輕井澤（北陸新幹線）',m:190,c:0,q:false},{k:'walk',t:'輕井澤站 → 雪場（步行）',m:10,c:0,q:true}],pass:17500,passNote:'周遊券 ¥35,000 ÷ 去回 2 趟'}],
  stay:{near:{w:'輕井澤站周邊',lodge:12000,commute:0,hrs:0.3},far:{w:'東京，每天新幹線來回',lodge:9000,commute:10980,hrs:2.5,q:true,note:'自由席單程 ¥5,490，可用東京廣域周遊券'}},
  plus:['14 條雪道裡 8 條是初級道','場內有兩間中文雪校','車站旁邊就是 Outlet，回程可停東京'],
  minus:['以人工雪為主，雪場偏小','3/31 就收，三月下旬雪況差','沒有夜滑']},
 {id:'iwatake',zh:'白馬岩岳',ja:'HAKUBA IWATAKE',region:'honshu',pref:'長野縣・白馬村',tag:'北阿爾卑斯山景最美',map:'白馬岩岳スノーフィールド',art:'iwatake',
  s:{beg:3,zh:3,acc:3,mar:2,price:5,onsen:3,fun:3},lift:11100,liftOff:true,liftNote:'白馬谷 10 座雪場通用一日券',season:'約至 3 月下旬',snow:['○','△','△'],
  routes:[{n:'JR 特急（經名古屋、松本）',legs:[L.shin,{k:'rail',t:'新大阪 → 名古屋 → 松本 → 白馬（轉 3 次）',m:297,c:12280,q:true},{k:'bus',t:'白馬 → 岩岳（接駁巴士）',m:20,c:0,q:false}]},
          {n:'高速巴士',legs:[{k:'bus',t:'大阪 → 白馬（高速巴士）',m:470,c:7700,q:true},{k:'bus',t:'白馬 → 岩岳（接駁巴士）',m:20,c:0,q:false}]},
          {n:'雷鳥號＋北陸新幹線＋巴士（北陸拱型周遊券）',legs:[{k:'rail',t:'大阪 → 敦賀（特急雷鳥號）',m:80,c:0,q:false},{k:'rail',t:'敦賀 → 長野（北陸新幹線）',m:150,c:0,q:false},{k:'bus',t:'長野 → 白馬（特急巴士）',m:70,c:2500,q:false}],pass:17500,passNote:'周遊券 ¥35,000 ÷ 去回 2 趟'}],
  stay:{near:{w:'岩岳山腳民宿',lodge:11000,commute:0,hrs:0.2},far:{w:'長野市區',lodge:8000,commute:5000,hrs:2.6,q:false,note:'特急巴士單程約 70 分鐘'}},
  plus:['有 3.3 公里初級道，平均坡度 11 度','坐巴士從大阪直達，交通費最省','可以用白馬谷通用票換雪場滑'],
  minus:['白馬谷最低的雪場，回暖時雪況不穩','JR 要轉 3 次，巴士要坐快 8 小時']}
];
R.forEach(r=>r.routes.forEach(rt=>{rt.min=rt.legs.reduce((a,l)=>a+l.m,0);rt.cost=(rt.pass||0)+rt.legs.reduce((a,l)=>a+l.c,0);rt.q=!rt.legs.some(l=>l.c>0&&!l.q)&&!rt.pass;}));

/* ---------- 插畫 ---------- */
function rnd(seed){let s=seed;return()=>((s=s*16807%2147483647)/2147483647);}
function flakes(seed,n,w,h){const r=rnd(seed);let o='';for(let i=0;i<n;i++){o+=`<circle cx="${(r()*w).toFixed(0)}" cy="${(r()*h).toFixed(0)}" r="${(1+r()*2.4).toFixed(1)}" fill="var(--snowc)" opacity="${(.5+r()*.5).toFixed(2)}"/>`;}return o;}
function trees(seed,n,x0,x1,y,s){const r=rnd(seed);let o='';for(let i=0;i<n;i++){const x=x0+r()*(x1-x0),k=s*(.7+r()*.6);o+=`<path d="M${x} ${y-34*k} L${x-11*k} ${y} L${x+11*k} ${y}Z" fill="var(--tree)"/><path d="M${x} ${y-34*k} L${x-4*k} ${y-22*k} L${x+4*k} ${y-22*k}Z" fill="var(--snowc)"/>`;}return o;}
function base(inner,seed,{sky=true}={}){return `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid slice">${sky?'<rect width="600" height="300" fill="var(--sky)"/>':''}${inner}${flakes(seed,40,600,300)}</svg>`;}
const ground='<path d="M0 250 Q150 230 300 248 T600 240 V300 H0Z" fill="var(--snowc)"/>';
const ART={
 niseko:()=>base(`<path d="M0 230 L120 170 L220 210 L600 200 V300 H0Z" fill="var(--mt1)"/>
  <path d="M190 240 L330 70 L470 240Z" fill="var(--mt2)"/><path d="M290 118 L330 70 L370 118 L352 110 L340 124 L326 108 L310 122Z" fill="var(--snowc)"/>${ground}${trees(3,9,20,580,262,1)}`,11),
 rusutsu:()=>base(`<path d="M0 220 Q150 150 300 200 T600 180 V300 H0Z" fill="var(--mt1)"/>
  <g transform="translate(430 150)"><circle r="62" fill="none" stroke="var(--ink)" stroke-width="3"/>${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6,x=62*Math.cos(a),y=62*Math.sin(a);return `<line x1="0" y1="0" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--ink)" stroke-width="1.4"/><rect x="${(x-6).toFixed(1)}" y="${(y-5).toFixed(1)}" width="12" height="10" fill="var(--ao)"/>`}).join('')}<line x1="0" y1="0" x2="-30" y2="98" stroke="var(--ink)" stroke-width="3"/><line x1="0" y1="0" x2="30" y2="98" stroke="var(--ink)" stroke-width="3"/></g>
  <path d="M40 235 C90 120 150 120 170 200 C185 250 230 250 250 170 C265 120 300 140 320 235" fill="none" stroke="var(--warn)" stroke-width="4"/>${ground}${trees(5,6,20,330,262,.9)}`,21),
 furano:()=>base(`<path d="M0 210 L140 120 L260 190 L380 110 L600 200 V300 H0Z" fill="var(--mt1)"/><path d="M0 240 Q200 180 340 220 T600 215 V300 H0Z" fill="var(--mt2)"/>
  <line x1="60" y1="250" x2="560" y2="80" stroke="var(--ink)" stroke-width="2"/>${[140,250,360,470].map(x=>{const y=250-(x-60)*170/500;return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y+14}" stroke="var(--ink)" stroke-width="2"/><rect x="${x-16}" y="${y+14}" width="32" height="24" rx="4" fill="var(--ao)"/><rect x="${x-11}" y="${y+19}" width="22" height="9" fill="var(--snowc)"/>`}).join('')}${ground}${trees(7,12,0,600,268,1)}`,31),
 kiroro:()=>base(`<path d="M0 200 Q120 130 240 180 T480 150 T600 170 V300 H0Z" fill="var(--mt1)"/>${trees(9,22,0,600,240,1.3)}<path d="M0 235 Q150 215 300 238 T600 228 V300 H0Z" fill="var(--snowc)"/>${trees(10,10,0,600,282,1.1)}${flakes(99,70,600,300)}`,41),
 tomamu:()=>base(`<path d="M0 220 Q150 140 300 190 T600 160 V300 H0Z" fill="var(--mt1)"/>
  ${[[250,60],[320,40]].map(([x,y])=>`<rect x="${x}" y="${y}" width="56" height="${240-y}" fill="var(--mt2)" stroke="var(--ink)" stroke-width="2"/>${Array.from({length:Math.floor((230-y)/18)},(_,j)=>`<rect x="${x+8}" y="${y+10+j*18}" width="40" height="6" fill="var(--marker)"/>`).join('')}`).join('')}${ground}${trees(13,10,0,600,264,1)}`,51),
 gala:()=>base(`<path d="M0 200 L120 120 L230 180 L360 100 L480 170 L600 130 V300 H0Z" fill="var(--mt1)"/><path d="M330 120 L360 100 L392 124 L372 120 L360 132 L346 122Z" fill="var(--snowc)"/>
  <rect x="0" y="232" width="600" height="6" fill="var(--ink)"/>
  <path d="M60 230 L470 230 Q560 230 590 205 Q560 186 470 186 L60 186Z" fill="var(--snowc)" stroke="var(--ink)" stroke-width="2"/><rect x="60" y="208" width="460" height="6" fill="var(--rail)"/>${Array.from({length:10},(_,i)=>`<rect x="${80+i*40}" y="194" width="24" height="10" fill="var(--ao)"/>`).join('')}<path d="M520 196 Q550 196 566 204 L520 204Z" fill="var(--ao)"/>${ground.replace('250','262')}`,61),
 karuizawa:()=>base(`<path d="M120 230 L250 110 L330 110 L460 230Z" fill="var(--mt2)"/><path d="M230 128 L250 110 L330 110 L350 128 L320 124 L300 136 L280 124 L260 134Z" fill="var(--snowc)"/>
  <path d="M290 106 C270 80 300 70 290 50 C320 60 300 30 330 24 C320 50 350 60 330 84 C320 96 300 96 290 106Z" fill="var(--snowc)" opacity=".85"/>${ground}
  ${[[60,212],[110,220],[470,214],[520,222]].map(([x,y])=>`<rect x="${x}" y="${y}" width="40" height="${260-y}" fill="var(--card)" stroke="var(--ink)" stroke-width="2"/><path d="M${x-4} ${y} L${x+20} ${y-14} L${x+44} ${y}Z" fill="var(--warn)"/>`).join('')}`,71),
 iwatake:()=>base(`<path d="M0 220 L60 120 L100 160 L150 70 L200 140 L250 60 L300 130 L360 50 L420 140 L470 90 L530 150 L600 110 V300 H0Z" fill="var(--mt2)"/>
  <path d="M140 88 L150 70 L160 88Z M240 78 L250 60 L260 78Z M350 68 L360 50 L370 68Z M462 104 L470 90 L478 104Z" fill="var(--snowc)"/><path d="M0 250 Q150 200 300 230 T600 225 V300 H0Z" fill="var(--mt1)"/>
  <g stroke="var(--ink)" stroke-width="2"><line x1="470" y1="150" x2="470" y2="250"/><line x1="530" y1="150" x2="530" y2="250"/><line x1="465" y1="150" x2="535" y2="150"/><line x1="500" y1="150" x2="490" y2="215"/></g><rect x="478" y="213" width="24" height="5" fill="var(--ao)"/>${ground.replace('250','270')}${trees(17,8,0,420,280,.9)}`,81),
 cover:()=>base(`<path d="M0 220 L100 140 L200 190 L300 90 L420 180 L520 120 L600 170 V300 H0Z" fill="var(--mt1)"/><path d="M280 110 L300 90 L320 110Z" fill="var(--snowc)"/>${ground}${trees(2,14,0,600,264,1)}<g transform="translate(300 225)"><path d="M-70 18 L70 -4" stroke="var(--ao)" stroke-width="7" stroke-linecap="round"/><path d="M-62 30 L78 8" stroke="var(--warn)" stroke-width="7" stroke-linecap="round"/></g>`,1),
 snowtab:()=>base(`<path d="M0 210 Q150 160 300 200 T600 190 V300 H0Z" fill="var(--mt1)"/>${ground}<g transform="translate(300 140)" stroke="var(--ao)" stroke-width="6" stroke-linecap="round">${[0,60,120].map(a=>`<g transform="rotate(${a})"><line x1="0" y1="-70" x2="0" y2="70"/><line x1="0" y1="-48" x2="-16" y2="-64"/><line x1="0" y1="-48" x2="16" y2="-64"/><line x1="0" y1="48" x2="-16" y2="64"/><line x1="0" y1="48" x2="16" y2="64"/></g>`).join('')}</g>${flakes(7,80,600,300)}`,3),
 move:()=>base(`<path d="M0 230 Q200 180 360 220 T600 210 V300 H0Z" fill="var(--mt1)"/><path d="M40 200 Q300 40 560 120" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="6 8"/>
  <g transform="translate(470 92) rotate(18)"><path d="M-50 0 Q-50 -10 -36 -10 L40 -10 Q60 -10 62 0 Q60 10 40 10 L-36 10 Q-50 10 -50 0Z" fill="var(--ao)"/><path d="M-10 -10 L10 -40 L22 -40 L14 -10Z M-10 10 L10 40 L22 40 L14 10Z M-44 -8 L-56 -24 L-48 -24 L-34 -8Z" fill="var(--ao)"/></g>
  <rect x="0" y="262" width="600" height="5" fill="var(--ink)"/><path d="M30 260 L330 260 Q390 260 410 240 Q390 224 330 224 L30 224Z" fill="var(--snowc)" stroke="var(--ink)" stroke-width="2"/><rect x="30" y="244" width="330" height="5" fill="var(--rail)"/>${Array.from({length:7},(_,i)=>`<rect x="${46+i*40}" y="230" width="22" height="9" fill="var(--ao)"/>`).join('')}`,5,{}),
 stay:()=>base(`<path d="M0 200 L150 110 L300 190 L450 120 L600 190 V300 H0Z" fill="var(--mt1)"/>${ground}
  <g transform="translate(300 160)"><path d="M-120 20 L0 -50 L120 20Z" fill="var(--warn)"/><rect x="-100" y="20" width="200" height="80" fill="var(--card)" stroke="var(--ink)" stroke-width="2"/>${[-70,-20,30].map(x=>`<rect x="${x}" y="40" width="34" height="24" fill="var(--marker)" stroke="var(--ink)"/>`).join('')}</g>
  <g fill="none" stroke="var(--sub)" stroke-width="4" stroke-linecap="round">${[90,120,150].map(x=>`<path d="M${x} 250 C${x-14} 230 ${x+14} 216 ${x} 196"/>`).join('')}</g><ellipse cx="120" cy="262" rx="70" ry="12" fill="var(--ao)" opacity=".5"/>`,9),
 boards:()=>base(`<path d="M0 220 Q150 150 300 200 T600 180 V300 H0Z" fill="var(--mt1)"/>${ground}
  <g transform="translate(240 150) rotate(-18)"><rect x="-10" y="-110" width="20" height="220" rx="10" fill="var(--ao)"/></g><g transform="translate(270 150) rotate(18)"><rect x="-10" y="-110" width="20" height="220" rx="10" fill="var(--ao)"/></g>
  <g transform="translate(400 150) rotate(12)"><rect x="-30" y="-110" width="60" height="220" rx="30" fill="var(--warn)"/><rect x="-22" y="-50" width="44" height="14" fill="var(--ink)"/><rect x="-22" y="36" width="44" height="14" fill="var(--ink)"/></g>`,13),
 coach:()=>base(`<path d="M0 220 Q150 150 300 200 T600 180 V300 H0Z" fill="var(--mt1)"/>${ground}<path d="M120 262 Q300 200 520 240" fill="none" stroke="var(--ao)" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/><g transform="translate(250 178)"><circle cx="0" cy="-46" r="14" fill="var(--ink)"/><path d="M-14 -30 H14 L18 20 H-18Z" fill="var(--ao)"/><path d="M14 -22 L48 -44" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/><path d="M-34 34 L34 26" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/></g><g transform="translate(380 196) scale(.8)"><circle cx="0" cy="-46" r="14" fill="var(--ink)"/><path d="M-14 -30 H14 L18 20 H-18Z" fill="var(--warn)"/><path d="M-34 34 L34 26" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/></g><g transform="translate(470 206) scale(.8)"><circle cx="0" cy="-46" r="14" fill="var(--ink)"/><path d="M-14 -30 H14 L18 20 H-18Z" fill="var(--good)"/><path d="M-34 34 L34 26" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/></g>`,23),
 train:()=>base(`<path d="M0 220 Q150 160 300 200 T600 190 V300 H0Z" fill="var(--mt1)"/>${ground}<g transform="translate(260 168)"><circle cx="0" cy="-60" r="15" fill="var(--ink)"/><path d="M-6 -44 L10 -44 L26 0 L-20 4Z" fill="var(--ao)"/><path d="M-20 4 L-46 30 L-30 70" fill="none" stroke="var(--ink)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 0 L4 34 L26 70" fill="none" stroke="var(--ink)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 -34 L50 -30" stroke="var(--ink)" stroke-width="8" stroke-linecap="round"/></g><g transform="translate(420 120)"><rect x="-50" y="-46" width="100" height="96" fill="var(--card)" stroke="var(--ink)" stroke-width="2"/><rect x="-50" y="-46" width="100" height="22" fill="var(--warn)"/>${[0,1,2,3,4,5,6,7,8].map(i=>`<rect x="${-40+(i%3)*28}" y="${-16+Math.floor(i/3)*22}" width="20" height="14" fill="${i<5?'var(--ao)':'var(--rule)'}"/>`).join('')}</g>`,27),
 heart:()=>base(`<path d="M0 220 Q150 160 300 200 T600 190 V300 H0Z" fill="var(--mt1)"/>${ground}<g transform="translate(200 230)">${[[0,70],[60,120],[120,95],[180,150]].map(([x,h],i)=>`<rect x="${x}" y="${-h}" width="40" height="${h}" fill="${i===3?'var(--ao)':'var(--mt2)'}"/>`).join('')}<line x1="-10" y1="0" x2="230" y2="0" stroke="var(--ink)" stroke-width="3"/></g>`,15),
 budget:()=>base(`<path d="M0 220 Q150 160 300 200 T600 190 V300 H0Z" fill="var(--mt1)"/>${ground}<g transform="translate(300 150) rotate(-4)"><path d="M-90 -110 H90 V100 L75 112 L60 100 L45 112 L30 100 L15 112 L0 100 L-15 112 L-30 100 L-45 112 L-60 100 L-75 112 L-90 100Z" fill="var(--card)" stroke="var(--ink)" stroke-width="2"/>${[-80,-56,-32,-8,16,40].map(y=>`<rect x="-70" y="${y}" width="${80+((y*7)%40+40)%40}" height="7" fill="var(--rule)"/><rect x="40" y="${y}" width="30" height="7" fill="var(--sub)"/>`).join('')}<rect x="-70" y="66" width="140" height="10" fill="var(--ao)"/></g>`,17),
 packing:()=>base(`<path d="M0 220 Q150 160 300 200 T600 190 V300 H0Z" fill="var(--mt1)"/>${ground}<g transform="translate(300 160)"><rect x="-80" y="-60" width="160" height="130" rx="18" fill="var(--ao)"/><rect x="-36" y="-84" width="72" height="30" rx="10" fill="none" stroke="var(--ink)" stroke-width="6"/><rect x="-80" y="-10" width="160" height="10" fill="var(--ink)" opacity=".4"/></g><g transform="translate(450 200)"><rect x="-34" y="-20" width="68" height="34" rx="16" fill="var(--warn)"/><rect x="-26" y="-12" width="52" height="18" rx="9" fill="var(--sky)"/></g>`,19)
};
document.querySelectorAll('.band').forEach(b=>{const h=b.nextElementSibling;h.insertAdjacentHTML('beforeend',ART[b.dataset.art]().replace('<svg ','<svg class="thumb" aria-hidden="true" '));b.remove();});

/* ---------- routing ---------- */
const VIEWS=['picks','snow','heart','move','stay','budget','boards','coach','train','packing'];
function renumber(){VIEWS.forEach((v,i)=>{const sec=document.getElementById('v-'+v);sec.querySelector('.num').textContent=String(i+1).padStart(2,'0');
  const nx=sec.querySelector('.next'),n=VIEWS[(i+1)%VIEWS.length],t=document.querySelector('.toc a[href="#'+n+'"]');
  const title=t.textContent.replace(t.querySelector('.n').textContent,'').trim();
  if(nx){nx.href='#'+n;nx.textContent=(i===VIEWS.length-1?'回到第一篇：':'下一篇：')+title+' →';}});}
renumber();
const ALIAS={resorts:'picks',kansai:'move',rank:'heart'};
function show(){
  let h=location.hash.slice(1); h=ALIAS[h]||h; const v=VIEWS.includes(h)?h:'picks';
  document.body.dataset.v=v;
  document.querySelectorAll('.view').forEach(s=>s.hidden=s.dataset.view!==v);
  document.querySelectorAll('.toc a').forEach(a=>a.setAttribute('aria-current',a.getAttribute('href')==='#'+v?'page':'false'));
  const cur=document.querySelector('.toc a[href="#'+v+'"]'), i=VIEWS.indexOf(v);
  document.getElementById('curN').textContent=cur.querySelector('.n').textContent;
  document.getElementById('curT').textContent=cur.textContent.replace(cur.querySelector('.n').textContent,'').trim();
  document.getElementById('prevV').disabled=i===0; document.getElementById('nextV').disabled=i===VIEWS.length-1;
  setMenu(false);

}
window.addEventListener('hashchange',()=>{show();window.scrollTo(0,0);});
function setMenu(o){const t=document.getElementById('toc');t.classList.toggle('open',o);document.getElementById('curV').setAttribute('aria-expanded',o);}
document.getElementById('curV').addEventListener('click',()=>setMenu(!document.getElementById('toc').classList.contains('open')));
const curIdx=()=>Math.max(0,VIEWS.indexOf(document.body.dataset.v));
document.getElementById('prevV').addEventListener('click',()=>{const i=curIdx();if(i>0)location.hash=VIEWS[i-1];});
document.getElementById('nextV').addEventListener('click',()=>{const i=curIdx();if(i<VIEWS.length-1)location.hash=VIEWS[i+1];});
document.addEventListener('click',e=>{if(!e.target.closest('#toc'))setMenu(false);});
document.querySelectorAll('.toc a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false);});

/* ---------- 01 雪場 ---------- */
function renderResorts(f){
  const tbl=f==='table';
  document.getElementById('cmpBox').hidden=!tbl;
  document.getElementById('resortList').hidden=tbl;
  if(tbl)return;
  document.getElementById('resortList').innerHTML=R.filter(r=>f==='all'||r.region===f).map(r=>{
    const fast=Math.min(...r.routes.map(x=>x.min));
    return `<article class="resort">
    ${ART[r.art]().replace('<svg ','<svg class="art" aria-label="'+esc(r.zh)+'的插畫" ')}
    <div class="top"><div><h3>${esc(r.zh)}</h3><span class="ja">${esc(r.ja)}</span></div><span class="region">${regionName(r.region)}</span></div>
    <p class="tagline">${esc(r.tag)}</p>
    <dl class="facts">
      <dt>地點</dt><dd>${esc(r.pref)}</dd>
      <dt>從大阪</dt><dd>最快約 ${hm(fast)}</dd>
      <dt>一日券</dt><dd><span class="mono">${yen(r.lift)}</span>${r.liftOff?'<span class="off">官方</span>':'<span class="est">估</span>'}　<span class="note">${esc(r.liftNote)}</span></dd>
      <dt>營業</dt><dd>${esc(r.season)}</dd>
    </dl>
    <div class="pc"><ul class="plus">${r.plus.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><ul class="minus">${r.minus.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
    <a class="maplink" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.map)}" target="_blank" rel="noopener">📍 在 Google 地圖看</a>
  </article>`}).join('');
}
document.querySelectorAll('#v-picks .chip').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#v-picks .chip').forEach(c=>c.setAttribute('aria-pressed',c===b));renderResorts(b.dataset.f);}));
document.getElementById('cmp').innerHTML=`<thead><tr><th>雪場</th>${CRIT.map(c=>`<th>${c.n}</th>`).join('')}<th>一日券</th></tr></thead><tbody>${
  R.map(r=>`<tr><th>${esc(r.zh)}</th>${CRIT.map(c=>`<td class="dots">${dots(r.s[c.k])}</td>`).join('')}<td class="mono">${yen(r.lift)}</td></tr>`).join('')}</tbody>`;

/* ---------- 02 雪報 ---------- */
const cls=s=>s==='◎'?'s-good':s==='○'?'s-ok':'s-bad';
document.getElementById('snowTbl').innerHTML=`<thead><tr><th>雪場</th><th>地區</th><th style="text-align:center">上旬</th><th style="text-align:center">中旬</th><th style="text-align:center">下旬</th><th>營業到</th></tr></thead><tbody>${
  R.map(r=>`<tr><th>${esc(r.zh)}</th><td>${regionName(r.region)}</td>${r.snow.map(s=>`<td class="c ${cls(s)}">${s}</td>`).join('')}<td>${esc(r.season)}</td></tr>`).join('')}</tbody>`;

/* ---------- 03 交通 ---------- */
const PASSES=[
 {id:'arch',n:'JR 北陸拱型周遊券',p:'¥35,000／7 天',for:['karuizawa','iwatake'],
  vd:r=>r==='karuizawa'?['yes','划算']:['maybe','看行程'],
  txt:r=>r==='karuizawa'?'大阪→敦賀→北陸新幹線→輕井澤，去回都包含。一般新幹線經東京來回 ¥37,200，用周遊券省約 ¥2,200，回程還能停金澤或東京。雷鳥號要先劃位。':'可以坐到長野再轉巴士去白馬。一般 JR 來回只要 ¥24,560，單純滑雪不划算；如果想順便玩金澤，就值得。'},
 {id:'wide',n:'JR 東京廣域周遊券',p:'¥16,000／連續 3 天',for:['karuizawa','gala'],
  vd:()=>['maybe','住東京才划算'],
  txt:r=>`東海道新幹線（大阪↔東京）不能用，所以大阪過去不能靠它。適合「住東京、每天坐新幹線去滑雪」：${r==='karuizawa'?'東京↔輕井澤一天來回約 ¥10,980，滑 2 天就回本':'東京↔越後湯澤一天來回約 ¥13,800，滑 2 天就回本'}。GALA 站只在冬春營業，出發前確認涵蓋。`},
 {id:'hkrp',n:'JR 北海道鐵路周遊券',p:'5 天 ¥22,000／7 天 ¥28,000',for:['furano','tomamu','niseko'],
  vd:()=>['no','只滑雪不划算'],
  txt:r=>`新千歲到${r==='furano'?'富良野':r==='tomamu'?'TOMAMU':'俱知安'}單程約 ¥5,000，來回才 ¥10,000 左右。要加上札幌、小樽、旭山動物園這些行程才會回本。只在札幌、富良野、小樽之間移動的話，「札幌－富良野區域周遊券」4 天 ¥11,000 比較便宜。`},
 {id:'jal',n:'JAL Japan Explorer Pass',p:'關西↔新千歲 單程約 ¥10,800',for:['rusutsu','niseko','furano','kiroro','tomamu'],
  vd:()=>['maybe','行李多時划算'],
  txt:()=>'給住在海外的旅客買的國內線優惠票，需要搭國際線入出境日本。比廉航貴一點，但含託運行李，扛滑雪裝備或行李多時差不多價錢。訂票前確認資格。'}
];
let moveR='rusutsu';
document.getElementById('moveChips').innerHTML=R.map(r=>`<button class="chip" id="mv-${r.id}" data-r="${r.id}" aria-pressed="${r.id===moveR}">${esc(r.zh)}</button>`).join('');
document.querySelectorAll('#moveChips .chip').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#moveChips .chip').forEach(c=>c.setAttribute('aria-pressed',c===b));moveR=b.dataset.r;renderMove();}));
function renderMove(){
  const r=R.find(x=>x.id===moveR);
  const fast=Math.min(...r.routes.map(x=>x.min)),cheap=Math.min(...r.routes.map(x=>x.cost));
  document.getElementById('routes').innerHTML=r.routes.map(rt=>`
  <div class="route ${rt.min===fast?'best':''}">
    <div class="hd"><div style="display:flex;flex-direction:column;gap:4px"><h3>${esc(rt.n)}</h3><div class="badges">${rt.min===fast?'<span class="badge">最快</span>':''}${rt.cost===cheap&&r.routes.length>1?'<span class="badge alt">最省</span>':''}</div></div>
      <div class="sum"><span><b>${hm(rt.min)}</b></span><span><b>${yen(rt.cost)}</b>${tagOf(rt.q)}<br><small class="note">單程每人</small></span></div></div>
    <div class="line" aria-hidden="true">${rt.legs.map(l=>`<span class="seg ${l.k}" style="flex:${l.m} 1 0">${l.m>=40?hm(l.m):''}</span>`).join('')}</div>
    <ol class="stops">${rt.legs.map(l=>`<li><span>${{plane:'✈',rail:'🚄',bus:'🚌',walk:'🚶'}[l.k]}</span><span>${esc(l.t)}</span><span class="t">${hm(l.m)}</span><span class="c">${l.c?yen(l.c):(rt.pass&&l.k!=='walk'&&l.k!=='bus'?'周遊券':'—')}</span></li>`).join('')}</ol>
    ${rt.pass?`<p class="note">周遊券算法：${esc(rt.passNote)}，每趟約 ${yen(rt.pass)}</p>`:''}
  </div>`).join('');
  const ps=PASSES.filter(p=>p.for.includes(r.id));
  document.getElementById('passes').innerHTML=ps.length?ps.map(p=>{const [c,t]=p.vd(r.id);return `<div class="pass"><div class="ttl"><h3>${esc(p.n)}</h3></div><span class="price">${esc(p.p)}</span><span class="vd ${c}">→ ${t}</span><p>${esc(p.txt(r.id))}</p></div>`}).join('')
    :'<p class="note">這座雪場主要靠巴士和飛機，沒有特別划算的周遊券。廉航早點訂最省。</p>';
}

/* ---------- 04 住宿 ---------- */
function num(id,d){const v=parseFloat(document.getElementById(id).value);return isNaN(v)||v<0?d:v;}
['st-ski','st-night'].forEach(id=>document.getElementById(id).addEventListener('input',renderStay));
function stayCost(o,ski,night){return o.lodge*night+(o.commute||0)*ski;}
function renderStay(){
  const ski=num('st-ski',3),night=num('st-night',4);
  const all=R.flatMap(r=>[r.stay.near,r.stay.far].filter(Boolean).map(o=>stayCost(o,ski,night)));const mx=Math.max(...all);
  document.getElementById('stayGrid').innerHTML=R.map(r=>{
    const n=r.stay.near,f=r.stay.far,cn=stayCost(n,ski,night);
    const bar=(lbl,v,col)=>`<div class="cmpbar"><span>${lbl}</span><span class="tr"><span style="width:${v/mx*100}%;background:${col}"></span></span><span class="v">${yen(v)}</span></div>`;
    let body=`<p class="where">住雪場旁：${esc(n.w)}</p>`+bar('住雪場旁',cn,'var(--ao)');
    let tip;
    if(f){const cf=stayCost(f,ski,night),diff=cn-cf,dh=((f.hrs||0)-(n.hrs||0))*ski;
      body+=`<p class="where">住遠一點：${esc(f.w)}（${esc(f.note)}）${tagOf(f.q)}</p>`+bar('住遠一點',cf,'var(--warn)');
      tip=diff>0?`住遠一點每人省 <b>${yen(diff)}</b>，${ski} 天多花約 <b>${dh.toFixed(1)} 小時</b>在路上。${dh>=4?'時間成本很高，建議住雪場旁。':dh>=2?'可以上課那兩天住雪場，其他天住外面。':'差的時間不多，想省錢可以住外面。'}`
                 :`住遠一點反而每人多花 <b>${yen(-diff)}</b>，還多花約 <b>${dh.toFixed(1)} 小時</b>在路上。直接住雪場旁。`;
    }else{tip=esc(r.stay.farNote);}
    return `<div class="sc"><div class="hd"><h3>${esc(r.zh)}</h3><span class="note">${regionName(r.region)}・每人</span></div>${body}<p class="tip">${tip}</p></div>`;
  }).join('');
}

/* ---------- 05 選板 ---------- */
const ans=[null,null,null];
document.querySelectorAll('#quiz .opts').forEach(g=>g.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{
  g.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',c===b));ans[+g.dataset.q]=b.dataset.v;quiz();})));
function quiz(){
  const el=document.getElementById('quizResult');
  if(ans.includes(null)){el.textContent='選完三題，這裡會顯示建議。';return;}
  const s=ans.filter(a=>a==='board').length-ans.filter(a=>a==='ski').length;
  const pick=s>0?'單板':s<0?'雙板':'兩個都可以';
  let why=s>0?'你比較能接受前兩天的摔，也比較在意鞋子舒適或膝蓋。記得帶護腕和護臀。':s<0?'你想快點能自己滑下山，雙板前期上手比較快。':'兩邊條件差不多，可以第一天先試雙板，不喜歡再換。';
  if(ans[2]==='board')why+=' 有扁平足的話，不管選哪個都帶足弓鞋墊。';
  el.innerHTML=`建議：<b>${pick}</b><br>${why}`;
}

/* ---------- 條件評分 ---------- */
const W={beg:3,zh:2,acc:2,mar:3,price:2,onsen:1,fun:1};
const lv=['不在意','有點','在意','很在意'];
document.getElementById('sliders').innerHTML=CRIT.map(c=>`<label class="sl" for="w-${c.k}"><span>${c.n}</span><input type="range" id="w-${c.k}" min="0" max="3" step="1" value="${W[c.k]}"><output id="o-${c.k}">${lv[W[c.k]]}</output></label>`).join('');
function rank(){
  const tw=CRIT.reduce((a,c)=>a+W[c.k],0)||1;
  const list=R.map(r=>({r,score:Math.round(CRIT.reduce((a,c)=>a+W[c.k]*r.s[c.k],0)/(5*tw)*100)})).sort((a,b)=>b.score-a.score);
  document.getElementById('rankList').innerHTML=list.map((x,i)=>`<li><span class="pos">${i+1}</span><span>${esc(x.r.zh)}</span><span class="bar"><span style="width:${x.score}%"></span></span><span class="scv">${x.score}</span></li>`).join('');
}
CRIT.forEach(c=>document.getElementById('w-'+c.k).addEventListener('input',e=>{W[c.k]=+e.target.value;document.getElementById('o-'+c.k).textContent=lv[W[c.k]];rank();}));

/* ---------- 07 旅費 ---------- */
const RENT=8000,WEAR=4000,LESSON=15000,FOOD=4000;
let picked=['rusutsu','furano','gala'];
const choice={}; R.forEach(r=>choice[r.id]={route:0,stay:'near'});
function budChips(){
  document.getElementById('budChips').innerHTML=R.map(r=>{const on=picked.includes(r.id);return `<button class="chip" id="bc-${r.id}" data-r="${r.id}" aria-pressed="${on}" ${!on&&picked.length>=3?'disabled':''}>${esc(r.zh)}</button>`}).join('')+`<span class="note" style="align-self:center">最多選 3 座</span>`;
  document.querySelectorAll('#budChips .chip').forEach(b=>b.addEventListener('click',()=>{
    const id=b.dataset.r; if(picked.includes(id)){if(picked.length>1)picked=picked.filter(x=>x!==id);}else if(picked.length<3)picked.push(id);
    budChips();calc();}));
}
['b-ski','b-night','b-lesson','b-ltype','b-rate','b-wear'].forEach(id=>document.getElementById(id).addEventListener('input',calc));
function bill(r){
  const ski=num('b-ski',3),night=num('b-night',4),les=Math.min(num('b-lesson',0),ski),rate=num('b-rate',0.205),lp=+document.getElementById('b-ltype').value||LESSON;
  const wear=document.getElementById('b-wear').checked, ch=choice[r.id], rt=r.routes[ch.route]||r.routes[0];
  const st=(ch.stay==='far'&&r.stay.far)?r.stay.far:r.stay.near;
  const items=[
    ['雪票',r.lift*ski,`${yen(r.lift)} × ${ski} 天`,r.liftOff],
    ['雪板＋雪鞋',RENT*ski,`${yen(RENT)} × ${ski} 天`,false],
    ...(wear?[['雪衣雪褲',WEAR*ski,`${yen(WEAR)} × ${ski} 天`,false]]:[]),
    ['教練課',lp*les,`${yen(lp)} × ${les} 天`,false],
    ['住宿',st.lodge*night,`${st.w}・${yen(st.lodge)} × ${night} 晚`,false],
    ...(st.commute?[['每天通勤',st.commute*ski,`${yen(st.commute)} × ${ski} 天`,!!st.q]]:[]),
    ['大阪來回交通',rt.cost*2,`${rt.n}・${yen(rt.cost)} × 2`,rt.q],
    ['吃飯',FOOD*(night+1),`${yen(FOOD)} × ${night+1} 天`,false]
  ];
  const jp=items.reduce((a,x)=>a+x[1],0);
  return {items,jp,per:jp*rate,rate,rt,st,hrs:rt.min*2/60+(st.hrs||0)*ski};
}
function calc(){
  const bills=picked.map(id=>{const r=R.find(x=>x.id===id);return {r,b:bill(r)};});
  const min=Math.min(...bills.map(x=>x.b.per));
  document.getElementById('receipts').innerHTML=bills.map(({r,b})=>`
  <div class="receipt ${bills.length>1&&b.per===min?'win':''}">
    <p class="eyebrow">${regionName(r.region)}${bills.length>1&&b.per===min?'・最省':''}</p><h3>${esc(r.zh)}</h3>
    <label class="note" for="rt-${r.id}">大阪出發方式<select id="rt-${r.id}" data-r="${r.id}" data-k="route">${r.routes.map((x,i)=>`<option value="${i}" ${i===choice[r.id].route?'selected':''}>${esc(x.n)}</option>`).join('')}</select></label>
    <label class="note" for="sy-${r.id}">住哪裡<select id="sy-${r.id}" data-r="${r.id}" data-k="stay"><option value="near" ${choice[r.id].stay==='near'?'selected':''}>住雪場旁：${esc(r.stay.near.w)}</option>${r.stay.far?`<option value="far" ${choice[r.id].stay==='far'?'selected':''}>住遠一點：${esc(r.stay.far.w)}</option>`:''}</select></label>
    ${b.items.map(x=>`<div class="row"><span>${x[0]}${tagOf(x[3])}<br><small class="note">${esc(x[2])}</small></span><span>${yen(x[1])}</span></div>`).join('')}
    <div class="row total"><span>每人合計（${yen(b.jp)}）</span><span>${ntd(b.per)}</span></div>
    <p class="big">${ntd(b.per*2)}</p><p class="note">兩人合計・交通約花 ${b.hrs.toFixed(1)} 小時</p>
  </div>`).join('');
  document.querySelectorAll('#receipts select').forEach(s=>s.addEventListener('change',()=>{const c=choice[s.dataset.r];if(s.dataset.k==='route')c.route=+s.value;else c.stay=s.value;calc();}));
}

(function(){const d=Math.ceil((new Date('2027-03-01T00:00:00+09:00')-new Date())/864e5);document.getElementById('cdDays').textContent=d>0?d:0;document.getElementById('cdWeeks').textContent=d>0?Math.floor(d/7):0;})();
document.querySelectorAll('#todo input').forEach(c=>{try{c.checked=localStorage.getItem('ski27-'+c.id)==='1';}catch(e){}
  c.addEventListener('change',()=>{try{localStorage.setItem('ski27-'+c.id,c.checked?'1':'0');}catch(e){}});});
const GEAR=[
 {n:'安全帽',x:150,y:52,own:false,k:'all',d:'雪場都租得到，初學者一定要戴，可以不用另外戴毛帽'},
 {n:'雪鏡',x:196,y:82,own:true,k:'all',d:'租的常起霧，建議自己買一副'},
 {n:'脖圍',x:184,y:120,own:true,k:'all',d:'擋風擋雪，坐纜車時很重要'},
 {n:'排汗內層衣',x:132,y:160,own:true,k:'all',d:'穿在最裡面，不要穿棉質，流汗會變冷'},
 {n:'刷毛中層',x:168,y:184,own:true,k:'all',d:'保暖層，熱了可以脫'},
 {n:'雪衣',x:118,y:224,own:false,k:'all',d:'防水外套，雪場可租'},
 {n:'護腕',x:56,y:222,own:true,k:'board',d:'單板跌倒常用手撐，戴上比較安心'},
 {n:'防水手套',x:244,y:250,own:true,k:'all',d:'一定要防水，建議自己帶'},
 {n:'雪褲',x:178,y:290,own:false,k:'all',d:'防水褲，雪場可租'},
 {n:'護臀、護膝',x:120,y:340,own:true,k:'board',d:'穿在雪褲裡面，單板一直坐下去會很需要'},
 {n:'滑雪襪',x:202,y:396,own:true,k:'all',d:'長到小腿、只穿一雙，兩雙反而會擠'},
 {n:'雪鞋＋足弓鞋墊',x:96,y:426,own:false,k:'all',d:'鞋子用租的，扁平足的話自己帶鞋墊換進去'},
 {n:'雪板／雪杖',x:270,y:452,own:false,k:'all',d:'用租的就好，初學不用買'}];
let gk='ski',gOn=-1;
function renderGear(){
  document.querySelectorAll('#gearFig .k-ski').forEach(g=>g.style.display=gk==='ski'?'':'none');
  document.querySelectorAll('#gearFig .k-board').forEach(g=>g.style.display=gk==='board'?'':'none');
  const list=GEAR.map((g,i)=>({...g,i})).filter(g=>g.k==='all'||g.k===gk);
  document.getElementById('gearDots').innerHTML=list.map((g,j)=>`<g class="dot ${g.i===gOn?'on':''}" data-i="${g.i}" tabindex="0" role="button" aria-label="${g.n}"><circle cx="${g.x}" cy="${g.y}" r="13"/><text x="${g.x}" y="${g.y+4.5}" text-anchor="middle">${j+1}</text></g>`).join('');
  document.getElementById('gearList').innerHTML=list.map((g,j)=>`<li class="${g.i===gOn?'on':''}" data-i="${g.i}"><span class="gn">${j+1}</span><div><b>${esc(g.n==='雪板／雪杖'&&gk==='board'?'雪板':g.n)}</b>${g.own?'<span class="own">自帶</span>':'<span class="rent">可租</span>'}<p class="note">${esc(g.d)}</p></div></li>`).join('');
  document.querySelectorAll('#gearDots .dot, #gearList li').forEach(el=>{const f=()=>{gOn=+el.dataset.i===gOn?-1:+el.dataset.i;renderGear();};el.addEventListener('click',f);el.addEventListener('keydown',e=>{if(e.key==='Enter')f();});});
}
document.querySelectorAll('#v-packing .chips .chip').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#v-packing .chips .chip').forEach(c=>c.setAttribute('aria-pressed',c===b));gk=b.dataset.k;gOn=-1;renderGear();}));
renderGear();
/* train subtabs + mode */
document.querySelectorAll('#v-train .st').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#v-train .st').forEach(c=>c.setAttribute('aria-selected',c===b));document.querySelectorAll('#v-train .panel').forEach(p=>p.hidden=p.dataset.p!==b.dataset.p);}));
function setMode(m){document.getElementById('v-train').dataset.mode=m;document.querySelectorAll('#v-train [data-m]').forEach(c=>c.setAttribute('aria-pressed',c.dataset.m===m));}
document.querySelectorAll('#v-train [data-m]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.m)));setMode('body');
renderResorts('all');renderMove();renderStay();rank();budChips();calc();show();
