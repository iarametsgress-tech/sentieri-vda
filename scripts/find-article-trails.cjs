const sk = require('../src/data/trails-skeleton.json');
const arr = Array.isArray(sk) ? sk : sk.trails || Object.values(sk);
const cited = new Set(`07-s43 07-s63 10-s8 12-s9 14-s26 14-s28 17-s102 17-s6 18-s67 19-s2 19-s9 21-s12 21-s30 22-s57 22-s58 22-s59 23-s8 29-s7 31-s22 32-s20 44-s20 44-s22 44-s25`.split(/\s+/));
function nm(t){return t.name_it||t.slug;}
function blob(t){return ((t.name_it||'')+' '+(t.shortDescription_it||'')+' '+(t.description_it||'')+' '+(t.valley||'')+' '+(t.municipalities||'')).toLowerCase();}
function show(t){return t.slug+' | '+nm(t)+' | '+(t.valley||'?')+' | '+(t.difficulty||'?')+' | '+(t.distance_km||'?')+'km +'+(t.elevation_gain_m||'?')+'m | enr:'+(t.enriched?1:0);}
const themes={
  CASCATE:/cascat|cascade|lillaz|gorge|orrido/,
  BICI:/poderal|sterrat|militare|carrozzabil|fondovalle|\bpista\b|forestale|\brû\b|\bru\b|anello|ciclo/,
  NATURA:/bosco|foresta|larice|abete|riserva|oasi|torbiera|palud|fauna|stambecc|camosc|valnontey|rhemes|valsavarenche/,
};
for(const k in themes){
  const re=themes[k];
  let hits=arr.filter(t=>t.slug&&!cited.has(t.slug)&&!/^(tour-|alta-via-)/.test(t.slug)&&re.test(blob(t)));
  // prefer enriched + reasonable distance
  hits.sort((a,b)=>(b.enriched?1:0)-(a.enriched?1:0)||(b.distance_km||0)-(a.distance_km||0));
  console.log('\n### '+k+' ('+hits.length+' total)');
  hits.slice(0,18).forEach(t=>console.log(show(t)));
}
