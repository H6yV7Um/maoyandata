module.exports = [function() {

  var calculateCenter = function(lnglatarr) {
    var total = lnglatarr.length;
    var X = 0;
    var Y = 0;
    var Z = 0;
    $.each(lnglatarr, function(index, lnglat) {
      var lng = lnglat.lng * Math.PI / 180;
      var lat = lnglat.lat * Math.PI / 180;
      var x, y, z;
      x = Math.cos(lat) * Math.cos(lng);
      y = Math.cos(lat) * Math.sin(lng);
      z = Math.sin(lat);
      X += x;
      Y += y;
      Z += z;
    });

    X = X / total;
    Y = Y / total;
    Z = Z / total;

    var Lng = Math.atan2(Y, X);
    var Hyp = Math.sqrt(X * X + Y * Y);
    var Lat = Math.atan2(Z, Hyp);

    return new AMap.LngLat(Lng * 180 / Math.PI, Lat * 180 / Math.PI);
  };

  var mapInit = function(option) {
    var map = new AMap.Map(option.divId, {
      view: new AMap.View2D({
        // new AMap.LngLat(121.397428,31.90923),
        center: option.center, zoom: option.zoom, rotation: 0
      }), scrollWheel: option.scrollWheel == null ? true : option.scrollWheel, lang: 'zh_cn', // 设置语言类型，中文简体
      zooms: option.zooms || [3, 18]
    });
    map.plugin(['AMap.ToolBar'], function() {
      // 加载工具条
      var tool = new AMap.ToolBar();
      map.addControl(tool);
    });
    return map;
  };

  var getColor = function() {
    var colorArray = ['#d8baf6', '#d06ea8', '#b81bef', '#795858', '#95ad29', '#d36265', '#6fdd91', '#e8adc5', '#43bd46', '#567dc9', '#8340da', '#935d4b', '#c5d558', '#31cbab', '#6214de', '#c37647', '#e50ea3', '#e2cd65', '#0a8a04', '#838718', '#4a1749', '#98632c', '#472b01', '#0ec882', '#25a07a', '#a5bf46', '#d0dc5d', '#55920b', '#248e1a', '#53aa19', '#e39b49', '#520ede', '#38c402', '#f5255c', '#35d8a9', '#93323c', '#b2f543', '#eadfc4', '#09641a', '#8c61b6', '#1a5f2b', '#7e2331', '#879db4', '#10a8b4', '#0d7847', '#671dc6', '#20be1c', '#36be06', '#791f02', '#8d02e2', '#1d8757', '#c87870', '#45b3f3', '#45b89b', '#862702', '#b937c0', '#943e23', '#912237', '#953775', '#f34eb9', '#fc2851', '#e6fea1', '#3e8c78', '#c774b4', '#d0643f', '#e98056', '#339a00', '#847593', '#b1b8c8', '#83a661', '#1d7395', '#324861', '#0d7ef6', '#1cc3d4', '#fea602', '#8eea01', '#53aa28', '#01434e', '#26b74f', '#6cb102', '#50dce4', '#c5aa99', '#21f5e6', '#07f23c', '#2a2afc', '#a22136', '#a142c1', '#9536ff', '#b06c04', '#f68626', '#c3f615', '#bef201', '#ae556e', '#d672c3', '#0fcd8e', '#137898', '#ace0ea', '#a64dc6', '#8e6071', '#c0becf'];
    return _.first(_.sample(colorArray, 1));
  };

  var setPolygon = function(option) {
    var color = option.fillColor ? option.fillColor : this.getColor();
    var newOpt = _.pick(option, 'strokeColor', 'strokeOpacity', 'strokeWeight', 'fillColor', 'fillOpacity', 'strokeStyle', 'map');
    var defaultOpt = {
      path: option.polygonArr, // 设置多边形边界路径
      strokeColor: '#FF33FF', // 线颜色
      strokeOpacity: 0.2, // 线透明度
      strokeWeight: 3, // 线宽
      fillColor: color, // 填充色
      fillOpacity: 0.75// 填充透明度
    };
    newOpt = _.extend(defaultOpt, newOpt);
    return new AMap.Polygon(newOpt);
  };

  var setPolyline = function(option) {
    var newOpt = _.pick(option, 'strokeColor', 'strokeOpacity', 'strokeWeight', 'strokeStyle', 'map');
    var defaultOpt = {
      path: option.polylineArr, // 设置折线路径
      strokeColor: '#3366FF', // 线颜色
      strokeOpacity: 0.9, // 线透明度
      strokeWeight: 2, // 线宽
      strokeStyle: 'solid' // 线样式
    };
    newOpt = _.extend(defaultOpt, newOpt);
    return new AMap.Polyline(newOpt);
  };

  var setMarker = function(position, opt) {
    var marker = null;
    if (typeof opt !== 'undefined') {
      marker = new AMap.Marker(_.extend({
        icon: 'http://webapi.amap.com/images/0.png', position: position
      }, opt));
    } else {
      marker = new AMap.Marker({
        icon: 'http://webapi.amap.com/images/0.png', position: position
      });
    }

    return marker;
  };

  var setCustomerMarkers = function(map, markers) {

    angular.forEach(markers, function(marker) {
      marker.setMap(map);
    });

  };
  var getDotNumberCustomMarkers = function(dotColor, dotArray) {

    var markers = [];

    function getTemplate(orderId) {

      return '<span class="fa-stack fa-lg">' + '<i class="fa fa-circle fa-stack-1x ud-bd-icon" style="color: ' + dotColor + '"></i>' + '<i class="fa fa-inverse fa-stack-1x ud-bd-number" style="font-size: 0.5em">' + orderId + '</i></span>';
    }

    angular.forEach(dotArray, function(item) {

      var markerContent = angular.element(getTemplate(item.orderId));

      var marker = new AMap.Marker({
        position: new AMap.LngLat(item.lng, item.lat), // 基点位置
        offset: new AMap.Pixel(-18, -36), // 相对于基点的偏移位置
        content: markerContent[0] // 自定义点标记覆盖物内容
      });

      markers.push(marker);
    });

    return markers;

  };
  var getCustomMarker = function(position, text) {
    var markerContent = document.createElement('div');
    var markerText = document.createElement('span');
    markerContent.className = 'markerContentStyle';
    markerText.innerHTML = text;
    markerContent.appendChild(markerText);

    // 点标记中的图标
    return new AMap.Marker({
      position: position, // 基点位置
      offset: new AMap.Pixel(-18, -36), // 相对于基点的偏移位置
      content: markerContent // 自定义点标记覆盖物内容
    });
  };

  var drawPolygon = function(mapObject, mouseTool, option, callback) {
    var polygonOption = {
      strokeColor: '#FF33FF', strokeOpacity: 0.2, strokeWeight: 3
    };
    polygonOption = _.extend(polygonOption, option);

    // 在地图中添加MouseTool插件
    mapObject.plugin(['AMap.MouseTool'], function() {
      mapObject.setDefaultCursor('default');
      mouseTool = new AMap.MouseTool(mapObject);
      mouseTool.polygon(polygonOption); // 使用鼠标工具绘制多边形
      AMap.event.addListener(mouseTool, 'draw', function(e) {
        var drawObj = e.obj; // obj属性就是绘制完成的覆盖物对象。
        // var pointsCount = e.obj.getPath().length; // 获取节点个数
        mouseTool.close();
        mapObject.setDefaultCursor('url(../../asset/img/closedhand.cur),pointer');
        callback(drawObj);
      });
    });
    return mouseTool;
  };

  var addPolygonEvent = function(polygon, polygonCallBack, eventType) {
    var newEventType = eventType || 'click';
    return AMap.event.addListener(polygon, newEventType, function(e) {
      polygonCallBack(e);
    });
  };

  var setInfoWindow = function(content, isCustom) {
    return new AMap.InfoWindow({
      content: content, isCustom: isCustom // 使用自定义窗体
    });
  };

  var getMarker = function(mapObj, lnglat, color, index) {
    var point = new AMap.LngLat(lnglat.lng, lnglat.lat);
    var str = '<span class="fa-stack fa-lg">' + '<i class="fa fa-circle fa-stack-1x" style="color: ' + color + '"></i>' + '<i class="fa fa-inverse fa-stack-1x " style="font-size: 0.5em">' + index + '</i></span>';

    // var markerContent = angular.element(str);

    return new AMap.Marker({
      position: point, content: str, offset: new AMap.Pixel(-18, -36), // 相对于基点的偏移位置
      map: mapObj
    });

  };

  var getMarkerWithoutNumber = function(mapObj, lnglat, color) {
    var point = new AMap.LngLat(lnglat.lng, lnglat.lat);
    var str = '<span class="fa-stack">' + '<i class="fa fa-circle fa-stack-1x" style="color: ' + color + '"></i></span>';

    var markerContent = angular.element(str);

    return new AMap.Marker({
      position: point, content: markerContent[0], offset: new AMap.Pixel(-18, -36), // 相对于基点的偏移位置
      map: mapObj
    });

  };

  /**
   * jsts判断两个区域是否有重叠
   */
  function _useJstsToTestForIntersection(wkt1, wkt2) {
    var wktReader = new jsts.io.WKTReader();
    var geom1 = wktReader.read(wkt1);
    var geom2 = wktReader.read(wkt2);

    return geom2.intersects(geom1);
  }

  /**
   * 生成wicketArea
   */
  let wicket = new Wkt.Wkt();
  const _generateWicketArea = (area) => {
    let positionsArea = [];

    if (angular.isObject(area)) {
      positionsArea = area.getPath().map((item) => {
        return item.lng + ' ' + item.lat;
      });

      positionsArea.push(positionsArea[0]);
      positionsArea = positionsArea.join(',');
    } else if (angular.isArray(area)) {
      positionsArea = area.map((item) => {
        return item[0] + ' ' + item[1];
      });

      positionsArea.push(positionsArea[0]);

      positionsArea = positionsArea.join(',');
    }

    wicket.read('POLYGON((' + positionsArea + '))');
    return wicket.write();

  };

  /**
   * 暴露出去的判断两个区域是否重叠的接口
   * @param area1 区域1
   * @param area2 区域2
   */
  var isOverlayArea = (area1, area2) => {

    let wktArea1 = _generateWicketArea(area1);
    let wktArea2 = _generateWicketArea(area2);

    return _useJstsToTestForIntersection(wktArea1, wktArea2);
  };

  return {
    // 计算一组坐标(高德)的中心点坐标
    'calculateCenter': calculateCenter, // 根据divId,center初始化地图
    'mapInit': mapInit, // 获取随机颜色
    'getColor': getColor, // 初始化多边形,返回polygon对象
    'setPolygon': setPolygon, // 根据一个坐标点设置marker
    'setPolyline': setPolyline, // 绘制折线
    'setMarker': setMarker, // 获取一个自定义内容marker
    'getCustomMarker': getCustomMarker, // 绘制多边形
    'drawPolygon': drawPolygon, // 为多边形添加点击事件
    'addPolygonEvent': addPolygonEvent, // 创建infoWindow对象
    'setInfoWindow': setInfoWindow,

    'getDotNumberCustomMarkers': getDotNumberCustomMarkers,

    'setCustomerMarkers': setCustomerMarkers,

    'getMarker': getMarker,

    'getMarkerWithoutNumber': getMarkerWithoutNumber,

    'isOverlayArea': isOverlayArea

  };
}];
