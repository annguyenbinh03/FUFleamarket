using BusinessObjects.Models;
using BusinessObjects.AddressDto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObjects;

namespace Repository.Interfaces
{
    public class AddressRepository : IAddressRepository
    {
        private readonly FufleaMarketContext _dbcontext;

        public AddressRepository(FufleaMarketContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task<Address> CreateAsync(Address addressModel)
        {
            await _dbcontext.Addresses.AddAsync(addressModel);
            await _dbcontext.SaveChangesAsync();
            return addressModel;
        }

        public async Task<Address?> DeleteAsync(int id)
        {
            var addressModel = await _dbcontext.Addresses.FirstOrDefaultAsync(x => x.AddressId == id);
            if (addressModel == null)
            {
                return null;
            }
            _dbcontext.Addresses.Remove(addressModel);
            await _dbcontext.SaveChangesAsync();
            return addressModel;
        }

        public async Task<List<Address>> GetAllAsync()
        {
            return await _dbcontext.Addresses.ToListAsync();
        }

        public async Task<Address?> GetByIdAsync(int id)
        {
            return await _dbcontext.Addresses.FindAsync(id);
        }

        public async Task<Address?> UpdateAsync(int id, UpdateAddressRequestDto addressModel)
        {
            var existingAddress = await _dbcontext.Addresses.FindAsync(id);
            if (existingAddress == null)
            {
                return null;
            }
            existingAddress.SpecificAddress = addressModel.SpecificAddress;
            await _dbcontext.SaveChangesAsync();
            return existingAddress;
        }
        public async Task<IEnumerable<Address>> GetAddressByIdAsync(int id)
        {
            // Query the database to get addresses by User ID
            return await _dbcontext.Addresses.Where(address => address.UserId == id).ToListAsync();
        }
    }
}
