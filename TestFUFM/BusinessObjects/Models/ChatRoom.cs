using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("ChatRoom")]
public partial class ChatRoom
{
    [Key]
    [Column("chatRoomId")]
    public int ChatRoomId { get; set; }

    [Column("user1")]
    public int User1 { get; set; }

    [Column("user2")]
    public int User2 { get; set; }

    [InverseProperty("ChatRoom")]
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    [ForeignKey("User1")]
    [InverseProperty("ChatRoomUser1Navigations")]
    public virtual User User1Navigation { get; set; } = null!;

    [ForeignKey("User2")]
    [InverseProperty("ChatRoomUser2Navigations")]
    public virtual User User2Navigation { get; set; } = null!;
}
