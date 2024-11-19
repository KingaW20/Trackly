using Microsoft.EntityFrameworkCore;
using Trackly.Models.Payments;

namespace Trackly.Models.Contexts
{
    public class PaymentContext : DbContext
    {
        public PaymentContext(DbContextOptions options) : base(options) { }

        public DbSet<Payment> Payments { get; set; }
        public DbSet<PaymentCategory> PaymentCategories { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<UserPaymentMethod> UserPaymentMethods { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<PaymentMethod>()
                .HasIndex(pm => pm.Name)
                .IsUnique();

            modelBuilder.Entity<PaymentCategory>()
                .HasIndex(pm => pm.Name)
                .IsUnique();

            modelBuilder.Entity<UserPaymentMethod>()
                .HasIndex(upm => new { upm.UserId, upm.PaymentMethodId })
                .IsUnique();
        }
    }
}
