using System.Net;
using Trackly.Models.Payments;
using Trackly.Repositories.Payments;
using Trackly.Utils.Exceptions;

namespace Trackly.Services.Payments
{
    public class PaymentService
    {
        private readonly PaymentRepository _pRepository;
        private readonly UserPaymentMethodService _upmService;
        private readonly PaymentCategoryService _pcService;

        public PaymentService(PaymentRepository paymentRepository, UserPaymentMethodService userPaymentMethodService
            , PaymentCategoryService paymentCategoryService)
        {
            _pRepository = paymentRepository;
            _upmService = userPaymentMethodService;
            _pcService = paymentCategoryService;
        }

        public async Task<IEnumerable<Payment>> GetPayments(string? userId = null)
        {
            var upmIds = (await _upmService.GetUserPaymentMethods(userId: userId)).Select(upm => upm.Id).ToList();
            if (upmIds.Any()) 
            {
                var payments = await _pRepository.GetPayments(userPaymentMethodIds: upmIds);
                foreach (var p in payments)
                {
                    p.PaymentMethodName = await GetUserPaymentMethodName(p.UserPaymentMethodId, userId);
                    p.PaymentCategoryName = await GetPaymentCategoryName(p.CategoryId);
                }
                return payments ?? new List<Payment>();
            }

            return new List<Payment>();
        }

        public async Task<Payment?> GetPayment(int id, string userId)
        {
            var payment = await _pRepository.GetPayment(id);

            //check if payment exists
            if (payment == null) throw new PaymentNotExistException();
            //check if payment belongs to user
            if (!(await IsUserPayment(id, userId))) throw new PaymentNotAccessedException();

            payment.PaymentMethodName = await GetUserPaymentMethodName(payment.UserPaymentMethodId, userId);
            payment.PaymentCategoryName = await GetPaymentCategoryName(payment.CategoryId);

            return payment;
        }

        public async Task<Payment> AddPayment(Payment payment, string userId)
        {
            payment.Id = 0;

            //check if user payment method belongs to user
            if (!(await _upmService.IsUserPaymentMethod(payment.UserPaymentMethodId, userId)))
                throw new UserPaymentMethodNotAccessedException();

            //update account balance based on sum of the payment
            await UpdateAccountBalance((payment.IsOutcome ? -1 : 1) * payment.Sum, payment.UserPaymentMethodId, userId);

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

            //update account balance based on sum of the payment
            var oldSum = (p.IsOutcome ? -1 : 1) * p.Sum;
            var newSum = (payment.IsOutcome ? -1 : 1) * payment.Sum;
            await UpdateAccountBalance(newSum - oldSum, payment.UserPaymentMethodId, userId);

            return result;
        }

        public async Task DeletePayment(int id, string userId)
        {
            var p = await _pRepository.GetPayment(id);

            //check if payment exists
            if (p == null) throw new PaymentNotExistException();
            //check if payment belongs to user
            if (!(await IsUserPayment(id, userId))) throw new PaymentNotAccessedException();

            //update account balance based on sum of the payment
            await UpdateAccountBalance((p.IsOutcome ? 1 : -1) * p.Sum, p.UserPaymentMethodId, userId);

            await _pRepository.DeletePayment(p);
        }

        private async Task<bool> IsUserPayment(int paymentId, string userId)
        {
            var userPayments = await GetPayments(userId: userId);
            return !(userPayments == null || !userPayments!.ToList().Any(p => p.Id == paymentId));
        }

        private async Task<string> GetUserPaymentMethodName(int upmId, string? userId)
        {
            UserPaymentMethod upm = await _upmService.GetUserPaymentMethod(upmId, userId);
            return upm?.PaymentMethodName ?? "";
        }

        private async Task<string> GetPaymentCategoryName(int pcId)
        {
            PaymentCategory pc = await _pcService.GetPaymentCategory(pcId);
            return pc?.Name ?? "";
        }

        private async Task UpdateAccountBalance (double sum, int upmId, string userId)
        {
            var upm = await _upmService.GetUserPaymentMethod(upmId, userId);
            if (upm == null) throw new NotFoundException();
            upm.Sum = Math.Round(upm.Sum + sum, 2);
            await _upmService.UpdateUserPaymentMethod(upm);
        }
    }
}
