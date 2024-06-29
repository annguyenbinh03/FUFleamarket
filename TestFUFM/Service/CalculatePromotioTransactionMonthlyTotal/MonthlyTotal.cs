using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.CalculatePromotioTransactionMonthlyTotal
{
    public class MonthlyTotal
    {
        public int Year { get; set; }

        public int Month { get; set; }

        public decimal TotalPrice { get; set; }

    }
}
