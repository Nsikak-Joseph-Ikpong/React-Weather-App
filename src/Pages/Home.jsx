import React, { useState, useEffect } from "react";

const Home = () => {
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState(""); // State for the location input
  const [weatherData, setWeatherData] = useState(null); // State for storing weather data
  const [error, setError] = useState(""); // State for error handling
  const [hourlyOrWeek, setHourlyOrWeek] = useState("week"); // State for hourly or weekly weather view

  // Function to change background based on weather condition
  const changeBackground = (condition) => {
    const body = document.querySelector("body");
    let bg = "";

    if (condition === "partly-cloudy-day") {
      bg = "/images/cloudy sky.jpg";
    } else if (condition === "partly-cloudy-night") {
      bg = "/images/cloudnight.jpg";
    } else if (condition === "rain") {
      bg = "/images/rain.jpg";
    } else if (condition === "clear-day") {
      bg = "/images/clearday.jpg";
    } else if (condition === "clear-night") {
      bg = "/images/night.jpg";
    } else {
      bg = "/images/clearday.jpg"; // Default background
    }

    body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${bg})`;
  };

  // Function to get date and time
  const getDateTime = () => {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();

    // 12-hour format
    hour = hour % 12;
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayString = days[now.getDay()];

    return `${dayString}, ${hour}:${minute}`;
  };

  // Updating date and time every second
  useEffect(() => {
    setDateTime(getDateTime()); // Initial setting
    const intervalId = setInterval(() => {
      setDateTime(getDateTime());
    }, 1000); // Updates every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  // Function to get weather icon based on condition
  const getIcon = (condition) => {
    switch (condition) {
      case "partly-cloudy-day":
        return "https://i.ibb.co/PZQXH8V/27.png";
      case "partly-cloudy-night":
        return "https://i.ibb.co/Kzkk59k/15.png";
      case "rain":
        return "https://i.ibb.co/kBd2NTS/39.png";
      case "clear-day":
        return "https://i.ibb.co/rb4rrJL/26.png";
      case "clear-night":
        return "https://i.ibb.co/1nxNGHL/10.png";
      default:
        return "https://i.ibb.co/rb4rrJL/26.png"; // Default icon
    }
  };

  // Function to fetch weather data
  const getWeatherData = (city) => {
    const apiKey = "EJ6UBL2JEQGYB3AA4ENASN62J"; // Replace with your actual API key
    fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Incorrect City");
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData(data); // Set the fetched weather data
        setError(""); // Clear any previous errors
        changeBackground(data.currentConditions.icon); // Change background based on condition
      })
      .catch((err) => {
        setError(err.message); // Set error message
      });
  };

  // Function to handle hourly button click
  const handleHourlyClick = () => {
    setHourlyOrWeek("hourly");
    getWeatherData(location, "metric", "hourly"); // Fetch hourly weather data
  };

  // Function to handle weekly button click
  const handleWeekClick = () => {
    setHourlyOrWeek("week");
    getWeatherData(location, "metric", "week"); // Fetch weekly weather data
  };

  // Handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (location) {
      getWeatherData(location); // Fetch weather data for the entered location
    }
  };

  return (
    <div>
      <div className="wrapper">
        <div className="sidebar">
          <div>
            <form className="search" id="search" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                id="query"
                placeholder="Search..."
                value={location}
                onChange={(e) => setLocation(e.target.value)} // Update location state
              />
              <button>
                <img src="/images/search.png" alt="Search Icon" />
              </button>
            </form>
            {error && <p className="error">{error}</p>}{" "}
            {/* Display error if any */}
            <div className="weather-icon">
              {weatherData && weatherData.currentConditions && (
                <img
                  id="icon"
                  src={getIcon(weatherData.currentConditions.icon)} // Dynamically set the icon based on the weather condition
                  alt={weatherData.currentConditions.conditions} // Alt text for the icon
                />
              )}
            </div>
            <div className="temperature">
              <h1 id="temp">
                {weatherData && weatherData.currentConditions
                  ? weatherData.currentConditions.temp
                  : "0"}
              </h1>
              <span className="temp-unit">°C</span>
            </div>
            <div className="date-time">
              <p id="date-time">{dateTime}</p>
            </div>
            <div className="divider"></div>
            <div className="condition-rain">
              <div className="condition">
                <img src="/images/clouds.png" alt="clouds Icon" />
                <p id="condition">
                  {weatherData && weatherData.currentConditions
                    ? weatherData.currentConditions.conditions
                    : "condition"}
                </p>
              </div>
              <div className="rain">
                <img src="/images/raindrops.png" alt="rain Icon" />
                <p id="rain">
                  perc -{" "}
                  {weatherData && weatherData.currentConditions
                    ? weatherData.currentConditions.precip
                    : "0%"}
                </p>
              </div>
            </div>
          </div>
          <div className="location">
            <div className="location-icon">
              <img src="/images/location.png" alt="location Icon" />
            </div>
            <div className="location-text">
              <p id="location">{location || "location"}</p>
            </div>
          </div>
        </div>
        <div className="main">
          <nav>
            <h1 className="heading">Alx Weather Application</h1>
          </nav>
         
          <div className="cards" id="weather-cards"></div>
          <div className="highlights">
            <h2 className="heading">Today's Data</h2>
            <div className="cards">
              <div className="card2">
                <h4 className="card-heading">UV Index</h4>
                <div className="content">
                  <p className="uv-index">
                    {weatherData && weatherData.currentConditions
                      ? weatherData.currentConditions.uvindex
                      : "0"}
                  </p>

                  <p className="uv-text">Low</p>
                </div>
              </div>
              <div className="card2">
                <h4 className="card-heading">Wind Status</h4>
                <div className="content">
                  <p className="wind-speed">
                    {weatherData && weatherData.currentConditions
                      ? weatherData.currentConditions.windspeed
                      : "0"}
                  </p>
                  <p>km/h</p>
                </div>
              </div>
              <div className="card2">
                <h4 className="card-heading">Sunrise & Sunset</h4>
                <div className="content">
                  <p className="sun-rise">
                    {weatherData && weatherData.currentConditions
                      ? weatherData.currentConditions.sunrise
                      : "0"}
                  </p>
                  <p className="sun-set">
                    {weatherData && weatherData.currentConditions
                      ? weatherData.currentConditions.sunset
                      : "0"}
                  </p>
                </div>
              </div>
              <div className="card2">
                <h4 className="card-heading">Humidity</h4>
                <div className="content">
                  <p className="humidity">
                    {weatherData && weatherData.currentConditions
                      ? weatherData.currentConditions.humidity
                      : "0"}
                  </p>
                  <p className="humidity-status">Normal</p>
                </div>
              </div>
              <div className="card2">
                <h4 className="card-heading">Visibility</h4>
                <div className="content">
                  <p className="visibilty">
                    {weatherData && weatherData.currentConditions
                      ? weatherData.currentConditions.visibility
                      : "0"}
                  </p>
                  <p className="visibilty-status">Normal</p>
                </div>
              </div>
              <div className="card2">
                <h4 className="card-heading">Air Quality</h4>
                <div className="content">
                  {/* Displaying air quality data */}
                  <p className="aqi">
                    {weatherData && weatherData.currentConditions
                      ? weatherData.currentConditions.airquality
                      : "0"}
                  </p>
                  <p className="aqi">Normal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
