import { useState, useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { stringToNoteId } from '@tuning/shared';

const SOUND_FILE_INDEX_DIFF = 8;
const CONTINUOUS_PLAY_INTERVAL = 2000;

// Static mapping of all available piano sound files
// Only including files that actually exist in the assets directory
const pianoSounds: { [key: number]: any } = {
  // Files 001-064 (continuous)
  1: require('../assets/sounds/piano/piano-ff-001.wav'),
  2: require('../assets/sounds/piano/piano-ff-002.wav'),
  3: require('../assets/sounds/piano/piano-ff-003.wav'),
  4: require('../assets/sounds/piano/piano-ff-004.wav'),
  5: require('../assets/sounds/piano/piano-ff-005.wav'),
  6: require('../assets/sounds/piano/piano-ff-006.wav'),
  7: require('../assets/sounds/piano/piano-ff-007.wav'),
  8: require('../assets/sounds/piano/piano-ff-008.wav'),
  9: require('../assets/sounds/piano/piano-ff-009.wav'),
  10: require('../assets/sounds/piano/piano-ff-010.wav'),
  11: require('../assets/sounds/piano/piano-ff-011.wav'),
  12: require('../assets/sounds/piano/piano-ff-012.wav'),
  13: require('../assets/sounds/piano/piano-ff-013.wav'),
  14: require('../assets/sounds/piano/piano-ff-014.wav'),
  15: require('../assets/sounds/piano/piano-ff-015.wav'),
  16: require('../assets/sounds/piano/piano-ff-016.wav'),
  17: require('../assets/sounds/piano/piano-ff-017.wav'),
  18: require('../assets/sounds/piano/piano-ff-018.wav'),
  19: require('../assets/sounds/piano/piano-ff-019.wav'),
  20: require('../assets/sounds/piano/piano-ff-020.wav'),
  21: require('../assets/sounds/piano/piano-ff-021.wav'),
  22: require('../assets/sounds/piano/piano-ff-022.wav'),
  23: require('../assets/sounds/piano/piano-ff-023.wav'),
  24: require('../assets/sounds/piano/piano-ff-024.wav'),
  25: require('../assets/sounds/piano/piano-ff-025.wav'),
  26: require('../assets/sounds/piano/piano-ff-026.wav'),
  27: require('../assets/sounds/piano/piano-ff-027.wav'),
  28: require('../assets/sounds/piano/piano-ff-028.wav'),
  29: require('../assets/sounds/piano/piano-ff-029.wav'),
  30: require('../assets/sounds/piano/piano-ff-030.wav'),
  31: require('../assets/sounds/piano/piano-ff-031.wav'),
  32: require('../assets/sounds/piano/piano-ff-032.wav'),
  33: require('../assets/sounds/piano/piano-ff-033.wav'),
  34: require('../assets/sounds/piano/piano-ff-034.wav'),
  35: require('../assets/sounds/piano/piano-ff-035.wav'),
  36: require('../assets/sounds/piano/piano-ff-036.wav'),
  37: require('../assets/sounds/piano/piano-ff-037.wav'),
  38: require('../assets/sounds/piano/piano-ff-038.wav'),
  39: require('../assets/sounds/piano/piano-ff-039.wav'),
  40: require('../assets/sounds/piano/piano-ff-040.wav'),
  41: require('../assets/sounds/piano/piano-ff-041.wav'),
  42: require('../assets/sounds/piano/piano-ff-042.wav'),
  43: require('../assets/sounds/piano/piano-ff-043.wav'),
  44: require('../assets/sounds/piano/piano-ff-044.wav'),
  45: require('../assets/sounds/piano/piano-ff-045.wav'),
  46: require('../assets/sounds/piano/piano-ff-046.wav'),
  47: require('../assets/sounds/piano/piano-ff-047.wav'),
  48: require('../assets/sounds/piano/piano-ff-048.wav'),
  49: require('../assets/sounds/piano/piano-ff-049.wav'),
  50: require('../assets/sounds/piano/piano-ff-050.wav'),
  51: require('../assets/sounds/piano/piano-ff-051.wav'),
  52: require('../assets/sounds/piano/piano-ff-052.wav'),
  53: require('../assets/sounds/piano/piano-ff-053.wav'),
  54: require('../assets/sounds/piano/piano-ff-054.wav'),
  55: require('../assets/sounds/piano/piano-ff-055.wav'),
  56: require('../assets/sounds/piano/piano-ff-056.wav'),
  57: require('../assets/sounds/piano/piano-ff-057.wav'),
  58: require('../assets/sounds/piano/piano-ff-058.wav'),
  59: require('../assets/sounds/piano/piano-ff-059.wav'),
  60: require('../assets/sounds/piano/piano-ff-060.wav'),
  61: require('../assets/sounds/piano/piano-ff-061.wav'),
  62: require('../assets/sounds/piano/piano-ff-062.wav'),
  63: require('../assets/sounds/piano/piano-ff-063.wav'),
  64: require('../assets/sounds/piano/piano-ff-064.wav'),
  
  // Files 85-88 (higher octaves)
  85: require('../assets/sounds/piano/piano-ff-085.wav'),
  86: require('../assets/sounds/piano/piano-ff-086.wav'),
  87: require('../assets/sounds/piano/piano-ff-087.wav'),
  88: require('../assets/sounds/piano/piano-ff-088.wav'),
};

type TuningState = {
  string6: string;
  string5: string;
  string4: string;
  string3: string;
  string2: string;
  string1: string;
};

export const useAudioManager = (tuning: TuningState) => {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [soundStatus, setSoundStatus] = useState<{ [key: string]: boolean }>({});
  const [continuousPlayMode, setContinuousPlayMode] = useState(false);
  const [playingStrings, setPlayingStrings] = useState<{ [key: string]: boolean }>({});

  // Use refs to store Sound objects for better performance
  const soundObjectsRef = useRef<{ [key: string]: Audio.Sound }>({});
  const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

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
      // Clear all continuous play intervals
      Object.values(intervalRefs.current).forEach(interval => {
        if (interval) {
          clearInterval(interval);
        }
      });
      intervalRefs.current = {};
      
      const sounds = Object.values(soundObjectsRef.current);
      await Promise.all(sounds.map(sound => sound?.unloadAsync()));
      soundObjectsRef.current = {};
      setSoundStatus({});
      setPlayingStrings({});
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

  const playStringNote = async (stringKey: string) => {
    try {
      console.log(`Attempting to play sound for ${stringKey}`);
      
      const sound = soundObjectsRef.current[stringKey];
      if (!sound) {
        console.warn(`No sound object found for ${stringKey}`);
        return;
      }

      if (continuousPlayMode) {
        // Continuous play mode - toggle on/off
        const isCurrentlyPlaying = playingStrings[stringKey];
        
        if (isCurrentlyPlaying) {
          // Stop continuous play for this string
          const interval = intervalRefs.current[stringKey];
          if (interval) {
            clearInterval(interval);
            delete intervalRefs.current[stringKey];
          }
          await sound.stopAsync();
          setPlayingStrings(prev => ({ ...prev, [stringKey]: false }));
          console.log(`Stopped continuous play for ${stringKey}`);
        } else {
          // Start continuous play for this string - stop all other sounds first
          // Clear all existing intervals first
          Object.entries(intervalRefs.current).forEach(([key, interval]) => {
            if (interval) {
              clearInterval(interval);
            }
          });
          intervalRefs.current = {};
          
          await stopAllSounds();
          await sound.setPositionAsync(0);
          await sound.playAsync();
          
          // Set up interval to replay the sound
          const interval = setInterval(async () => {
            try {
              await sound.setPositionAsync(0);
              await sound.playAsync();
            } catch (error) {
              console.error(`Error in continuous play for ${stringKey}:`, error);
            }
          }, CONTINUOUS_PLAY_INTERVAL); // Replay every 2 seconds
          
          intervalRefs.current[stringKey] = interval;
          setPlayingStrings(prev => ({ [stringKey]: true })); // Reset to only this string
          console.log(`Started continuous play for ${stringKey}`);
        }
      } else {
        await stopAllSounds();
        await sound.setPositionAsync(0);
        await sound.playAsync();
        console.log(`Sound started playing for ${stringKey}`);
      }
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

  const stopAllContinuousPlay = useCallback(async () => {
    try {
      // Clear all continuous play intervals
      Object.entries(intervalRefs.current).forEach(([stringKey, interval]) => {
        if (interval) {
          clearInterval(interval);
        }
      });
      intervalRefs.current = {};
      
      // Stop all sounds
      const sounds = Object.values(soundObjectsRef.current);
      await Promise.all(sounds.map(sound => sound?.stopAsync()));
      
      setPlayingStrings({});
      console.log('Stopped all continuous play');
    } catch (error) {
      console.error('Error stopping continuous play:', error);
    }
  }, []);

  const setContinuousPlayModeCallback = useCallback((value: boolean) => {
    setContinuousPlayMode(value);
  }, []);

  return {
    isAudioReady,
    isLoading,
    soundStatus,
    continuousPlayMode,
    playingStrings,
    playStringNote,
    setContinuousPlayMode: setContinuousPlayModeCallback,
    stopAllContinuousPlay,
    loadSounds,
    cleanupSounds,
  };
}; 