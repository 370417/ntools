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
  const fr = false, gr = (t, e) => t === e, Lt = Symbol("solid-track"), ze = {
    equals: gr
  };
  let At = Ct;
  const fe = 1, Ge = 2, jt = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var q = null;
  let Ye = null, yr = null, z = null, W = null, ae = null, He = 0;
  function ke(t, e) {
    const r = z, s = q, n = t.length === 0, i = e === void 0 ? s : e, _ = n ? jt : {
      owned: null,
      cleanups: null,
      context: i ? i.context : null,
      owner: i
    }, o = n ? t : () => t(() => re(() => Ae(_)));
    q = _, z = null;
    try {
      return Ce(o, true);
    } finally {
      z = r, q = s;
    }
  }
  function m(t, e) {
    e = e ? Object.assign({}, ze, e) : ze;
    const r = {
      value: t,
      observers: null,
      observerSlots: null,
      comparator: e.equals || void 0
    }, s = (n) => (typeof n == "function" && (n = n(r.value)), Nt(r, n));
    return [
      Mt.bind(r),
      s
    ];
  }
  function T(t, e, r) {
    const s = _t(t, e, false, fe);
    Ne(s);
  }
  function wr(t, e, r) {
    At = vr;
    const s = _t(t, e, false, fe);
    s.user = true, ae ? ae.push(s) : Ne(s);
  }
  function ee(t, e, r) {
    r = r ? Object.assign({}, ze, r) : ze;
    const s = _t(t, e, true, 0);
    return s.observers = null, s.observerSlots = null, s.comparator = r.equals || void 0, Ne(s), Mt.bind(s);
  }
  function re(t) {
    if (z === null) return t();
    const e = z;
    z = null;
    try {
      return t();
    } finally {
      z = e;
    }
  }
  function me(t) {
    return q === null || (q.cleanups === null ? q.cleanups = [
      t
    ] : q.cleanups.push(t)), t;
  }
  function mr(t) {
    const e = ee(t), r = ee(() => st(e()));
    return r.toArray = () => {
      const s = r();
      return Array.isArray(s) ? s : s != null ? [
        s
      ] : [];
    }, r;
  }
  function Mt() {
    if (this.sources && this.state) if (this.state === fe) Ne(this);
    else {
      const t = W;
      W = null, Ce(() => qe(this), false), W = t;
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
  function Nt(t, e, r) {
    let s = t.value;
    return (!t.comparator || !t.comparator(s, e)) && (t.value = e, t.observers && t.observers.length && Ce(() => {
      for (let n = 0; n < t.observers.length; n += 1) {
        const i = t.observers[n], _ = Ye && Ye.running;
        _ && Ye.disposed.has(i), (_ ? !i.tState : !i.state) && (i.pure ? W.push(i) : ae.push(i), i.observers && Bt(i)), _ || (i.state = fe);
      }
      if (W.length > 1e6) throw W = [], new Error();
    }, false)), e;
  }
  function Ne(t) {
    if (!t.fn) return;
    Ae(t);
    const e = He;
    br(t, t.value, e);
  }
  function br(t, e, r) {
    let s;
    const n = q, i = z;
    z = q = t;
    try {
      s = t.fn(e);
    } catch (_) {
      return t.pure && (t.state = fe, t.owned && t.owned.forEach(Ae), t.owned = null), t.updatedAt = r + 1, Ot(_);
    } finally {
      z = i, q = n;
    }
    (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? Nt(t, s) : t.value = s, t.updatedAt = r);
  }
  function _t(t, e, r, s = fe, n) {
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
    return q === null || q !== jt && (q.owned ? q.owned.push(i) : q.owned = [
      i
    ]), i;
  }
  function Ue(t) {
    if (t.state === 0) return;
    if (t.state === Ge) return qe(t);
    if (t.suspense && re(t.suspense.inFallback)) return t.suspense.effects.push(t);
    const e = [
      t
    ];
    for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < He); ) t.state && e.push(t);
    for (let r = e.length - 1; r >= 0; r--) if (t = e[r], t.state === fe) Ne(t);
    else if (t.state === Ge) {
      const s = W;
      W = null, Ce(() => qe(t, e[0]), false), W = s;
    }
  }
  function Ce(t, e) {
    if (W) return t();
    let r = false;
    e || (W = []), ae ? r = true : ae = [], He++;
    try {
      const s = t();
      return xr(r), s;
    } catch (s) {
      r || (ae = null), W = null, Ot(s);
    }
  }
  function xr(t) {
    if (W && (Ct(W), W = null), t) return;
    const e = ae;
    ae = null, e.length && Ce(() => At(e), false);
  }
  function Ct(t) {
    for (let e = 0; e < t.length; e++) Ue(t[e]);
  }
  function vr(t) {
    let e, r = 0;
    for (e = 0; e < t.length; e++) {
      const s = t[e];
      s.user ? t[r++] = s : Ue(s);
    }
    for (e = 0; e < r; e++) Ue(t[e]);
  }
  function qe(t, e) {
    t.state = 0;
    for (let r = 0; r < t.sources.length; r += 1) {
      const s = t.sources[r];
      if (s.sources) {
        const n = s.state;
        n === fe ? s !== e && (!s.updatedAt || s.updatedAt < He) && Ue(s) : n === Ge && qe(s, e);
      }
    }
  }
  function Bt(t) {
    for (let e = 0; e < t.observers.length; e += 1) {
      const r = t.observers[e];
      r.state || (r.state = Ge, r.pure ? W.push(r) : ae.push(r), r.observers && Bt(r));
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
  function kr(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function Ot(t, e = q) {
    throw kr(t);
  }
  function st(t) {
    if (typeof t == "function" && !t.length) return st(t());
    if (Array.isArray(t)) {
      const e = [];
      for (let r = 0; r < t.length; r++) {
        const s = st(t[r]);
        Array.isArray(s) ? e.push.apply(e, s) : e.push(s);
      }
      return e;
    }
    return t;
  }
  const ot = Symbol("fallback");
  function Fe(t) {
    for (let e = 0; e < t.length; e++) t[e]();
  }
  function $r(t, e, r = {}) {
    let s = [], n = [], i = [], _ = 0, o = e.length > 1 ? [] : null;
    return me(() => Fe(i)), () => {
      let c = t() || [], p = c.length, b, f;
      return c[Lt], re(() => {
        let P, N, C, A, I, $, S, M, D;
        if (p === 0) _ !== 0 && (Fe(i), i = [], s = [], n = [], _ = 0, o && (o = [])), r.fallback && (s = [
          ot
        ], n[0] = ke((O) => (i[0] = O, r.fallback())), _ = 1);
        else if (_ === 0) {
          for (n = new Array(p), f = 0; f < p; f++) s[f] = c[f], n[f] = ke(E);
          _ = p;
        } else {
          for (C = new Array(p), A = new Array(p), o && (I = new Array(p)), $ = 0, S = Math.min(_, p); $ < S && s[$] === c[$]; $++) ;
          for (S = _ - 1, M = p - 1; S >= $ && M >= $ && s[S] === c[M]; S--, M--) C[M] = n[S], A[M] = i[S], o && (I[M] = o[S]);
          for (P = /* @__PURE__ */ new Map(), N = new Array(M + 1), f = M; f >= $; f--) D = c[f], b = P.get(D), N[f] = b === void 0 ? -1 : b, P.set(D, f);
          for (b = $; b <= S; b++) D = s[b], f = P.get(D), f !== void 0 && f !== -1 ? (C[f] = n[b], A[f] = i[b], o && (I[f] = o[b]), f = N[f], P.set(D, f)) : i[b]();
          for (f = $; f < p; f++) f in C ? (n[f] = C[f], i[f] = A[f], o && (o[f] = I[f], o[f](f))) : n[f] = ke(E);
          n = n.slice(0, _ = p), s = c.slice(0);
        }
        return n;
      });
      function E(P) {
        if (i[f] = P, o) {
          const [N, C] = m(f);
          return o[f] = C, e(c[f], N);
        }
        return e(c[f]);
      }
    };
  }
  function Sr(t, e, r = {}) {
    let s = [], n = [], i = [], _ = [], o = 0, c;
    return me(() => Fe(i)), () => {
      const p = t() || [], b = p.length;
      return p[Lt], re(() => {
        if (b === 0) return o !== 0 && (Fe(i), i = [], s = [], n = [], o = 0, _ = []), r.fallback && (s = [
          ot
        ], n[0] = ke((E) => (i[0] = E, r.fallback())), o = 1), n;
        for (s[0] === ot && (i[0](), i = [], s = [], n = [], o = 0), c = 0; c < b; c++) c < s.length && s[c] !== p[c] ? _[c](() => p[c]) : c >= s.length && (n[c] = ke(f));
        for (; c < s.length; c++) i[c]();
        return o = _.length = i.length = b, s = p.slice(0), n = n.slice(0, o);
      });
      function f(E) {
        i[c] = E;
        const [P, N] = m(p[c]);
        return _[c] = N, e(P, c);
      }
    };
  }
  function u(t, e) {
    return re(() => t(e || {}));
  }
  const It = (t) => `Stale read from <${t}>.`;
  function lt(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return ee($r(() => t.each, t.children, e || void 0));
  }
  function H(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return ee(Sr(() => t.each, t.children, e || void 0));
  }
  function G(t) {
    const e = t.keyed, r = ee(() => t.when, void 0, void 0), s = e ? r : ee(r, void 0, {
      equals: (n, i) => !n == !i
    });
    return ee(() => {
      const n = s();
      if (n) {
        const i = t.children;
        return typeof i == "function" && i.length > 0 ? re(() => i(e ? n : () => {
          if (!re(s)) throw It("Show");
          return r();
        })) : i;
      }
      return t.fallback;
    }, void 0, void 0);
  }
  function Dr(t) {
    const e = mr(() => t.children), r = ee(() => {
      const s = e(), n = Array.isArray(s) ? s : [
        s
      ];
      let i = () => {
      };
      for (let _ = 0; _ < n.length; _++) {
        const o = _, c = n[_], p = i, b = ee(() => p() ? void 0 : c.when, void 0, void 0), f = c.keyed ? b : ee(b, void 0, {
          equals: (E, P) => !E == !P
        });
        i = () => p() || (f() ? [
          o,
          b,
          c
        ] : void 0);
      }
      return i;
    });
    return ee(() => {
      const s = r()();
      if (!s) return t.fallback;
      const [n, i, _] = s, o = _.children;
      return typeof o == "function" && o.length > 0 ? re(() => o(_.keyed ? i() : () => {
        var _a2;
        if (((_a2 = re(r)()) == null ? void 0 : _a2[0]) !== n) throw It("Match");
        return i();
      })) : o;
    }, void 0, void 0);
  }
  function at(t) {
    return t;
  }
  const ve = (t) => ee(() => t());
  function Tr(t, e, r) {
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
          let f = _, E = 1, P;
          for (; ++f < n && f < i && !((P = p.get(e[f])) == null || P !== b + E); ) E++;
          if (E > b - o) {
            const N = e[_];
            for (; o < b; ) t.insertBefore(r[o++], N);
          } else t.replaceChild(r[o++], e[_++]);
        } else _++;
        else e[_++].remove();
      }
    }
  }
  const ct = "_$DX_DELEGATE";
  function Pr(t, e, r, s = {}) {
    let n;
    return ke((i) => {
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
    }, _ = e ? () => re(() => document.importNode(n || (n = i()), true)) : () => (n || (n = i())).cloneNode(true);
    return _.cloneNode = _, _;
  }
  function Ze(t, e = window.document) {
    const r = e[ct] || (e[ct] = /* @__PURE__ */ new Set());
    for (let s = 0, n = t.length; s < n; s++) {
      const i = t[s];
      r.has(i) || (r.add(i), e.addEventListener(i, Lr));
    }
  }
  function y(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function Oe(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function Er(t, e, r) {
    return re(() => t(e, r));
  }
  function x(t, e, r, s) {
    if (r !== void 0 && !s && (s = []), typeof e != "function") return Ve(t, e, s, r);
    T((n) => Ve(t, e(), n, r), s);
  }
  function Lr(t) {
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
  function Ve(t, e, r, s, n) {
    for (; typeof r == "function"; ) r = r();
    if (e === r) return r;
    const i = typeof e, _ = s !== void 0;
    if (t = _ && r[0] && r[0].parentNode || t, i === "string" || i === "number") {
      if (i === "number" && (e = e.toString(), e === r)) return r;
      if (_) {
        let o = r[0];
        o && o.nodeType === 3 ? o.data !== e && (o.data = e) : o = document.createTextNode(e), r = be(t, r, s, o);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || i === "boolean") r = be(t, r, s);
    else {
      if (i === "function") return T(() => {
        let o = e();
        for (; typeof o == "function"; ) o = o();
        r = Ve(t, o, r, s);
      }), () => r;
      if (Array.isArray(e)) {
        const o = [], c = r && Array.isArray(r);
        if (nt(o, e, r, n)) return T(() => r = Ve(t, o, r, s, true)), () => r;
        if (o.length === 0) {
          if (r = be(t, r, s), _) return r;
        } else c ? r.length === 0 ? dt(t, o, s) : Tr(t, r, o) : (r && be(t), dt(t, o));
        r = o;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (_) return r = be(t, r, s, e);
          be(t, r, null, e);
        } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
        r = e;
      }
    }
    return r;
  }
  function nt(t, e, r, s) {
    let n = false;
    for (let i = 0, _ = e.length; i < _; i++) {
      let o = e[i], c = r && r[t.length], p;
      if (!(o == null || o === true || o === false)) if ((p = typeof o) == "object" && o.nodeType) t.push(o);
      else if (Array.isArray(o)) n = nt(t, o, c) || n;
      else if (p === "function") if (s) {
        for (; typeof o == "function"; ) o = o();
        n = nt(t, Array.isArray(o) ? o : [
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
  function be(t, e, r, s) {
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
  const Ar = "" + new URL("ntools_rs_bg-DTnQUnOG.wasm", import.meta.url).href, jr = async (t = {}, e) => {
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
  function Mr(t) {
    l = t;
  }
  let Ie = null;
  function $e() {
    return (Ie === null || Ie.byteLength === 0) && (Ie = new Uint8Array(l.memory.buffer)), Ie;
  }
  let Ke = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  Ke.decode();
  const Nr = 2146435072;
  let Xe = 0;
  function Cr(t, e) {
    return Xe += e, Xe >= Nr && (Ke = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), Ke.decode(), Xe = e), Ke.decode($e().subarray(t, t + e));
  }
  function ye(t, e) {
    return t = t >>> 0, Cr(t, e);
  }
  let we = 0;
  function Je(t, e) {
    const r = e(t.length * 1, 1) >>> 0;
    return $e().set(t, r / 1), we = t.length, r;
  }
  function Qe(t) {
    const e = l.__wbindgen_externrefs.get(t);
    return l.__externref_table_dealloc(t), e;
  }
  function Br(t, e) {
    return t = t >>> 0, $e().subarray(t / 1, t / 1 + e);
  }
  const Le = new TextEncoder();
  "encodeInto" in Le || (Le.encodeInto = function(t, e) {
    const r = Le.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function Or(t, e, r) {
    if (r === void 0) {
      const o = Le.encode(t), c = e(o.length, 1) >>> 0;
      return $e().subarray(c, c + o.length).set(o), we = o.length, c;
    }
    let s = t.length, n = e(s, 1) >>> 0;
    const i = $e();
    let _ = 0;
    for (; _ < s; _++) {
      const o = t.charCodeAt(_);
      if (o > 127) break;
      i[n + _] = o;
    }
    if (_ !== s) {
      _ !== 0 && (t = t.slice(_)), n = r(n, s, s = _ + t.length * 3, 1) >>> 0;
      const o = $e().subarray(n + _, n + s), c = Le.encodeInto(t, o);
      _ += c.written, n = r(n, s, _, 1) >>> 0;
    }
    return we = _, n;
  }
  let xe = null;
  function Ir() {
    return (xe === null || xe.buffer.detached === true || xe.buffer.detached === void 0 && xe.buffer !== l.memory.buffer) && (xe = new DataView(l.memory.buffer)), xe;
  }
  function ut(t, e) {
    t = t >>> 0;
    const r = Ir(), s = [];
    for (let n = t; n < t + 4 * e; n += 4) s.push(l.__wbindgen_externrefs.get(r.getUint32(n, true)));
    return l.__externref_drop_slice(t, e), s;
  }
  let Re = null;
  function Rr() {
    return (Re === null || Re.byteLength === 0) && (Re = new Float64Array(l.memory.buffer)), Re;
  }
  function it(t, e) {
    return t = t >>> 0, Rr().subarray(t / 8, t / 8 + e);
  }
  const pt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_editor_free(t >>> 0, 1));
  class Se {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Se.prototype);
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
    static new() {
      const e = l.editor_new();
      return Se.__wrap(e);
    }
    set_anim_data(e) {
      const r = Je(e, l.__wbindgen_malloc), s = we;
      l.editor_set_anim_data(this.__wbg_ptr, r, s);
    }
    get_anim_state() {
      return l.editor_get_anim_state(this.__wbg_ptr) >>> 0;
    }
    load_attract(e) {
      const r = Je(e, l.__wbindgen_malloc), s = we, n = l.editor_load_attract(this.__wbg_ptr, r, s);
      if (n[1]) throw Qe(n[0]);
    }
    load_map(e) {
      const r = Je(e, l.__wbindgen_malloc), s = we, n = l.editor_load_map(this.__wbg_ptr, r, s);
      if (n[1]) throw Qe(n[0]);
    }
    export_map() {
      const e = l.editor_export_map(this.__wbg_ptr);
      var r = Br(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 1, 1), r;
    }
    get_level_name() {
      let e, r;
      try {
        const s = l.editor_get_level_name(this.__wbg_ptr);
        return e = s[0], r = s[1], ye(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    set_level_name(e) {
      const r = Or(e, l.__wbindgen_malloc, l.__wbindgen_realloc), s = we;
      l.editor_set_level_name(this.__wbg_ptr, r, s);
    }
    to_replay(e) {
      const r = l.editor_to_replay(this.__wbg_ptr, e);
      if (r[2]) throw Qe(r[1]);
      return Me.__wrap(r[0]);
    }
    mode() {
      return l.editor_mode(this.__wbg_ptr) >>> 0;
    }
    tiles_path() {
      let e, r;
      try {
        const s = l.editor_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], ye(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    selected_tiles_path() {
      let e, r;
      try {
        const s = l.editor_selected_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], ye(s[0], s[1]);
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
    get_show_trail() {
      return l.editor_get_show_trail(this.__wbg_ptr) !== 0;
    }
    set_show_trail(e) {
      l.editor_set_show_trail(this.__wbg_ptr, e);
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
      var r = ut(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    preview_entities() {
      const e = l.editor_preview_entities(this.__wbg_ptr);
      var r = ut(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    selected_tile_outline_path() {
      let e, r;
      try {
        const s = l.editor_selected_tile_outline_path(this.__wbg_ptr);
        return e = s[0], r = s[1], ye(s[0], s[1]);
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
    press_r() {
      l.editor_press_r(this.__wbg_ptr);
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
      l.editor_press_h(this.__wbg_ptr);
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
    past_ninja_bones() {
      const e = l.editor_past_ninja_bones(this.__wbg_ptr);
      var r = it(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 8, 8), r;
    }
  }
  Symbol.dispose && (Se.prototype[Symbol.dispose] = Se.prototype.free);
  const ht = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_exportedentity_free(t >>> 0, 1));
  class je {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(je.prototype);
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
  Symbol.dispose && (je.prototype[Symbol.dispose] = je.prototype.free);
  const ft = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_replay_free(t >>> 0, 1));
  class Me {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Me.prototype);
      return r.__wbg_ptr = e, ft.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, ft.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      l.__wbg_replay_free(e, 0);
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
        return e = s[0], r = s[1], ye(s[0], s[1]);
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
    zap_drones_len() {
      return l.replay_zap_drones_len(this.__wbg_ptr) >>> 0;
    }
    zap_drone_x(e, r) {
      return l.replay_zap_drone_x(this.__wbg_ptr, e, r);
    }
    zap_drone_y(e, r) {
      return l.replay_zap_drone_y(this.__wbg_ptr, e, r);
    }
    zap_drone_deg(e) {
      return l.replay_zap_drone_deg(this.__wbg_ptr, e);
    }
  }
  Symbol.dispose && (Me.prototype[Symbol.dispose] = Me.prototype.free);
  function Kr(t, e) {
    throw new Error(ye(t, e));
  }
  function zr(t) {
    return je.__wrap(t);
  }
  function Gr(t, e) {
    return ye(t, e);
  }
  function Ur() {
    const t = l.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const a = await jr({
    "./ntools_rs_bg.js": {
      __wbg_exportedentity_new: zr,
      __wbg___wbindgen_throw_b855445ff6a94295: Kr,
      __wbindgen_init_externref_table: Ur,
      __wbindgen_cast_2241b6af4c4b2941: Gr
    }
  }, Ar), qr = a.memory, Fr = a.__wbg_editor_free, Vr = a.editor_new, Wr = a.editor_set_anim_data, Hr = a.editor_get_anim_state, Zr = a.editor_load_attract, Yr = a.editor_load_map, Xr = a.editor_export_map, Jr = a.editor_get_level_name, Qr = a.editor_set_level_name, es = a.editor_to_replay, ts = a.editor_mode, rs = a.editor_tiles_path, ss = a.editor_selected_tiles_path, os = a.editor_palette_center_x, ns = a.editor_palette_center_y, is = a.editor_palette_selection_x, _s = a.editor_palette_selection_y, ls = a.editor_get_show_trail, as = a.editor_set_show_trail, cs = a.editor_set_cursor_pos, ds = a.editor_cursor_down, us = a.editor_cursor_up, ps = a.editor_double_click, hs = a.editor_tile_crosshair_col, fs = a.editor_tile_crosshair_row, gs = a.editor_crosshair_x, ys = a.editor_crosshair_y, ws = a.editor_entities, ms = a.editor_preview_entities, bs = a.editor_selected_tile_outline_path, xs = a.editor_show_half_grid, vs = a.editor_show_quarter_grid, ks = a.editor_undo, $s = a.editor_redo, Ss = a.editor_press_escape, Ds = a.editor_press_backtick, Ts = a.editor_press_1, Ps = a.editor_press_2, Es = a.editor_press_3, Ls = a.editor_press_4, As = a.editor_press_5, js = a.editor_press_6, Ms = a.editor_press_7, Ns = a.editor_press_8, Cs = a.editor_press_9, Bs = a.editor_press_0, Os = a.editor_press_dash, Is = a.editor_press_equals, Rs = a.editor_press_q, Ks = a.editor_press_w, zs = a.editor_press_a, Gs = a.editor_press_s, Us = a.editor_press_e, qs = a.editor_press_d, Fs = a.editor_press_z, Vs = a.editor_press_x, Ws = a.editor_press_c, Hs = a.editor_press_r, Zs = a.editor_press_t, Ys = a.editor_press_i, Xs = a.editor_press_o, Js = a.editor_press_p, Qs = a.editor_press_bracket_left, eo = a.editor_press_bracket_right, to = a.editor_press_f, ro = a.editor_press_h, so = a.editor_press_n, oo = a.editor_press_m, no = a.editor_press_comma, io = a.editor_press_slash, _o = a.editor_press_num_0, lo = a.editor_press_num_3, ao = a.editor_press_num_7, co = a.editor_press_up, uo = a.editor_press_down, po = a.editor_press_left, ho = a.editor_press_right, fo = a.editor_press_enter, go = a.editor_press_space, yo = a.editor_press_alt_left, wo = a.editor_press_shift, mo = a.editor_release_q, bo = a.editor_release_w, xo = a.editor_release_a, vo = a.editor_release_s, ko = a.editor_release_e, $o = a.editor_release_d, So = a.editor_release_z, Do = a.editor_release_c, To = a.editor_release_space, Po = a.editor_release_alt_left, Eo = a.editor_release_shift, Lo = a.editor_receive_past_ninjas, Ao = a.editor_past_ninjas_len, jo = a.editor_past_ninja_x, Mo = a.editor_past_ninja_y, No = a.editor_past_ninja_bones, Co = a.__wbg_replay_free, Bo = a.replay_send_past_ninjas, Oo = a.replay_set_input, Io = a.replay_tick, Ro = a.replay_seek, Ko = a.replay_seek_preview, zo = a.replay_place_ninja, Go = a.replay_replay_length, Uo = a.replay_progress, qo = a.replay_progress_preview, Fo = a.replay_tiles_path, Vo = a.replay_ninja_x, Wo = a.replay_ninja_y, Ho = a.replay_ninja_preview_x, Zo = a.replay_ninja_preview_y, Yo = a.replay_ninja_bones, Xo = a.replay_ninja_preview_bones, Jo = a.replay_mines_len, Qo = a.replay_mine_x, en = a.replay_mine_y, tn = a.replay_mine_state, rn = a.replay_bounce_blocks_len, sn = a.replay_bounce_block_x, on = a.replay_bounce_block_y, nn = a.replay_bounce_block_deg, _n = a.replay_one_ways_len, ln = a.replay_one_way_x, an = a.replay_one_way_y, cn = a.replay_one_way_deg, dn = a.replay_boost_pads_len, un = a.replay_boost_pad_x, pn = a.replay_boost_pad_y, hn = a.replay_boost_pad_deg, fn = a.replay_boost_pad_anim_progress, gn = a.replay_exit_doors_len, yn = a.replay_exit_door_x, wn = a.replay_exit_door_y, mn = a.replay_exit_anim_progress, bn = a.replay_exit_switch_x, xn = a.replay_exit_switch_y, vn = a.replay_thwumps_len, kn = a.replay_thwump_x, $n = a.replay_thwump_y, Sn = a.replay_thwump_deg, Dn = a.replay_launch_pads_len, Tn = a.replay_launch_pad_x, Pn = a.replay_launch_pad_y, En = a.replay_launch_pad_deg, Ln = a.replay_floor_guards_len, An = a.replay_floor_guard_x, jn = a.replay_floor_guard_y, Mn = a.replay_floor_guard_deg, Nn = a.replay_locked_doors_len, Cn = a.replay_locked_door_x, Bn = a.replay_locked_door_y, On = a.replay_locked_door_deg, In = a.replay_locked_door_anim_progress, Rn = a.replay_locked_switch_x, Kn = a.replay_locked_switch_y, zn = a.replay_trap_doors_len, Gn = a.replay_trap_door_x, Un = a.replay_trap_door_y, qn = a.replay_trap_door_deg, Fn = a.replay_trap_door_anim_progress, Vn = a.replay_trap_switch_x, Wn = a.replay_trap_switch_y, Hn = a.replay_regular_doors_len, Zn = a.replay_regular_door_x, Yn = a.replay_regular_door_y, Xn = a.replay_regular_door_deg, Jn = a.replay_regular_door_anim_progress, Qn = a.replay_shove_thwumps_len, ei = a.replay_shove_thwump_x, ti = a.replay_shove_thwump_y, ri = a.replay_shove_thwump_deg, si = a.replay_shove_thwump_touch, oi = a.replay_zap_drones_len, ni = a.replay_zap_drone_x, ii = a.replay_zap_drone_y, _i = a.replay_zap_drone_deg, li = a.__wbg_exportedentity_free, ai = a.__wbg_get_exportedentity_type_int, ci = a.__wbg_set_exportedentity_type_int, di = a.__wbg_get_exportedentity_x, ui = a.__wbg_set_exportedentity_x, pi = a.__wbg_get_exportedentity_y, hi = a.__wbg_set_exportedentity_y, fi = a.__wbg_get_exportedentity_deg, gi = a.__wbg_set_exportedentity_deg, yi = a.__wbg_get_exportedentity_switch_x, wi = a.__wbg_set_exportedentity_switch_x, mi = a.__wbg_get_exportedentity_switch_y, bi = a.__wbg_set_exportedentity_switch_y, xi = a.editor_press_y, vi = a.editor_press_u, ki = a.editor_press_j, $i = a.editor_press_k, Si = a.editor_press_l, Di = a.editor_press_num_1, Ti = a.editor_press_num_2, Pi = a.editor_press_num_4, Ei = a.editor_press_num_5, Li = a.__wbindgen_externrefs, Ai = a.__wbindgen_malloc, ji = a.__externref_table_dealloc, Mi = a.__wbindgen_free, Ni = a.__wbindgen_realloc, Ci = a.__externref_drop_slice, Rt = a.__wbindgen_start, Bi = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: Ci,
    __externref_table_dealloc: ji,
    __wbg_editor_free: Fr,
    __wbg_exportedentity_free: li,
    __wbg_get_exportedentity_deg: fi,
    __wbg_get_exportedentity_switch_x: yi,
    __wbg_get_exportedentity_switch_y: mi,
    __wbg_get_exportedentity_type_int: ai,
    __wbg_get_exportedentity_x: di,
    __wbg_get_exportedentity_y: pi,
    __wbg_replay_free: Co,
    __wbg_set_exportedentity_deg: gi,
    __wbg_set_exportedentity_switch_x: wi,
    __wbg_set_exportedentity_switch_y: bi,
    __wbg_set_exportedentity_type_int: ci,
    __wbg_set_exportedentity_x: ui,
    __wbg_set_exportedentity_y: hi,
    __wbindgen_externrefs: Li,
    __wbindgen_free: Mi,
    __wbindgen_malloc: Ai,
    __wbindgen_realloc: Ni,
    __wbindgen_start: Rt,
    editor_crosshair_x: gs,
    editor_crosshair_y: ys,
    editor_cursor_down: ds,
    editor_cursor_up: us,
    editor_double_click: ps,
    editor_entities: ws,
    editor_export_map: Xr,
    editor_get_anim_state: Hr,
    editor_get_level_name: Jr,
    editor_get_show_trail: ls,
    editor_load_attract: Zr,
    editor_load_map: Yr,
    editor_mode: ts,
    editor_new: Vr,
    editor_palette_center_x: os,
    editor_palette_center_y: ns,
    editor_palette_selection_x: is,
    editor_palette_selection_y: _s,
    editor_past_ninja_bones: No,
    editor_past_ninja_x: jo,
    editor_past_ninja_y: Mo,
    editor_past_ninjas_len: Ao,
    editor_press_0: Bs,
    editor_press_1: Ts,
    editor_press_2: Ps,
    editor_press_3: Es,
    editor_press_4: Ls,
    editor_press_5: As,
    editor_press_6: js,
    editor_press_7: Ms,
    editor_press_8: Ns,
    editor_press_9: Cs,
    editor_press_a: zs,
    editor_press_alt_left: yo,
    editor_press_backtick: Ds,
    editor_press_bracket_left: Qs,
    editor_press_bracket_right: eo,
    editor_press_c: Ws,
    editor_press_comma: no,
    editor_press_d: qs,
    editor_press_dash: Os,
    editor_press_down: uo,
    editor_press_e: Us,
    editor_press_enter: fo,
    editor_press_equals: Is,
    editor_press_escape: Ss,
    editor_press_f: to,
    editor_press_h: ro,
    editor_press_i: Ys,
    editor_press_j: ki,
    editor_press_k: $i,
    editor_press_l: Si,
    editor_press_left: po,
    editor_press_m: oo,
    editor_press_n: so,
    editor_press_num_0: _o,
    editor_press_num_1: Di,
    editor_press_num_2: Ti,
    editor_press_num_3: lo,
    editor_press_num_4: Pi,
    editor_press_num_5: Ei,
    editor_press_num_7: ao,
    editor_press_o: Xs,
    editor_press_p: Js,
    editor_press_q: Rs,
    editor_press_r: Hs,
    editor_press_right: ho,
    editor_press_s: Gs,
    editor_press_shift: wo,
    editor_press_slash: io,
    editor_press_space: go,
    editor_press_t: Zs,
    editor_press_u: vi,
    editor_press_up: co,
    editor_press_w: Ks,
    editor_press_x: Vs,
    editor_press_y: xi,
    editor_press_z: Fs,
    editor_preview_entities: ms,
    editor_receive_past_ninjas: Lo,
    editor_redo: $s,
    editor_release_a: xo,
    editor_release_alt_left: Po,
    editor_release_c: Do,
    editor_release_d: $o,
    editor_release_e: ko,
    editor_release_q: mo,
    editor_release_s: vo,
    editor_release_shift: Eo,
    editor_release_space: To,
    editor_release_w: bo,
    editor_release_z: So,
    editor_selected_tile_outline_path: bs,
    editor_selected_tiles_path: ss,
    editor_set_anim_data: Wr,
    editor_set_cursor_pos: cs,
    editor_set_level_name: Qr,
    editor_set_show_trail: as,
    editor_show_half_grid: xs,
    editor_show_quarter_grid: vs,
    editor_tile_crosshair_col: hs,
    editor_tile_crosshair_row: fs,
    editor_tiles_path: rs,
    editor_to_replay: es,
    editor_undo: ks,
    memory: qr,
    replay_boost_pad_anim_progress: fn,
    replay_boost_pad_deg: hn,
    replay_boost_pad_x: un,
    replay_boost_pad_y: pn,
    replay_boost_pads_len: dn,
    replay_bounce_block_deg: nn,
    replay_bounce_block_x: sn,
    replay_bounce_block_y: on,
    replay_bounce_blocks_len: rn,
    replay_exit_anim_progress: mn,
    replay_exit_door_x: yn,
    replay_exit_door_y: wn,
    replay_exit_doors_len: gn,
    replay_exit_switch_x: bn,
    replay_exit_switch_y: xn,
    replay_floor_guard_deg: Mn,
    replay_floor_guard_x: An,
    replay_floor_guard_y: jn,
    replay_floor_guards_len: Ln,
    replay_launch_pad_deg: En,
    replay_launch_pad_x: Tn,
    replay_launch_pad_y: Pn,
    replay_launch_pads_len: Dn,
    replay_locked_door_anim_progress: In,
    replay_locked_door_deg: On,
    replay_locked_door_x: Cn,
    replay_locked_door_y: Bn,
    replay_locked_doors_len: Nn,
    replay_locked_switch_x: Rn,
    replay_locked_switch_y: Kn,
    replay_mine_state: tn,
    replay_mine_x: Qo,
    replay_mine_y: en,
    replay_mines_len: Jo,
    replay_ninja_bones: Yo,
    replay_ninja_preview_bones: Xo,
    replay_ninja_preview_x: Ho,
    replay_ninja_preview_y: Zo,
    replay_ninja_x: Vo,
    replay_ninja_y: Wo,
    replay_one_way_deg: cn,
    replay_one_way_x: ln,
    replay_one_way_y: an,
    replay_one_ways_len: _n,
    replay_place_ninja: zo,
    replay_progress: Uo,
    replay_progress_preview: qo,
    replay_regular_door_anim_progress: Jn,
    replay_regular_door_deg: Xn,
    replay_regular_door_x: Zn,
    replay_regular_door_y: Yn,
    replay_regular_doors_len: Hn,
    replay_replay_length: Go,
    replay_seek: Ro,
    replay_seek_preview: Ko,
    replay_send_past_ninjas: Bo,
    replay_set_input: Oo,
    replay_shove_thwump_deg: ri,
    replay_shove_thwump_touch: si,
    replay_shove_thwump_x: ei,
    replay_shove_thwump_y: ti,
    replay_shove_thwumps_len: Qn,
    replay_thwump_deg: Sn,
    replay_thwump_x: kn,
    replay_thwump_y: $n,
    replay_thwumps_len: vn,
    replay_tick: Io,
    replay_tiles_path: Fo,
    replay_trap_door_anim_progress: Fn,
    replay_trap_door_deg: qn,
    replay_trap_door_x: Gn,
    replay_trap_door_y: Un,
    replay_trap_doors_len: zn,
    replay_trap_switch_x: Vn,
    replay_trap_switch_y: Wn,
    replay_zap_drone_deg: _i,
    replay_zap_drone_x: ni,
    replay_zap_drone_y: ii,
    replay_zap_drones_len: oi
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  Mr(Bi);
  Rt();
  function Oi({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var Ii = v("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const Ri = [
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
      return r ? Ri.map(([s, n]) => `M ${20 * r[s]} ${20 * r[s + 13]} ${20 * r[n]} ${20 * r[n + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = Ii();
      return T((s) => {
        var n = t.class, i = Oi(t.ninja()), _ = e();
        return n !== s.e && y(r, "class", s.e = n), i !== s.t && y(r, "transform", s.t = i), _ !== s.a && y(r, "d", s.a = _), s;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var Ki = v("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), zi = v("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function Gi(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function Ui(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function qi([t, e], r, s) {
    const n = t(), i = r.exit_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.exit_door_x(o),
        y: r.exit_door_y(o),
        animProgress: r.exit_anim_progress(o, s)
      };
      c && Gi(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Kt(t) {
    return u(H, {
      get each() {
        return t.exitDoors();
      },
      children: (e) => u(Fi, {
        exitDoor: e
      })
    });
  }
  const V = 11, K = 2.5;
  function Fi(t) {
    return (() => {
      var e = Ki(), r = e.firstChild, s = r.nextSibling, n = s.nextSibling, i = n.nextSibling, _ = i.nextSibling;
      return T((o) => {
        var c = Ui(t.exitDoor), p = -13 + 4 * (1 - t.exitDoor().animProgress), b = 26 - 8 * (1 - t.exitDoor().animProgress), f = `M ${-13 * t.exitDoor().animProgress} 0 v ${-V} h ${-V + K} l ${-K} ${K} v ${2 * (V - K)} l ${K} ${K} h ${V - K} z`, E = `M ${13 * t.exitDoor().animProgress} 0 v ${-V} h ${V - K} l ${K} ${K} v ${2 * (V - K)} l ${-K} ${K} h ${-V + K} z`, P = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * V} v ${t.exitDoor().animProgress * V} h ${-V + K + t.exitDoor().animProgress} l ${-K} ${-K} v ${(1 - t.exitDoor().animProgress) * (-V + K)}`, N = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * V} v ${t.exitDoor().animProgress * V} h ${V - K - t.exitDoor().animProgress} l ${K} ${-K} v ${(1 - t.exitDoor().animProgress) * (-V + K)}`;
        return c !== o.e && y(e, "transform", o.e = c), p !== o.t && y(r, "x", o.t = p), b !== o.a && y(r, "width", o.a = b), f !== o.o && y(s, "d", o.o = f), E !== o.i && y(n, "d", o.i = E), P !== o.n && y(i, "d", o.n = P), N !== o.s && y(_, "d", o.s = N), o;
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
  function Vi() {
    return zi();
  }
  var Wi = v('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function Hi(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function Zi(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Yi([t, e], r, s) {
    const n = t(), i = r.exit_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.exit_switch_x(o),
        y: r.exit_switch_y(o),
        animProgress: r.exit_anim_progress(o, s)
      };
      c && Hi(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function zt(t) {
    return u(H, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => u(Xi, {
        exitSwitch: e
      })
    });
  }
  const he = 2;
  function Xi(t) {
    return (() => {
      var e = Wi(), r = e.firstChild, s = r.nextSibling, n = s.nextSibling;
      return T((i) => {
        var _ = Zi(t.exitSwitch), o = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, p = `M ${-2 * t.exitSwitch().animProgress} ${-he} h ${-he} v ${2 * he} h ${he}`, b = `M ${2 * t.exitSwitch().animProgress} ${-he} h ${he} v ${2 * he} h ${-he}`;
        return _ !== i.e && y(e, "transform", i.e = _), o !== i.t && y(r, "fill", i.t = o), c !== i.a && y(r, "stroke", i.a = c), p !== i.o && y(s, "d", i.o = p), b !== i.i && y(n, "d", i.i = b), i;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), e;
    })();
  }
  var Ji = v("<svg><use href=#one-way></svg>", false, true, false), Qi = v("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function e_(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function t_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function r_([t, e], r) {
    const s = t(), n = r.one_ways_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.one_way_x(_),
        y: r.one_way_y(_),
        deg: r.one_way_deg(_)
      };
      o && e_(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Gt(t) {
    return u(H, {
      get each() {
        return t.oneWays();
      },
      children: (e) => (() => {
        var r = Ji();
        return T(() => y(r, "transform", t_(e))), r;
      })()
    });
  }
  function Ut() {
    return (() => {
      var t = Qi(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var s_ = v("<svg><use></svg>", false, true, false), o_ = v("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), n_ = v("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), i_ = v("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const __ = 0, l_ = 1;
  function a_(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function c_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function d_([t, e], r) {
    const s = t(), n = r.mines_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.mine_x(_),
        y: r.mine_y(_),
        type: r.mine_state(_)
      };
      o && a_(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function qt(t) {
    return u(H, {
      get each() {
        return t.mines();
      },
      children: (e) => (() => {
        var r = s_();
        return T((s) => {
          var n = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][e().type], i = c_(e);
          return n !== s.e && y(r, "href", s.e = n), i !== s.t && y(r, "transform", s.t = i), s;
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
        var t = o_(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, n = s.nextSibling, i = n.nextSibling;
        return i.nextSibling, t;
      })(),
      (() => {
        var t = n_();
        return t.firstChild, t;
      })(),
      (() => {
        var t = i_();
        return t.firstChild, t;
      })()
    ];
  }
  var u_ = v("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), p_ = v("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), h_ = v("<svg><g class=regular-door></svg>", false, true, false);
  function f_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function g_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function y_([t, e], r, s) {
    const n = t(), i = r.regular_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.regular_door_x(o),
        y: r.regular_door_y(o),
        deg: r.regular_door_deg(o),
        animProgress: r.regular_door_anim_progress(o, s)
      };
      c && f_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Vt(t) {
    return u(H, {
      get each() {
        return t.regularDoors();
      },
      children: (e) => u(b_, {
        regularDoor: e
      })
    });
  }
  const w_ = 1, m_ = 12 - w_;
  function b_(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (m_ - 0) * r;
    }
    return (() => {
      var r = h_();
      return x(r, u(G, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var s = u_();
              return T(() => y(s, "x2", -e())), s;
            })(),
            (() => {
              var s = p_();
              return T(() => y(s, "x2", e())), s;
            })()
          ];
        }
      })), T(() => y(r, "transform", g_(t.regularDoor))), r;
    })();
  }
  var x_ = v("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), v_ = v("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), gt = v("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), k_ = v("<svg><g class=locked-door></svg>", false, true, false);
  function $_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function S_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function D_([t, e], r, s) {
    const n = t(), i = r.locked_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.locked_door_x(o),
        y: r.locked_door_y(o),
        deg: r.locked_door_deg(o),
        animProgress: r.locked_door_anim_progress(o, s)
      };
      c && $_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Wt(t) {
    return u(H, {
      get each() {
        return t.lockedDoors();
      },
      children: (e) => u(E_, {
        lockedDoor: e
      })
    });
  }
  const T_ = 1, P_ = 12 - T_;
  function E_(t) {
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
      return n = Math.min(Math.max((n - 0.4) / 0.6, 0), 1), 0 + (P_ - 0) * n;
    }
    return (() => {
      var n = k_();
      return x(n, u(G, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var i = x_();
              return T(() => y(i, "x2", -s())), i;
            })(),
            (() => {
              var i = v_();
              return T(() => y(i, "x2", s())), i;
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
              var i = gt();
              return T((_) => {
                var o = e(), c = r();
                return o !== _.e && y(i, "x1", _.e = o), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = gt();
              return T((_) => {
                var o = -e(), c = -r();
                return o !== _.e && y(i, "x1", _.e = o), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      }), null), T(() => y(n, "transform", S_(t.lockedDoor))), n;
    })();
  }
  var L_ = v("<svg><use></svg>", false, true, false), A_ = v("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), j_ = v("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function M_(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function N_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function C_([t, e], r) {
    const s = t(), n = r.locked_doors_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.locked_switch_x(_),
        y: r.locked_switch_y(_),
        wasTouched: r.locked_door_anim_progress(_, 1) >= 0
      };
      o && M_(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Ht(t) {
    return u(H, {
      get each() {
        return t.lockedSwitches();
      },
      children: (e) => (() => {
        var r = L_();
        return T((s) => {
          var n = e().wasTouched ? "#locked-switch-touched" : "#locked-switch", i = N_(e);
          return n !== s.e && y(r, "href", s.e = n), i !== s.t && y(r, "transform", s.t = i), s;
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
        var t = A_(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = j_(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var B_ = v("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), yt = v("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), O_ = v("<svg><g></svg>", false, true, false);
  function I_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function R_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function K_([t, e], r, s) {
    const n = t(), i = r.trap_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.trap_door_x(o),
        y: r.trap_door_y(o),
        deg: r.trap_door_deg(o),
        animProgress: r.trap_door_anim_progress(o, s)
      };
      c && I_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Yt(t) {
    return u(H, {
      get each() {
        return t.trapDoors();
      },
      children: (e) => u(U_, {
        trapDoor: e
      })
    });
  }
  const z_ = 1, G_ = 12 - z_;
  function U_(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function s() {
      let n = t.trapDoor().animProgress;
      return 0 + (G_ - 0) * n;
    }
    return (() => {
      var n = O_();
      return x(n, u(G, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var i = B_();
              return T((_) => {
                var o = -s(), c = s();
                return o !== _.e && y(i, "x1", _.e = o), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = yt();
              return T((_) => {
                var o = e(), c = r();
                return o !== _.e && y(i, "x1", _.e = o), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = yt();
              return T((_) => {
                var o = -e(), c = -r();
                return o !== _.e && y(i, "x1", _.e = o), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      })), T(() => y(n, "transform", R_(t.trapDoor))), n;
    })();
  }
  var q_ = v("<svg><use></svg>", false, true, false), F_ = v("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), V_ = v("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function W_(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function H_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Z_([t, e], r) {
    const s = t(), n = r.trap_doors_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.trap_switch_x(_),
        y: r.trap_switch_y(_),
        wasTouched: r.trap_door_anim_progress(_, 1) >= 0
      };
      o && W_(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Xt(t) {
    return u(H, {
      get each() {
        return t.trapSwitches();
      },
      children: (e) => (() => {
        var r = q_();
        return T((s) => {
          var n = e().wasTouched ? "#trap-switch-touched" : "#trap-switch", i = H_(e);
          return n !== s.e && y(r, "href", s.e = n), i !== s.t && y(r, "transform", s.t = i), s;
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
        var t = F_();
        return t.firstChild, t;
      })(),
      (() => {
        var t = V_(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var Y_ = v("<svg><g><rect fill=var(--launch-pad-long) x=0 y=-7.5 width=1.5 height=15></rect><line stroke=var(--launch-pad-short) stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function X_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function J_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Q_([t, e], r) {
    const s = t(), n = r.launch_pads_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.launch_pad_x(_),
        y: r.launch_pad_y(_),
        deg: r.launch_pad_deg(_)
      };
      o && X_(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Qt(t) {
    return u(H, {
      get each() {
        return t.launchPads();
      },
      children: (e) => u(el, {
        launchPad: e
      })
    });
  }
  function el(t) {
    return (() => {
      var e = Y_(), r = e.firstChild;
      return r.nextSibling, T(() => y(e, "transform", J_(t.launchPad))), e;
    })();
  }
  var tl = v('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function rl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function sl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ol([t, e], r, s) {
    const n = t(), i = r.floor_guards_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.floor_guard_x(o, s),
        y: r.floor_guard_y(o, s),
        deg: r.floor_guard_deg(o)
      };
      c && rl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function er(t) {
    return u(H, {
      get each() {
        return t.floorGuards();
      },
      children: (e) => u(nl, {
        floorGuard: e
      })
    });
  }
  function nl(t) {
    return (() => {
      var e = tl();
      return e.firstChild, T(() => y(e, "transform", sl(t.floorGuard))), e;
    })();
  }
  var il = v("<svg><use href=#bounceblock></svg>", false, true, false), _l = v('<svg><g id=bounceblock><path fill=var(--bounceblock-interior) d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path stroke=var(--bounceblock-border) d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function ll(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function al(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function cl([t, e], r, s) {
    const n = t(), i = r.bounce_blocks_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.bounce_block_x(o, s),
        y: r.bounce_block_y(o, s),
        deg: r.bounce_block_deg(o)
      };
      c && ll(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function tr(t) {
    return u(H, {
      get each() {
        return t.bounceBlocks();
      },
      children: (e) => (() => {
        var r = il();
        return T(() => y(r, "transform", al(e))), r;
      })()
    });
  }
  function rr() {
    return (() => {
      var t = _l(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var dl = v("<svg><use href=#boostpad></svg>", false, true, false), ul = v("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function pl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function hl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function fl([t, e], r, s) {
    const n = t(), i = r.boost_pads_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.boost_pad_x(o),
        y: r.boost_pad_y(o),
        deg: r.boost_pad_deg(o, s),
        animProgress: r.boost_pad_anim_progress(o, s)
      };
      c && pl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function sr(t) {
    return u(H, {
      get each() {
        return t.boostPads();
      },
      children: (e) => (() => {
        var r = dl();
        return T((s) => {
          var n = `color-mix(in srgb-linear, var(--boost-pad) ${e().animProgress * 100}%, var(--boost-pad-wooshing))`, i = hl(e);
          return n !== s.e && y(r, "stroke", s.e = n), i !== s.t && y(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function or() {
    return (() => {
      var t = ul(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, n = s.nextSibling;
      return n.nextSibling, t;
    })();
  }
  var gl = v("<svg><use href=#thwump></svg>", false, true, false), yl = v('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function wl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function ml(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function bl([t, e], r, s) {
    const n = t(), i = r.thwumps_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.thwump_x(o, s),
        y: r.thwump_y(o, s),
        deg: r.thwump_deg(o)
      };
      c && wl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function nr(t) {
    return u(H, {
      get each() {
        return t.thwumps();
      },
      children: (e) => (() => {
        var r = gl();
        return T(() => y(r, "transform", ml(e))), r;
      })()
    });
  }
  function ir() {
    return (() => {
      var t = yl(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var xl = v("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), vl = v("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function kl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function $l(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Sl([t, e], r, s) {
    const n = t(), i = r.shove_thwumps_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.shove_thwump_x(o, s),
        y: r.shove_thwump_y(o, s),
        deg: r.shove_thwump_deg(o),
        touch: r.shove_thwump_touch(o)
      };
      c && kl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function _r(t) {
    return u(H, {
      get each() {
        return t.shoveThwumps();
      },
      children: (e) => u(Dl, {
        shoveThwump: e
      })
    });
  }
  function Dl(t) {
    return (() => {
      var e = xl(), r = e.firstChild;
      return x(e, u(lt, {
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
            var n = vl(), i = n.firstChild, _ = i.nextSibling;
            return _.nextSibling, y(n, "transform", `rotate(${45 * s},0,0)`), n;
          }
        })
      }), r), T(() => y(e, "transform", $l(t.shoveThwump))), e;
    })();
  }
  const lr = ar((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function Tl(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function Pl(t) {
    const e = String.fromCharCode(...t);
    console.log("anim data length", t.byteLength), localStorage.setItem("animData", e);
  }
  function El(t) {
    const e = localStorage.getItem("animData");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.set_anim_data(r);
    }
  }
  const Ll = ar(Al, 1e3);
  function Al(t) {
    const e = JSON.stringify(t);
    localStorage.setItem("palette", e);
  }
  function jl() {
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
  const Ml = "" + new URL("palette-CZVUb4uS.png", import.meta.url).href, cr = [
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
  }, Nl = {
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
  }, Cl = (() => {
    const t = {};
    for (const e of wt) {
      t[e] = 0;
      for (const r of wt) mt[r] < mt[e] && (t[e] += Nl[r]);
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
  ], Bl = {
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
  async function Ol() {
    const e = await (await fetch(Ml)).blob(), r = await createImageBitmap(e), s = document.createElement("canvas");
    s.width = r.width, s.height = r.height;
    const n = s.getContext("2d");
    n.drawImage(r, 0, 0), ur = n;
  }
  function Il(t) {
    const e = ur, r = cr.indexOf(t);
    if (!e || r < 0) return;
    const s = {};
    for (const n of dr) {
      const { file: i, index: _ } = Bl[n], o = Cl[i] + _, c = e.getImageData(o, r, 1, 1).data, p = `rgb(${c[0]} ${c[1]} ${c[2]})`;
      s[n] = p;
    }
    return s;
  }
  function Rl(t) {
    for (const e of dr) document.body.style.setProperty(e, t[e]);
  }
  var Kl = v('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox></label> | Object corners <select><option>square</option><option>rounded</option></select> | <select></select><input type=text style=float:right>'), zl = v("<option>");
  function Gl(t) {
    return (() => {
      var e = Kl(), r = e.firstChild, s = r.firstChild, n = s.nextSibling, i = r.nextSibling, _ = i.nextSibling, o = _.nextSibling, c = o.nextSibling, p = c.firstChild, b = p.nextSibling, f = c.nextSibling, E = f.nextSibling, P = E.firstChild, N = P.nextSibling, C = E.nextSibling, A = C.nextSibling, I = A.nextSibling;
      return n.addEventListener("change", function() {
        const $ = this.files;
        if ($ && $.length > 0) {
          const S = new FileReader();
          S.onloadend = () => {
            S.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(S.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, S.readAsArrayBuffer($[0]);
        }
      }), _.$$click = function() {
        const $ = t.editor.export_map(), S = new Blob([
          $.buffer
        ], {
          type: "application/octet-stream"
        }), M = URL.createObjectURL(S);
        this.href = M, this.download = t.editor.get_level_name().replaceAll(/[^a-z]/gi, "_"), setTimeout(() => URL.revokeObjectURL(M), 100);
      }, b.addEventListener("change", ($) => {
        t.setShowTrail($.currentTarget.checked), t.editor.set_show_trail($.currentTarget.checked);
      }), E.addEventListener("change", ($) => t.setRoundCorners($.currentTarget.value == "rounded")), A.addEventListener("change", ($) => {
        const S = Il($.currentTarget.value);
        S && t.setPalette({
          name: $.currentTarget.value,
          colors: S
        });
      }), x(A, () => cr.map(($) => (() => {
        var S = zl();
        return x(S, $), T(() => {
          var _a2;
          return S.selected = $ === (((_a2 = t.palette()) == null ? void 0 : _a2.name) ?? "vasquez");
        }), S;
      })())), I.addEventListener("change", () => lr(t.editor)), I.$$input = ($) => {
        t.editor.set_level_name($.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, T(($) => {
        var S = !t.roundCorners(), M = t.roundCorners();
        return S !== $.e && (P.selected = $.e = S), M !== $.t && (N.selected = $.t = M), $;
      }, {
        e: void 0,
        t: void 0
      }), T(() => b.checked = t.showTrail()), T(() => I.value = t.levelName()), e;
    })();
  }
  Ze([
    "click",
    "input"
  ]);
  var Ul = v("<svg><use href=#zapdrone></svg>", false, true, false), ql = v('<svg><g id=zapdrone><path fill=var(--zap-drone-background) stroke=var(--zap-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--zap-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--zap-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function Fl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Vl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Wl([t, e], r, s) {
    const n = t(), i = r.zap_drones_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), p = {
        x: r.zap_drone_x(o, s),
        y: r.zap_drone_y(o, s),
        deg: r.zap_drone_deg(o)
      };
      c && Fl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function pr(t) {
    return u(H, {
      get each() {
        return t.zapDrones();
      },
      children: (e) => (() => {
        var r = Ul();
        return T(() => y(r, "transform", Vl(e))), r;
      })()
    });
  }
  function hr() {
    return (() => {
      var t = ql(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Hl = v('<svg><rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"width=150 height=150 style=mix-blend-mode:hard-light></svg>', false, true, false), Zl = v("<svg><circle fill=none stroke=var(--entity-palette-reticle) r=16></svg>", false, true, false), Yl = v('<svg><path d="M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12"fill-rule=evenodd fill="color-mix(in srgb,var(--background) 18%,white 15%)"style=mix-blend-mode:hard-light></svg>', false, true, false), Xl = v("<svg><rect fill=none stroke=var(--editor-crosshair) stroke-width=2 width=26 height=26></svg>", false, true, false), Jl = v("<svg><use href=#tilemode-crosshair></svg>", false, true, false), Ql = v("<svg><use href=#crosshair></svg>", false, true, false), ea = v("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), ta = v('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none>'), bt = v("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), xt = v("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), ra = v("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), sa = v("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), oa = v("<svg><line class=door-switch-line></svg>", false, true, false);
  const et = 42, tt = 23, vt = 0, kt = 1, na = 3, $t = 5, ia = 6, St = 7, _a = 8, rt = 9, la = 0, aa = 1, ca = 3, da = 5, ua = 6, pa = 8, ha = 10, fa = 11, ga = 14, ya = 16, wa = 17, ma = 20, ba = 21, xa = 24, va = 28, ka = new Float64Array([
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
  ]), $a = new Float64Array([
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
  ]), Dt = 150;
  function Tt() {
    const [t, e] = m([]), [r, s] = m([]), [n, i] = m([]), [_, o] = m([]), [c, p] = m([]), [b, f] = m([]), [E, P] = m([]), [N, C] = m([]), [A, I] = m([]), [$, S] = m([]), [M, D] = m([]), [O, F] = m([]), [X, ce] = m([]), [te, se] = m([]), [ie, de] = m([]), [j, Z] = m([]), [Y, U] = m([]);
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
      lockedSwitches: E,
      setLockedSwitches: P,
      trapDoors: N,
      setTrapDoors: C,
      trapSwitches: A,
      setTrapSwitches: I,
      launchPads: $,
      setLaunchPads: S,
      oneWays: M,
      setOneWays: D,
      zapDrones: O,
      setZapDrones: F,
      floorGuards: X,
      setFloorGuards: ce,
      bounceBlocks: te,
      setBounceBlocks: se,
      thwumps: ie,
      setThwumps: de,
      boostPads: j,
      setBoostPads: Z,
      shoveThwumps: Y,
      setShoveThwumps: U
    };
  }
  function Pt(t, e, r, s) {
    const n = [], i = [], _ = [], o = [], c = [], p = [], b = [], f = [], E = [], P = [], N = [], C = [], A = [], I = [], $ = [], S = [], M = [];
    for (const D of r) {
      const O = {
        x: D.x,
        y: D.y,
        deg: D.deg,
        animProgress: 0
      }, F = {
        x: D.switch_x,
        y: D.switch_y,
        animProgress: 0,
        wasTouched: false
      }, X = {
        x1: D.x,
        y1: D.y,
        x2: D.switch_x,
        y2: D.switch_y
      };
      D.type_int === la ? n.push(O) : D.type_int === aa ? i.push({
        ...O,
        type: __
      }) : D.type_int === ba ? i.push({
        ...O,
        type: l_
      }) : D.type_int === ca ? (_.push(O), Number.isNaN(D.switch_x) || (o.push(F), e.push(X))) : D.type_int === da ? c.push(O) : D.type_int === ua ? (p.push(O), Number.isNaN(D.switch_x) || (b.push(F), e.push(X))) : D.type_int === pa ? (f.push({
        ...O,
        animProgress: s ? 1 : -1
      }), Number.isNaN(D.switch_x) || (E.push(F), e.push(X))) : D.type_int === ha ? P.push(O) : D.type_int === fa ? N.push(O) : D.type_int === ga ? C.push(O) : D.type_int === ya ? A.push(O) : D.type_int === wa ? I.push(O) : D.type_int === ma ? $.push(O) : D.type_int === xa ? S.push({
        ...O,
        animProgress: 1
      }) : D.type_int === va && M.push({
        ...O,
        touch: 16
      }), D.free();
    }
    t.setNinjas(n), t.setMines(i), t.setExitDoors(_), t.setExitSwitches(o), t.setRegularDoors(c), t.setLockedDoors(p), t.setLockedSwitches(b), t.setTrapDoors(f), t.setTrapSwitches(E), t.setLaunchPads(P), t.setOneWays(N), t.setZapDrones(C), t.setFloorGuards(A), t.setBounceBlocks(I), t.setThwumps($), t.setBoostPads(S), t.setShoveThwumps(M);
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
      u(Ht, {
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
      u(nr, {
        get thwumps() {
          return t.thwumps;
        }
      }),
      u(lt, {
        get each() {
          return t.ninjas();
        },
        children: (e) => u(We, {
          class: "ninja",
          ninja: () => e,
          bones: () => ka
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
  function Sa(t) {
    const { editor: e, pastNinjas: r } = t, [s, n] = m(""), [i, _] = m(""), [o, c] = m(true), [p, b] = m(false), [f, E] = m(vt), [P, N] = m({
      row: 1,
      col: 1
    }), [C, A] = m({
      x: 24,
      y: 24
    }), [I, $] = m(""), [S, M] = m({
      x: NaN,
      y: NaN
    }), [D, O] = m({
      x: NaN,
      y: NaN
    }), F = Tt(), X = Tt(), [ce, te] = m([]), [se, ie] = m(e.get_show_trail()), [de, j] = m(), Z = (d) => {
      let g = false;
      if (!(d.target instanceof HTMLInputElement || d.target instanceof HTMLSelectElement)) {
        if (d.ctrlKey || d.metaKey) {
          d.code === "KeyZ" && (d.ctrlKey || d.metaKey) && d.shiftKey ? (g = true, e.redo()) : d.code === "KeyZ" && (d.ctrlKey || d.metaKey) ? (g = true, e.undo()) : d.code === "KeyY" && (d.ctrlKey || d.metaKey) && (g = true, e.redo()), g && (U(true), d.preventDefault());
          return;
        }
        d.shiftKey && (g = true, e.press_shift()), d.code === "Enter" && e.mode() === rt ? t.setReplay(e.to_replay(t.roundCorners())) : d.code === "Backquote" ? (g = true, e.press_backtick()) : d.code === "Digit1" ? (g = true, e.press_1(d.shiftKey)) : d.code === "Digit2" ? (g = true, e.press_2(d.shiftKey)) : d.code === "Digit3" ? (g = true, e.press_3(d.shiftKey)) : d.code === "Digit4" ? (g = true, e.press_4(d.shiftKey)) : d.code === "Digit5" ? (g = true, e.press_5(d.shiftKey)) : d.code === "Digit6" ? (g = true, e.press_6(d.shiftKey)) : d.code === "Digit7" ? (g = true, e.press_7(d.shiftKey)) : d.code === "Digit8" ? (g = true, e.press_8(d.shiftKey)) : d.code === "Digit9" ? (g = true, e.press_9()) : d.code === "Digit0" ? (g = true, e.press_0()) : d.code === "Minus" ? (g = true, e.press_dash()) : d.code === "Equal" ? (g = true, e.press_equals()) : d.code === "KeyQ" ? (g = true, e.press_q(d.shiftKey)) : d.code === "KeyW" ? (g = true, e.press_w(d.shiftKey)) : d.code === "KeyA" ? (g = true, e.press_a(d.shiftKey)) : d.code === "KeyS" ? (g = true, e.press_s(d.shiftKey)) : d.code === "KeyE" ? (g = true, e.press_e()) : d.code === "KeyD" ? (g = true, e.press_d()) : d.code === "KeyZ" ? (g = true, e.press_z()) : d.code === "KeyX" ? (g = true, e.press_x()) : d.code === "KeyC" ? (g = true, e.press_c()) : d.code === "Space" ? (g = true, e.press_space()) : d.code === "AltLeft" ? (g = true, e.press_alt_left(d.shiftKey)) : d.code === "KeyR" ? (g = true, e.press_r()) : d.code === "KeyT" ? (g = true, e.press_t()) : d.code === "KeyY" ? (g = true, e.press_y()) : d.code === "KeyU" ? (g = true, e.press_u()) : d.code === "KeyI" ? (g = true, e.press_i()) : d.code === "KeyO" ? (g = true, e.press_o()) : d.code === "KeyP" ? (g = true, e.press_p()) : d.code === "BracketLeft" ? (g = true, e.press_bracket_left()) : d.code === "BracketRight" ? (g = true, e.press_bracket_right()) : d.code === "KeyF" ? (g = true, e.press_f()) : d.code === "KeyH" ? (g = true, e.press_h()) : d.code === "KeyJ" ? (g = true, e.press_j()) : d.code === "KeyK" ? (g = true, e.press_k()) : d.code === "KeyL" ? (g = true, e.press_l()) : d.code === "KeyN" ? (g = true, e.press_n()) : d.code === "KeyM" ? (g = true, e.press_m()) : d.code === "Comma" ? (g = true, e.press_comma()) : d.code === "ArrowUp" ? (g = true, e.press_up(d.shiftKey)) : d.code === "ArrowDown" ? (g = true, e.press_down(d.shiftKey)) : d.code === "ArrowLeft" ? (g = true, e.press_left(d.shiftKey)) : d.code === "ArrowRight" ? (g = true, e.press_right(d.shiftKey)) : d.code === "Enter" ? (g = true, e.press_enter()) : d.code === "Escape" ? g = e.press_escape() : d.code === "Slash" && (g = true, e.press_slash()), g && (U(true), d.preventDefault());
      }
    }, Y = (d) => {
      let g = false;
      d.shiftKey || (g = true, e.release_shift()), d.code === "KeyQ" ? (g = true, e.release_q()) : d.code === "KeyW" ? (g = true, e.release_w()) : d.code === "KeyA" ? (g = true, e.release_a()) : d.code === "KeyS" ? (g = true, e.release_s()) : d.code === "KeyE" ? (g = true, e.release_e()) : d.code === "KeyD" ? (g = true, e.release_d()) : d.code === "KeyZ" ? (g = true, e.release_z()) : d.code === "KeyC" ? (g = true, e.release_c()) : d.code === "Space" ? (g = true, e.release_space()) : d.code === "AltLeft" && (g = true, e.release_alt_left()), g && (U(false), d.preventDefault());
    };
    document.addEventListener("keydown", Z), document.addEventListener("keyup", Y), me(() => {
      document.removeEventListener("keydown", Z), document.removeEventListener("keyup", Y);
    });
    function U(d) {
      E(e.mode()), n(e.tiles_path()), _(e.selected_tiles_path()), N({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), b(e.show_quarter_grid()), A({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const g = [];
      Pt(F, g, e.entities(), false), Pt(X, g, e.preview_entities(), true), te(g), $(e.selected_tile_outline_path()), M({
        x: e.palette_center_x(),
        y: e.palette_center_y()
      }), O({
        x: e.palette_selection_x(),
        y: e.palette_selection_y()
      }), j(e.past_ninja_bones()), d && lr(e);
    }
    const oe = [];
    for (let d = 0; d < et - 1; d++) oe.push(48 + 24 * d);
    const ue = [];
    for (let d = 0; d < tt - 1; d++) ue.push(48 + 24 * d);
    const _e = [];
    for (let d = 0; d < et; d++) _e.push(36 + 24 * d);
    const De = [];
    for (let d = 0; d < tt; d++) De.push(36 + 24 * d);
    const Te = [];
    for (let d = 0; d < et * 2; d++) Te.push(30 + 12 * d);
    const Pe = [];
    for (let d = 0; d < tt * 2; d++) Pe.push(30 + 12 * d);
    return U(false), [
      (() => {
        var d = ta(), g = d.firstChild, Ee = g.firstChild, J = Ee.nextSibling;
        J.nextSibling;
        var ne = g.nextSibling, ge = ne.nextSibling, le = ge.nextSibling, k = le.nextSibling, R = k.firstChild;
        return d.$$contextmenu = (h) => {
          e.press_escape() && (U(false), h.preventDefault());
        }, d.$$mouseup = () => {
          e.cursor_up(), U(false);
        }, d.$$dblclick = (h) => {
          e.double_click(h.shiftKey), U(false);
        }, d.$$mousedown = (h) => {
          h.buttons & 2 || (e.mode() === rt ? t.setReplay(e.to_replay(t.roundCorners())) : (e.cursor_down(h.shiftKey), U(true)));
        }, d.$$mousemove = function(h) {
          const { left: w, top: L, width: B, height: Q } = this.getBoundingClientRect(), pe = e.set_cursor_pos((h.clientX - w) / B * 1056, (h.clientY - L) / Q * 600, h.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (h.clientX - w) / B * 1056,
            y: (h.clientY - L) / Q * 600
          }), pe && U(false);
        }, x(g, u(Ft, {}), J), x(g, u(Ut, {}), J), x(g, u(rr, {}), J), x(g, u(Zt, {}), J), x(g, u(Jt, {}), J), x(g, u(or, {}), J), x(g, u(ir, {}), J), x(g, u(hr, {}), J), x(d, u(G, {
          get when() {
            return p();
          },
          get children() {
            return [
              ve(() => Te.map((h) => (() => {
                var w = bt();
                return y(w, "x1", h), y(w, "x2", h), w;
              })())),
              ve(() => Pe.map((h) => (() => {
                var w = xt();
                return y(w, "y1", h), y(w, "y2", h), w;
              })()))
            ];
          }
        }), ne), x(d, u(G, {
          get when() {
            return o();
          },
          get children() {
            return [
              ve(() => _e.map((h) => (() => {
                var w = bt();
                return y(w, "x1", h), y(w, "x2", h), w;
              })())),
              ve(() => De.map((h) => (() => {
                var w = xt();
                return y(w, "y1", h), y(w, "y2", h), w;
              })()))
            ];
          }
        }), ne), x(d, () => oe.map((h) => (() => {
          var w = ra();
          return y(w, "x1", h), y(w, "x2", h), w;
        })()), ne), x(d, () => ue.map((h) => (() => {
          var w = sa();
          return y(w, "y1", h), y(w, "y2", h), w;
        })()), ne), x(d, u(Et, {
          entities: F
        }), ne), x(d, u(G, {
          get when() {
            return f() === St;
          },
          get children() {
            var h = Hl();
            return T((w) => {
              var L = S().x - Dt / 2, B = S().y - Dt / 2;
              return L !== w.e && y(h, "x", w.e = L), B !== w.t && y(h, "y", w.t = B), w;
            }, {
              e: void 0,
              t: void 0
            }), h;
          }
        }), ge), x(ge, u(Et, {
          entities: X
        })), x(d, u(G, {
          get when() {
            return f() === St;
          },
          get children() {
            var h = Zl();
            return T((w) => {
              var L = D().x, B = D().y;
              return L !== w.e && y(h, "cx", w.e = L), B !== w.t && y(h, "cy", w.t = B), w;
            }, {
              e: void 0,
              t: void 0
            }), h;
          }
        }), le), x(d, u(G, {
          get when() {
            return f() === kt;
          },
          get children() {
            var h = Yl();
            return T(() => y(h, "transform", `translate(${S().x},${S().y})`)), h;
          }
        }), le), x(d, u(G, {
          get when() {
            return f() === kt;
          },
          get children() {
            var h = Xl();
            return T((w) => {
              var L = D().x - 13, B = D().y - 13;
              return L !== w.e && y(h, "x", w.e = L), B !== w.t && y(h, "y", w.t = B), w;
            }, {
              e: void 0,
              t: void 0
            }), h;
          }
        }), k), x(d, u(lt, {
          get each() {
            return ce();
          },
          children: (h) => (() => {
            var w = oa();
            return T((L) => {
              var B = h.x1, Q = h.y1, pe = h.x2, Be = h.y2;
              return B !== L.e && y(w, "x1", L.e = B), Q !== L.t && y(w, "y1", L.t = Q), pe !== L.a && y(w, "x2", L.a = pe), Be !== L.o && y(w, "y2", L.o = Be), L;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), w;
          })()
        }), k), x(d, u(G, {
          get when() {
            return f() === vt;
          },
          get children() {
            var h = Jl();
            return T((w) => {
              var L = P().col * 24 + 12, B = P().row * 24 + 12;
              return L !== w.e && y(h, "x", w.e = L), B !== w.t && y(h, "y", w.t = B), w;
            }, {
              e: void 0,
              t: void 0
            }), h;
          }
        }), null), x(d, u(G, {
          get when() {
            return f() === _a || f() === $t;
          },
          get children() {
            var h = Ql();
            return T((w) => {
              var L = C().x, B = C().y;
              return L !== w.e && y(h, "x", w.e = L), B !== w.t && y(h, "y", w.t = B), w;
            }, {
              e: void 0,
              t: void 0
            }), h;
          }
        }), null), x(d, u(G, {
          get when() {
            return f() === rt;
          },
          get children() {
            return u(We, {
              class: "ninja",
              ninja: () => ({
                x: C().x,
                y: C().y,
                deg: 0
              }),
              bones: () => de() ?? $a
            });
          }
        }), null), x(d, u(G, {
          get when() {
            return se();
          },
          get children() {
            var h = ea();
            return T(() => y(h, "points", r().map(({ x: w, y: L }) => `${w},${L}`).join(" "))), h;
          }
        }), null), T((h) => {
          var w = s(), L = [
            na,
            $t,
            ia
          ].includes(f()) ? "url(#outline)" : "", B = i(), Q = I();
          return w !== h.e && y(ne, "d", h.e = w), L !== h.t && y(ge, "filter", h.t = L), B !== h.a && y(le, "d", h.a = B), Q !== h.o && y(R, "d", h.o = Q), h;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), d;
      })(),
      u(Gl, {
        editor: e,
        render: U,
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
        showTrail: se,
        setShowTrail: ie
      })
    ];
  }
  Ze([
    "mousemove",
    "mousedown",
    "dblclick",
    "mouseup",
    "contextmenu"
  ]);
  var Da = v("<div id=media-controls><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb>");
  function Ta(t) {
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
    document.addEventListener("mousemove", i), me(() => document.removeEventListener("mousemove", i)), document.addEventListener("mouseup", _), me(() => document.removeEventListener("mouseup", _));
    function n(o) {
      if (s) {
        const { left: c, top: p, width: b } = s.getBoundingClientRect();
        let f = (o.clientX - c) / b;
        f = Math.min(1, f), f = Math.max(0, f);
        let E = Math.abs(o.clientY - p);
        return {
          targetFrame: Math.round(f * t.length()),
          strength: Math.pow(Math.E, -5 * E / b)
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
      var o = Da(), c = o.firstChild, p = c.firstChild, b = c.nextSibling, f = b.firstChild, E = f.nextSibling, P = E.nextSibling, N = P.nextSibling;
      c.$$click = () => {
        t.isPlaying() ? t.setIsPlaying(false) : (t.progress() >= t.length() && t.seek(0), t.setIsPlaying(true));
      }, x(p, u(Dr, {
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
      var C = s;
      return typeof C == "function" ? Er(C, b) : s = b, T((A) => {
        var I = e(), $ = r().left, S = r().width, M = e();
        return I !== A.e && Oe(E, "width", A.e = I), $ !== A.t && Oe(P, "left", A.t = $), S !== A.a && Oe(P, "width", A.a = S), M !== A.o && Oe(N, "left", A.o = M), A;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), o;
    })();
  }
  Ze([
    "click",
    "mousedown"
  ]);
  var Pa = v('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), Ea = v("<div>");
  function La(t) {
    const e = t.replay, [r, s] = m(true), [n, i] = m(true), [_, o] = m(void 0), [c, p] = m(0), [b, f] = m(0), [E, P] = m(void 0), N = (k) => {
      k.code === "Enter" ? (e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), n() || le(1)) : k.code === "Escape" && (n() ? (i(false), s(false)) : (i(true), s(true)));
    };
    document.addEventListener("keydown", N), me(() => {
      document.removeEventListener("keydown", N);
    });
    const C = () => e.tiles_path(), [A, I] = m({
      x: -50,
      y: -50,
      deg: 0
    }), [$, S] = m({
      x: -50,
      y: -50,
      deg: 0
    }), [M, D] = m(), [O, F] = m(), X = m([]), ce = m([]), te = m([]), se = m([]), ie = m([]), de = m([]), j = m([]), Z = m([]), Y = m([]), U = m([]), oe = m([]), ue = m([]), _e = m([]), De = m([]), Te = m([]), Pe = m([]);
    let d = performance.now();
    const Ee = 1e3 / 60;
    let J = 0, ne = 0;
    function ge() {
      const k = performance.now(), R = Math.min(k - d, 250);
      d = k;
      let h = 1;
      const w = e;
      if (n() && _() === void 0) {
        if (r() || b() < c()) {
          for (J += R; J >= Ee; ) {
            if (r()) {
              let { isJump1Pressed: L, isJump2Pressed: B, isRightPressed: Q, isLeftPressed: pe, isSuicidePressed: Be } = t.globalEventState;
              w.set_input(L() || B(), Q(), pe(), Be());
            }
            w.tick(), J -= Ee;
          }
          h = J / Ee, f(w.progress());
        } else b() < c() ? (w.tick(), f(w.progress())) : i(false);
        le(h);
      }
      ne = requestAnimationFrame(ge);
    }
    ge(), me(() => {
      cancelAnimationFrame(ne);
    });
    function le(k) {
      I({
        x: e.ninja_x(k),
        y: e.ninja_y(k),
        deg: 0
      }), S({
        x: e.ninja_preview_x(k),
        y: e.ninja_preview_y(k),
        deg: 0
      }), D(e.ninja_bones(k)), E() === void 0 ? F(void 0) : F(e.ninja_preview_bones(k)), d_(X, e), cl(ce, e, k), r_(te, e), fl(se, e, k), bl(ie, e, k), Q_(de, e), ol(j, e, k), D_(Z, e, k), C_(Y, e), K_(U, e, k), Z_(oe, e), y_(ue, e, k), Sl(_e, e, k), qi(De, e, k), Yi(Te, e, k), Wl(Pe, e, k), p(e.replay_length());
    }
    return [
      (() => {
        var k = Pa(), R = k.firstChild;
        R.firstChild;
        var h = R.nextSibling;
        return k.$$mousemove = function(w) {
          const { left: L, top: B, width: Q, height: pe } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (w.clientX - L) / Q * 1056,
            y: (w.clientY - B) / pe * 600
          });
        }, x(R, u(Ft, {}), null), x(R, u(rr, {}), null), x(R, u(Ut, {}), null), x(R, u(Zt, {}), null), x(R, u(Jt, {}), null), x(R, u(or, {}), null), x(R, u(ir, {}), null), x(R, u(hr, {}), null), x(R, u(Vi, {}), null), x(k, u(Kt, {
          get exitDoors() {
            return De[0];
          }
        }), h), x(k, u(Gt, {
          get oneWays() {
            return te[0];
          }
        }), h), x(k, u(qt, {
          get mines() {
            return X[0];
          }
        }), h), x(k, u(Vt, {
          get regularDoors() {
            return ue[0];
          }
        }), h), x(k, u(Wt, {
          get lockedDoors() {
            return Z[0];
          }
        }), h), x(k, u(Yt, {
          get trapDoors() {
            return U[0];
          }
        }), h), x(k, u(Ht, {
          get lockedSwitches() {
            return Y[0];
          }
        }), h), x(k, u(Xt, {
          get trapSwitches() {
            return oe[0];
          }
        }), h), x(k, u(zt, {
          get exitSwitches() {
            return Te[0];
          }
        }), h), x(k, u(Qt, {
          get launchPads() {
            return de[0];
          }
        }), h), x(k, u(pr, {
          get zapDrones() {
            return Pe[0];
          }
        }), h), x(k, u(er, {
          get floorGuards() {
            return j[0];
          }
        }), h), x(k, u(nr, {
          get thwumps() {
            return ie[0];
          }
        }), h), x(k, u(We, {
          class: "ninja preview",
          ninja: $,
          bones: O
        }), h), x(k, u(We, {
          class: "ninja",
          ninja: A,
          bones: M
        }), h), x(k, u(tr, {
          get bounceBlocks() {
            return ce[0];
          }
        }), h), x(k, u(_r, {
          get shoveThwumps() {
            return _e[0];
          }
        }), h), x(k, u(sr, {
          get boostPads() {
            return se[0];
          }
        }), h), T(() => y(h, "d", C())), k;
      })(),
      (() => {
        var k = Ea();
        return x(k, u(G, {
          get when() {
            return !r() || !n();
          },
          get children() {
            return u(Ta, {
              isPlaying: n,
              setIsPlaying: i,
              dragStart: _,
              setDragStart: o,
              length: c,
              progress: b,
              previewProgress: E,
              seek: (R) => {
                f(R), e.seek(R), le(1);
              },
              previewSeek: (R) => {
                P(R), e && (R !== void 0 && _() === void 0 && e.seek_preview(R), le(1));
              }
            });
          }
        })), k;
      })()
    ];
  }
  Ze([
    "mousemove"
  ]);
  var Aa = v("<p>Invalid file."), ja = v("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file><dl><dt>Windows</dt><dd>C:\\Program Files (x86)\\Steam\\steamapps\\common\\N++\\anim_data_line_new.txt.bin</dd><dt>Linux</dt><dd>~/.steam/steam/steamapps/common/N++/anim_data_line_new.txt.bin</dd><dt>Mac</dt><dd>~/Library/Application Support/Steam/steamapps/common/N++/N++.app/Contents/Resources/NPP/anim_data_line_new.txt.bin");
  function Ma() {
    const t = Se.new(), [e, r] = m(), [s, n] = m(""), [i, _] = m(false), [o, c] = m([]);
    function p() {
      const j = [], Z = t.past_ninjas_len();
      for (let Y = 0; Y < Z; Y++) j.push({
        x: t.past_ninja_x(Y),
        y: t.past_ninja_y(Y)
      });
      c(j);
    }
    const [b, f] = m(false), [E, P] = m(false), [N, C] = m(false), [A, I] = m(false), [$, S] = m(false), [M, D] = m({
      x: 36,
      y: 36
    }), O = {
      isJump1Pressed: b,
      isJump2Pressed: E,
      isRightPressed: N,
      isLeftPressed: A,
      isSuicidePressed: $,
      mouseGamePos: M,
      setMouseGamePos: D
    };
    Tl(t), n(t.get_level_name()), document.addEventListener("keydown", (j) => {
      if (!(j.ctrlKey || j.metaKey)) if (j.code === "Tab") {
        const Z = e();
        Z ? (r(void 0), Z.send_past_ninjas(), t.receive_past_ninjas(), Z.free(), p()) : r(t.to_replay(i())), j.preventDefault();
      } else j.code === "KeyZ" ? f(true) : j.code === "ArrowUp" ? P(true) : j.code === "ArrowRight" ? C(true) : j.code === "ArrowLeft" ? I(true) : j.code === "KeyV" && S(true);
    }), document.addEventListener("keyup", (j) => {
      j.code === "KeyZ" ? f(false) : j.code === "ArrowUp" ? P(false) : j.code === "ArrowRight" ? C(false) : j.code === "ArrowLeft" ? I(false) : j.code === "KeyV" && S(false);
    }), document.addEventListener("blur", () => {
      f(false), P(false), C(false), I(false), S(false);
    }), El(t);
    const F = 0, X = 1, ce = 2, [te, se] = m(t.get_anim_state() == F ? F : ce);
    Ol();
    const [ie, de] = m(jl());
    return wr(() => {
      const j = ie();
      j && (Rl(j.colors), Ll(j));
    }), [
      u(G, {
        get when() {
          return te() != F;
        },
        get children() {
          var j = ja(), Z = j.firstChild, Y = Z.nextSibling;
          return Y.nextSibling, Y.addEventListener("change", function() {
            const U = this.files;
            if (U && U.length > 0) {
              const oe = new FileReader();
              oe.onloadend = () => {
                if (oe.result instanceof ArrayBuffer) {
                  const ue = new Uint8Array(oe.result);
                  try {
                    try {
                      Pl(ue);
                    } catch (_e) {
                      console.error(_e);
                    }
                    t.set_anim_data(ue), se(t.get_anim_state());
                  } catch (_e) {
                    console.error(_e), se(X);
                  }
                }
              }, oe.readAsArrayBuffer(U[0]);
            }
          }), x(j, u(G, {
            get when() {
              return te() == X;
            },
            get children() {
              return Aa();
            }
          }), null), j;
        }
      }),
      u(G, {
        get when() {
          return ve(() => te() == F)() && !e();
        },
        get children() {
          return u(Sa, {
            editor: t,
            setReplay: r,
            pastNinjas: o,
            globalEventState: O,
            levelName: s,
            setLevelName: n,
            roundCorners: i,
            setRoundCorners: _,
            palette: ie,
            setPalette: de
          });
        }
      }),
      u(G, {
        get when() {
          return ve(() => te() == F)() && !!e();
        },
        keyed: true,
        get children() {
          return u(La, {
            get replay() {
              return e();
            },
            globalEventState: O
          });
        }
      })
    ];
  }
  const Na = document.getElementById("root");
  Pr(() => u(Ma, {}), Na);
})();
