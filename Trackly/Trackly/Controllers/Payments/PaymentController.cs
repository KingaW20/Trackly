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
    public class PaymentController : BaseController
    {
        private readonly PaymentService _pService;
        private readonly UserManager<AppUser> _userManager;

        public PaymentController(PaymentService paymentService, UserManager<AppUser> userManager)
        {
            _pService = paymentService;
            _userManager = userManager;
        }

        // GET: api/Payment
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            try
            {
                string userId = GetUserId();
                return Ok(await _pService.GetPayments(userId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // GET: api/Payment/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            try
            {
                string userId = GetUserId();
                return (await _pService.GetPayment(id, userId))!;
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // POST: api/Payment
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Payment>> PostPayment(Payment payment)
        {
            try
            {
                string userId = GetUserId();
                await _pService.AddPayment(payment, userId);

                //To refresh the list return the context of Payments
                return Ok(await _pService.GetPayments(userId));
                //return CreatedAtAction("GetPayment", new { id = payment.PaymentId }, payment);
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // PUT: api/Payment/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutPayment(int id, Payment payment)
        {
            if (id != payment.Id)
                return BadRequest();

            try
            {
                string userId = GetUserId();
                await _pService.UpdatePayment(payment, userId);
                return Ok(await _pService.GetPayments(userId: userId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // DELETE: api/Payment/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePayment(int id)
        {
            try
            {
                string userId = GetUserId();
                await _pService.DeletePayment(id, userId);
                return Ok(await _pService.GetPayments(userId: userId));
            }
            catch (Exception ex) { return await HandleError(ex); }
        }
    }
}
