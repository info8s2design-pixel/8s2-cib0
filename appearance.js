(()=>{
const root=document.documentElement;
const palettes=[['lime','Lime · Originale',['#d7f477','#ff704f','#1a241e']],['mediterranea','Mediterranea',['#8bc6eb','#c98162','#162b3b']],['pesca','Pesca',['#f5b399','#8c3e59','#382126']],['salvia','Salvia',['#afc8b6','#d3b999','#21382c']],['monocromo','Monocromo',['#ededed','#959595','#191919']]];
const allowed=palettes.map(p=>p[0]);
let current=allowed.includes(root.dataset.palette)?root.dataset.palette:'lime';
function sync(){
 root.dataset.palette=current;const legend=document.querySelector('#profileDialog .appearancePicker legend');if(legend)legend.textContent='Palette: '+palettes.find(p=>p[0]===current)[1];
 document.querySelectorAll('[data-palette]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(b.dataset.palette===current))});
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===root.dataset.theme)));
 requestAnimationFrame(()=>{const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=getComputedStyle(document.body).backgroundColor});
}
for(const picker of document.querySelectorAll('[data-palette-picker]'))for(const [id,name,colors] of palettes){
 const b=document.createElement('button');b.type='button';b.className='paletteOption';b.dataset.palette=id;b.setAttribute('aria-label',name);b.title=name;
 const preview=document.createElement('span');preview.className='palettePreview';preview.setAttribute('aria-hidden','true');
 for(const color of colors){const swatch=document.createElement('span');swatch.style.backgroundColor=color;preview.append(swatch)}
 const label=document.createElement('span');label.textContent=name;b.append(preview,label);
 b.onclick=()=>{try{localStorage.setItem('cib0-palette',JSON.stringify(id));current=id;sync();document.getElementById('appearanceStatus').textContent='Palette '+name+' salvata.'}catch{document.getElementById('appearanceStatus').textContent='Impossibile salvare la palette. Riprova.'}};
 picker.append(b);
}
for(const picker of document.querySelectorAll('[data-mode-picker]'))for(const [id,name] of [['light','Giorno'],['dark','Notte']]){
 const b=document.createElement('button');b.type='button';b.className='secondary';b.dataset.mode=id;b.textContent=name;
 b.onclick=()=>{if(root.dataset.theme!==id)document.getElementById('themeToggle').click();sync()};picker.append(b);
}
window.addEventListener('cib0-theme-changed',sync);sync();
})();
