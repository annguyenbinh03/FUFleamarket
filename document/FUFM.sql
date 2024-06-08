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
	[createdDate] DATETIME NOT NULL

)

CREATE TABLE [dbo].[Address](
	[addressId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[userId] INT NOT NULL,
	[specificAddress]  NVARCHAR(255) NOT NULL,
	CONSTRAINT FK_Address_User FOREIGN KEY ([userId]) REFERENCES [dbo].[User] ([userId])
)


CREATE TABLE [dbo].[Message]( 
 	[messageId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[senderId]  INT NOT NULL,
	[receiverId] INT NOT NULL,
	[messageText] NVARCHAR(255) NOT NULL,
	[time] DATETIME,
	[isRead] BIT, 
	CONSTRAINT FK_Message_User_sender FOREIGN KEY ([senderId]) REFERENCES [dbo].[User] ([userId]),
	CONSTRAINT FK_Message_User_receiver FOREIGN KEY ([receiverId]) REFERENCES [dbo].[User] ([userId])
)

CREATE TABLE [dbo].[Category](
	[categoryId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[name] NVARCHAR(50) NOT NULL,
)

CREATE TABLE [dbo].[Product](
	[productId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
	[productName] NVARCHAR(50) NOT NULL,
	[price] MONEY NOT NULL,
	[isNew] BIT NOT NULL,
	[description] NVARCHAR(2000) NOT NULL,
	[sellerId] INT NOT NULL,
	[categoryId] INT NOT NULL,
	[status] INT NOT NULL,
	[createdDate] DATETIME NULL,
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
	[productQuantity] INT NOT NULL,
	[price] MONEY NOT NULL,
	[isDeleted] BIT NOT NULL,
)

CREATE TABLE [dbo].[PromotionOrder](
	[promoOrderId] INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[startDate] DATETIME NOT NULL,
	[endDate] DATETIME NOT NULL,
	[userId] INT NOT NULL,
	[price] MONEY NOT NULL, 
	[productQuantity] INT NOT NULL,
	[promotionId] INT NOT NULL,
	CONSTRAINT FK_PromotionOrder_Promotion FOREIGN KEY ([promotionId]) REFERENCES [dbo].[Promotion] ([promotionId]),
	CONSTRAINT FK_PromotionOrder_User FOREIGN KEY ([userId]) REFERENCES [dbo].[User] ([userId])
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
	CONSTRAINT FK_Feedback_Order FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order] ([orderId])
)


GO	
INSERT INTO [dbo].[User] ([password], [fullName], [email], [phoneNumber], [introduction], [roleId], [isDeleted], [avarta], [createdDate])
VALUES
    ('1', 'Dan Thu', 'ThuPNDSE170446@fpt.edu.vn', '1234567890', 'Introduction 1', 1, 0, 'https://zpsocial-f58-org.zadn.vn/e24c0fc754d3b48dedc2.jpg', GETDATE()),
    ('1', 'Quy duc', 'DucNQSE170473@fpt.edu.vn', '0987654321', 'Introduction 2', 1, 0, 'https://zpsocial-f43-org.zadn.vn/57f136ac3541d91f8050.jpg', GETDATE()),
    ('1', 'Khanh Hung', 'hunghkse170547@fpt.edu.vn', '9876543210', 'Introduction 3', 1, 0, 'https://zpsocial-f43-org.zadn.vn/310dc762c2792e277768.jpg', GETDATE()),
    ('admin', 'Admin name', 'admin', '0123456789', 'Introduction 4', 2, 0, 'https://th.bing.com/th/id/OIP.57236NGNujICB1CuE0X2MwAAAA?rs=1&pid=ImgDetMain', GETDATE()),
    ('1', 'Michael Davis', 'michaeldavis@example.com', '5432167890', 'Introduction 5', 1, 0, 'https://th.bing.com/th/id/R.808636cc55f2ccceac3dab65f59e06a0?rik=rYlKMlOaLmfyUg&pid=ImgRaw&r=0', GETDATE()),
    ('1', 'Olivia Wilson', 'oliviawilson@example.com', '9876540123', 'Introduction 6', 2, 1, 'https://demoda.vn/wp-content/uploads/2022/08/hinh-anh-avatar-nu-de-thuong.jpg', GETDATE()),
    ('1', 'James Taylor', 'jamestaylor@example.com', '3210987654', 'Introduction 7', 1, 1, 'https://th.bing.com/th/id/OIP.dRG04_HcB012wboIb8azKwHaHa?rs=1&pid=ImgDetMain', GETDATE()),
    ('1', 'Sophia Martinez', 'sophiamartinez@example.com', '4567890123', 'Introduction 8', 2, 0, 'https://th.bing.com/th/id/OIP.4SYRN4EfioJSetoM-ggnSAHaHa?rs=1&pid=ImgDetMain', GETDATE()),
    ('1', 'Benjamin Anderson', 'benjaminanderson@example.com', '6789012345', 'IntrSoduction 9', 1, 1, 'https://th.bing.com/th/id/OIP.pAdUb6ZlM45prBGAjT__FAHaHW?rs=1&pid=ImgDetMain', GETDATE()),
    ('1', 'Ava Thomas', 'avathomas@example.com', '9876543210', 'Introduction 10', 2, 1, 'https://kynguyenlamdep.com/wp-content/uploads/2022/08/avatar-ff-ngau.jpg', GETDATE()),
	 ('user', 'user name', 'user', '123124125125', 'Introduction 4', 0, 0, 'https://th.bing.com/th/id/OIP.srNFFzORAaERcWvhwgPzVAHaHa?rs=1&pid=ImgDetMain', GETDATE()),
	 ('moderator', 'moderator name', 'moderator', '3523523523', 'Introduction 4', 1, 0, 'https://th.bing.com/th/id/OIP.i5cwEBkZmmuTgG6Jwcau5gHaHa?rs=1&pid=ImgDetMain', GETDATE());
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
INSERT INTO [dbo].[Message] ([senderId], [receiverId], [messageText], [time], [isRead])
VALUES
    (1, 2, 'Hello! How are you?', GETDATE(), 1),
    (2, 1, 'Hi! Im doing well, thanks.', GETDATE(), 1),
    (1, 2, 'Thats great to hear!', GETDATE(), 1),
    (2, 1, 'Yes, Ive been having a good day.', GETDATE(), 0),
    (1, 3, 'Hey! Long time no see.', GETDATE(), 0),
    (3, 1, 'Yeah, its been a while. How have you been?', GETDATE(), 0),
    (1, 3, 'Ive been busy with work, but otherwise, Im good.', GETDATE(), 0),
    (3, 1, 'Glad to hear that. We should catch up soon.', GETDATE(), 0),
    (2, 3, 'Hey, do you have any plans for the weekend?', GETDATE(), 0),
    (3, 2, 'Not yet. What do you have in mind?', GETDATE(), 0);
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
INSERT INTO [dbo].[Product] ([productName], [price], [isNew], [description], [sellerId], [categoryId], [status], [createdDate])
VALUES
    ('iPhone 13', 999.99, 1, 'The latest iPhone model with advanced features.', 1, 1, 1, '2024-06-01' ),
    ('Laptop HP Spectre x360', 1299.99, 0, 'A versatile and powerful laptop for professionals.', 2, 1, 1,GETDATE() ),
    ('Smart TV Samsung QLED', 1499.99, 1, 'Immerse yourself in a stunning visual experience.', 1, 1, 1, GETDATE()),
    ('Mens Dress Shirt', 49.99, 0, 'A stylish and comfortable shirt for formal occasions.', 2, 6, 1, GETDATE()),
    ('Womens Summer Dress', 39.99, 1, 'Stay cool and fashionable in this lightweight dress.', 1, 6, 1, GETDATE()),
    ('Sports Shoes Nike Air Max', 129.99, 1, 'Experience exceptional comfort and performance.', 2, 6, 1, GETDATE()),
    ('Kitchen Appliances Set', 299.99, 0, 'Equip your kitchen with these essential appliances.', 1, 4, 1, GETDATE()),
    ('Kids Building Blocks Set', 29.99, 1, 'Spark creativity and imagination with this fun set.', 2, 7, 1, GETDATE()),
    ('Harry Potte V.1+2', 19.99, 0, 'Get lost in the captivating story of this bestselling novel.', 1, 2, 1, GETDATE()),
    ('Fitness Equipment Set', 199.99, 1, 'Stay fit and healthy with this complete equipment set.', 2, 7, 1, GETDATE());
GO


GO
INSERT INTO [dbo].[ProductImage] ([productId], [imageName], [imageLink])
VALUES
    (1, 'Image 1', 'https://th.bing.com/th/id/OIP.AivK9zFJ7PfalbxQrwDvaQHaGc?rs=1&pid=ImgDetMain'),
    (2, 'Image 2', 'https://th.bing.com/th/id/OIP.mGba6CDEayK-G5BrQdIgywHaFc?rs=1&pid=ImgDetMain'),
    (3, 'Image 3', 'https://th.bing.com/th/id/R.6832579c872dcb0fbe6587ab7b827b18?rik=E5gfeoYKwrUmtw&pid=ImgRaw&r=0'),
    (4, 'Image 4', 'https://th.bing.com/th/id/OIP.eyHjNYJpIui1VJdyHfCzogHaJ4?rs=1&pid=ImgDetMain'),
    (5, 'Image 5', 'https://th.bing.com/th/id/OIP.gkRheGEuNAHdSZtvYnEtMAHaNg?rs=1&pid=ImgDetMain'),
    (6, 'Image 6', 'https://th.bing.com/th/id/OIP.kK_ooDuqNmDTYs9XA5zU4AHaFP?rs=1&pid=ImgDetMain'),
    (7, 'Image 7', 'https://th.bing.com/th/id/R.47a07eadc054c89b3dc20facd41f1d22?rik=sERYlnIfL9VIMw&pid=ImgRaw&r=0'),
    (8, 'Image 8', 'https://th.bing.com/th/id/R.6087c95facb1ec4641151fd12f61362f?rik=xtNZguyl3uCTMg&pid=ImgRaw&r=0'),
    (9, 'Image 9', 'https://www.worldatlas.com/r/w1200/upload/3b/05/33/shutterstock-466404632.jpg'),
    (10, 'Image 10', 'https://th.bing.com/th/id/OIP.WdjzJWQIExHX7rmoSf6DpQHaHl?rs=1&pid=ImgDetMain');
GO


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
INSERT INTO [dbo].[Promotion] ([name], [description], [period], [productQuantity], [price], [isDeleted])
VALUES
    ('Cơ bản 1', 'Dành cho mô hình kinh doanh nhỏ, người bắt đầu kinh doanh.', 30, 10, 100,0),
    ('Chuyên nghiệp 1 ', 'Dành cho người bán chuyên nghiệp', 150 , 30, 500, 0),
    ('Gói VIP 1 ', 'Dành cho người bán chuyên nghiệp có quy mô lớn và quản lý hiệu suất bán hàng', 365, 100, 1000, 0);
GO


GO
INSERT INTO [dbo].[PromotionOrder] ([startDate], [endDate], [userId], [price], [productQuantity], [promotionId])
VALUES
    ('2024-05-01', '2024-05-10', 1, 99.99, 10, 1),
    ('2024-05-02', '2024-05-15', 2, 49.99, 30, 2),
    ('2024-05-03', '2024-05-12', 3, 79.99, 100, 3),
    ('2024-05-04', '2024-05-18', 4, 119.99, 10, 1),
    ('2024-05-05', '2024-05-14', 5, 69.99, 30, 2),
    ('2024-05-06', '2024-05-16', 1, 59.99, 100, 3),
    ('2024-05-07', '2024-05-11', 2, 89.99, 10, 1),
    ('2024-05-08', '2024-05-17', 3, 109.99, 2, 2),
    ('2024-05-09', '2024-05-13', 4, 49.99, 1, 3),
    ('2024-05-10', '2024-05-19', 5, 89.99, 1, 1);
GO


GO
INSERT INTO [dbo].[Order] ([orderDate], [price], [buyerId], [sellerId], [paymentMethod], [status], [note], [productId], [quantity], [deliveryDate],[receiverAddress])
VALUES
    ('2024-05-01', 99.99, 1, 2,'Credit Card', 1, 'Please handle with care.', 1, 1, GETDATE(),'123 Main St, City'),
    ('2024-05-02', 49.99, 2, 3, 'PayPal', 1, 'Delivery instructions: Leave at the front door.', 2, 2, GETDATE(),'456 Elm St, City'),
    ('2024-05-03', 79.99, 3, 4,'Cash on Delivery', 1, NULL, 3, 1, GETDATE(),'789 Oak St, City'),
    ('2024-05-04', 119.99, 4, 5,'Credit Card', 1, NULL, 4, 1, GETDATE(),'321 Pine St, City'),
    ('2024-05-05', 69.99, 5, 6,'PayPal', 1, 'Gift wrapping required.', 5, 2, GETDATE(),'654 Maple St, City'),
    ('2024-05-06', 59.99, 1, 7,'Cash on Delivery', 1, NULL, 6, 1, GETDATE(),'987 Cedar St, City'),
    ('2024-05-07', 89.99, 2, 8,'Credit Card', 1, 'Please include a gift receipt.', 7, 1, GETDATE(),'789 Oak St, City'),
    ('2024-05-08', 109.99, 3, 1,'PayPal', 1, NULL, 8, 2, GETDATE(),'543 Birch St, City'),
    ('2024-05-09', 49.99, 4, 1,'Cash on Delivery', 1, 'Urgent delivery required.', 9, 1, GETDATE(),'876 Walnut St, City'),
    ('2024-05-10', 89.99, 5, 1,'Credit Card', 1, NULL, 10, 1, GETDATE(),'234 Spruce St, City');

GO


GO
INSERT INTO [dbo].[Feedback] ([content], [rating], [orderId])
VALUES
    ('Great product, fast shipping!', 5, 1),
    ('The item arrived damaged. Disappointed.', 2, 2),
    ('Excellent customer service. Highly recommended!', 5, 3),
    ('Average quality. Expected better.', 3, 4),
    ('The product exceeded my expectations. Very satisfied!', 4, 5);
GO