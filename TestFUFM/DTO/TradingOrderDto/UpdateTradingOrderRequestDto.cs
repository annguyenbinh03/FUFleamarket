using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.TradingOrderDto
{
    public class UpdateTradingOrderRequestDto
    {
        public int User1 { get; set; }

        public int User2 { get; set; }

        public string Note { get; set; } = null!;

        //public DateTime CreatedDate { get; set; }

        public int Status { get; set; }

    }
}
