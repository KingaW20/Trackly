using Microsoft.EntityFrameworkCore;
using Trackly.Models.Movies;

namespace Trackly.Models.Contexts
{
    public class MovieContext : DbContext
    {
        public MovieContext(DbContextOptions<MovieContext> options) : base(options) { }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<TvSerie> TvSeries { get; set; }
        public DbSet<TvSerieEpisode> TvSerieEpisodes { get; set; }
        public DbSet<UserProgram> UserPrograms { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Movie>()
                .HasIndex(movie => movie.Title)
                .IsUnique();

            modelBuilder.Entity<TvSerie>()
                .HasIndex(serie => serie.Title)
                .IsUnique();

            modelBuilder.Entity<TvSerieEpisode>()
                .HasIndex(episode => new { episode.TvSerieId, episode.Season, episode.Episode })
                .IsUnique();
        }
    }
}