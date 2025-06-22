import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet,
  Linking 
} from 'react-native';
import { type SongsterrSong } from '@tuning/shared/api';

interface SongsModalProps {
  isVisible: boolean;
  onClose: () => void;
  songs: SongsterrSong[];
  isLoading: boolean;
}

export const SongsModal: React.FC<SongsModalProps> = ({
  isVisible,
  onClose,
  songs,
  isLoading
}) => {
  const openSongInBrowser = async (songId: number) => {
    try {
      const url = `https://www.songsterr.com/a/wsa/SONG-tab-s${songId}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } 
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.songsModalOverlay}>
        <View style={styles.songsModalContent}>
          <View style={styles.songsModalHeader}>
            <Text style={styles.songsModalTitle}>Songs with this tuning</Text>
            <Text style={styles.songsModalCount}>{songs.length} songs</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFA500" />
              <Text style={styles.loadingText}>Loading songs...</Text>
            </View>
          ) : songs.length > 0 ? (
            <View style={styles.songsListContainer}>
              <FlatList
                data={songs}
                keyExtractor={(item) => item.songId.toString()}
                renderItem={({ item }) => 
                    <TouchableOpacity
                      style={styles.songItem}
                      onPress={() => openSongInBrowser(item.songId)}
                    >
                      <View style={styles.songInfo}>
                        <Text style={styles.songArtist}>{item.artist}</Text>
                        <Text style={styles.songTitle}>{item.title}</Text>
                        <Text style={styles.songViews}>
                          {item.tracks[item.defaultTrack]?.views || 0} views
                        </Text>
                      </View>
                      <Text style={styles.songArrow}>→</Text>
                    </TouchableOpacity>
                }
              />
            </View>
          ) : (
            <View style={styles.noSongsContainer}>
              <Text style={styles.noSongsText}>No songs found with this tuning</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  songsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songsModalContent: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
    flex: 1,
    flexDirection: 'column',
  },
  songsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  songsModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  songsModalCount: {
    fontSize: 14,
    color: '#cccccc',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  songsListContainer: {
    flex: 1,
    marginTop: 10,
    minHeight: 200,
  },
  songItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    flexDirection: 'row',
    alignItems: 'center',
  },
  songInfo: {
    flex: 1,
  },
  songArtist: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  songTitle: {
    fontSize: 14,
    color: '#cccccc',
  },
  songViews: {
    fontSize: 12,
    color: '#cccccc',
  },
  songArrow: {
    fontSize: 16,
    color: '#ffffff',
  },
  noSongsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSongsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
}); 