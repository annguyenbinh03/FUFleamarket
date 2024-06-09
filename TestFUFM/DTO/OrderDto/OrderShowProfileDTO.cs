using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObjects.UserDto;

namespace DTO.OrderDto
{
    public class OrderShowProfileDTO
    {

        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal Price { get; set; }
        public ProfileUserDTO Buyer { get; set; }
        public ProfileUserDTO Seller { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public int Status { get; set; }
        public string? Note { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string ReceiverAddress { get; set; } = null!;


    }
}
