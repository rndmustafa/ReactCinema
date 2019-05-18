using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReactCinema.Models;

namespace ReactCinema.Data
{
    public class ReactCinemaDbContext : DbContext
    {
        public ReactCinemaDbContext(DbContextOptions<ReactCinemaDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Movie>()
                .HasIndex(m => m.Title);
        }

        public DbSet<Movie> Movies { get; set; }
    }
}
