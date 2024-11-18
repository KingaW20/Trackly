using Microsoft.AspNetCore.Authorization;
using static Trackly.Constants;

namespace Trackly.Controllers
{
    public static class AuthorizationDemoEndpoints
    {
        public static IEndpointRouteBuilder MapAuthorizationDemoEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet(Paths.AdminOnly, AdminOnly);

            app.MapGet(Paths.AdminOrTeacher, 
                [Authorize(Roles = Roles.Admin + "," + Roles.Teacher)] () => 
                { return "Admin Or Teacher"; });

            app.MapGet(Paths.LibraryMembersOnly, 
                [Authorize(Policy = Policies.HasLibraryId)] () => 
                { return "Library members only"; });

            app.MapGet(Paths.ApplyForMaternityLeave, 
                [Authorize(Roles = Roles.Teacher, Policy = Policies.FemalesOnly)] () => 
                { return "Applied for maternity leave"; });

            app.MapGet(Paths.Under10sAndFemale, 
                [Authorize(Policy = Policies.Under10)] [Authorize(Policy = Policies.FemalesOnly)] () =>
                { return "Under 10 and Female"; });

            return app;
        }

        [Authorize(Roles = Roles.Admin)]
        private static string AdminOnly()
        {
            return "Admin Only";
        }
    }
}
