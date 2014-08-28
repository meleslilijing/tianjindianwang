var legend0 = true
var legend1 = true
var legend2 = true

var dirOld = []
var dirNew = []

// var year = []

var graphAttr = {
	width: 852,
	height: 100,
}

getStorage = null

var map = function() {
	var footPosition = d3.select('.map')[0][0].getBoundingClientRect();
	var svgAttr = {
		width: footPosition.width,
		height: footPosition.height,
	}

	svg = d3.select('.map').append('svg')
		.attr({
			'width': svgAttr.width,
			'height': svgAttr.height,
		})
}

var _drawImgs = function() {

	// 仓库点
	var pointsCoordinate = [{
		key: '滨海仓库',
		coordinate: [502, 384]
	}, {
		key: '蓟县仓库',
		coordinate: [820, 117]
	}, {
		key: '静海仓库',
		coordinate: [262, 350]
	}, {
		key: '宁河仓库',
		coordinate: [649, 325]
	}, {
		key: '武清仓库',
		coordinate: [432, 219]
	}, {
		key: '宝坻仓库',
		coordinate: [634, 170]
	}]
	var centerPointsCoordinate = [{
		key: '东丽中心库',
		coordinate: [437, 333]
	}, ]
	var warehousesCoordinate = [{
		key: '郁江道仓储点',
		coordinate: [383, 335]
	}, ]

	// 线
	lineCoordinate = [{
		name: '滨海仓库',
		point1: [506, 384],
		point2: [652, 384]
	}, {
		name: '蓟县仓库',
		point1: [820, 116],
		point2: [690, 77],
		point3: [608, 77]
	}, {
		name: '静海仓库',
		point1: [118, 387],
		point2: [173, 387],
		point3: [262, 350]
	}, {
		name: '宁河仓库',
		point1: [650, 325],
		point2: [717, 325]
	}, {
		name: '武清仓库',
		point1: [294, 219],
		point2: [432, 219]
	}, {
		name: '宝坻仓库',
		point1: [634, 170],
		point2: [724, 210]
	}, {
		name: '东丽中心库',
		point1: [437, 333],
		point2: [374, 283],
		point3: [233, 283]
	}, {
		name: '郁江道仓储点',
		point1: [214, 335],
		point2: [383, 335]
	}, ]

	// 标签
	var tipsCoordinate = [{
		key: 'BGCA',
		name: '滨海仓库',
		value: [651, 372],
		width: 82,
		height: 26
	}, {
		key: 'BHCA',
		name: '蓟县仓库',
		value: [525, 64],
		width: 82,
		height: 26
	}, {
		key: 'BICA',
		name: '静海仓库',
		value: [33, 373],
		width: 82,
		height: 26
	}, {
		key: 'BKCA',
		name: '宁河仓库',
		value: [717, 310],
		width: 82,
		height: 26
	}, {
		key: 'BJCA',
		name: '武清仓库',
		value: [211, 203],
		width: 82,
		height: 26
	}, {
		key: 'BLCA',
		name: '宝坻仓库',
		value: [723, 198],
		width: 82,
		height: 26
	}, {
		key: 'BLAA',
		name: '东丽中心库',
		value: [140, 265],
		width: 95,
		height: 26
	}, {
		key: 'BCDB',
		name: '郁江道仓储点',
		value: [100, 323],
		width: 112,
		height: 26
	}, ]

	var defs1 = svg.append('defs').append('linearGradient')
		.attr({
			'id': 'linearGradient1',
			'x1': '0%',
			'y1': '0%',
			'x2': '100%',
			'y2': '0%'
		})
	defs1.append('stop')
		.attr({
			'offset': '0%',
			'stop-color': '#267bac',
			'stop-opacity': "1"
		})
	defs1.append('stop')
		.attr({
			'offset': '50%',
			'stop-color': '#5dc4ff',
			'stop-opacity': "1"
		})
	defs1.append('stop')
		.attr({
			'offset': '100%',
			'stop-color': '#267bac',
			'stop-opacity': "1"
		})



	var points = svg.append('g').classed('points', true)
	var circles = points.append('g').classed('circles', true)
		.selectAll('circle.point')
		.data(pointsCoordinate)
		.enter()
		.append('circle').classed('point', true)
		.attr({
			'cx': function(d) {
				return d.coordinate[0]
			},
			'cy': function(d) {
				return d.coordinate[1]
			},
			'r': 7,
			'stroke-width': 6,
			'stroke': 'white',
			'fill': 'none',
			'name': function(d) {
				return d.key
			}
		})

	var centerPoints = points.append('g').classed('centerPoints', true)
		.attr({
			'name': '东丽中心库'
		})
		.selectAll('circle')
		.data(centerPointsCoordinate)
		.enter()

	centerPoints.append('circle').classed('centerPoint', true)
		.attr({
			'cx': function(d) {
				return d.coordinate[0]
			},
			'cy': function(d) {
				return d.coordinate[1]
			},
			'r': 7,
			'stroke-width': 6,
			'stroke': 'white',
			'fill': 'none',

		})
	centerPoints.append('circle').classed('centerPointBig', true)
		.attr({
			'cx': function(d) {
				return d.coordinate[0]
			},
			'cy': function(d) {
				return d.coordinate[1]
			},
			'r': 17,
			'stroke-width': 6,
			'stroke': 'white',
			'fill': 'none',
		})

	var warehouses = points.append('g').classed('warehouses', true)
		.attr({
			'name': '郁江道仓储点'
		})
		.selectAll('rect.warehouse')
		.data(warehousesCoordinate)
		.enter()
		.append('rect').classed('warehouse', true)
		.attr({
			'x': function(d) {
				return d.coordinate[0]
			},
			'y': function(d) {
				return d.coordinate[1]
			},
			'width': 8,
			'height': 8,
			'fill': 'none',
			'stroke-width': 4,
			'stroke': 'white',
			'transform': function(d) {
				return 'rotate(45,' + (d.coordinate[0] + 6) + ',' + (d.coordinate[1] + 6) + ')'
			},


		})


	var lines = svg.append('g').classed('lines', true)
		.selectAll('polyline')
		.data(lineCoordinate)
		.enter()
		.append('polyline')
		.attr({
			'points': function(d) {
				var str = ''
				str = d.point1 + ' ' + d.point2
				if (d.point3) {
					str += ' ' + d.point3
				}
				return str
			},
			'fill': 'none',
			'stroke': 'white',
			'name': function(d) {
				return d.name
			}
		})

	// 标签
	var tips = svg.append('g').classed('tips', true)
		.selectAll('g')
		.data(tipsCoordinate)
		.enter()
		.append('g')
		.attr({
			'transform': function(d) {
				return 'translate(' + d.value[0] + ',' + d.value[1] + ')'
			},
			'name': function(d) {
				return d.name
			},
			// 'opacity': 0.1
		})


	tips.append('rect').classed('bg', true)
		.attr({
			'width': function(d) {
				return d.width
			},
			'height': function(d) {
				return d.height
			},
			'fill': '#145281',
			'stroke-width': 1,
			'stroke': 'white'
		})

	tips.append('text')
		.text(function(d, i) {
			return d.name
		})
		.attr({
			'x': 8,
			'y': function(d, i) {
				return d.height - 8
			},
			'fill': 'white'
		})
		.style({
			'font-size': '16px'
		})


	// 柱子
	d3.json('data/mydata/AllAcuStorage.json', function(dataset) {


		var columnsData = [{
			name: '滨海仓库',
			no: 'BGCA',
			value: 0
		}, {
			name: '蓟县仓库',
			no: 'BHCA',
			value: 0
		}, {
			name: '静海仓库',
			no: 'BICA',
			value: 0
		}, {
			name: '宁河仓库',
			no: 'BKCA',
			value: 0
		}, {
			name: '武清仓库',
			no: 'BJCA',
			value: 0
		}, {
			name: '宝坻仓库',
			no: 'BLCA',
			value: 0
		}, {
			name: '东丽中心库',
			no: 'BAAA',
			value: 0
		}, {
			name: '郁江道仓储点',
			no: 'BCDB',
			value: 0
		}, ]

		for (var i = 0; i < columnsData.length; i++) {

			for (var j = 0; j < dataset.length; j++) {

				if (columnsData[i].no == dataset[j].no) {
					columnsData[i].value = dataset[j].actStorage
				}

			}

		}



		var colors = ['#015383']
		var columns = svg.append('g').classed('columns', true)

		// 柱子专用比例尺
		colScale = d3.scale.linear()
			.domain(d3.extent(columnsData, function(d) {
				return d.value
			}))
			.range([10, 120]);

		var groups = columns.selectAll('g')
			.data(columnsData)
			.enter()
			.append('g')
			.attr({

				'name': function(d) {
					return d.name
				}
			})

		var rects = groups
			.append("rect")
			.attr({
				'fill': function(d, i) {
					return 'url(#linearGradient' + (0 + 1) + ')'
				},
				'x': function(d, i) {
					return 0;
				},
				'y': function(d) {
					return colScale(d.value)
				},
				'width': 10,
				'height': function(d) {
					return 0
				},
				'transform': function(d, i) {
					var x
					var y
					if (i <= 5) {
						x = pointsCoordinate[i].coordinate[0]
						y = pointsCoordinate[i].coordinate[1]
					} else if (i == 6) {
						x = centerPointsCoordinate[0].coordinate[0]
						y = centerPointsCoordinate[0].coordinate[1]
					} else if (i == 7) {
						x = warehousesCoordinate[0].coordinate[0]
						y = warehousesCoordinate[0].coordinate[1]
					}
					return 'translate(' + x + ',' + (y - colScale(d.value)) + ')'
				}

			})
			.on('mouseover', function(d, i) {
				d3.select(this).attr({
					'fill': 'red'
				})

				var position = d3.mouse(d3.select('html')[0][0])
				var xpp = position[0];
				var ypp = position[1];

				d3.select('body').append('div').attr('id', 'tooltip')
					.style({
						'left': xpp,
						'top': ypp
					})
					.append('p')
					.text('库存水平：' + d.value)
			})
			.on('mouseleave', function() {
				d3.select(this).attr({
					'fill': 'url(#linearGradient' + (0 + 1) + ')'

				})

				d3.select('#tooltip').remove()
			})
			.transition()
			.duration(2000)
			.attr("y", function(d, i) {
				return 0
			})
			.attr("height", function(d, i) {
				return colScale(d.value)
			})
	}) // end d3.json


}

