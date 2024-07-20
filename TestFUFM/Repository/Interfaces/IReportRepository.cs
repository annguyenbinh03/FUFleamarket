using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IReportRepository
    {
        Task<List<Report>> GetAllAsync();
        Task<Report?> GetByIdAsync(int id);
        Task<Report> CreateAsync(Report reportModel);
        Task<Report?> UpdateIsProcessAsync(int id);
        Task<Report?> UpdateIsProcessAndBanAccountAsync(int id);

    }
}
