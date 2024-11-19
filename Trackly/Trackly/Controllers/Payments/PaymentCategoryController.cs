using Microsoft.AspNetCore.Mvc;
using Trackly.Models.Payments;
using Trackly.Services.Payments;

namespace Trackly.Controllers.Payments
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentCategoryController : BaseController
    {
        private readonly PaymentCategoryService _pcService;

        public PaymentCategoryController(PaymentCategoryService pcService)
        {
            _pcService = pcService;
        }

        // GET: api/PaymentCategory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentCategory>>> GetPaymentCategories()
        {
            try
            {
                return Ok(await _pcService.GetPaymentCategories());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // GET: api/PaymentCategory/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentCategory>> GetPaymentCategory(int id)
        {
            try
            {
                return (await _pcService.GetPaymentCategory(id))!;
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // POST: api/PaymentCategory
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymentCategory>> PostPaymentCategory(PaymentCategory paymentCategory)
        {
            try
            {
                await _pcService.AddPaymentCategory(paymentCategory);
                return Ok(await _pcService.GetPaymentCategories());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // PUT: api/PaymentCategory/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymentCategory(int id, PaymentCategory paymentCategory)
        {
            if (id != paymentCategory.Id)
                return BadRequest();

            try
            {   
                var result = await _pcService.UpdatePaymentCategory(paymentCategory);
                return Ok(await _pcService.GetPaymentCategories());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }

        // DELETE: api/PaymentCategory/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymentCategory(int id)
        {
            try
            {
                await _pcService.DeletePaymentCategory(id);
                return Ok(await _pcService.GetPaymentCategories());
            }
            catch (Exception ex) { return await HandleError(ex); }
        }        
    }
}
