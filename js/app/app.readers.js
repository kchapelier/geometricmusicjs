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
			position = position * speed;
			return read(buffer, channel, position);
		},
		reverse : function(buffer, channel, position, speed, samplesPerSegment) {
			position = (samplesPerSegment - position) * speed;
			return read(buffer, channel, position);
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
			var ratio = position / samplesPerSegment;
			position = Math.pow(ratio, 5/6) * samplesPerSegment * speed; //TODO doesnt work too well
			return read(buffer, channel, position);
		},
		vinylStop : function(buffer, channel, position, speed, samplesPerSegment) {
			var ratio = position / samplesPerSegment;
			position = Math.pow(1 - ratio, 6/5) * samplesPerSegment * speed; //TODO doesnt work too well
			return read(buffer, channel, position);
		}
	};

	Readers['default'] = Readers.normal;

	App.Readers = Readers;
})(App || {});