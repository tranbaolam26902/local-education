// ignore_for_file: public_member_api_docs, sort_constructors_first

import 'package:local_education_app/models/progress/slide/%20progress_slide.dart';

class Progress {
  String id;
  String userId;
  String courseId;
  String title;
  String description;
  String urlSlug;
  String urlPath;
  String thumbnailPath;
  double completed;
  List<ProgressSlide> slides;
  Progress({
    required this.id,
    required this.userId,
    required this.courseId,
    required this.title,
    required this.description,
    required this.urlSlug,
    required this.urlPath,
    required this.thumbnailPath,
    required this.completed,
    required this.slides,
  });

  factory Progress.fromMap(Map<String, dynamic> map) {
    final List<dynamic> slideData = map['scenes'] ?? [];
    final List<ProgressSlide> slides = slideData.map((e) {
      return ProgressSlide.fromMap(e);
    }).toList();
    return Progress(
      id: map['id'] as String,
      userId: map['userId'] as String,
      courseId: map['courseId'] as String,
      title: map['title'] as String,
      description: map['description'] as String,
      urlSlug: map['urlSlug'] as String,
      urlPath: map['urlPath'] as String,
      thumbnailPath: map['thumbnailPath'] as String,
      completed: map['completed'] + 0.0,
      slides: slides,
    );
  }
}
