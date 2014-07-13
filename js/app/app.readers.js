(function(App) {
	"use strict";

	var read = function(buffer, channel, position) {
		var sampleValue = 0;

		if(buffer.length > position) {
			sampleValue = buffer.getSample(position, channel);
		}

		return sampleValue;
	};

	var Readers = {
		silent : function(buffer, channel, position, speed, samplesPerSegment) {
			return 0;
		},
		normal : function(buffer, channel, position, speed, samplesPerSegment) {
			var gain = Math.min(1, (samplesPerSegment - position) / 50);
			position = position * speed;
			return read(buffer, channel, position) * gain;
		},
		reverse : function(buffer, channel, position, speed, samplesPerSegment) {
			var gain = Math.min(1, position / 50);
			position = (samplesPerSegment - position) * speed;
			return read(buffer, channel, position) * gain;
		},
		loopback : function(buffer, channel, position, speed, samplesPerSegment) {
			position = (position < samplesPerSegment / 2 ? position : samplesPerSegment - position) * speed;
			return read(buffer, channel, position);
		},
		twoRepeats : function(buffer, channel, position, speed, samplesPerSegment) {
			position = (position % (samplesPerSegment / 2)) * speed;
			return read(buffer, channel, position);
		},
		threeRepeats : function(buffer, channel, position, speed, samplesPerSegment) {
			position = (position % (samplesPerSegment / 3)) * speed;
			return read(buffer, channel, position);
		},
		vinylStart : function(buffer, channel, position, speed, samplesPerSegment) {
			var gain = Math.min(1, (samplesPerSegment - position) / 50);
			var ratio = position / samplesPerSegment;
			position = Math.pow(ratio, 5/6) * samplesPerSegment * speed; //TODO doesnt work too well
			return read(buffer, channel, position) * gain;
		},
		vinylStop : function(buffer, channel, position, speed, samplesPerSegment) {
			var gain = Math.min(1, (samplesPerSegment - position) / 50);
			var ratio = position / samplesPerSegment;
			position = Math.pow(1 - ratio, 6/5) * samplesPerSegment * speed; //TODO doesnt work too well
			return read(buffer, channel, position) * gain;
		}
	};

	Readers['default'] = Readers.normal;

	App.Readers = Readers;
})(App || {});