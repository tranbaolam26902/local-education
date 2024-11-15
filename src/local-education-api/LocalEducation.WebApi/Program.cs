using LocalEducation.WebApi.Endpoints;
using LocalEducation.WebApi.Extensions;
using LocalEducation.WebApi.Mapsters;
using LocalEducation.WebApi.Validations;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder
	.ConfigureCors()
	.ConfigureServices()
	.ConfigureSwaggerOpenApi()
	.ConfigureFileUpload()
	.ConfigureConfigureIdentity()
	.ConfigureMapster()
	.ConfigureFluentValidation()
	.ConfigureAuthentication();


WebApplication app = builder.Build();
{
	app.SetupRequestPipeline();

	app.SetupContext();

	app.SetupMiddleware();

	// use seeder
	try
	{
		app.UseDataSeeder();
	}
	finally
	{
		app.SetupLocalMedia();
	}

	// Config endpoint;
	app.MapUserEndpoints()
		.MapTourEndpoints()
		.MapSceneEndpoints()
		.MapFolderEndpoints()
		.MapFileEndpoints()
		.MapCourseEndpoints()
		.MapLessonEndpoints()
		.MapSlideEndpoints()
		.MapProgressEndpoints()
		.MapDashboardEndpoints()
		.MapQuestionEndpoint();

	app.Run();
}