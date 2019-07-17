using ReactCinema.Data;
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
        public int Duration { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Synopsis { get; set; }

        public virtual ICollection<Showtime> Showtimes { get; set; }
        public virtual ICollection<ShowtimeGroup> ShowtimeGroups { get; set; }

        public bool CanBeDeleted(ReactCinemaDbContext context, Dictionary<string, string> errors)
        {
            Showtime showtime = context.Showtimes
                .Where(s => s.MovieID == MovieID)
                .FirstOrDefault();

            if (showtime != null)
            {
                errors.Add("general", "The showtimes using this movie need to be removed first.");
                return false;
            }
            return true;
        }
    }
}
