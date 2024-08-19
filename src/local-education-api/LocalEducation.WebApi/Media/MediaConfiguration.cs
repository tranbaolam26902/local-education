using LocalEducation.Core.Entities;
using LocalEducation.Data.Contexts;
using SixLabors.ImageSharp;

namespace LocalEducation.WebApi.Media;

public class MediaConfiguration
{
    private readonly LocalEducationDbContext _context;
    private readonly IMediaManager _mediaManager;

    public MediaConfiguration(LocalEducationDbContext context, IMediaManager manager)
    {
        this._context = context;

        this._mediaManager = manager;
    }
    public void Initialize()
    {
        var check = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", $"uploads/media"));

        if (!Directory.Exists(check))
        {
            Directory.CreateDirectory(check);
        }

        var user = _context.Users.FirstOrDefault(s => s.Username == "admin");

        _mediaManager.CreateFolderAsync(user.Id.ToString("N"));

    }
}

public static class MediaExtension
{
    public static readonly string _rootPath = "wwwroot/uploads/media";

    public static readonly string PanoramaPath = "/panoramas";

    public static readonly string ThumbnailPanoramaPath = "/panoramas/thumbnails";

    public static readonly string ImagePath = "/images";

    public static readonly string VideoPath = "/videos";

    public static readonly string AudioPath = "/audios";

    public static readonly string OtherPath = "/others";

    public static readonly string ThumbnailPath = "/thumbnails";

    public static bool CheckPanoramaImage(Stream buffer)
    {
        using var image = Image.Load(buffer);

        return image.Width / image.Height == 2;
    }

    public static FileType GetFileType(this string input, Stream buffer = null)
    {
        var type = input.Split('/')[0];
        // check content type is image and width/height is panorama
        if (type == "image" && buffer != null && CheckPanoramaImage(buffer))
        {
            return FileType.Panorama;
        }

        return type switch
        {
            "image" => FileType.Image,
            "video" => FileType.Video,
            "audio" => FileType.Audio,
            _ => FileType.Other
        };


    }
}