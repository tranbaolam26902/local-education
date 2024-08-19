using LocalEducation.Core.Entities;
using SixLabors.ImageSharp;

namespace LocalEducation.WebApi.Media;

public interface IMediaManager
{
	#region Panorama manager

	Task<string> SaveThumbnailFromPanoramaImageAsync(
		Image originalImage,
		string folderPath,
		string originalFileName,
		CancellationToken cancellationToken = default);
	#endregion

	#region Folder manager
	
    Task<string> CreateFolderAsync(string folderName, CancellationToken cancellationToken = default);

	Task<bool> DeleteFolderAsync(string folderName, CancellationToken cancellationToken = default);
	
	Task<bool> MoveFolderAsync(string folderName, string newFolderName, CancellationToken cancellationToken = default);

	#endregion

    #region File Manager

    Task<string> UploadFileAsync(
        Stream buffer, 
        string folderPath, 
        string originalFileName, 
        string contentType,
        CancellationToken cancellationToken = default);

    Task<string> SaveThumbnailAsync(
        FileType fileType,
        IFormFile sourceImage,
        string originalFileName,
        string folderPath,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteFileAsync(string filePath, CancellationToken cancellationToken = default);

    #endregion
}