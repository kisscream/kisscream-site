/* KissCream · 手势工作台核心（gk.js）
   纯前端：把 21 点手部骨架压成 15 维「手型指纹」，存在本机浏览器里，
   下次做出同样的手型就命中，播放它绑定的固有动画。
   没有后端、不上传任何画面。 */
(function (global) {
  'use strict';
  var KEY = 'kc.diy.gestures.v1';
  var VERSION = 1;

  // 15 维指纹的权重：伸展度最靠谱，指尖距离次之，张角最飘
  var W = [1.8, 1.8, 1.8, 1.8, 1.8,
           0.55, 0.55, 0.55, 0.55, 0.55,
           1.3, 1.3, 1.3, 1.3,
           1.2];

  var FX_NAMES = ['', '光爆', '星环', '漩涡', '坍缩', '涟漪', '极光'];
  var FX_DESC = ['', '径向炸开再收回', '收成内外双环旋转', '由外向内拧成漩涡', '整体吸向中心再弹开', '一圈圈向外推', '拉成流动的波带'];

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function len2(v) { return Math.sqrt(v[0] * v[0] + v[1] * v[1]) || 1e-6; }
  function nrm2(v) { var L = len2(v); return [v[0] / L, v[1] / L]; }

  // 归一化坐标：原点=腕，尺度=腕到中指掌指关节，手掌轴向对齐 +y
  function frame(lm) {
    var ox = lm[0].x, oy = lm[0].y;
    var sx = lm[9].x - ox, sy = lm[9].y - oy;
    var scale = Math.sqrt(sx * sx + sy * sy) || 1e-6;
    var ang = Math.atan2(sy, sx);
    var cs = Math.cos(-ang), sn = Math.sin(-ang);
    return function (p) {
      var dx = (p.x - ox) / scale, dy = (p.y - oy) / scale;
      return [dx * cs - dy * sn, dx * sn + dy * cs];
    };
  }

  // 21 点 → 15 维指纹
  function feats(lm) {
    if (!lm || lm.length < 21) return null;
    var N = frame(lm);
    var v = [], i, j;
    var chains = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20]];
    // 1) 五指伸展度：每指三段方向的平均点积（1=笔直，-1=完全折回）
    for (i = 0; i < 5; i++) {
      var c = chains[i], s = 0;
      for (j = 0; j < c.length - 2; j++) {
        var a = N(lm[c[j]]), b = N(lm[c[j + 1]]), d = N(lm[c[j + 2]]);
        var u1 = nrm2([d[0] - b[0], d[1] - b[1]]);
        var u2 = nrm2([b[0] - a[0], b[1] - a[1]]);
        s += u1[0] * u2[0] + u1[1] * u2[1];
      }
      v.push(clamp(s / (c.length - 2), -1, 1));
    }
    // 2) 五指尖到腕的距离（手掌尺度已归一化）
    var tips = [4, 8, 12, 16, 20];
    for (i = 0; i < 5; i++) {
      var t = N(lm[tips[i]]);
      v.push(Math.min(3, Math.sqrt(t[0] * t[0] + t[1] * t[1])));
    }
    // 3) 相邻指尖张角（4 个点积）
    for (i = 0; i < 4; i++) {
      var A = N(lm[tips[i]]), B = N(lm[tips[i + 1]]);
      var ua = nrm2(A), ub = nrm2(B);
      v.push(clamp(ua[0] * ub[0] + ua[1] * ub[1], -1, 1));
    }
    // 4) 拇指尖-食指尖距离（捏合度）
    var ti = N(lm[4]), ii = N(lm[8]);
    v.push(Math.min(3, Math.sqrt((ti[0] - ii[0]) * (ti[0] - ii[0]) + (ti[1] - ii[1]) * (ti[1] - ii[1]))));
    return v;
  }

  function distance(a, b) {
    if (!a || !b) return 9;
    var s = 0, ws = 0;
    for (var i = 0; i < a.length; i++) {
      var d = a[i] - b[i], w = W[i] || 1;
      s += w * d * d; ws += w;
    }
    return Math.sqrt(s / ws);
  }

  function mean(list) {
    var out = list[0].slice();
    for (var i = 1; i < list.length; i++)
      for (var j = 0; j < out.length; j++) out[j] += list[i][j];
    for (var k = 0; k < out.length; k++) out[k] /= list.length;
    return out;
  }

  // 从一串采集帧学一个手势：返回中心指纹、离散度、建议容差
  function learn(frames) {
    var fs = frames.filter(function (f) { return f && f.length === 15; });
    if (fs.length < 3) return null;
    var c = mean(fs), ds = [], i;
    for (i = 0; i < fs.length; i++) ds.push(distance(fs[i], c));
    ds.sort(function (x, y) { return x - y; });
    var med = ds[Math.floor(ds.length / 2)];
    var p90 = ds[Math.min(ds.length - 1, Math.floor(ds.length * 0.9))];
    return {
      feats: c.map(function (x) { return +x.toFixed(4); }),
      spread: +med.toFixed(4),
      tol: +clamp(p90 * 2.2 + 0.06, 0.10, 0.45).toFixed(3),
      count: fs.length
    };
  }

  // ---- 存储 ----
  function readAll() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var o = JSON.parse(raw);
      if (!o || o.version !== VERSION || !Array.isArray(o.items)) return [];
      return o.items;
    } catch (e) { return []; }
  }
  function writeAll(items) {
    try { localStorage.setItem(KEY, JSON.stringify({ version: VERSION, items: items, at: Date.now() })); }
    catch (e) { }
  }
  function list() { return readAll(); }
  function save(rec) {
    var items = readAll();
    if (rec.id) {
      for (var i = 0; i < items.length; i++) if (items[i].id === rec.id) { items[i] = rec; writeAll(items); return rec; }
    }
    rec.id = 'g' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
    rec.createdAt = Date.now();
    items.push(rec);
    writeAll(items);
    return rec;
  }
  function remove(id) {
    writeAll(readAll().filter(function (x) { return x.id !== id; }));
  }
  function match(f) {
    if (!f) return null;
    var items = readAll(), best = null;
    for (var i = 0; i < items.length; i++) {
      var d = distance(f, items[i].feats);
      var tol = items[i].tol || 0.30;
      if (d <= tol && (!best || d / tol < best.ratio)) best = { rec: items[i], d: d, ratio: d / tol };
    }
    return best;
  }

  // ---- 给 DIY 面板用的适配层 ----
  function matchFlat(f){
    var m = match(f);
    if (!m) return null;
    var r = m.rec;
    return { id: r.id, name: r.name, fx: r.fx, tol: r.tol, d: m.d, ratio: m.ratio };
  }
  function update(id, patch){
    var items = readAll();
    for (var i = 0; i < items.length; i++){
      if (items[i].id === id){
        for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) items[i][k] = patch[k];
        writeAll(items); return items[i];
      }
    }
    return null;
  }
  function suggestTol(spread){ return +clamp(spread * 2.2 + 0.08, 0.12, 0.45).toFixed(3); }
  // 把 15 维指纹翻成给人看的结论 + 一个自动起的名字
  function describe(f){
    var FN = ['拇指', '食指', '中指', '无名指', '小指'];
    var rows = [], ext = 0, i;
    for (i = 0; i < 5; i++){
      var st = f[i];
      var txt = st > 0.45 ? '伸直' : (st < -0.15 ? '弯曲' : '半屈');
      if (st > 0.45) ext++;
      rows.push([FN[i], txt]);
    }
    var pinch = f[14];
    rows.push(['拇指与食指', pinch < 0.55 ? '捏合' : (pinch < 1.15 ? '半开' : '张开')]);
    var spread = 0;
    for (i = 10; i < 14; i++) spread += f[i];
    spread = spread / 4;
    rows.push(['指间张开', spread > 0.45 ? '张开' : (spread > -0.15 ? '并拢' : '交叉')]);
    rows.push(['指尖离腕', (f[5] + f[6] + f[7] + f[8] + f[9]) / 5 > 1.35 ? '远' : '近']);
    var autoName;
    if (ext <= 1 && pinch < 0.55) autoName = '捏起';
    else if (ext <= 1) autoName = '拳头';
    else if (ext >= 5) autoName = '张手';
    else if (ext === 2) autoName = '比两指';
    else autoName = '手势 ' + ext + ' 指';
    return { rows: rows, autoName: autoName, ext: ext, spread: spread };
  }

  global.GK = {
    dist: distance, add: save, update: update, describe: describe, suggestTol: suggestTol,
    matchFlat: matchFlat,
    VERSION: VERSION, FX_NAMES: FX_NAMES, FX_DESC: FX_DESC, WEIGHTS: W,
    feats: feats, distance: distance, learn: learn,
    list: list, save: save, remove: remove, match: match,
    clear: function () { try { localStorage.removeItem(KEY); } catch (e) { } }
  };
})(window);