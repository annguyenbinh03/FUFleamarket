using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using BusinessObjects.Models;

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

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductImage> ProductImages { get; set; }

    public virtual DbSet<Promotion> Promotions { get; set; }

    public virtual DbSet<PromotionOrder> PromotionOrders { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source= ;Initial Catalog=FUFleaMarket;User ID=SA;Password=12345;TrustServerCertificate=True");
    //   LAPTOP-9MJD423N\\QUYDUC    
    //   DESKTOP-MQ0K2RJ\\SQLEXPRESS
    //   DESKTOP-IACSCNA\\DANTHU
    //   DESKTOP-JSUUR41\\SQLEXPRESS
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.AddressId).HasName("PK__Address__26A111AD231B657D");

            entity.HasOne(d => d.User).WithMany(p => p.Addresses)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Address_User");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__23CAF1D85441D044");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__2613FD24984B2A35");

            entity.HasOne(d => d.Order).WithMany(p => p.Feedbacks)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Feedback_Order");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__Message__4808B993049A446A");

            entity.HasOne(d => d.Receiver).WithMany(p => p.MessageReceivers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Message_User_receiver");

            entity.HasOne(d => d.Sender).WithMany(p => p.MessageSenders)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Message_User_sender");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Order__0809335DC8AE0CEF");

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
            entity.HasKey(e => e.ProductId).HasName("PK__Product__2D10D16AB78DACB7");

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Message_Category");

            entity.HasOne(d => d.Seller).WithMany(p => p.Products)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Product_User");
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => new { e.ProductId, e.ImageName }).HasName("FK_ProductImage_PrimaryKey");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductImages)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductImage_Product");
        });

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.PromotionId).HasName("PK__Promotio__99EB696EC4574786");
        });

        modelBuilder.Entity<PromotionOrder>(entity =>
        {
            entity.HasKey(e => e.PromoOrderId).HasName("PK__Promotio__BCD805E5DF6BE020");

            entity.HasOne(d => d.Promotion).WithMany(p => p.PromotionOrders)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PromotionOrder_Promotion");

            entity.HasOne(d => d.User).WithMany(p => p.PromotionOrders)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PromotionOrder_User");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__CB9A1CFF31C7D423");

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
