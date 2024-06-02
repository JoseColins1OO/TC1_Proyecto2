import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Redirect, useRouter } from 'expo-router';


const Index = () => {
    const router = useRouter();

    return (
       //<Redirect href="/(tabs)/home"></Redirect>
       <Redirect href="/(validation)/login"></Redirect>
    )
}

export default Index;

const styles = StyleSheet.create({});
