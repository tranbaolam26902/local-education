// ignore_for_file: public_member_api_docs, sort_constructors_first
class LessonSlide {
  String id;
  String title;
  int index;
  String thumbnailPath;
  String urlPath;
  String layout;
  bool isPublished;
  LessonSlide({
    required this.id,
    required this.title,
    required this.index,
    required this.thumbnailPath,
    required this.urlPath,
    required this.layout,
    required this.isPublished,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'id': id,
      'title': title,
      'index': index,
      'thumbnailPath': thumbnailPath,
      'urlPath': urlPath,
      'layout': layout,
      'isPublished': isPublished,
    };
  }

  factory LessonSlide.fromMap(Map<String, dynamic> map) {
    return LessonSlide(
      id: map['id'] as String,
      title: map['title'] as String,
      index: map['index'] as int,
      thumbnailPath: map['thumbnailPath'] as String,
      urlPath: map['urlPath'] as String,
      layout: map['layout'] as String,
      isPublished: map['isPublished'] as bool,
    );
  }
}
