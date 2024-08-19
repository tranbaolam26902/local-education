using FluentValidation;
using LocalEducation.WebApi.Models.UserModel;

namespace LocalEducation.WebApi.Validations;

public class RegisterValidator : AbstractValidator<RegisterModel>
{
	public RegisterValidator()
	{
		RuleFor(s => s.Email)
			.EmailAddress().WithMessage("Email không đúng định dạng")
			.NotEmpty().WithMessage("Email không được để trống.");

		RuleFor(s => s.Username)
			.NotEmpty().WithMessage("Tên đăng nhập không được để trống.")
			.MaximumLength(128).WithMessage("Tên đăng nhập không được nhiều hơn 128 ký tự.")
			.Must(ValidationHelpers.BeAValidUsername).WithMessage("Tên đăng nhập không được chứa khoản trắng.");

		RuleFor(s => s.Password)
			.NotEmpty().WithMessage("Mật khẩu không được để trống.")
			.MinimumLength(8).WithMessage("Mật khẩu phải có ít nhất 8 ký tự.");
	}
}