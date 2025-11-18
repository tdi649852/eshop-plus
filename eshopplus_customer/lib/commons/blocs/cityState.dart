part of 'cityCubit.dart';

@immutable
class CityState {
  final List<AppCity> cities;
  final AppCity selectedCity;

  const CityState({required this.cities, required this.selectedCity});

  CityState copyWith({
    List<AppCity>? cities,
    AppCity? selectedCity,
  }) {
    return CityState(
      cities: cities ?? this.cities,
      selectedCity: selectedCity ?? this.selectedCity,
    );
  }
}

