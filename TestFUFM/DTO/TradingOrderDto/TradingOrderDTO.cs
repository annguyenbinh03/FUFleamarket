using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO.TradingOrderDetailDto;

namespace DTO.TradingOrderDto
{
    public class TradingOrderDTO
    {
        public int TradingOrderId { get; set; }

        public int User1 { get; set; }

        public int User2 { get; set; }

        public string Note { get; set; } = null!;

        public DateTime CreatedDate { get; set; }

        public int Status { get; set; }

    }


}
