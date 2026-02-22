(async () => {
  (function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const o of document.querySelectorAll('link[rel="modulepreload"]')) s(o);
    new MutationObserver((o) => {
      for (const i of o) if (i.type === "childList") for (const _ of i.addedNodes) _.tagName === "LINK" && _.rel === "modulepreload" && s(_);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function r(o) {
      const i = {};
      return o.integrity && (i.integrity = o.integrity), o.referrerPolicy && (i.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? i.credentials = "include" : o.crossOrigin === "anonymous" ? i.credentials = "omit" : i.credentials = "same-origin", i;
    }
    function s(o) {
      if (o.ep) return;
      o.ep = true;
      const i = r(o);
      fetch(o.href, i);
    }
  })();
  const Sr = false, Tr = (t, e) => t === e, Mt = Symbol("solid-track"), He = {
    equals: Tr
  };
  let jt = Ot;
  const he = 1, ze = 2, Nt = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var V = null;
  let Je = null, Lr = null, H = null, Y = null, ae = null, Ze = 0;
  function Se(t, e) {
    const r = H, s = V, o = t.length === 0, i = e === void 0 ? s : e, _ = o ? Nt : {
      owned: null,
      cleanups: null,
      context: i ? i.context : null,
      owner: i
    }, n = o ? t : () => t(() => oe(() => Ee(_)));
    V = _, H = null;
    try {
      return je(n, true);
    } finally {
      H = r, V = s;
    }
  }
  function w(t, e) {
    e = e ? Object.assign({}, He, e) : He;
    const r = {
      value: t,
      observers: null,
      observerSlots: null,
      comparator: e.equals || void 0
    }, s = (o) => (typeof o == "function" && (o = o(r.value)), It(r, o));
    return [
      Bt.bind(r),
      s
    ];
  }
  function S(t, e, r) {
    const s = ct(t, e, false, he);
    Me(s);
  }
  function Pr(t, e, r) {
    jt = Mr;
    const s = ct(t, e, false, he);
    s.user = true, ae ? ae.push(s) : Me(s);
  }
  function se(t, e, r) {
    r = r ? Object.assign({}, He, r) : He;
    const s = ct(t, e, true, 0);
    return s.observers = null, s.observerSlots = null, s.comparator = r.equals || void 0, Me(s), Bt.bind(s);
  }
  function oe(t) {
    if (H === null) return t();
    const e = H;
    H = null;
    try {
      return t();
    } finally {
      H = e;
    }
  }
  function be(t) {
    return V === null || (V.cleanups === null ? V.cleanups = [
      t
    ] : V.cleanups.push(t)), t;
  }
  function Er(t) {
    const e = se(t), r = se(() => it(e()));
    return r.toArray = () => {
      const s = r();
      return Array.isArray(s) ? s : s != null ? [
        s
      ] : [];
    }, r;
  }
  function Bt() {
    if (this.sources && this.state) if (this.state === he) Me(this);
    else {
      const t = Y;
      Y = null, je(() => Ve(this), false), Y = t;
    }
    if (H) {
      const t = this.observers ? this.observers.length : 0;
      H.sources ? (H.sources.push(this), H.sourceSlots.push(t)) : (H.sources = [
        this
      ], H.sourceSlots = [
        t
      ]), this.observers ? (this.observers.push(H), this.observerSlots.push(H.sources.length - 1)) : (this.observers = [
        H
      ], this.observerSlots = [
        H.sources.length - 1
      ]);
    }
    return this.value;
  }
  function It(t, e, r) {
    let s = t.value;
    return (!t.comparator || !t.comparator(s, e)) && (t.value = e, t.observers && t.observers.length && je(() => {
      for (let o = 0; o < t.observers.length; o += 1) {
        const i = t.observers[o], _ = Je && Je.running;
        _ && Je.disposed.has(i), (_ ? !i.tState : !i.state) && (i.pure ? Y.push(i) : ae.push(i), i.observers && Rt(i)), _ || (i.state = he);
      }
      if (Y.length > 1e6) throw Y = [], new Error();
    }, false)), e;
  }
  function Me(t) {
    if (!t.fn) return;
    Ee(t);
    const e = Ze;
    Cr(t, t.value, e);
  }
  function Cr(t, e, r) {
    let s;
    const o = V, i = H;
    H = V = t;
    try {
      s = t.fn(e);
    } catch (_) {
      return t.pure && (t.state = he, t.owned && t.owned.forEach(Ee), t.owned = null), t.updatedAt = r + 1, Kt(_);
    } finally {
      H = i, V = o;
    }
    (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? It(t, s) : t.value = s, t.updatedAt = r);
  }
  function ct(t, e, r, s = he, o) {
    const i = {
      fn: t,
      state: s,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: e,
      owner: V,
      context: V ? V.context : null,
      pure: r
    };
    return V === null || V !== Nt && (V.owned ? V.owned.push(i) : V.owned = [
      i
    ]), i;
  }
  function Ge(t) {
    if (t.state === 0) return;
    if (t.state === ze) return Ve(t);
    if (t.suspense && oe(t.suspense.inFallback)) return t.suspense.effects.push(t);
    const e = [
      t
    ];
    for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < Ze); ) t.state && e.push(t);
    for (let r = e.length - 1; r >= 0; r--) if (t = e[r], t.state === he) Me(t);
    else if (t.state === ze) {
      const s = Y;
      Y = null, je(() => Ve(t, e[0]), false), Y = s;
    }
  }
  function je(t, e) {
    if (Y) return t();
    let r = false;
    e || (Y = []), ae ? r = true : ae = [], Ze++;
    try {
      const s = t();
      return Ar(r), s;
    } catch (s) {
      r || (ae = null), Y = null, Kt(s);
    }
  }
  function Ar(t) {
    if (Y && (Ot(Y), Y = null), t) return;
    const e = ae;
    ae = null, e.length && je(() => jt(e), false);
  }
  function Ot(t) {
    for (let e = 0; e < t.length; e++) Ge(t[e]);
  }
  function Mr(t) {
    let e, r = 0;
    for (e = 0; e < t.length; e++) {
      const s = t[e];
      s.user ? t[r++] = s : Ge(s);
    }
    for (e = 0; e < r; e++) Ge(t[e]);
  }
  function Ve(t, e) {
    t.state = 0;
    for (let r = 0; r < t.sources.length; r += 1) {
      const s = t.sources[r];
      if (s.sources) {
        const o = s.state;
        o === he ? s !== e && (!s.updatedAt || s.updatedAt < Ze) && Ge(s) : o === ze && Ve(s, e);
      }
    }
  }
  function Rt(t) {
    for (let e = 0; e < t.observers.length; e += 1) {
      const r = t.observers[e];
      r.state || (r.state = ze, r.pure ? Y.push(r) : ae.push(r), r.observers && Rt(r));
    }
  }
  function Ee(t) {
    let e;
    if (t.sources) for (; t.sources.length; ) {
      const r = t.sources.pop(), s = t.sourceSlots.pop(), o = r.observers;
      if (o && o.length) {
        const i = o.pop(), _ = r.observerSlots.pop();
        s < o.length && (i.sourceSlots[_] = s, o[s] = i, r.observerSlots[s] = _);
      }
    }
    if (t.tOwned) {
      for (e = t.tOwned.length - 1; e >= 0; e--) Ee(t.tOwned[e]);
      delete t.tOwned;
    }
    if (t.owned) {
      for (e = t.owned.length - 1; e >= 0; e--) Ee(t.owned[e]);
      t.owned = null;
    }
    if (t.cleanups) {
      for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
      t.cleanups = null;
    }
    t.state = 0;
  }
  function jr(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function Kt(t, e = V) {
    throw jr(t);
  }
  function it(t) {
    if (typeof t == "function" && !t.length) return it(t());
    if (Array.isArray(t)) {
      const e = [];
      for (let r = 0; r < t.length; r++) {
        const s = it(t[r]);
        Array.isArray(s) ? e.push.apply(e, s) : e.push(s);
      }
      return e;
    }
    return t;
  }
  const _t = Symbol("fallback");
  function qe(t) {
    for (let e = 0; e < t.length; e++) t[e]();
  }
  function Nr(t, e, r = {}) {
    let s = [], o = [], i = [], _ = 0, n = e.length > 1 ? [] : null;
    return be(() => qe(i)), () => {
      let c = t() || [], h = c.length, v, f;
      return c[Mt], oe(() => {
        let P, N, B, A, O, $, T, j, K;
        if (h === 0) _ !== 0 && (qe(i), i = [], s = [], o = [], _ = 0, n && (n = [])), r.fallback && (s = [
          _t
        ], o[0] = Se((te) => (i[0] = te, r.fallback())), _ = 1);
        else if (_ === 0) {
          for (o = new Array(h), f = 0; f < h; f++) s[f] = c[f], o[f] = Se(C);
          _ = h;
        } else {
          for (B = new Array(h), A = new Array(h), n && (O = new Array(h)), $ = 0, T = Math.min(_, h); $ < T && s[$] === c[$]; $++) ;
          for (T = _ - 1, j = h - 1; T >= $ && j >= $ && s[T] === c[j]; T--, j--) B[j] = o[T], A[j] = i[T], n && (O[j] = n[T]);
          for (P = /* @__PURE__ */ new Map(), N = new Array(j + 1), f = j; f >= $; f--) K = c[f], v = P.get(K), N[f] = v === void 0 ? -1 : v, P.set(K, f);
          for (v = $; v <= T; v++) K = s[v], f = P.get(K), f !== void 0 && f !== -1 ? (B[f] = o[v], A[f] = i[v], n && (O[f] = n[v]), f = N[f], P.set(K, f)) : i[v]();
          for (f = $; f < h; f++) f in B ? (o[f] = B[f], i[f] = A[f], n && (n[f] = O[f], n[f](f))) : o[f] = Se(C);
          o = o.slice(0, _ = h), s = c.slice(0);
        }
        return o;
      });
      function C(P) {
        if (i[f] = P, n) {
          const [N, B] = w(f);
          return n[f] = B, e(c[f], N);
        }
        return e(c[f]);
      }
    };
  }
  function Br(t, e, r = {}) {
    let s = [], o = [], i = [], _ = [], n = 0, c;
    return be(() => qe(i)), () => {
      const h = t() || [], v = h.length;
      return h[Mt], oe(() => {
        if (v === 0) return n !== 0 && (qe(i), i = [], s = [], o = [], n = 0, _ = []), r.fallback && (s = [
          _t
        ], o[0] = Se((C) => (i[0] = C, r.fallback())), n = 1), o;
        for (s[0] === _t && (i[0](), i = [], s = [], o = [], n = 0), c = 0; c < v; c++) c < s.length && s[c] !== h[c] ? _[c](() => h[c]) : c >= s.length && (o[c] = Se(f));
        for (; c < s.length; c++) i[c]();
        return n = _.length = i.length = v, s = h.slice(0), o = o.slice(0, n);
      });
      function f(C) {
        i[c] = C;
        const [P, N] = w(h[c]);
        return _[c] = N, e(P, c);
      }
    };
  }
  function u(t, e) {
    return oe(() => t(e || {}));
  }
  const Ht = (t) => `Stale read from <${t}>.`;
  function dt(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return se(Nr(() => t.each, t.children, e || void 0));
  }
  function z(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return se(Br(() => t.each, t.children, e || void 0));
  }
  function I(t) {
    const e = t.keyed, r = se(() => t.when, void 0, void 0), s = e ? r : se(r, void 0, {
      equals: (o, i) => !o == !i
    });
    return se(() => {
      const o = s();
      if (o) {
        const i = t.children;
        return typeof i == "function" && i.length > 0 ? oe(() => i(e ? o : () => {
          if (!oe(s)) throw Ht("Show");
          return r();
        })) : i;
      }
      return t.fallback;
    }, void 0, void 0);
  }
  function Ir(t) {
    const e = Er(() => t.children), r = se(() => {
      const s = e(), o = Array.isArray(s) ? s : [
        s
      ];
      let i = () => {
      };
      for (let _ = 0; _ < o.length; _++) {
        const n = _, c = o[_], h = i, v = se(() => h() ? void 0 : c.when, void 0, void 0), f = c.keyed ? v : se(v, void 0, {
          equals: (C, P) => !C == !P
        });
        i = () => h() || (f() ? [
          n,
          v,
          c
        ] : void 0);
      }
      return i;
    });
    return se(() => {
      const s = r()();
      if (!s) return t.fallback;
      const [o, i, _] = s, n = _.children;
      return typeof n == "function" && n.length > 0 ? oe(() => n(_.keyed ? i() : () => {
        var _a2;
        if (((_a2 = oe(r)()) == null ? void 0 : _a2[0]) !== o) throw Ht("Match");
        return i();
      })) : n;
    }, void 0, void 0);
  }
  function ut(t) {
    return t;
  }
  const De = (t) => se(() => t());
  function Or(t, e, r) {
    let s = r.length, o = e.length, i = s, _ = 0, n = 0, c = e[o - 1].nextSibling, h = null;
    for (; _ < o || n < i; ) {
      if (e[_] === r[n]) {
        _++, n++;
        continue;
      }
      for (; e[o - 1] === r[i - 1]; ) o--, i--;
      if (o === _) {
        const v = i < s ? n ? r[n - 1].nextSibling : r[i - n] : c;
        for (; n < i; ) t.insertBefore(r[n++], v);
      } else if (i === n) for (; _ < o; ) (!h || !h.has(e[_])) && e[_].remove(), _++;
      else if (e[_] === r[i - 1] && r[n] === e[o - 1]) {
        const v = e[--o].nextSibling;
        t.insertBefore(r[n++], e[_++].nextSibling), t.insertBefore(r[--i], v), e[o] = r[i];
      } else {
        if (!h) {
          h = /* @__PURE__ */ new Map();
          let f = n;
          for (; f < i; ) h.set(r[f], f++);
        }
        const v = h.get(e[_]);
        if (v != null) if (n < v && v < i) {
          let f = _, C = 1, P;
          for (; ++f < o && f < i && !((P = h.get(e[f])) == null || P !== v + C); ) C++;
          if (C > v - n) {
            const N = e[_];
            for (; n < v; ) t.insertBefore(r[n++], N);
          } else t.replaceChild(r[n++], e[_++]);
        } else _++;
        else e[_++].remove();
      }
    }
  }
  const pt = "_$DX_DELEGATE";
  function Rr(t, e, r, s = {}) {
    let o;
    return Se((i) => {
      o = i, e === document ? t() : b(e, t(), e.firstChild ? null : void 0, r);
    }, s.owner), () => {
      o(), e.textContent = "";
    };
  }
  function x(t, e, r, s) {
    let o;
    const i = () => {
      const n = s ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
      return n.innerHTML = t, r ? n.content.firstChild.firstChild : s ? n.firstChild : n.content.firstChild;
    }, _ = e ? () => oe(() => document.importNode(o || (o = i()), true)) : () => (o || (o = i())).cloneNode(true);
    return _.cloneNode = _, _;
  }
  function Fe(t, e = window.document) {
    const r = e[pt] || (e[pt] = /* @__PURE__ */ new Set());
    for (let s = 0, o = t.length; s < o; s++) {
      const i = t[s];
      r.has(i) || (r.add(i), e.addEventListener(i, Hr));
    }
  }
  function y(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function Ie(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function Kr(t, e, r) {
    return oe(() => t(e, r));
  }
  function b(t, e, r, s) {
    if (r !== void 0 && !s && (s = []), typeof e != "function") return Ue(t, e, s, r);
    S((o) => Ue(t, e(), o, r), s);
  }
  function Hr(t) {
    let e = t.target;
    const r = `$$${t.type}`, s = t.target, o = t.currentTarget, i = (c) => Object.defineProperty(t, "target", {
      configurable: true,
      value: c
    }), _ = () => {
      const c = e[r];
      if (c && !e.disabled) {
        const h = e[`${r}Data`];
        if (h !== void 0 ? c.call(e, h, t) : c.call(e, t), t.cancelBubble) return;
      }
      return e.host && typeof e.host != "string" && !e.host._$host && e.contains(t.target) && i(e.host), true;
    }, n = () => {
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
      for (let h = 0; h < c.length - 2 && (e = c[h], !!_()); h++) {
        if (e._$host) {
          e = e._$host, n();
          break;
        }
        if (e.parentNode === o) break;
      }
    } else n();
    i(s);
  }
  function Ue(t, e, r, s, o) {
    for (; typeof r == "function"; ) r = r();
    if (e === r) return r;
    const i = typeof e, _ = s !== void 0;
    if (t = _ && r[0] && r[0].parentNode || t, i === "string" || i === "number") {
      if (i === "number" && (e = e.toString(), e === r)) return r;
      if (_) {
        let n = r[0];
        n && n.nodeType === 3 ? n.data !== e && (n.data = e) : n = document.createTextNode(e), r = ke(t, r, s, n);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || i === "boolean") r = ke(t, r, s);
    else {
      if (i === "function") return S(() => {
        let n = e();
        for (; typeof n == "function"; ) n = n();
        r = Ue(t, n, r, s);
      }), () => r;
      if (Array.isArray(e)) {
        const n = [], c = r && Array.isArray(r);
        if (lt(n, e, r, o)) return S(() => r = Ue(t, n, r, s, true)), () => r;
        if (n.length === 0) {
          if (r = ke(t, r, s), _) return r;
        } else c ? r.length === 0 ? ht(t, n, s) : Or(t, r, n) : (r && ke(t), ht(t, n));
        r = n;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (_) return r = ke(t, r, s, e);
          ke(t, r, null, e);
        } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
        r = e;
      }
    }
    return r;
  }
  function lt(t, e, r, s) {
    let o = false;
    for (let i = 0, _ = e.length; i < _; i++) {
      let n = e[i], c = r && r[t.length], h;
      if (!(n == null || n === true || n === false)) if ((h = typeof n) == "object" && n.nodeType) t.push(n);
      else if (Array.isArray(n)) o = lt(t, n, c) || o;
      else if (h === "function") if (s) {
        for (; typeof n == "function"; ) n = n();
        o = lt(t, Array.isArray(n) ? n : [
          n
        ], Array.isArray(c) ? c : [
          c
        ]) || o;
      } else t.push(n), o = true;
      else {
        const v = String(n);
        c && c.nodeType === 3 && c.data === v ? t.push(c) : t.push(document.createTextNode(v));
      }
    }
    return o;
  }
  function ht(t, e, r = null) {
    for (let s = 0, o = e.length; s < o; s++) t.insertBefore(e[s], r);
  }
  function ke(t, e, r, s) {
    if (r === void 0) return t.textContent = "";
    const o = s || document.createTextNode("");
    if (e.length) {
      let i = false;
      for (let _ = e.length - 1; _ >= 0; _--) {
        const n = e[_];
        if (o !== n) {
          const c = n.parentNode === t;
          !i && !_ ? c ? t.replaceChild(o, n) : t.insertBefore(o, r) : c && n.remove();
        } else i = true;
      }
    } else t.insertBefore(o, r);
    return [
      o
    ];
  }
  const zr = "" + new URL("ntools_rs_bg-zhmdH-wY.wasm", import.meta.url).href, Gr = async (t = {}, e) => {
    let r;
    if (e.startsWith("data:")) {
      const s = e.replace(/^data:.*?base64,/, "");
      let o;
      if (typeof Buffer == "function" && typeof Buffer.from == "function") o = Buffer.from(s, "base64");
      else if (typeof atob == "function") {
        const i = atob(s);
        o = new Uint8Array(i.length);
        for (let _ = 0; _ < i.length; _++) o[_] = i.charCodeAt(_);
      } else throw new Error("Cannot decode base64-encoded data URL");
      r = await WebAssembly.instantiate(o, t);
    } else {
      const s = await fetch(e), o = s.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && o.startsWith("application/wasm")) r = await WebAssembly.instantiateStreaming(s, t);
      else {
        const i = await s.arrayBuffer();
        r = await WebAssembly.instantiate(i, t);
      }
    }
    return r.instance.exports;
  };
  let l;
  function Vr(t) {
    l = t;
  }
  let Oe = null;
  function Te() {
    return (Oe === null || Oe.byteLength === 0) && (Oe = new Uint8Array(l.memory.buffer)), Oe;
  }
  let Ke = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  Ke.decode();
  const qr = 2146435072;
  let Qe = 0;
  function Ur(t, e) {
    return Qe += e, Qe >= qr && (Ke = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), Ke.decode(), Qe = e), Ke.decode(Te().subarray(t, t + e));
  }
  function we(t, e) {
    return t = t >>> 0, Ur(t, e);
  }
  function Wr(t, e) {
    return t = t >>> 0, Te().subarray(t / 1, t / 1 + e);
  }
  let me = 0;
  function et(t, e) {
    const r = e(t.length * 1, 1) >>> 0;
    return Te().set(t, r / 1), me = t.length, r;
  }
  function tt(t) {
    const e = l.__wbindgen_externrefs.get(t);
    return l.__externref_table_dealloc(t), e;
  }
  const Pe = new TextEncoder();
  "encodeInto" in Pe || (Pe.encodeInto = function(t, e) {
    const r = Pe.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function Zr(t, e, r) {
    if (r === void 0) {
      const n = Pe.encode(t), c = e(n.length, 1) >>> 0;
      return Te().subarray(c, c + n.length).set(n), me = n.length, c;
    }
    let s = t.length, o = e(s, 1) >>> 0;
    const i = Te();
    let _ = 0;
    for (; _ < s; _++) {
      const n = t.charCodeAt(_);
      if (n > 127) break;
      i[o + _] = n;
    }
    if (_ !== s) {
      _ !== 0 && (t = t.slice(_)), o = r(o, s, s = _ + t.length * 3, 1) >>> 0;
      const n = Te().subarray(o + _, o + s), c = Pe.encodeInto(t, n);
      _ += c.written, o = r(o, s, _, 1) >>> 0;
    }
    return me = _, o;
  }
  let Re = null;
  function Fr() {
    return (Re === null || Re.byteLength === 0) && (Re = new Float64Array(l.memory.buffer)), Re;
  }
  function at(t, e) {
    return t = t >>> 0, Fr().subarray(t / 8, t / 8 + e);
  }
  let $e = null;
  function Yr() {
    return ($e === null || $e.buffer.detached === true || $e.buffer.detached === void 0 && $e.buffer !== l.memory.buffer) && ($e = new DataView(l.memory.buffer)), $e;
  }
  function gt(t, e) {
    t = t >>> 0;
    const r = Yr(), s = [];
    for (let o = t; o < t + 4 * e; o += 4) s.push(l.__wbindgen_externrefs.get(r.getUint32(o, true)));
    return l.__externref_drop_slice(t, e), s;
  }
  const ft = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_editor_free(t >>> 0, 1));
  class Le {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Le.prototype);
      return r.__wbg_ptr = e, ft.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, ft.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      l.__wbg_editor_free(e, 0);
    }
    export_map() {
      const e = l.editor_export_map(this.__wbg_ptr);
      var r = Wr(e[0], e[1]).slice();
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
      const r = et(e, l.__wbindgen_malloc), s = me, o = l.editor_load_attract(this.__wbg_ptr, r, s);
      if (o[1]) throw tt(o[0]);
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
      const r = et(e, l.__wbindgen_malloc), s = me;
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
      const r = Zr(e, l.__wbindgen_malloc, l.__wbindgen_realloc), s = me;
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
      var r = at(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 8, 8), r;
    }
    preview_entities() {
      const e = l.editor_preview_entities(this.__wbg_ptr);
      var r = gt(e[0], e[1]).slice();
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
      return Le.__wrap(e);
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
      l.editor_press_j(this.__wbg_ptr);
    }
    press_k() {
      l.editor_press_k(this.__wbg_ptr);
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
      var r = gt(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    load_map(e) {
      const r = et(e, l.__wbindgen_malloc), s = me, o = l.editor_load_map(this.__wbg_ptr, r, s);
      if (o[1]) throw tt(o[0]);
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
      if (r[2]) throw tt(r[1]);
      return Ae.__wrap(r[0]);
    }
  }
  Symbol.dispose && (Le.prototype[Symbol.dispose] = Le.prototype.free);
  const yt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_exportedentity_free(t >>> 0, 1));
  class Ce {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Ce.prototype);
      return r.__wbg_ptr = e, yt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, yt.unregister(this), e;
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
    get mode() {
      return l.__wbg_get_exportedentity_mode(this.__wbg_ptr);
    }
    set mode(e) {
      l.__wbg_set_exportedentity_mode(this.__wbg_ptr, e);
    }
  }
  Symbol.dispose && (Ce.prototype[Symbol.dispose] = Ce.prototype.free);
  const wt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_replay_free(t >>> 0, 1));
  class Ae {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Ae.prototype);
      return r.__wbg_ptr = e, wt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, wt.unregister(this), e;
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
      var s = at(r[0], r[1]).slice();
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
    chase_drone_x(e, r) {
      return l.replay_chase_drone_x(this.__wbg_ptr, e, r);
    }
    chase_drone_y(e, r) {
      return l.replay_chase_drone_y(this.__wbg_ptr, e, r);
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
    laser_drone_x(e, r) {
      return l.replay_laser_drone_x(this.__wbg_ptr, e, r);
    }
    laser_drone_y(e, r) {
      return l.replay_laser_drone_y(this.__wbg_ptr, e, r);
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
    chase_drone_deg(e) {
      return l.replay_chase_drone_deg(this.__wbg_ptr, e);
    }
    floor_guard_deg(e) {
      return l.replay_floor_guard_deg(this.__wbg_ptr, e);
    }
    laser_drone_deg(e) {
      return l.replay_laser_drone_deg(this.__wbg_ptr, e);
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
    chase_drones_len() {
      return l.replay_chase_drones_len(this.__wbg_ptr) >>> 0;
    }
    floor_guards_len() {
      return l.replay_floor_guards_len(this.__wbg_ptr) >>> 0;
    }
    laser_drones_len() {
      return l.replay_laser_drones_len(this.__wbg_ptr) >>> 0;
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
      var s = at(r[0], r[1]).slice();
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
    set_input(e, r, s, o) {
      l.replay_set_input(this.__wbg_ptr, e, r, s, o);
    }
  }
  Symbol.dispose && (Ae.prototype[Symbol.dispose] = Ae.prototype.free);
  function Xr(t, e) {
    throw new Error(we(t, e));
  }
  function Jr(t) {
    return Ce.__wrap(t);
  }
  function Qr(t, e) {
    return we(t, e);
  }
  function es() {
    const t = l.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const a = await Gr({
    "./ntools_rs_bg.js": {
      __wbg_exportedentity_new: Jr,
      __wbg___wbindgen_throw_b855445ff6a94295: Xr,
      __wbindgen_init_externref_table: es,
      __wbindgen_cast_2241b6af4c4b2941: Qr
    }
  }, zr), ts = a.memory, rs = a.__wbg_editor_free, ss = a.editor_crosshair_x, ns = a.editor_crosshair_y, os = a.editor_cursor_down, is = a.editor_cursor_up, _s = a.editor_double_click, ls = a.editor_entities, as = a.editor_export_map, cs = a.editor_get_anim_state, ds = a.editor_get_level_name, us = a.editor_get_show_trail, ps = a.editor_load_attract, hs = a.editor_load_map, gs = a.editor_mode, fs = a.editor_new, ys = a.editor_palette_center_x, ws = a.editor_palette_center_y, ms = a.editor_palette_selection_x, bs = a.editor_palette_selection_y, xs = a.editor_past_ninja_bones, vs = a.editor_past_ninja_x, ks = a.editor_past_ninja_y, $s = a.editor_past_ninjas_len, Ds = a.editor_press_0, Ss = a.editor_press_1, Ts = a.editor_press_2, Ls = a.editor_press_3, Ps = a.editor_press_4, Es = a.editor_press_5, Cs = a.editor_press_6, As = a.editor_press_7, Ms = a.editor_press_8, js = a.editor_press_9, Ns = a.editor_press_a, Bs = a.editor_press_alt_left, Is = a.editor_press_backtick, Os = a.editor_press_bracket_left, Rs = a.editor_press_bracket_right, Ks = a.editor_press_c, Hs = a.editor_press_comma, zs = a.editor_press_d, Gs = a.editor_press_dash, Vs = a.editor_press_down, qs = a.editor_press_e, Us = a.editor_press_enter, Ws = a.editor_press_equals, Zs = a.editor_press_escape, Fs = a.editor_press_f, Ys = a.editor_press_h, Xs = a.editor_press_i, Js = a.editor_press_j, Qs = a.editor_press_k, en = a.editor_press_l, tn = a.editor_press_left, rn = a.editor_press_m, sn = a.editor_press_n, nn = a.editor_press_num_0, on = a.editor_press_num_3, _n = a.editor_press_num_7, ln = a.editor_press_o, an = a.editor_press_p, cn = a.editor_press_q, dn = a.editor_press_r, un = a.editor_press_right, pn = a.editor_press_s, hn = a.editor_press_shift, gn = a.editor_press_slash, fn = a.editor_press_space, yn = a.editor_press_t, wn = a.editor_press_up, mn = a.editor_press_w, bn = a.editor_press_x, xn = a.editor_press_y, vn = a.editor_press_z, kn = a.editor_preview_entities, $n = a.editor_receive_past_ninjas, Dn = a.editor_redo, Sn = a.editor_release_a, Tn = a.editor_release_alt_left, Ln = a.editor_release_c, Pn = a.editor_release_d, En = a.editor_release_e, Cn = a.editor_release_q, An = a.editor_release_s, Mn = a.editor_release_shift, jn = a.editor_release_space, Nn = a.editor_release_w, Bn = a.editor_release_z, In = a.editor_selected_tile_outline_path, On = a.editor_selected_tiles_path, Rn = a.editor_set_anim_data, Kn = a.editor_set_cursor_pos, Hn = a.editor_set_level_name, zn = a.editor_set_show_trail, Gn = a.editor_show_half_grid, Vn = a.editor_show_quarter_grid, qn = a.editor_tile_crosshair_col, Un = a.editor_tile_crosshair_row, Wn = a.editor_tiles_path, Zn = a.editor_to_replay, Fn = a.editor_undo, Yn = a.__wbg_exportedentity_free, Xn = a.__wbg_get_exportedentity_deg, Jn = a.__wbg_get_exportedentity_mode, Qn = a.__wbg_get_exportedentity_switch_x, eo = a.__wbg_get_exportedentity_switch_y, to = a.__wbg_get_exportedentity_type_int, ro = a.__wbg_get_exportedentity_x, so = a.__wbg_get_exportedentity_y, no = a.__wbg_set_exportedentity_deg, oo = a.__wbg_set_exportedentity_mode, io = a.__wbg_set_exportedentity_switch_x, _o = a.__wbg_set_exportedentity_switch_y, lo = a.__wbg_set_exportedentity_type_int, ao = a.__wbg_set_exportedentity_x, co = a.__wbg_set_exportedentity_y, uo = a.__wbg_replay_free, po = a.replay_boost_pad_anim_progress, ho = a.replay_boost_pad_deg, go = a.replay_boost_pad_x, fo = a.replay_boost_pad_y, yo = a.replay_boost_pads_len, wo = a.replay_bounce_block_deg, mo = a.replay_bounce_block_x, bo = a.replay_bounce_block_y, xo = a.replay_bounce_blocks_len, vo = a.replay_chaingun_drone_deg, ko = a.replay_chaingun_drone_x, $o = a.replay_chaingun_drone_y, Do = a.replay_chaingun_drones_len, So = a.replay_chase_drone_deg, To = a.replay_chase_drone_x, Lo = a.replay_chase_drone_y, Po = a.replay_chase_drones_len, Eo = a.replay_exit_anim_progress, Co = a.replay_exit_door_x, Ao = a.replay_exit_door_y, Mo = a.replay_exit_doors_len, jo = a.replay_exit_switch_x, No = a.replay_exit_switch_y, Bo = a.replay_floor_guard_deg, Io = a.replay_floor_guard_x, Oo = a.replay_floor_guard_y, Ro = a.replay_floor_guards_len, Ko = a.replay_laser_drone_deg, Ho = a.replay_laser_drone_x, zo = a.replay_laser_drone_y, Go = a.replay_laser_drones_len, Vo = a.replay_launch_pad_deg, qo = a.replay_launch_pad_x, Uo = a.replay_launch_pad_y, Wo = a.replay_launch_pads_len, Zo = a.replay_locked_door_anim_progress, Fo = a.replay_locked_door_deg, Yo = a.replay_locked_door_x, Xo = a.replay_locked_door_y, Jo = a.replay_locked_doors_len, Qo = a.replay_locked_switch_x, ei = a.replay_locked_switch_y, ti = a.replay_mine_state, ri = a.replay_mine_x, si = a.replay_mine_y, ni = a.replay_mines_len, oi = a.replay_ninja_bones, ii = a.replay_ninja_preview_bones, _i = a.replay_ninja_preview_x, li = a.replay_ninja_preview_y, ai = a.replay_ninja_x, ci = a.replay_ninja_y, di = a.replay_one_way_deg, ui = a.replay_one_way_x, pi = a.replay_one_way_y, hi = a.replay_one_ways_len, gi = a.replay_place_ninja, fi = a.replay_progress, yi = a.replay_progress_preview, wi = a.replay_regular_door_anim_progress, mi = a.replay_regular_door_deg, bi = a.replay_regular_door_x, xi = a.replay_regular_door_y, vi = a.replay_regular_doors_len, ki = a.replay_replay_length, $i = a.replay_seek, Di = a.replay_seek_preview, Si = a.replay_send_past_ninjas, Ti = a.replay_set_input, Li = a.replay_shove_thwump_deg, Pi = a.replay_shove_thwump_touch, Ei = a.replay_shove_thwump_x, Ci = a.replay_shove_thwump_y, Ai = a.replay_shove_thwumps_len, Mi = a.replay_thwump_deg, ji = a.replay_thwump_x, Ni = a.replay_thwump_y, Bi = a.replay_thwumps_len, Ii = a.replay_tick, Oi = a.replay_tiles_path, Ri = a.replay_trap_door_anim_progress, Ki = a.replay_trap_door_deg, Hi = a.replay_trap_door_x, zi = a.replay_trap_door_y, Gi = a.replay_trap_doors_len, Vi = a.replay_trap_switch_x, qi = a.replay_trap_switch_y, Ui = a.replay_zap_drone_deg, Wi = a.replay_zap_drone_x, Zi = a.replay_zap_drone_y, Fi = a.replay_zap_drones_len, Yi = a.editor_press_num_1, Xi = a.editor_press_num_2, Ji = a.editor_press_num_4, Qi = a.editor_press_num_5, e_ = a.editor_press_u, t_ = a.__wbindgen_externrefs, r_ = a.__wbindgen_free, s_ = a.__wbindgen_malloc, n_ = a.__externref_table_dealloc, o_ = a.__wbindgen_realloc, i_ = a.__externref_drop_slice, zt = a.__wbindgen_start, __ = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: i_,
    __externref_table_dealloc: n_,
    __wbg_editor_free: rs,
    __wbg_exportedentity_free: Yn,
    __wbg_get_exportedentity_deg: Xn,
    __wbg_get_exportedentity_mode: Jn,
    __wbg_get_exportedentity_switch_x: Qn,
    __wbg_get_exportedentity_switch_y: eo,
    __wbg_get_exportedentity_type_int: to,
    __wbg_get_exportedentity_x: ro,
    __wbg_get_exportedentity_y: so,
    __wbg_replay_free: uo,
    __wbg_set_exportedentity_deg: no,
    __wbg_set_exportedentity_mode: oo,
    __wbg_set_exportedentity_switch_x: io,
    __wbg_set_exportedentity_switch_y: _o,
    __wbg_set_exportedentity_type_int: lo,
    __wbg_set_exportedentity_x: ao,
    __wbg_set_exportedentity_y: co,
    __wbindgen_externrefs: t_,
    __wbindgen_free: r_,
    __wbindgen_malloc: s_,
    __wbindgen_realloc: o_,
    __wbindgen_start: zt,
    editor_crosshair_x: ss,
    editor_crosshair_y: ns,
    editor_cursor_down: os,
    editor_cursor_up: is,
    editor_double_click: _s,
    editor_entities: ls,
    editor_export_map: as,
    editor_get_anim_state: cs,
    editor_get_level_name: ds,
    editor_get_show_trail: us,
    editor_load_attract: ps,
    editor_load_map: hs,
    editor_mode: gs,
    editor_new: fs,
    editor_palette_center_x: ys,
    editor_palette_center_y: ws,
    editor_palette_selection_x: ms,
    editor_palette_selection_y: bs,
    editor_past_ninja_bones: xs,
    editor_past_ninja_x: vs,
    editor_past_ninja_y: ks,
    editor_past_ninjas_len: $s,
    editor_press_0: Ds,
    editor_press_1: Ss,
    editor_press_2: Ts,
    editor_press_3: Ls,
    editor_press_4: Ps,
    editor_press_5: Es,
    editor_press_6: Cs,
    editor_press_7: As,
    editor_press_8: Ms,
    editor_press_9: js,
    editor_press_a: Ns,
    editor_press_alt_left: Bs,
    editor_press_backtick: Is,
    editor_press_bracket_left: Os,
    editor_press_bracket_right: Rs,
    editor_press_c: Ks,
    editor_press_comma: Hs,
    editor_press_d: zs,
    editor_press_dash: Gs,
    editor_press_down: Vs,
    editor_press_e: qs,
    editor_press_enter: Us,
    editor_press_equals: Ws,
    editor_press_escape: Zs,
    editor_press_f: Fs,
    editor_press_h: Ys,
    editor_press_i: Xs,
    editor_press_j: Js,
    editor_press_k: Qs,
    editor_press_l: en,
    editor_press_left: tn,
    editor_press_m: rn,
    editor_press_n: sn,
    editor_press_num_0: nn,
    editor_press_num_1: Yi,
    editor_press_num_2: Xi,
    editor_press_num_3: on,
    editor_press_num_4: Ji,
    editor_press_num_5: Qi,
    editor_press_num_7: _n,
    editor_press_o: ln,
    editor_press_p: an,
    editor_press_q: cn,
    editor_press_r: dn,
    editor_press_right: un,
    editor_press_s: pn,
    editor_press_shift: hn,
    editor_press_slash: gn,
    editor_press_space: fn,
    editor_press_t: yn,
    editor_press_u: e_,
    editor_press_up: wn,
    editor_press_w: mn,
    editor_press_x: bn,
    editor_press_y: xn,
    editor_press_z: vn,
    editor_preview_entities: kn,
    editor_receive_past_ninjas: $n,
    editor_redo: Dn,
    editor_release_a: Sn,
    editor_release_alt_left: Tn,
    editor_release_c: Ln,
    editor_release_d: Pn,
    editor_release_e: En,
    editor_release_q: Cn,
    editor_release_s: An,
    editor_release_shift: Mn,
    editor_release_space: jn,
    editor_release_w: Nn,
    editor_release_z: Bn,
    editor_selected_tile_outline_path: In,
    editor_selected_tiles_path: On,
    editor_set_anim_data: Rn,
    editor_set_cursor_pos: Kn,
    editor_set_level_name: Hn,
    editor_set_show_trail: zn,
    editor_show_half_grid: Gn,
    editor_show_quarter_grid: Vn,
    editor_tile_crosshair_col: qn,
    editor_tile_crosshair_row: Un,
    editor_tiles_path: Wn,
    editor_to_replay: Zn,
    editor_undo: Fn,
    memory: ts,
    replay_boost_pad_anim_progress: po,
    replay_boost_pad_deg: ho,
    replay_boost_pad_x: go,
    replay_boost_pad_y: fo,
    replay_boost_pads_len: yo,
    replay_bounce_block_deg: wo,
    replay_bounce_block_x: mo,
    replay_bounce_block_y: bo,
    replay_bounce_blocks_len: xo,
    replay_chaingun_drone_deg: vo,
    replay_chaingun_drone_x: ko,
    replay_chaingun_drone_y: $o,
    replay_chaingun_drones_len: Do,
    replay_chase_drone_deg: So,
    replay_chase_drone_x: To,
    replay_chase_drone_y: Lo,
    replay_chase_drones_len: Po,
    replay_exit_anim_progress: Eo,
    replay_exit_door_x: Co,
    replay_exit_door_y: Ao,
    replay_exit_doors_len: Mo,
    replay_exit_switch_x: jo,
    replay_exit_switch_y: No,
    replay_floor_guard_deg: Bo,
    replay_floor_guard_x: Io,
    replay_floor_guard_y: Oo,
    replay_floor_guards_len: Ro,
    replay_laser_drone_deg: Ko,
    replay_laser_drone_x: Ho,
    replay_laser_drone_y: zo,
    replay_laser_drones_len: Go,
    replay_launch_pad_deg: Vo,
    replay_launch_pad_x: qo,
    replay_launch_pad_y: Uo,
    replay_launch_pads_len: Wo,
    replay_locked_door_anim_progress: Zo,
    replay_locked_door_deg: Fo,
    replay_locked_door_x: Yo,
    replay_locked_door_y: Xo,
    replay_locked_doors_len: Jo,
    replay_locked_switch_x: Qo,
    replay_locked_switch_y: ei,
    replay_mine_state: ti,
    replay_mine_x: ri,
    replay_mine_y: si,
    replay_mines_len: ni,
    replay_ninja_bones: oi,
    replay_ninja_preview_bones: ii,
    replay_ninja_preview_x: _i,
    replay_ninja_preview_y: li,
    replay_ninja_x: ai,
    replay_ninja_y: ci,
    replay_one_way_deg: di,
    replay_one_way_x: ui,
    replay_one_way_y: pi,
    replay_one_ways_len: hi,
    replay_place_ninja: gi,
    replay_progress: fi,
    replay_progress_preview: yi,
    replay_regular_door_anim_progress: wi,
    replay_regular_door_deg: mi,
    replay_regular_door_x: bi,
    replay_regular_door_y: xi,
    replay_regular_doors_len: vi,
    replay_replay_length: ki,
    replay_seek: $i,
    replay_seek_preview: Di,
    replay_send_past_ninjas: Si,
    replay_set_input: Ti,
    replay_shove_thwump_deg: Li,
    replay_shove_thwump_touch: Pi,
    replay_shove_thwump_x: Ei,
    replay_shove_thwump_y: Ci,
    replay_shove_thwumps_len: Ai,
    replay_thwump_deg: Mi,
    replay_thwump_x: ji,
    replay_thwump_y: Ni,
    replay_thwumps_len: Bi,
    replay_tick: Ii,
    replay_tiles_path: Oi,
    replay_trap_door_anim_progress: Ri,
    replay_trap_door_deg: Ki,
    replay_trap_door_x: Hi,
    replay_trap_door_y: zi,
    replay_trap_doors_len: Gi,
    replay_trap_switch_x: Vi,
    replay_trap_switch_y: qi,
    replay_zap_drone_deg: Ui,
    replay_zap_drone_x: Wi,
    replay_zap_drone_y: Zi,
    replay_zap_drones_len: Fi
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  Vr(__);
  zt();
  function l_({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var a_ = x("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const c_ = [
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
  function We(t) {
    function e() {
      const r = t.bones();
      return r ? c_.map(([s, o]) => `M ${20 * r[s]} ${20 * r[s + 13]} ${20 * r[o]} ${20 * r[o + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = a_();
      return S((s) => {
        var o = t.class, i = l_(t.ninja()), _ = e();
        return o !== s.e && y(r, "class", s.e = o), i !== s.t && y(r, "transform", s.t = i), _ !== s.a && y(r, "d", s.a = _), s;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var d_ = x("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), u_ = x("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function p_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function h_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function g_([t, e], r, s) {
    const o = t(), i = r.exit_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.exit_door_x(n),
        y: r.exit_door_y(n),
        animProgress: r.exit_anim_progress(n, s)
      };
      c && p_(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function Gt(t) {
    return u(z, {
      get each() {
        return t.exitDoors();
      },
      children: (e) => u(f_, {
        exitDoor: e
      })
    });
  }
  const F = 11, R = 2.5;
  function f_(t) {
    return (() => {
      var e = d_(), r = e.firstChild, s = r.nextSibling, o = s.nextSibling, i = o.nextSibling, _ = i.nextSibling;
      return S((n) => {
        var c = h_(t.exitDoor), h = -13 + 4 * (1 - t.exitDoor().animProgress), v = 26 - 8 * (1 - t.exitDoor().animProgress), f = `M ${-13 * t.exitDoor().animProgress} 0 v ${-F} h ${-F + R} l ${-R} ${R} v ${2 * (F - R)} l ${R} ${R} h ${F - R} z`, C = `M ${13 * t.exitDoor().animProgress} 0 v ${-F} h ${F - R} l ${R} ${R} v ${2 * (F - R)} l ${-R} ${R} h ${-F + R} z`, P = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * F} v ${t.exitDoor().animProgress * F} h ${-F + R + t.exitDoor().animProgress} l ${-R} ${-R} v ${(1 - t.exitDoor().animProgress) * (-F + R)}`, N = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * F} v ${t.exitDoor().animProgress * F} h ${F - R - t.exitDoor().animProgress} l ${R} ${-R} v ${(1 - t.exitDoor().animProgress) * (-F + R)}`;
        return c !== n.e && y(e, "transform", n.e = c), h !== n.t && y(r, "x", n.t = h), v !== n.a && y(r, "width", n.a = v), f !== n.o && y(s, "d", n.o = f), C !== n.i && y(o, "d", n.i = C), P !== n.n && y(i, "d", n.n = P), N !== n.s && y(_, "d", n.s = N), n;
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
  function y_() {
    return u_();
  }
  var w_ = x('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function m_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function b_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function x_([t, e], r, s) {
    const o = t(), i = r.exit_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.exit_switch_x(n),
        y: r.exit_switch_y(n),
        animProgress: r.exit_anim_progress(n, s)
      };
      c && m_(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function Vt(t) {
    return u(z, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => u(v_, {
        exitSwitch: e
      })
    });
  }
  const pe = 2;
  function v_(t) {
    return (() => {
      var e = w_(), r = e.firstChild, s = r.nextSibling, o = s.nextSibling;
      return S((i) => {
        var _ = b_(t.exitSwitch), n = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, h = `M ${-2 * t.exitSwitch().animProgress} ${-pe} h ${-pe} v ${2 * pe} h ${pe}`, v = `M ${2 * t.exitSwitch().animProgress} ${-pe} h ${pe} v ${2 * pe} h ${-pe}`;
        return _ !== i.e && y(e, "transform", i.e = _), n !== i.t && y(r, "fill", i.t = n), c !== i.a && y(r, "stroke", i.a = c), h !== i.o && y(s, "d", i.o = h), v !== i.i && y(o, "d", i.i = v), i;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), e;
    })();
  }
  var k_ = x("<svg><use href=#one-way></svg>", false, true, false), $_ = x("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function D_(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function S_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function T_([t, e], r) {
    const s = t(), o = r.one_ways_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.one_way_x(_),
        y: r.one_way_y(_),
        deg: r.one_way_deg(_)
      };
      n && D_(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function qt(t) {
    return u(z, {
      get each() {
        return t.oneWays();
      },
      children: (e) => (() => {
        var r = k_();
        return S(() => y(r, "transform", S_(e))), r;
      })()
    });
  }
  function Ut() {
    return (() => {
      var t = $_(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var L_ = x("<svg><use></svg>", false, true, false), P_ = x("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), E_ = x("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), C_ = x("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const A_ = 0, M_ = 1;
  function j_(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function N_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function B_([t, e], r) {
    const s = t(), o = r.mines_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.mine_x(_),
        y: r.mine_y(_),
        type: r.mine_state(_)
      };
      n && j_(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function Wt(t) {
    return u(z, {
      get each() {
        return t.mines();
      },
      children: (e) => (() => {
        var r = L_();
        return S((s) => {
          var o = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][e().type], i = N_(e);
          return o !== s.e && y(r, "href", s.e = o), i !== s.t && y(r, "transform", s.t = i), s;
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
        var t = P_(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, o = s.nextSibling, i = o.nextSibling;
        return i.nextSibling, t;
      })(),
      (() => {
        var t = E_();
        return t.firstChild, t;
      })(),
      (() => {
        var t = C_();
        return t.firstChild, t;
      })()
    ];
  }
  var I_ = x("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), O_ = x("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), R_ = x("<svg><g class=regular-door></svg>", false, true, false);
  function K_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function H_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function z_([t, e], r, s) {
    const o = t(), i = r.regular_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.regular_door_x(n),
        y: r.regular_door_y(n),
        deg: r.regular_door_deg(n),
        animProgress: r.regular_door_anim_progress(n, s)
      };
      c && K_(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function Ft(t) {
    return u(z, {
      get each() {
        return t.regularDoors();
      },
      children: (e) => u(q_, {
        regularDoor: e
      })
    });
  }
  const G_ = 1, V_ = 12 - G_;
  function q_(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (V_ - 0) * r;
    }
    return (() => {
      var r = R_();
      return b(r, u(I, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var s = I_();
              return S(() => y(s, "x2", -e())), s;
            })(),
            (() => {
              var s = O_();
              return S(() => y(s, "x2", e())), s;
            })()
          ];
        }
      })), S(() => y(r, "transform", H_(t.regularDoor))), r;
    })();
  }
  var U_ = x("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), W_ = x("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), mt = x("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), Z_ = x("<svg><g class=locked-door></svg>", false, true, false);
  function F_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Y_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function X_([t, e], r, s) {
    const o = t(), i = r.locked_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.locked_door_x(n),
        y: r.locked_door_y(n),
        deg: r.locked_door_deg(n),
        animProgress: r.locked_door_anim_progress(n, s)
      };
      c && F_(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function Yt(t) {
    return u(z, {
      get each() {
        return t.lockedDoors();
      },
      children: (e) => u(el, {
        lockedDoor: e
      })
    });
  }
  const J_ = 1, Q_ = 12 - J_;
  function el(t) {
    function e() {
      let o = t.lockedDoor().animProgress;
      return o = Math.min(Math.max(2 * o, 0), 1), 4.5 + 4 * o;
    }
    function r() {
      let o = t.lockedDoor().animProgress;
      return o = Math.min(Math.max(2 * o, 0), 1), 0 + 10 * o;
    }
    function s() {
      let o = t.lockedDoor().animProgress;
      return o = Math.min(Math.max((o - 0.4) / 0.6, 0), 1), 0 + (Q_ - 0) * o;
    }
    return (() => {
      var o = Z_();
      return b(o, u(I, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var i = U_();
              return S(() => y(i, "x2", -s())), i;
            })(),
            (() => {
              var i = W_();
              return S(() => y(i, "x2", s())), i;
            })()
          ];
        }
      }), null), b(o, u(I, {
        get when() {
          return t.lockedDoor().animProgress < 0.5;
        },
        get children() {
          return [
            (() => {
              var i = mt();
              return S((_) => {
                var n = e(), c = r();
                return n !== _.e && y(i, "x1", _.e = n), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = mt();
              return S((_) => {
                var n = -e(), c = -r();
                return n !== _.e && y(i, "x1", _.e = n), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      }), null), S(() => y(o, "transform", Y_(t.lockedDoor))), o;
    })();
  }
  var tl = x("<svg><use></svg>", false, true, false), rl = x("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), sl = x("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function nl(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function ol(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function il([t, e], r) {
    const s = t(), o = r.locked_doors_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.locked_switch_x(_),
        y: r.locked_switch_y(_),
        wasTouched: r.locked_door_anim_progress(_, 1) >= 0
      };
      n && nl(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function Xt(t) {
    return u(z, {
      get each() {
        return t.lockedSwitches();
      },
      children: (e) => (() => {
        var r = tl();
        return S((s) => {
          var o = e().wasTouched ? "#locked-switch-touched" : "#locked-switch", i = ol(e);
          return o !== s.e && y(r, "href", s.e = o), i !== s.t && y(r, "transform", s.t = i), s;
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
        var t = rl(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = sl(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var _l = x("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), bt = x("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), ll = x("<svg><g></svg>", false, true, false);
  function al(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function cl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function dl([t, e], r, s) {
    const o = t(), i = r.trap_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.trap_door_x(n),
        y: r.trap_door_y(n),
        deg: r.trap_door_deg(n),
        animProgress: r.trap_door_anim_progress(n, s)
      };
      c && al(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function Qt(t) {
    return u(z, {
      get each() {
        return t.trapDoors();
      },
      children: (e) => u(hl, {
        trapDoor: e
      })
    });
  }
  const ul = 1, pl = 12 - ul;
  function hl(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function s() {
      let o = t.trapDoor().animProgress;
      return 0 + (pl - 0) * o;
    }
    return (() => {
      var o = ll();
      return b(o, u(I, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var i = _l();
              return S((_) => {
                var n = -s(), c = s();
                return n !== _.e && y(i, "x1", _.e = n), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = bt();
              return S((_) => {
                var n = e(), c = r();
                return n !== _.e && y(i, "x1", _.e = n), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = bt();
              return S((_) => {
                var n = -e(), c = -r();
                return n !== _.e && y(i, "x1", _.e = n), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      })), S(() => y(o, "transform", cl(t.trapDoor))), o;
    })();
  }
  var gl = x("<svg><use></svg>", false, true, false), fl = x("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), yl = x("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function wl(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function ml(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function bl([t, e], r) {
    const s = t(), o = r.trap_doors_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.trap_switch_x(_),
        y: r.trap_switch_y(_),
        wasTouched: r.trap_door_anim_progress(_, 1) >= 0
      };
      n && wl(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function er(t) {
    return u(z, {
      get each() {
        return t.trapSwitches();
      },
      children: (e) => (() => {
        var r = gl();
        return S((s) => {
          var o = e().wasTouched ? "#trap-switch-touched" : "#trap-switch", i = ml(e);
          return o !== s.e && y(r, "href", s.e = o), i !== s.t && y(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function tr() {
    return [
      (() => {
        var t = fl();
        return t.firstChild, t;
      })(),
      (() => {
        var t = yl(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var xl = x("<svg><g><rect fill=var(--launch-pad-long) x=0 y=-7.5 width=1.5 height=15></rect><line stroke=var(--launch-pad-short) stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function vl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function kl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function $l([t, e], r) {
    const s = t(), o = r.launch_pads_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.launch_pad_x(_),
        y: r.launch_pad_y(_),
        deg: r.launch_pad_deg(_)
      };
      n && vl(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function rr(t) {
    return u(z, {
      get each() {
        return t.launchPads();
      },
      children: (e) => u(Dl, {
        launchPad: e
      })
    });
  }
  function Dl(t) {
    return (() => {
      var e = xl(), r = e.firstChild;
      return r.nextSibling, S(() => y(e, "transform", kl(t.launchPad))), e;
    })();
  }
  var Sl = x('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function Tl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Ll(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Pl([t, e], r, s) {
    const o = t(), i = r.floor_guards_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.floor_guard_x(n, s),
        y: r.floor_guard_y(n, s),
        deg: r.floor_guard_deg(n)
      };
      c && Tl(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function sr(t) {
    return u(z, {
      get each() {
        return t.floorGuards();
      },
      children: (e) => u(El, {
        floorGuard: e
      })
    });
  }
  function El(t) {
    return (() => {
      var e = Sl();
      return e.firstChild, S(() => y(e, "transform", Ll(t.floorGuard))), e;
    })();
  }
  var Cl = x("<svg><use href=#bounceblock></svg>", false, true, false), Al = x('<svg><g id=bounceblock><path fill=var(--bounceblock-interior) d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path stroke=var(--bounceblock-border) d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function Ml(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function jl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Nl([t, e], r, s) {
    const o = t(), i = r.bounce_blocks_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.bounce_block_x(n, s),
        y: r.bounce_block_y(n, s),
        deg: r.bounce_block_deg(n)
      };
      c && Ml(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function nr(t) {
    return u(z, {
      get each() {
        return t.bounceBlocks();
      },
      children: (e) => (() => {
        var r = Cl();
        return S(() => y(r, "transform", jl(e))), r;
      })()
    });
  }
  function or() {
    return (() => {
      var t = Al(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var Bl = x("<svg><use href=#boostpad></svg>", false, true, false), Il = x("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function Ol(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Rl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Kl([t, e], r, s) {
    const o = t(), i = r.boost_pads_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.boost_pad_x(n),
        y: r.boost_pad_y(n),
        deg: r.boost_pad_deg(n, s),
        animProgress: r.boost_pad_anim_progress(n, s)
      };
      c && Ol(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function ir(t) {
    return u(z, {
      get each() {
        return t.boostPads();
      },
      children: (e) => (() => {
        var r = Bl();
        return S((s) => {
          var o = `color-mix(in srgb-linear, var(--boost-pad) ${e().animProgress * 100}%, var(--boost-pad-wooshing))`, i = Rl(e);
          return o !== s.e && y(r, "stroke", s.e = o), i !== s.t && y(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function _r() {
    return (() => {
      var t = Il(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, o = s.nextSibling;
      return o.nextSibling, t;
    })();
  }
  var Hl = x("<svg><use href=#thwump></svg>", false, true, false), zl = x('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function Gl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Vl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ql([t, e], r, s) {
    const o = t(), i = r.thwumps_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.thwump_x(n, s),
        y: r.thwump_y(n, s),
        deg: r.thwump_deg(n)
      };
      c && Gl(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function lr(t) {
    return u(z, {
      get each() {
        return t.thwumps();
      },
      children: (e) => (() => {
        var r = Hl();
        return S(() => y(r, "transform", Vl(e))), r;
      })()
    });
  }
  function ar() {
    return (() => {
      var t = zl(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Ul = x("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), Wl = x("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function Zl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function Fl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Yl([t, e], r, s) {
    const o = t(), i = r.shove_thwumps_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.shove_thwump_x(n, s),
        y: r.shove_thwump_y(n, s),
        deg: r.shove_thwump_deg(n),
        touch: r.shove_thwump_touch(n)
      };
      c && Zl(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function cr(t) {
    return u(z, {
      get each() {
        return t.shoveThwumps();
      },
      children: (e) => u(Xl, {
        shoveThwump: e
      })
    });
  }
  function Xl(t) {
    return (() => {
      var e = Ul(), r = e.firstChild;
      return b(e, u(dt, {
        each: [
          0,
          2,
          4,
          6
        ],
        children: (s) => u(I, {
          get when() {
            return t.shoveThwump().touch >= 16 || s === t.shoveThwump().touch;
          },
          get children() {
            var o = Wl(), i = o.firstChild, _ = i.nextSibling;
            return _.nextSibling, y(o, "transform", `rotate(${45 * s},0,0)`), o;
          }
        })
      }), r), S(() => y(e, "transform", Fl(t.shoveThwump))), e;
    })();
  }
  const dr = ur((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function Jl(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function Ql(t) {
    const e = String.fromCharCode(...t);
    console.log("anim data length", t.byteLength), localStorage.setItem("animData", e);
  }
  function ea(t) {
    const e = localStorage.getItem("animData");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.set_anim_data(r);
    }
  }
  const ta = ur(ra, 1e3);
  function ra(t) {
    const e = JSON.stringify(t);
    localStorage.setItem("palette", e);
  }
  function sa() {
    const t = localStorage.getItem("palette");
    if (t) try {
      const e = JSON.parse(t);
      if (typeof (e == null ? void 0 : e.name) == "string" && typeof (e == null ? void 0 : e.colors) == "object") return e;
    } catch {
      return;
    }
  }
  function ur(t, e) {
    let r;
    return (...s) => {
      typeof r == "number" && clearTimeout(r), r = setTimeout(() => t(...s), e);
    };
  }
  const na = "" + new URL("palette-CZVUb4uS.png", import.meta.url).href, pr = [
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
  ], xt = [
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
  ], vt = {
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
  }, oa = {
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
  }, ia = (() => {
    const t = {};
    for (const e of xt) {
      t[e] = 0;
      for (const r of xt) vt[r] < vt[e] && (t[e] += oa[r]);
    }
    return t;
  })(), hr = [
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
  ], _a = {
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
  let gr;
  async function la() {
    const e = await (await fetch(na)).blob(), r = await createImageBitmap(e), s = document.createElement("canvas");
    s.width = r.width, s.height = r.height;
    const o = s.getContext("2d");
    o.drawImage(r, 0, 0), gr = o;
  }
  function fr(t) {
    const e = gr, r = pr.indexOf(t);
    if (!e || r < 0) return;
    const s = {};
    for (const o of hr) {
      const { file: i, index: _ } = _a[o], n = ia[i] + _, c = e.getImageData(n, r, 1, 1).data, h = `rgb(${c[0]} ${c[1]} ${c[2]})`;
      s[o] = h;
    }
    return s;
  }
  function aa(t) {
    for (const e of hr) document.body.style.setProperty(e, t[e]);
  }
  var ca = x('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox></label> | Object corners <select><option>square</option><option>rounded</option></select> | <select></select><input type=text style=float:right>'), da = x("<option>");
  function ua(t) {
    return (() => {
      var e = ca(), r = e.firstChild, s = r.firstChild, o = s.nextSibling, i = r.nextSibling, _ = i.nextSibling, n = _.nextSibling, c = n.nextSibling, h = c.firstChild, v = h.nextSibling, f = c.nextSibling, C = f.nextSibling, P = C.firstChild, N = P.nextSibling, B = C.nextSibling, A = B.nextSibling, O = A.nextSibling;
      return o.addEventListener("change", function() {
        const $ = this.files;
        if ($ && $.length > 0) {
          const T = new FileReader();
          T.onloadend = () => {
            T.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(T.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, T.readAsArrayBuffer($[0]);
        }
      }), _.$$click = function() {
        const $ = t.editor.export_map(), T = new Blob([
          $.buffer
        ], {
          type: "application/octet-stream"
        }), j = URL.createObjectURL(T);
        this.href = j, this.download = t.editor.get_level_name().replaceAll(/[^a-z]/gi, "_"), setTimeout(() => URL.revokeObjectURL(j), 100);
      }, v.addEventListener("change", ($) => {
        t.setShowTrail($.currentTarget.checked), t.editor.set_show_trail($.currentTarget.checked);
      }), C.addEventListener("change", ($) => t.setRoundCorners($.currentTarget.value == "rounded")), A.addEventListener("change", ($) => {
        const T = fr($.currentTarget.value);
        T && t.setPalette({
          name: $.currentTarget.value,
          colors: T
        });
      }), b(A, () => pr.map(($) => (() => {
        var T = da();
        return b(T, $), S(() => {
          var _a2;
          return T.selected = $ === (((_a2 = t.palette()) == null ? void 0 : _a2.name) ?? "vasquez");
        }), T;
      })())), O.addEventListener("change", () => dr(t.editor)), O.$$input = ($) => {
        t.editor.set_level_name($.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, S(($) => {
        var T = !t.roundCorners(), j = t.roundCorners();
        return T !== $.e && (P.selected = $.e = T), j !== $.t && (N.selected = $.t = j), $;
      }, {
        e: void 0,
        t: void 0
      }), S(() => v.checked = t.showTrail()), S(() => O.value = t.levelName()), e;
    })();
  }
  Fe([
    "click",
    "input"
  ]);
  var pa = x("<svg><use href=#zapdrone></svg>", false, true, false), ha = x('<svg><g id=zapdrone><path fill=var(--zap-drone-background) stroke=var(--zap-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--zap-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--zap-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false), ga = x('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 1 12 12 a 12 12 0 0 1 -12 12 l 5 -5 m 0 10 l -5 -5"></svg>', false, true, false), fa = x('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 0 12 -12 a 12 12 0 0 0 -12 -12 l 5 5 m 0 -10 l -5 5"></svg>', false, true, false), ya = x('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V 24 l -5 -5 m 10 0 l -5 5"></svg>', false, true, false), wa = x('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V -24 l -5 5 m 10 0 l -5 -5"></svg>', false, true, false), ma = x("<svg><g></svg>", false, true, false);
  function ba(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function xa(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function va([t, e], r, s) {
    const o = t(), i = r.zap_drones_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.zap_drone_x(n, s),
        y: r.zap_drone_y(n, s),
        deg: r.zap_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && ba(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function yr(t) {
    return u(z, {
      get each() {
        return t.zapDrones();
      },
      children: (e) => (() => {
        var r = pa();
        return S(() => y(r, "transform", xa(e))), r;
      })()
    });
  }
  function wr() {
    return (() => {
      var t = ha(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  function ka({ entities: t }) {
    const e = () => t.zapDrones().at(0) ?? t.chaseDrones().at(0) ?? t.chaingunDrones().at(0) ?? t.laserDrones().at(0), r = (s) => {
      const o = s();
      if (o) {
        const { x: i, y: _, deg: n } = o;
        return `translate(${i},${_}) rotate(${n},0,0)`;
      } else return "";
    };
    return (() => {
      var s = ma();
      return b(s, u(I, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 0;
        },
        get children() {
          return ga();
        }
      }), null), b(s, u(I, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 1;
        },
        get children() {
          return fa();
        }
      }), null), b(s, u(I, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 2;
        },
        get children() {
          return ya();
        }
      }), null), b(s, u(I, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 3;
        },
        get children() {
          return wa();
        }
      }), null), S(() => y(s, "transform", r(e))), s;
    })();
  }
  var $a = x("<svg><use href=#chaingundrone></svg>", false, true, false), Da = x('<svg><g id=chaingundrone><path fill=var(--chaingun-drone-background) stroke=var(--chaingun-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chaingun-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--chaingun-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function Sa(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Ta(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function La([t, e], r, s) {
    const o = t(), i = r.chaingun_drones_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.chaingun_drone_x(n, s),
        y: r.chaingun_drone_y(n, s),
        deg: r.chaingun_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && Sa(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function mr(t) {
    return u(z, {
      get each() {
        return t.chaingunDrones();
      },
      children: (e) => (() => {
        var r = $a();
        return S(() => y(r, "transform", Ta(e))), r;
      })()
    });
  }
  function br() {
    return (() => {
      var t = Da(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Pa = x("<svg><use href=#bat></svg>", false, true, false), Ea = x("<svg><circle id=bat r=5 cx=0 cy=0 fill=var(--bat-body)></svg>", false, true, false);
  function Ca(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Aa(t) {
    return u(z, {
      get each() {
        return t.bats();
      },
      children: (e) => (() => {
        var r = Pa();
        return S(() => y(r, "transform", Ca(e))), r;
      })()
    });
  }
  function Ma() {
    return Ea();
  }
  var ja = x("<svg><use href=#laserdrone></svg>", false, true, false), Na = x('<svg><g id=laserdrone><path fill=none stroke=var(--laser-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--laser-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--laser-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function Ba(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Ia(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Oa([t, e], r, s) {
    const o = t(), i = r.laser_drones_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.laser_drone_x(n, s),
        y: r.laser_drone_y(n, s),
        deg: r.laser_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && Ba(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function xr(t) {
    return u(z, {
      get each() {
        return t.laserDrones();
      },
      children: (e) => (() => {
        var r = ja();
        return S(() => y(r, "transform", Ia(e))), r;
      })()
    });
  }
  function vr() {
    return (() => {
      var t = Na(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Ra = x("<svg><use href=#chasedrone></svg>", false, true, false), Ka = x('<svg><g id=chasedrone><path fill=var(--chase-drone-background) stroke=var(--chase-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chase-drone-border) d="M 10 -3 H 3 A 3 3 0 0 0 0 0 A 3 3 0 0 0 3 3 H 10 Z"></path><path fill=none stroke=var(--chase-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function Ha(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function za(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Ga([t, e], r, s) {
    const o = t(), i = r.chase_drones_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.chase_drone_x(n, s),
        y: r.chase_drone_y(n, s),
        deg: r.chase_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && Ha(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function kr(t) {
    return u(z, {
      get each() {
        return t.chaseDrones();
      },
      children: (e) => (() => {
        var r = Ra();
        return S(() => y(r, "transform", za(e))), r;
      })()
    });
  }
  function $r() {
    return (() => {
      var t = Ka(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Va = x('<svg><rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"width=150 height=150 style=mix-blend-mode:hard-light></svg>', false, true, false), qa = x("<svg><circle fill=none stroke=var(--entity-palette-reticle) r=16></svg>", false, true, false), Ua = x('<svg><path d="M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12"fill-rule=evenodd fill="color-mix(in srgb,var(--background) 18%,white 15%)"style=mix-blend-mode:hard-light></svg>', false, true, false), Wa = x("<svg><rect fill=none stroke=var(--editor-crosshair) stroke-width=2 width=26 height=26></svg>", false, true, false), Za = x("<svg><use href=#tilemode-crosshair></svg>", false, true, false), Fa = x("<svg><use href=#crosshair></svg>", false, true, false), Ya = x("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), Xa = x('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none>'), kt = x("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), $t = x("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), Ja = x("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), Qa = x("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), ec = x("<svg><line class=door-switch-line></svg>", false, true, false);
  const rt = 42, st = 23, Dt = 0, St = 1, tc = 3, rc = 4, nt = 5, Tt = 6, Lt = 7, sc = 8, ot = 9, nc = 0, oc = 1, ic = 3, _c = 5, lc = 6, ac = 8, cc = 10, dc = 11, uc = 12, pc = 13, hc = 14, gc = 15, fc = 16, yc = 17, wc = 20, mc = 21, bc = 24, xc = 27, vc = 28, kc = new Float64Array([
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
  ]), $c = new Float64Array([
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
  ]), Pt = 150;
  function Et() {
    const [t, e] = w([]), [r, s] = w([]), [o, i] = w([]), [_, n] = w([]), [c, h] = w([]), [v, f] = w([]), [C, P] = w([]), [N, B] = w([]), [A, O] = w([]), [$, T] = w([]), [j, K] = w([]), [te, W] = w([]), [J, L] = w([]), [M, Q] = w([]), [ee, le] = w([]), [E, q] = w([]), [X, G] = w([]), [re, ie] = w([]), [ne, ge] = w([]), [fe, ye] = w([]), [d, g] = w([]);
    return {
      ninjas: t,
      setNinjas: e,
      mines: r,
      setMines: s,
      exitDoors: o,
      setExitDoors: i,
      exitSwitches: _,
      setExitSwitches: n,
      regularDoors: c,
      setRegularDoors: h,
      lockedDoors: v,
      setLockedDoors: f,
      lockedSwitches: C,
      setLockedSwitches: P,
      trapDoors: N,
      setTrapDoors: B,
      trapSwitches: A,
      setTrapSwitches: O,
      launchPads: $,
      setLaunchPads: T,
      oneWays: j,
      setOneWays: K,
      chaingunDrones: te,
      setChaingunDrones: W,
      laserDrones: J,
      setLaserDrones: L,
      zapDrones: M,
      setZapDrones: Q,
      chaseDrones: ee,
      setChaseDrones: le,
      floorGuards: E,
      setFloorGuards: q,
      bounceBlocks: X,
      setBounceBlocks: G,
      thwumps: re,
      setThwumps: ie,
      boostPads: ne,
      setBoostPads: ge,
      bats: fe,
      setBats: ye,
      shoveThwumps: d,
      setShoveThwumps: g
    };
  }
  function Ct(t, e, r, s) {
    const o = [], i = [], _ = [], n = [], c = [], h = [], v = [], f = [], C = [], P = [], N = [], B = [], A = [], O = [], $ = [], T = [], j = [], K = [], te = [], W = [], J = [];
    for (const L of r) {
      const M = {
        x: L.x,
        y: L.y,
        deg: L.deg,
        mode: L.mode,
        animProgress: 0
      }, Q = {
        x: L.switch_x,
        y: L.switch_y,
        animProgress: 0,
        wasTouched: false
      }, ee = {
        x1: L.x,
        y1: L.y,
        x2: L.switch_x,
        y2: L.switch_y
      };
      L.type_int === nc ? o.push(M) : L.type_int === oc ? i.push({
        ...M,
        type: A_
      }) : L.type_int === mc ? i.push({
        ...M,
        type: M_
      }) : L.type_int === ic ? (_.push(M), Number.isNaN(L.switch_x) || (n.push(Q), e.push(ee))) : L.type_int === _c ? c.push(M) : L.type_int === lc ? (h.push(M), Number.isNaN(L.switch_x) || (v.push(Q), e.push(ee))) : L.type_int === ac ? (f.push({
        ...M,
        animProgress: s ? 1 : -1
      }), Number.isNaN(L.switch_x) || (C.push(Q), e.push(ee))) : L.type_int === cc ? P.push(M) : L.type_int === dc ? N.push(M) : L.type_int === uc ? B.push(M) : L.type_int === pc ? A.push(M) : L.type_int === hc ? O.push(M) : L.type_int === gc ? $.push(M) : L.type_int === fc ? T.push(M) : L.type_int === yc ? j.push(M) : L.type_int === wc ? K.push(M) : L.type_int === bc ? te.push({
        ...M,
        animProgress: 1
      }) : L.type_int === xc ? W.push(M) : L.type_int === vc && J.push({
        ...M,
        touch: 16
      }), L.free();
    }
    t.setNinjas(o), t.setMines(i), t.setExitDoors(_), t.setExitSwitches(n), t.setRegularDoors(c), t.setLockedDoors(h), t.setLockedSwitches(v), t.setTrapDoors(f), t.setTrapSwitches(C), t.setLaunchPads(P), t.setOneWays(N), t.setChaingunDrones(B), t.setLaserDrones(A), t.setZapDrones(O), t.setChaseDrones($), t.setFloorGuards(T), t.setBounceBlocks(j), t.setThwumps(K), t.setBoostPads(te), t.setBats(W), t.setShoveThwumps(J);
  }
  function At({ entities: t }) {
    return [
      u(Gt, {
        get exitDoors() {
          return t.exitDoors;
        }
      }),
      u(qt, {
        get oneWays() {
          return t.oneWays;
        }
      }),
      u(Wt, {
        get mines() {
          return t.mines;
        }
      }),
      u(Ft, {
        get regularDoors() {
          return t.regularDoors;
        }
      }),
      u(Qt, {
        get trapDoors() {
          return t.trapDoors;
        }
      }),
      u(Yt, {
        get lockedDoors() {
          return t.lockedDoors;
        }
      }),
      u(Xt, {
        get lockedSwitches() {
          return t.lockedSwitches;
        }
      }),
      u(er, {
        get trapSwitches() {
          return t.trapSwitches;
        }
      }),
      u(Vt, {
        get exitSwitches() {
          return t.exitSwitches;
        }
      }),
      u(rr, {
        get launchPads() {
          return t.launchPads;
        }
      }),
      u(mr, {
        get chaingunDrones() {
          return t.chaingunDrones;
        }
      }),
      u(xr, {
        get laserDrones() {
          return t.laserDrones;
        }
      }),
      u(yr, {
        get zapDrones() {
          return t.zapDrones;
        }
      }),
      u(kr, {
        get chaseDrones() {
          return t.chaseDrones;
        }
      }),
      u(sr, {
        get floorGuards() {
          return t.floorGuards;
        }
      }),
      u(Aa, {
        get bats() {
          return t.bats;
        }
      }),
      u(lr, {
        get thwumps() {
          return t.thwumps;
        }
      }),
      u(dt, {
        get each() {
          return t.ninjas();
        },
        children: (e) => u(We, {
          class: "ninja",
          ninja: () => e,
          bones: () => kc
        })
      }),
      u(nr, {
        get bounceBlocks() {
          return t.bounceBlocks;
        }
      }),
      u(cr, {
        get shoveThwumps() {
          return t.shoveThwumps;
        }
      }),
      u(ir, {
        get boostPads() {
          return t.boostPads;
        }
      })
    ];
  }
  function Dc(t) {
    const { editor: e, pastNinjas: r } = t, [s, o] = w(""), [i, _] = w(""), [n, c] = w(true), [h, v] = w(false), [f, C] = w(Dt), [P, N] = w({
      row: 1,
      col: 1
    }), [B, A] = w({
      x: 24,
      y: 24
    }), [O, $] = w(""), [T, j] = w({
      x: NaN,
      y: NaN
    }), [K, te] = w({
      x: NaN,
      y: NaN
    }), W = Et(), J = Et(), [L, M] = w([]), [Q, ee] = w(e.get_show_trail()), [le, E] = w(), q = (d) => {
      let g = false;
      if (!(d.target instanceof HTMLInputElement || d.target instanceof HTMLSelectElement)) {
        if (d.ctrlKey || d.metaKey) {
          d.code === "KeyZ" && (d.ctrlKey || d.metaKey) && d.shiftKey ? (g = true, e.redo()) : d.code === "KeyZ" && (d.ctrlKey || d.metaKey) ? (g = true, e.undo()) : d.code === "KeyY" && (d.ctrlKey || d.metaKey) && (g = true, e.redo()), g && (G(true), d.preventDefault());
          return;
        }
        d.shiftKey && (g = true, e.press_shift()), d.code === "Enter" && e.mode() === ot ? t.setReplay(e.to_replay(t.roundCorners())) : d.code === "Backquote" ? (g = true, e.press_backtick()) : d.code === "Digit1" ? (g = true, e.press_1(d.shiftKey)) : d.code === "Digit2" ? (g = true, e.press_2(d.shiftKey)) : d.code === "Digit3" ? (g = true, e.press_3(d.shiftKey)) : d.code === "Digit4" ? (g = true, e.press_4(d.shiftKey)) : d.code === "Digit5" ? (g = true, e.press_5(d.shiftKey)) : d.code === "Digit6" ? (g = true, e.press_6(d.shiftKey)) : d.code === "Digit7" ? (g = true, e.press_7(d.shiftKey)) : d.code === "Digit8" ? (g = true, e.press_8(d.shiftKey)) : d.code === "Digit9" ? (g = true, e.press_9()) : d.code === "Digit0" ? (g = true, e.press_0()) : d.code === "Minus" ? (g = true, e.press_dash()) : d.code === "Equal" ? (g = true, e.press_equals()) : d.code === "KeyQ" ? (g = true, e.press_q(d.shiftKey)) : d.code === "KeyW" ? (g = true, e.press_w(d.shiftKey)) : d.code === "KeyA" ? (g = true, e.press_a(d.shiftKey)) : d.code === "KeyS" ? (g = true, e.press_s(d.shiftKey)) : d.code === "KeyE" ? (g = true, e.press_e()) : d.code === "KeyD" ? (g = true, e.press_d()) : d.code === "KeyZ" ? (g = true, e.press_z()) : d.code === "KeyX" ? (g = true, e.press_x()) : d.code === "KeyC" ? (g = true, e.press_c()) : d.code === "Space" ? (g = true, e.press_space()) : d.code === "AltLeft" ? (g = true, e.press_alt_left(d.shiftKey)) : d.code === "KeyR" ? (g = true, e.press_r()) : d.code === "KeyT" ? (g = true, e.press_t()) : d.code === "KeyY" ? (g = true, e.press_y()) : d.code === "KeyU" ? (g = true, e.press_u()) : d.code === "KeyI" ? (g = true, e.press_i()) : d.code === "KeyO" ? (g = true, e.press_o()) : d.code === "KeyP" ? (g = true, e.press_p()) : d.code === "BracketLeft" ? (g = true, e.press_bracket_left()) : d.code === "BracketRight" ? (g = true, e.press_bracket_right()) : d.code === "KeyF" ? (g = true, e.press_f()) : d.code === "KeyH" ? (g = true, e.press_h()) : d.code === "KeyJ" ? (g = true, e.press_j()) : d.code === "KeyK" ? (g = true, e.press_k()) : d.code === "KeyL" ? (g = true, e.press_l()) : d.code === "KeyN" ? (g = true, e.press_n()) : d.code === "KeyM" ? (g = true, e.press_m()) : d.code === "Comma" ? (g = true, e.press_comma()) : d.code === "ArrowUp" ? (g = true, e.press_up(d.shiftKey)) : d.code === "ArrowDown" ? (g = true, e.press_down(d.shiftKey)) : d.code === "ArrowLeft" ? (g = true, e.press_left(d.shiftKey)) : d.code === "ArrowRight" ? (g = true, e.press_right(d.shiftKey)) : d.code === "Enter" ? (g = true, e.press_enter()) : d.code === "Escape" ? g = e.press_escape() : d.code === "Slash" && (g = true, e.press_slash()), g && (G(true), d.preventDefault());
      }
    }, X = (d) => {
      let g = false;
      d.shiftKey || (g = true, e.release_shift()), d.code === "KeyQ" ? (g = true, e.release_q()) : d.code === "KeyW" ? (g = true, e.release_w()) : d.code === "KeyA" ? (g = true, e.release_a()) : d.code === "KeyS" ? (g = true, e.release_s()) : d.code === "KeyE" ? (g = true, e.release_e()) : d.code === "KeyD" ? (g = true, e.release_d()) : d.code === "KeyZ" ? (g = true, e.release_z()) : d.code === "KeyC" ? (g = true, e.release_c()) : d.code === "Space" ? (g = true, e.release_space()) : d.code === "AltLeft" && (g = true, e.release_alt_left()), g && (G(false), d.preventDefault());
    };
    document.addEventListener("keydown", q), document.addEventListener("keyup", X), be(() => {
      document.removeEventListener("keydown", q), document.removeEventListener("keyup", X);
    });
    function G(d) {
      C(e.mode()), o(e.tiles_path()), _(e.selected_tiles_path()), N({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), v(e.show_quarter_grid()), A({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const g = [];
      Ct(W, g, e.entities(), false), Ct(J, g, e.preview_entities(), true), M(g), $(e.selected_tile_outline_path()), j({
        x: e.palette_center_x(),
        y: e.palette_center_y()
      }), te({
        x: e.palette_selection_x(),
        y: e.palette_selection_y()
      }), E(e.past_ninja_bones()), d && dr(e);
    }
    const re = [];
    for (let d = 0; d < rt - 1; d++) re.push(48 + 24 * d);
    const ie = [];
    for (let d = 0; d < st - 1; d++) ie.push(48 + 24 * d);
    const ne = [];
    for (let d = 0; d < rt; d++) ne.push(36 + 24 * d);
    const ge = [];
    for (let d = 0; d < st; d++) ge.push(36 + 24 * d);
    const fe = [];
    for (let d = 0; d < rt * 2; d++) fe.push(30 + 12 * d);
    const ye = [];
    for (let d = 0; d < st * 2; d++) ye.push(30 + 12 * d);
    return G(false), [
      (() => {
        var d = Xa(), g = d.firstChild, Ne = g.firstChild, Z = Ne.nextSibling;
        Z.nextSibling;
        var ce = g.nextSibling, de = ce.nextSibling, _e = de.nextSibling, xe = _e.nextSibling, Be = xe.firstChild;
        return d.$$contextmenu = (m) => {
          e.press_escape() && (G(false), m.preventDefault());
        }, d.$$mouseup = () => {
          e.cursor_up(), G(false);
        }, d.$$dblclick = (m) => {
          e.double_click(m.shiftKey), G(false);
        }, d.$$mousedown = (m) => {
          m.buttons & 2 || (e.mode() === ot ? t.setReplay(e.to_replay(t.roundCorners())) : (e.cursor_down(m.shiftKey), G(true)));
        }, d.$$mousemove = function(m) {
          const { left: p, top: k, width: D, height: U } = this.getBoundingClientRect(), ue = e.set_cursor_pos((m.clientX - p) / D * 1056, (m.clientY - k) / U * 600, m.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (m.clientX - p) / D * 1056,
            y: (m.clientY - k) / U * 600
          }), ue && G(false);
        }, b(g, u(Zt, {}), Z), b(g, u(Ut, {}), Z), b(g, u(or, {}), Z), b(g, u(Jt, {}), Z), b(g, u(tr, {}), Z), b(g, u(_r, {}), Z), b(g, u(ar, {}), Z), b(g, u(br, {}), Z), b(g, u(vr, {}), Z), b(g, u(wr, {}), Z), b(g, u($r, {}), Z), b(g, u(Ma, {}), Z), b(d, u(I, {
          get when() {
            return h();
          },
          get children() {
            return [
              De(() => fe.map((m) => (() => {
                var p = kt();
                return y(p, "x1", m), y(p, "x2", m), p;
              })())),
              De(() => ye.map((m) => (() => {
                var p = $t();
                return y(p, "y1", m), y(p, "y2", m), p;
              })()))
            ];
          }
        }), ce), b(d, u(I, {
          get when() {
            return n();
          },
          get children() {
            return [
              De(() => ne.map((m) => (() => {
                var p = kt();
                return y(p, "x1", m), y(p, "x2", m), p;
              })())),
              De(() => ge.map((m) => (() => {
                var p = $t();
                return y(p, "y1", m), y(p, "y2", m), p;
              })()))
            ];
          }
        }), ce), b(d, () => re.map((m) => (() => {
          var p = Ja();
          return y(p, "x1", m), y(p, "x2", m), p;
        })()), ce), b(d, () => ie.map((m) => (() => {
          var p = Qa();
          return y(p, "y1", m), y(p, "y2", m), p;
        })()), ce), b(d, u(At, {
          entities: W
        }), ce), b(d, u(I, {
          get when() {
            return f() === Lt;
          },
          get children() {
            var m = Va();
            return S((p) => {
              var k = T().x - Pt / 2, D = T().y - Pt / 2;
              return k !== p.e && y(m, "x", p.e = k), D !== p.t && y(m, "y", p.t = D), p;
            }, {
              e: void 0,
              t: void 0
            }), m;
          }
        }), de), b(de, u(At, {
          entities: J
        })), b(d, u(I, {
          get when() {
            return [
              nt,
              Tt,
              rc
            ].includes(f());
          },
          get children() {
            return u(ka, {
              entities: J
            });
          }
        }), _e), b(d, u(I, {
          get when() {
            return f() === Lt;
          },
          get children() {
            var m = qa();
            return S((p) => {
              var k = K().x, D = K().y;
              return k !== p.e && y(m, "cx", p.e = k), D !== p.t && y(m, "cy", p.t = D), p;
            }, {
              e: void 0,
              t: void 0
            }), m;
          }
        }), _e), b(d, u(I, {
          get when() {
            return f() === St;
          },
          get children() {
            var m = Ua();
            return S(() => y(m, "transform", `translate(${T().x},${T().y})`)), m;
          }
        }), _e), b(d, u(I, {
          get when() {
            return f() === St;
          },
          get children() {
            var m = Wa();
            return S((p) => {
              var k = K().x - 13, D = K().y - 13;
              return k !== p.e && y(m, "x", p.e = k), D !== p.t && y(m, "y", p.t = D), p;
            }, {
              e: void 0,
              t: void 0
            }), m;
          }
        }), xe), b(d, u(dt, {
          get each() {
            return L();
          },
          children: (m) => (() => {
            var p = ec();
            return S((k) => {
              var D = m.x1, U = m.y1, ue = m.x2, ve = m.y2;
              return D !== k.e && y(p, "x1", k.e = D), U !== k.t && y(p, "y1", k.t = U), ue !== k.a && y(p, "x2", k.a = ue), ve !== k.o && y(p, "y2", k.o = ve), k;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), p;
          })()
        }), xe), b(d, u(I, {
          get when() {
            return f() === Dt;
          },
          get children() {
            var m = Za();
            return S((p) => {
              var k = P().col * 24 + 12, D = P().row * 24 + 12;
              return k !== p.e && y(m, "x", p.e = k), D !== p.t && y(m, "y", p.t = D), p;
            }, {
              e: void 0,
              t: void 0
            }), m;
          }
        }), null), b(d, u(I, {
          get when() {
            return f() === sc || f() === nt;
          },
          get children() {
            var m = Fa();
            return S((p) => {
              var k = B().x, D = B().y;
              return k !== p.e && y(m, "x", p.e = k), D !== p.t && y(m, "y", p.t = D), p;
            }, {
              e: void 0,
              t: void 0
            }), m;
          }
        }), null), b(d, u(I, {
          get when() {
            return f() === ot;
          },
          get children() {
            return u(We, {
              class: "ninja",
              ninja: () => ({
                x: B().x,
                y: B().y,
                deg: 0
              }),
              bones: () => le() ?? $c
            });
          }
        }), null), b(d, u(I, {
          get when() {
            return Q();
          },
          get children() {
            var m = Ya();
            return S(() => y(m, "points", r().map(({ x: p, y: k }) => `${p},${k}`).join(" "))), m;
          }
        }), null), S((m) => {
          var p = s(), k = [
            tc,
            nt,
            Tt
          ].includes(f()) ? "url(#outline)" : "", D = i(), U = O();
          return p !== m.e && y(ce, "d", m.e = p), k !== m.t && y(de, "filter", m.t = k), D !== m.a && y(_e, "d", m.a = D), U !== m.o && y(Be, "d", m.o = U), m;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), d;
      })(),
      u(ua, {
        editor: e,
        render: G,
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
        showTrail: Q,
        setShowTrail: ee
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
  var Sc = x("<div id=media-controls><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb>");
  function Tc(t) {
    const e = () => {
      const n = t.progress(), c = t.length();
      return c === 0 || n >= c ? "100%" : `${n / c * 100}%`;
    }, r = () => {
      const n = t.progress(), c = t.previewProgress(), h = t.length();
      if (c === void 0 || h === 0) return {
        left: "0%",
        width: "0%"
      };
      const v = Math.min(n, c), f = Math.min(Math.max(n, c), h);
      return {
        left: `${v / h * 100}%`,
        width: `${(f - v) / h * 100}%`
      };
    };
    let s;
    document.addEventListener("mousemove", i), be(() => document.removeEventListener("mousemove", i)), document.addEventListener("mouseup", _), be(() => document.removeEventListener("mouseup", _));
    function o(n) {
      if (s) {
        const { left: c, top: h, width: v } = s.getBoundingClientRect();
        let f = (n.clientX - c) / v;
        f = Math.min(1, f), f = Math.max(0, f);
        let C = Math.abs(n.clientY - h);
        return {
          targetFrame: Math.round(f * t.length()),
          strength: Math.pow(Math.E, -5 * C / v)
        };
      } else return {
        targetFrame: 0,
        strength: 0
      };
    }
    function i(n) {
      if (s) {
        const c = t.dragStart();
        if (c !== void 0) {
          const { targetFrame: h, strength: v } = o(n);
          t.seek(Math.round(c + (h - c) * v)), t.previewSeek(void 0);
        } else s.matches(":hover") ? t.previewSeek(o(n).targetFrame) : t.previewSeek(void 0);
      }
    }
    function _() {
      t.setDragStart(void 0);
    }
    return (() => {
      var n = Sc(), c = n.firstChild, h = c.firstChild, v = c.nextSibling, f = v.firstChild, C = f.nextSibling, P = C.nextSibling, N = P.nextSibling;
      c.$$click = () => {
        t.isPlaying() ? t.setIsPlaying(false) : (t.progress() >= t.length() && t.seek(0), t.setIsPlaying(true));
      }, b(h, u(Ir, {
        get children() {
          return [
            u(ut, {
              get when() {
                return !t.isPlaying();
              },
              children: "\u25B6"
            }),
            u(ut, {
              get when() {
                return t.isPlaying();
              },
              children: "\u23F8"
            })
          ];
        }
      })), v.$$mousedown = (A) => {
        t.setDragStart(o(A).targetFrame), i(A), A.preventDefault();
      };
      var B = s;
      return typeof B == "function" ? Kr(B, v) : s = v, S((A) => {
        var O = e(), $ = r().left, T = r().width, j = e();
        return O !== A.e && Ie(C, "width", A.e = O), $ !== A.t && Ie(P, "left", A.t = $), T !== A.a && Ie(P, "width", A.a = T), j !== A.o && Ie(N, "left", A.o = j), A;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), n;
    })();
  }
  Fe([
    "click",
    "mousedown"
  ]);
  var Lc = x('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), Pc = x("<div>");
  function Ec(t) {
    const e = t.replay, [r, s] = w(true), [o, i] = w(true), [_, n] = w(void 0), [c, h] = w(0), [v, f] = w(0), [C, P] = w(void 0), N = (p) => {
      p.code === "Enter" ? (e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), o() || m(1)) : p.code === "Escape" && (o() ? (i(false), s(false)) : (i(true), s(true)));
    };
    document.addEventListener("keydown", N), be(() => {
      document.removeEventListener("keydown", N);
    });
    const B = () => e.tiles_path(), [A, O] = w({
      x: -50,
      y: -50,
      deg: 0
    }), [$, T] = w({
      x: -50,
      y: -50,
      deg: 0
    }), [j, K] = w(), [te, W] = w(), J = w([]), L = w([]), M = w([]), Q = w([]), ee = w([]), le = w([]), E = w([]), q = w([]), X = w([]), G = w([]), re = w([]), ie = w([]), ne = w([]), ge = w([]), fe = w([]), ye = w([]), d = w([]), g = w([]), Ne = w([]);
    let Z = performance.now();
    const de = 1e3 / 60;
    let _e = 0, xe = 0;
    function Be() {
      const p = performance.now(), k = Math.min(p - Z, 250);
      Z = p;
      let D = 1;
      const U = e;
      if (o() && _() === void 0) {
        if (r() || v() < c()) {
          for (_e += k; _e >= de; ) {
            if (r()) {
              let { isJump1Pressed: ue, isJump2Pressed: ve, isRightPressed: Ye, isLeftPressed: Xe, isSuicidePressed: Dr } = t.globalEventState;
              U.set_input(ue() || ve(), Ye(), Xe(), Dr());
            }
            U.tick(), _e -= de;
          }
          D = _e / de, f(U.progress());
        } else v() < c() ? (U.tick(), f(U.progress())) : i(false);
        m(D);
      }
      xe = requestAnimationFrame(Be);
    }
    Be(), be(() => {
      cancelAnimationFrame(xe);
    });
    function m(p) {
      O({
        x: e.ninja_x(p),
        y: e.ninja_y(p),
        deg: 0
      }), T({
        x: e.ninja_preview_x(p),
        y: e.ninja_preview_y(p),
        deg: 0
      }), K(e.ninja_bones(p)), C() === void 0 ? W(void 0) : W(e.ninja_preview_bones(p)), B_(J, e), Nl(L, e, p), T_(M, e), Kl(Q, e, p), ql(ee, e, p), $l(le, e), Pl(E, e, p), X_(q, e, p), il(X, e), dl(G, e, p), bl(re, e), z_(ie, e, p), Yl(ne, e, p), g_(ge, e, p), x_(fe, e, p), va(ye, e, p), Ga(d, e, p), La(g, e, p), Oa(Ne, e, p), h(e.replay_length());
    }
    return [
      (() => {
        var p = Lc(), k = p.firstChild;
        k.firstChild;
        var D = k.nextSibling;
        return p.$$mousemove = function(U) {
          const { left: ue, top: ve, width: Ye, height: Xe } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (U.clientX - ue) / Ye * 1056,
            y: (U.clientY - ve) / Xe * 600
          });
        }, b(k, u(Zt, {}), null), b(k, u(or, {}), null), b(k, u(Ut, {}), null), b(k, u(Jt, {}), null), b(k, u(tr, {}), null), b(k, u(_r, {}), null), b(k, u(ar, {}), null), b(k, u(br, {}), null), b(k, u(vr, {}), null), b(k, u(wr, {}), null), b(k, u($r, {}), null), b(k, u(y_, {}), null), b(p, u(Gt, {
          get exitDoors() {
            return ge[0];
          }
        }), D), b(p, u(qt, {
          get oneWays() {
            return M[0];
          }
        }), D), b(p, u(Wt, {
          get mines() {
            return J[0];
          }
        }), D), b(p, u(Ft, {
          get regularDoors() {
            return ie[0];
          }
        }), D), b(p, u(Yt, {
          get lockedDoors() {
            return q[0];
          }
        }), D), b(p, u(Qt, {
          get trapDoors() {
            return G[0];
          }
        }), D), b(p, u(Xt, {
          get lockedSwitches() {
            return X[0];
          }
        }), D), b(p, u(er, {
          get trapSwitches() {
            return re[0];
          }
        }), D), b(p, u(Vt, {
          get exitSwitches() {
            return fe[0];
          }
        }), D), b(p, u(rr, {
          get launchPads() {
            return le[0];
          }
        }), D), b(p, u(mr, {
          get chaingunDrones() {
            return g[0];
          }
        }), D), b(p, u(xr, {
          get laserDrones() {
            return Ne[0];
          }
        }), D), b(p, u(yr, {
          get zapDrones() {
            return ye[0];
          }
        }), D), b(p, u(kr, {
          get chaseDrones() {
            return d[0];
          }
        }), D), b(p, u(sr, {
          get floorGuards() {
            return E[0];
          }
        }), D), b(p, u(lr, {
          get thwumps() {
            return ee[0];
          }
        }), D), b(p, u(We, {
          class: "ninja preview",
          ninja: $,
          bones: te
        }), D), b(p, u(We, {
          class: "ninja",
          ninja: A,
          bones: j
        }), D), b(p, u(nr, {
          get bounceBlocks() {
            return L[0];
          }
        }), D), b(p, u(cr, {
          get shoveThwumps() {
            return ne[0];
          }
        }), D), b(p, u(ir, {
          get boostPads() {
            return Q[0];
          }
        }), D), S(() => y(D, "d", B())), p;
      })(),
      (() => {
        var p = Pc();
        return b(p, u(I, {
          get when() {
            return !r() || !o();
          },
          get children() {
            return u(Tc, {
              isPlaying: o,
              setIsPlaying: i,
              dragStart: _,
              setDragStart: n,
              length: c,
              progress: v,
              previewProgress: C,
              seek: (k) => {
                f(k), e.seek(k), m(1);
              },
              previewSeek: (k) => {
                P(k), e && (k !== void 0 && _() === void 0 && e.seek_preview(k), m(1));
              }
            });
          }
        })), p;
      })()
    ];
  }
  Fe([
    "mousemove"
  ]);
  var Cc = x("<p>Invalid file."), Ac = x("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file><dl><dt>Windows</dt><dd>C:\\Program Files (x86)\\Steam\\steamapps\\common\\N++\\anim_data_line_new.txt.bin</dd><dt>Linux</dt><dd>~/.steam/steam/steamapps/common/N++/anim_data_line_new.txt.bin</dd><dt>Mac</dt><dd>~/Library/Application Support/Steam/steamapps/common/N++/N++.app/Contents/Resources/NPP/anim_data_line_new.txt.bin");
  function Mc() {
    const t = Le.new(), [e, r] = w(), [s, o] = w(""), [i, _] = w(false), [n, c] = w([]);
    function h() {
      const E = [], q = t.past_ninjas_len();
      for (let X = 0; X < q; X++) E.push({
        x: t.past_ninja_x(X),
        y: t.past_ninja_y(X)
      });
      c(E);
    }
    const [v, f] = w(false), [C, P] = w(false), [N, B] = w(false), [A, O] = w(false), [$, T] = w(false), [j, K] = w({
      x: 36,
      y: 36
    }), te = {
      isJump1Pressed: v,
      isJump2Pressed: C,
      isRightPressed: N,
      isLeftPressed: A,
      isSuicidePressed: $,
      mouseGamePos: j,
      setMouseGamePos: K
    };
    Jl(t), o(t.get_level_name()), document.addEventListener("keydown", (E) => {
      if (!(E.ctrlKey || E.metaKey)) if (E.code === "Tab") {
        const q = e();
        q ? (r(void 0), q.send_past_ninjas(), t.receive_past_ninjas(), q.free(), h()) : r(t.to_replay(i())), E.preventDefault();
      } else E.code === "KeyZ" ? f(true) : E.code === "ArrowUp" ? P(true) : E.code === "ArrowRight" ? B(true) : E.code === "ArrowLeft" ? O(true) : E.code === "KeyV" && T(true);
    }), document.addEventListener("keyup", (E) => {
      E.code === "KeyZ" ? f(false) : E.code === "ArrowUp" ? P(false) : E.code === "ArrowRight" ? B(false) : E.code === "ArrowLeft" ? O(false) : E.code === "KeyV" && T(false);
    }), document.addEventListener("blur", () => {
      f(false), P(false), B(false), O(false), T(false);
    }), ea(t);
    const W = 0, J = 1, L = 2, [M, Q] = w(t.get_anim_state() == W ? W : L), [ee, le] = w(sa());
    return Pr(() => {
      const E = ee();
      E && (aa(E.colors), ta(E));
    }), la().then(() => {
      const E = ee();
      if (E) {
        const q = fr(E.name);
        q && (E.colors = q), le(E);
      }
    }), [
      u(I, {
        get when() {
          return M() != W;
        },
        get children() {
          var E = Ac(), q = E.firstChild, X = q.nextSibling;
          return X.nextSibling, X.addEventListener("change", function() {
            const G = this.files;
            if (G && G.length > 0) {
              const re = new FileReader();
              re.onloadend = () => {
                if (re.result instanceof ArrayBuffer) {
                  const ie = new Uint8Array(re.result);
                  try {
                    try {
                      Ql(ie);
                    } catch (ne) {
                      console.error(ne);
                    }
                    t.set_anim_data(ie), Q(t.get_anim_state());
                  } catch (ne) {
                    console.error(ne), Q(J);
                  }
                }
              }, re.readAsArrayBuffer(G[0]);
            }
          }), b(E, u(I, {
            get when() {
              return M() == J;
            },
            get children() {
              return Cc();
            }
          }), null), E;
        }
      }),
      u(I, {
        get when() {
          return De(() => M() == W)() && !e();
        },
        get children() {
          return u(Dc, {
            editor: t,
            setReplay: r,
            pastNinjas: n,
            globalEventState: te,
            levelName: s,
            setLevelName: o,
            roundCorners: i,
            setRoundCorners: _,
            palette: ee,
            setPalette: le
          });
        }
      }),
      u(I, {
        get when() {
          return De(() => M() == W)() && !!e();
        },
        keyed: true,
        get children() {
          return u(Ec, {
            get replay() {
              return e();
            },
            globalEventState: te
          });
        }
      })
    ];
  }
  const jc = document.getElementById("root");
  Rr(() => u(Mc, {}), jc);
})();
