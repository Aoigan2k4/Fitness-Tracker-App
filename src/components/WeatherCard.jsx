import React, { useEffect, useState } from 'react';
import '../Styles/WeatherCard.css';

const WeatherCard = ({ city = "Montreal" }) => {
  const [weather, setWeather] = useState("Loading...");

  useEffect(() => {
    fetch(`https://wttr.in/${city}?format=%C+%t`)
      .then((res) => res.text())
      .then((data) => setWeather(data))
      .catch(() => setWeather("Weather unavailable"));
  }, [city]);

  return (
    <div className="weather-card">
      <h4>🌤️ Weather</h4>
      <p>{weather}</p>
    </div>
  );
};

export default WeatherCard;