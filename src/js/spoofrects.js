let spoofRects = (randString) => {
	return `
		var _getBoundingClientRect = window.Element.prototype.getBoundingClientRect;
		var _rgetBoundingClientRect = window.Range.prototype.getBoundingClientRect;

		if (!window.parent["${randString}"]) {
			window["${randString}"] = Math.random() * 0.000000001000000;
		}

		let _fuzzer = (val) => {
			return Number.isInteger(val) ? val : val + (!window.parent["${randString}"] ? window["${randString}"] : window.parent["${randString}"]);
		};

		window.Element.prototype.getBoundingClientRect = function (...args) {
			let c = _getBoundingClientRect.apply(this, args);

			c.x = c.left = _fuzzer(c.x);
			c.y = c.top = _fuzzer(c.y);
			c.width = _fuzzer(c.width);
			c.height = _fuzzer(c.height);
			c.right = c.x + c.width;
			c.bottom = c.y + c.height;

			return c;
		}

		window.Element.prototype.getClientRects = function () {
			return [this.getBoundingClientRect()];
		}

		window.Range.prototype.getBoundingClientRect = function (...args) {
			let r = _rgetBoundingClientRect.apply(this, args);

			r.x = r.left = _fuzzer(r.x);
			r.y = r.top = _fuzzer(r.y);
			r.width = _fuzzer(r.width);
			r.height = _fuzzer(r.height);
			r.right = r.x + r.width;
			r.bottom = r.y + r.height;

			return r;
		}

		window.Range.prototype.getClientRects = function () {
			return [this.getBoundingClientRect()];
		}

		window.Element.prototype.getClientRects.toString =
		window.Element.prototype.getClientRects.toSource =
		window.Element.prototype.getClientRects.toLocaleString =
		window.Range.prototype.getClientRects.toString =
		window.Range.prototype.getClientRects.toSource =
		window.Range.prototype.getClientRects.toLocaleString = function () {
			return \\\`function getClientRects() {
    [native code]
}\\\`;
			};

		window.Element.prototype.getBoundingClientRect.toString =
		window.Element.prototype.getBoundingClientRect.toSource =
		window.Element.prototype.getBoundingClientRect.toLocaleString =
		window.Range.prototype.getBoundingClientRect.toString =
		window.Range.prototype.getBoundingClientRect.toSource =
		window.Range.prototype.getBoundingClientRect.toLocaleString = function () {
			return \\\`function getBoundingClientRect() {
    [native code]
}\\\`;
			};
	`
}