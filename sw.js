const CACHE='hoch-runter-6ea06e0e';
const SHELL=['./','index.html','manifest.webmanifest','icon.svg','app-icon-192.png','app-icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); if(e.request.method!=='GET') return;
  if(u.origin===location.origin){
    // Netz zuerst (für Updates), bei Offline aus dem Cache
    const fromCache=()=>caches.match(e.request).then(r=>r||caches.match('index.html'));
    e.respondWith(fetch(e.request).then(r=>{if(!r.ok) return fromCache().then(c=>c||r); const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r;}).catch(fromCache));
  } else if(u.host.includes('fonts.googleapis.com')||u.host.includes('fonts.gstatic.com')){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res;})));
  }
});
