using Microsoft.EntityFrameworkCore;

namespace Trackly.Models.Contexts
{
    public class ImageContext : DbContext
    {
        public ImageContext(DbContextOptions<ImageContext> options) : base(options) { }

        public DbSet<Image> Images { get; set; }
    }
}
