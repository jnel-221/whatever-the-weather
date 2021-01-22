

//for use in calling API to get UV index.  This call should be chained off the first
// 

var cities = [];



$(document).ready(function(){
    var cities = JSON.parse(localStorage.getItem('buttons'))|| [];
    console.log(cities);
    makeButtons(cities);
});

    
function callOpenWeather (){
    var thisCityName =$(this).data('name');
    var key = "13a8c1580f78868c2f813ca69b36b2cf"
    var queryURL = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q="+thisCityName+"&units=imperial&appid="+key;
    console.log(thisCityName);
    
    
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){
        //send response to renderDashboard function
        renderDashboard(response);

        //create variables for 2nd API call
        var lat = response.coord.lat;
        var lon = response.coord.lon;
       
        var uvURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,alerts&appid="+key;

        $.ajax({
          url: uvURL,
          method: "GET"
        }).then(function(data){
          //send data to renderUV function
          renderUV(data);
      });
      
    });
    

};

function renderDashboard(response){
  $('#searchResults').empty()
console.log(response)


};

function renderUV(data){
console.log(data);
};

function makeButtons(cities){
 $("#btnList").empty();
 for(var i = 0; i < cities.length; i++){
    var btnEl = $("<button>");
    btnEl.addClass("city text-center btn btn-secondary");
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