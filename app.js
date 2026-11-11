import {createQuoteCycle} from './bookshelf-quotes.js?v=22';
import {BufferedTrack} from './audio-track.js?v=2';
import {createCelebration,createRecordPlayer} from './celebration.js?v=21';
import * as THREE from './vendor/three.module.js';
import {buildCity} from './city.js?v=20261111-8';
import {buildDecor} from './room-decor.js?v=20261111-22';
import {createCollectible} from './collectibles.js?v=20261111-3';

const $ = id => document.getElementById(id);
const canvas = $('room');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try {
  renderer = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:'high-performance'});
} catch (e) { $('loading').hidden=true; $('error').hidden=false; throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(pointer:coarse)').matches?1.25:1.75));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene(); scene.background=new THREE.Color('#101b31');
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.05,100);
camera.position.set(0,1.65,7.1); camera.lookAt(-1,1.5,3.6);
const hemi=new THREE.HemisphereLight('#c7d5f8','#796149',1.05);scene.add(hemi);
const ambient=new THREE.AmbientLight('#ffe1af',.48);scene.add(ambient);
const warm=new THREE.PointLight('#ffd49a',15,13,2);warm.position.set(-1.7,2.9,.2);scene.add(warm);
const ceiling=new THREE.PointLight('#ffe6bc',22,13,2);ceiling.position.set(0,3.15,1.5);scene.add(ceiling);
const moonlight=new THREE.DirectionalLight('#afc9f1',1.2);moonlight.position.set(-5,7,-12);scene.add(moonlight);
const lampLight=new THREE.PointLight('#ffc979',4.5,4,2);lampLight.position.set(-2.22,1.98,-2.0);scene.add(lampLight);
const softShadow=new THREE.SpotLight('#ffe3b0',5,12,.8,.7,1);softShadow.position.set(-1.8,3.3,.4);softShadow.target.position.set(0,.9,-1.7);softShadow.castShadow=true;softShadow.shadow.mapSize.set(1024,1024);softShadow.shadow.bias=-.001;scene.add(softShadow,softShadow.target);
const mat=(color,options={})=>new THREE.MeshStandardMaterial({color,roughness:.78,...options});
const wood=mat('#ad8052'),edge=mat('#735537'),wall=mat('#dccbb2'),trim=mat('#b49a75'),sage=mat('#607874'),cream=mat('#f7e9cd'),brass=mat('#b8975b',{metalness:.65,roughness:.3});
const basic=(color,options={})=>new THREE.MeshBasicMaterial({color,...options});
function box(w,h,d,m,x,y,z,parent=scene){const a=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true;parent.add(a);return a;}
function sphere(r,m,x,y,z,parent=scene,sx=1,sy=1,sz=1){const a=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),m);a.position.set(x,y,z);a.scale.set(sx,sy,sz);a.castShadow=true;parent.add(a);return a;}
function cylinder(top,bottom,h,m,x,y,z,parent=scene){const a=new THREE.Mesh(new THREE.CylinderGeometry(top,bottom,h,40),m);a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true;parent.add(a);return a;}
function plane(w,h,m,x,y,z,parent=scene){const a=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);a.position.set(x,y,z);parent.add(a);return a;}
function textTexture(text,{bg='#eee2c8',color='#67533b',w=1024,h=256,size=70,font='Georgia',spaced=false}={}){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`${size}px ${font}`;ctx.fillText(text,w/2,h/2,w*.88);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function textPlane(text,w,h,x,y,z,opts={}){return plane(w,h,new THREE.MeshBasicMaterial({map:textTexture(text,opts)}),x,y,z);}

const timberCanvas=document.createElement('canvas');timberCanvas.width=256;timberCanvas.height=512;const timber=timberCanvas.getContext('2d');timber.fillStyle='#b18b62';timber.fillRect(0,0,256,512);for(let i=0;i<180;i++){timber.strokeStyle=`rgba(71,44,25,${.025+(i%5)*.012})`;timber.beginPath();for(let y=0;y<=512;y+=8){const x=i*1.5+Math.sin(y*.018+i)*1.6; y===0?timber.moveTo(x,y):timber.lineTo(x,y);}timber.stroke();}const timberMap=new THREE.CanvasTexture(timberCanvas);timberMap.colorSpace=THREE.SRGBColorSpace;wood.map=timberMap;wood.roughness=.63;
// A quiet, warmly lit room. The window is a real opening into the skyline.
box(9,.15,13.2,wood,0,-.1,2.5);
for(let x=-4.5;x<4.5;x+=.47){box(.009,.004,15,edge,x,-.019,1.3);for(let z=-5;z<8;z+=2.1)box(.46,.005,.008,edge,x+.23,-.018,z+(Math.round(x*2)%2)*.55);}
box(.15,3.7,12,wall,-4.55,1.8,1);box(.15,3.7,12,wall,4.55,1.8,1);
box(9,.12,12,mat('#e0ccb0'),0,3.65,1);
box(3.55,3.65,.16,wall,-2.77,1.8,4);box(3.55,3.65,.16,wall,2.77,1.8,4);box(2,0.6,.2,wall,0,3.35,4);
box(9,.68,.18,wall,0,.28,-4.15);box(9,.55,.18,wall,0,3.4,-4.15);box(1.4,3.65,.18,wall,-3.85,1.8,-4.15);box(1.4,3.65,.18,wall,3.85,1.8,-4.15);
for(const x of [-4.45,4.45])box(.07,.14,12,trim,x,.06,1);
for(const x of [-1.02,1.02])box(.11,3.1,.26,edge,x,1.52,4.04);box(2.15,.12,.26,edge,0,3.05,4.04);
const doorPivot=new THREE.Group();doorPivot.position.set(-.94,0,4.02);scene.add(doorPivot);
const door=box(1.88,2.99,.12,mat('#67766b'),.94,1.5,0,doorPivot);
for(const y of [.78,2.18]){box(1.45,1.08,.025,mat('#748071'),.94,y,.076,doorPivot);for(const xx of [.21,1.67])box(.025,1.12,.024,trim,xx,y,.094,doorPivot);for(const yy of [y-.55,y+.55])box(1.48,.025,.024,trim,.94,yy,.094,doorPivot);}
const knob=cylinder(.037,.037,.10,brass,1.65,1.33,.14,doorPivot);knob.rotation.x=Math.PI/2;box(.16,.035,.05,brass,1.60,1.34,.22,doorPivot);
const plaque=textPlane('Kiko',.58,.2,.94,2.04,.113,{bg:'#e2d3ae',color:'#665238',size:74});scene.remove(plaque);doorPivot.add(plaque);
const underDoor=box(1.84,.013,.15,basic('#ffe4a0'),0,.01,4.09);
// Entryway details.
box(.65,.10,.30,edge,2.1,1.18,4.25);cylinder(.10,.07,.27,cream,2.1,1.36,4.25);sphere(.12,sage,2.1,1.65,4.25);
textPlane('13',.28,.28,1.37,2.33,4.10,{bg:'#dccbb2',size:125});
// Window framing, curtains, and a deep blue Huangpu river beyond.
for(const x of [-3.2,3.2])box(.11,2.7,.25,edge,x,1.9,-4.03);
for(const y of [.59,3.21])box(6.5,.11,.26,edge,0,y,-4.03);
box(.05,2.58,.12,trim,0,1.9,-3.99);box(6.35,.045,.12,trim,0,1.6,-3.99);
box(6.7,.10,.47,wood,0,.55,-3.87);
const glass=plane(6.3,2.53,new THREE.MeshPhysicalMaterial({color:'#b8d5e7',transparent:true,opacity:.025,roughness:.1,depthWrite:false}),0,1.9,-4.06);
const curtainMat=mat('#4f6d68',{side:THREE.DoubleSide});

const rod=cylinder(.025,.025,7.3,brass,0,3.32,-3.65);rod.rotation.z=Math.PI/2;
const city=buildCity(scene);
let seed=17;function rand(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
// The desk faces the window. A card, cake, flowers, and three tiny game-inspired plushies.
box(3.05,.13,1.4,wood,0,.91,-1.8);box(3.09,.035,1.44,edge,0,.85,-1.8);
for(const x of [-1.32,1.32])for(const z of [-2.32,-1.28]){cylinder(.045,.065,.8,edge,x,.43,z);for(const y of [.13,.65,.76])sphere(.065,edge,x,y,z,scene,1,.7,1);}box(2.72,.15,.07,edge,0,.76,-1.23);box(2.72,.15,.07,edge,0,.76,-2.37);
const rug=plane(3.65,2.8,mat('#958b71'),0,.005,-.25);rug.rotation.x=-Math.PI/2;
for(const x of [-1.68,1.68]){const line=plane(.022,2.6,cream,x,.008,-.25);line.rotation.x=-Math.PI/2;}
const chair=new THREE.Group();chair.position.set(-.65,0,-.12);scene.add(chair);box(.66,.10,.62,wood,0,.48,0,chair);box(.65,.59,.07,wood,0,.83,.25,chair);for(const x of [-.26,.26])for(const z of [-.24,.24])box(.05,.5,.05,edge,x,.23,z,chair);
box(.58,.08,.53,sage,0,.56,0,chair);box(.53,.39,.08,sage,0,.85,.20,chair);
// Freestanding lamp to the left of the desk, clear of the open greeting card.
cylinder(.25,.29,.055,brass,-2.22,.028,-2.0);cylinder(.023,.032,1.91,brass,-2.22,1.0,-2.0);cylinder(.20,.34,.40,mat('#e9ca8e',{emissive:'#c89b50',emissiveIntensity:.25}),-2.22,2.05,-2.0);cylinder(.038,.038,.06,brass,-2.22,2.28,-2.0);
const roomDecor=buildDecor(scene);
// One generous raycast target spans the whole shelf, including spaces between books.
const shelfTarget=new THREE.Mesh(new THREE.BoxGeometry(1.5,2.65,.48),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
shelfTarget.position.y=1.3;roomDecor.bookshelf.add(shelfTarget);
const nextShelfQuote=createQuoteCycle();
const shelfPoint=new THREE.Vector3(-3.85,1.45,1.6);
function nearBookshelf(){return stage>=2&&Math.hypot(camera.position.x-shelfPoint.x,camera.position.z-shelfPoint.z)<2.15;}
function openShelfBook(){if(busy||!nearBookshelf()||document.querySelector('dialog[open]'))return;keys.clear();const quote=nextShelfQuote();$('book-quote').textContent=quote.text;$('book-source').textContent=quote.source;$('book-dialog').showModal();}
$('close-book').addEventListener('click',()=>$('book-dialog').close());
$('shelf-hotspot').addEventListener('click',openShelfBook);
function updateBookshelfHotspot(){const button=$('shelf-hotspot');const screen=shelfPoint.clone().project(camera);const facing=shelfPoint.clone().sub(camera.position).dot(camera.getWorldDirection(new THREE.Vector3()))>0;const visible=nearBookshelf()&&!busy&&!document.querySelector('dialog[open]')&&facing&&Math.abs(screen.x)<.85&&Math.abs(screen.y)<.8;button.hidden=!visible;if(visible){button.style.left=`${(screen.x*.5+.5)*innerWidth}px`;button.style.top=`${(-screen.y*.5+.5)*innerHeight}px`;}}

const recordPlayer=createRecordPlayer(scene);
const show=createCelebration(scene,[hemi,ambient,warm,ceiling,moonlight,lampLight,softShadow,...roomDecor.lights],{fadeBirthday:fadeBirthdayForCurtain,openMusic:startCurtainMusic,ready:()=>{},fireworks:startFireworks,done:()=>{}});
for(const [kind,x]of [['puppy',-.69],['bear',-.20]]){const toy=createCollectible(kind);toy.scale.setScalar(.17);toy.position.set(x,.985,-2.13);toy.rotation.y=-.10;scene.add(toy);}
// Card image is shared by the physical object and the full-size viewer.
const card=new THREE.Group();card.position.set(-.47,.994,-1.63);card.rotation.y=-.13;scene.add(card);
box(.58,.012,.77,cream,0,0,0,card);
const cardTexture=new THREE.TextureLoader().load('./birthday-card.svg?v=20261111-17');cardTexture.colorSpace=THREE.SRGBColorSpace;cardTexture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
const cardFace=plane(.57,.76,new THREE.MeshBasicMaterial({map:cardTexture}),0,.008,0,card);cardFace.rotation.x=-Math.PI/2;
// The cover hinges along the card's left edge; its reverse is plain cream paper.
const cardCover=new THREE.Group();cardCover.position.set(-.29,.018,0);card.add(cardCover);
box(.58,.009,.77,cream,.29,0,0,cardCover);
const coverTexture=new THREE.TextureLoader().load('./birthday-card-cover.svg?v=17');coverTexture.colorSpace=THREE.SRGBColorSpace;coverTexture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
const coverFace=plane(.57,.76,new THREE.MeshBasicMaterial({map:coverTexture}),.29,.005,0,cardCover);coverFace.rotation.x=-Math.PI/2;
const cardHome={position:card.position.clone(),quaternion:card.quaternion.clone()};
const cake=new THREE.Group();cake.position.set(.62,.99,-1.66);scene.add(cake);
cylinder(.38,.38,.035,cream,0,.02,0,cake);cylinder(.28,.29,.27,mat('#dba493'),0,.17,0,cake);cylinder(.29,.29,.045,cream,0,.32,0,cake);
for(let i=0;i<14;i++){let a=i*Math.PI*2/14;sphere(.045,cream,Math.cos(a)*.27,.305,Math.sin(a)*.27,cake,1,1.4,1);}
const flames=[];for(let i=0;i<3;i++){let x=(i-1)*.15,z=i===1?-.05:.035;cylinder(.014,.014,.18,mat(i%2?'#b58d63':'#849a86'),x,.42,z,cake);box(.004,.022,.004,edge,x,.521,z,cake);const f=sphere(.025,new THREE.MeshBasicMaterial({color:'#ff9c28',toneMapped:false}),x,.565,z,cake,.65,1.65,.65);flames.push(f);}
const candleLight=new THREE.PointLight('#ffad32',1.5,1.7,2);candleLight.position.set(.62,1.57,-1.65);scene.add(candleLight);
// Small garland along the window's upper frame.
const garlandPoints=[];for(let i=0;i<=30;i++){let x=(i/30-.5)*6.3;garlandPoints.push(new THREE.Vector3(x,3.12-.20*Math.sin(i/30*Math.PI),-3.66));}
scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(garlandPoints),new THREE.LineBasicMaterial({color:'#8f7e59'})));
for(let i=0;i<13;i++){let t=i/12;sphere(.027,basic('#ffdda0'),(t-.5)*6.3,3.12-.20*Math.sin(t*Math.PI),-3.66);}

let stage=0,busy=false,transition=null,doorOpening=false,doorAngle=0,lookYaw=0,lookPitch=0,drag=null,last=performance.now(),elapsed=0,finished=false,picked=false,atDesk=false;
const keys=new Set(),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
function syncLook(){const e=new THREE.Euler().setFromQuaternion(camera.quaternion,'YXZ');lookYaw=e.y;lookPitch=e.x;}
syncLook();
function animateCamera(position,target,duration=1.7,done){busy=true;const endCamera=camera.clone();endCamera.position.copy(position);endCamera.lookAt(target);transition={start:performance.now(),duration:(reduced?.25:duration)*1000,from:camera.position.clone(),to:position.clone(),qFrom:camera.quaternion.clone(),qTo:endCamera.quaternion.clone(),done};}
function say(text,time=4200){$('caption').textContent=text;$('caption').classList.add('visible');clearTimeout(say.timer);say.timer=setTimeout(()=>$('caption').classList.remove('visible'),time);}

function enter(){if(busy||stage!==0)return;unlockAudio();stage=1;doorOpening=true;$('intro').classList.add('leaving');setTimeout(()=>$('intro').hidden=true,750);$('navigation').hidden=false;$('touch-controls').hidden=false;animateCamera(new THREE.Vector3(.15,1.65,2.75),new THREE.Vector3(0,1.5,-2),3,()=>{stage=2;});}
let birthdayStartedFromCard=false;
function startCardMusic(){if(stage===2&&!birthdayStartedFromCard){birthdayStartedFromCard=true;startMusic();}}
function approachCard(){if(busy)return;startCardMusic();atDesk=true;animateCamera(new THREE.Vector3(-.1,1.65,-.35),new THREE.Vector3(-.45,1.0,-1.63),1.7,()=>{});}
function takeCard(){
 if(busy||picked)return;startCardMusic();picked=true;busy=true;keys.clear();cardCover.rotation.z=0;
 const from=card.position.clone(),qFrom=card.quaternion.clone();
 const ease=t=>t*t*(3-2*t);
 const start=performance.now(),openDuration=reduced?100:1400,holdDuration=reduced?0:300;
 // Open the left cover upwards and lay it flat on the desk before picking it up.
 const unfold=()=>{const time=performance.now()-start,t=Math.min(1,time/openDuration);cardCover.rotation.z=ease(t)*Math.PI;
  if(time<openDuration+holdDuration){requestAnimationFrame(unfold);return;}
  // The inner page is already visible. Bring the open card toward the camera
  // along a shallow arc; lift its pivot only as much as its rotated corners need.
  const cameraStart=camera.quaternion.clone(),view=camera.clone();view.lookAt(from.x,1.72,from.z);
  const endView=view.quaternion.clone();
  const distance=Math.max(1.1,.72/Math.max(.3,camera.aspect));
  view.updateMatrixWorld();const to=view.localToWorld(new THREE.Vector3(.20,-.04,-distance));
  const q=endView.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2));
  const moveStart=performance.now(),moveDuration=reduced?120:1200;
  const pickUp=()=>{const t=Math.min(1,(performance.now()-moveStart)/moveDuration),s=ease(t);
   camera.quaternion.slerpQuaternions(cameraStart,endView,s);
   card.position.lerpVectors(from,to,s);card.quaternion.slerpQuaternions(qFrom,q,s);
   let lowest=Infinity;
   for(const x of[-.87,.29])for(const z of[-.385,.385])for(const y of[-.006,.024]){const point=new THREE.Vector3(x,y,z).applyQuaternion(card.quaternion);lowest=Math.min(lowest,point.y);}
   card.position.y=Math.max(card.position.y,1.005-lowest);
   if(t<1)requestAnimationFrame(pickUp);else{syncLook();busy=false;$('card-dialog').showModal();}
  };
  requestAnimationFrame(pickUp);
 };
 requestAnimationFrame(unfold);
}
function returnCard(){cardCover.rotation.z=0;card.position.copy(cardHome.position);card.quaternion.copy(cardHome.quaternion);picked=false;busy=false;keys.clear();if(stage<3){stage=3;}animateCamera(new THREE.Vector3(0,1.65,-.15),new THREE.Vector3(.4,1.3,-2.4),1.2);}
function approachCake(){if(busy)return;animateCamera(new THREE.Vector3(.6,1.65,-.30),new THREE.Vector3(.62,1.30,-1.67),1.2,()=>{$('wish-dialog').showModal();keys.clear();});}
function celebrate(){if(finished)return;finished=true;stage=4;$('wish-dialog').close();flames.forEach(f=>f.visible=false);candleLight.intensity=0;show.start(elapsed);animateCamera(new THREE.Vector3(0,1.7,-.35),new THREE.Vector3(0,1.95,-19),2.2);}
$('enter').addEventListener('click',enter);
$('hotspot').addEventListener('click',()=>{if(busy)return;if(stage===0)enter();else if(stage===2){if(camera.position.distanceTo(cardHome.position)>2.2)approachCard();else takeCard();}else if(stage===3)approachCake();else if(stage===4&&show.ready)openCurtains();else if(canReplayFireworks())startFireworks();});
$('zoom-card').addEventListener('click',()=>{const enlarged=document.querySelector('.card-scroll').classList.toggle('zoomed');$('zoom-card').textContent=enlarged?'−':'+';$('zoom-card').setAttribute('aria-pressed',String(enlarged));$('zoom-card').setAttribute('aria-label',enlarged?'完整显示贺卡':'放大贺卡');});
$('close-card').addEventListener('click',()=>$('card-dialog').close());$('card-dialog').addEventListener('close',returnCard);
$('help').addEventListener('click',()=>{keys.clear();$('help-dialog').showModal();});$('close-help').addEventListener('click',()=>$('help-dialog').close());
$('blow').addEventListener('click',celebrate);

