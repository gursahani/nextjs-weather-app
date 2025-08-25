"use client"
import React, { useState } from 'react';
import { Cloud, Search, Sun, Droplets, Wind, Thermometer, AlertCircle, Loader } from 'lucide-react';

// Define the shape of the weather data we expect from the API.
type WeatherData = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
  }>;
  wind: {
    speed: number;
  };
};

// Define the shape of the API response data.
type ApiResponse = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
  }>;
  wind: {
    speed: number;
  };
};

/**
 * The main application component.
 * It handles the user input, API fetching, and state management.
 */
const App = () => {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // IMPORTANT: Replace 'YOUR_API_KEY_HERE' with your actual OpenWeatherMap API key.
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  // Function to fetch weather data from the OpenWeatherMap API.
  const fetchWeather = async (location: string) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error("API key is missing. Please add your OpenWeatherMap API key to the code.");
      }

      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling.');
        } else {
          throw new Error('Something went wrong. Please try again later.');
        }
      }

      const data: ApiResponse = await response.json();

      // Map the API response to our custom WeatherData type.
      const formattedData: WeatherData = {
        name: data.name,
        main: {
          temp: data.main.temp,
          humidity: data.main.humidity,
        },
        weather: data.weather,
        wind: {
          speed: data.wind.speed,
        },
      };

      setWeatherData(formattedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler for the form submission.
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  return (
    <div className="font-sans antialiased min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white border-opacity-30">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Weather Viewer</h1>
        
        <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-6">
          <div className="relative w-full">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="text-black w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go
          </button>
        </form>

        {loading && (
          <div className="flex justify-center items-center py-8 text-gray-600">
            <Loader size={24} className="animate-spin mr-2" />
            <p>Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center text-red-600 text-center py-8">
            <AlertCircle size={48} className="mb-2" />
            <p className="font-medium">Error!</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {weatherData && (
          <div className="text-center py-4 space-y-4">
            <div className="flex justify-center items-center space-x-4">
              <Sun size={64} className="text-yellow-500" />
              <div>
                <h2 className="text-4xl font-extrabold text-gray-800">{weatherData.main.temp}°C</h2>
                <p className="text-gray-600 text-xl font-semibold">{weatherData.name}</p>
                <p className="text-gray-500 capitalize">{weatherData.weather[0].description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div className="bg-white p-4 rounded-xl shadow-inner flex flex-col items-center">
                <Droplets size={24} className="text-blue-500" />
                <p className="font-bold">{weatherData.main.humidity}%</p>
                <p className="text-sm text-gray-500">Humidity</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-inner flex flex-col items-center">
                <Wind size={24} className="text-cyan-500" />
                <p className="font-bold">{weatherData.wind.speed} m/s</p>
                <p className="text-sm text-gray-500">Wind Speed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
