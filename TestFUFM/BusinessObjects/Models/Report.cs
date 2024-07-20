using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("Report")]
public partial class Report
{
    [Key]
    [Column("reportId")]
    public int ReportId { get; set; }

    [Column("reporterId")]
    public int? ReporterId { get; set; }

    [Column("reportedUserId")]
    public int? ReportedUserId { get; set; }

    [Column("reason")]
    [StringLength(1000)]
    [Unicode(false)]
    public string? Reason { get; set; }

    [Column("isProcessed")]
    public bool? IsProcessed { get; set; }

    [Column("createdDate", TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [ForeignKey("ReportedUserId")]
    [InverseProperty("ReportReportedUsers")]
    public virtual User? ReportedUser { get; set; }

    [ForeignKey("ReporterId")]
    [InverseProperty("ReportReporters")]
    public virtual User? Reporter { get; set; }
}
