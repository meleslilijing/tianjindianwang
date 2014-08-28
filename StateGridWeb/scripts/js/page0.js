//成品
var projection //地图
var pointData = null

var xScale
var hScale
var yScale
var spacing

var animationTime = 800

var TianjinMap = function() {
    var mapPosition = d3.select('.map')[0][0].getBoundingClientRect();
    var footPosition = d3.select('.foot')[0][0].getBoundingClientRect();
    mapSvgAttr = {
        width: mapPosition.width,
        height: mapPosition.height,
    }

    footSvgAttr = {
        width: footPosition.width,
        height: footPosition.height,
    }

    mapSvg = d3.select('.map').append('svg')
        .attr({
            'width': mapSvgAttr.width,
            'height': mapSvgAttr.height,
        })

    footSvg = d3.select('.foot').select('.center').append('svg')
        .attr({
            'width': footSvgAttr.width,
            'height': footSvgAttr.height,
        })
}

function tianjinMap() {
    TianjinMap()

    projection = d3.geo.mercator()
        .scale([89000])
        .center([117.2, 39.5])

    var path = d3.geo.path().projection(projection);
    d3.json('data/tianjing.json', function(json) {
        var g = mapSvg.append("g").classed('tianjin', true);
        g.selectAll("path")
            .data(json).enter()
            .append("path")
            .attr({
                'd': path,
                'fill': function(d, i) {
                    return "none" /*colors(i)*/ ;
                },
                "stroke-width": "1px",
                "stroke-linecap": "round",
                "stroke": "#7ba5ae",
            })
    })
} // end tianjinMap()

function drawPoints(data, group) {

    var dataset = []
    // 过滤等级对应电压
    var filterArr = [0, 35, 110, 220]

    // 过滤数据
    var filter = filterArr[group]

    for (var i = 0; i < data.length; i++) {

        if (data[i].voltageLevel > filter) {
            dataset.push(data[i])
        } else {
            // console.log('被过滤数据', data[i].voltageLevel)
        }
    }

    var money = []
    var length = dataset.length

    for (var i = 0; i < length; i++) {
        var type = dataset[i].type

        if (type == 1) {
            money.push(dataset[i].money)
        } else if (type == 2) {
            money.push(dataset[i].currentmoney)
        }
    }

    rMax = d3.max(money)
    rMin = d3.min(money)

    // money最小值，money最大值 ==》 circle半径min=1,circle半径max
    var rScale = d3.scale.linear()
        .domain([rMin, rMax])
        .range([3, 10])

    var place1 = []
    var place2 = []

    for (var i = 0; i < dataset.length; i++) {

        var longitude = dataset[i].longitude
        var latitude = dataset[i].latitude

        var type = dataset[i].type

        var moneyBuffer = money[i]

        if (type == 1) {
            place1.push([longitude, latitude, type, moneyBuffer])
        } else if (type == 2) {
            place2.push([longitude, latitude, type, moneyBuffer])
        }
    }

    var points = mapSvg.append('g').classed('points', true)

    var point1 = points.append('g').classed('type1', true)
    var point2 = points.append('g').classed('type2', true)

    point1.selectAll('g')
        .data(d3.entries(place1))
        .enter()
        .append('g')
        .attr({
            'transform': function(d) {
                return "translate(" + projection(d.value) + ")"
            }
        })
        .append('circle')
        .attr({
            'r': function(d) {
                return rScale(d.value[3])
            },
            'fill': '#ffff00',
            'opacity': 0.6
        })

    point2.selectAll('g')
        .data(d3.entries(place2))
        .enter()
        .append('g')
        .attr({
            'transform': function(d) {
                return "translate(" + projection(d.value) + ")"
            }
        })
        .append('circle')
        .attr({
            'r': function(d) {
                return rScale(d.value[3])
            },
            'fill': '#034eff',
            'opacity': 0.6
        })


}

function _drawPoints(group) {

    projection = d3.geo.mercator()
        .scale([89000])
        .center([117.2, 39.5])

    $('g.points').remove()

    if (pointData === null) {
        /*d3.json('http://localhost:8080/StateGridWeb/views/getDataByType.jsp?type=', function(data) {*/
    	//自己改动
    	d3.json('data/type1.json', function(type1) {
            d3.json('data/type2.json', function(type2) {

                var data = type1.concat(type2)

                pointData = data

                drawPoints(data, group)
            })
        }) // end type

    } else {

        drawPoints(pointData, group)
    }
} // end drawPoints()

