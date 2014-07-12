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
		twoRepeats : function(buffer, channel, position, speed, samplesPerSegment) {
			var sampleValue = 0;

			position = (position % (samplesPerSegment / 2)) * speed; //TODO does it works ?

			if(buffer.length > position) {
				sampleValue = buffer.getSample(position, channel);
			}

			return sampleValue;
		},
		vinylStart : function(buffer, channel, position, speed, samplesPerSegment) {
			var sampleValue = 0;

			var ratio = position / samplesPerSegment;

			position = Math.sqrt(ratio) * samplesPerSegment * speed; //TODO does it works ?

			if(buffer.length > position) {
				sampleValue = buffer.getSample(position, channel);
			}

			return sampleValue;
		},
		vinylStop : function(buffer, channel, position, speed, samplesPerSegment) {
			var sampleValue = 0;

			var ratio = position / samplesPerSegment;

			position = Math.pow(1 - ratio, 2) * samplesPerSegment * speed; //TODO does it works

			if(buffer.length > position) {
				sampleValue = buffer.getSample(position, channel);
			}

			return sampleValue;
		}
	};

	Readers['default'] = Readers.normal;

	App.Readers = Readers;
})(App || {});