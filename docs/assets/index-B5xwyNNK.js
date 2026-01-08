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
  const pr = false, hr = (t, e) => t === e, Lt = Symbol("solid-track"), Ue = {
    equals: hr
  };
  let At = Ct;
  const ge = 1, Fe = 2, jt = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var F = null;
  let Xe = null, fr = null, G = null, H = null, ce = null, ze = 0;
  function $e(t, e) {
    const r = G, s = F, o = t.length === 0, i = e === void 0 ? s : e, _ = o ? jt : {
      owned: null,
      cleanups: null,
      context: i ? i.context : null,
      owner: i
    }, n = o ? t : () => t(() => re(() => je(_)));
    F = _, G = null;
    try {
      return Ce(n, true);
    } finally {
      G = r, F = s;
    }
  }
  function b(t, e) {
    e = e ? Object.assign({}, Ue, e) : Ue;
    const r = {
      value: t,
      observers: null,
      observerSlots: null,
      comparator: e.equals || void 0
    }, s = (o) => (typeof o == "function" && (o = o(r.value)), Nt(r, o));
    return [
      Mt.bind(r),
      s
    ];
  }
  function T(t, e, r) {
    const s = it(t, e, false, ge);
    Ne(s);
  }
  function gr(t, e, r) {
    At = br;
    const s = it(t, e, false, ge);
    s.user = true, ce ? ce.push(s) : Ne(s);
  }
  function Q(t, e, r) {
    r = r ? Object.assign({}, Ue, r) : Ue;
    const s = it(t, e, true, 0);
    return s.observers = null, s.observerSlots = null, s.comparator = r.equals || void 0, Ne(s), Mt.bind(s);
  }
  function re(t) {
    if (G === null) return t();
    const e = G;
    G = null;
    try {
      return t();
    } finally {
      G = e;
    }
  }
  function we(t) {
    return F === null || (F.cleanups === null ? F.cleanups = [
      t
    ] : F.cleanups.push(t)), t;
  }
  function yr(t) {
    const e = Q(t), r = Q(() => rt(e()));
    return r.toArray = () => {
      const s = r();
      return Array.isArray(s) ? s : s != null ? [
        s
      ] : [];
    }, r;
  }
  function Mt() {
    if (this.sources && this.state) if (this.state === ge) Ne(this);
    else {
      const t = H;
      H = null, Ce(() => We(this), false), H = t;
    }
    if (G) {
      const t = this.observers ? this.observers.length : 0;
      G.sources ? (G.sources.push(this), G.sourceSlots.push(t)) : (G.sources = [
        this
      ], G.sourceSlots = [
        t
      ]), this.observers ? (this.observers.push(G), this.observerSlots.push(G.sources.length - 1)) : (this.observers = [
        G
      ], this.observerSlots = [
        G.sources.length - 1
      ]);
    }
    return this.value;
  }
  function Nt(t, e, r) {
    let s = t.value;
    return (!t.comparator || !t.comparator(s, e)) && (t.value = e, t.observers && t.observers.length && Ce(() => {
      for (let o = 0; o < t.observers.length; o += 1) {
        const i = t.observers[o], _ = Xe && Xe.running;
        _ && Xe.disposed.has(i), (_ ? !i.tState : !i.state) && (i.pure ? H.push(i) : ce.push(i), i.observers && Bt(i)), _ || (i.state = ge);
      }
      if (H.length > 1e6) throw H = [], new Error();
    }, false)), e;
  }
  function Ne(t) {
    if (!t.fn) return;
    je(t);
    const e = ze;
    wr(t, t.value, e);
  }
  function wr(t, e, r) {
    let s;
    const o = F, i = G;
    G = F = t;
    try {
      s = t.fn(e);
    } catch (_) {
      return t.pure && (t.state = ge, t.owned && t.owned.forEach(je), t.owned = null), t.updatedAt = r + 1, Ot(_);
    } finally {
      G = i, F = o;
    }
    (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? Nt(t, s) : t.value = s, t.updatedAt = r);
  }
  function it(t, e, r, s = ge, o) {
    const i = {
      fn: t,
      state: s,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: e,
      owner: F,
      context: F ? F.context : null,
      pure: r
    };
    return F === null || F !== jt && (F.owned ? F.owned.push(i) : F.owned = [
      i
    ]), i;
  }
  function qe(t) {
    if (t.state === 0) return;
    if (t.state === Fe) return We(t);
    if (t.suspense && re(t.suspense.inFallback)) return t.suspense.effects.push(t);
    const e = [
      t
    ];
    for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < ze); ) t.state && e.push(t);
    for (let r = e.length - 1; r >= 0; r--) if (t = e[r], t.state === ge) Ne(t);
    else if (t.state === Fe) {
      const s = H;
      H = null, Ce(() => We(t, e[0]), false), H = s;
    }
  }
  function Ce(t, e) {
    if (H) return t();
    let r = false;
    e || (H = []), ce ? r = true : ce = [], ze++;
    try {
      const s = t();
      return mr(r), s;
    } catch (s) {
      r || (ce = null), H = null, Ot(s);
    }
  }
  function mr(t) {
    if (H && (Ct(H), H = null), t) return;
    const e = ce;
    ce = null, e.length && Ce(() => At(e), false);
  }
  function Ct(t) {
    for (let e = 0; e < t.length; e++) qe(t[e]);
  }
  function br(t) {
    let e, r = 0;
    for (e = 0; e < t.length; e++) {
      const s = t[e];
      s.user ? t[r++] = s : qe(s);
    }
    for (e = 0; e < r; e++) qe(t[e]);
  }
  function We(t, e) {
    t.state = 0;
    for (let r = 0; r < t.sources.length; r += 1) {
      const s = t.sources[r];
      if (s.sources) {
        const o = s.state;
        o === ge ? s !== e && (!s.updatedAt || s.updatedAt < ze) && qe(s) : o === Fe && We(s, e);
      }
    }
  }
  function Bt(t) {
    for (let e = 0; e < t.observers.length; e += 1) {
      const r = t.observers[e];
      r.state || (r.state = Fe, r.pure ? H.push(r) : ce.push(r), r.observers && Bt(r));
    }
  }
  function je(t) {
    let e;
    if (t.sources) for (; t.sources.length; ) {
      const r = t.sources.pop(), s = t.sourceSlots.pop(), o = r.observers;
      if (o && o.length) {
        const i = o.pop(), _ = r.observerSlots.pop();
        s < o.length && (i.sourceSlots[_] = s, o[s] = i, r.observerSlots[s] = _);
      }
    }
    if (t.tOwned) {
      for (e = t.tOwned.length - 1; e >= 0; e--) je(t.tOwned[e]);
      delete t.tOwned;
    }
    if (t.owned) {
      for (e = t.owned.length - 1; e >= 0; e--) je(t.owned[e]);
      t.owned = null;
    }
    if (t.cleanups) {
      for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
      t.cleanups = null;
    }
    t.state = 0;
  }
  function xr(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function Ot(t, e = F) {
    throw xr(t);
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
  function Ve(t) {
    for (let e = 0; e < t.length; e++) t[e]();
  }
  function vr(t, e, r = {}) {
    let s = [], o = [], i = [], _ = 0, n = e.length > 1 ? [] : null;
    return we(() => Ve(i)), () => {
      let c = t() || [], p = c.length, m, h;
      return c[Lt], re(() => {
        let P, N, C, A, O, S, D, k, M;
        if (p === 0) _ !== 0 && (Ve(i), i = [], s = [], o = [], _ = 0, n && (n = [])), r.fallback && (s = [
          st
        ], o[0] = $e((Z) => (i[0] = Z, r.fallback())), _ = 1);
        else if (_ === 0) {
          for (o = new Array(p), h = 0; h < p; h++) s[h] = c[h], o[h] = $e(E);
          _ = p;
        } else {
          for (C = new Array(p), A = new Array(p), n && (O = new Array(p)), S = 0, D = Math.min(_, p); S < D && s[S] === c[S]; S++) ;
          for (D = _ - 1, k = p - 1; D >= S && k >= S && s[D] === c[k]; D--, k--) C[k] = o[D], A[k] = i[D], n && (O[k] = n[D]);
          for (P = /* @__PURE__ */ new Map(), N = new Array(k + 1), h = k; h >= S; h--) M = c[h], m = P.get(M), N[h] = m === void 0 ? -1 : m, P.set(M, h);
          for (m = S; m <= D; m++) M = s[m], h = P.get(M), h !== void 0 && h !== -1 ? (C[h] = o[m], A[h] = i[m], n && (O[h] = n[m]), h = N[h], P.set(M, h)) : i[m]();
          for (h = S; h < p; h++) h in C ? (o[h] = C[h], i[h] = A[h], n && (n[h] = O[h], n[h](h))) : o[h] = $e(E);
          o = o.slice(0, _ = p), s = c.slice(0);
        }
        return o;
      });
      function E(P) {
        if (i[h] = P, n) {
          const [N, C] = b(h);
          return n[h] = C, e(c[h], N);
        }
        return e(c[h]);
      }
    };
  }
  function kr(t, e, r = {}) {
    let s = [], o = [], i = [], _ = [], n = 0, c;
    return we(() => Ve(i)), () => {
      const p = t() || [], m = p.length;
      return p[Lt], re(() => {
        if (m === 0) return n !== 0 && (Ve(i), i = [], s = [], o = [], n = 0, _ = []), r.fallback && (s = [
          st
        ], o[0] = $e((E) => (i[0] = E, r.fallback())), n = 1), o;
        for (s[0] === st && (i[0](), i = [], s = [], o = [], n = 0), c = 0; c < m; c++) c < s.length && s[c] !== p[c] ? _[c](() => p[c]) : c >= s.length && (o[c] = $e(h));
        for (; c < s.length; c++) i[c]();
        return n = _.length = i.length = m, s = p.slice(0), o = o.slice(0, n);
      });
      function h(E) {
        i[c] = E;
        const [P, N] = b(p[c]);
        return _[c] = N, e(P, c);
      }
    };
  }
  function u(t, e) {
    return re(() => t(e || {}));
  }
  const It = (t) => `Stale read from <${t}>.`;
  function _t(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return Q(vr(() => t.each, t.children, e || void 0));
  }
  function z(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return Q(kr(() => t.each, t.children, e || void 0));
  }
  function U(t) {
    const e = t.keyed, r = Q(() => t.when, void 0, void 0), s = e ? r : Q(r, void 0, {
      equals: (o, i) => !o == !i
    });
    return Q(() => {
      const o = s();
      if (o) {
        const i = t.children;
        return typeof i == "function" && i.length > 0 ? re(() => i(e ? o : () => {
          if (!re(s)) throw It("Show");
          return r();
        })) : i;
      }
      return t.fallback;
    }, void 0, void 0);
  }
  function $r(t) {
    const e = yr(() => t.children), r = Q(() => {
      const s = e(), o = Array.isArray(s) ? s : [
        s
      ];
      let i = () => {
      };
      for (let _ = 0; _ < o.length; _++) {
        const n = _, c = o[_], p = i, m = Q(() => p() ? void 0 : c.when, void 0, void 0), h = c.keyed ? m : Q(m, void 0, {
          equals: (E, P) => !E == !P
        });
        i = () => p() || (h() ? [
          n,
          m,
          c
        ] : void 0);
      }
      return i;
    });
    return Q(() => {
      const s = r()();
      if (!s) return t.fallback;
      const [o, i, _] = s, n = _.children;
      return typeof n == "function" && n.length > 0 ? re(() => n(_.keyed ? i() : () => {
        var _a2;
        if (((_a2 = re(r)()) == null ? void 0 : _a2[0]) !== o) throw It("Match");
        return i();
      })) : n;
    }, void 0, void 0);
  }
  function at(t) {
    return t;
  }
  const ke = (t) => Q(() => t());
  function Sr(t, e, r) {
    let s = r.length, o = e.length, i = s, _ = 0, n = 0, c = e[o - 1].nextSibling, p = null;
    for (; _ < o || n < i; ) {
      if (e[_] === r[n]) {
        _++, n++;
        continue;
      }
      for (; e[o - 1] === r[i - 1]; ) o--, i--;
      if (o === _) {
        const m = i < s ? n ? r[n - 1].nextSibling : r[i - n] : c;
        for (; n < i; ) t.insertBefore(r[n++], m);
      } else if (i === n) for (; _ < o; ) (!p || !p.has(e[_])) && e[_].remove(), _++;
      else if (e[_] === r[i - 1] && r[n] === e[o - 1]) {
        const m = e[--o].nextSibling;
        t.insertBefore(r[n++], e[_++].nextSibling), t.insertBefore(r[--i], m), e[o] = r[i];
      } else {
        if (!p) {
          p = /* @__PURE__ */ new Map();
          let h = n;
          for (; h < i; ) p.set(r[h], h++);
        }
        const m = p.get(e[_]);
        if (m != null) if (n < m && m < i) {
          let h = _, E = 1, P;
          for (; ++h < o && h < i && !((P = p.get(e[h])) == null || P !== m + E); ) E++;
          if (E > m - n) {
            const N = e[_];
            for (; n < m; ) t.insertBefore(r[n++], N);
          } else t.replaceChild(r[n++], e[_++]);
        } else _++;
        else e[_++].remove();
      }
    }
  }
  const ct = "_$DX_DELEGATE";
  function Dr(t, e, r, s = {}) {
    let o;
    return $e((i) => {
      o = i, e === document ? t() : x(e, t(), e.firstChild ? null : void 0, r);
    }, s.owner), () => {
      o(), e.textContent = "";
    };
  }
  function v(t, e, r, s) {
    let o;
    const i = () => {
      const n = s ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
      return n.innerHTML = t, r ? n.content.firstChild.firstChild : s ? n.firstChild : n.content.firstChild;
    }, _ = e ? () => re(() => document.importNode(o || (o = i()), true)) : () => (o || (o = i())).cloneNode(true);
    return _.cloneNode = _, _;
  }
  function Ze(t, e = window.document) {
    const r = e[ct] || (e[ct] = /* @__PURE__ */ new Set());
    for (let s = 0, o = t.length; s < o; s++) {
      const i = t[s];
      r.has(i) || (r.add(i), e.addEventListener(i, Pr));
    }
  }
  function y(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function Be(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function Tr(t, e, r) {
    return re(() => t(e, r));
  }
  function x(t, e, r, s) {
    if (r !== void 0 && !s && (s = []), typeof e != "function") return He(t, e, s, r);
    T((o) => He(t, e(), o, r), s);
  }
  function Pr(t) {
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
  function He(t, e, r, s, o) {
    for (; typeof r == "function"; ) r = r();
    if (e === r) return r;
    const i = typeof e, _ = s !== void 0;
    if (t = _ && r[0] && r[0].parentNode || t, i === "string" || i === "number") {
      if (i === "number" && (e = e.toString(), e === r)) return r;
      if (_) {
        let n = r[0];
        n && n.nodeType === 3 ? n.data !== e && (n.data = e) : n = document.createTextNode(e), r = xe(t, r, s, n);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || i === "boolean") r = xe(t, r, s);
    else {
      if (i === "function") return T(() => {
        let n = e();
        for (; typeof n == "function"; ) n = n();
        r = He(t, n, r, s);
      }), () => r;
      if (Array.isArray(e)) {
        const n = [], c = r && Array.isArray(r);
        if (ot(n, e, r, o)) return T(() => r = He(t, n, r, s, true)), () => r;
        if (n.length === 0) {
          if (r = xe(t, r, s), _) return r;
        } else c ? r.length === 0 ? dt(t, n, s) : Sr(t, r, n) : (r && xe(t), dt(t, n));
        r = n;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (_) return r = xe(t, r, s, e);
          xe(t, r, null, e);
        } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
        r = e;
      }
    }
    return r;
  }
  function ot(t, e, r, s) {
    let o = false;
    for (let i = 0, _ = e.length; i < _; i++) {
      let n = e[i], c = r && r[t.length], p;
      if (!(n == null || n === true || n === false)) if ((p = typeof n) == "object" && n.nodeType) t.push(n);
      else if (Array.isArray(n)) o = ot(t, n, c) || o;
      else if (p === "function") if (s) {
        for (; typeof n == "function"; ) n = n();
        o = ot(t, Array.isArray(n) ? n : [
          n
        ], Array.isArray(c) ? c : [
          c
        ]) || o;
      } else t.push(n), o = true;
      else {
        const m = String(n);
        c && c.nodeType === 3 && c.data === m ? t.push(c) : t.push(document.createTextNode(m));
      }
    }
    return o;
  }
  function dt(t, e, r = null) {
    for (let s = 0, o = e.length; s < o; s++) t.insertBefore(e[s], r);
  }
  function xe(t, e, r, s) {
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
  const Er = "" + new URL("ntools_rs_bg-BVUIz3cQ.wasm", import.meta.url).href, Lr = async (t = {}, e) => {
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
  function Ar(t) {
    l = t;
  }
  let Oe = null;
  function Se() {
    return (Oe === null || Oe.byteLength === 0) && (Oe = new Uint8Array(l.memory.buffer)), Oe;
  }
  let Re = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  Re.decode();
  const jr = 2146435072;
  let Je = 0;
  function Mr(t, e) {
    return Je += e, Je >= jr && (Re = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), Re.decode(), Je = e), Re.decode(Se().subarray(t, t + e));
  }
  function ye(t, e) {
    return t = t >>> 0, Mr(t, e);
  }
  let fe = 0;
  function Ke(t, e) {
    const r = e(t.length * 1, 1) >>> 0;
    return Se().set(t, r / 1), fe = t.length, r;
  }
  function Ge(t) {
    const e = l.__wbindgen_externrefs.get(t);
    return l.__externref_table_dealloc(t), e;
  }
  function Nr(t, e) {
    return t = t >>> 0, Se().subarray(t / 1, t / 1 + e);
  }
  const Ae = new TextEncoder();
  "encodeInto" in Ae || (Ae.encodeInto = function(t, e) {
    const r = Ae.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function Cr(t, e, r) {
    if (r === void 0) {
      const n = Ae.encode(t), c = e(n.length, 1) >>> 0;
      return Se().subarray(c, c + n.length).set(n), fe = n.length, c;
    }
    let s = t.length, o = e(s, 1) >>> 0;
    const i = Se();
    let _ = 0;
    for (; _ < s; _++) {
      const n = t.charCodeAt(_);
      if (n > 127) break;
      i[o + _] = n;
    }
    if (_ !== s) {
      _ !== 0 && (t = t.slice(_)), o = r(o, s, s = _ + t.length * 3, 1) >>> 0;
      const n = Se().subarray(o + _, o + s), c = Ae.encodeInto(t, n);
      _ += c.written, o = r(o, s, _, 1) >>> 0;
    }
    return fe = _, o;
  }
  let ve = null;
  function Br() {
    return (ve === null || ve.buffer.detached === true || ve.buffer.detached === void 0 && ve.buffer !== l.memory.buffer) && (ve = new DataView(l.memory.buffer)), ve;
  }
  function ut(t, e) {
    t = t >>> 0;
    const r = Br(), s = [];
    for (let o = t; o < t + 4 * e; o += 4) s.push(l.__wbindgen_externrefs.get(r.getUint32(o, true)));
    return l.__externref_drop_slice(t, e), s;
  }
  let Ie = null;
  function Or() {
    return (Ie === null || Ie.byteLength === 0) && (Ie = new Float64Array(l.memory.buffer)), Ie;
  }
  function nt(t, e) {
    return t = t >>> 0, Or().subarray(t / 8, t / 8 + e);
  }
  const pt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_editor_free(t >>> 0, 1));
  class De {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(De.prototype);
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
      return De.__wrap(e);
    }
    set_anim_data(e) {
      const r = Ke(e, l.__wbindgen_malloc), s = fe;
      l.editor_set_anim_data(this.__wbg_ptr, r, s);
    }
    get_anim_state() {
      return l.editor_get_anim_state(this.__wbg_ptr) >>> 0;
    }
    load_attract(e) {
      const r = Ke(e, l.__wbindgen_malloc), s = fe, o = l.editor_load_attract(this.__wbg_ptr, r, s);
      if (o[1]) throw Ge(o[0]);
    }
    load_map(e) {
      const r = Ke(e, l.__wbindgen_malloc), s = fe, o = l.editor_load_map(this.__wbg_ptr, r, s);
      if (o[1]) throw Ge(o[0]);
    }
    export_map() {
      const e = l.editor_export_map(this.__wbg_ptr);
      var r = Nr(e[0], e[1]).slice();
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
      const r = Cr(e, l.__wbindgen_malloc, l.__wbindgen_realloc), s = fe;
      l.editor_set_level_name(this.__wbg_ptr, r, s);
    }
    to_replay(e) {
      const r = l.editor_to_replay(this.__wbg_ptr, e);
      if (r[2]) throw Ge(r[1]);
      return Te.__wrap(r[0]);
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
    past_ninja_bones() {
      const e = l.editor_past_ninja_bones(this.__wbg_ptr);
      var r = nt(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 8, 8), r;
    }
  }
  Symbol.dispose && (De.prototype[Symbol.dispose] = De.prototype.free);
  const ht = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_exportedentity_free(t >>> 0, 1));
  class Me {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Me.prototype);
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
  Symbol.dispose && (Me.prototype[Symbol.dispose] = Me.prototype.free);
  const ft = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_replay_free(t >>> 0, 1));
  class Te {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Te.prototype);
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
    static from_attract(e) {
      const r = Ke(e, l.__wbindgen_malloc), s = fe, o = l.replay_from_attract(r, s);
      if (o[2]) throw Ge(o[1]);
      return Te.__wrap(o[0]);
    }
    send_past_ninjas() {
      l.replay_send_past_ninjas(this.__wbg_ptr);
    }
    set_input(e, r, s, o) {
      l.replay_set_input(this.__wbg_ptr, e, r, s, o);
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
      var s = nt(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 8, 8), s;
    }
    ninja_preview_bones(e) {
      const r = l.replay_ninja_preview_bones(this.__wbg_ptr, e);
      var s = nt(r[0], r[1]).slice();
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
  Symbol.dispose && (Te.prototype[Symbol.dispose] = Te.prototype.free);
  function Ir(t, e) {
    throw new Error(ye(t, e));
  }
  function Rr(t) {
    return Me.__wrap(t);
  }
  function Kr(t, e) {
    return ye(t, e);
  }
  function Gr() {
    const t = l.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const a = await Lr({
    "./ntools_rs_bg.js": {
      __wbg_exportedentity_new: Rr,
      __wbg___wbindgen_throw_b855445ff6a94295: Ir,
      __wbindgen_init_externref_table: Gr,
      __wbindgen_cast_2241b6af4c4b2941: Kr
    }
  }, Er), Ur = a.memory, Fr = a.__wbg_editor_free, qr = a.editor_new, Wr = a.editor_set_anim_data, Vr = a.editor_get_anim_state, Hr = a.editor_load_attract, Yr = a.editor_load_map, zr = a.editor_export_map, Zr = a.editor_get_level_name, Xr = a.editor_set_level_name, Jr = a.editor_to_replay, Qr = a.editor_mode, es = a.editor_tiles_path, ts = a.editor_selected_tiles_path, rs = a.editor_palette_center_x, ss = a.editor_palette_center_y, os = a.editor_palette_selection_x, ns = a.editor_palette_selection_y, is = a.editor_get_show_trail, _s = a.editor_set_show_trail, ls = a.editor_set_cursor_pos, as = a.editor_cursor_down, cs = a.editor_cursor_up, ds = a.editor_double_click, us = a.editor_tile_crosshair_col, ps = a.editor_tile_crosshair_row, hs = a.editor_crosshair_x, fs = a.editor_crosshair_y, gs = a.editor_entities, ys = a.editor_preview_entities, ws = a.editor_selected_tile_outline_path, ms = a.editor_show_half_grid, bs = a.editor_show_quarter_grid, xs = a.editor_undo, vs = a.editor_redo, ks = a.editor_press_escape, $s = a.editor_press_backtick, Ss = a.editor_press_1, Ds = a.editor_press_2, Ts = a.editor_press_3, Ps = a.editor_press_4, Es = a.editor_press_5, Ls = a.editor_press_6, As = a.editor_press_7, js = a.editor_press_8, Ms = a.editor_press_9, Ns = a.editor_press_0, Cs = a.editor_press_dash, Bs = a.editor_press_equals, Os = a.editor_press_q, Is = a.editor_press_w, Rs = a.editor_press_a, Ks = a.editor_press_s, Gs = a.editor_press_e, Us = a.editor_press_d, Fs = a.editor_press_z, qs = a.editor_press_x, Ws = a.editor_press_c, Vs = a.editor_press_t, Hs = a.editor_press_i, Ys = a.editor_press_o, zs = a.editor_press_p, Zs = a.editor_press_bracket_left, Xs = a.editor_press_bracket_right, Js = a.editor_press_f, Qs = a.editor_press_n, eo = a.editor_press_m, to = a.editor_press_comma, ro = a.editor_press_slash, so = a.editor_press_num_0, oo = a.editor_press_num_3, no = a.editor_press_num_7, io = a.editor_press_up, _o = a.editor_press_down, lo = a.editor_press_left, ao = a.editor_press_right, co = a.editor_press_enter, uo = a.editor_press_space, po = a.editor_press_alt_left, ho = a.editor_press_shift, fo = a.editor_release_q, go = a.editor_release_w, yo = a.editor_release_a, wo = a.editor_release_s, mo = a.editor_release_e, bo = a.editor_release_d, xo = a.editor_release_z, vo = a.editor_release_c, ko = a.editor_release_space, $o = a.editor_release_alt_left, So = a.editor_release_shift, Do = a.editor_receive_past_ninjas, To = a.editor_past_ninjas_len, Po = a.editor_past_ninja_x, Eo = a.editor_past_ninja_y, Lo = a.editor_past_ninja_bones, Ao = a.__wbg_exportedentity_free, jo = a.__wbg_get_exportedentity_type_int, Mo = a.__wbg_set_exportedentity_type_int, No = a.__wbg_get_exportedentity_x, Co = a.__wbg_set_exportedentity_x, Bo = a.__wbg_get_exportedentity_y, Oo = a.__wbg_set_exportedentity_y, Io = a.__wbg_get_exportedentity_deg, Ro = a.__wbg_set_exportedentity_deg, Ko = a.__wbg_get_exportedentity_switch_x, Go = a.__wbg_set_exportedentity_switch_x, Uo = a.__wbg_get_exportedentity_switch_y, Fo = a.__wbg_set_exportedentity_switch_y, qo = a.__wbg_replay_free, Wo = a.replay_from_attract, Vo = a.replay_send_past_ninjas, Ho = a.replay_set_input, Yo = a.replay_tick, zo = a.replay_seek, Zo = a.replay_seek_preview, Xo = a.replay_place_ninja, Jo = a.replay_replay_length, Qo = a.replay_progress, en = a.replay_progress_preview, tn = a.replay_tiles_path, rn = a.replay_ninja_x, sn = a.replay_ninja_y, on = a.replay_ninja_preview_x, nn = a.replay_ninja_preview_y, _n = a.replay_ninja_bones, ln = a.replay_ninja_preview_bones, an = a.replay_mines_len, cn = a.replay_mine_x, dn = a.replay_mine_y, un = a.replay_mine_state, pn = a.replay_bounce_blocks_len, hn = a.replay_bounce_block_x, fn = a.replay_bounce_block_y, gn = a.replay_bounce_block_deg, yn = a.replay_one_ways_len, wn = a.replay_one_way_x, mn = a.replay_one_way_y, bn = a.replay_one_way_deg, xn = a.replay_boost_pads_len, vn = a.replay_boost_pad_x, kn = a.replay_boost_pad_y, $n = a.replay_boost_pad_deg, Sn = a.replay_boost_pad_anim_progress, Dn = a.replay_exit_doors_len, Tn = a.replay_exit_door_x, Pn = a.replay_exit_door_y, En = a.replay_exit_anim_progress, Ln = a.replay_exit_switch_x, An = a.replay_exit_switch_y, jn = a.replay_thwumps_len, Mn = a.replay_thwump_x, Nn = a.replay_thwump_y, Cn = a.replay_thwump_deg, Bn = a.replay_launch_pads_len, On = a.replay_launch_pad_x, In = a.replay_launch_pad_y, Rn = a.replay_launch_pad_deg, Kn = a.replay_floor_guards_len, Gn = a.replay_floor_guard_x, Un = a.replay_floor_guard_y, Fn = a.replay_floor_guard_deg, qn = a.replay_locked_doors_len, Wn = a.replay_locked_door_x, Vn = a.replay_locked_door_y, Hn = a.replay_locked_door_deg, Yn = a.replay_locked_door_anim_progress, zn = a.replay_locked_switch_x, Zn = a.replay_locked_switch_y, Xn = a.replay_trap_doors_len, Jn = a.replay_trap_door_x, Qn = a.replay_trap_door_y, ei = a.replay_trap_door_deg, ti = a.replay_trap_door_anim_progress, ri = a.replay_trap_switch_x, si = a.replay_trap_switch_y, oi = a.replay_regular_doors_len, ni = a.replay_regular_door_x, ii = a.replay_regular_door_y, _i = a.replay_regular_door_deg, li = a.replay_regular_door_anim_progress, ai = a.replay_shove_thwumps_len, ci = a.replay_shove_thwump_x, di = a.replay_shove_thwump_y, ui = a.replay_shove_thwump_deg, pi = a.replay_shove_thwump_touch, hi = a.editor_press_y, fi = a.editor_press_u, gi = a.editor_press_h, yi = a.editor_press_j, wi = a.editor_press_k, mi = a.editor_press_l, bi = a.editor_press_num_1, xi = a.editor_press_num_2, vi = a.editor_press_num_4, ki = a.editor_press_num_5, $i = a.__wbindgen_externrefs, Si = a.__wbindgen_malloc, Di = a.__externref_table_dealloc, Ti = a.__wbindgen_free, Pi = a.__wbindgen_realloc, Ei = a.__externref_drop_slice, Rt = a.__wbindgen_start, Li = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: Ei,
    __externref_table_dealloc: Di,
    __wbg_editor_free: Fr,
    __wbg_exportedentity_free: Ao,
    __wbg_get_exportedentity_deg: Io,
    __wbg_get_exportedentity_switch_x: Ko,
    __wbg_get_exportedentity_switch_y: Uo,
    __wbg_get_exportedentity_type_int: jo,
    __wbg_get_exportedentity_x: No,
    __wbg_get_exportedentity_y: Bo,
    __wbg_replay_free: qo,
    __wbg_set_exportedentity_deg: Ro,
    __wbg_set_exportedentity_switch_x: Go,
    __wbg_set_exportedentity_switch_y: Fo,
    __wbg_set_exportedentity_type_int: Mo,
    __wbg_set_exportedentity_x: Co,
    __wbg_set_exportedentity_y: Oo,
    __wbindgen_externrefs: $i,
    __wbindgen_free: Ti,
    __wbindgen_malloc: Si,
    __wbindgen_realloc: Pi,
    __wbindgen_start: Rt,
    editor_crosshair_x: hs,
    editor_crosshair_y: fs,
    editor_cursor_down: as,
    editor_cursor_up: cs,
    editor_double_click: ds,
    editor_entities: gs,
    editor_export_map: zr,
    editor_get_anim_state: Vr,
    editor_get_level_name: Zr,
    editor_get_show_trail: is,
    editor_load_attract: Hr,
    editor_load_map: Yr,
    editor_mode: Qr,
    editor_new: qr,
    editor_palette_center_x: rs,
    editor_palette_center_y: ss,
    editor_palette_selection_x: os,
    editor_palette_selection_y: ns,
    editor_past_ninja_bones: Lo,
    editor_past_ninja_x: Po,
    editor_past_ninja_y: Eo,
    editor_past_ninjas_len: To,
    editor_press_0: Ns,
    editor_press_1: Ss,
    editor_press_2: Ds,
    editor_press_3: Ts,
    editor_press_4: Ps,
    editor_press_5: Es,
    editor_press_6: Ls,
    editor_press_7: As,
    editor_press_8: js,
    editor_press_9: Ms,
    editor_press_a: Rs,
    editor_press_alt_left: po,
    editor_press_backtick: $s,
    editor_press_bracket_left: Zs,
    editor_press_bracket_right: Xs,
    editor_press_c: Ws,
    editor_press_comma: to,
    editor_press_d: Us,
    editor_press_dash: Cs,
    editor_press_down: _o,
    editor_press_e: Gs,
    editor_press_enter: co,
    editor_press_equals: Bs,
    editor_press_escape: ks,
    editor_press_f: Js,
    editor_press_h: gi,
    editor_press_i: Hs,
    editor_press_j: yi,
    editor_press_k: wi,
    editor_press_l: mi,
    editor_press_left: lo,
    editor_press_m: eo,
    editor_press_n: Qs,
    editor_press_num_0: so,
    editor_press_num_1: bi,
    editor_press_num_2: xi,
    editor_press_num_3: oo,
    editor_press_num_4: vi,
    editor_press_num_5: ki,
    editor_press_num_7: no,
    editor_press_o: Ys,
    editor_press_p: zs,
    editor_press_q: Os,
    editor_press_right: ao,
    editor_press_s: Ks,
    editor_press_shift: ho,
    editor_press_slash: ro,
    editor_press_space: uo,
    editor_press_t: Vs,
    editor_press_u: fi,
    editor_press_up: io,
    editor_press_w: Is,
    editor_press_x: qs,
    editor_press_y: hi,
    editor_press_z: Fs,
    editor_preview_entities: ys,
    editor_receive_past_ninjas: Do,
    editor_redo: vs,
    editor_release_a: yo,
    editor_release_alt_left: $o,
    editor_release_c: vo,
    editor_release_d: bo,
    editor_release_e: mo,
    editor_release_q: fo,
    editor_release_s: wo,
    editor_release_shift: So,
    editor_release_space: ko,
    editor_release_w: go,
    editor_release_z: xo,
    editor_selected_tile_outline_path: ws,
    editor_selected_tiles_path: ts,
    editor_set_anim_data: Wr,
    editor_set_cursor_pos: ls,
    editor_set_level_name: Xr,
    editor_set_show_trail: _s,
    editor_show_half_grid: ms,
    editor_show_quarter_grid: bs,
    editor_tile_crosshair_col: us,
    editor_tile_crosshair_row: ps,
    editor_tiles_path: es,
    editor_to_replay: Jr,
    editor_undo: xs,
    memory: Ur,
    replay_boost_pad_anim_progress: Sn,
    replay_boost_pad_deg: $n,
    replay_boost_pad_x: vn,
    replay_boost_pad_y: kn,
    replay_boost_pads_len: xn,
    replay_bounce_block_deg: gn,
    replay_bounce_block_x: hn,
    replay_bounce_block_y: fn,
    replay_bounce_blocks_len: pn,
    replay_exit_anim_progress: En,
    replay_exit_door_x: Tn,
    replay_exit_door_y: Pn,
    replay_exit_doors_len: Dn,
    replay_exit_switch_x: Ln,
    replay_exit_switch_y: An,
    replay_floor_guard_deg: Fn,
    replay_floor_guard_x: Gn,
    replay_floor_guard_y: Un,
    replay_floor_guards_len: Kn,
    replay_from_attract: Wo,
    replay_launch_pad_deg: Rn,
    replay_launch_pad_x: On,
    replay_launch_pad_y: In,
    replay_launch_pads_len: Bn,
    replay_locked_door_anim_progress: Yn,
    replay_locked_door_deg: Hn,
    replay_locked_door_x: Wn,
    replay_locked_door_y: Vn,
    replay_locked_doors_len: qn,
    replay_locked_switch_x: zn,
    replay_locked_switch_y: Zn,
    replay_mine_state: un,
    replay_mine_x: cn,
    replay_mine_y: dn,
    replay_mines_len: an,
    replay_ninja_bones: _n,
    replay_ninja_preview_bones: ln,
    replay_ninja_preview_x: on,
    replay_ninja_preview_y: nn,
    replay_ninja_x: rn,
    replay_ninja_y: sn,
    replay_one_way_deg: bn,
    replay_one_way_x: wn,
    replay_one_way_y: mn,
    replay_one_ways_len: yn,
    replay_place_ninja: Xo,
    replay_progress: Qo,
    replay_progress_preview: en,
    replay_regular_door_anim_progress: li,
    replay_regular_door_deg: _i,
    replay_regular_door_x: ni,
    replay_regular_door_y: ii,
    replay_regular_doors_len: oi,
    replay_replay_length: Jo,
    replay_seek: zo,
    replay_seek_preview: Zo,
    replay_send_past_ninjas: Vo,
    replay_set_input: Ho,
    replay_shove_thwump_deg: ui,
    replay_shove_thwump_touch: pi,
    replay_shove_thwump_x: ci,
    replay_shove_thwump_y: di,
    replay_shove_thwumps_len: ai,
    replay_thwump_deg: Cn,
    replay_thwump_x: Mn,
    replay_thwump_y: Nn,
    replay_thwumps_len: jn,
    replay_tick: Yo,
    replay_tiles_path: tn,
    replay_trap_door_anim_progress: ti,
    replay_trap_door_deg: ei,
    replay_trap_door_x: Jn,
    replay_trap_door_y: Qn,
    replay_trap_doors_len: Xn,
    replay_trap_switch_x: ri,
    replay_trap_switch_y: si
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  Ar(Li);
  Rt();
  function Ai({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var ji = v("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const Mi = [
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
  function Ye(t) {
    function e() {
      const r = t.bones();
      return r ? Mi.map(([s, o]) => `M ${20 * r[s]} ${20 * r[s + 13]} ${20 * r[o]} ${20 * r[o + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = ji();
      return T((s) => {
        var o = t.class, i = Ai(t.ninja()), _ = e();
        return o !== s.e && y(r, "class", s.e = o), i !== s.t && y(r, "transform", s.t = i), _ !== s.a && y(r, "d", s.a = _), s;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var Ni = v("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), Ci = v("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function Bi(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function Oi(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Ii([t, e], r, s) {
    const o = t(), i = r.exit_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.exit_door_x(n),
        y: r.exit_door_y(n),
        animProgress: r.exit_anim_progress(n, s)
      };
      c && Bi(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Kt(t) {
    const [e] = t.exitDoors;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => u(Ri, {
        exitDoor: r
      })
    });
  }
  const V = 11, K = 2.5;
  function Ri(t) {
    return (() => {
      var e = Ni(), r = e.firstChild, s = r.nextSibling, o = s.nextSibling, i = o.nextSibling, _ = i.nextSibling;
      return T((n) => {
        var c = Oi(t.exitDoor), p = -13 + 4 * (1 - t.exitDoor().animProgress), m = 26 - 8 * (1 - t.exitDoor().animProgress), h = `M ${-13 * t.exitDoor().animProgress} 0 v ${-V} h ${-V + K} l ${-K} ${K} v ${2 * (V - K)} l ${K} ${K} h ${V - K} z`, E = `M ${13 * t.exitDoor().animProgress} 0 v ${-V} h ${V - K} l ${K} ${K} v ${2 * (V - K)} l ${-K} ${K} h ${-V + K} z`, P = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * V} v ${t.exitDoor().animProgress * V} h ${-V + K + t.exitDoor().animProgress} l ${-K} ${-K} v ${(1 - t.exitDoor().animProgress) * (-V + K)}`, N = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * V} v ${t.exitDoor().animProgress * V} h ${V - K - t.exitDoor().animProgress} l ${K} ${-K} v ${(1 - t.exitDoor().animProgress) * (-V + K)}`;
        return c !== n.e && y(e, "transform", n.e = c), p !== n.t && y(r, "x", n.t = p), m !== n.a && y(r, "width", n.a = m), h !== n.o && y(s, "d", n.o = h), E !== n.i && y(o, "d", n.i = E), P !== n.n && y(i, "d", n.n = P), N !== n.s && y(_, "d", n.s = N), n;
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
  function Ki() {
    return Ci();
  }
  var Gi = v('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function Ui(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function Fi(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function qi([t, e], r, s) {
    const o = t(), i = r.exit_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.exit_switch_x(n),
        y: r.exit_switch_y(n),
        animProgress: r.exit_anim_progress(n, s)
      };
      c && Ui(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Gt(t) {
    return u(z, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => u(Wi, {
        exitSwitch: e
      })
    });
  }
  const he = 2;
  function Wi(t) {
    return (() => {
      var e = Gi(), r = e.firstChild, s = r.nextSibling, o = s.nextSibling;
      return T((i) => {
        var _ = Fi(t.exitSwitch), n = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, p = `M ${-2 * t.exitSwitch().animProgress} ${-he} h ${-he} v ${2 * he} h ${he}`, m = `M ${2 * t.exitSwitch().animProgress} ${-he} h ${he} v ${2 * he} h ${-he}`;
        return _ !== i.e && y(e, "transform", i.e = _), n !== i.t && y(r, "fill", i.t = n), c !== i.a && y(r, "stroke", i.a = c), p !== i.o && y(s, "d", i.o = p), m !== i.i && y(o, "d", i.i = m), i;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), e;
    })();
  }
  var Vi = v("<svg><use href=#one-way></svg>", false, true, false), Hi = v("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function Yi(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function zi(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Zi([t, e], r) {
    const s = t(), o = r.one_ways_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.one_way_x(_),
        y: r.one_way_y(_),
        deg: r.one_way_deg(_)
      };
      n && Yi(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function Ut(t) {
    const [e] = t.oneWays;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = Vi();
        return T(() => y(s, "transform", zi(r))), s;
      })()
    });
  }
  function Ft() {
    return (() => {
      var t = Hi(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var Xi = v("<svg><use></svg>", false, true, false), Ji = v("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), Qi = v("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), e_ = v("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const t_ = 0, r_ = 1;
  function s_(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function o_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function n_([t, e], r) {
    const s = t(), o = r.mines_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.mine_x(_),
        y: r.mine_y(_),
        type: r.mine_state(_)
      };
      n && s_(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function qt(t) {
    const [e] = t.mines;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = Xi();
        return T((o) => {
          var i = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][r().type], _ = o_(r);
          return i !== o.e && y(s, "href", o.e = i), _ !== o.t && y(s, "transform", o.t = _), o;
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
        var t = Ji(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, o = s.nextSibling, i = o.nextSibling;
        return i.nextSibling, t;
      })(),
      (() => {
        var t = Qi();
        return t.firstChild, t;
      })(),
      (() => {
        var t = e_();
        return t.firstChild, t;
      })()
    ];
  }
  var i_ = v("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), __ = v("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), l_ = v("<svg><g class=regular-door></svg>", false, true, false);
  function a_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function c_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function d_([t, e], r, s) {
    const o = t(), i = r.regular_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.regular_door_x(n),
        y: r.regular_door_y(n),
        deg: r.regular_door_deg(n),
        animProgress: r.regular_door_anim_progress(n, s)
      };
      c && a_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Vt(t) {
    const [e] = t.regularDoors;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => u(h_, {
        regularDoor: r
      })
    });
  }
  const u_ = 1, p_ = 12 - u_;
  function h_(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (p_ - 0) * r;
    }
    return (() => {
      var r = l_();
      return x(r, u(U, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var s = i_();
              return T(() => y(s, "x2", -e())), s;
            })(),
            (() => {
              var s = __();
              return T(() => y(s, "x2", e())), s;
            })()
          ];
        }
      })), T(() => y(r, "transform", c_(t.regularDoor))), r;
    })();
  }
  var f_ = v("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), g_ = v("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), gt = v("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), y_ = v("<svg><g class=locked-door></svg>", false, true, false);
  function w_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function m_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function b_([t, e], r, s) {
    const o = t(), i = r.locked_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.locked_door_x(n),
        y: r.locked_door_y(n),
        deg: r.locked_door_deg(n),
        animProgress: r.locked_door_anim_progress(n, s)
      };
      c && w_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Ht(t) {
    const [e] = t.lockedDoors;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => u(k_, {
        lockedDoor: r
      })
    });
  }
  const x_ = 1, v_ = 12 - x_;
  function k_(t) {
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
      return o = Math.min(Math.max((o - 0.4) / 0.6, 0), 1), 0 + (v_ - 0) * o;
    }
    return (() => {
      var o = y_();
      return x(o, u(U, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var i = f_();
              return T(() => y(i, "x2", -s())), i;
            })(),
            (() => {
              var i = g_();
              return T(() => y(i, "x2", s())), i;
            })()
          ];
        }
      }), null), x(o, u(U, {
        get when() {
          return t.lockedDoor().animProgress < 0.5;
        },
        get children() {
          return [
            (() => {
              var i = gt();
              return T((_) => {
                var n = e(), c = r();
                return n !== _.e && y(i, "x1", _.e = n), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = gt();
              return T((_) => {
                var n = -e(), c = -r();
                return n !== _.e && y(i, "x1", _.e = n), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      }), null), T(() => y(o, "transform", m_(t.lockedDoor))), o;
    })();
  }
  var $_ = v("<svg><use></svg>", false, true, false), S_ = v("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), D_ = v("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function T_(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function P_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function E_([t, e], r) {
    const s = t(), o = r.locked_doors_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.locked_switch_x(_),
        y: r.locked_switch_y(_),
        wasTouched: r.locked_door_anim_progress(_, 1) >= 0
      };
      n && T_(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function Yt(t) {
    const [e] = t.lockedSwitches;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = $_();
        return T((o) => {
          var i = r().wasTouched ? "#locked-switch-touched" : "#locked-switch", _ = P_(r);
          return i !== o.e && y(s, "href", o.e = i), _ !== o.t && y(s, "transform", o.t = _), o;
        }, {
          e: void 0,
          t: void 0
        }), s;
      })()
    });
  }
  function zt() {
    return [
      (() => {
        var t = S_(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = D_(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var L_ = v("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), yt = v("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), A_ = v("<svg><g></svg>", false, true, false);
  function j_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function M_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function N_([t, e], r, s) {
    const o = t(), i = r.trap_doors_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.trap_door_x(n),
        y: r.trap_door_y(n),
        deg: r.trap_door_deg(n),
        animProgress: r.trap_door_anim_progress(n, s)
      };
      c && j_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function Zt(t) {
    const [e] = t.trapDoors;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => u(O_, {
        trapDoor: r
      })
    });
  }
  const C_ = 1, B_ = 12 - C_;
  function O_(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function s() {
      let o = t.trapDoor().animProgress;
      return 0 + (B_ - 0) * o;
    }
    return (() => {
      var o = A_();
      return x(o, u(U, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var i = L_();
              return T((_) => {
                var n = -s(), c = s();
                return n !== _.e && y(i, "x1", _.e = n), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = yt();
              return T((_) => {
                var n = e(), c = r();
                return n !== _.e && y(i, "x1", _.e = n), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = yt();
              return T((_) => {
                var n = -e(), c = -r();
                return n !== _.e && y(i, "x1", _.e = n), c !== _.t && y(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      })), T(() => y(o, "transform", M_(t.trapDoor))), o;
    })();
  }
  var I_ = v("<svg><use></svg>", false, true, false), R_ = v("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), K_ = v("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function G_(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function U_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function F_([t, e], r) {
    const s = t(), o = r.trap_doors_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.trap_switch_x(_),
        y: r.trap_switch_y(_),
        wasTouched: r.trap_door_anim_progress(_, 1) >= 0
      };
      n && G_(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function Xt(t) {
    const [e] = t.trapSwitches;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = I_();
        return T((o) => {
          var i = r().wasTouched ? "#trap-switch-touched" : "#trap-switch", _ = U_(r);
          return i !== o.e && y(s, "href", o.e = i), _ !== o.t && y(s, "transform", o.t = _), o;
        }, {
          e: void 0,
          t: void 0
        }), s;
      })()
    });
  }
  function Jt() {
    return [
      (() => {
        var t = R_();
        return t.firstChild, t;
      })(),
      (() => {
        var t = K_(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var q_ = v("<svg><g class=launch-pad><rect x=0 y=-7.5 width=1.5 height=15></rect><line stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function W_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function V_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function H_([t, e], r) {
    const s = t(), o = r.launch_pads_len(), i = [];
    for (let _ = 0; _ < o; _++) {
      const n = s.at(_), c = {
        x: r.launch_pad_x(_),
        y: r.launch_pad_y(_),
        deg: r.launch_pad_deg(_)
      };
      n && W_(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function Qt(t) {
    const [e] = t.launchPads;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => u(Y_, {
        launchPad: r
      })
    });
  }
  function Y_(t) {
    return (() => {
      var e = q_(), r = e.firstChild;
      return r.nextSibling, T(() => y(e, "transform", V_(t.launchPad))), e;
    })();
  }
  var z_ = v('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function Z_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function X_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function J_([t, e], r, s) {
    const o = t(), i = r.floor_guards_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.floor_guard_x(n, s),
        y: r.floor_guard_y(n, s),
        deg: r.floor_guard_deg(n)
      };
      c && Z_(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function er(t) {
    const [e] = t.floorGuards;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => u(Q_, {
        floorGuard: r
      })
    });
  }
  function Q_(t) {
    return (() => {
      var e = z_();
      return e.firstChild, T(() => y(e, "transform", X_(t.floorGuard))), e;
    })();
  }
  var el = v("<svg><use href=#bounceblock></svg>", false, true, false), tl = v('<svg><g id=bounceblock><path id=bounceblockFill d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path id=bounceblockStroke d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function rl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function sl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ol([t, e], r, s) {
    const o = t(), i = r.bounce_blocks_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.bounce_block_x(n, s),
        y: r.bounce_block_y(n, s),
        deg: r.bounce_block_deg(n)
      };
      c && rl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function tr(t) {
    const [e] = t.bounceBlocks;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = el();
        return T(() => y(s, "transform", sl(r))), s;
      })()
    });
  }
  function rr() {
    return (() => {
      var t = tl(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var nl = v("<svg><use href=#boostpad></svg>", false, true, false), il = v("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function _l(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function ll(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function al([t, e], r, s) {
    const o = t(), i = r.boost_pads_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.boost_pad_x(n),
        y: r.boost_pad_y(n),
        deg: r.boost_pad_deg(n, s),
        animProgress: r.boost_pad_anim_progress(n, s)
      };
      c && _l(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function sr(t) {
    const [e] = t.boostPads;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = nl();
        return T((o) => {
          var i = `color-mix(in srgb-linear, var(--boost-pad) ${r().animProgress * 100}%, var(--boost-pad-wooshing))`, _ = ll(r);
          return i !== o.e && y(s, "stroke", o.e = i), _ !== o.t && y(s, "transform", o.t = _), o;
        }, {
          e: void 0,
          t: void 0
        }), s;
      })()
    });
  }
  function or() {
    return (() => {
      var t = il(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, o = s.nextSibling;
      return o.nextSibling, t;
    })();
  }
  var cl = v("<svg><use href=#thwump></svg>", false, true, false), dl = v('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function ul(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function pl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function hl([t, e], r, s) {
    const o = t(), i = r.thwumps_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.thwump_x(n, s),
        y: r.thwump_y(n, s),
        deg: r.thwump_deg(n)
      };
      c && ul(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function nr(t) {
    const [e] = t.thwumps;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = cl();
        return T(() => y(s, "transform", pl(r))), s;
      })()
    });
  }
  function ir() {
    return (() => {
      var t = dl(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var fl = v("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), gl = v("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function yl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function wl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ml([t, e], r, s) {
    const o = t(), i = r.shove_thwumps_len(), _ = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.shove_thwump_x(n, s),
        y: r.shove_thwump_y(n, s),
        deg: r.shove_thwump_deg(n),
        touch: r.shove_thwump_touch(n)
      };
      c && yl(c, p) ? _.push(c) : _.push(p);
    }
    e(_);
  }
  function _r(t) {
    const [e] = t.shoveThwumps;
    return u(z, {
      get each() {
        return e();
      },
      children: (r) => u(bl, {
        shoveThwump: r
      })
    });
  }
  function bl(t) {
    return (() => {
      var e = fl(), r = e.firstChild;
      return x(e, u(_t, {
        each: [
          0,
          2,
          4,
          6
        ],
        children: (s) => u(U, {
          get when() {
            return t.shoveThwump().touch >= 16 || s === t.shoveThwump().touch;
          },
          get children() {
            var o = gl(), i = o.firstChild, _ = i.nextSibling;
            return _.nextSibling, y(o, "transform", `rotate(${45 * s},0,0)`), o;
          }
        })
      }), r), T(() => y(e, "transform", wl(t.shoveThwump))), e;
    })();
  }
  const lr = ar((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function xl(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function vl(t) {
    const e = String.fromCharCode(...t);
    console.log("anim data length", t.byteLength), localStorage.setItem("animData", e);
  }
  function kl(t) {
    const e = localStorage.getItem("animData");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.set_anim_data(r);
    }
  }
  const $l = ar(Sl, 1e3);
  function Sl(t) {
    const e = JSON.stringify(t);
    localStorage.setItem("palette", e);
  }
  function Dl() {
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
  const Tl = "" + new URL("palette-CZVUb4uS.png", import.meta.url).href, cr = [
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
  }, Pl = {
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
  }, El = (() => {
    const t = {};
    for (const e of wt) {
      t[e] = 0;
      for (const r of wt) mt[r] < mt[e] && (t[e] += Pl[r]);
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
  ], Ll = {
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
  async function Al() {
    const e = await (await fetch(Tl)).blob(), r = await createImageBitmap(e), s = document.createElement("canvas");
    s.width = r.width, s.height = r.height;
    const o = s.getContext("2d");
    o.drawImage(r, 0, 0), ur = o;
  }
  function jl(t) {
    const e = ur, r = cr.indexOf(t);
    if (!e || r < 0) return;
    const s = {};
    for (const o of dr) {
      const { file: i, index: _ } = Ll[o], n = El[i] + _, c = e.getImageData(n, r, 1, 1).data, p = `rgb(${c[0]} ${c[1]} ${c[2]})`;
      s[o] = p;
    }
    return s;
  }
  function Ml(t) {
    for (const e of dr) document.body.style.setProperty(e, t[e]);
  }
  var Nl = v('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox></label> | Object corners <select><option>square</option><option>rounded</option></select> | <select></select><input type=text style=float:right>'), Cl = v("<option>");
  function Bl(t) {
    return (() => {
      var e = Nl(), r = e.firstChild, s = r.firstChild, o = s.nextSibling, i = r.nextSibling, _ = i.nextSibling, n = _.nextSibling, c = n.nextSibling, p = c.firstChild, m = p.nextSibling, h = c.nextSibling, E = h.nextSibling, P = E.firstChild, N = P.nextSibling, C = E.nextSibling, A = C.nextSibling, O = A.nextSibling;
      return o.addEventListener("change", function() {
        const S = this.files;
        if (S && S.length > 0) {
          const D = new FileReader();
          D.onloadend = () => {
            D.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(D.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, D.readAsArrayBuffer(S[0]);
        }
      }), _.$$click = function() {
        const S = t.editor.export_map(), D = new Blob([
          S.buffer
        ], {
          type: "application/octet-stream"
        }), k = URL.createObjectURL(D);
        this.href = k, this.download = t.editor.get_level_name().replaceAll(/[^a-z]/gi, "_"), setTimeout(() => URL.revokeObjectURL(k), 100);
      }, m.addEventListener("change", (S) => {
        t.setShowTrail(S.currentTarget.checked), t.editor.set_show_trail(S.currentTarget.checked);
      }), E.addEventListener("change", (S) => t.setRoundCorners(S.currentTarget.value == "rounded")), A.addEventListener("change", (S) => {
        const D = jl(S.currentTarget.value);
        D && t.setPalette({
          name: S.currentTarget.value,
          colors: D
        });
      }), x(A, () => cr.map((S) => (() => {
        var D = Cl();
        return x(D, S), T(() => {
          var _a2;
          return D.selected = S === (((_a2 = t.palette()) == null ? void 0 : _a2.name) ?? "vasquez");
        }), D;
      })())), O.addEventListener("change", () => lr(t.editor)), O.$$input = (S) => {
        t.editor.set_level_name(S.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, T((S) => {
        var D = !t.roundCorners(), k = t.roundCorners();
        return D !== S.e && (P.selected = S.e = D), k !== S.t && (N.selected = S.t = k), S;
      }, {
        e: void 0,
        t: void 0
      }), T(() => m.checked = t.showTrail()), T(() => O.value = t.levelName()), e;
    })();
  }
  Ze([
    "click",
    "input"
  ]);
  var Ol = v('<svg><rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"width=150 height=150 style=mix-blend-mode:hard-light></svg>', false, true, false), Il = v("<svg><circle fill=none stroke=var(--entity-palette-reticle) r=16></svg>", false, true, false), Rl = v('<svg><path d="M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12"fill-rule=evenodd fill="color-mix(in srgb,var(--background) 18%,white 15%)"style=mix-blend-mode:hard-light></svg>', false, true, false), Kl = v("<svg><rect fill=none stroke=var(--editor-crosshair) stroke-width=2 width=26 height=26></svg>", false, true, false), Gl = v("<svg><use href=#tilemode-crosshair></svg>", false, true, false), Ul = v("<svg><use href=#crosshair></svg>", false, true, false), Fl = v("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), ql = v('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none>'), bt = v("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), xt = v("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), Wl = v("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), Vl = v("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), Hl = v("<svg><line class=door-switch-line></svg>", false, true, false);
  const Qe = 42, et = 23, vt = 0, kt = 1, Yl = 3, $t = 5, zl = 6, St = 7, Zl = 8, tt = 9, Xl = 0, Jl = 1, Ql = 3, ea = 5, ta = 6, ra = 8, sa = 10, oa = 11, na = 16, ia = 17, _a = 20, la = 21, aa = 24, ca = 28, da = new Float64Array([
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
  ]), ua = new Float64Array([
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
    const [t, e] = b([]), [r, s] = b([]), [o, i] = b([]), [_, n] = b([]), [c, p] = b([]), [m, h] = b([]), [E, P] = b([]), [N, C] = b([]), [A, O] = b([]), [S, D] = b([]), [k, M] = b([]), [Z, q] = b([]), [se, de] = b([]), [ee, oe] = b([]), [_e, ue] = b([]), [j, Y] = b([]);
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
      setRegularDoors: p,
      lockedDoors: m,
      setLockedDoors: h,
      lockedSwitches: E,
      setLockedSwitches: P,
      trapDoors: N,
      setTrapDoors: C,
      trapSwitches: A,
      setTrapSwitches: O,
      launchPads: S,
      setLaunchPads: D,
      oneWays: k,
      setOneWays: M,
      floorGuards: Z,
      setFloorGuards: q,
      bounceBlocks: se,
      setBounceBlocks: de,
      thwumps: ee,
      setThwumps: oe,
      boostPads: _e,
      setBoostPads: ue,
      shoveThwumps: j,
      setShoveThwumps: Y
    };
  }
  function Pt(t, e, r, s) {
    const o = [], i = [], _ = [], n = [], c = [], p = [], m = [], h = [], E = [], P = [], N = [], C = [], A = [], O = [], S = [], D = [];
    for (const k of r) {
      const M = {
        x: k.x,
        y: k.y,
        deg: k.deg,
        animProgress: 0
      }, Z = {
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
      k.type_int === Xl ? o.push(M) : k.type_int === Jl ? i.push({
        ...M,
        type: t_
      }) : k.type_int === la ? i.push({
        ...M,
        type: r_
      }) : k.type_int === Ql ? (_.push(M), Number.isNaN(k.switch_x) || (n.push(Z), e.push(q))) : k.type_int === ea ? c.push(M) : k.type_int === ta ? (p.push(M), Number.isNaN(k.switch_x) || (m.push(Z), e.push(q))) : k.type_int === ra ? (h.push({
        ...M,
        animProgress: s ? 1 : -1
      }), Number.isNaN(k.switch_x) || (E.push(Z), e.push(q))) : k.type_int === sa ? P.push(M) : k.type_int === oa ? N.push(M) : k.type_int === na ? C.push(M) : k.type_int === ia ? A.push(M) : k.type_int === _a ? O.push(M) : k.type_int === aa ? S.push({
        ...M,
        animProgress: 1
      }) : k.type_int === ca && D.push({
        ...M,
        touch: 16
      }), k.free();
    }
    t.setNinjas(o), t.setMines(i), t.setExitDoors(_), t.setExitSwitches(n), t.setRegularDoors(c), t.setLockedDoors(p), t.setLockedSwitches(m), t.setTrapDoors(h), t.setTrapSwitches(E), t.setLaunchPads(P), t.setOneWays(N), t.setFloorGuards(C), t.setBounceBlocks(A), t.setThwumps(O), t.setBoostPads(S), t.setShoveThwumps(D);
  }
  function Et({ entities: t }) {
    return [
      u(Kt, {
        get exitDoors() {
          return [
            t.exitDoors,
            () => {
            }
          ];
        }
      }),
      u(Ut, {
        get oneWays() {
          return [
            t.oneWays,
            () => {
            }
          ];
        }
      }),
      u(qt, {
        get mines() {
          return [
            t.mines,
            () => {
            }
          ];
        }
      }),
      u(Vt, {
        get regularDoors() {
          return [
            t.regularDoors,
            () => {
            }
          ];
        }
      }),
      u(Zt, {
        get trapDoors() {
          return [
            t.trapDoors,
            () => {
            }
          ];
        }
      }),
      u(Ht, {
        get lockedDoors() {
          return [
            t.lockedDoors,
            () => {
            }
          ];
        }
      }),
      u(Yt, {
        get lockedSwitches() {
          return [
            t.lockedSwitches,
            () => {
            }
          ];
        }
      }),
      u(Xt, {
        get trapSwitches() {
          return [
            t.trapSwitches,
            () => {
            }
          ];
        }
      }),
      u(Gt, {
        get exitSwitches() {
          return t.exitSwitches;
        }
      }),
      u(Qt, {
        get launchPads() {
          return [
            t.launchPads,
            () => {
            }
          ];
        }
      }),
      u(er, {
        get floorGuards() {
          return [
            t.floorGuards,
            () => {
            }
          ];
        }
      }),
      u(nr, {
        get thwumps() {
          return [
            t.thwumps,
            () => {
            }
          ];
        }
      }),
      u(_t, {
        get each() {
          return t.ninjas();
        },
        children: (e) => u(Ye, {
          class: "ninja",
          ninja: () => e,
          bones: () => da
        })
      }),
      u(tr, {
        get bounceBlocks() {
          return [
            t.bounceBlocks,
            () => {
            }
          ];
        }
      }),
      u(_r, {
        get shoveThwumps() {
          return [
            t.shoveThwumps,
            () => {
            }
          ];
        }
      }),
      u(sr, {
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
  function pa(t) {
    const { editor: e, pastNinjas: r } = t, [s, o] = b(""), [i, _] = b(""), [n, c] = b(true), [p, m] = b(false), [h, E] = b(vt), [P, N] = b({
      row: 1,
      col: 1
    }), [C, A] = b({
      x: 24,
      y: 24
    }), [O, S] = b(""), [D, k] = b({
      x: NaN,
      y: NaN
    }), [M, Z] = b({
      x: NaN,
      y: NaN
    }), q = Tt(), se = Tt(), [de, ee] = b([]), [oe, _e] = b(e.get_show_trail()), [ue, j] = b(), Y = (d) => {
      let f = false;
      if (!(d.target instanceof HTMLInputElement || d.target instanceof HTMLSelectElement)) {
        if (d.ctrlKey || d.metaKey) {
          d.code === "KeyZ" && (d.ctrlKey || d.metaKey) && d.shiftKey ? (f = true, e.redo()) : d.code === "KeyZ" && (d.ctrlKey || d.metaKey) ? (f = true, e.undo()) : d.code === "KeyY" && (d.ctrlKey || d.metaKey) && (f = true, e.redo()), f && (W(true), d.preventDefault());
          return;
        }
        d.shiftKey && (f = true, e.press_shift()), d.code === "Enter" && e.mode() === tt ? t.setReplay(e.to_replay(t.roundCorners())) : d.code === "Backquote" ? (f = true, e.press_backtick()) : d.code === "Digit1" ? (f = true, e.press_1(d.shiftKey)) : d.code === "Digit2" ? (f = true, e.press_2(d.shiftKey)) : d.code === "Digit3" ? (f = true, e.press_3(d.shiftKey)) : d.code === "Digit4" ? (f = true, e.press_4(d.shiftKey)) : d.code === "Digit5" ? (f = true, e.press_5(d.shiftKey)) : d.code === "Digit6" ? (f = true, e.press_6(d.shiftKey)) : d.code === "Digit7" ? (f = true, e.press_7(d.shiftKey)) : d.code === "Digit8" ? (f = true, e.press_8(d.shiftKey)) : d.code === "Digit9" ? (f = true, e.press_9()) : d.code === "Digit0" ? (f = true, e.press_0()) : d.code === "Minus" ? (f = true, e.press_dash()) : d.code === "Equal" ? (f = true, e.press_equals()) : d.code === "KeyQ" ? (f = true, e.press_q(d.shiftKey)) : d.code === "KeyW" ? (f = true, e.press_w(d.shiftKey)) : d.code === "KeyA" ? (f = true, e.press_a(d.shiftKey)) : d.code === "KeyS" ? (f = true, e.press_s(d.shiftKey)) : d.code === "KeyE" ? (f = true, e.press_e()) : d.code === "KeyD" ? (f = true, e.press_d()) : d.code === "KeyZ" ? (f = true, e.press_z()) : d.code === "KeyX" ? (f = true, e.press_x()) : d.code === "KeyC" ? (f = true, e.press_c()) : d.code === "Space" ? (f = true, e.press_space()) : d.code === "AltLeft" ? (f = true, e.press_alt_left(d.shiftKey)) : d.code === "KeyT" ? (f = true, e.press_t()) : d.code === "KeyY" ? (f = true, e.press_y()) : d.code === "KeyU" ? (f = true, e.press_u()) : d.code === "KeyI" ? (f = true, e.press_i()) : d.code === "KeyO" ? (f = true, e.press_o()) : d.code === "KeyP" ? (f = true, e.press_p()) : d.code === "BracketLeft" ? (f = true, e.press_bracket_left()) : d.code === "BracketRight" ? (f = true, e.press_bracket_right()) : d.code === "KeyF" ? (f = true, e.press_f()) : d.code === "KeyH" ? (f = true, e.press_h()) : d.code === "KeyJ" ? (f = true, e.press_j()) : d.code === "KeyK" ? (f = true, e.press_k()) : d.code === "KeyL" ? (f = true, e.press_l()) : d.code === "KeyN" ? (f = true, e.press_n()) : d.code === "KeyM" ? (f = true, e.press_m()) : d.code === "Comma" ? (f = true, e.press_comma()) : d.code === "ArrowUp" ? (f = true, e.press_up(d.shiftKey)) : d.code === "ArrowDown" ? (f = true, e.press_down(d.shiftKey)) : d.code === "ArrowLeft" ? (f = true, e.press_left(d.shiftKey)) : d.code === "ArrowRight" ? (f = true, e.press_right(d.shiftKey)) : d.code === "Enter" ? (f = true, e.press_enter()) : d.code === "Escape" ? f = e.press_escape() : d.code === "Slash" && (f = true, e.press_slash()), f && (W(true), d.preventDefault());
      }
    }, X = (d) => {
      let f = false;
      d.shiftKey || (f = true, e.release_shift()), d.code === "KeyQ" ? (f = true, e.release_q()) : d.code === "KeyW" ? (f = true, e.release_w()) : d.code === "KeyA" ? (f = true, e.release_a()) : d.code === "KeyS" ? (f = true, e.release_s()) : d.code === "KeyE" ? (f = true, e.release_e()) : d.code === "KeyD" ? (f = true, e.release_d()) : d.code === "KeyZ" ? (f = true, e.release_z()) : d.code === "KeyC" ? (f = true, e.release_c()) : d.code === "Space" ? (f = true, e.release_space()) : d.code === "AltLeft" && (f = true, e.release_alt_left()), f && (W(false), d.preventDefault());
    };
    document.addEventListener("keydown", Y), document.addEventListener("keyup", X), we(() => {
      document.removeEventListener("keydown", Y), document.removeEventListener("keyup", X);
    });
    function W(d) {
      E(e.mode()), o(e.tiles_path()), _(e.selected_tiles_path()), N({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), m(e.show_quarter_grid()), A({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const f = [];
      Pt(q, f, e.entities(), false), Pt(se, f, e.preview_entities(), true), ee(f), S(e.selected_tile_outline_path()), k({
        x: e.palette_center_x(),
        y: e.palette_center_y()
      }), Z({
        x: e.palette_selection_x(),
        y: e.palette_selection_y()
      }), j(e.past_ninja_bones()), d && lr(e);
    }
    const ne = [];
    for (let d = 0; d < Qe - 1; d++) ne.push(48 + 24 * d);
    const pe = [];
    for (let d = 0; d < et - 1; d++) pe.push(48 + 24 * d);
    const le = [];
    for (let d = 0; d < Qe; d++) le.push(36 + 24 * d);
    const Pe = [];
    for (let d = 0; d < et; d++) Pe.push(36 + 24 * d);
    const Ee = [];
    for (let d = 0; d < Qe * 2; d++) Ee.push(30 + 12 * d);
    const Le = [];
    for (let d = 0; d < et * 2; d++) Le.push(30 + 12 * d);
    return W(false), [
      (() => {
        var d = ql(), f = d.firstChild, me = f.firstChild, te = me.nextSibling;
        te.nextSibling;
        var ie = f.nextSibling, ae = ie.nextSibling, $ = ae.nextSibling, I = $.nextSibling, R = I.firstChild;
        return d.$$contextmenu = (g) => {
          e.press_escape() && (W(false), g.preventDefault());
        }, d.$$mouseup = () => {
          e.cursor_up(), W(false);
        }, d.$$dblclick = (g) => {
          e.double_click(g.shiftKey), W(false);
        }, d.$$mousedown = (g) => {
          g.buttons & 2 || (e.mode() === tt ? t.setReplay(e.to_replay(t.roundCorners())) : (e.cursor_down(g.shiftKey), W(true)));
        }, d.$$mousemove = function(g) {
          const { left: w, top: L, width: B, height: J } = this.getBoundingClientRect(), be = e.set_cursor_pos((g.clientX - w) / B * 1056, (g.clientY - L) / J * 600, g.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (g.clientX - w) / B * 1056,
            y: (g.clientY - L) / J * 600
          }), be && W(false);
        }, x(f, u(Wt, {}), te), x(f, u(Ft, {}), te), x(f, u(rr, {}), te), x(f, u(zt, {}), te), x(f, u(Jt, {}), te), x(f, u(or, {}), te), x(f, u(ir, {}), te), x(d, u(U, {
          get when() {
            return p();
          },
          get children() {
            return [
              ke(() => Ee.map((g) => (() => {
                var w = bt();
                return y(w, "x1", g), y(w, "x2", g), w;
              })())),
              ke(() => Le.map((g) => (() => {
                var w = xt();
                return y(w, "y1", g), y(w, "y2", g), w;
              })()))
            ];
          }
        }), ie), x(d, u(U, {
          get when() {
            return n();
          },
          get children() {
            return [
              ke(() => le.map((g) => (() => {
                var w = bt();
                return y(w, "x1", g), y(w, "x2", g), w;
              })())),
              ke(() => Pe.map((g) => (() => {
                var w = xt();
                return y(w, "y1", g), y(w, "y2", g), w;
              })()))
            ];
          }
        }), ie), x(d, () => ne.map((g) => (() => {
          var w = Wl();
          return y(w, "x1", g), y(w, "x2", g), w;
        })()), ie), x(d, () => pe.map((g) => (() => {
          var w = Vl();
          return y(w, "y1", g), y(w, "y2", g), w;
        })()), ie), x(d, u(Et, {
          entities: q
        }), ie), x(d, u(U, {
          get when() {
            return h() === St;
          },
          get children() {
            var g = Ol();
            return T((w) => {
              var L = D().x - Dt / 2, B = D().y - Dt / 2;
              return L !== w.e && y(g, "x", w.e = L), B !== w.t && y(g, "y", w.t = B), w;
            }, {
              e: void 0,
              t: void 0
            }), g;
          }
        }), ae), x(ae, u(Et, {
          entities: se
        })), x(d, u(U, {
          get when() {
            return h() === St;
          },
          get children() {
            var g = Il();
            return T((w) => {
              var L = M().x, B = M().y;
              return L !== w.e && y(g, "cx", w.e = L), B !== w.t && y(g, "cy", w.t = B), w;
            }, {
              e: void 0,
              t: void 0
            }), g;
          }
        }), $), x(d, u(U, {
          get when() {
            return h() === kt;
          },
          get children() {
            var g = Rl();
            return T(() => y(g, "transform", `translate(${D().x},${D().y})`)), g;
          }
        }), $), x(d, u(U, {
          get when() {
            return h() === kt;
          },
          get children() {
            var g = Kl();
            return T((w) => {
              var L = M().x - 13, B = M().y - 13;
              return L !== w.e && y(g, "x", w.e = L), B !== w.t && y(g, "y", w.t = B), w;
            }, {
              e: void 0,
              t: void 0
            }), g;
          }
        }), I), x(d, u(_t, {
          get each() {
            return de();
          },
          children: (g) => (() => {
            var w = Hl();
            return T((L) => {
              var B = g.x1, J = g.y1, be = g.x2, lt = g.y2;
              return B !== L.e && y(w, "x1", L.e = B), J !== L.t && y(w, "y1", L.t = J), be !== L.a && y(w, "x2", L.a = be), lt !== L.o && y(w, "y2", L.o = lt), L;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), w;
          })()
        }), I), x(d, u(U, {
          get when() {
            return h() === vt;
          },
          get children() {
            var g = Gl();
            return T((w) => {
              var L = P().col * 24 + 12, B = P().row * 24 + 12;
              return L !== w.e && y(g, "x", w.e = L), B !== w.t && y(g, "y", w.t = B), w;
            }, {
              e: void 0,
              t: void 0
            }), g;
          }
        }), null), x(d, u(U, {
          get when() {
            return h() === Zl || h() === $t;
          },
          get children() {
            var g = Ul();
            return T((w) => {
              var L = C().x, B = C().y;
              return L !== w.e && y(g, "x", w.e = L), B !== w.t && y(g, "y", w.t = B), w;
            }, {
              e: void 0,
              t: void 0
            }), g;
          }
        }), null), x(d, u(U, {
          get when() {
            return h() === tt;
          },
          get children() {
            return u(Ye, {
              class: "ninja",
              ninja: () => ({
                x: C().x,
                y: C().y,
                deg: 0
              }),
              bones: () => ue() ?? ua
            });
          }
        }), null), x(d, u(U, {
          get when() {
            return oe();
          },
          get children() {
            var g = Fl();
            return T(() => y(g, "points", r().map(({ x: w, y: L }) => `${w},${L}`).join(" "))), g;
          }
        }), null), T((g) => {
          var w = s(), L = [
            Yl,
            $t,
            zl
          ].includes(h()) ? "url(#outline)" : "", B = i(), J = O();
          return w !== g.e && y(ie, "d", g.e = w), L !== g.t && y(ae, "filter", g.t = L), B !== g.a && y($, "d", g.a = B), J !== g.o && y(R, "d", g.o = J), g;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), d;
      })(),
      u(Bl, {
        editor: e,
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
        setShowTrail: _e
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
  var ha = v("<div id=media-controls><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb>");
  function fa(t) {
    const e = () => {
      const n = t.progress(), c = t.length();
      return c === 0 || n >= c ? "100%" : `${n / c * 100}%`;
    }, r = () => {
      const n = t.progress(), c = t.previewProgress(), p = t.length();
      if (c === void 0 || p === 0) return {
        left: "0%",
        width: "0%"
      };
      const m = Math.min(n, c), h = Math.min(Math.max(n, c), p);
      return {
        left: `${m / p * 100}%`,
        width: `${(h - m) / p * 100}%`
      };
    };
    let s;
    document.addEventListener("mousemove", i), we(() => document.removeEventListener("mousemove", i)), document.addEventListener("mouseup", _), we(() => document.removeEventListener("mouseup", _));
    function o(n) {
      if (s) {
        const { left: c, top: p, width: m } = s.getBoundingClientRect();
        let h = (n.clientX - c) / m;
        h = Math.min(1, h), h = Math.max(0, h);
        let E = Math.abs(n.clientY - p);
        return {
          targetFrame: Math.round(h * t.length()),
          strength: Math.pow(Math.E, -5 * E / m)
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
          const { targetFrame: p, strength: m } = o(n);
          t.seek(Math.round(c + (p - c) * m)), t.previewSeek(void 0);
        } else s.matches(":hover") ? t.previewSeek(o(n).targetFrame) : t.previewSeek(void 0);
      }
    }
    function _() {
      t.setDragStart(void 0);
    }
    return (() => {
      var n = ha(), c = n.firstChild, p = c.firstChild, m = c.nextSibling, h = m.firstChild, E = h.nextSibling, P = E.nextSibling, N = P.nextSibling;
      c.$$click = () => {
        t.isPlaying() ? t.setIsPlaying(false) : (t.progress() >= t.length() && t.seek(0), t.setIsPlaying(true));
      }, x(p, u($r, {
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
      })), m.$$mousedown = (A) => {
        t.setDragStart(o(A).targetFrame), i(A), A.preventDefault();
      };
      var C = s;
      return typeof C == "function" ? Tr(C, m) : s = m, T((A) => {
        var O = e(), S = r().left, D = r().width, k = e();
        return O !== A.e && Be(E, "width", A.e = O), S !== A.t && Be(P, "left", A.t = S), D !== A.a && Be(P, "width", A.a = D), k !== A.o && Be(N, "left", A.o = k), A;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), n;
    })();
  }
  Ze([
    "click",
    "mousedown"
  ]);
  var ga = v('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), ya = v("<div>");
  function wa(t) {
    const e = t.replay, [r, s] = b(true), [o, i] = b(true), [_, n] = b(void 0), [c, p] = b(0), [m, h] = b(0), [E, P] = b(void 0), N = ($) => {
      $.code === "Enter" ? (e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), o() || ae(1)) : $.code === "Escape" && (o() ? (i(false), s(false)) : (i(true), s(true)));
    };
    document.addEventListener("keydown", N), we(() => {
      document.removeEventListener("keydown", N);
    });
    const C = () => e.tiles_path(), [A, O] = b({
      x: -50,
      y: -50,
      deg: 0
    }), [S, D] = b({
      x: -50,
      y: -50,
      deg: 0
    }), [k, M] = b(), [Z, q] = b(), se = b([]), de = b([]), ee = b([]), oe = b([]), _e = b([]), ue = b([]), j = b([]), Y = b([]), X = b([]), W = b([]), ne = b([]), pe = b([]), le = b([]), Pe = b([]), Ee = b([]);
    let Le = performance.now();
    const f = 1e3 / 60;
    let me = 0, te = 0;
    function ie() {
      const $ = performance.now(), I = Math.min($ - Le, 250);
      Le = $;
      let R = 1;
      const g = e;
      if (o() && _() === void 0) {
        if (r() || m() < c()) {
          for (me += I; me >= f; ) {
            if (r()) {
              let { isJump1Pressed: w, isJump2Pressed: L, isRightPressed: B, isLeftPressed: J, isSuicidePressed: be } = t.globalEventState;
              g.set_input(w() || L(), B(), J(), be());
            }
            g.tick(), me -= f;
          }
          R = me / f, h(g.progress());
        } else m() < c() ? (g.tick(), h(g.progress())) : i(false);
        ae(R);
      }
      te = requestAnimationFrame(ie);
    }
    ie(), we(() => {
      cancelAnimationFrame(te);
    });
    function ae($) {
      O({
        x: e.ninja_x($),
        y: e.ninja_y($),
        deg: 0
      }), D({
        x: e.ninja_preview_x($),
        y: e.ninja_preview_y($),
        deg: 0
      }), M(e.ninja_bones($)), E() === void 0 ? q(void 0) : q(e.ninja_preview_bones($)), n_(se, e), ol(de, e, $), Zi(ee, e), al(oe, e, $), hl(_e, e, $), H_(ue, e), J_(j, e, $), b_(Y, e, $), E_(X, e), N_(W, e, $), F_(ne, e), d_(pe, e, $), ml(le, e, $), Ii(Pe, e, $), qi(Ee, e, $), p(e.replay_length());
    }
    return [
      (() => {
        var $ = ga(), I = $.firstChild;
        I.firstChild;
        var R = I.nextSibling;
        return $.$$mousemove = function(g) {
          const { left: w, top: L, width: B, height: J } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (g.clientX - w) / B * 1056,
            y: (g.clientY - L) / J * 600
          });
        }, x(I, u(Wt, {}), null), x(I, u(rr, {}), null), x(I, u(Ft, {}), null), x(I, u(zt, {}), null), x(I, u(Jt, {}), null), x(I, u(or, {}), null), x(I, u(ir, {}), null), x(I, u(Ki, {}), null), x($, u(Kt, {
          exitDoors: Pe
        }), R), x($, u(Ut, {
          oneWays: ee
        }), R), x($, u(qt, {
          mines: se
        }), R), x($, u(Vt, {
          regularDoors: pe
        }), R), x($, u(Ht, {
          lockedDoors: Y
        }), R), x($, u(Zt, {
          trapDoors: W
        }), R), x($, u(Yt, {
          lockedSwitches: X
        }), R), x($, u(Xt, {
          trapSwitches: ne
        }), R), x($, u(Gt, {
          get exitSwitches() {
            return Ee[0];
          }
        }), R), x($, u(Qt, {
          launchPads: ue
        }), R), x($, u(er, {
          floorGuards: j
        }), R), x($, u(nr, {
          thwumps: _e
        }), R), x($, u(Ye, {
          class: "ninja preview",
          ninja: S,
          bones: Z
        }), R), x($, u(Ye, {
          class: "ninja",
          ninja: A,
          bones: k
        }), R), x($, u(tr, {
          bounceBlocks: de
        }), R), x($, u(_r, {
          shoveThwumps: le
        }), R), x($, u(sr, {
          boostPads: oe
        }), R), T(() => y(R, "d", C())), $;
      })(),
      (() => {
        var $ = ya();
        return x($, u(U, {
          get when() {
            return !r() || !o();
          },
          get children() {
            return u(fa, {
              isPlaying: o,
              setIsPlaying: i,
              dragStart: _,
              setDragStart: n,
              length: c,
              progress: m,
              previewProgress: E,
              seek: (I) => {
                h(I), e.seek(I), ae(1);
              },
              previewSeek: (I) => {
                P(I), e && (I !== void 0 && _() === void 0 && e.seek_preview(I), ae(1));
              }
            });
          }
        })), $;
      })()
    ];
  }
  Ze([
    "mousemove"
  ]);
  var ma = v("<p>Invalid file."), ba = v("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file><dl><dt>Windows</dt><dd>C:\\Program Files (x86)\\Steam\\steamapps\\common\\N++\\anim_data_line_new.txt.bin</dd><dt>Linux</dt><dd>~/.steam/steam/steamapps/common/N++/anim_data_line_new.txt.bin</dd><dt>Mac</dt><dd>~/Library/Application Support/Steam/steamapps/common/N++/N++.app/Contents/Resources/NPP/anim_data_line_new.txt.bin");
  function xa() {
    const t = De.new(), [e, r] = b(), [s, o] = b(""), [i, _] = b(false), [n, c] = b([]);
    function p() {
      const j = [], Y = t.past_ninjas_len();
      for (let X = 0; X < Y; X++) j.push({
        x: t.past_ninja_x(X),
        y: t.past_ninja_y(X)
      });
      c(j);
    }
    const [m, h] = b(false), [E, P] = b(false), [N, C] = b(false), [A, O] = b(false), [S, D] = b(false), [k, M] = b({
      x: 36,
      y: 36
    }), Z = {
      isJump1Pressed: m,
      isJump2Pressed: E,
      isRightPressed: N,
      isLeftPressed: A,
      isSuicidePressed: S,
      mouseGamePos: k,
      setMouseGamePos: M
    };
    xl(t), o(t.get_level_name()), document.addEventListener("keydown", (j) => {
      if (!(j.ctrlKey || j.metaKey)) if (j.code === "Tab") {
        const Y = e();
        Y ? (r(void 0), Y.send_past_ninjas(), t.receive_past_ninjas(), Y.free(), p()) : r(t.to_replay(i())), j.preventDefault();
      } else j.code === "KeyZ" ? h(true) : j.code === "ArrowUp" ? P(true) : j.code === "ArrowRight" ? C(true) : j.code === "ArrowLeft" ? O(true) : j.code === "KeyV" && D(true);
    }), document.addEventListener("keyup", (j) => {
      j.code === "KeyZ" ? h(false) : j.code === "ArrowUp" ? P(false) : j.code === "ArrowRight" ? C(false) : j.code === "ArrowLeft" ? O(false) : j.code === "KeyV" && D(false);
    }), document.addEventListener("blur", () => {
      h(false), P(false), C(false), O(false), D(false);
    }), kl(t);
    const q = 0, se = 1, de = 2, [ee, oe] = b(t.get_anim_state() == q ? q : de);
    Al();
    const [_e, ue] = b(Dl());
    return gr(() => {
      const j = _e();
      j && (Ml(j.colors), $l(j));
    }), [
      u(U, {
        get when() {
          return ee() != q;
        },
        get children() {
          var j = ba(), Y = j.firstChild, X = Y.nextSibling;
          return X.nextSibling, X.addEventListener("change", function() {
            const W = this.files;
            if (W && W.length > 0) {
              const ne = new FileReader();
              ne.onloadend = () => {
                if (ne.result instanceof ArrayBuffer) {
                  const pe = new Uint8Array(ne.result);
                  try {
                    try {
                      vl(pe);
                    } catch (le) {
                      console.error(le);
                    }
                    t.set_anim_data(pe), oe(t.get_anim_state());
                  } catch (le) {
                    console.error(le), oe(se);
                  }
                }
              }, ne.readAsArrayBuffer(W[0]);
            }
          }), x(j, u(U, {
            get when() {
              return ee() == se;
            },
            get children() {
              return ma();
            }
          }), null), j;
        }
      }),
      u(U, {
        get when() {
          return ke(() => ee() == q)() && !e();
        },
        get children() {
          return u(pa, {
            editor: t,
            setReplay: r,
            pastNinjas: n,
            globalEventState: Z,
            levelName: s,
            setLevelName: o,
            roundCorners: i,
            setRoundCorners: _,
            palette: _e,
            setPalette: ue
          });
        }
      }),
      u(U, {
        get when() {
          return ke(() => ee() == q)() && !!e();
        },
        keyed: true,
        get children() {
          return u(wa, {
            get replay() {
              return e();
            },
            globalEventState: Z
          });
        }
      })
    ];
  }
  const va = document.getElementById("root");
  Dr(() => u(xa, {}), va);
})();
