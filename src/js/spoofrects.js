let spoofRects = () => {
	return `
		var _getBoundingClientRect = window.Element.prototype.getBoundingClientRect;
		window.Element.prototype.getBoundingClientRect = function (...args) {
			let fuzz = (val) => { return Number.isInteger(val) ? val : val + (Math.random() * (0.000000000010000)) };
			let c = _getBoundingClientRect.apply(this, args);

			c.x = fuzz(c.x);
			c.y = fuzz(c.y);
			c.width = fuzz(c.width);
			c.height = fuzz(c.height);
			c.left = c.x;
			c.right = c.x + c.width;
			c.top = c.y;
			c.bottom = c.y + c.height;

			return c;
		}

		window.Element.prototype.getClientRects = function () {
			return [this.getBoundingClientRect()];
		}

		window.Element.prototype.getClientRects.toString =
		window.Element.prototype.getClientRects.toSource =
		window.Element.prototype.getClientRects.toLocaleString = function () {
			return \\\`function getClientRects() {
    [native code]
}\\\`;
			};

		window.Element.prototype.getBoundingClientRect.toString =
		window.Element.prototype.getBoundingClientRect.toSource =
		window.Element.prototype.getBoundingClientRect.toLocaleString = function () {
			return \\\`function getBoundingClientRect() {
    [native code]
}\\\`;
			};
	`
}