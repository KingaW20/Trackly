using Microsoft.EntityFrameworkCore;
using Trackly.Models.Contexts;
using Trackly.Models.Movies;

namespace Trackly.Repositories.TvSeries
{
    public class TvSerieRepository
    {
        private readonly MovieContext _context;

        public TvSerieRepository(MovieContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TvSerie>> GetTvSeries(int? idNot = null, string? title = null)
        {
            var query = _context.TvSeries.AsQueryable();

            if (idNot != null && idNot != 0)
                query = query.Where(pc => pc.Id != idNot);

            if (!string.IsNullOrEmpty(title))
                query = query.Where(pc => pc.Title == title);

            return await query.ToListAsync();
        }

        public async Task<TvSerie?> GetTvSerie(int id)
        {
            return await _context.TvSeries.FindAsync(id);
        }

        public async Task<TvSerie> AddTvSerie(TvSerie tvSerie)
        {
            var result = await _context.TvSeries.AddAsync(tvSerie);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<TvSerie?> UpdateTvSerie(TvSerie tvSerie)
        {
            _context.ChangeTracker.Clear();
            _context.Entry(tvSerie).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return tvSerie;
        }

        public async Task DeleteTvSerie(TvSerie tvSerie)
        {
            _context.TvSeries.Remove(tvSerie);
            await _context.SaveChangesAsync();
        }
    }
}
