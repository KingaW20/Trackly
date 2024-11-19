using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Trackly.Models.Payments
{
    public class PaymentMethod
    {
        [Key] public int Id { get; set; }

        [Column(TypeName = "nvarchar(100)")] public string Name { get; set; } = "";
    }
}
