(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const STORAGE_KEY = 'paradoxDraft';
  const digitMaps = {
    bold: 0x1D7CE,
    mono: 0x1D7F6,
    double: 0x1D7D8,
    full: 0xFF10
  };

  const special = {
    frakturUpper: ['𝔄','𝔅','ℭ','𝔇','𝔈','𝔉','𝔊','ℌ','ℑ','𝔍','𝔎','𝔏','𝔐','𝔑','𝔒','𝔓','𝔔','ℜ','𝔖','𝔗','𝔘','𝔙','𝔚','𝔛','𝔜','ℨ'],
    frakturLower: ['𝔞','𝔟','𝔠','𝔡','𝔢','𝔣','𝔤','𝔥','𝔦','𝔧','𝔨','𝔩','𝔪','𝔫','𝔬','𝔭','𝔮','𝔯','𝔰','𝔱','𝔲','𝔳','𝔴','𝔵','𝔶','𝔷'],
    doubleUpper: ['𝔸','𝔹','ℂ','𝔻','𝔼','𝔽','𝔾','ℍ','𝕀','𝕁','𝕂','𝕃','𝕄','ℕ','𝕆','ℙ','ℚ','ℝ','𝕊','𝕋','𝕌','𝕍','𝕎','𝕏','𝕐','ℤ']
  };

  const smallCaps = {
    a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',
    m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ'
  };

  const styleDefs = [
    {name:'Обычный', key:'normal', sample:'Abc 123'},
    {name:'Жирный', key:'bold', sample:'𝐀𝐛𝐜 𝟏𝟐𝟑'},
    {name:'Курсив', key:'italic', sample:'𝐴𝑏𝑐 123'},
    {name:'Жирный курсив', key:'boldItalic', sample:'𝑨𝒃𝒄 123'},
    {name:'Готический', key:'fraktur', sample:'𝔄𝔟𝔠 123'},
    {name:'Моноширинный', key:'mono', sample:'𝙰𝚋𝚌 𝟷𝟸𝟹'},
    {name:'Двойной контур', key:'double', sample:'𝔸𝕓𝕔 𝟙𝟚𝟛'},
    {name:'Полноширинный', key:'full', sample:'Ａｂｃ １２３'},
    {name:'Обведённый', key:'circled', sample:'Ⓐⓑⓒ ①②③'},
    {name:'Малые заглавные', key:'small', sample:'ᴬʙᴄ 123'}
  ];

  const categories = {
    'Звёзды': {terms:['звезда','звёзды','star'], chars:'✦ ✧ ★ ☆ ⋆ ⭑ ✩ ✪ ✫ ✬ ✭ ✮ ✯'},
    'Сердца': {terms:['сердце','сердца','heart'], chars:'♡ ♥ ❤ ❥ ღ დ ۵'},
    'Стрелки': {terms:['стрелка','стрелки','arrow'], chars:'➜ ➤ ➳ ➵ ➸ ⇢ ⇝ ↠'},
    'Рамки': {terms:['рамка','ромб','квадрат'], chars:'❖ ◈ ◇ ◆ ▣ ▪ ▫'},
    'Цветы': {terms:['цветок','цветы','flower'], chars:'❀ ✿ ❁ ❃ ❋ ⚘'},
    'Линии': {terms:['линия','разделитель','точки'], chars:'─ ━ ═ 〜 ⋯ · •'}
  };

  let activeStyle = 'bold';
  let activeCategory = 'Все';
  let chosen = [];
  let saveTimer = null;

  function mapChar(ch, key) {
    const cp = ch.codePointAt(0);
    const upper = cp >= 65 && cp <= 90;
    const lower = cp >= 97 && cp <= 122;
    const digit = cp >= 48 && cp <= 57;
    const offset = upper ? cp - 65 : lower ? cp - 97 : digit ? cp - 48 : -1;

    if (key === 'normal' || offset < 0) return ch;
    if (key === 'small') return lower ? (smallCaps[ch] || ch) : ch;
    if (key === 'fraktur') {
      if (upper) return special.frakturUpper[offset];
      if (lower) return special.frakturLower[offset];
      return ch;
    }
    if (key === 'double' && upper) return special.doubleUpper[offset];
    if (key === 'circled') {
      if (upper) return String.fromCodePoint(0x24B6 + offset);
      if (lower) return String.fromCodePoint(0x24D0 + offset);
      if (digit) return offset === 0 ? '⓪' : String.fromCodePoint(0x2460 + offset - 1);
      return ch;
    }

    const bases = {
      bold: {upper:0x1D400, lower:0x1D41A},
      italic: {upper:0x1D434, lower:0x1D44E},
      boldItalic: {upper:0x1D468, lower:0x1D482},
      mono: {upper:0x1D670, lower:0x1D68A},
      double: {lower:0x1D552},
      full: {upper:0xFF21, lower:0xFF41}
    };
    const base = bases[key];
    if (!base) return ch;
    if (key === 'italic' && ch === 'h') return 'ℎ';
    if (digit) {
      const digitBase = digitMaps[key];
      return digitBase ? String.fromCodePoint(digitBase + offset) : ch;
    }
    const letterBase = upper ? base.upper : base.lower;
    return letterBase ? String.fromCodePoint(letterBase + offset) : ch;
  }

  function transform(text, key) {
    return Array.from(text, ch => mapChar(ch, key)).join('');
  }

  function renderStyles() {
    $('styleGrid').innerHTML = styleDefs.map(style => {
      const active = style.key === activeStyle ? ' active' : '';
      return `<button type="button" class="style-card${active}" data-style="${style.key}" aria-pressed="${style.key === activeStyle}">
        <strong>${style.sample}</strong><small>${style.name}</small></button>`;
    }).join('');
    $('styleGrid').querySelectorAll('[data-style]').forEach(button => {
      button.addEventListener('click', () => {
        activeStyle = button.dataset.style;
        renderStyles();
        render();
      });
    });
  }

  function renderCategories() {
    const names = ['Все', ...Object.keys(categories)];
    $('symbolCategories').innerHTML = names.map(name =>
      `<button type="button" class="chip${name === activeCategory ? ' active' : ''}" data-category="${name}">${name}</button>`
    ).join('');
    $('symbolCategories').querySelectorAll('[data-category]').forEach(button => {
      button.addEventListener('click', () => {
        activeCategory = button.dataset.category;
        renderCategories();
        renderSymbols();
      });
    });
  }

  function renderSymbols() {
    const query = $('symbolSearch').value.trim().toLocaleLowerCase('ru');
    const source = activeCategory === 'Все'
      ? Object.entries(categories)
      : [[activeCategory, categories[activeCategory]]];
    const items = [];
    source.forEach(([name, data]) => {
      const matchesName = !query || name.toLocaleLowerCase('ru').includes(query) ||
        data.terms.some(term => term.includes(query));
      Array.from(data.chars).forEach(char => {
        if (!query || matchesName || char.includes(query)) items.push({char, name});
      });
    });
    const unique = [...new Map(items.map(item => [item.char, item])).values()];
    $('symbolGrid').innerHTML = unique.length
      ? unique.map(item => `<button type="button" class="symbol" title="${item.name}: ${item.char}" aria-label="Добавить ${item.name} ${item.char}" data-symbol="${item.char}">${item.char}</button>`).join('')
      : '<span class="empty">Ничего не найдено. Попробуй другое слово или символ.</span>';
    $('symbolGrid').querySelectorAll('[data-symbol]').forEach(button => {
      button.addEventListener('click', () => {
        chosen.push(button.dataset.symbol);
        renderChosen();
        render();
      });
    });
  }

  function renderChosen() {
    $('selectedSymbols').innerHTML = chosen.length
      ? chosen.map((symbol, index) => `<span class="selected-item">${symbol}<button type="button" aria-label="Удалить ${symbol}" data-remove="${index}">×</button></span>`).join('')
      : '<span class="empty">Пока ничего нет</span>';
    $('selectedSymbols').querySelectorAll('[data-remove]').forEach(button => {
      button.addEventListener('click', () => {
        chosen.splice(Number(button.dataset.remove), 1);
        renderChosen();
        render();
      });
    });
  }

  function makeOutput() {
    const raw = $('sourceText').value;
    let lines = transform(raw, activeStyle).split('\n');
    const separators = {
      none:'', line:'────────────', dots:'· · · · · · · · ·',
      stars:'✦ ─ ✦ ─ ✦', wave:'〜〜〜〜〜〜〜'
    };
    const separator = separators[$('separator').value] || '';
    if (separator && lines.length > 1) {
      lines = lines.flatMap((line, index) => index < lines.length - 1 ? [line, separator] : [line]);
    }
    let output = lines.join('\n');
    if ($('centerText').checked) output = output.split('\n').map(line => line ? '　' + line : '').join('\n');

    const decoration = chosen.join(' ');
    const placement = $('placement').value;
    if (decoration) {
      if (placement === 'top' || placement === 'both') output = decoration + (output ? '\n' + output : '');
      if (placement === 'bottom' || placement === 'both') output = (output ? output + '\n' : '') + decoration;
      if (placement === 'sides') {
        output = output.split('\n').map(line => line ? `${decoration}  ${line}  ${decoration}` : line).join('\n');
      }
    }
    return output;
  }

  function saveState() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          source: $('sourceText').value,
          activeStyle, chosen,
          placement: $('placement').value,
          separator: $('separator').value,
          center: $('centerText').checked
        }));
      } catch (error) {
        // Private browsing or full storage: the editor remains usable.
      }
    }, 120);
  }

  function render() {
    const output = makeOutput();
    $('preview').textContent = output || 'Твой результат появится здесь';
    $('charCount').textContent = `${Array.from($('sourceText').value).length} символов`;
    $('outputCount').textContent = `${Array.from(output).length} символов`;
    saveState();
  }

  async function copyText() {
    const text = makeOutput();
    if (!text) {
      $('copyStatus').textContent = 'Сначала введи текст или добавь украшение.';
      return;
    }
    $('copyStatus').textContent = '';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API недоступен');
      }
      $('copyStatus').textContent = '✓ Текст скопирован — можно вставлять в Telegram';
    } catch (error) {
      const temporary = document.createElement('textarea');
      temporary.value = text;
      temporary.setAttribute('readonly', '');
      temporary.style.position = 'fixed';
      temporary.style.opacity = '0';
      document.body.appendChild(temporary);
      temporary.select();
      temporary.setSelectionRange(0, temporary.value.length);
      let copied = false;
      try { copied = document.execCommand('copy'); } catch (_) {}
      temporary.remove();
      $('copyStatus').textContent = copied
        ? '✓ Текст скопирован — можно вставлять в Telegram'
        : 'Не удалось скопировать автоматически. Выдели текст в предпросмотре вручную.';
    }
  }

  function downloadText() {
    const text = makeOutput();
    if (!text) {
      $('copyStatus').textContent = 'Сначала введи текст или добавь украшение.';
      return;
    }
    const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'paradox-telegram-text.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const hints = {
    'Имя профиля':'Для имени профиля лучше использовать короткий вариант. Telegram может ограничивать длину поля.',
    'О себе / BIO':'Для BIO подойдут несколько строк, разделители и декоративные символы. Учитывай лимит символов Telegram.',
    'Сообщение':'Для сообщений можно использовать длинный текст, переносы строк и украшения.'
  };

  function init() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && typeof saved === 'object') {
        if (typeof saved.source === 'string') $('sourceText').value = saved.source.slice(0, 5000);
        if (styleDefs.some(style => style.key === saved.activeStyle)) activeStyle = saved.activeStyle;
        if (Array.isArray(saved.chosen)) chosen = saved.chosen.filter(x => typeof x === 'string').slice(0, 100);
        if (['both','top','bottom','sides'].includes(saved.placement)) $('placement').value = saved.placement;
        if (['none','line','dots','stars','wave'].includes(saved.separator)) $('separator').value = saved.separator;
        $('centerText').checked = Boolean(saved.center);
      }
    } catch (error) {
      // Ignore damaged or unavailable local storage.
    }

    $('sourceText').addEventListener('input', render);
    ['placement','separator','centerText'].forEach(id => $(id).addEventListener('change', render));
    $('symbolSearch').addEventListener('input', renderSymbols);
    $('clearBtn').addEventListener('click', () => { $('sourceText').value = ''; render(); });
    $('clearDecor').addEventListener('click', () => { chosen = []; renderChosen(); render(); });
    $('copyBtn').addEventListener('click', copyText);
    $('downloadBtn').addEventListener('click', downloadText);

    document.querySelectorAll('[data-target]').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('[data-target]').forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        $('destinationHint').textContent = hints[button.dataset.target];
      });
    });

    renderStyles();
    renderCategories();
    renderSymbols();
    renderChosen();
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
