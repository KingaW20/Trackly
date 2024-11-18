using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Trackly.Models;

namespace Trackly.Extensions
{
    public static class IdentityExtensions
    {
        public static IServiceCollection AddIdentityHandlersAndStores(this IServiceCollection services)
        {
            //To register users - services from Identity Core
            services.AddIdentityApiEndpoints<AppUser>()
                    .AddRoles<IdentityRole>()
                    .AddEntityFrameworkStores<AppDbContext>();

            return services;
        }

        public static IServiceCollection ConfigureIdentityOptions(this IServiceCollection services)
        {
            //To change default password options
            //Options: https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-configuration?view=aspnetcore-8.0
            services.Configure<IdentityOptions>(options =>
                {
                    options.Password.RequireDigit = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireLowercase = false;
                    options.User.RequireUniqueEmail = true;
                });

            return services;
        }

        //Auth = Authentication + Authorization
        public static IServiceCollection AddIdentityAuth(this IServiceCollection services, IConfiguration config)
        {
            //More info: https://learn.microsoft.com/en-us/aspnet/core/security/authentication/?view=aspnetcore-9.0
            //Options: https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authentication.authenticationoptions?view=aspnetcore-9.0

            //To Make Authorization (pass the token in the Auth section of request
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(y =>
                    {
                        y.SaveToken = false;
                        y.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["AppSettings:JWTSecret"]!)),
                            ValidateIssuer = false,
                            ValidateAudience = false,
                            ValidateLifetime = true,        //Token expiration validation
                            ClockSkew = TimeSpan.Zero
                        };
                    });

            services.AddAuthorization(options =>
            {
                options.FallbackPolicy = new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser()
                    .Build();

                //Creating policies - combining roles and claims conditions
                options.AddPolicy("HasLibraryId", policy => policy.RequireClaim("libraryID"));
                options.AddPolicy("FemalesOnly", policy => policy.RequireClaim("gender", "Female"));
                options.AddPolicy("Under10", policy => policy.RequireAssertion(context => 
                    Int32.Parse(context.User.Claims.First(x => x.Type == "age").Value) < 10
                ));
            });

            return services;
        }

        public static WebApplication AddIdentityAuthMiddlewares(this WebApplication app)
        {
            app.UseAuthentication();
            app.UseAuthorization();

            return app;
        }
    }
}
