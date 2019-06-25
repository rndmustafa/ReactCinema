using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactCinema.Data;
using ReactCinema.Models;

namespace ReactCinema.Controllers
{
    [Route("api/[controller]")]
    public class MovieController : Controller
    {
        private readonly ReactCinemaDbContext _context;

        public MovieController(ReactCinemaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetMoviesAsync()
        {
            List<Movie> movies = await _context.Movies.ToListAsync();
            return Ok(movies);
        }

        [HttpGet("{id}", Name = "GetMovie")]
        public async Task<IActionResult> GetMovieAsync(int id)
        {
            Movie movie = await _context.Movies.FindAsync(id);
            return Ok(movie);
        }

        [HttpPost]
        [Authorize("edit:data")]
        public async Task<IActionResult> PostMovieAsync([FromBody] Movie newMovie)
        {
            if(newMovie != null)
            {
                _context.Movies.Add(newMovie);
                await _context.SaveChangesAsync();
                return CreatedAtRoute("GetMovie", new { id = newMovie.MovieID }, newMovie);
            }
            return BadRequest();
        }

        [HttpPut("{id}")]
        [Authorize("edit:data")]
        public async Task<IActionResult> PutMovieAsync(long id, [FromBody] Movie movie)
        {
            if (id != movie.MovieID)
            {
                return BadRequest();
            }

            _context.Entry(movie).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize("edit:data")]
        public async Task<IActionResult> DeleteMovieAsync(int id)
        {
            Movie movie = await _context.Movies.FindAsync(id);
            if(movie != null)
            {
                _context.Movies.Remove(movie);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            return NotFound();
        }

        [HttpGet("{id}/showtimegroups")]
        public async Task<IActionResult> GetShowtimeGroupsAsync(int id)
        {
            List<ShowtimeGroup> showtimeGroups = await _context
                .ShowtimeGroups
                .Where(s => s.MovieID == id)
                .Include(s => s.ShowtimeGroupEntries)
                  .ThenInclude(e => e.Room)
                .Include(s => s.ShowtimeGroupEntries)
                  .ThenInclude(e => e.Experience)
                .OrderByDescending(s => s.FromDate)
                .ToListAsync();

            return Ok(showtimeGroups);
        }

        [HttpGet("showtimegroups/{id}", Name = "GetShowtimeGroup")]
        public async Task<IActionResult> GetShowtimeGroupAsync(int id)
        {
            ShowtimeGroup showtimeGroup = await _context
                .ShowtimeGroups
                .Where(s => s.ShowtimeGroupID == id)
                .Include(s => s.ShowtimeGroupEntries)
                  .ThenInclude(e => e.Room)
                .Include(s => s.ShowtimeGroupEntries)
                  .ThenInclude(e => e.Experience)
                .FirstAsync();

            return Ok(showtimeGroup);
        }

        [HttpDelete("showtimegroups/{id}")]
        [Authorize("edit:data")]
        public async Task<IActionResult> DeleteShowtimeGroupAsync(int id)
        {
            ShowtimeGroup group = await _context.ShowtimeGroups.FindAsync(id);
            if(group != null)
            {
                _context.ShowtimeGroups.Remove(group);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            return NotFound();
        }

        [HttpPut("showtimegroups/{id}")]
        [Authorize("edit:data")]
        public async Task<IActionResult> PutShowtimeGroupAsync(int id, [FromBody] ShowtimeGroup group)
        {
            if (id != group.ShowtimeGroupID)
            {
                return BadRequest();
            }

            _context.Entry(group).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/showtimegroups")]
        [Authorize("edit:data")]
        public async Task<IActionResult> PostMovieShowtimesAsync(int id, [FromBody] ShowtimeGroup showtimeGroup)
        {
            if(showtimeGroup == null)
            {
                return BadRequest(new { general = "There was an unexpected error. Try again later." });
            }

            showtimeGroup.Movie = await _context.Movies.FindAsync(showtimeGroup.MovieID);
            Dictionary<string,string> errors = showtimeGroup.Validate(_context);
            if(errors.Count == 0)
            {
                showtimeGroup.GenerateShowtimes();
                _context.ShowtimeGroups.Add(showtimeGroup);
                await _context.SaveChangesAsync();
                return CreatedAtRoute("GetShowtimeGroup", new { id = showtimeGroup.ShowtimeGroupID }, showtimeGroup);
            }
            return BadRequest(errors);
        }
    }
}