//page1 page3 数据图
var _graph = function(warehouseId) {

	console.log('warehouseId', warehouseId)

	var footPosition = d3.select(".foot")[0][0].getBoundingClientRect();
	var svgAttr = {
		width: footPosition.width,
		height: footPosition.height,
	}
	d3.select('.foot').select('.center').select('svg').remove()
	var svg = d3.select('.foot').select('.center').append('svg')
		.attr({
			'width': svgAttr.width,
			'height': svgAttr.height,
		})

	// 表格及背景 star
	var title = svg.append('text')
		.classed('title', true)
		.attr({
			'x': 26,
			'y': 60,
		})
		.text('库存水平')

	var chart = svg.append('g').classed('chart', true)
		.attr('transform', 'translate(50,0)')

	var changeChart = function(dataset) {

		var year = []

		// var actStorage = []
		// for (var i = 0; i < dataset.actStorage.length; i++) {
		//     actStorage.push(dataset.actStorage[i])
		// }

		for (var i = 0; i < dataset.actStorage.length; i++) {
			year.push(dataset.actStorage[i].year)
		}
		year.sort()

		// 删除year中重复的内容
		for (var i = 0; i < year.length - 1; i++) {
			if (year[i] == year[i + 1]) {
				year.splice(i, 1)
				i--
			}
		}
		year.push('')

		var axis = chart.append('g').classed('axis', true)
		var xAxis = axis.append('g').classed('xAxis', true)
		var yAxis = axis.append('g').classed('yAxis', true)

		var actStorage_max = d3.max(dataset.actStorage, function(d) {
			return d.actual
		})
		var norminal_max = d3.max(dataset.norminalStorage, function(d) {
			return d.max
		})

		var max = actStorage_max > norminal_max ? actStorage_max : norminal_max

		xScale = d3.scale.ordinal()
			.domain(year)
			.rangePoints([0, graphAttr.width], 0)

		yScale = d3.scale.linear()
			.domain([0, max])
			.range([0, graphAttr.height])

		hScale = d3.scale.linear()
			.domain([0, max])
			.range([graphAttr.height, 0])

		var xAxisConfig = d3.svg.axis()
			.scale(xScale)
			.orient('bottom')

		var yAxisConfig = d3.svg.axis()
			.scale(hScale)
			.orient('left')
			.ticks(5)

		// pluse 心电图
		var pulse = xAxis
			.append('image').classed('pluse', true)
			.attr({
				'x': -2,
				'y': -100,
				'width': graphAttr.width,
				'height': 123,
				'xlink:href': 'images/xxx.gif',
			})

		xAxis.append('line').classed('xLine', true)
			.attr({
				'x1': xScale.rangeExtent()[0],
				'y1': 0,
				'x2': xScale.rangeExtent()[1],
				'y2': 0,
			})

		xAxis.call(xAxisConfig)
			.attr({
				'transform': 'translate(115, 113)'
			})

		xAxis.selectAll('.tick')
			.append('line').classed('yLine', true)
			.attr({
				'y2': -graphAttr.height,
			})
		xAxis.selectAll('.tick')
			.append('circle')
			.attr({
				'r': 2,
				'fill': 'none',
				'stroke-width': 1,
				'stroke': 'white',
			})

		yAxis.call(yAxisConfig)
			.attr({
				'transform': 'translate(115, 13)'
			})

		var buffArr = xScale.range()
		var buffwidth = buffArr[1] - buffArr[0]
		d3.select('.foot svg .axis').selectAll('text').attr('transform', 'translate(' + buffwidth / 2 + ',0)')

		colums = chart.append('g').classed('colums', true)

		console.log('year', year)

		year.forEach(function(d, yearNum) {

			if (yearNum == year.length - 1) {
				return
			} //最后一年是null。不输出

			// 背景rect
			var mouthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

			var xMouthScale = d3.scale.ordinal()
				.domain(mouthArr)
				.rangeBands([0, buffwidth], 0.1, 0.15)

			var widthBuff = xScale.range()[1] - xScale.range()[0]

			var animationTime = 1000

			console.log('year*****', year[yearNum])

			/*d3.json('http://localhost:8080/StateGridWeb/views/getStorage.jsp?No=' + warehouseId + '&year=' + year[yearNum],*/
			//自己改动
			//=============
			var httpurl = "";
			if (warehouseId == 'ALL') {
				if (year[yearNum] == '2012') {
					httpurl = 'data/mydata/noALL2012.json';
				} else if (year[yearNum] == '2013') {
					httpurl = 'data/mydata/noALL2013.json';
				} else if (year[yearNum] == '2014') {
					httpurl = 'data/mydata/noALL2014.json';
				} else {
					httpurl = 'data/mydata/noALL.json';
				}
			} else if (warehouseId == "BAAA") {
				if (year[yearNum] == '2012') {
					httpurl = 'data/mydata/noBAAA2012.json';
				} else if (year[yearNum] == '2013') {
					httpurl = 'data/mydata/noBAAA2013.json';
				} else if (year[yearNum] == '2014') {
					httpurl = 'data/mydata/noBAAA2014.json';
				} else {
					httpurl = 'data/mydata/noBAAA.json';
				}
			} else if (warehouseId == "BCDB") {
				if (year[yearNum] == '2012') {
					httpurl = 'data/mydata/noBCDB2012.json';
				} else if (year[yearNum] == '2013') {
					httpurl = 'data/mydata/noBCDB2013.json';
				} else if (year[yearNum] == '2014') {
					httpurl = 'data/mydata/noBCDB2014.json';
				} else {
					httpurl = 'data/mydata/noBCDB.json';
				}
			} else if (warehouseId == "BLCA") {
				if (year[yearNum] == '2012') {
					httpurl = 'data/mydata/noBLCA2012.json';
				} else if (year[yearNum] == '2013') {
					httpurl = 'data/mydata/noBLCA2013.json';
				} else if (year[yearNum] == '2014') {
					httpurl = 'data/mydata/noBLCA2014.json';
				} else {
					httpurl = 'data/mydata/noBLCA.json';
				}
			} else if (warehouseId == "BJCA") {
				if (year[yearNum] == '2012') {
					httpurl = 'data/mydata/noBJCA2012.json';
				} else if (year[yearNum] == '2013') {
					httpurl = 'data/mydata/noBJCA2013.json';
				} else if (year[yearNum] == '2014') {
					httpurl = 'data/mydata/noBJCA2014.json';
				} else {
					httpurl = 'data/mydata/noBJCA.json';
				}
			} else if (warehouseId == "BKCA") {
				if (year[yearNum] == '2012') {
					httpurl = 'data/mydata/noBKCA2012.json';
				} else if (year[yearNum] == '2013') {
					httpurl = 'data/mydata/noBKCA2013.json';
				} else if (year[yearNum] == '2014') {
					httpurl = 'data/mydata/noBKCA2014.json';
				} else {
					httpurl = 'data/mydata/noBKCA.json';
				}
			} else if (warehouseId == "BICA") {
				if (year[yearNum] == '2012') {
					httpurl = 'data/mydata/noBICA2012.json';
				} else if (year[yearNum] == '2013') {
					httpurl = 'data/mydata/noBICA2013.json';
				} else if (year[yearNum] == '2014') {
					httpurl = 'data/mydata/noBICA2014.json';
				} else {
					httpurl = 'data/mydata/noBICA.json';
				}
			} else if (warehouseId == "BHCA") {
				if (year[yearNum] == '2012') {
					httpurl = 'data/mydata/noBHCA2012.json';
				} else if (year[yearNum] == '2013') {
					httpurl = 'data/mydata/noBHCA2013.json';
				} else if (year[yearNum] == '2014') {
					httpurl = 'data/mydata/noBHCA2014.json';
				} else {
					httpurl = 'data/mydata/noBHCA.json';
				}
			} else if (warehouseId == "BGCA") {
				if (year[yearNum] == '2012') {
					httpurl = 'data/mydata/noBGCA2012.json';
				} else if (year[yearNum] == '2013') {
					httpurl = 'data/mydata/noBGCA2013.json';
				} else if (year[yearNum] == '2014') {
					httpurl = 'data/mydata/noBGCA2014.json';
				} else {
					httpurl = 'data/mydata/noBGCA.json';
				}
			}

			d3.json(httpurl, function(dataset) {

				console.log('year-----', year[yearNum])

				var colum = colums.append('g')
					.filter(function(d, i) {
						return yearNum == year.length - 1 ? null : this;
					})
					.classed('colum', true)
					.attr({
						'transform': 'translate(' + (115 + widthBuff * (yearNum)) + ',12)'
					})

				var maxRectData = dataset.norminalStorage[0].max

				realColum = colum.append('g')
					.classed('real', true)
					.selectAll('rect.realColum')
					.data(mouthArr)
					.enter()
					.append('rect').classed('realColum', true)
					.attr({
						'x': function(d, i) {
							return xMouthScale(i + 1) - 0.5
						},
						'y': function(d) {
							return 100
						},
						'width': function(d, i) {
							return xMouthScale.rangeBand()
						},
						'height': function(d) {
							return 0
						},
						'fill': function(d, i) {

							var act = dataset.actStorage[i].actual
							var max = dataset.norminalStorage[0].max
							var nor = dataset.norminalStorage[0].norminal

							if (act >= max) {
								return 'red'
							} else if (act < max && act >= nor) {
								return 'yellow'
							} else if (act < nor) {
								return '#26a9f7'
							}
						}
					})
					.on('mouseover', function(d, i) {
						d3.select(this).attr({
							'fill': 'red'
						})

						var position = d3.mouse(d3.select('html')[0][0])
						var xpp = position[0];
						var ypp = position[1];

						d3.select('body').append('div').attr('id', 'tooltip')
							.style({
								'left': xpp,
								'top': ypp
							})
							.append('p')
							.text('库存水平：' + dataset.actStorage[i].actual)

					})
					.on('mouseleave', function(d, i) {

						var color

						var act = dataset.actStorage[i].actual
						var max = dataset.norminalStorage[0].max
						var nor = dataset.norminalStorage[0].norminal

						if (act >= max) {
							color = 'red'
						} else if (act < max && act >= nor) {
							color = 'yellow'
						} else if (act < nor) {
							color = '#26a9f7'
						}

						d3.select(this).attr({
							'fill': color
						})
						d3.select('#tooltip').remove()
					})
					.transition()
					.duration(animationTime)
					.attr({
						'y': function(d, i) {
							return graphAttr.height - yScale(dataset.actStorage[i].actual)
						},
						'height': function(d, i) {
							return yScale(dataset.actStorage[i].actual)
						},
					})

				// 外发光 高斯滤镜 安全线
				var defsSafeLine = colum.append('defs')
					.append('filter')
					.attr({
						'id': 'safetyLineFilter',
						'y': -5,
						'height': 40,
					})
					.append('feGaussianBlur')
					.attr({
						'in': 'SourceGraphic',
						'stdDeviation': 2,
						'y': 5
					})

				// 最高库存--虚线框 rect
				// maxColum = colum.append('g')
				// 	.classed('max', true)
				// 	.selectAll('rect.maxColum')
				// 	.data(mouthArr)
				// 	.enter()
				// 	.append('rect').classed('maxColum', true)
				// 	.attr({
				// 		'x': function(d, i) {
				// 			return xMouthScale(i + 1) + 0.5
				// 		},
				// 		'y': function(d) {
				// 			return 100 - yScale(maxRectData) + 1
				// 		},
				// 		'width': function(d, i) {
				// 			return xMouthScale.rangeBand() - 2
				// 		},
				// 		'height': function(d) {
				// 			return yScale(maxRectData)
				// 		},
				// 		'stroke-dasharray': '4,3',
				// 		'stroke': 'white',
				// 		'stroke-width': 1,
				// 		'fill': 'none'
				// 	})

				// 最高库存--虚线 line
				maxColum = colum.append('line')
					.classed('max', true)
					.attr({
						'x1': 0,
						'y1': function(d, i) {
							return graphAttr.height - yScale(dataset.norminalStorage[0].max)
						},
						'x2': buffwidth,
						'y2': function(d, i) {
							return graphAttr.height - yScale(dataset.norminalStorage[0].max)
						},
						'stroke-width': 3,
						'stroke': '#56b1fc',
						'stroke-dasharray': '8,2'
					})
					.on('mouseover', function(d, i) {

						// 弹出层 #tooltip
						var position = d3.mouse(d3.select('html')[0][0])
						var xpp = position[0];
						var ypp = position[1];

						d3.select('body').append('div').attr('id', 'tooltip')
							.style({
								'left': xpp,
								'top': ypp
							})
							.append('p')
							.text('最高库存：' + dataset.norminalStorage[0].norminal)

						// 改变安全线颜色
						d3.select(this).attr('stroke', 'red')
						d3.select(this).attr('stroke-dasharray', '8,0')

					})
					.on('mouseleave', function(d, i) {
						d3.select('#tooltip').remove()

						d3.select(this).attr('stroke', '#56b1fc')
						d3.select(this).attr('stroke-dasharray', '8,2')
					})

				// 安全库存
				safetyLine = colum.append('rect')
					.classed('safety', true)
					.attr({
						'x': 0,
						'y': graphAttr.height - yScale(dataset.norminalStorage[0].norminal),
						'width': buffwidth,
						'height': 2,
						'stroke-width': 0,
						'fill': '#56b1fc',
						'filter': 'url(#safetyLineFilter)'
					})
				colum.append('line')
					.attr({
						'x1': 0,
						'y1': function(d, i) {
							return graphAttr.height - yScale(dataset.norminalStorage[0].norminal) + 0.5
						},
						'x2': buffwidth,
						'y2': function(d, i) {
							return graphAttr.height - yScale(dataset.norminalStorage[0].norminal) + 0.5
						},
						'stroke-width': 1.5,
						'stroke': '#56b1fc'
					})
					.on('mouseover', function(d, i) {

						// 弹出层 #tooltip
						var position = d3.mouse(d3.select('html')[0][0])
						var xpp = position[0];
						var ypp = position[1];

						d3.select('body').append('div').attr('id', 'tooltip')
							.style({
								'left': xpp,
								'top': ypp
							})
							.append('p')
							.text('安全库存：' + dataset.norminalStorage[0].norminal)

						// 改变安全线颜色
						d3.select(this).attr('stroke', 'red')


					})
					.on('mouseleave', function(d, i) {
						d3.select('#tooltip').remove()

						d3.select(this).attr('stroke', '#56b1fc')
					})
			}) // end d3.json

		}) // end year.forEach

		d3.selectAll('.colums .colum .realColum').selectAll('g')
			.filter(function(d, i) {
				if (i == 2) return this
			})
			.selectAll('rect').on('mouseover', function(d, i) {
				d3.select(this).style('fill', '#cc3d4a')
				var position = d3.mouse(d3.select('html')[0][0])
				var xpp = position[0];
				var ypp = position[1];

				d3.select('body').append('div').attr('id', 'tooltipChart')
					.style({
						'left': xpp,
						'top': ypp
					})
					.append('p')
					.text('库存水平：' + d.y)
			})
			.on('mouseout', function() {
				d3.select(this).style('fill', undefined)
				d3.select('#tooltipChart').remove()
			})
	}

	if (getStorage) {
		changeChart(getStorage)
	} else {
		/*d3.json('http://localhost:8080/StateGridWeb/views/getStorage.jsp?No=' + warehouseId, function(dataset) {*/
		//自己改动    
		var urlNo = "";
		if (warehouseId == "BAAA") {
			urlNo = 'data/mydata/noBAAA.json';
		} else if (warehouseId == "BCDB") {
			urlNo = 'data/mydata/noBCDB.json';
		} else if (warehouseId == "BLCA") {
			urlNo = 'data/mydata/noBLCA.json';
		} else if (warehouseId == "BJCA") {
			urlNo = 'data/mydata/noBJCA.json';
		} else if (warehouseId == "BKCA") {
			urlNo = 'data/mydata/noBKCA.json';
		} else if (warehouseId == "BICA") {
			urlNo = 'data/mydata/noBICA.json';
		} else if (warehouseId == "BHCA") {
			urlNo = 'data/mydata/noBHCA.json';
		} else if (warehouseId == "BGCA") {
			urlNo = 'data/mydata/noBGCA.json';
		} else {
			//ALL
			urlNo = 'data/mydata/noALL.json';
		}
		d3.json(urlNo, function(dataset) {
			changeChart(dataset)
		}) // end d3.json
	}
}

