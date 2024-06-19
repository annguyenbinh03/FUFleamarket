
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Repository.Interfaces;
using Service.DataServices;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using BusinessObjects.Models;
using Microsoft.AspNetCore.Http;

namespace Service.Hubs
{
    public class ChatHub : Hub
    {
        private readonly SharedDb _shared;
        private IMessageRepository _messageRepo;
        private IChatRoomRepository _chatRoomRepository;

        public ChatHub(SharedDb sharedDb, IMessageRepository messsageRepo, IChatRoomRepository chatRoomRepo)
        {
            _shared = sharedDb;
            _messageRepo = messsageRepo;
            _chatRoomRepository = chatRoomRepo;
            
        }

        public async Task JoinChat(UserConnection conn)
        {
            await Clients.All.SendAsync("ReceiverMessage", "admin", $"{conn.UserName} has joined");
        }
        public async Task JoinSpecificChatRoom(UserConnection conn)
        {
            //check chatroom
            int? chatRoomId = await _chatRoomRepository.FindChatRoom(conn.UserId, conn.ReceiverId );
            if (chatRoomId == null || chatRoomId == 0)
            {
                chatRoomId = await _chatRoomRepository.CreateAChatRoom(conn.UserId, conn.ReceiverId);
            }
            if (chatRoomId == null)
            {
                chatRoomId = 1;
            }
            conn.ChatRoom = chatRoomId.ToString();

            await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatRoom);

            _shared.Connections[Context.ConnectionId] = conn;

            var messages = await _messageRepo.GetRoomMessages( Int32.Parse( conn.ChatRoom));


            await Clients.Group(conn.ChatRoom.ToString()).SendAsync("JoinSpecificChatRoom", messages);

        }


        //await Clients.Group(conn.ChatRoom.ToString()).SendAsync("JoinSpecificChatRoom", "admin", $"{conn.UserName} has joined {conn.ChatRoom}" );


        public async Task SendMessage(string msg)
        {
            if (_shared.Connections.TryGetValue(Context.ConnectionId, out UserConnection conn))
            {
                var message = await _messageRepo.CreateAMessageAsync(Int32.Parse(conn.ChatRoom), conn.ReceiverId, msg);
                await Clients.Group(conn.ChatRoom.ToString())
                    .SendAsync("ReceiveSpecificMessage", message);
                
            }
        }
    }
}
