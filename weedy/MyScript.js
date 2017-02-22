function showMap()
{
 $("#map").slideToggle();
 if($("#textInfo").html()=='點此看詳細資訊')
 {
	$("#textInfo").html("隱藏");
 }
 else
 {
	$("#textInfo").html("點此看詳細資訊");
 }
 
}

function ShowQ4(){
	if($("#Q2_1").prop('checked'))
	{
		$("#Q4").fadeIn();
	}
	else
		$("#Q4").fadeOut();
}

function ShowAddress(){
	if($("#Q1_1").prop('checked'))
	{
		$("#Li_address").fadeIn();
	}
	else
		$("#Li_address").fadeOut();
}

function Q6_9_Chg()
{
	if(!$('#Q6_9').prop('checked'))
		$("#Otr").val('');
}

	// Initialize Firebase
	  var config = {
		apiKey: "AIzaSyCQUS5UXFXcXwJOqXDx30pPHZVn70uULzs",
		authDomain: "cratdemo-15d24.firebaseapp.com",
		databaseURL: "https://cratdemo-15d24.firebaseio.com",
		storageBucket: "cratdemo-15d24.appspot.com",
		messagingSenderId: "745988036892"
	  };
	  
	  firebase.initializeApp(config);
	  
	  var database = firebase.database();
	
	
function Send(){
	
	if($(".myButton").text()=='傳送中..')
		return;
	
	for(var i=1;i<=8;i++)
		$("#err"+i).html("");
	
	
	
	//防呆
	var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
	if($("#Name").val().trim().length<1)
	{
		$("#err1").html("<font color=red>請輸入姓名，謝謝！</font>");
		$body.animate({
			scrollTop:  $('#Q1').offset().top
		}, 300);
		return;
	}
	/*
	if($("#Phone").val().trim().length<1)
	{
		$("#err8").html("<font color=red>請留下任何聯絡方式，謝謝！</font>");
		$body.animate({
			scrollTop:  $('#Li_Phone').offset().top
		}, 300);
		return;
	}
	*/

	if(!$("#Q1_1").prop('checked') && !$("#Q1_2").prop('checked'))
	{
		$("#err2").html("<font color=red>請留下您的意願，謝謝！</font>");
		$body.animate({
			scrollTop:  $('#Q2').offset().top
		}, 300);
		return;
	}
	
	if($("#Q1_1").prop('checked') && $("#Address").val().trim().length<1)
	{
		$("#err3").html("<font color=red>請留下您的地址，謝謝！</font>");
		$body.animate({
			scrollTop:  $('#Li_address').offset().top
		}, 300);
		return;
	}
	
	if(!$("#Q2_1").prop('checked') && !$("#Q2_2").prop('checked'))
	{
		$("#err4").html("<font color=red>請告訴我們您的意願，謝謝！</font>");
		$body.animate({
			scrollTop:  $('#Q3').offset().top
		}, 300);
		return;
	}
		
	if($("#Q2_1").prop('checked') && $("#Q4_Text").val().trim().length<1)
	{
		console.log(3.5);
		
		$("#err5").html("<font color=red>請填寫出席人數，謝謝！</font>");
		$body.animate({
			scrollTop:  $('#Q4').offset().top
		}, 300);
		return;
	}
	
	if($('#Q5_Select :selected').text()=='請選擇')
	{
		$("#err6").html("<font color=red>請選擇是否需要素食餐點，謝謝！</font>");
		$body.animate({
			scrollTop:  $('#Q5').offset().top
		}, 300);
		return;
	}
	
	var ChooseOne = false;
	
	var RelStr='';
	for(var i=1;i<=9;i++)
	{
		if($("#Q6_"+i).prop('checked'))
		{
			ChooseOne = true;
			RelStr+='1';
		}
		else
			RelStr+='0';
			
	}
	
	console.log(4);
	
	if(!ChooseOne)
	{
		$("#err7").html("<font color=red>至少選一個嘛..謝謝啦！</font>");
		$body.animate({
			scrollTop:  $('#Q6').offset().top
		}, 300);
		return;
	}
	
	//---防呆結束，做正事
	
	$(".myButton").text("傳送中..");
	
	try
	{
		var JSONstr = {
			'姓名':$("#Name").val(),
			'要收喜帖':$("#Q1_1").prop('checked'),
			'地址':$("#Address").val(),
			'出席':$("#Q2_1").prop('checked'),
			'出席人數':$("#Q4_Text").val(),
			'素食':$('#Q5_Select :selected').text(),
			'關係':RelStr,
			'其它':$("#Otr").val(),
			'Message':$("#Message").val(),
			'時間':firebase.database.ServerValue.TIMESTAMP
			};
			
		database.ref('小雞婚禮問卷資訊').push().set(JSONstr);
		
		$("#TitleImg").prop('src','images/img04.jpg');
		$("#box2").hide();
		$("#box3").show();
	}
	catch(e)
	{
		alert("喔喔，系統壞掉了啦...快聯絡Double Lee");
		console.log(e);
	}
	
	
	
}
	
function Login(){
	if($("#pwd").val()=='chicken8'))
	{
		
	}
	else	
	{
		alert('密碼錯誤');
	}
}
	
	
	
	
	
	
	
	
	
	