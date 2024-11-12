namespace LocalEducation.Core.Queries;

public interface IDashboardQuery
{
	public DateTime StartDate { get; set; }

	public DateTime EndDate { get; set; }
}