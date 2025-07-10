import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
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

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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
      return isPlaying ? <Pause size={32} color="#FFFFFF" /> : <Play size={32} color="#FFFFFF" />;
    }
    if (recording) {
      return <Square size={32} color="#FFFFFF" />;
    }
    return isListening ? <MicOff size={32} color="#FFFFFF" /> : <Mic size={32} color="#FFFFFF" />;
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
    <View style={styles.container}>
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

      {/* Recording controls */}
      {recordingUri && (
        <View style={styles.controlsContainer}>
          <Text style={styles.recordingText}>Recording saved</Text>
          <View style={styles.controlButtons}>
            <TouchableOpacity style={styles.controlButton} onPress={playRecording}>
              <Text style={styles.controlButtonText}>
                {isPlaying ? 'Pause' : 'Play'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={shareRecording}>
              <Text style={styles.controlButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.controlButton, styles.deleteButton]} 
              onPress={deleteRecording}
            >
              <Text style={[styles.controlButtonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Background waves when active */}
      {(isListening || recording || (recordingUri && isPlaying)) && (
        <View style={styles.wavesContainer}>
          {[...Array(3)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.wave,
                { animationDelay: `${index * 0.2}s` }
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  voiceButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 2,
  },
  voiceButtonActive: {
    backgroundColor: '#059669',
    transform: [{ scale: 1.1 }],
  },
  voiceButtonProcessing: {
    backgroundColor: '#F59E0B',
  },
  controlsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 12,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
  wavesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  wave: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    opacity: 0,
  },
});