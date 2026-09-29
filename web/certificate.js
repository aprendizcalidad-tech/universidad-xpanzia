/* Shared 720 × 405 certificate composition. No external font or image requests. */
const UC_CERTIFICATE={
 layout(c){
  const fit=(value,max,width,lines=1,height=999)=>{const text=String(value||'');let size=max;while(size>7){const capacity=width/(size*.57);let count=1,used=0;for(const word of text.split(/\s+/)){if(word.length>capacity){count+=Math.ceil(word.length/capacity)-1;used=word.length%capacity;}else if(used+word.length+1>capacity){count++;used=word.length;}else used+=word.length+1;}if(count<=lines&&count*size*1.18<=height-6)break;size-=.5;}return size;};
  const box=(id,text,x,y,w,h,size,font='Arial',color='#1c2a40',bold=false)=>({id,text:String(text||''),x,y,w,h,size,font,color,bold});
  const issuer=c.company||'Xpanzia Group',name=c.name||'Nombre del participante',title=c.title||'Nombre del curso';
  return [
   box('brand','UNIVERSIDAD CORPORATIVA',240,35,365,18,11,'Arial','#383838',true),
   box('company',issuer,240,54,365,18,fit(issuer,10,350,1,18),'Arial','#666666'),
   box('eyebrow','CERTIFICADO DE',130,97,460,19,12,'Arial','#a81724',true),
   box('heading','APROBACIÓN',100,118,520,42,34,'Georgia','#991322',true),
   box('intro','Otorgado a',170,165,380,17,9.5,'Arial','#666666'),
   box('name',name,100,185,520,47,fit(name,29,490,2,47),'Georgia','#303030'),
   box('body','Por completar y aprobar satisfactoriamente '+(c.routeId?'la ruta de aprendizaje':'el curso'),100,238,520,18,9.5,'Arial','#5c5c5c'),
   box('title',title,110,259,500,34,fit(title,18,470,2,34),'Georgia','#343434',true),
   box('details',String(c.hours)+' horas  ·  Fecha de aprobación: '+String(c.date||'').slice(0,10),150,299,420,18,8.5,'Arial','#666666'),
   box('signer',c.signer||'Xpanzia Group',125,351,200,25,fit(c.signer||'Xpanzia Group',8,185,2,25),'Arial','#3c3c3c',true),
   box('signer-role','Firma institucional',125,375,200,11,7,'Arial','#666666'),
   box('verification','VERIFICACIÓN DIGITAL',382,332,176,15,8,'Arial','#9a772c',true),
   box('code',c.code||'VISTA PREVIA',372,349,196,13,7,'Arial','#444444'),
   {...box('link','Verificar autenticidad',389,366,162,13,7.5,'Arial','#666666'),link:/^https:\/\//.test(c.portalUrl||'')?c.portalUrl.replace(/#.*$/,'')+'#verificar/'+encodeURIComponent(c.code||''):''}
  ];
 }
};
