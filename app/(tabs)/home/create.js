import { Alert, Pressable, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';

const Create = () => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [repeatDaily, setRepeatDaily] = useState(false);

  const colors = [
    "#FF5733",
    "#FFD700",
    "#5D76A9",
    "#1877F2",
    "#32CD32",
    "#CCCCFF",
    "#4169E1",
  ];

  async function addHabit() {
    try {
      const habitDetails = {
        title: title,
        color: selectedColor,
        repeatMode: repeatDaily ? "diario" : "semanal",
        reminder: true,
      };

      const response = await axios.post("http://192.168.3.73:3000/habits", habitDetails);
      if (response.status === 200) {
        setTitle("");
        setRepeatDaily(false);
        Alert.alert("Recordatorio agregado exitosamente!!");
      }
      console.log("Recordatorio agregado", response);
    } catch (error) {
      console.log("ERROR agregando el hábito", error);
    }
  }

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 20, marginTop: 10 }}>DAR DE ALTA</Text>

      <Ionicons onPress={() => router.push("/home")} name="arrow-back-circle" size={24} color="black" />

      <Text style={{
        fontSize: 20,
        marginTop: 10,
        alignItems: 'center',
        textAlign: "center",
        fontWeight: "500"
      }}>CREAR NUEVA TAREA O PENDIENTES</Text>

      <TextInput
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={{
          width: "95%",
          marginTop: 15,
          padding: 15,
          borderRadius: 10,
          backgroundColor: "#E1EBEE"
        }}
        placeholder='Agrega tu tarea' />

      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "500" }}>Color</Text>
        <View style={{
          flexDirection: 'row',
          alignItems: "center",
          marginTop: 10
        }}>
          {colors.map((item, index) => (
            <TouchableOpacity
              onPress={() => setSelectedColor(item)}
              key={index}
              activeOpacity={0.8}
              style={{ marginHorizontal: 5 }}
            >
              {selectedColor === item ? (
                <AntDesign name="plussquare" size={35} color={item} />
              ) : (
                <FontAwesome name="square" size={35} color={item} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={{ fontSize: 18, fontWeight: "500" }}>Repetir</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
        <Pressable
          onPress={() => setRepeatDaily(!repeatDaily)}
          style={{
            backgroundColor: repeatDaily ? "#AFDBF5" : "#E0E0E0",
            padding: 10,
            borderRadius: 6,
            flex: 1,
            marginHorizontal: 5
          }}>
          <Text style={{ textAlign: "center" }}>Todos los días</Text>
        </Pressable>
      </View>
      
      <View style={{
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <Text style={{ fontSize: 17, fontWeight: "500" }}>Recordatorio</Text>
        <Text style={{ fontSize: 17, fontWeight: "500", color: "#2774AE" }}>Si, Recuérdame </Text>
      </View>

      <Pressable
        onPress={addHabit}
        style={{
          marginRight: 25,
          backgroundColor: "#00428c",
          padding: 10,
          borderRadius: 8
        }}>
        <Text style={{ textAlign: "center", color: "white", fontWeight: "bold" }}>
          Guardar
        </Text>
      </Pressable>
    </View>
  );
}

export default Create;

const styles = StyleSheet.create({});
