using Trackly.Models.Payments;
using Trackly.Repositories.Payments;
using Trackly.Utils.Exceptions;

namespace Trackly.Services.Payments
{
    public class UserPaymentMethodService
    {
        private readonly UserPaymentMethodRepository _upmRepository;
        private readonly PaymentMethodService _pmService;

        public UserPaymentMethodService(UserPaymentMethodRepository userPaymentMethodRepository, 
            PaymentMethodService paymentMethodService)
        {
            _upmRepository = userPaymentMethodRepository;
            _pmService = paymentMethodService;
        }

        public async Task<IEnumerable<UserPaymentMethod>> GetUserPaymentMethods(string? userId = null)
        {
            var userPaymentsMethods = await _upmRepository.GetUserPaymentMethods(userId: userId);
            foreach (var upm in userPaymentsMethods)
                upm.PaymentMethodName = await GetUserPaymentMethodName(upm.PaymentMethodId);

            return userPaymentsMethods;
        }

        public async Task<UserPaymentMethod?> GetUserPaymentMethod(int id, string userId)
        {
            var result = await _upmRepository.GetUserPaymentMethod(id);

            if (result == null) throw new NotFoundException();
            if (result.UserId != userId) throw new UserPaymentMethodNotAccessedException();

            result.PaymentMethodName = await GetUserPaymentMethodName(result.PaymentMethodId);

            return result;
        }

        public async Task<UserPaymentMethod> AddUserPaymentMethod(UserPaymentMethod userPaymentMethod)
        {
            userPaymentMethod.Id = 0;

            if (!(await _pmService.IsPaymentMethodExist(userPaymentMethod.PaymentMethodId)))
                throw new PaymentMethodNotExistException();

            if ((await _upmRepository.GetUserPaymentMethods(
                userId: userPaymentMethod.UserId, 
                paymentMethodId: userPaymentMethod.PaymentMethodId)
                ).Any())
                throw new UserPaymentMethodExistException();

            return await _upmRepository.AddUserPaymentMethod(userPaymentMethod);
        }

        public async Task<UserPaymentMethod> UpdateUserPaymentMethod(UserPaymentMethod userPaymentMethod)
        {
            var upm = await _upmRepository.GetUserPaymentMethod(userPaymentMethod.Id);
            if (upm == null) throw new UserPaymentMethodNotExistException();

            if (!(await _pmService.IsPaymentMethodExist(userPaymentMethod.PaymentMethodId)))
                throw new PaymentMethodNotExistException();

            if ((await _upmRepository.GetUserPaymentMethods(
                idNot: userPaymentMethod.Id,
                userId: userPaymentMethod.UserId,
                paymentMethodId: userPaymentMethod.PaymentMethodId)
                ).Any())
                throw new UserPaymentMethodExistException();

            var result = await _upmRepository.UpdateUserPaymentMethod(userPaymentMethod);
            if (result == null) throw new NotFoundException();

            return result;
        }

        public async Task DeleteUserPaymentMethod(int id, string userId)
        {
            var upm = await _upmRepository.GetUserPaymentMethod(id);
            if (upm == null) throw new NotFoundException();
            if (upm.UserId != userId) throw new UserPaymentMethodNotAccessedException();
            await _upmRepository.DeleteUserPaymentMethod(upm);
        }

        public async Task<bool> IsUserPaymentMethod(int userPaymentMethodId, string userId)
        {
            var userPaymentMethods = await _upmRepository.GetUserPaymentMethods(userId: userId);
            return !(userPaymentMethods == null || !userPaymentMethods.ToList().Any(upm => upm.Id == userPaymentMethodId));
        }

        private async Task<string> GetUserPaymentMethodName(int pmId)
        {
            PaymentMethod pm = await _pmService.GetPaymentMethod(pmId);
            return pm?.Name ?? "";
        }
    }
}
