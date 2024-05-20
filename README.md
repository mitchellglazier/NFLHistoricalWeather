# Game Day Weather Data

This project integrates historical and future weather data for NFL games.

The getHistoricalWeather.ts script fetches game schedules and venue information from local CSVs, and uses the Open Meteo weather API to gather historical weather data for each game. The data is then saved into a JSON file.

The getForecast.ts script takes in 3 parameters and uses the Open Meteo weather API to get weather forecast information by location and date. The data is then saved into a JSON file.

A text file name sqlQueries.txt has been added as reference to interesting sql queries that could be done if the historicalWeatherData.json was inserted into sql server.

## Prerequisites

- Node.js and npm installed on your machine.

## Setup

1. Clone the repository and navigate to the project directory.

   git clone <repository-url>
   cd nfl-weather-data

2. Install the required dependencies.

   npm install

## Files

- loadCSV.ts: Contains functions to load and parse CSV data.
- fetchWeather.ts: Contains a function to fetch weather data from the Open Meteo API.
- getHistoricalWeather.ts: Script to load game and venue data, fetch weather data, and save the combined data into a JSON file.
- getForecast.ts: Script to get future forecast information and save the combined data into a JSON file.
- sqlQueries.md: A file of sql queries

## Usage

1. Run the getHistoricalWeather script.

   npx ts-node getHistoricalWeather.ts

   This script will:

   - Load the venue and game data from the CSV files.
   - Fetch historical weather data for each game using the Open Meteo API.
   - Save the combined data to a JSON file named 'historicalWeatherData.json'.

2. Run the getForecast.ts script

   npx ts-node getForecast.ts 36.1665 86.7713 2024-05-20

   Parameters:

   - Latitude
   - Longitude
   - Game date

   This script will:

   - Fetch a 24 hour forecast for the given date and location.
   - Save the data to JSON file named 'gameDayWeatherData.json'

## Notes

- Ensure the `Venues.csv` and `Games.csv` files are correctly formatted and placed in the `data` directory before running the script.
- The Open Meteo API is used to fetch historical and future weather data. Ensure you have internet connectivity when running the script.

## Possible improvement

- Covert the project into a restAPI. The getForecast function could be better ingested as a restAPI or if it was loading the data somewhere.
- It seems very unlikely that people would have access to latitude and longitude information for the getForecast function. Depending on what is most used within the end users, it would be very easy to have the venue name, for example, as a parameter then look up the lat and lon within the venues csv.
- Better accounting for games played on a neutral field.
