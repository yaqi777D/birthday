// Decode once, then play through the AudioContext unlocked by a user gesture.
// GainNode also provides fades on phones that do not allow element.volume changes.
export class BufferedTrack {
  constructor(getContext){this.getContext=getContext;this._src='';this._volume=0;this.offset=0;this.source=null;this.buffer=null;this.loading=null;this.revision=0;this.playEpoch=0;this.loop=true;}
  set src(value){this.pause();this._src=value;this.buffer=null;this.loading=null;this.offset=0;this.revision++;}
  get src(){return this._src;}
  set volume(value){this._volume=value;if(this.gain)this.gain.gain.setTargetAtTime(value,this.context.currentTime,.03);}
  get volume(){return this._volume;}
  async load(){
    if(this.buffer)return this.buffer;
    if(this.loading)return this.loading;
    const revision=this.revision;
    this.context=this.getContext();
    this.loading=(async()=>{const response=await fetch(this.src);if(!response.ok)throw new Error('Audio HTTP '+response.status);const buffer=await this.context.decodeAudioData(await response.arrayBuffer());if(revision!==this.revision)throw new Error('Audio source changed');this.buffer=buffer;return buffer;})();
    try{return await this.loading;}finally{if(revision===this.revision)this.loading=null;}
  }
  async play(){
    const revision=this.revision,epoch=this.playEpoch;
    const context=this.getContext();await context.resume();await this.load();
    if(revision!==this.revision||epoch!==this.playEpoch)throw new Error('Audio playback cancelled');
    if(context.state!=='running')throw new Error('Audio needs a tap');
    if(this.source)return;
    this.gain??=context.createGain();this.gain.disconnect();this.gain.connect(context.destination);this.gain.gain.value=this._volume;
    this.source=context.createBufferSource();this.source.buffer=this.buffer;this.source.loop=this.loop;this.source.connect(this.gain);
    this.started=context.currentTime;this.source.start(0,this.offset%this.buffer.duration);
  }
  get currentTime(){return this.buffer?(this.offset+(this.source?this.context.currentTime-this.started:0))%this.buffer.duration:0;}
  pause(){this.playEpoch++;if(this.source){this.offset=(this.offset+this.context.currentTime-this.started)%this.buffer.duration;this.source.stop();this.source.disconnect();this.source=null;}}
}
