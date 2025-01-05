using Trackly.Models.Payments;
using Trackly.Repositories.Payments;
using Trackly.Utils.Exceptions;
using System.Linq;

namespace Trackly.Services.Payments
{
    public class UserPaymentHistoryService
    {
        private readonly UserPaymentHistoryRepository _uphRepository;
        private readonly UserPaymentMethodService _upmService;

        public UserPaymentHistoryService(UserPaymentHistoryRepository userPaymentHistoryRepository,
            UserPaymentMethodService userPaymentMethodService)
        {
            _uphRepository = userPaymentHistoryRepository;
            _upmService = userPaymentMethodService;
        }

        public async Task<IEnumerable<UserPaymentHistory>> GetUserPaymentHistories(string userId)
        {
            var userPaymentMethodIds = await GetUserPaymentMethodIds(userId);
            var userPaymentHistories = await _uphRepository.GetUserPaymentHistories(userPaymentMethodIds: userPaymentMethodIds);
            foreach (var uph in userPaymentHistories)
                uph.UserPaymentMethod = await GetUserPaymentMethod(id: uph.UserPaymentMethodId, userId: userId);

            return userPaymentHistories;
        }

        public async Task<UserPaymentHistory?> GetUserPaymentHistory(int id, string userId)
        {
            var result = await _uphRepository.GetUserPaymentHistory(id);

            if (result == null) throw new NotFoundException();

            result.UserPaymentMethod = await GetUserPaymentMethod(id: result.UserPaymentMethodId, userId: userId);
            if (result.UserPaymentMethod?.UserId != userId) throw new UserPaymentHistoryNotAccessedException();

            return result;
        }

        public async Task<UserPaymentHistory> AddUserPaymentHistory(UserPaymentHistory userPaymentHistory, string userId)
        {
            userPaymentHistory.Id = 0;

            if (!(await _upmService.IsUserPaymentMethod(userPaymentHistory.UserPaymentMethodId, userId)))
                throw new UserPaymentMethodNotAccessedException();

            return await _uphRepository.AddUserPaymentHistory(userPaymentHistory);
        }

        public async Task<UserPaymentHistory> UpdateUserPaymentHistory(UserPaymentHistory userPaymentHistory, string userId)
        {
            var uph = await _uphRepository.GetUserPaymentHistory(userPaymentHistory.Id);
            if (uph == null) throw new UserPaymentHistoryNotExistException();

            if (!(await _upmService.IsUserPaymentMethod(userPaymentHistory.UserPaymentMethodId, userId)))
                throw new UserPaymentMethodNotExistException();
            
            var result = await _uphRepository.UpdateUserPaymentHistory(userPaymentHistory);
            if (result == null) throw new NotFoundException();

            return result;
        }

        public async Task DeleteUserPaymentHistory(int id, string userId)
        {
            var uph = await _uphRepository.GetUserPaymentHistory(id);
            if (uph == null) throw new NotFoundException();
            uph.UserPaymentMethod = await GetUserPaymentMethod(id: uph.UserPaymentMethodId, userId: userId);
            if (uph.UserPaymentMethod?.UserId != userId) throw new UserPaymentHistoryNotAccessedException();
            await _uphRepository.DeleteUserPaymentHistory(uph);
        }

        private async Task<List<int>> GetUserPaymentMethodIds(string userId)
        {
            return (await _upmService.GetUserPaymentMethods(userId)).Select(upm => upm.Id).ToList();
        }

        private Task<UserPaymentMethod?> GetUserPaymentMethod(int id, string userId)
        {
            return _upmService.GetUserPaymentMethod(id, userId);
        }
    }
}