// Keyboard and touch movement share the same collision checks.
const keyMap={KeyW:'forward',ArrowUp:'forward',KeyS:'backward',ArrowDown:'backward',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'};
addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;if(keyMap[e.code]&&stage>0){e.preventDefault();keys.add(keyMap[e.code]);}});
addEventListener('keyup',e=>{keys.delete(keyMap[e.code]);});addEventListener('blur',()=>{keys.clear();drag=null;});
document.querySelectorAll('[data-move]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.move);});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(b.dataset.move));});
canvas.addEventListener('pointerdown',e=>{if(busy||document.querySelector('dialog[open]'))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.lastX,dy=e.clientY-drag.lastY;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5)drag.moved=true;if(drag.moved&&stage>0&&!busy){lookYaw-=dx*.003;lookPitch=THREE.MathUtils.clamp(lookPitch-dy*.003,-1.1,1.0);camera.quaternion.setFromEuler(new THREE.Euler(lookPitch,lookYaw,0,'YXZ'));}drag.lastX=e.clientX;drag.lastY=e.clientY;});
canvas.addEventListener('pointerup',e=>{if(drag&&!drag.moved&&!busy)interact(e.clientX,e.clientY);drag=null;});canvas.addEventListener('pointercancel',()=>drag=null);
function interact(x,y){pointer.set(x/innerWidth*2-1,-y/innerHeight*2+1);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects([doorPivot,card,cake,recordPlayer.group,roomDecor.bookshelf],true);if(!hits.length)return;let object=hits[0].object;while(object.parent&&object!==doorPivot&&object!==card&&object!==cake&&object!==recordPlayer.group&&object!==roomDecor.bookshelf)object=object.parent;if(object===roomDecor.bookshelf){openShelfBook();return;}if(object===recordPlayer.group){openRecord();return;}if(object===doorPivot&&stage===0)enter();if(object===card&&stage>=2){if(camera.position.distanceTo(card.position)>2.2){approachCard();}else takeCard();}if(object===cake){if(stage<3){say('请先查看贺卡。');}else if(!finished)approachCake();else if(canReplayFireworks()){startFireworks();}}}
function canStand(x,z){if(Math.hypot(x+2.22,z+2)<.43)return false;if(x< -4.15||x>4.15||z< -3.72||z>3.45)return false;if(x> -1.72&&x<1.72&&z> -2.69&&z< -0.78)return false;if(x>-.99&&x<-.27&&z>-.54&&z<.37)return false;if(x>2.60&&z>-1.80&&z<.51)return false;if(x>2.88&&x<3.82&&z>-2.62&&z<-1.68)return false;if(x< -3.60&&z>-1.38&&z<2.5)return false;if(x< -3.1&&z< -2.67)return false;return true;}
function move(dt){if(stage<2||busy||document.querySelector('dialog[open]'))return;let forward=(keys.has('forward')?1:0)-(keys.has('backward')?1:0),side=(keys.has('right')?1:0)-(keys.has('left')?1:0);if(!forward&&!side)return;const n=Math.hypot(forward,side),speed=dt*1.7/n;let dx=(-Math.sin(lookYaw)*forward+Math.cos(lookYaw)*side)*speed,dz=(-Math.cos(lookYaw)*forward-Math.sin(lookYaw)*side)*speed;const x=camera.position.x,z=camera.position.z;if(canStand(x+dx,z))camera.position.x+=dx;if(canStand(camera.position.x,z+dz))camera.position.z+=dz;if(!atDesk&&stage===2&&camera.position.distanceTo(cardHome.position)<2){atDesk=true;}}

