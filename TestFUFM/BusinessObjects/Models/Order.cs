using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("Order")]
public partial class Order
{
    [Key]
    [Column("orderId")]
    public int OrderId { get; set; }

    [Column("price", TypeName = "money")]
    public decimal Price { get; set; }

    [Column("buyerId")]
    public int BuyerId { get; set; }

    [Column("sellerId")]
    public int SellerId { get; set; }

    [Column("paymentMethod")]
    [StringLength(20)]
    public string PaymentMethod { get; set; } = null!;

    [Column("status")]
    public int Status { get; set; }

    [Column("note")]
    [StringLength(1000)]
    public string? Note { get; set; }

    [Column("productId")]
    public int ProductId { get; set; }

    [Column("quantity")]
    public int Quantity { get; set; }

    [Column("receiverAddress")]
    [StringLength(255)]
    public string ReceiverAddress { get; set; } = null!;

    [Column("createdDate", TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    [ForeignKey("BuyerId")]
    [InverseProperty("OrderBuyers")]
    public virtual User Buyer { get; set; } = null!;

    [InverseProperty("Order")]
    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    [ForeignKey("ProductId")]
    [InverseProperty("Orders")]
    public virtual Product Product { get; set; } = null!;

    [ForeignKey("SellerId")]
    [InverseProperty("OrderSellers")]
    public virtual User Seller { get; set; } = null!;
}
