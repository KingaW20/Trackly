using Microsoft.AspNetCore.Mvc;
using Trackly.Utils;

namespace Trackly.Controllers
{
    public class BaseController : ControllerBase
    {
        protected async Task<ActionResult> HandleError(Exception ex)
        {
            switch (ex)
            {
                case PaymentCategoryExistException:
                case PaymentCategoryNotExistException:
                case PaymentMethodExistException:
                case PaymentMethodNotExistException:
                case PaymentNotAccessedException:
                case PaymentNotExistException:
                case UserPaymentMethodExistException:
                case UserPaymentMethodNotExistException:
                case UserPaymentMethodNotAccessedException:
                    return await Task.FromResult(BadRequest(new { message = ex.Message }));
                case NotFoundException:
                    return await Task.FromResult(NotFound());
                default:
                    return await Task.FromResult(BadRequest(
                        StatusCode(500, new { message = "Wystąpił błąd serwera.", error = ex.Message })));
            }
        }

        protected string GetUserId()
        {
            return User.Claims.First(x => x.Type == Constants.Claims.UserID).Value;
        }
    }
}
