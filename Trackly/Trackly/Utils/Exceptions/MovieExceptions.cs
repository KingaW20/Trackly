namespace Trackly.Utils.Exceptions
{
    public class MovieExistException : Exception
    {
        public MovieExistException(string message = "Film o takim tytule już istnieje.")
            : base(message) { }
    }

    public class MovieNotExistException : Exception
    {
        public MovieNotExistException(string message = "Taki film nie istnieje.")
            : base(message) { }
    }

    public class TvSerieExistException : Exception
    {
        public TvSerieExistException(string message = "Serial o takim tytule już istnieje.")
            : base(message) { }
    }

    public class TvSerieNotExistException : Exception
    {
        public TvSerieNotExistException(string message = "Taki serial nie istnieje.")
            : base(message) { }
    }

    public class TvSerieEpisodeExistException : Exception
    {
        public TvSerieEpisodeExistException(string message = "Ten odcinek już istnieje.")
            : base(message) { }
    }

    public class TvSerieEpisodeNotExistException : Exception
    {
        public TvSerieEpisodeNotExistException(string message = "Ten odcinek nie istnieje.")
            : base(message) { }
    }

    public class UserProgramNotExistException : Exception
    {
        public UserProgramNotExistException(string message = "Ten program nie istnieje.")
            : base(message) { }
    }

    public class UserProgramExistException : Exception
    {
        public UserProgramExistException(string message = "Ten program już istnieje.")
            : base(message) { }
    }

    public class UserProgramNotAccessedException : Exception
    {
        public UserProgramNotAccessedException(string message = "Ten programm nie należy do aktualnego użytkownika.")
            : base(message) { }
    }
}
