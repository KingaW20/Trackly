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
    public class UserPaymentMethodController : BaseController
    {
        private readonly UserPaymentMethodService _upmService;
        private readonly UserManager<AppUser> _userManager;

        public UserPaymentMethodController(UserPaymentMethodService userPaymentMethodService, UserManager<AppUser> userManager)
        {
            _upmService = userPaymentMethodService;
            _userManager = userManager;
        }

        // GET: api/UserPaymentMethod
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserPaymentMethod>>> GetUserPaymentMethods()
        {
            try
            {
                string userId = GetUserId();
                return Ok(await _upmService.GetUserPaymentMethods(userId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // GET: api/UserPaymentMethod/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserPaymentMethod>> GetUserPaymentMethod(int id)
        {
            try
            {
                string userId = GetUserId();
                return (await _upmService.GetUserPaymentMethod(id, userId))!;
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // POST: api/UserPaymentMethod
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<UserPaymentMethod>> PostUserPaymentMethod(UserPaymentMethod userPaymentMethod)
        {
            try
            {
                userPaymentMethod.UserId = GetUserId();
                await _upmService.AddUserPaymentMethod(userPaymentMethod);
                return Ok(await _upmService.GetUserPaymentMethods(userPaymentMethod.UserId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // PUT: api/UserPaymentMethod/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserPaymentMethod(int id, UserPaymentMethod userPaymentMethod)
        {
            if (id != userPaymentMethod.Id)
                return BadRequest();

            try
            {
                userPaymentMethod.UserId = GetUserId();
                await _upmService.UpdateUserPaymentMethod(userPaymentMethod);
                return Ok(await _upmService.GetUserPaymentMethods(userPaymentMethod.UserId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // DELETE: api/UserPaymentMethod/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserPaymentMethod(int id)
        {
            try
            {
                string userId = GetUserId();
                await _upmService.DeleteUserPaymentMethod(id, userId);
                return Ok(await _upmService.GetUserPaymentMethods(userId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }
    }
}
