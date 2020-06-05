import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as location from 'expo-location';

import styles from './styles';
import api from '../../services/api';

interface Item {  
  id: number,
  name: string,
  image_url: string
}

interface Point {
  id: number,
  image: string,
  name: string,
  latitude: number,
  longitude: number,
  
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setpoints] = useState<Point[]>([]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigation = useNavigation();
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

  useEffect(() => {
    api.get('/items').then(response => {
      setItems(response.data)
      
    })
  }, []);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await location.requestPermissionsAsync();

      if(status!=='granted') {
        Alert.alert('Oooops....', 'Precisamos de sua permissão')
        return;
    
      }
      const Location = await location.getCurrentPositionAsync();

      const { latitude, longitude } = Location.coords;

      setInitialPosition([latitude, longitude]);
    }

    loadPosition();
  }, [])

  useEffect(() => {
    api.get('points', {
      params: {
        city: 'Itaubal',
        uf: 'AP',
        items: [
          1
        ]
      }
    }).then(response => {
      setpoints(response.data);
    })
  }, []);

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item===id);

    if(alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      
      setSelectedItems(filteredItems)
    
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('/details', { id })
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          { initialPosition[0] !== 0 && (
            <MapView 
            style={styles.map} 
            showsCompass={false}
            initialRegion={{
              latitude: initialPosition[0],
              longitude: initialPosition[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}
          >
            {points.map(point => (
              <Marker 
                key={String(point.id)}
                onPress={()=>handleNavigateToDetail(point.id)}
                style={styles.mapMarker}
                coordinate={{ 
                  latitude: point.latitude, 
                  longitude: point.longitude 
                }}
              >
              <View style={styles.mapMarkerContainer}>
                <Image style={styles.mapMarkerImage} source={{ uri: point.image }} />
                <Text style={styles.mapMarkerTitle}>{point.name}</Text>
              </View>
            </Marker>
            ))}
          </MapView>
          ) }
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]} 
              onPress={()=>handleSelectedItem(item.id)}
              activeOpacity={0.7}  
            >
            <SvgUri width={42} height={42} uri={item.image_url} />
            <Text style={styles.itemTitle}>
              {item.name}
            </Text>
          </TouchableOpacity>
          ))}
          
        </ScrollView>
      </View>
    </>
  );
};

export default Points;