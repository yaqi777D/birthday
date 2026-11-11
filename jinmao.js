import * as T from './vendor/three.module.js';

// Stylized room-scale silhouette, informed by SOM's Jinmao Tower photographs:
// https://www.som.com/projects/jin-mao-tower/
export function createJinMao(){
 const tower=new T.Group();tower.name='Jin Mao Tower';
 const metal=new T.MeshBasicMaterial({color:'#9ba9af'});
 const dark=new T.MeshBasicMaterial({color:'#344656'});
 const crownMetal=new T.MeshBasicMaterial({color:'#c1b292'});
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#253b50';ctx.fillRect(0,0,512,256);
 // One texture wraps eight faces; consistent floor spacing across every setback.
 for(let face=0;face<8;face++)for(let col=0;col<5;col++)for(let row=0;row<8;row++){
  const lit=(face*19+col*7+row*13)%11;
  ctx.fillStyle=lit<3?'#b9a47d':lit===4?'#7e9fac':'#344b60';
  ctx.fillRect(face*64+5+col*11,row*32+5,7,20);
 }
 ctx.fillStyle='#83929a';for(let face=0;face<8;face++)ctx.fillRect(face*64,0,2,256);
 ctx.fillStyle='#60717e';for(let row=0;row<8;row++)ctx.fillRect(0,row*32,512,2);
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 texture.wrapT=T.RepeatWrapping;texture.anisotropy=4;
 const fine=[],lit=[];
 function segment(a,b,bright=false){(bright?lit:fine).push(...a,...b);}
 function prism(radius,height,y,material){const mesh=new T.Mesh(new T.CylinderGeometry(radius,radius,height,8,1),material);mesh.position.y=y;mesh.rotation.y=Math.PI/8;tower.add(mesh);return mesh;}
 function ring(radius,y,bright=false){for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4,b=a+Math.PI/4;segment([Math.sin(a)*radius,y,Math.cos(a)*radius],[Math.sin(b)*radius,y,Math.cos(b)*radius],bright);}}
 prism(.72,.16,.08,dark);prism(.65,.10,.21,metal);
 // Long lower sections, increasingly close setbacks toward the crown.
 const heights=[.86,.71,.61,.53,.46,.40,.34,.29,.24,.20,.16,.13];
 let base=.26;
 heights.forEach((height,i)=>{
  const radius=.60-i*.029;
  const map=texture.clone();map.needsUpdate=true;map.repeat.y=height/.64;map.offset.y=base/.64;
  const glass=new T.MeshBasicMaterial({map,color:'#d3dce0'});
  const body=prism(radius,height,base+height/2,[glass,metal,dark]);body.name=`shaft-${i}`;
  // Slim projecting corners and recessed intermediate mullions, not broad gold disks.
  for(let corner=0;corner<8;corner++){
   const a=Math.PI/8+corner*Math.PI/4;
   const fin=new T.Mesh(new T.BoxGeometry(.025,height+.025,.025),metal);
   fin.position.set(Math.sin(a)*(radius+.012),base+height/2,Math.cos(a)*(radius+.012));fin.rotation.y=a;tower.add(fin);
   const b=a+Math.PI/4;
   for(const t of [.25,.5,.75]){
    const x=(Math.sin(a)*(1-t)+Math.sin(b)*t)*radius,z=(Math.cos(a)*(1-t)+Math.cos(b)*t)*radius;
    segment([x,base,z],[x,base+height,z]);
   }
  }
  for(let y=base+.08;y<base+height-.025;y+=.08)ring(radius+.002,y);
  prism(radius+.019,.025,base+height-.012,metal);
  ring(radius+.021,base+height,i>6);
  base+=height;
 });
 // An open, tapering lantern, with visible ribs rather than a long solid cone.
 const crownBase=base;
 for(let level=0;level<5;level++){
  const r=.265-level*.038,y=crownBase+level*.12;
  prism(r,.035,y,crownMetal);ring(r,y+.018,true);
  if(level<4)for(let i=0;i<8;i++){
   const a=Math.PI/8+i*Math.PI/4,r2=r-.038;
   segment([Math.sin(a)*r,y,Math.cos(a)*r],[Math.sin(a)*r2,y+.12,Math.cos(a)*r2],true);
  }
 }
 prism(.065,.22,crownBase+.48,crownMetal);
 const spire=new T.Mesh(new T.CylinderGeometry(.006,.035,.48,8),metal);spire.position.y=crownBase+.80;tower.add(spire);
 for(const [points,color] of [[fine,'#718590'],[lit,'#d9c69b']]){
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(points,3));
  tower.add(new T.LineSegments(geometry,new T.LineBasicMaterial({color,transparent:true,opacity:.8})));
 }
 return tower;
}
