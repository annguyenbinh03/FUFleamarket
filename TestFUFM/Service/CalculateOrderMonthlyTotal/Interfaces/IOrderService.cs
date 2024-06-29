using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.CalculateOrderMonthlyTotal.Interfaces
{
    public interface IOrderService
    {
        Task<int> GetOrderCountForCurrentMonthAsync();
    }
}
