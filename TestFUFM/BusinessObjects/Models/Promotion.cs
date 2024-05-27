using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("Promotion")]
public partial class Promotion
{
    [Key]
    [Column("promotionId")]
    public int PromotionId { get; set; }

    [Column("name")]
    [StringLength(50)]
    public string Name { get; set; } = null!;

    [Column("description")]
    [StringLength(300)]
    public string Description { get; set; } = null!;

    [Column("period")]
    public int Period { get; set; }

    [Column("productQuantity")]
    public int ProductQuantity { get; set; }

    [Column("price", TypeName = "money")]
    public decimal Price { get; set; }

    [InverseProperty("Promotion")]
    public virtual ICollection<PromotionOrder> PromotionOrders { get; set; } = new List<PromotionOrder>();
}
