import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { parse, format } from 'date-fns';
import { Venue } from './models/venue';
import { Game } from './models/game';


// helper function to load any csv
const loadCSV = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

const loadVenues = async (): Promise<Venue[]> => {
    const venues = await loadCSV(path.join(__dirname, '/data/Venues.csv'));
    return venues.map((venue) => {
        // cleaning geo data 
        const geo = venue.Geo || '';
        const cleanedGeo = typeof geo === 'string' ? geo.replace(/[^\d.,-]/g, '') : '';
        // splitting the clean Geo location into 2 strings
        const [lat, lon] = cleanedGeo.split(',').map((coord: string) => parseFloat(coord.trim()));  
        return {
          name: venue.Name,
          capacity: venue.Capacity,
          location: venue.Location,
          surface: venue.Surface,
          roofType: venue['Roof Type'],
          opened: venue.Opened,
          lat: lat,
          lon: lon,
          // splitting teams to use for matching up home team of the game
          teams: venue['Team(s)'] ? (venue['Team(s)'].includes(',') ? venue['Team(s)'].split(',').map((team: string) => team.trim()) : [venue['Team(s)'].trim()]) : [],
        };
    });
  };

  const loadGames = async (): Promise<Game[]> => {
    const games = await loadCSV(path.join(__dirname, '/data/Games.csv'));
    return games.map((game) => {
      // reformatting date to fit the api requirements
      const formattedDate = format(parse(game.Game_Date, 'MM/dd/yyyy', new Date()), 'yyyy-MM-dd');
      return {
        season: game.Season,
        week: game.Week,
        gameDate: formattedDate,
        startTime: game.Start_Time,
        startTimeGMTOffset: game.Start_Time_GMT_Offset,
        homeTeam: game.Home_Team,
        homeTeamFinalScore: game.Home_Team_Final_Score,
        visitTeam: game.Visit_Team,
        visitTeamFinalScore: game.Visit_Team_Final_Score,
        gameSite: game.Game_Site,
      };
    });
  };

export { loadVenues, loadGames };
