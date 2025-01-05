using Microsoft.EntityFrameworkCore;
using Trackly.Models.Contexts;
using Trackly.Models.Payments;

namespace Trackly.Repositories.Payments
{
    public class UserPaymentHistoryRepository
    {
        private readonly PaymentContext _context;

        public UserPaymentHistoryRepository(PaymentContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserPaymentHistory>> GetUserPaymentHistories(int? idNot = null, List<int>? userPaymentMethodIds = null)
        {
            var query = _context.UserPaymentHistories.AsQueryable();

            if (idNot != null && idNot != 0)
                query = query.Where(uph => uph.Id != idNot);

            if (userPaymentMethodIds != null && userPaymentMethodIds.Count() > 0)
                query = query.Where(uph => userPaymentMethodIds.Contains(uph.UserPaymentMethodId));

            return await query.ToListAsync();
        }

        public async Task<UserPaymentHistory?> GetUserPaymentHistory(int id)
        {
            return await _context.UserPaymentHistories.FindAsync(id);
        }

        public async Task<UserPaymentHistory> AddUserPaymentHistory(UserPaymentHistory userPaymentHistory)
        {
            var result = await _context.UserPaymentHistories.AddAsync(userPaymentHistory);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<UserPaymentHistory?> UpdateUserPaymentHistory(UserPaymentHistory userPaymentHistory)
        {
            _context.ChangeTracker.Clear();
            _context.Entry(userPaymentHistory).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return userPaymentHistory;
        }

        public async Task DeleteUserPaymentHistory(UserPaymentHistory userPaymentHistory)
        {
            _context.UserPaymentHistories.Remove(userPaymentHistory);
            await _context.SaveChangesAsync();
        }
    }
}
