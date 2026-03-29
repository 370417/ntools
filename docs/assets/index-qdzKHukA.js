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
  const Tr = false, Lr = (t, e) => t === e, Mt = Symbol("solid-track"), He = {
    equals: Lr
  };
  let jt = It;
  const he = 1, ze = 2, Nt = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var V = null;
  let Je = null, Er = null, H = null, X = null, ae = null, Ze = 0;
  function Te(t, e) {
    const r = H, s = V, o = t.length === 0, i = e === void 0 ? s : e, _ = o ? Nt : {
      owned: null,
      cleanups: null,
      context: i ? i.context : null,
      owner: i
    }, n = o ? t : () => t(() => oe(() => Pe(_)));
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
    }, s = (o) => (typeof o == "function" && (o = o(r.value)), Ot(r, o));
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
    jt = jr;
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
  function Cr(t) {
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
      const t = X;
      X = null, je(() => Ve(this), false), X = t;
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
  function Ot(t, e, r) {
    let s = t.value;
    return (!t.comparator || !t.comparator(s, e)) && (t.value = e, t.observers && t.observers.length && je(() => {
      for (let o = 0; o < t.observers.length; o += 1) {
        const i = t.observers[o], _ = Je && Je.running;
        _ && Je.disposed.has(i), (_ ? !i.tState : !i.state) && (i.pure ? X.push(i) : ae.push(i), i.observers && Rt(i)), _ || (i.state = he);
      }
      if (X.length > 1e6) throw X = [], new Error();
    }, false)), e;
  }
  function Me(t) {
    if (!t.fn) return;
    Pe(t);
    const e = Ze;
    Ar(t, t.value, e);
  }
  function Ar(t, e, r) {
    let s;
    const o = V, i = H;
    H = V = t;
    try {
      s = t.fn(e);
    } catch (_) {
      return t.pure && (t.state = he, t.owned && t.owned.forEach(Pe), t.owned = null), t.updatedAt = r + 1, Kt(_);
    } finally {
      H = i, V = o;
    }
    (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? Ot(t, s) : t.value = s, t.updatedAt = r);
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
      const s = X;
      X = null, je(() => Ve(t, e[0]), false), X = s;
    }
  }
  function je(t, e) {
    if (X) return t();
    let r = false;
    e || (X = []), ae ? r = true : ae = [], Ze++;
    try {
      const s = t();
      return Mr(r), s;
    } catch (s) {
      r || (ae = null), X = null, Kt(s);
    }
  }
  function Mr(t) {
    if (X && (It(X), X = null), t) return;
    const e = ae;
    ae = null, e.length && je(() => jt(e), false);
  }
  function It(t) {
    for (let e = 0; e < t.length; e++) Ge(t[e]);
  }
  function jr(t) {
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
      r.state || (r.state = ze, r.pure ? X.push(r) : ae.push(r), r.observers && Rt(r));
    }
  }
  function Pe(t) {
    let e;
    if (t.sources) for (; t.sources.length; ) {
      const r = t.sources.pop(), s = t.sourceSlots.pop(), o = r.observers;
      if (o && o.length) {
        const i = o.pop(), _ = r.observerSlots.pop();
        s < o.length && (i.sourceSlots[_] = s, o[s] = i, r.observerSlots[s] = _);
      }
    }
    if (t.tOwned) {
      for (e = t.tOwned.length - 1; e >= 0; e--) Pe(t.tOwned[e]);
      delete t.tOwned;
    }
    if (t.owned) {
      for (e = t.owned.length - 1; e >= 0; e--) Pe(t.owned[e]);
      t.owned = null;
    }
    if (t.cleanups) {
      for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
      t.cleanups = null;
    }
    t.state = 0;
  }
  function Nr(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function Kt(t, e = V) {
    throw Nr(t);
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
  function Ue(t) {
    for (let e = 0; e < t.length; e++) t[e]();
  }
  function Br(t, e, r = {}) {
    let s = [], o = [], i = [], _ = 0, n = e.length > 1 ? [] : null;
    return be(() => Ue(i)), () => {
      let c = t() || [], h = c.length, v, f;
      return c[Mt], oe(() => {
        let E, j, N, K, O, k, T, A, I;
        if (h === 0) _ !== 0 && (Ue(i), i = [], s = [], o = [], _ = 0, n && (n = [])), r.fallback && (s = [
          _t
        ], o[0] = Te((W) => (i[0] = W, r.fallback())), _ = 1);
        else if (_ === 0) {
          for (o = new Array(h), f = 0; f < h; f++) s[f] = c[f], o[f] = Te(C);
          _ = h;
        } else {
          for (N = new Array(h), K = new Array(h), n && (O = new Array(h)), k = 0, T = Math.min(_, h); k < T && s[k] === c[k]; k++) ;
          for (T = _ - 1, A = h - 1; T >= k && A >= k && s[T] === c[A]; T--, A--) N[A] = o[T], K[A] = i[T], n && (O[A] = n[T]);
          for (E = /* @__PURE__ */ new Map(), j = new Array(A + 1), f = A; f >= k; f--) I = c[f], v = E.get(I), j[f] = v === void 0 ? -1 : v, E.set(I, f);
          for (v = k; v <= T; v++) I = s[v], f = E.get(I), f !== void 0 && f !== -1 ? (N[f] = o[v], K[f] = i[v], n && (O[f] = n[v]), f = j[f], E.set(I, f)) : i[v]();
          for (f = k; f < h; f++) f in N ? (o[f] = N[f], i[f] = K[f], n && (n[f] = O[f], n[f](f))) : o[f] = Te(C);
          o = o.slice(0, _ = h), s = c.slice(0);
        }
        return o;
      });
      function C(E) {
        if (i[f] = E, n) {
          const [j, N] = w(f);
          return n[f] = N, e(c[f], j);
        }
        return e(c[f]);
      }
    };
  }
  function Or(t, e, r = {}) {
    let s = [], o = [], i = [], _ = [], n = 0, c;
    return be(() => Ue(i)), () => {
      const h = t() || [], v = h.length;
      return h[Mt], oe(() => {
        if (v === 0) return n !== 0 && (Ue(i), i = [], s = [], o = [], n = 0, _ = []), r.fallback && (s = [
          _t
        ], o[0] = Te((C) => (i[0] = C, r.fallback())), n = 1), o;
        for (s[0] === _t && (i[0](), i = [], s = [], o = [], n = 0), c = 0; c < v; c++) c < s.length && s[c] !== h[c] ? _[c](() => h[c]) : c >= s.length && (o[c] = Te(f));
        for (; c < s.length; c++) i[c]();
        return n = _.length = i.length = v, s = h.slice(0), o = o.slice(0, n);
      });
      function f(C) {
        i[c] = C;
        const [E, j] = w(h[c]);
        return _[c] = j, e(E, c);
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
    return se(Br(() => t.each, t.children, e || void 0));
  }
  function z(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return se(Or(() => t.each, t.children, e || void 0));
  }
  function B(t) {
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
    const e = Cr(() => t.children), r = se(() => {
      const s = e(), o = Array.isArray(s) ? s : [
        s
      ];
      let i = () => {
      };
      for (let _ = 0; _ < o.length; _++) {
        const n = _, c = o[_], h = i, v = se(() => h() ? void 0 : c.when, void 0, void 0), f = c.keyed ? v : se(v, void 0, {
          equals: (C, E) => !C == !E
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
  const Se = (t) => se(() => t());
  function Rr(t, e, r) {
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
          let f = _, C = 1, E;
          for (; ++f < o && f < i && !((E = h.get(e[f])) == null || E !== v + C); ) C++;
          if (C > v - n) {
            const j = e[_];
            for (; n < v; ) t.insertBefore(r[n++], j);
          } else t.replaceChild(r[n++], e[_++]);
        } else _++;
        else e[_++].remove();
      }
    }
  }
  const pt = "_$DX_DELEGATE";
  function Kr(t, e, r, s = {}) {
    let o;
    return Te((i) => {
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
      r.has(i) || (r.add(i), e.addEventListener(i, zr));
    }
  }
  function y(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function Oe(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function Hr(t, e, r) {
    return oe(() => t(e, r));
  }
  function b(t, e, r, s) {
    if (r !== void 0 && !s && (s = []), typeof e != "function") return qe(t, e, s, r);
    S((o) => qe(t, e(), o, r), s);
  }
  function zr(t) {
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
  function qe(t, e, r, s, o) {
    for (; typeof r == "function"; ) r = r();
    if (e === r) return r;
    const i = typeof e, _ = s !== void 0;
    if (t = _ && r[0] && r[0].parentNode || t, i === "string" || i === "number") {
      if (i === "number" && (e = e.toString(), e === r)) return r;
      if (_) {
        let n = r[0];
        n && n.nodeType === 3 ? n.data !== e && (n.data = e) : n = document.createTextNode(e), r = $e(t, r, s, n);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || i === "boolean") r = $e(t, r, s);
    else {
      if (i === "function") return S(() => {
        let n = e();
        for (; typeof n == "function"; ) n = n();
        r = qe(t, n, r, s);
      }), () => r;
      if (Array.isArray(e)) {
        const n = [], c = r && Array.isArray(r);
        if (lt(n, e, r, o)) return S(() => r = qe(t, n, r, s, true)), () => r;
        if (n.length === 0) {
          if (r = $e(t, r, s), _) return r;
        } else c ? r.length === 0 ? ht(t, n, s) : Rr(t, r, n) : (r && $e(t), ht(t, n));
        r = n;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (_) return r = $e(t, r, s, e);
          $e(t, r, null, e);
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
  function $e(t, e, r, s) {
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
  const Gr = "" + new URL("ntools_rs_bg-BN517q0S.wasm", import.meta.url).href, Vr = async (t = {}, e) => {
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
  function Ur(t) {
    l = t;
  }
  let Ie = null;
  function Le() {
    return (Ie === null || Ie.byteLength === 0) && (Ie = new Uint8Array(l.memory.buffer)), Ie;
  }
  let Ke = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  Ke.decode();
  const qr = 2146435072;
  let Qe = 0;
  function Wr(t, e) {
    return Qe += e, Qe >= qr && (Ke = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), Ke.decode(), Qe = e), Ke.decode(Le().subarray(t, t + e));
  }
  function we(t, e) {
    return t = t >>> 0, Wr(t, e);
  }
  function zt(t, e) {
    return t = t >>> 0, Le().subarray(t / 1, t / 1 + e);
  }
  let me = 0;
  function et(t, e) {
    const r = e(t.length * 1, 1) >>> 0;
    return Le().set(t, r / 1), me = t.length, r;
  }
  function tt(t) {
    const e = l.__wbindgen_externrefs.get(t);
    return l.__externref_table_dealloc(t), e;
  }
  const Ee = new TextEncoder();
  "encodeInto" in Ee || (Ee.encodeInto = function(t, e) {
    const r = Ee.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function Zr(t, e, r) {
    if (r === void 0) {
      const n = Ee.encode(t), c = e(n.length, 1) >>> 0;
      return Le().subarray(c, c + n.length).set(n), me = n.length, c;
    }
    let s = t.length, o = e(s, 1) >>> 0;
    const i = Le();
    let _ = 0;
    for (; _ < s; _++) {
      const n = t.charCodeAt(_);
      if (n > 127) break;
      i[o + _] = n;
    }
    if (_ !== s) {
      _ !== 0 && (t = t.slice(_)), o = r(o, s, s = _ + t.length * 3, 1) >>> 0;
      const n = Le().subarray(o + _, o + s), c = Ee.encodeInto(t, n);
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
  let De = null;
  function Yr() {
    return (De === null || De.buffer.detached === true || De.buffer.detached === void 0 && De.buffer !== l.memory.buffer) && (De = new DataView(l.memory.buffer)), De;
  }
  function gt(t, e) {
    t = t >>> 0;
    const r = Yr(), s = [];
    for (let o = t; o < t + 4 * e; o += 4) s.push(l.__wbindgen_externrefs.get(r.getUint32(o, true)));
    return l.__externref_drop_slice(t, e), s;
  }
  function Xr(t, e) {
    if (!(t instanceof e)) throw new Error(`expected instance of ${e.name}`);
  }
  const ft = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_editor_free(t >>> 0, 1));
  class xe {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(xe.prototype);
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
      var r = zt(e[0], e[1]).slice();
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
      return xe.__wrap(e);
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
  Symbol.dispose && (xe.prototype[Symbol.dispose] = xe.prototype.free);
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
    export_attract(e) {
      Xr(e, xe);
      const r = l.replay_export_attract(this.__wbg_ptr, e.__wbg_ptr);
      var s = zt(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 1, 1), s;
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
  function Jr(t, e) {
    throw new Error(we(t, e));
  }
  function Qr(t) {
    return Ce.__wrap(t);
  }
  function es(t, e) {
    return we(t, e);
  }
  function ts() {
    const t = l.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const a = await Vr({
    "./ntools_rs_bg.js": {
      __wbg_exportedentity_new: Qr,
      __wbg___wbindgen_throw_b855445ff6a94295: Jr,
      __wbindgen_init_externref_table: ts,
      __wbindgen_cast_2241b6af4c4b2941: es
    }
  }, Gr), rs = a.memory, ss = a.__wbg_editor_free, ns = a.editor_crosshair_x, os = a.editor_crosshair_y, is = a.editor_cursor_down, _s = a.editor_cursor_up, ls = a.editor_double_click, as = a.editor_entities, cs = a.editor_export_map, ds = a.editor_get_anim_state, us = a.editor_get_level_name, ps = a.editor_get_show_trail, hs = a.editor_load_attract, gs = a.editor_load_map, fs = a.editor_mode, ys = a.editor_new, ws = a.editor_palette_center_x, ms = a.editor_palette_center_y, bs = a.editor_palette_selection_x, xs = a.editor_palette_selection_y, vs = a.editor_past_ninja_bones, ks = a.editor_past_ninja_x, $s = a.editor_past_ninja_y, Ds = a.editor_past_ninjas_len, Ss = a.editor_press_0, Ts = a.editor_press_1, Ls = a.editor_press_2, Es = a.editor_press_3, Ps = a.editor_press_4, Cs = a.editor_press_5, As = a.editor_press_6, Ms = a.editor_press_7, js = a.editor_press_8, Ns = a.editor_press_9, Bs = a.editor_press_a, Os = a.editor_press_alt_left, Is = a.editor_press_backtick, Rs = a.editor_press_bracket_left, Ks = a.editor_press_bracket_right, Hs = a.editor_press_c, zs = a.editor_press_comma, Gs = a.editor_press_d, Vs = a.editor_press_dash, Us = a.editor_press_down, qs = a.editor_press_e, Ws = a.editor_press_enter, Zs = a.editor_press_equals, Fs = a.editor_press_escape, Ys = a.editor_press_f, Xs = a.editor_press_h, Js = a.editor_press_i, Qs = a.editor_press_j, en = a.editor_press_k, tn = a.editor_press_l, rn = a.editor_press_left, sn = a.editor_press_m, nn = a.editor_press_n, on = a.editor_press_num_0, _n = a.editor_press_num_3, ln = a.editor_press_num_7, an = a.editor_press_o, cn = a.editor_press_p, dn = a.editor_press_q, un = a.editor_press_r, pn = a.editor_press_right, hn = a.editor_press_s, gn = a.editor_press_shift, fn = a.editor_press_slash, yn = a.editor_press_space, wn = a.editor_press_t, mn = a.editor_press_up, bn = a.editor_press_w, xn = a.editor_press_x, vn = a.editor_press_y, kn = a.editor_press_z, $n = a.editor_preview_entities, Dn = a.editor_receive_past_ninjas, Sn = a.editor_redo, Tn = a.editor_release_a, Ln = a.editor_release_alt_left, En = a.editor_release_c, Pn = a.editor_release_d, Cn = a.editor_release_e, An = a.editor_release_q, Mn = a.editor_release_s, jn = a.editor_release_shift, Nn = a.editor_release_space, Bn = a.editor_release_w, On = a.editor_release_z, In = a.editor_selected_tile_outline_path, Rn = a.editor_selected_tiles_path, Kn = a.editor_set_anim_data, Hn = a.editor_set_cursor_pos, zn = a.editor_set_level_name, Gn = a.editor_set_show_trail, Vn = a.editor_show_half_grid, Un = a.editor_show_quarter_grid, qn = a.editor_tile_crosshair_col, Wn = a.editor_tile_crosshair_row, Zn = a.editor_tiles_path, Fn = a.editor_to_replay, Yn = a.editor_undo, Xn = a.__wbg_exportedentity_free, Jn = a.__wbg_get_exportedentity_deg, Qn = a.__wbg_get_exportedentity_mode, eo = a.__wbg_get_exportedentity_switch_x, to = a.__wbg_get_exportedentity_switch_y, ro = a.__wbg_get_exportedentity_type_int, so = a.__wbg_get_exportedentity_x, no = a.__wbg_get_exportedentity_y, oo = a.__wbg_set_exportedentity_deg, io = a.__wbg_set_exportedentity_mode, _o = a.__wbg_set_exportedentity_switch_x, lo = a.__wbg_set_exportedentity_switch_y, ao = a.__wbg_set_exportedentity_type_int, co = a.__wbg_set_exportedentity_x, uo = a.__wbg_set_exportedentity_y, po = a.__wbg_replay_free, ho = a.replay_boost_pad_anim_progress, go = a.replay_boost_pad_deg, fo = a.replay_boost_pad_x, yo = a.replay_boost_pad_y, wo = a.replay_boost_pads_len, mo = a.replay_bounce_block_deg, bo = a.replay_bounce_block_x, xo = a.replay_bounce_block_y, vo = a.replay_bounce_blocks_len, ko = a.replay_chaingun_drone_deg, $o = a.replay_chaingun_drone_x, Do = a.replay_chaingun_drone_y, So = a.replay_chaingun_drones_len, To = a.replay_chase_drone_deg, Lo = a.replay_chase_drone_x, Eo = a.replay_chase_drone_y, Po = a.replay_chase_drones_len, Co = a.replay_exit_anim_progress, Ao = a.replay_exit_door_x, Mo = a.replay_exit_door_y, jo = a.replay_exit_doors_len, No = a.replay_exit_switch_x, Bo = a.replay_exit_switch_y, Oo = a.replay_export_attract, Io = a.replay_floor_guard_deg, Ro = a.replay_floor_guard_x, Ko = a.replay_floor_guard_y, Ho = a.replay_floor_guards_len, zo = a.replay_laser_drone_deg, Go = a.replay_laser_drone_x, Vo = a.replay_laser_drone_y, Uo = a.replay_laser_drones_len, qo = a.replay_launch_pad_deg, Wo = a.replay_launch_pad_x, Zo = a.replay_launch_pad_y, Fo = a.replay_launch_pads_len, Yo = a.replay_locked_door_anim_progress, Xo = a.replay_locked_door_deg, Jo = a.replay_locked_door_x, Qo = a.replay_locked_door_y, ei = a.replay_locked_doors_len, ti = a.replay_locked_switch_x, ri = a.replay_locked_switch_y, si = a.replay_mine_state, ni = a.replay_mine_x, oi = a.replay_mine_y, ii = a.replay_mines_len, _i = a.replay_ninja_bones, li = a.replay_ninja_preview_bones, ai = a.replay_ninja_preview_x, ci = a.replay_ninja_preview_y, di = a.replay_ninja_x, ui = a.replay_ninja_y, pi = a.replay_one_way_deg, hi = a.replay_one_way_x, gi = a.replay_one_way_y, fi = a.replay_one_ways_len, yi = a.replay_place_ninja, wi = a.replay_progress, mi = a.replay_progress_preview, bi = a.replay_regular_door_anim_progress, xi = a.replay_regular_door_deg, vi = a.replay_regular_door_x, ki = a.replay_regular_door_y, $i = a.replay_regular_doors_len, Di = a.replay_replay_length, Si = a.replay_seek, Ti = a.replay_seek_preview, Li = a.replay_send_past_ninjas, Ei = a.replay_set_input, Pi = a.replay_shove_thwump_deg, Ci = a.replay_shove_thwump_touch, Ai = a.replay_shove_thwump_x, Mi = a.replay_shove_thwump_y, ji = a.replay_shove_thwumps_len, Ni = a.replay_thwump_deg, Bi = a.replay_thwump_x, Oi = a.replay_thwump_y, Ii = a.replay_thwumps_len, Ri = a.replay_tick, Ki = a.replay_tiles_path, Hi = a.replay_trap_door_anim_progress, zi = a.replay_trap_door_deg, Gi = a.replay_trap_door_x, Vi = a.replay_trap_door_y, Ui = a.replay_trap_doors_len, qi = a.replay_trap_switch_x, Wi = a.replay_trap_switch_y, Zi = a.replay_zap_drone_deg, Fi = a.replay_zap_drone_x, Yi = a.replay_zap_drone_y, Xi = a.replay_zap_drones_len, Ji = a.editor_press_num_1, Qi = a.editor_press_num_2, e_ = a.editor_press_num_4, t_ = a.editor_press_num_5, r_ = a.editor_press_u, s_ = a.__wbindgen_externrefs, n_ = a.__wbindgen_free, o_ = a.__wbindgen_malloc, i_ = a.__externref_table_dealloc, __ = a.__wbindgen_realloc, l_ = a.__externref_drop_slice, Gt = a.__wbindgen_start, a_ = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: l_,
    __externref_table_dealloc: i_,
    __wbg_editor_free: ss,
    __wbg_exportedentity_free: Xn,
    __wbg_get_exportedentity_deg: Jn,
    __wbg_get_exportedentity_mode: Qn,
    __wbg_get_exportedentity_switch_x: eo,
    __wbg_get_exportedentity_switch_y: to,
    __wbg_get_exportedentity_type_int: ro,
    __wbg_get_exportedentity_x: so,
    __wbg_get_exportedentity_y: no,
    __wbg_replay_free: po,
    __wbg_set_exportedentity_deg: oo,
    __wbg_set_exportedentity_mode: io,
    __wbg_set_exportedentity_switch_x: _o,
    __wbg_set_exportedentity_switch_y: lo,
    __wbg_set_exportedentity_type_int: ao,
    __wbg_set_exportedentity_x: co,
    __wbg_set_exportedentity_y: uo,
    __wbindgen_externrefs: s_,
    __wbindgen_free: n_,
    __wbindgen_malloc: o_,
    __wbindgen_realloc: __,
    __wbindgen_start: Gt,
    editor_crosshair_x: ns,
    editor_crosshair_y: os,
    editor_cursor_down: is,
    editor_cursor_up: _s,
    editor_double_click: ls,
    editor_entities: as,
    editor_export_map: cs,
    editor_get_anim_state: ds,
    editor_get_level_name: us,
    editor_get_show_trail: ps,
    editor_load_attract: hs,
    editor_load_map: gs,
    editor_mode: fs,
    editor_new: ys,
    editor_palette_center_x: ws,
    editor_palette_center_y: ms,
    editor_palette_selection_x: bs,
    editor_palette_selection_y: xs,
    editor_past_ninja_bones: vs,
    editor_past_ninja_x: ks,
    editor_past_ninja_y: $s,
    editor_past_ninjas_len: Ds,
    editor_press_0: Ss,
    editor_press_1: Ts,
    editor_press_2: Ls,
    editor_press_3: Es,
    editor_press_4: Ps,
    editor_press_5: Cs,
    editor_press_6: As,
    editor_press_7: Ms,
    editor_press_8: js,
    editor_press_9: Ns,
    editor_press_a: Bs,
    editor_press_alt_left: Os,
    editor_press_backtick: Is,
    editor_press_bracket_left: Rs,
    editor_press_bracket_right: Ks,
    editor_press_c: Hs,
    editor_press_comma: zs,
    editor_press_d: Gs,
    editor_press_dash: Vs,
    editor_press_down: Us,
    editor_press_e: qs,
    editor_press_enter: Ws,
    editor_press_equals: Zs,
    editor_press_escape: Fs,
    editor_press_f: Ys,
    editor_press_h: Xs,
    editor_press_i: Js,
    editor_press_j: Qs,
    editor_press_k: en,
    editor_press_l: tn,
    editor_press_left: rn,
    editor_press_m: sn,
    editor_press_n: nn,
    editor_press_num_0: on,
    editor_press_num_1: Ji,
    editor_press_num_2: Qi,
    editor_press_num_3: _n,
    editor_press_num_4: e_,
    editor_press_num_5: t_,
    editor_press_num_7: ln,
    editor_press_o: an,
    editor_press_p: cn,
    editor_press_q: dn,
    editor_press_r: un,
    editor_press_right: pn,
    editor_press_s: hn,
    editor_press_shift: gn,
    editor_press_slash: fn,
    editor_press_space: yn,
    editor_press_t: wn,
    editor_press_u: r_,
    editor_press_up: mn,
    editor_press_w: bn,
    editor_press_x: xn,
    editor_press_y: vn,
    editor_press_z: kn,
    editor_preview_entities: $n,
    editor_receive_past_ninjas: Dn,
    editor_redo: Sn,
    editor_release_a: Tn,
    editor_release_alt_left: Ln,
    editor_release_c: En,
    editor_release_d: Pn,
    editor_release_e: Cn,
    editor_release_q: An,
    editor_release_s: Mn,
    editor_release_shift: jn,
    editor_release_space: Nn,
    editor_release_w: Bn,
    editor_release_z: On,
    editor_selected_tile_outline_path: In,
    editor_selected_tiles_path: Rn,
    editor_set_anim_data: Kn,
    editor_set_cursor_pos: Hn,
    editor_set_level_name: zn,
    editor_set_show_trail: Gn,
    editor_show_half_grid: Vn,
    editor_show_quarter_grid: Un,
    editor_tile_crosshair_col: qn,
    editor_tile_crosshair_row: Wn,
    editor_tiles_path: Zn,
    editor_to_replay: Fn,
    editor_undo: Yn,
    memory: rs,
    replay_boost_pad_anim_progress: ho,
    replay_boost_pad_deg: go,
    replay_boost_pad_x: fo,
    replay_boost_pad_y: yo,
    replay_boost_pads_len: wo,
    replay_bounce_block_deg: mo,
    replay_bounce_block_x: bo,
    replay_bounce_block_y: xo,
    replay_bounce_blocks_len: vo,
    replay_chaingun_drone_deg: ko,
    replay_chaingun_drone_x: $o,
    replay_chaingun_drone_y: Do,
    replay_chaingun_drones_len: So,
    replay_chase_drone_deg: To,
    replay_chase_drone_x: Lo,
    replay_chase_drone_y: Eo,
    replay_chase_drones_len: Po,
    replay_exit_anim_progress: Co,
    replay_exit_door_x: Ao,
    replay_exit_door_y: Mo,
    replay_exit_doors_len: jo,
    replay_exit_switch_x: No,
    replay_exit_switch_y: Bo,
    replay_export_attract: Oo,
    replay_floor_guard_deg: Io,
    replay_floor_guard_x: Ro,
    replay_floor_guard_y: Ko,
    replay_floor_guards_len: Ho,
    replay_laser_drone_deg: zo,
    replay_laser_drone_x: Go,
    replay_laser_drone_y: Vo,
    replay_laser_drones_len: Uo,
    replay_launch_pad_deg: qo,
    replay_launch_pad_x: Wo,
    replay_launch_pad_y: Zo,
    replay_launch_pads_len: Fo,
    replay_locked_door_anim_progress: Yo,
    replay_locked_door_deg: Xo,
    replay_locked_door_x: Jo,
    replay_locked_door_y: Qo,
    replay_locked_doors_len: ei,
    replay_locked_switch_x: ti,
    replay_locked_switch_y: ri,
    replay_mine_state: si,
    replay_mine_x: ni,
    replay_mine_y: oi,
    replay_mines_len: ii,
    replay_ninja_bones: _i,
    replay_ninja_preview_bones: li,
    replay_ninja_preview_x: ai,
    replay_ninja_preview_y: ci,
    replay_ninja_x: di,
    replay_ninja_y: ui,
    replay_one_way_deg: pi,
    replay_one_way_x: hi,
    replay_one_way_y: gi,
    replay_one_ways_len: fi,
    replay_place_ninja: yi,
    replay_progress: wi,
    replay_progress_preview: mi,
    replay_regular_door_anim_progress: bi,
    replay_regular_door_deg: xi,
    replay_regular_door_x: vi,
    replay_regular_door_y: ki,
    replay_regular_doors_len: $i,
    replay_replay_length: Di,
    replay_seek: Si,
    replay_seek_preview: Ti,
    replay_send_past_ninjas: Li,
    replay_set_input: Ei,
    replay_shove_thwump_deg: Pi,
    replay_shove_thwump_touch: Ci,
    replay_shove_thwump_x: Ai,
    replay_shove_thwump_y: Mi,
    replay_shove_thwumps_len: ji,
    replay_thwump_deg: Ni,
    replay_thwump_x: Bi,
    replay_thwump_y: Oi,
    replay_thwumps_len: Ii,
    replay_tick: Ri,
    replay_tiles_path: Ki,
    replay_trap_door_anim_progress: Hi,
    replay_trap_door_deg: zi,
    replay_trap_door_x: Gi,
    replay_trap_door_y: Vi,
    replay_trap_doors_len: Ui,
    replay_trap_switch_x: qi,
    replay_trap_switch_y: Wi,
    replay_zap_drone_deg: Zi,
    replay_zap_drone_x: Fi,
    replay_zap_drone_y: Yi,
    replay_zap_drones_len: Xi
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  Ur(a_);
  Gt();
  function c_({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var d_ = x("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const u_ = [
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
      return r ? u_.map(([s, o]) => `M ${20 * r[s]} ${20 * r[s + 13]} ${20 * r[o]} ${20 * r[o + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = d_();
      return S((s) => {
        var o = t.class, i = c_(t.ninja()), _ = e();
        return o !== s.e && y(r, "class", s.e = o), i !== s.t && y(r, "transform", s.t = i), _ !== s.a && y(r, "d", s.a = _), s;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var p_ = x("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), h_ = x("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function g_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function f_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function y_([t, e], r, s) {
    const o = t(), i = r.exit_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.exit_door_x(n),
        y: r.exit_door_y(n),
        animProgress: r.exit_anim_progress(n, s)
      };
      c && g_(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function Vt(t) {
    return u(z, {
      get each() {
        return t.exitDoors();
      },
      children: (e) => u(w_, {
        exitDoor: e
      })
    });
  }
  const Y = 11, R = 2.5;
  function w_(t) {
    return (() => {
      var e = p_(), r = e.firstChild, s = r.nextSibling, o = s.nextSibling, i = o.nextSibling, _ = i.nextSibling;
      return S((n) => {
        var c = f_(t.exitDoor), h = -13 + 4 * (1 - t.exitDoor().animProgress), v = 26 - 8 * (1 - t.exitDoor().animProgress), f = `M ${-13 * t.exitDoor().animProgress} 0 v ${-Y} h ${-Y + R} l ${-R} ${R} v ${2 * (Y - R)} l ${R} ${R} h ${Y - R} z`, C = `M ${13 * t.exitDoor().animProgress} 0 v ${-Y} h ${Y - R} l ${R} ${R} v ${2 * (Y - R)} l ${-R} ${R} h ${-Y + R} z`, E = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * Y} v ${t.exitDoor().animProgress * Y} h ${-Y + R + t.exitDoor().animProgress} l ${-R} ${-R} v ${(1 - t.exitDoor().animProgress) * (-Y + R)}`, j = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * Y} v ${t.exitDoor().animProgress * Y} h ${Y - R - t.exitDoor().animProgress} l ${R} ${-R} v ${(1 - t.exitDoor().animProgress) * (-Y + R)}`;
        return c !== n.e && y(e, "transform", n.e = c), h !== n.t && y(r, "x", n.t = h), v !== n.a && y(r, "width", n.a = v), f !== n.o && y(s, "d", n.o = f), C !== n.i && y(o, "d", n.i = C), E !== n.n && y(i, "d", n.n = E), j !== n.s && y(_, "d", n.s = j), n;
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
  function m_() {
    return h_();
  }
  var b_ = x('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function x_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function v_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function k_([t, e], r, s) {
    const o = t(), i = r.exit_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.exit_switch_x(n),
        y: r.exit_switch_y(n),
        animProgress: r.exit_anim_progress(n, s)
      };
      c && x_(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function Ut(t) {
    return u(z, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => u($_, {
        exitSwitch: e
      })
    });
  }
  const pe = 2;
  function $_(t) {
    return (() => {
      var e = b_(), r = e.firstChild, s = r.nextSibling, o = s.nextSibling;
      return S((i) => {
        var _ = v_(t.exitSwitch), n = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, h = `M ${-2 * t.exitSwitch().animProgress} ${-pe} h ${-pe} v ${2 * pe} h ${pe}`, v = `M ${2 * t.exitSwitch().animProgress} ${-pe} h ${pe} v ${2 * pe} h ${-pe}`;
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
  var D_ = x("<svg><use href=#one-way></svg>", false, true, false), S_ = x("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function T_(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function L_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function E_([t, e], r) {
    const s = t(), o = r.one_ways_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.one_way_x(_),
        y: r.one_way_y(_),
        deg: r.one_way_deg(_)
      };
      n && T_(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function qt(t) {
    return u(z, {
      get each() {
        return t.oneWays();
      },
      children: (e) => (() => {
        var r = D_();
        return S(() => y(r, "transform", L_(e))), r;
      })()
    });
  }
  function Wt() {
    return (() => {
      var t = S_(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var P_ = x("<svg><use></svg>", false, true, false), C_ = x("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), A_ = x("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), M_ = x("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const j_ = 0, N_ = 1;
  function B_(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function O_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function I_([t, e], r) {
    const s = t(), o = r.mines_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.mine_x(_),
        y: r.mine_y(_),
        type: r.mine_state(_)
      };
      n && B_(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function Zt(t) {
    return u(z, {
      get each() {
        return t.mines();
      },
      children: (e) => (() => {
        var r = P_();
        return S((s) => {
          var o = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][e().type], i = O_(e);
          return o !== s.e && y(r, "href", s.e = o), i !== s.t && y(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function Ft() {
    return [
      (() => {
        var t = C_(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, o = s.nextSibling, i = o.nextSibling;
        return i.nextSibling, t;
      })(),
      (() => {
        var t = A_();
        return t.firstChild, t;
      })(),
      (() => {
        var t = M_();
        return t.firstChild, t;
      })()
    ];
  }
  var R_ = x("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), K_ = x("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), H_ = x("<svg><g class=regular-door></svg>", false, true, false);
  function z_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function G_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function V_([t, e], r, s) {
    const o = t(), i = r.regular_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.regular_door_x(n),
        y: r.regular_door_y(n),
        deg: r.regular_door_deg(n),
        animProgress: r.regular_door_anim_progress(n, s)
      };
      c && z_(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function Yt(t) {
    return u(z, {
      get each() {
        return t.regularDoors();
      },
      children: (e) => u(W_, {
        regularDoor: e
      })
    });
  }
  const U_ = 1, q_ = 12 - U_;
  function W_(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (q_ - 0) * r;
    }
    return (() => {
      var r = H_();
      return b(r, u(B, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var s = R_();
              return S(() => y(s, "x2", -e())), s;
            })(),
            (() => {
              var s = K_();
              return S(() => y(s, "x2", e())), s;
            })()
          ];
        }
      })), S(() => y(r, "transform", G_(t.regularDoor))), r;
    })();
  }
  var Z_ = x("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), F_ = x("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), mt = x("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), Y_ = x("<svg><g class=locked-door></svg>", false, true, false);
  function X_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function J_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Q_([t, e], r, s) {
    const o = t(), i = r.locked_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.locked_door_x(n),
        y: r.locked_door_y(n),
        deg: r.locked_door_deg(n),
        animProgress: r.locked_door_anim_progress(n, s)
      };
      c && X_(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function Xt(t) {
    return u(z, {
      get each() {
        return t.lockedDoors();
      },
      children: (e) => u(rl, {
        lockedDoor: e
      })
    });
  }
  const el = 1, tl = 12 - el;
  function rl(t) {
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
      return o = Math.min(Math.max((o - 0.4) / 0.6, 0), 1), 0 + (tl - 0) * o;
    }
    return (() => {
      var o = Y_();
      return b(o, u(B, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var i = Z_();
              return S(() => y(i, "x2", -s())), i;
            })(),
            (() => {
              var i = F_();
              return S(() => y(i, "x2", s())), i;
            })()
          ];
        }
      }), null), b(o, u(B, {
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
      }), null), S(() => y(o, "transform", J_(t.lockedDoor))), o;
    })();
  }
  var sl = x("<svg><use></svg>", false, true, false), nl = x("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), ol = x("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function il(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function _l(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function ll([t, e], r) {
    const s = t(), o = r.locked_doors_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.locked_switch_x(_),
        y: r.locked_switch_y(_),
        wasTouched: r.locked_door_anim_progress(_, 1) >= 0
      };
      n && il(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function Jt(t) {
    return u(z, {
      get each() {
        return t.lockedSwitches();
      },
      children: (e) => (() => {
        var r = sl();
        return S((s) => {
          var o = e().wasTouched ? "#locked-switch-touched" : "#locked-switch", i = _l(e);
          return o !== s.e && y(r, "href", s.e = o), i !== s.t && y(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function Qt() {
    return [
      (() => {
        var t = nl(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = ol(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var al = x("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), bt = x("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), cl = x("<svg><g></svg>", false, true, false);
  function dl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function ul(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function pl([t, e], r, s) {
    const o = t(), i = r.trap_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.trap_door_x(n),
        y: r.trap_door_y(n),
        deg: r.trap_door_deg(n),
        animProgress: r.trap_door_anim_progress(n, s)
      };
      c && dl(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function er(t) {
    return u(z, {
      get each() {
        return t.trapDoors();
      },
      children: (e) => u(fl, {
        trapDoor: e
      })
    });
  }
  const hl = 1, gl = 12 - hl;
  function fl(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function s() {
      let o = t.trapDoor().animProgress;
      return 0 + (gl - 0) * o;
    }
    return (() => {
      var o = cl();
      return b(o, u(B, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var i = al();
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
      })), S(() => y(o, "transform", ul(t.trapDoor))), o;
    })();
  }
  var yl = x("<svg><use></svg>", false, true, false), wl = x("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), ml = x("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function bl(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function xl(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function vl([t, e], r) {
    const s = t(), o = r.trap_doors_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.trap_switch_x(_),
        y: r.trap_switch_y(_),
        wasTouched: r.trap_door_anim_progress(_, 1) >= 0
      };
      n && bl(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function tr(t) {
    return u(z, {
      get each() {
        return t.trapSwitches();
      },
      children: (e) => (() => {
        var r = yl();
        return S((s) => {
          var o = e().wasTouched ? "#trap-switch-touched" : "#trap-switch", i = xl(e);
          return o !== s.e && y(r, "href", s.e = o), i !== s.t && y(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function rr() {
    return [
      (() => {
        var t = wl();
        return t.firstChild, t;
      })(),
      (() => {
        var t = ml(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var kl = x("<svg><g><rect fill=var(--launch-pad-long) x=0 y=-7.5 width=1.5 height=15></rect><line stroke=var(--launch-pad-short) stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function $l(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Dl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Sl([t, e], r) {
    const s = t(), o = r.launch_pads_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.launch_pad_x(_),
        y: r.launch_pad_y(_),
        deg: r.launch_pad_deg(_)
      };
      n && $l(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function sr(t) {
    return u(z, {
      get each() {
        return t.launchPads();
      },
      children: (e) => u(Tl, {
        launchPad: e
      })
    });
  }
  function Tl(t) {
    return (() => {
      var e = kl(), r = e.firstChild;
      return r.nextSibling, S(() => y(e, "transform", Dl(t.launchPad))), e;
    })();
  }
  var Ll = x('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function El(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Pl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Cl([t, e], r, s) {
    const o = t(), i = r.floor_guards_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.floor_guard_x(n, s),
        y: r.floor_guard_y(n, s),
        deg: r.floor_guard_deg(n)
      };
      c && El(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function nr(t) {
    return u(z, {
      get each() {
        return t.floorGuards();
      },
      children: (e) => u(Al, {
        floorGuard: e
      })
    });
  }
  function Al(t) {
    return (() => {
      var e = Ll();
      return e.firstChild, S(() => y(e, "transform", Pl(t.floorGuard))), e;
    })();
  }
  var Ml = x("<svg><use href=#bounceblock></svg>", false, true, false), jl = x('<svg><g id=bounceblock><path fill=var(--bounceblock-interior) d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path stroke=var(--bounceblock-border) d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function Nl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Bl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Ol([t, e], r, s) {
    const o = t(), i = r.bounce_blocks_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.bounce_block_x(n, s),
        y: r.bounce_block_y(n, s),
        deg: r.bounce_block_deg(n)
      };
      c && Nl(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function or(t) {
    return u(z, {
      get each() {
        return t.bounceBlocks();
      },
      children: (e) => (() => {
        var r = Ml();
        return S(() => y(r, "transform", Bl(e))), r;
      })()
    });
  }
  function ir() {
    return (() => {
      var t = jl(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var Il = x("<svg><use href=#boostpad></svg>", false, true, false), Rl = x("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function Kl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Hl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function zl([t, e], r, s) {
    const o = t(), i = r.boost_pads_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.boost_pad_x(n),
        y: r.boost_pad_y(n),
        deg: r.boost_pad_deg(n, s),
        animProgress: r.boost_pad_anim_progress(n, s)
      };
      c && Kl(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function _r(t) {
    return u(z, {
      get each() {
        return t.boostPads();
      },
      children: (e) => (() => {
        var r = Il();
        return S((s) => {
          var o = `color-mix(in srgb-linear, var(--boost-pad) ${e().animProgress * 100}%, var(--boost-pad-wooshing))`, i = Hl(e);
          return o !== s.e && y(r, "stroke", s.e = o), i !== s.t && y(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function lr() {
    return (() => {
      var t = Rl(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, o = s.nextSibling;
      return o.nextSibling, t;
    })();
  }
  var Gl = x("<svg><use href=#thwump></svg>", false, true, false), Vl = x('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function Ul(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function ql(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Wl([t, e], r, s) {
    const o = t(), i = r.thwumps_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.thwump_x(n, s),
        y: r.thwump_y(n, s),
        deg: r.thwump_deg(n)
      };
      c && Ul(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function ar(t) {
    return u(z, {
      get each() {
        return t.thwumps();
      },
      children: (e) => (() => {
        var r = Gl();
        return S(() => y(r, "transform", ql(e))), r;
      })()
    });
  }
  function cr() {
    return (() => {
      var t = Vl(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Zl = x("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), Fl = x("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function Yl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function Xl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Jl([t, e], r, s) {
    const o = t(), i = r.shove_thwumps_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.shove_thwump_x(n, s),
        y: r.shove_thwump_y(n, s),
        deg: r.shove_thwump_deg(n),
        touch: r.shove_thwump_touch(n)
      };
      c && Yl(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function dr(t) {
    return u(z, {
      get each() {
        return t.shoveThwumps();
      },
      children: (e) => u(Ql, {
        shoveThwump: e
      })
    });
  }
  function Ql(t) {
    return (() => {
      var e = Zl(), r = e.firstChild;
      return b(e, u(dt, {
        each: [
          0,
          2,
          4,
          6
        ],
        children: (s) => u(B, {
          get when() {
            return t.shoveThwump().touch >= 16 || s === t.shoveThwump().touch;
          },
          get children() {
            var o = Fl(), i = o.firstChild, _ = i.nextSibling;
            return _.nextSibling, y(o, "transform", `rotate(${45 * s},0,0)`), o;
          }
        })
      }), r), S(() => y(e, "transform", Xl(t.shoveThwump))), e;
    })();
  }
  const ur = pr((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function ea(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function ta(t) {
    const e = String.fromCharCode(...t);
    console.log("anim data length", t.byteLength), localStorage.setItem("animData", e);
  }
  function ra(t) {
    const e = localStorage.getItem("animData");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.set_anim_data(r);
    }
  }
  const sa = pr(na, 1e3);
  function na(t) {
    const e = JSON.stringify(t);
    localStorage.setItem("palette", e);
  }
  function oa() {
    const t = localStorage.getItem("palette");
    if (t) try {
      const e = JSON.parse(t);
      if (typeof (e == null ? void 0 : e.name) == "string" && typeof (e == null ? void 0 : e.colors) == "object") return e;
    } catch {
      return;
    }
  }
  function pr(t, e) {
    let r;
    return (...s) => {
      typeof r == "number" && clearTimeout(r), r = setTimeout(() => t(...s), e);
    };
  }
  const ia = "" + new URL("palette-CZVUb4uS.png", import.meta.url).href, hr = [
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
  }, _a = {
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
  }, la = (() => {
    const t = {};
    for (const e of xt) {
      t[e] = 0;
      for (const r of xt) vt[r] < vt[e] && (t[e] += _a[r]);
    }
    return t;
  })(), gr = [
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
  ], aa = {
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
  let fr;
  async function ca() {
    const e = await (await fetch(ia)).blob(), r = await createImageBitmap(e), s = document.createElement("canvas");
    s.width = r.width, s.height = r.height;
    const o = s.getContext("2d");
    o.drawImage(r, 0, 0), fr = o;
  }
  function yr(t) {
    const e = fr, r = hr.indexOf(t);
    if (!e || r < 0) return;
    const s = {};
    for (const o of gr) {
      const { file: i, index: _ } = aa[o], n = la[i] + _, c = e.getImageData(n, r, 1, 1).data, h = `rgb(${c[0]} ${c[1]} ${c[2]})`;
      s[o] = h;
    }
    return s;
  }
  function da(t) {
    for (const e of gr) document.body.style.setProperty(e, t[e]);
  }
  var ua = x('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox></label> | Object corners <select><option>square</option><option>rounded</option></select> | <select></select><input type=text style=float:right>'), pa = x("<option>");
  function ha(t) {
    return (() => {
      var e = ua(), r = e.firstChild, s = r.firstChild, o = s.nextSibling, i = r.nextSibling, _ = i.nextSibling, n = _.nextSibling, c = n.nextSibling, h = c.firstChild, v = h.nextSibling, f = c.nextSibling, C = f.nextSibling, E = C.firstChild, j = E.nextSibling, N = C.nextSibling, K = N.nextSibling, O = K.nextSibling;
      return o.addEventListener("change", function() {
        const k = this.files;
        if (k && k.length > 0) {
          const T = new FileReader();
          T.onloadend = () => {
            T.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(T.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, T.readAsArrayBuffer(k[0]);
        }
      }), _.$$click = function() {
        const k = t.editor.export_map(), T = new Blob([
          k.buffer
        ], {
          type: "application/octet-stream"
        }), A = URL.createObjectURL(T);
        this.href = A, this.download = t.editor.get_level_name().replaceAll(/[^a-z]/gi, "_"), setTimeout(() => URL.revokeObjectURL(A), 100);
      }, v.addEventListener("change", (k) => {
        t.setShowTrail(k.currentTarget.checked), t.editor.set_show_trail(k.currentTarget.checked);
      }), C.addEventListener("change", (k) => t.setRoundCorners(k.currentTarget.value == "rounded")), K.addEventListener("change", (k) => {
        const T = yr(k.currentTarget.value);
        T && t.setPalette({
          name: k.currentTarget.value,
          colors: T
        });
      }), b(K, () => hr.map((k) => (() => {
        var T = pa();
        return b(T, k), S(() => {
          var _a2;
          return T.selected = k === (((_a2 = t.palette()) == null ? void 0 : _a2.name) ?? "vasquez");
        }), T;
      })())), O.addEventListener("change", () => ur(t.editor)), O.$$input = (k) => {
        t.editor.set_level_name(k.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, S((k) => {
        var T = !t.roundCorners(), A = t.roundCorners();
        return T !== k.e && (E.selected = k.e = T), A !== k.t && (j.selected = k.t = A), k;
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
  var ga = x("<svg><use href=#zapdrone></svg>", false, true, false), fa = x('<svg><g id=zapdrone><path fill=var(--zap-drone-background) stroke=var(--zap-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--zap-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--zap-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false), ya = x('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 1 12 12 a 12 12 0 0 1 -12 12 l 5 -5 m 0 10 l -5 -5"></svg>', false, true, false), wa = x('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 0 12 -12 a 12 12 0 0 0 -12 -12 l 5 5 m 0 -10 l -5 5"></svg>', false, true, false), ma = x('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V 24 l -5 -5 m 10 0 l -5 5"></svg>', false, true, false), ba = x('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V -24 l -5 5 m 10 0 l -5 -5"></svg>', false, true, false), xa = x("<svg><g></svg>", false, true, false);
  function va(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function ka(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function $a([t, e], r, s) {
    const o = t(), i = r.zap_drones_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.zap_drone_x(n, s),
        y: r.zap_drone_y(n, s),
        deg: r.zap_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && va(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function wr(t) {
    return u(z, {
      get each() {
        return t.zapDrones();
      },
      children: (e) => (() => {
        var r = ga();
        return S(() => y(r, "transform", ka(e))), r;
      })()
    });
  }
  function mr() {
    return (() => {
      var t = fa(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  function Da({ entities: t }) {
    const e = () => t.zapDrones().at(0) ?? t.chaseDrones().at(0) ?? t.chaingunDrones().at(0) ?? t.laserDrones().at(0), r = (s) => {
      const o = s();
      if (o) {
        const { x: i, y: _, deg: n } = o;
        return `translate(${i},${_}) rotate(${n},0,0)`;
      } else return "";
    };
    return (() => {
      var s = xa();
      return b(s, u(B, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 0;
        },
        get children() {
          return ya();
        }
      }), null), b(s, u(B, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 1;
        },
        get children() {
          return wa();
        }
      }), null), b(s, u(B, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 2;
        },
        get children() {
          return ma();
        }
      }), null), b(s, u(B, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 3;
        },
        get children() {
          return ba();
        }
      }), null), S(() => y(s, "transform", r(e))), s;
    })();
  }
  var Sa = x("<svg><use href=#chaingundrone></svg>", false, true, false), Ta = x('<svg><g id=chaingundrone><path fill=var(--chaingun-drone-background) stroke=var(--chaingun-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chaingun-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--chaingun-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function La(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Ea(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Pa([t, e], r, s) {
    const o = t(), i = r.chaingun_drones_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.chaingun_drone_x(n, s),
        y: r.chaingun_drone_y(n, s),
        deg: r.chaingun_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && La(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function br(t) {
    return u(z, {
      get each() {
        return t.chaingunDrones();
      },
      children: (e) => (() => {
        var r = Sa();
        return S(() => y(r, "transform", Ea(e))), r;
      })()
    });
  }
  function xr() {
    return (() => {
      var t = Ta(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Ca = x("<svg><use href=#bat></svg>", false, true, false), Aa = x("<svg><circle id=bat r=5 cx=0 cy=0 fill=var(--bat-body)></svg>", false, true, false);
  function Ma(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function ja(t) {
    return u(z, {
      get each() {
        return t.bats();
      },
      children: (e) => (() => {
        var r = Ca();
        return S(() => y(r, "transform", Ma(e))), r;
      })()
    });
  }
  function Na() {
    return Aa();
  }
  var Ba = x("<svg><use href=#laserdrone></svg>", false, true, false), Oa = x('<svg><g id=laserdrone><path fill=none stroke=var(--laser-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--laser-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--laser-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function Ia(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Ra(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Ka([t, e], r, s) {
    const o = t(), i = r.laser_drones_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.laser_drone_x(n, s),
        y: r.laser_drone_y(n, s),
        deg: r.laser_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && Ia(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function vr(t) {
    return u(z, {
      get each() {
        return t.laserDrones();
      },
      children: (e) => (() => {
        var r = Ba();
        return S(() => y(r, "transform", Ra(e))), r;
      })()
    });
  }
  function kr() {
    return (() => {
      var t = Oa(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Ha = x("<svg><use href=#chasedrone></svg>", false, true, false), za = x('<svg><g id=chasedrone><path fill=var(--chase-drone-background) stroke=var(--chase-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chase-drone-border) d="M 10 -3 H 3 A 3 3 0 0 0 0 0 A 3 3 0 0 0 3 3 H 10 Z"></path><path fill=none stroke=var(--chase-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function Ga(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Va(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Ua([t, e], r, s) {
    const o = t(), i = r.chase_drones_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), h = {
        x: r.chase_drone_x(n, s),
        y: r.chase_drone_y(n, s),
        deg: r.chase_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && Ga(c, h) ? _.push(c) : _.push(h);
    }
    e(_);
  }
  function $r(t) {
    return u(z, {
      get each() {
        return t.chaseDrones();
      },
      children: (e) => (() => {
        var r = Ha();
        return S(() => y(r, "transform", Va(e))), r;
      })()
    });
  }
  function Dr() {
    return (() => {
      var t = za(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var qa = x('<svg><rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"width=150 height=150 style=mix-blend-mode:hard-light></svg>', false, true, false), Wa = x("<svg><circle fill=none stroke=var(--entity-palette-reticle) r=16></svg>", false, true, false), Za = x('<svg><path d="M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12"fill-rule=evenodd fill="color-mix(in srgb,var(--background) 18%,white 15%)"style=mix-blend-mode:hard-light></svg>', false, true, false), Fa = x("<svg><rect fill=none stroke=var(--editor-crosshair) stroke-width=2 width=26 height=26></svg>", false, true, false), Ya = x("<svg><use href=#tilemode-crosshair></svg>", false, true, false), Xa = x("<svg><use href=#crosshair></svg>", false, true, false), Ja = x("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), Qa = x('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none>'), kt = x("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), $t = x("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), ec = x("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), tc = x("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), rc = x("<svg><line class=door-switch-line></svg>", false, true, false);
  const rt = 42, st = 23, Dt = 0, St = 1, sc = 3, nc = 4, nt = 5, Tt = 6, Lt = 7, oc = 8, ot = 9, ic = 0, _c = 1, lc = 3, ac = 5, cc = 6, dc = 8, uc = 10, pc = 11, hc = 12, gc = 13, fc = 14, yc = 15, wc = 16, mc = 17, bc = 20, xc = 21, vc = 24, kc = 27, $c = 28, Dc = new Float64Array([
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
  ]), Sc = new Float64Array([
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
  ]), Et = 150;
  function Pt() {
    const [t, e] = w([]), [r, s] = w([]), [o, i] = w([]), [_, n] = w([]), [c, h] = w([]), [v, f] = w([]), [C, E] = w([]), [j, N] = w([]), [K, O] = w([]), [k, T] = w([]), [A, I] = w([]), [W, Z] = w([]), [Q, L] = w([]), [M, ee] = w([]), [te, le] = w([]), [P, U] = w([]), [J, G] = w([]), [re, ie] = w([]), [ne, ge] = w([]), [fe, ye] = w([]), [d, g] = w([]);
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
      setLockedSwitches: E,
      trapDoors: j,
      setTrapDoors: N,
      trapSwitches: K,
      setTrapSwitches: O,
      launchPads: k,
      setLaunchPads: T,
      oneWays: A,
      setOneWays: I,
      chaingunDrones: W,
      setChaingunDrones: Z,
      laserDrones: Q,
      setLaserDrones: L,
      zapDrones: M,
      setZapDrones: ee,
      chaseDrones: te,
      setChaseDrones: le,
      floorGuards: P,
      setFloorGuards: U,
      bounceBlocks: J,
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
    const o = [], i = [], _ = [], n = [], c = [], h = [], v = [], f = [], C = [], E = [], j = [], N = [], K = [], O = [], k = [], T = [], A = [], I = [], W = [], Z = [], Q = [];
    for (const L of r) {
      const M = {
        x: L.x,
        y: L.y,
        deg: L.deg,
        mode: L.mode,
        animProgress: 0
      }, ee = {
        x: L.switch_x,
        y: L.switch_y,
        animProgress: 0,
        wasTouched: false
      }, te = {
        x1: L.x,
        y1: L.y,
        x2: L.switch_x,
        y2: L.switch_y
      };
      L.type_int === ic ? o.push(M) : L.type_int === _c ? i.push({
        ...M,
        type: j_
      }) : L.type_int === xc ? i.push({
        ...M,
        type: N_
      }) : L.type_int === lc ? (_.push(M), Number.isNaN(L.switch_x) || (n.push(ee), e.push(te))) : L.type_int === ac ? c.push(M) : L.type_int === cc ? (h.push(M), Number.isNaN(L.switch_x) || (v.push(ee), e.push(te))) : L.type_int === dc ? (f.push({
        ...M,
        animProgress: s ? 1 : -1
      }), Number.isNaN(L.switch_x) || (C.push(ee), e.push(te))) : L.type_int === uc ? E.push(M) : L.type_int === pc ? j.push(M) : L.type_int === hc ? N.push(M) : L.type_int === gc ? K.push(M) : L.type_int === fc ? O.push(M) : L.type_int === yc ? k.push(M) : L.type_int === wc ? T.push(M) : L.type_int === mc ? A.push(M) : L.type_int === bc ? I.push(M) : L.type_int === vc ? W.push({
        ...M,
        animProgress: 1
      }) : L.type_int === kc ? Z.push(M) : L.type_int === $c && Q.push({
        ...M,
        touch: 16
      }), L.free();
    }
    t.setNinjas(o), t.setMines(i), t.setExitDoors(_), t.setExitSwitches(n), t.setRegularDoors(c), t.setLockedDoors(h), t.setLockedSwitches(v), t.setTrapDoors(f), t.setTrapSwitches(C), t.setLaunchPads(E), t.setOneWays(j), t.setChaingunDrones(N), t.setLaserDrones(K), t.setZapDrones(O), t.setChaseDrones(k), t.setFloorGuards(T), t.setBounceBlocks(A), t.setThwumps(I), t.setBoostPads(W), t.setBats(Z), t.setShoveThwumps(Q);
  }
  function At({ entities: t }) {
    return [
      u(Vt, {
        get exitDoors() {
          return t.exitDoors;
        }
      }),
      u(qt, {
        get oneWays() {
          return t.oneWays;
        }
      }),
      u(Zt, {
        get mines() {
          return t.mines;
        }
      }),
      u(Yt, {
        get regularDoors() {
          return t.regularDoors;
        }
      }),
      u(er, {
        get trapDoors() {
          return t.trapDoors;
        }
      }),
      u(Xt, {
        get lockedDoors() {
          return t.lockedDoors;
        }
      }),
      u(Jt, {
        get lockedSwitches() {
          return t.lockedSwitches;
        }
      }),
      u(tr, {
        get trapSwitches() {
          return t.trapSwitches;
        }
      }),
      u(Ut, {
        get exitSwitches() {
          return t.exitSwitches;
        }
      }),
      u(sr, {
        get launchPads() {
          return t.launchPads;
        }
      }),
      u(br, {
        get chaingunDrones() {
          return t.chaingunDrones;
        }
      }),
      u(vr, {
        get laserDrones() {
          return t.laserDrones;
        }
      }),
      u(wr, {
        get zapDrones() {
          return t.zapDrones;
        }
      }),
      u($r, {
        get chaseDrones() {
          return t.chaseDrones;
        }
      }),
      u(nr, {
        get floorGuards() {
          return t.floorGuards;
        }
      }),
      u(ja, {
        get bats() {
          return t.bats;
        }
      }),
      u(ar, {
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
          bones: () => Dc
        })
      }),
      u(or, {
        get bounceBlocks() {
          return t.bounceBlocks;
        }
      }),
      u(dr, {
        get shoveThwumps() {
          return t.shoveThwumps;
        }
      }),
      u(_r, {
        get boostPads() {
          return t.boostPads;
        }
      })
    ];
  }
  function Tc(t) {
    const { editor: e, pastNinjas: r } = t, [s, o] = w(""), [i, _] = w(""), [n, c] = w(true), [h, v] = w(false), [f, C] = w(Dt), [E, j] = w({
      row: 1,
      col: 1
    }), [N, K] = w({
      x: 24,
      y: 24
    }), [O, k] = w(""), [T, A] = w({
      x: NaN,
      y: NaN
    }), [I, W] = w({
      x: NaN,
      y: NaN
    }), Z = Pt(), Q = Pt(), [L, M] = w([]), [ee, te] = w(e.get_show_trail()), [le, P] = w(), U = (d) => {
      let g = false;
      if (!(d.target instanceof HTMLInputElement || d.target instanceof HTMLSelectElement)) {
        if (d.ctrlKey || d.metaKey) {
          d.code === "KeyZ" && (d.ctrlKey || d.metaKey) && d.shiftKey ? (g = true, e.redo()) : d.code === "KeyZ" && (d.ctrlKey || d.metaKey) ? (g = true, e.undo()) : d.code === "KeyY" && (d.ctrlKey || d.metaKey) && (g = true, e.redo()), g && (G(true), d.preventDefault());
          return;
        }
        d.shiftKey && (g = true, e.press_shift()), d.code === "Enter" && e.mode() === ot ? t.setReplay(e.to_replay(t.roundCorners())) : d.code === "Backquote" ? (g = true, e.press_backtick()) : d.code === "Digit1" ? (g = true, e.press_1(d.shiftKey)) : d.code === "Digit2" ? (g = true, e.press_2(d.shiftKey)) : d.code === "Digit3" ? (g = true, e.press_3(d.shiftKey)) : d.code === "Digit4" ? (g = true, e.press_4(d.shiftKey)) : d.code === "Digit5" ? (g = true, e.press_5(d.shiftKey)) : d.code === "Digit6" ? (g = true, e.press_6(d.shiftKey)) : d.code === "Digit7" ? (g = true, e.press_7(d.shiftKey)) : d.code === "Digit8" ? (g = true, e.press_8(d.shiftKey)) : d.code === "Digit9" ? (g = true, e.press_9()) : d.code === "Digit0" ? (g = true, e.press_0()) : d.code === "Minus" ? (g = true, e.press_dash()) : d.code === "Equal" ? (g = true, e.press_equals()) : d.code === "KeyQ" ? (g = true, e.press_q(d.shiftKey)) : d.code === "KeyW" ? (g = true, e.press_w(d.shiftKey)) : d.code === "KeyA" ? (g = true, e.press_a(d.shiftKey)) : d.code === "KeyS" ? (g = true, e.press_s(d.shiftKey)) : d.code === "KeyE" ? (g = true, e.press_e()) : d.code === "KeyD" ? (g = true, e.press_d()) : d.code === "KeyZ" ? (g = true, e.press_z()) : d.code === "KeyX" ? (g = true, e.press_x()) : d.code === "KeyC" ? (g = true, e.press_c()) : d.code === "Space" ? (g = true, e.press_space()) : d.code === "AltLeft" ? (g = true, e.press_alt_left(d.shiftKey)) : d.code === "KeyR" ? (g = true, e.press_r()) : d.code === "KeyT" ? (g = true, e.press_t()) : d.code === "KeyY" ? (g = true, e.press_y()) : d.code === "KeyU" ? (g = true, e.press_u()) : d.code === "KeyI" ? (g = true, e.press_i()) : d.code === "KeyO" ? (g = true, e.press_o()) : d.code === "KeyP" ? (g = true, e.press_p()) : d.code === "BracketLeft" ? (g = true, e.press_bracket_left()) : d.code === "BracketRight" ? (g = true, e.press_bracket_right()) : d.code === "KeyF" ? (g = true, e.press_f()) : d.code === "KeyH" ? (g = true, e.press_h()) : d.code === "KeyJ" ? (g = true, e.press_j()) : d.code === "KeyK" ? (g = true, e.press_k()) : d.code === "KeyL" ? (g = true, e.press_l()) : d.code === "KeyN" ? (g = true, e.press_n()) : d.code === "KeyM" ? (g = true, e.press_m()) : d.code === "Comma" ? (g = true, e.press_comma()) : d.code === "ArrowUp" ? (g = true, e.press_up(d.shiftKey)) : d.code === "ArrowDown" ? (g = true, e.press_down(d.shiftKey)) : d.code === "ArrowLeft" ? (g = true, e.press_left(d.shiftKey)) : d.code === "ArrowRight" ? (g = true, e.press_right(d.shiftKey)) : d.code === "Enter" ? (g = true, e.press_enter()) : d.code === "Escape" ? g = e.press_escape() : d.code === "Slash" && (g = true, e.press_slash()), g && (G(true), d.preventDefault());
      }
    }, J = (d) => {
      let g = false;
      d.shiftKey || (g = true, e.release_shift()), d.code === "KeyQ" ? (g = true, e.release_q()) : d.code === "KeyW" ? (g = true, e.release_w()) : d.code === "KeyA" ? (g = true, e.release_a()) : d.code === "KeyS" ? (g = true, e.release_s()) : d.code === "KeyE" ? (g = true, e.release_e()) : d.code === "KeyD" ? (g = true, e.release_d()) : d.code === "KeyZ" ? (g = true, e.release_z()) : d.code === "KeyC" ? (g = true, e.release_c()) : d.code === "Space" ? (g = true, e.release_space()) : d.code === "AltLeft" && (g = true, e.release_alt_left()), g && (G(false), d.preventDefault());
    };
    document.addEventListener("keydown", U), document.addEventListener("keyup", J), be(() => {
      document.removeEventListener("keydown", U), document.removeEventListener("keyup", J);
    });
    function G(d) {
      C(e.mode()), o(e.tiles_path()), _(e.selected_tiles_path()), j({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), v(e.show_quarter_grid()), K({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const g = [];
      Ct(Z, g, e.entities(), false), Ct(Q, g, e.preview_entities(), true), M(g), k(e.selected_tile_outline_path()), A({
        x: e.palette_center_x(),
        y: e.palette_center_y()
      }), W({
        x: e.palette_selection_x(),
        y: e.palette_selection_y()
      }), P(e.past_ninja_bones()), d && ur(e);
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
        var d = Qa(), g = d.firstChild, Ne = g.firstChild, F = Ne.nextSibling;
        F.nextSibling;
        var ce = g.nextSibling, de = ce.nextSibling, _e = de.nextSibling, ve = _e.nextSibling, Be = ve.firstChild;
        return d.$$contextmenu = (m) => {
          e.press_escape() && (G(false), m.preventDefault());
        }, d.$$mouseup = () => {
          e.cursor_up(), G(false);
        }, d.$$dblclick = (m) => {
          e.double_click(m.shiftKey), G(false);
        }, d.$$mousedown = (m) => {
          m.buttons & 2 || (e.mode() === ot ? t.setReplay(e.to_replay(t.roundCorners())) : (e.cursor_down(m.shiftKey), G(true)));
        }, d.$$mousemove = function(m) {
          const { left: p, top: $, width: D, height: q } = this.getBoundingClientRect(), ue = e.set_cursor_pos((m.clientX - p) / D * 1056, (m.clientY - $) / q * 600, m.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (m.clientX - p) / D * 1056,
            y: (m.clientY - $) / q * 600
          }), ue && G(false);
        }, b(g, u(Ft, {}), F), b(g, u(Wt, {}), F), b(g, u(ir, {}), F), b(g, u(Qt, {}), F), b(g, u(rr, {}), F), b(g, u(lr, {}), F), b(g, u(cr, {}), F), b(g, u(xr, {}), F), b(g, u(kr, {}), F), b(g, u(mr, {}), F), b(g, u(Dr, {}), F), b(g, u(Na, {}), F), b(d, u(B, {
          get when() {
            return h();
          },
          get children() {
            return [
              Se(() => fe.map((m) => (() => {
                var p = kt();
                return y(p, "x1", m), y(p, "x2", m), p;
              })())),
              Se(() => ye.map((m) => (() => {
                var p = $t();
                return y(p, "y1", m), y(p, "y2", m), p;
              })()))
            ];
          }
        }), ce), b(d, u(B, {
          get when() {
            return n();
          },
          get children() {
            return [
              Se(() => ne.map((m) => (() => {
                var p = kt();
                return y(p, "x1", m), y(p, "x2", m), p;
              })())),
              Se(() => ge.map((m) => (() => {
                var p = $t();
                return y(p, "y1", m), y(p, "y2", m), p;
              })()))
            ];
          }
        }), ce), b(d, () => re.map((m) => (() => {
          var p = ec();
          return y(p, "x1", m), y(p, "x2", m), p;
        })()), ce), b(d, () => ie.map((m) => (() => {
          var p = tc();
          return y(p, "y1", m), y(p, "y2", m), p;
        })()), ce), b(d, u(At, {
          entities: Z
        }), ce), b(d, u(B, {
          get when() {
            return f() === Lt;
          },
          get children() {
            var m = qa();
            return S((p) => {
              var $ = T().x - Et / 2, D = T().y - Et / 2;
              return $ !== p.e && y(m, "x", p.e = $), D !== p.t && y(m, "y", p.t = D), p;
            }, {
              e: void 0,
              t: void 0
            }), m;
          }
        }), de), b(de, u(At, {
          entities: Q
        })), b(d, u(B, {
          get when() {
            return [
              nt,
              Tt,
              nc
            ].includes(f());
          },
          get children() {
            return u(Da, {
              entities: Q
            });
          }
        }), _e), b(d, u(B, {
          get when() {
            return f() === Lt;
          },
          get children() {
            var m = Wa();
            return S((p) => {
              var $ = I().x, D = I().y;
              return $ !== p.e && y(m, "cx", p.e = $), D !== p.t && y(m, "cy", p.t = D), p;
            }, {
              e: void 0,
              t: void 0
            }), m;
          }
        }), _e), b(d, u(B, {
          get when() {
            return f() === St;
          },
          get children() {
            var m = Za();
            return S(() => y(m, "transform", `translate(${T().x},${T().y})`)), m;
          }
        }), _e), b(d, u(B, {
          get when() {
            return f() === St;
          },
          get children() {
            var m = Fa();
            return S((p) => {
              var $ = I().x - 13, D = I().y - 13;
              return $ !== p.e && y(m, "x", p.e = $), D !== p.t && y(m, "y", p.t = D), p;
            }, {
              e: void 0,
              t: void 0
            }), m;
          }
        }), ve), b(d, u(dt, {
          get each() {
            return L();
          },
          children: (m) => (() => {
            var p = rc();
            return S(($) => {
              var D = m.x1, q = m.y1, ue = m.x2, ke = m.y2;
              return D !== $.e && y(p, "x1", $.e = D), q !== $.t && y(p, "y1", $.t = q), ue !== $.a && y(p, "x2", $.a = ue), ke !== $.o && y(p, "y2", $.o = ke), $;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), p;
          })()
        }), ve), b(d, u(B, {
          get when() {
            return f() === Dt;
          },
          get children() {
            var m = Ya();
            return S((p) => {
              var $ = E().col * 24 + 12, D = E().row * 24 + 12;
              return $ !== p.e && y(m, "x", p.e = $), D !== p.t && y(m, "y", p.t = D), p;
            }, {
              e: void 0,
              t: void 0
            }), m;
          }
        }), null), b(d, u(B, {
          get when() {
            return f() === oc || f() === nt;
          },
          get children() {
            var m = Xa();
            return S((p) => {
              var $ = N().x, D = N().y;
              return $ !== p.e && y(m, "x", p.e = $), D !== p.t && y(m, "y", p.t = D), p;
            }, {
              e: void 0,
              t: void 0
            }), m;
          }
        }), null), b(d, u(B, {
          get when() {
            return f() === ot;
          },
          get children() {
            return u(We, {
              class: "ninja",
              ninja: () => ({
                x: N().x,
                y: N().y,
                deg: 0
              }),
              bones: () => le() ?? Sc
            });
          }
        }), null), b(d, u(B, {
          get when() {
            return ee();
          },
          get children() {
            var m = Ja();
            return S(() => y(m, "points", r().map(({ x: p, y: $ }) => `${p},${$}`).join(" "))), m;
          }
        }), null), S((m) => {
          var p = s(), $ = [
            sc,
            nt,
            Tt
          ].includes(f()) ? "url(#outline)" : "", D = i(), q = O();
          return p !== m.e && y(ce, "d", m.e = p), $ !== m.t && y(de, "filter", m.t = $), D !== m.a && y(_e, "d", m.a = D), q !== m.o && y(Be, "d", m.o = q), m;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), d;
      })(),
      u(ha, {
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
        showTrail: ee,
        setShowTrail: te
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
  var Lc = x("<div id=media-controls><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb></div></div><div><a href=# download=1234 style=color:var(--main-menu-selected);margin-left:1em>Export attract");
  function Ec(t) {
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
      var n = Lc(), c = n.firstChild, h = c.firstChild, v = c.nextSibling, f = v.firstChild, C = f.nextSibling, E = C.nextSibling, j = E.nextSibling, N = v.nextSibling, K = N.firstChild;
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
      })), v.$$mousedown = (k) => {
        t.setDragStart(o(k).targetFrame), i(k), k.preventDefault();
      };
      var O = s;
      return typeof O == "function" ? Hr(O, v) : s = v, K.$$click = function() {
        const k = t.attract(), T = new Blob([
          k.buffer
        ], {
          type: "application/octet-stream"
        }), A = URL.createObjectURL(T);
        this.href = A, setTimeout(() => URL.revokeObjectURL(A), 100);
      }, S((k) => {
        var T = e(), A = r().left, I = r().width, W = e();
        return T !== k.e && Oe(C, "width", k.e = T), A !== k.t && Oe(E, "left", k.t = A), I !== k.a && Oe(E, "width", k.a = I), W !== k.o && Oe(j, "left", k.o = W), k;
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
  var Pc = x('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), Cc = x("<div>");
  function Ac(t) {
    const e = t.replay, [r, s] = w(true), [o, i] = w(true), [_, n] = w(void 0), [c, h] = w(0), [v, f] = w(0), [C, E] = w(void 0), j = (p) => {
      p.code === "Enter" ? (e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), o() || m(1)) : p.code === "Escape" && (o() ? (i(false), s(false)) : (i(true), s(true)));
    };
    document.addEventListener("keydown", j), be(() => {
      document.removeEventListener("keydown", j);
    });
    const N = () => e.tiles_path(), [K, O] = w({
      x: -50,
      y: -50,
      deg: 0
    }), [k, T] = w({
      x: -50,
      y: -50,
      deg: 0
    }), [A, I] = w(), [W, Z] = w(), Q = w([]), L = w([]), M = w([]), ee = w([]), te = w([]), le = w([]), P = w([]), U = w([]), J = w([]), G = w([]), re = w([]), ie = w([]), ne = w([]), ge = w([]), fe = w([]), ye = w([]), d = w([]), g = w([]), Ne = w([]);
    let F = performance.now();
    const de = 1e3 / 60;
    let _e = 0, ve = 0;
    function Be() {
      const p = performance.now(), $ = Math.min(p - F, 250);
      F = p;
      let D = 1;
      const q = e;
      if (o() && _() === void 0) {
        if (r() || v() < c()) {
          for (_e += $; _e >= de; ) {
            if (r()) {
              let { isJump1Pressed: ue, isJump2Pressed: ke, isRightPressed: Ye, isLeftPressed: Xe, isSuicidePressed: Sr } = t.globalEventState;
              q.set_input(ue() || ke(), Ye(), Xe(), Sr());
            }
            q.tick(), _e -= de;
          }
          D = _e / de, f(q.progress());
        } else v() < c() ? (q.tick(), f(q.progress())) : i(false);
        m(D);
      }
      ve = requestAnimationFrame(Be);
    }
    Be(), be(() => {
      cancelAnimationFrame(ve);
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
      }), I(e.ninja_bones(p)), C() === void 0 ? Z(void 0) : Z(e.ninja_preview_bones(p)), I_(Q, e), Ol(L, e, p), E_(M, e), zl(ee, e, p), Wl(te, e, p), Sl(le, e), Cl(P, e, p), Q_(U, e, p), ll(J, e), pl(G, e, p), vl(re, e), V_(ie, e, p), Jl(ne, e, p), y_(ge, e, p), k_(fe, e, p), $a(ye, e, p), Ua(d, e, p), Pa(g, e, p), Ka(Ne, e, p), h(e.replay_length());
    }
    return [
      (() => {
        var p = Pc(), $ = p.firstChild;
        $.firstChild;
        var D = $.nextSibling;
        return p.$$mousemove = function(q) {
          const { left: ue, top: ke, width: Ye, height: Xe } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (q.clientX - ue) / Ye * 1056,
            y: (q.clientY - ke) / Xe * 600
          });
        }, b($, u(Ft, {}), null), b($, u(ir, {}), null), b($, u(Wt, {}), null), b($, u(Qt, {}), null), b($, u(rr, {}), null), b($, u(lr, {}), null), b($, u(cr, {}), null), b($, u(xr, {}), null), b($, u(kr, {}), null), b($, u(mr, {}), null), b($, u(Dr, {}), null), b($, u(m_, {}), null), b(p, u(Vt, {
          get exitDoors() {
            return ge[0];
          }
        }), D), b(p, u(qt, {
          get oneWays() {
            return M[0];
          }
        }), D), b(p, u(Zt, {
          get mines() {
            return Q[0];
          }
        }), D), b(p, u(Yt, {
          get regularDoors() {
            return ie[0];
          }
        }), D), b(p, u(Xt, {
          get lockedDoors() {
            return U[0];
          }
        }), D), b(p, u(er, {
          get trapDoors() {
            return G[0];
          }
        }), D), b(p, u(Jt, {
          get lockedSwitches() {
            return J[0];
          }
        }), D), b(p, u(tr, {
          get trapSwitches() {
            return re[0];
          }
        }), D), b(p, u(Ut, {
          get exitSwitches() {
            return fe[0];
          }
        }), D), b(p, u(sr, {
          get launchPads() {
            return le[0];
          }
        }), D), b(p, u(br, {
          get chaingunDrones() {
            return g[0];
          }
        }), D), b(p, u(vr, {
          get laserDrones() {
            return Ne[0];
          }
        }), D), b(p, u(wr, {
          get zapDrones() {
            return ye[0];
          }
        }), D), b(p, u($r, {
          get chaseDrones() {
            return d[0];
          }
        }), D), b(p, u(nr, {
          get floorGuards() {
            return P[0];
          }
        }), D), b(p, u(ar, {
          get thwumps() {
            return te[0];
          }
        }), D), b(p, u(We, {
          class: "ninja preview",
          ninja: k,
          bones: W
        }), D), b(p, u(We, {
          class: "ninja",
          ninja: K,
          bones: A
        }), D), b(p, u(or, {
          get bounceBlocks() {
            return L[0];
          }
        }), D), b(p, u(dr, {
          get shoveThwumps() {
            return ne[0];
          }
        }), D), b(p, u(_r, {
          get boostPads() {
            return ee[0];
          }
        }), D), S(() => y(D, "d", N())), p;
      })(),
      (() => {
        var p = Cc();
        return b(p, u(B, {
          get when() {
            return !r() || !o();
          },
          get children() {
            return u(Ec, {
              isPlaying: o,
              setIsPlaying: i,
              dragStart: _,
              setDragStart: n,
              length: c,
              progress: v,
              previewProgress: C,
              seek: ($) => {
                f($), e.seek($), m(1);
              },
              previewSeek: ($) => {
                E($), e && ($ !== void 0 && _() === void 0 && e.seek_preview($), m(1));
              },
              attract: () => e.export_attract(t.editor)
            });
          }
        })), p;
      })()
    ];
  }
  Fe([
    "mousemove"
  ]);
  var Mc = x("<p>Invalid file."), jc = x("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file><dl><dt>Windows</dt><dd>C:\\Program Files (x86)\\Steam\\steamapps\\common\\N++\\anim_data_line_new.txt.bin</dd><dt>Linux</dt><dd>~/.steam/steam/steamapps/common/N++/anim_data_line_new.txt.bin</dd><dt>Mac</dt><dd>~/Library/Application Support/Steam/steamapps/common/N++/N++.app/Contents/Resources/NPP/anim_data_line_new.txt.bin");
  function Nc() {
    const t = xe.new(), [e, r] = w(), [s, o] = w(""), [i, _] = w(false), [n, c] = w([]);
    function h() {
      const P = [], U = t.past_ninjas_len();
      for (let J = 0; J < U; J++) P.push({
        x: t.past_ninja_x(J),
        y: t.past_ninja_y(J)
      });
      c(P);
    }
    const [v, f] = w(false), [C, E] = w(false), [j, N] = w(false), [K, O] = w(false), [k, T] = w(false), [A, I] = w({
      x: 36,
      y: 36
    }), W = {
      isJump1Pressed: v,
      isJump2Pressed: C,
      isRightPressed: j,
      isLeftPressed: K,
      isSuicidePressed: k,
      mouseGamePos: A,
      setMouseGamePos: I
    };
    ea(t), o(t.get_level_name()), document.addEventListener("keydown", (P) => {
      if (!(P.ctrlKey || P.metaKey)) if (P.code === "Tab") {
        const U = e();
        U ? (r(void 0), U.send_past_ninjas(), t.receive_past_ninjas(), U.free(), h()) : r(t.to_replay(i())), P.preventDefault();
      } else P.code === "KeyZ" ? f(true) : P.code === "ArrowUp" ? E(true) : P.code === "ArrowRight" ? N(true) : P.code === "ArrowLeft" ? O(true) : P.code === "KeyV" && T(true);
    }), document.addEventListener("keyup", (P) => {
      P.code === "KeyZ" ? f(false) : P.code === "ArrowUp" ? E(false) : P.code === "ArrowRight" ? N(false) : P.code === "ArrowLeft" ? O(false) : P.code === "KeyV" && T(false);
    }), document.addEventListener("blur", () => {
      f(false), E(false), N(false), O(false), T(false);
    }), ra(t);
    const Z = 0, Q = 1, L = 2, [M, ee] = w(t.get_anim_state() == Z ? Z : L), [te, le] = w(oa());
    return Pr(() => {
      const P = te();
      P && (da(P.colors), sa(P));
    }), ca().then(() => {
      const P = te();
      if (P) {
        const U = yr(P.name);
        U && (P.colors = U), le(P);
      }
    }), [
      u(B, {
        get when() {
          return M() != Z;
        },
        get children() {
          var P = jc(), U = P.firstChild, J = U.nextSibling;
          return J.nextSibling, J.addEventListener("change", function() {
            const G = this.files;
            if (G && G.length > 0) {
              const re = new FileReader();
              re.onloadend = () => {
                if (re.result instanceof ArrayBuffer) {
                  const ie = new Uint8Array(re.result);
                  try {
                    try {
                      ta(ie);
                    } catch (ne) {
                      console.error(ne);
                    }
                    t.set_anim_data(ie), ee(t.get_anim_state());
                  } catch (ne) {
                    console.error(ne), ee(Q);
                  }
                }
              }, re.readAsArrayBuffer(G[0]);
            }
          }), b(P, u(B, {
            get when() {
              return M() == Q;
            },
            get children() {
              return Mc();
            }
          }), null), P;
        }
      }),
      u(B, {
        get when() {
          return Se(() => M() == Z)() && !e();
        },
        get children() {
          return u(Tc, {
            editor: t,
            setReplay: r,
            pastNinjas: n,
            globalEventState: W,
            levelName: s,
            setLevelName: o,
            roundCorners: i,
            setRoundCorners: _,
            palette: te,
            setPalette: le
          });
        }
      }),
      u(B, {
        get when() {
          return Se(() => M() == Z)() && !!e();
        },
        keyed: true,
        get children() {
          return u(Ac, {
            get replay() {
              return e();
            },
            editor: t,
            globalEventState: W
          });
        }
      })
    ];
  }
  const Bc = document.getElementById("root");
  Kr(() => u(Nc, {}), Bc);
})();
