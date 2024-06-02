import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const initialize = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (token) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.log(error);
            }
        };
        initialize();
    }, []);

    const handleLogin = () => {
        const user = {
            email: email,
            password: password,
        };

        axios.post("http://192.168.3.73:3000/login", user).then((response) => {
            const token = response.data.token;
            AsyncStorage.setItem("authToken", token);
            setIsLoggedIn(true);
            router.replace("/(tabs)/home");
        });
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("authToken");
            setIsLoggedIn(false);
            router.replace("/login");
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoggedIn) {
        return (
            <SafeAreaView style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "gray",
            }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Bienvenido a To do UAEMEX</Text>
                <Pressable 
                    onPress={handleLogout}
                    style={{
                        marginTop: 20,
                        padding: 15,
                        backgroundColor: 'red',
                        borderRadius: 5,
                        alignItems: 'center',
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Cerrar Sesión</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "gray",
            alignItems: "center",
        }}>
            <View style={{ marginTop: 100, alignItems: 'center' }}>
                <Text style={{
                    color: "#141C25",
                    fontSize: 40,
                    fontWeight: "600"
                }}>To do UAEMEX</Text>
                <Text style={{
                    color: "#141C25",
                    fontSize: 20,
                    fontWeight: "600"
                }}>By JoseColins & Stemen0518</Text>
            </View>
            <KeyboardAvoidingView>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{
                        color: "#141C25",
                        fontSize: 18,
                        marginTop: 20,
                        fontWeight: "600"
                    }}>Accede con tu cuenta manito</Text>
                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    backgroundColor: "#E0E0E0",
                    paddingVertical: 5,
                    borderRadius: 5,
                    marginTop: 10,
                }}>
                    <MaterialIcons
                        style={{ marginLeft: 8 }}
                        name="email"
                        size={24}
                        color="black"
                    />
                    <TextInput
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        style={{
                            color: "gray",
                            marginVertical: 5,
                            width: 300,
                            fontSize: email ? 17 : 17
                        }}
                        placeholder="Ingresa tu email" />
                </View>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{
                        color: "#141C25",
                        fontSize: 18,
                        marginTop: 20,
                        fontWeight: "600"
                    }}>Accede con tu contraseña manito</Text>
                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    backgroundColor: "#E0E0E0",
                    paddingVertical: 5,
                    borderRadius: 5,
                    marginTop: 10
                }}>
                    <MaterialCommunityIcons
                        style={{ marginLeft: 8 }}
                        name="form-textbox-password"
                        size={24}
                        color="black"
                    />
                    <TextInput
                        value={password}
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                        style={{
                            color: "gray",
                            marginVertical: 5,
                            width: 300,
                            fontSize: email ? 17 : 17
                        }}
                        placeholder="Ingresa tu contraseña" />
                </View>

                <View style={{
                    flexDirection: "row",
                    marginVertical: 2,
                    alignItems: "center",
                    marginTop: 12,
                    justifyContent: "space-between",
                }}>
                    
                </View>

                <View style={{ marginTop: 25 }} />

                <View style={{ alignItems: 'center' }}>
                    <Pressable 
                    onPress={handleLogin}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: 200,
                        backgroundColor: "#04A04E",
                        padding: 15,
                        borderRadius: 6,
                        justifyContent: 'center'
                    }}>
                        <AntDesign
                            name="login"
                            size={24}
                            color="black"
                            style={{ marginRight: 10 }} // Añadir margen para separar el icono del texto
                        />
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold'
                        }}>Login</Text>
                    </Pressable>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{
                        color: "#141C25",
                        fontSize: 18,
                        fontWeight: "600",
                        marginVertical: 12
                    }}>¿No tienes cuenta?</Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                    <Pressable onPress={() => router.replace("/register")}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: 200,
                            backgroundColor: "#0CAAF3",
                            padding: 15,
                            borderRadius: 6,
                            justifyContent: 'center'
                        }}>
                        <FontAwesome
                            name="registered"
                            size={24}
                            color="black"
                            style={{
                                marginRight: 10
                            }}
                        />
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold'
                        }}>Registrarse</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default Login;

const styles = StyleSheet.create({});
