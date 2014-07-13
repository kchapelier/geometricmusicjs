(function(App) {
	"use strict";

	var AudioEngine = function(bufferSize) {
		this.playing = false;
		this.recording = false;
		this.sampleRate = Aural.Utils.Support.getSampleRate();
		this.bufferSize = bufferSize || 4096;
		this.shapeCollection = [];

		this.setBpm(120);

		this.audioContext = Aural.Utils.Support.getAudioContext();
		this.compressor = this.audioContext.createDynamicsCompressor();
		this.compressor.attack.value = 0.01;
		this.compressor.threshold.value = -24;
		this.compressor.knee.value = 35;
		this.processor = this.audioContext.createScriptProcessor(this.bufferSize, 0, 2);
		this.processor.onaudioprocess = this.audioProcessHandler.bind(this);
		this.processor.connect(this.compressor);
	};

	AudioEngine.prototype.shapeCollection = null;
	AudioEngine.prototype.audioContext = null;
	AudioEngine.prototype.sampleRate = null;
	AudioEngine.prototype.bufferSize = null;
	AudioEngine.prototype.processor = null;
	AudioEngine.prototype.compressor = null;
	AudioEngine.prototype.playing = null;
	AudioEngine.prototype.recording = null;
	AudioEngine.prototype.bpm = null;
	AudioEngine.prototype.samplesPerMeasure = null;
	AudioEngine.prototype.recorder = null;

	AudioEngine.prototype.setBpm = function(bpm) {
		this.bpm = Math.min(999, Math.max(10, bpm));
		this.samplesPerMeasure = this.sampleRate * 60 / this.bpm;
	};

	AudioEngine.prototype.setShapeCollection = function(array) {
		this.shapeCollection = array;
	};

	AudioEngine.prototype.audioProcessHandler = function(e) {
		var outputBuffer = e.outputBuffer,
			sample,
			sampleValues;

		var channelLeft = outputBuffer.getChannelData(0);
		var channelRight = outputBuffer.getChannelData(1);

		for (sample = 0; sample < outputBuffer.length; sample++) {
			sampleValues = this.playing ? this.getSampleValues(sample) : 0;

			channelLeft[sample] = sampleValues[0];
			channelRight[sample] = sampleValues[1];
		}
	};

	AudioEngine.prototype.getSampleValues = function(sample) {
		var sampleValues = [0, 0],
			shapeIndex,
			shape;

		for(shapeIndex = 0; shapeIndex < this.shapeCollection.length; shapeIndex++) {
			shape = this.shapeCollection[shapeIndex];

			var shapeValues = shape.getNextSamples(this.samplesPerMeasure);

			sampleValues[0]+= shapeValues[0];
			sampleValues[1]+= shapeValues[1];
		}

		return sampleValues;
	};

	AudioEngine.prototype.start = function() {
		this.playing = true;
		this.compressor.connect(this.audioContext.destination);
	};

	AudioEngine.prototype.stop = function() {
		this.stopRecording();
		this.playing = false;
		this.compressor.disconnect(this.audioContext.destination);
	};

	AudioEngine.prototype.startRecording = function() {
		if(!this.recorder) {
			this.recorder = new Recorder(this.compressor, {
				workerPath : 'js/vendors/recorderjs/recorderWorker.js',
				bufferLen : 4096 * 2
			});
		}

		this.recorder.record();
		this.recording = true;
	};

	AudioEngine.prototype.stopRecording = function() {
		if(this.recorder && this.recording) {
			this.recorder.stop();

			this.recorder.exportWAV(function(blob) {
				if(blob) {
					Recorder.forceDownload(blob);
				}
			});

			this.recorder.clear();
			this.recording = false;
		}
	};

	App.AudioEngine = AudioEngine;
})(App || {});