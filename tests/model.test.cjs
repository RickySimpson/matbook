const assert=require('node:assert/strict'),M=require('../model.js');
const old={id:'old',class:'bjj',date:'2026-10-01',note:'Remember the frames',createdAt:'2026-10-01T12:00:00Z'};
const migrated=M.normalize([old]);assert.equal(migrated.sessions[0].note,old.note);assert.equal(migrated.sessions[0].win,false);assert.equal(migrated.focus,'');
const current={...migrated,focus:'Ask coach about escapes',sessions:[{...migrated.sessions[0],win:true}]};assert.deepEqual(M.readBackup(M.backup(current)),current);assert.deepEqual(M.readBackup({app:'matbook',version:1,sessions:[old]}),migrated);
const incoming={sessions:[{...old,note:'Should not overwrite'},{...old,id:'new',class:'striking',win:true}],focus:'Incoming'};const merged=M.merge(current,incoming);assert.equal(merged.sessions.length,2);assert.equal(merged.focus,current.focus);assert.equal(merged.sessions[0].note,old.note);assert.equal(merged.sessions[1].win,false);
assert.throws(()=>M.normalize([old,old]));assert.throws(()=>M.readBackup({app:'wrong',version:2,sessions:[]}));assert.throws(()=>M.normalize([{...old,class:'unknown'}]));assert.throws(()=>M.normalize([{...old,date:'2026-02-31'}]));
const entries=Array.from({length:220},(_,i)=>({...old,id:String(i).padStart(3,'0'),class:Object.keys(M.labels)[i%5]}));const counts=M.counts(entries);assert.deepEqual(Object.values(counts),[44,44,44,44,44]);const marks=M.marks(entries);assert.equal(marks.length,180);assert.equal(marks[0].entry.id,'040');assert.equal(marks.at(-1).entry.id,'219');assert.ok(marks.every(m=>Number.isFinite(m.x)&&m.x>=20&&m.x<=340&&Number.isFinite(m.y)&&m.y>=20&&m.y<=340));assert.deepEqual(M.marks([]),[]);
console.log('Passed: legacy data migration, backup round trips, merge preservation, validation, independent counts, and bounded fightprint.');

assert.deepEqual(M.chapters.map(c=>c.classes),[50,100,150,200,250]);
assert.deepEqual(M.chapters.map(c=>c.focus),['Survival & basic escapes','Guard retention & posture','Sweeps & basic submissions','Chaining moves together','Consistently executing against new white belts']);
for(const [count,index] of [[0,0],[49,0],[50,1],[99,1],[100,2],[149,2],[150,3],[199,3],[200,4],[249,4],[250,4],[900,4]])assert.equal(M.chapterIndex(count),index);
assert.equal(migrated.rank,null);
assert.equal(M.normalize({version:2,sessions:[old],focus:'My own focus'}).rank,null);
const manyBjj=Array.from({length:300},(_,i)=>({...old,id:'bjj-'+i}));
assert.equal(M.normalize({sessions:manyBjj,focus:''}).rank,null,'Attendance must never award rank');
for(const rank of [null,0,1,2,3,4,5]){
  const ranked=M.normalize({...current,rank});
  assert.deepEqual(M.readBackup(M.backup(ranked)),ranked);
}
assert.equal(M.readBackup({app:'matbook',version:2,sessions:[old],focus:'Existing focus'}).focus,'Existing focus');
assert.equal(M.merge({...current,rank:0},{...incoming,rank:4}).rank,0,'Recorded zero stripes must be preserved');
assert.equal(M.merge({...current,rank:null},{...incoming,rank:5}).rank,5);
assert.equal(M.merge({...current,rank:3},{...incoming,rank:5}).rank,3);
for(const rank of [-1,6,1.5,'2',false])assert.throws(()=>M.normalize({...current,rank}));
assert.equal(M.rankLabel(1),'White belt · 1 stripe');
assert.equal(M.rankLabel(5),'Blue belt');
console.log('Passed: cumulative chapter boundaries, exact focus copy, manual-only rank, rank validation, and v1/v2/v3 backup compatibility.');
