
var key = "13a8c1580f78868c2f813ca69b36b2cf"
var weatherURL = "api.openweathermap.org/data/2.5/forecast?q="+"{city name}"+"&units=imperial&appid="+key;
//for use in calling API to get UV index.  This call should be chained off the first
var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat="+"{lat}"+"&lon="+"{lon}"+"&appid="+key;

var btnArr = [];

$("#searchBtn").on("click", function(e){
    e.preventDefault;
    
    var btnName = $("#input").val().trim();
    btnArr.push(btnName);
    console.log(btnArr[0]);
    // createButtons();
    $("#input").val("");
});

function createButtons() {

 for(var i = 0; i < btnArr.length; i++){
    var btnList = $("#btnList");
    var btnEl = $("<button>");
    var btnName = btnEl.text($("input").val().trim());
     
    btnArr.push(btnName)
    btnList.prepend(btnEl);
    

 };

};
