import * as T from './vendor/three.module.js';

export function buildCity(scene){
 const group=new T.Group();scene.add(group);let seed=124;const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646;};
 const basic=(color,extra={})=>new T.MeshBasicMaterial({color,...extra});
 const box=(w,h,d,m,x,y,z,parent=group)=>{const a=new T.Mesh(new T.BoxGeometry(w,h,d),typeof m==='string'?basic(m):m);a.position.set(x,y,z);parent.add(a);return a;};
 const sphere=(r,m,x,y,z,parent=group)=>{const a=new T.Mesh(new T.SphereGeometry(r,32,20),typeof m==='string'?basic(m):m);a.position.set(x,y,z);parent.add(a);return a;};
 const cyl=(rt,rb,h,m,x,y,z,parent=group,sides=40)=>{const a=new T.Mesh(new T.CylinderGeometry(rt,rb,h,sides),typeof m==='string'?basic(m):m);a.position.set(x,y,z);parent.add(a);return a;};
 function facade(cool=false){const c=document.createElement('canvas');c.width=256;c.height=768;const ctx=c.getContext('2d');ctx.fillStyle=cool?'#20354b':'#273245';ctx.fillRect(0,0,256,768);for(let y=0;y<768;y+=19){ctx.fillStyle='#111f32';ctx.fillRect(0,y+16,256,3);for(let x=7;x<256;x+=16){ctx.fillStyle=random()>.56?(random()>.28?'#dfbb79':'#9dc6d2'):'#263b52';ctx.globalAlpha=.35+random()*.6;ctx.fillRect(x,y+3,7,10);ctx.globalAlpha=1;}}for(let x=0;x<256;x+=32){ctx.fillStyle='#5c718441';ctx.fillRect(x,0,2,768);}const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;return tex;}
 const facadeMats=[false,true,false].map(c=>new T.MeshBasicMaterial({map:facade(c)}));
 const top=basic('#2e3c50');
 // Atmospheric skyline layers separate the riverbank from the distant city.
 const skyCanvas=document.createElement('canvas');skyCanvas.width=16;skyCanvas.height=512;const skyContext=skyCanvas.getContext('2d'),skyGradient=skyContext.createLinearGradient(0,0,0,512);skyGradient.addColorStop(0,'#091326');skyGradient.addColorStop(.65,'#192d44');skyGradient.addColorStop(1,'#42515c');skyContext.fillStyle=skyGradient;skyContext.fillRect(0,0,16,512);const skyMap=new T.CanvasTexture(skyCanvas);skyMap.colorSpace=T.SRGBColorSpace;const sky=new T.Mesh(new T.PlaneGeometry(150,65),basic('#ffffff',{map:skyMap,depthWrite:false}));sky.position.set(0,23,-65);group.add(sky);
 for(let layer=0;layer<2;layer++)for(let i=0;i<30;i++){const h=1.4+random()*5;box(.7+random()*1.6,h,1.2,layer?'#243b50':'#2b4054',(i-15)*2.1,h/2,-50+layer*6);}

 // The far bank is a continuous land mass: towers stand on streets and podiums.
 box(100,1.8,20,'#172b36',0,-.92,-34);box(100,.23,1.5,'#344651',0,.05,-23.45);box(100,.09,.30,'#a18458',0,.23,-22.82);
 for(let i=-40;i<=40;i++){cyl(.012,.016,.33,'#5d6770',i,.30,-22.45);sphere(.04,'#f3d293',i,.50,-22.45);}
 for(let i=0;i<45;i++){let x=(i-22)*1.0,z=-27-random()*12,h=1.3+random()*4.2,w=.65+random()*.9,d=.9+random();const m=facadeMats[i%3];box(w,h,d,[m,m,top,top,m,m],x,h/2+.19,z);box(w+random()*.8,.3,d+.45,'#263644',x,.35,z);if(i%3===0){box(w*.65,.24,d*.65,top,x,h+.28,z);box(.035,.45,.035,'#8c9a9e',x,h+.58,z);sphere(.022,'#d89478',x,h+.82,z);}}
 // Fine roof cornices and bronze-lit vertical mullions read at room scale.
 for(let i=-10;i<=10;i++){const x=i*2.1,z=-30.5-(i%3)*1.3,h=2.5+(Math.abs(i)%5)*.6;for(const side of[-1,1])box(.018,h,.018,'#79939d',x+side*.34,h/2+.2,z+.55);box(.72,.022,.04,'#d9bb81',x,h+.2,z+.55);}
 // Low waterfront blocks, trees and the lit promenade connect the composition.
 for(let i=-12;i<=12;i++){let x=i*1.7;box(1.35,.55,1.1,facadeMats[Math.abs(i)%3],x,.53,-24.2);box(1.42,.075,1.15,'#6c6e65',x,.84,-24.2);sphere(.16,'#334c45',x+.65,.65,-23.2);}
 // Oriental Pearl: tripod, lattice rings, double spheres and spire.
 const pearl=new T.Group();pearl.position.set(-5.8,.22,-26);group.add(pearl);
 cyl(.20,.37,6.9,'#5b738a',0,3.45,0,pearl);cyl(.035,.08,1.5,'#bfc4c9',0,7.55,0,pearl);
 for(const [y,r]of[[2.65,.75],[5.78,.48]]){sphere(r,'#b67e9b',0,y,0,pearl);for(let k=-2;k<=2;k++){const rr=Math.sqrt(r*r-(k*r/3)**2);const ring=new T.Mesh(new T.TorusGeometry(rr,.015,6,64),basic('#ebbbc2'));ring.rotation.x=Math.PI/2;ring.position.y=y+k*r/3;pearl.add(ring);}for(let k=0;k<12;k++){let a=k*Math.PI/6;const ring=new T.Mesh(new T.TorusGeometry(r+.007,.007,4,48),basic('#d6a1b2'));ring.rotation.y=a;ring.position.y=y;pearl.add(ring);}}
 for(let i=0;i<3;i++){const a=i*Math.PI*2/3;const bottom=new T.Vector3(Math.cos(a)*.65,.1,Math.sin(a)*.65),end=new T.Vector3(Math.cos(a)*.15,2.7,Math.sin(a)*.15);const leg=cyl(.09,.13,bottom.distanceTo(end),'#9bafbd',0,0,0,pearl);leg.position.copy(bottom.clone().add(end).multiplyScalar(.5));leg.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),end.sub(bottom).normalize());}cyl(.85,1.05,.18,'#5e6e7a',0,.1,0,pearl);
 // Shanghai Tower: a tapered, twisting glass skin with continuous floor bands.
 const tower=new T.Group();tower.position.set(5.2,.20,-29);group.add(tower);
 const vertices=[],uv=[],indices=[];const rings=65,sides=48,height=8.8;
 for(let j=0;j<=rings;j++){const t=j/rings,r=.72*(1-.58*t);for(let i=0;i<=sides;i++){const a=i/sides*Math.PI*2+t*1.15;const mod=1+.065*Math.cos(a*3);vertices.push(Math.cos(a)*r*mod,t*height,Math.sin(a)*r*mod);uv.push(i/sides,t);if(j<rings&&i<sides){let a0=j*(sides+1)+i,b=a0+sides+1;indices.push(a0,b,a0+1,b,b+1,a0+1);}}}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();const skin=new T.Mesh(geo,new T.MeshBasicMaterial({map:facadeMats[1].map,color:'#a9cbd1'}));tower.add(skin);
 for(let j=1;j<48;j++){let t=j/48;const ring=new T.Mesh(new T.TorusGeometry(.72*(1-.58*t),.008,4,48),basic(j%3?'#577e93':'#96bac8'));ring.rotation.x=Math.PI/2;ring.rotation.z=t*1.15;ring.position.y=t*height;tower.add(ring);}cyl(.23,.28,.35,'#7f9eac',0,8.86,0,tower);
 // World Financial Center, with an actual open trapezoid at its top.
 const wfc=new T.Group();wfc.position.set(2.8,.2,-28);group.add(wfc);box(.9,6.1,.7,facadeMats[1],0,3.05,0,wfc);box(.16,.85,.7,'#6a8da5',-.37,6.52,0,wfc);box(.16,.85,.7,'#6a8da5',.37,6.52,0,wfc);box(.90,.13,.7,'#b8c7c8',0,7,0,wfc);
 // Jin Mao's receding octagonal terraces.
 const jin=new T.Group();jin.position.set(.8,.2,-27.4);group.add(jin);for(let i=0;i<14;i++){const radius=.58*(1-i*.043),h=.31;const block=cyl(radius,radius,h,i%2?'#b3a37f':'#667c8d',0,.3+i*.35,0,jin,8);block.rotation.y=Math.PI/8;cyl(radius+.055,radius+.055,.035,'#c2b38e',0,.48+i*.35,0,jin,8);}cyl(.015,.10,1.25,'#d5c9a0',0,5.48,0,jin,8);
 // Layered stone embankment: masonry courses, steps, railings and warm pools of light.
 for(let course=0;course<4;course++)box(60,.025,.025,'#4c5555',0,-.88+course*.22,-22.35);
 for(let i=-28;i<=28;i++){box(.018,.85,.04,'#36484c',i*.95,-.42,-22.32);}
 for(let i=-9;i<=9;i++){const x=i*2.1;box(1.3,.07,.9,'#626968',x,.18,-23.0);for(let j=0;j<4;j++)box(.9,.06,.13,'#7b7d70',x,.08-j*.1,-22.3+j*.13);}
 // A low, detailed foreground Bund bank anchors the view at water level.
 box(100,.18,1.4,'#172d37',0,-.65,-5.3);box(100,.08,.20,'#6b776f',0,-.51,-5.92);
 for(let i=-22;i<=22;i++){const x=i*.8;cyl(.016,.021,.48,'#6a766d',x,-.25,-5.87);if(i%4===0){cyl(.025,.035,.85,'#44595c',x,-.02,-5.7);sphere(.045,'#ffe2a1',x,.43,-5.7);}}
 for(const y of[-.08,-.32])box(40,.018,.018,'#78817a',0,y,-5.87);
 // Marina pilings and a modest jetty make the ferries belong to the waterfront.
 box(2.6,.12,.65,'#64645a',-8,-.65,-8);box(.55,.12,2.2,'#64645a',-8,-.65,-6.8);for(const x of[-9.1,-8,-6.9])cyl(.045,.055,.5,'#364b50',x,-.77,-8.2);
 const waterUniforms={time:{value:0},celebration:{value:0}};
 const waterMat=new T.ShaderMaterial({uniforms:waterUniforms,vertexShader:`varying vec3 wp; void main(){wp=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 wp;uniform float time;uniform float celebration;void main(){float d=clamp((-wp.z-5.)/22.,0.,1.);vec3 col=mix(vec3(.025,.075,.105),vec3(.06,.12,.17),d);float wav=sin(wp.z*17.+sin(wp.x*4.+time)*.6+time*1.6);float glint=pow(max(0.,wav),16.);col+=vec3(.11,.20,.23)*glint*.6;for(int i=0;i<12;i++){float x=float(i)*2.4-13.2;float spread=.18+(1.-d)*.42;float offset=sin(wp.z*5.+time*.9)*.17+sin(wp.z*13.-time*.6)*.08;float stripe=exp(-pow((wp.x-x+offset)/spread,2.));float v=(.3+.7*pow(max(0.,sin(wp.z*23.+float(i)*8.+time*2.)),4.));float depth=pow(d,1.5);vec3 lightColor=mod(float(i),3.)<1.?vec3(.35,.52,.60):vec3(.67,.45,.20);col+=stripe*v*depth*lightColor*.75;col+=exp(-pow((wp.x-x)/.85,2.))*depth*lightColor*.035;}col+=vec3(.035,.06,.075)*pow(max(0.,sin(wp.z*41.+sin(wp.x*8.-time)*1.2+time*2.1)),22.);col+=celebration*glint*vec3(.13,.06,.10);gl_FragColor=vec4(col,1.);}`});
 const river=new T.Mesh(new T.PlaneGeometry(100,55,1,1),waterMat);river.rotation.x=-Math.PI/2;river.position.set(0,-1,-21);group.add(river);
 // Two small moving ferries, with cabin glazing, rails, deck lights and wakes.
 function ferry(x,z,scale,color){const g=new T.Group();g.position.set(x,-.94,z);g.scale.setScalar(scale);group.add(g);const hull=new T.Shape();hull.moveTo(-1.3,-.18);hull.lineTo(.95,-.18);hull.quadraticCurveTo(1.45,-.1,1.5,.05);hull.lineTo(1.15,.18);hull.lineTo(-1.3,.18);hull.closePath();const mesh=new T.Mesh(new T.ExtrudeGeometry(hull,{depth:.20,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035}),basic('#d9d7c4'));mesh.rotation.x=-Math.PI/2;mesh.position.y=.01;g.add(mesh);box(1.85,.30,.55,color,-.1,.34,0,g);box(1.7,.04,.65,'#d7d0b0',-.1,.51,0,g);box(1.25,.22,.48,'#c9bba0',-.15,.64,0,g);box(1.4,.04,.58,'#d7d0b0',-.15,.77,0,g);for(let i=0;i<8;i++)for(const side of[-1,1]){box(.11,.15,.012,'#f6d991',-.86+i*.21,.35,side*.28,g);if(i<6)box(.11,.13,.012,'#f5d796',-.70+i*.21,.64,side*.245,g);}for(let i=0;i<10;i++)for(const side of[-1,1])cyl(.006,.006,.12,'#b6b8ae',-1.1+i*.25,.27,side*.31,g);cyl(.014,.014,.6,'#a9b5b6',.75,.73,0,g);sphere(.025,'#d0b77a',.75,1.04,0,g);const wake=new T.Mesh(new T.PlaneGeometry(4,.6),basic('#819d9c',{transparent:true,opacity:.14,depthWrite:false}));wake.rotation.x=-Math.PI/2;wake.position.set(-3.1,.005,0);g.add(wake);return{g,x,z,speed:.17+random()*.12};}
 const ferries=[ferry(-4,-13.0,.60,'#354e65'),ferry(5,-18,.48,'#725c47')];ferries[1].g.rotation.y=Math.PI;
 sphere(.45,'#ddd7bd',11,11,-48);
 const stars=[];for(let i=0;i<120;i++)stars.push((random()-.5)*80,6+random()*25,-48-random()*15);const sg=new T.BufferGeometry();sg.setAttribute('position',new T.Float32BufferAttribute(stars,3));group.add(new T.Points(sg,new T.PointsMaterial({color:'#e2e5dd',size:.025,transparent:true,opacity:.52})));
 return {update(time,celebrating){waterUniforms.time.value=time;waterUniforms.celebration.value=celebrating?1:0;ferries.forEach((f,i)=>{f.g.position.x=((f.x+time*f.speed*(i?-1:1)+20)%40+40)%40-20;f.g.position.y=-.94+Math.sin(time*1.3+i)*.009;});}};
}

