/* ============================================================
   SUPRA A90 · 赛博风洞拆解台   （重写版 · 2026-10-28）
   ------------------------------------------------------------
   结构：
     0 基础        1 环境与灯光      2 风洞与流线
     3 车模加载     4 零件表          5 相机预设 / 车内视角
     6 拆解与单独展示 7 小窗预览      8 发动机 B58
     9 声浪（WebAudio） 10 HUD 绑定   11 主循环
   约束（务必保持）：
     · 展示模式只能绕竖轴水平旋转；拆解模式自由
     · 风洞 / 观察视角 / 轮胎水平拆解 这三件事不得退化
   ============================================================ */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const $ = (s) => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* ============================================================
   0 基础
   ============================================================ */
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.32;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x06050d, 0.017);

const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 400);
const CAM_ISO = new THREE.Vector3(4.9, 1.78, 5.3);
camera.position.copy(CAM_ISO);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.target.set(0, 0.62, 0);
controls.minDistance = 3.2;
controls.maxDistance = 18;
controls.enablePan = false;
controls.autoRotateSpeed = 0.5;

const state = {
  mode: 'show',        // show | teardown
  wind: true, heat: false, axes: false,
  speed: 18,           // 风速 m/s（滑杆调节，18 为基准）
  explode: 0, explodeTarget: 0,
  isolated: null,
  seat: false, seatYaw: 0,
  idleAt: 0,
  source: 'none',
};
window.__dbg = { scene, camera, controls, state, parts: [], THREE };

/* ============================================================
   1 环境与灯光
   ============================================================ */
(function makeEnv() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const g = c.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, '#2a2050'); bg.addColorStop(0.45, '#1b1740');
  bg.addColorStop(0.55, '#0d0b1a'); bg.addColorStop(1, '#06050c');
  g.fillStyle = bg; g.fillRect(0, 0, 1024, 512);
  // 柔光箱：黑漆靠这个才有高光带
  for (const [cx, w, a] of [[300, 250, 0.9], [760, 190, 0.7]]) {
    const rg = g.createRadialGradient(cx, 110, 0, cx, 110, w);
    rg.addColorStop(0, `rgba(232,244,255,${a})`);
    rg.addColorStop(1, 'rgba(232,244,255,0)');
    g.fillStyle = rg; g.fillRect(cx - w, 0, w * 2, 330);
  }
  for (const [x, y, col, a] of [[130, 250, '#00e5ff', 0.7], [420, 160, '#ff2bd6', 0.5], [700, 260, '#7b5cff', 0.6], [930, 210, '#00ffc8', 0.5]]) {
    const rg = g.createRadialGradient(x, y, 0, x, y, 190);
    rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.globalAlpha = a; g.fillStyle = rg; g.fillRect(x - 190, y - 190, 380, 380);
  }
  g.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromEquirectangular(tex).texture;
  tex.dispose(); pm.dispose();
})();

scene.add(new THREE.HemisphereLight(0x6d5ac0, 0x0a0818, 1.1));

const sun = new THREE.DirectionalLight(0xdcecff, 4.4);
sun.position.set(4.5, 8.5, 4.0);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1; sun.shadow.camera.far = 30;
sun.shadow.camera.left = -6; sun.shadow.camera.right = 6;
sun.shadow.camera.top = 6; sun.shadow.camera.bottom = -6;
sun.shadow.bias = -0.0007;
scene.add(sun);

const rimC = new THREE.PointLight(0x00e5ff, 30, 18, 2); rimC.position.set(-3.2, 2.2, 2.8); scene.add(rimC);
const rimM = new THREE.PointLight(0xff2bd6, 13, 16, 2); rimM.position.set(3.4, 2.3, -3.0); scene.add(rimM);
const rimV = new THREE.PointLight(0x7b5cff, 20, 20, 2); rimV.position.set(0, 3.6, -4.2); scene.add(rimV);
const studio = new THREE.DirectionalLight(0xffffff, 0); studio.position.set(4.5, 5.5, 4.0); scene.add(studio);
const topL = new THREE.DirectionalLight(0xeaf6ff, 2.4); topL.position.set(-3.5, 6.0, 5.5); scene.add(topL);

// 车内视角补光（挂在相机上，只在第一人称打开）
const eyeLight = new THREE.PointLight(0xffe9d5, 0, 6.5, 2);
eyeLight.position.set(0.05, 0.2, 0);
camera.add(eyeLight);
scene.add(camera);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(90, 90),
  new THREE.MeshStandardMaterial({ color: 0x0b0a14, metalness: 0.82, roughness: 0.28, envMapIntensity: 1.2 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(30, 30, 0x1d4f6e, 0x0b1c2a);
grid.position.y = 0.003;
grid.material.transparent = true; grid.material.opacity = 0.5;
scene.add(grid);

(function contactShadow() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const rg = g.createRadialGradient(128, 128, 10, 128, 128, 126);
  rg.addColorStop(0, 'rgba(0,0,0,.85)'); rg.addColorStop(0.55, 'rgba(0,0,0,.35)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 3.4), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0.9, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.006;
  scene.add(m);
})();

/* ============================================================
   2 风洞与流线
   ============================================================ */
const TUN = { L: 11.6, H: 3.9, W: 4.6, xIn: 5.6, xOut: -5.6 };
const wind = new THREE.Group();
scene.add(wind);

// 风洞框线
const frame = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.BoxGeometry(TUN.L, TUN.H, TUN.W)),
  new THREE.LineBasicMaterial({ color: 0x2f9fd0, transparent: true, opacity: 0.42 })
);
frame.position.y = TUN.H / 2;
wind.add(frame);



// 碳纤维斜纹贴图（程序生成，当 bumpMap 用）
function makeCarbonTexture() {
  const S = 128, n = 8, cell = S / n;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = '#0e0e10'; g.fillRect(0, 0, S, S);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const hi = ((x + y) % 4 < 2) ? 1 : 0;
      const base = 22 + hi * 26;
      g.fillStyle = `rgb(${base},${base},${base + 3})`;
      g.fillRect(x * cell, y * cell, cell, cell);
      g.strokeStyle = `rgba(255,255,255,${0.05 + hi * 0.07})`;
      g.lineWidth = 1;
      for (let k = 2; k < cell; k += 3) {
        g.beginPath(); g.moveTo(x * cell + k, y * cell); g.lineTo(x * cell + k, y * cell + cell); g.stroke();
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(30, 30);
  t.anisotropy = 4;
  return t;
}
const carbonTex = makeCarbonTexture();
function carbonize(m) {
  if (!m || m.__carbon) return m;
  const phys = new THREE.MeshPhysicalMaterial({
    map: m.map || null,
    color: m.color ? m.color.clone() : new THREE.Color(0x0b0b0e),
    metalness: 0.42,
    roughness: 0.36,
    clearcoat: 1.0,
    clearcoatRoughness: 0.07,
    envMapIntensity: 1.9,
    bumpMap: carbonTex,
    bumpScale: 0.016,
    side: m.side,
    transparent: m.transparent,
    opacity: m.opacity,
  });
  phys.__carbon = true;
  return phys;
}

// 地面刻度 + 中线
const markMat = new THREE.MeshBasicMaterial({ color: 0x25c6ff, transparent: true, opacity: 0.5 });
for (let x = -6; x <= 6; x++) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.004, x % 5 === 0 ? 1.1 : 0.45), markMat);
  m.position.set(x, 0.007, 0);
  wind.add(m);
}
// 导光条：地面两侧 + 顶部，给车身和地面打出青色光带
const stripMat = new THREE.MeshBasicMaterial({ color: 0x2fd8ff });
const stripMatW = new THREE.MeshBasicMaterial({ color: 0xdff2ff, transparent: true, opacity: 0.45 });
for (const z of [-2.15, 2.15]) {
  const st = new THREE.Mesh(new THREE.BoxGeometry(TUN.L * 0.92, 0.025, 0.05), stripMat);
  st.position.set(0, 0.02, z);
  wind.add(st);
  const pl = new THREE.PointLight(0x2fd8ff, 3.2, 6.0, 2);
  pl.position.set(0, 0.3, z);
  wind.add(pl);
}
const ceil = new THREE.Mesh(new THREE.BoxGeometry(TUN.L * 0.72, 0.02, 0.09), stripMatW);
ceil.position.set(0, TUN.H - 0.25, 0);
wind.add(ceil);
const ceilL = new THREE.PointLight(0xcfeaff, 2.4, 8, 2);
ceilL.position.set(0, TUN.H - 0.5, 0);
wind.add(ceilL);
const centerLine = new THREE.Mesh(new THREE.BoxGeometry(TUN.L, 0.004, 0.03), new THREE.MeshBasicMaterial({ color: 0x35e0ff }));
centerLine.position.set(0, 0.007, 0);
wind.add(centerLine);