function _listAction() {
	//legend
	$('.main .tip').find('li').eq(0).click(function() {
		if (legend0) {
			$(this).find('span').css('color', '#ccc')

			d3.select('.points').selectAll('g').filter(function(d, i) {
				var name = d3.select(this).attr('name')
				if (name == '东丽中心库') {
					return this
				}
			}).style({
				'display': 'none',
			})

			d3.select('.tips')
				.selectAll('g').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name == '东丽中心库') {
						return this
					}
				})
				.style({
					'display': 'none',
				})

			d3.select('.lines')
				.selectAll('polyline').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name == '东丽中心库') {
						return this
					}
				})
				.style({
					'display': 'none',
				})

			d3.select('.columns')
				.selectAll('g').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name == '东丽中心库') {
						return this
					}
				})
				.style({
					'display': 'none',
				})

		} else {
			$(this).find('span').css('color', '#90cdff')

			d3.select('.points').selectAll('g').filter(function(d, i) {
				var name = d3.select(this).attr('name')
				if (name == '东丽中心库') {
					return this
				}
			}).style({
				'display': 'block',
			})

			d3.select('.tips')
				.selectAll('g').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name == '东丽中心库') {
						return this
					}
				})
				.style({
					'display': 'block',
				})

			d3.select('.lines')
				.selectAll('polyline').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name == '东丽中心库') {
						return this
					}
				})
				.style({
					'display': 'block',
				})

			d3.select('.columns')
				.selectAll('g').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name == '东丽中心库') {
						return this
					}
				})
				.style({
					'display': 'block',
				})
		}
		legend0 = legend0 ? false : true
	})

	$('.main .tip').find('li').eq(1).click(function() {

		if (legend1) {
			$(this).find('span').css('color', '#ccc')

			d3.select('.points').select('.circles').selectAll('circle')
				.style({
					'display': 'none'
				})

			d3.select('.tips')
				.selectAll('g').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name != '东丽中心库' && name != '郁江道仓储点') {
						return this
					}
				})
				.style({
					'display': 'none',
				})

			d3.select('.lines')
				.selectAll('polyline').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name != '东丽中心库' && name != '郁江道仓储点') {
						return this
					}
				})
				.style({
					'display': 'none',
				})

			d3.select('.columns')
				.selectAll('g').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name != '东丽中心库' && name != '郁江道仓储点') {
						return this
					}
				})
				.style({
					'display': 'none',
				})

		} else {
			$(this).find('span').css('color', '#90cdff')

			d3.select('.points').select('.circles').selectAll('circle')
				.style({
					'display': 'block'
				})

			d3.select('.tips')
				.selectAll('g').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name != '东丽仓库' && name != '郁江道仓储点') {
						return this
					}
				})
				.style({
					'display': 'block',
				})

			d3.select('.lines')
				.selectAll('polyline').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name != '东丽仓库' && name != '郁江道仓储点') {
						return this
					}
				})
				.style({
					'display': 'block',
				})

			d3.select('.columns')
				.selectAll('g').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name != '东丽中心库' && name != '郁江道仓储点') {
						return this
					}
				})
				.style({
					'display': 'block',
				})

		}

		legend1 = legend1 ? false : true
	})

	$('.main .tip').find('li').eq(2).click(function() {
		if (legend2) {
			$(this).find('span').css('color', '#ccc')

			d3.select('.points').select('.warehouses')
				.style({
					'display': 'none',
				})

			d3.select('.tips')
				.selectAll('g').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name == '郁江道仓储点') {
						return this
					}
				})
				.style({
					'display': 'none',
				})

			d3.select('.lines')
				.selectAll('polyline').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name == '郁江道仓储点') {
						return this
					}
				})
				.style({
					'display': 'none',
				})

			d3.select('.columns')
				.selectAll('g').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name == '郁江道仓储点') {
						return this
					}
				})
				.style({
					'display': 'none',
				})
		} else {
			$(this).find('span').css('color', '#90cdff')

			d3.select('.points').select('.warehouses')
				.style({
					'display': 'block',
				})
			d3.select('.tips')
				.selectAll('g').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name == '郁江道仓储点') {
						return this
					}
				})
				.style({
					'display': 'block',
				})

			d3.select('.lines')
				.selectAll('polyline').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name == '郁江道仓储点') {
						return this
					}
				})
				.style({
					'display': 'block',
				})

			d3.select('.columns')
				.selectAll('g').filter(function(d, i) {
					var name = d3.select(this).attr('name')
					if (name == '郁江道仓储点') {
						return this
					}
				})
				.style({
					'display': 'block',
				})
		}
		legend2 = legend2 ? false : true
	})

	$('#page1 .main .list .list-content').find('li').bind('click', function() {
		var index = $(this).index()
		var warehouseId = $(this).attr('warehouseId')

		if (index) {
			index = index - 1

			d3.select('.map .columns').selectAll('rect')
				.filter(function(d, i) {
					if (i == index) {
						return this
					}
				})
				.attr({
					'y': function(d, i) {
						return colScale(d.value)
					},
					'height': 0,
				})
				.transition()
				.duration(2000)
				.attr({
					'y': 0,
					'height': function(d, i) {
						return colScale(d.value)
					}
				})

			$('.tips').find('g').eq(index)
				.css('opacity', 0.1)

			$('.tips').find('g').eq(index)
				.animate({
					'opacity': 1
				}, 2000)

			$(this).css({
				'color': '#90cdff',
			})
				.siblings()
				.css({
					'color': 'white',
				})

			$('.map .tips g').eq(index)
				.find('rect')
				.css({
					'fill': '#6a343d'
				})
				.parent().siblings().find('rect')
				.css({
					'fill': '#145281'
				})

			// 与图例联动
			if (!legend0) {
				$('.points').find('.centerPoints').css('display', 'none')
				$('.tips').find('g:eq(6)').css('display', 'none')
				$('.lines').find('polyline:eq(6)').css('display', 'none')
				$('.columns').find('g:eq(6)').css('display', 'none')
			}
			if (!legend1) {
				$('.points').find('.circles').find('circle').css('display', 'none')
				$('.tips').find('g:lt(6)').css('display', 'none')
				$('.lines').find('polyline:lt(6)').css('display', 'none')
				$('.columns').find('g:lt(6)').css('display', 'none')
			}
			if (!legend2) {
				$('.points').find('.warehouses').css('display', 'none')
				$('.tips').find('g:gt(6)').css('display', 'none')
				$('.lines').find('polyline:gt(6)').css('display', 'none')
				$('.columns').find('g:gt(6)').css('display', 'none')
			}

			var name = $(this).attr('name')
			if (name != '东丽中心库' && name != '郁江道仓储点') {
				d3.select('.points .circles').selectAll('circle')
					.filter(function() {
						if (d3.select(this).attr('name') == name) {
							return this
						}
					})
					.style({
						'display': 'block',
					})

			} else if (name == '东丽中心库') {
				d3.select('.points .centerPoints')
					.style({
						'display': 'block'
					})
			} else if (name == '郁江道仓储点') {
				d3.select('.points .warehouses')
					.style({
						'display': 'block'
					})

			}

			d3.select('.tips').selectAll('g')
				.filter(function() {
					if (d3.select(this).attr('name') == name) {
						return this
					}
				})
				.style({
					'display': 'block',
				})

			d3.select('.lines').selectAll('polyline')
				.filter(function() {
					if (d3.select(this).attr('name') == name) {
						return this
					}
				})
				.style({
					'display': 'block',
				})

			d3.select('.columns').selectAll('g')
				.filter(function() {
					if (d3.select(this).attr('name') == name) {
						return this
					}
				})
				.style({
					'display': 'block',
				})

			// data切换为相应仓库的数据
			_graph(warehouseId)
		} else { // 点击ALL	计算所有数据之和
			$(this).css('color', '#90cdff').siblings().css('color', 'white')
			$('.map .tips g').find('.bg').css('fill', '#145281')
			_graph(warehouseId)
		}
	}).eq(0)
		.click()

	$('#page1 .map .tips g').find('text').bind('click', function() {
		var index = $(this).parent().index() + 1
		$('#page1 .main .list .list-content').find('li').eq(index).click()
	})
}


map();
_drawImgs();
_listAction();