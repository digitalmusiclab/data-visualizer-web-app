function Graph (attributes, data) {
	this.chart_interval = {};
	this.attributes = attributes;
	this.labels 		= labelsFromHeader(data.header);
	
	var grouped 		= _.groupBy(data.rows, this.labels.category);
	var points 			= parseDataPoints.bind(this)(grouped);
	this.categories = _.map(points, buildGraphCategory.bind(this));
}

Graph.prototype.stopDrawing = function () {
	clearInterval(this.chart_interval);	
}

Graph.prototype.drawGraph = function() {
	var base_config = {
		// series: 	this.categories,
		legend: 	{ title: { text: this.labels.category }},
		xAxis: 		{ title: { text: this.labels.x_axis 	}},
		yAxis: 		{ title: { text: this.labels.y_axis 	}},
	}
	var graph_config = _.merge(base_config, this.attributes);
	var chart = new Highcharts.Chart(graph_config);

	var categories = this.categories;
	var count = 0;
	chart.addSeries(categories[count++]);

	this.chart_interval = setInterval(function() {
    chart.addSeries(categories[count++]);
    if (count === categories.length) {
    	clearInterval(this.chart_interval);
    }
	}, 1100);

};

var parseDataPoints = function (categories) {
	return _.map(categories, function(data, category) {
		return {
			category: category, 
			data: _.map(data, pointFromData.bind(this))
		};
	}, this);
}

var pointFromData = function (point) {
	return {
		label: point[this.labels.label],
		x_val: point[this.labels.x_axis],
		y_val: point[this.labels.y_axis],
	};
}

var labelsFromHeader = function (header) {
	if (header.length == 4) {
		return {
			category: header[0],
			label: 		header[1],
			x_axis: 	header[2],
			y_axis: 	header[3]
		}
	}

	return {
		category: header[0],
		label: 		header[0],
		x_axis: 	header[1],
		y_axis: 	header[2]
	}
}

var buildGraphCategory = function (element) {
	var data_type = this.attributes.xAxis.type;
	return new GraphCategory(element.category, element.data, data_type)
}