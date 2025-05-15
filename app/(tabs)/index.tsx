import { fetchPlayers } from '@/api/Football';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

type Player = {
  id: string;
  playerName: string;
  YoB: number;
  MinutesPlayed: number;
  position: string;
  isCaptain: boolean;
  image: string;
  team: string;
  PassingAccuracy: number;
};

type PlayerDetailRouteParams = {
  id: string;
};

type RootStackParamList = {
  PlayerDetail: PlayerDetailRouteParams;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'PlayerDetail'>;

const FAVORITES_KEY = 'favoritePlayers';

const saveFavorites = async (favorites: string[]) => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

const loadFavorites = async (): Promise<string[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

export default function HomeScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const getPlayers = async () => {
      try {
        const data = await fetchPlayers();
        setPlayers(data);
      } catch (error) {
        console.error('Failed to fetch players:', error);
      }
    };

    const getFavorites = async () => {
      const loadedFavorites = await loadFavorites();
      setFavorites(loadedFavorites);
    };

    getPlayers();
    getFavorites();
  }, []);

  const toggleFavorite = async (playerId: string) => {
    const updatedFavorites = favorites.includes(playerId)
      ? favorites.filter((id) => id !== playerId)
      : [...favorites, playerId];

    const validPlayers = updatedFavorites.filter((id) => players.some((player) => player.id === id));
    setFavorites(validPlayers);
    await saveFavorites(validPlayers);
  };

  const handlePlayerPress = (playerId: string) => {
    navigation.navigate('PlayerDetail', { id: playerId });
  };

  const filteredPlayers = selectedTeam
    ? players.filter((player) => player.team === selectedTeam).sort((a, b) => b.id.localeCompare(a.id))
    : players.sort((a, b) => b.id.localeCompare(a.id));

  return (
    <View>
      <Text style={styles.header}>Football Players</Text>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(!isDropdownVisible)}
        >
          <Text style={styles.dropdownButtonText}>
            {selectedTeam || 'Select Team'}
          </Text>
        </TouchableOpacity>

        {isDropdownVisible && (
          <View style={styles.dropdownContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                setSelectedTeam('');
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownItem}>All Teams</Text>
            </TouchableWithoutFeedback>
            {[...new Set(players.map((player) => player.team))].map((team) => (
              <TouchableWithoutFeedback
                key={team}
                onPress={() => {
                  setSelectedTeam(team);
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.dropdownItem}>{team}</Text>
              </TouchableWithoutFeedback>
            ))}
          </View>
        )}
      </View>

      <ScrollView>
        {filteredPlayers.map((player) => (
          <View key={player.id} style={styles.playerCard}>
            <TouchableOpacity onPress={() => handlePlayerPress(player.id)}>
              <Image
                source={{ uri: player.image }}
                style={styles.playerImage}
              />
            </TouchableOpacity>
            <View style={styles.playerInfo}>
              <View style={styles.playerNameContainer}>
                <Text
                  style={styles.playerName}
                  onPress={() => handlePlayerPress(player.id)}
                >
                  {player.playerName}
                </Text>
                <TouchableOpacity onPress={() => toggleFavorite(player.id)}>
                  <FontAwesome
                    name={favorites.includes(player.id) ? 'heart' : 'heart-o'}
                    size={24}
                    color={favorites.includes(player.id) ? 'red' : 'gray'}
                  />
                </TouchableOpacity>
              </View>
              <Text>Position: {player.position}</Text>
              <Text>Team: {player.team}</Text>
              <Text>Year of Birth: {player.YoB}</Text>
              <Text>Captain: {player.isCaptain ? '✔️' : '❌'}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  playerCard: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  playerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  playerNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    marginTop: 70,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
