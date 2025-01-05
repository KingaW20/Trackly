using Trackly.Repositories;
using Trackly.Repositories.Movies;
using Trackly.Repositories.Payments;
using Trackly.Repositories.TvSeries;
using Trackly.Services;
using Trackly.Services.Movies;
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
            services.AddScoped<UserPaymentHistoryRepository>();
            services.AddScoped<PaymentRepository>();

            services.AddScoped<ImageRepository>();

            services.AddScoped<MovieRepository>();
            services.AddScoped<TvSerieRepository>();
            services.AddScoped<TvSerieEpisodeRepository>();
            services.AddScoped<UserProgramRepository>();

            return services;
        }
        public static IServiceCollection InjectServices(this IServiceCollection services)
        {
            services.AddScoped<PaymentCategoryService>();
            services.AddScoped<PaymentMethodService>();
            services.AddScoped<UserPaymentMethodService>();
            services.AddScoped<UserPaymentHistoryService>();
            services.AddScoped<PaymentService>();

            services.AddScoped<ImageService>();

            services.AddScoped<MovieService>();
            services.AddScoped<TvSerieService>();
            services.AddScoped<TvSerieEpisodeService>();
            services.AddScoped<UserProgramService>();

            return services;
        }
    }
}
