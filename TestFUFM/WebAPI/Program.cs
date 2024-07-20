using BusinessObjects;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repository.Interfaces;
using Repository;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Service.DataServices;
using Service.Hubs;
using WebAPI.Util;
using BusinessObjects.VNPay;
using Service.CalculatePromotioTransactionMonthlyTotal;
using Service.CalculateProductMonthlyTotal;
using Service.CalculateProductMonthlyTotal.Interfaces;
using Service.CalculateOrderMonthlyTotal.Interfaces;
using Service.CalculateOrderMonthlyTotal;
using Service.CalculatePromotioTransactionMonthlyTotal.Interfaces;
using Service.ContactCheck.Interfaces;
using Service.ContactCheck;
using Service.BackgroudService;
using Service.CheckProductHasActiveOrder;
using Service.CheckProductHasActiveOrder.Interfaces;


public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var configuration = builder.Configuration;

        // Cấu hình dịch vụ
        builder.Services.AddSignalR();
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API Name", Version = "v1" });

            // Thêm xác thực JWT vào Swagger
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme",
                Type = SecuritySchemeType.Http,
                Scheme = "bearer"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
            });
        });

        builder.Services.AddControllers().AddNewtonsoftJson(options =>
        {
            options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        });

        // Cấu hình xác thực JWT
        var jwtSettings = builder.Configuration.GetSection("JWT");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"]);

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(key)
            };
        });

        // Cấu hình phân quyền
        builder.Services.AddAuthorization(options =>
        {
            // Loại bỏ chính sách phân quyền Admin hiện tại
            options.DefaultPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
                .RequireAuthenticatedUser()
                .Build();
        });

        // Cấu hình middleware xác thực Google
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
        })
.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
.AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
{
    var googleSettings = configuration.GetSection("Google");
    options.ClientId = googleSettings["ClientId"];
    options.ClientSecret = googleSettings["ClientSecret"];
    options.Scope.Add("profile");
    options.Scope.Add("email");
    options.ClaimActions.MapJsonKey("picture", "picture", "url");

});

        // Cấu hình DbContext
        builder.Services.AddDbContext<FufleaMarketContext>(options =>
        {
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
        });

        // Đăng ký các repository
        builder.Services.AddScoped<IOrderRepository, OrderRepository>();
        builder.Services.AddScoped<IWishlistRepository, WishlistRepository>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IPromotionOrderRepository, PromotionOrderRepository>();
        builder.Services.AddScoped<IPromotionRepository, PromotionRepository>();
        builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
        builder.Services.AddScoped<IProductReposity, ProductReposity>();
        builder.Services.AddScoped<IChatRoomRepository, ChatRoomRepository>();
        builder.Services.AddScoped<IMessageRepository, MessageRepository>();
        builder.Services.AddScoped<IPromotionTransactionRepository, PromotionTransactionRepository>();
        builder.Services.AddScoped<IPromotionTransactionService, PromotionTransactionService>();
        builder.Services.AddScoped<IProductService, ProductService>();
        builder.Services.AddScoped<IOrderService, OrderService>();
        builder.Services.AddSingleton<VNPayHelper>();
        builder.Services.AddScoped<ITradingOrderRepository, TradingOrderRepository>();
        builder.Services.AddScoped<ITradingOrderDetailRepository, TradingOrderDetailRepository>();
        builder.Services.AddScoped<IContactService, ContactService>();
        builder.Services.AddHostedService<PromotionPackagesService>();
        builder.Services.AddScoped<ICheckProduct, CheckProductHascActiveOrder>();
        builder.Services.AddScoped<StatusTradingOrderService>();
        builder.Services.AddScoped<StatusOrderService>();
        builder.Services.AddScoped<IReportRepository, ReportRepository>();
        // VNPay setting 
        builder.Services.Configure<VNPaySettings>(configuration.GetSection("VNPaySettings"));


        builder.Services.AddCors(opt =>
        {
            opt.AddPolicy("reactApp", builder =>
            {
                builder.WithOrigins("http://localhost")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
            });
        });

        builder.Services.AddCors(opt =>
        {
            opt.AddPolicy("reactAzure", builder =>
            {
                builder.WithOrigins("https://fufleamarket.azurewebsites.net")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
            });
        });

        builder.Services.AddSingleton<SharedDb>();

        var app = builder.Build();

        // Cấu hình Swagger

        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API Name v1"));


        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
        app.MapHub<ChatHub>("/Chat");
        app.UseCors("reactApp");
        app.UseCors("reactAzure");
        app.Run();
    }
}