import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome as Fa } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';

import api from '../../services/api';

import styles from './styles';

interface Params {
  id: number,
}

interface Data {
  point: {
    image: string,
    name: string,
    email: string,
    whatsapp: string,
    city: string,
    uf: string
  },
  items: {
    title: string
  }[];
}

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;
  const id = routeParams.id;
  const [data, setData] = useState<Data>({} as Data);

  useEffect(() => {
    api.get(`/points/${id}`).then(response => {
      setData(response.data);
    })
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  return (
    <>
      <View style={styles.container}> 
          <TouchableOpacity onPress={handleNavigateBack}>
            <Icon name="arrow-left" size={20} color="#34cb79" />
          </TouchableOpacity>

          <Image style={styles.pointImage} source={{ uri: data.point.image }}/>

          <Text style={styles.pointName}>{data.point.name}</Text>
          
            <Text style={styles.pointItems}>{data.items.map(item => item.title).join(', ')}</Text>
         

          <View style={styles.address}>
            <Text style={styles.addressTitle}>Endereço</Text>
            <Text style={styles.addressContent}>Rio do Sul, SC</Text>
          </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={()=>{}}>
          <Fa name="whatsapp" size={20} color="#fff" />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={()=>{}}>
          <Icon name="mail" size={20} color="#fff" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </>
  );
};

export default Detail;