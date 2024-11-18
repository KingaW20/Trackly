using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trackly.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        [Column(TypeName="nvarchar(100)")]
        public string Name { get; set; } = "";

        //dd-mm-rrrr
        [Column(TypeName = "nvarchar(10)")]
        public string Date { get; set; } = "";

        [Column(TypeName = "nvarchar(100)")]
        public string CategoryName { get; set; } = "";

        [Column(TypeName = "nvarchar(10)")]
        public float Sum { get; set; } = 0f;
    }
}
