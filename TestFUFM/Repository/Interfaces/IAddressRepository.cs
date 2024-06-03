using BusinessObjects.Models;
using BusinessObjects.AddressDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IAddressRepository
    {
        Task<List<Address>> GetAllAsync();
        Task<Address?> GetByIdAsync(int id);
        Task<Address> CreateAsync(Address addressModel);
        Task<Address?> UpdateAsync(int id, UpdateAddressRequestDto addressModel);
        Task<Address?> DeleteAsync(int id);
        Task<IEnumerable<Address>> GetAddressByIdAsync(int id);


    }
}
