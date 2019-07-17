﻿using ReactCinema.Data;
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
                entry.SetInterval();
                entry.Showtimes = new List<Showtime>();
                for(DateTime date = FromDate; date <= ToDate; date = date.AddDays(1))
                {
                    DateTime showtimeDate = date.Date + entry.Interval;
                    Showtime newShowtime = new Showtime()
                    {
                        MovieID = this.MovieID,
                        StartTime = showtimeDate,
                        EndTime = showtimeDate.AddMinutes(Movie.Duration),
                        RoomID = entry.RoomID,
                        Soldout = false,
                        ExperienceID = entry.ExperienceID
                    };
                    entry.Showtimes.Add(newShowtime);
                }
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

            ShowtimeGroupEntries.OrderBy(e => e.RoomID).ThenBy(e => e.StartTime);
            for(int i = 0; i < ShowtimeGroupEntries.Count; i++)
            {
                if(i == ShowtimeGroupEntries.Count-1)
                {
                    break;
                }
                else if(ShowtimeGroupEntries[i].Conflicts(ShowtimeGroupEntries[i+1], Movie.Duration))
                {
                    errors.Add(ShowtimeGroupEntries[i].ShortIdentification, "This overlaps with the next entry in the same room.");
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

            return errors; 
        }


        public void UpdateEntries(ShowtimeGroup updatedGroup)
        {
            throw new NotImplementedException();
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
