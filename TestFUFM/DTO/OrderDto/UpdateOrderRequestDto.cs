using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.OrderDto
{
    public class UpdateOrderRequestDto
    {
        public DateTime OrderDate { get; set; }
        public decimal Price { get; set; }       
        public string PaymentMethod { get; set; } = null!;
        public int Status { get; } = 1;
        public string? Note { get; set; }
        public int Quantity { get; set; }
        public string ReceiverAddress { get; set; } = null!;

    }
}
