<script>
  import Highlight from 'svelte-highlight';
  import { plaintext } from 'svelte-highlight/languages';
  import 'svelte-highlight/styles/github.css';
</script>

<svelte:head>
	<title>Headers | Chameleon</title>
</svelte:head>

<div class="mb-8 px-4 text-xl leading-snug">
  <div class="text-lg mb-4 w-full flex justify-center">
    <img src="ui3.png" alt="Chameleon Headers tab">
  </div>
  <div>
    <div class="mb-4">
      <h2 class="font-semibold text-3xl border-primary border-b-2 mb-4">What are HTTP headers?</h2>
      <p>
        An HTTP header is information that is sent with <strong>every</strong> HTTP request that your web browser makes.
        More info can be found <a href="https://developer.mozilla.org/en-US/docs/Glossary/Request_header" target="_blank" rel="noopener noreferrer">here</a>.
        An example of an HTTP header (request header) is shown below:
        <Highlight language={plaintext}>
          {
`GET /home.html HTTP/1.1
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
Cache-Control: max-age=0`}
        </Highlight>
      </p>
      <div class="mt-4">
        <div class="mb-6">
        The HTTP header lets the server know the following:
        </div>
        <div>
          The URL requested: <span class="font-semibold">https://developer.mozilla.org/home.html</span> 
        </div>
        <div>
          The browser used to make the request: <span class="font-semibold">Firefox 50</span> 
        </div>
        <div>
          The language the browser supports: <span class="font-semibold">English (US)</span> 
        </div>
        <div>
          The page the user navigated from: <span class="font-semibold">https://developer.mozilla.org/testpage.html</span> 
        </div>
      </div>
    </div>
    <div class="mb-4">
      <h2 class="font-semibold text-3xl border-primary border-b-2 mb-4">Chameleon options</h2>
      <div class="mb-4">
        <h3 class="font-semibold text-2xl mb-1">Enable DNT (Do Not Track)</h3>
        <p>
          Enables Do Not Track in the header. This <strong>DOES NOT</strong> mean that you will not get tracked on the web.
          By enabling this option you are expressing that you <em>prefer</em> not to be tracked. You will have to
          trust the server to honor your request.
          More info can be found <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DNT" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </div>
      <div class="mb-4">
        <h3 class="font-semibold text-2xl mb-1">Prevent Etag tracking</h3>
        <p>
          Etags are used to control how long files are cached by the browser. They can be used to track you online
          without cookies.
          More info can be found <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </div>
      <div class="mb-4">
        <h3 class="font-semibold text-2xl mb-1">Spoof Accept-Language</h3>
        <p>
          This may change the language of the content returned to the browser.
          For example, changing Youtube's text from English to Chinese regardless of where the user is located.
          More info can be found <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </div>
      <div class="mb-6">
        <h3 class="font-semibold text-2xl mb-1">Spoof X-Forwarded-For/Via IP</h3>
        <p>
          You can fool several sites that obtain your IP address by setting the X-Forwarded-For/Via header fields.
          <strong>This does not work on most sites and will not make you anonymous online.</strong>
        </p>
      </div>
    </div>
    <div class="mb-4">
      <h2 class="font-semibold text-3xl border-primary border-b-2 mb-4">Referer options</h2>
      <p>
        The referer header field lets a web server know where people are visiting from. For example,
        when you perform a search for "cake recipes" and click a link to someone's website,
        the server now knows which search engine was used to get to a page. This provides useful information
        to website owners who can use the referer for analytics. However, there are some privacy and security concerns
        that are detailed <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns" target="_blank" rel="noopener noreferrer">here</a>.
      </p>
    </div>
    <div class="mb-6">
      <h3 class="font-semibold text-2xl mb-1">Disable referer</h3>
      <p>
        This clears the referer header. While useful, it can break sites and redirects.
      </p>
    </div>
    <div class="mb-6">
      <h3 class="font-semibold text-2xl mb-1">Referer X Origin Policy</h3>
      <p class="text-red-800 font-semibold">
        Do not modify the about:config setting: network.http.referer.XOriginPolicy.
      </p>
      <p>
        A request made to a domain different from the web page that
        the request is coming from is a "cross origin" request.
      </p>
      <div class="mt-4">
        <div class="mb-2">
          <div class="text-xl font-semibold">
            Always send
          </div>
          <p>
            Always send the referer for X Origin requests
          </p>
        </div>
        <div class="mb-2">
          <div class="text-xl font-semibold">
            Match base domain
          </div>
          <div>
            Only send X Origin request if base domain matches.
            <br>
            <br>
            If a request from a web page, <strong>news.example.com</strong>, is made to <strong>test.com</strong>,
            the referer will <em>not</em> be sent because both URLs <em>do not</em> share the same base domain (example.com, test.com).
          </div>
        </div>
        <div class="text-xl font-semibold">
          Match host
        </div>
        <div>
          Only send X Origin request if hostname matches.
          <br>
          <br>
          If a request from a web page, <strong>news.example.com</strong>, is made to <strong>news.example.com</strong>,
          the referer <em>will</em> be sent because both URLs share the same base hostname (news.example.com).
        </div>
      </div>
    </div>
    <div class="mb-6">
      <h3 class="font-semibold text-2xl mb-1">Referer Trimming Policy</h3>
      <p class="text-red-800 font-semibold">
        Do not modify the about:config setting: network.http.referer.trimmingPolicy.
      </p>
      <div class="mt-4">
        <div class="mb-3">
          <div class="text-xl font-semibold">
            Send full URI
          </div>
          <p>
            Sends the full referer.
          </p>
        </div>
        <div class="mb-3">
          <div class="text-xl font-semibold">
            Scheme, host, port, path
          </div>
          <div>
            Sends the scheme, host, port and path of the URL; strips query strings.
            <br>
            <br>
            Before:
            <br>
            https://example.com:8080/page?privacy=false&trackingid=XYZ
            <br>
            After:
            <br>
            https://example.com:8080/page
          </div>
        </div>
        <div class="text-xl font-semibold">
          Scheme, host, port
        </div>
        <div>
          Sends the scheme, host, and port of the URL.
          <br>
          <br>
          Before:
          <br>
          https://example.com:8080/page?privacy=false&trackingid=XYZ
          <br>
          After:
          <br>
          https://example.com:8080/
        </div>
      </div>
    </div>
  </div>
</div>