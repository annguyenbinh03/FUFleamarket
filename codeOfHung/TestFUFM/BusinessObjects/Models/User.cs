using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("User")]
public partial class User
{
    [Key]
    [Column("userId")]
    public int UserId { get; set; }

    [Column("password")]
    [StringLength(20)]
    public string? Password { get; set; }

    [Column("fullName")]
    [StringLength(30)]
    public string? FullName { get; set; }

    [Column("email")]
    [StringLength(40)]
    public string Email { get; set; } = null!;

    [Column("phoneNumber")]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [Column("introduction")]
    [StringLength(300)]
    public string? Introduction { get; set; }

    [Column("roleId")]
    public int RoleId { get; set; }

    [Column("status")]
    public bool Status { get; set; }

    [Column("avarta")]
    [StringLength(200)]
    public string? Avarta { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

    [InverseProperty("Receiver")]
    public virtual ICollection<Message> MessageReceivers { get; set; } = new List<Message>();

    [InverseProperty("Sender")]
    public virtual ICollection<Message> MessageSenders { get; set; } = new List<Message>();

    [InverseProperty("Buyer")]
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    [InverseProperty("Seller")]
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    [InverseProperty("User")]
    public virtual ICollection<PromotionOrder> PromotionOrders { get; set; } = new List<PromotionOrder>();

    [ForeignKey("UserId")]
    [InverseProperty("Users")]
    public virtual ICollection<Product> ProductsNavigation { get; set; } = new List<Product>();
}
