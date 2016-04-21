$(function() {
	var url = location.protocol+'//'+location.host+location.pathname;
	W.require.bind(null, ['maps'], function(maps) {
		var LNGLAT_PROVINCE = {
			"新疆": [87.606117, 43.790939],
			"西藏": [91.13205, 29.657589],
			"内蒙古": [111.6633, 40.820942],
			"青海": [101.787453, 36.609447],
			"四川": [104.081757, 30.661057],
			"黑龙江": [126.643341, 45.741493],
			"甘肃": [103.750053, 36.068039],
			"云南": [102.704567, 25.043844],
			"广西": [108.311768, 22.806543],
			"湖南": [112.98127, 28.200825],
			"陕西": [108.949028, 34.261684],
			"广东": [113.261429, 23.118912],
			"吉林": [125.31543, 43.892563],
			"河北": [114.489777, 38.045128],
			"湖北": [114.291939, 30.567514],
			"贵州": [106.711372, 26.576874],
			"山东": [117.0056, 36.667072],
			"江西": [115.899918, 28.675991],
			"河南": [113.650047, 34.757034],
			"辽宁": [123.411682, 41.796616],
			"山西": [112.569351, 37.871113],
			"安徽": [117.275703, 31.863255],
			"福建": [119.297813, 26.07859],
			"浙江": [120.159248, 30.265995],
			"江苏": [118.772781, 32.047615],
			"重庆": [106.510338, 29.558176],
			"宁夏": [106.271942, 38.46801],
			"海南": [110.346512, 20.031794],
			"台湾": [121.514282, 25.049128],
			"北京": [116.380943, 39.923615],
			"天津": [117.203499, 39.131119],
			"上海": [121.469269, 31.238176],
			"香港": [114.154404, 22.280685],
			"澳门": [113.550056, 22.200796]
		};
		var markers = [];
		function addProvinceName(level) {
			var tmp;
			while ((tmp = markers.shift())) {
				maps.removeLayer(tmp);
			}
			for (var i in LNGLAT_PROVINCE) {
				var val = LNGLAT_PROVINCE[i];
				var myIcon = L.divIcon({
					className: 'map_label level_' + maps.getZoom(),
					html: '<span>' + i + '</span>'
				});
				var marker = L.marker([val[1], val[0]], {
					icon: myIcon
				}).addTo(maps);
				markers.push(marker);
			}
		}
		addProvinceName();
		var marker_star = new L.Marker({
			icon: L.icon({
    			iconUrl: 'js/images/marker-icon-2x.png',
    		})
		});
		maps.on('zoomend', function(e) {
			addProvinceName();
		});
		var canload = true;
		function onMapClick(e) {
			var lon, lat, city, dirdes, message_detail_two_right_str, leval, wind_leval = null;
			if (canload) {
				canload = false;
				$(".message").removeClass('message_show');
				$(".loading_pic_container").addClass('message_show');
				marker_star && maps.removeLayer(marker_star);
				marker_star = L.marker(e.latlng, {
					icon: L.icon({
		    			iconUrl: 'http://www.welife100.com/fengc/js/images/marker-icon-2x.png',
		    			iconSize: [24, 30],
		    		})
				}).addTo(maps);
				lon = e.latlng.lng.toString(); //经度转换成字符串
				lat = e.latlng.lat.toString(); //纬度转换成字符串
				$.ajax({
					url: "agent.html",
					type: 'get',
					data: {
						"type": 1,
						"longitude": lon,
						"latitude": lat
					},
					dataType: 'json',
					success: function(data) {
						canload = true;
						var desc = data.discript;
						var de_a = desc[1];
						var de_b = desc[2];
						var de_c = desc[3];
						leval = data.forecast[0].windlevel;
						if (leval == 1) {
							wind_leval = "0-3级";
						}else if(leval == 2){
							wind_leval = "4-5级";
						}else if(leval == 3){
							wind_leval = "6级以上";
						}
						dirdes = data.forecast[0].dirdes; //风向
						var speed_string = data.forecast[0].speed.toString().substring(0, 3);
						var speed = speed_string + "m/s"; //风速
						var message_detail_two_left_str = speed + de_a + '<br/>' + dirdes;
						var air = ''; //空气质量
						var colorArr = ["#30c637", "#ffff00", "#ff7e00", "#ff0000", "#7f007f", "#7e0000"];
						var colorindex = "";
						var fontcolor = "";
						if (data.forecast15day != undefined) {
							city = data.forecast15day.c.c5;
						} else {
							city = "未知城市";
						}
						if (data.air != undefined) {
							air = data.air.k.k3.split("|")[0];
						}else{
							air = '';
							message_detail_two_right_str = '';
						}
						if (air > 0 && air < 50) {
							colorindex = colorArr[0];
							message_detail_two_right_str = air + "优";
						} else if (51 < air && air < 100) {
							colorindex = colorArr[1];
							fontcolor = "black";
							message_detail_two_right_str = air + "良";
						} else if (101 < air && air < 150) {
							colorindex = colorArr[2];
							message_detail_two_right_str = air + "轻度污染";
						} else if (151 < air && air < 200) {
							colorindex = colorArr[3];
							message_detail_two_right_str = air + "中度污染";
						} else if (201 < air && air < 300) {
							colorindex = colorArr[4];
							message_detail_two_right_str = air + "重度污染";
						} else if (air > 300) {
							colorindex = colorArr[5];
							message_detail_two_right_str = air + "严重污染";
						}
						var _left = $(".message-detail-two-left");
						var _right = $(".message-detail-two-right");
						_right.css({
							"background": colorindex,
							"color": fontcolor
						});
						$(".loading_pic_container").removeClass('message_show');
						$(".message").addClass('message_show');
						message = city +':'+ de_b + ',' + de_c;
						$(".message-detail-one").html(message);
						_left.html(message_detail_two_left_str);
						_right.html(message_detail_two_right_str);
						_right.css({
							"background": colorindex,
							"color": fontcolor
						});
						$(".confirm_btn").click(function() {
							$(".message-detail-one").html("");
							_left.html("");
							$(".message").removeClass('message_show');
						})

						var desc = '';
						if (message_detail_two_right_str) {
							desc = '这里是'+city+"，当前为"+dirdes+wind_leval+'，空气质量'+message_detail_two_right_str;
						}else{
							desc = '这里是'+city+"，当前为"+dirdes+wind_leval;
						}
						_share(url, "蓝PI风神送你最新的空气质量预报！", desc, 'http://www.welife100.com/fengc/img/icon200.jpg');
					}
				})
			}
		}
		maps.on('click', onMapClick);
	})();
	return;
})