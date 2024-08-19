import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:local_education_app/config/routes/router.dart';
import 'package:local_education_app/config/routes/routes.dart';
import 'package:local_education_app/constants/api_constant.dart';
import 'package:local_education_app/provider/tour_provider.dart';
import 'package:provider/provider.dart';

class TourListScreen extends StatefulWidget {
  const TourListScreen({super.key});

  @override
  State<TourListScreen> createState() => _TourListScreenState();
}

class _TourListScreenState extends State<TourListScreen> {
  bool _showLoadingIndicator = true;
  @override
  void initState() {
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitDown,
      DeviceOrientation.portraitUp,
    ]);
    _loadData();
    super.initState();
  }

  _loadData() {
    final tourProv = Provider.of<TourProvider>(context, listen: false);
    tourProv.tourGetList().then((value) {
      if (tourProv.tourList == null || tourProv.tourList!.isEmpty) {
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
    final tourProv = Provider.of<TourProvider>(context);
    final tourList = tourProv.tourList;
    return Scaffold(
      body: _showLoadingIndicator
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : (tourList == null || tourList.isEmpty)
              ? const Center(child: Text("Hiện tại không có tour nào"))
              : ListView.builder(
                  itemCount: tourList.length,
                  itemBuilder: (context, index) {
                    final currentTour = tourList[index];
                    return Card(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10)),
                      elevation: 4,
                      child: Column(
                        children: [
                          ClipRRect(
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(10),
                              topRight: Radius.circular(10),
                            ),
                            child: Image.network(
                              "${ApiEndpoint.domain}/${currentTour.urlPreview}",
                              height: 150,
                              width: MediaQuery.of(context).size.width,
                              fit: BoxFit.fill,
                            ),
                          ),
                          ListTile(
                            title: Text(
                              currentTour.title,
                              style: const TextStyle(fontSize: 20),
                            ),
                            trailing: Text("${currentTour.viewCount} lượt xem"),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(15.0),
                            child: TextButton(
                              onPressed: () {
                                Navigator.pushNamed(
                                  context,
                                  RouteName.tourScreen,
                                  arguments: TourArgument(
                                      tourSlug: currentTour.urlSlug),
                                );
                              },
                              style: TextButton.styleFrom(
                                  backgroundColor: Colors.green,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  minimumSize: Size(
                                      MediaQuery.of(context).size.width, 56)),
                              child: const Text(
                                'Tham gia tour',
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          )
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}
