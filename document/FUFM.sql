GO
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
	[address] NVARCHAR(255),
	[acceptedTradingPercent] FLOAT DEFAULT 10,
	[buyRating] FLOAT DEFAULT 0,
	[buyTimes] INT DEFAULT 0,
	[sellRating] FLOAT DEFAULT 0,
	[sellTimes] INT DEFAULT 0
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
	[productQuantityLimit] INT NOT NULL,
	[price] MONEY NOT NULL,
	[imageLink]  NVARCHAR(300) NOT NULL,
	[isDeleted] BIT NOT NULL
)

CREATE TABLE [dbo].[PromotionOrder](
	[promoOrderId] INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[remainedDate] INT NOT NULL,
	[userId] INT NOT NULL,
	[promotionId] INT NOT NULL,
	[status] NVARCHAR(10) NOT NULL,
	CONSTRAINT FK_PromotionOrder_Promotion FOREIGN KEY ([promotionId]) REFERENCES [dbo].[Promotion] ([promotionId]),
	CONSTRAINT FK_PromotionOrder_User FOREIGN KEY ([userId]) REFERENCES [dbo].[User] ([userId])
)

CREATE TABLE [dbo].[PromotionTransaction](
	[promoTransactionId] INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[promoOrderId] INT NOT NULL,
	[price] MONEY NOT NULL, 
	[paymentMethod] NVARCHAR(100) NOT NULL,
	[transactionCode] NVARCHAR(100) NOT NULL,
	[transactionStatus] NVARCHAR(10) NOT NULL,
	[quantity] INT NOT NULL,
	[createdDate] DATETIME NOT NULL,
	CONSTRAINT FK_PromotionTransaction_PromotionOrder FOREIGN KEY ([promoOrderId]) REFERENCES [dbo].[PromotionOrder]([promoOrderId])
) 



