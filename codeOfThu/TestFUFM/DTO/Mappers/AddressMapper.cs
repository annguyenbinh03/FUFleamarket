using BusinessObjects.Models;
using DTO.AddressDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Mappers
{
    public static class AddressMapper
    {

        public static AddressDTO ToAddressDTO(this Address model)
        {
            return new AddressDTO
            {
                AddressId = model.AddressId,
                SpecificAddress = model.SpecificAddress,
            };
        }
    }
}
