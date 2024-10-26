import{s as se,n as oe}from"../chunks/scheduler.63274e7e.js";import{S as ae,i as ne,s as f,g as s,m as I,r as le,A as ie,f as g,c as b,h as o,j as D,x as c,n as A,u as de,k as l,a as Y,z as e,v as he,d as ce,t as me,w as pe}from"../chunks/index.14018a49.js";import{b as fe}from"../chunks/paths.838fd77a.js";import{H as be,a as ue}from"../chunks/index.99baa530.js";function ge($){let m=`GET /home.html HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/testpage.html
Connection: keep-alive
Upgrade-Insecure-Requests: 1
If-Modified-Since: Mon, 18 Jul 2016 02:36:04 GMT
If-None-Match: "c561c68d0ba92bbeb8b0fff2a9199f722e3a621a"
Cache-Control: max-age=0`,r;return{c(){r=I(m)},l(a){r=A(a,m)},m(a,S){Y(a,r,S)},p:oe,d(a){a&&g(r)}}}function ve($){let m,r,a,S=`<img src="${fe}/ui3.png" alt="Chameleon Headers tab"/>`,z,t,d,v,j="What are HTTP headers?",E,h,U,q,B="every",R,p,Z="here",O,u,V,x,J='<div class="mb-6">The HTTP header lets the server know the following:</div> <div>The URL requested: <span class="font-semibold">https://developer.mozilla.org/home.html</span></div> <div>The browser used to make the request: <span class="font-semibold">Firefox 50</span></div> <div>The language the browser supports: <span class="font-semibold">English (US)</span></div> <div>The page the user navigated from: <span class="font-semibold">https://developer.mozilla.org/testpage.html</span></div>',X,T,K=`<h2 class="font-semibold text-3xl border-primary border-b-2 mb-4">Chameleon options</h2> <div class="mb-4"><h3 class="font-semibold text-2xl mb-1">Enable DNT (Do Not Track)</h3> <p>Enables Do Not Track in the header. This <strong>DOES NOT</strong> mean that you will not get tracked on the web.
          By enabling this option you are expressing that you <em>prefer</em> not to be tracked. You will have to
          trust the server to honor your request.
          More info can be found <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DNT" target="_blank" rel="noopener noreferrer">here</a>.</p></div> <div class="mb-4"><h3 class="font-semibold text-2xl mb-1">Prevent Etag tracking</h3> <p>Etags are used to control how long files are cached by the browser. They can be used to track you online
          without cookies.
          More info can be found <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag" target="_blank" rel="noopener noreferrer">here</a>.</p></div> <div class="mb-4"><h3 class="font-semibold text-2xl mb-1">Spoof Accept-Language</h3> <p>This may change the language of the content returned to the browser.
          For example, changing Youtube&#39;s text from English to Chinese regardless of where the user is located.
          More info can be found <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language" target="_blank" rel="noopener noreferrer">here</a>.</p></div> <div class="mb-6"><h3 class="font-semibold text-2xl mb-1">Spoof X-Forwarded-For/Via IP</h3> <p>You can fool several sites that obtain your IP address by setting the X-Forwarded-For/Via header fields.
          <strong>This does not work on most sites and will not make you anonymous online.</strong></p></div>`,F,w,Q=`<h2 class="font-semibold text-3xl border-primary border-b-2 mb-4">Referer options</h2> <p>The referer header field lets a web server know where people are visiting from. For example,
        when you perform a search for &quot;cake recipes&quot; and click a link to someone&#39;s website,
        the server now knows which search engine was used to get to a page. This provides useful information
        to website owners who can use the referer for analytics. However, there are some privacy and security concerns
        that are detailed <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns" target="_blank" rel="noopener noreferrer">here</a>.</p>`,N,y,ee='<h3 class="font-semibold text-2xl mb-1">Disable referer</h3> <p>This clears the referer header. While useful, it can break sites and redirects.</p>',W,_,te=`<h3 class="font-semibold text-2xl mb-1">Referer X Origin Policy</h3> <p class="text-red-800 font-semibold">Do not modify the about:config setting: network.http.referer.XOriginPolicy.</p> <p>A request made to a domain different from the web page that
        the request is coming from is a &quot;cross origin&quot; request.</p> <div class="mt-4"><table><thead><tr><th>Option</th> <th>Description</th></tr></thead> <tbody><tr><td>Always send</td> <td>Always send the referer for X Origin requests</td></tr> <tr><td>Match base domain</td> <td>Only send X Origin request if base domain matches
                <br/> <br/>
                If a request from a web page, <strong>news.example.com</strong>, is made to 
                <strong>test.com</strong>, the referer will <em>not</em> be sent because
                both URLs <em>do not</em> share the same base domain (example.com, test.com).</td></tr> <tr><td>Match host</td> <td>Only send X Origin request if hostname matches
                <br/> <br/>
                If a request from a web page, <strong>news.example.com</strong>, is made to 
                <strong>news.example.com</strong>, the referer <em>will</em> be sent because
                both URLs share the same base hostname (news.example.com).</td></tr></tbody></table></div>`,G,H,re=`<h3 class="font-semibold text-2xl mb-1">Referer Trimming Policy</h3> <p class="text-red-800 font-semibold">Do not modify the about:config setting: network.http.referer.trimmingPolicy.</p> <div class="mt-4"><table><thead><tr><th>Option</th> <th>Description</th></tr></thead> <tbody><tr><td>Send full URI</td> <td>Sends the full referer</td></tr> <tr><td>Scheme, host, port, path</td> <td>Sends the scheme, host, port and path of the URL; strips query strings.
                <br/> <br/> <strong>Before:</strong> <br/>
                https://example.com:8080/page?privacy=false&amp;trackingid=XYZ
                <br/> <strong>After:</strong> <br/>
                https://example.com:8080/page</td></tr> <tr><td>Scheme, host, port</td> <td>Sends the scheme, host, and port of the URL.
                <br/> <br/> <strong>Before:</strong> <br/>
                https://example.com:8080/page?privacy=false&amp;trackingid=XYZ
                <br/> <strong>After:</strong> <br/>
                https://example.com:8080/</td></tr></tbody></table></div>`,P;return u=new be({props:{language:ue,$$slots:{default:[ge]},$$scope:{ctx:$}}}),{c(){m=f(),r=s("div"),a=s("div"),a.innerHTML=S,z=f(),t=s("div"),d=s("div"),v=s("h2"),v.textContent=j,E=f(),h=s("p"),U=I("An HTTP header is information that is sent with "),q=s("strong"),q.textContent=B,R=I(` HTTP request that your web browser makes.
        More info can be found `),p=s("a"),p.textContent=Z,O=I(`.
        An example of an HTTP header (request header) is shown below:
        `),le(u.$$.fragment),V=f(),x=s("div"),x.innerHTML=J,X=f(),T=s("div"),T.innerHTML=K,F=f(),w=s("div"),w.innerHTML=Q,N=f(),y=s("div"),y.innerHTML=ee,W=f(),_=s("div"),_.innerHTML=te,G=f(),H=s("div"),H.innerHTML=re,this.h()},l(n){ie("svelte-rg5zis",document.head).forEach(g),m=b(n),r=o(n,"DIV",{class:!0});var k=D(r);a=o(k,"DIV",{class:!0,"data-svelte-h":!0}),c(a)!=="svelte-1a6a0f1"&&(a.innerHTML=S),z=b(k),t=o(k,"DIV",{});var i=D(t);d=o(i,"DIV",{class:!0});var L=D(d);v=o(L,"H2",{class:!0,"data-svelte-h":!0}),c(v)!=="svelte-1xhcxb7"&&(v.textContent=j),E=b(L),h=o(L,"P",{});var M=D(h);U=A(M,"An HTTP header is information that is sent with "),q=o(M,"STRONG",{"data-svelte-h":!0}),c(q)!=="svelte-1idddnj"&&(q.textContent=B),R=A(M,` HTTP request that your web browser makes.
        More info can be found `),p=o(M,"A",{href:!0,target:!0,rel:!0,"data-svelte-h":!0}),c(p)!=="svelte-87l5sa"&&(p.textContent=Z),O=A(M,`.
        An example of an HTTP header (request header) is shown below:
        `),de(u.$$.fragment,M),M.forEach(g),V=b(L),x=o(L,"DIV",{class:!0,"data-svelte-h":!0}),c(x)!=="svelte-1soz8vp"&&(x.innerHTML=J),L.forEach(g),X=b(i),T=o(i,"DIV",{class:!0,"data-svelte-h":!0}),c(T)!=="svelte-1ypx7v7"&&(T.innerHTML=K),F=b(i),w=o(i,"DIV",{class:!0,"data-svelte-h":!0}),c(w)!=="svelte-10ybfet"&&(w.innerHTML=Q),N=b(i),y=o(i,"DIV",{class:!0,"data-svelte-h":!0}),c(y)!=="svelte-heacxz"&&(y.innerHTML=ee),W=b(i),_=o(i,"DIV",{class:!0,"data-svelte-h":!0}),c(_)!=="svelte-xpwgwh"&&(_.innerHTML=te),G=b(i),H=o(i,"DIV",{class:!0,"data-svelte-h":!0}),c(H)!=="svelte-11fb6xs"&&(H.innerHTML=re),i.forEach(g),k.forEach(g),this.h()},h(){document.title="Headers | Chameleon",l(a,"class","text-lg mb-4 w-full flex justify-center"),l(v,"class","font-semibold text-3xl border-primary border-b-2 mb-4"),l(p,"href","https://developer.mozilla.org/en-US/docs/Glossary/Request_header"),l(p,"target","_blank"),l(p,"rel","noopener noreferrer"),l(x,"class","mt-4"),l(d,"class","mb-4"),l(T,"class","mb-4"),l(w,"class","mb-4"),l(y,"class","mb-6"),l(_,"class","mb-6"),l(H,"class","mb-6"),l(r,"class","mb-8 px-4 text-xl leading-snug")},m(n,C){Y(n,m,C),Y(n,r,C),e(r,a),e(r,z),e(r,t),e(t,d),e(d,v),e(d,E),e(d,h),e(h,U),e(h,q),e(h,R),e(h,p),e(h,O),he(u,h,null),e(d,V),e(d,x),e(t,X),e(t,T),e(t,F),e(t,w),e(t,N),e(t,y),e(t,W),e(t,_),e(t,G),e(t,H),P=!0},p(n,[C]){const k={};C&1&&(k.$$scope={dirty:C,ctx:n}),u.$set(k)},i(n){P||(ce(u.$$.fragment,n),P=!0)},o(n){me(u.$$.fragment,n),P=!1},d(n){n&&(g(m),g(r)),pe(u)}}}class _e extends ae{constructor(m){super(),ne(this,m,null,ve,se,{})}}export{_e as component};
