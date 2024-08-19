using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class CourseMap : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.ToTable("Courses");

        builder.HasKey(c => c.Id);

        #region Properties config

        builder.Property(c => c.Title)
            .IsRequired()
            .HasMaxLength(512)
            .HasDefaultValue("");

        builder.Property(c => c.UrlSlug)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(c => c.Description)
            .HasMaxLength(4096)
            .HasDefaultValue("");

        builder.Property(c => c.ThumbnailPath)
            .HasMaxLength(512)
            .HasDefaultValue("");

        builder.Property(c => c.UrlPath)
            .HasMaxLength(512)
            .HasDefaultValue("");

        builder.Property(c => c.CreatedDate)
            .IsRequired()
            .HasColumnType("datetime");

        builder.Property(c => c.ViewCount)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(c => c.IsLockedProgress)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(c => c.IsPublished)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(c => c.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        #endregion

        #region Relationships

        builder.HasMany(t => t.Lessons)
            .WithOne(s => s.Course)
            .HasForeignKey(s => s.CourseId);
        #endregion
    }
}