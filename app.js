'use strict';
const M=window.MatbookModel,KEY='matbook.sessions.v1',$=s=>document.querySelector(s);
const {labels,colors,today}=M;
let state=M.normalize([]),editing=null,deleted=null,timer,loadFailed=false,selectedClass='all',allWins=false,selectedChapter=null;
try{const raw=localStorage.getItem(KEY);if(raw)state=M.normalize(JSON.parse(raw));}catch{loadFailed=true;$('#form-error').textContent='Your saved log could not be opened. Restore a backup or reopen with browser storage available before saving.';}
const dateLabel=s=>new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(new Date(s+'T12:00:00'));
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function announce(text,undo=false){clearTimeout(timer);$('#toast-text').textContent=text;$('#undo').hidden=!undo;$('#toast').hidden=false;timer=setTimeout(()=>{$('#toast').hidden=true;},undo?12000:4500);}
function persist(next,restore=false){if(loadFailed&&!restore){$('#form-error').textContent='Restore a backup or reopen with browser storage available before saving.';return false;}try{const clean=M.normalize(next);localStorage.setItem(KEY,JSON.stringify(clean));state=clean;loadFailed=false;$('#form-error').textContent='';return true;}catch{$('#form-error').textContent='Could not save. Keep this page open, download a backup, and check browser storage.';return false;}}
function selection(){return $('input[name="class"]:checked')?.value;}
function updateWinControl(){const isBjj=selection()==='bjj';$('#win-toggle').hidden=!isBjj;if(!isBjj)$('#win').checked=false;$('#note').required=isBjj&&$('#win').checked;}
document.querySelectorAll('input[name="class"]').forEach(input=>input.addEventListener('change',updateWinControl));
$('#win').addEventListener('change',updateWinControl);
function setupFilters(){const box=$('#class-filters');for(const [key,label] of Object.entries(labels)){const b=el('button');b.type='button';b.dataset.class=key;b.style.setProperty('--class-color',colors[key]);b.setAttribute('aria-pressed','false');const dot=el('i');dot.setAttribute('aria-hidden','true');b.append(dot,document.createTextNode(label),el('span','0'));box.append(b);}document.querySelectorAll('[data-class]').forEach(b=>b.addEventListener('click',()=>{selectedClass=b.dataset.class;renderRecord();}));}
function renderRecord(){const counts=M.counts(state.sessions),total=state.sessions.length;$('#total-count').textContent=total;document.querySelectorAll('[data-class]').forEach(b=>{const key=b.dataset.class;b.setAttribute('aria-pressed',String(key===selectedClass));if(key!=='all')b.querySelector('span').textContent=counts[key];});$('#print-count').textContent=selectedClass==='all'?total:counts[selectedClass];$('#print-label').textContent=selectedClass==='all'?'Total sessions':labels[selectedClass];const g=$('#print-marks');g.replaceChildren();for(const mark of M.marks(state.sessions)){const line=document.createElementNS('http://www.w3.org/2000/svg','rect');line.setAttribute('x',mark.x-1.8);line.setAttribute('y',mark.y-5.5);line.setAttribute('width','3.6');line.setAttribute('height','11');line.setAttribute('rx','1.8');line.setAttribute('transform',`rotate(${mark.angle} ${mark.x} ${mark.y})`);line.setAttribute('fill',colors[mark.entry.class]);line.setAttribute('opacity',selectedClass==='all'||mark.entry.class===selectedClass?'1':'.12');line.setAttribute('class','print-mark');g.append(line);}$('#print-caption').textContent=total?`One mark per session${total>180?' · latest 180 shown':''}. Counts are all time. Tap a class to find its marks.`:'Every session leaves a mark. Your first one starts the pattern.';renderRoad(counts.bjj);}

