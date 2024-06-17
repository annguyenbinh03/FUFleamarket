using BusinessObjects.Models;
using BusinessObjects.MessageDto;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObjects;
namespace Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly FufleaMarketContext _dbcontext;
        
        public MessageRepository(FufleaMarketContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task CreateAMessageAsync(int chatRoom, int userId, string msg)
        {
            await _dbcontext.Messages.AddAsync(new Message
            {
                ChatRoomId = chatRoom,
                SenderId = userId,
                MessageText = msg,
                CreatedDate = DateTime.Now,
                IsRead = false
            });
            await _dbcontext.SaveChangesAsync();
        }
    }
}
