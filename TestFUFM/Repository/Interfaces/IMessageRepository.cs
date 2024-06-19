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
        Task<Message> CreateAMessageAsync(int chatRoom,int receiverId, string msg);
        Task<List<Message>?> GetRoomMessages(int chatRoom);
    }   
}
