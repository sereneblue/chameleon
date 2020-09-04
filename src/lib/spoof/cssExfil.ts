// https://github.com/mlgualtieri/CSS-Exfil-Protection/blob/master/firefox/content.js

// MIT License

// Copyright (c) 2019 Mike Gualtieri

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export default {
  type: 'script',
  data: () => {
    // Scan all document stylesheets
    function scan_css() {
      var sheets = document.styleSheets;

      for (var i = 0; i < sheets.length; i++) {
        let selectors = [];
        let selectorcss = [];
        let rules = getCSSRules(sheets[i]);

        if (rules == null) {
          if (sheets[i].href == null) {
            // If we reach here it's due to a Firefox CSS load timing error

            let _sheet = sheets[i];
            setTimeout(function checkRulesInit2() {
              rules = getCSSRules(_sheet);
              if (rules == null) {
                setTimeout(checkRulesInit2, 1000);
              } else {
                incrementSanitize();
                handleImportedCSS(rules);

                // Parse origin stylesheet
                let _selectors = parseCSSRules(rules);
                filter_css(_selectors[0], _selectors[1]);

                if (checkCSSDisabled(_sheet)) {
                  enableCSS(_sheet);
                }

                decrementSanitize();
              }
            }, 1000);
          } else {
            // Retrieve and parse cross domain stylesheet
            incrementSanitize();
            getCrossDomainCSS(sheets[i]);
          }
        } else {
          incrementSanitize();
          handleImportedCSS(rules);

          // Parse origin stylesheet
          //console.log("DOM stylesheet...");
          let _selectors = parseCSSRules(rules);
          filter_css(_selectors[0], _selectors[1]);

          if (checkCSSDisabled(sheets[i])) {
            enableCSS(sheets[i]);
          }

          decrementSanitize();
        }
      }
    }

    function handleImportedCSS(rules) {
      // Scan for imported stylesheets
      if (rules != null) {
        for (var r = 0; r < rules.length; r++) {
          if (Object.prototype.toString.call(rules[r]) == '[object CSSImportRule]') {
            // Adding new sheet to the list
            incrementSanitize();

            // Found an imported CSS Stylesheet
            let _rules = getCSSRules(rules[r].styleSheet);

            if (_rules == null) {
              // Parse imported cross domain sheet
              getCrossDomainCSS(rules[r].styleSheet);
            } else {
              // Parse imported DOM sheet
              //console.log("Imported DOM CSS...");
              let _selectors = parseCSSRules(_rules);
              filter_css(_selectors[0], _selectors[1]);
              decrementSanitize();
            }
          }
        }
      }
    }

    function getCSSRules(_sheet) {
      let rules = null;

      try {
        //Loading CSS
        rules = _sheet.rules || _sheet.cssRules;
      } catch (e) {
        if (e.name !== 'SecurityError') {
          //console.log("Error loading rules:");
          //throw e;
        }
      }

      return rules;
    }

    function parseCSSRules(rules) {
      let selectors = [];
      let selectorcss = [];

      if (rules != null) {
        // Loop through all selectors and determine if any are looking for the value attribute and calling a remote URL
        for (let r = 0; r < rules.length; r++) {
          let selectorText = null;

          if (rules[r].selectorText != null) {
            selectorText = rules[r].selectorText.toLowerCase();
          }

          let cssText = null;

          if (rules[r].cssText != null) {
            cssText = rules[r].cssText.toLowerCase();
          }

          // If CSS selector is parsing text and is loading a remote resource add to our blocking queue
          // Flag rules that:
          // 1) Match a value attribute selector which appears to be parsing text
          // 2) Calls a remote URL (https, http, //)
          // 3) The URL is not an xmlns property
          if (
            selectorText != null &&
            cssText != null &&
            selectorText.indexOf('value') !== -1 &&
            selectorText.indexOf('=') !== -1 &&
            cssText.indexOf('url') !== -1 &&
            (cssText.indexOf('https://') !== -1 || cssText.indexOf('http://') !== -1 || cssText.indexOf('//') !== -1) &&
            cssText.indexOf("xmlns=\\'http://") === -1
          ) {
            //console.log("CSS Exfil Protection blocked: "+ rules[r].selectorText);
            selectors.push(rules[r].selectorText);
            selectorcss.push(cssText);
          }
        }
      }

      // Check if any bad rules were found
      // if yes, temporarily disable stylesheet
      if (selectors[0] != null) {
        //console.log("Found potentially malicious selectors!");
        if (rules[0] != null) {
          disableCSS(rules[0].parentStyleSheet);
        }
      }

      return [selectors, selectorcss];
    }

    function filter_css(selectors: any[], selectorcss: any[]) {
      // Loop through found selectors and override CSS
      for (let s in selectors) {
        if (selectorcss[s].indexOf('background') !== -1) {
          filter_sheet.sheet.insertRule(selectors[s] + ' { background:none !important; }', filter_sheet.sheet.cssRules.length);
        }
        if (selectorcss[s].indexOf('list-style') !== -1) {
          filter_sheet.sheet.insertRule(selectors[s] + ' { list-style: inherit !important; }', filter_sheet.sheet.cssRules.length);
        }
        if (selectorcss[s].indexOf('cursor') !== -1) {
          filter_sheet.sheet.insertRule(selectors[s] + ' { cursor: auto !important; }', filter_sheet.sheet.cssRules.length);
        }
        if (selectorcss[s].indexOf('content') !== -1) {
          filter_sheet.sheet.insertRule(selectors[s] + ' { content: normal !important; }', filter_sheet.sheet.cssRules.length);
        }
      }
    }

    function getCrossDomainCSS(orig_sheet) {
      let rules;
      let url = orig_sheet.href;

      if (url != null) {
        if (seen_url.indexOf(url) === -1) {
          seen_url.push(url);
        } else {
          //console.log("Already checked URL");
          decrementSanitize();
          return;
        }
      }

      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          // Create stylesheet from remote CSS
          let sheet = document.createElement('style');
          sheet.innerText = xhr.responseText;

          // Get all import rules
          let matches = xhr.responseText.match(/@import.*?;/g);
          let replaced = xhr.responseText;

          // Get URL path of remote stylesheet (url minus the filename)
          let _a = document.createElement('a');
          _a.href = url;
          let _pathname = _a.pathname.substring(0, _a.pathname.lastIndexOf('/')) + '/';
          let import_url_path = _a.origin + _pathname;

          // Scan through all import rules
          // if calling a relative resource, edit to include the original URL path
          if (matches != null) {
            for (let i = 0; i < matches.length; i++) {
              // Only run if import is not calling a remote http:// or https:// resource
              if (matches[i].indexOf('://') === -1) {
                // Get file/path text from import rule (first text that's between quotes or parentheses)
                let import_file = matches[i].match(/['"\(](.*?)['"\)]/g);

                if (import_file != null) {
                  if (import_file.length > 0) {
                    let _import_file = import_file[0];

                    // Remove quotes and parentheses
                    _import_file = _import_file.replace(/['"\(\)]/g, '');

                    // Trim whitespace
                    _import_file = _import_file.trim();

                    // Remove any URL parameters
                    _import_file = _import_file.split('?')[0];

                    // Replace filename with full url path
                    let regex = new RegExp(_import_file);
                    replaced = replaced.replace(regex, import_url_path + _import_file);
                  }
                }
              }
            }
          }

          // Add CSS to sheet and append to head so we can scan the rules
          sheet.innerText = replaced;
          document.head.appendChild(sheet);

          // MG: this approach to retrieve the last inserted stylesheet sometimes fails,
          // instead get the stylesheet directly from the temporary object (sheet.sheet)
          //var sheets = document.styleSheets;
          //rules = getCSSRules(sheets[ sheets.length - 1]);
          rules = getCSSRules(sheet.sheet);

          // if rules is null is likely means we triggered a firefox
          // timing error where the new CSS sheet isn't ready yet
          if (rules == null) {
            // Keep checking every 10ms until rules have become available
            setTimeout(function checkRulesInit() {
              //rules = getCSSRules(sheets[ sheets.length - 1]);
              rules = getCSSRules(sheet.sheet);

              if (rules == null) {
                setTimeout(checkRulesInit, 10);
              } else {
                handleImportedCSS(rules);

                let _selectors = parseCSSRules(rules);
                filter_css(_selectors[0], _selectors[1]);

                // Remove tmp stylesheet
                // @ts-ignore
                sheet.disabled = true;
                sheet.parentNode.removeChild(sheet);

                if (checkCSSDisabled(orig_sheet)) {
                  enableCSS(orig_sheet);
                }

                decrementSanitize();
                return rules;
              }
            }, 10);
          } else {
            handleImportedCSS(rules);

            let _selectors = parseCSSRules(rules);
            filter_css(_selectors[0], _selectors[1]);

            // Remove tmp stylesheet
            // @ts-ignore
            sheet.disabled = true;
            sheet.parentNode.removeChild(sheet);

            if (checkCSSDisabled(orig_sheet)) {
              enableCSS(orig_sheet);
            }

            decrementSanitize();
            return rules;
          }
        }
      };

      xhr.send();
    }

    function disableCSS(_sheet) {
      _sheet.disabled = true;
    }

    function enableCSS(_sheet) {
      // Check to ensure sheet should be enabled before we do
      if (!disabled_css_hash[window.btoa(_sheet.href)]) {
        _sheet.disabled = false;

        // Some sites like news.google.com require a resize event to properly render all elements after re-enabling CSS
        window.dispatchEvent(new Event('resize'));
      }
    }

    function checkCSSDisabled(_sheet) {
      return _sheet.disabled;
    }

    function disableAndRemoveCSS(_sheet) {
      _sheet.disabled = true;
      if (_sheet.parentNode != null) {
        _sheet.parentNode.removeChild(_sheet);
      }
    }

    function incrementSanitize() {
      sanitize_inc++;
    }

    function decrementSanitize() {
      sanitize_inc--;
      if (sanitize_inc <= 0) {
        disableAndRemoveCSS(css_load_blocker);
      }
    }

    function buildContentLoadBlockerCSS() {
      return 'input,input ~ * { background-image:none !important; list-style: inherit !important; cursor: auto !important; content:normal !important; } input::before,input::after,input ~ *::before, input ~ *::after { content:normal !important; }';
    }

    /*
     *  Initialize
     */

    let filter_sheet = null; // Create stylesheet which will contain our override styles
    let css_load_blocker = null; // Temporary stylesheet to prevent early loading of resources we may block
    let sanitize_inc = 0; // Incrementer to keep track when it's safe to unload css_load_blocker
    let seen_url = []; // Keep track of scanned cross-domain URL's
    let disabled_css_hash = {}; // Keep track if the CSS was disabled before sanitization

    // Run as soon as the DOM has been loaded
    window.addEventListener(
      'DOMContentLoaded',
      function() {
        // Check if the CSS sheet is disabled by default
        for (let i = 0; i < document.styleSheets.length; i++) {
          disabled_css_hash[window.btoa(document.styleSheets[i].href)] = document.styleSheets[i].disabled;
        }

        // Create temporary stylesheet that will block early loading of resources we may want to block
        css_load_blocker = document.createElement('style');
        css_load_blocker.innerText = buildContentLoadBlockerCSS();
        css_load_blocker.className = '__tmp_chameleon_load_blocker';

        // Null check to fix error that triggers when loading PDF's in browser
        if (document.head != null) {
          document.head.appendChild(css_load_blocker);
        }

        // Create stylesheet that will contain our filtering CSS (if any is necessary)
        filter_sheet = document.createElement('style');
        filter_sheet.className = '__chameleon_filtered_exfil';
        filter_sheet.innerText = '';
        document.head.appendChild(filter_sheet);

        // Increment once before we scan, just in case decrement is called too quickly
        incrementSanitize();

        scan_css();
      },
      false
    );

    window.addEventListener(
      'load',
      function() {
        // Unload increment called before scan
        decrementSanitize();
      },
      false
    );
  },
};
