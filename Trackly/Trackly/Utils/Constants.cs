namespace Trackly.Utils
{
    public static class Constants
    {
        public static class Claims
        {
            public const string UserID = "userID";
            public const string Gender = "gender";
            public const string Age = "age";

            public const string PaymentMethodID = "paymentMethodID";
        }

        public static class Paths
        {
            public const string FrontBasicURL = "http://localhost:4200";

            public const string SignUp = "/signup";
            public const string SignIn = "/signin";
            public const string UserProfile = "/UserProfile";

            public const string AdminOnly = "/AdminOnly";
            //public const string AdminOrTeacher = "/AdminOrTeacher";
            //public const string ApplyForMaternityLeave = "/ApplyForMaternityLeave";
            //public const string LibraryMembersOnly = "/LibraryMembersOnly";
            //public const string Under10sAndFemale = "/Under10sAndFemale";
        }

        //public static class Policies
        //{
        //    public const string HasLibraryId = "HasLibraryId";
        //    public const string FemalesOnly = "FemalesOnly";
        //    public const string Under10 = "Under10";
        //}

        public static class Roles
        {
            public const string Admin = "Admin";
            public const string Regular = "Regular";
            //public const string Teacher = "Teacher";
            //public const string Student = "Student";
        }

        public static class Settings
        {
            public const string AppSettings = "AppSettings";
            public const string DevConnection = "DevConnection";
        }
    }
}
