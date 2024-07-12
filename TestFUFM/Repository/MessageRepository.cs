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

        public async Task<Message> CreateAMessageAsync(int chatRoom, int receiverId, string msg)
        {
            Message newMessage = new Message
            {
                ChatRoomId = chatRoom,
                ReceiverId = receiverId,
                MessageText = msg,
                CreatedDate = DateTime.Now.AddHours(7),
                IsRead = false
            };
            await _dbcontext.Messages.AddAsync(newMessage);
            await _dbcontext.SaveChangesAsync();
            return newMessage;
        }

        public async Task<List<Message>?> GetRoomMessages(int chatRoom)
        {
            var messages = await _dbcontext.Messages
                .Where(x => x.ChatRoomId == chatRoom)
                .Select(x => new Message
                {
                    MessageText = x.MessageText,
                    ReceiverId = x.ReceiverId,
                    CreatedDate = x.CreatedDate
                })            
                .ToListAsync();
            return messages;
        }
    }
}
