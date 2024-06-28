using BusinessObjects.Models;
using BusinessObjects.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;
using System.Linq;
using System.Threading.Tasks;
using DTO.PromotionTransactionDto;
using DTO.Mappers;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [Route("api/promotiontransaction")]
    [ApiController]
    public class PromotionTransactionController : ControllerBase
    {
        private readonly IPromotionTransactionRepository _promotionTransactionRepo;
        private readonly IPromotionOrderRepository _promotionOrderRepo;
        private readonly IPromotionRepository _promotionRepo;
        private readonly IUserRepository _userRepo;

        public PromotionTransactionController(IPromotionTransactionRepository promotionTransactionRepo, IPromotionOrderRepository promotionOrderRepo, IPromotionRepository promotionRepo, IUserRepository userRepo)
        {
            _promotionTransactionRepo = promotionTransactionRepo;
            _promotionOrderRepo = promotionOrderRepo;
            _promotionRepo = promotionRepo;
            _userRepo = userRepo;
        }

        [HttpGet("getallpromotiontransaction")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetAll()
        {
            // Lấy tất cả PromotionTransaction từ repository
            var promotionTransactions = await _promotionTransactionRepo.GetAllAsync();

            if (promotionTransactions == null || !promotionTransactions.Any())
            {
                return NotFound("No promotion transactions found.");
            }

            var promotionTransactionDtos = new List<DetailedPromotionTransactionDTO>();

            foreach (var transaction in promotionTransactions)
            {
                var promotionOrder = await _promotionOrderRepo.GetByIdAsync(transaction.PromoOrderId);
                if (promotionOrder != null)
                {
                    var promotion = await _promotionRepo.GetByIdAsync(promotionOrder.PromotionId);
                    var user = await _userRepo.GetByIdAsync(promotionOrder.UserId); 
                    if (promotion != null && user != null)
                    {
                        var dto = new DetailedPromotionTransactionDTO
                        {
                            PromoTransactionId = transaction.PromoTransactionId,
                            UserId = promotionOrder.UserId,
                            FullName = user.FullName,
                            Email = user.Email,
                            Avarta = user.Avarta,
                            CreatedDate = user.CreatedDate,
                            StartDate = transaction.StartDate,
                            EndDate = transaction.EndDate,
                            PaymentMethod = transaction.PaymentMethod,
                            TransactionCode = transaction.TransactionCode,
                            TransactionStatus = transaction.TransactionStatus,
                            Price = transaction.Price,
                            PromoOrderId = transaction.PromoOrderId,
                            PromotionId = promotion.PromotionId,
                            PromotionName = promotion.Name,
                            PromotionDescription = promotion.Description,
                            PromotionPeriod = promotion.Period,
                            PromotionProductQuantityLimit = promotion.ProductQuantityLimit,
                            PromotionPrice = promotion.Price,
                            PromotionOrderStatus = promotionOrder.Status                            
                            
                        };
                        promotionTransactionDtos.Add(dto);
                    }
                }
            }

            return Ok(promotionTransactionDtos);
        }


        [HttpGet("getallpromotiontransactionofuser")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetUserPromotionTransactions()
        {
            // Lấy UserId từ token
            var userIdClaim = User.FindFirstValue("UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid UserId format.");
            }

            // Lấy tất cả PromotionOrder thuộc về người dùng hiện tại
            var userPromotionOrders = await _promotionOrderRepo.GetAllByUserIdAsync(userId);
            if (userPromotionOrders == null || !userPromotionOrders.Any())
            {
                return NotFound("No promotion orders found for the current user.");
            }

            // Lấy tất cả PromotionTransaction tương ứng với các PromotionOrder của người dùng hiện tại
            var promotionTransactions = await _promotionTransactionRepo.GetByPromotionOrdersAsync(userPromotionOrders.Select(po => po.PromoOrderId).ToList());

            if (promotionTransactions == null || !promotionTransactions.Any())
            {
                return NotFound("No promotion transactions found for the current user.");
            }

            // Tạo danh sách DTO bao gồm thông tin từ PromotionOrder và Promotion
            var promotionTransactionDtos = new List<DetailedPromotionTransactionDTO>();

            foreach (var transaction in promotionTransactions)
            {
                var promotionOrder = userPromotionOrders.FirstOrDefault(po => po.PromoOrderId == transaction.PromoOrderId);
                if (promotionOrder != null)
                {
                    var promotion = await _promotionRepo.GetByIdAsync(promotionOrder.PromotionId);
                    var user = await _userRepo.GetByIdAsync(promotionOrder.UserId);

                    if (promotion != null)
                    {
                        var dto = new DetailedPromotionTransactionDTO
                        {
                            PromoTransactionId = transaction.PromoTransactionId,
                            UserId = promotionOrder.UserId,
                            FullName = user.FullName,
                            Email = user.Email,
                            Avarta = user.Avarta,
                            CreatedDate = user.CreatedDate,
                            StartDate = transaction.StartDate,
                            EndDate = transaction.EndDate,
                            PaymentMethod = transaction.PaymentMethod,
                            TransactionCode = transaction.TransactionCode,
                            TransactionStatus = transaction.TransactionStatus,
                            Price = transaction.Price,
                            PromoOrderId = transaction.PromoOrderId,
                            PromotionId = promotion.PromotionId,
                            PromotionName = promotion.Name,
                            PromotionDescription = promotion.Description,
                            PromotionPeriod = promotion.Period,
                            PromotionProductQuantityLimit = promotion.ProductQuantityLimit,
                            PromotionPrice = promotion.Price,
                            PromotionOrderStatus = promotionOrder.Status
                        };
                        promotionTransactionDtos.Add(dto);
                    }
                }
            }
            return Ok(promotionTransactionDtos);
        }

        // GET: api/promotiontransaction/order/{promoOrderId}
        [HttpGet("getbypromotionorderid/{promoOrderId:int}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetAllByPromotionOrderId([FromRoute] int promoOrderId)
        {
            var promotionOrder = await _promotionOrderRepo.GetByIdAsync(promoOrderId);
            if (promotionOrder == null)
            {
                return NotFound($"Promotion order with ID {promoOrderId} does not exist.");
            }

            var promotionTransactions = await _promotionTransactionRepo.GetAllByPromotionOrderIdAsync(promoOrderId);
            if (promotionTransactions == null || !promotionTransactions.Any())
            {
                return NotFound("No promotion transactions found for the current promotion order.");
            }

            var promotionTransactionDtos = promotionTransactions.Select(x => x.ToPromotionTransactionDTO());
            return Ok(promotionTransactionDtos);
        }

        // GET: api/promotiontransaction/{id}
        [HttpGet("getbypromotiontransactionid/{id:int}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var promotionTransaction = await _promotionTransactionRepo.GetByIdAsync(id);
            if (promotionTransaction == null)
            {
                return NotFound("Promotion transaction not found.");
            }

            return Ok(promotionTransaction.ToPromotionTransactionDTO());
        }

        // POST: api/promotiontransaction
        [HttpPost("create")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> Create([FromBody] CreatePromotionTransactionRequestDto createDto)
        {
            // Ensure that PromotionOrderId is valid
            var promotionOrder = await _promotionOrderRepo.GetByIdAsync(createDto.PromoOrderId);
            if (promotionOrder == null)
            {
                return BadRequest($"Promotion order with ID {createDto.PromoOrderId} does not exist.");
            }

            var promotionTransactionModel = createDto.ToPromotionTransactionFromCreate(createDto.PromoOrderId);
            await _promotionTransactionRepo.CreateAsync(promotionTransactionModel);

            var promotionTransactionDto = promotionTransactionModel.ToPromotionTransactionDTO();

            return CreatedAtAction(nameof(GetById), new { id = promotionTransactionModel.PromoTransactionId }, promotionTransactionDto);
        }

        // PUT: api/promotiontransaction/{id}
        [HttpPut("update/{id:int}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdatePromotionTransactionRequestDto updateDto)
        {
            // Kiểm tra đối tượng DTO có hợp lệ hay không
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingTransaction = await _promotionTransactionRepo.GetByIdAsync(id);
            if (existingTransaction == null)
            {
                return NotFound("Promotion transaction not found.");
            }

            // Cập nhật các trường từ DTO vào entity hiện có mà không thay đổi ID
            existingTransaction.Price = updateDto.Price;
            existingTransaction.PaymentMethod = updateDto.PaymentMethod;

            await _promotionTransactionRepo.UpdateAsync(existingTransaction);

            return Ok(existingTransaction.ToPromotionTransactionDTO);
        }


        // DELETE: api/promotiontransaction/{id}
        [HttpDelete("admin/delete/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var existingTransaction = await _promotionTransactionRepo.GetByIdAsync(id);
            if (existingTransaction == null)
            {
                return NotFound("Promotion transaction not found.");
            }

            await _promotionTransactionRepo.DeleteAsync(existingTransaction);
            return NoContent();
        }
    }
}
