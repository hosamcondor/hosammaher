import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getFirestore,doc,getDoc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {firebaseConfig} from "./firebase-config.js";
const ok=i=>/^[A-Za-z0-9]{10,40}$/.test(i);
async function go(){
  try{
    if(!firebaseConfig.apiKey||firebaseConfig.apiKey.indexOf("YOUR_")===0) return;
    const db=getFirestore(initializeApp(firebaseConfig));
    const s=await getDoc(doc(db,"site","main"));
    if(s.exists()&&s.data().json){
      window.DATA=Object.assign(JSON.parse(JSON.stringify(window.DEFAULT_DATA)),JSON.parse(s.data().json));
      const ids=[window.DATA.photo,window.DATA.logo].concat(...window.DATA.projects.map(p=>p.images||[])).filter(ok);
      await Promise.all([...new Set(ids)].map(async id=>{
        try{const r=await getDoc(doc(db,"photos",id));if(r.exists())window.PH[id]=r.data().data}catch(e){}
      }));
    }
  }catch(e){console.warn("Using default content:",e)}
  try{const L=window.DATA.logo;if(ok(L)&&window.PH[L]){let k=document.querySelector('link[rel~="icon"]');if(!k){k=document.createElement('link');k.rel='icon';document.head.appendChild(k)}k.href=window.PH[L]}}catch(e){}
  window.__r=1; window.render();
}
go();
