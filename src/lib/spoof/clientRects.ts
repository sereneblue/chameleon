export default {
  type: 'custom',
  data: `
    let _getBoundingClientRect = window.Element.prototype.getBoundingClientRect;
		let _getClientRects = window.Element.prototype.getClientRects;
		let _rgetBoundingClientRect = window.Range.prototype.getBoundingClientRect;
    let _rgetClientRects = window.Range.prototype.getClientRects;
    
		let _fuzzer = (val) => {
			return Number.isInteger(val) ? val : val + CHAMELEON_SPOOF.get(window).clientRectsSeed;
		};

		window.Element.prototype.getBoundingClientRect = function() {
			let c = _getBoundingClientRect.apply(this);

			c.x = c.left = _fuzzer(c.x);
			c.y = c.top = _fuzzer(c.y);
			c.width = _fuzzer(c.width);
			c.height = _fuzzer(c.height);

			return c;
		}

		window.Element.prototype.getClientRects = function() {
			let a = _getClientRects.apply(this);
			let b = this.getBoundingClientRect();
			
			for (let p in a[0]) {
				a[0][p] = b[p];
			}

			return a;
		}

		window.Range.prototype.getBoundingClientRect = function() {
			let r = _rgetBoundingClientRect.apply(this);

			r.x = r.left = _fuzzer(r.x);
			r.y = r.top = _fuzzer(r.y);
			r.width = _fuzzer(r.width);
			r.height = _fuzzer(r.height);

			return r;
		}

		window.Range.prototype.getClientRects = function() {
			let a = _rgetClientRects.apply(this);
			let b = this.getBoundingClientRect();
			
			for (let p in a[0]) {
				a[0][p] = b[p];
			}

			return a;
		}
  `,
};
