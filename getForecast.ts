import { fetchWeather } from './fetchWeather';
import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const lat = parseFloat(args[0]);
const lon = parseFloat(args[1]);
const date = args[2];

// if any of the arguments needed are not provided then it will show an error message in console.
if (!lat || !lon || !date) {
  console.error('Usage: npx ts-node getForecast.ts <latitude> <longitude> <date>');
  process.exit(1);
}

// using the fetchWeather function, it gets weather info for the game day.
fetchWeather(lat, lon, date).then((weatherData) => {
  // currently this just writes the data to a json file, conversely it could be added a DB or returned to the user in a rest api situation.
  fs.writeFileSync(
    path.join(__dirname, 'gameDayWeatherData.json'),
    JSON.stringify(weatherData, null, 2)
  );
}).catch((error) => {
  console.error('Error fetching weather data:', error);
});