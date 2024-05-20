import * as fs from 'fs';
import * as path from 'path';
import { loadVenues, loadGames } from './loadCSV';
import { fetchWeather } from './fetchWeather';
import { GameWeather } from './models/gameWeather';

const getHistoricalWeather = async () => {
  const venues = await loadVenues();
  const games = await loadGames();

  const gameWeatherData: any[] = [];
  let gameNumber: number = 0;

  for (const game of games) {
    const gameTimeHourString = game.startTime.substring(0,2) 
    const gameTimeHourIndex = parseInt(gameTimeHourString, 10) + 1
    // finding the venue associated with the home team
    const venue = venues.find((v) => v.teams.includes(game.homeTeam));
    if (venue) {
      // currently lon and lat are derived from home team of the game and their stadium. This would not cover neutral site games like those in Tottenham or the superbowl.
      if (game.gameSite === 'Tottenham') {
        venue.lat = 51.6042
        venue.lon = 0.0662
      }
      // this could be a conditional call for venues with open or retractable roofs only, for completeness I have included everything and would filter out in sql.
      const weather = await fetchWeather(venue.lat, venue.lon, game.gameDate);
      // At first I had json object that was split into game venue and weather with their respective models, however if this was loaded in a sql table later to make queries I wanted to make it a flat object.
      gameWeatherData.push({
        ...game,
        ...venue,
        gameTimeTemperature: weather.hourly.temperature.temperature2m[gameTimeHourIndex],
        gameTimeApparentTemperature: weather.hourly.temperature.apparent_temperature[gameTimeHourIndex],
        gameTimeTotalPrecipitation: weather.hourly.precipitation.total_precipitation[gameTimeHourIndex],
        gameTimeSnowfall: weather.hourly.precipitation.snowfall[gameTimeHourIndex],
        gameTimeRain: weather.hourly.precipitation.rain[gameTimeHourIndex],
        gameTimeWindSpeed: weather.hourly.wind.wind_speed_10m[gameTimeHourIndex],
        gameTimeWindDirection: weather.hourly.wind.wind_direction_10m[gameTimeHourIndex],
        gameTimeIsDay: weather.hourly.day.is_day[gameTimeHourIndex],
        gameEndTemperature: weather.hourly.temperature.temperature2m[gameTimeHourIndex + 2],
        gameEndApparentTemperature: weather.hourly.temperature.apparent_temperature[gameTimeHourIndex + 2],
        gameEndTotalPrecipitation: weather.hourly.precipitation.total_precipitation[gameTimeHourIndex + 2],
        gameEndSnowfall: weather.hourly.precipitation.snowfall[gameTimeHourIndex + 2],
        gameEndRain: weather.hourly.precipitation.rain[gameTimeHourIndex + 2],
        gameEndWindSpeed: weather.hourly.wind.wind_speed_10m[gameTimeHourIndex + 2],
        gameEndWindDirection: weather.hourly.wind.wind_direction_10m[gameTimeHourIndex + 2],
        gameEndIsDay: weather.hourly.day.is_day[gameTimeHourIndex + 2],
        gameVarianceTemperature: weather.hourly.temperature.temperature2m[gameTimeHourIndex + 2] - weather.hourly.temperature.temperature2m[gameTimeHourIndex],
        gameVarianceApparentTemperature: weather.hourly.temperature.apparent_temperature[gameTimeHourIndex + 2] - weather.hourly.temperature.apparent_temperature[gameTimeHourIndex],
        gameVarianceTotalPrecipitation: weather.hourly.precipitation.total_precipitation[gameTimeHourIndex + 2] - weather.hourly.precipitation.total_precipitation[gameTimeHourIndex],
        gameVarianceSnowfall: weather.hourly.precipitation.snowfall[gameTimeHourIndex + 2] - weather.hourly.precipitation.snowfall[gameTimeHourIndex],
        gameVarianceRain: weather.hourly.precipitation.rain[gameTimeHourIndex + 2] - weather.hourly.precipitation.rain[gameTimeHourIndex],
        gameVarianceWindSpeed: weather.hourly.wind.wind_speed_10m[gameTimeHourIndex + 2] - weather.hourly.wind.wind_speed_10m[gameTimeHourIndex]
      });
    }
    // included this just so I could visually see the progress in terminal
    gameNumber++;
    console.log('Game number ' + gameNumber + ' fetched of ' + games.length)
  }

  // writing JSON object to the directory where this file is located
  fs.writeFileSync(
    path.join(__dirname, 'historicalWeatherData.json'),
    JSON.stringify(gameWeatherData, null, 2)
  );

  console.log('Weather data saved to historicalWeatherData.json');
};

getHistoricalWeather();