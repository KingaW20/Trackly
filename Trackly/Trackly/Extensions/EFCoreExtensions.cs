using Microsoft.EntityFrameworkCore;
using Trackly.Models;

namespace Trackly.Extensions
{
    public static class EFCoreExtensions
    {
        public static IServiceCollection InjectDbContexts(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<AppDbContext>(
                options => options.UseSqlServer(config.GetConnectionString("DevConnection")));

            //Payment Model - dependency injection to connect to db
            services.AddDbContext<PaymentContext>(
                options => options.UseSqlServer(config.GetConnectionString("DevConnection")));

            return services;
        }

    }
}
