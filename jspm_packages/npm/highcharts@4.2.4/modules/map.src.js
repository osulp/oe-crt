/* */ 
(function(process) {
  (function(factory) {
    if (typeof module === 'object' && module.exports) {
      module.exports = factory;
    } else {
      factory(Highcharts);
    }
  }(function(Highcharts) {
    var UNDEFINED,
        animObject = Highcharts.animObject,
        Axis = Highcharts.Axis,
        Chart = Highcharts.Chart,
        Color = Highcharts.Color,
        Point = Highcharts.Point,
        Pointer = Highcharts.Pointer,
        Legend = Highcharts.Legend,
        LegendSymbolMixin = Highcharts.LegendSymbolMixin,
        Renderer = Highcharts.Renderer,
        Series = Highcharts.Series,
        SVGRenderer = Highcharts.SVGRenderer,
        VMLRenderer = Highcharts.VMLRenderer,
        win = Highcharts.win,
        doc = win.document,
        addEvent = Highcharts.addEvent,
        each = Highcharts.each,
        error = Highcharts.error,
        extend = Highcharts.extend,
        extendClass = Highcharts.extendClass,
        format = Highcharts.format,
        merge = Highcharts.merge,
        pick = Highcharts.pick,
        defaultOptions = Highcharts.getOptions(),
        seriesTypes = Highcharts.seriesTypes,
        defaultPlotOptions = defaultOptions.plotOptions,
        wrap = Highcharts.wrap,
        noop = function() {};
    wrap(Axis.prototype, 'getSeriesExtremes', function(proceed) {
      var isXAxis = this.isXAxis,
          dataMin,
          dataMax,
          xData = [],
          useMapGeometry;
      if (isXAxis) {
        each(this.series, function(series, i) {
          if (series.useMapGeometry) {
            xData[i] = series.xData;
            series.xData = [];
          }
        });
      }
      proceed.call(this);
      if (isXAxis) {
        dataMin = pick(this.dataMin, Number.MAX_VALUE);
        dataMax = pick(this.dataMax, -Number.MAX_VALUE);
        each(this.series, function(series, i) {
          if (series.useMapGeometry) {
            dataMin = Math.min(dataMin, pick(series.minX, dataMin));
            dataMax = Math.max(dataMax, pick(series.maxX, dataMin));
            series.xData = xData[i];
            useMapGeometry = true;
          }
        });
        if (useMapGeometry) {
          this.dataMin = dataMin;
          this.dataMax = dataMax;
        }
      }
    });
    wrap(Axis.prototype, 'setAxisTranslation', function(proceed) {
      var chart = this.chart,
          mapRatio,
          plotRatio = chart.plotWidth / chart.plotHeight,
          adjustedAxisLength,
          xAxis = chart.xAxis[0],
          padAxis,
          fixTo,
          fixDiff,
          preserveAspectRatio;
      proceed.call(this);
      if (this.coll === 'yAxis' && xAxis.transA !== UNDEFINED) {
        each(this.series, function(series) {
          if (series.preserveAspectRatio) {
            preserveAspectRatio = true;
          }
        });
      }
      if (preserveAspectRatio) {
        this.transA = xAxis.transA = Math.min(this.transA, xAxis.transA);
        mapRatio = plotRatio / ((xAxis.max - xAxis.min) / (this.max - this.min));
        padAxis = mapRatio < 1 ? this : xAxis;
        adjustedAxisLength = (padAxis.max - padAxis.min) * padAxis.transA;
        padAxis.pixelPadding = padAxis.len - adjustedAxisLength;
        padAxis.minPixelPadding = padAxis.pixelPadding / 2;
        fixTo = padAxis.fixTo;
        if (fixTo) {
          fixDiff = fixTo[1] - padAxis.toValue(fixTo[0], true);
          fixDiff *= padAxis.transA;
          if (Math.abs(fixDiff) > padAxis.minPixelPadding || (padAxis.min === padAxis.dataMin && padAxis.max === padAxis.dataMax)) {
            fixDiff = 0;
          }
          padAxis.minPixelPadding -= fixDiff;
        }
      }
    });
    wrap(Axis.prototype, 'render', function(proceed) {
      proceed.call(this);
      this.fixTo = null;
    });
    var ColorAxis = Highcharts.ColorAxis = function() {
      this.isColorAxis = true;
      this.init.apply(this, arguments);
    };
    extend(ColorAxis.prototype, Axis.prototype);
    extend(ColorAxis.prototype, {
      defaultColorAxisOptions: {
        lineWidth: 0,
        minPadding: 0,
        maxPadding: 0,
        gridLineWidth: 1,
        tickPixelInterval: 72,
        startOnTick: true,
        endOnTick: true,
        offset: 0,
        marker: {
          animation: {duration: 50},
          color: 'gray',
          width: 0.01
        },
        labels: {overflow: 'justify'},
        minColor: '#EFEFFF',
        maxColor: '#003875',
        tickLength: 5
      },
      init: function(chart, userOptions) {
        var horiz = chart.options.legend.layout !== 'vertical',
            options;
        options = merge(this.defaultColorAxisOptions, {
          side: horiz ? 2 : 1,
          reversed: !horiz
        }, userOptions, {
          opposite: !horiz,
          showEmpty: false,
          title: null,
          isColor: true
        });
        Axis.prototype.init.call(this, chart, options);
        if (userOptions.dataClasses) {
          this.initDataClasses(userOptions);
        }
        this.initStops(userOptions);
        this.horiz = horiz;
        this.zoomEnabled = false;
      },
      tweenColors: function(from, to, pos) {
        var hasAlpha,
            ret;
        if (!to.rgba.length || !from.rgba.length) {
          ret = to.input || 'none';
        } else {
          from = from.rgba;
          to = to.rgba;
          hasAlpha = (to[3] !== 1 || from[3] !== 1);
          ret = (hasAlpha ? 'rgba(' : 'rgb(') + Math.round(to[0] + (from[0] - to[0]) * (1 - pos)) + ',' + Math.round(to[1] + (from[1] - to[1]) * (1 - pos)) + ',' + Math.round(to[2] + (from[2] - to[2]) * (1 - pos)) + (hasAlpha ? (',' + (to[3] + (from[3] - to[3]) * (1 - pos))) : '') + ')';
        }
        return ret;
      },
      initDataClasses: function(userOptions) {
        var axis = this,
            chart = this.chart,
            dataClasses,
            colorCounter = 0,
            options = this.options,
            len = userOptions.dataClasses.length;
        this.dataClasses = dataClasses = [];
        this.legendItems = [];
        each(userOptions.dataClasses, function(dataClass, i) {
          var colors;
          dataClass = merge(dataClass);
          dataClasses.push(dataClass);
          if (!dataClass.color) {
            if (options.dataClassColor === 'category') {
              colors = chart.options.colors;
              dataClass.color = colors[colorCounter++];
              if (colorCounter === colors.length) {
                colorCounter = 0;
              }
            } else {
              dataClass.color = axis.tweenColors(Color(options.minColor), Color(options.maxColor), len < 2 ? 0.5 : i / (len - 1));
            }
          }
        });
      },
      initStops: function(userOptions) {
        this.stops = userOptions.stops || [[0, this.options.minColor], [1, this.options.maxColor]];
        each(this.stops, function(stop) {
          stop.color = Color(stop[1]);
        });
      },
      setOptions: function(userOptions) {
        Axis.prototype.setOptions.call(this, userOptions);
        this.options.crosshair = this.options.marker;
        this.coll = 'colorAxis';
      },
      setAxisSize: function() {
        var symbol = this.legendSymbol,
            chart = this.chart,
            x,
            y,
            width,
            height;
        if (symbol) {
          this.left = x = symbol.attr('x');
          this.top = y = symbol.attr('y');
          this.width = width = symbol.attr('width');
          this.height = height = symbol.attr('height');
          this.right = chart.chartWidth - x - width;
          this.bottom = chart.chartHeight - y - height;
          this.len = this.horiz ? width : height;
          this.pos = this.horiz ? x : y;
        }
      },
      toColor: function(value, point) {
        var pos,
            stops = this.stops,
            from,
            to,
            color,
            dataClasses = this.dataClasses,
            dataClass,
            i;
        if (dataClasses) {
          i = dataClasses.length;
          while (i--) {
            dataClass = dataClasses[i];
            from = dataClass.from;
            to = dataClass.to;
            if ((from === UNDEFINED || value >= from) && (to === UNDEFINED || value <= to)) {
              color = dataClass.color;
              if (point) {
                point.dataClass = i;
              }
              break;
            }
          }
        } else {
          if (this.isLog) {
            value = this.val2lin(value);
          }
          pos = 1 - ((this.max - value) / ((this.max - this.min) || 1));
          i = stops.length;
          while (i--) {
            if (pos > stops[i][0]) {
              break;
            }
          }
          from = stops[i] || stops[i + 1];
          to = stops[i + 1] || from;
          pos = 1 - (to[0] - pos) / ((to[0] - from[0]) || 1);
          color = this.tweenColors(from.color, to.color, pos);
        }
        return color;
      },
      getOffset: function() {
        var group = this.legendGroup,
            sideOffset = this.chart.axisOffset[this.side];
        if (group) {
          this.axisParent = group;
          Axis.prototype.getOffset.call(this);
          if (!this.added) {
            this.added = true;
            this.labelLeft = 0;
            this.labelRight = this.width;
          }
          this.chart.axisOffset[this.side] = sideOffset;
        }
      },
      setLegendColor: function() {
        var grad,
            horiz = this.horiz,
            options = this.options,
            reversed = this.reversed,
            one = reversed ? 1 : 0,
            zero = reversed ? 0 : 1;
        grad = horiz ? [one, 0, zero, 0] : [0, zero, 0, one];
        this.legendColor = {
          linearGradient: {
            x1: grad[0],
            y1: grad[1],
            x2: grad[2],
            y2: grad[3]
          },
          stops: options.stops || [[0, options.minColor], [1, options.maxColor]]
        };
      },
      drawLegendSymbol: function(legend, item) {
        var padding = legend.padding,
            legendOptions = legend.options,
            horiz = this.horiz,
            width = pick(legendOptions.symbolWidth, horiz ? 200 : 12),
            height = pick(legendOptions.symbolHeight, horiz ? 12 : 200),
            labelPadding = pick(legendOptions.labelPadding, horiz ? 16 : 30),
            itemDistance = pick(legendOptions.itemDistance, 10);
        this.setLegendColor();
        item.legendSymbol = this.chart.renderer.rect(0, legend.baseline - 11, width, height).attr({zIndex: 1}).add(item.legendGroup);
        this.legendItemWidth = width + padding + (horiz ? itemDistance : labelPadding);
        this.legendItemHeight = height + padding + (horiz ? labelPadding : 0);
      },
      setState: noop,
      visible: true,
      setVisible: noop,
      getSeriesExtremes: function() {
        var series;
        if (this.series.length) {
          series = this.series[0];
          this.dataMin = series.valueMin;
          this.dataMax = series.valueMax;
        }
      },
      drawCrosshair: function(e, point) {
        var plotX = point && point.plotX,
            plotY = point && point.plotY,
            crossPos,
            axisPos = this.pos,
            axisLen = this.len;
        if (point) {
          crossPos = this.toPixels(point[point.series.colorKey]);
          if (crossPos < axisPos) {
            crossPos = axisPos - 2;
          } else if (crossPos > axisPos + axisLen) {
            crossPos = axisPos + axisLen + 2;
          }
          point.plotX = crossPos;
          point.plotY = this.len - crossPos;
          Axis.prototype.drawCrosshair.call(this, e, point);
          point.plotX = plotX;
          point.plotY = plotY;
          if (this.cross) {
            this.cross.attr({fill: this.crosshair.color}).add(this.legendGroup);
          }
        }
      },
      getPlotLinePath: function(a, b, c, d, pos) {
        return typeof pos === 'number' ? (this.horiz ? ['M', pos - 4, this.top - 6, 'L', pos + 4, this.top - 6, pos, this.top, 'Z'] : ['M', this.left, pos, 'L', this.left - 6, pos + 6, this.left - 6, pos - 6, 'Z']) : Axis.prototype.getPlotLinePath.call(this, a, b, c, d);
      },
      update: function(newOptions, redraw) {
        var chart = this.chart,
            legend = chart.legend;
        each(this.series, function(series) {
          series.isDirtyData = true;
        });
        if (newOptions.dataClasses && legend.allItems) {
          each(legend.allItems, function(item) {
            if (item.isDataClass) {
              item.legendGroup.destroy();
            }
          });
          chart.isDirtyLegend = true;
        }
        chart.options[this.coll] = merge(this.userOptions, newOptions);
        Axis.prototype.update.call(this, newOptions, redraw);
        if (this.legendItem) {
          this.setLegendColor();
          legend.colorizeItem(this, true);
        }
      },
      getDataClassLegendSymbols: function() {
        var axis = this,
            chart = this.chart,
            legendItems = this.legendItems,
            legendOptions = chart.options.legend,
            valueDecimals = legendOptions.valueDecimals,
            valueSuffix = legendOptions.valueSuffix || '',
            name;
        if (!legendItems.length) {
          each(this.dataClasses, function(dataClass, i) {
            var vis = true,
                from = dataClass.from,
                to = dataClass.to;
            name = '';
            if (from === UNDEFINED) {
              name = '< ';
            } else if (to === UNDEFINED) {
              name = '> ';
            }
            if (from !== UNDEFINED) {
              name += Highcharts.numberFormat(from, valueDecimals) + valueSuffix;
            }
            if (from !== UNDEFINED && to !== UNDEFINED) {
              name += ' - ';
            }
            if (to !== UNDEFINED) {
              name += Highcharts.numberFormat(to, valueDecimals) + valueSuffix;
            }
            legendItems.push(extend({
              chart: chart,
              name: name,
              options: {},
              drawLegendSymbol: LegendSymbolMixin.drawRectangle,
              visible: true,
              setState: noop,
              isDataClass: true,
              setVisible: function() {
                vis = this.visible = !vis;
                each(axis.series, function(series) {
                  each(series.points, function(point) {
                    if (point.dataClass === i) {
                      point.setVisible(vis);
                    }
                  });
                });
                chart.legend.colorizeItem(this, vis);
              }
            }, dataClass));
          });
        }
        return legendItems;
      },
      name: ''
    });
    each(['fill', 'stroke'], function(prop) {
      Highcharts.Fx.prototype[prop + 'Setter'] = function() {
        this.elem.attr(prop, ColorAxis.prototype.tweenColors(Color(this.start), Color(this.end), this.pos));
      };
    });
    wrap(Chart.prototype, 'getAxes', function(proceed) {
      var options = this.options,
          colorAxisOptions = options.colorAxis;
      proceed.call(this);
      this.colorAxis = [];
      if (colorAxisOptions) {
        new ColorAxis(this, colorAxisOptions);
      }
    });
    wrap(Legend.prototype, 'getAllItems', function(proceed) {
      var allItems = [],
          colorAxis = this.chart.colorAxis[0];
      if (colorAxis) {
        if (colorAxis.options.dataClasses) {
          allItems = allItems.concat(colorAxis.getDataClassLegendSymbols());
        } else {
          allItems.push(colorAxis);
        }
        each(colorAxis.series, function(series) {
          series.options.showInLegend = false;
        });
      }
      return allItems.concat(proceed.call(this));
    });
    var colorPointMixin = {setVisible: function(vis) {
        var point = this,
            method = vis ? 'show' : 'hide';
        each(['graphic', 'dataLabel'], function(key) {
          if (point[key]) {
            point[key][method]();
          }
        });
      }};
    var colorSeriesMixin = {
      pointAttrToOptions: {
        stroke: 'borderColor',
        'stroke-width': 'borderWidth',
        fill: 'color',
        dashstyle: 'dashStyle'
      },
      pointArrayMap: ['value'],
      axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
      optionalAxis: 'colorAxis',
      trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
      getSymbol: noop,
      parallelArrays: ['x', 'y', 'value'],
      colorKey: 'value',
      translateColors: function() {
        var series = this,
            nullColor = this.options.nullColor,
            colorAxis = this.colorAxis,
            colorKey = this.colorKey;
        each(this.data, function(point) {
          var value = point[colorKey],
              color;
          color = point.options.color || (value === null ? nullColor : (colorAxis && value !== undefined) ? colorAxis.toColor(value, point) : point.color || series.color);
          if (color) {
            point.color = color;
          }
        });
      }
    };
    extend(Chart.prototype, {
      renderMapNavigation: function() {
        var chart = this,
            options = this.options.mapNavigation,
            buttons = options.buttons,
            n,
            button,
            buttonOptions,
            attr,
            states,
            stopEvent = function(e) {
              if (e) {
                if (e.preventDefault) {
                  e.preventDefault();
                }
                if (e.stopPropagation) {
                  e.stopPropagation();
                }
                e.cancelBubble = true;
              }
            },
            outerHandler = function(e) {
              this.handler.call(chart, e);
              stopEvent(e);
            };
        if (pick(options.enableButtons, options.enabled) && !chart.renderer.forExport) {
          chart.mapNavButtons = [];
          for (n in buttons) {
            if (buttons.hasOwnProperty(n)) {
              buttonOptions = merge(options.buttonOptions, buttons[n]);
              attr = buttonOptions.theme;
              attr.style = merge(buttonOptions.theme.style, buttonOptions.style);
              states = attr.states;
              button = chart.renderer.button(buttonOptions.text, 0, 0, outerHandler, attr, states && states.hover, states && states.select, 0, n === 'zoomIn' ? 'topbutton' : 'bottombutton').attr({
                width: buttonOptions.width,
                height: buttonOptions.height,
                title: chart.options.lang[n],
                zIndex: 5
              }).add();
              button.handler = buttonOptions.onclick;
              button.align(extend(buttonOptions, {
                width: button.width,
                height: 2 * button.height
              }), null, buttonOptions.alignTo);
              addEvent(button.element, 'dblclick', stopEvent);
              chart.mapNavButtons.push(button);
            }
          }
        }
      },
      fitToBox: function(inner, outer) {
        each([['x', 'width'], ['y', 'height']], function(dim) {
          var pos = dim[0],
              size = dim[1];
          if (inner[pos] + inner[size] > outer[pos] + outer[size]) {
            if (inner[size] > outer[size]) {
              inner[size] = outer[size];
              inner[pos] = outer[pos];
            } else {
              inner[pos] = outer[pos] + outer[size] - inner[size];
            }
          }
          if (inner[size] > outer[size]) {
            inner[size] = outer[size];
          }
          if (inner[pos] < outer[pos]) {
            inner[pos] = outer[pos];
          }
        });
        return inner;
      },
      mapZoom: function(howMuch, centerXArg, centerYArg, mouseX, mouseY) {
        var chart = this,
            xAxis = chart.xAxis[0],
            xRange = xAxis.max - xAxis.min,
            centerX = pick(centerXArg, xAxis.min + xRange / 2),
            newXRange = xRange * howMuch,
            yAxis = chart.yAxis[0],
            yRange = yAxis.max - yAxis.min,
            centerY = pick(centerYArg, yAxis.min + yRange / 2),
            newYRange = yRange * howMuch,
            fixToX = mouseX ? ((mouseX - xAxis.pos) / xAxis.len) : 0.5,
            fixToY = mouseY ? ((mouseY - yAxis.pos) / yAxis.len) : 0.5,
            newXMin = centerX - newXRange * fixToX,
            newYMin = centerY - newYRange * fixToY,
            newExt = chart.fitToBox({
              x: newXMin,
              y: newYMin,
              width: newXRange,
              height: newYRange
            }, {
              x: xAxis.dataMin,
              y: yAxis.dataMin,
              width: xAxis.dataMax - xAxis.dataMin,
              height: yAxis.dataMax - yAxis.dataMin
            });
        if (mouseX) {
          xAxis.fixTo = [mouseX - xAxis.pos, centerXArg];
        }
        if (mouseY) {
          yAxis.fixTo = [mouseY - yAxis.pos, centerYArg];
        }
        if (howMuch !== undefined) {
          xAxis.setExtremes(newExt.x, newExt.x + newExt.width, false);
          yAxis.setExtremes(newExt.y, newExt.y + newExt.height, false);
        } else {
          xAxis.setExtremes(undefined, undefined, false);
          yAxis.setExtremes(undefined, undefined, false);
        }
        chart.redraw();
      }
    });
    wrap(Chart.prototype, 'render', function(proceed) {
      var chart = this,
          mapNavigation = chart.options.mapNavigation;
      chart.renderMapNavigation();
      proceed.call(chart);
      if (pick(mapNavigation.enableDoubleClickZoom, mapNavigation.enabled) || mapNavigation.enableDoubleClickZoomTo) {
        addEvent(chart.container, 'dblclick', function(e) {
          chart.pointer.onContainerDblClick(e);
        });
      }
      if (pick(mapNavigation.enableMouseWheelZoom, mapNavigation.enabled)) {
        addEvent(chart.container, doc.onmousewheel === undefined ? 'DOMMouseScroll' : 'mousewheel', function(e) {
          chart.pointer.onContainerMouseWheel(e);
          return false;
        });
      }
    });
    extend(Pointer.prototype, {
      onContainerDblClick: function(e) {
        var chart = this.chart;
        e = this.normalize(e);
        if (chart.options.mapNavigation.enableDoubleClickZoomTo) {
          if (chart.pointer.inClass(e.target, 'highcharts-tracker')) {
            chart.hoverPoint.zoomTo();
          }
        } else if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
          chart.mapZoom(0.5, chart.xAxis[0].toValue(e.chartX), chart.yAxis[0].toValue(e.chartY), e.chartX, e.chartY);
        }
      },
      onContainerMouseWheel: function(e) {
        var chart = this.chart,
            delta;
        e = this.normalize(e);
        delta = e.detail || -(e.wheelDelta / 120);
        if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
          chart.mapZoom(Math.pow(chart.options.mapNavigation.mouseWheelSensitivity, delta), chart.xAxis[0].toValue(e.chartX), chart.yAxis[0].toValue(e.chartY), e.chartX, e.chartY);
        }
      }
    });
    wrap(Pointer.prototype, 'init', function(proceed, chart, options) {
      proceed.call(this, chart, options);
      if (pick(options.mapNavigation.enableTouchZoom, options.mapNavigation.enabled)) {
        this.pinchX = this.pinchHor = this.pinchY = this.pinchVert = this.hasZoom = true;
      }
    });
    wrap(Pointer.prototype, 'pinchTranslate', function(proceed, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch) {
      var xBigger;
      proceed.call(this, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch);
      if (this.chart.options.chart.type === 'map' && this.hasZoom) {
        xBigger = transform.scaleX > transform.scaleY;
        this.pinchTranslateDirection(!xBigger, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch, xBigger ? transform.scaleX : transform.scaleY);
      }
    });
    var supportsVectorEffect = doc.documentElement.style.vectorEffect !== undefined;
    defaultPlotOptions.map = merge(defaultPlotOptions.scatter, {
      allAreas: true,
      animation: false,
      nullColor: '#F8F8F8',
      borderColor: 'silver',
      borderWidth: 1,
      marker: null,
      stickyTracking: false,
      dataLabels: {
        formatter: function() {
          return this.point.value;
        },
        inside: true,
        verticalAlign: 'middle',
        crop: false,
        overflow: false,
        padding: 0
      },
      turboThreshold: 0,
      tooltip: {
        followPointer: true,
        pointFormat: '{point.name}: {point.value}<br/>'
      },
      states: {
        normal: {animation: true},
        hover: {
          brightness: 0.2,
          halo: null
        }
      }
    });
    var MapAreaPoint = extendClass(Point, extend({
      applyOptions: function(options, x) {
        var point = Point.prototype.applyOptions.call(this, options, x),
            series = this.series,
            joinBy = series.joinBy,
            mapPoint;
        if (series.mapData) {
          mapPoint = point[joinBy[1]] !== undefined && series.mapMap[point[joinBy[1]]];
          if (mapPoint) {
            if (series.xyFromShape) {
              point.x = mapPoint._midX;
              point.y = mapPoint._midY;
            }
            extend(point, mapPoint);
          } else {
            point.value = point.value || null;
          }
        }
        return point;
      },
      onMouseOver: function(e) {
        clearTimeout(this.colorInterval);
        if (this.value !== null) {
          Point.prototype.onMouseOver.call(this, e);
        } else {
          this.series.onMouseOut(e);
        }
      },
      onMouseOut: function() {
        var point = this,
            start = +new Date(),
            normalColor = Color(point.color),
            hoverColor = Color(point.pointAttr.hover.fill),
            animation = point.series.options.states.normal.animation,
            duration = animObject(animation).duration,
            fill;
        if (duration && normalColor.rgba.length === 4 && hoverColor.rgba.length === 4 && point.state !== 'select') {
          fill = point.pointAttr[''].fill;
          delete point.pointAttr[''].fill;
          clearTimeout(point.colorInterval);
          point.colorInterval = setInterval(function() {
            var pos = (new Date() - start) / duration,
                graphic = point.graphic;
            if (pos > 1) {
              pos = 1;
            }
            if (graphic) {
              graphic.attr('fill', ColorAxis.prototype.tweenColors.call(0, hoverColor, normalColor, pos));
            }
            if (pos >= 1) {
              clearTimeout(point.colorInterval);
            }
          }, 13);
        }
        Point.prototype.onMouseOut.call(point);
        if (fill) {
          point.pointAttr[''].fill = fill;
        }
      },
      zoomTo: function() {
        var point = this,
            series = point.series;
        series.xAxis.setExtremes(point._minX, point._maxX, false);
        series.yAxis.setExtremes(point._minY, point._maxY, false);
        series.chart.redraw();
      }
    }, colorPointMixin));
    seriesTypes.map = extendClass(seriesTypes.scatter, merge(colorSeriesMixin, {
      type: 'map',
      pointClass: MapAreaPoint,
      supportsDrilldown: true,
      getExtremesFromAll: true,
      useMapGeometry: true,
      forceDL: true,
      searchPoint: noop,
      directTouch: true,
      preserveAspectRatio: true,
      getBox: function(paths) {
        var MAX_VALUE = Number.MAX_VALUE,
            maxX = -MAX_VALUE,
            minX = MAX_VALUE,
            maxY = -MAX_VALUE,
            minY = MAX_VALUE,
            minRange = MAX_VALUE,
            xAxis = this.xAxis,
            yAxis = this.yAxis,
            hasBox;
        each(paths || [], function(point) {
          if (point.path) {
            if (typeof point.path === 'string') {
              point.path = Highcharts.splitPath(point.path);
            }
            var path = point.path || [],
                i = path.length,
                even = false,
                pointMaxX = -MAX_VALUE,
                pointMinX = MAX_VALUE,
                pointMaxY = -MAX_VALUE,
                pointMinY = MAX_VALUE,
                properties = point.properties;
            if (!point._foundBox) {
              while (i--) {
                if (typeof path[i] === 'number' && !isNaN(path[i])) {
                  if (even) {
                    pointMaxX = Math.max(pointMaxX, path[i]);
                    pointMinX = Math.min(pointMinX, path[i]);
                  } else {
                    pointMaxY = Math.max(pointMaxY, path[i]);
                    pointMinY = Math.min(pointMinY, path[i]);
                  }
                  even = !even;
                }
              }
              point._midX = pointMinX + (pointMaxX - pointMinX) * (point.middleX || (properties && properties['hc-middle-x']) || 0.5);
              point._midY = pointMinY + (pointMaxY - pointMinY) * (point.middleY || (properties && properties['hc-middle-y']) || 0.5);
              point._maxX = pointMaxX;
              point._minX = pointMinX;
              point._maxY = pointMaxY;
              point._minY = pointMinY;
              point.labelrank = pick(point.labelrank, (pointMaxX - pointMinX) * (pointMaxY - pointMinY));
              point._foundBox = true;
            }
            maxX = Math.max(maxX, point._maxX);
            minX = Math.min(minX, point._minX);
            maxY = Math.max(maxY, point._maxY);
            minY = Math.min(minY, point._minY);
            minRange = Math.min(point._maxX - point._minX, point._maxY - point._minY, minRange);
            hasBox = true;
          }
        });
        if (hasBox) {
          this.minY = Math.min(minY, pick(this.minY, MAX_VALUE));
          this.maxY = Math.max(maxY, pick(this.maxY, -MAX_VALUE));
          this.minX = Math.min(minX, pick(this.minX, MAX_VALUE));
          this.maxX = Math.max(maxX, pick(this.maxX, -MAX_VALUE));
          if (xAxis && xAxis.options.minRange === undefined) {
            xAxis.minRange = Math.min(5 * minRange, (this.maxX - this.minX) / 5, xAxis.minRange || MAX_VALUE);
          }
          if (yAxis && yAxis.options.minRange === undefined) {
            yAxis.minRange = Math.min(5 * minRange, (this.maxY - this.minY) / 5, yAxis.minRange || MAX_VALUE);
          }
        }
      },
      getExtremes: function() {
        Series.prototype.getExtremes.call(this, this.valueData);
        if (this.chart.hasRendered && this.isDirtyData) {
          this.getBox(this.options.data);
        }
        this.valueMin = this.dataMin;
        this.valueMax = this.dataMax;
        this.dataMin = this.minY;
        this.dataMax = this.maxY;
      },
      translatePath: function(path) {
        var series = this,
            even = false,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            xMin = xAxis.min,
            xTransA = xAxis.transA,
            xMinPixelPadding = xAxis.minPixelPadding,
            yMin = yAxis.min,
            yTransA = yAxis.transA,
            yMinPixelPadding = yAxis.minPixelPadding,
            i,
            ret = [];
        if (path) {
          i = path.length;
          while (i--) {
            if (typeof path[i] === 'number') {
              ret[i] = even ? (path[i] - xMin) * xTransA + xMinPixelPadding : (path[i] - yMin) * yTransA + yMinPixelPadding;
              even = !even;
            } else {
              ret[i] = path[i];
            }
          }
        }
        return ret;
      },
      setData: function(data, redraw) {
        var options = this.options,
            mapData = options.mapData,
            joinBy = options.joinBy,
            joinByNull = joinBy === null,
            dataUsed = [],
            mapMap = {},
            mapPoint,
            transform,
            mapTransforms,
            props,
            i;
        if (joinByNull) {
          joinBy = '_i';
        }
        joinBy = this.joinBy = Highcharts.splat(joinBy);
        if (!joinBy[1]) {
          joinBy[1] = joinBy[0];
        }
        if (data) {
          each(data, function(val, i) {
            if (typeof val === 'number') {
              data[i] = {value: val};
            }
            if (joinByNull) {
              data[i]._i = i;
            }
          });
        }
        this.getBox(data);
        if (mapData) {
          if (mapData.type === 'FeatureCollection') {
            if (mapData['hc-transform']) {
              this.chart.mapTransforms = mapTransforms = mapData['hc-transform'];
              for (transform in mapTransforms) {
                if (mapTransforms.hasOwnProperty(transform) && transform.rotation) {
                  transform.cosAngle = Math.cos(transform.rotation);
                  transform.sinAngle = Math.sin(transform.rotation);
                }
              }
            }
            mapData = Highcharts.geojson(mapData, this.type, this);
          }
          this.mapData = mapData;
          for (i = 0; i < mapData.length; i++) {
            mapPoint = mapData[i];
            props = mapPoint.properties;
            mapPoint._i = i;
            if (joinBy[0] && props && props[joinBy[0]]) {
              mapPoint[joinBy[0]] = props[joinBy[0]];
            }
            mapMap[mapPoint[joinBy[0]]] = mapPoint;
          }
          this.mapMap = mapMap;
          if (data && joinBy[1]) {
            each(data, function(point) {
              if (mapMap[point[joinBy[1]]]) {
                dataUsed.push(mapMap[point[joinBy[1]]]);
              }
            });
          }
          if (options.allAreas) {
            this.getBox(mapData);
            data = data || [];
            dataUsed = '|' + dataUsed.map(function(point) {
              return point[joinBy[0]];
            }).join('|') + '|';
            each(mapData, function(mapPoint) {
              if (!joinBy[0] || dataUsed.indexOf('|' + mapPoint[joinBy[0]] + '|') === -1) {
                data.push(merge(mapPoint, {value: null}));
              }
            });
          } else {
            this.getBox(dataUsed);
          }
        }
        Series.prototype.setData.call(this, data, redraw);
      },
      drawGraph: noop,
      drawDataLabels: noop,
      doFullTranslate: function() {
        return this.isDirtyData || this.chart.isResizing || this.chart.renderer.isVML || !this.baseTrans;
      },
      translate: function() {
        var series = this,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            doFullTranslate = series.doFullTranslate();
        series.generatePoints();
        each(series.data, function(point) {
          point.plotX = xAxis.toPixels(point._midX, true);
          point.plotY = yAxis.toPixels(point._midY, true);
          if (doFullTranslate) {
            point.shapeType = 'path';
            point.shapeArgs = {d: series.translatePath(point.path)};
            if (supportsVectorEffect) {
              point.shapeArgs['vector-effect'] = 'non-scaling-stroke';
            }
          }
        });
        series.translateColors();
      },
      drawPoints: function() {
        var series = this,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            group = series.group,
            chart = series.chart,
            renderer = chart.renderer,
            scaleX,
            scaleY,
            translateX,
            translateY,
            baseTrans = this.baseTrans;
        if (!series.transformGroup) {
          series.transformGroup = renderer.g().attr({
            scaleX: 1,
            scaleY: 1
          }).add(group);
          series.transformGroup.survive = true;
        }
        if (series.doFullTranslate()) {
          if (chart.hasRendered && series.pointAttrToOptions.fill === 'color') {
            each(series.points, function(point) {
              if (point.shapeArgs) {
                point.shapeArgs.fill = point.pointAttr[pick(point.state, '')].fill;
              }
            });
          }
          if (!supportsVectorEffect) {
            each(series.points, function(point) {
              var attr = point.pointAttr[''];
              if (attr['stroke-width'] === series.pointAttr['']['stroke-width']) {
                attr['stroke-width'] = 'inherit';
              }
            });
          }
          series.group = series.transformGroup;
          seriesTypes.column.prototype.drawPoints.apply(series);
          series.group = group;
          each(series.points, function(point) {
            if (point.graphic) {
              if (point.name) {
                point.graphic.addClass('highcharts-name-' + point.name.replace(' ', '-').toLowerCase());
              }
              if (point.properties && point.properties['hc-key']) {
                point.graphic.addClass('highcharts-key-' + point.properties['hc-key'].toLowerCase());
              }
              if (!supportsVectorEffect) {
                point.graphic['stroke-widthSetter'] = noop;
              }
            }
          });
          this.baseTrans = {
            originX: xAxis.min - xAxis.minPixelPadding / xAxis.transA,
            originY: yAxis.min - yAxis.minPixelPadding / yAxis.transA + (yAxis.reversed ? 0 : yAxis.len / yAxis.transA),
            transAX: xAxis.transA,
            transAY: yAxis.transA
          };
          this.transformGroup.animate({
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1
          });
        } else {
          scaleX = xAxis.transA / baseTrans.transAX;
          scaleY = yAxis.transA / baseTrans.transAY;
          translateX = xAxis.toPixels(baseTrans.originX, true);
          translateY = yAxis.toPixels(baseTrans.originY, true);
          if (scaleX > 0.99 && scaleX < 1.01 && scaleY > 0.99 && scaleY < 1.01) {
            scaleX = 1;
            scaleY = 1;
            translateX = Math.round(translateX);
            translateY = Math.round(translateY);
          }
          this.transformGroup.animate({
            translateX: translateX,
            translateY: translateY,
            scaleX: scaleX,
            scaleY: scaleY
          });
        }
        if (!supportsVectorEffect) {
          series.group.element.setAttribute('stroke-width', series.options.borderWidth / (scaleX || 1));
        }
        this.drawMapDataLabels();
      },
      drawMapDataLabels: function() {
        Series.prototype.drawDataLabels.call(this);
        if (this.dataLabelsGroup) {
          this.dataLabelsGroup.clip(this.chart.clipRect);
        }
      },
      render: function() {
        var series = this,
            render = Series.prototype.render;
        if (series.chart.renderer.isVML && series.data.length > 3000) {
          setTimeout(function() {
            render.call(series);
          });
        } else {
          render.call(series);
        }
      },
      animate: function(init) {
        var chart = this.chart,
            animation = this.options.animation,
            group = this.group,
            xAxis = this.xAxis,
            yAxis = this.yAxis,
            left = xAxis.pos,
            top = yAxis.pos;
        if (chart.renderer.isSVG) {
          if (animation === true) {
            animation = {duration: 1000};
          }
          if (init) {
            group.attr({
              translateX: left + xAxis.len / 2,
              translateY: top + yAxis.len / 2,
              scaleX: 0.001,
              scaleY: 0.001
            });
          } else {
            group.animate({
              translateX: left,
              translateY: top,
              scaleX: 1,
              scaleY: 1
            }, animation);
            this.animate = null;
          }
        }
      },
      animateDrilldown: function(init) {
        var toBox = this.chart.plotBox,
            level = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
            fromBox = level.bBox,
            animationOptions = this.chart.options.drilldown.animation,
            scale;
        if (!init) {
          scale = Math.min(fromBox.width / toBox.width, fromBox.height / toBox.height);
          level.shapeArgs = {
            scaleX: scale,
            scaleY: scale,
            translateX: fromBox.x,
            translateY: fromBox.y
          };
          each(this.points, function(point) {
            if (point.graphic) {
              point.graphic.attr(level.shapeArgs).animate({
                scaleX: 1,
                scaleY: 1,
                translateX: 0,
                translateY: 0
              }, animationOptions);
            }
          });
          this.animate = null;
        }
      },
      drawLegendSymbol: LegendSymbolMixin.drawRectangle,
      animateDrillupFrom: function(level) {
        seriesTypes.column.prototype.animateDrillupFrom.call(this, level);
      },
      animateDrillupTo: function(init) {
        seriesTypes.column.prototype.animateDrillupTo.call(this, init);
      }
    }));
    defaultPlotOptions.mapline = merge(defaultPlotOptions.map, {
      lineWidth: 1,
      fillColor: 'none'
    });
    seriesTypes.mapline = extendClass(seriesTypes.map, {
      type: 'mapline',
      pointAttrToOptions: {
        stroke: 'color',
        'stroke-width': 'lineWidth',
        fill: 'fillColor',
        dashstyle: 'dashStyle'
      },
      drawLegendSymbol: seriesTypes.line.prototype.drawLegendSymbol
    });
    defaultPlotOptions.mappoint = merge(defaultPlotOptions.scatter, {dataLabels: {
        enabled: true,
        formatter: function() {
          return this.point.name;
        },
        crop: false,
        defer: false,
        overflow: false,
        style: {color: '#000000'}
      }});
    seriesTypes.mappoint = extendClass(seriesTypes.scatter, {
      type: 'mappoint',
      forceDL: true,
      pointClass: extendClass(Point, {applyOptions: function(options, x) {
          var point = Point.prototype.applyOptions.call(this, options, x);
          if (options.lat !== undefined && options.lon !== undefined) {
            point = extend(point, this.series.chart.fromLatLonToPoint(point));
          }
          return point;
        }})
    });
    if (seriesTypes.bubble) {
      defaultPlotOptions.mapbubble = merge(defaultPlotOptions.bubble, {
        animationLimit: 500,
        tooltip: {pointFormat: '{point.name}: {point.z}'}
      });
      seriesTypes.mapbubble = extendClass(seriesTypes.bubble, {
        pointClass: extendClass(Point, {
          applyOptions: function(options, x) {
            var point;
            if (options && options.lat !== undefined && options.lon !== undefined) {
              point = Point.prototype.applyOptions.call(this, options, x);
              point = extend(point, this.series.chart.fromLatLonToPoint(point));
            } else {
              point = MapAreaPoint.prototype.applyOptions.call(this, options, x);
            }
            return point;
          },
          ttBelow: false
        }),
        xyFromShape: true,
        type: 'mapbubble',
        pointArrayMap: ['z'],
        getMapData: seriesTypes.map.prototype.getMapData,
        getBox: seriesTypes.map.prototype.getBox,
        setData: seriesTypes.map.prototype.setData
      });
    }
    defaultOptions.plotOptions.heatmap = merge(defaultOptions.plotOptions.scatter, {
      animation: false,
      borderWidth: 0,
      nullColor: '#F8F8F8',
      dataLabels: {
        formatter: function() {
          return this.point.value;
        },
        inside: true,
        verticalAlign: 'middle',
        crop: false,
        overflow: false,
        padding: 0
      },
      marker: null,
      pointRange: null,
      tooltip: {pointFormat: '{point.x}, {point.y}: {point.value}<br/>'},
      states: {
        normal: {animation: true},
        hover: {
          halo: false,
          brightness: 0.2
        }
      }
    });
    seriesTypes.heatmap = extendClass(seriesTypes.scatter, merge(colorSeriesMixin, {
      type: 'heatmap',
      pointArrayMap: ['y', 'value'],
      hasPointSpecificOptions: true,
      pointClass: extendClass(Point, colorPointMixin),
      supportsDrilldown: true,
      getExtremesFromAll: true,
      directTouch: true,
      init: function() {
        var options;
        seriesTypes.scatter.prototype.init.apply(this, arguments);
        options = this.options;
        options.pointRange = pick(options.pointRange, options.colsize || 1);
        this.yAxis.axisPointRange = options.rowsize || 1;
      },
      translate: function() {
        var series = this,
            options = series.options,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            between = function(x, a, b) {
              return Math.min(Math.max(a, x), b);
            };
        series.generatePoints();
        each(series.points, function(point) {
          var xPad = (options.colsize || 1) / 2,
              yPad = (options.rowsize || 1) / 2,
              x1 = between(Math.round(xAxis.len - xAxis.translate(point.x - xPad, 0, 1, 0, 1)), 0, xAxis.len),
              x2 = between(Math.round(xAxis.len - xAxis.translate(point.x + xPad, 0, 1, 0, 1)), 0, xAxis.len),
              y1 = between(Math.round(yAxis.translate(point.y - yPad, 0, 1, 0, 1)), 0, yAxis.len),
              y2 = between(Math.round(yAxis.translate(point.y + yPad, 0, 1, 0, 1)), 0, yAxis.len);
          point.plotX = point.clientX = (x1 + x2) / 2;
          point.plotY = (y1 + y2) / 2;
          point.shapeType = 'rect';
          point.shapeArgs = {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1)
          };
        });
        series.translateColors();
        if (this.chart.hasRendered) {
          each(series.points, function(point) {
            point.shapeArgs.fill = point.options.color || point.color;
          });
        }
      },
      drawPoints: seriesTypes.column.prototype.drawPoints,
      animate: noop,
      getBox: noop,
      drawLegendSymbol: LegendSymbolMixin.drawRectangle,
      getExtremes: function() {
        Series.prototype.getExtremes.call(this, this.valueData);
        this.valueMin = this.dataMin;
        this.valueMax = this.dataMax;
        Series.prototype.getExtremes.call(this);
      }
    }));
    function pointInPolygon(point, polygon) {
      var i,
          j,
          rel1,
          rel2,
          c = false,
          x = point.x,
          y = point.y;
      for (i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        rel1 = polygon[i][1] > y;
        rel2 = polygon[j][1] > y;
        if (rel1 !== rel2 && (x < (polygon[j][0] - polygon[i][0]) * (y - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0])) {
          c = !c;
        }
      }
      return c;
    }
    Chart.prototype.transformFromLatLon = function(latLon, transform) {
      if (win.proj4 === undefined) {
        error(21);
        return {
          x: 0,
          y: null
        };
      }
      var projected = win.proj4(transform.crs, [latLon.lon, latLon.lat]),
          cosAngle = transform.cosAngle || (transform.rotation && Math.cos(transform.rotation)),
          sinAngle = transform.sinAngle || (transform.rotation && Math.sin(transform.rotation)),
          rotated = transform.rotation ? [projected[0] * cosAngle + projected[1] * sinAngle, -projected[0] * sinAngle + projected[1] * cosAngle] : projected;
      return {
        x: ((rotated[0] - (transform.xoffset || 0)) * (transform.scale || 1) + (transform.xpan || 0)) * (transform.jsonres || 1) + (transform.jsonmarginX || 0),
        y: (((transform.yoffset || 0) - rotated[1]) * (transform.scale || 1) + (transform.ypan || 0)) * (transform.jsonres || 1) - (transform.jsonmarginY || 0)
      };
    };
    Chart.prototype.transformToLatLon = function(point, transform) {
      if (win.proj4 === undefined) {
        error(21);
        return;
      }
      var normalized = {
        x: ((point.x - (transform.jsonmarginX || 0)) / (transform.jsonres || 1) - (transform.xpan || 0)) / (transform.scale || 1) + (transform.xoffset || 0),
        y: ((-point.y - (transform.jsonmarginY || 0)) / (transform.jsonres || 1) + (transform.ypan || 0)) / (transform.scale || 1) + (transform.yoffset || 0)
      },
          cosAngle = transform.cosAngle || (transform.rotation && Math.cos(transform.rotation)),
          sinAngle = transform.sinAngle || (transform.rotation && Math.sin(transform.rotation)),
          projected = win.proj4(transform.crs, 'WGS84', transform.rotation ? {
            x: normalized.x * cosAngle + normalized.y * -sinAngle,
            y: normalized.x * sinAngle + normalized.y * cosAngle
          } : normalized);
      return {
        lat: projected.y,
        lon: projected.x
      };
    };
    Chart.prototype.fromPointToLatLon = function(point) {
      var transforms = this.mapTransforms,
          transform;
      if (!transforms) {
        error(22);
        return;
      }
      for (transform in transforms) {
        if (transforms.hasOwnProperty(transform) && transforms[transform].hitZone && pointInPolygon({
          x: point.x,
          y: -point.y
        }, transforms[transform].hitZone.coordinates[0])) {
          return this.transformToLatLon(point, transforms[transform]);
        }
      }
      return this.transformToLatLon(point, transforms['default']);
    };
    Chart.prototype.fromLatLonToPoint = function(latLon) {
      var transforms = this.mapTransforms,
          transform,
          coords;
      if (!transforms) {
        error(22);
        return {
          x: 0,
          y: null
        };
      }
      for (transform in transforms) {
        if (transforms.hasOwnProperty(transform) && transforms[transform].hitZone) {
          coords = this.transformFromLatLon(latLon, transforms[transform]);
          if (pointInPolygon({
            x: coords.x,
            y: -coords.y
          }, transforms[transform].hitZone.coordinates[0])) {
            return coords;
          }
        }
      }
      return this.transformFromLatLon(latLon, transforms['default']);
    };
    Highcharts.geojson = function(geojson, hType, series) {
      var mapData = [],
          path = [],
          polygonToPath = function(polygon) {
            var i,
                len = polygon.length;
            path.push('M');
            for (i = 0; i < len; i++) {
              if (i === 1) {
                path.push('L');
              }
              path.push(polygon[i][0], -polygon[i][1]);
            }
          };
      hType = hType || 'map';
      each(geojson.features, function(feature) {
        var geometry = feature.geometry,
            type = geometry.type,
            coordinates = geometry.coordinates,
            properties = feature.properties,
            point;
        path = [];
        if (hType === 'map' || hType === 'mapbubble') {
          if (type === 'Polygon') {
            each(coordinates, polygonToPath);
            path.push('Z');
          } else if (type === 'MultiPolygon') {
            each(coordinates, function(items) {
              each(items, polygonToPath);
            });
            path.push('Z');
          }
          if (path.length) {
            point = {path: path};
          }
        } else if (hType === 'mapline') {
          if (type === 'LineString') {
            polygonToPath(coordinates);
          } else if (type === 'MultiLineString') {
            each(coordinates, polygonToPath);
          }
          if (path.length) {
            point = {path: path};
          }
        } else if (hType === 'mappoint') {
          if (type === 'Point') {
            point = {
              x: coordinates[0],
              y: -coordinates[1]
            };
          }
        }
        if (point) {
          mapData.push(extend(point, {
            name: properties.name || properties.NAME,
            properties: properties
          }));
        }
      });
      if (series && geojson.copyrightShort) {
        series.chart.mapCredits = format(series.chart.options.credits.mapText, {geojson: geojson});
        series.chart.mapCreditsFull = format(series.chart.options.credits.mapTextFull, {geojson: geojson});
      }
      return mapData;
    };
    wrap(Chart.prototype, 'showCredits', function(proceed, credits) {
      if (this.mapCredits) {
        credits.href = null;
      }
      proceed.call(this, Highcharts.merge(credits, {text: credits.text + (this.mapCredits || '')}));
      if (this.credits && this.mapCreditsFull) {
        this.credits.attr({title: this.mapCreditsFull});
      }
    });
    extend(defaultOptions.lang, {
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out'
    });
    defaultOptions.mapNavigation = {
      buttonOptions: {
        alignTo: 'plotBox',
        align: 'left',
        verticalAlign: 'top',
        x: 0,
        width: 18,
        height: 18,
        style: {
          fontSize: '15px',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        theme: {'stroke-width': 1}
      },
      buttons: {
        zoomIn: {
          onclick: function() {
            this.mapZoom(0.5);
          },
          text: '+',
          y: 0
        },
        zoomOut: {
          onclick: function() {
            this.mapZoom(2);
          },
          text: '-',
          y: 28
        }
      },
      mouseWheelSensitivity: 1.1
    };
    Highcharts.splitPath = function(path) {
      var i;
      path = path.replace(/([A-Za-z])/g, ' $1 ');
      path = path.replace(/^\s*/, '').replace(/\s*$/, '');
      path = path.split(/[ ,]+/);
      for (i = 0; i < path.length; i++) {
        if (!/[a-zA-Z]/.test(path[i])) {
          path[i] = parseFloat(path[i]);
        }
      }
      return path;
    };
    Highcharts.maps = {};
    function selectiveRoundedRect(x, y, w, h, rTopLeft, rTopRight, rBottomRight, rBottomLeft) {
      return ['M', x + rTopLeft, y, 'L', x + w - rTopRight, y, 'C', x + w - rTopRight / 2, y, x + w, y + rTopRight / 2, x + w, y + rTopRight, 'L', x + w, y + h - rBottomRight, 'C', x + w, y + h - rBottomRight / 2, x + w - rBottomRight / 2, y + h, x + w - rBottomRight, y + h, 'L', x + rBottomLeft, y + h, 'C', x + rBottomLeft / 2, y + h, x, y + h - rBottomLeft / 2, x, y + h - rBottomLeft, 'L', x, y + rTopLeft, 'C', x, y + rTopLeft / 2, x + rTopLeft / 2, y, x + rTopLeft, y, 'Z'];
    }
    SVGRenderer.prototype.symbols.topbutton = function(x, y, w, h, attr) {
      return selectiveRoundedRect(x - 1, y - 1, w, h, attr.r, attr.r, 0, 0);
    };
    SVGRenderer.prototype.symbols.bottombutton = function(x, y, w, h, attr) {
      return selectiveRoundedRect(x - 1, y - 1, w, h, 0, 0, attr.r, attr.r);
    };
    if (Renderer === VMLRenderer) {
      each(['topbutton', 'bottombutton'], function(shape) {
        VMLRenderer.prototype.symbols[shape] = SVGRenderer.prototype.symbols[shape];
      });
    }
    Highcharts.Map = Highcharts.mapChart = function(a, b, c) {
      var hasRenderToArg = typeof a === 'string' || a.nodeName,
          options = arguments[hasRenderToArg ? 1 : 0],
          hiddenAxis = {
            endOnTick: false,
            gridLineWidth: 0,
            lineWidth: 0,
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            title: null,
            tickPositions: []
          },
          seriesOptions,
          defaultCreditsOptions = Highcharts.getOptions().credits;
      seriesOptions = options.series;
      options.series = null;
      options = merge({
        chart: {
          panning: 'xy',
          type: 'map'
        },
        credits: {
          mapText: pick(defaultCreditsOptions.mapText, ' \u00a9 <a href="{geojson.copyrightUrl}">{geojson.copyrightShort}</a>'),
          mapTextFull: pick(defaultCreditsOptions.mapTextFull, '{geojson.copyright}')
        },
        xAxis: hiddenAxis,
        yAxis: merge(hiddenAxis, {reversed: true})
      }, options, {chart: {
          inverted: false,
          alignTicks: false
        }});
      options.series = seriesOptions;
      return hasRenderToArg ? new Chart(a, options, c) : new Chart(options, b);
    };
  }));
})(require('process'));
