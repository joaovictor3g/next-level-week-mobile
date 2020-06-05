import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Image, Text, Platform } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}


const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cityName, setCityName] = useState<string[]>([]);
  const navigation = useNavigation();

  const [selectedUf, setSelectedUf] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>(''); 

  function handleNavigateToPoints() {
    navigation.navigate('/points', {
      uf: selectedUf, 
      city: selectedCity
    });
  }

  async function getUF() {
    const response =  await axios.get<IBGEUFResponse[]>('http://servicodados.ibge.gov.br/api/v1/localidades/estados')
    
    const ufInitials = response.data.map(uf => uf.sigla);

    setUfs(ufInitials);

  }
  
  useEffect(() => {
    getUF();
  }, []);

  async function getCities() {
    if(!selectedUf)
        return;

    const response = await axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`);

    const cityNames = response.data.map(city => city.nome)

    setCityName(cityNames);
  }

  useEffect(() => {
    getCities();
    
  }, [selectedUf]);

  
  const placeholder = {
    label: `Selecione uma UF`,
    value: null,
    color: 'gray',
  };

  const placeholder2 = {
    label: `Selecione uma cidade`,
    value: null,
    color: 'gray',
  };

  return (
    <>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />

          <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>
        <RNPickerSelect
            style={styles}
            onValueChange={(value) => setSelectedUf(value)}
            items={ufs.map(uf => (
              { label: uf, value: uf, key: uf }
            ))}
            placeholder={placeholder}
            Icon={()=>(
              <Icon 
                name="chevron-down" 
                size={30} 
                color="#FFF" 
                style={{
                  padding: 8,
                  
                }}
              />
            )}
            value={selectedUf}
          
        />

        <RNPickerSelect
            onValueChange={(value) => setSelectedCity(value)}
            items={cityName.map(city => (
              { label: city, value: city, key: city}
            ))}
            style={styles}
            Icon={()=>(
              <Icon name="chevron-down" size={30} color="#FFF" style={{
                padding: 8,
              }}/>
            )}
            placeholder={placeholder2}
            value={selectedCity}
        
        />
        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>

            <Text style={styles.buttonText}>

            </Text>
          </RectButton>
        </View>
    
      </ImageBackground>
    </>
  )
}

export default Home;