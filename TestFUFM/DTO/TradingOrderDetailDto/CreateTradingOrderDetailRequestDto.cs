﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.TradingOrderDetailDto
{
    public class CreateTradingOrderDetailRequestDto
    {

        public int ProductId { get; set; }

        public int TradingOrderId { get; set; }

        public int Quantity { get; set; }


    }
}
