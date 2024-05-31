using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Models;

[Table("Address")]
public partial class Address
{
    [Key]
    [Column("addressId")]
    public int AddressId { get; set; }

    [Column("userId")]
    public int UserId { get; set; }

    [Column("specificAddress")]
    [StringLength(255)]
    public string SpecificAddress { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Addresses")]
    public virtual User User { get; set; } = null!;
}
