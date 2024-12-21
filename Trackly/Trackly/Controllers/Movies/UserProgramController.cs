using Microsoft.AspNetCore.Mvc;
using Trackly.Models.Movies;
using Trackly.Services.Movies;

namespace Trackly.Controllers.Movies
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProgramController : BaseController
    {
        private readonly UserProgramService _upService;

        public UserProgramController(UserProgramService userProgramService)
        {
            _upService = userProgramService;
        }

        // GET: api/UserProgram
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserProgram>>> GetUserPrograms()
        {
            try
            {
                string userId = GetUserId();
                return Ok(await _upService.GetUserPrograms(userId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // GET: api/UserProgram/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserProgram>> GetUserProgram(int id)
        {
            try
            {
                string userId = GetUserId();
                return (await _upService.GetUserProgram(id, userId))!;
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // POST: api/UserProgram
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserProgram>> PostUserProgram(UserProgram userProgram)
        {
            try
            {
                userProgram.UserId = GetUserId();
                await _upService.AddUserProgram(userProgram);
                return Ok(await _upService.GetUserPrograms(userProgram.UserId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // PUT: api/UserProgram/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserProgram(int id, UserProgram userProgram)
        {
            if (id != userProgram.Id)
                return BadRequest();

            try
            {
                string userId = GetUserId();
                await _upService.UpdateUserProgram(userProgram, userId);
                return Ok(await _upService.GetUserPrograms(userProgram.UserId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // DELETE: api/UserProgram/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserProgram(int id)
        {
            try
            {
                string userId = GetUserId();
                await _upService.DeleteUserProgram(id, userId);
                return Ok(await _upService.GetUserPrograms(userId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }
    }
}
