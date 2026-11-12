import * as T from './vendor/three.module.js';

export function buildDecor(scene){
 const group=new T.Group();scene.add(group);const balloons=[];
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.8,...extra});
 const cream=mat('#e8dfcc'),sage=mat('#82988b'),wood=mat('#8d6849'),gold=mat('#b99b67',{metalness:.5,roughness:.4});
 function box(w,h,d,m,x,y,z,p=group,r=.04){const shape=new T.Shape();shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const g=new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:Math.min(r*.35,.018),bevelThickness:Math.min(r*.35,.018),curveSegments:8});g.translate(0,0,-d/2);const m1=new T.Mesh(g,m);m1.position.set(x,y,z);m1.castShadow=true;m1.receiveShadow=true;p.add(m1);return m1;}
 function ell(r,m,x,y,z,s=[1,1,1],p=group){const a=new T.Mesh(new T.SphereGeometry(r,32,24),m);a.position.set(x,y,z);a.scale.set(...s);a.castShadow=true;p.add(a);return a;}
 function cyl(rt,rb,h,m,x,y,z,p=group){const a=new T.Mesh(new T.CylinderGeometry(rt,rb,h,40),m);a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true;p.add(a);return a;}
 function line(points,color='#8c816d',radius=.006,p=group){const c=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v)));const m=new T.Mesh(new T.TubeGeometry(c,24,radius,6,false),mat(color));p.add(m);return m;}
 function leafTexture(pink=true){const c=document.createElement('canvas');c.width=256;c.height=384;const x=c.getContext('2d');x.beginPath();x.moveTo(128,355);x.bezierCurveTo(87,285,12,240,24,115);x.bezierCurveTo(28,15,96,22,128,85);x.bezierCurveTo(158,20,231,15,233,115);x.bezierCurveTo(245,243,165,290,128,355);x.closePath();x.fillStyle=pink?'#d2d0b1':'#a4b28a';x.fill();x.save();x.clip();let n=37;const random=()=>{n=n*16807%2147483647;return(n-1)/2147483646;};for(let i=0;i<95;i++){x.fillStyle=i%3?'#91a57b88':'#b2808c99';x.beginPath();x.ellipse(random()*256,random()*384,2+random()*10,2+random()*9,random(),0,6.3);x.fill();}x.strokeStyle=pink?'#ae7d8b':'#87947b';x.lineWidth=3;x.beginPath();x.moveTo(128,355);x.quadraticCurveTo(120,200,128,86);x.stroke();for(let j=0;j<5;j++)for(const s of[-1,1]){x.lineWidth=2-j*.2;x.beginPath();x.moveTo(127,130+j*39);x.quadraticCurveTo(128+s*37,112+j*40,128+s*(88-j*11),95+j*45);x.stroke();}x.restore();const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return tex;}
 const leafMats=[false,true].map(p=>mat('#ffffff',{map:leafTexture(p),transparent:true,alphaTest:.3,side:T.DoubleSide}));
 function leaf(x,y,z,size,rz,ry,pink,p=group){const geo=new T.PlaneGeometry(size,size*1.5,10,16);const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const xx=pos.getX(i)/(size/2),yy=pos.getY(i)/(size*.75);pos.setZ(i,(1-xx*xx)*.05+(1-yy*yy)*.04);}geo.computeVertexNormals();const a=new T.Mesh(geo,leafMats[pink?1:0]);a.position.set(x,y,z);a.rotation.set(-.2,ry,rz);a.castShadow=true;p.add(a);return a;}
 function caladium(x,y,z,scale=1,hanging=false){const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(scale);group.add(g);cyl(.18,.135,.29,cream,0,.15,0,g);cyl(.165,.165,.018,mat('#665446'),0,.29,0,g);for(let i=0;i<7;i++){const a=i*2.4,r=.15+(i%3)*.035,top=.55+(i%3)*.12,xx=Math.cos(a)*r,zz=Math.sin(a)*r;line([[0,.12,0],[xx*.35,.36,zz*.35],[xx,top-.15,zz]],'#839477',.009,g);leaf(xx,top,zz,.24+(i%2)*.05,-xx*1.8,a*.45,i%2,g);}if(hanging){const yy=1.05;for(const xx of[-.16,.16])line([[xx,.1,0],[xx*1.3,.37,0],[0,yy,0]],'#bfae8b',.008,g);cyl(.015,.015,.35,gold,0,1.21,0,g);}return g;}
 // Desk bouquet. Every stem starts inside the narrow neck of the ceramic vase.
 const bouquet=new T.Group();bouquet.position.set(1.22,.985,-2.15);group.add(bouquet);
 const profile=[[0,0],[.07,0],[.105,.03],[.115,.12],[.09,.23],[.046,.28],[.046,.33]].map(p=>new T.Vector2(...p));const vase=new T.Mesh(new T.LatheGeometry(profile,48),mat('#d5c6a9',{roughness:.58}));vase.castShadow=true;bouquet.add(vase);
 const flowerMat=[mat('#efe7d5',{side:T.DoubleSide}),mat('#dfc4b5',{side:T.DoubleSide}),mat('#e5dbbf',{side:T.DoubleSide})];
 function petal(index){const geo=new T.PlaneGeometry(.10,.16,8,12),p=geo.attributes.position;for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),t=(y+.08)/.16;p.setXYZ(i,x*Math.sin(Math.PI*t)*.92,y,.035*Math.sin(t*Math.PI)-.02*t);}geo.computeVertexNormals();const mesh=new T.Mesh(geo,flowerMat[index%3]);return mesh;}
 for(let i=0;i<5;i++){const xx=Math.sin(i*2.4)*.14,zz=Math.cos(i*2.4)*.09,yy=.50+(i%3)*.085;line([[0,.10,0],[xx*.16,.30,zz*.16],[xx,yy,zz]],'#6e8063',.006,bouquet);const flower=new T.Group();flower.position.set(xx,yy,zz);flower.rotation.z=-xx*.9;bouquet.add(flower);for(let j=0;j<7;j++){const a=j*Math.PI*2/7,pe=petal(i);pe.position.set(Math.sin(a)*.028,0,Math.cos(a)*.028);pe.rotation.y=a;pe.rotation.x=-.27;flower.add(pe);}ell(.022,mat('#b49d68'),0,-.005,0,[1,.5,1],flower);for(const s of[-1,1]){const l=ell(.047,mat('#89977b'),xx*.45+s*.028,.37+(i%2)*.04,zz*.45,[.40,1.7,.12],bouquet);l.rotation.z=s*.7;}}
 // A small upholstered sofa on the right, leaving the central walking route clear.
 const sofa=new T.Group();sofa.position.set(3.35,0,-.65);sofa.rotation.y=-Math.PI/2;group.add(sofa);
 for(const x of[-.82,.82])for(const z of[-.32,.32])cyl(.025,.035,.21,wood,x,.11,z,sofa);
 box(1.90,.24,.85,sage,0,.32,0,sofa,.10);box(1.9,.65,.18,sage,0,.69,-.37,sofa,.12);
 for(const x of[-.96,.96])box(.18,.50,.93,sage,x,.57,0,sofa,.085);
 for(const x of[-.46,.46]){box(.82,.15,.68,mat('#9aaa98'),x,.48,.05,sofa,.09);box(.79,.44,.17,mat('#99a894'),x,.80,-.22,sofa,.10);}
 const pillow=box(.42,.40,.13,mat('#d5b0a6'),-.58,.83,.02,sofa,.09);pillow.rotation.z=.18;const p2=box(.43,.34,.14,cream,.62,.76,.04,sofa,.09);p2.rotation.z=-.20;
 const table=new T.Group();table.position.set(3.35,0,-2.15);group.add(table);cyl(.36,.36,.055,wood,0,.55,0,table);cyl(.035,.05,.50,gold,0,.27,0,table);cyl(.24,.25,.025,gold,0,.02,0,table);box(.22,.025,.17,cream,0,.60,.02,table,.015);cyl(.037,.04,.09,mat('#bd9f78'),.08,.66,-.05,table);
 // Left-side shelving, botanical prints and hanging planters.
 const console=new T.Group();console.position.set(-3.95,0,-.40);console.rotation.y=Math.PI/2;group.add(console);box(1.7,.055,.38,wood,0,.90,0,console,.018);for(const x of[-.72,.72])box(.04,.86,.26,wood,x,.43,0,console,.01);// Small jade plant: round fleshy leaves, distinct from the floor caladium.
 const jade=new T.Group();jade.position.set(-3.80,.93,-.85);group.add(jade);
 const jadePot=mat('#be9a7b');cyl(.105,.075,.18,jadePot,0,.09,0,jade);cyl(.097,.097,.012,mat('#5b4936'),0,.18,0,jade);
 for(let i=0;i<5;i++){const a=i*2.4,xx=Math.cos(a)*.07,zz=Math.sin(a)*.07,yy=.31+(i%3)*.055;line([[0,.12,0],[xx*.5,.23,zz*.5],[xx,yy,zz]],'#69825e',.009,jade);for(const side of[-1,1]){const l=ell(.045,mat(i%2?'#91a17a':'#728c63'),xx+side*.035,yy-.025,zz,[1,.45,1.4],jade);l.rotation.z=side*.32;}ell(.042,mat('#a6b58b'),xx,yy+.025,zz,[.65,1,.7],jade);}


 caladium(-3.52,0,-3.10,1.55);
 // Restrained birthday balloons at the edges and against the ceiling.
 const colors=['#dbc4a1','#a5b4a2','#cfa5a6','#e9ddc6'];
 function balloon(x,y,z,index,ceiling=false){const g=new T.Group();g.position.set(x,y,z);group.add(g);const balloonMat=new T.MeshPhysicalMaterial({color:colors[index%4],roughness:.31,clearcoat:.55,clearcoatRoughness:.25,metalness:index%4===0?.15:0});ell(.20,balloonMat,0,0,0,[.93,1.22,.91],g);const tie=new T.Mesh(new T.ConeGeometry(.025,.05,12),balloonMat);tie.position.y=-.255;g.add(tie);const length=ceiling?.65:1.8;line([[0,-.27,0],[.045,-length*.45,.025],[-.025,-length,0]],'#c5b292',.003,g);balloons.push({g,x,y,z,phase:index});}
 for(const side of[-1,1]){for(let i=0;i<3;i++)balloon(side*(2.36+i*.22),2.12+(i%2)*.40,-2.9+i*.04,i+(side>0?2:0));}
 [[-2.1,3.25,.6],[2.25,3.22,.1],[-1.3,3.28,2.75],[1.6,3.28,2.5],[3.55,3.22,2.7]].forEach((p,i)=>balloon(...p,i+5,true));
 // A few wrapped gifts occupy the corner rather than the table.
 for(let i=0;i<3;i++){const x=-2.65+i*.27,z=-3.00+(i%2)*.28,h=.22+i*.06,s=.32-i*.025;const m=mat(['#b6bfa8','#d4b6a7','#e4dac2'][i]);box(s,h,s,m,x,h/2,z,group,.015);box(s+.015,.035,s+.015,m,x,h+.01,z,group,.009);box(.035,h+.05,s+.03,gold,x,h/2+.01,z,group,.002);box(s+.03,h+.05,.035,gold,x,h/2+.01,z,group,.002);for(const side of[-1,1]){const bow=new T.Mesh(new T.TorusGeometry(.05,.008,6,24),gold);bow.position.set(x+side*.04,h+.055,z);bow.rotation.y=side*.5;bow.scale.set(1,.6,1);group.add(bow);}}

 // A full-height bookcase, small-scale ceiling bunting and warm reading light.
 const shelf=new T.Group();shelf.position.set(-4.12,0,1.6);shelf.rotation.y=Math.PI/2;group.add(shelf);
 box(1.35,2.55,.09,wood,0,1.28,-.19,shelf,.015);
 for(const x of[-.69,.69])box(.07,2.6,.42,wood,x,1.30,0,shelf,.015);
 for(let row=0;row<5;row++){const y=.15+row*.59;box(1.4,.055,.45,wood,0,y,0,shelf,.01);for(let j=0;j<9;j++){const h=.27+((j*7+row*3)%5)*.035;const book=box(.075,h,.23,mat(['#8f9b87','#c4b28f','#a77f6b','#686f6b','#d2c7af'][(j+row)%5]),-.54+j*.12,y+h/2+.03,.02,shelf,.003);if(j===8)book.rotation.z=.12;box(.055,.009,.005,gold,-.54+j*.12,y+.09,.139,shelf,.001);}}
 for(const z of[-1.4,1.2,2.8]){const points=[];for(let i=0;i<=24;i++)points.push([-4.2+i*.35,3.48-.23*Math.sin(i/24*Math.PI),z]);line(points,'#b4a181',.005);for(let i=0;i<15;i++){const x=-3.9+i*.55,y=3.48-.23*Math.sin((x+4.2)/8.4*Math.PI);const shape=new T.Shape();shape.moveTo(-.10,0);shape.lineTo(.10,0);shape.lineTo(0,-.22);shape.closePath();const flag=new T.Mesh(new T.ShapeGeometry(shape),mat(['#c6ad87','#a1b2a0','#d1aaa2','#eee0bb'][i%4],{side:T.DoubleSide}));flag.position.set(x,y,z);flag.rotation.y=Math.sin(i)*.25;group.add(flag);}}
 [[-3.2,3.22,1.8],[-2.7,3.24,2.5],[.5,3.27,2.8],[2.7,3.22,1.9],[3.6,3.23,.7],[-3.3,2.9,-2.1]].forEach((p,i)=>balloon(...p,i+20,true));
 cyl(.19,.24,.045,gold,3.75,.035,1.15);cyl(.018,.018,2.0,gold,3.75,1.02,1.15);cyl(.22,.38,.42,mat('#ecdbb7',{emissive:'#e4be7a',emissiveIntensity:.18}),3.75,2.10,1.15);
 const glow=new T.PointLight('#ffd9a4',3,4,2);glow.position.set(3.75,1.9,1.15);group.add(glow);
 return {bookshelf:shelf,lights:[glow],update(time){balloons.forEach(({g,x,y,z,phase})=>{g.position.set(x+Math.sin(time*.5+phase)*.012,y+Math.sin(time*.65+phase)*.015,z);g.rotation.z=Math.sin(time*.5+phase)*.025;});}};
}



