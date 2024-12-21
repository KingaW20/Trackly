using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Trackly.Models.Movies
{
    public class TvSerieEpisode
    {
        [Key] public int Id { get; set; }

        [ForeignKey("TvSerie")] public int TvSerieId { get; set; }

        [Column(TypeName = "nvarchar(3)")] public int Season { get; set; } = 0;
        [Column(TypeName = "nvarchar(3)")] public int Episode { get; set; } = 0;
        [Column(TypeName = "nvarchar(5)")] public int Time { get; set; } = 0;
        
        [NotMapped] public TvSerie? TvSerie { get; set; } = null;
    }
}
