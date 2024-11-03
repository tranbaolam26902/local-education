using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class ProgressMap : IEntityTypeConfiguration<Progress>
{
	public void Configure(EntityTypeBuilder<Progress> builder)
	{
		builder.ToTable("Progresses");

		builder.HasKey(x => x.Id);

		#region Propetites

		builder.Property(x => x.Slides)
			.HasDefaultValue("");

		builder.Property(c => c.CreatedDate)
			.IsRequired()
			.HasColumnType("datetime");

		#endregion

		#region Relationships

		builder.HasOne(o => o.User)
			.WithMany(d => d.Progresses)
			.HasForeignKey(d => d.UserId)
			.HasConstraintName("FK_Courses_Progresses")
			.OnDelete(DeleteBehavior.Cascade);

		builder.HasOne(o => o.Course)
			.WithMany(d => d.Progresses)
			.HasForeignKey(d => d.CourseId)
			.HasConstraintName("FK_Users_Progresses")
			.OnDelete(DeleteBehavior.Cascade);

		#endregion
	}
}