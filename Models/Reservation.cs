using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class Reservation
    {
        public int ReservationID { get; set; }
        public int ShowtimeID { get; set; }

        public virtual ICollection<Seat> Seats { get; set; }
        public virtual Showtime Showtime { get; set; }

    }
}
