using DTO.TradingOrderDetailDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.TradingOrderDto
{
    public class CreateTradingOrderRequestDto
    {
        public int User2 { get; set; }

        public string Note { get; set; } = null!;

        public DateTime CreatedDate { get; }

        public int Status { get; set; }


    }
}
