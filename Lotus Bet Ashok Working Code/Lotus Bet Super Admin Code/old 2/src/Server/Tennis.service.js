import API from './apiaxios';


export const refreshMatches = (params = {}) => API.get('/getMatchRefresh',{params});

export const getAllMatches = (params = {}) => API.get('/allmetchists', { params });
export const deleteMatch = (matchId) => API.delete(`/matches/${matchId}`);
export const toggleMatchStatus = (matchId) =>
API.patch(`/matches/${matchId}/toggle-status`, { matchId });

export const importEvent = (sport_id, series_id) =>
  API.post("/import-event", { sport_id, series_id });

export const getExternalEvents = (sport_id, series_id) => {
  return API.get(`events/external?seriesId=${series_id}&sport_id=${sport_id}`);
};
export const getAllEvents = (sportId, seriesId, payload = {}) => {
  const queryParams = new URLSearchParams();
  if (sportId && sportId !== 'undefined') queryParams.append('sportId', sportId);
  if (seriesId && seriesId !== 'undefined') queryParams.append('seriesId', seriesId);
    const url = `/allEventslist?${queryParams.toString()}`;
  return API.post(url,payload);
};
export const toggleEventStatus = (eventId) =>
API.patch(`/events/${eventId}/toggle-status`, { eventId });


export const importMarket = (sport_id, event_id) =>
  API.post("/get-market-teams", { sport_id, event_id });



export const CompletedEventList = (payload) => {
  return API.post(`completed-events`, payload,);
};
export const InActiveEventList = (payload) => {
  return API.post(`inactive-events-list`,payload);
};
export const ActiveEventList = (payload) => {
  return API.post(`active-Events-list`,payload);
};
export const toggleCompletedStatus = (eventId, newStatus) => {
  return API.patch(`/events/${eventId}/toggle-completed`, { newStatus });
};


