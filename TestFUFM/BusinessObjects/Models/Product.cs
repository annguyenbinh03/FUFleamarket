﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("Product")]
public partial class Product
{
    [Key]
    [Column("productId")]
    public int ProductId { get; set; }

    [Column("productName")]
    [StringLength(100)]
    public string ProductName { get; set; } = null!;

    [Column("price", TypeName = "money")]
    public decimal Price { get; set; }

    [Column("isNew")]
    public bool IsNew { get; set; }

    [Column("dealType")]
    public bool DealType { get; set; }

    [Column("description")]
    [StringLength(2000)]
    public string Description { get; set; } = null!;

    [Column("sellerId")]
    public int SellerId { get; set; }

    [Column("categoryId")]
    public int CategoryId { get; set; }

    [Column("status")]
    public int Status { get; set; }

    [Column("createdDate", TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [Column("imageLink")]
    [StringLength(300)]
    public string ImageLink { get; set; } = null!;

    [Column("storedQuantity")]
    public int StoredQuantity { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("Products")]
    public virtual Category Category { get; set; } = null!;

    [InverseProperty("Product")]
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    [ForeignKey("SellerId")]
    [InverseProperty("Products")]
    public virtual User Seller { get; set; } = null!;

    [ForeignKey("ProductId")]
    [InverseProperty("ProductsNavigation")]
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
