import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { useTuning } from '@tuning/shared';

export default function App() {
  const { tuning: defaultTuning } = useTuning();

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [activeString, setActiveString] = useState<string>('');
  const [tuning, setTuning] = useState(defaultTuning);


  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const stringLabels = ['String 6', 'String 5', 'String 4', 'String 3', 'String 2', 'String 1'];

  const updateTuning = (stringNumber: string, note: string) => {
    setTuning(prev => ({
      ...prev,
      [stringNumber]: note
    }));
    setIsPickerVisible(false);
  };

  const openPicker = (stringKey: string) => {
    setActiveString(stringKey);
    setIsPickerVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tuningContainer}>
        {Object.entries(tuning).map(([stringKey, selectedNote], index) => (
          <View key={stringKey} style={styles.stringContainer}>
            <Text style={styles.musicIcon}>♪</Text>
            <Text style={styles.noteDisplay}>{selectedNote}</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => openPicker(stringKey)}
              >
                <Text style={styles.pickerText}>{selectedNote}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              <Text style={styles.stringLabel}>{stringLabels[index]}</Text>
            </View>
          </View>
        ))}
      </View>

      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setIsPickerVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Note</Text>
            <FlatList
              data={notes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.noteOption}
                  onPress={() => updateTuning(activeString, item)}
                >
                  <Text style={styles.noteOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tuningContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  stringContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  musicIcon: {
    fontSize: 30,
    backgroundColor: '#FFA500',
    color: 'white',
    width: 50,
    height: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  noteDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pickerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  pickerButton: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  stringLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  noteOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noteOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
