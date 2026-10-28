import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ══════════════════════════════════════════════════════════
   B58 直列六缸 · 可拆解交互页
   真机参数：排量 2998cc / 缸径 82.0mm / 行程 94.6mm / 压缩比 11.0:1
            250kW@6000rpm / 500N·m@1600-4500rpm / 红线 7000rpm
   几何按真实尺寸建（单位：米），仅作可视化，不做仿真
   ══════════════════════════════════════════════════════════ */

const BORE = 0.082, STROKE = 0.0946, SPACING = 0.091, THROW = STROKE / 2;
const N = 6;                     // 缸数
const FIRE = [0, 2, 1, 3, 5, 4]; // 点火顺序 1-5-3-6-2-4（0 基）
const X0 = -(N - 1) * SPACING / 2;

/* ───────────── 基础环境 ───────────── */
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070d);
scene.fog = new THREE.Fog(0x05070d, 2.2, 6.0);

const camera = new THREE.PerspectiveCamera(36, 1, 0.02, 40);
const HOME = new THREE.Vector3(1.14, 0.72, 1.26);
const TARGET = new THREE.Vector3(0, 0.10, 0);
camera.position.copy(HOME);

const controls = new OrbitControls(camera, canvas);
controls.target.copy(TARGET);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.minDistance = 0.45;
controls.maxDistance = 3.2;
controls.minPolarAngle = 0.08;
controls.maxPolarAngle = Math.PI - 0.08;
controls.enablePan = false;

/* 灯光 */
scene.add(new THREE.HemisphereLight(0xa8d8ff, 0x0b1018, 0.78));
const key = new THREE.DirectionalLight(0xffffff, 3.9); key.position.set(1.4, 2.0, 1.6);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.left = -1; key.shadow.camera.right = 1;
key.shadow.camera.top = 1; key.shadow.camera.bottom = -1;
key.shadow.camera.near = 0.5; key.shadow.camera.far = 6;
key.shadow.bias = -0.0015;
scene.add(key);
const fill = new THREE.DirectionalLight(0x5fb8ff, 0.85); fill.position.set(-1.8, 0.9, -1.2); scene.add(fill);
const pCy = new THREE.PointLight(0x00e5ff, 2.4, 2.2, 2); pCy.position.set(-0.72, 0.42, 0.55); scene.add(pCy);
const pVi = new THREE.PointLight(0xa06bff, 2.2, 2.0, 2); pVi.position.set(0.78, 0.30, -0.60); scene.add(pVi);
const pAm = new THREE.PointLight(0xffa14a, 2.2, 1.8, 2); pAm.position.set(0.0, -0.35, 0.42); scene.add(pAm);
const fill2 = new THREE.DirectionalLight(0xbfd8ff, 1.25); fill2.position.set(0.6, -0.8, 1.4); scene.add(fill2);

/* 地面：暗色金属 + 网格 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(14, 14),
  new THREE.MeshStandardMaterial({ color: 0x080b12, metalness: 0.86, roughness: 0.34 })
);
floor.rotation.x = -Math.PI / 2; floor.position.y = -0.30; floor.receiveShadow = true;
scene.add(floor);
const grid = new THREE.GridHelper(6, 60, 0x0e6d7d, 0x0a2a34);
grid.position.y = -0.299;
grid.material.transparent = true; grid.material.opacity = 0.55;
scene.add(grid);

/* 粒子 */
const pcount = 520;
const pgeo = new THREE.BufferGeometry();
const ppos = new Float32Array(pcount * 3);
for (let i = 0; i < pcount; i++) {
  ppos[i * 3] = (Math.random() - 0.5) * 3.4;
  ppos[i * 3 + 1] = Math.random() * 1.5 - 0.3;
  ppos[i * 3 + 2] = (Math.random() - 0.5) * 3.4;
}
pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
const particles = new THREE.Points(pgeo, new THREE.PointsMaterial({
  color: 0x63d8ff, size: 0.006, transparent: true, opacity: 0.55,
  depthWrite: false, blending: THREE.AdditiveBlending
}));
scene.add(particles);

