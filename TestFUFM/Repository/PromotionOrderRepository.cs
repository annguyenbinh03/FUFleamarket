﻿using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObjects;
using BusinessObjects.Models.Enum;

namespace Repository
{
    public class PromotionOrderRepository : IPromotionOrderRepository
    {
        public readonly FufleaMarketContext _dbcontext;

        public PromotionOrderRepository(FufleaMarketContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task<PromotionOrder> CreateAsync(PromotionOrder promotionOrderModel)
        {
            await _dbcontext.AddAsync(promotionOrderModel);
            await _dbcontext.SaveChangesAsync();
            return promotionOrderModel;          
        }
       
        public async Task<List<PromotionOrder>> GetAllAsync()
        {
            return await _dbcontext.PromotionOrders.ToListAsync();
        }

        public async Task<IEnumerable<PromotionOrder>> GetAllByUserIdAsync(int userId)
        {
            return await _dbcontext.PromotionOrders.Where(po => po.UserId == userId).ToListAsync();
        }

        public async Task<PromotionOrder?> GetByIdAsync(int id)
        {
            var promotionOrder = await _dbcontext.PromotionOrders.FirstOrDefaultAsync(x => x.PromoOrderId == id);

            if (promotionOrder == null)
            {
                return null;
            }

            return promotionOrder;
        }

        public async Task<List<PromotionOrder>?> GetMyPromotionAsync(int userId)
        {
            return await _dbcontext.PromotionOrders.Where(po => po.UserId == userId).Include(x=>x.Promotion).ToListAsync();
        }

        public async Task<bool> PromotionExists(int id)
        {
            return await _dbcontext.Promotions.AnyAsync(x => x.PromotionId == id);
        }
        public async Task<PromotionOrder> UpdateAsync(PromotionOrder promotionOrderModel)
        {
            if (promotionOrderModel == null)
                throw new ArgumentNullException(nameof(promotionOrderModel));

            var existingOrder = await _dbcontext.PromotionOrders.FirstOrDefaultAsync(x => x.PromoOrderId == promotionOrderModel.PromoOrderId);
            if (existingOrder == null)
            {
                throw new KeyNotFoundException($"No PromotionOrder found with ID {promotionOrderModel.PromotionId}");
            }

            existingOrder.Status = promotionOrderModel.Status;
            //    existingOrder.EndDate = promotionOrderModel.EndDate;
            //     existingOrder.StartDate = promotionOrderModel.StartDate;
            //     existingOrder.Price = promotionOrderModel.Price;
            // existingOrder.ProductQuantity = promotionOrderModel.ProductQuantity;
            //     existingOrder.PaymentMethod = promotionOrderModel.PaymentMethod;

            await _dbcontext.SaveChangesAsync();

            return existingOrder;
        }
        public async Task<PromotionOrder?> GetByUserIdAndPromotionIdAsync(int userId, int promotionId)
        {
            return await _dbcontext.PromotionOrders
                .FirstOrDefaultAsync(po => po.UserId == userId && po.PromotionId == promotionId);
        }


        public async Task<IEnumerable<PromotionOrder>> GetByUserIdAsync(int userId)
        {
            return await _dbcontext.PromotionOrders
                                 .Where(po => po.UserId == userId)
                                 .ToListAsync();
        }


        public async Task<List<PromotionOrder>> UpdatePromotionPackagesAsync()
        {
            // Lấy tất cả các gói khuyến mãi có trạng thái là "active"
            var activePackages = await _dbcontext.PromotionOrders
                                                 .Where(po => po.Status == StatusPromotionOrderEnum.Active.ToString())
                                                 .OrderByDescending(po => po.PromoOrderId) // Sắp xếp theo ID giảm dần
                                                 .ToListAsync();

            var updatedPackages = new List<PromotionOrder>();

            // Duyệt qua từng gói khuyến mãi
            foreach (var package in activePackages)
            {
                // Giảm RemainDate đi 1
                package.RemainedDate -= 1;

                // Nếu RemainDate bằng 0, chuyển trạng thái thành "inactive"
                if (package.RemainedDate <= 0)
                {
                    package.Status = StatusPromotionOrderEnum.InActive.ToString();

                    // Tìm gói khuyến mãi có trạng thái "pending" và ID thấp hơn ID hiện tại
                    var pendingPackage = await _dbcontext.PromotionOrders
                                                         .Where(po => po.Status == StatusPromotionOrderEnum.Pending.ToString() && po.PromoOrderId < package.PromoOrderId)
                                                         .OrderByDescending(po => po.PromoOrderId)
                                                         .FirstOrDefaultAsync();

                    if (pendingPackage != null)
                    {
                        // Chuyển trạng thái của gói "pending" thành "active"
                        pendingPackage.Status = StatusPromotionOrderEnum.Active.ToString();
                        updatedPackages.Add(pendingPackage);
                        _dbcontext.PromotionOrders.Update(pendingPackage);
                    }
                }

                // Cập nhật lại đối tượng gói khuyến mãi trong DbContext
                _dbcontext.PromotionOrders.Update(package);

                // Thêm gói khuyến mãi đã được cập nhật vào danh sách
                updatedPackages.Add(package);
            }

            // Lưu các thay đổi vào cơ sở dữ liệu
            await _dbcontext.SaveChangesAsync();

            // Trả về danh sách các gói khuyến mãi đã được cập nhật
            return updatedPackages;
        }


    }
}
