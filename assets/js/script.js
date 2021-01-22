

//for use in calling API to get UV index.  This call should be chained off the first
// var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat="+"{lat}"+"&lon="+"{lon}"+"&appid="+key;

var cities = [];



$(document).ready(function(){
    var cities = JSON.parse(localStorage.getItem('buttons'))|| [];
    console.log(cities);
    makeButtons(cities);
});

    
function callOpenWeather (){
    var thisCityName =$(this).data('name');
    var key = "13a8c1580f78868c2f813ca69b36b2cf"
    var queryURL = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/forecast?q="+thisCityName+"&units=imperial&appid="+key;
    console.log(thisCityName);
    
    
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){

        console.log(response);


      });

    

}


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
   
   callOpenWeather(cityName);
   makeButtons(cities); 

});
$(document).on("click", ".city", callOpenWeather);

makeButtons(cities);