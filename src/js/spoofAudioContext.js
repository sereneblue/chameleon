/*
	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this file,
	You can obtain one at http://mozilla.org/MPL/2.0/.

	Copyright (c) 2018, ilGur https://mybrowseraddon.com/audiocontext-defender.html
	
	Alternatively, the contents of this file may be used under the terms
	of the GNU General Public License Version 3, as described below:

	This file is free software: you may copy, redistribute and/or modify
	it under the terms of the GNU General Public License as published by the
	Free Software Foundation, either version 3 of the License, or (at your
	option) any later version.

	This file is distributed in the hope that it will be useful, but
	WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
	Public License for more details.
*/

let spoofAudioContext = (randString) => {
	return `
		var _getChannelData = window.AudioBuffer.prototype.getChannelData;
		var _getFloatFrequencyData = window.AnalyserNode.prototype.getFloatFrequencyData;

		if (!window.parent["${randString}"]) {
			window["${randString}"] = Math.random() * 0.1;
		}

		window.AudioBuffer.prototype.getChannelData = function (...args) {
			let c = _getChannelData.apply(this, args);;

	        for (var i = 0; i < c.length; i += 100) {
              let index = Math.floor(Math.random() * i);
              c[index] = c[index] + window["${randString}"];
            }
			return c;
		}

		window.AnalyserNode.prototype.getFloatFrequencyData = function (...args) {
			const result = _getFloatFrequencyData.apply(this, arguments);
			for (var i = 0; i < arguments[0].length; i += 50) {
				let index = Math.floor(Math.random() * i);
				arguments[0][index] = arguments[0][index] + window["${randString}"];
			}
			return result;
		}

		Object.defineProperty(window.AudioBuffer.prototype.getChannelData, "name", { value: "getChannelData" });
		Object.defineProperty(window.AnalyserNode.prototype.getFloatFrequencyData, "name", { value: "getFloatFrequencyData" });

		window.AudioBuffer.prototype.getChannelData.toString =
		window.AudioBuffer.prototype.getChannelData.toSource =
		window.AudioBuffer.prototype.getChannelData.toLocaleString = function () {
			return \\\`function getChannelData() {
    [native code]
}\\\`;
			};

		window.AnalyserNode.prototype.getFloatFrequencyData.toString =
		window.AnalyserNode.prototype.getFloatFrequencyData.toSource =
		window.AnalyserNode.prototype.getFloatFrequencyData.toLocaleString = function () {
			return \\\`function getFloatFrequencyData() {
    [native code]
}\\\`;
			};
	`;
}