using Microsoft.AspNetCore.Mvc;
using Trackly.Models.Movies;
using Trackly.Services.Movies;

namespace Trackly.Controllers.Movies
{
    [Route("api/[controller]")]
    [ApiController]
    public class TvSerieController : BaseController
    {
        private readonly TvSerieService _tsService;

        public TvSerieController(TvSerieService tvSerieService)
        {
            _tsService = tvSerieService;
        }

        // GET: api/TvSerie
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TvSerie>>> GetTvSeries()
        {
            try
            {
                return Ok(await _tsService.GetTvSeries());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // GET: api/TvSerie/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TvSerie>> GetTvSerie(int id)
        {
            try
            {
                return (await _tsService.GetTvSerie(id))!;
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // POST: api/TvSerie
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TvSerie>> PostTvSerie(TvSerie tvSerie)
        {
            try
            {
                await _tsService.AddTvSerie(tvSerie);
                return Ok(await _tsService.GetTvSeries());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // PUT: api/TvSerie/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTvSerie(int id, TvSerie tvSerie)
        {
            if (id != tvSerie.Id)
                return BadRequest();

            try
            {
                var result = await _tsService.UpdateTvSerie(tvSerie);
                return Ok(await _tsService.GetTvSeries());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // DELETE: api/TvSerie/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTvSerie(int id)
        {
            try
            {
                await _tsService.DeleteTvSerie(id);
                return Ok(await _tsService.GetTvSeries());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }
    }
}
