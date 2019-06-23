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
            modelBuilder.Entity<Movie>().HasIndex(m => m.Title);
            modelBuilder.Entity<ShowtimeGroup>().HasIndex(s => new { s.MovieID, s.FromDate, s.ToDate });
            modelBuilder.Entity<RoomToExperience>().HasKey(re => new { re.RoomID, re.ExperienceID });

            modelBuilder.Entity<Seat>()
                .HasOne(s => s.Row)
                .WithMany(r => r.Seats)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<Showtime> Showtimes { get; set; }
        public DbSet<ShowtimeGroup> ShowtimeGroups { get; set; }
        public DbSet<ShowtimeGroupEntry> ShowtimeGroupEntries { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<RoomToExperience> RoomToExperiences { get; set; }
        public DbSet<Layout> Layouts { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Row> Row { get; set; }
        public DbSet<Seat> Seats { get; set; }

    }
}
