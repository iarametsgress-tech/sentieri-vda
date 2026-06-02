'use strict';
const fs=require('fs');const p=require('path');
const skPath=p.join(__dirname,'../src/data/trails-skeleton.json');
const sk=JSON.parse(fs.readFileSync(skPath,'utf8'));
const add={
 '08-s19':{description_fr:" Les alpages de Nomenon, à mi-parcours, offrent une pause bienvenue avant la dernière rampe vers le bivouac, dans un cadre ouvert et venteux.",description_de:" Die Almen von Nomenon bieten auf halber Strecke eine willkommene Pause vor dem letzten Anstieg zur Biwakschachtel in offener, windiger Lage."},
 '10-s5':{description_fr:" La végétation de versant — rhododendrons, genévriers et mélèzes — encadre le panorama tout au long de ce traversée pour randonneurs expérimentés.",description_de:" Die Hangvegetation aus Rhododendron, Wacholder und Lärchen rahmt das Panorama dieser Querung für erfahrene Wanderer durchgehend ein. Saison Juni bis September."},
 '12-s11':{description_fr:" Le dénivelé de 1149 m et l'altitude au-delà de 3000 m imposent une bonne préparation physique et un équipement adapté à la haute montagne.",description_de:" Der Höhenunterschied von 1149 m und die Lage über 3000 m erfordern gute Kondition und Hochgebirgsausrüstung. Empfohlene Saison Juni bis September."}
};
let n=0;
const m=sk.map(t=>{const e=add[t.slug];if(!e)return t;const u={...t};for(const[f,s]of Object.entries(e)){if(u[f]){u[f]=u[f]+s;n++;}}return u;});
Object.keys(add).forEach(sl=>{const t=m.find(x=>x.slug===sl);['description_fr','description_de'].forEach(f=>console.log(sl,f,t[f].length));});
fs.writeFileSync(skPath,JSON.stringify(m,null,2));console.log('fix:',n);
