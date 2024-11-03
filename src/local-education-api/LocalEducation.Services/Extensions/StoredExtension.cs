using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace LocalEducation.Services.Extensions;

public static class StoredExtension
{
	public static Task<IQueryable<T>> ExecuteStoredProcedureAsync<T>(
		this DbContext context,
		string storedProcedureName,
		params SqlParameter[] parameters)
		where T : class
	{
		string commandText = $"EXEC {storedProcedureName} {string.Join(",", parameters.Select(p => $"@{p.ParameterName}"))}";
		return Task.FromResult(context.Set<T>().FromSqlRaw(commandText, parameters));
	}

	public static Task<IQueryable<T>> ExecuteStoredProcedureAsync<T>(this DbContext context, string storedProcedureName)
		where T : class
	{
		string commandText = $"EXEC {storedProcedureName}";

		return Task.FromResult(context.Set<T>().FromSqlRaw(commandText));
	}
}