/* ---------- 流线：每条泳道一根折线 ----------
   之前用 LineSegments 逐段上色，GPU 上会退化成一片白点，所以改成
   一根折线 = 一条泳道，颜色沿折线平滑渐变，穿过车体时靠深度测试遮挡。 */
const NL = 13, NP = 64;
const lanes = [];
for (let i = 0; i < NL; i++) {
  if (i < 9) {
    // 两侧绕流：贴车身侧面掠过
    const side = i % 2 ? 1 : -1;
    const band = ((i >> 1) % 5) / 4;
    lanes.push({ z: side * (1.02 + band * 0.62), y: 0.16 + band * 0.92, ph: (i * 0.37) % 1 });
  } else {
    // 车顶上方两三层
    const t = (i - 9) / Math.max(1, NL - 10);
    const sp = t * 2 - 1;
    lanes.push({ z: sp * 1.15, y: 1.62 + Math.abs(sp) * 0.5, ph: (i * 0.53) % 1 });
  }
}
const flow = new THREE.Group();
wind.add(flow);
const laneLines = lanes.map((L) => {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NP * 3), 3));
  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(NP * 3), 3));
  const m = new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const line = new THREE.Line(g, m);
  line.frustumCulled = false;
  flow.add(line);
  return { L, g };
});
window.__dbg.flow = flow;

// 车体包围盒（用于隐藏穿进车里的线段），加载模型后更新
const bodyBox = new THREE.Box3(new THREE.Vector3(-2.2, 0, -1.05), new THREE.Vector3(2.2, 1.3, 1.05));
function inBody(x, y, z) {
  const b = bodyBox;
  return x > b.min.x - 0.02 && x < b.max.x + 0.02 &&
         y > b.min.y - 0.02 && y < b.max.y + 0.02 &&
         z > b.min.z - 0.02 && z < b.max.z + 0.02;
}
// 流速场：车头上方快、车身两侧慢，越靠后越慢
function speedAt(x, z) {
  const nose = clamp((x - bodyBox.max.x) / 2.6, 0, 1);      // 车前方 1 → 0
  const side = clamp(1 - Math.abs(z) / 2.2, 0, 1);
  return clamp(0.34 + 0.5 * nose + 0.28 * side, 0, 1);
}
// 车身附近流线被"排开"：过车头时抬高、车尾下沉
function liftAt(x, z) {
  const near = clamp(1 - Math.abs(z) / 1.9, 0, 1);
  const ramp = Math.exp(-Math.pow((x + 0.3) / 1.9, 2));
  return 0.17 * near * ramp;
}
const HEAT = [[0.1, 0.35, 1.0], [0.1, 0.92, 0.86], [0.35, 1.0, 0.42], [1.0, 0.86, 0.2], [1.0, 0.28, 0.22]];
function heatAt(t) {
  const s = clamp(t, 0, 1) * (HEAT.length - 1);
  const i = Math.min(HEAT.length - 2, Math.floor(s)), f = s - i;
  const a = HEAT[i], b = HEAT[i + 1];
  return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f)];
}

/* ============================================================
   3 车模加载
   ============================================================ */
const carRoot = new THREE.Group();
scene.add(carRoot);
const carShell = new THREE.Group();   // 车壳容器：车内视角时整坨隐藏
carRoot.add(carShell);

const PART_KINDS = [
  [/brake/i, '刹车卡钳'],
  [/wh_ref|tyre|tire/i, '轮胎'],
  [/wh_0|wheel_hub/i, '轮毂'],
  [/bonnet|hood/i, '引擎盖'],
  [/glass|window/i, '玻璃'],
  [/mirror/i, '后视镜'],
  [/plate|floor|under/i, '底板'],
  [/chrome|trim/i, '镀铬饰条'],
  [/lamp|light/i, '灯罩'],
  [/body|paint|shell/i, '车身钣金'],
];
function labelOf(mesh) {
  const s = (mesh.name || '') + '|' + (mesh.material?.name || '');
  for (const [re, label] of PART_KINDS) if (re.test(s)) return label;
  return mesh.name ? mesh.name.slice(0, 12) : '其他饰件';
}

const parts = [];
function addPart(name, obj, note, dir, dist) {
  obj.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  parts.push({ name, obj, note: note || '', base: obj.position.clone(), dir, dist, pull: 0, extra: new THREE.Vector3() });
}

function buildParts(root) {
  parts.length = 0;
  root.updateMatrixWorld(true);
  const groups = new Map();
  root.traverse((o) => {
    if (!o.isMesh) return;
    const key = labelOf(o);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(o);
  });
  const c = new THREE.Box3().setFromObject(root).getCenter(new THREE.Vector3());
  for (const [label, meshes] of groups) {
    const g = new THREE.Group();
    g.name = label;
    carRoot.add(g);
    g.position.copy(new THREE.Vector3(0, 0, 0));
    for (const m of meshes) g.attach(m);
    const bb = new THREE.Box3().setFromObject(g);
    const ctr = bb.getCenter(new THREE.Vector3());
    // 拆解方向：默认水平向外（轮胎 / 门板 就靠这个要求，不能改成竖直散开）
    const dir = new THREE.Vector3(ctr.x - c.x, 0, ctr.z - c.z);
    if (dir.lengthSq() < 1e-4) dir.set(0, 0, 1);
    dir.normalize();
    if (label === '引擎盖') dir.set(dir.x * 0.6, 0.8, 0).normalize();
    if (label === '玻璃') dir.set(0, 1, 0);
    if (label === '车身钣金') dir.set(0, 0.9, 0);
    // 玻璃是透明的，飞太远会留下"大窟窿"，只轻轻抬一点
    const dist = label === '车身钣金' ? 0.35 : label === '玻璃' ? 0.16 : label === '引擎盖' ? 0.85 : 1.28;
    addPart(label, g, '', dir, dist);
  }
  window.__dbg.parts = parts;
  rebuildPartList();
}

const loader = new GLTFLoader();
const MODELS = ['./model/scene.glb', './model/scene.gltf'];
function loadModel(i = 0) {
  loader.load(MODELS[i], (gltf) => {
    const root = gltf.scene;
    const wrap = new THREE.Group();
    wrap.add(root);
    const b0 = new THREE.Box3().setFromObject(root);
    const s0 = b0.getSize(new THREE.Vector3());
    const k = 4.4 / Math.max(s0.x, s0.y, s0.z, 0.001);
    wrap.scale.setScalar(k);
    if (s0.z > s0.x * 1.2) wrap.rotation.y = -Math.PI / 2;
    const b1 = new THREE.Box3().setFromObject(wrap);
    const c1 = b1.getCenter(new THREE.Vector3());
    wrap.position.set(-c1.x, -b1.min.y, -c1.z);
    carShell.add(wrap);
    // 这台车是哑光黑贴图，默认渲染基本是一团黑：提亮贴图 + 拉高环境反射，让碳纤纹理读得出来
    wrap.traverse((o) => {
      if (!o.isMesh) return;
      const arr = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of arr) {
        if (!m) continue;
        m.envMapIntensity = 3.0;
        if (m.color) m.color.multiplyScalar(1.25);
        if (m.metalness !== undefined && m.metalness < 0.5) m.metalness = 0.55;
        if (m.roughness !== undefined) m.roughness = Math.min(m.roughness, 0.62);
      }
    });
    state.source = 'model';
    // 车身 / 机盖 / 后视镜外壳换成碳纤维：2×2 斜纹 bumpMap + 清漆层
    for (const p of parts) {
      if (!/车身钣金|引擎盖|后视镜/.test(p.name)) continue;
      p.obj.traverse((o) => {
        if (!o.isMesh) return;
        const arr = Array.isArray(o.material) ? o.material : [o.material];
        const out = arr.map((m) => carbonize(m));
        o.material = Array.isArray(o.material) ? out : out[0];
      });
    }

    buildParts(wrap);
    buildLamps((parts.find((p) => /车身钣金/.test(p.name)) || {}).obj);
    buildPlate();
    // buildInterior();  // 已换成 Sketchfab 真实内饰（loadInterior）
  // 车内视角专用：从风挡方向来的冷光，只把仪表台/方向盘勾出轮廓
  seatRim = new THREE.DirectionalLight(0x7fe4ff, 0); seatRim.position.set(-4, 1.4, -1.2); scene.add(seatRim);
    buildEngine();
    buildChassis();
    // 内饰 4.8MB：先让主场景跑起来，空闲 2.2s 再后台拉，进车内视角时也会按需补拉
    setTimeout(loadInterior, 2200);
    updateBodyBox();
    buildMiniCar();
    rebuildPartList();
    if ($('#btnWing')) $('#btnWing').style.display = 'none';
  }, undefined, () => { if (i + 1 < MODELS.length) loadModel(i + 1); });
}
function updateBodyBox() {
  // 只取「车身钣金」的实际范围做遮挡判定；整台车的包围盒会把发动机/座椅也算进去，过大
  const shell = parts.find((p) => p.name === '车身钣金');
  const bb = new THREE.Box3().setFromObject(shell ? shell.obj : carRoot);
  const sz = bb.getSize(new THREE.Vector3());
  // 兜底：算出来尺寸离谱（含隐藏件/包围球）就退回默认盒
  if (sz.x > 6.5 || sz.x < 1 || sz.y > 2.6 || sz.z > 3.2) {
    bodyBox.set(new THREE.Vector3(-2.2, 0.05, -1.05), new THREE.Vector3(2.2, 1.32, 1.05));
    return;
  }
  bodyBox.copy(bb);
}

