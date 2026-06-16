(async () => {
  (function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const i of document.querySelectorAll('link[rel="modulepreload"]')) n(i);
    new MutationObserver((i) => {
      for (const _ of i) if (_.type === "childList") for (const l of _.addedNodes) l.tagName === "LINK" && l.rel === "modulepreload" && n(l);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function r(i) {
      const _ = {};
      return i.integrity && (_.integrity = i.integrity), i.referrerPolicy && (_.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? _.credentials = "include" : i.crossOrigin === "anonymous" ? _.credentials = "omit" : _.credentials = "same-origin", _;
    }
    function n(i) {
      if (i.ep) return;
      i.ep = true;
      const _ = r(i);
      fetch(i.href, _);
    }
  })();
  const cn = false, dn = (t, e) => t === e, rr = Symbol("solid-track"), ct = {
    equals: dn
  };
  let nr = _r;
  const Le = 1, dt = 2, sr = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var te = null;
  let xt = null, un = null, ee = null, ae = null, Se = null, yt = 0;
  function Ve(t, e) {
    const r = ee, n = te, i = t.length === 0, _ = e === void 0 ? n : e, l = i ? sr : {
      owned: null,
      cleanups: null,
      context: _ ? _.context : null,
      owner: _
    }, s = i ? t : () => t(() => be(() => We(l)));
    te = l, ee = null;
    try {
      return Je(s, true);
    } finally {
      ee = r, te = n;
    }
  }
  function f(t, e) {
    e = e ? Object.assign({}, ct, e) : ct;
    const r = {
      value: t,
      observers: null,
      observerSlots: null,
      comparator: e.equals || void 0
    }, n = (i) => (typeof i == "function" && (i = i(r.value)), ir(r, i));
    return [
      or.bind(r),
      n
    ];
  }
  function D(t, e, r) {
    const n = Et(t, e, false, Le);
    Ye(n);
  }
  function pn(t, e, r) {
    nr = yn;
    const n = Et(t, e, false, Le);
    n.user = true, Se ? Se.push(n) : Ye(n);
  }
  function fe(t, e, r) {
    r = r ? Object.assign({}, ct, r) : ct;
    const n = Et(t, e, true, 0);
    return n.observers = null, n.observerSlots = null, n.comparator = r.equals || void 0, Ye(n), or.bind(n);
  }
  function be(t) {
    if (ee === null) return t();
    const e = ee;
    ee = null;
    try {
      return t();
    } finally {
      ee = e;
    }
  }
  function Ie(t) {
    return te === null || (te.cleanups === null ? te.cleanups = [
      t
    ] : te.cleanups.push(t)), t;
  }
  function hn(t) {
    const e = fe(t), r = fe(() => jt(e()));
    return r.toArray = () => {
      const n = r();
      return Array.isArray(n) ? n : n != null ? [
        n
      ] : [];
    }, r;
  }
  function or() {
    if (this.sources && this.state) if (this.state === Le) Ye(this);
    else {
      const t = ae;
      ae = null, Je(() => pt(this), false), ae = t;
    }
    if (ee) {
      const t = this.observers ? this.observers.length : 0;
      ee.sources ? (ee.sources.push(this), ee.sourceSlots.push(t)) : (ee.sources = [
        this
      ], ee.sourceSlots = [
        t
      ]), this.observers ? (this.observers.push(ee), this.observerSlots.push(ee.sources.length - 1)) : (this.observers = [
        ee
      ], this.observerSlots = [
        ee.sources.length - 1
      ]);
    }
    return this.value;
  }
  function ir(t, e, r) {
    let n = t.value;
    return (!t.comparator || !t.comparator(n, e)) && (t.value = e, t.observers && t.observers.length && Je(() => {
      for (let i = 0; i < t.observers.length; i += 1) {
        const _ = t.observers[i], l = xt && xt.running;
        l && xt.disposed.has(_), (l ? !_.tState : !_.state) && (_.pure ? ae.push(_) : Se.push(_), _.observers && lr(_)), l || (_.state = Le);
      }
      if (ae.length > 1e6) throw ae = [], new Error();
    }, false)), e;
  }
  function Ye(t) {
    if (!t.fn) return;
    We(t);
    const e = yt;
    gn(t, t.value, e);
  }
  function gn(t, e, r) {
    let n;
    const i = te, _ = ee;
    ee = te = t;
    try {
      n = t.fn(e);
    } catch (l) {
      return t.pure && (t.state = Le, t.owned && t.owned.forEach(We), t.owned = null), t.updatedAt = r + 1, ar(l);
    } finally {
      ee = _, te = i;
    }
    (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? ir(t, n) : t.value = n, t.updatedAt = r);
  }
  function Et(t, e, r, n = Le, i) {
    const _ = {
      fn: t,
      state: n,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: e,
      owner: te,
      context: te ? te.context : null,
      pure: r
    };
    return te === null || te !== sr && (te.owned ? te.owned.push(_) : te.owned = [
      _
    ]), _;
  }
  function ut(t) {
    if (t.state === 0) return;
    if (t.state === dt) return pt(t);
    if (t.suspense && be(t.suspense.inFallback)) return t.suspense.effects.push(t);
    const e = [
      t
    ];
    for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < yt); ) t.state && e.push(t);
    for (let r = e.length - 1; r >= 0; r--) if (t = e[r], t.state === Le) Ye(t);
    else if (t.state === dt) {
      const n = ae;
      ae = null, Je(() => pt(t, e[0]), false), ae = n;
    }
  }
  function Je(t, e) {
    if (ae) return t();
    let r = false;
    e || (ae = []), Se ? r = true : Se = [], yt++;
    try {
      const n = t();
      return fn(r), n;
    } catch (n) {
      r || (Se = null), ae = null, ar(n);
    }
  }
  function fn(t) {
    if (ae && (_r(ae), ae = null), t) return;
    const e = Se;
    Se = null, e.length && Je(() => nr(e), false);
  }
  function _r(t) {
    for (let e = 0; e < t.length; e++) ut(t[e]);
  }
  function yn(t) {
    let e, r = 0;
    for (e = 0; e < t.length; e++) {
      const n = t[e];
      n.user ? t[r++] = n : ut(n);
    }
    for (e = 0; e < r; e++) ut(t[e]);
  }
  function pt(t, e) {
    t.state = 0;
    for (let r = 0; r < t.sources.length; r += 1) {
      const n = t.sources[r];
      if (n.sources) {
        const i = n.state;
        i === Le ? n !== e && (!n.updatedAt || n.updatedAt < yt) && ut(n) : i === dt && pt(n, e);
      }
    }
  }
  function lr(t) {
    for (let e = 0; e < t.observers.length; e += 1) {
      const r = t.observers[e];
      r.state || (r.state = dt, r.pure ? ae.push(r) : Se.push(r), r.observers && lr(r));
    }
  }
  function We(t) {
    let e;
    if (t.sources) for (; t.sources.length; ) {
      const r = t.sources.pop(), n = t.sourceSlots.pop(), i = r.observers;
      if (i && i.length) {
        const _ = i.pop(), l = r.observerSlots.pop();
        n < i.length && (_.sourceSlots[l] = n, i[n] = _, r.observerSlots[n] = l);
      }
    }
    if (t.tOwned) {
      for (e = t.tOwned.length - 1; e >= 0; e--) We(t.tOwned[e]);
      delete t.tOwned;
    }
    if (t.owned) {
      for (e = t.owned.length - 1; e >= 0; e--) We(t.owned[e]);
      t.owned = null;
    }
    if (t.cleanups) {
      for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
      t.cleanups = null;
    }
    t.state = 0;
  }
  function wn(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function ar(t, e = te) {
    throw wn(t);
  }
  function jt(t) {
    if (typeof t == "function" && !t.length) return jt(t());
    if (Array.isArray(t)) {
      const e = [];
      for (let r = 0; r < t.length; r++) {
        const n = jt(t[r]);
        Array.isArray(n) ? e.push.apply(e, n) : e.push(n);
      }
      return e;
    }
    return t;
  }
  const Pt = Symbol("fallback");
  function ht(t) {
    for (let e = 0; e < t.length; e++) t[e]();
  }
  function bn(t, e, r = {}) {
    let n = [], i = [], _ = [], l = 0, s = e.length > 1 ? [] : null;
    return Ie(() => ht(_)), () => {
      let c = t() || [], p = c.length, $, b;
      return c[rr], be(() => {
        let C, G, V, X, F, L, M, K, H;
        if (p === 0) l !== 0 && (ht(_), _ = [], n = [], i = [], l = 0, s && (s = [])), r.fallback && (n = [
          Pt
        ], i[0] = Ve((se) => (_[0] = se, r.fallback())), l = 1);
        else if (l === 0) {
          for (i = new Array(p), b = 0; b < p; b++) n[b] = c[b], i[b] = Ve(B);
          l = p;
        } else {
          for (V = new Array(p), X = new Array(p), s && (F = new Array(p)), L = 0, M = Math.min(l, p); L < M && n[L] === c[L]; L++) ;
          for (M = l - 1, K = p - 1; M >= L && K >= L && n[M] === c[K]; M--, K--) V[K] = i[M], X[K] = _[M], s && (F[K] = s[M]);
          for (C = /* @__PURE__ */ new Map(), G = new Array(K + 1), b = K; b >= L; b--) H = c[b], $ = C.get(H), G[b] = $ === void 0 ? -1 : $, C.set(H, b);
          for ($ = L; $ <= M; $++) H = n[$], b = C.get(H), b !== void 0 && b !== -1 ? (V[b] = i[$], X[b] = _[$], s && (F[b] = s[$]), b = G[b], C.set(H, b)) : _[$]();
          for (b = L; b < p; b++) b in V ? (i[b] = V[b], _[b] = X[b], s && (s[b] = F[b], s[b](b))) : i[b] = Ve(B);
          i = i.slice(0, l = p), n = c.slice(0);
        }
        return i;
      });
      function B(C) {
        if (_[b] = C, s) {
          const [G, V] = f(b);
          return s[b] = V, e(c[b], G);
        }
        return e(c[b]);
      }
    };
  }
  function mn(t, e, r = {}) {
    let n = [], i = [], _ = [], l = [], s = 0, c;
    return Ie(() => ht(_)), () => {
      const p = t() || [], $ = p.length;
      return p[rr], be(() => {
        if ($ === 0) return s !== 0 && (ht(_), _ = [], n = [], i = [], s = 0, l = []), r.fallback && (n = [
          Pt
        ], i[0] = Ve((B) => (_[0] = B, r.fallback())), s = 1), i;
        for (n[0] === Pt && (_[0](), _ = [], n = [], i = [], s = 0), c = 0; c < $; c++) c < n.length && n[c] !== p[c] ? l[c](() => p[c]) : c >= n.length && (i[c] = Ve(b));
        for (; c < n.length; c++) _[c]();
        return s = l.length = _.length = $, n = p.slice(0), i = i.slice(0, s);
      });
      function b(B) {
        _[c] = B;
        const [C, G] = f(p[c]);
        return l[c] = G, e(C, c);
      }
    };
  }
  function d(t, e) {
    return be(() => t(e || {}));
  }
  const cr = (t) => `Stale read from <${t}>.`;
  function gt(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return fe(bn(() => t.each, t.children, e || void 0));
  }
  function U(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return fe(mn(() => t.each, t.children, e || void 0));
  }
  function R(t) {
    const e = t.keyed, r = fe(() => t.when, void 0, void 0), n = e ? r : fe(r, void 0, {
      equals: (i, _) => !i == !_
    });
    return fe(() => {
      const i = n();
      if (i) {
        const _ = t.children;
        return typeof _ == "function" && _.length > 0 ? be(() => _(e ? i : () => {
          if (!be(n)) throw cr("Show");
          return r();
        })) : _;
      }
      return t.fallback;
    }, void 0, void 0);
  }
  function dr(t) {
    const e = hn(() => t.children), r = fe(() => {
      const n = e(), i = Array.isArray(n) ? n : [
        n
      ];
      let _ = () => {
      };
      for (let l = 0; l < i.length; l++) {
        const s = l, c = i[l], p = _, $ = fe(() => p() ? void 0 : c.when, void 0, void 0), b = c.keyed ? $ : fe($, void 0, {
          equals: (B, C) => !B == !C
        });
        _ = () => p() || (b() ? [
          s,
          $,
          c
        ] : void 0);
      }
      return _;
    });
    return fe(() => {
      const n = r()();
      if (!n) return t.fallback;
      const [i, _, l] = n, s = l.children;
      return typeof s == "function" && s.length > 0 ? be(() => s(l.keyed ? _() : () => {
        var _a2;
        if (((_a2 = be(r)()) == null ? void 0 : _a2[0]) !== i) throw cr("Match");
        return _();
      })) : s;
    }, void 0, void 0);
  }
  function qe(t) {
    return t;
  }
  const ze = (t) => fe(() => t());
  function xn(t, e, r) {
    let n = r.length, i = e.length, _ = n, l = 0, s = 0, c = e[i - 1].nextSibling, p = null;
    for (; l < i || s < _; ) {
      if (e[l] === r[s]) {
        l++, s++;
        continue;
      }
      for (; e[i - 1] === r[_ - 1]; ) i--, _--;
      if (i === l) {
        const $ = _ < n ? s ? r[s - 1].nextSibling : r[_ - s] : c;
        for (; s < _; ) t.insertBefore(r[s++], $);
      } else if (_ === s) for (; l < i; ) (!p || !p.has(e[l])) && e[l].remove(), l++;
      else if (e[l] === r[_ - 1] && r[s] === e[i - 1]) {
        const $ = e[--i].nextSibling;
        t.insertBefore(r[s++], e[l++].nextSibling), t.insertBefore(r[--_], $), e[i] = r[_];
      } else {
        if (!p) {
          p = /* @__PURE__ */ new Map();
          let b = s;
          for (; b < _; ) p.set(r[b], b++);
        }
        const $ = p.get(e[l]);
        if ($ != null) if (s < $ && $ < _) {
          let b = l, B = 1, C;
          for (; ++b < i && b < _ && !((C = p.get(e[b])) == null || C !== $ + B); ) B++;
          if (B > $ - s) {
            const G = e[l];
            for (; s < $; ) t.insertBefore(r[s++], G);
          } else t.replaceChild(r[s++], e[l++]);
        } else l++;
        else e[l++].remove();
      }
    }
  }
  const Mt = "_$DX_DELEGATE";
  function vn(t, e, r, n = {}) {
    let i;
    return Ve((_) => {
      i = _, e === document ? t() : g(e, t(), e.firstChild ? null : void 0, r);
    }, n.owner), () => {
      i(), e.textContent = "";
    };
  }
  function w(t, e, r, n) {
    let i;
    const _ = () => {
      const s = n ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
      return s.innerHTML = t, r ? s.content.firstChild.firstChild : n ? s.firstChild : s.content.firstChild;
    }, l = e ? () => be(() => document.importNode(i || (i = _()), true)) : () => (i || (i = _())).cloneNode(true);
    return l.cloneNode = l, l;
  }
  function wt(t, e = window.document) {
    const r = e[Mt] || (e[Mt] = /* @__PURE__ */ new Set());
    for (let n = 0, i = t.length; n < i; n++) {
      const _ = t[n];
      r.has(_) || (r.add(_), e.addEventListener(_, kn));
    }
  }
  function h(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function st(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function $n(t, e, r) {
    return be(() => t(e, r));
  }
  function g(t, e, r, n) {
    if (r !== void 0 && !n && (n = []), typeof e != "function") return ft(t, e, n, r);
    D((i) => ft(t, e(), i, r), n);
  }
  function kn(t) {
    let e = t.target;
    const r = `$$${t.type}`, n = t.target, i = t.currentTarget, _ = (c) => Object.defineProperty(t, "target", {
      configurable: true,
      value: c
    }), l = () => {
      const c = e[r];
      if (c && !e.disabled) {
        const p = e[`${r}Data`];
        if (p !== void 0 ? c.call(e, p, t) : c.call(e, t), t.cancelBubble) return;
      }
      return e.host && typeof e.host != "string" && !e.host._$host && e.contains(t.target) && _(e.host), true;
    }, s = () => {
      for (; l() && (e = e._$host || e.parentNode || e.host); ) ;
    };
    if (Object.defineProperty(t, "currentTarget", {
      configurable: true,
      get() {
        return e || document;
      }
    }), t.composedPath) {
      const c = t.composedPath();
      _(c[0]);
      for (let p = 0; p < c.length - 2 && (e = c[p], !!l()); p++) {
        if (e._$host) {
          e = e._$host, s();
          break;
        }
        if (e.parentNode === i) break;
      }
    } else s();
    _(n);
  }
  function ft(t, e, r, n, i) {
    for (; typeof r == "function"; ) r = r();
    if (e === r) return r;
    const _ = typeof e, l = n !== void 0;
    if (t = l && r[0] && r[0].parentNode || t, _ === "string" || _ === "number") {
      if (_ === "number" && (e = e.toString(), e === r)) return r;
      if (l) {
        let s = r[0];
        s && s.nodeType === 3 ? s.data !== e && (s.data = e) : s = document.createTextNode(e), r = Ke(t, r, n, s);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || _ === "boolean") r = Ke(t, r, n);
    else {
      if (_ === "function") return D(() => {
        let s = e();
        for (; typeof s == "function"; ) s = s();
        r = ft(t, s, r, n);
      }), () => r;
      if (Array.isArray(e)) {
        const s = [], c = r && Array.isArray(r);
        if (Tt(s, e, r, i)) return D(() => r = ft(t, s, r, n, true)), () => r;
        if (s.length === 0) {
          if (r = Ke(t, r, n), l) return r;
        } else c ? r.length === 0 ? Bt(t, s, n) : xn(t, r, s) : (r && Ke(t), Bt(t, s));
        r = s;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (l) return r = Ke(t, r, n, e);
          Ke(t, r, null, e);
        } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
        r = e;
      }
    }
    return r;
  }
  function Tt(t, e, r, n) {
    let i = false;
    for (let _ = 0, l = e.length; _ < l; _++) {
      let s = e[_], c = r && r[t.length], p;
      if (!(s == null || s === true || s === false)) if ((p = typeof s) == "object" && s.nodeType) t.push(s);
      else if (Array.isArray(s)) i = Tt(t, s, c) || i;
      else if (p === "function") if (n) {
        for (; typeof s == "function"; ) s = s();
        i = Tt(t, Array.isArray(s) ? s : [
          s
        ], Array.isArray(c) ? c : [
          c
        ]) || i;
      } else t.push(s), i = true;
      else {
        const $ = String(s);
        c && c.nodeType === 3 && c.data === $ ? t.push(c) : t.push(document.createTextNode($));
      }
    }
    return i;
  }
  function Bt(t, e, r = null) {
    for (let n = 0, i = e.length; n < i; n++) t.insertBefore(e[n], r);
  }
  function Ke(t, e, r, n) {
    if (r === void 0) return t.textContent = "";
    const i = n || document.createTextNode("");
    if (e.length) {
      let _ = false;
      for (let l = e.length - 1; l >= 0; l--) {
        const s = e[l];
        if (i !== s) {
          const c = s.parentNode === t;
          !_ && !l ? c ? t.replaceChild(i, s) : t.insertBefore(i, r) : c && s.remove();
        } else _ = true;
      }
    } else t.insertBefore(i, r);
    return [
      i
    ];
  }
  const Dn = "" + new URL("ntools_rs_bg-C8WUW8zJ.wasm", import.meta.url).href, Sn = async (t = {}, e) => {
    let r;
    if (e.startsWith("data:")) {
      const n = e.replace(/^data:.*?base64,/, "");
      let i;
      if (typeof Buffer == "function" && typeof Buffer.from == "function") i = Buffer.from(n, "base64");
      else if (typeof atob == "function") {
        const _ = atob(n);
        i = new Uint8Array(_.length);
        for (let l = 0; l < _.length; l++) i[l] = _.charCodeAt(l);
      } else throw new Error("Cannot decode base64-encoded data URL");
      r = await WebAssembly.instantiate(i, t);
    } else {
      const n = await fetch(e), i = n.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && i.startsWith("application/wasm")) r = await WebAssembly.instantiateStreaming(n, t);
      else {
        const _ = await n.arrayBuffer();
        r = await WebAssembly.instantiate(_, t);
      }
    }
    return r.instance.exports;
  };
  let o;
  function jn(t) {
    o = t;
  }
  let ot = null;
  function Ue() {
    return (ot === null || ot.byteLength === 0) && (ot = new Uint8Array(o.memory.buffer)), ot;
  }
  let at = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  at.decode();
  const Pn = 2146435072;
  let vt = 0;
  function Tn(t, e) {
    return vt += e, vt >= Pn && (at = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), at.decode(), vt = e), at.decode(Ue().subarray(t, t + e));
  }
  function De(t, e) {
    return t = t >>> 0, Tn(t, e);
  }
  function ur(t, e) {
    return t = t >>> 0, Ue().subarray(t / 1, t / 1 + e);
  }
  let Te = 0;
  function it(t, e) {
    const r = e(t.length * 1, 1) >>> 0;
    return Ue().set(t, r / 1), Te = t.length, r;
  }
  function _t(t) {
    const e = o.__wbindgen_externrefs.get(t);
    return o.__externref_table_dealloc(t), e;
  }
  const Fe = new TextEncoder();
  "encodeInto" in Fe || (Fe.encodeInto = function(t, e) {
    const r = Fe.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function Ln(t, e, r) {
    if (r === void 0) {
      const s = Fe.encode(t), c = e(s.length, 1) >>> 0;
      return Ue().subarray(c, c + s.length).set(s), Te = s.length, c;
    }
    let n = t.length, i = e(n, 1) >>> 0;
    const _ = Ue();
    let l = 0;
    for (; l < n; l++) {
      const s = t.charCodeAt(l);
      if (s > 127) break;
      _[i + l] = s;
    }
    if (l !== n) {
      l !== 0 && (t = t.slice(l)), i = r(i, n, n = l + t.length * 3, 1) >>> 0;
      const s = Ue().subarray(i + l, i + n), c = Fe.encodeInto(t, s);
      l += c.written, i = r(i, n, l, 1) >>> 0;
    }
    return Te = l, i;
  }
  let lt = null;
  function En() {
    return (lt === null || lt.byteLength === 0) && (lt = new Float64Array(o.memory.buffer)), lt;
  }
  function He(t, e) {
    return t = t >>> 0, En().subarray(t / 8, t / 8 + e);
  }
  let Ge = null;
  function Nn() {
    return (Ge === null || Ge.buffer.detached === true || Ge.buffer.detached === void 0 && Ge.buffer !== o.memory.buffer) && (Ge = new DataView(o.memory.buffer)), Ge;
  }
  function It(t, e) {
    t = t >>> 0;
    const r = Nn(), n = [];
    for (let i = t; i < t + 4 * e; i += 4) n.push(o.__wbindgen_externrefs.get(r.getUint32(i, true)));
    return o.__externref_drop_slice(t, e), n;
  }
  function An(t, e) {
    if (!(t instanceof e)) throw new Error(`expected instance of ${e.name}`);
  }
  const Ot = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => o.__wbg_editor_free(t >>> 0, 1));
  class Oe {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Oe.prototype);
      return r.__wbg_ptr = e, Ot.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Ot.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      o.__wbg_editor_free(e, 0);
    }
    export_map() {
      const e = o.editor_export_map(this.__wbg_ptr);
      var r = ur(e[0], e[1]).slice();
      return o.__wbindgen_free(e[0], e[1] * 1, 1), r;
    }
    press_dash() {
      o.editor_press_dash(this.__wbg_ptr);
    }
    press_down(e) {
      o.editor_press_down(this.__wbg_ptr, e);
    }
    press_left(e) {
      o.editor_press_left(this.__wbg_ptr, e);
    }
    tiles_path() {
      let e, r;
      try {
        const n = o.editor_tiles_path(this.__wbg_ptr);
        return e = n[0], r = n[1], De(n[0], n[1]);
      } finally {
        o.__wbindgen_free(e, r, 1);
      }
    }
    crosshair_x() {
      return o.editor_crosshair_x(this.__wbg_ptr);
    }
    crosshair_y() {
      return o.editor_crosshair_y(this.__wbg_ptr);
    }
    cursor_down(e) {
      o.editor_cursor_down(this.__wbg_ptr, e);
    }
    press_comma() {
      o.editor_press_comma(this.__wbg_ptr);
    }
    press_enter() {
      o.editor_press_enter(this.__wbg_ptr);
    }
    press_num_0() {
      o.editor_press_num_0(this.__wbg_ptr);
    }
    press_num_1() {
      o.editor_press_num_1(this.__wbg_ptr);
    }
    press_num_2() {
      o.editor_press_num_1(this.__wbg_ptr);
    }
    press_num_3() {
      o.editor_press_num_3(this.__wbg_ptr);
    }
    press_num_4() {
      o.editor_press_num_4(this.__wbg_ptr);
    }
    press_num_5() {
      o.editor_press_num_1(this.__wbg_ptr);
    }
    press_num_7() {
      o.editor_press_num_7(this.__wbg_ptr);
    }
    press_right(e) {
      o.editor_press_right(this.__wbg_ptr, e);
    }
    press_shift() {
      o.editor_press_shift(this.__wbg_ptr);
    }
    press_slash() {
      o.editor_press_slash(this.__wbg_ptr);
    }
    press_space() {
      o.editor_press_space(this.__wbg_ptr);
    }
    double_click(e) {
      o.editor_double_click(this.__wbg_ptr, e);
    }
    load_attract(e, r, n) {
      const i = it(e, o.__wbindgen_malloc), _ = Te, l = o.editor_load_attract(this.__wbg_ptr, i, _, r, n);
      if (l[2]) throw _t(l[1]);
      return Me.__wrap(l[0]);
    }
    past_ninja_x(e) {
      return o.editor_past_ninja_x(this.__wbg_ptr, e);
    }
    past_ninja_y(e) {
      return o.editor_past_ninja_y(this.__wbg_ptr, e);
    }
    press_equals() {
      o.editor_press_equals(this.__wbg_ptr);
    }
    press_escape() {
      return o.editor_press_escape(this.__wbg_ptr) !== 0;
    }
    release_shift() {
      o.editor_release_shift(this.__wbg_ptr);
    }
    release_space() {
      o.editor_release_space(this.__wbg_ptr);
    }
    set_anim_data(e) {
      const r = it(e, o.__wbindgen_malloc), n = Te;
      o.editor_set_anim_data(this.__wbg_ptr, r, n);
    }
    get_anim_state() {
      return o.editor_get_anim_state(this.__wbg_ptr) >>> 0;
    }
    get_level_name() {
      let e, r;
      try {
        const n = o.editor_get_level_name(this.__wbg_ptr);
        return e = n[0], r = n[1], De(n[0], n[1]);
      } finally {
        o.__wbindgen_free(e, r, 1);
      }
    }
    get_show_trail() {
      return o.editor_get_show_trail(this.__wbg_ptr) !== 0;
    }
    press_alt_left(e) {
      o.editor_press_alt_left(this.__wbg_ptr, e);
    }
    press_backtick() {
      o.editor_press_backtick(this.__wbg_ptr);
    }
    set_cursor_pos(e, r, n) {
      return o.editor_set_cursor_pos(this.__wbg_ptr, e, r, n) !== 0;
    }
    set_level_name(e) {
      const r = Ln(e, o.__wbindgen_malloc, o.__wbindgen_realloc), n = Te;
      o.editor_set_level_name(this.__wbg_ptr, r, n);
    }
    set_show_trail(e) {
      o.editor_set_show_trail(this.__wbg_ptr, e);
    }
    show_half_grid() {
      return o.editor_show_half_grid(this.__wbg_ptr) !== 0;
    }
    fill_with_mines() {
      o.editor_fill_with_mines(this.__wbg_ptr);
    }
    past_ninjas_len() {
      return o.editor_past_ninjas_len(this.__wbg_ptr) >>> 0;
    }
    palette_center_x() {
      return o.editor_palette_center_x(this.__wbg_ptr);
    }
    palette_center_y() {
      return o.editor_palette_center_y(this.__wbg_ptr);
    }
    past_ninja_bones() {
      const e = o.editor_past_ninja_bones(this.__wbg_ptr);
      var r = He(e[0], e[1]).slice();
      return o.__wbindgen_free(e[0], e[1] * 8, 8), r;
    }
    preview_entities() {
      const e = o.editor_preview_entities(this.__wbg_ptr);
      var r = It(e[0], e[1]).slice();
      return o.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    release_alt_left() {
      o.editor_release_alt_left(this.__wbg_ptr);
    }
    load_outte_replay(e, r, n) {
      const i = it(e, o.__wbindgen_malloc), _ = Te, l = o.editor_load_outte_replay(this.__wbg_ptr, i, _, r, n);
      if (l[2]) throw _t(l[1]);
      return Me.__wrap(l[0]);
    }
    show_quarter_grid() {
      return o.editor_show_quarter_grid(this.__wbg_ptr) !== 0;
    }
    press_bracket_left() {
      o.editor_press_bracket_left(this.__wbg_ptr);
    }
    tile_crosshair_col() {
      return o.editor_tile_crosshair_col(this.__wbg_ptr);
    }
    tile_crosshair_row() {
      return o.editor_tile_crosshair_row(this.__wbg_ptr);
    }
    loop_locations_path() {
      let e, r;
      try {
        const n = o.editor_loop_locations_path(this.__wbg_ptr);
        return e = n[0], r = n[1], De(n[0], n[1]);
      } finally {
        o.__wbindgen_free(e, r, 1);
      }
    }
    palette_selection_x() {
      return o.editor_palette_selection_x(this.__wbg_ptr);
    }
    palette_selection_y() {
      return o.editor_palette_selection_y(this.__wbg_ptr);
    }
    press_bracket_right() {
      o.editor_press_bracket_right(this.__wbg_ptr);
    }
    receive_past_ninjas() {
      o.editor_receive_past_ninjas(this.__wbg_ptr);
    }
    selected_tiles_path() {
      let e, r;
      try {
        const n = o.editor_selected_tiles_path(this.__wbg_ptr);
        return e = n[0], r = n[1], De(n[0], n[1]);
      } finally {
        o.__wbindgen_free(e, r, 1);
      }
    }
    set_start_replay_paused(e) {
      o.editor_set_start_replay_paused(this.__wbg_ptr, e);
    }
    selected_tile_outline_path() {
      let e, r;
      try {
        const n = o.editor_selected_tile_outline_path(this.__wbg_ptr);
        return e = n[0], r = n[1], De(n[0], n[1]);
      } finally {
        o.__wbindgen_free(e, r, 1);
      }
    }
    static new() {
      const e = o.editor_new();
      return Oe.__wrap(e);
    }
    mode() {
      return o.editor_mode(this.__wbg_ptr) >>> 0;
    }
    redo() {
      o.editor_redo(this.__wbg_ptr);
    }
    undo() {
      o.editor_undo(this.__wbg_ptr);
    }
    press_0() {
      o.editor_press_0(this.__wbg_ptr);
    }
    press_1(e) {
      o.editor_press_1(this.__wbg_ptr, e);
    }
    press_2(e) {
      o.editor_press_2(this.__wbg_ptr, e);
    }
    press_3(e) {
      o.editor_press_3(this.__wbg_ptr, e);
    }
    press_4(e) {
      o.editor_press_4(this.__wbg_ptr, e);
    }
    press_5(e) {
      o.editor_press_5(this.__wbg_ptr, e);
    }
    press_6(e) {
      o.editor_press_6(this.__wbg_ptr, e);
    }
    press_7(e) {
      o.editor_press_7(this.__wbg_ptr, e);
    }
    press_8(e) {
      o.editor_press_8(this.__wbg_ptr, e);
    }
    press_9() {
      o.editor_press_9(this.__wbg_ptr);
    }
    press_a(e) {
      o.editor_press_a(this.__wbg_ptr, e);
    }
    press_b() {
      o.editor_press_b(this.__wbg_ptr);
    }
    press_c() {
      o.editor_press_c(this.__wbg_ptr);
    }
    press_d() {
      o.editor_press_d(this.__wbg_ptr);
    }
    press_e() {
      o.editor_press_e(this.__wbg_ptr);
    }
    press_f() {
      o.editor_press_f(this.__wbg_ptr);
    }
    press_h() {
      o.editor_press_h(this.__wbg_ptr);
    }
    press_i() {
      o.editor_press_i(this.__wbg_ptr);
    }
    press_j() {
      o.editor_press_j(this.__wbg_ptr);
    }
    press_k() {
      o.editor_press_k(this.__wbg_ptr);
    }
    press_l() {
      o.editor_press_l(this.__wbg_ptr);
    }
    press_m() {
      o.editor_press_m(this.__wbg_ptr);
    }
    press_n() {
      o.editor_press_n(this.__wbg_ptr);
    }
    press_o() {
      o.editor_press_o(this.__wbg_ptr);
    }
    press_p() {
      o.editor_press_p(this.__wbg_ptr);
    }
    press_q(e) {
      o.editor_press_q(this.__wbg_ptr, e);
    }
    press_r() {
      o.editor_press_r(this.__wbg_ptr);
    }
    press_s(e) {
      o.editor_press_s(this.__wbg_ptr, e);
    }
    press_t() {
      o.editor_press_t(this.__wbg_ptr);
    }
    press_u() {
      o.editor_press_num_1(this.__wbg_ptr);
    }
    press_w(e) {
      o.editor_press_w(this.__wbg_ptr, e);
    }
    press_x() {
      o.editor_press_x(this.__wbg_ptr);
    }
    press_y() {
      o.editor_press_y(this.__wbg_ptr);
    }
    press_z() {
      o.editor_press_z(this.__wbg_ptr);
    }
    entities() {
      const e = o.editor_entities(this.__wbg_ptr);
      var r = It(e[0], e[1]).slice();
      return o.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    load_map(e) {
      const r = it(e, o.__wbindgen_malloc), n = Te, i = o.editor_load_map(this.__wbg_ptr, r, n);
      if (i[1]) throw _t(i[0]);
    }
    press_up(e) {
      o.editor_press_up(this.__wbg_ptr, e);
    }
    cursor_up() {
      o.editor_cursor_up(this.__wbg_ptr);
    }
    release_a() {
      o.editor_release_a(this.__wbg_ptr);
    }
    release_c() {
      o.editor_release_c(this.__wbg_ptr);
    }
    release_d() {
      o.editor_release_d(this.__wbg_ptr);
    }
    release_e() {
      o.editor_release_e(this.__wbg_ptr);
    }
    release_q() {
      o.editor_release_q(this.__wbg_ptr);
    }
    release_s() {
      o.editor_release_s(this.__wbg_ptr);
    }
    release_w() {
      o.editor_release_w(this.__wbg_ptr);
    }
    release_z() {
      o.editor_release_z(this.__wbg_ptr);
    }
    to_replay(e, r) {
      const n = o.editor_to_replay(this.__wbg_ptr, e, r);
      if (n[2]) throw _t(n[1]);
      return Me.__wrap(n[0]);
    }
  }
  Symbol.dispose && (Oe.prototype[Symbol.dispose] = Oe.prototype.free);
  const Rt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => o.__wbg_exportedentity_free(t >>> 0, 1));
  class Ze {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Ze.prototype);
      return r.__wbg_ptr = e, Rt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Rt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      o.__wbg_exportedentity_free(e, 0);
    }
    get type_int() {
      return o.__wbg_get_exportedentity_type_int(this.__wbg_ptr) >>> 0;
    }
    set type_int(e) {
      o.__wbg_set_exportedentity_type_int(this.__wbg_ptr, e);
    }
    get x() {
      return o.__wbg_get_exportedentity_x(this.__wbg_ptr);
    }
    set x(e) {
      o.__wbg_set_exportedentity_x(this.__wbg_ptr, e);
    }
    get y() {
      return o.__wbg_get_exportedentity_y(this.__wbg_ptr);
    }
    set y(e) {
      o.__wbg_set_exportedentity_y(this.__wbg_ptr, e);
    }
    get deg() {
      return o.__wbg_get_exportedentity_deg(this.__wbg_ptr);
    }
    set deg(e) {
      o.__wbg_set_exportedentity_deg(this.__wbg_ptr, e);
    }
    get deg2() {
      return o.__wbg_get_exportedentity_deg2(this.__wbg_ptr);
    }
    set deg2(e) {
      o.__wbg_set_exportedentity_deg2(this.__wbg_ptr, e);
    }
    get switch_x() {
      return o.__wbg_get_exportedentity_switch_x(this.__wbg_ptr);
    }
    set switch_x(e) {
      o.__wbg_set_exportedentity_switch_x(this.__wbg_ptr, e);
    }
    get switch_y() {
      return o.__wbg_get_exportedentity_switch_y(this.__wbg_ptr);
    }
    set switch_y(e) {
      o.__wbg_set_exportedentity_switch_y(this.__wbg_ptr, e);
    }
    get mode() {
      return o.__wbg_get_exportedentity_mode(this.__wbg_ptr);
    }
    set mode(e) {
      o.__wbg_set_exportedentity_mode(this.__wbg_ptr, e);
    }
    get mode2() {
      return o.__wbg_get_exportedentity_mode2(this.__wbg_ptr);
    }
    set mode2(e) {
      o.__wbg_set_exportedentity_mode2(this.__wbg_ptr, e);
    }
    get stack_count() {
      return o.__wbg_get_exportedentity_stack_count(this.__wbg_ptr);
    }
    set stack_count(e) {
      o.__wbg_set_exportedentity_stack_count(this.__wbg_ptr, e);
    }
  }
  Symbol.dispose && (Ze.prototype[Symbol.dispose] = Ze.prototype.free);
  const Kt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => o.__wbg_replay_free(t >>> 0, 1));
  class Me {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Me.prototype);
      return r.__wbg_ptr = e, Kt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Kt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      o.__wbg_replay_free(e, 0);
    }
    inputs_len() {
      return o.replay_inputs_len(this.__wbg_ptr) >>> 0;
    }
    mine_state(e) {
      return o.replay_mine_state(this.__wbg_ptr, e);
    }
    ninja_info() {
      let e, r;
      try {
        const n = o.replay_ninja_info(this.__wbg_ptr);
        return e = n[0], r = n[1], De(n[0], n[1]);
      } finally {
        o.__wbindgen_free(e, r, 1);
      }
    }
    thwump_deg(e) {
      return o.replay_thwump_deg(this.__wbg_ptr, e);
    }
    tiles_path() {
      let e, r;
      try {
        const n = o.replay_tiles_path(this.__wbg_ptr);
        return e = n[0], r = n[1], De(n[0], n[1]);
      } finally {
        o.__wbindgen_free(e, r, 1);
      }
    }
    boost_pad_x(e) {
      return o.replay_boost_pad_x(this.__wbg_ptr, e);
    }
    boost_pad_y(e) {
      return o.replay_boost_pad_y(this.__wbg_ptr, e);
    }
    deathball_x(e, r) {
      return o.replay_deathball_x(this.__wbg_ptr, e, r);
    }
    deathball_y(e, r) {
      return o.replay_deathball_y(this.__wbg_ptr, e, r);
    }
    exit_door_x(e) {
      return o.replay_exit_door_x(this.__wbg_ptr, e);
    }
    exit_door_y(e) {
      return o.replay_exit_door_y(this.__wbg_ptr, e);
    }
    ninja_bones(e) {
      const r = o.replay_ninja_bones(this.__wbg_ptr, e);
      var n = He(r[0], r[1]).slice();
      return o.__wbindgen_free(r[0], r[1] * 8, 8), n;
    }
    one_way_deg(e) {
      return o.replay_one_way_deg(this.__wbg_ptr, e);
    }
    place_ninja(e, r) {
      o.replay_place_ninja(this.__wbg_ptr, e, r);
    }
    portals_len() {
      return o.replay_portals_len(this.__wbg_ptr) >>> 0;
    }
    thwumps_len() {
      return o.replay_thwumps_len(this.__wbg_ptr) >>> 0;
    }
    trap_door_x(e) {
      return o.replay_trap_door_x(this.__wbg_ptr, e);
    }
    trap_door_y(e) {
      return o.replay_trap_door_y(this.__wbg_ptr, e);
    }
    zap_drone_x(e, r) {
      return o.replay_zap_drone_x(this.__wbg_ptr, e, r);
    }
    zap_drone_y(e, r) {
      return o.replay_zap_drone_y(this.__wbg_ptr, e, r);
    }
    evil_ninja_x(e, r) {
      return o.replay_evil_ninja_x(this.__wbg_ptr, e, r);
    }
    evil_ninja_y(e, r) {
      return o.replay_evil_ninja_y(this.__wbg_ptr, e, r);
    }
    launch_pad_x(e) {
      return o.replay_launch_pad_x(this.__wbg_ptr, e);
    }
    launch_pad_y(e) {
      return o.replay_launch_pad_y(this.__wbg_ptr, e);
    }
    one_ways_len() {
      return o.replay_one_ways_len(this.__wbg_ptr) >>> 0;
    }
    past_ninja_x(e) {
      return o.replay_past_ninja_x(this.__wbg_ptr, e);
    }
    past_ninja_y(e) {
      return o.replay_past_ninja_y(this.__wbg_ptr, e);
    }
    seek_preview(e) {
      o.replay_seek_preview(this.__wbg_ptr, e);
    }
    boost_pad_deg(e, r) {
      return o.replay_boost_pad_deg(this.__wbg_ptr, e, r);
    }
    chase_drone_x(e, r) {
      return o.replay_chase_drone_x(this.__wbg_ptr, e, r);
    }
    chase_drone_y(e, r) {
      return o.replay_chase_drone_y(this.__wbg_ptr, e, r);
    }
    exit_switch_x(e) {
      return o.replay_exit_switch_x(this.__wbg_ptr, e);
    }
    exit_switch_y(e) {
      return o.replay_exit_switch_y(this.__wbg_ptr, e);
    }
    floor_guard_x(e, r) {
      return o.replay_floor_guard_x(this.__wbg_ptr, e, r);
    }
    floor_guard_y(e, r) {
      return o.replay_floor_guard_y(this.__wbg_ptr, e, r);
    }
    laser_drone_x(e, r) {
      return o.replay_laser_drone_x(this.__wbg_ptr, e, r);
    }
    laser_drone_y(e, r) {
      return o.replay_laser_drone_y(this.__wbg_ptr, e, r);
    }
    locked_door_x(e) {
      return o.replay_locked_door_x(this.__wbg_ptr, e);
    }
    locked_door_y(e) {
      return o.replay_locked_door_y(this.__wbg_ptr, e);
    }
    portal_active(e) {
      return o.replay_portal_active(this.__wbg_ptr, e) !== 0;
    }
    replay_length() {
      return o.replay_inputs_len(this.__wbg_ptr) >>> 0;
    }
    trap_door_deg(e) {
      return o.replay_trap_door_deg(this.__wbg_ptr, e);
    }
    trap_switch_x(e) {
      return o.replay_trap_switch_x(this.__wbg_ptr, e);
    }
    trap_switch_y(e) {
      return o.replay_trap_switch_y(this.__wbg_ptr, e);
    }
    zap_drone_deg(e) {
      return o.replay_zap_drone_deg(this.__wbg_ptr, e);
    }
    boost_pads_len() {
      return o.replay_boost_pads_len(this.__wbg_ptr) >>> 0;
    }
    bounce_block_x(e, r) {
      return o.replay_bounce_block_x(this.__wbg_ptr, e, r);
    }
    bounce_block_y(e, r) {
      return o.replay_bounce_block_y(this.__wbg_ptr, e, r);
    }
    deathballs_len() {
      return o.replay_deathballs_len(this.__wbg_ptr) >>> 0;
    }
    evil_ninja_deg(e, r) {
      return o.replay_evil_ninja_deg(this.__wbg_ptr, e, r);
    }
    exit_doors_len() {
      return o.replay_exit_doors_len(this.__wbg_ptr) >>> 0;
    }
    export_attract(e) {
      An(e, Oe);
      const r = o.replay_export_attract(this.__wbg_ptr, e.__wbg_ptr);
      var n = ur(r[0], r[1]).slice();
      return o.__wbindgen_free(r[0], r[1] * 1, 1), n;
    }
    gold_collected(e) {
      return o.replay_gold_collected(this.__wbg_ptr, e) !== 0;
    }
    launch_pad_deg(e) {
      return o.replay_launch_pad_deg(this.__wbg_ptr, e);
    }
    portal_ninja_x(e) {
      return o.replay_portal_ninja_x(this.__wbg_ptr, e);
    }
    portal_ninja_y(e) {
      return o.replay_portal_ninja_y(this.__wbg_ptr, e);
    }
    portal_side1_x(e) {
      return o.replay_portal_side1_x(this.__wbg_ptr, e);
    }
    portal_side1_y(e) {
      return o.replay_portal_side1_y(this.__wbg_ptr, e);
    }
    portal_side2_x(e) {
      return o.replay_portal_side2_x(this.__wbg_ptr, e);
    }
    portal_side2_y(e) {
      return o.replay_portal_side2_y(this.__wbg_ptr, e);
    }
    regular_door_x(e) {
      return o.replay_regular_door_x(this.__wbg_ptr, e);
    }
    regular_door_y(e) {
      return o.replay_regular_door_y(this.__wbg_ptr, e);
    }
    shove_thwump_x(e, r) {
      return o.replay_shove_thwump_x(this.__wbg_ptr, e, r);
    }
    shove_thwump_y(e, r) {
      return o.replay_shove_thwump_y(this.__wbg_ptr, e, r);
    }
    trap_doors_len() {
      return o.replay_trap_doors_len(this.__wbg_ptr) >>> 0;
    }
    zap_drones_len() {
      return o.replay_zap_drones_len(this.__wbg_ptr) >>> 0;
    }
    chase_drone_deg(e) {
      return o.replay_chase_drone_deg(this.__wbg_ptr, e);
    }
    evil_ninja_type(e) {
      return o.replay_evil_ninja_type(this.__wbg_ptr, e) >>> 0;
    }
    evil_ninjas_len() {
      return o.replay_evil_ninjas_len(this.__wbg_ptr) >>> 0;
    }
    floor_guard_deg(e) {
      return o.replay_floor_guard_deg(this.__wbg_ptr, e);
    }
    is_from_attract() {
      return o.replay_is_from_attract(this.__wbg_ptr) !== 0;
    }
    laser_drone_deg(e) {
      return o.replay_laser_drone_deg(this.__wbg_ptr, e);
    }
    launch_pads_len() {
      return o.replay_launch_pads_len(this.__wbg_ptr) >>> 0;
    }
    locked_door_deg(e) {
      return o.replay_locked_door_deg(this.__wbg_ptr, e);
    }
    locked_switch_x(e) {
      return o.replay_locked_switch_x(this.__wbg_ptr, e);
    }
    locked_switch_y(e) {
      return o.replay_locked_switch_y(this.__wbg_ptr, e);
    }
    ninja_preview_x(e) {
      return o.replay_ninja_preview_x(this.__wbg_ptr, e);
    }
    ninja_preview_y(e) {
      return o.replay_ninja_preview_y(this.__wbg_ptr, e);
    }
    past_ninjas_len() {
      return o.replay_past_ninjas_len(this.__wbg_ptr) >>> 0;
    }
    bounce_block_deg(e) {
      return o.replay_bounce_block_deg(this.__wbg_ptr, e);
    }
    chaingun_drone_x(e, r) {
      return o.replay_chaingun_drone_x(this.__wbg_ptr, e, r);
    }
    chaingun_drone_y(e, r) {
      return o.replay_chaingun_drone_y(this.__wbg_ptr, e, r);
    }
    chase_drones_len() {
      return o.replay_chase_drones_len(this.__wbg_ptr) >>> 0;
    }
    evil_ninja_bones(e) {
      const r = o.replay_evil_ninja_bones(this.__wbg_ptr, e);
      let n;
      return r[0] !== 0 && (n = He(r[0], r[1]).slice(), o.__wbindgen_free(r[0], r[1] * 8, 8)), n;
    }
    evil_ninja_scale(e) {
      return o.replay_evil_ninja_scale(this.__wbg_ptr, e);
    }
    floor_guards_len() {
      return o.replay_floor_guards_len(this.__wbg_ptr) >>> 0;
    }
    laser_drones_len() {
      return o.replay_laser_drones_len(this.__wbg_ptr) >>> 0;
    }
    locked_doors_len() {
      return o.replay_locked_doors_len(this.__wbg_ptr) >>> 0;
    }
    past_ninja_bones(e) {
      const r = o.replay_past_ninja_bones(this.__wbg_ptr, e);
      var n = He(r[0], r[1]).slice();
      return o.__wbindgen_free(r[0], r[1] * 8, 8), n;
    }
    portal_side1_deg(e) {
      return o.replay_portal_side1_deg(this.__wbg_ptr, e);
    }
    portal_side2_deg(e) {
      return o.replay_portal_side2_deg(this.__wbg_ptr, e);
    }
    progress_preview() {
      return o.replay_progress_preview(this.__wbg_ptr) >>> 0;
    }
    regular_door_deg(e) {
      return o.replay_regular_door_deg(this.__wbg_ptr, e);
    }
    send_past_ninjas() {
      o.replay_send_past_ninjas(this.__wbg_ptr);
    }
    shove_thwump_deg(e) {
      return o.replay_shove_thwump_deg(this.__wbg_ptr, e);
    }
    bounce_blocks_len() {
      return o.replay_bounce_blocks_len(this.__wbg_ptr) >>> 0;
    }
    regular_doors_len() {
      return o.replay_regular_doors_len(this.__wbg_ptr) >>> 0;
    }
    shove_thwumps_len() {
      return o.replay_shove_thwumps_len(this.__wbg_ptr) >>> 0;
    }
    chaingun_drone_deg(e) {
      return o.replay_chaingun_drone_deg(this.__wbg_ptr, e);
    }
    exit_anim_progress(e, r) {
      return o.replay_exit_anim_progress(this.__wbg_ptr, e, r);
    }
    portal_ninja_bones() {
      const e = o.replay_portal_ninja_bones(this.__wbg_ptr);
      var r = He(e[0], e[1]).slice();
      return o.__wbindgen_free(e[0], e[1] * 8, 8), r;
    }
    shove_thwump_touch(e) {
      return o.replay_shove_thwump_touch(this.__wbg_ptr, e);
    }
    chaingun_drones_len() {
      return o.replay_chaingun_drones_len(this.__wbg_ptr) >>> 0;
    }
    ninja_preview_bones(e) {
      const r = o.replay_ninja_preview_bones(this.__wbg_ptr, e);
      var n = He(r[0], r[1]).slice();
      return o.__wbindgen_free(r[0], r[1] * 8, 8), n;
    }
    boost_pad_anim_progress(e, r) {
      return o.replay_boost_pad_anim_progress(this.__wbg_ptr, e, r);
    }
    trap_door_anim_progress(e, r) {
      return o.replay_trap_door_anim_progress(this.__wbg_ptr, e, r);
    }
    locked_door_anim_progress(e, r) {
      return o.replay_locked_door_anim_progress(this.__wbg_ptr, e, r);
    }
    regular_door_anim_progress(e, r) {
      return o.replay_regular_door_anim_progress(this.__wbg_ptr, e, r);
    }
    seek(e) {
      o.replay_seek(this.__wbg_ptr, e);
    }
    tick() {
      o.replay_tick(this.__wbg_ptr);
    }
    input(e) {
      return o.replay_input(this.__wbg_ptr, e);
    }
    score() {
      return o.replay_score(this.__wbg_ptr) >>> 0;
    }
    gold_x(e) {
      return o.replay_gold_x(this.__wbg_ptr, e);
    }
    gold_y(e) {
      return o.replay_gold_y(this.__wbg_ptr, e);
    }
    mine_x(e) {
      return o.replay_mine_x(this.__wbg_ptr, e);
    }
    mine_y(e) {
      return o.replay_mine_y(this.__wbg_ptr, e);
    }
    ninja_x(e) {
      return o.replay_ninja_x(this.__wbg_ptr, e);
    }
    ninja_y(e) {
      return o.replay_ninja_y(this.__wbg_ptr, e);
    }
    progress() {
      return o.replay_progress(this.__wbg_ptr) >>> 0;
    }
    thwump_x(e, r) {
      return o.replay_thwump_x(this.__wbg_ptr, e, r);
    }
    thwump_y(e, r) {
      return o.replay_thwump_y(this.__wbg_ptr, e, r);
    }
    golds_len() {
      return o.replay_golds_len(this.__wbg_ptr) >>> 0;
    }
    mines_len() {
      return o.replay_mines_len(this.__wbg_ptr) >>> 0;
    }
    one_way_x(e) {
      return o.replay_one_way_x(this.__wbg_ptr, e);
    }
    one_way_y(e) {
      return o.replay_one_way_y(this.__wbg_ptr, e);
    }
    set_input(e, r, n, i) {
      o.replay_set_input(this.__wbg_ptr, e, r, n, i);
    }
  }
  Symbol.dispose && (Me.prototype[Symbol.dispose] = Me.prototype.free);
  function Cn(t, e) {
    throw new Error(De(t, e));
  }
  function Mn(t) {
    return Ze.__wrap(t);
  }
  function Bn(t, e) {
    return De(t, e);
  }
  function In() {
    const t = o.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const a = await Sn({
    "./ntools_rs_bg.js": {
      __wbg_exportedentity_new: Mn,
      __wbg___wbindgen_throw_b855445ff6a94295: Cn,
      __wbindgen_init_externref_table: In,
      __wbindgen_cast_2241b6af4c4b2941: Bn
    }
  }, Dn), On = a.memory, Rn = a.__wbg_editor_free, Kn = a.editor_crosshair_x, Gn = a.editor_crosshair_y, Hn = a.editor_cursor_down, zn = a.editor_cursor_up, Vn = a.editor_double_click, Un = a.editor_entities, qn = a.editor_export_map, Fn = a.editor_fill_with_mines, Wn = a.editor_get_anim_state, Zn = a.editor_get_level_name, Yn = a.editor_get_show_trail, Jn = a.editor_load_attract, Xn = a.editor_load_map, Qn = a.editor_load_outte_replay, es = a.editor_loop_locations_path, ts = a.editor_mode, rs = a.editor_new, ns = a.editor_palette_center_x, ss = a.editor_palette_center_y, os = a.editor_palette_selection_x, is = a.editor_palette_selection_y, _s = a.editor_past_ninja_bones, ls = a.editor_past_ninja_x, as = a.editor_past_ninja_y, cs = a.editor_past_ninjas_len, ds = a.editor_press_0, us = a.editor_press_1, ps = a.editor_press_2, hs = a.editor_press_3, gs = a.editor_press_4, fs = a.editor_press_5, ys = a.editor_press_6, ws = a.editor_press_7, bs = a.editor_press_8, ms = a.editor_press_9, xs = a.editor_press_a, vs = a.editor_press_alt_left, $s = a.editor_press_b, ks = a.editor_press_backtick, Ds = a.editor_press_bracket_left, Ss = a.editor_press_bracket_right, js = a.editor_press_c, Ps = a.editor_press_comma, Ts = a.editor_press_d, Ls = a.editor_press_dash, Es = a.editor_press_down, Ns = a.editor_press_e, As = a.editor_press_enter, Cs = a.editor_press_equals, Ms = a.editor_press_escape, Bs = a.editor_press_f, Is = a.editor_press_h, Os = a.editor_press_i, Rs = a.editor_press_j, Ks = a.editor_press_k, Gs = a.editor_press_l, Hs = a.editor_press_left, zs = a.editor_press_m, Vs = a.editor_press_n, Us = a.editor_press_num_0, qs = a.editor_press_num_1, Fs = a.editor_press_num_3, Ws = a.editor_press_num_4, Zs = a.editor_press_num_7, Ys = a.editor_press_o, Js = a.editor_press_p, Xs = a.editor_press_q, Qs = a.editor_press_r, eo = a.editor_press_right, to = a.editor_press_s, ro = a.editor_press_shift, no = a.editor_press_slash, so = a.editor_press_space, oo = a.editor_press_t, io = a.editor_press_up, _o = a.editor_press_w, lo = a.editor_press_x, ao = a.editor_press_y, co = a.editor_press_z, uo = a.editor_preview_entities, po = a.editor_receive_past_ninjas, ho = a.editor_redo, go = a.editor_release_a, fo = a.editor_release_alt_left, yo = a.editor_release_c, wo = a.editor_release_d, bo = a.editor_release_e, mo = a.editor_release_q, xo = a.editor_release_s, vo = a.editor_release_shift, $o = a.editor_release_space, ko = a.editor_release_w, Do = a.editor_release_z, So = a.editor_selected_tile_outline_path, jo = a.editor_selected_tiles_path, Po = a.editor_set_anim_data, To = a.editor_set_cursor_pos, Lo = a.editor_set_level_name, Eo = a.editor_set_show_trail, No = a.editor_set_start_replay_paused, Ao = a.editor_show_half_grid, Co = a.editor_show_quarter_grid, Mo = a.editor_tile_crosshair_col, Bo = a.editor_tile_crosshair_row, Io = a.editor_tiles_path, Oo = a.editor_to_replay, Ro = a.editor_undo, Ko = a.__wbg_exportedentity_free, Go = a.__wbg_get_exportedentity_deg, Ho = a.__wbg_get_exportedentity_deg2, zo = a.__wbg_get_exportedentity_mode, Vo = a.__wbg_get_exportedentity_mode2, Uo = a.__wbg_get_exportedentity_stack_count, qo = a.__wbg_get_exportedentity_switch_x, Fo = a.__wbg_get_exportedentity_switch_y, Wo = a.__wbg_get_exportedentity_type_int, Zo = a.__wbg_get_exportedentity_x, Yo = a.__wbg_get_exportedentity_y, Jo = a.__wbg_set_exportedentity_deg, Xo = a.__wbg_set_exportedentity_deg2, Qo = a.__wbg_set_exportedentity_mode, ei = a.__wbg_set_exportedentity_mode2, ti = a.__wbg_set_exportedentity_stack_count, ri = a.__wbg_set_exportedentity_switch_x, ni = a.__wbg_set_exportedentity_switch_y, si = a.__wbg_set_exportedentity_type_int, oi = a.__wbg_set_exportedentity_x, ii = a.__wbg_set_exportedentity_y, _i = a.__wbg_replay_free, li = a.replay_boost_pad_anim_progress, ai = a.replay_boost_pad_deg, ci = a.replay_boost_pad_x, di = a.replay_boost_pad_y, ui = a.replay_boost_pads_len, pi = a.replay_bounce_block_deg, hi = a.replay_bounce_block_x, gi = a.replay_bounce_block_y, fi = a.replay_bounce_blocks_len, yi = a.replay_chaingun_drone_deg, wi = a.replay_chaingun_drone_x, bi = a.replay_chaingun_drone_y, mi = a.replay_chaingun_drones_len, xi = a.replay_chase_drone_deg, vi = a.replay_chase_drone_x, $i = a.replay_chase_drone_y, ki = a.replay_chase_drones_len, Di = a.replay_deathball_x, Si = a.replay_deathball_y, ji = a.replay_deathballs_len, Pi = a.replay_evil_ninja_bones, Ti = a.replay_evil_ninja_deg, Li = a.replay_evil_ninja_scale, Ei = a.replay_evil_ninja_type, Ni = a.replay_evil_ninja_x, Ai = a.replay_evil_ninja_y, Ci = a.replay_evil_ninjas_len, Mi = a.replay_exit_anim_progress, Bi = a.replay_exit_door_x, Ii = a.replay_exit_door_y, Oi = a.replay_exit_doors_len, Ri = a.replay_exit_switch_x, Ki = a.replay_exit_switch_y, Gi = a.replay_export_attract, Hi = a.replay_floor_guard_deg, zi = a.replay_floor_guard_x, Vi = a.replay_floor_guard_y, Ui = a.replay_floor_guards_len, qi = a.replay_gold_collected, Fi = a.replay_gold_x, Wi = a.replay_gold_y, Zi = a.replay_golds_len, Yi = a.replay_input, Ji = a.replay_inputs_len, Xi = a.replay_is_from_attract, Qi = a.replay_laser_drone_deg, e_ = a.replay_laser_drone_x, t_ = a.replay_laser_drone_y, r_ = a.replay_laser_drones_len, n_ = a.replay_launch_pad_deg, s_ = a.replay_launch_pad_x, o_ = a.replay_launch_pad_y, i_ = a.replay_launch_pads_len, __ = a.replay_locked_door_anim_progress, l_ = a.replay_locked_door_deg, a_ = a.replay_locked_door_x, c_ = a.replay_locked_door_y, d_ = a.replay_locked_doors_len, u_ = a.replay_locked_switch_x, p_ = a.replay_locked_switch_y, h_ = a.replay_mine_state, g_ = a.replay_mine_x, f_ = a.replay_mine_y, y_ = a.replay_mines_len, w_ = a.replay_ninja_bones, b_ = a.replay_ninja_info, m_ = a.replay_ninja_preview_bones, x_ = a.replay_ninja_preview_x, v_ = a.replay_ninja_preview_y, $_ = a.replay_ninja_x, k_ = a.replay_ninja_y, D_ = a.replay_one_way_deg, S_ = a.replay_one_way_x, j_ = a.replay_one_way_y, P_ = a.replay_one_ways_len, T_ = a.replay_past_ninja_bones, L_ = a.replay_past_ninja_x, E_ = a.replay_past_ninja_y, N_ = a.replay_past_ninjas_len, A_ = a.replay_place_ninja, C_ = a.replay_portal_active, M_ = a.replay_portal_ninja_bones, B_ = a.replay_portal_ninja_x, I_ = a.replay_portal_ninja_y, O_ = a.replay_portal_side1_deg, R_ = a.replay_portal_side1_x, K_ = a.replay_portal_side1_y, G_ = a.replay_portal_side2_deg, H_ = a.replay_portal_side2_x, z_ = a.replay_portal_side2_y, V_ = a.replay_portals_len, U_ = a.replay_progress, q_ = a.replay_progress_preview, F_ = a.replay_regular_door_anim_progress, W_ = a.replay_regular_door_deg, Z_ = a.replay_regular_door_x, Y_ = a.replay_regular_door_y, J_ = a.replay_regular_doors_len, X_ = a.replay_score, Q_ = a.replay_seek, el = a.replay_seek_preview, tl = a.replay_send_past_ninjas, rl = a.replay_set_input, nl = a.replay_shove_thwump_deg, sl = a.replay_shove_thwump_touch, ol = a.replay_shove_thwump_x, il = a.replay_shove_thwump_y, _l = a.replay_shove_thwumps_len, ll = a.replay_thwump_deg, al = a.replay_thwump_x, cl = a.replay_thwump_y, dl = a.replay_thwumps_len, ul = a.replay_tick, pl = a.replay_tiles_path, hl = a.replay_trap_door_anim_progress, gl = a.replay_trap_door_deg, fl = a.replay_trap_door_x, yl = a.replay_trap_door_y, wl = a.replay_trap_doors_len, bl = a.replay_trap_switch_x, ml = a.replay_trap_switch_y, xl = a.replay_zap_drone_deg, vl = a.replay_zap_drone_x, $l = a.replay_zap_drone_y, kl = a.replay_zap_drones_len, Dl = a.editor_press_num_2, Sl = a.editor_press_num_5, jl = a.editor_press_u, Pl = a.replay_replay_length, Tl = a.__wbindgen_externrefs, Ll = a.__wbindgen_free, El = a.__wbindgen_malloc, Nl = a.__externref_table_dealloc, Al = a.__wbindgen_realloc, Cl = a.__externref_drop_slice, pr = a.__wbindgen_start, Ml = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: Cl,
    __externref_table_dealloc: Nl,
    __wbg_editor_free: Rn,
    __wbg_exportedentity_free: Ko,
    __wbg_get_exportedentity_deg: Go,
    __wbg_get_exportedentity_deg2: Ho,
    __wbg_get_exportedentity_mode: zo,
    __wbg_get_exportedentity_mode2: Vo,
    __wbg_get_exportedentity_stack_count: Uo,
    __wbg_get_exportedentity_switch_x: qo,
    __wbg_get_exportedentity_switch_y: Fo,
    __wbg_get_exportedentity_type_int: Wo,
    __wbg_get_exportedentity_x: Zo,
    __wbg_get_exportedentity_y: Yo,
    __wbg_replay_free: _i,
    __wbg_set_exportedentity_deg: Jo,
    __wbg_set_exportedentity_deg2: Xo,
    __wbg_set_exportedentity_mode: Qo,
    __wbg_set_exportedentity_mode2: ei,
    __wbg_set_exportedentity_stack_count: ti,
    __wbg_set_exportedentity_switch_x: ri,
    __wbg_set_exportedentity_switch_y: ni,
    __wbg_set_exportedentity_type_int: si,
    __wbg_set_exportedentity_x: oi,
    __wbg_set_exportedentity_y: ii,
    __wbindgen_externrefs: Tl,
    __wbindgen_free: Ll,
    __wbindgen_malloc: El,
    __wbindgen_realloc: Al,
    __wbindgen_start: pr,
    editor_crosshair_x: Kn,
    editor_crosshair_y: Gn,
    editor_cursor_down: Hn,
    editor_cursor_up: zn,
    editor_double_click: Vn,
    editor_entities: Un,
    editor_export_map: qn,
    editor_fill_with_mines: Fn,
    editor_get_anim_state: Wn,
    editor_get_level_name: Zn,
    editor_get_show_trail: Yn,
    editor_load_attract: Jn,
    editor_load_map: Xn,
    editor_load_outte_replay: Qn,
    editor_loop_locations_path: es,
    editor_mode: ts,
    editor_new: rs,
    editor_palette_center_x: ns,
    editor_palette_center_y: ss,
    editor_palette_selection_x: os,
    editor_palette_selection_y: is,
    editor_past_ninja_bones: _s,
    editor_past_ninja_x: ls,
    editor_past_ninja_y: as,
    editor_past_ninjas_len: cs,
    editor_press_0: ds,
    editor_press_1: us,
    editor_press_2: ps,
    editor_press_3: hs,
    editor_press_4: gs,
    editor_press_5: fs,
    editor_press_6: ys,
    editor_press_7: ws,
    editor_press_8: bs,
    editor_press_9: ms,
    editor_press_a: xs,
    editor_press_alt_left: vs,
    editor_press_b: $s,
    editor_press_backtick: ks,
    editor_press_bracket_left: Ds,
    editor_press_bracket_right: Ss,
    editor_press_c: js,
    editor_press_comma: Ps,
    editor_press_d: Ts,
    editor_press_dash: Ls,
    editor_press_down: Es,
    editor_press_e: Ns,
    editor_press_enter: As,
    editor_press_equals: Cs,
    editor_press_escape: Ms,
    editor_press_f: Bs,
    editor_press_h: Is,
    editor_press_i: Os,
    editor_press_j: Rs,
    editor_press_k: Ks,
    editor_press_l: Gs,
    editor_press_left: Hs,
    editor_press_m: zs,
    editor_press_n: Vs,
    editor_press_num_0: Us,
    editor_press_num_1: qs,
    editor_press_num_2: Dl,
    editor_press_num_3: Fs,
    editor_press_num_4: Ws,
    editor_press_num_5: Sl,
    editor_press_num_7: Zs,
    editor_press_o: Ys,
    editor_press_p: Js,
    editor_press_q: Xs,
    editor_press_r: Qs,
    editor_press_right: eo,
    editor_press_s: to,
    editor_press_shift: ro,
    editor_press_slash: no,
    editor_press_space: so,
    editor_press_t: oo,
    editor_press_u: jl,
    editor_press_up: io,
    editor_press_w: _o,
    editor_press_x: lo,
    editor_press_y: ao,
    editor_press_z: co,
    editor_preview_entities: uo,
    editor_receive_past_ninjas: po,
    editor_redo: ho,
    editor_release_a: go,
    editor_release_alt_left: fo,
    editor_release_c: yo,
    editor_release_d: wo,
    editor_release_e: bo,
    editor_release_q: mo,
    editor_release_s: xo,
    editor_release_shift: vo,
    editor_release_space: $o,
    editor_release_w: ko,
    editor_release_z: Do,
    editor_selected_tile_outline_path: So,
    editor_selected_tiles_path: jo,
    editor_set_anim_data: Po,
    editor_set_cursor_pos: To,
    editor_set_level_name: Lo,
    editor_set_show_trail: Eo,
    editor_set_start_replay_paused: No,
    editor_show_half_grid: Ao,
    editor_show_quarter_grid: Co,
    editor_tile_crosshair_col: Mo,
    editor_tile_crosshair_row: Bo,
    editor_tiles_path: Io,
    editor_to_replay: Oo,
    editor_undo: Ro,
    memory: On,
    replay_boost_pad_anim_progress: li,
    replay_boost_pad_deg: ai,
    replay_boost_pad_x: ci,
    replay_boost_pad_y: di,
    replay_boost_pads_len: ui,
    replay_bounce_block_deg: pi,
    replay_bounce_block_x: hi,
    replay_bounce_block_y: gi,
    replay_bounce_blocks_len: fi,
    replay_chaingun_drone_deg: yi,
    replay_chaingun_drone_x: wi,
    replay_chaingun_drone_y: bi,
    replay_chaingun_drones_len: mi,
    replay_chase_drone_deg: xi,
    replay_chase_drone_x: vi,
    replay_chase_drone_y: $i,
    replay_chase_drones_len: ki,
    replay_deathball_x: Di,
    replay_deathball_y: Si,
    replay_deathballs_len: ji,
    replay_evil_ninja_bones: Pi,
    replay_evil_ninja_deg: Ti,
    replay_evil_ninja_scale: Li,
    replay_evil_ninja_type: Ei,
    replay_evil_ninja_x: Ni,
    replay_evil_ninja_y: Ai,
    replay_evil_ninjas_len: Ci,
    replay_exit_anim_progress: Mi,
    replay_exit_door_x: Bi,
    replay_exit_door_y: Ii,
    replay_exit_doors_len: Oi,
    replay_exit_switch_x: Ri,
    replay_exit_switch_y: Ki,
    replay_export_attract: Gi,
    replay_floor_guard_deg: Hi,
    replay_floor_guard_x: zi,
    replay_floor_guard_y: Vi,
    replay_floor_guards_len: Ui,
    replay_gold_collected: qi,
    replay_gold_x: Fi,
    replay_gold_y: Wi,
    replay_golds_len: Zi,
    replay_input: Yi,
    replay_inputs_len: Ji,
    replay_is_from_attract: Xi,
    replay_laser_drone_deg: Qi,
    replay_laser_drone_x: e_,
    replay_laser_drone_y: t_,
    replay_laser_drones_len: r_,
    replay_launch_pad_deg: n_,
    replay_launch_pad_x: s_,
    replay_launch_pad_y: o_,
    replay_launch_pads_len: i_,
    replay_locked_door_anim_progress: __,
    replay_locked_door_deg: l_,
    replay_locked_door_x: a_,
    replay_locked_door_y: c_,
    replay_locked_doors_len: d_,
    replay_locked_switch_x: u_,
    replay_locked_switch_y: p_,
    replay_mine_state: h_,
    replay_mine_x: g_,
    replay_mine_y: f_,
    replay_mines_len: y_,
    replay_ninja_bones: w_,
    replay_ninja_info: b_,
    replay_ninja_preview_bones: m_,
    replay_ninja_preview_x: x_,
    replay_ninja_preview_y: v_,
    replay_ninja_x: $_,
    replay_ninja_y: k_,
    replay_one_way_deg: D_,
    replay_one_way_x: S_,
    replay_one_way_y: j_,
    replay_one_ways_len: P_,
    replay_past_ninja_bones: T_,
    replay_past_ninja_x: L_,
    replay_past_ninja_y: E_,
    replay_past_ninjas_len: N_,
    replay_place_ninja: A_,
    replay_portal_active: C_,
    replay_portal_ninja_bones: M_,
    replay_portal_ninja_x: B_,
    replay_portal_ninja_y: I_,
    replay_portal_side1_deg: O_,
    replay_portal_side1_x: R_,
    replay_portal_side1_y: K_,
    replay_portal_side2_deg: G_,
    replay_portal_side2_x: H_,
    replay_portal_side2_y: z_,
    replay_portals_len: V_,
    replay_progress: U_,
    replay_progress_preview: q_,
    replay_regular_door_anim_progress: F_,
    replay_regular_door_deg: W_,
    replay_regular_door_x: Z_,
    replay_regular_door_y: Y_,
    replay_regular_doors_len: J_,
    replay_replay_length: Pl,
    replay_score: X_,
    replay_seek: Q_,
    replay_seek_preview: el,
    replay_send_past_ninjas: tl,
    replay_set_input: rl,
    replay_shove_thwump_deg: nl,
    replay_shove_thwump_touch: sl,
    replay_shove_thwump_x: ol,
    replay_shove_thwump_y: il,
    replay_shove_thwumps_len: _l,
    replay_thwump_deg: ll,
    replay_thwump_x: al,
    replay_thwump_y: cl,
    replay_thwumps_len: dl,
    replay_tick: ul,
    replay_tiles_path: pl,
    replay_trap_door_anim_progress: hl,
    replay_trap_door_deg: gl,
    replay_trap_door_x: fl,
    replay_trap_door_y: yl,
    replay_trap_doors_len: wl,
    replay_trap_switch_x: bl,
    replay_trap_switch_y: ml,
    replay_zap_drone_deg: xl,
    replay_zap_drone_x: vl,
    replay_zap_drone_y: $l,
    replay_zap_drones_len: kl
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  jn(Ml);
  pr();
  function Bl({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var Il = w("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const Ol = [
    [
      0,
      12
    ],
    [
      1,
      12
    ],
    [
      2,
      8
    ],
    [
      3,
      9
    ],
    [
      4,
      10
    ],
    [
      5,
      11
    ],
    [
      6,
      7
    ],
    [
      8,
      0
    ],
    [
      9,
      0
    ],
    [
      10,
      1
    ],
    [
      11,
      1
    ]
  ];
  function Be(t) {
    function e() {
      const r = t.bones();
      return r ? Ol.map(([n, i]) => `M ${20 * r[n]} ${20 * r[n + 13]} ${20 * r[i]} ${20 * r[i + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = Il();
      return D((n) => {
        var i = t.class, _ = Bl(t.ninja()), l = e();
        return i !== n.e && h(r, "class", n.e = i), _ !== n.t && h(r, "transform", n.t = _), l !== n.a && h(r, "d", n.a = l), n;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var Rl = w("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), Kl = w("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function Gl(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function Hl(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function zl([t, e], r, n) {
    const i = t(), _ = r.exit_doors_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.exit_door_x(s),
        y: r.exit_door_y(s),
        animProgress: r.exit_anim_progress(s, n)
      };
      c && Gl(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function hr(t) {
    return d(U, {
      get each() {
        return t.exitDoors();
      },
      children: (e) => d(Vl, {
        exitDoor: e
      })
    });
  }
  const le = 11, J = 2.5;
  function Vl(t) {
    return (() => {
      var e = Rl(), r = e.firstChild, n = r.nextSibling, i = n.nextSibling, _ = i.nextSibling, l = _.nextSibling;
      return D((s) => {
        var c = Hl(t.exitDoor), p = -13 + 4 * (1 - t.exitDoor().animProgress), $ = 26 - 8 * (1 - t.exitDoor().animProgress), b = `M ${-13 * t.exitDoor().animProgress} 0 v ${-le} h ${-le + J} l ${-J} ${J} v ${2 * (le - J)} l ${J} ${J} h ${le - J} z`, B = `M ${13 * t.exitDoor().animProgress} 0 v ${-le} h ${le - J} l ${J} ${J} v ${2 * (le - J)} l ${-J} ${J} h ${-le + J} z`, C = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * le} v ${t.exitDoor().animProgress * le} h ${-le + J + t.exitDoor().animProgress} l ${-J} ${-J} v ${(1 - t.exitDoor().animProgress) * (-le + J)}`, G = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * le} v ${t.exitDoor().animProgress * le} h ${le - J - t.exitDoor().animProgress} l ${J} ${-J} v ${(1 - t.exitDoor().animProgress) * (-le + J)}`;
        return c !== s.e && h(e, "transform", s.e = c), p !== s.t && h(r, "x", s.t = p), $ !== s.a && h(r, "width", s.a = $), b !== s.o && h(n, "d", s.o = b), B !== s.i && h(i, "d", s.i = B), C !== s.n && h(_, "d", s.n = C), G !== s.s && h(l, "d", s.s = G), s;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0,
        s: void 0
      }), e;
    })();
  }
  function Ul() {
    return Kl();
  }
  var ql = w('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function Fl(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function Wl(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Zl([t, e], r, n) {
    const i = t(), _ = r.exit_doors_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.exit_switch_x(s),
        y: r.exit_switch_y(s),
        animProgress: r.exit_anim_progress(s, n)
      };
      c && Fl(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function gr(t) {
    return d(U, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => d(Yl, {
        exitSwitch: e
      })
    });
  }
  const Pe = 2;
  function Yl(t) {
    return (() => {
      var e = ql(), r = e.firstChild, n = r.nextSibling, i = n.nextSibling;
      return D((_) => {
        var l = Wl(t.exitSwitch), s = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, p = `M ${-2 * t.exitSwitch().animProgress} ${-Pe} h ${-Pe} v ${2 * Pe} h ${Pe}`, $ = `M ${2 * t.exitSwitch().animProgress} ${-Pe} h ${Pe} v ${2 * Pe} h ${-Pe}`;
        return l !== _.e && h(e, "transform", _.e = l), s !== _.t && h(r, "fill", _.t = s), c !== _.a && h(r, "stroke", _.a = c), p !== _.o && h(n, "d", _.o = p), $ !== _.i && h(i, "d", _.i = $), _;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), e;
    })();
  }
  var Jl = w("<svg><use href=#one-way></svg>", false, true, false), Xl = w("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function Ql(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function ea(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function ta([t, e], r) {
    const n = t(), i = r.one_ways_len(), _ = [];
    for (let l = 0; l < i; l++) {
      const s = n.at(l), c = {
        x: r.one_way_x(l),
        y: r.one_way_y(l),
        deg: r.one_way_deg(l)
      };
      s && Ql(s, c) ? _.push(s) : _.push(c);
    }
    e(_);
  }
  function fr(t) {
    return d(U, {
      get each() {
        return t.oneWays();
      },
      children: (e) => (() => {
        var r = Jl();
        return D(() => h(r, "transform", ea(e))), r;
      })()
    });
  }
  function yr() {
    return (() => {
      var t = Xl(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var ra = w("<svg><use></svg>", false, true, false), na = w("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), sa = w("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), oa = w("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const ia = 0, _a = 1;
  function la(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function aa(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function ca([t, e], r) {
    const n = t(), i = r.mines_len(), _ = [];
    for (let l = 0; l < i; l++) {
      const s = n.at(l), c = {
        x: r.mine_x(l),
        y: r.mine_y(l),
        type: r.mine_state(l)
      };
      s && la(s, c) ? _.push(s) : _.push(c);
    }
    e(_);
  }
  function wr(t) {
    return d(U, {
      get each() {
        return t.mines();
      },
      children: (e) => (() => {
        var r = ra();
        return D((n) => {
          var i = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][e().type], _ = aa(e);
          return i !== n.e && h(r, "href", n.e = i), _ !== n.t && h(r, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function br() {
    return [
      (() => {
        var t = na(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, i = n.nextSibling, _ = i.nextSibling;
        return _.nextSibling, t;
      })(),
      (() => {
        var t = sa();
        return t.firstChild, t;
      })(),
      (() => {
        var t = oa();
        return t.firstChild, t;
      })()
    ];
  }
  var da = w("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), ua = w("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), pa = w("<svg><g class=regular-door></svg>", false, true, false);
  function ha(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function ga(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function fa([t, e], r, n) {
    const i = t(), _ = r.regular_doors_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.regular_door_x(s),
        y: r.regular_door_y(s),
        deg: r.regular_door_deg(s),
        animProgress: r.regular_door_anim_progress(s, n)
      };
      c && ha(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function mr(t) {
    return d(U, {
      get each() {
        return t.regularDoors();
      },
      children: (e) => d(ba, {
        regularDoor: e
      })
    });
  }
  const ya = 1, wa = 12 - ya;
  function ba(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (wa - 0) * r;
    }
    return (() => {
      var r = pa();
      return g(r, d(R, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var n = da();
              return D(() => h(n, "x2", -e())), n;
            })(),
            (() => {
              var n = ua();
              return D(() => h(n, "x2", e())), n;
            })()
          ];
        }
      })), D(() => h(r, "transform", ga(t.regularDoor))), r;
    })();
  }
  var ma = w("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), xa = w("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), Gt = w("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), va = w("<svg><g class=locked-door></svg>", false, true, false);
  function $a(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function ka(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Da([t, e], r, n) {
    const i = t(), _ = r.locked_doors_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.locked_door_x(s),
        y: r.locked_door_y(s),
        deg: r.locked_door_deg(s),
        animProgress: r.locked_door_anim_progress(s, n)
      };
      c && $a(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function xr(t) {
    return d(U, {
      get each() {
        return t.lockedDoors();
      },
      children: (e) => d(Pa, {
        lockedDoor: e
      })
    });
  }
  const Sa = 1, ja = 12 - Sa;
  function Pa(t) {
    function e() {
      let i = t.lockedDoor().animProgress;
      return i = Math.min(Math.max(2 * i, 0), 1), 4.5 + 4 * i;
    }
    function r() {
      let i = t.lockedDoor().animProgress;
      return i = Math.min(Math.max(2 * i, 0), 1), 0 + 10 * i;
    }
    function n() {
      let i = t.lockedDoor().animProgress;
      return i = Math.min(Math.max((i - 0.4) / 0.6, 0), 1), 0 + (ja - 0) * i;
    }
    return (() => {
      var i = va();
      return g(i, d(R, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var _ = ma();
              return D(() => h(_, "x2", -n())), _;
            })(),
            (() => {
              var _ = xa();
              return D(() => h(_, "x2", n())), _;
            })()
          ];
        }
      }), null), g(i, d(R, {
        get when() {
          return t.lockedDoor().animProgress < 0.5;
        },
        get children() {
          return [
            (() => {
              var _ = Gt();
              return D((l) => {
                var s = e(), c = r();
                return s !== l.e && h(_, "x1", l.e = s), c !== l.t && h(_, "x2", l.t = c), l;
              }, {
                e: void 0,
                t: void 0
              }), _;
            })(),
            (() => {
              var _ = Gt();
              return D((l) => {
                var s = -e(), c = -r();
                return s !== l.e && h(_, "x1", l.e = s), c !== l.t && h(_, "x2", l.t = c), l;
              }, {
                e: void 0,
                t: void 0
              }), _;
            })()
          ];
        }
      }), null), D(() => h(i, "transform", ka(t.lockedDoor))), i;
    })();
  }
  var Ta = w("<svg><use></svg>", false, true, false), La = w("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), Ea = w("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function Na(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function Aa(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Ca([t, e], r) {
    const n = t(), i = r.locked_doors_len(), _ = [];
    for (let l = 0; l < i; l++) {
      const s = n.at(l), c = {
        x: r.locked_switch_x(l),
        y: r.locked_switch_y(l),
        wasTouched: r.locked_door_anim_progress(l, 1) >= 0
      };
      s && Na(s, c) ? _.push(s) : _.push(c);
    }
    e(_);
  }
  function vr(t) {
    return d(U, {
      get each() {
        return t.lockedSwitches();
      },
      children: (e) => (() => {
        var r = Ta();
        return D((n) => {
          var i = e().wasTouched ? "#locked-switch-touched" : "#locked-switch", _ = Aa(e);
          return i !== n.e && h(r, "href", n.e = i), _ !== n.t && h(r, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function $r() {
    return [
      (() => {
        var t = La(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = Ea(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var Ma = w("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), Ht = w("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), Ba = w("<svg><g></svg>", false, true, false);
  function Ia(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Oa(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Ra([t, e], r, n) {
    const i = t(), _ = r.trap_doors_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.trap_door_x(s),
        y: r.trap_door_y(s),
        deg: r.trap_door_deg(s),
        animProgress: r.trap_door_anim_progress(s, n)
      };
      c && Ia(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function kr(t) {
    return d(U, {
      get each() {
        return t.trapDoors();
      },
      children: (e) => d(Ha, {
        trapDoor: e
      })
    });
  }
  const Ka = 1, Ga = 12 - Ka;
  function Ha(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function n() {
      let i = t.trapDoor().animProgress;
      return 0 + (Ga - 0) * i;
    }
    return (() => {
      var i = Ba();
      return g(i, d(R, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var _ = Ma();
              return D((l) => {
                var s = -n(), c = n();
                return s !== l.e && h(_, "x1", l.e = s), c !== l.t && h(_, "x2", l.t = c), l;
              }, {
                e: void 0,
                t: void 0
              }), _;
            })(),
            (() => {
              var _ = Ht();
              return D((l) => {
                var s = e(), c = r();
                return s !== l.e && h(_, "x1", l.e = s), c !== l.t && h(_, "x2", l.t = c), l;
              }, {
                e: void 0,
                t: void 0
              }), _;
            })(),
            (() => {
              var _ = Ht();
              return D((l) => {
                var s = -e(), c = -r();
                return s !== l.e && h(_, "x1", l.e = s), c !== l.t && h(_, "x2", l.t = c), l;
              }, {
                e: void 0,
                t: void 0
              }), _;
            })()
          ];
        }
      })), D(() => h(i, "transform", Oa(t.trapDoor))), i;
    })();
  }
  var za = w("<svg><use></svg>", false, true, false), Va = w("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), Ua = w("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function qa(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function Fa(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Wa([t, e], r) {
    const n = t(), i = r.trap_doors_len(), _ = [];
    for (let l = 0; l < i; l++) {
      const s = n.at(l), c = {
        x: r.trap_switch_x(l),
        y: r.trap_switch_y(l),
        wasTouched: r.trap_door_anim_progress(l, 1) >= 0
      };
      s && qa(s, c) ? _.push(s) : _.push(c);
    }
    e(_);
  }
  function Dr(t) {
    return d(U, {
      get each() {
        return t.trapSwitches();
      },
      children: (e) => (() => {
        var r = za();
        return D((n) => {
          var i = e().wasTouched ? "#trap-switch-touched" : "#trap-switch", _ = Fa(e);
          return i !== n.e && h(r, "href", n.e = i), _ !== n.t && h(r, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function Sr() {
    return [
      (() => {
        var t = Va();
        return t.firstChild, t;
      })(),
      (() => {
        var t = Ua(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var Za = w("<svg><g><rect fill=var(--launch-pad-long) x=0 y=-7.5 width=1.5 height=15></rect><line stroke=var(--launch-pad-short) stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function Ya(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Ja(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Xa([t, e], r) {
    const n = t(), i = r.launch_pads_len(), _ = [];
    for (let l = 0; l < i; l++) {
      const s = n.at(l), c = {
        x: r.launch_pad_x(l),
        y: r.launch_pad_y(l),
        deg: r.launch_pad_deg(l)
      };
      s && Ya(s, c) ? _.push(s) : _.push(c);
    }
    e(_);
  }
  function jr(t) {
    return d(U, {
      get each() {
        return t.launchPads();
      },
      children: (e) => d(Qa, {
        launchPad: e
      })
    });
  }
  function Qa(t) {
    return (() => {
      var e = Za(), r = e.firstChild;
      return r.nextSibling, D(() => h(e, "transform", Ja(t.launchPad))), e;
    })();
  }
  var ec = w('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function tc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function rc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function nc([t, e], r, n) {
    const i = t(), _ = r.floor_guards_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.floor_guard_x(s, n),
        y: r.floor_guard_y(s, n),
        deg: r.floor_guard_deg(s)
      };
      c && tc(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Pr(t) {
    return d(U, {
      get each() {
        return t.floorGuards();
      },
      children: (e) => d(sc, {
        floorGuard: e
      })
    });
  }
  function sc(t) {
    return (() => {
      var e = ec();
      return e.firstChild, D(() => h(e, "transform", rc(t.floorGuard))), e;
    })();
  }
  var oc = w("<svg><use href=#bounceblock></svg>", false, true, false), ic = w('<svg><g id=bounceblock><path fill=var(--bounceblock-interior) d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path stroke=var(--bounceblock-border) d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function _c(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function lc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function ac([t, e], r, n) {
    const i = t(), _ = r.bounce_blocks_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.bounce_block_x(s, n),
        y: r.bounce_block_y(s, n),
        deg: r.bounce_block_deg(s)
      };
      c && _c(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Tr(t) {
    return d(U, {
      get each() {
        return t.bounceBlocks();
      },
      children: (e) => (() => {
        var r = oc();
        return D(() => h(r, "transform", lc(e))), r;
      })()
    });
  }
  function Lr() {
    return (() => {
      var t = ic(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var cc = w("<svg><use href=#boostpad></svg>", false, true, false), dc = w("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function uc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function pc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function hc([t, e], r, n) {
    const i = t(), _ = r.boost_pads_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.boost_pad_x(s),
        y: r.boost_pad_y(s),
        deg: r.boost_pad_deg(s, n),
        animProgress: r.boost_pad_anim_progress(s, n)
      };
      c && uc(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Er(t) {
    return d(U, {
      get each() {
        return t.boostPads();
      },
      children: (e) => (() => {
        var r = cc();
        return D((n) => {
          var i = `color-mix(in srgb-linear, var(--boost-pad) ${e().animProgress * 100}%, var(--boost-pad-wooshing))`, _ = pc(e);
          return i !== n.e && h(r, "stroke", n.e = i), _ !== n.t && h(r, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function Nr() {
    return (() => {
      var t = dc(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, i = n.nextSibling;
      return i.nextSibling, t;
    })();
  }
  var gc = w("<svg><use href=#thwump></svg>", false, true, false), fc = w('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function yc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function wc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function bc([t, e], r, n) {
    const i = t(), _ = r.thwumps_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.thwump_x(s, n),
        y: r.thwump_y(s, n),
        deg: r.thwump_deg(s)
      };
      c && yc(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Ar(t) {
    return d(U, {
      get each() {
        return t.thwumps();
      },
      children: (e) => (() => {
        var r = gc();
        return D(() => h(r, "transform", wc(e))), r;
      })()
    });
  }
  function Cr() {
    return (() => {
      var t = fc(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var mc = w("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), xc = w("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function vc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function $c(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function kc([t, e], r, n) {
    const i = t(), _ = r.shove_thwumps_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.shove_thwump_x(s, n),
        y: r.shove_thwump_y(s, n),
        deg: r.shove_thwump_deg(s),
        touch: r.shove_thwump_touch(s)
      };
      c && vc(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Mr(t) {
    return d(U, {
      get each() {
        return t.shoveThwumps();
      },
      children: (e) => d(Dc, {
        shoveThwump: e
      })
    });
  }
  function Dc(t) {
    return (() => {
      var e = mc(), r = e.firstChild;
      return g(e, d(gt, {
        each: [
          0,
          2,
          4,
          6
        ],
        children: (n) => d(R, {
          get when() {
            return t.shoveThwump().touch >= 16 || n === t.shoveThwump().touch;
          },
          get children() {
            var i = xc(), _ = i.firstChild, l = _.nextSibling;
            return l.nextSibling, h(i, "transform", `rotate(${45 * n},0,0)`), i;
          }
        })
      }), r), D(() => h(e, "transform", $c(t.shoveThwump))), e;
    })();
  }
  const Br = Ir((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function Sc(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (n) => n.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function jc(t) {
    const e = String.fromCharCode(...t);
    console.log("anim data length", t.byteLength), localStorage.setItem("animData", e);
  }
  function Pc(t) {
    const e = localStorage.getItem("animData");
    if (e) {
      const r = Uint8Array.from(e, (n) => n.charCodeAt(0));
      t.set_anim_data(r);
    }
  }
  const Tc = Ir(Lc, 1e3);
  function Lc(t) {
    const e = JSON.stringify(t);
    localStorage.setItem("palette", e);
  }
  function Ec() {
    const t = localStorage.getItem("palette");
    if (t) try {
      const e = JSON.parse(t);
      if (typeof (e == null ? void 0 : e.name) == "string" && typeof (e == null ? void 0 : e.colors) == "object") return e;
    } catch {
      return;
    }
  }
  function Ir(t, e) {
    let r;
    return (...n) => {
      typeof r == "number" && clearTimeout(r), r = setTimeout(() => t(...n), e);
    };
  }
  const Nc = "" + new URL("palette-CZVUb4uS.png", import.meta.url).href, Or = [
    "acid",
    "airline",
    "argon",
    "autumn",
    "BASIC",
    "berry",
    "birthday cake",
    "bloodmoon",
    "blueprint",
    "bordeaux",
    "brink",
    "cacao",
    "champagne",
    "chemical",
    "chococherry",
    "classic",
    "clean",
    "concrete",
    "console",
    "cowboy",
    "dagobah",
    "debugger",
    "delicate",
    "desert world",
    "disassembly",
    "dorado",
    "dusk",
    "elephant",
    "epaper",
    "epaper invert",
    "evening",
    "F7200",
    "florist",
    "formal",
    "galactic",
    "gatecrasher",
    "gothmode",
    "grapefrukt",
    "grappa",
    "gunmetal",
    "hazard",
    "heirloom",
    "holosphere",
    "hope",
    "hot",
    "hyperspace",
    "ice world",
    "incorporated",
    "infographic",
    "invert",
    "jaune",
    "juicy",
    "kicks",
    "lab",
    "lava world",
    "lemonade",
    "lichen",
    "lightcycle",
    "line",
    "m",
    "machine",
    "metoro",
    "midnight",
    "minus",
    "mir",
    "mono",
    "moonbase",
    "mustard",
    "mute",
    "nemk",
    "neptune",
    "neutrality",
    "noctis",
    "oceanographer",
    "okinami",
    "orbit",
    "pale",
    "papier",
    "papier invert",
    "party",
    "petal",
    "PICO-8",
    "pinku",
    "plus",
    "porphyrous",
    "poseidon",
    "powder",
    "pulse",
    "pumpkin",
    "QDUST",
    "quench",
    "regal",
    "replicant",
    "retro",
    "rust",
    "sakura",
    "shift",
    "shock",
    "simulator",
    "sinister",
    "solarized dark",
    "solarized light",
    "starfighter",
    "sunset",
    "supernavy",
    "synergy",
    "talisman",
    "toothpaste",
    "toxin",
    "TR-808",
    "tycho",
    "vasquez",
    "vectrex",
    "vintage",
    "virtual",
    "vivid",
    "void",
    "waka",
    "witchy",
    "wizard",
    "wyvern",
    "xenon",
    "yeti"
  ], zt = [
    "background",
    "editor",
    "entityBat",
    "entityBoostPad",
    "entityBounceBlock",
    "entityDoorExit",
    "entityDoorExitSwitch",
    "entityDoorLocked",
    "entityDoorRegular",
    "entityDoorTrap",
    "entityDroneChaingun",
    "entityDroneChaser",
    "entityDroneLaser",
    "entityDroneZap",
    "entityDualLaser",
    "entityEvilNinja",
    "entityEyeBat",
    "entityFloorGuard",
    "entityGold",
    "entityLaunchPad",
    "entityMine",
    "entityOneWayPlatform",
    "entityRocket",
    "entityShoveThwomp",
    "entityThwomp",
    "entityTurret",
    "explosions",
    "fxDroneZap",
    "fxFloorguardZap",
    "fxNinja",
    "headbands",
    "menu",
    "ninja",
    "timeBar",
    "timeBarRace"
  ], Vt = {
    background: 0,
    ninja: 1,
    entityMine: 2,
    entityGold: 3,
    entityDoorExit: 4,
    entityDoorExitSwitch: 5,
    entityDoorRegular: 6,
    entityDoorLocked: 7,
    entityDoorTrap: 8,
    entityLaunchPad: 9,
    entityOneWayPlatform: 10,
    entityDroneChaingun: 11,
    entityDroneLaser: 12,
    entityDroneZap: 13,
    entityDroneChaser: 14,
    entityFloorGuard: 15,
    entityBounceBlock: 16,
    entityRocket: 17,
    entityTurret: 18,
    entityThwomp: 19,
    entityEvilNinja: 20,
    entityDualLaser: 21,
    entityBoostPad: 22,
    entityBat: 23,
    entityEyeBat: 24,
    entityShoveThwomp: 25,
    headbands: 26,
    explosions: 27,
    timeBar: 28,
    timeBarRace: 29,
    fxNinja: 30,
    fxDroneZap: 31,
    fxFloorguardZap: 32,
    menu: 33,
    editor: 34
  }, Ac = {
    background: 6,
    ninja: 4,
    entityMine: 4,
    entityGold: 3,
    entityDoorExit: 8,
    entityDoorExitSwitch: 5,
    entityDoorRegular: 1,
    entityDoorLocked: 8,
    entityDoorTrap: 8,
    entityLaunchPad: 2,
    entityOneWayPlatform: 2,
    entityDroneChaingun: 2,
    entityDroneLaser: 4,
    entityDroneZap: 2,
    entityDroneChaser: 2,
    entityFloorGuard: 2,
    entityBounceBlock: 2,
    entityRocket: 4,
    entityTurret: 5,
    entityThwomp: 3,
    entityEvilNinja: 2,
    entityDualLaser: 2,
    entityBoostPad: 2,
    entityBat: 3,
    entityEyeBat: 2,
    entityShoveThwomp: 3,
    headbands: 17,
    explosions: 4,
    timeBar: 8,
    timeBarRace: 17,
    fxNinja: 2,
    fxDroneZap: 2,
    fxFloorguardZap: 2,
    menu: 42,
    editor: 10
  }, Cc = (() => {
    const t = {};
    for (const e of zt) {
      t[e] = 0;
      for (const r of zt) Vt[r] < Vt[e] && (t[e] += Ac[r]);
    }
    return t;
  })(), Rr = [
    "--main-menu-text",
    "--main-menu-selected",
    "--tiles",
    "--tile-outline",
    "--background",
    "--ninja",
    "--mine-exterior",
    "--mine-interior",
    "--toggle-mine",
    "--toggling-mine",
    "--gold-interior",
    "--gold-exterior",
    "--gold-shine",
    "--bounceblock-interior",
    "--bounceblock-border",
    "--oneway-long",
    "--oneway-short",
    "--boost-pad",
    "--boost-pad-wooshing",
    "--launch-pad-short",
    "--launch-pad-long",
    "--exit-panel",
    "--exit-border",
    "--open-exit-upper",
    "--open-exit-lower",
    "--exit-switch-border",
    "--exit-switch-background",
    "--exit-switch-border-collected",
    "--exit-switch-background-collected",
    "--exit-switch-center",
    "--regular-door",
    "--locked-door-bar",
    "--locked-door-center",
    "--locked-switch-border",
    "--locked-switch-background",
    "--locked-switch-button",
    "--locked-switch-border-collected",
    "--locked-switch-background-collected",
    "--locked-switch-button-collected",
    "--trap-door-bar",
    "--trap-door-center",
    "--trap-switch-border",
    "--trap-switch-background",
    "--trap-switch-border-collected",
    "--trap-switch-background-collected",
    "--thwump-border",
    "--thwump-interior",
    "--thwump-ray",
    "--shove-thwump-armor",
    "--shove-thwump-ray",
    "--shove-thwump-center",
    "--zap-drone-background",
    "--zap-drone-border",
    "--chase-drone-background",
    "--chase-drone-border",
    "--chaingun-drone-background",
    "--chaingun-drone-border",
    "--laser-drone-border",
    "--laser-drone-laser1",
    "--laser-drone-laser2",
    "--laser-drone-aim",
    "--bat-body",
    "--bat-eye",
    "--deathball-outer",
    "--deathball-middle",
    "--deathball-inner",
    "--evil-ninja",
    "--time-remaining",
    "--hardcore-time",
    "--empty-timebar",
    "--regular-grid",
    "--fine-grid",
    "--mode-indicator",
    "--door-switch-line",
    "--editor-crosshair",
    "--tiles-selected",
    "--entity-arrows",
    "--entity-palette-reticle"
  ], Mc = {
    "--main-menu-text": {
      file: "menu",
      index: 4
    },
    "--main-menu-selected": {
      file: "menu",
      index: 10
    },
    "--tiles": {
      file: "background",
      index: 0
    },
    "--tile-outline": {
      file: "background",
      index: 1
    },
    "--background": {
      file: "background",
      index: 2
    },
    "--ninja": {
      file: "ninja",
      index: 0
    },
    "--mine-exterior": {
      file: "entityMine",
      index: 0
    },
    "--mine-interior": {
      file: "entityMine",
      index: 1
    },
    "--toggle-mine": {
      file: "entityMine",
      index: 2
    },
    "--toggling-mine": {
      file: "entityMine",
      index: 3
    },
    "--gold-interior": {
      file: "entityGold",
      index: 0
    },
    "--gold-exterior": {
      file: "entityGold",
      index: 1
    },
    "--gold-shine": {
      file: "entityGold",
      index: 2
    },
    "--bounceblock-interior": {
      file: "entityBounceBlock",
      index: 0
    },
    "--bounceblock-border": {
      file: "entityBounceBlock",
      index: 1
    },
    "--oneway-long": {
      file: "entityOneWayPlatform",
      index: 0
    },
    "--oneway-short": {
      file: "entityOneWayPlatform",
      index: 1
    },
    "--boost-pad": {
      file: "entityBoostPad",
      index: 0
    },
    "--boost-pad-wooshing": {
      file: "entityBoostPad",
      index: 1
    },
    "--launch-pad-short": {
      file: "entityLaunchPad",
      index: 1
    },
    "--launch-pad-long": {
      file: "entityLaunchPad",
      index: 0
    },
    "--exit-panel": {
      file: "entityDoorExit",
      index: 0
    },
    "--exit-border": {
      file: "entityDoorExit",
      index: 1
    },
    "--open-exit-upper": {
      file: "entityDoorExit",
      index: 2
    },
    "--open-exit-lower": {
      file: "entityDoorExit",
      index: 3
    },
    "--exit-switch-border": {
      file: "entityDoorExitSwitch",
      index: 0
    },
    "--exit-switch-background": {
      file: "entityDoorExitSwitch",
      index: 3
    },
    "--exit-switch-border-collected": {
      file: "entityDoorExitSwitch",
      index: 1
    },
    "--exit-switch-background-collected": {
      file: "entityDoorExitSwitch",
      index: 4
    },
    "--exit-switch-center": {
      file: "entityDoorExitSwitch",
      index: 2
    },
    "--regular-door": {
      file: "entityDoorRegular",
      index: 0
    },
    "--locked-door-bar": {
      file: "entityDoorLocked",
      index: 0
    },
    "--locked-door-center": {
      file: "entityDoorLocked",
      index: 1
    },
    "--locked-switch-border": {
      file: "entityDoorLocked",
      index: 4
    },
    "--locked-switch-background": {
      file: "entityDoorLocked",
      index: 7
    },
    "--locked-switch-button": {
      file: "entityDoorLocked",
      index: 2
    },
    "--locked-switch-border-collected": {
      file: "entityDoorLocked",
      index: 5
    },
    "--locked-switch-background-collected": {
      file: "entityDoorLocked",
      index: 6
    },
    "--locked-switch-button-collected": {
      file: "entityDoorLocked",
      index: 3
    },
    "--trap-door-bar": {
      file: "entityDoorTrap",
      index: 0
    },
    "--trap-door-center": {
      file: "entityDoorTrap",
      index: 1
    },
    "--trap-switch-border": {
      file: "entityDoorTrap",
      index: 4
    },
    "--trap-switch-background": {
      file: "entityDoorTrap",
      index: 6
    },
    "--trap-switch-border-collected": {
      file: "entityDoorTrap",
      index: 5
    },
    "--trap-switch-background-collected": {
      file: "entityDoorTrap",
      index: 7
    },
    "--thwump-border": {
      file: "entityThwomp",
      index: 0
    },
    "--thwump-interior": {
      file: "entityThwomp",
      index: 1
    },
    "--thwump-ray": {
      file: "entityThwomp",
      index: 2
    },
    "--shove-thwump-armor": {
      file: "entityShoveThwomp",
      index: 2
    },
    "--shove-thwump-ray": {
      file: "entityShoveThwomp",
      index: 1
    },
    "--shove-thwump-center": {
      file: "entityShoveThwomp",
      index: 0
    },
    "--zap-drone-background": {
      file: "entityDroneZap",
      index: 0
    },
    "--zap-drone-border": {
      file: "entityDroneZap",
      index: 1
    },
    "--chase-drone-background": {
      file: "entityDroneChaser",
      index: 0
    },
    "--chase-drone-border": {
      file: "entityDroneChaser",
      index: 1
    },
    "--chaingun-drone-background": {
      file: "entityDroneChaingun",
      index: 0
    },
    "--chaingun-drone-border": {
      file: "entityDroneChaingun",
      index: 1
    },
    "--laser-drone-border": {
      file: "entityDroneLaser",
      index: 2
    },
    "--laser-drone-laser1": {
      file: "entityDroneLaser",
      index: 0
    },
    "--laser-drone-laser2": {
      file: "entityDroneLaser",
      index: 1
    },
    "--laser-drone-aim": {
      file: "entityDroneLaser",
      index: 3
    },
    "--bat-body": {
      file: "entityBat",
      index: 0
    },
    "--bat-eye": {
      file: "entityBat",
      index: 1
    },
    "--deathball-outer": {
      file: "entityBat",
      index: 2
    },
    "--deathball-middle": {
      file: "entityBat",
      index: 1
    },
    "--deathball-inner": {
      file: "entityBat",
      index: 0
    },
    "--evil-ninja": {
      file: "entityEvilNinja",
      index: 0
    },
    "--time-remaining": {
      file: "timeBar",
      index: 0
    },
    "--hardcore-time": {
      file: "timeBar",
      index: 1
    },
    "--empty-timebar": {
      file: "timeBar",
      index: 2
    },
    "--regular-grid": {
      file: "editor",
      index: 0
    },
    "--fine-grid": {
      file: "editor",
      index: 2
    },
    "--mode-indicator": {
      file: "editor",
      index: 4
    },
    "--door-switch-line": {
      file: "editor",
      index: 5
    },
    "--editor-crosshair": {
      file: "editor",
      index: 3
    },
    "--tiles-selected": {
      file: "editor",
      index: 8
    },
    "--entity-arrows": {
      file: "editor",
      index: 4
    },
    "--entity-palette-reticle": {
      file: "editor",
      index: 6
    }
  };
  let Kr;
  async function Bc() {
    const e = await (await fetch(Nc)).blob(), r = await createImageBitmap(e), n = document.createElement("canvas");
    n.width = r.width, n.height = r.height;
    const i = n.getContext("2d");
    i.drawImage(r, 0, 0), Kr = i;
  }
  function Gr(t) {
    const e = Kr, r = Or.indexOf(t);
    if (!e || r < 0) return;
    const n = {};
    for (const i of Rr) {
      const { file: _, index: l } = Mc[i], s = Cc[_] + l, c = e.getImageData(s, r, 1, 1).data, p = `rgb(${c[0]} ${c[1]} ${c[2]})`;
      n[i] = p;
    }
    return n;
  }
  function Ic(t) {
    for (const e of Rr) document.body.style.setProperty(e, t[e]);
  }
  var Oc = w('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label>/<label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>attract<input type=file style=display:none></label>/<label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>replay<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox></label> | Object corners <select><option>square</option><option>rounded</option></select> | <label>Friction mod <input type=checkbox></label> | <select></select><input type=text style=float:right>'), Rc = w("<option>");
  function Kc(t) {
    return (() => {
      var e = Oc(), r = e.firstChild, n = r.firstChild, i = n.nextSibling, _ = r.nextSibling, l = _.nextSibling, s = l.firstChild, c = s.nextSibling, p = l.nextSibling, $ = p.nextSibling, b = $.firstChild, B = b.nextSibling, C = $.nextSibling, G = C.nextSibling, V = G.nextSibling, X = V.nextSibling, F = X.firstChild, L = F.nextSibling, M = X.nextSibling, K = M.nextSibling, H = K.firstChild, se = H.nextSibling, _e = K.nextSibling, ce = _e.nextSibling, pe = ce.firstChild, de = pe.nextSibling, oe = ce.nextSibling, ie = oe.nextSibling, S = ie.nextSibling;
      return i.addEventListener("change", function() {
        const k = this.files;
        if (k && k.length > 0) {
          const E = new FileReader();
          E.onloadend = () => {
            E.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(E.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, E.readAsArrayBuffer(k[0]);
        }
      }), c.addEventListener("change", function() {
        const k = this.files;
        if (k && k.length > 0) {
          const E = new FileReader();
          E.onloadend = () => {
            if (E.result instanceof ArrayBuffer) {
              const q = t.editor.load_attract(new Uint8Array(E.result), t.roundCorners(), t.dynamicFriction());
              t.render(true), t.setLevelName(t.editor.get_level_name()), t.setReplay(q);
            }
          }, E.readAsArrayBuffer(k[0]);
        }
      }), B.addEventListener("change", function() {
        const k = this.files;
        if (k && k.length > 0) {
          const E = new FileReader();
          E.onloadend = () => {
            if (E.result instanceof ArrayBuffer) {
              const q = t.editor.load_outte_replay(new Uint8Array(E.result), t.roundCorners(), t.dynamicFriction());
              t.render(true), t.setReplay(q);
            }
          }, E.readAsArrayBuffer(k[0]);
        }
      }), G.$$click = function() {
        const k = t.editor.export_map(), E = new Blob([
          k.buffer
        ], {
          type: "application/octet-stream"
        }), q = URL.createObjectURL(E);
        this.href = q, this.download = t.editor.get_level_name().replaceAll(/[^a-z]/gi, "_"), setTimeout(() => URL.revokeObjectURL(q), 100);
      }, L.addEventListener("change", (k) => {
        t.setShowTrail(k.currentTarget.checked), t.editor.set_show_trail(k.currentTarget.checked);
      }), K.addEventListener("change", (k) => t.setRoundCorners(k.currentTarget.value == "rounded")), de.addEventListener("change", (k) => {
        t.setDynamicFriction(k.currentTarget.checked);
      }), ie.addEventListener("change", (k) => {
        const E = Gr(k.currentTarget.value);
        E && t.setPalette({
          name: k.currentTarget.value,
          colors: E
        });
      }), g(ie, () => Or.map((k) => (() => {
        var E = Rc();
        return g(E, k), D(() => {
          var _a2;
          return E.selected = k === (((_a2 = t.palette()) == null ? void 0 : _a2.name) ?? "vasquez");
        }), E;
      })())), S.addEventListener("change", () => Br(t.editor)), S.$$input = (k) => {
        t.editor.set_level_name(k.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, D((k) => {
        var E = !t.roundCorners(), q = t.roundCorners();
        return E !== k.e && (H.selected = k.e = E), q !== k.t && (se.selected = k.t = q), k;
      }, {
        e: void 0,
        t: void 0
      }), D(() => L.checked = t.showTrail()), D(() => de.checked = t.dynamicFriction()), D(() => S.value = t.levelName()), e;
    })();
  }
  wt([
    "click",
    "input"
  ]);
  var Gc = w("<svg><use href=#zapdrone></svg>", false, true, false), Hc = w('<svg><g id=zapdrone><path fill=var(--zap-drone-background) stroke=var(--zap-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--zap-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--zap-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false), zc = w('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 1 12 12 a 12 12 0 0 1 -12 12 l 5 -5 m 0 10 l -5 -5"></svg>', false, true, false), Vc = w('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 0 12 -12 a 12 12 0 0 0 -12 -12 l 5 5 m 0 -10 l -5 5"></svg>', false, true, false), Uc = w('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V 24 l -5 -5 m 10 0 l -5 5"></svg>', false, true, false), qc = w('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V -24 l -5 5 m 10 0 l -5 -5"></svg>', false, true, false), Fc = w("<svg><g></svg>", false, true, false);
  function Wc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Zc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Yc([t, e], r, n) {
    const i = t(), _ = r.zap_drones_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.zap_drone_x(s, n),
        y: r.zap_drone_y(s, n),
        deg: r.zap_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && Wc(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Hr(t) {
    return d(U, {
      get each() {
        return t.zapDrones();
      },
      children: (e) => (() => {
        var r = Gc();
        return D(() => h(r, "transform", Zc(e))), r;
      })()
    });
  }
  function zr() {
    return (() => {
      var t = Hc(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  function Jc({ entities: t }) {
    const e = () => t.zapDrones().at(0) ?? t.chaseDrones().at(0) ?? t.chaingunDrones().at(0) ?? t.laserDrones().at(0), r = (n) => {
      const i = n();
      if (i) {
        const { x: _, y: l, deg: s } = i;
        return `translate(${_},${l}) rotate(${s},0,0)`;
      } else return "";
    };
    return (() => {
      var n = Fc();
      return g(n, d(R, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 0;
        },
        get children() {
          return zc();
        }
      }), null), g(n, d(R, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 1;
        },
        get children() {
          return Vc();
        }
      }), null), g(n, d(R, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 2;
        },
        get children() {
          return Uc();
        }
      }), null), g(n, d(R, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 3;
        },
        get children() {
          return qc();
        }
      }), null), D(() => h(n, "transform", r(e))), n;
    })();
  }
  var Xc = w("<svg><use href=#chaingundrone></svg>", false, true, false), Qc = w('<svg><g id=chaingundrone><path fill=var(--chaingun-drone-background) stroke=var(--chaingun-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chaingun-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--chaingun-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function ed(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function td(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function rd([t, e], r, n) {
    const i = t(), _ = r.chaingun_drones_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.chaingun_drone_x(s, n),
        y: r.chaingun_drone_y(s, n),
        deg: r.chaingun_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && ed(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Vr(t) {
    return d(U, {
      get each() {
        return t.chaingunDrones();
      },
      children: (e) => (() => {
        var r = Xc();
        return D(() => h(r, "transform", td(e))), r;
      })()
    });
  }
  function Ur() {
    return (() => {
      var t = Qc(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var nd = w("<svg><use href=#bat></svg>", false, true, false), sd = w("<svg><circle id=bat r=5 cx=0 cy=0 fill=var(--bat-body)></svg>", false, true, false);
  function od(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function id(t) {
    return d(U, {
      get each() {
        return t.bats();
      },
      children: (e) => (() => {
        var r = nd();
        return D(() => h(r, "transform", od(e))), r;
      })()
    });
  }
  function _d() {
    return sd();
  }
  var ld = w("<svg><use href=#laserdrone></svg>", false, true, false), ad = w('<svg><g id=laserdrone><path fill=none stroke=var(--laser-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--laser-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--laser-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function cd(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function dd(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function ud([t, e], r, n) {
    const i = t(), _ = r.laser_drones_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.laser_drone_x(s, n),
        y: r.laser_drone_y(s, n),
        deg: r.laser_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && cd(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function qr(t) {
    return d(U, {
      get each() {
        return t.laserDrones();
      },
      children: (e) => (() => {
        var r = ld();
        return D(() => h(r, "transform", dd(e))), r;
      })()
    });
  }
  function Fr() {
    return (() => {
      var t = ad(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var pd = w("<svg><use href=#chasedrone></svg>", false, true, false), hd = w('<svg><g id=chasedrone><path fill=var(--chase-drone-background) stroke=var(--chase-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chase-drone-border) d="M 10 -3 H 3 A 3 3 0 0 0 0 0 A 3 3 0 0 0 3 3 H 10 Z"></path><path fill=none stroke=var(--chase-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function gd(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function fd(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function yd([t, e], r, n) {
    const i = t(), _ = r.chase_drones_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.chase_drone_x(s, n),
        y: r.chase_drone_y(s, n),
        deg: r.chase_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && gd(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Wr(t) {
    return d(U, {
      get each() {
        return t.chaseDrones();
      },
      children: (e) => (() => {
        var r = pd();
        return D(() => h(r, "transform", fd(e))), r;
      })()
    });
  }
  function Zr() {
    return (() => {
      var t = hd(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var wd = w("<svg><use href=#gold></svg>", false, true, false), bd = w("<svg><g id=gold><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--gold-exterior) r=2.727272727272727></circle><circle fill=var(--gold-interior) r=1.9090909090909092></svg>", false, true, false);
  function md(t, e) {
    return t.x === e.x && t.y === e.y && t.collected === e.collected;
  }
  function xd(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function vd([t, e], r) {
    const n = t(), i = r.golds_len(), _ = [];
    for (let l = 0; l < i; l++) {
      const s = n.at(l), c = {
        x: r.gold_x(l),
        y: r.gold_y(l),
        collected: r.gold_collected(l)
      };
      s && md(s, c) ? _.push(s) : _.push(c);
    }
    e(_);
  }
  function Yr(t) {
    return d(U, {
      get each() {
        return t.golds();
      },
      children: (e) => d(R, {
        get when() {
          return !e().collected;
        },
        get children() {
          var r = wd();
          return D(() => h(r, "transform", xd(e))), r;
        }
      })
    });
  }
  function Jr() {
    return (() => {
      var t = bd(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, i = n.nextSibling, _ = i.nextSibling;
      return _.nextSibling, t;
    })();
  }
  var $d = w("<svg><use href=#deathball></svg>", false, true, false), kd = w('<svg><g id=deathball><path d="M -7 0 A 7 7 0 0 0 0 7 A 7 7 0 0 0 7 0 A 7 7 0 0 0 0 -7"stroke=var(--deathball-outer) stroke-width=2 fill=none stroke-linecap=round></path><path d="M 0 -4 A 4 4 0 0 0 -4 0 A 4 4 0 0 0 0 4 A 4 4 0 0 0 4 0"stroke=var(--deathball-middle) stroke-width=3 fill=none stroke-linecap=round></path><circle r=2 cx=0 cy=0 fill=var(--deathball-inner)></svg>', false, true, false);
  function Dd(t, e) {
    return t.x === e.x && t.y === e.y;
  }
  function Sd(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r}) rotate(45)`;
  }
  function jd([t, e], r, n) {
    const i = t(), _ = r.deathballs_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.deathball_x(s, n),
        y: r.deathball_y(s, n)
      };
      c && Dd(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Xr(t) {
    return d(U, {
      get each() {
        return t.deathballs();
      },
      children: (e) => (() => {
        var r = $d();
        return D(() => h(r, "transform", Sd(e))), r;
      })()
    });
  }
  function Qr() {
    return kd();
  }
  var Pd = w("<svg><use href=#evilninja stroke=var(--evil-ninja)></svg>", false, true, false), Td = w("<svg><use href=#evilninja stroke=var(--ninja)></svg>", false, true, false), Ld = w('<svg><g id=evilninja><path d="M 2 -5 l -2 -2 h -5"transform="rotate(  0,0,0)"fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform="rotate( 45,0,0)"fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform="rotate( 90,0,0)"fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(135,0,0) fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(180,0,0) fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(225,0,0) fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(270,0,0) fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(315,0,0) fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  const en = 0, Ed = 1, Lt = 2;
  function Nd(t, e) {
    return t.type === Lt || e.type === Lt ? false : t.x === e.x && t.y === e.y && t.deg === e.deg && t.type === e.type && t.scale == e.scale;
  }
  function Ut(t) {
    const { x: e, y: r, deg: n, scale: i } = t();
    return `translate(${e},${r}) rotate(${n},0,0) scale(${i})`;
  }
  function Ad([t, e], r, n) {
    const i = t(), _ = r.evil_ninjas_len(), l = [];
    for (let s = 0; s < _; s++) {
      const c = i.at(s), p = {
        x: r.evil_ninja_x(s, n),
        y: r.evil_ninja_y(s, n),
        deg: r.evil_ninja_deg(s, n),
        scale: r.evil_ninja_scale(s),
        bones: r.evil_ninja_bones(s),
        type: r.evil_ninja_type(s)
      };
      c && Nd(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function tn(t) {
    return d(U, {
      get each() {
        return t.evilNinjas();
      },
      children: (e) => d(dr, {
        get children() {
          return [
            d(qe, {
              get when() {
                return e().type === en;
              },
              get children() {
                var r = Pd();
                return D(() => h(r, "transform", Ut(e))), r;
              }
            }),
            d(qe, {
              get when() {
                return e().type === Ed;
              },
              get children() {
                var r = Td();
                return D(() => h(r, "transform", Ut(e))), r;
              }
            }),
            d(qe, {
              get when() {
                return e().type === Lt;
              },
              get children() {
                return d(Be, {
                  class: "ninja preview",
                  ninja: e,
                  bones: () => e().bones
                });
              }
            })
          ];
        }
      })
    });
  }
  function rn() {
    return (() => {
      var t = Ld(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, i = n.nextSibling, _ = i.nextSibling, l = _.nextSibling, s = l.nextSibling;
      return s.nextSibling, t;
    })();
  }
  var Cd = w("<svg><line x1=6 y1=-10 x2=6 y2=-6 class=door-switch-line></svg>", false, true, false), Md = w("<svg><line x1=6 y1=6 x2=6 y2=10 class=door-switch-line></svg>", false, true, false), Bd = w("<svg><line x1=4 x2=8 class=door-switch-line></svg>", false, true, false), Id = w("<svg><g><rect x=0 y=-12 width=12 height=24 fill=url(#portal-gradient)></svg>", false, true, false), Od = w("<svg><linearGradient id=portal-gradient><stop stop-color=var(--open-exit-lower) offset=0%></stop><stop stop-color=var(--background) offset=100%></svg>", false, true, false);
  function Rd(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Kd([t, e], r) {
    const n = r.portals_len(), i = [];
    for (let _ = 0; _ < n; _++) if (r.portal_active(_)) {
      const l = {
        x: r.portal_side1_x(_),
        y: r.portal_side1_y(_),
        deg: r.portal_side1_deg(_),
        mode: 0
      }, s = {
        x: r.portal_side2_x(_),
        y: r.portal_side2_y(_),
        deg: r.portal_side2_deg(_),
        mode: 0
      };
      i.push(l, s);
    }
    e(i);
  }
  function nn(t) {
    return d(U, {
      get each() {
        return t.portals();
      },
      children: (e) => d(Gd, {
        portal: e,
        get showMode() {
          return t.showMode;
        }
      })
    });
  }
  function Gd(t) {
    return (() => {
      var e = Id();
      return e.firstChild, g(e, d(R, {
        get when() {
          return t.showMode;
        },
        get children() {
          return [
            Cd(),
            Md(),
            (() => {
              var r = Bd();
              return D((n) => {
                var i = t.portal().mode ? 8 : -8, _ = t.portal().mode ? 8 : -8;
                return i !== n.e && h(r, "y1", n.e = i), _ !== n.t && h(r, "y2", n.t = _), n;
              }, {
                e: void 0,
                t: void 0
              }), r;
            })()
          ];
        }
      }), null), D(() => h(e, "transform", Rd(t.portal))), e;
    })();
  }
  function sn() {
    return Od();
  }
  var Hd = w('<svg><rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"width=150 height=150 style=mix-blend-mode:hard-light></svg>', false, true, false), zd = w("<svg><circle fill=none stroke=var(--entity-palette-reticle) r=16></svg>", false, true, false), Vd = w('<svg><path d="M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12"fill-rule=evenodd fill="color-mix(in srgb,var(--background) 18%,white 15%)"style=mix-blend-mode:hard-light></svg>', false, true, false), Ud = w("<svg><rect fill=none stroke=var(--editor-crosshair) stroke-width=2 width=26 height=26></svg>", false, true, false), qd = w("<svg><use href=#tilemode-crosshair></svg>", false, true, false), Fd = w("<svg><use href=#crosshair></svg>", false, true, false), Wd = w("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), Zd = w('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none></path></g><path stroke=red fill=none>'), qt = w("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), Ft = w("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), Yd = w("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), Jd = w("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), Xd = w("<svg><text></svg>", false, true, false), Qd = w("<svg><line class=door-switch-line></svg>", false, true, false);
  const $t = 42, kt = 23, Wt = 0, Zt = 1, eu = 3, tu = 4, Dt = 5, Yt = 6, Jt = 7, ru = 8, St = 9, nu = 0, su = 1, ou = 2, iu = 3, _u = 5, lu = 6, au = 8, cu = 10, du = 11, uu = 12, pu = 13, hu = 14, gu = 15, fu = 16, yu = 17, wu = 20, bu = 22, mu = 21, xu = 24, vu = 25, $u = 27, ku = 28, Du = 29, Su = new Float64Array([
    -0.039,
    -0.0249,
    0.1127,
    -0.1738,
    0.1115,
    -0.1512,
    -0.0846,
    0.0749,
    0.1072,
    -0.0423,
    0.0263,
    -0.1452,
    -0.0358,
    -0.075,
    -0.377,
    0.4686,
    0.4643,
    -0.0225,
    -0.0453,
    -0.5054,
    -0.4724,
    0.1962,
    0.2293,
    -0.1812,
    -0.2266,
    -0.2224
  ]), ju = new Float64Array([
    0.018,
    0,
    0.4156,
    0.0988,
    0.3581,
    -0.3242,
    -0.0708,
    0.0845,
    0.2924,
    0.3212,
    0.1853,
    -0.1927,
    -0.0236,
    -0.06,
    -0.3602,
    0.3086,
    0.1278,
    -0.3238,
    -0.2018,
    -0.4976,
    -0.4488,
    0.0656,
    -0.024,
    -0.2729,
    -0.3268,
    -0.2042
  ]), Xt = 150;
  function Pu(t, e) {
    const r = e.map((n) => ({
      x: n.x,
      y: n.y,
      count: n.stack_count
    })).filter(({ count: n }) => n > 1);
    t(r);
  }
  function Qt() {
    const [t, e] = f([]), [r, n] = f([]), [i, _] = f([]), [l, s] = f([]), [c, p] = f([]), [$, b] = f([]), [B, C] = f([]), [G, V] = f([]), [X, F] = f([]), [L, M] = f([]), [K, H] = f([]), [se, _e] = f([]), [ce, pe] = f([]), [de, oe] = f([]), [ie, S] = f([]), [k, E] = f([]), [q, $e] = f([]), [P, re] = f([]), [W, ye] = f([]), [he, me] = f([]), [we, Ee] = f([]), [Ne, u] = f([]), [y, Re] = f([]), [Y, ge] = f([]), [xe, ve] = f([]);
    return {
      ninjas: t,
      setNinjas: e,
      mines: r,
      setMines: n,
      golds: i,
      setGolds: _,
      exitDoors: l,
      setExitDoors: s,
      exitSwitches: c,
      setExitSwitches: p,
      regularDoors: $,
      setRegularDoors: b,
      lockedDoors: B,
      setLockedDoors: C,
      lockedSwitches: G,
      setLockedSwitches: V,
      trapDoors: X,
      setTrapDoors: F,
      trapSwitches: L,
      setTrapSwitches: M,
      launchPads: K,
      setLaunchPads: H,
      oneWays: se,
      setOneWays: _e,
      chaingunDrones: ce,
      setChaingunDrones: pe,
      laserDrones: de,
      setLaserDrones: oe,
      zapDrones: ie,
      setZapDrones: S,
      chaseDrones: k,
      setChaseDrones: E,
      floorGuards: q,
      setFloorGuards: $e,
      bounceBlocks: P,
      setBounceBlocks: re,
      thwumps: W,
      setThwumps: ye,
      evilNinjas: he,
      setEvilNinjas: me,
      boostPads: we,
      setBoostPads: Ee,
      deathballs: Ne,
      setDeathballs: u,
      bats: y,
      setBats: Re,
      shoveThwumps: Y,
      setShoveThwumps: ge,
      portals: xe,
      setPortals: ve
    };
  }
  function er(t, e, r, n) {
    const i = [], _ = [], l = [], s = [], c = [], p = [], $ = [], b = [], B = [], C = [], G = [], V = [], X = [], F = [], L = [], M = [], K = [], H = [], se = [], _e = [], ce = [], pe = [], de = [], oe = [], ie = [];
    for (const S of r) {
      const k = {
        x: S.x,
        y: S.y,
        deg: S.deg,
        mode: S.mode,
        animProgress: 0
      }, E = {
        x: S.switch_x,
        y: S.switch_y,
        animProgress: 0,
        wasTouched: false
      }, q = {
        x1: S.x,
        y1: S.y,
        x2: S.switch_x,
        y2: S.switch_y
      };
      S.type_int === nu ? i.push(k) : S.type_int === su ? _.push({
        ...k,
        type: ia
      }) : S.type_int === mu ? _.push({
        ...k,
        type: _a
      }) : S.type_int === ou ? l.push({
        ...k,
        collected: false
      }) : S.type_int === iu ? (s.push(k), Number.isNaN(S.switch_x) || (c.push(E), e.push(q))) : S.type_int === _u ? p.push(k) : S.type_int === lu ? ($.push(k), Number.isNaN(S.switch_x) || (b.push(E), e.push(q))) : S.type_int === au ? (B.push({
        ...k,
        animProgress: n ? 1 : -1
      }), Number.isNaN(S.switch_x) || (C.push(E), e.push(q))) : S.type_int === cu ? G.push(k) : S.type_int === du ? V.push(k) : S.type_int === uu ? X.push(k) : S.type_int === pu ? F.push(k) : S.type_int === hu ? L.push(k) : S.type_int === gu ? M.push(k) : S.type_int === fu ? K.push(k) : S.type_int === yu ? H.push(k) : S.type_int === wu ? se.push(k) : S.type_int === bu ? _e.push({
        ...k,
        type: en,
        scale: 1
      }) : S.type_int === xu ? ce.push({
        ...k,
        animProgress: 1
      }) : S.type_int === vu ? pe.push(k) : S.type_int === $u ? de.push(k) : S.type_int === ku ? oe.push({
        ...k,
        touch: 16
      }) : S.type_int === Du && (ie.push(k), Number.isNaN(S.switch_x) || (ie.push({
        x: S.switch_x,
        y: S.switch_y,
        deg: S.deg2,
        mode: S.mode2
      }), e.push(q))), S.free();
    }
    t.setNinjas(i), t.setMines(_), t.setGolds(l), t.setExitDoors(s), t.setExitSwitches(c), t.setRegularDoors(p), t.setLockedDoors($), t.setLockedSwitches(b), t.setTrapDoors(B), t.setTrapSwitches(C), t.setLaunchPads(G), t.setOneWays(V), t.setChaingunDrones(X), t.setLaserDrones(F), t.setZapDrones(L), t.setChaseDrones(M), t.setFloorGuards(K), t.setBounceBlocks(H), t.setThwumps(se), t.setEvilNinjas(_e), t.setBoostPads(ce), t.setDeathballs(pe), t.setBats(de), t.setShoveThwumps(oe), t.setPortals(ie);
  }
  function tr({ entities: t }) {
    return [
      d(nn, {
        get portals() {
          return t.portals;
        },
        showMode: true
      }),
      d(kr, {
        get trapDoors() {
          return t.trapDoors;
        }
      }),
      d(xr, {
        get lockedDoors() {
          return t.lockedDoors;
        }
      }),
      d(vr, {
        get lockedSwitches() {
          return t.lockedSwitches;
        }
      }),
      d(Dr, {
        get trapSwitches() {
          return t.trapSwitches;
        }
      }),
      d(hr, {
        get exitDoors() {
          return t.exitDoors;
        }
      }),
      d(fr, {
        get oneWays() {
          return t.oneWays;
        }
      }),
      d(wr, {
        get mines() {
          return t.mines;
        }
      }),
      d(Yr, {
        get golds() {
          return t.golds;
        }
      }),
      d(gr, {
        get exitSwitches() {
          return t.exitSwitches;
        }
      }),
      d(mr, {
        get regularDoors() {
          return t.regularDoors;
        }
      }),
      d(jr, {
        get launchPads() {
          return t.launchPads;
        }
      }),
      d(qr, {
        get laserDrones() {
          return t.laserDrones;
        }
      }),
      d(Vr, {
        get chaingunDrones() {
          return t.chaingunDrones;
        }
      }),
      d(Hr, {
        get zapDrones() {
          return t.zapDrones;
        }
      }),
      d(Wr, {
        get chaseDrones() {
          return t.chaseDrones;
        }
      }),
      d(Pr, {
        get floorGuards() {
          return t.floorGuards;
        }
      }),
      d(id, {
        get bats() {
          return t.bats;
        }
      }),
      d(Xr, {
        get deathballs() {
          return t.deathballs;
        }
      }),
      d(Ar, {
        get thwumps() {
          return t.thwumps;
        }
      }),
      d(tn, {
        get evilNinjas() {
          return t.evilNinjas;
        }
      }),
      d(gt, {
        get each() {
          return t.ninjas();
        },
        children: (e) => d(Be, {
          class: "ninja",
          ninja: () => e,
          bones: () => Su
        })
      }),
      d(Tr, {
        get bounceBlocks() {
          return t.bounceBlocks;
        }
      }),
      d(Mr, {
        get shoveThwumps() {
          return t.shoveThwumps;
        }
      }),
      d(Er, {
        get boostPads() {
          return t.boostPads;
        }
      })
    ];
  }
  function Tu(t) {
    const { editor: e, pastNinjas: r } = t, [n, i] = f(""), [_, l] = f(""), [s, c] = f(true), [p, $] = f(false), [b, B] = f(Wt), [C, G] = f({
      row: 1,
      col: 1
    }), [V, X] = f({
      x: 24,
      y: 24
    }), [F, L] = f(""), [M, K] = f({
      x: NaN,
      y: NaN
    }), [H, se] = f({
      x: NaN,
      y: NaN
    }), _e = Qt(), ce = Qt(), [pe, de] = f([]), [oe, ie] = f(e.get_show_trail()), [S, k] = f(), [E, q] = f([]), [$e] = f(""), P = (u) => {
      let y = false;
      if (!(u.target instanceof HTMLInputElement || u.target instanceof HTMLSelectElement)) {
        if (u.ctrlKey || u.metaKey) {
          u.code === "KeyZ" && (u.ctrlKey || u.metaKey) && u.shiftKey ? (y = true, e.redo()) : u.code === "KeyZ" && (u.ctrlKey || u.metaKey) ? (y = true, e.undo()) : u.code === "KeyY" && (u.ctrlKey || u.metaKey) && (y = true, e.redo()), y && (W(true), u.preventDefault());
          return;
        }
        u.shiftKey && (y = true, e.press_shift()), u.code === "Enter" && e.mode() === St ? t.setReplay(e.to_replay(t.roundCorners(), t.dynamicFriction())) : u.code === "Backquote" ? (y = true, e.press_backtick()) : u.code === "Digit1" ? (y = true, e.press_1(u.shiftKey)) : u.code === "Digit2" ? (y = true, e.press_2(u.shiftKey)) : u.code === "Digit3" ? (y = true, e.press_3(u.shiftKey)) : u.code === "Digit4" ? (y = true, e.press_4(u.shiftKey)) : u.code === "Digit5" ? (y = true, e.press_5(u.shiftKey)) : u.code === "Digit6" ? (y = true, e.press_6(u.shiftKey)) : u.code === "Digit7" ? (y = true, e.press_7(u.shiftKey)) : u.code === "Digit8" ? (y = true, e.press_8(u.shiftKey)) : u.code === "Digit9" ? (y = true, e.press_9()) : u.code === "Digit0" ? (y = true, e.press_0()) : u.code === "Minus" ? (y = true, e.press_dash()) : u.code === "Equal" ? (y = true, e.press_equals()) : u.code === "KeyQ" ? (y = true, e.press_q(u.shiftKey)) : u.code === "KeyW" ? (y = true, e.press_w(u.shiftKey)) : u.code === "KeyA" ? (y = true, e.press_a(u.shiftKey)) : u.code === "KeyS" ? (y = true, e.press_s(u.shiftKey)) : u.code === "KeyE" ? (y = true, e.press_e()) : u.code === "KeyD" ? (y = true, e.press_d()) : u.code === "KeyZ" ? (y = true, e.press_z()) : u.code === "KeyX" ? (y = true, e.press_x()) : u.code === "KeyC" ? (y = true, e.press_c()) : u.code === "Space" ? (y = true, e.press_space()) : u.code === "AltLeft" ? (y = true, e.press_alt_left(u.shiftKey)) : u.code === "KeyR" ? (y = true, e.press_r()) : u.code === "KeyT" ? (y = true, e.press_t()) : u.code === "KeyY" ? (y = true, e.press_y()) : u.code === "KeyU" ? (y = true, e.press_u()) : u.code === "KeyI" ? (y = true, e.press_i()) : u.code === "KeyO" ? (y = true, e.press_o()) : u.code === "KeyP" ? (y = true, e.press_p()) : u.code === "BracketLeft" ? (y = true, e.press_bracket_left()) : u.code === "BracketRight" ? (y = true, e.press_bracket_right()) : u.code === "KeyF" ? (y = true, e.press_f()) : u.code === "KeyH" ? (y = true, e.press_h()) : u.code === "KeyJ" ? (y = true, e.press_j()) : u.code === "KeyK" ? (y = true, e.press_k()) : u.code === "KeyL" ? (y = true, e.press_l()) : u.code === "KeyB" ? (y = true, e.press_b()) : u.code === "KeyN" ? (y = true, e.press_n()) : u.code === "KeyM" ? (y = true, e.press_m()) : u.code === "Comma" ? (y = true, e.press_comma()) : u.code === "ArrowUp" ? (y = true, e.press_up(u.shiftKey)) : u.code === "ArrowDown" ? (y = true, e.press_down(u.shiftKey)) : u.code === "ArrowLeft" ? (y = true, e.press_left(u.shiftKey)) : u.code === "ArrowRight" ? (y = true, e.press_right(u.shiftKey)) : u.code === "Enter" ? (y = true, e.press_enter()) : u.code === "Escape" ? y = e.press_escape() : u.code === "Slash" && (y = true, e.press_slash()), y && (W(true), u.preventDefault());
      }
    }, re = (u) => {
      let y = false;
      u.shiftKey || (y = true, e.release_shift()), u.code === "KeyQ" ? (y = true, e.release_q()) : u.code === "KeyW" ? (y = true, e.release_w()) : u.code === "KeyA" ? (y = true, e.release_a()) : u.code === "KeyS" ? (y = true, e.release_s()) : u.code === "KeyE" ? (y = true, e.release_e()) : u.code === "KeyD" ? (y = true, e.release_d()) : u.code === "KeyZ" ? (y = true, e.release_z()) : u.code === "KeyC" ? (y = true, e.release_c()) : u.code === "Space" ? (y = true, e.release_space()) : u.code === "AltLeft" && (y = true, e.release_alt_left()), y && (W(false), u.preventDefault());
    };
    document.addEventListener("keydown", P), document.addEventListener("keyup", re), Ie(() => {
      document.removeEventListener("keydown", P), document.removeEventListener("keyup", re);
    });
    function W(u) {
      B(e.mode()), i(e.tiles_path()), l(e.selected_tiles_path()), G({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), $(e.show_quarter_grid()), X({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const y = [];
      er(_e, y, e.entities(), false), er(ce, y, e.preview_entities(), true), Pu(q, e.entities()), de(y), L(e.selected_tile_outline_path()), K({
        x: e.palette_center_x(),
        y: e.palette_center_y()
      }), se({
        x: e.palette_selection_x(),
        y: e.palette_selection_y()
      }), k(e.past_ninja_bones()), u && Br(e);
    }
    const ye = [];
    for (let u = 0; u < $t - 1; u++) ye.push(48 + 24 * u);
    const he = [];
    for (let u = 0; u < kt - 1; u++) he.push(48 + 24 * u);
    const me = [];
    for (let u = 0; u < $t; u++) me.push(36 + 24 * u);
    const we = [];
    for (let u = 0; u < kt; u++) we.push(36 + 24 * u);
    const Ee = [];
    for (let u = 0; u < $t * 2; u++) Ee.push(30 + 12 * u);
    const Ne = [];
    for (let u = 0; u < kt * 2; u++) Ne.push(30 + 12 * u);
    return W(false), [
      (() => {
        var u = Zd(), y = u.firstChild, Re = y.firstChild, Y = Re.nextSibling;
        Y.nextSibling;
        var ge = y.nextSibling, xe = ge.nextSibling, ve = xe.nextSibling, Ae = ve.nextSibling, Xe = Ae.firstChild, je = Ae.nextSibling;
        return u.$$contextmenu = (x) => {
          e.press_escape() && (W(false), x.preventDefault());
        }, u.$$mouseup = () => {
          e.cursor_up(), W(false);
        }, u.$$dblclick = (x) => {
          e.double_click(x.shiftKey), W(false);
        }, u.$$mousedown = (x) => {
          x.buttons & 2 || (e.mode() === St ? t.setReplay(e.to_replay(t.roundCorners(), t.dynamicFriction())) : (e.cursor_down(x.shiftKey), W(true)));
        }, u.$$mousemove = function(x) {
          const { left: v, top: N, width: T, height: ue } = this.getBoundingClientRect(), ke = e.set_cursor_pos((x.clientX - v) / T * 1056, (x.clientY - N) / ue * 600, x.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (x.clientX - v) / T * 1056,
            y: (x.clientY - N) / ue * 600
          }), ke && W(false);
        }, g(y, d(br, {}), Y), g(y, d(Jr, {}), Y), g(y, d(yr, {}), Y), g(y, d(Lr, {}), Y), g(y, d($r, {}), Y), g(y, d(Sr, {}), Y), g(y, d(Nr, {}), Y), g(y, d(Cr, {}), Y), g(y, d(rn, {}), Y), g(y, d(Ur, {}), Y), g(y, d(Fr, {}), Y), g(y, d(zr, {}), Y), g(y, d(Zr, {}), Y), g(y, d(_d, {}), Y), g(y, d(Qr, {}), Y), g(y, d(sn, {}), Y), g(u, d(R, {
          get when() {
            return p();
          },
          get children() {
            return [
              ze(() => Ee.map((x) => (() => {
                var v = qt();
                return h(v, "x1", x), h(v, "x2", x), v;
              })())),
              ze(() => Ne.map((x) => (() => {
                var v = Ft();
                return h(v, "y1", x), h(v, "y2", x), v;
              })()))
            ];
          }
        }), ge), g(u, d(R, {
          get when() {
            return s();
          },
          get children() {
            return [
              ze(() => me.map((x) => (() => {
                var v = qt();
                return h(v, "x1", x), h(v, "x2", x), v;
              })())),
              ze(() => we.map((x) => (() => {
                var v = Ft();
                return h(v, "y1", x), h(v, "y2", x), v;
              })()))
            ];
          }
        }), ge), g(u, () => ye.map((x) => (() => {
          var v = Yd();
          return h(v, "x1", x), h(v, "x2", x), v;
        })()), ge), g(u, () => he.map((x) => (() => {
          var v = Jd();
          return h(v, "y1", x), h(v, "y2", x), v;
        })()), ge), g(u, d(tr, {
          entities: _e
        }), ge), g(u, d(gt, {
          get each() {
            return E();
          },
          children: (x) => (() => {
            var v = Xd();
            return g(v, () => x.count), D((N) => {
              var T = x.x + 4, ue = x.y + 12;
              return T !== N.e && h(v, "x", N.e = T), ue !== N.t && h(v, "y", N.t = ue), N;
            }, {
              e: void 0,
              t: void 0
            }), v;
          })()
        }), xe), g(u, d(R, {
          get when() {
            return b() === Jt;
          },
          get children() {
            var x = Hd();
            return D((v) => {
              var N = M().x - Xt / 2, T = M().y - Xt / 2;
              return N !== v.e && h(x, "x", v.e = N), T !== v.t && h(x, "y", v.t = T), v;
            }, {
              e: void 0,
              t: void 0
            }), x;
          }
        }), xe), g(xe, d(tr, {
          entities: ce
        })), g(u, d(R, {
          get when() {
            return [
              Dt,
              Yt,
              tu
            ].includes(b());
          },
          get children() {
            return d(Jc, {
              entities: ce
            });
          }
        }), ve), g(u, d(R, {
          get when() {
            return b() === Jt;
          },
          get children() {
            var x = zd();
            return D((v) => {
              var N = H().x, T = H().y;
              return N !== v.e && h(x, "cx", v.e = N), T !== v.t && h(x, "cy", v.t = T), v;
            }, {
              e: void 0,
              t: void 0
            }), x;
          }
        }), ve), g(u, d(R, {
          get when() {
            return b() === Zt;
          },
          get children() {
            var x = Vd();
            return D(() => h(x, "transform", `translate(${M().x},${M().y})`)), x;
          }
        }), ve), g(u, d(R, {
          get when() {
            return b() === Zt;
          },
          get children() {
            var x = Ud();
            return D((v) => {
              var N = H().x - 13, T = H().y - 13;
              return N !== v.e && h(x, "x", v.e = N), T !== v.t && h(x, "y", v.t = T), v;
            }, {
              e: void 0,
              t: void 0
            }), x;
          }
        }), Ae), g(u, d(gt, {
          get each() {
            return pe();
          },
          children: (x) => (() => {
            var v = Qd();
            return D((N) => {
              var T = x.x1, ue = x.y1, ke = x.x2, Qe = x.y2;
              return T !== N.e && h(v, "x1", N.e = T), ue !== N.t && h(v, "y1", N.t = ue), ke !== N.a && h(v, "x2", N.a = ke), Qe !== N.o && h(v, "y2", N.o = Qe), N;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), v;
          })()
        }), Ae), g(u, d(R, {
          get when() {
            return b() === Wt;
          },
          get children() {
            var x = qd();
            return D((v) => {
              var N = C().col * 24 + 12, T = C().row * 24 + 12;
              return N !== v.e && h(x, "x", v.e = N), T !== v.t && h(x, "y", v.t = T), v;
            }, {
              e: void 0,
              t: void 0
            }), x;
          }
        }), je), g(u, d(R, {
          get when() {
            return b() === ru || b() === Dt;
          },
          get children() {
            var x = Fd();
            return D((v) => {
              var N = V().x, T = V().y;
              return N !== v.e && h(x, "x", v.e = N), T !== v.t && h(x, "y", v.t = T), v;
            }, {
              e: void 0,
              t: void 0
            }), x;
          }
        }), je), g(u, d(R, {
          get when() {
            return b() === St;
          },
          get children() {
            return d(Be, {
              class: "ninja",
              ninja: () => ({
                x: V().x,
                y: V().y,
                deg: 0
              }),
              bones: () => S() ?? ju
            });
          }
        }), je), g(u, d(R, {
          get when() {
            return oe();
          },
          get children() {
            var x = Wd();
            return D(() => h(x, "points", r().map(({ x: v, y: N }) => `${v},${N}`).join(" "))), x;
          }
        }), je), D((x) => {
          var v = n(), N = [
            eu,
            Dt,
            Yt
          ].includes(b()) ? "url(#outline)" : "", T = _(), ue = F(), ke = $e();
          return v !== x.e && h(ge, "d", x.e = v), N !== x.t && h(xe, "filter", x.t = N), T !== x.a && h(ve, "d", x.a = T), ue !== x.o && h(Xe, "d", x.o = ue), ke !== x.i && h(je, "d", x.i = ke), x;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        }), u;
      })(),
      d(Kc, {
        editor: e,
        get setReplay() {
          return t.setReplay;
        },
        render: W,
        get levelName() {
          return t.levelName;
        },
        get setLevelName() {
          return t.setLevelName;
        },
        get roundCorners() {
          return t.roundCorners;
        },
        get setRoundCorners() {
          return t.setRoundCorners;
        },
        get palette() {
          return t.palette;
        },
        get setPalette() {
          return t.setPalette;
        },
        showTrail: oe,
        setShowTrail: ie,
        get dynamicFriction() {
          return t.dynamicFriction;
        },
        get setDynamicFriction() {
          return t.setDynamicFriction;
        }
      })
    ];
  }
  wt([
    "mousemove",
    "mousedown",
    "dblclick",
    "mouseup",
    "contextmenu"
  ]);
  var Lu = w("<div id=media-controls><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb></div></div><div><a href=# download=1234 style=color:var(--main-menu-selected);margin-left:1em>Export attract");
  function Eu(t) {
    const e = () => {
      const s = t.progress(), c = t.length();
      return c === 0 || s >= c ? "100%" : `${s / c * 100}%`;
    }, r = () => {
      const s = t.progress(), c = t.previewProgress(), p = t.length();
      if (c === void 0 || p === 0) return {
        left: "0%",
        width: "0%"
      };
      const $ = Math.min(s, c), b = Math.min(Math.max(s, c), p);
      return {
        left: `${$ / p * 100}%`,
        width: `${(b - $) / p * 100}%`
      };
    };
    let n;
    document.addEventListener("mousemove", _), Ie(() => document.removeEventListener("mousemove", _)), document.addEventListener("mouseup", l), Ie(() => document.removeEventListener("mouseup", l));
    function i(s) {
      if (n) {
        const { left: c, top: p, width: $ } = n.getBoundingClientRect();
        let b = (s.clientX - c) / $;
        b = Math.min(1, b), b = Math.max(0, b);
        let B = Math.abs(s.clientY - p);
        return {
          targetFrame: Math.round(b * t.length()),
          strength: Math.pow(Math.E, -5 * B / $)
        };
      } else return {
        targetFrame: 0,
        strength: 0
      };
    }
    function _(s) {
      if (n) {
        const c = t.dragStart();
        if (c !== void 0) {
          const { targetFrame: p, strength: $ } = i(s);
          t.seek(Math.round(c + (p - c) * $)), t.previewSeek(void 0);
        } else n.matches(":hover") ? t.previewSeek(i(s).targetFrame) : t.previewSeek(void 0);
      }
    }
    function l() {
      t.setDragStart(void 0);
    }
    return (() => {
      var s = Lu(), c = s.firstChild, p = c.firstChild, $ = c.nextSibling, b = $.firstChild, B = b.nextSibling, C = B.nextSibling, G = C.nextSibling, V = $.nextSibling, X = V.firstChild;
      c.$$click = () => {
        t.isPlaying() ? t.setIsPlaying(false) : (t.progress() >= t.length() && t.seek(0), t.setIsPlaying(true));
      }, g(p, d(dr, {
        get children() {
          return [
            d(qe, {
              get when() {
                return !t.isPlaying();
              },
              children: "\u25B6"
            }),
            d(qe, {
              get when() {
                return t.isPlaying();
              },
              children: "\u23F8"
            })
          ];
        }
      })), $.$$mousedown = (L) => {
        t.setDragStart(i(L).targetFrame), _(L), L.preventDefault();
      };
      var F = n;
      return typeof F == "function" ? $n(F, $) : n = $, X.$$click = function() {
        const L = t.attract(), M = new Blob([
          L.buffer
        ], {
          type: "application/octet-stream"
        }), K = URL.createObjectURL(M);
        this.href = K, setTimeout(() => URL.revokeObjectURL(K), 100);
      }, D((L) => {
        var M = e(), K = r().left, H = r().width, se = e();
        return M !== L.e && st(B, "width", L.e = M), K !== L.t && st(C, "left", L.t = K), H !== L.a && st(C, "width", L.a = H), se !== L.o && st(G, "left", L.o = se), L;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), s;
    })();
  }
  wt([
    "click",
    "mousedown"
  ]);
  var Nu = w("<svg><circle r=1.5 fill=var(--background)></svg>", false, true, false), Au = w('<svg><path d="M -3 1 L 0 -3 L 3 1 L 0 -1 Z"fill=none stroke-width=3 stroke-linecap=round stroke-linejoin=round></svg>', false, true, false), Cu = w("<svg><g></svg>", false, true, false);
  function Mu(t) {
    return [
      d(U, {
        get each() {
          return t.inputs();
        },
        children: (e, r) => (() => {
          var n = Cu();
          return g(n, d(R, {
            get when() {
              return !(e() > 0);
            },
            get children() {
              var i = Nu();
              return D(() => h(i, "opacity", Number.isNaN(e()) ? 0.3 : 1)), i;
            }
          }), null), g(n, d(R, {
            get when() {
              return e() > 0;
            },
            get children() {
              var i = Au();
              return D(() => h(i, "stroke", `oklch(60% 80% ${Iu(e())}deg)`)), i;
            }
          }), null), D(() => h(n, "transform", `translate(${36 + 24 * r},${24 * 24.5}) rotate(${Bu(e())},0,0)`)), n;
        })()
      }),
      d(U, {
        get each() {
          return t.pastNinjas();
        },
        children: (e, r) => d(R, {
          get when() {
            return e().length;
          },
          get children() {
            return d(Be, {
              class: r === 20 ? "central-ninja" : "ninja",
              ninja: () => ({
                x: 48 + 24 * r,
                y: 24 * 24.5,
                deg: 0
              }),
              bones: e
            });
          }
        })
      })
    ];
  }
  function Bu(t) {
    switch (t) {
      case 1:
        return 0;
      case 2:
        return 90;
      case 3:
        return 45;
      case 4:
      case 6:
        return -90;
      case 5:
      case 7:
        return -45;
      default:
        return 180;
    }
  }
  function Iu(t) {
    switch (t) {
      case 1:
        return 140;
      case 2:
        return 270;
      case 3:
        return 200;
      case 4:
      case 6:
        return 0;
      case 5:
      case 7:
        return 100;
      default:
        return 180;
    }
  }
  var Ou = w("<span style=position:absolute>"), Ru = w("<span style=position:absolute;top:1.5em;white-space:pre;font-family:monospace>"), Ku = w("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), Gu = w("<svg><use href=#crosshair></svg>", false, true, false), Hu = w("<svg><text>x </svg>", false, true, false), zu = w("<svg><text>y </svg>", false, true, false), Vu = w("<svg><text></svg>", false, true, false), Uu = w('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), qu = w("<div>");
  function Fu(t) {
    const e = t.replay, [r, n] = f(true), [i, _] = f(!e.is_from_attract()), [l, s] = f(), [c, p] = f(0), [$, b] = f(0), [B, C] = f(), [G, V] = f(5400), X = (m) => {
      if (m.code === "Enter") e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), i() || Ce(1);
      else if (m.code === "Escape") i() ? (_(false), n(false), C(void 0), F(), t.editor.set_start_replay_paused(true)) : (_(true), n(true), t.editor.set_start_replay_paused(false));
      else if (m.code === "Comma") {
        if (!i() && $() > 0) {
          b($() - 1), e.seek($());
          let { isJump1Pressed: j, isJump2Pressed: Q, isRightPressed: z, isLeftPressed: I, isDownPressed: O, isSuicidePressed: A } = t.globalEventState;
          j() || Q() || z() || I() || A() ? e.set_input(j() || Q(), z(), I(), A()) : O() && e.set_input(false, false, false, false), F(), Ce(1);
        }
      } else if (m.code === "Period" && !i()) {
        let { isJump1Pressed: j, isJump2Pressed: Q, isRightPressed: z, isLeftPressed: I, isDownPressed: O, isSuicidePressed: A } = t.globalEventState;
        j() || Q() || z() || I() || A() ? e.set_input(j() || Q(), z(), I(), A()) : (O() || e.inputs_len() === e.progress()) && e.set_input(false, false, false, false), e.tick(), b(e.progress()), F(), Ce(1);
      }
    };
    function F() {
      e.seek_preview(e.progress() + 120), C(e.progress_preview()), tt(), bt(), et(), N(e.ninja_info());
    }
    document.addEventListener("keydown", X), Ie(() => {
      document.removeEventListener("keydown", X);
    });
    const L = () => e.tiles_path(), [M, K] = f({
      x: -50,
      y: -50,
      deg: 0
    }), [H, se] = f({
      x: -50,
      y: -50,
      deg: 0
    }), [_e, ce] = f({
      x: -50,
      y: -50,
      deg: 0
    }), [pe, de] = f(), [oe, ie] = f(), [S, k] = f(), E = f([]), q = f([]), $e = f([]), P = f([]), re = f([]), W = f([]), ye = f([]), he = f([]), me = f([]), we = f([]), Ee = f([]), Ne = f([]), u = f([]), y = f([]), Re = f([]), Y = f([]), ge = f([]), xe = f([]), ve = f([]), Ae = f([]), Xe = f([]), je = f([]), x = f([]);
    Kd(x, e);
    const [v, N] = f(""), [T, ue] = f(), [ke, Qe] = f([]);
    function et() {
      const m = [], j = e.past_ninjas_len();
      for (let Q = 0; Q < j; Q++) m.push({
        x: e.past_ninja_x(Q),
        y: e.past_ninja_y(Q)
      });
      Qe(m);
    }
    et();
    const [on, _n] = f([]);
    function tt() {
      const m = [];
      for (let j = -21; j < 21; j++) {
        const Q = j + e.progress();
        Q < 0 || Q >= e.inputs_len() ? m.push(NaN) : m.push(e.input(Q));
      }
      _n(m);
    }
    tt();
    const [ln, an] = f([]);
    function bt() {
      const m = [];
      for (let j = -20; j <= 20; j++) {
        const Q = j + e.progress();
        m.push(e.past_ninja_bones(Q));
      }
      an(m);
    }
    bt();
    let Nt = performance.now();
    const mt = 1e3 / 60;
    let rt = 0, At = 0;
    function Ct() {
      const m = performance.now(), j = Math.min(m - Nt, 250);
      Nt = m;
      let Q = 1;
      const z = e;
      if (i() && l() === void 0) {
        if (r() || $() < c()) {
          for (rt += j; rt >= mt; ) {
            if (r()) {
              let { isJump1Pressed: I, isJump2Pressed: O, isRightPressed: A, isLeftPressed: Z, isSuicidePressed: ne } = t.globalEventState;
              z.set_input(I() || O(), A(), Z(), ne());
            }
            z.tick(), tt(), rt -= mt;
          }
          Q = rt / mt, b(z.progress());
        } else $() < c() ? (z.tick(), b(z.progress())) : _(false);
        Ce(Q);
      }
      At = requestAnimationFrame(Ct);
    }
    Ct(), Ie(() => {
      cancelAnimationFrame(At);
    });
    function Ce(m) {
      V(e.score()), K({
        x: e.ninja_x(m),
        y: e.ninja_y(m),
        deg: 0
      }), se({
        x: e.ninja_preview_x(m),
        y: e.ninja_preview_y(m),
        deg: 0
      }), ce({
        x: e.portal_ninja_x(m),
        y: e.portal_ninja_y(m),
        deg: 0
      }), de(e.ninja_bones(m)), B() === void 0 ? ie(void 0) : ie(e.ninja_preview_bones(m)), k(e.portal_ninja_bones()), ca(E, e), vd(q, e), ac($e, e, m), ta(P, e), hc(re, e, m), bc(W, e, m), Xa(ye, e), nc(he, e, m), Da(me, e, m), Ca(we, e), Ra(Ee, e, m), Wa(Ne, e), fa(u, e, m), kc(y, e, m), zl(Re, e, m), Zl(Y, e, m), Yc(ge, e, m), yd(xe, e, m), rd(ve, e, m), ud(Ae, e, m), jd(Xe, e, m), Ad(je, e, m), p(e.replay_length());
    }
    return Ce(1), [
      (() => {
        var m = Ou();
        return g(m, () => (G() / 60).toFixed(3)), m;
      })(),
      d(R, {
        get when() {
          return !i();
        },
        get children() {
          var m = Ru();
          return g(m, v), m;
        }
      }),
      (() => {
        var m = Uu(), j = m.firstChild, Q = j.firstChild, z = Q.nextSibling, I = j.nextSibling;
        return m.$$mousedown = function() {
          const { x: O, y: A } = t.globalEventState.mouseGamePos(), Z = Math.round(O / 6) * 6, ne = Math.round(A / 6) * 6, nt = T();
          Z === (nt == null ? void 0 : nt.x) && ne === (nt == null ? void 0 : nt.y) ? ue(void 0) : ue({
            x: Z,
            y: ne
          });
        }, m.$$mousemove = function(O) {
          const { left: A, top: Z, width: ne, height: nt } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (O.clientX - A) / ne * 1056,
            y: (O.clientY - Z) / nt * 600
          });
        }, g(j, d(br, {}), z), g(j, d(Jr, {}), z), g(j, d(Lr, {}), z), g(j, d(yr, {}), z), g(j, d($r, {}), z), g(j, d(Sr, {}), z), g(j, d(Nr, {}), z), g(j, d(Cr, {}), z), g(j, d(Ur, {}), z), g(j, d(Fr, {}), z), g(j, d(zr, {}), z), g(j, d(Zr, {}), z), g(j, d(Qr, {}), z), g(j, d(Ul, {}), z), g(j, d(rn, {}), z), g(j, d(sn, {}), z), g(m, d(nn, {
          get portals() {
            return x[0];
          },
          showMode: false
        }), I), g(m, d(kr, {
          get trapDoors() {
            return Ee[0];
          }
        }), I), g(m, d(xr, {
          get lockedDoors() {
            return me[0];
          }
        }), I), g(m, d(vr, {
          get lockedSwitches() {
            return we[0];
          }
        }), I), g(m, d(Dr, {
          get trapSwitches() {
            return Ne[0];
          }
        }), I), g(m, d(hr, {
          get exitDoors() {
            return Re[0];
          }
        }), I), g(m, d(fr, {
          get oneWays() {
            return P[0];
          }
        }), I), g(m, d(wr, {
          get mines() {
            return E[0];
          }
        }), I), g(m, d(Yr, {
          get golds() {
            return q[0];
          }
        }), I), g(m, d(gr, {
          get exitSwitches() {
            return Y[0];
          }
        }), I), g(m, d(mr, {
          get regularDoors() {
            return u[0];
          }
        }), I), g(m, d(jr, {
          get launchPads() {
            return ye[0];
          }
        }), I), g(m, d(qr, {
          get laserDrones() {
            return Ae[0];
          }
        }), I), g(m, d(Vr, {
          get chaingunDrones() {
            return ve[0];
          }
        }), I), g(m, d(Hr, {
          get zapDrones() {
            return ge[0];
          }
        }), I), g(m, d(Wr, {
          get chaseDrones() {
            return xe[0];
          }
        }), I), g(m, d(Pr, {
          get floorGuards() {
            return he[0];
          }
        }), I), g(m, d(Xr, {
          get deathballs() {
            return Xe[0];
          }
        }), I), g(m, d(Ar, {
          get thwumps() {
            return W[0];
          }
        }), I), g(m, d(tn, {
          get evilNinjas() {
            return je[0];
          }
        }), I), g(m, d(Be, {
          class: "ninja preview",
          ninja: H,
          bones: oe
        }), I), g(m, d(Tr, {
          get bounceBlocks() {
            return $e[0];
          }
        }), I), g(m, d(Mr, {
          get shoveThwumps() {
            return y[0];
          }
        }), I), g(m, d(Er, {
          get boostPads() {
            return re[0];
          }
        }), I), g(m, d(R, {
          get when() {
            return Number.isFinite(_e().x);
          },
          get children() {
            return d(Be, {
              class: "ninja",
              ninja: _e,
              bones: S
            });
          }
        }), I), g(m, d(Be, {
          class: "ninja",
          ninja: M,
          bones: pe
        }), I), g(m, d(R, {
          get when() {
            return !i();
          },
          get children() {
            return [
              (() => {
                var O = Ku();
                return D(() => h(O, "points", ke().slice($(), B() || 0).map(({ x: A, y: Z }) => `${A},${Z}`).join(" "))), O;
              })(),
              d(Mu, {
                inputs: on,
                pastNinjas: ln
              }),
              d(R, {
                get when() {
                  return T();
                },
                get children() {
                  return [
                    (() => {
                      var O = Gu();
                      return D((A) => {
                        var Z = T().x, ne = T().y;
                        return Z !== A.e && h(O, "x", A.e = Z), ne !== A.t && h(O, "y", A.t = ne), A;
                      }, {
                        e: void 0,
                        t: void 0
                      }), O;
                    })(),
                    (() => {
                      var O = Hu();
                      return O.firstChild, g(O, () => T().x - M().x, null), D((A) => {
                        var Z = T().x, ne = T().y;
                        return Z !== A.e && h(O, "x", A.e = Z), ne !== A.t && h(O, "y", A.t = ne), A;
                      }, {
                        e: void 0,
                        t: void 0
                      }), O;
                    })(),
                    (() => {
                      var O = zu();
                      return O.firstChild, g(O, () => T().y - M().y, null), D((A) => {
                        var Z = T().x, ne = T().y + 20;
                        return Z !== A.e && h(O, "x", A.e = Z), ne !== A.t && h(O, "y", A.t = ne), A;
                      }, {
                        e: void 0,
                        t: void 0
                      }), O;
                    })(),
                    (() => {
                      var O = Vu();
                      return g(O, () => {
                        let A = T().x - M().x, Z = T().y - M().y;
                        return Math.sqrt(A * A + Z * Z);
                      }), D((A) => {
                        var Z = T().x, ne = T().y + 40;
                        return Z !== A.e && h(O, "x", A.e = Z), ne !== A.t && h(O, "y", A.t = ne), A;
                      }, {
                        e: void 0,
                        t: void 0
                      }), O;
                    })()
                  ];
                }
              })
            ];
          }
        }), null), D(() => h(I, "d", L())), m;
      })(),
      (() => {
        var m = qu();
        return g(m, d(R, {
          get when() {
            return !r() || !i();
          },
          get children() {
            return d(Eu, {
              isPlaying: i,
              setIsPlaying: _,
              dragStart: l,
              setDragStart: s,
              length: c,
              progress: $,
              previewProgress: B,
              seek: (j) => {
                b(j), e.seek(j), tt(), bt(), et(), Ce(1);
              },
              previewSeek: (j) => {
                C(j), et(), e && (j !== void 0 && l() === void 0 && e.seek_preview(j), Ce(1));
              },
              attract: () => e.export_attract(t.editor)
            });
          }
        })), m;
      })()
    ];
  }
  wt([
    "mousemove",
    "mousedown"
  ]);
  var Wu = w("<p>Invalid file."), Zu = w("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file><dl><dt>Windows</dt><dd>C:\\Program Files (x86)\\Steam\\steamapps\\common\\N++\\anim_data_line_new.txt.bin</dd><dt>Linux</dt><dd>~/.steam/steam/steamapps/common/N++/anim_data_line_new.txt.bin</dd><dt>Mac</dt><dd>~/Library/Application Support/Steam/steamapps/common/N++/N++.app/Contents/Resources/NPP/anim_data_line_new.txt.bin");
  function Yu() {
    const t = Oe.new(), [e, r] = f(), [n, i] = f(""), [_, l] = f(false), [s, c] = f(false), [p, $] = f([]);
    function b() {
      const P = [], re = t.past_ninjas_len();
      for (let W = 0; W < re; W++) P.push({
        x: t.past_ninja_x(W),
        y: t.past_ninja_y(W)
      });
      $(P);
    }
    const [B, C] = f(false), [G, V] = f(false), [X, F] = f(false), [L, M] = f(false), [K, H] = f(false), [se, _e] = f(false), [ce, pe] = f({
      x: 36,
      y: 36
    }), de = {
      isJump1Pressed: B,
      isJump2Pressed: G,
      isRightPressed: X,
      isLeftPressed: L,
      isSuicidePressed: K,
      isDownPressed: se,
      mouseGamePos: ce,
      setMouseGamePos: pe
    };
    Sc(t), i(t.get_level_name()), document.addEventListener("keydown", (P) => {
      if (!(P.ctrlKey || P.metaKey)) if (P.code === "Tab") {
        const re = e();
        re ? (r(void 0), re.send_past_ninjas(), t.receive_past_ninjas(), re.free(), b()) : r(t.to_replay(_(), s())), P.preventDefault();
      } else P.code === "KeyZ" ? C(true) : P.code === "ArrowUp" ? V(true) : P.code === "ArrowRight" ? F(true) : P.code === "ArrowLeft" ? M(true) : P.code === "ArrowDown" ? _e(true) : P.code === "KeyV" && H(true);
    }), document.addEventListener("keyup", (P) => {
      P.code === "KeyZ" ? C(false) : P.code === "ArrowUp" ? V(false) : P.code === "ArrowRight" ? F(false) : P.code === "ArrowLeft" ? M(false) : P.code === "ArrowDown" ? _e(false) : P.code === "KeyV" && H(false);
    }), document.addEventListener("blur", () => {
      C(false), V(false), F(false), M(false), H(false), _e(false);
    }), Pc(t);
    const oe = 0, ie = 1, S = 2, [k, E] = f(t.get_anim_state() == oe ? oe : S), [q, $e] = f(Ec());
    return pn(() => {
      const P = q();
      P && (Ic(P.colors), Tc(P));
    }), Bc().then(() => {
      const P = q();
      if (P) {
        const re = Gr(P.name);
        re && (P.colors = re), $e(P);
      }
    }), [
      d(R, {
        get when() {
          return k() != oe;
        },
        get children() {
          var P = Zu(), re = P.firstChild, W = re.nextSibling;
          return W.nextSibling, W.addEventListener("change", function() {
            const ye = this.files;
            if (ye && ye.length > 0) {
              const he = new FileReader();
              he.onloadend = () => {
                if (he.result instanceof ArrayBuffer) {
                  const me = new Uint8Array(he.result);
                  try {
                    try {
                      jc(me);
                    } catch (we) {
                      console.error(we);
                    }
                    t.set_anim_data(me), E(t.get_anim_state());
                  } catch (we) {
                    console.error(we), E(ie);
                  }
                }
              }, he.readAsArrayBuffer(ye[0]);
            }
          }), g(P, d(R, {
            get when() {
              return k() == ie;
            },
            get children() {
              return Wu();
            }
          }), null), P;
        }
      }),
      d(R, {
        get when() {
          return ze(() => k() == oe)() && !e();
        },
        get children() {
          return d(Tu, {
            editor: t,
            setReplay: r,
            pastNinjas: p,
            globalEventState: de,
            levelName: n,
            setLevelName: i,
            roundCorners: _,
            setRoundCorners: l,
            palette: q,
            setPalette: $e,
            dynamicFriction: s,
            setDynamicFriction: c
          });
        }
      }),
      d(R, {
        get when() {
          return ze(() => k() == oe)() && !!e();
        },
        keyed: true,
        get children() {
          return d(Fu, {
            get replay() {
              return e();
            },
            editor: t,
            globalEventState: de
          });
        }
      })
    ];
  }
  const Ju = document.getElementById("root");
  vn(() => d(Yu, {}), Ju);
})();
