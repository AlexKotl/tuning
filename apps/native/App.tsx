import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, ScrollView, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { useTuning, tuningVariants } from '@tuning/shared';
import { useAudioManager } from './hooks/useAudioManager';

type TuningState = {
  string6: string;
  string5: string;
  string4: string;
  string3: string;
  string2: string;
  string1: string;
};

export default function App() {
  const { tuning: defaultTuning } = useTuning();

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [activeString, setActiveString] = useState<string>('');
  const [tuning, setTuning] = useState<TuningState>(defaultTuning);

  const { 
    soundStatus, 
    playStringNote, 
    continuousPlayMode, 
    playingStrings, 
    setContinuousPlayMode,
    stopAllContinuousPlay
  } = useAudioManager(tuning);

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

  const applyTuningVariant = (tuningVariant: string[]) => {
    const newTuning: TuningState = {
      string6: tuningVariant[0],
      string5: tuningVariant[1],
      string4: tuningVariant[2],
      string3: tuningVariant[3],
      string2: tuningVariant[4],
      string1: tuningVariant[5],
    };
    
    setTuning(newTuning);
  };

  useEffect(() => {
    if (!continuousPlayMode) {
      stopAllContinuousPlay();
    }
  }, [continuousPlayMode]);

  return (
    <View style={styles.container}>
      <View style={styles.variantsContainer}>
        <Text style={styles.variantsTitle}>Tuning Presets</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.variantsScrollContent}
        >
          {tuningVariants.map((variant: { title?: string; tuning: string[] }, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.variantButton}
              onPress={() => applyTuningVariant(variant.tuning)}
            >
              <Text style={styles.variantTitle}>{variant.title}</Text>
              <Text style={styles.variantTuning}>{variant.tuning.join(' ')}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.tuningContainer}>
        {Object.entries(tuning).map(([stringKey, selectedNote], index) => (
          <View key={stringKey} style={styles.stringContainer}>
            <TouchableOpacity 
              style={[
                styles.musicIcon,
                !soundStatus[stringKey] && styles.musicIconDisabled,
                playingStrings[stringKey] && styles.musicIconPlaying
              ]}
              onPress={() => playStringNote(stringKey)}
              disabled={!soundStatus[stringKey]}
            >
              <Text style={styles.musicIconText}>
                {soundStatus[stringKey] ? (playingStrings[stringKey] ? '🔊' : '♪') : '⋯'}
              </Text>
            </TouchableOpacity>
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
      
      <View style={styles.continuousPlayContainer}>
        <Text style={styles.continuousPlayLabel}>Continuous play</Text>
        <Switch
          value={continuousPlayMode}
          onValueChange={setContinuousPlayMode}
          trackColor={{ false: '#444', true: '#FFA500' }}
          thumbColor={continuousPlayMode ? '#fff' : '#ccc'}
        />
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tuningContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 0,
  },
  stringContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  musicIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  musicIconText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  noteDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ffffff',
  },
  pickerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  pickerButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  pickerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#cccccc',
  },
  stringLabel: {
    fontSize: 12,
    color: '#cccccc',
    marginTop: 5,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
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
    color: '#ffffff',
  },
  noteOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  noteOptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ffffff',
  },
  variantsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  variantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  variantsScrollContent: {
    paddingHorizontal: 0,
  },
  variantButton: {
    backgroundColor: '#2d2d2d',
    padding: 12,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  variantTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  variantTuning: {
    fontSize: 11,
    color: '#cccccc',
    textAlign: 'center',
  },
  musicIconDisabled: {
    backgroundColor: '#555',
  },
  musicIconPlaying: {
    backgroundColor: '#FFF500',
  },
  continuousPlayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 20,
  },
  continuousPlayLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
