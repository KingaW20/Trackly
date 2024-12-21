using Microsoft.AspNetCore.Mvc;
using Trackly.Models.Movies;
using Trackly.Services.Movies;

namespace Trackly.Controllers.Movies
{
    [Route("api/[controller]")]
    [ApiController]
    public class TvSerieEpisodeController : BaseController
    {
        private readonly TvSerieEpisodeService _tseService;

        public TvSerieEpisodeController(TvSerieEpisodeService tvSerieEpisodeService)
        {
            _tseService = tvSerieEpisodeService;
        }

        // GET: api/TvSerieEpisode
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TvSerieEpisode>>> GetTvSerieEpisodes()
        {
            try
            {
                return Ok(await _tseService.GetTvSerieEpisodes());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // GET: api/TvSerieEpisode/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TvSerieEpisode>> GetTvSerieEpisode(int id)
        {
            try
            {
                return (await _tseService.GetTvSerieEpisode(id))!;
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // POST: api/TvSerieEpisode
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TvSerieEpisode>> PostTvSerieEpisode(TvSerieEpisode tvSerieEpisode)
        {
            try
            {
                await _tseService.AddTvSerieEpisode(tvSerieEpisode);
                return Ok(await _tseService.GetTvSerieEpisodes());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // PUT: api/TvSerieEpisode/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTvSerieEpisode(int id, TvSerieEpisode tvSerieEpisode)
        {
            if (id != tvSerieEpisode.Id)
                return BadRequest();

            try
            {
                var result = await _tseService.UpdateTvSerieEpisode(tvSerieEpisode);
                return Ok(await _tseService.GetTvSerieEpisodes());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // DELETE: api/TvSerieEpisode/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTvSerieEpisode(int id)
        {
            try
            {
                await _tseService.DeleteTvSerieEpisode(id);
                return Ok(await _tseService.GetTvSerieEpisodes());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }
    }
}
