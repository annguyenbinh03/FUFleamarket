using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.ReportDto
{
    public class ReportDTO
    {
        public int ReportId { get; set; }

        public int? ReporterId { get; set; }

        public int? ReportedUserId { get; set; }

        public string? Reason { get; set; }

        public bool? IsProcessed { get; set; }

        public DateTime? CreatedDate { get; set; }


    }
}
