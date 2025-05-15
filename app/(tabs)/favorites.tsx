import { fetchPlayers } from '@/api/Football';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const FAVORITES_KEY = 'favoritePlayers';

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

export default function FavoriteScreen() {
  const [favoritePlayers, setFavoritePlayers] = useState<Player[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (favorites) {
          const favoriteIds = JSON.parse(favorites);
          const allPlayers = await fetchPlayers();
          const favoriteDetails = allPlayers.filter((player: Player) => favoriteIds.includes(player.id));
          setFavoritePlayers(favoriteDetails);
        }
      } catch (error) {
        console.error('Error loading favorite players:', error);
      }
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    const debugFavorites = async () => {
      try {
        const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
        console.log('Current FAVORITES_KEY data:', favorites);
      } catch (error) {
        console.error('Error debugging favorite players:', error);
      }
    };

    debugFavorites();
  }, []);

  return (
    <View>
      <Text style={styles.header}>Favorite Players</Text>

      <ScrollView>
        {favoritePlayers.map((player, index) => {
          if (!player.id) {
            console.warn(`Player at index ${index} is missing an id.`);
          }
          return (
            <View key={player.id || index} style={styles.playerCard}>
              <Image source={{ uri: player.image }} style={styles.playerImage} />
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.playerName}</Text>
                <Text>Position: {player.position}</Text>
                <Text>Year of Birth: {player.YoB}</Text>
                <Text>Captain: {player.isCaptain ? '✔️' : '❌'}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    marginTop: 70,
  },
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
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
