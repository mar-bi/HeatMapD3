const margin = { top: 120, right: 50, bottom: 110, left: 90 };
const height = 800 - margin.top - margin.bottom, 
			width = 1200 - margin.left - margin.right;

const parseMonth = d3.timeParse('%m');
const parseYear = d3.timeParse('%Y');
const monthFormat = d3.timeFormat('%B');

			
var svg = d3.select('#chart').append('svg')
	.attr('width', width + margin.left + margin.right)		
	.attr('height', height + margin.top + margin.bottom);


d3.json('global-temperature.json', function(data){
	const baseTemp = data.baseTemperature;
	const monthlyData = data.monthlyVariance;
	const minYear = d3.min(monthlyData, d => d.year),
				maxYear = d3.max(monthlyData, d => d.year);
	const minMonth = d3.min(monthlyData, d => d.month),
				maxMonth = d3.max(monthlyData, d => d.month);

	const step = 14/10;
	const tempVarRange = d3.range(0, 14+step/2, step);
	
	const cellWidth = width*12 / monthlyData.length,
				cellHeight = height / 12;

	const xScale = d3.scaleLinear()
		.domain([minYear, maxYear])
		.range([0, width]);
	
	const yScale = d3.scaleBand()
		.domain(d3.range(1,13))
		.range([0, height]);	

	const cScale = d3.scaleLinear()
		.domain(tempVarRange)
		.range(["#8073ac", "#3288bd", "#35978f", "#66c2a5", "#abdda4", 
			"#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f"]);

	var tooltip= d3.select('body').append('div')
	 		.classed('tooltip', true)
	 		.style('position', 'absolute')
	 		.style('padding', '0 10px')
	 		.style('opacity', 0);	

 	var myGraph = svg.append('g')
 		.attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
 		.selectAll('rect').data(monthlyData) 
 		.enter().append('rect')
 			.style('fill', (d) => cScale(d.variance+baseTemp))
			.attr('width',  cellWidth)
			.attr('height', cellHeight)
			.attr('x', (d) => xScale(d.year))
			.attr('y', (d) => yScale(d.month))
		.on('mouseover', function(d){
				
 			tooltip.transition()
 				.style('opacity', .9);

 			tooltip.html(`<p> ${monthFormat(parseMonth(d.month))}, ${d.year}<br/> 
 												${(baseTemp + d.variance).toFixed(3)} &#176; C<br/>
 												${d.variance} &#176; C</p>`)
 		   	.style('left',(d3.event.pageX - 30) + 'px')
 		   	.style('top', (d3.event.pageY + 30) + 'px');
 		})
 		.on('mouseout', function(){
 		 	tooltip.text('');
 		});

 	var xAxisScale = d3.scaleTime()
  	.domain([new Date(parseYear(minYear)),new Date(parseYear(maxYear))])
  	.range([0, width]);

  var monthArray = d3.range(1,13).map(e => parseMonth(e))
  									 .map(e => monthFormat(e));
  
  var yAxisScale = d3.scaleBand()
  	.domain(monthArray)
  	.range([0, height]);
	
	var yAxis = d3.axisLeft(yAxisScale);
  var xAxis = d3.axisBottom(xAxisScale);
  yAxis.ticks(12);
  
  svg.append('g')
  	.attr('class', 'yaxis')
 	 	.attr('transform', 'translate('+margin.left+','+margin.top+')')
 	 	.call(yAxis);
 	
 	svg.append('g')
 		.attr('transform', 
		 			'translate('+margin.left+', '+(height+margin.top)+')')
 		.call(xAxis);

 	var gY = d3.select('g.yaxis');
 	gY.select(".domain").remove();
 	gY.selectAll(".tick").select('line').remove();

	//color legend
	var colorLegend = svg.append('g')
		.attr('class', 'col-legend')
		.selectAll('g.colorpoint')
		.data(tempVarRange)
		.enter().append('g')
		.attr('class', 'colorpoint');

	colorLegend.append('rect')
		.attr('width', 35)
		.attr('height', 30)
		.attr('x', (d, i) =>750 + i*35)
		.attr('y', (d, i) =>740)
		.attr('fill', d => cScale(d));

	colorLegend.append('text')
		.attr('x', (d, i) =>760 + i*35)
	 	.attr('y', (d, i) =>785)
	 	.attr('class', 'data-name')
	 	.text(d => d.toFixed(1));

	d3.select('g.col-legend').append('text')
		.attr('x', 870)
	 	.attr('y', 735)
	 	.attr('class', 'axis-title')
	 	.text('Monthly Temperature');
});

var graphTitle =  svg.append('g')
	.attr('class', 'graph-title');

graphTitle.append('text')	
  .attr('x', 390)
 	.attr('y', 30)
 	.attr('class', 'chart-name')
 	.text("Monthly Global Land-Surface Temperature");
graphTitle.append('text')	
  .attr('x', 530)
 	.attr('y', 60)
 	.attr('class', 'chart-extra')
 	.text("1753 - 2015");

graphTitle.append('text')
 	.attr('x', 290)
 	.attr('y', 85)
 	.attr('class', 'span')
 	.text(`Temperatures are in Celsius and reported as anomalies 
 					relative to the Jan 1951-Dec 1980 average.`);

graphTitle.append('text')
 	.attr('x', 380)
 	.attr('y', 105)
 	.attr('class', 'span')
 	.text(`Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07`);	 

d3.select('svg').append('text')
	.attr('x', 40)
 	.attr('y', 110)
 	.attr('class', 'axis-title')
 	.text('Month');

d3.select('svg').append('text')
 	.attr('x', 500)
 	.attr('y', 730)
 	.attr('class', 'axis-title')
 	.text('Year');
