import 'dart:async';

import 'package:flutter/material.dart';
import 'package:local_education_app/config/routes/router.dart';
import 'package:local_education_app/config/routes/routes.dart';
import 'package:local_education_app/constants/api_constant.dart';
import 'package:local_education_app/models/course/course.dart';
import 'package:local_education_app/models/lesson/lesson.dart';
import 'package:local_education_app/provider/auth_provider.dart';
import 'package:local_education_app/provider/course_provider.dart';
import 'package:local_education_app/provider/lesson_provider.dart';
import 'package:local_education_app/provider/progress_provider.dart';
import 'package:provider/provider.dart';

class LessonScreen extends StatefulWidget {
  const LessonScreen({
    super.key,
    required this.courseId,
    required this.courseSlug,
  });
  final String courseSlug;
  final String courseId;
  @override
  State<LessonScreen> createState() => _LessonScreenState();
}

class _LessonScreenState extends State<LessonScreen> {
  bool _showLoadingIndicator = true;
  Course? currentCourse;
  final Completer<void> _completer = Completer<void>();
  late ProgressProvider _progressProvider;
  @override
  void dispose() {
    _completer.complete();
    super.dispose();
  }

  @override
  void initState() {
    _progressProvider = Provider.of<ProgressProvider>(context, listen: false);
    _getCourse();
    _loadData();
    super.initState();
  }

  _getCourse() async {
    currentCourse = await Provider.of<CourseProvider>(context, listen: false)
        .courseGetSlug(widget.courseSlug);
  }

  _getProvider() async {
    final progressProv = Provider.of<ProgressProvider>(context, listen: false);
    final lessonProv = Provider.of<LessonProvider>(context, listen: false);
    await lessonProv.lessonGetList(widget.courseSlug);
    await progressProv.getProgressCompletionPercentage(widget.courseId);
  }

