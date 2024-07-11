--drop all FK's
DECLARE @tableName VARCHAR(128)
DECLARE @constraint VARCHAR(254)
DECLARE @SQL VARCHAR(254)
DECLARE @SchemaName varchar(254)

DECLARE cur CURSOR FOR SELECT c.TABLE_NAME,c.CONSTRAINT_SCHEMA, c.CONSTRAINT_NAME from INFORMATION_SCHEMA.TABLE_CONSTRAINTS c WHERE c.CONSTRAINT_CATALOG=DB_NAME() AND c.CONSTRAINT_TYPE = 'FOREIGN KEY' ORDER BY TABLE_NAME 
OPEN cur

FETCH NEXT FROM cur INTO @tableName, @SchemaName, @constraint

WHILE @@FETCH_STATUS = 0 BEGIN
    SELECT @SQL = 'ALTER TABLE [' + RTRIM(@SchemaName) + '].[' + RTRIM(@tableName) +'] DROP CONSTRAINT [' + RTRIM(@constraint) +']'
    EXEC (@SQL)
    PRINT 'dropped constraint : ' + @constraint
    FETCH NEXT FROM cur INTO @tableName, @SchemaName, @constraint
END
CLOSE cur    
DEALLOCATE cur
GO

--Set system versioning off

DECLARE @tableName VARCHAR(128)
DECLARE @SQL VARCHAR(254)
DECLARE @SchemaName varchar(254)

DECLARE cur CURSOR FOR select  t.name as TableName, schema_name(t.schema_id) as SchemaName from sys.tables t where t.temporal_type = 2 
OPEN cur

FETCH NEXT FROM cur INTO @tableName, @SchemaName

WHILE @@FETCH_STATUS = 0 BEGIN
    SELECT @SQL = 'ALTER TABLE [' + RTRIM(@SchemaName) + '].[' + RTRIM(@tableName) +'] SET (SYSTEM_VERSIONING = OFF);'
    EXEC (@SQL)
    PRINT 'Removed versioning from: ' + @tableName
    FETCH NEXT FROM cur INTO @tableName, @SchemaName
END
CLOSE cur    
DEALLOCATE cur
GO

--Drop all tables

DECLARE @tableName VARCHAR(128)
DECLARE @SQL VARCHAR(254)
DECLARE @SchemaName varchar(254)

DECLARE cur CURSOR FOR SELECT t.TABLE_NAME, t.TABLE_SCHEMA  from INFORMATION_SCHEMA.TABLES t where t.TABLE_TYPE = 'BASE TABLE' 
OPEN cur

FETCH NEXT FROM cur INTO @tableName, @SchemaName

WHILE @@FETCH_STATUS = 0 BEGIN
    SELECT @SQL = 'DROP TABLE [' + RTRIM(@SchemaName) + '].[' + RTRIM(@tableName) +']'
    EXEC (@SQL)
    PRINT 'Dropped Table: ' + @tableName
    FETCH NEXT FROM cur INTO @tableName, @SchemaName
END
CLOSE cur    
DEALLOCATE cur
GO