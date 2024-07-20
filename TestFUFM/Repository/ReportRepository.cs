using BusinessObjects;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class ReportRepository : IReportRepository
    {
        public readonly FufleaMarketContext _context;
        public ReportRepository(FufleaMarketContext context)
        {
            _context = context;
        }

        public async Task<Report> CreateAsync(Report reportModel)
        {
            await _context.Reports.AddAsync(reportModel);
            await _context.SaveChangesAsync();
            return reportModel;
        }

        public async Task<List<Report>> GetAllAsync()
        {
            return await _context.Reports.ToListAsync();
        }
        public async Task<Report?> GetByIdAsync(int id)
        {
            return await _context.Reports.FindAsync(id);
        }
        public async Task<Report?> UpdateIsProcessAsync(int id)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report != null)
            {
                report.IsProcessed = true;
                await _context.SaveChangesAsync();
            }
            return report;
        }

        public async Task<Report?> UpdateIsProcessAndBanAccountAsync(int id)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report != null)
            {
                report.IsProcessed = true;

                // Truy vấn tài khoản qua reportedUserId
                var user = await _context.Users.FindAsync(report.ReportedUserId);
                if (user != null)
                {
                    user.IsDeleted = true; 
                }

                await _context.SaveChangesAsync();
            }
            return report;
        }

    }
}
