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

    [Column("isDeleted")]
    public bool IsDeleted { get; set; }

    [Column("avarta")]
    [StringLength(500)]
    public string? Avarta { get; set; }

    [Column("createdDate", TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    [Column("sub")]
    [StringLength(100)]
    public string? Sub { get; set; }

    [Column("address")]
    [StringLength(255)]
    public string? Address { get; set; }

    [Column("acceptedTradingPercent")]
    public double? AcceptedTradingPercent { get; set; }

    [Column("buyRating")]
    public double? BuyRating { get; set; }

    [Column("buyTimes")]
    public int? BuyTimes { get; set; }

    [Column("sellRating")]
    public double? SellRating { get; set; }

    [Column("sellTimes")]
    public int? SellTimes { get; set; }

    [InverseProperty("User1Navigation")]
    public virtual ICollection<ChatRoom> ChatRoomUser1Navigations { get; set; } = new List<ChatRoom>();

    [InverseProperty("User2Navigation")]
    public virtual ICollection<ChatRoom> ChatRoomUser2Navigations { get; set; } = new List<ChatRoom>();

    [InverseProperty("User1Navigation")]
    public virtual ICollection<Contact> ContactUser1Navigations { get; set; } = new List<Contact>();

    [InverseProperty("User2Navigation")]
    public virtual ICollection<Contact> ContactUser2Navigations { get; set; } = new List<Contact>();

    [InverseProperty("Buyer")]
    public virtual ICollection<Order> OrderBuyers { get; set; } = new List<Order>();

    [InverseProperty("Seller")]
    public virtual ICollection<Order> OrderSellers { get; set; } = new List<Order>();

    [InverseProperty("Seller")]
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    [InverseProperty("User")]
    public virtual ICollection<PromotionOrder> PromotionOrders { get; set; } = new List<PromotionOrder>();

    [InverseProperty("ReportedUser")]
    public virtual ICollection<Report> ReportReportedUsers { get; set; } = new List<Report>();

    [InverseProperty("Reporter")]
    public virtual ICollection<Report> ReportReporters { get; set; } = new List<Report>();

    [InverseProperty("User1Navigation")]
    public virtual ICollection<TradingOrder> TradingOrderUser1Navigations { get; set; } = new List<TradingOrder>();

    [InverseProperty("User2Navigation")]
    public virtual ICollection<TradingOrder> TradingOrderUser2Navigations { get; set; } = new List<TradingOrder>();

    [ForeignKey("UserId")]
    [InverseProperty("Users")]
    public virtual ICollection<Product> ProductsNavigation { get; set; } = new List<Product>();
}
