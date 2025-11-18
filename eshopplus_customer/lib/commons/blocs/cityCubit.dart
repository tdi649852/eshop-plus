import 'package:bloc/bloc.dart';
import 'package:eshop_plus/commons/models/appCity.dart';
import 'package:eshop_plus/commons/repositories/cityRepository.dart';
import 'package:meta/meta.dart';

part 'cityState.dart';

class CityCubit extends Cubit<CityState> {
  final CityRepository _cityRepository;

  CityCubit(this._cityRepository)
      : super(CityState(cities: defaultAppCities, selectedCity: defaultAppCities.first)) {
    _loadInitialCity();
  }

  void _loadInitialCity() {
    final savedCode = _cityRepository.getSelectedCityCode();
    if (savedCode == null) {
      emit(state.copyWith(selectedCity: defaultAppCities.first));
      return;
    }
    final savedCity = state.cities.firstWhere(
      (city) => city.code == savedCode,
      orElse: () => defaultAppCities.first,
    );
    emit(state.copyWith(selectedCity: savedCity));
  }

  void selectCity(AppCity city) {
    _cityRepository.setSelectedCityCode(city.code);
    emit(state.copyWith(selectedCity: city));
  }

  AppCity getSelectedCity() => state.selectedCity;

  int getSelectedCityStoreId() => state.selectedCity.storeId;

  List<AppCity> getCities() => List<AppCity>.from(state.cities);
}

