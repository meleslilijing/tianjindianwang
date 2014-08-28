//type3 八个仓库的点，需要用本地数据，服务器上type3的坐标有误

/*d3.json('http://localhost:8080/StateGridWeb/views/getDataByType.jsp?type=1', function(dataType1) {
    d3.json('http://localhost:8080/StateGridWeb/views/getDataByType.jsp?type=2', function(dataType2) {
*/
//自己改动
d3.json('data/type1.json', function(dataType1) {
    d3.json('data/type2.json', function(dataType2) {
        //原始type3.json
        d3.json('data/type3.json', function(dataType3) {

            var typeRate = [];
            var num = 0;

            var animationTime = 2000

            // projection = d3.geo.equirectangular()
            //     .scale([18000])
            //     .center([117.2, 39.5])

            projection = d3.geo.mercator()
                .scale([89000])
                .center([117.2, 39.5])

            var path = d3.geo.path().projection(projection);
            var TianjinMap = function() {
                var mapPosition = d3.select('.map')[0][0].getBoundingClientRect();

                mapSvgAttr = {
                    width: mapPosition.width,
                    height: mapPosition.height,
                }

                mapSvg = d3.select('.map').append('svg')
                    .attr('id', 'svg')
                    .attr({
                        'width': mapSvgAttr.width,
                        'height': mapSvgAttr.height,
                    })
            }

            var tianjinMap = function() {
                    TianjinMap()

                    d3.json('data/tianjing.json', function(json) {
                        var g = mapSvg.append('g').classed('tianjin', true);
                        g.selectAll('path')
                            .data(json).enter()
                            .append('path')
                            .attr({
                                'd': path,
                                'fill': function(d, i) {
                                    return 'none' /*colors(i)*/ ;
                                },
                                'stroke-width': '1px',
                                'stroke-linecap': 'round',
                                'stroke': '#7ba5ae',
                            })

                        _listAction(dataType1, dataType2, dataType3)
                    })



                } // end tianjinMap()

            var drawLine = function(data1, data2, data3, no, clearMap) {
                console.log('data3', data3)


                var type1 = []
                var type2 = []
                var type3 = []

                // 过滤等级对应电压
                var filterArr = [0, 35, 110, 220]

                filter = filterArr[0] // 过滤等级

                for (var i = 0; i < data1.length; i++) {
                    if (data1[i].voltageLevel > filter) {
                        type1.push(data1[i])
                    }
                }

                for (var i = 0; i < data2.length; i++) {
                    if (data2[i].voltageLevel > filter) {
                        type2.push(data2[i])
                    }
                }

                for (var i = 0; i < data3.length; i++) {
                    type3.push(data3[i])
                }

                var drawData = []

                for (var i = 0; i < type3.length; i++) {

                    // 过滤数据: 筛选出和no相符的数据
                    if (type3[i].no != no) {
                        continue
                    }

                    var temp = {}
                    temp.source = {}
                    temp.source.coordinates = [type3[i].longitude, type3[i].latitude]
                    temp.source.no = type3[i].no
                    temp.source.type = 'source'

                    temp.target = []
                    // alert('temp', temp)
                    for (var j = 0; j < type1.length; j++) {

                        if (type1[j].warehouseNo == temp.source.no) {

                            var obj = {}

                            obj.coordinates = [type1[j].longitude, type1[j].latitude]

                            obj.type = 'target1'

                            temp.target.push(obj)
                        }
                    }

                    for (var j = 0; j < type2.length; j++) {

                        if (type2[j].warehouseNo == temp.source.no) {

                            var obj = {}

                            obj.coordinates = [type2[j].longitude, type2[j].latitude]

                            obj.type = 'target2'

                            temp.target.push(obj)
                        }
                    }

                    drawData.push(temp)
                } // end for


                var svg = d3.select('#svg')
                    .append('g')
                    .classed(no, true)
                    .classed('draw', true)

                // projection
                var points = svg.append('g').classed('points', true)

                // 仓库点
                var warehousePoints = points.selectAll('circle.warehousePoint')
                    .data(drawData)
                    .enter()
                    .append('circle').classed('warehousePoint', true)
                    .attr({
                        'r': 5,
                        'fill': 'white',
                        'transform': function(d) {
                            return 'translate(' + projection(d.source.coordinates) + ')'
                        }

                    })

                // var testCoordinates = [
                //     [117.66666666667, 40.05000001]
                // ]
                // var testPoints = points.selectAll('circle.testPoints')
                //     .data(testCoordinates)
                //     .enter()
                //     .append('circle').classed('testPoints', true)
                //     .attr({
                //         'r': 15,
                //         'fill': 'red',
                //         'transform': function(d) {
                //             return 'translate(' + projection(d) + ')'
                //         }

                //     })

                // 项目或设备点
                var point = points.selectAll('circle.points')
                    .data(drawData[0].target)
                    .enter()
                    .append('circle')
                    .attr({
                        'class': function(d) {
                            if (d.type == 'target1') {
                                return 'point1';
                            } else {
                                return 'point2'
                            }
                        },
                        'r': 2,
                        'fill': function(d) {
                            if (d.type == 'target1') {
                                return '#26a9f7';
                            } else {
                                return '#05d4a2'
                            }
                        },
                        'transform': function(d) {
                            return 'translate(' + projection(d.coordinates) + ')'
                        },
                        'opacity': 0
                    })
                    .classed('point', true)
                    .transition()
                    .duration(animationTime)
                    .attr('opacity', 1)

                var centerPointCoordinates = projection(drawData[0].source.coordinates)

                // 连线
                var lines = svg.append('g').classed('lines', true)

                lines.selectAll('line')
                    .data(drawData[0].target)
                    .enter()
                    .append('line')
                    .attr({
                        'class': function(d) {
                            if (d.type == 'target1') {
                                return 'line1';
                            } else {
                                return 'line2'
                            }
                        },
                        'x1': centerPointCoordinates[0],
                        'y1': centerPointCoordinates[1],
                        'x2': centerPointCoordinates[0],
                        'y2': centerPointCoordinates[1],
                        'stroke-width': 1,
                        'stroke': function(d) {
                            if (d.type == 'target1') {
                                return '#26a9f7'
                            } else {
                                return '#05d4a2'
                            }
                        },

                    })
                    .transition()
                    .duration(animationTime)
                    .attr({
                        'x2': function(d) {
                            return projection(d.coordinates)[0]
                        },
                        'y2': function(d) {
                            return projection(d.coordinates)[1]
                        },
                    })

            }

            // 交互 _listAction
            var _listAction = function(type1, type2, type3) { // 类型为1、2、3的数据

                // 绘制底部饼图
                var drawFooter = function(selector, width, height) {

                    var _drawPie = function(dataset, footSvg, left, message) {

                            console.log('dataset', dataset)


                            var no = dataset.no
                            var output = dataset.data

                            // console.log('no', no)
                            console.log(no, ':', output)

                            var projectRequirement = dataset.projectRequirement
                            var equipmentRequirement = dataset.equipmentRequirement

                            var data = [projectRequirement, equipmentRequirement]

                            var radius = 49;

                            var arc = d3.svg.arc()
                                .outerRadius(radius);

                            var pie = d3.layout.pie();

                            footSvg = footSvg.append('g')
                                .attr('transform', 'translate(' + (left + 30) + ',' + 70 + ')')
                                .attr('class', 'pie')
                                .attr('name', no)

                            var arcs = footSvg.selectAll('g.arc')
                                .data(pie(data))
                                .enter()
                                .append('g')
                                .classed('arc', true)

                            arcs.append('path')
                                .attr({
                                    'fill': function(d, i) {
                                        d.distable = true;
                                        if (i == 0) {
                                            return '#26a9f7'; // blue
                                        } else {
                                            return '#05d4a2'; // green
                                        }
                                    },
                                    'd': arc,
                                    // 'type': function(d, i)
                                })
                                .on('mouseover', function(d, i) {

                                    var tipStr = i == 0 ? '项目物资需求： ' : '设备物资需求： '

                                    d3.select(this).attr('opacity', 0.5)

                                    d3.select('body')
                                        .append('div')
                                        .attr('id', 'tooltip')
                                        .append('p')

                                    var position = d3.mouse(d3.select('html')[0][0])
                                    var xpp = position[0];
                                    var ypp = position[1];

                                    d3.select('#tooltip')
                                        .style({
                                            'left': xpp,
                                            'top': ypp
                                        })
                                        .select('p')
                                        .text(tipStr + d.data)
                                })
                                .on('mouseout', function() {
                                    d3.select(this).attr('opacity', 1)

                                    d3.select('#tooltip').remove()
                                })
                                .on('click', function(e, i) {

                                    var index = i

                                    var vectx, vecty;

                                    vectx = 10 * Math.cos((e.startAngle + e.endAngle) / 2 - Math.PI / 2)
                                    vecty = 10 * Math.sin((e.startAngle + e.endAngle) / 2 - Math.PI / 2)

                                    // text 偏移量
                                    var textx = (radius * 0.7) * Math.cos((e.startAngle + e.endAngle) / 2 - Math.PI / 2)
                                    var texty = (radius * 0.7) * Math.sin((e.startAngle + e.endAngle) / 2 - Math.PI / 2) + 6

                                    var tx = parseFloat(textx)
                                    var ty = parseFloat(texty)

                                    e.distable = !e.distable;

                                    if (!e.distable) {

                                        // path
                                        d3.select(this)
                                            .transition()
                                            .ease('circle')
                                            .duration(500)
                                            .ease('circle')
                                            .attr('transform', 'translate(' + vectx + ',' + vecty + ')')

                                        d3.select('.foot svg').selectAll('g')
                                            .filter(function(d, i) {

                                                var name = d3.select(this).attr('name')
                                                if (no == name) {
                                                    return this
                                                }
                                            })
                                            .selectAll('.arc')
                                            .filter(function(d, i) {
                                                if (i == index) {
                                                    return this
                                                }
                                            })
                                            .select('text')
                                            .transition()
                                            .ease('circle')
                                            .duration(500)
                                            .attr('transform', 'translate(' + (vectx + tx) + ',' + (vecty + ty) + ')')

                                    } else {

                                        // path
                                        d3.select(this)
                                            .transition()
                                            .ease('circle')
                                            .duration(500)
                                            .ease('circle')
                                            .attr('transform', 'translate(0, 0)')
                                            .duration(1000)

                                        d3.select('.foot svg').selectAll('g')
                                            .filter(function(d, i) {

                                                var name = d3.select(this).attr('name')
                                                if (no == name) {
                                                    return this
                                                }
                                            })
                                            .selectAll('.arc')
                                            .filter(function(d, i) {
                                                if (i == index) {
                                                    return this
                                                }
                                            })
                                            .select('text')
                                            .transition()
                                            .ease('circle')
                                            .duration(500)
                                            .attr('transform', 'translate(' + (tx) + ',' + (ty) + ')')
                                    }
                                })
                                .transition()
                                .duration(2000)
                                .attrTween('d', _tweenPie)
                                .transition()
                                .ease('elastic')
                                .duration(3750)
                                .attrTween('d', _tweenDonut)

                            // pie图上的文字
                            arcs.append('text')
                                .attr({
                                    'transform': function(d) {

                                        var textx = (radius * 0.7) * Math.cos((d.startAngle + d.endAngle) / 2 - Math.PI / 2)
                                        var texty = (radius * 0.7) * Math.sin((d.startAngle + d.endAngle) / 2 - Math.PI / 2) + 6

                                        var x = parseFloat(textx)
                                        var y = parseFloat(texty)

                                        return 'translate(' + x + ',' + y + ')'
                                    },
                                    'text-anchor': 'middle'
                                })
                                .text(function(d) {
                                    return d.data
                                })
                                .attr({
                                    'font-family': '微软雅黑',
                                    'font-size': '12px',
                                    'fill': 'rgb(255,255,255)',
                                    'pointer-events': 'none',
                                })

                            function _tweenPie(b) {
                                b.innerRadius = 0;
                                var i = d3.interpolate({
                                    startAngle: 6.28,
                                    endAngle: 6.28
                                }, b);
                                return function(t) {
                                    return arc(i(t));
                                };
                            }

                            function _tweenDonut(b) {
                                b.innerRadius = radius * 0.4;
                                var i = d3.interpolate({
                                    innerRadius: 0
                                }, b);
                                return function(t) {
                                    return arc(i(t));
                                }
                            }

                            footSvg.append('text')
                                .text(message)
                                .attr('font-size', '16px')
                                .attr('fill', 'white')
                                .attr({
                                    'transform': function(d) {
                                        if('郁江道仓储点' == message) {
                                            return 'translate(-45, 63)'
                                        }
                                        return 'translate(-35, 63)'
                                    } 
                                })
                                .style('pointer-events', 'none')
                        } // end drawPie

                    if (d3.selectAll('.pie')[0].length !== 0) {
                        return;
                    }
                    var radius = 49;
                    var footSvg = d3.select(selector).select('.center')
                        .append('svg')
                        .attr('class', 'footer')
                        .attr('width', width) //定义宽
                        .attr('height', height)

                    _drawPie(dataType3[2], footSvg, 71, '滨海仓库');
                    _drawPie(dataType3[3], footSvg, 191, '蓟县仓库');
                    _drawPie(dataType3[7], footSvg, 311, '静海仓库');
                    _drawPie(dataType3[6], footSvg, 431, '宁河仓库');
                    _drawPie(dataType3[4], footSvg, 551, '武清仓库');
                    _drawPie(dataType3[5], footSvg, 671, '宝坻仓库');
                    _drawPie(dataType3[0], footSvg, 791, '东丽中心库');
                    _drawPie(dataType3[1], footSvg, 911, '郁江道仓储点');
                }

                // 清空地图
                var _clearMap = function() {
                    d3.select('#svg')
                        .selectAll('.draw')
                        .remove()
                }

                // var flag = true;
                $('.list-content li').bind('click', function() {

                    _clearMap()

                    var index = $(this).index();

                    $(this).css('color', '#90cdff')
                        .siblings().css('color', 'white')

                    if (index == 0 /*&& flag == true*/ ) {



                        drawLine(type1, type2, type3, 'BGCA')

                        drawLine(type1, type2, type3, 'BHCA')

                        drawLine(type1, type2, type3, 'BICA')

                        drawLine(type1, type2, type3, 'BKCA')

                        drawLine(type1, type2, type3, 'BJCA')

                        drawLine(type1, type2, type3, 'BLCA')

                        drawLine(type1, type2, type3, 'BAAA')

                        drawLine(type1, type2, type3, 'BCDB')

                        drawFooter('.foot', 1023, 151)

                    } else if (index != 0) {

                        var warehouseId = $(this).attr('warehouseId')

                        drawLine(type1, type2, type3, warehouseId);
                    }
                }).eq(0).click()

                // 图例
                var legendBol = [true, true]
                $('.main .tip li').bind('click', function() {
                    var index = $(this).index()

                    var point = '.point' + (index + 1)
                    var line = '.line' + (index + 1)

                    legendBol[index] = !legendBol[index]

                    if (legendBol[index]) {

                        $(this).find('span').css('color', '#90cdff')

                        $(point).css('opacity', 1)
                        $(line).css('opacity', 1)

                    } else {

                        $(this).find('span').css('color', '#ccc')

                        $(point).css('opacity', 0)
                        $(line).css('opacity', 0)
                    }

                })

            }

            tianjinMap()
            // drawFooter()


        })
    })
})