function setupChapters(){
  const path=$('#chapter-path');
  M.chapters.forEach((chapter,index)=>{
    const button=el('button',undefined,'chapter-step');
    button.type='button';button.dataset.chapter=index;
    button.setAttribute('aria-pressed','false');
    button.setAttribute('aria-label',chapter.label+', approximately '+chapter.classes+(index===4?'+':'')+' total BJJ classes');
    button.append(el('strong','~'+chapter.classes+(index===4?'+':'')),el('span',chapter.label));
    button.addEventListener('click',()=>{selectedChapter=index;renderChapter();});
    path.append(button);
  });
}
function currentChapter(){return selectedChapter??M.chapterIndex(M.counts(state.sessions).bjj);}
function renderChapter(){
  const index=currentChapter(),chapter=M.chapters[index];
  document.querySelectorAll('[data-chapter]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.chapter)===index)));
  $('#chapter-focus-text').textContent=chapter.focus;
  const saved=state.focus===chapter.focus;
  $('#use-chapter-focus').disabled=saved;
  $('#use-chapter-focus').textContent=saved?'Focus saved':'Use this focus';
}
function syncRankControl(){$('#rank-input').value=state.rank===null?'':String(state.rank);}
function renderRank(){
  $('#rank-label').textContent=M.rankLabel(state.rank);
  $('#rank-editor summary').textContent=state.rank===null?'Record my rank':'Update my rank';
  $('#rank-belt').dataset.rank=state.rank===null?'unrecorded':state.rank===5?'blue':'white';
  const stripes=$('#belt-stripes');stripes.replaceChildren();
  if(state.rank!==null&&state.rank<5)for(let i=0;i<state.rank;i++)stripes.append(el('i'));
}
function renderRoad(count){
  $('#bjj-total').textContent=count;
  $('#road-message').textContent=count===0?'One class is a beginning.':'Time on the mats. Discoveries worth keeping.';
  renderChapter();renderRank();
  const wins=M.sorted(state.sessions.filter(e=>e.class==='bjj'&&e.win&&e.note)).reverse();
  $('#wins-count').textContent=String(wins.length)+' saved';
  const list=$('#wins-list');list.replaceChildren();
  if(!wins.length)list.append(el('p','A calmer round. An escape that clicked. After a BJJ class, save one thing you want to remember.','wins-empty'));
  for(const win of (allWins?wins:wins.slice(0,3))){const item=el('article',undefined,'win-note'),time=el('time',dateLabel(win.date));time.dateTime=win.date;item.append(el('p',win.note),time);list.append(item);}
  $('#more-wins').hidden=wins.length<=3;
  $('#more-wins').textContent=allWins?'Show fewer wins':'Show all '+wins.length+' wins';
}

function render(){renderRecord();const list=$('#history-list');list.replaceChildren();$('#session-count').textContent=`${state.sessions.length} ${state.sessions.length===1?'session':'sessions'}`;if(!state.sessions.length){const empty=el('div',undefined,'empty');empty.append(el('h3','Your first round starts here.'),el('p','Choose your class, log the work. Everything you want to remember lives here.'));list.append(empty);return;}let month='';for(const e of M.sorted(state.sessions).reverse()){const d=new Date(e.date+'T12:00:00'),m=e.date.slice(0,7);if(m!==month){list.append(el('h3',new Intl.DateTimeFormat(undefined,{month:'long',year:'numeric'}).format(d),'month-title'));month=m;}const row=el('article',undefined,'entry'),date=el('div');date.append(el('div',String(d.getDate()),'entry-day'),el('div',new Intl.DateTimeFormat(undefined,{weekday:'short'}).format(d),'entry-weekday'));const body=el('div'),top=el('div',undefined,'entry-top'),actions=el('div',undefined,'entry-actions'),heading=el('h3',labels[e.class]);if(e.win)heading.append(el('span','Small win','win-tag'));for(const [text,handler]of [['Edit',()=>edit(e)],['Delete',()=>remove(e)]]){const b=el('button',text);b.type='button';b.setAttribute('aria-label',`${text} ${labels[e.class]} session on ${e.date}`);b.addEventListener('click',handler);actions.append(b);}top.append(heading,actions);body.append(top);if(e.note)body.append(el('p',e.note,'entry-note'));row.append(date,body);list.append(row);}}
function reset(){editing=null;$('#session-form').reset();$('#date').value=today();$('#save').innerHTML='Check in <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';$('#form-title').textContent='Log a session';$('#cancel-edit').hidden=true;updateWinControl();}
function edit(e){editing=e.id;$(`input[name="class"][value="${e.class}"]`).checked=true;$('#note').value=e.note;$('#date').value=e.date;$('#win').checked=e.win;updateWinControl();$('#save').textContent='Save changes';$('#form-title').textContent='Edit session';$('#cancel-edit').hidden=false;$('#note').focus();$('#session-form').scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
function remove(e){if(persist({...state,sessions:state.sessions.filter(s=>s.id!==e.id)})){deleted=e;if(editing===e.id)reset();render();announce('Session removed.',true);}}
$('#session-form').addEventListener('submit',event=>{event.preventDefault();$('#date').max=today();const className=selection(),note=$('#note').value.trim();if(!className||!M.validDate($('#date').value)||$('#date').value>today()){$('#form-error').textContent='Choose a class and a valid date up to today.';return;}if($('#win').checked&&!note){$('#form-error').textContent='Add a note for your small win, or uncheck the box.';return;}const old=state.sessions.find(s=>s.id===editing);if(editing&&!old){announce('This session was removed in another tab.');reset();return;}const entry={id:editing||crypto.randomUUID(),class:className,date:$('#date').value,note,createdAt:old?.createdAt||new Date().toISOString(),win:className==='bjj'&&$('#win').checked},wasEdit=!!editing;const next=editing?state.sessions.map(s=>s.id===editing?entry:s):[...state.sessions,entry];if(persist({...state,sessions:next})){reset();render();announce(wasEdit?'Changes saved.':entry.win?'Session logged. A small win worth keeping.':'Session logged. Another mark in your story.');}});
$('#cancel-edit').addEventListener('click',reset);
$('#undo').addEventListener('click',()=>{if(deleted&&!state.sessions.some(e=>e.id===deleted.id)&&persist({...state,sessions:[...state.sessions,deleted]})){deleted=null;render();announce('Session restored.');}});
$('#focus-form').addEventListener('submit',event=>{event.preventDefault();const focus=$('#focus-input').value.trim();if(persist({...state,focus})){$('#focus-status').textContent=focus?'Focus saved. Take it into your next class.':'Focus cleared. Pick a new one whenever you like.';renderChapter();}else $('#focus-status').textContent='Could not save your focus. Check browser storage and try again.';});
$('#use-chapter-focus').addEventListener('click',()=>{
  const focus=M.chapters[currentChapter()].focus;
  if(persist({...state,focus})){$('#focus-input').value=focus;$('#focus-status').textContent='Focus saved. Make it your own whenever you like.';renderChapter();}
  else $('#focus-status').textContent='Could not save this focus. Check browser storage and try again.';
});
$('#rank-form').addEventListener('submit',event=>{
  event.preventDefault();
  const value=$('#rank-input').value,rank=value===''?null:Number(value);
  if(persist({...state,rank})){
    renderRank();syncRankControl();$('#rank-editor').open=false;
    $('#rank-status').textContent=rank===null?'Rank cleared.':M.rankLabel(rank)+' recorded.';
  }else $('#rank-status').textContent='Could not save your rank. Check browser storage and try again.';
});
$('#more-wins').addEventListener('click',()=>{allWins=!allWins;renderRoad(M.counts(state.sessions).bjj);});
$('#log-bjj').addEventListener('click',()=>{if(editing)reset();$('input[name="class"][value="bjj"]').checked=true;updateWinControl();$('input[name="class"][value="bjj"]').focus();});
$('#export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(M.backup(state),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=`matbook-backup-${today()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('#import').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>5000000)throw Error();const incoming=M.readBackup(JSON.parse(await file.text()));if(persist(M.merge(state,incoming),true)){reset();$('#focus-input').value=state.focus;syncRankControl();render();announce('Backup restored. Existing entries, focus and recorded rank kept.');}}catch{announce('Could not restore. Choose a valid Matbook backup.');}event.target.value='';});
window.addEventListener('storage',event=>{if(event.key!==KEY)return;try{state=M.normalize(JSON.parse(event.newValue||'[]'));loadFailed=false;if(document.activeElement!==$('#focus-input'))$('#focus-input').value=state.focus;if(document.activeElement!==$('#rank-input'))syncRankControl();render();}catch{announce('Could not read changes from another tab. Your current view is kept.');}});
$('#date').value=today();$('#date').max=today();$('#today-label').textContent=new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(new Date());$('#focus-input').value=state.focus;syncRankControl();setupFilters();setupChapters();render();
