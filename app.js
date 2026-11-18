
'use strict';

const $ = (id) => document.getElementById(id);
const STORAGE = {
  styles: 'paradoxFavoriteStyles',
  compositions: 'paradoxFavoriteCompositions',
  state: 'paradoxStudioState'
};

const alphabet = {
  bold: '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭',
  italic: '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡',
  boldItalic: '𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕',
  script: '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵',
  fraktur: '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ',
  double: '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ',
  mono: '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',
  small: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
};
const digits = {
  bold: '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵',
  double: '𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡',
  mono: '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'
};
const styles = [
  {id:'normal',name:'Classic',desc:'Оригинальный текст',sample:'Aa 123'},
  {id:'bold',name:'Bold',desc:'Жирный Unicode',sample:'𝗔𝗮 𝟭𝟮𝟯'},
  {id:'italic',name:'Italic',desc:'Наклонный',sample:'𝘈𝘢 123'},
  {id:'boldItalic',name:'Bold italic',desc:'Жирный наклонный',sample:'𝙰𝚊 123'},
  {id:'script',name:'Script',desc:'Рукописный',sample:'𝒜𝒶'},
  {id:'fraktur',name:'Gothic',desc:'Готический',sample:'𝔄𝔞'},
  {id:'double',name:'Double Struck',desc:'Двойной контур',sample:'𝔸𝕒'},
  {id:'mono',name:'Monospace',desc:'Моноширинный',sample:'𝙰𝚊'},
  {id:'full',name:'Fullwidth',desc:'Широкие символы',sample:'Ａａ'},
  {id:'smallcaps',name:'Small caps',desc:'Капитель',sample:'Aᴀ'},
  {id:'circled',name:'Circled',desc:'В кружках',sample:'Ⓐⓐ'},
  {id:'squared',name:'Squared',desc:'В квадратах',sample:'🄰🄱'},
  {id:'boldScript',name:'Bold Script',desc:'Жирный рукописный',sample:'𝓐𝓪'},
  {id:'antique',name:'Antique',desc:'Антиква Fraktur',sample:'𝔓𝔞'},
  {id:'decorativeScript',name:'Decorative Script',desc:'Декоративный курсив',sample:'𝓟𝓪'},
  {id:'medieval',name:'Medieval',desc:'Средневековый Gothic',sample:'𝕻𝖆'},
  {id:'negativeCircled',name:'Negative Circled',desc:'Тёмные круги',sample:'🅐🅑'},
  {id:'negativeSquared',name:'Negative Squared',desc:'Залитые квадраты',sample:'🅰🅱'},
  {id:'upsideDown',name:'Upside Down',desc:'Перевёрнутый текст',sample:'XOpɐɹɐd'},
  {id:'darkElite',name:'Dark Elite',desc:'Рамка Dark Elite',sample:'『 𝙋𝘼𝙍𝘼𝘿𝙊𝙓 』'},
  {id:'underground',name:'Underground',desc:'Underground оформление',sample:'〆 PARADOX 〆'},
  {id:'cyber',name:'Cyber',desc:'Кибер-рамка',sample:'⟦ PARADOX ⟧'},
  {id:'hacker',name:'Hacker',desc:'Leetspeak',sample:'[ P4R4D0X ]'},
  {id:'elite',name:'Elite',desc:'Жирная Elite-рамка',sample:'『 𝐏𝐀𝐑𝐀𝐃𝐎𝐗 』'}
];

