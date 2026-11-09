'use strict';
(()=>{
const $=id=>document.getElementById(id),canvas=$('scene'),ctx=canvas.getContext('2d');
const C={green:'#247b68',orange:'#be663c',gray:'#aab6a2',ink:'#183e35',line:'#8caa8d',blue:'#617f9c'};
let mode='box',yaw=.58,pitch=-.36,zoom=1,points=[],normal=[],width=0,height=0,dirty=true,upper=0,lower=0,shots=[],seed=1001;
function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return (seed+.5)/4294967296;}
function gaussian(){return Math.sqrt(-2*Math.log(Math.max(random(),1e-9)))*Math.cos(2*Math.PI*random());}
for(let i=0;i<3400;i++)normal.push([gaussian(),gaussian(),gaussian()]);
function params(){return [Number($('nx').value),Number($('ny').value),Number($('nz').value)];}
function boxProbability(a,n){return a-Math.sin(2*Math.PI*n*a)/(2*Math.PI*n);}
function spinPlus(){return $('preparation').value==='mixed'?.5:Math.cos(Number($('angle').value)*Math.PI/360)**2;}
function generate(){
points=[];if(mode==='box'){
 seed=39473;const [nx,ny,nz]=params();let trials=0;
 while(points.length<4000&&trials++<180000){const x=random(),y=random(),z=random();const psi=Math.sin(nx*Math.PI*x)*Math.sin(ny*Math.PI*y)*Math.sin(nz*Math.PI*z);if(random()<psi*psi)points.push({v:[3*(x-.5),3*(y-.5),3*(z-.5)],x,sign:psi>=0?1:-1});}
}else if(mode==='gaussian'){
 const sx=Number($('sigma').value),momentum=$('space').value==='momentum',s=momentum?1/(2*sx):sx;
 points=normal.map(v=>({v:[v[0]*s*.65,v[1]*(momentum?1:.5)*.65,v[2]*(momentum?1:.5)*.65]}));
}dirty=true;updateText();}
function project(v){const [x,y,z]=v;const a=x*Math.cos(yaw)-y*Math.sin(yaw),b=x*Math.sin(yaw)+y*Math.cos(yaw),vY=b*Math.sin(pitch)+z*Math.cos(pitch),d=b*Math.cos(pitch)-z*Math.sin(pitch);const k=24/(24+d),scale=Math.min(width,height)*.158*zoom;return {x:width/2+a*k*scale,y:height*.49-vY*k*scale,d,k};}
function line(a,b,color=C.line,w=1,dash=[]){const p=project(a),q=project(b);ctx.beginPath();ctx.setLineDash(dash);ctx.strokeStyle=color;ctx.lineWidth=w;ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.setLineDash([]);}
function polygon(vertices,fill,stroke=C.line){const p=vertices.map(project);ctx.beginPath();p.forEach((v,i)=>i?ctx.lineTo(v.x,v.y):ctx.moveTo(v.x,v.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=.8;ctx.stroke();}
function label(text,p,color=C.ink){const a=project(p);ctx.font='13px "Microsoft YaHei",sans-serif';ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(text,a.x,a.y);}
function cube(min,max,color=C.line){for(let i=0;i<8;i++){const a=[0,1,2].map(k=>(i>>k)&1?max[k]:min[k]);for(let k=0;k<3;k++)if(!((i>>k)&1)){const b=a.slice();b[k]=max[k];line(a,b,color);}}}
function axis(length=2){line([0,0,0],[length,0,0],C.ink);line([0,0,0],[0,length,0],C.ink);line([0,0,0],[0,0,length],C.ink);const m=mode==='gaussian'&&$('space').value==='momentum';label(m?'pₓ':'x',[length+.2,0,0]);label(m?'pᵧ':'y',[0,length+.2,0]);label(m?'p_z':'z',[0,0,length+.2]);}
function drawBox(){
cube([-1.5,-1.5,-1.5],[1.5,1.5,1.5]);
if($('nodes').checked){params().forEach((n,k)=>{for(let j=1;j<n;j++){const t=3*(j/n-.5),v=[[-1.5,-1.5],[-1.5,1.5],[1.5,1.5],[1.5,-1.5]].map(a=>{let b=[];let c=0;for(let l=0;l<3;l++)b.push(l===k?t:a[c++]);return b;});polygon(v,'#be663c14','#be663c77');}});}
const a=Number($('region').value),phase=$('phase').checked;
const dots=points.map(p=>({...p,p:project(p.v)})).sort((a,b)=>b.p.d-a.p.d);
for(const d of dots){ctx.fillStyle=d.x>a?'#aab6a22d':phase?(d.sign>0?'#247b68a8':'#be663ca8'):'#247b6890';ctx.beginPath();ctx.arc(d.p.x,d.p.y,Math.max(.6,1.15*d.p.k),0,2*Math.PI);ctx.fill();}
const b=3*(a-.5);if(a>0&&a<1)polygon([[b,-1.5,-1.5],[b,-1.5,1.5],[b,1.5,1.5],[b,1.5,-1.5]],'#247b680c','#247b6880');
line([-1.5,-1.5,-1.5],[1.9,-1.5,-1.5],C.ink);label('x/L →',[2.1,-1.5,-1.5]);label('0',[-1.7,-1.5,-1.5]);label('1',[1.5,-1.5,-1.75]);label('y',[-1.5,1.8,-1.5]);label('z',[-1.5,-1.5,1.8]);
}
function drawGaussian(){axis(2.8);for(const p of points.map(p=>project(p.v)).sort((a,b)=>b.d-a.d)){ctx.fillStyle='#247b688a';ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.5,1.1*p.k),0,2*Math.PI);ctx.fill();}label('0',[0,0,-.18]);}
function pathZ(x){if(x<-.6)return 0;if(x<=.6)return .19*(x+.6)**2;return .19*1.2**2+.456*(x-.6);}
function drawSpin(){
 cube([-.6,-.6,.8],[.6,.6,1.25],C.blue);cube([-.6,-.6,-1.25],[.6,.6,-.8],C.blue);
 polygon([[2.7,-.65,-1.7],[2.7,.65,-1.7],[2.7,.65,1.7],[2.7,-.65,1.7]],'#ffffff38');
 line([-3,0,0],[2.7,0,0],C.gray,1,[4,4]);label('银原子束',[-2.3,0,.4]);label('非均匀磁场',[0,0,1.6]);label('探测屏',[2.7,0,2]);
 const prob=spinPlus();for(const sg of [-1,1]){const plus=sg===-1,p=plus?prob:1-prob,col=plus?C.green:C.orange;if(p>1e-8){let prev=[-3,0,0];for(let i=1;i<=90;i++){const x=-3+5.7*i/90,next=[x,0,sg*pathZ(x)];line(prev,next,col,1.7);prev=next;}}}
 for(const s of shots){const p=project(s.v);ctx.fillStyle=s.plus?C.green:C.orange;ctx.beginPath();ctx.arc(p.x,p.y,2.2*p.k,0,2*Math.PI);ctx.fill();}
 label('S_z=−ħ/2',[2.7,0,1.6],C.orange);label('S_z=+ħ/2',[2.7,0,-1.9],C.green);
}
function draw(){ctx.clearRect(0,0,width,height);if(mode==='box')drawBox();else if(mode==='gaussian')drawGaussian();else drawSpin();dirty=false;}
function schedule(){if(!dirty)return;requestAnimationFrame(()=>{if(dirty)draw();});}
function updateText(){
if(mode==='box'){
 const [nx,ny,nz]=params(),a=Number($('region').value),p=boxProbability(a,nx),nodes=nx+ny+nz-3;
 $('a-value').textContent=a.toFixed(2);$('scene-title').textContent='三维无限深方盒 · 概率云';
 $('result').textContent=`内部节点平面 ${nodes} 个 · P(0≤x≤${a.toFixed(2)}L)=${(100*p).toFixed(2)}%`;
 $('key-title').textContent='看见空白平面，就是看见零概率。';$('key-text').textContent=`当前量子数 (${nx},${ny},${nz})。x、y、z方向分别有 ${nx-1}、${ny-1}、${nz-1} 个内部节点平面。改变整体相位不改变概率密度；区域概率要把密度在该区域内积分。`;
 $('formula').textContent='ψ=(2/L)³ᐟ² sin(nₓπx/L) sin(nᵧπy/L) sin(n_zπz/L)\nρ=|ψ|²；∫整个盒子 ρ dV=1\nP(0≤x≤aL)=a−sin(2πnₓa)/(2πnₓ)';
 $('caution').textContent='这是理想方盒，不是原子轨道。点数多少是采样设置，空间中的相对疏密才编码概率；颜色正负表示选定实定态的相位符号，不是正负电荷。';
 $('box-legend').textContent=$('phase').checked?'青色：ψ>0；橙色：ψ<0；浅灰：观察区域外。节点处ψ=0。':'绿色：观察区域内；浅灰：观察区域外。点越密，概率密度越高。';
 $('practice').innerHTML='<a href="./questions.html#5-10">对应原题5-10：先回到一维，再算区间概率 →</a>';
}else if(mode==='gaussian'){
 const sx=Number($('sigma').value),sp=1/(2*sx),momentum=$('space').value==='momentum';$('sigma-value').textContent=sx.toFixed(2);$('scene-title').textContent=momentum?'最小不确定高斯态 · 动量空间':'最小不确定高斯态 · 位置空间';
 $('result').textContent=`Δx=${sx.toFixed(2)}ℓ₀ · Δpₓ=${sp.toFixed(3)}ħ/ℓ₀ · 乘积=ħ/2`;
 $('key-title').textContent='把位置捏窄，动量就散开。';$('key-text').textContent='这两个分布属于同一种量子态。不能把某个位置样本与某个动量样本配成同一次精确测量结果。此处没有演示时间演化，拖动滑杆是在比较不同制备的高斯态。';
 $('formula').textContent='ρ(x)=[1/(√(2π)σₓ)] exp[−x²/(2σₓ²)]\nΔx=σₓ，Δpₓ=ħ/(2σₓ)\n一般态：ΔxΔpₓ≥ħ/2';
 $('caution').textContent='ℓ₀为任意选定的长度单位。最小乘积只适用于此处选用的无关联高斯态；一般波函数不一定取等号。σ_y=σ_z=0.5ℓ₀，x方向均值与平均动量均取0。';$('practice').innerHTML='<a href="./notes.html#n33">回到不确定关系笔记 →</a>';
}else{
 const p=spinPlus(),total=upper+lower,mixed=$('preparation').value==='mixed';$('angle-label').hidden=mixed;$('angle-value').textContent=$('angle').value+'°';$('scene-title').textContent='斯特恩—盖拉赫 · 理想自旋½测量';
 $('result').textContent=`理论P(S_z=+ħ/2)=${(100*p).toFixed(1)}% · 已测 ${total} 个：+ ${lower} / − ${upper}`;
 $('key-title').textContent='两个输出值，概率由制备状态决定。';$('key-text').textContent='基态银原子的未配对5s电子轨道角动量为0，分成两束源于自旋。单次z测量只得到±ħ/2；多次计数通常围绕理论概率波动，不要求恰好等于理论比例。';
 $('formula').textContent='S_z=m_sħ，m_s=±½\nμ_z≈−2μᴮm_s，F_z≈μ_z ∂B_z/∂z\n'+(mixed?'非偏振束：P(+)=P(−)=½':'纯态：P(+)=cos²(θ/2)，P(−)=sin²(θ/2)');
 $('caution').textContent='自旋不是电子表面自转。磁矩与电子自旋方向相反，因此在本图正梯度约定下，S_z=+ħ/2偏向下方。轨迹是装置运动示意，不是电子在原子内的路径。';$('practice').innerHTML='<a href="./notes.html#n45">回到新增笔记：分束与磁矩修订 →</a>';
}canvas.setAttribute('aria-label',$('scene-title').textContent+'。'+$('result').textContent+'。拖动或用方向键旋转。');}
function changeMode(next){mode=next;for(const name of ['box','gaussian','spin']){$(name+'-controls').hidden=name!==mode;$('tab-'+name).setAttribute('aria-selected',name===mode?'true':'false');}yaw=mode==='spin'?.5:.58;pitch=-.36;zoom=1;generate();schedule();}
for(const b of document.querySelectorAll('[data-mode]'))b.onclick=()=>{changeMode(b.dataset.mode);history.replaceState(null,'','#'+mode);};
for(const id of ['nx','ny','nz','sigma','space'])$(id).addEventListener('input',()=>{generate();schedule();});
for(const id of ['region','nodes','phase'])$(id).addEventListener('input',()=>{dirty=true;updateText();schedule();});
for(const id of ['angle','preparation'])$(id).addEventListener('input',()=>{upper=lower=0;shots=[];dirty=true;updateText();schedule();});
function shoot(){const p=spinPlus();for(let i=0;i<200;i++){const plus=random()<p;if(plus)lower++;else upper++;shots.push({v:[2.7,.16*gaussian(),(plus?-1:1)*pathZ(2.7)+.055*gaussian()],plus});}if(shots.length>4000)shots=shots.slice(-4000);dirty=true;updateText();schedule();}
 $('shoot').onclick=shoot;$('clear').onclick=()=>{upper=lower=0;shots=[];dirty=true;updateText();schedule();};
 $('zoom-in').onclick=()=>{zoom=Math.min(1.65,zoom+.15);dirty=true;schedule();};$('zoom-out').onclick=()=>{zoom=Math.max(.6,zoom-.15);dirty=true;schedule();};$('reset').onclick=()=>{yaw=mode==='spin'?.5:.58;pitch=-.36;zoom=1;dirty=true;schedule();};
let pointer=null;canvas.addEventListener('pointerdown',e=>{pointer={x:e.clientX,y:e.clientY,id:e.pointerId};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!pointer||e.pointerId!==pointer.id)return;yaw+=(e.clientX-pointer.x)*.009;pitch=Math.max(-1.3,Math.min(1.3,pitch+(e.clientY-pointer.y)*.009));pointer.x=e.clientX;pointer.y=e.clientY;dirty=true;schedule();});for(const e of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(e,()=>pointer=null);
canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')yaw-=.12;if(e.key==='ArrowRight')yaw+=.12;if(e.key==='ArrowUp')pitch=Math.min(1.3,pitch+.12);if(e.key==='ArrowDown')pitch=Math.max(-1.3,pitch-.12);dirty=true;schedule();});
new ResizeObserver(()=>{const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);width=r.width;height=r.height;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);dirty=true;schedule();}).observe(canvas);
changeMode(['box','gaussian','spin'].includes(location.hash.slice(1))?location.hash.slice(1):'box');
// Pure numeric helpers and a small state snapshot support physics and interaction checks.
window.quantumModel={boxProbability,spinPlus,getState:()=>({mode,yaw,pitch,zoom,pointCount:points.length,upper,lower,params:params(),sigma:Number($('sigma').value)})};
})();
