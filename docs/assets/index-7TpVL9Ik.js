(async () => {
  (function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const _ of document.querySelectorAll('link[rel="modulepreload"]')) n(_);
    new MutationObserver((_) => {
      for (const l of _) if (l.type === "childList") for (const i of l.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && n(i);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function r(_) {
      const l = {};
      return _.integrity && (l.integrity = _.integrity), _.referrerPolicy && (l.referrerPolicy = _.referrerPolicy), _.crossOrigin === "use-credentials" ? l.credentials = "include" : _.crossOrigin === "anonymous" ? l.credentials = "omit" : l.credentials = "same-origin", l;
    }
    function n(_) {
      if (_.ep) return;
      _.ep = true;
      const l = r(_);
      fetch(_.href, l);
    }
  })();
  const Vn = false, Un = (t, e) => t === e, br = Symbol("solid-track"), mt = {
    equals: Un
  };
  let vr = Sr;
  const Ne = 1, xt = 2, kr = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var ie = null;
  let Pt = null, zn = null, oe = null, pe = null, Pe = null, St = 0;
  function Ye(t, e) {
    const r = oe, n = ie, _ = t.length === 0, l = e === void 0 ? n : e, i = _ ? kr : {
      owned: null,
      cleanups: null,
      context: l ? l.context : null,
      owner: l
    }, s = _ ? t : () => t(() => ve(() => Qe(i)));
    ie = i, oe = null;
    try {
      return nt(s, true);
    } finally {
      oe = r, ie = n;
    }
  }
  function y(t, e) {
    e = e ? Object.assign({}, mt, e) : mt;
    const r = {
      value: t,
      observers: null,
      observerSlots: null,
      comparator: e.equals || void 0
    }, n = (_) => (typeof _ == "function" && (_ = _(r.value)), Dr(r, _));
    return [
      $r.bind(r),
      n
    ];
  }
  function $(t, e, r) {
    const n = Ht(t, e, false, Ne);
    rt(n);
  }
  function qn(t, e, r) {
    vr = Wn;
    const n = Ht(t, e, false, Ne);
    n.user = true, Pe ? Pe.push(n) : rt(n);
  }
  function me(t, e, r) {
    r = r ? Object.assign({}, mt, r) : mt;
    const n = Ht(t, e, true, 0);
    return n.observers = null, n.observerSlots = null, n.comparator = r.equals || void 0, rt(n), $r.bind(n);
  }
  function ve(t) {
    if (oe === null) return t();
    const e = oe;
    oe = null;
    try {
      return t();
    } finally {
      oe = e;
    }
  }
  function Oe(t) {
    return ie === null || (ie.cleanups === null ? ie.cleanups = [
      t
    ] : ie.cleanups.push(t)), t;
  }
  function Yn(t) {
    const e = me(t), r = me(() => Rt(e()));
    return r.toArray = () => {
      const n = r();
      return Array.isArray(n) ? n : n != null ? [
        n
      ] : [];
    }, r;
  }
  function $r() {
    if (this.sources && this.state) if (this.state === Ne) rt(this);
    else {
      const t = pe;
      pe = null, nt(() => vt(this), false), pe = t;
    }
    if (oe) {
      const t = this.observers ? this.observers.length : 0;
      oe.sources ? (oe.sources.push(this), oe.sourceSlots.push(t)) : (oe.sources = [
        this
      ], oe.sourceSlots = [
        t
      ]), this.observers ? (this.observers.push(oe), this.observerSlots.push(oe.sources.length - 1)) : (this.observers = [
        oe
      ], this.observerSlots = [
        oe.sources.length - 1
      ]);
    }
    return this.value;
  }
  function Dr(t, e, r) {
    let n = t.value;
    return (!t.comparator || !t.comparator(n, e)) && (t.value = e, t.observers && t.observers.length && nt(() => {
      for (let _ = 0; _ < t.observers.length; _ += 1) {
        const l = t.observers[_], i = Pt && Pt.running;
        i && Pt.disposed.has(l), (i ? !l.tState : !l.state) && (l.pure ? pe.push(l) : Pe.push(l), l.observers && jr(l)), i || (l.state = Ne);
      }
      if (pe.length > 1e6) throw pe = [], new Error();
    }, false)), e;
  }
  function rt(t) {
    if (!t.fn) return;
    Qe(t);
    const e = St;
    Zn(t, t.value, e);
  }
  function Zn(t, e, r) {
    let n;
    const _ = ie, l = oe;
    oe = ie = t;
    try {
      n = t.fn(e);
    } catch (i) {
      return t.pure && (t.state = Ne, t.owned && t.owned.forEach(Qe), t.owned = null), t.updatedAt = r + 1, Tr(i);
    } finally {
      oe = l, ie = _;
    }
    (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? Dr(t, n) : t.value = n, t.updatedAt = r);
  }
  function Ht(t, e, r, n = Ne, _) {
    const l = {
      fn: t,
      state: n,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: e,
      owner: ie,
      context: ie ? ie.context : null,
      pure: r
    };
    return ie === null || ie !== kr && (ie.owned ? ie.owned.push(l) : ie.owned = [
      l
    ]), l;
  }
  function bt(t) {
    if (t.state === 0) return;
    if (t.state === xt) return vt(t);
    if (t.suspense && ve(t.suspense.inFallback)) return t.suspense.effects.push(t);
    const e = [
      t
    ];
    for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < St); ) t.state && e.push(t);
    for (let r = e.length - 1; r >= 0; r--) if (t = e[r], t.state === Ne) rt(t);
    else if (t.state === xt) {
      const n = pe;
      pe = null, nt(() => vt(t, e[0]), false), pe = n;
    }
  }
  function nt(t, e) {
    if (pe) return t();
    let r = false;
    e || (pe = []), Pe ? r = true : Pe = [], St++;
    try {
      const n = t();
      return Fn(r), n;
    } catch (n) {
      r || (Pe = null), pe = null, Tr(n);
    }
  }
  function Fn(t) {
    if (pe && (Sr(pe), pe = null), t) return;
    const e = Pe;
    Pe = null, e.length && nt(() => vr(e), false);
  }
  function Sr(t) {
    for (let e = 0; e < t.length; e++) bt(t[e]);
  }
  function Wn(t) {
    let e, r = 0;
    for (e = 0; e < t.length; e++) {
      const n = t[e];
      n.user ? t[r++] = n : bt(n);
    }
    for (e = 0; e < r; e++) bt(t[e]);
  }
  function vt(t, e) {
    t.state = 0;
    for (let r = 0; r < t.sources.length; r += 1) {
      const n = t.sources[r];
      if (n.sources) {
        const _ = n.state;
        _ === Ne ? n !== e && (!n.updatedAt || n.updatedAt < St) && bt(n) : _ === xt && vt(n, e);
      }
    }
  }
  function jr(t) {
    for (let e = 0; e < t.observers.length; e += 1) {
      const r = t.observers[e];
      r.state || (r.state = xt, r.pure ? pe.push(r) : Pe.push(r), r.observers && jr(r));
    }
  }
  function Qe(t) {
    let e;
    if (t.sources) for (; t.sources.length; ) {
      const r = t.sources.pop(), n = t.sourceSlots.pop(), _ = r.observers;
      if (_ && _.length) {
        const l = _.pop(), i = r.observerSlots.pop();
        n < _.length && (l.sourceSlots[i] = n, _[n] = l, r.observerSlots[n] = i);
      }
    }
    if (t.tOwned) {
      for (e = t.tOwned.length - 1; e >= 0; e--) Qe(t.tOwned[e]);
      delete t.tOwned;
    }
    if (t.owned) {
      for (e = t.owned.length - 1; e >= 0; e--) Qe(t.owned[e]);
      t.owned = null;
    }
    if (t.cleanups) {
      for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
      t.cleanups = null;
    }
    t.state = 0;
  }
  function Xn(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function Tr(t, e = ie) {
    throw Xn(t);
  }
  function Rt(t) {
    if (typeof t == "function" && !t.length) return Rt(t());
    if (Array.isArray(t)) {
      const e = [];
      for (let r = 0; r < t.length; r++) {
        const n = Rt(t[r]);
        Array.isArray(n) ? e.push.apply(e, n) : e.push(n);
      }
      return e;
    }
    return t;
  }
  const It = Symbol("fallback");
  function kt(t) {
    for (let e = 0; e < t.length; e++) t[e]();
  }
  function Jn(t, e, r = {}) {
    let n = [], _ = [], l = [], i = 0, s = e.length > 1 ? [] : null;
    return Oe(() => kt(l)), () => {
      let c = t() || [], h = c.length, k, x;
      return c[br], ve(() => {
        let A, V, U, re, ne, q, O, Y, G;
        if (h === 0) i !== 0 && (kt(l), l = [], n = [], _ = [], i = 0, s && (s = [])), r.fallback && (n = [
          It
        ], _[0] = Ye((de) => (l[0] = de, r.fallback())), i = 1);
        else if (i === 0) {
          for (_ = new Array(h), x = 0; x < h; x++) n[x] = c[x], _[x] = Ye(T);
          i = h;
        } else {
          for (U = new Array(h), re = new Array(h), s && (ne = new Array(h)), q = 0, O = Math.min(i, h); q < O && n[q] === c[q]; q++) ;
          for (O = i - 1, Y = h - 1; O >= q && Y >= q && n[O] === c[Y]; O--, Y--) U[Y] = _[O], re[Y] = l[O], s && (ne[Y] = s[O]);
          for (A = /* @__PURE__ */ new Map(), V = new Array(Y + 1), x = Y; x >= q; x--) G = c[x], k = A.get(G), V[x] = k === void 0 ? -1 : k, A.set(G, x);
          for (k = q; k <= O; k++) G = n[k], x = A.get(G), x !== void 0 && x !== -1 ? (U[x] = _[k], re[x] = l[k], s && (ne[x] = s[k]), x = V[x], A.set(G, x)) : l[k]();
          for (x = q; x < h; x++) x in U ? (_[x] = U[x], l[x] = re[x], s && (s[x] = ne[x], s[x](x))) : _[x] = Ye(T);
          _ = _.slice(0, i = h), n = c.slice(0);
        }
        return _;
      });
      function T(A) {
        if (l[x] = A, s) {
          const [V, U] = y(x);
          return s[x] = U, e(c[x], V);
        }
        return e(c[x]);
      }
    };
  }
  function Qn(t, e, r = {}) {
    let n = [], _ = [], l = [], i = [], s = 0, c;
    return Oe(() => kt(l)), () => {
      const h = t() || [], k = h.length;
      return h[br], ve(() => {
        if (k === 0) return s !== 0 && (kt(l), l = [], n = [], _ = [], s = 0, i = []), r.fallback && (n = [
          It
        ], _[0] = Ye((T) => (l[0] = T, r.fallback())), s = 1), _;
        for (n[0] === It && (l[0](), l = [], n = [], _ = [], s = 0), c = 0; c < k; c++) c < n.length && n[c] !== h[c] ? i[c](() => h[c]) : c >= n.length && (_[c] = Ye(x));
        for (; c < n.length; c++) l[c]();
        return s = i.length = l.length = k, n = h.slice(0), _ = _.slice(0, s);
      });
      function x(T) {
        l[c] = T;
        const [A, V] = y(h[c]);
        return i[c] = V, e(A, c);
      }
    };
  }
  function d(t, e) {
    return ve(() => t(e || {}));
  }
  const Lr = (t) => `Stale read from <${t}>.`;
  function et(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return me(Jn(() => t.each, t.children, e || void 0));
  }
  function K(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return me(Qn(() => t.each, t.children, e || void 0));
  }
  function R(t) {
    const e = t.keyed, r = me(() => t.when, void 0, void 0), n = e ? r : me(r, void 0, {
      equals: (_, l) => !_ == !l
    });
    return me(() => {
      const _ = n();
      if (_) {
        const l = t.children;
        return typeof l == "function" && l.length > 0 ? ve(() => l(e ? _ : () => {
          if (!ve(n)) throw Lr("Show");
          return r();
        })) : l;
      }
      return t.fallback;
    }, void 0, void 0);
  }
  function Pr(t) {
    const e = Yn(() => t.children), r = me(() => {
      const n = e(), _ = Array.isArray(n) ? n : [
        n
      ];
      let l = () => {
      };
      for (let i = 0; i < _.length; i++) {
        const s = i, c = _[i], h = l, k = me(() => h() ? void 0 : c.when, void 0, void 0), x = c.keyed ? k : me(k, void 0, {
          equals: (T, A) => !T == !A
        });
        l = () => h() || (x() ? [
          s,
          k,
          c
        ] : void 0);
      }
      return l;
    });
    return me(() => {
      const n = r()();
      if (!n) return t.fallback;
      const [_, l, i] = n, s = i.children;
      return typeof s == "function" && s.length > 0 ? ve(() => s(i.keyed ? l() : () => {
        var _a2;
        if (((_a2 = ve(r)()) == null ? void 0 : _a2[0]) !== _) throw Lr("Match");
        return l();
      })) : s;
    }, void 0, void 0);
  }
  function Xe(t) {
    return t;
  }
  const qe = (t) => me(() => t());
  function es(t, e, r) {
    let n = r.length, _ = e.length, l = n, i = 0, s = 0, c = e[_ - 1].nextSibling, h = null;
    for (; i < _ || s < l; ) {
      if (e[i] === r[s]) {
        i++, s++;
        continue;
      }
      for (; e[_ - 1] === r[l - 1]; ) _--, l--;
      if (_ === i) {
        const k = l < n ? s ? r[s - 1].nextSibling : r[l - s] : c;
        for (; s < l; ) t.insertBefore(r[s++], k);
      } else if (l === s) for (; i < _; ) (!h || !h.has(e[i])) && e[i].remove(), i++;
      else if (e[i] === r[l - 1] && r[s] === e[_ - 1]) {
        const k = e[--_].nextSibling;
        t.insertBefore(r[s++], e[i++].nextSibling), t.insertBefore(r[--l], k), e[_] = r[l];
      } else {
        if (!h) {
          h = /* @__PURE__ */ new Map();
          let x = s;
          for (; x < l; ) h.set(r[x], x++);
        }
        const k = h.get(e[i]);
        if (k != null) if (s < k && k < l) {
          let x = i, T = 1, A;
          for (; ++x < _ && x < l && !((A = h.get(e[x])) == null || A !== k + T); ) T++;
          if (T > k - s) {
            const V = e[i];
            for (; s < k; ) t.insertBefore(r[s++], V);
          } else t.replaceChild(r[s++], e[i++]);
        } else i++;
        else e[i++].remove();
      }
    }
  }
  const Wt = "_$DX_DELEGATE";
  function ts(t, e, r, n = {}) {
    let _;
    return Ye((l) => {
      _ = l, e === document ? t() : g(e, t(), e.firstChild ? null : void 0, r);
    }, n.owner), () => {
      _(), e.textContent = "";
    };
  }
  function f(t, e, r, n) {
    let _;
    const l = () => {
      const s = n ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
      return s.innerHTML = t, r ? s.content.firstChild.firstChild : n ? s.firstChild : s.content.firstChild;
    }, i = e ? () => ve(() => document.importNode(_ || (_ = l()), true)) : () => (_ || (_ = l())).cloneNode(true);
    return i.cloneNode = i, i;
  }
  function jt(t, e = window.document) {
    const r = e[Wt] || (e[Wt] = /* @__PURE__ */ new Set());
    for (let n = 0, _ = t.length; n < _; n++) {
      const l = t[n];
      r.has(l) || (r.add(l), e.addEventListener(l, ns));
    }
  }
  function p(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function lt(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function rs(t, e, r) {
    return ve(() => t(e, r));
  }
  function g(t, e, r, n) {
    if (r !== void 0 && !n && (n = []), typeof e != "function") return $t(t, e, n, r);
    $((_) => $t(t, e(), _, r), n);
  }
  function ns(t) {
    let e = t.target;
    const r = `$$${t.type}`, n = t.target, _ = t.currentTarget, l = (c) => Object.defineProperty(t, "target", {
      configurable: true,
      value: c
    }), i = () => {
      const c = e[r];
      if (c && !e.disabled) {
        const h = e[`${r}Data`];
        if (h !== void 0 ? c.call(e, h, t) : c.call(e, t), t.cancelBubble) return;
      }
      return e.host && typeof e.host != "string" && !e.host._$host && e.contains(t.target) && l(e.host), true;
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
      l(c[0]);
      for (let h = 0; h < c.length - 2 && (e = c[h], !!i()); h++) {
        if (e._$host) {
          e = e._$host, s();
          break;
        }
        if (e.parentNode === _) break;
      }
    } else s();
    l(n);
  }
  function $t(t, e, r, n, _) {
    for (; typeof r == "function"; ) r = r();
    if (e === r) return r;
    const l = typeof e, i = n !== void 0;
    if (t = i && r[0] && r[0].parentNode || t, l === "string" || l === "number") {
      if (l === "number" && (e = e.toString(), e === r)) return r;
      if (i) {
        let s = r[0];
        s && s.nodeType === 3 ? s.data !== e && (s.data = e) : s = document.createTextNode(e), r = Ve(t, r, n, s);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || l === "boolean") r = Ve(t, r, n);
    else {
      if (l === "function") return $(() => {
        let s = e();
        for (; typeof s == "function"; ) s = s();
        r = $t(t, s, r, n);
      }), () => r;
      if (Array.isArray(e)) {
        const s = [], c = r && Array.isArray(r);
        if (Bt(s, e, r, _)) return $(() => r = $t(t, s, r, n, true)), () => r;
        if (s.length === 0) {
          if (r = Ve(t, r, n), i) return r;
        } else c ? r.length === 0 ? Xt(t, s, n) : es(t, r, s) : (r && Ve(t), Xt(t, s));
        r = s;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (i) return r = Ve(t, r, n, e);
          Ve(t, r, null, e);
        } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
        r = e;
      }
    }
    return r;
  }
  function Bt(t, e, r, n) {
    let _ = false;
    for (let l = 0, i = e.length; l < i; l++) {
      let s = e[l], c = r && r[t.length], h;
      if (!(s == null || s === true || s === false)) if ((h = typeof s) == "object" && s.nodeType) t.push(s);
      else if (Array.isArray(s)) _ = Bt(t, s, c) || _;
      else if (h === "function") if (n) {
        for (; typeof s == "function"; ) s = s();
        _ = Bt(t, Array.isArray(s) ? s : [
          s
        ], Array.isArray(c) ? c : [
          c
        ]) || _;
      } else t.push(s), _ = true;
      else {
        const k = String(s);
        c && c.nodeType === 3 && c.data === k ? t.push(c) : t.push(document.createTextNode(k));
      }
    }
    return _;
  }
  function Xt(t, e, r = null) {
    for (let n = 0, _ = e.length; n < _; n++) t.insertBefore(e[n], r);
  }
  function Ve(t, e, r, n) {
    if (r === void 0) return t.textContent = "";
    const _ = n || document.createTextNode("");
    if (e.length) {
      let l = false;
      for (let i = e.length - 1; i >= 0; i--) {
        const s = e[i];
        if (_ !== s) {
          const c = s.parentNode === t;
          !l && !i ? c ? t.replaceChild(_, s) : t.insertBefore(_, r) : c && s.remove();
        } else l = true;
      }
    } else t.insertBefore(_, r);
    return [
      _
    ];
  }
  const ss = "" + new URL("ntools_rs_bg-QjcSSTBZ.wasm", import.meta.url).href, os = async (t = {}, e) => {
    let r;
    if (e.startsWith("data:")) {
      const n = e.replace(/^data:.*?base64,/, "");
      let _;
      if (typeof Buffer == "function" && typeof Buffer.from == "function") _ = Buffer.from(n, "base64");
      else if (typeof atob == "function") {
        const l = atob(n);
        _ = new Uint8Array(l.length);
        for (let i = 0; i < l.length; i++) _[i] = l.charCodeAt(i);
      } else throw new Error("Cannot decode base64-encoded data URL");
      r = await WebAssembly.instantiate(_, t);
    } else {
      const n = await fetch(e), _ = n.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && _.startsWith("application/wasm")) r = await WebAssembly.instantiateStreaming(n, t);
      else {
        const l = await n.arrayBuffer();
        r = await WebAssembly.instantiate(l, t);
      }
    }
    return r.instance.exports;
  };
  let o;
  function is(t) {
    o = t;
  }
  let at = null;
  function Ze() {
    return (at === null || at.byteLength === 0) && (at = new Uint8Array(o.memory.buffer)), at;
  }
  let wt = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  wt.decode();
  const _s = 2146435072;
  let Et = 0;
  function ls(t, e) {
    return Et += e, Et >= _s && (wt = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), wt.decode(), Et = e), wt.decode(Ze().subarray(t, t + e));
  }
  function Le(t, e) {
    return t = t >>> 0, ls(t, e);
  }
  function Ot(t, e) {
    return t = t >>> 0, Ze().subarray(t / 1, t / 1 + e);
  }
  let Me = 0;
  function ct(t, e) {
    const r = e(t.length * 1, 1) >>> 0;
    return Ze().set(t, r / 1), Me = t.length, r;
  }
  function We(t) {
    const e = o.__wbindgen_externrefs.get(t);
    return o.__externref_table_dealloc(t), e;
  }
  const Je = new TextEncoder();
  "encodeInto" in Je || (Je.encodeInto = function(t, e) {
    const r = Je.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function as(t, e, r) {
    if (r === void 0) {
      const s = Je.encode(t), c = e(s.length, 1) >>> 0;
      return Ze().subarray(c, c + s.length).set(s), Me = s.length, c;
    }
    let n = t.length, _ = e(n, 1) >>> 0;
    const l = Ze();
    let i = 0;
    for (; i < n; i++) {
      const s = t.charCodeAt(i);
      if (s > 127) break;
      l[_ + i] = s;
    }
    if (i !== n) {
      i !== 0 && (t = t.slice(i)), _ = r(_, n, n = i + t.length * 3, 1) >>> 0;
      const s = Ze().subarray(_ + i, _ + n), c = Je.encodeInto(t, s);
      i += c.written, _ = r(_, n, i, 1) >>> 0;
    }
    return Me = i, _;
  }
  let dt = null;
  function cs() {
    return (dt === null || dt.byteLength === 0) && (dt = new Float64Array(o.memory.buffer)), dt;
  }
  function ze(t, e) {
    return t = t >>> 0, cs().subarray(t / 8, t / 8 + e);
  }
  let Ue = null;
  function ds() {
    return (Ue === null || Ue.buffer.detached === true || Ue.buffer.detached === void 0 && Ue.buffer !== o.memory.buffer) && (Ue = new DataView(o.memory.buffer)), Ue;
  }
  function Jt(t, e) {
    t = t >>> 0;
    const r = ds(), n = [];
    for (let _ = t; _ < t + 4 * e; _ += 4) n.push(o.__wbindgen_externrefs.get(r.getUint32(_, true)));
    return o.__externref_drop_slice(t, e), n;
  }
  function us(t, e) {
    if (!(t instanceof e)) throw new Error(`expected instance of ${e.name}`);
  }
  const Qt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => o.__wbg_editor_free(t >>> 0, 1));
  class Ge {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Ge.prototype);
      return r.__wbg_ptr = e, Qt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Qt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      o.__wbg_editor_free(e, 0);
    }
    export_map() {
      const e = o.editor_export_map(this.__wbg_ptr);
      var r = Ot(e[0], e[1]).slice();
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
        return e = n[0], r = n[1], Le(n[0], n[1]);
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
      const _ = ct(e, o.__wbindgen_malloc), l = Me, i = o.editor_load_attract(this.__wbg_ptr, _, l, r, n);
      if (i[2]) throw We(i[1]);
      return Be.__wrap(i[0]);
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
      const r = ct(e, o.__wbindgen_malloc), n = Me;
      o.editor_set_anim_data(this.__wbg_ptr, r, n);
    }
    get_anim_state() {
      return o.editor_get_anim_state(this.__wbg_ptr) >>> 0;
    }
    get_level_name() {
      let e, r;
      try {
        const n = o.editor_get_level_name(this.__wbg_ptr);
        return e = n[0], r = n[1], Le(n[0], n[1]);
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
      const r = as(e, o.__wbindgen_malloc, o.__wbindgen_realloc), n = Me;
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
      var r = ze(e[0], e[1]).slice();
      return o.__wbindgen_free(e[0], e[1] * 8, 8), r;
    }
    preview_entities() {
      const e = o.editor_preview_entities(this.__wbg_ptr);
      var r = Jt(e[0], e[1]).slice();
      return o.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    release_alt_left() {
      o.editor_release_alt_left(this.__wbg_ptr);
    }
    load_outte_replay(e, r, n) {
      const _ = ct(e, o.__wbindgen_malloc), l = Me, i = o.editor_load_outte_replay(this.__wbg_ptr, _, l, r, n);
      if (i[2]) throw We(i[1]);
      return Be.__wrap(i[0]);
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
        return e = n[0], r = n[1], Le(n[0], n[1]);
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
        return e = n[0], r = n[1], Le(n[0], n[1]);
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
        return e = n[0], r = n[1], Le(n[0], n[1]);
      } finally {
        o.__wbindgen_free(e, r, 1);
      }
    }
    static new() {
      const e = o.editor_new();
      return Ge.__wrap(e);
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
      o.editor_press_u(this.__wbg_ptr);
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
      var r = Jt(e[0], e[1]).slice();
      return o.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    load_map(e) {
      const r = ct(e, o.__wbindgen_malloc), n = Me, _ = o.editor_load_map(this.__wbg_ptr, r, n);
      if (_[1]) throw We(_[0]);
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
      if (n[2]) throw We(n[1]);
      return Be.__wrap(n[0]);
    }
  }
  Symbol.dispose && (Ge.prototype[Symbol.dispose] = Ge.prototype.free);
  const er = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => o.__wbg_exportedentity_free(t >>> 0, 1));
  class tt {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(tt.prototype);
      return r.__wbg_ptr = e, er.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, er.unregister(this), e;
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
  Symbol.dispose && (tt.prototype[Symbol.dispose] = tt.prototype.free);
  const tr = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => o.__wbg_replay_free(t >>> 0, 1));
  class Be {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Be.prototype);
      return r.__wbg_ptr = e, tr.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, tr.unregister(this), e;
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
    ninja_form() {
      return o.replay_ninja_form(this.__wbg_ptr) >>> 0;
    }
    ninja_info() {
      let e, r;
      try {
        const n = o.replay_ninja_info(this.__wbg_ptr);
        return e = n[0], r = n[1], Le(n[0], n[1]);
      } finally {
        o.__wbindgen_free(e, r, 1);
      }
    }
    rocket_deg(e) {
      return o.replay_rocket_deg(this.__wbg_ptr, e);
    }
    thwump_deg(e) {
      return o.replay_thwump_deg(this.__wbg_ptr, e);
    }
    tiles_path() {
      let e, r;
      try {
        const n = o.replay_tiles_path(this.__wbg_ptr);
        return e = n[0], r = n[1], Le(n[0], n[1]);
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
    gauss_aim_x(e) {
      return o.replay_gauss_aim_x(this.__wbg_ptr, e);
    }
    gauss_aim_y(e) {
      return o.replay_gauss_aim_y(this.__wbg_ptr, e);
    }
    gauss_state(e) {
      return o.replay_gauss_state(this.__wbg_ptr, e) >>> 0;
    }
    ninja_bones(e) {
      const r = o.replay_ninja_bones(this.__wbg_ptr, e);
      var n = ze(r[0], r[1]).slice();
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
    rockets_len() {
      return o.replay_rockets_len(this.__wbg_ptr) >>> 0;
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
    rocket_state(e) {
      return o.replay_rocket_state(this.__wbg_ptr, e) >>> 0;
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
    export_replay() {
      const e = o.replay_export_replay(this.__wbg_ptr);
      if (e[3]) throw We(e[2]);
      var r = Ot(e[0], e[1]).slice();
      return o.__wbindgen_free(e[0], e[1] * 1, 1), r;
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
      us(e, Ge);
      const r = o.replay_export_attract(this.__wbg_ptr, e.__wbg_ptr);
      var n = Ot(r[0], r[1]).slice();
      return o.__wbindgen_free(r[0], r[1] * 1, 1), n;
    }
    gauss_turret_x(e) {
      return o.replay_gauss_turret_x(this.__wbg_ptr, e);
    }
    gauss_turret_y(e) {
      return o.replay_gauss_turret_y(this.__wbg_ptr, e);
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
    rocket_morph_x(e) {
      return o.replay_rocket_morph_x(this.__wbg_ptr, e);
    }
    rocket_morph_y(e) {
      return o.replay_rocket_morph_y(this.__wbg_ptr, e);
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
    rocket_turret_x(e) {
      return o.replay_rocket_turret_x(this.__wbg_ptr, e);
    }
    rocket_turret_y(e) {
      return o.replay_rocket_turret_y(this.__wbg_ptr, e);
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
      return r[0] !== 0 && (n = ze(r[0], r[1]).slice(), o.__wbindgen_free(r[0], r[1] * 8, 8)), n;
    }
    evil_ninja_scale(e) {
      return o.replay_evil_ninja_scale(this.__wbg_ptr, e);
    }
    floor_guards_len() {
      return o.replay_floor_guards_len(this.__wbg_ptr) >>> 0;
    }
    gauss_aim_region(e) {
      return o.replay_gauss_aim_region(this.__wbg_ptr, e) >>> 0;
    }
    laser_drones_len() {
      return o.replay_laser_drones_len(this.__wbg_ptr) >>> 0;
    }
    locked_doors_len() {
      return o.replay_locked_doors_len(this.__wbg_ptr) >>> 0;
    }
    past_ninja_bones(e) {
      const r = o.replay_past_ninja_bones(this.__wbg_ptr, e);
      var n = ze(r[0], r[1]).slice();
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
    ninja_preview_deg() {
      return o.replay_ninja_preview_deg(this.__wbg_ptr);
    }
    regular_doors_len() {
      return o.replay_regular_doors_len(this.__wbg_ptr) >>> 0;
    }
    rocket_morphs_len() {
      return o.replay_rocket_morphs_len(this.__wbg_ptr) >>> 0;
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
      var r = ze(e[0], e[1]).slice();
      return o.__wbindgen_free(e[0], e[1] * 8, 8), r;
    }
    preview_ninja_form() {
      return o.replay_preview_ninja_form(this.__wbg_ptr) >>> 0;
    }
    shove_thwump_touch(e) {
      return o.replay_shove_thwump_touch(this.__wbg_ptr, e);
    }
    chaingun_drones_len() {
      return o.replay_chaingun_drones_len(this.__wbg_ptr) >>> 0;
    }
    ninja_preview_bones(e) {
      const r = o.replay_ninja_preview_bones(this.__wbg_ptr, e);
      var n = ze(r[0], r[1]).slice();
      return o.__wbindgen_free(r[0], r[1] * 8, 8), n;
    }
    gauss_shot_endpoint_x(e) {
      const r = o.replay_gauss_shot_endpoint_x(this.__wbg_ptr, e);
      return r[0] === 0 ? void 0 : r[1];
    }
    gauss_shot_endpoint_y(e) {
      const r = o.replay_gauss_shot_endpoint_y(this.__wbg_ptr, e);
      return r[0] === 0 ? void 0 : r[1];
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
    rocket_x(e, r) {
      return o.replay_rocket_x(this.__wbg_ptr, e, r);
    }
    rocket_y(e, r) {
      return o.replay_rocket_y(this.__wbg_ptr, e, r);
    }
    thwump_x(e, r) {
      return o.replay_thwump_x(this.__wbg_ptr, e, r);
    }
    thwump_y(e, r) {
      return o.replay_thwump_y(this.__wbg_ptr, e, r);
    }
    gauss_len() {
      return o.replay_gauss_len(this.__wbg_ptr) >>> 0;
    }
    golds_len() {
      return o.replay_golds_len(this.__wbg_ptr) >>> 0;
    }
    mines_len() {
      return o.replay_mines_len(this.__wbg_ptr) >>> 0;
    }
    ninja_deg() {
      return o.replay_ninja_deg(this.__wbg_ptr);
    }
    one_way_x(e) {
      return o.replay_one_way_x(this.__wbg_ptr, e);
    }
    one_way_y(e) {
      return o.replay_one_way_y(this.__wbg_ptr, e);
    }
    set_input(e, r, n, _) {
      o.replay_set_input(this.__wbg_ptr, e, r, n, _);
    }
  }
  Symbol.dispose && (Be.prototype[Symbol.dispose] = Be.prototype.free);
  function ps(t, e) {
    throw new Error(Le(t, e));
  }
  function hs(t) {
    return tt.__wrap(t);
  }
  function gs(t, e) {
    return Le(t, e);
  }
  function fs() {
    const t = o.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const a = await os({
    "./ntools_rs_bg.js": {
      __wbg_exportedentity_new: hs,
      __wbg___wbindgen_throw_b855445ff6a94295: ps,
      __wbindgen_init_externref_table: fs,
      __wbindgen_cast_2241b6af4c4b2941: gs
    }
  }, ss), ys = a.memory, ws = a.__wbg_editor_free, ms = a.editor_crosshair_x, xs = a.editor_crosshair_y, bs = a.editor_cursor_down, vs = a.editor_cursor_up, ks = a.editor_double_click, $s = a.editor_entities, Ds = a.editor_export_map, Ss = a.editor_fill_with_mines, js = a.editor_get_anim_state, Ts = a.editor_get_level_name, Ls = a.editor_get_show_trail, Ps = a.editor_load_attract, Es = a.editor_load_map, Ms = a.editor_load_outte_replay, As = a.editor_loop_locations_path, Ns = a.editor_mode, Cs = a.editor_new, Rs = a.editor_palette_center_x, Is = a.editor_palette_center_y, Bs = a.editor_palette_selection_x, Os = a.editor_palette_selection_y, Gs = a.editor_past_ninja_bones, Hs = a.editor_past_ninja_x, Ks = a.editor_past_ninja_y, Vs = a.editor_past_ninjas_len, Us = a.editor_press_0, zs = a.editor_press_1, qs = a.editor_press_2, Ys = a.editor_press_3, Zs = a.editor_press_4, Fs = a.editor_press_5, Ws = a.editor_press_6, Xs = a.editor_press_7, Js = a.editor_press_8, Qs = a.editor_press_9, eo = a.editor_press_a, to = a.editor_press_alt_left, ro = a.editor_press_b, no = a.editor_press_backtick, so = a.editor_press_bracket_left, oo = a.editor_press_bracket_right, io = a.editor_press_c, _o = a.editor_press_comma, lo = a.editor_press_d, ao = a.editor_press_dash, co = a.editor_press_down, uo = a.editor_press_e, po = a.editor_press_enter, ho = a.editor_press_equals, go = a.editor_press_escape, fo = a.editor_press_f, yo = a.editor_press_h, wo = a.editor_press_i, mo = a.editor_press_j, xo = a.editor_press_k, bo = a.editor_press_l, vo = a.editor_press_left, ko = a.editor_press_m, $o = a.editor_press_n, Do = a.editor_press_num_0, So = a.editor_press_num_1, jo = a.editor_press_num_3, To = a.editor_press_num_4, Lo = a.editor_press_num_7, Po = a.editor_press_o, Eo = a.editor_press_p, Mo = a.editor_press_q, Ao = a.editor_press_r, No = a.editor_press_right, Co = a.editor_press_s, Ro = a.editor_press_shift, Io = a.editor_press_slash, Bo = a.editor_press_space, Oo = a.editor_press_t, Go = a.editor_press_u, Ho = a.editor_press_up, Ko = a.editor_press_w, Vo = a.editor_press_x, Uo = a.editor_press_y, zo = a.editor_press_z, qo = a.editor_preview_entities, Yo = a.editor_receive_past_ninjas, Zo = a.editor_redo, Fo = a.editor_release_a, Wo = a.editor_release_alt_left, Xo = a.editor_release_c, Jo = a.editor_release_d, Qo = a.editor_release_e, ei = a.editor_release_q, ti = a.editor_release_s, ri = a.editor_release_shift, ni = a.editor_release_space, si = a.editor_release_w, oi = a.editor_release_z, ii = a.editor_selected_tile_outline_path, _i = a.editor_selected_tiles_path, li = a.editor_set_anim_data, ai = a.editor_set_cursor_pos, ci = a.editor_set_level_name, di = a.editor_set_show_trail, ui = a.editor_set_start_replay_paused, pi = a.editor_show_half_grid, hi = a.editor_show_quarter_grid, gi = a.editor_tile_crosshair_col, fi = a.editor_tile_crosshair_row, yi = a.editor_tiles_path, wi = a.editor_to_replay, mi = a.editor_undo, xi = a.__wbg_exportedentity_free, bi = a.__wbg_get_exportedentity_deg, vi = a.__wbg_get_exportedentity_deg2, ki = a.__wbg_get_exportedentity_mode, $i = a.__wbg_get_exportedentity_mode2, Di = a.__wbg_get_exportedentity_stack_count, Si = a.__wbg_get_exportedentity_switch_x, ji = a.__wbg_get_exportedentity_switch_y, Ti = a.__wbg_get_exportedentity_type_int, Li = a.__wbg_get_exportedentity_x, Pi = a.__wbg_get_exportedentity_y, Ei = a.__wbg_set_exportedentity_deg, Mi = a.__wbg_set_exportedentity_deg2, Ai = a.__wbg_set_exportedentity_mode, Ni = a.__wbg_set_exportedentity_mode2, Ci = a.__wbg_set_exportedentity_stack_count, Ri = a.__wbg_set_exportedentity_switch_x, Ii = a.__wbg_set_exportedentity_switch_y, Bi = a.__wbg_set_exportedentity_type_int, Oi = a.__wbg_set_exportedentity_x, Gi = a.__wbg_set_exportedentity_y, Hi = a.__wbg_replay_free, Ki = a.replay_boost_pad_anim_progress, Vi = a.replay_boost_pad_deg, Ui = a.replay_boost_pad_x, zi = a.replay_boost_pad_y, qi = a.replay_boost_pads_len, Yi = a.replay_bounce_block_deg, Zi = a.replay_bounce_block_x, Fi = a.replay_bounce_block_y, Wi = a.replay_bounce_blocks_len, Xi = a.replay_chaingun_drone_deg, Ji = a.replay_chaingun_drone_x, Qi = a.replay_chaingun_drone_y, e_ = a.replay_chaingun_drones_len, t_ = a.replay_chase_drone_deg, r_ = a.replay_chase_drone_x, n_ = a.replay_chase_drone_y, s_ = a.replay_chase_drones_len, o_ = a.replay_deathball_x, i_ = a.replay_deathball_y, __ = a.replay_deathballs_len, l_ = a.replay_evil_ninja_bones, a_ = a.replay_evil_ninja_deg, c_ = a.replay_evil_ninja_scale, d_ = a.replay_evil_ninja_type, u_ = a.replay_evil_ninja_x, p_ = a.replay_evil_ninja_y, h_ = a.replay_evil_ninjas_len, g_ = a.replay_exit_anim_progress, f_ = a.replay_exit_door_x, y_ = a.replay_exit_door_y, w_ = a.replay_exit_doors_len, m_ = a.replay_exit_switch_x, x_ = a.replay_exit_switch_y, b_ = a.replay_export_attract, v_ = a.replay_export_replay, k_ = a.replay_floor_guard_deg, $_ = a.replay_floor_guard_x, D_ = a.replay_floor_guard_y, S_ = a.replay_floor_guards_len, j_ = a.replay_gauss_aim_region, T_ = a.replay_gauss_aim_x, L_ = a.replay_gauss_aim_y, P_ = a.replay_gauss_len, E_ = a.replay_gauss_shot_endpoint_x, M_ = a.replay_gauss_shot_endpoint_y, A_ = a.replay_gauss_state, N_ = a.replay_gauss_turret_x, C_ = a.replay_gauss_turret_y, R_ = a.replay_gold_collected, I_ = a.replay_gold_x, B_ = a.replay_gold_y, O_ = a.replay_golds_len, G_ = a.replay_input, H_ = a.replay_inputs_len, K_ = a.replay_is_from_attract, V_ = a.replay_laser_drone_deg, U_ = a.replay_laser_drone_x, z_ = a.replay_laser_drone_y, q_ = a.replay_laser_drones_len, Y_ = a.replay_launch_pad_deg, Z_ = a.replay_launch_pad_x, F_ = a.replay_launch_pad_y, W_ = a.replay_launch_pads_len, X_ = a.replay_locked_door_anim_progress, J_ = a.replay_locked_door_deg, Q_ = a.replay_locked_door_x, el = a.replay_locked_door_y, tl = a.replay_locked_doors_len, rl = a.replay_locked_switch_x, nl = a.replay_locked_switch_y, sl = a.replay_mine_state, ol = a.replay_mine_x, il = a.replay_mine_y, _l = a.replay_mines_len, ll = a.replay_ninja_bones, al = a.replay_ninja_deg, cl = a.replay_ninja_form, dl = a.replay_ninja_info, ul = a.replay_ninja_preview_bones, pl = a.replay_ninja_preview_deg, hl = a.replay_ninja_preview_x, gl = a.replay_ninja_preview_y, fl = a.replay_ninja_x, yl = a.replay_ninja_y, wl = a.replay_one_way_deg, ml = a.replay_one_way_x, xl = a.replay_one_way_y, bl = a.replay_one_ways_len, vl = a.replay_past_ninja_bones, kl = a.replay_past_ninja_x, $l = a.replay_past_ninja_y, Dl = a.replay_past_ninjas_len, Sl = a.replay_place_ninja, jl = a.replay_portal_active, Tl = a.replay_portal_ninja_bones, Ll = a.replay_portal_ninja_x, Pl = a.replay_portal_ninja_y, El = a.replay_portal_side1_deg, Ml = a.replay_portal_side1_x, Al = a.replay_portal_side1_y, Nl = a.replay_portal_side2_deg, Cl = a.replay_portal_side2_x, Rl = a.replay_portal_side2_y, Il = a.replay_portals_len, Bl = a.replay_preview_ninja_form, Ol = a.replay_progress, Gl = a.replay_progress_preview, Hl = a.replay_regular_door_anim_progress, Kl = a.replay_regular_door_deg, Vl = a.replay_regular_door_x, Ul = a.replay_regular_door_y, zl = a.replay_regular_doors_len, ql = a.replay_rocket_deg, Yl = a.replay_rocket_morph_x, Zl = a.replay_rocket_morph_y, Fl = a.replay_rocket_morphs_len, Wl = a.replay_rocket_state, Xl = a.replay_rocket_turret_x, Jl = a.replay_rocket_turret_y, Ql = a.replay_rocket_x, ea = a.replay_rocket_y, ta = a.replay_rockets_len, ra = a.replay_score, na = a.replay_seek, sa = a.replay_seek_preview, oa = a.replay_send_past_ninjas, ia = a.replay_set_input, _a = a.replay_shove_thwump_deg, la = a.replay_shove_thwump_touch, aa = a.replay_shove_thwump_x, ca = a.replay_shove_thwump_y, da = a.replay_shove_thwumps_len, ua = a.replay_thwump_deg, pa = a.replay_thwump_x, ha = a.replay_thwump_y, ga = a.replay_thwumps_len, fa = a.replay_tick, ya = a.replay_tiles_path, wa = a.replay_trap_door_anim_progress, ma = a.replay_trap_door_deg, xa = a.replay_trap_door_x, ba = a.replay_trap_door_y, va = a.replay_trap_doors_len, ka = a.replay_trap_switch_x, $a = a.replay_trap_switch_y, Da = a.replay_zap_drone_deg, Sa = a.replay_zap_drone_x, ja = a.replay_zap_drone_y, Ta = a.replay_zap_drones_len, La = a.editor_press_num_2, Pa = a.editor_press_num_5, Ea = a.replay_replay_length, Ma = a.__wbindgen_externrefs, Aa = a.__wbindgen_free, Na = a.__wbindgen_malloc, Ca = a.__externref_table_dealloc, Ra = a.__wbindgen_realloc, Ia = a.__externref_drop_slice, Er = a.__wbindgen_start, Ba = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: Ia,
    __externref_table_dealloc: Ca,
    __wbg_editor_free: ws,
    __wbg_exportedentity_free: xi,
    __wbg_get_exportedentity_deg: bi,
    __wbg_get_exportedentity_deg2: vi,
    __wbg_get_exportedentity_mode: ki,
    __wbg_get_exportedentity_mode2: $i,
    __wbg_get_exportedentity_stack_count: Di,
    __wbg_get_exportedentity_switch_x: Si,
    __wbg_get_exportedentity_switch_y: ji,
    __wbg_get_exportedentity_type_int: Ti,
    __wbg_get_exportedentity_x: Li,
    __wbg_get_exportedentity_y: Pi,
    __wbg_replay_free: Hi,
    __wbg_set_exportedentity_deg: Ei,
    __wbg_set_exportedentity_deg2: Mi,
    __wbg_set_exportedentity_mode: Ai,
    __wbg_set_exportedentity_mode2: Ni,
    __wbg_set_exportedentity_stack_count: Ci,
    __wbg_set_exportedentity_switch_x: Ri,
    __wbg_set_exportedentity_switch_y: Ii,
    __wbg_set_exportedentity_type_int: Bi,
    __wbg_set_exportedentity_x: Oi,
    __wbg_set_exportedentity_y: Gi,
    __wbindgen_externrefs: Ma,
    __wbindgen_free: Aa,
    __wbindgen_malloc: Na,
    __wbindgen_realloc: Ra,
    __wbindgen_start: Er,
    editor_crosshair_x: ms,
    editor_crosshair_y: xs,
    editor_cursor_down: bs,
    editor_cursor_up: vs,
    editor_double_click: ks,
    editor_entities: $s,
    editor_export_map: Ds,
    editor_fill_with_mines: Ss,
    editor_get_anim_state: js,
    editor_get_level_name: Ts,
    editor_get_show_trail: Ls,
    editor_load_attract: Ps,
    editor_load_map: Es,
    editor_load_outte_replay: Ms,
    editor_loop_locations_path: As,
    editor_mode: Ns,
    editor_new: Cs,
    editor_palette_center_x: Rs,
    editor_palette_center_y: Is,
    editor_palette_selection_x: Bs,
    editor_palette_selection_y: Os,
    editor_past_ninja_bones: Gs,
    editor_past_ninja_x: Hs,
    editor_past_ninja_y: Ks,
    editor_past_ninjas_len: Vs,
    editor_press_0: Us,
    editor_press_1: zs,
    editor_press_2: qs,
    editor_press_3: Ys,
    editor_press_4: Zs,
    editor_press_5: Fs,
    editor_press_6: Ws,
    editor_press_7: Xs,
    editor_press_8: Js,
    editor_press_9: Qs,
    editor_press_a: eo,
    editor_press_alt_left: to,
    editor_press_b: ro,
    editor_press_backtick: no,
    editor_press_bracket_left: so,
    editor_press_bracket_right: oo,
    editor_press_c: io,
    editor_press_comma: _o,
    editor_press_d: lo,
    editor_press_dash: ao,
    editor_press_down: co,
    editor_press_e: uo,
    editor_press_enter: po,
    editor_press_equals: ho,
    editor_press_escape: go,
    editor_press_f: fo,
    editor_press_h: yo,
    editor_press_i: wo,
    editor_press_j: mo,
    editor_press_k: xo,
    editor_press_l: bo,
    editor_press_left: vo,
    editor_press_m: ko,
    editor_press_n: $o,
    editor_press_num_0: Do,
    editor_press_num_1: So,
    editor_press_num_2: La,
    editor_press_num_3: jo,
    editor_press_num_4: To,
    editor_press_num_5: Pa,
    editor_press_num_7: Lo,
    editor_press_o: Po,
    editor_press_p: Eo,
    editor_press_q: Mo,
    editor_press_r: Ao,
    editor_press_right: No,
    editor_press_s: Co,
    editor_press_shift: Ro,
    editor_press_slash: Io,
    editor_press_space: Bo,
    editor_press_t: Oo,
    editor_press_u: Go,
    editor_press_up: Ho,
    editor_press_w: Ko,
    editor_press_x: Vo,
    editor_press_y: Uo,
    editor_press_z: zo,
    editor_preview_entities: qo,
    editor_receive_past_ninjas: Yo,
    editor_redo: Zo,
    editor_release_a: Fo,
    editor_release_alt_left: Wo,
    editor_release_c: Xo,
    editor_release_d: Jo,
    editor_release_e: Qo,
    editor_release_q: ei,
    editor_release_s: ti,
    editor_release_shift: ri,
    editor_release_space: ni,
    editor_release_w: si,
    editor_release_z: oi,
    editor_selected_tile_outline_path: ii,
    editor_selected_tiles_path: _i,
    editor_set_anim_data: li,
    editor_set_cursor_pos: ai,
    editor_set_level_name: ci,
    editor_set_show_trail: di,
    editor_set_start_replay_paused: ui,
    editor_show_half_grid: pi,
    editor_show_quarter_grid: hi,
    editor_tile_crosshair_col: gi,
    editor_tile_crosshair_row: fi,
    editor_tiles_path: yi,
    editor_to_replay: wi,
    editor_undo: mi,
    memory: ys,
    replay_boost_pad_anim_progress: Ki,
    replay_boost_pad_deg: Vi,
    replay_boost_pad_x: Ui,
    replay_boost_pad_y: zi,
    replay_boost_pads_len: qi,
    replay_bounce_block_deg: Yi,
    replay_bounce_block_x: Zi,
    replay_bounce_block_y: Fi,
    replay_bounce_blocks_len: Wi,
    replay_chaingun_drone_deg: Xi,
    replay_chaingun_drone_x: Ji,
    replay_chaingun_drone_y: Qi,
    replay_chaingun_drones_len: e_,
    replay_chase_drone_deg: t_,
    replay_chase_drone_x: r_,
    replay_chase_drone_y: n_,
    replay_chase_drones_len: s_,
    replay_deathball_x: o_,
    replay_deathball_y: i_,
    replay_deathballs_len: __,
    replay_evil_ninja_bones: l_,
    replay_evil_ninja_deg: a_,
    replay_evil_ninja_scale: c_,
    replay_evil_ninja_type: d_,
    replay_evil_ninja_x: u_,
    replay_evil_ninja_y: p_,
    replay_evil_ninjas_len: h_,
    replay_exit_anim_progress: g_,
    replay_exit_door_x: f_,
    replay_exit_door_y: y_,
    replay_exit_doors_len: w_,
    replay_exit_switch_x: m_,
    replay_exit_switch_y: x_,
    replay_export_attract: b_,
    replay_export_replay: v_,
    replay_floor_guard_deg: k_,
    replay_floor_guard_x: $_,
    replay_floor_guard_y: D_,
    replay_floor_guards_len: S_,
    replay_gauss_aim_region: j_,
    replay_gauss_aim_x: T_,
    replay_gauss_aim_y: L_,
    replay_gauss_len: P_,
    replay_gauss_shot_endpoint_x: E_,
    replay_gauss_shot_endpoint_y: M_,
    replay_gauss_state: A_,
    replay_gauss_turret_x: N_,
    replay_gauss_turret_y: C_,
    replay_gold_collected: R_,
    replay_gold_x: I_,
    replay_gold_y: B_,
    replay_golds_len: O_,
    replay_input: G_,
    replay_inputs_len: H_,
    replay_is_from_attract: K_,
    replay_laser_drone_deg: V_,
    replay_laser_drone_x: U_,
    replay_laser_drone_y: z_,
    replay_laser_drones_len: q_,
    replay_launch_pad_deg: Y_,
    replay_launch_pad_x: Z_,
    replay_launch_pad_y: F_,
    replay_launch_pads_len: W_,
    replay_locked_door_anim_progress: X_,
    replay_locked_door_deg: J_,
    replay_locked_door_x: Q_,
    replay_locked_door_y: el,
    replay_locked_doors_len: tl,
    replay_locked_switch_x: rl,
    replay_locked_switch_y: nl,
    replay_mine_state: sl,
    replay_mine_x: ol,
    replay_mine_y: il,
    replay_mines_len: _l,
    replay_ninja_bones: ll,
    replay_ninja_deg: al,
    replay_ninja_form: cl,
    replay_ninja_info: dl,
    replay_ninja_preview_bones: ul,
    replay_ninja_preview_deg: pl,
    replay_ninja_preview_x: hl,
    replay_ninja_preview_y: gl,
    replay_ninja_x: fl,
    replay_ninja_y: yl,
    replay_one_way_deg: wl,
    replay_one_way_x: ml,
    replay_one_way_y: xl,
    replay_one_ways_len: bl,
    replay_past_ninja_bones: vl,
    replay_past_ninja_x: kl,
    replay_past_ninja_y: $l,
    replay_past_ninjas_len: Dl,
    replay_place_ninja: Sl,
    replay_portal_active: jl,
    replay_portal_ninja_bones: Tl,
    replay_portal_ninja_x: Ll,
    replay_portal_ninja_y: Pl,
    replay_portal_side1_deg: El,
    replay_portal_side1_x: Ml,
    replay_portal_side1_y: Al,
    replay_portal_side2_deg: Nl,
    replay_portal_side2_x: Cl,
    replay_portal_side2_y: Rl,
    replay_portals_len: Il,
    replay_preview_ninja_form: Bl,
    replay_progress: Ol,
    replay_progress_preview: Gl,
    replay_regular_door_anim_progress: Hl,
    replay_regular_door_deg: Kl,
    replay_regular_door_x: Vl,
    replay_regular_door_y: Ul,
    replay_regular_doors_len: zl,
    replay_replay_length: Ea,
    replay_rocket_deg: ql,
    replay_rocket_morph_x: Yl,
    replay_rocket_morph_y: Zl,
    replay_rocket_morphs_len: Fl,
    replay_rocket_state: Wl,
    replay_rocket_turret_x: Xl,
    replay_rocket_turret_y: Jl,
    replay_rocket_x: Ql,
    replay_rocket_y: ea,
    replay_rockets_len: ta,
    replay_score: ra,
    replay_seek: na,
    replay_seek_preview: sa,
    replay_send_past_ninjas: oa,
    replay_set_input: ia,
    replay_shove_thwump_deg: _a,
    replay_shove_thwump_touch: la,
    replay_shove_thwump_x: aa,
    replay_shove_thwump_y: ca,
    replay_shove_thwumps_len: da,
    replay_thwump_deg: ua,
    replay_thwump_x: pa,
    replay_thwump_y: ha,
    replay_thwumps_len: ga,
    replay_tick: fa,
    replay_tiles_path: ya,
    replay_trap_door_anim_progress: wa,
    replay_trap_door_deg: ma,
    replay_trap_door_x: xa,
    replay_trap_door_y: ba,
    replay_trap_doors_len: va,
    replay_trap_switch_x: ka,
    replay_trap_switch_y: $a,
    replay_zap_drone_deg: Da,
    replay_zap_drone_x: Sa,
    replay_zap_drone_y: ja,
    replay_zap_drones_len: Ta
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  is(Ba);
  Er();
  function Oa({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var Ga = f("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const Ha = [
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
  function Ae(t) {
    function e() {
      const r = t.bones();
      return r ? Ha.map(([n, _]) => `M ${20 * r[n]} ${20 * r[n + 13]} ${20 * r[_]} ${20 * r[_ + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = Ga();
      return $((n) => {
        var _ = t.class, l = Oa(t.ninja()), i = e();
        return _ !== n.e && p(r, "class", n.e = _), l !== n.t && p(r, "transform", n.t = l), i !== n.a && p(r, "d", n.a = i), n;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var Ka = f("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), Va = f("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function Ua(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function za(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function qa([t, e], r, n) {
    const _ = t(), l = r.exit_doors_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.exit_door_x(s),
        y: r.exit_door_y(s),
        animProgress: r.exit_anim_progress(s, n)
      };
      c && Ua(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function Mr(t) {
    return d(K, {
      get each() {
        return t.exitDoors();
      },
      children: (e) => d(Ya, {
        exitDoor: e
      })
    });
  }
  const ue = 11, te = 2.5;
  function Ya(t) {
    return (() => {
      var e = Ka(), r = e.firstChild, n = r.nextSibling, _ = n.nextSibling, l = _.nextSibling, i = l.nextSibling;
      return $((s) => {
        var c = za(t.exitDoor), h = -13 + 4 * (1 - t.exitDoor().animProgress), k = 26 - 8 * (1 - t.exitDoor().animProgress), x = `M ${-13 * t.exitDoor().animProgress} 0 v ${-ue} h ${-ue + te} l ${-te} ${te} v ${2 * (ue - te)} l ${te} ${te} h ${ue - te} z`, T = `M ${13 * t.exitDoor().animProgress} 0 v ${-ue} h ${ue - te} l ${te} ${te} v ${2 * (ue - te)} l ${-te} ${te} h ${-ue + te} z`, A = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * ue} v ${t.exitDoor().animProgress * ue} h ${-ue + te + t.exitDoor().animProgress} l ${-te} ${-te} v ${(1 - t.exitDoor().animProgress) * (-ue + te)}`, V = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * ue} v ${t.exitDoor().animProgress * ue} h ${ue - te - t.exitDoor().animProgress} l ${te} ${-te} v ${(1 - t.exitDoor().animProgress) * (-ue + te)}`;
        return c !== s.e && p(e, "transform", s.e = c), h !== s.t && p(r, "x", s.t = h), k !== s.a && p(r, "width", s.a = k), x !== s.o && p(n, "d", s.o = x), T !== s.i && p(_, "d", s.i = T), A !== s.n && p(l, "d", s.n = A), V !== s.s && p(i, "d", s.s = V), s;
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
  function Za() {
    return Va();
  }
  var Fa = f('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function Wa(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function Xa(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Ja([t, e], r, n) {
    const _ = t(), l = r.exit_doors_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.exit_switch_x(s),
        y: r.exit_switch_y(s),
        animProgress: r.exit_anim_progress(s, n)
      };
      c && Wa(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function Ar(t) {
    return d(K, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => d(Qa, {
        exitSwitch: e
      })
    });
  }
  const Ee = 2;
  function Qa(t) {
    return (() => {
      var e = Fa(), r = e.firstChild, n = r.nextSibling, _ = n.nextSibling;
      return $((l) => {
        var i = Xa(t.exitSwitch), s = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, h = `M ${-2 * t.exitSwitch().animProgress} ${-Ee} h ${-Ee} v ${2 * Ee} h ${Ee}`, k = `M ${2 * t.exitSwitch().animProgress} ${-Ee} h ${Ee} v ${2 * Ee} h ${-Ee}`;
        return i !== l.e && p(e, "transform", l.e = i), s !== l.t && p(r, "fill", l.t = s), c !== l.a && p(r, "stroke", l.a = c), h !== l.o && p(n, "d", l.o = h), k !== l.i && p(_, "d", l.i = k), l;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), e;
    })();
  }
  var ec = f("<svg><use href=#one-way></svg>", false, true, false), tc = f("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function rc(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function nc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function sc([t, e], r) {
    const n = t(), _ = r.one_ways_len(), l = [];
    for (let i = 0; i < _; i++) {
      const s = n.at(i), c = {
        x: r.one_way_x(i),
        y: r.one_way_y(i),
        deg: r.one_way_deg(i)
      };
      s && rc(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function Nr(t) {
    return d(K, {
      get each() {
        return t.oneWays();
      },
      children: (e) => (() => {
        var r = ec();
        return $(() => p(r, "transform", nc(e))), r;
      })()
    });
  }
  function Cr() {
    return (() => {
      var t = tc(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var oc = f("<svg><use></svg>", false, true, false), ic = f("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), _c = f("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), lc = f("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const ac = 0, cc = 1;
  function dc(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function uc(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function pc([t, e], r) {
    const n = t(), _ = r.mines_len(), l = [];
    for (let i = 0; i < _; i++) {
      const s = n.at(i), c = {
        x: r.mine_x(i),
        y: r.mine_y(i),
        type: r.mine_state(i)
      };
      s && dc(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function Rr(t) {
    return d(K, {
      get each() {
        return t.mines();
      },
      children: (e) => (() => {
        var r = oc();
        return $((n) => {
          var _ = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][e().type], l = uc(e);
          return _ !== n.e && p(r, "href", n.e = _), l !== n.t && p(r, "transform", n.t = l), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function Ir() {
    return [
      (() => {
        var t = ic(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, _ = n.nextSibling, l = _.nextSibling;
        return l.nextSibling, t;
      })(),
      (() => {
        var t = _c();
        return t.firstChild, t;
      })(),
      (() => {
        var t = lc();
        return t.firstChild, t;
      })()
    ];
  }
  var hc = f("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), gc = f("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), fc = f("<svg><g class=regular-door></svg>", false, true, false);
  function yc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function wc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function mc([t, e], r, n) {
    const _ = t(), l = r.regular_doors_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.regular_door_x(s),
        y: r.regular_door_y(s),
        deg: r.regular_door_deg(s),
        animProgress: r.regular_door_anim_progress(s, n)
      };
      c && yc(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function Br(t) {
    return d(K, {
      get each() {
        return t.regularDoors();
      },
      children: (e) => d(vc, {
        regularDoor: e
      })
    });
  }
  const xc = 1, bc = 12 - xc;
  function vc(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (bc - 0) * r;
    }
    return (() => {
      var r = fc();
      return g(r, d(R, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var n = hc();
              return $(() => p(n, "x2", -e())), n;
            })(),
            (() => {
              var n = gc();
              return $(() => p(n, "x2", e())), n;
            })()
          ];
        }
      })), $(() => p(r, "transform", wc(t.regularDoor))), r;
    })();
  }
  var kc = f("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), $c = f("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), rr = f("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), Dc = f("<svg><g class=locked-door></svg>", false, true, false);
  function Sc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function jc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Tc([t, e], r, n) {
    const _ = t(), l = r.locked_doors_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.locked_door_x(s),
        y: r.locked_door_y(s),
        deg: r.locked_door_deg(s),
        animProgress: r.locked_door_anim_progress(s, n)
      };
      c && Sc(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function Or(t) {
    return d(K, {
      get each() {
        return t.lockedDoors();
      },
      children: (e) => d(Ec, {
        lockedDoor: e
      })
    });
  }
  const Lc = 1, Pc = 12 - Lc;
  function Ec(t) {
    function e() {
      let _ = t.lockedDoor().animProgress;
      return _ = Math.min(Math.max(2 * _, 0), 1), 4.5 + 4 * _;
    }
    function r() {
      let _ = t.lockedDoor().animProgress;
      return _ = Math.min(Math.max(2 * _, 0), 1), 0 + 10 * _;
    }
    function n() {
      let _ = t.lockedDoor().animProgress;
      return _ = Math.min(Math.max((_ - 0.4) / 0.6, 0), 1), 0 + (Pc - 0) * _;
    }
    return (() => {
      var _ = Dc();
      return g(_, d(R, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var l = kc();
              return $(() => p(l, "x2", -n())), l;
            })(),
            (() => {
              var l = $c();
              return $(() => p(l, "x2", n())), l;
            })()
          ];
        }
      }), null), g(_, d(R, {
        get when() {
          return t.lockedDoor().animProgress < 0.5;
        },
        get children() {
          return [
            (() => {
              var l = rr();
              return $((i) => {
                var s = e(), c = r();
                return s !== i.e && p(l, "x1", i.e = s), c !== i.t && p(l, "x2", i.t = c), i;
              }, {
                e: void 0,
                t: void 0
              }), l;
            })(),
            (() => {
              var l = rr();
              return $((i) => {
                var s = -e(), c = -r();
                return s !== i.e && p(l, "x1", i.e = s), c !== i.t && p(l, "x2", i.t = c), i;
              }, {
                e: void 0,
                t: void 0
              }), l;
            })()
          ];
        }
      }), null), $(() => p(_, "transform", jc(t.lockedDoor))), _;
    })();
  }
  var Mc = f("<svg><use></svg>", false, true, false), Ac = f("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), Nc = f("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function Cc(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function Rc(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Ic([t, e], r) {
    const n = t(), _ = r.locked_doors_len(), l = [];
    for (let i = 0; i < _; i++) {
      const s = n.at(i), c = {
        x: r.locked_switch_x(i),
        y: r.locked_switch_y(i),
        wasTouched: r.locked_door_anim_progress(i, 1) >= 0
      };
      s && Cc(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function Gr(t) {
    return d(K, {
      get each() {
        return t.lockedSwitches();
      },
      children: (e) => (() => {
        var r = Mc();
        return $((n) => {
          var _ = e().wasTouched ? "#locked-switch-touched" : "#locked-switch", l = Rc(e);
          return _ !== n.e && p(r, "href", n.e = _), l !== n.t && p(r, "transform", n.t = l), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function Hr() {
    return [
      (() => {
        var t = Ac(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = Nc(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var Bc = f("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), nr = f("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), Oc = f("<svg><g></svg>", false, true, false);
  function Gc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Hc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Kc([t, e], r, n) {
    const _ = t(), l = r.trap_doors_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.trap_door_x(s),
        y: r.trap_door_y(s),
        deg: r.trap_door_deg(s),
        animProgress: r.trap_door_anim_progress(s, n)
      };
      c && Gc(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function Kr(t) {
    return d(K, {
      get each() {
        return t.trapDoors();
      },
      children: (e) => d(zc, {
        trapDoor: e
      })
    });
  }
  const Vc = 1, Uc = 12 - Vc;
  function zc(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function n() {
      let _ = t.trapDoor().animProgress;
      return 0 + (Uc - 0) * _;
    }
    return (() => {
      var _ = Oc();
      return g(_, d(R, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var l = Bc();
              return $((i) => {
                var s = -n(), c = n();
                return s !== i.e && p(l, "x1", i.e = s), c !== i.t && p(l, "x2", i.t = c), i;
              }, {
                e: void 0,
                t: void 0
              }), l;
            })(),
            (() => {
              var l = nr();
              return $((i) => {
                var s = e(), c = r();
                return s !== i.e && p(l, "x1", i.e = s), c !== i.t && p(l, "x2", i.t = c), i;
              }, {
                e: void 0,
                t: void 0
              }), l;
            })(),
            (() => {
              var l = nr();
              return $((i) => {
                var s = -e(), c = -r();
                return s !== i.e && p(l, "x1", i.e = s), c !== i.t && p(l, "x2", i.t = c), i;
              }, {
                e: void 0,
                t: void 0
              }), l;
            })()
          ];
        }
      })), $(() => p(_, "transform", Hc(t.trapDoor))), _;
    })();
  }
  var qc = f("<svg><use></svg>", false, true, false), Yc = f("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), Zc = f("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function Fc(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function Wc(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Xc([t, e], r) {
    const n = t(), _ = r.trap_doors_len(), l = [];
    for (let i = 0; i < _; i++) {
      const s = n.at(i), c = {
        x: r.trap_switch_x(i),
        y: r.trap_switch_y(i),
        wasTouched: r.trap_door_anim_progress(i, 1) >= 0
      };
      s && Fc(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function Vr(t) {
    return d(K, {
      get each() {
        return t.trapSwitches();
      },
      children: (e) => (() => {
        var r = qc();
        return $((n) => {
          var _ = e().wasTouched ? "#trap-switch-touched" : "#trap-switch", l = Wc(e);
          return _ !== n.e && p(r, "href", n.e = _), l !== n.t && p(r, "transform", n.t = l), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function Ur() {
    return [
      (() => {
        var t = Yc();
        return t.firstChild, t;
      })(),
      (() => {
        var t = Zc(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var Jc = f("<svg><g><rect fill=var(--launch-pad-long) x=0 y=-7.5 width=1.5 height=15></rect><line stroke=var(--launch-pad-short) stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function Qc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function ed(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function td([t, e], r) {
    const n = t(), _ = r.launch_pads_len(), l = [];
    for (let i = 0; i < _; i++) {
      const s = n.at(i), c = {
        x: r.launch_pad_x(i),
        y: r.launch_pad_y(i),
        deg: r.launch_pad_deg(i)
      };
      s && Qc(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function zr(t) {
    return d(K, {
      get each() {
        return t.launchPads();
      },
      children: (e) => d(rd, {
        launchPad: e
      })
    });
  }
  function rd(t) {
    return (() => {
      var e = Jc(), r = e.firstChild;
      return r.nextSibling, $(() => p(e, "transform", ed(t.launchPad))), e;
    })();
  }
  var nd = f('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function sd(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function od(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function id([t, e], r, n) {
    const _ = t(), l = r.floor_guards_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.floor_guard_x(s, n),
        y: r.floor_guard_y(s, n),
        deg: r.floor_guard_deg(s)
      };
      c && sd(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function qr(t) {
    return d(K, {
      get each() {
        return t.floorGuards();
      },
      children: (e) => d(_d, {
        floorGuard: e
      })
    });
  }
  function _d(t) {
    return (() => {
      var e = nd();
      return e.firstChild, $(() => p(e, "transform", od(t.floorGuard))), e;
    })();
  }
  var ld = f("<svg><use href=#bounceblock></svg>", false, true, false), ad = f('<svg><g id=bounceblock><path fill=var(--bounceblock-interior) d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path stroke=var(--bounceblock-border) d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function cd(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function dd(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function ud([t, e], r, n) {
    const _ = t(), l = r.bounce_blocks_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.bounce_block_x(s, n),
        y: r.bounce_block_y(s, n),
        deg: r.bounce_block_deg(s)
      };
      c && cd(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function Yr(t) {
    return d(K, {
      get each() {
        return t.bounceBlocks();
      },
      children: (e) => (() => {
        var r = ld();
        return $(() => p(r, "transform", dd(e))), r;
      })()
    });
  }
  function Zr() {
    return (() => {
      var t = ad(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var pd = f("<svg><use href=#boostpad></svg>", false, true, false), hd = f("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function gd(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function fd(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function yd([t, e], r, n) {
    const _ = t(), l = r.boost_pads_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.boost_pad_x(s),
        y: r.boost_pad_y(s),
        deg: r.boost_pad_deg(s, n),
        animProgress: r.boost_pad_anim_progress(s, n)
      };
      c && gd(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function Fr(t) {
    return d(K, {
      get each() {
        return t.boostPads();
      },
      children: (e) => (() => {
        var r = pd();
        return $((n) => {
          var _ = `color-mix(in srgb-linear, var(--boost-pad) ${e().animProgress * 100}%, var(--boost-pad-wooshing))`, l = fd(e);
          return _ !== n.e && p(r, "stroke", n.e = _), l !== n.t && p(r, "transform", n.t = l), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function Wr() {
    return (() => {
      var t = hd(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, _ = n.nextSibling;
      return _.nextSibling, t;
    })();
  }
  var wd = f("<svg><use href=#thwump></svg>", false, true, false), md = f('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function xd(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function bd(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function vd([t, e], r, n) {
    const _ = t(), l = r.thwumps_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.thwump_x(s, n),
        y: r.thwump_y(s, n),
        deg: r.thwump_deg(s)
      };
      c && xd(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function Xr(t) {
    return d(K, {
      get each() {
        return t.thwumps();
      },
      children: (e) => (() => {
        var r = wd();
        return $(() => p(r, "transform", bd(e))), r;
      })()
    });
  }
  function Jr() {
    return (() => {
      var t = md(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var kd = f("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), $d = f("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function Dd(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function Sd(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function jd([t, e], r, n) {
    const _ = t(), l = r.shove_thwumps_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.shove_thwump_x(s, n),
        y: r.shove_thwump_y(s, n),
        deg: r.shove_thwump_deg(s),
        touch: r.shove_thwump_touch(s)
      };
      c && Dd(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function Qr(t) {
    return d(K, {
      get each() {
        return t.shoveThwumps();
      },
      children: (e) => d(Td, {
        shoveThwump: e
      })
    });
  }
  function Td(t) {
    return (() => {
      var e = kd(), r = e.firstChild;
      return g(e, d(et, {
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
            var _ = $d(), l = _.firstChild, i = l.nextSibling;
            return i.nextSibling, p(_, "transform", `rotate(${45 * n},0,0)`), _;
          }
        })
      }), r), $(() => p(e, "transform", Sd(t.shoveThwump))), e;
    })();
  }
  const en = tn((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function Ld(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (n) => n.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function Pd(t) {
    const e = String.fromCharCode(...t);
    console.log("anim data length", t.byteLength), localStorage.setItem("animData", e);
  }
  function Ed(t) {
    const e = localStorage.getItem("animData");
    if (e) {
      const r = Uint8Array.from(e, (n) => n.charCodeAt(0));
      t.set_anim_data(r);
    }
  }
  const Md = tn(Ad, 1e3);
  function Ad(t) {
    const e = JSON.stringify(t);
    localStorage.setItem("palette", e);
  }
  function Nd() {
    const t = localStorage.getItem("palette");
    if (t) try {
      const e = JSON.parse(t);
      if (typeof (e == null ? void 0 : e.name) == "string" && typeof (e == null ? void 0 : e.colors) == "object") return e;
    } catch {
      return;
    }
  }
  function tn(t, e) {
    let r;
    return (...n) => {
      typeof r == "number" && clearTimeout(r), r = setTimeout(() => t(...n), e);
    };
  }
  const Cd = "" + new URL("palette-CZVUb4uS.png", import.meta.url).href, rn = [
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
  ], sr = [
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
  ], or = {
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
  }, Rd = {
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
  }, Id = (() => {
    const t = {};
    for (const e of sr) {
      t[e] = 0;
      for (const r of sr) or[r] < or[e] && (t[e] += Rd[r]);
    }
    return t;
  })(), nn = [
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
    "--rocket-turret-outer",
    "--rocket-turret-inner",
    "--rocket",
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
  ], Bd = {
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
      file: "entityEyeBat",
      index: 0
    },
    "--bat-eye": {
      file: "entityEyeBat",
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
    "--rocket-turret-outer": {
      file: "entityRocket",
      index: 1
    },
    "--rocket-turret-inner": {
      file: "entityRocket",
      index: 0
    },
    "--rocket": {
      file: "entityRocket",
      index: 2
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
  let sn;
  async function Od() {
    const e = await (await fetch(Cd)).blob(), r = await createImageBitmap(e), n = document.createElement("canvas");
    n.width = r.width, n.height = r.height;
    const _ = n.getContext("2d");
    _.drawImage(r, 0, 0), sn = _;
  }
  function on(t) {
    const e = sn, r = rn.indexOf(t);
    if (!e || r < 0) return;
    const n = {};
    for (const _ of nn) {
      const { file: l, index: i } = Bd[_], s = Id[l] + i, c = e.getImageData(s, r, 1, 1).data, h = `rgb(${c[0]} ${c[1]} ${c[2]})`;
      n[_] = h;
    }
    return n;
  }
  function Gd(t) {
    for (const e of nn) document.body.style.setProperty(e, t[e]);
  }
  var Hd = f('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label>/<label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>attract<input type=file style=display:none></label>/<label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>replay<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox></label> | Object corners <select><option>square</option><option>rounded</option></select> | <label>Friction mod <input type=checkbox></label> | <select></select><input type=text style=float:right>'), Kd = f("<option>");
  function Vd(t) {
    return (() => {
      var e = Hd(), r = e.firstChild, n = r.firstChild, _ = n.nextSibling, l = r.nextSibling, i = l.nextSibling, s = i.firstChild, c = s.nextSibling, h = i.nextSibling, k = h.nextSibling, x = k.firstChild, T = x.nextSibling, A = k.nextSibling, V = A.nextSibling, U = V.nextSibling, re = U.nextSibling, ne = re.firstChild, q = ne.nextSibling, O = re.nextSibling, Y = O.nextSibling, G = Y.firstChild, de = G.nextSibling, _e = Y.nextSibling, C = _e.nextSibling, W = C.firstChild, X = W.nextSibling, se = C.nextSibling, le = se.nextSibling, he = le.nextSibling;
      return _.addEventListener("change", function() {
        const j = this.files;
        if (j && j.length > 0) {
          const N = new FileReader();
          N.onloadend = () => {
            N.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(N.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, N.readAsArrayBuffer(j[0]);
        }
      }), c.addEventListener("change", function() {
        const j = this.files;
        if (j && j.length > 0) {
          const N = new FileReader();
          N.onloadend = () => {
            if (N.result instanceof ArrayBuffer) {
              const D = t.editor.load_attract(new Uint8Array(N.result), t.roundCorners(), t.dynamicFriction());
              t.render(true), t.setLevelName(t.editor.get_level_name()), t.setReplay(D);
            }
          }, N.readAsArrayBuffer(j[0]);
        }
      }), T.addEventListener("change", function() {
        const j = this.files;
        if (j && j.length > 0) {
          const N = new FileReader();
          N.onloadend = () => {
            if (N.result instanceof ArrayBuffer) {
              const D = t.editor.load_outte_replay(new Uint8Array(N.result), t.roundCorners(), t.dynamicFriction());
              t.render(true), t.setReplay(D);
            }
          }, N.readAsArrayBuffer(j[0]);
        }
      }), V.$$click = function() {
        const j = t.editor.export_map(), N = new Blob([
          j.buffer
        ], {
          type: "application/octet-stream"
        }), D = URL.createObjectURL(N);
        this.href = D, this.download = t.editor.get_level_name().replaceAll(/[^a-z]/gi, "_"), setTimeout(() => URL.revokeObjectURL(D), 100);
      }, q.addEventListener("change", (j) => {
        t.setShowTrail(j.currentTarget.checked), t.editor.set_show_trail(j.currentTarget.checked);
      }), Y.addEventListener("change", (j) => t.setRoundCorners(j.currentTarget.value == "rounded")), X.addEventListener("change", (j) => {
        t.setDynamicFriction(j.currentTarget.checked);
      }), le.addEventListener("change", (j) => {
        const N = on(j.currentTarget.value);
        N && t.setPalette({
          name: j.currentTarget.value,
          colors: N
        });
      }), g(le, () => rn.map((j) => (() => {
        var N = Kd();
        return g(N, j), $(() => {
          var _a2;
          return N.selected = j === (((_a2 = t.palette()) == null ? void 0 : _a2.name) ?? "vasquez");
        }), N;
      })())), he.addEventListener("change", () => en(t.editor)), he.$$input = (j) => {
        t.editor.set_level_name(j.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, $((j) => {
        var N = !t.roundCorners(), D = t.roundCorners();
        return N !== j.e && (G.selected = j.e = N), D !== j.t && (de.selected = j.t = D), j;
      }, {
        e: void 0,
        t: void 0
      }), $(() => q.checked = t.showTrail()), $(() => X.checked = t.dynamicFriction()), $(() => he.value = t.levelName()), e;
    })();
  }
  jt([
    "click",
    "input"
  ]);
  var Ud = f("<svg><use href=#zapdrone></svg>", false, true, false), zd = f('<svg><g id=zapdrone><path fill=var(--zap-drone-background) stroke=var(--zap-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--zap-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--zap-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false), qd = f('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 1 12 12 a 12 12 0 0 1 -12 12 l 5 -5 m 0 10 l -5 -5"></svg>', false, true, false), Yd = f('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 0 12 -12 a 12 12 0 0 0 -12 -12 l 5 5 m 0 -10 l -5 5"></svg>', false, true, false), Zd = f('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V 24 l -5 -5 m 10 0 l -5 5"></svg>', false, true, false), Fd = f('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V -24 l -5 5 m 10 0 l -5 -5"></svg>', false, true, false), Wd = f("<svg><g></svg>", false, true, false);
  function Xd(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Jd(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Qd([t, e], r, n) {
    const _ = t(), l = r.zap_drones_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.zap_drone_x(s, n),
        y: r.zap_drone_y(s, n),
        deg: r.zap_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && Xd(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function _n(t) {
    return d(K, {
      get each() {
        return t.zapDrones();
      },
      children: (e) => (() => {
        var r = Ud();
        return $(() => p(r, "transform", Jd(e))), r;
      })()
    });
  }
  function ln() {
    return (() => {
      var t = zd(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  function eu({ entities: t }) {
    const e = () => t.zapDrones().at(0) ?? t.chaseDrones().at(0) ?? t.chaingunDrones().at(0) ?? t.laserDrones().at(0), r = (n) => {
      const _ = n();
      if (_) {
        const { x: l, y: i, deg: s } = _;
        return `translate(${l},${i}) rotate(${s},0,0)`;
      } else return "";
    };
    return (() => {
      var n = Wd();
      return g(n, d(R, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 0;
        },
        get children() {
          return qd();
        }
      }), null), g(n, d(R, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 1;
        },
        get children() {
          return Yd();
        }
      }), null), g(n, d(R, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 2;
        },
        get children() {
          return Zd();
        }
      }), null), g(n, d(R, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 3;
        },
        get children() {
          return Fd();
        }
      }), null), $(() => p(n, "transform", r(e))), n;
    })();
  }
  var tu = f("<svg><use href=#chaingundrone></svg>", false, true, false), ru = f('<svg><g id=chaingundrone><path fill=var(--chaingun-drone-background) stroke=var(--chaingun-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chaingun-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--chaingun-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function nu(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function su(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function ou([t, e], r, n) {
    const _ = t(), l = r.chaingun_drones_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.chaingun_drone_x(s, n),
        y: r.chaingun_drone_y(s, n),
        deg: r.chaingun_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && nu(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function an(t) {
    return d(K, {
      get each() {
        return t.chaingunDrones();
      },
      children: (e) => (() => {
        var r = tu();
        return $(() => p(r, "transform", su(e))), r;
      })()
    });
  }
  function cn() {
    return (() => {
      var t = ru(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var iu = f("<svg><use href=#bat></svg>", false, true, false), _u = f("<svg><circle id=bat r=5 cx=0 cy=0 fill=var(--bat-body)></svg>", false, true, false);
  function lu(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function au(t) {
    return d(K, {
      get each() {
        return t.bats();
      },
      children: (e) => (() => {
        var r = iu();
        return $(() => p(r, "transform", lu(e))), r;
      })()
    });
  }
  function cu() {
    return _u();
  }
  var du = f("<svg><use href=#laserdrone></svg>", false, true, false), uu = f('<svg><g id=laserdrone><path fill=none stroke=var(--laser-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--laser-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--laser-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function pu(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function hu(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function gu([t, e], r, n) {
    const _ = t(), l = r.laser_drones_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.laser_drone_x(s, n),
        y: r.laser_drone_y(s, n),
        deg: r.laser_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && pu(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function dn(t) {
    return d(K, {
      get each() {
        return t.laserDrones();
      },
      children: (e) => (() => {
        var r = du();
        return $(() => p(r, "transform", hu(e))), r;
      })()
    });
  }
  function un() {
    return (() => {
      var t = uu(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var fu = f("<svg><use href=#chasedrone></svg>", false, true, false), yu = f('<svg><g id=chasedrone><path fill=var(--chase-drone-background) stroke=var(--chase-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chase-drone-border) d="M 10 -3 H 3 A 3 3 0 0 0 0 0 A 3 3 0 0 0 3 3 H 10 Z"></path><path fill=none stroke=var(--chase-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function wu(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function mu(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function xu([t, e], r, n) {
    const _ = t(), l = r.chase_drones_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.chase_drone_x(s, n),
        y: r.chase_drone_y(s, n),
        deg: r.chase_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && wu(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function pn(t) {
    return d(K, {
      get each() {
        return t.chaseDrones();
      },
      children: (e) => (() => {
        var r = fu();
        return $(() => p(r, "transform", mu(e))), r;
      })()
    });
  }
  function hn() {
    return (() => {
      var t = yu(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var bu = f("<svg><use href=#gold></svg>", false, true, false), vu = f("<svg><g id=gold><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--gold-exterior) r=2.727272727272727></circle><circle fill=var(--gold-interior) r=1.9090909090909092></svg>", false, true, false);
  function ku(t, e) {
    return t.x === e.x && t.y === e.y && t.collected === e.collected;
  }
  function $u(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Du([t, e], r) {
    const n = t(), _ = r.golds_len(), l = [];
    for (let i = 0; i < _; i++) {
      const s = n.at(i), c = {
        x: r.gold_x(i),
        y: r.gold_y(i),
        collected: r.gold_collected(i)
      };
      s && ku(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function gn(t) {
    return d(K, {
      get each() {
        return t.golds();
      },
      children: (e) => d(R, {
        get when() {
          return !e().collected;
        },
        get children() {
          var r = bu();
          return $(() => p(r, "transform", $u(e))), r;
        }
      })
    });
  }
  function fn() {
    return (() => {
      var t = vu(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, _ = n.nextSibling, l = _.nextSibling;
      return l.nextSibling, t;
    })();
  }
  var Su = f("<svg><use href=#deathball></svg>", false, true, false), ju = f('<svg><g id=deathball><path d="M -7 0 A 7 7 0 0 0 0 7 A 7 7 0 0 0 7 0 A 7 7 0 0 0 0 -7"stroke=var(--deathball-outer) stroke-width=2 fill=none stroke-linecap=round></path><path d="M 0 -4 A 4 4 0 0 0 -4 0 A 4 4 0 0 0 0 4 A 4 4 0 0 0 4 0"stroke=var(--deathball-middle) stroke-width=3 fill=none stroke-linecap=round></path><circle r=2 cx=0 cy=0 fill=var(--deathball-inner)></svg>', false, true, false);
  function Tu(t, e) {
    return t.x === e.x && t.y === e.y;
  }
  function Lu(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r}) rotate(45)`;
  }
  function Pu([t, e], r, n) {
    const _ = t(), l = r.deathballs_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.deathball_x(s, n),
        y: r.deathball_y(s, n)
      };
      c && Tu(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function yn(t) {
    return d(K, {
      get each() {
        return t.deathballs();
      },
      children: (e) => (() => {
        var r = Su();
        return $(() => p(r, "transform", Lu(e))), r;
      })()
    });
  }
  function wn() {
    return ju();
  }
  var Eu = f("<svg><use href=#evilninja stroke=var(--evil-ninja)></svg>", false, true, false), Mu = f("<svg><use href=#evilninja stroke=var(--ninja)></svg>", false, true, false), Au = f('<svg><g id=evilninja><path d="M 2 -5 l -2 -2 h -5"transform="rotate(  0,0,0)"fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform="rotate( 45,0,0)"fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform="rotate( 90,0,0)"fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(135,0,0) fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(180,0,0) fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(225,0,0) fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(270,0,0) fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(315,0,0) fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  const mn = 0, Nu = 1, Gt = 2;
  function Cu(t, e) {
    return t.type === Gt || e.type === Gt ? false : t.x === e.x && t.y === e.y && t.deg === e.deg && t.type === e.type && t.scale == e.scale;
  }
  function ir(t) {
    const { x: e, y: r, deg: n, scale: _ } = t();
    return `translate(${e},${r}) rotate(${n},0,0) scale(${_})`;
  }
  function Ru([t, e], r, n) {
    const _ = t(), l = r.evil_ninjas_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = {
        x: r.evil_ninja_x(s, n),
        y: r.evil_ninja_y(s, n),
        deg: r.evil_ninja_deg(s, n),
        scale: r.evil_ninja_scale(s),
        bones: r.evil_ninja_bones(s),
        type: r.evil_ninja_type(s)
      };
      c && Cu(c, h) ? i.push(c) : i.push(h);
    }
    e(i);
  }
  function xn(t) {
    return d(K, {
      get each() {
        return t.evilNinjas();
      },
      children: (e) => d(Pr, {
        get children() {
          return [
            d(Xe, {
              get when() {
                return e().type === mn;
              },
              get children() {
                var r = Eu();
                return $(() => p(r, "transform", ir(e))), r;
              }
            }),
            d(Xe, {
              get when() {
                return e().type === Nu;
              },
              get children() {
                var r = Mu();
                return $(() => p(r, "transform", ir(e))), r;
              }
            }),
            d(Xe, {
              get when() {
                return e().type === Gt;
              },
              get children() {
                return d(Ae, {
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
  function bn() {
    return (() => {
      var t = Au(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, _ = n.nextSibling, l = _.nextSibling, i = l.nextSibling, s = i.nextSibling;
      return s.nextSibling, t;
    })();
  }
  var Iu = f("<svg><line x1=6 y1=-10 x2=6 y2=-6 class=door-switch-line></svg>", false, true, false), Bu = f("<svg><line x1=6 y1=6 x2=6 y2=10 class=door-switch-line></svg>", false, true, false), Ou = f("<svg><line x1=4 x2=8 class=door-switch-line></svg>", false, true, false), Gu = f("<svg><g><rect x=0 y=-12 width=12 height=24 fill=url(#portal-gradient)></svg>", false, true, false), Hu = f("<svg><linearGradient id=portal-gradient><stop stop-color=var(--open-exit-lower) offset=0%></stop><stop stop-color=var(--background) offset=100%></svg>", false, true, false);
  function Ku(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Vu([t, e], r) {
    const n = r.portals_len(), _ = [];
    for (let l = 0; l < n; l++) if (r.portal_active(l)) {
      const i = {
        x: r.portal_side1_x(l),
        y: r.portal_side1_y(l),
        deg: r.portal_side1_deg(l),
        mode: 0
      }, s = {
        x: r.portal_side2_x(l),
        y: r.portal_side2_y(l),
        deg: r.portal_side2_deg(l),
        mode: 0
      };
      _.push(i, s);
    }
    e(_);
  }
  function vn(t) {
    return d(K, {
      get each() {
        return t.portals();
      },
      children: (e) => d(Uu, {
        portal: e,
        get showMode() {
          return t.showMode;
        }
      })
    });
  }
  function Uu(t) {
    return (() => {
      var e = Gu();
      return e.firstChild, g(e, d(R, {
        get when() {
          return t.showMode;
        },
        get children() {
          return [
            Iu(),
            Bu(),
            (() => {
              var r = Ou();
              return $((n) => {
                var _ = t.portal().mode ? 8 : -8, l = t.portal().mode ? 8 : -8;
                return _ !== n.e && p(r, "y1", n.e = _), l !== n.t && p(r, "y2", n.t = l), n;
              }, {
                e: void 0,
                t: void 0
              }), r;
            })()
          ];
        }
      }), null), $(() => p(e, "transform", Ku(t.portal))), e;
    })();
  }
  function kn() {
    return Hu();
  }
  var zu = f("<svg><use></svg>", false, true, false), qu = f("<svg><g id=rocket-idle><path fill=none stroke=var(--rocket-turret-outer) stroke-width=2 stroke-linecap=round></path><path fill=none stroke=var(--rocket-turret-outer) stroke-width=2 stroke-linecap=round></path><line x1=-3 y1=0 x2=3 y2=0 fill=none stroke=var(--rocket-turret-inner) stroke-width=2 stroke-linecap=round></svg>", false, true, false), Yu = f("<svg><g id=rocket-prefire><path fill=none stroke=var(--rocket-turret-outer) stroke-width=2 stroke-linecap=round></path><path fill=none stroke=var(--rocket-turret-outer) stroke-width=2 stroke-linecap=round></path><line x1=-2 y1=0 x2=2 y2=0 fill=none stroke=var(--rocket-turret-inner) stroke-width=2 stroke-linecap=round></svg>", false, true, false), Zu = f("<svg><g id=rocket-homing><path fill=none stroke=var(--rocket-turret-outer) stroke-width=2 stroke-linecap=round></path><path fill=none stroke=var(--rocket-turret-outer) stroke-width=2 stroke-linecap=round></path><circle cx=0 cy=0 r=3 fill=var(--rocket-turret-inner)></svg>", false, true, false);
  const Fu = 0;
  function Wu(t, e) {
    return t.x === e.x && t.y === e.y && t.state == e.state;
  }
  function Xu(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Ju([t, e], r) {
    const n = t(), _ = r.rockets_len(), l = [];
    for (let i = 0; i < _; i++) {
      const s = n.at(i), c = {
        x: r.rocket_turret_x(i),
        y: r.rocket_turret_y(i),
        state: r.rocket_state(i)
      };
      s && Wu(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function $n(t) {
    return d(K, {
      get each() {
        return t.rocketTurrets();
      },
      children: (e) => (() => {
        var r = zu();
        return $((n) => {
          var _ = [
            "#rocket-idle",
            "#rocket-prefire",
            "#rocket-homing"
          ][e().state], l = Xu(e);
          return _ !== n.e && p(r, "href", n.e = _), l !== n.t && p(r, "transform", n.t = l), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  const ce = 6, Dn = 25, ut = ce * Math.cos(Dn * Math.PI / 180), pt = ce * Math.sin(Dn * Math.PI / 180), Sn = 40, ht = ce * Math.cos(Sn * Math.PI / 180), gt = ce * Math.sin(Sn * Math.PI / 180), jn = 55, ft = ce * Math.cos(jn * Math.PI / 180), yt = ce * Math.sin(jn * Math.PI / 180);
  function Tn() {
    return [
      (() => {
        var t = qu(), e = t.firstChild, r = e.nextSibling;
        return p(e, "d", `M ${-ut} ${pt} A ${ce} ${ce} 0 0 0 ${ut} ${pt}`), p(r, "d", `M ${ut} ${-pt} A ${ce} ${ce} 0 0 0 ${-ut} ${-pt}`), t;
      })(),
      (() => {
        var t = Yu(), e = t.firstChild, r = e.nextSibling;
        return p(e, "d", `M ${-ht} ${gt} A ${ce} ${ce} 0 0 0 ${ht} ${gt}`), p(r, "d", `M ${ht} ${-gt} A ${ce} ${ce} 0 0 0 ${-ht} ${-gt}`), t;
      })(),
      (() => {
        var t = Zu(), e = t.firstChild, r = e.nextSibling;
        return p(e, "d", `M ${-ft} ${yt} A ${ce} ${ce} 0 0 0 ${ft} ${yt}`), p(r, "d", `M ${ft} ${-yt} A ${ce} ${ce} 0 0 0 ${-ft} ${-yt}`), t;
      })()
    ];
  }
  var Qu = f("<svg><use></svg>", false, true, false), ep = f("<svg><line stroke=black></svg>", false, true, false), tp = f('<svg><g id=gauss-idle><path d="M 0 6 A 6 6 0 1 1 0 -6"stroke=black stroke-width=3.5 stroke-linecap=round fill=none></path><circle r=6 stroke=black stroke-width=2 fill=none></circle><circle r=3 fill=maroon></svg>', false, true, false), rp = f('<svg><g id=gauss-active><path d="M 0 6 A 6 6 0 1 1 0 -6"stroke=black stroke-width=3.5 stroke-linecap=round fill=none></path><path stroke=black stroke-width=2 stroke-linecap=round fill=none></path><circle r=3 fill=maroon></svg>', false, true, false);
  const Ln = 0, np = 1;
  function sp(t, e) {
    return t.x === e.x && t.y === e.y && t.shot_x === e.shot_x && t.shot_y === e.shot_y && t.state == e.state;
  }
  function op(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function ip([t, e], r) {
    const n = t(), _ = r.gauss_len(), l = [];
    for (let i = 0; i < _; i++) {
      const s = n.at(i), c = {
        x: r.gauss_turret_x(i),
        y: r.gauss_turret_y(i),
        shot_x: r.gauss_shot_endpoint_x(i),
        shot_y: r.gauss_shot_endpoint_y(i),
        state: r.gauss_state(i)
      };
      s && sp(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function Pn(t) {
    return d(K, {
      get each() {
        return t.gaussTurrets();
      },
      children: (e) => [
        (() => {
          var r = Qu();
          return $((n) => {
            var _ = e().state > 0 ? "#gauss-active" : "#gauss-idle", l = op(e);
            return _ !== n.e && p(r, "href", n.e = _), l !== n.t && p(r, "transform", n.t = l), n;
          }, {
            e: void 0,
            t: void 0
          }), r;
        })(),
        d(R, {
          get when() {
            return typeof e().shot_x == "number";
          },
          get children() {
            var r = ep();
            return $((n) => {
              var _ = e().x, l = e().shot_x, i = e().y, s = e().shot_y;
              return _ !== n.e && p(r, "x1", n.e = _), l !== n.t && p(r, "x2", n.t = l), i !== n.a && p(r, "y1", n.a = i), s !== n.o && p(r, "y2", n.o = s), n;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), r;
          }
        })
      ]
    });
  }
  const Dt = 6, En = 45, _r = Dt * Math.cos(En * Math.PI / 180), lr = Dt * Math.sin(En * Math.PI / 180);
  function Mn() {
    return [
      (() => {
        var t = tp(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = rp(), e = t.firstChild, r = e.nextSibling;
        return p(r, "d", `M ${_r} ${lr} A ${Dt} ${Dt} 0 1 1 ${_r} ${-lr}`), t;
      })()
    ];
  }
  var _p = f("<svg><use href=#rocket-morph></svg>", false, true, false), lp = f('<svg><g id=rocket-morph><path d="M 5 0 L 0 5 L -5 0 L 0 -5 Z"fill=none stroke=var(--rocket-turret-outer) stroke-width=2 stroke-linecap=round></svg>', false, true, false);
  function ap(t, e) {
    return t.x === e.x && t.y === e.y;
  }
  function cp(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function dp([t, e], r) {
    const n = t(), _ = r.rocket_morphs_len(), l = [];
    for (let i = 0; i < _; i++) {
      const s = n.at(i), c = {
        x: r.rocket_morph_x(i),
        y: r.rocket_morph_y(i)
      };
      s && ap(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function An(t) {
    return d(K, {
      get each() {
        return t.rocketMorphs();
      },
      children: (e) => (() => {
        var r = _p();
        return $(() => p(r, "transform", cp(e))), r;
      })()
    });
  }
  function Nn() {
    return (() => {
      var t = lp();
      return t.firstChild, t;
    })();
  }
  var up = f('<svg><rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"width=150 height=150 style=mix-blend-mode:hard-light></svg>', false, true, false), pp = f("<svg><circle fill=none stroke=var(--entity-palette-reticle) r=16></svg>", false, true, false), hp = f('<svg><path d="M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12"fill-rule=evenodd fill="color-mix(in srgb,var(--background) 18%,white 15%)"style=mix-blend-mode:hard-light></svg>', false, true, false), gp = f("<svg><rect fill=none stroke=var(--editor-crosshair) stroke-width=2 width=26 height=26></svg>", false, true, false), fp = f("<svg><use href=#tilemode-crosshair></svg>", false, true, false), yp = f("<svg><use href=#crosshair></svg>", false, true, false), wp = f("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), mp = f('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none></path></g><path stroke=red fill=none>'), ar = f("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), cr = f("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), xp = f("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), bp = f("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), vp = f("<svg><text></svg>", false, true, false), kp = f("<svg><line class=door-switch-line></svg>", false, true, false);
  const Mt = 42, At = 23, dr = 0, ur = 1, $p = 3, Dp = 4, Nt = 5, pr = 6, hr = 7, Sp = 8, Ct = 9, jp = 0, Tp = 1, Lp = 2, Pp = 3, Ep = 5, Mp = 6, Ap = 8, Np = 10, Cp = 11, Rp = 12, Ip = 13, Bp = 14, Op = 15, Gp = 16, Hp = 17, Kp = 18, Vp = 19, Up = 20, zp = 22, qp = 21, Yp = 24, Zp = 25, Fp = 27, Wp = 28, Xp = 29, Jp = 31, Qp = new Float64Array([
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
  ]), eh = new Float64Array([
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
  ]), gr = 150;
  function th(t, e) {
    const r = e.map((n) => ({
      x: n.x,
      y: n.y,
      count: n.stack_count
    })).filter(({ count: n }) => n > 1);
    t(r);
  }
  function fr() {
    const [t, e] = y([]), [r, n] = y([]), [_, l] = y([]), [i, s] = y([]), [c, h] = y([]), [k, x] = y([]), [T, A] = y([]), [V, U] = y([]), [re, ne] = y([]), [q, O] = y([]), [Y, G] = y([]), [de, _e] = y([]), [C, W] = y([]), [X, se] = y([]), [le, he] = y([]), [j, N] = y([]), [D, B] = y([]), [P, Q] = y([]), [ee, xe] = y([]), [ye, ke] = y([]), [be, Ce] = y([]), [Re, u] = y([]), [w, He] = y([]), [J, we] = y([]), [$e, De] = y([]), [Te, Ke] = y([]), [Se, b] = y([]), [v, E] = y([]);
    return {
      ninjas: t,
      setNinjas: e,
      mines: r,
      setMines: n,
      golds: _,
      setGolds: l,
      exitDoors: i,
      setExitDoors: s,
      exitSwitches: c,
      setExitSwitches: h,
      regularDoors: k,
      setRegularDoors: x,
      lockedDoors: T,
      setLockedDoors: A,
      lockedSwitches: V,
      setLockedSwitches: U,
      trapDoors: re,
      setTrapDoors: ne,
      trapSwitches: q,
      setTrapSwitches: O,
      launchPads: Y,
      setLaunchPads: G,
      oneWays: de,
      setOneWays: _e,
      chaingunDrones: C,
      setChaingunDrones: W,
      laserDrones: X,
      setLaserDrones: se,
      zapDrones: le,
      setZapDrones: he,
      chaseDrones: j,
      setChaseDrones: N,
      floorGuards: D,
      setFloorGuards: B,
      bounceBlocks: P,
      setBounceBlocks: Q,
      rocketTurrets: ee,
      setRocketTurrets: xe,
      gaussTurrets: ye,
      setGaussTurrets: ke,
      thwumps: be,
      setThwumps: Ce,
      evilNinjas: Re,
      setEvilNinjas: u,
      boostPads: w,
      setBoostPads: He,
      deathballs: J,
      setDeathballs: we,
      bats: $e,
      setBats: De,
      shoveThwumps: Te,
      setShoveThwumps: Ke,
      portals: Se,
      setPortals: b,
      rocketMorphs: v,
      setRocketMorphs: E
    };
  }
  function yr(t, e, r, n) {
    const _ = [], l = [], i = [], s = [], c = [], h = [], k = [], x = [], T = [], A = [], V = [], U = [], re = [], ne = [], q = [], O = [], Y = [], G = [], de = [], _e = [], C = [], W = [], X = [], se = [], le = [], he = [], j = [], N = [];
    for (const D of r) {
      const B = {
        x: D.x,
        y: D.y,
        deg: D.deg,
        mode: D.mode,
        animProgress: 0
      }, P = {
        x: D.switch_x,
        y: D.switch_y,
        animProgress: 0,
        wasTouched: false
      }, Q = {
        x1: D.x,
        y1: D.y,
        x2: D.switch_x,
        y2: D.switch_y
      };
      D.type_int === jp ? _.push(B) : D.type_int === Tp ? l.push({
        ...B,
        type: ac
      }) : D.type_int === qp ? l.push({
        ...B,
        type: cc
      }) : D.type_int === Lp ? i.push({
        ...B,
        collected: false
      }) : D.type_int === Pp ? (s.push(B), Number.isNaN(D.switch_x) || (c.push(P), e.push(Q))) : D.type_int === Ep ? h.push(B) : D.type_int === Mp ? (k.push(B), Number.isNaN(D.switch_x) || (x.push(P), e.push(Q))) : D.type_int === Ap ? (T.push({
        ...B,
        animProgress: n ? 1 : -1
      }), Number.isNaN(D.switch_x) || (A.push(P), e.push(Q))) : D.type_int === Np ? V.push(B) : D.type_int === Cp ? U.push(B) : D.type_int === Rp ? re.push(B) : D.type_int === Ip ? ne.push(B) : D.type_int === Bp ? q.push(B) : D.type_int === Op ? O.push(B) : D.type_int === Gp ? Y.push(B) : D.type_int === Hp ? G.push(B) : D.type_int === Kp ? de.push({
        ...B,
        state: Fu
      }) : D.type_int === Vp ? _e.push({
        ...B,
        state: Ln
      }) : D.type_int === Up ? C.push(B) : D.type_int === zp ? W.push({
        ...B,
        type: mn,
        scale: 1
      }) : D.type_int === Yp ? X.push({
        ...B,
        animProgress: 1
      }) : D.type_int === Zp ? se.push(B) : D.type_int === Fp ? le.push(B) : D.type_int === Wp ? he.push({
        ...B,
        touch: 16
      }) : D.type_int === Xp ? (j.push(B), Number.isNaN(D.switch_x) || (j.push({
        x: D.switch_x,
        y: D.switch_y,
        deg: D.deg2,
        mode: D.mode2
      }), e.push(Q))) : D.type_int === Jp && N.push(B), D.free();
    }
    t.setNinjas(_), t.setMines(l), t.setGolds(i), t.setExitDoors(s), t.setExitSwitches(c), t.setRegularDoors(h), t.setLockedDoors(k), t.setLockedSwitches(x), t.setTrapDoors(T), t.setTrapSwitches(A), t.setLaunchPads(V), t.setOneWays(U), t.setChaingunDrones(re), t.setLaserDrones(ne), t.setZapDrones(q), t.setChaseDrones(O), t.setFloorGuards(Y), t.setBounceBlocks(G), t.setRocketTurrets(de), t.setGaussTurrets(_e), t.setThwumps(C), t.setEvilNinjas(W), t.setBoostPads(X), t.setDeathballs(se), t.setBats(le), t.setShoveThwumps(he), t.setPortals(j), t.setRocketMorphs(N);
  }
  function wr({ entities: t }) {
    return [
      d(vn, {
        get portals() {
          return t.portals;
        },
        showMode: true
      }),
      d(Kr, {
        get trapDoors() {
          return t.trapDoors;
        }
      }),
      d(Or, {
        get lockedDoors() {
          return t.lockedDoors;
        }
      }),
      d(Gr, {
        get lockedSwitches() {
          return t.lockedSwitches;
        }
      }),
      d(Vr, {
        get trapSwitches() {
          return t.trapSwitches;
        }
      }),
      d(Mr, {
        get exitDoors() {
          return t.exitDoors;
        }
      }),
      d(Nr, {
        get oneWays() {
          return t.oneWays;
        }
      }),
      d(Rr, {
        get mines() {
          return t.mines;
        }
      }),
      d(gn, {
        get golds() {
          return t.golds;
        }
      }),
      d(Ar, {
        get exitSwitches() {
          return t.exitSwitches;
        }
      }),
      d(Br, {
        get regularDoors() {
          return t.regularDoors;
        }
      }),
      d(zr, {
        get launchPads() {
          return t.launchPads;
        }
      }),
      d(dn, {
        get laserDrones() {
          return t.laserDrones;
        }
      }),
      d(an, {
        get chaingunDrones() {
          return t.chaingunDrones;
        }
      }),
      d(_n, {
        get zapDrones() {
          return t.zapDrones;
        }
      }),
      d(pn, {
        get chaseDrones() {
          return t.chaseDrones;
        }
      }),
      d(qr, {
        get floorGuards() {
          return t.floorGuards;
        }
      }),
      d(au, {
        get bats() {
          return t.bats;
        }
      }),
      d(yn, {
        get deathballs() {
          return t.deathballs;
        }
      }),
      d(Pn, {
        get gaussTurrets() {
          return t.gaussTurrets;
        }
      }),
      d($n, {
        get rocketTurrets() {
          return t.rocketTurrets;
        }
      }),
      d(An, {
        get rocketMorphs() {
          return t.rocketMorphs;
        }
      }),
      d(Xr, {
        get thwumps() {
          return t.thwumps;
        }
      }),
      d(xn, {
        get evilNinjas() {
          return t.evilNinjas;
        }
      }),
      d(et, {
        get each() {
          return t.ninjas();
        },
        children: (e) => d(Ae, {
          class: "ninja",
          ninja: () => e,
          bones: () => Qp
        })
      }),
      d(Yr, {
        get bounceBlocks() {
          return t.bounceBlocks;
        }
      }),
      d(Qr, {
        get shoveThwumps() {
          return t.shoveThwumps;
        }
      }),
      d(Fr, {
        get boostPads() {
          return t.boostPads;
        }
      })
    ];
  }
  function rh(t) {
    const { editor: e, pastNinjas: r } = t, [n, _] = y(""), [l, i] = y(""), [s, c] = y(true), [h, k] = y(false), [x, T] = y(dr), [A, V] = y({
      row: 1,
      col: 1
    }), [U, re] = y({
      x: 24,
      y: 24
    }), [ne, q] = y(""), [O, Y] = y({
      x: NaN,
      y: NaN
    }), [G, de] = y({
      x: NaN,
      y: NaN
    }), _e = fr(), C = fr(), [W, X] = y([]), [se, le] = y(e.get_show_trail()), [he, j] = y(), [N, D] = y([]), [B] = y(""), P = (u) => {
      let w = false;
      if (!(u.target instanceof HTMLInputElement || u.target instanceof HTMLSelectElement)) {
        if (u.ctrlKey || u.metaKey) {
          u.code === "KeyZ" && (u.ctrlKey || u.metaKey) && u.shiftKey ? (w = true, e.redo()) : u.code === "KeyZ" && (u.ctrlKey || u.metaKey) ? (w = true, e.undo()) : u.code === "KeyY" && (u.ctrlKey || u.metaKey) && (w = true, e.redo()), w && (ee(true), u.preventDefault());
          return;
        }
        u.shiftKey && (w = true, e.press_shift()), u.code === "Enter" && e.mode() === Ct ? t.setReplay(e.to_replay(t.roundCorners(), t.dynamicFriction())) : u.code === "Backquote" ? (w = true, e.press_backtick()) : u.code === "Digit1" ? (w = true, e.press_1(u.shiftKey)) : u.code === "Digit2" ? (w = true, e.press_2(u.shiftKey)) : u.code === "Digit3" ? (w = true, e.press_3(u.shiftKey)) : u.code === "Digit4" ? (w = true, e.press_4(u.shiftKey)) : u.code === "Digit5" ? (w = true, e.press_5(u.shiftKey)) : u.code === "Digit6" ? (w = true, e.press_6(u.shiftKey)) : u.code === "Digit7" ? (w = true, e.press_7(u.shiftKey)) : u.code === "Digit8" ? (w = true, e.press_8(u.shiftKey)) : u.code === "Digit9" ? (w = true, e.press_9()) : u.code === "Digit0" ? (w = true, e.press_0()) : u.code === "Minus" ? (w = true, e.press_dash()) : u.code === "Equal" ? (w = true, e.press_equals()) : u.code === "KeyQ" ? (w = true, e.press_q(u.shiftKey)) : u.code === "KeyW" ? (w = true, e.press_w(u.shiftKey)) : u.code === "KeyA" ? (w = true, e.press_a(u.shiftKey)) : u.code === "KeyS" ? (w = true, e.press_s(u.shiftKey)) : u.code === "KeyE" ? (w = true, e.press_e()) : u.code === "KeyD" ? (w = true, e.press_d()) : u.code === "KeyZ" ? (w = true, e.press_z()) : u.code === "KeyX" ? (w = true, e.press_x()) : u.code === "KeyC" ? (w = true, e.press_c()) : u.code === "Space" ? (w = true, e.press_space()) : u.code === "AltLeft" ? (w = true, e.press_alt_left(u.shiftKey)) : u.code === "KeyR" ? (w = true, e.press_r()) : u.code === "KeyT" ? (w = true, e.press_t()) : u.code === "KeyY" ? (w = true, e.press_y()) : u.code === "KeyU" ? (w = true, e.press_u()) : u.code === "KeyI" ? (w = true, e.press_i()) : u.code === "KeyO" ? (w = true, e.press_o()) : u.code === "KeyP" ? (w = true, e.press_p()) : u.code === "BracketLeft" ? (w = true, e.press_bracket_left()) : u.code === "BracketRight" ? (w = true, e.press_bracket_right()) : u.code === "KeyF" ? (w = true, e.press_f()) : u.code === "KeyH" ? (w = true, e.press_h()) : u.code === "KeyJ" ? (w = true, e.press_j()) : u.code === "KeyK" ? (w = true, e.press_k()) : u.code === "KeyL" ? (w = true, e.press_l()) : u.code === "KeyB" ? (w = true, e.press_b()) : u.code === "KeyN" ? (w = true, e.press_n()) : u.code === "KeyM" ? (w = true, e.press_m()) : u.code === "Comma" ? (w = true, e.press_comma()) : u.code === "ArrowUp" ? (w = true, e.press_up(u.shiftKey)) : u.code === "ArrowDown" ? (w = true, e.press_down(u.shiftKey)) : u.code === "ArrowLeft" ? (w = true, e.press_left(u.shiftKey)) : u.code === "ArrowRight" ? (w = true, e.press_right(u.shiftKey)) : u.code === "Enter" ? (w = true, e.press_enter()) : u.code === "Escape" ? w = e.press_escape() : u.code === "Slash" && (w = true, e.press_slash()), w && (ee(true), u.preventDefault());
      }
    }, Q = (u) => {
      let w = false;
      u.shiftKey || (w = true, e.release_shift()), u.code === "KeyQ" ? (w = true, e.release_q()) : u.code === "KeyW" ? (w = true, e.release_w()) : u.code === "KeyA" ? (w = true, e.release_a()) : u.code === "KeyS" ? (w = true, e.release_s()) : u.code === "KeyE" ? (w = true, e.release_e()) : u.code === "KeyD" ? (w = true, e.release_d()) : u.code === "KeyZ" ? (w = true, e.release_z()) : u.code === "KeyC" ? (w = true, e.release_c()) : u.code === "Space" ? (w = true, e.release_space()) : u.code === "AltLeft" && (w = true, e.release_alt_left()), w && (ee(false), u.preventDefault());
    };
    document.addEventListener("keydown", P), document.addEventListener("keyup", Q), Oe(() => {
      document.removeEventListener("keydown", P), document.removeEventListener("keyup", Q);
    });
    function ee(u) {
      T(e.mode()), _(e.tiles_path()), i(e.selected_tiles_path()), V({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), k(e.show_quarter_grid()), re({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const w = [];
      yr(_e, w, e.entities(), false), yr(C, w, e.preview_entities(), true), th(D, e.entities()), X(w), q(e.selected_tile_outline_path()), Y({
        x: e.palette_center_x(),
        y: e.palette_center_y()
      }), de({
        x: e.palette_selection_x(),
        y: e.palette_selection_y()
      }), j(e.past_ninja_bones()), u && en(e);
    }
    const xe = [];
    for (let u = 0; u < Mt - 1; u++) xe.push(48 + 24 * u);
    const ye = [];
    for (let u = 0; u < At - 1; u++) ye.push(48 + 24 * u);
    const ke = [];
    for (let u = 0; u < Mt; u++) ke.push(36 + 24 * u);
    const be = [];
    for (let u = 0; u < At; u++) be.push(36 + 24 * u);
    const Ce = [];
    for (let u = 0; u < Mt * 2; u++) Ce.push(30 + 12 * u);
    const Re = [];
    for (let u = 0; u < At * 2; u++) Re.push(30 + 12 * u);
    return ee(false), [
      (() => {
        var u = mp(), w = u.firstChild, He = w.firstChild, J = He.nextSibling;
        J.nextSibling;
        var we = w.nextSibling, $e = we.nextSibling, De = $e.nextSibling, Te = De.nextSibling, Ke = Te.firstChild, Se = Te.nextSibling;
        return u.$$contextmenu = (b) => {
          e.press_escape() && (ee(false), b.preventDefault());
        }, u.$$mouseup = () => {
          e.cursor_up(), ee(false);
        }, u.$$dblclick = (b) => {
          e.double_click(b.shiftKey), ee(false);
        }, u.$$mousedown = (b) => {
          b.buttons & 2 || (e.mode() === Ct ? t.setReplay(e.to_replay(t.roundCorners(), t.dynamicFriction())) : (e.cursor_down(b.shiftKey), ee(true)));
        }, u.$$mousemove = function(b) {
          const { left: v, top: E, width: z, height: ge } = this.getBoundingClientRect(), je = e.set_cursor_pos((b.clientX - v) / z * 1056, (b.clientY - E) / ge * 600, b.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (b.clientX - v) / z * 1056,
            y: (b.clientY - E) / ge * 600
          }), je && ee(false);
        }, g(w, d(Ir, {}), J), g(w, d(fn, {}), J), g(w, d(Cr, {}), J), g(w, d(Zr, {}), J), g(w, d(Hr, {}), J), g(w, d(Ur, {}), J), g(w, d(Wr, {}), J), g(w, d(Jr, {}), J), g(w, d(bn, {}), J), g(w, d(cn, {}), J), g(w, d(un, {}), J), g(w, d(ln, {}), J), g(w, d(hn, {}), J), g(w, d(cu, {}), J), g(w, d(wn, {}), J), g(w, d(kn, {}), J), g(w, d(Tn, {}), J), g(w, d(Nn, {}), J), g(w, d(Mn, {}), J), g(u, d(R, {
          get when() {
            return h();
          },
          get children() {
            return [
              qe(() => Ce.map((b) => (() => {
                var v = ar();
                return p(v, "x1", b), p(v, "x2", b), v;
              })())),
              qe(() => Re.map((b) => (() => {
                var v = cr();
                return p(v, "y1", b), p(v, "y2", b), v;
              })()))
            ];
          }
        }), we), g(u, d(R, {
          get when() {
            return s();
          },
          get children() {
            return [
              qe(() => ke.map((b) => (() => {
                var v = ar();
                return p(v, "x1", b), p(v, "x2", b), v;
              })())),
              qe(() => be.map((b) => (() => {
                var v = cr();
                return p(v, "y1", b), p(v, "y2", b), v;
              })()))
            ];
          }
        }), we), g(u, () => xe.map((b) => (() => {
          var v = xp();
          return p(v, "x1", b), p(v, "x2", b), v;
        })()), we), g(u, () => ye.map((b) => (() => {
          var v = bp();
          return p(v, "y1", b), p(v, "y2", b), v;
        })()), we), g(u, d(wr, {
          entities: _e
        }), we), g(u, d(et, {
          get each() {
            return N();
          },
          children: (b) => (() => {
            var v = vp();
            return g(v, () => b.count), $((E) => {
              var z = b.x + 4, ge = b.y + 12;
              return z !== E.e && p(v, "x", E.e = z), ge !== E.t && p(v, "y", E.t = ge), E;
            }, {
              e: void 0,
              t: void 0
            }), v;
          })()
        }), $e), g(u, d(R, {
          get when() {
            return x() === hr;
          },
          get children() {
            var b = up();
            return $((v) => {
              var E = O().x - gr / 2, z = O().y - gr / 2;
              return E !== v.e && p(b, "x", v.e = E), z !== v.t && p(b, "y", v.t = z), v;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), $e), g($e, d(wr, {
          entities: C
        })), g(u, d(R, {
          get when() {
            return [
              Nt,
              pr,
              Dp
            ].includes(x());
          },
          get children() {
            return d(eu, {
              entities: C
            });
          }
        }), De), g(u, d(R, {
          get when() {
            return x() === hr;
          },
          get children() {
            var b = pp();
            return $((v) => {
              var E = G().x, z = G().y;
              return E !== v.e && p(b, "cx", v.e = E), z !== v.t && p(b, "cy", v.t = z), v;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), De), g(u, d(R, {
          get when() {
            return x() === ur;
          },
          get children() {
            var b = hp();
            return $(() => p(b, "transform", `translate(${O().x},${O().y})`)), b;
          }
        }), De), g(u, d(R, {
          get when() {
            return x() === ur;
          },
          get children() {
            var b = gp();
            return $((v) => {
              var E = G().x - 13, z = G().y - 13;
              return E !== v.e && p(b, "x", v.e = E), z !== v.t && p(b, "y", v.t = z), v;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), Te), g(u, d(et, {
          get each() {
            return W();
          },
          children: (b) => (() => {
            var v = kp();
            return $((E) => {
              var z = b.x1, ge = b.y1, je = b.x2, Fe = b.y2;
              return z !== E.e && p(v, "x1", E.e = z), ge !== E.t && p(v, "y1", E.t = ge), je !== E.a && p(v, "x2", E.a = je), Fe !== E.o && p(v, "y2", E.o = Fe), E;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), v;
          })()
        }), Te), g(u, d(R, {
          get when() {
            return x() === dr;
          },
          get children() {
            var b = fp();
            return $((v) => {
              var E = A().col * 24 + 12, z = A().row * 24 + 12;
              return E !== v.e && p(b, "x", v.e = E), z !== v.t && p(b, "y", v.t = z), v;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), Se), g(u, d(R, {
          get when() {
            return x() === Sp || x() === Nt;
          },
          get children() {
            var b = yp();
            return $((v) => {
              var E = U().x, z = U().y;
              return E !== v.e && p(b, "x", v.e = E), z !== v.t && p(b, "y", v.t = z), v;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), Se), g(u, d(R, {
          get when() {
            return x() === Ct;
          },
          get children() {
            return d(Ae, {
              class: "ninja",
              ninja: () => ({
                x: U().x,
                y: U().y,
                deg: 0
              }),
              bones: () => he() ?? eh
            });
          }
        }), Se), g(u, d(R, {
          get when() {
            return se();
          },
          get children() {
            var b = wp();
            return $(() => p(b, "points", r().map(({ x: v, y: E }) => `${v},${E}`).join(" "))), b;
          }
        }), Se), $((b) => {
          var v = n(), E = [
            $p,
            Nt,
            pr
          ].includes(x()) ? "url(#outline)" : "", z = l(), ge = ne(), je = B();
          return v !== b.e && p(we, "d", b.e = v), E !== b.t && p($e, "filter", b.t = E), z !== b.a && p(De, "d", b.a = z), ge !== b.o && p(Ke, "d", b.o = ge), je !== b.i && p(Se, "d", b.i = je), b;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        }), u;
      })(),
      d(Vd, {
        editor: e,
        get setReplay() {
          return t.setReplay;
        },
        render: ee,
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
        setShowTrail: le,
        get dynamicFriction() {
          return t.dynamicFriction;
        },
        get setDynamicFriction() {
          return t.setDynamicFriction;
        }
      })
    ];
  }
  jt([
    "mousemove",
    "mousedown",
    "dblclick",
    "mouseup",
    "contextmenu"
  ]);
  var nh = f("<div id=media-controls><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb></div></div><div><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import replay<input type=file style=display:none></label> | <a href=# download=1234 style=color:var(--main-menu-selected);margin-left:1em>Export attract</a> | <a href=# download=replay style=color:var(--main-menu-selected);margin-left:1em>Export replay");
  function sh(t) {
    const e = () => {
      const s = t.progress(), c = t.length();
      return c === 0 || s >= c ? "100%" : `${s / c * 100}%`;
    }, r = () => {
      const s = t.progress(), c = t.previewProgress(), h = t.length();
      if (c === void 0 || h === 0) return {
        left: "0%",
        width: "0%"
      };
      const k = Math.min(s, c), x = Math.min(Math.max(s, c), h);
      return {
        left: `${k / h * 100}%`,
        width: `${(x - k) / h * 100}%`
      };
    };
    let n;
    document.addEventListener("mousemove", l), Oe(() => document.removeEventListener("mousemove", l)), document.addEventListener("mouseup", i), Oe(() => document.removeEventListener("mouseup", i));
    function _(s) {
      if (n) {
        const { left: c, top: h, width: k } = n.getBoundingClientRect();
        let x = (s.clientX - c) / k;
        x = Math.min(1, x), x = Math.max(0, x);
        let T = Math.abs(s.clientY - h);
        return {
          targetFrame: Math.round(x * t.length()),
          strength: Math.pow(Math.E, -5 * T / k)
        };
      } else return {
        targetFrame: 0,
        strength: 0
      };
    }
    function l(s) {
      if (n) {
        const c = t.dragStart();
        if (c !== void 0) {
          const { targetFrame: h, strength: k } = _(s);
          t.seek(Math.round(c + (h - c) * k)), t.previewSeek(void 0);
        } else n.matches(":hover") ? t.previewSeek(_(s).targetFrame) : t.previewSeek(void 0);
      }
    }
    function i() {
      t.setDragStart(void 0);
    }
    return (() => {
      var s = nh(), c = s.firstChild, h = c.firstChild, k = c.nextSibling, x = k.firstChild, T = x.nextSibling, A = T.nextSibling, V = A.nextSibling, U = k.nextSibling, re = U.firstChild, ne = re.firstChild, q = ne.nextSibling, O = re.nextSibling, Y = O.nextSibling, G = Y.nextSibling, de = G.nextSibling;
      c.$$click = () => {
        t.isPlaying() ? t.setIsPlaying(false) : (t.progress() >= t.length() && t.seek(0), t.setIsPlaying(true));
      }, g(h, d(Pr, {
        get children() {
          return [
            d(Xe, {
              get when() {
                return !t.isPlaying();
              },
              children: "\u25B6"
            }),
            d(Xe, {
              get when() {
                return t.isPlaying();
              },
              children: "\u23F8"
            })
          ];
        }
      })), k.$$mousedown = (C) => {
        t.setDragStart(_(C).targetFrame), l(C), C.preventDefault();
      };
      var _e = n;
      return typeof _e == "function" ? rs(_e, k) : n = k, q.addEventListener("change", function() {
        const C = this.files;
        if (C && C.length > 0) {
          const W = new FileReader();
          W.onloadend = () => {
            if (W.result instanceof ArrayBuffer) {
              const X = t.editor.load_outte_replay(new Uint8Array(W.result), false, false);
              t.addReplay(X);
            }
          }, W.readAsArrayBuffer(C[0]);
        }
      }), Y.$$click = function() {
        const C = t.attract(), W = new Blob([
          C.buffer
        ], {
          type: "application/octet-stream"
        }), X = URL.createObjectURL(W);
        this.href = X, setTimeout(() => URL.revokeObjectURL(X), 100);
      }, de.$$click = function() {
        const C = t.toReplay(), W = new Blob([
          C.buffer
        ], {
          type: "application/octet-stream"
        }), X = URL.createObjectURL(W);
        this.href = X, setTimeout(() => URL.revokeObjectURL(X), 100);
      }, $((C) => {
        var W = e(), X = r().left, se = r().width, le = e();
        return W !== C.e && lt(T, "width", C.e = W), X !== C.t && lt(A, "left", C.t = X), se !== C.a && lt(A, "width", C.a = se), le !== C.o && lt(V, "left", C.o = le), C;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), s;
    })();
  }
  jt([
    "click",
    "mousedown"
  ]);
  var oh = f("<svg><circle r=1.5 fill=var(--background)></svg>", false, true, false), ih = f('<svg><path d="M -3 1 L 0 -3 L 3 1 L 0 -1 Z"fill=none stroke-width=3 stroke-linecap=round stroke-linejoin=round></svg>', false, true, false), _h = f("<svg><g></svg>", false, true, false);
  function lh(t) {
    return [
      d(K, {
        get each() {
          return t.inputs();
        },
        children: (e, r) => (() => {
          var n = _h();
          return g(n, d(R, {
            get when() {
              return !(e() > 0);
            },
            get children() {
              var _ = oh();
              return $(() => p(_, "opacity", Number.isNaN(e()) ? 0.3 : 1)), _;
            }
          }), null), g(n, d(R, {
            get when() {
              return e() > 0;
            },
            get children() {
              var _ = ih();
              return $(() => p(_, "stroke", `oklch(60% 80% ${ch(e())}deg)`)), _;
            }
          }), null), $(() => p(n, "transform", `translate(${36 + 24 * r},${24 * 24.5}) rotate(${ah(e())},0,0)`)), n;
        })()
      }),
      d(K, {
        get each() {
          return t.pastNinjas();
        },
        children: (e, r) => d(R, {
          get when() {
            return e().length;
          },
          get children() {
            return d(Ae, {
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
  function ah(t) {
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
  function ch(t) {
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
  var dh = f("<svg><use href=#rocket></svg>", false, true, false), uh = f('<svg><g id=rocket><path d="M -5 2 H 3 A 2 2 0 0 0 3 -2 H -5 Z"fill=var(--rocket)></svg>', false, true, false);
  function ph(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function hh(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function gh([t, e], r, n) {
    const _ = t(), l = r.rockets_len(), i = [];
    for (let s = 0; s < l; s++) {
      const c = _.at(s), h = r.rocket_x(s, n), k = r.rocket_y(s, n), x = {
        x: Number.isFinite(h) ? h : -99,
        y: Number.isFinite(k) ? k : -99,
        deg: r.rocket_deg(s)
      };
      c && ph(c, x) ? i.push(c) : i.push(x);
    }
    e(i);
  }
  function mr(t) {
    return d(K, {
      get each() {
        return t.rockets();
      },
      children: (e) => (() => {
        var r = dh();
        return $(() => p(r, "transform", hh(e))), r;
      })()
    });
  }
  function fh() {
    return uh();
  }
  var yh = f("<svg><use></svg>", false, true, false), wh = f("<svg><use href=#gauss-crosshair></svg>", false, true, false), mh = f('<svg><g id=aim0><path d="M -9 -7 V -9 h 2 M 7 -9 H 9 v 2 M 9 7 V 9 h -2 M -7 9 H -9 v -2"stroke=black fill=none></svg>', false, true, false), xh = f('<svg><g id=aim1><path d="M -7 -4.5 V -7 h 2.5 M 4.5 -7 H 7 v 2.5 M 7 4.5 V 7 h -2.5 M -4.5 7 H -7 v -2.5"stroke=black fill=none></svg>', false, true, false), bh = f('<svg><g id=aim2><path d="M -6 -3 V -6 h 3 M 3 -6 H 6 v 3 M 6 3 V 6 h -3 M -3 6 H -6 v -3"stroke=black fill=none></svg>', false, true, false), vh = f('<svg><g id=aim3><path d="M -5 -2 V -5 h 3 M 2 -5 H 5 v 3 M 5 2 V 5 h -3 M -2 5 H -5 v -3"stroke=black fill=none></svg>', false, true, false), kh = f('<svg><g id=gauss-crosshair><path d="M 0 -4 V 4 M -4 0 H 4"stroke=black fill=none></svg>', false, true, false);
  function $h(t, e) {
    return t.x === e.x && t.y === e.y && t.state === e.state && t.aim_region === e.aim_region;
  }
  function xr(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Dh([t, e], r) {
    const n = t(), _ = r.gauss_len(), l = [];
    for (let i = 0; i < _; i++) {
      const s = n.at(i), c = {
        x: r.gauss_aim_x(i),
        y: r.gauss_aim_y(i),
        state: r.gauss_state(i),
        aim_region: r.gauss_aim_region(i)
      };
      s && $h(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function Sh(t) {
    return d(K, {
      get each() {
        return t.gauss();
      },
      children: (e) => d(R, {
        get when() {
          return e().state != Ln;
        },
        get children() {
          return [
            (() => {
              var r = yh();
              return $((n) => {
                var _ = [
                  "#aim0",
                  "#aim1",
                  "#aim2",
                  "#aim3"
                ][e().aim_region], l = xr(e);
                return _ !== n.e && p(r, "href", n.e = _), l !== n.t && p(r, "transform", n.t = l), n;
              }, {
                e: void 0,
                t: void 0
              }), r;
            })(),
            d(R, {
              get when() {
                return e().state != np;
              },
              get children() {
                var r = wh();
                return $(() => p(r, "transform", xr(e))), r;
              }
            })
          ];
        }
      })
    });
  }
  function jh() {
    return [
      (() => {
        var t = mh();
        return t.firstChild, t;
      })(),
      (() => {
        var t = xh();
        return t.firstChild, t;
      })(),
      (() => {
        var t = bh();
        return t.firstChild, t;
      })(),
      (() => {
        var t = vh();
        return t.firstChild, t;
      })(),
      kh()
    ];
  }
  var Th = f("<span style=position:absolute>"), Lh = f("<span style=position:absolute;top:1.5em;white-space:pre;font-family:monospace>"), Ph = f("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), Eh = f("<svg><use href=#crosshair></svg>", false, true, false), Mh = f("<svg><text>x </svg>", false, true, false), Ah = f("<svg><text>y </svg>", false, true, false), Nh = f("<svg><text></svg>", false, true, false), Ch = f('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), Rh = f("<div>");
  function Ih(t) {
    const e = t.replay, r = 0, n = [], [_, l] = y(true), [i, s] = y(!e.is_from_attract()), [c, h] = y(), [k, x] = y(0), [T, A] = y(0), [V, U] = y(), [re, ne] = y(5400), q = (m) => {
      if (m.code === "Enter") e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), i() || Ie(1);
      else if (m.code === "Escape") i() ? (s(false), l(false), U(void 0), O(), t.editor.set_start_replay_paused(true)) : (s(true), l(true), t.editor.set_start_replay_paused(false));
      else if (m.code === "Comma") {
        if (!i() && T() > 0) {
          A(T() - 1), e.seek(Math.max(0, T() - r));
          for (const F of n) F.seek(T());
          let { isJump1Pressed: S, isJump2Pressed: Z, isRightPressed: H, isLeftPressed: L, isDownPressed: I, isSuicidePressed: M } = t.globalEventState;
          S() || Z() || H() || L() || M() ? e.set_input(S() || Z(), H(), L(), M()) : I() && e.set_input(false, false, false, false), O(), Ie(1);
        }
      } else if (m.code === "Period" && !i()) {
        let { isJump1Pressed: S, isJump2Pressed: Z, isRightPressed: H, isLeftPressed: L, isDownPressed: I, isSuicidePressed: M } = t.globalEventState;
        S() || Z() || H() || L() || M() ? e.set_input(S() || Z(), H(), L(), M()) : (I() || e.inputs_len() === e.progress()) && e.set_input(false, false, false, false), T() >= r && e.tick();
        for (const F of n) F.tick();
        A(T() + 1), O(), Ie(1);
      }
    };
    function O() {
      e.seek_preview(e.progress() + 120), U(e.progress_preview()), ot(), Tt(), st(), Rn(e.ninja_info());
    }
    document.addEventListener("keydown", q), Oe(() => {
      document.removeEventListener("keydown", q);
    });
    const Y = () => e.tiles_path(), [G, de] = y({
      x: -50,
      y: -50,
      deg: 0
    }), [_e, C] = y({
      x: -50,
      y: -50,
      deg: 0
    }), [W, X] = y({
      x: -50,
      y: -50,
      deg: 0
    }), [se, le] = y(), [he, j] = y(), [N, D] = y(), [B, P] = y(), Q = y([]), ee = y([]), xe = y([]), ye = y([]), ke = y([]), be = y([]), Ce = y([]), Re = y([]), u = y([]), w = y([]), He = y([]), J = y([]), we = y([]), $e = y([]), De = y([]), Te = y([]), Ke = y([]), Se = y([]), b = y([]), v = y([]), E = y([]), z = y([]), ge = y([]), je = y([]), Fe = y([]), Kt = y([]), Vt = y([]);
    Vu(Vt, e);
    const Ut = y([]), zt = y([]), [Cn, Rn] = y(""), [fe, qt] = y(), [In, Bn] = y([]);
    function st() {
      const m = [], S = e.past_ninjas_len();
      for (let Z = 0; Z < S; Z++) m.push({
        x: e.past_ninja_x(Z),
        y: e.past_ninja_y(Z)
      });
      Bn(m);
    }
    st();
    const [On, Gn] = y([]);
    function ot() {
      const m = [];
      for (let S = -21; S < 21; S++) {
        const Z = S + e.progress();
        Z < 0 || Z >= e.inputs_len() ? m.push(NaN) : m.push(e.input(Z));
      }
      Gn(m);
    }
    ot();
    const [Hn, Kn] = y([]);
    function Tt() {
      const m = [];
      for (let S = -20; S <= 20; S++) {
        const Z = S + e.progress();
        m.push(e.past_ninja_bones(Z));
      }
      Kn(m);
    }
    Tt();
    let Yt = performance.now();
    const Lt = 1e3 / 60;
    let it = 0, Zt = 0;
    function Ft() {
      const m = performance.now(), S = Math.min(m - Yt, 250);
      Yt = m;
      let Z = 1;
      const H = e;
      if (i() && c() === void 0) {
        if (_() || T() < k()) {
          for (it += S; it >= Lt; ) {
            if (_()) {
              let { isJump1Pressed: L, isJump2Pressed: I, isRightPressed: M, isLeftPressed: F, isSuicidePressed: ae } = t.globalEventState;
              H.set_input(L() || I(), M(), F(), ae());
            }
            T() >= r && H.tick();
            for (const L of n) L.tick();
            ot(), it -= Lt;
          }
          Z = it / Lt, A(T() + 1);
        } else if (T() < k()) {
          T() >= r && H.tick();
          for (const L of n) L.tick();
          A(T() + 1);
        } else s(false);
        Ie(Z);
      }
      Zt = requestAnimationFrame(Ft);
    }
    Ft(), Oe(() => {
      cancelAnimationFrame(Zt);
    });
    function Ie(m) {
      ne(e.score()), de({
        x: e.ninja_x(m),
        y: e.ninja_y(m),
        deg: 0
      }), C({
        x: e.ninja_preview_x(m),
        y: e.ninja_preview_y(m),
        deg: 0
      }), X({
        x: e.portal_ninja_x(m),
        y: e.portal_ninja_y(m),
        deg: 0
      }), le(e.ninja_bones(m)), P(n.map((Z) => ({
        ninja: {
          x: Z.ninja_x(m),
          y: Z.ninja_y(m),
          deg: 0
        },
        bones: Z.ninja_bones(m)
      }))), V() === void 0 ? j(void 0) : j(e.ninja_preview_bones(m)), D(e.portal_ninja_bones()), pc(Q, e), Du(ee, e), ud(xe, e, m), sc(ye, e), yd(ke, e, m), vd(be, e, m), td(Ce, e), id(Re, e, m), Tc(u, e, m), Ic(w, e), Kc(He, e, m), Xc(J, e), mc(we, e, m), jd($e, e, m), qa(De, e, m), Ja(Te, e, m), Qd(Ke, e, m), xu(Se, e, m), ou(b, e, m), gu(v, e, m), Pu(E, e, m), Ju(ge, e), gh(je, e, m), ip(Fe, e), Dh(Kt, e), Ru(z, e, m), dp(Ut, e);
      const S = zt[1];
      e.ninja_form() === 0 ? S([]) : S([
        {
          x: e.ninja_x(m),
          y: e.ninja_y(m),
          deg: e.ninja_deg()
        }
      ]), x(e.replay_length() + r);
    }
    return Ie(1), [
      (() => {
        var m = Th();
        return g(m, () => (re() / 60).toFixed(3)), m;
      })(),
      d(R, {
        get when() {
          return !i();
        },
        get children() {
          var m = Lh();
          return g(m, Cn), m;
        }
      }),
      (() => {
        var m = Ch(), S = m.firstChild, Z = S.firstChild, H = Z.nextSibling, L = S.nextSibling;
        return m.$$mousedown = function() {
          const { x: I, y: M } = t.globalEventState.mouseGamePos(), F = Math.round(I / 6) * 6, ae = Math.round(M / 6) * 6, _t = fe();
          F === (_t == null ? void 0 : _t.x) && ae === (_t == null ? void 0 : _t.y) ? qt(void 0) : qt({
            x: F,
            y: ae
          });
        }, m.$$mousemove = function(I) {
          const { left: M, top: F, width: ae, height: _t } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (I.clientX - M) / ae * 1056,
            y: (I.clientY - F) / _t * 600
          });
        }, g(S, d(Ir, {}), H), g(S, d(fn, {}), H), g(S, d(Zr, {}), H), g(S, d(Cr, {}), H), g(S, d(Hr, {}), H), g(S, d(Ur, {}), H), g(S, d(Wr, {}), H), g(S, d(Jr, {}), H), g(S, d(cn, {}), H), g(S, d(un, {}), H), g(S, d(ln, {}), H), g(S, d(hn, {}), H), g(S, d(wn, {}), H), g(S, d(Za, {}), H), g(S, d(bn, {}), H), g(S, d(Tn, {}), H), g(S, d(fh, {}), H), g(S, d(Mn, {}), H), g(S, d(jh, {}), H), g(S, d(kn, {}), H), g(S, d(Nn, {}), H), g(m, d(vn, {
          get portals() {
            return Vt[0];
          },
          showMode: false
        }), L), g(m, d(Kr, {
          get trapDoors() {
            return He[0];
          }
        }), L), g(m, d(Or, {
          get lockedDoors() {
            return u[0];
          }
        }), L), g(m, d(Gr, {
          get lockedSwitches() {
            return w[0];
          }
        }), L), g(m, d(Vr, {
          get trapSwitches() {
            return J[0];
          }
        }), L), g(m, d(Mr, {
          get exitDoors() {
            return De[0];
          }
        }), L), g(m, d(Nr, {
          get oneWays() {
            return ye[0];
          }
        }), L), g(m, d(Rr, {
          get mines() {
            return Q[0];
          }
        }), L), g(m, d(gn, {
          get golds() {
            return ee[0];
          }
        }), L), g(m, d(Ar, {
          get exitSwitches() {
            return Te[0];
          }
        }), L), g(m, d(Br, {
          get regularDoors() {
            return we[0];
          }
        }), L), g(m, d(zr, {
          get launchPads() {
            return Ce[0];
          }
        }), L), g(m, d(dn, {
          get laserDrones() {
            return v[0];
          }
        }), L), g(m, d(an, {
          get chaingunDrones() {
            return b[0];
          }
        }), L), g(m, d(_n, {
          get zapDrones() {
            return Ke[0];
          }
        }), L), g(m, d(pn, {
          get chaseDrones() {
            return Se[0];
          }
        }), L), g(m, d(qr, {
          get floorGuards() {
            return Re[0];
          }
        }), L), g(m, d(yn, {
          get deathballs() {
            return E[0];
          }
        }), L), g(m, d($n, {
          get rocketTurrets() {
            return ge[0];
          }
        }), L), g(m, d(An, {
          get rocketMorphs() {
            return Ut[0];
          }
        }), L), g(m, d(Pn, {
          get gaussTurrets() {
            return Fe[0];
          }
        }), L), g(m, d(Sh, {
          get gauss() {
            return Kt[0];
          }
        }), L), g(m, d(mr, {
          get rockets() {
            return je[0];
          }
        }), L), g(m, d(Xr, {
          get thwumps() {
            return be[0];
          }
        }), L), g(m, d(xn, {
          get evilNinjas() {
            return z[0];
          }
        }), L), g(m, d(Ae, {
          class: "ninja preview",
          ninja: _e,
          bones: he
        }), L), g(m, d(Yr, {
          get bounceBlocks() {
            return xe[0];
          }
        }), L), g(m, d(Qr, {
          get shoveThwumps() {
            return $e[0];
          }
        }), L), g(m, d(Fr, {
          get boostPads() {
            return ke[0];
          }
        }), L), g(m, d(R, {
          get when() {
            return Number.isFinite(W().x);
          },
          get children() {
            return d(Ae, {
              class: "ninja",
              ninja: W,
              bones: N
            });
          }
        }), L), g(m, d(et, {
          get each() {
            return B();
          },
          children: ({ ninja: I, bones: M }) => d(Ae, {
            class: "ninja",
            ninja: () => I,
            bones: () => M
          })
        }), L), g(m, d(Ae, {
          class: "ninja",
          ninja: G,
          bones: se
        }), L), g(m, d(mr, {
          get rockets() {
            return zt[0];
          }
        }), L), g(m, d(R, {
          get when() {
            return !i();
          },
          get children() {
            return [
              (() => {
                var I = Ph();
                return $(() => p(I, "points", In().slice(T(), V() || 0).map(({ x: M, y: F }) => `${M},${F}`).join(" "))), I;
              })(),
              d(lh, {
                inputs: On,
                pastNinjas: Hn
              }),
              d(R, {
                get when() {
                  return fe();
                },
                get children() {
                  return [
                    (() => {
                      var I = Eh();
                      return $((M) => {
                        var F = fe().x, ae = fe().y;
                        return F !== M.e && p(I, "x", M.e = F), ae !== M.t && p(I, "y", M.t = ae), M;
                      }, {
                        e: void 0,
                        t: void 0
                      }), I;
                    })(),
                    (() => {
                      var I = Mh();
                      return I.firstChild, g(I, () => fe().x - G().x, null), $((M) => {
                        var F = fe().x, ae = fe().y;
                        return F !== M.e && p(I, "x", M.e = F), ae !== M.t && p(I, "y", M.t = ae), M;
                      }, {
                        e: void 0,
                        t: void 0
                      }), I;
                    })(),
                    (() => {
                      var I = Ah();
                      return I.firstChild, g(I, () => fe().y - G().y, null), $((M) => {
                        var F = fe().x, ae = fe().y + 20;
                        return F !== M.e && p(I, "x", M.e = F), ae !== M.t && p(I, "y", M.t = ae), M;
                      }, {
                        e: void 0,
                        t: void 0
                      }), I;
                    })(),
                    (() => {
                      var I = Nh();
                      return g(I, () => {
                        let M = fe().x - G().x, F = fe().y - G().y;
                        return Math.sqrt(M * M + F * F);
                      }), $((M) => {
                        var F = fe().x, ae = fe().y + 40;
                        return F !== M.e && p(I, "x", M.e = F), ae !== M.t && p(I, "y", M.t = ae), M;
                      }, {
                        e: void 0,
                        t: void 0
                      }), I;
                    })()
                  ];
                }
              })
            ];
          }
        }), null), $(() => p(L, "d", Y())), m;
      })(),
      (() => {
        var m = Rh();
        return g(m, d(R, {
          get when() {
            return !_() || !i();
          },
          get children() {
            return d(sh, {
              isPlaying: i,
              setIsPlaying: (S) => {
                S ? (s(true), l(false)) : (s(false), l(true));
              },
              dragStart: c,
              setDragStart: h,
              length: k,
              progress: T,
              previewProgress: V,
              seek: (S) => {
                A(S), e.seek(Math.max(0, S - r));
                for (const Z of n) Z.seek(S);
                ot(), Tt(), st(), Ie(1);
              },
              previewSeek: (S) => {
                U(S), st(), e && (S !== void 0 && c() === void 0 && e.seek_preview(S), Ie(1));
              },
              attract: () => e.export_attract(t.editor),
              get editor() {
                return t.editor;
              },
              addReplay: (S) => {
                n.push(S);
              },
              toReplay: () => e.export_replay()
            });
          }
        })), m;
      })()
    ];
  }
  jt([
    "mousemove",
    "mousedown"
  ]);
  var Bh = f("<p>Invalid file."), Oh = f("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file><dl><dt>Windows</dt><dd>C:\\Program Files (x86)\\Steam\\steamapps\\common\\N++\\anim_data_line_new.txt.bin</dd><dt>Linux</dt><dd>~/.steam/steam/steamapps/common/N++/anim_data_line_new.txt.bin</dd><dt>Mac</dt><dd>~/Library/Application Support/Steam/steamapps/common/N++/N++.app/Contents/Resources/NPP/anim_data_line_new.txt.bin");
  function Gh() {
    const t = Ge.new(), [e, r] = y(), [n, _] = y(""), [l, i] = y(false), [s, c] = y(false), [h, k] = y([]);
    function x() {
      const P = [], Q = t.past_ninjas_len();
      for (let ee = 0; ee < Q; ee++) P.push({
        x: t.past_ninja_x(ee),
        y: t.past_ninja_y(ee)
      });
      k(P);
    }
    const [T, A] = y(false), [V, U] = y(false), [re, ne] = y(false), [q, O] = y(false), [Y, G] = y(false), [de, _e] = y(false), [C, W] = y({
      x: 36,
      y: 36
    }), X = {
      isJump1Pressed: T,
      isJump2Pressed: V,
      isRightPressed: re,
      isLeftPressed: q,
      isSuicidePressed: Y,
      isDownPressed: de,
      mouseGamePos: C,
      setMouseGamePos: W
    };
    Ld(t), _(t.get_level_name()), document.addEventListener("keydown", (P) => {
      if (!(P.ctrlKey || P.metaKey)) if (P.code === "Tab") {
        const Q = e();
        Q ? (r(void 0), Q.send_past_ninjas(), t.receive_past_ninjas(), Q.free(), x()) : r(t.to_replay(l(), s())), P.preventDefault();
      } else P.code === "KeyZ" ? A(true) : P.code === "ArrowUp" ? U(true) : P.code === "ArrowRight" ? ne(true) : P.code === "ArrowLeft" ? O(true) : P.code === "ArrowDown" ? _e(true) : P.code === "KeyV" && G(true);
    }), document.addEventListener("keyup", (P) => {
      P.code === "KeyZ" ? A(false) : P.code === "ArrowUp" ? U(false) : P.code === "ArrowRight" ? ne(false) : P.code === "ArrowLeft" ? O(false) : P.code === "ArrowDown" ? _e(false) : P.code === "KeyV" && G(false);
    }), document.addEventListener("blur", () => {
      A(false), U(false), ne(false), O(false), G(false), _e(false);
    }), Ed(t);
    const se = 0, le = 1, he = 2, [j, N] = y(t.get_anim_state() == se ? se : he), [D, B] = y(Nd());
    return qn(() => {
      const P = D();
      P && (Gd(P.colors), Md(P));
    }), Od().then(() => {
      const P = D();
      if (P) {
        const Q = on(P.name);
        Q && (P.colors = Q), B(P);
      }
    }), [
      d(R, {
        get when() {
          return j() != se;
        },
        get children() {
          var P = Oh(), Q = P.firstChild, ee = Q.nextSibling;
          return ee.nextSibling, ee.addEventListener("change", function() {
            const xe = this.files;
            if (xe && xe.length > 0) {
              const ye = new FileReader();
              ye.onloadend = () => {
                if (ye.result instanceof ArrayBuffer) {
                  const ke = new Uint8Array(ye.result);
                  try {
                    try {
                      Pd(ke);
                    } catch (be) {
                      console.error(be);
                    }
                    t.set_anim_data(ke), N(t.get_anim_state());
                  } catch (be) {
                    console.error(be), N(le);
                  }
                }
              }, ye.readAsArrayBuffer(xe[0]);
            }
          }), g(P, d(R, {
            get when() {
              return j() == le;
            },
            get children() {
              return Bh();
            }
          }), null), P;
        }
      }),
      d(R, {
        get when() {
          return qe(() => j() == se)() && !e();
        },
        get children() {
          return d(rh, {
            editor: t,
            setReplay: r,
            pastNinjas: h,
            globalEventState: X,
            levelName: n,
            setLevelName: _,
            roundCorners: l,
            setRoundCorners: i,
            palette: D,
            setPalette: B,
            dynamicFriction: s,
            setDynamicFriction: c
          });
        }
      }),
      d(R, {
        get when() {
          return qe(() => j() == se)() && !!e();
        },
        keyed: true,
        get children() {
          return d(Ih, {
            get replay() {
              return e();
            },
            editor: t,
            globalEventState: X
          });
        }
      })
    ];
  }
  const Hh = document.getElementById("root");
  ts(() => d(Gh, {}), Hh);
})();
