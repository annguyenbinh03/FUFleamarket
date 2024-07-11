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




        /// <summary>
        /// kiểm tra liên lạc của order 
        /// </summary>
        /// <param name="user1"></param>
        /// <param name="user2"></param>
        /// <returns></returns>
        public async Task<bool> CheckContactAsync(int user1, int user2)
        {

            var activeOrder = await _context.Orders
            .AnyAsync(o => ((o.BuyerId == user1 && o.SellerId == user2))
                       && o.Status == 1);


            var activeTradingOrder = await _context.TradingOrders
               .AnyAsync(to => ((to.User1 == user1 && to.User2 == user2))
                         && to.Status == 1);

            return activeOrder || activeTradingOrder;

        }



        /// <summary>
        /// Đóng liên lạc 
        /// </summary>
        /// <param name="user1"></param>
        /// <param name="user2"></param>
        /// <returns></returns>
        public async Task CloseContactAsync(int user1, int user2)
        {

            var existingContact = await _context.Contacts
                 .FirstOrDefaultAsync(c => (c.User1 == user1 && c.User2 == user2)
                                       || (c.User1 == user2 && c.User2 == user1));

            if (existingContact != null)
            {
                existingContact.IsActive = false;
                await _context.SaveChangesAsync();
            }
        }







        /// <summary>
        /// Mở liên lạc 
        /// </summary>
        /// <param name="user1"></param>
        /// <param name="user2"></param>
        /// <returns></returns>
        public async Task OpenContactAsync(int user1, int user2)
        {
            bool canContact = await CheckContactAsync(user1, user2) || await CheckContactAsync(user2, user1);

            if (canContact)
            {
                await CreateContactAsync(user1, user2);
            }
        }






        /// <summary>
        /// Tạo liên lạc 
        /// </summary>
        /// <param name="user1"></param>
        /// <param name="user2"></param>
        /// <returns></returns>
        public async Task CreateContactAsync(int user1, int user2)
        {
            var existingContact = await _context.Contacts
                 .FirstOrDefaultAsync(c => (c.User1 == user1 && c.User2 == user2) ||
                                          (c.User1 == user2 && c.User2 == user1));

            if (existingContact == null)
            {
                var newContact = new Contact
                {
                    User1 = user1,
                    User2 = user2,
                    IsActive = true,
                };

                _context.Contacts.Add(newContact);
                await _context.SaveChangesAsync();
            }
            else if (!existingContact.IsActive)
            {
                existingContact.IsActive = true;
                await _context.SaveChangesAsync();
            }
        }


    }
}


