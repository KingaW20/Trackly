using Microsoft.EntityFrameworkCore;
using Trackly.Models.Contexts;
using Trackly.Models.Movies;

namespace Trackly.Repositories.Movies
{
    public class MovieRepository
    {
        private readonly MovieContext _context;

        public MovieRepository(MovieContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Movie>> GetMovies(int? idNot = null, string? title = null)
        {
            var query = _context.Movies.AsQueryable();

            if (idNot != null && idNot != 0)
                query = query.Where(pc => pc.Id != idNot);

            if (!string.IsNullOrEmpty(title))
                query = query.Where(pc => pc.Title == title);

            return await query.ToListAsync();
        }

        public async Task<Movie?> GetMovie(int id)
        {
            return await _context.Movies.FindAsync(id);
        }

        public async Task<Movie> AddMovie(Movie Movie)
        {
            var result = await _context.Movies.AddAsync(Movie);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Movie?> UpdateMovie(Movie Movie)
        {
            _context.ChangeTracker.Clear();
            _context.Entry(Movie).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Movie;
        }

        public async Task DeleteMovie(Movie Movie)
        {
            _context.Movies.Remove(Movie);
            await _context.SaveChangesAsync();
        }
    }
}
