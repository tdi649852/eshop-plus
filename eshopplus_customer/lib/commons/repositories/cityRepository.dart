import 'package:eshop_plus/core/constants/hiveConstants.dart';
import 'package:hive/hive.dart';

class CityRepository {
  final Box _settingsBox = Hive.box(settingsBoxKey);

  String? getSelectedCityCode() {
    return _settingsBox.get(selectedCityCodeKey) as String?;
  }

  Future<void> setSelectedCityCode(String code) async {
    await _settingsBox.put(selectedCityCodeKey, code);
  }
}

