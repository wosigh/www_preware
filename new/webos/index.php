<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-US">
<head>
    <title>WebOS UI Test</title>
    <link type="text/css" href="css/custom-theme/jquery-ui-1.8.custom.css" rel="stylesheet" />
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.0/jquery-ui.min.js"></script>
    <link type="text/css" href="css/webos-css3.css" rel="stylesheet" />
<script type="text/javascript" src="http://jquery-scrollview.googlecode.com/files/jquery.scrollview.js"></script>
<script type="text/javascript">
function updateTime()
{
    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    if (minutes < 10){
        minutes = "0" + minutes
    }
    if (hours > 12){
        hours = hours - 12;
    }
    var timeString = hours + ":" + minutes;
    $(".webos-time").text(timeString);
    setTimeout('updateTime()', 60000);
}

$(document).ready(function(){
  $("#tall").scrollview({
    grab:"images/openhand.cur",
    grabbing:"images/closedhand.cur"
  });
  updateTime();
});

</script>
</head>
<body>
    <div class="webos-wrapper">
        <div class="webos-phone">
            <div class="webos-top-bar">
                <div class="webos-time">...</div>
            </div>
            <div class="webos-stage">
                <div class="webos-stage-tl webos-stage-corner"></div>
                <div class="webos-stage-tr webos-stage-corner"></div>
                <div class="scene-fade-top"></div>
                <div class="scene-fade-bottom"></div>



                <div class="webos-stage-bl webos-stage-corner"></div>
                <div class="webos-stage-br webos-stage-corner"></div>

                <div class="webos-stage-inner">

asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>
asdfasdfasdfA<br/>

                </div>
            </div>
        </div>
    </div>
</body>
</html>
