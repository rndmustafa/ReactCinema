using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class Experience
    {
        public string ExperienceID { get; set; }

        public virtual ICollection<RoomToExperience> RoomToExperiences { get; set; }
        public virtual ICollection<Showtime> Showtimes { get; set; }

    }
}
