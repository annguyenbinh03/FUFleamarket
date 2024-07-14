using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Helpers
{
    public static class SEATimeZone
    {
        public static DateTime GetCurrentSEATime()
        {
            DateTime serverTime = DateTime.Now;
            TimeZoneInfo targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            DateTime localTime = TimeZoneInfo.ConvertTime(serverTime, targetTimeZone);
            return localTime;
        }
    }
}
