// ignore_for_file: public_member_api_docs, sort_constructors_first

class Tour {
  String id;
  String title;
  String urlSlug;
  DateTime createDate;
  int viewCount;
  bool isPublished;
  bool isDeleted;
  String userName;
  String urlPreview;
  Tour({
    required this.id,
    required this.title,
    required this.urlSlug,
    required this.createDate,
    required this.viewCount,
    required this.isPublished,
    required this.isDeleted,
    required this.userName,
    required this.urlPreview,
  });
  factory Tour.fromMap(Map<String, dynamic> json) {
    return Tour(
      id: json['id'],
      title: json['title'],
      urlSlug: json['urlSlug'],
      createDate: DateTime.parse(json['createdDate']),
      viewCount: json['viewCount'],
      isDeleted: json['isPublished'],
      isPublished: json['isDeleted'],
      userName: json['username'],
      urlPreview: json['urlPreview'],
    );
  }
}
