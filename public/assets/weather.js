import React, { useState, useEffect } from "react";

const WeatherApp = () => {
  const [currentCity, setCurrentCity] = useState("");
  const [currentUnit, setCurrentUnit] = useState("c");
  const [hourlyorWeek, setHourlyorWeek] = useState("week");
  const [temperature, setTemperature] = useState("");
  const [date, setDate] = useState("");
  const [condition, setCondition] = useState("");
  const [rain, setRain] = useState("");
  const [uvIndex, setUvIndex] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [humidity, setHumidity] = useState("");
  const [visibility, setVisibility] = useState("");
  const [airQuality, setAirQuality] = useState("");
  const [sunRise, setSunRise] = useState("");
  const [sunSet, setSunSet] = useState("");
  const [weatherCards, setWeatherCards] = useState([]);

  const tempRef = React.createRef();
  const dateRef = React.createRef();
  const conditionRef = React.createRef();
  const rainRef = React.createRef();
  const uvIndexRef = React.createRef();
  const windSpeedRef = React.createRef();
  const humidityRef = React.createRef();
  const visibilityRef = React.createRef();
  const airQualityRef = React.createRef();
  const sunRiseRef = React.createRef();
  const sunSetRef = React.createRef();
  const weatherCardsRef = React.createRef();

  useEffect(() => {
    fetch("https://geolocation-db.com/json/", {
      method: "GET",
      headers: {},
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentCity(data.city);
        getWeatherData(data.city, currentUnit, hourlyorWeek);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const getWeatherData = (city, unit, hourlyorWeek) => {
    fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`,
      {
        method: "GET",
        headers: {},
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const today = data.currentConditions;
        setTemperature(today.temp);
        setDate(getDateTime());
        setCondition(today.conditions);
        setRain("Perc - " + today.precip + "%");
        setUvIndex(today.uvindex);
        setWindSpeed(today.windspeed);
        setHumidity(today.humidity + "%");
        setVisibility(today.visibility);
        setAirQuality(today.winddir);
        setSunRise(covertTimeTo12HourFormat(today.sunrise));
        setSunSet(covertTimeTo12HourFormat(today.sunset));
        if (hourlyorWeek === "hourly") {
          updateForecast(data.days[0].hours, unit, "day");
        } else {
          updateForecast(data.days, unit, "week");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateForecast = (data, unit, type) => {
    const forecastCards = [];
    for (let i = 0; i < data.length; i++) {
      const card = {
        dayName: getDayName(data[i].datetime),
        temperature: data[i].temp,
        icon: getIcon(data[i].icon),
      };
      forecastCards.push(card);
    }
    setWeatherCards(forecastCards);
  };

  const getDateTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
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

  const getIcon = (condition) => {
    if (condition === "partly-cloudy-day") {
      return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === "partly-cloudy-night") {
      return "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === "rain") {
      return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === "clear-day") {
      return "https://i.ibb.co/rb4rrJL/26.png";
    } else if (condition === "clear-night") {
      return "https://i.ibb.co/1nxNGHL/10.png";
    } else {
      return "https://i.ibb.co/rb4rrJL/26.png";
    }
  };

  const getDayName = (date) => {
    const day = new Date(date);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day.getDay()];
  };

  const covertTimeTo12HourFormat = (time) => {
    const hour = time.split(":")[0];
    const minute = time.split(":")[1];
    const ampm = hour >= 12 ? "pm" : "am";
    const hour12 = hour % 12;
    const hourString = hour12 === 0 ? "12" : hour12.toString();
    return `${hourString}:${minute} ${ampm}`;
  };

  return (
    <div>
      <h1>Weather App</h1>
      <p>Temperature: {temperature}</p>
      <p>Date: {date}</p>
      <p>Condition: {condition}</p>
      <p>Rain: {rain}</p>
      <p>UV Index: {uvIndex}</p>
      <p>Wind Speed: {windSpeed}</p>
      <p>Humidity: {humidity}</p>
      <p>Visibility: {visibility}</p>
      <p>Air Quality: {airQuality}</p>
      <p>Sun Rise: {sunRise}</p>
      <p>Sun Set: {sunSet}</p>
      <h2>Forecast</h2>
      <ul>
        {weatherCards.map((card, index) => (
          <li key={index}>
            <h3>{card.dayName}</h3>
            <p>Temperature: {card.temperature}</p>
            <img src={card.icon} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherApp;
