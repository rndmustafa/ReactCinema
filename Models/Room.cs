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

        public virtual ICollection<RoomToExperience> RoomToExperiences { get; set; }
        public virtual ICollection<Showtime> Showtimes { get; set; }
        public virtual Layout Layout { get; set; }

    }
}
