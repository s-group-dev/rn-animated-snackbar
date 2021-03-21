import React from 'react';
import {Button, View, StyleSheet, SafeAreaView} from 'react-native';
import Snackbar from 'rn-animated-snackbar';

const App = () => {
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Button
          title={visible ? 'Hide' : 'Show'}
          onPress={onToggleSnackBar}
          style={styles.buttonStyle}
        />
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          text={'Hello World'}
          action={{
            label: 'Hide',
            onPress: () => {
              setVisible(true);
            },
          }}
          duration={Snackbar.LENGTH_MEDIUM}
          containerStyle={styles.snackbarContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snackbarContainer: {
    backgroundColor: '#484848',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default App;
