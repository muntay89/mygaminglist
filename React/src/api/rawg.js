export const RAWG_KEY = import.meta.env.VITE_RAWG_KEY;

export const rawgGameUrl = (id) => `https://api.rawg.io/api/games/${id}?key=${RAWG_KEY}`;
export const rawgScreenshotsUrl = (id) =>
  `https://api.rawg.io/api/games/${id}/screenshots?key=${RAWG_KEY}`;