/* ============================================================
   4 零件表（右下角）
   ============================================================ */
function rebuildPartList() {
  const box = $('#partList');
  if (!box) return;
  box.innerHTML = '';
  for (const p of parts) {
    const d = document.createElement('div');
    d.className = 'part';
    d.dataset.name = p.name;
    d.innerHTML = `<span>${p.name}</span><i>${p.note}</i>`;
    d.onclick = () => isolate(p.name);
    box.appendChild(d);
  }
  $('#partAll').onclick = () => { clearIsolate(); toast('已还原：显示全部零件'); };
}

/* ============================================================
   5 相机预设 / 车内视角
   ============================================================ */
const VIEWS = {
  top: { pos: new THREE.Vector3(0.03, 8.4, 0.06), target: new THREE.Vector3(0, 0.45, 0), label: '俯视' },
  level: { pos: new THREE.Vector3(7.6, 1.10, 0.04), target: new THREE.Vector3(0, 0.60, 0), label: '平视' },
  iso: { pos: CAM_ISO.clone(), target: new THREE.Vector3(0, 0.62, 0), label: '45° 斜视' },
  seat: { label: '车内视角', seat: true, fov: 62 },
};
const SEAT_POS = new THREE.Vector3(0.44, 1.14, -0.40);
let camTween = null;

function tweenCam(pos, target, fov) {
  camTween = {
    t: 0, from: camera.position.clone(), to: pos.clone(),
    ft: controls.target.clone(), tt: target.clone(),
    fov0: camera.fov, fov1: fov || camera.fov,
  };
}
function setView(name) {
  document.querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('on', b.dataset.view === name));
  const v = VIEWS[name];
  if (!v) return;
  if (v.seat) {
    state.seat = true; state.seatYaw = 0;
    controls.enabled = false;
    camTween = null;
    camera.position.copy(SEAT_POS);
    camera.fov = v.fov; camera.updateProjectionMatrix();
    controls.target.set(SEAT_POS.x - 1, SEAT_POS.y, SEAT_POS.z);
    eyeLight.intensity = 0.85;
    if (seatRim) seatRim.intensity = 2.6;
    // 车壳保留（顶棚/A 柱靠它），只摘掉玻璃；内饰是独立零件，正常显示
    for (const p of parts) p.obj.visible = !/玻璃/.test(p.name);
    if (typeof carShell !== 'undefined') carShell.visible = true;
    if (typeof interior !== 'undefined' && interior) interior.visible = false;
    loadInterior();   // 模型还没拉完时，进车内立即补拉
    if (engineRig) engineRig.G.visible = false;
    toast('车内视角：左右拖动 → 水平环视内饰');
    return;
  }
  if (state.seat) {
    state.seat = false;
    controls.enabled = true;
    camera.fov = 38; camera.updateProjectionMatrix();
    for (const p of parts) p.obj.visible = true;
    if (typeof interior !== 'undefined' && interior) interior.visible = false;
  }
  eyeLight.intensity = 0;
  tweenCam(v.pos, v.target, 38);
  controls.minPolarAngle = 0.02; controls.maxPolarAngle = Math.PI - 0.02;
}

/* 展示模式：只允许水平转（极角锁死在水平面附近） */
function applyModeLimits() {
  if (state.mode === 'show') {
    controls.minPolarAngle = 0.06;
    controls.maxPolarAngle = Math.PI - 0.06;
  } else {
    controls.minPolarAngle = 0.08;
    controls.maxPolarAngle = Math.PI - 0.08;
  }
}
applyModeLimits();

function setMode(m) {
  state.mode = m;
  flow.visible = (m === 'show');
  state.explodeTarget = m === 'teardown' ? 1 : 0;
  document.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
  applyModeLimits();
  if (m === 'teardown') {
    tweenCam(new THREE.Vector3(7.4, 3.1, 8.0), new THREE.Vector3(0, 0.55, 0), 38);
    toast('拆解模式：零件沿水平方向散开，可任意角度观察');
  } else {
    clearIsolate();
    tweenCam(CAM_ISO, new THREE.Vector3(0, 0.62, 0), 38);
    toast('展示模式：只在水平面内旋转');
  }
}

/* ============================================================
   6 拆解 / 单独展示
   ============================================================ */
function updateExplode(dt) {
  state.explode += (state.explodeTarget - state.explode) * Math.min(1, dt * 3.2);
  for (const p of parts) {
    const want = state.isolated === p.name ? 1 : 0;
    p.pull = lerp(p.pull, want, Math.min(1, dt * 6));
    p.obj.position.copy(p.base)
      .addScaledVector(p.dir, state.explode * p.dist + p.pull * 1.7)
      .add(p.extra);
  }
}
function clearIsolate() {
  state.isolated = null;
  document.querySelectorAll('.part').forEach((e) => e.classList.remove('on'));
  if (!state.seat) { for (const p of parts) p.obj.visible = true; carShell.visible = true; }
  studio.intensity = 0;
  if (!state.seat) tweenCam(VIEWS.iso.pos, VIEWS.iso.target, 38);
  Engine.setRev(false);
  revOn = false;
  if ($('#btnRev')) $('#btnRev').classList.remove('on');
}
function isolate(name) {
  const p = parts.find((x) => x.name === name);
  if (!p) return;
  if (state.isolated === name) { clearIsolate(); return; }
  state.isolated = name;
  document.querySelectorAll('.part').forEach((e) => e.classList.toggle('on', e.dataset.name === name));
  for (const q of parts) q.obj.visible = (q === p);
  if (engineRig) engineRig.G.visible = (name === '发动机 B58');
  const at = p.base.clone().addScaledVector(p.dir, state.explode * p.dist + 1.7);
  const sz = new THREE.Box3().setFromObject(p.obj).getSize(new THREE.Vector3()).length();
  const d = Math.max(1.25, sz * 1.5);
  tweenCam(new THREE.Vector3(at.x + d * 0.5, at.y + d * 0.45, at.z + d * 0.8), at, 34);
  if (name === '发动机 B58') { Engine.setRev(true); revOn = true; $('#btnRev')?.classList.add('on'); }
  toast('单独展示：' + name + (p.note ? '（' + p.note + '）' : ''));
}

/* ============================================================
   7 小窗预览
   ============================================================ */
const miniRenderer = new THREE.WebGLRenderer({ canvas: $('#mc'), antialias: true, alpha: true });
miniRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
miniRenderer.setSize(232, 148, false);
miniRenderer.toneMapping = THREE.ACESFilmicToneMapping;
miniRenderer.toneMappingExposure = 1.5;
const miniScene = new THREE.Scene();
miniScene.add(new THREE.HemisphereLight(0x9fd8ff, 0x101020, 2.2));
const mLight = new THREE.DirectionalLight(0xffffff, 3.0); mLight.position.set(3, 5, 4); miniScene.add(mLight);
const mRim = new THREE.PointLight(0x35d6ff, 40, 20, 2); mRim.position.set(-4, 2, -3); miniScene.add(mRim);
const miniCam = new THREE.PerspectiveCamera(30, 232 / 148, 0.1, 60);
let miniCar = null;

function buildMiniCar() {
  if (miniCar) miniScene.remove(miniCar);
  miniCar = carRoot.clone(true);
  miniCar.traverse((o) => {
    if (!o.isMesh) return;
    o.material = Array.isArray(o.material) ? o.material.map((m) => m.clone()) : o.material.clone();
    const arr = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of arr) {
      if (m.color) m.color.multiplyScalar(1.7);
      m.envMapIntensity = 3.0;
    }
  });
  miniScene.add(miniCar);
}

/* ============================================================
   8 内饰 + 发动机 B58
   ============================================================ */
