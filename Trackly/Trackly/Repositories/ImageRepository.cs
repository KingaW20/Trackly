using Microsoft.EntityFrameworkCore;
using Trackly.Models;
using Trackly.Models.Contexts;

namespace Trackly.Repositories
{
    public class ImageRepository
    {
        private readonly ImageContext _context;

        public ImageRepository(ImageContext context) { 
            _context = context;
        }
        public async Task<IEnumerable<Image>> GetImages(int? idNot = null)
        {
            var query = _context.Images.AsQueryable();

            if (idNot != null && idNot != 0)
                query = query.Where(pc => pc.Id != idNot);

            return await query.ToListAsync();
        }

        public async Task<Image?> GetImage(int? id)
        {
            return await _context.Images.FindAsync(id);
        }

        public async Task<Image> AddImage(Image task)
        {
            var result = await _context.Images.AddAsync(task);
            await _context.SaveChangesAsync();
            return result.Entity;
        }
    }
}
