using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.CalculatePromotioTransactionMonthlyTotal
{
    public class PackageMonthlyData
    {
        public int PromotionId { get; set; }

        public int Year { get; set; }

        public int Month { get; set; }

        public int TotalQuantity { get; set; }

        public decimal TotalPrice { get; set; }

    }
}