CREATE TABLE [dbo].[Order](
	[orderId]  INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
	[price] MONEY NOT NULL,
	[buyerId] INT NOT NULL,
	[sellerId] INT NOT NULL,
	[paymentMethod] NVARCHAR(20) NOT NULL,
	[status] INT NOT NULL,
	[note] NVARCHAR(1000),
	[productId] INT NOT NULL,
	[quantity] INT NOT NULL,
	[receiverAddress] NVARCHAR(255) NOT NULL,
	[createdDate] DATETIME NOT NULL,
	CONSTRAINT FK_Order_UserBuy FOREIGN KEY ([buyerId]) REFERENCES [dbo].[User] ([userId]),
	CONSTRAINT FK_Order_UserSell FOREIGN KEY ([sellerId]) REFERENCES [dbo].[User] ([userId]),
	CONSTRAINT FK_Order_Product  FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([productId])
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
	[status] INT NOT NULL,
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
	[contactId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
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
    ('1', 'Nguyen Binh An (k17 HCM)', 'annbse170470@fpt.edu.vn', NULL, NULL, 1, 0, 'https://lh3.googleusercontent.com/a/ACg8ocJf7GEHpBuMAEqC5JIf-T4yp3clbt9iExMJY5Zo3_7kSbIP4gA=s96-c', '2024-06-25 08:43:25.623', '111768314629809688846');
	
GO

GO
INSERT INTO [dbo].[Category] ([name], [iconLink])
VALUES
    (N'Đồ điện tử', 'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/categoryImages%2Felectronic-device.png?alt=media&token=405d7f26-2d31-4793-ab15-ca110c5091e8'),
    (N'Đồ dùng học tập', 'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/categoryImages%2Fschool-material.png?alt=media&token=83a015cb-8287-435a-bdc9-d34799e3cd46'),
    (N'Điện lạnh', 'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/categoryImages%2Ffridge.png?alt=media&token=8047d6cd-b839-46c6-8cc7-c7622933eae2'),
    (N'Đồ gia dụng, nội thất', 'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/categoryImages%2Fsofa.png?alt=media&token=0a366565-5cd5-4bff-b351-ba9cc60011bf'),
    (N'Đồ ăn, thực phẩm', 'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/categoryImages%2Fburger.png?alt=media&token=0f6a08cf-7bf0-433e-bff4-127c23a3c97c'),
    (N'Thời trang', 'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/categoryImages%2Fwoman-clothes.png?alt=media&token=cf962656-b28d-41dd-b886-038b1ef77848'),
    (N'Giải trí, thể thao, sở thích', 'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/categoryImages%2Fconsole.png?alt=media&token=2943f709-282c-46e3-b01c-a34b57c8efb3');
GO

GO
INSERT INTO [dbo].[Product] ([productName], [price], [isNew],[dealType],[description], [sellerId], [categoryId], [status], [createdDate], [imageLink], [storedQuantity])
VALUES
    ('iPhone 13', 10000000, 1,1, 'The latest iPhone model with advanced features.', 1, 1, 1, '2024-06-01', 'https://th.bing.com/th/id/OIP.AivK9zFJ7PfalbxQrwDvaQHaGc?rs=1&pid=ImgDetMain', 10 ),
    ('Laptop HP Spectre x360', 16500000, 0,0, 'A versatile and powerful laptop for professionals.', 1, 1, 1,'2024-06-04', 'https://th.bing.com/th/id/OIP.mGba6CDEayK-G5BrQdIgywHaFc?rs=1&pid=ImgDetMain', 5 ),
    ('Smart TV Samsung QLED', 5540000, 1,1, 'Immerse yourself in a stunning visual experience.', 1, 1, 1, '2024-06-14',  'https://th.bing.com/th/id/R.6832579c872dcb0fbe6587ab7b827b18?rik=E5gfeoYKwrUmtw&pid=ImgRaw&r=0', 7),
    ('Mens Dress Shirt', 200000, 0,0,'A stylish and comfortable shirt for formal occasions.', 1, 6, 1, '2024-06-15' , 'https://th.bing.com/th/id/OIP.eyHjNYJpIui1VJdyHfCzogHaJ4?rs=1&pid=ImgDetMain', 4),
    ('Womens Summer Dress', 227000, 1,1,'Stay cool and fashionable in this lightweight dress.', 2, 6, 1, '2024-06-07' ,'https://th.bing.com/th/id/OIP.gkRheGEuNAHdSZtvYnEtMAHaNg?rs=1&pid=ImgDetMain', 8),
    ('Sports Shoes Nike Air Max', 1200000, 1,0, 'Experience exceptional comfort and performance.', 2, 6, 1, '2024-06-16', 'https://th.bing.com/th/id/OIP.kK_ooDuqNmDTYs9XA5zU4AHaFP?rs=1&pid=ImgDetMain', 9),
    ('Kitchen Appliances Set', 13600000, 0,1,'Equip your kitchen with these essential appliances.', 2, 4, 1, '2024-06-06', 'https://th.bing.com/th/id/R.47a07eadc054c89b3dc20facd41f1d22?rik=sERYlnIfL9VIMw&pid=ImgRaw&r=0', 15),
    ('Kids Building Blocks Set', 850000, 1,0,'Spark creativity and imagination with this fun set.', 4, 7, 1, '2024-06-22', 'https://th.bing.com/th/id/R.6087c95facb1ec4641151fd12f61362f?rik=xtNZguyl3uCTMg&pid=ImgRaw&r=0', 30),
    ('Harry Potte V.1+2', 380000, 0,1, 'Get lost in the captivating story of this bestselling novel.', 4, 2, 1, '2024-06-24', 'https://www.worldatlas.com/r/w1200/upload/3b/05/33/shutterstock-466404632.jpg', 30),
    ('Fitness Equipment Set', 2200000, 1,0,'Stay fit and healthy with this complete equipment set.', 5, 7, 1, '2024-06-25',  'https://th.bing.com/th/id/OIP.WdjzJWQIExHX7rmoSf6DpQHaHl?rs=1&pid=ImgDetMain', 12),
	(N'Áo phông áo thun nam cổ tròn 4 chiều cotton trơn thun lạnh nhiều màu', 55000,1,0, N'Gồm những gam màu tươi mới giúp bạn dễ dàng phối nhiều loại trang phục khác nhau. Từng đường may tinh tế, chỉn chu, màu sắc đa dạng, tươi mát chắc chắn sẽ làm vừa lòng những chàng trai khó tính  nhất.', 5, 7, 1, '2024-06-27',  'https://img.lazcdn.com/g/p/9f6a4d316d084908129a7d1bd71faeb6.jpg_720x720q80.jpg_.webp', 5);
GO

GO
INSERT INTO [dbo].[Wishlist] ([userId], [productId])
VALUES
    (1, 1),
    (1, 2),
    (2, 3),
    (2, 4),
    (4, 7),
    (4, 8),
    (5, 9),
    (5, 10);
GO

GO
INSERT INTO [dbo].[Promotion] ([name], [description], [productQuantityLimit], [price], [imageLink],[isDeleted])
VALUES
    (N'Cơ bản', N'Dành cho mô hình kinh doanh nhỏ, người bắt đầu kinh doanh.', 20, 15000,'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/sellingPackagesImages%2F1.png?alt=media&token=b718f1f8-4ee3-49a7-96e2-c78a14bed850',0),
    (N'Chuyên nghiệp', N'Dành cho người bán chuyên nghiệp.',  50, 35000, 'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/sellingPackagesImages%2F2.png?alt=media&token=a00a427a-4e76-4f60-b6ce-22aa2feffc06',0),
    (N'Gói VIP ', N'Dành cho người bán chuyên nghiệp có quy mô lớn.', 100, 65000, 'https://firebasestorage.googleapis.com/v0/b/fufleamarket.appspot.com/o/sellingPackagesImages%2F3.png?alt=media&token=388b5c09-24e2-4e53-8985-f28bf8d4e970',0);
GO





