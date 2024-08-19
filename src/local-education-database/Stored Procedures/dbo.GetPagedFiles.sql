USE [LocalEducation]
GO

-- =============================================

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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