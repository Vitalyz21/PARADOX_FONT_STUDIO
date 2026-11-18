const $=id=>document.getElementById(id);
const maps={
  'Обычный':null,
  'Жирный':{A:0x1D400,a:0x1D41A,digit:0x1D7CE},
  'Курсив':{A:0x1D434,a:0x1D44E},
  'Жирный курсив':{A:0x1D468,a:0x1D482},
  'Готический':{A:0x1D504,a:0x1D51E},
  'Моноширинный':{A:0x1D670,a:0x1D68A,digit:0x1D7F6},
  'Двойной контур':{A:0x1D538,a:0x1D552,digit:0x1D7D8},
  'Полноширинный':{A:0xFF21,a:0xFF41,digit:0xFF10},
  'Обведённый':{A:0x24B6,a:0x24D0,digit:0x2460},
  'Малые заглавные':{A:0x1D00,a:0x1D00,small:true}
};
const styles=Object.keys(maps);
let activeStyle='Жирный',category='Все',chosen=[];
const categories={'Все':'','Звёзды':'✦ ✧ ★ ☆ ⋆ ⭑ ✩ ✪ ✫ ✬ ✭ ✮ ✯','Сердца':'♡ ♥ ❤ ❥ ღ დ ۵','Стрелки':'➜ ➤ ➳ ➵ ➸ ⇢ ⇝ ↠','Рамки':'❖ ◈ ◇ ◆ ▣ ▪ ▫','Цветы':'❀ ✿ ❁ ❃ ❋ ⚘','Линии':'─ ━ ═ 〜 ⋯ · •'};
function transform(text,name){const m=maps[name];if(!m)return text;return [...text].map(ch=>{const c=ch.codePointAt(0);if(c>=65&&c<=90){if(m.small)return String.fromCodePoint(c===65?0x1D00:c===66?0x0299:c===67?0x1D04:c===68?0x1D05:c===69?0x1D07:c===70?0xA730:c===71?0x0262:c===72?0x029C:c===73?0x026A:c===74?0x1D0A:c===75?0x1D0B:c===76?0x029F:c===77?0x1D0D:c===78?0x0274:c===79?0x1D0F:c===80?0x1D18:c===82?0x0280:c===83?0xA731:c===84?0x1D1B:c===85?0x1D1C:c===86?0x1D20:c===87?0x1D21:c===88?0x0445:c===89?0x028F:0x1D22)}return String.fromCodePoint(m.A+c-65)}if(c>=97&&c<=122)return String.fromCodePoint(m.a+c-97);if(m.digit&&c>=48&&c<=57)return String.fromCodePoint(m.digit+c-48);return ch}).join('')}
function renderStyles(){$('styleGrid').innerHTML=styles.map(s=>`<button class="style-card ${s===activeStyle?'active':''}" data-style="${s}"><strong>${transform('Abc 123',s)}</strong><small>${s}</small></button>`).join('');document.querySelectorAll('[data-style]').forEach(b=>b.onclick=()=>{activeStyle=b.dataset.style;renderStyles();render()})}
function renderCategories(){$('symbolCategories').innerHTML=Object.keys(categories).map(c=>`<button class="chip ${c===category?'active':''}" data-cat="${c}">${c}</button>`).join('');document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{category=b.dataset.cat;renderCategories();renderSymbols()})}
function renderSymbols(){const query=$('symbolSearch').value.trim().toLowerCase();let chars=category==='Все'?Object.values(categories).join(''):categories[category];chars=[...new Set([...chars])].filter(x=>!query||x.includes(query));$('symbolGrid').innerHTML=chars.map((s,i)=>`<button class="symbol" title="Добавить ${s}" data-symbol="${s}">${s}</button>`).join('');document.querySelectorAll('[data-symbol]').forEach(b=>b.onclick=()=>{chosen.push(b.dataset.symbol);renderChosen();render()})}
function renderChosen(){$('selectedSymbols').innerHTML=chosen.length?chosen.map((s,i)=>`<span class="selected-item">${s}<button aria-label="Удалить" data-remove="${i}">×</button></span>`).join(''):'<span class="empty">Пока ничего нет</span>';document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{chosen.splice(+b.dataset.remove,1);renderChosen();render()})}
function makeOutput(){let raw=$('sourceText').value;let lines=transform(raw,activeStyle).split('\n');const sep={none:'',line:'────────────',dots:'· · · · · · · · ·',stars:'✦ ─ ✦ ─ ✦',wave:'〜〜〜〜〜〜〜'}[$('separator').value];if(sep&&lines.length>1)lines=lines.join('\n').split('\n').join('\n'+sep+'\n').split('\n');let text=lines.join('\n');if($('centerText').checked)text=text.split('\n').map(x=>x?'　'+x:'').join('\n');const deco=chosen.join(' ');const place=$('placement').value;if(deco){if(place==='top'||place==='both')text=deco+'\n'+text;if(place==='bottom'||place==='both')text=text+'\n'+deco;if(place==='sides')text=text.split('\n').map(x=>x?deco+'  '+x+'  '+deco:x).join('\n')}return text}
function render(){const out=makeOutput();$('preview').textContent=out||'Твой результат появится здесь';$('charCount').textContent=$('sourceText').value.length+' символов';$('outputCount').textContent=out.length+' символов';try{localStorage.setItem('paradoxDraft',JSON.stringify({source:$('sourceText').value,activeStyle,chosen,placement:$('placement').value,separator:$('separator').value,center:$('centerText').checked}))}catch(e){}}
$('sourceText').addEventListener('input',render);['placement','separator','centerText'].forEach(id=>$(id).addEventListener('change',render));$('symbolSearch').addEventListener('input',renderSymbols);
$('clearBtn').onclick=()=>{$('sourceText').value='';render()};$('clearDecor').onclick=()=>{chosen=[];renderChosen();render()};
$('copyBtn').onclick=async()=>{const text=makeOutput();if(!text)return;$('copyStatus').textContent='';try{await navigator.clipboard.writeText(text);$('copyStatus').textContent='✓ Текст скопирован — можно вставлять в Telegram'}catch(e){const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();$('copyStatus').textContent=ok?'✓ Текст скопирован':'Не удалось скопировать. Выдели текст вручную.'}};
$('downloadBtn').onclick=()=>{const blob=new Blob([makeOutput()],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='paradox-telegram-text.txt';a.click();URL.revokeObjectURL(a.href)};
const hints={'Имя профиля':'Для имени профиля лучше использовать короткий вариант. Telegram может ограничивать длину поля.','О себе / BIO':'Для BIO подойдут несколько строк, разделители и декоративные символы. Учитывай лимит символов Telegram.','Сообщение':'Для сообщений можно использовать длинный текст, переносы строк и украшения.'};
document.querySelectorAll('[data-target]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-target]').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('destinationHint').textContent=hints[b.dataset.target]});
try{const saved=JSON.parse(localStorage.getItem('paradoxDraft')||'null');if(saved){$('sourceText').value=saved.source??$('sourceText').value;activeStyle=saved.activeStyle||activeStyle;chosen=saved.chosen||[];$('placement').value=saved.placement||'both';$('separator').value=saved.separator||'none';$('centerText').checked=!!saved.center}}catch(e){}
renderStyles();renderCategories();renderSymbols();renderChosen();render();
