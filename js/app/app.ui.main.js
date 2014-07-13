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
		this.shapeElements = [];
		this.audioEngine = audioEngine;
		this.bufferBank = bufferBank;
		this.shapeManager = shapeManager;
		this.generateElements();
	};

	Main.prototype.generateElements = function() {
		this.container = document.getElementById('container');
		this.plusButton = createButton('plus', 'Add a shape', 'plus');
		this.startButton = createButton('start', 'Start', 'play');
		this.stopButton = createButton('stop', 'Stop', 'stop');
		this.startRecordingButton = createButton('startRecording', 'Record', 'circle');
		this.stopRecordingButton = createButton('stopRecording', 'Stop recording', 'circle-o');

		this.plusButton.addEventListener('click', this.plusHandler.bind(this));
		this.startButton.addEventListener('click', this.startHandler.bind(this));
		this.stopButton.addEventListener('click', this.stopHandler.bind(this));
		this.startRecordingButton.addEventListener('click', this.startRecordingHandler.bind(this));
		this.stopRecordingButton.addEventListener('click', this.stopRecordingHandler.bind(this));

		this.refreshButtons();

		var fragment = document.createDocumentFragment();

		fragment.appendChild(this.plusButton);
		fragment.appendChild(this.startButton);
		fragment.appendChild(this.stopButton);
		fragment.appendChild(this.startRecordingButton);
		fragment.appendChild(this.stopRecordingButton);

		this.buttons = document.getElementById('buttons');
		this.buttons.appendChild(fragment);

		this.panel = document.getElementById('panel');
	};

	Main.prototype.refreshButtons = function() {
		var recording = this.audioEngine.recording;
		var playing = this.audioEngine.playing;

		this.startButton.style.display = playing ? 'none' : '';
		this.stopButton.style.display = playing ? '' : 'none';
		this.startRecordingButton.style.display = recording ? 'none' : '';
		this.stopRecordingButton.style.display = recording ? '' : 'none';
	};

	Main.prototype.showPanel = function(element) {
		this.panel.innerHTML = '';
		this.panel.appendChild(element);
	};

	Main.prototype.shapeSelectionHandler = function(shape) {
		this.showPanel(shape.panel.element);

		console.log(shape.element);

		for(var i = 0; i < this.shapeElements.length; i++) {
			if(this.shapeElements[i] !== shape) {
				this.shapeElements[i].select(false);
			}
		}
	};

	Main.prototype.plusHandler = function() {
		var shape = this.shapeManager.add(1, 2, 'chroma03');
		var shapeElement = new App.UI.Shape(200, shape, this.container, this.shapeSelectionHandler.bind(this));
		this.shapeElements.push(shapeElement);
		this.container.appendChild(shapeElement.element);
		shapeElement.select(true);
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
	App.UI.createButton = createButton;
	App.UI.createLabelValue = createLabelValue;
	App.UI.createPopup = createPopup;
})(App || {});