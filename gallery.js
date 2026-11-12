export function setupGallery(){
 const dialog=document.getElementById('gallery-dialog'),image=document.getElementById('gallery-image'),counter=document.getElementById('gallery-count'),nav=document.getElementById('gallery-nav');
 let pictures=[],index=0,start=null;
 function render(){image.src=pictures[index];image.alt=pictures.length===1?'Happy Birthday 生日挂画':`咪咪生日表情包 ${index+1}`;counter.textContent=`${index+1} / ${pictures.length}`;nav.hidden=pictures.length===1;}
 function step(delta){index=(index+delta+pictures.length)%pictures.length;render();}
 document.getElementById('gallery-prev').onclick=()=>step(-1);
 document.getElementById('gallery-next').onclick=()=>step(1);
 document.getElementById('close-gallery').onclick=()=>dialog.close();
 dialog.addEventListener('keydown',e=>{if(pictures.length>1&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();step(e.key==='ArrowLeft'?-1:1);}});
 image.addEventListener('pointerdown',e=>{start={x:e.clientX,y:e.clientY,id:e.pointerId};image.setPointerCapture(e.pointerId);});
 image.addEventListener('pointerup',e=>{if(!start||start.id!==e.pointerId)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(pictures.length>1&&Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))step(dx<0?1:-1);});
 image.addEventListener('pointercancel',()=>start=null);
 return kind=>{pictures=kind===0?['./assets/gallery/birthday.png']:Array.from({length:7},(_,i)=>`./assets/gallery/cat-${i+1}.jpg`);index=0;render();dialog.showModal();};
}
