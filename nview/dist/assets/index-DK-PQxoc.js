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
  const sr = false, or = (t, e) => t === e, xt = Symbol("solid-track"), Ce = {
    equals: or
  };
  let nr = Tt;
  const pe = 1, Ne = 2, vt = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var q = null;
  let He = null, _r = null, R = null, H = null, de = null, Re = 0;
  function me(t, e) {
    const r = R, s = q, n = t.length === 0, i = e === void 0 ? s : e, _ = n ? vt : {
      owned: null,
      cleanups: null,
      context: i ? i.context : null,
      owner: i
    }, o = n ? t : () => t(() => re(() => Se(_)));
    q = _, R = null;
    try {
      return Te(o, true);
    } finally {
      R = r, q = s;
    }
  }
  function y(t, e) {
    e = e ? Object.assign({}, Ce, e) : Ce;
    const r = {
      value: t,
      observers: null,
      observerSlots: null,
      comparator: e.equals || void 0
    }, s = (n) => (typeof n == "function" && (n = n(r.value)), kt(r, n));
    return [
      $t.bind(r),
      s
    ];
  }
  function T(t, e, r) {
    const s = St(t, e, false, pe);
    Ge(s);
  }
  function Q(t, e, r) {
    r = r ? Object.assign({}, Ce, r) : Ce;
    const s = St(t, e, true, 0);
    return s.observers = null, s.observerSlots = null, s.comparator = r.equals || void 0, Ge(s), $t.bind(s);
  }
  function re(t) {
    if (R === null) return t();
    const e = R;
    R = null;
    try {
      return t();
    } finally {
      R = e;
    }
  }
  function ue(t) {
    return q === null || (q.cleanups === null ? q.cleanups = [
      t
    ] : q.cleanups.push(t)), t;
  }
  function ir(t) {
    const e = Q(t), r = Q(() => Ze(e()));
    return r.toArray = () => {
      const s = r();
      return Array.isArray(s) ? s : s != null ? [
        s
      ] : [];
    }, r;
  }
  function $t() {
    if (this.sources && this.state) if (this.state === pe) Ge(this);
    else {
      const t = H;
      H = null, Te(() => Oe(this), false), H = t;
    }
    if (R) {
      const t = this.observers ? this.observers.length : 0;
      R.sources ? (R.sources.push(this), R.sourceSlots.push(t)) : (R.sources = [
        this
      ], R.sourceSlots = [
        t
      ]), this.observers ? (this.observers.push(R), this.observerSlots.push(R.sources.length - 1)) : (this.observers = [
        R
      ], this.observerSlots = [
        R.sources.length - 1
      ]);
    }
    return this.value;
  }
  function kt(t, e, r) {
    let s = t.value;
    return (!t.comparator || !t.comparator(s, e)) && (t.value = e, t.observers && t.observers.length && Te(() => {
      for (let n = 0; n < t.observers.length; n += 1) {
        const i = t.observers[n], _ = He && He.running;
        _ && He.disposed.has(i), (_ ? !i.tState : !i.state) && (i.pure ? H.push(i) : de.push(i), i.observers && Pt(i)), _ || (i.state = pe);
      }
      if (H.length > 1e6) throw H = [], new Error();
    }, false)), e;
  }
  function Ge(t) {
    if (!t.fn) return;
    Se(t);
    const e = Re;
    lr(t, t.value, e);
  }
  function lr(t, e, r) {
    let s;
    const n = q, i = R;
    R = q = t;
    try {
      s = t.fn(e);
    } catch (_) {
      return t.pure && (t.state = pe, t.owned && t.owned.forEach(Se), t.owned = null), t.updatedAt = r + 1, Et(_);
    } finally {
      R = i, q = n;
    }
    (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? kt(t, s) : t.value = s, t.updatedAt = r);
  }
  function St(t, e, r, s = pe, n) {
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
    return q === null || q !== vt && (q.owned ? q.owned.push(i) : q.owned = [
      i
    ]), i;
  }
  function Dt(t) {
    if (t.state === 0) return;
    if (t.state === Ne) return Oe(t);
    if (t.suspense && re(t.suspense.inFallback)) return t.suspense.effects.push(t);
    const e = [
      t
    ];
    for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < Re); ) t.state && e.push(t);
    for (let r = e.length - 1; r >= 0; r--) if (t = e[r], t.state === pe) Ge(t);
    else if (t.state === Ne) {
      const s = H;
      H = null, Te(() => Oe(t, e[0]), false), H = s;
    }
  }
  function Te(t, e) {
    if (H) return t();
    let r = false;
    e || (H = []), de ? r = true : de = [], Re++;
    try {
      const s = t();
      return ar(r), s;
    } catch (s) {
      r || (de = null), H = null, Et(s);
    }
  }
  function ar(t) {
    if (H && (Tt(H), H = null), t) return;
    const e = de;
    de = null, e.length && Te(() => nr(e), false);
  }
  function Tt(t) {
    for (let e = 0; e < t.length; e++) Dt(t[e]);
  }
  function Oe(t, e) {
    t.state = 0;
    for (let r = 0; r < t.sources.length; r += 1) {
      const s = t.sources[r];
      if (s.sources) {
        const n = s.state;
        n === pe ? s !== e && (!s.updatedAt || s.updatedAt < Re) && Dt(s) : n === Ne && Oe(s, e);
      }
    }
  }
  function Pt(t) {
    for (let e = 0; e < t.observers.length; e += 1) {
      const r = t.observers[e];
      r.state || (r.state = Ne, r.pure ? H.push(r) : de.push(r), r.observers && Pt(r));
    }
  }
  function Se(t) {
    let e;
    if (t.sources) for (; t.sources.length; ) {
      const r = t.sources.pop(), s = t.sourceSlots.pop(), n = r.observers;
      if (n && n.length) {
        const i = n.pop(), _ = r.observerSlots.pop();
        s < n.length && (i.sourceSlots[_] = s, n[s] = i, r.observerSlots[s] = _);
      }
    }
    if (t.tOwned) {
      for (e = t.tOwned.length - 1; e >= 0; e--) Se(t.tOwned[e]);
      delete t.tOwned;
    }
    if (t.owned) {
      for (e = t.owned.length - 1; e >= 0; e--) Se(t.owned[e]);
      t.owned = null;
    }
    if (t.cleanups) {
      for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
      t.cleanups = null;
    }
    t.state = 0;
  }
  function cr(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function Et(t, e = q) {
    throw cr(t);
  }
  function Ze(t) {
    if (typeof t == "function" && !t.length) return Ze(t());
    if (Array.isArray(t)) {
      const e = [];
      for (let r = 0; r < t.length; r++) {
        const s = Ze(t[r]);
        Array.isArray(s) ? e.push.apply(e, s) : e.push(s);
      }
      return e;
    }
    return t;
  }
  const Je = Symbol("fallback");
  function Ie(t) {
    for (let e = 0; e < t.length; e++) t[e]();
  }
  function dr(t, e, r = {}) {
    let s = [], n = [], i = [], _ = 0, o = e.length > 1 ? [] : null;
    return ue(() => Ie(i)), () => {
      let c = t() || [], u = c.length, w, h;
      return c[xt], re(() => {
        let D, S, E, O, L, I, j, k, A;
        if (u === 0) _ !== 0 && (Ie(i), i = [], s = [], n = [], _ = 0, o && (o = [])), r.fallback && (s = [
          Je
        ], n[0] = me((U) => (i[0] = U, r.fallback())), _ = 1);
        else if (_ === 0) {
          for (n = new Array(u), h = 0; h < u; h++) s[h] = c[h], n[h] = me(P);
          _ = u;
        } else {
          for (E = new Array(u), O = new Array(u), o && (L = new Array(u)), I = 0, j = Math.min(_, u); I < j && s[I] === c[I]; I++) ;
          for (j = _ - 1, k = u - 1; j >= I && k >= I && s[j] === c[k]; j--, k--) E[k] = n[j], O[k] = i[j], o && (L[k] = o[j]);
          for (D = /* @__PURE__ */ new Map(), S = new Array(k + 1), h = k; h >= I; h--) A = c[h], w = D.get(A), S[h] = w === void 0 ? -1 : w, D.set(A, h);
          for (w = I; w <= j; w++) A = s[w], h = D.get(A), h !== void 0 && h !== -1 ? (E[h] = n[w], O[h] = i[w], o && (L[h] = o[w]), h = S[h], D.set(A, h)) : i[w]();
          for (h = I; h < u; h++) h in E ? (n[h] = E[h], i[h] = O[h], o && (o[h] = L[h], o[h](h))) : n[h] = me(P);
          n = n.slice(0, _ = u), s = c.slice(0);
        }
        return n;
      });
      function P(D) {
        if (i[h] = D, o) {
          const [S, E] = y(h);
          return o[h] = E, e(c[h], S);
        }
        return e(c[h]);
      }
    };
  }
  function ur(t, e, r = {}) {
    let s = [], n = [], i = [], _ = [], o = 0, c;
    return ue(() => Ie(i)), () => {
      const u = t() || [], w = u.length;
      return u[xt], re(() => {
        if (w === 0) return o !== 0 && (Ie(i), i = [], s = [], n = [], o = 0, _ = []), r.fallback && (s = [
          Je
        ], n[0] = me((P) => (i[0] = P, r.fallback())), o = 1), n;
        for (s[0] === Je && (i[0](), i = [], s = [], n = [], o = 0), c = 0; c < w; c++) c < s.length && s[c] !== u[c] ? _[c](() => u[c]) : c >= s.length && (n[c] = me(h));
        for (; c < s.length; c++) i[c]();
        return o = _.length = i.length = w, s = u.slice(0), n = n.slice(0, o);
      });
      function h(P) {
        i[c] = P;
        const [D, S] = y(u[c]);
        return _[c] = S, e(D, c);
      }
    };
  }
  function p(t, e) {
    return re(() => t(e || {}));
  }
  const Lt = (t) => `Stale read from <${t}>.`;
  function tt(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return Q(dr(() => t.each, t.children, e || void 0));
  }
  function z(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return Q(ur(() => t.each, t.children, e || void 0));
  }
  function Z(t) {
    const e = t.keyed, r = Q(() => t.when, void 0, void 0), s = e ? r : Q(r, void 0, {
      equals: (n, i) => !n == !i
    });
    return Q(() => {
      const n = s();
      if (n) {
        const i = t.children;
        return typeof i == "function" && i.length > 0 ? re(() => i(e ? n : () => {
          if (!re(s)) throw Lt("Show");
          return r();
        })) : i;
      }
      return t.fallback;
    }, void 0, void 0);
  }
  function pr(t) {
    const e = ir(() => t.children), r = Q(() => {
      const s = e(), n = Array.isArray(s) ? s : [
        s
      ];
      let i = () => {
      };
      for (let _ = 0; _ < n.length; _++) {
        const o = _, c = n[_], u = i, w = Q(() => u() ? void 0 : c.when, void 0, void 0), h = c.keyed ? w : Q(w, void 0, {
          equals: (P, D) => !P == !D
        });
        i = () => u() || (h() ? [
          o,
          w,
          c
        ] : void 0);
      }
      return i;
    });
    return Q(() => {
      const s = r()();
      if (!s) return t.fallback;
      const [n, i, _] = s, o = _.children;
      return typeof o == "function" && o.length > 0 ? re(() => o(_.keyed ? i() : () => {
        var _a;
        if (((_a = re(r)()) == null ? void 0 : _a[0]) !== n) throw Lt("Match");
        return i();
      })) : o;
    }, void 0, void 0);
  }
  function st(t) {
    return t;
  }
  const ye = (t) => Q(() => t());
  function hr(t, e, r) {
    let s = r.length, n = e.length, i = s, _ = 0, o = 0, c = e[n - 1].nextSibling, u = null;
    for (; _ < n || o < i; ) {
      if (e[_] === r[o]) {
        _++, o++;
        continue;
      }
      for (; e[n - 1] === r[i - 1]; ) n--, i--;
      if (n === _) {
        const w = i < s ? o ? r[o - 1].nextSibling : r[i - o] : c;
        for (; o < i; ) t.insertBefore(r[o++], w);
      } else if (i === o) for (; _ < n; ) (!u || !u.has(e[_])) && e[_].remove(), _++;
      else if (e[_] === r[i - 1] && r[o] === e[n - 1]) {
        const w = e[--n].nextSibling;
        t.insertBefore(r[o++], e[_++].nextSibling), t.insertBefore(r[--i], w), e[n] = r[i];
      } else {
        if (!u) {
          u = /* @__PURE__ */ new Map();
          let h = o;
          for (; h < i; ) u.set(r[h], h++);
        }
        const w = u.get(e[_]);
        if (w != null) if (o < w && w < i) {
          let h = _, P = 1, D;
          for (; ++h < n && h < i && !((D = u.get(e[h])) == null || D !== w + P); ) P++;
          if (P > w - o) {
            const S = e[_];
            for (; o < w; ) t.insertBefore(r[o++], S);
          } else t.replaceChild(r[o++], e[_++]);
        } else _++;
        else e[_++].remove();
      }
    }
  }
  const ot = "_$DX_DELEGATE";
  function fr(t, e, r, s = {}) {
    let n;
    return me((i) => {
      n = i, e === document ? t() : v(e, t(), e.firstChild ? null : void 0, r);
    }, s.owner), () => {
      n(), e.textContent = "";
    };
  }
  function $(t, e, r, s) {
    let n;
    const i = () => {
      const o = s ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
      return o.innerHTML = t, r ? o.content.firstChild.firstChild : s ? o.firstChild : o.content.firstChild;
    }, _ = e ? () => re(() => document.importNode(n || (n = i()), true)) : () => (n || (n = i())).cloneNode(true);
    return _.cloneNode = _, _;
  }
  function qe(t, e = window.document) {
    const r = e[ot] || (e[ot] = /* @__PURE__ */ new Set());
    for (let s = 0, n = t.length; s < n; s++) {
      const i = t[s];
      r.has(i) || (r.add(i), e.addEventListener(i, wr));
    }
  }
  function g(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function Ee(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function gr(t, e, r) {
    return re(() => t(e, r));
  }
  function v(t, e, r, s) {
    if (r !== void 0 && !s && (s = []), typeof e != "function") return Be(t, e, s, r);
    T((n) => Be(t, e(), n, r), s);
  }
  function wr(t) {
    let e = t.target;
    const r = `$$${t.type}`, s = t.target, n = t.currentTarget, i = (c) => Object.defineProperty(t, "target", {
      configurable: true,
      value: c
    }), _ = () => {
      const c = e[r];
      if (c && !e.disabled) {
        const u = e[`${r}Data`];
        if (u !== void 0 ? c.call(e, u, t) : c.call(e, t), t.cancelBubble) return;
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
      for (let u = 0; u < c.length - 2 && (e = c[u], !!_()); u++) {
        if (e._$host) {
          e = e._$host, o();
          break;
        }
        if (e.parentNode === n) break;
      }
    } else o();
    i(s);
  }
  function Be(t, e, r, s, n) {
    for (; typeof r == "function"; ) r = r();
    if (e === r) return r;
    const i = typeof e, _ = s !== void 0;
    if (t = _ && r[0] && r[0].parentNode || t, i === "string" || i === "number") {
      if (i === "number" && (e = e.toString(), e === r)) return r;
      if (_) {
        let o = r[0];
        o && o.nodeType === 3 ? o.data !== e && (o.data = e) : o = document.createTextNode(e), r = ge(t, r, s, o);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || i === "boolean") r = ge(t, r, s);
    else {
      if (i === "function") return T(() => {
        let o = e();
        for (; typeof o == "function"; ) o = o();
        r = Be(t, o, r, s);
      }), () => r;
      if (Array.isArray(e)) {
        const o = [], c = r && Array.isArray(r);
        if (Qe(o, e, r, n)) return T(() => r = Be(t, o, r, s, true)), () => r;
        if (o.length === 0) {
          if (r = ge(t, r, s), _) return r;
        } else c ? r.length === 0 ? nt(t, o, s) : hr(t, r, o) : (r && ge(t), nt(t, o));
        r = o;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (_) return r = ge(t, r, s, e);
          ge(t, r, null, e);
        } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
        r = e;
      }
    }
    return r;
  }
  function Qe(t, e, r, s) {
    let n = false;
    for (let i = 0, _ = e.length; i < _; i++) {
      let o = e[i], c = r && r[t.length], u;
      if (!(o == null || o === true || o === false)) if ((u = typeof o) == "object" && o.nodeType) t.push(o);
      else if (Array.isArray(o)) n = Qe(t, o, c) || n;
      else if (u === "function") if (s) {
        for (; typeof o == "function"; ) o = o();
        n = Qe(t, Array.isArray(o) ? o : [
          o
        ], Array.isArray(c) ? c : [
          c
        ]) || n;
      } else t.push(o), n = true;
      else {
        const w = String(o);
        c && c.nodeType === 3 && c.data === w ? t.push(c) : t.push(document.createTextNode(w));
      }
    }
    return n;
  }
  function nt(t, e, r = null) {
    for (let s = 0, n = e.length; s < n; s++) t.insertBefore(e[s], r);
  }
  function ge(t, e, r, s) {
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
  const yr = "/assets/ntools_rs_bg-DtL7Ojh2.wasm", mr = async (t = {}, e) => {
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
  function br(t) {
    l = t;
  }
  let Le = null;
  function be() {
    return (Le === null || Le.byteLength === 0) && (Le = new Uint8Array(l.memory.buffer)), Le;
  }
  let Me = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  Me.decode();
  const xr = 2146435072;
  let Ye = 0;
  function vr(t, e) {
    return Ye += e, Ye >= xr && (Me = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), Me.decode(), Ye = e), Me.decode(be().subarray(t, t + e));
  }
  function ce(t, e) {
    return t = t >>> 0, vr(t, e);
  }
  let le = 0;
  function Ke(t, e) {
    const r = e(t.length * 1, 1) >>> 0;
    return be().set(t, r / 1), le = t.length, r;
  }
  function je(t) {
    const e = l.__wbindgen_externrefs.get(t);
    return l.__externref_table_dealloc(t), e;
  }
  function $r(t, e) {
    return t = t >>> 0, be().subarray(t / 1, t / 1 + e);
  }
  const ke = new TextEncoder();
  "encodeInto" in ke || (ke.encodeInto = function(t, e) {
    const r = ke.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function kr(t, e, r) {
    if (r === void 0) {
      const o = ke.encode(t), c = e(o.length, 1) >>> 0;
      return be().subarray(c, c + o.length).set(o), le = o.length, c;
    }
    let s = t.length, n = e(s, 1) >>> 0;
    const i = be();
    let _ = 0;
    for (; _ < s; _++) {
      const o = t.charCodeAt(_);
      if (o > 127) break;
      i[n + _] = o;
    }
    if (_ !== s) {
      _ !== 0 && (t = t.slice(_)), n = r(n, s, s = _ + t.length * 3, 1) >>> 0;
      const o = be().subarray(n + _, n + s), c = ke.encodeInto(t, o);
      _ += c.written, n = r(n, s, _, 1) >>> 0;
    }
    return le = _, n;
  }
  let we = null;
  function Sr() {
    return (we === null || we.buffer.detached === true || we.buffer.detached === void 0 && we.buffer !== l.memory.buffer) && (we = new DataView(l.memory.buffer)), we;
  }
  function _t(t, e) {
    t = t >>> 0;
    const r = Sr(), s = [];
    for (let n = t; n < t + 4 * e; n += 4) s.push(l.__wbindgen_externrefs.get(r.getUint32(n, true)));
    return l.__externref_drop_slice(t, e), s;
  }
  function At(t) {
    const e = Ke(t, l.__wbindgen_malloc), r = le;
    l.set_anim_data(e, r);
  }
  function it() {
    return l.get_anim_state() >>> 0;
  }
  let Ae = null;
  function Dr() {
    return (Ae === null || Ae.byteLength === 0) && (Ae = new Float64Array(l.memory.buffer)), Ae;
  }
  function lt(t, e) {
    return t = t >>> 0, Dr().subarray(t / 8, t / 8 + e);
  }
  const at = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_editor_free(t >>> 0, 1));
  class xe {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(xe.prototype);
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
      return xe.__wrap(e);
    }
    load_attract(e) {
      const r = Ke(e, l.__wbindgen_malloc), s = le, n = l.editor_load_attract(this.__wbg_ptr, r, s);
      if (n[1]) throw je(n[0]);
    }
    load_map(e) {
      const r = Ke(e, l.__wbindgen_malloc), s = le, n = l.editor_load_map(this.__wbg_ptr, r, s);
      if (n[1]) throw je(n[0]);
    }
    export_map() {
      const e = l.editor_export_map(this.__wbg_ptr);
      var r = $r(e[0], e[1]).slice();
      return l.__wbindgen_free(e[0], e[1] * 1, 1), r;
    }
    get_level_name() {
      let e, r;
      try {
        const s = l.editor_get_level_name(this.__wbg_ptr);
        return e = s[0], r = s[1], ce(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    set_level_name(e) {
      const r = kr(e, l.__wbindgen_malloc, l.__wbindgen_realloc), s = le;
      l.editor_set_level_name(this.__wbg_ptr, r, s);
    }
    to_replay(e) {
      const r = l.editor_to_replay(this.__wbg_ptr, e);
      if (r[2]) throw je(r[1]);
      return ve.__wrap(r[0]);
    }
    mode() {
      return l.editor_mode(this.__wbg_ptr) >>> 0;
    }
    tiles_path() {
      let e, r;
      try {
        const s = l.editor_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], ce(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
    }
    selected_tiles_path() {
      let e, r;
      try {
        const s = l.editor_selected_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], ce(s[0], s[1]);
      } finally {
        l.__wbindgen_free(e, r, 1);
      }
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
        return e = s[0], r = s[1], ce(s[0], s[1]);
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
  Symbol.dispose && (xe.prototype[Symbol.dispose] = xe.prototype.free);
  const ct = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_exportedentity_free(t >>> 0, 1));
  class De {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(De.prototype);
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
  Symbol.dispose && (De.prototype[Symbol.dispose] = De.prototype.free);
  const dt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => l.__wbg_replay_free(t >>> 0, 1));
  class ve {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(ve.prototype);
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
      const r = Ke(e, l.__wbindgen_malloc), s = le, n = l.replay_from_attract(r, s);
      if (n[2]) throw je(n[1]);
      return ve.__wrap(n[0]);
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
        return e = s[0], r = s[1], ce(s[0], s[1]);
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
      var s = lt(r[0], r[1]).slice();
      return l.__wbindgen_free(r[0], r[1] * 8, 8), s;
    }
    ninja_preview_bones(e) {
      const r = l.replay_ninja_preview_bones(this.__wbg_ptr, e);
      var s = lt(r[0], r[1]).slice();
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
  Symbol.dispose && (ve.prototype[Symbol.dispose] = ve.prototype.free);
  function Tr(t, e) {
    throw new Error(ce(t, e));
  }
  function Pr(t) {
    return De.__wrap(t);
  }
  function Er(t, e) {
    return ce(t, e);
  }
  function Lr() {
    const t = l.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const a = await mr({
    "./ntools_rs_bg.js": {
      __wbg_exportedentity_new: Pr,
      __wbg___wbindgen_throw_b855445ff6a94295: Tr,
      __wbindgen_init_externref_table: Lr,
      __wbindgen_cast_2241b6af4c4b2941: Er
    }
  }, yr), Ar = a.memory, Mr = a.__wbg_editor_free, jr = a.editor_new, Cr = a.editor_load_attract, Nr = a.editor_load_map, Or = a.editor_export_map, Ir = a.editor_get_level_name, Br = a.editor_set_level_name, Kr = a.editor_to_replay, Rr = a.editor_mode, Gr = a.editor_tiles_path, qr = a.editor_selected_tiles_path, Ur = a.editor_set_cursor_pos, Wr = a.editor_cursor_down, Fr = a.editor_cursor_up, Vr = a.editor_double_click, Hr = a.editor_tile_crosshair_col, Yr = a.editor_tile_crosshair_row, zr = a.editor_crosshair_x, Xr = a.editor_crosshair_y, Zr = a.editor_entities, Jr = a.editor_preview_entities, Qr = a.editor_selected_tile_outline_path, es = a.editor_show_half_grid, ts = a.editor_show_quarter_grid, rs = a.editor_undo, ss = a.editor_redo, os = a.editor_press_escape, ns = a.editor_press_backtick, _s = a.editor_press_1, is = a.editor_press_2, ls = a.editor_press_3, as = a.editor_press_4, cs = a.editor_press_5, ds = a.editor_press_6, us = a.editor_press_7, ps = a.editor_press_8, hs = a.editor_press_9, fs = a.editor_press_0, gs = a.editor_press_dash, ws = a.editor_press_equals, ys = a.editor_press_q, ms = a.editor_press_w, bs = a.editor_press_a, xs = a.editor_press_s, vs = a.editor_press_e, $s = a.editor_press_d, ks = a.editor_press_z, Ss = a.editor_press_x, Ds = a.editor_press_c, Ts = a.editor_press_t, Ps = a.editor_press_i, Es = a.editor_press_o, Ls = a.editor_press_p, As = a.editor_press_bracket_left, Ms = a.editor_press_bracket_right, js = a.editor_press_f, Cs = a.editor_press_n, Ns = a.editor_press_m, Os = a.editor_press_comma, Is = a.editor_press_slash, Bs = a.editor_press_num_0, Ks = a.editor_press_num_3, Rs = a.editor_press_num_7, Gs = a.editor_release_q, qs = a.editor_release_w, Us = a.editor_release_a, Ws = a.editor_release_s, Fs = a.editor_release_e, Vs = a.editor_release_d, Hs = a.editor_release_z, Ys = a.editor_release_c, zs = a.editor_receive_past_ninjas, Xs = a.editor_past_ninjas_len, Zs = a.editor_past_ninja_x, Js = a.editor_past_ninja_y, Qs = a.set_anim_data, eo = a.get_anim_state, to = a.__wbg_exportedentity_free, ro = a.__wbg_get_exportedentity_type_int, so = a.__wbg_set_exportedentity_type_int, oo = a.__wbg_get_exportedentity_x, no = a.__wbg_set_exportedentity_x, _o = a.__wbg_get_exportedentity_y, io = a.__wbg_set_exportedentity_y, lo = a.__wbg_get_exportedentity_deg, ao = a.__wbg_set_exportedentity_deg, co = a.__wbg_get_exportedentity_switch_x, uo = a.__wbg_set_exportedentity_switch_x, po = a.__wbg_get_exportedentity_switch_y, ho = a.__wbg_set_exportedentity_switch_y, fo = a.__wbg_replay_free, go = a.replay_from_attract, wo = a.replay_send_past_ninjas, yo = a.replay_set_input, mo = a.replay_tick, bo = a.replay_seek, xo = a.replay_seek_preview, vo = a.replay_place_ninja, $o = a.replay_replay_length, ko = a.replay_progress, So = a.replay_progress_preview, Do = a.replay_tiles_path, To = a.replay_ninja_x, Po = a.replay_ninja_y, Eo = a.replay_ninja_preview_x, Lo = a.replay_ninja_preview_y, Ao = a.replay_ninja_bones, Mo = a.replay_ninja_preview_bones, jo = a.replay_mines_len, Co = a.replay_mine_x, No = a.replay_mine_y, Oo = a.replay_mine_state, Io = a.replay_bounce_blocks_len, Bo = a.replay_bounce_block_x, Ko = a.replay_bounce_block_y, Ro = a.replay_bounce_block_deg, Go = a.replay_one_ways_len, qo = a.replay_one_way_x, Uo = a.replay_one_way_y, Wo = a.replay_one_way_deg, Fo = a.replay_boost_pads_len, Vo = a.replay_boost_pad_x, Ho = a.replay_boost_pad_y, Yo = a.replay_boost_pad_deg, zo = a.replay_boost_pad_anim_progress, Xo = a.replay_exit_doors_len, Zo = a.replay_exit_door_x, Jo = a.replay_exit_door_y, Qo = a.replay_exit_anim_progress, en = a.replay_exit_switch_x, tn = a.replay_exit_switch_y, rn = a.replay_thwumps_len, sn = a.replay_thwump_x, on = a.replay_thwump_y, nn = a.replay_thwump_deg, _n = a.replay_launch_pads_len, ln = a.replay_launch_pad_x, an = a.replay_launch_pad_y, cn = a.replay_launch_pad_deg, dn = a.replay_floor_guards_len, un = a.replay_floor_guard_x, pn = a.replay_floor_guard_y, hn = a.replay_floor_guard_deg, fn = a.replay_locked_doors_len, gn = a.replay_locked_door_x, wn = a.replay_locked_door_y, yn = a.replay_locked_door_deg, mn = a.replay_locked_door_anim_progress, bn = a.replay_locked_switch_x, xn = a.replay_locked_switch_y, vn = a.replay_trap_doors_len, $n = a.replay_trap_door_x, kn = a.replay_trap_door_y, Sn = a.replay_trap_door_deg, Dn = a.replay_trap_door_anim_progress, Tn = a.replay_trap_switch_x, Pn = a.replay_trap_switch_y, En = a.replay_regular_doors_len, Ln = a.replay_regular_door_x, An = a.replay_regular_door_y, Mn = a.replay_regular_door_deg, jn = a.replay_regular_door_anim_progress, Cn = a.replay_shove_thwumps_len, Nn = a.replay_shove_thwump_x, On = a.replay_shove_thwump_y, In = a.replay_shove_thwump_deg, Bn = a.replay_shove_thwump_touch, Kn = a.editor_press_y, Rn = a.editor_press_u, Gn = a.editor_press_h, qn = a.editor_press_j, Un = a.editor_press_k, Wn = a.editor_press_l, Fn = a.editor_press_num_1, Vn = a.editor_press_num_2, Hn = a.editor_press_num_4, Yn = a.editor_press_num_5, zn = a.__wbindgen_externrefs, Xn = a.__wbindgen_malloc, Zn = a.__externref_table_dealloc, Jn = a.__wbindgen_free, Qn = a.__wbindgen_realloc, e_ = a.__externref_drop_slice, Mt = a.__wbindgen_start, t_ = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: e_,
    __externref_table_dealloc: Zn,
    __wbg_editor_free: Mr,
    __wbg_exportedentity_free: to,
    __wbg_get_exportedentity_deg: lo,
    __wbg_get_exportedentity_switch_x: co,
    __wbg_get_exportedentity_switch_y: po,
    __wbg_get_exportedentity_type_int: ro,
    __wbg_get_exportedentity_x: oo,
    __wbg_get_exportedentity_y: _o,
    __wbg_replay_free: fo,
    __wbg_set_exportedentity_deg: ao,
    __wbg_set_exportedentity_switch_x: uo,
    __wbg_set_exportedentity_switch_y: ho,
    __wbg_set_exportedentity_type_int: so,
    __wbg_set_exportedentity_x: no,
    __wbg_set_exportedentity_y: io,
    __wbindgen_externrefs: zn,
    __wbindgen_free: Jn,
    __wbindgen_malloc: Xn,
    __wbindgen_realloc: Qn,
    __wbindgen_start: Mt,
    editor_crosshair_x: zr,
    editor_crosshair_y: Xr,
    editor_cursor_down: Wr,
    editor_cursor_up: Fr,
    editor_double_click: Vr,
    editor_entities: Zr,
    editor_export_map: Or,
    editor_get_level_name: Ir,
    editor_load_attract: Cr,
    editor_load_map: Nr,
    editor_mode: Rr,
    editor_new: jr,
    editor_past_ninja_x: Zs,
    editor_past_ninja_y: Js,
    editor_past_ninjas_len: Xs,
    editor_press_0: fs,
    editor_press_1: _s,
    editor_press_2: is,
    editor_press_3: ls,
    editor_press_4: as,
    editor_press_5: cs,
    editor_press_6: ds,
    editor_press_7: us,
    editor_press_8: ps,
    editor_press_9: hs,
    editor_press_a: bs,
    editor_press_backtick: ns,
    editor_press_bracket_left: As,
    editor_press_bracket_right: Ms,
    editor_press_c: Ds,
    editor_press_comma: Os,
    editor_press_d: $s,
    editor_press_dash: gs,
    editor_press_e: vs,
    editor_press_equals: ws,
    editor_press_escape: os,
    editor_press_f: js,
    editor_press_h: Gn,
    editor_press_i: Ps,
    editor_press_j: qn,
    editor_press_k: Un,
    editor_press_l: Wn,
    editor_press_m: Ns,
    editor_press_n: Cs,
    editor_press_num_0: Bs,
    editor_press_num_1: Fn,
    editor_press_num_2: Vn,
    editor_press_num_3: Ks,
    editor_press_num_4: Hn,
    editor_press_num_5: Yn,
    editor_press_num_7: Rs,
    editor_press_o: Es,
    editor_press_p: Ls,
    editor_press_q: ys,
    editor_press_s: xs,
    editor_press_slash: Is,
    editor_press_t: Ts,
    editor_press_u: Rn,
    editor_press_w: ms,
    editor_press_x: Ss,
    editor_press_y: Kn,
    editor_press_z: ks,
    editor_preview_entities: Jr,
    editor_receive_past_ninjas: zs,
    editor_redo: ss,
    editor_release_a: Us,
    editor_release_c: Ys,
    editor_release_d: Vs,
    editor_release_e: Fs,
    editor_release_q: Gs,
    editor_release_s: Ws,
    editor_release_w: qs,
    editor_release_z: Hs,
    editor_selected_tile_outline_path: Qr,
    editor_selected_tiles_path: qr,
    editor_set_cursor_pos: Ur,
    editor_set_level_name: Br,
    editor_show_half_grid: es,
    editor_show_quarter_grid: ts,
    editor_tile_crosshair_col: Hr,
    editor_tile_crosshair_row: Yr,
    editor_tiles_path: Gr,
    editor_to_replay: Kr,
    editor_undo: rs,
    get_anim_state: eo,
    memory: Ar,
    replay_boost_pad_anim_progress: zo,
    replay_boost_pad_deg: Yo,
    replay_boost_pad_x: Vo,
    replay_boost_pad_y: Ho,
    replay_boost_pads_len: Fo,
    replay_bounce_block_deg: Ro,
    replay_bounce_block_x: Bo,
    replay_bounce_block_y: Ko,
    replay_bounce_blocks_len: Io,
    replay_exit_anim_progress: Qo,
    replay_exit_door_x: Zo,
    replay_exit_door_y: Jo,
    replay_exit_doors_len: Xo,
    replay_exit_switch_x: en,
    replay_exit_switch_y: tn,
    replay_floor_guard_deg: hn,
    replay_floor_guard_x: un,
    replay_floor_guard_y: pn,
    replay_floor_guards_len: dn,
    replay_from_attract: go,
    replay_launch_pad_deg: cn,
    replay_launch_pad_x: ln,
    replay_launch_pad_y: an,
    replay_launch_pads_len: _n,
    replay_locked_door_anim_progress: mn,
    replay_locked_door_deg: yn,
    replay_locked_door_x: gn,
    replay_locked_door_y: wn,
    replay_locked_doors_len: fn,
    replay_locked_switch_x: bn,
    replay_locked_switch_y: xn,
    replay_mine_state: Oo,
    replay_mine_x: Co,
    replay_mine_y: No,
    replay_mines_len: jo,
    replay_ninja_bones: Ao,
    replay_ninja_preview_bones: Mo,
    replay_ninja_preview_x: Eo,
    replay_ninja_preview_y: Lo,
    replay_ninja_x: To,
    replay_ninja_y: Po,
    replay_one_way_deg: Wo,
    replay_one_way_x: qo,
    replay_one_way_y: Uo,
    replay_one_ways_len: Go,
    replay_place_ninja: vo,
    replay_progress: ko,
    replay_progress_preview: So,
    replay_regular_door_anim_progress: jn,
    replay_regular_door_deg: Mn,
    replay_regular_door_x: Ln,
    replay_regular_door_y: An,
    replay_regular_doors_len: En,
    replay_replay_length: $o,
    replay_seek: bo,
    replay_seek_preview: xo,
    replay_send_past_ninjas: wo,
    replay_set_input: yo,
    replay_shove_thwump_deg: In,
    replay_shove_thwump_touch: Bn,
    replay_shove_thwump_x: Nn,
    replay_shove_thwump_y: On,
    replay_shove_thwumps_len: Cn,
    replay_thwump_deg: nn,
    replay_thwump_x: sn,
    replay_thwump_y: on,
    replay_thwumps_len: rn,
    replay_tick: mo,
    replay_tiles_path: Do,
    replay_trap_door_anim_progress: Dn,
    replay_trap_door_deg: Sn,
    replay_trap_door_x: $n,
    replay_trap_door_y: kn,
    replay_trap_doors_len: vn,
    replay_trap_switch_x: Tn,
    replay_trap_switch_y: Pn,
    set_anim_data: Qs
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  br(t_);
  Mt();
  function r_({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var s_ = $("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const o_ = [
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
  function et(t) {
    function e() {
      const r = t.bones();
      return r ? o_.map(([s, n]) => `M ${20 * r[s]} ${20 * r[s + 13]} ${20 * r[n]} ${20 * r[n + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = s_();
      return T((s) => {
        var n = t.class, i = r_(t.ninja()), _ = e();
        return n !== s.e && g(r, "class", s.e = n), i !== s.t && g(r, "transform", s.t = i), _ !== s.a && g(r, "d", s.a = _), s;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var n_ = $("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), __ = $("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function i_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function l_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function a_([t, e], r, s) {
    const n = t(), i = r.exit_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), u = {
        x: r.exit_door_x(o),
        y: r.exit_door_y(o),
        animProgress: r.exit_anim_progress(o, s)
      };
      c && i_(c, u) ? _.push(c) : _.push(u);
    }
    e(_);
  }
  function jt(t) {
    const [e] = t.exitDoors;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => p(c_, {
        exitDoor: r
      })
    });
  }
  const V = 11, K = 2.5;
  function c_(t) {
    return (() => {
      var e = n_(), r = e.firstChild, s = r.nextSibling, n = s.nextSibling, i = n.nextSibling, _ = i.nextSibling;
      return T((o) => {
        var c = l_(t.exitDoor), u = -13 + 4 * (1 - t.exitDoor().animProgress), w = 26 - 8 * (1 - t.exitDoor().animProgress), h = `M ${-13 * t.exitDoor().animProgress} 0 v ${-V} h ${-V + K} l ${-K} ${K} v ${2 * (V - K)} l ${K} ${K} h ${V - K} z`, P = `M ${13 * t.exitDoor().animProgress} 0 v ${-V} h ${V - K} l ${K} ${K} v ${2 * (V - K)} l ${-K} ${K} h ${-V + K} z`, D = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * V} v ${t.exitDoor().animProgress * V} h ${-V + K + t.exitDoor().animProgress} l ${-K} ${-K} v ${(1 - t.exitDoor().animProgress) * (-V + K)}`, S = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * V} v ${t.exitDoor().animProgress * V} h ${V - K - t.exitDoor().animProgress} l ${K} ${-K} v ${(1 - t.exitDoor().animProgress) * (-V + K)}`;
        return c !== o.e && g(e, "transform", o.e = c), u !== o.t && g(r, "x", o.t = u), w !== o.a && g(r, "width", o.a = w), h !== o.o && g(s, "d", o.o = h), P !== o.i && g(n, "d", o.i = P), D !== o.n && g(i, "d", o.n = D), S !== o.s && g(_, "d", o.s = S), o;
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
  function d_() {
    return __();
  }
  var u_ = $('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function p_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function h_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function f_([t, e], r, s) {
    const n = t(), i = r.exit_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), u = {
        x: r.exit_switch_x(o),
        y: r.exit_switch_y(o),
        animProgress: r.exit_anim_progress(o, s)
      };
      c && p_(c, u) ? _.push(c) : _.push(u);
    }
    e(_);
  }
  function Ct(t) {
    return p(z, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => p(g_, {
        exitSwitch: e
      })
    });
  }
  const ie = 2;
  function g_(t) {
    return (() => {
      var e = u_(), r = e.firstChild, s = r.nextSibling, n = s.nextSibling;
      return T((i) => {
        var _ = h_(t.exitSwitch), o = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, u = `M ${-2 * t.exitSwitch().animProgress} ${-ie} h ${-ie} v ${2 * ie} h ${ie}`, w = `M ${2 * t.exitSwitch().animProgress} ${-ie} h ${ie} v ${2 * ie} h ${-ie}`;
        return _ !== i.e && g(e, "transform", i.e = _), o !== i.t && g(r, "fill", i.t = o), c !== i.a && g(r, "stroke", i.a = c), u !== i.o && g(s, "d", i.o = u), w !== i.i && g(n, "d", i.i = w), i;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), e;
    })();
  }
  var w_ = $("<svg><use href=#one-way></svg>", false, true, false), y_ = $("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function m_(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function b_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function x_([t, e], r) {
    const s = t(), n = r.one_ways_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.one_way_x(_),
        y: r.one_way_y(_),
        deg: r.one_way_deg(_)
      };
      o && m_(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Nt(t) {
    const [e] = t.oneWays;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = w_();
        return T(() => g(s, "transform", b_(r))), s;
      })()
    });
  }
  function Ot() {
    return (() => {
      var t = y_(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var v_ = $("<svg><use></svg>", false, true, false), $_ = $("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), k_ = $("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), S_ = $("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const D_ = 0, T_ = 1;
  function P_(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function E_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function L_([t, e], r) {
    const s = t(), n = r.mines_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.mine_x(_),
        y: r.mine_y(_),
        type: r.mine_state(_)
      };
      o && P_(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function It(t) {
    const [e] = t.mines;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = v_();
        return T((n) => {
          var i = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][r().type], _ = E_(r);
          return i !== n.e && g(s, "href", n.e = i), _ !== n.t && g(s, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), s;
      })()
    });
  }
  function Bt() {
    return [
      (() => {
        var t = $_(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, n = s.nextSibling, i = n.nextSibling;
        return i.nextSibling, t;
      })(),
      (() => {
        var t = k_();
        return t.firstChild, t;
      })(),
      (() => {
        var t = S_();
        return t.firstChild, t;
      })()
    ];
  }
  var A_ = $("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), M_ = $("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), j_ = $("<svg><g class=regular-door></svg>", false, true, false);
  function C_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function N_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function O_([t, e], r, s) {
    const n = t(), i = r.regular_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), u = {
        x: r.regular_door_x(o),
        y: r.regular_door_y(o),
        deg: r.regular_door_deg(o),
        animProgress: r.regular_door_anim_progress(o, s)
      };
      c && C_(c, u) ? _.push(c) : _.push(u);
    }
    e(_);
  }
  function Kt(t) {
    const [e] = t.regularDoors;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => p(K_, {
        regularDoor: r
      })
    });
  }
  const I_ = 1, B_ = 12 - I_;
  function K_(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (B_ - 0) * r;
    }
    return (() => {
      var r = j_();
      return v(r, p(Z, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var s = A_();
              return T(() => g(s, "x2", -e())), s;
            })(),
            (() => {
              var s = M_();
              return T(() => g(s, "x2", e())), s;
            })()
          ];
        }
      })), T(() => g(r, "transform", N_(t.regularDoor))), r;
    })();
  }
  var R_ = $("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), G_ = $("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), ut = $("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), q_ = $("<svg><g class=locked-door></svg>", false, true, false);
  function U_(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function W_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function F_([t, e], r, s) {
    const n = t(), i = r.locked_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), u = {
        x: r.locked_door_x(o),
        y: r.locked_door_y(o),
        deg: r.locked_door_deg(o),
        animProgress: r.locked_door_anim_progress(o, s)
      };
      c && U_(c, u) ? _.push(c) : _.push(u);
    }
    e(_);
  }
  function Rt(t) {
    const [e] = t.lockedDoors;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => p(Y_, {
        lockedDoor: r
      })
    });
  }
  const V_ = 1, H_ = 12 - V_;
  function Y_(t) {
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
      return n = Math.min(Math.max((n - 0.4) / 0.6, 0), 1), 0 + (H_ - 0) * n;
    }
    return (() => {
      var n = q_();
      return v(n, p(Z, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var i = R_();
              return T(() => g(i, "x2", -s())), i;
            })(),
            (() => {
              var i = G_();
              return T(() => g(i, "x2", s())), i;
            })()
          ];
        }
      }), null), v(n, p(Z, {
        get when() {
          return t.lockedDoor().animProgress < 0.5;
        },
        get children() {
          return [
            (() => {
              var i = ut();
              return T((_) => {
                var o = e(), c = r();
                return o !== _.e && g(i, "x1", _.e = o), c !== _.t && g(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = ut();
              return T((_) => {
                var o = -e(), c = -r();
                return o !== _.e && g(i, "x1", _.e = o), c !== _.t && g(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      }), null), T(() => g(n, "transform", W_(t.lockedDoor))), n;
    })();
  }
  var z_ = $("<svg><use></svg>", false, true, false), X_ = $("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), Z_ = $("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function J_(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function Q_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function ei([t, e], r) {
    const s = t(), n = r.locked_doors_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.locked_switch_x(_),
        y: r.locked_switch_y(_),
        wasTouched: r.locked_door_anim_progress(_, 1) >= 0
      };
      o && J_(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Gt(t) {
    const [e] = t.lockedSwitches;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = z_();
        return T((n) => {
          var i = r().wasTouched ? "#locked-switch-touched" : "#locked-switch", _ = Q_(r);
          return i !== n.e && g(s, "href", n.e = i), _ !== n.t && g(s, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), s;
      })()
    });
  }
  function qt() {
    return [
      (() => {
        var t = X_(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = Z_(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var ti = $("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), pt = $("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), ri = $("<svg><g></svg>", false, true, false);
  function si(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function oi(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ni([t, e], r, s) {
    const n = t(), i = r.trap_doors_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), u = {
        x: r.trap_door_x(o),
        y: r.trap_door_y(o),
        deg: r.trap_door_deg(o),
        animProgress: r.trap_door_anim_progress(o, s)
      };
      c && si(c, u) ? _.push(c) : _.push(u);
    }
    e(_);
  }
  function Ut(t) {
    const [e] = t.trapDoors;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => p(li, {
        trapDoor: r
      })
    });
  }
  const _i = 1, ii = 12 - _i;
  function li(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function s() {
      let n = t.trapDoor().animProgress;
      return 0 + (ii - 0) * n;
    }
    return (() => {
      var n = ri();
      return v(n, p(Z, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var i = ti();
              return T((_) => {
                var o = -s(), c = s();
                return o !== _.e && g(i, "x1", _.e = o), c !== _.t && g(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = pt();
              return T((_) => {
                var o = e(), c = r();
                return o !== _.e && g(i, "x1", _.e = o), c !== _.t && g(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = pt();
              return T((_) => {
                var o = -e(), c = -r();
                return o !== _.e && g(i, "x1", _.e = o), c !== _.t && g(i, "x2", _.t = c), _;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      })), T(() => g(n, "transform", oi(t.trapDoor))), n;
    })();
  }
  var ai = $("<svg><use></svg>", false, true, false), ci = $("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), di = $("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function ui(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function pi(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function hi([t, e], r) {
    const s = t(), n = r.trap_doors_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.trap_switch_x(_),
        y: r.trap_switch_y(_),
        wasTouched: r.trap_door_anim_progress(_, 1) >= 0
      };
      o && ui(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Wt(t) {
    const [e] = t.trapSwitches;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = ai();
        return T((n) => {
          var i = r().wasTouched ? "#trap-switch-touched" : "#trap-switch", _ = pi(r);
          return i !== n.e && g(s, "href", n.e = i), _ !== n.t && g(s, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), s;
      })()
    });
  }
  function Ft() {
    return [
      (() => {
        var t = ci();
        return t.firstChild, t;
      })(),
      (() => {
        var t = di(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var fi = $("<svg><g class=launch-pad><rect x=0 y=-7.5 width=1.5 height=15></rect><line stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function gi(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function wi(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function yi([t, e], r) {
    const s = t(), n = r.launch_pads_len(), i = [];
    for (let _ = 0; _ < n; _++) {
      const o = s.at(_), c = {
        x: r.launch_pad_x(_),
        y: r.launch_pad_y(_),
        deg: r.launch_pad_deg(_)
      };
      o && gi(o, c) ? i.push(o) : i.push(c);
    }
    e(i);
  }
  function Vt(t) {
    const [e] = t.launchPads;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => p(mi, {
        launchPad: r
      })
    });
  }
  function mi(t) {
    return (() => {
      var e = fi(), r = e.firstChild;
      return r.nextSibling, T(() => g(e, "transform", wi(t.launchPad))), e;
    })();
  }
  var bi = $('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function xi(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function vi(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function $i([t, e], r, s) {
    const n = t(), i = r.floor_guards_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), u = {
        x: r.floor_guard_x(o, s),
        y: r.floor_guard_y(o, s),
        deg: r.floor_guard_deg(o)
      };
      c && xi(c, u) ? _.push(c) : _.push(u);
    }
    e(_);
  }
  function Ht(t) {
    const [e] = t.floorGuards;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => p(ki, {
        floorGuard: r
      })
    });
  }
  function ki(t) {
    return (() => {
      var e = bi();
      return e.firstChild, T(() => g(e, "transform", vi(t.floorGuard))), e;
    })();
  }
  var Si = $("<svg><use href=#bounceblock></svg>", false, true, false), Di = $('<svg><g id=bounceblock><path id=bounceblockFill d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path id=bounceblockStroke d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function Ti(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Pi(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Ei([t, e], r, s) {
    const n = t(), i = r.bounce_blocks_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), u = {
        x: r.bounce_block_x(o, s),
        y: r.bounce_block_y(o, s),
        deg: r.bounce_block_deg(o)
      };
      c && Ti(c, u) ? _.push(c) : _.push(u);
    }
    e(_);
  }
  function Yt(t) {
    const [e] = t.bounceBlocks;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = Si();
        return T(() => g(s, "transform", Pi(r))), s;
      })()
    });
  }
  function zt() {
    return (() => {
      var t = Di(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var Li = $("<svg><use href=#boostpad></svg>", false, true, false), Ai = $("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function Mi(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function ji(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Ci([t, e], r, s) {
    const n = t(), i = r.boost_pads_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), u = {
        x: r.boost_pad_x(o),
        y: r.boost_pad_y(o),
        deg: r.boost_pad_deg(o, s),
        animProgress: r.boost_pad_anim_progress(o, s)
      };
      c && Mi(c, u) ? _.push(c) : _.push(u);
    }
    e(_);
  }
  function Xt(t) {
    const [e] = t.boostPads;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = Li();
        return T((n) => {
          var i = `color-mix(in srgb-linear, var(--boost-pad) ${r().animProgress * 100}%, var(--boost-pad-wooshing))`, _ = ji(r);
          return i !== n.e && g(s, "stroke", n.e = i), _ !== n.t && g(s, "transform", n.t = _), n;
        }, {
          e: void 0,
          t: void 0
        }), s;
      })()
    });
  }
  function Zt() {
    return (() => {
      var t = Ai(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, n = s.nextSibling;
      return n.nextSibling, t;
    })();
  }
  var Ni = $("<svg><use href=#thwump></svg>", false, true, false), Oi = $('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function Ii(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Bi(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Ki([t, e], r, s) {
    const n = t(), i = r.thwumps_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), u = {
        x: r.thwump_x(o, s),
        y: r.thwump_y(o, s),
        deg: r.thwump_deg(o)
      };
      c && Ii(c, u) ? _.push(c) : _.push(u);
    }
    e(_);
  }
  function Jt(t) {
    const [e] = t.thwumps;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => (() => {
        var s = Ni();
        return T(() => g(s, "transform", Bi(r))), s;
      })()
    });
  }
  function Qt() {
    return (() => {
      var t = Oi(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var Ri = $("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), Gi = $("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function qi(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function Ui(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Wi([t, e], r, s) {
    const n = t(), i = r.shove_thwumps_len(), _ = [];
    for (let o = 0; o < i; o++) {
      const c = n.at(o), u = {
        x: r.shove_thwump_x(o, s),
        y: r.shove_thwump_y(o, s),
        deg: r.shove_thwump_deg(o),
        touch: r.shove_thwump_touch(o)
      };
      c && qi(c, u) ? _.push(c) : _.push(u);
    }
    e(_);
  }
  function er(t) {
    const [e] = t.shoveThwumps;
    return p(z, {
      get each() {
        return e();
      },
      children: (r) => p(Fi, {
        shoveThwump: r
      })
    });
  }
  function Fi(t) {
    return (() => {
      var e = Ri(), r = e.firstChild;
      return v(e, p(tt, {
        each: [
          0,
          2,
          4,
          6
        ],
        children: (s) => p(Z, {
          get when() {
            return t.shoveThwump().touch >= 16 || s === t.shoveThwump().touch;
          },
          get children() {
            var n = Gi(), i = n.firstChild, _ = i.nextSibling;
            return _.nextSibling, g(n, "transform", `rotate(${45 * s},0,0)`), n;
          }
        })
      }), r), T(() => g(e, "transform", Ui(t.shoveThwump))), e;
    })();
  }
  const tr = zi((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function Vi(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function Hi(t) {
    const e = String.fromCharCode(...t);
    localStorage.setItem("animData", e);
  }
  function Yi() {
    const t = localStorage.getItem("animData");
    if (t) {
      const e = Uint8Array.from(t, (r) => r.charCodeAt(0));
      At(e);
    }
  }
  function zi(t, e) {
    let r;
    return (...s) => {
      typeof r == "number" && clearTimeout(r), r = setTimeout(() => t(...s), e);
    };
  }
  var Xi = $('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox checked disabled></label> | Bounce block/thwump/shwump corners <select><option>square</option><option>rounded</option></select><input type=text style=float:right>');
  function Zi(t) {
    return (() => {
      var e = Xi(), r = e.firstChild, s = r.firstChild, n = s.nextSibling, i = r.nextSibling, _ = i.nextSibling, o = _.nextSibling, c = o.nextSibling, u = c.nextSibling, w = u.nextSibling, h = w.firstChild, P = h.nextSibling, D = w.nextSibling;
      return n.addEventListener("change", function() {
        const S = this.files;
        if (S && S.length > 0) {
          const E = new FileReader();
          E.onloadend = () => {
            E.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(E.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, E.readAsArrayBuffer(S[0]);
        }
      }), _.$$click = function() {
        const S = t.editor.export_map(), E = new Blob([
          S.buffer
        ], {
          type: "application/octet-stream"
        }), O = URL.createObjectURL(E);
        this.href = O, this.download = t.editor.get_level_name(), setTimeout(() => URL.revokeObjectURL(O), 100);
      }, w.addEventListener("change", (S) => t.setRoundCorners(S.currentTarget.value == "rounded")), D.addEventListener("change", () => tr(t.editor)), D.$$input = (S) => {
        t.editor.set_level_name(S.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, T((S) => {
        var E = !t.roundCorners(), O = t.roundCorners();
        return E !== S.e && (h.selected = S.e = E), O !== S.t && (P.selected = S.t = O), S;
      }, {
        e: void 0,
        t: void 0
      }), T(() => D.value = t.levelName()), e;
    })();
  }
  qe([
    "click",
    "input"
  ]);
  var Ji = $("<svg><use href=#tilemode-crosshair></svg>", false, true, false), Qi = $("<svg><use href=#crosshair></svg>", false, true, false), el = $('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none></path></g><polyline stroke=black fill=none>'), ht = $("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), ft = $("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), tl = $("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), rl = $("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), sl = $("<svg><line class=door-switch-line></svg>", false, true, false);
  const ze = 42, Xe = 23, gt = 0, ol = 3, wt = 5, nl = 6, _l = 8, il = 0, ll = 1, al = 3, cl = 5, dl = 6, ul = 8, pl = 10, hl = 11, fl = 16, gl = 17, wl = 20, yl = 21, ml = 24, bl = 28, xl = new Float64Array([
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
  ]);
  function yt() {
    const [t, e] = y([]), [r, s] = y([]), [n, i] = y([]), [_, o] = y([]), [c, u] = y([]), [w, h] = y([]), [P, D] = y([]), [S, E] = y([]), [O, L] = y([]), [I, j] = y([]), [k, A] = y([]), [U, W] = y([]), [ne, F] = y([]), [J, _e] = y([]), [M, Y] = y([]), [X, ee] = y([]);
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
      setRegularDoors: u,
      lockedDoors: w,
      setLockedDoors: h,
      lockedSwitches: P,
      setLockedSwitches: D,
      trapDoors: S,
      setTrapDoors: E,
      trapSwitches: O,
      setTrapSwitches: L,
      launchPads: I,
      setLaunchPads: j,
      oneWays: k,
      setOneWays: A,
      floorGuards: U,
      setFloorGuards: W,
      bounceBlocks: ne,
      setBounceBlocks: F,
      thwumps: J,
      setThwumps: _e,
      boostPads: M,
      setBoostPads: Y,
      shoveThwumps: X,
      setShoveThwumps: ee
    };
  }
  function mt(t, e, r, s) {
    const n = [], i = [], _ = [], o = [], c = [], u = [], w = [], h = [], P = [], D = [], S = [], E = [], O = [], L = [], I = [], j = [];
    for (const k of r) {
      const A = {
        x: k.x,
        y: k.y,
        deg: k.deg,
        animProgress: 0
      }, U = {
        x: k.switch_x,
        y: k.switch_y,
        animProgress: 0,
        wasTouched: false
      }, W = {
        x1: k.x,
        y1: k.y,
        x2: k.switch_x,
        y2: k.switch_y
      };
      k.type_int === il ? n.push(A) : k.type_int === ll ? i.push({
        ...A,
        type: D_
      }) : k.type_int === yl ? i.push({
        ...A,
        type: T_
      }) : k.type_int === al ? (_.push(A), Number.isNaN(k.switch_x) || (o.push(U), e.push(W))) : k.type_int === cl ? c.push(A) : k.type_int === dl ? (u.push(A), Number.isNaN(k.switch_x) || (w.push(U), e.push(W))) : k.type_int === ul ? (h.push({
        ...A,
        animProgress: s ? 1 : -1
      }), Number.isNaN(k.switch_x) || (P.push(U), e.push(W))) : k.type_int === pl ? D.push(A) : k.type_int === hl ? S.push(A) : k.type_int === fl ? E.push(A) : k.type_int === gl ? O.push(A) : k.type_int === wl ? L.push(A) : k.type_int === ml ? I.push({
        ...A,
        animProgress: 1
      }) : k.type_int === bl && j.push({
        ...A,
        touch: 16
      }), k.free();
    }
    t.setNinjas(n), t.setMines(i), t.setExitDoors(_), t.setExitSwitches(o), t.setRegularDoors(c), t.setLockedDoors(u), t.setLockedSwitches(w), t.setTrapDoors(h), t.setTrapSwitches(P), t.setLaunchPads(D), t.setOneWays(S), t.setFloorGuards(E), t.setBounceBlocks(O), t.setThwumps(L), t.setBoostPads(I), t.setShoveThwumps(j);
  }
  function bt({ entities: t }) {
    return [
      p(jt, {
        get exitDoors() {
          return [
            t.exitDoors,
            () => {
            }
          ];
        }
      }),
      p(Nt, {
        get oneWays() {
          return [
            t.oneWays,
            () => {
            }
          ];
        }
      }),
      p(It, {
        get mines() {
          return [
            t.mines,
            () => {
            }
          ];
        }
      }),
      p(Kt, {
        get regularDoors() {
          return [
            t.regularDoors,
            () => {
            }
          ];
        }
      }),
      p(Ut, {
        get trapDoors() {
          return [
            t.trapDoors,
            () => {
            }
          ];
        }
      }),
      p(Rt, {
        get lockedDoors() {
          return [
            t.lockedDoors,
            () => {
            }
          ];
        }
      }),
      p(Gt, {
        get lockedSwitches() {
          return [
            t.lockedSwitches,
            () => {
            }
          ];
        }
      }),
      p(Wt, {
        get trapSwitches() {
          return [
            t.trapSwitches,
            () => {
            }
          ];
        }
      }),
      p(Ct, {
        get exitSwitches() {
          return t.exitSwitches;
        }
      }),
      p(Vt, {
        get launchPads() {
          return [
            t.launchPads,
            () => {
            }
          ];
        }
      }),
      p(Ht, {
        get floorGuards() {
          return [
            t.floorGuards,
            () => {
            }
          ];
        }
      }),
      p(Jt, {
        get thwumps() {
          return [
            t.thwumps,
            () => {
            }
          ];
        }
      }),
      p(tt, {
        get each() {
          return t.ninjas();
        },
        children: (e) => p(et, {
          class: "ninja",
          ninja: () => e,
          bones: () => xl
        })
      }),
      p(Yt, {
        get bounceBlocks() {
          return [
            t.bounceBlocks,
            () => {
            }
          ];
        }
      }),
      p(er, {
        get shoveThwumps() {
          return [
            t.shoveThwumps,
            () => {
            }
          ];
        }
      }),
      p(Xt, {
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
  function vl(t) {
    const { editor: e, pastNinjas: r } = t, [s, n] = y(""), [i, _] = y(""), [o, c] = y(true), [u, w] = y(false), [h, P] = y(gt), [D, S] = y({
      row: 1,
      col: 1
    }), [E, O] = y({
      x: 24,
      y: 24
    }), [L, I] = y(""), j = yt(), k = yt(), [A, U] = y([]), W = (d) => {
      let f = false;
      if (!(d.target instanceof HTMLInputElement)) {
        if (d.ctrlKey || d.metaKey) {
          d.code === "KeyZ" && (d.ctrlKey || d.metaKey) && d.shiftKey ? (f = true, e.redo()) : d.code === "KeyZ" && (d.ctrlKey || d.metaKey) ? (f = true, e.undo()) : d.code === "KeyY" && (d.ctrlKey || d.metaKey) && (f = true, e.redo()), f && (F(true), d.preventDefault());
          return;
        }
        d.code === "Backquote" ? (f = true, e.press_backtick()) : d.code === "Digit1" ? (f = true, e.press_1(d.shiftKey)) : d.code === "Digit2" ? (f = true, e.press_2(d.shiftKey)) : d.code === "Digit3" ? (f = true, e.press_3(d.shiftKey)) : d.code === "Digit4" ? (f = true, e.press_4(d.shiftKey)) : d.code === "Digit5" ? (f = true, e.press_5(d.shiftKey)) : d.code === "Digit6" ? (f = true, e.press_6(d.shiftKey)) : d.code === "Digit7" ? (f = true, e.press_7(d.shiftKey)) : d.code === "Digit8" ? (f = true, e.press_8(d.shiftKey)) : d.code === "Digit9" ? (f = true, e.press_9()) : d.code === "Digit0" ? (f = true, e.press_0()) : d.code === "Minus" ? (f = true, e.press_dash()) : d.code === "Equal" ? (f = true, e.press_equals()) : d.code === "KeyQ" ? (f = true, e.press_q(d.shiftKey)) : d.code === "KeyW" ? (f = true, e.press_w(d.shiftKey)) : d.code === "KeyA" ? (f = true, e.press_a(d.shiftKey)) : d.code === "KeyS" ? (f = true, e.press_s(d.shiftKey)) : d.code === "KeyE" ? (f = true, e.press_e()) : d.code === "KeyD" ? (f = true, e.press_d()) : d.code === "KeyZ" ? (f = true, e.press_z()) : d.code === "KeyX" ? (f = true, e.press_x()) : d.code === "KeyC" ? (f = true, e.press_c()) : d.code === "KeyT" ? (f = true, e.press_t()) : d.code === "KeyY" ? (f = true, e.press_y()) : d.code === "KeyU" ? (f = true, e.press_u()) : d.code === "KeyI" ? (f = true, e.press_i()) : d.code === "KeyO" ? (f = true, e.press_o()) : d.code === "KeyP" ? (f = true, e.press_p()) : d.code === "BracketLeft" ? (f = true, e.press_bracket_left()) : d.code === "BracketRight" ? (f = true, e.press_bracket_right()) : d.code === "KeyF" ? (f = true, e.press_f()) : d.code === "KeyH" ? (f = true, e.press_h()) : d.code === "KeyJ" ? (f = true, e.press_j()) : d.code === "KeyK" ? (f = true, e.press_k()) : d.code === "KeyL" ? (f = true, e.press_l()) : d.code === "KeyN" ? (f = true, e.press_n()) : d.code === "KeyM" ? (f = true, e.press_m()) : d.code === "Comma" ? (f = true, e.press_comma()) : d.code === "Escape" ? f = e.press_escape() : d.code === "Slash" && (f = true, e.press_slash()), f && (F(true), d.preventDefault());
      }
    }, ne = (d) => {
      let f = false;
      d.code === "KeyQ" ? (f = true, e.release_q()) : d.code === "KeyW" ? (f = true, e.release_w()) : d.code === "KeyA" ? (f = true, e.release_a()) : d.code === "KeyS" ? (f = true, e.release_s()) : d.code === "KeyE" ? (f = true, e.release_e()) : d.code === "KeyD" ? (f = true, e.release_d()) : d.code === "KeyZ" ? (f = true, e.release_z()) : d.code === "KeyC" && (f = true, e.release_c()), f && (F(false), d.preventDefault());
    };
    document.addEventListener("keydown", W), document.addEventListener("keyup", ne), ue(() => {
      document.removeEventListener("keydown", W), document.removeEventListener("keyup", ne);
    });
    function F(d) {
      P(e.mode()), n(e.tiles_path()), _(e.selected_tiles_path()), S({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), w(e.show_quarter_grid()), O({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const f = [];
      mt(j, f, e.entities(), false), mt(k, f, e.preview_entities(), true), U(f), I(e.selected_tile_outline_path()), d && tr(e);
    }
    const J = [];
    for (let d = 0; d < ze - 1; d++) J.push(48 + 24 * d);
    const _e = [];
    for (let d = 0; d < Xe - 1; d++) _e.push(48 + 24 * d);
    const M = [];
    for (let d = 0; d < ze; d++) M.push(36 + 24 * d);
    const Y = [];
    for (let d = 0; d < Xe; d++) Y.push(36 + 24 * d);
    const X = [];
    for (let d = 0; d < ze * 2; d++) X.push(30 + 12 * d);
    const ee = [];
    for (let d = 0; d < Xe * 2; d++) ee.push(30 + 12 * d);
    return F(false), [
      (() => {
        var d = el(), f = d.firstChild, Pe = f.firstChild, te = Pe.nextSibling;
        te.nextSibling;
        var se = f.nextSibling, he = se.nextSibling, $e = he.nextSibling, fe = $e.nextSibling, rt = fe.firstChild, ae = fe.nextSibling;
        return d.$$contextmenu = (m) => {
          e.press_escape() && (F(false), m.preventDefault());
        }, d.$$mouseup = () => {
          e.cursor_up(), F(false);
        }, d.$$dblclick = (m) => {
          e.double_click(m.shiftKey), F(false);
        }, d.$$mousedown = (m) => {
          m.buttons & 2 || (e.cursor_down(m.shiftKey), F(true));
        }, d.$$mousemove = function(m) {
          const { left: x, top: B, width: G, height: b } = this.getBoundingClientRect(), C = e.set_cursor_pos((m.clientX - x) / G * 1056, (m.clientY - B) / b * 600, m.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (m.clientX - x) / G * 1056,
            y: (m.clientY - B) / b * 600
          }), C && F(false);
        }, v(f, p(Bt, {}), te), v(f, p(Ot, {}), te), v(f, p(zt, {}), te), v(f, p(qt, {}), te), v(f, p(Ft, {}), te), v(f, p(Zt, {}), te), v(f, p(Qt, {}), te), v(d, p(Z, {
          get when() {
            return u();
          },
          get children() {
            return [
              ye(() => X.map((m) => (() => {
                var x = ht();
                return g(x, "x1", m), g(x, "x2", m), x;
              })())),
              ye(() => ee.map((m) => (() => {
                var x = ft();
                return g(x, "y1", m), g(x, "y2", m), x;
              })()))
            ];
          }
        }), se), v(d, p(Z, {
          get when() {
            return o();
          },
          get children() {
            return [
              ye(() => M.map((m) => (() => {
                var x = ht();
                return g(x, "x1", m), g(x, "x2", m), x;
              })())),
              ye(() => Y.map((m) => (() => {
                var x = ft();
                return g(x, "y1", m), g(x, "y2", m), x;
              })()))
            ];
          }
        }), se), v(d, () => J.map((m) => (() => {
          var x = tl();
          return g(x, "x1", m), g(x, "x2", m), x;
        })()), se), v(d, () => _e.map((m) => (() => {
          var x = rl();
          return g(x, "y1", m), g(x, "y2", m), x;
        })()), se), v(d, p(bt, {
          entities: j
        }), se), v(he, p(bt, {
          entities: k
        })), v(d, p(tt, {
          get each() {
            return A();
          },
          children: (m) => (() => {
            var x = sl();
            return T((B) => {
              var G = m.x1, b = m.y1, C = m.x2, N = m.y2;
              return G !== B.e && g(x, "x1", B.e = G), b !== B.t && g(x, "y1", B.t = b), C !== B.a && g(x, "x2", B.a = C), N !== B.o && g(x, "y2", B.o = N), B;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), x;
          })()
        }), fe), v(d, p(Z, {
          get when() {
            return h() === gt;
          },
          get children() {
            var m = Ji();
            return T((x) => {
              var B = D().col * 24 + 12, G = D().row * 24 + 12;
              return B !== x.e && g(m, "x", x.e = B), G !== x.t && g(m, "y", x.t = G), x;
            }, {
              e: void 0,
              t: void 0
            }), m;
          }
        }), ae), v(d, p(Z, {
          get when() {
            return h() === _l || h() === wt;
          },
          get children() {
            var m = Qi();
            return T((x) => {
              var B = E().x, G = E().y;
              return B !== x.e && g(m, "x", x.e = B), G !== x.t && g(m, "y", x.t = G), x;
            }, {
              e: void 0,
              t: void 0
            }), m;
          }
        }), ae), T((m) => {
          var x = s(), B = [
            ol,
            wt,
            nl
          ].includes(h()) ? "url(#outline)" : "", G = i(), b = L(), C = r().map(({ x: N, y: oe }) => `${N},${oe}`).join(" ");
          return x !== m.e && g(se, "d", m.e = x), B !== m.t && g(he, "filter", m.t = B), G !== m.a && g($e, "d", m.a = G), b !== m.o && g(rt, "d", m.o = b), C !== m.i && g(ae, "points", m.i = C), m;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        }), d;
      })(),
      p(Zi, {
        editor: e,
        render: F,
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
  qe([
    "mousemove",
    "mousedown",
    "dblclick",
    "mouseup",
    "contextmenu"
  ]);
  var $l = $("<div id=media-controls><div class=text-button><div>\u23FA</div></div><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb>");
  function kl(t) {
    const e = () => {
      const o = t.progress(), c = t.length();
      return c === 0 || o >= c ? "100%" : `${o / c * 100}%`;
    }, r = () => {
      const o = t.progress(), c = t.previewProgress(), u = t.length();
      if (c === void 0 || u === 0) return {
        left: "0%",
        width: "0%"
      };
      const w = Math.min(o, c), h = Math.min(Math.max(o, c), u);
      return {
        left: `${w / u * 100}%`,
        width: `${(h - w) / u * 100}%`
      };
    };
    let s;
    document.addEventListener("mousemove", i), ue(() => document.removeEventListener("mousemove", i)), document.addEventListener("mouseup", _), ue(() => document.removeEventListener("mouseup", _));
    function n(o) {
      if (s) {
        const { left: c, top: u, width: w } = s.getBoundingClientRect();
        let h = (o.clientX - c) / w;
        h = Math.min(1, h), h = Math.max(0, h);
        let P = Math.abs(o.clientY - u);
        return {
          targetFrame: Math.round(h * t.length()),
          strength: Math.pow(Math.E, -5 * P / w)
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
          const { targetFrame: u, strength: w } = n(o);
          t.seek(Math.round(c + (u - c) * w)), t.previewSeek(void 0);
        } else s.matches(":hover") ? t.previewSeek(n(o).targetFrame) : t.previewSeek(void 0);
      }
    }
    function _() {
      t.setDragStart(void 0);
    }
    return (() => {
      var o = $l(), c = o.firstChild, u = c.nextSibling, w = u.firstChild, h = u.nextSibling, P = h.firstChild, D = P.nextSibling, S = D.nextSibling, E = S.nextSibling;
      c.$$click = () => {
        t.setRecording(!t.recording());
      }, u.$$click = () => {
        t.isPlaying() ? t.setIsPlaying(false) : (t.progress() >= t.length() && !t.recording() && t.seek(0), t.setIsPlaying(true));
      }, v(w, p(pr, {
        get children() {
          return [
            p(st, {
              get when() {
                return !t.isPlaying();
              },
              children: "\u25B6"
            }),
            p(st, {
              get when() {
                return t.isPlaying();
              },
              children: "\u23F8"
            })
          ];
        }
      })), h.$$mousedown = (L) => {
        t.setDragStart(n(L).targetFrame), i(L), L.preventDefault();
      };
      var O = s;
      return typeof O == "function" ? gr(O, h) : s = h, T((L) => {
        var I = !!t.recording(), j = e(), k = r().left, A = r().width, U = e();
        return I !== L.e && c.classList.toggle("recording", L.e = I), j !== L.t && Ee(D, "width", L.t = j), k !== L.a && Ee(S, "left", L.a = k), A !== L.o && Ee(S, "width", L.o = A), U !== L.i && Ee(E, "left", L.i = U), L;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), o;
    })();
  }
  qe([
    "click",
    "mousedown"
  ]);
  var Sl = $('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), Dl = $("<div>");
  function Tl(t) {
    const e = t.replay, [r, s] = y(true), [n, i] = y(true), [_, o] = y(void 0), [c, u] = y(0), [w, h] = y(0), [P, D] = y(void 0), S = (b) => {
      b.code === "Enter" && (e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), n() || G(1));
    };
    document.addEventListener("keydown", S), ue(() => {
      document.removeEventListener("keydown", S);
    });
    const E = () => e.tiles_path(), [O, L] = y({
      x: -50,
      y: -50,
      deg: 0
    }), [I, j] = y({
      x: -50,
      y: -50,
      deg: 0
    }), [k, A] = y(), [U, W] = y(), ne = y([]), F = y([]), J = y([]), _e = y([]), M = y([]), Y = y([]), X = y([]), ee = y([]), d = y([]), f = y([]), Pe = y([]), te = y([]), se = y([]), he = y([]), $e = y([]);
    let fe = performance.now();
    const ae = 1e3 / 60;
    let m = 0, x = 0;
    function B() {
      const b = performance.now(), C = Math.min(b - fe, 250);
      fe = b;
      let N = 1;
      const oe = e;
      if (n() && _() === void 0) {
        if (r() || w() < c()) {
          for (m += C; m >= ae; ) {
            if (r()) {
              let { isJump1Pressed: Ue, isJump2Pressed: We, isRightPressed: Fe, isLeftPressed: Ve, isSuicidePressed: rr } = t.globalEventState;
              oe.set_input(Ue() || We(), Fe(), Ve(), rr());
            }
            oe.tick(), m -= ae;
          }
          N = m / ae, h(oe.progress());
        } else w() < c() ? (oe.tick(), h(oe.progress())) : i(false);
        G(N);
      }
      x = requestAnimationFrame(B);
    }
    B(), ue(() => {
      cancelAnimationFrame(x);
    });
    function G(b) {
      L({
        x: e.ninja_x(b),
        y: e.ninja_y(b),
        deg: 0
      }), j({
        x: e.ninja_preview_x(b),
        y: e.ninja_preview_y(b),
        deg: 0
      }), A(e.ninja_bones(b)), P() === void 0 ? W(void 0) : W(e.ninja_preview_bones(b)), L_(ne, e), Ei(F, e, b), x_(J, e), Ci(_e, e, b), Ki(M, e, b), yi(Y, e), $i(X, e, b), F_(ee, e, b), ei(d, e), ni(f, e, b), hi(Pe, e), O_(te, e, b), Wi(se, e, b), a_(he, e, b), f_($e, e, b), u(e.replay_length());
    }
    return [
      (() => {
        var b = Sl(), C = b.firstChild;
        C.firstChild;
        var N = C.nextSibling;
        return b.$$mousemove = function(oe) {
          const { left: Ue, top: We, width: Fe, height: Ve } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (oe.clientX - Ue) / Fe * 1056,
            y: (oe.clientY - We) / Ve * 600
          });
        }, v(C, p(Bt, {}), null), v(C, p(zt, {}), null), v(C, p(Ot, {}), null), v(C, p(qt, {}), null), v(C, p(Ft, {}), null), v(C, p(Zt, {}), null), v(C, p(Qt, {}), null), v(C, p(d_, {}), null), v(b, p(jt, {
          exitDoors: he
        }), N), v(b, p(Nt, {
          oneWays: J
        }), N), v(b, p(It, {
          mines: ne
        }), N), v(b, p(Kt, {
          regularDoors: te
        }), N), v(b, p(Rt, {
          lockedDoors: ee
        }), N), v(b, p(Ut, {
          trapDoors: f
        }), N), v(b, p(Gt, {
          lockedSwitches: d
        }), N), v(b, p(Wt, {
          trapSwitches: Pe
        }), N), v(b, p(Ct, {
          get exitSwitches() {
            return $e[0];
          }
        }), N), v(b, p(Vt, {
          launchPads: Y
        }), N), v(b, p(Ht, {
          floorGuards: X
        }), N), v(b, p(Jt, {
          thwumps: M
        }), N), v(b, p(et, {
          class: "ninja preview",
          ninja: I,
          bones: U
        }), N), v(b, p(et, {
          class: "ninja",
          ninja: O,
          bones: k
        }), N), v(b, p(Yt, {
          bounceBlocks: F
        }), N), v(b, p(er, {
          shoveThwumps: se
        }), N), v(b, p(Xt, {
          boostPads: _e
        }), N), T(() => g(N, "d", E())), b;
      })(),
      (() => {
        var b = Dl();
        return v(b, p(kl, {
          recording: r,
          setRecording: s,
          isPlaying: n,
          setIsPlaying: i,
          dragStart: _,
          setDragStart: o,
          length: c,
          progress: w,
          previewProgress: P,
          seek: (C) => {
            h(C), e.seek(C), G(1);
          },
          previewSeek: (C) => {
            D(C), e && (C !== void 0 && _() === void 0 && e.seek_preview(C), G(1));
          }
        })), b;
      })()
    ];
  }
  qe([
    "mousemove"
  ]);
  var Pl = $("<p>Invalid file."), El = $("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file>");
  function Ll() {
    const t = xe.new(), [e, r] = y(), [s, n] = y(""), [i, _] = y(false), [o, c] = y([]);
    function u() {
      const M = [], Y = t.past_ninjas_len();
      for (let X = 0; X < Y; X++) M.push({
        x: t.past_ninja_x(X),
        y: t.past_ninja_y(X)
      });
      c(M);
    }
    const [w, h] = y(false), [P, D] = y(false), [S, E] = y(false), [O, L] = y(false), [I, j] = y(false), [k, A] = y({
      x: 36,
      y: 36
    }), U = {
      isJump1Pressed: w,
      isJump2Pressed: P,
      isRightPressed: S,
      isLeftPressed: O,
      isSuicidePressed: I,
      mouseGamePos: k,
      setMouseGamePos: A
    };
    Vi(t), n(t.get_level_name()), document.addEventListener("keydown", (M) => {
      if (!(M.ctrlKey || M.metaKey)) if (M.code === "Tab") {
        const Y = e();
        Y ? (r(void 0), Y.send_past_ninjas(), t.receive_past_ninjas(), Y.free(), u()) : r(t.to_replay(i())), M.preventDefault();
      } else M.code === "KeyZ" ? h(true) : M.code === "ArrowUp" ? D(true) : M.code === "ArrowRight" ? E(true) : M.code === "ArrowLeft" ? L(true) : M.code === "KeyV" && j(true);
    }), document.addEventListener("keyup", (M) => {
      M.code === "KeyZ" ? h(false) : M.code === "ArrowUp" ? D(false) : M.code === "ArrowRight" ? E(false) : M.code === "ArrowLeft" ? L(false) : M.code === "KeyV" && j(false);
    }), document.addEventListener("blur", () => {
      h(false), D(false), E(false), L(false), j(false);
    }), Yi();
    const W = 0, ne = 1, F = 2, [J, _e] = y(it() == W ? W : F);
    return [
      p(Z, {
        get when() {
          return J() != W;
        },
        get children() {
          var M = El(), Y = M.firstChild, X = Y.nextSibling;
          return X.addEventListener("change", function() {
            const ee = this.files;
            if (ee && ee.length > 0) {
              const d = new FileReader();
              d.onloadend = () => {
                if (d.result instanceof ArrayBuffer) {
                  const f = new Uint8Array(d.result);
                  Hi(f), At(f), _e(it());
                }
              }, d.readAsArrayBuffer(ee[0]);
            }
          }), v(M, p(Z, {
            get when() {
              return J() == ne;
            },
            get children() {
              return Pl();
            }
          }), null), M;
        }
      }),
      p(Z, {
        get when() {
          return ye(() => J() == W)() && !e();
        },
        get children() {
          return p(vl, {
            editor: t,
            pastNinjas: o,
            globalEventState: U,
            levelName: s,
            setLevelName: n,
            roundCorners: i,
            setRoundCorners: _
          });
        }
      }),
      p(Z, {
        get when() {
          return ye(() => J() == W)() && !!e();
        },
        keyed: true,
        get children() {
          return p(Tl, {
            get replay() {
              return e();
            },
            globalEventState: U
          });
        }
      })
    ];
  }
  const Al = document.getElementById("root");
  fr(() => p(Ll, {}), Al);
})();
