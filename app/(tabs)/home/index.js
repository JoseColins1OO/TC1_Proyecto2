import { Alert, Pressable, StyleSheet, Text, View, Image, ScrollView, TextInput } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';

import { AntDesign, Entypo, Feather, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import axios from "axios";
import { BottomModal, ModalContent, ModalTitle, SlideAnimation, ModalPortal } from 'react-native-modals';

const Index = () => {
    const [option, setOption] = useState("");
    const router = useRouter();
    const [habits, setHabits] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState();
    const [selectedDays, setSelectedDays] = useState([]);
    const [habitId, setHabitId] = useState("");
    const [newTitle, setNewTitle] = useState("");



    const currentDay = new Date().toLocaleDateString("en-US", {
        timeZone: "America/Mexico_City",
        weekday: "short"
    }).slice(0, 3);

    useEffect(() => {
        fetchHabits();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchHabits();
        }, [])
    );

    const fetchHabits = async () => {
        try {
            const response = await axios.get("http://192.168.3.73:3000/habitslist");
            if (Array.isArray(response.data)) {
                setHabits(response.data);
            } else {
                console.log("Expected an array but got:", response.data);
            }
        } catch (error) {
            console.log("error fetching habits", error);
        }
    };

    const handleLongPress = (habitId) => {
        const selectedHabit = habits?.find((habit) => habit._id == habitId);
        setSelectedHabit(selectedHabit);
        setHabitId(habitId);
        setModalVisible(true);
    };

    const updateHabitTitle = async () => {
        if (!habitId || !newTitle) {
            Alert.alert("El ID del hábito y el nuevo título son requeridos");
            return;
        }

        try {
            const response = await axios.put(`http://192.168.3.73:3000/habits/${habitId}`, { title: newTitle });
            if (response.status === 200) {
                Alert.alert("Título actualizado exitosamente");
                setModalVisible(false);
                setNewTitle("");
                fetchHabits();
            }
        } catch (error) {
            console.log("Error actualizando el título del hábito", error);
            Alert.alert("Error actualizando el título");
        }
    };

    const handleCompletion = async () => {
        try {
            if (!selectedHabit || !selectedHabit._id) {
                throw new Error("Habit ID is missing or invalid");
            }

            const habitId = selectedHabit._id;

            const completed = selectedHabit.completed || {};
            const updatedCompletion = {
                ...completed,
                [currentDay]: true
            };

            const response = await axios.put(`http://192.168.3.73:3000/habits/${habitId}/completed`, {
                completed: updatedCompletion
            });

            if (response.status !== 200) {
                throw new Error(`Failed to update habit: ${response.status}`);
            }

            await fetchHabits();
            setModalVisible(false);
        } catch (error) {
            console.log("Error:", error.message || error);
        }
    };

    const deleteHabits = async () => {
        try {
            const habitId = selectedHabit._id;
            const response = await axios.delete(`http://192.168.3.73:3000/habits/${habitId}`);
            if (response.status == 200) {
                await fetchHabits();
                setModalVisible(false);
            }
        } catch (error) {
            console.log("Error!", error);
        }
    };



    const getCompletedDays = (completedObj) => {
        if (completedObj && typeof completedObj === "object") {
            return Object.keys(completedObj).filter(day => completedObj[day]);
        }
        return [];
    };

    const filteredHabits = Array.isArray(habits) ? habits.filter((habit) => {
        return !habit.completed || !habit.completed[currentDay];
    }) : [];

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Entypo name="user" size={50} color="black" />

                    {/* Add Task Button */}
                    <Pressable
                        onPress={() => router.push("/home/create")}
                        style={{
                            backgroundColor: "#88E74E",
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            borderRadius: 25
                        }}>
                        <Text style={{
                            textAlign: "center",
                            color: "white",
                            fontSize: 20
                        }}>Add Task</Text>
                    </Pressable>
                </View>
                <Text style={{
                    marginVertical: 5,
                    fontSize: 40,
                    fontWeight: "500",
                    textAlign: 'center'
                }}>App Remeinder UAEMEX</Text>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginVertical: 8
                }}>
                    <Pressable
                        onPress={() => setOption("Today")}
                        style={{
                            backgroundColor: option == "Today" ? "#88E74E" : "transparent",
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            borderRadius: 25
                        }}>
                        <Text style={{
                            textAlign: "center",
                            color: "gray",
                            fontSize: 20
                        }}>PARA HOY</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setOption("Weekly")}
                        style={{
                            backgroundColor: option == "Weekly" ? "#88E74E" : "transparent",
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            borderRadius: 25
                        }}>
                        <Text style={{
                            textAlign: "center",
                            color: "gray",
                            fontSize: 20
                        }}>PARA LA SEMANA</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setOption("Overall")}
                        style={{
                            backgroundColor: option == "Overall" ? "#88E74E" : "transparent",
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            borderRadius: 25
                        }}>
                        <Text style={{
                            textAlign: "center",
                            color: "gray",
                            fontSize: 20
                        }}>RESUMEN DE ACTIVIDADES</Text>
                    </Pressable>
                </View>

                {/* Buttons for Selecting Days */}
                {option === "Weekly" && (
                    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                        {days.map((day, index) => (
                            <Pressable
                                key={index}
                                style={{
                                    backgroundColor: selectedDays.includes(day) ? "#88E74E" : "#ccc",
                                    paddingHorizontal: 10,
                                    paddingVertical: 8,
                                    marginHorizontal: 5,
                                    borderRadius: 25
                                }}
                                onPress={() => {
                                    const updatedDays = selectedDays.includes(day)
                                        ? selectedDays.filter((selectedDay) => selectedDay !== day)
                                        : [...selectedDays, day];
                                    setSelectedDays(updatedDays);
                                }}
                            >
                                <Text style={{ color: selectedDays.includes(day) ? "white" : "black" }}>{day}</Text>
                            </Pressable>
                        ))}
                    </View>
                )}

                {option === "Today" && filteredHabits?.length > 0 ? (
                    <View>
                        {filteredHabits?.map((item, index) => (
                            <Pressable
                                onLongPress={() => handleLongPress(item._id)}
                                style={{
                                    marginVertical: 10,
                                    backgroundColor: item?.color,
                                    padding: 12,
                                    borderRadius: 24
                                }} key={index}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontWeight: "500",
                                        color: "white"
                                    }}>{item?.title}</Text>
                            </Pressable>
                        ))}
                    </View>
                ) : option === "Today" ? (
                    <View
                        style={{
                            marginTop: 150,
                            justifyContent: 'center',
                            alignItems: "center",
                            marginBottom: "auto"
                        }}>
                        <Image
                            source={{ uri: 'https://example.com/your-image-url.png' }} // Asegúrate de usar una URL válida para la imagen
                            style={{ width: 200, height: 200 }}
                        />
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 20,
                                fontWeight: "600",
                                marginTop: 10,
                            }}>No tienes ningún recordatorio, descansa</Text>
                        <Pressable
                            onPress={() => router.push("/home/create")}
                            style={{
                                backgroundColor: "#88E74E",
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 25,
                                marginTop: 20
                            }}>
                            <Text style={{
                                textAlign: "center",
                                color: "white",
                                fontSize: 18
                            }}>Add New Task</Text>
                        </Pressable>
                    </View>
                ) : null}

                {option === "Weekly" && filteredHabits?.length > 0 ? (
                    <View>
                        {habits?.map((habit, index) => (
                            <Pressable
                                onLongPress={() => handleLongPress(habit._id)}
                                style={{
                                    marginVertical: 10,
                                    backgroundColor: habit.color,
                                    padding: 12,
                                    borderRadius: 24
                                }} key={index}>
                                <Text style={{
                                    textAlign: "center",
                                    fontWeight: "500",
                                    color: "white"
                                }}>
                                    {habit.title}
                                </Text>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-evenly",
                                    marginTop: 10
                                }}>
                                    {days?.map((day, item) => {
                                        const isCompleted = habit.completed && habit.completed[day];

                                        return (
                                            <Pressable key={item}>
                                                <Text style={{ color: isCompleted ? "black" : "gray", fontSize: 11 }}>
                                                    {day}
                                                </Text>
                                                <View style={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: 100,
                                                    backgroundColor: isCompleted ? "green" : "white",
                                                    padding: 2,
                                                    borderWidth: 2,
                                                    borderColor: "gray",
                                                    marginTop: 4,
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}>
                                                    {isCompleted && <Feather name="check" size={12} color="white" />}
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </Pressable>
                        ))}
                    </View>
                ) : option === "Weekly" ? (
                    <View
                        style={{
                            marginTop: 150,
                            justifyContent: 'center',
                            alignItems: "center",
                            marginBottom: "auto"
                        }}>
                        <Image
                            source={{ uri: 'https://example.com/your-image-url.png' }} // Asegúrate de usar una URL válida para la imagen
                            style={{ width: 200, height: 200 }}
                        />
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 20,
                                fontWeight: "600",
                                marginTop: 10,
                            }}>No tienes ningún recordatorio, descansa</Text>
                        <Pressable
                            onPress={() => router.push("/home/create")}
                            style={{
                                backgroundColor: "#88E74E",
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 25,
                                marginTop: 20
                            }}>
                            <Text style={{
                                textAlign: "center",
                                color: "white",
                                fontSize: 18
                            }}>Add New Task</Text>
                        </Pressable>
                    </View>
                ) : null}

                {option === "Overall" && habits?.length > 0 ? (
                    <View>
                        {habits?.map((habit, index) => (
                            <React.Fragment key={index}>
                                <Pressable
                                    onLongPress={() => handleLongPress(habit._id)}
                                    style={{
                                        marginVertical: 10,
                                        backgroundColor: habit.color,
                                        padding: 15,
                                        borderRadius: 24
                                    }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-evenly",
                                            marginVertical: 10
                                        }}>
                                        <Text style={{ fontSize: 15, fontWeight: "500", color: "white" }}>
                                            {habit.title}
                                        </Text>
                                        <Text style={{ color: "white" }}>
                                            {habit.repeatMode}
                                        </Text>
                                    </View>
                                </Pressable>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Text> Completado en :</Text>
                                    <Text>{getCompletedDays(habit.completed).join(",")}</Text>
                                </View>
                            </React.Fragment>
                        ))}
                    </View>
                ) : option === "Overall" ? (
                    <View
                        style={{
                            marginTop: 150,
                            justifyContent: 'center',
                            alignItems: "center",
                            marginBottom: "auto"
                        }}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1632/1632670.png' }} // Asegúrate de usar una URL válida para la imagen
                            style={{ width: 200, height: 200 }}
                        />
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 20,
                                fontWeight: "600",
                                marginTop: 10,
                            }}>No tienes ningún recordatorio, descansa</Text>
                        <Pressable
                            onPress={() => router.push("/home/create")}
                            style={{
                                backgroundColor: "#88E74E",
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 25,
                                marginTop: 20
                            }}>
                            <Text style={{
                                textAlign: "center",
                                color: "white",
                                fontSize: 18
                            }}>Add New Task</Text>
                        </Pressable>
                    </View>
                ) : null}
            </ScrollView>

            <BottomModal
                onBackdropPress={() => setModalVisible(!isModalVisible)}
                onHardwareBackPress={() => setModalVisible(!isModalVisible)}
                swipeDirection={["up", "down"]}
                swipeThreshold={200}
                modalTitle={<ModalTitle style={{ fontWeight: "800", fontSize: 30 }} title="Elige una Opcion" />}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }
                visible={isModalVisible}
                onTouchOutside={() => setModalVisible(!isModalVisible)}
            >
                <ModalContent style={{
                    width: "100%",
                    height: 280
                }}>
                    <View>
                            <TextInput
                                placeholder="Nuevo Título"
                                value={newTitle}
                                onChangeText={setNewTitle}
                                style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: "gray",
                                    marginBottom: 20
                                }}
                            />
                            <Pressable
                                onPress={updateHabitTitle}
                                style={{
                                    backgroundColor: "yellow",
                                    paddingHorizontal: 10,
                                    paddingVertical: 8,
                                    borderRadius: 25,
                                    marginBottom: 10
                                }}>
                                <Text style={{ textAlign: "center", color: "white", fontSize: 20 }}>Actualizar Título</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleCompletion}
                                style={{
                                    backgroundColor: "#88E74E",
                                    paddingHorizontal: 10,
                                    paddingVertical: 8,
                                    borderRadius: 25,
                                    marginBottom: 10
                                }}>
                                <Text style={{ textAlign: "center", color: "white", fontSize: 20 }}>Marcar como Completado</Text>
                            </Pressable>
                            <Pressable
                                onPress={deleteHabits}
                                style={{
                                    backgroundColor: "#FF6347",
                                    paddingHorizontal: 10,
                                    paddingVertical: 8,
                                    borderRadius: 25
                                }}>
                                <Text style={{ textAlign: "center", color: "white", fontSize: 20 }}>Eliminar Hábito</Text>
                            </Pressable>
                        </View>
                </ModalContent>
            </BottomModal>

            <ModalPortal />
        </>
    );
};

export default Index;

const styles = StyleSheet.create({});




