using Microsoft.EntityFrameworkCore;
using Trackly.Models.Contexts;
using Trackly.Models.Movies;

namespace Trackly.Repositories.Movies
{
    public class UserProgramRepository
    {
        private readonly MovieContext _context;

        public UserProgramRepository(MovieContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserProgram>> GetUserPrograms(
            int? idNot = null, string? userId = null, int? programId = null, DateOnly? date = null)
        {
            var query = _context.UserPrograms.AsQueryable();

            if (idNot != null && idNot != 0)
                query = query.Where(up => up.Id != idNot);

            if (!string.IsNullOrEmpty(userId))
                query = query.Where(up => up.UserId == userId);

            if (programId != null && programId != 0)
                query = query.Where(up => up.ProgramId == programId);

            if (programId != null && programId != 0)
                query = query.Where(up => up.ProgramId == programId);

            if (date != null)
                query = query.Where(up => up.Date == date);

            return await query.ToListAsync();
        }

        public async Task<UserProgram?> GetUserProgram(int id)
        {
            return await _context.UserPrograms.FindAsync(id);
        }

        public async Task<UserProgram> AddUserProgram(UserProgram userProgram)
        {
            var result = await _context.UserPrograms.AddAsync(userProgram);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<UserProgram?> UpdateUserProgram(UserProgram userProgram)
        {
            _context.ChangeTracker.Clear();
            _context.Entry(userProgram).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return userProgram;
        }

        public async Task DeleteUserProgram(UserProgram userProgram)
        {
            _context.UserPrograms.Remove(userProgram);
            await _context.SaveChangesAsync();
        }
    }
}
