import{S as a,i as e,s as t,e as l,c as s,a as r,d as o,b as c,t as n,f as h,l as i,g as f,h as d,j as u,n as m,k as v,m as p,o as x,p as g,q as w,r as b,u as y,v as E,w as I,x as V,y as $,z as B,A as D,B as j}from"./client.e01e2ef7.js";function T(a,e,t){const l=a.slice();return l[6]=e[t],l[8]=t,l}function z(a){let e,t;function f(...e){return a[5](a[8],...e)}return{c(){e=l("button"),this.h()},l(a){e=s(a,"BUTTON",{class:!0}),r(e).forEach(o),this.h()},h(){c(e,"class","mr-2 svelte-hd8q2n"),n(e,"active",a[0]==a[8])},m(a,l){h(a,e,l),t=i(e,"click",f)},p(t,l){a=t,1&l&&n(e,"active",a[0]==a[8])},d(a){a&&o(e),t()}}}function N(a){let e,t,n,i,p,x=a[2],g=[];for(let e=0;e<x.length;e+=1)g[e]=z(T(a,x,e));return{c(){e=l("div"),t=l("img"),i=f(),p=l("div");for(let a=0;a<g.length;a+=1)g[a].c();this.h()},l(a){e=s(a,"DIV",{});var l=r(e);t=s(l,"IMG",{src:!0,class:!0,alt:!0}),i=d(l),p=s(l,"DIV",{class:!0});var c=r(p);for(let a=0;a<g.length;a+=1)g[a].l(c);c.forEach(o),l.forEach(o),this.h()},h(){t.src!==(n=a[1])&&c(t,"src",n),c(t,"class","shadow-lg rounded-lg border border-primary b-1"),c(t,"alt","Chameleon screenshot"),c(p,"class","flex justify-center mt-6")},m(a,l){h(a,e,l),u(e,t),u(e,i),u(e,p);for(let a=0;a<g.length;a+=1)g[a].m(p,null)},p(a,[e]){if(2&e&&t.src!==(n=a[1])&&c(t,"src",n),9&e){let t;for(x=a[2],t=0;t<x.length;t+=1){const l=T(a,x,t);g[t]?g[t].p(l,e):(g[t]=z(l),g[t].c(),g[t].m(p,null))}for(;t<g.length;t+=1)g[t].d(1);g.length=x.length}},i:m,o:m,d(a){a&&o(e),v(g,a)}}}function k(a,e,t){let l=0,s=["ui1.png","ui2.png","ui3.png","ui4.png","ui5.png"],r=setInterval(()=>{l<s.length-1?t(0,l++,l):t(0,l=0)},3e3),o=a=>{t(0,l=a),clearInterval(r),r=setInterval(()=>{l<s.length-1?t(0,l++,l):t(0,l=0)},3e3)};let c;return a.$$.update=()=>{1&a.$$.dirty&&t(1,c=s[l])},[l,c,s,o,r,(a,e)=>o(a)]}class C extends a{constructor(a){super(),e(this,a,k,N,t,{})}}function O(a){let e;function t(a,e){return a[0]?q:S}let l=t(a),s=l(a);return{c(){s.c(),e=p()},l(a){s.l(a),e=p()},m(a,t){s.m(a,t),h(a,e,t)},p(a,r){l===(l=t(a))&&s?s.p(a,r):(s.d(1),s=l(a),s&&(s.c(),s.m(e.parentNode,e)))},d(a){s.d(a),a&&o(e)}}}function S(a){let e,t,n,v,p,g,w;return{c(){e=l("button"),t=D("svg"),n=D("path"),v=f(),p=l("span"),g=x("Install"),this.h()},l(a){e=s(a,"BUTTON",{class:!0});var l=r(e);t=s(l,"svg",{fill:!0,viewBox:!0,class:!0},1);var c=r(t);n=s(c,"path",{"fill-rule":!0,d:!0,"clip-rule":!0},1),r(n).forEach(o),c.forEach(o),v=d(l),p=s(l,"SPAN",{class:!0});var h=r(p);g=b(h,"Install"),h.forEach(o),l.forEach(o),this.h()},h(){c(n,"fill-rule","evenodd"),c(n,"d","M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"),c(n,"clip-rule","evenodd"),c(t,"fill","currentColor"),c(t,"viewBox","0 0 20 20"),c(t,"class","w-8 h-8"),c(p,"class","ml-2"),c(e,"class","flex items-center bg-primary hover:bg-primary-soft text-white font-bold py-2 px-4 text-xl rounded shadow-md mr-4")},m(l,s){h(l,e,s),u(e,t),u(t,n),u(e,v),u(e,p),u(p,g),w=i(e,"click",a[3])},p:m,d(a){a&&o(e),w()}}}function q(a){let e,t,n,v,p,g,w,y;return{c(){e=l("button"),t=l("span"),n=x("Only for Firefox"),v=f(),p=D("svg"),g=D("path"),w=D("path"),this.h()},l(a){e=s(a,"BUTTON",{class:!0});var l=r(e);t=s(l,"SPAN",{class:!0});var c=r(t);n=b(c,"Only for Firefox"),c.forEach(o),v=d(l),p=s(l,"svg",{fill:!0,viewBox:!0,class:!0},1);var h=r(p);g=s(h,"path",{d:!0},1),r(g).forEach(o),w=s(h,"path",{d:!0},1),r(w).forEach(o),h.forEach(o),l.forEach(o),this.h()},h(){c(t,"class","mr-2"),c(g,"d","M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"),c(w,"d","M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"),c(p,"fill","currentColor"),c(p,"viewBox","0 0 20 20"),c(p,"class","w-6 h-6"),c(e,"class","flex items-center bg-primary hover:bg-primary-soft text-white font-bold py-2 px-4 text-xl rounded shadow-md mr-4")},m(l,s){h(l,e,s),u(e,t),u(t,n),u(e,v),u(e,p),u(p,g),u(p,w),y=i(e,"click",a[2])},p:m,d(a){a&&o(e),y()}}}function H(a){let e,t,n,m,v,p,B,D,j,T,z,N,k,S,q,H,L,U,A,M,F=!a[1]&&O(a);const P=new C({});return{c(){e=f(),t=l("div"),n=l("div"),m=l("div"),v=l("div"),p=l("div"),B=l("h1"),D=x("Chameleon"),j=f(),T=l("h2"),z=x("Spoof your browser profile."),N=f(),k=l("div"),F&&F.c(),S=f(),q=l("button"),H=x("Learn more"),L=f(),U=l("div"),g(P.$$.fragment),this.h()},l(a){w('[data-svelte="svelte-bmq4wq"]',document.head).forEach(o),e=d(a),t=s(a,"DIV",{class:!0});var l=r(t);n=s(l,"DIV",{class:!0});var c=r(n);m=s(c,"DIV",{class:!0});var h=r(m);v=s(h,"DIV",{class:!0});var i=r(v);p=s(i,"DIV",{class:!0});var f=r(p);B=s(f,"H1",{class:!0});var u=r(B);D=b(u,"Chameleon"),u.forEach(o),j=d(f),T=s(f,"H2",{class:!0});var x=r(T);z=b(x,"Spoof your browser profile."),x.forEach(o),f.forEach(o),N=d(i),k=s(i,"DIV",{class:!0});var g=r(k);F&&F.l(g),S=d(g),q=s(g,"BUTTON",{class:!0});var E=r(q);H=b(E,"Learn more"),E.forEach(o),g.forEach(o),i.forEach(o),L=d(h),U=s(h,"DIV",{class:!0});var I=r(U);y(P.$$.fragment,I),I.forEach(o),h.forEach(o),c.forEach(o),l.forEach(o),this.h()},h(){document.title="Chameleon",c(B,"class","font-bold sm:text-4xl text-6xl animated svelte-1bj6aoq"),c(T,"class","sm:text-xl text-3xl opacity-50"),c(p,"class","mb-8 text-center lg:text-left leading-tight"),c(q,"class","flex items-center bg-transparent hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 text-xl rounded shadow-md border border-primary hover:border-transparent"),c(k,"class","w-full flex justify-center lg:justify-start"),c(v,"class","w-full lg:max-w-md"),c(U,"class","hidden lg:block"),c(m,"class","flex w-full items-center justify-between"),c(n,"class","flex max-w-6xl w-full"),c(t,"class","flex h-screen bg-light w-full justify-center")},m(l,s){h(l,e,s),h(l,t,s),u(t,n),u(n,m),u(m,v),u(v,p),u(p,B),u(B,D),u(p,j),u(p,T),u(T,z),u(v,N),u(v,k),F&&F.m(k,null),u(k,S),u(k,q),u(q,H),u(m,L),u(m,U),E(P,U,null),A=!0,M=i(q,"click",a[4])},p(a,[e]){a[1]?F&&(F.d(1),F=null):F?F.p(a,e):(F=O(a),F.c(),F.m(k,S))},i(a){A||(I(P.$$.fragment,a),A=!0)},o(a){V(P.$$.fragment,a),A=!1},d(a){a&&o(e),a&&o(t),F&&F.d(),$(P),M()}}}function L(a,e,t){let l=!1,s=!0;B(()=>{t(1,s=new URLSearchParams(window.location.search).has("newinstall")),t(0,l=!window.navigator.userAgent.includes("Firefox"))});return[l,s,a=>j("https://mozilla.org"),a=>j("https://addons.mozilla.org/firefox/downloads/latest/chameleon-ext"),a=>j("about")]}export default class extends a{constructor(a){super(),e(this,a,L,H,t,{})}}
