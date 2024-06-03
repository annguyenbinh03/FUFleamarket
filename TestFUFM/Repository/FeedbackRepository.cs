using BusinessObjects.Models;
using BusinessObjects;
using BusinessObjects.FeedbackDto;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly FufleaMarketContext _dbcontext;

        public FeedbackRepository(FufleaMarketContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<Feedback> CreateFeedbackAsync(Feedback feedbackModel)
        {
            await _dbcontext.Feedbacks.AddAsync(feedbackModel);
            await _dbcontext.SaveChangesAsync();
            return feedbackModel;
        }

        public async Task<List<Feedback>> GetAllFeedbackAsync()
        {
            return await _dbcontext.Feedbacks.ToListAsync();

        }

        public async Task<Feedback?> GetFeedbackByIdAsync(int id)
        {
            return await _dbcontext.Feedbacks.FindAsync(id);
        }

        public async Task<Feedback?> UpdateFeedbackAsync([FromRoute]int id,[FromBody] UpdateFeedbackRequestDto feedbackModel)
        {
        
            var existingFeedback = await _dbcontext.Feedbacks.FirstOrDefaultAsync(u => u.FeedbackId == id);

            if (existingFeedback == null )
            {
                return null;
            }
            existingFeedback.Content = feedbackModel.Content;
            existingFeedback.Rating = feedbackModel.Rating;
            existingFeedback.OrderId = feedbackModel.OrderId;
            await _dbcontext.SaveChangesAsync();
            return existingFeedback;
        }
       

        public async Task<Feedback?> DeleteFeedbackAsync(int id)
        {
            var feedbackModel = await _dbcontext.Feedbacks.FirstOrDefaultAsync(x =>x.FeedbackId == id);
            if (feedbackModel == null)
            {
                return null;
            }
            _dbcontext.Feedbacks.Remove(feedbackModel);
            await _dbcontext.SaveChangesAsync();
            return feedbackModel;
        }
        

    }
}
