import 'package:chewie/chewie.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';
import 'package:local_education_app/config/routes/router.dart';
import 'package:local_education_app/config/routes/routes.dart';
import 'package:local_education_app/constants/api_constant.dart';
import 'package:local_education_app/models/slide/slide.dart';
import 'package:local_education_app/provider/lesson_provider.dart';
import 'package:local_education_app/provider/progress_provider.dart';
import 'package:local_education_app/provider/slide_provider.dart';
import 'package:local_education_app/screens/slide/widgets/test_argument.dart';
import 'package:mime/mime.dart';
import 'package:provider/provider.dart';
import 'package:top_snackbar_flutter/custom_snack_bar.dart';
import 'package:top_snackbar_flutter/top_snack_bar.dart';
import 'package:video_player/video_player.dart';

class SlideScreen extends StatefulWidget {
  const SlideScreen({super.key, required this.courseSlug});
  final String courseSlug;

// p
  @override
  State<SlideScreen> createState() => _SlideScreenState();
}

class _SlideScreenState extends State<SlideScreen> {
  late ChewieController _chewieController;
  final PageController _pageController = PageController(initialPage: 0);
  int currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadData();
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.landscapeLeft,
      DeviceOrientation.landscapeRight,
    ]);
  }

  @override
  void dispose() {
    super.dispose();
  }

  bool _showLoadingIndicator = true;
  _mapData() async {
    final slideProv = Provider.of<SlideProivder>(context);
    final lessonProv = Provider.of<LessonProvider>(context, listen: false);
    List<Slide> mySlides = [];
    final result = await lessonProv.lessonGetList(widget.courseSlug);
    debugPrint("$result");
    if (result == 200) {
      final lessons = lessonProv.lessonList;
      mySlides = await Future.wait(lessons!.expand((lesson) =>
          lesson.slides.map((slide) => slideProv.getSlideById(slide.id))));
      slideProv.setSlideList(mySlides);
    }
  }

  // _loadData() {
  //   final slideProv = Provider.of<SlideProivder>(context, listen: false);

  //   _mapData().then((_) {
  //     if (slideProv.slideList == null || slideProv.slideList!.isEmpty) {
  //       Future.delayed(const Duration(seconds: 3), () {
  //         if (mounted) {
  //           setState(() {
  //             _showLoadingIndicator = false;
  //           });
  //         }
  //       });
  //     } else {
  //       if (mounted) {
  //         setState(() {
  //           _showLoadingIndicator = false;
  //         });
  //       }
  //     }
  //   });
  // }
  Future<void> _loadData() async {
    final slideProv = Provider.of<SlideProivder>(context, listen: false);
    final lessonProv = Provider.of<LessonProvider>(context, listen: false);
    try {
      final result = await lessonProv.lessonGetList(widget.courseSlug);
      debugPrint("$result");

      if (result == 200) {
        final lessons = lessonProv.lessonList;
        if (lessons != null) {
          final mySlides = await Future.wait(lessons.expand((lesson) =>
              lesson.slides.map((slide) => slideProv.getSlideById(slide.id))));
          slideProv.setSlideList(mySlides);
        }
      }
    } catch (error) {
      debugPrint("Error loading data: $error");
    } finally {
      if (mounted) {
        setState(() {
          _showLoadingIndicator = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final slideProv = Provider.of<SlideProivder>(context);
    final progressProv = Provider.of<ProgressProvider>(context);
    const domain = ApiEndpoint.domain;
    return Scaffold(
      backgroundColor: const Color(0xFF0B260D),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B260D),
        leading: IconButton(
          onPressed: () {
            SystemChrome.setPreferredOrientations(
              [
                DeviceOrientation.portraitDown,
                DeviceOrientation.portraitUp,
              ],
            );
            Navigator.pop(context);
          },
          icon: const Icon(
            Icons.arrow_back_ios,
            color: Color(0xFFFFEBCD),
          ),
        ),
      ),
      endDrawer: (slideProv.slideList == null || slideProv.slideList!.isEmpty)
          ? const Drawer(
              child: Text('Getting slide list'),
            )
          : Drawer(
              child: ListView.builder(
                itemCount: slideProv.slideList!.length,
                itemBuilder: (context, index) {
                  final currentSlide = slideProv.slideList![index];
                  return ListTile(
                    onTap: () {
                      _pageController.jumpToPage(index);
                      Navigator.pop(context);
                    },
                    title: Text(currentSlide.title),
                  );
                },
              ),
            ),
      body: _showLoadingIndicator
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : (slideProv.slideList == null || slideProv.slideList!.isEmpty)
              ? const Center(
                  child: Text("Không tìm thấy slide nào"),
                )
              : Column(
                  children: [
                    Expanded(
                      child: PageView.builder(
                        physics: const NeverScrollableScrollPhysics(),
                        controller: _pageController,
                        itemCount: slideProv.slideList!.length,
                        onPageChanged: (int index) {
                          setState(() {
                            currentIndex = index;
                          });
                        },
                        itemBuilder: (context, index) {
                          final currentSlide = slideProv.slideList![index];
                          if (currentSlide.layout == 'text') {
                            return Container(
                              color: const Color(0xFF0B260D), // Màu nền
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.all(32.0),
                                      child: SingleChildScrollView(
                                        child: Column(
                                          children: [
                                            Text(
                                              currentSlide.title,
                                              style: const TextStyle(
                                                fontSize: 30,
                                                fontWeight: FontWeight.w700,
                                                color: Color(0xffffebcd),
                                              ),
                                            ),
                                            HtmlWidget(
                                              currentSlide.content,
                                              textStyle: const TextStyle(
                                                color: Color(
                                                    0xFFFFEBCD), // Màu chữ
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          } else if (currentSlide.layout == 'media') {
                            // if ((currentSlide.urlPath)
                            //         .toString()
                            //         .split('.')
                            //         .last ==
                            //     "png")
                            if (lookupMimeType(currentSlide.urlPath)
                                    .toString()
                                    .split('/')
                                    .first ==
                                'image') {
                              return Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Column(
                                  children: [
                                    Text(
                                      currentSlide.title,
                                      style: const TextStyle(
                                        fontSize: 30,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xffffebcd),
                                      ),
                                    ),
                                    Image(
                                      image: NetworkImage(
                                        "$domain/${currentSlide.urlPath}",
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            } else {
                              VideoPlayerController videoPlayerController =
                                  VideoPlayerController.networkUrl(
                                Uri.parse("$domain/${currentSlide.urlPath}"),
                              );
                              ChewieController chewieController =
                                  ChewieController(
                                videoPlayerController: videoPlayerController,
                                looping: false,
                                aspectRatio: 16 / 9,
                                autoInitialize: true,
                              );
                              return Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Column(
                                  children: [
                                    Text(
                                      currentSlide.title,
                                      style: const TextStyle(
                                        fontSize: 30,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xffffebcd),
                                      ),
                                    ),
                                    Chewie(
                                      controller: chewieController,
                                    ),
                                  ],
                                ),
                              );
                            }
                          } else if (currentSlide.layout == 'full') {
                            if (lookupMimeType(currentSlide.urlPath)
                                    .toString()
                                    .split('/')
                                    .first ==
                                'image') {
                              return Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(
                                      child: SingleChildScrollView(
                                        child: Column(
                                          children: [
                                            Text(
                                              currentSlide.title,
                                              style: const TextStyle(
                                                fontSize: 30,
                                                fontWeight: FontWeight.w700,
                                                color: Color(0xffffebcd),
                                              ),
                                            ),
                                            HtmlWidget(
                                              currentSlide.content,
                                              textStyle: const TextStyle(
                                                color: Color(
                                                    0xFFFFEBCD), // Màu chữ
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                    const SizedBox(
                                        width:
                                            8), // Khoảng cách giữa hình ảnh và nội dung
                                    Image(
                                      image: NetworkImage(
                                        "$domain/${currentSlide.urlPath}",
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            } else {
                              VideoPlayerController videoPlayerController =
                                  VideoPlayerController.networkUrl(
                                Uri.parse("$domain/${currentSlide.urlPath}"),
                              );
                              ChewieController chewieController =
                                  ChewieController(
                                videoPlayerController: videoPlayerController,
                                looping: false,
                                aspectRatio: 16 / 9,
                                autoInitialize: true,
                              );
                              return Row(
                                children: [
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: Chewie(
                                        controller: chewieController,
                                      ),
                                    ),
                                  ),
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.all(32.0),
                                      child: SingleChildScrollView(
                                        child: Column(
                                          children: [
                                            Text(
                                              currentSlide.title,
                                              style: const TextStyle(
                                                fontSize: 30,
                                                fontWeight: FontWeight.w700,
                                                color: Color(0xffffebcd),
                                              ),
                                            ),
                                            HtmlWidget(
                                              currentSlide.content,
                                              textStyle: const TextStyle(
                                                color: Color(
                                                    0xFFFFEBCD), // Màu chữ
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              );
                            }
                          }
                          return Container(); // Default empty container
                        },
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        IconButton(
                          onPressed: () {
                            if (currentIndex > 0) {
                              _pageController.previousPage(
                                duration: const Duration(milliseconds: 300),
                                curve: Curves.easeInOut,
                              );
                            }
                          },
                          icon: const Icon(
                            Icons.keyboard_double_arrow_left,
                            color: Color(0xffffebcd),
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            final Slide currentSlide =
                                slideProv.slideList![currentIndex];
                            debugPrint(currentSlide.title);
                            Navigator.pushNamed(
                              context,
                              RouteName.examScreen,
                              arguments: ExamArgument(slideId: currentSlide.id),
                            ).then((value) {
                              debugPrint(value.toString());
                            });
                          },
                          icon: const Icon(
                            Icons.checklist,
                            color: Color(0xffffebcd),
                          ),
                        ),
                        IconButton(
                          onPressed: () async {
                            final Slide currentSlide =
                                slideProv.slideList![currentIndex];
                            if (currentSlide.isTest) {
                              Navigator.pushNamed(
                                context,
                                RouteName.examScreen,
                                arguments:
                                    ExamArgument(slideId: currentSlide.id),
                              ).then((value) {
                                TestArgument args = value as TestArgument;
                                progressProv
                                    .postProgressCompleted(
                                        currentSlide.id, args.answers)
                                    .then((value) {
                                  if (!value.isSuccess) {
                                    showTopSnackBar(
                                      Overlay.of(context),
                                      CustomSnackBar.error(
                                          message: value.errors.first),
                                    );
                                  } else {
                                    showTopSnackBar(
                                      Overlay.of(context),
                                      const CustomSnackBar.success(
                                        message: "Đã hoàn thành bài kiểm tra",
                                      ),
                                    );
                                    if (currentIndex <
                                        slideProv.slideList!.length - 1) {
                                      _pageController.nextPage(
                                        duration:
                                            const Duration(milliseconds: 300),
                                        curve: Curves.easeInOut,
                                      );
                                    } else {
                                      SystemChrome.setPreferredOrientations(
                                        [
                                          DeviceOrientation.portraitDown,
                                          DeviceOrientation.portraitUp,
                                        ],
                                      );
                                      Navigator.pop(context);
                                    }
                                  }
                                });
                              });
                            } else {
                              progressProv
                                  .postProgressCompleted(currentSlide.id, []);
                              if (currentIndex <
                                  slideProv.slideList!.length - 1) {
                                _pageController.nextPage(
                                  duration: const Duration(milliseconds: 300),
                                  curve: Curves.easeInOut,
                                );
                              } else {
                                SystemChrome.setPreferredOrientations(
                                  [
                                    DeviceOrientation.portraitDown,
                                    DeviceOrientation.portraitUp,
                                  ],
                                );
                                Navigator.pop(context);
                              }
                            }
                          },
                          icon: const Icon(
                            Icons.keyboard_double_arrow_right,
                            color: Color(0xffffebcd),
                          ),
                        )
                      ],
                    )
                  ],
                ),
    );
  }
}
