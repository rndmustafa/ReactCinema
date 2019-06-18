using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class ShowtimeGroupEntry
    {
        public int ShowtimeGroupEntryID { get; set; }
        public int ShowtimeGroupID { get; set; }
        public string StartTime { get; set; }
        public int RoomID { get; set; }
        public int ExperienceID { get; set; }

        public virtual ShowtimeGroup ShowtimeGroup { get; set; }
        public virtual Room Room { get; set; }
        public virtual Experience Experience { get; set; }
        public virtual ICollection<Showtime> Showtimes { get; set; }
    }
}
