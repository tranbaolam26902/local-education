using FluentValidation;
using LocalEducation.WebApi.Models.LessonModel;

namespace LocalEducation.WebApi.Validations;

public class LessonValidator : AbstractValidator<LessonEditModel>
{
    public LessonValidator()
    {
        RuleFor(l => l.Index)
            .NotNull()
            .WithMessage("Thứ tự bài học không được để trống");

        RuleFor(l => l.Title)
            .NotEmpty()
            .WithMessage("Tên bài học không được để trống")
            .MaximumLength(512)
            .WithMessage("Tên bài học không được vượt quá 512 ký tự");
    }
}