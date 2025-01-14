﻿using Microsoft.EntityFrameworkCore;
using Trackly.Models.Contexts;
using Trackly.Utils;

namespace Trackly.Extensions
{
    public static class EFCoreExtensions
    {
        public static IServiceCollection InjectDbContexts(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<AppDbContext>(
                options => options.UseSqlServer(config.GetConnectionString(Constants.Settings.DevConnection)));

            //Payment Model - dependency injection to connect to db
            services.AddDbContext<PaymentContext>(
                options => options.UseSqlServer(config.GetConnectionString(Constants.Settings.DevConnection)));

            services.AddDbContext<ImageContext>(
                options => options.UseSqlServer(config.GetConnectionString(Constants.Settings.DevConnection)));

            services.AddDbContext<MovieContext>(
                options => options.UseSqlServer(config.GetConnectionString(Constants.Settings.DevConnection)));

            return services;
        }

    }
}
