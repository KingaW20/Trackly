using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trackly.Models.Movies
{
    public class Movie
    {
        [Key] public int Id { get; set; }

        [ForeignKey("Image")] public int? ImageId { get; set; }

        [Column(TypeName = "nvarchar(100)")] public string Title { get; set; } = "";

        [Column(TypeName = "nvarchar(5)")] public int Time { get; set; } = 0;

        [NotMapped] public Image? Image { get; set; } = null;
    }
}
