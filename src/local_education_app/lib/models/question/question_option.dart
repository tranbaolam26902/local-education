// ignore_for_file: public_member_api_docs, sort_constructors_first
class QuestionOption {
  String id;
  String questionId;
  int index;
  String content;
  QuestionOption({
    required this.id,
    required this.questionId,
    required this.index,
    required this.content,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'id': id,
      'questionId': questionId,
      'index': index,
      'content': content,
    };
  }

  factory QuestionOption.fromMap(Map<String, dynamic> map) {
    return QuestionOption(
      id: map['id'] as String,
      questionId: map['questionId'] as String,
      index: map['index'] as int,
      content: map['content'] as String,
    );
  }

  // String toJson() => json.encode(toMap());

  // factory QuestionOption.fromJson(String source) =>
  //     QuestionOption.fromMap(json.decode(source) as Map<String, dynamic>);
}
