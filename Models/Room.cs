using ReactCinema.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class Room
    {
        public int RoomID { get; set; }
        public string Title { get; set; }
        public int? LayoutID { get; set; }
        public int Capacity { get; set; }

        public virtual ICollection<RoomToExperience> RoomToExperiences { get; set; }
        public virtual ICollection<Showtime> Showtimes { get; set; }
        public virtual Layout Layout { get; set; }

        public Dictionary<string,string> Validate()
        {
            Dictionary<string, string> errors = new Dictionary<string, string>();
            if(Title == "" || Capacity == 0)
            {
                errors.Add("general", "Please fill all fields.");
            }
            return errors;
        }

        public bool CanBeDeleted(ReactCinemaDbContext context, Dictionary<string, string> errors)
        {
            Showtime showtime = context.Showtimes
                .Where(s => s.RoomID == RoomID)
                .FirstOrDefault();

            if(showtime != null)
            {
                errors.Add("general", "The showtimes using this room need to be removed first.");
                return false;
            }
            return true;
        }
    }
}
