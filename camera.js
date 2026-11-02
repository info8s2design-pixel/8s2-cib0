(()=>{
const byId=id=>document.getElementById(id),dialog=byId('cameraDialog'),video=byId('cameraVideo'),status=byId('cameraStatus'),shoot=byId('cameraShoot'),flip=byId('cameraFlip');
let stream=null,request=0,facing='environment',onPhoto=null;
function stop(){if(stream)stream.getTracks().forEach(track=>track.stop());stream=null;video.srcObject=null;shoot.disabled=true}
function close(){++request;stop();onPhoto=null}
async function start(){
 const token=++request;stop();flip.disabled=true;status.textContent='Apertura della fotocamera…';
 try{
  const constraints={audio:false,video:{facingMode:{exact:facing},width:{ideal:1920},height:{ideal:1080}}};
  let next;
  try{next=await navigator.mediaDevices.getUserMedia(constraints)}catch(error){if(!['OverconstrainedError','NotFoundError'].includes(error.name))throw error;if(token!==request||!dialog.open)return;next=await navigator.mediaDevices.getUserMedia({...constraints,video:{...constraints.video,facingMode:{ideal:facing}}})}
  if(token!==request||!dialog.open){next.getTracks().forEach(track=>track.stop());return}
  stream=next;video.srcObject=next;const actual=next.getVideoTracks()[0]?.getSettings?.().facingMode;
  if(actual==='user'||actual==='environment')facing=actual;
  video.classList.toggle('frontCamera',facing==='user');await video.play();
  if(token!==request||!dialog.open)return;
  status.textContent=facing==='environment'?'Fotocamera posteriore. Inquadra il piatto e scatta.':'Fotocamera frontale. Usa Cambia fotocamera per passare alla posteriore.';
  shoot.disabled=!video.videoWidth;
 }catch(error){if(token!==request||!dialog.open)return;stop();status.textContent=error.name==='NotAllowedError'?'Accesso alla fotocamera non consentito. Puoi autorizzarlo nelle impostazioni del browser oppure usare la fotocamera del telefono.':'Fotocamera non disponibile. Prova la fotocamera del telefono oppure scegli una foto dalla galleria.'}
 finally{if(token===request)flip.disabled=false}
}
video.addEventListener('loadeddata',()=>{shoot.disabled=!stream||!video.videoWidth});
byId('cameraClose').onclick=()=>dialog.close();
flip.onclick=()=>{facing=facing==='environment'?'user':'environment';start()};
shoot.onclick=()=>{
 if(!stream||!video.videoWidth||!video.videoHeight)return;
 const token=request,canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;canvas.getContext('2d').drawImage(video,0,0);shoot.disabled=true;
 canvas.toBlob(blob=>{if(token!==request||!dialog.open)return;if(!blob){status.textContent='Scatto non riuscito. Riprova.';shoot.disabled=false;return}const use=onPhoto;dialog.close();use?.(new File([blob],'CIB0-piatto.jpg',{type:'image/jpeg'}))},'image/jpeg',.92);
};
byId('cameraNative').onclick=()=>{dialog.close();byId('cameraFile').click()};
dialog.addEventListener('close',close);dialog.addEventListener('cancel',close);
window.addEventListener('pagehide',()=>{if(dialog.open)dialog.close();close()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&dialog.open){dialog.close();close()}});
window.CIB0Camera={open(callback){if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia){byId('cameraFile').click();return}if(dialog.open)return;onPhoto=callback;facing='environment';dialog.showModal();start()}};
})();
