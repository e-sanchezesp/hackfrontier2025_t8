import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface StatusIndicatorProps {
  isActive: boolean;
  type: 'ready' | 'listening' | 'processing';
}

export function StatusIndicator({ isActive, type }: StatusIndicatorProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      // Animación de ondas
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();

      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      waveAnim.setValue(0);
    }

    return () => {
      waveAnim.stopAnimation();
      fadeAnim.stopAnimation();
    };
  }, [isActive]);

  const getIndicatorColor = () => {
    switch (type) {
      case 'listening':
        return '#FFFFFF';
      case 'processing':
        return '#F59E0B';
      default:
        return '#667eea';
    }
  };

  if (!isActive) return null;

  return (
    <View style={styles.container}>
      {/* Ondas animadas */}
      {[0, 1, 2, 3].map((index) => (
        <Animated.View
          key={index}
          style={[
            styles.wave,
            {
              borderColor: getIndicatorColor(),
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.4 - index * 0.08],
              }),
              transform: [
                {
                  scale: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 2.5 + index * 0.5],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
      
      {/* Indicador central */}
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: getIndicatorColor(),
            opacity: fadeAnim,
            transform: [
              {
                scale: waveAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -120,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
  },
  wave: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});