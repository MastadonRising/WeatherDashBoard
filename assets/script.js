// Variables 
var cityList = $('#cities')
var submit = $("#submit");
var cities = $('#cities');
var apiKey= '166a433c57516f51dfab1f7edaed8413'
var weatherUrl= 'https://api.openweathermap.org/data/2.5/'



// all my functions set aside so I can focus on the Order.

function getCities() {
    var cityList = JSON.parse(localStorage.getItem("cityList")) || [];

    $('#cities').empty();
    cityList.forEach ( function (city) {
      let cityNameDiv = $('<div>');
      cityNameDiv.addClass("cityList");
      cityNameDiv.attr("value",city);
      cityNameDiv.text(city);
      $('#cities').append(cityNameDiv);
    });
  };
function updateCityList(inputCity) {
    let cityList = JSON.parse(localStorage.getItem("cityList")) || [];
    cityList.push(inputCity);
    //cant be strung together
    cityList.sort();

    // removes dulicate cities unless misspelled
    for (let i=1; i<cityList.length; i++) {
       if (cityList[i] === cityList[i-1]) cityList.splice(i,1);
    }

    //stores in local storage
    localStorage.setItem('cityList', JSON.stringify(cityList));
  };

function weatherInfo(){
    var e= event.target
 if( e.className == 'cityList')
    { var inputCity = e.innerHTML;
        }
    else {
        var inputCity = $('#inputCity').val().trim()
    };
    
      event.preventDefault();
    // updates citylist array for every new city
    updateCityList(inputCity);
    // Displays updated cityList
    getCities()
    // Current day call
    var queryUrl = `${weatherUrl}weather?q=${inputCity}&units=imperial&appid=${apiKey}`
       
    $.ajax({
        url: queryUrl,
        method:'get'
    }).then(
        function(response){
         console.log(response);
        var date= moment(response.dt*1000).format('MM-DD-YYYY');
    $('#cityName').text( response.name + ' '+ date);
    $('#curWeathIcn').attr('src', 'http://openweathermap.org/img/w/'+response.weather[0].icon +'.png');
    $('#curTemp').text("Temp: " + response.main.temp + " F");
    $('#curHum').text("Humidity: " + response.main.humidity + "%");
    $('#curWind').text("Windspeed: " + response.wind.speed + " MPH")
    //  Display UV index
    getUvIndex(response)
         })
        
    
    // 5 day Forcast Query
    var queryUrl = `${weatherUrl}forecast/daily?q=${inputCity}&units=imperial&appid=${apiKey}`
    // holds all the days
    var weatherArr=[];
    // holds data about each day
    var forcast ={};
    // gets the data for each day
    $.ajax({ 
        url: queryUrl,
        method:'GET'
    }).then(function(response){
         for (i = 1; i < response.list.length; i++) {
            var days = response.list[i]
            forcast = {
              weather: days.weather[0].description,
              icon: `http://openweathermap.org/img/w/${days.weather[0].icon}.png`,
              minTemp: days.temp.min,
              maxTemp: days.temp.max,
              humidity: days.humidity,
              date: moment(days.dt *1000).format('MM-DD_YYYY'),
            };
            weatherArr.push(forcast);
            //console.log(forcast)
        };
       forecast(weatherArr)
    })
   
 // closes function
};
function getUvIndex(response) {
    city = `lat=${parseInt(response.coord.lat)}&lon=${parseInt(response.coord.lon)}`;
    // clears the old UV index
    $('#curUv').empty()
    // set queryURL based on type of query
    requestType = 'uvi';
    query = `?${city}&appid=${apiKey}`;
    queryURL = `${weatherUrl}${requestType}${query}`;

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function (response) {
      var bkcolor = "violet";

      var uv = parseFloat(response.value);

      if (uv < 3) { 
        bkcolor = 'green';
      } else if (uv < 6) { 
        bkcolor = 'yellow';
      } else if (uv < 8) { 
        bkcolor = 'orange';
      } else if (uv < 11) { 
        bkcolor = 'red';
      }

      var title = '<span>UV Index: </span>';
      var color = title + `<span style="background-color: ${bkcolor}; padding: 0 7px 0 7px;">${response.value}</span>`;

      $('#curUv').append(color);
    }); 
  };
  function forecast(forecast) {
    // emptys out the old cards
    $('#forecast').empty()
// Builds the new cards
    for  (i = 1; i < forecast.length; i++) {
      var colmx1 = $('<div class="col mx-1">');
      var cardBody = $('<div class="card-body forecast-card">');
      var cardTitle = $('<h5 class="card-title">');
      cardTitle.text(forecast[i].date);
      var ul = $('<ul>');

      var iconLi = $('<li>');
      var iconI = $('<img>');
        iconI.attr('src', forecast[i].icon);

      var weathLi = $('<li>');
      weathLi.text(forecast[i].weather);

      var tempMinLi = $('<li>');
      tempMinLi.text('Min Temp: ' + forecast[i].minTemp + " F");

      var tempMaxLi = $('<li>');
      tempMaxLi.text('Max Temp: ' + forecast[i].maxTemp + " F");

      var humLi = $('<li>');
      humLi.text('Humidity: ' + forecast[i].humidity + "%");

      iconLi.append(iconI);
      ul.append(iconLi).append(weathLi).append(tempMinLi).append(tempMaxLi).append(humLi);
      cardTitle.append(ul);
      cardBody.append(cardTitle);
      colmx1.append(cardBody);
      $('#forecast').append(colmx1);
    }
  };

// stuff that happens in Order of happening
//   two input meathods 
submit.on('click', weatherInfo);
cityList.on('click', weatherInfo);
// on load displays cities in local storage
getCities()