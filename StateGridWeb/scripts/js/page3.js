var legend0 = true
var legend1 = true
var legend2 = true

var dirOld = []
var dirNew = []

var year = []
    /*d3.json('http://localhost:8080/StateGridWeb/views/getStorage.jsp?No=BAAA', function(dataset) {*/
    //自己改动
d3.json('data/mydata/noBAAA.json', function(dataset) {

})

// create 虚拟数据 end
var mapfill = 'data/tianjing.json'

var graphAttr = {
    width: 752,
    height: 100,
}

getStorage = null

var TianjinMap = function() {
    var mapPosition = d3.select('.map')[0][0].getBoundingClientRect();
    // var footPosition = d3.select('.foot')[0][0].getBoundingClientRect();
    mapSvgAttr = {
        width: mapPosition.width,
        height: mapPosition.height,
    }
    mapSvg = d3.select('.map').append('svg')
        .attr({
            'width': mapSvgAttr.width,
            'height': mapSvgAttr.height,
        })
}

function tianjinMap() {
    TianjinMap()

    var projection = d3.geo.mercator()
        .scale([89000])
        .center([117.2, 39.5])

    projection2 = d3.geo.mercator()
        .scale([89000])
        .center([117.23, 39.5])

    var path = d3.geo.path().projection(projection);
    var path2 = d3.geo.path().projection(projection2);

    d3.json(mapfill, function(json) {
        tianjinBg = mapSvg.append("g").classed('tianjinBg', true)
            .selectAll("path")
            .data(json).enter()
            .append("path")
            .attr({
                'd': path,
                'fill': function(d, i) {
                    return "#329ad4" /*colors(i)*/ ;
                },
                "stroke-width": "1px",
                "stroke-linecap": "round",
                "stroke": "#1d75aa",
            })

        // 区名
        quArr = [
            '国网天津电力蓟县仓库',
            '国网天津电力武清仓库',
            '国网天津电力宝坻仓库',
            '国网天津电力静海仓库',
            '国网天津电力宁河仓库',
            '大港区',
            '国网天津电力滨海仓库',
            '西青区',
            '北辰区',
            '国网天津电力东丽中心库',
            '汉沽区',
            '津南区',
            '国网天津电能计量中心郁江道仓储点',
            '国网天津电能计量中心郁江道仓储点',
            '国网天津电能计量中心郁江道仓储点',
            '国网天津电能计量中心郁江道仓储点',
            '国网天津电能计量中心郁江道仓储点',
            '国网天津电能计量中心郁江道仓储点'
        ]
        tianjin = mapSvg.append("g").classed('tianjin', true)
            .selectAll("path")
            .data(json).enter()
            .append("path")
            .attr({
                'd': path2,
                'fill': "#2aaaf9",
                "stroke-width": "1px",
                "stroke-linecap": "round",
                "stroke": "#bfdef8",
                'name': function(d, i) {
                    return quArr[i]
                }
            })

        _listAction()
        // d3.json("/StateGrid/views/getDataByType.jsp?type=3", function(dataset) {
        //原始的type3.json
        d3.json("data/type3.json", function(dataset) {
            function _drawPoints() {

                var place = []
                for (var i = 0; i < dataset.length; i++) {
                    var longitude = dataset[i].longitude
                    var latitude = dataset[i].latitude
                    var name = dataset[i].name
                    var warehouseLevel = dataset[i].warehouseLevel
                    place.push([longitude, latitude, name, warehouseLevel])
                }

                // 仓库circle
                points = mapSvg.append('g').classed('points', true)
                    .selectAll('g')
                    .data(d3.entries(place))
                    .enter()
                    .append('g')
                    .attr({
                        'transform': function(d) {
                            console.log('坐标', d.value)
                            return "translate(" + projection(d.value) + ")"
                        },
                        'name': function(d) {
                            return d.value[2]
                        },
                        'warehouseLevel': function(d) {
                            return d.value[3]
                        }
                    })

                var point = points
                    .filter(function(d, i) {
                        var warehouseLevel = d3.select(this).attr('warehouseLevel')
                        if (warehouseLevel == '周转库') {
                            return this
                        } else {
                            return null
                        }
                    })
                    .append('circle')
                    .attr({
                        'r': 7,
                        'stroke-width': 6,
                        'stroke': 'white',
                        'fill': 'none',
                    })

                var centerPoint = points
                    .filter(function(d, i) {
                        var warehouseLevel = d3.select(this).attr('warehouseLevel')
                        if (warehouseLevel == '中心库') {
                            return this
                        } else {
                            return null
                        }
                    })
                centerPoint.append('circle')
                    .attr({
                        'r': 17,
                        'stroke-width': 6,
                        'stroke': 'white',
                        'fill': 'none',
                    })
                centerPoint.append('circle')
                    .attr({
                        'r': 7,
                        'stroke-width': 6,
                        'stroke': 'white',
                        'fill': 'none',
                    })

                warehouses = points
                    .filter(function(d, i) {
                        var warehouseLevel = d3.select(this).attr('warehouseLevel')
                        if (warehouseLevel == '省专业仓储点') {
                            return this
                        } else {
                            return null
                        }
                    })
                    .append('rect')
                    .attr({
                        'width': 8,
                        'height': 8,
                        'fill': 'none',
                        'stroke-width': 4,
                        'stroke': 'white',
                        'transform': 'rotate(45,6, 6)',
                    })

            } // end drawPoints()    
            _drawPoints();


            tipShadowData = null

            function _drawTips() {
                var tipsCoordinate = [{
                    name: '国网天津电力滨海仓库',
                    point: [998, 424],
                    size: [118, 26],
                    dir: 'binhai',
                    warehouseLevel: '周转库'
                }, {
                    name: '国网天津电力蓟县仓库',
                    point: [1001, 112],
                    size: [118, 26],
                    dir: 'jixian',
                    warehouseLevel: '周转库'
                }, {
                    name: '国网天津电力静海仓库',
                    point: [827, 459],
                    size: [118, 26],
                    dir: 'jinghai',
                    warehouseLevel: '周转库'
                }, {
                    name: '国网天津电力宁河仓库',
                    point: [1042, 337],
                    size: [117, 25],
                    dir: 'ninghe',
                    warehouseLevel: '周转库'
                }, {
                    name: '国网天津电力武清仓库',
                    point: [755, 320],
                    size: [96, 25],
                    dir: 'wuqing',
                    warehouseLevel: '周转库'
                }, {
                    name: '国网天津电力宝坻仓库',
                    point: [911, 216],
                    size: [118, 26],
                    dir: 'baodi',
                    warehouseLevel: '周转库'
                }, {
                    name: '国网天津电力东丽中心库',
                    point: [730, 359],
                    size: [197, 44],
                    dir: 'dongli',
                    warehouseLevel: '中心库'
                }, {
                    name: '国网天津电能计量中心郁江道仓储点',
                    point: [770, 427],
                    size: [137, 25],
                    dir: 'shiqu',
                    warehouseLevel: '省专业仓储点'
                }]
                var drawTipsShadow = function(dataset) {
                    var buff = []

                    for (var i = 0; i < tipsCoordinate.length; i++) {

                        var name = tipsCoordinate[i].name

                        for (var j = 0; j < dataset.length; j++) {

                            if (name == dataset[j].name) {

                                buff.push(dataset[j])
                                break

                            }


                        }

                    }
                    dataset = buff

                    mapSvg.append('g').classed('tips', true)
                        .attr({
                            'transform': 'translate(-406,-52)'
                        })
                        .selectAll('image')
                        .data(dataset)
                        .enter()
                        .append('image')
                        .attr({
                            'x': function(d, i) {
                                return tipsCoordinate[i].point[0]
                            },
                            'y': function(d, i) {
                                return tipsCoordinate[i].point[1]
                            },
                            'width': function(d, i) {
                                return tipsCoordinate[i].size[0]
                            },
                            'height': function(d, i) {
                                return tipsCoordinate[i].size[1]
                            },
                            'xlink:href': function(d, i) {
                                return dirOld[i]
                            },
                            'warehouseLevel': function(d) {
                                return d.warehouseLevel
                            },
                            'name': function(d) {
                                return d.name
                            },
                            'warehouseArea': function(d, i) {
                                return d.warehouseArea
                            },
                            'totalArea': function(d, i) {
                                return d.totalArea
                            },
                            'fieldArea': function(d, i) {
                                return d.fieldArea
                            },
                            'shadowArea': function(d, i) {
                                return d.shadowArea
                            }

                        })
                        .style('cursor', 'pointer')
                        .on('click', function(d, i) {
                            $('.list-content li').eq(i + 1).click()
                        })
                        .on('mouseover', function(d, i) {
                            var name = d.name // 仓库名称
                            var warehouseArea = d.warehouseArea // 库房面积
                            var totalArea = d.totalArea // 总占地面积
                            var fieldArea = d.fieldArea // 堆场面积
                            var shadowArea = d.shadowArea // 货盆面积 

                            var position = d3.mouse(d3.select('html')[0][0])
                            var xpp = position[0]
                            var ypp = position[1]

                            var tooltip = d3.select('body').append('div').attr('id', 'tooltip')
                                .style({
                                    'left': xpp,
                                    'top': ypp
                                })

                            tooltip.append('p').text('仓库名称: ' + name)
                            tooltip.append('p').text('总占地面积: ' + totalArea)
                            tooltip.append('p').text('堆场面积: ' + fieldArea)
                            tooltip.append('p').text('货篷面积: ' + shadowArea)
                        })
                        .on('mouseout', function() {
                            d3.select('#tooltip').remove()
                        })
                }


                if (tipShadowData) {
                    drawTipsShadow(tipShadowData)
                } else {
                    /*d3.json('http://localhost:8080/StateGridWeb/views/getDataByType.jsp?type=3', function(dataset) {*/
                    //自己改动
                    d3.json('data/type3.json', function(dataset) {
                        // 重新排序 读入的仓库数据
                        tipShadowData = dataset
                        drawTipsShadow(tipShadowData)
                    })
                }



                var imageDir = 'images/tages/'
                var fileType = '.png'

                for (var i = 0; i < tipsCoordinate.length; i++) {
                    dirOld.push(imageDir + tipsCoordinate[i].dir + fileType)
                    dirNew.push(imageDir + tipsCoordinate[i].dir + '-hover' + fileType)
                }
            }
            _drawTips()
        })

    })
} // end tianjinMap()

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
                //  .classed('max', true)
                //  .selectAll('rect.maxColum')
                //  .data(mouthArr)
                //  .enter()
                //  .append('rect').classed('maxColum', true)
                //  .attr({
                //      'x': function(d, i) {
                //          return xMouthScale(i + 1) + 0.5
                //      },
                //      'y': function(d) {
                //          return 100 - yScale(maxRectData) + 1
                //      },
                //      'width': function(d, i) {
                //          return xMouthScale.rangeBand() - 2
                //      },
                //      'height': function(d) {
                //          return yScale(maxRectData)
                //      },
                //      'stroke-dasharray': '4,3',
                //      'stroke': 'white',
                //      'stroke-width': 1,
                //      'fill': 'none'
                //  })

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

