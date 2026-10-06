const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const client=read('web/certificate.js'),server=read('google-apps-script/Certificate.gs');
assert(server.startsWith(client),'Preview and PDF must use the same field layout');
for(const [fn,file] of [['certificateBackground_','certificate-background.jpg'],['xpanziaLogo_','xpanzia-logo.png']]){
 const fragment=server.slice(server.indexOf('function '+fn),server.indexOf('\n}',server.indexOf('function '+fn))+2);
 const base64=fragment.match(/base64Decode\("([A-Za-z0-9+/=]+)"\)/)[1];
 assert(Buffer.from(base64,'base64').equals(fs.readFileSync(path.join(root,'web/assets',file))),file+' must match embedded PDF asset');
}
const context=vm.createContext({window:{}});vm.runInContext(read('web/config.js'),context);
assert.equal(context.window.UC_CONFIG.company,'Xpanzia Group');assert.equal(context.window.UC_CONFIG.demo,false);assert.equal(typeof context.window.UC_CONFIG.apiUrl,'string');
assert(!read('web/app.js').includes("'uc_token'"));assert(read('web/demo.js').includes('xpanzia_demo_v1'));
assert(read('.github/workflows/pages.yml').includes('path: web'));
const code=read('google-apps-script/Code.gs');assert(code.includes('function generatePdf_(c){return generatePremiumPdf_(c);}'));
let installs=0,templates=0;const setup=vm.createContext({console:{log(){}},PropertiesService:{getScriptProperties:()=>({getProperty:()=>''})}});vm.runInContext(code,setup);setup.actualizarCampusV3=()=>{};setup.instalar=()=>installs++;setup.prepararCertificadoPremium=()=>templates++;setup.instalarXpanzia();assert.equal(installs,1);assert.equal(templates,1);setup.prop_=()=> 'existing';setup.instalarXpanzia();assert.equal(templates,1);
for(const f of ['web/app.js','web/config.js','web/demo.js','google-apps-script/Code.gs'])assert(!read(f).includes('AKfycbz6AQ8YMPXtqQHO0AIT'),'Old production endpoint must never ship');
console.log('PASS: independent configuration/session keys, identical certificate layout/assets, production setup and deployment root.');