const symbolSets = [
 {id:'all',label:'Все выбранные',items:[]},
 {id:'frames',label:'FRAMES',items:[
  ['꧁༺','༻꧂','Ornate frame'],['『','』','Japanese brackets'],['【','】','Black brackets'],
  ['〖','〗','White brackets'],['《','》','Double angle brackets'],['⟦','⟧','Mathematical brackets'],
  ['༺═','═༻','Ornate line frame'],['◥','◤','Upper corner frame'],['◤','◥','Reverse corner frame'],
  ['╔══','══╗','Double-line frame'],['╭──','──╮','Rounded frame'],['〔','〕','Tortoise brackets']
 ]},
 {id:'ornaments',label:'LINES & ORNAMENTS',items:[
  ['════════','════════','Double divider'],['━━━━━━━━','━━━━━━━━','Heavy divider'],
  ['────◆','◆────','Diamond divider'],['══✦','✦══','Star divider'],['▬▬▬▬','▬▬▬▬','Block divider'],
  ['⋆｡°✩','✩°｡⋆','Sparkle divider'],['༶•┈┈⛧','⛧┈┈•༶','Mystic divider'],
  ['──『◆』','『◆』──','Diamond brackets'],['✧･ﾟ:*','*:･ﾟ✧','Sparkle ornament'],
  ['══╬','╬══','Cross divider'],['◈━━━━','━━━━◈','Diamond line'],['༺━━','━━༻','Ornate line']
 ]},
 {id:'royal',label:'ROYAL & GEMS',items:[
  ['✦','✦','Stars'],['❖','❖','Geometric gems'],['💎','💎','Diamond gems'],
  ['۞','۞','Decorative emblems'],['♠','♣','Card suits'],['꙰','⛤','Mystic symbols'],['༒','༒','Dark emblem']
 ]},
 {id:'weapon',label:'WEAPON ASCII',items:[
  ['▄︻̷̿┻̿═━一','▄︻̷̿┻̿═━一','ASCII rifle'],['︻デ═一','︻デ═一','ASCII weapon'],
  ['⌐╦╦═─','⌐╦╦═─','Pixel weapon'],['︻╦̵̵͇̿̿̿̿╤──','︻╦̵̵͇̿̿̿̿╤──','Long rifle'],
  ['━╤デ╦︻','━╤デ╦︻','Reverse rifle'],['︻┳═一','︻┳═一','Tactical motif'],
  ['⚔️','⚔️','Crossed swords'],['†━━━⚔','⚔━━━†','Sword divider'],
  ['╾━╤デ╦︻','╾━╤デ╦︻','Compact rifle'],['➳➳','➳➳','Arrow motif'],
  ['➶ ━','━ ➶','Arrow divider'],['⟪⚔','⚔⟫','Crossed swords emblem']
 ]},
 {id:'skulls',label:'SKULLS & DARK',items:[
  ['☠','☠','Skulls'],['💀','💀','Skull emoji'],['༒☠','☠༒','Skull emblem'],
  ['☠︎︎ ━','━ ☠︎︎','Skull divider'],['𓆩☠︎︎','☠︎︎𓆪','Skull frame'],
  ['⛧ ☠','☠ ⛧','Occult skull'],['ᛉ ☠','☠ ᛉ','Runic skull'],
  ['♱━━☠','☠━━♱','Cross skull'],['⚰','⚰','Coffin skull'],['𖤐 ༒','༒ 𖤐','Dark ornament']
 ]},
 {id:'chains',label:'CHAINS & METAL',items:[
  ['⛓️━━━━','━━━━⛓️','Chain frame'],['⛓','⛓','Chain links'],['╾━╤デ╦︻','╾━╤デ╦︻','Metal ASCII'],
  ['⛧━━','━━⛧','Spiked divider'],['⋰⋱','⋰⋱','Sharp pattern'],['╳━━','━━╳','Cross metal'],
  ['▓▒░','░▒▓','Industrial pattern'],['═╪','╪═','Metal divider'],
  ['⛓༒','༒⛓','Dark chains'],['𖤐━━','━━𖤐','Star metal']
 ]},
 {id:'casino',label:'CASINO',items:[
  ['♠️','♠️','Spade'],['♥️','♥️','Heart'],['♣️','♣️','Club'],['♦️','♦️','Diamond'],
  ['🂡','🃑','Playing cards'],['♛♠','♠♛','Jackpot'],['♦━━','━━♦','Casino frame'],
  ['★ 777','777 ★','Lucky seven'],['🎰','🎰','Slot machine'],
  ['🃏 ♠','♠ 🃏','Joker cards']
 ]},
 {id:'cyber',label:'CYBER & HACKER',items:[
  ['⫷','⫸','Cyber brackets'],['⟦ SYSTEM','SYSTEM ⟧','System frame'],['░▒▓█','█▓▒░','Digital bars'],
  ['╳╳','╳╳','Cross pattern'],['⌁','⌁','Wave pattern'],['⌬','⌬','Tech hexagons'],
  ['⟁','⟁','Tech triangles'],['⊗━━','━━⊗','Tech divider'],['⫷ 404','404 ⫸','Error frame'],
  ['◢◤','◢◤','Cyber pattern']
 ]},
 {id:'wings',label:'WINGS & SYMBOLS',items:[
  ['➤','➤','Arrows'],['➳','➳','Decorative arrows'],['➵━━','━━➵','Arrow divider'],
  ['𓆩♡','♡𓆪','Heart wings'],['༺🪽','🪽༻','Wings frame'],['꧁༺🦇','🦇༻꧂','Bat frame'],
  ['☯','☯','Yin yang'],['❂','❂','Sun symbols'],['⟡','⟡','Diamond stars'],['༄','༄','Decorative marks']
 ]}
];

