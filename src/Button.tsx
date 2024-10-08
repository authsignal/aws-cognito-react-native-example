import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

interface Props {
  children: any;
  theme?: 'primary' | 'secondary';
  onPress: () => Promise<void> | void;
}

export const Button = ({children, theme = 'primary', onPress}: Props) => {
  const [loading, setLoading] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.background,
        theme === 'primary'
          ? styles.backgroundPrimary
          : styles.backgroundSecondary,
      ]}
      disabled={loading}
      onPress={async () => {
        setLoading(true);

        await onPress();

        setLoading(false);
      }}>
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <Text
          style={[
            styles.text,
            theme === 'primary' ? styles.textPrimary : styles.textSecondary,
          ]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  background: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 6,
    elevation: 3,
  },
  backgroundPrimary: {
    backgroundColor: '#525EEA',
  },
  backgroundSecondary: {
    backgroundColor: '#F5FCFF',
    borderColor: '#525EEA',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
    fontWeight: '500',
  },
  textPrimary: {
    color: 'white',
  },
  textSecondary: {
    color: '#525EEA',
  },
});
