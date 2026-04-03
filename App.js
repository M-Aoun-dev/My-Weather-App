import React from "react";
import WeatherCard from "./components/WeatherCard";
import "./style.css"; 

function App() {
  return (
    <>
      <header>Weather App</header>

      <div className="container">
        <WeatherCard />
      </div>

      <footer>&copy; 2026 Weather App. All rights reserved.</footer>
    </>
  );
}

export default App;