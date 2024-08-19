namespace LocalEducation.Core.Queries;

public interface IUserQuery
{
	public string Keyword { get; set; }

	public int Day { get; set; }

	public int Month { get; set; }

	public int Year { get; set; }
}