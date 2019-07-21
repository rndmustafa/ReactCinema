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

        public void GenerateShowtimes(Movie movie, DateTime fromDate, DateTime toDate)
        {
            SetInterval();
            if(Showtimes == null)
            {
                Showtimes = new List<Showtime>();
            }
            for (DateTime date = fromDate; date <= toDate; date = date.AddDays(1))
            {
                DateTime showtimeDate = date.Date + Interval;
                Showtime newShowtime = new Showtime()
                {
                    MovieID = movie.MovieID,
                    StartTime = showtimeDate,
                    EndTime = showtimeDate.AddMinutes(movie.Duration),
                    RoomID = RoomID,
                    Soldout = false,
                    ExperienceID = ExperienceID
                };
                Showtimes.Add(newShowtime);
            }
        }

        public void RemoveShowtimes(DateTime fromDate, DateTime toDate)
        {
            List<Showtime> showtimesToDelete = Showtimes
                .Where(s => s.ShowtimeGroupEntryID == ShowtimeGroupEntryID
                && s.StartTime.Date >= fromDate.Date 
                && s.StartTime.Date <= toDate.Date)
                .ToList();

            foreach(Showtime showtime in showtimesToDelete)
            {
                Showtimes.Remove(showtime);
            }
        }

        public void UpdateData(ShowtimeGroupEntry showtimeGroupEntry, int duration)
        {
            if(StartTime == showtimeGroupEntry.StartTime 
                && RoomID == showtimeGroupEntry.RoomID 
                && ExperienceID == showtimeGroupEntry.ExperienceID)
            {
                return;
            }

            StartTime = showtimeGroupEntry.StartTime;
            RoomID = showtimeGroupEntry.RoomID;
            ExperienceID = showtimeGroupEntry.ExperienceID;

            foreach(Showtime showtime in Showtimes)
            {
                showtime.StartTime = showtime.StartTime.Date + TimeSpan.Parse(StartTime);
                showtime.EndTime = showtime.StartTime.AddMinutes(duration);
                showtime.RoomID = RoomID;
                showtime.ExperienceID = ExperienceID;
            }
        }

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
