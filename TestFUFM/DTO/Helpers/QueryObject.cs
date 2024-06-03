using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Helpers
{
    public class QueryObject
    {

        public int? CategoryId { get; set; }
        public decimal? Price { get; set; }
        public string? SortBy { get; set; } = null;
        public bool IsDecsending { get; set; } = false;
        // sreach name
        public string? ProductName { get; set; } = null;

    }
}
