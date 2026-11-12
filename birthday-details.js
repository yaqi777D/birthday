import * as T from './vendor/three.module.js';
const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.62});
function mesh(g,m,p,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;}
function box(p,w,h,d,m,x=0,y=0,z=0){return mesh(new T.BoxGeometry(w,h,d),m,p,x,y,z);}
function tube(p,points,r,m){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),40,r,7,false),m,p);}
function canvasMap(draw,w=768,h=512){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
export function addBirthdayDetails(scene,door,cake){
 const ivory=mat('#fff0d8'),gold=mat('#bd985a'),wood=mat('#74503a');
 // Small tent calendar sits at the rear-left, behind the card's unfolding footprint.
 const calendar=new T.Group();calendar.name='lunar-calendar';calendar.position.set(-1.16,.98,-2.30);scene.add(calendar);
 box(calendar,.38,.018,.23,wood,0,.009,0);
 let frontSupport;
 for(const side of [-1,1]){const support=box(calendar,.35,.31,.016,wood,0,.16,side*.055);support.rotation.x=-side*.36;if(side===1)frontSupport=support;}
 // Mount paper in the front board local coordinates: both surfaces stay parallel.
 const paper=new T.Group();paper.position.set(0,0,.014);frontSupport.add(paper);
 box(paper,.33,.29,.009,ivory);
 const date=canvasMap((x,w,h)=>{x.fillStyle='#fbf1dc';x.fillRect(0,0,w,h);x.textAlign='center';x.fillStyle='#8c6a51';x.font='30px Georgia';x.fillText('2026 · NOVEMBER',w/2,80);x.fillStyle='#755b43';x.font='66px "Microsoft YaHei",sans-serif';x.fillText('十月初六',w/2,230);x.fillStyle='#a35e4e';x.font='42px Georgia';x.fillText('11 / 14',w/2,340);x.strokeStyle='#c7ad82';x.beginPath();x.moveTo(100,390);x.lineTo(w-100,390);x.stroke();});
 const dateFace=mesh(new T.PlaneGeometry(.315,.275),new T.MeshBasicMaterial({map:date}),paper,0,0,.006);dateFace.name='calendar-date-face';
 for(const x of [-.11,.11]){const ring=mesh(new T.TorusGeometry(.019,.004,8,20),gold,calendar,x,.31,0);ring.rotation.y=Math.PI/2;}
 // Layered oval brass surround, inset enamel and small engraved flourishes.
 const plaque=new T.Group();plaque.position.set(.94,2.04,.115);door.add(plaque);
 for(const [w,h,z,c] of [[.80,.36,0,'#5d4633'],[.75,.32,.012,'#b39761'],[.69,.265,.025,'#e8d8b5']]){
  const face=mesh(new T.SphereGeometry(1,48,24),mat(c),plaque,0,0,z);face.scale.set(w/2,h/2,.018);
 }
 const name=canvasMap((x,w,h)=>{x.fillStyle='#e8d8b5';x.fillRect(0,0,w,h);x.fillStyle='#594735';x.textAlign='center';x.textBaseline='middle';x.font='italic 148px Georgia';x.fillText('Kiko',w/2,h/2);x.strokeStyle='#a78b58';x.lineWidth=3;for(const y of [65,h-65]){x.beginPath();x.moveTo(190,y);x.quadraticCurveTo(w/2,y-18,w-190,y);x.stroke();}},768,320);
 mesh(new T.PlaneGeometry(.52,.20),new T.MeshBasicMaterial({map:name}),plaque,0,0,.048);
 for(const x of [-.345,.345])mesh(new T.SphereGeometry(.012,12,8),gold,plaque,x,0,.025);
 // Cream piping on a softly rounded cake, with berry accents and fine plate rims.
 const frosting=mat('#fff3df'),pink=mat('#d9ab9e'),red=mat('#a64038'),leaf=mat('#69845c');
 const profile=[[0,.035],[.275,.035],[.293,.052],[.296,.10],[.294,.275],[.284,.31],[.265,.328],[0,.328]].map(v=>new T.Vector2(...v));
 mesh(new T.LatheGeometry(profile,64),pink,cake);
 mesh(new T.CylinderGeometry(.282,.282,.018,64),frosting,cake,0,.323,0);
 mesh(new T.CylinderGeometry(.365,.365,.024,64),ivory,cake,0,.015,0);
 for(const [r,y] of [[.35,.03],[.302,.065]]){const ring=mesh(new T.TorusGeometry(r,.005,8,64),gold,cake,0,y,0);ring.rotation.x=Math.PI/2;}
 for(let i=0;i<22;i++){
  const a=i/22*Math.PI*2,x=Math.cos(a)*.265,z=Math.sin(a)*.265,points=[];
  for(let j=0;j<=22;j++){const t=j/22,b=t*Math.PI*3.5,r=.027*(1-t);points.push(new T.Vector3(x+Math.cos(b)*r,.34+t*.042,z+Math.sin(b)*r));}
  tube(cake,points,.009,frosting);
  const bead=mesh(new T.SphereGeometry(.017,12,8),frosting,cake,Math.cos(a)*.287,.055,Math.sin(a)*.287);bead.scale.y=.7;
 }
 for(let i=0;i<5;i++){
  const a=i/5*Math.PI*2+.4,x=Math.cos(a)*.20,z=Math.sin(a)*.20;
  const berry=mesh(new T.SphereGeometry(.032,20,14),red,cake,x,.37,z);berry.scale.set(1,1.3,1);
  for(let j=0;j<3;j++){const l=mesh(new T.SphereGeometry(.015,12,8),leaf,cake,x+Math.cos(j*2.1)*.012,.407,z+Math.sin(j*2.1)*.012);l.scale.set(1,.18,.45);l.rotation.y=-j*2.1;}
 }
 // Whole-frame interaction targets; pictures are square and never cropped.
 const frames=[];
 for(let i=0;i<2;i++){
  const f=new T.Group();f.position.set(4.40,2.18,i*1.25);f.rotation.y=-Math.PI/2;f.userData.gallery=i;scene.add(f);frames.push(f);
  box(f,.87,.87,.055,wood);box(f,.80,.80,.018,gold,0,0,.033);box(f,.76,.76,.012,ivory,0,0,.047);
  const tex=new T.TextureLoader().load('./assets/gallery/'+(i?'blue-cake.jpg':'birthday.png'));tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;
  mesh(new T.PlaneGeometry(.69,.69),new T.MeshBasicMaterial({map:tex}),f,0,0,.055);
 }
 return {frames,calendar,plaque};
}
