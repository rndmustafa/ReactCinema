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

    }
}
