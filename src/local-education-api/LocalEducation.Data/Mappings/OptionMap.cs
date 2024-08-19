using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class OptionMap : IEntityTypeConfiguration<Option>
{
    public void Configure(EntityTypeBuilder<Option> builder)
    {
        builder.ToTable("Options");

        builder.HasKey(o => o.Id);

        #region Properties config

        builder.Property(o => o.Content)
            .IsRequired()
            .HasMaxLength(1024);

        builder.Property(o => o.Index)
            .IsRequired();

        builder.Property(o => o.QuestionId)
            .IsRequired();

        #endregion

        #region Relationships

        builder.HasOne(o => o.Question)
            .WithMany(q => q.Options)
            .HasForeignKey(o => o.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        #endregion
    }
}