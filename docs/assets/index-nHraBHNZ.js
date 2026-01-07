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
  const _r = false, ir = (t, e) => t === e, kt = Symbol("solid-track"), Ke = {
    equals: ir
  };
  let lr = Lt;
  const we = 1, Re = 2, St = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var R = null;
  let Ye = null, ar = null, K = null, W = null, fe = null, We = 0;
  function xe(t, e) {
    const r = K, s = R, n = t.length === 0, i = e === void 0 ? s : e, _ = n ? St : {
      owned: null,
      cleanups: null,
      context: i ? i.context : null,
      owner: i
    }, o = n ? t : () => t(() => ee(() => Ee(_)));
    R = _, K = null;
    try {
      return Ae(o, true);
    } finally {
      K = r, R = s;
    }
  }
  function b(t, e) {
    e = e ? Object.assign({}, Ke, e) : Ke;
    const r = {
      value: t,
      observers: null,
      observerSlots: null,
      comparator: e.equals || void 0
    }, s = (n) => (typeof n == "function" && (n = n(r.value)), Tt(r, n));
    return [
      Dt.bind(r),
      s
    ];
  }
  function D(t, e, r) {
    const s = Pt(t, e, false, we);
    Fe(s);
  }
  function z(t, e, r) {
    r = r ? Object.assign({}, Ke, r) : Ke;
    const s = Pt(t, e, true, 0);
    return s.observers = null, s.observerSlots = null, s.comparator = r.equals || void 0, Fe(s), Dt.bind(s);
  }
  function ee(t) {
    if (K === null) return t();
    const e = K;
    K = null;
    try {
      return t();
    } finally {
      K = e;
    }
  }
  function ge(t) {
    return R === null || (R.cleanups === null ? R.cleanups = [
      t
    ] : R.cleanups.push(t)), t;
  }
  function cr(t) {
    const e = z(t), r = z(() => Je(e()));
    return r.toArray = () => {
      const s = r();
      return Array.isArray(s) ? s : s != null ? [
        s
      ] : [];
    }, r;
  }
  function Dt() {
    if (this.sources && this.state) if (this.state === we) Fe(this);
    else {
      const t = W;
      W = null, Ae(() => Ge(this), false), W = t;
    }
    if (K) {
      const t = this.observers ? this.observers.length : 0;
      K.sources ? (K.sources.push(this), K.sourceSlots.push(t)) : (K.sources = [
        this
      ], K.sourceSlots = [
        t
      ]), this.observers ? (this.observers.push(K), this.observerSlots.push(K.sources.length - 1)) : (this.observers = [
        K
      ], this.observerSlots = [
        K.sources.length - 1
      ]);
    }
    return this.value;
  }
  function Tt(t, e, r) {
    let s = t.value;
    return (!t.comparator || !t.comparator(s, e)) && (t.value = e, t.observers && t.observers.length && Ae(() => {
      for (let n = 0; n < t.observers.length; n += 1) {
        const i = t.observers[n], _ = Ye && Ye.running;
        _ && Ye.disposed.has(i), (_ ? !i.tState : !i.state) && (i.pure ? W.push(i) : fe.push(i), i.observers && At(i)), _ || (i.state = we);
      }
      if (W.length > 1e6) throw W = [], new Error();
    }, false)), e;
  }
  function Fe(t) {
    if (!t.fn) return;
    Ee(t);
    const e = We;
    dr(t, t.value, e);
  }
  function dr(t, e, r) {
    let s;
    const n = R, i = K;
    K = R = t;
    try {
      s = t.fn(e);
    } catch (_) {
      return t.pure && (t.state = we, t.owned && t.owned.forEach(Ee), t.owned = null), t.updatedAt = r + 1, Mt(_);
    } finally {
      K = i, R = n;
    }
    (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? Tt(t, s) : t.value = s, t.updatedAt = r);
  }
  function Pt(t, e, r, s = we, n) {
    const i = {
      fn: t,
      state: s,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: e,
      owner: R,
      context: R ? R.context : null,
      pure: r
    };
    return R === null || R !== St && (R.owned ? R.owned.push(i) : R.owned = [
      i
    ]), i;
  }
  function Et(t) {
    if (t.state === 0) return;
    if (t.state === Re) return Ge(t);
    if (t.suspense && ee(t.suspense.inFallback)) return t.suspense.effects.push(t);
    const e = [
      t
    ];
    for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < We); ) t.state && e.push(t);
    for (let r = e.length - 1; r >= 0; r--) if (t = e[r], t.state === we) Fe(t);
    else if (t.state === Re) {
      const s = W;
      W = null, Ae(() => Ge(t, e[0]), false), W = s;
    }
  }
  function Ae(t, e) {
    if (W) return t();
    let r = false;
    e || (W = []), fe ? r = true : fe = [], We++;
    try {
      const s = t();
      return ur(r), s;
    } catch (s) {
      r || (fe = null), W = null, Mt(s);
    }
  }
  function ur(t) {
    if (W && (Lt(W), W = null), t) return;
    const e = fe;
    fe = null, e.length && Ae(() => lr(e), false);
  }
  function Lt(t) {
    for (let e = 0; e < t.length; e++) Et(t[e]);
  }
  function Ge(t, e) {
    t.state = 0;
    for (let r = 0; r < t.sources.length; r += 1) {
      const s = t.sources[r];
      if (s.sources) {
        const n = s.state;
        n === we ? s !== e && (!s.updatedAt || s.updatedAt < We) && Et(s) : n === Re && Ge(s, e);
      }
    }
  }
  function At(t) {
    for (let e = 0; e < t.observers.length; e += 1) {
      const r = t.observers[e];
      r.state || (r.state = Re, r.pure ? W.push(r) : fe.push(r), r.observers && At(r));
    }
  }
  function Ee(t) {
    let e;
    if (t.sources) for (; t.sources.length; ) {
      const r = t.sources.pop(), s = t.sourceSlots.pop(), n = r.observers;
      if (n && n.length) {
        const i = n.pop(), _ = r.observerSlots.pop();
        s < n.length && (i.sourceSlots[_] = s, n[s] = i, r.observerSlots[s] = _);
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
  function pr(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function Mt(t, e = R) {
    throw pr(t);
  }
  function Je(t) {
    if (typeof t == "function" && !t.length) return Je(t());
    if (Array.isArray(t)) {
      const e = [];
      for (let r = 0; r < t.length; r++) {
        const s = Je(t[r]);
        Array.isArray(s) ? e.push.apply(e, s) : e.push(s);
      }
      return e;
    }
    return t;
  }
  const Qe = Symbol("fallback");
  function qe(t) {
    for (let e = 0; e < t.length; e++) t[e]();
  }
  function hr(t, e, r = {}) {
    let s = [], n = [], i = [], _ = 0, o = e.length > 1 ? [] : null;
    return ge(() => qe(i)), () => {
      let c = t() || [], p = c.length, m, f;
      return c[kt], ee(() => {
        let T, S, L, N, A, O, C, k, P;
        if (p === 0) _ !== 0 && (qe(i), i = [], s = [], n = [], _ = 0, o && (o = [])), r.fallback && (s = [
          Qe
        ], n[0] = xe((G) => (i[0] = G, r.fallback())), _ = 1);
        else if (_ === 0) {
          for (n = new Array(p), f = 0; f < p; f++) s[f] = c[f], n[f] = xe(E);
          _ = p;
        } else {
          for (L = new Array(p), N = new Array(p), o && (A = new Array(p)), O = 0, C = Math.min(_, p); O < C && s[O] === c[O]; O++) ;
          for (C = _ - 1, k = p - 1; C >= O && k >= O && s[C] === c[k]; C--, k--) L[k] = n[C], N[k] = i[C], o && (A[k] = o[C]);
          for (T = /* @__PURE__ */ new Map(), S = new Array(k + 1), f = k; f >= O; f--) P = c[f], m = T.get(P), S[f] = m === void 0 ? -1 : m, T.set(P, f);
          for (m = O; m <= C; m++) P = s[m], f = T.get(P), f !== void 0 && f !== -1 ? (L[f] = n[m], N[f] = i[m], o && (A[f] = o[m]), f = S[f], T.set(P, f)) : i[m]();
          for (f = O; f < p; f++) f in L ? (n[f] = L[f], i[f] = N[f], o && (o[f] = A[f], o[f](f))) : n[f] = xe(E);
          n = n.slice(0, _ = p), s = c.slice(0);
        }
        return n;
      });
      function E(T) {
        if (i[f] = T, o) {
          const [S, L] = b(f);
          return o[f] = L, e(c[f], S);
        }
        return e(c[f]);
      }
    };
  }
  function fr(t, e, r = {}) {
    let s = [], n = [], i = [], _ = [], o = 0, c;
    return ge(() => qe(i)), () => {
      const p = t() || [], m = p.length;
      return p[kt], ee(() => {
        if (m === 0) return o !== 0 && (qe(i), i = [], s = [], n = [], o = 0, _ = []), r.fallback && (s = [
          Qe
        ], n[0] = xe((E) => (i[0] = E, r.fallback())), o = 1), n;
        for (s[0] === Qe && (i[0](), i = [], s = [], n = [], o = 0), c = 0; c < m; c++) c < s.length && s[c] !== p[c] ? _[c](() => p[c]) : c >= s.length && (n[c] = xe(f));
        for (; c < s.length; c++) i[c]();
        return o = _.length = i.length = m, s = p.slice(0), n = n.slice(0, o);
      });
      function f(E) {
        i[c] = E;
        const [T, S] = b(p[c]);
        return _[c] = S, e(T, c);
      }
    };
  }
  function h(t, e) {
    return ee(() => t(e || {}));
  }
  const jt = (t) => `Stale read from <${t}>.`;
  function rt(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return z(hr(() => t.each, t.children, e || void 0));
  }
  function F(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return z(fr(() => t.each, t.children, e || void 0));
  }
  function U(t) {
    const e = t.keyed, r = z(() => t.when, void 0, void 0), s = e ? r : z(r, void 0, {
      equals: (n, i) => !n == !i
    });
    return z(() => {
      const n = s();
      if (n) {
        const i = t.children;
        return typeof i == "function" && i.length > 0 ? ee(() => i(e ? n : () => {
          if (!ee(s)) throw jt("Show");
          return r();
        })) : i;
      }
      return t.fallback;
    }, void 0, void 0);
  }
  function gr(t) {
    const e = cr(() => t.children), r = z(() => {
      const s = e(), n = Array.isArray(s) ? s : [
        s
      ];
      let i = () => {
      };
      for (let _ = 0; _ < n.length; _++) {
        const o = _, c = n[_], p = i, m = z(() => p() ? void 0 : c.when, void 0, void 0), f = c.keyed ? m : z(m, void 0, {
          equals: (E, T) => !E == !T
        });
        i = () => p() || (f() ? [
          o,
          m,
          c
        ] : void 0);
      }
      return i;
    });
    return z(() => {
      const s = r()();
      if (!s) return t.fallback;
      const [n, i, _] = s, o = _.children;
      return typeof o == "function" && o.length > 0 ? ee(() => o(_.keyed ? i() : () => {
        var _a;
        if (((_a = ee(r)()) == null ? void 0 : _a[0]) !== n) throw jt("Match");
        return i();
      })) : o;
    }, void 0, void 0);
  }
  function st(t) {
    return t;
  }
  const be = (t) => z(() => t());
  function wr(t, e, r) {
    let s = r.length, n = e.length, i = s, _ = 0, o = 0, c = e[n - 1].nextSibling, p = null;
    for (; _ < n || o < i; ) {
      if (e[_] === r[o]) {
        _++, o++;
        continue;
      }
      for (; e[n - 1] === r[i - 1]; ) n--, i--;
      if (n === _) {
        const m = i < s ? o ? r[o - 1].nextSibling : r[i - o] : c;
        for (; o < i; ) t.insertBefore(r[o++], m);
      } else if (i === o) for (; _ < n; ) (!p || !p.has(e[_])) && e[_].remove(), _++;
      else if (e[_] === r[i - 1] && r[o] === e[n - 1]) {
        const m = e[--n].nextSibling;
        t.insertBefore(r[o++], e[_++].nextSibling), t.insertBefore(r[--i], m), e[n] = r[i];
      } else {
        if (!p) {
          p = /* @__PURE__ */ new Map();
          let f = o;
          for (; f < i; ) p.set(r[f], f++);
        }
        const m = p.get(e[_]);
        if (m != null) if (o < m && m < i) {
          let f = _, E = 1, T;
          for (; ++f < n && f < i && !((T = p.get(e[f])) == null || T !== m + E); ) E++;
          if (E > m - o) {
            const S = e[_];
            for (; o < m; ) t.insertBefore(r[o++], S);
          } else t.replaceChild(r[o++], e[_++]);
        } else _++;
        else e[_++].remove();
      }
    }
  }
  const ot = "_$DX_DELEGATE";
  function yr(t, e, r, s = {}) {
    let n;
    return xe((i) => {
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
    }, _ = e ? () => ee(() => document.importNode(n || (n = i()), true)) : () => (n || (n = i())).cloneNode(true);
    return _.cloneNode = _, _;
  }
  function He(t, e = window.document) {
    const r = e[ot] || (e[ot] = /* @__PURE__ */ new Set());
    for (let s = 0, n = t.length; s < n; s++) {
      const i = t[s];
      r.has(i) || (r.add(i), e.addEventListener(i, br));
    }
  }
  function y(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function Ce(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function mr(t, e, r) {
    return ee(() => t(e, r));
  }
  function x(t, e, r, s) {
    if (r !== void 0 && !s && (s = []), typeof e != "function") return Ue(t, e, s, r);
    D((n) => Ue(t, e(), n, r), s);
  }
  function br(t) {
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
        o && o.nodeType === 3 ? o.data !== e && (o.data = e) : o = document.createTextNode(e), r = ye(t, r, s, o);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || i === "boolean") r = ye(t, r, s);
    else {
      if (i === "function") return D(() => {
        let o = e();
        for (; typeof o == "function"; ) o = o();
        r = Ue(t, o, r, s);
      }), () => r;
      if (Array.isArray(e)) {
        const o = [], c = r && Array.isArray(r);
        if (et(o, e, r, n)) return D(() => r = Ue(t, o, r, s, true)), () => r;
        if (o.length === 0) {
          if (r = ye(t, r, s), _) return r;
        } else c ? r.length === 0 ? nt(t, o, s) : wr(t, r, o) : (r && ye(t), nt(t, o));
        r = o;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (_) return r = ye(t, r, s, e);
          ye(t, r, null, e);
        } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
        r = e;
      }
    }
    return r;
  }
  function et(t, e, r, s) {
    let n = false;
    for (let i = 0, _ = e.length; i < _; i++) {
      let o = e[i], c = r && r[t.length], p;
      if (!(o == null || o === true || o === false)) if ((p = typeof o) == "object" && o.nodeType) t.push(o);
      else if (Array.isArray(o)) n = et(t, o, c) || n;
      else if (p === "function") if (s) {
        for (; typeof o == "function"; ) o = o();
        n = et(t, Array.isArray(o) ? o : [
          o
        ], Array.isArray(c) ? c : [
          c
        ]) || n;
      } else t.push(o), n = true;
      else {
        const m = String(o);
        c && c.nodeType === 3 && c.data === m ? t.push(c) : t.push(document.createTextNode(m));
      }
    }
    return n;
  }
  function nt(t, e, r = null) {
    for (let s = 0, n = e.length; s < n; s++) t.insertBefore(e[s], r);
  }
  function ye(t, e, r, s) {
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
  const xr = "" + new URL("ntools_rs_bg-K8xG8Mos.wasm", import.meta.url).href, vr = async (t = {}, e) => {
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
  function $r(t) {
    l = t;
  }
  let Ne = null;
  function ve() {
    return (Ne === null || Ne.byteLength === 0) && (Ne = new Uint8Array(l.memory.buffer)), Ne;
  }
  let Ie = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  Ie.decode();
  const kr = 2146435072;
  let ze = 0;
  function Sr(t, e) {
    return ze += e, ze >= kr && (Ie = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), Ie.decode(), ze = e), Ie.decode(ve().subarray(t, t + e));
  }
  function he(t, e) {
    return t = t >>> 0, Sr(t, e);
  }
  let ue = 0;
  function Ve(t, e) {
    const r = e(t.length * 1, 1) >>> 0;
    return ve().set(t, r / 1), ue = t.length, r;
  }
  function Be(t) {
    const e = l.__wbindgen_externrefs.get(t);
    return l.__externref_table_dealloc(t), e;
  }
  function Dr(t, e) {
    return t = t >>> 0, ve().subarray(t / 1, t / 1 + e);
  }
  const Pe = new TextEncoder();
  "encodeInto" in Pe || (Pe.encodeInto = function(t, e) {
    const r = Pe.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function Tr(t, e, r) {
    if (r === void 0) {
      const o = Pe.encode(t), c = e(o.length, 1) >>> 0;
      return ve().subarray(c, c + o.length).set(o), ue = o.length, c;
    }
    let s = t.length, n = e(s, 1) >>> 0;
    const i = ve();
    let _ = 0;
    for (; _ < s; _++) {
      const o = t.charCodeAt(_);
      if (o > 127) break;
      i[n + _] = o;
    }
    if (_ !== s) {
      _ !== 0 && (t = t.slice(_)), n = r(n, s, s = _ + t.length * 3, 1) >>> 0;
      const o = ve().subarray(n + _, n + s), c = Pe.encodeInto(t, o);
      _ += c.written, n = r(n, s, _, 1) >>> 0;
    }
    return ue = _, n;
  }
  let me = null;
  function Pr() {
    return (me === null || me.buffer.detached === true || me.buffer.detached === void 0 && me.buffer !== l.memory.buffer) && (me = new DataView(l.memory.buffer)), me;
  }
  function _t(t, e) {
    t = t >>> 0;
    const r = Pr(), s = [];
    for (let n = t; n < t + 4 * e; n += 4) s.push(l.__wbindgen_externrefs.get(r.getUint32(n, true)));
    return l.__externref_drop_slice(t, e), s;
  }
  let Oe = null;
  function Er() {
    return (Oe === null || Oe.byteLength === 0) && (Oe = new Float64Array(l.memory.buffer)), Oe;
  }
  function it(t, e) {
    return t = t >>> 0, Er().subarray(t / 8, t / 8 + e);
  }
  function Ct(t) {
    const e = Ve(t, l.__wbindgen_malloc), r = ue;
    l.set_anim_data(e, r);
  }
  function lt() {
    return l.get_anim_state() >>> 0;
  }
  const at = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_editor_free(t >>> 0, 1));
  class $e {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create($e.prototype);
      return r.__wbg_ptr = e, at.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, at.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      l.__wbg_editor_free(e, 0);
    }
    static new() {
      const e = l.editor_new();
      return $e.__wrap(e);
    }
    load_attract(e) {
      const r = Ve(e, l.__wbindgen_malloc), s = ue, n = l.editor_load_attract(this.__wbg_ptr, r, s);
      if (n[1]) throw Be(n[0]);
    }
    load_map(e) {
      const r = Ve(e, l.__wbindgen_malloc), s = ue, n = l.editor_load_map(this.__wbg_ptr, r, s);
      if (n[1]) throw Be(n[0]);
    }
    export_map() {
      const e = l.editor_export_map(this.__wbg_ptr);
      var r = Dr(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 1, 1), r;
    }
    get_level_name() {
      let e, r;
      try {
        const s = l.editor_get_level_name(this.__wbg_ptr);
        return e = s[0], r = s[1], he(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    set_level_name(e) {
      const r = Tr(e, l.__wbindgen_malloc, l.__wbindgen_realloc), s = ue;
      l.editor_set_level_name(this.__wbg_ptr, r, s);
    }
    to_replay(e) {
      const r = l.editor_to_replay(this.__wbg_ptr, e);
      if (r[2]) throw Be(r[1]);
      return ke.__wrap(r[0]);
    }
    mode() {
      return l.editor_mode(this.__wbg_ptr) >>> 0;
    }
    tiles_path() {
      let e, r;
      try {
        const s = l.editor_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], he(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    selected_tiles_path() {
      let e, r;
      try {
        const s = l.editor_selected_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], he(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    palette_center_x() {
      return l.editor_palette_center_x(this.__wbg_ptr);
    }
    palette_center_y() {
      return l.editor_palette_center_y(this.__wbg_ptr);
    }
    palette_selection_x() {
      return l.editor_palette_selection_x(this.__wbg_ptr);
    }
    palette_selection_y() {
      return l.editor_palette_selection_y(this.__wbg_ptr);
    }
    set_cursor_pos(e, r, s) {
      return l.editor_set_cursor_pos(this.__wbg_ptr, e, r, s) !== 0;
    }
    cursor_down(e) {
      l.editor_cursor_down(this.__wbg_ptr, e);
    }
    cursor_up() {
      l.editor_cursor_up(this.__wbg_ptr);
    }
    double_click(e) {
      l.editor_double_click(this.__wbg_ptr, e);
    }
    tile_crosshair_col() {
      return l.editor_tile_crosshair_col(this.__wbg_ptr);
    }
    tile_crosshair_row() {
      return l.editor_tile_crosshair_row(this.__wbg_ptr);
    }
    crosshair_x() {
      return l.editor_crosshair_x(this.__wbg_ptr);
    }
    crosshair_y() {
      return l.editor_crosshair_y(this.__wbg_ptr);
    }
    entities() {
      const e = l.editor_entities(this.__wbg_ptr);
      var r = _t(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    preview_entities() {
      const e = l.editor_preview_entities(this.__wbg_ptr);
      var r = _t(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    selected_tile_outline_path() {
      let e, r;
      try {
        const s = l.editor_selected_tile_outline_path(this.__wbg_ptr);
        return e = s[0], r = s[1], he(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    show_half_grid() {
      return l.editor_show_half_grid(this.__wbg_ptr) !== 0;
    }
    show_quarter_grid() {
      return l.editor_show_quarter_grid(this.__wbg_ptr) !== 0;
    }
    undo() {
      l.editor_undo(this.__wbg_ptr);
    }
    redo() {
      l.editor_redo(this.__wbg_ptr);
    }
    press_escape() {
      return l.editor_press_escape(this.__wbg_ptr) !== 0;
    }
    press_backtick() {
      l.editor_press_backtick(this.__wbg_ptr);
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
    press_0() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_dash() {
      l.editor_press_dash(this.__wbg_ptr);
    }
    press_equals() {
      l.editor_press_equals(this.__wbg_ptr);
    }
    press_q(e) {
      l.editor_press_q(this.__wbg_ptr, e);
    }
    press_w(e) {
      l.editor_press_w(this.__wbg_ptr, e);
    }
    press_a(e) {
      l.editor_press_a(this.__wbg_ptr, e);
    }
    press_s(e) {
      l.editor_press_s(this.__wbg_ptr, e);
    }
    press_e() {
      l.editor_press_e(this.__wbg_ptr);
    }
    press_d() {
      l.editor_press_d(this.__wbg_ptr);
    }
    press_z() {
      l.editor_press_z(this.__wbg_ptr);
    }
    press_x() {
      l.editor_press_x(this.__wbg_ptr);
    }
    press_c() {
      l.editor_press_c(this.__wbg_ptr);
    }
    press_t() {
      l.editor_press_t(this.__wbg_ptr);
    }
    press_y() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_u() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_i() {
      l.editor_press_i(this.__wbg_ptr);
    }
    press_o() {
      l.editor_press_o(this.__wbg_ptr);
    }
    press_p() {
      l.editor_press_p(this.__wbg_ptr);
    }
    press_bracket_left() {
      l.editor_press_bracket_left(this.__wbg_ptr);
    }
    press_bracket_right() {
      l.editor_press_bracket_right(this.__wbg_ptr);
    }
    press_f() {
      l.editor_press_f(this.__wbg_ptr);
    }
    press_h() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_j() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_k() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_l() {
      l.editor_press_0(this.__wbg_ptr);
    }
    press_n() {
      l.editor_press_n(this.__wbg_ptr);
    }
    press_m() {
      l.editor_press_m(this.__wbg_ptr);
    }
    press_comma() {
      l.editor_press_comma(this.__wbg_ptr);
    }
    press_slash() {
      l.editor_press_slash(this.__wbg_ptr);
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
    press_up(e) {
      l.editor_press_up(this.__wbg_ptr, e);
    }
    press_down(e) {
      l.editor_press_down(this.__wbg_ptr, e);
    }
    press_left(e) {
      l.editor_press_left(this.__wbg_ptr, e);
    }
    press_right(e) {
      l.editor_press_right(this.__wbg_ptr, e);
    }
    press_enter() {
      l.editor_press_enter(this.__wbg_ptr);
    }
    press_space() {
      l.editor_press_space(this.__wbg_ptr);
    }
    press_alt_left(e) {
      l.editor_press_alt_left(this.__wbg_ptr, e);
    }
    press_shift() {
      l.editor_press_shift(this.__wbg_ptr);
    }
    release_q() {
      l.editor_release_q(this.__wbg_ptr);
    }
    release_w() {
      l.editor_release_w(this.__wbg_ptr);
    }
    release_a() {
      l.editor_release_a(this.__wbg_ptr);
    }
    release_s() {
      l.editor_release_s(this.__wbg_ptr);
    }
    release_e() {
      l.editor_release_e(this.__wbg_ptr);
    }
    release_d() {
      l.editor_release_d(this.__wbg_ptr);
    }
    release_z() {
      l.editor_release_z(this.__wbg_ptr);
    }
    release_c() {
      l.editor_release_c(this.__wbg_ptr);
    }
    release_space() {
      l.editor_release_space(this.__wbg_ptr);
    }
    release_alt_left() {
      l.editor_release_alt_left(this.__wbg_ptr);
    }
    release_shift() {
      l.editor_release_shift(this.__wbg_ptr);
    }
    receive_past_ninjas() {
      l.editor_receive_past_ninjas(this.__wbg_ptr);
    }
    past_ninjas_len() {
      return l.editor_past_ninjas_len(this.__wbg_ptr) >>> 0;
    }
    past_ninja_x(e) {
      return l.editor_past_ninja_x(this.__wbg_ptr, e);
    }
    past_ninja_y(e) {
      return l.editor_past_ninja_y(this.__wbg_ptr, e);
    }
  }
  Symbol.dispose && ($e.prototype[Symbol.dispose] = $e.prototype.free);
  const ct = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_exportedentity_free(t >>> 0, 1));
  class Le {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Le.prototype);
      return r.__wbg_ptr = e, ct.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, ct.unregister(this), e;
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
  Symbol.dispose && (Le.prototype[Symbol.dispose] = Le.prototype.free);
  const dt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_replay_free(t >>> 0, 1));
  class ke {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(ke.prototype);
      return r.__wbg_ptr = e, dt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, dt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      l.__wbg_replay_free(e, 0);
    }
    static from_attract(e) {
      const r = Ve(e, l.__wbindgen_malloc), s = ue, n = l.replay_from_attract(r, s);
      if (n[2]) throw Be(n[1]);
      return ke.__wrap(n[0]);
    }
    send_past_ninjas() {
      l.replay_send_past_ninjas(this.__wbg_ptr);
    }
    set_input(e, r, s, n) {
      l.replay_set_input(this.__wbg_ptr, e, r, s, n);
    }
    tick() {
      l.replay_tick(this.__wbg_ptr);
    }
    seek(e) {
      l.replay_seek(this.__wbg_ptr, e);
    }
    seek_preview(e) {
      l.replay_seek_preview(this.__wbg_ptr, e);
    }
    place_ninja(e, r) {
      l.replay_place_ninja(this.__wbg_ptr, e, r);
    }
    replay_length() {
      return l.replay_replay_length(this.__wbg_ptr) >>> 0;
    }
    progress() {
      return l.replay_progress(this.__wbg_ptr) >>> 0;
    }
    progress_preview() {
      return l.replay_progress_preview(this.__wbg_ptr) >>> 0;
    }
    tiles_path() {
      let e, r;
      try {
        const s = l.replay_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], he(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    ninja_x(e) {
      return l.replay_ninja_x(this.__wbg_ptr, e);
    }
    ninja_y(e) {
      return l.replay_ninja_y(this.__wbg_ptr, e);
    }
    ninja_preview_x(e) {
      return l.replay_ninja_preview_x(this.__wbg_ptr, e);
    }
    ninja_preview_y(e) {
      return l.replay_ninja_preview_y(this.__wbg_ptr, e);
    }
    ninja_bones(e) {
      const r = l.replay_ninja_bones(this.__wbg_ptr, e);
      var s = it(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 8, 8), s;
    }
    ninja_preview_bones(e) {
      const r = l.replay_ninja_preview_bones(this.__wbg_ptr, e);
      var s = it(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 8, 8), s;
    }
    mines_len() {
      return l.replay_mines_len(this.__wbg_ptr) >>> 0;
    }
    mine_x(e) {
      return l.replay_mine_x(this.__wbg_ptr, e);
    }
    mine_y(e) {
      return l.replay_mine_y(this.__wbg_ptr, e);
    }
    mine_state(e) {
      return l.replay_mine_state(this.__wbg_ptr, e);
    }
    bounce_blocks_len() {
      return l.replay_bounce_blocks_len(this.__wbg_ptr) >>> 0;
    }
    bounce_block_x(e, r) {
      return l.replay_bounce_block_x(this.__wbg_ptr, e, r);
    }
    bounce_block_y(e, r) {
      return l.replay_bounce_block_y(this.__wbg_ptr, e, r);
    }
    bounce_block_deg(e) {
      return l.replay_bounce_block_deg(this.__wbg_ptr, e);
    }
    one_ways_len() {
      return l.replay_one_ways_len(this.__wbg_ptr) >>> 0;
    }
    one_way_x(e) {
      return l.replay_one_way_x(this.__wbg_ptr, e);
    }
    one_way_y(e) {
      return l.replay_one_way_y(this.__wbg_ptr, e);
    }
    one_way_deg(e) {
      return l.replay_one_way_deg(this.__wbg_ptr, e);
    }
    boost_pads_len() {
      return l.replay_boost_pads_len(this.__wbg_ptr) >>> 0;
    }
    boost_pad_x(e) {
      return l.replay_boost_pad_x(this.__wbg_ptr, e);
    }
    boost_pad_y(e) {
      return l.replay_boost_pad_y(this.__wbg_ptr, e);
    }
    boost_pad_deg(e, r) {
      return l.replay_boost_pad_deg(this.__wbg_ptr, e, r);
    }
    boost_pad_anim_progress(e, r) {
      return l.replay_boost_pad_anim_progress(this.__wbg_ptr, e, r);
    }
    exit_doors_len() {
      return l.replay_exit_doors_len(this.__wbg_ptr) >>> 0;
    }
    exit_door_x(e) {
      return l.replay_exit_door_x(this.__wbg_ptr, e);
    }
    exit_door_y(e) {
      return l.replay_exit_door_y(this.__wbg_ptr, e);
    }
    exit_anim_progress(e, r) {
      return l.replay_exit_anim_progress(this.__wbg_ptr, e, r);
    }
    exit_switch_x(e) {
      return l.replay_exit_switch_x(this.__wbg_ptr, e);
    }
    exit_switch_y(e) {
      return l.replay_exit_switch_y(this.__wbg_ptr, e);
    }
    thwumps_len() {
      return l.replay_thwumps_len(this.__wbg_ptr) >>> 0;
    }
    thwump_x(e, r) {
      return l.replay_thwump_x(this.__wbg_ptr, e, r);
    }
    thwump_y(e, r) {
      return l.replay_thwump_y(this.__wbg_ptr, e, r);
    }
    thwump_deg(e) {
      return l.replay_thwump_deg(this.__wbg_ptr, e);
    }
    launch_pads_len() {
      return l.replay_launch_pads_len(this.__wbg_ptr) >>> 0;
    }
    launch_pad_x(e) {
      return l.replay_launch_pad_x(this.__wbg_ptr, e);
    }
    launch_pad_y(e) {
      return l.replay_launch_pad_y(this.__wbg_ptr, e);
    }
    launch_pad_deg(e) {
      return l.replay_launch_pad_deg(this.__wbg_ptr, e);
    }
    floor_guards_len() {
      return l.replay_floor_guards_len(this.__wbg_ptr) >>> 0;
    }
    floor_guard_x(e, r) {
      return l.replay_floor_guard_x(this.__wbg_ptr, e, r);
    }
    floor_guard_y(e, r) {
      return l.replay_floor_guard_y(this.__wbg_ptr, e, r);
    }
    floor_guard_deg(e) {
      return l.replay_floor_guard_deg(this.__wbg_ptr, e);
    }
    locked_doors_len() {
      return l.replay_locked_doors_len(this.__wbg_ptr) >>> 0;
    }
    locked_door_x(e) {
      return l.replay_locked_door_x(this.__wbg_ptr, e);
    }
    locked_door_y(e) {
      return l.replay_locked_door_y(this.__wbg_ptr, e);
    }
    locked_door_deg(e) {
      return l.replay_locked_door_deg(this.__wbg_ptr, e);
    }
    locked_door_anim_progress(e, r) {
      return l.replay_locked_door_anim_progress(this.__wbg_ptr, e, r);
    }
    locked_switch_x(e) {
      return l.replay_locked_switch_x(this.__wbg_ptr, e);
    }
    locked_switch_y(e) {
      return l.replay_locked_switch_y(this.__wbg_ptr, e);
    }
    trap_doors_len() {
      return l.replay_trap_doors_len(this.__wbg_ptr) >>> 0;
    }
    trap_door_x(e) {
      return l.replay_trap_door_x(this.__wbg_ptr, e);
    }
    trap_door_y(e) {
      return l.replay_trap_door_y(this.__wbg_ptr, e);
    }
    trap_door_deg(e) {
      return l.replay_trap_door_deg(this.__wbg_ptr, e);
    }
    trap_door_anim_progress(e, r) {
      return l.replay_trap_door_anim_progress(this.__wbg_ptr, e, r);
    }
    trap_switch_x(e) {
      return l.replay_trap_switch_x(this.__wbg_ptr, e);
    }
    trap_switch_y(e) {
      return l.replay_trap_switch_y(this.__wbg_ptr, e);
    }
    regular_doors_len() {
      return l.replay_regular_doors_len(this.__wbg_ptr) >>> 0;
    }
    regular_door_x(e) {
      return l.replay_regular_door_x(this.__wbg_ptr, e);
    }
    regular_door_y(e) {
      return l.replay_regular_door_y(this.__wbg_ptr, e);
    }
    regular_door_deg(e) {
      return l.replay_regular_door_deg(this.__wbg_ptr, e);
    }
    regular_door_anim_progress(e, r) {
      return l.replay_regular_door_anim_progress(this.__wbg_ptr, e, r);
    }
    shove_thwumps_len() {
      return l.replay_shove_thwumps_len(this.__wbg_ptr) >>> 0;
    }
    shove_thwump_x(e, r) {
      return l.replay_shove_thwump_x(this.__wbg_ptr, e, r);
    }
    shove_thwump_y(e, r) {
      return l.replay_shove_thwump_y(this.__wbg_ptr, e, r);
    }
    shove_thwump_deg(e) {
      return l.replay_shove_thwump_deg(this.__wbg_ptr, e);
    }
    shove_thwump_touch(e) {
      return l.replay_shove_thwump_touch(this.__wbg_ptr, e);
    }
  }
  Symbol.dispose && (ke.prototype[Symbol.dispose] = ke.prototype.free);
  function Lr(t, e) {
    throw new Error(he(t, e));
  }
  function Ar(t) {
    return Le.__wrap(t);
  }
  function Mr(t, e) {
    return he(t, e);
  }
  function jr() {
    const t = l.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const a = await vr({
    "./ntools_rs_bg.js": {
      __wbg_exportedentity_new: Ar,
      __wbg___wbindgen_throw_b855445ff6a94295: Lr,
      __wbindgen_init_externref_table: jr,
      __wbindgen_cast_2241b6af4c4b2941: Mr
    }
  }, xr), Cr = a.memory, Nr = a.__wbg_editor_free, Or = a.editor_new, Ir = a.editor_load_attract, Br = a.editor_load_map, Kr = a.editor_export_map, Rr = a.editor_get_level_name, Gr = a.editor_set_level_name, qr = a.editor_to_replay, Ur = a.editor_mode, Vr = a.editor_tiles_path, Wr = a.editor_selected_tiles_path, Fr = a.editor_palette_center_x, Hr = a.editor_palette_center_y, Yr = a.editor_palette_selection_x, zr = a.editor_palette_selection_y, Xr = a.editor_set_cursor_pos, Zr = a.editor_cursor_down, Jr = a.editor_cursor_up, Qr = a.editor_double_click, es = a.editor_tile_crosshair_col, ts = a.editor_tile_crosshair_row, rs = a.editor_crosshair_x, ss = a.editor_crosshair_y, os = a.editor_entities, ns = a.editor_preview_entities, _s = a.editor_selected_tile_outline_path, is = a.editor_show_half_grid, ls = a.editor_show_quarter_grid, as = a.editor_undo, cs = a.editor_redo, ds = a.editor_press_escape, us = a.editor_press_backtick, ps = a.editor_press_1, hs = a.editor_press_2, fs = a.editor_press_3, gs = a.editor_press_4, ws = a.editor_press_5, ys = a.editor_press_6, ms = a.editor_press_7, bs = a.editor_press_8, xs = a.editor_press_9, vs = a.editor_press_0, $s = a.editor_press_dash, ks = a.editor_press_equals, Ss = a.editor_press_q, Ds = a.editor_press_w, Ts = a.editor_press_a, Ps = a.editor_press_s, Es = a.editor_press_e, Ls = a.editor_press_d, As = a.editor_press_z, Ms = a.editor_press_x, js = a.editor_press_c, Cs = a.editor_press_t, Ns = a.editor_press_i, Os = a.editor_press_o, Is = a.editor_press_p, Bs = a.editor_press_bracket_left, Ks = a.editor_press_bracket_right, Rs = a.editor_press_f, Gs = a.editor_press_n, qs = a.editor_press_m, Us = a.editor_press_comma, Vs = a.editor_press_slash, Ws = a.editor_press_num_0, Fs = a.editor_press_num_3, Hs = a.editor_press_num_7, Ys = a.editor_press_up, zs = a.editor_press_down, Xs = a.editor_press_left, Zs = a.editor_press_right, Js = a.editor_press_enter, Qs = a.editor_press_space, eo = a.editor_press_alt_left, to = a.editor_press_shift, ro = a.editor_release_q, so = a.editor_release_w, oo = a.editor_release_a, no = a.editor_release_s, _o = a.editor_release_e, io = a.editor_release_d, lo = a.editor_release_z, ao = a.editor_release_c, co = a.editor_release_space, uo = a.editor_release_alt_left, po = a.editor_release_shift, ho = a.editor_receive_past_ninjas, fo = a.editor_past_ninjas_len, go = a.editor_past_ninja_x, wo = a.editor_past_ninja_y, yo = a.__wbg_replay_free, mo = a.replay_from_attract, bo = a.replay_send_past_ninjas, xo = a.replay_set_input, vo = a.replay_tick, $o = a.replay_seek, ko = a.replay_seek_preview, So = a.replay_place_ninja, Do = a.replay_replay_length, To = a.replay_progress, Po = a.replay_progress_preview, Eo = a.replay_tiles_path, Lo = a.replay_ninja_x, Ao = a.replay_ninja_y, Mo = a.replay_ninja_preview_x, jo = a.replay_ninja_preview_y, Co = a.replay_ninja_bones, No = a.replay_ninja_preview_bones, Oo = a.replay_mines_len, Io = a.replay_mine_x, Bo = a.replay_mine_y, Ko = a.replay_mine_state, Ro = a.replay_bounce_blocks_len, Go = a.replay_bounce_block_x, qo = a.replay_bounce_block_y, Uo = a.replay_bounce_block_deg, Vo = a.replay_one_ways_len, Wo = a.replay_one_way_x, Fo = a.replay_one_way_y, Ho = a.replay_one_way_deg, Yo = a.replay_boost_pads_len, zo = a.replay_boost_pad_x, Xo = a.replay_boost_pad_y, Zo = a.replay_boost_pad_deg, Jo = a.replay_boost_pad_anim_progress, Qo = a.replay_exit_doors_len, en = a.replay_exit_door_x, tn = a.replay_exit_door_y, rn = a.replay_exit_anim_progress, sn = a.replay_exit_switch_x, on = a.replay_exit_switch_y, nn = a.replay_thwumps_len, _n = a.replay_thwump_x, ln = a.replay_thwump_y, an = a.replay_thwump_deg, cn = a.replay_launch_pads_len, dn = a.replay_launch_pad_x, un = a.replay_launch_pad_y, pn = a.replay_launch_pad_deg, hn = a.replay_floor_guards_len, fn = a.replay_floor_guard_x, gn = a.replay_floor_guard_y, wn = a.replay_floor_guard_deg, yn = a.replay_locked_doors_len, mn = a.replay_locked_door_x, bn = a.replay_locked_door_y, xn = a.replay_locked_door_deg, vn = a.replay_locked_door_anim_progress, $n = a.replay_locked_switch_x, kn = a.replay_locked_switch_y, Sn = a.replay_trap_doors_len, Dn = a.replay_trap_door_x, Tn = a.replay_trap_door_y, Pn = a.replay_trap_door_deg, En = a.replay_trap_door_anim_progress, Ln = a.replay_trap_switch_x, An = a.replay_trap_switch_y, Mn = a.replay_regular_doors_len, jn = a.replay_regular_door_x, Cn = a.replay_regular_door_y, Nn = a.replay_regular_door_deg, On = a.replay_regular_door_anim_progress, In = a.replay_shove_thwumps_len, Bn = a.replay_shove_thwump_x, Kn = a.replay_shove_thwump_y, Rn = a.replay_shove_thwump_deg, Gn = a.replay_shove_thwump_touch, qn = a.__wbg_exportedentity_free, Un = a.__wbg_get_exportedentity_type_int, Vn = a.__wbg_set_exportedentity_type_int, Wn = a.__wbg_get_exportedentity_x, Fn = a.__wbg_set_exportedentity_x, Hn = a.__wbg_get_exportedentity_y, Yn = a.__wbg_set_exportedentity_y, zn = a.__wbg_get_exportedentity_deg, Xn = a.__wbg_set_exportedentity_deg, Zn = a.__wbg_get_exportedentity_switch_x, Jn = a.__wbg_set_exportedentity_switch_x, Qn = a.__wbg_get_exportedentity_switch_y, e_ = a.__wbg_set_exportedentity_switch_y, t_ = a.set_anim_data, r_ = a.get_anim_state, s_ = a.editor_press_y, o_ = a.editor_press_u, n_ = a.editor_press_h, __ = a.editor_press_j, i_ = a.editor_press_k, l_ = a.editor_press_l, a_ = a.editor_press_num_1, c_ = a.editor_press_num_2, d_ = a.editor_press_num_4, u_ = a.editor_press_num_5, p_ = a.__wbindgen_externrefs, h_ = a.__wbindgen_malloc, f_ = a.__externref_table_dealloc, g_ = a.__wbindgen_free, w_ = a.__wbindgen_realloc, y_ = a.__externref_drop_slice, Nt = a.__wbindgen_start, m_ = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: y_,
    __externref_table_dealloc: f_,
    __wbg_editor_free: Nr,
    __wbg_exportedentity_free: qn,
    __wbg_get_exportedentity_deg: zn,
    __wbg_get_exportedentity_switch_x: Zn,
    __wbg_get_exportedentity_switch_y: Qn,
    __wbg_get_exportedentity_type_int: Un,
    __wbg_get_exportedentity_x: Wn,
    __wbg_get_exportedentity_y: Hn,
    __wbg_replay_free: yo,
    __wbg_set_exportedentity_deg: Xn,
    __wbg_set_exportedentity_switch_x: Jn,
    __wbg_set_exportedentity_switch_y: e_,
    __wbg_set_exportedentity_type_int: Vn,
    __wbg_set_exportedentity_x: Fn,
    __wbg_set_exportedentity_y: Yn,
    __wbindgen_externrefs: p_,
    __wbindgen_free: g_,
    __wbindgen_malloc: h_,
    __wbindgen_realloc: w_,
    __wbindgen_start: Nt,
    editor_crosshair_x: rs,
    editor_crosshair_y: ss,
    editor_cursor_down: Zr,
    editor_cursor_up: Jr,
    editor_double_click: Qr,
    editor_entities: os,
    editor_export_map: Kr,
    editor_get_level_name: Rr,
    editor_load_attract: Ir,
    editor_load_map: Br,
    editor_mode: Ur,
    editor_new: Or,
    editor_palette_center_x: Fr,
    editor_palette_center_y: Hr,
    editor_palette_selection_x: Yr,
    editor_palette_selection_y: zr,
    editor_past_ninja_x: go,
    editor_past_ninja_y: wo,
    editor_past_ninjas_len: fo,
    editor_press_0: vs,
    editor_press_1: ps,
    editor_press_2: hs,
    editor_press_3: fs,
    editor_press_4: gs,
    editor_press_5: ws,
    editor_press_6: ys,
    editor_press_7: ms,
    editor_press_8: bs,
    editor_press_9: xs,
    editor_press_a: Ts,
    editor_press_alt_left: eo,
    editor_press_backtick: us,
    editor_press_bracket_left: Bs,
    editor_press_bracket_right: Ks,
    editor_press_c: js,
    editor_press_comma: Us,
    editor_press_d: Ls,
    editor_press_dash: $s,
    editor_press_down: zs,
    editor_press_e: Es,
    editor_press_enter: Js,
    editor_press_equals: ks,
    editor_press_escape: ds,
    editor_press_f: Rs,
    editor_press_h: n_,
    editor_press_i: Ns,
    editor_press_j: __,
    editor_press_k: i_,
    editor_press_l: l_,
    editor_press_left: Xs,
    editor_press_m: qs,
    editor_press_n: Gs,
    editor_press_num_0: Ws,
    editor_press_num_1: a_,
    editor_press_num_2: c_,
    editor_press_num_3: Fs,
    editor_press_num_4: d_,
    editor_press_num_5: u_,
    editor_press_num_7: Hs,
    editor_press_o: Os,
    editor_press_p: Is,
    editor_press_q: Ss,
    editor_press_right: Zs,
    editor_press_s: Ps,
    editor_press_shift: to,
    editor_press_slash: Vs,
    editor_press_space: Qs,
    editor_press_t: Cs,
    editor_press_u: o_,
    editor_press_up: Ys,
    editor_press_w: Ds,
    editor_press_x: Ms,
    editor_press_y: s_,
    editor_press_z: As,
    editor_preview_entities: ns,
    editor_receive_past_ninjas: ho,
    editor_redo: cs,
    editor_release_a: oo,
    editor_release_alt_left: uo,
    editor_release_c: ao,
    editor_release_d: io,
    editor_release_e: _o,
    editor_release_q: ro,
    editor_release_s: no,
    editor_release_shift: po,
    editor_release_space: co,
    editor_release_w: so,
    editor_release_z: lo,
    editor_selected_tile_outline_path: _s,
    editor_selected_tiles_path: Wr,
    editor_set_cursor_pos: Xr,
    editor_set_level_name: Gr,
    editor_show_half_grid: is,
    editor_show_quarter_grid: ls,
    editor_tile_crosshair_col: es,
    editor_tile_crosshair_row: ts,
    editor_tiles_path: Vr,
    editor_to_replay: qr,
    editor_undo: as,
    get_anim_state: r_,
    memory: Cr,
    replay_boost_pad_anim_progress: Jo,
    replay_boost_pad_deg: Zo,
    replay_boost_pad_x: zo,
    replay_boost_pad_y: Xo,
    replay_boost_pads_len: Yo,
    replay_bounce_block_deg: Uo,
    replay_bounce_block_x: Go,
    replay_bounce_block_y: qo,
    replay_bounce_blocks_len: Ro,
    replay_exit_anim_progress: rn,
    replay_exit_door_x: en,
    replay_exit_door_y: tn,
    replay_exit_doors_len: Qo,
    replay_exit_switch_x: sn,
    replay_exit_switch_y: on,
    replay_floor_guard_deg: wn,
    replay_floor_guard_x: fn,
    replay_floor_guard_y: gn,
    replay_floor_guards_len: hn,
    replay_from_attract: mo,
    replay_launch_pad_deg: pn,
    replay_launch_pad_x: dn,
    replay_launch_pad_y: un,
    replay_launch_pads_len: cn,
    replay_locked_door_anim_progress: vn,
    replay_locked_door_deg: xn,
    replay_locked_door_x: mn,
    replay_locked_door_y: bn,
    replay_locked_doors_len: yn,
    replay_locked_switch_x: $n,
    replay_locked_switch_y: kn,
    replay_mine_state: Ko,
    replay_mine_x: Io,
    replay_mine_y: Bo,
    replay_mines_len: Oo,
    replay_ninja_bones: Co,
    replay_ninja_preview_bones: No,
    replay_ninja_preview_x: Mo,
    replay_ninja_preview_y: jo,
    replay_ninja_x: Lo,
    replay_ninja_y: Ao,
    replay_one_way_deg: Ho,
    replay_one_way_x: Wo,
    replay_one_way_y: Fo,
    replay_one_ways_len: Vo,
    replay_place_ninja: So,
    replay_progress: To,
    replay_progress_preview: Po,
    replay_regular_door_anim_progress: On,
    replay_regular_door_deg: Nn,
    replay_regular_door_x: jn,
    replay_regular_door_y: Cn,
    replay_regular_doors_len: Mn,
    replay_replay_length: Do,
    replay_seek: $o,
    replay_seek_preview: ko,
    replay_send_past_ninjas: bo,
    replay_set_input: xo,
    replay_shove_thwump_deg: Rn,
    replay_shove_thwump_touch: Gn,
    replay_shove_thwump_x: Bn,
    replay_shove_thwump_y: Kn,
    replay_shove_thwumps_len: In,
    replay_thwump_deg: an,
    replay_thwump_x: _n,
    replay_thwump_y: ln,
    replay_thwumps_len: nn,
    replay_tick: vo,
    replay_tiles_path: Eo,
    replay_trap_door_anim_progress: En,
    replay_trap_door_deg: Pn,
    replay_trap_door_x: Dn,
    replay_trap_door_y: Tn,
    replay_trap_doors_len: Sn,
    replay_trap_switch_x: Ln,
    replay_trap_switch_y: An,
    set_anim_data: t_
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  $r(m_);
  Nt();
  function b_({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var x_ = v("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const v_ = [
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
  function tt(t) {
    function e() {
      const r = t.bones();
      return r ? v_.map(([s, n]) => `M ${20 * r[s]} ${20 * r[s + 13]} ${20 * r[n]} ${20 * r[n + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = x_();
      return D((s) => {
        var n = t.class, i = b_(t.ninja()), _ = e();
        return n !== s.e && y(r, "class", s.e = n), i !== s.t && y(r, "transform", s.t = i), _ !== s.a && y(r, "d", s.a = _), s;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var $_ = v("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), k_ = v("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function S_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function D_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function T_([t, e], r, s) {
    const n = t(), i = r.exit_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.exit_door_x(o),
        y: r.exit_door_y(o),
        animProgress: r.exit_anim_progress(o, s)
      };
      c && S_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Ot(t) {
    const [e] = t.exitDoors;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => h(P_, {
        exitDoor: r
      })
    });
  }
  const V = 11, B = 2.5;
  function P_(t) {
    return (() => {
      var e = $_(), r = e.firstChild, s = r.nextSibling, n = s.nextSibling, i = n.nextSibling, _ = i.nextSibling;
      return D((o) => {
        var c = D_(t.exitDoor), p = -13 + 4 * (1 - t.exitDoor().animProgress), m = 26 - 8 * (1 - t.exitDoor().animProgress), f = `M ${-13 * t.exitDoor().animProgress} 0 v ${-V} h ${-V + B} l ${-B} ${B} v ${2 * (V - B)} l ${B} ${B} h ${V - B} z`, E = `M ${13 * t.exitDoor().animProgress} 0 v ${-V} h ${V - B} l ${B} ${B} v ${2 * (V - B)} l ${-B} ${B} h ${-V + B} z`, T = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * V} v ${t.exitDoor().animProgress * V} h ${-V + B + t.exitDoor().animProgress} l ${-B} ${-B} v ${(1 - t.exitDoor().animProgress) * (-V + B)}`, S = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * V} v ${t.exitDoor().animProgress * V} h ${V - B - t.exitDoor().animProgress} l ${B} ${-B} v ${(1 - t.exitDoor().animProgress) * (-V + B)}`;
        return c !== o.e && y(e, "transform", o.e = c), p !== o.t && y(r, "x", o.t = p), m !== o.a && y(r, "width", o.a = m), f !== o.o && y(s, "d", o.o = f), E !== o.i && y(n, "d", o.i = E), T !== o.n && y(i, "d", o.n = T), S !== o.s && y(_, "d", o.s = S), o;
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
  function E_() {
    return k_();
  }
  var L_ = v('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function A_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function M_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function j_([t, e], r, s) {
    const n = t(), i = r.exit_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.exit_switch_x(o),
        y: r.exit_switch_y(o),
        animProgress: r.exit_anim_progress(o, s)
      };
      c && A_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function It(t) {
    return h(F, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => h(C_, {
        exitSwitch: e
      })
    });
  }
  const de = 2;
  function C_(t) {
    return (() => {
      var e = L_(), r = e.firstChild, s = r.nextSibling, n = s.nextSibling;
      return D((i) => {
        var _ = M_(t.exitSwitch), o = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, p = `M ${-2 * t.exitSwitch().animProgress} ${-de} h ${-de} v ${2 * de} h ${de}`, m = `M ${2 * t.exitSwitch().animProgress} ${-de} h ${de} v ${2 * de} h ${-de}`;
        return _ !== i.e && y(e, "transform", i.e = _), o !== i.t && y(r, "fill", i.t = o), c !== i.a && y(r, "stroke", i.a = c), p !== i.o && y(s, "d", i.o = p), m !== i.i && y(n, "d", i.i = m), i;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), e;
    })();
  }
  var N_ = v("<svg><use href=#one-way></svg>", false, true, false), O_ = v("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function I_(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function B_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function K_([t, e], r) {
    const s = t(), n = r.one_ways_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.one_way_x(_),
        y: r.one_way_y(_),
        deg: r.one_way_deg(_)
      };
      o && I_(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Bt(t) {
    const [e] = t.oneWays;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = N_();
        return D(() => y(s, "transform", B_(r))), s;
      })()
    });
  }
  function Kt() {
    return (() => {
      var t = O_(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var R_ = v("<svg><use></svg>", false, true, false), G_ = v("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), q_ = v("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), U_ = v("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const V_ = 0, W_ = 1;
  function F_(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function H_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Y_([t, e], r) {
    const s = t(), n = r.mines_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.mine_x(_),
        y: r.mine_y(_),
        type: r.mine_state(_)
      };
      o && F_(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Rt(t) {
    const [e] = t.mines;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = R_();
        return D((n) => {
          var i = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][r().type], _ = H_(r);
          return i !== n.e && y(s, "href", n.e = i), _ !== n.t && y(s, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), s;
      })()
    });
  }
  function Gt() {
    return [
      (() => {
        var t = G_(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, n = s.nextSibling, i = n.nextSibling;
        return i.nextSibling, t;
      })(),
      (() => {
        var t = q_();
        return t.firstChild, t;
      })(),
      (() => {
        var t = U_();
        return t.firstChild, t;
      })()
    ];
  }
  var z_ = v("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), X_ = v("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), Z_ = v("<svg><g class=regular-door></svg>", false, true, false);
  function J_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Q_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ei([t, e], r, s) {
    const n = t(), i = r.regular_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.regular_door_x(o),
        y: r.regular_door_y(o),
        deg: r.regular_door_deg(o),
        animProgress: r.regular_door_anim_progress(o, s)
      };
      c && J_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function qt(t) {
    const [e] = t.regularDoors;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => h(si, {
        regularDoor: r
      })
    });
  }
  const ti = 1, ri = 12 - ti;
  function si(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (ri - 0) * r;
    }
    return (() => {
      var r = Z_();
      return x(r, h(U, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var s = z_();
              return D(() => y(s, "x2", -e())), s;
            })(),
            (() => {
              var s = X_();
              return D(() => y(s, "x2", e())), s;
            })()
          ];
        }
      })), D(() => y(r, "transform", Q_(t.regularDoor))), r;
    })();
  }
  var oi = v("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), ni = v("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), ut = v("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), _i = v("<svg><g class=locked-door></svg>", false, true, false);
  function ii(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function li(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ai([t, e], r, s) {
    const n = t(), i = r.locked_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.locked_door_x(o),
        y: r.locked_door_y(o),
        deg: r.locked_door_deg(o),
        animProgress: r.locked_door_anim_progress(o, s)
      };
      c && ii(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Ut(t) {
    const [e] = t.lockedDoors;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => h(ui, {
        lockedDoor: r
      })
    });
  }
  const ci = 1, di = 12 - ci;
  function ui(t) {
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
      return n = Math.min(Math.max((n - 0.4) / 0.6, 0), 1), 0 + (di - 0) * n;
    }
    return (() => {
      var n = _i();
      return x(n, h(U, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var i = oi();
              return D(() => y(i, "x2", -s())), i;
            })(),
            (() => {
              var i = ni();
              return D(() => y(i, "x2", s())), i;
            })()
          ];
        }
      }), null), x(n, h(U, {
        get when() {
          return t.lockedDoor().animProgress < 0.5;
        },
        get children() {
          return [
            (() => {
              var i = ut();
              return D((_) => {
                var o = e(), c = r();
                return o !== _.e && y(i, "x1", _.e = o), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = ut();
              return D((_) => {
                var o = -e(), c = -r();
                return o !== _.e && y(i, "x1", _.e = o), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      }), null), D(() => y(n, "transform", li(t.lockedDoor))), n;
    })();
  }
  var pi = v("<svg><use></svg>", false, true, false), hi = v("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), fi = v("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function gi(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function wi(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function yi([t, e], r) {
    const s = t(), n = r.locked_doors_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.locked_switch_x(_),
        y: r.locked_switch_y(_),
        wasTouched: r.locked_door_anim_progress(_, 1) >= 0
      };
      o && gi(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Vt(t) {
    const [e] = t.lockedSwitches;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = pi();
        return D((n) => {
          var i = r().wasTouched ? "#locked-switch-touched" : "#locked-switch", _ = wi(r);
          return i !== n.e && y(s, "href", n.e = i), _ !== n.t && y(s, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), s;
      })()
    });
  }
  function Wt() {
    return [
      (() => {
        var t = hi(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = fi(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var mi = v("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), pt = v("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), bi = v("<svg><g></svg>", false, true, false);
  function xi(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function vi(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function $i([t, e], r, s) {
    const n = t(), i = r.trap_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.trap_door_x(o),
        y: r.trap_door_y(o),
        deg: r.trap_door_deg(o),
        animProgress: r.trap_door_anim_progress(o, s)
      };
      c && xi(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Ft(t) {
    const [e] = t.trapDoors;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => h(Di, {
        trapDoor: r
      })
    });
  }
  const ki = 1, Si = 12 - ki;
  function Di(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function s() {
      let n = t.trapDoor().animProgress;
      return 0 + (Si - 0) * n;
    }
    return (() => {
      var n = bi();
      return x(n, h(U, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var i = mi();
              return D((_) => {
                var o = -s(), c = s();
                return o !== _.e && y(i, "x1", _.e = o), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = pt();
              return D((_) => {
                var o = e(), c = r();
                return o !== _.e && y(i, "x1", _.e = o), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = pt();
              return D((_) => {
                var o = -e(), c = -r();
                return o !== _.e && y(i, "x1", _.e = o), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      })), D(() => y(n, "transform", vi(t.trapDoor))), n;
    })();
  }
  var Ti = v("<svg><use></svg>", false, true, false), Pi = v("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), Ei = v("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function Li(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function Ai(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Mi([t, e], r) {
    const s = t(), n = r.trap_doors_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.trap_switch_x(_),
        y: r.trap_switch_y(_),
        wasTouched: r.trap_door_anim_progress(_, 1) >= 0
      };
      o && Li(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Ht(t) {
    const [e] = t.trapSwitches;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = Ti();
        return D((n) => {
          var i = r().wasTouched ? "#trap-switch-touched" : "#trap-switch", _ = Ai(r);
          return i !== n.e && y(s, "href", n.e = i), _ !== n.t && y(s, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), s;
      })()
    });
  }
  function Yt() {
    return [
      (() => {
        var t = Pi();
        return t.firstChild, t;
      })(),
      (() => {
        var t = Ei(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var ji = v("<svg><g class=launch-pad><rect x=0 y=-7.5 width=1.5 height=15></rect><line stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function Ci(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Ni(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Oi([t, e], r) {
    const s = t(), n = r.launch_pads_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.launch_pad_x(_),
        y: r.launch_pad_y(_),
        deg: r.launch_pad_deg(_)
      };
      o && Ci(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function zt(t) {
    const [e] = t.launchPads;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => h(Ii, {
        launchPad: r
      })
    });
  }
  function Ii(t) {
    return (() => {
      var e = ji(), r = e.firstChild;
      return r.nextSibling, D(() => y(e, "transform", Ni(t.launchPad))), e;
    })();
  }
  var Bi = v('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function Ki(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Ri(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Gi([t, e], r, s) {
    const n = t(), i = r.floor_guards_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.floor_guard_x(o, s),
        y: r.floor_guard_y(o, s),
        deg: r.floor_guard_deg(o)
      };
      c && Ki(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Xt(t) {
    const [e] = t.floorGuards;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => h(qi, {
        floorGuard: r
      })
    });
  }
  function qi(t) {
    return (() => {
      var e = Bi();
      return e.firstChild, D(() => y(e, "transform", Ri(t.floorGuard))), e;
    })();
  }
  var Ui = v("<svg><use href=#bounceblock></svg>", false, true, false), Vi = v('<svg><g id=bounceblock><path id=bounceblockFill d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path id=bounceblockStroke d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function Wi(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Fi(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Hi([t, e], r, s) {
    const n = t(), i = r.bounce_blocks_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.bounce_block_x(o, s),
        y: r.bounce_block_y(o, s),
        deg: r.bounce_block_deg(o)
      };
      c && Wi(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Zt(t) {
    const [e] = t.bounceBlocks;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = Ui();
        return D(() => y(s, "transform", Fi(r))), s;
      })()
    });
  }
  function Jt() {
    return (() => {
      var t = Vi(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var Yi = v("<svg><use href=#boostpad></svg>", false, true, false), zi = v("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function Xi(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Zi(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Ji([t, e], r, s) {
    const n = t(), i = r.boost_pads_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.boost_pad_x(o),
        y: r.boost_pad_y(o),
        deg: r.boost_pad_deg(o, s),
        animProgress: r.boost_pad_anim_progress(o, s)
      };
      c && Xi(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Qt(t) {
    const [e] = t.boostPads;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = Yi();
        return D((n) => {
          var i = `color-mix(in srgb-linear, var(--boost-pad) ${r().animProgress * 100}%, var(--boost-pad-wooshing))`, _ = Zi(r);
          return i !== n.e && y(s, "stroke", n.e = i), _ !== n.t && y(s, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), s;
      })()
    });
  }
  function er() {
    return (() => {
      var t = zi(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, n = s.nextSibling;
      return n.nextSibling, t;
    })();
  }
  var Qi = v("<svg><use href=#thwump></svg>", false, true, false), el = v('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function tl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function rl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function sl([t, e], r, s) {
    const n = t(), i = r.thwumps_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.thwump_x(o, s),
        y: r.thwump_y(o, s),
        deg: r.thwump_deg(o)
      };
      c && tl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function tr(t) {
    const [e] = t.thwumps;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = Qi();
        return D(() => y(s, "transform", rl(r))), s;
      })()
    });
  }
  function rr() {
    return (() => {
      var t = el(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var ol = v("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), nl = v("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function _l(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function il(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ll([t, e], r, s) {
    const n = t(), i = r.shove_thwumps_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.shove_thwump_x(o, s),
        y: r.shove_thwump_y(o, s),
        deg: r.shove_thwump_deg(o),
        touch: r.shove_thwump_touch(o)
      };
      c && _l(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function sr(t) {
    const [e] = t.shoveThwumps;
    return h(F, {
      get each() {
        return e();
      },
      children: (r) => h(al, {
        shoveThwump: r
      })
    });
  }
  function al(t) {
    return (() => {
      var e = ol(), r = e.firstChild;
      return x(e, h(rt, {
        each: [
          0,
          2,
          4,
          6
        ],
        children: (s) => h(U, {
          get when() {
            return t.shoveThwump().touch >= 16 || s === t.shoveThwump().touch;
          },
          get children() {
            var n = nl(), i = n.firstChild, _ = i.nextSibling;
            return _.nextSibling, y(n, "transform", `rotate(${45 * s},0,0)`), n;
          }
        })
      }), r), D(() => y(e, "transform", il(t.shoveThwump))), e;
    })();
  }
  const or = pl((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function cl(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function dl(t) {
    const e = String.fromCharCode(...t);
    localStorage.setItem("animData", e);
  }
  function ul() {
    const t = localStorage.getItem("animData");
    if (t) {
      const e = Uint8Array.from(t, (r) => r.charCodeAt(0));
      Ct(e);
    }
  }
  function pl(t, e) {
    let r;
    return (...s) => {
      typeof r == "number" && clearTimeout(r), r = setTimeout(() => t(...s), e);
    };
  }
  var hl = v('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox checked disabled></label> | Object corners <select><option>square</option><option>rounded</option></select><input type=text style=float:right>');
  function fl(t) {
    return (() => {
      var e = hl(), r = e.firstChild, s = r.firstChild, n = s.nextSibling, i = r.nextSibling, _ = i.nextSibling, o = _.nextSibling, c = o.nextSibling, p = c.nextSibling, m = p.nextSibling, f = m.firstChild, E = f.nextSibling, T = m.nextSibling;
      return n.addEventListener("change", function() {
        const S = this.files;
        if (S && S.length > 0) {
          const L = new FileReader();
          L.onloadend = () => {
            L.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(L.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, L.readAsArrayBuffer(S[0]);
        }
      }), _.$$click = function() {
        const S = t.editor.export_map(), L = new Blob([
          S.buffer
        ], {
          type: "application/octet-stream"
        }), N = URL.createObjectURL(L);
        this.href = N, this.download = t.editor.get_level_name(), setTimeout(() => URL.revokeObjectURL(N), 100);
      }, m.addEventListener("change", (S) => t.setRoundCorners(S.currentTarget.value == "rounded")), T.addEventListener("change", () => or(t.editor)), T.$$input = (S) => {
        t.editor.set_level_name(S.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, D((S) => {
        var L = !t.roundCorners(), N = t.roundCorners();
        return L !== S.e && (f.selected = S.e = L), N !== S.t && (E.selected = S.t = N), S;
      }, {
        e: void 0,
        t: void 0
      }), D(() => T.value = t.levelName()), e;
    })();
  }
  He([
    "click",
    "input"
  ]);
  var gl = v('<svg><rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"width=150 height=150 style=mix-blend-mode:hard-light></svg>', false, true, false), wl = v("<svg><circle fill=none stroke=var(--entity-palette-reticle) r=16></svg>", false, true, false), yl = v('<svg><path d="M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12"fill-rule=evenodd fill="color-mix(in srgb,var(--background) 18%,white 15%)"></svg>', false, true, false), ml = v("<svg><rect fill=none stroke=var(--editor-crosshair) stroke-width=2 width=26 height=26></svg>", false, true, false), bl = v("<svg><use href=#tilemode-crosshair></svg>", false, true, false), xl = v("<svg><use href=#crosshair></svg>", false, true, false), vl = v('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none></path></g><polyline stroke=black fill=none>'), ht = v("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), ft = v("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), $l = v("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), kl = v("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), Sl = v("<svg><line class=door-switch-line></svg>", false, true, false);
  const Xe = 42, Ze = 23, gt = 0, wt = 1, Dl = 3, yt = 5, Tl = 6, mt = 7, Pl = 8, El = 0, Ll = 1, Al = 3, Ml = 5, jl = 6, Cl = 8, Nl = 10, Ol = 11, Il = 16, Bl = 17, Kl = 20, Rl = 21, Gl = 24, ql = 28, Ul = new Float64Array([
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
  ]), bt = 150;
  function xt() {
    const [t, e] = b([]), [r, s] = b([]), [n, i] = b([]), [_, o] = b([]), [c, p] = b([]), [m, f] = b([]), [E, T] = b([]), [S, L] = b([]), [N, A] = b([]), [O, C] = b([]), [k, P] = b([]), [G, q] = b([]), [re, ne] = b([]), [X, se] = b([]), [j, I] = b([]), [H, Z] = b([]);
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
      lockedDoors: m,
      setLockedDoors: f,
      lockedSwitches: E,
      setLockedSwitches: T,
      trapDoors: S,
      setTrapDoors: L,
      trapSwitches: N,
      setTrapSwitches: A,
      launchPads: O,
      setLaunchPads: C,
      oneWays: k,
      setOneWays: P,
      floorGuards: G,
      setFloorGuards: q,
      bounceBlocks: re,
      setBounceBlocks: ne,
      thwumps: X,
      setThwumps: se,
      boostPads: j,
      setBoostPads: I,
      shoveThwumps: H,
      setShoveThwumps: Z
    };
  }
  function vt(t, e, r, s) {
    const n = [], i = [], _ = [], o = [], c = [], p = [], m = [], f = [], E = [], T = [], S = [], L = [], N = [], A = [], O = [], C = [];
    for (const k of r) {
      const P = {
        x: k.x,
        y: k.y,
        deg: k.deg,
        animProgress: 0
      }, G = {
        x: k.switch_x,
        y: k.switch_y,
        animProgress: 0,
        wasTouched: false
      }, q = {
        x1: k.x,
        y1: k.y,
        x2: k.switch_x,
        y2: k.switch_y
      };
      k.type_int === El ? n.push(P) : k.type_int === Ll ? i.push({
        ...P,
        type: V_
      }) : k.type_int === Rl ? i.push({
        ...P,
        type: W_
      }) : k.type_int === Al ? (_.push(P), Number.isNaN(k.switch_x) || (o.push(G), e.push(q))) : k.type_int === Ml ? c.push(P) : k.type_int === jl ? (p.push(P), Number.isNaN(k.switch_x) || (m.push(G), e.push(q))) : k.type_int === Cl ? (f.push({
        ...P,
        animProgress: s ? 1 : -1
      }), Number.isNaN(k.switch_x) || (E.push(G), e.push(q))) : k.type_int === Nl ? T.push(P) : k.type_int === Ol ? S.push(P) : k.type_int === Il ? L.push(P) : k.type_int === Bl ? N.push(P) : k.type_int === Kl ? A.push(P) : k.type_int === Gl ? O.push({
        ...P,
        animProgress: 1
      }) : k.type_int === ql && C.push({
        ...P,
        touch: 16
      }), k.free();
    }
    t.setNinjas(n), t.setMines(i), t.setExitDoors(_), t.setExitSwitches(o), t.setRegularDoors(c), t.setLockedDoors(p), t.setLockedSwitches(m), t.setTrapDoors(f), t.setTrapSwitches(E), t.setLaunchPads(T), t.setOneWays(S), t.setFloorGuards(L), t.setBounceBlocks(N), t.setThwumps(A), t.setBoostPads(O), t.setShoveThwumps(C);
  }
  function $t({ entities: t }) {
    return [
      h(Ot, {
        get exitDoors() {
          return [
            t.exitDoors,
            () => {
            }
          ];
        }
      }),
      h(Bt, {
        get oneWays() {
          return [
            t.oneWays,
            () => {
            }
          ];
        }
      }),
      h(Rt, {
        get mines() {
          return [
            t.mines,
            () => {
            }
          ];
        }
      }),
      h(qt, {
        get regularDoors() {
          return [
            t.regularDoors,
            () => {
            }
          ];
        }
      }),
      h(Ft, {
        get trapDoors() {
          return [
            t.trapDoors,
            () => {
            }
          ];
        }
      }),
      h(Ut, {
        get lockedDoors() {
          return [
            t.lockedDoors,
            () => {
            }
          ];
        }
      }),
      h(Vt, {
        get lockedSwitches() {
          return [
            t.lockedSwitches,
            () => {
            }
          ];
        }
      }),
      h(Ht, {
        get trapSwitches() {
          return [
            t.trapSwitches,
            () => {
            }
          ];
        }
      }),
      h(It, {
        get exitSwitches() {
          return t.exitSwitches;
        }
      }),
      h(zt, {
        get launchPads() {
          return [
            t.launchPads,
            () => {
            }
          ];
        }
      }),
      h(Xt, {
        get floorGuards() {
          return [
            t.floorGuards,
            () => {
            }
          ];
        }
      }),
      h(tr, {
        get thwumps() {
          return [
            t.thwumps,
            () => {
            }
          ];
        }
      }),
      h(rt, {
        get each() {
          return t.ninjas();
        },
        children: (e) => h(tt, {
          class: "ninja",
          ninja: () => e,
          bones: () => Ul
        })
      }),
      h(Zt, {
        get bounceBlocks() {
          return [
            t.bounceBlocks,
            () => {
            }
          ];
        }
      }),
      h(sr, {
        get shoveThwumps() {
          return [
            t.shoveThwumps,
            () => {
            }
          ];
        }
      }),
      h(Qt, {
        get boostPads() {
          return [
            t.boostPads,
            () => {
            }
          ];
        }
      })
    ];
  }
  function Vl(t) {
    const { editor: e, pastNinjas: r } = t, [s, n] = b(""), [i, _] = b(""), [o, c] = b(true), [p, m] = b(false), [f, E] = b(gt), [T, S] = b({
      row: 1,
      col: 1
    }), [L, N] = b({
      x: 24,
      y: 24
    }), [A, O] = b(""), [C, k] = b({
      x: NaN,
      y: NaN
    }), [P, G] = b({
      x: NaN,
      y: NaN
    }), q = xt(), re = xt(), [ne, X] = b([]), se = (d) => {
      let w = false;
      if (!(d.target instanceof HTMLInputElement)) {
        if (d.ctrlKey || d.metaKey) {
          d.code === "KeyZ" && (d.ctrlKey || d.metaKey) && d.shiftKey ? (w = true, e.redo()) : d.code === "KeyZ" && (d.ctrlKey || d.metaKey) ? (w = true, e.undo()) : d.code === "KeyY" && (d.ctrlKey || d.metaKey) && (w = true, e.redo()), w && (I(true), d.preventDefault());
          return;
        }
        d.shiftKey && (w = true, e.press_shift()), d.code === "Backquote" ? (w = true, e.press_backtick()) : d.code === "Digit1" ? (w = true, e.press_1(d.shiftKey)) : d.code === "Digit2" ? (w = true, e.press_2(d.shiftKey)) : d.code === "Digit3" ? (w = true, e.press_3(d.shiftKey)) : d.code === "Digit4" ? (w = true, e.press_4(d.shiftKey)) : d.code === "Digit5" ? (w = true, e.press_5(d.shiftKey)) : d.code === "Digit6" ? (w = true, e.press_6(d.shiftKey)) : d.code === "Digit7" ? (w = true, e.press_7(d.shiftKey)) : d.code === "Digit8" ? (w = true, e.press_8(d.shiftKey)) : d.code === "Digit9" ? (w = true, e.press_9()) : d.code === "Digit0" ? (w = true, e.press_0()) : d.code === "Minus" ? (w = true, e.press_dash()) : d.code === "Equal" ? (w = true, e.press_equals()) : d.code === "KeyQ" ? (w = true, e.press_q(d.shiftKey)) : d.code === "KeyW" ? (w = true, e.press_w(d.shiftKey)) : d.code === "KeyA" ? (w = true, e.press_a(d.shiftKey)) : d.code === "KeyS" ? (w = true, e.press_s(d.shiftKey)) : d.code === "KeyE" ? (w = true, e.press_e()) : d.code === "KeyD" ? (w = true, e.press_d()) : d.code === "KeyZ" ? (w = true, e.press_z()) : d.code === "KeyX" ? (w = true, e.press_x()) : d.code === "KeyC" ? (w = true, e.press_c()) : d.code === "Space" ? (w = true, e.press_space()) : d.code === "AltLeft" ? (w = true, e.press_alt_left(d.shiftKey)) : d.code === "KeyT" ? (w = true, e.press_t()) : d.code === "KeyY" ? (w = true, e.press_y()) : d.code === "KeyU" ? (w = true, e.press_u()) : d.code === "KeyI" ? (w = true, e.press_i()) : d.code === "KeyO" ? (w = true, e.press_o()) : d.code === "KeyP" ? (w = true, e.press_p()) : d.code === "BracketLeft" ? (w = true, e.press_bracket_left()) : d.code === "BracketRight" ? (w = true, e.press_bracket_right()) : d.code === "KeyF" ? (w = true, e.press_f()) : d.code === "KeyH" ? (w = true, e.press_h()) : d.code === "KeyJ" ? (w = true, e.press_j()) : d.code === "KeyK" ? (w = true, e.press_k()) : d.code === "KeyL" ? (w = true, e.press_l()) : d.code === "KeyN" ? (w = true, e.press_n()) : d.code === "KeyM" ? (w = true, e.press_m()) : d.code === "Comma" ? (w = true, e.press_comma()) : d.code === "ArrowUp" ? (w = true, e.press_up(d.shiftKey)) : d.code === "ArrowDown" ? (w = true, e.press_down(d.shiftKey)) : d.code === "ArrowLeft" ? (w = true, e.press_left(d.shiftKey)) : d.code === "ArrowRight" ? (w = true, e.press_right(d.shiftKey)) : d.code === "Enter" ? (w = true, e.press_enter()) : d.code === "Escape" ? w = e.press_escape() : d.code === "Slash" && (w = true, e.press_slash()), w && (I(true), d.preventDefault());
      }
    }, j = (d) => {
      let w = false;
      d.shiftKey || (w = true, e.release_shift()), d.code === "KeyQ" ? (w = true, e.release_q()) : d.code === "KeyW" ? (w = true, e.release_w()) : d.code === "KeyA" ? (w = true, e.release_a()) : d.code === "KeyS" ? (w = true, e.release_s()) : d.code === "KeyE" ? (w = true, e.release_e()) : d.code === "KeyD" ? (w = true, e.release_d()) : d.code === "KeyZ" ? (w = true, e.release_z()) : d.code === "KeyC" ? (w = true, e.release_c()) : d.code === "Space" ? (w = true, e.release_space()) : d.code === "AltLeft" && (w = true, e.release_alt_left()), w && (I(false), d.preventDefault());
    };
    document.addEventListener("keydown", se), document.addEventListener("keyup", j), ge(() => {
      document.removeEventListener("keydown", se), document.removeEventListener("keyup", j);
    });
    function I(d) {
      E(e.mode()), n(e.tiles_path()), _(e.selected_tiles_path()), S({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), m(e.show_quarter_grid()), N({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const w = [];
      vt(q, w, e.entities(), false), vt(re, w, e.preview_entities(), true), X(w), O(e.selected_tile_outline_path()), k({
        x: e.palette_center_x(),
        y: e.palette_center_y()
      }), G({
        x: e.palette_selection_x(),
        y: e.palette_selection_y()
      }), d && or(e);
    }
    const H = [];
    for (let d = 0; d < Xe - 1; d++) H.push(48 + 24 * d);
    const Z = [];
    for (let d = 0; d < Ze - 1; d++) Z.push(48 + 24 * d);
    const te = [];
    for (let d = 0; d < Xe; d++) te.push(36 + 24 * d);
    const _e = [];
    for (let d = 0; d < Ze; d++) _e.push(36 + 24 * d);
    const Se = [];
    for (let d = 0; d < Xe * 2; d++) Se.push(30 + 12 * d);
    const De = [];
    for (let d = 0; d < Ze * 2; d++) De.push(30 + 12 * d);
    return I(false), [
      (() => {
        var d = vl(), w = d.firstChild, Me = w.firstChild, J = Me.nextSibling;
        J.nextSibling;
        var ie = w.nextSibling, le = ie.nextSibling, oe = le.nextSibling, pe = oe.nextSibling, je = pe.firstChild, ae = pe.nextSibling;
        return d.$$contextmenu = (u) => {
          e.press_escape() && (I(false), u.preventDefault());
        }, d.$$mouseup = () => {
          e.cursor_up(), I(false);
        }, d.$$dblclick = (u) => {
          e.double_click(u.shiftKey), I(false);
        }, d.$$mousedown = (u) => {
          u.buttons & 2 || (e.cursor_down(u.shiftKey), I(true));
        }, d.$$mousemove = function(u) {
          const { left: g, top: $, width: M, height: Y } = this.getBoundingClientRect(), Q = e.set_cursor_pos((u.clientX - g) / M * 1056, (u.clientY - $) / Y * 600, u.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (u.clientX - g) / M * 1056,
            y: (u.clientY - $) / Y * 600
          }), Q && I(false);
        }, x(w, h(Gt, {}), J), x(w, h(Kt, {}), J), x(w, h(Jt, {}), J), x(w, h(Wt, {}), J), x(w, h(Yt, {}), J), x(w, h(er, {}), J), x(w, h(rr, {}), J), x(d, h(U, {
          get when() {
            return p();
          },
          get children() {
            return [
              be(() => Se.map((u) => (() => {
                var g = ht();
                return y(g, "x1", u), y(g, "x2", u), g;
              })())),
              be(() => De.map((u) => (() => {
                var g = ft();
                return y(g, "y1", u), y(g, "y2", u), g;
              })()))
            ];
          }
        }), ie), x(d, h(U, {
          get when() {
            return o();
          },
          get children() {
            return [
              be(() => te.map((u) => (() => {
                var g = ht();
                return y(g, "x1", u), y(g, "x2", u), g;
              })())),
              be(() => _e.map((u) => (() => {
                var g = ft();
                return y(g, "y1", u), y(g, "y2", u), g;
              })()))
            ];
          }
        }), ie), x(d, () => H.map((u) => (() => {
          var g = $l();
          return y(g, "x1", u), y(g, "x2", u), g;
        })()), ie), x(d, () => Z.map((u) => (() => {
          var g = kl();
          return y(g, "y1", u), y(g, "y2", u), g;
        })()), ie), x(d, h($t, {
          entities: q
        }), ie), x(d, h(U, {
          get when() {
            return f() === mt;
          },
          get children() {
            var u = gl();
            return D((g) => {
              var $ = C().x - bt / 2, M = C().y - bt / 2;
              return $ !== g.e && y(u, "x", g.e = $), M !== g.t && y(u, "y", g.t = M), g;
            }, {
              e: void 0,
              t: void 0
            }), u;
          }
        }), le), x(le, h($t, {
          entities: re
        })), x(d, h(U, {
          get when() {
            return f() === mt;
          },
          get children() {
            var u = wl();
            return D((g) => {
              var $ = P().x, M = P().y;
              return $ !== g.e && y(u, "cx", g.e = $), M !== g.t && y(u, "cy", g.t = M), g;
            }, {
              e: void 0,
              t: void 0
            }), u;
          }
        }), oe), x(d, h(U, {
          get when() {
            return f() === wt;
          },
          get children() {
            var u = yl();
            return D(() => y(u, "transform", `translate(${C().x},${C().y})`)), u;
          }
        }), oe), x(d, h(U, {
          get when() {
            return f() === wt;
          },
          get children() {
            var u = ml();
            return D((g) => {
              var $ = P().x - 13, M = P().y - 13;
              return $ !== g.e && y(u, "x", g.e = $), M !== g.t && y(u, "y", g.t = M), g;
            }, {
              e: void 0,
              t: void 0
            }), u;
          }
        }), pe), x(d, h(rt, {
          get each() {
            return ne();
          },
          children: (u) => (() => {
            var g = Sl();
            return D(($) => {
              var M = u.x1, Y = u.y1, Q = u.x2, ce = u.y2;
              return M !== $.e && y(g, "x1", $.e = M), Y !== $.t && y(g, "y1", $.t = Y), Q !== $.a && y(g, "x2", $.a = Q), ce !== $.o && y(g, "y2", $.o = ce), $;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), g;
          })()
        }), pe), x(d, h(U, {
          get when() {
            return f() === gt;
          },
          get children() {
            var u = bl();
            return D((g) => {
              var $ = T().col * 24 + 12, M = T().row * 24 + 12;
              return $ !== g.e && y(u, "x", g.e = $), M !== g.t && y(u, "y", g.t = M), g;
            }, {
              e: void 0,
              t: void 0
            }), u;
          }
        }), ae), x(d, h(U, {
          get when() {
            return f() === Pl || f() === yt;
          },
          get children() {
            var u = xl();
            return D((g) => {
              var $ = L().x, M = L().y;
              return $ !== g.e && y(u, "x", g.e = $), M !== g.t && y(u, "y", g.t = M), g;
            }, {
              e: void 0,
              t: void 0
            }), u;
          }
        }), ae), D((u) => {
          var g = s(), $ = [
            Dl,
            yt,
            Tl
          ].includes(f()) ? "url(#outline)" : "", M = i(), Y = A(), Q = r().map(({ x: ce, y: Te }) => `${ce},${Te}`).join(" ");
          return g !== u.e && y(ie, "d", u.e = g), $ !== u.t && y(le, "filter", u.t = $), M !== u.a && y(oe, "d", u.a = M), Y !== u.o && y(je, "d", u.o = Y), Q !== u.i && y(ae, "points", u.i = Q), u;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        }), d;
      })(),
      h(fl, {
        editor: e,
        render: I,
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
        }
      })
    ];
  }
  He([
    "mousemove",
    "mousedown",
    "dblclick",
    "mouseup",
    "contextmenu"
  ]);
  var Wl = v("<div id=media-controls><div class=text-button><div>\u23FA</div></div><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb>");
  function Fl(t) {
    const e = () => {
      const o = t.progress(), c = t.length();
      return c === 0 || o >= c ? "100%" : `${o / c * 100}%`;
    }, r = () => {
      const o = t.progress(), c = t.previewProgress(), p = t.length();
      if (c === void 0 || p === 0) return {
        left: "0%",
        width: "0%"
      };
      const m = Math.min(o, c), f = Math.min(Math.max(o, c), p);
      return {
        left: `${m / p * 100}%`,
        width: `${(f - m) / p * 100}%`
      };
    };
    let s;
    document.addEventListener("mousemove", i), ge(() => document.removeEventListener("mousemove", i)), document.addEventListener("mouseup", _), ge(() => document.removeEventListener("mouseup", _));
    function n(o) {
      if (s) {
        const { left: c, top: p, width: m } = s.getBoundingClientRect();
        let f = (o.clientX - c) / m;
        f = Math.min(1, f), f = Math.max(0, f);
        let E = Math.abs(o.clientY - p);
        return {
          targetFrame: Math.round(f * t.length()),
          strength: Math.pow(Math.E, -5 * E / m)
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
          const { targetFrame: p, strength: m } = n(o);
          t.seek(Math.round(c + (p - c) * m)), t.previewSeek(void 0);
        } else s.matches(":hover") ? t.previewSeek(n(o).targetFrame) : t.previewSeek(void 0);
      }
    }
    function _() {
      t.setDragStart(void 0);
    }
    return (() => {
      var o = Wl(), c = o.firstChild, p = c.nextSibling, m = p.firstChild, f = p.nextSibling, E = f.firstChild, T = E.nextSibling, S = T.nextSibling, L = S.nextSibling;
      c.$$click = () => {
        t.setRecording(!t.recording());
      }, p.$$click = () => {
        t.isPlaying() ? t.setIsPlaying(false) : (t.progress() >= t.length() && !t.recording() && t.seek(0), t.setIsPlaying(true));
      }, x(m, h(gr, {
        get children() {
          return [
            h(st, {
              get when() {
                return !t.isPlaying();
              },
              children: "\u25B6"
            }),
            h(st, {
              get when() {
                return t.isPlaying();
              },
              children: "\u23F8"
            })
          ];
        }
      })), f.$$mousedown = (A) => {
        t.setDragStart(n(A).targetFrame), i(A), A.preventDefault();
      };
      var N = s;
      return typeof N == "function" ? mr(N, f) : s = f, D((A) => {
        var O = !!t.recording(), C = e(), k = r().left, P = r().width, G = e();
        return O !== A.e && c.classList.toggle("recording", A.e = O), C !== A.t && Ce(T, "width", A.t = C), k !== A.a && Ce(S, "left", A.a = k), P !== A.o && Ce(S, "width", A.o = P), G !== A.i && Ce(L, "left", A.i = G), A;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), o;
    })();
  }
  He([
    "click",
    "mousedown"
  ]);
  var Hl = v('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), Yl = v("<div>");
  function zl(t) {
    const e = t.replay, [r, s] = b(true), [n, i] = b(true), [_, o] = b(void 0), [c, p] = b(0), [m, f] = b(0), [E, T] = b(void 0), S = (u) => {
      u.code === "Enter" && (e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), n() || ae(1));
    };
    document.addEventListener("keydown", S), ge(() => {
      document.removeEventListener("keydown", S);
    });
    const L = () => e.tiles_path(), [N, A] = b({
      x: -50,
      y: -50,
      deg: 0
    }), [O, C] = b({
      x: -50,
      y: -50,
      deg: 0
    }), [k, P] = b(), [G, q] = b(), re = b([]), ne = b([]), X = b([]), se = b([]), j = b([]), I = b([]), H = b([]), Z = b([]), te = b([]), _e = b([]), Se = b([]), De = b([]), d = b([]), w = b([]), Me = b([]);
    let J = performance.now();
    const le = 1e3 / 60;
    let oe = 0, pe = 0;
    function je() {
      const u = performance.now(), g = Math.min(u - J, 250);
      J = u;
      let $ = 1;
      const M = e;
      if (n() && _() === void 0) {
        if (r() || m() < c()) {
          for (oe += g; oe >= le; ) {
            if (r()) {
              let { isJump1Pressed: Y, isJump2Pressed: Q, isRightPressed: ce, isLeftPressed: Te, isSuicidePressed: nr } = t.globalEventState;
              M.set_input(Y() || Q(), ce(), Te(), nr());
            }
            M.tick(), oe -= le;
          }
          $ = oe / le, f(M.progress());
        } else m() < c() ? (M.tick(), f(M.progress())) : i(false);
        ae($);
      }
      pe = requestAnimationFrame(je);
    }
    je(), ge(() => {
      cancelAnimationFrame(pe);
    });
    function ae(u) {
      A({
        x: e.ninja_x(u),
        y: e.ninja_y(u),
        deg: 0
      }), C({
        x: e.ninja_preview_x(u),
        y: e.ninja_preview_y(u),
        deg: 0
      }), P(e.ninja_bones(u)), E() === void 0 ? q(void 0) : q(e.ninja_preview_bones(u)), Y_(re, e), Hi(ne, e, u), K_(X, e), Ji(se, e, u), sl(j, e, u), Oi(I, e), Gi(H, e, u), ai(Z, e, u), yi(te, e), $i(_e, e, u), Mi(Se, e), ei(De, e, u), ll(d, e, u), T_(w, e, u), j_(Me, e, u), p(e.replay_length());
    }
    return [
      (() => {
        var u = Hl(), g = u.firstChild;
        g.firstChild;
        var $ = g.nextSibling;
        return u.$$mousemove = function(M) {
          const { left: Y, top: Q, width: ce, height: Te } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (M.clientX - Y) / ce * 1056,
            y: (M.clientY - Q) / Te * 600
          });
        }, x(g, h(Gt, {}), null), x(g, h(Jt, {}), null), x(g, h(Kt, {}), null), x(g, h(Wt, {}), null), x(g, h(Yt, {}), null), x(g, h(er, {}), null), x(g, h(rr, {}), null), x(g, h(E_, {}), null), x(u, h(Ot, {
          exitDoors: w
        }), $), x(u, h(Bt, {
          oneWays: X
        }), $), x(u, h(Rt, {
          mines: re
        }), $), x(u, h(qt, {
          regularDoors: De
        }), $), x(u, h(Ut, {
          lockedDoors: Z
        }), $), x(u, h(Ft, {
          trapDoors: _e
        }), $), x(u, h(Vt, {
          lockedSwitches: te
        }), $), x(u, h(Ht, {
          trapSwitches: Se
        }), $), x(u, h(It, {
          get exitSwitches() {
            return Me[0];
          }
        }), $), x(u, h(zt, {
          launchPads: I
        }), $), x(u, h(Xt, {
          floorGuards: H
        }), $), x(u, h(tr, {
          thwumps: j
        }), $), x(u, h(tt, {
          class: "ninja preview",
          ninja: O,
          bones: G
        }), $), x(u, h(tt, {
          class: "ninja",
          ninja: N,
          bones: k
        }), $), x(u, h(Zt, {
          bounceBlocks: ne
        }), $), x(u, h(sr, {
          shoveThwumps: d
        }), $), x(u, h(Qt, {
          boostPads: se
        }), $), D(() => y($, "d", L())), u;
      })(),
      (() => {
        var u = Yl();
        return x(u, h(Fl, {
          recording: r,
          setRecording: s,
          isPlaying: n,
          setIsPlaying: i,
          dragStart: _,
          setDragStart: o,
          length: c,
          progress: m,
          previewProgress: E,
          seek: (g) => {
            f(g), e.seek(g), ae(1);
          },
          previewSeek: (g) => {
            T(g), e && (g !== void 0 && _() === void 0 && e.seek_preview(g), ae(1));
          }
        })), u;
      })()
    ];
  }
  He([
    "mousemove"
  ]);
  var Xl = v("<p>Invalid file."), Zl = v("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file>");
  function Jl() {
    const t = $e.new(), [e, r] = b(), [s, n] = b(""), [i, _] = b(false), [o, c] = b([]);
    function p() {
      const j = [], I = t.past_ninjas_len();
      for (let H = 0; H < I; H++) j.push({
        x: t.past_ninja_x(H),
        y: t.past_ninja_y(H)
      });
      c(j);
    }
    const [m, f] = b(false), [E, T] = b(false), [S, L] = b(false), [N, A] = b(false), [O, C] = b(false), [k, P] = b({
      x: 36,
      y: 36
    }), G = {
      isJump1Pressed: m,
      isJump2Pressed: E,
      isRightPressed: S,
      isLeftPressed: N,
      isSuicidePressed: O,
      mouseGamePos: k,
      setMouseGamePos: P
    };
    cl(t), n(t.get_level_name()), document.addEventListener("keydown", (j) => {
      if (!(j.ctrlKey || j.metaKey)) if (j.code === "Tab") {
        const I = e();
        I ? (r(void 0), I.send_past_ninjas(), t.receive_past_ninjas(), I.free(), p()) : r(t.to_replay(i())), j.preventDefault();
      } else j.code === "KeyZ" ? f(true) : j.code === "ArrowUp" ? T(true) : j.code === "ArrowRight" ? L(true) : j.code === "ArrowLeft" ? A(true) : j.code === "KeyV" && C(true);
    }), document.addEventListener("keyup", (j) => {
      j.code === "KeyZ" ? f(false) : j.code === "ArrowUp" ? T(false) : j.code === "ArrowRight" ? L(false) : j.code === "ArrowLeft" ? A(false) : j.code === "KeyV" && C(false);
    }), document.addEventListener("blur", () => {
      f(false), T(false), L(false), A(false), C(false);
    }), ul();
    const q = 0, re = 1, ne = 2, [X, se] = b(lt() == q ? q : ne);
    return [
      h(U, {
        get when() {
          return X() != q;
        },
        get children() {
          var j = Zl(), I = j.firstChild, H = I.nextSibling;
          return H.addEventListener("change", function() {
            const Z = this.files;
            if (Z && Z.length > 0) {
              const te = new FileReader();
              te.onloadend = () => {
                if (te.result instanceof ArrayBuffer) {
                  const _e = new Uint8Array(te.result);
                  dl(_e), Ct(_e), se(lt());
                }
              }, te.readAsArrayBuffer(Z[0]);
            }
          }), x(j, h(U, {
            get when() {
              return X() == re;
            },
            get children() {
              return Xl();
            }
          }), null), j;
        }
      }),
      h(U, {
        get when() {
          return be(() => X() == q)() && !e();
        },
        get children() {
          return h(Vl, {
            editor: t,
            pastNinjas: o,
            globalEventState: G,
            levelName: s,
            setLevelName: n,
            roundCorners: i,
            setRoundCorners: _
          });
        }
      }),
      h(U, {
        get when() {
          return be(() => X() == q)() && !!e();
        },
        keyed: true,
        get children() {
          return h(zl, {
            get replay() {
              return e();
            },
            globalEventState: G
          });
        }
      })
    ];
  }
  const Ql = document.getElementById("root");
  yr(() => h(Jl, {}), Ql);
})();