/* ───────────── 材质 ───────────── */
const M = {
  alu: new THREE.MeshStandardMaterial({ color: 0xb6c2cb, metalness: 0.92, roughness: 0.33 }),
  aluDark: new THREE.MeshStandardMaterial({ color: 0x7c8a95, metalness: 0.88, roughness: 0.42 }),
  cast: new THREE.MeshStandardMaterial({ color: 0x66737e, metalness: 0.72, roughness: 0.55 }),
  block: new THREE.MeshStandardMaterial({ color: 0x8f9aa4, metalness: 0.85, roughness: 0.44 }),
  steel: new THREE.MeshStandardMaterial({ color: 0xd2dae1, metalness: 0.96, roughness: 0.22 }),
  piston: new THREE.MeshStandardMaterial({ color: 0xe3e9ee, metalness: 0.94, roughness: 0.18 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x2b333b, metalness: 0.6, roughness: 0.62 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x14181d, metalness: 0.25, roughness: 0.86 }),
  copper: new THREE.MeshStandardMaterial({ color: 0xb9764a, metalness: 0.9, roughness: 0.38 }),
  hot: new THREE.MeshStandardMaterial({ color: 0x6a5148, metalness: 0.7, roughness: 0.7 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x9fd9ff, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.25 }),
};

/* ───────────── 小工具 ───────────── */
function box(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
  return m;
}
function cyl(r, h, mat, axis = 'y', x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 22), mat);
  if (axis === 'x') m.rotation.z = Math.PI / 2;
  if (axis === 'z') m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
  return m;
}
function ring(r, tube, mat, axis = 'x', x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 10, 34), mat);
  if (axis === 'x') m.rotation.y = Math.PI / 2;
  if (axis === 'z') { /* 默认在 xy 平面 */ }
  m.position.set(x, y, z); m.castShadow = true;
  return m;
}
/* 两点之间的一根管：用四元数把 Y 轴圆柱转到目标方向，最稳 */
function tube(p1, p2, r, mat, segs = 18) {
  const a = new THREE.Vector3(...p1), b = new THREE.Vector3(...p2);
  const d = new THREE.Vector3().subVectors(b, a);
  const len = d.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, segs), mat);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

/* ───────────── 部件构建 ───────────── */
const parts = [];   // {name, en, obj, dir, dist, fn, specs, anchor}
const engine = new THREE.Group();
scene.add(engine);

function addPart(o) { o.pull = 0; parts.push(o); engine.add(o.obj); return o; }

/* 1. 缸体（含主轴承座、缸套） */
function buildBlock() {
  const G = new THREE.Group();
  G.add(box(N * SPACING + 0.075, 0.235, 0.195, M.block, 0, 0.085, 0));
  // 上下平面加肩部，避免一块方砖
  G.add(box(N * SPACING + 0.10, 0.030, 0.222, M.aluDark, 0, 0.205, 0));
  G.add(box(N * SPACING + 0.10, 0.026, 0.212, M.aluDark, 0, -0.030, 0));
  // 六个缸筒
  for (let i = 0; i < N; i++) {
    const x = X0 + i * SPACING;
    const bore = cyl(BORE / 2, 0.225, M.dark, 'y', x, 0.098, 0);
    G.add(bore);
    G.add(ring(BORE / 2 + 0.003, 0.004, M.alu, 'y', x, 0.204, 0));
  }
  // 主轴承座（7 道）
  for (let i = 0; i <= N; i++) {
    const x = X0 + (i - 0.5) * SPACING;
    G.add(box(0.016, 0.058, 0.196, M.aluDark, x, -0.012, 0));
  }
  // 缸体加强筋
  for (let i = 0; i < 7; i++) {
    const x = X0 + (i - 0.5) * SPACING - SPACING / 2 + 0.02;
    G.add(box(0.006, 0.15, 0.012, M.cast, x, 0.085, 0.099));
  }
  // 侧面水道塞
  for (let i = 0; i < 5; i++) G.add(cyl(0.011, 0.012, M.alu, 'z', X0 + i * SPACING + 0.02, 0.115, 0.102));
  return G;
}

/* 2. 缸盖 + 凸轮罩 */
function buildHead() {
  const G = new THREE.Group();
  G.add(box(N * SPACING + 0.085, 0.072, 0.188, M.alu, 0, 0.256, 0));
  G.add(box(N * SPACING + 0.095, 0.016, 0.205, M.aluDark, 0, 0.292, 0));
  // 凸轮罩（黑色塑料盖）
  G.add(box(N * SPACING + 0.055, 0.052, 0.165, M.dark, 0, 0.318, 0));
  for (let i = 0; i < 4; i++) G.add(cyl(0.012, 0.010, M.aluDark, 'y', X0 + i * SPACING * 1.6 - 0.10, 0.345, 0));
  return G;
}

