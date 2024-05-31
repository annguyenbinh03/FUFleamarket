using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Helpers
{
    public class QueryObject
    {
        public int FeedbackId { get; set; }

        public string Content { get; set; } = null!;


        public int Rating { get; set; }

        public int OrderId { get; set; }
    }
}
