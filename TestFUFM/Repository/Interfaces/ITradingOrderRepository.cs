using BusinessObjects.Models;
using DTO.TradingOrderDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface ITradingOrderRepository
    {
        Task<List<TradingOrder>> GetAllAsync();

        Task<TradingOrder?> GetByIdAsync(int id);

        Task<TradingOrder> CreateTradingOrderAsync(TradingOrder tradingOrder);

        Task<TradingOrder?> UpdateAsync(int id, UpdateTradingOrderRequestDto tradingOrderDto);

        Task<List<TradingOrder>> GetTradingOrdersByUser1IdAsync(int userId);

        Task<bool> ExistsAsync(int id);

        Task<List<TradingOrder>> GetTradingOrdersByUser2IdAsync(int userId);

    }
}
