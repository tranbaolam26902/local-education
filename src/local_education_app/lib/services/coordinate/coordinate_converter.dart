import 'dart:math';

import 'package:flutter/material.dart';

class CoordinateConverter {
  static double toLatitude(int x, int y, int z) {
    double r = sqrt((x * x) + (y * y) + (z * z));
    double result = 90 - (acos(y / r)) * 180 / pi;
    debugPrint("Latitude: $result");
    return result;
  }

  static double toLongitude(int x, int y, int z) {
    double result = ((270 + atan2(x, z) * 180 / pi) % 360) - 360;
    debugPrint("Longitude: $result");
    return result;
  }
}
