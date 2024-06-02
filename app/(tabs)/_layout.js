import { Tabs } from "expo-router";
import {FontAwesome} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';

export default function Layout() {
    return (
        <Tabs>
            <Tabs.Screen 
            name="home"
            options={{ 
                tabBarLabel: "Home", 
                tabBarLabelStyle: { color: "#7CB9E8" },
                headerShown:false,
                tabBarIcon:({focused}) =>
                focused? (
                    <FontAwesome name="tasks" size={24} color="#7CB9E8"/>
                ) : (
                    <FontAwesome name="tasks" size={24} color="#7CB9E8"/>
                )
                }} 

            />
            <Tabs.Screen 
            name="usuario"
            options={{ 
                tabBarLabel: "usuario", 
                tabBarLabelStyle: { color: "#7CB9E8" },
                headerShown:false,
                tabBarIcon:({focused}) =>
                focused? (
                    <AntDesign name="user" size={24} color="#7CB9E8"/>
                ) : (
                    <AntDesign name="user" size={24} color="#7CB9E8"/>
                )
                }} 

            />
           
        </Tabs>
    )
}