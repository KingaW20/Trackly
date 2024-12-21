using Trackly.Models.Payments;
using Trackly.Repositories.Payments;
using Trackly.Utils.Exceptions;

namespace Trackly.Services.Payments
{
    public class PaymentMethodService
    {
        private readonly PaymentMethodRepository _pmRepository;
        private readonly UserPaymentMethodRepository _upmRepository;
        private readonly PaymentRepository _pRepository;

        public PaymentMethodService(
            PaymentMethodRepository paymentMethodRepository, 
            UserPaymentMethodRepository userPaymentMethodRepository, 
            PaymentRepository pRepository)
        {
            _pmRepository = paymentMethodRepository;
            _upmRepository = userPaymentMethodRepository;
            _pRepository = pRepository;
        }

        public async Task<IEnumerable<PaymentMethod>> GetPaymentMethods()
        {
            var result = await _pmRepository.GetPaymentMethods();
            foreach (var pm in result)
            {
                var userPaymentMethods = await _upmRepository.GetUserPaymentMethods(paymentMethodId: pm.Id);

                pm.IsPaymentWithMethodExists = (await _pRepository.GetPayments())
                    .Any(payment => userPaymentMethods.Any(upm => upm.Id == payment.UserPaymentMethodId));
            }
            return result;
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
