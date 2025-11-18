import 'package:eshopplus_seller/core/theme/colors.dart';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_svg/flutter_svg.dart';
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
    this.width,
    this.height,
    required this.url,
    this.boxFit = BoxFit.cover,
    this.borderRadius,
    this.isCircularImage = false,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    bool issvg = url.split('.').last == "svg";
    return isCircularImage == true
        ? CircularImageWithShimmer(
            imageUrl: url,
            radius: borderRadius ?? 0,
            issvg: issvg,
          )
        : Container(
            width: width,
            height: height,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(borderRadius ?? 0),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(borderRadius ?? 0),
              child: issvg
                  ? svgImage(url, height: height, width: width, boxFit: boxFit)
                  : CachedNetworkImage(
                      imageUrl: url,
                      fit: boxFit ?? BoxFit.cover,
                      placeholder: (context, url) => Shimmer.fromColors(
                        baseColor: greyColor[300]!,
                        highlightColor: greyColor[100]!,
                        child: Container(
                          width: width,
                          height: height,
                          color: whiteColor,
                        ),
                      ),
                      imageBuilder: (context, imageProvider) => Container(
                          width: width,
                          height: height,
                          decoration: BoxDecoration(
                            borderRadius:
                                BorderRadius.circular(borderRadius ?? 0),
                            image: DecorationImage(
                              fit: boxFit ?? BoxFit.cover,
                              image: imageProvider,
                            ),
                          ),
                          child: child),
                      errorWidget: (context, url, error) => Icon(
                        Icons.error,
                        color: Theme.of(context).colorScheme.error,
                      ),
                    ),
            ),
          );
  }
}

svgImage(
  String url, {
  BoxFit? boxFit,
  double? width,
  double? height,
}) {
  return SvgPicture.network(
    url,
    height: height,
    width: width,
    fit: boxFit ?? BoxFit.cover,
    placeholderBuilder: (context) => Shimmer.fromColors(
      baseColor: greyColor[300]!,
      highlightColor: greyColor[100]!,
      child: Container(
        width: width,
        height: height,
        color: whiteColor,
      ),
    ),
  );
}

class CircularImageWithShimmer extends StatelessWidget {
  final String imageUrl;
  final double radius;
  final bool issvg;
  const CircularImageWithShimmer(
      {Key? key,
      required this.imageUrl,
      this.radius = 24.0,
      this.issvg = false})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return issvg
        ? ClipRRect(
            borderRadius: BorderRadius.circular(radius),
            child: svgImage(imageUrl),
          )
        : CachedNetworkImage(
            imageUrl: imageUrl,
            imageBuilder: (context, imageProvider) => CircleAvatar(
              radius: radius,
              backgroundImage: imageProvider,
            ),
            placeholder: (context, url) => Shimmer.fromColors(
              baseColor: greyColor[300]!,
              highlightColor: greyColor[100]!,
              child: Container(
                width: radius * 2,
                height: radius * 2,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: greyColor[300],
                ),
              ),
            ),
            errorWidget: (context, url, error) => CircleAvatar(
              radius: radius,
              backgroundColor: greyColor[300],
              child: Icon(
                Icons.error,
                color: redColor,
              ),
            ),
          );
  }
}
