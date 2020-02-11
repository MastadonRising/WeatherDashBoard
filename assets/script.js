// Variables 
var cityList = $('#cities')
var submit = $("#submit");
var apiKey= '92da633d3d15d688dad9bffac774f506'
var weatherUrl= 'https://api.openweathermap.org/data/2.5/'

// stuff that happens in Order of happening
submit.on('click', weatherInfo);






// all my functions set aside so I can focus on the Order.
function weatherInfo(event){
    var inputCity = $('#cityInput').val();
    var cleanCity = inputCity.trim();
    var newCity = $("<li></li>").addClass('city').text(cleanCity).attr('id',cleanCity);
    event.preventDefault();
    console.log('weatherInfo working')
    console.log(inputCity)
    console.log(cleanCity)
    cityList.prepend(newCity)
    var queryUrl = weatherUrl +'weather?q='+ cleanCity + '&units=imperial&appid='+ apiKey
    console.log(queryUrl)
    $.ajax({
        url: queryUrl,
        method:'get'
    }).then(function(response){
        console.log('Ajax Working');
        console.log(response);
        var date= moment(response.dt*1000);
        weatherObj ={
            city: response.name,
            wind: response.wind.speed,
            humidity: response.main.humidity,
        temp: response.main.temp,
        date: date.format(),
        icon: `http://openweathermap.org/img/w/${response.weather[0].icon}.png`,
        desc: response.weather[0].description
        }
        console.log(weatherObj)
    })
    var queryUrl = weatherUrl +'forecast/daily?q='+ cleanCity + '&units=imperial&appid='+ '166a433c57516f51dfab1f7edaed8413'
    $.ajax({ 
        url: queryUrl,
        method:'get'
    }).then(function(response){
        console.log('Ajax2 Working');
        console.log(response);
        for (i = 1; i < response.list.length; i++) {
            var days = response.list[i]
            weatherObj = {
              weather: days.weather[0].description,
              icon: `http://openweathermap.org/img/w/days.weather[0].icon.png`,
              minTemp: days.temp.min,
              maxTemp: days.temp.max,
              humidity: days.main.humidity,
              date: moment(days.dt *1000).format(),
            };
            console.log(weatherObj)
        };
       
    })
 // closes function
};


  
