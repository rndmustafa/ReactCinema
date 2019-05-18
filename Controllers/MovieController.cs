using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
            List<Movie> movies = await _context.Movies.Where(m => m.Active == true).ToListAsync();
            return Ok(movies);
        }

        [HttpGet("{id}", Name = "GetMovie")]
        public async Task<IActionResult> GetMovieAsync(int id)
        {
            Movie movie = await _context.Movies.FindAsync(id);
            return Ok(movie);
        }

        [HttpPost]
        public async Task<IActionResult> PostMovieAsync([FromBody] Movie newMovie)
        {
            _context.Movies.Add(newMovie);
            await _context.SaveChangesAsync();
            return CreatedAtRoute("GetMovie", new { id = newMovie.MovieID }, newMovie);
        }

        [HttpDelete("{id}")]
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