/* 3. 双凸轮轴 */
function buildCams() {
  const G = new THREE.Group();
  for (const z of [0.052, -0.052]) {
    G.add(cyl(0.014, N * SPACING + 0.06, M.steel, 'x', 0, 0.272, z));
    for (let i = 0; i < N; i++) {
      const x = X0 + i * SPACING;
      for (let k = 0; k < 2; k++) {
        const lobe = cyl(0.019, 0.012, M.steel, 'x', x - 0.016 + k * 0.032, 0.272, z);
        lobe.rotation.x = 0; lobe.rotation.z = Math.PI / 2;
        lobe.position.y = 0.272 + 0.006;
        lobe.scale.set(1, 1, 1.45);
        G.add(lobe);
      }
      G.add(cyl(0.0175, 0.010, M.aluDark, 'x', x + 0.03, 0.272, z)); // 轴颈
    }
  }
  return G;
}

/* 4. 气门组（每缸 4 气门） */
function buildValves() {
  const G = new THREE.Group();
  for (let i = 0; i < N; i++) {
    const x = X0 + i * SPACING;
    for (const [dz, tilt] of [[0.030, 0.16], [0.014, 0.10], [-0.014, -0.10], [-0.030, -0.16]]) {
      const v = new THREE.Group();
      const stem = cyl(0.0032, 0.062, M.steel, 'y', 0, 0.0, 0);
      const disc = cyl(0.0125, 0.004, M.hot, 'y', 0, -0.032, 0);
      const spr = new THREE.Mesh(new THREE.TorusGeometry(0.0085, 0.0016, 6, 14), M.aluDark);
      spr.rotation.x = Math.PI / 2; spr.position.y = 0.010;
      v.add(stem, disc, spr);
      v.position.set(x + (dz > 0 ? 0.010 : -0.010), 0.238, dz);
      v.rotation.z = tilt;
      G.add(v);
    }
  }
  return G;
}

/* 5. 火花塞 */
function buildPlugs() {
  const G = new THREE.Group();
  for (let i = 0; i < N; i++) {
    const x = X0 + i * SPACING;
    G.add(cyl(0.0072, 0.030, M.steel, 'y', x, 0.300, 0));
    G.add(cyl(0.0045, 0.026, M.copper, 'y', x, 0.270, 0));
    G.add(cyl(0.0095, 0.008, M.dark, 'y', x, 0.313, 0));
  }
  return G;
}

/* 6. 活塞连杆组 */
function buildPistons() {
  const G = new THREE.Group();
  G.userData.pistons = [];
  for (let i = 0; i < N; i++) {
    const x = X0 + i * SPACING;
    const p = new THREE.Group();
    p.add(cyl(BORE / 2 - 0.0015, 0.040, M.piston, 'y', 0, 0, 0));
    // 活塞顶凹坑 + 环槽
    p.add(cyl(BORE / 2 - 0.004, 0.004, M.aluDark, 'y', 0, 0.021, 0));
    for (let k = 0; k < 3; k++) p.add(ring(BORE / 2 - 0.001, 0.0016, M.steel, 'y', 0, 0.008 - k * 0.008, 0));
    // 连杆
    const rod = new THREE.Group();
    rod.add(box(0.013, 0.115, 0.016, M.steel, 0, -0.075, 0));
    rod.add(cyl(0.017, 0.014, M.steel, 'z', 0, -0.135, 0));
    p.add(rod);
    p.position.set(x, 0.145, 0);
    p.userData.rod = rod;
    G.add(p);
    G.userData.pistons.push(p);
  }
  return G;
}

/* 7. 曲轴 */
function buildCrank() {
  const G = new THREE.Group();
  G.add(cyl(0.024, N * SPACING + 0.10, M.steel, 'x', 0, 0, 0));
  for (let i = 0; i < N; i++) {
    const x = X0 + i * SPACING;
    const ph = FIRE.indexOf(i) * Math.PI * 2 / 3;
    const pin = cyl(0.022, 0.036, M.steel, 'x', x, Math.cos(ph) * THROW, Math.sin(ph) * THROW);
    G.add(pin);
    // 平衡块
    const cw = box(0.030, 0.052, 0.030, M.aluDark, x, -Math.cos(ph) * THROW * 0.92, -Math.sin(ph) * THROW * 0.92);
    cw.scale.set(1, 1, 1);
    G.add(cw);
  }
  for (let i = 0; i <= N; i++) {
    const x = X0 + (i - 0.5) * SPACING;
    G.add(cyl(0.029, 0.020, M.alu, 'x', x, 0, 0));
  }
  return G;
}

