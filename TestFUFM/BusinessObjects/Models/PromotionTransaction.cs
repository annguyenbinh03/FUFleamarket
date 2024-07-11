using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("PromotionTransaction")]
public partial class PromotionTransaction
{
    [Key]
    [Column("promoTransactionId")]
    public int PromoTransactionId { get; set; }

    [Column("promoOrderId")]
    public int PromoOrderId { get; set; }

    [Column("price", TypeName = "money")]
    public decimal Price { get; set; }

    [Column("paymentMethod")]
    [StringLength(100)]
    public string PaymentMethod { get; set; } = null!;

    [Column("transactionCode")]
    [StringLength(100)]
    public string TransactionCode { get; set; } = null!;

    [Column("transactionStatus")]
    [StringLength(10)]
    public string TransactionStatus { get; set; } = null!;

    [Column("quantity")]
    public int Quantity { get; set; }

    [Column("createdDate", TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    [ForeignKey("PromoOrderId")]
    [InverseProperty("PromotionTransactions")]
    public virtual PromotionOrder PromoOrder { get; set; } = null!;
}
