(() => {
  const config = window.BLOG;
  const app = document.querySelector('#app');
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date = (s) => s.replaceAll('-', ' / ');
  const cards = (posts) => posts.map((post, i) => `<a class="post-card glass" href="#post/${encodeURIComponent(post.slug)}"><div class="card-number">0${i + 1} <span>↗</span></div><div class="post-meta"><span class="category">${escapeHTML(post.category)}</span><span>${date(escapeHTML(post.date))}</span></div><h3>${escapeHTML(post.title)}</h3><p>${escapeHTML(post.excerpt)}</p><div class="card-bottom"><span>${escapeHTML(post.reading)}</span><span class="read-link">阅读文章 <b>→</b></span></div></a>`).join('');
  const heading = (eyebrow, title, description) => `<div class="section-heading"><div><div class="eyebrow"><span></span>${eyebrow}</div><h2>${title}</h2></div><p>${description}</p></div>`;
  function home() {
    app.innerHTML = `<section class="hero glass"><div class="hero-content"><div class="eyebrow"><span></span> A LITTLE SPACE OF MY OWN</div><h1>${escapeHTML(config.title)}<br><em>与每一个日常</em><span class="hero-star">✳</span></h1><p>${escapeHTML(config.description)}<br>欢迎来到我的小小世界。</p><div class="hero-actions"><a class="button primary" href="#posts">探索文章 <span>↗</span></a><a class="button secondary" href="#about">认识我 <span>→</span></a></div></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="art-sun">✳</div><span class="art-label">COLLECTING<br>SMALL MOMENTS</span><span class="art-sparkle">✦</span></div><div class="hero-index">01 / A PLACE TO BEGIN</div></section><section class="posts-section">${heading('THE LATEST STORIES','最近的记录','一些想法，一些故事，<br>都在这里慢慢生长。')}<div class="post-grid">${cards(config.posts.slice(0, 3))}</div><a class="all-posts" href="#posts">查看全部文章 <span>↗</span></a></section><section class="note glass"><div class="note-icon">✺</div><div><div class="eyebrow"><span></span> A NOTE FROM ME</div><h2>感谢你来到这里。</h2><p>希望这些文字，能为你的日常带来一点灵感与温暖。</p></div><a href="#about" aria-label="了解更多关于我">↗</a></section>`;
  }
  function postsPage() {
    app.innerHTML = `<section class="inner-page">${heading('THE ARCHIVE','所有文章','把每一次思考和发现，<br>都留在这里。')}<label class="search"><span>⌕</span><input type="search" placeholder="搜索文章标题、分类或内容…" aria-label="搜索文章"></label><div class="post-grid" id="post-list">${cards(config.posts)}</div><p class="empty" hidden>没有找到相关文章，试试其他关键词。</p></section>`;
    const input = app.querySelector('input');
    input.addEventListener('input', () => { const query = input.value.trim().toLowerCase(); const filtered = config.posts.filter(p => [p.title,p.category,p.excerpt].some(v => v.toLowerCase().includes(query))); app.querySelector('#post-list').innerHTML = cards(filtered); app.querySelector('.empty').hidden = filtered.length > 0; });
  }
  function about() { app.innerHTML = `<section class="inner-page">${heading('A LITTLE ABOUT ME','关于我','很高兴在这里与你相遇。')}<div class="about-card glass"><div class="about-symbol">✳</div><div><div class="eyebrow"><span></span> HELLO, I'M ${escapeHTML(config.name.toUpperCase())}</div><h2>你好，欢迎来到<br>我的小小世界。</h2><p>${escapeHTML(config.about)}</p><a class="button primary" href="${escapeHTML(config.github)}" target="_blank" rel="noopener noreferrer">访问我的 GitHub <span>↗</span></a></div></div></section>`; }
  function markdown(source) {
    // 转义原始 HTML；基础 Markdown 足以让内容与页面解耦。
    const inline = s => escapeHTML(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');
    return source.split(/\r?\n/).map(line => { if (/^### /.test(line)) return `<h3>${inline(line.slice(4))}</h3>`; if (/^## /.test(line)) return `<h2>${inline(line.slice(3))}</h2>`; if (/^# /.test(line)) return `<h1>${inline(line.slice(2))}</h1>`; if (/^> /.test(line)) return `<blockquote>${inline(line.slice(2))}</blockquote>`; return line.trim() ? `<p>${inline(line)}</p>` : ''; }).join('');
  }
  async function postPage(slug) {
    const post = config.posts.find(p => p.slug === slug);
    if (!post) { app.innerHTML = `<section class="inner-page glass message"><h1>文章没有找到</h1><a href="#posts">← 返回文章列表</a></section>`; return; }
    app.innerHTML = `<section class="inner-page glass article"><a class="back" href="#posts">← 返回文章列表</a><div class="post-meta"><span class="category">${escapeHTML(post.category)}</span><span>${date(escapeHTML(post.date))}</span><span>${escapeHTML(post.reading)}</span></div><div class="article-body">正在加载文章…</div></section>`;
    try { const res = await fetch(post.file); if (!res.ok) throw new Error('无法读取文章'); const content = await res.text(); if (location.hash !== `#post/${encodeURIComponent(slug)}`) return; app.querySelector('.article-body').innerHTML = markdown(content); } catch { const body = app.querySelector('.article-body'); if (body && location.hash === `#post/${encodeURIComponent(slug)}`) body.textContent = '文章加载失败。请通过本地服务器打开网站，并检查文章文件是否存在。'; }
  }
  function render() { const route = location.hash.slice(1) || 'home'; const section = route.startsWith('post/') ? 'posts' : route; document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === section)); if (route === 'home') home(); else if (route === 'posts') postsPage(); else if (route === 'about') about(); else if (route.startsWith('post/')) { try { postPage(decodeURIComponent(route.slice(5))); } catch { postsPage(); } } else home(); window.scrollTo(0, 0); }
  document.querySelector('#year').textContent = new Date().getFullYear(); window.addEventListener('hashchange', render); render();
})();
