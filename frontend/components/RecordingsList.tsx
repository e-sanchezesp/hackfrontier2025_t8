import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Play, Pause, Share, Trash2, Volume2 } from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface Recording {
  id: string;
  uri: string;
  name: string;
  duration?: number;
  date: Date;
}

interface RecordingsListProps {
  recordings: Recording[];
  onDeleteRecording: (id: string) => void;
}

export function RecordingsList({ recordings, onDeleteRecording }: RecordingsListProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playRecording = async (recording: Recording) => {
    try {
      if (playingId === recording.id) {
        // Stop current recording
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
        }
        setPlayingId(null);
      } else {
        // Stop any currently playing recording
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }

        // Play new recording
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: recording.uri },
          { shouldPlay: true }
        );
        
        setSound(newSound);
        setPlayingId(recording.id);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setPlayingId(null);
          }
        });
      }
    } catch (error) {
      console.error('Failed to play recording', error);
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const shareRecording = async (recording: Recording) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(recording.uri);
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Failed to share recording', error);
      Alert.alert('Error', 'Failed to share recording');
    }
  };

  const deleteRecording = async (recording: Recording) => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Stop playing if this recording is currently playing
              if (playingId === recording.id) {
                if (sound) {
                  await sound.stopAsync();
                  await sound.unloadAsync();
                  setSound(null);
                }
                setPlayingId(null);
              }

              // Delete the file
              await FileSystem.deleteAsync(recording.uri);
              onDeleteRecording(recording.id);
            } catch (error) {
              console.error('Failed to delete recording', error);
              Alert.alert('Error', 'Failed to delete recording');
            }
          },
        },
      ]
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (recordings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Volume2 size={48} color="#9CA3AF" />
        <Text style={styles.emptyText}>No recordings yet</Text>
        <Text style={styles.emptySubtext}>Your recordings will appear here</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {recordings.map((recording) => (
        <View key={recording.id} style={styles.recordingItem}>
          <View style={styles.recordingInfo}>
            <Text style={styles.recordingName}>{recording.name}</Text>
            <Text style={styles.recordingDate}>{formatDate(recording.date)}</Text>
            {recording.duration && (
              <Text style={styles.recordingDuration}>
                {formatDuration(recording.duration)}
              </Text>
            )}
          </View>
          
          <View style={styles.recordingActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.playButton]}
              onPress={() => playRecording(recording)}
            >
              {playingId === recording.id ? (
                <Pause size={20} color="#FFFFFF" />
              ) : (
                <Play size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={() => shareRecording(recording)}
            >
              <Share size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => deleteRecording(recording)}
            >
              <Trash2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recordingDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  recordingDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  recordingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#059669',
  },
  shareButton: {
    backgroundColor: '#2563EB',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
}); 