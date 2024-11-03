using Mapster;
using MapsterMapper;

namespace LocalEducation.WebApi.Mapsters;

public static class MapsterDependencyInjection
{
	public static WebApplicationBuilder ConfigureMapster(
		this WebApplicationBuilder builder)
	{
		TypeAdapterConfig config = TypeAdapterConfig.GlobalSettings;

		config.Scan(typeof(MapsterConfiguration).Assembly);

		builder.Services.AddSingleton(config);
		builder.Services.AddScoped<IMapper, ServiceMapper>();

		return builder;
	}
}