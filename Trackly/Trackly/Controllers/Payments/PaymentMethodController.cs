using Microsoft.AspNetCore.Mvc;
using Trackly.Models.Payments;
using Trackly.Services.Payments;

namespace Trackly.Controllers.Payments
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentMethodController : BaseController
    {
        private readonly PaymentMethodService _pmService;

        public PaymentMethodController(PaymentMethodService pmService)
        {
            _pmService = pmService;
        }

        // GET: api/PaymentMethod
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentMethod>>> GetPaymentMethods()
        {
            try
            {
                return Ok(await _pmService.GetPaymentMethods());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // GET: api/PaymentMethod/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentMethod>> GetPaymentMethod(int id)
        {
            try
            {
                return (await _pmService.GetPaymentMethod(id))!;
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // POST: api/PaymentMethod
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymentMethod>> PostPaymentMethod(PaymentMethod paymentMethod)
        {
            try
            {
                await _pmService.AddPaymentMethod(paymentMethod);
                return Ok(await _pmService.GetPaymentMethods());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // PUT: api/PaymentMethod/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymentMethod(int id, PaymentMethod paymentMethod)
        {
            if (id != paymentMethod.Id)
                return BadRequest();

            try
            {
                var result = await _pmService.UpdatePaymentMethod(paymentMethod);
                return Ok(await _pmService.GetPaymentMethods());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // DELETE: api/PaymentMethod/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymentMethod(int id)
        {
            try
            {
                await _pmService.DeletePaymentMethod(id);
                return Ok(await _pmService.GetPaymentMethods());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }
    }
}
