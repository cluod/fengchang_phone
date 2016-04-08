<?php
//date_default_timezone_set("Asia/chongqing");
echo 111;exit;
set_time_limit(0);
var_dump($_GET);exit;
/*switch($_GET['type']){
	case 1:
		$res=lonlatinfo($_GET);
		break;
}
echo $res;
function lonlatinfo($info){
	$time=date("YmdH",time()-3600);
	$ULRPRE="http://scapi.weather.com.cn/weather/getBase_WindD";
	//2adhbp,2adhbptc4oi24dl2，web_fengchang
	//用户私钥  
	$private_key = 'web_fengchang';
	//数据使用用户定义
	$appid='2adhbptc4oi24dl2';
	//截取appid前6位
	$appid_six=substr($appid,0,6);
	//经度
	$longitude=$info["longitude"];
	//纬度
	$latitude=$info["latitude"];


	$date=date("YmdHi");

	//生成公钥
	$public_key=$ULRPRE."?lon=".$longitude."&lat=".$latitude."&date=".$date."&appid=".$appid;
	//echo $public_key."<br />";
	//哈希一个令牌
	$key = base64_encode(hash_hmac('sha1',$public_key,$private_key,TRUE));
	#http://scapi.weather.com.cn/product/radar/CR_CHINA_201408261253_1.png?loncenter=105.0&latcenter=33.2&lonspan=64.0&latspan=42.0&width=1000&date=201408261010&appid=f63d32&key=Q9i9t3BxCf1QCuqOlmCsIhn5Bvg%3D
	$URL=$public_key=$ULRPRE."?lon=".$longitude."&lat=".$latitude."&date=".$date."&appid=".$appid_six."&key=".urlencode($key);
	//echo $URL."<br />";
$ch = curl_init();curl_setopt ($ch, CURLOPT_URL, $URL);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1); 
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT,10);
$res = curl_exec($ch); 
	//$string=file_get_contents($URL);
	//var_dump($string);exit;
	return $res 
}



?>