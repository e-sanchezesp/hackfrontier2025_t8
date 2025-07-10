import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { Mic, MicOff, Loader } from 'lucide-react-native';

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onPress: () => void;
}

export function VoiceButton({ isListening, isProcessing, onPress }: VoiceButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isListening) {
      // Animación de pulso para escuchando
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (isProcessing) {
      // Animación de rotación para procesando
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Detener todas las animaciones
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);
    }

    return () => {
      pulseAnim.stopAnimation();
      rotateAnim.stopAnimation();
    };
  }, [isListening, isProcessing]);

  const handlePress = () => {
    // Animación de press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const getButtonColor = () => {
    if (isProcessing) return '#F59E0B';
    if (isListening) return '#059669';
    return '#2563EB';
  };

  const getIconColor = () => '#FFFFFF';

  const renderIcon = () => {
    if (isProcessing) {
      return (
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          <Loader size={64} color={getIconColor()} strokeWidth={3} />
        </Animated.View>
      );
    }
    
    if (isListening) {
      return <MicOff size={64} color={getIconColor()} strokeWidth={3} />;
    }
    
    return <Mic size={64} color={getIconColor()} strokeWidth={3} />;
  };

  return (
    <View style={styles.container}>
      {/* Ondas de fondo cuando está activo */}
      {(isListening || isProcessing) && (
        <>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.wave,
                {
                  borderColor: getButtonColor(),
                  opacity: 0.3 - index * 0.1,
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [1, 1.05],
                        outputRange: [1.2 + index * 0.3, 1.4 + index * 0.3],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </>
      )}
      
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, { backgroundColor: getButtonColor() }]}
          onPress={handlePress}
          activeOpacity={0.8}
          disabled={isProcessing}
        >
          {renderIcon()}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wave: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
  },
  buttonContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});