let interior = null, seatRim = null;
/* 车内：模型本身没有内饰，这里只做「从驾驶席往前看」需要的最小一套：
   仪表台 + 方向盘 + 中控 + 两张座椅 + 脚坑。车壳在车内视角里隐藏，
   只保留引擎盖和后视镜，于是画面前方是引擎盖和风洞，像真的坐在驾驶席上。 */
function buildInterior() {
  const g = new THREE.Group();
  g.name = 'interior';
  const M = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, envMapIntensity: 0.45 });
  const dark = M(0x0d0f13, 0.72, 0.25), soft = M(0x141820, 0.86, 0.08), trim = M(0x8b96a6, 0.3, 0.85);
  const glow = new THREE.MeshBasicMaterial({ color: 0x2fd8ff });
  const box = (w, h, d, mat, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); g.add(m); return m;
  };
  // 仪表台：横跨车厢，靠近挡风玻璃处抬高
  box(0.34, 0.26, 1.52, dark, -0.62, 0.74, 0);      // 仪表台主体（车头朝 -X，所以薄在 X、宽在 Z）
  box(0.42, 0.05, 1.52, soft, -0.62, 0.89, 0);      // 台面上盖
  box(0.30, 0.20, 0.30, dark, -0.40, 0.70, 0);      // 中控立台
  box(0.03, 0.14, 0.22, glow, -0.26, 0.80, 0);      // 中控屏
  box(1.30, 0.05, 1.30, dark, 0.04, 0.44, 0);       // 地板
  box(0.16, 0.22, 0.70, dark, -0.92, 0.56, 0);      // 脚坑前的防火墙
  // 方向盘（左舵：z 负）
  const wg = new THREE.Group();
  wg.position.set(-0.50, 0.86, -0.33);
  wg.add(new THREE.Mesh(new THREE.TorusGeometry(0.140, 0.016, 8, 26), soft));
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.040, 0.040, 0.04, 16), trim);
  hub.rotation.x = Math.PI / 2; wg.add(hub);
  for (let i = 0; i < 3; i++) {
    const h = new THREE.Group(); h.rotation.z = i * Math.PI * 2 / 3 + 0.3;
    const sp = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.135, 0.010), trim);
    sp.position.y = 0.072; h.add(sp); wg.add(h);
  }
  wg.rotation.y = 0.22; wg.rotation.x = 0.30;
  g.add(wg);
  // 座椅（主副驾）
  for (const z of [-0.34, 0.34]) {
    box(0.44, 0.10, 0.42, soft, 0.18, 0.52, z);
    box(0.14, 0.54, 0.42, soft, 0.40, 0.78, z);
    box(0.12, 0.20, 0.40, soft, 0.45, 1.02, z);
  }
  // 车顶内饰（只到头顶后方，前方留空好看引擎盖）
  box(0.70, 0.04, 1.52, dark, 0.30, 1.24, 0);
  // 光：顶灯偏暖、屏幕偏青
  const l1 = new THREE.PointLight(0xffdcb8, 0.75, 2.6, 2); l1.position.set(-0.05, 1.16, 0); g.add(l1);
  const l2 = new THREE.PointLight(0x2fd8ff, 0.55, 1.8, 2); l2.position.set(-0.2, 0.82, 0); g.add(l2);
  g.visible = false;
  interior = g;
  carRoot.add(g);
}
/* ---------- 程序化轮胎 / 轮毂 / 卡钳 ---------- */
function treadTex() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = '#101215'; x.fillRect(0, 0, 512, 128);
  // 纵向主沟槽
  x.fillStyle = '#05070a';
  for (const y of [30, 64, 98]) x.fillRect(0, y - 4, 512, 8);
  // 斜向细纹（胎块分隔）
  x.strokeStyle = '#05070a'; x.lineWidth = 5;
  for (let i = 0; i < 16; i++) {
    const ox = i * 32;
    x.beginPath(); x.moveTo(ox, 8); x.lineTo(ox + 18, 30); x.stroke();
    x.beginPath(); x.moveTo(ox + 16, 34); x.lineTo(ox + 34, 64); x.stroke();
    x.beginPath(); x.moveTo(ox, 70); x.lineTo(ox + 18, 100); x.stroke();
    x.beginPath(); x.moveTo(ox + 16, 104); x.lineTo(ox + 34, 124); x.stroke();
  }
  // 高光边（胎肩）
  x.strokeStyle = '#2a3038'; x.lineWidth = 3;
  x.beginPath(); x.moveTo(0, 4); x.lineTo(512, 4); x.stroke();
  x.beginPath(); x.moveTo(0, 124); x.lineTo(512, 124); x.stroke();
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(6, 1);
  return t;
}
function plateTex() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#eef2ec'; x.fillRect(0, 0, 512, 256);
  x.strokeStyle = '#17683c'; x.lineWidth = 10; x.strokeRect(10, 10, 492, 236);
  x.fillStyle = '#17683c';
  x.font = 'bold 44px "Microsoft YaHei", sans-serif';
  x.fillText('品川 300', 34, 78);
  x.font = 'bold 40px "Microsoft YaHei", sans-serif';
  x.fillText('き', 34, 140);
  x.font = 'bold 62px "Microsoft YaHei", sans-serif';
  x.fillText('·', 78, 140);
  x.font = 'bold 74px "Segoe UI", "Microsoft YaHei", sans-serif';
  x.fillText('KissCream', 34, 220);
  const t = new THREE.CanvasTexture(c); t.anisotropy = 8; return t;
}
function makeWheel(R, W, sign) {
  const g = new THREE.Group();
  const rubber = new THREE.MeshStandardMaterial({ map: treadTex(), color: 0x2a2e34, roughness: 0.95, metalness: 0.05 });
  const tread = new THREE.Mesh(new THREE.CylinderGeometry(R, R, W, 64, 1, true), rubber);
  tread.rotation.x = Math.PI / 2; g.add(tread);
  // 胎侧：从胎肩收到轮辋，别留黑洞
  const sideMat = new THREE.MeshStandardMaterial({ color: 0x191c21, roughness: 0.88, metalness: 0.06, side: THREE.DoubleSide });
  for (const s2 of [-1, 1]) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(R * 0.60, R * 0.99, 64, 1), sideMat);
    ring.position.z = s2 * W / 2; g.add(ring);
  }
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xb9c4d2, metalness: 1, roughness: 0.20 });
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.60, R * 0.60, W * 0.94, 48, 1, true), rimMat);
  barrel.rotation.x = Math.PI / 2; g.add(barrel);
  // 轮辐盘面（朝外那一侧），让轮子看起来是实心的
  const face = new THREE.Mesh(new THREE.CircleGeometry(R * 0.60, 48),
    new THREE.MeshStandardMaterial({ color: 0x232830, metalness: 0.85, roughness: 0.38 }));
  face.position.z = sign * (W * 0.44); g.add(face);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(R * 0.585, W * 0.055, 10, 56), rimMat);
  lip.position.z = sign * (W * 0.45); g.add(lip);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.155, R * 0.155, W * 0.52, 28),
    new THREE.MeshStandardMaterial({ color: 0x2f343d, metalness: 0.95, roughness: 0.28 }));
  hub.rotation.x = Math.PI / 2; hub.position.z = sign * (W * 0.30); g.add(hub);
  // 5 组双辐条
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    for (const off of [-0.16, 0.16]) {
      const sp = new THREE.Mesh(new THREE.BoxGeometry(R * 0.40, R * 0.095, W * 0.16), rimMat);
      sp.position.set(Math.cos(a + off) * R * 0.34, Math.sin(a + off) * R * 0.34, sign * (W * 0.40));
      sp.rotation.z = a + off; g.add(sp);
    }
  }
  // 5 颗轮毂螺母
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const nut = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.045, R * 0.045, W * 0.10, 6),
      new THREE.MeshStandardMaterial({ color: 0xd8dee6, metalness: 1, roughness: 0.22 }));
    nut.rotation.x = Math.PI / 2;
    nut.position.set(Math.cos(a) * R * 0.10, Math.sin(a) * R * 0.10, sign * (W * 0.34));
    g.add(nut);
  }
  // 打孔刹车盘 + 卡钳
  const discMat = new THREE.MeshStandardMaterial({ color: 0x7d8794, metalness: 1, roughness: 0.30 });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.62, R * 0.62, 0.024, 48), discMat);
  disc.rotation.x = Math.PI / 2; disc.position.z = sign * (W * 0.06); g.add(disc);
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x20242a, metalness: 0.5, roughness: 0.7 });
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.021, R * 0.021, 0.03, 6), holeMat);
    hole.rotation.x = Math.PI / 2;
    hole.position.set(Math.cos(a) * R * 0.45, Math.sin(a) * R * 0.45, sign * (W * 0.06));
    g.add(hole);
  }
  const calMat = new THREE.MeshStandardMaterial({ color: 0xc41f2e, roughness: 0.40, metalness: 0.55 });
  const cal = new THREE.Mesh(new THREE.BoxGeometry(R * 0.24, R * 0.50, W * 0.26), calMat);
  cal.position.set(-R * 0.40, R * 0.08, sign * (W * 0.10));
  cal.rotation.z = 0.44; g.add(cal);
  return g;
}function buildWheels() {
  const tire = parts.find((p) => p.name === '轮胎');
  if (!tire) return;
  const corners = new Map();
  tire.obj.updateMatrixWorld(true);
  tire.obj.traverse((o) => {
    if (!o.isMesh) return;
    const b = new THREE.Box3().setFromObject(o);
    const s = b.getSize(new THREE.Vector3());
    if (s.length() < 0.08) return;
    const c = b.getCenter(new THREE.Vector3());
    const key = (c.x > 0 ? 'F' : 'R') + (c.z > 0 ? 'L' : 'R');
    let cur = corners.get(key);
    if (!cur) { cur = { n: 0, c: new THREE.Vector3(), s: new THREE.Vector3() }; corners.set(key, cur); }
    cur.n++; cur.c.add(c); cur.s.max(s);
  });
  if (corners.size !== 4) return;
  const drop = ['轮胎', '轮毂', '刹车卡钳'];
  for (const nm of drop) {
    const i = parts.findIndex((p) => p.name === nm);
    if (i >= 0) { parts[i].obj.visible = false; parts.splice(i, 1); }
  }
  const halfZ = Math.max(Math.abs(bb.min.z), Math.abs(bb.max.z));
  const NAMES = { FL: '轮胎·左前', FR: '轮胎·右前', RL: '轮胎·左后', RR: '轮胎·右后' };
  for (const [key, cur] of corners) {
    const ctr = cur.c.clone().multiplyScalar(1 / cur.n);
    const R = cur.s.y / 2 * 0.995, W = Math.max(0.16, cur.s.z * 0.92);
    const sign = ctr.z > 0 ? 1 : -1;
    const g = makeWheel(R, W, sign);
    g.name = NAMES[key] || '轮胎';
    g.position.set(ctr.x, ctr.y, sign * (halfZ - W / 2 - 0.004));
    carRoot.add(g);
    const dir = new THREE.Vector3(ctr.x > 0 ? 0.25 : -0.25, 0, ctr.z > 0 ? 1 : -1).normalize();
    addPart(g.name, g, '265/35 R19 · 六活塞卡钳', dir, 1.5);
  }
}
function buildPlate() {
  const hood = parts.find((p) => p.name === '引擎盖');
  const bb = new THREE.Box3().setFromObject(carRoot);
  const frontX = hood ? new THREE.Box3().setFromObject(hood.obj).getCenter(new THREE.Vector3()).x : bb.max.x;
  const rearX = frontX > 0 ? bb.min.x : bb.max.x;
  const mat = new THREE.MeshStandardMaterial({ map: plateTex(), roughness: 0.55, metalness: 0.1 });
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.17), mat);
  pl.position.set(rearX + (frontX > 0 ? 0.02 : -0.02), 0.60, 0);
  pl.rotation.y = frontX > 0 ? -Math.PI / 2 : Math.PI / 2;
  carRoot.add(pl);
}
let engineRig = null;
function buildEngine() {
  const G = new THREE.Group();
  G.name = 'engine';
  const metal = new THREE.MeshStandardMaterial({ color: 0x3a424e, roughness: 0.38, metalness: 0.92 });
  const wall = new THREE.MeshStandardMaterial({ color: 0x28323d, roughness: 0.22, metalness: 0.9, transparent: true, opacity: 0.4, depthWrite: false, side: THREE.DoubleSide });
  const alu = new THREE.MeshStandardMaterial({ color: 0xa6b3c2, roughness: 0.22, metalness: 1 });
  const darkm = new THREE.MeshStandardMaterial({ color: 0x14171b, roughness: 0.7, metalness: 0.3 });
  const glow = new THREE.MeshBasicMaterial({ color: 0x35d6ff });
  const add = (geo, mat, x, y, z, rx, rz) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    if (rx) m.rotation.x = rx;
    if (rz) m.rotation.z = rz;
    G.add(m); return m;
  };
  const L = 0.66, W = 0.28, H = 0.22;
  add(new THREE.BoxGeometry(L, H, 0.02), wall, 0, 0, W / 2);
  add(new THREE.BoxGeometry(L, H, 0.02), wall, 0, 0, -W / 2);
  add(new THREE.BoxGeometry(0.02, H, W), wall, L / 2, 0, 0);
  add(new THREE.BoxGeometry(0.02, H, W), wall, -L / 2, 0, 0);
  add(new THREE.BoxGeometry(L, 0.03, W), metal, 0, -H / 2, 0);
  add(new THREE.BoxGeometry(L * 0.8, 0.07, W * 0.8), darkm, 0, -H / 2 - 0.05, 0);
  const bores = [], pistons = [], rods = [];
  const step = L * 0.86 / 5;
  for (let i = 0; i < 6; i++) {
    const x = -L * 0.43 + i * step;
    bores.push(x);
    add(new THREE.CylinderGeometry(0.043, 0.043, 0.18, 18, 1, true), metal, x, 0.02, 0);
    pistons.push(add(new THREE.CylinderGeometry(0.041, 0.041, 0.055, 18), alu, x, 0.02, 0));
    rods.push(add(new THREE.BoxGeometry(0.017, 0.13, 0.015), alu, x, -0.04, 0));
  }
  add(new THREE.CylinderGeometry(0.028, 0.028, L * 0.95, 14), alu, 0, -H / 2 + 0.02, 0, 0, Math.PI / 2);
  for (let i = 0; i < 6; i++) add(new THREE.CylinderGeometry(0.019, 0.019, 0.035, 10), glow, bores[i], -H / 2 + 0.02, 0.028, Math.PI / 2);
  add(new THREE.BoxGeometry(L, 0.09, W), metal, 0, 0.30, 0);
  add(new THREE.BoxGeometry(L * 0.94, 0.06, W * 0.86), metal, 0, 0.375, 0);
  for (let i = 0; i < 6; i++) add(new THREE.CylinderGeometry(0.012, 0.012, 0.05, 8), glow, bores[i], 0.415, 0);
  for (let i = 0; i < 6; i++) add(new THREE.CylinderGeometry(0.016, 0.016, 0.1, 10), metal, bores[i], 0.30, 0.18, Math.PI / 2);
  add(new THREE.BoxGeometry(L * 0.9, 0.06, 0.05), metal, 0, 0.30, 0.25);
  add(new THREE.TorusGeometry(0.078, 0.03, 10, 20), alu, -L / 2 - 0.1, 0.16, 0.02, Math.PI / 2);
  const tw = add(new THREE.CylinderGeometry(0.046, 0.046, 0.02, 14), alu, -L / 2 - 0.1, 0.16, 0.02, Math.PI / 2);
  add(new THREE.BoxGeometry(0.1, 0.05, 0.05), darkm, -L / 2 - 0.17, 0.1, 0.02);
  const pul = add(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 18), metal, L / 2 + 0.03, 0.02, 0, 0, Math.PI / 2);
  add(new THREE.TorusGeometry(0.036, 0.006, 6, 16), glow, L / 2 + 0.045, 0.02, 0, 0, Math.PI / 2);
  const l1 = new THREE.PointLight(0xbfe8ff, 11, 3.4, 2); l1.position.set(0.05, 0.55, 0.45); G.add(l1);
  const l2 = new THREE.PointLight(0x35d6ff, 6, 2.6, 2); l2.position.set(-0.35, 0.1, -0.35); G.add(l2);
  const l3 = new THREE.PointLight(0xff7ad0, 3.5, 2.2, 2); l3.position.set(0.4, -0.05, 0.3); G.add(l3);

  // ---- 细节件：涡轮 / 排气歧管 / 进气箱 / 机油盖 / 机油尺 / 皮带 / 冷却液壶 ----
  const chrome = new THREE.MeshStandardMaterial({ color: 0xc3ccd8, roughness: 0.16, metalness: 1 });
  // 涡轮增压器（缸体左侧后方）+ 蜗壳 + 废气旁通
  add(new THREE.TorusGeometry(0.085, 0.030, 10, 20), alu, L * 0.28, -0.03, -W / 2 - 0.10, 0, Math.PI / 2);
  add(new THREE.CylinderGeometry(0.058, 0.058, 0.11, 16), chrome, L * 0.28, -0.03, -W / 2 - 0.19, 0, Math.PI / 2);
  add(new THREE.CylinderGeometry(0.026, 0.026, 0.30, 12), chrome, L * 0.28, 0.10, -W / 2 - 0.22, 0, 0.5);
  add(new THREE.CylinderGeometry(0.020, 0.020, 0.22, 10), darkm, L * 0.10, 0.16, -W / 2 - 0.16, 0, 1.1);
  // 排气歧管：六根等长管汇到一根总管
  for (let i = 0; i < 6; i++) {
    add(new THREE.CylinderGeometry(0.014, 0.014, 0.16, 8), chrome, bores[i], -H / 2 - 0.02, -W / 2 - 0.04, Math.PI / 2, 0);
  }
  add(new THREE.CylinderGeometry(0.026, 0.026, 0.60, 12), chrome, 0, -H / 2 - 0.10, -W / 2 - 0.07, 0, Math.PI / 2);
  // 进气箱 + 节气门
  add(new THREE.BoxGeometry(0.30, 0.11, 0.16), darkm, -L * 0.30, 0.30, W / 2 + 0.10);
  add(new THREE.CylinderGeometry(0.032, 0.032, 0.09, 12), alu, -L * 0.30 + 0.14, 0.30, W / 2 + 0.04, 0, Math.PI / 2);
  // 机油加注口盖 / 机油尺
  add(new THREE.CylinderGeometry(0.030, 0.030, 0.024, 14), chrome, -L * 0.34, 0.425, 0.06);
  add(new THREE.BoxGeometry(0.012, 0.10, 0.012), glow, L * 0.16, 0.42, -0.07);
  // 前端皮带 + 张紧轮
  const belt = add(new THREE.TorusGeometry(0.062, 0.008, 6, 22), darkm, L / 2 + 0.03, 0.02, 0, 0, Math.PI / 2);
  belt.scale.set(1, 1.5, 1);
  add(new THREE.CylinderGeometry(0.024, 0.024, 0.022, 12), alu, L / 2 + 0.03, -0.055, 0.045, 0, Math.PI / 2);
  // 冷却液壶（半透明白）
  add(new THREE.BoxGeometry(0.16, 0.13, 0.10), new THREE.MeshStandardMaterial({
    color: 0xdfe9f2, roughness: 0.35, metalness: 0.1, transparent: true, opacity: 0.55,
  }), -L * 0.52, 0.06, W / 2 + 0.12);

  G.position.set(-1.42, 0.40, 0);
  engineRig = { G, pistons, rods, tw, pul, ph: 0, spd: 1 };
  carRoot.add(G);
  addPart('发动机 B58', G, '直列六缸 · 剖视', new THREE.Vector3(-0.92, 0.38, 0).normalize(), 1.6);
}

