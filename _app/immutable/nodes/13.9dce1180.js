import{s as d,n as o}from"../chunks/scheduler.63274e7e.js";import{S as u,i as c,s as m,g as f,A as h,f as n,c as p,h as g,x as v,k as I,a as l}from"../chunks/index.14018a49.js";import{b as x}from"../chunks/paths.838fd77a.js";function P(r){let a,e,i=`<div class="text-lg mb-4 w-full flex justify-center"><img src="${x}/ip_rules.png" alt="Chameleon IP Rules"/></div> <div><div class="mb-4">The IP Rule Editor can be used to automatically assign a language and timezone
      to an IP address when Firefox is started when you select &quot;IP&quot; as the option
      for timezone or language spoofing.
      <br/> <br/>
      After you&#39;ve added rules, you may want to click the &quot;Reload IP info&quot; button to update your spoofed profile.
      <br/> <br/>
      In v0.20.0, the format for IP ranges was changed. Instead of CIDR notation, the IP range is now specified
      as [Start IP Range]-[End IP Range]. For example, <strong>1.1.1.1-2.2.2.2</strong> is valid input for an IP range.</div></div>`;return{c(){a=m(),e=f("div"),e.innerHTML=i,this.h()},l(t){h("svelte-av30pw",document.head).forEach(n),a=p(t),e=g(t,"DIV",{class:!0,"data-svelte-h":!0}),v(e)!=="svelte-uwlkvp"&&(e.innerHTML=i),this.h()},h(){document.title="IP Rules | Chameleon",I(e,"class","mb-8 px-4 text-xl leading-snug")},m(t,s){l(t,a,s),l(t,e,s)},p:o,i:o,o,d(t){t&&(n(a),n(e))}}}class y extends u{constructor(a){super(),c(this,a,null,P,d,{})}}export{y as component};
