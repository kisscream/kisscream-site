'use strict';
const tabs = ['notes', 'program', 'chapters'];
const tabButtons = document.querySelectorAll('[data-tab]');
const content = document.querySelector('#content');
const search = document.querySelector('#search');
const wrong = document.querySelector('#wrong');
const chapterSelect = document.querySelector('#chapter-select');
const count = document.querySelector('#count');
const feedback = document.querySelector('#feedback');
const key = 'kisscream.c-language.mistakes.v1';
let marked = new Set();
try { marked = new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
catch { feedback.textContent = '当前浏览器无法读取已保存的错题。'; }

function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = text;
    if (className) node.className = className;
    return node;
}
function currentTab() {
    const fragment = location.hash.slice(1);
    return tabs.includes(fragment) ? fragment : 'notes';
}
function questionList(tab) {
    if (tab === 'program') return window.programQuestions;
    if (tab === 'chapters') return window.chapterQuestions.filter(q => q.chapter === chapterSelect.value);
    return [...window.handQuestions, ...window.previousQuestions];
}
function updateCount(tab) {
    count.textContent = '(' + questionList(tab).filter(q => marked.has(q.id)).length + ')';
}
function updateMark(button, id) {
    const active = marked.has(id);
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? '已标错题' : '标记错题';
}
function addQuestion(q, tab) {
    const card = el('article');
    card.append(el('small', q.source));
    const head = el('div', null, 'qhead');
    const mark = el('button', '', 'mark');
    updateMark(mark, q.id);
    mark.addEventListener('click', () => {
        if (marked.has(q.id)) marked.delete(q.id);
        else marked.add(q.id);
        try { localStorage.setItem(key, JSON.stringify([...marked])); }
        catch { feedback.textContent = '浏览器无法保存，当前页面暂时保留标记。'; }
        updateMark(mark, q.id);
        updateCount(tab);
        if (wrong.checked) render();
    });
    head.append(el('h3', q.title), mark);
    card.append(head);
    if (q.prompt) card.append(el('p', q.prompt, 'prose'));
    for (const original of [q.image, ...(q.images || [])].filter(Boolean)) {
        const link = el('a');
        link.href = original;
        link.target = '_blank';
        link.rel = 'noopener';
        const img = el('img', null, 'original');
        img.src = original;
        img.loading = 'lazy';
        img.alt = q.title + ' · 点击放大原图';
        link.append(img);
        card.append(link);
    }
    const solution = el('details', null, 'solution');
    solution.append(el('summary', '查看答案与解析'));
    const answerHead = el('div', null, 'answer-head');
    const copy = el('button', '复制答案', 'copy');
    copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(q.answer); copy.textContent = '已复制'; }
        catch { copy.textContent = '请选中下方答案复制'; }
    });
    answerHead.append(el('h4', '直接答案'), copy);
    solution.append(answerHead, el('pre', q.answer), el('h4', '解析'), el('p', q.explanation, 'prose'));
    if (q.reference) {
        const link = el('a', '参考题源（清华大学出版社）');
        link.href = q.reference;
        link.target = '_blank';
        link.rel = 'noopener';
        solution.append(link);
    }
    card.append(solution);
    content.append(card);
}
function matches(record, term) {
    return [record.chapter, record.title, record.source, record.text, record.prompt, record.searchText, record.explanation]
        .filter(Boolean).join(' ').toLowerCase().includes(term);
}
function addNotes(term) {
    const chapters = new Map();
    for (const note of [...window.courseNotes, ...window.handNotes, ...window.previousNotes]) {
        if (!matches(note, term)) continue;
        if (!chapters.has(note.chapter)) chapters.set(note.chapter, []);
        chapters.get(note.chapter).push(note);
    }
    if (chapters.size) content.append(el('h2', '复习笔记'));
    for (const [chapter, notes] of chapters) {
        const fold = el('details', null, 'chapter');
        fold.open = Boolean(term);
        fold.append(el('summary', chapter + ' · ' + notes.length + ' 个知识点'));
        for (const note of notes) {
            const section = el('section', null, 'note');
            section.append(el('small', note.source), el('h3', note.title));
            for (const line of note.text.split('\n')) {
                section.append(el('p', line, line.startsWith('老师强调') ? 'prose emphasis' : 'prose'));
            }
            fold.append(section);
        }
        content.append(fold);
    }
}
function render() {
    const tab = currentTab();
    content.replaceChildren();
    tabButtons.forEach(button => {
        if (button.dataset.tab === tab) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
    });
    chapterSelect.hidden = tab !== 'chapters';
    const term = search.value.trim().toLowerCase();
    if (tab === 'notes' && !wrong.checked) addNotes(term);
    const items = questionList(tab).filter(q => (!wrong.checked || marked.has(q.id)) && matches(q, term));
    if (items.length) {
        content.append(el('h2', (tab === 'program' ? '编程复习题' : tab === 'chapters' ? chapterSelect.value : '原题') + ' · ' + items.length + ' 题'));
        items.forEach(q => addQuestion(q, tab));
    } else if (!content.childElementCount) {
        content.append(el('p', wrong.checked && !term ? '本栏还没有标记的错题。' : '没有匹配的内容。'));
    }
    updateCount(tab);
}
tabButtons.forEach(button => button.addEventListener('click', () => { location.hash = button.dataset.tab; }));
window.addEventListener('hashchange', () => { search.value = ''; wrong.checked = false; render(); });
search.addEventListener('input', render);
wrong.addEventListener('change', render);
for (const chapter of new Set(window.chapterQuestions.map(q => q.chapter))) {
    const option = el('option', chapter);
    option.value = chapter;
    chapterSelect.append(option);
}
chapterSelect.addEventListener('change', render);
render();
