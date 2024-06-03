using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.FeedbackDto
{
    public class UpdateFeedbackRequestDto
    {
        
        public string Content { get; set; } = null!;

        public int Rating { get; set; }

        public int OrderId { get; set; }

    }
}
