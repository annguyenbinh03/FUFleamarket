using System;
using System.Collections.Generic;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects;

public partial class FufleaMarketContext : DbContext
{
    public FufleaMarketContext()
    {
    }

    public FufleaMarketContext(DbContextOptions<FufleaMarketContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<ChatRoom> ChatRooms { get; set; }

    public virtual DbSet<Contact> Contacts { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Promotion> Promotions { get; set; }

    public virtual DbSet<PromotionOrder> PromotionOrders { get; set; }

    public virtual DbSet<PromotionTransaction> PromotionTransactions { get; set; }

    public virtual DbSet<TradingOrder> TradingOrders { get; set; }

    public virtual DbSet<TradingOrderDetail> TradingOrderDetails { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=DESKTOP-MQ0K2RJ\\SQLEXPRESS;Initial Catalog=FUFleaMarket;User ID=SA;Password=12345;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__23CAF1D8B83E8F7D");
        });

        modelBuilder.Entity<ChatRoom>(entity =>
        {
            entity.HasKey(e => e.ChatRoomId).HasName("PK__ChatRoom__CB58B492694111E3");

            entity.HasOne(d => d.User1Navigation).WithMany(p => p.ChatRoomUser1Navigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChatRoom_User1");

            entity.HasOne(d => d.User2Navigation).WithMany(p => p.ChatRoomUser2Navigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChatRoom_User2");
        });

        modelBuilder.Entity<Contact>(entity =>
        {
            entity.HasKey(e => e.ContactId).HasName("PK__Contact__7121FD351EA5B405");

            entity.HasOne(d => d.User1Navigation).WithMany(p => p.ContactUser1Navigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Contact_User1");

            entity.HasOne(d => d.User2Navigation).WithMany(p => p.ContactUser2Navigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Contact_User2");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__Message__4808B99370442C5A");

            entity.HasOne(d => d.ChatRoom).WithMany(p => p.Messages)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Message_ChatRoom");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Order__0809335D4C8A70D2");

            entity.HasOne(d => d.Buyer).WithMany(p => p.OrderBuyers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Order_UserBuy");

            entity.HasOne(d => d.Product).WithMany(p => p.Orders)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Order_Product");

            entity.HasOne(d => d.Seller).WithMany(p => p.OrderSellers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Order_UserSell");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Product__2D10D16AFBB9FACA");

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Message_Category");

            entity.HasOne(d => d.Seller).WithMany(p => p.Products)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Product_User");
        });

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.PromotionId).HasName("PK__Promotio__99EB696EC120866F");
        });

        modelBuilder.Entity<PromotionOrder>(entity =>
        {
            entity.HasKey(e => e.PromoOrderId).HasName("PK__Promotio__BCD805E5DB569DA1");

            entity.HasOne(d => d.Promotion).WithMany(p => p.PromotionOrders)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PromotionOrder_Promotion");

            entity.HasOne(d => d.User).WithMany(p => p.PromotionOrders)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PromotionOrder_User");
        });

        modelBuilder.Entity<PromotionTransaction>(entity =>
        {
            entity.HasKey(e => e.PromoTransactionId).HasName("PK__Promotio__76BA6198160FD54C");

            entity.HasOne(d => d.PromoOrder).WithMany(p => p.PromotionTransactions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PromotionTransaction_PromotionOrder");
        });

        modelBuilder.Entity<TradingOrder>(entity =>
        {
            entity.HasKey(e => e.TradingOrderId).HasName("PK__TradingO__EF3C7C73369BD48A");

            entity.HasOne(d => d.User1Navigation).WithMany(p => p.TradingOrderUser1Navigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TradingOrder_User1");

            entity.HasOne(d => d.User2Navigation).WithMany(p => p.TradingOrderUser2Navigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TradingOrder_User2");
        });

        modelBuilder.Entity<TradingOrderDetail>(entity =>
        {
            entity.HasKey(e => e.TradingOrderDetailId).HasName("PK__TradingO__9B566A8114A35634");

            entity.HasOne(d => d.TradingOrder).WithMany(p => p.TradingOrderDetails)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TradingOrderDetail_TradingOrder");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__CB9A1CFFD7DC8DB9");

            entity.Property(e => e.AcceptedTradingPercent).HasDefaultValue(10.0);
            entity.Property(e => e.BuyRating).HasDefaultValue(0.0);
            entity.Property(e => e.BuyTimes).HasDefaultValue(0);
            entity.Property(e => e.SellRating).HasDefaultValue(0.0);
            entity.Property(e => e.SellTimes).HasDefaultValue(0);

            entity.HasMany(d => d.ProductsNavigation).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "Wishlist",
                    r => r.HasOne<Product>().WithMany()
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_Wishlist_Product"),
                    l => l.HasOne<User>().WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_Wishlist_User"),
                    j =>
                    {
                        j.HasKey("UserId", "ProductId");
                        j.ToTable("Wishlist");
                        j.IndexerProperty<int>("UserId").HasColumnName("userId");
                        j.IndexerProperty<int>("ProductId").HasColumnName("productId");
                    });
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
