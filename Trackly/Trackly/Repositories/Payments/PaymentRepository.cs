using Microsoft.EntityFrameworkCore;
using Trackly.Models.Contexts;
using Trackly.Models.Payments;

namespace Trackly.Repositories.Payments
{
    public class PaymentRepository
    {
        private readonly PaymentContext _context;

        public PaymentRepository(PaymentContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Payment>> GetPayments(List<int>? userPaymentMethodIds = null)
        {
            var query = _context.Payments.AsQueryable();

            if (userPaymentMethodIds != null && userPaymentMethodIds.Any())
                query = query.Where(p => userPaymentMethodIds.Contains(p.UserPaymentMethodId));

            // sorting from newest to oldest
            var payments = await query
                .OrderByDescending(p => p.Date)
                .ToListAsync();

            return payments;
        }

        public async Task<Payment?> GetPayment(int id)
        {
            return await _context.Payments.FindAsync(id);
        }

        public async Task<Payment> AddPayment(Payment payment)
        {
            var result = await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Payment?> UpdatePayment(Payment payment)
        {
            _context.ChangeTracker.Clear();
            _context.Entry(payment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task DeletePayment(Payment payment)
        {
            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
        }
    }
}