// 交互
function _listAction() {
    //legend

    $('.main .tip').find('li').eq(0).click(function() {
        if (legend0) {
            $(this).find('span').css('color', '#ccc')

            d3.select('.points')
                .selectAll('g')
                .filter(function(d, i) {
                    var warehouseLevel = d3.select(this).attr('warehouseLevel')
                    if (warehouseLevel == '中心库') {
                        return this
                    }
                }).style({
                    'display': 'none',
                })

            d3.select('.tips')
                .selectAll('image')
                .filter(function(d, i) {
                    var warehouseLevel = d3.select(this).attr('warehouseLevel')
                    if (warehouseLevel == '中心库') {
                        return this
                    }
                })
                .style({
                    'display': 'none',
                })
        } else {
            $(this).find('span').css('color', '#90cdff')

            d3.select('.points').selectAll('g').filter(function(d, i) {
                var warehouseLevel = d3.select(this).attr('warehouseLevel')
                if (warehouseLevel == '中心库') {
                    return this
                }
            }).style({
                'display': 'block'
            })

            d3.select('.tips')
                .selectAll('image').filter(function(d, i) {
                    var warehouseLevel = d3.select(this).attr('warehouseLevel')
                    if (warehouseLevel == '中心库') {
                        return this
                    }
                })
                .style({
                    'display': 'block',
                })
        }
        legend0 = !legend0
    })

    $('.main .tip').find('li').eq(1).click(function() {
        if (legend1) {
            $(this).find('span').css('color', '#ccc')
            d3.select('.points')
                .selectAll('g')
                .filter(function(d, i) {
                    var warehouseLevel = d3.select(this).attr('warehouseLevel')
                    if (warehouseLevel == '周转库') {
                        return this
                    }
                })
                .style({
                    'display': 'none',
                })

            d3.select('.tips')
                .selectAll('image')
                .filter(function(d, i) {
                    var warehouseLevel = d3.select(this).attr('warehouseLevel')
                    if (warehouseLevel == '周转库') {
                        return this
                    }
                })
                .style({
                    'display': 'none',
                })
        } else {
            $(this).find('span').css('color', '#90cdff')
            d3.select('.points')
                .selectAll('g')
                .filter(function(d, i) {
                    var warehouseLevel = d3.select(this).attr('warehouseLevel')
                    if (warehouseLevel == '周转库') {
                        return this
                    }
                }).style({
                    'display': 'block',
                })

            d3.select('.tips')
                .selectAll('image')
                .filter(function(d, i) {
                    var warehouseLevel = d3.select(this).attr('warehouseLevel')
                    if (warehouseLevel == '周转库') {
                        return this
                    }
                })
                .style({
                    'display': 'block',
                })
        }

        legend1 = !legend1
    })

    $('.main .tip').find('li').eq(2).click(function() {
        if (legend2) {
            $(this).find('span').css('color', '#ccc')

            d3.select('.points')
                .selectAll('g')
                .filter(function(d, i) {
                    var warehouseLevel = d3.select(this).attr('warehouseLevel')
                    if (warehouseLevel == '省专业仓储点') {
                        return this
                    }
                })
                .style({
                    'display': 'none',
                })
            d3.select('.tips')
                .selectAll('image').filter(function(d, i) {
                    var warehouseLevel = d3.select(this).attr('warehouseLevel')
                    if (warehouseLevel == '省专业仓储点') {
                        return this
                    }
                })
                .style({
                    'display': 'none',
                })
        } else {
            $(this).find('span').css('color', '#90cdff')

            d3.select('.points')
                .selectAll('g')
                .filter(function(d, i) {
                    var warehouseLevel = d3.select(this).attr('warehouseLevel')
                    if (warehouseLevel == '省专业仓储点') {
                        return this
                    }
                }).style({
                    'display': 'block',
                })

            d3.select('.tips')
                .selectAll('image').filter(function(d, i) {
                    var warehouseLevel = d3.select(this).attr('warehouseLevel')
                    if (warehouseLevel == '省专业仓储点') {
                        return this
                    }
                })
                .style({
                    'display': 'block',
                })

        }
        legend2 = !legend2
    })
    // 点击事件
    $('.main .list .list-content').find('li').bind('click', function() {
        //与图例的联动
        if (!legend0) {
            $('.map .points').find('g:eq(6)').css('display', 'none')
            $('.map .tips').find('image:eq(6)').css('display', 'none')
        }
        if (!legend1) {
            $('.map .points').find('g:lt(6)').css('display', 'none')
            $('.map .tips').find('image:lt(6)').css('display', 'none')
        }
        if (!legend2) {
            $('.map .points').find('g:gt(6)').css('display', 'none')
            $('.map .tips').find('image:gt(6)').css('display', 'none')
        }

        var index = $(this).index()
        var warehouseId = $(this).attr('warehouseId')

        if (index) {
            index = index - 1

            d3.select('.map .tips')
                .selectAll('image')
                .filter(function(d, i) {
                    if (index == i) {
                        return this
                    }
                })
                .attr('opacity', 0.1)
                .transition()
                .duration(1500)
                .attr('opacity', 1)

            var name = $(this).attr('name')

            $(this).css('color', '#56b1fc')
                .siblings()
                .css('color', 'white')

            $('svg').find('.tianjin').find('[name=' + name + ']')
                .css({
                    'fill': '#baedff',
                    'stroke': '#baedff'
                })
                .parent()
                .find('[name!=' + name + ']')
                .css({
                    'fill': '#2aaaf9',
                    'stroke': '#bfdef8'
                })

            $('.map').find('svg').find('.points').find('[name=' + name + ']').find('circle')
                .css('stroke', '#3b8fd4')
                .parent().siblings().children()
                .css('stroke', 'white')

            if (index == 7) {
                $('.map').find('svg').find('.points').find('[name=' + name + ']').find('rect')
                    .css('stroke', '#3b8fd4')
                    .parent().siblings().find('circle')
                    .css('stroke', 'white')
            }

            for (var i = 0; i < dirOld.length; i++) {
                $('.tips image').eq(i).attr('href', dirOld[i])
            }

            $('.tips image').eq(index).attr('href', dirNew[index])

            d3.select('.points')
                .selectAll('g').filter(function() {
                    if (d3.select(this).attr('name') == name) {
                        return true
                    }
                })
                .style({
                    'display': 'block',
                })

            d3.select('.tips')
                .selectAll('image').filter(function() {
                    if (d3.select(this).attr('name') == name) {
                        return true
                    }
                })
                .style({
                    'display': 'block',
                })
            // data切换为相应仓库的数据
            console.log('warehouseId', warehouseId)
            _graph(warehouseId)
        } else { // 点击ALL 计算所有数据之和
            $(this).parent().find('li').eq(0).css('color', '#56b1fc')
                .siblings().css('color', 'white')

            $('.map .points')
                .find('circle')
                .css('stroke', 'white')

            console.log('!!!!!!!')

            var $image = $('.map .tips image')
            var length = $image.length
            for (var i = 0; i < length; i++) {
                var href = $image.eq(i).attr('href')
                if (href.search() != -1) {
                    var replaceHref = href.replace(/-hover.png/, ".png")
                    $image.eq(i).attr('href', replaceHref)
                }
                // $image.attr('href', replaceHref)
            }



            _graph(warehouseId)
        }
    })

    setTimeout(function() {
        $('.main .list .list-content li').first().click()
    }, 100)

    $('#page3 .tianjin path').bind('click', function() {
        var name = $(this).attr('name')
        $('.list-content').find('[name=' + name + ']').click()
    })

    nameArr = []
    var $li = $('.list-content').find('li')
    var $path = $('.tianjin').find('path')

    for (var i = 0; i < $li.length; i++) {
        nameArr.push($li.eq(i).attr('name'))
    }

    // arr中有str则返回true
    inNameArr = function(str, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == str) {
                return true
            }
        }
        return false
    }

    for (var i = 0; i < $path.length; i++) {
        var name = $path.eq(i).attr('name')
        if (inNameArr(name, nameArr)) {
            $('.tianjin')
                .find('path').eq(i)
                .css('cursor', 'pointer')
        }
    }
}

tianjinMap();