// 底盘：承载式车身地板 + 纵梁 + 前后副车架 + 传动轴 + 后差 + 排气 + 油箱
function buildChassis() {
  const G = new THREE.Group();
  G.name = 'chassis';
  const steel = new THREE.MeshStandardMaterial({ color: 0x4a525c, roughness: 0.45, metalness: 0.88 });
  const rail = new THREE.MeshStandardMaterial({ color: 0x333b45, roughness: 0.5, metalness: 0.8 });
  const plate = new THREE.MeshStandardMaterial({ color: 0x23282f, roughness: 0.72, metalness: 0.35 });
  const pipe = new THREE.MeshStandardMaterial({ color: 0x8d93a0, roughness: 0.28, metalness: 1 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x15171b, roughness: 0.9, metalness: 0.1 });
  const glow = new THREE.MeshBasicMaterial({ color: 0x35d6ff });
  const add = (geo, mat, x, y, z, ry, rz) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    if (ry) m.rotation.y = ry;
    if (rz) m.rotation.z = rz;
    G.add(m); return m;
  };
  // 地板
  add(new THREE.BoxGeometry(2.60, 0.035, 1.42), plate, 0, 0.205, 0);
  // 两根纵梁
  for (const z of [0.56, -0.56]) add(new THREE.BoxGeometry(3.90, 0.11, 0.10), rail, -0.05, 0.185, z);
  // 横梁
  for (const x of [-1.42, -0.55, 0.30, 1.10, 1.72]) add(new THREE.BoxGeometry(0.075, 0.085, 1.16), rail, x, 0.185, 0);
  // 前后副车架
  add(new THREE.BoxGeometry(0.62, 0.13, 0.98), steel, -1.62, 0.165, 0);
  add(new THREE.BoxGeometry(0.52, 0.13, 0.86), steel, 1.74, 0.165, 0);
  // 传动轴（后驱）+ 十字节
  add(new THREE.CylinderGeometry(0.043, 0.043, 1.46, 14), pipe, 0.22, 0.205, 0, 0, Math.PI / 2);
  for (const x of [-0.52, 0.95]) add(new THREE.CylinderGeometry(0.062, 0.062, 0.05, 12), steel, x, 0.205, 0, 0, Math.PI / 2);
  // 后差速器 + 半轴
  add(new THREE.SphereGeometry(0.13, 16, 12), steel, 1.66, 0.215, 0);
  for (const z of [0.34, -0.34]) add(new THREE.CylinderGeometry(0.033, 0.033, 0.30, 12), pipe, 1.66, 0.215, z, 0, 0);
  for (const z of [0.62, -0.62]) add(new THREE.CylinderGeometry(0.028, 0.028, 0.32, 10), pipe, 1.66, 0.215, z, 0, 0);
  // 排气：前段 → 中段 → 消音器 → 双尾喉
  add(new THREE.CylinderGeometry(0.040, 0.040, 1.72, 12), pipe, -0.90, 0.135, -0.30, 0, Math.PI / 2);
  add(new THREE.CylinderGeometry(0.044, 0.044, 1.30, 12), pipe, 0.62, 0.128, -0.34, 0, Math.PI / 2);
  add(new THREE.BoxGeometry(0.62, 0.17, 0.34), steel, 1.48, 0.135, -0.36);
  for (const z of [-0.24, -0.48]) add(new THREE.CylinderGeometry(0.048, 0.052, 0.16, 12), pipe, 1.86, 0.135, z, 0, Math.PI / 2);
  // 油箱
  add(new THREE.BoxGeometry(0.58, 0.20, 0.86), plate, 1.16, 0.175, 0.02);
  // 悬挂下摆臂（前后各一对）
  for (const x of [-1.62, 1.70]) {
    for (const z of [0.58, -0.58]) add(new THREE.BoxGeometry(0.30, 0.055, 0.11), steel, x, 0.185, z * 0.72, 0, 0);
  }
  // 稳定杆
  add(new THREE.CylinderGeometry(0.018, 0.018, 1.20, 10), pipe, -1.50, 0.245, 0, 0, 0);
  // 几处发光点，和 B58 的青色呼应
  for (const x of [-1.62, 1.70]) add(new THREE.CylinderGeometry(0.020, 0.020, 0.02, 10), glow, x, 0.30, 0.40, 0, Math.PI / 2);
  const gl = new THREE.PointLight(0x35d6ff, 2.6, 2.6, 2); gl.position.set(0.2, 0.30, 0); G.add(gl);

  carRoot.add(G);
  addPart('底盘', G, '承载式 · 纵梁/副车架/传动轴', new THREE.Vector3(0, -1, 0), 0.95);
}

