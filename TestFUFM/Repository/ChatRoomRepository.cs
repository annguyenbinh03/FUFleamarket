using BusinessObjects;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObjects.Models;

namespace Repository
{
    public class ChatRoomRepository : IChatRoomRepository
    {
        private readonly FufleaMarketContext _dbcontext;

        public ChatRoomRepository(FufleaMarketContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<int> CreateAChatRoom(int userId, int receiverId)
        {
            ChatRoom newChatRoom = new ChatRoom
            {
                User1 = userId,
                User2 = receiverId
            };
            await _dbcontext.ChatRooms.AddAsync(newChatRoom);
            await _dbcontext.SaveChangesAsync();
            int roomId = newChatRoom.ChatRoomId;
            return roomId;
        }

        public async Task<int?> FindChatRoom(int userId, int receiverId)
        {
           int chatRoomId = await _dbcontext.ChatRooms.Where(x => (x.User1 == userId && x.User2 == receiverId) || (x.User1 == receiverId && x.User2 == userId)).Select( x=> x.ChatRoomId).FirstOrDefaultAsync();
            return chatRoomId;
        }
    }
}
