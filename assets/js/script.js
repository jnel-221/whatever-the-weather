
var cities = [];

$(document).ready(function(){
    var cities = JSON.parse(localStorage.getItem('buttons'))|| [];
    console.log(cities[cities.length-1]);

    //conditional logic, what if it's empty?--don't call it, leave it blank? call Honolulu?
    callOpenWeather(cities[cities.length-1]);
    makeButtons(cities);
});

function callOpenWeather (cityName){
    var thisCityName =cityName;
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
          renderUV(data);
          renderForecast(data);
      });
      
    });
    

};

function renderMain(response){
  $('#searchResults').empty()

var cityEl = $("<h2>");
var tempEl = $("<p>");
var humidEl = $("<p>");
var windEl = $("<p>");
var imgEl = $("<img>");

var name = response.name;
var date = moment(response.dt, "X").format("L");
var icon = response.weather[0].icon;
var iconURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
var temp = Math.round(response.main.temp)+" °F";
var humid = response.main.humidity+" %";
var wind = Math.round(response.wind.speed)+" mph";


cityEl.text(name+" "+date);
imgEl.attr({"src":iconURL, "alt": "weather icon"})
tempEl.text("Temperature: "+temp);
humidEl.text("Humidity: "+humid);
windEl.text("Wind-speed: "+wind);

 $("#searchResults").addClass("p-4");
 $("#searchResults").append(cityEl, imgEl, tempEl, humidEl, windEl);

};

function renderUV(data){
  var uvVal= data.current.uvi;
  var UVI= "UV Index: "+uvVal;
  var uvEl = $("<p>");
  
  uvEl.append(UVI);
  $("#searchResults").append(uvEl);
  
  uvColor(uvVal, uvEl);
}
//needs some thought; take a look at how element is constructed and rebuild render UV and color functionality
function uvColor(uvVal, uvEl){
  // console.log(typeof uvVal)
  // console.log(uvEl);
  if(uvVal >= 3 && uvVal <= 5){
    uvEl.addClass('.moderate');
  }

}
function renderForecast(data){
 $("#fiveDay").empty();
 $("#title").text("Five Day Forecast");
  
 for(var i = 1; i < 6; i++){
  var forecastCard = $("<div class='col bg-info p-2 m-2'>") 
  var dateEl = $("<h5>");
  var iconEl = $("<img>");
  var tempEl = $("<p>");
  var humidEl = $("<p>");
  
  var unixDate = data.daily[i].dt;
  var calDate = moment(unixDate, "X").format('L');
  var forecastIcon = data.daily[i].weather[0].icon;
  var iconURL = "http://openweathermap.org/img/wn/"+forecastIcon+"@2x.png";
  var forecastTemp = "Temp: "+Math.round(data.daily[i].temp.max)+" °F";
  var forecastHumid = "Humidity: "+data.daily[i].humidity+" %";

   dateEl.text(calDate);
   iconEl.attr({"src": iconURL, "alt": "weather icon"});
   tempEl.text(forecastTemp);
   humidEl.text(forecastHumid);
  
   forecastCard.append(dateEl, iconEl, tempEl, humidEl);
   $("#fiveDay").append(forecastCard);
   
 }
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
   
   callOpenWeather(cityName);
   makeButtons(cities); 

});
$(document).on("click", ".city", function(e){
  e.preventDefault;
  callOpenWeather($(this).text());
});

makeButtons(cities);