/* 内饰：从 Sketchfab 的 MK5 A90 里只取内饰件（Leather/Alcantara/Carpet/Monitor/Screen），
   该模型长轴在 Z、车头朝 +Z，需要绕 Y 转 −90° 并对齐到本车坐标系。 */
let interiorRig = null;
let interiorLoading = false;
function loadInterior() {
  if (interiorRig || interiorLoading) return;
  interiorLoading = true;
  new GLTFLoader().load('./model/interior_slim/scene.gltf', (g) => {
    const src = g.scene;
    const G = new THREE.Group();
    G.name = 'interior';
    src.updateMatrixWorld(true);
    let kept = 0;
    src.traverse((o) => {
      if (!o.isMesh) return;
      const arr = Array.isArray(o.material) ? o.material : [o.material];
      const names = arr.map((m) => (m && m.name) || '');
      let ok = names.some((n) => /Leather|Alcantara|Carpet|Monitor|Screen/i.test(n));
      if (!ok && names.every((n) => /BlackGloss/i.test(n))) {
        const bb = new THREE.Box3().setFromObject(o);
        const s = bb.getSize(new THREE.Vector3());
        const c = bb.getCenter(new THREE.Vector3());
        ok = Math.max(s.x, s.y, s.z) < 0.62 && c.y > 0.25 && c.y < 1.2 && Math.abs(c.z) < 1.15;
      }
      if (ok) { kept++; } else o.visible = false;
    });
    G.add(src);
    G.rotation.y = -Math.PI / 2;
    G.scale.setScalar(0.88);
    G.position.set(0.28, 0, 0);
    G.visible = true;
    carRoot.add(G);
    interiorRig = { G };
    // 内饰材质压暗：皮革/织物本来就该是深色，不然品红轮廓灯一打就发粉
    G.traverse((o) => {
      if (!o.isMesh) return;
      const arr = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of arr) {
        if (!m) continue;
        if (m.color) m.color.multiplyScalar(0.42);
        if ('envMapIntensity' in m) m.envMapIntensity = 0.42;
        if ('roughness' in m) m.roughness = Math.min(1, (m.roughness ?? 0.7) + 0.2);
        m.needsUpdate = true;
      }
    });
    addPart('内饰', G, '座椅 / 仪表台 / 门板 / 地毯', new THREE.Vector3(0.35, 1, 0).normalize(), 1.15);
    rebuildPartList();
    console.log('[interior] kept', kept, 'meshes');
  }, undefined, (e) => console.warn('[interior] load failed:', e && e.message));
}

