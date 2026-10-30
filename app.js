(() => {
  const config = window.BLOG;
  const data = window.BLOG_DATA || {profile:{},activity:{}};
  if (Array.isArray(data.posts)) config.posts = data.posts;
  if (Array.isArray(data.moments)) config.moments = data.moments;
  if (Array.isArray(data.projects)) config.projects = data.projects;
  for (const key of ['title','description','about','interests','timeline','github']) if (data.settings && Object.hasOwn(data.settings,key)) config[key] = data.settings[key];
  const app = document.querySelector('#app');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = value => /^(https?:\/\/|mailto:)/i.test(value || '') ? esc(value) : '';
  const date = value => esc(value).replaceAll('-', ' / ');
  const tags = post => post.tags || [];
  const cards = posts => posts.map((post, i) => `<a class="post-card glass" href="#post/${encodeURIComponent(post.slug)}"><div class="card-number">${String(i + 1).padStart(2,'0')} <span>↗</span></div><div class="post-meta"><span class="category">${esc(post.category)}</span><span>${date(post.date)}</span></div><h3>${esc(post.title)}</h3><p>${esc(post.excerpt)}</p><div class="card-tags">${tags(post).map(t => `<span># ${esc(t)}</span>`).join('')}</div><div class="card-bottom"><span>${esc(post.reading)}</span><span class="read-link">阅读文章 <b>→</b></span></div></a>`).join('');
  const heading = (eyebrow, title, description) => `<div class="section-heading"><div><div class="eyebrow"><span></span>${eyebrow}</div><h2>${title}</h2></div><p>${description}</p></div>`;
  function profileCard() {
    const profile = data.profile || {};
    const avatar = /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(profile.avatar || '') ? `<img src="${esc(profile.avatar)}" alt="个人头像">` : '<span aria-hidden="true">✳</span>';
    return `<section class="profile-panel glass"><div class="profile-avatar">${avatar}</div><div class="profile-copy"><div class="eyebrow"><span></span> MY PROFILE</div><h2>${esc(profile.name || '你的名字')}</h2><p>${esc(profile.signature || '个性签名，留给以后的自己。')}</p><div class="profile-tags">${(profile.tags || []).map(t => `<span>${esc(t)}</span>`).join('') || '<span class="tag-empty">你的标签</span>'}</div></div></section>`;
  }
  let contributionYear = new Date().getFullYear();
  function contributionPanel(year = contributionYear) {
    const activity = data.activity || {};
    const today = new Date();
    const lastToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const first = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const offset = first.getDay();
    const days = Array.from({length:offset}, () => '<span class="contribution-placeholder" aria-hidden="true"></span>');
    const labels = [];
    let active = 0, index = offset;
    for (let cursor = new Date(first); cursor <= end; cursor.setDate(cursor.getDate()+1), index++) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth()+1).padStart(2,'0')}-${String(cursor.getDate()).padStart(2,'0')}`;
      const future = cursor > lastToday;
      const raw = Number(activity[key]);
      const count = !future && Number.isFinite(raw) ? Math.max(0,raw) : 0;
      if (count > 0) active++;
      const level = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4;
      const label = future ? `${key}：尚未到来` : `${key}：${count} 次博客内容发布或更新`;
      days.push(`<span class="contribution-day level-${level}${future ? ' is-future' : ''}" data-date="${key}" title="${label}" aria-label="${label}"></span>`);
      if (cursor.getDate() === 1) labels.push(`<span style="grid-column:${Math.floor(index/7)+1}">${cursor.getMonth()+1}月</span>`);
    }
    const isCurrentYear = year >= today.getFullYear();
    return `<section class="contribution-panel glass"><div class="contribution-header"><div><div class="eyebrow"><span></span> BLOG ACTIVITY</div><h2>博客贡献度</h2><p>记录每一次内容的发布与更新</p></div><div class="contribution-summary"><div class="contribution-year"><button type="button" data-year-step="-1" aria-label="查看上一年"${year <= 1900 ? ' disabled' : ''}>‹</button><span class="contribution-year-label" tabindex="-1">${year} 年</span><button type="button" data-year-step="1" aria-label="查看下一年"${isCurrentYear ? ' disabled' : ''}>›</button></div><span class="active-days">${active} 个活跃日</span></div></div><div class="contribution-scroll" tabindex="0" aria-label="左右滚动查看 ${year} 年全年贡献度"><div class="contribution-inner"><div class="contribution-months">${labels.join('')}</div><div class="contribution-grid" aria-label="${year} 年博客贡献度">${days.join('')}</div></div></div><p class="contribution-scroll-hint">左右滑动查看全年</p><div class="contribution-legend"><span>少</span>${[0,1,2,3,4].map(n => `<i class="contribution-day level-${n}"></i>`).join('')}<span>多</span></div></section>`;
  }
  function home() {
    const profile = data.profile || {}, settings = data.settings || {};
    const avatar = /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(profile.avatar || '') ? `<img src="${esc(profile.avatar)}" alt="个人头像">` : '✳';
    const wallpaper = /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(settings.coverWallpaper || '') ? ` style="background-image:url('${settings.coverWallpaper}')"` : '';
    const title = settings.coverQuote || '把喜欢的事，\n留在日子里。';
    const author = settings.coverAuthor || '— 写给每一个普通的日子';
    const tagsList = Array.isArray(profile.tags) ? profile.tags : [];
    const articles = config.posts.slice(0,3).map((post,i) => `<article><div class="article-date"><b>${String(i+1).padStart(2,'0')}</b><span>${date(post.date)}</span></div><div><div class="article-meta">${esc(post.category)} <span>·</span> ${esc(post.reading)}</div><h3><a href="#post/${encodeURIComponent(post.slug)}">${esc(post.title)}</a></h3><p>${esc(post.excerpt)}</p><div class="article-tags">${tags(post).map(tag=>`# ${esc(tag)}`).join(' &nbsp; ')}</div></div><a class="article-arrow" href="#post/${encodeURIComponent(post.slug)}" aria-label="阅读${esc(post.title)}">↗</a></article>`).join('') || '<p>还没有文章，期待第一篇记录。</p>';
    app.innerHTML = `<div class="chosen-home"><section class="cover" id="cover"><div class="cover-picture"${wallpaper}></div><div class="cover-shade"></div><header class="nav"><a class="wordmark" href="#home">${esc(profile.name || config.name)}<span>’</span>s space<small>PERSONAL JOURNAL</small></a><nav aria-label="首页导航"><a href="#home" class="nav-current">首页</a><a href="#posts">文章</a><a href="#moments">动态</a><a href="#projects">收藏</a><a href="#about">关于</a></nav><span class="nav-end">✳</span></header><div class="cover-center"><div class="cover-kicker"><span></span> A LITTLE WORLD OF MY OWN <span></span></div><h1>${esc(title)}</h1><p>${esc(author)}</p><div class="cover-mark">✳</div></div><div class="cover-bottom"><span>01 / A PLACE TO BEGIN</span><button class="scroll-down" type="button"><span>向下探索</span><b>⌄</b></button><span>COLLECT THE LITTLE THINGS</span></div></section><main id="home-content" class="home"><div class="home-inner"><div class="section-overline"><span>✳</span><span>WELCOME TO MY LITTLE SPACE</span><span class="overline-line"></span><span>01 / HOME</span></div><section class="intro"><div class="intro-text"><div class="profile-line"><div class="profile-avatar">${avatar}</div><div><strong>${esc(profile.name || config.name)}</strong><small>YOUR PERSONAL SPACE</small></div></div><div class="small-label"><span></span> A NOTE FROM ME</div><h2>你好，<br>欢迎来到我的<span>小小世界。</span></h2><p>${esc(profile.signature || config.description)}</p><p>${esc(config.about || '')}</p><div class="interest-tags">${tagsList.map(t=>`<span>${esc(t)}</span>`).join('')}</div><a class="text-link" href="#posts">从最近的故事开始 <span>↗</span></a></div><div class="art-space"><div class="art-halo"></div><div class="art-frame"></div><img class="character" src="/personal/character.png" alt="首页角色" onerror="this.hidden=true"><div class="art-caption"><span>THE THINGS I LOVE</span><b>与你共享的<br>小小风景</b><i>✳</i></div><div class="art-number">FIG. 01 &nbsp; / &nbsp; A QUIET COMPANY</div></div></section><section class="journal"><div class="journal-heading"><div><div class="small-label"><span></span> RECENT JOURNAL</div><h2>最近写下的<span>故事</span></h2></div><a href="#posts" class="all-link">全部文章 <span>↗</span></a></div><div class="journal-layout"><div class="journal-note"><div class="note-illustration">✳</div><span>NOTES & STORIES</span><p>把生活和灵感，<br>慢慢写成文字。</p><small>记录与发现 / ${new Date().getFullYear()}</small></div><div class="article-list">${articles}</div></div></section><section class="home-activity">${contributionPanel()}</section><section class="little-note"><span>✳</span><div><small>A LITTLE NOTE</small><p>谢谢你来到这里，愿我们都能认真生活，自由喜欢。</p></div><a href="#home" aria-label="返回顶部">↑</a></section><div class="home-footer"><span>© ${new Date().getFullYear()} ${esc(profile.name || config.name)}’S SPACE</span><span>MADE WITH LITTLE MOMENTS ✳</span></div></div></main></div>`;
    const character = app.querySelector('.character');
    fetch('/personal/character-mask.png').then(res => { if (res.ok && character.isConnected) character.classList.add('has-mask'); }).catch(() => {});
    app.querySelector('.scroll-down').addEventListener('click', () => document.getElementById('home-content').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
    app.querySelector('.home-activity').addEventListener('click', event => {
      const button = event.target.closest('[data-year-step]');
      if (!button || button.disabled) return;
      const step = Number(button.dataset.yearStep), year = contributionYear + step;
      if (year < 1900 || year > new Date().getFullYear()) return;
      contributionYear = year;
      const container = app.querySelector('.home-activity');
      container.innerHTML = contributionPanel(year);
      const sameButton = container.querySelector(`[data-year-step="${step}"]`);
      if (sameButton && !sameButton.disabled) sameButton.focus();
      else container.querySelector('.contribution-year-label').focus();
    });
  }
  function postsPage() {
    const categories = [...new Set(config.posts.map(p => p.category).filter(Boolean))];
    const allTags = [...new Set(config.posts.flatMap(tags))];
    app.innerHTML = `<section class="inner-page">${heading('THE ARCHIVE','所有文章','把每一次思考和发现，<br>都留在这里。')}<label class="search"><span>⌕</span><input type="search" placeholder="搜索标题、分类、标签或摘要…" aria-label="搜索文章"></label><div class="filter-row"><span>分类</span><div id="category-filters" class="filter-buttons"></div></div><div class="filter-row"><span>标签</span><div id="tag-filters" class="filter-buttons"></div></div><p class="result-count" aria-live="polite"></p><div class="post-grid" id="post-list"></div><p class="empty" hidden>没有找到相关文章，试试其他关键词或筛选条件。</p></section>`;
    let category = '', tag = '';
    const input = app.querySelector('input');
    function update() {
      const query = input.value.trim().toLowerCase();
      const filtered = config.posts.filter(p => (!category || p.category === category) && (!tag || tags(p).includes(tag)) && [p.title,p.category,p.excerpt,...tags(p)].some(v => String(v || '').toLowerCase().includes(query)));
      app.querySelector('#post-list').innerHTML = cards(filtered);
      app.querySelector('.empty').hidden = filtered.length > 0;
      app.querySelector('.result-count').textContent = `共 ${filtered.length} 篇文章`;
      const buttons = (values, selected) => ['', ...values].map((v,i) => `<button type="button" data-index="${i}" class="filter-chip${v === selected ? ' selected' : ''}" aria-pressed="${v === selected}">${esc(v || '全部')}</button>`).join('');
      app.querySelector('#category-filters').innerHTML = buttons(categories,category);
      app.querySelector('#tag-filters').innerHTML = buttons(allTags,tag);
    }
    input.addEventListener('input', update);
    app.querySelector('#category-filters').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { category = ['',...categories][Number(b.dataset.index)]; update(); } });
    app.querySelector('#tag-filters').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { tag = ['',...allTags][Number(b.dataset.index)]; update(); } });
    update();
  }
  function momentsPage() {
    const moments = config.moments || [];
    app.innerHTML = `<section class="inner-page">${heading('LITTLE MOMENTS','生活动态','没有主题也没关系，<br>记录此刻就很好。')}<div class="timeline">${moments.length ? moments.map(m => `<article class="timeline-item"><div class="timeline-date">${date(m.date)}</div><div class="moment-card glass"><div class="moment-mark">✳</div><p>${esc(m.text).replace(/\n/g,'<br>')}</p><div class="card-tags">${(m.tags || []).map(t => `<span># ${esc(t)}</span>`).join('')}</div></div></article>`).join('') : '<p class="empty">还没有动态，期待第一条记录。</p>'}</div></section>`;
  }
  function projectsPage() {
    const projects = config.projects || [];
    app.innerHTML = `<section class="inner-page">${heading('A COLLECTION OF THINGS','项目与收藏','一些正在做的事，<br>和偶然遇见的美好。')}<div class="project-grid">${projects.length ? projects.map(p => { const url = safeUrl(p.url); const content = `<div class="project-top"><span class="project-icon">✺</span><span>${url ? '↗' : '✧'}</span></div><span class="category">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>`; return url ? `<a class="project-card glass" href="${url}" target="_blank" rel="noopener noreferrer">${content}</a>` : `<article class="project-card glass">${content}</article>`; }).join('') : '<p class="empty">还没有收藏，慢慢添加吧。</p>'}</div></section>`;
  }
  function about() {
    app.innerHTML = `<section class="inner-page">${heading('A LITTLE ABOUT ME','关于我','很高兴在这里与你相遇。')}<div class="about-card glass"><div class="about-symbol">✳</div><div><div class="eyebrow"><span></span> HELLO, I'M ${esc(config.name.toUpperCase())}</div><h2>你好，欢迎来到<br>我的小小世界。</h2><p>${esc(config.about)}</p><div class="interest-list">${(config.interests || []).map(i => `<span>${esc(i)}</span>`).join('')}</div><a class="button primary" href="${safeUrl(config.github) || '#home'}" target="_blank" rel="noopener noreferrer">访问我的 GitHub <span>↗</span></a></div></div><div class="about-timeline"><div class="eyebrow"><span></span> ALONG THE WAY</div><h2>一路走来</h2><div class="history-list">${(config.timeline || []).map(item => `<div class="history-item"><span>${esc(item.date)}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div></div>`).join('') || '<p class="empty">故事正在书写中。</p>'}</div></div></section>`;
  }
  function markdown(source) {
    const headings = [];
    const inline = value => {
      const tokens = [];
      let text = esc(value).replace(/`([^`]+)`/g, (_, code) => { tokens.push(`<code>${code}</code>`); return `\u0000${tokens.length - 1}\u0000`; });
      text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/~~(.+?)~~/g,'<del>$1</del>');
      return text.replace(/\u0000(\d+)\u0000/g, (_, index) => tokens[Number(index)]);
    };
    const lines = source.replace(/\r\n?/g,'\n').split('\n'); let html = '', list = '', code = null;
    const closeList = () => { if (list) { html += `</${list}>`; list = ''; } };
    lines.forEach(line => {
      if (/^\s*```/.test(line)) { closeList(); if (code === null) code = []; else { html += `<pre><code>${esc(code.join('\n'))}</code></pre>`; code = null; } return; }
      if (code !== null) { code.push(line); return; }
      const item = line.match(/^\s*(?:([-*+])\s+|(\d+)\.\s+)(.*)$/);
      if (item) { const type = item[1] ? 'ul' : 'ol'; if (list !== type) { closeList(); list = type; html += `<${type}>`; } html += `<li>${inline(item[3])}</li>`; return; }
      closeList(); const h = line.match(/^(#{1,3})\s+(.+)$/);
      if (h) { const level = h[1].length, id = `section-${headings.length + 1}`; headings.push({id, title:h[2], level}); html += `<h${level} id="${id}">${inline(h[2])}</h${level}>`; }
      else if (/^>\s?/.test(line)) html += `<blockquote>${inline(line.replace(/^>\s?/,''))}</blockquote>`;
      else if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) html += '<hr>';
      else if (line.trim()) html += `<p>${inline(line)}</p>`;
    });
    closeList(); if (code !== null) html += `<pre><code>${esc(code.join('\n'))}</code></pre>`;
    return {html, headings};
  }
  async function postPage(slug) {
    const post = config.posts.find(p => p.slug === slug);
    if (!post) { app.innerHTML = `<section class="inner-page glass message"><h1>文章没有找到</h1><a href="#posts">← 返回文章列表</a></section>`; return; }
    app.innerHTML = `<section class="inner-page glass article"><a class="back" href="#posts">← 返回文章列表</a><div class="post-meta"><span class="category">${esc(post.category)}</span><span>${date(post.date)}</span><span>${esc(post.reading)}</span></div><div class="card-tags">${tags(post).map(t => `<span># ${esc(t)}</span>`).join('')}</div><div class="article-layout"><div class="article-body">正在加载文章…</div><aside class="article-toc" hidden></aside></div><div class="article-neighbors"></div><div class="comments-placeholder"><span>✧</span><div><h3>留言</h3><p>留言功能预留中，接入服务后即可在这里交流。</p></div></div></section>`;
    try {
      let content = post.body; if (typeof content !== 'string') { const res = await fetch(post.file); if (!res.ok) throw new Error('无法读取文章'); content = await res.text(); }
      if (location.hash !== `#post/${encodeURIComponent(slug)}`) return;
      const rendered = markdown(content); app.querySelector('.article-body').innerHTML = rendered.html;
      const toc = app.querySelector('.article-toc'); const entries = rendered.headings.filter(h => h.level > 1);
      if (entries.length) { toc.hidden = false; toc.innerHTML = `<h3>文章目录</h3>${entries.map(h => `<button type="button" class="toc-level-${h.level}" data-id="${h.id}">${esc(h.title)}</button>`).join('')}`; toc.addEventListener('click', e => { const button = e.target.closest('button'); if (button) document.getElementById(button.dataset.id)?.scrollIntoView({behavior:'smooth',block:'start'}); }); }
      const index = config.posts.indexOf(post), neighbors = [config.posts[index - 1],config.posts[index + 1]];
      app.querySelector('.article-neighbors').innerHTML = neighbors.map((p,i) => p ? `<a href="#post/${encodeURIComponent(p.slug)}"><small>${i ? '下一篇 →' : '← 上一篇'}</small><strong>${esc(p.title)}</strong></a>` : '<span></span>').join('');
    } catch { const body = app.querySelector('.article-body'); if (body && location.hash === `#post/${encodeURIComponent(slug)}`) body.textContent = '文章加载失败。请通过本地服务器打开网站，并检查文章文件是否存在。'; }
  }
  function render() { const route = location.hash.slice(1) || 'home'; const section = route.startsWith('post/') ? 'posts' : route; document.body.classList.toggle('home-active',route === 'home'); document.querySelectorAll('[data-nav]').forEach(a => { const active = a.dataset.nav === section; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); }); if (route === 'home') home(); else if (route === 'posts') postsPage(); else if (route === 'moments') momentsPage(); else if (route === 'projects') projectsPage(); else if (route === 'about') about(); else if (route.startsWith('post/')) { try { postPage(decodeURIComponent(route.slice(5))); } catch { postsPage(); } } else home(); addEditButton(section, route); window.scrollTo(0,0); }
  function addEditButton(section, route) {
    if (location.hostname !== '127.0.0.1' || location.port !== '4173') return;
    const panel = ({home:'profile',posts:'posts',moments:'moments',projects:'projects',about:'about'})[section];
    if (!panel) return;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'page-edit'; button.textContent = '✎ 编辑此页';
    button.addEventListener('click', () => {
      const dialog = document.createElement('dialog'); dialog.className = 'edit-dialog';
      const close = document.createElement('button'); close.className = 'dialog-close'; close.type = 'button'; close.textContent = '关闭 ×';
      const frame = document.createElement('iframe'); frame.title = '编辑此页面';
      const slug = route.startsWith('post/') ? `&slug=${encodeURIComponent(decodeURIComponent(route.slice(5)))}` : '';
      frame.src = `/editor?panel=${panel}${slug}&embedded=1`;
      close.addEventListener('click', () => dialog.close());
      dialog.addEventListener('close', () => { dialog.remove(); location.reload(); });
      dialog.append(close, frame); document.body.append(dialog); dialog.showModal();
    });
    app.prepend(button);
  }
  let homeScrolling = false, homeScrollDirection = '', homeScrollTimer = null, homeTouch = null;
  function scrollHomeSection(target, direction) {
    homeScrolling = true; homeScrollDirection = direction;
    clearTimeout(homeScrollTimer);
    target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    homeScrollTimer = setTimeout(() => { homeScrolling = false; homeScrollDirection = ''; }, 1000);
  }
  window.addEventListener('wheel', event => {
    if (!document.body.classList.contains('home-active') || document.querySelector('dialog[open]')) return;
    const cover = document.getElementById('cover'); if (!cover) return;
    if (homeScrolling) {
      event.preventDefault();
      if (event.deltaY < -5 && homeScrollDirection === 'down') scrollHomeSection(cover, 'up');
      else if (event.deltaY > 5 && homeScrollDirection === 'up') scrollHomeSection(document.getElementById('home-content'), 'down');
      return;
    }
    const bottom = cover.getBoundingClientRect().bottom;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const downward = event.deltaY > 0 && bottom > 35 && bottom <= innerHeight + 2;
    const upward = event.deltaY < 0 && bottom >= -4 && bottom < innerHeight - 35;
    if (downward || upward) {
      event.preventDefault();
      const target = downward ? document.getElementById('home-content') : cover;
      scrollHomeSection(target, downward ? 'down' : 'up');
    }
  }, {passive:false});
  window.addEventListener('touchstart', event => {
    if (!document.body.classList.contains('home-active') || document.querySelector('dialog[open]') || event.touches.length !== 1) { homeTouch = null; return; }
    const cover = document.getElementById('cover');
    homeTouch = cover ? {y:event.touches[0].clientY, bottom:cover.getBoundingClientRect().bottom, direction:''} : null;
  }, {passive:true});
  window.addEventListener('touchmove', event => {
    if (!homeTouch || event.touches.length !== 1) return;
    const delta = event.touches[0].clientY - homeTouch.y;
    if (delta < -10 && homeTouch.bottom > 35 && homeTouch.bottom <= innerHeight + 2) homeTouch.direction = 'down';
    else if (delta > 10 && homeTouch.bottom >= -4 && homeTouch.bottom < innerHeight - 35) homeTouch.direction = 'up';
    if (homeTouch.direction) event.preventDefault();
  }, {passive:false});
  window.addEventListener('touchend', event => {
    if (!homeTouch || !event.changedTouches.length) { homeTouch = null; return; }
    const delta = event.changedTouches[0].clientY - homeTouch.y, direction = homeTouch.direction;
    homeTouch = null;
    if (Math.abs(delta) < 40 || !direction) return;
    scrollHomeSection(document.getElementById(direction === 'down' ? 'home-content' : 'cover'), direction);
  }, {passive:true});
  // Personal wallpapers stay local; missing images leave the existing background intact.
  function startWallpaperBackground() {
    const images = Array.from({length:12}, (_, i) => `/personal/wallpapers/wallpaper-${String(i + 1).padStart(2, '0')}.png`);
    let index = Math.floor(Math.random() * images.length), current = 0, failures = 0;
    const layer = document.createElement('div');
    layer.className = 'wallpaper-ambience'; layer.setAttribute('aria-hidden', 'true');
    const panels = [document.createElement('div'), document.createElement('div')];
    layer.append(...panels); document.body.prepend(layer);
    function next() {
      const url = images[index++ % images.length], image = new Image();
      image.onload = () => {
        failures = 0;
        const target = panels[current];
        target.style.backgroundImage = `url("${url}")`;
        target.classList.add('visible'); panels[1-current].classList.remove('visible');
        document.body.classList.add('has-wallpaper-background'); current = 1-current;
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(next, 18000);
      };
      image.onerror = () => { if (++failures < images.length) next(); };
      image.src = url;
    }
    next();
  }
  startWallpaperBackground();
  // Decorative atmosphere never intercepts input or changes site content.
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let atmosphere;
  function updateAtmosphere() {
    atmosphere?.remove();
    atmosphere = null;
    if (motionPreference.matches) return;
    const weather = Math.random() < .5 ? 'rain' : 'snow';
    atmosphere = document.createElement('div');
    atmosphere.className = `atmosphere atmosphere--${weather}`;
    atmosphere.setAttribute('aria-hidden', 'true');
    const count = matchMedia('(max-width: 760px)').matches ? 22 : 36;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('i');
      particle.style.setProperty('--x', `${Math.random() * 100}%`);
      particle.style.setProperty('--delay', `${-Math.random() * 14}s`);
      particle.style.setProperty('--duration', `${weather === 'rain' ? 1.8 + Math.random() * 1.6 : 8 + Math.random() * 7}s`);
      particle.style.setProperty('--drift', `${(Math.random() - .5) * 65}px`);
      particle.style.setProperty('--size', `${10 + Math.random() * 7}px`);
      atmosphere.append(particle);
    }
    document.body.append(atmosphere);
  }
  updateAtmosphere();
  motionPreference.addEventListener('change', updateAtmosphere);
  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || motionPreference.matches) return;
    const ripple = document.createElement('span');
    ripple.className = 'click-spark';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), {once:true});
  });
  document.querySelector('#year').textContent = new Date().getFullYear(); document.querySelector('#brand-name').textContent = data.profile?.name || 'SHERRY'; const githubLink = document.querySelector('.github'); githubLink.href = safeUrl(config.github) || '#about'; window.addEventListener('hashchange', () => {
    render();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && app.animate) {
      app.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}], {duration:320,easing:'cubic-bezier(.22,1,.36,1)'});
    }
  }); render();
})();
