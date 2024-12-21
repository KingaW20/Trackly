using Microsoft.AspNetCore.Mvc;
using Trackly.Models.Movies;
using Trackly.Services.Movies;

namespace Trackly.Controllers.Movies
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : BaseController
    {
        private readonly MovieService _mService;

        public MovieController(MovieService movieService)
        {
            _mService = movieService;
        }

        // GET: api/Movie
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
        {
            try
            {
                return Ok(await _mService.GetMovies());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // GET: api/Movie/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovie(int id)
        {
            try
            {
                return (await _mService.GetMovie(id))!;
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // POST: api/Movie
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Movie>> PostMovie(Movie movie)
        {
            try
            {
                await _mService.AddMovie(movie);
                return Ok(await _mService.GetMovies());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // PUT: api/Movie/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovie(int id, Movie movie)
        {
            if (id != movie.Id)
                return BadRequest();

            try
            {
                var result = await _mService.UpdateMovie(movie);
                return Ok(await _mService.GetMovies());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // DELETE: api/Movie/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            try
            {
                await _mService.DeleteMovie(id);
                return Ok(await _mService.GetMovies());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }
    }
}
