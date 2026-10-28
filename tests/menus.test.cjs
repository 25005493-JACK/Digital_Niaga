const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
test('saving menus preserves other stalls and stored values',()=>{
 const data=new Map(); const events=[]; const exports={};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/menus.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,require:()=>({ONE_MAIN_STALLS:[]}),localStorage:{getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)},window:{dispatchEvent:e=>events.push(e)},Event:class{constructor(type){this.type=type}}});
 exports.saveMenu('stall-01',[{id:'a'}]); exports.saveMenu('stall-02',[]);
 assert.equal(exports.readMenus()['stall-01'][0].id,'a'); assert.equal(events.length,2);
 const before=JSON.stringify(exports.readMenus()); exports.readMenus()['stall-01'].push({id:'b'}); assert.equal(JSON.stringify(exports.readMenus()),before);
});
