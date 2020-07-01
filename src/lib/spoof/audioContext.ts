export default {
  type: 'custom',
  data: `
		if (
			window.AudioContext &&
			window.OfflineAudioContext
		) {
			let _copyFromChannel = window.AudioBuffer.prototype.copyFromChannel;
			let _getChannelData = window.AudioBuffer.prototype.getChannelData;
			let _getFloatFrequencyData = window.AnalyserNode.prototype.getFloatFrequencyData;

			let audioContextCache = new WeakMap();

			window.AudioBuffer.prototype.getChannelData = function(...args) {
				let isEmpty = true;
				let c = _getChannelData.apply(this, args);
				
				if (audioContextCache.has(c)) {
					return audioContextCache.get(c);
				}

				let tmp = new Float32Array(c);
				
				for (let i = 0; i < tmp.length; i++) {
					if (tmp[i] !== 0){
						isEmpty = false;
						tmp[i] = tmp[i] + CHAMELEON_SPOOF.get(window).audioContextSeed;
					}
				}

				if (!isEmpty) {
					audioContextCache.set(c, tmp);
				}

				return tmp;
			}

			modifiedAPIs.push([
				window.AudioBuffer.prototype.getChannelData, "getChannelData"
			]);

			window.AudioBuffer.prototype.copyFromChannel = function(...args) {
				c = this.getChannelData(args[1]);

				if (arguments.length === 3) {
					this.copyToChannel(c, args[1], args[2]);
				} else {
					this.copyToChannel(c, args[1]);
				}

				_copyFromChannel.apply(this, args);
			}

			modifiedAPIs.push([
				window.AudioBuffer.prototype.copyFromChannel, "copyFromChannel"
			]);
	}`,
};
