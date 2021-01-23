

var cities = [];



$(document).ready(function(){
    var cities = JSON.parse(localStorage.getItem('buttons'))|| [];
    makeButtons(cities);
});

    
function callOpenWeather (){
    var thisCityName =$(this).data('name');
    var key = "13a8c1580f78868c2f813ca69b36b2cf"
    var queryURL = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q="+thisCityName+"&units=imperial&appid="+key;
    
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){
        //send response to renderDashboard function
        renderMain(response);

        //create variables for 2nd API call
        var lat = response.coord.lat;
        var lon = response.coord.lon;
       
        var uvURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,alerts&units=imperial&appid="+key;

        $.ajax({
          url: uvURL,
          method: "GET"
        }).then(function(data){
          //send data to renderUV function
          renderForecast(data);
      });
      
    });
    

};

function renderMain(response){
  $('#searchResults').empty()

var cityEl = $("<h2>");
var citySpanEl = $("<span>");
var tempEl = $("<p>");
var humidEl = $("<p>");
var windEl = $("<p>");
var imgEl = $("<img>");

var name = (response.name);
var date = moment(response.dt, "X").format("L");
var icon = (response.weather[0].icon);
var iconURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
var temp = (Math.round(response.main.temp)+" °F");
var humid = (response.main.humidity+" %");
var wind = (Math.round(response.wind.speed)+" mph");


cityEl.text(name+" "+date);
imgEl.attr({"src":iconURL, "alt": "weather icon"})
tempEl.text("Temperature: "+temp);
humidEl.text("Humidity: "+humid);
windEl.text("Wind-speed: "+wind);


 $("#searchResults").append(cityEl, imgEl, tempEl, humidEl, windEl);

};

function renderForecast(data){
console.log(data); 
var UVI= "UV Index: "+data.current.uvi;
var uvEl = $("<p>");

uvEl.append(UVI);
$("#searchResults").append(uvEl);


};

function makeButtons(cities){
 $("#btnList").empty();
 for(var i = 0; i < cities.length; i++){
    var btnEl = $("<button>");
    btnEl.addClass("city text-center btn btn-outline-secondary form-control");
    btnEl.attr("data-name", cities[i]);
    btnEl.attr("type", "button")
    btnEl.text(cities[i]);
    
    $("#btnList").prepend(btnEl);

    localStorage.setItem("buttons", JSON.stringify(cities));
    
 };
};

$("#searchBtn").on("click", function(e){
    e.preventDefault;
    var cities = JSON.parse(localStorage.getItem('buttons'))|| [];
    console.log(cities);
    
    var cityName = $("#input").val().trim();
    cities.push(cityName);
    
    $("#input").val("");
   
   callOpenWeather(this);
   makeButtons(cities); 

});
$(document).on("click", ".city", callOpenWeather);

makeButtons(cities);