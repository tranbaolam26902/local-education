// ignore_for_file: public_member_api_docs, sort_constructors_first
class Answer {
  int questionIndex;
  int optionIndex;
  Answer({
    required this.questionIndex,
    required this.optionIndex,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'questionIndex': questionIndex,
      'optionIndex': optionIndex,
    };
  }

  factory Answer.fromMap(Map<String, dynamic> map) {
    return Answer(
      questionIndex: map['questionIndex'] as int,
      optionIndex: map['optionIndex'] as int,
    );
  }
}
