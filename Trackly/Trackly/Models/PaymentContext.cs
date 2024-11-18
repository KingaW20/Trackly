using Microsoft.EntityFrameworkCore;

namespace Trackly.Models
{
    public class PaymentContext : DbContext
    {
        public PaymentContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Payment> Payments { get; set; }
    }
}
