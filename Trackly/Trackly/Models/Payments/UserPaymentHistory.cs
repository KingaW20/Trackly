using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Trackly.Utils;

namespace Trackly.Models.Payments
{
    public class UserPaymentHistory
    {
        [Key] public int Id { get; set; }

        [ForeignKey("UserPaymentMethod")] public int UserPaymentMethodId { get; set; } = 0;

        [Column(TypeName = "nvarchar(10)")] public double Sum { get; set; } = 0f;

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{dd-MM-yyyy}")]
        public DateOnly Date { get; set; }

        [Column(TypeName = "nvarchar(5)")] public bool EnteredByUser { get; set; } = false;

        [NotMapped] public UserPaymentMethod? UserPaymentMethod { get; set; } = null;
    }
}
