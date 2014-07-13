(function(App) {
	"use strict";

	//TODO prototype properties for most of the objects here are not properly declared (¬‿¬)

	var ShapeSvg = function(width, shapeUi) {
		this.shapeUi = shapeUi;
		this.svg = new Snap(width, width);
		this.width = width;
		this.refresh();
	};

	ShapeSvg.prototype.createShape = function() {
		var w = this.width,
			p = this.shapeUi.shape.segmentsNumber,
			c = w / 2,
			r = (this.width - 2) / (4 - this.shapeUi.shape.size / 2),
			points;

		var shape;

		if(p === 1) {
			shape = this.svg.circle(c, c, r - c / 3);
		} else if(p === 2) {
			// out of desperation, draw a narrow losange
			points = [c + r, c, c, c - r / 4, c - r, c, c, c + r / 4];

			shape = this.svg.polygon(points);
		} else {
			points = [];

			r = r - 3 * p - 3;

			for (var cp = 0; cp < p; cp++) {
				points.push(c + r * Math.sin(cp * Math.PI / p * 2));
				points.push(c + r * Math.cos(cp * Math.PI / p * 2));
			}

			shape = this.svg.polygon(points);
		}

		return shape;
	};

	ShapeSvg.prototype.refresh = function() {
		if(this.shapeNode) {
			this.shapeNode.remove();
		}

		this.shapeNode = this.createShape().attr({
			fill: "#000",
			fillOpacity : 0,
			stroke: "#000",
			strokeWidth: 2
		});

		//TODO set the element size to the polygon/circle size
		//actually, the only way to fix the clicks is to make all the polygons in a single svg context.
	};

	ShapeSvg.prototype.fill = function(animate) {
		if(animate) {
			this.shapeNode.animate({
				fillOpacity: 1,
				strokeWidth: 1
			}, 250);
		} else {
			this.shapeNode.attr({
				fillOpacity: 1,
				strokeWidth: 1
			});
		}
	};

	ShapeSvg.prototype.unfill = function(animate) {
		if(animate) {
			this.shapeNode.animate({
				fillOpacity: 0,
				strokeWidth : 2
			}, 200);
		} else {
			this.shapeNode.attr({
				fillOpacity: 0,
				strokeWidth : 2
			});
		}
	};

	var ShapePanel = function(shapeUi, bufferCollection) {
		this.shapeUi = shapeUi;
		this.bufferCollection = bufferCollection;
		this.createElement();
		this.setEvents();
	};

	ShapePanel.prototype.createElement = function() {
		var element = document.createElement('div');
		element.className = 'details';

		this.sample = App.UI.createLabelValue('sample', 'Sample', '---');
		this.size = App.UI.createLabelValue('size', 'Size', this.shapeUi.shape.size);
		this.segmentsNumber = App.UI.createLabelValue('segmentsNumber', 'Segments', this.shapeUi.shape.segmentsNumber);
		this.tuning = App.UI.createLabelValue('tuning', 'Tuning', this.shapeUi.shape.tuning + ' semitone' + (Math.abs(this.shapeUi.shape.tuning) > 1 ? 's' : ''));

		element.appendChild(this.sample);
		element.appendChild(this.size);
		element.appendChild(this.segmentsNumber);
		element.appendChild(this.tuning);

		this.readers = [];

		for(var i = 0; i < 8; i++) {
			var r = App.UI.createLabelValue('reader', 'Vector ' + (i + 1), 'default');
			element.appendChild(r);

			if(this.shapeUi.shape.size < i) {
				r.style.opacity = 0;
			}

			this.readers.push(r);
		}

		this.element = element;
	};

	ShapePanel.prototype.setEvents = function() {
		this.tuning.addEventListener('click', function() {
			this.shapeUi.shape.setTuning((this.shapeUi.shape.tuning + 13) % 25 + 1 - 13);
			this.tuning.setValue(this.shapeUi.shape.tuning + ' semitone' + (Math.abs(this.shapeUi.shape.tuning) > 1 ? 's' : ''));
		}.bind(this));

		this.size.addEventListener('click', function() {
			this.shapeUi.shape.setSize((this.shapeUi.shape.size) % 4 + 1);
			this.size.setValue(this.shapeUi.shape.size);
			this.shapeUi.refresh();
		}.bind(this));

		this.segmentsNumber.addEventListener('click', function() {
			var oldNumber = this.shapeUi.shape.segmentsNumber;
			this.shapeUi.shape.setSegmentsNumber((this.shapeUi.shape.segmentsNumber) % 8 + 1);
			this.segmentsNumber.setValue(this.shapeUi.shape.segmentsNumber);

			for(var i = 0; i < this.readers.length; i++) {
				if(i < this.shapeUi.shape.segmentsNumber) {
					this.readers[i].style.opacity = 1;

					if(i >= oldNumber) {
						this.readers[i].setValue('default');
					}
				} else {
					this.readers[i].style.opacity = 0;
				}
			}

			this.shapeUi.refresh();
		}.bind(this));

		var samplesKey = Object.keys(this.bufferCollection);
		var currentSample = -1;

		this.sample.addEventListener('click', function() {
			currentSample = (currentSample + 1) % samplesKey.length;
			var sampleId = samplesKey[currentSample];
			this.shapeUi.shape.setAudioBuffer(this.bufferCollection[sampleId]);
			this.sample.setValue(sampleId);
		}.bind(this));

		var readersKey = Object.keys(App.Readers);
		readersKey.splice(readersKey.indexOf('default'), 1);

		this.readers.forEach(function(r, index) {
			var currentReader = readersKey.indexOf('normal');
			r.addEventListener('click', function() {
				currentReader = (currentReader + 1) % readersKey.length;
				var readerId = readersKey[currentReader];
				this.shapeUi.shape.setSegmentReader(index, App.Readers[readerId]);
				r.setValue(readerId);
			}.bind(this));
		}.bind(this));
	};

	var Shape = function(width, shape, container, bufferCollection, selectionCallback) {
		this.createElement(width, container);
		this.shape = shape;
		this.selected = false;
		this.svg = new ShapeSvg(width, this);
		this.panel = new ShapePanel(this, bufferCollection);
		this.element.appendChild(this.svg.svg.node);
		this.draggable = new Draggabilly(this.element, {
			containment : container,
			handle : 'polygon, circle'
		});

		this.selectionCallback = selectionCallback;

		this.setEvents();
	};

	Shape.prototype.createElement = function(width, container) {
		this.element = document.createElement('div');
		this.element.className = 'shape';
		this.element.style.position = 'absolute';
		this.element.style.top = Math.floor((container.offsetHeight - width) / 2) + 'px';
		this.element.style.left = Math.floor((container.offsetWidth - width) / 2) + 'px';
		this.element.style.width = width + 'px';
		this.element.style.height = width + 'px';
	};

	Shape.prototype.setNodeEvent = function() {
		this.svg.shapeNode.node.addEventListener('mousedown', function() {
			this.select(true);
		}.bind(this));
	};

	Shape.prototype.setEvents = function() {
		this.setNodeEvent();

		this.draggable.on('dragMove', function(d, e) {
			var pan = Math.min(Math.max(0, d.position.x / (d.containerSize.innerWidth - d.size.width)), 1) * 2 -1;
			var gain = 1 - Math.min(Math.max(0, d.position.y / (d.containerSize.innerHeight - d.size.height)), 1);
			this.shape.setGain(gain).setPan(pan);
		}.bind(this));
	};

	Shape.prototype.select = function(selected) {
		if(selected !== this.selected) {
			if (selected) {
				this.svg.fill(true);
				this.selected = true;

				if(typeof this.selectionCallback === 'function') {
					this.selectionCallback(this);
				}
			} else {
				this.svg.unfill(true);
				this.selected = false;
			}
		}
	};

	Shape.prototype.refresh = function() {
		this.svg.refresh();
		this.draggable.setHandles();
		this.setNodeEvent();

		if(this.selected) {
			this.svg.fill(false);
		} else {
			this.svg.unfill(false);
		}
	};

	App.UI = App.UI || {};
	App.UI.Shape = Shape;
})(App || {});