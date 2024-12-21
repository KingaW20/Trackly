using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trackly.Models.Movies
{
    public class TvSerie
    {
        [Key] public int Id { get; set; }

        [ForeignKey("Image")] public int? ImageId { get; set; }

        [Column(TypeName = "nvarchar(100)")] public string Title { get; set; } = "";

        [NotMapped] public Image? Image { get; set; } = null;
    }
}
