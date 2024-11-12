namespace LocalEducation.Core.Queries;

public class DashboardQuery : IDashboardQuery
{
	public DateTime StartDate { get; set; }
	public DateTime EndDate { get; set; }
}