/* 8. 油底壳 */
function buildPan() {
  const G = new THREE.Group();
  G.add(box(N * SPACING + 0.06, 0.030, 0.185, M.aluDark, 0, -0.055, 0));
  G.add(box(N * SPACING - 0.02, 0.085, 0.155, M.alu, 0, -0.112, 0));
  G.add(box(N * SPACING - 0.10, 0.020, 0.120, M.dark, 0, -0.158, 0));
  G.add(cyl(0.011, 0.020, M.steel, 'y', 0, -0.170, 0));   // 放油螺栓
  for (let i = 0; i < 6; i++) G.add(cyl(0.006, 0.030, M.alu, 'z', X0 + i * SPACING, -0.112, 0.079));
  return G;
}

/* 9. 进气歧管 */
function buildIntake() {
  const G = new THREE.Group();
  const zP = 0.185, yP = 0.300;
  // 稳压腔（沿曲轴方向的圆筒）
  G.add(cyl(0.043, N * SPACING + 0.02, M.alu, 'x', 0.01, yP, zP));
  // 节气门法兰（前端）
  G.add(cyl(0.046, 0.026, M.alu, 'x', X0 - SPACING / 2 - 0.055, yP, zP));
  G.add(cyl(0.038, 0.030, M.aluDark, 'x', X0 - SPACING / 2 - 0.082, yP, zP));
  for (let i = 0; i < N; i++) {
    const x = X0 + i * SPACING;
    // 六根等长气道：从缸盖进气侧斜着接到稳压腔
    G.add(tube([x, 0.252, 0.070], [x * 0.96, yP - 0.020, zP - 0.020], 0.0185, M.alu));
    // 缸盖侧的进气法兰
    G.add(box(0.052, 0.030, 0.020, M.aluDark, x, 0.250, 0.086));
  }
  return G;
}

/* 10. 排气歧管 + 涡轮 */
function buildExhaust() {
  const G = new THREE.Group();
  const zE = -0.185;
  for (let i = 0; i < N; i++) {
    const x = X0 + i * SPACING;
    // 每缸一根排气道，从缸盖排气侧向后上方汇入总管
    G.add(tube([x, 0.252, -0.072], [x * 0.88, 0.232, zE + 0.02], 0.0165, M.hot));
    G.add(box(0.050, 0.028, 0.018, M.hot, x, 0.250, -0.086));
  }
  // 集气总管 + 涡轮法兰
  G.add(cyl(0.031, N * SPACING * 0.72, M.hot, 'x', -0.01, 0.232, zE));
  G.add(cyl(0.036, 0.030, M.hot, 'x', X0 - 0.115, 0.232, zE));
  return G;
}

/* 11. 涡轮增压器 */
function buildTurbo() {
  const G = new THREE.Group();
  // 涡壳 + 压壳（两个蜗牛）
  const hotH = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.026, 12, 26), M.hot);
  hotH.position.set(0, 0, 0);
  const coldH = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.028, 12, 26), M.alu);
  coldH.position.set(0.005, 0.0, 0.105);
  G.add(hotH, coldH);
  G.add(cyl(0.020, 0.10, M.steel, 'z', 0, 0, 0.052));  // 轴
  G.add(cyl(0.036, 0.022, M.aluDark, 'z', 0.005, 0, 0.158)); // 压气机入口
  G.add(cyl(0.030, 0.030, M.hot, 'z', 0, 0, -0.048));  // 排气入口
  G.add(cyl(0.012, 0.06, M.copper, 'y', -0.03, 0.06, 0.02)); // 机油管
  G.add(cyl(0.010, 0.05, M.steel, 'y', 0.02, -0.05, 0.03));  // 回油
  G.position.set(X0 - 0.235, 0.150, -0.265);
  return G;
}

/* 12. 正时链条 + 齿轮 */
function buildTiming() {
  const G = new THREE.Group();
  const x = X0 - SPACING / 2 - 0.052;
  G.add(cyl(0.030, 0.012, M.steel, 'x', x, 0.0, 0));          // 曲轴链轮
  G.add(cyl(0.024, 0.012, M.steel, 'x', x, 0.272, 0.052));    // 进气凸轮链轮
  G.add(cyl(0.024, 0.012, M.steel, 'x', x, 0.272, -0.052));   // 排气凸轮链轮
  // 链条：用一圈小方块近似
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.030, 0),
    new THREE.Vector3(0, 0.150, 0.085),
    new THREE.Vector3(0, 0.300, 0.062),
    new THREE.Vector3(0, 0.300, -0.062),
    new THREE.Vector3(0, 0.150, -0.085),
    new THREE.Vector3(0, -0.030, 0),
  ], true);
  const seg = 46;
  for (let i = 0; i < seg; i++) {
    const p = path.getPoint(i / seg);
    const link = box(0.010, 0.010, 0.016, M.steel, x + (i % 2 ? 0.002 : -0.002), p.y, p.z);
    link.rotation.x = Math.atan2(p.z, p.y) * 0.0;
    G.add(link);
  }
  G.add(box(0.008, 0.150, 0.022, M.aluDark, x + 0.014, 0.135, 0.078)); // 导轨
  G.add(cyl(0.014, 0.026, M.aluDark, 'x', x + 0.010, -0.010, 0.070));  // 张紧器
  return G;
}