function updateEngine(dt) {
  if (!engineRig) return;
  const r = engineRig;
  if (interior) interior.visible = state.seat;
  const iso = state.isolated === '发动机 B58';
  const want = iso ? 1.85 : 0.88;
  r.G.scale.setScalar(lerp(r.G.scale.x, want, Math.min(1, dt * 4)));
  r.spd = lerp(r.spd, (iso || revOn) ? 5.2 : 1, Math.min(1, dt * 2.4));
  r.ph += dt * r.spd * 7.2;
  const amp = 0.038;
  for (let i = 0; i < 6; i++) {
    const a = r.ph + i * (Math.PI * 2 / 6) * 2;
    const y = 0.02 + amp * Math.sin(a);
    r.pistons[i].position.y = y;
    r.rods[i].position.y = y - 0.075;
    r.rods[i].rotation.z = Math.cos(a) * 0.12;
  }
  r.tw.rotation.y += dt * r.spd * 9;
  r.pul.rotation.y += dt * r.spd * 3;
}

/* ============================================================
   9 声浪（WebAudio 合成）
   ============================================================ */
let revOn = false;
const Engine = (() => {
  let ctx = null, master = null, lp = null, o1 = null, o2 = null, o3 = null, noiseG = null, timer = null;
  let rpm = 0, target = 0, live = false, revMode = false, revPh = 0;

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.0001;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 400; lp.Q.value = 3.5;
    lp.connect(master);
    o1 = ctx.createOscillator(); o1.type = 'sawtooth';
    o2 = ctx.createOscillator(); o2.type = 'square';
    o3 = ctx.createOscillator(); o3.type = 'sine';
    for (const o of [o1, o2, o3]) { const g = ctx.createGain(); g.gain.value = 0.2; o.connect(g).connect(lp); o.start(); }
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const ns = ctx.createBufferSource(); ns.buffer = buf; ns.loop = true;
    noiseG = ctx.createGain(); noiseG.gain.value = 0.02;
    ns.connect(noiseG).connect(lp); ns.start();
  }
  function apply() {
    if (!ctx) return;
    const fire = Math.max(6, rpm / 60 * 3);
    const n = ctx.currentTime, k = 0.05;
    o1.frequency.setTargetAtTime(fire * 2, n, k);
    o2.frequency.setTargetAtTime(fire, n, k);
    o3.frequency.setTargetAtTime(fire * 0.5, n, k);
    lp.frequency.setTargetAtTime(320 + rpm * 1.6, n, k);
    lp.Q.setTargetAtTime(2.4 + Math.min(1, rpm / 5000) * 3.4, n, 0.1);
    noiseG.gain.setTargetAtTime(0.02 + Math.min(1, rpm / 5000) * 0.12, n, 0.1);
  }
  function pop() {
    if (!ctx) return;
    const n = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'triangle';
    const g = ctx.createGain();
    o.frequency.value = 62 + Math.random() * 70;
    g.gain.setValueAtTime(0.3, n);
    g.gain.exponentialRampToValueAtTime(0.001, n + 0.1);
    o.connect(g).connect(master);
    o.start(n); o.stop(n + 0.11);
  }
  function tick() {
    if (!live) return;
    if (revMode) {
      revPh += 0.038;
      target = 880 + Math.pow((Math.sin(revPh) + 1) / 2, 1.6) * 4300;
    }
    const prev = rpm;
    rpm += (target - rpm) * (revMode ? 0.16 : 0.1);
    if (prev - rpm > 26 && Math.random() < 0.3) pop();
    apply();
  }
  function crank() {
    const n = ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const o = ctx.createOscillator(); o.type = 'square';
      const g = ctx.createGain();
      o.frequency.value = 128 + i * 9;
      g.gain.setValueAtTime(0, n + i * 0.13);
      g.gain.linearRampToValueAtTime(0.13, n + i * 0.13 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, n + i * 0.13 + 0.11);
      o.connect(g).connect(master);
      o.start(n + i * 0.13); o.stop(n + i * 0.13 + 0.14);
    }
  }
  return {
    start() {
      if (!ctx) build();
      if (ctx.state === 'suspended') ctx.resume();
      live = true; rpm = 0; target = 900;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.2);
      crank();
      setTimeout(() => { target = 2400; }, 700);
      setTimeout(() => { if (!revMode) target = 880; }, 1600);
      if (!timer) timer = setInterval(tick, 40);
      apply();
    },
    stop() {
      live = false; revMode = false;
      if (!ctx) return;
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.12);
      target = 0;
    },
    setRev(on) {
      revMode = on;
      if (on && !live) this.start();
      if (!on && live) target = 880;
    },
    isLive: () => live,
    getRpm: () => rpm,
  };
})();

/* ============================================================
   10 HUD 绑定
   ============================================================ */
let toastTimer = 0;
function toast(t) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = t; el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2200);
}
$('#btnWind').onclick = () => {
  state.wind = !state.wind;
  wind.visible = state.wind;
  $('#btnWind').classList.toggle('on', state.wind);
  toast(state.wind ? '风洞开启' : '风洞关闭');
};
$('#btnHeat').onclick = () => {
  state.heat = !state.heat;
  $('#btnHeat').classList.toggle('on', state.heat);
  toast(state.heat ? '流速热力着色' : '回到白色风线');
};
/* 风速滑杆：0 = 静止，45 m/s = 飓风级 */
const wSpeed = $('#wspeed'), wSpeedV = $('#wsv');
function applySpeed(v) {
  state.speed = v;
  if (wSpeedV) wSpeedV.textContent = v;
  if (wSpeed && +wSpeed.value !== v) wSpeed.value = v;
  if (v === 0) toast('风速 0 m/s · 流场静止');
}
if (wSpeed) {
  wSpeed.oninput = () => {
    applySpeed(+wSpeed.value);
    if (+wSpeed.value === 0) wSpeed.onchange = null;
  };
  wSpeed.onchange = () => toast('风速 ' + state.speed + ' m/s');
  applySpeed(+wSpeed.value);
}
$('#btnAxes').onclick = () => {
  state.axes = !state.axes;
  $('#btnAxes').classList.toggle('on', state.axes);
  if (!window.__axes) {
    window.__axes = new THREE.AxesHelper(2.4);
    window.__axes.position.y = 0.01;
    scene.add(window.__axes);
  }
  window.__axes.visible = state.axes;
};
$('#btnTurn').onclick = () => {
  carRoot.rotation.y += Math.PI / 2;
  updateBodyBox();
  toast('车头朝向 +90°');
};
document.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => setMode(b.dataset.mode); });
document.querySelectorAll('[data-view]').forEach((b) => { b.onclick = () => setView(b.dataset.view); });

let lampOn = false, lampPhase = 0;
const beamL = new THREE.SpotLight(0xd8f0ff, 0, 22, 0.42, 0.5, 1.6);
const beamR = new THREE.SpotLight(0xd8f0ff, 0, 22, 0.42, 0.5, 1.6);
beamL.position.set(-2.0, 0.62, 0.62); beamR.position.set(-2.0, 0.62, -0.62);
beamL.target.position.set(-8, 0.2, 0.9); beamR.target.position.set(-8, 0.2, -0.9);
scene.add(beamL, beamL.target, beamR, beamR.target);

/* 车身上的灯组：大灯（冷白 LED）+ 尾灯（红色贯穿灯带）。
   Supra A90 的尾灯是一整条贯穿式灯带，所以除了两侧灯组还补了一条横条。 */
