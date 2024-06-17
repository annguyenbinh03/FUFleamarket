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
    [Column("chatRoomId")]
    public int ChatRoomId { get; set; }

    [Column("senderId")]
    public int SenderId { get; set; }

    [Column("messageText")]
    [StringLength(500)]
    public string MessageText { get; set; } = null!;

    [Column("createdDate", TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    [Column("isRead")]
    public bool? IsRead { get; set; }
}
