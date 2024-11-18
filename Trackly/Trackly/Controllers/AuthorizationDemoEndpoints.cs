using Microsoft.AspNetCore.Authorization;
using static Trackly.Constants;

namespace Trackly.Controllers
{
    public static class AuthorizationDemoEndpoints
    {
        public static IEndpointRouteBuilder MapAuthorizationDemoEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet(Paths.AdminOnly, AdminOnly);

            return app;
        }

        [Authorize(Roles = Roles.Admin)] 
        private static string AdminOnly() { return "Admin Only"; }


        //[Authorize(Roles = Roles.Admin + "," + Roles.Teacher)] 
        //private static string AdminOrTeacher() { return "Admin Or Teacher"; }

        //[Authorize(Policy = Policies.HasLibraryId)]
        //private static string LibraryMembersOnly() { return "Library members only"; }

        //[Authorize(Roles = Roles.Teacher, Policy = Policies.FemalesOnly)]
        //private static string ApplyForMaternityLeave() { return "Applied for maternity leave"; }

        //[Authorize(Policy = Policies.Under10)] [Authorize(Policy = Policies.FemalesOnly)]
        //private static string Under10sAndFemale() { return "Under 10 and Female"; }
    }
}
