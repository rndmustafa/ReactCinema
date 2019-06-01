using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class Movie
    {
        public int MovieID { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public string TrailerUrl { get; set; }
        public string Rating { get; set; }
        public string Duration { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Synopsis { get; set; }

        public virtual ICollection<Showtime> Showtimes { get; set; }
    }
}
