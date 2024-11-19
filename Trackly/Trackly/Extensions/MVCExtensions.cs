using Trackly.Repositories.Payments;
using Trackly.Services.Payments;

namespace Trackly.Extensions
{
    public static class MVCExtensions
    {
        public static IServiceCollection InjectRepositories(this IServiceCollection services)
        {

            services.AddScoped<PaymentCategoryRepository>();
            services.AddScoped<PaymentMethodRepository>();
            services.AddScoped<UserPaymentMethodRepository>();
            services.AddScoped<PaymentRepository>();

            return services;
        }
        public static IServiceCollection InjectServices(this IServiceCollection services)
        {
            services.AddScoped<PaymentCategoryService>();
            services.AddScoped<PaymentMethodService>();
            services.AddScoped<UserPaymentMethodService>();
            services.AddScoped<PaymentService>();

            return services;
        }
    }
}
