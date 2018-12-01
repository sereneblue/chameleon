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
		var _copyFromChannel = window.AudioBuffer.prototype.copyFromChannel;
		var _startRendering = window.OfflineAudioContext.prototype.startRendering;

		if (!window.parent["${randString}"]) {
			window["${randString}"] = {
				fuzz: Math.random() * 0.1,
				ran: false
			};
		}

		window.AudioBuffer.prototype.getChannelData = function (...args) {
			let c = _getChannelData.apply(this, args);

			if (!window["${randString}"].ran) {
				for (var i = 0; i < c.length; i += 100) {
					c[i] = c[i] + window["${randString}"].fuzz;
	            }
	            window["${randString}"].ran = true;
			}
			return c;
		}

		window.AudioBuffer.prototype.copyFromChannel = function (...args) {
			let c = this.getChannelData.apply(this, [args[1]]);
			this.copyToChannel(c, args[1]);

			return _copyFromChannel.apply(this, args);
		}

		window.AnalyserNode.prototype.getFloatFrequencyData = function (...args) {
			const result = _getFloatFrequencyData.apply(this, args);
			for (var i = 0; i < args[0].length; i += 50) {
				args[0][i] = args[0][i] + window["${randString}"];
			}
			return result;
		}

		window.OfflineAudioContext.prototype.startRendering = function (...args) {
            window["${randString}"].ran = false;
			return _startRendering.apply(this, args);
		}

		Object.defineProperty(window.AudioBuffer.prototype.getChannelData, "name", { value: "getChannelData" });
		Object.defineProperty(window.AudioBuffer.prototype.copyFromChannel, "name", { value: "copyFromChannel" });
		Object.defineProperty(window.OfflineAudioContext.prototype.startRendering, "name", { value: "startRendering" });
		Object.defineProperty(window.AnalyserNode.prototype.getFloatFrequencyData, "name", { value: "getFloatFrequencyData" });

		window.AudioBuffer.prototype.getChannelData.toString =
		window.AudioBuffer.prototype.getChannelData.toSource =
		window.AudioBuffer.prototype.getChannelData.toLocaleString = function () {
			return \\\`function getChannelData() {
    [native code]
}\\\`;
			};

		window.AudioBuffer.prototype.copyFromChannel.toString =
		window.AudioBuffer.prototype.copyFromChannel.toSource =
		window.AudioBuffer.prototype.copyFromChannel.toLocaleString = function () {
			return \\\`function copyFromChannel() {
    [native code]
}\\\`;
			};

		window.OfflineAudioContext.prototype.startRendering.toString =
		window.OfflineAudioContext.prototype.startRendering.toSource =
		window.OfflineAudioContext.prototype.startRendering.toLocaleString = function () {
			return \\\`function startRendering() {
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