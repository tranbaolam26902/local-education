import 'dart:async';
import 'package:local_education_app/screens/exam/components/audio_player.dart';
import 'package:local_education_app/screens/exam/components/timer.dart';
import 'package:local_education_app/screens/exam/components/chewie_list_item.dart';
import 'package:local_education_app/screens/exam/models/category.dart';
import 'package:local_education_app/screens/exam/models/question.dart';
import 'package:local_education_app/screens/exam/pages/result_page.dart';
import 'package:local_education_app/screens/exam/theme/color.dart';
import 'package:flutter/material.dart';
import 'package:flutter_custom_clippers/flutter_custom_clippers.dart';
import 'package:video_player/video_player.dart';

class QuizPage extends StatefulWidget {
  final int timeLimit;
  final List<Question> questions;
  final Category? category;
  const QuizPage(
      {Key? key,
      required this.questions,
      required this.category,
      required this.timeLimit})
      : super(key: key);

  @override
  State<QuizPage> createState() => _QuizPageState();
}

class _QuizPageState extends State<QuizPage> {
  /*  List<Question> widget.questions = [
    // Multiple Choices
    Question(
        categoryName: "Entertainment: Video Games",
        type: Type.multipleChoices,
        question: "What was the first game to be released on the Xbox 360?",
        correctAnswers: [
          "Call of Duty 2"
        ],
        incorrectAnswers: [
          "The Elder Scrolls IV: Oblivion",
          "Perfect Dark Zero",
          "Kameo: Elements of Power"
        ]),

    // Multiple Responses
    Question(
        categoryName: "Science: Biology",
        type: Type.multipleResponses,
        question: "What are the four major macromolecules essential for life?",
        correctAnswers: [
          "Carbohydrates",
          "Lipids",
          "Proteins",
          "Nucleic acids"
        ],
        incorrectAnswers: [
          "Vitamins",
          "Minerals",
          "Water",
          "Enzymes"
        ]),

    // Video
    Question(
        categoryName: "Science: Biology",
        type: Type.video,
        path: 'lib/videos/test.mp4',
        question:
            "Watch the video of the heart beating and identify the different parts of the heart.",
        correctAnswers: [
          "Answer"
        ],
        incorrectAnswers: [
          "Wrong answer 1",
          "Wrong answer 2",
          "Wrong answer 3"
        ]),

    // Picture
    Question(
        categoryName: "Art",
        type: Type.picture,
        path:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Earth%27s_Location_in_the_Universe_SMALLER_%28JPEG%29.jpg/1280px-Earth%27s_Location_in_the_Universe_SMALLER_%28JPEG%29.jpg",
        question: "Identify the painting 'The Kiss' by Gustav Klimt.",
        correctAnswers: [
          "Something"
        ],
        incorrectAnswers: [
          "Wrong answer 1",
          "Wrong answer 2",
          "Wrong answer 3"
        ]),

    // Audio
    Question(
        categoryName: "Music",
        type: Type.audio,
        path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        question:
            "Listen to the song 'Imagine' by John Lennon and identify the artist.",
        correctAnswers: ["John Lennon"],
        incorrectAnswers: ["The Beatles", "Paul McCartney", "George Harrison"]),
  ];
 */
  final TextStyle questionStyle = const TextStyle(
      fontSize: 18.0, fontWeight: FontWeight.w500, color: Colors.black87);

  int currentIndex = 0;

  final Map<int, dynamic> answers = {};
  final GlobalKey<ScaffoldState> key = GlobalKey<ScaffoldState>();

  List<dynamic> selectedOptions = [];

  void onSelectedOption(dynamic option, bool isSelected) {
    setState(() {
      if (isSelected) {
        selectedOptions.add(option);
      } else {
        selectedOptions.remove(option);
      }
      answers[currentIndex] = selectedOptions.join(' ');
      print(answers[currentIndex]);
    });
  }

