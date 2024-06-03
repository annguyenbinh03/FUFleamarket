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
        public async Task<Message> CreateAsync(Message messageModel)
        {
            await _dbcontext.Messages.AddAsync(messageModel);
            await _dbcontext.SaveChangesAsync();
            return messageModel;
        }

        public async Task<Message?> DeleteAsync(int id)
        {
            var messageModel = await _dbcontext.Messages.FirstOrDefaultAsync(x => x.MessageId == id);
                if (messageModel == null)
                {
                    return null;
                }
            _dbcontext.Messages.Remove(messageModel);
            await _dbcontext.SaveChangesAsync();
            return messageModel;

        }

        public async Task<List<Message>> GetAllAsync()
        {
            return await _dbcontext.Messages.ToListAsync();
        }

        public async Task<Message?> GetByIdAsync(int id)
        {
            return await _dbcontext.Messages.FindAsync(id);
        }

        public async Task<Message?> UpdateAsync(int id, UpdateMessageRequestDto messageModel)
        {
            var existingMessage = await _dbcontext.Messages.FindAsync(id);
            if (existingMessage == null)
            {
                return null;
            }
            
            existingMessage.MessageText = messageModel.MessageText;
            existingMessage.Time = messageModel.Time;
            existingMessage.IsRead = messageModel.IsRead;
            _dbcontext.SaveChanges();
            return existingMessage;
        }
    }
}
