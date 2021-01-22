
var key = "13a8c1580f78868c2f813ca69b36b2cf"
var weatherURL = "api.openweathermap.org/data/2.5/forecast?q="+"{city name}"+"&units=imperial&appid="+key;
//for use in calling API to get UV index.  This call should be chained off the first
var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat="+"{lat}"+"&lon="+"{lon}"+"&appid="+key;

var cities = [];



$(document).ready(function(){
    var storedCities = JSON.parse(localStorage.getItem('buttons'))|| [];
    console.log(storedCities);
    makeButtons(storedCities);
});

function makeButtons(arr){
     $("#btnList").empty();

 for(var i = 0; i < arr.length; i++){
    var btnEl = $("<button>");
    btnEl.addClass("city text-center btn btn-primary");
    btnEl.attr("data-name", arr[i]);
    btnEl.attr("type", "button")
    btnEl.text(arr[i]);
    
     
    $("#btnList").prepend(btnEl);

    
   

    localStorage.setItem("buttons", JSON.stringify(cities));
    
 };
};

$("#searchBtn").on("click", function(e){
    e.preventDefault;
    
    var btnName = $("#input").val().trim();
    cities.push(btnName);
    
    $("#input").val("");
   makeButtons(cities); 
});

makeButtons(cities);