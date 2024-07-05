using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("TradingOrderDetail")]
public partial class TradingOrderDetail
{
    [Key]
    [Column("tradingOrderDetailId")]
    public int TradingOrderDetailId { get; set; }

    [Column("productId")]
    public int ProductId { get; set; }

    [Column("tradingOrderId")]
    public int TradingOrderId { get; set; }

    [Column("ownerId")]
    public int OwnerId { get; set; }

    [Column("quantity")]
    public int Quantity { get; set; }

    [Column("price", TypeName = "money")]
    public decimal Price { get; set; }

    [ForeignKey("TradingOrderId")]
    [InverseProperty("TradingOrderDetails")]
    public virtual TradingOrder TradingOrder { get; set; } = null!;
}
