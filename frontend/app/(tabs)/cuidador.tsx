import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, Heart, Brain, Bell, Plus } from 'lucide-react-native';
import { ReportCard } from '@/components/ReportCard';
import { AlarmCard } from '@/components/AlarmCard';
import { Header } from '@/components/Header';

// Sample data
const reports = [
  {
    id: 1,
    date: '2024-01-15',
    health: { status: 'Good', color: '#059669' },
    emotions: { status: 'Calm', color: '#2563EB' },
    summary: 'Stable day, medications taken correctly',
  },
  {
    id: 2,
    date: '2024-01-14',
    health: { status: 'Regular', color: '#F59E0B' },
    emotions: { status: 'Anxious', color: '#F59E0B' },
    summary: 'Slightly elevated blood pressure, expressed concern',
  },
  {
    id: 3,
    date: '2024-01-13',
    health: { status: 'Good', color: '#059669' },
    emotions: { status: 'Happy', color: '#059669' },
    summary: 'Excellent day, fluid conversation with family',
  },
];

const alarms = [
  {
    id: 1,
    title: 'Morning medication',
    time: '08:00',
    frequency: 'Daily',
    active: true,
  },
  {
    id: 2,
    title: 'Family call',
    time: '18:00',
    frequency: 'Monday, Wednesday, Friday',
    active: true,
  },
  {
    id: 3,
    title: 'Light exercise',
    time: '15:00',
    frequency: 'Daily',
    active: false,
  },
];

export default function CaregiverScreen() {
  const [selectedTab, setSelectedTab] = useState<'reports' | 'alarms'>('reports');

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Caregiver Panel" />
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'reports' && styles.activeTab]}
          onPress={() => setSelectedTab('reports')}
        >
          <Calendar size={20} color={selectedTab === 'reports' ? '#2563EB' : '#6B7280'} />
          <Text style={[styles.tabText, selectedTab === 'reports' && styles.activeTabText]}>
            Reports
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'alarms' && styles.activeTab]}
          onPress={() => setSelectedTab('alarms')}
        >
          <Bell size={20} color={selectedTab === 'alarms' ? '#2563EB' : '#6B7280'} />
          <Text style={[styles.tabText, selectedTab === 'alarms' && styles.activeTabText]}>
            Alarms
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'reports' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Reports</Text>
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reminders</Text>
              <TouchableOpacity style={styles.addButton}>
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            {alarms.map((alarm) => (
              <AlarmCard key={alarm.id} alarm={alarm} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#2563EB',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#2563EB',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});