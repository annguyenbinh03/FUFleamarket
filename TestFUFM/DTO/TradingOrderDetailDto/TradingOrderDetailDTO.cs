using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.TradingOrderDetailDto
{
    public class TradingOrderDetailDTO
    {
        public int TradingOrderDetailId { get; set; }

        public int ProductId { get; set; }

        public int TradingOrderId { get; set; }

        public int OwnerId { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

    }
}
