using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Helpers
{
    public class QueryObject
    {
        
            public int? CategoryId { get; set; }
            public decimal? Price { get; set; }
            public string? SortBy { get; set; } = null;
            public bool IsDecsending { get; set; } = false;
        

    }
}