/* 13. 飞轮 */
function buildFlywheel() {
  const G = new THREE.Group();
  const x = X0 + (N - 1) * SPACING / 2 + 0.062;
  G.add(cyl(0.098, 0.012, M.steel, 'x', x, 0, 0));
  G.add(cyl(0.045, 0.020, M.aluDark, 'x', x, 0, 0));
  for (let i = 0; i < 40; i++) {
    const a = i / 40 * Math.PI * 2;
    const t = box(0.012, 0.012, 0.008, M.aluDark, x, Math.cos(a) * 0.100, Math.sin(a) * 0.100);
    t.rotation.x = -a;
    G.add(t);
  }
  // 离合器压盘螺栓
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2;
    G.add(cyl(0.005, 0.006, M.dark, 'x', x - 0.008, Math.cos(a) * 0.038, Math.sin(a) * 0.038));
  }
  return G;
}

/* ───────────── 组装 ───────────── */
const up = (v) => new THREE.Vector3(...v).normalize();
addPart({ name: '缸体', en: 'CYLINDER BLOCK', obj: buildBlock(), dir: new THREE.Vector3(0, 0, 0), dist: 0,
  anchor: [0.16, 0.02, 0.10],
  fn: '整机骨架。曲轴箱与六个气缸筒一体铸造，壁内铸有冷却水套与机油主油道，主轴承座直接与缸体相连，承担全部燃烧压力与曲轴惯性力。',
  specs: [['缸数 / 布置', '6 · 直列纵置'], ['缸径 × 行程', '82.0 × 94.6 mm'], ['缸心距', '91 mm'], ['材料', '铝合金压铸 + 缸套']] });

addPart({ name: '缸盖', en: 'CYLINDER HEAD', obj: buildHead(), dir: up([0, 1, 0]), dist: 0.30,
  anchor: [0.10, 0.30, 0.07],
  fn: '封闭燃烧室，内藏进排气道、气门座圈、火花塞孔与双凸轮轴轴承座。B58 采用整体式铝合金缸盖，集成排气歧管接口以加快暖机。',
  specs: [['气门数', '24（每缸 4）'], ['凸轮轴', '双顶置 DOHC'], ['压缩比', '11.0 : 1'], ['材料', '铝合金']] });

addPart({ name: '凸轮轴', en: 'CAMSHAFTS', obj: buildCams(), dir: up([0, 1, 0]), dist: 0.42,
  anchor: [0.05, 0.30, 0.06],
  fn: '进、排气各一根，由正时链条驱动。凸轮升程推动气门开闭，配合 Valvetronic 可变气门升程连续调节进气量，部分负载时几乎不用节气门。',
  specs: [['数量', '2 根（进 / 排）'], ['驱动', '链条 + VANOS 相位调节'], ['气门升程', 'Valvetronic 连续可变'], ['转速上限', '7000 rpm']] });

addPart({ name: '气门组', en: 'VALVES', obj: buildValves(), dir: up([0, 1, 0]), dist: 0.34,
  anchor: [-0.06, 0.26, 0.03],
  fn: '每缸 4 个气门（2 进 2 排），进气门直径大于排气门以提升充气效率。气门弹簧回位，气门油封控制机油下窜。',
  specs: [['总数', '24 个'], ['进气门', '2 / 缸'], ['排气门', '2 / 缸'], ['材料', '耐热合金钢']] });

addPart({ name: '火花塞', en: 'SPARK PLUGS', obj: buildPlugs(), dir: up([0, 1, 0]), dist: 0.50,
  anchor: [0.0, 0.33, 0.0],
  fn: '点燃混合气。B58 每缸一个独立点火线圈，点火时刻由 DME 依据爆震、负荷与油品实时修正。',
  specs: [['数量', '6 个（每缸 1 个）'], ['点火', '独立线圈 · 顺序点火'], ['间隙', '约 0.7 mm'], ['更换周期', '约 6 万 km']] });

