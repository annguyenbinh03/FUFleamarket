using BusinessObjects.Models;
using DTO.ReportDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Mappers
{
    public static class ReportMapper
    {
        public static ReportDTO ToReportDTO(this Report model)
        {
            return new ReportDTO
            {
                ReportId = model.ReportId,
                ReporterId = model.ReporterId,  
                ReportedUserId = model.ReportedUserId,
                Reason = model.Reason,
                IsProcessed = model.IsProcessed,
                CreatedDate = model.CreatedDate,
            };
        }
        public static Report ToReportRequestFromCreate(this CreateReportRequestDto model)
        {
            return new Report
            {
                ReportedUserId = model.ReportedUserId,
                Reason = model.Reason,
                IsProcessed = model.IsProcessed,
                CreatedDate = DateTime.Now,
            };
        }
    }
}
