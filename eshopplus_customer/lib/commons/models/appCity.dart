class AppCity {
  final String name;
  final String code;
  final int storeId;
  final String imageUrl;
  final String bannerUrl;

  const AppCity({
    required this.name,
    required this.code,
    required this.storeId,
    required this.imageUrl,
    required this.bannerUrl,
  });

  AppCity copyWith({
    String? name,
    String? code,
    int? storeId,
    String? imageUrl,
    String? bannerUrl,
  }) {
    return AppCity(
      name: name ?? this.name,
      code: code ?? this.code,
      storeId: storeId ?? this.storeId,
      imageUrl: imageUrl ?? this.imageUrl,
      bannerUrl: bannerUrl ?? this.bannerUrl,
    );
  }
}

const List<AppCity> defaultAppCities = [
  AppCity(
    name: 'Delhi',
    code: 'delhi',
    storeId: 501,
    imageUrl: 'https://placehold.co/120x120?text=Delhi',
    bannerUrl: 'https://placehold.co/800x320?text=Explore+Delhi',
  ),
  AppCity(
    name: 'Noida',
    code: 'noida',
    storeId: 502,
    imageUrl: 'https://placehold.co/120x120?text=Noida',
    bannerUrl: 'https://placehold.co/800x320?text=Explore+Noida',
  ),
  AppCity(
    name: 'Gurugram',
    code: 'gurugram',
    storeId: 503,
    imageUrl: 'https://placehold.co/120x120?text=Gurugram',
    bannerUrl: 'https://placehold.co/800x320?text=Explore+Gurugram',
  ),
  AppCity(
    name: 'Varanasi',
    code: 'varanasi',
    storeId: 504,
    imageUrl: 'https://placehold.co/120x120?text=Varanasi',
    bannerUrl: 'https://placehold.co/800x320?text=Explore+Varanasi',
  ),
  AppCity(
    name: 'Patna',
    code: 'patna',
    storeId: 505,
    imageUrl: 'https://placehold.co/120x120?text=Patna',
    bannerUrl: 'https://placehold.co/800x320?text=Explore+Patna',
  ),
  AppCity(
    name: 'Mumbai',
    code: 'mumbai',
    storeId: 506,
    imageUrl: 'https://placehold.co/120x120?text=Mumbai',
    bannerUrl: 'https://placehold.co/800x320?text=Explore+Mumbai',
  ),
];

