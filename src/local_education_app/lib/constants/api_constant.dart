class ApiEndpoint {
  static const String domain = 'https://7fb1-27-70-228-115.ngrok-free.app';

  // Authorization
  static const String authRoot = '$domain/api/users';
  static const String authLogin = '$authRoot/login';
  static const String authGetProfile = '$authRoot/getProfile';
  static const String authRegister = '$authRoot/register';
  static const String authRefreshToken = '$authRoot/refreshToken';

  //Course
  static String courseRoot = "$domain/api/courses";
  static String getCourse({String keyword = ""}) {
    if (keyword.isEmpty) {
      return courseRoot;
    }
    return "$courseRoot?Keyword=$keyword";
  }

  static String getCourseBySlug(String slug) {
    return '$courseRoot/bySlug/$slug';
  }

  static String enrollCourse(String courseId) {
    return '$courseRoot/takePartInCourse/$courseId';
  }

  // Tour
  static String getTour({String keyword = ""}) {
    if (keyword.isEmpty) {
      return "$domain/api/tours";
    }
    return "$domain/api/tours?Keyword=$keyword";
  }

  static String getTourBySlug(String slug) {
    return '$domain/api/tours/bySlug/$slug';
  }

  // Lesson
  static String getLessonsBySlug(String slug) {
    return '$domain/api/lessons/getLessons/$slug';
  }

  // Slides
  static String slideRoot = '$domain/api/slides';
  static String getSlideByLessonID(String lessonID) {
    return '$slideRoot/list/$lessonID';
  }

  static String getSlideByiD(String slideID) {
    return '$slideRoot/$slideID';
  }

  // Progress
  static String progressRoot = '$domain/api/progress';
  static String getAllProgress = progressRoot;
  static String postComplete(String slideId) {
    return '$progressRoot/completed/$slideId';
  }

  static String getDetailProgress(String progressId) =>
      '$progressRoot/$progressId';
  static String getCompletionPercentage(String courseId) =>
      '$progressRoot/completionPercentage/$courseId';
  // Questions
  static String questionRoot = '$domain/api/Questions';
  static String getQuestionsBySlide(String slideId) {
    return "$questionRoot/$slideId";
  }
}
