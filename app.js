(() => {
  const config = window.BLOG;
  const app = document.querySelector('#app');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = value => /^(https?:\/\/|mailto:)/i.test(value || '') ? esc(value) : '';
  const date = value => esc(value).replaceAll('-', ' / ');
  const tags = post => post.tags || [];
  const cards = posts => posts.map((post, i) => `<a class="post-card glass" href="#post/${encodeURIComponent(post.slug)}"><div class="card-number">${String(i + 1).padStart(2,'0')} <span>↗</span></div><div class="post-meta"><span class="category">${esc(post.category)}</span><span>${date(post.date)}</span></div><h3>${esc(post.title)}</h3><p>${esc(post.excerpt)}</p><div class="card-tags">${tags(post).map(t => `<span># ${esc(t)}</span>`).join('')}</div><div class="card-bottom"><span>${esc(post.reading)}</span><span class="read-link">阅读文章 <b>→</b></span></div></a>`).join('');
  const heading = (eyebrow, title, description) => `<div class="section-heading"><div><div class="eyebrow"><span></span>${eyebrow}</div><h2>${title}</h2></div><p>${description}</p></div>`;
  function home() {
    app.innerHTML = `<section class="hero glass"><div class="hero-content"><div class="eyebrow"><span></span> A LITTLE SPACE OF MY OWN</div><h1>${esc(config.title)}<br><em>与每一个日常</em><span class="hero-star">✳</span></h1><p>${esc(config.description)}<br>欢迎来到我的小小世界。</p><div class="hero-actions"><a class="button primary" href="#posts">探索文章 <span>↗</span></a><a class="button secondary" href="#about">认识我 <span>→</span></a></div></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="art-sun">✳</div><span class="art-label">COLLECTING<br>SMALL MOMENTS</span><span class="art-sparkle">✦</span></div><div class="hero-index">01 / A PLACE TO BEGIN</div></section><section class="posts-section">${heading('THE LATEST STORIES','最近的记录','一些想法，一些故事，<br>都在这里慢慢生长。')}<div class="post-grid">${cards(config.posts.slice(0, 3))}</div><a class="all-posts" href="#posts">查看全部文章 <span>↗</span></a></section><section class="explore-grid"><a class="explore-card glass" href="#moments"><span>✳</span><div><small>SMALL MOMENTS</small><h3>生活动态</h3><p>收藏日常里的点滴心情</p></div><b>↗</b></a><a class="explore-card glass" href="#projects"><span>✺</span><div><small>MY COLLECTION</small><h3>项目与收藏</h3><p>一些有趣的发现和作品</p></div><b>↗</b></a></section><section class="note glass"><div class="note-icon">✺</div><div><div class="eyebrow"><span></span> A NOTE FROM ME</div><h2>感谢你来到这里。</h2><p>希望这些文字，能为你的日常带来一点灵感与温暖。</p></div><a href="#about" aria-label="了解更多关于我">↗</a></section>`;
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
      const res = await fetch(post.file); if (!res.ok) throw new Error('无法读取文章'); const content = await res.text();
      if (location.hash !== `#post/${encodeURIComponent(slug)}`) return;
      const rendered = markdown(content); app.querySelector('.article-body').innerHTML = rendered.html;
      const toc = app.querySelector('.article-toc'); const entries = rendered.headings.filter(h => h.level > 1);
      if (entries.length) { toc.hidden = false; toc.innerHTML = `<h3>文章目录</h3>${entries.map(h => `<button type="button" class="toc-level-${h.level}" data-id="${h.id}">${esc(h.title)}</button>`).join('')}`; toc.addEventListener('click', e => { const button = e.target.closest('button'); if (button) document.getElementById(button.dataset.id)?.scrollIntoView({behavior:'smooth',block:'start'}); }); }
      const index = config.posts.indexOf(post), neighbors = [config.posts[index - 1],config.posts[index + 1]];
      app.querySelector('.article-neighbors').innerHTML = neighbors.map((p,i) => p ? `<a href="#post/${encodeURIComponent(p.slug)}"><small>${i ? '下一篇 →' : '← 上一篇'}</small><strong>${esc(p.title)}</strong></a>` : '<span></span>').join('');
    } catch { const body = app.querySelector('.article-body'); if (body && location.hash === `#post/${encodeURIComponent(slug)}`) body.textContent = '文章加载失败。请通过本地服务器打开网站，并检查文章文件是否存在。'; }
  }
  function render() { const route = location.hash.slice(1) || 'home'; const section = route.startsWith('post/') ? 'posts' : route; document.querySelectorAll('[data-nav]').forEach(a => { const active = a.dataset.nav === section; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); }); if (route === 'home') home(); else if (route === 'posts') postsPage(); else if (route === 'moments') momentsPage(); else if (route === 'projects') projectsPage(); else if (route === 'about') about(); else if (route.startsWith('post/')) { try { postPage(decodeURIComponent(route.slice(5))); } catch { postsPage(); } } else home(); window.scrollTo(0,0); }
  document.querySelector('#year').textContent = new Date().getFullYear(); window.addEventListener('hashchange',render); render();
})();
