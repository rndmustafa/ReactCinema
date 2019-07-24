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


    }
}
