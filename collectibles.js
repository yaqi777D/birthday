import * as T from './vendor/three.module.js';
const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),im=ctx.createImageData(128,128);for(let i=0;i<im.data.length;i+=4){const n=140+Math.random()*70;im.data[i]=im.data[i+1]=im.data[i+2]=n;im.data[i+3]=255;}ctx.putImageData(im,0,0);const fuzz=new T.CanvasTexture(c);fuzz.wrapS=fuzz.wrapT=T.RepeatWrapping;fuzz.repeat.set(5,5);
const fur=color=>new T.MeshPhysicalMaterial({color,roughness:1,sheen:.8,sheenColor:new T.Color('#ffedd4'),sheenRoughness:.9,bumpMap:fuzz,bumpScale:.012});
const plain=color=>new T.MeshStandardMaterial({color,roughness:.7});
function ell(p,r,m,x,y,z,s=[1,1,1]){const a=new T.Mesh(new T.SphereGeometry(r,40,28),m);a.position.set(x,y,z);a.scale.set(...s);a.castShadow=true;a.receiveShadow=true;p.add(a);return a;}
function stitch(p,points){const curve=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v)));p.add(new T.Mesh(new T.TubeGeometry(curve,16,.006,6,false),plain('#675245')));}
export const collectibleNames={puppy:'奶油垂耳小狗',bear:'生日帽小熊'};
export function createCollectible(kind='bear'){
 const g=new T.Group(),dog=kind==='puppy';const skin=fur(dog?'#d8c6a4':'#b88e69'),cream=fur('#eadfc7'),ear=fur(dog?'#b8a184':'#b88e69'),ink=new T.MeshPhysicalMaterial({color:'#3f352e',roughness:.3,clearcoat:.5});
 ell(g,.43,skin,0,.55,0,[.91,1.03,.80]);
 for(const side of[-1,1]){const arm=ell(g,.20,skin,side*.38,.55,.02,[.65,1.1,.76]);arm.rotation.z=side*.28;ell(g,.18,skin,side*.24,.17,.20,[1,.78,1.25]);ell(g,.113,cream,side*.24,.19,.37,[.80,.65,.18]);}
 ell(g,.49,skin,0,1.18,.015,[1,1,.84]);
 if(dog){for(const side of[-1,1]){const e=ell(g,.23,ear,side*.43,1.15,.005,[.65,1.7,.55]);e.rotation.z=side*.10;}}
 else{for(const side of[-1,1]){ell(g,.17,skin,side*.36,1.55,-.03);ell(g,.108,cream,side*.36,1.57,.095,[1,1,.25]);}}
 ell(g,.215,cream,0,1.04,.382,[1,.70,.55]);
 for(const side of[-1,1]){ell(g,.031,ink,side*.17,1.25,.398,[.80,1,.50]);ell(g,.007,plain('#fff4d9'),side*.17-.006,1.262,.414,[1,1,.30]);}
 ell(g,.048,ink,0,1.105,.505,[1,.70,.45]);stitch(g,[[0,1.075,.503],[0,1.025,.501],[-.045,1.01,.489]]);stitch(g,[[0,1.025,.501],[.045,1.01,.489]]);
 ell(g,.075,fur('#d7b3a4'),-.31,1.08,.34,[.65,.25,.12]);ell(g,.075,fur('#d7b3a4'),.31,1.08,.34,[.65,.25,.12]);
 ell(g,.27,cream,0,.51,.31,[.9,1.02,.15]);
 if(!dog){const hatMat=plain('#b58f87'),hat=new T.Mesh(new T.ConeGeometry(.185,.43,40),hatMat);hat.position.set(.03,1.86,0);hat.rotation.z=-.11;hat.castShadow=true;g.add(hat);ell(g,.065,cream,.055,2.08,0);const rim=new T.Mesh(new T.TorusGeometry(.183,.018,8,40),cream);rim.rotation.x=Math.PI/2;rim.position.set(.005,1.65,0);g.add(rim);for(let i=0;i<8;i++){const a=i*2.4,y=1.71+(i%3)*.08,r=(2.08-y)/.43*.185;ell(g,.014,plain('#e4d4aa'),.03+Math.cos(a)*r,y,Math.sin(a)*r);}}
 else{const ribbon=plain('#74897a');const collar=new T.Mesh(new T.TorusGeometry(.235,.018,8,40),ribbon);collar.rotation.x=Math.PI/2;collar.position.set(0,.83,0);g.add(collar);for(const side of[-1,1]){const bow=ell(g,.07,ribbon,side*.06,.82,.225,[1,.6,.25]);bow.rotation.z=side*.25;}ell(g,.025,ribbon,0,.82,.24);}
 return g;
}
