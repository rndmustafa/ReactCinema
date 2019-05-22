using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class Showtime
    {
        public int ShowtimeID { get; set; }
        public int MovieID { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int RoomID { get; set; }
        public bool Soldout { get; set; }
        public int ExperienceID { get; set; }

        public virtual Movie Movie { get; set; }
        public virtual Room Room { get; set; }
        public virtual Experience Experience { get; set; }
        public virtual ICollection<Reservation> Reservations { get; set; }
    }
}
