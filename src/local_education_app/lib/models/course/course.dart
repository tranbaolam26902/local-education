// ignore_for_file: public_member_api_docs, sort_constructors_first
class Course {
  String id;
  String userId;
  String title;
  String urlSlug;
  String description;
  String thumbnailPath;
  String urlPath;
  DateTime createdDate;
  int viewCount;
  bool isPublished;
  bool isDeleted;
  int totalLesson;
  Course({
    required this.id,
    required this.userId,
    required this.title,
    required this.urlSlug,
    required this.description,
    required this.thumbnailPath,
    required this.urlPath,
    required this.createdDate,
    required this.viewCount,
    required this.isPublished,
    required this.isDeleted,
    required this.totalLesson,
  });
  factory Course.fromMap(Map<String, dynamic> json) {
    return Course(
      id: json['id'],
      userId: json['userId'],
      title: json['title'],
      urlSlug: json['urlSlug'],
      description: json['description'],
      thumbnailPath: json['thumbnailPath'],
      urlPath: json['urlPath'],
      createdDate: DateTime.parse(json['createdDate']),
      viewCount: json['viewCount'],
      isPublished: json['isPublished'],
      isDeleted: json['isDeleted'],
      totalLesson: json['totalLesson'],
    );
  }
}
