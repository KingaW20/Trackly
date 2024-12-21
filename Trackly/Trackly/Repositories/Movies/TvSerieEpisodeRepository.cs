using Microsoft.EntityFrameworkCore;
using Trackly.Models.Contexts;
using Trackly.Models.Movies;

namespace Trackly.Repositories.Movies
{
    public class TvSerieEpisodeRepository
    {
        private readonly MovieContext _context;

        public TvSerieEpisodeRepository(MovieContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TvSerieEpisode>> GetTvSerieEpisodes(
            int? idNot = null, int? tvSerieId = null, int? episode = null, int? season = null)
        {
            var query = _context.TvSerieEpisodes.AsQueryable();

            if (idNot != null && idNot != 0)
                query = query.Where(e => e.Id != idNot);

            if (tvSerieId != null && tvSerieId != 0)
                query = query.Where(e => e.TvSerieId == tvSerieId);

            if (episode != null && episode != 0)
                query = query.Where(e => e.Episode == episode);

            if (season != null && season != 0)
                query = query.Where(e => e.Season == season);

            return await query.ToListAsync();
        }

        public async Task<TvSerieEpisode?> GetTvSerieEpisode(int id)
        {
            return await _context.TvSerieEpisodes.FindAsync(id);
        }

        public async Task<TvSerieEpisode> AddTvSerieEpisode(TvSerieEpisode tvSerieEpisode)
        {
            var result = await _context.TvSerieEpisodes.AddAsync(tvSerieEpisode);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<TvSerieEpisode?> UpdateTvSerieEpisode(TvSerieEpisode tvSerieEpisode)
        {
            _context.ChangeTracker.Clear();
            _context.Entry(tvSerieEpisode).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return tvSerieEpisode;
        }

        public async Task DeleteTvSerieEpisode(TvSerieEpisode tvSerieEpisode)
        {
            _context.TvSerieEpisodes.Remove(tvSerieEpisode);
            await _context.SaveChangesAsync();
        }
    }
}
