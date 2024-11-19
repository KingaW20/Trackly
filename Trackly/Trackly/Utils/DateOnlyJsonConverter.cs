using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Trackly.Utils
{
    public class DateOnlyJsonConverter : JsonConverter<DateOnly>
    {
        private const string DateFormat = "dd-MM-yyyy";

        public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType != JsonTokenType.String)
                throw new JsonException();

            if (DateOnly.TryParseExact(
                reader.GetString(), DateFormat, null, DateTimeStyles.None, out var date))
                return date;

            throw new JsonException("Ivalid date format");
        }

        public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(DateFormat));
        }
    }
}
