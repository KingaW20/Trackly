using Trackly.Controllers;
using Trackly.Extensions;
using Trackly.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

//Extensions used
builder.Services.AddSwaggerExplorer()
                .InjectDbContexts(builder.Configuration)
                .AddAppConfig(builder.Configuration)
                .AddIdentityHandlersAndStores()
                .ConfigureIdentityOptions()                
                .AddIdentityAuth(builder.Configuration);

var app = builder.Build();

//More info: https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/?view=aspnetcore-9.0
app.ConfigureSwaggerExplorer()
   .ConfigCORS(builder.Configuration)
   .AddIdentityAuthMiddlewares();

app.MapControllers();

app.MapGroup("/api")
   .MapIdentityApi<AppUser>();

app.MapGroup("/api")
   .MapIdentityUserEndpoints()
   .MapAccountEndpoints()
   .MapAuthorizationDemoEndpoints();

app.Run();
