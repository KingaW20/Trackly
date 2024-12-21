using Trackly.Models.Movies;
using Trackly.Repositories.Movies;
using Trackly.Utils.Exceptions;

namespace Trackly.Services.Movies
{
    public class MovieService
    {
        private readonly MovieRepository _mRepository;
        private readonly ImageService _imgService;

        public MovieService(MovieRepository movieRepository, ImageService imageService)
        {
            _mRepository = movieRepository;
            _imgService = imageService;
        }

        public async Task<IEnumerable<Movie>> GetMovies()
        {
            var movies = await _mRepository.GetMovies();

            var result = new List<Movie>();
            foreach (var m in movies)
            {
                var movie = await SetValues(m);
                result.Add(movie);
            }
              
            return result;
        }

        public async Task<Movie?> GetMovie(int id)
        {
            var result = await _mRepository.GetMovie(id);
            if (result == null) throw new NotFoundException();
            result = await SetValues(result);
            return result;
        }

        public async Task<Movie> AddMovie(Movie movie)
        {
            movie.Id = 0;
            if ((await _mRepository.GetMovies(title: movie.Title)).Any())
                throw new MovieExistException();
            return await _mRepository.AddMovie(movie);
        }

        public async Task<Movie> UpdateMovie(Movie movie)
        {
            var m = await _mRepository.GetMovie(movie.Id);
            if (m == null) throw new MovieNotExistException();

            if ((await _mRepository.GetMovies(idNot: movie.Id, title: movie.Title)).Any())
                throw new MovieExistException();

            var result = await _mRepository.UpdateMovie(movie);
            if (result == null) throw new NotFoundException();

            return result!;
        }

        public async Task DeleteMovie(int id)
        {
            var m = await _mRepository.GetMovie(id);
            if (m == null) throw new NotFoundException();
            await _mRepository.DeleteMovie(m);
        }

        private async Task<Movie> SetValues(Movie movie)
        {
            movie.Image = (await _imgService.GetImage(movie.ImageId));
            return movie;
        }
    }
}
