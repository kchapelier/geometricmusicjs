(function(App) {
	"use strict";

	var createButton = function(className, label, icon) {
		var button = document.createElement('button');
		button.className = className;

		if(icon) {
			var i = document.createElement('i');
			i.className = 'fa fa-' + icon + ' fa-sw';
			button.appendChild(i);
		}

		var span = document.createElement('span');
		span.innerText = label;
		button.appendChild(span);

		return button;
	};

	var createLabelValue = function(className, label, value) {
		var span = document.createElement('span');
		span.className = 'label-value ' + className;
		var spanLabel = document.createElement('span');
		spanLabel.className = 'label';
		spanLabel.innerText = label + ' : ';
		span.appendChild(spanLabel);
		var spanValue = document.createElement('span');
		spanValue.className = 'value';
		spanValue.innerText = value;
		span.appendChild(spanValue);

		span.setValue = function(value) {
			spanValue.innerText = value;
		};

		return span;
	};

	var createPopup = function(className, content) {
		var popup = document.createElement('div');
		popup.className = 'popup ' + className;
		var contentDiv = document.createElement('div');
		contentDiv.className = 'content';
		contentDiv.appendChild(content);
		popup.appendChild(contentDiv);

		return popup;
	};

	var Main = function(audioEngine, bufferBank, shapeManager) {
		this.audioEngine = audioEngine;
		this.bufferBank = bufferBank;
		this.shapeManager = shapeManager;
		this.generateElements();
	};

	Main.prototype.generateElements = function() {
		this.startButton = createButton('start', 'Start', 'play');
		this.stopButton = createButton('stop', 'Stop', 'stop');
		this.startRecordingButton = createButton('startRecording', 'Record', 'circle');
		this.stopRecordingButton = createButton('stopRecording', 'Stop recording', 'circle-o');

		this.startButton.addEventListener('click', this.startHandler.bind(this));
		this.stopButton.addEventListener('click', this.stopHandler.bind(this));
		this.startRecordingButton.addEventListener('click', this.startRecordingHandler.bind(this));
		this.stopRecordingButton.addEventListener('click', this.stopRecordingHandler.bind(this));

		this.refreshButtons();

		var fragment = document.createDocumentFragment();

		fragment.appendChild(this.startButton);
		fragment.appendChild(this.stopButton);
		fragment.appendChild(this.startRecordingButton);
		fragment.appendChild(this.stopRecordingButton);

		var buttons = document.getElementById('buttons');
		buttons.appendChild(fragment);
	};

	Main.prototype.refreshButtons = function() {
		var recording = this.audioEngine.recording;
		var playing = this.audioEngine.playing;

		this.startButton.style.display = playing ? 'none' : '';
		this.stopButton.style.display = playing ? '' : 'none';
		this.startRecordingButton.style.display = recording ? 'none' : '';
		this.stopRecordingButton.style.display = recording ? '' : 'none';
	};

	Main.prototype.startHandler = function() {
		this.audioEngine.start();
		this.refreshButtons();
	};

	Main.prototype.stopHandler = function() {
		this.audioEngine.stop();
		this.refreshButtons();
	};

	Main.prototype.startRecordingHandler = function() {
		this.audioEngine.startRecording();
		this.refreshButtons();
	};

	Main.prototype.stopRecordingHandler = function() {
		this.audioEngine.stopRecording();
		this.refreshButtons();
	};



	App.UI = App.UI || {};
	App.UI.Main = Main;
})(App || {});