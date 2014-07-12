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
		}
	};

	Readers['default'] = Readers.normal;

	App.Readers = Readers;
})(App || {});