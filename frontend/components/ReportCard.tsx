import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Heart, Brain, ChevronRight } from 'lucide-react-native';

interface Reporte {
  id: number;
  fecha: string;
  salud: { estado: string; color: string };
  emociones: { estado: string; color: string };
  resumen: string;
}

interface ReportCardProps {
  reporte: Reporte;
}

export function ReportCard({ reporte }: ReportCardProps) {
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
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
          <Text style={styles.date}>{formatearFecha(reporte.fecha)}</Text>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
      
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <View style={styles.statusIcon}>
            <Heart size={16} color={reporte.salud.color} />
          </View>
          <View>
            <Text style={styles.statusLabel}>Salud</Text>
            <Text style={[styles.statusValue, { color: reporte.salud.color }]}>
              {reporte.salud.estado}
            </Text>
          </View>
        </View>
        
        <View style={styles.statusItem}>
          <View style={styles.statusIcon}>
            <Brain size={16} color={reporte.emociones.color} />
          </View>
          <View>
            <Text style={styles.statusLabel}>Emociones</Text>
            <Text style={[styles.statusValue, { color: reporte.emociones.color }]}>
              {reporte.emociones.estado}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.resumen}>{reporte.resumen}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  resumen: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});