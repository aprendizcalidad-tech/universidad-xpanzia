const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const props={SPREADSHEET_ID:'db',ADMIN_EMAILS:'admin@example.com'},tables={},cache=new Map();let reads=0,held=false,forceBusy=false,pdfOutside=false;
function sheet(name){tables[name]??=[];return {getLastRow:()=>tables[name].length,getRange:(row,col,count=1)=>({getValues:()=>{reads++;return tables[name].slice(row-1,row-1+count)},setValues:values=>{values.forEach((v,i)=>tables[name][row-1+i]=v);return{};}}),appendRow:v=>{tables[name].push(v);return{setFrozenRows(){}}},deleteRow:r=>tables[name].splice(r-1,1)};}
const db={getSheetByName:name=>tables[name]?sheet(name):null,insertSheet:sheet,getUrl:()=> 'https://example.test/db'};
const ctx=vm.createContext({console,Date,JSON,Set,Map,Math,Number,Array,String,Error,PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]||'',setProperty:(k,v)=>props[k]=v})},SpreadsheetApp:{openById:()=>db},Utilities:{getUuid:()=>crypto.randomUUID(),DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(_,s)=>Array.from(crypto.createHash('sha256').update(s).digest())},LockService:{getScriptLock:()=>{let mine=false;return{tryLock:()=>{if(forceBusy||held)return false;held=true;mine=true;return true},hasLock:()=>mine,releaseLock:()=>{held=false;mine=false}}}},CacheService:{getScriptCache:()=>({get:k=>cache.get(k)||null,getAll:keys=>Object.fromEntries(keys.filter(k=>cache.has(k)).map(k=>[k,cache.get(k)])),put:(k,v)=>cache.set(k,v),putAll:values=>Object.entries(values).forEach(([k,v])=>cache.set(k,v))})},ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({setMimeType:()=>JSON.parse(s)})}});
for(const name of ['Code.gs','Campus.gs','Seed.gs'])vm.runInContext(fs.readFileSync(__dirname+'/../google-apps-script/'+name,'utf8'),ctx);
for(const name of ['Users','Courses','Enrollments','Attempts','Certificates','Routes','Settings','Auth','Sessions','Invitations'])sheet(name).appendRow(['id','data_json']);
ctx.put_('Settings',{id:'main',company:'Xpanzia Group',portalUrl:'https://example.test/',maxAttempts:5});ctx.put_('Courses',ctx.seedCourse_());ctx.put_('Courses',{...ctx.seedCourse_(),id:'custom',school:'Escuela histórica'});
ctx.actualizarCampusV3();const before=JSON.stringify(tables);ctx.actualizarCampusV3();assert.equal(JSON.stringify(tables),before,'migration idempotent');assert.equal(ctx.schools_().length,7);assert(ctx.get_('Courses','custom').schoolId);
ctx.user_=token=>{assert(['admin','student'].includes(token));return {id:token,email:token+'@example.com',name:token,role:token==='admin'?'admin':'student'};};
const call=(action,payload={},token='admin')=>ctx.doPost({postData:{contents:JSON.stringify({action,payload,token})}});
assert(!call('saveSchool',{name:'Forbidden',order:0},'student').ok);
const result=call('saveSchool',{name:'Innovación <2026>',description:'Escuela nueva',order:2,image:'https://example.test/cover.jpg'});assert(result.ok);let school=result.data;
assert(!call('saveSchool',{name:'innovación <2026>',order:1}).ok,'duplicate case insensitive');assert(!call('saveSchool',{name:'Unsafe',order:1,image:'javascript:alert(1)'}).ok);assert(!call('saveSchool',{name:'Unsafe',order:1,image:'data:image/svg+xml;base64,AAAA'}).ok);
let course=ctx.get_('Courses','gestion-documental');course={...course,schoolId:school.id,image:'https://example.test/course.jpg'};assert(call('saveCourse',course).ok);
assert(!call('deleteSchool',{id:school.id,updated:school.updated}).ok,'no orphan courses');
const rename=call('saveSchool',{...school,name:'Innovación & tecnología'});assert(rename.ok);school=rename.data;
const catalog=call('catalog').data;assert.equal(catalog.courses.find(c=>c.id===course.id).school,school.name);assert(!('correct' in catalog.courses[0].quiz[0]));assert.equal(catalog.courses.find(c=>c.id===course.id).image,course.image);
assert(!call('saveSchool',{...school,updated:'stale'}).ok,'stale edit');
course=ctx.get_('Courses',course.id);assert(call('saveCourse',{...course,schoolId:'school-1'}).ok);assert(call('deleteSchool',{id:school.id,updated:school.updated}).ok);
const baseline=call('catalog');assert(baseline.ok);const n=reads;for(let i=0;i<100;i++)assert(call('catalog',{},'student').ok);assert.equal(reads,n,'100 warm catalog requests must not reread Sheets');
const chunk=[...cache.keys()].find(k=>k.includes(props.CATALOG_REVISION)&&/:0$/.test(k));assert(chunk);cache.delete(chunk);assert(call('catalog').ok);assert(reads>n,'missing cache chunk reloads source');
forceBusy=true;const old=JSON.stringify(tables),busy=call('saveSchool',{name:'Busy',order:0});assert.equal(busy.code,'BUSY');assert.equal(JSON.stringify(tables),old);forceBusy=false;
ctx.resetRequest_();ctx.put_('Certificates',{id:'cert',userId:'student',name:'Persona',title:'Curso',code:'UC-2026-1234567890123456',date:'2026-10-06',hours:2,portalUrl:'https://example.test/',mailStatus:'pending',fileId:'',nextTry:0});
assert.equal(call('downloadCertificate',{id:'cert'},'student').data.pending,true,'downloads must not export PDF inside user request');
let sends=0;ctx.generatePremiumPdf_=(c,persist)=>{assert.equal(held,false);assert.equal(persist,false);pdfOutside=true;return {...c,fileId:'pdf',designVersion:'xpanzia-2-transparent'}};ctx.DriveApp={getFileById:()=>({getBlob:()=> 'pdf',setTrashed(){}})};ctx.MailApp={getRemainingDailyQuota:()=>100,sendEmail:()=>sends++};ctx.actualizarReportes_=()=>assert.equal(held,false);
ctx.procesarPendientes();ctx.procesarPendientes();assert(pdfOutside);assert.equal(sends,1);assert.equal(ctx.get_('Certificates','cert').mailStatus,'sent');assert.equal(held,false);
console.log('PASS V3: migration twice, custom schools, role checks, CRUD, rename preserves course IDs, deletion protection, unsafe images, stale edits, 100 cached reads (not a live load test), cache eviction, busy-before-write, PDF export outside lock, no resend.');

// One hundred independent records, sequential simulated requests, NOT a concurrency benchmark.
const originalUser=ctx.user_;ctx.user_=token=>/^learner-/.test(token)?{id:token,name:token,email:token+'@example.com',role:'student',consentAt:'2026-10-06'}:originalUser(token);
const seed=ctx.get_('Courses','gestion-documental');
for(let i=0;i<100;i++){const token='learner-'+i;assert(call('enroll',{courseId:seed.id},token).ok);for(const lesson of seed.lessons)assert(call('completeLesson',{courseId:seed.id,lessonId:lesson.id},token).ok);const requestId=crypto.randomUUID(),p={courseId:seed.id,requestId,answers:seed.quiz.map(q=>q.correct)};assert(call('submitQuiz',p,token).data.passed);assert(call('submitQuiz',p,token).data.passed);}
ctx.resetRequest_();assert.equal(ctx.rows_('Attempts').length,100);assert.equal(ctx.rows_('Enrollments').length,100);assert.equal(ctx.rows_('Certificates').filter(c=>c.userId.startsWith('learner-')).length,100);
console.log('PASS: 100 separate student records, completion, grading and repeated submissions without duplicate certificates (simulated sequential workload).');
