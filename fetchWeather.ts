// decided to use openmeteo because that was what is in their docs, could just use fetch or axios as well.
import { fetchWeatherApi } from 'openmeteo';
import { Weather } from './models/weather';

// if the date requested is over 3 months old historicalAPI should be used, found in logic below.
const historicalAPI = "https://archive-api.open-meteo.com/v1/archive";
const forecastAPI = "https://api.open-meteo.com/v1/forecast";

const fetchWeather = async (lat: number, lon: number, date: string) => {
  try {
    // hourly params from https://open-meteo.com/en/docs, 15 minute params also exist
    const params = {
      latitude: lat,
      longitude: lon,
      timezone: "auto",
      hourly: [
        "temperature_2m",
        "apparent_temperature",
        "precipitation",
        "snowfall",
        "rain",
        "showers",
        "precipitation_probability",
        "wind_speed_10m",
        "wind_direction_10m",
        "is_day"
      ],
      temperature_unit: 'fahrenheit',
      wind_speed_unit: 'mph',
      precipitation_unit: 'inch',
      start_date: date,
      end_date: date
    };

    // date logic to see what api should be used
    const fetchDate = new Date(date);
    const currentDate = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    const usedApi = fetchDate > threeMonthsAgo ? forecastAPI : historicalAPI;

    // making the call with basic error handling for possible debugging 
    const responses = await fetchWeatherApi(usedApi, params);
    if (!responses || responses.length === 0) {
      throw new Error("No data received from the weather API");
    }

    const response = responses[0];
    const hourly = response.hourly();
    if (!hourly) {
      throw new Error("Failed to retrieve hourly weather data");
    }

    const weatherData: Weather = {
      hourly: {
        temperature: {
          // the hourly.variable index is derived from the hourly params order set above
          temperature2m: hourly.variables(0)?.valuesArray() || [],
          apparent_temperature: hourly.variables(1)?.valuesArray() || []
        },
        precipitation: {
          total_precipitation: hourly.variables(2)?.valuesArray() || [],
          snowfall: hourly.variables(3)?.valuesArray() || [],
          rain: hourly.variables(4)?.valuesArray() || [],
          showers: hourly.variables(5)?.valuesArray() || [],
          precipitation_probability: hourly.variables(6)?.valuesArray() || []
        },
        wind: {
          wind_speed_10m: hourly.variables(7)?.valuesArray() || [],
          wind_direction_10m: hourly.variables(8)?.valuesArray() || [],
        },
        day: {
          is_day: hourly.variables(9)?.valuesArray() || []
        }
      }
    };

    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export { fetchWeather };
