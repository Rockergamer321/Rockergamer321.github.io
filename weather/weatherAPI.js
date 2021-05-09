$(document).ready(function () {
    
    // Get Location 
    navigator.geolocation.getCurrentPosition(success, error);

    function success(pos) {
        var latitude = pos.coords.latitude;
        var longitude = pos.coords.longitude;
        weather(latitude, longitude);
    }

    function error() {
        console.log('There was an error');
    }

    // Call Weather
    function weather(latitude, longitude) {
        var URL = `https://fcc-weather-api.glitch.me/api/current?lat=${latitude}&lon=${longitude}`;

        $.getJSON(URL, function(data) {
			console.log(data);
            updateDOM(data);
        });
    }

    // Update Dom
    function updateDOM(data) {
        var city = data.name;
		var country = data.sys.country;
        var temp = Math.round(data.main.temp);
        var desc = data.weather[0].description;
        var icon = data.weather[0].icon;
		var feelsLike = Math.round(data.main.feels_like);
		var humidity = Math.round(data.main.humidity);
        $('#city').html(city);
        $('#country').html(country);
        $('#temp').html(temp);
        $('#desc').html(desc);
        $('#icon').attr('src', icon);
		$('#feels').html(feelsLike);
		$('#humidity').html(humidity);
    }
});