using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Trackly.Models
{
    public class Image
    {
        [Key] public int Id { get; set; }

        [Column(TypeName = "nvarchar(50)")] public string Name { get; set; } = "";
        [Column(TypeName = "nvarchar(15)")] public int Width { get; set; } = 160;
        [Column(TypeName = "nvarchar(15)")] public int Height { get; set; } = 160;

        [Column] public byte[] Bytes { get; set; } = [];
        [Column(TypeName = "nvarchar(5)")] public string FileExtension { get; set; } = "";
        [NotMapped] public string Source { get; set; } = "";
    }
}