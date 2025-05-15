import { fetchPlayerById } from '@/api/Football';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type PlayerDetailRouteParams = {
  id: string;
};

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

function PlayerDetail() {
  const route = useRoute();
  const { id } = route.params as PlayerDetailRouteParams;
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const getPlayer = async () => {
      try {
        const data = await fetchPlayerById(id);
        setPlayer(data);
      } catch (error) {
        console.error('Failed to fetch player details:', error);
      }
    };

    getPlayer();
  }, [id]);

  if (!player) {
    return (
      <View style={styles.container}>
        <Text>Loading player details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: player.image }} style={styles.playerImage} />
      <Text style={styles.playerName}>{player.playerName}</Text>
      <Text>Position: {player.position}</Text>
      <Text>Team: {player.team}</Text>
      <Text>Passing Accuracy: {player.PassingAccuracy}</Text>
      <Text>Minutes Played: {player.MinutesPlayed}</Text>
      <Text>Year of Birth: {player.YoB}</Text>
      <Text>Captain: {player.isCaptain ? '✔️' : '❌'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  playerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default PlayerDetail;
