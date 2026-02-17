const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// 1. CONEXIÓN A MONGODB
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log("Conectado a la BD")) // Mensaje exacto requerido
  .catch(err => console.error("Error al conectar:", err));

// 2. DEFINICIÓN DE ESQUEMAS (Cumpliendo el requisito de 5 colecciones)
const Libro = mongoose.model('Libro', new mongoose.Schema({ titulo: String, autor: String, isbn: String, anio: Number }));
const Autor = mongoose.model('Autor', new mongoose.Schema({ nombre: String, pais: String, nacimiento: Number, premios: Number }));
const Usuario = mongoose.model('Usuario', new mongoose.Schema({ nombre: String, email: String, edad: Number, plan: String }));
const Prestamo = mongoose.model('Prestamo', new mongoose.Schema({ id_libro: String, id_usuario: String, fecha: String, devuelto: Boolean }));
const Categoria = mongoose.model('Categoria', new mongoose.Schema({ nombre: String, pasillo: String, popularidad: Number, activa: Boolean }));

// 3. MÓDULO CRUD (Para la colección Libros)

// CREATE: Crear libro
app.post('/libros', async (req, res) => {
  const libro = new Libro(req.body);
  await libro.save();
  res.send({ mensaje: "Libro creado", libro });
});

// READ: Leer todos los libros
app.get('/libros', async (req, res) => {
  const libros = await Libro.find();
  res.send(libros);
});

// UPDATE: Actualizar un libro por ID
app.put('/libros/:id', async (req, res) => {
  const libro = await Libro.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send({ mensaje: "Libro actualizado", libro });
});

// DELETE: Borrar un libro por ID
app.delete('/libros/:id', async (req, res) => {
  await Libro.findByIdAndDelete(req.params.id);
  res.send({ mensaje: "Libro eliminado" });
});

// 4. CONSULTA SENCILLA: Buscar libro por título
app.get('/libros/buscar/:titulo', async (req, res) => {
  const libro = await Libro.find({ titulo: req.params.titulo });
  res.send(libro);
});

// 5. INICIAR SERVIDOR
app.listen(3000, () => console.log("Servidor en puerto 3000"));