import { omdbKey } from './clientInfo';
import moment from 'moment';

export default function getMovieData(movieTitle, handleMovieData) {
  let data = {};

  fetch(`https://www.omdbapi.com/?apikey=${omdbKey}&t=${movieTitle}&type=movie&plot=full`)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
      return {Error: 'bad request'};
    })
    .then(resData => {
      if (!resData.Error) {
        data = parseData(resData);
      }
      else {
        data = resData;
      }
      handleMovieData(data);
    });
}

function parseData(resData) {
  return {
    title: resData.Title,
    imageUrl: resData.Poster,
    rating: resData.Rated,
    duration: formatDuration(resData.Runtime),
    releaseDate: moment(resData.Released,'DD MMM YYYY').format('YYYY-MM-DD'),
    synopsis: resData.Plot
  };
}

function formatDuration(runtime) {
  let totalMinutes = parseInt(runtime.split(' ')[0]);
  let hours = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}