-- ================================================
USE [LocalEducation]
GO

-- ================================================

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- UrlSlug:		<UrlSlug,,Name>
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

