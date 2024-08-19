using LocalEducation.Core.Entities;
using NReco.VideoConverter;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using File = System.IO.File;

namespace LocalEducation.WebApi.Media;

public class LocalFileSystemMediaManager : IMediaManager
{
    private readonly ILogger<LocalFileSystemMediaManager> _logger;

    public LocalFileSystemMediaManager(ILogger<LocalFileSystemMediaManager> logger)
    {
        _logger = logger;
    }

    #region Panorama Image Process

    public async Task<string> SaveThumbnailFromPanoramaImageAsync(Image originalImage, string folderPath, string originalFileName,
        CancellationToken cancellationToken = default)
    {
        try
        {
            int newWidth = GetNewWidthPanorama(originalImage.Width);
            using var resizedImage = originalImage.Clone(ctx => ctx.Resize(new ResizeOptions
            {
                Size = new Size(newWidth, 0),
                Mode = ResizeMode.Max,
            }));

            using var result = resizedImage.Clone(ctx => ctx.Resize(new ResizeOptions { Size = new Size(newWidth, (int)Math.Round((double)newWidth / 2)) }));

            var fileExt = Path.GetExtension(originalFileName).ToLower();
            var returnFilePath = CreateFilePath(folderPath.Replace("//", "/"), fileExt, "thumbnail_panorama");
            var fullPath = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", returnFilePath));

            await result.SaveAsync(fullPath, cancellationToken);

            return returnFilePath;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Could not reduce panorama image");
            return null;
        }
    }

    #endregion

    #region Folder manager

    public async Task<string> CreateFolderAsync(string folderName, CancellationToken cancellationToken = default)
    {
        try
        {
            var filePath = $"uploads/media/{folderName}";

            var check = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", filePath));

            if (Directory.Exists(check))
            {
                return null;
            }

            // create full folders inside filepath

            await Task.Run(() =>
            {
                Directory.CreateDirectory(check);

                var image = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", filePath + MediaExtension.ImagePath));
                Directory.CreateDirectory(image);

                var video = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", filePath + MediaExtension.VideoPath));
                Directory.CreateDirectory(video);

                var audio = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", filePath + MediaExtension.AudioPath));
                Directory.CreateDirectory(audio);

                var panorama = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", filePath + MediaExtension.PanoramaPath));
                Directory.CreateDirectory(panorama);

                var thumbnailPanorama = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", filePath + MediaExtension.ThumbnailPanoramaPath));
                Directory.CreateDirectory(thumbnailPanorama);

                var thumbnail = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", filePath + MediaExtension.ThumbnailPath));
                Directory.CreateDirectory(thumbnail);

                var other = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", filePath + MediaExtension.OtherPath));
                Directory.CreateDirectory(other);
            }, cancellationToken);

            return filePath;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Could not create folder");
            return null;
        }
    }

