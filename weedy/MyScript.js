	
function Login(){
	if($("#pwd").val()=='chicken8')
	{
		$("#box2").fadeOut();
		$("#box3").show();
		
		firebase.database().ref('小雞婚禮問卷資訊').orderByChild('時間').on('value', function(snapshot) {
			$("#qno").html(snapshot.numChildren());
			
			$("#result").html('');
			snapshot.forEach(function(childSnapshot) {
				var HTML = "";
				
				var Q1 = '不要喜帖';
				if(childSnapshot.val().要收喜帖)
				{
					Q1 = childSnapshot.val().地址;
				}
				
				var Q2 = '不出席';
				
				if(childSnapshot.val().出席)
				{
					Q2 = childSnapshot.val().出席人數;
				}
				
				var Q3 = '';
				
				if(childSnapshot.val().關係.charAt(0)=='1')
				{
					Q3 += '男方的親戚<br>';
				}
				
				if(childSnapshot.val().關係.charAt(1)=='1')
				{
					Q3 += '男方的朋友（含同學）<br>';
				}
				
				if(childSnapshot.val().關係.charAt(2)=='1')
				{
					Q3 += '男方的教會朋友<br>';
				}
				
				if(childSnapshot.val().關係.charAt(3)=='1')
				{
					Q3 += '女方的親戚<br>';
				}
				
				if(childSnapshot.val().關係.charAt(4)=='1')
				{
					Q3 += '女方的朋友（含同學）<br>';
				}
				
				if(childSnapshot.val().關係.charAt(5)=='1')
				{
					Q3 += '男方的親戚<br>';
				}
				
				if(childSnapshot.val().關係.charAt(6)=='1')
				{
					Q3 += '女方同事<br>';
				}
				
				if(childSnapshot.val().關係.charAt(7)=='1')
				{
					Q3 += '女方的教會朋友<br>';
				}
				
				if(childSnapshot.val().關係.charAt(8)=='1')
				{
					Q3 += '其他：'+childSnapshot.val().其它+'<br>';
				}
				
				






				
				
					HTML +='<center><table class="contacts" cellspacing="0" summary="Contacts template">';
					HTML +='<tr>';
					HTML +='<td class="contactDept" colspan="3">'+childSnapshot.val().姓名+'</td>';
					HTML +='</tr>';
					HTML +='<tr>';
					HTML +='<td class="contact" width="25%">喜帖地址：</td>';
					HTML +='<td class="contact" width="60%">'+Q1+'</td>';
					HTML +='<td class="contact"></td>';
					HTML +='</tr>';
					
					HTML +='<tr>';
					HTML +='<td class="contact" width="25%">出席人數：</td>';
					HTML +='<td class="contact" width="60%">'+Q2+'</td>';
					HTML +='<td class="contact"></td>';
					HTML +='</tr>';
					
					HTML +='<tr>';
					HTML +='<td class="contact" width="25%">素食餐點：</td>';
					HTML +='<td class="contact" width="60%">'+childSnapshot.val().素食+'</td>';
					HTML +='<td class="contact"></td>';
					HTML +='</tr>';
					
					HTML +='<tr>';
					HTML +='<td class="contact" width="25%">關係：</td>';
					HTML +='<td class="contact" width="60%">'+Q3+'</td>';
					HTML +='<td class="contact"></td>';
					HTML +='</tr>';
					
					HTML +='<tr>';
					HTML +='<td class="contact" width="25%">填表時間：</td>';
					HTML +='<td class="contact" width="60%">'+formatDate(new Date(childSnapshot.val().時間))+'</td>';
					HTML +='<td class="contact"></td>';
					HTML +='</tr>';
					
					HTML +='</table></center><br>';
				
				$("#result").prepend(HTML);
			});
		});
	}
	else	
	{
		alert('密碼錯誤');
	}
}
	
function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? '下午' : '早上';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  hours = hours < 10 ? '0'+hours : hours;
  var strTime = ampm + hours + ':' + minutes + ' ';
  return padLeft(date.getMonth()+1,2,'0') + 
		 "/" + padLeft(date.getDate(),2,'0') + "  " + strTime;
}

function padLeft(str,length,sign)
{
	str = str.toString();
	if (str.length >= length) return str;
	else return padLeft(sign + str, length, sign);
}
	
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
		
		//$("#TitleImg").prop('src','images/img04.jpg');
		$("#TitleImg").hide();
		$("#box1").hide();
		$("#box2").hide();
		$("#box3").show();
	}
	catch(e)
	{
		alert("喔喔，系統壞掉了啦...快聯絡Double Lee");
		console.log(e);
	}
	
	
	
}

	
	
	
	
	
	
	
	
	