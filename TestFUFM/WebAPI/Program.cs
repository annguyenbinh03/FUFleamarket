
namespace WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //dotnet ef dbcontext scaffold -o Models -f -d "Data Source=DESKTOP-JSUUR41\SQLEXPRESS;Initial Catalog=FUFleaMarket;User ID=SA;Password=12345;TrustServerCertificate=True" "Microsoft.EntityFrameworkCore.SqlServer"

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

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
