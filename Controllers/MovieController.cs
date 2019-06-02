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
    }
}
