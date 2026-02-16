(async () => {
  (function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const n of document.querySelectorAll('link[rel="modulepreload"]')) s(n);
    new MutationObserver((n) => {
      for (const i of n) if (i.type === "childList") for (const _ of i.addedNodes) _.tagName === "LINK" && _.rel === "modulepreload" && s(_);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function r(n) {
      const i = {};
      return n.integrity && (i.integrity = n.integrity), n.referrerPolicy && (i.referrerPolicy = n.referrerPolicy), n.crossOrigin === "use-credentials" ? i.credentials = "include" : n.crossOrigin === "anonymous" ? i.credentials = "omit" : i.credentials = "same-origin", i;
    }
    function s(n) {
      if (n.ep) return;
      n.ep = true;
      const i = r(n);
      fetch(n.href, i);
    }
  })();
  const wr = false, mr = (t, e) => t === e, Lt = Symbol("solid-track"), Ke = {
    equals: mr
  };
  let At = Nt;
  const he = 1, ze = 2, Ct = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var q = null;
  let Ze = null, br = null, z = null, W = null, ae = null, We = 0;
  function De(t, e) {
    const r = z, s = q, n = t.length === 0, i = e === void 0 ? s : e, _ = n ? Ct : {
      owned: null,
      cleanups: null,
      context: i ? i.context : null,
      owner: i
    }, o = n ? t : () => t(() => ne(() => Ae(_)));
    q = _, z = null;
    try {
      return Ne(o, true);
    } finally {
      z = r, q = s;
    }
  }
  function m(t, e) {
    e = e ? Object.assign({}, Ke, e) : Ke;
    const r = {
      value: t,
      observers: null,
      observerSlots: null,
      comparator: e.equals || void 0
    }, s = (n) => (typeof n == "function" && (n = n(r.value)), jt(r, n));
    return [
      Mt.bind(r),
      s
    ];
  }
  function S(t, e, r) {
    const s = it(t, e, false, he);
    je(s);
  }
  function xr(t, e, r) {
    At = Dr;
    const s = it(t, e, false, he);
    s.user = true, ae ? ae.push(s) : je(s);
  }
  function se(t, e, r) {
    r = r ? Object.assign({}, Ke, r) : Ke;
    const s = it(t, e, true, 0);
    return s.observers = null, s.observerSlots = null, s.comparator = r.equals || void 0, je(s), Mt.bind(s);
  }
  function ne(t) {
    if (z === null) return t();
    const e = z;
    z = null;
    try {
      return t();
    } finally {
      z = e;
    }
  }
  function be(t) {
    return q === null || (q.cleanups === null ? q.cleanups = [
      t
    ] : q.cleanups.push(t)), t;
  }
  function vr(t) {
    const e = se(t), r = se(() => rt(e()));
    return r.toArray = () => {
      const s = r();
      return Array.isArray(s) ? s : s != null ? [
        s
      ] : [];
    }, r;
  }
  function Mt() {
    if (this.sources && this.state) if (this.state === he) je(this);
    else {
      const t = W;
      W = null, Ne(() => He(this), false), W = t;
    }
    if (z) {
      const t = this.observers ? this.observers.length : 0;
      z.sources ? (z.sources.push(this), z.sourceSlots.push(t)) : (z.sources = [
        this
      ], z.sourceSlots = [
        t
      ]), this.observers ? (this.observers.push(z), this.observerSlots.push(z.sources.length - 1)) : (this.observers = [
        z
      ], this.observerSlots = [
        z.sources.length - 1
      ]);
    }
    return this.value;
  }
  function jt(t, e, r) {
    let s = t.value;
    return (!t.comparator || !t.comparator(s, e)) && (t.value = e, t.observers && t.observers.length && Ne(() => {
      for (let n = 0; n < t.observers.length; n += 1) {
        const i = t.observers[n], _ = Ze && Ze.running;
        _ && Ze.disposed.has(i), (_ ? !i.tState : !i.state) && (i.pure ? W.push(i) : ae.push(i), i.observers && Bt(i)), _ || (i.state = he);
      }
      if (W.length > 1e6) throw W = [], new Error();
    }, false)), e;
  }
  function je(t) {
    if (!t.fn) return;
    Ae(t);
    const e = We;
    kr(t, t.value, e);
  }
  function kr(t, e, r) {
    let s;
    const n = q, i = z;
    z = q = t;
    try {
      s = t.fn(e);
    } catch (_) {
      return t.pure && (t.state = he, t.owned && t.owned.forEach(Ae), t.owned = null), t.updatedAt = r + 1, It(_);
    } finally {
      z = i, q = n;
    }
    (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? jt(t, s) : t.value = s, t.updatedAt = r);
  }
  function it(t, e, r, s = he, n) {
    const i = {
      fn: t,
      state: s,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: e,
      owner: q,
      context: q ? q.context : null,
      pure: r
    };
    return q === null || q !== Ct && (q.owned ? q.owned.push(i) : q.owned = [
      i
    ]), i;
  }
  function Ge(t) {
    if (t.state === 0) return;
    if (t.state === ze) return He(t);
    if (t.suspense && ne(t.suspense.inFallback)) return t.suspense.effects.push(t);
    const e = [
      t
    ];
    for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < We); ) t.state && e.push(t);
    for (let r = e.length - 1; r >= 0; r--) if (t = e[r], t.state === he) je(t);
    else if (t.state === ze) {
      const s = W;
      W = null, Ne(() => He(t, e[0]), false), W = s;
    }
  }
  function Ne(t, e) {
    if (W) return t();
    let r = false;
    e || (W = []), ae ? r = true : ae = [], We++;
    try {
      const s = t();
      return $r(r), s;
    } catch (s) {
      r || (ae = null), W = null, It(s);
    }
  }
  function $r(t) {
    if (W && (Nt(W), W = null), t) return;
    const e = ae;
    ae = null, e.length && Ne(() => At(e), false);
  }
  function Nt(t) {
    for (let e = 0; e < t.length; e++) Ge(t[e]);
  }
  function Dr(t) {
    let e, r = 0;
    for (e = 0; e < t.length; e++) {
      const s = t[e];
      s.user ? t[r++] = s : Ge(s);
    }
    for (e = 0; e < r; e++) Ge(t[e]);
  }
  function He(t, e) {
    t.state = 0;
    for (let r = 0; r < t.sources.length; r += 1) {
      const s = t.sources[r];
      if (s.sources) {
        const n = s.state;
        n === he ? s !== e && (!s.updatedAt || s.updatedAt < We) && Ge(s) : n === ze && He(s, e);
      }
    }
  }
  function Bt(t) {
    for (let e = 0; e < t.observers.length; e += 1) {
      const r = t.observers[e];
      r.state || (r.state = ze, r.pure ? W.push(r) : ae.push(r), r.observers && Bt(r));
    }
  }
  function Ae(t) {
    let e;
    if (t.sources) for (; t.sources.length; ) {
      const r = t.sources.pop(), s = t.sourceSlots.pop(), n = r.observers;
      if (n && n.length) {
        const i = n.pop(), _ = r.observerSlots.pop();
        s < n.length && (i.sourceSlots[_] = s, n[s] = i, r.observerSlots[s] = _);
      }
    }
    if (t.tOwned) {
      for (e = t.tOwned.length - 1; e >= 0; e--) Ae(t.tOwned[e]);
      delete t.tOwned;
    }
    if (t.owned) {
      for (e = t.owned.length - 1; e >= 0; e--) Ae(t.owned[e]);
      t.owned = null;
    }
    if (t.cleanups) {
      for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
      t.cleanups = null;
    }
    t.state = 0;
  }
  function Sr(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function It(t, e = q) {
    throw Sr(t);
  }
  function rt(t) {
    if (typeof t == "function" && !t.length) return rt(t());
    if (Array.isArray(t)) {
      const e = [];
      for (let r = 0; r < t.length; r++) {
        const s = rt(t[r]);
        Array.isArray(s) ? e.push.apply(e, s) : e.push(s);
      }
      return e;
    }
    return t;
  }
  const st = Symbol("fallback");
  function qe(t) {
    for (let e = 0; e < t.length; e++) t[e]();
  }
  function Tr(t, e, r = {}) {
    let s = [], n = [], i = [], _ = 0, o = e.length > 1 ? [] : null;
    return be(() => qe(i)), () => {
      let c = t() || [], p = c.length, b, f;
      return c[Lt], ne(() => {
        let E, j, N, A, O, $, D, M, K;
        if (p === 0) _ !== 0 && (qe(i), i = [], s = [], n = [], _ = 0, o && (o = [])), r.fallback && (s = [
          st
        ], n[0] = De((J) => (i[0] = J, r.fallback())), _ = 1);
        else if (_ === 0) {
          for (n = new Array(p), f = 0; f < p; f++) s[f] = c[f], n[f] = De(L);
          _ = p;
        } else {
          for (N = new Array(p), A = new Array(p), o && (O = new Array(p)), $ = 0, D = Math.min(_, p); $ < D && s[$] === c[$]; $++) ;
          for (D = _ - 1, M = p - 1; D >= $ && M >= $ && s[D] === c[M]; D--, M--) N[M] = n[D], A[M] = i[D], o && (O[M] = o[D]);
          for (E = /* @__PURE__ */ new Map(), j = new Array(M + 1), f = M; f >= $; f--) K = c[f], b = E.get(K), j[f] = b === void 0 ? -1 : b, E.set(K, f);
          for (b = $; b <= D; b++) K = s[b], f = E.get(K), f !== void 0 && f !== -1 ? (N[f] = n[b], A[f] = i[b], o && (O[f] = o[b]), f = j[f], E.set(K, f)) : i[b]();
          for (f = $; f < p; f++) f in N ? (n[f] = N[f], i[f] = A[f], o && (o[f] = O[f], o[f](f))) : n[f] = De(L);
          n = n.slice(0, _ = p), s = c.slice(0);
        }
        return n;
      });
      function L(E) {
        if (i[f] = E, o) {
          const [j, N] = m(f);
          return o[f] = N, e(c[f], j);
        }
        return e(c[f]);
      }
    };
  }
  function Pr(t, e, r = {}) {
    let s = [], n = [], i = [], _ = [], o = 0, c;
    return be(() => qe(i)), () => {
      const p = t() || [], b = p.length;
      return p[Lt], ne(() => {
        if (b === 0) return o !== 0 && (qe(i), i = [], s = [], n = [], o = 0, _ = []), r.fallback && (s = [
          st
        ], n[0] = De((L) => (i[0] = L, r.fallback())), o = 1), n;
        for (s[0] === st && (i[0](), i = [], s = [], n = [], o = 0), c = 0; c < b; c++) c < s.length && s[c] !== p[c] ? _[c](() => p[c]) : c >= s.length && (n[c] = De(f));
        for (; c < s.length; c++) i[c]();
        return o = _.length = i.length = b, s = p.slice(0), n = n.slice(0, o);
      });
      function f(L) {
        i[c] = L;
        const [E, j] = m(p[c]);
        return _[c] = j, e(E, c);
      }
    };
  }
  function u(t, e) {
    return ne(() => t(e || {}));
  }
  const Ot = (t) => `Stale read from <${t}>.`;
  function _t(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return se(Tr(() => t.each, t.children, e || void 0));
  }
  function U(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return se(Pr(() => t.each, t.children, e || void 0));
  }
  function G(t) {
    const e = t.keyed, r = se(() => t.when, void 0, void 0), s = e ? r : se(r, void 0, {
      equals: (n, i) => !n == !i
    });
    return se(() => {
      const n = s();
      if (n) {
        const i = t.children;
        return typeof i == "function" && i.length > 0 ? ne(() => i(e ? n : () => {
          if (!ne(s)) throw Ot("Show");
          return r();
        })) : i;
      }
      return t.fallback;
    }, void 0, void 0);
  }
  function Er(t) {
    const e = vr(() => t.children), r = se(() => {
      const s = e(), n = Array.isArray(s) ? s : [
        s
      ];
      let i = () => {
      };
      for (let _ = 0; _ < n.length; _++) {
        const o = _, c = n[_], p = i, b = se(() => p() ? void 0 : c.when, void 0, void 0), f = c.keyed ? b : se(b, void 0, {
          equals: (L, E) => !L == !E
        });
        i = () => p() || (f() ? [
          o,
          b,
          c
        ] : void 0);
      }
      return i;
    });
    return se(() => {
      const s = r()();
      if (!s) return t.fallback;
      const [n, i, _] = s, o = _.children;
      return typeof o == "function" && o.length > 0 ? ne(() => o(_.keyed ? i() : () => {
        var _a2;
        if (((_a2 = ne(r)()) == null ? void 0 : _a2[0]) !== n) throw Ot("Match");
        return i();
      })) : o;
    }, void 0, void 0);
  }
  function at(t) {
    return t;
  }
  const $e = (t) => se(() => t());
  function Lr(t, e, r) {
    let s = r.length, n = e.length, i = s, _ = 0, o = 0, c = e[n - 1].nextSibling, p = null;
    for (; _ < n || o < i; ) {
      if (e[_] === r[o]) {
        _++, o++;
        continue;
      }
      for (; e[n - 1] === r[i - 1]; ) n--, i--;
      if (n === _) {
        const b = i < s ? o ? r[o - 1].nextSibling : r[i - o] : c;
        for (; o < i; ) t.insertBefore(r[o++], b);
      } else if (i === o) for (; _ < n; ) (!p || !p.has(e[_])) && e[_].remove(), _++;
      else if (e[_] === r[i - 1] && r[o] === e[n - 1]) {
        const b = e[--n].nextSibling;
        t.insertBefore(r[o++], e[_++].nextSibling), t.insertBefore(r[--i], b), e[n] = r[i];
      } else {
        if (!p) {
          p = /* @__PURE__ */ new Map();
          let f = o;
          for (; f < i; ) p.set(r[f], f++);
        }
        const b = p.get(e[_]);
        if (b != null) if (o < b && b < i) {
          let f = _, L = 1, E;
          for (; ++f < n && f < i && !((E = p.get(e[f])) == null || E !== b + L); ) L++;
          if (L > b - o) {
            const j = e[_];
            for (; o < b; ) t.insertBefore(r[o++], j);
          } else t.replaceChild(r[o++], e[_++]);
        } else _++;
        else e[_++].remove();
      }
    }
  }
  const ct = "_$DX_DELEGATE";
  function Ar(t, e, r, s = {}) {
    let n;
    return De((i) => {
      n = i, e === document ? t() : x(e, t(), e.firstChild ? null : void 0, r);
    }, s.owner), () => {
      n(), e.textContent = "";
    };
  }
  function v(t, e, r, s) {
    let n;
    const i = () => {
      const o = s ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
      return o.innerHTML = t, r ? o.content.firstChild.firstChild : s ? o.firstChild : o.content.firstChild;
    }, _ = e ? () => ne(() => document.importNode(n || (n = i()), true)) : () => (n || (n = i())).cloneNode(true);
    return _.cloneNode = _, _;
  }
  function Fe(t, e = window.document) {
    const r = e[ct] || (e[ct] = /* @__PURE__ */ new Set());
    for (let s = 0, n = t.length; s < n; s++) {
      const i = t[s];
      r.has(i) || (r.add(i), e.addEventListener(i, Mr));
    }
  }
  function w(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function Be(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function Cr(t, e, r) {
    return ne(() => t(e, r));
  }
  function x(t, e, r, s) {
    if (r !== void 0 && !s && (s = []), typeof e != "function") return Ue(t, e, s, r);
    S((n) => Ue(t, e(), n, r), s);
  }
  function Mr(t) {
    let e = t.target;
    const r = `$$${t.type}`, s = t.target, n = t.currentTarget, i = (c) => Object.defineProperty(t, "target", {
      configurable: true,
      value: c
    }), _ = () => {
      const c = e[r];
      if (c && !e.disabled) {
        const p = e[`${r}Data`];
        if (p !== void 0 ? c.call(e, p, t) : c.call(e, t), t.cancelBubble) return;
      }
      return e.host && typeof e.host != "string" && !e.host._$host && e.contains(t.target) && i(e.host), true;
    }, o = () => {
      for (; _() && (e = e._$host || e.parentNode || e.host); ) ;
    };
    if (Object.defineProperty(t, "currentTarget", {
      configurable: true,
      get() {
        return e || document;
      }
    }), t.composedPath) {
      const c = t.composedPath();
      i(c[0]);
      for (let p = 0; p < c.length - 2 && (e = c[p], !!_()); p++) {
        if (e._$host) {
          e = e._$host, o();
          break;
        }
        if (e.parentNode === n) break;
      }
    } else o();
    i(s);
  }
  function Ue(t, e, r, s, n) {
    for (; typeof r == "function"; ) r = r();
    if (e === r) return r;
    const i = typeof e, _ = s !== void 0;
    if (t = _ && r[0] && r[0].parentNode || t, i === "string" || i === "number") {
      if (i === "number" && (e = e.toString(), e === r)) return r;
      if (_) {
        let o = r[0];
        o && o.nodeType === 3 ? o.data !== e && (o.data = e) : o = document.createTextNode(e), r = ve(t, r, s, o);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || i === "boolean") r = ve(t, r, s);
    else {
      if (i === "function") return S(() => {
        let o = e();
        for (; typeof o == "function"; ) o = o();
        r = Ue(t, o, r, s);
      }), () => r;
      if (Array.isArray(e)) {
        const o = [], c = r && Array.isArray(r);
        if (ot(o, e, r, n)) return S(() => r = Ue(t, o, r, s, true)), () => r;
        if (o.length === 0) {
          if (r = ve(t, r, s), _) return r;
        } else c ? r.length === 0 ? dt(t, o, s) : Lr(t, r, o) : (r && ve(t), dt(t, o));
        r = o;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (_) return r = ve(t, r, s, e);
          ve(t, r, null, e);
        } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
        r = e;
      }
    }
    return r;
  }
  function ot(t, e, r, s) {
    let n = false;
    for (let i = 0, _ = e.length; i < _; i++) {
      let o = e[i], c = r && r[t.length], p;
      if (!(o == null || o === true || o === false)) if ((p = typeof o) == "object" && o.nodeType) t.push(o);
      else if (Array.isArray(o)) n = ot(t, o, c) || n;
      else if (p === "function") if (s) {
        for (; typeof o == "function"; ) o = o();
        n = ot(t, Array.isArray(o) ? o : [
          o
        ], Array.isArray(c) ? c : [
          c
        ]) || n;
      } else t.push(o), n = true;
      else {
        const b = String(o);
        c && c.nodeType === 3 && c.data === b ? t.push(c) : t.push(document.createTextNode(b));
      }
    }
    return n;
  }
  function dt(t, e, r = null) {
    for (let s = 0, n = e.length; s < n; s++) t.insertBefore(e[s], r);
  }
  function ve(t, e, r, s) {
    if (r === void 0) return t.textContent = "";
    const n = s || document.createTextNode("");
    if (e.length) {
      let i = false;
      for (let _ = e.length - 1; _ >= 0; _--) {
        const o = e[_];
        if (n !== o) {
          const c = o.parentNode === t;
          !i && !_ ? c ? t.replaceChild(n, o) : t.insertBefore(n, r) : c && o.remove();
        } else i = true;
      }
    } else t.insertBefore(n, r);
    return [
      n
    ];
  }
  const jr = "" + new URL("ntools_rs_bg-DgXc6Vix.wasm", import.meta.url).href, Nr = async (t = {}, e) => {
    let r;
    if (e.startsWith("data:")) {
      const s = e.replace(/^data:.*?base64,/, "");
      let n;
      if (typeof Buffer == "function" && typeof Buffer.from == "function") n = Buffer.from(s, "base64");
      else if (typeof atob == "function") {
        const i = atob(s);
        n = new Uint8Array(i.length);
        for (let _ = 0; _ < i.length; _++) n[_] = i.charCodeAt(_);
      } else throw new Error("Cannot decode base64-encoded data URL");
      r = await WebAssembly.instantiate(n, t);
    } else {
      const s = await fetch(e), n = s.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && n.startsWith("application/wasm")) r = await WebAssembly.instantiateStreaming(s, t);
      else {
        const i = await s.arrayBuffer();
        r = await WebAssembly.instantiate(i, t);
      }
    }
    return r.instance.exports;
  };
  let l;
  function Br(t) {
    l = t;
  }
  let Ie = null;
  function Se() {
    return (Ie === null || Ie.byteLength === 0) && (Ie = new Uint8Array(l.memory.buffer)), Ie;
  }
  let Re = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  Re.decode();
  const Ir = 2146435072;
  let Ye = 0;
  function Or(t, e) {
    return Ye += e, Ye >= Ir && (Re = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), Re.decode(), Ye = e), Re.decode(Se().subarray(t, t + e));
  }
  function we(t, e) {
    return t = t >>> 0, Or(t, e);
  }
  function Rr(t, e) {
    return t = t >>> 0, Se().subarray(t / 1, t / 1 + e);
  }
  let me = 0;
  function Xe(t, e) {
    const r = e(t.length * 1, 1) >>> 0;
    return Se().set(t, r / 1), me = t.length, r;
  }
  function Je(t) {
    const e = l.__wbindgen_externrefs.get(t);
    return l.__externref_table_dealloc(t), e;
  }
  const Le = new TextEncoder();
  "encodeInto" in Le || (Le.encodeInto = function(t, e) {
    const r = Le.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function Kr(t, e, r) {
    if (r === void 0) {
      const o = Le.encode(t), c = e(o.length, 1) >>> 0;
      return Se().subarray(c, c + o.length).set(o), me = o.length, c;
    }
    let s = t.length, n = e(s, 1) >>> 0;
    const i = Se();
    let _ = 0;
    for (; _ < s; _++) {
      const o = t.charCodeAt(_);
      if (o > 127) break;
      i[n + _] = o;
    }
    if (_ !== s) {
      _ !== 0 && (t = t.slice(_)), n = r(n, s, s = _ + t.length * 3, 1) >>> 0;
      const o = Se().subarray(n + _, n + s), c = Le.encodeInto(t, o);
      _ += c.written, n = r(n, s, _, 1) >>> 0;
    }
    return me = _, n;
  }
  let Oe = null;
  function zr() {
    return (Oe === null || Oe.byteLength === 0) && (Oe = new Float64Array(l.memory.buffer)), Oe;
  }
  function nt(t, e) {
    return t = t >>> 0, zr().subarray(t / 8, t / 8 + e);
  }
  let ke = null;
  function Gr() {
    return (ke === null || ke.buffer.detached === true || ke.buffer.detached === void 0 && ke.buffer !== l.memory.buffer) && (ke = new DataView(l.memory.buffer)), ke;
  }
  function ut(t, e) {
    t = t >>> 0;
    const r = Gr(), s = [];
    for (let n = t; n < t + 4 * e; n += 4) s.push(l.__wbindgen_externrefs.get(r.getUint32(n, true)));
    return l.__externref_drop_slice(t, e), s;
  }
  const pt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_editor_free(t >>> 0, 1));
  class Te {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Te.prototype);
      return r.__wbg_ptr = e, pt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, pt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      l.__wbg_editor_free(e, 0);
    }
    export_map() {
      const e = l.editor_export_map(this.__wbg_ptr);
      var r = Rr(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 1, 1), r;
    }
    press_dash() {
      l.editor_press_dash(this.__wbg_ptr);
    }
    press_down(e) {
      l.editor_press_down(this.__wbg_ptr, e);
    }
    press_left(e) {
      l.editor_press_left(this.__wbg_ptr, e);
    }
    tiles_path() {
      let e, r;
      try {
        const s = l.editor_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], we(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    crosshair_x() {
      return l.editor_crosshair_x(this.__wbg_ptr);
    }
    crosshair_y() {
      return l.editor_crosshair_y(this.__wbg_ptr);
    }
    cursor_down(e) {
      l.editor_cursor_down(this.__wbg_ptr, e);
    }
    press_comma() {
      l.editor_press_comma(this.__wbg_ptr);
    }
    press_enter() {
      l.editor_press_enter(this.__wbg_ptr);
    }
    press_num_0() {
      l.editor_press_num_0(this.__wbg_ptr);
    }
    press_num_1() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_num_2() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_num_3() {
      l.editor_press_num_3(this.__wbg_ptr);
    }
    press_num_4() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_num_5() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_num_7() {
      l.editor_press_num_7(this.__wbg_ptr);
    }
    press_right(e) {
      l.editor_press_right(this.__wbg_ptr, e);
    }
    press_shift() {
      l.editor_press_shift(this.__wbg_ptr);
    }
    press_slash() {
      l.editor_press_slash(this.__wbg_ptr);
    }
    press_space() {
      l.editor_press_space(this.__wbg_ptr);
    }
    double_click(e) {
      l.editor_double_click(this.__wbg_ptr, e);
    }
    load_attract(e) {
      const r = Xe(e, l.__wbindgen_malloc), s = me, n = l.editor_load_attract(this.__wbg_ptr, r, s);
      if (n[1]) throw Je(n[0]);
    }
    past_ninja_x(e) {
      return l.editor_past_ninja_x(this.__wbg_ptr, e);
    }
    past_ninja_y(e) {
      return l.editor_past_ninja_y(this.__wbg_ptr, e);
    }
    press_equals() {
      l.editor_press_equals(this.__wbg_ptr);
    }
    press_escape() {
      return l.editor_press_escape(this.__wbg_ptr) !== 0;
    }
    release_shift() {
      l.editor_release_shift(this.__wbg_ptr);
    }
    release_space() {
      l.editor_release_space(this.__wbg_ptr);
    }
    set_anim_data(e) {
      const r = Xe(e, l.__wbindgen_malloc), s = me;
      l.editor_set_anim_data(this.__wbg_ptr, r, s);
    }
    get_anim_state() {
      return l.editor_get_anim_state(this.__wbg_ptr) >>> 0;
    }
    get_level_name() {
      let e, r;
      try {
        const s = l.editor_get_level_name(this.__wbg_ptr);
        return e = s[0], r = s[1], we(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    get_show_trail() {
      return l.editor_get_show_trail(this.__wbg_ptr) !== 0;
    }
    press_alt_left(e) {
      l.editor_press_alt_left(this.__wbg_ptr, e);
    }
    press_backtick() {
      l.editor_press_backtick(this.__wbg_ptr);
    }
    set_cursor_pos(e, r, s) {
      return l.editor_set_cursor_pos(this.__wbg_ptr, e, r, s) !== 0;
    }
    set_level_name(e) {
      const r = Kr(e, l.__wbindgen_malloc, l.__wbindgen_realloc), s = me;
      l.editor_set_level_name(this.__wbg_ptr, r, s);
    }
    set_show_trail(e) {
      l.editor_set_show_trail(this.__wbg_ptr, e);
    }
    show_half_grid() {
      return l.editor_show_half_grid(this.__wbg_ptr) !== 0;
    }
    past_ninjas_len() {
      return l.editor_past_ninjas_len(this.__wbg_ptr) >>> 0;
    }
    palette_center_x() {
      return l.editor_palette_center_x(this.__wbg_ptr);
    }
    palette_center_y() {
      return l.editor_palette_center_y(this.__wbg_ptr);
    }
    past_ninja_bones() {
      const e = l.editor_past_ninja_bones(this.__wbg_ptr);
      var r = nt(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 8, 8), r;
    }
    preview_entities() {
      const e = l.editor_preview_entities(this.__wbg_ptr);
      var r = ut(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    release_alt_left() {
      l.editor_release_alt_left(this.__wbg_ptr);
    }
    show_quarter_grid() {
      return l.editor_show_quarter_grid(this.__wbg_ptr) !== 0;
    }
    press_bracket_left() {
      l.editor_press_bracket_left(this.__wbg_ptr);
    }
    tile_crosshair_col() {
      return l.editor_tile_crosshair_col(this.__wbg_ptr);
    }
    tile_crosshair_row() {
      return l.editor_tile_crosshair_row(this.__wbg_ptr);
    }
    palette_selection_x() {
      return l.editor_palette_selection_x(this.__wbg_ptr);
    }
    palette_selection_y() {
      return l.editor_palette_selection_y(this.__wbg_ptr);
    }
    press_bracket_right() {
      l.editor_press_bracket_right(this.__wbg_ptr);
    }
    receive_past_ninjas() {
      l.editor_receive_past_ninjas(this.__wbg_ptr);
    }
    selected_tiles_path() {
      let e, r;
      try {
        const s = l.editor_selected_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], we(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    selected_tile_outline_path() {
      let e, r;
      try {
        const s = l.editor_selected_tile_outline_path(this.__wbg_ptr);
        return e = s[0], r = s[1], we(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    static new() {
      const e = l.editor_new();
      return Te.__wrap(e);
    }
    mode() {
      return l.editor_mode(this.__wbg_ptr) >>> 0;
    }
    redo() {
      l.editor_redo(this.__wbg_ptr);
    }
    undo() {
      l.editor_undo(this.__wbg_ptr);
    }
    press_0() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_1(e) {
      l.editor_press_1(this.__wbg_ptr, e);
    }
    press_2(e) {
      l.editor_press_2(this.__wbg_ptr, e);
    }
    press_3(e) {
      l.editor_press_3(this.__wbg_ptr, e);
    }
    press_4(e) {
      l.editor_press_4(this.__wbg_ptr, e);
    }
    press_5(e) {
      l.editor_press_5(this.__wbg_ptr, e);
    }
    press_6(e) {
      l.editor_press_6(this.__wbg_ptr, e);
    }
    press_7(e) {
      l.editor_press_7(this.__wbg_ptr, e);
    }
    press_8(e) {
      l.editor_press_8(this.__wbg_ptr, e);
    }
    press_9() {
      l.editor_press_9(this.__wbg_ptr);
    }
    press_a(e) {
      l.editor_press_a(this.__wbg_ptr, e);
    }
    press_c() {
      l.editor_press_c(this.__wbg_ptr);
    }
    press_d() {
      l.editor_press_d(this.__wbg_ptr);
    }
    press_e() {
      l.editor_press_e(this.__wbg_ptr);
    }
    press_f() {
      l.editor_press_f(this.__wbg_ptr);
    }
    press_h() {
      l.editor_press_h(this.__wbg_ptr);
    }
    press_i() {
      l.editor_press_i(this.__wbg_ptr);
    }
    press_j() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_k() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_l() {
      l.editor_press_l(this.__wbg_ptr);
    }
    press_m() {
      l.editor_press_m(this.__wbg_ptr);
    }
    press_n() {
      l.editor_press_n(this.__wbg_ptr);
    }
    press_o() {
      l.editor_press_o(this.__wbg_ptr);
    }
    press_p() {
      l.editor_press_p(this.__wbg_ptr);
    }
    press_q(e) {
      l.editor_press_q(this.__wbg_ptr, e);
    }
    press_r() {
      l.editor_press_r(this.__wbg_ptr);
    }
    press_s(e) {
      l.editor_press_s(this.__wbg_ptr, e);
    }
    press_t() {
      l.editor_press_t(this.__wbg_ptr);
    }
    press_u() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_w(e) {
      l.editor_press_w(this.__wbg_ptr, e);
    }
    press_x() {
      l.editor_press_x(this.__wbg_ptr);
    }
    press_y() {
      l.editor_press_y(this.__wbg_ptr);
    }
    press_z() {
      l.editor_press_z(this.__wbg_ptr);
    }
    entities() {
      const e = l.editor_entities(this.__wbg_ptr);
      var r = ut(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    load_map(e) {
      const r = Xe(e, l.__wbindgen_malloc), s = me, n = l.editor_load_map(this.__wbg_ptr, r, s);
      if (n[1]) throw Je(n[0]);
    }
    press_up(e) {
      l.editor_press_up(this.__wbg_ptr, e);
    }
    cursor_up() {
      l.editor_cursor_up(this.__wbg_ptr);
    }
    release_a() {
      l.editor_release_a(this.__wbg_ptr);
    }
    release_c() {
      l.editor_release_c(this.__wbg_ptr);
    }
    release_d() {
      l.editor_release_d(this.__wbg_ptr);
    }
    release_e() {
      l.editor_release_e(this.__wbg_ptr);
    }
    release_q() {
      l.editor_release_q(this.__wbg_ptr);
    }
    release_s() {
      l.editor_release_s(this.__wbg_ptr);
    }
    release_w() {
      l.editor_release_w(this.__wbg_ptr);
    }
    release_z() {
      l.editor_release_z(this.__wbg_ptr);
    }
    to_replay(e) {
      const r = l.editor_to_replay(this.__wbg_ptr, e);
      if (r[2]) throw Je(r[1]);
      return Me.__wrap(r[0]);
    }
  }
  Symbol.dispose && (Te.prototype[Symbol.dispose] = Te.prototype.free);
  const ht = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_exportedentity_free(t >>> 0, 1));
  class Ce {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Ce.prototype);
      return r.__wbg_ptr = e, ht.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, ht.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      l.__wbg_exportedentity_free(e, 0);
    }
    get type_int() {
      return l.__wbg_get_exportedentity_type_int(this.__wbg_ptr) >>> 0;
    }
    set type_int(e) {
      l.__wbg_set_exportedentity_type_int(this.__wbg_ptr, e);
    }
    get x() {
      return l.__wbg_get_exportedentity_x(this.__wbg_ptr);
    }
    set x(e) {
      l.__wbg_set_exportedentity_x(this.__wbg_ptr, e);
    }
    get y() {
      return l.__wbg_get_exportedentity_y(this.__wbg_ptr);
    }
    set y(e) {
      l.__wbg_set_exportedentity_y(this.__wbg_ptr, e);
    }
    get deg() {
      return l.__wbg_get_exportedentity_deg(this.__wbg_ptr);
    }
    set deg(e) {
      l.__wbg_set_exportedentity_deg(this.__wbg_ptr, e);
    }
    get switch_x() {
      return l.__wbg_get_exportedentity_switch_x(this.__wbg_ptr);
    }
    set switch_x(e) {
      l.__wbg_set_exportedentity_switch_x(this.__wbg_ptr, e);
    }
    get switch_y() {
      return l.__wbg_get_exportedentity_switch_y(this.__wbg_ptr);
    }
    set switch_y(e) {
      l.__wbg_set_exportedentity_switch_y(this.__wbg_ptr, e);
    }
  }
  Symbol.dispose && (Ce.prototype[Symbol.dispose] = Ce.prototype.free);
  const gt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_replay_free(t >>> 0, 1));
  class Me {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Me.prototype);
      return r.__wbg_ptr = e, gt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, gt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      l.__wbg_replay_free(e, 0);
    }
    mine_state(e) {
      return l.replay_mine_state(this.__wbg_ptr, e);
    }
    thwump_deg(e) {
      return l.replay_thwump_deg(this.__wbg_ptr, e);
    }
    tiles_path() {
      let e, r;
      try {
        const s = l.replay_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], we(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    boost_pad_x(e) {
      return l.replay_boost_pad_x(this.__wbg_ptr, e);
    }
    boost_pad_y(e) {
      return l.replay_boost_pad_y(this.__wbg_ptr, e);
    }
    exit_door_x(e) {
      return l.replay_exit_door_x(this.__wbg_ptr, e);
    }
    exit_door_y(e) {
      return l.replay_exit_door_y(this.__wbg_ptr, e);
    }
    ninja_bones(e) {
      const r = l.replay_ninja_bones(this.__wbg_ptr, e);
      var s = nt(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 8, 8), s;
    }
    one_way_deg(e) {
      return l.replay_one_way_deg(this.__wbg_ptr, e);
    }
    place_ninja(e, r) {
      l.replay_place_ninja(this.__wbg_ptr, e, r);
    }
    thwumps_len() {
      return l.replay_thwumps_len(this.__wbg_ptr) >>> 0;
    }
    trap_door_x(e) {
      return l.replay_trap_door_x(this.__wbg_ptr, e);
    }
    trap_door_y(e) {
      return l.replay_trap_door_y(this.__wbg_ptr, e);
    }
    zap_drone_x(e, r) {
      return l.replay_zap_drone_x(this.__wbg_ptr, e, r);
    }
    zap_drone_y(e, r) {
      return l.replay_zap_drone_y(this.__wbg_ptr, e, r);
    }
    launch_pad_x(e) {
      return l.replay_launch_pad_x(this.__wbg_ptr, e);
    }
    launch_pad_y(e) {
      return l.replay_launch_pad_y(this.__wbg_ptr, e);
    }
    one_ways_len() {
      return l.replay_one_ways_len(this.__wbg_ptr) >>> 0;
    }
    seek_preview(e) {
      l.replay_seek_preview(this.__wbg_ptr, e);
    }
    boost_pad_deg(e, r) {
      return l.replay_boost_pad_deg(this.__wbg_ptr, e, r);
    }
    exit_switch_x(e) {
      return l.replay_exit_switch_x(this.__wbg_ptr, e);
    }
    exit_switch_y(e) {
      return l.replay_exit_switch_y(this.__wbg_ptr, e);
    }
    floor_guard_x(e, r) {
      return l.replay_floor_guard_x(this.__wbg_ptr, e, r);
    }
    floor_guard_y(e, r) {
      return l.replay_floor_guard_y(this.__wbg_ptr, e, r);
    }
    locked_door_x(e) {
      return l.replay_locked_door_x(this.__wbg_ptr, e);
    }
    locked_door_y(e) {
      return l.replay_locked_door_y(this.__wbg_ptr, e);
    }
    replay_length() {
      return l.replay_replay_length(this.__wbg_ptr) >>> 0;
    }
    trap_door_deg(e) {
      return l.replay_trap_door_deg(this.__wbg_ptr, e);
    }
    trap_switch_x(e) {
      return l.replay_trap_switch_x(this.__wbg_ptr, e);
    }
    trap_switch_y(e) {
      return l.replay_trap_switch_y(this.__wbg_ptr, e);
    }
    zap_drone_deg(e) {
      return l.replay_zap_drone_deg(this.__wbg_ptr, e);
    }
    boost_pads_len() {
      return l.replay_boost_pads_len(this.__wbg_ptr) >>> 0;
    }
    bounce_block_x(e, r) {
      return l.replay_bounce_block_x(this.__wbg_ptr, e, r);
    }
    bounce_block_y(e, r) {
      return l.replay_bounce_block_y(this.__wbg_ptr, e, r);
    }
    exit_doors_len() {
      return l.replay_exit_doors_len(this.__wbg_ptr) >>> 0;
    }
    launch_pad_deg(e) {
      return l.replay_launch_pad_deg(this.__wbg_ptr, e);
    }
    regular_door_x(e) {
      return l.replay_regular_door_x(this.__wbg_ptr, e);
    }
    regular_door_y(e) {
      return l.replay_regular_door_y(this.__wbg_ptr, e);
    }
    shove_thwump_x(e, r) {
      return l.replay_shove_thwump_x(this.__wbg_ptr, e, r);
    }
    shove_thwump_y(e, r) {
      return l.replay_shove_thwump_y(this.__wbg_ptr, e, r);
    }
    trap_doors_len() {
      return l.replay_trap_doors_len(this.__wbg_ptr) >>> 0;
    }
    zap_drones_len() {
      return l.replay_zap_drones_len(this.__wbg_ptr) >>> 0;
    }
    floor_guard_deg(e) {
      return l.replay_floor_guard_deg(this.__wbg_ptr, e);
    }
    launch_pads_len() {
      return l.replay_launch_pads_len(this.__wbg_ptr) >>> 0;
    }
    locked_door_deg(e) {
      return l.replay_locked_door_deg(this.__wbg_ptr, e);
    }
    locked_switch_x(e) {
      return l.replay_locked_switch_x(this.__wbg_ptr, e);
    }
    locked_switch_y(e) {
      return l.replay_locked_switch_y(this.__wbg_ptr, e);
    }
    ninja_preview_x(e) {
      return l.replay_ninja_preview_x(this.__wbg_ptr, e);
    }
    ninja_preview_y(e) {
      return l.replay_ninja_preview_y(this.__wbg_ptr, e);
    }
    bounce_block_deg(e) {
      return l.replay_bounce_block_deg(this.__wbg_ptr, e);
    }
    chaingun_drone_x(e, r) {
      return l.replay_chaingun_drone_x(this.__wbg_ptr, e, r);
    }
    chaingun_drone_y(e, r) {
      return l.replay_chaingun_drone_y(this.__wbg_ptr, e, r);
    }
    floor_guards_len() {
      return l.replay_floor_guards_len(this.__wbg_ptr) >>> 0;
    }
    locked_doors_len() {
      return l.replay_locked_doors_len(this.__wbg_ptr) >>> 0;
    }
    progress_preview() {
      return l.replay_progress_preview(this.__wbg_ptr) >>> 0;
    }
    regular_door_deg(e) {
      return l.replay_regular_door_deg(this.__wbg_ptr, e);
    }
    send_past_ninjas() {
      l.replay_send_past_ninjas(this.__wbg_ptr);
    }
    shove_thwump_deg(e) {
      return l.replay_shove_thwump_deg(this.__wbg_ptr, e);
    }
    bounce_blocks_len() {
      return l.replay_bounce_blocks_len(this.__wbg_ptr) >>> 0;
    }
    regular_doors_len() {
      return l.replay_regular_doors_len(this.__wbg_ptr) >>> 0;
    }
    shove_thwumps_len() {
      return l.replay_shove_thwumps_len(this.__wbg_ptr) >>> 0;
    }
    chaingun_drone_deg(e) {
      return l.replay_chaingun_drone_deg(this.__wbg_ptr, e);
    }
    exit_anim_progress(e, r) {
      return l.replay_exit_anim_progress(this.__wbg_ptr, e, r);
    }
    shove_thwump_touch(e) {
      return l.replay_shove_thwump_touch(this.__wbg_ptr, e);
    }
    chaingun_drones_len() {
      return l.replay_chaingun_drones_len(this.__wbg_ptr) >>> 0;
    }
    ninja_preview_bones(e) {
      const r = l.replay_ninja_preview_bones(this.__wbg_ptr, e);
      var s = nt(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 8, 8), s;
    }
    boost_pad_anim_progress(e, r) {
      return l.replay_boost_pad_anim_progress(this.__wbg_ptr, e, r);
    }
    trap_door_anim_progress(e, r) {
      return l.replay_trap_door_anim_progress(this.__wbg_ptr, e, r);
    }
    locked_door_anim_progress(e, r) {
      return l.replay_locked_door_anim_progress(this.__wbg_ptr, e, r);
    }
    regular_door_anim_progress(e, r) {
      return l.replay_regular_door_anim_progress(this.__wbg_ptr, e, r);
    }
    seek(e) {
      l.replay_seek(this.__wbg_ptr, e);
    }
    tick() {
      l.replay_tick(this.__wbg_ptr);
    }
    mine_x(e) {
      return l.replay_mine_x(this.__wbg_ptr, e);
    }
    mine_y(e) {
      return l.replay_mine_y(this.__wbg_ptr, e);
    }
    ninja_x(e) {
      return l.replay_ninja_x(this.__wbg_ptr, e);
    }
    ninja_y(e) {
      return l.replay_ninja_y(this.__wbg_ptr, e);
    }
    progress() {
      return l.replay_progress(this.__wbg_ptr) >>> 0;
    }
    thwump_x(e, r) {
      return l.replay_thwump_x(this.__wbg_ptr, e, r);
    }
    thwump_y(e, r) {
      return l.replay_thwump_y(this.__wbg_ptr, e, r);
    }
    mines_len() {
      return l.replay_mines_len(this.__wbg_ptr) >>> 0;
    }
    one_way_x(e) {
      return l.replay_one_way_x(this.__wbg_ptr, e);
    }
    one_way_y(e) {
      return l.replay_one_way_y(this.__wbg_ptr, e);
    }
    set_input(e, r, s, n) {
      l.replay_set_input(this.__wbg_ptr, e, r, s, n);
    }
  }
  Symbol.dispose && (Me.prototype[Symbol.dispose] = Me.prototype.free);
  function Hr(t, e) {
    throw new Error(we(t, e));
  }
  function qr(t) {
    return Ce.__wrap(t);
  }
  function Ur(t, e) {
    return we(t, e);
  }
  function Vr() {
    const t = l.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const a = await Nr({
    "./ntools_rs_bg.js": {
      __wbg_exportedentity_new: qr,
      __wbg___wbindgen_throw_b855445ff6a94295: Hr,
      __wbindgen_init_externref_table: Vr,
      __wbindgen_cast_2241b6af4c4b2941: Ur
    }
  }, jr), Wr = a.memory, Fr = a.__wbg_editor_free, Zr = a.editor_crosshair_x, Yr = a.editor_crosshair_y, Xr = a.editor_cursor_down, Jr = a.editor_cursor_up, Qr = a.editor_double_click, es = a.editor_entities, ts = a.editor_export_map, rs = a.editor_get_anim_state, ss = a.editor_get_level_name, os = a.editor_get_show_trail, ns = a.editor_load_attract, is = a.editor_load_map, _s = a.editor_mode, ls = a.editor_new, as = a.editor_palette_center_x, cs = a.editor_palette_center_y, ds = a.editor_palette_selection_x, us = a.editor_palette_selection_y, ps = a.editor_past_ninja_bones, hs = a.editor_past_ninja_x, gs = a.editor_past_ninja_y, fs = a.editor_past_ninjas_len, ys = a.editor_press_0, ws = a.editor_press_1, ms = a.editor_press_2, bs = a.editor_press_3, xs = a.editor_press_4, vs = a.editor_press_5, ks = a.editor_press_6, $s = a.editor_press_7, Ds = a.editor_press_8, Ss = a.editor_press_9, Ts = a.editor_press_a, Ps = a.editor_press_alt_left, Es = a.editor_press_backtick, Ls = a.editor_press_bracket_left, As = a.editor_press_bracket_right, Cs = a.editor_press_c, Ms = a.editor_press_comma, js = a.editor_press_d, Ns = a.editor_press_dash, Bs = a.editor_press_down, Is = a.editor_press_e, Os = a.editor_press_enter, Rs = a.editor_press_equals, Ks = a.editor_press_escape, zs = a.editor_press_f, Gs = a.editor_press_h, Hs = a.editor_press_i, qs = a.editor_press_l, Us = a.editor_press_left, Vs = a.editor_press_m, Ws = a.editor_press_n, Fs = a.editor_press_num_0, Zs = a.editor_press_num_3, Ys = a.editor_press_num_7, Xs = a.editor_press_o, Js = a.editor_press_p, Qs = a.editor_press_q, eo = a.editor_press_r, to = a.editor_press_right, ro = a.editor_press_s, so = a.editor_press_shift, oo = a.editor_press_slash, no = a.editor_press_space, io = a.editor_press_t, _o = a.editor_press_up, lo = a.editor_press_w, ao = a.editor_press_x, co = a.editor_press_y, uo = a.editor_press_z, po = a.editor_preview_entities, ho = a.editor_receive_past_ninjas, go = a.editor_redo, fo = a.editor_release_a, yo = a.editor_release_alt_left, wo = a.editor_release_c, mo = a.editor_release_d, bo = a.editor_release_e, xo = a.editor_release_q, vo = a.editor_release_s, ko = a.editor_release_shift, $o = a.editor_release_space, Do = a.editor_release_w, So = a.editor_release_z, To = a.editor_selected_tile_outline_path, Po = a.editor_selected_tiles_path, Eo = a.editor_set_anim_data, Lo = a.editor_set_cursor_pos, Ao = a.editor_set_level_name, Co = a.editor_set_show_trail, Mo = a.editor_show_half_grid, jo = a.editor_show_quarter_grid, No = a.editor_tile_crosshair_col, Bo = a.editor_tile_crosshair_row, Io = a.editor_tiles_path, Oo = a.editor_to_replay, Ro = a.editor_undo, Ko = a.__wbg_exportedentity_free, zo = a.__wbg_get_exportedentity_deg, Go = a.__wbg_get_exportedentity_switch_x, Ho = a.__wbg_get_exportedentity_switch_y, qo = a.__wbg_get_exportedentity_type_int, Uo = a.__wbg_get_exportedentity_x, Vo = a.__wbg_get_exportedentity_y, Wo = a.__wbg_set_exportedentity_deg, Fo = a.__wbg_set_exportedentity_switch_x, Zo = a.__wbg_set_exportedentity_switch_y, Yo = a.__wbg_set_exportedentity_type_int, Xo = a.__wbg_set_exportedentity_x, Jo = a.__wbg_set_exportedentity_y, Qo = a.__wbg_replay_free, en = a.replay_boost_pad_anim_progress, tn = a.replay_boost_pad_deg, rn = a.replay_boost_pad_x, sn = a.replay_boost_pad_y, on = a.replay_boost_pads_len, nn = a.replay_bounce_block_deg, _n = a.replay_bounce_block_x, ln = a.replay_bounce_block_y, an = a.replay_bounce_blocks_len, cn = a.replay_chaingun_drone_deg, dn = a.replay_chaingun_drone_x, un = a.replay_chaingun_drone_y, pn = a.replay_chaingun_drones_len, hn = a.replay_exit_anim_progress, gn = a.replay_exit_door_x, fn = a.replay_exit_door_y, yn = a.replay_exit_doors_len, wn = a.replay_exit_switch_x, mn = a.replay_exit_switch_y, bn = a.replay_floor_guard_deg, xn = a.replay_floor_guard_x, vn = a.replay_floor_guard_y, kn = a.replay_floor_guards_len, $n = a.replay_launch_pad_deg, Dn = a.replay_launch_pad_x, Sn = a.replay_launch_pad_y, Tn = a.replay_launch_pads_len, Pn = a.replay_locked_door_anim_progress, En = a.replay_locked_door_deg, Ln = a.replay_locked_door_x, An = a.replay_locked_door_y, Cn = a.replay_locked_doors_len, Mn = a.replay_locked_switch_x, jn = a.replay_locked_switch_y, Nn = a.replay_mine_state, Bn = a.replay_mine_x, In = a.replay_mine_y, On = a.replay_mines_len, Rn = a.replay_ninja_bones, Kn = a.replay_ninja_preview_bones, zn = a.replay_ninja_preview_x, Gn = a.replay_ninja_preview_y, Hn = a.replay_ninja_x, qn = a.replay_ninja_y, Un = a.replay_one_way_deg, Vn = a.replay_one_way_x, Wn = a.replay_one_way_y, Fn = a.replay_one_ways_len, Zn = a.replay_place_ninja, Yn = a.replay_progress, Xn = a.replay_progress_preview, Jn = a.replay_regular_door_anim_progress, Qn = a.replay_regular_door_deg, ei = a.replay_regular_door_x, ti = a.replay_regular_door_y, ri = a.replay_regular_doors_len, si = a.replay_replay_length, oi = a.replay_seek, ni = a.replay_seek_preview, ii = a.replay_send_past_ninjas, _i = a.replay_set_input, li = a.replay_shove_thwump_deg, ai = a.replay_shove_thwump_touch, ci = a.replay_shove_thwump_x, di = a.replay_shove_thwump_y, ui = a.replay_shove_thwumps_len, pi = a.replay_thwump_deg, hi = a.replay_thwump_x, gi = a.replay_thwump_y, fi = a.replay_thwumps_len, yi = a.replay_tick, wi = a.replay_tiles_path, mi = a.replay_trap_door_anim_progress, bi = a.replay_trap_door_deg, xi = a.replay_trap_door_x, vi = a.replay_trap_door_y, ki = a.replay_trap_doors_len, $i = a.replay_trap_switch_x, Di = a.replay_trap_switch_y, Si = a.replay_zap_drone_deg, Ti = a.replay_zap_drone_x, Pi = a.replay_zap_drone_y, Ei = a.replay_zap_drones_len, Li = a.editor_press_j, Ai = a.editor_press_k, Ci = a.editor_press_num_1, Mi = a.editor_press_num_2, ji = a.editor_press_num_4, Ni = a.editor_press_num_5, Bi = a.editor_press_u, Ii = a.__wbindgen_externrefs, Oi = a.__wbindgen_free, Ri = a.__wbindgen_malloc, Ki = a.__externref_table_dealloc, zi = a.__wbindgen_realloc, Gi = a.__externref_drop_slice, Rt = a.__wbindgen_start, Hi = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: Gi,
    __externref_table_dealloc: Ki,
    __wbg_editor_free: Fr,
    __wbg_exportedentity_free: Ko,
    __wbg_get_exportedentity_deg: zo,
    __wbg_get_exportedentity_switch_x: Go,
    __wbg_get_exportedentity_switch_y: Ho,
    __wbg_get_exportedentity_type_int: qo,
    __wbg_get_exportedentity_x: Uo,
    __wbg_get_exportedentity_y: Vo,
    __wbg_replay_free: Qo,
    __wbg_set_exportedentity_deg: Wo,
    __wbg_set_exportedentity_switch_x: Fo,
    __wbg_set_exportedentity_switch_y: Zo,
    __wbg_set_exportedentity_type_int: Yo,
    __wbg_set_exportedentity_x: Xo,
    __wbg_set_exportedentity_y: Jo,
    __wbindgen_externrefs: Ii,
    __wbindgen_free: Oi,
    __wbindgen_malloc: Ri,
    __wbindgen_realloc: zi,
    __wbindgen_start: Rt,
    editor_crosshair_x: Zr,
    editor_crosshair_y: Yr,
    editor_cursor_down: Xr,
    editor_cursor_up: Jr,
    editor_double_click: Qr,
    editor_entities: es,
    editor_export_map: ts,
    editor_get_anim_state: rs,
    editor_get_level_name: ss,
    editor_get_show_trail: os,
    editor_load_attract: ns,
    editor_load_map: is,
    editor_mode: _s,
    editor_new: ls,
    editor_palette_center_x: as,
    editor_palette_center_y: cs,
    editor_palette_selection_x: ds,
    editor_palette_selection_y: us,
    editor_past_ninja_bones: ps,
    editor_past_ninja_x: hs,
    editor_past_ninja_y: gs,
    editor_past_ninjas_len: fs,
    editor_press_0: ys,
    editor_press_1: ws,
    editor_press_2: ms,
    editor_press_3: bs,
    editor_press_4: xs,
    editor_press_5: vs,
    editor_press_6: ks,
    editor_press_7: $s,
    editor_press_8: Ds,
    editor_press_9: Ss,
    editor_press_a: Ts,
    editor_press_alt_left: Ps,
    editor_press_backtick: Es,
    editor_press_bracket_left: Ls,
    editor_press_bracket_right: As,
    editor_press_c: Cs,
    editor_press_comma: Ms,
    editor_press_d: js,
    editor_press_dash: Ns,
    editor_press_down: Bs,
    editor_press_e: Is,
    editor_press_enter: Os,
    editor_press_equals: Rs,
    editor_press_escape: Ks,
    editor_press_f: zs,
    editor_press_h: Gs,
    editor_press_i: Hs,
    editor_press_j: Li,
    editor_press_k: Ai,
    editor_press_l: qs,
    editor_press_left: Us,
    editor_press_m: Vs,
    editor_press_n: Ws,
    editor_press_num_0: Fs,
    editor_press_num_1: Ci,
    editor_press_num_2: Mi,
    editor_press_num_3: Zs,
    editor_press_num_4: ji,
    editor_press_num_5: Ni,
    editor_press_num_7: Ys,
    editor_press_o: Xs,
    editor_press_p: Js,
    editor_press_q: Qs,
    editor_press_r: eo,
    editor_press_right: to,
    editor_press_s: ro,
    editor_press_shift: so,
    editor_press_slash: oo,
    editor_press_space: no,
    editor_press_t: io,
    editor_press_u: Bi,
    editor_press_up: _o,
    editor_press_w: lo,
    editor_press_x: ao,
    editor_press_y: co,
    editor_press_z: uo,
    editor_preview_entities: po,
    editor_receive_past_ninjas: ho,
    editor_redo: go,
    editor_release_a: fo,
    editor_release_alt_left: yo,
    editor_release_c: wo,
    editor_release_d: mo,
    editor_release_e: bo,
    editor_release_q: xo,
    editor_release_s: vo,
    editor_release_shift: ko,
    editor_release_space: $o,
    editor_release_w: Do,
    editor_release_z: So,
    editor_selected_tile_outline_path: To,
    editor_selected_tiles_path: Po,
    editor_set_anim_data: Eo,
    editor_set_cursor_pos: Lo,
    editor_set_level_name: Ao,
    editor_set_show_trail: Co,
    editor_show_half_grid: Mo,
    editor_show_quarter_grid: jo,
    editor_tile_crosshair_col: No,
    editor_tile_crosshair_row: Bo,
    editor_tiles_path: Io,
    editor_to_replay: Oo,
    editor_undo: Ro,
    memory: Wr,
    replay_boost_pad_anim_progress: en,
    replay_boost_pad_deg: tn,
    replay_boost_pad_x: rn,
    replay_boost_pad_y: sn,
    replay_boost_pads_len: on,
    replay_bounce_block_deg: nn,
    replay_bounce_block_x: _n,
    replay_bounce_block_y: ln,
    replay_bounce_blocks_len: an,
    replay_chaingun_drone_deg: cn,
    replay_chaingun_drone_x: dn,
    replay_chaingun_drone_y: un,
    replay_chaingun_drones_len: pn,
    replay_exit_anim_progress: hn,
    replay_exit_door_x: gn,
    replay_exit_door_y: fn,
    replay_exit_doors_len: yn,
    replay_exit_switch_x: wn,
    replay_exit_switch_y: mn,
    replay_floor_guard_deg: bn,
    replay_floor_guard_x: xn,
    replay_floor_guard_y: vn,
    replay_floor_guards_len: kn,
    replay_launch_pad_deg: $n,
    replay_launch_pad_x: Dn,
    replay_launch_pad_y: Sn,
    replay_launch_pads_len: Tn,
    replay_locked_door_anim_progress: Pn,
    replay_locked_door_deg: En,
    replay_locked_door_x: Ln,
    replay_locked_door_y: An,
    replay_locked_doors_len: Cn,
    replay_locked_switch_x: Mn,
    replay_locked_switch_y: jn,
    replay_mine_state: Nn,
    replay_mine_x: Bn,
    replay_mine_y: In,
    replay_mines_len: On,
    replay_ninja_bones: Rn,
    replay_ninja_preview_bones: Kn,
    replay_ninja_preview_x: zn,
    replay_ninja_preview_y: Gn,
    replay_ninja_x: Hn,
    replay_ninja_y: qn,
    replay_one_way_deg: Un,
    replay_one_way_x: Vn,
    replay_one_way_y: Wn,
    replay_one_ways_len: Fn,
    replay_place_ninja: Zn,
    replay_progress: Yn,
    replay_progress_preview: Xn,
    replay_regular_door_anim_progress: Jn,
    replay_regular_door_deg: Qn,
    replay_regular_door_x: ei,
    replay_regular_door_y: ti,
    replay_regular_doors_len: ri,
    replay_replay_length: si,
    replay_seek: oi,
    replay_seek_preview: ni,
    replay_send_past_ninjas: ii,
    replay_set_input: _i,
    replay_shove_thwump_deg: li,
    replay_shove_thwump_touch: ai,
    replay_shove_thwump_x: ci,
    replay_shove_thwump_y: di,
    replay_shove_thwumps_len: ui,
    replay_thwump_deg: pi,
    replay_thwump_x: hi,
    replay_thwump_y: gi,
    replay_thwumps_len: fi,
    replay_tick: yi,
    replay_tiles_path: wi,
    replay_trap_door_anim_progress: mi,
    replay_trap_door_deg: bi,
    replay_trap_door_x: xi,
    replay_trap_door_y: vi,
    replay_trap_doors_len: ki,
    replay_trap_switch_x: $i,
    replay_trap_switch_y: Di,
    replay_zap_drone_deg: Si,
    replay_zap_drone_x: Ti,
    replay_zap_drone_y: Pi,
    replay_zap_drones_len: Ei
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  Br(Hi);
  Rt();
  function qi({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var Ui = v("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const Vi = [
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
  function Ve(t) {
    function e() {
      const r = t.bones();
      return r ? Vi.map(([s, n]) => `M ${20 * r[s]} ${20 * r[s + 13]} ${20 * r[n]} ${20 * r[n + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = Ui();
      return S((s) => {
        var n = t.class, i = qi(t.ninja()), _ = e();
        return n !== s.e && w(r, "class", s.e = n), i !== s.t && w(r, "transform", s.t = i), _ !== s.a && w(r, "d", s.a = _), s;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var Wi = v("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), Fi = v("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function Zi(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function Yi(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Xi([t, e], r, s) {
    const n = t(), i = r.exit_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.exit_door_x(o),
        y: r.exit_door_y(o),
        animProgress: r.exit_anim_progress(o, s)
      };
      c && Zi(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Kt(t) {
    return u(U, {
      get each() {
        return t.exitDoors();
      },
      children: (e) => u(Ji, {
        exitDoor: e
      })
    });
  }
  const V = 11, R = 2.5;
  function Ji(t) {
    return (() => {
      var e = Wi(), r = e.firstChild, s = r.nextSibling, n = s.nextSibling, i = n.nextSibling, _ = i.nextSibling;
      return S((o) => {
        var c = Yi(t.exitDoor), p = -13 + 4 * (1 - t.exitDoor().animProgress), b = 26 - 8 * (1 - t.exitDoor().animProgress), f = `M ${-13 * t.exitDoor().animProgress} 0 v ${-V} h ${-V + R} l ${-R} ${R} v ${2 * (V - R)} l ${R} ${R} h ${V - R} z`, L = `M ${13 * t.exitDoor().animProgress} 0 v ${-V} h ${V - R} l ${R} ${R} v ${2 * (V - R)} l ${-R} ${R} h ${-V + R} z`, E = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * V} v ${t.exitDoor().animProgress * V} h ${-V + R + t.exitDoor().animProgress} l ${-R} ${-R} v ${(1 - t.exitDoor().animProgress) * (-V + R)}`, j = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * V} v ${t.exitDoor().animProgress * V} h ${V - R - t.exitDoor().animProgress} l ${R} ${-R} v ${(1 - t.exitDoor().animProgress) * (-V + R)}`;
        return c !== o.e && w(e, "transform", o.e = c), p !== o.t && w(r, "x", o.t = p), b !== o.a && w(r, "width", o.a = b), f !== o.o && w(s, "d", o.o = f), L !== o.i && w(n, "d", o.i = L), E !== o.n && w(i, "d", o.n = E), j !== o.s && w(_, "d", o.s = j), o;
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
  function Qi() {
    return Fi();
  }
  var e_ = v('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function t_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function r_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function s_([t, e], r, s) {
    const n = t(), i = r.exit_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.exit_switch_x(o),
        y: r.exit_switch_y(o),
        animProgress: r.exit_anim_progress(o, s)
      };
      c && t_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function zt(t) {
    return u(U, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => u(o_, {
        exitSwitch: e
      })
    });
  }
  const pe = 2;
  function o_(t) {
    return (() => {
      var e = e_(), r = e.firstChild, s = r.nextSibling, n = s.nextSibling;
      return S((i) => {
        var _ = r_(t.exitSwitch), o = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, p = `M ${-2 * t.exitSwitch().animProgress} ${-pe} h ${-pe} v ${2 * pe} h ${pe}`, b = `M ${2 * t.exitSwitch().animProgress} ${-pe} h ${pe} v ${2 * pe} h ${-pe}`;
        return _ !== i.e && w(e, "transform", i.e = _), o !== i.t && w(r, "fill", i.t = o), c !== i.a && w(r, "stroke", i.a = c), p !== i.o && w(s, "d", i.o = p), b !== i.i && w(n, "d", i.i = b), i;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), e;
    })();
  }
  var n_ = v("<svg><use href=#one-way></svg>", false, true, false), i_ = v("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function __(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function l_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function a_([t, e], r) {
    const s = t(), n = r.one_ways_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.one_way_x(_),
        y: r.one_way_y(_),
        deg: r.one_way_deg(_)
      };
      o && __(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Gt(t) {
    return u(U, {
      get each() {
        return t.oneWays();
      },
      children: (e) => (() => {
        var r = n_();
        return S(() => w(r, "transform", l_(e))), r;
      })()
    });
  }
  function Ht() {
    return (() => {
      var t = i_(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var c_ = v("<svg><use></svg>", false, true, false), d_ = v("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), u_ = v("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), p_ = v("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const h_ = 0, g_ = 1;
  function f_(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function y_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function w_([t, e], r) {
    const s = t(), n = r.mines_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.mine_x(_),
        y: r.mine_y(_),
        type: r.mine_state(_)
      };
      o && f_(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function qt(t) {
    return u(U, {
      get each() {
        return t.mines();
      },
      children: (e) => (() => {
        var r = c_();
        return S((s) => {
          var n = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][e().type], i = y_(e);
          return n !== s.e && w(r, "href", s.e = n), i !== s.t && w(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function Ut() {
    return [
      (() => {
        var t = d_(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, n = s.nextSibling, i = n.nextSibling;
        return i.nextSibling, t;
      })(),
      (() => {
        var t = u_();
        return t.firstChild, t;
      })(),
      (() => {
        var t = p_();
        return t.firstChild, t;
      })()
    ];
  }
  var m_ = v("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), b_ = v("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), x_ = v("<svg><g class=regular-door></svg>", false, true, false);
  function v_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function k_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function $_([t, e], r, s) {
    const n = t(), i = r.regular_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.regular_door_x(o),
        y: r.regular_door_y(o),
        deg: r.regular_door_deg(o),
        animProgress: r.regular_door_anim_progress(o, s)
      };
      c && v_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Vt(t) {
    return u(U, {
      get each() {
        return t.regularDoors();
      },
      children: (e) => u(T_, {
        regularDoor: e
      })
    });
  }
  const D_ = 1, S_ = 12 - D_;
  function T_(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (S_ - 0) * r;
    }
    return (() => {
      var r = x_();
      return x(r, u(G, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var s = m_();
              return S(() => w(s, "x2", -e())), s;
            })(),
            (() => {
              var s = b_();
              return S(() => w(s, "x2", e())), s;
            })()
          ];
        }
      })), S(() => w(r, "transform", k_(t.regularDoor))), r;
    })();
  }
  var P_ = v("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), E_ = v("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), ft = v("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), L_ = v("<svg><g class=locked-door></svg>", false, true, false);
  function A_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function C_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function M_([t, e], r, s) {
    const n = t(), i = r.locked_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.locked_door_x(o),
        y: r.locked_door_y(o),
        deg: r.locked_door_deg(o),
        animProgress: r.locked_door_anim_progress(o, s)
      };
      c && A_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Wt(t) {
    return u(U, {
      get each() {
        return t.lockedDoors();
      },
      children: (e) => u(B_, {
        lockedDoor: e
      })
    });
  }
  const j_ = 1, N_ = 12 - j_;
  function B_(t) {
    function e() {
      let n = t.lockedDoor().animProgress;
      return n = Math.min(Math.max(2 * n, 0), 1), 4.5 + 4 * n;
    }
    function r() {
      let n = t.lockedDoor().animProgress;
      return n = Math.min(Math.max(2 * n, 0), 1), 0 + 10 * n;
    }
    function s() {
      let n = t.lockedDoor().animProgress;
      return n = Math.min(Math.max((n - 0.4) / 0.6, 0), 1), 0 + (N_ - 0) * n;
    }
    return (() => {
      var n = L_();
      return x(n, u(G, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var i = P_();
              return S(() => w(i, "x2", -s())), i;
            })(),
            (() => {
              var i = E_();
              return S(() => w(i, "x2", s())), i;
            })()
          ];
        }
      }), null), x(n, u(G, {
        get when() {
          return t.lockedDoor().animProgress < 0.5;
        },
        get children() {
          return [
            (() => {
              var i = ft();
              return S((_) => {
                var o = e(), c = r();
                return o !== _.e && w(i, "x1", _.e = o), c !== _.t && w(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = ft();
              return S((_) => {
                var o = -e(), c = -r();
                return o !== _.e && w(i, "x1", _.e = o), c !== _.t && w(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      }), null), S(() => w(n, "transform", C_(t.lockedDoor))), n;
    })();
  }
  var I_ = v("<svg><use></svg>", false, true, false), O_ = v("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), R_ = v("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function K_(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function z_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function G_([t, e], r) {
    const s = t(), n = r.locked_doors_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.locked_switch_x(_),
        y: r.locked_switch_y(_),
        wasTouched: r.locked_door_anim_progress(_, 1) >= 0
      };
      o && K_(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Ft(t) {
    return u(U, {
      get each() {
        return t.lockedSwitches();
      },
      children: (e) => (() => {
        var r = I_();
        return S((s) => {
          var n = e().wasTouched ? "#locked-switch-touched" : "#locked-switch", i = z_(e);
          return n !== s.e && w(r, "href", s.e = n), i !== s.t && w(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function Zt() {
    return [
      (() => {
        var t = O_(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = R_(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var H_ = v("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), yt = v("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), q_ = v("<svg><g></svg>", false, true, false);
  function U_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function V_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function W_([t, e], r, s) {
    const n = t(), i = r.trap_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.trap_door_x(o),
        y: r.trap_door_y(o),
        deg: r.trap_door_deg(o),
        animProgress: r.trap_door_anim_progress(o, s)
      };
      c && U_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Yt(t) {
    return u(U, {
      get each() {
        return t.trapDoors();
      },
      children: (e) => u(Y_, {
        trapDoor: e
      })
    });
  }
  const F_ = 1, Z_ = 12 - F_;
  function Y_(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function s() {
      let n = t.trapDoor().animProgress;
      return 0 + (Z_ - 0) * n;
    }
    return (() => {
      var n = q_();
      return x(n, u(G, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var i = H_();
              return S((_) => {
                var o = -s(), c = s();
                return o !== _.e && w(i, "x1", _.e = o), c !== _.t && w(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = yt();
              return S((_) => {
                var o = e(), c = r();
                return o !== _.e && w(i, "x1", _.e = o), c !== _.t && w(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = yt();
              return S((_) => {
                var o = -e(), c = -r();
                return o !== _.e && w(i, "x1", _.e = o), c !== _.t && w(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      })), S(() => w(n, "transform", V_(t.trapDoor))), n;
    })();
  }
  var X_ = v("<svg><use></svg>", false, true, false), J_ = v("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), Q_ = v("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function el(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function tl(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function rl([t, e], r) {
    const s = t(), n = r.trap_doors_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.trap_switch_x(_),
        y: r.trap_switch_y(_),
        wasTouched: r.trap_door_anim_progress(_, 1) >= 0
      };
      o && el(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Xt(t) {
    return u(U, {
      get each() {
        return t.trapSwitches();
      },
      children: (e) => (() => {
        var r = X_();
        return S((s) => {
          var n = e().wasTouched ? "#trap-switch-touched" : "#trap-switch", i = tl(e);
          return n !== s.e && w(r, "href", s.e = n), i !== s.t && w(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function Jt() {
    return [
      (() => {
        var t = J_();
        return t.firstChild, t;
      })(),
      (() => {
        var t = Q_(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var sl = v("<svg><g><rect fill=var(--launch-pad-long) x=0 y=-7.5 width=1.5 height=15></rect><line stroke=var(--launch-pad-short) stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function ol(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function nl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function il([t, e], r) {
    const s = t(), n = r.launch_pads_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.launch_pad_x(_),
        y: r.launch_pad_y(_),
        deg: r.launch_pad_deg(_)
      };
      o && ol(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Qt(t) {
    return u(U, {
      get each() {
        return t.launchPads();
      },
      children: (e) => u(_l, {
        launchPad: e
      })
    });
  }
  function _l(t) {
    return (() => {
      var e = sl(), r = e.firstChild;
      return r.nextSibling, S(() => w(e, "transform", nl(t.launchPad))), e;
    })();
  }
  var ll = v('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function al(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function cl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function dl([t, e], r, s) {
    const n = t(), i = r.floor_guards_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.floor_guard_x(o, s),
        y: r.floor_guard_y(o, s),
        deg: r.floor_guard_deg(o)
      };
      c && al(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function er(t) {
    return u(U, {
      get each() {
        return t.floorGuards();
      },
      children: (e) => u(ul, {
        floorGuard: e
      })
    });
  }
  function ul(t) {
    return (() => {
      var e = ll();
      return e.firstChild, S(() => w(e, "transform", cl(t.floorGuard))), e;
    })();
  }
  var pl = v("<svg><use href=#bounceblock></svg>", false, true, false), hl = v('<svg><g id=bounceblock><path fill=var(--bounceblock-interior) d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path stroke=var(--bounceblock-border) d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function gl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function fl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function yl([t, e], r, s) {
    const n = t(), i = r.bounce_blocks_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.bounce_block_x(o, s),
        y: r.bounce_block_y(o, s),
        deg: r.bounce_block_deg(o)
      };
      c && gl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function tr(t) {
    return u(U, {
      get each() {
        return t.bounceBlocks();
      },
      children: (e) => (() => {
        var r = pl();
        return S(() => w(r, "transform", fl(e))), r;
      })()
    });
  }
  function rr() {
    return (() => {
      var t = hl(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var wl = v("<svg><use href=#boostpad></svg>", false, true, false), ml = v("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function bl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function xl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function vl([t, e], r, s) {
    const n = t(), i = r.boost_pads_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.boost_pad_x(o),
        y: r.boost_pad_y(o),
        deg: r.boost_pad_deg(o, s),
        animProgress: r.boost_pad_anim_progress(o, s)
      };
      c && bl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function sr(t) {
    return u(U, {
      get each() {
        return t.boostPads();
      },
      children: (e) => (() => {
        var r = wl();
        return S((s) => {
          var n = `color-mix(in srgb-linear, var(--boost-pad) ${e().animProgress * 100}%, var(--boost-pad-wooshing))`, i = xl(e);
          return n !== s.e && w(r, "stroke", s.e = n), i !== s.t && w(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function or() {
    return (() => {
      var t = ml(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, n = s.nextSibling;
      return n.nextSibling, t;
    })();
  }
  var kl = v("<svg><use href=#thwump></svg>", false, true, false), $l = v('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function Dl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Sl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Tl([t, e], r, s) {
    const n = t(), i = r.thwumps_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.thwump_x(o, s),
        y: r.thwump_y(o, s),
        deg: r.thwump_deg(o)
      };
      c && Dl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function nr(t) {
    return u(U, {
      get each() {
        return t.thwumps();
      },
      children: (e) => (() => {
        var r = kl();
        return S(() => w(r, "transform", Sl(e))), r;
      })()
    });
  }
  function ir() {
    return (() => {
      var t = $l(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Pl = v("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), El = v("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function Ll(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function Al(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Cl([t, e], r, s) {
    const n = t(), i = r.shove_thwumps_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.shove_thwump_x(o, s),
        y: r.shove_thwump_y(o, s),
        deg: r.shove_thwump_deg(o),
        touch: r.shove_thwump_touch(o)
      };
      c && Ll(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function _r(t) {
    return u(U, {
      get each() {
        return t.shoveThwumps();
      },
      children: (e) => u(Ml, {
        shoveThwump: e
      })
    });
  }
  function Ml(t) {
    return (() => {
      var e = Pl(), r = e.firstChild;
      return x(e, u(_t, {
        each: [
          0,
          2,
          4,
          6
        ],
        children: (s) => u(G, {
          get when() {
            return t.shoveThwump().touch >= 16 || s === t.shoveThwump().touch;
          },
          get children() {
            var n = El(), i = n.firstChild, _ = i.nextSibling;
            return _.nextSibling, w(n, "transform", `rotate(${45 * s},0,0)`), n;
          }
        })
      }), r), S(() => w(e, "transform", Al(t.shoveThwump))), e;
    })();
  }
  const lr = ar((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function jl(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function Nl(t) {
    const e = String.fromCharCode(...t);
    console.log("anim data length", t.byteLength), localStorage.setItem("animData", e);
  }
  function Bl(t) {
    const e = localStorage.getItem("animData");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.set_anim_data(r);
    }
  }
  const Il = ar(Ol, 1e3);
  function Ol(t) {
    const e = JSON.stringify(t);
    localStorage.setItem("palette", e);
  }
  function Rl() {
    const t = localStorage.getItem("palette");
    if (t) try {
      const e = JSON.parse(t);
      if (typeof (e == null ? void 0 : e.name) == "string" && typeof (e == null ? void 0 : e.colors) == "object") return e;
    } catch {
      return;
    }
  }
  function ar(t, e) {
    let r;
    return (...s) => {
      typeof r == "number" && clearTimeout(r), r = setTimeout(() => t(...s), e);
    };
  }
  const Kl = "" + new URL("palette-CZVUb4uS.png", import.meta.url).href, cr = [
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
  ], wt = [
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
  ], mt = {
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
  }, zl = {
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
  }, Gl = (() => {
    const t = {};
    for (const e of wt) {
      t[e] = 0;
      for (const r of wt) mt[r] < mt[e] && (t[e] += zl[r]);
    }
    return t;
  })(), dr = [
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
    "--chaingun-drone-background",
    "--chaingun-drone-border",
    "--bat-body",
    "--bat-eye",
    "--time-remaining",
    "--hardcore-time",
    "--empty-timebar",
    "--regular-grid",
    "--fine-grid",
    "--door-switch-line",
    "--editor-crosshair",
    "--tiles-selected",
    "--entity-arrows",
    "--entity-palette-reticle"
  ], Hl = {
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
    "--chaingun-drone-background": {
      file: "entityDroneChaingun",
      index: 0
    },
    "--chaingun-drone-border": {
      file: "entityDroneChaingun",
      index: 1
    },
    "--bat-body": {
      file: "entityBat",
      index: 0
    },
    "--bat-eye": {
      file: "entityBat",
      index: 1
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
  let ur;
  async function ql() {
    const e = await (await fetch(Kl)).blob(), r = await createImageBitmap(e), s = document.createElement("canvas");
    s.width = r.width, s.height = r.height;
    const n = s.getContext("2d");
    n.drawImage(r, 0, 0), ur = n;
  }
  function Ul(t) {
    const e = ur, r = cr.indexOf(t);
    if (!e || r < 0) return;
    const s = {};
    for (const n of dr) {
      const { file: i, index: _ } = Hl[n], o = Gl[i] + _, c = e.getImageData(o, r, 1, 1).data, p = `rgb(${c[0]} ${c[1]} ${c[2]})`;
      s[n] = p;
    }
    return s;
  }
  function Vl(t) {
    for (const e of dr) document.body.style.setProperty(e, t[e]);
  }
  var Wl = v('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox></label> | Object corners <select><option>square</option><option>rounded</option></select> | <select></select><input type=text style=float:right>'), Fl = v("<option>");
  function Zl(t) {
    return (() => {
      var e = Wl(), r = e.firstChild, s = r.firstChild, n = s.nextSibling, i = r.nextSibling, _ = i.nextSibling, o = _.nextSibling, c = o.nextSibling, p = c.firstChild, b = p.nextSibling, f = c.nextSibling, L = f.nextSibling, E = L.firstChild, j = E.nextSibling, N = L.nextSibling, A = N.nextSibling, O = A.nextSibling;
      return n.addEventListener("change", function() {
        const $ = this.files;
        if ($ && $.length > 0) {
          const D = new FileReader();
          D.onloadend = () => {
            D.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(D.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, D.readAsArrayBuffer($[0]);
        }
      }), _.$$click = function() {
        const $ = t.editor.export_map(), D = new Blob([
          $.buffer
        ], {
          type: "application/octet-stream"
        }), M = URL.createObjectURL(D);
        this.href = M, this.download = t.editor.get_level_name().replaceAll(/[^a-z]/gi, "_"), setTimeout(() => URL.revokeObjectURL(M), 100);
      }, b.addEventListener("change", ($) => {
        t.setShowTrail($.currentTarget.checked), t.editor.set_show_trail($.currentTarget.checked);
      }), L.addEventListener("change", ($) => t.setRoundCorners($.currentTarget.value == "rounded")), A.addEventListener("change", ($) => {
        const D = Ul($.currentTarget.value);
        D && t.setPalette({
          name: $.currentTarget.value,
          colors: D
        });
      }), x(A, () => cr.map(($) => (() => {
        var D = Fl();
        return x(D, $), S(() => {
          var _a2;
          return D.selected = $ === (((_a2 = t.palette()) == null ? void 0 : _a2.name) ?? "vasquez");
        }), D;
      })())), O.addEventListener("change", () => lr(t.editor)), O.$$input = ($) => {
        t.editor.set_level_name($.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, S(($) => {
        var D = !t.roundCorners(), M = t.roundCorners();
        return D !== $.e && (E.selected = $.e = D), M !== $.t && (j.selected = $.t = M), $;
      }, {
        e: void 0,
        t: void 0
      }), S(() => b.checked = t.showTrail()), S(() => O.value = t.levelName()), e;
    })();
  }
  Fe([
    "click",
    "input"
  ]);
  var Yl = v("<svg><use href=#zapdrone></svg>", false, true, false), Xl = v('<svg><g id=zapdrone><path fill=var(--zap-drone-background) stroke=var(--zap-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--zap-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--zap-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function Jl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Ql(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ea([t, e], r, s) {
    const n = t(), i = r.zap_drones_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.zap_drone_x(o, s),
        y: r.zap_drone_y(o, s),
        deg: r.zap_drone_deg(o)
      };
      c && Jl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function pr(t) {
    return u(U, {
      get each() {
        return t.zapDrones();
      },
      children: (e) => (() => {
        var r = Yl();
        return S(() => w(r, "transform", Ql(e))), r;
      })()
    });
  }
  function hr() {
    return (() => {
      var t = Xl(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var ta = v("<svg><use href=#chaingundrone></svg>", false, true, false), ra = v('<svg><g id=chaingundrone><path fill=var(--chaingun-drone-background) stroke=var(--chaingun-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chaingun-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--chaingun-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function sa(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function oa(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function na([t, e], r, s) {
    const n = t(), i = r.chaingun_drones_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.chaingun_drone_x(o, s),
        y: r.chaingun_drone_y(o, s),
        deg: r.chaingun_drone_deg(o)
      };
      c && sa(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function gr(t) {
    return u(U, {
      get each() {
        return t.chaingunDrones();
      },
      children: (e) => (() => {
        var r = ta();
        return S(() => w(r, "transform", oa(e))), r;
      })()
    });
  }
  function fr() {
    return (() => {
      var t = ra(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var ia = v("<svg><use href=#bat></svg>", false, true, false), _a = v("<svg><circle id=bat r=5 cx=0 cy=0 fill=var(--bat-body)></svg>", false, true, false);
  function la(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function aa(t) {
    return u(U, {
      get each() {
        return t.bats();
      },
      children: (e) => (() => {
        var r = ia();
        return S(() => w(r, "transform", la(e))), r;
      })()
    });
  }
  function ca() {
    return _a();
  }
  var da = v('<svg><rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"width=150 height=150 style=mix-blend-mode:hard-light></svg>', false, true, false), ua = v("<svg><circle fill=none stroke=var(--entity-palette-reticle) r=16></svg>", false, true, false), pa = v('<svg><path d="M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12"fill-rule=evenodd fill="color-mix(in srgb,var(--background) 18%,white 15%)"style=mix-blend-mode:hard-light></svg>', false, true, false), ha = v("<svg><rect fill=none stroke=var(--editor-crosshair) stroke-width=2 width=26 height=26></svg>", false, true, false), ga = v("<svg><use href=#tilemode-crosshair></svg>", false, true, false), fa = v("<svg><use href=#crosshair></svg>", false, true, false), ya = v("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), wa = v('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none>'), bt = v("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), xt = v("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), ma = v("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), ba = v("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), xa = v("<svg><line class=door-switch-line></svg>", false, true, false);
  const Qe = 42, et = 23, vt = 0, kt = 1, va = 3, $t = 5, ka = 6, Dt = 7, $a = 8, tt = 9, Da = 0, Sa = 1, Ta = 3, Pa = 5, Ea = 6, La = 8, Aa = 10, Ca = 11, Ma = 12, ja = 14, Na = 16, Ba = 17, Ia = 20, Oa = 21, Ra = 24, Ka = 27, za = 28, Ga = new Float64Array([
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
  ]), Ha = new Float64Array([
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
  ]), St = 150;
  function Tt() {
    const [t, e] = m([]), [r, s] = m([]), [n, i] = m([]), [_, o] = m([]), [c, p] = m([]), [b, f] = m([]), [L, E] = m([]), [j, N] = m([]), [A, O] = m([]), [$, D] = m([]), [M, K] = m([]), [J, T] = m([]), [B, Q] = m([]), [F, ie] = m([]), [le, ce] = m([]), [C, Z] = m([]), [Y, H] = m([]), [ee, _e] = m([]), [oe, ge] = m([]);
    return {
      ninjas: t,
      setNinjas: e,
      mines: r,
      setMines: s,
      exitDoors: n,
      setExitDoors: i,
      exitSwitches: _,
      setExitSwitches: o,
      regularDoors: c,
      setRegularDoors: p,
      lockedDoors: b,
      setLockedDoors: f,
      lockedSwitches: L,
      setLockedSwitches: E,
      trapDoors: j,
      setTrapDoors: N,
      trapSwitches: A,
      setTrapSwitches: O,
      launchPads: $,
      setLaunchPads: D,
      oneWays: M,
      setOneWays: K,
      chaingunDrones: J,
      setChaingunDrones: T,
      zapDrones: B,
      setZapDrones: Q,
      floorGuards: F,
      setFloorGuards: ie,
      bounceBlocks: le,
      setBounceBlocks: ce,
      thwumps: C,
      setThwumps: Z,
      boostPads: Y,
      setBoostPads: H,
      bats: ee,
      setBats: _e,
      shoveThwumps: oe,
      setShoveThwumps: ge
    };
  }
  function Pt(t, e, r, s) {
    const n = [], i = [], _ = [], o = [], c = [], p = [], b = [], f = [], L = [], E = [], j = [], N = [], A = [], O = [], $ = [], D = [], M = [], K = [], J = [];
    for (const T of r) {
      const B = {
        x: T.x,
        y: T.y,
        deg: T.deg,
        animProgress: 0
      }, Q = {
        x: T.switch_x,
        y: T.switch_y,
        animProgress: 0,
        wasTouched: false
      }, F = {
        x1: T.x,
        y1: T.y,
        x2: T.switch_x,
        y2: T.switch_y
      };
      T.type_int === Da ? n.push(B) : T.type_int === Sa ? i.push({
        ...B,
        type: h_
      }) : T.type_int === Oa ? i.push({
        ...B,
        type: g_
      }) : T.type_int === Ta ? (_.push(B), Number.isNaN(T.switch_x) || (o.push(Q), e.push(F))) : T.type_int === Pa ? c.push(B) : T.type_int === Ea ? (p.push(B), Number.isNaN(T.switch_x) || (b.push(Q), e.push(F))) : T.type_int === La ? (f.push({
        ...B,
        animProgress: s ? 1 : -1
      }), Number.isNaN(T.switch_x) || (L.push(Q), e.push(F))) : T.type_int === Aa ? E.push(B) : T.type_int === Ca ? j.push(B) : T.type_int === Ma ? N.push(B) : T.type_int === ja ? A.push(B) : T.type_int === Na ? O.push(B) : T.type_int === Ba ? $.push(B) : T.type_int === Ia ? D.push(B) : T.type_int === Ra ? M.push({
        ...B,
        animProgress: 1
      }) : T.type_int === Ka ? K.push(B) : T.type_int === za && J.push({
        ...B,
        touch: 16
      }), T.free();
    }
    t.setNinjas(n), t.setMines(i), t.setExitDoors(_), t.setExitSwitches(o), t.setRegularDoors(c), t.setLockedDoors(p), t.setLockedSwitches(b), t.setTrapDoors(f), t.setTrapSwitches(L), t.setLaunchPads(E), t.setOneWays(j), t.setChaingunDrones(N), t.setZapDrones(A), t.setFloorGuards(O), t.setBounceBlocks($), t.setThwumps(D), t.setBoostPads(M), t.setBats(K), t.setShoveThwumps(J);
  }
  function Et({ entities: t }) {
    return [
      u(Kt, {
        get exitDoors() {
          return t.exitDoors;
        }
      }),
      u(Gt, {
        get oneWays() {
          return t.oneWays;
        }
      }),
      u(qt, {
        get mines() {
          return t.mines;
        }
      }),
      u(Vt, {
        get regularDoors() {
          return t.regularDoors;
        }
      }),
      u(Yt, {
        get trapDoors() {
          return t.trapDoors;
        }
      }),
      u(Wt, {
        get lockedDoors() {
          return t.lockedDoors;
        }
      }),
      u(Ft, {
        get lockedSwitches() {
          return t.lockedSwitches;
        }
      }),
      u(Xt, {
        get trapSwitches() {
          return t.trapSwitches;
        }
      }),
      u(zt, {
        get exitSwitches() {
          return t.exitSwitches;
        }
      }),
      u(Qt, {
        get launchPads() {
          return t.launchPads;
        }
      }),
      u(gr, {
        get chaingunDrones() {
          return t.chaingunDrones;
        }
      }),
      u(pr, {
        get zapDrones() {
          return t.zapDrones;
        }
      }),
      u(er, {
        get floorGuards() {
          return t.floorGuards;
        }
      }),
      u(aa, {
        get bats() {
          return t.bats;
        }
      }),
      u(nr, {
        get thwumps() {
          return t.thwumps;
        }
      }),
      u(_t, {
        get each() {
          return t.ninjas();
        },
        children: (e) => u(Ve, {
          class: "ninja",
          ninja: () => e,
          bones: () => Ga
        })
      }),
      u(tr, {
        get bounceBlocks() {
          return t.bounceBlocks;
        }
      }),
      u(_r, {
        get shoveThwumps() {
          return t.shoveThwumps;
        }
      }),
      u(sr, {
        get boostPads() {
          return t.boostPads;
        }
      })
    ];
  }
  function qa(t) {
    const { editor: e, pastNinjas: r } = t, [s, n] = m(""), [i, _] = m(""), [o, c] = m(true), [p, b] = m(false), [f, L] = m(vt), [E, j] = m({
      row: 1,
      col: 1
    }), [N, A] = m({
      x: 24,
      y: 24
    }), [O, $] = m(""), [D, M] = m({
      x: NaN,
      y: NaN
    }), [K, J] = m({
      x: NaN,
      y: NaN
    }), T = Tt(), B = Tt(), [Q, F] = m([]), [ie, le] = m(e.get_show_trail()), [ce, C] = m(), Z = (d) => {
      let y = false;
      if (!(d.target instanceof HTMLInputElement || d.target instanceof HTMLSelectElement)) {
        if (d.ctrlKey || d.metaKey) {
          d.code === "KeyZ" && (d.ctrlKey || d.metaKey) && d.shiftKey ? (y = true, e.redo()) : d.code === "KeyZ" && (d.ctrlKey || d.metaKey) ? (y = true, e.undo()) : d.code === "KeyY" && (d.ctrlKey || d.metaKey) && (y = true, e.redo()), y && (H(true), d.preventDefault());
          return;
        }
        d.shiftKey && (y = true, e.press_shift()), d.code === "Enter" && e.mode() === tt ? t.setReplay(e.to_replay(t.roundCorners())) : d.code === "Backquote" ? (y = true, e.press_backtick()) : d.code === "Digit1" ? (y = true, e.press_1(d.shiftKey)) : d.code === "Digit2" ? (y = true, e.press_2(d.shiftKey)) : d.code === "Digit3" ? (y = true, e.press_3(d.shiftKey)) : d.code === "Digit4" ? (y = true, e.press_4(d.shiftKey)) : d.code === "Digit5" ? (y = true, e.press_5(d.shiftKey)) : d.code === "Digit6" ? (y = true, e.press_6(d.shiftKey)) : d.code === "Digit7" ? (y = true, e.press_7(d.shiftKey)) : d.code === "Digit8" ? (y = true, e.press_8(d.shiftKey)) : d.code === "Digit9" ? (y = true, e.press_9()) : d.code === "Digit0" ? (y = true, e.press_0()) : d.code === "Minus" ? (y = true, e.press_dash()) : d.code === "Equal" ? (y = true, e.press_equals()) : d.code === "KeyQ" ? (y = true, e.press_q(d.shiftKey)) : d.code === "KeyW" ? (y = true, e.press_w(d.shiftKey)) : d.code === "KeyA" ? (y = true, e.press_a(d.shiftKey)) : d.code === "KeyS" ? (y = true, e.press_s(d.shiftKey)) : d.code === "KeyE" ? (y = true, e.press_e()) : d.code === "KeyD" ? (y = true, e.press_d()) : d.code === "KeyZ" ? (y = true, e.press_z()) : d.code === "KeyX" ? (y = true, e.press_x()) : d.code === "KeyC" ? (y = true, e.press_c()) : d.code === "Space" ? (y = true, e.press_space()) : d.code === "AltLeft" ? (y = true, e.press_alt_left(d.shiftKey)) : d.code === "KeyR" ? (y = true, e.press_r()) : d.code === "KeyT" ? (y = true, e.press_t()) : d.code === "KeyY" ? (y = true, e.press_y()) : d.code === "KeyU" ? (y = true, e.press_u()) : d.code === "KeyI" ? (y = true, e.press_i()) : d.code === "KeyO" ? (y = true, e.press_o()) : d.code === "KeyP" ? (y = true, e.press_p()) : d.code === "BracketLeft" ? (y = true, e.press_bracket_left()) : d.code === "BracketRight" ? (y = true, e.press_bracket_right()) : d.code === "KeyF" ? (y = true, e.press_f()) : d.code === "KeyH" ? (y = true, e.press_h()) : d.code === "KeyJ" ? (y = true, e.press_j()) : d.code === "KeyK" ? (y = true, e.press_k()) : d.code === "KeyL" ? (y = true, e.press_l()) : d.code === "KeyN" ? (y = true, e.press_n()) : d.code === "KeyM" ? (y = true, e.press_m()) : d.code === "Comma" ? (y = true, e.press_comma()) : d.code === "ArrowUp" ? (y = true, e.press_up(d.shiftKey)) : d.code === "ArrowDown" ? (y = true, e.press_down(d.shiftKey)) : d.code === "ArrowLeft" ? (y = true, e.press_left(d.shiftKey)) : d.code === "ArrowRight" ? (y = true, e.press_right(d.shiftKey)) : d.code === "Enter" ? (y = true, e.press_enter()) : d.code === "Escape" ? y = e.press_escape() : d.code === "Slash" && (y = true, e.press_slash()), y && (H(true), d.preventDefault());
      }
    }, Y = (d) => {
      let y = false;
      d.shiftKey || (y = true, e.release_shift()), d.code === "KeyQ" ? (y = true, e.release_q()) : d.code === "KeyW" ? (y = true, e.release_w()) : d.code === "KeyA" ? (y = true, e.release_a()) : d.code === "KeyS" ? (y = true, e.release_s()) : d.code === "KeyE" ? (y = true, e.release_e()) : d.code === "KeyD" ? (y = true, e.release_d()) : d.code === "KeyZ" ? (y = true, e.release_z()) : d.code === "KeyC" ? (y = true, e.release_c()) : d.code === "Space" ? (y = true, e.release_space()) : d.code === "AltLeft" && (y = true, e.release_alt_left()), y && (H(false), d.preventDefault());
    };
    document.addEventListener("keydown", Z), document.addEventListener("keyup", Y), be(() => {
      document.removeEventListener("keydown", Z), document.removeEventListener("keyup", Y);
    });
    function H(d) {
      L(e.mode()), n(e.tiles_path()), _(e.selected_tiles_path()), j({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), b(e.show_quarter_grid()), A({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const y = [];
      Pt(T, y, e.entities(), false), Pt(B, y, e.preview_entities(), true), F(y), $(e.selected_tile_outline_path()), M({
        x: e.palette_center_x(),
        y: e.palette_center_y()
      }), J({
        x: e.palette_selection_x(),
        y: e.palette_selection_y()
      }), C(e.past_ninja_bones()), d && lr(e);
    }
    const ee = [];
    for (let d = 0; d < Qe - 1; d++) ee.push(48 + 24 * d);
    const _e = [];
    for (let d = 0; d < et - 1; d++) _e.push(48 + 24 * d);
    const oe = [];
    for (let d = 0; d < Qe; d++) oe.push(36 + 24 * d);
    const ge = [];
    for (let d = 0; d < et; d++) ge.push(36 + 24 * d);
    const Pe = [];
    for (let d = 0; d < Qe * 2; d++) Pe.push(30 + 12 * d);
    const Ee = [];
    for (let d = 0; d < et * 2; d++) Ee.push(30 + 12 * d);
    return H(false), [
      (() => {
        var d = wa(), y = d.firstChild, lt = y.firstChild, X = lt.nextSibling;
        X.nextSibling;
        var te = y.nextSibling, fe = te.nextSibling, ye = fe.nextSibling, de = ye.nextSibling, k = de.firstChild;
        return d.$$contextmenu = (h) => {
          e.press_escape() && (H(false), h.preventDefault());
        }, d.$$mouseup = () => {
          e.cursor_up(), H(false);
        }, d.$$dblclick = (h) => {
          e.double_click(h.shiftKey), H(false);
        }, d.$$mousedown = (h) => {
          h.buttons & 2 || (e.mode() === tt ? t.setReplay(e.to_replay(t.roundCorners())) : (e.cursor_down(h.shiftKey), H(true)));
        }, d.$$mousemove = function(h) {
          const { left: g, top: P, width: I, height: re } = this.getBoundingClientRect(), ue = e.set_cursor_pos((h.clientX - g) / I * 1056, (h.clientY - P) / re * 600, h.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (h.clientX - g) / I * 1056,
            y: (h.clientY - P) / re * 600
          }), ue && H(false);
        }, x(y, u(Ut, {}), X), x(y, u(Ht, {}), X), x(y, u(rr, {}), X), x(y, u(Zt, {}), X), x(y, u(Jt, {}), X), x(y, u(or, {}), X), x(y, u(ir, {}), X), x(y, u(fr, {}), X), x(y, u(hr, {}), X), x(y, u(ca, {}), X), x(d, u(G, {
          get when() {
            return p();
          },
          get children() {
            return [
              $e(() => Pe.map((h) => (() => {
                var g = bt();
                return w(g, "x1", h), w(g, "x2", h), g;
              })())),
              $e(() => Ee.map((h) => (() => {
                var g = xt();
                return w(g, "y1", h), w(g, "y2", h), g;
              })()))
            ];
          }
        }), te), x(d, u(G, {
          get when() {
            return o();
          },
          get children() {
            return [
              $e(() => oe.map((h) => (() => {
                var g = bt();
                return w(g, "x1", h), w(g, "x2", h), g;
              })())),
              $e(() => ge.map((h) => (() => {
                var g = xt();
                return w(g, "y1", h), w(g, "y2", h), g;
              })()))
            ];
          }
        }), te), x(d, () => ee.map((h) => (() => {
          var g = ma();
          return w(g, "x1", h), w(g, "x2", h), g;
        })()), te), x(d, () => _e.map((h) => (() => {
          var g = ba();
          return w(g, "y1", h), w(g, "y2", h), g;
        })()), te), x(d, u(Et, {
          entities: T
        }), te), x(d, u(G, {
          get when() {
            return f() === Dt;
          },
          get children() {
            var h = da();
            return S((g) => {
              var P = D().x - St / 2, I = D().y - St / 2;
              return P !== g.e && w(h, "x", g.e = P), I !== g.t && w(h, "y", g.t = I), g;
            }, {
              e: void 0,
              t: void 0
            }), h;
          }
        }), fe), x(fe, u(Et, {
          entities: B
        })), x(d, u(G, {
          get when() {
            return f() === Dt;
          },
          get children() {
            var h = ua();
            return S((g) => {
              var P = K().x, I = K().y;
              return P !== g.e && w(h, "cx", g.e = P), I !== g.t && w(h, "cy", g.t = I), g;
            }, {
              e: void 0,
              t: void 0
            }), h;
          }
        }), ye), x(d, u(G, {
          get when() {
            return f() === kt;
          },
          get children() {
            var h = pa();
            return S(() => w(h, "transform", `translate(${D().x},${D().y})`)), h;
          }
        }), ye), x(d, u(G, {
          get when() {
            return f() === kt;
          },
          get children() {
            var h = ha();
            return S((g) => {
              var P = K().x - 13, I = K().y - 13;
              return P !== g.e && w(h, "x", g.e = P), I !== g.t && w(h, "y", g.t = I), g;
            }, {
              e: void 0,
              t: void 0
            }), h;
          }
        }), de), x(d, u(_t, {
          get each() {
            return Q();
          },
          children: (h) => (() => {
            var g = xa();
            return S((P) => {
              var I = h.x1, re = h.y1, ue = h.x2, xe = h.y2;
              return I !== P.e && w(g, "x1", P.e = I), re !== P.t && w(g, "y1", P.t = re), ue !== P.a && w(g, "x2", P.a = ue), xe !== P.o && w(g, "y2", P.o = xe), P;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), g;
          })()
        }), de), x(d, u(G, {
          get when() {
            return f() === vt;
          },
          get children() {
            var h = ga();
            return S((g) => {
              var P = E().col * 24 + 12, I = E().row * 24 + 12;
              return P !== g.e && w(h, "x", g.e = P), I !== g.t && w(h, "y", g.t = I), g;
            }, {
              e: void 0,
              t: void 0
            }), h;
          }
        }), null), x(d, u(G, {
          get when() {
            return f() === $a || f() === $t;
          },
          get children() {
            var h = fa();
            return S((g) => {
              var P = N().x, I = N().y;
              return P !== g.e && w(h, "x", g.e = P), I !== g.t && w(h, "y", g.t = I), g;
            }, {
              e: void 0,
              t: void 0
            }), h;
          }
        }), null), x(d, u(G, {
          get when() {
            return f() === tt;
          },
          get children() {
            return u(Ve, {
              class: "ninja",
              ninja: () => ({
                x: N().x,
                y: N().y,
                deg: 0
              }),
              bones: () => ce() ?? Ha
            });
          }
        }), null), x(d, u(G, {
          get when() {
            return ie();
          },
          get children() {
            var h = ya();
            return S(() => w(h, "points", r().map(({ x: g, y: P }) => `${g},${P}`).join(" "))), h;
          }
        }), null), S((h) => {
          var g = s(), P = [
            va,
            $t,
            ka
          ].includes(f()) ? "url(#outline)" : "", I = i(), re = O();
          return g !== h.e && w(te, "d", h.e = g), P !== h.t && w(fe, "filter", h.t = P), I !== h.a && w(ye, "d", h.a = I), re !== h.o && w(k, "d", h.o = re), h;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), d;
      })(),
      u(Zl, {
        editor: e,
        render: H,
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
        showTrail: ie,
        setShowTrail: le
      })
    ];
  }
  Fe([
    "mousemove",
    "mousedown",
    "dblclick",
    "mouseup",
    "contextmenu"
  ]);
  var Ua = v("<div id=media-controls><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb>");
  function Va(t) {
    const e = () => {
      const o = t.progress(), c = t.length();
      return c === 0 || o >= c ? "100%" : `${o / c * 100}%`;
    }, r = () => {
      const o = t.progress(), c = t.previewProgress(), p = t.length();
      if (c === void 0 || p === 0) return {
        left: "0%",
        width: "0%"
      };
      const b = Math.min(o, c), f = Math.min(Math.max(o, c), p);
      return {
        left: `${b / p * 100}%`,
        width: `${(f - b) / p * 100}%`
      };
    };
    let s;
    document.addEventListener("mousemove", i), be(() => document.removeEventListener("mousemove", i)), document.addEventListener("mouseup", _), be(() => document.removeEventListener("mouseup", _));
    function n(o) {
      if (s) {
        const { left: c, top: p, width: b } = s.getBoundingClientRect();
        let f = (o.clientX - c) / b;
        f = Math.min(1, f), f = Math.max(0, f);
        let L = Math.abs(o.clientY - p);
        return {
          targetFrame: Math.round(f * t.length()),
          strength: Math.pow(Math.E, -5 * L / b)
        };
      } else return {
        targetFrame: 0,
        strength: 0
      };
    }
    function i(o) {
      if (s) {
        const c = t.dragStart();
        if (c !== void 0) {
          const { targetFrame: p, strength: b } = n(o);
          t.seek(Math.round(c + (p - c) * b)), t.previewSeek(void 0);
        } else s.matches(":hover") ? t.previewSeek(n(o).targetFrame) : t.previewSeek(void 0);
      }
    }
    function _() {
      t.setDragStart(void 0);
    }
    return (() => {
      var o = Ua(), c = o.firstChild, p = c.firstChild, b = c.nextSibling, f = b.firstChild, L = f.nextSibling, E = L.nextSibling, j = E.nextSibling;
      c.$$click = () => {
        t.isPlaying() ? t.setIsPlaying(false) : (t.progress() >= t.length() && t.seek(0), t.setIsPlaying(true));
      }, x(p, u(Er, {
        get children() {
          return [
            u(at, {
              get when() {
                return !t.isPlaying();
              },
              children: "\u25B6"
            }),
            u(at, {
              get when() {
                return t.isPlaying();
              },
              children: "\u23F8"
            })
          ];
        }
      })), b.$$mousedown = (A) => {
        t.setDragStart(n(A).targetFrame), i(A), A.preventDefault();
      };
      var N = s;
      return typeof N == "function" ? Cr(N, b) : s = b, S((A) => {
        var O = e(), $ = r().left, D = r().width, M = e();
        return O !== A.e && Be(L, "width", A.e = O), $ !== A.t && Be(E, "left", A.t = $), D !== A.a && Be(E, "width", A.a = D), M !== A.o && Be(j, "left", A.o = M), A;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), o;
    })();
  }
  Fe([
    "click",
    "mousedown"
  ]);
  var Wa = v('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), Fa = v("<div>");
  function Za(t) {
    const e = t.replay, [r, s] = m(true), [n, i] = m(true), [_, o] = m(void 0), [c, p] = m(0), [b, f] = m(0), [L, E] = m(void 0), j = (k) => {
      k.code === "Enter" ? (e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), n() || de(1)) : k.code === "Escape" && (n() ? (i(false), s(false)) : (i(true), s(true)));
    };
    document.addEventListener("keydown", j), be(() => {
      document.removeEventListener("keydown", j);
    });
    const N = () => e.tiles_path(), [A, O] = m({
      x: -50,
      y: -50,
      deg: 0
    }), [$, D] = m({
      x: -50,
      y: -50,
      deg: 0
    }), [M, K] = m(), [J, T] = m(), B = m([]), Q = m([]), F = m([]), ie = m([]), le = m([]), ce = m([]), C = m([]), Z = m([]), Y = m([]), H = m([]), ee = m([]), _e = m([]), oe = m([]), ge = m([]), Pe = m([]), Ee = m([]), d = m([]);
    let y = performance.now();
    const X = 1e3 / 60;
    let te = 0, fe = 0;
    function ye() {
      const k = performance.now(), h = Math.min(k - y, 250);
      y = k;
      let g = 1;
      const P = e;
      if (n() && _() === void 0) {
        if (r() || b() < c()) {
          for (te += h; te >= X; ) {
            if (r()) {
              let { isJump1Pressed: I, isJump2Pressed: re, isRightPressed: ue, isLeftPressed: xe, isSuicidePressed: yr } = t.globalEventState;
              P.set_input(I() || re(), ue(), xe(), yr());
            }
            P.tick(), te -= X;
          }
          g = te / X, f(P.progress());
        } else b() < c() ? (P.tick(), f(P.progress())) : i(false);
        de(g);
      }
      fe = requestAnimationFrame(ye);
    }
    ye(), be(() => {
      cancelAnimationFrame(fe);
    });
    function de(k) {
      O({
        x: e.ninja_x(k),
        y: e.ninja_y(k),
        deg: 0
      }), D({
        x: e.ninja_preview_x(k),
        y: e.ninja_preview_y(k),
        deg: 0
      }), K(e.ninja_bones(k)), L() === void 0 ? T(void 0) : T(e.ninja_preview_bones(k)), w_(B, e), yl(Q, e, k), a_(F, e), vl(ie, e, k), Tl(le, e, k), il(ce, e), dl(C, e, k), M_(Z, e, k), G_(Y, e), W_(H, e, k), rl(ee, e), $_(_e, e, k), Cl(oe, e, k), Xi(ge, e, k), s_(Pe, e, k), ea(Ee, e, k), na(d, e, k), p(e.replay_length());
    }
    return [
      (() => {
        var k = Wa(), h = k.firstChild;
        h.firstChild;
        var g = h.nextSibling;
        return k.$$mousemove = function(P) {
          const { left: I, top: re, width: ue, height: xe } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (P.clientX - I) / ue * 1056,
            y: (P.clientY - re) / xe * 600
          });
        }, x(h, u(Ut, {}), null), x(h, u(rr, {}), null), x(h, u(Ht, {}), null), x(h, u(Zt, {}), null), x(h, u(Jt, {}), null), x(h, u(or, {}), null), x(h, u(ir, {}), null), x(h, u(fr, {}), null), x(h, u(hr, {}), null), x(h, u(Qi, {}), null), x(k, u(Kt, {
          get exitDoors() {
            return ge[0];
          }
        }), g), x(k, u(Gt, {
          get oneWays() {
            return F[0];
          }
        }), g), x(k, u(qt, {
          get mines() {
            return B[0];
          }
        }), g), x(k, u(Vt, {
          get regularDoors() {
            return _e[0];
          }
        }), g), x(k, u(Wt, {
          get lockedDoors() {
            return Z[0];
          }
        }), g), x(k, u(Yt, {
          get trapDoors() {
            return H[0];
          }
        }), g), x(k, u(Ft, {
          get lockedSwitches() {
            return Y[0];
          }
        }), g), x(k, u(Xt, {
          get trapSwitches() {
            return ee[0];
          }
        }), g), x(k, u(zt, {
          get exitSwitches() {
            return Pe[0];
          }
        }), g), x(k, u(Qt, {
          get launchPads() {
            return ce[0];
          }
        }), g), x(k, u(gr, {
          get chaingunDrones() {
            return d[0];
          }
        }), g), x(k, u(pr, {
          get zapDrones() {
            return Ee[0];
          }
        }), g), x(k, u(er, {
          get floorGuards() {
            return C[0];
          }
        }), g), x(k, u(nr, {
          get thwumps() {
            return le[0];
          }
        }), g), x(k, u(Ve, {
          class: "ninja preview",
          ninja: $,
          bones: J
        }), g), x(k, u(Ve, {
          class: "ninja",
          ninja: A,
          bones: M
        }), g), x(k, u(tr, {
          get bounceBlocks() {
            return Q[0];
          }
        }), g), x(k, u(_r, {
          get shoveThwumps() {
            return oe[0];
          }
        }), g), x(k, u(sr, {
          get boostPads() {
            return ie[0];
          }
        }), g), S(() => w(g, "d", N())), k;
      })(),
      (() => {
        var k = Fa();
        return x(k, u(G, {
          get when() {
            return !r() || !n();
          },
          get children() {
            return u(Va, {
              isPlaying: n,
              setIsPlaying: i,
              dragStart: _,
              setDragStart: o,
              length: c,
              progress: b,
              previewProgress: L,
              seek: (h) => {
                f(h), e.seek(h), de(1);
              },
              previewSeek: (h) => {
                E(h), e && (h !== void 0 && _() === void 0 && e.seek_preview(h), de(1));
              }
            });
          }
        })), k;
      })()
    ];
  }
  Fe([
    "mousemove"
  ]);
  var Ya = v("<p>Invalid file."), Xa = v("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file><dl><dt>Windows</dt><dd>C:\\Program Files (x86)\\Steam\\steamapps\\common\\N++\\anim_data_line_new.txt.bin</dd><dt>Linux</dt><dd>~/.steam/steam/steamapps/common/N++/anim_data_line_new.txt.bin</dd><dt>Mac</dt><dd>~/Library/Application Support/Steam/steamapps/common/N++/N++.app/Contents/Resources/NPP/anim_data_line_new.txt.bin");
  function Ja() {
    const t = Te.new(), [e, r] = m(), [s, n] = m(""), [i, _] = m(false), [o, c] = m([]);
    function p() {
      const C = [], Z = t.past_ninjas_len();
      for (let Y = 0; Y < Z; Y++) C.push({
        x: t.past_ninja_x(Y),
        y: t.past_ninja_y(Y)
      });
      c(C);
    }
    const [b, f] = m(false), [L, E] = m(false), [j, N] = m(false), [A, O] = m(false), [$, D] = m(false), [M, K] = m({
      x: 36,
      y: 36
    }), J = {
      isJump1Pressed: b,
      isJump2Pressed: L,
      isRightPressed: j,
      isLeftPressed: A,
      isSuicidePressed: $,
      mouseGamePos: M,
      setMouseGamePos: K
    };
    jl(t), n(t.get_level_name()), document.addEventListener("keydown", (C) => {
      if (!(C.ctrlKey || C.metaKey)) if (C.code === "Tab") {
        const Z = e();
        Z ? (r(void 0), Z.send_past_ninjas(), t.receive_past_ninjas(), Z.free(), p()) : r(t.to_replay(i())), C.preventDefault();
      } else C.code === "KeyZ" ? f(true) : C.code === "ArrowUp" ? E(true) : C.code === "ArrowRight" ? N(true) : C.code === "ArrowLeft" ? O(true) : C.code === "KeyV" && D(true);
    }), document.addEventListener("keyup", (C) => {
      C.code === "KeyZ" ? f(false) : C.code === "ArrowUp" ? E(false) : C.code === "ArrowRight" ? N(false) : C.code === "ArrowLeft" ? O(false) : C.code === "KeyV" && D(false);
    }), document.addEventListener("blur", () => {
      f(false), E(false), N(false), O(false), D(false);
    }), Bl(t);
    const T = 0, B = 1, Q = 2, [F, ie] = m(t.get_anim_state() == T ? T : Q);
    ql();
    const [le, ce] = m(Rl());
    return xr(() => {
      const C = le();
      C && (Vl(C.colors), Il(C));
    }), [
      u(G, {
        get when() {
          return F() != T;
        },
        get children() {
          var C = Xa(), Z = C.firstChild, Y = Z.nextSibling;
          return Y.nextSibling, Y.addEventListener("change", function() {
            const H = this.files;
            if (H && H.length > 0) {
              const ee = new FileReader();
              ee.onloadend = () => {
                if (ee.result instanceof ArrayBuffer) {
                  const _e = new Uint8Array(ee.result);
                  try {
                    try {
                      Nl(_e);
                    } catch (oe) {
                      console.error(oe);
                    }
                    t.set_anim_data(_e), ie(t.get_anim_state());
                  } catch (oe) {
                    console.error(oe), ie(B);
                  }
                }
              }, ee.readAsArrayBuffer(H[0]);
            }
          }), x(C, u(G, {
            get when() {
              return F() == B;
            },
            get children() {
              return Ya();
            }
          }), null), C;
        }
      }),
      u(G, {
        get when() {
          return $e(() => F() == T)() && !e();
        },
        get children() {
          return u(qa, {
            editor: t,
            setReplay: r,
            pastNinjas: o,
            globalEventState: J,
            levelName: s,
            setLevelName: n,
            roundCorners: i,
            setRoundCorners: _,
            palette: le,
            setPalette: ce
          });
        }
      }),
      u(G, {
        get when() {
          return $e(() => F() == T)() && !!e();
        },
        keyed: true,
        get children() {
          return u(Za, {
            get replay() {
              return e();
            },
            globalEventState: J
          });
        }
      })
    ];
  }
  const Qa = document.getElementById("root");
  Ar(() => u(Ja, {}), Qa);
})();
