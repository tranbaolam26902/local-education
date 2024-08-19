import 'package:flutter/material.dart';

import 'package:local_education_app/models/tour/atlas/tour_atlas.dart';
import 'package:local_education_app/models/tour/scene/tour_scene.dart';

class TourDetail {
  String id;
  String username;
  String title;
  String urlSlug;
  DateTime createdDate;
  int viewCount;
  bool isPublished;
  bool isDeleted;
  String? urlPreview;
  List<TourScene> scenes;
  Atlas? atlas;

  TourDetail({
    required this.id,
    required this.username,
    required this.title,
    required this.urlSlug,
    required this.createdDate,
    required this.viewCount,
    required this.isPublished,
    required this.isDeleted,
    required this.urlPreview,
    required this.scenes,
    required this.atlas,
  });

  factory TourDetail.fromMap(Map<String, dynamic> map) {
    final Atlas? atlas =
        map['atlas'] != null ? Atlas.fromMap(map['atlas']) : null;
    debugPrint(atlas.toString());
    final List<dynamic> sceneData = map['scenes'] ?? [];
    final List<TourScene> scenes = sceneData.map((e) {
      return TourScene.fromMap(e);
    }).toList();
    return TourDetail(
      id: map['id'],
      username: map['username'],
      title: map['title'],
      urlSlug: map['urlSlug'],
      createdDate: DateTime.parse(map["createdDate"]),
      viewCount: map['viewCount'],
      isPublished: map['isPublished'],
      isDeleted: map['isDeleted'],
      urlPreview: map['urlPreview'],
      scenes: scenes,
      atlas: atlas,
    );
  }

  @override
  String toString() {
    return 'TourDetail(id: $id, username: $username, title: $title, urlSlug: $urlSlug, createdDate: $createdDate, viewCount: $viewCount, isPublished: $isPublished, isDeleted: $isDeleted, urlPreview: $urlPreview, scenes: $scenes, atlas: $atlas)';
  }
}
