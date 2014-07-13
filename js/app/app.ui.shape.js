(function(App) {
	"use strict";

	//TODO prototype properties for most of the objects here are not properly declared (¬‿¬)

	var ShapeSvg = function(width, shape) {
		this.shape = shape;
		this.svg = new Snap(width, width);
		this.width = width;
		this.refresh();
	};

	ShapeSvg.prototype.createShape = function() {
		var w = this.width,
			p = this.shape.segmentsNumber,
			c = w / 2,
			r = (this.width - 2) / (this.shape.size + 1);

		var shape;

		if(p === 1) {
			shape = this.svg.circle(c, c, r - c / 5);
		} else if(p === 2) {
			// out of desperation, draw a narrow losange
			var points = [c + r, c, c, c - r / 4, c - r, c, c, c + r / 4];

			shape = this.svg.polygon(points);
		} else {
			var points = [];

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
		this.shape = this.createShape().attr({
			fill: "#000",
			fillOpacity : 0,
			stroke: "#000",
			strokeWidth: 4
		});

		//TODO set the element size to the polygon/circle size
	};

	ShapeSvg.prototype.fill = function() {
		this.shape.animate({
			fillOpacity: 1,
			strokeWidth : 1
		}, 250);
	};

	ShapeSvg.prototype.unfill = function() {
		this.shape.animate({
			fillOpacity: 0,
			strokeWidth : 4
		}, 200);
	};

	var ShapePanel = function(shape, svg) {
		this.shape = shape;
		this.svg = svg;
		this.createElement();
		this.setEvents();
	};

	ShapePanel.prototype.createElement = function() {
		var element = document.createElement('div');
		element.className = 'details';

		this.size = App.UI.createLabelValue('size', 'Size', this.shape.size);
		this.segmentsNumber = App.UI.createLabelValue('segmentsNumber', 'Segments', this.shape.segmentsNumber);
		this.tuning = App.UI.createLabelValue('tuning', 'Tuning', this.shape.tuning + ' semitone' + (this.shape.tuning > 1 ? 's' : ''));

		element.appendChild(this.size);
		element.appendChild(this.segmentsNumber);
		element.appendChild(this.tuning);

		this.element = element;
	};

	ShapePanel.prototype.setEvents = function() {
		this.tuning.addEventListener('click', function() {
			this.shape.setTuning((this.shape.tuning + 13) % 25 + 1 - 13);
			this.tuning.setValue(this.shape.tuning + ' semitone' + (this.shape.tuning > 1 ? 's' : ''));
		}.bind(this));

		this.size.addEventListener('click', function() {
			this.shape.setSize((this.shape.size) % 4 + 1);
			this.size.setValue(this.shape.size);
			this.svg.refresh();
		}.bind(this));

		this.segmentsNumber.addEventListener('click', function() {
			this.shape.setSegmentsNumber((this.shape.segmentsNumber) % 8 + 1);
			this.segmentsNumber.setValue(this.shape.segmentsNumber);
			this.svg.refresh();
		}.bind(this));
	};

	var Shape = function(width, shape, container, selectionCallback) {
		this.createElement(width, container);
		this.shape = shape;
		this.selected = false;
		this.svg = new ShapeSvg(width, shape);
		this.panel = new ShapePanel(shape, this.svg);
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

	Shape.prototype.setEvents = function() {
		this.element.addEventListener('mousedown', function(e) {
			this.select(true);
		}.bind(this));

		this.draggable.on('dragMove', function(d, e) {
			var pan = Math.min(Math.max(0, d.position.x / (d.containerSize.innerWidth - d.size.width)), 1) * 2 -1;
			var gain = 1 - Math.min(Math.max(0, d.position.y / (d.containerSize.innerHeight - d.size.height)), 1);
			this.shape.setGain(gain).setPan(pan);
		}.bind(this));
	};

	Shape.prototype.select = function(selected) {
		if(selected !== this.selected) {
			if (selected) {
				this.svg.fill();
				this.selected = true;

				if(typeof this.selectionCallback === 'function') {
					this.selectionCallback(this);
				}
			} else {
				this.svg.unfill();
				this.selected = false;
			}
		}
	};

	App.UI = App.UI || {};
	App.UI.Shape = Shape;
})(App || {});