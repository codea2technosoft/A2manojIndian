import API from './apiaxios';


export const getAllGames = () => API.get('/allgamelist');
export const getAllActiveGames = (sportId) => 
  API.post('/active-games-events-list', { sport_id: sportId });


export const toggleGameStatus = (gameId) =>
  API.get(`/toggle-game-status/${gameId}`);