  _loadData() async {
    final lessonProv = Provider.of<LessonProvider>(context, listen: false);
    await _getProvider();
    if (!mounted) return;
    if (lessonProv.lessonList == null || lessonProv.lessonList!.isEmpty) {
      Future.delayed(const Duration(seconds: 3), () {
        if (!_completer.isCompleted) {
          setState(() {
            _showLoadingIndicator = false;
          });
        }
      });
    } else {
      if (!_completer.isCompleted) {
        setState(() {
          _showLoadingIndicator = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final lessonProv = Provider.of<LessonProvider>(context);
    final authProv = Provider.of<AuthProvider>(context);
    final progressProv = Provider.of<ProgressProvider>(context);
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/bgTienDo.png'),
            fit: BoxFit.cover,
          ),
        ),
        child: _showLoadingIndicator
            ? const Center(
                child: CircularProgressIndicator(
                  color: Color(0xffFFebcd),
                ),
              )
            : (lessonProv.lessonList == null || lessonProv.lessonList!.isEmpty)
                ? const Center(
                    child: Text(
                      "Không tìm thấy bài học nào",
                      style: TextStyle(color: Color(0xFFFFEBCD)),
                    ),
                  )
                : CustomScrollView(
                    slivers: [
                      SliverAppBar(
                        backgroundColor: const Color(0xFF0B260D),
                        pinned: true,
                        floating: true,
                        leading: IconButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          icon: const Icon(
                            Icons.arrow_back_ios_new_rounded,
                            color: Color(0xffffebcd),
                          ),
                        ),
                        expandedHeight: 160,
                        flexibleSpace: FlexibleSpaceBar(
                          title: Text(
                            currentCourse != null
                                ? currentCourse!.title
                                : "Lesson",
                            style: const TextStyle(color: Color(0xFFFFEBCD)),
                          ),
                          background: Container(
                            height: 160,
                            decoration: BoxDecoration(
                              image: DecorationImage(
                                fit: BoxFit.fill,
                                image: NetworkImage(
                                    "${ApiEndpoint.domain}/${currentCourse!.thumbnailPath}"),
                                colorFilter: const ColorFilter.mode(
                                  Colors.black45,
                                  BlendMode.darken,
                                ),
                              ),
                            ),
                            // child: Image.network(
                            //   "${ApiEndpoint.domain}/${currentCourse!.thumbnailPath}",
                            //   fit: BoxFit.fill,
                            // ),
                          ),
                        ),
                      ),
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Column(
                            children: [
                              ExpansionTile(
                                // collapsedBackgroundColor:
                                //     const Color(0xFF0B260D).withOpacity(0.4),
                                // backgroundColor: const Color(0xFF0B260D),
                                collapsedBackgroundColor: Colors.transparent,
                                backgroundColor:
                                    const Color(0xff0b260d).withOpacity(0.4),
                                title: const Text(
                                  "MÔ TẢ KHÓA HỌC",
                                  style: TextStyle(
                                    color: Color(0xffffebcd),
                                  ),
                                ),
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.all(8.0),
                                    child: Text(
                                      currentCourse != null
                                          ? currentCourse!.description
                                          : "",
                                      style: const TextStyle(
                                          color: Color(0xFFFFEBCD)),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(
                                height: 8,
                              ),
                              const Text(
                                "Tiến độ hoàn thành",
                                style: TextStyle(color: Color(0xFFFFEBCD)),
                              ),
                              Text(
                                "${progressProv.currentCourseProgress?.completed ?? 0} %",
                                style:
                                    const TextStyle(color: Color(0xFFFFEBCD)),
                              ),
                              LinearProgressIndicator(
                                color: const Color(0xffffebcd),
                                backgroundColor: Colors.transparent,
                                minHeight: 5,
                                value:
                                    progressProv.currentCourseProgress == null
                                        ? 0
                                        : progressProv.currentCourseProgress!
                                                .completed /
                                            100,
                              ),
                              Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.orange,
                                        foregroundColor:
                                            const Color(0xffffebcd),
                                        shape: const RoundedRectangleBorder(
                                            borderRadius: BorderRadius.all(
                                                Radius.circular(10)))),
                                    onPressed: () async {
                                      final result = await authProv
                                          .enrollCourse(widget.courseId);
                                      debugPrint("${result?.isSuccess}");
                                      if (result != null &&
                                          result.isSuccess &&
                                          context.mounted) {
                                        Navigator.pushNamed(
                                                context, RouteName.slideScreen,
                                                arguments: SlideArgument(
                                                    courseSlug:
                                                        widget.courseSlug))
                                            .then((value) => setState(() {}));
                                      }
                                    },
                                    child: const Text("Bắt đầu học")),
                              )
                            ],
                          ),
                        ),
                      ),
                      SliverList(
                        delegate: SliverChildBuilderDelegate(
                          childCount: lessonProv.lessonList!.length,
                          (BuildContext context, int index) {
                            final Lesson lesson = lessonProv.lessonList![index];
                            const domain = ApiEndpoint.domain;
                            return ExpansionTile(
                              collapsedBackgroundColor:
                                  const Color(0xFF0B260D).withOpacity(0.4),
                              backgroundColor: const Color(0xFF0B260D),
                              title: Text(
                                lesson.title,
                                style: const TextStyle(
                                  color: Color(0xffffebcd),
                                ),
                              ),
                              children: lesson.slides
                                  .map((slide) => ListTile(
                                        title: Text(
                                          slide.title,
                                          style: const TextStyle(
                                            color: Color(0xffffebcd),
                                          ),
                                        ),
                                      ))
                                  .toList(),
                            );
                            // return InkWell(
                            //   onTap: () {
                            //     Navigator.pushNamed(
                            //       context,
                            //       RouteName.slideScreen,
                            //       arguments: SlideArgument(lessonId: lesson.id),
                            //     );
                            //   },
                            //   child: Container(
                            //     margin: const EdgeInsets.all(8),
                            //     padding: const EdgeInsets.all(16.0),
                            //     decoration: const BoxDecoration(
                            //       color: Color.fromARGB(255, 163, 163, 163),
                            //       borderRadius:
                            //           BorderRadius.all(Radius.circular(20)),
                            //     ),
                            //     child: Row(
                            //       children: [
                            //         Container(
                            //           width: 50,
                            //           height: 50,
                            //           decoration: BoxDecoration(
                            //             borderRadius:
                            //                 BorderRadius.circular(100),
                            //             image: DecorationImage(
                            //               fit: BoxFit.cover,
                            //               image: NetworkImage(
                            //                   "$domain/${lesson.thumbnailPath}"),
                            //             ),
                            //           ),
                            //         ),
                            //         const SizedBox(
                            //           width: 16,
                            //         ),
                            //         Expanded(
                            //           child: Text(
                            //             lesson.title,
                            //             style: const TextStyle(
                            //               color: Color(0xFFFFEBCD),
                            //             ),
                            //           ),
                            //         ),
                            //       ],
                            //     ),
                            //   ),
                            // );
                          },
                        ),
                      )
                    ],
                  ),
      ),
    );
  }
}
