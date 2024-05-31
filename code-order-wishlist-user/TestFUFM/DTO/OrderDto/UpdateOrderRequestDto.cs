using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.OrderDto
{
    public class UpdateOrderRequestDto
    {
        public DateTime OrderDate { get; set; }


        public decimal Price { get; set; }


        public int BuyerId { get; set; }


        public string PaymentMethod { get; set; } = null!;


        public int Status { get; set; }


        public string? Note { get; set; }

        public int ProductId { get; set; }


        public int Quantity { get; set; }


        public string ReceiverAddress { get; set; } = null!;
       
    }
}
