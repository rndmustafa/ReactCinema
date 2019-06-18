using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class Seat
    {
        public int SeatID { get; set; }
        public int RowID { get; set; }
        public int XPos { get; set; }
        public string Label { get; set; }
        public int? ReservationID { get; set; }

        public virtual Reservation Reservation { get; set; }
        public virtual Row Row { get; set; }
    }
}
