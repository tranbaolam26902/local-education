using FluentValidation;
using LocalEducation.WebApi.Models.UserModel;

namespace LocalEducation.WebApi.Validations;

public class LoginValidator : AbstractValidator<UserLoginModel>
{
	public LoginValidator()
	{
		RuleFor(s => s.Username)
			.NotEmpty().WithMessage("Tên đăng nhập không được để trống.")
			.MaximumLength(128).WithMessage("Tên đăng nhập không được nhiều hơn 128 ký tự.")
			.Must(ValidationHelpers.BeAValidUsername).WithMessage("Tên đăng nhập không được chứa khoản trắng.");
	}
}