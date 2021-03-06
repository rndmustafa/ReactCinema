﻿using System;
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
        public async Task<IActionResult> GetMoviesAsync(DateTime showdate)
        {
            IQueryable<Movie> moviesQuery = _context.Movies;
            if(showdate != DateTime.MinValue)
            {
                moviesQuery = moviesQuery.Where(m => m.Showtimes.Any(s => s.StartTime.Date == showdate.Date));
            }
            List<Movie> movies = await moviesQuery.ToListAsync();

            return Ok(movies);
        }

        [HttpGet("{id}", Name = "GetMovie")]
        public async Task<IActionResult> GetMovieAsync(int id)
        {
            Movie movie = await _context.Movies.FindAsync(id);
            if(movie != null)
            {
                return Ok(movie);
            }
            return NotFound(new { general = "Invalid ID supplied." });
        }

        [HttpPost]
        [Authorize("edit:data")]
        public async Task<IActionResult> PostMovieAsync([FromBody] Movie newMovie)
        {
            if(newMovie == null)
            {
                return BadRequest(new { general = "There was an unexpected error. Try again later." });
            }

            Dictionary<string,string> errors = newMovie.Validate();
            if(errors.Count == 0)
            {
                _context.Movies.Add(newMovie);
                await _context.SaveChangesAsync();
                return CreatedAtRoute("GetMovie", new { id = newMovie.MovieID }, newMovie);
            }
            return BadRequest(errors);
        }

        [HttpPut("{id}")]
        [Authorize("edit:data")]
        public async Task<IActionResult> PutMovieAsync(long id, [FromBody] Movie movie)
        {
            if (id != movie.MovieID)
            {
                return BadRequest(new { general = "There was an unexpected error. Try again later." });
            }

            Dictionary<string, string> errors = movie.Validate();
            if(errors.Count == 0)
            {
                _context.Entry(movie).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            return BadRequest(errors);
        }

        [HttpDelete("{id}")]
        [Authorize("edit:data")]
        public async Task<IActionResult> DeleteMovieAsync(int id)
        {
            Movie movie = await _context.Movies.FindAsync(id);
            Dictionary<string, string> errors = new Dictionary<string, string>();
            if(movie != null)
            {
                if(movie.CanBeDeleted(_context,errors))
                {
                    _context.Movies.Remove(movie);
                    await _context.SaveChangesAsync();
                    return NoContent();
                }
                else
                {
                    return BadRequest(errors);
                }
            }
            return NotFound();
        }

        [HttpGet("{id}/showtimes")]
        public async Task<IActionResult> GetShowtimesAsync(int id, DateTime date)
        {
            List<Showtime> showtimes = await _context.Showtimes
                .Where(s => s.MovieID == id && s.StartTime.Date == date.Date)
                .Include(s => s.Room)
                .Include(s => s.Experience)
                .OrderBy(s => s.StartTime)
                .ToListAsync();

            return Ok(showtimes);
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
            if(showtimeGroup != null)
            {
                return Ok(showtimeGroup);
            }
            return NotFound(new { general = "Invalid ID supplied." });
        }

        [HttpDelete("showtimegroups/{id}")]
        [Authorize("edit:data")]
        public async Task<IActionResult> DeleteShowtimeGroupAsync(int id)
        {
            ShowtimeGroup group = await _context.ShowtimeGroups.FindAsync(id);
            Dictionary<string, string> errors = new Dictionary<string, string>();
            if(group != null)
            {
                if(group.CanBeDeleted(_context,errors))
                {
                    _context.ShowtimeGroups.Remove(group);
                    await _context.SaveChangesAsync();
                    return NoContent();
                }
                else
                {
                    return BadRequest(errors);
                }
            }
            return NotFound();
        }

        [HttpPut("showtimegroups/{id}")]
        [Authorize("edit:data")]
        public async Task<IActionResult> PutShowtimeGroupAsync(int id, [FromBody] ShowtimeGroup UpdatedGroup)
        {
            if (id != UpdatedGroup.ShowtimeGroupID)
            {
                return BadRequest();
            }
            Dictionary<string, string> errors = UpdatedGroup.Validate(_context);
            if(errors.Count == 0)
            {
                ShowtimeGroup group = await _context.ShowtimeGroups
                    .Where(g => g.ShowtimeGroupID == id)
                    .Include(g => g.ShowtimeGroupEntries)
                      .ThenInclude(e => e.Showtimes)
                    .Include(g => g.Movie)
                    .SingleAsync();

                group.UpdateEntries(UpdatedGroup);
                await _context.SaveChangesAsync();

                group.Movie = null;
                foreach(ShowtimeGroupEntry entry in group.ShowtimeGroupEntries)
                {
                    entry.Showtimes = null;
                }
                return Created($"api/movie/showtimegroups/{id}", group);
            }
            return BadRequest(errors);
        }

        [HttpPost("{id}/showtimegroups")]
        [Authorize("edit:data")]
        public async Task<IActionResult> PostMovieShowtimesAsync(int id, [FromBody] ShowtimeGroup showtimeGroup)
        {
            if(showtimeGroup == null)
            {
                return BadRequest(new { general = "There was an unexpected error. Try again later." });
            }

            Dictionary<string,string> errors = showtimeGroup.Validate(_context);
            if(errors.Count == 0)
            {
                showtimeGroup.GenerateShowtimes(_context);
                _context.ShowtimeGroups.Add(showtimeGroup);
                await _context.SaveChangesAsync();

                showtimeGroup.Movie = null;
                foreach(ShowtimeGroupEntry entry in showtimeGroup.ShowtimeGroupEntries)
                {
                    entry.Showtimes = null;
                }
                return CreatedAtRoute("GetShowtimeGroup", new { id = showtimeGroup.ShowtimeGroupID }, showtimeGroup);
            }
            return BadRequest(errors);
        }
    }
}
