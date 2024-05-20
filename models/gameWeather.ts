import { Game } from "./game";
import { Venue } from "./venue";
import { Weather } from "./weather";

export interface GameWeather {
    game: Game;
    venue: Venue;
    weather: Weather;
}