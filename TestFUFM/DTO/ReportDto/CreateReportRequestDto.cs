using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.ReportDto
{
    public class CreateReportRequestDto
    {

        public int? ReportedUserId { get; set; }

        public string? Reason { get; set; }

        public bool? IsProcessed { get; } = false;

        public DateTime? CreatedDate { get; }
    }
}
