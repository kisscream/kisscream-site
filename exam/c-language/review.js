'use strict';
const tabs = ['notes', 'program', 'chapters'];
const tabButtons = document.querySelectorAll('[data-tab]');
const content = document.querySelector('#content');
const search = document.querySelector('#search');
const wrong = document.querySelector('#wrong');
const chapterSelect = document.querySelector('#chapter-select');
const count = document.querySelector('#count');
const feedback = document.querySelector('#feedback');
const teachingQuestions = [...window.handQuestions, ...window.previousQuestions];
const practiceTopics = new Map([window.inputPractice, window.flowPractice]
    .map(topic => [topic.chapterNumber, topic]));
const practiceOpen = new Map();
const supplementalNotes = [...window.handNotes, ...window.previousNotes];
const chapters = new Map([...new Set(window.chapterQuestions.map(q => q.chapter))]
    .map(title => [Number(title.match(/\d+/)[0]), title]));
const attempts = new Map();
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
    const number = Number(chapterSelect.value);
    const chapterQuestions = window.chapterQuestions.filter(q => q.chapter === chapters.get(number));
    if (tab === 'chapters') return chapterQuestions;
    const practice = practiceTopics.get(number)?.questions ?? [];
    return [...practice, ...teachingQuestions.filter(q => q.chapterNumber === number), ...chapterQuestions];
}
function updateCount(tab) {
    count.textContent = '(' + questionList(tab).filter(q => marked.has(q.id)).length + ')';
}
function updateMark(button, id) {
    const active = marked.has(id);
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? '已标错题' : '标记错题';
}
function addChoiceForm(card, q) {
    const correct = q.title.endsWith('单选题') ? q.answer.match(/^([A-D])(?:$|[ （])/)?.[1]
        : q.answer.match(/^选\s*([A-D])/)?.[1];
    if (!correct) return;

    const form = el('form', null, 'choice-form');
    const field = el('fieldset');
    field.append(el('legend', '选择一个选项'));
    const options = el('div', null, 'choice-options');
    const state = attempts.get(q.id) || { selected: '', verified: false };
    attempts.set(q.id, state);
    const status = el('p', null, 'choice-result');
    status.setAttribute('role', 'status');

    function updateResult() {
        status.textContent = '';
        status.removeAttribute('data-result');
        if (!state.verified) return;
        const right = state.selected === correct;
        status.dataset.result = right ? 'correct' : 'incorrect';
        const reference = q.reference ? '参照答案' : '正确答案';
        status.textContent = right ? (q.reference ? '与参照答案一致。' : '答对了。')
            : '答错了。' + reference + '为 ' + correct + '。';
    }

    for (const letter of ['A', 'B', 'C', 'D']) {
        const label = el('label', null, 'choice-option');
        const input = el('input');
        input.type = 'radio';
        input.name = 'choice';
        input.value = letter;
        input.checked = state.selected === letter;
        input.addEventListener('change', () => {
            state.selected = letter;
            state.verified = false;
            updateResult();
        });
        label.append(input, el('span', letter));
        options.append(label);
    }
    const submit = el('button', '验证');
    submit.type = 'submit';
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!state.selected) {
            status.textContent = '请先选择一个选项。';
            options.querySelector('input').focus();
            return;
        }
        state.verified = true;
        updateResult();
    });
    updateResult();
    field.append(options);
    form.append(field, submit, status);
    card.append(form);
}
function addQuestion(q, tab, parent) {
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
    if (q.code) card.append(el('pre', q.code));
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
    addChoiceForm(card, q);
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
    parent.append(card);
}
function matches(record, term) {
    return [record.chapter, record.title, record.source, record.text, record.code, record.output,
        record.steps?.join(' '), record.tip, record.prompt, record.searchText, record.explanation]
        .filter(Boolean).join(' ').toLowerCase().includes(term);
}
function addNote(note, parent) {
    const section = el('section', null, 'note');
    section.append(el('small', note.source), el('h3', note.title));
    for (const line of note.text.split('\n')) {
        section.append(el('p', line, line.startsWith('老师强调') ? 'prose emphasis' : 'prose'));
    }
    if (note.code) section.append(el('pre', note.code));
    if (note.steps?.length) {
        const list = el('ol', null, 'trace');
        note.steps.forEach(step => list.append(el('li', step)));
        section.append(el('h4', '一步一步看'), list);
    }
    if (note.output) section.append(el('h4', '运行结果'), el('pre', note.output, 'note-output'));
    if (note.tip) section.append(el('p', note.tip, 'prose emphasis'));
    parent.append(section);
}
function addNotes(number, term, items) {
    const chapter = chapters.get(number);
    const notes = wrong.checked ? [] : window.courseNotes.filter(note => note.chapterNumber === number && matches(note, term));
    const supplements = wrong.checked ? [] : supplementalNotes.filter(note => note.chapterNumber === number && matches(note, term));
    const topic = practiceTopics.get(number);
    const practice = items.filter(q => topic?.questions.includes(q));
    const originals = items.filter(q => !topic?.questions.includes(q));
    if (!notes.length && !supplements.length && !items.length) return;

    const heading = el('div', null, 'chapter-heading');
    heading.append(el('h2', chapter));
    if (originals.length && (notes.length || supplements.length)) {
        const jump = el('button', '跳到本章原题');
        jump.addEventListener('click', () => {
            const target = document.querySelector('#chapter-questions');
            target.focus({ preventScroll: true });
            target.scrollIntoView();
        });
        heading.append(jump);
    }
    content.append(heading);
    if (notes.length || supplements.length) {
        const lesson = el('div', null, 'lesson');
        notes.forEach(note => addNote(note, lesson));
        if (supplements.length) {
            const fold = el('details', null, 'chapter');
            fold.open = Boolean(term);
            fold.append(el('summary', '手写笔记与课堂重点'));
            supplements.forEach(note => addNote(note, fold));
            lesson.append(fold);
        }
        content.append(lesson);
    }
    if (practice.length) addPracticeTopic(topic, practice, term);
    if (originals.length) addQuestionSection('本章原题', originals, 'notes');
}
function addPracticeTopic(data, items, term) {
    const topic = el('details', null, 'chapter practice-topic');
    topic.open = Boolean(practiceOpen.get(data.chapterNumber) || term || wrong.checked);
    topic.addEventListener('toggle', () => {
        if (topic.isConnected && !search.value.trim() && !wrong.checked) {
            practiceOpen.set(data.chapterNumber, topic.open);
        }
    });
    topic.append(el('summary', data.title + ' · ' + items.length + ' 题'));
    const exercises = el('div', null, 'practice-content');
    const rules = el('ul');
    data.rules.forEach(rule => rules.append(el('li', rule)));
    exercises.append(el('h3', data.rulesHeading ?? '读入和输出规则'), rules);
    items.forEach(q => addQuestion(q, 'notes', exercises));
    topic.append(exercises);
    content.append(topic);
}
function addQuestionSection(title, items, tab) {
    const section = el('section', null, 'question-section');
    const heading = el('h2', title + ' · ' + items.length + ' 题');
    heading.id = 'chapter-questions';
    heading.tabIndex = -1;
    section.append(heading);
    if (tab === 'notes') {
        const classroom = items.filter(q => q.chapterNumber);
        const exercises = items.filter(q => !q.chapterNumber);
        if (classroom.length) {
            section.append(el('h3', '课堂与手写原题'));
            classroom.forEach(q => addQuestion(q, tab, section));
        }
        if (exercises.length) {
            section.append(el('h3', '章节练习原题'));
            exercises.forEach(q => addQuestion(q, tab, section));
        }
    } else {
        items.forEach(q => addQuestion(q, tab, section));
    }
    content.append(section);
}
function render() {
    const tab = currentTab();
    content.replaceChildren();
    tabButtons.forEach(button => {
        if (button.dataset.tab === tab) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
    });
    chapterSelect.hidden = tab === 'program';
    search.placeholder = tab === 'notes' ? '搜索本章笔记、例子或原题' : '搜索题目或知识点';
    const term = search.value.trim().toLowerCase();
    const number = Number(chapterSelect.value);
    const items = questionList(tab).filter(q => (!wrong.checked || marked.has(q.id)) && matches(q, term));
    if (tab === 'notes') addNotes(number, term, items);
    else if (items.length) {
        const title = tab === 'program' ? '编程复习题' : chapters.get(number);
        addQuestionSection(title, items, tab);
    }
    if (!content.childElementCount) {
        content.append(el('p', wrong.checked && !term ? '这里还没有标记的错题。' : '没有匹配的内容。'));
    }
    updateCount(tab);
}
tabButtons.forEach(button => button.addEventListener('click', () => { location.hash = button.dataset.tab; }));
window.addEventListener('hashchange', () => { search.value = ''; wrong.checked = false; render(); });
search.addEventListener('input', render);
wrong.addEventListener('change', render);
for (const [number, title] of chapters) {
    const option = el('option', title);
    option.value = number;
    chapterSelect.append(option);
}
chapterSelect.addEventListener('change', () => {
    search.value = '';
    render();
});
render();

function initEyeCare() {
    const storageKey = 'kisscream.c-language.eye-care.v1';
    const enabled = document.querySelector('#eye-care-enabled');
    const strength = document.querySelector('#eye-care-strength');
    const value = document.querySelector('#eye-care-value');
    const root = document.documentElement;

    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        enabled.checked = saved?.enabled === true;
        if (Number.isFinite(saved?.strength)) strength.value = saved.strength;
    } catch {
        // The page controls still work if browser storage is unavailable.
    }

    function apply() {
        const level = strength.valueAsNumber;
        root.toggleAttribute('data-eye-care', enabled.checked);
        root.style.setProperty('--eye-level', level + '%');
        root.style.setProperty('--eye-image-brightness', (1 - level * 0.0012).toFixed(3));
        strength.disabled = !enabled.checked;
        value.value = level + '%';
    }

    function update() {
        apply();
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                enabled: enabled.checked,
                strength: strength.valueAsNumber
            }));
        } catch {
            // Keep the current appearance even when it cannot be saved.
        }
    }

    enabled.addEventListener('change', update);
    strength.addEventListener('input', update);
    apply();
}

initEyeCare();
