USE [LocalEducation]
GO

-- =============================================

SET ANSI_NULLS ON

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================


CREATE PROCEDURE [dbo].[GetTourChart]
    -- Add the parameters for the stored procedure here
    @StartDate DATETIME = null,
    @EndDate DATETIME = null
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;

    SELECT CONVERT(nvarchar, CreatedDate, 111) as CreatedDate, COUNT(*) as Total
    From Tours
    WHERE 
        (@StartDate IS NULL OR @EndDate IS NULL)
        OR (CreatedDate BETWEEN ISNULL(@StartDate, CreatedDate) AND ISNULL(@EndDate, CreatedDate))
    GROUP BY CONVERT(nvarchar, CreatedDate, 111)


    SELECT CONVERT(nvarchar, CreatedDate, 111) as CreatedDate, COUNT(*) as Total
    From Scenes
    WHERE 
        (@StartDate IS NULL OR @EndDate IS NULL)
        OR (CreatedDate BETWEEN ISNULL(@StartDate, CreatedDate) AND ISNULL(@EndDate, CreatedDate))
    GROUP BY CONVERT(nvarchar, CreatedDate, 111)

    SELECT CONVERT(nvarchar, CreatedDate, 111) as CreatedDate, COUNT(*) as Total
    From InfoHotspots
    WHERE 
        (@StartDate IS NULL OR @EndDate IS NULL)
        OR (CreatedDate BETWEEN ISNULL(@StartDate, CreatedDate) AND ISNULL(@EndDate, CreatedDate))
    GROUP BY CONVERT(nvarchar, CreatedDate, 111)

    SELECT CONVERT(nvarchar, CreatedDate, 111) as CreatedDate, COUNT(*) as Total
    From LinkHotspots
    WHERE 
        (@StartDate IS NULL OR @EndDate IS NULL)
        OR (CreatedDate BETWEEN ISNULL(@StartDate, CreatedDate) AND ISNULL(@EndDate, CreatedDate))
    GROUP BY CONVERT(nvarchar, CreatedDate, 111)
END
GO