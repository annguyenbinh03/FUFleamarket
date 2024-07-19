using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Helpers
{
    public static class DateTimeExtensions
    {
        public static string ToRelativeTime(this DateTime? dateTime)
        {
            if (dateTime == null)
                return "No date";

            var timeSpan = DateTime.Now.AddHours(7) - dateTime.Value;

            if (timeSpan <= TimeSpan.FromSeconds(60))
                return $"{timeSpan.Seconds} giây trước";
            if (timeSpan <= TimeSpan.FromMinutes(60))
                return $"{timeSpan.Minutes} phút trước";
            if (timeSpan <= TimeSpan.FromHours(24))
                return $"{timeSpan.Hours} giờ trước";
            if (timeSpan <= TimeSpan.FromDays(30))
                return $"{timeSpan.Days} ngày trước";
            if (timeSpan <= TimeSpan.FromDays(365))
                return $"{timeSpan.Days / 30} tháng trước";

            return $"{timeSpan.Days / 365} năm trước";
        }
    }
}
