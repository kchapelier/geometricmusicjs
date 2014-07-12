(function(App) {
	"use strict";

	var AudioEngine = function(bufferSize) {
		this.playing = false;
		this.recording = false;
		this.sampleRate = Aural.Utils.Support.getSampleRate();
		this.bufferSize = bufferSize || 1024;
		this.shapeCollection = [];

		this.setBpm(120);

		this.audioContext = Aural.Utils.Support.getAudioContext();
		this.node = this.audioContext.createScriptProcessor(this.bufferSize, 0, 1);
		this.node.onaudioprocess = this.audioProcessHandler.bind(this);
		this.node.connect(this.audioContext.destination);
	};

	AudioEngine.prototype.shapeCollection = null;
	AudioEngine.prototype.audioContext = null;
	AudioEngine.prototype.sampleRate = null;
	AudioEngine.prototype.bufferSize = null;
	AudioEngine.prototype.node = null;
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
			channel,
			channelData,
			sample,
			sampleValue;

		for (channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
			channelData = outputBuffer.getChannelData(channel);

			for (sample = 0; sample < outputBuffer.length; sample++) {
				sampleValue = this.playing ? this.getSampleValue(channel, sample) : 0;

				channelData[sample] = sampleValue;
			}
		}
	};

	AudioEngine.prototype.getSampleValue = function(channel, sample) {
		var sampleValue = 0,
			shapeIndex,
			shape;

		for(shapeIndex = 0; shapeIndex < this.shapeCollection.length; shapeIndex++) {
			shape = this.shapeCollection[shapeIndex];

			sampleValue+= shape.getNextSample(channel, this.samplesPerMeasure);
		}

		return sampleValue;
	};

	AudioEngine.prototype.start = function() {
		this.playing = true;
	};

	AudioEngine.prototype.stop = function() {
		this.stopRecording();
		this.playing = false;
	};

	AudioEngine.prototype.startRecording = function() {
		if(!this.recorder) {
			this.recorder = new Recorder(this.node, {
				workerPath : 'js/vendors/recorderjs/recorderWorker.js',
				bufferLen : 4096
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