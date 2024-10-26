import{s as tt,n as at}from"../chunks/scheduler.63274e7e.js";import{S as et,i as lt,H as it,e as B,s as P,g as j,m as F,A as rt,E as st,f as m,c as I,h as x,j as E,n as N,k,z as b,a as A,o as U,d as S,p as ot,b as nt,t as D,B as z,y as Y,C as dt,r as T,u as V,v as q,w as H,x as J}from"../chunks/index.14018a49.js";import{e as L}from"../chunks/each.e59479a4.js";import{j as ct,p as ht,H as ft}from"../chunks/index.99baa530.js";const ut=`<style>/*

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
</style>`;function R(a,l,e){const t=a.slice();return t[8]=l[e],t[10]=e,t}function K(a,l,e){const t=a.slice();return t[8]=l[e],t[10]=e,t}function Q(a){let l,e=a[8].title+"",t,o,d;function p(...c){return a[5](a[10],a[8],...c)}return{c(){l=j("li"),t=F(e),this.h()},l(c){l=x(c,"LI",{class:!0});var g=E(l);t=N(g,e),g.forEach(m),this.h()},h(){k(l,"class","svelte-1hmxea6"),Y(l,"active",a[2]==a[10])},m(c,g){A(c,l,g),b(l,t),o||(d=dt(l,"click",p),o=!0)},p(c,g){a=c,g&1&&e!==(e=a[8].title+"")&&U(t,e),g&4&&Y(l,"active",a[2]==a[10])},d(c){c&&m(l),o=!1,d()}}}function X(a){let l,e;return l=new ft({props:{class:"hljs",language:a[3],$$slots:{default:[mt]},$$scope:{ctx:a}}}),{c(){T(l.$$.fragment)},l(t){V(l.$$.fragment,t)},m(t,o){q(l,t,o),e=!0},p(t,o){const d={};o&8&&(d.language=t[3]),o&4097&&(d.$$scope={dirty:o,ctx:t}),l.$set(d)},i(t){e||(S(l.$$.fragment,t),e=!0)},o(t){D(l.$$.fragment,t),e=!1},d(t){H(l,t)}}}function mt(a){let l=a[8].code.trim()+"",e;return{c(){e=F(l)},l(t){e=N(t,l)},m(t,o){A(t,e,o)},p(t,o){o&1&&l!==(l=t[8].code.trim()+"")&&U(e,l)},d(t){t&&m(e)}}}function Z(a){let l,e,t=a[2]==a[10]&&X(a);return{c(){t&&t.c(),l=B()},l(o){t&&t.l(o),l=B()},m(o,d){t&&t.m(o,d),A(o,l,d),e=!0},p(o,d){o[2]==o[10]?t?(t.p(o,d),d&4&&S(t,1)):(t=X(o),t.c(),S(t,1),t.m(l.parentNode,l)):t&&(ot(),D(t,1,1,()=>{t=null}),nt())},i(o){e||(S(t),e=!0)},o(o){D(t),e=!1},d(o){o&&m(l),t&&t.d(o)}}}function pt(a){let l,e,t,o,d,p,c,g,_,f,w,v=L(a[0]),u=[];for(let n=0;n<v.length;n+=1)u[n]=Q(K(a,v,n));let y=L(a[0]),s=[];for(let n=0;n<y.length;n+=1)s[n]=Z(R(a,y,n));const C=n=>D(s[n],1,1,()=>{s[n]=null});return{c(){l=new it(!1),e=B(),t=P(),o=j("div"),d=j("div"),p=j("h2"),c=F(a[1]),g=P(),_=j("ul");for(let n=0;n<u.length;n+=1)u[n].c();f=P();for(let n=0;n<s.length;n+=1)s[n].c();this.h()},l(n){const i=rt("svelte-32u38c",document.head);l=st(i,!1),e=B(),i.forEach(m),t=I(n),o=x(n,"DIV",{class:!0});var r=E(o);d=x(r,"DIV",{class:!0});var h=E(d);p=x(h,"H2",{class:!0});var O=E(p);c=N(O,a[1]),O.forEach(m),g=I(h),_=x(h,"UL",{class:!0});var W=E(_);for(let $=0;$<u.length;$+=1)u[$].l(W);W.forEach(m),h.forEach(m),f=I(r);for(let $=0;$<s.length;$+=1)s[$].l(r);r.forEach(m),this.h()},h(){l.a=e,k(p,"class","font-semibold text-xl"),k(_,"class","flex justify-center py-1"),k(d,"class","flex justify-between border-primary items-center border-b-2 mb-4"),k(o,"class","w-full")},m(n,i){l.m(ut,document.head),b(document.head,e),A(n,t,i),A(n,o,i),b(o,d),b(d,p),b(p,c),b(d,g),b(d,_);for(let r=0;r<u.length;r+=1)u[r]&&u[r].m(_,null);b(o,f);for(let r=0;r<s.length;r+=1)s[r]&&s[r].m(o,null);w=!0},p(n,[i]){if((!w||i&2)&&U(c,n[1]),i&21){v=L(n[0]);let r;for(r=0;r<v.length;r+=1){const h=K(n,v,r);u[r]?u[r].p(h,i):(u[r]=Q(h),u[r].c(),u[r].m(_,null))}for(;r<u.length;r+=1)u[r].d(1);u.length=v.length}if(i&13){y=L(n[0]);let r;for(r=0;r<y.length;r+=1){const h=R(n,y,r);s[r]?(s[r].p(h,i),S(s[r],1)):(s[r]=Z(h),s[r].c(),S(s[r],1),s[r].m(o,null))}for(ot(),r=y.length;r<s.length;r+=1)C(r);nt()}},i(n){if(!w){for(let i=0;i<y.length;i+=1)S(s[i]);w=!0}},o(n){s=s.filter(Boolean);for(let i=0;i<s.length;i+=1)D(s[i]);w=!1},d(n){n&&(l.d(),m(t),m(o)),m(e),z(u,n),z(s,n)}}}function gt(a,l,e){let t,o,d={javascript:ct,python:ht},p=(f,w)=>{e(2,t=f)},{data:c}=l,{title:g}=l;const _=(f,w,v)=>p(f,w.lang);return a.$$set=f=>{"data"in f&&e(0,c=f.data),"title"in f&&e(1,g=f.title)},a.$$.update=()=>{a.$$.dirty&5&&c[t].code,a.$$.dirty&5&&e(3,o=d[c[t].lang])},e(2,t=0),[c,g,t,o,p,_]}class M extends et{constructor(l){super(),lt(this,l,gt,pt,tt,{data:0,title:1})}}const G={controlWithExtension:[{lang:"javascript",title:"JavaScript",code:`
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
      `}]};function bt(a){let l,e,t,o="You can use the scripts below to manage Chameleon with a browser automation library.",d,p,c,g,_,f,w,v,u=`<h2 class="font-semibold text-xl border-primary border-b-2 mb-1">Browser Profiles</h2> <p>When selecting a specfic browser profile to use, you can use the browser profile ID as a selector. Profile IDs are
      made from a combination of an OS and a browser such as &quot;win1-edg&quot;. Listed below are OS IDs and the browser abbreviations
      that Chameleon uses.</p> <table><thead><tr><th>OS</th> <th>ID</th></tr></thead> <tbody><tr><td>Windows 7</td> <td>win1</td></tr> <tr><td>Windows 8</td> <td>win2</td></tr> <tr><td>Windows 8.1</td> <td>win3</td></tr> <tr><td>Windows 10</td> <td>win4</td></tr> <tr><td>macOS 10.13 (or 2 behind latest)</td> <td>mac1</td></tr> <tr><td>macOS 10.14 (or 1 behind latest)</td> <td>mac2</td></tr> <tr><td>macOS 10.15 (or latest)</td> <td>mac3</td></tr> <tr><td>Linux</td> <td>lin1</td></tr> <tr><td>Ubuntu Linux</td> <td>lin2</td></tr> <tr><td>Fedora Linux</td> <td>lin3</td></tr> <tr><td>iOS 11 (or 2 behind latest)</td> <td>ios1</td></tr> <tr><td>iOS 12 (or 1 behind latest)</td> <td>ios2</td></tr> <tr><td>iOS 13 (or latest)</td> <td>ios3</td></tr> <tr><td>Android 6 (or 4 behind latest)</td> <td>and1</td></tr> <tr><td>Android 7 (or 3 behind latest)</td> <td>and2</td></tr> <tr><td>Android 8 (or 2 behind latest)</td> <td>and3</td></tr> <tr><td>Android 9 (or 1 behind latest)</td> <td>and4</td></tr></tbody></table> <table><thead><tr><th>Browser</th> <th>ID</th></tr></thead> <tbody><tr><td>Chrome</td> <td>gcr (desktop) / gcrm (mobile) / gcrt (tablet)</td></tr> <tr><td>Edge</td> <td>edg (desktop) / edgm (mobile)</td></tr> <tr><td>Firefox</td> <td>ff (desktop) / ffm (mobile) / fft (tablet)</td></tr> <tr><td>Internet Explorer</td> <td>ie</td></tr> <tr><td>Safari</td> <td>sf (desktop) / sfm (iPhone) / sft (iPad)</td></tr></tbody></table>`,y,s,C,n;return c=new M({props:{title:"Launch a browser with Chameleon",data:G.launchChameleon}}),f=new M({props:{title:"Import Settings",data:G.importSettings}}),C=new M({props:{title:"Controlling Chameleon with an Addon",data:G.controlWithExtension}}),{c(){l=P(),e=j("div"),t=j("div"),t.textContent=o,d=P(),p=j("div"),T(c.$$.fragment),g=P(),_=j("div"),T(f.$$.fragment),w=P(),v=j("div"),v.innerHTML=u,y=P(),s=j("div"),T(C.$$.fragment),this.h()},l(i){rt("svelte-1nvnudk",document.head).forEach(m),l=I(i),e=x(i,"DIV",{class:!0});var h=E(e);t=x(h,"DIV",{class:!0,"data-svelte-h":!0}),J(t)!=="svelte-i7uj59"&&(t.textContent=o),d=I(h),p=x(h,"DIV",{class:!0});var O=E(p);V(c.$$.fragment,O),O.forEach(m),g=I(h),_=x(h,"DIV",{class:!0});var W=E(_);V(f.$$.fragment,W),W.forEach(m),w=I(h),v=x(h,"DIV",{class:!0,"data-svelte-h":!0}),J(v)!=="svelte-8cb571"&&(v.innerHTML=u),y=I(h),s=x(h,"DIV",{class:!0});var $=E(s);V(C.$$.fragment,$),$.forEach(m),h.forEach(m),this.h()},h(){document.title="Developer Guide | Chameleon",k(t,"class","text-lg mb-4"),k(p,"class","mb-4"),k(_,"class","mb-4"),k(v,"class","mb-4"),k(s,"class","mb-4"),k(e,"class","mb-8 px-4 leading-tight")},m(i,r){A(i,l,r),A(i,e,r),b(e,t),b(e,d),b(e,p),q(c,p,null),b(e,g),b(e,_),q(f,_,null),b(e,w),b(e,v),b(e,y),b(e,s),q(C,s,null),n=!0},p:at,i(i){n||(S(c.$$.fragment,i),S(f.$$.fragment,i),S(C.$$.fragment,i),n=!0)},o(i){D(c.$$.fragment,i),D(f.$$.fragment,i),D(C.$$.fragment,i),n=!1},d(i){i&&(m(l),m(e)),H(c),H(f),H(C)}}}class jt extends et{constructor(l){super(),lt(this,l,null,bt,tt,{})}}export{jt as component};
