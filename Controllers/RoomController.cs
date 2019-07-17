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
    public class RoomController : Controller
    {
        private readonly ReactCinemaDbContext _context;

        public RoomController(ReactCinemaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoomsAsync()
        {
            List<Room> rooms = await _context.Rooms.ToListAsync();
            return Ok(rooms);
        }

        [HttpGet("{id}", Name ="GetRoom")]
        public async Task<IActionResult> GetRoomAsync(int id)
        {
            Room room = await _context.Rooms.FindAsync(id);
            if(room != null)
            {
                return Ok(room);
            }
            return NotFound(new { general = "Invalid ID supplied."});
        }

        [HttpPut("{id}")]
        [Authorize("edit:data")]
        public async Task<IActionResult> PutRoomAsync(int id, [FromBody] Room updatedRoom)
        {
            if(id != updatedRoom.RoomID)
            {
                return BadRequest(new { general = "Failed to update room." });
            }

            _context.Entry(updatedRoom).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost]
        [Authorize("edit:data")]
        public async Task<IActionResult> PostRoomAsync([FromBody] Room room)
        {
            if(room != null)
            {
                _context.Rooms.Add(room);
                await _context.SaveChangesAsync();
                return CreatedAtRoute("GetRoom", new { id = room.RoomID }, room);
            }
            return BadRequest(new { general = "Failed to create room." });
        }

        [HttpDelete("{id}")]
        [Authorize("edit:data")]
        public async Task<IActionResult> DeleteRoomAsync(int id)
        {
            Room room = await _context.Rooms.FindAsync(id);
            Dictionary<string, string> errors = new Dictionary<string, string>();
            if(room != null)
            {
                if (room.CanBeDeleted(_context, errors))
                {
                    _context.Rooms.Remove(room);
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
