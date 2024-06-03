using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.WishlistDto
{
    public class UpdateWishlistDto
    {
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool IsNew { get; set; }
        public int SellerId { get; set; }
        public int CategoryId { get; set; }
        public bool Status { get; set; }
        public int UserId { get; set; }
    }
}