const headMats = [], tailMats = [];
const lampGroup = new THREE.Group();
carShell.add(lampGroup);
function lampPlane(w, h, color, x, y, z, ry) {
  const m = new THREE.MeshBasicMaterial({
    color, transparent: true, opacity: 0, toneMapped: false, depthWrite: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
  p.position.set(x, y, z);
  p.rotation.y = ry;
  p.renderOrder = 3;
  lampGroup.add(p);
  return m;
}
/* 用射线打到车壳表面，灯组才能贴在车身上而不是飘在半空 */
function buildLamps(bodyObj) {
  if (!bodyObj) return;
  const ray = new THREE.Raycaster();
  const hit = (y, z, front) => {
    ray.set(new THREE.Vector3(front ? -6 : 6, y, z), new THREE.Vector3(front ? 1 : -1, 0, 0));
    const hs = ray.intersectObject(bodyObj, true);
    return hs.length ? hs[0].point.x : null;
  };
  // 车头朝 −X
  for (const z of [0.62, -0.62]) {
    let x = hit(0.665, z, true);
    if (x !== null) headMats.push(lampPlane(0.26, 0.100, 0xe8f8ff, x - 0.012, 0.665, z, -Math.PI / 2));
    x = hit(0.590, z, true);
    if (x !== null) headMats.push(lampPlane(0.22, 0.034, 0x8fe6ff, x - 0.012, 0.590, z, -Math.PI / 2));
  }
  // 车尾朝 +X：贯穿灯带 + 两侧灯组
  let xt = hit(0.930, 0, false);
  if (xt !== null) tailMats.push(lampPlane(1.16, 0.048, 0xff2a2a, xt + 0.012, 0.930, 0, Math.PI / 2));
  for (const z of [0.58, -0.58]) {
    const x = hit(0.855, z, false);
    if (x !== null) tailMats.push(lampPlane(0.31, 0.120, 0xff1a12, x + 0.012, 0.855, z, Math.PI / 2));
    const x2 = hit(0.762, z, false);
    if (x2 !== null) tailMats.push(lampPlane(0.10, 0.052, 0xff5a4a, x2 + 0.012, 0.762, z, Math.PI / 2));
  }
}
const lampHalo = [new THREE.PointLight(0xcfeaff, 0, 7, 2), new THREE.PointLight(0xcf6a5a, 0, 6, 2)];
lampHalo[0].position.set(-2.35, 0.75, 0);
lampHalo[1].position.set(2.35, 0.90, 0);
lampGroup.add(lampHalo[0], lampHalo[1]);
carShell.add(lampGroup);

$('#btnLamp').onclick = () => {
  lampOn = !lampOn; lampPhase = 0;
  $('#btnLamp').classList.toggle('on', lampOn);
  toast(lampOn ? '开灯：示廓灯 → 大灯点亮' : '关灯');
};

let engineOn = false;
$('#btnEngine').onclick = () => {
  engineOn = !engineOn;
  $('#btnEngine').classList.toggle('on', engineOn);
  if (engineOn) { Engine.start(); toast('点火：起动机 → 怠速 900 rpm'); }
  else {
    Engine.stop(); revOn = false;
    $('#btnRev')?.classList.remove('on');
    toast('熄火');
  }
};
$('#btnRev').onclick = () => {
  revOn = !revOn;
  $('#btnRev').classList.toggle('on', revOn);
  if (revOn) {
    if (!engineOn) { engineOn = true; $('#btnEngine').classList.add('on'); }
    Engine.setRev(true);
    toast('声浪：怠速 → 高转 → 回落（收油带回火）');
  } else {
    Engine.setRev(false);
    toast('声浪停 · 回到怠速');
  }
};

/* 车内视角：左右拖动 = 转头 */
let seatDragX = null;
canvas.addEventListener('pointerdown', (e) => { if (state.seat) { seatDragX = e.clientX; } });
canvas.addEventListener('pointermove', (e) => {
  if (!state.seat || seatDragX === null) return;
  state.seatYaw = clamp(state.seatYaw - (e.clientX - seatDragX) * 0.006, -Math.PI, Math.PI);
  seatDragX = e.clientX;
});
addEventListener('pointerup', () => { seatDragX = null; });

/* ============================================================
   11 主循环
   ============================================================ */
const clock = new THREE.Clock();
let t = 0, fpsAcc = 0, fpsN = 0, fpsShow = 0;

let flowT = 0;
function updateFlow(dt) {
  const f = (state.speed ?? 18) / 18;                 // 风速倍数：0 = 完全静止
  flowT += dt * f;
  const glowF = 0.30 + 0.70 * Math.min(1, (state.speed ?? 18) / 30);
  const span = TUN.xIn - TUN.xOut;
  const step = span / (NP - 1);
  const shift = (flowT * 7.0) % step;
  for (const { L, g } of laneLines) {
    const pos = g.attributes.position.array;
    const col = g.attributes.color.array;
    for (let j = 0; j < NP; j++) {
      const raw = j * step + shift + L.ph * span;
      const x = TUN.xIn - (raw % span);
      const y = L.y + liftAt(x, L.z) + Math.sin(x * 1.5 + flowT * 3.2 + L.ph * 9.4) * 0.025;
      pos[j * 3] = x; pos[j * 3 + 1] = y; pos[j * 3 + 2] = L.z;
      const sp = speedAt(x, L.z);
      // 行进光带：亮斑沿 −X 方向流动，波长约 7 个单位
      // 两端淡出，别让线条在画面里硬生生截断
      const edge = clamp((5.0 - Math.abs(x)) / 1.8, 0, 1);
      const pulse = edge * (0.24 + 0.76 * Math.pow(0.5 + 0.5 * Math.cos(x * 0.85 + flowT * 6.5 + L.ph * 6.283), 2.0)) * glowF;
      const c = state.heat ? heatAt(sp) : [0.92, 0.97, 1.0];
      col[j * 3] = c[0] * pulse;
      col[j * 3 + 1] = c[1] * pulse;
      col[j * 3 + 2] = c[2] * pulse;
    }
    g.attributes.position.needsUpdate = true;
    g.attributes.color.needsUpdate = true;
  }
}

function updateStat() {
  const stat = $('#stat');
  if (!stat) return;
  const tri = renderer.info.render.triangles;
  stat.innerHTML = `<b>${fpsShow}</b> fps · <b>${(tri / 1000).toFixed(1)}k</b> 三角面 · <b>${parts.length}</b> 零件` +
    (Engine.isLive() ? ` · <b>${Math.round(Engine.getRpm())}</b> rpm` : '') +
    (state.source === 'model' ? '<br>模型：scene.gltf（真实车模）' : '<br>模型：加载中…');
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, clock.getDelta());
  t += dt;

  if (!state.seat) {
    controls.autoRotate = state.mode === 'show' && !state.isolated && performance.now() > state.idleAt;
    controls.update();
  } else {
    camera.position.copy(SEAT_POS);
    const d = new THREE.Vector3(-Math.cos(state.seatYaw), -0.085, Math.sin(state.seatYaw));
    camera.lookAt(SEAT_POS.x + d.x, SEAT_POS.y + d.y, SEAT_POS.z + d.z);
  }

  if (camTween) {
    camTween.t = Math.min(1, camTween.t + dt * 1.7);
    const e = 1 - Math.pow(1 - camTween.t, 3);
    camera.position.lerpVectors(camTween.from, camTween.to, e);
    controls.target.lerpVectors(camTween.ft, camTween.tt, e);
    camera.fov = lerp(camTween.fov0, camTween.fov1, e);
    camera.updateProjectionMatrix();
    if (camTween.t >= 1) camTween = null;
  }

  if (state.wind) updateFlow(dt);
  updateExplode(dt);
  updateEngine(dt);

  if (lampOn) {
    lampPhase = Math.min(1, lampPhase + dt * 1.9);
    const fl = lampPhase < 1 ? 0.25 + 0.75 * Math.abs(Math.sin(lampPhase * 10.5)) : 1;
    const li = fl * (0.35 + 0.65 * lampPhase);
    beamL.intensity = beamR.intensity = 32 * li;
    for (const m of headMats) m.opacity = li;
    for (const m of tailMats) m.opacity = li * 0.92;
    lampHalo[0].intensity = 9 * li;
    lampHalo[1].intensity = 6 * li;
  } else {
    beamL.intensity = beamR.intensity = 0;
    for (const m of headMats) m.opacity = 0;
    for (const m of tailMats) m.opacity = 0;
    lampHalo[0].intensity = lampHalo[1].intensity = 0;
  }

  renderer.render(scene, camera);

  // 小窗
  if (miniCar) {
    miniCar.rotation.y += dt * 0.5;
    miniCam.position.set(4.2, 2.0, 5.2);
    miniCam.lookAt(0, 0.55, 0);
    miniRenderer.render(miniScene, miniCam);
  }

  fpsAcc += dt; fpsN++;
  if (fpsAcc > 0.5) { fpsShow = Math.round(fpsN / fpsAcc); fpsAcc = 0; fpsN = 0; updateStat(); }
}
animate();

addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});

/* 起手：先看一眼 45° */
setView('iso');
loadModel(0);