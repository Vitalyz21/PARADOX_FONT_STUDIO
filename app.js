(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const STORAGE_KEY = 'paradoxDraft';
  const FAVORITES_KEY = 'paradoxFavoritesV1';

  const smallCaps = {a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ'};
  const special = {
    frakturUpper:['𝔄','𝔅','ℭ','𝔇','𝔈','𝔉','𝔊','ℌ','ℑ','𝔍','𝔎','𝔏','𝔐','𝔑','𝔒','𝔓','𝔔','ℜ','𝔖','𝔗','𝔘','𝔙','𝔚','𝔛','𝔜','ℨ'],
    frakturLower:Array.from('𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷'),
    scriptUpper:Array.from('𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵'),
    doubleUpper:['𝔸','𝔹','ℂ','𝔻','𝔼','𝔽','𝔾','ℍ','𝕀','𝕁','𝕂','𝕃','𝕄','ℕ','𝕆','ℙ','ℚ','ℝ','𝕊','𝕋','𝕌','𝕍','𝕎','𝕏','𝕐','ℤ']
  };

  const styleDefs = [
    {name:'Обычный',key:'normal',sample:'Abc 123'},
    {name:'Жирный',key:'bold',sample:'𝐀𝐛𝐜 𝟏𝟐𝟑'},
    {name:'Курсив',key:'italic',sample:'𝐴𝑏𝑐 123'},
    {name:'Жирный курсив',key:'boldItalic',sample:'𝑨𝒃𝒄 123'},
    {name:'Готический',key:'fraktur',sample:'𝔄𝔟𝔠 123'},
    {name:'Жирный готический',key:'boldFraktur',sample:'𝕬𝖇𝖈 123'},
    {name:'Моноширинный',key:'mono',sample:'𝙰𝚋𝚌 𝟷𝟸𝟹'},
    {name:'Двойной контур',key:'double',sample:'𝔸𝕓𝕔 𝟙𝟚𝟛'},
    {name:'Полноширинный',key:'full',sample:'Ａｂｃ １２３'},
    {name:'Обведённый',key:'circled',sample:'Ⓐⓑⓒ ①②③'},
    {name:'Малые заглавные',key:'small',sample:'ᴬʙᴄ 123'},
    {name:'Жирный без засечек',key:'sansBold',sample:'𝗔𝗯𝗰 𝟭𝟮𝟯'},
    {name:'Без засечек курсив',key:'sansItalic',sample:'𝘈𝘣𝘤 123'},
    {name:'Жирный без засечек курсив',key:'sansBoldItalic',sample:'𝘼𝙗𝙘 123'},
    {name:'Рукописный',key:'script',sample:'𝒜𝒷𝒸 123'},
    {name:'Жирный рукописный',key:'boldScript',sample:'𝓐𝓫𝓬 123'},
    {name:'Квадратный',key:'squared',sample:'🄰🄱🄲 123'},
    {name:'Негативный круг',key:'negativeCircled',sample:'🅐🅑🅒 ①②③'}
  ];

  const categories = {
    'Звёзды':{terms:['звезда','звёзды','star','искры'],chars:'✦ ✧ ★ ☆ ⋆ ⭑ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ⁂ ⁎ ⁑ ٭ ✵ ✶ ✷ ✸ ✹ ✺'},
    'Сердца':{terms:['сердце','сердца','heart','любовь'],chars:'♡ ♥ ❤ ❥ ❣ ღ დ ۵ ლ 💚 💙 💜 🖤 🤍 💗 💖 💘'},
    'Стрелки':{terms:['стрелка','стрелки','arrow','указатель'],chars:'➜ ➤ ➳ ➵ ➸ ➺ ➻ ➼ ➽ ⇢ ⇝ ↠ ↣ ↦ ↬ ⇨ ⇾ ⟶ ⟹'},
    'Рамки':{terms:['рамка','ромб','квадрат','frame'],chars:'❖ ◈ ◇ ◆ ▣ ▪ ▫ ◌ ◎ ◉ ◍ ◐ ◑ ◒ ◓ ⬖ ⬗ ⬘ ⬙'},
    'Цветы':{terms:['цветок','цветы','flower','лист'],chars:'❀ ✿ ❁ ❃ ❋ ⚘ ✾ ✽ ❊ ❉ ❈ ❇ ☘ 🍀 🌸 🌺 🌼'},
    'Линии':{terms:['линия','разделитель','точки','line'],chars:'─ ━ ═ 〜 ⋯ · • ‧ ⁃ ┄ ┅ ┈ ┉ ┊ ┋ ╍ ╎ ╏ ╌ ╴ ╶'},
    'Короны':{terms:['корона','короны','crown','король','королева'],chars:'♔ ♕ ♚ ♛ 👑 ⚜ ♜ ♝ ♞ ♟'},
    'Музыка':{terms:['музыка','нота','ноты','music'],chars:'♪ ♫ ♬ ♩ ♭ ♮ ♯ 𝄞 𝄢'},
    'Магия':{terms:['магия','луна','солнце','звёздное','magic'],chars:'☾ ☽ ☼ ☀ ☁ ☂ ☄ ✨ 🔮 ⚝ ⚚'},
    'Геометрия':{terms:['геометрия','фигура','круг','треугольник'],chars:'○ ● ◯ ◦ ⦿ ◉ ◎ △ ▲ ▽ ▼ □ ■ ▢ ▣ ◇ ◆ ⬡ ⬢'},
    'Знаки':{terms:['знак','символ','крест','плюс','минус'],chars:'† ‡ ※ ⁕ ⁖ ⁘ ⁙ ⁜ ⁂ ⁑ ⊹ ⊱ ⊰ ⊶ ⊷ ⊳ ⊲'},
    'Зодиак':{terms:['зодиак','знак зодиака','гороскоп'],chars:'♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓'},
    'Погода':{terms:['погода','солнце','дождь','снег'],chars:'☀ ☼ ☁ ☂ ☃ ❄ ❅ ❆ ☄ 🌙'}
  };

  let activeStyle='bold', activeCategory='Все', chosen=[];
  let favoriteStyles=[], favoriteCompositions=[];
  let saveTimer=null;

  const mathematicalBases = {
    bold:{upper:0x1D400,lower:0x1D41A,digits:0x1D7CE},
    italic:{upper:0x1D434,lower:0x1D44E},
    boldItalic:{upper:0x1D468,lower:0x1D482},
    mono:{upper:0x1D670,lower:0x1D68A,digits:0x1D7F6},
    double:{upper:null,lower:0x1D552,digits:0x1D7D8},
    full:{upper:0xFF21,lower:0xFF41,digits:0xFF10},
    boldFraktur:{upper:0x1D56C,lower:0x1D586},
    sansBold:{upper:0x1D5D4,lower:0x1D5EE,digits:0x1D7EC},
    sansItalic:{upper:0x1D608,lower:0x1D622},
    sansBoldItalic:{upper:0x1D63C,lower:0x1D656},
    script:{upper:0x1D49C,lower:0x1D4B6},
    boldScript:{upper:0x1D4D0,lower:0x1D4EA}
  };

  function mapChar(ch,key){
    const cp=ch.codePointAt(0), upper=cp>=65&&cp<=90, lower=cp>=97&&cp<=122, digit=cp>=48&&cp<=57;
    const offset=upper?cp-65:lower?cp-97:digit?cp-48:-1;
    if(key==='normal'||offset<0)return ch;
    if(key==='small')return lower?(smallCaps[ch]||ch):ch;
    if(key==='fraktur')return upper?special.frakturUpper[offset]:lower?special.frakturLower[offset]:ch;
    if(key==='script'&&upper)return special.scriptUpper[offset];
    if(key==='double'&&upper)return special.doubleUpper[offset];
    if(key==='circled'){
      if(upper)return String.fromCodePoint(0x24B6+offset);
      if(lower)return String.fromCodePoint(0x24D0+offset);
      if(digit)return offset===0?'⓪':String.fromCodePoint(0x2460+offset-1);
    }
    if(key==='squared'&&upper)return String.fromCodePoint(0x1F130+offset);
    if(key==='negativeCircled'&&upper)return String.fromCodePoint(0x1F150+offset);
    const base=mathematicalBases[key];
    if(!base)return ch;
    if(digit&&base.digits)return String.fromCodePoint(base.digits+offset);
    if(upper&&base.upper!==null&&base.upper!==undefined)return String.fromCodePoint(base.upper+offset);
    if(lower&&base.lower!==null&&base.lower!==undefined){
      if(key==='italic'&&ch==='h')return 'ℎ';
      return String.fromCodePoint(base.lower+offset);
    }
    return ch;
  }
  const transform=(text,key)=>Array.from(text,ch=>mapChar(ch,key)).join('');

  function renderStyles(){
    $('styleGrid').innerHTML=styleDefs.map(style=>{
      const active=style.key===activeStyle?' active':'';
      const starred=favoriteStyles.includes(style.key);
      return `<div class="style-card-wrap"><button type="button" class="style-card${active}" data-style="${style.key}" aria-pressed="${style.key===activeStyle}"><strong>${style.sample}</strong><small>${style.name}</small></button><button type="button" class="style-star${starred?' is-favorite':''}" data-favorite-style="${style.key}" aria-label="${starred?'Убрать из':'Добавить в'} избранное">${starred?'★':'☆'}</button></div>`;
    }).join('');
    $('styleGrid').querySelectorAll('[data-style]').forEach(button=>button.addEventListener('click',()=>{activeStyle=button.dataset.style;renderStyles();render();}));
    $('styleGrid').querySelectorAll('[data-favorite-style]').forEach(button=>button.addEventListener('click',()=>{
      const key=button.dataset.favoriteStyle;
      favoriteStyles=favoriteStyles.includes(key)?favoriteStyles.filter(x=>x!==key):[...favoriteStyles,key];
      saveFavorites();renderStyles();renderFavoriteStyles();
    }));
  }

  function renderCategories(){
    const names=['Все',...Object.keys(categories)];
    $('symbolCategories').innerHTML=names.map(name=>`<button type="button" class="chip${name===activeCategory?' active':''}" data-category="${name}">${name}</button>`).join('');
    $('symbolCategories').querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{activeCategory=button.dataset.category;renderCategories();renderSymbols();}));
  }
  function renderSymbols(){
    const query=$('symbolSearch').value.trim().toLocaleLowerCase('ru');
    const source=activeCategory==='Все'?Object.entries(categories):[[activeCategory,categories[activeCategory]]];
    const items=[];
    source.forEach(([name,data])=>{
      const matchName=!query||name.toLocaleLowerCase('ru').includes(query)||data.terms.some(term=>term.includes(query));
      Array.from(data.chars).forEach(char=>{if(!query||matchName||char.includes(query))items.push({char,name});});
    });
    const unique=[...new Map(items.map(item=>[item.char,item])).values()];
    $('symbolGrid').innerHTML=unique.length?unique.map(item=>`<button type="button" class="symbol" title="${item.name}: ${item.char}" aria-label="Добавить ${item.name} ${item.char}" data-symbol="${item.char}">${item.char}</button>`).join(''):'<span class="empty">Ничего не найдено. Попробуй другое слово или символ.</span>';
    $('symbolGrid').querySelectorAll('[data-symbol]').forEach(button=>button.addEventListener('click',()=>{chosen.push(button.dataset.symbol);renderChosen();render();}));
  }
  function renderChosen(){
    $('selectedSymbols').innerHTML=chosen.length?chosen.map((symbol,index)=>`<span class="selected-item">${symbol}<button type="button" aria-label="Удалить ${symbol}" data-remove="${index}">×</button></span>`).join(''):'<span class="empty">Пока ничего нет</span>';
    $('selectedSymbols').querySelectorAll('[data-remove]').forEach(button=>button.addEventListener('click',()=>{chosen.splice(Number(button.dataset.remove),1);renderChosen();render();}));
  }

  function makeOutput(state){
    const s=state||{source:$('sourceText').value,activeStyle,chosen,placement:$('placement').value,separator:$('separator').value,center:$('centerText').checked};
    let lines=transform(s.source||'',s.activeStyle||'normal').split('\n');
    const separators={none:'',line:'────────────',dots:'· · · · · · · · ·',stars:'✦ ─ ✦ ─ ✦',wave:'〜〜〜〜〜〜〜'};
    const separator=separators[s.separator]||'';
    if(separator&&lines.length>1)lines=lines.flatMap((line,index)=>index<lines.length-1?[line,separator]:[line]);
    let output=lines.join('\n');
    if(s.center)output=output.split('\n').map(line=>line?'　'+line:'').join('\n');
    const decoration=(s.chosen||[]).join(' '), placement=s.placement||'both';
    if(decoration){
      if(placement==='top'||placement==='both')output=decoration+(output?'\n'+output:'');
      if(placement==='bottom'||placement==='both')output=(output?output+'\n':'')+decoration;
      if(placement==='sides')output=output.split('\n').map(line=>line?`${decoration}  ${line}  ${decoration}`:line).join('\n');
    }
    return output;
  }
  function currentState(){return {source:$('sourceText').value,activeStyle,chosen:[...chosen],placement:$('placement').value,separator:$('separator').value,center:$('centerText').checked};}
  function saveState(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(currentState()));}catch(_){ }},100);}
  function render(){const output=makeOutput();$('preview').textContent=output||'Твой результат появится здесь';$('charCount').textContent=`${Array.from($('sourceText').value).length} символов`;$('outputCount').textContent=`${Array.from(output).length} символов`;saveState();}

  function saveFavorites(){try{localStorage.setItem(FAVORITES_KEY,JSON.stringify({styles:favoriteStyles,compositions:favoriteCompositions}));}catch(_){}}
  function renderFavoriteStyles(){
    const host=$('favoriteStyles');
    host.innerHTML=favoriteStyles.length?favoriteStyles.map(key=>{const item=styleDefs.find(s=>s.key===key);return item?`<button type="button" class="favorite-style" data-use-style="${key}"><span>${item.sample}</span><small>${item.name}</small><b>↗</b></button>`:''}).join(''):'<span class="empty">Отметь звёздочкой понравившиеся стили</span>';
    host.querySelectorAll('[data-use-style]').forEach(button=>button.addEventListener('click',()=>{activeStyle=button.dataset.useStyle;renderStyles();render();}));
  }
  function renderFavoriteCompositions(){
    const host=$('favoriteCompositions');
    host.innerHTML=favoriteCompositions.length?favoriteCompositions.map(item=>`<article class="favorite-composition"><button type="button" class="favorite-composition-main" data-load-favorite="${item.id}"><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.preview||'Пустая композиция')}</small></button><button type="button" class="favorite-delete" data-delete-favorite="${item.id}" aria-label="Удалить из избранного">×</button></article>`).join(''):'<span class="empty">Сохранённых композиций пока нет</span>';
    host.querySelectorAll('[data-load-favorite]').forEach(button=>button.addEventListener('click',()=>{
      const item=favoriteCompositions.find(x=>x.id===button.dataset.loadFavorite);if(!item)return;
      const s=item.state;$('sourceText').value=s.source||'';activeStyle=s.activeStyle||'normal';chosen=Array.isArray(s.chosen)?[...s.chosen]:[];$('placement').value=s.placement||'both';$('separator').value=s.separator||'none';$('centerText').checked=!!s.center;
      renderStyles();renderChosen();render();$('copyStatus').textContent='Композиция загружена из избранного.';
      $('sourceText').scrollIntoView({behavior:'smooth',block:'center'});
    }));
    host.querySelectorAll('[data-delete-favorite]').forEach(button=>button.addEventListener('click',()=>{favoriteCompositions=favoriteCompositions.filter(x=>x.id!==button.dataset.deleteFavorite);saveFavorites();renderFavoriteCompositions();}));
  }
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function loadFavorites(){try{const data=JSON.parse(localStorage.getItem(FAVORITES_KEY)||'{}');if(Array.isArray(data.styles))favoriteStyles=data.styles.filter(key=>styleDefs.some(s=>s.key===key));if(Array.isArray(data.compositions))favoriteCompositions=data.compositions.filter(x=>x&&typeof x.id==='string'&&x.state).slice(0,50);}catch(_){favoriteStyles=[];favoriteCompositions=[];}}
  function addFavoriteComposition(){
    const output=makeOutput();if(!output){$('copyStatus').textContent='Сначала введи текст, чтобы сохранить композицию.';return;}
    if(favoriteCompositions.length>=50){$('copyStatus').textContent='Достигнут лимит: можно сохранить до 50 композиций.';return;}
    const defaultName=`Композиция ${favoriteCompositions.length+1}`;
    const name=window.prompt('Название избранной композиции:',defaultName);
    if(name===null)return;
    const cleanName=name.trim().slice(0,50)||defaultName;
    favoriteCompositions.unshift({id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name:cleanName,preview:output.slice(0,90),state:currentState()});
    saveFavorites();renderFavoriteCompositions();$('copyStatus').textContent='★ Композиция сохранена в избранное.';
  }

  async function copyText(){const text=makeOutput();if(!text){$('copyStatus').textContent='Сначала введи текст или добавь украшение.';return;}$('copyStatus').textContent='';try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else throw new Error('Clipboard unavailable');$('copyStatus').textContent='✓ Текст скопирован — можно вставлять в Telegram';}catch(_){const temporary=document.createElement('textarea');temporary.value=text;temporary.setAttribute('readonly','');temporary.style.position='fixed';temporary.style.opacity='0';document.body.appendChild(temporary);temporary.select();temporary.setSelectionRange(0,temporary.value.length);let copied=false;try{copied=document.execCommand('copy');}catch(__){}temporary.remove();$('copyStatus').textContent=copied?'✓ Текст скопирован — можно вставлять в Telegram':'Не удалось скопировать автоматически. Выдели текст вручную.';}}
  function downloadText(){const text=makeOutput();if(!text){$('copyStatus').textContent='Сначала введи текст или добавь украшение.';return;}const blob=new Blob([text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='paradox-telegram-text.txt';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}

  const hints={'Имя профиля':'Для имени профиля лучше использовать короткий вариант. Telegram может ограничивать длину поля.','О себе / BIO':'Для BIO подойдут несколько строк, разделители и декоративные символы. Учитывай лимит символов Telegram.','Сообщение':'Для сообщений можно использовать длинный текст, переносы строк и украшения.'};
  function init(){
    try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(saved&&typeof saved==='object'){if(typeof saved.source==='string')$('sourceText').value=saved.source.slice(0,5000);if(styleDefs.some(s=>s.key===saved.activeStyle))activeStyle=saved.activeStyle;if(Array.isArray(saved.chosen))chosen=saved.chosen.filter(x=>typeof x==='string').slice(0,100);if(['both','top','bottom','sides'].includes(saved.placement))$('placement').value=saved.placement;if(['none','line','dots','stars','wave'].includes(saved.separator))$('separator').value=saved.separator;$('centerText').checked=Boolean(saved.center);}}catch(_){ }
    loadFavorites();
    $('sourceText').addEventListener('input',render);['placement','separator','centerText'].forEach(id=>$(id).addEventListener('change',render));$('symbolSearch').addEventListener('input',renderSymbols);
    $('clearBtn').addEventListener('click',()=>{$('sourceText').value='';render();});$('clearDecor').addEventListener('click',()=>{chosen=[];renderChosen();render();});$('copyBtn').addEventListener('click',copyText);$('downloadBtn').addEventListener('click',downloadText);$('saveFavoriteBtn').addEventListener('click',addFavoriteComposition);
    document.querySelectorAll('[data-target]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-target]').forEach(item=>item.classList.remove('active'));button.classList.add('active');$('destinationHint').textContent=hints[button.dataset.target];}));
    renderStyles();renderCategories();renderSymbols();renderChosen();renderFavoriteStyles();renderFavoriteCompositions();render();
  }
  document.addEventListener('DOMContentLoaded',init);
})();
