using LocalEducation.Core.Dto;
using LocalEducation.Core.Entities;
using LocalEducation.Core.Collections;
using LocalEducation.WebApi.Models.FileModel;
using LocalEducation.WebApi.Models.TourModel;
using LocalEducation.WebApi.Models.UserModel;
using LocalEducation.WebApi.Models.CourseModel;
using LocalEducation.WebApi.Models.ProgressModel;
using Mapster;

namespace LocalEducation.WebApi.Mapsters;

public class MapsterConfiguration : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<User, UserDto>()
            .Map(dest => dest.RoleName,
                src => src.Roles == null || !src.Roles.Any() ? "" :
                    src.Roles.Any(r => r.Name == "Admin") ? "Admin" :
                    src.Roles.Any(r => r.Name == "Manager") ? "Manager" :
                    "User");

        config.NewConfig<Tour, TourDto>()
            .Map(dest => dest.Username,
                src => src.User == null ? "" : src.User.Name);

        config.NewConfig<Tour, TourItem>()
            .Map(dest => dest.Username,
                src => src.User == null ? "" : src.User.Name);

        config.NewConfig<RefreshToken, UserLogin>()
            .Map(dest => dest.RefreshToken, src => src.Token);

        config.NewConfig<Folder, FolderDto>()
            .Map(dest => dest.TotalSize,
                src => src.Files == null ? 0 : src.Files.Sum(s => s.Size));

        config.NewConfig<Course, CourseDto>()
            .Map(dest => dest.Lessons, src => src.Lessons ?? new List<Lesson>())
            .Map(dest => dest.TotalLesson,
                src => src.Lessons != null ? src.Lessons.Count : 0);

        config.NewConfig<Course, CourseItem>()
            .Map(dest => dest.TotalLesson,
                src => src.Lessons != null ? src.Lessons.Count : 0);

        config.NewConfig<Progress, ProgressDto>()
            .Ignore(s => s.Slides)
            .Ignore(s => s.Completed)
            .Map(dest => dest.Title,
                               src => src.Course != null ? src.Course.Title : "")
            .Map(dest => dest.Description,
                src => src.Course != null ? src.Course.Description : "")
            .Map(dest => dest.UrlSlug,
                src => src.Course != null ? src.Course.UrlSlug : "")
            .Map(dest => dest.UrlPath,
                src => src.Course != null ? src.Course.UrlPath : "")
            .Map(dest => dest.ThumbnailPath,
                src => src.Course != null ? src.Course.ThumbnailPath : "");
    }
}