  @override
  Widget build(BuildContext context) {
    //Question question = widget.questions[currentIndex];
    Question question = widget.questions[currentIndex];
    //print(question);
    final List<dynamic> options = question.incorrectAnswers!;
    for (final dynamic item in question.correctAnswers!) {
      if (!options.contains(item)) {
        options.add(item);
        options.shuffle();
      }
    }

    List<String> splittedTitle = widget.category!.name.split(".");
    String title = splittedTitle[0];

    return WillPopScope(
      onWillPop: onWillPop,
      child: Scaffold(
        key: key,
        backgroundColor: primaryColor,
        appBar: AppBar(
          title: Text(title),
          elevation: 0,
          backgroundColor: Colors.transparent,
        ),
        body: Container(
          height: double.infinity,
          width: double.infinity,
          decoration: BoxDecoration(
              gradient: LinearGradient(
                  colors: [primaryColor, primaryColor.withOpacity(0.5)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter)),
          child: Stack(
            children: <Widget>[
              ClipPath(
                clipper: WaveClipperTwo(),
                child: Container(
                  decoration: BoxDecoration(color: secondaryColor),
                  height: 350,
                ),
              ),
              Column(
                children: [
                  TimerWidget(
                      timeLimit: widget.timeLimit,
                      onTimerExpired: onTimerExpired),

                  // Switch between question types
                  Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      children: <Widget>[
                        Row(
                          children: <Widget>[
                            CircleAvatar(
                              backgroundColor: Colors.white70,
                              child: Text("${currentIndex + 1}"),
                            ),
                            const SizedBox(width: 16.0),
                            Expanded(
                              child: Text(
                                question.question!,
                                softWrap: true,
                                style: MediaQuery.of(context).size.width > 800
                                    ? questionStyle.copyWith(fontSize: 30.0)
                                    : questionStyle,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20.0),

                        // Switch between question types
                        if (question.type == Type.multipleChoices)
                          Card(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: <Widget>[
                                ...options.map((option) => RadioListTile(
                                      title: Text(
                                        '$option',
                                        style: MediaQuery.of(context)
                                                    .size
                                                    .width >
                                                800
                                            ? const TextStyle(fontSize: 30.0)
                                            : null,
                                      ),
                                      groupValue: answers[currentIndex],
                                      value: option,
                                      activeColor: Colors.grey,
                                      onChanged: (dynamic value) {
                                        setState(() {
                                          answers[currentIndex] = option;
                                        });
                                      },
                                    )),
                              ],
                            ),
                          )
                        else if (question.type == Type.multipleResponses)
                          Card(
                            child: ListBody(
                              children: [
                                ...options
                                    .map((option) => CheckboxListTile(
                                          title: Text(
                                            '$option',
                                            style: MediaQuery.of(context)
                                                        .size
                                                        .width >
                                                    800
                                                ? const TextStyle(
                                                    fontSize: 30.0)
                                                : null,
                                          ),
                                          activeColor: Colors.grey,
                                          controlAffinity:
                                              ListTileControlAffinity.leading,
                                          value:
                                              selectedOptions.contains(option),
                                          onChanged: (isChecked) =>
                                              onSelectedOption(
                                                  option, isChecked!),
                                        ))
                                    .toList(),
                              ],
                            ),
                          )
                        else if (question.type == Type.picture)
                          Column(
                            children: [
                              SizedBox(
                                height: 150,
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(20),
                                  child: Image.network(
                                    question.path!,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 10),
                              Card(
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: <Widget>[
                                    ...options.map((option) => RadioListTile(
                                          title: Text(
                                            '$option',
                                            style: MediaQuery.of(context)
                                                        .size
                                                        .width >
                                                    800
                                                ? const TextStyle(
                                                    fontSize: 30.0)
                                                : null,
                                          ),
                                          groupValue: answers[currentIndex],
                                          value: option,
                                          activeColor: Colors.grey,
                                          onChanged: (dynamic value) {
                                            setState(() {
                                              answers[currentIndex] = option;
                                            });
                                          },
                                        )),
                                  ],
                                ),
                              ),
                            ],
                          )
                        else if (question.type == Type.video)
                          Column(
                            children: [
                              SizedBox(
                                height: 200,
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(20),
                                  child: ChewieListItem(
                                      videoPlayerController:
                                          VideoPlayerController.asset(
                                              question.path!),
                                      looping: true),
                                ),
                              ),
                              Card(
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: <Widget>[
                                    ...options.map((option) => RadioListTile(
                                          title: Text(
                                            '$option',
                                            style: MediaQuery.of(context)
                                                        .size
                                                        .width >
                                                    800
                                                ? const TextStyle(
                                                    fontSize: 30.0)
                                                : null,
                                          ),
                                          groupValue: answers[currentIndex],
                                          value: option,
                                          activeColor: Colors.grey,
                                          onChanged: (dynamic value) {
                                            setState(() {
                                              answers[currentIndex] = option;
                                            });
                                          },
                                        )),
                                  ],
                                ),
                              )
                            ],
                          )
                        else if (question.type == Type.audio)
                          Column(
                            children: [
                              AudioPlayerWidget(audioPath: question.path!),
                              Card(
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: <Widget>[
                                    ...options.map((option) => RadioListTile(
                                          title: Text(
                                            '$option',
                                            style: MediaQuery.of(context)
                                                        .size
                                                        .width >
                                                    800
                                                ? const TextStyle(
                                                    fontSize: 30.0)
                                                : null,
                                          ),
                                          groupValue: answers[currentIndex],
                                          value: option,
                                          activeColor: Colors.grey,
                                          onChanged: (dynamic value) {
                                            setState(() {
                                              answers[currentIndex] = option;
                                            });
                                          },
                                        )),
                                  ],
                                ),
                              )
                            ],
                          )
                        else
                          Card(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: <Widget>[
                                ...options.map((option) => RadioListTile(
                                      title: Text(
                                        '$option',
                                        style: MediaQuery.of(context)
                                                    .size
                                                    .width >
                                                800
                                            ? const TextStyle(fontSize: 30.0)
                                            : null,
                                      ),
                                      groupValue: answers[currentIndex],
                                      value: option,
                                      activeColor: Colors.grey,
                                      onChanged: (dynamic value) {
                                        setState(() {
                                          answers[currentIndex] = option;
                                        });
                                      },
                                    )),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),

                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(20.0),
                      alignment: Alignment.bottomCenter,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          padding: MediaQuery.of(context).size.width > 800
                              ? const EdgeInsets.symmetric(
                                  vertical: 20.0, horizontal: 64.0)
                              : null,
                          backgroundColor: buttonColor,
                        ),
                        onPressed: nextSubmit,
                        child: Text(
                          currentIndex == (widget.questions.length - 1)
                              ? "Submit"
                              : "Next",
                          style: MediaQuery.of(context).size.width > 800
                              ? const TextStyle(fontSize: 30.0)
                              : null,
                        ),
                      ),
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }

  /*  Widget multipleChoices(
      BuildContext context, Question question, List<dynamic> options) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: <Widget>[
          Row(
            children: <Widget>[
              CircleAvatar(
                backgroundColor: Colors.white70,
                child: Text("${currentIndex + 1}"),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: Text(
                  question.question!,
                  softWrap: true,
                  style: MediaQuery.of(context).size.width > 800
                      ? questionStyle.copyWith(fontSize: 30.0)
                      : questionStyle,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20.0),
          Card(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                ...options.map((option) => RadioListTile(
                      title: Text(
                        '$option',
                        style: MediaQuery.of(context).size.width > 800
                            ? const TextStyle(fontSize: 30.0)
                            : null,
                      ),
                      groupValue: answers[currentIndex],
                      value: option,
                      activeColor: Colors.grey,
                      onChanged: (dynamic value) {
                        setState(() {
                          answers[currentIndex] = option;
                        });
                      },
                    )),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget multipleResponses(
      BuildContext context, Question question, List<dynamic> options) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: <Widget>[
          Row(
            children: <Widget>[
              CircleAvatar(
                backgroundColor: Colors.white70,
                child: Text("${currentIndex + 1}"),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: Text(
                  question.question!,
                  softWrap: true,
                  style: MediaQuery.of(context).size.width > 800
                      ? questionStyle.copyWith(fontSize: 30.0)
                      : questionStyle,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20.0),
          Card(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                ...options.map((option) => CheckboxListTile(
                      title: Text(
                        '$option',
                        style: MediaQuery.of(context).size.width > 800
                            ? const TextStyle(fontSize: 30.0)
                            : null,
                      ),
                      value: selectedOptions.contains(option),
                      activeColor: Colors.grey,
                      onChanged: (bool? value) {},
                    )),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget picture(
      BuildContext context, Question question, List<dynamic> options) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: <Widget>[
          Row(
            children: <Widget>[
              CircleAvatar(
                backgroundColor: Colors.white70,
                child: Text("${currentIndex + 1}"),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: Text(
                  question.question!,
                  softWrap: true,
                  style: MediaQuery.of(context).size.width > 800
                      ? questionStyle.copyWith(fontSize: 30.0)
                      : questionStyle,
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Image.network(
              question.path!,
            ),
          ),
          // Image
          const SizedBox(height: 20.0),

          Card(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                ...options.map((option) => RadioListTile(
                      title: Text(
                        '$option',
                        style: MediaQuery.of(context).size.width > 800
                            ? const TextStyle(fontSize: 30.0)
                            : null,
                      ),
                      groupValue: answers[currentIndex],
                      value: option,
                      activeColor: Colors.grey,
                      onChanged: (dynamic value) {
                        setState(() {
                          answers[currentIndex] = option;
                        });
                      },
                    )),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget video(BuildContext context, Question question, List<dynamic> options) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: <Widget>[
          Row(
            children: <Widget>[
              CircleAvatar(
                backgroundColor: Colors.white70,
                child: Text("${currentIndex + 1}"),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: Text(
                  question.question!,
                  softWrap: true,
                  style: MediaQuery.of(context).size.width > 800
                      ? questionStyle.copyWith(fontSize: 30.0)
                      : questionStyle,
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: VideoPlayerWidget(videoUrl: question.path!),
          ),

          // Video Player

          const SizedBox(height: 20.0),

          Card(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                ...options.map((option) => RadioListTile(
                      title: Text(
                        '$option',
                        style: MediaQuery.of(context).size.width > 800
                            ? const TextStyle(fontSize: 30.0)
                            : null,
                      ),
                      groupValue: answers[currentIndex],
                      value: option,
                      activeColor: Colors.grey,
                      onChanged: (dynamic value) {
                        setState(() {
                          answers[currentIndex] = option;
                        });
                      },
                    )),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget audio(BuildContext context, Question question, List<dynamic> options) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: <Widget>[
          Row(
            children: <Widget>[
              CircleAvatar(
                backgroundColor: Colors.white70,
                child: Text("${currentIndex + 1}"),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: Text(
                  question.question!,
                  softWrap: true,
                  style: MediaQuery.of(context).size.width > 800
                      ? questionStyle.copyWith(fontSize: 30.0)
                      : questionStyle,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          AudioPlayerWidget(audioUrl: question.path!),
          const SizedBox(height: 20.0),
          Card(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                ...options.map((option) => RadioListTile(
                      title: Text(
                        '$option',
                        style: MediaQuery.of(context).size.width > 800
                            ? const TextStyle(fontSize: 30.0)
                            : null,
                      ),
                      groupValue: answers[currentIndex],
                      value: option,
                      activeColor: Colors.grey,
                      onChanged: (dynamic value) {
                        setState(() {
                          answers[currentIndex] = option;
                        });
                      },
                    )),
              ],
            ),
          ),
        ],
      ),
    );
  }
 */
  void nextSubmit() {
    if (answers[currentIndex] == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text("You must select an answer to continue."),
      ));
      return;
    }
    if (currentIndex < (widget.questions.length - 1)) {
      setState(() {
        currentIndex++;
      });
    } else {
      Navigator.of(context).pushReplacement(MaterialPageRoute(
          builder: (_) =>
              QuizFinishedPage(questions: widget.questions, answers: answers)));
    }
  }

  void onTimerExpired() {
    Navigator.of(context).pushReplacement(MaterialPageRoute(
        builder: (_) =>
            QuizFinishedPage(questions: widget.questions, answers: answers)));
  }

  Future<bool> onWillPop() async {
    final resp = await showDialog<bool>(
        context: context,
        builder: (_) {
          return AlertDialog(
            content: const Text(
                "Are you sure you want to quit the quiz? All your progress will be lost."),
            title: const Text("Warning!"),
            actions: <Widget>[
              TextButton(
                child: Text(
                  "Yes",
                  style: TextStyle(color: primaryColor),
                ),
                onPressed: () {
                  Navigator.pop(context, true);
                },
              ),
              TextButton(
                child: Text("No", style: TextStyle(color: primaryColor)),
                onPressed: () {
                  Navigator.pop(context, false);
                },
              ),
            ],
          );
        });
    return resp ?? false;
  }
}
