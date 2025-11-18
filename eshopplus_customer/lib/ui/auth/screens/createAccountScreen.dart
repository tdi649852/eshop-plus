import 'package:eshop_plus/commons/widgets/safeAreaWithBottomPadding.dart';
import 'package:eshop_plus/core/api/apiEndPoints.dart';
import 'package:eshop_plus/ui/auth/blocs/generateReferCodeCubit.dart';
import 'package:eshop_plus/ui/auth/blocs/registerUserCubit.dart';
import 'package:eshop_plus/ui/auth/repositories/authRepository.dart';
import 'package:eshop_plus/commons/widgets/customCircularProgressIndicator.dart';
import 'package:eshop_plus/utils/validator.dart';
import 'package:eshop_plus/core/localization/labelKeys.dart';
import 'package:eshop_plus/core/localization/defaultLanguageTranslatedValues.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get/get.dart';


import '../../../utils/utils.dart';
import '../../../commons/widgets/customTextFieldContainer.dart';
import '../../../commons/widgets/showHidePasswordButton.dart';
import '../widgets/loginContainer.dart';

class CreateAccountScreen extends StatefulWidget {
  const CreateAccountScreen(
      {Key? key, required this.mobileNumber, required this.countryCode})
      : super(key: key);
  final String mobileNumber, countryCode;
  static Widget getRouteInstance() {
    Map<String, dynamic> arguments = Get.arguments as Map<String, dynamic>;
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => RegisterUserCubit(),
        ),
        BlocProvider(
          create: (context) => GenerateReferCodeCubit(),
        ),
      ],
      child: CreateAccountScreen(
        mobileNumber: arguments['mobileNumber'],
        countryCode: arguments['countryCode'],
      ),
    );
  }

  @override
  _CreateAccountScreenState createState() => _CreateAccountScreenState();
}

class _CreateAccountScreenState extends State<CreateAccountScreen> {
  Map<String, TextEditingController> controllers = {};
  Map<String, FocusNode> focusNodes = {};
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  bool _hidePassword = true;
  String? _selectedGender;
  final List formFields = [
    usernameKey,
    firstNameKey,
    lastNameKey,
    ageKey,
    emailKey,
    passwordKey,
    referralCodeKey,
    'friendCode'
  ];

  TextEditingController _getController(String key) {
    if (!controllers.containsKey(key)) {
      controllers[key] = TextEditingController();
    }
    return controllers[key]!;
  }

  FocusNode _getFocusNode(String key) {
    if (!focusNodes.containsKey(key)) {
      focusNodes[key] = FocusNode();
    }
    return focusNodes[key]!;
  }
  @override
  void initState() {
    super.initState();
    formFields.forEach((key) {
      controllers[key] = TextEditingController();
      focusNodes[key] = FocusNode();
    });
    Future.delayed(Duration.zero, () {
      context.read<GenerateReferCodeCubit>().getGenerateReferCode();
    });
  }

  @override
  void dispose() {
    controllers.forEach((key, controller) {
      controller.dispose();
    });
    focusNodes.forEach((key, focusNode) {
      focusNode.dispose();
    });
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeAreaWithBottomPadding(
      child: Scaffold(
          body: BlocConsumer<RegisterUserCubit, RegisterUserState>(
        listener: (context, state) {
          if (state is RegisterUserSuccess) {
            Utils.showSnackBar(context: context, message: state.sucsessMessage);
            Future.delayed(Duration(milliseconds: 500), () {
              Utils.popNavigation(context);
              Navigator.of(context).pop();
              Navigator.of(context).pop();
            });
          }
          if (state is RegisterUserFailure) {
            Utils.showSnackBar(context: context, message: state.errorMessage);
          }
        },
        builder: (context, state) {
          return LoginContainer(
            titleText: createNewAccountKey,
            descriptionText: createNewAccountDescKey,
            buttonText: createAccountKey,
            onTapButton: state is RegisterUserProgress ? () {} : callSignupApi,
            content: buildContentWidget(),
            buttonWidget: state is RegisterUserProgress
                ? const CustomCircularProgressIndicator()
                : null,
          );
        },
      )),
    );
  }

  void callSignupApi() async {
    FocusScope.of(context).unfocus();
    if (_formKey.currentState!.validate()) {
      {
        context.read<RegisterUserCubit>().registerUser(params: {
          ApiURL.nameApiKey: _getController(usernameKey).text.trim(),
          ApiURL.firstNameApiKey: _getController(firstNameKey).text.trim(),
          ApiURL.lastNameApiKey: _getController(lastNameKey).text.trim(),
          ApiURL.ageApiKey: _getController(ageKey).text.trim(),
          ApiURL.genderApiKey: _selectedGender ?? '',
          ApiURL.emailApiKey: _getController(emailKey).text.trim(),
          ApiURL.passwordApiKey: _getController(passwordKey).text.trim(),
          ApiURL.referralCodeApiKey: _getController(referralCodeKey).text.trim(),
          ApiURL.friendsCodeApiKey: _getController('friendCode').text.trim(),
          ApiURL.mobileApiKey: widget.mobileNumber,
          ApiURL.countryCodeApiKey: widget.countryCode,
          ApiURL.fcmIdApiKey: await AuthRepository.getFcmToken(),
        });
      }
    }
  }

