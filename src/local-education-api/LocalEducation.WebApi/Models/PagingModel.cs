using LocalEducation.Core.Contracts;

namespace LocalEducation.WebApi.Models;

public class PagingModel : IPagingParams
{
	public int? PageNumber { get; set; } = 1;
	public int? PageSize { get; set; } = 11;
	public string SortColumn { get; set; } = "Id";
	public string SortOrder { get; set; } = "DESC";
}