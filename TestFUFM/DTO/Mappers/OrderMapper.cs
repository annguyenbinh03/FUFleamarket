﻿using Api.orderDto;

using BusinessObjects.Models;
using BusinessObjects.OrderDto;

namespace BusinessObjects.Mappers
{
    public static class OrderMapper
    {
        public static OrderDTO ToOrderDTO(this BusinessObjects.Models.Order order)
        {
            return new OrderDTO
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                Price = order.Price,
                BuyerId = order.BuyerId,
                SellerId = order.SellerId,
                PaymentMethod = order.PaymentMethod,
                Note = order.Note,
                ProductId = order.ProductId,
                Quantity = order.Quantity,
                Status = order.Status,
                ReceiverAddress = order.ReceiverAddress
            };
        }

        public static Order ToOrderFromCreateDTO(this CreateOrderRequestDto dto, int BuyerId, int SellerId) => new Order
        {
            OrderDate = dto.OrderDate,
            Price = dto.Price,
            BuyerId = BuyerId,
            SellerId = SellerId,
            PaymentMethod = dto.PaymentMethod,
            Status = dto.Status,
            Note = dto.Note,
            ProductId = dto.ProductId,
            Quantity = dto.Quantity,
            ReceiverAddress = dto.ReceiverAddress
        };
    }
}
