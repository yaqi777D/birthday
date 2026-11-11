export function parseLyrics(text){
  const result=[];
  for(const raw of text.split(/\r?\n/)){
    const stamps=[...raw.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];
    const words=raw.replace(/\[[^\]]*\]/g,'').trim();
    if(!words)continue;
    if(stamps.length)for(const m of stamps)result.push({time:Number(m[1])*60+Number(m[2]),text:words});
    else if(!/^\[/.test(raw))result.push({time:null,text:words});
  }
  return result.sort((a,b)=>(a.time??Infinity)-(b.time??Infinity));
}
export function updateLyrics(container,lines,time,duration){
  if(container.hidden||!lines.length||!container.closest('dialog')?.open)return;
  // LRC follows timestamps; plain lyrics scroll gently without claiming precise sync.
  if(lines[0].time===null){if(duration)container.scrollTop=Math.max(0,container.scrollHeight-container.clientHeight)*time/duration;return;}
  let current=-1;for(let i=0;i<lines.length;i++){if(lines[i].time!==null&&time>=lines[i].time)current=i;}
  if(container.dataset.current===String(current))return;
  container.dataset.current=String(current);
  [...container.children].forEach((p,i)=>p.classList.toggle('current',i===current));
  const line=container.children[current];if(line)container.scrollTo({top:line.offsetTop-container.offsetTop-container.clientHeight/2+line.clientHeight/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
