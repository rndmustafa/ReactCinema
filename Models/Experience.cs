using ReactCinema.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class Experience
    {
        public int ExperienceID { get; set; }
        public string Title { get; set; }

        public virtual ICollection<RoomToExperience> RoomToExperiences { get; set; }
        public virtual ICollection<Showtime> Showtimes { get; set; }

        public Dictionary<string, string> Validate()
        {
            Dictionary<string, string> errors = new Dictionary<string, string>();
            if (Title == "")
            {
                errors.Add("general", "Please fill all fields.");
            }
            return errors;
        }

        public bool CanBeDeleted(ReactCinemaDbContext context, Dictionary<string, string> errors)
        {
            Showtime showtime = context.Showtimes
                .Where(s => s.ExperienceID == ExperienceID)
                .FirstOrDefault();

            if (showtime != null)
            {
                errors.Add("general", "The showtimes using this experience need to be removed first.");
                return false;
            }
            return true;
        }
    }
}
