export default {
  type: 'custom',
  data: `
    let _getBoundingClientRect = spoofContext.Element.prototype.getBoundingClientRect;
		let _getClientRects = spoofContext.Element.prototype.getClientRects;
		let _rgetBoundingClientRect = spoofContext.Range.prototype.getBoundingClientRect;
    let _rgetClientRects = spoofContext.Range.prototype.getClientRects;
    
		let _fuzzer = (val) => {
			return Number.isInteger(val) ? val : val + CHAMELEON_SPOOF.get(spoofContext).clientRectsSeed;
		};

		spoofContext.Element.prototype.getBoundingClientRect = function() {
			let c = _getBoundingClientRect.apply(this);

			c.x = c.left = _fuzzer(c.x);
			c.y = c.top = _fuzzer(c.y);
			c.width = _fuzzer(c.width);
			c.height = _fuzzer(c.height);

			return c;
		}

		modifiedAPIs.push([
			spoofContext.Element.prototype.getBoundingClientRect, "getBoundingClientRect"
		]);

		spoofContext.Element.prototype.getClientRects = function() {
			let a = _getClientRects.apply(this);
			let b = this.getBoundingClientRect();
			
			for (let p in a[0]) {
				a[0][p] = b[p];
			}

			return a;
		}

		modifiedAPIs.push([
			spoofContext.Element.prototype.getClientRects, "getClientRects"
		]);

		spoofContext.Range.prototype.getBoundingClientRect = function() {
			let r = _rgetBoundingClientRect.apply(this);

			r.x = r.left = _fuzzer(r.x);
			r.y = r.top = _fuzzer(r.y);
			r.width = _fuzzer(r.width);
			r.height = _fuzzer(r.height);

			return r;
		}

		modifiedAPIs.push([
			spoofContext.Range.prototype.getBoundingClientRect, "getBoundingClientRect"
		]);

		spoofContext.Range.prototype.getClientRects = function() {
			let a = _rgetClientRects.apply(this);
			let b = this.getBoundingClientRect();
			
			for (let p in a[0]) {
				a[0][p] = b[p];
			}

			return a;
		}

		modifiedAPIs.push([
			spoofContext.Range.prototype.getClientRects, "getClientRects"
		]);
  `,
};
