export interface Weather {
    hourly: {
      temperature: {
        temperature2m: any;
        apparent_temperature: any;
      };
      precipitation: {
        total_precipitation: any;
        snowfall: any;
        rain: any;
        showers: any;
        precipitation_probability: any;
      };
      wind: {
        wind_speed_10m: any;
        wind_direction_10m: any;
      };
      day: {
        is_day: any;
      };
    };
}