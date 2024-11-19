using Trackly.Models.Payments;
using Trackly.Repositories.Payments;
using Trackly.Utils;

namespace Trackly.Services.Payments
{
    public class PaymentMethodService
    {
        private readonly PaymentMethodRepository _pmRepository;

        public PaymentMethodService(PaymentMethodRepository paymentMethodRepository)
        {
            _pmRepository = paymentMethodRepository;
        }

        public async Task<IEnumerable<PaymentMethod>> GetPaymentMethods()
        {
            return await _pmRepository.GetPaymentMethods();
        }

        public async Task<PaymentMethod?> GetPaymentMethod(int id)
        {
            var pm = await _pmRepository.GetPaymentMethod(id);
            if (pm == null) throw new NotFoundException();
            return pm;
        }

        public async Task<PaymentMethod> AddPaymentMethod(PaymentMethod paymentMethod)
        {
            paymentMethod.Id = 0;

            if ((await _pmRepository.GetPaymentMethods(name: paymentMethod.Name)).Any())
                throw new PaymentMethodExistException();

            return await _pmRepository.AddPaymentMethod(paymentMethod);
        }

        public async Task<PaymentMethod> UpdatePaymentMethod(PaymentMethod paymentMethod)
        {
            var pc = await _pmRepository.GetPaymentMethod(paymentMethod.Id);
            if (pc == null) throw new PaymentMethodNotExistException();

            if ((await _pmRepository.GetPaymentMethods(idNot: paymentMethod.Id, name: paymentMethod.Name)).Any())
                throw new PaymentMethodExistException();

            var result = await _pmRepository.UpdatePaymentMethod(paymentMethod);
            if (result == null) throw new NotFoundException();

            return result!;
        }

        public async Task DeletePaymentMethod(int id)
        {
            var pm = await _pmRepository.GetPaymentMethod(id);
            if (pm == null) throw new NotFoundException();
            await _pmRepository.DeletePaymentMethod(pm);
        }

        public async Task<bool> IsPaymentMethodExist(int paymentMethodId)
        {
            var paymentMethod = await _pmRepository.GetPaymentMethod(paymentMethodId);
            return paymentMethod != null;
        }
    }
}