// Gentle synthesized birthday music, started by the candle-blowing gesture.
let musicBus=null;
let audioContext=null,musicOn=false,musicTimer=null,musicNodes=[],musicMuted=false;
const melody=[[67,1],[67,.5],[69,1.5],[67,1.5],[72,1.5],[71,3],[67,1],[67,.5],[69,1.5],[67,1.5],[74,1.5],[72,3],[67,1],[67,.5],[79,1.5],[76,1.5],[72,1.5],[71,1.5],[69,2],[77,1],[77,.5],[76,1.5],[72,1.5],[74,1.5],[72,3]];
function scheduleMelody(){if(!musicOn)return;let t=audioContext.currentTime+.1;const beat=.35;for(const [note,dur] of melody){const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.value=440*Math.pow(2,(note-69)/12);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.10,t+.025);gain.gain.exponentialRampToValueAtTime(.001,t+dur*beat+.3);osc.connect(gain);gain.connect(musicBus);osc.onended=()=>{osc.disconnect();gain.disconnect();musicNodes=musicNodes.filter(n=>n!==osc);};osc.start(t);osc.stop(t+dur*beat+.35);musicNodes.push(osc);t+=dur*beat;}musicTimer=setTimeout(scheduleMelody,(t-audioContext.currentTime+1.2)*1000);}
function startBirthdayNow(){if(musicOn||musicMuted)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();if(!musicBus){musicBus=audioContext.createGain();musicBus.connect(audioContext.destination);}musicBus.gain.cancelScheduledValues(audioContext.currentTime);musicBus.gain.setValueAtTime(0,audioContext.currentTime);musicBus.gain.linearRampToValueAtTime(.65,audioContext.currentTime+2.8);musicOn=true;$('sound').setAttribute('aria-pressed','true');$('sound').setAttribute('aria-label','关闭生日音乐');scheduleMelody();}catch{say('可以点击右上角 ♫ 再次开启音乐。');}}
function stopMusic(){musicOn=false;clearTimeout(musicTimer);for(const node of musicNodes){try{node.stop();}catch{}}musicNodes=[];$('sound').setAttribute('aria-pressed','false');$('sound').setAttribute('aria-label','开启生日音乐');}
let trackPhase=false,trackReady=false,trackPlaying=false,trackFade=null,recordRequested=false;
let switchTimer=null,stopTimer=null,audioGeneration=0;
function getAudioContext(){audioContext??=new(window.AudioContext||window.webkitAudioContext)();return audioContext;}
const track=new BufferedTrack(getAudioContext);
function unlockAudio(){try{getAudioContext().resume().catch(()=>{});if(trackReady)track.load().catch(()=>{$('track-status').textContent='歌曲加载失败，轻点唱片重试';});}catch{say('请轻点唱片开启声音。');}}
function cancelAudioTransition(){audioGeneration++;clearTimeout(switchTimer);clearTimeout(stopTimer);switchTimer=null;stopTimer=null;return audioGeneration;}
function birthdayFade(seconds=2.5){if(!musicBus||!musicOn)return;const now=audioContext.currentTime;musicBus.gain.cancelScheduledValues(now);musicBus.gain.setValueAtTime(musicBus.gain.value,now);musicBus.gain.linearRampToValueAtTime(0,now+seconds);}
function fadeTrack(to,duration){trackFade={start:performance.now(),from:track.volume,to,duration:duration*1000};}
function recordState(){const active=recordRequested||trackPlaying;$('record-disc').setAttribute('aria-pressed',String(active));$('record-disc').setAttribute('aria-label',active?'轻点唱片淡出关闭':'轻点唱片播放');$('record-dialog').classList.toggle('playing',trackPlaying);$('sound').setAttribute('aria-pressed',String(!musicMuted&&(active||musicOn)));}
function startMusic(){if(musicMuted||musicOn)return;const token=cancelAudioTransition();recordRequested=false;if(trackPlaying){fadeTrack(0,2);stopTimer=setTimeout(()=>{if(token!==audioGeneration)return;track.pause();trackPlaying=false;recordState();switchTimer=setTimeout(()=>{if(token===audioGeneration)startBirthdayNow();},2500);},2000);}else startBirthdayNow();}
fetch('./music.json?v=6').then(r=>r.json()).then(async c=>{if(c.audio){track.src=c.audio;trackReady=true;$('track-status').textContent='轻点唱片播放 · 再点关闭';if(audioContext)track.load().catch(()=>{});}if(c.cover){$('album-art').src=c.cover;$('album-art').hidden=false;}}).catch(()=>{$('track-status').textContent='加载失败，刷新后重试';});
function playTrack(token=audioGeneration){if(!trackReady||musicMuted)return Promise.resolve();track.volume=0;return track.play().then(()=>{if(token!==audioGeneration||musicMuted){track.pause();return;}trackPlaying=true;recordRequested=true;fadeTrack(.65,8);$('track-status').textContent='正在播放 · 轻点唱片关闭';recordState();}).catch(()=>{if(token!==audioGeneration)return;recordRequested=false;recordState();$('track-status').textContent='轻点唱片重新播放';});}
function fadeBirthdayForCurtain(){const token=cancelAudioTransition();birthdayFade(2.5);stopTimer=setTimeout(()=>{if(token===audioGeneration)stopMusic();},2550);}
function startCurtainMusic(){unlockAudio();const token=cancelAudioTransition();stopMusic();trackPhase=true;if(musicMuted||trackPlaying)return;recordRequested=true;recordState();playTrack(token);}
function openCurtains(){keys.clear();show.open(elapsed);}
function transitionToTrack(){if(trackPlaying||recordRequested)return;trackPhase=true;if(musicMuted)return;recordRequested=true;const token=cancelAudioTransition();recordState();birthdayFade(2.5);$('track-status').textContent='切换中…';stopTimer=setTimeout(()=>{if(token!==audioGeneration)return;stopMusic();switchTimer=setTimeout(()=>{if(token===audioGeneration)playTrack(token);},2500);},2500);}
function fadeAll(){const token=cancelAudioTransition();recordRequested=false;birthdayFade(2);fadeTrack(0,2);$('track-status').textContent='正在淡出…';stopTimer=setTimeout(()=>{if(token!==audioGeneration)return;stopMusic();track.pause();trackPlaying=false;trackFade=null;$('track-status').textContent='已暂停 · 轻点唱片继续';recordState();},2050);recordState();}
function toggleRecord(){unlockAudio();if((recordRequested||trackPlaying)&&!(trackFade&&trackFade.to===0)){fadeAll();}else{musicMuted=false;trackPhase=true;if(musicOn)transitionToTrack();else{recordRequested=true;const token=cancelAudioTransition();recordState();playTrack(token);}}}
function openRecord(){keys.clear();recordState();$('record-dialog').showModal();}
$('sound').addEventListener('click',()=>{unlockAudio();if(!musicMuted&&(musicOn||trackPlaying||recordRequested)){musicMuted=true;fadeAll();}else{musicMuted=false;if(trackPhase){recordRequested=false;transitionToTrack();}else startMusic();}});
$('open-record').onclick=openRecord;
$('record-disc').onclick=toggleRecord;
$('close-record').onclick=()=>$('record-dialog').close();
function fireworkSound(){if(musicMuted||!audioContext)return;const t=audioContext.currentTime,buffer=audioContext.createBuffer(1,audioContext.sampleRate*1.3,audioContext.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/data.length*6);const source=audioContext.createBufferSource(),filter=audioContext.createBiquadFilter(),gain=audioContext.createGain();source.buffer=buffer;filter.type='lowpass';filter.frequency.value=240;filter.Q.value=.45;gain.gain.setValueAtTime(0,t+.18);gain.gain.linearRampToValueAtTime(.055,t+.28);gain.gain.exponentialRampToValueAtTime(.0001,t+1.4);source.connect(filter);filter.connect(gain);gain.connect(audioContext.destination);source.start(t+.18);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};}