  Widget buildContentWidget() {
    return BlocListener<GenerateReferCodeCubit, GenerateReferCodeState>(
      listener: (context, state) {
        if (state is GenerateReferCodeFetchSuccess) {
          _getController(referralCodeKey).text = state.referCode;
        }
      },
      child: Form(
        key: _formKey,
        child: Padding(
          padding: const EdgeInsetsDirectional.only(top: 25),
          child: Column(
            children: <Widget>[
              CustomTextFieldContainer(
                hintTextKey: usernameKey,
                textEditingController: _getController(usernameKey),
                focusNode: _getFocusNode(usernameKey),
                textInputAction: TextInputAction.next,
                validator: (v) => Validator.validateName(context, v),
                prefixWidget: const Icon(Icons.account_circle_outlined),
                onFieldSubmitted: (v) {
                  FocusScope.of(context).requestFocus(_getFocusNode(firstNameKey));
                },
              ),
              CustomTextFieldContainer(
                hintTextKey: firstNameKey,
                textEditingController: _getController(firstNameKey),
                focusNode: _getFocusNode(firstNameKey),
                textInputAction: TextInputAction.next,
                validator: (v) => Validator.validateName(context, v),
                prefixWidget: const Icon(Icons.person_outline),
                onFieldSubmitted: (v) {
                  FocusScope.of(context).requestFocus(_getFocusNode(lastNameKey));
                },
              ),
              CustomTextFieldContainer(
                hintTextKey: lastNameKey,
                textEditingController: _getController(lastNameKey),
                focusNode: _getFocusNode(lastNameKey),
                textInputAction: TextInputAction.next,
                validator: (v) => Validator.validateName(context, v),
                prefixWidget: const Icon(Icons.person_outline),
                onFieldSubmitted: (v) {
                  FocusScope.of(context).requestFocus(_getFocusNode(ageKey));
                },
              ),
              CustomTextFieldContainer(
                hintTextKey: ageKey,
                textEditingController: _getController(ageKey),
                focusNode: _getFocusNode(ageKey),
                textInputAction: TextInputAction.next,
                keyboardType: TextInputType.number,
                validator: (v) {
                  if (v == null || v.isEmpty) {
                    return AppLocalizations.get(context, emptyValueErrorMessageKey);
                  }
                  final age = int.tryParse(v);
                  if (age == null || age < 1 || age > 150) {
                    return 'Please enter a valid age';
                  }
                  return null;
                },
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                ],
                prefixWidget: const Icon(Icons.cake_outlined),
                onFieldSubmitted: (v) {
                  FocusScope.of(context).requestFocus(_getFocusNode(emailKey));
                },
              ),
              Padding(
                padding: const EdgeInsetsDirectional.only(bottom: 20),
                child: Container(
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.2),
                    ),
                  ),
                  child: DropdownButtonFormField<String>(
                    value: _selectedGender,
                    decoration: InputDecoration(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 15, vertical: 15),
                      border: InputBorder.none,
                      prefixIcon: Icon(
                        Icons.people_outline,
                        color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                      ),
                      hintText: AppLocalizations.get(context, genderKey),
                      hintStyle: TextStyle(
                        color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                      ),
                    ),
                    dropdownColor: Theme.of(context).colorScheme.surface,
                    validator: (v) {
                      if (v == null || v.isEmpty) {
                        return AppLocalizations.get(context, emptyValueErrorMessageKey);
                      }
                      return null;
                    },
                    items: [
                      DropdownMenuItem(
                        value: 'male',
                        child: Text(AppLocalizations.get(context, maleKey)),
                      ),
                      DropdownMenuItem(
                        value: 'female',
                        child: Text(AppLocalizations.get(context, femaleKey)),
                      ),
                      DropdownMenuItem(
                        value: 'other',
                        child: Text(AppLocalizations.get(context, otherGenderKey)),
                      ),
                    ],
                    onChanged: (value) {
                      setState(() {
                        _selectedGender = value;
                      });
                    },
                  ),
                ),
              ),
              CustomTextFieldContainer(
                hintTextKey: emailKey,
                textEditingController: _getController(emailKey),
                focusNode: _getFocusNode(emailKey),
                textInputAction: TextInputAction.next,
                keyboardType: TextInputType.emailAddress,
                validator: (v) => Validator.validateEmail(context, v),
                prefixWidget: const Icon(Icons.alternate_email_outlined),
                onFieldSubmitted: (v) {
                  FocusScope.of(context).requestFocus(_getFocusNode(passwordKey));
                },
              ),
              CustomTextFieldContainer(
                hintTextKey: passwordKey,
                textEditingController: _getController(passwordKey),
                hideText: _hidePassword,
                focusNode: _getFocusNode(passwordKey),
                textInputAction: TextInputAction.next,
                validator: (v) => Validator.validatePassword(context, v),
                maxLines: 1,
                inputFormatters: [
                  FilteringTextInputFormatter.deny(RegExp('[ ]')),
                ],
                prefixWidget: const Icon(Icons.lock_outline),
                suffixWidget: ShowHidePasswordButton(
                  hidePassword: _hidePassword,
                  onTapButton: () {
                    setState(() {
                      _hidePassword = !_hidePassword;
                    });
                  },
                ),
                onFieldSubmitted: (v) {
                  FocusScope.of(context)
                      .requestFocus(_getFocusNode(referralCodeKey));
                },
              ),
              CustomTextFieldContainer(
                hintTextKey: referralCodeKey,
                textEditingController: _getController('friendCode'),
                focusNode: _getFocusNode(referralCodeKey),
                textInputAction: TextInputAction.done,
                keyboardType: TextInputType.text,
                prefixWidget: const Icon(Icons.card_giftcard_outlined),
                onFieldSubmitted: (v) {
                  _getFocusNode(referralCodeKey).unfocus();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  bool validateAndSave() {
    final form = _formKey.currentState!;
    form.save();
    if (form.validate()) {
      return true;
    }
    return false;
  }
}
