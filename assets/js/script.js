var cities = JSON.parse(localStorage.getItem("buttons")) || [];

//document on ready function: pulls data from local storage and renders last city entered by user, or returns if local storage is empty
$(document).ready(function () {
  var recentCity = cities[cities.length - 1];
  if (!cities.length) {
    return;
  }

  if (typeof recentCity == "undefined") {
    return;
  } else {
    callOpenWeather(recentCity);
  }
  makeButtons();
});

//chained calls to Openweather API: "current weather" and "one call"
function callOpenWeather(cityName, triggerButtons) {
  var thisCityName = cityName;
  var key = "13a8c1580f78868c2f813ca69b36b2cf";
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    thisCityName +
    "&units=imperial&appid=" +
    key;

  $.ajax({
    url: queryURL,
    method: "GET",
    // error: function(response){
    //   console.log(response)
    //   var errorCode = response.responseJSON.cod;
    //   var errorMessage =response.responseJSON.message;

    //   alert(("Error "+errorCode+" "+errorMessage+". Please re-check spelling and try again."));
    //   return;
    // }
  })
    .then(function (response) {
      renderMain(response);

      if (triggerButtons) {
        makeButtons(response.name);
      }
      //create variables for 2nd API call
      var lat = response.coord.lat;
      var lon = response.coord.lon;

      var uvURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=minutely,hourly,alerts&units=imperial&appid=" +
        key;

      $.ajax({
        url: uvURL,
        method: "GET",
      }).then(function (data) {
        //send data to renderUV function
        renderUV(data);
        renderForecast(data);
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}

//renders main dashboard section
function renderMain(response) {
  $("#searchResults").empty();

  var cityEl = $("<h2>");
  var tempEl = $("<p>");
  var humidEl = $("<p>");
  var windEl = $("<p>");
  var imgEl = $("<img>");

  var name = response.name;
  var date = "(" + moment(response.dt, "X").format("L") + ")";
  var icon = response.weather[0].icon;
  var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
  var temp = Math.round(response.main.temp) + " °F";
  var humid = response.main.humidity + " %";
  var wind = Math.round(response.wind.speed) + " mph";

  cityEl.text(name + " " + date);
  imgEl.attr({ src: iconURL, alt: "weather icon" });
  tempEl.text("Temperature: " + temp);
  humidEl.text("Humidity: " + humid);
  windEl.text("Wind-speed: " + wind);

  $("#searchResults").addClass("p-4 mainContainer");
  $("#searchResults").append(cityEl, imgEl, tempEl, humidEl, windEl);
}

//renders UV index to main dashboard
function renderUV(data) {
  var uvVal = data.current.uvi;
  var UVI = "UV Index: ";
  var uvEl = $("<p>");
  var uvSpanEl = $("<div class='d-inline'>");

  uvEl.text(UVI).append(uvSpanEl.text(uvVal));

  $("#searchResults").append(uvEl);

  uvColor(uvVal, uvSpanEl);
}

//Color-codes UV index based on UV value
function uvColor(uvVal, uvSpanEl) {
  if (uvVal >= 3 && uvVal <= 5) {
    uvSpanEl.addClass("moderate");
  } else if (uvVal >= 5 && uvVal <= 7) {
    uvSpanEl.addClass("high");
  } else if (uvVal >= 7 && uvVal <= 10) {
    uvSpanEl.addClass("veryHigh");
  } else if (uvVal > 10) {
    uvSpanEl.addClass("extreme");
  }
}

//renders 5-day forecast to dashboard
function renderForecast(data) {
  $("#fiveDay").empty();
  $("#title").text("Five Day Forecast");

  for (var i = 1; i < 6; i++) {
    var forecastCard = $("<div class='col bg-info p-2 m-2 radius'>");
    var dateEl = $("<h5>");
    var iconEl = $("<img>");
    var tempEl = $("<p>");
    var humidEl = $("<p>");

    var unixDate = data.daily[i].dt;
    var calDate = moment(unixDate, "X").format("L");
    var forecastIcon = data.daily[i].weather[0].icon;
    var iconURL =
      "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png";
    var forecastTemp = "Temp: " + Math.round(data.daily[i].temp.max) + " °F";
    var forecastHumid = "Humidity: " + data.daily[i].humidity + " %";

    dateEl.text(calDate);
    iconEl.attr({ src: iconURL, alt: "weather icon" });
    tempEl.text(forecastTemp);
    humidEl.text(forecastHumid);

    forecastCard.append(dateEl, iconEl, tempEl, humidEl);
    $("#fiveDay").append(forecastCard);
  }
}

//renders buttons with cities entered by user, sends inpt
function makeButtons(cityName) {
  $("#btnList").empty();
  if (cityName) {
    cities.push(cityName);
  }

  for (var i = 0; i < cities.length; i++) {
    var btnEl = $("<button>");
    btnEl.addClass("city text-center btn btn-outline-secondary form-control");
    btnEl.attr("data-name", cities[i]);
    btnEl.attr("type", "button");
    btnEl.text(cities[i]);

    $("#btnList").prepend(btnEl);

    localStorage.setItem("buttons", JSON.stringify(cities));
  }
}

//on-click handler for input-search button
$("#searchBtn").on("click", function (e) {
  e.preventDefault;

  if ($("#input").val() != "") {
    var cityName = $("#input").val().trim();

    $("#input").val("");

    callOpenWeather(cityName, true);
  } else {
    return;
  }
});

//on-click handler for generated buttons
$(document).on("click", ".city", function (e) {
  e.preventDefault;

  callOpenWeather($(this).text());
});
