using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.TradingOrderDto
{
    public class CreateTradingOrderCombinedRequestDto
    {
        public TradingOrderDto TradingOrder { get; set; } = new TradingOrderDto();
        public List<ProductDto> User1Product { get; set; } = new List<ProductDto>();
        public List<ProductDto> User2Product { get; set; } = new List<ProductDto>();
    }

    // Class con chứa thông tin của TradingOrder
    public class TradingOrderDto
    {
        public int UserId1 { get; set; }
        public int UserId2 { get; set; }
        public string Note { get; set; } = string.Empty;
    }

    // Class con chứa thông tin của từng sản phẩm
    public class ProductDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
