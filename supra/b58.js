import * as THREE from 'three';
/* ============================================================
   B58 直列六缸 · 纯几何模块
   由 engine/app.js 抽出，供 Supra 页与发动机页共用同一套零件几何。
   单位：米；曲轴轴向 = X；返回的 Group 原点在曲轴中心。
   ============================================================ */
const BORE = 0.082, STROKE = 0.0946, SPACING = 0.091, THROW = STROKE / 2;
const N = 6;                     // 缸数
const FIRE = [0, 2, 1, 3, 5, 4]; // 点火顺序 1-5-3-6-2-4（0 基）
const X0 = -(N - 1) * SPACING / 2;
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
/* module: 不挂场景，由调用方 add */

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

/* ── 对外接口 ── */
/* 返回的 Group 里每个子零件都带 userData.subs 元信息，供“发动机内部分栏”使用 */
export function buildB58() {
  const g = new THREE.Group();
  g.name = 'B58';

  const defs = [
    ['缸体',     buildBlock(),     [0, 0, 0],       0.00, '整机骨架'],
    ['缸盖',     buildHead(),      [0, 1, 0],       0.30, '燃烧室顶'],
    ['凸轮轴',   buildCams(),      [0, 1, 0.2],     0.46, '进排气各一根'],
    ['气门',     buildValves(),    [0, 0.9, 0],     0.38, '24 气门'],
    ['火花塞',   buildPlugs(),     [0, 1, 0],       0.56, '每缸一支'],
    ['活塞连杆', buildPistons(),   [0, 0.35, 1],    0.34, '往复运动'],
    ['曲轴',     buildCrank(),     [0, -1, 0],      0.42, '把往复变旋转'],
    ['油底壳',   buildPan(),       [0, -1, 0],      0.60, '润滑储油'],
    ['进气歧管', buildIntake(),    [0, 0.5, 1],     0.48, '增压空气分配'],
    ['排气歧管', buildExhaust(),   [0, 0.2, -1],    0.52, '废气汇集'],
    ['涡轮',     buildTurbo(),     [0, -0.2, -1],   0.62, '废气驱动压气'],
    ['正时链条', buildTiming(),    [-1, 0, 0],      0.44, '曲轴带凸轮轴'],
    ['飞轮',     buildFlywheel(),  [1, 0, 0],       0.50, '输出扭矩'],
  ];

  g.userData.subs = defs.map(([name, obj, d, dist, note]) => {
    obj.name = name;
    g.add(obj);
    return {
      name, note, obj, dist,
      dir: new THREE.Vector3(d[0], d[1], d[2]).normalize(),
      home: obj.position.clone(),
      homeRot: obj.rotation.clone(),
      pull: 0, target: 0,
    };
  });

  const pistonsG = defs[5][1];
  g.userData.pistons = pistonsG.userData.pistons || [];
  return g;
}