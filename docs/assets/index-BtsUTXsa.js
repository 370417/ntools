(async () => {
  (function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const o of document.querySelectorAll('link[rel="modulepreload"]')) n(o);
    new MutationObserver((o) => {
      for (const l of o) if (l.type === "childList") for (const _ of l.addedNodes) _.tagName === "LINK" && _.rel === "modulepreload" && n(_);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function r(o) {
      const l = {};
      return o.integrity && (l.integrity = o.integrity), o.referrerPolicy && (l.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? l.credentials = "include" : o.crossOrigin === "anonymous" ? l.credentials = "omit" : l.credentials = "same-origin", l;
    }
    function n(o) {
      if (o.ep) return;
      o.ep = true;
      const l = r(o);
      fetch(o.href, l);
    }
  })();
  const Jr = false, Xr = (t, e) => t === e, Zt = Symbol("solid-track"), rt = {
    equals: Xr
  };
  let Yt = er;
  const De = 1, nt = 2, Jt = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var J = null;
  let ht = null, Qr = null, Y = null, re = null, xe = null, at = 0;
  function Oe(t, e) {
    const r = Y, n = J, o = t.length === 0, l = e === void 0 ? n : e, _ = o ? Jt : {
      owned: null,
      cleanups: null,
      context: l ? l.context : null,
      owner: l
    }, s = o ? t : () => t(() => ge(() => Ue(_)));
    J = _, Y = null;
    try {
      return We(s, true);
    } finally {
      Y = r, J = n;
    }
  }
  function w(t, e) {
    e = e ? Object.assign({}, rt, e) : rt;
    const r = {
      value: t,
      observers: null,
      observerSlots: null,
      comparator: e.equals || void 0
    }, n = (o) => (typeof o == "function" && (o = o(r.value)), Qt(r, o));
    return [
      Xt.bind(r),
      n
    ];
  }
  function k(t, e, r) {
    const n = kt(t, e, false, De);
    Fe(n);
  }
  function en(t, e, r) {
    Yt = sn;
    const n = kt(t, e, false, De);
    n.user = true, xe ? xe.push(n) : Fe(n);
  }
  function de(t, e, r) {
    r = r ? Object.assign({}, rt, r) : rt;
    const n = kt(t, e, true, 0);
    return n.observers = null, n.observerSlots = null, n.comparator = r.equals || void 0, Fe(n), Xt.bind(n);
  }
  function ge(t) {
    if (Y === null) return t();
    const e = Y;
    Y = null;
    try {
      return t();
    } finally {
      Y = e;
    }
  }
  function Ee(t) {
    return J === null || (J.cleanups === null ? J.cleanups = [
      t
    ] : J.cleanups.push(t)), t;
  }
  function tn(t) {
    const e = de(t), r = de(() => bt(e()));
    return r.toArray = () => {
      const n = r();
      return Array.isArray(n) ? n : n != null ? [
        n
      ] : [];
    }, r;
  }
  function Xt() {
    if (this.sources && this.state) if (this.state === De) Fe(this);
    else {
      const t = re;
      re = null, We(() => ot(this), false), re = t;
    }
    if (Y) {
      const t = this.observers ? this.observers.length : 0;
      Y.sources ? (Y.sources.push(this), Y.sourceSlots.push(t)) : (Y.sources = [
        this
      ], Y.sourceSlots = [
        t
      ]), this.observers ? (this.observers.push(Y), this.observerSlots.push(Y.sources.length - 1)) : (this.observers = [
        Y
      ], this.observerSlots = [
        Y.sources.length - 1
      ]);
    }
    return this.value;
  }
  function Qt(t, e, r) {
    let n = t.value;
    return (!t.comparator || !t.comparator(n, e)) && (t.value = e, t.observers && t.observers.length && We(() => {
      for (let o = 0; o < t.observers.length; o += 1) {
        const l = t.observers[o], _ = ht && ht.running;
        _ && ht.disposed.has(l), (_ ? !l.tState : !l.state) && (l.pure ? re.push(l) : xe.push(l), l.observers && tr(l)), _ || (l.state = De);
      }
      if (re.length > 1e6) throw re = [], new Error();
    }, false)), e;
  }
  function Fe(t) {
    if (!t.fn) return;
    Ue(t);
    const e = at;
    rn(t, t.value, e);
  }
  function rn(t, e, r) {
    let n;
    const o = J, l = Y;
    Y = J = t;
    try {
      n = t.fn(e);
    } catch (_) {
      return t.pure && (t.state = De, t.owned && t.owned.forEach(Ue), t.owned = null), t.updatedAt = r + 1, rr(_);
    } finally {
      Y = l, J = o;
    }
    (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? Qt(t, n) : t.value = n, t.updatedAt = r);
  }
  function kt(t, e, r, n = De, o) {
    const l = {
      fn: t,
      state: n,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: e,
      owner: J,
      context: J ? J.context : null,
      pure: r
    };
    return J === null || J !== Jt && (J.owned ? J.owned.push(l) : J.owned = [
      l
    ]), l;
  }
  function st(t) {
    if (t.state === 0) return;
    if (t.state === nt) return ot(t);
    if (t.suspense && ge(t.suspense.inFallback)) return t.suspense.effects.push(t);
    const e = [
      t
    ];
    for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < at); ) t.state && e.push(t);
    for (let r = e.length - 1; r >= 0; r--) if (t = e[r], t.state === De) Fe(t);
    else if (t.state === nt) {
      const n = re;
      re = null, We(() => ot(t, e[0]), false), re = n;
    }
  }
  function We(t, e) {
    if (re) return t();
    let r = false;
    e || (re = []), xe ? r = true : xe = [], at++;
    try {
      const n = t();
      return nn(r), n;
    } catch (n) {
      r || (xe = null), re = null, rr(n);
    }
  }
  function nn(t) {
    if (re && (er(re), re = null), t) return;
    const e = xe;
    xe = null, e.length && We(() => Yt(e), false);
  }
  function er(t) {
    for (let e = 0; e < t.length; e++) st(t[e]);
  }
  function sn(t) {
    let e, r = 0;
    for (e = 0; e < t.length; e++) {
      const n = t[e];
      n.user ? t[r++] = n : st(n);
    }
    for (e = 0; e < r; e++) st(t[e]);
  }
  function ot(t, e) {
    t.state = 0;
    for (let r = 0; r < t.sources.length; r += 1) {
      const n = t.sources[r];
      if (n.sources) {
        const o = n.state;
        o === De ? n !== e && (!n.updatedAt || n.updatedAt < at) && st(n) : o === nt && ot(n, e);
      }
    }
  }
  function tr(t) {
    for (let e = 0; e < t.observers.length; e += 1) {
      const r = t.observers[e];
      r.state || (r.state = nt, r.pure ? re.push(r) : xe.push(r), r.observers && tr(r));
    }
  }
  function Ue(t) {
    let e;
    if (t.sources) for (; t.sources.length; ) {
      const r = t.sources.pop(), n = t.sourceSlots.pop(), o = r.observers;
      if (o && o.length) {
        const l = o.pop(), _ = r.observerSlots.pop();
        n < o.length && (l.sourceSlots[_] = n, o[n] = l, r.observerSlots[n] = _);
      }
    }
    if (t.tOwned) {
      for (e = t.tOwned.length - 1; e >= 0; e--) Ue(t.tOwned[e]);
      delete t.tOwned;
    }
    if (t.owned) {
      for (e = t.owned.length - 1; e >= 0; e--) Ue(t.owned[e]);
      t.owned = null;
    }
    if (t.cleanups) {
      for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
      t.cleanups = null;
    }
    t.state = 0;
  }
  function on(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function rr(t, e = J) {
    throw on(t);
  }
  function bt(t) {
    if (typeof t == "function" && !t.length) return bt(t());
    if (Array.isArray(t)) {
      const e = [];
      for (let r = 0; r < t.length; r++) {
        const n = bt(t[r]);
        Array.isArray(n) ? e.push.apply(e, n) : e.push(n);
      }
      return e;
    }
    return t;
  }
  const xt = Symbol("fallback");
  function it(t) {
    for (let e = 0; e < t.length; e++) t[e]();
  }
  function _n(t, e, r = {}) {
    let n = [], o = [], l = [], _ = 0, s = e.length > 1 ? [] : null;
    return Ee(() => it(l)), () => {
      let c = t() || [], p = c.length, $, y;
      return c[Zt], ge(() => {
        let N, K, H, F, U, E, B, O, G;
        if (p === 0) _ !== 0 && (it(l), l = [], n = [], o = [], _ = 0, s && (s = [])), r.fallback && (n = [
          xt
        ], o[0] = Oe((Q) => (l[0] = Q, r.fallback())), _ = 1);
        else if (_ === 0) {
          for (o = new Array(p), y = 0; y < p; y++) n[y] = c[y], o[y] = Oe(C);
          _ = p;
        } else {
          for (H = new Array(p), F = new Array(p), s && (U = new Array(p)), E = 0, B = Math.min(_, p); E < B && n[E] === c[E]; E++) ;
          for (B = _ - 1, O = p - 1; B >= E && O >= E && n[B] === c[O]; B--, O--) H[O] = o[B], F[O] = l[B], s && (U[O] = s[B]);
          for (N = /* @__PURE__ */ new Map(), K = new Array(O + 1), y = O; y >= E; y--) G = c[y], $ = N.get(G), K[y] = $ === void 0 ? -1 : $, N.set(G, y);
          for ($ = E; $ <= B; $++) G = n[$], y = N.get(G), y !== void 0 && y !== -1 ? (H[y] = o[$], F[y] = l[$], s && (U[y] = s[$]), y = K[y], N.set(G, y)) : l[$]();
          for (y = E; y < p; y++) y in H ? (o[y] = H[y], l[y] = F[y], s && (s[y] = U[y], s[y](y))) : o[y] = Oe(C);
          o = o.slice(0, _ = p), n = c.slice(0);
        }
        return o;
      });
      function C(N) {
        if (l[y] = N, s) {
          const [K, H] = w(y);
          return s[y] = H, e(c[y], K);
        }
        return e(c[y]);
      }
    };
  }
  function ln(t, e, r = {}) {
    let n = [], o = [], l = [], _ = [], s = 0, c;
    return Ee(() => it(l)), () => {
      const p = t() || [], $ = p.length;
      return p[Zt], ge(() => {
        if ($ === 0) return s !== 0 && (it(l), l = [], n = [], o = [], s = 0, _ = []), r.fallback && (n = [
          xt
        ], o[0] = Oe((C) => (l[0] = C, r.fallback())), s = 1), o;
        for (n[0] === xt && (l[0](), l = [], n = [], o = [], s = 0), c = 0; c < $; c++) c < n.length && n[c] !== p[c] ? _[c](() => p[c]) : c >= n.length && (o[c] = Oe(y));
        for (; c < n.length; c++) l[c]();
        return s = _.length = l.length = $, n = p.slice(0), o = o.slice(0, s);
      });
      function y(C) {
        l[c] = C;
        const [N, K] = w(p[c]);
        return _[c] = K, e(N, c);
      }
    };
  }
  function d(t, e) {
    return ge(() => t(e || {}));
  }
  const nr = (t) => `Stale read from <${t}>.`;
  function _t(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return de(_n(() => t.each, t.children, e || void 0));
  }
  function V(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return de(ln(() => t.each, t.children, e || void 0));
  }
  function R(t) {
    const e = t.keyed, r = de(() => t.when, void 0, void 0), n = e ? r : de(r, void 0, {
      equals: (o, l) => !o == !l
    });
    return de(() => {
      const o = n();
      if (o) {
        const l = t.children;
        return typeof l == "function" && l.length > 0 ? ge(() => l(e ? o : () => {
          if (!ge(n)) throw nr("Show");
          return r();
        })) : l;
      }
      return t.fallback;
    }, void 0, void 0);
  }
  function sr(t) {
    const e = tn(() => t.children), r = de(() => {
      const n = e(), o = Array.isArray(n) ? n : [
        n
      ];
      let l = () => {
      };
      for (let _ = 0; _ < o.length; _++) {
        const s = _, c = o[_], p = l, $ = de(() => p() ? void 0 : c.when, void 0, void 0), y = c.keyed ? $ : de($, void 0, {
          equals: (C, N) => !C == !N
        });
        l = () => p() || (y() ? [
          s,
          $,
          c
        ] : void 0);
      }
      return l;
    });
    return de(() => {
      const n = r()();
      if (!n) return t.fallback;
      const [o, l, _] = n, s = _.children;
      return typeof s == "function" && s.length > 0 ? ge(() => s(_.keyed ? l() : () => {
        var _a2;
        if (((_a2 = ge(r)()) == null ? void 0 : _a2[0]) !== o) throw nr("Match");
        return l();
      })) : s;
    }, void 0, void 0);
  }
  function ze(t) {
    return t;
  }
  const Ie = (t) => de(() => t());
  function an(t, e, r) {
    let n = r.length, o = e.length, l = n, _ = 0, s = 0, c = e[o - 1].nextSibling, p = null;
    for (; _ < o || s < l; ) {
      if (e[_] === r[s]) {
        _++, s++;
        continue;
      }
      for (; e[o - 1] === r[l - 1]; ) o--, l--;
      if (o === _) {
        const $ = l < n ? s ? r[s - 1].nextSibling : r[l - s] : c;
        for (; s < l; ) t.insertBefore(r[s++], $);
      } else if (l === s) for (; _ < o; ) (!p || !p.has(e[_])) && e[_].remove(), _++;
      else if (e[_] === r[l - 1] && r[s] === e[o - 1]) {
        const $ = e[--o].nextSibling;
        t.insertBefore(r[s++], e[_++].nextSibling), t.insertBefore(r[--l], $), e[o] = r[l];
      } else {
        if (!p) {
          p = /* @__PURE__ */ new Map();
          let y = s;
          for (; y < l; ) p.set(r[y], y++);
        }
        const $ = p.get(e[_]);
        if ($ != null) if (s < $ && $ < l) {
          let y = _, C = 1, N;
          for (; ++y < o && y < l && !((N = p.get(e[y])) == null || N !== $ + C); ) C++;
          if (C > $ - s) {
            const K = e[_];
            for (; s < $; ) t.insertBefore(r[s++], K);
          } else t.replaceChild(r[s++], e[_++]);
        } else _++;
        else e[_++].remove();
      }
    }
  }
  const Tt = "_$DX_DELEGATE";
  function cn(t, e, r, n = {}) {
    let o;
    return Oe((l) => {
      o = l, e === document ? t() : f(e, t(), e.firstChild ? null : void 0, r);
    }, n.owner), () => {
      o(), e.textContent = "";
    };
  }
  function m(t, e, r, n) {
    let o;
    const l = () => {
      const s = n ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
      return s.innerHTML = t, r ? s.content.firstChild.firstChild : n ? s.firstChild : s.content.firstChild;
    }, _ = e ? () => ge(() => document.importNode(o || (o = l()), true)) : () => (o || (o = l())).cloneNode(true);
    return _.cloneNode = _, _;
  }
  function ct(t, e = window.document) {
    const r = e[Tt] || (e[Tt] = /* @__PURE__ */ new Set());
    for (let n = 0, o = t.length; n < o; n++) {
      const l = t[n];
      r.has(l) || (r.add(l), e.addEventListener(l, un));
    }
  }
  function h(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function Ye(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function dn(t, e, r) {
    return ge(() => t(e, r));
  }
  function f(t, e, r, n) {
    if (r !== void 0 && !n && (n = []), typeof e != "function") return lt(t, e, n, r);
    k((o) => lt(t, e(), o, r), n);
  }
  function un(t) {
    let e = t.target;
    const r = `$$${t.type}`, n = t.target, o = t.currentTarget, l = (c) => Object.defineProperty(t, "target", {
      configurable: true,
      value: c
    }), _ = () => {
      const c = e[r];
      if (c && !e.disabled) {
        const p = e[`${r}Data`];
        if (p !== void 0 ? c.call(e, p, t) : c.call(e, t), t.cancelBubble) return;
      }
      return e.host && typeof e.host != "string" && !e.host._$host && e.contains(t.target) && l(e.host), true;
    }, s = () => {
      for (; _() && (e = e._$host || e.parentNode || e.host); ) ;
    };
    if (Object.defineProperty(t, "currentTarget", {
      configurable: true,
      get() {
        return e || document;
      }
    }), t.composedPath) {
      const c = t.composedPath();
      l(c[0]);
      for (let p = 0; p < c.length - 2 && (e = c[p], !!_()); p++) {
        if (e._$host) {
          e = e._$host, s();
          break;
        }
        if (e.parentNode === o) break;
      }
    } else s();
    l(n);
  }
  function lt(t, e, r, n, o) {
    for (; typeof r == "function"; ) r = r();
    if (e === r) return r;
    const l = typeof e, _ = n !== void 0;
    if (t = _ && r[0] && r[0].parentNode || t, l === "string" || l === "number") {
      if (l === "number" && (e = e.toString(), e === r)) return r;
      if (_) {
        let s = r[0];
        s && s.nodeType === 3 ? s.data !== e && (s.data = e) : s = document.createTextNode(e), r = Me(t, r, n, s);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || l === "boolean") r = Me(t, r, n);
    else {
      if (l === "function") return k(() => {
        let s = e();
        for (; typeof s == "function"; ) s = s();
        r = lt(t, s, r, n);
      }), () => r;
      if (Array.isArray(e)) {
        const s = [], c = r && Array.isArray(r);
        if (vt(s, e, r, o)) return k(() => r = lt(t, s, r, n, true)), () => r;
        if (s.length === 0) {
          if (r = Me(t, r, n), _) return r;
        } else c ? r.length === 0 ? jt(t, s, n) : an(t, r, s) : (r && Me(t), jt(t, s));
        r = s;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (_) return r = Me(t, r, n, e);
          Me(t, r, null, e);
        } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
        r = e;
      }
    }
    return r;
  }
  function vt(t, e, r, n) {
    let o = false;
    for (let l = 0, _ = e.length; l < _; l++) {
      let s = e[l], c = r && r[t.length], p;
      if (!(s == null || s === true || s === false)) if ((p = typeof s) == "object" && s.nodeType) t.push(s);
      else if (Array.isArray(s)) o = vt(t, s, c) || o;
      else if (p === "function") if (n) {
        for (; typeof s == "function"; ) s = s();
        o = vt(t, Array.isArray(s) ? s : [
          s
        ], Array.isArray(c) ? c : [
          c
        ]) || o;
      } else t.push(s), o = true;
      else {
        const $ = String(s);
        c && c.nodeType === 3 && c.data === $ ? t.push(c) : t.push(document.createTextNode($));
      }
    }
    return o;
  }
  function jt(t, e, r = null) {
    for (let n = 0, o = e.length; n < o; n++) t.insertBefore(e[n], r);
  }
  function Me(t, e, r, n) {
    if (r === void 0) return t.textContent = "";
    const o = n || document.createTextNode("");
    if (e.length) {
      let l = false;
      for (let _ = e.length - 1; _ >= 0; _--) {
        const s = e[_];
        if (o !== s) {
          const c = s.parentNode === t;
          !l && !_ ? c ? t.replaceChild(o, s) : t.insertBefore(o, r) : c && s.remove();
        } else l = true;
      }
    } else t.insertBefore(o, r);
    return [
      o
    ];
  }
  const pn = "" + new URL("ntools_rs_bg-Dk9JeXnC.wasm", import.meta.url).href, hn = async (t = {}, e) => {
    let r;
    if (e.startsWith("data:")) {
      const n = e.replace(/^data:.*?base64,/, "");
      let o;
      if (typeof Buffer == "function" && typeof Buffer.from == "function") o = Buffer.from(n, "base64");
      else if (typeof atob == "function") {
        const l = atob(n);
        o = new Uint8Array(l.length);
        for (let _ = 0; _ < l.length; _++) o[_] = l.charCodeAt(_);
      } else throw new Error("Cannot decode base64-encoded data URL");
      r = await WebAssembly.instantiate(o, t);
    } else {
      const n = await fetch(e), o = n.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && o.startsWith("application/wasm")) r = await WebAssembly.instantiateStreaming(n, t);
      else {
        const l = await n.arrayBuffer();
        r = await WebAssembly.instantiate(l, t);
      }
    }
    return r.instance.exports;
  };
  let i;
  function gn(t) {
    i = t;
  }
  let Je = null;
  function Re() {
    return (Je === null || Je.byteLength === 0) && (Je = new Uint8Array(i.memory.buffer)), Je;
  }
  let tt = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  tt.decode();
  const fn = 2146435072;
  let gt = 0;
  function yn(t, e) {
    return gt += e, gt >= fn && (tt = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), tt.decode(), gt = e), tt.decode(Re().subarray(t, t + e));
  }
  function Te(t, e) {
    return t = t >>> 0, yn(t, e);
  }
  function or(t, e) {
    return t = t >>> 0, Re().subarray(t / 1, t / 1 + e);
  }
  let ke = 0;
  function Xe(t, e) {
    const r = e(t.length * 1, 1) >>> 0;
    return Re().set(t, r / 1), ke = t.length, r;
  }
  function Qe(t) {
    const e = i.__wbindgen_externrefs.get(t);
    return i.__externref_table_dealloc(t), e;
  }
  const Ve = new TextEncoder();
  "encodeInto" in Ve || (Ve.encodeInto = function(t, e) {
    const r = Ve.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function wn(t, e, r) {
    if (r === void 0) {
      const s = Ve.encode(t), c = e(s.length, 1) >>> 0;
      return Re().subarray(c, c + s.length).set(s), ke = s.length, c;
    }
    let n = t.length, o = e(n, 1) >>> 0;
    const l = Re();
    let _ = 0;
    for (; _ < n; _++) {
      const s = t.charCodeAt(_);
      if (s > 127) break;
      l[o + _] = s;
    }
    if (_ !== n) {
      _ !== 0 && (t = t.slice(_)), o = r(o, n, n = _ + t.length * 3, 1) >>> 0;
      const s = Re().subarray(o + _, o + n), c = Ve.encodeInto(t, s);
      _ += c.written, o = r(o, n, _, 1) >>> 0;
    }
    return ke = _, o;
  }
  let et = null;
  function mn() {
    return (et === null || et.byteLength === 0) && (et = new Float64Array(i.memory.buffer)), et;
  }
  function He(t, e) {
    return t = t >>> 0, mn().subarray(t / 8, t / 8 + e);
  }
  let Be = null;
  function bn() {
    return (Be === null || Be.buffer.detached === true || Be.buffer.detached === void 0 && Be.buffer !== i.memory.buffer) && (Be = new DataView(i.memory.buffer)), Be;
  }
  function Et(t, e) {
    t = t >>> 0;
    const r = bn(), n = [];
    for (let o = t; o < t + 4 * e; o += 4) n.push(i.__wbindgen_externrefs.get(r.getUint32(o, true)));
    return i.__externref_drop_slice(t, e), n;
  }
  function xn(t, e) {
    if (!(t instanceof e)) throw new Error(`expected instance of ${e.name}`);
  }
  const Pt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => i.__wbg_editor_free(t >>> 0, 1));
  class Pe {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Pe.prototype);
      return r.__wbg_ptr = e, Pt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Pt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      i.__wbg_editor_free(e, 0);
    }
    export_map() {
      const e = i.editor_export_map(this.__wbg_ptr);
      var r = or(e[0], e[1]).slice();
      return i.__wbindgen_free(e[0], e[1] * 1, 1), r;
    }
    press_dash() {
      i.editor_press_dash(this.__wbg_ptr);
    }
    press_down(e) {
      i.editor_press_down(this.__wbg_ptr, e);
    }
    press_left(e) {
      i.editor_press_left(this.__wbg_ptr, e);
    }
    tiles_path() {
      let e, r;
      try {
        const n = i.editor_tiles_path(this.__wbg_ptr);
        return e = n[0], r = n[1], Te(n[0], n[1]);
      } finally {
        i.__wbindgen_free(e, r, 1);
      }
    }
    crosshair_x() {
      return i.editor_crosshair_x(this.__wbg_ptr);
    }
    crosshair_y() {
      return i.editor_crosshair_y(this.__wbg_ptr);
    }
    cursor_down(e) {
      i.editor_cursor_down(this.__wbg_ptr, e);
    }
    press_comma() {
      i.editor_press_comma(this.__wbg_ptr);
    }
    press_enter() {
      i.editor_press_enter(this.__wbg_ptr);
    }
    press_num_0() {
      i.editor_press_num_0(this.__wbg_ptr);
    }
    press_num_1() {
      i.editor_press_num_1(this.__wbg_ptr);
    }
    press_num_2() {
      i.editor_press_num_1(this.__wbg_ptr);
    }
    press_num_3() {
      i.editor_press_num_3(this.__wbg_ptr);
    }
    press_num_4() {
      i.editor_press_num_4(this.__wbg_ptr);
    }
    press_num_5() {
      i.editor_press_num_1(this.__wbg_ptr);
    }
    press_num_7() {
      i.editor_press_num_7(this.__wbg_ptr);
    }
    press_right(e) {
      i.editor_press_right(this.__wbg_ptr, e);
    }
    press_shift() {
      i.editor_press_shift(this.__wbg_ptr);
    }
    press_slash() {
      i.editor_press_slash(this.__wbg_ptr);
    }
    press_space() {
      i.editor_press_space(this.__wbg_ptr);
    }
    double_click(e) {
      i.editor_double_click(this.__wbg_ptr, e);
    }
    load_attract(e, r, n) {
      const o = Xe(e, i.__wbindgen_malloc), l = ke, _ = i.editor_load_attract(this.__wbg_ptr, o, l, r, n);
      if (_[2]) throw Qe(_[1]);
      return je.__wrap(_[0]);
    }
    past_ninja_x(e) {
      return i.editor_past_ninja_x(this.__wbg_ptr, e);
    }
    past_ninja_y(e) {
      return i.editor_past_ninja_y(this.__wbg_ptr, e);
    }
    press_equals() {
      i.editor_press_equals(this.__wbg_ptr);
    }
    press_escape() {
      return i.editor_press_escape(this.__wbg_ptr) !== 0;
    }
    release_shift() {
      i.editor_release_shift(this.__wbg_ptr);
    }
    release_space() {
      i.editor_release_space(this.__wbg_ptr);
    }
    set_anim_data(e) {
      const r = Xe(e, i.__wbindgen_malloc), n = ke;
      i.editor_set_anim_data(this.__wbg_ptr, r, n);
    }
    get_anim_state() {
      return i.editor_get_anim_state(this.__wbg_ptr) >>> 0;
    }
    get_level_name() {
      let e, r;
      try {
        const n = i.editor_get_level_name(this.__wbg_ptr);
        return e = n[0], r = n[1], Te(n[0], n[1]);
      } finally {
        i.__wbindgen_free(e, r, 1);
      }
    }
    get_show_trail() {
      return i.editor_get_show_trail(this.__wbg_ptr) !== 0;
    }
    press_alt_left(e) {
      i.editor_press_alt_left(this.__wbg_ptr, e);
    }
    press_backtick() {
      i.editor_press_backtick(this.__wbg_ptr);
    }
    set_cursor_pos(e, r, n) {
      return i.editor_set_cursor_pos(this.__wbg_ptr, e, r, n) !== 0;
    }
    set_level_name(e) {
      const r = wn(e, i.__wbindgen_malloc, i.__wbindgen_realloc), n = ke;
      i.editor_set_level_name(this.__wbg_ptr, r, n);
    }
    set_show_trail(e) {
      i.editor_set_show_trail(this.__wbg_ptr, e);
    }
    show_half_grid() {
      return i.editor_show_half_grid(this.__wbg_ptr) !== 0;
    }
    fill_with_mines() {
      i.editor_fill_with_mines(this.__wbg_ptr);
    }
    past_ninjas_len() {
      return i.editor_past_ninjas_len(this.__wbg_ptr) >>> 0;
    }
    palette_center_x() {
      return i.editor_palette_center_x(this.__wbg_ptr);
    }
    palette_center_y() {
      return i.editor_palette_center_y(this.__wbg_ptr);
    }
    past_ninja_bones() {
      const e = i.editor_past_ninja_bones(this.__wbg_ptr);
      var r = He(e[0], e[1]).slice();
      return i.__wbindgen_free(e[0], e[1] * 8, 8), r;
    }
    preview_entities() {
      const e = i.editor_preview_entities(this.__wbg_ptr);
      var r = Et(e[0], e[1]).slice();
      return i.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    release_alt_left() {
      i.editor_release_alt_left(this.__wbg_ptr);
    }
    load_outte_replay(e, r, n) {
      const o = Xe(e, i.__wbindgen_malloc), l = ke, _ = i.editor_load_outte_replay(this.__wbg_ptr, o, l, r, n);
      if (_[2]) throw Qe(_[1]);
      return je.__wrap(_[0]);
    }
    show_quarter_grid() {
      return i.editor_show_quarter_grid(this.__wbg_ptr) !== 0;
    }
    press_bracket_left() {
      i.editor_press_bracket_left(this.__wbg_ptr);
    }
    tile_crosshair_col() {
      return i.editor_tile_crosshair_col(this.__wbg_ptr);
    }
    tile_crosshair_row() {
      return i.editor_tile_crosshair_row(this.__wbg_ptr);
    }
    palette_selection_x() {
      return i.editor_palette_selection_x(this.__wbg_ptr);
    }
    palette_selection_y() {
      return i.editor_palette_selection_y(this.__wbg_ptr);
    }
    press_bracket_right() {
      i.editor_press_bracket_right(this.__wbg_ptr);
    }
    receive_past_ninjas() {
      i.editor_receive_past_ninjas(this.__wbg_ptr);
    }
    selected_tiles_path() {
      let e, r;
      try {
        const n = i.editor_selected_tiles_path(this.__wbg_ptr);
        return e = n[0], r = n[1], Te(n[0], n[1]);
      } finally {
        i.__wbindgen_free(e, r, 1);
      }
    }
    set_start_replay_paused(e) {
      i.editor_set_start_replay_paused(this.__wbg_ptr, e);
    }
    selected_tile_outline_path() {
      let e, r;
      try {
        const n = i.editor_selected_tile_outline_path(this.__wbg_ptr);
        return e = n[0], r = n[1], Te(n[0], n[1]);
      } finally {
        i.__wbindgen_free(e, r, 1);
      }
    }
    static new() {
      const e = i.editor_new();
      return Pe.__wrap(e);
    }
    mode() {
      return i.editor_mode(this.__wbg_ptr) >>> 0;
    }
    redo() {
      i.editor_redo(this.__wbg_ptr);
    }
    undo() {
      i.editor_undo(this.__wbg_ptr);
    }
    press_0() {
      i.editor_press_0(this.__wbg_ptr);
    }
    press_1(e) {
      i.editor_press_1(this.__wbg_ptr, e);
    }
    press_2(e) {
      i.editor_press_2(this.__wbg_ptr, e);
    }
    press_3(e) {
      i.editor_press_3(this.__wbg_ptr, e);
    }
    press_4(e) {
      i.editor_press_4(this.__wbg_ptr, e);
    }
    press_5(e) {
      i.editor_press_5(this.__wbg_ptr, e);
    }
    press_6(e) {
      i.editor_press_6(this.__wbg_ptr, e);
    }
    press_7(e) {
      i.editor_press_7(this.__wbg_ptr, e);
    }
    press_8(e) {
      i.editor_press_8(this.__wbg_ptr, e);
    }
    press_9() {
      i.editor_press_9(this.__wbg_ptr);
    }
    press_a(e) {
      i.editor_press_a(this.__wbg_ptr, e);
    }
    press_c() {
      i.editor_press_c(this.__wbg_ptr);
    }
    press_d() {
      i.editor_press_d(this.__wbg_ptr);
    }
    press_e() {
      i.editor_press_e(this.__wbg_ptr);
    }
    press_f() {
      i.editor_press_f(this.__wbg_ptr);
    }
    press_h() {
      i.editor_press_h(this.__wbg_ptr);
    }
    press_i() {
      i.editor_press_i(this.__wbg_ptr);
    }
    press_j() {
      i.editor_press_j(this.__wbg_ptr);
    }
    press_k() {
      i.editor_press_k(this.__wbg_ptr);
    }
    press_l() {
      i.editor_press_l(this.__wbg_ptr);
    }
    press_m() {
      i.editor_press_m(this.__wbg_ptr);
    }
    press_n() {
      i.editor_press_n(this.__wbg_ptr);
    }
    press_o() {
      i.editor_press_o(this.__wbg_ptr);
    }
    press_p() {
      i.editor_press_p(this.__wbg_ptr);
    }
    press_q(e) {
      i.editor_press_q(this.__wbg_ptr, e);
    }
    press_r() {
      i.editor_press_r(this.__wbg_ptr);
    }
    press_s(e) {
      i.editor_press_s(this.__wbg_ptr, e);
    }
    press_t() {
      i.editor_press_t(this.__wbg_ptr);
    }
    press_u() {
      i.editor_press_num_1(this.__wbg_ptr);
    }
    press_w(e) {
      i.editor_press_w(this.__wbg_ptr, e);
    }
    press_x() {
      i.editor_press_x(this.__wbg_ptr);
    }
    press_y() {
      i.editor_press_y(this.__wbg_ptr);
    }
    press_z() {
      i.editor_press_z(this.__wbg_ptr);
    }
    entities() {
      const e = i.editor_entities(this.__wbg_ptr);
      var r = Et(e[0], e[1]).slice();
      return i.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    load_map(e) {
      const r = Xe(e, i.__wbindgen_malloc), n = ke, o = i.editor_load_map(this.__wbg_ptr, r, n);
      if (o[1]) throw Qe(o[0]);
    }
    press_up(e) {
      i.editor_press_up(this.__wbg_ptr, e);
    }
    cursor_up() {
      i.editor_cursor_up(this.__wbg_ptr);
    }
    release_a() {
      i.editor_release_a(this.__wbg_ptr);
    }
    release_c() {
      i.editor_release_c(this.__wbg_ptr);
    }
    release_d() {
      i.editor_release_d(this.__wbg_ptr);
    }
    release_e() {
      i.editor_release_e(this.__wbg_ptr);
    }
    release_q() {
      i.editor_release_q(this.__wbg_ptr);
    }
    release_s() {
      i.editor_release_s(this.__wbg_ptr);
    }
    release_w() {
      i.editor_release_w(this.__wbg_ptr);
    }
    release_z() {
      i.editor_release_z(this.__wbg_ptr);
    }
    to_replay(e, r) {
      const n = i.editor_to_replay(this.__wbg_ptr, e, r);
      if (n[2]) throw Qe(n[1]);
      return je.__wrap(n[0]);
    }
  }
  Symbol.dispose && (Pe.prototype[Symbol.dispose] = Pe.prototype.free);
  const At = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => i.__wbg_exportedentity_free(t >>> 0, 1));
  class qe {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(qe.prototype);
      return r.__wbg_ptr = e, At.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, At.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      i.__wbg_exportedentity_free(e, 0);
    }
    get type_int() {
      return i.__wbg_get_exportedentity_type_int(this.__wbg_ptr) >>> 0;
    }
    set type_int(e) {
      i.__wbg_set_exportedentity_type_int(this.__wbg_ptr, e);
    }
    get x() {
      return i.__wbg_get_exportedentity_x(this.__wbg_ptr);
    }
    set x(e) {
      i.__wbg_set_exportedentity_x(this.__wbg_ptr, e);
    }
    get y() {
      return i.__wbg_get_exportedentity_y(this.__wbg_ptr);
    }
    set y(e) {
      i.__wbg_set_exportedentity_y(this.__wbg_ptr, e);
    }
    get deg() {
      return i.__wbg_get_exportedentity_deg(this.__wbg_ptr);
    }
    set deg(e) {
      i.__wbg_set_exportedentity_deg(this.__wbg_ptr, e);
    }
    get switch_x() {
      return i.__wbg_get_exportedentity_switch_x(this.__wbg_ptr);
    }
    set switch_x(e) {
      i.__wbg_set_exportedentity_switch_x(this.__wbg_ptr, e);
    }
    get switch_y() {
      return i.__wbg_get_exportedentity_switch_y(this.__wbg_ptr);
    }
    set switch_y(e) {
      i.__wbg_set_exportedentity_switch_y(this.__wbg_ptr, e);
    }
    get mode() {
      return i.__wbg_get_exportedentity_mode(this.__wbg_ptr);
    }
    set mode(e) {
      i.__wbg_set_exportedentity_mode(this.__wbg_ptr, e);
    }
    get stack_count() {
      return i.__wbg_get_exportedentity_stack_count(this.__wbg_ptr);
    }
    set stack_count(e) {
      i.__wbg_set_exportedentity_stack_count(this.__wbg_ptr, e);
    }
  }
  Symbol.dispose && (qe.prototype[Symbol.dispose] = qe.prototype.free);
  const Nt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => i.__wbg_replay_free(t >>> 0, 1));
  class je {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(je.prototype);
      return r.__wbg_ptr = e, Nt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Nt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      i.__wbg_replay_free(e, 0);
    }
    inputs_len() {
      return i.replay_inputs_len(this.__wbg_ptr) >>> 0;
    }
    mine_state(e) {
      return i.replay_mine_state(this.__wbg_ptr, e);
    }
    thwump_deg(e) {
      return i.replay_thwump_deg(this.__wbg_ptr, e);
    }
    tiles_path() {
      let e, r;
      try {
        const n = i.replay_tiles_path(this.__wbg_ptr);
        return e = n[0], r = n[1], Te(n[0], n[1]);
      } finally {
        i.__wbindgen_free(e, r, 1);
      }
    }
    boost_pad_x(e) {
      return i.replay_boost_pad_x(this.__wbg_ptr, e);
    }
    boost_pad_y(e) {
      return i.replay_boost_pad_y(this.__wbg_ptr, e);
    }
    deathball_x(e, r) {
      return i.replay_deathball_x(this.__wbg_ptr, e, r);
    }
    deathball_y(e, r) {
      return i.replay_deathball_y(this.__wbg_ptr, e, r);
    }
    exit_door_x(e) {
      return i.replay_exit_door_x(this.__wbg_ptr, e);
    }
    exit_door_y(e) {
      return i.replay_exit_door_y(this.__wbg_ptr, e);
    }
    ninja_bones(e) {
      const r = i.replay_ninja_bones(this.__wbg_ptr, e);
      var n = He(r[0], r[1]).slice();
      return i.__wbindgen_free(r[0], r[1] * 8, 8), n;
    }
    one_way_deg(e) {
      return i.replay_one_way_deg(this.__wbg_ptr, e);
    }
    place_ninja(e, r) {
      i.replay_place_ninja(this.__wbg_ptr, e, r);
    }
    thwumps_len() {
      return i.replay_thwumps_len(this.__wbg_ptr) >>> 0;
    }
    trap_door_x(e) {
      return i.replay_trap_door_x(this.__wbg_ptr, e);
    }
    trap_door_y(e) {
      return i.replay_trap_door_y(this.__wbg_ptr, e);
    }
    zap_drone_x(e, r) {
      return i.replay_zap_drone_x(this.__wbg_ptr, e, r);
    }
    zap_drone_y(e, r) {
      return i.replay_zap_drone_y(this.__wbg_ptr, e, r);
    }
    evil_ninja_x(e, r) {
      return i.replay_evil_ninja_x(this.__wbg_ptr, e, r);
    }
    evil_ninja_y(e, r) {
      return i.replay_evil_ninja_y(this.__wbg_ptr, e, r);
    }
    launch_pad_x(e) {
      return i.replay_launch_pad_x(this.__wbg_ptr, e);
    }
    launch_pad_y(e) {
      return i.replay_launch_pad_y(this.__wbg_ptr, e);
    }
    one_ways_len() {
      return i.replay_one_ways_len(this.__wbg_ptr) >>> 0;
    }
    past_ninja_x(e) {
      return i.replay_past_ninja_x(this.__wbg_ptr, e);
    }
    past_ninja_y(e) {
      return i.replay_past_ninja_y(this.__wbg_ptr, e);
    }
    seek_preview(e) {
      i.replay_seek_preview(this.__wbg_ptr, e);
    }
    boost_pad_deg(e, r) {
      return i.replay_boost_pad_deg(this.__wbg_ptr, e, r);
    }
    chase_drone_x(e, r) {
      return i.replay_chase_drone_x(this.__wbg_ptr, e, r);
    }
    chase_drone_y(e, r) {
      return i.replay_chase_drone_y(this.__wbg_ptr, e, r);
    }
    exit_switch_x(e) {
      return i.replay_exit_switch_x(this.__wbg_ptr, e);
    }
    exit_switch_y(e) {
      return i.replay_exit_switch_y(this.__wbg_ptr, e);
    }
    floor_guard_x(e, r) {
      return i.replay_floor_guard_x(this.__wbg_ptr, e, r);
    }
    floor_guard_y(e, r) {
      return i.replay_floor_guard_y(this.__wbg_ptr, e, r);
    }
    laser_drone_x(e, r) {
      return i.replay_laser_drone_x(this.__wbg_ptr, e, r);
    }
    laser_drone_y(e, r) {
      return i.replay_laser_drone_y(this.__wbg_ptr, e, r);
    }
    locked_door_x(e) {
      return i.replay_locked_door_x(this.__wbg_ptr, e);
    }
    locked_door_y(e) {
      return i.replay_locked_door_y(this.__wbg_ptr, e);
    }
    replay_length() {
      return i.replay_inputs_len(this.__wbg_ptr) >>> 0;
    }
    trap_door_deg(e) {
      return i.replay_trap_door_deg(this.__wbg_ptr, e);
    }
    trap_switch_x(e) {
      return i.replay_trap_switch_x(this.__wbg_ptr, e);
    }
    trap_switch_y(e) {
      return i.replay_trap_switch_y(this.__wbg_ptr, e);
    }
    zap_drone_deg(e) {
      return i.replay_zap_drone_deg(this.__wbg_ptr, e);
    }
    boost_pads_len() {
      return i.replay_boost_pads_len(this.__wbg_ptr) >>> 0;
    }
    bounce_block_x(e, r) {
      return i.replay_bounce_block_x(this.__wbg_ptr, e, r);
    }
    bounce_block_y(e, r) {
      return i.replay_bounce_block_y(this.__wbg_ptr, e, r);
    }
    deathballs_len() {
      return i.replay_deathballs_len(this.__wbg_ptr) >>> 0;
    }
    evil_ninja_deg(e, r) {
      return i.replay_evil_ninja_deg(this.__wbg_ptr, e, r);
    }
    exit_doors_len() {
      return i.replay_exit_doors_len(this.__wbg_ptr) >>> 0;
    }
    export_attract(e) {
      xn(e, Pe);
      const r = i.replay_export_attract(this.__wbg_ptr, e.__wbg_ptr);
      var n = or(r[0], r[1]).slice();
      return i.__wbindgen_free(r[0], r[1] * 1, 1), n;
    }
    gold_collected(e) {
      return i.replay_gold_collected(this.__wbg_ptr, e) !== 0;
    }
    launch_pad_deg(e) {
      return i.replay_launch_pad_deg(this.__wbg_ptr, e);
    }
    regular_door_x(e) {
      return i.replay_regular_door_x(this.__wbg_ptr, e);
    }
    regular_door_y(e) {
      return i.replay_regular_door_y(this.__wbg_ptr, e);
    }
    shove_thwump_x(e, r) {
      return i.replay_shove_thwump_x(this.__wbg_ptr, e, r);
    }
    shove_thwump_y(e, r) {
      return i.replay_shove_thwump_y(this.__wbg_ptr, e, r);
    }
    trap_doors_len() {
      return i.replay_trap_doors_len(this.__wbg_ptr) >>> 0;
    }
    zap_drones_len() {
      return i.replay_zap_drones_len(this.__wbg_ptr) >>> 0;
    }
    chase_drone_deg(e) {
      return i.replay_chase_drone_deg(this.__wbg_ptr, e);
    }
    evil_ninja_type(e) {
      return i.replay_evil_ninja_type(this.__wbg_ptr, e) >>> 0;
    }
    evil_ninjas_len() {
      return i.replay_evil_ninjas_len(this.__wbg_ptr) >>> 0;
    }
    floor_guard_deg(e) {
      return i.replay_floor_guard_deg(this.__wbg_ptr, e);
    }
    is_from_attract() {
      return i.replay_is_from_attract(this.__wbg_ptr) !== 0;
    }
    laser_drone_deg(e) {
      return i.replay_laser_drone_deg(this.__wbg_ptr, e);
    }
    launch_pads_len() {
      return i.replay_launch_pads_len(this.__wbg_ptr) >>> 0;
    }
    locked_door_deg(e) {
      return i.replay_locked_door_deg(this.__wbg_ptr, e);
    }
    locked_switch_x(e) {
      return i.replay_locked_switch_x(this.__wbg_ptr, e);
    }
    locked_switch_y(e) {
      return i.replay_locked_switch_y(this.__wbg_ptr, e);
    }
    ninja_preview_x(e) {
      return i.replay_ninja_preview_x(this.__wbg_ptr, e);
    }
    ninja_preview_y(e) {
      return i.replay_ninja_preview_y(this.__wbg_ptr, e);
    }
    past_ninjas_len() {
      return i.replay_past_ninjas_len(this.__wbg_ptr) >>> 0;
    }
    bounce_block_deg(e) {
      return i.replay_bounce_block_deg(this.__wbg_ptr, e);
    }
    chaingun_drone_x(e, r) {
      return i.replay_chaingun_drone_x(this.__wbg_ptr, e, r);
    }
    chaingun_drone_y(e, r) {
      return i.replay_chaingun_drone_y(this.__wbg_ptr, e, r);
    }
    chase_drones_len() {
      return i.replay_chase_drones_len(this.__wbg_ptr) >>> 0;
    }
    evil_ninja_bones(e) {
      const r = i.replay_evil_ninja_bones(this.__wbg_ptr, e);
      let n;
      return r[0] !== 0 && (n = He(r[0], r[1]).slice(), i.__wbindgen_free(r[0], r[1] * 8, 8)), n;
    }
    evil_ninja_scale(e) {
      return i.replay_evil_ninja_scale(this.__wbg_ptr, e);
    }
    floor_guards_len() {
      return i.replay_floor_guards_len(this.__wbg_ptr) >>> 0;
    }
    laser_drones_len() {
      return i.replay_laser_drones_len(this.__wbg_ptr) >>> 0;
    }
    locked_doors_len() {
      return i.replay_locked_doors_len(this.__wbg_ptr) >>> 0;
    }
    past_ninja_bones(e) {
      const r = i.replay_past_ninja_bones(this.__wbg_ptr, e);
      var n = He(r[0], r[1]).slice();
      return i.__wbindgen_free(r[0], r[1] * 8, 8), n;
    }
    progress_preview() {
      return i.replay_progress_preview(this.__wbg_ptr) >>> 0;
    }
    regular_door_deg(e) {
      return i.replay_regular_door_deg(this.__wbg_ptr, e);
    }
    send_past_ninjas() {
      i.replay_send_past_ninjas(this.__wbg_ptr);
    }
    shove_thwump_deg(e) {
      return i.replay_shove_thwump_deg(this.__wbg_ptr, e);
    }
    bounce_blocks_len() {
      return i.replay_bounce_blocks_len(this.__wbg_ptr) >>> 0;
    }
    regular_doors_len() {
      return i.replay_regular_doors_len(this.__wbg_ptr) >>> 0;
    }
    shove_thwumps_len() {
      return i.replay_shove_thwumps_len(this.__wbg_ptr) >>> 0;
    }
    chaingun_drone_deg(e) {
      return i.replay_chaingun_drone_deg(this.__wbg_ptr, e);
    }
    exit_anim_progress(e, r) {
      return i.replay_exit_anim_progress(this.__wbg_ptr, e, r);
    }
    shove_thwump_touch(e) {
      return i.replay_shove_thwump_touch(this.__wbg_ptr, e);
    }
    chaingun_drones_len() {
      return i.replay_chaingun_drones_len(this.__wbg_ptr) >>> 0;
    }
    ninja_preview_bones(e) {
      const r = i.replay_ninja_preview_bones(this.__wbg_ptr, e);
      var n = He(r[0], r[1]).slice();
      return i.__wbindgen_free(r[0], r[1] * 8, 8), n;
    }
    boost_pad_anim_progress(e, r) {
      return i.replay_boost_pad_anim_progress(this.__wbg_ptr, e, r);
    }
    trap_door_anim_progress(e, r) {
      return i.replay_trap_door_anim_progress(this.__wbg_ptr, e, r);
    }
    locked_door_anim_progress(e, r) {
      return i.replay_locked_door_anim_progress(this.__wbg_ptr, e, r);
    }
    regular_door_anim_progress(e, r) {
      return i.replay_regular_door_anim_progress(this.__wbg_ptr, e, r);
    }
    seek(e) {
      i.replay_seek(this.__wbg_ptr, e);
    }
    tick() {
      i.replay_tick(this.__wbg_ptr);
    }
    input(e) {
      return i.replay_input(this.__wbg_ptr, e);
    }
    score() {
      return i.replay_score(this.__wbg_ptr) >>> 0;
    }
    gold_x(e) {
      return i.replay_gold_x(this.__wbg_ptr, e);
    }
    gold_y(e) {
      return i.replay_gold_y(this.__wbg_ptr, e);
    }
    mine_x(e) {
      return i.replay_mine_x(this.__wbg_ptr, e);
    }
    mine_y(e) {
      return i.replay_mine_y(this.__wbg_ptr, e);
    }
    ninja_x(e) {
      return i.replay_ninja_x(this.__wbg_ptr, e);
    }
    ninja_y(e) {
      return i.replay_ninja_y(this.__wbg_ptr, e);
    }
    progress() {
      return i.replay_progress(this.__wbg_ptr) >>> 0;
    }
    thwump_x(e, r) {
      return i.replay_thwump_x(this.__wbg_ptr, e, r);
    }
    thwump_y(e, r) {
      return i.replay_thwump_y(this.__wbg_ptr, e, r);
    }
    golds_len() {
      return i.replay_golds_len(this.__wbg_ptr) >>> 0;
    }
    mines_len() {
      return i.replay_mines_len(this.__wbg_ptr) >>> 0;
    }
    one_way_x(e) {
      return i.replay_one_way_x(this.__wbg_ptr, e);
    }
    one_way_y(e) {
      return i.replay_one_way_y(this.__wbg_ptr, e);
    }
    set_input(e, r, n, o) {
      i.replay_set_input(this.__wbg_ptr, e, r, n, o);
    }
  }
  Symbol.dispose && (je.prototype[Symbol.dispose] = je.prototype.free);
  function vn(t, e) {
    throw new Error(Te(t, e));
  }
  function $n(t) {
    return qe.__wrap(t);
  }
  function kn(t, e) {
    return Te(t, e);
  }
  function Dn() {
    const t = i.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const a = await hn({
    "./ntools_rs_bg.js": {
      __wbg_exportedentity_new: $n,
      __wbg___wbindgen_throw_b855445ff6a94295: vn,
      __wbindgen_init_externref_table: Dn,
      __wbindgen_cast_2241b6af4c4b2941: kn
    }
  }, pn), Sn = a.memory, Ln = a.__wbg_editor_free, Tn = a.editor_crosshair_x, jn = a.editor_crosshair_y, En = a.editor_cursor_down, Pn = a.editor_cursor_up, An = a.editor_double_click, Nn = a.editor_entities, Cn = a.editor_export_map, Mn = a.editor_fill_with_mines, Bn = a.editor_get_anim_state, In = a.editor_get_level_name, On = a.editor_get_show_trail, Rn = a.editor_load_attract, Kn = a.editor_load_map, Gn = a.editor_load_outte_replay, Hn = a.editor_mode, zn = a.editor_new, Vn = a.editor_palette_center_x, Un = a.editor_palette_center_y, qn = a.editor_palette_selection_x, Fn = a.editor_palette_selection_y, Wn = a.editor_past_ninja_bones, Zn = a.editor_past_ninja_x, Yn = a.editor_past_ninja_y, Jn = a.editor_past_ninjas_len, Xn = a.editor_press_0, Qn = a.editor_press_1, es = a.editor_press_2, ts = a.editor_press_3, rs = a.editor_press_4, ns = a.editor_press_5, ss = a.editor_press_6, os = a.editor_press_7, is = a.editor_press_8, _s = a.editor_press_9, ls = a.editor_press_a, as = a.editor_press_alt_left, cs = a.editor_press_backtick, ds = a.editor_press_bracket_left, us = a.editor_press_bracket_right, ps = a.editor_press_c, hs = a.editor_press_comma, gs = a.editor_press_d, fs = a.editor_press_dash, ys = a.editor_press_down, ws = a.editor_press_e, ms = a.editor_press_enter, bs = a.editor_press_equals, xs = a.editor_press_escape, vs = a.editor_press_f, $s = a.editor_press_h, ks = a.editor_press_i, Ds = a.editor_press_j, Ss = a.editor_press_k, Ls = a.editor_press_l, Ts = a.editor_press_left, js = a.editor_press_m, Es = a.editor_press_n, Ps = a.editor_press_num_0, As = a.editor_press_num_1, Ns = a.editor_press_num_3, Cs = a.editor_press_num_4, Ms = a.editor_press_num_7, Bs = a.editor_press_o, Is = a.editor_press_p, Os = a.editor_press_q, Rs = a.editor_press_r, Ks = a.editor_press_right, Gs = a.editor_press_s, Hs = a.editor_press_shift, zs = a.editor_press_slash, Vs = a.editor_press_space, Us = a.editor_press_t, qs = a.editor_press_up, Fs = a.editor_press_w, Ws = a.editor_press_x, Zs = a.editor_press_y, Ys = a.editor_press_z, Js = a.editor_preview_entities, Xs = a.editor_receive_past_ninjas, Qs = a.editor_redo, eo = a.editor_release_a, to = a.editor_release_alt_left, ro = a.editor_release_c, no = a.editor_release_d, so = a.editor_release_e, oo = a.editor_release_q, io = a.editor_release_s, _o = a.editor_release_shift, lo = a.editor_release_space, ao = a.editor_release_w, co = a.editor_release_z, uo = a.editor_selected_tile_outline_path, po = a.editor_selected_tiles_path, ho = a.editor_set_anim_data, go = a.editor_set_cursor_pos, fo = a.editor_set_level_name, yo = a.editor_set_show_trail, wo = a.editor_set_start_replay_paused, mo = a.editor_show_half_grid, bo = a.editor_show_quarter_grid, xo = a.editor_tile_crosshair_col, vo = a.editor_tile_crosshair_row, $o = a.editor_tiles_path, ko = a.editor_to_replay, Do = a.editor_undo, So = a.__wbg_replay_free, Lo = a.replay_boost_pad_anim_progress, To = a.replay_boost_pad_deg, jo = a.replay_boost_pad_x, Eo = a.replay_boost_pad_y, Po = a.replay_boost_pads_len, Ao = a.replay_bounce_block_deg, No = a.replay_bounce_block_x, Co = a.replay_bounce_block_y, Mo = a.replay_bounce_blocks_len, Bo = a.replay_chaingun_drone_deg, Io = a.replay_chaingun_drone_x, Oo = a.replay_chaingun_drone_y, Ro = a.replay_chaingun_drones_len, Ko = a.replay_chase_drone_deg, Go = a.replay_chase_drone_x, Ho = a.replay_chase_drone_y, zo = a.replay_chase_drones_len, Vo = a.replay_deathball_x, Uo = a.replay_deathball_y, qo = a.replay_deathballs_len, Fo = a.replay_evil_ninja_bones, Wo = a.replay_evil_ninja_deg, Zo = a.replay_evil_ninja_scale, Yo = a.replay_evil_ninja_type, Jo = a.replay_evil_ninja_x, Xo = a.replay_evil_ninja_y, Qo = a.replay_evil_ninjas_len, ei = a.replay_exit_anim_progress, ti = a.replay_exit_door_x, ri = a.replay_exit_door_y, ni = a.replay_exit_doors_len, si = a.replay_exit_switch_x, oi = a.replay_exit_switch_y, ii = a.replay_export_attract, _i = a.replay_floor_guard_deg, li = a.replay_floor_guard_x, ai = a.replay_floor_guard_y, ci = a.replay_floor_guards_len, di = a.replay_gold_collected, ui = a.replay_gold_x, pi = a.replay_gold_y, hi = a.replay_golds_len, gi = a.replay_input, fi = a.replay_inputs_len, yi = a.replay_is_from_attract, wi = a.replay_laser_drone_deg, mi = a.replay_laser_drone_x, bi = a.replay_laser_drone_y, xi = a.replay_laser_drones_len, vi = a.replay_launch_pad_deg, $i = a.replay_launch_pad_x, ki = a.replay_launch_pad_y, Di = a.replay_launch_pads_len, Si = a.replay_locked_door_anim_progress, Li = a.replay_locked_door_deg, Ti = a.replay_locked_door_x, ji = a.replay_locked_door_y, Ei = a.replay_locked_doors_len, Pi = a.replay_locked_switch_x, Ai = a.replay_locked_switch_y, Ni = a.replay_mine_state, Ci = a.replay_mine_x, Mi = a.replay_mine_y, Bi = a.replay_mines_len, Ii = a.replay_ninja_bones, Oi = a.replay_ninja_preview_bones, Ri = a.replay_ninja_preview_x, Ki = a.replay_ninja_preview_y, Gi = a.replay_ninja_x, Hi = a.replay_ninja_y, zi = a.replay_one_way_deg, Vi = a.replay_one_way_x, Ui = a.replay_one_way_y, qi = a.replay_one_ways_len, Fi = a.replay_past_ninja_bones, Wi = a.replay_past_ninja_x, Zi = a.replay_past_ninja_y, Yi = a.replay_past_ninjas_len, Ji = a.replay_place_ninja, Xi = a.replay_progress, Qi = a.replay_progress_preview, e_ = a.replay_regular_door_anim_progress, t_ = a.replay_regular_door_deg, r_ = a.replay_regular_door_x, n_ = a.replay_regular_door_y, s_ = a.replay_regular_doors_len, o_ = a.replay_score, i_ = a.replay_seek, __ = a.replay_seek_preview, l_ = a.replay_send_past_ninjas, a_ = a.replay_set_input, c_ = a.replay_shove_thwump_deg, d_ = a.replay_shove_thwump_touch, u_ = a.replay_shove_thwump_x, p_ = a.replay_shove_thwump_y, h_ = a.replay_shove_thwumps_len, g_ = a.replay_thwump_deg, f_ = a.replay_thwump_x, y_ = a.replay_thwump_y, w_ = a.replay_thwumps_len, m_ = a.replay_tick, b_ = a.replay_tiles_path, x_ = a.replay_trap_door_anim_progress, v_ = a.replay_trap_door_deg, $_ = a.replay_trap_door_x, k_ = a.replay_trap_door_y, D_ = a.replay_trap_doors_len, S_ = a.replay_trap_switch_x, L_ = a.replay_trap_switch_y, T_ = a.replay_zap_drone_deg, j_ = a.replay_zap_drone_x, E_ = a.replay_zap_drone_y, P_ = a.replay_zap_drones_len, A_ = a.__wbg_exportedentity_free, N_ = a.__wbg_get_exportedentity_deg, C_ = a.__wbg_get_exportedentity_mode, M_ = a.__wbg_get_exportedentity_stack_count, B_ = a.__wbg_get_exportedentity_switch_x, I_ = a.__wbg_get_exportedentity_switch_y, O_ = a.__wbg_get_exportedentity_type_int, R_ = a.__wbg_get_exportedentity_x, K_ = a.__wbg_get_exportedentity_y, G_ = a.__wbg_set_exportedentity_deg, H_ = a.__wbg_set_exportedentity_mode, z_ = a.__wbg_set_exportedentity_stack_count, V_ = a.__wbg_set_exportedentity_switch_x, U_ = a.__wbg_set_exportedentity_switch_y, q_ = a.__wbg_set_exportedentity_type_int, F_ = a.__wbg_set_exportedentity_x, W_ = a.__wbg_set_exportedentity_y, Z_ = a.editor_press_num_2, Y_ = a.editor_press_num_5, J_ = a.editor_press_u, X_ = a.replay_replay_length, Q_ = a.__wbindgen_externrefs, el = a.__wbindgen_free, tl = a.__wbindgen_malloc, rl = a.__externref_table_dealloc, nl = a.__wbindgen_realloc, sl = a.__externref_drop_slice, ir = a.__wbindgen_start, ol = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: sl,
    __externref_table_dealloc: rl,
    __wbg_editor_free: Ln,
    __wbg_exportedentity_free: A_,
    __wbg_get_exportedentity_deg: N_,
    __wbg_get_exportedentity_mode: C_,
    __wbg_get_exportedentity_stack_count: M_,
    __wbg_get_exportedentity_switch_x: B_,
    __wbg_get_exportedentity_switch_y: I_,
    __wbg_get_exportedentity_type_int: O_,
    __wbg_get_exportedentity_x: R_,
    __wbg_get_exportedentity_y: K_,
    __wbg_replay_free: So,
    __wbg_set_exportedentity_deg: G_,
    __wbg_set_exportedentity_mode: H_,
    __wbg_set_exportedentity_stack_count: z_,
    __wbg_set_exportedentity_switch_x: V_,
    __wbg_set_exportedentity_switch_y: U_,
    __wbg_set_exportedentity_type_int: q_,
    __wbg_set_exportedentity_x: F_,
    __wbg_set_exportedentity_y: W_,
    __wbindgen_externrefs: Q_,
    __wbindgen_free: el,
    __wbindgen_malloc: tl,
    __wbindgen_realloc: nl,
    __wbindgen_start: ir,
    editor_crosshair_x: Tn,
    editor_crosshair_y: jn,
    editor_cursor_down: En,
    editor_cursor_up: Pn,
    editor_double_click: An,
    editor_entities: Nn,
    editor_export_map: Cn,
    editor_fill_with_mines: Mn,
    editor_get_anim_state: Bn,
    editor_get_level_name: In,
    editor_get_show_trail: On,
    editor_load_attract: Rn,
    editor_load_map: Kn,
    editor_load_outte_replay: Gn,
    editor_mode: Hn,
    editor_new: zn,
    editor_palette_center_x: Vn,
    editor_palette_center_y: Un,
    editor_palette_selection_x: qn,
    editor_palette_selection_y: Fn,
    editor_past_ninja_bones: Wn,
    editor_past_ninja_x: Zn,
    editor_past_ninja_y: Yn,
    editor_past_ninjas_len: Jn,
    editor_press_0: Xn,
    editor_press_1: Qn,
    editor_press_2: es,
    editor_press_3: ts,
    editor_press_4: rs,
    editor_press_5: ns,
    editor_press_6: ss,
    editor_press_7: os,
    editor_press_8: is,
    editor_press_9: _s,
    editor_press_a: ls,
    editor_press_alt_left: as,
    editor_press_backtick: cs,
    editor_press_bracket_left: ds,
    editor_press_bracket_right: us,
    editor_press_c: ps,
    editor_press_comma: hs,
    editor_press_d: gs,
    editor_press_dash: fs,
    editor_press_down: ys,
    editor_press_e: ws,
    editor_press_enter: ms,
    editor_press_equals: bs,
    editor_press_escape: xs,
    editor_press_f: vs,
    editor_press_h: $s,
    editor_press_i: ks,
    editor_press_j: Ds,
    editor_press_k: Ss,
    editor_press_l: Ls,
    editor_press_left: Ts,
    editor_press_m: js,
    editor_press_n: Es,
    editor_press_num_0: Ps,
    editor_press_num_1: As,
    editor_press_num_2: Z_,
    editor_press_num_3: Ns,
    editor_press_num_4: Cs,
    editor_press_num_5: Y_,
    editor_press_num_7: Ms,
    editor_press_o: Bs,
    editor_press_p: Is,
    editor_press_q: Os,
    editor_press_r: Rs,
    editor_press_right: Ks,
    editor_press_s: Gs,
    editor_press_shift: Hs,
    editor_press_slash: zs,
    editor_press_space: Vs,
    editor_press_t: Us,
    editor_press_u: J_,
    editor_press_up: qs,
    editor_press_w: Fs,
    editor_press_x: Ws,
    editor_press_y: Zs,
    editor_press_z: Ys,
    editor_preview_entities: Js,
    editor_receive_past_ninjas: Xs,
    editor_redo: Qs,
    editor_release_a: eo,
    editor_release_alt_left: to,
    editor_release_c: ro,
    editor_release_d: no,
    editor_release_e: so,
    editor_release_q: oo,
    editor_release_s: io,
    editor_release_shift: _o,
    editor_release_space: lo,
    editor_release_w: ao,
    editor_release_z: co,
    editor_selected_tile_outline_path: uo,
    editor_selected_tiles_path: po,
    editor_set_anim_data: ho,
    editor_set_cursor_pos: go,
    editor_set_level_name: fo,
    editor_set_show_trail: yo,
    editor_set_start_replay_paused: wo,
    editor_show_half_grid: mo,
    editor_show_quarter_grid: bo,
    editor_tile_crosshair_col: xo,
    editor_tile_crosshair_row: vo,
    editor_tiles_path: $o,
    editor_to_replay: ko,
    editor_undo: Do,
    memory: Sn,
    replay_boost_pad_anim_progress: Lo,
    replay_boost_pad_deg: To,
    replay_boost_pad_x: jo,
    replay_boost_pad_y: Eo,
    replay_boost_pads_len: Po,
    replay_bounce_block_deg: Ao,
    replay_bounce_block_x: No,
    replay_bounce_block_y: Co,
    replay_bounce_blocks_len: Mo,
    replay_chaingun_drone_deg: Bo,
    replay_chaingun_drone_x: Io,
    replay_chaingun_drone_y: Oo,
    replay_chaingun_drones_len: Ro,
    replay_chase_drone_deg: Ko,
    replay_chase_drone_x: Go,
    replay_chase_drone_y: Ho,
    replay_chase_drones_len: zo,
    replay_deathball_x: Vo,
    replay_deathball_y: Uo,
    replay_deathballs_len: qo,
    replay_evil_ninja_bones: Fo,
    replay_evil_ninja_deg: Wo,
    replay_evil_ninja_scale: Zo,
    replay_evil_ninja_type: Yo,
    replay_evil_ninja_x: Jo,
    replay_evil_ninja_y: Xo,
    replay_evil_ninjas_len: Qo,
    replay_exit_anim_progress: ei,
    replay_exit_door_x: ti,
    replay_exit_door_y: ri,
    replay_exit_doors_len: ni,
    replay_exit_switch_x: si,
    replay_exit_switch_y: oi,
    replay_export_attract: ii,
    replay_floor_guard_deg: _i,
    replay_floor_guard_x: li,
    replay_floor_guard_y: ai,
    replay_floor_guards_len: ci,
    replay_gold_collected: di,
    replay_gold_x: ui,
    replay_gold_y: pi,
    replay_golds_len: hi,
    replay_input: gi,
    replay_inputs_len: fi,
    replay_is_from_attract: yi,
    replay_laser_drone_deg: wi,
    replay_laser_drone_x: mi,
    replay_laser_drone_y: bi,
    replay_laser_drones_len: xi,
    replay_launch_pad_deg: vi,
    replay_launch_pad_x: $i,
    replay_launch_pad_y: ki,
    replay_launch_pads_len: Di,
    replay_locked_door_anim_progress: Si,
    replay_locked_door_deg: Li,
    replay_locked_door_x: Ti,
    replay_locked_door_y: ji,
    replay_locked_doors_len: Ei,
    replay_locked_switch_x: Pi,
    replay_locked_switch_y: Ai,
    replay_mine_state: Ni,
    replay_mine_x: Ci,
    replay_mine_y: Mi,
    replay_mines_len: Bi,
    replay_ninja_bones: Ii,
    replay_ninja_preview_bones: Oi,
    replay_ninja_preview_x: Ri,
    replay_ninja_preview_y: Ki,
    replay_ninja_x: Gi,
    replay_ninja_y: Hi,
    replay_one_way_deg: zi,
    replay_one_way_x: Vi,
    replay_one_way_y: Ui,
    replay_one_ways_len: qi,
    replay_past_ninja_bones: Fi,
    replay_past_ninja_x: Wi,
    replay_past_ninja_y: Zi,
    replay_past_ninjas_len: Yi,
    replay_place_ninja: Ji,
    replay_progress: Xi,
    replay_progress_preview: Qi,
    replay_regular_door_anim_progress: e_,
    replay_regular_door_deg: t_,
    replay_regular_door_x: r_,
    replay_regular_door_y: n_,
    replay_regular_doors_len: s_,
    replay_replay_length: X_,
    replay_score: o_,
    replay_seek: i_,
    replay_seek_preview: __,
    replay_send_past_ninjas: l_,
    replay_set_input: a_,
    replay_shove_thwump_deg: c_,
    replay_shove_thwump_touch: d_,
    replay_shove_thwump_x: u_,
    replay_shove_thwump_y: p_,
    replay_shove_thwumps_len: h_,
    replay_thwump_deg: g_,
    replay_thwump_x: f_,
    replay_thwump_y: y_,
    replay_thwumps_len: w_,
    replay_tick: m_,
    replay_tiles_path: b_,
    replay_trap_door_anim_progress: x_,
    replay_trap_door_deg: v_,
    replay_trap_door_x: $_,
    replay_trap_door_y: k_,
    replay_trap_doors_len: D_,
    replay_trap_switch_x: S_,
    replay_trap_switch_y: L_,
    replay_zap_drone_deg: T_,
    replay_zap_drone_x: j_,
    replay_zap_drone_y: E_,
    replay_zap_drones_len: P_
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  gn(ol);
  ir();
  function il({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var _l = m("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const ll = [
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
  function Ke(t) {
    function e() {
      const r = t.bones();
      return r ? ll.map(([n, o]) => `M ${20 * r[n]} ${20 * r[n + 13]} ${20 * r[o]} ${20 * r[o + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = _l();
      return k((n) => {
        var o = t.class, l = il(t.ninja()), _ = e();
        return o !== n.e && h(r, "class", n.e = o), l !== n.t && h(r, "transform", n.t = l), _ !== n.a && h(r, "d", n.a = _), n;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var al = m("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), cl = m("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function dl(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function ul(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function pl([t, e], r, n) {
    const o = t(), l = r.exit_doors_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.exit_door_x(s),
        y: r.exit_door_y(s),
        animProgress: r.exit_anim_progress(s, n)
      };
      c && dl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function _r(t) {
    return d(V, {
      get each() {
        return t.exitDoors();
      },
      children: (e) => d(hl, {
        exitDoor: e
      })
    });
  }
  const te = 11, q = 2.5;
  function hl(t) {
    return (() => {
      var e = al(), r = e.firstChild, n = r.nextSibling, o = n.nextSibling, l = o.nextSibling, _ = l.nextSibling;
      return k((s) => {
        var c = ul(t.exitDoor), p = -13 + 4 * (1 - t.exitDoor().animProgress), $ = 26 - 8 * (1 - t.exitDoor().animProgress), y = `M ${-13 * t.exitDoor().animProgress} 0 v ${-te} h ${-te + q} l ${-q} ${q} v ${2 * (te - q)} l ${q} ${q} h ${te - q} z`, C = `M ${13 * t.exitDoor().animProgress} 0 v ${-te} h ${te - q} l ${q} ${q} v ${2 * (te - q)} l ${-q} ${q} h ${-te + q} z`, N = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * te} v ${t.exitDoor().animProgress * te} h ${-te + q + t.exitDoor().animProgress} l ${-q} ${-q} v ${(1 - t.exitDoor().animProgress) * (-te + q)}`, K = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * te} v ${t.exitDoor().animProgress * te} h ${te - q - t.exitDoor().animProgress} l ${q} ${-q} v ${(1 - t.exitDoor().animProgress) * (-te + q)}`;
        return c !== s.e && h(e, "transform", s.e = c), p !== s.t && h(r, "x", s.t = p), $ !== s.a && h(r, "width", s.a = $), y !== s.o && h(n, "d", s.o = y), C !== s.i && h(o, "d", s.i = C), N !== s.n && h(l, "d", s.n = N), K !== s.s && h(_, "d", s.s = K), s;
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
  function gl() {
    return cl();
  }
  var fl = m('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function yl(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function wl(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function ml([t, e], r, n) {
    const o = t(), l = r.exit_doors_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.exit_switch_x(s),
        y: r.exit_switch_y(s),
        animProgress: r.exit_anim_progress(s, n)
      };
      c && yl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function lr(t) {
    return d(V, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => d(bl, {
        exitSwitch: e
      })
    });
  }
  const $e = 2;
  function bl(t) {
    return (() => {
      var e = fl(), r = e.firstChild, n = r.nextSibling, o = n.nextSibling;
      return k((l) => {
        var _ = wl(t.exitSwitch), s = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, p = `M ${-2 * t.exitSwitch().animProgress} ${-$e} h ${-$e} v ${2 * $e} h ${$e}`, $ = `M ${2 * t.exitSwitch().animProgress} ${-$e} h ${$e} v ${2 * $e} h ${-$e}`;
        return _ !== l.e && h(e, "transform", l.e = _), s !== l.t && h(r, "fill", l.t = s), c !== l.a && h(r, "stroke", l.a = c), p !== l.o && h(n, "d", l.o = p), $ !== l.i && h(o, "d", l.i = $), l;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), e;
    })();
  }
  var xl = m("<svg><use href=#one-way></svg>", false, true, false), vl = m("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function $l(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function kl(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Dl([t, e], r) {
    const n = t(), o = r.one_ways_len(), l = [];
    for (let _ = 0; _ < o; _++) {
      const s = n.at(_), c = {
        x: r.one_way_x(_),
        y: r.one_way_y(_),
        deg: r.one_way_deg(_)
      };
      s && $l(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function ar(t) {
    return d(V, {
      get each() {
        return t.oneWays();
      },
      children: (e) => (() => {
        var r = xl();
        return k(() => h(r, "transform", kl(e))), r;
      })()
    });
  }
  function cr() {
    return (() => {
      var t = vl(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var Sl = m("<svg><use></svg>", false, true, false), Ll = m("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), Tl = m("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), jl = m("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const El = 0, Pl = 1;
  function Al(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function Nl(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Cl([t, e], r) {
    const n = t(), o = r.mines_len(), l = [];
    for (let _ = 0; _ < o; _++) {
      const s = n.at(_), c = {
        x: r.mine_x(_),
        y: r.mine_y(_),
        type: r.mine_state(_)
      };
      s && Al(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function dr(t) {
    return d(V, {
      get each() {
        return t.mines();
      },
      children: (e) => (() => {
        var r = Sl();
        return k((n) => {
          var o = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][e().type], l = Nl(e);
          return o !== n.e && h(r, "href", n.e = o), l !== n.t && h(r, "transform", n.t = l), n;
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
        var t = Ll(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, o = n.nextSibling, l = o.nextSibling;
        return l.nextSibling, t;
      })(),
      (() => {
        var t = Tl();
        return t.firstChild, t;
      })(),
      (() => {
        var t = jl();
        return t.firstChild, t;
      })()
    ];
  }
  var Ml = m("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), Bl = m("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), Il = m("<svg><g class=regular-door></svg>", false, true, false);
  function Ol(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Rl(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Kl([t, e], r, n) {
    const o = t(), l = r.regular_doors_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.regular_door_x(s),
        y: r.regular_door_y(s),
        deg: r.regular_door_deg(s),
        animProgress: r.regular_door_anim_progress(s, n)
      };
      c && Ol(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function pr(t) {
    return d(V, {
      get each() {
        return t.regularDoors();
      },
      children: (e) => d(zl, {
        regularDoor: e
      })
    });
  }
  const Gl = 1, Hl = 12 - Gl;
  function zl(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (Hl - 0) * r;
    }
    return (() => {
      var r = Il();
      return f(r, d(R, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var n = Ml();
              return k(() => h(n, "x2", -e())), n;
            })(),
            (() => {
              var n = Bl();
              return k(() => h(n, "x2", e())), n;
            })()
          ];
        }
      })), k(() => h(r, "transform", Rl(t.regularDoor))), r;
    })();
  }
  var Vl = m("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), Ul = m("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), Ct = m("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), ql = m("<svg><g class=locked-door></svg>", false, true, false);
  function Fl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Wl(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Zl([t, e], r, n) {
    const o = t(), l = r.locked_doors_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.locked_door_x(s),
        y: r.locked_door_y(s),
        deg: r.locked_door_deg(s),
        animProgress: r.locked_door_anim_progress(s, n)
      };
      c && Fl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function hr(t) {
    return d(V, {
      get each() {
        return t.lockedDoors();
      },
      children: (e) => d(Xl, {
        lockedDoor: e
      })
    });
  }
  const Yl = 1, Jl = 12 - Yl;
  function Xl(t) {
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
      return o = Math.min(Math.max((o - 0.4) / 0.6, 0), 1), 0 + (Jl - 0) * o;
    }
    return (() => {
      var o = ql();
      return f(o, d(R, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var l = Vl();
              return k(() => h(l, "x2", -n())), l;
            })(),
            (() => {
              var l = Ul();
              return k(() => h(l, "x2", n())), l;
            })()
          ];
        }
      }), null), f(o, d(R, {
        get when() {
          return t.lockedDoor().animProgress < 0.5;
        },
        get children() {
          return [
            (() => {
              var l = Ct();
              return k((_) => {
                var s = e(), c = r();
                return s !== _.e && h(l, "x1", _.e = s), c !== _.t && h(l, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), l;
            })(),
            (() => {
              var l = Ct();
              return k((_) => {
                var s = -e(), c = -r();
                return s !== _.e && h(l, "x1", _.e = s), c !== _.t && h(l, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), l;
            })()
          ];
        }
      }), null), k(() => h(o, "transform", Wl(t.lockedDoor))), o;
    })();
  }
  var Ql = m("<svg><use></svg>", false, true, false), ea = m("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), ta = m("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function ra(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function na(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function sa([t, e], r) {
    const n = t(), o = r.locked_doors_len(), l = [];
    for (let _ = 0; _ < o; _++) {
      const s = n.at(_), c = {
        x: r.locked_switch_x(_),
        y: r.locked_switch_y(_),
        wasTouched: r.locked_door_anim_progress(_, 1) >= 0
      };
      s && ra(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function gr(t) {
    return d(V, {
      get each() {
        return t.lockedSwitches();
      },
      children: (e) => (() => {
        var r = Ql();
        return k((n) => {
          var o = e().wasTouched ? "#locked-switch-touched" : "#locked-switch", l = na(e);
          return o !== n.e && h(r, "href", n.e = o), l !== n.t && h(r, "transform", n.t = l), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function fr() {
    return [
      (() => {
        var t = ea(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = ta(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var oa = m("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), Mt = m("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), ia = m("<svg><g></svg>", false, true, false);
  function _a(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function la(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function aa([t, e], r, n) {
    const o = t(), l = r.trap_doors_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.trap_door_x(s),
        y: r.trap_door_y(s),
        deg: r.trap_door_deg(s),
        animProgress: r.trap_door_anim_progress(s, n)
      };
      c && _a(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function yr(t) {
    return d(V, {
      get each() {
        return t.trapDoors();
      },
      children: (e) => d(ua, {
        trapDoor: e
      })
    });
  }
  const ca = 1, da = 12 - ca;
  function ua(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function n() {
      let o = t.trapDoor().animProgress;
      return 0 + (da - 0) * o;
    }
    return (() => {
      var o = ia();
      return f(o, d(R, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var l = oa();
              return k((_) => {
                var s = -n(), c = n();
                return s !== _.e && h(l, "x1", _.e = s), c !== _.t && h(l, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), l;
            })(),
            (() => {
              var l = Mt();
              return k((_) => {
                var s = e(), c = r();
                return s !== _.e && h(l, "x1", _.e = s), c !== _.t && h(l, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), l;
            })(),
            (() => {
              var l = Mt();
              return k((_) => {
                var s = -e(), c = -r();
                return s !== _.e && h(l, "x1", _.e = s), c !== _.t && h(l, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), l;
            })()
          ];
        }
      })), k(() => h(o, "transform", la(t.trapDoor))), o;
    })();
  }
  var pa = m("<svg><use></svg>", false, true, false), ha = m("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), ga = m("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function fa(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function ya(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function wa([t, e], r) {
    const n = t(), o = r.trap_doors_len(), l = [];
    for (let _ = 0; _ < o; _++) {
      const s = n.at(_), c = {
        x: r.trap_switch_x(_),
        y: r.trap_switch_y(_),
        wasTouched: r.trap_door_anim_progress(_, 1) >= 0
      };
      s && fa(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function wr(t) {
    return d(V, {
      get each() {
        return t.trapSwitches();
      },
      children: (e) => (() => {
        var r = pa();
        return k((n) => {
          var o = e().wasTouched ? "#trap-switch-touched" : "#trap-switch", l = ya(e);
          return o !== n.e && h(r, "href", n.e = o), l !== n.t && h(r, "transform", n.t = l), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function mr() {
    return [
      (() => {
        var t = ha();
        return t.firstChild, t;
      })(),
      (() => {
        var t = ga(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var ma = m("<svg><g><rect fill=var(--launch-pad-long) x=0 y=-7.5 width=1.5 height=15></rect><line stroke=var(--launch-pad-short) stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function ba(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function xa(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function va([t, e], r) {
    const n = t(), o = r.launch_pads_len(), l = [];
    for (let _ = 0; _ < o; _++) {
      const s = n.at(_), c = {
        x: r.launch_pad_x(_),
        y: r.launch_pad_y(_),
        deg: r.launch_pad_deg(_)
      };
      s && ba(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function br(t) {
    return d(V, {
      get each() {
        return t.launchPads();
      },
      children: (e) => d($a, {
        launchPad: e
      })
    });
  }
  function $a(t) {
    return (() => {
      var e = ma(), r = e.firstChild;
      return r.nextSibling, k(() => h(e, "transform", xa(t.launchPad))), e;
    })();
  }
  var ka = m('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function Da(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Sa(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function La([t, e], r, n) {
    const o = t(), l = r.floor_guards_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.floor_guard_x(s, n),
        y: r.floor_guard_y(s, n),
        deg: r.floor_guard_deg(s)
      };
      c && Da(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function xr(t) {
    return d(V, {
      get each() {
        return t.floorGuards();
      },
      children: (e) => d(Ta, {
        floorGuard: e
      })
    });
  }
  function Ta(t) {
    return (() => {
      var e = ka();
      return e.firstChild, k(() => h(e, "transform", Sa(t.floorGuard))), e;
    })();
  }
  var ja = m("<svg><use href=#bounceblock></svg>", false, true, false), Ea = m('<svg><g id=bounceblock><path fill=var(--bounceblock-interior) d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path stroke=var(--bounceblock-border) d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function Pa(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Aa(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Na([t, e], r, n) {
    const o = t(), l = r.bounce_blocks_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.bounce_block_x(s, n),
        y: r.bounce_block_y(s, n),
        deg: r.bounce_block_deg(s)
      };
      c && Pa(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function vr(t) {
    return d(V, {
      get each() {
        return t.bounceBlocks();
      },
      children: (e) => (() => {
        var r = ja();
        return k(() => h(r, "transform", Aa(e))), r;
      })()
    });
  }
  function $r() {
    return (() => {
      var t = Ea(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var Ca = m("<svg><use href=#boostpad></svg>", false, true, false), Ma = m("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function Ba(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Ia(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Oa([t, e], r, n) {
    const o = t(), l = r.boost_pads_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.boost_pad_x(s),
        y: r.boost_pad_y(s),
        deg: r.boost_pad_deg(s, n),
        animProgress: r.boost_pad_anim_progress(s, n)
      };
      c && Ba(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function kr(t) {
    return d(V, {
      get each() {
        return t.boostPads();
      },
      children: (e) => (() => {
        var r = Ca();
        return k((n) => {
          var o = `color-mix(in srgb-linear, var(--boost-pad) ${e().animProgress * 100}%, var(--boost-pad-wooshing))`, l = Ia(e);
          return o !== n.e && h(r, "stroke", n.e = o), l !== n.t && h(r, "transform", n.t = l), n;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function Dr() {
    return (() => {
      var t = Ma(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, o = n.nextSibling;
      return o.nextSibling, t;
    })();
  }
  var Ra = m("<svg><use href=#thwump></svg>", false, true, false), Ka = m('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function Ga(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Ha(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function za([t, e], r, n) {
    const o = t(), l = r.thwumps_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.thwump_x(s, n),
        y: r.thwump_y(s, n),
        deg: r.thwump_deg(s)
      };
      c && Ga(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Sr(t) {
    return d(V, {
      get each() {
        return t.thwumps();
      },
      children: (e) => (() => {
        var r = Ra();
        return k(() => h(r, "transform", Ha(e))), r;
      })()
    });
  }
  function Lr() {
    return (() => {
      var t = Ka(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Va = m("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), Ua = m("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function qa(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function Fa(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Wa([t, e], r, n) {
    const o = t(), l = r.shove_thwumps_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.shove_thwump_x(s, n),
        y: r.shove_thwump_y(s, n),
        deg: r.shove_thwump_deg(s),
        touch: r.shove_thwump_touch(s)
      };
      c && qa(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Tr(t) {
    return d(V, {
      get each() {
        return t.shoveThwumps();
      },
      children: (e) => d(Za, {
        shoveThwump: e
      })
    });
  }
  function Za(t) {
    return (() => {
      var e = Va(), r = e.firstChild;
      return f(e, d(_t, {
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
            var o = Ua(), l = o.firstChild, _ = l.nextSibling;
            return _.nextSibling, h(o, "transform", `rotate(${45 * n},0,0)`), o;
          }
        })
      }), r), k(() => h(e, "transform", Fa(t.shoveThwump))), e;
    })();
  }
  const jr = Er((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function Ya(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (n) => n.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function Ja(t) {
    const e = String.fromCharCode(...t);
    console.log("anim data length", t.byteLength), localStorage.setItem("animData", e);
  }
  function Xa(t) {
    const e = localStorage.getItem("animData");
    if (e) {
      const r = Uint8Array.from(e, (n) => n.charCodeAt(0));
      t.set_anim_data(r);
    }
  }
  const Qa = Er(ec, 1e3);
  function ec(t) {
    const e = JSON.stringify(t);
    localStorage.setItem("palette", e);
  }
  function tc() {
    const t = localStorage.getItem("palette");
    if (t) try {
      const e = JSON.parse(t);
      if (typeof (e == null ? void 0 : e.name) == "string" && typeof (e == null ? void 0 : e.colors) == "object") return e;
    } catch {
      return;
    }
  }
  function Er(t, e) {
    let r;
    return (...n) => {
      typeof r == "number" && clearTimeout(r), r = setTimeout(() => t(...n), e);
    };
  }
  const rc = "" + new URL("palette-CZVUb4uS.png", import.meta.url).href, Pr = [
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
  ], Bt = [
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
  ], It = {
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
  }, nc = {
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
  }, sc = (() => {
    const t = {};
    for (const e of Bt) {
      t[e] = 0;
      for (const r of Bt) It[r] < It[e] && (t[e] += nc[r]);
    }
    return t;
  })(), Ar = [
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
  ], oc = {
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
  let Nr;
  async function ic() {
    const e = await (await fetch(rc)).blob(), r = await createImageBitmap(e), n = document.createElement("canvas");
    n.width = r.width, n.height = r.height;
    const o = n.getContext("2d");
    o.drawImage(r, 0, 0), Nr = o;
  }
  function Cr(t) {
    const e = Nr, r = Pr.indexOf(t);
    if (!e || r < 0) return;
    const n = {};
    for (const o of Ar) {
      const { file: l, index: _ } = oc[o], s = sc[l] + _, c = e.getImageData(s, r, 1, 1).data, p = `rgb(${c[0]} ${c[1]} ${c[2]})`;
      n[o] = p;
    }
    return n;
  }
  function _c(t) {
    for (const e of Ar) document.body.style.setProperty(e, t[e]);
  }
  var lc = m('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label>/<label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>attract<input type=file style=display:none></label>/<label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>replay<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox></label> | Object corners <select><option>square</option><option>rounded</option></select> | <label>Friction mod <input type=checkbox></label> | <select></select><input type=text style=float:right>'), ac = m("<option>");
  function cc(t) {
    return (() => {
      var e = lc(), r = e.firstChild, n = r.firstChild, o = n.nextSibling, l = r.nextSibling, _ = l.nextSibling, s = _.firstChild, c = s.nextSibling, p = _.nextSibling, $ = p.nextSibling, y = $.firstChild, C = y.nextSibling, N = $.nextSibling, K = N.nextSibling, H = K.nextSibling, F = H.nextSibling, U = F.firstChild, E = U.nextSibling, B = F.nextSibling, O = B.nextSibling, G = O.firstChild, Q = G.nextSibling, ne = O.nextSibling, se = ne.nextSibling, le = se.firstChild, oe = le.nextSibling, X = se.nextSibling, D = X.nextSibling, M = D.nextSibling;
      return o.addEventListener("change", function() {
        const S = this.files;
        if (S && S.length > 0) {
          const P = new FileReader();
          P.onloadend = () => {
            P.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(P.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, P.readAsArrayBuffer(S[0]);
        }
      }), c.addEventListener("change", function() {
        const S = this.files;
        if (S && S.length > 0) {
          const P = new FileReader();
          P.onloadend = () => {
            if (P.result instanceof ArrayBuffer) {
              const Z = t.editor.load_attract(new Uint8Array(P.result), t.roundCorners(), t.dynamicFriction());
              t.render(true), t.setLevelName(t.editor.get_level_name()), t.setReplay(Z);
            }
          }, P.readAsArrayBuffer(S[0]);
        }
      }), C.addEventListener("change", function() {
        const S = this.files;
        if (S && S.length > 0) {
          const P = new FileReader();
          P.onloadend = () => {
            if (P.result instanceof ArrayBuffer) {
              const Z = t.editor.load_outte_replay(new Uint8Array(P.result), t.roundCorners(), t.dynamicFriction());
              t.render(true), t.setReplay(Z);
            }
          }, P.readAsArrayBuffer(S[0]);
        }
      }), K.$$click = function() {
        const S = t.editor.export_map(), P = new Blob([
          S.buffer
        ], {
          type: "application/octet-stream"
        }), Z = URL.createObjectURL(P);
        this.href = Z, this.download = t.editor.get_level_name().replaceAll(/[^a-z]/gi, "_"), setTimeout(() => URL.revokeObjectURL(Z), 100);
      }, E.addEventListener("change", (S) => {
        t.setShowTrail(S.currentTarget.checked), t.editor.set_show_trail(S.currentTarget.checked);
      }), O.addEventListener("change", (S) => t.setRoundCorners(S.currentTarget.value == "rounded")), oe.addEventListener("change", (S) => {
        t.setDynamicFriction(S.currentTarget.checked);
      }), D.addEventListener("change", (S) => {
        const P = Cr(S.currentTarget.value);
        P && t.setPalette({
          name: S.currentTarget.value,
          colors: P
        });
      }), f(D, () => Pr.map((S) => (() => {
        var P = ac();
        return f(P, S), k(() => {
          var _a2;
          return P.selected = S === (((_a2 = t.palette()) == null ? void 0 : _a2.name) ?? "vasquez");
        }), P;
      })())), M.addEventListener("change", () => jr(t.editor)), M.$$input = (S) => {
        t.editor.set_level_name(S.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, k((S) => {
        var P = !t.roundCorners(), Z = t.roundCorners();
        return P !== S.e && (G.selected = S.e = P), Z !== S.t && (Q.selected = S.t = Z), S;
      }, {
        e: void 0,
        t: void 0
      }), k(() => E.checked = t.showTrail()), k(() => oe.checked = t.dynamicFriction()), k(() => M.value = t.levelName()), e;
    })();
  }
  ct([
    "click",
    "input"
  ]);
  var dc = m("<svg><use href=#zapdrone></svg>", false, true, false), uc = m('<svg><g id=zapdrone><path fill=var(--zap-drone-background) stroke=var(--zap-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--zap-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--zap-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false), pc = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 1 12 12 a 12 12 0 0 1 -12 12 l 5 -5 m 0 10 l -5 -5"></svg>', false, true, false), hc = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 0 12 -12 a 12 12 0 0 0 -12 -12 l 5 5 m 0 -10 l -5 5"></svg>', false, true, false), gc = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V 24 l -5 -5 m 10 0 l -5 5"></svg>', false, true, false), fc = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V -24 l -5 5 m 10 0 l -5 -5"></svg>', false, true, false), yc = m("<svg><g></svg>", false, true, false);
  function wc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function mc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function bc([t, e], r, n) {
    const o = t(), l = r.zap_drones_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.zap_drone_x(s, n),
        y: r.zap_drone_y(s, n),
        deg: r.zap_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && wc(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Mr(t) {
    return d(V, {
      get each() {
        return t.zapDrones();
      },
      children: (e) => (() => {
        var r = dc();
        return k(() => h(r, "transform", mc(e))), r;
      })()
    });
  }
  function Br() {
    return (() => {
      var t = uc(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  function xc({ entities: t }) {
    const e = () => t.zapDrones().at(0) ?? t.chaseDrones().at(0) ?? t.chaingunDrones().at(0) ?? t.laserDrones().at(0), r = (n) => {
      const o = n();
      if (o) {
        const { x: l, y: _, deg: s } = o;
        return `translate(${l},${_}) rotate(${s},0,0)`;
      } else return "";
    };
    return (() => {
      var n = yc();
      return f(n, d(R, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 0;
        },
        get children() {
          return pc();
        }
      }), null), f(n, d(R, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 1;
        },
        get children() {
          return hc();
        }
      }), null), f(n, d(R, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 2;
        },
        get children() {
          return gc();
        }
      }), null), f(n, d(R, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 3;
        },
        get children() {
          return fc();
        }
      }), null), k(() => h(n, "transform", r(e))), n;
    })();
  }
  var vc = m("<svg><use href=#chaingundrone></svg>", false, true, false), $c = m('<svg><g id=chaingundrone><path fill=var(--chaingun-drone-background) stroke=var(--chaingun-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chaingun-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--chaingun-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function kc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Dc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Sc([t, e], r, n) {
    const o = t(), l = r.chaingun_drones_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.chaingun_drone_x(s, n),
        y: r.chaingun_drone_y(s, n),
        deg: r.chaingun_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && kc(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Ir(t) {
    return d(V, {
      get each() {
        return t.chaingunDrones();
      },
      children: (e) => (() => {
        var r = vc();
        return k(() => h(r, "transform", Dc(e))), r;
      })()
    });
  }
  function Or() {
    return (() => {
      var t = $c(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Lc = m("<svg><use href=#bat></svg>", false, true, false), Tc = m("<svg><circle id=bat r=5 cx=0 cy=0 fill=var(--bat-body)></svg>", false, true, false);
  function jc(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Ec(t) {
    return d(V, {
      get each() {
        return t.bats();
      },
      children: (e) => (() => {
        var r = Lc();
        return k(() => h(r, "transform", jc(e))), r;
      })()
    });
  }
  function Pc() {
    return Tc();
  }
  var Ac = m("<svg><use href=#laserdrone></svg>", false, true, false), Nc = m('<svg><g id=laserdrone><path fill=none stroke=var(--laser-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--laser-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--laser-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function Cc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Mc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Bc([t, e], r, n) {
    const o = t(), l = r.laser_drones_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.laser_drone_x(s, n),
        y: r.laser_drone_y(s, n),
        deg: r.laser_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && Cc(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Rr(t) {
    return d(V, {
      get each() {
        return t.laserDrones();
      },
      children: (e) => (() => {
        var r = Ac();
        return k(() => h(r, "transform", Mc(e))), r;
      })()
    });
  }
  function Kr() {
    return (() => {
      var t = Nc(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Ic = m("<svg><use href=#chasedrone></svg>", false, true, false), Oc = m('<svg><g id=chasedrone><path fill=var(--chase-drone-background) stroke=var(--chase-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chase-drone-border) d="M 10 -3 H 3 A 3 3 0 0 0 0 0 A 3 3 0 0 0 3 3 H 10 Z"></path><path fill=none stroke=var(--chase-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function Rc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Kc(t) {
    const { x: e, y: r, deg: n } = t();
    return `translate(${e},${r}) rotate(${n},0,0)`;
  }
  function Gc([t, e], r, n) {
    const o = t(), l = r.chase_drones_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.chase_drone_x(s, n),
        y: r.chase_drone_y(s, n),
        deg: r.chase_drone_deg(s),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && Rc(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Gr(t) {
    return d(V, {
      get each() {
        return t.chaseDrones();
      },
      children: (e) => (() => {
        var r = Ic();
        return k(() => h(r, "transform", Kc(e))), r;
      })()
    });
  }
  function Hr() {
    return (() => {
      var t = Oc(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Hc = m("<svg><use href=#gold></svg>", false, true, false), zc = m("<svg><g id=gold><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--gold-exterior) r=2.727272727272727></circle><circle fill=var(--gold-interior) r=1.9090909090909092></svg>", false, true, false);
  function Vc(t, e) {
    return t.x === e.x && t.y === e.y && t.collected === e.collected;
  }
  function Uc(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function qc([t, e], r) {
    const n = t(), o = r.golds_len(), l = [];
    for (let _ = 0; _ < o; _++) {
      const s = n.at(_), c = {
        x: r.gold_x(_),
        y: r.gold_y(_),
        collected: r.gold_collected(_)
      };
      s && Vc(s, c) ? l.push(s) : l.push(c);
    }
    e(l);
  }
  function zr(t) {
    return d(V, {
      get each() {
        return t.golds();
      },
      children: (e) => d(R, {
        get when() {
          return !e().collected;
        },
        get children() {
          var r = Hc();
          return k(() => h(r, "transform", Uc(e))), r;
        }
      })
    });
  }
  function Vr() {
    return (() => {
      var t = zc(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, o = n.nextSibling, l = o.nextSibling;
      return l.nextSibling, t;
    })();
  }
  var Fc = m("<svg><use href=#deathball></svg>", false, true, false), Wc = m('<svg><g id=deathball><path d="M -7 0 A 7 7 0 0 0 0 7 A 7 7 0 0 0 7 0 A 7 7 0 0 0 0 -7"stroke=var(--deathball-outer) stroke-width=2 fill=none stroke-linecap=round></path><path d="M 0 -4 A 4 4 0 0 0 -4 0 A 4 4 0 0 0 0 4 A 4 4 0 0 0 4 0"stroke=var(--deathball-middle) stroke-width=3 fill=none stroke-linecap=round></path><circle r=2 cx=0 cy=0 fill=var(--deathball-inner)></svg>', false, true, false);
  function Zc(t, e) {
    return t.x === e.x && t.y === e.y;
  }
  function Yc(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r}) rotate(45)`;
  }
  function Jc([t, e], r, n) {
    const o = t(), l = r.deathballs_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.deathball_x(s, n),
        y: r.deathball_y(s, n)
      };
      c && Zc(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Ur(t) {
    return d(V, {
      get each() {
        return t.deathballs();
      },
      children: (e) => (() => {
        var r = Fc();
        return k(() => h(r, "transform", Yc(e))), r;
      })()
    });
  }
  function qr() {
    return Wc();
  }
  var Xc = m("<svg><use href=#evilninja stroke=var(--evil-ninja)></svg>", false, true, false), Qc = m("<svg><use href=#evilninja stroke=var(--ninja)></svg>", false, true, false), ed = m('<svg><g id=evilninja><path d="M 2 -5 l -2 -2 h -5"transform="rotate(  0,0,0)"fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform="rotate( 45,0,0)"fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform="rotate( 90,0,0)"fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(135,0,0) fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(180,0,0) fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(225,0,0) fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(270,0,0) fill=none stroke-width=1.0909090909090908></path><path d="M 2 -5 l -2 -2 h -5"transform=rotate(315,0,0) fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  const Fr = 0, td = 1, $t = 2;
  function rd(t, e) {
    return t.type === $t || e.type === $t ? false : t.x === e.x && t.y === e.y && t.deg === e.deg && t.type === e.type && t.scale == e.scale;
  }
  function Ot(t) {
    const { x: e, y: r, deg: n, scale: o } = t();
    return `translate(${e},${r}) rotate(${n},0,0) scale(${o})`;
  }
  function nd([t, e], r, n) {
    const o = t(), l = r.evil_ninjas_len(), _ = [];
    for (let s = 0; s < l; s++) {
      const c = o.at(s), p = {
        x: r.evil_ninja_x(s, n),
        y: r.evil_ninja_y(s, n),
        deg: r.evil_ninja_deg(s, n),
        scale: r.evil_ninja_scale(s),
        bones: r.evil_ninja_bones(s),
        type: r.evil_ninja_type(s)
      };
      c && rd(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Wr(t) {
    return d(V, {
      get each() {
        return t.evilNinjas();
      },
      children: (e) => d(sr, {
        get children() {
          return [
            d(ze, {
              get when() {
                return e().type === Fr;
              },
              get children() {
                var r = Xc();
                return k(() => h(r, "transform", Ot(e))), r;
              }
            }),
            d(ze, {
              get when() {
                return e().type === td;
              },
              get children() {
                var r = Qc();
                return k(() => h(r, "transform", Ot(e))), r;
              }
            }),
            d(ze, {
              get when() {
                return e().type === $t;
              },
              get children() {
                return d(Ke, {
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
  function Zr() {
    return (() => {
      var t = ed(), e = t.firstChild, r = e.nextSibling, n = r.nextSibling, o = n.nextSibling, l = o.nextSibling, _ = l.nextSibling, s = _.nextSibling;
      return s.nextSibling, t;
    })();
  }
  var sd = m('<svg><rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"width=150 height=150 style=mix-blend-mode:hard-light></svg>', false, true, false), od = m("<svg><circle fill=none stroke=var(--entity-palette-reticle) r=16></svg>", false, true, false), id = m('<svg><path d="M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12"fill-rule=evenodd fill="color-mix(in srgb,var(--background) 18%,white 15%)"style=mix-blend-mode:hard-light></svg>', false, true, false), _d = m("<svg><rect fill=none stroke=var(--editor-crosshair) stroke-width=2 width=26 height=26></svg>", false, true, false), ld = m("<svg><use href=#tilemode-crosshair></svg>", false, true, false), ad = m("<svg><use href=#crosshair></svg>", false, true, false), cd = m("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), dd = m('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none>'), Rt = m("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), Kt = m("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), ud = m("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), pd = m("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), hd = m("<svg><text></svg>", false, true, false), gd = m("<svg><line class=door-switch-line></svg>", false, true, false);
  const ft = 42, yt = 23, Gt = 0, Ht = 1, fd = 3, yd = 4, wt = 5, zt = 6, Vt = 7, wd = 8, mt = 9, md = 0, bd = 1, xd = 2, vd = 3, $d = 5, kd = 6, Dd = 8, Sd = 10, Ld = 11, Td = 12, jd = 13, Ed = 14, Pd = 15, Ad = 16, Nd = 17, Cd = 20, Md = 22, Bd = 21, Id = 24, Od = 25, Rd = 27, Kd = 28, Gd = new Float64Array([
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
  ]), Hd = new Float64Array([
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
  ]), Ut = 150;
  function zd(t, e) {
    const r = e.map((n) => ({
      x: n.x,
      y: n.y,
      count: n.stack_count
    })).filter(({ count: n }) => n > 1);
    t(r);
  }
  function qt() {
    const [t, e] = w([]), [r, n] = w([]), [o, l] = w([]), [_, s] = w([]), [c, p] = w([]), [$, y] = w([]), [C, N] = w([]), [K, H] = w([]), [F, U] = w([]), [E, B] = w([]), [O, G] = w([]), [Q, ne] = w([]), [se, le] = w([]), [oe, X] = w([]), [D, M] = w([]), [S, P] = w([]), [Z, fe] = w([]), [j, z] = w([]), [ie, ue] = w([]), [ae, ye] = w([]), [pe, Se] = w([]), [u, g] = w([]), [Ae, W] = w([]), [ce, we] = w([]);
    return {
      ninjas: t,
      setNinjas: e,
      mines: r,
      setMines: n,
      golds: o,
      setGolds: l,
      exitDoors: _,
      setExitDoors: s,
      exitSwitches: c,
      setExitSwitches: p,
      regularDoors: $,
      setRegularDoors: y,
      lockedDoors: C,
      setLockedDoors: N,
      lockedSwitches: K,
      setLockedSwitches: H,
      trapDoors: F,
      setTrapDoors: U,
      trapSwitches: E,
      setTrapSwitches: B,
      launchPads: O,
      setLaunchPads: G,
      oneWays: Q,
      setOneWays: ne,
      chaingunDrones: se,
      setChaingunDrones: le,
      laserDrones: oe,
      setLaserDrones: X,
      zapDrones: D,
      setZapDrones: M,
      chaseDrones: S,
      setChaseDrones: P,
      floorGuards: Z,
      setFloorGuards: fe,
      bounceBlocks: j,
      setBounceBlocks: z,
      thwumps: ie,
      setThwumps: ue,
      evilNinjas: ae,
      setEvilNinjas: ye,
      boostPads: pe,
      setBoostPads: Se,
      deathballs: u,
      setDeathballs: g,
      bats: Ae,
      setBats: W,
      shoveThwumps: ce,
      setShoveThwumps: we
    };
  }
  function Ft(t, e, r, n) {
    const o = [], l = [], _ = [], s = [], c = [], p = [], $ = [], y = [], C = [], N = [], K = [], H = [], F = [], U = [], E = [], B = [], O = [], G = [], Q = [], ne = [], se = [], le = [], oe = [], X = [];
    for (const D of r) {
      const M = {
        x: D.x,
        y: D.y,
        deg: D.deg,
        mode: D.mode,
        animProgress: 0
      }, S = {
        x: D.switch_x,
        y: D.switch_y,
        animProgress: 0,
        wasTouched: false
      }, P = {
        x1: D.x,
        y1: D.y,
        x2: D.switch_x,
        y2: D.switch_y
      };
      D.type_int === md ? o.push(M) : D.type_int === bd ? l.push({
        ...M,
        type: El
      }) : D.type_int === Bd ? l.push({
        ...M,
        type: Pl
      }) : D.type_int === xd ? _.push({
        ...M,
        collected: false
      }) : D.type_int === vd ? (s.push(M), Number.isNaN(D.switch_x) || (c.push(S), e.push(P))) : D.type_int === $d ? p.push(M) : D.type_int === kd ? ($.push(M), Number.isNaN(D.switch_x) || (y.push(S), e.push(P))) : D.type_int === Dd ? (C.push({
        ...M,
        animProgress: n ? 1 : -1
      }), Number.isNaN(D.switch_x) || (N.push(S), e.push(P))) : D.type_int === Sd ? K.push(M) : D.type_int === Ld ? H.push(M) : D.type_int === Td ? F.push(M) : D.type_int === jd ? U.push(M) : D.type_int === Ed ? E.push(M) : D.type_int === Pd ? B.push(M) : D.type_int === Ad ? O.push(M) : D.type_int === Nd ? G.push(M) : D.type_int === Cd ? Q.push(M) : D.type_int === Md ? ne.push({
        ...M,
        type: Fr,
        scale: 1
      }) : D.type_int === Id ? se.push({
        ...M,
        animProgress: 1
      }) : D.type_int === Od ? le.push(M) : D.type_int === Rd ? oe.push(M) : D.type_int === Kd && X.push({
        ...M,
        touch: 16
      }), D.free();
    }
    t.setNinjas(o), t.setMines(l), t.setGolds(_), t.setExitDoors(s), t.setExitSwitches(c), t.setRegularDoors(p), t.setLockedDoors($), t.setLockedSwitches(y), t.setTrapDoors(C), t.setTrapSwitches(N), t.setLaunchPads(K), t.setOneWays(H), t.setChaingunDrones(F), t.setLaserDrones(U), t.setZapDrones(E), t.setChaseDrones(B), t.setFloorGuards(O), t.setBounceBlocks(G), t.setThwumps(Q), t.setEvilNinjas(ne), t.setBoostPads(se), t.setDeathballs(le), t.setBats(oe), t.setShoveThwumps(X);
  }
  function Wt({ entities: t }) {
    return [
      d(yr, {
        get trapDoors() {
          return t.trapDoors;
        }
      }),
      d(hr, {
        get lockedDoors() {
          return t.lockedDoors;
        }
      }),
      d(gr, {
        get lockedSwitches() {
          return t.lockedSwitches;
        }
      }),
      d(wr, {
        get trapSwitches() {
          return t.trapSwitches;
        }
      }),
      d(_r, {
        get exitDoors() {
          return t.exitDoors;
        }
      }),
      d(ar, {
        get oneWays() {
          return t.oneWays;
        }
      }),
      d(dr, {
        get mines() {
          return t.mines;
        }
      }),
      d(zr, {
        get golds() {
          return t.golds;
        }
      }),
      d(lr, {
        get exitSwitches() {
          return t.exitSwitches;
        }
      }),
      d(pr, {
        get regularDoors() {
          return t.regularDoors;
        }
      }),
      d(br, {
        get launchPads() {
          return t.launchPads;
        }
      }),
      d(Rr, {
        get laserDrones() {
          return t.laserDrones;
        }
      }),
      d(Ir, {
        get chaingunDrones() {
          return t.chaingunDrones;
        }
      }),
      d(Mr, {
        get zapDrones() {
          return t.zapDrones;
        }
      }),
      d(Gr, {
        get chaseDrones() {
          return t.chaseDrones;
        }
      }),
      d(xr, {
        get floorGuards() {
          return t.floorGuards;
        }
      }),
      d(Ec, {
        get bats() {
          return t.bats;
        }
      }),
      d(Ur, {
        get deathballs() {
          return t.deathballs;
        }
      }),
      d(Sr, {
        get thwumps() {
          return t.thwumps;
        }
      }),
      d(Wr, {
        get evilNinjas() {
          return t.evilNinjas;
        }
      }),
      d(_t, {
        get each() {
          return t.ninjas();
        },
        children: (e) => d(Ke, {
          class: "ninja",
          ninja: () => e,
          bones: () => Gd
        })
      }),
      d(vr, {
        get bounceBlocks() {
          return t.bounceBlocks;
        }
      }),
      d(Tr, {
        get shoveThwumps() {
          return t.shoveThwumps;
        }
      }),
      d(kr, {
        get boostPads() {
          return t.boostPads;
        }
      })
    ];
  }
  function Vd(t) {
    const { editor: e, pastNinjas: r } = t, [n, o] = w(""), [l, _] = w(""), [s, c] = w(true), [p, $] = w(false), [y, C] = w(Gt), [N, K] = w({
      row: 1,
      col: 1
    }), [H, F] = w({
      x: 24,
      y: 24
    }), [U, E] = w(""), [B, O] = w({
      x: NaN,
      y: NaN
    }), [G, Q] = w({
      x: NaN,
      y: NaN
    }), ne = qt(), se = qt(), [le, oe] = w([]), [X, D] = w(e.get_show_trail()), [M, S] = w(), [P, Z] = w([]), fe = (u) => {
      let g = false;
      if (!(u.target instanceof HTMLInputElement || u.target instanceof HTMLSelectElement)) {
        if (u.ctrlKey || u.metaKey) {
          u.code === "KeyZ" && (u.ctrlKey || u.metaKey) && u.shiftKey ? (g = true, e.redo()) : u.code === "KeyZ" && (u.ctrlKey || u.metaKey) ? (g = true, e.undo()) : u.code === "KeyY" && (u.ctrlKey || u.metaKey) && (g = true, e.redo()), g && (z(true), u.preventDefault());
          return;
        }
        u.shiftKey && (g = true, e.press_shift()), u.code === "Enter" && e.mode() === mt ? t.setReplay(e.to_replay(t.roundCorners(), t.dynamicFriction())) : u.code === "Backquote" ? (g = true, e.press_backtick()) : u.code === "Digit1" ? (g = true, e.press_1(u.shiftKey)) : u.code === "Digit2" ? (g = true, e.press_2(u.shiftKey)) : u.code === "Digit3" ? (g = true, e.press_3(u.shiftKey)) : u.code === "Digit4" ? (g = true, e.press_4(u.shiftKey)) : u.code === "Digit5" ? (g = true, e.press_5(u.shiftKey)) : u.code === "Digit6" ? (g = true, e.press_6(u.shiftKey)) : u.code === "Digit7" ? (g = true, e.press_7(u.shiftKey)) : u.code === "Digit8" ? (g = true, e.press_8(u.shiftKey)) : u.code === "Digit9" ? (g = true, e.press_9()) : u.code === "Digit0" ? (g = true, e.press_0()) : u.code === "Minus" ? (g = true, e.press_dash()) : u.code === "Equal" ? (g = true, e.press_equals()) : u.code === "KeyQ" ? (g = true, e.press_q(u.shiftKey)) : u.code === "KeyW" ? (g = true, e.press_w(u.shiftKey)) : u.code === "KeyA" ? (g = true, e.press_a(u.shiftKey)) : u.code === "KeyS" ? (g = true, e.press_s(u.shiftKey)) : u.code === "KeyE" ? (g = true, e.press_e()) : u.code === "KeyD" ? (g = true, e.press_d()) : u.code === "KeyZ" ? (g = true, e.press_z()) : u.code === "KeyX" ? (g = true, e.press_x()) : u.code === "KeyC" ? (g = true, e.press_c()) : u.code === "Space" ? (g = true, e.press_space()) : u.code === "AltLeft" ? (g = true, e.press_alt_left(u.shiftKey)) : u.code === "KeyR" ? (g = true, e.press_r()) : u.code === "KeyT" ? (g = true, e.press_t()) : u.code === "KeyY" ? (g = true, e.press_y()) : u.code === "KeyU" ? (g = true, e.press_u()) : u.code === "KeyI" ? (g = true, e.press_i()) : u.code === "KeyO" ? (g = true, e.press_o()) : u.code === "KeyP" ? (g = true, e.press_p()) : u.code === "BracketLeft" ? (g = true, e.press_bracket_left()) : u.code === "BracketRight" ? (g = true, e.press_bracket_right()) : u.code === "KeyF" ? (g = true, e.press_f()) : u.code === "KeyH" ? (g = true, e.press_h()) : u.code === "KeyJ" ? (g = true, e.press_j()) : u.code === "KeyK" ? (g = true, e.press_k()) : u.code === "KeyL" ? (g = true, e.press_l()) : u.code === "KeyN" ? (g = true, e.press_n()) : u.code === "KeyM" ? (g = true, e.press_m()) : u.code === "Comma" ? (g = true, e.press_comma()) : u.code === "ArrowUp" ? (g = true, e.press_up(u.shiftKey)) : u.code === "ArrowDown" ? (g = true, e.press_down(u.shiftKey)) : u.code === "ArrowLeft" ? (g = true, e.press_left(u.shiftKey)) : u.code === "ArrowRight" ? (g = true, e.press_right(u.shiftKey)) : u.code === "Enter" ? (g = true, e.press_enter()) : u.code === "Escape" ? g = e.press_escape() : u.code === "Slash" && (g = true, e.press_slash()), g && (z(true), u.preventDefault());
      }
    }, j = (u) => {
      let g = false;
      u.shiftKey || (g = true, e.release_shift()), u.code === "KeyQ" ? (g = true, e.release_q()) : u.code === "KeyW" ? (g = true, e.release_w()) : u.code === "KeyA" ? (g = true, e.release_a()) : u.code === "KeyS" ? (g = true, e.release_s()) : u.code === "KeyE" ? (g = true, e.release_e()) : u.code === "KeyD" ? (g = true, e.release_d()) : u.code === "KeyZ" ? (g = true, e.release_z()) : u.code === "KeyC" ? (g = true, e.release_c()) : u.code === "Space" ? (g = true, e.release_space()) : u.code === "AltLeft" && (g = true, e.release_alt_left()), g && (z(false), u.preventDefault());
    };
    document.addEventListener("keydown", fe), document.addEventListener("keyup", j), Ee(() => {
      document.removeEventListener("keydown", fe), document.removeEventListener("keyup", j);
    });
    function z(u) {
      C(e.mode()), o(e.tiles_path()), _(e.selected_tiles_path()), K({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), $(e.show_quarter_grid()), F({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const g = [];
      Ft(ne, g, e.entities(), false), Ft(se, g, e.preview_entities(), true), zd(Z, e.entities()), oe(g), E(e.selected_tile_outline_path()), O({
        x: e.palette_center_x(),
        y: e.palette_center_y()
      }), Q({
        x: e.palette_selection_x(),
        y: e.palette_selection_y()
      }), S(e.past_ninja_bones()), u && jr(e);
    }
    const ie = [];
    for (let u = 0; u < ft - 1; u++) ie.push(48 + 24 * u);
    const ue = [];
    for (let u = 0; u < yt - 1; u++) ue.push(48 + 24 * u);
    const ae = [];
    for (let u = 0; u < ft; u++) ae.push(36 + 24 * u);
    const ye = [];
    for (let u = 0; u < yt; u++) ye.push(36 + 24 * u);
    const pe = [];
    for (let u = 0; u < ft * 2; u++) pe.push(30 + 12 * u);
    const Se = [];
    for (let u = 0; u < yt * 2; u++) Se.push(30 + 12 * u);
    return z(false), [
      (() => {
        var u = dd(), g = u.firstChild, Ae = g.firstChild, W = Ae.nextSibling;
        W.nextSibling;
        var ce = g.nextSibling, we = ce.nextSibling, ve = we.nextSibling, Ge = ve.nextSibling, dt = Ge.firstChild;
        return u.$$contextmenu = (b) => {
          e.press_escape() && (z(false), b.preventDefault());
        }, u.$$mouseup = () => {
          e.cursor_up(), z(false);
        }, u.$$dblclick = (b) => {
          e.double_click(b.shiftKey), z(false);
        }, u.$$mousedown = (b) => {
          b.buttons & 2 || (e.mode() === mt ? t.setReplay(e.to_replay(t.roundCorners(), t.dynamicFriction())) : (e.cursor_down(b.shiftKey), z(true)));
        }, u.$$mousemove = function(b) {
          const { left: v, top: A, width: I, height: _e } = this.getBoundingClientRect(), Ne = e.set_cursor_pos((b.clientX - v) / I * 1056, (b.clientY - A) / _e * 600, b.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (b.clientX - v) / I * 1056,
            y: (b.clientY - A) / _e * 600
          }), Ne && z(false);
        }, f(g, d(ur, {}), W), f(g, d(Vr, {}), W), f(g, d(cr, {}), W), f(g, d($r, {}), W), f(g, d(fr, {}), W), f(g, d(mr, {}), W), f(g, d(Dr, {}), W), f(g, d(Lr, {}), W), f(g, d(Zr, {}), W), f(g, d(Or, {}), W), f(g, d(Kr, {}), W), f(g, d(Br, {}), W), f(g, d(Hr, {}), W), f(g, d(Pc, {}), W), f(g, d(qr, {}), W), f(u, d(R, {
          get when() {
            return p();
          },
          get children() {
            return [
              Ie(() => pe.map((b) => (() => {
                var v = Rt();
                return h(v, "x1", b), h(v, "x2", b), v;
              })())),
              Ie(() => Se.map((b) => (() => {
                var v = Kt();
                return h(v, "y1", b), h(v, "y2", b), v;
              })()))
            ];
          }
        }), ce), f(u, d(R, {
          get when() {
            return s();
          },
          get children() {
            return [
              Ie(() => ae.map((b) => (() => {
                var v = Rt();
                return h(v, "x1", b), h(v, "x2", b), v;
              })())),
              Ie(() => ye.map((b) => (() => {
                var v = Kt();
                return h(v, "y1", b), h(v, "y2", b), v;
              })()))
            ];
          }
        }), ce), f(u, () => ie.map((b) => (() => {
          var v = ud();
          return h(v, "x1", b), h(v, "x2", b), v;
        })()), ce), f(u, () => ue.map((b) => (() => {
          var v = pd();
          return h(v, "y1", b), h(v, "y2", b), v;
        })()), ce), f(u, d(Wt, {
          entities: ne
        }), ce), f(u, d(_t, {
          get each() {
            return P();
          },
          children: (b) => (() => {
            var v = hd();
            return f(v, () => b.count), k((A) => {
              var I = b.x + 4, _e = b.y + 12;
              return I !== A.e && h(v, "x", A.e = I), _e !== A.t && h(v, "y", A.t = _e), A;
            }, {
              e: void 0,
              t: void 0
            }), v;
          })()
        }), we), f(u, d(R, {
          get when() {
            return y() === Vt;
          },
          get children() {
            var b = sd();
            return k((v) => {
              var A = B().x - Ut / 2, I = B().y - Ut / 2;
              return A !== v.e && h(b, "x", v.e = A), I !== v.t && h(b, "y", v.t = I), v;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), we), f(we, d(Wt, {
          entities: se
        })), f(u, d(R, {
          get when() {
            return [
              wt,
              zt,
              yd
            ].includes(y());
          },
          get children() {
            return d(xc, {
              entities: se
            });
          }
        }), ve), f(u, d(R, {
          get when() {
            return y() === Vt;
          },
          get children() {
            var b = od();
            return k((v) => {
              var A = G().x, I = G().y;
              return A !== v.e && h(b, "cx", v.e = A), I !== v.t && h(b, "cy", v.t = I), v;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), ve), f(u, d(R, {
          get when() {
            return y() === Ht;
          },
          get children() {
            var b = id();
            return k(() => h(b, "transform", `translate(${B().x},${B().y})`)), b;
          }
        }), ve), f(u, d(R, {
          get when() {
            return y() === Ht;
          },
          get children() {
            var b = _d();
            return k((v) => {
              var A = G().x - 13, I = G().y - 13;
              return A !== v.e && h(b, "x", v.e = A), I !== v.t && h(b, "y", v.t = I), v;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), Ge), f(u, d(_t, {
          get each() {
            return le();
          },
          children: (b) => (() => {
            var v = gd();
            return k((A) => {
              var I = b.x1, _e = b.y1, Ne = b.x2, Ce = b.y2;
              return I !== A.e && h(v, "x1", A.e = I), _e !== A.t && h(v, "y1", A.t = _e), Ne !== A.a && h(v, "x2", A.a = Ne), Ce !== A.o && h(v, "y2", A.o = Ce), A;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), v;
          })()
        }), Ge), f(u, d(R, {
          get when() {
            return y() === Gt;
          },
          get children() {
            var b = ld();
            return k((v) => {
              var A = N().col * 24 + 12, I = N().row * 24 + 12;
              return A !== v.e && h(b, "x", v.e = A), I !== v.t && h(b, "y", v.t = I), v;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), null), f(u, d(R, {
          get when() {
            return y() === wd || y() === wt;
          },
          get children() {
            var b = ad();
            return k((v) => {
              var A = H().x, I = H().y;
              return A !== v.e && h(b, "x", v.e = A), I !== v.t && h(b, "y", v.t = I), v;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), null), f(u, d(R, {
          get when() {
            return y() === mt;
          },
          get children() {
            return d(Ke, {
              class: "ninja",
              ninja: () => ({
                x: H().x,
                y: H().y,
                deg: 0
              }),
              bones: () => M() ?? Hd
            });
          }
        }), null), f(u, d(R, {
          get when() {
            return X();
          },
          get children() {
            var b = cd();
            return k(() => h(b, "points", r().map(({ x: v, y: A }) => `${v},${A}`).join(" "))), b;
          }
        }), null), k((b) => {
          var v = n(), A = [
            fd,
            wt,
            zt
          ].includes(y()) ? "url(#outline)" : "", I = l(), _e = U();
          return v !== b.e && h(ce, "d", b.e = v), A !== b.t && h(we, "filter", b.t = A), I !== b.a && h(ve, "d", b.a = I), _e !== b.o && h(dt, "d", b.o = _e), b;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), u;
      })(),
      d(cc, {
        editor: e,
        get setReplay() {
          return t.setReplay;
        },
        render: z,
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
        showTrail: X,
        setShowTrail: D,
        get dynamicFriction() {
          return t.dynamicFriction;
        },
        get setDynamicFriction() {
          return t.setDynamicFriction;
        }
      })
    ];
  }
  ct([
    "mousemove",
    "mousedown",
    "dblclick",
    "mouseup",
    "contextmenu"
  ]);
  var Ud = m("<div id=media-controls><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb></div></div><div><a href=# download=1234 style=color:var(--main-menu-selected);margin-left:1em>Export attract");
  function qd(t) {
    const e = () => {
      const s = t.progress(), c = t.length();
      return c === 0 || s >= c ? "100%" : `${s / c * 100}%`;
    }, r = () => {
      const s = t.progress(), c = t.previewProgress(), p = t.length();
      if (c === void 0 || p === 0) return {
        left: "0%",
        width: "0%"
      };
      const $ = Math.min(s, c), y = Math.min(Math.max(s, c), p);
      return {
        left: `${$ / p * 100}%`,
        width: `${(y - $) / p * 100}%`
      };
    };
    let n;
    document.addEventListener("mousemove", l), Ee(() => document.removeEventListener("mousemove", l)), document.addEventListener("mouseup", _), Ee(() => document.removeEventListener("mouseup", _));
    function o(s) {
      if (n) {
        const { left: c, top: p, width: $ } = n.getBoundingClientRect();
        let y = (s.clientX - c) / $;
        y = Math.min(1, y), y = Math.max(0, y);
        let C = Math.abs(s.clientY - p);
        return {
          targetFrame: Math.round(y * t.length()),
          strength: Math.pow(Math.E, -5 * C / $)
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
          const { targetFrame: p, strength: $ } = o(s);
          t.seek(Math.round(c + (p - c) * $)), t.previewSeek(void 0);
        } else n.matches(":hover") ? t.previewSeek(o(s).targetFrame) : t.previewSeek(void 0);
      }
    }
    function _() {
      t.setDragStart(void 0);
    }
    return (() => {
      var s = Ud(), c = s.firstChild, p = c.firstChild, $ = c.nextSibling, y = $.firstChild, C = y.nextSibling, N = C.nextSibling, K = N.nextSibling, H = $.nextSibling, F = H.firstChild;
      c.$$click = () => {
        t.isPlaying() ? t.setIsPlaying(false) : (t.progress() >= t.length() && t.seek(0), t.setIsPlaying(true));
      }, f(p, d(sr, {
        get children() {
          return [
            d(ze, {
              get when() {
                return !t.isPlaying();
              },
              children: "\u25B6"
            }),
            d(ze, {
              get when() {
                return t.isPlaying();
              },
              children: "\u23F8"
            })
          ];
        }
      })), $.$$mousedown = (E) => {
        t.setDragStart(o(E).targetFrame), l(E), E.preventDefault();
      };
      var U = n;
      return typeof U == "function" ? dn(U, $) : n = $, F.$$click = function() {
        const E = t.attract(), B = new Blob([
          E.buffer
        ], {
          type: "application/octet-stream"
        }), O = URL.createObjectURL(B);
        this.href = O, setTimeout(() => URL.revokeObjectURL(O), 100);
      }, k((E) => {
        var B = e(), O = r().left, G = r().width, Q = e();
        return B !== E.e && Ye(C, "width", E.e = B), O !== E.t && Ye(N, "left", E.t = O), G !== E.a && Ye(N, "width", E.a = G), Q !== E.o && Ye(K, "left", E.o = Q), E;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), s;
    })();
  }
  ct([
    "click",
    "mousedown"
  ]);
  var Fd = m("<svg><circle r=1.5 fill=var(--background)></svg>", false, true, false), Wd = m('<svg><path d="M -3 1 L 0 -3 L 3 1 L 0 -1 Z"fill=none stroke-width=3 stroke-linecap=round stroke-linejoin=round></svg>', false, true, false), Zd = m("<svg><g></svg>", false, true, false);
  function Yd(t) {
    return [
      d(V, {
        get each() {
          return t.inputs();
        },
        children: (e, r) => (() => {
          var n = Zd();
          return f(n, d(R, {
            get when() {
              return !(e() > 0);
            },
            get children() {
              var o = Fd();
              return k(() => h(o, "opacity", Number.isNaN(e()) ? 0.3 : 1)), o;
            }
          }), null), f(n, d(R, {
            get when() {
              return e() > 0;
            },
            get children() {
              var o = Wd();
              return k(() => h(o, "stroke", `oklch(60% 80% ${Xd(e())}deg)`)), o;
            }
          }), null), k(() => h(n, "transform", `translate(${36 + 24 * r},${24 * 24.5}) rotate(${Jd(e())},0,0)`)), n;
        })()
      }),
      d(V, {
        get each() {
          return t.pastNinjas();
        },
        children: (e, r) => d(R, {
          get when() {
            return e().length;
          },
          get children() {
            return d(Ke, {
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
  function Jd(t) {
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
  function Xd(t) {
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
  var Qd = m("<span style=position:absolute>"), eu = m("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), tu = m('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), ru = m("<div>");
  function nu(t) {
    const e = t.replay, [r, n] = w(true), [o, l] = w(!e.is_from_attract()), [_, s] = w(void 0), [c, p] = w(0), [$, y] = w(0), [C, N] = w(void 0), [K, H] = w(5400), F = (x) => {
      if (x.code === "Enter") e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), o() || Le(1);
      else if (x.code === "Escape") o() ? (l(false), n(false), N(void 0), U(), t.editor.set_start_replay_paused(true)) : (l(true), n(true), t.editor.set_start_replay_paused(false));
      else if (x.code === "Comma") {
        if (!o() && $() > 0) {
          y($() - 1), e.seek($());
          let { isJump1Pressed: T, isJump2Pressed: L, isRightPressed: ee, isLeftPressed: he, isDownPressed: me, isSuicidePressed: be } = t.globalEventState;
          T() || L() || ee() || he() || be() ? e.set_input(T() || L(), ee(), he(), be()) : me() && e.set_input(false, false, false, false), U(), Le(1);
        }
      } else if (x.code === "Period" && !o()) {
        let { isJump1Pressed: T, isJump2Pressed: L, isRightPressed: ee, isLeftPressed: he, isDownPressed: me, isSuicidePressed: be } = t.globalEventState;
        T() || L() || ee() || he() || be() ? e.set_input(T() || L(), ee(), he(), be()) : (me() || e.inputs_len() === e.progress()) && e.set_input(false, false, false, false), e.tick(), y(e.progress()), U(), Le(1);
      }
    };
    function U() {
      e.seek_preview(e.progress() + 120), N(e.progress_preview()), I(), Ce(), b();
    }
    document.addEventListener("keydown", F), Ee(() => {
      document.removeEventListener("keydown", F);
    });
    const E = () => e.tiles_path(), [B, O] = w({
      x: -50,
      y: -50,
      deg: 0
    }), [G, Q] = w({
      x: -50,
      y: -50,
      deg: 0
    }), [ne, se] = w(), [le, oe] = w(), X = w([]), D = w([]), M = w([]), S = w([]), P = w([]), Z = w([]), fe = w([]), j = w([]), z = w([]), ie = w([]), ue = w([]), ae = w([]), ye = w([]), pe = w([]), Se = w([]), u = w([]), g = w([]), Ae = w([]), W = w([]), ce = w([]), we = w([]), ve = w([]), [Ge, dt] = w([]);
    function b() {
      const x = [], T = e.past_ninjas_len();
      for (let L = 0; L < T; L++) x.push({
        x: e.past_ninja_x(L),
        y: e.past_ninja_y(L)
      });
      dt(x);
    }
    b();
    const [v, A] = w([]);
    function I() {
      const x = [];
      for (let T = -21; T < 21; T++) {
        const L = T + e.progress();
        L < 0 || L >= e.inputs_len() ? x.push(NaN) : x.push(e.input(L));
      }
      A(x);
    }
    I();
    const [_e, Ne] = w([]);
    function Ce() {
      const x = [];
      for (let T = -20; T <= 20; T++) {
        const L = T + e.progress();
        x.push(e.past_ninja_bones(L));
      }
      Ne(x);
    }
    Ce();
    let Dt = performance.now();
    const ut = 1e3 / 60;
    let Ze = 0, St = 0;
    function Lt() {
      const x = performance.now(), T = Math.min(x - Dt, 250);
      Dt = x;
      let L = 1;
      const ee = e;
      if (o() && _() === void 0) {
        if (r() || $() < c()) {
          for (Ze += T; Ze >= ut; ) {
            if (r()) {
              let { isJump1Pressed: he, isJump2Pressed: me, isRightPressed: be, isLeftPressed: pt, isSuicidePressed: Yr } = t.globalEventState;
              ee.set_input(he() || me(), be(), pt(), Yr());
            }
            ee.tick(), I(), Ze -= ut;
          }
          L = Ze / ut, y(ee.progress());
        } else $() < c() ? (ee.tick(), y(ee.progress())) : l(false);
        Le(L);
      }
      St = requestAnimationFrame(Lt);
    }
    Lt(), Ee(() => {
      cancelAnimationFrame(St);
    });
    function Le(x) {
      H(e.score()), O({
        x: e.ninja_x(x),
        y: e.ninja_y(x),
        deg: 0
      }), Q({
        x: e.ninja_preview_x(x),
        y: e.ninja_preview_y(x),
        deg: 0
      }), se(e.ninja_bones(x)), C() === void 0 ? oe(void 0) : oe(e.ninja_preview_bones(x)), Cl(X, e), qc(D, e), Na(M, e, x), Dl(S, e), Oa(P, e, x), za(Z, e, x), va(fe, e), La(j, e, x), Zl(z, e, x), sa(ie, e), aa(ue, e, x), wa(ae, e), Kl(ye, e, x), Wa(pe, e, x), pl(Se, e, x), ml(u, e, x), bc(g, e, x), Gc(Ae, e, x), Sc(W, e, x), Bc(ce, e, x), Jc(we, e, x), nd(ve, e, x), p(e.replay_length());
    }
    return Le(1), [
      (() => {
        var x = Qd();
        return f(x, () => (K() / 60).toFixed(3)), x;
      })(),
      (() => {
        var x = tu(), T = x.firstChild;
        T.firstChild;
        var L = T.nextSibling;
        return x.$$mousemove = function(ee) {
          const { left: he, top: me, width: be, height: pt } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (ee.clientX - he) / be * 1056,
            y: (ee.clientY - me) / pt * 600
          });
        }, f(T, d(ur, {}), null), f(T, d(Vr, {}), null), f(T, d($r, {}), null), f(T, d(cr, {}), null), f(T, d(fr, {}), null), f(T, d(mr, {}), null), f(T, d(Dr, {}), null), f(T, d(Lr, {}), null), f(T, d(Or, {}), null), f(T, d(Kr, {}), null), f(T, d(Br, {}), null), f(T, d(Hr, {}), null), f(T, d(qr, {}), null), f(T, d(gl, {}), null), f(T, d(Zr, {}), null), f(x, d(yr, {
          get trapDoors() {
            return ue[0];
          }
        }), L), f(x, d(hr, {
          get lockedDoors() {
            return z[0];
          }
        }), L), f(x, d(gr, {
          get lockedSwitches() {
            return ie[0];
          }
        }), L), f(x, d(wr, {
          get trapSwitches() {
            return ae[0];
          }
        }), L), f(x, d(_r, {
          get exitDoors() {
            return Se[0];
          }
        }), L), f(x, d(ar, {
          get oneWays() {
            return S[0];
          }
        }), L), f(x, d(dr, {
          get mines() {
            return X[0];
          }
        }), L), f(x, d(zr, {
          get golds() {
            return D[0];
          }
        }), L), f(x, d(lr, {
          get exitSwitches() {
            return u[0];
          }
        }), L), f(x, d(pr, {
          get regularDoors() {
            return ye[0];
          }
        }), L), f(x, d(br, {
          get launchPads() {
            return fe[0];
          }
        }), L), f(x, d(Rr, {
          get laserDrones() {
            return ce[0];
          }
        }), L), f(x, d(Ir, {
          get chaingunDrones() {
            return W[0];
          }
        }), L), f(x, d(Mr, {
          get zapDrones() {
            return g[0];
          }
        }), L), f(x, d(Gr, {
          get chaseDrones() {
            return Ae[0];
          }
        }), L), f(x, d(xr, {
          get floorGuards() {
            return j[0];
          }
        }), L), f(x, d(Ur, {
          get deathballs() {
            return we[0];
          }
        }), L), f(x, d(Sr, {
          get thwumps() {
            return Z[0];
          }
        }), L), f(x, d(Wr, {
          get evilNinjas() {
            return ve[0];
          }
        }), L), f(x, d(Ke, {
          class: "ninja preview",
          ninja: G,
          bones: le
        }), L), f(x, d(Ke, {
          class: "ninja",
          ninja: B,
          bones: ne
        }), L), f(x, d(vr, {
          get bounceBlocks() {
            return M[0];
          }
        }), L), f(x, d(Tr, {
          get shoveThwumps() {
            return pe[0];
          }
        }), L), f(x, d(kr, {
          get boostPads() {
            return P[0];
          }
        }), L), f(x, d(R, {
          get when() {
            return !o();
          },
          get children() {
            return [
              (() => {
                var ee = eu();
                return k(() => h(ee, "points", Ge().slice($(), C() || 0).map(({ x: he, y: me }) => `${he},${me}`).join(" "))), ee;
              })(),
              d(Yd, {
                inputs: v,
                pastNinjas: _e
              })
            ];
          }
        }), null), k(() => h(L, "d", E())), x;
      })(),
      (() => {
        var x = ru();
        return f(x, d(R, {
          get when() {
            return !r() || !o();
          },
          get children() {
            return d(qd, {
              isPlaying: o,
              setIsPlaying: l,
              dragStart: _,
              setDragStart: s,
              length: c,
              progress: $,
              previewProgress: C,
              seek: (T) => {
                y(T), e.seek(T), I(), Ce(), b(), Le(1);
              },
              previewSeek: (T) => {
                N(T), b(), e && (T !== void 0 && _() === void 0 && e.seek_preview(T), Le(1));
              },
              attract: () => e.export_attract(t.editor)
            });
          }
        })), x;
      })()
    ];
  }
  ct([
    "mousemove"
  ]);
  var su = m("<p>Invalid file."), ou = m("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file><dl><dt>Windows</dt><dd>C:\\Program Files (x86)\\Steam\\steamapps\\common\\N++\\anim_data_line_new.txt.bin</dd><dt>Linux</dt><dd>~/.steam/steam/steamapps/common/N++/anim_data_line_new.txt.bin</dd><dt>Mac</dt><dd>~/Library/Application Support/Steam/steamapps/common/N++/N++.app/Contents/Resources/NPP/anim_data_line_new.txt.bin");
  function iu() {
    const t = Pe.new(), [e, r] = w(), [n, o] = w(""), [l, _] = w(false), [s, c] = w(false), [p, $] = w([]);
    function y() {
      const j = [], z = t.past_ninjas_len();
      for (let ie = 0; ie < z; ie++) j.push({
        x: t.past_ninja_x(ie),
        y: t.past_ninja_y(ie)
      });
      $(j);
    }
    const [C, N] = w(false), [K, H] = w(false), [F, U] = w(false), [E, B] = w(false), [O, G] = w(false), [Q, ne] = w(false), [se, le] = w({
      x: 36,
      y: 36
    }), oe = {
      isJump1Pressed: C,
      isJump2Pressed: K,
      isRightPressed: F,
      isLeftPressed: E,
      isSuicidePressed: O,
      isDownPressed: Q,
      mouseGamePos: se,
      setMouseGamePos: le
    };
    Ya(t), o(t.get_level_name()), document.addEventListener("keydown", (j) => {
      if (!(j.ctrlKey || j.metaKey)) if (j.code === "Tab") {
        const z = e();
        z ? (r(void 0), z.send_past_ninjas(), t.receive_past_ninjas(), z.free(), y()) : r(t.to_replay(l(), s())), j.preventDefault();
      } else j.code === "KeyZ" ? N(true) : j.code === "ArrowUp" ? H(true) : j.code === "ArrowRight" ? U(true) : j.code === "ArrowLeft" ? B(true) : j.code === "ArrowDown" ? ne(true) : j.code === "KeyV" && G(true);
    }), document.addEventListener("keyup", (j) => {
      j.code === "KeyZ" ? N(false) : j.code === "ArrowUp" ? H(false) : j.code === "ArrowRight" ? U(false) : j.code === "ArrowLeft" ? B(false) : j.code === "ArrowDown" ? ne(false) : j.code === "KeyV" && G(false);
    }), document.addEventListener("blur", () => {
      N(false), H(false), U(false), B(false), G(false), ne(false);
    }), Xa(t);
    const X = 0, D = 1, M = 2, [S, P] = w(t.get_anim_state() == X ? X : M), [Z, fe] = w(tc());
    return en(() => {
      const j = Z();
      j && (_c(j.colors), Qa(j));
    }), ic().then(() => {
      const j = Z();
      if (j) {
        const z = Cr(j.name);
        z && (j.colors = z), fe(j);
      }
    }), [
      d(R, {
        get when() {
          return S() != X;
        },
        get children() {
          var j = ou(), z = j.firstChild, ie = z.nextSibling;
          return ie.nextSibling, ie.addEventListener("change", function() {
            const ue = this.files;
            if (ue && ue.length > 0) {
              const ae = new FileReader();
              ae.onloadend = () => {
                if (ae.result instanceof ArrayBuffer) {
                  const ye = new Uint8Array(ae.result);
                  try {
                    try {
                      Ja(ye);
                    } catch (pe) {
                      console.error(pe);
                    }
                    t.set_anim_data(ye), P(t.get_anim_state());
                  } catch (pe) {
                    console.error(pe), P(D);
                  }
                }
              }, ae.readAsArrayBuffer(ue[0]);
            }
          }), f(j, d(R, {
            get when() {
              return S() == D;
            },
            get children() {
              return su();
            }
          }), null), j;
        }
      }),
      d(R, {
        get when() {
          return Ie(() => S() == X)() && !e();
        },
        get children() {
          return d(Vd, {
            editor: t,
            setReplay: r,
            pastNinjas: p,
            globalEventState: oe,
            levelName: n,
            setLevelName: o,
            roundCorners: l,
            setRoundCorners: _,
            palette: Z,
            setPalette: fe,
            dynamicFriction: s,
            setDynamicFriction: c
          });
        }
      }),
      d(R, {
        get when() {
          return Ie(() => S() == X)() && !!e();
        },
        keyed: true,
        get children() {
          return d(nu, {
            get replay() {
              return e();
            },
            editor: t,
            globalEventState: oe
          });
        }
      })
    ];
  }
  const _u = document.getElementById("root");
  cn(() => d(iu, {}), _u);
})();
