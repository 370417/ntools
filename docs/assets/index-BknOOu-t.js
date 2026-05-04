(async () => {
  (function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const o of document.querySelectorAll('link[rel="modulepreload"]')) n(o);
    new MutationObserver((o) => {
      for (const _ of o) if (_.type === "childList") for (const i of _.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && n(i);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function r(o) {
      const _ = {};
      return o.integrity && (_.integrity = o.integrity), o.referrerPolicy && (_.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? _.credentials = "include" : o.crossOrigin === "anonymous" ? _.credentials = "omit" : _.credentials = "same-origin", _;
    }
    function n(o) {
      if (o.ep) return;
      o.ep = true;
      const _ = r(o);
      fetch(o.href, _);
    }
  })();
  const Vr = false, Ur = (t, e) => t === e, qt = Symbol("solid-track"), Xe = {
    equals: Ur
  };
  let Ft = Xt;
  const $e = 1, Je = 2, Wt = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var W = null;
  let at = null, qr = null, F = null, te = null, be = null, nt = 0;
  function Me(t, e) {
    const r = F, n = W, o = t.length === 0, _ = e === void 0 ? n : e, i = o ? Wt : {
      owned: null,
      cleanups: null,
      context: _ ? _.context : null,
      owner: _
    }, s = o ? t : () => t(() => he(() => Re(i)));
    W = i, F = null;
    try {
      return ze(s, true);
    } finally {
      F = r, W = n;
    }
  }
  function y(t, e) {
    e = e ? Object.assign({}, Xe, e) : Xe;
    const r = {
      value: t,
      observers: null,
      observerSlots: null,
      comparator: e.equals || void 0
    }, n = (o) => (typeof o == "function" && (o = o(r.value)), Yt(r, o));
    return [
      Zt.bind(r),
      n
    ];
  }
  function D(t, e, r) {
    const n = bt(t, e, false, $e);
    He(n);
  }
  function Fr(t, e, r) {
    Ft = Xr;
    const n = bt(t, e, false, $e);
    n.user = true, be ? be.push(n) : He(n);
  }
  function ce(t, e, r) {
    r = r ? Object.assign({}, Xe, r) : Xe;
    const n = bt(t, e, true, 0);
    return n.observers = null, n.observerSlots = null, n.comparator = r.equals || void 0, He(n), Zt.bind(n);
  }
  function he(t) {
    if (F === null) return t();
    const e = F;
    F = null;
    try {
      return t();
    } finally {
      F = e;
    }
  }
  function Se(t) {
    return W === null || (W.cleanups === null ? W.cleanups = [
      t
    ] : W.cleanups.push(t)), t;
  }
  function Wr(t) {
    const e = ce(t), r = ce(() => yt(e()));
    return r.toArray = () => {
      const n = r();
      return Array.isArray(n) ? n : n != null ? [
        n
      ] : [];
    }, r;
  }
  function Zt() {
    if (this.sources && this.state) if (this.state === $e) He(this);
    else {
      const t = te;
      te = null, ze(() => et(this), false), te = t;
    }
    if (F) {
      const t = this.observers ? this.observers.length : 0;
      F.sources ? (F.sources.push(this), F.sourceSlots.push(t)) : (F.sources = [
        this
      ], F.sourceSlots = [
        t
      ]), this.observers ? (this.observers.push(F), this.observerSlots.push(F.sources.length - 1)) : (this.observers = [
        F
      ], this.observerSlots = [
        F.sources.length - 1
      ]);
    }
    return this.value;
  }
  function Yt(t, e, r) {
    let n = t.value;
    return (!t.comparator || !t.comparator(n, e)) && (t.value = e, t.observers && t.observers.length && ze(() => {
      for (let o = 0; o < t.observers.length; o += 1) {
        const _ = t.observers[o], i = at && at.running;
        i && at.disposed.has(_), (i ? !_.tState : !_.state) && (_.pure ? te.push(_) : be.push(_), _.observers && Jt(_)), i || (_.state = $e);
      }
      if (te.length > 1e6) throw te = [], new Error();
    }, false)), e;
  }
  function He(t) {
    if (!t.fn) return;
    Re(t);
    const e = nt;
    Zr(t, t.value, e);
  }
  function Zr(t, e, r) {
    let n;
    const o = W, _ = F;
    F = W = t;
    try {
      n = t.fn(e);
    } catch (i) {
      return t.pure && (t.state = $e, t.owned && t.owned.forEach(Re), t.owned = null), t.updatedAt = r + 1, Qt(i);
    } finally {
      F = _, W = o;
    }
    (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? Yt(t, n) : t.value = n, t.updatedAt = r);
  }
  function bt(t, e, r, n = $e, o) {
    const _ = {
      fn: t,
      state: n,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: e,
      owner: W,
      context: W ? W.context : null,
      pure: r
    };
    return W === null || W !== Wt && (W.owned ? W.owned.push(_) : W.owned = [
      _
    ]), _;
  }
  function Qe(t) {
    if (t.state === 0) return;
    if (t.state === Je) return et(t);
    if (t.suspense && he(t.suspense.inFallback)) return t.suspense.effects.push(t);
    const e = [
      t
    ];
    for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < nt); ) t.state && e.push(t);
    for (let r = e.length - 1; r >= 0; r--) if (t = e[r], t.state === $e) He(t);
    else if (t.state === Je) {
      const n = te;
      te = null, ze(() => et(t, e[0]), false), te = n;
    }
  }
  function ze(t, e) {
    if (te) return t();
    let r = false;
    e || (te = []), be ? r = true : be = [], nt++;
    try {
      const n = t();
      return Yr(r), n;
    } catch (n) {
      r || (be = null), te = null, Qt(n);
    }
  }
  function Yr(t) {
    if (te && (Xt(te), te = null), t) return;
    const e = be;
    be = null, e.length && ze(() => Ft(e), false);
  }
  function Xt(t) {
    for (let e = 0; e < t.length; e++) Qe(t[e]);
  }
  function Xr(t) {
    let e, r = 0;
    for (e = 0; e < t.length; e++) {
      const n = t[e];
      n.user ? t[r++] = n : Qe(n);
    }
    for (e = 0; e < r; e++) Qe(t[e]);
  }
  function et(t, e) {
    t.state = 0;
    for (let r = 0; r < t.sources.length; r += 1) {
      const n = t.sources[r];
      if (n.sources) {
        const o = n.state;
        o === $e ? n !== e && (!n.updatedAt || n.updatedAt < nt) && Qe(n) : o === Je && et(n, e);
      }
    }
  }
  function Jt(t) {
    for (let e = 0; e < t.observers.length; e += 1) {
      const r = t.observers[e];
      r.state || (r.state = Je, r.pure ? te.push(r) : be.push(r), r.observers && Jt(r));
    }
  }
  function Re(t) {
    let e;
    if (t.sources) for (; t.sources.length; ) {
      const r = t.sources.pop(), n = t.sourceSlots.pop(), o = r.observers;
      if (o && o.length) {
        const _ = o.pop(), i = r.observerSlots.pop();
        n < o.length && (_.sourceSlots[i] = n, o[n] = _, r.observerSlots[n] = i);
      }
    }
    if (t.tOwned) {
      for (e = t.tOwned.length - 1; e >= 0; e--) Re(t.tOwned[e]);
      delete t.tOwned;
    }
    if (t.owned) {
      for (e = t.owned.length - 1; e >= 0; e--) Re(t.owned[e]);
      t.owned = null;
    }
    if (t.cleanups) {
      for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
      t.cleanups = null;
    }
    t.state = 0;
  }
  function Jr(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function Qt(t, e = W) {
    throw Jr(t);
  }
  function yt(t) {
    if (typeof t == "function" && !t.length) return yt(t());
    if (Array.isArray(t)) {
      const e = [];
      for (let r = 0; r < t.length; r++) {
        const n = yt(t[r]);
        Array.isArray(n) ? e.push.apply(e, n) : e.push(n);
      }
      return e;
    }
    return t;
  }
  const wt = Symbol("fallback");
  function tt(t) {
    for (let e = 0; e < t.length; e++) t[e]();
  }
  function Qr(t, e, r = {}) {
    let n = [], o = [], _ = [], i = 0, s = e.length > 1 ? [] : null;
    return Se(() => tt(_)), () => {
      let c = t() || [], p = c.length, b, f;
      return c[qt], he(() => {
        let E, O, R, V, G, j, M, I, K;
        if (p === 0) i !== 0 && (tt(_), _ = [], n = [], o = [], i = 0, s && (s = [])), r.fallback && (n = [
          wt
        ], o[0] = Me((Z) => (_[0] = Z, r.fallback())), i = 1);
        else if (i === 0) {
          for (o = new Array(p), f = 0; f < p; f++) n[f] = c[f], o[f] = Me(C);
          i = p;
        } else {
          for (R = new Array(p), V = new Array(p), s && (G = new Array(p)), j = 0, M = Math.min(i, p); j < M && n[j] === c[j]; j++) ;
          for (M = i - 1, I = p - 1; M >= j && I >= j && n[M] === c[I]; M--, I--) R[I] = o[M], V[I] = _[M], s && (G[I] = s[M]);
          for (E = /* @__PURE__ */ new Map(), O = new Array(I + 1), f = I; f >= j; f--) K = c[f], b = E.get(K), O[f] = b === void 0 ? -1 : b, E.set(K, f);
          for (b = j; b <= M; b++) K = n[b], f = E.get(K), f !== void 0 && f !== -1 ? (R[f] = o[b], V[f] = _[b], s && (G[f] = s[b]), f = O[f], E.set(K, f)) : _[b]();
          for (f = j; f < p; f++) f in R ? (o[f] = R[f], _[f] = V[f], s && (s[f] = G[f], s[f](f))) : o[f] = Me(C);
          o = o.slice(0, i = p), n = c.slice(0);
        }
        return o;
      });
      function C(E) {
        if (_[f] = E, s) {
          const [O, R] = y(f);
          return s[f] = R, e(c[f], O);
        }
        return e(c[f]);
      }
    };
  }
  function en(t, e, r = {}) {
    let n = [], o = [], _ = [], i = [], s = 0, c;
    return Se(() => tt(_)), () => {
      const p = t() || [], b = p.length;
      return p[qt], he(() => {
        if (b === 0) return s !== 0 && (tt(_), _ = [], n = [], o = [], s = 0, i = []), r.fallback && (n = [
          wt
        ], o[0] = Me((C) => (_[0] = C, r.fallback())), s = 1), o;
        for (n[0] === wt && (_[0](), _ = [], n = [], o = [], s = 0), c = 0; c < b; c++) c < n.length && n[c] !== p[c] ? i[c](() => p[c]) : c >= n.length && (o[c] = Me(f));
        for (; c < n.length; c++) _[c]();
        return s = i.length = _.length = b, n = p.slice(0), o = o.slice(0, s);
      });
      function f(C) {
        _[c] = C;
        const [E, O] = y(p[c]);
        return i[c] = O, e(E, c);
      }
    };
  }
  function u(t, e) {
    return he(() => t(e || {}));
  }
  const er = (t) => `Stale read from <${t}>.`;
  function xt(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return ce(Qr(() => t.each, t.children, e || void 0));
  }
  function z(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return ce(en(() => t.each, t.children, e || void 0));
  }
  function B(t) {
    const e = t.keyed, r = ce(() => t.when, void 0, void 0), n = e ? r : ce(r, void 0, {
      equals: (o, _) => !o == !_
    });
    return ce(() => {
      const o = n();
      if (o) {
        const _ = t.children;
        return typeof _ == "function" && _.length > 0 ? he(() => _(e ? o : () => {
          if (!he(n)) throw er("Show");
          return r();
        })) : _;
      }
      return t.fallback;
    }, void 0, void 0);
  }
  function tn(t) {
    const e = Wr(() => t.children), r = ce(() => {
      const n = e(), o = Array.isArray(n) ? n : [
        n
      ];
      let _ = () => {
      };
      for (let i = 0; i < o.length; i++) {
        const s = i, c = o[i], p = _, b = ce(() => p() ? void 0 : c.when, void 0, void 0), f = c.keyed ? b : ce(b, void 0, {
          equals: (C, E) => !C == !E
        });
        _ = () => p() || (f() ? [
          s,
          b,
          c
        ] : void 0);
      }
      return _;
    });
    return ce(() => {
      const n = r()();
      if (!n) return t.fallback;
      const [o, _, i] = n, s = i.children;
      return typeof s == "function" && s.length > 0 ? he(() => s(i.keyed ? _() : () => {
        var _a2;
        if (((_a2 = he(r)()) == null ? void 0 : _a2[0]) !== o) throw er("Match");
        return _();
      })) : s;
    }, void 0, void 0);
  }
  function Dt(t) {
    return t;
  }
  const Ne = (t) => ce(() => t());
  function rn(t, e, r) {
    let n = r.length, o = e.length, _ = n, i = 0, s = 0, c = e[o - 1].nextSibling, p = null;
    for (; i < o || s < _; ) {
      if (e[i] === r[s]) {
        i++, s++;
        continue;
      }
      for (; e[o - 1] === r[_ - 1]; ) o--, _--;
      if (o === i) {
        const b = _ < n ? s ? r[s - 1].nextSibling : r[_ - s] : c;
        for (; s < _; ) t.insertBefore(r[s++], b);
      } else if (_ === s) for (; i < o; ) (!p || !p.has(e[i])) && e[i].remove(), i++;
      else if (e[i] === r[_ - 1] && r[s] === e[o - 1]) {
        const b = e[--o].nextSibling;
        t.insertBefore(r[s++], e[i++].nextSibling), t.insertBefore(r[--_], b), e[o] = r[_];
      } else {
        if (!p) {
          p = /* @__PURE__ */ new Map();
          let f = s;
          for (; f < _; ) p.set(r[f], f++);
        }
        const b = p.get(e[i]);
        if (b != null) if (s < b && b < _) {
          let f = i, C = 1, E;
          for (; ++f < o && f < _ && !((E = p.get(e[f])) == null || E !== b + C); ) C++;
          if (C > b - s) {
            const O = e[i];
            for (; s < b; ) t.insertBefore(r[s++], O);
          } else t.replaceChild(r[s++], e[i++]);
        } else i++;
        else e[i++].remove();
      }
    }
  }
  const St = "_$DX_DELEGATE";
  function nn(t, e, r, n = {}) {
    let o;
    return Me((_) => {
      o = _, e === document ? t() : w(e, t(), e.firstChild ? null : void 0, r);
    }, n.owner), () => {
      o(), e.textContent = "";
    };
  }
  function m(t, e, r, n) {
    let o;
    const _ = () => {
      const s = n ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
      return s.innerHTML = t, r ? s.content.firstChild.firstChild : n ? s.firstChild : s.content.firstChild;
    }, i = e ? () => he(() => document.importNode(o || (o = _()), true)) : () => (o || (o = _())).cloneNode(true);
    return i.cloneNode = i, i;
  }
  function st(t, e = window.document) {
    const r = e[St] || (e[St] = /* @__PURE__ */ new Set());
    for (let n = 0, o = t.length; n < o; n++) {
      const _ = t[n];
      r.has(_) || (r.add(_), e.addEventListener(_, on));
    }
  }
  function g(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function qe(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function sn(t, e, r) {
    return he(() => t(e, r));
  }
  function w(t, e, r, n) {
    if (r !== void 0 && !n && (n = []), typeof e != "function") return rt(t, e, n, r);
    D((o) => rt(t, e(), o, r), n);
  }
  function on(t) {
    let e = t.target;
    const r = `$$${t.type}`, n = t.target, o = t.currentTarget, _ = (c) => Object.defineProperty(t, "target", {
      configurable: true,
      value: c
    }), i = () => {
      const c = e[r];
      if (c && !e.disabled) {
        const p = e[`${r}Data`];
        if (p !== void 0 ? c.call(e, p, t) : c.call(e, t), t.cancelBubble) return;
      }
      return e.host && typeof e.host != "string" && !e.host._$host && e.contains(t.target) && _(e.host), true;
    }, s = () => {
      for (; i() && (e = e._$host || e.parentNode || e.host); ) ;
    };
    if (Object.defineProperty(t, "currentTarget", {
      configurable: true,
      get() {
        return e || document;
      }
    }), t.composedPath) {
      const c = t.composedPath();
      _(c[0]);
      for (let p = 0; p < c.length - 2 && (e = c[p], !!i()); p++) {
        if (e._$host) {
          e = e._$host, s();
          break;
        }
        if (e.parentNode === o) break;
      }
    } else s();
    _(n);
  }
  function rt(t, e, r, n, o) {
    for (; typeof r == "function"; ) r = r();
    if (e === r) return r;
    const _ = typeof e, i = n !== void 0;
    if (t = i && r[0] && r[0].parentNode || t, _ === "string" || _ === "number") {
      if (_ === "number" && (e = e.toString(), e === r)) return r;
      if (i) {
        let s = r[0];
        s && s.nodeType === 3 ? s.data !== e && (s.data = e) : s = document.createTextNode(e), r = Ae(t, r, n, s);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || _ === "boolean") r = Ae(t, r, n);
    else {
      if (_ === "function") return D(() => {
        let s = e();
        for (; typeof s == "function"; ) s = s();
        r = rt(t, s, r, n);
      }), () => r;
      if (Array.isArray(e)) {
        const s = [], c = r && Array.isArray(r);
        if (mt(s, e, r, o)) return D(() => r = rt(t, s, r, n, true)), () => r;
        if (s.length === 0) {
          if (r = Ae(t, r, n), i) return r;
        } else c ? r.length === 0 ? Lt(t, s, n) : rn(t, r, s) : (r && Ae(t), Lt(t, s));
        r = s;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (i) return r = Ae(t, r, n, e);
          Ae(t, r, null, e);
        } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
        r = e;
      }
    }
    return r;
  }
  function mt(t, e, r, n) {
    let o = false;
    for (let _ = 0, i = e.length; _ < i; _++) {
      let s = e[_], c = r && r[t.length], p;
      if (!(s == null || s === true || s === false)) if ((p = typeof s) == "object" && s.nodeType) t.push(s);
      else if (Array.isArray(s)) o = mt(t, s, c) || o;
      else if (p === "function") if (n) {
        for (; typeof s == "function"; ) s = s();
        o = mt(t, Array.isArray(s) ? s : [
          s
        ], Array.isArray(c) ? c : [
          c
        ]) || o;
      } else t.push(s), o = true;
      else {
        const b = String(s);
        c && c.nodeType === 3 && c.data === b ? t.push(c) : t.push(document.createTextNode(b));
      }
    }
    return o;
  }
  function Lt(t, e, r = null) {
    for (let n = 0, o = e.length; n < o; n++) t.insertBefore(e[n], r);
  }
  function Ae(t, e, r, n) {
    if (r === void 0) return t.textContent = "";
    const o = n || document.createTextNode("");
    if (e.length) {
      let _ = false;
      for (let i = e.length - 1; i >= 0; i--) {
        const s = e[i];
        if (o !== s) {
          const c = s.parentNode === t;
          !_ && !i ? c ? t.replaceChild(o, s) : t.insertBefore(o, r) : c && s.remove();
        } else _ = true;
      }
    } else t.insertBefore(o, r);
    return [
      o
    ];
  }
  const _n = "" + new URL("ntools_rs_bg-BrpW4iNZ.wasm", import.meta.url).href, ln = async (t = {}, e) => {
    let r;
    if (e.startsWith("data:")) {
      const n = e.replace(/^data:.*?base64,/, "");
      let o;
      if (typeof Buffer == "function" && typeof Buffer.from == "function") o = Buffer.from(n, "base64");
      else if (typeof atob == "function") {
        const _ = atob(n);
        o = new Uint8Array(_.length);
        for (let i = 0; i < _.length; i++) o[i] = _.charCodeAt(i);
      } else throw new Error("Cannot decode base64-encoded data URL");
      r = await WebAssembly.instantiate(o, t);
    } else {
      const n = await fetch(e), o = n.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && o.startsWith("application/wasm")) r = await WebAssembly.instantiateStreaming(n, t);
      else {
        const _ = await n.arrayBuffer();
        r = await WebAssembly.instantiate(_, t);
      }
    }
    return r.instance.exports;
  };
  let l;
  function an(t) {
    l = t;
  }
  let Fe = null;
  function Be() {
    return (Fe === null || Fe.byteLength === 0) && (Fe = new Uint8Array(l.memory.buffer)), Fe;
  }
  let Ze = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  Ze.decode();
  const cn = 2146435072;
  let ct = 0;
  function dn(t, e) {
    return ct += e, ct >= cn && (Ze = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), Ze.decode(), ct = e), Ze.decode(Be().subarray(t, t + e));
  }
  function ke(t, e) {
    return t = t >>> 0, dn(t, e);
  }
  function tr(t, e) {
    return t = t >>> 0, Be().subarray(t / 1, t / 1 + e);
  }
  let De = 0;
  function dt(t, e) {
    const r = e(t.length * 1, 1) >>> 0;
    return Be().set(t, r / 1), De = t.length, r;
  }
  function ut(t) {
    const e = l.__wbindgen_externrefs.get(t);
    return l.__externref_table_dealloc(t), e;
  }
  const Oe = new TextEncoder();
  "encodeInto" in Oe || (Oe.encodeInto = function(t, e) {
    const r = Oe.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function un(t, e, r) {
    if (r === void 0) {
      const s = Oe.encode(t), c = e(s.length, 1) >>> 0;
      return Be().subarray(c, c + s.length).set(s), De = s.length, c;
    }
    let n = t.length, o = e(n, 1) >>> 0;
    const _ = Be();
    let i = 0;
    for (; i < n; i++) {
      const s = t.charCodeAt(i);
      if (s > 127) break;
      _[o + i] = s;
    }
    if (i !== n) {
      i !== 0 && (t = t.slice(i)), o = r(o, n, n = i + t.length * 3, 1) >>> 0;
      const s = Be().subarray(o + i, o + n), c = Oe.encodeInto(t, s);
      i += c.written, o = r(o, n, i, 1) >>> 0;
    }
    return De = i, o;
  }
  let We = null;
  function pn() {
    return (We === null || We.byteLength === 0) && (We = new Float64Array(l.memory.buffer)), We;
  }
  function Ye(t, e) {
    return t = t >>> 0, pn().subarray(t / 8, t / 8 + e);
  }
  let Ce = null;
  function hn() {
    return (Ce === null || Ce.buffer.detached === true || Ce.buffer.detached === void 0 && Ce.buffer !== l.memory.buffer) && (Ce = new DataView(l.memory.buffer)), Ce;
  }
  function Tt(t, e) {
    t = t >>> 0;
    const r = hn(), n = [];
    for (let o = t; o < t + 4 * e; o += 4) n.push(l.__wbindgen_externrefs.get(r.getUint32(o, true)));
    return l.__externref_drop_slice(t, e), n;
  }
  function gn(t, e) {
    if (!(t instanceof e)) throw new Error(`expected instance of ${e.name}`);
  }
  const Pt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_editor_free(t >>> 0, 1));
  class Le {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Le.prototype);
      return r.__wbg_ptr = e, Pt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Pt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      l.__wbg_editor_free(e, 0);
    }
    export_map() {
      const e = l.editor_export_map(this.__wbg_ptr);
      var r = tr(e[0], e[1]).slice();
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
        const n = l.editor_tiles_path(this.__wbg_ptr);
        return e = n[0], r = n[1], ke(n[0], n[1]);
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
      l.editor_press_num_1(this.__wbg_ptr);
    }
    press_num_2() {
      l.editor_press_num_1(this.__wbg_ptr);
    }
    press_num_3() {
      l.editor_press_num_3(this.__wbg_ptr);
    }
    press_num_4() {
      l.editor_press_num_4(this.__wbg_ptr);
    }
    press_num_5() {
      l.editor_press_num_1(this.__wbg_ptr);
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
    load_attract(e, r, n) {
      const o = dt(e, l.__wbindgen_malloc), _ = De, i = l.editor_load_attract(this.__wbg_ptr, o, _, r, n);
      if (i[2]) throw ut(i[1]);
      return Ie.__wrap(i[0]);
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
      const r = dt(e, l.__wbindgen_malloc), n = De;
      l.editor_set_anim_data(this.__wbg_ptr, r, n);
    }
    get_anim_state() {
      return l.editor_get_anim_state(this.__wbg_ptr) >>> 0;
    }
    get_level_name() {
      let e, r;
      try {
        const n = l.editor_get_level_name(this.__wbg_ptr);
        return e = n[0], r = n[1], ke(n[0], n[1]);
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
    set_cursor_pos(e, r, n) {
      return l.editor_set_cursor_pos(this.__wbg_ptr, e, r, n) !== 0;
    }
    set_level_name(e) {
      const r = un(e, l.__wbindgen_malloc, l.__wbindgen_realloc), n = De;
      l.editor_set_level_name(this.__wbg_ptr, r, n);
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
      var r = Ye(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 8, 8), r;
    }
    preview_entities() {
      const e = l.editor_preview_entities(this.__wbg_ptr);
      var r = Tt(e[0], e[1]).slice();
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
        const n = l.editor_selected_tiles_path(this.__wbg_ptr);
        return e = n[0], r = n[1], ke(n[0], n[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    selected_tile_outline_path() {
      let e, r;
      try {
        const n = l.editor_selected_tile_outline_path(this.__wbg_ptr);
        return e = n[0], r = n[1], ke(n[0], n[1]);
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
      l.editor_press_num_1(this.__wbg_ptr);
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
      var r = Tt(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    load_map(e) {
      const r = dt(e, l.__wbindgen_malloc), n = De, o = l.editor_load_map(this.__wbg_ptr, r, n);
      if (o[1]) throw ut(o[0]);
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
    to_replay(e, r) {
      const n = l.editor_to_replay(this.__wbg_ptr, e, r);
      if (n[2]) throw ut(n[1]);
      return Ie.__wrap(n[0]);
    }
  }
  Symbol.dispose && (Le.prototype[Symbol.dispose] = Le.prototype.free);
  const Et = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_exportedentity_free(t >>> 0, 1));
  class Ke {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Ke.prototype);
      return r.__wbg_ptr = e, Et.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Et.unregister(this), e;
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
  Symbol.dispose && (Ke.prototype[Symbol.dispose] = Ke.prototype.free);
  const jt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_replay_free(t >>> 0, 1));
  class Ie {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Ie.prototype);
      return r.__wbg_ptr = e, jt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, jt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      l.__wbg_replay_free(e, 0);
    }
    inputs_len() {
      return l.replay_inputs_len(this.__wbg_ptr) >>> 0;
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
        const n = l.replay_tiles_path(this.__wbg_ptr);
        return e = n[0], r = n[1], ke(n[0], n[1]);
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
    deathball_x(e, r) {
      return l.replay_deathball_x(this.__wbg_ptr, e, r);
    }
    deathball_y(e, r) {
      return l.replay_deathball_y(this.__wbg_ptr, e, r);
    }
    exit_door_x(e) {
      return l.replay_exit_door_x(this.__wbg_ptr, e);
    }
    exit_door_y(e) {
      return l.replay_exit_door_y(this.__wbg_ptr, e);
    }
    ninja_bones(e) {
      const r = l.replay_ninja_bones(this.__wbg_ptr, e);
      var n = Ye(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 8, 8), n;
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
    past_ninja_x(e) {
      return l.replay_past_ninja_x(this.__wbg_ptr, e);
    }
    past_ninja_y(e) {
      return l.replay_past_ninja_y(this.__wbg_ptr, e);
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
      return l.replay_inputs_len(this.__wbg_ptr) >>> 0;
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
    deathballs_len() {
      return l.replay_deathballs_len(this.__wbg_ptr) >>> 0;
    }
    exit_doors_len() {
      return l.replay_exit_doors_len(this.__wbg_ptr) >>> 0;
    }
    export_attract(e) {
      gn(e, Le);
      const r = l.replay_export_attract(this.__wbg_ptr, e.__wbg_ptr);
      var n = tr(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 1, 1), n;
    }
    gold_collected(e) {
      return l.replay_gold_collected(this.__wbg_ptr, e) !== 0;
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
    is_from_attract() {
      return l.replay_is_from_attract(this.__wbg_ptr) !== 0;
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
    past_ninjas_len() {
      return l.replay_past_ninjas_len(this.__wbg_ptr) >>> 0;
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
    past_ninja_bones(e) {
      const r = l.replay_past_ninja_bones(this.__wbg_ptr, e);
      var n = Ye(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 8, 8), n;
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
      var n = Ye(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 8, 8), n;
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
    input(e) {
      return l.replay_input(this.__wbg_ptr, e);
    }
    score() {
      return l.replay_score(this.__wbg_ptr) >>> 0;
    }
    gold_x(e) {
      return l.replay_gold_x(this.__wbg_ptr, e);
    }
    gold_y(e) {
      return l.replay_gold_y(this.__wbg_ptr, e);
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
    golds_len() {
      return l.replay_golds_len(this.__wbg_ptr) >>> 0;
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
    set_input(e, r, n, o) {
      l.replay_set_input(this.__wbg_ptr, e, r, n, o);
    }
  }
  Symbol.dispose && (Ie.prototype[Symbol.dispose] = Ie.prototype.free);
  function fn(t, e) {
    throw new Error(ke(t, e));
  }
  function yn(t) {
    return Ke.__wrap(t);
  }
  function wn(t, e) {
    return ke(t, e);
  }
  function mn() {
    const t = l.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const a = await ln({
    "./ntools_rs_bg.js": {
      __wbg_exportedentity_new: yn,
      __wbg___wbindgen_throw_b855445ff6a94295: fn,
      __wbindgen_init_externref_table: mn,
      __wbindgen_cast_2241b6af4c4b2941: wn
    }
  }, _n), bn = a.memory, xn = a.__wbg_editor_free, vn = a.editor_crosshair_x, $n = a.editor_crosshair_y, kn = a.editor_cursor_down, Dn = a.editor_cursor_up, Sn = a.editor_double_click, Ln = a.editor_entities, Tn = a.editor_export_map, Pn = a.editor_get_anim_state, En = a.editor_get_level_name, jn = a.editor_get_show_trail, An = a.editor_load_attract, Cn = a.editor_load_map, Nn = a.editor_mode, Mn = a.editor_new, Bn = a.editor_palette_center_x, In = a.editor_palette_center_y, On = a.editor_palette_selection_x, Rn = a.editor_palette_selection_y, Kn = a.editor_past_ninja_bones, Gn = a.editor_past_ninja_x, Hn = a.editor_past_ninja_y, zn = a.editor_past_ninjas_len, Vn = a.editor_press_0, Un = a.editor_press_1, qn = a.editor_press_2, Fn = a.editor_press_3, Wn = a.editor_press_4, Zn = a.editor_press_5, Yn = a.editor_press_6, Xn = a.editor_press_7, Jn = a.editor_press_8, Qn = a.editor_press_9, es = a.editor_press_a, ts = a.editor_press_alt_left, rs = a.editor_press_backtick, ns = a.editor_press_bracket_left, ss = a.editor_press_bracket_right, os = a.editor_press_c, is = a.editor_press_comma, _s = a.editor_press_d, ls = a.editor_press_dash, as = a.editor_press_down, cs = a.editor_press_e, ds = a.editor_press_enter, us = a.editor_press_equals, ps = a.editor_press_escape, hs = a.editor_press_f, gs = a.editor_press_h, fs = a.editor_press_i, ys = a.editor_press_j, ws = a.editor_press_k, ms = a.editor_press_l, bs = a.editor_press_left, xs = a.editor_press_m, vs = a.editor_press_n, $s = a.editor_press_num_0, ks = a.editor_press_num_1, Ds = a.editor_press_num_3, Ss = a.editor_press_num_4, Ls = a.editor_press_num_7, Ts = a.editor_press_o, Ps = a.editor_press_p, Es = a.editor_press_q, js = a.editor_press_r, As = a.editor_press_right, Cs = a.editor_press_s, Ns = a.editor_press_shift, Ms = a.editor_press_slash, Bs = a.editor_press_space, Is = a.editor_press_t, Os = a.editor_press_up, Rs = a.editor_press_w, Ks = a.editor_press_x, Gs = a.editor_press_y, Hs = a.editor_press_z, zs = a.editor_preview_entities, Vs = a.editor_receive_past_ninjas, Us = a.editor_redo, qs = a.editor_release_a, Fs = a.editor_release_alt_left, Ws = a.editor_release_c, Zs = a.editor_release_d, Ys = a.editor_release_e, Xs = a.editor_release_q, Js = a.editor_release_s, Qs = a.editor_release_shift, eo = a.editor_release_space, to = a.editor_release_w, ro = a.editor_release_z, no = a.editor_selected_tile_outline_path, so = a.editor_selected_tiles_path, oo = a.editor_set_anim_data, io = a.editor_set_cursor_pos, _o = a.editor_set_level_name, lo = a.editor_set_show_trail, ao = a.editor_show_half_grid, co = a.editor_show_quarter_grid, uo = a.editor_tile_crosshair_col, po = a.editor_tile_crosshair_row, ho = a.editor_tiles_path, go = a.editor_to_replay, fo = a.editor_undo, yo = a.__wbg_exportedentity_free, wo = a.__wbg_get_exportedentity_deg, mo = a.__wbg_get_exportedentity_mode, bo = a.__wbg_get_exportedentity_switch_x, xo = a.__wbg_get_exportedentity_switch_y, vo = a.__wbg_get_exportedentity_type_int, $o = a.__wbg_get_exportedentity_x, ko = a.__wbg_get_exportedentity_y, Do = a.__wbg_set_exportedentity_deg, So = a.__wbg_set_exportedentity_mode, Lo = a.__wbg_set_exportedentity_switch_x, To = a.__wbg_set_exportedentity_switch_y, Po = a.__wbg_set_exportedentity_type_int, Eo = a.__wbg_set_exportedentity_x, jo = a.__wbg_set_exportedentity_y, Ao = a.__wbg_replay_free, Co = a.replay_boost_pad_anim_progress, No = a.replay_boost_pad_deg, Mo = a.replay_boost_pad_x, Bo = a.replay_boost_pad_y, Io = a.replay_boost_pads_len, Oo = a.replay_bounce_block_deg, Ro = a.replay_bounce_block_x, Ko = a.replay_bounce_block_y, Go = a.replay_bounce_blocks_len, Ho = a.replay_chaingun_drone_deg, zo = a.replay_chaingun_drone_x, Vo = a.replay_chaingun_drone_y, Uo = a.replay_chaingun_drones_len, qo = a.replay_chase_drone_deg, Fo = a.replay_chase_drone_x, Wo = a.replay_chase_drone_y, Zo = a.replay_chase_drones_len, Yo = a.replay_deathball_x, Xo = a.replay_deathball_y, Jo = a.replay_deathballs_len, Qo = a.replay_exit_anim_progress, ei = a.replay_exit_door_x, ti = a.replay_exit_door_y, ri = a.replay_exit_doors_len, ni = a.replay_exit_switch_x, si = a.replay_exit_switch_y, oi = a.replay_export_attract, ii = a.replay_floor_guard_deg, _i = a.replay_floor_guard_x, li = a.replay_floor_guard_y, ai = a.replay_floor_guards_len, ci = a.replay_gold_collected, di = a.replay_gold_x, ui = a.replay_gold_y, pi = a.replay_golds_len, hi = a.replay_input, gi = a.replay_inputs_len, fi = a.replay_is_from_attract, yi = a.replay_laser_drone_deg, wi = a.replay_laser_drone_x, mi = a.replay_laser_drone_y, bi = a.replay_laser_drones_len, xi = a.replay_launch_pad_deg, vi = a.replay_launch_pad_x, $i = a.replay_launch_pad_y, ki = a.replay_launch_pads_len, Di = a.replay_locked_door_anim_progress, Si = a.replay_locked_door_deg, Li = a.replay_locked_door_x, Ti = a.replay_locked_door_y, Pi = a.replay_locked_doors_len, Ei = a.replay_locked_switch_x, ji = a.replay_locked_switch_y, Ai = a.replay_mine_state, Ci = a.replay_mine_x, Ni = a.replay_mine_y, Mi = a.replay_mines_len, Bi = a.replay_ninja_bones, Ii = a.replay_ninja_preview_bones, Oi = a.replay_ninja_preview_x, Ri = a.replay_ninja_preview_y, Ki = a.replay_ninja_x, Gi = a.replay_ninja_y, Hi = a.replay_one_way_deg, zi = a.replay_one_way_x, Vi = a.replay_one_way_y, Ui = a.replay_one_ways_len, qi = a.replay_past_ninja_bones, Fi = a.replay_past_ninja_x, Wi = a.replay_past_ninja_y, Zi = a.replay_past_ninjas_len, Yi = a.replay_place_ninja, Xi = a.replay_progress, Ji = a.replay_progress_preview, Qi = a.replay_regular_door_anim_progress, e_ = a.replay_regular_door_deg, t_ = a.replay_regular_door_x, r_ = a.replay_regular_door_y, n_ = a.replay_regular_doors_len, s_ = a.replay_score, o_ = a.replay_seek, i_ = a.replay_seek_preview, __ = a.replay_send_past_ninjas, l_ = a.replay_set_input, a_ = a.replay_shove_thwump_deg, c_ = a.replay_shove_thwump_touch, d_ = a.replay_shove_thwump_x, u_ = a.replay_shove_thwump_y, p_ = a.replay_shove_thwumps_len, h_ = a.replay_thwump_deg, g_ = a.replay_thwump_x, f_ = a.replay_thwump_y, y_ = a.replay_thwumps_len, w_ = a.replay_tick, m_ = a.replay_tiles_path, b_ = a.replay_trap_door_anim_progress, x_ = a.replay_trap_door_deg, v_ = a.replay_trap_door_x, $_ = a.replay_trap_door_y, k_ = a.replay_trap_doors_len, D_ = a.replay_trap_switch_x, S_ = a.replay_trap_switch_y, L_ = a.replay_zap_drone_deg, T_ = a.replay_zap_drone_x, P_ = a.replay_zap_drone_y, E_ = a.replay_zap_drones_len, j_ = a.editor_press_num_2, A_ = a.editor_press_num_5, C_ = a.editor_press_u, N_ = a.replay_replay_length, M_ = a.__wbindgen_externrefs, B_ = a.__wbindgen_free, I_ = a.__wbindgen_malloc, O_ = a.__externref_table_dealloc, R_ = a.__wbindgen_realloc, K_ = a.__externref_drop_slice, rr = a.__wbindgen_start, G_ = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: K_,
    __externref_table_dealloc: O_,
    __wbg_editor_free: xn,
    __wbg_exportedentity_free: yo,
    __wbg_get_exportedentity_deg: wo,
    __wbg_get_exportedentity_mode: mo,
    __wbg_get_exportedentity_switch_x: bo,
    __wbg_get_exportedentity_switch_y: xo,
    __wbg_get_exportedentity_type_int: vo,
    __wbg_get_exportedentity_x: $o,
    __wbg_get_exportedentity_y: ko,
    __wbg_replay_free: Ao,
    __wbg_set_exportedentity_deg: Do,
    __wbg_set_exportedentity_mode: So,
    __wbg_set_exportedentity_switch_x: Lo,
    __wbg_set_exportedentity_switch_y: To,
    __wbg_set_exportedentity_type_int: Po,
    __wbg_set_exportedentity_x: Eo,
    __wbg_set_exportedentity_y: jo,
    __wbindgen_externrefs: M_,
    __wbindgen_free: B_,
    __wbindgen_malloc: I_,
    __wbindgen_realloc: R_,
    __wbindgen_start: rr,
    editor_crosshair_x: vn,
    editor_crosshair_y: $n,
    editor_cursor_down: kn,
    editor_cursor_up: Dn,
    editor_double_click: Sn,
    editor_entities: Ln,
    editor_export_map: Tn,
    editor_get_anim_state: Pn,
    editor_get_level_name: En,
    editor_get_show_trail: jn,
    editor_load_attract: An,
    editor_load_map: Cn,
    editor_mode: Nn,
    editor_new: Mn,
    editor_palette_center_x: Bn,
    editor_palette_center_y: In,
    editor_palette_selection_x: On,
    editor_palette_selection_y: Rn,
    editor_past_ninja_bones: Kn,
    editor_past_ninja_x: Gn,
    editor_past_ninja_y: Hn,
    editor_past_ninjas_len: zn,
    editor_press_0: Vn,
    editor_press_1: Un,
    editor_press_2: qn,
    editor_press_3: Fn,
    editor_press_4: Wn,
    editor_press_5: Zn,
    editor_press_6: Yn,
    editor_press_7: Xn,
    editor_press_8: Jn,
    editor_press_9: Qn,
    editor_press_a: es,
    editor_press_alt_left: ts,
    editor_press_backtick: rs,
    editor_press_bracket_left: ns,
    editor_press_bracket_right: ss,
    editor_press_c: os,
    editor_press_comma: is,
    editor_press_d: _s,
    editor_press_dash: ls,
    editor_press_down: as,
    editor_press_e: cs,
    editor_press_enter: ds,
    editor_press_equals: us,
    editor_press_escape: ps,
    editor_press_f: hs,
    editor_press_h: gs,
    editor_press_i: fs,
    editor_press_j: ys,
    editor_press_k: ws,
    editor_press_l: ms,
    editor_press_left: bs,
    editor_press_m: xs,
    editor_press_n: vs,
    editor_press_num_0: $s,
    editor_press_num_1: ks,
    editor_press_num_2: j_,
    editor_press_num_3: Ds,
    editor_press_num_4: Ss,
    editor_press_num_5: A_,
    editor_press_num_7: Ls,
    editor_press_o: Ts,
    editor_press_p: Ps,
    editor_press_q: Es,
    editor_press_r: js,
    editor_press_right: As,
    editor_press_s: Cs,
    editor_press_shift: Ns,
    editor_press_slash: Ms,
    editor_press_space: Bs,
    editor_press_t: Is,
    editor_press_u: C_,
    editor_press_up: Os,
    editor_press_w: Rs,
    editor_press_x: Ks,
    editor_press_y: Gs,
    editor_press_z: Hs,
    editor_preview_entities: zs,
    editor_receive_past_ninjas: Vs,
    editor_redo: Us,
    editor_release_a: qs,
    editor_release_alt_left: Fs,
    editor_release_c: Ws,
    editor_release_d: Zs,
    editor_release_e: Ys,
    editor_release_q: Xs,
    editor_release_s: Js,
    editor_release_shift: Qs,
    editor_release_space: eo,
    editor_release_w: to,
    editor_release_z: ro,
    editor_selected_tile_outline_path: no,
    editor_selected_tiles_path: so,
    editor_set_anim_data: oo,
    editor_set_cursor_pos: io,
    editor_set_level_name: _o,
    editor_set_show_trail: lo,
    editor_show_half_grid: ao,
    editor_show_quarter_grid: co,
    editor_tile_crosshair_col: uo,
    editor_tile_crosshair_row: po,
    editor_tiles_path: ho,
    editor_to_replay: go,
    editor_undo: fo,
    memory: bn,
    replay_boost_pad_anim_progress: Co,
    replay_boost_pad_deg: No,
    replay_boost_pad_x: Mo,
    replay_boost_pad_y: Bo,
    replay_boost_pads_len: Io,
    replay_bounce_block_deg: Oo,
    replay_bounce_block_x: Ro,
    replay_bounce_block_y: Ko,
    replay_bounce_blocks_len: Go,
    replay_chaingun_drone_deg: Ho,
    replay_chaingun_drone_x: zo,
    replay_chaingun_drone_y: Vo,
    replay_chaingun_drones_len: Uo,
    replay_chase_drone_deg: qo,
    replay_chase_drone_x: Fo,
    replay_chase_drone_y: Wo,
    replay_chase_drones_len: Zo,
    replay_deathball_x: Yo,
    replay_deathball_y: Xo,
    replay_deathballs_len: Jo,
    replay_exit_anim_progress: Qo,
    replay_exit_door_x: ei,
    replay_exit_door_y: ti,
    replay_exit_doors_len: ri,
    replay_exit_switch_x: ni,
    replay_exit_switch_y: si,
    replay_export_attract: oi,
    replay_floor_guard_deg: ii,
    replay_floor_guard_x: _i,
    replay_floor_guard_y: li,
    replay_floor_guards_len: ai,
    replay_gold_collected: ci,
    replay_gold_x: di,
    replay_gold_y: ui,
    replay_golds_len: pi,
    replay_input: hi,
    replay_inputs_len: gi,
    replay_is_from_attract: fi,
    replay_laser_drone_deg: yi,
    replay_laser_drone_x: wi,
    replay_laser_drone_y: mi,
    replay_laser_drones_len: bi,
    replay_launch_pad_deg: xi,
    replay_launch_pad_x: vi,
    replay_launch_pad_y: $i,
    replay_launch_pads_len: ki,
    replay_locked_door_anim_progress: Di,
    replay_locked_door_deg: Si,
    replay_locked_door_x: Li,
    replay_locked_door_y: Ti,
    replay_locked_doors_len: Pi,
    replay_locked_switch_x: Ei,
    replay_locked_switch_y: ji,
    replay_mine_state: Ai,
    replay_mine_x: Ci,
    replay_mine_y: Ni,
    replay_mines_len: Mi,
    replay_ninja_bones: Bi,
    replay_ninja_preview_bones: Ii,
    replay_ninja_preview_x: Oi,
    replay_ninja_preview_y: Ri,
    replay_ninja_x: Ki,
    replay_ninja_y: Gi,
    replay_one_way_deg: Hi,
    replay_one_way_x: zi,
    replay_one_way_y: Vi,
    replay_one_ways_len: Ui,
    replay_past_ninja_bones: qi,
    replay_past_ninja_x: Fi,
    replay_past_ninja_y: Wi,
    replay_past_ninjas_len: Zi,
    replay_place_ninja: Yi,
    replay_progress: Xi,
    replay_progress_preview: Ji,
    replay_regular_door_anim_progress: Qi,
    replay_regular_door_deg: e_,
    replay_regular_door_x: t_,
    replay_regular_door_y: r_,
    replay_regular_doors_len: n_,
    replay_replay_length: N_,
    replay_score: s_,
    replay_seek: o_,
    replay_seek_preview: i_,
    replay_send_past_ninjas: __,
    replay_set_input: l_,
    replay_shove_thwump_deg: a_,
    replay_shove_thwump_touch: c_,
    replay_shove_thwump_x: d_,
    replay_shove_thwump_y: u_,
    replay_shove_thwumps_len: p_,
    replay_thwump_deg: h_,
    replay_thwump_x: g_,
    replay_thwump_y: f_,
    replay_thwumps_len: y_,
    replay_tick: w_,
    replay_tiles_path: m_,
    replay_trap_door_anim_progress: b_,
    replay_trap_door_deg: x_,
    replay_trap_door_x: v_,
    replay_trap_door_y: $_,
    replay_trap_doors_len: k_,
    replay_trap_switch_x: D_,
    replay_trap_switch_y: S_,
    replay_zap_drone_deg: L_,
    replay_zap_drone_x: T_,
    replay_zap_drone_y: P_,
    replay_zap_drones_len: E_
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  an(G_);
  rr();
  function H_({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var z_ = m("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const V_ = [
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
  function Ge(t) {
    function e() {
      const r = t.bones();
      return r ? V_.map(([n, o]) => `M ${20 * r[n]} ${20 * r[n + 13]} ${20 * r[o]} ${20 * r[o + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = z_();
      return D((n) => {
        var o = t.class, _ = H_(t.ninja()), i = e();
        return o !== n.e && g(r, "class", n.e = o), _ !== n.t && g(r, "transform", n.t = _), i !== n.a && g(r, "d", n.a = i), n;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var U_ = m("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), q_ = m("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function F_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function W_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Z_([t, e], r, n) {
    const o = t(), _ = r.exit_doors_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.exit_door_x(s),
        y: r.exit_door_y(s),
        animProgress: r.exit_anim_progress(s, n)
      };
      c && F_(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function nr(t) {
    return u(z, {
      get each() {
        return t.exitDoors();
      },
      children: (e) => u(Y_, {
        exitDoor: e
      })
    });
  }
  const ee = 11, U = 2.5;
  function Y_(t) {
    return (() => {
      var e = U_(), r = e.firstChild, n = r.nextSibling, o = n.nextSibling, _ = o.nextSibling, i = _.nextSibling;
      return D((s) => {
        var c = W_(t.exitDoor), p = -13 + 4 * (1 - t.exitDoor().animProgress), b = 26 - 8 * (1 - t.exitDoor().animProgress), f = `M ${-13 * t.exitDoor().animProgress} 0 v ${-ee} h ${-ee + U} l ${-U} ${U} v ${2 * (ee - U)} l ${U} ${U} h ${ee - U} z`, C = `M ${13 * t.exitDoor().animProgress} 0 v ${-ee} h ${ee - U} l ${U} ${U} v ${2 * (ee - U)} l ${-U} ${U} h ${-ee + U} z`, E = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * ee} v ${t.exitDoor().animProgress * ee} h ${-ee + U + t.exitDoor().animProgress} l ${-U} ${-U} v ${(1 - t.exitDoor().animProgress) * (-ee + U)}`, O = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * ee} v ${t.exitDoor().animProgress * ee} h ${ee - U - t.exitDoor().animProgress} l ${U} ${-U} v ${(1 - t.exitDoor().animProgress) * (-ee + U)}`;
        return c !== s.e && g(e, "transform", s.e = c), p !== s.t && g(r, "x", s.t = p), b !== s.a && g(r, "width", s.a = b), f !== s.o && g(n, "d", s.o = f), C !== s.i && g(o, "d", s.i = C), E !== s.n && g(_, "d", s.n = E), O !== s.s && g(i, "d", s.s = O), s;
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
  function X_() {
    return q_();
  }
  var J_ = m('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function Q_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function el(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function tl([t, e], r, n) {
    const o = t(), _ = r.exit_doors_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.exit_switch_x(s),
        y: r.exit_switch_y(s),
        animProgress: r.exit_anim_progress(s, n)
      };
      c && Q_(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function sr(t) {
    return u(z, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => u(rl, {
        exitSwitch: e
      })
    });
  }
  const ve = 2;
  function rl(t) {
    return (() => {
      var e = J_(), r = e.firstChild, n = r.nextSibling, o = n.nextSibling;
      return D((_) => {
        var i = el(t.exitSwitch), s = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, p = `M ${-2 * t.exitSwitch().animProgress} ${-ve} h ${-ve} v ${2 * ve} h ${ve}`, b = `M ${2 * t.exitSwitch().animProgress} ${-ve} h ${ve} v ${2 * ve} h ${-ve}`;
        return i !== _.e && g(e, "transform", _.e = i), s !== _.t && g(r, "fill", _.t = s), c !== _.a && g(r, "stroke", _.a = c), p !== _.o && g(n, "d", _.o = p), b !== _.i && g(o, "d", _.i = b), _;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), e;
    })();
  }
  var nl = m("<svg><use href=#one-way></svg>", false, true, false), sl = m("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function ol(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function il(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function _l([t, e], r) {
    const n = t(), o = r.one_ways_len(), _ = [];
    for (let i = 0; i < o; i++) {
      const s = n.at(i), c = {
        x: r.one_way_x(i),
        y: r.one_way_y(i),
        deg: r.one_way_deg(i)
      };
      s && ol(s, c) ? _.push(s) : _.push(c);
    }
    e(_);
  }
  function or(t) {
    return u(z, {
      get each() {
        return t.oneWays();
      },
      children: (e) => (() => {
        var r = nl();
        return D(() => g(r, "transform", il(e))), r;
      })()
    });
  }
  function ir() {
    return (() => {
      var t = sl(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var ll = m("<svg><use></svg>", false, true, false), al = m("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), cl = m("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), dl = m("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const ul = 0, pl = 1;
  function hl(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function gl(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function fl([t, e], r) {
    const n = t(), o = r.mines_len(), _ = [];
    for (let i = 0; i < o; i++) {
      const s = n.at(i), c = {
        x: r.mine_x(i),
        y: r.mine_y(i),
        type: r.mine_state(i)
      };
      s && hl(s, c) ? _.push(s) : _.push(c);
    }
    e(_);
  }
  function _r(t) {
    return u(z, {
      get each() {
        return t.mines();
      },
      children: (e) => (() => {
        var r = ll();
        return D((n) => {
          var o = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][e().type], _ = gl(e);
          return o !== n.e && g(r, "href", n.e = o), _ !== n.t && g(r, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function lr() {
    return [
      (() => {
        var t = al(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, o = n.nextSibling, _ = o.nextSibling;
        return _.nextSibling, t;
      })(),
      (() => {
        var t = cl();
        return t.firstChild, t;
      })(),
      (() => {
        var t = dl();
        return t.firstChild, t;
      })()
    ];
  }
  var yl = m("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), wl = m("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), ml = m("<svg><g class=regular-door></svg>", false, true, false);
  function bl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function xl(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function vl([t, e], r, n) {
    const o = t(), _ = r.regular_doors_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.regular_door_x(s),
        y: r.regular_door_y(s),
        deg: r.regular_door_deg(s),
        animProgress: r.regular_door_anim_progress(s, n)
      };
      c && bl(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function ar(t) {
    return u(z, {
      get each() {
        return t.regularDoors();
      },
      children: (e) => u(Dl, {
        regularDoor: e
      })
    });
  }
  const $l = 1, kl = 12 - $l;
  function Dl(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (kl - 0) * r;
    }
    return (() => {
      var r = ml();
      return w(r, u(B, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var n = yl();
              return D(() => g(n, "x2", -e())), n;
            })(),
            (() => {
              var n = wl();
              return D(() => g(n, "x2", e())), n;
            })()
          ];
        }
      })), D(() => g(r, "transform", xl(t.regularDoor))), r;
    })();
  }
  var Sl = m("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), Ll = m("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), At = m("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), Tl = m("<svg><g class=locked-door></svg>", false, true, false);
  function Pl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function El(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function jl([t, e], r, n) {
    const o = t(), _ = r.locked_doors_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.locked_door_x(s),
        y: r.locked_door_y(s),
        deg: r.locked_door_deg(s),
        animProgress: r.locked_door_anim_progress(s, n)
      };
      c && Pl(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function cr(t) {
    return u(z, {
      get each() {
        return t.lockedDoors();
      },
      children: (e) => u(Nl, {
        lockedDoor: e
      })
    });
  }
  const Al = 1, Cl = 12 - Al;
  function Nl(t) {
    function e() {
      let o = t.lockedDoor().animProgress;
      return o = Math.min(Math.max(2 * o, 0), 1), 4.5 + 4 * o;
    }
    function r() {
      let o = t.lockedDoor().animProgress;
      return o = Math.min(Math.max(2 * o, 0), 1), 0 + 10 * o;
    }
    function n() {
      let o = t.lockedDoor().animProgress;
      return o = Math.min(Math.max((o - 0.4) / 0.6, 0), 1), 0 + (Cl - 0) * o;
    }
    return (() => {
      var o = Tl();
      return w(o, u(B, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var _ = Sl();
              return D(() => g(_, "x2", -n())), _;
            })(),
            (() => {
              var _ = Ll();
              return D(() => g(_, "x2", n())), _;
            })()
          ];
        }
      }), null), w(o, u(B, {
        get when() {
          return t.lockedDoor().animProgress < 0.5;
        },
        get children() {
          return [
            (() => {
              var _ = At();
              return D((i) => {
                var s = e(), c = r();
                return s !== i.e && g(_, "x1", i.e = s), c !== i.t && g(_, "x2", i.t = c), i;
              }, {
                e: void 0,
                t: void 0
              }), _;
            })(),
            (() => {
              var _ = At();
              return D((i) => {
                var s = -e(), c = -r();
                return s !== i.e && g(_, "x1", i.e = s), c !== i.t && g(_, "x2", i.t = c), i;
              }, {
                e: void 0,
                t: void 0
              }), _;
            })()
          ];
        }
      }), null), D(() => g(o, "transform", El(t.lockedDoor))), o;
    })();
  }
  var Ml = m("<svg><use></svg>", false, true, false), Bl = m("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), Il = m("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function Ol(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function Rl(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Kl([t, e], r) {
    const n = t(), o = r.locked_doors_len(), _ = [];
    for (let i = 0; i < o; i++) {
      const s = n.at(i), c = {
        x: r.locked_switch_x(i),
        y: r.locked_switch_y(i),
        wasTouched: r.locked_door_anim_progress(i, 1) >= 0
      };
      s && Ol(s, c) ? _.push(s) : _.push(c);
    }
    e(_);
  }
  function dr(t) {
    return u(z, {
      get each() {
        return t.lockedSwitches();
      },
      children: (e) => (() => {
        var r = Ml();
        return D((n) => {
          var o = e().wasTouched ? "#locked-switch-touched" : "#locked-switch", _ = Rl(e);
          return o !== n.e && g(r, "href", n.e = o), _ !== n.t && g(r, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function ur() {
    return [
      (() => {
        var t = Bl(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = Il(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var Gl = m("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), Ct = m("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), Hl = m("<svg><g></svg>", false, true, false);
  function zl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Vl(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Ul([t, e], r, n) {
    const o = t(), _ = r.trap_doors_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.trap_door_x(s),
        y: r.trap_door_y(s),
        deg: r.trap_door_deg(s),
        animProgress: r.trap_door_anim_progress(s, n)
      };
      c && zl(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function pr(t) {
    return u(z, {
      get each() {
        return t.trapDoors();
      },
      children: (e) => u(Wl, {
        trapDoor: e
      })
    });
  }
  const ql = 1, Fl = 12 - ql;
  function Wl(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function n() {
      let o = t.trapDoor().animProgress;
      return 0 + (Fl - 0) * o;
    }
    return (() => {
      var o = Hl();
      return w(o, u(B, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var _ = Gl();
              return D((i) => {
                var s = -n(), c = n();
                return s !== i.e && g(_, "x1", i.e = s), c !== i.t && g(_, "x2", i.t = c), i;
              }, {
                e: void 0,
                t: void 0
              }), _;
            })(),
            (() => {
              var _ = Ct();
              return D((i) => {
                var s = e(), c = r();
                return s !== i.e && g(_, "x1", i.e = s), c !== i.t && g(_, "x2", i.t = c), i;
              }, {
                e: void 0,
                t: void 0
              }), _;
            })(),
            (() => {
              var _ = Ct();
              return D((i) => {
                var s = -e(), c = -r();
                return s !== i.e && g(_, "x1", i.e = s), c !== i.t && g(_, "x2", i.t = c), i;
              }, {
                e: void 0,
                t: void 0
              }), _;
            })()
          ];
        }
      })), D(() => g(o, "transform", Vl(t.trapDoor))), o;
    })();
  }
  var Zl = m("<svg><use></svg>", false, true, false), Yl = m("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), Xl = m("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function Jl(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function Ql(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function ea([t, e], r) {
    const n = t(), o = r.trap_doors_len(), _ = [];
    for (let i = 0; i < o; i++) {
      const s = n.at(i), c = {
        x: r.trap_switch_x(i),
        y: r.trap_switch_y(i),
        wasTouched: r.trap_door_anim_progress(i, 1) >= 0
      };
      s && Jl(s, c) ? _.push(s) : _.push(c);
    }
    e(_);
  }
  function hr(t) {
    return u(z, {
      get each() {
        return t.trapSwitches();
      },
      children: (e) => (() => {
        var r = Zl();
        return D((n) => {
          var o = e().wasTouched ? "#trap-switch-touched" : "#trap-switch", _ = Ql(e);
          return o !== n.e && g(r, "href", n.e = o), _ !== n.t && g(r, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function gr() {
    return [
      (() => {
        var t = Yl();
        return t.firstChild, t;
      })(),
      (() => {
        var t = Xl(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var ta = m("<svg><g><rect fill=var(--launch-pad-long) x=0 y=-7.5 width=1.5 height=15></rect><line stroke=var(--launch-pad-short) stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function ra(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function na(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function sa([t, e], r) {
    const n = t(), o = r.launch_pads_len(), _ = [];
    for (let i = 0; i < o; i++) {
      const s = n.at(i), c = {
        x: r.launch_pad_x(i),
        y: r.launch_pad_y(i),
        deg: r.launch_pad_deg(i)
      };
      s && ra(s, c) ? _.push(s) : _.push(c);
    }
    e(_);
  }
  function fr(t) {
    return u(z, {
      get each() {
        return t.launchPads();
      },
      children: (e) => u(oa, {
        launchPad: e
      })
    });
  }
  function oa(t) {
    return (() => {
      var e = ta(), r = e.firstChild;
      return r.nextSibling, D(() => g(e, "transform", na(t.launchPad))), e;
    })();
  }
  var ia = m('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function _a(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function la(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function aa([t, e], r, n) {
    const o = t(), _ = r.floor_guards_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.floor_guard_x(s, n),
        y: r.floor_guard_y(s, n),
        deg: r.floor_guard_deg(s)
      };
      c && _a(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function yr(t) {
    return u(z, {
      get each() {
        return t.floorGuards();
      },
      children: (e) => u(ca, {
        floorGuard: e
      })
    });
  }
  function ca(t) {
    return (() => {
      var e = ia();
      return e.firstChild, D(() => g(e, "transform", la(t.floorGuard))), e;
    })();
  }
  var da = m("<svg><use href=#bounceblock></svg>", false, true, false), ua = m('<svg><g id=bounceblock><path fill=var(--bounceblock-interior) d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path stroke=var(--bounceblock-border) d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function pa(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function ha(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function ga([t, e], r, n) {
    const o = t(), _ = r.bounce_blocks_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.bounce_block_x(s, n),
        y: r.bounce_block_y(s, n),
        deg: r.bounce_block_deg(s)
      };
      c && pa(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function wr(t) {
    return u(z, {
      get each() {
        return t.bounceBlocks();
      },
      children: (e) => (() => {
        var r = da();
        return D(() => g(r, "transform", ha(e))), r;
      })()
    });
  }
  function mr() {
    return (() => {
      var t = ua(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var fa = m("<svg><use href=#boostpad></svg>", false, true, false), ya = m("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function wa(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function ma(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function ba([t, e], r, n) {
    const o = t(), _ = r.boost_pads_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.boost_pad_x(s),
        y: r.boost_pad_y(s),
        deg: r.boost_pad_deg(s, n),
        animProgress: r.boost_pad_anim_progress(s, n)
      };
      c && wa(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function br(t) {
    return u(z, {
      get each() {
        return t.boostPads();
      },
      children: (e) => (() => {
        var r = fa();
        return D((n) => {
          var o = `color-mix(in srgb-linear, var(--boost-pad) ${e().animProgress * 100}%, var(--boost-pad-wooshing))`, _ = ma(e);
          return o !== n.e && g(r, "stroke", n.e = o), _ !== n.t && g(r, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function xr() {
    return (() => {
      var t = ya(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, o = n.nextSibling;
      return o.nextSibling, t;
    })();
  }
  var xa = m("<svg><use href=#thwump></svg>", false, true, false), va = m('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function $a(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function ka(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Da([t, e], r, n) {
    const o = t(), _ = r.thwumps_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.thwump_x(s, n),
        y: r.thwump_y(s, n),
        deg: r.thwump_deg(s)
      };
      c && $a(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function vr(t) {
    return u(z, {
      get each() {
        return t.thwumps();
      },
      children: (e) => (() => {
        var r = xa();
        return D(() => g(r, "transform", ka(e))), r;
      })()
    });
  }
  function $r() {
    return (() => {
      var t = va(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Sa = m("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), La = m("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function Ta(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function Pa(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Ea([t, e], r, n) {
    const o = t(), _ = r.shove_thwumps_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.shove_thwump_x(s, n),
        y: r.shove_thwump_y(s, n),
        deg: r.shove_thwump_deg(s),
        touch: r.shove_thwump_touch(s)
      };
      c && Ta(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function kr(t) {
    return u(z, {
      get each() {
        return t.shoveThwumps();
      },
      children: (e) => u(ja, {
        shoveThwump: e
      })
    });
  }
  function ja(t) {
    return (() => {
      var e = Sa(), r = e.firstChild;
      return w(e, u(xt, {
        each: [
          0,
          2,
          4,
          6
        ],
        children: (n) => u(B, {
          get when() {
            return t.shoveThwump().touch >= 16 || n === t.shoveThwump().touch;
          },
          get children() {
            var o = La(), _ = o.firstChild, i = _.nextSibling;
            return i.nextSibling, g(o, "transform", `rotate(${45 * n},0,0)`), o;
          }
        })
      }), r), D(() => g(e, "transform", Pa(t.shoveThwump))), e;
    })();
  }
  const Dr = Sr((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function Aa(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (n) => n.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function Ca(t) {
    const e = String.fromCharCode(...t);
    console.log("anim data length", t.byteLength), localStorage.setItem("animData", e);
  }
  function Na(t) {
    const e = localStorage.getItem("animData");
    if (e) {
      const r = Uint8Array.from(e, (n) => n.charCodeAt(0));
      t.set_anim_data(r);
    }
  }
  const Ma = Sr(Ba, 1e3);
  function Ba(t) {
    const e = JSON.stringify(t);
    localStorage.setItem("palette", e);
  }
  function Ia() {
    const t = localStorage.getItem("palette");
    if (t) try {
      const e = JSON.parse(t);
      if (typeof (e == null ? void 0 : e.name) == "string" && typeof (e == null ? void 0 : e.colors) == "object") return e;
    } catch {
      return;
    }
  }
  function Sr(t, e) {
    let r;
    return (...n) => {
      typeof r == "number" && clearTimeout(r), r = setTimeout(() => t(...n), e);
    };
  }
  const Oa = "" + new URL("palette-CZVUb4uS.png", import.meta.url).href, Lr = [
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
  ], Nt = [
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
  ], Mt = {
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
  }, Ra = {
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
  }, Ka = (() => {
    const t = {};
    for (const e of Nt) {
      t[e] = 0;
      for (const r of Nt) Mt[r] < Mt[e] && (t[e] += Ra[r]);
    }
    return t;
  })(), Tr = [
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
  ], Ga = {
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
  let Pr;
  async function Ha() {
    const e = await (await fetch(Oa)).blob(), r = await createImageBitmap(e), n = document.createElement("canvas");
    n.width = r.width, n.height = r.height;
    const o = n.getContext("2d");
    o.drawImage(r, 0, 0), Pr = o;
  }
  function Er(t) {
    const e = Pr, r = Lr.indexOf(t);
    if (!e || r < 0) return;
    const n = {};
    for (const o of Tr) {
      const { file: _, index: i } = Ga[o], s = Ka[_] + i, c = e.getImageData(s, r, 1, 1).data, p = `rgb(${c[0]} ${c[1]} ${c[2]})`;
      n[o] = p;
    }
    return n;
  }
  function za(t) {
    for (const e of Tr) document.body.style.setProperty(e, t[e]);
  }
  var Va = m('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label>/<label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>attract<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox></label> | Object corners <select><option>square</option><option>rounded</option></select> | <label>Friction mod <input type=checkbox></label> | <select></select><input type=text style=float:right>'), Ua = m("<option>");
  function qa(t) {
    return (() => {
      var e = Va(), r = e.firstChild, n = r.firstChild, o = n.nextSibling, _ = r.nextSibling, i = _.nextSibling, s = i.firstChild, c = s.nextSibling, p = i.nextSibling, b = p.nextSibling, f = b.nextSibling, C = f.nextSibling, E = C.firstChild, O = E.nextSibling, R = C.nextSibling, V = R.nextSibling, G = V.firstChild, j = G.nextSibling, M = V.nextSibling, I = M.nextSibling, K = I.firstChild, Z = K.nextSibling, re = I.nextSibling, Q = re.nextSibling, oe = Q.nextSibling;
      return o.addEventListener("change", function() {
        const L = this.files;
        if (L && L.length > 0) {
          const k = new FileReader();
          k.onloadend = () => {
            k.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(k.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, k.readAsArrayBuffer(L[0]);
        }
      }), c.addEventListener("change", function() {
        const L = this.files;
        if (L && L.length > 0) {
          const k = new FileReader();
          k.onloadend = () => {
            if (k.result instanceof ArrayBuffer) {
              const A = t.editor.load_attract(new Uint8Array(k.result), t.roundCorners(), t.dynamicFriction());
              t.render(true), t.setLevelName(t.editor.get_level_name()), t.setReplay(A);
            }
          }, k.readAsArrayBuffer(L[0]);
        }
      }), b.$$click = function() {
        const L = t.editor.export_map(), k = new Blob([
          L.buffer
        ], {
          type: "application/octet-stream"
        }), A = URL.createObjectURL(k);
        this.href = A, this.download = t.editor.get_level_name().replaceAll(/[^a-z]/gi, "_"), setTimeout(() => URL.revokeObjectURL(A), 100);
      }, O.addEventListener("change", (L) => {
        t.setShowTrail(L.currentTarget.checked), t.editor.set_show_trail(L.currentTarget.checked);
      }), V.addEventListener("change", (L) => t.setRoundCorners(L.currentTarget.value == "rounded")), Z.addEventListener("change", (L) => {
        t.setDynamicFriction(L.currentTarget.checked);
      }), Q.addEventListener("change", (L) => {
        const k = Er(L.currentTarget.value);
        k && t.setPalette({
          name: L.currentTarget.value,
          colors: k
        });
      }), w(Q, () => Lr.map((L) => (() => {
        var k = Ua();
        return w(k, L), D(() => {
          var _a2;
          return k.selected = L === (((_a2 = t.palette()) == null ? void 0 : _a2.name) ?? "vasquez");
        }), k;
      })())), oe.addEventListener("change", () => Dr(t.editor)), oe.$$input = (L) => {
        t.editor.set_level_name(L.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, D((L) => {
        var k = !t.roundCorners(), A = t.roundCorners();
        return k !== L.e && (G.selected = L.e = k), A !== L.t && (j.selected = L.t = A), L;
      }, {
        e: void 0,
        t: void 0
      }), D(() => O.checked = t.showTrail()), D(() => Z.checked = t.dynamicFriction()), D(() => oe.value = t.levelName()), e;
    })();
  }
  st([
    "click",
    "input"
  ]);
  var Fa = m("<svg><use href=#zapdrone></svg>", false, true, false), Wa = m('<svg><g id=zapdrone><path fill=var(--zap-drone-background) stroke=var(--zap-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--zap-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--zap-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false), Za = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 1 12 12 a 12 12 0 0 1 -12 12 l 5 -5 m 0 10 l -5 -5"></svg>', false, true, false), Ya = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 0 12 -12 a 12 12 0 0 0 -12 -12 l 5 5 m 0 -10 l -5 5"></svg>', false, true, false), Xa = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V 24 l -5 -5 m 10 0 l -5 5"></svg>', false, true, false), Ja = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V -24 l -5 5 m 10 0 l -5 -5"></svg>', false, true, false), Qa = m("<svg><g></svg>", false, true, false);
  function ec(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function tc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function rc([t, e], r, n) {
    const o = t(), _ = r.zap_drones_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.zap_drone_x(s, n),
        y: r.zap_drone_y(s, n),
        deg: r.zap_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && ec(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function jr(t) {
    return u(z, {
      get each() {
        return t.zapDrones();
      },
      children: (e) => (() => {
        var r = Fa();
        return D(() => g(r, "transform", tc(e))), r;
      })()
    });
  }
  function Ar() {
    return (() => {
      var t = Wa(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  function nc({ entities: t }) {
    const e = () => t.zapDrones().at(0) ?? t.chaseDrones().at(0) ?? t.chaingunDrones().at(0) ?? t.laserDrones().at(0), r = (n) => {
      const o = n();
      if (o) {
        const { x: _, y: i, deg: s } = o;
        return `translate(${_},${i}) rotate(${s},0,0)`;
      } else return "";
    };
    return (() => {
      var n = Qa();
      return w(n, u(B, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 0;
        },
        get children() {
          return Za();
        }
      }), null), w(n, u(B, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 1;
        },
        get children() {
          return Ya();
        }
      }), null), w(n, u(B, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 2;
        },
        get children() {
          return Xa();
        }
      }), null), w(n, u(B, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 3;
        },
        get children() {
          return Ja();
        }
      }), null), D(() => g(n, "transform", r(e))), n;
    })();
  }
  var sc = m("<svg><use href=#chaingundrone></svg>", false, true, false), oc = m('<svg><g id=chaingundrone><path fill=var(--chaingun-drone-background) stroke=var(--chaingun-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chaingun-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--chaingun-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function ic(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function _c(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function lc([t, e], r, n) {
    const o = t(), _ = r.chaingun_drones_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.chaingun_drone_x(s, n),
        y: r.chaingun_drone_y(s, n),
        deg: r.chaingun_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && ic(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function Cr(t) {
    return u(z, {
      get each() {
        return t.chaingunDrones();
      },
      children: (e) => (() => {
        var r = sc();
        return D(() => g(r, "transform", _c(e))), r;
      })()
    });
  }
  function Nr() {
    return (() => {
      var t = oc(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var ac = m("<svg><use href=#bat></svg>", false, true, false), cc = m("<svg><circle id=bat r=5 cx=0 cy=0 fill=var(--bat-body)></svg>", false, true, false);
  function dc(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function uc(t) {
    return u(z, {
      get each() {
        return t.bats();
      },
      children: (e) => (() => {
        var r = ac();
        return D(() => g(r, "transform", dc(e))), r;
      })()
    });
  }
  function pc() {
    return cc();
  }
  var hc = m("<svg><use href=#laserdrone></svg>", false, true, false), gc = m('<svg><g id=laserdrone><path fill=none stroke=var(--laser-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--laser-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--laser-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function fc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function yc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function wc([t, e], r, n) {
    const o = t(), _ = r.laser_drones_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.laser_drone_x(s, n),
        y: r.laser_drone_y(s, n),
        deg: r.laser_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && fc(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function Mr(t) {
    return u(z, {
      get each() {
        return t.laserDrones();
      },
      children: (e) => (() => {
        var r = hc();
        return D(() => g(r, "transform", yc(e))), r;
      })()
    });
  }
  function Br() {
    return (() => {
      var t = gc(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var mc = m("<svg><use href=#chasedrone></svg>", false, true, false), bc = m('<svg><g id=chasedrone><path fill=var(--chase-drone-background) stroke=var(--chase-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chase-drone-border) d="M 10 -3 H 3 A 3 3 0 0 0 0 0 A 3 3 0 0 0 3 3 H 10 Z"></path><path fill=none stroke=var(--chase-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function xc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function vc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function $c([t, e], r, n) {
    const o = t(), _ = r.chase_drones_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.chase_drone_x(s, n),
        y: r.chase_drone_y(s, n),
        deg: r.chase_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && xc(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function Ir(t) {
    return u(z, {
      get each() {
        return t.chaseDrones();
      },
      children: (e) => (() => {
        var r = mc();
        return D(() => g(r, "transform", vc(e))), r;
      })()
    });
  }
  function Or() {
    return (() => {
      var t = bc(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var kc = m("<svg><use href=#gold></svg>", false, true, false), Dc = m("<svg><g id=gold><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--gold-exterior) r=2.727272727272727></circle><circle fill=var(--gold-interior) r=1.9090909090909092></svg>", false, true, false);
  function Sc(t, e) {
    return t.x === e.x && t.y === e.y && t.collected === e.collected;
  }
  function Lc(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Tc([t, e], r) {
    const n = t(), o = r.golds_len(), _ = [];
    for (let i = 0; i < o; i++) {
      const s = n.at(i), c = {
        x: r.gold_x(i),
        y: r.gold_y(i),
        collected: r.gold_collected(i)
      };
      s && Sc(s, c) ? _.push(s) : _.push(c);
    }
    e(_);
  }
  function Rr(t) {
    return u(z, {
      get each() {
        return t.golds();
      },
      children: (e) => u(B, {
        get when() {
          return !e().collected;
        },
        get children() {
          var r = kc();
          return D(() => g(r, "transform", Lc(e))), r;
        }
      })
    });
  }
  function Kr() {
    return (() => {
      var t = Dc(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, o = n.nextSibling, _ = o.nextSibling;
      return _.nextSibling, t;
    })();
  }
  var Pc = m("<svg><use href=#deathball></svg>", false, true, false), Ec = m('<svg><g id=deathball><path d="M -7 0 A 7 7 0 0 0 0 7 A 7 7 0 0 0 7 0 A 7 7 0 0 0 0 -7"stroke=var(--deathball-outer) stroke-width=2 fill=none stroke-linecap=round></path><path d="M 0 -4 A 4 4 0 0 0 -4 0 A 4 4 0 0 0 0 4 A 4 4 0 0 0 4 0"stroke=var(--deathball-middle) stroke-width=3 fill=none stroke-linecap=round></path><circle r=2 cx=0 cy=0 fill=var(--deathball-inner)></svg>', false, true, false);
  function jc(t, e) {
    return t.x === e.x && t.y === e.y;
  }
  function Ac(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r}) rotate(45)`;
  }
  function Cc([t, e], r, n) {
    const o = t(), _ = r.deathballs_len(), i = [];
    for (let s = 0; s < _; s++) {
      const c = o.at(s), p = {
        x: r.deathball_x(s, n),
        y: r.deathball_y(s, n)
      };
      c && jc(c, p) ? i.push(c) : i.push(p);
    }
    e(i);
  }
  function Gr(t) {
    return u(z, {
      get each() {
        return t.deathballs();
      },
      children: (e) => (() => {
        var r = Pc();
        return D(() => g(r, "transform", Ac(e))), r;
      })()
    });
  }
  function Hr() {
    return Ec();
  }
  var Nc = m('<svg><rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"width=150 height=150 style=mix-blend-mode:hard-light></svg>', false, true, false), Mc = m("<svg><circle fill=none stroke=var(--entity-palette-reticle) r=16></svg>", false, true, false), Bc = m('<svg><path d="M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12"fill-rule=evenodd fill="color-mix(in srgb,var(--background) 18%,white 15%)"style=mix-blend-mode:hard-light></svg>', false, true, false), Ic = m("<svg><rect fill=none stroke=var(--editor-crosshair) stroke-width=2 width=26 height=26></svg>", false, true, false), Oc = m("<svg><use href=#tilemode-crosshair></svg>", false, true, false), Rc = m("<svg><use href=#crosshair></svg>", false, true, false), Kc = m("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), Gc = m('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none>'), Bt = m("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), It = m("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), Hc = m("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), zc = m("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), Vc = m("<svg><line class=door-switch-line></svg>", false, true, false);
  const pt = 42, ht = 23, Ot = 0, Rt = 1, Uc = 3, qc = 4, gt = 5, Kt = 6, Gt = 7, Fc = 8, ft = 9, Wc = 0, Zc = 1, Yc = 2, Xc = 3, Jc = 5, Qc = 6, ed = 8, td = 10, rd = 11, nd = 12, sd = 13, od = 14, id = 15, _d = 16, ld = 17, ad = 20, cd = 21, dd = 24, ud = 25, pd = 27, hd = 28, gd = new Float64Array([
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
  ]), fd = new Float64Array([
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
  ]), Ht = 150;
  function zt() {
    const [t, e] = y([]), [r, n] = y([]), [o, _] = y([]), [i, s] = y([]), [c, p] = y([]), [b, f] = y([]), [C, E] = y([]), [O, R] = y([]), [V, G] = y([]), [j, M] = y([]), [I, K] = y([]), [Z, re] = y([]), [Q, oe] = y([]), [L, k] = y([]), [A, _e] = y([]), [ne, ge] = y([]), [de, Y] = y([]), [T, X] = y([]), [se, ue] = y([]), [le, fe] = y([]), [d, h] = y([]), [Te, q] = y([]), [ae, ye] = y([]);
    return {
      ninjas: t,
      setNinjas: e,
      mines: r,
      setMines: n,
      golds: o,
      setGolds: _,
      exitDoors: i,
      setExitDoors: s,
      exitSwitches: c,
      setExitSwitches: p,
      regularDoors: b,
      setRegularDoors: f,
      lockedDoors: C,
      setLockedDoors: E,
      lockedSwitches: O,
      setLockedSwitches: R,
      trapDoors: V,
      setTrapDoors: G,
      trapSwitches: j,
      setTrapSwitches: M,
      launchPads: I,
      setLaunchPads: K,
      oneWays: Z,
      setOneWays: re,
      chaingunDrones: Q,
      setChaingunDrones: oe,
      laserDrones: L,
      setLaserDrones: k,
      zapDrones: A,
      setZapDrones: _e,
      chaseDrones: ne,
      setChaseDrones: ge,
      floorGuards: de,
      setFloorGuards: Y,
      bounceBlocks: T,
      setBounceBlocks: X,
      thwumps: se,
      setThwumps: ue,
      boostPads: le,
      setBoostPads: fe,
      deathballs: d,
      setDeathballs: h,
      bats: Te,
      setBats: q,
      shoveThwumps: ae,
      setShoveThwumps: ye
    };
  }
  function Vt(t, e, r, n) {
    const o = [], _ = [], i = [], s = [], c = [], p = [], b = [], f = [], C = [], E = [], O = [], R = [], V = [], G = [], j = [], M = [], I = [], K = [], Z = [], re = [], Q = [], oe = [], L = [];
    for (const k of r) {
      const A = {
        x: k.x,
        y: k.y,
        deg: k.deg,
        mode: k.mode,
        animProgress: 0
      }, _e = {
        x: k.switch_x,
        y: k.switch_y,
        animProgress: 0,
        wasTouched: false
      }, ne = {
        x1: k.x,
        y1: k.y,
        x2: k.switch_x,
        y2: k.switch_y
      };
      k.type_int === Wc ? o.push(A) : k.type_int === Zc ? _.push({
        ...A,
        type: ul
      }) : k.type_int === cd ? _.push({
        ...A,
        type: pl
      }) : k.type_int === Yc ? i.push({
        ...A,
        collected: false
      }) : k.type_int === Xc ? (s.push(A), Number.isNaN(k.switch_x) || (c.push(_e), e.push(ne))) : k.type_int === Jc ? p.push(A) : k.type_int === Qc ? (b.push(A), Number.isNaN(k.switch_x) || (f.push(_e), e.push(ne))) : k.type_int === ed ? (C.push({
        ...A,
        animProgress: n ? 1 : -1
      }), Number.isNaN(k.switch_x) || (E.push(_e), e.push(ne))) : k.type_int === td ? O.push(A) : k.type_int === rd ? R.push(A) : k.type_int === nd ? V.push(A) : k.type_int === sd ? G.push(A) : k.type_int === od ? j.push(A) : k.type_int === id ? M.push(A) : k.type_int === _d ? I.push(A) : k.type_int === ld ? K.push(A) : k.type_int === ad ? Z.push(A) : k.type_int === dd ? re.push({
        ...A,
        animProgress: 1
      }) : k.type_int === ud ? Q.push(A) : k.type_int === pd ? oe.push(A) : k.type_int === hd && L.push({
        ...A,
        touch: 16
      }), k.free();
    }
    t.setNinjas(o), t.setMines(_), t.setGolds(i), t.setExitDoors(s), t.setExitSwitches(c), t.setRegularDoors(p), t.setLockedDoors(b), t.setLockedSwitches(f), t.setTrapDoors(C), t.setTrapSwitches(E), t.setLaunchPads(O), t.setOneWays(R), t.setChaingunDrones(V), t.setLaserDrones(G), t.setZapDrones(j), t.setChaseDrones(M), t.setFloorGuards(I), t.setBounceBlocks(K), t.setThwumps(Z), t.setBoostPads(re), t.setDeathballs(Q), t.setBats(oe), t.setShoveThwumps(L);
  }
  function Ut({ entities: t }) {
    return [
      u(pr, {
        get trapDoors() {
          return t.trapDoors;
        }
      }),
      u(cr, {
        get lockedDoors() {
          return t.lockedDoors;
        }
      }),
      u(dr, {
        get lockedSwitches() {
          return t.lockedSwitches;
        }
      }),
      u(hr, {
        get trapSwitches() {
          return t.trapSwitches;
        }
      }),
      u(nr, {
        get exitDoors() {
          return t.exitDoors;
        }
      }),
      u(or, {
        get oneWays() {
          return t.oneWays;
        }
      }),
      u(_r, {
        get mines() {
          return t.mines;
        }
      }),
      u(Rr, {
        get golds() {
          return t.golds;
        }
      }),
      u(sr, {
        get exitSwitches() {
          return t.exitSwitches;
        }
      }),
      u(ar, {
        get regularDoors() {
          return t.regularDoors;
        }
      }),
      u(fr, {
        get launchPads() {
          return t.launchPads;
        }
      }),
      u(Mr, {
        get laserDrones() {
          return t.laserDrones;
        }
      }),
      u(Cr, {
        get chaingunDrones() {
          return t.chaingunDrones;
        }
      }),
      u(jr, {
        get zapDrones() {
          return t.zapDrones;
        }
      }),
      u(Ir, {
        get chaseDrones() {
          return t.chaseDrones;
        }
      }),
      u(yr, {
        get floorGuards() {
          return t.floorGuards;
        }
      }),
      u(uc, {
        get bats() {
          return t.bats;
        }
      }),
      u(Gr, {
        get deathballs() {
          return t.deathballs;
        }
      }),
      u(vr, {
        get thwumps() {
          return t.thwumps;
        }
      }),
      u(xt, {
        get each() {
          return t.ninjas();
        },
        children: (e) => u(Ge, {
          class: "ninja",
          ninja: () => e,
          bones: () => gd
        })
      }),
      u(wr, {
        get bounceBlocks() {
          return t.bounceBlocks;
        }
      }),
      u(kr, {
        get shoveThwumps() {
          return t.shoveThwumps;
        }
      }),
      u(br, {
        get boostPads() {
          return t.boostPads;
        }
      })
    ];
  }
  function yd(t) {
    const { editor: e, pastNinjas: r } = t, [n, o] = y(""), [_, i] = y(""), [s, c] = y(true), [p, b] = y(false), [f, C] = y(Ot), [E, O] = y({
      row: 1,
      col: 1
    }), [R, V] = y({
      x: 24,
      y: 24
    }), [G, j] = y(""), [M, I] = y({
      x: NaN,
      y: NaN
    }), [K, Z] = y({
      x: NaN,
      y: NaN
    }), re = zt(), Q = zt(), [oe, L] = y([]), [k, A] = y(e.get_show_trail()), [_e, ne] = y(), ge = (d) => {
      let h = false;
      if (!(d.target instanceof HTMLInputElement || d.target instanceof HTMLSelectElement)) {
        if (d.ctrlKey || d.metaKey) {
          d.code === "KeyZ" && (d.ctrlKey || d.metaKey) && d.shiftKey ? (h = true, e.redo()) : d.code === "KeyZ" && (d.ctrlKey || d.metaKey) ? (h = true, e.undo()) : d.code === "KeyY" && (d.ctrlKey || d.metaKey) && (h = true, e.redo()), h && (Y(true), d.preventDefault());
          return;
        }
        d.shiftKey && (h = true, e.press_shift()), d.code === "Enter" && e.mode() === ft ? t.setReplay(e.to_replay(t.roundCorners(), t.dynamicFriction())) : d.code === "Backquote" ? (h = true, e.press_backtick()) : d.code === "Digit1" ? (h = true, e.press_1(d.shiftKey)) : d.code === "Digit2" ? (h = true, e.press_2(d.shiftKey)) : d.code === "Digit3" ? (h = true, e.press_3(d.shiftKey)) : d.code === "Digit4" ? (h = true, e.press_4(d.shiftKey)) : d.code === "Digit5" ? (h = true, e.press_5(d.shiftKey)) : d.code === "Digit6" ? (h = true, e.press_6(d.shiftKey)) : d.code === "Digit7" ? (h = true, e.press_7(d.shiftKey)) : d.code === "Digit8" ? (h = true, e.press_8(d.shiftKey)) : d.code === "Digit9" ? (h = true, e.press_9()) : d.code === "Digit0" ? (h = true, e.press_0()) : d.code === "Minus" ? (h = true, e.press_dash()) : d.code === "Equal" ? (h = true, e.press_equals()) : d.code === "KeyQ" ? (h = true, e.press_q(d.shiftKey)) : d.code === "KeyW" ? (h = true, e.press_w(d.shiftKey)) : d.code === "KeyA" ? (h = true, e.press_a(d.shiftKey)) : d.code === "KeyS" ? (h = true, e.press_s(d.shiftKey)) : d.code === "KeyE" ? (h = true, e.press_e()) : d.code === "KeyD" ? (h = true, e.press_d()) : d.code === "KeyZ" ? (h = true, e.press_z()) : d.code === "KeyX" ? (h = true, e.press_x()) : d.code === "KeyC" ? (h = true, e.press_c()) : d.code === "Space" ? (h = true, e.press_space()) : d.code === "AltLeft" ? (h = true, e.press_alt_left(d.shiftKey)) : d.code === "KeyR" ? (h = true, e.press_r()) : d.code === "KeyT" ? (h = true, e.press_t()) : d.code === "KeyY" ? (h = true, e.press_y()) : d.code === "KeyU" ? (h = true, e.press_u()) : d.code === "KeyI" ? (h = true, e.press_i()) : d.code === "KeyO" ? (h = true, e.press_o()) : d.code === "KeyP" ? (h = true, e.press_p()) : d.code === "BracketLeft" ? (h = true, e.press_bracket_left()) : d.code === "BracketRight" ? (h = true, e.press_bracket_right()) : d.code === "KeyF" ? (h = true, e.press_f()) : d.code === "KeyH" ? (h = true, e.press_h()) : d.code === "KeyJ" ? (h = true, e.press_j()) : d.code === "KeyK" ? (h = true, e.press_k()) : d.code === "KeyL" ? (h = true, e.press_l()) : d.code === "KeyN" ? (h = true, e.press_n()) : d.code === "KeyM" ? (h = true, e.press_m()) : d.code === "Comma" ? (h = true, e.press_comma()) : d.code === "ArrowUp" ? (h = true, e.press_up(d.shiftKey)) : d.code === "ArrowDown" ? (h = true, e.press_down(d.shiftKey)) : d.code === "ArrowLeft" ? (h = true, e.press_left(d.shiftKey)) : d.code === "ArrowRight" ? (h = true, e.press_right(d.shiftKey)) : d.code === "Enter" ? (h = true, e.press_enter()) : d.code === "Escape" ? h = e.press_escape() : d.code === "Slash" && (h = true, e.press_slash()), h && (Y(true), d.preventDefault());
      }
    }, de = (d) => {
      let h = false;
      d.shiftKey || (h = true, e.release_shift()), d.code === "KeyQ" ? (h = true, e.release_q()) : d.code === "KeyW" ? (h = true, e.release_w()) : d.code === "KeyA" ? (h = true, e.release_a()) : d.code === "KeyS" ? (h = true, e.release_s()) : d.code === "KeyE" ? (h = true, e.release_e()) : d.code === "KeyD" ? (h = true, e.release_d()) : d.code === "KeyZ" ? (h = true, e.release_z()) : d.code === "KeyC" ? (h = true, e.release_c()) : d.code === "Space" ? (h = true, e.release_space()) : d.code === "AltLeft" && (h = true, e.release_alt_left()), h && (Y(false), d.preventDefault());
    };
    document.addEventListener("keydown", ge), document.addEventListener("keyup", de), Se(() => {
      document.removeEventListener("keydown", ge), document.removeEventListener("keyup", de);
    });
    function Y(d) {
      C(e.mode()), o(e.tiles_path()), i(e.selected_tiles_path()), O({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), b(e.show_quarter_grid()), V({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const h = [];
      Vt(re, h, e.entities(), false), Vt(Q, h, e.preview_entities(), true), L(h), j(e.selected_tile_outline_path()), I({
        x: e.palette_center_x(),
        y: e.palette_center_y()
      }), Z({
        x: e.palette_selection_x(),
        y: e.palette_selection_y()
      }), ne(e.past_ninja_bones()), d && Dr(e);
    }
    const T = [];
    for (let d = 0; d < pt - 1; d++) T.push(48 + 24 * d);
    const X = [];
    for (let d = 0; d < ht - 1; d++) X.push(48 + 24 * d);
    const se = [];
    for (let d = 0; d < pt; d++) se.push(36 + 24 * d);
    const ue = [];
    for (let d = 0; d < ht; d++) ue.push(36 + 24 * d);
    const le = [];
    for (let d = 0; d < pt * 2; d++) le.push(30 + 12 * d);
    const fe = [];
    for (let d = 0; d < ht * 2; d++) fe.push(30 + 12 * d);
    return Y(false), [
      (() => {
        var d = Gc(), h = d.firstChild, Te = h.firstChild, q = Te.nextSibling;
        q.nextSibling;
        var ae = h.nextSibling, ye = ae.nextSibling, xe = ye.nextSibling, Pe = xe.nextSibling, ot = Pe.firstChild;
        return d.$$contextmenu = (x) => {
          e.press_escape() && (Y(false), x.preventDefault());
        }, d.$$mouseup = () => {
          e.cursor_up(), Y(false);
        }, d.$$dblclick = (x) => {
          e.double_click(x.shiftKey), Y(false);
        }, d.$$mousedown = (x) => {
          x.buttons & 2 || (e.mode() === ft ? t.setReplay(e.to_replay(t.roundCorners(), t.dynamicFriction())) : (e.cursor_down(x.shiftKey), Y(true)));
        }, d.$$mousemove = function(x) {
          const { left: $, top: N, width: H, height: ie } = this.getBoundingClientRect(), Ee = e.set_cursor_pos((x.clientX - $) / H * 1056, (x.clientY - N) / ie * 600, x.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (x.clientX - $) / H * 1056,
            y: (x.clientY - N) / ie * 600
          }), Ee && Y(false);
        }, w(h, u(lr, {}), q), w(h, u(Kr, {}), q), w(h, u(ir, {}), q), w(h, u(mr, {}), q), w(h, u(ur, {}), q), w(h, u(gr, {}), q), w(h, u(xr, {}), q), w(h, u($r, {}), q), w(h, u(Nr, {}), q), w(h, u(Br, {}), q), w(h, u(Ar, {}), q), w(h, u(Or, {}), q), w(h, u(pc, {}), q), w(h, u(Hr, {}), q), w(d, u(B, {
          get when() {
            return p();
          },
          get children() {
            return [
              Ne(() => le.map((x) => (() => {
                var $ = Bt();
                return g($, "x1", x), g($, "x2", x), $;
              })())),
              Ne(() => fe.map((x) => (() => {
                var $ = It();
                return g($, "y1", x), g($, "y2", x), $;
              })()))
            ];
          }
        }), ae), w(d, u(B, {
          get when() {
            return s();
          },
          get children() {
            return [
              Ne(() => se.map((x) => (() => {
                var $ = Bt();
                return g($, "x1", x), g($, "x2", x), $;
              })())),
              Ne(() => ue.map((x) => (() => {
                var $ = It();
                return g($, "y1", x), g($, "y2", x), $;
              })()))
            ];
          }
        }), ae), w(d, () => T.map((x) => (() => {
          var $ = Hc();
          return g($, "x1", x), g($, "x2", x), $;
        })()), ae), w(d, () => X.map((x) => (() => {
          var $ = zc();
          return g($, "y1", x), g($, "y2", x), $;
        })()), ae), w(d, u(Ut, {
          entities: re
        }), ae), w(d, u(B, {
          get when() {
            return f() === Gt;
          },
          get children() {
            var x = Nc();
            return D(($) => {
              var N = M().x - Ht / 2, H = M().y - Ht / 2;
              return N !== $.e && g(x, "x", $.e = N), H !== $.t && g(x, "y", $.t = H), $;
            }, {
              e: void 0,
              t: void 0
            }), x;
          }
        }), ye), w(ye, u(Ut, {
          entities: Q
        })), w(d, u(B, {
          get when() {
            return [
              gt,
              Kt,
              qc
            ].includes(f());
          },
          get children() {
            return u(nc, {
              entities: Q
            });
          }
        }), xe), w(d, u(B, {
          get when() {
            return f() === Gt;
          },
          get children() {
            var x = Mc();
            return D(($) => {
              var N = K().x, H = K().y;
              return N !== $.e && g(x, "cx", $.e = N), H !== $.t && g(x, "cy", $.t = H), $;
            }, {
              e: void 0,
              t: void 0
            }), x;
          }
        }), xe), w(d, u(B, {
          get when() {
            return f() === Rt;
          },
          get children() {
            var x = Bc();
            return D(() => g(x, "transform", `translate(${M().x},${M().y})`)), x;
          }
        }), xe), w(d, u(B, {
          get when() {
            return f() === Rt;
          },
          get children() {
            var x = Ic();
            return D(($) => {
              var N = K().x - 13, H = K().y - 13;
              return N !== $.e && g(x, "x", $.e = N), H !== $.t && g(x, "y", $.t = H), $;
            }, {
              e: void 0,
              t: void 0
            }), x;
          }
        }), Pe), w(d, u(xt, {
          get each() {
            return oe();
          },
          children: (x) => (() => {
            var $ = Vc();
            return D((N) => {
              var H = x.x1, ie = x.y1, Ee = x.x2, Ve = x.y2;
              return H !== N.e && g($, "x1", N.e = H), ie !== N.t && g($, "y1", N.t = ie), Ee !== N.a && g($, "x2", N.a = Ee), Ve !== N.o && g($, "y2", N.o = Ve), N;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), $;
          })()
        }), Pe), w(d, u(B, {
          get when() {
            return f() === Ot;
          },
          get children() {
            var x = Oc();
            return D(($) => {
              var N = E().col * 24 + 12, H = E().row * 24 + 12;
              return N !== $.e && g(x, "x", $.e = N), H !== $.t && g(x, "y", $.t = H), $;
            }, {
              e: void 0,
              t: void 0
            }), x;
          }
        }), null), w(d, u(B, {
          get when() {
            return f() === Fc || f() === gt;
          },
          get children() {
            var x = Rc();
            return D(($) => {
              var N = R().x, H = R().y;
              return N !== $.e && g(x, "x", $.e = N), H !== $.t && g(x, "y", $.t = H), $;
            }, {
              e: void 0,
              t: void 0
            }), x;
          }
        }), null), w(d, u(B, {
          get when() {
            return f() === ft;
          },
          get children() {
            return u(Ge, {
              class: "ninja",
              ninja: () => ({
                x: R().x,
                y: R().y,
                deg: 0
              }),
              bones: () => _e() ?? fd
            });
          }
        }), null), w(d, u(B, {
          get when() {
            return k();
          },
          get children() {
            var x = Kc();
            return D(() => g(x, "points", r().map(({ x: $, y: N }) => `${$},${N}`).join(" "))), x;
          }
        }), null), D((x) => {
          var $ = n(), N = [
            Uc,
            gt,
            Kt
          ].includes(f()) ? "url(#outline)" : "", H = _(), ie = G();
          return $ !== x.e && g(ae, "d", x.e = $), N !== x.t && g(ye, "filter", x.t = N), H !== x.a && g(xe, "d", x.a = H), ie !== x.o && g(ot, "d", x.o = ie), x;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), d;
      })(),
      u(qa, {
        editor: e,
        get setReplay() {
          return t.setReplay;
        },
        render: Y,
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
        showTrail: k,
        setShowTrail: A,
        get dynamicFriction() {
          return t.dynamicFriction;
        },
        get setDynamicFriction() {
          return t.setDynamicFriction;
        }
      })
    ];
  }
  st([
    "mousemove",
    "mousedown",
    "dblclick",
    "mouseup",
    "contextmenu"
  ]);
  var wd = m("<div id=media-controls><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb></div></div><div><a href=# download=1234 style=color:var(--main-menu-selected);margin-left:1em>Export attract");
  function md(t) {
    const e = () => {
      const s = t.progress(), c = t.length();
      return c === 0 || s >= c ? "100%" : `${s / c * 100}%`;
    }, r = () => {
      const s = t.progress(), c = t.previewProgress(), p = t.length();
      if (c === void 0 || p === 0) return {
        left: "0%",
        width: "0%"
      };
      const b = Math.min(s, c), f = Math.min(Math.max(s, c), p);
      return {
        left: `${b / p * 100}%`,
        width: `${(f - b) / p * 100}%`
      };
    };
    let n;
    document.addEventListener("mousemove", _), Se(() => document.removeEventListener("mousemove", _)), document.addEventListener("mouseup", i), Se(() => document.removeEventListener("mouseup", i));
    function o(s) {
      if (n) {
        const { left: c, top: p, width: b } = n.getBoundingClientRect();
        let f = (s.clientX - c) / b;
        f = Math.min(1, f), f = Math.max(0, f);
        let C = Math.abs(s.clientY - p);
        return {
          targetFrame: Math.round(f * t.length()),
          strength: Math.pow(Math.E, -5 * C / b)
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
          const { targetFrame: p, strength: b } = o(s);
          t.seek(Math.round(c + (p - c) * b)), t.previewSeek(void 0);
        } else n.matches(":hover") ? t.previewSeek(o(s).targetFrame) : t.previewSeek(void 0);
      }
    }
    function i() {
      t.setDragStart(void 0);
    }
    return (() => {
      var s = wd(), c = s.firstChild, p = c.firstChild, b = c.nextSibling, f = b.firstChild, C = f.nextSibling, E = C.nextSibling, O = E.nextSibling, R = b.nextSibling, V = R.firstChild;
      c.$$click = () => {
        t.isPlaying() ? t.setIsPlaying(false) : (t.progress() >= t.length() && t.seek(0), t.setIsPlaying(true));
      }, w(p, u(tn, {
        get children() {
          return [
            u(Dt, {
              get when() {
                return !t.isPlaying();
              },
              children: "\u25B6"
            }),
            u(Dt, {
              get when() {
                return t.isPlaying();
              },
              children: "\u23F8"
            })
          ];
        }
      })), b.$$mousedown = (j) => {
        t.setDragStart(o(j).targetFrame), _(j), j.preventDefault();
      };
      var G = n;
      return typeof G == "function" ? sn(G, b) : n = b, V.$$click = function() {
        const j = t.attract(), M = new Blob([
          j.buffer
        ], {
          type: "application/octet-stream"
        }), I = URL.createObjectURL(M);
        this.href = I, setTimeout(() => URL.revokeObjectURL(I), 100);
      }, D((j) => {
        var M = e(), I = r().left, K = r().width, Z = e();
        return M !== j.e && qe(C, "width", j.e = M), I !== j.t && qe(E, "left", j.t = I), K !== j.a && qe(E, "width", j.a = K), Z !== j.o && qe(O, "left", j.o = Z), j;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), s;
    })();
  }
  st([
    "click",
    "mousedown"
  ]);
  var bd = m("<svg><circle r=1.5 fill=var(--background)></svg>", false, true, false), xd = m('<svg><path d="M -3 1 L 0 -3 L 3 1 L 0 -1 Z"fill=none stroke-width=3 stroke-linecap=round stroke-linejoin=round></svg>', false, true, false), vd = m("<svg><g></svg>", false, true, false);
  function $d(t) {
    return [
      u(z, {
        get each() {
          return t.inputs();
        },
        children: (e, r) => (() => {
          var n = vd();
          return w(n, u(B, {
            get when() {
              return !(e() > 0);
            },
            get children() {
              var o = bd();
              return D(() => g(o, "opacity", Number.isNaN(e()) ? 0.3 : 1)), o;
            }
          }), null), w(n, u(B, {
            get when() {
              return e() > 0;
            },
            get children() {
              var o = xd();
              return D(() => g(o, "stroke", `oklch(60% 80% ${Dd(e())}deg)`)), o;
            }
          }), null), D(() => g(n, "transform", `translate(${36 + 24 * r},${24 * 24.5}) rotate(${kd(e())},0,0)`)), n;
        })()
      }),
      u(z, {
        get each() {
          return t.pastNinjas();
        },
        children: (e, r) => u(B, {
          get when() {
            return e().length;
          },
          get children() {
            return u(Ge, {
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
  function kd(t) {
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
  function Dd(t) {
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
  var Sd = m("<span style=position:absolute>"), Ld = m("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), Td = m('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), Pd = m("<div>");
  function Ed(t) {
    const e = t.replay, [r, n] = y(true), [o, _] = y(!e.is_from_attract()), [i, s] = y(void 0), [c, p] = y(0), [b, f] = y(0), [C, E] = y(void 0), [O, R] = y(5400), V = (v) => {
      if (v.code === "Enter") e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), o() || je(1);
      else if (v.code === "Escape") o() ? (_(false), n(false), E(void 0), G()) : (_(true), n(true));
      else if (v.code === "Comma") {
        if (!o() && b() > 0) {
          f(b() - 1), e.seek(b());
          let { isJump1Pressed: P, isJump2Pressed: S, isRightPressed: J, isLeftPressed: pe, isDownPressed: we, isSuicidePressed: me } = t.globalEventState;
          P() || S() || J() || pe() || me() ? e.set_input(P() || S(), J(), pe(), me()) : we() && e.set_input(false, false, false, false), G(), je(1);
        }
      } else if (v.code === "Period" && !o()) {
        let { isJump1Pressed: P, isJump2Pressed: S, isRightPressed: J, isLeftPressed: pe, isDownPressed: we, isSuicidePressed: me } = t.globalEventState;
        P() || S() || J() || pe() || me() ? e.set_input(P() || S(), J(), pe(), me()) : (we() || e.inputs_len() === e.progress()) && e.set_input(false, false, false, false), e.tick(), f(e.progress()), G(), je(1);
      }
    };
    function G() {
      e.seek_preview(e.progress() + 120), E(e.progress_preview()), ie(), it(), $();
    }
    document.addEventListener("keydown", V), Se(() => {
      document.removeEventListener("keydown", V);
    });
    const j = () => e.tiles_path(), [M, I] = y({
      x: -50,
      y: -50,
      deg: 0
    }), [K, Z] = y({
      x: -50,
      y: -50,
      deg: 0
    }), [re, Q] = y(), [oe, L] = y(), k = y([]), A = y([]), _e = y([]), ne = y([]), ge = y([]), de = y([]), Y = y([]), T = y([]), X = y([]), se = y([]), ue = y([]), le = y([]), fe = y([]), d = y([]), h = y([]), Te = y([]), q = y([]), ae = y([]), ye = y([]), xe = y([]), Pe = y([]), [ot, x] = y([]);
    function $() {
      const v = [], P = e.past_ninjas_len();
      for (let S = 0; S < P; S++) v.push({
        x: e.past_ninja_x(S),
        y: e.past_ninja_y(S)
      });
      x(v);
    }
    $();
    const [N, H] = y([]);
    function ie() {
      const v = [];
      for (let P = -21; P < 21; P++) {
        const S = P + e.progress();
        S < 0 || S >= e.inputs_len() ? v.push(NaN) : v.push(e.input(S));
      }
      H(v);
    }
    ie();
    const [Ee, Ve] = y([]);
    function it() {
      const v = [];
      for (let P = -20; P <= 20; P++) {
        const S = P + e.progress();
        v.push(e.past_ninja_bones(S));
      }
      Ve(v);
    }
    it();
    let vt = performance.now();
    const _t = 1e3 / 60;
    let Ue = 0, $t = 0;
    function kt() {
      const v = performance.now(), P = Math.min(v - vt, 250);
      vt = v;
      let S = 1;
      const J = e;
      if (o() && i() === void 0) {
        if (r() || b() < c()) {
          for (Ue += P; Ue >= _t; ) {
            if (r()) {
              let { isJump1Pressed: pe, isJump2Pressed: we, isRightPressed: me, isLeftPressed: lt, isSuicidePressed: zr } = t.globalEventState;
              J.set_input(pe() || we(), me(), lt(), zr());
            }
            J.tick(), ie(), Ue -= _t;
          }
          S = Ue / _t, f(J.progress());
        } else b() < c() ? (J.tick(), f(J.progress())) : _(false);
        je(S);
      }
      $t = requestAnimationFrame(kt);
    }
    kt(), Se(() => {
      cancelAnimationFrame($t);
    });
    function je(v) {
      R(e.score()), I({
        x: e.ninja_x(v),
        y: e.ninja_y(v),
        deg: 0
      }), Z({
        x: e.ninja_preview_x(v),
        y: e.ninja_preview_y(v),
        deg: 0
      }), Q(e.ninja_bones(v)), C() === void 0 ? L(void 0) : L(e.ninja_preview_bones(v)), fl(k, e), Tc(A, e), ga(_e, e, v), _l(ne, e), ba(ge, e, v), Da(de, e, v), sa(Y, e), aa(T, e, v), jl(X, e, v), Kl(se, e), Ul(ue, e, v), ea(le, e), vl(fe, e, v), Ea(d, e, v), Z_(h, e, v), tl(Te, e, v), rc(q, e, v), $c(ae, e, v), lc(ye, e, v), wc(xe, e, v), Cc(Pe, e, v), p(e.replay_length());
    }
    return [
      (() => {
        var v = Sd();
        return w(v, () => (O() / 60).toFixed(3)), v;
      })(),
      (() => {
        var v = Td(), P = v.firstChild;
        P.firstChild;
        var S = P.nextSibling;
        return v.$$mousemove = function(J) {
          const { left: pe, top: we, width: me, height: lt } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (J.clientX - pe) / me * 1056,
            y: (J.clientY - we) / lt * 600
          });
        }, w(P, u(lr, {}), null), w(P, u(Kr, {}), null), w(P, u(mr, {}), null), w(P, u(ir, {}), null), w(P, u(ur, {}), null), w(P, u(gr, {}), null), w(P, u(xr, {}), null), w(P, u($r, {}), null), w(P, u(Nr, {}), null), w(P, u(Br, {}), null), w(P, u(Ar, {}), null), w(P, u(Or, {}), null), w(P, u(Hr, {}), null), w(P, u(X_, {}), null), w(v, u(pr, {
          get trapDoors() {
            return ue[0];
          }
        }), S), w(v, u(cr, {
          get lockedDoors() {
            return X[0];
          }
        }), S), w(v, u(dr, {
          get lockedSwitches() {
            return se[0];
          }
        }), S), w(v, u(hr, {
          get trapSwitches() {
            return le[0];
          }
        }), S), w(v, u(nr, {
          get exitDoors() {
            return h[0];
          }
        }), S), w(v, u(or, {
          get oneWays() {
            return ne[0];
          }
        }), S), w(v, u(_r, {
          get mines() {
            return k[0];
          }
        }), S), w(v, u(Rr, {
          get golds() {
            return A[0];
          }
        }), S), w(v, u(sr, {
          get exitSwitches() {
            return Te[0];
          }
        }), S), w(v, u(ar, {
          get regularDoors() {
            return fe[0];
          }
        }), S), w(v, u(fr, {
          get launchPads() {
            return Y[0];
          }
        }), S), w(v, u(Mr, {
          get laserDrones() {
            return xe[0];
          }
        }), S), w(v, u(Cr, {
          get chaingunDrones() {
            return ye[0];
          }
        }), S), w(v, u(jr, {
          get zapDrones() {
            return q[0];
          }
        }), S), w(v, u(Ir, {
          get chaseDrones() {
            return ae[0];
          }
        }), S), w(v, u(yr, {
          get floorGuards() {
            return T[0];
          }
        }), S), w(v, u(Gr, {
          get deathballs() {
            return Pe[0];
          }
        }), S), w(v, u(vr, {
          get thwumps() {
            return de[0];
          }
        }), S), w(v, u(Ge, {
          class: "ninja preview",
          ninja: K,
          bones: oe
        }), S), w(v, u(Ge, {
          class: "ninja",
          ninja: M,
          bones: re
        }), S), w(v, u(wr, {
          get bounceBlocks() {
            return _e[0];
          }
        }), S), w(v, u(kr, {
          get shoveThwumps() {
            return d[0];
          }
        }), S), w(v, u(br, {
          get boostPads() {
            return ge[0];
          }
        }), S), w(v, u(B, {
          get when() {
            return !o();
          },
          get children() {
            return [
              (() => {
                var J = Ld();
                return D(() => g(J, "points", ot().slice(b(), C() || 0).map(({ x: pe, y: we }) => `${pe},${we}`).join(" "))), J;
              })(),
              u($d, {
                inputs: N,
                pastNinjas: Ee
              })
            ];
          }
        }), null), D(() => g(S, "d", j())), v;
      })(),
      (() => {
        var v = Pd();
        return w(v, u(B, {
          get when() {
            return !r() || !o();
          },
          get children() {
            return u(md, {
              isPlaying: o,
              setIsPlaying: _,
              dragStart: i,
              setDragStart: s,
              length: c,
              progress: b,
              previewProgress: C,
              seek: (P) => {
                f(P), e.seek(P), ie(), it(), $(), je(1);
              },
              previewSeek: (P) => {
                E(P), $(), e && (P !== void 0 && i() === void 0 && e.seek_preview(P), je(1));
              },
              attract: () => e.export_attract(t.editor)
            });
          }
        })), v;
      })()
    ];
  }
  st([
    "mousemove"
  ]);
  var jd = m("<p>Invalid file."), Ad = m("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file><dl><dt>Windows</dt><dd>C:\\Program Files (x86)\\Steam\\steamapps\\common\\N++\\anim_data_line_new.txt.bin</dd><dt>Linux</dt><dd>~/.steam/steam/steamapps/common/N++/anim_data_line_new.txt.bin</dd><dt>Mac</dt><dd>~/Library/Application Support/Steam/steamapps/common/N++/N++.app/Contents/Resources/NPP/anim_data_line_new.txt.bin");
  function Cd() {
    const t = Le.new(), [e, r] = y(), [n, o] = y(""), [_, i] = y(false), [s, c] = y(false), [p, b] = y([]);
    function f() {
      const T = [], X = t.past_ninjas_len();
      for (let se = 0; se < X; se++) T.push({
        x: t.past_ninja_x(se),
        y: t.past_ninja_y(se)
      });
      b(T);
    }
    const [C, E] = y(false), [O, R] = y(false), [V, G] = y(false), [j, M] = y(false), [I, K] = y(false), [Z, re] = y(false), [Q, oe] = y({
      x: 36,
      y: 36
    }), L = {
      isJump1Pressed: C,
      isJump2Pressed: O,
      isRightPressed: V,
      isLeftPressed: j,
      isSuicidePressed: I,
      isDownPressed: Z,
      mouseGamePos: Q,
      setMouseGamePos: oe
    };
    Aa(t), o(t.get_level_name()), document.addEventListener("keydown", (T) => {
      if (!(T.ctrlKey || T.metaKey)) if (T.code === "Tab") {
        const X = e();
        X ? (r(void 0), X.send_past_ninjas(), t.receive_past_ninjas(), X.free(), f()) : r(t.to_replay(_(), s())), T.preventDefault();
      } else T.code === "KeyZ" ? E(true) : T.code === "ArrowUp" ? R(true) : T.code === "ArrowRight" ? G(true) : T.code === "ArrowLeft" ? M(true) : T.code === "ArrowDown" ? re(true) : T.code === "KeyV" && K(true);
    }), document.addEventListener("keyup", (T) => {
      T.code === "KeyZ" ? E(false) : T.code === "ArrowUp" ? R(false) : T.code === "ArrowRight" ? G(false) : T.code === "ArrowLeft" ? M(false) : T.code === "ArrowDown" ? re(false) : T.code === "KeyV" && K(false);
    }), document.addEventListener("blur", () => {
      E(false), R(false), G(false), M(false), K(false), re(false);
    }), Na(t);
    const k = 0, A = 1, _e = 2, [ne, ge] = y(t.get_anim_state() == k ? k : _e), [de, Y] = y(Ia());
    return Fr(() => {
      const T = de();
      T && (za(T.colors), Ma(T));
    }), Ha().then(() => {
      const T = de();
      if (T) {
        const X = Er(T.name);
        X && (T.colors = X), Y(T);
      }
    }), [
      u(B, {
        get when() {
          return ne() != k;
        },
        get children() {
          var T = Ad(), X = T.firstChild, se = X.nextSibling;
          return se.nextSibling, se.addEventListener("change", function() {
            const ue = this.files;
            if (ue && ue.length > 0) {
              const le = new FileReader();
              le.onloadend = () => {
                if (le.result instanceof ArrayBuffer) {
                  const fe = new Uint8Array(le.result);
                  try {
                    try {
                      Ca(fe);
                    } catch (d) {
                      console.error(d);
                    }
                    t.set_anim_data(fe), ge(t.get_anim_state());
                  } catch (d) {
                    console.error(d), ge(A);
                  }
                }
              }, le.readAsArrayBuffer(ue[0]);
            }
          }), w(T, u(B, {
            get when() {
              return ne() == A;
            },
            get children() {
              return jd();
            }
          }), null), T;
        }
      }),
      u(B, {
        get when() {
          return Ne(() => ne() == k)() && !e();
        },
        get children() {
          return u(yd, {
            editor: t,
            setReplay: r,
            pastNinjas: p,
            globalEventState: L,
            levelName: n,
            setLevelName: o,
            roundCorners: _,
            setRoundCorners: i,
            palette: de,
            setPalette: Y,
            dynamicFriction: s,
            setDynamicFriction: c
          });
        }
      }),
      u(B, {
        get when() {
          return Ne(() => ne() == k)() && !!e();
        },
        keyed: true,
        get children() {
          return u(Ed, {
            get replay() {
              return e();
            },
            editor: t,
            globalEventState: L
          });
        }
      })
    ];
  }
  const Nd = document.getElementById("root");
  nn(() => u(Cd, {}), Nd);
})();
