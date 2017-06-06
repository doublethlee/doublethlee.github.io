
var canvas=null;
var PointsArr = [];
var NoMenuText = "<center><font color='red'>無AGV資料</font></center>";
var boolNoMenu = false;
var TheFindedPoint = "";


//假資料--------
var FakeTimer=null;
var RunCount = 0;
function RunningDemo()
{
    document.getElementById("btnRun").disabled = true;
    $("#RunningStatus").html("準備模擬中..");

    if(!FakeTimer)
    {
        FakeTimer = setInterval(function(){ 
            var DotTxt = "";
            for(var i=0;i<RunCount;i++)
            {
                DotTxt += ".";
            }
            RunCount++;
            if(RunCount>5)
                RunCount =0;

            $("#RunningStatus").html("模擬中"+DotTxt);
            $("#btnRun").text("停止模擬");
             document.getElementById("btnRun").disabled = false;
            var StatusArr = ["off","warring","OK","NG"];
            for(var i=0;i<PointsArr.length;i++)
            {
                PointsArr[i].status = StatusArr[GetRandom(3,0)];
                PointsArr[i].FR = GetRandom(100,0)+"%";
                PointsArr[i].Yield = GetRandom(100,0)+"%";

                ChgAvgColor(PointsArr[i].ID,PointsArr[i].status);
            }

        }, 5000);
    }
    else
    {
        clearInterval(FakeTimer);
        document.getElementById("btnRun").disabled = false;
        FakeTimer = null;
        $("#btnRun").text("模擬AGV訊號");
        $("#RunningStatus").html("");
    }
    
}

function GetRandom(max,min)
{
    var maxNum = max;  
    var minNum = min;  
    var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  

    return n;
}
//假資料--------END

//When Page Load
$(function() {

    //系統初始化
    Init();

    //載入先前資料
    LoadData();

});

//系統初始化
function Init(){

    //window.localStorage.clear();  //清除所有暫存資料

    //判斷視窗是否過小？

    //對話視窗處理
    $( "#dialog" ).dialog({ autoOpen: false });
    $(".ui-dialog-titlebar").hide();

    $("#MenuList").html("載入中..");
    

    canvas = document.getElementById('egvCanvas');
    //增加滑鼠點擊事件
    canvas.addEventListener("mousedown", CanvanClick, false);

    //增加視窗調整事件
}

//載入先前資料，Demo用，載入離線資料
function LoadData()
{
    $("#MenuList").html("");
    if(localStorage["PointsData"])
    {
        PointsArr = JSON.parse(localStorage["PointsData"]);

        for(var i=0;i<PointsArr.length;i++)
        {
            var Point = PointsArr[i];
            AddPoint(Point.ID,Point.Name,Point.X,Point.Y,Point.status,Point.FR,Point.Yield);
        }
    }
    else
    {
        boolNoMenu = true;
        $("#MenuList").html(NoMenuText);   
    }

}

function DeleteAll()
{
    swal({
    title: "動作確認",
    text: "是否要清空所有AGV資料？",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "清空!",
    closeOnConfirm: false
    },
    function(){
        swal("已清空!", "所有AGV資料已清除", "success");

        boolNoMenu = true;
        for(var i=0;i<PointsArr.length;i++)
        {
            //DelPoint(PointsArr[i].ID);
            $("#"+PointsArr[i].ID+"_Point").remove();
            $("#"+PointsArr[i].ID+"_Text").remove();
        }
        PointsArr = [];
        localStorage.removeItem('PointsData');
        $("#MenuList").html(NoMenuText);   
    });
    
}

function DelPoint(ID)
{
    $("#"+ID+"_Point").remove();
    $("#"+ID+"_Text").remove();
    $("#"+ID+"_Menu").remove();
    for(var i=0;i<PointsArr.length;i++)
    {
        if(PointsArr[i].ID==ID)
        {
            PointsArr.splice(i, 1);
            break;
        }
    }
    SaveData();
}

