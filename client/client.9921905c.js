function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function r(){return Object.create(null)}function s(t){t.forEach(n)}function o(t){return"function"==typeof t}function a(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e,n,r){if(t){const s=c(t,e,n,r);return t[0](s)}}function c(t,n,r,s){return t[1]&&s?e(r.ctx.slice(),t[1](s(n))):r.ctx}function l(t,e,n,r){if(t[2]&&r){const s=t[2](r(n));if("object"==typeof e.dirty){const t=[],n=Math.max(e.dirty.length,s.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|s[r];return t}return e.dirty|s}return e.dirty}function u(t,e){t.appendChild(e)}function f(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode.removeChild(t)}function d(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function h(t){return document.createElement(t)}function m(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function g(t){return document.createTextNode(t)}function $(){return g(" ")}function _(){return g("")}function v(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function y(t){return function(e){return e.preventDefault(),t.call(this,e)}}function E(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function w(t){return Array.from(t.childNodes)}function S(t,e,n,r){for(let r=0;r<t.length;r+=1){const s=t[r];if(s.nodeName===e){let e=0;for(;e<s.attributes.length;){const t=s.attributes[e];n[t.name]?e++:s.removeAttribute(t.name)}return t.splice(r,1)[0]}}return r?m(e):h(e)}function b(t,e){for(let n=0;n<t.length;n+=1){const r=t[n];if(3===r.nodeType)return r.data=""+e,t.splice(n,1)[0]}return g(e)}function x(t){return b(t," ")}function P(t,e){e=""+e,t.data!==e&&(t.data=e)}function A(t,e,n){t.classList[n?"add":"remove"](e)}function L(t,e=document.body){return Array.from(e.querySelectorAll(t))}let R;function k(t){R=t}function C(t,e){(function(){if(!R)throw new Error("Function called outside component initialization");return R})().$$.context.set(t,e)}const j=[],O=[],D=[],N=[],H=Promise.resolve();let q=!1;function I(t){D.push(t)}let U=!1;const V=new Set;function B(){if(!U){U=!0;do{for(let t=0;t<j.length;t+=1){const e=j[t];k(e),T(e.$$)}for(j.length=0;O.length;)O.pop()();for(let t=0;t<D.length;t+=1){const e=D[t];V.has(e)||(V.add(e),e())}D.length=0}while(j.length);for(;N.length;)N.pop()();q=!1,U=!1,V.clear()}}function T(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(I)}}const J=new Set;let M;function z(){M={r:0,c:[],p:M}}function G(){M.r||s(M.c),M=M.p}function K(t,e){t&&t.i&&(J.delete(t),t.i(e))}function W(t,e,n,r){if(t&&t.o){if(J.has(t))return;J.add(t),M.c.push(()=>{J.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}const F="undefined"!=typeof window?window:global;function X(t,e){const n={},r={},s={$$scope:1};let o=t.length;for(;o--;){const a=t[o],i=e[o];if(i){for(const t in a)t in i||(r[t]=1);for(const t in i)s[t]||(n[t]=i[t],s[t]=1);t[o]=i}else for(const t in a)s[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}function Y(t){return"object"==typeof t&&null!==t?t:{}}function Q(t){t&&t.c()}function Z(t,e){t&&t.l(e)}function tt(t,e,r){const{fragment:a,on_mount:i,on_destroy:c,after_update:l}=t.$$;a&&a.m(e,r),I(()=>{const e=i.map(n).filter(o);c?c.push(...e):s(e),t.$$.on_mount=[]}),l.forEach(I)}function et(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function nt(t,e){-1===t.$$.dirty[0]&&(j.push(t),q||(q=!0,H.then(B)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function rt(e,n,o,a,i,c,l=[-1]){const u=R;k(e);const f=n.props||{},p=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:i,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:r(),dirty:l};let d=!1;p.ctx=o?o(e,f,(t,n,...r)=>{const s=r.length?r[0]:n;return p.ctx&&i(p.ctx[t],p.ctx[t]=s)&&(p.bound[t]&&p.bound[t](s),d&&nt(e,t)),n}):[],p.update(),d=!0,s(p.before_update),p.fragment=!!a&&a(p.ctx),n.target&&(n.hydrate?p.fragment&&p.fragment.l(w(n.target)):p.fragment&&p.fragment.c(),n.intro&&K(e.$$.fragment),tt(e,n.target,n.anchor),B()),k(u)}class st{$destroy(){et(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}const ot=[];function at(e,n=t){let r;const s=[];function o(t){if(a(e,t)&&(e=t,r)){const t=!ot.length;for(let t=0;t<s.length;t+=1){const n=s[t];n[1](),ot.push(n,e)}if(t){for(let t=0;t<ot.length;t+=2)ot[t][0](ot[t+1]);ot.length=0}}}return{set:o,update:function(t){o(t(e))},subscribe:function(a,i=t){const c=[a,i];return s.push(c),1===s.length&&(r=n(o)||t),a(e),()=>{const t=s.indexOf(c);-1!==t&&s.splice(t,1),0===s.length&&(r(),r=null)}}}}const it={},ct=()=>({});function lt(e){let n,r,s,o,a,i,c,l,d,m,_,v,y,P,L,R,k,C,j,O,D,N,H;return{c(){n=h("nav"),r=h("ul"),s=h("div"),o=h("li"),a=h("a"),i=h("img"),l=$(),d=h("div"),m=h("li"),_=h("a"),v=g("About"),P=$(),L=h("li"),R=h("a"),k=g("Wiki"),j=$(),O=h("li"),D=h("a"),N=g("Contact"),this.h()},l(t){n=S(t,"NAV",{class:!0});var e=w(n);r=S(e,"UL",{class:!0});var c=w(r);s=S(c,"DIV",{class:!0});var u=w(s);o=S(u,"LI",{class:!0});var f=w(o);a=S(f,"A",{href:!0});var h=w(a);i=S(h,"IMG",{class:!0,src:!0,alt:!0}),h.forEach(p),f.forEach(p),u.forEach(p),l=x(c),d=S(c,"DIV",{class:!0});var g=w(d);m=S(g,"LI",{class:!0});var $=w(m);_=S($,"A",{"aria-current":!0,href:!0});var y=w(_);v=b(y,"About"),y.forEach(p),$.forEach(p),P=x(g),L=S(g,"LI",{class:!0});var E=w(L);R=S(E,"A",{"aria-current":!0,href:!0});var A=w(R);k=b(A,"Wiki"),A.forEach(p),E.forEach(p),j=x(g),O=S(g,"LI",{class:!0});var C=w(O);D=S(C,"A",{"aria-current":!0,href:!0});var H=w(D);N=b(H,"Contact"),H.forEach(p),C.forEach(p),g.forEach(p),c.forEach(p),e.forEach(p),this.h()},h(){E(i,"class","h-6"),i.src!==(c="icon.svg")&&E(i,"src","icon.svg"),E(i,"alt","Chameleon Icon"),E(a,"href","./"),E(o,"class","svelte-1iyh25l"),E(s,"class","flex-0"),E(_,"aria-current",y="about"===e[0]?"page":void 0),E(_,"href","about"),E(m,"class","svelte-1iyh25l"),A(m,"active","about"===e[0]),E(R,"aria-current",C="wiki"===e[0]?"page":void 0),E(R,"href","wiki"),E(L,"class","svelte-1iyh25l"),A(L,"active","wiki"===e[0]),E(D,"aria-current",H="contact"===e[0]?"page":void 0),E(D,"href","contact"),E(O,"class","svelte-1iyh25l"),A(O,"active","contact"===e[0]),E(d,"class","flex-1 inline-flex justify-end"),E(r,"class","flex max-w-6xl w-full items-center"),E(n,"class","flex px-4 bg-dark-green lg: px-0 py-2 w-full text-lg text-white justify-center z-10")},m(t,e){f(t,n,e),u(n,r),u(r,s),u(s,o),u(o,a),u(a,i),u(r,l),u(r,d),u(d,m),u(m,_),u(_,v),u(d,P),u(d,L),u(L,R),u(R,k),u(d,j),u(d,O),u(O,D),u(D,N)},p(t,[e]){1&e&&y!==(y="about"===t[0]?"page":void 0)&&E(_,"aria-current",y),1&e&&A(m,"active","about"===t[0]),1&e&&C!==(C="wiki"===t[0]?"page":void 0)&&E(R,"aria-current",C),1&e&&A(L,"active","wiki"===t[0]),1&e&&H!==(H="contact"===t[0]?"page":void 0)&&E(D,"aria-current",H),1&e&&A(O,"active","contact"===t[0])},i:t,o:t,d(t){t&&p(n)}}}function ut(t,e,n){let{segment:r}=e;return t.$set=t=>{"segment"in t&&n(0,r=t.segment)},[r]}class ft extends st{constructor(t){super(),rt(this,t,ut,lt,a,{segment:0})}}function pt(t){let e,n,r,s;const o=new ft({props:{segment:t[0]}}),a=t[2].default,d=i(a,t,t[1],null);return{c(){e=h("main"),n=h("div"),Q(o.$$.fragment),r=$(),d&&d.c(),this.h()},l(t){e=S(t,"MAIN",{});var s=w(e);n=S(s,"DIV",{class:!0});var a=w(n);Z(o.$$.fragment,a),r=x(a),d&&d.l(a),a.forEach(p),s.forEach(p),this.h()},h(){E(n,"class","flex flex-col h-screen overflow-y-auto")},m(t,a){f(t,e,a),u(e,n),tt(o,n,null),u(n,r),d&&d.m(n,null),s=!0},p(t,[e]){const n={};1&e&&(n.segment=t[0]),o.$set(n),d&&d.p&&2&e&&d.p(c(a,t,t[1],null),l(a,t[1],e,null))},i(t){s||(K(o.$$.fragment,t),K(d,t),s=!0)},o(t){W(o.$$.fragment,t),W(d,t),s=!1},d(t){t&&p(e),et(o),d&&d.d(t)}}}function dt(t,e,n){let{segment:r}=e,{$$slots:s={},$$scope:o}=e;return t.$set=t=>{"segment"in t&&n(0,r=t.segment),"$$scope"in t&&n(1,o=t.$$scope)},[r,o,s]}class ht extends st{constructor(t){super(),rt(this,t,dt,pt,a,{segment:0})}}function mt(t){let e,n,r=t[1].stack+"";return{c(){e=h("pre"),n=g(r)},l(t){e=S(t,"PRE",{});var s=w(e);n=b(s,r),s.forEach(p)},m(t,r){f(t,e,r),u(e,n)},p(t,e){2&e&&r!==(r=t[1].stack+"")&&P(n,r)},d(t){t&&p(e)}}}function gt(e){let n,r,s,o,a,i,c,l,d,m=e[1].message+"";document.title=n=e[0];let v=e[2]&&e[1].stack&&mt(e);return{c(){r=$(),s=h("h1"),o=g(e[0]),a=$(),i=h("p"),c=g(m),l=$(),v&&v.c(),d=_(),this.h()},l(t){L('[data-svelte="svelte-1o9r2ue"]',document.head).forEach(p),r=x(t),s=S(t,"H1",{class:!0});var n=w(s);o=b(n,e[0]),n.forEach(p),a=x(t),i=S(t,"P",{class:!0});var u=w(i);c=b(u,m),u.forEach(p),l=x(t),v&&v.l(t),d=_(),this.h()},h(){E(s,"class","svelte-iy9kc2"),E(i,"class","svelte-iy9kc2")},m(t,e){f(t,r,e),f(t,s,e),u(s,o),f(t,a,e),f(t,i,e),u(i,c),f(t,l,e),v&&v.m(t,e),f(t,d,e)},p(t,[e]){1&e&&n!==(n=t[0])&&(document.title=n),1&e&&P(o,t[0]),2&e&&m!==(m=t[1].message+"")&&P(c,m),t[2]&&t[1].stack?v?v.p(t,e):(v=mt(t),v.c(),v.m(d.parentNode,d)):v&&(v.d(1),v=null)},i:t,o:t,d(t){t&&p(r),t&&p(s),t&&p(a),t&&p(i),t&&p(l),v&&v.d(t),t&&p(d)}}}function $t(t,e,n){let{status:r}=e,{error:s}=e;return t.$set=t=>{"status"in t&&n(0,r=t.status),"error"in t&&n(1,s=t.error)},[r,s,!1]}class _t extends st{constructor(t){super(),rt(this,t,$t,gt,a,{status:0,error:1})}}function vt(t){let n,r;const s=[{segment:t[2][1]},t[4].props];var o=t[4].component;function a(t){let n={$$slots:{default:[wt]},$$scope:{ctx:t}};for(let t=0;t<s.length;t+=1)n=e(n,s[t]);return{props:n}}if(o)var i=new o(a(t));return{c(){i&&Q(i.$$.fragment),n=_()},l(t){i&&Z(i.$$.fragment,t),n=_()},m(t,e){i&&tt(i,t,e),f(t,n,e),r=!0},p(t,e){const r=20&e?X(s,[4&e&&{segment:t[2][1]},16&e&&Y(t[4].props)]):{};if(160&e&&(r.$$scope={dirty:e,ctx:t}),o!==(o=t[4].component)){if(i){z();const t=i;W(t.$$.fragment,1,0,()=>{et(t,1)}),G()}o?(Q((i=new o(a(t))).$$.fragment),K(i.$$.fragment,1),tt(i,n.parentNode,n)):i=null}else o&&i.$set(r)},i(t){r||(i&&K(i.$$.fragment,t),r=!0)},o(t){i&&W(i.$$.fragment,t),r=!1},d(t){t&&p(n),i&&et(i,t)}}}function yt(t){let e;const n=new _t({props:{error:t[0],status:t[1]}});return{c(){Q(n.$$.fragment)},l(t){Z(n.$$.fragment,t)},m(t,r){tt(n,t,r),e=!0},p(t,e){const r={};1&e&&(r.error=t[0]),2&e&&(r.status=t[1]),n.$set(r)},i(t){e||(K(n.$$.fragment,t),e=!0)},o(t){W(n.$$.fragment,t),e=!1},d(t){et(n,t)}}}function Et(t){let n,r;const s=[t[5].props];var o=t[5].component;function a(t){let n={};for(let t=0;t<s.length;t+=1)n=e(n,s[t]);return{props:n}}if(o)var i=new o(a());return{c(){i&&Q(i.$$.fragment),n=_()},l(t){i&&Z(i.$$.fragment,t),n=_()},m(t,e){i&&tt(i,t,e),f(t,n,e),r=!0},p(t,e){const r=32&e?X(s,[Y(t[5].props)]):{};if(o!==(o=t[5].component)){if(i){z();const t=i;W(t.$$.fragment,1,0,()=>{et(t,1)}),G()}o?(Q((i=new o(a())).$$.fragment),K(i.$$.fragment,1),tt(i,n.parentNode,n)):i=null}else o&&i.$set(r)},i(t){r||(i&&K(i.$$.fragment,t),r=!0)},o(t){i&&W(i.$$.fragment,t),r=!1},d(t){t&&p(n),i&&et(i,t)}}}function wt(t){let e,n,r=t[5]&&Et(t);return{c(){r&&r.c(),e=_()},l(t){r&&r.l(t),e=_()},m(t,s){r&&r.m(t,s),f(t,e,s),n=!0},p(t,n){t[5]?r?(r.p(t,n),K(r,1)):(r=Et(t),r.c(),K(r,1),r.m(e.parentNode,e)):r&&(z(),W(r,1,1,()=>{r=null}),G())},i(t){n||(K(r),n=!0)},o(t){W(r),n=!1},d(t){r&&r.d(t),t&&p(e)}}}function St(t){let e,n,r,s;const o=[yt,vt],a=[];function i(t,e){return t[0]?0:1}return e=i(t),n=a[e]=o[e](t),{c(){n.c(),r=_()},l(t){n.l(t),r=_()},m(t,n){a[e].m(t,n),f(t,r,n),s=!0},p(t,s){let c=e;e=i(t),e===c?a[e].p(t,s):(z(),W(a[c],1,1,()=>{a[c]=null}),G(),n=a[e],n||(n=a[e]=o[e](t),n.c()),K(n,1),n.m(r.parentNode,r))},i(t){s||(K(n),s=!0)},o(t){W(n),s=!1},d(t){a[e].d(t),t&&p(r)}}}function bt(t){let n;const r=[{segment:t[2][0]},t[3].props];let s={$$slots:{default:[St]},$$scope:{ctx:t}};for(let t=0;t<r.length;t+=1)s=e(s,r[t]);const o=new ht({props:s});return{c(){Q(o.$$.fragment)},l(t){Z(o.$$.fragment,t)},m(t,e){tt(o,t,e),n=!0},p(t,[e]){const n=12&e?X(r,[4&e&&{segment:t[2][0]},8&e&&Y(t[3].props)]):{};183&e&&(n.$$scope={dirty:e,ctx:t}),o.$set(n)},i(t){n||(K(o.$$.fragment,t),n=!0)},o(t){W(o.$$.fragment,t),n=!1},d(t){et(o,t)}}}function xt(t,e,n){let{stores:r}=e,{error:s}=e,{status:o}=e,{segments:a}=e,{level0:i}=e,{level1:c=null}=e,{level2:l=null}=e;return C(it,r),t.$set=t=>{"stores"in t&&n(6,r=t.stores),"error"in t&&n(0,s=t.error),"status"in t&&n(1,o=t.status),"segments"in t&&n(2,a=t.segments),"level0"in t&&n(3,i=t.level0),"level1"in t&&n(4,c=t.level1),"level2"in t&&n(5,l=t.level2)},[s,o,a,i,c,l,r]}class Pt extends st{constructor(t){super(),rt(this,t,xt,bt,a,{stores:6,error:0,status:1,segments:2,level0:3,level1:4,level2:5})}}const At=[],Lt=[{js:()=>import("./index.9124f18d.js"),css:["index.9124f18d.css","client.9921905c.css"]},{js:()=>import("./contact.5accc472.js"),css:["contact.5accc472.css","client.9921905c.css"]},{js:()=>import("./about.5cd8b3af.js"),css:["client.9921905c.css"]},{js:()=>import("./_layout.68b2f42a.js"),css:["_layout.68b2f42a.css","client.9921905c.css"]},{js:()=>import("./index.9d495117.js"),css:["client.9921905c.css"]},{js:()=>import("./recommended-extensions.8f703a7d.js"),css:["client.9921905c.css"]},{js:()=>import("./getting-started.48926651.js"),css:["client.9921905c.css"]},{js:()=>import("./permissions.2373abae.js"),css:["client.9921905c.css"]},{js:()=>import("./whitelist.3c60ba7e.js"),css:["client.9921905c.css"]},{js:()=>import("./ip-rules.6c15733a.js"),css:["client.9921905c.css"]},{js:()=>import("./headers.c696e367.js"),css:["headers.c696e367.css","client.9921905c.css"]},{js:()=>import("./options.3d86a9af.js"),css:["options.3d86a9af.css","client.9921905c.css"]},{js:()=>import("./profile.7f30fff5.js"),css:["client.9921905c.css"]},{js:()=>import("./debug.564fecf7.js"),css:["client.9921905c.css"]}],Rt=[{pattern:/^\/$/,parts:[{i:0}]},{pattern:/^\/contact\/?$/,parts:[{i:1}]},{pattern:/^\/about\/?$/,parts:[{i:2}]},{pattern:/^\/wiki\/?$/,parts:[{i:3},{i:4}]},{pattern:/^\/wiki\/recommended-extensions\/?$/,parts:[{i:3},{i:5}]},{pattern:/^\/wiki\/getting-started\/?$/,parts:[{i:3},{i:6}]},{pattern:/^\/wiki\/permissions\/?$/,parts:[{i:3},{i:7}]},{pattern:/^\/wiki\/whitelist\/?$/,parts:[{i:3},{i:8}]},{pattern:/^\/wiki\/ip-rules\/?$/,parts:[{i:3},{i:9}]},{pattern:/^\/wiki\/headers\/?$/,parts:[{i:3},{i:10}]},{pattern:/^\/wiki\/options\/?$/,parts:[{i:3},{i:11}]},{pattern:/^\/wiki\/profile\/?$/,parts:[{i:3},{i:12}]},{pattern:/^\/wiki\/debug\/?$/,parts:[{i:3},{i:13}]}];function kt(t,e={replaceState:!1}){const n=Wt(new URL(t,document.baseURI));return n?(zt[e.replaceState?"replaceState":"pushState"]({id:Jt},"",t),Xt(n,null).then(()=>{})):(location.href=t,new Promise(t=>{}))}const Ct="undefined"!=typeof __SAPPER__&&__SAPPER__;let jt,Ot,Dt,Nt=!1,Ht=[],qt="{}";const It={page:at({}),preloading:at(null),session:at(Ct&&Ct.session)};let Ut,Vt;It.session.subscribe(async t=>{if(Ut=t,!Nt)return;Vt=!0;const e=Wt(new URL(location.href)),n=Ot={},{redirect:r,props:s,branch:o}=await Qt(e);n===Ot&&await Yt(r,o,s,e.page)});let Bt,Tt=null;let Jt,Mt=1;const zt="undefined"!=typeof history?history:{pushState:(t,e,n)=>{},replaceState:(t,e,n)=>{},scrollRestoration:""},Gt={};function Kt(t){const e=Object.create(null);return t.length>0&&t.slice(1).split("&").forEach(t=>{let[,n,r=""]=/([^=]*)(?:=(.*))?/.exec(decodeURIComponent(t.replace(/\+/g," ")));"string"==typeof e[n]&&(e[n]=[e[n]]),"object"==typeof e[n]?e[n].push(r):e[n]=r}),e}function Wt(t){if(t.origin!==location.origin)return null;if(!t.pathname.startsWith(Ct.baseUrl))return null;let e=t.pathname.slice(Ct.baseUrl.length);if(""===e&&(e="/"),!At.some(t=>t.test(e)))for(let n=0;n<Rt.length;n+=1){const r=Rt[n],s=r.pattern.exec(e);if(s){const n=Kt(t.search),o=r.parts[r.parts.length-1],a=o.params?o.params(s):{},i={host:location.host,path:e,query:n,params:a};return{href:t.href,route:r,match:s,page:i}}}}function Ft(){return{x:pageXOffset,y:pageYOffset}}async function Xt(t,e,n,r){if(e)Jt=e;else{const t=Ft();Gt[Jt]=t,e=Jt=++Mt,Gt[Jt]=n?t:{x:0,y:0}}Jt=e,jt&&It.preloading.set(!0);const s=Tt&&Tt.href===t.href?Tt.promise:Qt(t);Tt=null;const o=Ot={},{redirect:a,props:i,branch:c}=await s;if(o===Ot&&(await Yt(a,c,i,t.page),document.activeElement&&document.activeElement.blur(),!n)){let t=Gt[e];if(r){const e=document.getElementById(r.slice(1));e&&(t={x:0,y:e.getBoundingClientRect().top})}Gt[Jt]=t,t&&scrollTo(t.x,t.y)}}async function Yt(t,e,n,r){if(t)return kt(t.location,{replaceState:!0});if(It.page.set(r),It.preloading.set(!1),jt)jt.$set(n);else{n.stores={page:{subscribe:It.page.subscribe},preloading:{subscribe:It.preloading.subscribe},session:It.session},n.level0={props:await Dt};const t=document.querySelector("#sapper-head-start"),e=document.querySelector("#sapper-head-end");if(t&&e){for(;t.nextSibling!==e;)te(t.nextSibling);te(t),te(e)}jt=new Pt({target:Bt,props:n,hydrate:!0})}Ht=e,qt=JSON.stringify(r.query),Nt=!0,Vt=!1}async function Qt(t){const{route:e,page:n}=t,r=n.path.split("/").filter(Boolean);let s=null;const o={error:null,status:200,segments:[r[0]]},a={fetch:(t,e)=>fetch(t,e),redirect:(t,e)=>{if(s&&(s.statusCode!==t||s.location!==e))throw new Error("Conflicting redirects");s={statusCode:t,location:e}},error:(t,e)=>{o.error="string"==typeof e?new Error(e):e,o.status=t}};let i;Dt||(Dt=Ct.preloaded[0]||ct.call(a,{host:n.host,path:n.path,query:n.query,params:{}},Ut));let c=1;try{const s=JSON.stringify(n.query),l=e.pattern.exec(n.path);let u=!1;i=await Promise.all(e.parts.map(async(e,i)=>{const f=r[i];if(function(t,e,n,r){if(r!==qt)return!0;const s=Ht[t];return!!s&&(e!==s.segment||(!(!s.match||JSON.stringify(s.match.slice(1,t+2))===JSON.stringify(n.slice(1,t+2)))||void 0))}(i,f,l,s)&&(u=!0),o.segments[c]=r[i+1],!e)return{segment:f};const p=c++;if(!Vt&&!u&&Ht[i]&&Ht[i].part===e.i)return Ht[i];u=!1;const{default:d,preload:h}=await function(t){const e="string"==typeof t.css?[]:t.css.map(Zt);return e.unshift(t.js()),Promise.all(e).then(t=>t[0])}(Lt[e.i]);let m;return m=Nt||!Ct.preloaded[i+1]?h?await h.call(a,{host:n.host,path:n.path,query:n.query,params:e.params?e.params(t.match):{}},Ut):{}:Ct.preloaded[i+1],o[`level${p}`]={component:d,props:m,segment:f,match:l,part:e.i}}))}catch(t){o.error=t,o.status=500,i=[]}return{redirect:s,props:o,branch:i}}function Zt(t){const e=`client/${t}`;if(!document.querySelector(`link[href="${e}"]`))return new Promise((t,n)=>{const r=document.createElement("link");r.rel="stylesheet",r.href=e,r.onload=()=>t(),r.onerror=n,document.head.appendChild(r)})}function te(t){t.parentNode.removeChild(t)}function ee(t){const e=Wt(new URL(t,document.baseURI));if(e)return Tt&&t===Tt.href||function(t,e){Tt={href:t,promise:e}}(t,Qt(e)),Tt.promise}let ne;function re(t){clearTimeout(ne),ne=setTimeout(()=>{se(t)},20)}function se(t){const e=ae(t.target);e&&"prefetch"===e.rel&&ee(e.href)}function oe(t){if(1!==function(t){return null===t.which?t.button:t.which}(t))return;if(t.metaKey||t.ctrlKey||t.shiftKey)return;if(t.defaultPrevented)return;const e=ae(t.target);if(!e)return;if(!e.href)return;const n="object"==typeof e.href&&"SVGAnimatedString"===e.href.constructor.name,r=String(n?e.href.baseVal:e.href);if(r===location.href)return void(location.hash||t.preventDefault());if(e.hasAttribute("download")||"external"===e.getAttribute("rel"))return;if(n?e.target.baseVal:e.target)return;const s=new URL(r);if(s.pathname===location.pathname&&s.search===location.search)return;const o=Wt(s);if(o){Xt(o,null,e.hasAttribute("sapper-noscroll"),s.hash),t.preventDefault(),zt.pushState({id:Jt},"",s.href)}}function ae(t){for(;t&&"A"!==t.nodeName.toUpperCase();)t=t.parentNode;return t}function ie(t){if(Gt[Jt]=Ft(),t.state){const e=Wt(new URL(location.href));e?Xt(e,t.state.id):location.href=location.href}else Mt=Mt+1,function(t){Jt=t}(Mt),zt.replaceState({id:Jt},"",location.href)}var ce;ce={target:document.querySelector("#sapper")},"scrollRestoration"in zt&&(zt.scrollRestoration="manual"),function(t){Bt=t}(ce.target),addEventListener("click",oe),addEventListener("popstate",ie),addEventListener("touchstart",se),addEventListener("mousemove",re),Promise.resolve().then(()=>{const{hash:t,href:e}=location;zt.replaceState({id:Mt},"",e);const n=new URL(location.href);if(Ct.error)return function(t){const{host:e,pathname:n,search:r}=location,{session:s,preloaded:o,status:a,error:i}=Ct;Dt||(Dt=o&&o[0]),Yt(null,[],{error:i,status:a,session:s,level0:{props:Dt},level1:{props:{status:a,error:i},component:_t},segments:o},{host:e,path:n,query:Kt(r),params:{}})}();const r=Wt(n);return r?Xt(r,Mt,!0,t):void 0});export{F as A,y as B,P as C,_ as D,i as E,c as F,l as G,s as H,O as I,st as S,w as a,E as b,S as c,p as d,h as e,f,$ as g,x as h,rt as i,u as j,d as k,v as l,g as m,t as n,Q as o,b as p,L as q,Z as r,a as s,A as t,tt as u,K as v,W as w,et as x,kt as y,m as z};
