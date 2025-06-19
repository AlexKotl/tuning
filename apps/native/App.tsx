import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useTuning, tuningVariants, stringToNoteId } from '@tuning/shared';

const SOUND_FILE_INDEX_DIFF = 8;

// Static mapping of all available piano sound files
// Only including files that actually exist in the assets directory
const pianoSounds: { [key: number]: any } = {
  // Files 001-064 (continuous)
  1: require('./assets/sounds/piano/piano-ff-001.wav'),
  2: require('./assets/sounds/piano/piano-ff-002.wav'),
  3: require('./assets/sounds/piano/piano-ff-003.wav'),
  4: require('./assets/sounds/piano/piano-ff-004.wav'),
  5: require('./assets/sounds/piano/piano-ff-005.wav'),
  6: require('./assets/sounds/piano/piano-ff-006.wav'),
  7: require('./assets/sounds/piano/piano-ff-007.wav'),
  8: require('./assets/sounds/piano/piano-ff-008.wav'),
  9: require('./assets/sounds/piano/piano-ff-009.wav'),
  10: require('./assets/sounds/piano/piano-ff-010.wav'),
  11: require('./assets/sounds/piano/piano-ff-011.wav'),
  12: require('./assets/sounds/piano/piano-ff-012.wav'),
  13: require('./assets/sounds/piano/piano-ff-013.wav'),
  14: require('./assets/sounds/piano/piano-ff-014.wav'),
  15: require('./assets/sounds/piano/piano-ff-015.wav'),
  16: require('./assets/sounds/piano/piano-ff-016.wav'),
  17: require('./assets/sounds/piano/piano-ff-017.wav'),
  18: require('./assets/sounds/piano/piano-ff-018.wav'),
  19: require('./assets/sounds/piano/piano-ff-019.wav'),
  20: require('./assets/sounds/piano/piano-ff-020.wav'),
  21: require('./assets/sounds/piano/piano-ff-021.wav'),
  22: require('./assets/sounds/piano/piano-ff-022.wav'),
  23: require('./assets/sounds/piano/piano-ff-023.wav'),
  24: require('./assets/sounds/piano/piano-ff-024.wav'),
  25: require('./assets/sounds/piano/piano-ff-025.wav'),
  26: require('./assets/sounds/piano/piano-ff-026.wav'),
  27: require('./assets/sounds/piano/piano-ff-027.wav'),
  28: require('./assets/sounds/piano/piano-ff-028.wav'),
  29: require('./assets/sounds/piano/piano-ff-029.wav'),
  30: require('./assets/sounds/piano/piano-ff-030.wav'),
  31: require('./assets/sounds/piano/piano-ff-031.wav'),
  32: require('./assets/sounds/piano/piano-ff-032.wav'),
  33: require('./assets/sounds/piano/piano-ff-033.wav'),
  34: require('./assets/sounds/piano/piano-ff-034.wav'),
  35: require('./assets/sounds/piano/piano-ff-035.wav'),
  36: require('./assets/sounds/piano/piano-ff-036.wav'),
  37: require('./assets/sounds/piano/piano-ff-037.wav'),
  38: require('./assets/sounds/piano/piano-ff-038.wav'),
  39: require('./assets/sounds/piano/piano-ff-039.wav'),
  40: require('./assets/sounds/piano/piano-ff-040.wav'),
  41: require('./assets/sounds/piano/piano-ff-041.wav'),
  42: require('./assets/sounds/piano/piano-ff-042.wav'),
  43: require('./assets/sounds/piano/piano-ff-043.wav'),
  44: require('./assets/sounds/piano/piano-ff-044.wav'),
  45: require('./assets/sounds/piano/piano-ff-045.wav'),
  46: require('./assets/sounds/piano/piano-ff-046.wav'),
  47: require('./assets/sounds/piano/piano-ff-047.wav'),
  48: require('./assets/sounds/piano/piano-ff-048.wav'),
  49: require('./assets/sounds/piano/piano-ff-049.wav'),
  50: require('./assets/sounds/piano/piano-ff-050.wav'),
  51: require('./assets/sounds/piano/piano-ff-051.wav'),
  52: require('./assets/sounds/piano/piano-ff-052.wav'),
  53: require('./assets/sounds/piano/piano-ff-053.wav'),
  54: require('./assets/sounds/piano/piano-ff-054.wav'),
  55: require('./assets/sounds/piano/piano-ff-055.wav'),
  56: require('./assets/sounds/piano/piano-ff-056.wav'),
  57: require('./assets/sounds/piano/piano-ff-057.wav'),
  58: require('./assets/sounds/piano/piano-ff-058.wav'),
  59: require('./assets/sounds/piano/piano-ff-059.wav'),
  60: require('./assets/sounds/piano/piano-ff-060.wav'),
  61: require('./assets/sounds/piano/piano-ff-061.wav'),
  62: require('./assets/sounds/piano/piano-ff-062.wav'),
  63: require('./assets/sounds/piano/piano-ff-063.wav'),
  64: require('./assets/sounds/piano/piano-ff-064.wav'),
  
  // Files 85-88 (higher octaves)
  85: require('./assets/sounds/piano/piano-ff-085.wav'),
  86: require('./assets/sounds/piano/piano-ff-086.wav'),
  87: require('./assets/sounds/piano/piano-ff-087.wav'),
  88: require('./assets/sounds/piano/piano-ff-088.wav'),
};

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
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use refs to store Sound objects for better performance
  const soundObjectsRef = useRef<{ [key: string]: Audio.Sound }>({});
  const [soundStatus, setSoundStatus] = useState<{ [key: string]: boolean }>({});

  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const stringLabels = ['String 6', 'String 5', 'String 4', 'String 3', 'String 2', 'String 1'];

  useEffect(() => {
    setupAudio();
    return () => {
      // Cleanup sounds when component unmounts
      cleanupSounds();
    };
  }, []);

  useEffect(() => {
    if (isAudioReady) {
      loadSounds();
    }
  }, [tuning, isAudioReady]);

  const setupAudio = async () => {
    try {
      console.log('Setting up audio...');
      
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Audio permission not granted');
        return;
      }

      // Set audio mode with modern configuration
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      setIsAudioReady(true);
      console.log('Audio setup complete');
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const cleanupSounds = async () => {
    try {
      const sounds = Object.values(soundObjectsRef.current);
      await Promise.all(sounds.map(sound => sound?.unloadAsync()));
      soundObjectsRef.current = {};
      setSoundStatus({});
    } catch (error) {
      console.error('Error cleaning up sounds:', error);
    }
  };

  const loadSounds = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('Loading sounds...');
      
      // Cleanup existing sounds first
      await cleanupSounds();
      
      const newSoundObjects: { [key: string]: Audio.Sound } = {};
      const newSoundStatus: { [key: string]: boolean } = {};

      // Load new sounds for each string
      const stringKeys = ['string6', 'string5', 'string4', 'string3', 'string2', 'string1'];
      
      for (let i = 0; i < stringKeys.length; i++) {
        const stringKey = stringKeys[i];
        const note = tuning[stringKey as keyof TuningState];
        const actualIndex = 5 - i;
        const soundFileIndex = stringToNoteId(note, actualIndex) - SOUND_FILE_INDEX_DIFF;
        
        console.log(`Loading sound for ${stringKey}: note=${note}, actualIndex=${actualIndex}, soundFileIndex=${soundFileIndex}`);
        
        // Get the sound file from our mapping
        const soundFile = pianoSounds[soundFileIndex];
        if (soundFile) {
          try {
            // Create sound with modern API
            const { sound } = await Audio.Sound.createAsync(
              soundFile,
              { shouldPlay: false },
              onPlaybackStatusUpdate
            );
            
            newSoundObjects[stringKey] = sound;
            newSoundStatus[stringKey] = true;
            console.log(`Successfully loaded sound for ${stringKey}`);
          } catch (soundError) {
            console.error(`Error creating sound for ${stringKey}:`, soundError);
            newSoundStatus[stringKey] = false;
          }
        } else {
          console.warn(`Sound file not found for index: ${soundFileIndex}`);
          newSoundStatus[stringKey] = false;
        }
      }
      
      soundObjectsRef.current = newSoundObjects;
      setSoundStatus(newSoundStatus);
      console.log('All sounds loaded:', Object.keys(newSoundObjects));
    } catch (error) {
      console.error('Error loading sounds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      console.log('Playback status:', status.positionMillis, status.durationMillis);
    }
  };

  const playStringNote = async (stringKey: string) => {
    try {
      console.log(`Attempting to play sound for ${stringKey}`);
      
      const sound = soundObjectsRef.current[stringKey];
      if (!sound) {
        console.warn(`No sound object found for ${stringKey}`);
        return;
      }

      // Stop all other sounds first
      await stopAllSounds(stringKey);

      // Reset and play the sound
      await sound.setPositionAsync(0);
      await sound.playAsync();
      console.log(`Sound started playing for ${stringKey}`);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const stopAllSounds = async (excludeStringKey?: string) => {
    try {
      const stopPromises = Object.entries(soundObjectsRef.current).map(async ([key, sound]) => {
        if (key !== excludeStringKey && sound) {
          await sound.stopAsync();
        }
      });
      await Promise.all(stopPromises);
    } catch (error) {
      console.error('Error stopping sounds:', error);
    }
  };

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

  return (
    <View style={styles.container}>
      {/* Tuning Variants Buttons */}
      <View style={styles.variantsContainer}>
        <Text style={styles.variantsTitle}>Quick Tuning Presets</Text>
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
                !soundStatus[stringKey] && styles.musicIconDisabled
              ]}
              onPress={() => playStringNote(stringKey)}
              disabled={!soundStatus[stringKey]}
            >
              <Text style={styles.musicIconText}>
                {soundStatus[stringKey] ? '♪' : '⋯'}
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
  variantsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  variantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  variantsScrollContent: {
    paddingHorizontal: 10,
  },
  variantButton: {
    backgroundColor: 'white',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  variantTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  variantTuning: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  musicIconDisabled: {
    backgroundColor: '#ccc',
  },
});
