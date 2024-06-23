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

    [Column("startDate", TypeName = "datetime")]
    public DateTime StartDate { get; set; }

    [Column("endDate", TypeName = "datetime")]
    public DateTime EndDate { get; set; }

    [Column("userId")]
    public int UserId { get; set; }

    [Column("price", TypeName = "money")]
    public decimal Price { get; set; }

    [Column("productQuantityLimit")]
    public int ProductQuantityLimit { get; set; }

    [Column("promotionId")]
    public int PromotionId { get; set; }

    [Column("paymentMethod")]
    [StringLength(100)]
    public string PaymentMethod { get; set; } = null!;

    [Column("transactionCode")]
    [StringLength(100)]
    public string TransactionCode { get; set; } = null!;

    [Column("status")]
    [StringLength(10)]
    public string Status { get; set; } = null!;

    [ForeignKey("PromotionId")]
    [InverseProperty("PromotionOrders")]
    public virtual Promotion Promotion { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("PromotionOrders")]
    public virtual User User { get; set; } = null!;
}
