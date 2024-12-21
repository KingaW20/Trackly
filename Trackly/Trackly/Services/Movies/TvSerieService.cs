using Trackly.Models.Movies;
using Trackly.Repositories.TvSeries;
using Trackly.Utils.Exceptions;

namespace Trackly.Services.Movies
{
    public class TvSerieService
    {
        private readonly TvSerieRepository _tvSerieRepository;
        private readonly ImageService _imgService;

        public TvSerieService(TvSerieRepository tvSerieRepository, ImageService imageService) 
        {
            _tvSerieRepository = tvSerieRepository;
            _imgService = imageService; 
        }
            
        public async Task<IEnumerable<TvSerie>> GetTvSeries()
        {
            var tvSeries = await _tvSerieRepository.GetTvSeries();

            var result = new List<TvSerie>();
            foreach (var ts in tvSeries)
            {
                var tvSerie = await SetValues(ts);
                result.Add(tvSerie);
            }

            return result;
        }

        public async Task<TvSerie?> GetTvSerie(int id)
        {
            var result = await _tvSerieRepository.GetTvSerie(id);
            if (result == null) throw new NotFoundException();
            result = await SetValues(result);
            return result;
        }

        public async Task<TvSerie> AddTvSerie(TvSerie tvSerie)
        {
            tvSerie.Id = 0;
            if ((await _tvSerieRepository.GetTvSeries(title: tvSerie.Title)).Any())
                throw new TvSerieExistException();
            return await _tvSerieRepository.AddTvSerie(tvSerie);
        }

        public async Task<TvSerie> UpdateTvSerie(TvSerie tvSerie)
        {
            var s = await _tvSerieRepository.GetTvSerie(tvSerie.Id);
            if (s == null) throw new TvSerieNotExistException();

            if ((await _tvSerieRepository.GetTvSeries(idNot: tvSerie.Id, title: tvSerie.Title)).Any())
                throw new TvSerieExistException();

            var result = await _tvSerieRepository.UpdateTvSerie(tvSerie);
            if (result == null) throw new NotFoundException();

            return result!;
        }

        public async Task DeleteTvSerie(int id)
        {
            var s = await _tvSerieRepository.GetTvSerie(id);
            if (s == null) throw new NotFoundException();
            await _tvSerieRepository.DeleteTvSerie(s);
        }

        private async Task<TvSerie> SetValues(TvSerie tvSerie)
        {
            tvSerie.Image = (await _imgService.GetImage(tvSerie.ImageId));
            return tvSerie;
        }
    }
}
