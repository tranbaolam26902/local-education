USE [LocalEducation]
GO

-- =============================================

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================

CREATE PROCEDURE [dbo].[GetPagedTours] 
	-- Add the parameters for the stored procedure here
	@TotalCount int = 0 OUTPUT,
	@UserId uniqueidentifier = null,
	@Keyword nvarchar(256) = null,
	@AuthorName nvarchar(256) = null,
	@IsDeleted bit = null,
	@IsPublished bit = null,
	@NonPublished bit = null,
	@PageIndex int = 1,
	@PageSize int = 10,
	@OrderDirection nvarchar(4) = 'desc',
	@OrderBy nvarchar(100) = 'CreatedDate'
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    
	WITH RankedScenes AS (
    SELECT
        t.Id AS TourId,
        s.UrlPreview,
        ROW_NUMBER() OVER (PARTITION BY t.Id ORDER BY s.[Index]) AS RowNum
    FROM Tours AS t
    LEFT JOIN Scenes AS s ON s.TourId = t.Id
    )

    -- Insert statements for procedure here
	SELECT t.*, u.[Name] as Username, MAX(rs.UrlPreview) AS UrlPreview
	FROM Tours as t
	LEFT JOIN Users as u ON u.Id = t.UserId
	LEFT JOIN Scenes as s ON s.TourId = t.Id
    FULL JOIN RankedScenes AS rs ON rs.TourId = t.Id AND rs.RowNum = 1
	WHERE (@UserId IS NULL OR u.Id = @UserId)
		AND (@Keyword IS NULL
				OR t.Title LIKE '%' + @Keyword + '%'
				OR t.UrlSlug LIKE '%' + @Keyword + '%'
				OR u.[Name] LIKE '%' + @Keyword + '%')
		AND (@AuthorName IS NULL OR u.[Name] LIKE '%' + @AuthorName + '%')
		AND (@IsDeleted IS NULL OR t.IsDeleted = @IsDeleted)
		AND (
			(@IsPublished IS NULL AND @NonPublished IS NULL)
			OR (@IsPublished = 1 AND t.IsPublished = 1)
			OR (@NonPublished = 1 AND t.IsPublished = 0))
	Group by t.Id, t.UserId, t.Title, 
			t.UrlSlug, t.CreatedDate, t.ViewCount, 
			t.IsDeleted, t.IsPublished, u.[Name]
	ORDER BY 
		CASE WHEN @OrderBy = 'CreatedDate' AND @OrderDirection = 'desc' THEN t.CreatedDate END DESC,
		CASE WHEN @OrderBy = 'CreatedDate' THEN t.CreatedDate END,
		CASE WHEN @OrderBy = 'Title' AND @OrderDirection = 'desc' THEN t.Title END DESC,
		CASE WHEN @OrderBy = 'Title' THEN t.Title END,
		CASE WHEN @OrderBy = 'UrlSlug' AND @OrderDirection = 'desc' Then t.UrlSlug END DESC,
		CASE WHEN @OrderBy = 'UrlSlug' THEN t.UrlSlug END,
		CASE WHEN @OrderBy = 'ViewCount' AND @OrderDirection = 'desc' THEN t.ViewCount END DESC,
		CASE WHEN @OrderBy = 'ViewCount' THEN t.ViewCount END
	OFFSET ((@PageIndex - 1) * @PageSize) ROW FETCH NEXT @PageSize ROWS ONLY;

	SET @TotalCount = (SELECT COUNT(dt.Id)
		FROM (
		SELECT DISTINCT t.Id
		FROM Tours AS t 
		LEFT JOIN Users AS u ON t.UserId = u.Id
		LEFT JOIN Scenes AS s ON t.Id = s.TourId
		WHERE (@UserId IS NULL OR u.Id = @UserId)
			AND (@Keyword IS NULL
					OR t.Title LIKE '%' + @Keyword + '%'
					OR t.UrlSlug LIKE '%' + @Keyword + '%'
					OR u.[Name] LIKE '%' + @Keyword + '%')
			AND (@AuthorName IS NULL OR u.[Name] LIKE '%' + @AuthorName + '%')
			AND (@IsDeleted IS NULL OR t.IsDeleted = @IsDeleted)
			AND (
				(@IsPublished IS NULL AND @NonPublished IS NULL)
				OR (@IsPublished = 1 AND t.IsPublished = 1)
				OR (@NonPublished = 1 AND t.IsPublished = 0)
			)
	) AS dt)
END
GO

-- =============================================

