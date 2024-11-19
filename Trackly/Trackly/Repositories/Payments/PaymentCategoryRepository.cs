using Microsoft.EntityFrameworkCore;
using Trackly.Models.Contexts;
using Trackly.Models.Payments;

namespace Trackly.Repositories.Payments
{
    public class PaymentCategoryRepository
    {
        private readonly PaymentContext _context;

        public PaymentCategoryRepository(PaymentContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PaymentCategory>> GetPaymentCategories(int? idNot = null, string? name = null)
        {
            var query = _context.PaymentCategories.AsQueryable();

            if (idNot != null && idNot != 0)
                query = query.Where(pc => pc.Id != idNot);

            if (!string.IsNullOrEmpty(name))
                query = query.Where(pc => pc.Name == name);

            return await query.ToListAsync();
        }

        public async Task<PaymentCategory?> GetPaymentCategory(int id)
        {
            return await _context.PaymentCategories.FindAsync(id);
        }

        public async Task<PaymentCategory> AddPaymentCategory(PaymentCategory paymentCategory)
        {
            var result = await _context.PaymentCategories.AddAsync(paymentCategory);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<PaymentCategory?> UpdatePaymentCategory(PaymentCategory paymentCategory)
        {
            _context.ChangeTracker.Clear();
            _context.Entry(paymentCategory).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return paymentCategory;
        }

        public async Task DeletePaymentCategory(PaymentCategory paymentCategory)
        {
            _context.PaymentCategories.Remove(paymentCategory);
            await _context.SaveChangesAsync();
        }
    }
}
