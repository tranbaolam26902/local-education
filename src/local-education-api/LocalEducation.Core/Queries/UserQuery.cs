namespace LocalEducation.Core.Queries;

public class UserQuery : IUserQuery
{
	public string Keyword { get; set; } = "";
	public int Day { get; set; } = 0;
	public int Month { get; set; } = 0;
	public int Year { get; set; } = 0;
}