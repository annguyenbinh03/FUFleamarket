using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.MessageDto
{
    public class DeleteMessageRequestDto
    {

        public string MessageText { get; set; } = null!;

        public DateTime? Time { get; set; }

        public bool? IsRead { get; set; }
    }
}
