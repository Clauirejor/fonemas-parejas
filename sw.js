const CACHE='fp-pro-v3';
const ASSETS=['/fonemas-parejas/','/fonemas-parejas/index.html','/fonemas-parejas/manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  // No cachear imágenes, audios ni frases — siempre desde red
  if(e.request.url.includes('/imagenes/')||e.request.url.includes('/audios/')||e.request.url.includes('/frases/')){
    e.respondWith(fetch(e.request).catch(()=>new Response('',{status:404})));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{if(res&&res.status===200&&e.request.method==='GET'){const clone=res.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));}return res;}).catch(()=>caches.match('/fonemas-parejas/index.html'))));
});
