USE [LocalEducation]
GO

/****** Object:  StoredProcedure [dbo].[GetPagedTours]    Script Date: 11/12/2023 1:22:21 PM ******/

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================

ALTER PROCEDURE [dbo].[GetPagedTours] 
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
