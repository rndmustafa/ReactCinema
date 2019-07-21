using ReactCinema.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
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

        public void GenerateShowtimes(ReactCinemaDbContext context)
        {
            if (Movie == null)
            {
                Movie = context.Movies.Find(MovieID);
            }
            foreach (ShowtimeGroupEntry entry in ShowtimeGroupEntries)
            {
                entry.GenerateShowtimes(Movie, FromDate, ToDate);
            }
        }

        private bool OverlapFound(Dictionary<string, string> errors, ReactCinemaDbContext context)
        {
            ShowtimeGroup overlappedGroup = context.ShowtimeGroups
                .Where(s => s.FromDate < ToDate 
                && s.ToDate > FromDate 
                && s.MovieID == MovieID 
                && s.ShowtimeGroupID != ShowtimeGroupID)
                .FirstOrDefault();

            if(overlappedGroup != null)
            {
                errors.Add("general", "Another Showtime Group was found which overlaps with this one.");
                return true;
            }

            List<ShowtimeGroupEntry> orderedEntries = ShowtimeGroupEntries.OrderBy(e => e.RoomID).ThenBy(e => e.StartTime).ToList();
            for(int i = 0; i < orderedEntries.Count; i++)
            {
                if(i == orderedEntries.Count-1)
                {
                    break;
                }
                else if(orderedEntries[i].Conflicts(orderedEntries[i+1], Movie.Duration))
                {
                    errors.Add(orderedEntries[i].ShortIdentification, "This overlaps with the next entry in the same room.");
                }
            }

            if(errors.Count > 0)
            {
                errors.Add("general", "Scheduling conflicts found, please make sure entries don't overlap with each other.");
                return true;
            }

            foreach (ShowtimeGroupEntry entry in ShowtimeGroupEntries)
            {
                entry.SetInterval();
                for (DateTime date = FromDate; date <= ToDate; date = date.AddDays(1))
                {
                    DateTime showtimeDate = date.Date + entry.Interval;
                    Showtime showtime = context.Showtimes
                        .Where(s => s.RoomID == entry.RoomID 
                        && s.StartTime < showtimeDate.AddMinutes(Movie.Duration) 
                        && s.EndTime > showtimeDate
                        && s.MovieID != MovieID)
                        .Include(s => s.Movie)
                        .FirstOrDefault();
                    if(showtime != null)
                    {
                        errors.Add("general", $"Showtime conflict with {showtime.Movie.Title} at {showtime.StartTime}");
                        return true;
                    }
                }
            }

            return false;
        }

        private bool ValidFields(Dictionary<string, string> errors)
        {
            if(FromDate == null || ToDate == null)
            {
                errors.Add("general", "Please fill out all fields.");
                return false;
            }

            if(FromDate > ToDate)
            {
                errors.Add("fromDate", "From Date must be before or equal to To Date.");
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

        private bool ActiveReservationsFound(Dictionary<string, string> errors, ReactCinemaDbContext context)
        {
            DateTime current = DateTime.Now;
            List<Reservation> reservations = context.Reservations
                .Where(r => r.Showtime.ShowtimeGroupEntry.ShowtimeGroup.ShowtimeGroupID == ShowtimeGroupID
                && current < r.Showtime.EndTime)
                .Include(r => r.Showtime)
                .ToList();

            foreach(Reservation reservation in reservations)
            {
                DateTime reservationDate = reservation.Showtime.StartTime;
                if (reservationDate < FromDate || reservationDate > ToDate)
                {
                    errors.Add("general", $"This update would remove active reservation {reservation.ReservationID}");
                    return true;
                }
                foreach(ShowtimeGroupEntry entry in ShowtimeGroupEntries)
                {
                    if(reservationDate.TimeOfDay == TimeSpan.Parse(entry.StartTime)
                        && reservation.Showtime.ExperienceID == entry.ExperienceID
                        && reservation.Showtime.RoomID == entry.RoomID)
                    {
                        return false;
                    }
                }

                errors.Add("general", $"This update would remove active reservation {reservation.ReservationID}");
                return true;
            }

            return false;
        }

        public Dictionary<string,string> Validate(ReactCinemaDbContext context)
        {
            if(Movie == null)
            {
                Movie = context.Movies.Find(MovieID);
            }

            Dictionary<string, string> errors = new Dictionary<string, string>();
            if(!ValidFields(errors) || OverlapFound(errors,context))
            {
                return errors;
            }

            if(ShowtimeGroupID != 0)
            {
                ActiveReservationsFound(errors, context);
            }

            return errors; 
        }


        public void UpdateEntries(ShowtimeGroup updatedGroup)
        {
            if(updatedGroup.FromDate < FromDate)
            {
                foreach (ShowtimeGroupEntry entry in ShowtimeGroupEntries)
                {
                    DateTime earlier = updatedGroup.ToDate < FromDate.AddDays(-1) ? ToDate : FromDate.AddDays(-1);
                    entry.GenerateShowtimes(Movie, updatedGroup.FromDate, earlier);
                }
            }
            else if (updatedGroup.FromDate > FromDate)
            {
                foreach (ShowtimeGroupEntry entry in ShowtimeGroupEntries)
                {
                    entry.RemoveShowtimes(FromDate, updatedGroup.FromDate.AddDays(-1));
                }
            }
            FromDate = updatedGroup.FromDate;

            if (updatedGroup.ToDate < ToDate)
            {
                foreach (ShowtimeGroupEntry entry in ShowtimeGroupEntries)
                {
                    entry.RemoveShowtimes(updatedGroup.ToDate.AddDays(1), ToDate);
                }
            }
            else if (updatedGroup.ToDate > ToDate)
            {
                foreach (ShowtimeGroupEntry entry in ShowtimeGroupEntries)
                {
                    DateTime later = ToDate.AddDays(1) > updatedGroup.FromDate ? ToDate.AddDays(1) : updatedGroup.FromDate;
                    entry.GenerateShowtimes(Movie, later, updatedGroup.ToDate);
                }
            }
            ToDate = updatedGroup.ToDate;

            UpdateGroupEntries(updatedGroup);
        }

        private void UpdateGroupEntries(ShowtimeGroup updatedGroup)
        {
            List<ShowtimeGroupEntry> entriesToDelete = ShowtimeGroupEntries
                .Where(e => !updatedGroup.ShowtimeGroupEntries.Any(ue => e.StartTime == ue.StartTime 
                && e.RoomID == ue.RoomID 
                && e.ExperienceID == ue.ExperienceID))
                .ToList();
            List<ShowtimeGroupEntry> entriesToCreate = updatedGroup.ShowtimeGroupEntries
                .Where(ue => !ShowtimeGroupEntries.Any(e => e.StartTime == ue.StartTime 
                && e.RoomID == ue.RoomID 
                && e.ExperienceID == ue.ExperienceID))
                .ToList();

            foreach(ShowtimeGroupEntry entry in entriesToDelete)
            {
                ShowtimeGroupEntries.Remove(entry);
            }

            foreach (ShowtimeGroupEntry entry in ShowtimeGroupEntries)
            {
                ShowtimeGroupEntry updatedEntry = updatedGroup.ShowtimeGroupEntries
                    .Where(e => e.ShowtimeGroupEntryID == entry.ShowtimeGroupEntryID)
                    .SingleOrDefault();
                if(updatedEntry != null)
                {
                    entry.UpdateData(updatedEntry, Movie.Duration);
                }
            }

            foreach (ShowtimeGroupEntry entry in entriesToCreate)
            {
                entry.GenerateShowtimes(Movie, FromDate, ToDate);
                ShowtimeGroupEntries.Add(entry);
            }
        }

        public bool CanBeDeleted(ReactCinemaDbContext context, Dictionary<string, string> errors)
        {
            DateTime current = DateTime.Now;
            Reservation reservation = context.Reservations
                .Where(r => r.Showtime.ShowtimeGroupEntry.ShowtimeGroup.ShowtimeGroupID == ShowtimeGroupID
                && current < r.Showtime.EndTime)
                .FirstOrDefault();

            if (reservation != null)
            {
                errors.Add("general", $"Reservation {reservation.ReservationID} holds a showtime associated with this group.");
                return false;
            }
            return true;
        }
    }
}
