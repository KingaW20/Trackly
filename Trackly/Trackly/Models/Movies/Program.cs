namespace Trackly.Models.Movies
{
    public class Program
    {
        public int Id { get; set; }
        public int? ImageId { get; set; }
        public string? Title { get; set; } = "";
        public int Time { get; set; } = 0;
        public Image? Image { get; set; } = null;
        public int? TvSerieId { get; set; } = null;
        public int? Season { get; set; } = null;
        public int? Episode { get; set; } = null;

        public Program(Movie? movie, DateOnly date)
        {
            if (movie != null)
            {
                this.Id = movie!.Id;
                this.ImageId = movie!.ImageId;
                this.Title = movie!.Title;
                this.Time = movie!.Time;
                this.Image = movie!.Image;
            }
        }

        public Program(TvSerieEpisode? tvSerieEpisode, DateOnly date)
        {
            if (tvSerieEpisode != null)
            {
                this.Id = tvSerieEpisode!.Id;
                this.ImageId = tvSerieEpisode!.TvSerie?.ImageId;
                this.Title = tvSerieEpisode!.TvSerie?.Title;
                this.Time = tvSerieEpisode!.Time;
                this.Image = tvSerieEpisode!.TvSerie?.Image;

                this.TvSerieId = tvSerieEpisode!.TvSerieId;
                this.Season = tvSerieEpisode!.Season;
                this.Episode = tvSerieEpisode!.Episode;
            }
        }
    }
}
