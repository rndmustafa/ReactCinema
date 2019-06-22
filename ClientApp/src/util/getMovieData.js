import { omdbKey } from './clientInfo';
import moment from 'moment';

export default function getMovieData(movieTitle) {
  return new Promise((resolve, reject) => {
    fetch(`https://www.omdbapi.com/?apikey=${omdbKey}&t=${movieTitle}&type=movie&plot=full`)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
        else {
          throw new Error({ Error: 'bad request' });
        }
      })
      .then(resData => {
        if (!resData.Error) {
          resolve(parseData(resData));
        }
        else {
          reject(resData);
        }
      })
      .catch(err => reject(err));
  });
}

function parseData(resData) {
  return {
    title: resData.Title,
    imageUrl: resData.Poster,
    trailerUrl: '',
    rating: resData.Rated,
    duration: formatDuration(resData.Runtime),
    releaseDate: moment(resData.Released,'DD MMM YYYY').format('YYYY-MM-DD'),
    synopsis: resData.Plot
  };
}

function formatDuration(runtime) {
  return parseInt(runtime.split(' ')[0], 10);
}