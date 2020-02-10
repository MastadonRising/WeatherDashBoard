// Variables 
var cityList = $('#cities')
var submit = $("#submit");
var apiKey= '92da633d3d15d688dad9bffac774f506'
var weatherUrl= 'api.openweathermap.org/data/2.5/weather?q='

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
    var queryUrl = weatherUrl + cleanCity + '&units=imperial&appid='+ apiKey
    console.log(queryUrl)
    $.ajax({
        url: queryUrl,
        method:'get'
    }).then(function(response){
        console.log('Ajax Working')
        console.log(response)
        weatherObj ={
            city: response.name,
            wind: response.wind.speed,
            humidity: response.main.humidity,
        temp: response.main.temp,
        date: (convertDate(response.dt))[1],
        icon: `http://openweathermap.org/img/w/${response.weather[0].icon}.png`,
        desc: response.weather[0].description
        }
        console.log(weatherObj)
    })
};

  
