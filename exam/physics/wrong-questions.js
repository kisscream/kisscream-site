(() => {
const page = location.pathname.split('/').pop();
const key = 'physics-wrong:' + page;
let marks;
try { marks = new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
catch { marks = new Set(); }
const questions = [...document.querySelectorAll('article.question')];
const filter = document.createElement('button');
filter.type = 'button';
filter.setAttribute('aria-pressed', 'false');
document.querySelector('#search').closest('label').after(filter);
const status = document.createElement('p');
status.className = 'notice';
status.setAttribute('aria-live','polite');
filter.after(status);
const style = document.createElement('style');
style.textContent = '.wrong-only article.question:not(.wrong-marked){display:none}.wrong-button[aria-pressed=true],button[aria-pressed=true]{background:#fff1dd;color:#863f21}';
document.head.append(style);
function refresh() {
  const only = filter.getAttribute('aria-pressed') === 'true';
  filter.textContent = (only ? '显示全部题目' : '只看错题') + '（' + marks.size + '）';
  document.body.classList.toggle('wrong-only', only);
  status.textContent = only && !questions.some(q => q.classList.contains('wrong-marked') && !q.hidden && q.getClientRects().length)
    ? '当前筛选下没有错题。' : '';
}
for (const question of questions) {
  const button = question.querySelector('.wrong-button');
  function update() {
    const marked = marks.has(question.id);
    question.classList.toggle('wrong-marked', marked);
    button.setAttribute('aria-pressed', marked);
    button.textContent = marked ? '★ 已标记 · 取消' : '☆ 标记此题';
  }
  button.onclick = () => {
    if (marks.has(question.id)) marks.delete(question.id);
    else marks.add(question.id);
    update();
    refresh();
    try { localStorage.setItem(key, JSON.stringify([...marks])); }
    catch { status.textContent = '浏览器无法保存标记，刷新后会清除。'; }
  };
  update();
}
filter.onclick = () => {
  filter.setAttribute('aria-pressed', filter.getAttribute('aria-pressed') !== 'true');
  refresh();
};
document.addEventListener('input', refresh);
document.addEventListener('change', refresh);
document.querySelector('.jump')?.addEventListener('click', refresh);
refresh();

})();
