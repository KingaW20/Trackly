using Microsoft.EntityFrameworkCore;
using Trackly.Models.Contexts;
using Trackly.Models.Payments;

namespace Trackly.Repositories.Payments
{
    public class PaymentMethodRepository
    {
        private readonly PaymentContext _context;

        public PaymentMethodRepository(PaymentContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PaymentMethod>> GetPaymentMethods(int? idNot = null, string? name = null)
        {
            var query = _context.PaymentMethods.AsQueryable();

            if (idNot != null)
                query = query.Where(pm => pm.Id != idNot);

            if (!string.IsNullOrEmpty(name))
                query = query.Where(pm => pm.Name == name);

            return await query.ToListAsync();
        }

        public async Task<PaymentMethod?> GetPaymentMethod(int id)
        {
            return await _context.PaymentMethods.FindAsync(id);
        }

        public async Task<PaymentMethod> AddPaymentMethod(PaymentMethod paymentMethod)
        {
            var result = await _context.PaymentMethods.AddAsync(paymentMethod);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<PaymentMethod?> UpdatePaymentMethod(PaymentMethod paymentMethod)
        {
            _context.ChangeTracker.Clear();
            _context.Entry(paymentMethod).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return paymentMethod;
        }

        public async Task DeletePaymentMethod(PaymentMethod paymentMethod)
        {
            _context.PaymentMethods.Remove(paymentMethod);
            await _context.SaveChangesAsync();
        }
    }
}
