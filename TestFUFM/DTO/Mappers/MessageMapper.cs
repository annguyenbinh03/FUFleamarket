using BusinessObjects.Models;
using BusinessObjects.AddressDto;
using BusinessObjects.MessageDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Mappers
{
    public static class MessageMapper
    {
        public static MessageDTO ToMessageDTO(this Message model)
        {
            return new MessageDTO
            {
                MessageId = model.MessageId,
                SenderId = model.SenderId,
                ReceiverId = model.ReceiverId,
                MessageText = model.MessageText,
                Time = model.Time,
                IsRead = model.IsRead,
            };
        }
        public static Message ToMessageFromCreateDTO(this CreateMessageRequestDto CreateModel, int SenderId, int ReceiverId)
        {
            return new Message
            {
                SenderId = SenderId,
                ReceiverId = ReceiverId,
                MessageText = CreateModel.MessageText,
                Time = CreateModel.Time,
                IsRead = CreateModel.IsRead,
            };
        }
    }
}
