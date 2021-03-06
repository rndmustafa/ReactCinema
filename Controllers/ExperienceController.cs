﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReactCinema.Data;
using ReactCinema.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ReactCinema.Controllers
{
    [Route("api/[controller]")]
    public class ExperienceController : Controller
    {
        private readonly ReactCinemaDbContext _context;

        public ExperienceController(ReactCinemaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetExperiencesAsync()
        {
            var experiences = await _context
                .Experiences
                .Select(e => new { e.ExperienceID, e.Title })
                .ToListAsync();

            return Ok(experiences);
        }

        [HttpGet("{id}", Name = "GetExperience")]
        public async Task<IActionResult> GetExperienceAsync(int id)
        {
            Experience experience = await _context.Experiences.FindAsync(id);
            if(experience != null)
            {
                return Ok(experience);
            }
            return NotFound(new { general = "Invalid ID supplied." });
        }

        [HttpPost]
        [Authorize("edit:data")]
        public async Task<IActionResult> PostExperienceAsync([FromBody] Experience experience)
        {
            if(experience == null)
            {
                return BadRequest(new { general = "Failed to create new experience" });
            }
            Dictionary<string, string> errors = experience.Validate();
            if (errors.Count == 0)
            {
                _context.Experiences.Add(experience);
                await _context.SaveChangesAsync();
                return CreatedAtRoute("GetExperience",new { id = experience.ExperienceID }, experience);
            }
            return BadRequest(errors);
        }

        [HttpPut("{id}")]
        [Authorize("edit:data")]
        public async Task<IActionResult> PutExperienceAsync(int id, [FromBody] Experience experience)
        {
            if(id != experience.ExperienceID)
            {
                return BadRequest(new { general = "Failed to update experience" });
            }

            Dictionary<string, string> errors = experience.Validate();
            if(errors.Count == 0)
            {
                _context.Entry(experience).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            return BadRequest(errors);
        }

        [HttpDelete("{id}")]
        [Authorize("edit:data")]
        public async Task<IActionResult> DeleteExperienceAsync(int id)
        {
            Experience experience = await _context.Experiences.FindAsync(id);
            Dictionary<string, string> errors = new Dictionary<string, string>();
            if (experience != null)
            {
                if(experience.CanBeDeleted(_context,errors))
                {
                    _context.Experiences.Remove(experience);
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
    }
}
