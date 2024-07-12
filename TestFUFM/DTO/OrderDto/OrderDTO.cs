using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObjects.UserDto;

namespace Api.orderDto
{
    public class OrderDTO
    {

        public int OrderId { get; set; }
        
        public decimal Price { get; set; }
        public int BuyerId { get; set; }
        public int SellerId { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public int Status { get; set; }
        public string? Note { get; set; }
        public int ProductId { get; set; } 
        public int Quantity { get; set; }
        public string ReceiverAddress { get; set; } = null!;
        [Column("createdDate", TypeName = "datetime")]
        public DateTime CreatedDate { get; set; }

    }
}
