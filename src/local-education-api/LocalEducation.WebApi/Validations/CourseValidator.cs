using FluentValidation;
using LocalEducation.WebApi.Models.CourseModel;

namespace LocalEducation.WebApi.Validations;

public class CourseValidator : AbstractValidator<CourseEditModel>
{
    public CourseValidator()
    {
        RuleFor(s => s.Title)
            .NotEmpty()
            .WithMessage("Tên khóa học không được để trống");
    }
}