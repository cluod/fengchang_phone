<?php
date_default_timezone_set("Asia/chongqing");
//echo 111;exit;
set_time_limit(0);
switch($_GET['type']){
	case 1:
		$res=lonlatinfo($_GET);
		break;
}
echo $res;
function lonlatinfo($info){
	//$time=date("YmdH",time());
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


	$date=date("YmdH",time());

	//生成公钥
	$public_key=$ULRPRE."?lon=".$longitude."&lat=".$latitude."&date=".$date."&appid=".$appid;
	//echo $public_key."<br />";
	//哈希一个令牌
	$key = base64_encode(hash_hmac('sha1',$public_key,$private_key,TRUE));
	$URL=$public_key=$ULRPRE."?lon=".$longitude."&lat=".$latitude."&date=".$date."&appid=".$appid_six."&key=".urlencode($key);
	//echo $URL."<br />";
	/*$ch = curl_init();
	curl_setopt ($ch, CURLOPT_URL, $URL);
	curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1); 
	curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT,10);
	$res = curl_exec($ch);*/ 
	$res=file_get_contents($URL);
	return $res ;
}



?>