addPart({ name: '活塞连杆', en: 'PISTON & ROD', obj: buildPistons(), dir: up([0, 1, 0]), dist: 0.26,
  anchor: [0.0, 0.14, 0.06],
  fn: '把燃烧压力转成直线运动再交给曲轴。活塞顶部为凹坑燃烧室，三道环槽分别容纳两道气环与一道油环；连杆小头连活塞销、大头抱曲柄销。',
  specs: [['行程', '94.6 mm'], ['活塞直径', '82.0 mm'], ['连杆', '锻钢 · 裂解式大头'], ['环组', '2 气环 + 1 油环']] });

addPart({ name: '曲轴', en: 'CRANKSHAFT', obj: buildCrank(), dir: up([0, -1, 0]), dist: 0.34,
  anchor: [0.0, -0.02, 0.0],
  fn: '把六个活塞的往复运动汇成旋转输出。直列六缸的曲拐按 0°/120°/240° 布置，1-5-3-6-2-4 点火，使一阶与二阶往复惯性力天然平衡，这也是直六平顺的根源。',
  specs: [['曲拐相位', '0° / 120° / 240°'], ['点火顺序', '1-5-3-6-2-4'], ['主轴承', '7 道'], ['材料', '锻钢 · 氮化处理']] });

addPart({ name: '油底壳', en: 'OIL PAN', obj: buildPan(), dir: up([0, -1, 0]), dist: 0.40,
  anchor: [0.0, -0.14, 0.06],
  fn: '封闭曲轴箱下部、储存机油。底部集油槽内有机油挡板，抑制激烈驾驶时机油晃荡导致吸空。',
  specs: [['机油容量', '约 6.5 L'], ['材料', '铝合金'], ['结构', '湿式油底壳 + 挡板'], ['放油螺栓', '底部']] });

addPart({ name: '进气歧管', en: 'INTAKE MANIFOLD', obj: buildIntake(), dir: up([0, 0, 1]), dist: 0.36,
  anchor: [0.0, 0.24, 0.19],
  fn: '把增压后的空气均匀分配到六个气缸。稳压腔起储气与稳压作用，六根等长气道保证各缸充气一致；歧管上集成进气温度/压力传感器。',
  specs: [['气道', '6 根等长'], ['稳压腔', '集成式'], ['增压压力', '约 1.0 bar（依工况）'], ['材料', '工程塑料 / 铝']] });

addPart({ name: '排气歧管', en: 'EXHAUST MANIFOLD', obj: buildExhaust(), dir: up([0, 0, -1]), dist: 0.34,
  anchor: [0.0, 0.22, -0.19],
  fn: '汇集六个缸的高温废气送往涡轮。B58 采用双涡管（Twin-Scroll）分组：1-2-3 与 4-5-6 分两路进入涡轮，减少排气脉冲相互干扰，提升低速扭矩响应。',
  specs: [['分组', '双涡管（1-2-3 / 4-5-6）'], ['材料', '耐热不锈钢'], ['工作温度', '可达 950 ℃'], ['隔热', '双层壁 / 隔热罩']] });

addPart({ name: '涡轮增压器', en: 'TURBOCHARGER', obj: buildTurbo(), dir: up([-0.6, 0.4, -1]), dist: 0.46,
  anchor: [-0.26, 0.24, -0.26],
  fn: '废气推动涡轮叶轮，同轴带动压气机把进气压缩后送进中冷器。B58 用单涡轮双涡管，配合电控泄压阀精确控制增压值。',
  specs: [['形式', '单涡轮 · 双涡管'], ['最高增压', '约 1.0 bar'], ['泄压阀', '电控'], ['冷却', '机油 + 冷却液']] });

addPart({ name: '正时链条', en: 'TIMING CHAIN', obj: buildTiming(), dir: up([-1, 0, 0]), dist: 0.34,
  anchor: [-0.30, 0.18, 0.06],
  fn: '把曲轴转速按 1:2 传给两根凸轮轴，保证气门开闭与活塞位置严格对应。链条比皮带更耐久，配液压张紧器与导轨抑制振动。',
  specs: [['传动比', '2 : 1'], ['驱动', '单排链 / 双排链'], ['张紧', '液压张紧器'], ['维护', '免维护设计']] });

addPart({ name: '飞轮', en: 'FLYWHEEL', obj: buildFlywheel(), dir: up([1, 0, 0]), dist: 0.36,
  anchor: [0.34, 0.0, 0.06],
  fn: '储存做功冲程的能量、平滑转速波动，并把动力交给离合器/变速箱。外圈齿圈供起动机啮合启动。',
  specs: [['直径', '约 240 mm'], ['齿圈', '起动机啮合'], ['惯量', '双质量飞轮（MT 车型）'], ['材料', '铸钢 / 锻钢']] });

