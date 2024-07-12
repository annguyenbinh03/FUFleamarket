﻿using Api.orderDto;

using BusinessObjects.Models;
using BusinessObjects.OrderDto;
using DTO.OrderDto;

namespace BusinessObjects.Mappers
{
    public static class OrderMapper
    {
        public static OrderDTO ToOrderDTO(this BusinessObjects.Models.Order order)
        {
            return new OrderDTO
            {
                OrderId = order.OrderId,
                Price = order.Price,
                BuyerId = order.BuyerId,
                SellerId = order.SellerId,
                PaymentMethod = order.PaymentMethod,
                Note = order.Note,
                ProductId = order.ProductId,
                Quantity = order.Quantity,
                Status = order.Status,
                ReceiverAddress = order.ReceiverAddress,
                CreatedDate = order.CreatedDate
            };
        }

        public static Order ToOrderFromCreateDTO(this CreateOrderRequestDto dto, int BuyerId, int SellerId) => new Order
        {
            
            Price = dto.Price,
            BuyerId = BuyerId,
            SellerId = SellerId,
            PaymentMethod = dto.PaymentMethod,
            Status = dto.Status,
            Note = dto.Note,
            ProductId = dto.ProductId,
            Quantity = dto.Quantity,
            ReceiverAddress = dto.ReceiverAddress,
            CreatedDate = DateTime.Now
        };

        public static OrderShowProfileDTO ToOrderShowProfileOfSellerDTO(this BusinessObjects.Models.Order order)
        {
            return new OrderShowProfileDTO
            {
                OrderId = order.OrderId,
                Price = order.Price,               
                Seller = order.Seller != null ? order.Seller.ToProfileUserDTO() : null,
                PaymentMethod = order.PaymentMethod,
                Note = order.Note,
                ProductId = order.ProductId,
                Quantity = order.Quantity,
                Status = order.Status,
                ReceiverAddress = order.ReceiverAddress,
                CreatedDate = order.CreatedDate
            };
        }
        public static OrderShowProfileDTO ToOrderShowProfileOfBuyerDTO(this BusinessObjects.Models.Order order)
        {
            return new OrderShowProfileDTO
            {
                OrderId = order.OrderId,
                Price = order.Price,
                Buyer = order.Buyer != null ? order.Buyer.ToProfileUserDTO() : null,
                PaymentMethod = order.PaymentMethod,
                Note = order.Note,
                ProductId = order.ProductId,
                Quantity = order.Quantity,
                Status = order.Status,
                ReceiverAddress = order.ReceiverAddress,
                CreatedDate = order.CreatedDate
            };
        }
    }
}
