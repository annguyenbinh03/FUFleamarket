using BusinessObjects.Models;
using BusinessObjects.AddressDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Mappers
{
    public static class AddressMapper
    {

        public static AddressDTO ToAddressDTO(this Address model)
        {
            return new AddressDTO
            {
                UserId = model.UserId,
                AddressId = model.AddressId,
                SpecificAddress = model.SpecificAddress,
            };
        }
        public static Address ToAddressFromCreate(this CreateAddressRequestDto AddressDto, int UserId)
        {
            return new Address
            {
                
                SpecificAddress = AddressDto.SpecificAddress,
                UserId = UserId,
            };
        }
        public static Address ToAddressFromUpdate(this UpdateAddressRequestDto AddressDto)
        {
            return new Address
            {              
                SpecificAddress = AddressDto.SpecificAddress,
            };
        }
    }
}
