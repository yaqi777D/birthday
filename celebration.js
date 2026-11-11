import * as T from './vendor/three.module.js';

// One clock drives lighting, curtain movement and the musical transition.
export function createCelebration(scene, lights, hooks) {
  const curtains=[];
  const material=new T.MeshStandardMaterial({color:'#c8ba94',roughness:1,side:T.DoubleSide});
  for(const side of [-1,1]){
    const g=new T.PlaneGeometry(3.38,2.78,100,12);
    const p=g.attributes.position;
    for(let i=0;i<p.count;i++)p.setZ(i,Math.cos(p.getX(i)*30)*.065);
    g.computeVertexNormals();
    const mesh=new T.Mesh(g,material);mesh.position.set(side*1.67,1.86,-3.57);mesh.castShadow=true;scene.add(mesh);curtains.push({mesh,side});
  }
  const panel=document.createElement('div');panel.id='birthday-writing';panel.setAttribute('aria-label','Happy Birthday');document.body.append(panel);
  fetch('./birthday-writing.svg?v=4').then(r=>r.text()).then(svg=>panel.innerHTML=svg);
  let start=null,fadeStarted=false,ready=false,openingAt=null,fired=false,done=false;
  let lightFade=null;
  const base=lights.map(l=>l.intensity);
  const ease=x=>{x=T.MathUtils.clamp(x,0,1);return x*x*(3-2*x);};
  return {
    setRoomBrightness(value,time){lightFade={start:time,from:lights.map(l=>l.intensity),to:value};},
    get ready(){return ready&&openingAt===null;},
    get opened(){return done;},
    start(time){start=time;fadeStarted=false;ready=false;openingAt=null;fired=false;done=false;panel.classList.remove('write');panel.style.opacity=0;},
    open(time){if(!ready||openingAt!==null)return false;openingAt=time;hooks.openMusic();return true;},
    update(time){if(lightFade){const f=ease((time-lightFade.start)/2.5);lights.forEach((l,i)=>l.intensity=lightFade.from[i]+(base[i]*lightFade.to-lightFade.from[i])*f);if(f===1)lightFade=null;}if(start===null||done)return;const t=time-start;
      const brightness=1-ease(t/2)*.89;
      lights.forEach((l,i)=>l.intensity=base[i]*brightness);
      // Lettering finishes near 7.6 s; hold the full message until 11 s.
      if(t>=2){panel.classList.add('write');panel.style.opacity=String(ease((t-2)/.5)*(1-ease((t-11)/2)));}
      if(t>=11&&!fadeStarted){fadeStarted=true;hooks.fadeBirthday();}
      if(t>=17&&!ready){ready=true;hooks.ready();}
      if(openingAt===null)return;
      const opening=time-openingAt,progress=ease(opening/8);
      curtains.forEach(({mesh,side})=>{mesh.scale.x=1-progress*.86;mesh.position.x=side*(1.67+progress*1.45);});
      if(opening>=9&&!fired){fired=true;hooks.fireworks();}
      if(opening>=9){panel.style.opacity=0;done=true;hooks.done();}
    }};
}

export function createRecordPlayer(scene){
 const group=new T.Group();group.position.set(-3.72,.97,.1);group.rotation.y=Math.PI/2;scene.add(group);
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.5});
 const box=(w,h,d,c,x,y,z)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),mat(c));o.position.set(x,y,z);group.add(o);return o;};
 box(.78,.13,.55,'#654733',0,0,0);box(.72,.02,.50,'#b19a70',0,.075,0);
 const record=new T.Group();group.add(record);record.position.set(-.09,.096,0);
 function disc(r,h,c){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,64),mat(c));record.add(o);return o;}
 disc(.215,.012,'#242321');disc(.065,.014,'#b99078');disc(.012,.026,'#b5a57c');
 for(let i=0;i<15;i++){const ring=new T.Mesh(new T.TorusGeometry(.078+i*.008,.001,4,64),mat('#494540'));ring.rotation.x=Math.PI/2;ring.position.y=.008;record.add(ring);}
 // Asymmetric paper label, spindle and tiny printed markers make rotation visible.
 const labelCanvas=document.createElement('canvas');labelCanvas.width=256;labelCanvas.height=256;const ctx=labelCanvas.getContext('2d');ctx.fillStyle='#c89977';ctx.fillRect(0,0,256,256);ctx.fillStyle='#594335';ctx.textAlign='center';ctx.font='22px Georgia';ctx.fillText('SUMMER SALT',128,88);ctx.font='12px Georgia';ctx.fillText('SIDE A · 33⅓ RPM',128,165);ctx.fillStyle='#ead9ad';ctx.fillRect(43,113,25,5);const map=new T.CanvasTexture(labelCanvas);map.colorSpace=T.SRGBColorSpace;const label=new T.Mesh(new T.CircleGeometry(.067,48),new T.MeshStandardMaterial({map,roughness:.8}));label.rotation.x=-Math.PI/2;label.position.y=.009;record.add(label);
 const marker=new T.Mesh(new T.CircleGeometry(.012,16),mat('#e1cea3'));marker.rotation.x=-Math.PI/2;marker.position.set(.11,.009,.08);record.add(marker);
 for(const x of[-.3,.3])for(const z of[-.2,.2]){const foot=box(.07,.06,.07,'#302d27',x,-.09,z);}
 box(.78,.025,.018,'#c1a274',0,.02,.28);
 const dial=new T.Mesh(new T.CylinderGeometry(.027,.027,.025,24),mat('#bba17a'));dial.rotation.x=Math.PI/2;dial.position.set(.26,-.005,.29);group.add(dial);
 const pivot=new T.Mesh(new T.CylinderGeometry(.044,.044,.05,32),mat('#bba17a'));pivot.position.set(.29,.12,-.17);group.add(pivot);
 const arm=box(.025,.025,.28,'#c6b685',.25,.13,-.02);arm.rotation.y=-.4;box(.07,.035,.055,'#292724',.20,.12,.11);
 let speed=0;return {group,record,update(dt,playing){speed=T.MathUtils.damp(speed,playing?3.49:0,2.5,dt);record.rotation.y-=dt*speed;arm.rotation.y=T.MathUtils.damp(arm.rotation.y,playing?-.55:-.15,2,dt);}};
}
