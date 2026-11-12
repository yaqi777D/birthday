import * as T from './vendor/three.module.js';

// Simplified silhouettes, composed for the room view rather than a scale city map.
export function addRiverfrontLandmarks(parent,facades){
 const all=new T.Group();all.name='riverfront-landmarks';parent.add(all);
 const mat=color=>new T.MeshBasicMaterial({color});
 const roof=mat('#354658'),stone=mat('#657482'),glass=mat('#30495e');
 const edge=mat('#89928f'),warm=mat('#a59978');
 const box=(p,w,h,d,m,x=0,y=0,z=0)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);p.add(o);return o;};
 const lines=(p,points,color)=>{const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(points,3));p.add(new T.LineSegments(geo,new T.LineBasicMaterial({color})));};
 const group=(name,x,z)=>{const g=new T.Group();g.name=name;g.position.set(x,.2,z);all.add(g);return g;};

 // International Convention Center: a low arcade with two unequal glass globes.
 const hall=group('international-convention-center',-6.9,-24.25);
 box(hall,4.25,.74,1.05,stone,0,.37);
 box(hall,4.34,.065,1.12,edge,0,.76);
 box(hall,4.42,.10,1.18,roof,0,.05);
 const arch=new T.Shape();arch.moveTo(-.13,0);arch.lineTo(-.13,.31);arch.absarc(0,.31,.13,Math.PI,0,true);arch.lineTo(.13,0);arch.closePath();
 const archGeo=new T.ShapeGeometry(arch,10);
 for(let i=0;i<13;i++){
  const x=-1.93+i*.322;
  const a=new T.Mesh(archGeo,glass);a.position.set(x,.16,.531);hall.add(a);
  box(hall,.025,.57,.035,edge,x-.155,.39,.55);
 }
 for(const [x,r]of[[-1.5,.49],[1.42,.62]]){
  const center=.84+r*.32;
  const globe=new T.Mesh(new T.SphereGeometry(r,32,20,0,Math.PI*2,0,Math.PI*.66),glass);
  globe.position.set(x,center,0);hall.add(globe);
  const ribs=[];
  const pt=(t,a)=>[x+(r+.004)*Math.sin(t)*Math.cos(a),center+(r+.004)*Math.cos(t),(r+.004)*Math.sin(t)*Math.sin(a)];
  for(let i=0;i<16;i++)for(let j=0;j<20;j++)ribs.push(...pt(j/20*Math.PI*.66,i*Math.PI/8),...pt((j+1)/20*Math.PI*.66,i*Math.PI/8));
  for(let j=1;j<=7;j++)for(let i=0;i<48;i++)ribs.push(...pt(j/7*Math.PI*.66,i/48*Math.PI*2),...pt(j/7*Math.PI*.66,(i+1)/48*Math.PI*2));
  lines(hall,ribs,'#748d99');
 }

 // Aurora: rounded glass shaft, restrained champagne bands rather than a bright gold block.
 const aurora=group('aurora-plaza',8.25,-26.65);
 const skin=facades[0].clone();skin.color.set('#f2eee4');
 const body=new T.Mesh(new T.CylinderGeometry(.58,.58,3.62,48),[skin,roof,roof]);body.position.y=1.81;body.scale.z=.82;aurora.add(body);
 box(aurora,1.58,.31,1.15,facades[0],0,.155);
 const bands=[];
 for(let j=1;j<27;j++)for(let i=0;i<48;i++)for(const a of[i/48*Math.PI*2,(i+1)/48*Math.PI*2])bands.push(.584*Math.cos(a),j*3.62/27,.479*Math.sin(a));
 for(let i=0;i<16;i++){const a=i*Math.PI/8;bands.push(.584*Math.cos(a),.30,.479*Math.sin(a),.584*Math.cos(a),3.62,.479*Math.sin(a));}
 lines(aurora,bands,'#687680');
 for(const y of[3.48,3.63]){const ring=new T.Mesh(new T.TorusGeometry(.585,.022,6,48),warm);ring.rotation.x=Math.PI/2;ring.scale.y=.82;ring.position.y=y;aurora.add(ring);}

 // IFC: paired chamfered glass towers with sloping crowns and a common podium.
 const ifc=group('ifc-twin-towers',-1.65,-30.3);
 box(ifc,2.55,.40,1.5,facades[1],0,.20);
 for(const [x,h,w]of[[-.69,4.35,.94],[.64,5.05,1.02]]){
  const outline=[[-.5,-.34],[-.34,-.5],[.34,-.5],[.5,-.34],[.5,.34],[.34,.5],[-.34,.5],[-.5,.34]];
  const points=[],uv=[],indices=[],ribs=[];
  for(let i=0;i<8;i++){
   const a=outline[i],b=outline[(i+1)%8];const n=points.length/3;
   const topA=h+a[0]*.42,topB=h+b[0]*.42;
   points.push(a[0]*w,0,a[1],b[0]*w,0,b[1],b[0]*w,topB,b[1],a[0]*w,topA,a[1]);
   uv.push(0,0,1,0,1,1,0,1);indices.push(n,n+2,n+1,n,n+3,n+2);
   ribs.push(x+a[0]*w,0,a[1],x+a[0]*w,topA,a[1]);
   ribs.push(x+a[0]*w,topA,a[1],x+b[0]*w,topB,b[1]);
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
  const mesh=new T.Mesh(g,facades[1]);mesh.position.x=x;ifc.add(mesh);
  // Cap the inclined crown so it remains a solid building from every view.
  const capPoints=[];for(let i=1;i<7;i++)for(const k of[0,i,i+1]){const p=outline[k];capPoints.push(x+p[0]*w,h+p[0]*.42,p[1]);}
  const capGeo=new T.BufferGeometry();capGeo.setAttribute('position',new T.Float32BufferAttribute(capPoints,3));capGeo.computeVertexNormals();const capMat=roof.clone();capMat.side=T.DoubleSide;ifc.add(new T.Mesh(capGeo,capMat));
  lines(ifc,ribs,'#718494');
 }
 // Two quieter secondary silhouettes inspired by the reference, not scale replicas.
 const domeTower=group('domed-riverfront-tower',-9.15,-29.1);
 box(domeTower,1.12,3.32,1.02,facades[0],0,1.66);
 for(let i=0;i<9;i++)box(domeTower,1.17,.035,1.07,stone,0,.35+i*.36);
 box(domeTower,.92,.35,.86,facades[0],0,3.48);
 const dome=new T.Mesh(new T.SphereGeometry(.49,24,12,0,Math.PI*2,0,Math.PI/2),glass);dome.position.y=3.66;dome.scale.y=.85;domeTower.add(dome);
 const domeRibs=[];for(let i=0;i<12;i++)for(let j=0;j<12;j++)for(const t of[j/12*Math.PI/2,(j+1)/12*Math.PI/2]){const a=i*Math.PI/6;domeRibs.push(.494*Math.sin(t)*Math.cos(a),3.66+.42*Math.cos(t),.494*Math.sin(t)*Math.sin(a));}lines(domeTower,domeRibs,'#849295');
 box(domeTower,.025,.22,.025,edge,0,4.16);
 const crownTower=group('crowned-riverfront-tower',-3.95,-27.15);
 box(crownTower,.82,2.6,.82,facades[0],0,1.3);
 box(crownTower,.66,.45,.66,facades[0],0,2.82);
 const crown=new T.Mesh(new T.CylinderGeometry(.51,.30,.15,12),stone);crown.position.y=3.13;crownTower.add(crown);
 const cap=new T.Mesh(new T.ConeGeometry(.51,.13,12),roof);cap.position.y=3.27;crownTower.add(cap);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;box(crownTower,.018,.22,.018,edge,Math.cos(a)*.29,3.02,Math.sin(a)*.29);}
 box(crownTower,.018,.30,.018,edge,0,3.45);
 return all;
}
