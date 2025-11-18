import 'package:eshopplus_seller/commons/models/product.dart';
import 'package:eshopplus_seller/commons/models/productVariant.dart';
import 'package:eshopplus_seller/commons/widgets/customDefaultContainer.dart';
import 'package:eshopplus_seller/commons/widgets/customImageWidget.dart';
import 'package:eshopplus_seller/commons/widgets/customTextContainer.dart';
import 'package:eshopplus_seller/core/constants/appConstants.dart';

import 'package:eshopplus_seller/utils/designConfig.dart';
import 'package:eshopplus_seller/core/localization/labelKeys.dart';
import 'package:flutter/material.dart';

class ComboProductList extends StatelessWidget {
  final Product product;
  const ComboProductList({Key? key, required this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomDefaultContainer(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomTextContainer(
            textKey: comboProductListKey,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          DesignConfig.defaultHeightSizedBox,
          buildProductList(product.productDetails!),
        ],
      ),
    );
  }

  Widget buildProductList(List<Product> products) {
    // Flatten the list so each variant (or product without variants) is a separate item
    final List<_ProductVariantPair> displayItems = [];

    for (final prdct in products) {
      if (prdct.type == variableProductType &&
          prdct.variants?.isNotEmpty == true) {
        final selectedIds = product.productVariantIds
                ?.split(',')
                .map((id) => id.trim())
                .toSet() ??
            {};

        // Add a row for each selected variant in the product
        for (final variant in prdct.variants!) {
          if (selectedIds.contains(variant.id.toString())) {
            displayItems.add(_ProductVariantPair(prdct, variant));
          }
        }
      } else {
        // Simple product — no variants
        displayItems.add(_ProductVariantPair(prdct, null));
      }
    }

    return ListView.separated(
      separatorBuilder: (context, index) => DesignConfig.smallHeightSizedBox,
      itemCount: displayItems.length,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemBuilder: (context, index) {
        final item = displayItems[index];
        return buildProductInfoWidget(context, item.product, item.variant);
      },
    );
  }

  Container buildProductInfoWidget(
      BuildContext context, Product prdct, ProductVariant? selectedVariant) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          borderRadius: BorderRadius.circular(8)),
      child: Row(
        children: <Widget>[
          CustomImageWidget(
            url: prdct.type == variableProductType
                ? selectedVariant != null && selectedVariant.images!.isNotEmpty
                    ? selectedVariant.images!.first
                    : prdct.image ?? ''
                : prdct.image ?? '',
            width: 48,
            height: 48,
            borderRadius: 4,
          ),
          DesignConfig.defaultWidthSizedBox,
          Expanded(
            child: CustomTextContainer(
              textKey:
                  prdct.type == variableProductType && selectedVariant != null
                      ? '${prdct.name}/ ${selectedVariant.variantValues}'
                      : prdct.name!,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }
}

/// Helper class for flattened list
class _ProductVariantPair {
  final Product product;
  final ProductVariant? variant;
  _ProductVariantPair(this.product, this.variant);
}
