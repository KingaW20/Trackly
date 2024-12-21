using Trackly.Models.Movies;
using Trackly.Repositories.Movies;
using Trackly.Utils.Exceptions;

namespace Trackly.Services.Movies
{
    public class TvSerieEpisodeService
    {

        private readonly TvSerieEpisodeRepository _seRepository;
        private readonly TvSerieService _tvSerieService;

        public TvSerieEpisodeService(TvSerieEpisodeRepository tvSerieEpisodeRepository, TvSerieService tvSerieService)
        {
            _seRepository = tvSerieEpisodeRepository;
            _tvSerieService = tvSerieService;
        }

        public async Task<IEnumerable<TvSerieEpisode>> GetTvSerieEpisodes()
        {
            var tvSerieEpisodes = await _seRepository.GetTvSerieEpisodes();

            var result = new List<TvSerieEpisode>();
            foreach (var tse in tvSerieEpisodes)
            {
                var tvSerieEpisode = await SetValues(tse);
                result.Add(tvSerieEpisode);
            }

            return result;
        }

        public async Task<TvSerieEpisode?> GetTvSerieEpisode(int id)
        {
            var result = await _seRepository.GetTvSerieEpisode(id);
            if (result == null) throw new NotFoundException();
            result = await SetValues(result);
            return result;
        }

        public async Task<TvSerieEpisode> AddTvSerieEpisode(TvSerieEpisode tvSerieEpisode)
        {
            tvSerieEpisode.Id = 0;
            if ((await _seRepository.GetTvSerieEpisodes(
                tvSerieId: tvSerieEpisode.TvSerieId, episode: tvSerieEpisode.Episode, season: tvSerieEpisode.Season))
                .Any())
                throw new TvSerieEpisodeExistException();
            return await _seRepository.AddTvSerieEpisode(tvSerieEpisode);
        }

        public async Task<TvSerieEpisode> UpdateTvSerieEpisode(TvSerieEpisode tvSerieEpisode)
        {
            var se = await _seRepository.GetTvSerieEpisode(tvSerieEpisode.Id);
            if (se == null) throw new TvSerieEpisodeNotExistException();

            if ((await _seRepository.GetTvSerieEpisodes(idNot: tvSerieEpisode.Id,
                tvSerieId: tvSerieEpisode.TvSerieId, episode: tvSerieEpisode.Episode, season: tvSerieEpisode.Season))
                .Any())
                throw new TvSerieEpisodeExistException();

            var result = await _seRepository.UpdateTvSerieEpisode(tvSerieEpisode);
            if (result == null) throw new NotFoundException();

            return result!;
        }

        public async Task DeleteTvSerieEpisode(int id)
        {
            var se = await _seRepository.GetTvSerieEpisode(id);
            if (se == null) throw new NotFoundException();
            await _seRepository.DeleteTvSerieEpisode(se);
        }

        private async Task<TvSerieEpisode> SetValues(TvSerieEpisode tvSerieEpisode)
        {
            tvSerieEpisode.TvSerie = (await _tvSerieService.GetTvSerie(tvSerieEpisode.TvSerieId));
            return tvSerieEpisode;
        }
    }
}
