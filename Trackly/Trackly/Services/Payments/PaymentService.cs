using Trackly.Models.Payments;
using Trackly.Repositories.Payments;
using Trackly.Utils;

namespace Trackly.Services.Payments
{
    public class PaymentService
    {
        private readonly PaymentRepository _pRepository;
        private readonly UserPaymentMethodService _upmService;

        public PaymentService(PaymentRepository paymentRepository, UserPaymentMethodService userPaymentMethodService)
        {
            _pRepository = paymentRepository;
            _upmService = userPaymentMethodService;
        }

        public async Task<IEnumerable<Payment>> GetPayments(string? userId = null)
        {
            var upmIds = (await _upmService.GetUserPaymentMethods(userId: userId)).Select(upm => upm.Id).ToList();

            return await _pRepository.GetPayments(userPaymentMethodIds: upmIds);            
        }

        public async Task<Payment?> GetPayment(int id, string userId)
        {
            var payment = await _pRepository.GetPayment(id);

            //check if payment exists
            if (payment == null) throw new PaymentNotExistException();
            //check if payment belongs to user
            if (!(await IsUserPayment(id, userId))) throw new PaymentNotAccessedException();

            return payment;
        }

        public async Task<Payment> AddPayment(Payment payment, string userId)
        {
            payment.Id = 0;

            //check if user payment method belongs to user
            if (!(await _upmService.IsUserPaymentMethod(payment.UserPaymentMethodId, userId)))
                throw new UserPaymentMethodNotAccessedException();

            return await _pRepository.AddPayment(payment);
        }

        public async Task<Payment> UpdatePayment(Payment payment, string userId)
        {
            //check if user payment method belongs to user
            if (!(await _upmService.IsUserPaymentMethod(payment.UserPaymentMethodId, userId)))
                throw new UserPaymentMethodNotAccessedException();

            //check if payment to update exists
            var p = await _pRepository.GetPayment(payment.Id);
            if (p == null) throw new PaymentNotExistException();

            //check if payment belongs to user
            if (!(await IsUserPayment(payment.Id, userId))) throw new PaymentNotAccessedException();

            var result = await _pRepository.UpdatePayment(payment);
            if (result == null) throw new NotFoundException();

            return result;
        }

        public async Task DeletePayment(int id, string userId)
        {
            var p = await _pRepository.GetPayment(id);

            //check if payment exists
            if (p == null) throw new PaymentNotExistException();
            //check if payment belongs to user
            if (!(await IsUserPayment(id, userId))) throw new PaymentNotAccessedException();

            await _pRepository.DeletePayment(p);
        }

        private async Task<bool> IsUserPayment(int paymentId, string userId)
        {
            var userPayments = await GetPayments(userId: userId);
            return !(userPayments == null || !userPayments!.ToList().Any(p => p.Id == paymentId));
        }
    }
}
