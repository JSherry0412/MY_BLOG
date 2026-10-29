(() => {
  const byId = id => document.getElementById(id);
  const profile = byId('profile-form'), posts = byId('post-form'), moments = byId('moment-form');
  const notice = byId('notice'); let data, avatar = '';
  const message = (text,error=false) => { notice.textContent = text; notice.classList.toggle('error',error); };
  const tags = value => value.split(/[,，]/).map(x => x.trim()).filter(Boolean);
  const preview = () => { const el = byId('avatar-preview'); el.replaceChildren(); if (avatar) { const img = document.createElement('img'); img.src = avatar; img.alt = '头像预览'; el.append(img); } else el.textContent = '✳'; };
  function option(select,value,label) { const item = document.createElement('option'); item.value = value; item.textContent = label; select.append(item); }
  function refreshLists() {
    const ps = posts.elements.selection, ms = moments.elements.selection;
    const pv = ps.value, mv = ms.value; ps.replaceChildren(); ms.replaceChildren();
    option(ps,'','＋ 新建文章'); data.posts.forEach(p => option(ps,p.slug,p.title));
    option(ms,'-1','＋ 新建动态'); data.moments.forEach((m,i) => option(ms,String(i),`${m.date} · ${m.text.slice(0,30)}`));
    if ([...ps.options].some(o => o.value === pv)) ps.value = pv;
    if ([...ms.options].some(o => o.value === mv)) ms.value = mv;
  }
  function loadPost() {
    const p = data.posts.find(item => item.slug === posts.elements.selection.value);
    for (const key of ['slug','title','category','excerpt','body']) posts.elements[key].value = p?.[key] || '';
    posts.elements.tags.value = (p?.tags || []).join(', '); posts.elements.slug.readOnly = !!p;
  }
  function loadMoment() { const m = data.moments[Number(moments.elements.selection.value)]; moments.elements.text.value = m?.text || ''; moments.elements.tags.value = (m?.tags || []).join(', '); }
  async function load() {
    const res = await fetch('/api/data'); if (!res.ok) throw new Error('无法读取博客数据'); data = await res.json();
    const p = data.profile || {}; profile.elements.name.value = p.name || ''; profile.elements.signature.value = p.signature || ''; profile.elements.tags.value = (p.tags || []).join(', '); avatar = p.avatar || ''; preview(); refreshLists();
  }
  async function save(payload) { const res = await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json','X-Blog-Editor':'1'},body:JSON.stringify(payload)}); const result = await res.json(); if (!res.ok) throw new Error(result.error || '保存失败'); await load(); message('已保存到本机博客。刷新博客页面即可查看；推送仓库后才会同步到 GitHub。'); }
  document.querySelector('.editor-nav').addEventListener('click', e => { const button = e.target.closest('button'); if (!button) return; document.querySelectorAll('.editor-nav button').forEach(b => b.classList.toggle('selected',b === button)); document.querySelectorAll('.editor-panel').forEach(p => p.hidden = p.id !== button.dataset.panel); message(''); });
  byId('avatar-file').addEventListener('change', e => { const file = e.target.files[0]; if (!file) return; if (file.size > 1024*1024 || !['image/png','image/jpeg','image/webp','image/gif'].includes(file.type)) { message('请选择不超过 1 MB 的 PNG、JPG、WebP 或 GIF 图片。',true); e.target.value = ''; return; } const reader = new FileReader(); reader.onload = () => { avatar = reader.result; preview(); }; reader.readAsDataURL(file); });
  byId('remove-avatar').addEventListener('click',() => { avatar = ''; byId('avatar-file').value = ''; preview(); });
  profile.addEventListener('submit',async e => { e.preventDefault(); try { await save({kind:'profile',name:profile.elements.name.value,signature:profile.elements.signature.value,tags:tags(profile.elements.tags.value),avatar}); } catch(error) { message(error.message,true); } });
  posts.elements.selection.addEventListener('change',loadPost); moments.elements.selection.addEventListener('change',loadMoment);
  posts.addEventListener('submit',async e => { e.preventDefault(); try { const payload = {kind:'post'}; for (const key of ['slug','title','category','excerpt','body']) payload[key] = posts.elements[key].value; payload.tags = tags(posts.elements.tags.value); await save(payload); posts.elements.selection.value = payload.slug; loadPost(); } catch(error) { message(error.message,true); } });
  moments.addEventListener('submit',async e => { e.preventDefault(); try { const index = Number(moments.elements.selection.value); await save({kind:'moment',index,text:moments.elements.text.value,tags:tags(moments.elements.tags.value)}); moments.elements.selection.value = String(index < 0 ? 0 : index); loadMoment(); } catch(error) { message(error.message,true); } });
  load().then(() => { loadPost(); loadMoment(); }).catch(error => message(error.message,true));
})();