// Fireworks are actual particles outside the window, reflected on the river.
const glowCanvas=document.createElement('canvas');glowCanvas.width=32;glowCanvas.height=32;const gc=glowCanvas.getContext('2d'),gradient=gc.createRadialGradient(16,16,0,16,16,16);gradient.addColorStop(0,'#fff');gradient.addColorStop(.25,'#ffffffcc');gradient.addColorStop(1,'#ffffff00');gc.fillStyle=gradient;gc.fillRect(0,0,32,32);const glowTexture=new THREE.CanvasTexture(glowCanvas);
const bursts=[];let fireworksUntil=0,nextBurst=0,roundActive=false,roundStarting=false,roundEnd=0,roundFading=false;const pendingBursts=[];
const fireworkColors=['#f1c676','#dd9bba','#9acacc','#efaa85','#b4b2e2'];
function canReplayFireworks(){return !roundActive&&!roundStarting&&stage===4&&show.opened&&fireworksUntil>0&&elapsed>=fireworksUntil&&pendingBursts.length===0&&bursts.length===0;}
function roundClock(){return audioContext?.currentTime??performance.now()/1000;}
async function startFireworks(){
 if(roundActive||roundStarting)return;roundStarting=true;
 const replay=show.opened;
 show.setRoomBrightness(.11,elapsed);
 if(replay){unlockAudio();const token=cancelAudioTransition();track.pause();track.offset=0;trackPlaying=false;trackPhase=true;recordRequested=!musicMuted;if(!musicMuted)await playTrack(token);}
 const duration=track.buffer?.duration||135.71;
 // First run follows the song already fading in as the curtains open.
 const remaining=replay?duration:Math.max(1,duration-(trackPlaying?track.currentTime:0));
 roundEnd=roundClock()+remaining;roundActive=true;roundStarting=false;roundFading=false;
 fireworksUntil=elapsed+remaining;nextBurst=elapsed;pendingBursts.length=0;
}
function finishFireworkRound(){
 cancelAudioTransition();roundActive=false;pendingBursts.length=0;
 for(const f of bursts){scene.remove(f.points);f.points.geometry.dispose();f.points.material.dispose();}bursts.length=0;
 track.pause();track.offset=0;trackPlaying=false;recordRequested=false;trackFade=null;recordState();$('track-status').textContent='轻点唱片播放 · 再点关闭';
 fireworksUntil=elapsed;show.setRoomBrightness(1,elapsed);
}

