using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web;
using BusinessObjects.Models;
using BusinessObjects.VNPay;
using Repository.Interfaces;
using WebAPI.Util;
using BusinessObjects.Models.Enum;
using Newtonsoft.Json.Linq;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VNPayController : ControllerBase
    {
        private readonly VNPaySettings _vnPaySettings;
        private readonly IPromotionOrderRepository _promotionOrder;
        private readonly IPromotionRepository _promotionRepo;
        private readonly IUserRepository _userRepo;

        public VNPayController(IOptions<VNPaySettings> vnPaySettings, IPromotionOrderRepository promotionOrder,
            IPromotionRepository promotionRepository, IUserRepository userRepository)
        {
            _vnPaySettings = vnPaySettings.Value;
            _promotionOrder = promotionOrder;
            _promotionRepo = promotionRepository;
            _userRepo = userRepository;
        }


        [HttpGet("payment/{userId:int}/{promotionId:int}")]
        public async Task<ActionResult> Payment(int userId, int promotionId)
        {
            string orderInfo = DateTime.Now.ToString("ddHHmmssyyyy");
            orderInfo = userId.ToString() + orderInfo;

            Promotion? promo = await _promotionRepo.GetByIdAsync(promotionId);
            bool isExistUser = await _userRepo.IsExistUser(userId);
            if (!isExistUser)
            {
                return Redirect("Người dùng k tồn tại");
            }
            int amountInt = 0;
            if (promo != null)
            {
                amountInt = Convert.ToInt32(promo.Price);
            }
            else
            {
                return Redirect("đường dẫn nếu phản hồi ko hợp lệ");
            }
            var amount = amountInt.ToString();


            //infor user and promotion
            string infor = userId.ToString() + "/" + promotionId.ToString();


            string hostName = System.Net.Dns.GetHostName();
            string clientIPAddress = System.Net.Dns.GetHostAddresses(hostName).GetValue(0).ToString();
            VNPayHelper pay = new VNPayHelper();
            amount += "00";
            pay.AddRequestData("vnp_Version", "2.1.0"); //Phiên bản api mà merchant kết nối. Phiên bản hiện tại là 2.1.0
            pay.AddRequestData("vnp_Command", "pay"); //Mã API sử dụng, mã cho giao dịch thanh toán là 'pay'
            pay.AddRequestData("vnp_TmnCode",
                _vnPaySettings
                    .TmnCode); //Mã website của merchant trên hệ thống của VNPAY (khi đăng ký tài khoản sẽ có trong mail VNPAY gửi về)
            pay.AddRequestData("vnp_Amount",
                amount); //số tiền cần thanh toán, công thức: số tiền * 100 - ví dụ 10.000 (mười nghìn đồng) --> 1000000
            pay.AddRequestData("vnp_BankCode",
                ""); //Mã Ngân hàng thanh toán (tham khảo: https://sandbox.vnpayment.vn/apis/danh-sach-ngan-hang/), có thể để trống, người dùng có thể chọn trên cổng thanh toán VNPAY
            pay.AddRequestData("vnp_CreateDate",
                DateTime.Now.ToString("yyyyMMddHHmmss")); //ngày thanh toán theo định dạng yyyyMMddHHmmss
            pay.AddRequestData("vnp_CurrCode", "VND"); //Đơn vị tiền tệ sử dụng thanh toán. Hiện tại chỉ hỗ trợ VND
            pay.AddRequestData("vnp_IpAddr", clientIPAddress); //Địa chỉ IP của khách hàng thực hiện giao dịch
            pay.AddRequestData("vnp_Locale", "vn"); //Ngôn ngữ giao diện hiển thị - Tiếng Việt (vn), Tiếng Anh (en)
            pay.AddRequestData("vnp_OrderInfo", infor); // thông tin user, promotionid
            pay.AddRequestData("vnp_OrderType",
                "other"); //topup: Nạp tiền điện thoại - billpayment: Thanh toán hóa đơn - fashion: Thời trang - other: Thanh toán trực tuyến
            pay.AddRequestData("vnp_ReturnUrl",
                _vnPaySettings.ReturnUrl); //URL thông báo kết quả giao dịch khi Khách hàng kết thúc thanh toán
            pay.AddRequestData("vnp_TxnRef", orderInfo); //mã hóa đơn

            string paymentUrl = pay.CreateRequestUrl(_vnPaySettings.Url, _vnPaySettings.HashSecret);
            return Redirect(paymentUrl);
        }

        [HttpGet("paymentconfirm")]
        public async Task<IActionResult> PaymentConfirm()
        {
            if (!Request.QueryString.HasValue)
            {
                return StatusCode(400, new { error = true, message = "QueryString is missing." });
            }

            var queryString = Request.QueryString.Value;
            var json = HttpUtility.ParseQueryString(queryString);

            long orderId = Convert.ToInt64(json["vnp_TxnRef"]); // Giống mã gửi sang VNPAY khi gửi yêu cầu thanh toán
            string orderInfo = json["vnp_OrderInfo"].ToString(); // thông tin user, promotionid
            long vnpayTranId = Convert.ToInt64(json["vnp_TransactionNo"]); // Mã giao dịch ghi nhận tại hệ thống VNPAY. Ví dụ: 20170829153052
            string vnp_ResponseCode = json["vnp_ResponseCode"].ToString(); // Response code
            string vnp_SecureHash = json["vnp_SecureHash"].ToString(); // Hash của dữ liệu trả về
            int pos = queryString.IndexOf("&vnp_SecureHash");

            bool checkSignature = ValidateSignature(queryString.Substring(1, pos - 1), vnp_SecureHash, _vnPaySettings.HashSecret);
            if (!checkSignature || _vnPaySettings.TmnCode != json["vnp_TmnCode"].ToString())
            {
                return StatusCode(400, new { error = true, message = "Invalid signature or incorrect merchant code." });
            }

            string[] parts = orderInfo.Split('/');

            int userId = Int32.Parse( parts[0]);
            int promotionId = Int32.Parse(parts[1]);

            Promotion? promotion = await _promotionRepo.GetByIdAsync(promotionId);

            PromotionOrder newPromoOrder = new PromotionOrder
            {
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(promotion.Period),
                UserId = userId,
                PaymentMethod = "VNPay",
                TransactionCode = vnpayTranId.ToString(),
                Price = promotion.Price,
              //  ProductQuantity = promotion.ProductQuantity,
                PromotionId = promotion.PromotionId
            };
           

            if (vnp_ResponseCode == "00")
            {
                newPromoOrder.Status = StatusPromotionOrderEnum.Completed.ToString();
                
            }
            else
            {
                newPromoOrder.Status = StatusPromotionOrderEnum.Failed.ToString();
            }
             await _promotionOrder.CreateAsync(newPromoOrder);
            //StatusCode(200, new { error = false, status = po.Status, orderId = orderInfo, transactionId = vnpayTranId });
            return Redirect("http://localhost/my-selling-package");

        }

        private bool ValidateSignature(string rspraw, string inputHash, string secretKey)
        {
            string myChecksum = VNPayHelper.HmacSHA512(secretKey, rspraw);
            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }
    }
}