function _drawchart() {

    var chartAttr = {
        width: 850,
        height: 100,
        x: 100,
        y: 113
    }

    /*d3.json('http://localhost:8080/StateGridWeb/views/getDataByType.jsp?type', function(dataset) {*/
    //自己改动
    d3.json('data/allType.json', function(dataset) {
        // Have chart[i].key == district
        // return district in chart[obj.key,obj.key...] ? true : false
        var _districtInChart = function(district, chart) {
            var length = chart.length
            for (var i = 0; i < length; i++) {
                if (district == chart[i].key) {
                    return true
                }
            }
            return false
        }

        // 增加ChartData元素obj的value值
        var _insertDataValue = function(chartArr, dataObj) {

            for (var i = 0; i < chartArr.length; i++) {

                var chartObj = chartArr[i]

                var key = chartObj.key
                var type = dataObj.type

                // 过滤掉type：3的数据
                if(type == 3) continue

                if (key == dataObj.district) {
                    if (type == 1) {
                        chartArr[i].value[0] += dataObj.money
                    } else {
                        chartArr[i].value[1] += dataObj.currentmoney
                    }
                }

            } // end for
        }

        // 初始化绘制foot图表数据 chartDatas = [{key,[type.Money, type2.currentMoney]},...]
        var chartDatas = []
        for (var i = 0; i < dataset.length; i++) {

            // 过滤type:3的数据
            if(dataset[i].type == 3) continue

            var data = dataset[i]

            // Have chart[i].key == district
            var haveKey = _districtInChart(dataset[i].district, chartDatas)
            if (haveKey) {
                // 匹配key，增加chartDatas的value值
                _insertDataValue(chartDatas, data)

            } else {
                var obj = {}
                obj.key = data.district
                obj.value = [0, 0]
                chartDatas.push(obj)
            }

        } // end for

        var chartValueMax = d3.max(chartDatas, function(d) {
            return d.value[0] > d.value[1] ? d.value[0] : d.value[1]
        })

        var keys = []

        for (var i = 0; i < chartDatas.length; i++) {
            keys.push(chartDatas[i].key)
        }

        var type3 = []
        console.log('dataset', dataset)
        for(var i = 0; i < dataset.length; i++) {
            if(dataset[i].type == 3) {
                type3.push(dataset[i])
            }
        }

        console.log('type3', type3)

        xScale = d3.scale.ordinal()
            .domain(keys)
            .rangeRoundBands([0, chartAttr.width], 0.5, 0.5)

        hScale = d3.scale.linear()
            .domain([0, chartValueMax])
            .range([0, chartAttr.height])

        yScale = d3.scale.linear()
            .domain([chartValueMax, 0])
            .range([0, chartAttr.height])

        var xAxisConfig = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')

        var yAxisConfig = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(5)

        var chart = d3.select('.foot svg').append('g').classed('chart', true)
            .attr({
                'transform': 'translate(' + chartAttr.x + ',0)',
            })

        var axis = chart.append('g').classed('axis', true)
        var xAxis = axis.append('g').classed('xAxis', true).attr('transform', 'translate(0,' + chartAttr.y + ')')
        var yAxis = axis.append('g').classed('yAxis', true).attr('transform', 'translate(0,' + 13 + ')')

        xAxis.call(xAxisConfig)
        yAxis.call(yAxisConfig)

        var core = chart.append('g').classed('coreImg', true).attr('transform', 'translate(0,' + chartAttr.y + ')')
        spacing = xScale.rangeBand() * 0.3

        var construct_chart = core.append('g').classed('rect1', true)
            .selectAll('rect.construct')
            .data(chartDatas)
            .enter()
            .append('rect').classed('construct', true)
            .attr({
                'width': (xScale.rangeBand() - spacing) / 2,
                'height': function(d, i) {
                    return 0
                },
                'x': function(d, i) {
                    return xScale(d.key)
                },
                'y': function(d, i) {
                    return 0
                },
                'fill': '#ffff00',
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
                    .text('项目投资：' + d.value[0])
            })
            .on('mouseleave', function(d, i) {
                d3.select(this).attr({
                    'fill': 'yellow'
                })
                d3.select('#tooltip').remove()
            })
            .transition()
            .duration(animationTime)
            .attr({
                'height': function(d, i) {
                    return hScale(d.value[0])
                },
                'y': function(d, i) {
                    return -hScale(d.value[0])
                }
            })

        var operation_chart = core.append('g').classed('rect2', true)
            .selectAll('rect.operation')
            .data(chartDatas)
            .enter()
            .append('rect').classed('operation', true)
            .attr({
                'width': (xScale.rangeBand() - spacing) / 2,
                'height': 0,
                'x': function(d, i) {
                    return xScale(d.key) + (xScale.rangeBand()) / 2
                },
                'y': 0,
                'fill': '#034eff',
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
                    .text('资产价值：' + d.value[1])
            })
            .on('mouseleave', function(d, i) {
                d3.select(this).attr({
                    'fill': 'blue'
                })
                d3.select('#tooltip').remove()
            })
            .transition()
            .duration(animationTime)
            .attr({
                'height': function(d, i) {
                    return hScale(d.value[1])
                },
                'y': function(d, i) {
                    return -hScale(d.value[1]) - 1
                },
            })

    }) // end d3.json(type)
} // end _drawchart

