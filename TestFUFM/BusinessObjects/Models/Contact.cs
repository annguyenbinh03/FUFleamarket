using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("Contact")]
public partial class Contact
{
    [Key]
    [Column("contactId")]
    public int ContactId { get; set; }

    [Column("user1")]
    public int User1 { get; set; }

    [Column("user2")]
    public int User2 { get; set; }

    [Column("isActive")]
    public bool IsActive { get; set; }

    [ForeignKey("User1")]
    [InverseProperty("ContactUser1Navigations")]
    public virtual User User1Navigation { get; set; } = null!;

    [ForeignKey("User2")]
    [InverseProperty("ContactUser2Navigations")]
    public virtual User User2Navigation { get; set; } = null!;
}
