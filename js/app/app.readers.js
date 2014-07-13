(function(App) {
	"use strict";

	var Readers = {
		silent : function(buffer, channel, position, speed, samplesPerSegment) {
			return 0;
		},
		normal : function(buffer, channel, position, speed, samplesPerSegment) {
			var sampleValue = 0;

			position = position * speed;

			if(buffer.length > position) {
				sampleValue = buffer.getSample(position, channel);
			}

			return sampleValue;
		},
		reverse : function(buffer, channel, position, speed, samplesPerSegment) {
			var sampleValue = 0;

			position = (samplesPerSegment - position) * speed;

			if(buffer.length > position) {
				sampleValue = buffer.getSample(position, channel);
			}

			return sampleValue;
		},
		loopback : function(buffer, channel, position, speed, samplesPerSegment) {
			var sampleValue = 0;

			position = (position < samplesPerSegment / 2 ? position : samplesPerSegment - position) * speed;

			if(buffer.length > position) {
				sampleValue = buffer.getSample(position, channel);
			}

			return sampleValue;
		},
		twoRepeats : function(buffer, channel, position, speed, samplesPerSegment) {
			var sampleValue = 0;

			position = (position % (samplesPerSegment / 2)) * speed;

			if(buffer.length > position) {
				sampleValue = buffer.getSample(position, channel);
			}

			return sampleValue;
		},
		threeRepeats : function(buffer, channel, position, speed, samplesPerSegment) {
			var sampleValue = 0;

			position = (position % (samplesPerSegment / 3)) * speed;

			if(buffer.length > position) {
				sampleValue = buffer.getSample(position, channel);
			}

			return sampleValue;
		},
		vinylStart : function(buffer, channel, position, speed, samplesPerSegment) {
			var sampleValue = 0;

			var ratio = position / samplesPerSegment;

			position = Math.pow(ratio, 5/6) * samplesPerSegment * speed; //TODO does it works ?

			if(buffer.length > position) {
				sampleValue = buffer.getSample(position, channel);
			}

			return sampleValue;
		},
		vinylStop : function(buffer, channel, position, speed, samplesPerSegment) {
			var sampleValue = 0;

			var ratio = position / samplesPerSegment;

			position = Math.pow(1 - ratio, 6/5) * samplesPerSegment * speed; //TODO does it works

			if(buffer.length > position) {
				sampleValue = buffer.getSample(position, channel);
			}

			return sampleValue;
		}
	};

	Readers['default'] = Readers.normal;

	App.Readers = Readers;
})(App || {});