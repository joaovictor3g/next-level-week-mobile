import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const AppStack = createStackNavigator();
import Home from './pages/Home'; 
import Points from './pages/Points';
import Detail from './pages/Detail';

const Routes = () => {
    return (
        <NavigationContainer>
            <AppStack.Navigator 
                screenOptions={{ 
                    headerShown: false,
                    cardStyle: {
                        backgroundColor: "#f0f0f5"
                    } 
                }}>
                <AppStack.Screen name="/" component={Home} />
                <AppStack.Screen name="/points" component={Points} />
                <AppStack.Screen name="/details"component={Detail} />
            </AppStack.Navigator>
        </NavigationContainer>
    );
}

export default Routes;