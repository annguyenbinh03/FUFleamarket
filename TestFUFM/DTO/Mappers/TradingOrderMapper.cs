using BusinessObjects.Models;
using DTO.TradingOrderDto;

namespace DTO.Mappers
{
    public static class TradingOrderMapper
    {
        public static TradingOrderDTO ToTradingOrderDTO(this TradingOrder model)
        {
            return new TradingOrderDTO
            {
                TradingOrderId = model.TradingOrderId,
                User1 = model.User1,
                User2 = model.User2,
                Note = model.Note,
                CreatedDate = model.CreatedDate,
                Status = model.Status
            };
        }

        public static TradingOrder ToTradingOrderFromCreate(this CreateTradingOrderRequestDto createTradingOrderDto)
        {
            return new TradingOrder
            {
                User2 = createTradingOrderDto.User2,
                Note = createTradingOrderDto.Note,
                CreatedDate = createTradingOrderDto.CreatedDate,
                Status = createTradingOrderDto.Status
            };
        }

        public static TradingOrder ToTradingOrderUpdate(this UpdateTradingOrderRequestDto updateTradingOrderDto)
        {
            return new TradingOrder
            {
                User1 = updateTradingOrderDto.User1,
                User2 = updateTradingOrderDto.User2,
                Note = updateTradingOrderDto.Note,
                CreatedDate = updateTradingOrderDto.CreatedDate,
                Status = updateTradingOrderDto.Status
            };
        }
    }
}
