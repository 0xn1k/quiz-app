import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { analyticsAPI } from '../api/analytics';

export default function AnalyticsScreen() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await analyticsAPI.getCategoryStats();
      setStats(data.stats);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Performance Analytics</Text>
      {stats.map((stat, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.category}>{stat.category}</Text>
          <Text style={styles.stat}>Accuracy: {stat.accuracy}%</Text>
          <Text style={styles.stat}>Tests: {stat.totalTests}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10 },
  category: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  stat: { fontSize: 14, color: '#666' },
});
