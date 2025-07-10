import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Heart, Brain, ChevronRight } from 'lucide-react-native';

interface Report {
  id: number;
  date: string;
  health: { status: string; color: string };
  emotions: { status: string; color: string };
  summary: string;
}

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.date}>{formatDate(report.date)}</Text>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
      
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <View style={styles.statusIcon}>
            <Heart size={16} color={report.health.color} />
          </View>
          <View>
            <Text style={styles.statusLabel}>Health</Text>
            <Text style={[styles.statusValue, { color: report.health.color }]}>
              {report.health.status}
            </Text>
          </View>
        </View>
        
        <View style={styles.statusItem}>
          <View style={styles.statusIcon}>
            <Brain size={16} color={report.emotions.color} />
          </View>
          <View>
            <Text style={styles.statusLabel}>Emotions</Text>
            <Text style={[styles.statusValue, { color: report.emotions.color }]}>
              {report.emotions.status}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.summary}>{report.summary}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  summary: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
});