using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Trackly.Models;

namespace Trackly.Controllers
{
    public static class AccountEndpoints
    {
        public static IEndpointRouteBuilder MapAccountEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet(Constants.Paths.UserProfile, GetUserProfile);

            return app;
        }

        //To get the user id we use claims principal defined in SignIn function in IdentityUserEndpoints
        [Authorize]
        private static async Task<IResult> GetUserProfile(ClaimsPrincipal user, UserManager<AppUser> userManager)
        {
            string userID = user.Claims.First(x => x.Type == Constants.Claims.UserID).Value;
            var userDetails = await userManager.FindByIdAsync(userID);
            return Results.Ok(new 
            { 
                Email = userDetails?.Email,
                FullName = userDetails?.FullName
            });
        }
    }
}
