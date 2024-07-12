using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BusinessObjects.Models;
using DTO.TradingOrderDto;
using DTO.Mappers;
using System.Collections.Generic;
using System.Linq;
using Repository.Interfaces;
using BusinessObjects;

namespace Repository
{
    public class TradingOrderRepository : ITradingOrderRepository
    {
        private readonly FufleaMarketContext _context;

        public TradingOrderRepository(FufleaMarketContext context)
        {
            _context = context;
        }

        public async Task<List<TradingOrder>> GetAllAsync()
        {
            return await _context.TradingOrders.ToListAsync();
        }

        public async Task<TradingOrder?> GetByIdAsync(int id)
        {
            return await _context.TradingOrders.FindAsync(id);
        }

        public async Task<TradingOrder> CreateTradingOrderAsync(TradingOrder tradingOrder)
        {
            await _context.AddAsync(tradingOrder);
            await _context.SaveChangesAsync();
            return tradingOrder;
        }

        public async Task<TradingOrder?> UpdateAsync(int id, UpdateTradingOrderRequestDto tradingOrderDto)
        {
            var existingOrder = await _context.TradingOrders.FirstOrDefaultAsync(x => x.TradingOrderId == id);
            if (existingOrder == null)
            {
                throw new KeyNotFoundException("Order not found");
            }

            existingOrder.User1 = tradingOrderDto.User1;
            existingOrder.User2 = tradingOrderDto.User2;
            existingOrder.Note = tradingOrderDto.Note;
            //existingOrder.CreatedDate = tradingOrderDto.CreatedDate;
            existingOrder.Status = tradingOrderDto.Status;

            
            await _context.SaveChangesAsync();
            return existingOrder;
        }

        public async Task<List<TradingOrder>> GetTradingOrdersByUserIdAsync(int userId)
        {
            return await _context.TradingOrders.Where(order => order.User1 == userId || order.User2 == userId).ToListAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.TradingOrders.AnyAsync(e => e.TradingOrderId == id);
        }
    }
}
