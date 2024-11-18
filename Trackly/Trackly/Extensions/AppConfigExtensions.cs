using Trackly.Models;

namespace Trackly.Extensions
{
    public static class AppConfigExtensions
    {
        public static WebApplication ConfigCORS(this WebApplication app, IConfiguration config)
        {
            //To allow calls from the frontend 
            app.UseCors(options => 
                options.WithOrigins(Constants.Paths.FrontBasicURL)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
            );

            return app;
        }

        public static IServiceCollection AddAppConfig(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<AppSettings>(config.GetSection(Constants.Settings.AppSettings));

            return services;
        }
    }
}
