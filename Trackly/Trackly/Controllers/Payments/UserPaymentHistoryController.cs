using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Trackly.Models;
using Trackly.Models.Payments;
using Trackly.Services.Payments;

namespace Trackly.Controllers.Payments
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPaymentHistoryController : BaseController
    {
        private readonly UserPaymentHistoryService _uphService;
        private readonly UserManager<AppUser> _userManager;

        public UserPaymentHistoryController(UserPaymentHistoryService userPaymentHistoryService, UserManager<AppUser> userManager)
        {
            _uphService = userPaymentHistoryService;
            _userManager = userManager;
        }

        // GET: api/UserPaymentHistory
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserPaymentHistory>>> GetUserPaymentHistories()
        {
            try
            {
                string userId = GetUserId();
                return Ok(await _uphService.GetUserPaymentHistories(userId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // GET: api/UserPaymentHistory/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserPaymentHistory>> GetUserPaymentHistory(int id)
        {
            try
            {
                string userId = GetUserId();
                return (await _uphService.GetUserPaymentHistory(id, userId))!;
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // POST: api/UserPaymentHistory
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserPaymentHistory>> PostUserPaymentHistory(UserPaymentHistory userPaymentHistory)
        {
            try
            {
                string userId = GetUserId();
                await _uphService.AddUserPaymentHistory(userPaymentHistory, userId);
                return Ok(await _uphService.GetUserPaymentHistories(userId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // PUT: api/UserPaymentHistory/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserPaymentHistory(int id, UserPaymentHistory userPaymentHistory)
        {
            if (id != userPaymentHistory.Id)
                return BadRequest();

            try
            {
                string userId = GetUserId();
                await _uphService.UpdateUserPaymentHistory(userPaymentHistory, userId);
                return Ok(await _uphService.GetUserPaymentHistories(userId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // DELETE: api/UserPaymentHistory/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserPaymentHistory(int id)
        {
            try
            {
                string userId = GetUserId();
                await _uphService.DeleteUserPaymentHistory(id, userId);
                return Ok(await _uphService.GetUserPaymentHistories(userId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }
    }
}
