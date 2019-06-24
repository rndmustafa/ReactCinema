using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
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

        [NotMapped]
        public TimeSpan Interval { get; set; }
        [NotMapped]
        public string ShortIdentification { get; set; }

        public virtual ShowtimeGroup ShowtimeGroup { get; set; }
        public virtual Room Room { get; set; }
        public virtual Experience Experience { get; set; }
        public virtual ICollection<Showtime> Showtimes { get; set; }

        public void SetInterval()
        {
            if (Interval == null || Interval == TimeSpan.Zero)
            {
                Interval = TimeSpan.Parse(StartTime);
            }
        }

        public bool Conflicts(ShowtimeGroupEntry other, int movieLength)
        {
            SetInterval();
            other.SetInterval();

            if(Interval.Add(new TimeSpan(0,movieLength,0)) > other.Interval && RoomID == other.RoomID)
            {
                return true;
            }
            return false;
        }
    }
}
