namespace Trackly.Utils.Exceptions
{
    public class PaymentCategoryExistException : Exception
    {
        public PaymentCategoryExistException(string message = "Taka kategoria płatności już istnieje.")
            : base(message) { }
    }

    public class PaymentCategoryNotExistException : Exception
    {
        public PaymentCategoryNotExistException(string message = "Taka kategoria płatności nie istnieje.")
            : base(message) { }
    }

    public class PaymentMethodExistException : Exception
    {
        public PaymentMethodExistException(string message = "Taka metoda płatności już istnieje.")
            : base(message) { }
    }

    public class PaymentMethodNotExistException : Exception
    {
        public PaymentMethodNotExistException(string message = "Taka metoda płatności nie istnieje.")
            : base(message) { }
    }

    public class UserPaymentMethodExistException : Exception
    {
        public UserPaymentMethodExistException(string message = "To konto płatnościowe już istnieje.")
            : base(message) { }
    }

    public class UserPaymentMethodNotExistException : Exception
    {
        public UserPaymentMethodNotExistException(string message = "To konto płatnościowe nie istnieje.")
            : base(message) { }
    }

    public class UserPaymentMethodNotAccessedException : Exception
    {
        public UserPaymentMethodNotAccessedException(string message = "To konto płatnościowe nie należy do aktualnego użytkownika.")
            : base(message) { }
    }

    public class PaymentNotAccessedException : Exception
    {
        public PaymentNotAccessedException(string message = "Ta płatność nie należy do aktualnego użytkownika.")
            : base(message) { }
    }

    public class PaymentNotExistException : Exception
    {
        public PaymentNotExistException(string message = "Taka płatność nie istnieje.")
            : base(message) { }
    }
}
