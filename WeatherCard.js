import React, { useState, useEffect } from "react";

import clearImg from "../assets/clear.png";
import cloudyImg from "../assets/cloudy.png";
import rainImg from "../assets/rain.png";
import errorImg from "../assets/error.png";
import defaultImg from "../assets/default.png";
import windImg from "../assets/wind.png";

const WeatherCard = () => {
  const [input, setInput] = useState("Karachi");
  const [query, setQuery] = useState("Karachi");
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  const getWeatherImage = (condition) => {
  if (!condition) return defaultImg;

  const cond = condition.toLowerCase();

  if (cond === "clear") return clearImg;
  if (cond === "cloudy") return cloudyImg;
  if (cond === "rain") return rainImg;
  if (cond === "thunderstorm") return defaultImg; 
  return defaultImg; 
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${query}`
        );
        const geoData = await geoRes.json();
        if (!geoData.results) throw new Error();
        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const weatherData = await weatherRes.json();

        setData({
          city: geoData.results[0].name,
          country: geoData.results[0].country,
          temp: weatherData.current_weather.temperature,
          wind: weatherData.current_weather.windspeed,
          code: weatherData.current_weather.weathercode,
        });

        setError(false);
      } catch {
        setError(true);
        setData(null);
      }
    };

    fetchData();
  }, [query]);

  const getConditionText = (code) => {
  if ([0, 1].includes(code)) return "Clear";
  if ([2, 3, 45, 48].includes(code)) return "Cloudy";
  if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "Rain";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Unknown";
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setQuery(input);
  };

  return (
    <div className="card">
      <h1 className="logo">Weather App</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button>Search</button>
      </form>

      {error && (
        <div className="weather-info">
          <img src={errorImg} alt="error" width="120" />
          <p className="error">City not found</p>
        </div>
      )}

      {data && (
        <div className="weather-info">
          <h2>
            {data.city}, {data.country}
          </h2>

          <img
            src={getWeatherImage(getConditionText(data.code))}
            alt="weather"
            width="120"
          />

          <h1>{data.temp}°C</h1>
          <p>{getConditionText(data.code)}</p>

          <div className="details">
            <img src={windImg} alt="wind" width="25" />
            <span>{data.wind} km/h</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
