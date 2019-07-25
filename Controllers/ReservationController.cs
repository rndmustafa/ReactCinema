using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactCinema.Data;
using ReactCinema.Models;

namespace ReactCinema.Controllers
{
    [Route("api/[controller]")]
    public class ReservationController : Controller
    {
        private readonly ReactCinemaDbContext _context;

        public ReservationController(ReactCinemaDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PostReservationAsync(string email, int adultTickets, int childTickets, int showtimeID)
        {
            if(email == "")
            {
                return BadRequest(new { general = "Please enter your email" });
            }
            else if(adultTickets + childTickets == 0)
            {
                return BadRequest(new { general = "You must reserve at least one ticket" });
            }

            int reservationsMade = _context.Reservations
                .Where(r => r.ShowtimeID == showtimeID)
                .Count();
            int roomCapacity = _context.Showtimes
                .Where(s => s.ShowtimeID == showtimeID)
                .Select(s => s.Room.Capacity)
                .Single();

            if(reservationsMade + adultTickets + childTickets > roomCapacity)
            {
                return BadRequest(new { general = "There aren't enough free seats to complete your reservation. " +
                    "Please choose a different showtime." });
            }

            for(int i = 0; i < adultTickets; i++)
            {
                Reservation reservation = new Reservation
                {
                    ShowtimeID = showtimeID,
                    Type = "Adult",
                    Email = email
                };
                _context.Reservations.Add(reservation);
            }
            for (int i = 0; i < childTickets; i++)
            {
                Reservation reservation = new Reservation
                {
                    ShowtimeID = showtimeID,
                    Type = "Child",
                    Email = email
                };
                _context.Reservations.Add(reservation);
            }

            if (reservationsMade + adultTickets + childTickets == roomCapacity)
            {
                Showtime showtime = await _context.Showtimes.FindAsync(showtimeID);
                showtime.Soldout = true;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
