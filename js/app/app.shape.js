(function(App) {
	"use strict";

	var arrayResize = function(array, size, filler) {
		var delta = size - array.length;
		if(delta > 0) {
			for(var i = 0; i < delta; i++) {
				array.push(filler); //pad with filler
			}
		} else {
			array.splice(size, -delta); //remove {delta} excedentary elements
		}
	};

	var Shape = function(size, segmentsNumber, audioBuffer) {
		this.currentSegmentPosition = 0;
		this.currentSegment = 0;
		this.segmentsReaders = [];

		this.setTuning(0);
		this.setPan(0);
		this.setGain(0.5);

		this.setAudioBuffer(audioBuffer);
		this.setSegmentsNumber(segmentsNumber);
		this.setSize(size);
	};

	Shape.prototype.gain = null; //volume (0 : silent, 1 : loud)
	Shape.prototype.pan = null; //pan (-1 : hard left, 0 : center, 1 : hard right)
	Shape.prototype.size = null; // number of measures (1 : 1, 2 : 2, 3 ; 4, 4 : 8)
	Shape.prototype.tuning = null; // tuning in semitones (negative : lower pitch, positive : higher pitch)
	Shape.prototype.speed = null; // sample reading speed, calculated from the tuning

	Shape.prototype.segmentsNumber = null;
	Shape.prototype.segmentsReaders = null;
	Shape.prototype.audioBuffer = null;

	Shape.prototype.currentSegment = null;
	Shape.prototype.currentSegmentPosition = null;

	Shape.prototype.leftGain = null;
	Shape.prototype.rightGain = null;

	Shape.prototype.calculateStereoGain = function() {
		this.leftGain = this.gain * ( 1 - Math.max(-0.1, this.pan) * 0.9);
		this.rightGain = this.gain * ( 1 + Math.min(0.1, this.pan) * 0.9);

		return this;
	};

	Shape.prototype.setAudioBuffer = function(audioBuffer) {
		this.audioBuffer = audioBuffer;

		return this;
	};


	Shape.prototype.setSize = function(size) {
		this.size = Math.max(1, size);

		return this;
	};

	Shape.prototype.setTuning = function(semitones) {
		this.tuning = semitones;
		this.speed = 1 * (Math.pow(2, semitones / 12));

		return this;
	};

	Shape.prototype.setGain = function(gain) {
		this.gain = Math.min(1, Math.max(0, gain));
		this.calculateStereoGain();

		return this;
	};

	Shape.prototype.setPan = function(pan) {
		this.pan = Math.min(1, Math.max(-1, pan));
		this.calculateStereoGain();

		return this;
	};

	Shape.prototype.setSegmentsNumber = function(number) {
		this.segmentsNumber = Math.max(1, number);
		arrayResize(this.segmentsReaders, this.segmentsNumber, App.Readers['default']);

		return this;
	};

	Shape.prototype.setSegmentReader = function(index, reader) {
		reader = typeof reader === 'function' ? reader : App.Readers.silent;
		index = Math.max(0, Math.min(index, this.segmentsNumber - 1));
		this.segmentsReaders[index] = reader;

		return this;
	};

	Shape.prototype.getNextSamples = function(samplesPerMeasure) {
		//TODO PERF: do this out of the audio loop
		var samplesPerSegment = samplesPerMeasure * Math.pow(2, this.size - 1) / this.segmentsNumber;

		var reader = this.segmentsReaders[this.currentSegment];

		var sampleValue = [0,0];

		if(reader && this.audioBuffer) {
			sampleValue[0] = reader(
				this.audioBuffer,
				0,
				this.currentSegmentPosition,
				this.speed,
				samplesPerSegment
			) * this.leftGain;

			sampleValue[1] = reader(
				this.audioBuffer,
				1,
				this.currentSegmentPosition,
				this.speed,
				samplesPerSegment
			) * this.rightGain;
		}

		this.currentSegmentPosition++;

		if(this.currentSegmentPosition > samplesPerSegment) {
			this.currentSegmentPosition = this.currentSegmentPosition % samplesPerSegment;

			this.currentSegment = (this.currentSegment + 1) % this.segmentsNumber;
		}

		return sampleValue;
	};

	App.Shape = Shape;
})(App || {});