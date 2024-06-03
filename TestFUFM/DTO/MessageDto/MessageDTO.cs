using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.MessageDto
{
    public class MessageDTO
    {
        
        public int MessageId { get; set; }       
        public int SenderId { get; set; }

        public int ReceiverId { get; set; }

        public string MessageText { get; set; } = null!;

        public DateTime? Time { get; set; }

        public bool? IsRead { get; set; }

        
    }
}
