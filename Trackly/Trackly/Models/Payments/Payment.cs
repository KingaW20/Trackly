using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Trackly.Utils;

namespace Trackly.Models.Payments
{
    public class Payment
    {
        [Key] public int Id { get; set; }

        [ForeignKey("Category")] public int CategoryId { get; set; }
        [ForeignKey("UserPaymentMethod")] public int UserPaymentMethodId { get; set; }

        [Column(TypeName = "nvarchar(100)")] public string Description { get; set; } = "";
        [Column(TypeName = "nvarchar(10)")] public float Sum { get; set; } = 0f;

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{dd-MM-yyyy}")]
        public DateOnly Date { get; set; }
    }
}