function burst(slot=0,totalBursts=1){
 if(slot===0)fireworkSound();const count=reduced?60:240,trail=7,total=count*trail;
 const positions=new Float32Array(total*3),colors=new Float32Array(total*3),velocities=[];
 const origin=new THREE.Vector3(totalBursts===1?(rand()-.5)*14:(slot/(totalBursts-1)-.5)*14+(rand()-.5)*1.2,3.4+rand()*3.8,-14-rand()*7);
 const hue=new THREE.Color(fireworkColors[Math.floor(rand()*fireworkColors.length)]),willow=rand()>.5;
 for(let i=0;i<count;i++){const theta=i*2.399963,vertical=1-2*(i+.5)/count,r=Math.sqrt(1-vertical*vertical),speed=1.35+rand()*.95;velocities.push(new THREE.Vector3(Math.cos(theta)*r,vertical,Math.sin(theta)*r).multiplyScalar(speed));for(let j=0;j<trail;j++){const k=(i*trail+j)*3;positions.set([origin.x,origin.y,origin.z],k);const tint=hue.clone().lerp(new THREE.Color('#fff4d2'),j===0?.65:.1).multiplyScalar((1-j/trail)*1.1);colors.set([tint.r,tint.g,tint.b],k);}}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
 const material=new THREE.PointsMaterial({map:glowTexture,vertexColors:true,size:.075,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});const points=new THREE.Points(geometry,material);points.frustumCulled=false;scene.add(points);
 bursts.push({points,velocities,age:0,origin,trail,willow});
}
function updateFireworks(dt){
 if(roundActive){const remaining=roundEnd-roundClock();fireworksUntil=elapsed+Math.max(0,remaining);if(remaining<=3&&!roundFading){roundFading=true;fadeTrack(0,Math.max(.1,remaining));}if(remaining<=0){finishFireworkRound();return;}}
 if(roundActive&&elapsed<fireworksUntil-6.5&&elapsed>nextBurst){const count=reduced?2:3+Math.floor(rand()*3);for(let i=0;i<count;i++)pendingBursts.push({at:elapsed+i*.15,slot:i,total:count});nextBurst=elapsed+(reduced?3:1.15+rand()*.55);}
 while(pendingBursts.length&&pendingBursts[0].at<=elapsed){const launch=pendingBursts.shift();burst(launch.slot,launch.total);}
 for(let b=bursts.length-1;b>=0;b--){const f=bursts[b];f.age+=dt;const p=f.points.geometry.attributes.position;
 for(let i=0;i<f.velocities.length;i++)for(let j=0;j<f.trail;j++){const t=Math.max(0,f.age-j*.055),drag=(1-Math.exp(-t*.35))/.35,v=f.velocities[i];p.setXYZ(i*f.trail+j,f.origin.x+v.x*drag,f.origin.y+v.y*drag-(f.willow?.21:.13)*t*t,f.origin.z+v.z*drag);}
 p.needsUpdate=true;f.points.material.opacity=Math.max(0,1-f.age/5.8)*(f.age>3?.8+Math.sin(f.age*25)*.2:1);
 if(f.age>5.8){scene.remove(f.points);f.points.geometry.dispose();f.points.material.dispose();bursts.splice(b,1);}}
}
function updateHotspot(){let target,label;if(stage===0){target=new THREE.Vector3(.42,1.35,4.2);label='点击打开房门';}else if(stage===2){target=cardHome.position.clone().add(new THREE.Vector3(0,.22,0));label=atDesk?'拿起贺卡':'查看贺卡';}else if(stage===3){target=new THREE.Vector3(.62,1.7,-1.66);label='许愿 · 吹灭蜡烛';}else if(stage===4&&show.ready){target=new THREE.Vector3(0,1.95,-3.55);label='拉开窗帘';}else if(canReplayFireworks()){target=new THREE.Vector3(0,1.95,-3.55);label='再放一次烟花';}else{$('hotspot').hidden=true;return;}const screen=target.clone().project(camera);const behind=target.clone().sub(camera.position).dot(camera.getWorldDirection(new THREE.Vector3()))<0;const visible=!busy&&!document.querySelector('dialog[open]')&&!behind&&Math.abs(screen.x)<.92&&Math.abs(screen.y)<.85;$('hotspot').hidden=!visible;if(visible){$('hotspot-label').textContent=label;$('hotspot').style.left=`${(screen.x*.5+.5)*innerWidth}px`;$('hotspot').style.top=`${(-screen.y*.5+.5)*innerHeight}px`;}}
function countdown(){const diff=new Date('2026-11-13T00:00:00+08:00').getTime()-Date.now();if(diff>0){const days=Math.floor(diff/86400000),hours=Math.floor(diff/3600000)%24;$('countdown').textContent=`距离 Kiko 的生日还有 ${days} 天 ${hours} 小时`;}else{$('countdown').textContent='11.13 · HAPPY BIRTHDAY, KIKO';}}
countdown();setInterval(countdown,60000);
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;elapsed+=dt;if(transition){let t=Math.min(1,(now-transition.start)/transition.duration),s=t*t*(3-2*t);camera.position.lerpVectors(transition.from,transition.to,s);camera.quaternion.slerpQuaternions(transition.qFrom,transition.qTo,s);if(t===1){const done=transition.done;transition=null;busy=false;syncLook();done?.();}}if(doorOpening){doorAngle=THREE.MathUtils.damp(doorAngle,1.5,3,dt);doorPivot.rotation.y=doorAngle;underDoor.visible=false;}move(dt);flames.forEach((f,i)=>{f.scale.y=1.65+Math.sin(elapsed*7+i)*.17;});city.update(elapsed,elapsed<fireworksUntil);roomDecor.update(elapsed);show.update(elapsed);recordPlayer.update(dt,trackPlaying);if(trackFade){const t=Math.min(1,(performance.now()-trackFade.start)/trackFade.duration);track.volume=trackFade.from+(trackFade.to-trackFade.from)*t;if(t===1)trackFade=null;}updateFireworks(dt);updateHotspot();updateBookshelfHotspot();renderer.render(scene,camera);}
requestAnimationFrame(frame);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
addEventListener('pagehide',()=>{stopMusic();track.pause();cancelAudioTransition();renderer.dispose();});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();$('error').hidden=false;});
setTimeout(()=>{$('loading').classList.add('fade');$('intro').hidden=false;setTimeout(()=>$('loading').hidden=true,750);},500);





