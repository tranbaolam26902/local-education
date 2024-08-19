import 'package:flutter/material.dart';
import 'package:local_education_app/api/tour_api.dart';
import 'package:local_education_app/models/tour/atlas/tour_atlas.dart';
import 'package:local_education_app/models/tour/tour.dart';
import 'package:local_education_app/models/tour/tour_detail.dart';

class TourProvider with ChangeNotifier {
  List<Tour>? _tourList;
  TourDetail? _tourDetail;
  Atlas? _atlas;

  void setTourList(List<Tour> list) {
    _tourList = list;
    notifyListeners();
  }

  void setTourDetail(TourDetail? detail) {
    _tourDetail = detail;
    notifyListeners();
  }

  void setAtlas(Atlas atlas) {
    _atlas = atlas;
    notifyListeners();
  }

  List<Tour>? get tourList => _tourList;
  TourDetail? get tourDetail => _tourDetail;
  Atlas? get atlas => _atlas;

  Future<int> tourGetList({String keyword = ''}) async {
    try {
      final response = await getTours(keyword: keyword);
      if (response['statusCode'] == 200) {
        final result = response['result'];
        final items = result['items'];
        // debugPrint(items.toString());
        _tourList = items?.map<Tour>((e) {
              return Tour.fromMap(e);
            }).toList() ??
            [];

        notifyListeners();
        return 200;
      } else {
        return 300;
      }
    } catch (e, stack) {
      debugPrint("There is some error while getting Tour List: $e");
      debugPrintStack(stackTrace: stack);
      return 400;
    }
  }

  void clearTourList() {
    _tourList = [];
    notifyListeners();
  }

  void getCurrentAtlas() {
    if (_tourDetail != null) {
      _atlas = tourDetail!.atlas;
      notifyListeners();
    }
  }

  Future<int> tourGetTourBySlug(String slug) async {
    try {
      final response = await getTourBySlug(slug);
      if (response['statusCode'] == 200) {
        final result = response['result'];
        _tourDetail = TourDetail.fromMap(result);
        notifyListeners();
        return 200;
      } else {
        return 500;
      }
    } catch (error, stack) {
      debugPrint("There is some error while getting Tour Detail: $error");
      debugPrintStack(stackTrace: stack);
      return 400;
    }
  }
}
