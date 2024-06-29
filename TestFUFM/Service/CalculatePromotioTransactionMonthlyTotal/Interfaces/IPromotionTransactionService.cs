using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.CalculatePromotioTransactionMonthlyTotal.Interfaces
{
    public interface IPromotionTransactionService 
    {
        Task<MonthlyTotal> GetMonthlyTotalForCurrentMonthAsync();

        Task<List<PackageMonthlyData>> GetPackageMonthlyDataAsync();
    }
}
