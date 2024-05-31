using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[PrimaryKey("ProductId", "ImageName")]
[Table("ProductImage")]
public partial class ProductImage
{
    [Key]
    [Column("productId")]
    public int ProductId { get; set; }

    [Key]
    [Column("imageName")]
    [StringLength(50)]
    public string ImageName { get; set; } = null!;

    [Column("imageLink")]
    [StringLength(300)]
    public string ImageLink { get; set; } = null!;

    [ForeignKey("ProductId")]
    [InverseProperty("ProductImages")]
    public virtual Product Product { get; set; } = null!;
}
