using BusinessObjects;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Service.ContactCheck.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.ContactCheck
{

    public class ContactService : IContactService
    {
        private readonly FufleaMarketContext _context;

        public ContactService(FufleaMarketContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckAndManageContactAsync(int user1, int user2)
        {
            var activeOrder = await _context.Orders
            .AnyAsync(o => o.BuyerId == user1 && o.SellerId == user2                   
                     && (o.Status == 1 || o.Status == 3));

            var activeTradingOrder = await _context.TradingOrders
                .AnyAsync(to => to.User1 == user1 && to.User2 == user2                            
                                && (to.Status == 1 || to.Status == 3));
            if (activeOrder || activeTradingOrder)
            {
                var existingContact = await _context.Contacts
                    .FirstOrDefaultAsync(c => c.User1 == user1 && c.User2 == user2);

                if (existingContact == null)
                {
                    var newContact = new Contact { User1 = user1, User2 = user2, IsActive = true };
                    _context.Contacts.Add(newContact);
                    await _context.SaveChangesAsync();
                }
                else if (!existingContact.IsActive)
                {
                    existingContact.IsActive = true;
                    _context.Contacts.Update(existingContact);
                    await _context.SaveChangesAsync();
                }

                return true;
            }
            else
            {
                var existingContact = await _context.Contacts
                    .FirstOrDefaultAsync(c => c.User1 == user1 && c.User2 == user2);
                // thêm 1 biến ghi vào database khi nó false
                if (existingContact == null)
                {
                    var newContact = new Contact { User1 = user1, User2 = user2, IsActive = false };
                    _context.Contacts.Add(newContact);
                    await _context.SaveChangesAsync();
                }
                if (existingContact != null && existingContact.IsActive)
                {
                    existingContact.IsActive = false;
                    _context.Contacts.Update(existingContact);
                    await _context.SaveChangesAsync();
                }

                return false;
            }
        }

        public async Task CloseContactAsync(int user1, int user2)
        {
            var existingContact = await _context.Contacts
                .FirstOrDefaultAsync(c => c.User1 == user1 && c.User2 == user2);

            if (existingContact != null && existingContact.IsActive)
            {
                existingContact.IsActive = false;
                _context.Contacts.Update(existingContact);
                await _context.SaveChangesAsync();
            }
        }
        public async Task OpenContactAsync(int user1, int user2)
        {
            var existingContact = await _context.Contacts
                .FirstOrDefaultAsync(c => c.User1 == user1 && c.User2 == user2);

            if (existingContact != null && !existingContact.IsActive)
            {
                existingContact.IsActive = true;
                _context.Contacts.Update(existingContact);
                await _context.SaveChangesAsync();
            }
        }
        public async Task CreateContactAsync(int user1, int user2)
        {
            var existingContact = await _context.Contacts
                .FirstOrDefaultAsync(c => c.User1 == user1 && c.User2 == user2);

            if (existingContact == null)
            {
                var newContact = new Contact { User1 = user1, User2 = user2, IsActive = true };
                _context.Contacts.Add(newContact);
                await _context.SaveChangesAsync();
            }
            else
            {
                if (!existingContact.IsActive)
                {
                    existingContact.IsActive = true;
                    _context.Contacts.Update(existingContact);
                    await _context.SaveChangesAsync();
                }
            }
        }

        public async Task<bool> CheckContactStatusAsync(int user1, int user2)
        {
            var existingContact = await _context.Contacts
                .FirstOrDefaultAsync(c => c.User1 == user1 && c.User2 == user2);

            return existingContact?.IsActive ?? false;
        }
    }
}
        
        
    