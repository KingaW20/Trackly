using Microsoft.EntityFrameworkCore;
using Trackly.Models.Contexts;
using Trackly.Models.Payments;

namespace Trackly.Repositories.Payments
{
    public class UserPaymentMethodRepository
    {
        private readonly PaymentContext _context;

        public UserPaymentMethodRepository(PaymentContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserPaymentMethod>> GetUserPaymentMethods(
            int? idNot = null, string? userId = null, int? paymentMethodId = null)
        {
            var query = _context.UserPaymentMethods.AsQueryable();

            if (idNot != null && idNot != 0)
                query = query.Where(upm => upm.Id != idNot);

            if (!string.IsNullOrEmpty(userId))
                query = query.Where(upm => upm.UserId == userId);

            if (paymentMethodId != 0 && paymentMethodId != null)
                query = query.Where(upm => upm.PaymentMethodId == paymentMethodId);

            return await query.ToListAsync();
        }

        public async Task<UserPaymentMethod?> GetUserPaymentMethod(int id)
        {
            return await _context.UserPaymentMethods.FindAsync(id);
        }

        public async Task<UserPaymentMethod> AddUserPaymentMethod(UserPaymentMethod userPaymentMethod)
        {
            var result = await _context.UserPaymentMethods.AddAsync(userPaymentMethod);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<UserPaymentMethod?> UpdateUserPaymentMethod(UserPaymentMethod userPaymentMethod)
        {
            _context.ChangeTracker.Clear();
            _context.Entry(userPaymentMethod).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return userPaymentMethod;
        }

        public async Task DeleteUserPaymentMethod(UserPaymentMethod userPaymentMethod)
        {
            _context.UserPaymentMethods.Remove(userPaymentMethod);
            await _context.SaveChangesAsync();
        }
    }
}
