enum Type { multipleChoices, multipleResponses, picture, video, audio }

class Question {
  final String? categoryName;
  final Type? type;
  final String? question;
  final String? path;
  final List<dynamic>? correctAnswers;
  final List<dynamic>? incorrectAnswers;

  Question(
      {this.categoryName,
      this.type,
      this.path,
      this.question,
      this.correctAnswers,
      this.incorrectAnswers});

  Question.fromMap(Map<String, dynamic> data)
      : categoryName = data["categoryName"] as String?,
        type = data["type"] == "multipleChoices"
            ? Type.multipleChoices
            : (data["type"] == "multipleResponses")
                ? Type.multipleResponses
                : (data["type"] == "picture")
                    ? Type.picture
                    : (data["type"] == "video")
                        ? Type.video
                        : (data["type"] == "audio")
                            ? Type.audio
                            : null,
        path = data["path"] as String?,
        question = data["question"] as String?,
        correctAnswers = data["correctAnswers"] as List<dynamic>?,
        incorrectAnswers = data["incorrectAnswers"] as List<dynamic>?;

  static List<Question> fromData(List<Map<String, dynamic>> data) {
    return data.map((question) => Question.fromMap(question)).toList();
  }
}
