using BusinessObjects.Models;
using BusinessObjects.FeedbackDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IFeedbackRepository
    {
        public Task<List<Feedback>> GetAllFeedbackAsync();
        public Task<Feedback?> GetFeedbackByIdAsync(int id);
        public Task<Feedback> CreateFeedbackAsync(Feedback feedbackModel);

        public Task<Feedback?> UpdateFeedbackAsync(int id, UpdateFeedbackRequestDto feedbackModel);
        public Task<Feedback?> DeleteFeedbackAsync(int id);
    }
}
