export function setupGallery(){
 const dialog=document.getElementById('gallery-dialog'),status=document.getElementById('gallery-status');
 let image=document.getElementById('gallery-image'),nextCat=0,generation=0;
 const cache=new Map();
 function prepare(url){
  if(cache.has(url))return cache.get(url);
  const picture=new Image();picture.decoding='async';picture.draggable=false;
  const ready=new Promise(resolve=>{
   picture.onload=async()=>{try{if(picture.decode)await picture.decode();resolve(true);}catch{resolve(false);}};
   picture.onerror=()=>resolve(false);
  });
  picture.src=url;
  const entry={picture,ready};cache.set(url,entry);return entry;
 }
 const birthday='./assets/gallery/birthday.png';
 const cats=Array.from({length:7},(_,i)=>`./assets/gallery/cat-${i+1}.jpg`);
 [birthday,...cats].forEach(prepare);
 document.getElementById('close-gallery').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{generation++;image.hidden=true;});
 return async kind=>{
  if(dialog.open)return;
  const token=++generation,index=nextCat,url=kind===0?birthday:cats[index];
  if(kind!==0)nextCat=(nextCat+1)%cats.length;
  image.hidden=true;status.textContent='图片加载中…';status.hidden=false;dialog.showModal();
  const entry=prepare(url),ok=await entry.ready;
  if(token!==generation||!dialog.open)return;
  if(!ok){cache.delete(url);status.textContent='图片暂未加载成功，请关闭后重试。';return;}
  const next=entry.picture;next.id='gallery-image';next.alt=kind===0?'Happy Birthday 生日挂画':`咪咪生日表情包 ${index+1}`;
  if(next!==image){image.replaceWith(next);image=next;}
  image.hidden=false;status.hidden=true;
 };
}
