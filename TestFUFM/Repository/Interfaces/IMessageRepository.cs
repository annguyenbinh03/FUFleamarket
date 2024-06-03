using BusinessObjects.Models;
using BusinessObjects.MessageDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IMessageRepository
    {
        Task<List<Message>> GetAllAsync();
        Task<Message?> GetByIdAsync(int id);
        Task<Message> CreateAsync(Message messageModel);
        Task<Message?> UpdateAsync(int id, UpdateMessageRequestDto messageModel);
        Task<Message?> DeleteAsync(int id);
    }
}
