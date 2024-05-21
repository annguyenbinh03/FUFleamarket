GO
CREATE DATABASE [FUFleaMarket]
GO
GO
USE [FUFleaMarket]
GO

CREATE TABLE [dbo].[User](
	[userId] NVARCHAR(30) NOT NULL PRIMARY KEY,
	[password]  NVARCHAR(20) NULL,
	[fullName] NVARCHAR(30) NOT NULL,
	[email] NVARCHAR(40) NOT NULL,
	[phoneNumber] NVARCHAR(20) NULL,
	[introduction] NVARCHAR(300) NULL,
	[roleId] INT NOT NULL,
	[status] BIT NOT NULL
)

CREATE TABLE [dbo].[Address](
	[addressId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[userId] NVARCHAR(30) NOT NULL,
	[address]  NVARCHAR(255) NOT NULL,
	CONSTRAINT FK_Address_User FOREIGN KEY ([userId]) REFERENCES [dbo].[User] ([userId])
)


CREATE TABLE [dbo].[Message](
 	[messageId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[sender]  NVARCHAR(30) NOT NULL,
	[receiver] NVARCHAR(30) NOT NULL,
	[messageText] NVARCHAR(255) NOT NULL,
	[time] DATETIME,
	[isRead] BIT, 
	CONSTRAINT FK_Message_User_sender FOREIGN KEY ([sender]) REFERENCES [dbo].[User] ([userId]),
	CONSTRAINT FK_Message_User_receiver FOREIGN KEY ([receiver]) REFERENCES [dbo].[User] ([userId])
)

CREATE TABLE [dbo].[Category](
	[categoryId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[name] NVARCHAR(50) NOT NULL,
)

CREATE TABLE [dbo].[Product](
	[productId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
	[productName] NVARCHAR(50) NOT NULL,
	[price] MONEY NOT NULL,
	[condition] BIT NOT NULL,
	[description] NVARCHAR(2000) NOT NULL,
	[userId] NVARCHAR(30) NOT NULL,
	[categoryId] INT NOT NULL,
	[status] BIT NOT NULL,
	CONSTRAINT FK_Product_User FOREIGN KEY ([userId]) REFERENCES [dbo].[User] ([userId]),
	CONSTRAINT FK_Message_Category FOREIGN KEY ([categoryId]) REFERENCES [dbo].[Category] ([categoryId])
)

CREATE TABLE [dbo].[Wishlist](
	[userId] NVARCHAR(30) NOT NULL,
	[productId] INT NOT NULL,
	CONSTRAINT PK_Wishlist PRIMARY KEY ([userId], [productId]),
	CONSTRAINT FK_Wishlist_User FOREIGN KEY ([userId]) REFERENCES [dbo].[User] ([userId]),
	CONSTRAINT FK_Wishlist_Product FOREIGN KEY ([productId]) REFERENCES [dbo].[Product] ([productId])
)

CREATE TABLE [dbo].[Promotion](
	[promotionId] NVARCHAR(30) NOT NULL,
	[startDate] INT NOT NULL,
	[endDate] INT NOT NULL,
	[type] NVARCHAR(5) NOT NULL,
	[productId] INT,
	CONSTRAINT FK_Promotion_Product FOREIGN KEY ([productId]) REFERENCES [dbo].[Product] ([productId])
)

CREATE TABLE [dbo].[Order](
	[orderId]  INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
	[orderDate] DATETIME NOT NULL,
	[totalPrice] MONEY NOT NULL,
	[userId] NVARCHAR(30) NOT NULL,
	[method] NVARCHAR(20) NOT NULL,
	[status] NVARCHAR(20) NOT NULL,
	[receiverAddress] NVARCHAR(255) NOT NULL,
	CONSTRAINT FK_Order_User FOREIGN KEY ([userId]) REFERENCES [dbo].[User] ([userId])
)

CREATE TABLE [dbo].[OrderDetail](
	[orderId] INT NOT NULL, 
	[productId] INT NOT NULL,
	[price] MONEY NOT NULL,
	[quantity] INT NOT NULL,
	CONSTRAINT FK_OrderDetail_Order FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order] ([orderId]),
	CONSTRAINT FK_OrderDetail_Product  FOREIGN KEY ([productId]) REFERENCES [dbo].[Product] ([productId])
)

CREATE TABLE [dbo].[Feedback](
	[feedbackId]  INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
	[content] NVARCHAR(250) NOT NULL,
	[rating] INT NOT NULL,
	[orderId]  INT NOT NULL, 
	CONSTRAINT FK_Feedback_Order FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order] ([orderId])
)

