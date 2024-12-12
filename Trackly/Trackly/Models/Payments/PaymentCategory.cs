using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Trackly.Models.Payments
{
    public class PaymentCategory
    {
        [Key] public int Id { get; set; }

        [Column(TypeName = "nvarchar(20)")] public string Name { get; set; } = "";

        [NotMapped] public bool IsPaymentWithCategoryExists { get; set; } = false;
    }
}
