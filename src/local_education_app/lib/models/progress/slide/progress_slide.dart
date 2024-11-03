// ignore_for_file: public_member_api_docs, sort_constructors_first

class ProgressSlide {
  String id;
  String lessonId;
  String slideIndex;
  bool isCompleted;
  ProgressSlide({
    required this.id,
    required this.lessonId,
    required this.slideIndex,
    required this.isCompleted,
  });

  factory ProgressSlide.fromMap(Map<String, dynamic> map) {
    return ProgressSlide(
      id: map['id'] as String,
      lessonId: map['lessonId'] as String,
      slideIndex: map['slideIndex'] as String,
      isCompleted: map['isCompleted'] as bool,
    );
  }
}
