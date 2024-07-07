using BusinessObjects.Models;
using DTO.TradingOrderDetailDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Mappers
{
    public static class TradingOrderDetailMapper
    {
        public static TradingOrderDetailDTO ToTradingOrderDetailDTO(this TradingOrderDetail model)
        {
            return new TradingOrderDetailDTO
            {
                TradingOrderDetailId = model.TradingOrderDetailId,
                ProductId = model.ProductId,
                TradingOrderId = model.TradingOrderId,
                OwnerId = model.OwnerId,   
                Quantity = model.Quantity,
                Price = model.Price
            };
        }

        public static TradingOrderDetail ToTradingOrderDetailFromCreate(this CreateTradingOrderDetailRequestDto create, decimal price, int ownerId)
        {
            return new TradingOrderDetail
            {
                ProductId = create.ProductId,
                TradingOrderId = create.TradingOrderId,
                Quantity = create.Quantity,
                Price = price,
                OwnerId = ownerId
            };
        }
    }
}
