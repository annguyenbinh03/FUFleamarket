using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.AddressDto
{
    public class AddressDTO
    {
        public int AddressId { get; set; }
        public int? UserId { get; set; }
        public string SpecificAddress { get; set; } = null!;
        
    }
}
