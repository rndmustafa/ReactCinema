using ReactCinema.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactCinema.Models
{
    public class ShowtimeGroup
    {
        public int ShowtimeGroupID { get; set; }
        public int MovieID { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

        public virtual Movie Movie { get; set; }
        public virtual ICollection<ShowtimeGroupEntry> ShowtimeGroupEntries { get; set; }

        public bool OverlapFound(ReactCinemaDbContext context)
        {
            ShowtimeGroup overlappedGroup = context.ShowtimeGroups
                .Where(s => s.FromDate < ToDate && s.ToDate > FromDate)
                .FirstOrDefault();

            return overlappedGroup != null;
        }

        public bool AllRequiredFields()
        {
            if(FromDate == null || ToDate == null)
            {
                return false;
            }

            foreach(ShowtimeGroupEntry entry in ShowtimeGroupEntries)
            {
                if(entry.StartTime == "" || entry.RoomID == -1 || entry.ExperienceID == -1)
                {
                    return false;
                }
            }

            return true;
        }

        public Dictionary<string,string> Validate(ReactCinemaDbContext context)
        {
            Dictionary<string, string> errors = new Dictionary<string, string>();
            if(!AllRequiredFields())
            {
                errors.Add("general", "Please fill out all fields.");
                return errors;
            }
            if(OverlapFound(context))
            {
                errors.Add("general", "Another Showtime Group was found which overlaps with this one.");
                return errors;
            }

            return errors; 
        }
    }
}
