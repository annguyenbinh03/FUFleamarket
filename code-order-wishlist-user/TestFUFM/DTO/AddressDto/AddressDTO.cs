using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.AddressDto
{
    public class AddressDTO
    {
        public int AddressId { get; set; }
        public string SpecificAddress { get; set; } = null!;
    }
}
