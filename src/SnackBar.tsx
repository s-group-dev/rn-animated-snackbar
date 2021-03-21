import React, {useRef, useState, useEffect, useLayoutEffect} from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  Text,
  Easing,
  TouchableHighlight,
} from 'react-native';

const easingValues = {
  entry: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 1, 1),
};

const durationValues = {
  entry: 225,
  exit: 195,
};

type SnackbarAction = {
  /**
   *  Text.
   */
  label: string;

  /**
   *  Accessibility Label.
   */
  accessibilityLabel?: string;

  /**
   * Label style.
   */
  labelStyle?: StyleProp<ViewStyle>;

  /**
   * Function called when the user taps the action text.
   */
  onPress(): void;
};

type Props = {
  visible: boolean;
  /**
   * Label and press callback for the action button. It should contain the following properties:
   * - `label` - Label of the action button
   * - `onPress` - Callback that is called when action button is pressed.
   */
  action?: SnackbarAction;
  /**
   * The duration for which the Snackbar is displayed.
   */
  duration?: number;
  /**
   * Callback called when Snackbar is dismissed.
   */
  onDismiss: () => void;
  /**
   * Display message.
   */
  text: string;
  textStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  ref?: React.RefObject<View>;
};

const LENGTH_SHORT = 3000;
const LENGTH_MEDIUM = 5000;
const LENGTH_LONG = 10000;
const LENGTH_INDEFINITE = Number.POSITIVE_INFINITY;

const Snackbar = ({
  visible,
  action,
  duration = LENGTH_SHORT,
  onDismiss,
  text,
  textStyle,
  containerStyle,
  ...rest
}: Props) => {
  const {current: translate} = useRef(new Animated.Value(0.0));
  const [hidden, setHidden] = useState(!visible);
  const hideTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (visible) {
      // show
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
      setHidden(false);
      Animated.timing(translate, {
        toValue: 1,
        duration: durationValues.entry,
        useNativeDriver: true,
        easing: easingValues.entry,
      }).start(({finished}) => {
        if (finished) {
          const isInfinity =
            duration === Number.POSITIVE_INFINITY ||
            duration === Number.NEGATIVE_INFINITY;
          if (finished && !isInfinity) {
            hideTimeout.current = setTimeout(onDismiss, duration);
          }
        }
      });
    } else {
      // hide
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
      Animated.timing(translate, {
        toValue: 0,
        duration: durationValues.exit,
        easing: easingValues.exit,
        useNativeDriver: true,
      }).start(({finished}) => {
        if (finished) {
          setHidden(true);
        }
      });
    }
  }, [visible, duration, translate, onDismiss]);
  if (hidden) {
    return null;
  }
  return (
    <Animated.View
      pointerEvents="box-none"
      accessibilityLiveRegion="polite"
      style={
        [
          styles.container,
          {
            transform: [
              {
                translateY: translate.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
          containerStyle,
        ] as StyleProp<ViewStyle>
      }
      {...rest}>
      <Text
        style={[
          styles.content,
          action ? styles.contentWitAction : styles.contentWithoutAction,
          textStyle,
        ]}>
        {text}
      </Text>
      {action ? (
        <TouchableHighlight
          accessibilityLabel={action.accessibilityLabel}
          onPress={() => {
            action.onPress();
            onDismiss();
          }}
          underlayColor={'#ffffff00'}>
          <Text style={[styles.actionText, action.labelStyle]}>
            {action.label}
          </Text>
        </TouchableHighlight>
      ) : null}
    </Animated.View>
  );
};

Snackbar.LENGTH_SHORT = LENGTH_SHORT;
Snackbar.LENGTH_MEDIUM = LENGTH_MEDIUM;
Snackbar.LENGTH_LONG = LENGTH_LONG;
Snackbar.LENGTH_INDEFINITE = LENGTH_INDEFINITE;

const styles = StyleSheet.create({
  container: {
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 8,
    backgroundColor: '#484848',
  },
  content: {
    marginLeft: 16,
    marginVertical: 14,
    flexWrap: 'wrap',
    flex: 1,
    color: 'white',
  },
  contentWitAction: {
    marginRight: 16,
  },
  contentWithoutAction: {
    marginRight: 0,
  },
  actionText: {
    marginHorizontal: 16,
    marginVertical: 6,
    color: '#79C000', // light green
    fontWeight: 'bold',
  },
});

export default Snackbar;
