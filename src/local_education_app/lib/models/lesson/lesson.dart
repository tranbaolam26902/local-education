import 'package:local_education_app/models/lesson/slides/lesson_slide.dart';

class Lesson {
  String id;
  String title;
  String thumbnailPath;
  int index;
  bool isVr;
  String tourSlug;
  int totalSlide;
  bool isPublished;
  String description;
  List<LessonSlide> slides;
  Lesson({
    required this.id,
    required this.title,
    required this.thumbnailPath,
    required this.index,
    required this.isVr,
    required this.tourSlug,
    required this.totalSlide,
    required this.isPublished,
    required this.description,
    required this.slides,
  });

  factory Lesson.fromMap(Map<String, dynamic> map) {
    final List<dynamic> slideData = map['slides'] ?? [];
    final List<LessonSlide> slides = slideData.map((e) {
      return LessonSlide.fromMap(e);
    }).toList();
    return Lesson(
      id: map['id'] as String,
      title: map['title'] as String,
      thumbnailPath: map['thumbnailPath'] as String,
      index: map['index'] as int,
      isVr: map['isVr'] as bool,
      tourSlug: map['tourSlug'] as String,
      totalSlide: map['totalSlide'] as int,
      isPublished: map['isPublished'] as bool,
      description: map['description'] as String,
      slides: slides,
    );
  }

  // String toJson() => json.encode(toMap());

  // factory Lesson.fromJson(String source) =>
  //     Lesson.fromMap(json.decode(source) as Map<String, dynamic>);
}
