using Microsoft.AspNetCore.Mvc;
using Trackly.Models;
using Trackly.Services;

namespace Trackly.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : BaseController
    {
        private readonly ImageService _imgService;

        public ImageController(ImageService imageService)
        {
            _imgService = imageService;
        }

        // GET: api/Image
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Image>>> GetImages()
        {
            try
            {
                return Ok(await _imgService.GetImages());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // GET: api/Image/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Image>> GetImage(int id)
        {
            try
            {
                return (await _imgService.GetImage(id))!;
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // POST: api/Image
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Image>> PostImage(Image image)
        {
            try
            {
                await _imgService.AddImage(image);
                return Ok(await _imgService.GetImages());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }
    }
}
