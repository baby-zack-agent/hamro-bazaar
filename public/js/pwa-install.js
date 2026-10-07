/* Hamro Bazaar — PWA install UX + standalone detection (Worker 1).
 * Vanilla JS, no frameworks, no new webfonts. Runs as a deferred classic
 * script from Base.astro. Never throws: every external touch is guarded.
 */
(function () {
  'use strict';

  var MAROON = '#8c2b2b';
  var IVORY = '#faf6ef';
  var GOLD = '#c6a15b';
  var INK = '#2b2118';
  var LS_ANDROID = 'hb-pwa-install-v1';   // {at:number} | {never:true}
  var LS_IOS = 'hb-ios-coachmark-v1';     // 'seen'
  var SNOOZE_MS = 30 * 24 * 3600 * 1000;  // nag at most once per 30 days
  var deferredPrompt = null;
  var uiOpen = false;

  /* ---------- helpers ---------- */
  function storeGet(k) {
    try { return window.localStorage.getItem(k); } catch (e) { return null; }
  }
  function storeSet(k, v) {
    try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ }
  }
  function emit(action) {
    try { window.dispatchEvent(new CustomEvent('hb:pwa', { detail: { action: action } })); } catch (e) {}
  }
  function isStandalone() {
    try {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
    } catch (e) {}
    try { return !!window.navigator.standalone; } catch (e) { return false; }
  }
  function isIOS() {
    try {
      var ua = window.navigator.userAgent || '';
      if (/iPad|iPhone|iPod/.test(ua)) return true;
      // iPadOS 13+ reports as MacIntel with touch points
      return window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
    } catch (e) { return false; }
  }

  /* ---------- standalone detection (CSS hook for Worker 2) ---------- */
  function applyStandalone() {
    try {
      if (isStandalone()) document.documentElement.dataset.standalone = 'true';
      else delete document.documentElement.dataset.standalone;
    } catch (e) {}
  }
  applyStandalone();
  try {
    var mql = window.matchMedia('(display-mode: standalone)');
    if (mql && mql.addEventListener) mql.addEventListener('change', applyStandalone);
    else if (mql && mql.addListener) mql.addListener(applyStandalone);
  } catch (e) {}

  /* ---------- shared styles (design system: ivory, maroon, serif/mono) ---------- */
  var cssInjected = false;
  function injectCss() {
    if (cssInjected) return;
    cssInjected = true;
    var css =
      '.hb-pwa{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));' +
      'z-index:2147483000;background:' + IVORY + ';color:' + INK + ';border:1px solid ' + GOLD + ';' +
      'border-radius:18px;box-shadow:0 18px 48px rgba(43,20,20,.28);padding:16px;' +
      'font-family:system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-tap-highlight-color:transparent;}' +
      '.hb-pwa-row{display:flex;gap:12px;align-items:center;}' +
      '.hb-pwa-icon{width:52px;height:52px;border-radius:13px;flex:0 0 auto;background:' + MAROON + ';}' +
      '.hb-pwa-title{font-family:"Tiro Devanagari Hindi",Georgia,serif;font-size:19px;color:' + MAROON + ';margin:0 0 2px;}' +
      '.hb-pwa-sub{font-size:13px;line-height:1.45;margin:0;opacity:.78;}' +
      '.hb-pwa-steps{margin:10px 0 0;padding:0;list-style:none;font-size:13.5px;line-height:1.5;}' +
      '.hb-pwa-steps li{display:flex;gap:10px;align-items:flex-start;margin:7px 0;}' +
      '.hb-pwa-n{flex:0 0 auto;width:22px;height:22px;border-radius:50%;background:' + MAROON + ';color:' + IVORY + ';' +
      'font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px;}' +
      '.hb-pwa-actions{display:flex;gap:10px;margin-top:14px;}' +
      '.hb-pwa-btn{flex:1;border:0;border-radius:999px;padding:12px 16px;font-size:15px;font-weight:700;cursor:pointer;}' +
      '.hb-pwa-install{background:' + MAROON + ';color:' + IVORY + ';}' +
      '.hb-pwa-later{background:transparent;color:' + MAROON + ';border:1.5px solid ' + MAROON + ';}';
    var st = document.createElement('style');
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  function closeSheet(el) {
    uiOpen = false;
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function buildSheet(o) {
    injectCss();
    var box = document.createElement('div');
    box.className = 'hb-pwa';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', o.title);
    var steps = o.steps ? '<ol class="hb-pwa-steps">' + o.steps + '</ol>' : '';
    box.innerHTML =
      '<div class="hb-pwa-row">' +
        '<img class="hb-pwa-icon" src="/icons/icon-192.png" width="52" height="52" alt="" />' +
        '<div><p class="hb-pwa-title">' + o.title + '</p><p class="hb-pwa-sub">' + o.sub + '</p></div>' +
      '</div>' + steps +
      '<div class="hb-pwa-actions">' +
        '<button type="button" class="hb-pwa-btn hb-pwa-install">' + o.primaryLabel + '</button>' +
        '<button type="button" class="hb-pwa-btn hb-pwa-later">' + o.secondaryLabel + '</button>' +
      '</div>';
    var btns = box.querySelectorAll('button');
    btns[0].addEventListener('click', function () { closeSheet(box); o.onPrimary(); });
    btns[1].addEventListener('click', function () {
      closeSheet(box);
      if (o.dismissKey) storeSet(o.dismissKey, o.dismissValue);
      emit(o.dismissEvent || 'dismissed');
    });
    document.body.appendChild(box);
    uiOpen = true;
    return box;
  }

  /* ---------- Android / Chrome: beforeinstallprompt ---------- */
  function snoozed() {
    var raw = storeGet(LS_ANDROID);
    if (!raw) return false;
    try {
      var t = JSON.parse(raw);
      if (t && t.never) return true;
      return !!(t && t.at && (Date.now() - t.at) < SNOOZE_MS);
    } catch (e) { return false; }
  }

  function showAndroidSheet() {
    if (uiOpen || isStandalone() || snoozed() || !deferredPrompt) return;
    buildSheet({
      title: 'Install Hamro Bazaar',
      sub: 'One tap on your home screen — no app store needed.',
      steps: '',
      primaryLabel: 'Install',
      onPrimary: function () {
        var p = deferredPrompt;
        deferredPrompt = null;
        if (!p) return;
        try {
          var pr = p.prompt();
          if (pr && pr.then) {
            pr.then(function () {
              try {
                p.userChoice.then(function (choice) {
                  if (choice && choice.outcome === 'accepted') {
                    storeSet(LS_ANDROID, JSON.stringify({ never: true }));
                    emit('installed');
                  } else {
                    storeSet(LS_ANDROID, JSON.stringify({ at: Date.now() }));
                    emit('dismissed');
                  }
                }).catch(function () {});
              } catch (e) {}
            }).catch(function () {});
          }
        } catch (e) {}
      },
      secondaryLabel: 'Not now',
      dismissKey: LS_ANDROID,
      dismissValue: JSON.stringify({ at: Date.now() }),
      dismissEvent: 'dismissed'
    });
    emit('sheet-shown');
  }

  try {
    window.addEventListener('beforeinstallprompt', function (e) {
      try { e.preventDefault(); } catch (err) {}
      deferredPrompt = e;
      // Small delay so it never ambushes the first paint.
      setTimeout(showAndroidSheet, 2500);
    });
  } catch (e) {}

  // If the app gets installed while open, stop nagging forever.
  try {
    window.addEventListener('appinstalled', function () {
      storeSet(LS_ANDROID, JSON.stringify({ never: true }));
      deferredPrompt = null;
      emit('installed');
    });
  } catch (e) {}

  /* ---------- iOS: one-time Share → Add to Home Screen coachmark ---------- */
  function showIOSCoachmark() {
    if (uiOpen || isStandalone() || storeGet(LS_IOS)) return;
    var shareIcon =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 15V3"/><path d="M7 8l5-5 5 5"/><path d="M5 12v8h14v-8"/></svg>';
    var steps =
      '<li><span class="hb-pwa-n">1</span><span>Tap the <b>Share</b> button ' + shareIcon + ' in Safari</span></li>' +
      '<li><span class="hb-pwa-n">2</span><span>Choose <b>Add to Home Screen</b></span></li>' +
      '<li><span class="hb-pwa-n">3</span><span>Tap <b>Add</b> — done</span></li>';
    buildSheet({
      title: 'Add to Home Screen',
      sub: 'Get Hamro Bazaar as an app icon — it takes 10 seconds.',
      steps: steps,
      primaryLabel: 'Got it',
      onPrimary: function () { storeSet(LS_IOS, 'seen'); emit('ios-coachmark-dismissed'); },
      secondaryLabel: 'Later',
      dismissKey: LS_IOS,
      dismissValue: 'seen',
      dismissEvent: 'ios-coachmark-dismissed'
    });
    emit('ios-coachmark-shown');
  }

  if (isIOS() && !isStandalone() && !storeGet(LS_IOS)) {
    setTimeout(showIOSCoachmark, 3000);
  }
})();
