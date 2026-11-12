export function setupGallery(){
 const dialog=document.getElementById('gallery-dialog'),image=document.getElementById('gallery-image');
 let nextCat=0;
 document.getElementById('close-gallery').onclick=()=>dialog.close();
 return kind=>{
  if(dialog.open)return;
  if(kind===0){image.src='./assets/gallery/birthday.png';image.alt='Happy Birthday 生日挂画';}
  else{image.src=`./assets/gallery/cat-${nextCat+1}.jpg`;image.alt=`咪咪生日表情包 ${nextCat+1}`;nextCat=(nextCat+1)%7;}
  dialog.showModal();
 };
}
