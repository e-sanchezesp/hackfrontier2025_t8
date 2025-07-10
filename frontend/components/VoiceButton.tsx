import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert, Animated } from 'react-native';
import { Mic, MicOff, Play, Pause, Square } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Audio } from 'expo-av';

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onPress: () => void;
  onRecordingComplete?: (recordingUri: string) => void;
}

export function VoiceButton({ 
  isListening, 
  isProcessing, 
  onPress, 
  onRecordingComplete 
}: VoiceButtonProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Wave animation effect
  useEffect(() => {
    if (isListening || recording || (recordingUri && isPlaying)) {
      // Animación de ondas - smooth loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          })
        ])
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
  }, [isListening, recording, recordingUri, isPlaying]);

  const startRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant microphone permissions to record audio.');
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      
      if (uri) {
        setRecordingUri(uri);
        onRecordingComplete?.(uri);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const playRecording = async () => {
    if (!recordingUri) return;

    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: recordingUri });
        setSound(newSound);
        
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
        
        await newSound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Failed to play recording', error);
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const deleteRecording = async () => {
    if (!recordingUri) return;

    try {
      await FileSystem.deleteAsync(recordingUri);
      setRecordingUri(null);
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to delete recording', error);
      Alert.alert('Error', 'Failed to delete recording');
    }
  };

  const shareRecording = async () => {
    if (!recordingUri) return;

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(recordingUri);
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Failed to share recording', error);
      Alert.alert('Error', 'Failed to share recording');
    }
  };

  const handlePress = async () => {
    if (recordingUri) {
      // If we have a recording, play/pause it
      await playRecording();
    } else if (recording) {
      // If we're recording, stop it
      await stopRecording();
    } else {
      // Start recording
      await startRecording();
    }
    onPress();
  };

  const getButtonIcon = () => {
    if (recordingUri) {
      return isPlaying ? <Pause size={32} color="#FFFFFF" /> : <Play size={32} color="#667eea" />;
    }
    if (recording) {
      return <Square size={32} color="#FFFFFF" />;
    }
    return isListening ? <MicOff size={32} color="#FFFFFF" /> : <Mic size={32} color="#667eea" />;
  };

  const getButtonText = () => {
    if (recordingUri) {
      return isPlaying ? 'Pause' : 'Play';
    }
    if (recording) {
      return 'Stop';
    }
    return isListening ? 'Stop Recording' : 'Start Recording';
  };

  return (
    <View style={styles.wrapper}>
      {/* Animated Waves */}
      {(isListening || recording || (recordingUri && isPlaying)) && (
        <View style={styles.wavesWrapper} pointerEvents="none">
          {[0, 1, 2, 3].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.wave,
                {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.4 - index * 0.08],
                  }),
                  transform: [
                    {
                      scale: waveAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 1.3 + index * 0.2],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      )}
      {/* Main recording button */}
      <TouchableOpacity
        style={[
          styles.voiceButton,
          (isListening || recording || recordingUri) && styles.voiceButtonActive,
          isProcessing && styles.voiceButtonProcessing
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {getButtonIcon()}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wavesWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 150,
    height: 150,
    marginLeft: -75,
    marginTop: -75,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  wave: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
  },
  voiceButton: {
    zIndex: 1,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  voiceButtonActive: {
    backgroundColor: '#10B981',
    transform: [{ scale: 1.1 }],
  },
  voiceButtonProcessing: {
    backgroundColor: '#F97316',
  },
});