using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace LocalEducation.Data.Mappings;

public class QuestionMap : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.ToTable("Questions");

        builder.HasKey(q => q.Id);

        #region Properties config

        builder.Property(q => q.Content)
            .IsRequired()
            .HasMaxLength(2048);

        builder.Property(q => q.Url)
            .HasMaxLength(512);

        builder.Property(q => q.Index)
            .IsRequired();

        builder.Property(q => q.IndexCorrect)
            .IsRequired();

        builder.Property(q => q.CreatedDate)
            .IsRequired()
            .HasColumnType("datetime");

        builder.Property(q => q.SlideId)
            .IsRequired();

        #endregion

        #region Relationships

        builder.HasOne(q => q.Slide)
            .WithMany(s => s.Questions)
            .HasForeignKey(q => q.SlideId)
            .OnDelete(DeleteBehavior.Cascade);

        #endregion
    }
}