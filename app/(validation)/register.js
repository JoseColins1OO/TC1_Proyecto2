import { StyleSheet, Text, View, SafeAreaView, Pressable, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons, MaterialCommunityIcons, AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from "axios";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const router = useRouter();

  const validateEmail = (text) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);
    setEmailValid(emailPattern.test(text));
  };

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password
    };

    axios.post("http://192.168.3.73:3000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert("Registro exitoso", "Se ha realizado un registro exitoso");
        setEmail("");
        setPassword("");
        setName("");
      })
      .catch((error) => {
        Alert.alert("Registro fallido", "Se ha producido un error al realizar el registro");
        console.log("error", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>To do UAEMEX</Text>
        <Text style={styles.subtitle}>By JoseColins & Stemen0518</Text>
      </View>

      <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Registrate manito, para utilizar esta herramienta</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="email" size={24} color="black" style={styles.icon} />
            <TextInput
              value={email}
              onChangeText={validateEmail}
              style={[styles.input, !emailValid && styles.invalidInput]}
              placeholder="Ingresa tu email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {!emailValid && (
            <Text style={styles.errorText}>Por favor, ingresa un correo válido</Text>
          )}

          <Text style={styles.inputLabel}>Como te llamas manito</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person" size={24} color="black" style={styles.icon} />
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Ingresa tu nombre"
            />
          </View>

          <Text style={styles.inputLabel}>Crea tu contraseña manito</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" style={styles.icon} />
            <TextInput
              value={password}
              secureTextEntry={true}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Ingresa tu contraseña"
            />
          </View>

           
          <Pressable onPress={handleRegister} style={styles.registerButton}>
            <FontAwesome name="registered" size={24} color="black" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Registrarse</Text>
          </Pressable>

          <Text style={styles.accountPrompt}>¿Ya tienes cuenta?</Text>

          <Pressable onPress={() => router.replace("/login")} style={styles.loginButton}>
            <AntDesign name="login" size={24} color="black" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Logeate</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
  },
  header: {
    marginTop: 100,
    alignItems: 'center',
  },
  title: {
    color: "#141C25",
    fontSize: 40,
    fontWeight: "600",
  },
  subtitle: {
    color: "#141C25",
    fontSize: 20,
    fontWeight: "600",
  },
  keyboardView: {
    flex: 1,
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  inputLabel: {
    color: "#141C25",
    fontSize: 18,
    marginTop: 20,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    color: "gray",
    marginVertical: 5,
    width: 300,
    fontSize: 17,
  },
  invalidInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    width: '100%',
  },
  optionText: {
    fontSize: 15,
    fontWeight: "500",
  },
  optionLink: {
    fontSize: 15,
    fontWeight: "500",
    color: "#00AEFF",
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
    backgroundColor: "#04A04E",
    padding: 15,
    borderRadius: 6,
    justifyContent: 'center',
    marginTop: 25,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  accountPrompt: {
    color: "#141C25",
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 12,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
    backgroundColor: "#0CAAF3",
    padding: 15,
    borderRadius: 6,
    justifyContent: 'center',
  },
});
