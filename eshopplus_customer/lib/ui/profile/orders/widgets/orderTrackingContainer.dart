import 'package:eshop_plus/commons/widgets/customTextContainer.dart';
import 'package:eshop_plus/core/constants/themeConstants.dart';
import 'package:eshop_plus/core/localization/labelKeys.dart';
import 'package:eshop_plus/ui/profile/orders/models/order.dart';
import 'package:eshop_plus/utils/designConfig.dart';
import 'package:eshop_plus/utils/utils.dart';
import 'package:flutter/material.dart';

class OrderTrackingContainer extends StatelessWidget {
  final Order order;
  const OrderTrackingContainer({Key? key, required this.order})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Check if any tracking data is available
    bool hasTrackingData = (order.trackingId != null && order.trackingId!.isNotEmpty) ||
                          (order.courierAgency != null && order.courierAgency!.isNotEmpty) ||
                          (order.url != null && order.url!.isNotEmpty);
    
    return hasTrackingData ? buildOrderTracking(context, order) : const SizedBox.shrink();
  }

  buildOrderTracking(BuildContext context, Order order) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsetsDirectional.symmetric(
              vertical: appContentVerticalSpace),
          color: Theme.of(context).colorScheme.primaryContainer,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Padding(
                padding: const EdgeInsetsDirectional.symmetric(
                    horizontal: appContentHorizontalPadding),
                child: CustomTextContainer(
                  textKey: orderTrackingKey,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
              const Divider(
                height: 12,
                thickness: 0.5,
              ),
              if (order.trackingId != null && order.trackingId!.isNotEmpty)
                buildTrackingRow(context, trackingIdKey, order.trackingId!),
              if (order.courierAgency != null && order.courierAgency!.isNotEmpty)
                buildTrackingRow(context, courierAgencyKey, order.courierAgency!),
              if (order.url != null && order.url!.isNotEmpty)
                buildTrackingRow(
                  context,
                  trackingUrlKey,
                  order.url!,
                  onTap: () {
                    Utils.launchURL(order.url!);
                  },
                ),
            ],
          ),
        ),
        DesignConfig.smallHeightSizedBox,
      ],
    );
  }

  buildTrackingRow(BuildContext context, String title, String value,
      {VoidCallback? onTap}) {
    return Padding(
      padding: const EdgeInsetsDirectional.symmetric(
          horizontal: appContentHorizontalPadding, vertical: 8),
      child: Row(
        children: [
          CustomTextContainer(
            textKey: title,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(width: 4),
          const Text(':'),
          const SizedBox(width: 4),
          Expanded(
            child: GestureDetector(
              onTap: onTap,
              child: CustomTextContainer(
                textKey: value,
                maxLines: 2,
                style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                  color: Theme.of(context)
                      .colorScheme
                      .secondary
                      .withValues(alpha: 0.8),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