/* ───────────── 爆炸/选中状态 ───────────── */
const state = { prog: 0, sel: -1, hover: -1, auto: false, demo: false, t: 0 };

const partListEl = document.getElementById('parts');
function buildPartList() {
  parts.forEach((p, i) => {
    const d = document.createElement('div');
    d.className = 'pitem';
    d.dataset.i = i;
    d.innerHTML = `<i></i>${p.name}<span class="tag">${p.en.slice(0, 3)}</span>`;
    d.addEventListener('click', () => select(i));
    partListEl.appendChild(d);
  });
}
buildPartList();

const infoEl = document.getElementById('info');
function renderInfo(i) {
  const p = i >= 0 ? parts[i] : null;
  infoEl.querySelector('.nm').innerHTML = p ? `${p.name}<em>${p.en}</em>` : '整机<em>BMW B58B30</em>';
  infoEl.querySelector('.fn').textContent = p ? p.fn
    : '点击左侧部件，或直接点模型上的零件，查看它的功能与参数。';
  infoEl.querySelector('#speclist').innerHTML = p
    ? p.specs.map(([k, v]) => `<b>${k}</b><span>${v}</span>`).join('')
    : [['结构', '直列 6 缸 · 涡轮增压'], ['气门机构', 'DOHC + Valvetronic'], ['供油', '缸内直喷 350 bar'], ['重量', '约 139 kg']]
      .map(([k, v]) => `<b>${k}</b><span>${v}</span>`).join('');
}

document.querySelectorAll('.pitem').forEach((el) => el.classList.remove('on'));
function select(i) {
  state.sel = (state.sel === i ? -1 : i);
  document.querySelectorAll('.pitem').forEach((el) => el.classList.toggle('on', +el.dataset.i === state.sel));
  renderInfo(state.sel);
  if (state.sel >= 0) toast(`已拉出：${parts[state.sel].name}`);
}
renderInfo(-1);

/* 滑杆 / 按钮 */
const slider = document.getElementById('slider');
slider.addEventListener('input', () => { state.prog = +slider.value / 100; state.demo = false; });

const btnAuto = document.getElementById('btnAuto');
btnAuto.onclick = () => { state.auto = !state.auto; btnAuto.classList.toggle('on', state.auto); };

const btnDemo = document.getElementById('btnDemo');
btnDemo.onclick = () => {
  state.demo = !state.demo;
  btnDemo.classList.toggle('on', state.demo);
  if (state.demo) { state.prog = 0; slider.value = 0; }
};

document.getElementById('btnReset').onclick = () => {
  state.prog = 0; slider.value = 0; state.demo = false; btnDemo.classList.remove('on');
  state.sel = -1; document.querySelectorAll('.pitem').forEach((el) => el.classList.remove('on'));
  renderInfo(-1);
  camera.position.copy(HOME); controls.target.copy(TARGET);
  toast('已复位');
};

let toastTimer = 0;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

/* 点选（射线） */
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
canvas.addEventListener('pointerdown', (e) => {
  const r = canvas.getBoundingClientRect();
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(parts.map((p) => p.obj), true);
  if (!hits.length) return;
  let o = hits[0].object;
  while (o && o.parent && !parts.some((p) => p.obj === o)) o = o.parent;
  const idx = parts.findIndex((p) => p.obj === o);
  if (idx >= 0) select(idx);
});

/* ───────────── 标注（浮动标签 + 引线） ───────────── */
const labelDefs = [
  { i: 1, text: '缸盖 · DOHC', off: [-16, -62] },
  { i: 6, text: '曲轴 · 0/120/240°', off: [92, 66] },
  { i: 9, text: '进气歧管', off: [86, -52] },
  { i: 10, text: '排气 · 双涡管', off: [-104, 46] },
  { i: 11, text: '涡轮增压器', off: [-108, 78] },
  { i: 12, text: '正时链条', off: [-92, -18] },
];
const labelLayer = document.createElement('div');
labelLayer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9;';
document.body.appendChild(labelLayer);
const lineCanvas = document.createElement('canvas');
lineCanvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:8;width:100%;height:100%;';
document.body.appendChild(lineCanvas);
const lctx = lineCanvas.getContext('2d');

const labels = labelDefs.map((d) => {
  const el = document.createElement('div');
  el.style.cssText = `position:absolute;font-size:11.5px;letter-spacing:.06em;color:#bfefff;
    white-space:nowrap;transform:translate(-50%,-50%);padding:4px 9px 4px 18px;border-radius:6px;
    background:rgba(6,12,22,.72);border:1px solid rgba(55,226,255,.28);backdrop-filter:blur(4px);`;
  el.textContent = d.text;
  labelLayer.appendChild(el);
  return { el, def: d };
});