const state = { style:'normal', category:'all', selected:[], destination:'Имя профиля' };
function normalizeDecoration(item) {
  if (typeof item === 'string') return {left:item,right:item,label:item};
  return {left:item.left||'',right:item.right||'',label:item.label||item.left||''};
}
let favoriteStyles = readStore(STORAGE.styles, []);
let favoriteCompositions = readStore(STORAGE.compositions, []);

function readStore(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : fallback; }
  catch (_) { return fallback; }
}
function saveStore() {
  try {
    localStorage.setItem(STORAGE.styles, JSON.stringify(favoriteStyles));
    localStorage.setItem(STORAGE.compositions, JSON.stringify(favoriteCompositions));
    localStorage.setItem(STORAGE.state, JSON.stringify({
      text:$('sourceText').value, style:state.style, category:state.category,
      selected:state.selected, placement:$('placement').value, separator:$('separator').value,
      center:$('centerText').checked
    }));
  } catch (_) {}
}
function transformText(input, styleId) {
  const maps = {
    bold:['𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭','𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇','𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'],
    italic:['𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡','𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻',''],
    boldItalic:['𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕','𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯',''],
    script:['𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵','𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏',''],
    fraktur:['𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ','𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷',''],
    double:['𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ','𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫','𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'],
    mono:['𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉','𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣','𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'],
    boldScript:['𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩','𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃',''],
    medieval:['𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅','𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟','']
  };
  const alias = {antique:'fraktur',decorativeScript:'script',darkElite:'boldItalic',elite:'bold'};
  const mapId = alias[styleId] || styleId;
  const map = maps[mapId];
  const upper = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), lower = Array.from('abcdefghijklmnopqrstuvwxyz'), nums = Array.from('0123456789');
  const up = map ? Array.from(map[0]) : [], low = map ? Array.from(map[1]) : [], dig = map ? Array.from(map[2]) : [];
  const lookup = new Map();
  upper.forEach((c,i)=>lookup.set(c,up[i]||c)); lower.forEach((c,i)=>lookup.set(c,low[i]||c)); nums.forEach((c,i)=>lookup.set(c,dig[i]||c));
  let result = Array.from(input).map(ch => {
    if (styleId === 'full') { const cp=ch.codePointAt(0); return ch===' '?'　':(cp>=33&&cp<=126?String.fromCodePoint(cp+0xFEE0):ch); }
    if (styleId === 'smallcaps') { const m={A:'ᴀ',B:'ʙ',C:'ᴄ',D:'ᴅ',E:'ᴇ',F:'ғ',G:'ɢ',H:'ʜ',I:'ɪ',J:'ᴊ',K:'ᴋ',L:'ʟ',M:'ᴍ',N:'ɴ',O:'ᴏ',P:'ᴘ',Q:'ǫ',R:'ʀ',S:'s',T:'ᴛ',U:'ᴜ',V:'ᴠ',W:'ᴡ',X:'x',Y:'ʏ',Z:'ᴢ'};return m[ch.toUpperCase()]||ch; }
    if (styleId==='circled'||styleId==='negativeCircled') { const c=ch.toUpperCase().charCodeAt(0);if(c>=65&&c<=90)return String.fromCodePoint((styleId==='circled'?0x24B6:0x1F150)+c-65);const n=Number(ch);if(styleId==='circled'&&Number.isInteger(n)&&n>=1&&n<=9)return String.fromCodePoint(0x2460+n-1);return ch; }
    if (styleId==='squared'||styleId==='negativeSquared') { const c=ch.toUpperCase().charCodeAt(0);if(c>=65&&c<=90)return String.fromCodePoint((styleId==='squared'?0x1F130:0x1F170)+c-65);return ch; }
    if (styleId==='upsideDown') { const f={a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z'};return f[ch.toLowerCase()]||ch; }
    if (styleId==='hacker') return ({A:'4',a:'4',E:'3',e:'3',I:'1',i:'1',O:'0',o:'0',S:'5',s:'5',T:'7',t:'7'})[ch]||ch;
    return lookup.get(ch)||ch;
  });
  if(styleId==='upsideDown') result.reverse();
  let text=result.join('');
  if(styleId==='darkElite'||styleId==='elite') text=`『 ${text} 』`;
  if(styleId==='underground') text=`〆 ${text} 〆`;
  if(styleId==='cyber') text=`⟦ ${text} ⟧`;
  if(styleId==='hacker') text=`[ ${text} ]`;
  return text;
}
function getOutput() {
  const text=transformText($('sourceText').value,state.style);
  const decorations=state.selected.map(normalizeDecoration);
  const sep={none:'',line:'────────────',dots:'· · · · · · · · ·',stars:'✦ ─ ✦ ─ ✦',wave:'〜〜〜〜〜〜〜'}[$('separator').value]||'';
  const lines=text.split('\n');
  if(sep){const out=[];lines.forEach((line,i)=>{if(i)out.push(sep);out.push(line);});lines.splice(0,lines.length,...out);}
  const left=decorations.map(x=>x.left).filter(Boolean).join(' ');
  const right=decorations.map(x=>x.right).filter(Boolean).join(' ');
  const placement=$('placement').value;
  let output=lines.join('\n');
  if(placement==='both'&&(left||right)) output=`${left}\n${output}\n${right}`;
  else if(placement==='top'&&left) output=`${left}\n${output}`;
  else if(placement==='bottom'&&right) output=`${output}\n${right}`;
  else if(placement==='sides') output=lines.map(line=>`${left}${left?' ':''}${line}${right?' '+right:''}`).join('\n');
  if($('centerText').checked)output=output.split('\n').map(line=>line?`　${line}`:line).join('\n');
  return output.trim();
}

function renderStyles() {
  $('styleGrid').innerHTML = '';
  styles.forEach(item => {
    const wrap = document.createElement('div'); wrap.className = 'style-card-wrap';
    const btn = document.createElement('button'); btn.type='button'; btn.className='style-card'+(state.style===item.id?' active':'');
    btn.innerHTML = `<strong>${item.name}</strong><small>${item.desc} · ${item.sample}</small>`;
    btn.addEventListener('click',()=>{state.style=item.id;renderStyles();renderAll();});
    const star = document.createElement('button'); star.type='button'; star.className='style-star'+(favoriteStyles.includes(item.id)?' is-favorite':'');
    star.textContent = favoriteStyles.includes(item.id)?'★':'☆'; star.title='Добавить в избранное'; star.setAttribute('aria-label',`Избранное: ${item.name}`);
    star.addEventListener('click',()=>{favoriteStyles = favoriteStyles.includes(item.id)?favoriteStyles.filter(x=>x!==item.id):[...favoriteStyles,item.id];renderStyles();renderFavorites();saveStore();});
    wrap.append(btn,star); $('styleGrid').append(wrap);
  });
}
function renderCategories() {
  $('symbolCategories').innerHTML='';
  symbolSets.forEach(cat=>{
    const btn=document.createElement('button');btn.type='button';btn.className='chip'+(state.category===cat.id?' active':'');
    btn.textContent=cat.label;btn.addEventListener('click',()=>{state.category=cat.id;renderCategories();renderSymbols();});$('symbolCategories').append(btn);
  });
}
function renderSymbols() {
  const query=$('symbolSearch').value.trim().toLocaleLowerCase();
  const source=symbolSets.filter(c=>c.id!=='all'&&(state.category==='all'||c.id===state.category));
  const items=[];
  source.forEach(c=>(c.items||[]).forEach(([left,right,name])=>items.push({left,right,name,category:c.label})));
  const filtered=items.filter(x=>!query||`${x.left} ${x.right} ${x.name} ${x.category}`.toLocaleLowerCase().includes(query));
  $('symbolGrid').innerHTML='';
  if(!filtered.length){const empty=document.createElement('span');empty.className='empty';empty.textContent='Ничего не найдено';$('symbolGrid').append(empty);return;}
  filtered.forEach(item=>{
    const btn=document.createElement('button');btn.type='button';btn.className='symbol';
    btn.textContent=item.left===item.right?item.left:`${item.left}  ${item.right}`;
    btn.title=`${item.name} · добавить украшение`;
    btn.setAttribute('aria-label',`${item.name}: ${item.left} … ${item.right}`);
    btn.addEventListener('click',()=>{
      state.selected.push({left:item.left,right:item.right,label:item.name});
      renderSelected();renderAll();saveStore();
    });
    $('symbolGrid').append(btn);
  });
}
function renderSelected() {
  const root=$('selectedSymbols');root.innerHTML='';
  if(!state.selected.length){const empty=document.createElement('span');empty.className='empty';empty.textContent='Пока ничего не выбрано';root.append(empty);return;}
  state.selected.forEach((raw,index)=>{
    const deco=normalizeDecoration(raw);
    const item=document.createElement('span');item.className='selected-item';
    const text=document.createElement('span');text.textContent=`${deco.left}${deco.left&&deco.right?' … ':''}${deco.right}`;
    text.title=deco.label||'Украшение';
    const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.title='Убрать украшение';remove.setAttribute('aria-label','Убрать украшение');
    remove.addEventListener('click',()=>{state.selected.splice(index,1);renderSelected();renderAll();saveStore();});
    item.append(text,remove);root.append(item);
  });
}

function renderFavorites() {
  const root=$('favoriteStyles');root.innerHTML='';
  const chosen=styles.filter(s=>favoriteStyles.includes(s.id));
  if(!chosen.length){const e=document.createElement('span');e.className='empty';e.textContent='Отметь звёздочкой понравившиеся стили';root.append(e);}
  chosen.forEach(s=>{const b=document.createElement('button');b.type='button';b.className='favorite-style';b.innerHTML=`<span>✦</span><span><b>${s.name}</b><small>${s.desc}</small></span>`;b.addEventListener('click',()=>{state.style=s.id;renderStyles();renderAll();});root.append(b);});
  const comps=$('favoriteCompositions');comps.innerHTML='';
  if(!favoriteCompositions.length){const e=document.createElement('span');e.className='empty';e.textContent='Сохранённых композиций пока нет';comps.append(e);}
  favoriteCompositions.forEach((c,i)=>{
    const row=document.createElement('div');row.className='favorite-composition';
    const load=document.createElement('button');load.type='button';load.className='favorite-composition-main';
    const title=document.createElement('b');title.textContent=c.name;
    const sub=document.createElement('small');sub.textContent=(c.text||'').slice(0,65);
    load.append(title,sub);load.addEventListener('click',()=>{ $('sourceText').value=c.text;state.style=c.style||'normal';state.selected=(c.selected||[]).map(normalizeDecoration);$('placement').value=c.placement||'both';$('separator').value=c.separator||'none';$('centerText').checked=!!c.center;renderStyles();renderSelected();renderAll();saveStore();});
    const del=document.createElement('button');del.type='button';del.className='favorite-delete';del.textContent='×';del.title='Удалить композицию';del.addEventListener('click',()=>{favoriteCompositions.splice(i,1);renderFavorites();saveStore();});
    row.append(load,del);comps.append(row);
  });
}
function renderAll() {
  const output=getOutput();$('preview').textContent=output||'Твой результат появится здесь';$('outputCount').textContent=`${Array.from(output).length} символов`;
  $('charCount').textContent=`${Array.from($('sourceText').value).length} символов`;
  saveStore();
}
function restoreState() {
  try {
    const saved=JSON.parse(localStorage.getItem(STORAGE.state)||'null');
    if(!saved)return;
    if(typeof saved.text==='string')$('sourceText').value=saved.text;
    if(styles.some(s=>s.id===saved.style))state.style=saved.style;
    if(symbolSets.some(s=>s.id===saved.category))state.category=saved.category;
    if(Array.isArray(saved.selected))state.selected=saved.selected.map(normalizeDecoration);
    if(['both','top','bottom','sides'].includes(saved.placement))$('placement').value=saved.placement;
    if(['none','line','dots','stars','wave'].includes(saved.separator))$('separator').value=saved.separator;
    $('centerText').checked=!!saved.center;
  } catch (_) {}
}
function copyOutput() {
  const value=getOutput();if(!value){$('copyStatus').textContent='Сначала введи текст';return;}
  const fallback=()=>{const area=document.createElement('textarea');area.value=value;document.body.append(area);area.select();try{document.execCommand('copy');$('copyStatus').textContent='Скопировано! Можно вставлять в Telegram.';}catch(_){$('copyStatus').textContent='Не удалось скопировать автоматически';}area.remove();};
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(value).then(()=>$('copyStatus').textContent='Скопировано! Можно вставлять в Telegram.').catch(fallback);}else fallback();
}
function downloadOutput() {
  const blob=new Blob([getOutput()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='paradox-font-studio.txt';document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function init() {
  restoreState();renderStyles();renderCategories();renderSymbols();renderSelected();renderFavorites();renderAll();
  $('sourceText').addEventListener('input',renderAll);
  ['placement','separator','centerText'].forEach(id=>$(id).addEventListener('change',renderAll));
  $('symbolSearch').addEventListener('input',renderSymbols);
  $('clearBtn').addEventListener('click',()=>{$('sourceText').value='';renderAll();$('sourceText').focus();});
  $('clearDecor').addEventListener('click',()=>{state.selected=[];renderSelected();renderAll();});
  $('copyBtn').addEventListener('click',copyOutput);
  $('downloadBtn').addEventListener('click',downloadOutput);
  $('saveFavoriteBtn').addEventListener('click',()=>{
    const text=$('sourceText').value.trim();if(!text){$('copyStatus').textContent='Добавь текст перед сохранением композиции';return;}
    const name=prompt('Название композиции:','Моя композиция');if(!name)return;
    favoriteCompositions.unshift({name:name.slice(0,60),text,style:state.style,selected:[...state.selected],placement:$('placement').value,separator:$('separator').value,center:$('centerText').checked});
    favoriteCompositions=favoriteCompositions.slice(0,50);renderFavorites();saveStore();
  });
  document.querySelectorAll('.destination').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.destination').forEach(x=>x.classList.remove('active'));btn.classList.add('active');state.destination=btn.dataset.target;
    const hints={'Имя профиля':'Для имени профиля лучше использовать короткий вариант. Telegram может ограничивать длину поля.','О себе / BIO':'Для BIO подойдут композиции с рамками, разделителями и короткими строками.','Сообщение':'Для сообщения можно использовать длинные композиции и несколько строк.'};
    $('destinationHint').textContent=hints[state.destination];
  }));
}
document.addEventListener('DOMContentLoaded',init);