CREATE PROCEDURE [dbo].[GetTourBySlug] 
	@UrlSlug NVARCHAR(512) = NULL
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT t.*
	FROM Tours AS t
	WHERE @UrlSlug IS NOT NULL AND t.UrlSlug = @UrlSlug;

	SELECT u.*
	FROM Tours AS t 
		RIGHT JOIN Users AS u ON t.UserId = u.Id
	WHERE @UrlSlug IS NOT NULL AND t.UrlSlug = @UrlSlug;

	SELECT s.*
	FROM Tours AS t 
		RIGHT JOIN Scenes AS s ON s.TourId = t.Id 
	WHERE @UrlSlug IS NOT NULL AND t.UrlSlug = @UrlSlug
	ORDER BY s.[Index];

	SELECT info.*
	FROM InfoHotspots AS info
		LEFT JOIN Scenes AS s ON s.Id = info.SceneId
		LEFT JOIN Tours AS t ON t.Id = s.TourId
	WHERE @UrlSlug IS NOT NULL AND t.UrlSlug = @UrlSlug;

	SELECT l.*
	FROM LinkHotspots AS l
		LEFT JOIN Scenes AS s ON s.Id = l.SceneId
		LEFT JOIN Tours AS t ON t.Id = s.TourId
	WHERE @UrlSlug IS NOT NULL AND t.UrlSlug = @UrlSlug;
END
GO

-- =============================================

CREATE PROCEDURE [dbo].[GetPagedFiles]
    @TotalCount int = 0 OUTPUT,
    @Keyword NVARCHAR(256) = NULL,
    @UserId UNIQUEIDENTIFIER = NULL,
    @FolderId UNIQUEIDENTIFIER = NULL,
    @IsDeleted bit = NULL,
    @PageIndex int = 1,
    @PageSize int = 10,
    @OrderDirection NVARCHAR(4) = 'desc',
    @OrderBy NVARCHAR(100) = "CreatedDate"
AS
BEGIN

    SET NOCOUNT ON;

    SELECT fi.*
    FROM Folders AS fo 
        LEFT JOIN Users AS u ON fo.UserId = u.Id
        RIGHT JOIN Files AS fi ON fi.FolderId = fo.Id
    WHERE fo.UserId = @UserId
        AND (@FolderId IS NULL
                OR fi.FolderId = @FolderId)
        AND (@Keyword IS NULL
                OR fi.[Name] LIKE '%' + @Keyword + '%')
        AND (@IsDeleted IS NULL
                OR fi.IsDeleted = @IsDeleted)
    ORDER BY
        CASE WHEN @OrderBy = 'CreatedDate' AND @OrderDirection = 'desc' THEN fi.CreatedDate END DESC,
        CASE WHEN @OrderBy = 'CreatedDate' THEN fi.CreatedDate END,
        CASE WHEN @OrderBy = 'Size' AND @OrderDirection = 'desc' THEN fi.[Size] END DESC,
        CASE WHEN @OrderBy = 'Size' THEN fi.[Size] END,
        CASE WHEN @OrderBy = 'Name' AND @OrderDirection = 'desc' THEN fi.[Name] END DESC,
        CASE WHEN @OrderBy = 'Name' THEN fi.[Name] END 
    OFFSET ((@PageIndex - 1) * @PageSize) ROWS FETCH NEXT @PageSize ROWS ONLY;

    SET @TotalCount = (SELECT COUNT(fi.Id)
        FROM Folders AS fo
            LEFT JOIN Users AS u ON fo.UserId = u.Id
            RIGHT JOIN Files AS fi ON fo.Id = fi.FolderId
        WHERE fo.UserId = @UserId
            AND (@FolderId IS NULL
                    OR fi.FolderId = @FolderId)
            AND (@Keyword IS NULL
                    OR fi.[Name] LIKE '%' + @Keyword + '%')  
            AND (@IsDeleted IS NULL
                    OR fi.IsDeleted = @IsDeleted)
    )
END
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
        (@StartDate IS NULL OR @EndDate IS NULL)
        OR (CreatedDate BETWEEN ISNULL(@StartDate, CreatedDate) AND ISNULL(@EndDate, CreatedDate))
    GROUP BY CONVERT(nvarchar, CreatedDate, 111)


    SELECT CONVERT(nvarchar, CreatedDate, 111) as CreatedDate, COUNT(*) as Total
    From Lessons
    WHERE 
        (@StartDate IS NULL OR @EndDate IS NULL)
        OR (CreatedDate BETWEEN ISNULL(@StartDate, CreatedDate) AND ISNULL(@EndDate, CreatedDate))
    GROUP BY CONVERT(nvarchar, CreatedDate, 111)

    SELECT CONVERT(nvarchar, CreatedDate, 111) as CreatedDate, COUNT(*) as Total
    From Slides
    WHERE 
        (@StartDate IS NULL OR @EndDate IS NULL)
        OR (CreatedDate BETWEEN ISNULL(@StartDate, CreatedDate) AND ISNULL(@EndDate, CreatedDate))
    GROUP BY CONVERT(nvarchar, CreatedDate, 111)
END
GO

-- =============================================

CREATE PROCEDURE [dbo].[GetFilesChart]
    -- Add the parameters for the stored procedure here
    @StartDate DATETIME = null,
    @EndDate DATETIME = null
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;


    SELECT CONVERT(nvarchar, CreatedDate, 111) as CreatedDate, SUM(f.[Size]) as Total
    FROM Files as f
    WHERE 
        (@StartDate IS NULL OR @EndDate IS NULL)
        OR (CreatedDate BETWEEN ISNULL(@StartDate, CreatedDate) AND ISNULL(@EndDate, CreatedDate))
    GROUP BY CONVERT(nvarchar, CreatedDate, 111)
END
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