// to do
// pop
function _listAction() {

    //legend 交互
    var legendAttr = [true, true] //true 添加

    var construct_chart = d3.select('.foot .coreImg .rect1').selectAll('rect')
    var operation_chart = d3.select('.foot .coreImg .rect2').selectAll('rect')

    var construct_points = d3.select('.map .points .type1').selectAll('circle')
    var operation_points = d3.select('.map .points .type2').selectAll('circle')

    $('.main .tip').find('li').bind('click', function() {

        var construct_chart = d3.select('.foot .coreImg .rect1').selectAll('rect')
        var operation_chart = d3.select('.foot .coreImg .rect2').selectAll('rect')

        var construct_points = d3.select('.map .points .type1').selectAll('g').select('circle')
        var operation_points = d3.select('.map .points .type2').selectAll('g').select('circle')

        var index = $(this).index()

        legendAttr[index] = legendAttr[index] ? false : true

        if (legendAttr[index]) {
            $(this).find('span').css({
                'color': '#90cdff'
            })
        }
        if (!legendAttr[index]) {
            $(this).find('span').css({
                'color': '#ccc'
            })
        }

        if (legendAttr[0] && legendAttr[1]) {
            construct_chart.transition().duration(animationTime)
                .attr({
                    'width': (xScale.rangeBand() - spacing) / 2,
                    'x': function(d, i) {
                        return xScale(d.key)
                    },
                })

            operation_chart.transition().duration(animationTime)
                .attr({
                    'width': (xScale.rangeBand() - spacing) / 2,
                    'x': function(d, i) {
                        return xScale(d.key) + (xScale.rangeBand()) / 2
                    }
                })

            construct_points.transition().duration(animationTime)
                .attr({
                    'opacity': 0.6
                })
            operation_points.transition().duration(animationTime)
                .attr({
                    'opacity': 0.6
                })
        } else if (!legendAttr[0] && legendAttr[1]) {
            // construct_chart 隐藏
            construct_chart.transition().duration(animationTime)
                .attr({
                    'width': 0
                })
            // operation_chart 加大
            operation_chart.transition().duration(animationTime)
                .attr({
                    'width': xScale.rangeBand(),
                    x: function(d) {
                        return xScale(d.key)
                    }
                })

            construct_points.transition().duration(animationTime)
                .attr({
                    'opacity': 0
                })
            operation_points.transition().duration(animationTime)
                .attr({
                    'opacity': 0.6
                })
        } else if (legendAttr[0] && !legendAttr[1]) {
            construct_chart.transition().duration(animationTime)
                .attr({
                    'width': xScale.rangeBand()
                })

            operation_chart.transition().duration(animationTime)
                .attr({
                    'width': 0,
                })

            construct_points.transition().duration(animationTime)
                .attr({
                    'opacity': 0.6
                })
            operation_points.transition().duration(animationTime)
                .attr({
                    'opacity': 0
                })
        } else if (!legendAttr[0] && !legendAttr[1]) {
            construct_chart.transition().duration(animationTime)
                .attr({
                    width: 0
                })

            operation_chart.transition().duration(animationTime)
                .attr({
                    'width': 0,
                })

            construct_points.transition().duration(animationTime)
                .attr({
                    'opacity': 0
                })
            operation_points.transition().duration(animationTime)
                .attr({
                    'opacity': 0
                })
        }
    })
}


tianjinMap()
_drawPoints()
_drawchart()
_listAction()