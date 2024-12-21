using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Trackly.Utils;

namespace Trackly.Models.Movies
{
    public class UserProgram
    {
        [Key] public int Id { get; set; }

        public int ProgramId { get; set; }
        [ForeignKey("User")] public string UserId { get; set; } = "";

        [Column(TypeName = "nvarchar(5)")] public bool IsMovie{ get; set; } = true;

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{dd-MM-yyyy}")]
        public DateOnly Date { get; set; }

        [NotMapped] public Program? Program { get; set; } = null;
    }
}
