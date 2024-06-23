using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("Feedback")]
public partial class Feedback
{
    [Key]
    [Column("feedbackId")]
    public int FeedbackId { get; set; }

    [Column("content")]
    [StringLength(250)]
    public string Content { get; set; } = null!;

    [Column("rating")]
    public int Rating { get; set; }

    [Column("orderId")]
    public int OrderId { get; set; }

    [Column("type")]
    [StringLength(10)]
    public string Type { get; set; } = null!;

    [Column("raterId")]
    public int RaterId { get; set; }

    [Column("ratedId")]
    public int RatedId { get; set; }

    [ForeignKey("OrderId")]
    [InverseProperty("Feedbacks")]
    public virtual Order Order { get; set; } = null!;
}