const v3 = new THREE.Vector3();
function project(p) {
  v3.copy(p).project(camera);
  return { x: (v3.x * 0.5 + 0.5) * innerWidth, y: (-v3.y * 0.5 + 0.5) * innerHeight, z: v3.z };
}

/* ───────────── 尺寸自适应 ───────────── */
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  lineCanvas.width = w * devicePixelRatio;
  lineCanvas.height = h * devicePixelRatio;
  lctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
addEventListener('resize', resize);
resize();

/* ───────────── 主循环 ───────────── */
const clock = new THREE.Clock();
const ease = (t) => t * t * (3 - 2 * t);
let camAngle = 0;

function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  state.t += dt;

  // 演示：0-1 自动展开再收回
  if (state.demo) {
    const ph = (state.t * 0.32) % 2;
    state.prog = ph < 1 ? ease(ph) : ease(2 - ph);
    slider.value = Math.round(state.prog * 100);
  }

  // 部件位置：整机拆解 + 单独拉出
  parts.forEach((p, i) => {
    const target = (state.sel === i ? 1 : 0);
    p.pull += (target - p.pull) * Math.min(1, dt * 7);
    const k = state.prog + p.pull * 0.85;
    p.obj.position.copy(p.dir).multiplyScalar(p.dist * k);
    // 选中高亮
    const on = state.sel === i;
    p.obj.traverse((o) => {
      if (!o.isMesh || !o.material || !o.material.emissive) return;
      if (!o.userData.baseE) o.userData.baseE = o.material.emissive.clone();
      o.material.emissive.copy(o.userData.baseE);
      if (on) o.material.emissive.lerp(new THREE.Color(0x1d7fa8), 0.55 + 0.25 * Math.sin(state.t * 5));
    });
  });

  // 曲轴 / 凸轮 / 活塞联动（慢转，纯视觉）
  const crank = parts[6], cams = parts[2], pist = parts[5];
  if (crank) crank.obj.rotation.x += dt * 0.55;
  if (cams) cams.obj.children.forEach(() => {});
  if (pist && pist.obj.userData.pistons) {
    pist.obj.userData.pistons.forEach((p, i) => {
      const ph = FIRE.indexOf(i) * Math.PI * 2 / 3;
      p.position.y = 0.145 + Math.cos(state.t * 0.55 + ph) * THROW * 0.55;
      if (p.userData.rod) p.userData.rod.rotation.z = Math.sin(state.t * 0.55 + ph) * 0.16;
    });
  }

  // 粒子缓慢上浮
  const pa = pgeo.attributes.position;
  for (let i = 0; i < pcount; i++) {
    let y = pa.array[i * 3 + 1] + dt * 0.035;
    if (y > 1.3) y = -0.3;
    pa.array[i * 3 + 1] = y;
  }
  pa.needsUpdate = true;
  particles.rotation.y += dt * 0.02;

  if (state.auto) {
    camAngle += dt * 0.28;
    const r = Math.hypot(camera.position.x - TARGET.x, camera.position.z - TARGET.z);
    camera.position.x = TARGET.x + Math.cos(camAngle) * r;
    camera.position.z = TARGET.z + Math.sin(camAngle) * r;
  } else if (!state.auto) {
    camAngle = Math.atan2(camera.position.z - TARGET.z, camera.position.x - TARGET.x);
  }
  controls.update();

  // 标注引线
  lctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const L of labels) {
    const p = parts[L.def.i];
    if (!p) continue;
    const anchorLocal = new THREE.Vector3(...p.anchor);
    const world = p.obj.localToWorld(anchorLocal.clone());
    const s = project(world);
    const lx = s.x + L.def.off[0], ly = s.y + L.def.off[1];
    L.el.style.left = lx + 'px';
    L.el.style.top = ly + 'px';
    const vis = s.z < 1 && state.sel < 0;
    L.el.style.opacity = vis ? '1' : '0';
    if (vis) {
      lctx.strokeStyle = 'rgba(55,226,255,.42)';
      lctx.lineWidth = 1;
      lctx.beginPath();
      lctx.moveTo(s.x, s.y);
      lctx.lineTo(lx, ly);
      lctx.stroke();
      lctx.fillStyle = 'rgba(55,226,255,.9)';
      lctx.beginPath(); lctx.arc(s.x, s.y, 2, 0, 7); lctx.fill();
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();

/* 暴露给调试/自检 */
window.__dbg = { scene, camera, parts, state, select };