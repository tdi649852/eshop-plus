import 'package:eshop_plus/core/theme/colors.dart';
import 'package:eshop_plus/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

import 'package:shimmer/shimmer.dart';

class CustomImageWidget extends StatelessWidget {
  final double? width;
  final double? height;
  final String url;
  final BoxFit? boxFit;
  final double? borderRadius;
  bool? isCircularImage;
  Widget? child;

  CustomImageWidget({
    super.key,
    this.width,
    this.height,
    required this.url,
    this.boxFit = BoxFit.cover,
    this.borderRadius,
    this.isCircularImage = false,
    this.child,
  });

  String _placeholderUrl({String label = 'Image'}) {
    final double resolvedWidth = (width ?? height ?? 200).clamp(40, 1600);
    final double resolvedHeight =
        (height ?? width ?? 200).clamp(40, 1600); // keep square if missing
    final String text = Uri.encodeComponent(label);
    return 'https://placehold.co/${resolvedWidth.round()}x${resolvedHeight.round()}.png?text=$text';
  }

  bool _isSvg(String path) {
    if (path.isEmpty) return false;
    final uri = Uri.tryParse(path);
    if (uri == null) return false;
    final segments = uri.pathSegments;
    if (segments.isEmpty) return false;
    final lastSegment = segments.last;
    if (!lastSegment.contains('.')) return false;
    return lastSegment.split('.').last.toLowerCase() == 'svg';
  }

  @override
  Widget build(BuildContext context) {
    final BoxFit effectiveBoxFit = boxFit ?? BoxFit.contain;
    final String placeholder =
        _placeholderUrl(label: Uri.tryParse(url)?.pathSegments.last ?? 'Image');
    final String effectiveUrl =
        (url.isEmpty || url.toLowerCase() == 'null') ? placeholder : url;

    try {
      return isCircularImage == true
          ? CircularImageWithShimmer(
              imageUrl: effectiveUrl,
              placeholderUrl: placeholder,
              radius: borderRadius ?? 0,
            )
          : Container(
              width: width,
              height: height,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(borderRadius ?? 0),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(borderRadius ?? 0),
                child: _isSvg(effectiveUrl)
                    ? Utils.getSvgImage(effectiveUrl,
                        height: height, width: width, boxFit: effectiveBoxFit)
                    : CachedNetworkImage(
                        imageUrl: effectiveUrl,
                        fit: effectiveBoxFit,
                        placeholder: (context, url) => _PlaceholderBox(
                          imageUrl: placeholder,
                          width: width,
                          height: height,
                          boxFit: effectiveBoxFit,
                        ),
                        imageBuilder: (context, imageProvider) => Container(
                            width: width,
                            height: height,
                            decoration: BoxDecoration(
                              borderRadius:
                                  BorderRadius.circular(borderRadius ?? 0),
                              image: DecorationImage(
                                fit: effectiveBoxFit,
                                image: imageProvider,
                              ),
                            ),
                            child: child),
                        errorWidget: (context, url, error) {
                          return _PlaceholderBox(
                            imageUrl: placeholder,
                            width: width,
                            height: height,
                            boxFit: effectiveBoxFit,
                          );
                        }),
              ),
            );
    } catch (e) {
      return _PlaceholderBox(
        imageUrl: placeholder,
        width: width,
        height: height,
        boxFit: effectiveBoxFit,
      );
    }
  }
}

class _PlaceholderBox extends StatelessWidget {
  final String imageUrl;
  final double? width;
  final double? height;
  final BoxFit boxFit;

  const _PlaceholderBox(
      {required this.imageUrl,
      required this.width,
      required this.height,
      required this.boxFit});

  @override
  Widget build(BuildContext context) {
    return Image.network(
      imageUrl,
      width: width,
      height: height,
      fit: boxFit,
      errorBuilder: (_, __, ___) => Container(
        width: width,
        height: height,
        alignment: Alignment.center,
        color: greyColor[200],
        child: Icon(
          Icons.image_not_supported_outlined,
          color: Theme.of(context).colorScheme.secondary,
        ),
      ),
    );
  }
}

class CircularImageWithShimmer extends StatelessWidget {
  final String imageUrl;
  final String placeholderUrl;
  final double radius;

  const CircularImageWithShimmer({
    Key? key,
    required this.imageUrl,
    required this.placeholderUrl,
    this.radius = 24.0,
  }) : super(key: key);

  bool _isSvg(String path) {
    final uri = Uri.tryParse(path);
    if (uri == null || uri.pathSegments.isEmpty) return false;
    final last = uri.pathSegments.last;
    if (!last.contains('.')) return false;
    return last.split('.').last.toLowerCase() == 'svg';
  }

  @override
  Widget build(BuildContext context) {
    if (_isSvg(imageUrl)) {
      return Utils.getSvgImage(
        imageUrl,
        width: radius * 2,
        height: radius * 2,
      );
    } else {
      return CachedNetworkImage(
        imageUrl: imageUrl,
        imageBuilder: (context, imageProvider) => CircleAvatar(
          radius: radius,
          backgroundImage: imageProvider,
        ),
        placeholder: (context, url) => CircleAvatar(
          radius: radius,
          backgroundImage: NetworkImage(placeholderUrl),
        ),
        errorWidget: (context, url, error) => CircleAvatar(
          radius: radius,
          backgroundImage: NetworkImage(placeholderUrl),
        ),
      );
    }
  }
}
