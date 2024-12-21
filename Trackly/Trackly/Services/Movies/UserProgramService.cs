using Trackly.Models.Movies;
using Trackly.Repositories.Movies;
using Trackly.Utils.Exceptions;

namespace Trackly.Services.Movies
{
    public class UserProgramService
    {
        private readonly UserProgramRepository _upRepository;
        private readonly MovieService _mService;
        private readonly TvSerieEpisodeRepository _seRepository;
        private readonly TvSerieEpisodeService _seService;

        public UserProgramService(
            UserProgramRepository userProgramRepository, MovieService movieService,
            TvSerieEpisodeRepository tvSerieEpisodeRepository, TvSerieEpisodeService tvSerieEpisodeService)
        {
            _upRepository = userProgramRepository;
            _mService = movieService;
            _seRepository = tvSerieEpisodeRepository;
            _seService = tvSerieEpisodeService;
        }

        public async Task<IEnumerable<UserProgram>> GetUserPrograms(string? userId = null)
        {
            var userPrograms = await _upRepository.GetUserPrograms(userId: userId);

            var result = new List<UserProgram>();
            foreach (var up in userPrograms)
            {
                var userProgram = await SetValues(up);
                result.Add(userProgram);
            }
            return result;
        }

        public async Task<UserProgram?> GetUserProgram(int id, string userId)
        {
            var userProgram = await _upRepository.GetUserProgram(id);

            //check if user program exists
            if (userProgram == null) throw new UserProgramNotExistException();
            //check if user program belongs to user
            if (userProgram.UserId != userId) throw new UserProgramNotAccessedException();

            userProgram = await SetValues(userProgram);

            return userProgram;
        }

        public async Task<UserProgram> AddUserProgram(UserProgram userProgram)
        {
            userProgram.Id = 0;
            await CheckIfProgramExist(userProgram.ProgramId, userProgram.IsMovie);
            return await _upRepository.AddUserProgram(userProgram);
        }

        public async Task<UserProgram> UpdateUserProgram(UserProgram userProgram, string userId)
        {
            var up = await _upRepository.GetUserProgram(userProgram.Id);
            if (up == null) throw new UserProgramNotExistException();

            if (userId != up.UserId) throw new UserProgramNotAccessedException();

            await CheckIfProgramExist(userProgram.ProgramId, userProgram.IsMovie);

            if ((await _upRepository.GetUserPrograms(
                idNot: userProgram.Id,
                userId: userProgram.UserId,
                programId: userProgram.ProgramId,
                date: userProgram.Date
                )).Any())
                throw new UserProgramExistException();

            var result = await _upRepository.UpdateUserProgram(userProgram);
            if (result == null) throw new NotFoundException();

            return result;
        }

        public async Task DeleteUserProgram(int id, string userId)
        {
            var up = await _upRepository.GetUserProgram(id);
            if (up == null) throw new NotFoundException();
            if (up.UserId != userId) throw new UserProgramNotAccessedException();
            await _upRepository.DeleteUserProgram(up);
        }

        private async Task<UserProgram> SetValues(UserProgram userProgram)
        {
            if (userProgram.IsMovie)
            {
                userProgram.Program =
                    new Models.Movies.Program(await _mService.GetMovie(userProgram.ProgramId), userProgram.Date);
            }
            else
            {
                userProgram.Program =
                    new Models.Movies.Program(await _seService.GetTvSerieEpisode(userProgram.ProgramId), userProgram.Date);
            }

            return userProgram;
        }

        private async Task CheckIfProgramExist(int programId, bool isMovie)
        {
            if (isMovie && (await _mService.GetMovie(programId)) == null)
                throw new MovieNotExistException();
            else if (!isMovie && (await _seRepository.GetTvSerieEpisode(programId) == null))
                throw new TvSerieEpisodeNotExistException();
        }
    }
}
