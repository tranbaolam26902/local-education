// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:local_education_app/models/question/question_option.dart';

class Question {
  String id;
  DateTime createdDate;
  String content;
  String url;
  int point;
  int index;
  int indexCorrect;
  String slideId;
  List<QuestionOption> options;
  Question({
    required this.id,
    required this.createdDate,
    required this.content,
    required this.url,
    required this.point,
    required this.index,
    required this.indexCorrect,
    required this.slideId,
    required this.options,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'id': id,
      'createdDate': createdDate.millisecondsSinceEpoch,
      'content': content,
      'url': url,
      'point': point,
      'index': index,
      'indexCorrect': indexCorrect,
      'slideId': slideId,
      'options': options.map((x) => x.toMap()).toList(),
    };
  }

  factory Question.fromMap(Map<String, dynamic> map) {
    final List<dynamic> optionData = map['options'] ?? [];
    final List<QuestionOption> options = optionData.map((e) {
      return QuestionOption.fromMap(e);
    }).toList();
    return Question(
      id: map['id'] as String,
      createdDate: DateTime.parse(map['createdDate']),
      content: map['content'] as String,
      url: map['url'] as String,
      point: map['point'] as int,
      index: map['index'] as int,
      indexCorrect: map['indexCorrect'] as int,
      slideId: map['slideId'] as String,
      options: options,
    );
  }
}
