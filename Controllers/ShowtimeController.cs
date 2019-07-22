using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactCinema.Data;
using ReactCinema.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ReactCinema.Controllers
{
    [Route("api/[controller]")]
    public class ShowtimeController : Controller
    {
        private readonly ReactCinemaDbContext _context;

        public ShowtimeController(ReactCinemaDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetShowtimeAsync(int id)
        {
            Showtime showtime = await _context.Showtimes
                .Where(s => s.ShowtimeID == id)
                .Include(s => s.Movie)
                .Include(s => s.Experience)
                .SingleOrDefaultAsync();
            if (showtime != null)
            {
                return Ok(showtime);
            }
            return NotFound(new { general = "Invalid ID supplied." });
        }
    }
}
