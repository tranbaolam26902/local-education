import 'package:flutter/material.dart';
import 'package:local_education_app/api/question_api.dart';
import 'package:local_education_app/models/question/question.dart';

class QuestionProvider with ChangeNotifier {
  List<Question> _questionList = [];
  void setQuestionList(List<Question> list) {
    _questionList = list;
    notifyListeners();
  }

  List<Question> get questionList => _questionList;

  Future<int> getQuestionsBySlide(String slideId) async {
    try {
      final response = await getQuestionsBySlideId(slideId);
      if (response['statusCode'] == 200) {
        final result = response['result'];
        setQuestionList(result?.map<Question>((e) {
              return Question.fromMap(e);
            }).toList() ??
            []);
        return 200;
      } else {
        setQuestionList([]);
        return 201;
      }
    } catch (e, stack) {
      debugPrint("There is error while getting questions: $e");
      debugPrintStack(stackTrace: stack);
      setQuestionList([]);
      return 400;
    }
  }
}
