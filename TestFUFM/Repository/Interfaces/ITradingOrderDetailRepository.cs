using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface ITradingOrderDetailRepository
    {
        Task<List<TradingOrderDetail>> GetAllAsync();

        Task<TradingOrderDetail?> GetByIdAsync(int id);

        Task<TradingOrderDetail> CreateAsync(TradingOrderDetail tradingOrderDetail);

        Task<TradingOrderDetail> UpdateAsync(TradingOrderDetail tradingOrderDetail);

        Task<IEnumerable<TradingOrderDetail>> GetByUserIdAsync(int userId);

    }
}
