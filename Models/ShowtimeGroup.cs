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
        public virtual IList<ShowtimeGroupEntry> ShowtimeGroupEntries { get; set; }

        private bool OverlapFound(Dictionary<string, string> errors, ReactCinemaDbContext context)
        {
            ShowtimeGroup overlappedGroup = context.ShowtimeGroups
                .Where(s => s.FromDate < ToDate && s.ToDate > FromDate && s.MovieID == MovieID)
                .FirstOrDefault();

            if(overlappedGroup != null)
            {
                errors.Add("general", "Another Showtime Group was found which overlaps with this one.");
                return true;
            }

            int movieLength = context.Movies.Where(m => m.MovieID == MovieID).Select(m => m.Duration).Single();
            ShowtimeGroupEntries.OrderBy(e => e.RoomID).ThenBy(e => e.StartTime);

            for(int i = 0; i < ShowtimeGroupEntries.Count; i++)
            {
                if(i == ShowtimeGroupEntries.Count-1)
                {
                    break;
                }
                else if(ShowtimeGroupEntries[i].Conflicts(ShowtimeGroupEntries[i+1], movieLength))
                {
                    errors.Add(ShowtimeGroupEntries[i].ShortIdentification, "This overlaps with the next entry in the same room.");
                }
            }

            if(errors.Count > 0)
            {
                errors.Add("general", "Scheduling conflicts found, please make sure entries don't overlap with each other.");
                return true;
            }
            return false;
        }

        private bool AllRequiredFields(Dictionary<string, string> errors)
        {
            if(FromDate == null || ToDate == null)
            {
                errors.Add("general", "Please fill out all fields.");
                return false;
            }

            foreach(ShowtimeGroupEntry entry in ShowtimeGroupEntries)
            {
                if(entry.StartTime == "" || entry.RoomID == -1 || entry.ExperienceID == -1)
                {
                    errors.Add("general", "Please fill out all fields.");
                    return false;
                }
            }

            return true;
        }

        public Dictionary<string,string> Validate(ReactCinemaDbContext context)
        {
            Dictionary<string, string> errors = new Dictionary<string, string>();
            if(!AllRequiredFields(errors))
            {
                return errors;
            }
            if(OverlapFound(errors, context))
            {
                return errors;
            }

            return errors; 
        }
    }
}
