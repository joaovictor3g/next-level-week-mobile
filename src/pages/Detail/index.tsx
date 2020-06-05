import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome as Fa } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';

import * as MailComposer from 'expo-mail-composer';

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
      console.log(response.data)
      setData(response.data);
    })
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email],
    })
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos.`)
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
            <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
          </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <Fa name="whatsapp" size={20} color="#fff" />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#fff" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </>
  );
};

export default Detail;