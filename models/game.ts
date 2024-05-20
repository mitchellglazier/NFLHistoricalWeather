export interface Game {
    season: string;
    week: number;
    gameDate: string;
    startTime: string;
    startTimeGMTOffset: number;
    gameSite: string;
    homeTeam: string;
    homeTeamFinalScore: number;
    visitTeam: string;
    visitTeamFinalScore: number;
}