using BusinessObjects.Models;
using BusinessObjects.FeedbackDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Mappers
{
    public static class FeedbackMapper
    {
        public static FeedbackDTO ToFeedBackDTO(this BusinessObjects.Models.Feedback feedback)
        {
            return new FeedbackDTO
            {
                FeedbackId = feedback.FeedbackId,
                Content = feedback.Content,
                Rating = feedback.Rating,
                OrderId = feedback.OrderId
            };
        }
        public static Feedback ToCreateFeedbackDTO(this CreateFeedbackRequestDto createFeedback)
        {
            return new Feedback
            {
                Content = createFeedback.Content,
                Rating = createFeedback.Rating,
                OrderId = createFeedback.OrderId
            };
        }

    }
}
