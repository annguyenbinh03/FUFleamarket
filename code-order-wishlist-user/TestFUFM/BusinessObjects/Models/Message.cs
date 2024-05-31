using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("Message")]
public partial class Message
{
    [Key]
    [Column("messageId")]
    public int MessageId { get; set; }

    [Column("senderId")]
    public int SenderId { get; set; }

    [Column("receiverId")]
    public int ReceiverId { get; set; }

    [Column("messageText")]
    [StringLength(255)]
    public string MessageText { get; set; } = null!;

    [Column("time", TypeName = "datetime")]
    public DateTime? Time { get; set; }

    [Column("isRead")]
    public bool? IsRead { get; set; }

    [ForeignKey("ReceiverId")]
    [InverseProperty("MessageReceivers")]
    public virtual User Receiver { get; set; } = null!;

    [ForeignKey("SenderId")]
    [InverseProperty("MessageSenders")]
    public virtual User Sender { get; set; } = null!;
}