    public Task<bool> DeleteFolderAsync(string folderName, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
    public Task<bool> MoveFolderAsync(string folderName, string newFolderName, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    #endregion

    #region File Manager

    public async Task<string> UploadFileAsync(Stream buffer, string folderPath, string originalFileName, string contentType,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var fileExt = Path.GetExtension(originalFileName).ToLower();
            var returnFilePath = "";

            var fileType = contentType.Split('/')[0];

            if (fileType == "image" && MediaExtension.CheckPanoramaImage(buffer))
            {
                returnFilePath = CreateFilePath(folderPath.Replace("//", "/"), fileExt, "panorama");
            }
            else
            {
                returnFilePath = CreateFilePath(folderPath.Replace("//", "/"), fileExt, fileType);
            }

            var fullPath = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", returnFilePath));

            buffer.Position = 0;

            await using var fileStream = new FileStream(
                fullPath, FileMode.Create);

            await buffer.CopyToAsync(fileStream, cancellationToken);

            return returnFilePath;

        }
        catch (Exception e)
        {
            _logger.LogError(e, "Could not upload file");
            return null;
        }
    }

    public async Task<string> SaveThumbnailAsync(
        FileType fileType,
        IFormFile sourceImage,
        string originalFileName,
        string folderPath,
        CancellationToken cancellationToken = default)
    {
        switch (fileType)
        {
            case FileType.Video:
                return await SaveThumbnailFromVideoAsync(sourceImage, folderPath, cancellationToken);

            case FileType.Image:
            case FileType.Panorama:
                Image image = await Image.LoadAsync(sourceImage.OpenReadStream(), cancellationToken);
                if (fileType == FileType.Panorama)
                {
                    return await SaveThumbnailFromPanoramaImageAsync(image, folderPath, originalFileName, cancellationToken);
                }
                return await SaveThumbnailFromImageAsync(image, folderPath, originalFileName, cancellationToken);

            case FileType.Audio:
                return "app_data/audio_thumbnail.png";

            case FileType.Other:
                return "app_data/other_thumbnail.png";

        }
        return null;
    }

    public Task<bool> DeleteFileAsync(string filePath, CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(filePath))
            {
                Task.FromResult(true);
            }

            if (filePath != null)
            {
                var fullPath = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", filePath));
                File.Delete(fullPath);
            }

            return Task.FromResult(true);
        }
        catch (Exception e)
        {
            _logger.LogError(e, $"Could not delete file '{filePath}'.");
            return Task.FromResult(false);
        }
    }

    #endregion

    #region Prive function

    // save thumbnail form video
    private static async Task<string> SaveThumbnailFromVideoAsync(
        IFormFile sourceVideo,
        string folderPath,
        CancellationToken cancellationToken = default)
    {
        var tempVideoPath = Path.GetTempFileName();
        try
        {
            var returnFilePath = CreateFilePath(folderPath.Replace("//", "/"), ".jpg", "thumbnail");
            var fullPath = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", returnFilePath));

            await using var stream = new FileStream(tempVideoPath, FileMode.Create);
            await sourceVideo.CopyToAsync(stream, cancellationToken);

            var ffMpeg = new FFMpegConverter();

            // Specify the complete path for the thumbnail file, including the file name and extension

            // Generate the video thumbnail at the specified time (5 seconds in this example)
            ffMpeg.GetVideoThumbnail(tempVideoPath, fullPath, 5);

            return returnFilePath;
        }
        finally
        {
            // Cleanup: delete the temporary video file
            File.Delete(tempVideoPath);
        }

    }

    public async Task<string> SaveThumbnailFromImageAsync(
        Image originalImage,
        string folderPath,
        string originalFileName,
        CancellationToken cancellationToken = default)
    {
        try
        {
            GetNewWidthImage(originalImage.Width, originalImage.Height, out var newWidth, out var newHeight);
            using var resizedImage = originalImage.Clone(ctx => ctx.Resize(new ResizeOptions
            {
                Size = new Size(newWidth, 0),
                Mode = ResizeMode.Max,
            }));

            using var result = resizedImage.Clone(ctx => ctx.Resize(new ResizeOptions { Size = new Size(newWidth, newHeight) }));

            var fileExt = Path.GetExtension(originalFileName).ToLower();
            var returnFilePath = CreateFilePath(folderPath.Replace("//", "/"), fileExt, "thumbnail");
            var fullPath = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", returnFilePath));

            await result.SaveAsync(fullPath, cancellationToken);

            return returnFilePath;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Could not reduce panorama image");
            return null;
        }
    }


    private static int GetNewWidthPanorama(int originalWidth)
    {
        switch (originalWidth)
        {
            case 13312:
                return originalWidth / 16;
            case 6656:
                return originalWidth / 8;
            case 3328:
                return originalWidth / 4;
            case 1664:
                return originalWidth / 2;
            default:
                if (originalWidth <= 416)
                {
                    return originalWidth;
                }
                return originalWidth / 5;
        }
    }

    private static void GetNewWidthImage(int originalWidth, int originHeight, out int newWidth, out int newHeight)
    {
        if (originalWidth <= 416)
        {
            newWidth = originalWidth;
            newHeight = originHeight;
        }
        newWidth = originalWidth / 5;
        newHeight = (int)Math.Round((double)originHeight / 5);
    }


    private static string CreateFilePath(string folderPath, string fileExt, string contentType = "")
    {
        return contentType switch
        {
            "image" => string.Format(folderPath + MediaExtension.ImagePath + "/{0}{1}",
                "image_" + Guid.NewGuid().ToString("N"), fileExt),
            "video" => string.Format(folderPath + MediaExtension.VideoPath + "/{0}{1}",
                "video_" + Guid.NewGuid().ToString("N"), fileExt),
            "audio" => string.Format(folderPath + MediaExtension.AudioPath + "/{0}{1}",
                "audio_" + Guid.NewGuid().ToString("N"), fileExt),
            "panorama" => string.Format(folderPath + MediaExtension.PanoramaPath + "/{0}{1}",
                "panorama_" + Guid.NewGuid().ToString("N"), fileExt),
            "thumbnail_panorama" => string.Format(folderPath + MediaExtension.ThumbnailPanoramaPath + "/{0}{1}",
                "thumbnail_panorama_" + Guid.NewGuid().ToString("N"), fileExt),
            "thumbnail" => string.Format(folderPath + MediaExtension.ThumbnailPath + "/{0}{1}",
                "thumbnail_" + Guid.NewGuid().ToString("N"), fileExt),
            _ => string.Format(folderPath + MediaExtension.OtherPath + "/{0}{1}",
                "other_" + Guid.NewGuid().ToString("N"), fileExt)
        };
    }
    #endregion
}