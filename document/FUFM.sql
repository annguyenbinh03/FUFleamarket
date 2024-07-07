﻿GO
IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'FUFleaMarket')
   DROP DATABASE [FUFleaMarket]
GO
CREATE DATABASE [FUFleaMarket]
GO
GO
USE [FUFleaMarket]
GO


CREATE TABLE [dbo].[User](
	[userId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[password]  NVARCHAR(20) NULL,
	[fullName] NVARCHAR(30) NULL,
	[email] NVARCHAR(40) NOT NULL,
	[phoneNumber] NVARCHAR(20) NULL,
	[introduction] NVARCHAR(300) NULL,
	[roleId] INT NOT NULL,
	[isDeleted] BIT NOT NULL,
	[avarta] NVARCHAR(500) NULL,
	[createdDate] DATETIME NOT NULL,
	[sub] NVARCHAR(100) NULL,
	[buyRating] FLOAT DEFAULT 0,
	[sellRating] FLOAT DEFAULT 0
)

CREATE TABLE [dbo].[Address](
	[addressId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[userId] INT NOT NULL,
	[specificAddress]  NVARCHAR(255) NOT NULL,
	CONSTRAINT FK_Address_User FOREIGN KEY ([userId]) REFERENCES [dbo].[User] ([userId])
)



CREATE TABLE [dbo].[Category](
	[categoryId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[name] NVARCHAR(50) NOT NULL,
	[imageLink] NVARCHAR(300) NULL,
	[iconLink] NVARCHAR(300) NULL
) 

CREATE TABLE [dbo].[Product](
	[productId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
	[productName] NVARCHAR(100) NOT NULL,
	[price] MONEY NOT NULL,
	[isNew] BIT NOT NULL,
	[dealType] BIT NOT NULL,
	[description] NVARCHAR(2000) NOT NULL,
	[sellerId] INT NOT NULL,
	[categoryId] INT NOT NULL,
	[status] INT NOT NULL,
	[createdDate] DATETIME NULL,
	[imageLink] NVARCHAR(300) NOT NULL,
	[storedQuantity] INT NOT NULL DEFAULT 0,
	CONSTRAINT FK_Product_User FOREIGN KEY ([sellerId]) REFERENCES [dbo].[User] ([userId]),
	CONSTRAINT FK_Message_Category FOREIGN KEY ([categoryId]) REFERENCES [dbo].[Category] ([categoryId])
)

CREATE TABLE [dbo].[ProductImage](
	[productId] INT NOT NULL, 
	[imageName] NVARCHAR(50) NOT NULL,
	[imageLink] NVARCHAR(300) NOT NULL,
	CONSTRAINT FK_ProductImage_PrimaryKey PRIMARY KEY ([productId], [imageName]) ,
	CONSTRAINT FK_ProductImage_Product FOREIGN KEY ([productId]) REFERENCES [dbo].[Product] ([productId])
)

CREATE TABLE [dbo].[Wishlist](
	[userId] INT NOT NULL,
	[productId] INT NOT NULL,
	CONSTRAINT PK_Wishlist PRIMARY KEY ([userId], [productId]),
	CONSTRAINT FK_Wishlist_User FOREIGN KEY ([userId]) REFERENCES [dbo].[User] ([userId]),
	CONSTRAINT FK_Wishlist_Product FOREIGN KEY ([productId]) REFERENCES [dbo].[Product] ([productId])
)

CREATE TABLE [dbo].[Promotion](
	[promotionId] INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[name] NVARCHAR(50) NOT NULL,
	[description] NVARCHAR(300) NOT NULL,
	[period] INT NOT NULL,
	[productQuantityLimit] INT NOT NULL,
	[price] MONEY NOT NULL,
	[imageLink]  NVARCHAR(300) NOT NULL,
	[isDeleted] BIT NOT NULL
)

CREATE TABLE [dbo].[PromotionOrder](
	[promoOrderId] INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[endDate] DATETIME NOT NULL,
	[userId] INT NOT NULL,
	[promotionId] INT NOT NULL,
	[status] NVARCHAR(10) NOT NULL,
	CONSTRAINT FK_PromotionOrder_Promotion FOREIGN KEY ([promotionId]) REFERENCES [dbo].[Promotion] ([promotionId]),
	CONSTRAINT FK_PromotionOrder_User FOREIGN KEY ([userId]) REFERENCES [dbo].[User] ([userId])
)



CREATE TABLE [dbo].[PromotionTransaction](
	[promoTransactionId] INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[startDate] DATETIME NOT NULL,
	[endDate] DATETIME NOT NULL,
	[promoOrderId] INT NOT NULL,
	[price] MONEY NOT NULL, 
	[paymentMethod] NVARCHAR(100) NOT NULL,
	[transactionCode] NVARCHAR(100) NOT NULL,
	[transactionStatus] NVARCHAR(10) NOT NULL,
	[createdDate] DATETIME NOT NULL,
	CONSTRAINT FK_PromotionTransaction_PromotionOrder FOREIGN KEY ([promoOrderId]) REFERENCES [dbo].[PromotionOrder]([promoOrderId])
) 



CREATE TABLE [dbo].[Order](
	[orderId]  INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
	[orderDate] DATETIME NOT NULL,
	[price] MONEY NOT NULL,
	[buyerId] INT NOT NULL,
	[sellerId] INT NOT NULL,
	[paymentMethod] NVARCHAR(20) NOT NULL,
	[status] INT NOT NULL,
	[note] NVARCHAR(1000),
	[productId] INT NOT NULL,
	[quantity] INT NOT NULL,
	[deliveryDate] DATETIME NULL,
	[receiverAddress] NVARCHAR(255) NOT NULL,
	CONSTRAINT FK_Order_UserBuy FOREIGN KEY ([buyerId]) REFERENCES [dbo].[User] ([userId]),
	CONSTRAINT FK_Order_UserSell FOREIGN KEY ([sellerId]) REFERENCES [dbo].[User] ([userId]),
	CONSTRAINT FK_Order_Product  FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([productId])
)


CREATE TABLE [dbo].[Feedback](
	[feedbackId]  INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
	[content] NVARCHAR(250) NOT NULL,
	[rating] INT NOT NULL,
	[orderId]  INT NOT NULL, 
	[type] NVARCHAR(10) NOT NULL,
	[raterId] INT NOT NULL,
	[ratedId] INT NOT NULL,
	CONSTRAINT FK_Feedback_Order FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order] ([orderId])
)

CREATE TABLE [dbo].[ChatRoom](
	[chatRoomId]  INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
	[user1] INT NOT NULL,
	[user2] INT NOT NULL,
	CONSTRAINT FK_ChatRoom_User1 FOREIGN KEY ([user1]) REFERENCES [dbo].[User] ([userId]),
	CONSTRAINT FK_ChatRoom_User2 FOREIGN KEY ([user2]) REFERENCES [dbo].[User] ([userId])
)

CREATE TABLE [dbo].[Message](
	[messageId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[chatRoomId] INT NOT NULL, 
	[receiverId] INT NOT NULL,
	[messageText] NVARCHAR(500) NOT NULL,
	[createdDate] DATETIME NOT NULL,
	[isRead] BIT NOT NULL,
	CONSTRAINT FK_Message_ChatRoom FOREIGN KEY ([chatRoomId]) REFERENCES [dbo].[ChatRoom]([chatRoomId])
)


CREATE TABLE [dbo].[TradingOrder](
	[tradingOrderId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[user1] INT NOT NULL, 
	[user2] INT NOT NULL,
	[note] NVARCHAR(1000) NOT NULL,
	[createdDate] DATETIME NOT NULL,
	[status] BIT NOT NULL,
	CONSTRAINT FK_TradingOrder_User1 FOREIGN KEY ([user1]) REFERENCES [dbo].[User]([userId]),
    CONSTRAINT FK_TradingOrder_User2 FOREIGN KEY ([user2]) REFERENCES [dbo].[User]([userId])
)

CREATE TABLE [dbo].[TradingOrderDetail](
	[tradingOrderDetailId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[productId] INT NOT NULL, 
	[tradingOrderId] INT NOT NULL,
	[ownerId] INT NOT NULL,
	[quantity] INT NOT NULL,
	[price] MONEY NOT NULL,
	CONSTRAINT FK_TradingOrderDetail_TradingOrder FOREIGN KEY ([tradingOrderId]) REFERENCES [dbo].[TradingOrder]([tradingOrderId])
)

CREATE TABLE [dbo].[Contact](
	[tradingOrderId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[user1] INT NOT NULL, 
	[user2] INT NOT NULL,
	[isActive] BIT NOT NULL,
	CONSTRAINT FK_Contact_User1 FOREIGN KEY ([user1]) REFERENCES [dbo].[User]([userId]),
	CONSTRAINT FK_Contact_User2 FOREIGN KEY ([user2]) REFERENCES [dbo].[User]([userId])
)



GO	
INSERT INTO [dbo].[User] ([password], [fullName], [email], [phoneNumber], [introduction], [roleId], [isDeleted], [avarta], [createdDate], [sub])
VALUES
    ('1', 'Dan Thu', 'ThuPNDSE170446@fpt.edu.vn', '1234567890', 'Introduction 1', 1, 0, 'https://zpsocial-f58-org.zadn.vn/e24c0fc754d3b48dedc2.jpg', '2024-05-29 10:04:32.537', '116297070970541294235'),
    ('1', 'Quy duc', 'DucNQSE170473@fpt.edu.vn', '0987654321', 'Introduction 2', 1, 0, 'https://zpsocial-f43-org.zadn.vn/57f136ac3541d91f8050.jpg', '2024-06-06 10:04:32.537',  '101623189471350414244'),
    ('1', 'Khanh Hung', 'hunghkse170547@fpt.edu.vn', '9876543210', 'Introduction 3', 2, 0, 'https://zpsocial-f43-org.zadn.vn/310dc762c2792e277768.jpg', '2024-06-12 10:04:32.537', '108936661322074721809'),
	 ('1', 'Ho Minh Quyen (k17 HCM)', 'quyenhmse170471@fpt.edu.vn', NULL, NULL, 1, 0, 'https://lh3.googleusercontent.com/a/ACg8ocIZPZqtyowDwjLOKMnFu3ufaspn7e8N7xL1-3pZhMh40JQtPbQs=s96-c', '2024-06-22 10:04:32.537', '116447998121690404343'),
    ('1', 'Nguyen Binh An (k17 HCM)', 'annbse170470@fpt.edu.vn', NULL, NULL, 1, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJf7GEHpBuMAEqC5JIf-T4yp3clbt9iExMJY5Zo3_7kSbIP4gA=s96-c', '2024-06-25 08:43:25.623', '111768314629809688846'),
    ('1', N'Nhi Võ', 'vonhi2147@gmail.com', '0123156753', 'Hello everyone, Im Nhi Vo', 1, 0, 'https://lh3.googleusercontent.com/a/ACg8ocKLh_cG-lNBnUpEFTFDxyT_AVTQZxxJqo48ebLx6E53WfkazA=s96-c', '2024-06-27 10:04:32.537', '113437302653011009665'),
    ('1', N'Nhân MỸ', 'mynhan1102003@gmail.com', '9876540123', 'Hello everyone, Im Nhi Nhan My', 1, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJZ-ch2D74Uxjjs5myl4ocHrnge3twiexdBCE4IEfp8b-f4LQ=s96-c', '2024-06-21 11:04:32.537', '109867747469885786511'),
    ('1', N'Quý nguyễn', 'quyn5108@gmail.com', '3210987654', 'Hello everyone, Im Nhi Quy Nguyen', 1, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJuLMmQJmPOPuHUsZds-x2ckp9PAZD-EMI5HSYzXHcON0dx3w=s96-c','2024-06-16 08:43:25.623', '111481152715467954553 '),
    ('1', 'Sophia Martinez', 'sophiamartinez@example.com', '4567890123', 'Introduction 8', 1, 1, 'https://th.bing.com/th/id/OIP.4SYRN4EfioJSetoM-ggnSAHaHa?rs=1&pid=ImgDetMain', GETDATE(), NULL),
    ('1', 'Benjamin Anderson', 'benjaminanderson@example.com', '6789012345', 'IntrSoduction 9', 1, 1, 'https://th.bing.com/th/id/OIP.pAdUb6ZlM45prBGAjT__FAHaHW?rs=1&pid=ImgDetMain', GETDATE(), NULL),
    ('1', 'Ava Thomas', 'avathomas@example.com', '9876543210', 'Introduction 10', 2, 1, 'https://kynguyenlamdep.com/wp-content/uploads/2022/08/avatar-ff-ngau.jpg', GETDATE(), NULL),
	 ('user', 'Kamisato', 'user', '123124125125', 'Introduction 4', 1, 0, 'https://th.bing.com/th/id/OIP.srNFFzORAaERcWvhwgPzVAHaHa?rs=1&pid=ImgDetMain', GETDATE(), NULL),
	  ('admin', 'Admin name', 'admin', '0123456789', 'Introduction 4', 2, 0, 'https://th.bing.com/th/id/OIP.57236NGNujICB1CuE0X2MwAAAA?rs=1&pid=ImgDetMain', GETDATE(), NULL),
	 ('moderator', 'moderator name', 'moderator', '3523523523', 'Introduction 4', 2, 0, 'https://th.bing.com/th/id/OIP.i5cwEBkZmmuTgG6Jwcau5gHaHa?rs=1&pid=ImgDetMain', GETDATE(), NULL);
GO

GO
INSERT INTO [dbo].[Address] ([userId], [specificAddress])
VALUES
    (1, N'Vincom Plaza, Lê Văn Việt, Hiệp Phú, Quận 9, Thành phố Hồ Chí Minh, Vietnam'),
    (2, N'Binh Thắng 2, Dĩ An, Binh Duong, Vietnam'),
    (3, N'Đ. Mạc Đĩnh Chi, Khu phố Tân Hòa, Dĩ An, Bình Dương, Vietnam'),
    (1, N'R6RX+P7V, QL14, Phường Bình Tân, Buôn Hồ, Đắk Lắk, Vietnam'),
	(4, N'155 Đ. Nam Kỳ Khởi Nghĩa, Phường 6, Quận 3, Thành phố Hồ Chí Minh, Vietnam'),
    (5, N'103 Nguyễn Sinh Cung, Nghi Hương, Cửa Lò, Nghệ An 43000, Vietnam'),
    (6, N'485 Song Hành Xa Lộ Hà Nội, Phường Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh, Vietnam'),
    (7, N'57 Đường Nguyễn Hoàng, Đống Đa, Thành phố Qui Nhơn, Bình Định, Vietnam'),
    (8, N'Yongsan, Nhơn Bình, Thành phố Qui Nhơn, Bình Định 590000, Vietnam'),
	(9, N'92/6 Trần Đại Nghĩa, Xã Bình Thắng, Dĩ An, Bình Dương 700000, Vietnam'),
	(10, N'55 ĐT743A, Bình An, Dĩ An, Bình Dương, Vietnam'),
	(12, N'Headquarter of VNU-HCM, Phường Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh, Vietnam'),
    (12, N'120 Xa Lộ Hà Nội, Thành Phố, Thủ Đức, Thành phố Hồ Chí Minh, Vietnam');
GO

GO
INSERT INTO [dbo].[Category] ([name])
VALUES
    (N'Đồ điện tử'),
    (N'Đồ dùng học tập'),
    (N'Điện lạnh'),
    (N'Đồ gia dụng, nội thất'),
    (N'Đồ ăn, thực phẩm'),
    (N'Thời trang'),
    (N'Giải trí, thể thao, sở thích');
GO

GO
INSERT INTO [dbo].[Product] ([productName], [price], [isNew],[dealType],[description], [sellerId], [categoryId], [status], [createdDate], [imageLink], [storedQuantity])
VALUES
    ('iPhone 13', 10000000, 1,1, 'The latest iPhone model with advanced features.', 1, 1, 1, '2024-06-01', 'https://th.bing.com/th/id/OIP.AivK9zFJ7PfalbxQrwDvaQHaGc?rs=1&pid=ImgDetMain', 10 ),
    ('Laptop HP Spectre x360', 16500000, 0,1, 'A versatile and powerful laptop for professionals.', 1, 1, 1,'2024-06-04', 'https://th.bing.com/th/id/OIP.mGba6CDEayK-G5BrQdIgywHaFc?rs=1&pid=ImgDetMain', 5 ),
    ('Smart TV Samsung QLED', 5540000, 1,1, 'Immerse yourself in a stunning visual experience.', 1, 1, 1, '2024-06-14',  'https://th.bing.com/th/id/R.6832579c872dcb0fbe6587ab7b827b18?rik=E5gfeoYKwrUmtw&pid=ImgRaw&r=0', 7),
    ('Mens Dress Shirt', 200000, 0,1,'A stylish and comfortable shirt for formal occasions.', 2, 6, 1, '2024-06-15' , 'https://th.bing.com/th/id/OIP.eyHjNYJpIui1VJdyHfCzogHaJ4?rs=1&pid=ImgDetMain', 4),
    ('Womens Summer Dress', 227000, 1,1,'Stay cool and fashionable in this lightweight dress.', 2, 6, 1, '2024-06-07' ,'https://th.bing.com/th/id/OIP.gkRheGEuNAHdSZtvYnEtMAHaNg?rs=1&pid=ImgDetMain', 8),
    ('Sports Shoes Nike Air Max', 1200000, 1,1, 'Experience exceptional comfort and performance.', 2, 6, 1, '2024-06-16', 'https://th.bing.com/th/id/OIP.kK_ooDuqNmDTYs9XA5zU4AHaFP?rs=1&pid=ImgDetMain', 9),
    ('Kitchen Appliances Set', 13600000, 0,1,'Equip your kitchen with these essential appliances.', 4, 4, 1, '2024-06-06', 'https://th.bing.com/th/id/R.47a07eadc054c89b3dc20facd41f1d22?rik=sERYlnIfL9VIMw&pid=ImgRaw&r=0', 15),
    ('Kids Building Blocks Set', 850000, 1,1,'Spark creativity and imagination with this fun set.', 4, 7, 1, '2024-06-22', 'https://th.bing.com/th/id/R.6087c95facb1ec4641151fd12f61362f?rik=xtNZguyl3uCTMg&pid=ImgRaw&r=0', 30),
    ('Harry Potte V.1+2', 380000, 0,1, 'Get lost in the captivating story of this bestselling novel.', 5, 2, 1, '2024-06-24', 'https://www.worldatlas.com/r/w1200/upload/3b/05/33/shutterstock-466404632.jpg', 30),
    ('Fitness Equipment Set', 2200000, 1,1,'Stay fit and healthy with this complete equipment set.', 5, 7, 1, '2024-06-25',  'https://th.bing.com/th/id/OIP.WdjzJWQIExHX7rmoSf6DpQHaHl?rs=1&pid=ImgDetMain', 12),
	(N'Áo phông áo thun nam cổ tròn 4 chiều cotton trơn thun lạnh nhiều màu', 55000,1,1, N'Gồm những gam màu tươi mới giúp bạn dễ dàng phối nhiều loại trang phục khác nhau. Từng đường may tinh tế, chỉn chu, màu sắc đa dạng, tươi mát chắc chắn sẽ làm vừa lòng những chàng trai khó tính  nhất.', 6, 7, 1, '2024-06-27',  'https://img.lazcdn.com/g/p/9f6a4d316d084908129a7d1bd71faeb6.jpg_720x720q80.jpg_.webp', 5);
GO


-- GO
-- INSERT INTO [dbo].[ProductImage] ([productId], [imageName], [imageLink])
-- VALUES
    -- (1, 'Image 1', ),
    -- (2, 'Image 2', ),
    -- (3, 'Image 3',),
    -- (4, 'Image 4', ),
    -- (5, 'Image 5', ),
    -- (6, 'Image 6', ),
    -- (7, 'Image 7', ),
    -- (8, 'Image 8', ),
    -- (9, 'Image 9', ),
    -- (10, 'Image 10',);
-- GO


GO
INSERT INTO [dbo].[Wishlist] ([userId], [productId])
VALUES
    (1, 1),
    (1, 2),
    (2, 3),
    (2, 4),
    (3, 5),
    (3, 6),
    (4, 7),
    (4, 8),
    (5, 9),
    (5, 10);
GO

GO
INSERT INTO [dbo].[Promotion] ([name], [description], [period], [productQuantityLimit], [price], [imageLink],[isDeleted])
VALUES
    (N'Cơ bản', N'Dành cho mô hình kinh doanh nhỏ, người bắt đầu kinh doanh.', 30, 10, 10000,'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/sellingPackagesImages%2F1.png?alt=media&token=b718f1f8-4ee3-49a7-96e2-c78a14bed850',0),
    (N'Chuyên nghiệp', N'Dành cho người bán chuyên nghiệp', 30 , 50, 40000, 'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/sellingPackagesImages%2F2.png?alt=media&token=a00a427a-4e76-4f60-b6ce-22aa2feffc06',0),
    (N'Gói VIP ', N'Dành cho người bán chuyên nghiệp có quy mô lớn và quản lý hiệu suất bán hàng', 30, 100, 80000, 'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/sellingPackagesImages%2F3.png?alt=media&token=388b5c09-24e2-4e53-8985-f28bf8d4e970',0);
GO



GO
INSERT INTO [dbo].[Order] ([orderDate], [price], [buyerId], [sellerId], [paymentMethod], [status], [note], [productId], [quantity], [deliveryDate],[receiverAddress])
VALUES
    ('2024-05-01', 99.99, 2, 1,'Credit Card', 1, 'Please handle with care.', 1, 1, GETDATE(),'123 Main St, City'),
    ('2024-05-02', 49.99, 4, 1, 'PayPal', 1, 'Delivery instructions: Leave at the front door.', 2, 2, GETDATE(),'456 Elm St, City'),
    ('2024-05-03', 79.99, 5, 1,'Cash on Delivery', 1, NULL, 3, 1, GETDATE(),'789 Oak St, City'),
    ('2024-05-04', 119.99, 4, 2,'Credit Card', 1, NULL, 4, 1, GETDATE(),'321 Pine St, City'),
    ('2024-05-05', 69.99, 5, 2,'PayPal', 1, 'Gift wrapping required.', 5, 2, GETDATE(),'654 Maple St, City'),
    ('2024-05-06', 59.99, 1, 2,'Cash on Delivery', 1, NULL, 6, 1, GETDATE(),'987 Cedar St, City'),
    ('2024-05-07', 89.99, 2, 4,'Credit Card', 1, 'Please include a gift receipt.', 7, 1, GETDATE(),'789 Oak St, City'),
    ('2024-05-08', 109.99, 3, 4,'PayPal', 1, NULL, 8, 2, GETDATE(),'543 Birch St, City'),
    ('2024-05-09', 49.99, 4, 5,'Cash on Delivery', 1, 'Urgent delivery required.', 9, 1, GETDATE(),'876 Walnut St, City'),
    ('2024-05-10', 89.99, 5, 6,'Credit Card', 1, NULL, 10, 1, GETDATE(),'234 Spruce St, City');

GO


GO
INSERT INTO [dbo].[Feedback] ([content], [rating], [orderId], [raterId],[ratedId], [type] )
VALUES
    ('Great product, fast shipping!', 5, 1, 1, 2, 'RateBuyer'),
    ('The item arrived damaged. Disappointed.', 3, 2, 2, 3, 'RateSeller'),
    ('Excellent customer service. Highly recommended!', 5, 3, 3, 4, 'RateBuyer'),
    ('Average quality. Expected better.', 3, 4, 2, 1, 'RateSeller'),
    ('The product exceeded my expectations. Very satisfied!', 4, 5, 3, 1 , 'RateSeller');
GO

