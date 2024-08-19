USE [LocalEducation]
GO

-- =============================================

SET ANSI_NULLS ON

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================

CREATE PROCEDURE [dbo].[GetCourseChart]
    -- Add the parameters for the stored procedure here
    @StartDate DATETIME = null,
    @EndDate DATETIME = null
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;

    SELECT CONVERT(nvarchar, CreatedDate, 111) as CreatedDate, COUNT(*) as Total
    From Courses
    WHERE 
        (
            (@StartDate IS NULL OR @EndDate IS NULL)
        OR (CreatedDate BETWEEN ISNULL(@StartDate, CreatedDate) AND ISNULL(@EndDate, CreatedDate))
        )
    GROUP BY CONVERT(nvarchar, CreatedDate, 111)


    SELECT CONVERT(nvarchar, CreatedDate, 111) as CreatedDate, COUNT(*) as Total
    From Lessons
    WHERE 
        (
            (@StartDate IS NULL OR @EndDate IS NULL)
        OR (CreatedDate BETWEEN ISNULL(@StartDate, CreatedDate) AND ISNULL(@EndDate, CreatedDate))
        )
    GROUP BY CONVERT(nvarchar, CreatedDate, 111)

    SELECT CONVERT(nvarchar, CreatedDate, 111) as CreatedDate, COUNT(*) as Total
    From Slides
    WHERE 
        (
            (@StartDate IS NULL OR @EndDate IS NULL)
        OR (CreatedDate BETWEEN ISNULL(@StartDate, CreatedDate) AND ISNULL(@EndDate, CreatedDate))
        )
    GROUP BY CONVERT(nvarchar, CreatedDate, 111)
END
GO
