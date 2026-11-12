import * as T from './vendor/three.module.js';

// One continuous tapered glass body with a real trapezoidal opening.
export function createSWFC(facade){
 const tower=new T.Group();tower.name='Shanghai World Financial Center';
 const height=7.20,halfWidth=y=>.69-.18*y/height,depth=y=>.37-.17*y/height;
 const outline=new T.Shape();outline.moveTo(-.69,0);outline.lineTo(.69,0);outline.lineTo(.51,height);outline.lineTo(-.51,height);outline.closePath();
 const opening=new T.Path();opening.moveTo(-.255,6.25);opening.lineTo(-.37,6.98);opening.lineTo(.37,6.98);opening.lineTo(.255,6.25);opening.closePath();outline.holes.push(opening);
 const geo=new T.ExtrudeGeometry(outline,{depth:1,bevelEnabled:false,steps:1});
 const p=geo.attributes.position,uv=geo.attributes.uv;
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  p.setZ(i,(z*2-1)*depth(y));uv.setXY(i,(x+.69)/1.38,y/height);
 }
 geo.computeVertexNormals();
 const material=facade.clone();material.color.set('#e3edf2');
 const body=new T.Mesh(geo,material);body.name='continuous-glass-body';tower.add(body);
 const frame=[],grid=[];
 const line=(out,x1,y1,x2,y2,side=1)=>out.push(x1,y1,side*(depth(y1)+.004),x2,y2,side*(depth(y2)+.004));
 for(const side of[-1,1]){
  for(const sign of[-1,1])line(frame,sign*.69,0,sign*.51,height,side);
  line(frame,-.51,height,.51,height,side);
  const corners=[[-.255,6.25],[-.37,6.98],[.37,6.98],[.255,6.25]];
  corners.forEach((a,i)=>{const b=corners[(i+1)%4];line(frame,...a,...b,side);});
  for(let row=1;row<65;row++){
   const y=row*height/65,w=halfWidth(y);
   if(y>6.25&&y<6.98){const gap=.255+(y-6.25)/.73*.115;line(grid,-w,y,-gap,y,side);line(grid,gap,y,w,y,side);}
   else line(grid,-w,y,w,y,side);
  }
  for(let col=1;col<10;col++){
   const t=col/10*2-1;
   line(grid,t*.69,0,t*halfWidth(6.24),6.24,side);
  }
  // Slightly brighter observation floor is part of the body, below the aperture.
  line(frame,-halfWidth(6.20),6.20,halfWidth(6.20),6.20,side);
 }
 for(const [points,color]of[[grid,'#536e83'],[frame,'#92a8ba']]){
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));tower.add(new T.LineSegments(g,new T.LineBasicMaterial({color})));
 }
 return tower;
}
