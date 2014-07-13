(function(App) {
	"use strict";

	var ShapeManager = function(bufferBank) {
		this.bufferBank = bufferBank;
		this.collection = [];
	};

	ShapeManager.prototype.bufferBank = null;
	ShapeManager.prototype.collection = null;

	ShapeManager.prototype.getCollection = function() {
		return this.collection;
	};

	ShapeManager.prototype.add = function(size, numberSegments, bufferName) {
		var shape = null;
		var buffer = this.bufferBank.getBuffer(bufferName);

		shape = new App.Shape(size, numberSegments, buffer);
		this.collection.push(shape);

		return shape;
	};

	ShapeManager.prototype.remove = function(shape) {
		_.remove(this.collection, function(v) { return v === shape; });
	};

	App.ShapeManager = ShapeManager;
})(App || {});