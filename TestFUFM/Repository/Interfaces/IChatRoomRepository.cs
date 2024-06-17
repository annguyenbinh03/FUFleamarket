using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Repository.Interfaces
{
    public interface IChatRoomRepository
    {
        Task<int> CreateAChatRoom(int userId, int receiverId);
        Task<int?> FindChatRoom(int userId, int receiverId);
    }
}
