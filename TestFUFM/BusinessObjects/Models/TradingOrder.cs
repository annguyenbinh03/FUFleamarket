using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("TradingOrder")]
public partial class TradingOrder
{
    [Key]
    [Column("tradingOrderId")]
    public int TradingOrderId { get; set; }

    [Column("user1")]
    public int User1 { get; set; }

    [Column("user2")]
    public int User2 { get; set; }

    [Column("note")]
    [StringLength(1000)]
    public string Note { get; set; } = null!;

    [Column("createdDate", TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    [Column("status")]
    public bool Status { get; set; }

    [InverseProperty("TradingOrder")]
    public virtual ICollection<TradingOrderDetail> TradingOrderDetails { get; set; } = new List<TradingOrderDetail>();

    [ForeignKey("User1")]
    [InverseProperty("TradingOrderUser1Navigations")]
    public virtual User User1Navigation { get; set; } = null!;

    [ForeignKey("User2")]
    [InverseProperty("TradingOrderUser2Navigations")]
    public virtual User User2Navigation { get; set; } = null!;
}
