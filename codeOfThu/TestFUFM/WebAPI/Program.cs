
using BusinessObjects.Models;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System;
using DTO;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using Repository;

namespace WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //dotnet ef dbcontext scaffold -o Models -f -d "Data Source=DESKTOP-IACSCNA\DANTHU;Initial Catalog=FUFleaMarket;User ID=SA;Password=12345;TrustServerCertificate=True" "Microsoft.EntityFrameworkCore.SqlServer"

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
           
            builder.Services.AddControllers().AddNewtonsoftJson(options => { 
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            builder.Services.AddDbContext<FufleaMarketContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            builder.Services.AddScoped<IProductImageRepository, ProductImageRepository>();
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IProductReposity, ProductReposity>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
