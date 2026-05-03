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
  const Gr = false, Hr = (t, e) => t === e, Ut = Symbol("solid-track"), Xe = {
    equals: Hr
  };
  let qt = Yt;
  const ve = 1, Je = 2, Ft = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var W = null;
  let lt = null, zr = null, q = null, te = null, me = null, st = 0;
  function Me(t, e) {
    const r = q, s = W, o = t.length === 0, i = e === void 0 ? s : e, _ = o ? Ft : {
      owned: null,
      cleanups: null,
      context: i ? i.context : null,
      owner: i
    }, n = o ? t : () => t(() => ue(() => Ke(_)));
    W = _, q = null;
    try {
      return Ve(n, true);
    } finally {
      q = r, W = s;
    }
  }
  function y(t, e) {
    e = e ? Object.assign({}, Xe, e) : Xe;
    const r = {
      value: t,
      observers: null,
      observerSlots: null,
      comparator: e.equals || void 0
    }, s = (o) => (typeof o == "function" && (o = o(r.value)), Zt(r, o));
    return [
      Wt.bind(r),
      s
    ];
  }
  function S(t, e, r) {
    const s = mt(t, e, false, ve);
    ze(s);
  }
  function Vr(t, e, r) {
    qt = Wr;
    const s = mt(t, e, false, ve);
    s.user = true, me ? me.push(s) : ze(s);
  }
  function _e(t, e, r) {
    r = r ? Object.assign({}, Xe, r) : Xe;
    const s = mt(t, e, true, 0);
    return s.observers = null, s.observerSlots = null, s.comparator = r.equals || void 0, ze(s), Wt.bind(s);
  }
  function ue(t) {
    if (q === null) return t();
    const e = q;
    q = null;
    try {
      return t();
    } finally {
      q = e;
    }
  }
  function Se(t) {
    return W === null || (W.cleanups === null ? W.cleanups = [
      t
    ] : W.cleanups.push(t)), t;
  }
  function Ur(t) {
    const e = _e(t), r = _e(() => ft(e()));
    return r.toArray = () => {
      const s = r();
      return Array.isArray(s) ? s : s != null ? [
        s
      ] : [];
    }, r;
  }
  function Wt() {
    if (this.sources && this.state) if (this.state === ve) ze(this);
    else {
      const t = te;
      te = null, Ve(() => et(this), false), te = t;
    }
    if (q) {
      const t = this.observers ? this.observers.length : 0;
      q.sources ? (q.sources.push(this), q.sourceSlots.push(t)) : (q.sources = [
        this
      ], q.sourceSlots = [
        t
      ]), this.observers ? (this.observers.push(q), this.observerSlots.push(q.sources.length - 1)) : (this.observers = [
        q
      ], this.observerSlots = [
        q.sources.length - 1
      ]);
    }
    return this.value;
  }
  function Zt(t, e, r) {
    let s = t.value;
    return (!t.comparator || !t.comparator(s, e)) && (t.value = e, t.observers && t.observers.length && Ve(() => {
      for (let o = 0; o < t.observers.length; o += 1) {
        const i = t.observers[o], _ = lt && lt.running;
        _ && lt.disposed.has(i), (_ ? !i.tState : !i.state) && (i.pure ? te.push(i) : me.push(i), i.observers && Xt(i)), _ || (i.state = ve);
      }
      if (te.length > 1e6) throw te = [], new Error();
    }, false)), e;
  }
  function ze(t) {
    if (!t.fn) return;
    Ke(t);
    const e = st;
    qr(t, t.value, e);
  }
  function qr(t, e, r) {
    let s;
    const o = W, i = q;
    q = W = t;
    try {
      s = t.fn(e);
    } catch (_) {
      return t.pure && (t.state = ve, t.owned && t.owned.forEach(Ke), t.owned = null), t.updatedAt = r + 1, Jt(_);
    } finally {
      q = i, W = o;
    }
    (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? Zt(t, s) : t.value = s, t.updatedAt = r);
  }
  function mt(t, e, r, s = ve, o) {
    const i = {
      fn: t,
      state: s,
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
    return W === null || W !== Ft && (W.owned ? W.owned.push(i) : W.owned = [
      i
    ]), i;
  }
  function Qe(t) {
    if (t.state === 0) return;
    if (t.state === Je) return et(t);
    if (t.suspense && ue(t.suspense.inFallback)) return t.suspense.effects.push(t);
    const e = [
      t
    ];
    for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < st); ) t.state && e.push(t);
    for (let r = e.length - 1; r >= 0; r--) if (t = e[r], t.state === ve) ze(t);
    else if (t.state === Je) {
      const s = te;
      te = null, Ve(() => et(t, e[0]), false), te = s;
    }
  }
  function Ve(t, e) {
    if (te) return t();
    let r = false;
    e || (te = []), me ? r = true : me = [], st++;
    try {
      const s = t();
      return Fr(r), s;
    } catch (s) {
      r || (me = null), te = null, Jt(s);
    }
  }
  function Fr(t) {
    if (te && (Yt(te), te = null), t) return;
    const e = me;
    me = null, e.length && Ve(() => qt(e), false);
  }
  function Yt(t) {
    for (let e = 0; e < t.length; e++) Qe(t[e]);
  }
  function Wr(t) {
    let e, r = 0;
    for (e = 0; e < t.length; e++) {
      const s = t[e];
      s.user ? t[r++] = s : Qe(s);
    }
    for (e = 0; e < r; e++) Qe(t[e]);
  }
  function et(t, e) {
    t.state = 0;
    for (let r = 0; r < t.sources.length; r += 1) {
      const s = t.sources[r];
      if (s.sources) {
        const o = s.state;
        o === ve ? s !== e && (!s.updatedAt || s.updatedAt < st) && Qe(s) : o === Je && et(s, e);
      }
    }
  }
  function Xt(t) {
    for (let e = 0; e < t.observers.length; e += 1) {
      const r = t.observers[e];
      r.state || (r.state = Je, r.pure ? te.push(r) : me.push(r), r.observers && Xt(r));
    }
  }
  function Ke(t) {
    let e;
    if (t.sources) for (; t.sources.length; ) {
      const r = t.sources.pop(), s = t.sourceSlots.pop(), o = r.observers;
      if (o && o.length) {
        const i = o.pop(), _ = r.observerSlots.pop();
        s < o.length && (i.sourceSlots[_] = s, o[s] = i, r.observerSlots[s] = _);
      }
    }
    if (t.tOwned) {
      for (e = t.tOwned.length - 1; e >= 0; e--) Ke(t.tOwned[e]);
      delete t.tOwned;
    }
    if (t.owned) {
      for (e = t.owned.length - 1; e >= 0; e--) Ke(t.owned[e]);
      t.owned = null;
    }
    if (t.cleanups) {
      for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
      t.cleanups = null;
    }
    t.state = 0;
  }
  function Zr(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function Jt(t, e = W) {
    throw Zr(t);
  }
  function ft(t) {
    if (typeof t == "function" && !t.length) return ft(t());
    if (Array.isArray(t)) {
      const e = [];
      for (let r = 0; r < t.length; r++) {
        const s = ft(t[r]);
        Array.isArray(s) ? e.push.apply(e, s) : e.push(s);
      }
      return e;
    }
    return t;
  }
  const yt = Symbol("fallback");
  function tt(t) {
    for (let e = 0; e < t.length; e++) t[e]();
  }
  function Yr(t, e, r = {}) {
    let s = [], o = [], i = [], _ = 0, n = e.length > 1 ? [] : null;
    return Se(() => tt(i)), () => {
      let c = t() || [], p = c.length, v, f;
      return c[Ut], ue(() => {
        let j, I, R, z, G, E, N, B, K;
        if (p === 0) _ !== 0 && (tt(i), i = [], s = [], o = [], _ = 0, n && (n = [])), r.fallback && (s = [
          yt
        ], o[0] = Me((Z) => (i[0] = Z, r.fallback())), _ = 1);
        else if (_ === 0) {
          for (o = new Array(p), f = 0; f < p; f++) s[f] = c[f], o[f] = Me(C);
          _ = p;
        } else {
          for (R = new Array(p), z = new Array(p), n && (G = new Array(p)), E = 0, N = Math.min(_, p); E < N && s[E] === c[E]; E++) ;
          for (N = _ - 1, B = p - 1; N >= E && B >= E && s[N] === c[B]; N--, B--) R[B] = o[N], z[B] = i[N], n && (G[B] = n[N]);
          for (j = /* @__PURE__ */ new Map(), I = new Array(B + 1), f = B; f >= E; f--) K = c[f], v = j.get(K), I[f] = v === void 0 ? -1 : v, j.set(K, f);
          for (v = E; v <= N; v++) K = s[v], f = j.get(K), f !== void 0 && f !== -1 ? (R[f] = o[v], z[f] = i[v], n && (G[f] = n[v]), f = I[f], j.set(K, f)) : i[v]();
          for (f = E; f < p; f++) f in R ? (o[f] = R[f], i[f] = z[f], n && (n[f] = G[f], n[f](f))) : o[f] = Me(C);
          o = o.slice(0, _ = p), s = c.slice(0);
        }
        return o;
      });
      function C(j) {
        if (i[f] = j, n) {
          const [I, R] = y(f);
          return n[f] = R, e(c[f], I);
        }
        return e(c[f]);
      }
    };
  }
  function Xr(t, e, r = {}) {
    let s = [], o = [], i = [], _ = [], n = 0, c;
    return Se(() => tt(i)), () => {
      const p = t() || [], v = p.length;
      return p[Ut], ue(() => {
        if (v === 0) return n !== 0 && (tt(i), i = [], s = [], o = [], n = 0, _ = []), r.fallback && (s = [
          yt
        ], o[0] = Me((C) => (i[0] = C, r.fallback())), n = 1), o;
        for (s[0] === yt && (i[0](), i = [], s = [], o = [], n = 0), c = 0; c < v; c++) c < s.length && s[c] !== p[c] ? _[c](() => p[c]) : c >= s.length && (o[c] = Me(f));
        for (; c < s.length; c++) i[c]();
        return n = _.length = i.length = v, s = p.slice(0), o = o.slice(0, n);
      });
      function f(C) {
        i[c] = C;
        const [j, I] = y(p[c]);
        return _[c] = I, e(j, c);
      }
    };
  }
  function u(t, e) {
    return ue(() => t(e || {}));
  }
  const Qt = (t) => `Stale read from <${t}>.`;
  function bt(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return _e(Yr(() => t.each, t.children, e || void 0));
  }
  function H(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return _e(Xr(() => t.each, t.children, e || void 0));
  }
  function M(t) {
    const e = t.keyed, r = _e(() => t.when, void 0, void 0), s = e ? r : _e(r, void 0, {
      equals: (o, i) => !o == !i
    });
    return _e(() => {
      const o = s();
      if (o) {
        const i = t.children;
        return typeof i == "function" && i.length > 0 ? ue(() => i(e ? o : () => {
          if (!ue(s)) throw Qt("Show");
          return r();
        })) : i;
      }
      return t.fallback;
    }, void 0, void 0);
  }
  function Jr(t) {
    const e = Ur(() => t.children), r = _e(() => {
      const s = e(), o = Array.isArray(s) ? s : [
        s
      ];
      let i = () => {
      };
      for (let _ = 0; _ < o.length; _++) {
        const n = _, c = o[_], p = i, v = _e(() => p() ? void 0 : c.when, void 0, void 0), f = c.keyed ? v : _e(v, void 0, {
          equals: (C, j) => !C == !j
        });
        i = () => p() || (f() ? [
          n,
          v,
          c
        ] : void 0);
      }
      return i;
    });
    return _e(() => {
      const s = r()();
      if (!s) return t.fallback;
      const [o, i, _] = s, n = _.children;
      return typeof n == "function" && n.length > 0 ? ue(() => n(_.keyed ? i() : () => {
        var _a2;
        if (((_a2 = ue(r)()) == null ? void 0 : _a2[0]) !== o) throw Qt("Match");
        return i();
      })) : n;
    }, void 0, void 0);
  }
  function kt(t) {
    return t;
  }
  const Ne = (t) => _e(() => t());
  function Qr(t, e, r) {
    let s = r.length, o = e.length, i = s, _ = 0, n = 0, c = e[o - 1].nextSibling, p = null;
    for (; _ < o || n < i; ) {
      if (e[_] === r[n]) {
        _++, n++;
        continue;
      }
      for (; e[o - 1] === r[i - 1]; ) o--, i--;
      if (o === _) {
        const v = i < s ? n ? r[n - 1].nextSibling : r[i - n] : c;
        for (; n < i; ) t.insertBefore(r[n++], v);
      } else if (i === n) for (; _ < o; ) (!p || !p.has(e[_])) && e[_].remove(), _++;
      else if (e[_] === r[i - 1] && r[n] === e[o - 1]) {
        const v = e[--o].nextSibling;
        t.insertBefore(r[n++], e[_++].nextSibling), t.insertBefore(r[--i], v), e[o] = r[i];
      } else {
        if (!p) {
          p = /* @__PURE__ */ new Map();
          let f = n;
          for (; f < i; ) p.set(r[f], f++);
        }
        const v = p.get(e[_]);
        if (v != null) if (n < v && v < i) {
          let f = _, C = 1, j;
          for (; ++f < o && f < i && !((j = p.get(e[f])) == null || j !== v + C); ) C++;
          if (C > v - n) {
            const I = e[_];
            for (; n < v; ) t.insertBefore(r[n++], I);
          } else t.replaceChild(r[n++], e[_++]);
        } else _++;
        else e[_++].remove();
      }
    }
  }
  const Dt = "_$DX_DELEGATE";
  function es(t, e, r, s = {}) {
    let o;
    return Me((i) => {
      o = i, e === document ? t() : w(e, t(), e.firstChild ? null : void 0, r);
    }, s.owner), () => {
      o(), e.textContent = "";
    };
  }
  function m(t, e, r, s) {
    let o;
    const i = () => {
      const n = s ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
      return n.innerHTML = t, r ? n.content.firstChild.firstChild : s ? n.firstChild : n.content.firstChild;
    }, _ = e ? () => ue(() => document.importNode(o || (o = i()), true)) : () => (o || (o = i())).cloneNode(true);
    return _.cloneNode = _, _;
  }
  function nt(t, e = window.document) {
    const r = e[Dt] || (e[Dt] = /* @__PURE__ */ new Set());
    for (let s = 0, o = t.length; s < o; s++) {
      const i = t[s];
      r.has(i) || (r.add(i), e.addEventListener(i, rs));
    }
  }
  function g(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function qe(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function ts(t, e, r) {
    return ue(() => t(e, r));
  }
  function w(t, e, r, s) {
    if (r !== void 0 && !s && (s = []), typeof e != "function") return rt(t, e, s, r);
    S((o) => rt(t, e(), o, r), s);
  }
  function rs(t) {
    let e = t.target;
    const r = `$$${t.type}`, s = t.target, o = t.currentTarget, i = (c) => Object.defineProperty(t, "target", {
      configurable: true,
      value: c
    }), _ = () => {
      const c = e[r];
      if (c && !e.disabled) {
        const p = e[`${r}Data`];
        if (p !== void 0 ? c.call(e, p, t) : c.call(e, t), t.cancelBubble) return;
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
      for (let p = 0; p < c.length - 2 && (e = c[p], !!_()); p++) {
        if (e._$host) {
          e = e._$host, n();
          break;
        }
        if (e.parentNode === o) break;
      }
    } else n();
    i(s);
  }
  function rt(t, e, r, s, o) {
    for (; typeof r == "function"; ) r = r();
    if (e === r) return r;
    const i = typeof e, _ = s !== void 0;
    if (t = _ && r[0] && r[0].parentNode || t, i === "string" || i === "number") {
      if (i === "number" && (e = e.toString(), e === r)) return r;
      if (_) {
        let n = r[0];
        n && n.nodeType === 3 ? n.data !== e && (n.data = e) : n = document.createTextNode(e), r = Ce(t, r, s, n);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || i === "boolean") r = Ce(t, r, s);
    else {
      if (i === "function") return S(() => {
        let n = e();
        for (; typeof n == "function"; ) n = n();
        r = rt(t, n, r, s);
      }), () => r;
      if (Array.isArray(e)) {
        const n = [], c = r && Array.isArray(r);
        if (wt(n, e, r, o)) return S(() => r = rt(t, n, r, s, true)), () => r;
        if (n.length === 0) {
          if (r = Ce(t, r, s), _) return r;
        } else c ? r.length === 0 ? St(t, n, s) : Qr(t, r, n) : (r && Ce(t), St(t, n));
        r = n;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (_) return r = Ce(t, r, s, e);
          Ce(t, r, null, e);
        } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
        r = e;
      }
    }
    return r;
  }
  function wt(t, e, r, s) {
    let o = false;
    for (let i = 0, _ = e.length; i < _; i++) {
      let n = e[i], c = r && r[t.length], p;
      if (!(n == null || n === true || n === false)) if ((p = typeof n) == "object" && n.nodeType) t.push(n);
      else if (Array.isArray(n)) o = wt(t, n, c) || o;
      else if (p === "function") if (s) {
        for (; typeof n == "function"; ) n = n();
        o = wt(t, Array.isArray(n) ? n : [
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
  function St(t, e, r = null) {
    for (let s = 0, o = e.length; s < o; s++) t.insertBefore(e[s], r);
  }
  function Ce(t, e, r, s) {
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
  const ss = "" + new URL("ntools_rs_bg-cfNEPbKI.wasm", import.meta.url).href, ns = async (t = {}, e) => {
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
  function os(t) {
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
  const is = 2146435072;
  let at = 0;
  function _s(t, e) {
    return at += e, at >= is && (Ze = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), Ze.decode(), at = e), Ze.decode(Be().subarray(t, t + e));
  }
  function ke(t, e) {
    return t = t >>> 0, _s(t, e);
  }
  function er(t, e) {
    return t = t >>> 0, Be().subarray(t / 1, t / 1 + e);
  }
  let De = 0;
  function ct(t, e) {
    const r = e(t.length * 1, 1) >>> 0;
    return Be().set(t, r / 1), De = t.length, r;
  }
  function dt(t) {
    const e = l.__wbindgen_externrefs.get(t);
    return l.__externref_table_dealloc(t), e;
  }
  const Re = new TextEncoder();
  "encodeInto" in Re || (Re.encodeInto = function(t, e) {
    const r = Re.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function ls(t, e, r) {
    if (r === void 0) {
      const n = Re.encode(t), c = e(n.length, 1) >>> 0;
      return Be().subarray(c, c + n.length).set(n), De = n.length, c;
    }
    let s = t.length, o = e(s, 1) >>> 0;
    const i = Be();
    let _ = 0;
    for (; _ < s; _++) {
      const n = t.charCodeAt(_);
      if (n > 127) break;
      i[o + _] = n;
    }
    if (_ !== s) {
      _ !== 0 && (t = t.slice(_)), o = r(o, s, s = _ + t.length * 3, 1) >>> 0;
      const n = Be().subarray(o + _, o + s), c = Re.encodeInto(t, n);
      _ += c.written, o = r(o, s, _, 1) >>> 0;
    }
    return De = _, o;
  }
  let We = null;
  function as() {
    return (We === null || We.byteLength === 0) && (We = new Float64Array(l.memory.buffer)), We;
  }
  function Ye(t, e) {
    return t = t >>> 0, as().subarray(t / 8, t / 8 + e);
  }
  let Ae = null;
  function cs() {
    return (Ae === null || Ae.buffer.detached === true || Ae.buffer.detached === void 0 && Ae.buffer !== l.memory.buffer) && (Ae = new DataView(l.memory.buffer)), Ae;
  }
  function Lt(t, e) {
    t = t >>> 0;
    const r = cs(), s = [];
    for (let o = t; o < t + 4 * e; o += 4) s.push(l.__wbindgen_externrefs.get(r.getUint32(o, true)));
    return l.__externref_drop_slice(t, e), s;
  }
  function ds(t, e) {
    if (!(t instanceof e)) throw new Error(`expected instance of ${e.name}`);
  }
  const Tt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_editor_free(t >>> 0, 1));
  class Le {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Le.prototype);
      return r.__wbg_ptr = e, Tt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Tt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      l.__wbg_editor_free(e, 0);
    }
    export_map() {
      const e = l.editor_export_map(this.__wbg_ptr);
      var r = er(e[0], e[1]).slice();
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
        return e = s[0], r = s[1], ke(s[0], s[1]);
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
      l.editor_press_num_1(this.__wbg_ptr);
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
    load_attract(e, r, s) {
      const o = ct(e, l.__wbindgen_malloc), i = De, _ = l.editor_load_attract(this.__wbg_ptr, o, i, r, s);
      if (_[2]) throw dt(_[1]);
      return Ie.__wrap(_[0]);
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
      const r = ct(e, l.__wbindgen_malloc), s = De;
      l.editor_set_anim_data(this.__wbg_ptr, r, s);
    }
    get_anim_state() {
      return l.editor_get_anim_state(this.__wbg_ptr) >>> 0;
    }
    get_level_name() {
      let e, r;
      try {
        const s = l.editor_get_level_name(this.__wbg_ptr);
        return e = s[0], r = s[1], ke(s[0], s[1]);
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
      const r = ls(e, l.__wbindgen_malloc, l.__wbindgen_realloc), s = De;
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
      var r = Ye(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 8, 8), r;
    }
    preview_entities() {
      const e = l.editor_preview_entities(this.__wbg_ptr);
      var r = Lt(e[0], e[1]).slice();
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
        return e = s[0], r = s[1], ke(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    selected_tile_outline_path() {
      let e, r;
      try {
        const s = l.editor_selected_tile_outline_path(this.__wbg_ptr);
        return e = s[0], r = s[1], ke(s[0], s[1]);
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
      var r = Lt(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    load_map(e) {
      const r = ct(e, l.__wbindgen_malloc), s = De, o = l.editor_load_map(this.__wbg_ptr, r, s);
      if (o[1]) throw dt(o[0]);
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
      const s = l.editor_to_replay(this.__wbg_ptr, e, r);
      if (s[2]) throw dt(s[1]);
      return Ie.__wrap(s[0]);
    }
  }
  Symbol.dispose && (Le.prototype[Symbol.dispose] = Le.prototype.free);
  const Pt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_exportedentity_free(t >>> 0, 1));
  class Ge {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Ge.prototype);
      return r.__wbg_ptr = e, Pt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Pt.unregister(this), e;
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
  Symbol.dispose && (Ge.prototype[Symbol.dispose] = Ge.prototype.free);
  const Et = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_replay_free(t >>> 0, 1));
  class Ie {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Ie.prototype);
      return r.__wbg_ptr = e, Et.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Et.unregister(this), e;
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
        const s = l.replay_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], ke(s[0], s[1]);
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
      var s = Ye(r[0], r[1]).slice();
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
    exit_doors_len() {
      return l.replay_exit_doors_len(this.__wbg_ptr) >>> 0;
    }
    export_attract(e) {
      ds(e, Le);
      const r = l.replay_export_attract(this.__wbg_ptr, e.__wbg_ptr);
      var s = er(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 1, 1), s;
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
      var s = Ye(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 8, 8), s;
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
      var s = Ye(r[0], r[1]).slice();
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
    set_input(e, r, s, o) {
      l.replay_set_input(this.__wbg_ptr, e, r, s, o);
    }
  }
  Symbol.dispose && (Ie.prototype[Symbol.dispose] = Ie.prototype.free);
  function us(t, e) {
    throw new Error(ke(t, e));
  }
  function ps(t) {
    return Ge.__wrap(t);
  }
  function hs(t, e) {
    return ke(t, e);
  }
  function gs() {
    const t = l.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const a = await ns({
    "./ntools_rs_bg.js": {
      __wbg_exportedentity_new: ps,
      __wbg___wbindgen_throw_b855445ff6a94295: us,
      __wbindgen_init_externref_table: gs,
      __wbindgen_cast_2241b6af4c4b2941: hs
    }
  }, ss), fs = a.memory, ys = a.__wbg_editor_free, ws = a.editor_crosshair_x, ms = a.editor_crosshair_y, bs = a.editor_cursor_down, xs = a.editor_cursor_up, vs = a.editor_double_click, $s = a.editor_entities, ks = a.editor_export_map, Ds = a.editor_get_anim_state, Ss = a.editor_get_level_name, Ls = a.editor_get_show_trail, Ts = a.editor_load_attract, Ps = a.editor_load_map, Es = a.editor_mode, js = a.editor_new, Cs = a.editor_palette_center_x, As = a.editor_palette_center_y, Ns = a.editor_palette_selection_x, Ms = a.editor_palette_selection_y, Bs = a.editor_past_ninja_bones, Is = a.editor_past_ninja_x, Os = a.editor_past_ninja_y, Rs = a.editor_past_ninjas_len, Ks = a.editor_press_0, Gs = a.editor_press_1, Hs = a.editor_press_2, zs = a.editor_press_3, Vs = a.editor_press_4, Us = a.editor_press_5, qs = a.editor_press_6, Fs = a.editor_press_7, Ws = a.editor_press_8, Zs = a.editor_press_9, Ys = a.editor_press_a, Xs = a.editor_press_alt_left, Js = a.editor_press_backtick, Qs = a.editor_press_bracket_left, en = a.editor_press_bracket_right, tn = a.editor_press_c, rn = a.editor_press_comma, sn = a.editor_press_d, nn = a.editor_press_dash, on = a.editor_press_down, _n = a.editor_press_e, ln = a.editor_press_enter, an = a.editor_press_equals, cn = a.editor_press_escape, dn = a.editor_press_f, un = a.editor_press_h, pn = a.editor_press_i, hn = a.editor_press_j, gn = a.editor_press_k, fn = a.editor_press_l, yn = a.editor_press_left, wn = a.editor_press_m, mn = a.editor_press_n, bn = a.editor_press_num_0, xn = a.editor_press_num_1, vn = a.editor_press_num_3, $n = a.editor_press_num_7, kn = a.editor_press_o, Dn = a.editor_press_p, Sn = a.editor_press_q, Ln = a.editor_press_r, Tn = a.editor_press_right, Pn = a.editor_press_s, En = a.editor_press_shift, jn = a.editor_press_slash, Cn = a.editor_press_space, An = a.editor_press_t, Nn = a.editor_press_up, Mn = a.editor_press_w, Bn = a.editor_press_x, In = a.editor_press_y, On = a.editor_press_z, Rn = a.editor_preview_entities, Kn = a.editor_receive_past_ninjas, Gn = a.editor_redo, Hn = a.editor_release_a, zn = a.editor_release_alt_left, Vn = a.editor_release_c, Un = a.editor_release_d, qn = a.editor_release_e, Fn = a.editor_release_q, Wn = a.editor_release_s, Zn = a.editor_release_shift, Yn = a.editor_release_space, Xn = a.editor_release_w, Jn = a.editor_release_z, Qn = a.editor_selected_tile_outline_path, eo = a.editor_selected_tiles_path, to = a.editor_set_anim_data, ro = a.editor_set_cursor_pos, so = a.editor_set_level_name, no = a.editor_set_show_trail, oo = a.editor_show_half_grid, io = a.editor_show_quarter_grid, _o = a.editor_tile_crosshair_col, lo = a.editor_tile_crosshair_row, ao = a.editor_tiles_path, co = a.editor_to_replay, uo = a.editor_undo, po = a.__wbg_exportedentity_free, ho = a.__wbg_get_exportedentity_deg, go = a.__wbg_get_exportedentity_mode, fo = a.__wbg_get_exportedentity_switch_x, yo = a.__wbg_get_exportedentity_switch_y, wo = a.__wbg_get_exportedentity_type_int, mo = a.__wbg_get_exportedentity_x, bo = a.__wbg_get_exportedentity_y, xo = a.__wbg_set_exportedentity_deg, vo = a.__wbg_set_exportedentity_mode, $o = a.__wbg_set_exportedentity_switch_x, ko = a.__wbg_set_exportedentity_switch_y, Do = a.__wbg_set_exportedentity_type_int, So = a.__wbg_set_exportedentity_x, Lo = a.__wbg_set_exportedentity_y, To = a.__wbg_replay_free, Po = a.replay_boost_pad_anim_progress, Eo = a.replay_boost_pad_deg, jo = a.replay_boost_pad_x, Co = a.replay_boost_pad_y, Ao = a.replay_boost_pads_len, No = a.replay_bounce_block_deg, Mo = a.replay_bounce_block_x, Bo = a.replay_bounce_block_y, Io = a.replay_bounce_blocks_len, Oo = a.replay_chaingun_drone_deg, Ro = a.replay_chaingun_drone_x, Ko = a.replay_chaingun_drone_y, Go = a.replay_chaingun_drones_len, Ho = a.replay_chase_drone_deg, zo = a.replay_chase_drone_x, Vo = a.replay_chase_drone_y, Uo = a.replay_chase_drones_len, qo = a.replay_exit_anim_progress, Fo = a.replay_exit_door_x, Wo = a.replay_exit_door_y, Zo = a.replay_exit_doors_len, Yo = a.replay_exit_switch_x, Xo = a.replay_exit_switch_y, Jo = a.replay_export_attract, Qo = a.replay_floor_guard_deg, ei = a.replay_floor_guard_x, ti = a.replay_floor_guard_y, ri = a.replay_floor_guards_len, si = a.replay_gold_collected, ni = a.replay_gold_x, oi = a.replay_gold_y, ii = a.replay_golds_len, _i = a.replay_input, li = a.replay_inputs_len, ai = a.replay_is_from_attract, ci = a.replay_laser_drone_deg, di = a.replay_laser_drone_x, ui = a.replay_laser_drone_y, pi = a.replay_laser_drones_len, hi = a.replay_launch_pad_deg, gi = a.replay_launch_pad_x, fi = a.replay_launch_pad_y, yi = a.replay_launch_pads_len, wi = a.replay_locked_door_anim_progress, mi = a.replay_locked_door_deg, bi = a.replay_locked_door_x, xi = a.replay_locked_door_y, vi = a.replay_locked_doors_len, $i = a.replay_locked_switch_x, ki = a.replay_locked_switch_y, Di = a.replay_mine_state, Si = a.replay_mine_x, Li = a.replay_mine_y, Ti = a.replay_mines_len, Pi = a.replay_ninja_bones, Ei = a.replay_ninja_preview_bones, ji = a.replay_ninja_preview_x, Ci = a.replay_ninja_preview_y, Ai = a.replay_ninja_x, Ni = a.replay_ninja_y, Mi = a.replay_one_way_deg, Bi = a.replay_one_way_x, Ii = a.replay_one_way_y, Oi = a.replay_one_ways_len, Ri = a.replay_past_ninja_bones, Ki = a.replay_past_ninja_x, Gi = a.replay_past_ninja_y, Hi = a.replay_past_ninjas_len, zi = a.replay_place_ninja, Vi = a.replay_progress, Ui = a.replay_progress_preview, qi = a.replay_regular_door_anim_progress, Fi = a.replay_regular_door_deg, Wi = a.replay_regular_door_x, Zi = a.replay_regular_door_y, Yi = a.replay_regular_doors_len, Xi = a.replay_score, Ji = a.replay_seek, Qi = a.replay_seek_preview, e_ = a.replay_send_past_ninjas, t_ = a.replay_set_input, r_ = a.replay_shove_thwump_deg, s_ = a.replay_shove_thwump_touch, n_ = a.replay_shove_thwump_x, o_ = a.replay_shove_thwump_y, i_ = a.replay_shove_thwumps_len, __ = a.replay_thwump_deg, l_ = a.replay_thwump_x, a_ = a.replay_thwump_y, c_ = a.replay_thwumps_len, d_ = a.replay_tick, u_ = a.replay_tiles_path, p_ = a.replay_trap_door_anim_progress, h_ = a.replay_trap_door_deg, g_ = a.replay_trap_door_x, f_ = a.replay_trap_door_y, y_ = a.replay_trap_doors_len, w_ = a.replay_trap_switch_x, m_ = a.replay_trap_switch_y, b_ = a.replay_zap_drone_deg, x_ = a.replay_zap_drone_x, v_ = a.replay_zap_drone_y, $_ = a.replay_zap_drones_len, k_ = a.editor_press_num_2, D_ = a.editor_press_num_4, S_ = a.editor_press_num_5, L_ = a.editor_press_u, T_ = a.replay_replay_length, P_ = a.__wbindgen_externrefs, E_ = a.__wbindgen_free, j_ = a.__wbindgen_malloc, C_ = a.__externref_table_dealloc, A_ = a.__wbindgen_realloc, N_ = a.__externref_drop_slice, tr = a.__wbindgen_start, M_ = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: N_,
    __externref_table_dealloc: C_,
    __wbg_editor_free: ys,
    __wbg_exportedentity_free: po,
    __wbg_get_exportedentity_deg: ho,
    __wbg_get_exportedentity_mode: go,
    __wbg_get_exportedentity_switch_x: fo,
    __wbg_get_exportedentity_switch_y: yo,
    __wbg_get_exportedentity_type_int: wo,
    __wbg_get_exportedentity_x: mo,
    __wbg_get_exportedentity_y: bo,
    __wbg_replay_free: To,
    __wbg_set_exportedentity_deg: xo,
    __wbg_set_exportedentity_mode: vo,
    __wbg_set_exportedentity_switch_x: $o,
    __wbg_set_exportedentity_switch_y: ko,
    __wbg_set_exportedentity_type_int: Do,
    __wbg_set_exportedentity_x: So,
    __wbg_set_exportedentity_y: Lo,
    __wbindgen_externrefs: P_,
    __wbindgen_free: E_,
    __wbindgen_malloc: j_,
    __wbindgen_realloc: A_,
    __wbindgen_start: tr,
    editor_crosshair_x: ws,
    editor_crosshair_y: ms,
    editor_cursor_down: bs,
    editor_cursor_up: xs,
    editor_double_click: vs,
    editor_entities: $s,
    editor_export_map: ks,
    editor_get_anim_state: Ds,
    editor_get_level_name: Ss,
    editor_get_show_trail: Ls,
    editor_load_attract: Ts,
    editor_load_map: Ps,
    editor_mode: Es,
    editor_new: js,
    editor_palette_center_x: Cs,
    editor_palette_center_y: As,
    editor_palette_selection_x: Ns,
    editor_palette_selection_y: Ms,
    editor_past_ninja_bones: Bs,
    editor_past_ninja_x: Is,
    editor_past_ninja_y: Os,
    editor_past_ninjas_len: Rs,
    editor_press_0: Ks,
    editor_press_1: Gs,
    editor_press_2: Hs,
    editor_press_3: zs,
    editor_press_4: Vs,
    editor_press_5: Us,
    editor_press_6: qs,
    editor_press_7: Fs,
    editor_press_8: Ws,
    editor_press_9: Zs,
    editor_press_a: Ys,
    editor_press_alt_left: Xs,
    editor_press_backtick: Js,
    editor_press_bracket_left: Qs,
    editor_press_bracket_right: en,
    editor_press_c: tn,
    editor_press_comma: rn,
    editor_press_d: sn,
    editor_press_dash: nn,
    editor_press_down: on,
    editor_press_e: _n,
    editor_press_enter: ln,
    editor_press_equals: an,
    editor_press_escape: cn,
    editor_press_f: dn,
    editor_press_h: un,
    editor_press_i: pn,
    editor_press_j: hn,
    editor_press_k: gn,
    editor_press_l: fn,
    editor_press_left: yn,
    editor_press_m: wn,
    editor_press_n: mn,
    editor_press_num_0: bn,
    editor_press_num_1: xn,
    editor_press_num_2: k_,
    editor_press_num_3: vn,
    editor_press_num_4: D_,
    editor_press_num_5: S_,
    editor_press_num_7: $n,
    editor_press_o: kn,
    editor_press_p: Dn,
    editor_press_q: Sn,
    editor_press_r: Ln,
    editor_press_right: Tn,
    editor_press_s: Pn,
    editor_press_shift: En,
    editor_press_slash: jn,
    editor_press_space: Cn,
    editor_press_t: An,
    editor_press_u: L_,
    editor_press_up: Nn,
    editor_press_w: Mn,
    editor_press_x: Bn,
    editor_press_y: In,
    editor_press_z: On,
    editor_preview_entities: Rn,
    editor_receive_past_ninjas: Kn,
    editor_redo: Gn,
    editor_release_a: Hn,
    editor_release_alt_left: zn,
    editor_release_c: Vn,
    editor_release_d: Un,
    editor_release_e: qn,
    editor_release_q: Fn,
    editor_release_s: Wn,
    editor_release_shift: Zn,
    editor_release_space: Yn,
    editor_release_w: Xn,
    editor_release_z: Jn,
    editor_selected_tile_outline_path: Qn,
    editor_selected_tiles_path: eo,
    editor_set_anim_data: to,
    editor_set_cursor_pos: ro,
    editor_set_level_name: so,
    editor_set_show_trail: no,
    editor_show_half_grid: oo,
    editor_show_quarter_grid: io,
    editor_tile_crosshair_col: _o,
    editor_tile_crosshair_row: lo,
    editor_tiles_path: ao,
    editor_to_replay: co,
    editor_undo: uo,
    memory: fs,
    replay_boost_pad_anim_progress: Po,
    replay_boost_pad_deg: Eo,
    replay_boost_pad_x: jo,
    replay_boost_pad_y: Co,
    replay_boost_pads_len: Ao,
    replay_bounce_block_deg: No,
    replay_bounce_block_x: Mo,
    replay_bounce_block_y: Bo,
    replay_bounce_blocks_len: Io,
    replay_chaingun_drone_deg: Oo,
    replay_chaingun_drone_x: Ro,
    replay_chaingun_drone_y: Ko,
    replay_chaingun_drones_len: Go,
    replay_chase_drone_deg: Ho,
    replay_chase_drone_x: zo,
    replay_chase_drone_y: Vo,
    replay_chase_drones_len: Uo,
    replay_exit_anim_progress: qo,
    replay_exit_door_x: Fo,
    replay_exit_door_y: Wo,
    replay_exit_doors_len: Zo,
    replay_exit_switch_x: Yo,
    replay_exit_switch_y: Xo,
    replay_export_attract: Jo,
    replay_floor_guard_deg: Qo,
    replay_floor_guard_x: ei,
    replay_floor_guard_y: ti,
    replay_floor_guards_len: ri,
    replay_gold_collected: si,
    replay_gold_x: ni,
    replay_gold_y: oi,
    replay_golds_len: ii,
    replay_input: _i,
    replay_inputs_len: li,
    replay_is_from_attract: ai,
    replay_laser_drone_deg: ci,
    replay_laser_drone_x: di,
    replay_laser_drone_y: ui,
    replay_laser_drones_len: pi,
    replay_launch_pad_deg: hi,
    replay_launch_pad_x: gi,
    replay_launch_pad_y: fi,
    replay_launch_pads_len: yi,
    replay_locked_door_anim_progress: wi,
    replay_locked_door_deg: mi,
    replay_locked_door_x: bi,
    replay_locked_door_y: xi,
    replay_locked_doors_len: vi,
    replay_locked_switch_x: $i,
    replay_locked_switch_y: ki,
    replay_mine_state: Di,
    replay_mine_x: Si,
    replay_mine_y: Li,
    replay_mines_len: Ti,
    replay_ninja_bones: Pi,
    replay_ninja_preview_bones: Ei,
    replay_ninja_preview_x: ji,
    replay_ninja_preview_y: Ci,
    replay_ninja_x: Ai,
    replay_ninja_y: Ni,
    replay_one_way_deg: Mi,
    replay_one_way_x: Bi,
    replay_one_way_y: Ii,
    replay_one_ways_len: Oi,
    replay_past_ninja_bones: Ri,
    replay_past_ninja_x: Ki,
    replay_past_ninja_y: Gi,
    replay_past_ninjas_len: Hi,
    replay_place_ninja: zi,
    replay_progress: Vi,
    replay_progress_preview: Ui,
    replay_regular_door_anim_progress: qi,
    replay_regular_door_deg: Fi,
    replay_regular_door_x: Wi,
    replay_regular_door_y: Zi,
    replay_regular_doors_len: Yi,
    replay_replay_length: T_,
    replay_score: Xi,
    replay_seek: Ji,
    replay_seek_preview: Qi,
    replay_send_past_ninjas: e_,
    replay_set_input: t_,
    replay_shove_thwump_deg: r_,
    replay_shove_thwump_touch: s_,
    replay_shove_thwump_x: n_,
    replay_shove_thwump_y: o_,
    replay_shove_thwumps_len: i_,
    replay_thwump_deg: __,
    replay_thwump_x: l_,
    replay_thwump_y: a_,
    replay_thwumps_len: c_,
    replay_tick: d_,
    replay_tiles_path: u_,
    replay_trap_door_anim_progress: p_,
    replay_trap_door_deg: h_,
    replay_trap_door_x: g_,
    replay_trap_door_y: f_,
    replay_trap_doors_len: y_,
    replay_trap_switch_x: w_,
    replay_trap_switch_y: m_,
    replay_zap_drone_deg: b_,
    replay_zap_drone_x: x_,
    replay_zap_drone_y: v_,
    replay_zap_drones_len: $_
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  os(M_);
  tr();
  function B_({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var I_ = m("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const O_ = [
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
  function He(t) {
    function e() {
      const r = t.bones();
      return r ? O_.map(([s, o]) => `M ${20 * r[s]} ${20 * r[s + 13]} ${20 * r[o]} ${20 * r[o + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = I_();
      return S((s) => {
        var o = t.class, i = B_(t.ninja()), _ = e();
        return o !== s.e && g(r, "class", s.e = o), i !== s.t && g(r, "transform", s.t = i), _ !== s.a && g(r, "d", s.a = _), s;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var R_ = m("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), K_ = m("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function G_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function H_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function z_([t, e], r, s) {
    const o = t(), i = r.exit_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.exit_door_x(n),
        y: r.exit_door_y(n),
        animProgress: r.exit_anim_progress(n, s)
      };
      c && G_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function rr(t) {
    return u(H, {
      get each() {
        return t.exitDoors();
      },
      children: (e) => u(V_, {
        exitDoor: e
      })
    });
  }
  const ee = 11, V = 2.5;
  function V_(t) {
    return (() => {
      var e = R_(), r = e.firstChild, s = r.nextSibling, o = s.nextSibling, i = o.nextSibling, _ = i.nextSibling;
      return S((n) => {
        var c = H_(t.exitDoor), p = -13 + 4 * (1 - t.exitDoor().animProgress), v = 26 - 8 * (1 - t.exitDoor().animProgress), f = `M ${-13 * t.exitDoor().animProgress} 0 v ${-ee} h ${-ee + V} l ${-V} ${V} v ${2 * (ee - V)} l ${V} ${V} h ${ee - V} z`, C = `M ${13 * t.exitDoor().animProgress} 0 v ${-ee} h ${ee - V} l ${V} ${V} v ${2 * (ee - V)} l ${-V} ${V} h ${-ee + V} z`, j = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * ee} v ${t.exitDoor().animProgress * ee} h ${-ee + V + t.exitDoor().animProgress} l ${-V} ${-V} v ${(1 - t.exitDoor().animProgress) * (-ee + V)}`, I = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * ee} v ${t.exitDoor().animProgress * ee} h ${ee - V - t.exitDoor().animProgress} l ${V} ${-V} v ${(1 - t.exitDoor().animProgress) * (-ee + V)}`;
        return c !== n.e && g(e, "transform", n.e = c), p !== n.t && g(r, "x", n.t = p), v !== n.a && g(r, "width", n.a = v), f !== n.o && g(s, "d", n.o = f), C !== n.i && g(o, "d", n.i = C), j !== n.n && g(i, "d", n.n = j), I !== n.s && g(_, "d", n.s = I), n;
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
  function U_() {
    return K_();
  }
  var q_ = m('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function F_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function W_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Z_([t, e], r, s) {
    const o = t(), i = r.exit_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.exit_switch_x(n),
        y: r.exit_switch_y(n),
        animProgress: r.exit_anim_progress(n, s)
      };
      c && F_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function sr(t) {
    return u(H, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => u(Y_, {
        exitSwitch: e
      })
    });
  }
  const xe = 2;
  function Y_(t) {
    return (() => {
      var e = q_(), r = e.firstChild, s = r.nextSibling, o = s.nextSibling;
      return S((i) => {
        var _ = W_(t.exitSwitch), n = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, p = `M ${-2 * t.exitSwitch().animProgress} ${-xe} h ${-xe} v ${2 * xe} h ${xe}`, v = `M ${2 * t.exitSwitch().animProgress} ${-xe} h ${xe} v ${2 * xe} h ${-xe}`;
        return _ !== i.e && g(e, "transform", i.e = _), n !== i.t && g(r, "fill", i.t = n), c !== i.a && g(r, "stroke", i.a = c), p !== i.o && g(s, "d", i.o = p), v !== i.i && g(o, "d", i.i = v), i;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), e;
    })();
  }
  var X_ = m("<svg><use href=#one-way></svg>", false, true, false), J_ = m("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function Q_(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function el(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function tl([t, e], r) {
    const s = t(), o = r.one_ways_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.one_way_x(_),
        y: r.one_way_y(_),
        deg: r.one_way_deg(_)
      };
      n && Q_(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function nr(t) {
    return u(H, {
      get each() {
        return t.oneWays();
      },
      children: (e) => (() => {
        var r = X_();
        return S(() => g(r, "transform", el(e))), r;
      })()
    });
  }
  function or() {
    return (() => {
      var t = J_(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var rl = m("<svg><use></svg>", false, true, false), sl = m("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), nl = m("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), ol = m("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const il = 0, _l = 1;
  function ll(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function al(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function cl([t, e], r) {
    const s = t(), o = r.mines_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.mine_x(_),
        y: r.mine_y(_),
        type: r.mine_state(_)
      };
      n && ll(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function ir(t) {
    return u(H, {
      get each() {
        return t.mines();
      },
      children: (e) => (() => {
        var r = rl();
        return S((s) => {
          var o = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][e().type], i = al(e);
          return o !== s.e && g(r, "href", s.e = o), i !== s.t && g(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function _r() {
    return [
      (() => {
        var t = sl(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, o = s.nextSibling, i = o.nextSibling;
        return i.nextSibling, t;
      })(),
      (() => {
        var t = nl();
        return t.firstChild, t;
      })(),
      (() => {
        var t = ol();
        return t.firstChild, t;
      })()
    ];
  }
  var dl = m("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), ul = m("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), pl = m("<svg><g class=regular-door></svg>", false, true, false);
  function hl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function gl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function fl([t, e], r, s) {
    const o = t(), i = r.regular_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.regular_door_x(n),
        y: r.regular_door_y(n),
        deg: r.regular_door_deg(n),
        animProgress: r.regular_door_anim_progress(n, s)
      };
      c && hl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function lr(t) {
    return u(H, {
      get each() {
        return t.regularDoors();
      },
      children: (e) => u(ml, {
        regularDoor: e
      })
    });
  }
  const yl = 1, wl = 12 - yl;
  function ml(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (wl - 0) * r;
    }
    return (() => {
      var r = pl();
      return w(r, u(M, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var s = dl();
              return S(() => g(s, "x2", -e())), s;
            })(),
            (() => {
              var s = ul();
              return S(() => g(s, "x2", e())), s;
            })()
          ];
        }
      })), S(() => g(r, "transform", gl(t.regularDoor))), r;
    })();
  }
  var bl = m("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), xl = m("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), jt = m("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), vl = m("<svg><g class=locked-door></svg>", false, true, false);
  function $l(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function kl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Dl([t, e], r, s) {
    const o = t(), i = r.locked_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.locked_door_x(n),
        y: r.locked_door_y(n),
        deg: r.locked_door_deg(n),
        animProgress: r.locked_door_anim_progress(n, s)
      };
      c && $l(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function ar(t) {
    return u(H, {
      get each() {
        return t.lockedDoors();
      },
      children: (e) => u(Tl, {
        lockedDoor: e
      })
    });
  }
  const Sl = 1, Ll = 12 - Sl;
  function Tl(t) {
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
      return o = Math.min(Math.max((o - 0.4) / 0.6, 0), 1), 0 + (Ll - 0) * o;
    }
    return (() => {
      var o = vl();
      return w(o, u(M, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var i = bl();
              return S(() => g(i, "x2", -s())), i;
            })(),
            (() => {
              var i = xl();
              return S(() => g(i, "x2", s())), i;
            })()
          ];
        }
      }), null), w(o, u(M, {
        get when() {
          return t.lockedDoor().animProgress < 0.5;
        },
        get children() {
          return [
            (() => {
              var i = jt();
              return S((_) => {
                var n = e(), c = r();
                return n !== _.e && g(i, "x1", _.e = n), c !== _.t && g(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = jt();
              return S((_) => {
                var n = -e(), c = -r();
                return n !== _.e && g(i, "x1", _.e = n), c !== _.t && g(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      }), null), S(() => g(o, "transform", kl(t.lockedDoor))), o;
    })();
  }
  var Pl = m("<svg><use></svg>", false, true, false), El = m("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), jl = m("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function Cl(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function Al(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Nl([t, e], r) {
    const s = t(), o = r.locked_doors_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.locked_switch_x(_),
        y: r.locked_switch_y(_),
        wasTouched: r.locked_door_anim_progress(_, 1) >= 0
      };
      n && Cl(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function cr(t) {
    return u(H, {
      get each() {
        return t.lockedSwitches();
      },
      children: (e) => (() => {
        var r = Pl();
        return S((s) => {
          var o = e().wasTouched ? "#locked-switch-touched" : "#locked-switch", i = Al(e);
          return o !== s.e && g(r, "href", s.e = o), i !== s.t && g(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function dr() {
    return [
      (() => {
        var t = El(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = jl(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var Ml = m("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), Ct = m("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), Bl = m("<svg><g></svg>", false, true, false);
  function Il(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Ol(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Rl([t, e], r, s) {
    const o = t(), i = r.trap_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.trap_door_x(n),
        y: r.trap_door_y(n),
        deg: r.trap_door_deg(n),
        animProgress: r.trap_door_anim_progress(n, s)
      };
      c && Il(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function ur(t) {
    return u(H, {
      get each() {
        return t.trapDoors();
      },
      children: (e) => u(Hl, {
        trapDoor: e
      })
    });
  }
  const Kl = 1, Gl = 12 - Kl;
  function Hl(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function s() {
      let o = t.trapDoor().animProgress;
      return 0 + (Gl - 0) * o;
    }
    return (() => {
      var o = Bl();
      return w(o, u(M, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var i = Ml();
              return S((_) => {
                var n = -s(), c = s();
                return n !== _.e && g(i, "x1", _.e = n), c !== _.t && g(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = Ct();
              return S((_) => {
                var n = e(), c = r();
                return n !== _.e && g(i, "x1", _.e = n), c !== _.t && g(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = Ct();
              return S((_) => {
                var n = -e(), c = -r();
                return n !== _.e && g(i, "x1", _.e = n), c !== _.t && g(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      })), S(() => g(o, "transform", Ol(t.trapDoor))), o;
    })();
  }
  var zl = m("<svg><use></svg>", false, true, false), Vl = m("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), Ul = m("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function ql(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function Fl(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Wl([t, e], r) {
    const s = t(), o = r.trap_doors_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.trap_switch_x(_),
        y: r.trap_switch_y(_),
        wasTouched: r.trap_door_anim_progress(_, 1) >= 0
      };
      n && ql(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function pr(t) {
    return u(H, {
      get each() {
        return t.trapSwitches();
      },
      children: (e) => (() => {
        var r = zl();
        return S((s) => {
          var o = e().wasTouched ? "#trap-switch-touched" : "#trap-switch", i = Fl(e);
          return o !== s.e && g(r, "href", s.e = o), i !== s.t && g(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function hr() {
    return [
      (() => {
        var t = Vl();
        return t.firstChild, t;
      })(),
      (() => {
        var t = Ul(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var Zl = m("<svg><g><rect fill=var(--launch-pad-long) x=0 y=-7.5 width=1.5 height=15></rect><line stroke=var(--launch-pad-short) stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function Yl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Xl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Jl([t, e], r) {
    const s = t(), o = r.launch_pads_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.launch_pad_x(_),
        y: r.launch_pad_y(_),
        deg: r.launch_pad_deg(_)
      };
      n && Yl(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function gr(t) {
    return u(H, {
      get each() {
        return t.launchPads();
      },
      children: (e) => u(Ql, {
        launchPad: e
      })
    });
  }
  function Ql(t) {
    return (() => {
      var e = Zl(), r = e.firstChild;
      return r.nextSibling, S(() => g(e, "transform", Xl(t.launchPad))), e;
    })();
  }
  var ea = m('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function ta(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function ra(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function sa([t, e], r, s) {
    const o = t(), i = r.floor_guards_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.floor_guard_x(n, s),
        y: r.floor_guard_y(n, s),
        deg: r.floor_guard_deg(n)
      };
      c && ta(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function fr(t) {
    return u(H, {
      get each() {
        return t.floorGuards();
      },
      children: (e) => u(na, {
        floorGuard: e
      })
    });
  }
  function na(t) {
    return (() => {
      var e = ea();
      return e.firstChild, S(() => g(e, "transform", ra(t.floorGuard))), e;
    })();
  }
  var oa = m("<svg><use href=#bounceblock></svg>", false, true, false), ia = m('<svg><g id=bounceblock><path fill=var(--bounceblock-interior) d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path stroke=var(--bounceblock-border) d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function _a(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function la(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function aa([t, e], r, s) {
    const o = t(), i = r.bounce_blocks_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.bounce_block_x(n, s),
        y: r.bounce_block_y(n, s),
        deg: r.bounce_block_deg(n)
      };
      c && _a(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function yr(t) {
    return u(H, {
      get each() {
        return t.bounceBlocks();
      },
      children: (e) => (() => {
        var r = oa();
        return S(() => g(r, "transform", la(e))), r;
      })()
    });
  }
  function wr() {
    return (() => {
      var t = ia(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var ca = m("<svg><use href=#boostpad></svg>", false, true, false), da = m("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function ua(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function pa(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ha([t, e], r, s) {
    const o = t(), i = r.boost_pads_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.boost_pad_x(n),
        y: r.boost_pad_y(n),
        deg: r.boost_pad_deg(n, s),
        animProgress: r.boost_pad_anim_progress(n, s)
      };
      c && ua(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function mr(t) {
    return u(H, {
      get each() {
        return t.boostPads();
      },
      children: (e) => (() => {
        var r = ca();
        return S((s) => {
          var o = `color-mix(in srgb-linear, var(--boost-pad) ${e().animProgress * 100}%, var(--boost-pad-wooshing))`, i = pa(e);
          return o !== s.e && g(r, "stroke", s.e = o), i !== s.t && g(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function br() {
    return (() => {
      var t = da(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, o = s.nextSibling;
      return o.nextSibling, t;
    })();
  }
  var ga = m("<svg><use href=#thwump></svg>", false, true, false), fa = m('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function ya(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function wa(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ma([t, e], r, s) {
    const o = t(), i = r.thwumps_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.thwump_x(n, s),
        y: r.thwump_y(n, s),
        deg: r.thwump_deg(n)
      };
      c && ya(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function xr(t) {
    return u(H, {
      get each() {
        return t.thwumps();
      },
      children: (e) => (() => {
        var r = ga();
        return S(() => g(r, "transform", wa(e))), r;
      })()
    });
  }
  function vr() {
    return (() => {
      var t = fa(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var ba = m("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), xa = m("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function va(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function $a(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ka([t, e], r, s) {
    const o = t(), i = r.shove_thwumps_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.shove_thwump_x(n, s),
        y: r.shove_thwump_y(n, s),
        deg: r.shove_thwump_deg(n),
        touch: r.shove_thwump_touch(n)
      };
      c && va(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function $r(t) {
    return u(H, {
      get each() {
        return t.shoveThwumps();
      },
      children: (e) => u(Da, {
        shoveThwump: e
      })
    });
  }
  function Da(t) {
    return (() => {
      var e = ba(), r = e.firstChild;
      return w(e, u(bt, {
        each: [
          0,
          2,
          4,
          6
        ],
        children: (s) => u(M, {
          get when() {
            return t.shoveThwump().touch >= 16 || s === t.shoveThwump().touch;
          },
          get children() {
            var o = xa(), i = o.firstChild, _ = i.nextSibling;
            return _.nextSibling, g(o, "transform", `rotate(${45 * s},0,0)`), o;
          }
        })
      }), r), S(() => g(e, "transform", $a(t.shoveThwump))), e;
    })();
  }
  const kr = Dr((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function Sa(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function La(t) {
    const e = String.fromCharCode(...t);
    console.log("anim data length", t.byteLength), localStorage.setItem("animData", e);
  }
  function Ta(t) {
    const e = localStorage.getItem("animData");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.set_anim_data(r);
    }
  }
  const Pa = Dr(Ea, 1e3);
  function Ea(t) {
    const e = JSON.stringify(t);
    localStorage.setItem("palette", e);
  }
  function ja() {
    const t = localStorage.getItem("palette");
    if (t) try {
      const e = JSON.parse(t);
      if (typeof (e == null ? void 0 : e.name) == "string" && typeof (e == null ? void 0 : e.colors) == "object") return e;
    } catch {
      return;
    }
  }
  function Dr(t, e) {
    let r;
    return (...s) => {
      typeof r == "number" && clearTimeout(r), r = setTimeout(() => t(...s), e);
    };
  }
  const Ca = "" + new URL("palette-CZVUb4uS.png", import.meta.url).href, Sr = [
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
  ], At = [
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
  ], Nt = {
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
  }, Aa = {
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
  }, Na = (() => {
    const t = {};
    for (const e of At) {
      t[e] = 0;
      for (const r of At) Nt[r] < Nt[e] && (t[e] += Aa[r]);
    }
    return t;
  })(), Lr = [
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
  ], Ma = {
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
  let Tr;
  async function Ba() {
    const e = await (await fetch(Ca)).blob(), r = await createImageBitmap(e), s = document.createElement("canvas");
    s.width = r.width, s.height = r.height;
    const o = s.getContext("2d");
    o.drawImage(r, 0, 0), Tr = o;
  }
  function Pr(t) {
    const e = Tr, r = Sr.indexOf(t);
    if (!e || r < 0) return;
    const s = {};
    for (const o of Lr) {
      const { file: i, index: _ } = Ma[o], n = Na[i] + _, c = e.getImageData(n, r, 1, 1).data, p = `rgb(${c[0]} ${c[1]} ${c[2]})`;
      s[o] = p;
    }
    return s;
  }
  function Ia(t) {
    for (const e of Lr) document.body.style.setProperty(e, t[e]);
  }
  var Oa = m('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label>/<label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>attract<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox></label> | Object corners <select><option>square</option><option>rounded</option></select> | <label>Friction mod <input type=checkbox></label> | <select></select><input type=text style=float:right>'), Ra = m("<option>");
  function Ka(t) {
    return (() => {
      var e = Oa(), r = e.firstChild, s = r.firstChild, o = s.nextSibling, i = r.nextSibling, _ = i.nextSibling, n = _.firstChild, c = n.nextSibling, p = _.nextSibling, v = p.nextSibling, f = v.nextSibling, C = f.nextSibling, j = C.firstChild, I = j.nextSibling, R = C.nextSibling, z = R.nextSibling, G = z.firstChild, E = G.nextSibling, N = z.nextSibling, B = N.nextSibling, K = B.firstChild, Z = K.nextSibling, re = B.nextSibling, Q = re.nextSibling, ne = Q.nextSibling;
      return o.addEventListener("change", function() {
        const x = this.files;
        if (x && x.length > 0) {
          const D = new FileReader();
          D.onloadend = () => {
            D.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(D.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, D.readAsArrayBuffer(x[0]);
        }
      }), c.addEventListener("change", function() {
        const x = this.files;
        if (x && x.length > 0) {
          const D = new FileReader();
          D.onloadend = () => {
            if (D.result instanceof ArrayBuffer) {
              const U = t.editor.load_attract(new Uint8Array(D.result), t.roundCorners(), t.dynamicFriction());
              t.render(true), t.setLevelName(t.editor.get_level_name()), t.setReplay(U);
            }
          }, D.readAsArrayBuffer(x[0]);
        }
      }), v.$$click = function() {
        const x = t.editor.export_map(), D = new Blob([
          x.buffer
        ], {
          type: "application/octet-stream"
        }), U = URL.createObjectURL(D);
        this.href = U, this.download = t.editor.get_level_name().replaceAll(/[^a-z]/gi, "_"), setTimeout(() => URL.revokeObjectURL(U), 100);
      }, I.addEventListener("change", (x) => {
        t.setShowTrail(x.currentTarget.checked), t.editor.set_show_trail(x.currentTarget.checked);
      }), z.addEventListener("change", (x) => t.setRoundCorners(x.currentTarget.value == "rounded")), Z.addEventListener("change", (x) => {
        t.setDynamicFriction(x.currentTarget.checked);
      }), Q.addEventListener("change", (x) => {
        const D = Pr(x.currentTarget.value);
        D && t.setPalette({
          name: x.currentTarget.value,
          colors: D
        });
      }), w(Q, () => Sr.map((x) => (() => {
        var D = Ra();
        return w(D, x), S(() => {
          var _a2;
          return D.selected = x === (((_a2 = t.palette()) == null ? void 0 : _a2.name) ?? "vasquez");
        }), D;
      })())), ne.addEventListener("change", () => kr(t.editor)), ne.$$input = (x) => {
        t.editor.set_level_name(x.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, S((x) => {
        var D = !t.roundCorners(), U = t.roundCorners();
        return D !== x.e && (G.selected = x.e = D), U !== x.t && (E.selected = x.t = U), x;
      }, {
        e: void 0,
        t: void 0
      }), S(() => I.checked = t.showTrail()), S(() => Z.checked = t.dynamicFriction()), S(() => ne.value = t.levelName()), e;
    })();
  }
  nt([
    "click",
    "input"
  ]);
  var Ga = m("<svg><use href=#zapdrone></svg>", false, true, false), Ha = m('<svg><g id=zapdrone><path fill=var(--zap-drone-background) stroke=var(--zap-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--zap-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--zap-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false), za = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 1 12 12 a 12 12 0 0 1 -12 12 l 5 -5 m 0 10 l -5 -5"></svg>', false, true, false), Va = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 0 12 -12 a 12 12 0 0 0 -12 -12 l 5 5 m 0 -10 l -5 5"></svg>', false, true, false), Ua = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V 24 l -5 -5 m 10 0 l -5 5"></svg>', false, true, false), qa = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V -24 l -5 5 m 10 0 l -5 -5"></svg>', false, true, false), Fa = m("<svg><g></svg>", false, true, false);
  function Wa(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Za(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Ya([t, e], r, s) {
    const o = t(), i = r.zap_drones_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.zap_drone_x(n, s),
        y: r.zap_drone_y(n, s),
        deg: r.zap_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && Wa(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Er(t) {
    return u(H, {
      get each() {
        return t.zapDrones();
      },
      children: (e) => (() => {
        var r = Ga();
        return S(() => g(r, "transform", Za(e))), r;
      })()
    });
  }
  function jr() {
    return (() => {
      var t = Ha(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  function Xa({ entities: t }) {
    const e = () => t.zapDrones().at(0) ?? t.chaseDrones().at(0) ?? t.chaingunDrones().at(0) ?? t.laserDrones().at(0), r = (s) => {
      const o = s();
      if (o) {
        const { x: i, y: _, deg: n } = o;
        return `translate(${i},${_}) rotate(${n},0,0)`;
      } else return "";
    };
    return (() => {
      var s = Fa();
      return w(s, u(M, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 0;
        },
        get children() {
          return za();
        }
      }), null), w(s, u(M, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 1;
        },
        get children() {
          return Va();
        }
      }), null), w(s, u(M, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 2;
        },
        get children() {
          return Ua();
        }
      }), null), w(s, u(M, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 3;
        },
        get children() {
          return qa();
        }
      }), null), S(() => g(s, "transform", r(e))), s;
    })();
  }
  var Ja = m("<svg><use href=#chaingundrone></svg>", false, true, false), Qa = m('<svg><g id=chaingundrone><path fill=var(--chaingun-drone-background) stroke=var(--chaingun-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chaingun-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--chaingun-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function ec(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function tc(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function rc([t, e], r, s) {
    const o = t(), i = r.chaingun_drones_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.chaingun_drone_x(n, s),
        y: r.chaingun_drone_y(n, s),
        deg: r.chaingun_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && ec(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Cr(t) {
    return u(H, {
      get each() {
        return t.chaingunDrones();
      },
      children: (e) => (() => {
        var r = Ja();
        return S(() => g(r, "transform", tc(e))), r;
      })()
    });
  }
  function Ar() {
    return (() => {
      var t = Qa(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var sc = m("<svg><use href=#bat></svg>", false, true, false), nc = m("<svg><circle id=bat r=5 cx=0 cy=0 fill=var(--bat-body)></svg>", false, true, false);
  function oc(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function ic(t) {
    return u(H, {
      get each() {
        return t.bats();
      },
      children: (e) => (() => {
        var r = sc();
        return S(() => g(r, "transform", oc(e))), r;
      })()
    });
  }
  function _c() {
    return nc();
  }
  var lc = m("<svg><use href=#laserdrone></svg>", false, true, false), ac = m('<svg><g id=laserdrone><path fill=none stroke=var(--laser-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--laser-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--laser-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function cc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function dc(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function uc([t, e], r, s) {
    const o = t(), i = r.laser_drones_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.laser_drone_x(n, s),
        y: r.laser_drone_y(n, s),
        deg: r.laser_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && cc(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Nr(t) {
    return u(H, {
      get each() {
        return t.laserDrones();
      },
      children: (e) => (() => {
        var r = lc();
        return S(() => g(r, "transform", dc(e))), r;
      })()
    });
  }
  function Mr() {
    return (() => {
      var t = ac(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var pc = m("<svg><use href=#chasedrone></svg>", false, true, false), hc = m('<svg><g id=chasedrone><path fill=var(--chase-drone-background) stroke=var(--chase-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chase-drone-border) d="M 10 -3 H 3 A 3 3 0 0 0 0 0 A 3 3 0 0 0 3 3 H 10 Z"></path><path fill=none stroke=var(--chase-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function gc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function fc(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function yc([t, e], r, s) {
    const o = t(), i = r.chase_drones_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.chase_drone_x(n, s),
        y: r.chase_drone_y(n, s),
        deg: r.chase_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && gc(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Br(t) {
    return u(H, {
      get each() {
        return t.chaseDrones();
      },
      children: (e) => (() => {
        var r = pc();
        return S(() => g(r, "transform", fc(e))), r;
      })()
    });
  }
  function Ir() {
    return (() => {
      var t = hc(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var wc = m("<svg><use href=#gold></svg>", false, true, false), mc = m("<svg><g id=gold><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--gold-exterior) r=2.727272727272727></circle><circle fill=var(--gold-interior) r=1.9090909090909092></svg>", false, true, false);
  function bc(t, e) {
    return t.x === e.x && t.y === e.y && t.collected === e.collected;
  }
  function xc(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function vc([t, e], r) {
    const s = t(), o = r.golds_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.gold_x(_),
        y: r.gold_y(_),
        collected: r.gold_collected(_)
      };
      n && bc(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function Or(t) {
    return u(H, {
      get each() {
        return t.golds();
      },
      children: (e) => u(M, {
        get when() {
          return !e().collected;
        },
        get children() {
          var r = wc();
          return S(() => g(r, "transform", xc(e))), r;
        }
      })
    });
  }
  function Rr() {
    return (() => {
      var t = mc(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, o = s.nextSibling, i = o.nextSibling;
      return i.nextSibling, t;
    })();
  }
  var $c = m('<svg><rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"width=150 height=150 style=mix-blend-mode:hard-light></svg>', false, true, false), kc = m("<svg><circle fill=none stroke=var(--entity-palette-reticle) r=16></svg>", false, true, false), Dc = m('<svg><path d="M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12"fill-rule=evenodd fill="color-mix(in srgb,var(--background) 18%,white 15%)"style=mix-blend-mode:hard-light></svg>', false, true, false), Sc = m("<svg><rect fill=none stroke=var(--editor-crosshair) stroke-width=2 width=26 height=26></svg>", false, true, false), Lc = m("<svg><use href=#tilemode-crosshair></svg>", false, true, false), Tc = m("<svg><use href=#crosshair></svg>", false, true, false), Pc = m("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), Ec = m('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none>'), Mt = m("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), Bt = m("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), jc = m("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), Cc = m("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), Ac = m("<svg><line class=door-switch-line></svg>", false, true, false);
  const ut = 42, pt = 23, It = 0, Ot = 1, Nc = 3, Mc = 4, ht = 5, Rt = 6, Kt = 7, Bc = 8, gt = 9, Ic = 0, Oc = 1, Rc = 2, Kc = 3, Gc = 5, Hc = 6, zc = 8, Vc = 10, Uc = 11, qc = 12, Fc = 13, Wc = 14, Zc = 15, Yc = 16, Xc = 17, Jc = 20, Qc = 21, ed = 24, td = 27, rd = 28, sd = new Float64Array([
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
  ]), nd = new Float64Array([
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
  ]), Gt = 150;
  function Ht() {
    const [t, e] = y([]), [r, s] = y([]), [o, i] = y([]), [_, n] = y([]), [c, p] = y([]), [v, f] = y([]), [C, j] = y([]), [I, R] = y([]), [z, G] = y([]), [E, N] = y([]), [B, K] = y([]), [Z, re] = y([]), [Q, ne] = y([]), [x, D] = y([]), [U, oe] = y([]), [le, pe] = y([]), [ae, Y] = y([]), [T, X] = y([]), [se, ce] = y([]), [ie, he] = y([]), [d, h] = y([]), [Te, F] = y([]);
    return {
      ninjas: t,
      setNinjas: e,
      mines: r,
      setMines: s,
      golds: o,
      setGolds: i,
      exitDoors: _,
      setExitDoors: n,
      exitSwitches: c,
      setExitSwitches: p,
      regularDoors: v,
      setRegularDoors: f,
      lockedDoors: C,
      setLockedDoors: j,
      lockedSwitches: I,
      setLockedSwitches: R,
      trapDoors: z,
      setTrapDoors: G,
      trapSwitches: E,
      setTrapSwitches: N,
      launchPads: B,
      setLaunchPads: K,
      oneWays: Z,
      setOneWays: re,
      chaingunDrones: Q,
      setChaingunDrones: ne,
      laserDrones: x,
      setLaserDrones: D,
      zapDrones: U,
      setZapDrones: oe,
      chaseDrones: le,
      setChaseDrones: pe,
      floorGuards: ae,
      setFloorGuards: Y,
      bounceBlocks: T,
      setBounceBlocks: X,
      thwumps: se,
      setThwumps: ce,
      boostPads: ie,
      setBoostPads: he,
      bats: d,
      setBats: h,
      shoveThwumps: Te,
      setShoveThwumps: F
    };
  }
  function zt(t, e, r, s) {
    const o = [], i = [], _ = [], n = [], c = [], p = [], v = [], f = [], C = [], j = [], I = [], R = [], z = [], G = [], E = [], N = [], B = [], K = [], Z = [], re = [], Q = [], ne = [];
    for (const x of r) {
      const D = {
        x: x.x,
        y: x.y,
        deg: x.deg,
        mode: x.mode,
        animProgress: 0
      }, U = {
        x: x.switch_x,
        y: x.switch_y,
        animProgress: 0,
        wasTouched: false
      }, oe = {
        x1: x.x,
        y1: x.y,
        x2: x.switch_x,
        y2: x.switch_y
      };
      x.type_int === Ic ? o.push(D) : x.type_int === Oc ? i.push({
        ...D,
        type: il
      }) : x.type_int === Qc ? i.push({
        ...D,
        type: _l
      }) : x.type_int === Rc ? _.push({
        ...D,
        collected: false
      }) : x.type_int === Kc ? (n.push(D), Number.isNaN(x.switch_x) || (c.push(U), e.push(oe))) : x.type_int === Gc ? p.push(D) : x.type_int === Hc ? (v.push(D), Number.isNaN(x.switch_x) || (f.push(U), e.push(oe))) : x.type_int === zc ? (C.push({
        ...D,
        animProgress: s ? 1 : -1
      }), Number.isNaN(x.switch_x) || (j.push(U), e.push(oe))) : x.type_int === Vc ? I.push(D) : x.type_int === Uc ? R.push(D) : x.type_int === qc ? z.push(D) : x.type_int === Fc ? G.push(D) : x.type_int === Wc ? E.push(D) : x.type_int === Zc ? N.push(D) : x.type_int === Yc ? B.push(D) : x.type_int === Xc ? K.push(D) : x.type_int === Jc ? Z.push(D) : x.type_int === ed ? re.push({
        ...D,
        animProgress: 1
      }) : x.type_int === td ? Q.push(D) : x.type_int === rd && ne.push({
        ...D,
        touch: 16
      }), x.free();
    }
    t.setNinjas(o), t.setMines(i), t.setGolds(_), t.setExitDoors(n), t.setExitSwitches(c), t.setRegularDoors(p), t.setLockedDoors(v), t.setLockedSwitches(f), t.setTrapDoors(C), t.setTrapSwitches(j), t.setLaunchPads(I), t.setOneWays(R), t.setChaingunDrones(z), t.setLaserDrones(G), t.setZapDrones(E), t.setChaseDrones(N), t.setFloorGuards(B), t.setBounceBlocks(K), t.setThwumps(Z), t.setBoostPads(re), t.setBats(Q), t.setShoveThwumps(ne);
  }
  function Vt({ entities: t }) {
    return [
      u(rr, {
        get exitDoors() {
          return t.exitDoors;
        }
      }),
      u(nr, {
        get oneWays() {
          return t.oneWays;
        }
      }),
      u(ir, {
        get mines() {
          return t.mines;
        }
      }),
      u(lr, {
        get regularDoors() {
          return t.regularDoors;
        }
      }),
      u(ur, {
        get trapDoors() {
          return t.trapDoors;
        }
      }),
      u(ar, {
        get lockedDoors() {
          return t.lockedDoors;
        }
      }),
      u(cr, {
        get lockedSwitches() {
          return t.lockedSwitches;
        }
      }),
      u(pr, {
        get trapSwitches() {
          return t.trapSwitches;
        }
      }),
      u(Or, {
        get golds() {
          return t.golds;
        }
      }),
      u(sr, {
        get exitSwitches() {
          return t.exitSwitches;
        }
      }),
      u(gr, {
        get launchPads() {
          return t.launchPads;
        }
      }),
      u(Cr, {
        get chaingunDrones() {
          return t.chaingunDrones;
        }
      }),
      u(Nr, {
        get laserDrones() {
          return t.laserDrones;
        }
      }),
      u(Er, {
        get zapDrones() {
          return t.zapDrones;
        }
      }),
      u(Br, {
        get chaseDrones() {
          return t.chaseDrones;
        }
      }),
      u(fr, {
        get floorGuards() {
          return t.floorGuards;
        }
      }),
      u(ic, {
        get bats() {
          return t.bats;
        }
      }),
      u(xr, {
        get thwumps() {
          return t.thwumps;
        }
      }),
      u(bt, {
        get each() {
          return t.ninjas();
        },
        children: (e) => u(He, {
          class: "ninja",
          ninja: () => e,
          bones: () => sd
        })
      }),
      u(yr, {
        get bounceBlocks() {
          return t.bounceBlocks;
        }
      }),
      u($r, {
        get shoveThwumps() {
          return t.shoveThwumps;
        }
      }),
      u(mr, {
        get boostPads() {
          return t.boostPads;
        }
      })
    ];
  }
  function od(t) {
    const { editor: e, pastNinjas: r } = t, [s, o] = y(""), [i, _] = y(""), [n, c] = y(true), [p, v] = y(false), [f, C] = y(It), [j, I] = y({
      row: 1,
      col: 1
    }), [R, z] = y({
      x: 24,
      y: 24
    }), [G, E] = y(""), [N, B] = y({
      x: NaN,
      y: NaN
    }), [K, Z] = y({
      x: NaN,
      y: NaN
    }), re = Ht(), Q = Ht(), [ne, x] = y([]), [D, U] = y(e.get_show_trail()), [oe, le] = y(), pe = (d) => {
      let h = false;
      if (!(d.target instanceof HTMLInputElement || d.target instanceof HTMLSelectElement)) {
        if (d.ctrlKey || d.metaKey) {
          d.code === "KeyZ" && (d.ctrlKey || d.metaKey) && d.shiftKey ? (h = true, e.redo()) : d.code === "KeyZ" && (d.ctrlKey || d.metaKey) ? (h = true, e.undo()) : d.code === "KeyY" && (d.ctrlKey || d.metaKey) && (h = true, e.redo()), h && (Y(true), d.preventDefault());
          return;
        }
        d.shiftKey && (h = true, e.press_shift()), d.code === "Enter" && e.mode() === gt ? t.setReplay(e.to_replay(t.roundCorners(), t.dynamicFriction())) : d.code === "Backquote" ? (h = true, e.press_backtick()) : d.code === "Digit1" ? (h = true, e.press_1(d.shiftKey)) : d.code === "Digit2" ? (h = true, e.press_2(d.shiftKey)) : d.code === "Digit3" ? (h = true, e.press_3(d.shiftKey)) : d.code === "Digit4" ? (h = true, e.press_4(d.shiftKey)) : d.code === "Digit5" ? (h = true, e.press_5(d.shiftKey)) : d.code === "Digit6" ? (h = true, e.press_6(d.shiftKey)) : d.code === "Digit7" ? (h = true, e.press_7(d.shiftKey)) : d.code === "Digit8" ? (h = true, e.press_8(d.shiftKey)) : d.code === "Digit9" ? (h = true, e.press_9()) : d.code === "Digit0" ? (h = true, e.press_0()) : d.code === "Minus" ? (h = true, e.press_dash()) : d.code === "Equal" ? (h = true, e.press_equals()) : d.code === "KeyQ" ? (h = true, e.press_q(d.shiftKey)) : d.code === "KeyW" ? (h = true, e.press_w(d.shiftKey)) : d.code === "KeyA" ? (h = true, e.press_a(d.shiftKey)) : d.code === "KeyS" ? (h = true, e.press_s(d.shiftKey)) : d.code === "KeyE" ? (h = true, e.press_e()) : d.code === "KeyD" ? (h = true, e.press_d()) : d.code === "KeyZ" ? (h = true, e.press_z()) : d.code === "KeyX" ? (h = true, e.press_x()) : d.code === "KeyC" ? (h = true, e.press_c()) : d.code === "Space" ? (h = true, e.press_space()) : d.code === "AltLeft" ? (h = true, e.press_alt_left(d.shiftKey)) : d.code === "KeyR" ? (h = true, e.press_r()) : d.code === "KeyT" ? (h = true, e.press_t()) : d.code === "KeyY" ? (h = true, e.press_y()) : d.code === "KeyU" ? (h = true, e.press_u()) : d.code === "KeyI" ? (h = true, e.press_i()) : d.code === "KeyO" ? (h = true, e.press_o()) : d.code === "KeyP" ? (h = true, e.press_p()) : d.code === "BracketLeft" ? (h = true, e.press_bracket_left()) : d.code === "BracketRight" ? (h = true, e.press_bracket_right()) : d.code === "KeyF" ? (h = true, e.press_f()) : d.code === "KeyH" ? (h = true, e.press_h()) : d.code === "KeyJ" ? (h = true, e.press_j()) : d.code === "KeyK" ? (h = true, e.press_k()) : d.code === "KeyL" ? (h = true, e.press_l()) : d.code === "KeyN" ? (h = true, e.press_n()) : d.code === "KeyM" ? (h = true, e.press_m()) : d.code === "Comma" ? (h = true, e.press_comma()) : d.code === "ArrowUp" ? (h = true, e.press_up(d.shiftKey)) : d.code === "ArrowDown" ? (h = true, e.press_down(d.shiftKey)) : d.code === "ArrowLeft" ? (h = true, e.press_left(d.shiftKey)) : d.code === "ArrowRight" ? (h = true, e.press_right(d.shiftKey)) : d.code === "Enter" ? (h = true, e.press_enter()) : d.code === "Escape" ? h = e.press_escape() : d.code === "Slash" && (h = true, e.press_slash()), h && (Y(true), d.preventDefault());
      }
    }, ae = (d) => {
      let h = false;
      d.shiftKey || (h = true, e.release_shift()), d.code === "KeyQ" ? (h = true, e.release_q()) : d.code === "KeyW" ? (h = true, e.release_w()) : d.code === "KeyA" ? (h = true, e.release_a()) : d.code === "KeyS" ? (h = true, e.release_s()) : d.code === "KeyE" ? (h = true, e.release_e()) : d.code === "KeyD" ? (h = true, e.release_d()) : d.code === "KeyZ" ? (h = true, e.release_z()) : d.code === "KeyC" ? (h = true, e.release_c()) : d.code === "Space" ? (h = true, e.release_space()) : d.code === "AltLeft" && (h = true, e.release_alt_left()), h && (Y(false), d.preventDefault());
    };
    document.addEventListener("keydown", pe), document.addEventListener("keyup", ae), Se(() => {
      document.removeEventListener("keydown", pe), document.removeEventListener("keyup", ae);
    });
    function Y(d) {
      C(e.mode()), o(e.tiles_path()), _(e.selected_tiles_path()), I({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), v(e.show_quarter_grid()), z({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const h = [];
      zt(re, h, e.entities(), false), zt(Q, h, e.preview_entities(), true), x(h), E(e.selected_tile_outline_path()), B({
        x: e.palette_center_x(),
        y: e.palette_center_y()
      }), Z({
        x: e.palette_selection_x(),
        y: e.palette_selection_y()
      }), le(e.past_ninja_bones()), d && kr(e);
    }
    const T = [];
    for (let d = 0; d < ut - 1; d++) T.push(48 + 24 * d);
    const X = [];
    for (let d = 0; d < pt - 1; d++) X.push(48 + 24 * d);
    const se = [];
    for (let d = 0; d < ut; d++) se.push(36 + 24 * d);
    const ce = [];
    for (let d = 0; d < pt; d++) ce.push(36 + 24 * d);
    const ie = [];
    for (let d = 0; d < ut * 2; d++) ie.push(30 + 12 * d);
    const he = [];
    for (let d = 0; d < pt * 2; d++) he.push(30 + 12 * d);
    return Y(false), [
      (() => {
        var d = Ec(), h = d.firstChild, Te = h.firstChild, F = Te.nextSibling;
        F.nextSibling;
        var ge = h.nextSibling, $e = ge.nextSibling, be = $e.nextSibling, Oe = be.nextSibling, ot = Oe.firstChild;
        return d.$$contextmenu = (b) => {
          e.press_escape() && (Y(false), b.preventDefault());
        }, d.$$mouseup = () => {
          e.cursor_up(), Y(false);
        }, d.$$dblclick = (b) => {
          e.double_click(b.shiftKey), Y(false);
        }, d.$$mousedown = (b) => {
          b.buttons & 2 || (e.mode() === gt ? t.setReplay(e.to_replay(t.roundCorners(), t.dynamicFriction())) : (e.cursor_down(b.shiftKey), Y(true)));
        }, d.$$mousemove = function(b) {
          const { left: k, top: A, width: O, height: fe } = this.getBoundingClientRect(), Pe = e.set_cursor_pos((b.clientX - k) / O * 1056, (b.clientY - A) / fe * 600, b.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (b.clientX - k) / O * 1056,
            y: (b.clientY - A) / fe * 600
          }), Pe && Y(false);
        }, w(h, u(_r, {}), F), w(h, u(Rr, {}), F), w(h, u(or, {}), F), w(h, u(wr, {}), F), w(h, u(dr, {}), F), w(h, u(hr, {}), F), w(h, u(br, {}), F), w(h, u(vr, {}), F), w(h, u(Ar, {}), F), w(h, u(Mr, {}), F), w(h, u(jr, {}), F), w(h, u(Ir, {}), F), w(h, u(_c, {}), F), w(d, u(M, {
          get when() {
            return p();
          },
          get children() {
            return [
              Ne(() => ie.map((b) => (() => {
                var k = Mt();
                return g(k, "x1", b), g(k, "x2", b), k;
              })())),
              Ne(() => he.map((b) => (() => {
                var k = Bt();
                return g(k, "y1", b), g(k, "y2", b), k;
              })()))
            ];
          }
        }), ge), w(d, u(M, {
          get when() {
            return n();
          },
          get children() {
            return [
              Ne(() => se.map((b) => (() => {
                var k = Mt();
                return g(k, "x1", b), g(k, "x2", b), k;
              })())),
              Ne(() => ce.map((b) => (() => {
                var k = Bt();
                return g(k, "y1", b), g(k, "y2", b), k;
              })()))
            ];
          }
        }), ge), w(d, () => T.map((b) => (() => {
          var k = jc();
          return g(k, "x1", b), g(k, "x2", b), k;
        })()), ge), w(d, () => X.map((b) => (() => {
          var k = Cc();
          return g(k, "y1", b), g(k, "y2", b), k;
        })()), ge), w(d, u(Vt, {
          entities: re
        }), ge), w(d, u(M, {
          get when() {
            return f() === Kt;
          },
          get children() {
            var b = $c();
            return S((k) => {
              var A = N().x - Gt / 2, O = N().y - Gt / 2;
              return A !== k.e && g(b, "x", k.e = A), O !== k.t && g(b, "y", k.t = O), k;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), $e), w($e, u(Vt, {
          entities: Q
        })), w(d, u(M, {
          get when() {
            return [
              ht,
              Rt,
              Mc
            ].includes(f());
          },
          get children() {
            return u(Xa, {
              entities: Q
            });
          }
        }), be), w(d, u(M, {
          get when() {
            return f() === Kt;
          },
          get children() {
            var b = kc();
            return S((k) => {
              var A = K().x, O = K().y;
              return A !== k.e && g(b, "cx", k.e = A), O !== k.t && g(b, "cy", k.t = O), k;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), be), w(d, u(M, {
          get when() {
            return f() === Ot;
          },
          get children() {
            var b = Dc();
            return S(() => g(b, "transform", `translate(${N().x},${N().y})`)), b;
          }
        }), be), w(d, u(M, {
          get when() {
            return f() === Ot;
          },
          get children() {
            var b = Sc();
            return S((k) => {
              var A = K().x - 13, O = K().y - 13;
              return A !== k.e && g(b, "x", k.e = A), O !== k.t && g(b, "y", k.t = O), k;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), Oe), w(d, u(bt, {
          get each() {
            return ne();
          },
          children: (b) => (() => {
            var k = Ac();
            return S((A) => {
              var O = b.x1, fe = b.y1, Pe = b.x2, Ee = b.y2;
              return O !== A.e && g(k, "x1", A.e = O), fe !== A.t && g(k, "y1", A.t = fe), Pe !== A.a && g(k, "x2", A.a = Pe), Ee !== A.o && g(k, "y2", A.o = Ee), A;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), k;
          })()
        }), Oe), w(d, u(M, {
          get when() {
            return f() === It;
          },
          get children() {
            var b = Lc();
            return S((k) => {
              var A = j().col * 24 + 12, O = j().row * 24 + 12;
              return A !== k.e && g(b, "x", k.e = A), O !== k.t && g(b, "y", k.t = O), k;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), null), w(d, u(M, {
          get when() {
            return f() === Bc || f() === ht;
          },
          get children() {
            var b = Tc();
            return S((k) => {
              var A = R().x, O = R().y;
              return A !== k.e && g(b, "x", k.e = A), O !== k.t && g(b, "y", k.t = O), k;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), null), w(d, u(M, {
          get when() {
            return f() === gt;
          },
          get children() {
            return u(He, {
              class: "ninja",
              ninja: () => ({
                x: R().x,
                y: R().y,
                deg: 0
              }),
              bones: () => oe() ?? nd
            });
          }
        }), null), w(d, u(M, {
          get when() {
            return D();
          },
          get children() {
            var b = Pc();
            return S(() => g(b, "points", r().map(({ x: k, y: A }) => `${k},${A}`).join(" "))), b;
          }
        }), null), S((b) => {
          var k = s(), A = [
            Nc,
            ht,
            Rt
          ].includes(f()) ? "url(#outline)" : "", O = i(), fe = G();
          return k !== b.e && g(ge, "d", b.e = k), A !== b.t && g($e, "filter", b.t = A), O !== b.a && g(be, "d", b.a = O), fe !== b.o && g(ot, "d", b.o = fe), b;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), d;
      })(),
      u(Ka, {
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
        showTrail: D,
        setShowTrail: U,
        get dynamicFriction() {
          return t.dynamicFriction;
        },
        get setDynamicFriction() {
          return t.setDynamicFriction;
        }
      })
    ];
  }
  nt([
    "mousemove",
    "mousedown",
    "dblclick",
    "mouseup",
    "contextmenu"
  ]);
  var id = m("<div id=media-controls><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb></div></div><div><a href=# download=1234 style=color:var(--main-menu-selected);margin-left:1em>Export attract");
  function _d(t) {
    const e = () => {
      const n = t.progress(), c = t.length();
      return c === 0 || n >= c ? "100%" : `${n / c * 100}%`;
    }, r = () => {
      const n = t.progress(), c = t.previewProgress(), p = t.length();
      if (c === void 0 || p === 0) return {
        left: "0%",
        width: "0%"
      };
      const v = Math.min(n, c), f = Math.min(Math.max(n, c), p);
      return {
        left: `${v / p * 100}%`,
        width: `${(f - v) / p * 100}%`
      };
    };
    let s;
    document.addEventListener("mousemove", i), Se(() => document.removeEventListener("mousemove", i)), document.addEventListener("mouseup", _), Se(() => document.removeEventListener("mouseup", _));
    function o(n) {
      if (s) {
        const { left: c, top: p, width: v } = s.getBoundingClientRect();
        let f = (n.clientX - c) / v;
        f = Math.min(1, f), f = Math.max(0, f);
        let C = Math.abs(n.clientY - p);
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
          const { targetFrame: p, strength: v } = o(n);
          t.seek(Math.round(c + (p - c) * v)), t.previewSeek(void 0);
        } else s.matches(":hover") ? t.previewSeek(o(n).targetFrame) : t.previewSeek(void 0);
      }
    }
    function _() {
      t.setDragStart(void 0);
    }
    return (() => {
      var n = id(), c = n.firstChild, p = c.firstChild, v = c.nextSibling, f = v.firstChild, C = f.nextSibling, j = C.nextSibling, I = j.nextSibling, R = v.nextSibling, z = R.firstChild;
      c.$$click = () => {
        t.isPlaying() ? t.setIsPlaying(false) : (t.progress() >= t.length() && t.seek(0), t.setIsPlaying(true));
      }, w(p, u(Jr, {
        get children() {
          return [
            u(kt, {
              get when() {
                return !t.isPlaying();
              },
              children: "\u25B6"
            }),
            u(kt, {
              get when() {
                return t.isPlaying();
              },
              children: "\u23F8"
            })
          ];
        }
      })), v.$$mousedown = (E) => {
        t.setDragStart(o(E).targetFrame), i(E), E.preventDefault();
      };
      var G = s;
      return typeof G == "function" ? ts(G, v) : s = v, z.$$click = function() {
        const E = t.attract(), N = new Blob([
          E.buffer
        ], {
          type: "application/octet-stream"
        }), B = URL.createObjectURL(N);
        this.href = B, setTimeout(() => URL.revokeObjectURL(B), 100);
      }, S((E) => {
        var N = e(), B = r().left, K = r().width, Z = e();
        return N !== E.e && qe(C, "width", E.e = N), B !== E.t && qe(j, "left", E.t = B), K !== E.a && qe(j, "width", E.a = K), Z !== E.o && qe(I, "left", E.o = Z), E;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), n;
    })();
  }
  nt([
    "click",
    "mousedown"
  ]);
  var ld = m("<svg><circle r=1.5 fill=var(--background)></svg>", false, true, false), ad = m('<svg><path d="M -3 1 L 0 -3 L 3 1 L 0 -1 Z"fill=none stroke-width=3 stroke-linecap=round stroke-linejoin=round></svg>', false, true, false), cd = m("<svg><g></svg>", false, true, false);
  function dd(t) {
    return [
      u(H, {
        get each() {
          return t.inputs();
        },
        children: (e, r) => (() => {
          var s = cd();
          return w(s, u(M, {
            get when() {
              return !(e() > 0);
            },
            get children() {
              var o = ld();
              return S(() => g(o, "opacity", Number.isNaN(e()) ? 0.3 : 1)), o;
            }
          }), null), w(s, u(M, {
            get when() {
              return e() > 0;
            },
            get children() {
              var o = ad();
              return S(() => g(o, "stroke", `oklch(60% 80% ${pd(e())}deg)`)), o;
            }
          }), null), S(() => g(s, "transform", `translate(${36 + 24 * r},${24 * 24.5}) rotate(${ud(e())},0,0)`)), s;
        })()
      }),
      u(H, {
        get each() {
          return t.pastNinjas();
        },
        children: (e, r) => u(M, {
          get when() {
            return e().length;
          },
          get children() {
            return u(He, {
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
  function ud(t) {
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
  function pd(t) {
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
  var hd = m("<span style=position:absolute>"), gd = m("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), fd = m('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), yd = m("<div>");
  function wd(t) {
    const e = t.replay, [r, s] = y(true), [o, i] = y(!e.is_from_attract()), [_, n] = y(void 0), [c, p] = y(0), [v, f] = y(0), [C, j] = y(void 0), [I, R] = y(5400), z = ($) => {
      if ($.code === "Enter") e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), o() || je(1);
      else if ($.code === "Escape") o() ? (i(false), s(false), G()) : (i(true), s(true));
      else if ($.code === "Comma") {
        if (!o() && v() > 0) {
          f(v() - 1), e.seek(v());
          let { isJump1Pressed: P, isJump2Pressed: L, isRightPressed: J, isLeftPressed: de, isDownPressed: ye, isSuicidePressed: we } = t.globalEventState;
          P() || L() || J() || de() || we() ? e.set_input(P() || L(), J(), de(), we()) : ye() && e.set_input(false, false, false, false), G(), je(1);
        }
      } else if ($.code === "Period" && !o()) {
        let { isJump1Pressed: P, isJump2Pressed: L, isRightPressed: J, isLeftPressed: de, isDownPressed: ye, isSuicidePressed: we } = t.globalEventState;
        P() || L() || J() || de() || we() ? e.set_input(P() || L(), J(), de(), we()) : (ye() || e.inputs_len() === e.progress()) && e.set_input(false, false, false, false), e.tick(), f(e.progress()), G(), je(1);
      }
    };
    function G() {
      e.seek_preview(e.progress() + 120), j(e.progress_preview()), O(), Ee(), b();
    }
    document.addEventListener("keydown", z), Se(() => {
      document.removeEventListener("keydown", z);
    });
    const E = () => e.tiles_path(), [N, B] = y({
      x: -50,
      y: -50,
      deg: 0
    }), [K, Z] = y({
      x: -50,
      y: -50,
      deg: 0
    }), [re, Q] = y(), [ne, x] = y(), D = y([]), U = y([]), oe = y([]), le = y([]), pe = y([]), ae = y([]), Y = y([]), T = y([]), X = y([]), se = y([]), ce = y([]), ie = y([]), he = y([]), d = y([]), h = y([]), Te = y([]), F = y([]), ge = y([]), $e = y([]), be = y([]), [Oe, ot] = y([]);
    function b() {
      const $ = [], P = e.past_ninjas_len();
      for (let L = 0; L < P; L++) $.push({
        x: e.past_ninja_x(L),
        y: e.past_ninja_y(L)
      });
      ot($);
    }
    b();
    const [k, A] = y([]);
    function O() {
      const $ = [];
      for (let P = -21; P < 21; P++) {
        const L = P + e.progress();
        L < 0 || L >= e.inputs_len() ? $.push(NaN) : $.push(e.input(L));
      }
      A($);
    }
    O();
    const [fe, Pe] = y([]);
    function Ee() {
      const $ = [];
      for (let P = -20; P <= 20; P++) {
        const L = P + e.progress();
        $.push(e.past_ninja_bones(L));
      }
      Pe($);
    }
    Ee();
    let xt = performance.now();
    const it = 1e3 / 60;
    let Ue = 0, vt = 0;
    function $t() {
      const $ = performance.now(), P = Math.min($ - xt, 250);
      xt = $;
      let L = 1;
      const J = e;
      if (o() && _() === void 0) {
        if (r() || v() < c()) {
          for (Ue += P; Ue >= it; ) {
            if (r()) {
              let { isJump1Pressed: de, isJump2Pressed: ye, isRightPressed: we, isLeftPressed: _t, isSuicidePressed: Kr } = t.globalEventState;
              J.set_input(de() || ye(), we(), _t(), Kr());
            }
            J.tick(), O(), Ue -= it;
          }
          L = Ue / it, f(J.progress());
        } else v() < c() ? (J.tick(), f(J.progress())) : i(false);
        je(L);
      }
      vt = requestAnimationFrame($t);
    }
    $t(), Se(() => {
      cancelAnimationFrame(vt);
    });
    function je($) {
      R(e.score()), B({
        x: e.ninja_x($),
        y: e.ninja_y($),
        deg: 0
      }), Z({
        x: e.ninja_preview_x($),
        y: e.ninja_preview_y($),
        deg: 0
      }), Q(e.ninja_bones($)), C() === void 0 ? x(void 0) : x(e.ninja_preview_bones($)), cl(D, e), vc(U, e), aa(oe, e, $), tl(le, e), ha(pe, e, $), ma(ae, e, $), Jl(Y, e), sa(T, e, $), Dl(X, e, $), Nl(se, e), Rl(ce, e, $), Wl(ie, e), fl(he, e, $), ka(d, e, $), z_(h, e, $), Z_(Te, e, $), Ya(F, e, $), yc(ge, e, $), rc($e, e, $), uc(be, e, $), p(e.replay_length());
    }
    return [
      (() => {
        var $ = hd();
        return w($, () => (I() / 60).toFixed(3)), $;
      })(),
      (() => {
        var $ = fd(), P = $.firstChild;
        P.firstChild;
        var L = P.nextSibling;
        return $.$$mousemove = function(J) {
          const { left: de, top: ye, width: we, height: _t } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (J.clientX - de) / we * 1056,
            y: (J.clientY - ye) / _t * 600
          });
        }, w(P, u(_r, {}), null), w(P, u(Rr, {}), null), w(P, u(wr, {}), null), w(P, u(or, {}), null), w(P, u(dr, {}), null), w(P, u(hr, {}), null), w(P, u(br, {}), null), w(P, u(vr, {}), null), w(P, u(Ar, {}), null), w(P, u(Mr, {}), null), w(P, u(jr, {}), null), w(P, u(Ir, {}), null), w(P, u(U_, {}), null), w($, u(rr, {
          get exitDoors() {
            return h[0];
          }
        }), L), w($, u(nr, {
          get oneWays() {
            return le[0];
          }
        }), L), w($, u(ir, {
          get mines() {
            return D[0];
          }
        }), L), w($, u(lr, {
          get regularDoors() {
            return he[0];
          }
        }), L), w($, u(ar, {
          get lockedDoors() {
            return X[0];
          }
        }), L), w($, u(ur, {
          get trapDoors() {
            return ce[0];
          }
        }), L), w($, u(cr, {
          get lockedSwitches() {
            return se[0];
          }
        }), L), w($, u(pr, {
          get trapSwitches() {
            return ie[0];
          }
        }), L), w($, u(Or, {
          get golds() {
            return U[0];
          }
        }), L), w($, u(sr, {
          get exitSwitches() {
            return Te[0];
          }
        }), L), w($, u(gr, {
          get launchPads() {
            return Y[0];
          }
        }), L), w($, u(Cr, {
          get chaingunDrones() {
            return $e[0];
          }
        }), L), w($, u(Nr, {
          get laserDrones() {
            return be[0];
          }
        }), L), w($, u(Er, {
          get zapDrones() {
            return F[0];
          }
        }), L), w($, u(Br, {
          get chaseDrones() {
            return ge[0];
          }
        }), L), w($, u(fr, {
          get floorGuards() {
            return T[0];
          }
        }), L), w($, u(xr, {
          get thwumps() {
            return ae[0];
          }
        }), L), w($, u(He, {
          class: "ninja preview",
          ninja: K,
          bones: ne
        }), L), w($, u(He, {
          class: "ninja",
          ninja: N,
          bones: re
        }), L), w($, u(yr, {
          get bounceBlocks() {
            return oe[0];
          }
        }), L), w($, u($r, {
          get shoveThwumps() {
            return d[0];
          }
        }), L), w($, u(mr, {
          get boostPads() {
            return pe[0];
          }
        }), L), w($, u(M, {
          get when() {
            return !o();
          },
          get children() {
            return [
              (() => {
                var J = gd();
                return S(() => g(J, "points", Oe().slice(v(), C() || 0).map(({ x: de, y: ye }) => `${de},${ye}`).join(" "))), J;
              })(),
              u(dd, {
                inputs: k,
                pastNinjas: fe
              })
            ];
          }
        }), null), S(() => g(L, "d", E())), $;
      })(),
      (() => {
        var $ = yd();
        return w($, u(M, {
          get when() {
            return !r() || !o();
          },
          get children() {
            return u(_d, {
              isPlaying: o,
              setIsPlaying: i,
              dragStart: _,
              setDragStart: n,
              length: c,
              progress: v,
              previewProgress: C,
              seek: (P) => {
                f(P), e.seek(P), O(), Ee(), b(), je(1);
              },
              previewSeek: (P) => {
                j(P), b(), e && (P !== void 0 && _() === void 0 && e.seek_preview(P), je(1));
              },
              attract: () => e.export_attract(t.editor)
            });
          }
        })), $;
      })()
    ];
  }
  nt([
    "mousemove"
  ]);
  var md = m("<p>Invalid file."), bd = m("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file><dl><dt>Windows</dt><dd>C:\\Program Files (x86)\\Steam\\steamapps\\common\\N++\\anim_data_line_new.txt.bin</dd><dt>Linux</dt><dd>~/.steam/steam/steamapps/common/N++/anim_data_line_new.txt.bin</dd><dt>Mac</dt><dd>~/Library/Application Support/Steam/steamapps/common/N++/N++.app/Contents/Resources/NPP/anim_data_line_new.txt.bin");
  function xd() {
    const t = Le.new(), [e, r] = y(), [s, o] = y(""), [i, _] = y(false), [n, c] = y(false), [p, v] = y([]);
    function f() {
      const T = [], X = t.past_ninjas_len();
      for (let se = 0; se < X; se++) T.push({
        x: t.past_ninja_x(se),
        y: t.past_ninja_y(se)
      });
      v(T);
    }
    const [C, j] = y(false), [I, R] = y(false), [z, G] = y(false), [E, N] = y(false), [B, K] = y(false), [Z, re] = y(false), [Q, ne] = y({
      x: 36,
      y: 36
    }), x = {
      isJump1Pressed: C,
      isJump2Pressed: I,
      isRightPressed: z,
      isLeftPressed: E,
      isSuicidePressed: B,
      isDownPressed: Z,
      mouseGamePos: Q,
      setMouseGamePos: ne
    };
    Sa(t), o(t.get_level_name()), document.addEventListener("keydown", (T) => {
      if (!(T.ctrlKey || T.metaKey)) if (T.code === "Tab") {
        const X = e();
        X ? (r(void 0), X.send_past_ninjas(), t.receive_past_ninjas(), X.free(), f()) : r(t.to_replay(i(), n())), T.preventDefault();
      } else T.code === "KeyZ" ? j(true) : T.code === "ArrowUp" ? R(true) : T.code === "ArrowRight" ? G(true) : T.code === "ArrowLeft" ? N(true) : T.code === "ArrowDown" ? re(true) : T.code === "KeyV" && K(true);
    }), document.addEventListener("keyup", (T) => {
      T.code === "KeyZ" ? j(false) : T.code === "ArrowUp" ? R(false) : T.code === "ArrowRight" ? G(false) : T.code === "ArrowLeft" ? N(false) : T.code === "ArrowDown" ? re(false) : T.code === "KeyV" && K(false);
    }), document.addEventListener("blur", () => {
      j(false), R(false), G(false), N(false), K(false), re(false);
    }), Ta(t);
    const D = 0, U = 1, oe = 2, [le, pe] = y(t.get_anim_state() == D ? D : oe), [ae, Y] = y(ja());
    return Vr(() => {
      const T = ae();
      T && (Ia(T.colors), Pa(T));
    }), Ba().then(() => {
      const T = ae();
      if (T) {
        const X = Pr(T.name);
        X && (T.colors = X), Y(T);
      }
    }), [
      u(M, {
        get when() {
          return le() != D;
        },
        get children() {
          var T = bd(), X = T.firstChild, se = X.nextSibling;
          return se.nextSibling, se.addEventListener("change", function() {
            const ce = this.files;
            if (ce && ce.length > 0) {
              const ie = new FileReader();
              ie.onloadend = () => {
                if (ie.result instanceof ArrayBuffer) {
                  const he = new Uint8Array(ie.result);
                  try {
                    try {
                      La(he);
                    } catch (d) {
                      console.error(d);
                    }
                    t.set_anim_data(he), pe(t.get_anim_state());
                  } catch (d) {
                    console.error(d), pe(U);
                  }
                }
              }, ie.readAsArrayBuffer(ce[0]);
            }
          }), w(T, u(M, {
            get when() {
              return le() == U;
            },
            get children() {
              return md();
            }
          }), null), T;
        }
      }),
      u(M, {
        get when() {
          return Ne(() => le() == D)() && !e();
        },
        get children() {
          return u(od, {
            editor: t,
            setReplay: r,
            pastNinjas: p,
            globalEventState: x,
            levelName: s,
            setLevelName: o,
            roundCorners: i,
            setRoundCorners: _,
            palette: ae,
            setPalette: Y,
            dynamicFriction: n,
            setDynamicFriction: c
          });
        }
      }),
      u(M, {
        get when() {
          return Ne(() => le() == D)() && !!e();
        },
        keyed: true,
        get children() {
          return u(wd, {
            get replay() {
              return e();
            },
            editor: t,
            globalEventState: x
          });
        }
      })
    ];
  }
  const vd = document.getElementById("root");
  es(() => u(xd, {}), vd);
})();
