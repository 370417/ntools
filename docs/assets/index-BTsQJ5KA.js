(async () => {
  (function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const o of document.querySelectorAll('link[rel="modulepreload"]')) s(o);
    new MutationObserver((o) => {
      for (const i of o) if (i.type === "childList") for (const l of i.addedNodes) l.tagName === "LINK" && l.rel === "modulepreload" && s(l);
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
  var Z = null;
  let lt = null, zr = null, F = null, te = null, me = null, st = 0;
  function Me(t, e) {
    const r = F, s = Z, o = t.length === 0, i = e === void 0 ? s : e, l = o ? Ft : {
      owned: null,
      cleanups: null,
      context: i ? i.context : null,
      owner: i
    }, n = o ? t : () => t(() => de(() => Re(l)));
    Z = l, F = null;
    try {
      return Ve(n, true);
    } finally {
      F = r, Z = s;
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
  function k(t, e, r) {
    const s = mt(t, e, false, ve);
    ze(s);
  }
  function Vr(t, e, r) {
    qt = Wr;
    const s = mt(t, e, false, ve);
    s.user = true, me ? me.push(s) : ze(s);
  }
  function ie(t, e, r) {
    r = r ? Object.assign({}, Xe, r) : Xe;
    const s = mt(t, e, true, 0);
    return s.observers = null, s.observerSlots = null, s.comparator = r.equals || void 0, ze(s), Wt.bind(s);
  }
  function de(t) {
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
    return Z === null || (Z.cleanups === null ? Z.cleanups = [
      t
    ] : Z.cleanups.push(t)), t;
  }
  function Ur(t) {
    const e = ie(t), r = ie(() => ft(e()));
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
  function Zt(t, e, r) {
    let s = t.value;
    return (!t.comparator || !t.comparator(s, e)) && (t.value = e, t.observers && t.observers.length && Ve(() => {
      for (let o = 0; o < t.observers.length; o += 1) {
        const i = t.observers[o], l = lt && lt.running;
        l && lt.disposed.has(i), (l ? !i.tState : !i.state) && (i.pure ? te.push(i) : me.push(i), i.observers && Xt(i)), l || (i.state = ve);
      }
      if (te.length > 1e6) throw te = [], new Error();
    }, false)), e;
  }
  function ze(t) {
    if (!t.fn) return;
    Re(t);
    const e = st;
    qr(t, t.value, e);
  }
  function qr(t, e, r) {
    let s;
    const o = Z, i = F;
    F = Z = t;
    try {
      s = t.fn(e);
    } catch (l) {
      return t.pure && (t.state = ve, t.owned && t.owned.forEach(Re), t.owned = null), t.updatedAt = r + 1, Jt(l);
    } finally {
      F = i, Z = o;
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
      owner: Z,
      context: Z ? Z.context : null,
      pure: r
    };
    return Z === null || Z !== Ft && (Z.owned ? Z.owned.push(i) : Z.owned = [
      i
    ]), i;
  }
  function Qe(t) {
    if (t.state === 0) return;
    if (t.state === Je) return et(t);
    if (t.suspense && de(t.suspense.inFallback)) return t.suspense.effects.push(t);
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
  function Re(t) {
    let e;
    if (t.sources) for (; t.sources.length; ) {
      const r = t.sources.pop(), s = t.sourceSlots.pop(), o = r.observers;
      if (o && o.length) {
        const i = o.pop(), l = r.observerSlots.pop();
        s < o.length && (i.sourceSlots[l] = s, o[s] = i, r.observerSlots[s] = l);
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
  function Zr(t) {
    return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
      cause: t
    });
  }
  function Jt(t, e = Z) {
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
    let s = [], o = [], i = [], l = 0, n = e.length > 1 ? [] : null;
    return Se(() => tt(i)), () => {
      let c = t() || [], p = c.length, x, g;
      return c[Ut], de(() => {
        let j, G, H, q, z, P, M, B, R;
        if (p === 0) l !== 0 && (tt(i), i = [], s = [], o = [], l = 0, n && (n = [])), r.fallback && (s = [
          yt
        ], o[0] = Me((T) => (i[0] = T, r.fallback())), l = 1);
        else if (l === 0) {
          for (o = new Array(p), g = 0; g < p; g++) s[g] = c[g], o[g] = Me(C);
          l = p;
        } else {
          for (H = new Array(p), q = new Array(p), n && (z = new Array(p)), P = 0, M = Math.min(l, p); P < M && s[P] === c[P]; P++) ;
          for (M = l - 1, B = p - 1; M >= P && B >= P && s[M] === c[B]; M--, B--) H[B] = o[M], q[B] = i[M], n && (z[B] = n[M]);
          for (j = /* @__PURE__ */ new Map(), G = new Array(B + 1), g = B; g >= P; g--) R = c[g], x = j.get(R), G[g] = x === void 0 ? -1 : x, j.set(R, g);
          for (x = P; x <= M; x++) R = s[x], g = j.get(R), g !== void 0 && g !== -1 ? (H[g] = o[x], q[g] = i[x], n && (z[g] = n[x]), g = G[g], j.set(R, g)) : i[x]();
          for (g = P; g < p; g++) g in H ? (o[g] = H[g], i[g] = q[g], n && (n[g] = z[g], n[g](g))) : o[g] = Me(C);
          o = o.slice(0, l = p), s = c.slice(0);
        }
        return o;
      });
      function C(j) {
        if (i[g] = j, n) {
          const [G, H] = y(g);
          return n[g] = H, e(c[g], G);
        }
        return e(c[g]);
      }
    };
  }
  function Xr(t, e, r = {}) {
    let s = [], o = [], i = [], l = [], n = 0, c;
    return Se(() => tt(i)), () => {
      const p = t() || [], x = p.length;
      return p[Ut], de(() => {
        if (x === 0) return n !== 0 && (tt(i), i = [], s = [], o = [], n = 0, l = []), r.fallback && (s = [
          yt
        ], o[0] = Me((C) => (i[0] = C, r.fallback())), n = 1), o;
        for (s[0] === yt && (i[0](), i = [], s = [], o = [], n = 0), c = 0; c < x; c++) c < s.length && s[c] !== p[c] ? l[c](() => p[c]) : c >= s.length && (o[c] = Me(g));
        for (; c < s.length; c++) i[c]();
        return n = l.length = i.length = x, s = p.slice(0), o = o.slice(0, n);
      });
      function g(C) {
        i[c] = C;
        const [j, G] = y(p[c]);
        return l[c] = G, e(j, c);
      }
    };
  }
  function u(t, e) {
    return de(() => t(e || {}));
  }
  const Qt = (t) => `Stale read from <${t}>.`;
  function bt(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return ie(Yr(() => t.each, t.children, e || void 0));
  }
  function V(t) {
    const e = "fallback" in t && {
      fallback: () => t.fallback
    };
    return ie(Xr(() => t.each, t.children, e || void 0));
  }
  function O(t) {
    const e = t.keyed, r = ie(() => t.when, void 0, void 0), s = e ? r : ie(r, void 0, {
      equals: (o, i) => !o == !i
    });
    return ie(() => {
      const o = s();
      if (o) {
        const i = t.children;
        return typeof i == "function" && i.length > 0 ? de(() => i(e ? o : () => {
          if (!de(s)) throw Qt("Show");
          return r();
        })) : i;
      }
      return t.fallback;
    }, void 0, void 0);
  }
  function Jr(t) {
    const e = Ur(() => t.children), r = ie(() => {
      const s = e(), o = Array.isArray(s) ? s : [
        s
      ];
      let i = () => {
      };
      for (let l = 0; l < o.length; l++) {
        const n = l, c = o[l], p = i, x = ie(() => p() ? void 0 : c.when, void 0, void 0), g = c.keyed ? x : ie(x, void 0, {
          equals: (C, j) => !C == !j
        });
        i = () => p() || (g() ? [
          n,
          x,
          c
        ] : void 0);
      }
      return i;
    });
    return ie(() => {
      const s = r()();
      if (!s) return t.fallback;
      const [o, i, l] = s, n = l.children;
      return typeof n == "function" && n.length > 0 ? de(() => n(l.keyed ? i() : () => {
        var _a2;
        if (((_a2 = de(r)()) == null ? void 0 : _a2[0]) !== o) throw Qt("Match");
        return i();
      })) : n;
    }, void 0, void 0);
  }
  function kt(t) {
    return t;
  }
  const Ne = (t) => ie(() => t());
  function Qr(t, e, r) {
    let s = r.length, o = e.length, i = s, l = 0, n = 0, c = e[o - 1].nextSibling, p = null;
    for (; l < o || n < i; ) {
      if (e[l] === r[n]) {
        l++, n++;
        continue;
      }
      for (; e[o - 1] === r[i - 1]; ) o--, i--;
      if (o === l) {
        const x = i < s ? n ? r[n - 1].nextSibling : r[i - n] : c;
        for (; n < i; ) t.insertBefore(r[n++], x);
      } else if (i === n) for (; l < o; ) (!p || !p.has(e[l])) && e[l].remove(), l++;
      else if (e[l] === r[i - 1] && r[n] === e[o - 1]) {
        const x = e[--o].nextSibling;
        t.insertBefore(r[n++], e[l++].nextSibling), t.insertBefore(r[--i], x), e[o] = r[i];
      } else {
        if (!p) {
          p = /* @__PURE__ */ new Map();
          let g = n;
          for (; g < i; ) p.set(r[g], g++);
        }
        const x = p.get(e[l]);
        if (x != null) if (n < x && x < i) {
          let g = l, C = 1, j;
          for (; ++g < o && g < i && !((j = p.get(e[g])) == null || j !== x + C); ) C++;
          if (C > x - n) {
            const G = e[l];
            for (; n < x; ) t.insertBefore(r[n++], G);
          } else t.replaceChild(r[n++], e[l++]);
        } else l++;
        else e[l++].remove();
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
    }, l = e ? () => de(() => document.importNode(o || (o = i()), true)) : () => (o || (o = i())).cloneNode(true);
    return l.cloneNode = l, l;
  }
  function nt(t, e = window.document) {
    const r = e[Dt] || (e[Dt] = /* @__PURE__ */ new Set());
    for (let s = 0, o = t.length; s < o; s++) {
      const i = t[s];
      r.has(i) || (r.add(i), e.addEventListener(i, rs));
    }
  }
  function f(t, e, r) {
    r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
  }
  function qe(t, e, r) {
    r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
  }
  function ts(t, e, r) {
    return de(() => t(e, r));
  }
  function w(t, e, r, s) {
    if (r !== void 0 && !s && (s = []), typeof e != "function") return rt(t, e, s, r);
    k((o) => rt(t, e(), o, r), s);
  }
  function rs(t) {
    let e = t.target;
    const r = `$$${t.type}`, s = t.target, o = t.currentTarget, i = (c) => Object.defineProperty(t, "target", {
      configurable: true,
      value: c
    }), l = () => {
      const c = e[r];
      if (c && !e.disabled) {
        const p = e[`${r}Data`];
        if (p !== void 0 ? c.call(e, p, t) : c.call(e, t), t.cancelBubble) return;
      }
      return e.host && typeof e.host != "string" && !e.host._$host && e.contains(t.target) && i(e.host), true;
    }, n = () => {
      for (; l() && (e = e._$host || e.parentNode || e.host); ) ;
    };
    if (Object.defineProperty(t, "currentTarget", {
      configurable: true,
      get() {
        return e || document;
      }
    }), t.composedPath) {
      const c = t.composedPath();
      i(c[0]);
      for (let p = 0; p < c.length - 2 && (e = c[p], !!l()); p++) {
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
    const i = typeof e, l = s !== void 0;
    if (t = l && r[0] && r[0].parentNode || t, i === "string" || i === "number") {
      if (i === "number" && (e = e.toString(), e === r)) return r;
      if (l) {
        let n = r[0];
        n && n.nodeType === 3 ? n.data !== e && (n.data = e) : n = document.createTextNode(e), r = Ce(t, r, s, n);
      } else r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
    } else if (e == null || i === "boolean") r = Ce(t, r, s);
    else {
      if (i === "function") return k(() => {
        let n = e();
        for (; typeof n == "function"; ) n = n();
        r = rt(t, n, r, s);
      }), () => r;
      if (Array.isArray(e)) {
        const n = [], c = r && Array.isArray(r);
        if (wt(n, e, r, o)) return k(() => r = rt(t, n, r, s, true)), () => r;
        if (n.length === 0) {
          if (r = Ce(t, r, s), l) return r;
        } else c ? r.length === 0 ? St(t, n, s) : Qr(t, r, n) : (r && Ce(t), St(t, n));
        r = n;
      } else if (e.nodeType) {
        if (Array.isArray(r)) {
          if (l) return r = Ce(t, r, s, e);
          Ce(t, r, null, e);
        } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
        r = e;
      }
    }
    return r;
  }
  function wt(t, e, r, s) {
    let o = false;
    for (let i = 0, l = e.length; i < l; i++) {
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
        const x = String(n);
        c && c.nodeType === 3 && c.data === x ? t.push(c) : t.push(document.createTextNode(x));
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
      for (let l = e.length - 1; l >= 0; l--) {
        const n = e[l];
        if (o !== n) {
          const c = n.parentNode === t;
          !i && !l ? c ? t.replaceChild(o, n) : t.insertBefore(o, r) : c && n.remove();
        } else i = true;
      }
    } else t.insertBefore(o, r);
    return [
      o
    ];
  }
  const ss = "" + new URL("ntools_rs_bg-CILpK1CX.wasm", import.meta.url).href, ns = async (t = {}, e) => {
    let r;
    if (e.startsWith("data:")) {
      const s = e.replace(/^data:.*?base64,/, "");
      let o;
      if (typeof Buffer == "function" && typeof Buffer.from == "function") o = Buffer.from(s, "base64");
      else if (typeof atob == "function") {
        const i = atob(s);
        o = new Uint8Array(i.length);
        for (let l = 0; l < i.length; l++) o[l] = i.charCodeAt(l);
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
  let _;
  function os(t) {
    _ = t;
  }
  let Fe = null;
  function Be() {
    return (Fe === null || Fe.byteLength === 0) && (Fe = new Uint8Array(_.memory.buffer)), Fe;
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
    const e = _.__wbindgen_externrefs.get(t);
    return _.__externref_table_dealloc(t), e;
  }
  const Oe = new TextEncoder();
  "encodeInto" in Oe || (Oe.encodeInto = function(t, e) {
    const r = Oe.encode(t);
    return e.set(r), {
      read: t.length,
      written: r.length
    };
  });
  function ls(t, e, r) {
    if (r === void 0) {
      const n = Oe.encode(t), c = e(n.length, 1) >>> 0;
      return Be().subarray(c, c + n.length).set(n), De = n.length, c;
    }
    let s = t.length, o = e(s, 1) >>> 0;
    const i = Be();
    let l = 0;
    for (; l < s; l++) {
      const n = t.charCodeAt(l);
      if (n > 127) break;
      i[o + l] = n;
    }
    if (l !== s) {
      l !== 0 && (t = t.slice(l)), o = r(o, s, s = l + t.length * 3, 1) >>> 0;
      const n = Be().subarray(o + l, o + s), c = Oe.encodeInto(t, n);
      l += c.written, o = r(o, s, l, 1) >>> 0;
    }
    return De = l, o;
  }
  let We = null;
  function as() {
    return (We === null || We.byteLength === 0) && (We = new Float64Array(_.memory.buffer)), We;
  }
  function Ye(t, e) {
    return t = t >>> 0, as().subarray(t / 8, t / 8 + e);
  }
  let Ae = null;
  function cs() {
    return (Ae === null || Ae.buffer.detached === true || Ae.buffer.detached === void 0 && Ae.buffer !== _.memory.buffer) && (Ae = new DataView(_.memory.buffer)), Ae;
  }
  function Tt(t, e) {
    t = t >>> 0;
    const r = cs(), s = [];
    for (let o = t; o < t + 4 * e; o += 4) s.push(_.__wbindgen_externrefs.get(r.getUint32(o, true)));
    return _.__externref_drop_slice(t, e), s;
  }
  function ds(t, e) {
    if (!(t instanceof e)) throw new Error(`expected instance of ${e.name}`);
  }
  const Lt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => _.__wbg_editor_free(t >>> 0, 1));
  class Te {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Te.prototype);
      return r.__wbg_ptr = e, Lt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Lt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      _.__wbg_editor_free(e, 0);
    }
    export_map() {
      const e = _.editor_export_map(this.__wbg_ptr);
      var r = er(e[0], e[1]).slice();
      return _.__wbindgen_free(e[0], e[1] * 1, 1), r;
    }
    press_dash() {
      _.editor_press_dash(this.__wbg_ptr);
    }
    press_down(e) {
      _.editor_press_down(this.__wbg_ptr, e);
    }
    press_left(e) {
      _.editor_press_left(this.__wbg_ptr, e);
    }
    tiles_path() {
      let e, r;
      try {
        const s = _.editor_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], ke(s[0], s[1]);
      } finally {
        _.__wbindgen_free(e, r, 1);
      }
    }
    crosshair_x() {
      return _.editor_crosshair_x(this.__wbg_ptr);
    }
    crosshair_y() {
      return _.editor_crosshair_y(this.__wbg_ptr);
    }
    cursor_down(e) {
      _.editor_cursor_down(this.__wbg_ptr, e);
    }
    press_comma() {
      _.editor_press_comma(this.__wbg_ptr);
    }
    press_enter() {
      _.editor_press_enter(this.__wbg_ptr);
    }
    press_num_0() {
      _.editor_press_num_0(this.__wbg_ptr);
    }
    press_num_1() {
      _.editor_press_num_1(this.__wbg_ptr);
    }
    press_num_2() {
      _.editor_press_num_1(this.__wbg_ptr);
    }
    press_num_3() {
      _.editor_press_num_3(this.__wbg_ptr);
    }
    press_num_4() {
      _.editor_press_num_1(this.__wbg_ptr);
    }
    press_num_5() {
      _.editor_press_num_1(this.__wbg_ptr);
    }
    press_num_7() {
      _.editor_press_num_7(this.__wbg_ptr);
    }
    press_right(e) {
      _.editor_press_right(this.__wbg_ptr, e);
    }
    press_shift() {
      _.editor_press_shift(this.__wbg_ptr);
    }
    press_slash() {
      _.editor_press_slash(this.__wbg_ptr);
    }
    press_space() {
      _.editor_press_space(this.__wbg_ptr);
    }
    double_click(e) {
      _.editor_double_click(this.__wbg_ptr, e);
    }
    load_attract(e) {
      const r = ct(e, _.__wbindgen_malloc), s = De, o = _.editor_load_attract(this.__wbg_ptr, r, s);
      if (o[1]) throw dt(o[0]);
    }
    past_ninja_x(e) {
      return _.editor_past_ninja_x(this.__wbg_ptr, e);
    }
    past_ninja_y(e) {
      return _.editor_past_ninja_y(this.__wbg_ptr, e);
    }
    press_equals() {
      _.editor_press_equals(this.__wbg_ptr);
    }
    press_escape() {
      return _.editor_press_escape(this.__wbg_ptr) !== 0;
    }
    release_shift() {
      _.editor_release_shift(this.__wbg_ptr);
    }
    release_space() {
      _.editor_release_space(this.__wbg_ptr);
    }
    set_anim_data(e) {
      const r = ct(e, _.__wbindgen_malloc), s = De;
      _.editor_set_anim_data(this.__wbg_ptr, r, s);
    }
    get_anim_state() {
      return _.editor_get_anim_state(this.__wbg_ptr) >>> 0;
    }
    get_level_name() {
      let e, r;
      try {
        const s = _.editor_get_level_name(this.__wbg_ptr);
        return e = s[0], r = s[1], ke(s[0], s[1]);
      } finally {
        _.__wbindgen_free(e, r, 1);
      }
    }
    get_show_trail() {
      return _.editor_get_show_trail(this.__wbg_ptr) !== 0;
    }
    press_alt_left(e) {
      _.editor_press_alt_left(this.__wbg_ptr, e);
    }
    press_backtick() {
      _.editor_press_backtick(this.__wbg_ptr);
    }
    set_cursor_pos(e, r, s) {
      return _.editor_set_cursor_pos(this.__wbg_ptr, e, r, s) !== 0;
    }
    set_level_name(e) {
      const r = ls(e, _.__wbindgen_malloc, _.__wbindgen_realloc), s = De;
      _.editor_set_level_name(this.__wbg_ptr, r, s);
    }
    set_show_trail(e) {
      _.editor_set_show_trail(this.__wbg_ptr, e);
    }
    show_half_grid() {
      return _.editor_show_half_grid(this.__wbg_ptr) !== 0;
    }
    past_ninjas_len() {
      return _.editor_past_ninjas_len(this.__wbg_ptr) >>> 0;
    }
    palette_center_x() {
      return _.editor_palette_center_x(this.__wbg_ptr);
    }
    palette_center_y() {
      return _.editor_palette_center_y(this.__wbg_ptr);
    }
    past_ninja_bones() {
      const e = _.editor_past_ninja_bones(this.__wbg_ptr);
      var r = Ye(e[0], e[1]).slice();
      return _.__wbindgen_free(e[0], e[1] * 8, 8), r;
    }
    preview_entities() {
      const e = _.editor_preview_entities(this.__wbg_ptr);
      var r = Tt(e[0], e[1]).slice();
      return _.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    release_alt_left() {
      _.editor_release_alt_left(this.__wbg_ptr);
    }
    show_quarter_grid() {
      return _.editor_show_quarter_grid(this.__wbg_ptr) !== 0;
    }
    press_bracket_left() {
      _.editor_press_bracket_left(this.__wbg_ptr);
    }
    tile_crosshair_col() {
      return _.editor_tile_crosshair_col(this.__wbg_ptr);
    }
    tile_crosshair_row() {
      return _.editor_tile_crosshair_row(this.__wbg_ptr);
    }
    palette_selection_x() {
      return _.editor_palette_selection_x(this.__wbg_ptr);
    }
    palette_selection_y() {
      return _.editor_palette_selection_y(this.__wbg_ptr);
    }
    press_bracket_right() {
      _.editor_press_bracket_right(this.__wbg_ptr);
    }
    receive_past_ninjas() {
      _.editor_receive_past_ninjas(this.__wbg_ptr);
    }
    selected_tiles_path() {
      let e, r;
      try {
        const s = _.editor_selected_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], ke(s[0], s[1]);
      } finally {
        _.__wbindgen_free(e, r, 1);
      }
    }
    selected_tile_outline_path() {
      let e, r;
      try {
        const s = _.editor_selected_tile_outline_path(this.__wbg_ptr);
        return e = s[0], r = s[1], ke(s[0], s[1]);
      } finally {
        _.__wbindgen_free(e, r, 1);
      }
    }
    static new() {
      const e = _.editor_new();
      return Te.__wrap(e);
    }
    mode() {
      return _.editor_mode(this.__wbg_ptr) >>> 0;
    }
    redo() {
      _.editor_redo(this.__wbg_ptr);
    }
    undo() {
      _.editor_undo(this.__wbg_ptr);
    }
    press_0() {
      _.editor_press_0(this.__wbg_ptr);
    }
    press_1(e) {
      _.editor_press_1(this.__wbg_ptr, e);
    }
    press_2(e) {
      _.editor_press_2(this.__wbg_ptr, e);
    }
    press_3(e) {
      _.editor_press_3(this.__wbg_ptr, e);
    }
    press_4(e) {
      _.editor_press_4(this.__wbg_ptr, e);
    }
    press_5(e) {
      _.editor_press_5(this.__wbg_ptr, e);
    }
    press_6(e) {
      _.editor_press_6(this.__wbg_ptr, e);
    }
    press_7(e) {
      _.editor_press_7(this.__wbg_ptr, e);
    }
    press_8(e) {
      _.editor_press_8(this.__wbg_ptr, e);
    }
    press_9() {
      _.editor_press_9(this.__wbg_ptr);
    }
    press_a(e) {
      _.editor_press_a(this.__wbg_ptr, e);
    }
    press_c() {
      _.editor_press_c(this.__wbg_ptr);
    }
    press_d() {
      _.editor_press_d(this.__wbg_ptr);
    }
    press_e() {
      _.editor_press_e(this.__wbg_ptr);
    }
    press_f() {
      _.editor_press_f(this.__wbg_ptr);
    }
    press_h() {
      _.editor_press_h(this.__wbg_ptr);
    }
    press_i() {
      _.editor_press_i(this.__wbg_ptr);
    }
    press_j() {
      _.editor_press_j(this.__wbg_ptr);
    }
    press_k() {
      _.editor_press_k(this.__wbg_ptr);
    }
    press_l() {
      _.editor_press_l(this.__wbg_ptr);
    }
    press_m() {
      _.editor_press_m(this.__wbg_ptr);
    }
    press_n() {
      _.editor_press_n(this.__wbg_ptr);
    }
    press_o() {
      _.editor_press_o(this.__wbg_ptr);
    }
    press_p() {
      _.editor_press_p(this.__wbg_ptr);
    }
    press_q(e) {
      _.editor_press_q(this.__wbg_ptr, e);
    }
    press_r() {
      _.editor_press_r(this.__wbg_ptr);
    }
    press_s(e) {
      _.editor_press_s(this.__wbg_ptr, e);
    }
    press_t() {
      _.editor_press_t(this.__wbg_ptr);
    }
    press_u() {
      _.editor_press_num_1(this.__wbg_ptr);
    }
    press_w(e) {
      _.editor_press_w(this.__wbg_ptr, e);
    }
    press_x() {
      _.editor_press_x(this.__wbg_ptr);
    }
    press_y() {
      _.editor_press_y(this.__wbg_ptr);
    }
    press_z() {
      _.editor_press_z(this.__wbg_ptr);
    }
    entities() {
      const e = _.editor_entities(this.__wbg_ptr);
      var r = Tt(e[0], e[1]).slice();
      return _.__wbindgen_free(e[0], e[1] * 4, 4), r;
    }
    load_map(e) {
      const r = ct(e, _.__wbindgen_malloc), s = De, o = _.editor_load_map(this.__wbg_ptr, r, s);
      if (o[1]) throw dt(o[0]);
    }
    press_up(e) {
      _.editor_press_up(this.__wbg_ptr, e);
    }
    cursor_up() {
      _.editor_cursor_up(this.__wbg_ptr);
    }
    release_a() {
      _.editor_release_a(this.__wbg_ptr);
    }
    release_c() {
      _.editor_release_c(this.__wbg_ptr);
    }
    release_d() {
      _.editor_release_d(this.__wbg_ptr);
    }
    release_e() {
      _.editor_release_e(this.__wbg_ptr);
    }
    release_q() {
      _.editor_release_q(this.__wbg_ptr);
    }
    release_s() {
      _.editor_release_s(this.__wbg_ptr);
    }
    release_w() {
      _.editor_release_w(this.__wbg_ptr);
    }
    release_z() {
      _.editor_release_z(this.__wbg_ptr);
    }
    to_replay(e, r) {
      const s = _.editor_to_replay(this.__wbg_ptr, e, r);
      if (s[2]) throw dt(s[1]);
      return Ge.__wrap(s[0]);
    }
  }
  Symbol.dispose && (Te.prototype[Symbol.dispose] = Te.prototype.free);
  const Pt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => _.__wbg_exportedentity_free(t >>> 0, 1));
  class Ke {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Ke.prototype);
      return r.__wbg_ptr = e, Pt.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Pt.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      _.__wbg_exportedentity_free(e, 0);
    }
    get type_int() {
      return _.__wbg_get_exportedentity_type_int(this.__wbg_ptr) >>> 0;
    }
    set type_int(e) {
      _.__wbg_set_exportedentity_type_int(this.__wbg_ptr, e);
    }
    get x() {
      return _.__wbg_get_exportedentity_x(this.__wbg_ptr);
    }
    set x(e) {
      _.__wbg_set_exportedentity_x(this.__wbg_ptr, e);
    }
    get y() {
      return _.__wbg_get_exportedentity_y(this.__wbg_ptr);
    }
    set y(e) {
      _.__wbg_set_exportedentity_y(this.__wbg_ptr, e);
    }
    get deg() {
      return _.__wbg_get_exportedentity_deg(this.__wbg_ptr);
    }
    set deg(e) {
      _.__wbg_set_exportedentity_deg(this.__wbg_ptr, e);
    }
    get switch_x() {
      return _.__wbg_get_exportedentity_switch_x(this.__wbg_ptr);
    }
    set switch_x(e) {
      _.__wbg_set_exportedentity_switch_x(this.__wbg_ptr, e);
    }
    get switch_y() {
      return _.__wbg_get_exportedentity_switch_y(this.__wbg_ptr);
    }
    set switch_y(e) {
      _.__wbg_set_exportedentity_switch_y(this.__wbg_ptr, e);
    }
    get mode() {
      return _.__wbg_get_exportedentity_mode(this.__wbg_ptr);
    }
    set mode(e) {
      _.__wbg_set_exportedentity_mode(this.__wbg_ptr, e);
    }
  }
  Symbol.dispose && (Ke.prototype[Symbol.dispose] = Ke.prototype.free);
  const Et = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => _.__wbg_replay_free(t >>> 0, 1));
  class Ge {
    static __wrap(e) {
      e = e >>> 0;
      const r = Object.create(Ge.prototype);
      return r.__wbg_ptr = e, Et.register(r, r.__wbg_ptr, r), r;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Et.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      _.__wbg_replay_free(e, 0);
    }
    inputs_len() {
      return _.replay_inputs_len(this.__wbg_ptr) >>> 0;
    }
    mine_state(e) {
      return _.replay_mine_state(this.__wbg_ptr, e);
    }
    thwump_deg(e) {
      return _.replay_thwump_deg(this.__wbg_ptr, e);
    }
    tiles_path() {
      let e, r;
      try {
        const s = _.replay_tiles_path(this.__wbg_ptr);
        return e = s[0], r = s[1], ke(s[0], s[1]);
      } finally {
        _.__wbindgen_free(e, r, 1);
      }
    }
    boost_pad_x(e) {
      return _.replay_boost_pad_x(this.__wbg_ptr, e);
    }
    boost_pad_y(e) {
      return _.replay_boost_pad_y(this.__wbg_ptr, e);
    }
    exit_door_x(e) {
      return _.replay_exit_door_x(this.__wbg_ptr, e);
    }
    exit_door_y(e) {
      return _.replay_exit_door_y(this.__wbg_ptr, e);
    }
    ninja_bones(e) {
      const r = _.replay_ninja_bones(this.__wbg_ptr, e);
      var s = Ye(r[0], r[1]).slice();
      return _.__wbindgen_free(r[0], r[1] * 8, 8), s;
    }
    one_way_deg(e) {
      return _.replay_one_way_deg(this.__wbg_ptr, e);
    }
    place_ninja(e, r) {
      _.replay_place_ninja(this.__wbg_ptr, e, r);
    }
    thwumps_len() {
      return _.replay_thwumps_len(this.__wbg_ptr) >>> 0;
    }
    trap_door_x(e) {
      return _.replay_trap_door_x(this.__wbg_ptr, e);
    }
    trap_door_y(e) {
      return _.replay_trap_door_y(this.__wbg_ptr, e);
    }
    zap_drone_x(e, r) {
      return _.replay_zap_drone_x(this.__wbg_ptr, e, r);
    }
    zap_drone_y(e, r) {
      return _.replay_zap_drone_y(this.__wbg_ptr, e, r);
    }
    launch_pad_x(e) {
      return _.replay_launch_pad_x(this.__wbg_ptr, e);
    }
    launch_pad_y(e) {
      return _.replay_launch_pad_y(this.__wbg_ptr, e);
    }
    one_ways_len() {
      return _.replay_one_ways_len(this.__wbg_ptr) >>> 0;
    }
    past_ninja_x(e) {
      return _.replay_past_ninja_x(this.__wbg_ptr, e);
    }
    past_ninja_y(e) {
      return _.replay_past_ninja_y(this.__wbg_ptr, e);
    }
    seek_preview(e) {
      _.replay_seek_preview(this.__wbg_ptr, e);
    }
    boost_pad_deg(e, r) {
      return _.replay_boost_pad_deg(this.__wbg_ptr, e, r);
    }
    chase_drone_x(e, r) {
      return _.replay_chase_drone_x(this.__wbg_ptr, e, r);
    }
    chase_drone_y(e, r) {
      return _.replay_chase_drone_y(this.__wbg_ptr, e, r);
    }
    exit_switch_x(e) {
      return _.replay_exit_switch_x(this.__wbg_ptr, e);
    }
    exit_switch_y(e) {
      return _.replay_exit_switch_y(this.__wbg_ptr, e);
    }
    floor_guard_x(e, r) {
      return _.replay_floor_guard_x(this.__wbg_ptr, e, r);
    }
    floor_guard_y(e, r) {
      return _.replay_floor_guard_y(this.__wbg_ptr, e, r);
    }
    laser_drone_x(e, r) {
      return _.replay_laser_drone_x(this.__wbg_ptr, e, r);
    }
    laser_drone_y(e, r) {
      return _.replay_laser_drone_y(this.__wbg_ptr, e, r);
    }
    locked_door_x(e) {
      return _.replay_locked_door_x(this.__wbg_ptr, e);
    }
    locked_door_y(e) {
      return _.replay_locked_door_y(this.__wbg_ptr, e);
    }
    replay_length() {
      return _.replay_inputs_len(this.__wbg_ptr) >>> 0;
    }
    trap_door_deg(e) {
      return _.replay_trap_door_deg(this.__wbg_ptr, e);
    }
    trap_switch_x(e) {
      return _.replay_trap_switch_x(this.__wbg_ptr, e);
    }
    trap_switch_y(e) {
      return _.replay_trap_switch_y(this.__wbg_ptr, e);
    }
    zap_drone_deg(e) {
      return _.replay_zap_drone_deg(this.__wbg_ptr, e);
    }
    boost_pads_len() {
      return _.replay_boost_pads_len(this.__wbg_ptr) >>> 0;
    }
    bounce_block_x(e, r) {
      return _.replay_bounce_block_x(this.__wbg_ptr, e, r);
    }
    bounce_block_y(e, r) {
      return _.replay_bounce_block_y(this.__wbg_ptr, e, r);
    }
    exit_doors_len() {
      return _.replay_exit_doors_len(this.__wbg_ptr) >>> 0;
    }
    export_attract(e) {
      ds(e, Te);
      const r = _.replay_export_attract(this.__wbg_ptr, e.__wbg_ptr);
      var s = er(r[0], r[1]).slice();
      return _.__wbindgen_free(r[0], r[1] * 1, 1), s;
    }
    gold_collected(e) {
      return _.replay_gold_collected(this.__wbg_ptr, e) !== 0;
    }
    launch_pad_deg(e) {
      return _.replay_launch_pad_deg(this.__wbg_ptr, e);
    }
    regular_door_x(e) {
      return _.replay_regular_door_x(this.__wbg_ptr, e);
    }
    regular_door_y(e) {
      return _.replay_regular_door_y(this.__wbg_ptr, e);
    }
    shove_thwump_x(e, r) {
      return _.replay_shove_thwump_x(this.__wbg_ptr, e, r);
    }
    shove_thwump_y(e, r) {
      return _.replay_shove_thwump_y(this.__wbg_ptr, e, r);
    }
    trap_doors_len() {
      return _.replay_trap_doors_len(this.__wbg_ptr) >>> 0;
    }
    zap_drones_len() {
      return _.replay_zap_drones_len(this.__wbg_ptr) >>> 0;
    }
    chase_drone_deg(e) {
      return _.replay_chase_drone_deg(this.__wbg_ptr, e);
    }
    floor_guard_deg(e) {
      return _.replay_floor_guard_deg(this.__wbg_ptr, e);
    }
    laser_drone_deg(e) {
      return _.replay_laser_drone_deg(this.__wbg_ptr, e);
    }
    launch_pads_len() {
      return _.replay_launch_pads_len(this.__wbg_ptr) >>> 0;
    }
    locked_door_deg(e) {
      return _.replay_locked_door_deg(this.__wbg_ptr, e);
    }
    locked_switch_x(e) {
      return _.replay_locked_switch_x(this.__wbg_ptr, e);
    }
    locked_switch_y(e) {
      return _.replay_locked_switch_y(this.__wbg_ptr, e);
    }
    ninja_preview_x(e) {
      return _.replay_ninja_preview_x(this.__wbg_ptr, e);
    }
    ninja_preview_y(e) {
      return _.replay_ninja_preview_y(this.__wbg_ptr, e);
    }
    past_ninjas_len() {
      return _.replay_past_ninjas_len(this.__wbg_ptr) >>> 0;
    }
    bounce_block_deg(e) {
      return _.replay_bounce_block_deg(this.__wbg_ptr, e);
    }
    chaingun_drone_x(e, r) {
      return _.replay_chaingun_drone_x(this.__wbg_ptr, e, r);
    }
    chaingun_drone_y(e, r) {
      return _.replay_chaingun_drone_y(this.__wbg_ptr, e, r);
    }
    chase_drones_len() {
      return _.replay_chase_drones_len(this.__wbg_ptr) >>> 0;
    }
    floor_guards_len() {
      return _.replay_floor_guards_len(this.__wbg_ptr) >>> 0;
    }
    laser_drones_len() {
      return _.replay_laser_drones_len(this.__wbg_ptr) >>> 0;
    }
    locked_doors_len() {
      return _.replay_locked_doors_len(this.__wbg_ptr) >>> 0;
    }
    past_ninja_bones(e) {
      const r = _.replay_past_ninja_bones(this.__wbg_ptr, e);
      var s = Ye(r[0], r[1]).slice();
      return _.__wbindgen_free(r[0], r[1] * 8, 8), s;
    }
    progress_preview() {
      return _.replay_progress_preview(this.__wbg_ptr) >>> 0;
    }
    regular_door_deg(e) {
      return _.replay_regular_door_deg(this.__wbg_ptr, e);
    }
    send_past_ninjas() {
      _.replay_send_past_ninjas(this.__wbg_ptr);
    }
    shove_thwump_deg(e) {
      return _.replay_shove_thwump_deg(this.__wbg_ptr, e);
    }
    bounce_blocks_len() {
      return _.replay_bounce_blocks_len(this.__wbg_ptr) >>> 0;
    }
    regular_doors_len() {
      return _.replay_regular_doors_len(this.__wbg_ptr) >>> 0;
    }
    shove_thwumps_len() {
      return _.replay_shove_thwumps_len(this.__wbg_ptr) >>> 0;
    }
    chaingun_drone_deg(e) {
      return _.replay_chaingun_drone_deg(this.__wbg_ptr, e);
    }
    exit_anim_progress(e, r) {
      return _.replay_exit_anim_progress(this.__wbg_ptr, e, r);
    }
    shove_thwump_touch(e) {
      return _.replay_shove_thwump_touch(this.__wbg_ptr, e);
    }
    chaingun_drones_len() {
      return _.replay_chaingun_drones_len(this.__wbg_ptr) >>> 0;
    }
    ninja_preview_bones(e) {
      const r = _.replay_ninja_preview_bones(this.__wbg_ptr, e);
      var s = Ye(r[0], r[1]).slice();
      return _.__wbindgen_free(r[0], r[1] * 8, 8), s;
    }
    boost_pad_anim_progress(e, r) {
      return _.replay_boost_pad_anim_progress(this.__wbg_ptr, e, r);
    }
    trap_door_anim_progress(e, r) {
      return _.replay_trap_door_anim_progress(this.__wbg_ptr, e, r);
    }
    locked_door_anim_progress(e, r) {
      return _.replay_locked_door_anim_progress(this.__wbg_ptr, e, r);
    }
    regular_door_anim_progress(e, r) {
      return _.replay_regular_door_anim_progress(this.__wbg_ptr, e, r);
    }
    seek(e) {
      _.replay_seek(this.__wbg_ptr, e);
    }
    tick() {
      _.replay_tick(this.__wbg_ptr);
    }
    input(e) {
      return _.replay_input(this.__wbg_ptr, e);
    }
    score() {
      return _.replay_score(this.__wbg_ptr) >>> 0;
    }
    gold_x(e) {
      return _.replay_gold_x(this.__wbg_ptr, e);
    }
    gold_y(e) {
      return _.replay_gold_y(this.__wbg_ptr, e);
    }
    mine_x(e) {
      return _.replay_mine_x(this.__wbg_ptr, e);
    }
    mine_y(e) {
      return _.replay_mine_y(this.__wbg_ptr, e);
    }
    ninja_x(e) {
      return _.replay_ninja_x(this.__wbg_ptr, e);
    }
    ninja_y(e) {
      return _.replay_ninja_y(this.__wbg_ptr, e);
    }
    progress() {
      return _.replay_progress(this.__wbg_ptr) >>> 0;
    }
    thwump_x(e, r) {
      return _.replay_thwump_x(this.__wbg_ptr, e, r);
    }
    thwump_y(e, r) {
      return _.replay_thwump_y(this.__wbg_ptr, e, r);
    }
    golds_len() {
      return _.replay_golds_len(this.__wbg_ptr) >>> 0;
    }
    mines_len() {
      return _.replay_mines_len(this.__wbg_ptr) >>> 0;
    }
    one_way_x(e) {
      return _.replay_one_way_x(this.__wbg_ptr, e);
    }
    one_way_y(e) {
      return _.replay_one_way_y(this.__wbg_ptr, e);
    }
    set_input(e, r, s, o) {
      _.replay_set_input(this.__wbg_ptr, e, r, s, o);
    }
  }
  Symbol.dispose && (Ge.prototype[Symbol.dispose] = Ge.prototype.free);
  function us(t, e) {
    throw new Error(ke(t, e));
  }
  function ps(t) {
    return Ke.__wrap(t);
  }
  function hs(t, e) {
    return ke(t, e);
  }
  function gs() {
    const t = _.__wbindgen_externrefs, e = t.grow(4);
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
  }, ss), fs = a.memory, ys = a.__wbg_editor_free, ws = a.editor_crosshair_x, ms = a.editor_crosshair_y, bs = a.editor_cursor_down, xs = a.editor_cursor_up, vs = a.editor_double_click, $s = a.editor_entities, ks = a.editor_export_map, Ds = a.editor_get_anim_state, Ss = a.editor_get_level_name, Ts = a.editor_get_show_trail, Ls = a.editor_load_attract, Ps = a.editor_load_map, Es = a.editor_mode, js = a.editor_new, Cs = a.editor_palette_center_x, As = a.editor_palette_center_y, Ns = a.editor_palette_selection_x, Ms = a.editor_palette_selection_y, Bs = a.editor_past_ninja_bones, Is = a.editor_past_ninja_x, Os = a.editor_past_ninja_y, Rs = a.editor_past_ninjas_len, Ks = a.editor_press_0, Gs = a.editor_press_1, Hs = a.editor_press_2, zs = a.editor_press_3, Vs = a.editor_press_4, Us = a.editor_press_5, qs = a.editor_press_6, Fs = a.editor_press_7, Ws = a.editor_press_8, Zs = a.editor_press_9, Ys = a.editor_press_a, Xs = a.editor_press_alt_left, Js = a.editor_press_backtick, Qs = a.editor_press_bracket_left, en = a.editor_press_bracket_right, tn = a.editor_press_c, rn = a.editor_press_comma, sn = a.editor_press_d, nn = a.editor_press_dash, on = a.editor_press_down, _n = a.editor_press_e, ln = a.editor_press_enter, an = a.editor_press_equals, cn = a.editor_press_escape, dn = a.editor_press_f, un = a.editor_press_h, pn = a.editor_press_i, hn = a.editor_press_j, gn = a.editor_press_k, fn = a.editor_press_l, yn = a.editor_press_left, wn = a.editor_press_m, mn = a.editor_press_n, bn = a.editor_press_num_0, xn = a.editor_press_num_1, vn = a.editor_press_num_3, $n = a.editor_press_num_7, kn = a.editor_press_o, Dn = a.editor_press_p, Sn = a.editor_press_q, Tn = a.editor_press_r, Ln = a.editor_press_right, Pn = a.editor_press_s, En = a.editor_press_shift, jn = a.editor_press_slash, Cn = a.editor_press_space, An = a.editor_press_t, Nn = a.editor_press_up, Mn = a.editor_press_w, Bn = a.editor_press_x, In = a.editor_press_y, On = a.editor_press_z, Rn = a.editor_preview_entities, Kn = a.editor_receive_past_ninjas, Gn = a.editor_redo, Hn = a.editor_release_a, zn = a.editor_release_alt_left, Vn = a.editor_release_c, Un = a.editor_release_d, qn = a.editor_release_e, Fn = a.editor_release_q, Wn = a.editor_release_s, Zn = a.editor_release_shift, Yn = a.editor_release_space, Xn = a.editor_release_w, Jn = a.editor_release_z, Qn = a.editor_selected_tile_outline_path, eo = a.editor_selected_tiles_path, to = a.editor_set_anim_data, ro = a.editor_set_cursor_pos, so = a.editor_set_level_name, no = a.editor_set_show_trail, oo = a.editor_show_half_grid, io = a.editor_show_quarter_grid, _o = a.editor_tile_crosshair_col, lo = a.editor_tile_crosshair_row, ao = a.editor_tiles_path, co = a.editor_to_replay, uo = a.editor_undo, po = a.__wbg_exportedentity_free, ho = a.__wbg_get_exportedentity_deg, go = a.__wbg_get_exportedentity_mode, fo = a.__wbg_get_exportedentity_switch_x, yo = a.__wbg_get_exportedentity_switch_y, wo = a.__wbg_get_exportedentity_type_int, mo = a.__wbg_get_exportedentity_x, bo = a.__wbg_get_exportedentity_y, xo = a.__wbg_set_exportedentity_deg, vo = a.__wbg_set_exportedentity_mode, $o = a.__wbg_set_exportedentity_switch_x, ko = a.__wbg_set_exportedentity_switch_y, Do = a.__wbg_set_exportedentity_type_int, So = a.__wbg_set_exportedentity_x, To = a.__wbg_set_exportedentity_y, Lo = a.__wbg_replay_free, Po = a.replay_boost_pad_anim_progress, Eo = a.replay_boost_pad_deg, jo = a.replay_boost_pad_x, Co = a.replay_boost_pad_y, Ao = a.replay_boost_pads_len, No = a.replay_bounce_block_deg, Mo = a.replay_bounce_block_x, Bo = a.replay_bounce_block_y, Io = a.replay_bounce_blocks_len, Oo = a.replay_chaingun_drone_deg, Ro = a.replay_chaingun_drone_x, Ko = a.replay_chaingun_drone_y, Go = a.replay_chaingun_drones_len, Ho = a.replay_chase_drone_deg, zo = a.replay_chase_drone_x, Vo = a.replay_chase_drone_y, Uo = a.replay_chase_drones_len, qo = a.replay_exit_anim_progress, Fo = a.replay_exit_door_x, Wo = a.replay_exit_door_y, Zo = a.replay_exit_doors_len, Yo = a.replay_exit_switch_x, Xo = a.replay_exit_switch_y, Jo = a.replay_export_attract, Qo = a.replay_floor_guard_deg, ei = a.replay_floor_guard_x, ti = a.replay_floor_guard_y, ri = a.replay_floor_guards_len, si = a.replay_gold_collected, ni = a.replay_gold_x, oi = a.replay_gold_y, ii = a.replay_golds_len, _i = a.replay_input, li = a.replay_inputs_len, ai = a.replay_laser_drone_deg, ci = a.replay_laser_drone_x, di = a.replay_laser_drone_y, ui = a.replay_laser_drones_len, pi = a.replay_launch_pad_deg, hi = a.replay_launch_pad_x, gi = a.replay_launch_pad_y, fi = a.replay_launch_pads_len, yi = a.replay_locked_door_anim_progress, wi = a.replay_locked_door_deg, mi = a.replay_locked_door_x, bi = a.replay_locked_door_y, xi = a.replay_locked_doors_len, vi = a.replay_locked_switch_x, $i = a.replay_locked_switch_y, ki = a.replay_mine_state, Di = a.replay_mine_x, Si = a.replay_mine_y, Ti = a.replay_mines_len, Li = a.replay_ninja_bones, Pi = a.replay_ninja_preview_bones, Ei = a.replay_ninja_preview_x, ji = a.replay_ninja_preview_y, Ci = a.replay_ninja_x, Ai = a.replay_ninja_y, Ni = a.replay_one_way_deg, Mi = a.replay_one_way_x, Bi = a.replay_one_way_y, Ii = a.replay_one_ways_len, Oi = a.replay_past_ninja_bones, Ri = a.replay_past_ninja_x, Ki = a.replay_past_ninja_y, Gi = a.replay_past_ninjas_len, Hi = a.replay_place_ninja, zi = a.replay_progress, Vi = a.replay_progress_preview, Ui = a.replay_regular_door_anim_progress, qi = a.replay_regular_door_deg, Fi = a.replay_regular_door_x, Wi = a.replay_regular_door_y, Zi = a.replay_regular_doors_len, Yi = a.replay_score, Xi = a.replay_seek, Ji = a.replay_seek_preview, Qi = a.replay_send_past_ninjas, e_ = a.replay_set_input, t_ = a.replay_shove_thwump_deg, r_ = a.replay_shove_thwump_touch, s_ = a.replay_shove_thwump_x, n_ = a.replay_shove_thwump_y, o_ = a.replay_shove_thwumps_len, i_ = a.replay_thwump_deg, __ = a.replay_thwump_x, l_ = a.replay_thwump_y, a_ = a.replay_thwumps_len, c_ = a.replay_tick, d_ = a.replay_tiles_path, u_ = a.replay_trap_door_anim_progress, p_ = a.replay_trap_door_deg, h_ = a.replay_trap_door_x, g_ = a.replay_trap_door_y, f_ = a.replay_trap_doors_len, y_ = a.replay_trap_switch_x, w_ = a.replay_trap_switch_y, m_ = a.replay_zap_drone_deg, b_ = a.replay_zap_drone_x, x_ = a.replay_zap_drone_y, v_ = a.replay_zap_drones_len, $_ = a.editor_press_num_2, k_ = a.editor_press_num_4, D_ = a.editor_press_num_5, S_ = a.editor_press_u, T_ = a.replay_replay_length, L_ = a.__wbindgen_externrefs, P_ = a.__wbindgen_free, E_ = a.__wbindgen_malloc, j_ = a.__externref_table_dealloc, C_ = a.__wbindgen_realloc, A_ = a.__externref_drop_slice, tr = a.__wbindgen_start, N_ = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_drop_slice: A_,
    __externref_table_dealloc: j_,
    __wbg_editor_free: ys,
    __wbg_exportedentity_free: po,
    __wbg_get_exportedentity_deg: ho,
    __wbg_get_exportedentity_mode: go,
    __wbg_get_exportedentity_switch_x: fo,
    __wbg_get_exportedentity_switch_y: yo,
    __wbg_get_exportedentity_type_int: wo,
    __wbg_get_exportedentity_x: mo,
    __wbg_get_exportedentity_y: bo,
    __wbg_replay_free: Lo,
    __wbg_set_exportedentity_deg: xo,
    __wbg_set_exportedentity_mode: vo,
    __wbg_set_exportedentity_switch_x: $o,
    __wbg_set_exportedentity_switch_y: ko,
    __wbg_set_exportedentity_type_int: Do,
    __wbg_set_exportedentity_x: So,
    __wbg_set_exportedentity_y: To,
    __wbindgen_externrefs: L_,
    __wbindgen_free: P_,
    __wbindgen_malloc: E_,
    __wbindgen_realloc: C_,
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
    editor_get_show_trail: Ts,
    editor_load_attract: Ls,
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
    editor_press_num_2: $_,
    editor_press_num_3: vn,
    editor_press_num_4: k_,
    editor_press_num_5: D_,
    editor_press_num_7: $n,
    editor_press_o: kn,
    editor_press_p: Dn,
    editor_press_q: Sn,
    editor_press_r: Tn,
    editor_press_right: Ln,
    editor_press_s: Pn,
    editor_press_shift: En,
    editor_press_slash: jn,
    editor_press_space: Cn,
    editor_press_t: An,
    editor_press_u: S_,
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
    replay_laser_drone_deg: ai,
    replay_laser_drone_x: ci,
    replay_laser_drone_y: di,
    replay_laser_drones_len: ui,
    replay_launch_pad_deg: pi,
    replay_launch_pad_x: hi,
    replay_launch_pad_y: gi,
    replay_launch_pads_len: fi,
    replay_locked_door_anim_progress: yi,
    replay_locked_door_deg: wi,
    replay_locked_door_x: mi,
    replay_locked_door_y: bi,
    replay_locked_doors_len: xi,
    replay_locked_switch_x: vi,
    replay_locked_switch_y: $i,
    replay_mine_state: ki,
    replay_mine_x: Di,
    replay_mine_y: Si,
    replay_mines_len: Ti,
    replay_ninja_bones: Li,
    replay_ninja_preview_bones: Pi,
    replay_ninja_preview_x: Ei,
    replay_ninja_preview_y: ji,
    replay_ninja_x: Ci,
    replay_ninja_y: Ai,
    replay_one_way_deg: Ni,
    replay_one_way_x: Mi,
    replay_one_way_y: Bi,
    replay_one_ways_len: Ii,
    replay_past_ninja_bones: Oi,
    replay_past_ninja_x: Ri,
    replay_past_ninja_y: Ki,
    replay_past_ninjas_len: Gi,
    replay_place_ninja: Hi,
    replay_progress: zi,
    replay_progress_preview: Vi,
    replay_regular_door_anim_progress: Ui,
    replay_regular_door_deg: qi,
    replay_regular_door_x: Fi,
    replay_regular_door_y: Wi,
    replay_regular_doors_len: Zi,
    replay_replay_length: T_,
    replay_score: Yi,
    replay_seek: Xi,
    replay_seek_preview: Ji,
    replay_send_past_ninjas: Qi,
    replay_set_input: e_,
    replay_shove_thwump_deg: t_,
    replay_shove_thwump_touch: r_,
    replay_shove_thwump_x: s_,
    replay_shove_thwump_y: n_,
    replay_shove_thwumps_len: o_,
    replay_thwump_deg: i_,
    replay_thwump_x: __,
    replay_thwump_y: l_,
    replay_thwumps_len: a_,
    replay_tick: c_,
    replay_tiles_path: d_,
    replay_trap_door_anim_progress: u_,
    replay_trap_door_deg: p_,
    replay_trap_door_x: h_,
    replay_trap_door_y: g_,
    replay_trap_doors_len: f_,
    replay_trap_switch_x: y_,
    replay_trap_switch_y: w_,
    replay_zap_drone_deg: m_,
    replay_zap_drone_x: b_,
    replay_zap_drone_y: x_,
    replay_zap_drones_len: v_
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  os(N_);
  tr();
  function M_({ x: t, y: e, deg: r }) {
    return `translate(${t},${e}) rotate(${r},0,0)`;
  }
  var B_ = m("<svg><path stroke-linejoin=round stroke-linecap=round stroke-width=1.0909090909090908></svg>", false, true, false);
  const I_ = [
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
      return r ? I_.map(([s, o]) => `M ${20 * r[s]} ${20 * r[s + 13]} ${20 * r[o]} ${20 * r[o + 13]}`).join(" ") : "";
    }
    return (() => {
      var r = B_();
      return k((s) => {
        var o = t.class, i = M_(t.ninja()), l = e();
        return o !== s.e && f(r, "class", s.e = o), i !== s.t && f(r, "transform", s.t = i), l !== s.a && f(r, "d", s.a = l), s;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }
  var O_ = m("<svg><g><rect fill=url(#exit-gradient) y=-11 height=23></rect><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path fill=var(--exit-panel) stroke=var(--exit-border)></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></path><path stroke=var(--exit-border) stroke-width=3 fill=none stroke-linecap=round></svg>", false, true, false), R_ = m("<svg><linearGradient id=exit-gradient x1=0 x2=0 y1=1 y2=0><stop offset=0% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-lower)></stop><stop offset=16% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-upper)></stop><stop offset=19% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-lower)></stop><stop offset=30% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-upper)></stop><stop offset=37% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-lower)></stop><stop offset=44% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-upper)></stop><stop offset=60% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-lower)></stop><stop offset=65% stop-color=var(--open-exit-upper)></stop><stop offset=100% stop-color=var(--open-exit-upper)></svg>", false, true, false);
  function K_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function G_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function H_([t, e], r, s) {
    const o = t(), i = r.exit_doors_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.exit_door_x(n),
        y: r.exit_door_y(n),
        animProgress: r.exit_anim_progress(n, s)
      };
      c && K_(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function rr(t) {
    return u(V, {
      get each() {
        return t.exitDoors();
      },
      children: (e) => u(z_, {
        exitDoor: e
      })
    });
  }
  const ee = 11, U = 2.5;
  function z_(t) {
    return (() => {
      var e = O_(), r = e.firstChild, s = r.nextSibling, o = s.nextSibling, i = o.nextSibling, l = i.nextSibling;
      return k((n) => {
        var c = G_(t.exitDoor), p = -13 + 4 * (1 - t.exitDoor().animProgress), x = 26 - 8 * (1 - t.exitDoor().animProgress), g = `M ${-13 * t.exitDoor().animProgress} 0 v ${-ee} h ${-ee + U} l ${-U} ${U} v ${2 * (ee - U)} l ${U} ${U} h ${ee - U} z`, C = `M ${13 * t.exitDoor().animProgress} 0 v ${-ee} h ${ee - U} l ${U} ${U} v ${2 * (ee - U)} l ${-U} ${U} h ${-ee + U} z`, j = `M ${-13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * ee} v ${t.exitDoor().animProgress * ee} h ${-ee + U + t.exitDoor().animProgress} l ${-U} ${-U} v ${(1 - t.exitDoor().animProgress) * (-ee + U)}`, G = `M ${13 * t.exitDoor().animProgress} 0 m 0 ${(1 - t.exitDoor().animProgress) * ee} v ${t.exitDoor().animProgress * ee} h ${ee - U - t.exitDoor().animProgress} l ${U} ${-U} v ${(1 - t.exitDoor().animProgress) * (-ee + U)}`;
        return c !== n.e && f(e, "transform", n.e = c), p !== n.t && f(r, "x", n.t = p), x !== n.a && f(r, "width", n.a = x), g !== n.o && f(s, "d", n.o = g), C !== n.i && f(o, "d", n.i = C), j !== n.n && f(i, "d", n.n = j), G !== n.s && f(l, "d", n.s = G), n;
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
  function V_() {
    return R_();
  }
  var U_ = m('<svg><g><path d="M 0 0 m -5 -4.5 h 10 l 2 2 v 5 l -2 2 h -10 l -2 -2 v -5 l 2 -2"></path><path stroke=var(--exit-switch-center) fill=none></path><path stroke=var(--exit-switch-center) fill=none></svg>', false, true, false);
  function q_(t, e) {
    return t.x == e.x && t.y == e.y && t.animProgress === e.animProgress;
  }
  function F_(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function W_([t, e], r, s) {
    const o = t(), i = r.exit_doors_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.exit_switch_x(n),
        y: r.exit_switch_y(n),
        animProgress: r.exit_anim_progress(n, s)
      };
      c && q_(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function sr(t) {
    return u(V, {
      get each() {
        return t.exitSwitches();
      },
      children: (e) => u(Z_, {
        exitSwitch: e
      })
    });
  }
  const xe = 2;
  function Z_(t) {
    return (() => {
      var e = U_(), r = e.firstChild, s = r.nextSibling, o = s.nextSibling;
      return k((i) => {
        var l = F_(t.exitSwitch), n = `var(--exit-switch-background${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, c = `var(--exit-switch-border${t.exitSwitch().animProgress > 0 ? "-collected" : ""})`, p = `M ${-2 * t.exitSwitch().animProgress} ${-xe} h ${-xe} v ${2 * xe} h ${xe}`, x = `M ${2 * t.exitSwitch().animProgress} ${-xe} h ${xe} v ${2 * xe} h ${-xe}`;
        return l !== i.e && f(e, "transform", i.e = l), n !== i.t && f(r, "fill", i.t = n), c !== i.a && f(r, "stroke", i.a = c), p !== i.o && f(s, "d", i.o = p), x !== i.i && f(o, "d", i.i = x), i;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), e;
    })();
  }
  var Y_ = m("<svg><use href=#one-way></svg>", false, true, false), X_ = m("<svg><g id=one-way><line stroke=var(--oneway-long) x1=-0.5 y1=-12 x2=-0.5 y2=12></line><line stroke=var(--oneway-short) x1=-3.5 y1=-9 x2=-3.5 y2=9></svg>", false, true, false);
  function J_(t, e) {
    return t.x === e.x && t.y === e.y && t.deg === e.deg;
  }
  function Q_(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function el([t, e], r) {
    const s = t(), o = r.one_ways_len(), i = [];
    for (let l = 0; l < o; l++) {
      const n = s.at(l), c = {
        x: r.one_way_x(l),
        y: r.one_way_y(l),
        deg: r.one_way_deg(l)
      };
      n && J_(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function nr(t) {
    return u(V, {
      get each() {
        return t.oneWays();
      },
      children: (e) => (() => {
        var r = Y_();
        return k(() => f(r, "transform", Q_(e))), r;
      })()
    });
  }
  function or() {
    return (() => {
      var t = X_(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var tl = m("<svg><use></svg>", false, true, false), rl = m("<svg><g id=toggled><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--mine-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--mine-exterior) r=2.727272727272727></circle><circle fill=var(--mine-interior) r=1.9090909090909092></svg>", false, true, false), sl = m("<svg><g id=untoggled><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggle-mine) fill=none></svg>", false, true, false), nl = m("<svg><g id=toggling><circle r=2.727272727272727 stroke-width=1.0909090909090908 stroke=var(--toggling-mine) fill=none></svg>", false, true, false);
  const ol = 0, il = 1;
  function _l(t, e) {
    return t.x === e.x && t.y === e.y && t.type === e.type;
  }
  function ll(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function al([t, e], r) {
    const s = t(), o = r.mines_len(), i = [];
    for (let l = 0; l < o; l++) {
      const n = s.at(l), c = {
        x: r.mine_x(l),
        y: r.mine_y(l),
        type: r.mine_state(l)
      };
      n && _l(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function ir(t) {
    return u(V, {
      get each() {
        return t.mines();
      },
      children: (e) => (() => {
        var r = tl();
        return k((s) => {
          var o = [
            "#toggled",
            "#untoggled",
            "#toggling"
          ][e().type], i = ll(e);
          return o !== s.e && f(r, "href", s.e = o), i !== s.t && f(r, "transform", s.t = i), s;
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
        var t = rl(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, o = s.nextSibling, i = o.nextSibling;
        return i.nextSibling, t;
      })(),
      (() => {
        var t = sl();
        return t.firstChild, t;
      })(),
      (() => {
        var t = nl();
        return t.firstChild, t;
      })()
    ];
  }
  var cl = m("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), dl = m("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), ul = m("<svg><g class=regular-door></svg>", false, true, false);
  function pl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function hl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function gl([t, e], r, s) {
    const o = t(), i = r.regular_doors_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.regular_door_x(n),
        y: r.regular_door_y(n),
        deg: r.regular_door_deg(n),
        animProgress: r.regular_door_anim_progress(n, s)
      };
      c && pl(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function lr(t) {
    return u(V, {
      get each() {
        return t.regularDoors();
      },
      children: (e) => u(wl, {
        regularDoor: e
      })
    });
  }
  const fl = 1, yl = 12 - fl;
  function wl(t) {
    function e() {
      let r = t.regularDoor().animProgress;
      return 0 + (yl - 0) * r;
    }
    return (() => {
      var r = ul();
      return w(r, u(O, {
        get when() {
          return t.regularDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var s = cl();
              return k(() => f(s, "x2", -e())), s;
            })(),
            (() => {
              var s = dl();
              return k(() => f(s, "x2", e())), s;
            })()
          ];
        }
      })), k(() => f(r, "transform", hl(t.regularDoor))), r;
    })();
  }
  var ml = m("<svg><line class=bar stroke-width=2 x1=-11 y1=0 y2=0></svg>", false, true, false), bl = m("<svg><line class=bar stroke-width=2 x1=11 y1=0 y2=0></svg>", false, true, false), jt = m("<svg><line class=center stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), xl = m("<svg><g class=locked-door></svg>", false, true, false);
  function vl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function $l(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function kl([t, e], r, s) {
    const o = t(), i = r.locked_doors_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.locked_door_x(n),
        y: r.locked_door_y(n),
        deg: r.locked_door_deg(n),
        animProgress: r.locked_door_anim_progress(n, s)
      };
      c && vl(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function ar(t) {
    return u(V, {
      get each() {
        return t.lockedDoors();
      },
      children: (e) => u(Tl, {
        lockedDoor: e
      })
    });
  }
  const Dl = 1, Sl = 12 - Dl;
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
      return o = Math.min(Math.max((o - 0.4) / 0.6, 0), 1), 0 + (Sl - 0) * o;
    }
    return (() => {
      var o = xl();
      return w(o, u(O, {
        get when() {
          return t.lockedDoor().animProgress < 1;
        },
        get children() {
          return [
            (() => {
              var i = ml();
              return k(() => f(i, "x2", -s())), i;
            })(),
            (() => {
              var i = bl();
              return k(() => f(i, "x2", s())), i;
            })()
          ];
        }
      }), null), w(o, u(O, {
        get when() {
          return t.lockedDoor().animProgress < 0.5;
        },
        get children() {
          return [
            (() => {
              var i = jt();
              return k((l) => {
                var n = e(), c = r();
                return n !== l.e && f(i, "x1", l.e = n), c !== l.t && f(i, "x2", l.t = c), l;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = jt();
              return k((l) => {
                var n = -e(), c = -r();
                return n !== l.e && f(i, "x1", l.e = n), c !== l.t && f(i, "x2", l.t = c), l;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      }), null), k(() => f(o, "transform", $l(t.lockedDoor))), o;
    })();
  }
  var Ll = m("<svg><use></svg>", false, true, false), Pl = m("<svg><g id=locked-switch><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=-0.5 x2=1.5 y2=-0.5 stroke-width=1></svg>", false, true, false), El = m("<svg><g id=locked-switch-touched><rect x=-3.25 y=-3.25 width=6.5 height=6.5></rect><line x1=-1.5 y1=0.5 x2=1.5 y2=0.5 stroke-width=1></svg>", false, true, false);
  function jl(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function Cl(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Al([t, e], r) {
    const s = t(), o = r.locked_doors_len(), i = [];
    for (let l = 0; l < o; l++) {
      const n = s.at(l), c = {
        x: r.locked_switch_x(l),
        y: r.locked_switch_y(l),
        wasTouched: r.locked_door_anim_progress(l, 1) >= 0
      };
      n && jl(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function cr(t) {
    return u(V, {
      get each() {
        return t.lockedSwitches();
      },
      children: (e) => (() => {
        var r = Ll();
        return k((s) => {
          var o = e().wasTouched ? "#locked-switch-touched" : "#locked-switch", i = Cl(e);
          return o !== s.e && f(r, "href", s.e = o), i !== s.t && f(r, "transform", s.t = i), s;
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
        var t = Pl(), e = t.firstChild;
        return e.nextSibling, t;
      })(),
      (() => {
        var t = El(), e = t.firstChild;
        return e.nextSibling, t;
      })()
    ];
  }
  var Nl = m("<svg><line stroke=var(--trap-door-bar) stroke-width=2 y1=0 y2=0></svg>", false, true, false), Ct = m("<svg><line stroke=var(--trap-door-center) stroke-width=4 stroke-linecap=round y1=0 y2=0></svg>", false, true, false), Ml = m("<svg><g></svg>", false, true, false);
  function Bl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function Il(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Ol([t, e], r, s) {
    const o = t(), i = r.trap_doors_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.trap_door_x(n),
        y: r.trap_door_y(n),
        deg: r.trap_door_deg(n),
        animProgress: r.trap_door_anim_progress(n, s)
      };
      c && Bl(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function ur(t) {
    return u(V, {
      get each() {
        return t.trapDoors();
      },
      children: (e) => u(Gl, {
        trapDoor: e
      })
    });
  }
  const Rl = 1, Kl = 12 - Rl;
  function Gl(t) {
    function e() {
      return 6.5 * t.trapDoor().animProgress;
    }
    function r() {
      return 4 * t.trapDoor().animProgress;
    }
    function s() {
      let o = t.trapDoor().animProgress;
      return 0 + (Kl - 0) * o;
    }
    return (() => {
      var o = Ml();
      return w(o, u(O, {
        get when() {
          return t.trapDoor().animProgress >= 0;
        },
        get children() {
          return [
            (() => {
              var i = Nl();
              return k((l) => {
                var n = -s(), c = s();
                return n !== l.e && f(i, "x1", l.e = n), c !== l.t && f(i, "x2", l.t = c), l;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = Ct();
              return k((l) => {
                var n = e(), c = r();
                return n !== l.e && f(i, "x1", l.e = n), c !== l.t && f(i, "x2", l.t = c), l;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })(),
            (() => {
              var i = Ct();
              return k((l) => {
                var n = -e(), c = -r();
                return n !== l.e && f(i, "x1", l.e = n), c !== l.t && f(i, "x2", l.t = c), l;
              }, {
                e: void 0,
                t: void 0
              }), i;
            })()
          ];
        }
      })), k(() => f(o, "transform", Il(t.trapDoor))), o;
    })();
  }
  var Hl = m("<svg><use></svg>", false, true, false), zl = m("<svg><g id=trap-switch><rect fill=var(--trap-switch-background) stroke=var(--trap-switch-border) x=-1.5 y=-1.5 width=3 height=3></svg>", false, true, false), Vl = m("<svg><g id=trap-switch-touched><rect fill=var(--trap-switch-background-collected) x=-1.5 y=-1.5 width=3 height=3></rect><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=-1.5 x2=1.5 y2=-1.5></line><line stroke=var(--trap-switch-border-collected) x1=-1.5 y1=1.5 x2=1.5 y2=1.5></svg>", false, true, false);
  function Ul(t, e) {
    return t.x === e.x && t.y === e.y && t.wasTouched === e.wasTouched;
  }
  function ql(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function Fl([t, e], r) {
    const s = t(), o = r.trap_doors_len(), i = [];
    for (let l = 0; l < o; l++) {
      const n = s.at(l), c = {
        x: r.trap_switch_x(l),
        y: r.trap_switch_y(l),
        wasTouched: r.trap_door_anim_progress(l, 1) >= 0
      };
      n && Ul(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function pr(t) {
    return u(V, {
      get each() {
        return t.trapSwitches();
      },
      children: (e) => (() => {
        var r = Hl();
        return k((s) => {
          var o = e().wasTouched ? "#trap-switch-touched" : "#trap-switch", i = ql(e);
          return o !== s.e && f(r, "href", s.e = o), i !== s.t && f(r, "transform", s.t = i), s;
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
        var t = zl();
        return t.firstChild, t;
      })(),
      (() => {
        var t = Vl(), e = t.firstChild, r = e.nextSibling;
        return r.nextSibling, t;
      })()
    ];
  }
  var Wl = m("<svg><g><rect fill=var(--launch-pad-long) x=0 y=-7.5 width=1.5 height=15></rect><line stroke=var(--launch-pad-short) stroke-width=1.5 stroke-linecap=round x1=2.25 y1=-4.5 x2=2.25 y2=4.5></svg>", false, true, false);
  function Zl(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Yl(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Xl([t, e], r) {
    const s = t(), o = r.launch_pads_len(), i = [];
    for (let l = 0; l < o; l++) {
      const n = s.at(l), c = {
        x: r.launch_pad_x(l),
        y: r.launch_pad_y(l),
        deg: r.launch_pad_deg(l)
      };
      n && Zl(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function gr(t) {
    return u(V, {
      get each() {
        return t.launchPads();
      },
      children: (e) => u(Jl, {
        launchPad: e
      })
    });
  }
  function Jl(t) {
    return (() => {
      var e = Wl(), r = e.firstChild;
      return r.nextSibling, k(() => f(e, "transform", Yl(t.launchPad))), e;
    })();
  }
  var Ql = m('<svg><g><path d="M -6.25 6 V -2.5 L -2.75 -6 H 2.75 L 6.25 -2.5 V 6 H 4.25 l -1.5 -1.5 H -2.75 l -1.5 1.5 Z"></svg>', false, true, false);
  function ea(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function ta(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function ra([t, e], r, s) {
    const o = t(), i = r.floor_guards_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.floor_guard_x(n, s),
        y: r.floor_guard_y(n, s),
        deg: r.floor_guard_deg(n)
      };
      c && ea(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function fr(t) {
    return u(V, {
      get each() {
        return t.floorGuards();
      },
      children: (e) => u(sa, {
        floorGuard: e
      })
    });
  }
  function sa(t) {
    return (() => {
      var e = Ql();
      return e.firstChild, k(() => f(e, "transform", ta(t.floorGuard))), e;
    })();
  }
  var na = m("<svg><use href=#bounceblock></svg>", false, true, false), oa = m('<svg><g id=bounceblock><path fill=var(--bounceblock-interior) d="M -9.818181818181818 -9.818181818181818 L 9.818181818181818 -9.818181818181818 L 9.818181818181818 9.818181818181818 L -9.818181818181818 9.818181818181818 Z"></path><path stroke=var(--bounceblock-border) d="M -9.272727272727273 5.454545454545454 V 9.272727272727273 H -5.454545454545454 M -2.1818181818181817 9.272727272727273 H 2.1818181818181817 M 5.454545454545454 9.272727272727273 H 9.272727272727273 V 5.454545454545454 M 9.272727272727273 2.1818181818181817 V -2.1818181818181817 M 9.272727272727273 -5.454545454545454 V -9.272727272727273 H 5.454545454545454 M 2.1818181818181817 -9.272727272727273 H -2.1818181818181817 M -5.454545454545454 -9.272727272727273 H -9.272727272727273 V -5.454545454545454 M -9.272727272727273 -2.1818181818181817 V 2.1818181818181817"fill=none stroke-width=1.0909090909090908></svg>', false, true, false);
  function ia(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function _a(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function la([t, e], r, s) {
    const o = t(), i = r.bounce_blocks_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.bounce_block_x(n, s),
        y: r.bounce_block_y(n, s),
        deg: r.bounce_block_deg(n)
      };
      c && ia(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function yr(t) {
    return u(V, {
      get each() {
        return t.bounceBlocks();
      },
      children: (e) => (() => {
        var r = na();
        return k(() => f(r, "transform", _a(e))), r;
      })()
    });
  }
  function wr() {
    return (() => {
      var t = oa(), e = t.firstChild;
      return e.nextSibling, t;
    })();
  }
  var aa = m("<svg><use href=#boostpad></svg>", false, true, false), ca = m("<svg><g id=boostpad stroke-width=1.25><line stroke-linecap=round x1=5.5 y1=-2.9000000000000004 x2=2.9000000000000004 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=1.2999999999999998 x2=-1.2999999999999998 y2=-5.5></line><line stroke-linecap=round x1=5.5 y1=5.5 x2=-5.5 y2=-5.5></line><line stroke-linecap=round x1=1.2999999999999998 y1=5.5 x2=-5.5 y2=-1.2999999999999998></line><line stroke-linecap=round x1=-2.9000000000000004 y1=5.5 x2=-5.5 y2=2.9000000000000004></svg>", false, true, false);
  function da(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.animProgress === e.animProgress;
  }
  function ua(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function pa([t, e], r, s) {
    const o = t(), i = r.boost_pads_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.boost_pad_x(n),
        y: r.boost_pad_y(n),
        deg: r.boost_pad_deg(n, s),
        animProgress: r.boost_pad_anim_progress(n, s)
      };
      c && da(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function mr(t) {
    return u(V, {
      get each() {
        return t.boostPads();
      },
      children: (e) => (() => {
        var r = aa();
        return k((s) => {
          var o = `color-mix(in srgb-linear, var(--boost-pad) ${e().animProgress * 100}%, var(--boost-pad-wooshing))`, i = ua(e);
          return o !== s.e && f(r, "stroke", s.e = o), i !== s.t && f(r, "transform", s.t = i), s;
        }, {
          e: void 0,
          t: void 0
        }), r;
      })()
    });
  }
  function br() {
    return (() => {
      var t = ca(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, o = s.nextSibling;
      return o.nextSibling, t;
    })();
  }
  var ha = m("<svg><use href=#thwump></svg>", false, true, false), ga = m('<svg><g id=thwump><rect stroke-width=2.5 stroke=var(--thwump-border) fill=var(--thwump-border) stroke-linejoin=round x=-9 y=-9 width=18 height=18></rect><path fill=var(--thwump-interior) d="M 9 -8.5 H 1.5 a 2 2 0 0 1 -2 2 H -6.5 V 6.5 H -0.5 a 2 2 0 0 1 2 2 H 9 Z"></path><path fill=var(--thwump-ray) stroke=var(--thwump-ray) stroke-width=0.5 d="M 8.5 -8.5 H 10.25 V 8.5 H 8.5 Z"></svg>', false, true, false);
  function fa(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function ya(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function wa([t, e], r, s) {
    const o = t(), i = r.thwumps_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.thwump_x(n, s),
        y: r.thwump_y(n, s),
        deg: r.thwump_deg(n)
      };
      c && fa(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function xr(t) {
    return u(V, {
      get each() {
        return t.thwumps();
      },
      children: (e) => (() => {
        var r = ha();
        return k(() => f(r, "transform", ya(e))), r;
      })()
    });
  }
  function vr() {
    return (() => {
      var t = ga(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var ma = m("<svg><g class=shove-thwump><rect stroke-linejoin=round stroke-width=2 x=-5.5 y=-5.5 width=11 height=11></svg>", false, true, false), ba = m("<svg><g><line stroke=black x1=0 y1=0 x2=11.5 y2=0></line><line stroke=black stroke-linecap=round x1=11.5 y1=-11.5 x2=11.5 y2=11.5></line><line stroke=black stroke-linecap=round stroke-width=3 x1=11.5 y1=-5.5 x2=11.5 y2=5.5></svg>", false, true, false);
  function xa(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg && t.touch === e.touch;
  }
  function va(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function $a([t, e], r, s) {
    const o = t(), i = r.shove_thwumps_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.shove_thwump_x(n, s),
        y: r.shove_thwump_y(n, s),
        deg: r.shove_thwump_deg(n),
        touch: r.shove_thwump_touch(n)
      };
      c && xa(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function $r(t) {
    return u(V, {
      get each() {
        return t.shoveThwumps();
      },
      children: (e) => u(ka, {
        shoveThwump: e
      })
    });
  }
  function ka(t) {
    return (() => {
      var e = ma(), r = e.firstChild;
      return w(e, u(bt, {
        each: [
          0,
          2,
          4,
          6
        ],
        children: (s) => u(O, {
          get when() {
            return t.shoveThwump().touch >= 16 || s === t.shoveThwump().touch;
          },
          get children() {
            var o = ba(), i = o.firstChild, l = i.nextSibling;
            return l.nextSibling, f(o, "transform", `rotate(${45 * s},0,0)`), o;
          }
        })
      }), r), k(() => f(e, "transform", va(t.shoveThwump))), e;
    })();
  }
  const kr = Dr((t) => {
    const e = String.fromCharCode(...t.export_map());
    localStorage.setItem("map", e);
  }, 1e3);
  function Da(t) {
    const e = localStorage.getItem("map");
    if (e) {
      const r = Uint8Array.from(e, (s) => s.charCodeAt(0));
      t.load_map(r);
    }
    return !!e;
  }
  function Sa(t) {
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
  const La = Dr(Pa, 1e3);
  function Pa(t) {
    const e = JSON.stringify(t);
    localStorage.setItem("palette", e);
  }
  function Ea() {
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
  const ja = "" + new URL("palette-CZVUb4uS.png", import.meta.url).href, Sr = [
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
  }, Ca = {
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
  }, Aa = (() => {
    const t = {};
    for (const e of At) {
      t[e] = 0;
      for (const r of At) Nt[r] < Nt[e] && (t[e] += Ca[r]);
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
  ], Na = {
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
  let Lr;
  async function Ma() {
    const e = await (await fetch(ja)).blob(), r = await createImageBitmap(e), s = document.createElement("canvas");
    s.width = r.width, s.height = r.height;
    const o = s.getContext("2d");
    o.drawImage(r, 0, 0), Lr = o;
  }
  function Pr(t) {
    const e = Lr, r = Sr.indexOf(t);
    if (!e || r < 0) return;
    const s = {};
    for (const o of Tr) {
      const { file: i, index: l } = Na[o], n = Aa[i] + l, c = e.getImageData(n, r, 1, 1).data, p = `rgb(${c[0]} ${c[1]} ${c[2]})`;
      s[o] = p;
    }
    return s;
  }
  function Ba(t) {
    for (const e of Tr) document.body.style.setProperty(e, t[e]);
  }
  var Ia = m('<div style="padding:0 1.2em;color:var(--main-menu-text)"><label style=color:var(--main-menu-selected);cursor:pointer;text-decoration:underline>Import map<input type=file style=display:none></label> | <a href=# download=Untitled style=color:var(--main-menu-selected)>Export map</a> | <label>Show trail <input type=checkbox></label> | Object corners <select><option>square</option><option>rounded</option></select> | <label>Friction mod <input type=checkbox></label> | <select></select><input type=text style=float:right>'), Oa = m("<option>");
  function Ra(t) {
    return (() => {
      var e = Ia(), r = e.firstChild, s = r.firstChild, o = s.nextSibling, i = r.nextSibling, l = i.nextSibling, n = l.nextSibling, c = n.nextSibling, p = c.firstChild, x = p.nextSibling, g = c.nextSibling, C = g.nextSibling, j = C.firstChild, G = j.nextSibling, H = C.nextSibling, q = H.nextSibling, z = q.firstChild, P = z.nextSibling, M = q.nextSibling, B = M.nextSibling, R = B.nextSibling;
      return o.addEventListener("change", function() {
        const T = this.files;
        if (T && T.length > 0) {
          const I = new FileReader();
          I.onloadend = () => {
            I.result instanceof ArrayBuffer && (t.editor.load_map(new Uint8Array(I.result)), t.render(true), t.setLevelName(t.editor.get_level_name()));
          }, I.readAsArrayBuffer(T[0]);
        }
      }), l.$$click = function() {
        const T = t.editor.export_map(), I = new Blob([
          T.buffer
        ], {
          type: "application/octet-stream"
        }), Y = URL.createObjectURL(I);
        this.href = Y, this.download = t.editor.get_level_name().replaceAll(/[^a-z]/gi, "_"), setTimeout(() => URL.revokeObjectURL(Y), 100);
      }, x.addEventListener("change", (T) => {
        t.setShowTrail(T.currentTarget.checked), t.editor.set_show_trail(T.currentTarget.checked);
      }), C.addEventListener("change", (T) => t.setRoundCorners(T.currentTarget.value == "rounded")), P.addEventListener("change", (T) => {
        t.setDynamicFriction(T.currentTarget.checked);
      }), B.addEventListener("change", (T) => {
        const I = Pr(T.currentTarget.value);
        I && t.setPalette({
          name: T.currentTarget.value,
          colors: I
        });
      }), w(B, () => Sr.map((T) => (() => {
        var I = Oa();
        return w(I, T), k(() => {
          var _a2;
          return I.selected = T === (((_a2 = t.palette()) == null ? void 0 : _a2.name) ?? "vasquez");
        }), I;
      })())), R.addEventListener("change", () => kr(t.editor)), R.$$input = (T) => {
        t.editor.set_level_name(T.currentTarget.value), t.setLevelName(t.editor.get_level_name());
      }, k((T) => {
        var I = !t.roundCorners(), Y = t.roundCorners();
        return I !== T.e && (j.selected = T.e = I), Y !== T.t && (G.selected = T.t = Y), T;
      }, {
        e: void 0,
        t: void 0
      }), k(() => x.checked = t.showTrail()), k(() => P.checked = t.dynamicFriction()), k(() => R.value = t.levelName()), e;
    })();
  }
  nt([
    "click",
    "input"
  ]);
  var Ka = m("<svg><use href=#zapdrone></svg>", false, true, false), Ga = m('<svg><g id=zapdrone><path fill=var(--zap-drone-background) stroke=var(--zap-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--zap-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--zap-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false), Ha = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 1 12 12 a 12 12 0 0 1 -12 12 l 5 -5 m 0 10 l -5 -5"></svg>', false, true, false), za = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 12 0 a 12 12 0 0 0 12 -12 a 12 12 0 0 0 -12 -12 l 5 5 m 0 -10 l -5 5"></svg>', false, true, false), Va = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V 24 l -5 -5 m 10 0 l -5 5"></svg>', false, true, false), Ua = m('<svg><path fill=none stroke=var(--mode-indicator) d="M 6 0 H 12 V -24 l -5 5 m 10 0 l -5 -5"></svg>', false, true, false), qa = m("<svg><g></svg>", false, true, false);
  function Fa(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function Wa(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function Za([t, e], r, s) {
    const o = t(), i = r.zap_drones_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.zap_drone_x(n, s),
        y: r.zap_drone_y(n, s),
        deg: r.zap_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && Fa(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Er(t) {
    return u(V, {
      get each() {
        return t.zapDrones();
      },
      children: (e) => (() => {
        var r = Ka();
        return k(() => f(r, "transform", Wa(e))), r;
      })()
    });
  }
  function jr() {
    return (() => {
      var t = Ga(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  function Ya({ entities: t }) {
    const e = () => t.zapDrones().at(0) ?? t.chaseDrones().at(0) ?? t.chaingunDrones().at(0) ?? t.laserDrones().at(0), r = (s) => {
      const o = s();
      if (o) {
        const { x: i, y: l, deg: n } = o;
        return `translate(${i},${l}) rotate(${n},0,0)`;
      } else return "";
    };
    return (() => {
      var s = qa();
      return w(s, u(O, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 0;
        },
        get children() {
          return Ha();
        }
      }), null), w(s, u(O, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 1;
        },
        get children() {
          return za();
        }
      }), null), w(s, u(O, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 2;
        },
        get children() {
          return Va();
        }
      }), null), w(s, u(O, {
        get when() {
          var _a2;
          return ((_a2 = e()) == null ? void 0 : _a2.mode) === 3;
        },
        get children() {
          return Ua();
        }
      }), null), k(() => f(s, "transform", r(e))), s;
    })();
  }
  var Xa = m("<svg><use href=#chaingundrone></svg>", false, true, false), Ja = m('<svg><g id=chaingundrone><path fill=var(--chaingun-drone-background) stroke=var(--chaingun-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chaingun-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--chaingun-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function Qa(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function ec(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function tc([t, e], r, s) {
    const o = t(), i = r.chaingun_drones_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.chaingun_drone_x(n, s),
        y: r.chaingun_drone_y(n, s),
        deg: r.chaingun_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && Qa(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Cr(t) {
    return u(V, {
      get each() {
        return t.chaingunDrones();
      },
      children: (e) => (() => {
        var r = Xa();
        return k(() => f(r, "transform", ec(e))), r;
      })()
    });
  }
  function Ar() {
    return (() => {
      var t = Ja(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var rc = m("<svg><use href=#bat></svg>", false, true, false), sc = m("<svg><circle id=bat r=5 cx=0 cy=0 fill=var(--bat-body)></svg>", false, true, false);
  function nc(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function oc(t) {
    return u(V, {
      get each() {
        return t.bats();
      },
      children: (e) => (() => {
        var r = rc();
        return k(() => f(r, "transform", nc(e))), r;
      })()
    });
  }
  function ic() {
    return sc();
  }
  var _c = m("<svg><use href=#laserdrone></svg>", false, true, false), lc = m('<svg><g id=laserdrone><path fill=none stroke=var(--laser-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--laser-drone-border) d="M 10 -2 H 2 A 2 2 0 0 0 0 0 A 2 2 0 0 0 2 2 H 10 Z"></path><path fill=none stroke=var(--laser-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function ac(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function cc(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function dc([t, e], r, s) {
    const o = t(), i = r.laser_drones_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.laser_drone_x(n, s),
        y: r.laser_drone_y(n, s),
        deg: r.laser_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && ac(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Nr(t) {
    return u(V, {
      get each() {
        return t.laserDrones();
      },
      children: (e) => (() => {
        var r = _c();
        return k(() => f(r, "transform", cc(e))), r;
      })()
    });
  }
  function Mr() {
    return (() => {
      var t = lc(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var uc = m("<svg><use href=#chasedrone></svg>", false, true, false), pc = m('<svg><g id=chasedrone><path fill=var(--chase-drone-background) stroke=var(--chase-drone-border) d="M -10 4 V -4 L -4 -10 H 4 L 10 -4 V 4 L 4 10 H -4 Z"></path><path fill=var(--chase-drone-border) d="M 10 -3 H 3 A 3 3 0 0 0 0 0 A 3 3 0 0 0 3 3 H 10 Z"></path><path fill=none stroke=var(--chase-drone-border) stroke-width=3 stroke-linecap=round d="M 0 -10 H -4 L -10 -4 V 4 L -4 10 H 0"></svg>', false, true, false);
  function hc(t, e) {
    return t.x == e.x && t.y == e.y && t.deg == e.deg;
  }
  function gc(t) {
    const { x: e, y: r, deg: s } = t();
    return `translate(${e},${r}) rotate(${s},0,0)`;
  }
  function fc([t, e], r, s) {
    const o = t(), i = r.chase_drones_len(), l = [];
    for (let n = 0; n < i; n++) {
      const c = o.at(n), p = {
        x: r.chase_drone_x(n, s),
        y: r.chase_drone_y(n, s),
        deg: r.chase_drone_deg(n),
        mode: (c == null ? void 0 : c.mode) ?? 0
      };
      c && hc(c, p) ? l.push(c) : l.push(p);
    }
    e(l);
  }
  function Br(t) {
    return u(V, {
      get each() {
        return t.chaseDrones();
      },
      children: (e) => (() => {
        var r = uc();
        return k(() => f(r, "transform", gc(e))), r;
      })()
    });
  }
  function Ir() {
    return (() => {
      var t = pc(), e = t.firstChild, r = e.nextSibling;
      return r.nextSibling, t;
    })();
  }
  var yc = m("<svg><use href=#gold></svg>", false, true, false), wc = m("<svg><g id=gold><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-4.090909090909091 y1=0 x2=4.090909090909091 y2=0></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=0 y1=-4.090909090909091 x2=0 y2=4.090909090909091></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-2.8927095593995125 y1=-2.8927095593995125 x2=2.8927095593995125 y2=2.8927095593995125></line><line stroke-linecap=round stroke-width=1.3636363636363635 stroke=var(--gold-exterior) x1=-2.8927095593995125 y1=2.8927095593995125 x2=2.8927095593995125 y2=-2.8927095593995125></line><circle fill=var(--gold-exterior) r=2.727272727272727></circle><circle fill=var(--gold-interior) r=1.9090909090909092></svg>", false, true, false);
  function mc(t, e) {
    return t.x === e.x && t.y === e.y && t.collected === e.collected;
  }
  function bc(t) {
    const { x: e, y: r } = t();
    return `translate(${e},${r})`;
  }
  function xc([t, e], r) {
    const s = t(), o = r.golds_len(), i = [];
    for (let l = 0; l < o; l++) {
      const n = s.at(l), c = {
        x: r.gold_x(l),
        y: r.gold_y(l),
        collected: r.gold_collected(l)
      };
      n && mc(n, c) ? i.push(n) : i.push(c);
    }
    e(i);
  }
  function Or(t) {
    return u(V, {
      get each() {
        return t.golds();
      },
      children: (e) => u(O, {
        get when() {
          return !e().collected;
        },
        get children() {
          var r = yc();
          return k(() => f(r, "transform", bc(e))), r;
        }
      })
    });
  }
  function Rr() {
    return (() => {
      var t = wc(), e = t.firstChild, r = e.nextSibling, s = r.nextSibling, o = s.nextSibling, i = o.nextSibling;
      return i.nextSibling, t;
    })();
  }
  var vc = m('<svg><rect fill="color-mix(in srgb,var(--background) 18%,white 15%)"width=150 height=150 style=mix-blend-mode:hard-light></svg>', false, true, false), $c = m("<svg><circle fill=none stroke=var(--entity-palette-reticle) r=16></svg>", false, true, false), kc = m('<svg><path d="M -13 -13 V -62 H 13 V -13 H 62 V 13 H 13 V 62 H -13 V 13 H -62 V -13 H -13 M -12 -12 H 12 V 12 H -12 V -12"fill-rule=evenodd fill="color-mix(in srgb,var(--background) 18%,white 15%)"style=mix-blend-mode:hard-light></svg>', false, true, false), Dc = m("<svg><rect fill=none stroke=var(--editor-crosshair) stroke-width=2 width=26 height=26></svg>", false, true, false), Sc = m("<svg><use href=#tilemode-crosshair></svg>", false, true, false), Tc = m("<svg><use href=#crosshair></svg>", false, true, false), Lc = m("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), Pc = m('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath><path id=tilemode-crosshair stroke-width=1.5 fill=none d="M -13.5 -9 V -13.5 H -9 M 9 -13.5 H 13.5 V -9 M 13.5 9 V 13.5 H 9 M -9 13.5 H -13.5 V 9"></path><path id=crosshair stroke-width=1.5 fill=none d="M -4 0 H 4 M 0 -4 V 4"></path><filter id=outline filterUnits=userSpaceOnUse x=0 y=0 width=1056 height=600><feMorphology in=SourceAlpha operator=dilate radius=0.75 result=DILATED></feMorphology><feFlood flood-color=var(--editor-crosshair) flood-opacity=1 result=COLOR></feFlood><feComposite in=COLOR in2=DILATED operator=in result=OUTLINE></feComposite><feMerge><feMergeNode in=OUTLINE></feMergeNode><feMergeNode in=SourceGraphic></feMergeNode></feMerge></filter><filter id=hollow><feMorphology in=SourceAlpha operator=dilate radius=3 result=DILATED></feMorphology><feComposite operator=out in=DILATED in2=SourceGraphic></feComposite></filter></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd></path><g></g><path id=selected-tiles fill-rule=evenodd></path><g><path stroke=var(--editor-crosshair) stroke-width=2 fill=none>'), Mt = m("<svg><line class=fine-grid y1=24 y2=576></svg>", false, true, false), Bt = m("<svg><line class=fine-grid x1=24 x2=1032></svg>", false, true, false), Ec = m("<svg><line class=regular-grid y1=24 y2=576></svg>", false, true, false), jc = m("<svg><line class=regular-grid x1=24 x2=1032></svg>", false, true, false), Cc = m("<svg><line class=door-switch-line></svg>", false, true, false);
  const ut = 42, pt = 23, It = 0, Ot = 1, Ac = 3, Nc = 4, ht = 5, Rt = 6, Kt = 7, Mc = 8, gt = 9, Bc = 0, Ic = 1, Oc = 2, Rc = 3, Kc = 5, Gc = 6, Hc = 8, zc = 10, Vc = 11, Uc = 12, qc = 13, Fc = 14, Wc = 15, Zc = 16, Yc = 17, Xc = 20, Jc = 21, Qc = 24, ed = 27, td = 28, rd = new Float64Array([
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
  ]), sd = new Float64Array([
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
    const [t, e] = y([]), [r, s] = y([]), [o, i] = y([]), [l, n] = y([]), [c, p] = y([]), [x, g] = y([]), [C, j] = y([]), [G, H] = y([]), [q, z] = y([]), [P, M] = y([]), [B, R] = y([]), [T, I] = y([]), [Y, ue] = y([]), [D, A] = y([]), [se, ne] = y([]), [_e, pe] = y([]), [le, X] = y([]), [L, J] = y([]), [re, ae] = y([]), [oe, he] = y([]), [d, h] = y([]), [Le, W] = y([]);
    return {
      ninjas: t,
      setNinjas: e,
      mines: r,
      setMines: s,
      golds: o,
      setGolds: i,
      exitDoors: l,
      setExitDoors: n,
      exitSwitches: c,
      setExitSwitches: p,
      regularDoors: x,
      setRegularDoors: g,
      lockedDoors: C,
      setLockedDoors: j,
      lockedSwitches: G,
      setLockedSwitches: H,
      trapDoors: q,
      setTrapDoors: z,
      trapSwitches: P,
      setTrapSwitches: M,
      launchPads: B,
      setLaunchPads: R,
      oneWays: T,
      setOneWays: I,
      chaingunDrones: Y,
      setChaingunDrones: ue,
      laserDrones: D,
      setLaserDrones: A,
      zapDrones: se,
      setZapDrones: ne,
      chaseDrones: _e,
      setChaseDrones: pe,
      floorGuards: le,
      setFloorGuards: X,
      bounceBlocks: L,
      setBounceBlocks: J,
      thwumps: re,
      setThwumps: ae,
      boostPads: oe,
      setBoostPads: he,
      bats: d,
      setBats: h,
      shoveThwumps: Le,
      setShoveThwumps: W
    };
  }
  function zt(t, e, r, s) {
    const o = [], i = [], l = [], n = [], c = [], p = [], x = [], g = [], C = [], j = [], G = [], H = [], q = [], z = [], P = [], M = [], B = [], R = [], T = [], I = [], Y = [], ue = [];
    for (const D of r) {
      const A = {
        x: D.x,
        y: D.y,
        deg: D.deg,
        mode: D.mode,
        animProgress: 0
      }, se = {
        x: D.switch_x,
        y: D.switch_y,
        animProgress: 0,
        wasTouched: false
      }, ne = {
        x1: D.x,
        y1: D.y,
        x2: D.switch_x,
        y2: D.switch_y
      };
      D.type_int === Bc ? o.push(A) : D.type_int === Ic ? i.push({
        ...A,
        type: ol
      }) : D.type_int === Jc ? i.push({
        ...A,
        type: il
      }) : D.type_int === Oc ? l.push({
        ...A,
        collected: false
      }) : D.type_int === Rc ? (n.push(A), Number.isNaN(D.switch_x) || (c.push(se), e.push(ne))) : D.type_int === Kc ? p.push(A) : D.type_int === Gc ? (x.push(A), Number.isNaN(D.switch_x) || (g.push(se), e.push(ne))) : D.type_int === Hc ? (C.push({
        ...A,
        animProgress: s ? 1 : -1
      }), Number.isNaN(D.switch_x) || (j.push(se), e.push(ne))) : D.type_int === zc ? G.push(A) : D.type_int === Vc ? H.push(A) : D.type_int === Uc ? q.push(A) : D.type_int === qc ? z.push(A) : D.type_int === Fc ? P.push(A) : D.type_int === Wc ? M.push(A) : D.type_int === Zc ? B.push(A) : D.type_int === Yc ? R.push(A) : D.type_int === Xc ? T.push(A) : D.type_int === Qc ? I.push({
        ...A,
        animProgress: 1
      }) : D.type_int === ed ? Y.push(A) : D.type_int === td && ue.push({
        ...A,
        touch: 16
      }), D.free();
    }
    t.setNinjas(o), t.setMines(i), t.setGolds(l), t.setExitDoors(n), t.setExitSwitches(c), t.setRegularDoors(p), t.setLockedDoors(x), t.setLockedSwitches(g), t.setTrapDoors(C), t.setTrapSwitches(j), t.setLaunchPads(G), t.setOneWays(H), t.setChaingunDrones(q), t.setLaserDrones(z), t.setZapDrones(P), t.setChaseDrones(M), t.setFloorGuards(B), t.setBounceBlocks(R), t.setThwumps(T), t.setBoostPads(I), t.setBats(Y), t.setShoveThwumps(ue);
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
      u(oc, {
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
          bones: () => rd
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
  function nd(t) {
    const { editor: e, pastNinjas: r } = t, [s, o] = y(""), [i, l] = y(""), [n, c] = y(true), [p, x] = y(false), [g, C] = y(It), [j, G] = y({
      row: 1,
      col: 1
    }), [H, q] = y({
      x: 24,
      y: 24
    }), [z, P] = y(""), [M, B] = y({
      x: NaN,
      y: NaN
    }), [R, T] = y({
      x: NaN,
      y: NaN
    }), I = Ht(), Y = Ht(), [ue, D] = y([]), [A, se] = y(e.get_show_trail()), [ne, _e] = y(), pe = (d) => {
      let h = false;
      if (!(d.target instanceof HTMLInputElement || d.target instanceof HTMLSelectElement)) {
        if (d.ctrlKey || d.metaKey) {
          d.code === "KeyZ" && (d.ctrlKey || d.metaKey) && d.shiftKey ? (h = true, e.redo()) : d.code === "KeyZ" && (d.ctrlKey || d.metaKey) ? (h = true, e.undo()) : d.code === "KeyY" && (d.ctrlKey || d.metaKey) && (h = true, e.redo()), h && (X(true), d.preventDefault());
          return;
        }
        d.shiftKey && (h = true, e.press_shift()), d.code === "Enter" && e.mode() === gt ? t.setReplay(e.to_replay(t.roundCorners(), t.dynamicFriction())) : d.code === "Backquote" ? (h = true, e.press_backtick()) : d.code === "Digit1" ? (h = true, e.press_1(d.shiftKey)) : d.code === "Digit2" ? (h = true, e.press_2(d.shiftKey)) : d.code === "Digit3" ? (h = true, e.press_3(d.shiftKey)) : d.code === "Digit4" ? (h = true, e.press_4(d.shiftKey)) : d.code === "Digit5" ? (h = true, e.press_5(d.shiftKey)) : d.code === "Digit6" ? (h = true, e.press_6(d.shiftKey)) : d.code === "Digit7" ? (h = true, e.press_7(d.shiftKey)) : d.code === "Digit8" ? (h = true, e.press_8(d.shiftKey)) : d.code === "Digit9" ? (h = true, e.press_9()) : d.code === "Digit0" ? (h = true, e.press_0()) : d.code === "Minus" ? (h = true, e.press_dash()) : d.code === "Equal" ? (h = true, e.press_equals()) : d.code === "KeyQ" ? (h = true, e.press_q(d.shiftKey)) : d.code === "KeyW" ? (h = true, e.press_w(d.shiftKey)) : d.code === "KeyA" ? (h = true, e.press_a(d.shiftKey)) : d.code === "KeyS" ? (h = true, e.press_s(d.shiftKey)) : d.code === "KeyE" ? (h = true, e.press_e()) : d.code === "KeyD" ? (h = true, e.press_d()) : d.code === "KeyZ" ? (h = true, e.press_z()) : d.code === "KeyX" ? (h = true, e.press_x()) : d.code === "KeyC" ? (h = true, e.press_c()) : d.code === "Space" ? (h = true, e.press_space()) : d.code === "AltLeft" ? (h = true, e.press_alt_left(d.shiftKey)) : d.code === "KeyR" ? (h = true, e.press_r()) : d.code === "KeyT" ? (h = true, e.press_t()) : d.code === "KeyY" ? (h = true, e.press_y()) : d.code === "KeyU" ? (h = true, e.press_u()) : d.code === "KeyI" ? (h = true, e.press_i()) : d.code === "KeyO" ? (h = true, e.press_o()) : d.code === "KeyP" ? (h = true, e.press_p()) : d.code === "BracketLeft" ? (h = true, e.press_bracket_left()) : d.code === "BracketRight" ? (h = true, e.press_bracket_right()) : d.code === "KeyF" ? (h = true, e.press_f()) : d.code === "KeyH" ? (h = true, e.press_h()) : d.code === "KeyJ" ? (h = true, e.press_j()) : d.code === "KeyK" ? (h = true, e.press_k()) : d.code === "KeyL" ? (h = true, e.press_l()) : d.code === "KeyN" ? (h = true, e.press_n()) : d.code === "KeyM" ? (h = true, e.press_m()) : d.code === "Comma" ? (h = true, e.press_comma()) : d.code === "ArrowUp" ? (h = true, e.press_up(d.shiftKey)) : d.code === "ArrowDown" ? (h = true, e.press_down(d.shiftKey)) : d.code === "ArrowLeft" ? (h = true, e.press_left(d.shiftKey)) : d.code === "ArrowRight" ? (h = true, e.press_right(d.shiftKey)) : d.code === "Enter" ? (h = true, e.press_enter()) : d.code === "Escape" ? h = e.press_escape() : d.code === "Slash" && (h = true, e.press_slash()), h && (X(true), d.preventDefault());
      }
    }, le = (d) => {
      let h = false;
      d.shiftKey || (h = true, e.release_shift()), d.code === "KeyQ" ? (h = true, e.release_q()) : d.code === "KeyW" ? (h = true, e.release_w()) : d.code === "KeyA" ? (h = true, e.release_a()) : d.code === "KeyS" ? (h = true, e.release_s()) : d.code === "KeyE" ? (h = true, e.release_e()) : d.code === "KeyD" ? (h = true, e.release_d()) : d.code === "KeyZ" ? (h = true, e.release_z()) : d.code === "KeyC" ? (h = true, e.release_c()) : d.code === "Space" ? (h = true, e.release_space()) : d.code === "AltLeft" && (h = true, e.release_alt_left()), h && (X(false), d.preventDefault());
    };
    document.addEventListener("keydown", pe), document.addEventListener("keyup", le), Se(() => {
      document.removeEventListener("keydown", pe), document.removeEventListener("keyup", le);
    });
    function X(d) {
      C(e.mode()), o(e.tiles_path()), l(e.selected_tiles_path()), G({
        row: e.tile_crosshair_row(),
        col: e.tile_crosshair_col()
      }), c(e.show_half_grid()), x(e.show_quarter_grid()), q({
        x: e.crosshair_x(),
        y: e.crosshair_y()
      });
      const h = [];
      zt(I, h, e.entities(), false), zt(Y, h, e.preview_entities(), true), D(h), P(e.selected_tile_outline_path()), B({
        x: e.palette_center_x(),
        y: e.palette_center_y()
      }), T({
        x: e.palette_selection_x(),
        y: e.palette_selection_y()
      }), _e(e.past_ninja_bones()), d && kr(e);
    }
    const L = [];
    for (let d = 0; d < ut - 1; d++) L.push(48 + 24 * d);
    const J = [];
    for (let d = 0; d < pt - 1; d++) J.push(48 + 24 * d);
    const re = [];
    for (let d = 0; d < ut; d++) re.push(36 + 24 * d);
    const ae = [];
    for (let d = 0; d < pt; d++) ae.push(36 + 24 * d);
    const oe = [];
    for (let d = 0; d < ut * 2; d++) oe.push(30 + 12 * d);
    const he = [];
    for (let d = 0; d < pt * 2; d++) he.push(30 + 12 * d);
    return X(false), [
      (() => {
        var d = Pc(), h = d.firstChild, Le = h.firstChild, W = Le.nextSibling;
        W.nextSibling;
        var ge = h.nextSibling, $e = ge.nextSibling, be = $e.nextSibling, Ie = be.nextSibling, ot = Ie.firstChild;
        return d.$$contextmenu = (b) => {
          e.press_escape() && (X(false), b.preventDefault());
        }, d.$$mouseup = () => {
          e.cursor_up(), X(false);
        }, d.$$dblclick = (b) => {
          e.double_click(b.shiftKey), X(false);
        }, d.$$mousedown = (b) => {
          b.buttons & 2 || (e.mode() === gt ? t.setReplay(e.to_replay(t.roundCorners(), t.dynamicFriction())) : (e.cursor_down(b.shiftKey), X(true)));
        }, d.$$mousemove = function(b) {
          const { left: $, top: N, width: K, height: fe } = this.getBoundingClientRect(), Pe = e.set_cursor_pos((b.clientX - $) / K * 1056, (b.clientY - N) / fe * 600, b.shiftKey);
          t.globalEventState.setMouseGamePos({
            x: (b.clientX - $) / K * 1056,
            y: (b.clientY - N) / fe * 600
          }), Pe && X(false);
        }, w(h, u(_r, {}), W), w(h, u(Rr, {}), W), w(h, u(or, {}), W), w(h, u(wr, {}), W), w(h, u(dr, {}), W), w(h, u(hr, {}), W), w(h, u(br, {}), W), w(h, u(vr, {}), W), w(h, u(Ar, {}), W), w(h, u(Mr, {}), W), w(h, u(jr, {}), W), w(h, u(Ir, {}), W), w(h, u(ic, {}), W), w(d, u(O, {
          get when() {
            return p();
          },
          get children() {
            return [
              Ne(() => oe.map((b) => (() => {
                var $ = Mt();
                return f($, "x1", b), f($, "x2", b), $;
              })())),
              Ne(() => he.map((b) => (() => {
                var $ = Bt();
                return f($, "y1", b), f($, "y2", b), $;
              })()))
            ];
          }
        }), ge), w(d, u(O, {
          get when() {
            return n();
          },
          get children() {
            return [
              Ne(() => re.map((b) => (() => {
                var $ = Mt();
                return f($, "x1", b), f($, "x2", b), $;
              })())),
              Ne(() => ae.map((b) => (() => {
                var $ = Bt();
                return f($, "y1", b), f($, "y2", b), $;
              })()))
            ];
          }
        }), ge), w(d, () => L.map((b) => (() => {
          var $ = Ec();
          return f($, "x1", b), f($, "x2", b), $;
        })()), ge), w(d, () => J.map((b) => (() => {
          var $ = jc();
          return f($, "y1", b), f($, "y2", b), $;
        })()), ge), w(d, u(Vt, {
          entities: I
        }), ge), w(d, u(O, {
          get when() {
            return g() === Kt;
          },
          get children() {
            var b = vc();
            return k(($) => {
              var N = M().x - Gt / 2, K = M().y - Gt / 2;
              return N !== $.e && f(b, "x", $.e = N), K !== $.t && f(b, "y", $.t = K), $;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), $e), w($e, u(Vt, {
          entities: Y
        })), w(d, u(O, {
          get when() {
            return [
              ht,
              Rt,
              Nc
            ].includes(g());
          },
          get children() {
            return u(Ya, {
              entities: Y
            });
          }
        }), be), w(d, u(O, {
          get when() {
            return g() === Kt;
          },
          get children() {
            var b = $c();
            return k(($) => {
              var N = R().x, K = R().y;
              return N !== $.e && f(b, "cx", $.e = N), K !== $.t && f(b, "cy", $.t = K), $;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), be), w(d, u(O, {
          get when() {
            return g() === Ot;
          },
          get children() {
            var b = kc();
            return k(() => f(b, "transform", `translate(${M().x},${M().y})`)), b;
          }
        }), be), w(d, u(O, {
          get when() {
            return g() === Ot;
          },
          get children() {
            var b = Dc();
            return k(($) => {
              var N = R().x - 13, K = R().y - 13;
              return N !== $.e && f(b, "x", $.e = N), K !== $.t && f(b, "y", $.t = K), $;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), Ie), w(d, u(bt, {
          get each() {
            return ue();
          },
          children: (b) => (() => {
            var $ = Cc();
            return k((N) => {
              var K = b.x1, fe = b.y1, Pe = b.x2, Ee = b.y2;
              return K !== N.e && f($, "x1", N.e = K), fe !== N.t && f($, "y1", N.t = fe), Pe !== N.a && f($, "x2", N.a = Pe), Ee !== N.o && f($, "y2", N.o = Ee), N;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), $;
          })()
        }), Ie), w(d, u(O, {
          get when() {
            return g() === It;
          },
          get children() {
            var b = Sc();
            return k(($) => {
              var N = j().col * 24 + 12, K = j().row * 24 + 12;
              return N !== $.e && f(b, "x", $.e = N), K !== $.t && f(b, "y", $.t = K), $;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), null), w(d, u(O, {
          get when() {
            return g() === Mc || g() === ht;
          },
          get children() {
            var b = Tc();
            return k(($) => {
              var N = H().x, K = H().y;
              return N !== $.e && f(b, "x", $.e = N), K !== $.t && f(b, "y", $.t = K), $;
            }, {
              e: void 0,
              t: void 0
            }), b;
          }
        }), null), w(d, u(O, {
          get when() {
            return g() === gt;
          },
          get children() {
            return u(He, {
              class: "ninja",
              ninja: () => ({
                x: H().x,
                y: H().y,
                deg: 0
              }),
              bones: () => ne() ?? sd
            });
          }
        }), null), w(d, u(O, {
          get when() {
            return A();
          },
          get children() {
            var b = Lc();
            return k(() => f(b, "points", r().map(({ x: $, y: N }) => `${$},${N}`).join(" "))), b;
          }
        }), null), k((b) => {
          var $ = s(), N = [
            Ac,
            ht,
            Rt
          ].includes(g()) ? "url(#outline)" : "", K = i(), fe = z();
          return $ !== b.e && f(ge, "d", b.e = $), N !== b.t && f($e, "filter", b.t = N), K !== b.a && f(be, "d", b.a = K), fe !== b.o && f(ot, "d", b.o = fe), b;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), d;
      })(),
      u(Ra, {
        editor: e,
        render: X,
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
        showTrail: A,
        setShowTrail: se,
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
  var od = m("<div id=media-controls><div class=text-button><div></div></div><div class=scrubber><div class=track></div><div class=progress></div><div class=previewProgress></div><div class=thumb></div></div><div><a href=# download=1234 style=color:var(--main-menu-selected);margin-left:1em>Export attract");
  function id(t) {
    const e = () => {
      const n = t.progress(), c = t.length();
      return c === 0 || n >= c ? "100%" : `${n / c * 100}%`;
    }, r = () => {
      const n = t.progress(), c = t.previewProgress(), p = t.length();
      if (c === void 0 || p === 0) return {
        left: "0%",
        width: "0%"
      };
      const x = Math.min(n, c), g = Math.min(Math.max(n, c), p);
      return {
        left: `${x / p * 100}%`,
        width: `${(g - x) / p * 100}%`
      };
    };
    let s;
    document.addEventListener("mousemove", i), Se(() => document.removeEventListener("mousemove", i)), document.addEventListener("mouseup", l), Se(() => document.removeEventListener("mouseup", l));
    function o(n) {
      if (s) {
        const { left: c, top: p, width: x } = s.getBoundingClientRect();
        let g = (n.clientX - c) / x;
        g = Math.min(1, g), g = Math.max(0, g);
        let C = Math.abs(n.clientY - p);
        return {
          targetFrame: Math.round(g * t.length()),
          strength: Math.pow(Math.E, -5 * C / x)
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
          const { targetFrame: p, strength: x } = o(n);
          t.seek(Math.round(c + (p - c) * x)), t.previewSeek(void 0);
        } else s.matches(":hover") ? t.previewSeek(o(n).targetFrame) : t.previewSeek(void 0);
      }
    }
    function l() {
      t.setDragStart(void 0);
    }
    return (() => {
      var n = od(), c = n.firstChild, p = c.firstChild, x = c.nextSibling, g = x.firstChild, C = g.nextSibling, j = C.nextSibling, G = j.nextSibling, H = x.nextSibling, q = H.firstChild;
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
      })), x.$$mousedown = (P) => {
        t.setDragStart(o(P).targetFrame), i(P), P.preventDefault();
      };
      var z = s;
      return typeof z == "function" ? ts(z, x) : s = x, q.$$click = function() {
        const P = t.attract(), M = new Blob([
          P.buffer
        ], {
          type: "application/octet-stream"
        }), B = URL.createObjectURL(M);
        this.href = B, setTimeout(() => URL.revokeObjectURL(B), 100);
      }, k((P) => {
        var M = e(), B = r().left, R = r().width, T = e();
        return M !== P.e && qe(C, "width", P.e = M), B !== P.t && qe(j, "left", P.t = B), R !== P.a && qe(j, "width", P.a = R), T !== P.o && qe(G, "left", P.o = T), P;
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
  var _d = m("<svg><circle r=1.5 fill=var(--background)></svg>", false, true, false), ld = m('<svg><path d="M -3 1 L 0 -3 L 3 1 L 0 -1 Z"stroke=var(--background) fill=none stroke-width=3 stroke-linecap=round stroke-linejoin=round></svg>', false, true, false), ad = m("<svg><g></svg>", false, true, false);
  function cd(t) {
    return [
      u(V, {
        get each() {
          return t.inputs();
        },
        children: (e, r) => (() => {
          var s = ad();
          return w(s, u(O, {
            get when() {
              return !(e() > 0);
            },
            get children() {
              var o = _d();
              return k(() => f(o, "opacity", Number.isNaN(e()) ? 0.3 : 1)), o;
            }
          }), null), w(s, u(O, {
            get when() {
              return e() > 0;
            },
            get children() {
              return ld();
            }
          }), null), k(() => f(s, "transform", `translate(${36 + 24 * r},${24 * 24.5}) rotate(${dd(e())},0,0)`)), s;
        })()
      }),
      u(V, {
        get each() {
          return t.pastNinjas();
        },
        children: (e, r) => u(O, {
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
  function dd(t) {
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
  var ud = m("<span style=position:absolute>"), pd = m("<svg><polyline stroke=var(--ninja) fill=none></svg>", false, true, false), hd = m('<svg viewBox="0 0 1056 600"><defs><clipPath id=tiles-clip><use href=#tiles></use></clipPath></defs><path id=tiles stroke-width=2 clip-path=url(#tiles-clip) clip-rule=evenodd fill-rule=evenodd>'), gd = m("<div>");
  function fd(t) {
    const e = t.replay, [r, s] = y(true), [o, i] = y(true), [l, n] = y(void 0), [c, p] = y(0), [x, g] = y(0), [C, j] = y(void 0), [G, H] = y(5400), q = (v) => {
      if (v.code === "Enter") e.place_ninja(t.globalEventState.mouseGamePos().x, t.globalEventState.mouseGamePos().y), o() || je(1);
      else if (v.code === "Escape") o() ? (i(false), s(false), z()) : (i(true), s(true));
      else if (v.code === "Comma") {
        if (!o() && x() > 0) {
          g(x() - 1), e.seek(x());
          let { isJump1Pressed: E, isJump2Pressed: S, isRightPressed: Q, isLeftPressed: ce, isDownPressed: ye, isSuicidePressed: we } = t.globalEventState;
          E() || S() || Q() || ce() || we() ? e.set_input(E() || S(), Q(), ce(), we()) : ye() && e.set_input(false, false, false, false), z(), je(1);
        }
      } else if (v.code === "Period" && !o()) {
        let { isJump1Pressed: E, isJump2Pressed: S, isRightPressed: Q, isLeftPressed: ce, isDownPressed: ye, isSuicidePressed: we } = t.globalEventState;
        E() || S() || Q() || ce() || we() ? e.set_input(E() || S(), Q(), ce(), we()) : (ye() || e.inputs_len() === e.progress()) && e.set_input(false, false, false, false), e.tick(), g(e.progress()), z(), je(1);
      }
    };
    function z() {
      e.seek_preview(e.progress() + 120), j(e.progress_preview()), K(), Ee(), b();
    }
    document.addEventListener("keydown", q), Se(() => {
      document.removeEventListener("keydown", q);
    });
    const P = () => e.tiles_path(), [M, B] = y({
      x: -50,
      y: -50,
      deg: 0
    }), [R, T] = y({
      x: -50,
      y: -50,
      deg: 0
    }), [I, Y] = y(), [ue, D] = y(), A = y([]), se = y([]), ne = y([]), _e = y([]), pe = y([]), le = y([]), X = y([]), L = y([]), J = y([]), re = y([]), ae = y([]), oe = y([]), he = y([]), d = y([]), h = y([]), Le = y([]), W = y([]), ge = y([]), $e = y([]), be = y([]), [Ie, ot] = y([]);
    function b() {
      const v = [], E = e.past_ninjas_len();
      for (let S = 0; S < E; S++) v.push({
        x: e.past_ninja_x(S),
        y: e.past_ninja_y(S)
      });
      ot(v);
    }
    b();
    const [$, N] = y([]);
    function K() {
      const v = [];
      for (let E = -21; E < 21; E++) {
        const S = E + e.progress();
        S < 0 || S >= e.inputs_len() ? v.push(NaN) : v.push(e.input(S));
      }
      N(v);
    }
    K();
    const [fe, Pe] = y([]);
    function Ee() {
      const v = [];
      for (let E = -20; E <= 20; E++) {
        const S = E + e.progress();
        v.push(e.past_ninja_bones(S));
      }
      Pe(v);
    }
    Ee();
    let xt = performance.now();
    const it = 1e3 / 60;
    let Ue = 0, vt = 0;
    function $t() {
      const v = performance.now(), E = Math.min(v - xt, 250);
      xt = v;
      let S = 1;
      const Q = e;
      if (o() && l() === void 0) {
        if (r() || x() < c()) {
          for (Ue += E; Ue >= it; ) {
            if (r()) {
              let { isJump1Pressed: ce, isJump2Pressed: ye, isRightPressed: we, isLeftPressed: _t, isSuicidePressed: Kr } = t.globalEventState;
              Q.set_input(ce() || ye(), we(), _t(), Kr());
            }
            Q.tick(), K(), Ue -= it;
          }
          S = Ue / it, g(Q.progress());
        } else x() < c() ? (Q.tick(), g(Q.progress())) : i(false);
        je(S);
      }
      vt = requestAnimationFrame($t);
    }
    $t(), Se(() => {
      cancelAnimationFrame(vt);
    });
    function je(v) {
      H(e.score()), B({
        x: e.ninja_x(v),
        y: e.ninja_y(v),
        deg: 0
      }), T({
        x: e.ninja_preview_x(v),
        y: e.ninja_preview_y(v),
        deg: 0
      }), Y(e.ninja_bones(v)), C() === void 0 ? D(void 0) : D(e.ninja_preview_bones(v)), al(A, e), xc(se, e), la(ne, e, v), el(_e, e), pa(pe, e, v), wa(le, e, v), Xl(X, e), ra(L, e, v), kl(J, e, v), Al(re, e), Ol(ae, e, v), Fl(oe, e), gl(he, e, v), $a(d, e, v), H_(h, e, v), W_(Le, e, v), Za(W, e, v), fc(ge, e, v), tc($e, e, v), dc(be, e, v), p(e.replay_length());
    }
    return [
      (() => {
        var v = ud();
        return w(v, () => (G() / 60).toFixed(3)), v;
      })(),
      (() => {
        var v = hd(), E = v.firstChild;
        E.firstChild;
        var S = E.nextSibling;
        return v.$$mousemove = function(Q) {
          const { left: ce, top: ye, width: we, height: _t } = this.getBoundingClientRect();
          t.globalEventState.setMouseGamePos({
            x: (Q.clientX - ce) / we * 1056,
            y: (Q.clientY - ye) / _t * 600
          });
        }, w(E, u(_r, {}), null), w(E, u(Rr, {}), null), w(E, u(wr, {}), null), w(E, u(or, {}), null), w(E, u(dr, {}), null), w(E, u(hr, {}), null), w(E, u(br, {}), null), w(E, u(vr, {}), null), w(E, u(Ar, {}), null), w(E, u(Mr, {}), null), w(E, u(jr, {}), null), w(E, u(Ir, {}), null), w(E, u(V_, {}), null), w(v, u(rr, {
          get exitDoors() {
            return h[0];
          }
        }), S), w(v, u(nr, {
          get oneWays() {
            return _e[0];
          }
        }), S), w(v, u(ir, {
          get mines() {
            return A[0];
          }
        }), S), w(v, u(lr, {
          get regularDoors() {
            return he[0];
          }
        }), S), w(v, u(ar, {
          get lockedDoors() {
            return J[0];
          }
        }), S), w(v, u(ur, {
          get trapDoors() {
            return ae[0];
          }
        }), S), w(v, u(cr, {
          get lockedSwitches() {
            return re[0];
          }
        }), S), w(v, u(pr, {
          get trapSwitches() {
            return oe[0];
          }
        }), S), w(v, u(Or, {
          get golds() {
            return se[0];
          }
        }), S), w(v, u(sr, {
          get exitSwitches() {
            return Le[0];
          }
        }), S), w(v, u(gr, {
          get launchPads() {
            return X[0];
          }
        }), S), w(v, u(Cr, {
          get chaingunDrones() {
            return $e[0];
          }
        }), S), w(v, u(Nr, {
          get laserDrones() {
            return be[0];
          }
        }), S), w(v, u(Er, {
          get zapDrones() {
            return W[0];
          }
        }), S), w(v, u(Br, {
          get chaseDrones() {
            return ge[0];
          }
        }), S), w(v, u(fr, {
          get floorGuards() {
            return L[0];
          }
        }), S), w(v, u(xr, {
          get thwumps() {
            return le[0];
          }
        }), S), w(v, u(He, {
          class: "ninja preview",
          ninja: R,
          bones: ue
        }), S), w(v, u(He, {
          class: "ninja",
          ninja: M,
          bones: I
        }), S), w(v, u(yr, {
          get bounceBlocks() {
            return ne[0];
          }
        }), S), w(v, u($r, {
          get shoveThwumps() {
            return d[0];
          }
        }), S), w(v, u(mr, {
          get boostPads() {
            return pe[0];
          }
        }), S), w(v, u(O, {
          get when() {
            return !o();
          },
          get children() {
            return [
              (() => {
                var Q = pd();
                return k(() => f(Q, "points", Ie().slice(x(), C() || 0).map(({ x: ce, y: ye }) => `${ce},${ye}`).join(" "))), Q;
              })(),
              u(cd, {
                inputs: $,
                pastNinjas: fe
              })
            ];
          }
        }), null), k(() => f(S, "d", P())), v;
      })(),
      (() => {
        var v = gd();
        return w(v, u(O, {
          get when() {
            return !r() || !o();
          },
          get children() {
            return u(id, {
              isPlaying: o,
              setIsPlaying: i,
              dragStart: l,
              setDragStart: n,
              length: c,
              progress: x,
              previewProgress: C,
              seek: (E) => {
                g(E), e.seek(E), K(), Ee(), b(), je(1);
              },
              previewSeek: (E) => {
                j(E), b(), e && (E !== void 0 && l() === void 0 && e.seek_preview(E), je(1));
              },
              attract: () => e.export_attract(t.editor)
            });
          }
        })), v;
      })()
    ];
  }
  nt([
    "mousemove"
  ]);
  var yd = m("<p>Invalid file."), wd = m("<label style=display:inline-block;height:100%;padding:3em;color:var(--main-menu-text)><p>Select your copy of anim_data_line_new.txt.bin to get started.</p><input type=file><dl><dt>Windows</dt><dd>C:\\Program Files (x86)\\Steam\\steamapps\\common\\N++\\anim_data_line_new.txt.bin</dd><dt>Linux</dt><dd>~/.steam/steam/steamapps/common/N++/anim_data_line_new.txt.bin</dd><dt>Mac</dt><dd>~/Library/Application Support/Steam/steamapps/common/N++/N++.app/Contents/Resources/NPP/anim_data_line_new.txt.bin");
  function md() {
    const t = Te.new(), [e, r] = y(), [s, o] = y(""), [i, l] = y(false), [n, c] = y(false), [p, x] = y([]);
    function g() {
      const L = [], J = t.past_ninjas_len();
      for (let re = 0; re < J; re++) L.push({
        x: t.past_ninja_x(re),
        y: t.past_ninja_y(re)
      });
      x(L);
    }
    const [C, j] = y(false), [G, H] = y(false), [q, z] = y(false), [P, M] = y(false), [B, R] = y(false), [T, I] = y(false), [Y, ue] = y({
      x: 36,
      y: 36
    }), D = {
      isJump1Pressed: C,
      isJump2Pressed: G,
      isRightPressed: q,
      isLeftPressed: P,
      isSuicidePressed: B,
      isDownPressed: T,
      mouseGamePos: Y,
      setMouseGamePos: ue
    };
    Da(t), o(t.get_level_name()), document.addEventListener("keydown", (L) => {
      if (!(L.ctrlKey || L.metaKey)) if (L.code === "Tab") {
        const J = e();
        J ? (r(void 0), J.send_past_ninjas(), t.receive_past_ninjas(), J.free(), g()) : r(t.to_replay(i(), n())), L.preventDefault();
      } else L.code === "KeyZ" ? j(true) : L.code === "ArrowUp" ? H(true) : L.code === "ArrowRight" ? z(true) : L.code === "ArrowLeft" ? M(true) : L.code === "ArrowDown" ? I(true) : L.code === "KeyV" && R(true);
    }), document.addEventListener("keyup", (L) => {
      L.code === "KeyZ" ? j(false) : L.code === "ArrowUp" ? H(false) : L.code === "ArrowRight" ? z(false) : L.code === "ArrowLeft" ? M(false) : L.code === "ArrowDown" ? I(false) : L.code === "KeyV" && R(false);
    }), document.addEventListener("blur", () => {
      j(false), H(false), z(false), M(false), R(false), I(false);
    }), Ta(t);
    const A = 0, se = 1, ne = 2, [_e, pe] = y(t.get_anim_state() == A ? A : ne), [le, X] = y(Ea());
    return Vr(() => {
      const L = le();
      L && (Ba(L.colors), La(L));
    }), Ma().then(() => {
      const L = le();
      if (L) {
        const J = Pr(L.name);
        J && (L.colors = J), X(L);
      }
    }), [
      u(O, {
        get when() {
          return _e() != A;
        },
        get children() {
          var L = wd(), J = L.firstChild, re = J.nextSibling;
          return re.nextSibling, re.addEventListener("change", function() {
            const ae = this.files;
            if (ae && ae.length > 0) {
              const oe = new FileReader();
              oe.onloadend = () => {
                if (oe.result instanceof ArrayBuffer) {
                  const he = new Uint8Array(oe.result);
                  try {
                    try {
                      Sa(he);
                    } catch (d) {
                      console.error(d);
                    }
                    t.set_anim_data(he), pe(t.get_anim_state());
                  } catch (d) {
                    console.error(d), pe(se);
                  }
                }
              }, oe.readAsArrayBuffer(ae[0]);
            }
          }), w(L, u(O, {
            get when() {
              return _e() == se;
            },
            get children() {
              return yd();
            }
          }), null), L;
        }
      }),
      u(O, {
        get when() {
          return Ne(() => _e() == A)() && !e();
        },
        get children() {
          return u(nd, {
            editor: t,
            setReplay: r,
            pastNinjas: p,
            globalEventState: D,
            levelName: s,
            setLevelName: o,
            roundCorners: i,
            setRoundCorners: l,
            palette: le,
            setPalette: X,
            dynamicFriction: n,
            setDynamicFriction: c
          });
        }
      }),
      u(O, {
        get when() {
          return Ne(() => _e() == A)() && !!e();
        },
        keyed: true,
        get children() {
          return u(fd, {
            get replay() {
              return e();
            },
            editor: t,
            globalEventState: D
          });
        }
      })
    ];
  }
  const bd = document.getElementById("root");
  es(() => u(md, {}), bd);
})();
