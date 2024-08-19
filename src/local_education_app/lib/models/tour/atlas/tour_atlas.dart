// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:local_education_app/models/tour/atlas/tour_atlas_pin.dart';

class Atlas {
  String id;
  String path;
  bool? isShowOnStatup;
  List<AtlasPin> pins;
  Atlas({
    required this.id,
    required this.path,
    required this.isShowOnStatup,
    required this.pins,
  });
  factory Atlas.fromMap(Map<String, dynamic> json) {
    final List<dynamic> pinDataList = json['pins'] ?? [];
    final List<AtlasPin> pins = pinDataList.map((e) {
      return AtlasPin.fromMap(e);
    }).toList();
    return Atlas(
        id: json['id'],
        path: json['path'],
        isShowOnStatup: json['isShowOnStatup'],
        pins: pins);
  }

  @override
  String toString() {
    return 'Atlas(id: $id, path: $path, isShowOnStatup: $isShowOnStatup, pins: $pins)';
  }
}
