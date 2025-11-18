import 'package:eshopplus_seller/commons/blocs/settingsAndLanguagesCubit.dart';
import 'package:eshopplus_seller/core/localization/labelKeys.dart';
import 'package:eshopplus_seller/core/theme/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CustomSearchContainer extends StatelessWidget {
  final TextEditingController? textEditingController;
  final Widget? suffixWidget;
  final Widget? prefixWidget;
  final String? hintTextKey;
  final bool? showVoiceIcon;
  final Function()? onTap;
  final StateSetter? onVoiceIconTap;
  Function(String)? onChanged;
  final bool? readOnly;
  final bool? autoFocus;
  final FocusNode? focusNode;
  final Function(String)? onFieldSubmitted;
  final Function(String)? onSpeechResult;

  CustomSearchContainer(
      {super.key,
      this.textEditingController,
      this.autoFocus,
      this.suffixWidget,
      this.prefixWidget,
      this.hintTextKey,
      this.showVoiceIcon,
      this.onVoiceIconTap,
      this.onTap,
      this.onChanged,
      this.readOnly,
      this.focusNode,
      this.onFieldSubmitted,
      this.onSpeechResult});

  @override
  Widget build(BuildContext context) {
    final color =
        Theme.of(context).colorScheme.secondary.withValues(alpha: 0.46);
    return Padding(
        padding: const EdgeInsetsDirectional.symmetric(vertical: 8),
        child: TextFormField(
          onTap: onTap,
          textDirection: Directionality.of(context),
          controller: textEditingController,
          enabled: true,
          focusNode: focusNode,
          readOnly: readOnly ?? false,
          obscureText: false,
          autofocus: autoFocus ?? false,
          maxLines: 1,
          keyboardType: TextInputType.text,
          textAlignVertical: TextAlignVertical.center,
          style: Theme.of(context).textTheme.bodyMedium!.copyWith(
              color: Theme.of(context)
                  .colorScheme
                  .secondary
                  .withValues(alpha: 0.67)),
          onFieldSubmitted: onFieldSubmitted,
          onChanged: onChanged,
          decoration: InputDecoration(
              fillColor: transparentColor,
              filled: true,
              contentPadding: const EdgeInsetsDirectional.all(15),
              border: InputBorder.none,
              hintText:
                  context.read<SettingsAndLanguagesCubit>().getTranslatedValue(
                        labelKey: hintTextKey ?? searchKey,
                      ),
              hintStyle: Theme.of(context)
                  .textTheme
                  .bodyMedium!
                  .copyWith(color: Theme.of(context).hintColor),
              prefixIconColor: Theme.of(context).hintColor,
              suffixIconColor: Theme.of(context).hintColor,
              prefixIcon: prefixWidget ??
                  Icon(
                    Icons.search,
                    color: color,
                  ),
              suffixIcon: suffixWidget,
              iconColor: borderColor.withValues(alpha: 0.4),
              enabledBorder: OutlineInputBorder(
                  borderSide:
                      BorderSide(color: borderColor.withValues(alpha: 0.4)),
                  borderRadius: BorderRadius.circular(8)),
              errorBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: errorColor),
                  borderRadius: BorderRadius.circular(8)),
              focusedErrorBorder: OutlineInputBorder(
                  borderSide:
                      BorderSide(color: borderColor.withValues(alpha: 0.4)),
                  borderRadius: BorderRadius.circular(8)),
              focusedBorder: OutlineInputBorder(
                  borderSide:
                      BorderSide(color: borderColor.withValues(alpha: 0.4)),
                  borderRadius: BorderRadius.circular(8)),
              disabledBorder: OutlineInputBorder(
                  borderSide:
                      BorderSide(color: secondaryColor.withValues(alpha: 0.67)),
                  borderRadius: BorderRadius.circular(8)),
              errorMaxLines: 2),
        ));
  }
}
