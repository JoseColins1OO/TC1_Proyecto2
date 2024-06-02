const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const cors = require("cors");
const jwt = require("jsonwebtoken");
//const moment = require("moment");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://jose:jose@cluster0.rdtvyjp.mongodb.net/")
    .then(() => {
        console.log("Conectado a la base de datos");
    })
    .catch((error) => {
        console.log("Error conectando a la base de datos", error);
    });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const User = require("./models/user");
const Habit = require("./models/habits");

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const UsuarioExist = await User.findOne({ email });
        if (UsuarioExist) {
            return res.status(400).json({ message: "Email ya utilizado en otra cuenta" });
        }

        const nuevoUsuario = new User({ name, email, password });
        await nuevoUsuario.save();
        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        console.log("Error registrando Usuario Nuevo", error);
        res.status(500).json({ message: "Registro fallido" });
    }
});

const generateSecretKey = () => {
    return crypto.randomBytes(32).toString("hex");
};
const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Correo Inválido" });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Contraseña Inválida" });
        }

        const token = jwt.sign({ userId: user._id }, secretKey);
        res.status(200).json({ token });
    } catch (error) {
        console.log("Error al hacer login", error);
        res.status(500).json({ message: "Error en Login" });
    }
});
//PARA  RECORDATORIOS
app.post("/habits", async (req, res) => {
    try {
        const { title, color, repeatMode, reminder } = req.body;

        const newHabit = new Habit({
            title,
            color,
            reminder,
            repeatMode,
        })

        const savedHabit = await newHabit.save();
        res.status(200).json(savedHabit);
    } catch (error) {
        res.status(500).json({ error: "Error de Red" })
    }
});

app.get("/habitslist" ,async (req , res) =>{
    try{
        const allHabits = await Habit.find({});
        res.status(200).json(allHabits)

    }catch(error){
        res.status(500).json({error:error.message})
    }
});

app.put("/habits/:habitId/completed/:day", async (req, res) =>{
    try{
        const {habitId,day} = req.params;
        const habit = await Habit.findById(habitId);

        if(!habit){
            return res.status(404).json ({error:"Recortadorio no encotrado"})
        }
        habit.completed(day) = true;
        await habit.save();
        res.status(200).json({message:"Recorstadorio a sido actualizado"})

    }catch(error){
        console.log("Error",error);
        res.status(500).json({erro:error.message})
    }
});

app.put("/habits/:habitId", async (req, res) => {
    try {
        const { habitId } = req.params;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ error: "El título es requerido" });
        }

        const updatedHabit = await Habit.findByIdAndUpdate(
            habitId,
            { title },
            { new: true }
        );

        if (!updatedHabit) {
            return res.status(404).json({ error: "Hábito no encontrado" });
        }

        res.status(200).json(updatedHabit);
    } catch (error) {
        console.log("Error actualizando el título del hábito", error);
        res.status(500).json({ error: error.message });
    }
});




app.put("/habits/:habitId/completed", async (req, res) => {
    const habitId = req.params.habitId;
    const updatedCompletion = req.body.completed; // The updated completion object
  
    try {
      const updatedHabit = await Habit.findByIdAndUpdate(
        habitId,
        { completed: updatedCompletion },
        { new: true }
      );
  
      if (!updatedHabit) {
        return res.status(404).json({ error: "Recordatorio no encontrado" });
      }
  
      return res.status(200).json(updatedHabit);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
  
  app.delete("/habits/:habitId", async (req, res) => {
    try {
      const { habitId } = req.params;
  
      await Habit.findByIdAndDelete(habitId);
  
      res.status(200).json({ message: "Recordatorio eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "No se ah podido eliminar el recordatorio" });
    }
  });
  


