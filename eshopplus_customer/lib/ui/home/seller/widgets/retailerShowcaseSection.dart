import 'dart:math';

import 'package:eshop_plus/commons/blocs/cityCubit.dart';
import 'package:eshop_plus/commons/seller/blocs/sellersCubit.dart';
import 'package:eshop_plus/commons/seller/models/seller.dart';
import 'package:eshop_plus/commons/widgets/customCircularProgressIndicator.dart';
import 'package:eshop_plus/commons/widgets/customImageWidget.dart';
import 'package:eshop_plus/core/constants/themeConstants.dart';
import 'package:eshop_plus/core/routes/routes.dart';
import 'package:eshop_plus/core/theme/colors.dart';
import 'package:eshop_plus/ui/home/widgets/buildHeader.dart';
import 'package:eshop_plus/utils/designConfig.dart';
import 'package:eshop_plus/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class RetailerShowcaseSection extends StatelessWidget {
  const RetailerShowcaseSection({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<SellersCubit, SellersState>(
      builder: (context, state) {
        if (state is SellersFetchInProgress) {
          return Padding(
            padding: const EdgeInsets.symmetric(
              vertical: appContentHorizontalPadding,
            ),
            child: Center(
              child: CustomCircularProgressIndicator(
                indicatorColor: Theme.of(context).colorScheme.primary,
              ),
            ),
          );
        }

        if (state is SellersFetchSuccess && state.sellers.isNotEmpty) {
          final selectedCityName =
              context.read<CityCubit>().getSelectedCity().name;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsetsDirectional.only(
                  top: appContentHorizontalPadding,
                ),
                child: BuildHeader(
                  title: '$selectedCityName retailers',
                  subtitle: 'Discover stores delivering in your city',
                  showSeeAllButton: false,
                  onTap: () {},
                ),
              ),
              DesignConfig.defaultHeightSizedBox,
              SizedBox(
                height: 170,
                child: ListView.separated(
                  padding: const EdgeInsetsDirectional.symmetric(
                    horizontal: appContentHorizontalPadding,
                  ),
                  scrollDirection: Axis.horizontal,
                  itemBuilder: (context, index) {
                    final seller = state.sellers[index];
                    return _RetailerCard(seller: seller);
                  },
                  separatorBuilder: (context, index) =>
                      DesignConfig.defaultWidthSizedBox,
                  itemCount: min(state.sellers.length, 10),
                ),
              ),
            ],
          );
        }

        return const SizedBox.shrink();
      },
    );
  }
}

class _RetailerCard extends StatelessWidget {
  final Seller seller;
  const _RetailerCard({required this.seller});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Utils.navigateToScreen(
        context,
        Routes.sellerDetailScreen,
        arguments: {'seller': seller},
      ),
      child: Container(
        width: 180,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.primaryContainer,
          borderRadius: BorderRadius.circular(borderRadius),
          boxShadow: const [
            BoxShadow(
              color: Color(0x14212121),
              blurRadius: 16,
              offset: Offset(0, 4),
              spreadRadius: 0,
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CustomImageWidget(
              url: seller.storeLogo ?? '',
              height: 70,
              width: double.maxFinite,
              borderRadius: 12,
              boxFit: BoxFit.cover,
            ),
            const SizedBox(height: 10),
            Text(
              seller.storeName ?? '',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 6),
            Expanded(
              child: Text(
                seller.storeDescription ?? '',
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context)
                          .colorScheme
                          .secondary
                          .withValues(alpha: 0.7),
                    ),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.star_rounded,
                  size: 16,
                  color: Theme.of(context).colorScheme.secondary,
                ),
                const SizedBox(width: 4),
                Text(
                  seller.rating?.toStringAsFixed(1) ?? '0.0',
                  style: Theme.of(context).textTheme.labelMedium,
                ),
                const Spacer(),
                Text(
                  '${seller.totalProducts ?? 0} items',
                  style: Theme.of(context).textTheme.labelSmall,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

