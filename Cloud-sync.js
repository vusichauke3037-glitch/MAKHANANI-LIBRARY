// MAKHANANI V6.7 CLOUD SYNC - Separate File - Works with V6.6 Compat
// No need to edit big index.html - just add <script src="cloud-sync.js"></script>

(function(){
  function getEmis(){
    try{
      if(typeof curSchool !== 'undefined' && curSchool) return String(curSchool);
      if(localStorage.getItem('mk_school')) return localStorage.getItem('mk_school');
      return 'DEMO-SCHOOL';
    }catch(e){ return 'DEMO-SCHOOL'; }
  }
  function getDb(){
    try{ if(typeof db !== 'undefined' && db) return db; }catch(e){}
    try{ if(typeof firebase !== 'undefined' && firebase.firestore) return firebase.firestore(); }catch(e){}
    return null;
  }
  window.saveToCloudV67 = async function(){
    try{
      var fdb = getDb(); if(!fdb) return;
      var emis = getEmis();
      var payload = {
        school: emis,
        schoolName: (typeof curSchoolName !== 'undefined' ? curSchoolName : ''),
        updatedAt: new Date().toISOString(),
        deviceId: (typeof deviceId !== 'undefined' ? deviceId : 'unknown'),
        updatedBy: (typeof curUserEmail !== 'undefined' ? curUserEmail : '')
      };
      // Save ALL mk_ keys automatically - no need to know names
      for(var i=0;i<localStorage.length;i++){
        var k = localStorage.key(i);
        if(k && k.indexOf('mk_')===0){
          try{ payload[k] = JSON.parse(localStorage.getItem(k)); }
          catch(e){ payload[k] = localStorage.getItem(k); }
        }
      }
      await fdb.collection('schools').doc(emis).set(payload, {merge:true});
      var s = document.getElementById('syncStatus');
      if(s) s.innerHTML = '☁️ SYNCED ' + new Date().toLocaleTimeString();
      var l = document.getElementById('lastSyncInfo');
      if(l) l.innerHTML = 'Last Sync: ' + new Date().toLocaleString();
      console.log('☁️ V6.7 Cloud Saved', emis);
    }catch(e){ console.log('Cloud save error', e); }
  };
  window.startCloudListenerV67 = function(){
    try{
      var fdb = getDb(); if(!fdb) return;
      var emis = getEmis();
      fdb.collection('schools').doc(emis).onSnapshot(function(snap){
        if(!snap.exists) return;
        var d = snap.data(); if(!d) return;
        if(d.deviceId && typeof deviceId !== 'undefined' && d.deviceId === deviceId) return;
        // Restore all mk_ keys
        for(var k in d){
          if(k.indexOf('mk_')===0){
            try{ localStorage.setItem(k, JSON.stringify(d[k])); }catch(e){}
          }
        }
        if(typeof renderSubsList === 'function') renderSubsList();
        if(typeof updateSubBanner === 'function') updateSubBanner();
        if(typeof renderAll === 'function') renderAll();
        console.log('☁️ V6.7 Cloud update received');
      });
    }catch(e){ console.log(e); }
  };
  // Auto-start after 3 sec
  setTimeout(function(){
    window.startCloudListenerV67();
    // Auto-save every 30 sec if online
    setInterval(function(){ if(navigator.onLine) window.saveToCloudV67(); }, 30000);
  }, 3000);
  // Save when page hides / closes
  window.addEventListener('beforeunload', function(){ window.saveToCloudV67(); });
})();
