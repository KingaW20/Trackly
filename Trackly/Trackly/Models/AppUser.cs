using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trackly.Models
{
    public class AppUser : IdentityUser
    {
        [PersonalData]
        [Column(TypeName = "nvarchar(150)")]
        public string FullName { get; set; } = "";

        [PersonalData]
        [Column(TypeName = "nvarchar(150)")]
        public string Gender { get; set; } = "";

        [PersonalData]
        public DateOnly DateOfBirth { get; set; }

        [PersonalData]
        public int? LibraryID { get; set; }
    }
}
