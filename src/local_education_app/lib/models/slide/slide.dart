// ignore_for_file: public_member_api_docs, sort_constructors_first
class Slide {
  String id;
  String lessonId;
  String title;
  String content;
  String layout;
  int index;
  String thumbnailPath;
  String urlPath;
  bool isPublished;
  bool isTest;
  int minPoint;
  Slide({
    required this.id,
    required this.lessonId,
    required this.title,
    required this.content,
    required this.layout,
    required this.index,
    required this.thumbnailPath,
    required this.urlPath,
    required this.isPublished,
    required this.isTest,
    required this.minPoint,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'id': id,
      'lessonId': lessonId,
      'title': title,
      'content': content,
      'layout': layout,
      'index': index,
      'thumbnailPath': thumbnailPath,
      'urlPath': urlPath,
      'isPublished': isPublished,
      'isTest': isTest,
      'minPoint': minPoint,
    };
  }

  factory Slide.fromMap(Map<String, dynamic> map) {
    return Slide(
      id: map['id'] as String,
      lessonId: map['lessonId'] as String,
      title: map['title'] as String,
      content: map['content'] as String,
      layout: map['layout'] as String,
      index: map['index'] as int,
      thumbnailPath: map['thumbnailPath'] as String,
      urlPath: map['urlPath'] as String,
      isPublished: map['isPublished'] as bool,
      isTest: map['isTest'] as bool,
      minPoint: map['minPoint'] as int,
    );
  }
}
