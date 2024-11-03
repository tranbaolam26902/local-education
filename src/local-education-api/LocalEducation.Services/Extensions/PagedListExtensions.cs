using LocalEducation.Core.Collections;
using LocalEducation.Core.Contracts;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace LocalEducation.Services.Extensions;

public static class PagedListExtensions
{
	public static string GetOrderExpression(
		this IPagingParams pagingParams,
		string defaultColumn = "Id")
	{
		string column = string.IsNullOrWhiteSpace(pagingParams.SortColumn)
			? defaultColumn
			: pagingParams.SortColumn;

		string order = "ASC".Equals(
			pagingParams.SortOrder, StringComparison.OrdinalIgnoreCase)
			? pagingParams.SortOrder
			: "DESC";

		return $"{column} {order}";
	}

	public static async Task<IPagedList<T>> ToPagedListAsync<T>(
		this IQueryable<T> source,
		IPagingParams pagingParams,
		CancellationToken cancellationToken = default)
	{
		int totalCount = await source.CountAsync(cancellationToken);

		int pageNumber = pagingParams.PageNumber ?? 1;
		int pageSize = pagingParams.PageSize ?? 10;

		List<T> items = await source
			.OrderBy(pagingParams.GetOrderExpression())
			.Skip((pageNumber - 1) * pageSize)
			.Take(pageSize)
			.ToListAsync(cancellationToken);

		return new PagedList<T>(
			items,
			pageNumber,
			pageSize,
			totalCount);
	}

	public static Task<IPagedList<T>> ToPagedListAsync<T>(
		this IList<T> source,
		IPagingParams pagingParams,
		int totalCount)
	{
		int pageNumber = pagingParams.PageNumber ?? 1;
		int pageSize = pagingParams.PageSize ?? 10;

		return Task.FromResult<IPagedList<T>>(new PagedList<T>(
			source,
			pageNumber,
			pageSize,
			totalCount));
	}

	public static async Task<IPagedList<T>> ToPagedListAsync<T>(
		this IQueryable<T> source,
		int pageNumber = 1,
		int pageSize = 10,
		string sortColumn = "Id",
		string sortOrder = "DESC",
		CancellationToken cancellationToken = default)
	{
		int totalCount = await source.CountAsync(cancellationToken);
		List<T> items = await source.OrderBy($"{sortColumn} {sortOrder}")
			.Skip((pageNumber - 1) * pageSize)
			.Take(pageSize)
			.ToListAsync(cancellationToken);

		return new PagedList<T>(
			items, pageNumber, pageSize, totalCount);
	}
}