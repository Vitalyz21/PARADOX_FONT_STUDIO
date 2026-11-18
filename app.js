const $ = id => document.getElementById(id);
const canvas = $('artboard'), ctx = canvas.getContext('2d');
const defaults = {text:'PARADOX',font:'Arial',weight:'700',size:92,spacing:4,textColor:'#dce9df',bgColor:'#171d19',outline:0,shadow:18,decorations:[],project:'Без названия'};
let state = loadState() || structuredClone(defaults);
let selectedGlyph = 'P', glyphScale = 100, glyphRotate = 0, activeFilter = 'all';
const library = [
 ['✦','Звезда','symbols'],['✧','Искра','symbols'],['✺','Сияние','symbols'],['☼','Солнце','nature'],['❖','Ромб','tech'],['◆','Алмаз','tech'],
 ['♛','Корона','symbols'],['⚡','Молния','symbols'],['♠','Пика','symbols'],['♥','Сердце','symbols'],['☠','Череп','symbols'],['♜','Башня','symbols'],
 ['❧','Ветвь','nature'],['❀','Цветок','nature'],['☘','Клевер','nature'],['〰','Волна','ornament'],['༺','Орнамент 1','ornament'],['༻','Орнамент 2','ornament'],
 ['⟡','Контурный ромб','tech'],['⌁','Линия','tech'],['◈','Геометрия','tech'],['✺','Розетка','ornament'],['❋','Узор','ornament'],['⛭','Шестерня','tech']
];
function loadState(){try{return JSON.parse(localStorage.getItem('paradox-font-studio'))}catch(e){return null}}
function save(){localStorage.setItem('paradox-font-studio',JSON.stringify(state));$('saveState').textContent='● Сохранено локально';$('projectLabel').textContent=state.project}
function draw(){
 ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle=state.bgColor;ctx.fillRect(0,0,1200,600);
 // subtle framing
 ctx.strokeStyle='rgba(190,210,195,.12)';ctx.lineWidth=2;ctx.strokeRect(34,34,1132,532);
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`${state.weight} ${state.size}px "${state.font}"`;
 ctx.shadowColor=`rgba(0,0,0,${state.shadow/100})`;ctx.shadowBlur=state.shadow*1.2;ctx.shadowOffsetY=state.shadow*.35;
 const text=state.text||' '; const spacing=Number(state.spacing);
 const widths=[...text].map(ch=>ctx.measureText(ch).width);const total=widths.reduce((a,b)=>a+b,0)+Math.max(0,text.length-1)*spacing;
 let x=(1200-total)/2;const y=300;
 for(let i=0;i<text.length;i++){const w=widths[i];ctx.lineJoin='round';if(state.outline>0){ctx.lineWidth=state.outline;ctx.strokeStyle=state.bgColor;ctx.strokeText(text[i],x+w/2,y)}ctx.fillStyle=state.textColor;ctx.fillText(text[i],x+w/2,y);x+=w+spacing}
 ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 const dec=state.decorations||[];
 dec.forEach((d,i)=>{const px=d.x??(160+(i%5)*220),py=d.y??(95+Math.floor(i/5)*400);ctx.save();ctx.translate(px,py);ctx.rotate((d.rotation||0)*Math.PI/180);ctx.font=`${d.size||48}px Georgia`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=d.color||'#c7a77b';ctx.shadowColor='rgba(0,0,0,.3)';ctx.shadowBlur=8;ctx.fillText(d.symbol,0,0);ctx.restore()});
 save();
}
function syncInputs(){
 $('textInput').value=state.text;$('fontSelect').value=state.font;$('weightSelect').value=state.weight;$('sizeRange').value=state.size;$('spacingRange').value=state.spacing;$('textColor').value=state.textColor;$('bgColor').value=state.bgColor;$('outlineRange').value=state.outline;$('shadowRange').value=state.shadow;
 $('sizeOut').textContent=state.size+' px';$('spacingOut').textContent=state.spacing+' px';$('outlineOut').textContent=state.outline+' px';$('shadowOut').textContent=state.shadow+'%';
 $('projectLabel').textContent=state.project;renderDecorations();draw();
}
[['textInput','text'],['fontSelect','font'],['weightSelect','weight'],['sizeRange','size'],['spacingRange','spacing'],['textColor','textColor'],['bgColor','bgColor'],['outlineRange','outline'],['shadowRange','shadow']].forEach(([id,key])=>$(id).addEventListener('input',e=>{state[key]=['size','spacing','outline','shadow'].includes(key)?Number(e.target.value):e.target.value;syncOutputs();draw()}));
function syncOutputs(){$('sizeOut').textContent=state.size+' px';$('spacingOut').textContent=state.spacing+' px';$('outlineOut').textContent=state.outline+' px';$('shadowOut').textContent=state.shadow+'%'}
function renderDecorations(){$('decorationCount').textContent=state.decorations.length;$('activeDecorations').innerHTML='';if(!state.decorations.length){$('activeDecorations').innerHTML='<span class="muted">Пока нет рисунков. Выберите элемент из библиотеки.</span>';return}state.decorations.forEach((d,i)=>{const el=document.createElement('span');el.className='decoration-chip';el.innerHTML=`${d.symbol} ${d.name} <button aria-label="Удалить">×</button>`;el.querySelector('button').onclick=()=>{state.decorations.splice(i,1);renderDecorations();draw()};$('activeDecorations').append(el)})}
function addDecoration(item){state.decorations.push({symbol:item[0],name:item[1],x:180+(state.decorations.length%4)*250,y:100+Math.floor(state.decorations.length/4)*380,size:54,color:'#c7a77b'});renderDecorations();draw()}
function renderLibrary(){$('libraryGrid').innerHTML='';library.filter(x=>activeFilter==='all'||x[2]===activeFilter).forEach(item=>{const b=document.createElement('button');b.className='library-item';b.innerHTML=`<span class="art">${item[0]}</span><small>${item[1]}</small>`;b.onclick=()=>addDecoration(item);$('libraryGrid').append(b)})}
function renderGlyphs(){const chars=[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?@#$%&*+-='];$('glyphGrid').innerHTML='';chars.forEach(ch=>{const b=document.createElement('button');b.className='glyph'+(ch===selectedGlyph?' selected':'');b.textContent=ch;b.onclick=()=>{selectedGlyph=ch;renderGlyphs();$('selectedGlyph').textContent=ch};$('glyphGrid').append(b)})}
document.querySelectorAll('.nav-item').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x===btn));['design','glyphs','library'].forEach(p=>$(p+'Panel').classList.toggle('hidden',p!==btn.dataset.panel));const titles={design:['Дизайн текста','Создавайте выразительные надписи и экспериментируйте с типографикой.'],glyphs:['Редактор символов','Выбирайте символы и настраивайте их отображение.'],library:['Библиотека рисунков','Готовые декоративные элементы для ваших композиций.']};$('panelTitle').textContent=titles[btn.dataset.panel][0];$('panelSubtitle').textContent=titles[btn.dataset.panel][1]});
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));activeFilter=b.dataset.filter;renderLibrary()});
$('addDecoration').onclick=()=>{document.querySelector('[data-panel="library"]').click()};
$('resetDesign').onclick=()=>{Object.assign(state,structuredClone(defaults),{decorations:state.decorations});syncInputs()};
$('newProject').onclick=()=>{if(confirm('Создать новый проект? Текущий проект останется сохранённым только если вы предварительно экспортировали его.')){state=structuredClone(defaults);state.project='Новый проект';syncInputs()}};
$('applyGlyph').onclick=()=>{state.glyph={char:selectedGlyph,scale:glyphScale,rotate:glyphRotate};state.text=state.text.replace(selectedGlyph,selectedGlyph);$('textInput').value=state.text;draw();alert('Настройки символа сохранены для проекта. Масштаб и поворот символа доступны в параметрах проекта.')};
$('glyphScale').oninput=e=>glyphScale=Number(e.target.value);$('glyphRotate').oninput=e=>glyphRotate=Number(e.target.value);
function download(name,type,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
$('exportPng').onclick=()=>canvas.toBlob(blob=>download('paradox-font-studio.png','image/png',blob));
$('downloadSvg').onclick=()=>{const t=escapeXml(state.text);const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="100%" height="100%" fill="${state.bgColor}"/><text x="600" y="330" text-anchor="middle" font-family="${state.font}" font-size="${state.size}" font-weight="${state.weight}" letter-spacing="${state.spacing}" fill="${state.textColor}">${t}</text>${state.decorations.map((d,i)=>`<text x="${d.x??180+i*220}" y="${d.y??100}" text-anchor="middle" font-size="${d.size||54}" fill="${d.color||'#c7a77b'}">${escapeXml(d.symbol)}</text>`).join('')}</svg>`;download('paradox-font-studio.svg','image/svg+xml',new Blob([svg],{type:'image/svg+xml'}))};
function escapeXml(s){return String(s).replace(/[<>&'"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]))}
renderLibrary();renderGlyphs();syncInputs();
