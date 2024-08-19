import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:local_education_app/config/routes/router.dart';
import 'package:local_education_app/config/routes/routes.dart';
import 'package:local_education_app/constants/api_constant.dart';
import 'package:local_education_app/models/course/course.dart';
import 'package:local_education_app/provider/course_provider.dart';
import 'package:local_education_app/provider/tour_provider.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _showLoadingIndicator = true;
  @override
  void initState() {
    super.initState();
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);
    _loadData();
  }

  _loadData() {
    final courseProv = Provider.of<CourseProvider>(context, listen: false);
    final tourProv = Provider.of<TourProvider>(context, listen: false);

    Future<int> getData() async {
      final tourRes = await tourProv.tourGetTourBySlug('tour-2');
      final courseRes = await courseProv.courseGetList();
      return (tourRes == 200 && courseRes == 200) ? 200 : 400;
    }

    // tourProv.tourGetList().then((value) {
    //   if (value == 200 && tourProv.tourList != null) {
    //     tourProv.tourGetTourBySlug(tourProv.tourList![0].urlSlug);
    //   }
    // });
    // courseProv.courseGetList().then((_) {

    getData().then((value) {
      if ((courseProv.courseList == null || courseProv.courseList!.isEmpty) &&
          (tourProv.tourDetail == null)) {
        Future.delayed(const Duration(seconds: 3), () {
          if (mounted) {
            setState(() {
              _showLoadingIndicator = false;
            });
          }
        });
      } else {
        if (mounted) {
          setState(() {
            _showLoadingIndicator = false;
          });
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final courseProv = Provider.of<CourseProvider>(context);
    final tourProv = Provider.of<TourProvider>(context);
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Tài liệu giáo dục địa phương"),
        shadowColor: Colors.black,
        elevation: 5,
      ),
      body: _showLoadingIndicator
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : (courseProv.courseList == null || courseProv.courseList!.isEmpty)
              ? const Center(child: Text("Hiện tại không có khóa học nào"))
              : Column(
                  children: [
                    // tourProv.tourDetail != null
                    //     ? InkWell(
                    //         onTap: () {
                    //           debugPrint("navigate to atlas page");
                    //           // Navigator.pushNamed(context, RouteName.tourScreen,
                    //           //     arguments: TourArgument(tourSlug: 'tour-2'));
                    //           Navigator.pushNamed(
                    //               context, RouteName.atlasScreen);
                    //         },
                    //         child: Container(
                    //           height: 250,
                    //           margin: const EdgeInsets.symmetric(
                    //               vertical: 16, horizontal: 8),
                    //           decoration: BoxDecoration(
                    //             borderRadius: BorderRadius.circular(15),
                    //             image: DecorationImage(
                    //               fit: BoxFit.cover,
                    //               image: NetworkImage(
                    //                   "${ApiEndpoint.domain}/${tourProv.tourDetail?.atlas?.path}"),
                    //             ),
                    //           ),
                    //         ),
                    //       )
                    //     : Container(),
                    Expanded(
                      child: GridView.builder(
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                          ),
                          itemCount: courseProv.courseList!.length,
                          itemBuilder: (BuildContext context, int index) {
                            final List<Course> courseList =
                                courseProv.courseList!.reversed.toList();
                            final Course currentCourse = courseList[index];
                            debugPrint(
                                "${ApiEndpoint.domain}/${currentCourse.thumbnailPath}");
                            return InkWell(
                              onTap: () {
                                debugPrint("Pressed");
                                Navigator.pushNamed(
                                  context,
                                  arguments: LessonArgument(
                                    courseSlug: currentCourse.urlSlug,
                                    courseId: currentCourse.id,
                                  ),
                                  RouteName.lessonScreen,
                                );
                              },
                              child: Container(
                                margin: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  border: Border.all(color: Colors.grey),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 8),
                                child: Column(
                                  children: [
                                    Expanded(
                                      child: Container(
                                        decoration: BoxDecoration(
                                          borderRadius:
                                              BorderRadius.circular(20),
                                          border: Border.all(
                                              color: Colors.grey, width: 1),
                                          image: DecorationImage(
                                            fit: BoxFit.fill,
                                            image: NetworkImage(
                                                "${ApiEndpoint.domain}/${currentCourse.thumbnailPath}"),
                                          ),
                                        ),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.only(top: 8.0),
                                      child: Text(
                                        currentCourse.title,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }),
                    ),
                  ],
                ),
    );
  }
}
