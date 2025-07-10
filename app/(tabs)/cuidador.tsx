import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, Heart, Brain, Bell, Plus } from 'lucide-react-native';
import { ReportCard } from '@/components/ReportCard';
import { AlarmCard } from '@/components/AlarmCard';
import { Header } from '@/components/Header';

// Datos de ejemplo
const reportes = [
  {
    id: 1,
    fecha: '2024-01-15',
    salud: { estado: 'Bueno', color: '#059669' },
    emociones: { estado: 'Tranquilo', color: '#2563EB' },
    resumen: 'Día estable, medicamentos tomados correctamente',
  },
  {
    id: 2,
    fecha: '2024-01-14',
    salud: { estado: 'Regular', color: '#F59E0B' },
    emociones: { estado: 'Ansioso', color: '#F59E0B' },
    resumen: 'Presión arterial ligeramente elevada, expresó preocupación',
  },
  {
    id: 3,
    fecha: '2024-01-13',
    salud: { estado: 'Bueno', color: '#059669' },
    emociones: { estado: 'Feliz', color: '#059669' },
    resumen: 'Excelente día, conversación fluida con familiares',
  },
];

const alarmas = [
  {
    id: 1,
    titulo: 'Medicamento matutino',
    hora: '08:00',
    frecuencia: 'Diario',
    activa: true,
  },
  {
    id: 2,
    titulo: 'Llamada familiar',
    hora: '18:00',
    frecuencia: 'Lunes, Miércoles, Viernes',
    activa: true,
  },
  {
    id: 3,
    titulo: 'Ejercicio suave',
    hora: '15:00',
    frecuencia: 'Diario',
    activa: false,
  },
];

export default function CuidadorScreen() {
  const [selectedTab, setSelectedTab] = useState<'reportes' | 'alarmas'>('reportes');

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Panel de Cuidador" />
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'reportes' && styles.activeTab]}
          onPress={() => setSelectedTab('reportes')}
        >
          <Calendar size={20} color={selectedTab === 'reportes' ? '#2563EB' : '#6B7280'} />
          <Text style={[styles.tabText, selectedTab === 'reportes' && styles.activeTabText]}>
            Reportes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'alarmas' && styles.activeTab]}
          onPress={() => setSelectedTab('alarmas')}
        >
          <Bell size={20} color={selectedTab === 'alarmas' ? '#2563EB' : '#6B7280'} />
          <Text style={[styles.tabText, selectedTab === 'alarmas' && styles.activeTabText]}>
            Alarmas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'reportes' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reportes Diarios</Text>
            {reportes.map((reporte) => (
              <ReportCard key={reporte.id} reporte={reporte} />
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recordatorios</Text>
              <TouchableOpacity style={styles.addButton}>
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            {alarmas.map((alarma) => (
              <AlarmCard key={alarma.id} alarma={alarma} />
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