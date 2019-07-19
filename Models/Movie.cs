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
            DateTime current = DateTime.Now;
            Reservation reservation = context.Reservations
                .Where(r => r.Showtime.MovieID == MovieID
                && current < r.Showtime.EndTime)
                .FirstOrDefault();

            if (reservation != null)
            {
                errors.Add("general", "Active reservations exist on this movie.");
                return false;
            }
            return true;
        }

        public Dictionary<string, string> Validate()
        {
            Dictionary<string, string> errors = new Dictionary<string, string>();
            if(Title == "" || ImageUrl == "" || TrailerUrl == "" || 
                Rating == "" || Duration == 0 || ReleaseDate == DateTime.MinValue || Synopsis == "")
            {
                errors.Add("general", "Fill out all fields.");
            }
            return errors;
        }
    }
}
