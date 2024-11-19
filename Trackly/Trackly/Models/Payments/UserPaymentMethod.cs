using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trackly.Models.Payments
{
    public class UserPaymentMethod
    {
        [Key] public int Id { get; set; }

        [ForeignKey("User")] public string UserId { get; set; } = "";
        [ForeignKey("PaymentMethod")] public int PaymentMethodId { get; set; }

        [Column(TypeName = "nvarchar(10)")] public float Sum { get; set; } = 0f;
    }
}
