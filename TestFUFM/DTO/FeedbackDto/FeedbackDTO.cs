using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.FeedbackDto
{
    public class FeedbackDTO
    {
      
        public int FeedbackId { get; set; }

        public string Content { get; set; } = null!;

        
        public int Rating { get; set; }

        public int OrderId { get; set; }

    }
}
