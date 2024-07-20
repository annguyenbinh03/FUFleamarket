using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;
using DTO.Mappers;
using DTO.ReportDto;
using Microsoft.AspNetCore.Authorization;
namespace WebAPI.Controllers
{
    public class ReportController : ControllerBase
    {
        private readonly IReportRepository _reportRepo;
        public ReportController(IReportRepository reportRepo)
        {
            _reportRepo = reportRepo;
        }

        [HttpGet("admin/getall")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var report = await _reportRepo.GetAllAsync();
            var reportDto = report.Select(x => x.ToReportDTO()).ToList();
            return Ok(reportDto);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}/admin/getbyreportid")]
        public async Task<IActionResult> GetById(int id)
        {
            var report = await _reportRepo.GetByIdAsync(id);
            if (report == null)
            {
                return NotFound();
            }
            var reportDto = report.ToReportDTO();
            return Ok(reportDto);
        }
        [HttpPost("createreport")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateReportRequestDto create)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found.");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid user ID claim.");
            }

            var report = create.ToReportRequestFromCreate();
            report.ReporterId = userId;

            await _reportRepo.CreateAsync(report);

            var reportDto = report.ToReportDTO();

            return CreatedAtAction(nameof(GetById), new { id = report.ReportId }, reportDto);
        }

        [HttpPut("{id}/Reject")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> UpdateIsProcess(int id)
        {
            var report = await _reportRepo.GetByIdAsync(id);
            if (report == null)
            {
                return NotFound($"Report with ID {id} not found.");
            }

            var updatedReport = await _reportRepo.UpdateIsProcessAsync(id);
            if (updatedReport == null)
            {
                return NotFound($"Unable to process report with ID {id}. User associated with ReportedUserId may not exist.");
            }
            var reportDto = updatedReport.ToReportDTO();
            return Ok(reportDto);
        }

        [HttpPut("{id}/Accept")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> UpdateIsProcessAndBanAccount(int id)
        {
            var report = await _reportRepo.GetByIdAsync(id);
            if (report == null)
            {
                return NotFound($"Report with ID {id} not found.");
            }

            var updatedReport = await _reportRepo.UpdateIsProcessAndBanAccountAsync(id);
            if (updatedReport == null)
            {
                return NotFound($"Unable to process report with ID {id}. User associated with ReportedUserId may not exist.");
            }

            var reportDto = updatedReport.ToReportDTO();
            return Ok(reportDto);
        }
    }
}