//在畫布上點下左鍵
function CanvanClick(event)
{

  $("#dialog_Msg1").show();
  $("#dialog_Msg2").hide();

  //抓取滑鼠座標
  var x = event.x;
  var y = event.y;

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  //修正滑鼠座標
  var myfix='',atfix='';
  var myPos = 'left';

  if(y>=$("#egvCanvas").height()-50)
  {
      myfix=' bottom';
      atfix=' bottom';
  }

  if(y<=50)
  {
      myfix=' top';
      atfix=' top';
  }

  if(x>=$("#egvCanvas").width()/2)
  {
    myPos = 'right';
  }
  else
  {
      myPos = 'left';
  }

  $("#txt_Egv_ID").val("");
  $("#txt_Egv_Name").val("");

  //秀出提示視窗
  $( "#dialog" ).dialog("open");
  $( "#dialog" ).dialog("option", { position: {
            my: myPos+myfix, 
            at: myPos+atfix, 
            of: event
        } 
        ,
        buttons: {
            "新增": function() {
                var ID = $("#txt_Egv_ID").val();
                var Name = $("#txt_Egv_Name").val();

                //防呆開始
                if(ID==""||Name=="")
                {
                    swal({
                        title: "Error!",
                        text: "請輸入AGV ID或Name",
                        type: "error",
                        confirmButtonText: "確定"
                    });
                    return ;
                }

                //防呆：判斷是否重覆
                var IsDouble = false;
                for(var i=0;i<PointsArr.length;i++)
                {
                    if(ID==PointsArr[i].ID
                    ||Name==PointsArr[i].Name
                    )
                    {
                        IsDouble = true;
                        break;
                    }
                }
                if(IsDouble)
                {
                    swal({
                        title: "Error!",
                        text: "AGV Name或ID重覆",
                        type: "error",
                        confirmButtonText: "確定"
                    });
                    return ;
                }
                //防呆結束

                AddPoint(ID,Name,event.x,event.y,'off','N/A');
                 PointsArr.push({'ID':ID,'Name':Name
                 ,'X':event.x,'Y':event.y,status:'off',FR:'N/A',Yield:'N/A'});
                 SaveData();
                $( this ).dialog( "close" );
            },
            "取消": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

//新增點位
function AddPoint(ID,Name,X,Y,status,FR,Yield)
{
    var Color = StatusColor(status);
    var HTML = "<div style='position:absolute;top:"+(Y-7)+
                    "px;left:"+(X-7)+"px'><div onclick='PointClick(\""+ID+"\");' id='"+ID+"_Point' class='circle' style='background:"+Color+"'></div></div>";

    HTML += "<div style='position:absolute;top:"+(Y-22)+
                    "px;left:"+(X-7)+"px'><span id='"+ID+"_Text'>"+Name+"<span></div>";

    $("#egvCanvasDIV").append(HTML);

    //新增選單
    HTML = "<div id='"+ID+"_Menu' class='PointMenu' style='background-color:"+Color+";' onclick='FindPoint(\""+ID+"\");'>"+ID+"</div><br>";

    if(boolNoMenu)
        $("#MenuList").html("");

    boolNoMenu = false;
    $("#MenuList").append(HTML);
}

//停止找AGV動畫
function StopFinding()
{
    if(TheFindedPoint!="")
    {
         $("#"+TheFindedPoint+"_Point").StopCss('flash');
    }
}

function FindPoint(ID)
{
    StopFinding();
    
    if(TheFindedPoint==ID)
    {
        TheFindedPoint = "";
    }
    else
    {
        $("#"+ID+"_Point").animateCss('flash',true);
        TheFindedPoint = ID;
    }
    
}

function PointClick(ID)
{
  $("#"+ID+"_Menu").animateCss('rubberBand');

  $("#dialog_Msg1").hide();
  $("#dialog_Msg2").show();

  //抓取滑鼠座標
  var x = $("#"+ID+"_Point").prop('left');
  var y = $("#"+ID+"_Point").prop('top');

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  //修正滑鼠座標
  var myfix='',atfix='';
  var myPos = 'left';

  if(y>=$("#egvCanvas").height()-50)
  {
      myfix=' bottom';
      atfix=' bottom';
  }

  if(y<=50)
  {
      myfix=' top';
      atfix=' top';
  }

  if(x>=$("#egvCanvas").width()/2)
  {
    myPos = 'right+10';
  }
  else
  {
      myPos = 'left+10';
  }

  $("#lbl_Egv_Name").html("載入中..");
  $("#lbl_Egv_ID").html("載入中..");
  $("#lbl_Egv_Yield").html("載入中..");
  $("#lbl_Egv_FR").html("載入中..");

  //秀出提示視窗
  $( "#dialog" ).dialog("open");
  $( "#dialog" ).dialog("option", { position: {
            my: myPos+myfix, 
            at: myPos+atfix, 
            of: event
        } 
        ,
        buttons: {
            "刪除": function() {
                
                swal({
                    title: "動作確認",
                    text: "是否要刪除「"+ID+"」的資料？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "刪除!",
                    closeOnConfirm: false
                    },
                    function(){
                        swal("已刪除!", "AGV 「"+ID+"」已刪除", "success");
                        StopFinding();
                        DelPoint(ID);
                        $( "#dialog" ).dialog("close");
                    });
            },
            "關閉": function() {
                StopFinding();
                $( this ).dialog( "close" );
            }
        }
    });

    for(var i=0;i<PointsArr.length;i++)
    {
        if(PointsArr[i].ID==ID)
        {
            $("#lbl_Egv_Name").html(PointsArr[i].Name);
            $("#lbl_Egv_ID").html(ID);
            $("#lbl_Egv_Yield").html(PointsArr[i].Yield);
            $("#lbl_Egv_FR").html(PointsArr[i].FR);
            break;
        }
        
    }
}

//顏色轉換
function StatusColor(status)
{
    switch(status)
    {
        case "off":
         return "#CCC";

         case "OK":
         return "#53FF53";

         case "warring":
         return "yellow";

         case "NG":
         return "red";
    }
}

function ChgAvgColor(ID,status)
{
    $("#"+ID+"_Point").css("background",StatusColor(status));
    $("#"+ID+"_Menu").css("background-color",StatusColor(status));
}

//儲存資料，這展示用，存到離線資料庫
function SaveData()
{
    localStorage["PointsData"] = JSON.stringify(PointsArr);
}