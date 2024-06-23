using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("PromotionOrder")]
public partial class PromotionOrder
{
    [Key]
    [Column("promoOrderId")]
    public int PromoOrderId { get; set; }

    [Column("endDate", TypeName = "datetime")]
    public DateTime EndDate { get; set; }

    [Column("userId")]
    public int UserId { get; set; }

    [Column("promotionId")]
    public int PromotionId { get; set; }

    [Column("status")]
    [StringLength(10)]
    public string Status { get; set; } = null!;

    [ForeignKey("PromotionId")]
    [InverseProperty("PromotionOrders")]
    public virtual Promotion Promotion { get; set; } = null!;

    [InverseProperty("PromoOrder")]
    public virtual ICollection<PromotionTransaction> PromotionTransactions { get; set; } = new List<PromotionTransaction>();

    [ForeignKey("UserId")]
    [InverseProperty("PromotionOrders")]
    public virtual User User { get; set; } = null!;
}
