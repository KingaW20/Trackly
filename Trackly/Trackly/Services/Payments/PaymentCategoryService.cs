using Trackly.Models.Payments;
using Trackly.Repositories.Payments;
using Trackly.Utils;

namespace Trackly.Services.Payments
{
    public class PaymentCategoryService
    {
        private readonly PaymentCategoryRepository _pcRepository;

        public PaymentCategoryService(PaymentCategoryRepository paymentCategoryRepository)
        {
            _pcRepository = paymentCategoryRepository;
        }

        public async Task<IEnumerable<PaymentCategory>> GetPaymentCategories()
        {
            return await _pcRepository.GetPaymentCategories();
        }

        public async Task<PaymentCategory?> GetPaymentCategory(int id)
        {
            var result = await _pcRepository.GetPaymentCategory(id);
            if (result == null) throw new NotFoundException();
            return result;
        }

        public async Task<PaymentCategory> AddPaymentCategory(PaymentCategory paymentCategory)
        {
            paymentCategory.Id = 0;

            if ((await _pcRepository.GetPaymentCategories(name: paymentCategory.Name)).Any())
                throw new PaymentCategoryExistException();

            return await _pcRepository.AddPaymentCategory(paymentCategory);
        }

        public async Task<PaymentCategory> UpdatePaymentCategory(PaymentCategory paymentCategory)
        {
            var pc = await _pcRepository.GetPaymentCategory(paymentCategory.Id);
            if (pc == null) throw new PaymentCategoryNotExistException();

            if ((await _pcRepository.GetPaymentCategories(idNot: paymentCategory.Id, name: paymentCategory.Name)).Any())
                throw new PaymentCategoryExistException();

            var result = await _pcRepository.UpdatePaymentCategory(paymentCategory);
            if (result == null) throw new NotFoundException();

            return result!;
        }

        public async Task DeletePaymentCategory(int id)
        {
            var pc = await _pcRepository.GetPaymentCategory(id);
            if (pc == null) throw new NotFoundException();
            await _pcRepository.DeletePaymentCategory(pc);
        }
    }
}
