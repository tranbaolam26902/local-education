import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:local_education_app/config/routes/router.dart';
import 'package:local_education_app/config/routes/routes.dart';
import 'package:local_education_app/constants/api_constant.dart';
import 'package:local_education_app/models/tour/atlas/tour_atlas.dart';
import 'package:local_education_app/provider/tour_provider.dart';
import 'package:provider/provider.dart';

class AtlasScreen extends StatefulWidget {
  const AtlasScreen({super.key});

  @override
  State<AtlasScreen> createState() => _AtlasScreenState();
}

class _AtlasScreenState extends State<AtlasScreen> {
  // bool _showLoadingIndicator = true;
  @override
  void initState() {
    super.initState();
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.landscapeLeft,
      DeviceOrientation.landscapeRight,
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      // appBar: AppBar(
      //   backgroundColor: Colors.transparent,
      //   elevation: 0,
      //   leading: IconButton(
      //     icon: const Icon(Icons.arrow_back_ios),
      //     onPressed: () {
      //       SystemChrome.setPreferredOrientations([
      //         DeviceOrientation.portraitDown,
      //         DeviceOrientation.portraitUp,
      //       ]);
      //       Navigator.pop(context);
      //     },
      //   ),
      // ),
      body: Consumer<TourProvider>(
        builder: (context, tourProv, child) {
          if (tourProv.tourDetail?.atlas == null) {
            return const Center(
              child: Text("No atlat found"),
            );
          } else {
            final screenWidth = MediaQuery.of(context).size.width;
            final screenHeight = MediaQuery.of(context).size.height;
            final Atlas? atlas = tourProv.tourDetail?.atlas;
            const String domain = ApiEndpoint.domain;
            final String? tourSlug = tourProv.tourDetail?.urlSlug;
            final pins = atlas?.pins.map(
              (item) {
                debugPrint("${item.top / 100}");
                debugPrint("${item.left / 100}");
                return Positioned(
                  top: (item.top / 100) * screenHeight,
                  left: (item.left / 100) * screenWidth,
                  child: InkWell(
                    onTap: () {
                      debugPrint(item.sceneIndex.toString());
                      Navigator.pushReplacementNamed(
                        context,
                        RouteName.tourScreen,
                        arguments: TourArgument(
                          tourSlug: tourSlug!,
                          startSceneIndex: item.sceneIndex,
                        ),
                      );
                    },
                    child: const Icon(
                      size: 40,
                      Icons.location_pin,
                      color: Colors.red,
                    ),
                  ),
                );
              },
            );
            return Stack(
              children: [
                SizedBox(
                  width: double.infinity,
                  height: double.infinity,
                  child: Image.network(
                    '$domain/${atlas?.path}',
                    fit: BoxFit.fill,
                  ),
                ),
                ...pins!,
                Positioned(
                    child: IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                )),
              ],
            );
          }
        },
      ),
    );
  }
}
