using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class LessonMap : IEntityTypeConfiguration<Lesson>
{
	public void Configure(EntityTypeBuilder<Lesson> builder)
	{
		builder.ToTable("Lessons");

		builder.HasKey(l => l.Id);

		#region Properties config

		builder.Property(l => l.Title)
			.IsRequired()
			.HasMaxLength(512)
			.HasDefaultValue("");

		builder.Property(l => l.UrlSlug)
			.IsRequired()
			.HasMaxLength(512);

		builder.Property(l => l.Description)
			.HasMaxLength(4096)
			.HasDefaultValue("");

		builder.Property(l => l.ThumbnailPath)
			.HasMaxLength(512)
			.HasDefaultValue("");

		builder.Property(l => l.UrlPath)
			.HasMaxLength(512)
			.HasDefaultValue("");

		builder.Property(l => l.Index)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(l => l.IsVr)
			.IsRequired()
			.HasDefaultValue(false);

		builder.Property(l => l.TourSlug)
			.IsRequired()
			.HasMaxLength(512)
			.HasDefaultValue("");

		builder.Property(l => l.IsPublished)
			.IsRequired()
			.HasDefaultValue(false);

		builder.Property(c => c.CreatedDate)
			.IsRequired()
			.HasColumnType("datetime");

		#endregion

		#region Relationships

		builder.HasMany(l => l.Slides)
			.WithOne(s => s.Lesson)
			.HasForeignKey(s => s.LessonId);

		#endregion

	}
}