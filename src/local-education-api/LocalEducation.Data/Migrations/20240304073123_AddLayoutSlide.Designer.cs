﻿// <auto-generated />
using System;
using LocalEducation.Data.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace LocalEducation.Data.Migrations
{
    [DbContext(typeof(LocalEducationDbContext))]
    [Migration("20240304073123_AddLayoutSlide")]
    partial class AddLayoutSlide
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.13")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("LocalEducation.Core.Entities.Atlas", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("IsShowOnStartUp")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<string>("Path")
                        .IsRequired()
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.HasKey("Id");

                    b.ToTable("Atlases", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Audio", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("AutoPlay")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<bool>("LoopAudio")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<string>("Path")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)")
                        .HasDefaultValue("");

                    b.Property<string>("ThumbnailPath")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)")
                        .HasDefaultValue("");

                    b.HasKey("Id");

                    b.ToTable("Audios", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Course", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<string>("Description")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(4096)
                        .HasColumnType("nvarchar(max)")
                        .HasDefaultValue("");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<bool>("IsLockedProgress")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<bool>("IsPublished")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<string>("ThumbnailPath")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<string>("Title")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<string>("UrlPath")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<string>("UrlSlug")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("ViewCount")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(0);

                    b.HasKey("Id");

                    b.ToTable("Courses", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.File", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<int>("FileType")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(0);

                    b.Property<Guid>("FolderId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("Path")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)");

                    b.Property<float>("Size")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(0f);

                    b.Property<string>("ThumbnailPath")
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)");

                    b.HasKey("Id");

                    b.HasIndex("FolderId");

                    b.ToTable("Files", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Folder", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("Slug")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Folders", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.InfoHotspot", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Address")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<string>("Description")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(4096)
                        .HasColumnType("nvarchar(max)")
                        .HasDefaultValue("");

                    b.Property<Guid>("LessonId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("SceneId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("ThumbnailPath")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<string>("Title")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<float>("X")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(0f);

                    b.Property<float>("Y")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(0f);

                    b.Property<float>("Z")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(0f);

                    b.HasKey("Id");

                    b.HasIndex("SceneId");

                    b.ToTable("InfoHotspots", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Lesson", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CourseId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Description")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(4096)
                        .HasColumnType("nvarchar(max)")
                        .HasDefaultValue("");

                    b.Property<int>("Index")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(0);

                    b.Property<bool>("IsPublished")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<bool>("IsVr")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<string>("ThumbnailPath")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<string>("Title")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<string>("TourSlug")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<string>("UrlPath")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<string>("UrlSlug")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)");

                    b.HasKey("Id");

                    b.HasIndex("CourseId");

                    b.ToTable("Lessons", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.LinkHotspot", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("LinkId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("SceneId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("SceneIndex")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(0);

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<float>("X")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(0f);

                    b.Property<float>("Y")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(0f);

                    b.Property<float>("Z")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(0f);

                    b.HasKey("Id");

                    b.HasIndex("SceneId");

                    b.ToTable("LinkHotspots", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Pin", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("AtlasId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<float>("Left")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(0f);

                    b.Property<int>("SceneIndex")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(0);

                    b.Property<string>("ThumbnailPath")
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<string>("Title")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<float>("Top")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(0f);

                    b.HasKey("Id");

                    b.HasIndex("AtlasId");

                    b.ToTable("Pins", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Progress", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CourseId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Slides")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(max)")
                        .HasDefaultValue("");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("CourseId");

                    b.HasIndex("UserId");

                    b.ToTable("Progresses", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Role", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.HasKey("Id");

                    b.ToTable("Roles", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Scene", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Index")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(0);

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)");

                    b.Property<Guid>("TourId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("UrlImage")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)")
                        .HasDefaultValue("");

                    b.Property<string>("UrlPreview")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)")
                        .HasDefaultValue("");

                    b.Property<float>("X")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(0f);

                    b.Property<float>("Y")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(0f);

                    b.Property<float>("Z")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(0f);

                    b.HasKey("Id");

                    b.HasIndex("TourId");

                    b.ToTable("Scenes", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Slide", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(max)")
                        .HasDefaultValue("");

                    b.Property<int>("Index")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(0);

                    b.Property<bool>("IsPublished")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<string>("Layout")
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)");

                    b.Property<Guid>("LessonId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("ThumbnailPath")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<string>("Title")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<string>("UrlPath")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.HasKey("Id");

                    b.HasIndex("LessonId");

                    b.ToTable("Slides", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Tour", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<bool>("IsPublished")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)");

                    b.Property<string>("UrlSlug")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("ViewCount")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(0);

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Tours", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Address")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)")
                        .HasDefaultValue("");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(16)
                        .HasColumnType("nvarchar(16)")
                        .HasDefaultValue("");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("nvarchar(64)");

                    b.HasKey("Id");

                    b.ToTable("Users", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.UserLogin", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("IpAddress")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<DateTime>("TokenCreated")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("TokenExpires")
                        .HasColumnType("datetime2");

                    b.Property<string>("UserAgent")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("UserLogins", (string)null);
                });

            modelBuilder.Entity("RoleUser", b =>
                {
                    b.Property<Guid>("RolesId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("UsersId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("RolesId", "UsersId");

                    b.HasIndex("UsersId");

                    b.ToTable("UserInRoles", (string)null);
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Atlas", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.Tour", "Tour")
                        .WithOne("Atlas")
                        .HasForeignKey("LocalEducation.Core.Entities.Atlas", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Tour");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Audio", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.Scene", "Scene")
                        .WithOne("Audio")
                        .HasForeignKey("LocalEducation.Core.Entities.Audio", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Scene");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.File", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.Folder", "Folder")
                        .WithMany("Files")
                        .HasForeignKey("FolderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Folder");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Folder", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.User", "User")
                        .WithMany("Folders")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.InfoHotspot", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.Scene", "Scene")
                        .WithMany("InfoHotspots")
                        .HasForeignKey("SceneId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Scene");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Lesson", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.Course", "Course")
                        .WithMany("Lessons")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Course");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.LinkHotspot", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.Scene", "Scene")
                        .WithMany("LinkHotspots")
                        .HasForeignKey("SceneId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Scene");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Pin", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.Atlas", "Atlas")
                        .WithMany("Pins")
                        .HasForeignKey("AtlasId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Atlas");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Progress", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.Course", "Course")
                        .WithMany("Progresses")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Users_Progresses");

                    b.HasOne("LocalEducation.Core.Entities.User", "User")
                        .WithMany("Progresses")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Courses_Progresses");

                    b.Navigation("Course");

                    b.Navigation("User");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Scene", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.Tour", "Tour")
                        .WithMany("Scenes")
                        .HasForeignKey("TourId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Tour");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Slide", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.Lesson", "Lesson")
                        .WithMany("Slides")
                        .HasForeignKey("LessonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Lesson");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Tour", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.User", "User")
                        .WithMany("Tours")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.UserLogin", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.User", "User")
                        .WithMany("UserLogins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Users_Logins");

                    b.Navigation("User");
                });

            modelBuilder.Entity("RoleUser", b =>
                {
                    b.HasOne("LocalEducation.Core.Entities.Role", null)
                        .WithMany()
                        .HasForeignKey("RolesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("LocalEducation.Core.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UsersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Atlas", b =>
                {
                    b.Navigation("Pins");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Course", b =>
                {
                    b.Navigation("Lessons");

                    b.Navigation("Progresses");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Folder", b =>
                {
                    b.Navigation("Files");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Lesson", b =>
                {
                    b.Navigation("Slides");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Scene", b =>
                {
                    b.Navigation("Audio");

                    b.Navigation("InfoHotspots");

                    b.Navigation("LinkHotspots");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.Tour", b =>
                {
                    b.Navigation("Atlas");

                    b.Navigation("Scenes");
                });

            modelBuilder.Entity("LocalEducation.Core.Entities.User", b =>
                {
                    b.Navigation("Folders");

                    b.Navigation("Progresses");

                    b.Navigation("Tours");

                    b.Navigation("UserLogins");
                });
#pragma warning restore 612, 618
        }
    }
}
