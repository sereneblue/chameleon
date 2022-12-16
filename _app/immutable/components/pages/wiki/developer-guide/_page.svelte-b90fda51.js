import{S as Go,i as Mo,s as Uo,R as Jo,e as qe,a as n,k as r,q as h,K as Yo,T as Ko,h as e,c as s,l,m as o,r as c,n as P,E as t,b as ut,u as Pl,f as B,g as No,d as zo,t as q,L as Wo,D as Lo,M as Qo,w as Le,x as Be,y as He,z as Ve,B as Xo}from"../../../../chunks/index-18f63aa7.js";import{j as Zo,p as ta,H as ea}from"../../../../chunks/index-219312c4.js";const ra=`<style>/*

github.com style (c) Vasily Polovnyov <vast@whiteants.net>

*/

.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #333;
  background: #f8f8f8;
}

.hljs-comment,
.hljs-quote {
  color: #998;
  font-style: italic;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-subst {
  color: #333;
  font-weight: bold;
}

.hljs-number,
.hljs-literal,
.hljs-variable,
.hljs-template-variable,
.hljs-tag .hljs-attr {
  color: #008080;
}

.hljs-string,
.hljs-doctag {
  color: #d14;
}

.hljs-title,
.hljs-section,
.hljs-selector-id {
  color: #900;
  font-weight: bold;
}

.hljs-subst {
  font-weight: normal;
}

.hljs-type,
.hljs-class .hljs-title {
  color: #458;
  font-weight: bold;
}

.hljs-tag,
.hljs-name,
.hljs-attribute {
  color: #000080;
  font-weight: normal;
}

.hljs-regexp,
.hljs-link {
  color: #009926;
}

.hljs-symbol,
.hljs-bullet {
  color: #990073;
}

.hljs-built_in,
.hljs-builtin-name {
  color: #0086b3;
}

.hljs-meta {
  color: #999;
  font-weight: bold;
}

.hljs-deletion {
  background: #fdd;
}

.hljs-addition {
  background: #dfd;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}
</style>`;function Bo(_,i,d){const a=_.slice();return a[8]=i[d],a[10]=d,a}function Ho(_,i,d){const a=_.slice();return a[8]=i[d],a[10]=d,a}function Vo(_){let i,d=_[8].title+"",a,m,p;function j(...g){return _[5](_[10],_[8],...g)}return{c(){i=r("li"),a=h(d),this.h()},l(g){i=l(g,"LI",{class:!0});var x=o(i);a=c(x,d),x.forEach(e),this.h()},h(){P(i,"class","svelte-1hmxea6"),Lo(i,"active",_[2]==_[10])},m(g,x){ut(g,i,x),t(i,a),m||(p=Qo(i,"click",j),m=!0)},p(g,x){_=g,x&1&&d!==(d=_[8].title+"")&&Pl(a,d),x&4&&Lo(i,"active",_[2]==_[10])},d(g){g&&e(i),m=!1,p()}}}function qo(_){let i,d;return i=new ea({props:{class:"hljs",language:_[3],$$slots:{default:[la]},$$scope:{ctx:_}}}),{c(){Le(i.$$.fragment)},l(a){Be(i.$$.fragment,a)},m(a,m){He(i,a,m),d=!0},p(a,m){const p={};m&8&&(p.language=a[3]),m&4097&&(p.$$scope={dirty:m,ctx:a}),i.$set(p)},i(a){d||(B(i.$$.fragment,a),d=!0)},o(a){q(i.$$.fragment,a),d=!1},d(a){Ve(i,a)}}}function la(_){let i=_[8].code.trim()+"",d;return{c(){d=h(i)},l(a){d=c(a,i)},m(a,m){ut(a,d,m)},p(a,m){m&1&&i!==(i=a[8].code.trim()+"")&&Pl(d,i)},d(a){a&&e(d)}}}function Fo(_){let i,d,a=_[2]==_[10]&&qo(_);return{c(){a&&a.c(),i=qe()},l(m){a&&a.l(m),i=qe()},m(m,p){a&&a.m(m,p),ut(m,i,p),d=!0},p(m,p){m[2]==m[10]?a?(a.p(m,p),p&4&&B(a,1)):(a=qo(m),a.c(),B(a,1),a.m(i.parentNode,i)):a&&(No(),q(a,1,1,()=>{a=null}),zo())},i(m){d||(B(a),d=!0)},o(m){q(a),d=!1},d(m){a&&a.d(m),m&&e(i)}}}function oa(_){let i,d,a,m,p,j,g,x,S,D,O,y=_[0],T=[];for(let u=0;u<y.length;u+=1)T[u]=Vo(Ho(_,y,u));let R=_[0],E=[];for(let u=0;u<R.length;u+=1)E[u]=Fo(Bo(_,R,u));const F=u=>q(E[u],1,1,()=>{E[u]=null});return{c(){i=new Jo(!1),d=qe(),a=n(),m=r("div"),p=r("div"),j=r("h2"),g=h(_[1]),x=n(),S=r("ul");for(let u=0;u<T.length;u+=1)T[u].c();D=n();for(let u=0;u<E.length;u+=1)E[u].c();this.h()},l(u){const w=Yo("svelte-32u38c",document.head);i=Ko(w,!1),d=qe(),w.forEach(e),a=s(u),m=l(u,"DIV",{class:!0});var f=o(m);p=l(f,"DIV",{class:!0});var k=o(p);j=l(k,"H2",{class:!0});var C=o(j);g=c(C,_[1]),C.forEach(e),x=s(k),S=l(k,"UL",{class:!0});var H=o(S);for(let A=0;A<T.length;A+=1)T[A].l(H);H.forEach(e),k.forEach(e),D=s(f);for(let A=0;A<E.length;A+=1)E[A].l(f);f.forEach(e),this.h()},h(){i.a=d,P(j,"class","font-semibold text-xl"),P(S,"class","flex justify-center py-1"),P(p,"class","flex justify-between border-primary items-center border-b-2 mb-4"),P(m,"class","w-full")},m(u,w){i.m(ra,document.head),t(document.head,d),ut(u,a,w),ut(u,m,w),t(m,p),t(p,j),t(j,g),t(p,x),t(p,S);for(let f=0;f<T.length;f+=1)T[f].m(S,null);t(m,D);for(let f=0;f<E.length;f+=1)E[f].m(m,null);O=!0},p(u,[w]){if((!O||w&2)&&Pl(g,u[1]),w&21){y=u[0];let f;for(f=0;f<y.length;f+=1){const k=Ho(u,y,f);T[f]?T[f].p(k,w):(T[f]=Vo(k),T[f].c(),T[f].m(S,null))}for(;f<T.length;f+=1)T[f].d(1);T.length=y.length}if(w&13){R=u[0];let f;for(f=0;f<R.length;f+=1){const k=Bo(u,R,f);E[f]?(E[f].p(k,w),B(E[f],1)):(E[f]=Fo(k),E[f].c(),B(E[f],1),E[f].m(m,null))}for(No(),f=R.length;f<E.length;f+=1)F(f);zo()}},i(u){if(!O){for(let w=0;w<R.length;w+=1)B(E[w]);O=!0}},o(u){E=E.filter(Boolean);for(let w=0;w<E.length;w+=1)q(E[w]);O=!1},d(u){e(d),u&&i.d(),u&&e(a),u&&e(m),Wo(T,u),Wo(E,u)}}}function aa(_,i,d){let a,m,p={javascript:Zo,python:ta},j=(D,O)=>{d(2,a=D)},{data:g}=i,{title:x}=i;const S=(D,O,y)=>j(D,O.lang);return _.$$set=D=>{"data"in D&&d(0,g=D.data),"title"in D&&d(1,x=D.title)},_.$$.update=()=>{_.$$.dirty&5&&g[a].code,_.$$.dirty&5&&d(3,m=p[g[a].lang])},d(2,a=0),[g,x,a,m,j,S]}class Il extends Go{constructor(i){super(),Mo(this,i,aa,oa,Uo,{data:0,title:1})}}const Ol={controlWithExtension:[{lang:"javascript",title:"JavaScript",code:`
// You'll need to use the developer build of Chameleon if you want to
// control Chameleon with another extension
// https://github.com/sereneblue/chameleon/releases

// change browser profile to Windows 10 - Firefox
await browser.runtime.sendMessage(
  '{3579f63b-d8ee-424f-bbb6-6d0ce3285e6a}',
  {
    action: 'updateProfile',
    data: 'win4-ff',
  },
  null
);

// import settings by using the settings exported by Chameleon
// let settings = exported settings loaded as an object  
// saving settings is also how changes are persisted after reloading the extension
await browser.runtime.sendMessage(
  '{3579f63b-d8ee-424f-bbb6-6d0ce3285e6a}',
  {
    action: 'implicitSave'
  },
  null
);

// get current Chameleon settings
let settings = await browser.runtime.sendMessage(
  '{3579f63b-d8ee-424f-bbb6-6d0ce3285e6a}',
  {
    action: 'getSettings'
  },
  null
);

// The logic for how messages are routed is mostly handled in this file
// https://github.com/sereneblue/chameleon/blob/develop/src/store/actions.ts`}],importSettings:[{lang:"python",title:"Python",code:`   
# navigate to chameleon options page
driver.get(OPTIONS_PAGE)

# import settings
driver.find_element_by_id('chameleonImport').send_keys('/path/to/settings.json')

# wait for chameleon to reload
sleep(3)
      `}],launchChameleon:[{lang:"python",title:"Python",code:`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from time import sleep

firefox_binary = '/usr/bin/firefox'
driver = webdriver.Firefox(firefox_binary=firefox_binary, executable_path='./geckodriver')
extension_path = '/path/to/chameleon/ext.xpi'
driver.install_addon(extension_path, temporary=True)

driver.get('about:debugging#/runtime/this-firefox')

# wait for extensions to appear
wait = WebDriverWait(driver, 5)
element = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, 'card')))

# internal uuid for extension pages
internal_uuid = driver.execute_script("""
  let extensions = Array.from(document.querySelectorAll('.card'));
  let chameleon = extensions.filter(el => el.querySelector('span').title == 'Chameleon')[0];
  let metadata = Array.from(chameleon.querySelectorAll('.fieldpair__description')).map(e => e.innerText);
  return metadata[2];
""")

POPUP_PAGE = f'moz-extension://{internal_uuid}/popup/popup.html'
OPTIONS_PAGE = f'moz-extension://{internal_uuid}/options/options.html'

# navigate to chameleon popup page
driver.get(POPUP_PAGE)

# select profile tab
driver.find_element_by_id('profileTab').click()

# select Random Desktop profile option
driver.find_element_by_id('randomDesktop').click()

# verify user agent changed
driver.get('https://httpbin.org/headers')

sleep(10)

driver.quit()
      `}]};function na(_){let i,d,a,m,p,j,g,x,S,D,O,y,T,R,E,F,u,w,f,k,C,H,A,Fe,vt,Ge,Me,v,G,bt,Ue,Ye,pt,Ne,ze,M,gt,Je,Ke,Et,Qe,Xe,U,Tt,Ze,tr,wt,er,rr,Y,Dt,lr,or,yt,ar,nr,N,jt,sr,dr,xt,ir,hr,z,St,cr,fr,kt,mr,ur,J,$t,_r,vr,It,br,pr,K,Ot,gr,Er,Pt,Tr,wr,Q,Rt,Dr,yr,At,jr,xr,X,Ct,Sr,kr,Wt,$r,Ir,Z,Lt,Or,Pr,Bt,Rr,Ar,tt,Ht,Cr,Wr,Vt,Lr,Br,et,qt,Hr,Vr,Ft,qr,Fr,rt,Gt,Gr,Mr,Mt,Ur,Yr,lt,Ut,Nr,zr,Yt,Jr,Kr,ot,Nt,Qr,Xr,zt,Zr,tl,at,Jt,el,rl,Kt,ll,ol,nt,Qt,st,Xt,al,nl,Zt,sl,dl,I,dt,te,il,hl,ee,cl,fl,it,re,ml,ul,le,_l,vl,ht,oe,bl,pl,ae,gl,El,ct,ne,Tl,wl,se,Dl,yl,ft,de,jl,xl,ie,Sl,kl,_t,mt,he;return g=new Il({props:{title:"Launch a browser with Chameleon",data:Ol.launchChameleon}}),D=new Il({props:{title:"Import Settings",data:Ol.importSettings}}),mt=new Il({props:{title:"Controlling Chameleon with an Addon",data:Ol.controlWithExtension}}),{c(){i=n(),d=r("div"),a=r("div"),m=h("You can use the scripts below to manage Chameleon with a browser automation library."),p=n(),j=r("div"),Le(g.$$.fragment),x=n(),S=r("div"),Le(D.$$.fragment),O=n(),y=r("div"),T=r("h2"),R=h("Browser Profiles"),E=n(),F=r("p"),u=h(`When selecting a specfic browser profile to use, you can use the browser profile ID as a selector. Profile IDs are
      made from a combination of an OS and a browser such as "win1-edg". Listed below are OS IDs and the browser abbreviations
      that Chameleon uses.`),w=n(),f=r("table"),k=r("thead"),C=r("tr"),H=r("th"),A=h("OS"),Fe=n(),vt=r("th"),Ge=h("ID"),Me=n(),v=r("tbody"),G=r("tr"),bt=r("td"),Ue=h("Windows 7"),Ye=n(),pt=r("td"),Ne=h("win1"),ze=n(),M=r("tr"),gt=r("td"),Je=h("Windows 8"),Ke=n(),Et=r("td"),Qe=h("win2"),Xe=n(),U=r("tr"),Tt=r("td"),Ze=h("Windows 8.1"),tr=n(),wt=r("td"),er=h("win3"),rr=n(),Y=r("tr"),Dt=r("td"),lr=h("Windows 10"),or=n(),yt=r("td"),ar=h("win4"),nr=n(),N=r("tr"),jt=r("td"),sr=h("macOS 10.13 (or 2 behind latest)"),dr=n(),xt=r("td"),ir=h("mac1"),hr=n(),z=r("tr"),St=r("td"),cr=h("macOS 10.14 (or 1 behind latest)"),fr=n(),kt=r("td"),mr=h("mac2"),ur=n(),J=r("tr"),$t=r("td"),_r=h("macOS 10.15 (or latest)"),vr=n(),It=r("td"),br=h("mac3"),pr=n(),K=r("tr"),Ot=r("td"),gr=h("Linux"),Er=n(),Pt=r("td"),Tr=h("lin1"),wr=n(),Q=r("tr"),Rt=r("td"),Dr=h("Ubuntu Linux"),yr=n(),At=r("td"),jr=h("lin2"),xr=n(),X=r("tr"),Ct=r("td"),Sr=h("Fedora Linux"),kr=n(),Wt=r("td"),$r=h("lin3"),Ir=n(),Z=r("tr"),Lt=r("td"),Or=h("iOS 11 (or 2 behind latest)"),Pr=n(),Bt=r("td"),Rr=h("ios1"),Ar=n(),tt=r("tr"),Ht=r("td"),Cr=h("iOS 12 (or 1 behind latest)"),Wr=n(),Vt=r("td"),Lr=h("ios2"),Br=n(),et=r("tr"),qt=r("td"),Hr=h("iOS 13 (or latest)"),Vr=n(),Ft=r("td"),qr=h("ios3"),Fr=n(),rt=r("tr"),Gt=r("td"),Gr=h("Android 6 (or 4 behind latest)"),Mr=n(),Mt=r("td"),Ur=h("and1"),Yr=n(),lt=r("tr"),Ut=r("td"),Nr=h("Android 7 (or 3 behind latest)"),zr=n(),Yt=r("td"),Jr=h("and2"),Kr=n(),ot=r("tr"),Nt=r("td"),Qr=h("Android 8 (or 2 behind latest)"),Xr=n(),zt=r("td"),Zr=h("and3"),tl=n(),at=r("tr"),Jt=r("td"),el=h("Android 9 (or 1 behind latest)"),rl=n(),Kt=r("td"),ll=h("and4"),ol=n(),nt=r("table"),Qt=r("thead"),st=r("tr"),Xt=r("th"),al=h("Browser"),nl=n(),Zt=r("th"),sl=h("ID"),dl=n(),I=r("tbody"),dt=r("tr"),te=r("td"),il=h("Chrome"),hl=n(),ee=r("td"),cl=h("gcr (desktop) / gcrm (mobile) / gcrt (tablet)"),fl=n(),it=r("tr"),re=r("td"),ml=h("Edge"),ul=n(),le=r("td"),_l=h("edg (desktop) / edgm (mobile)"),vl=n(),ht=r("tr"),oe=r("td"),bl=h("Firefox"),pl=n(),ae=r("td"),gl=h("ff (desktop) / ffm (mobile) / fft (tablet)"),El=n(),ct=r("tr"),ne=r("td"),Tl=h("Internet Explorer"),wl=n(),se=r("td"),Dl=h("ie"),yl=n(),ft=r("tr"),de=r("td"),jl=h("Safari"),xl=n(),ie=r("td"),Sl=h("sf (desktop) / sfm (iPhone) / sft (iPad)"),kl=n(),_t=r("div"),Le(mt.$$.fragment),this.h()},l($){Yo("svelte-1nvnudk",document.head).forEach(e),i=s($),d=l($,"DIV",{class:!0});var W=o(d);a=l(W,"DIV",{class:!0});var Rl=o(a);m=c(Rl,"You can use the scripts below to manage Chameleon with a browser automation library."),Rl.forEach(e),p=s(W),j=l(W,"DIV",{class:!0});var Al=o(j);Be(g.$$.fragment,Al),Al.forEach(e),x=s(W),S=l(W,"DIV",{class:!0});var Cl=o(S);Be(D.$$.fragment,Cl),Cl.forEach(e),O=s(W),y=l(W,"DIV",{class:!0});var V=o(y);T=l(V,"H2",{class:!0});var Wl=o(T);R=c(Wl,"Browser Profiles"),Wl.forEach(e),E=s(V),F=l(V,"P",{});var Ll=o(F);u=c(Ll,`When selecting a specfic browser profile to use, you can use the browser profile ID as a selector. Profile IDs are
      made from a combination of an OS and a browser such as "win1-edg". Listed below are OS IDs and the browser abbreviations
      that Chameleon uses.`),Ll.forEach(e),w=s(V),f=l(V,"TABLE",{});var ce=o(f);k=l(ce,"THEAD",{});var Bl=o(k);C=l(Bl,"TR",{});var fe=o(C);H=l(fe,"TH",{});var Hl=o(H);A=c(Hl,"OS"),Hl.forEach(e),Fe=s(fe),vt=l(fe,"TH",{});var Vl=o(vt);Ge=c(Vl,"ID"),Vl.forEach(e),fe.forEach(e),Bl.forEach(e),Me=s(ce),v=l(ce,"TBODY",{});var b=o(v);G=l(b,"TR",{});var me=o(G);bt=l(me,"TD",{});var ql=o(bt);Ue=c(ql,"Windows 7"),ql.forEach(e),Ye=s(me),pt=l(me,"TD",{});var Fl=o(pt);Ne=c(Fl,"win1"),Fl.forEach(e),me.forEach(e),ze=s(b),M=l(b,"TR",{});var ue=o(M);gt=l(ue,"TD",{});var Gl=o(gt);Je=c(Gl,"Windows 8"),Gl.forEach(e),Ke=s(ue),Et=l(ue,"TD",{});var Ml=o(Et);Qe=c(Ml,"win2"),Ml.forEach(e),ue.forEach(e),Xe=s(b),U=l(b,"TR",{});var _e=o(U);Tt=l(_e,"TD",{});var Ul=o(Tt);Ze=c(Ul,"Windows 8.1"),Ul.forEach(e),tr=s(_e),wt=l(_e,"TD",{});var Yl=o(wt);er=c(Yl,"win3"),Yl.forEach(e),_e.forEach(e),rr=s(b),Y=l(b,"TR",{});var ve=o(Y);Dt=l(ve,"TD",{});var Nl=o(Dt);lr=c(Nl,"Windows 10"),Nl.forEach(e),or=s(ve),yt=l(ve,"TD",{});var zl=o(yt);ar=c(zl,"win4"),zl.forEach(e),ve.forEach(e),nr=s(b),N=l(b,"TR",{});var be=o(N);jt=l(be,"TD",{});var Jl=o(jt);sr=c(Jl,"macOS 10.13 (or 2 behind latest)"),Jl.forEach(e),dr=s(be),xt=l(be,"TD",{});var Kl=o(xt);ir=c(Kl,"mac1"),Kl.forEach(e),be.forEach(e),hr=s(b),z=l(b,"TR",{});var pe=o(z);St=l(pe,"TD",{});var Ql=o(St);cr=c(Ql,"macOS 10.14 (or 1 behind latest)"),Ql.forEach(e),fr=s(pe),kt=l(pe,"TD",{});var Xl=o(kt);mr=c(Xl,"mac2"),Xl.forEach(e),pe.forEach(e),ur=s(b),J=l(b,"TR",{});var ge=o(J);$t=l(ge,"TD",{});var Zl=o($t);_r=c(Zl,"macOS 10.15 (or latest)"),Zl.forEach(e),vr=s(ge),It=l(ge,"TD",{});var to=o(It);br=c(to,"mac3"),to.forEach(e),ge.forEach(e),pr=s(b),K=l(b,"TR",{});var Ee=o(K);Ot=l(Ee,"TD",{});var eo=o(Ot);gr=c(eo,"Linux"),eo.forEach(e),Er=s(Ee),Pt=l(Ee,"TD",{});var ro=o(Pt);Tr=c(ro,"lin1"),ro.forEach(e),Ee.forEach(e),wr=s(b),Q=l(b,"TR",{});var Te=o(Q);Rt=l(Te,"TD",{});var lo=o(Rt);Dr=c(lo,"Ubuntu Linux"),lo.forEach(e),yr=s(Te),At=l(Te,"TD",{});var oo=o(At);jr=c(oo,"lin2"),oo.forEach(e),Te.forEach(e),xr=s(b),X=l(b,"TR",{});var we=o(X);Ct=l(we,"TD",{});var ao=o(Ct);Sr=c(ao,"Fedora Linux"),ao.forEach(e),kr=s(we),Wt=l(we,"TD",{});var no=o(Wt);$r=c(no,"lin3"),no.forEach(e),we.forEach(e),Ir=s(b),Z=l(b,"TR",{});var De=o(Z);Lt=l(De,"TD",{});var so=o(Lt);Or=c(so,"iOS 11 (or 2 behind latest)"),so.forEach(e),Pr=s(De),Bt=l(De,"TD",{});var io=o(Bt);Rr=c(io,"ios1"),io.forEach(e),De.forEach(e),Ar=s(b),tt=l(b,"TR",{});var ye=o(tt);Ht=l(ye,"TD",{});var ho=o(Ht);Cr=c(ho,"iOS 12 (or 1 behind latest)"),ho.forEach(e),Wr=s(ye),Vt=l(ye,"TD",{});var co=o(Vt);Lr=c(co,"ios2"),co.forEach(e),ye.forEach(e),Br=s(b),et=l(b,"TR",{});var je=o(et);qt=l(je,"TD",{});var fo=o(qt);Hr=c(fo,"iOS 13 (or latest)"),fo.forEach(e),Vr=s(je),Ft=l(je,"TD",{});var mo=o(Ft);qr=c(mo,"ios3"),mo.forEach(e),je.forEach(e),Fr=s(b),rt=l(b,"TR",{});var xe=o(rt);Gt=l(xe,"TD",{});var uo=o(Gt);Gr=c(uo,"Android 6 (or 4 behind latest)"),uo.forEach(e),Mr=s(xe),Mt=l(xe,"TD",{});var _o=o(Mt);Ur=c(_o,"and1"),_o.forEach(e),xe.forEach(e),Yr=s(b),lt=l(b,"TR",{});var Se=o(lt);Ut=l(Se,"TD",{});var vo=o(Ut);Nr=c(vo,"Android 7 (or 3 behind latest)"),vo.forEach(e),zr=s(Se),Yt=l(Se,"TD",{});var bo=o(Yt);Jr=c(bo,"and2"),bo.forEach(e),Se.forEach(e),Kr=s(b),ot=l(b,"TR",{});var ke=o(ot);Nt=l(ke,"TD",{});var po=o(Nt);Qr=c(po,"Android 8 (or 2 behind latest)"),po.forEach(e),Xr=s(ke),zt=l(ke,"TD",{});var go=o(zt);Zr=c(go,"and3"),go.forEach(e),ke.forEach(e),tl=s(b),at=l(b,"TR",{});var $e=o(at);Jt=l($e,"TD",{});var Eo=o(Jt);el=c(Eo,"Android 9 (or 1 behind latest)"),Eo.forEach(e),rl=s($e),Kt=l($e,"TD",{});var To=o(Kt);ll=c(To,"and4"),To.forEach(e),$e.forEach(e),b.forEach(e),ce.forEach(e),ol=s(V),nt=l(V,"TABLE",{});var Ie=o(nt);Qt=l(Ie,"THEAD",{});var wo=o(Qt);st=l(wo,"TR",{});var Oe=o(st);Xt=l(Oe,"TH",{});var Do=o(Xt);al=c(Do,"Browser"),Do.forEach(e),nl=s(Oe),Zt=l(Oe,"TH",{});var yo=o(Zt);sl=c(yo,"ID"),yo.forEach(e),Oe.forEach(e),wo.forEach(e),dl=s(Ie),I=l(Ie,"TBODY",{});var L=o(I);dt=l(L,"TR",{});var Pe=o(dt);te=l(Pe,"TD",{});var jo=o(te);il=c(jo,"Chrome"),jo.forEach(e),hl=s(Pe),ee=l(Pe,"TD",{});var xo=o(ee);cl=c(xo,"gcr (desktop) / gcrm (mobile) / gcrt (tablet)"),xo.forEach(e),Pe.forEach(e),fl=s(L),it=l(L,"TR",{});var Re=o(it);re=l(Re,"TD",{});var So=o(re);ml=c(So,"Edge"),So.forEach(e),ul=s(Re),le=l(Re,"TD",{});var ko=o(le);_l=c(ko,"edg (desktop) / edgm (mobile)"),ko.forEach(e),Re.forEach(e),vl=s(L),ht=l(L,"TR",{});var Ae=o(ht);oe=l(Ae,"TD",{});var $o=o(oe);bl=c($o,"Firefox"),$o.forEach(e),pl=s(Ae),ae=l(Ae,"TD",{});var Io=o(ae);gl=c(Io,"ff (desktop) / ffm (mobile) / fft (tablet)"),Io.forEach(e),Ae.forEach(e),El=s(L),ct=l(L,"TR",{});var Ce=o(ct);ne=l(Ce,"TD",{});var Oo=o(ne);Tl=c(Oo,"Internet Explorer"),Oo.forEach(e),wl=s(Ce),se=l(Ce,"TD",{});var Po=o(se);Dl=c(Po,"ie"),Po.forEach(e),Ce.forEach(e),yl=s(L),ft=l(L,"TR",{});var We=o(ft);de=l(We,"TD",{});var Ro=o(de);jl=c(Ro,"Safari"),Ro.forEach(e),xl=s(We),ie=l(We,"TD",{});var Ao=o(ie);Sl=c(Ao,"sf (desktop) / sfm (iPhone) / sft (iPad)"),Ao.forEach(e),We.forEach(e),L.forEach(e),Ie.forEach(e),V.forEach(e),kl=s(W),_t=l(W,"DIV",{class:!0});var Co=o(_t);Be(mt.$$.fragment,Co),Co.forEach(e),W.forEach(e),this.h()},h(){document.title="Developer Guide | Chameleon",P(a,"class","text-lg mb-4"),P(j,"class","mb-4"),P(S,"class","mb-4"),P(T,"class","font-semibold text-xl border-primary border-b-2 mb-1"),P(y,"class","mb-4"),P(_t,"class","mb-4"),P(d,"class","mb-8 px-4 leading-tight")},m($,$l){ut($,i,$l),ut($,d,$l),t(d,a),t(a,m),t(d,p),t(d,j),He(g,j,null),t(d,x),t(d,S),He(D,S,null),t(d,O),t(d,y),t(y,T),t(T,R),t(y,E),t(y,F),t(F,u),t(y,w),t(y,f),t(f,k),t(k,C),t(C,H),t(H,A),t(C,Fe),t(C,vt),t(vt,Ge),t(f,Me),t(f,v),t(v,G),t(G,bt),t(bt,Ue),t(G,Ye),t(G,pt),t(pt,Ne),t(v,ze),t(v,M),t(M,gt),t(gt,Je),t(M,Ke),t(M,Et),t(Et,Qe),t(v,Xe),t(v,U),t(U,Tt),t(Tt,Ze),t(U,tr),t(U,wt),t(wt,er),t(v,rr),t(v,Y),t(Y,Dt),t(Dt,lr),t(Y,or),t(Y,yt),t(yt,ar),t(v,nr),t(v,N),t(N,jt),t(jt,sr),t(N,dr),t(N,xt),t(xt,ir),t(v,hr),t(v,z),t(z,St),t(St,cr),t(z,fr),t(z,kt),t(kt,mr),t(v,ur),t(v,J),t(J,$t),t($t,_r),t(J,vr),t(J,It),t(It,br),t(v,pr),t(v,K),t(K,Ot),t(Ot,gr),t(K,Er),t(K,Pt),t(Pt,Tr),t(v,wr),t(v,Q),t(Q,Rt),t(Rt,Dr),t(Q,yr),t(Q,At),t(At,jr),t(v,xr),t(v,X),t(X,Ct),t(Ct,Sr),t(X,kr),t(X,Wt),t(Wt,$r),t(v,Ir),t(v,Z),t(Z,Lt),t(Lt,Or),t(Z,Pr),t(Z,Bt),t(Bt,Rr),t(v,Ar),t(v,tt),t(tt,Ht),t(Ht,Cr),t(tt,Wr),t(tt,Vt),t(Vt,Lr),t(v,Br),t(v,et),t(et,qt),t(qt,Hr),t(et,Vr),t(et,Ft),t(Ft,qr),t(v,Fr),t(v,rt),t(rt,Gt),t(Gt,Gr),t(rt,Mr),t(rt,Mt),t(Mt,Ur),t(v,Yr),t(v,lt),t(lt,Ut),t(Ut,Nr),t(lt,zr),t(lt,Yt),t(Yt,Jr),t(v,Kr),t(v,ot),t(ot,Nt),t(Nt,Qr),t(ot,Xr),t(ot,zt),t(zt,Zr),t(v,tl),t(v,at),t(at,Jt),t(Jt,el),t(at,rl),t(at,Kt),t(Kt,ll),t(y,ol),t(y,nt),t(nt,Qt),t(Qt,st),t(st,Xt),t(Xt,al),t(st,nl),t(st,Zt),t(Zt,sl),t(nt,dl),t(nt,I),t(I,dt),t(dt,te),t(te,il),t(dt,hl),t(dt,ee),t(ee,cl),t(I,fl),t(I,it),t(it,re),t(re,ml),t(it,ul),t(it,le),t(le,_l),t(I,vl),t(I,ht),t(ht,oe),t(oe,bl),t(ht,pl),t(ht,ae),t(ae,gl),t(I,El),t(I,ct),t(ct,ne),t(ne,Tl),t(ct,wl),t(ct,se),t(se,Dl),t(I,yl),t(I,ft),t(ft,de),t(de,jl),t(ft,xl),t(ft,ie),t(ie,Sl),t(d,kl),t(d,_t),He(mt,_t,null),he=!0},p:Xo,i($){he||(B(g.$$.fragment,$),B(D.$$.fragment,$),B(mt.$$.fragment,$),he=!0)},o($){q(g.$$.fragment,$),q(D.$$.fragment,$),q(mt.$$.fragment,$),he=!1},d($){$&&e(i),$&&e(d),Ve(g),Ve(D),Ve(mt)}}}class ia extends Go{constructor(i){super(),Mo(this,i,null,na,Uo,{})}}export{ia as default};
