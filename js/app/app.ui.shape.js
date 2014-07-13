(function(App) {
	"use strict";

	var ShapeSvg = function(width, size, segments) {
		this.svg = new Snap(width, width);
		this.width = width;
		this.size = size;
		this.segments = segments;
		this.refresh();
	};

	ShapeSvg.prototype.createShape = function() {
		var w = this.width,
			p = this.segments,
			c = w / 2,
			r = (this.width - 1) / (this.size + 1);

		var shape;

		if(p === 1) {
			shape = this.svg.circle(c, c, r - c / 5);
		} else if(p === 2) {
			//TODO dunno what to draw
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
			strokeWidth: 2
		});
	};

	ShapeSvg.prototype.fill = function() {
		this.shape.animate({
			fillOpacity: 1
		}, 250);
	};

	ShapeSvg.prototype.unfill = function() {
		this.shape.animate({
			fillOpacity: 0
		}, 200);
	};

	var Shape = function(width, shape, container) {
		this.createElement(width);
		this.shape = shape;
		this.selected = false;
		this.svg = new ShapeSvg(width, shape.size, shape.segmentsNumber);
		this.element.appendChild(this.svg.svg.node);
		this.draggable = new Draggabilly(this.element, {
			containment : container,
			handle : 'polygon, circle'
		});

		this.setEvents();
	};

	Shape.prototype.createElement = function(width) {
		this.element = document.createElement('div');
		this.element.className = 'shape';
		this.element.style.top = '0px';
		this.element.style.left = '0px';
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
			} else {
				this.svg.unfill();
			}
		}
	};

	App.UI = App.UI || {};
	App.UI.Shape = Shape;
})(App || {});