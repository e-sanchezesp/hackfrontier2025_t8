import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, Heart, Brain, Bell, Plus, LogOut, Users } from 'lucide-react-native';
import { ReportCard } from '@/components/ReportCard';
import { AlarmCard } from '@/components/AlarmCard';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

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
  const { logout, user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Users size={32} color="#FFFFFF" strokeWidth={2} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Caregiver Panel</Text>
            <Text style={styles.subtitle}>Elder Care</Text>
            {user && (
              <Text style={styles.userName}>Hello, {user.name}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <LogOut size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'reports' && styles.activeTab]}
            onPress={() => setSelectedTab('reports')}
          >
            <Calendar size={20} color={selectedTab === 'reports' ? '#667eea' : '#FFFFFF'} />
            <Text style={[styles.tabText, selectedTab === 'reports' && styles.activeTabText]}>
              Reports
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'alarms' && styles.activeTab]}
            onPress={() => setSelectedTab('alarms')}
          >
            <Bell size={20} color={selectedTab === 'alarms' ? '#667eea' : '#FFFFFF'} />
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
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  activeTabText: {
    color: '#667eea',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});