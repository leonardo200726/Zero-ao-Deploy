import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("."));

// 🔹 SUA CONEXÃO COM O MONGODB ATLAS
const MONGO_URI = "mongodb+srv://leonardolourenco_db_user:Mrlka1234.@cluster0.8qbgvkn.mongodb.net/?appName=Cluster0";

// 🔹 Conexão com o banco
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
  .catch(err => console.error("❌ Erro ao conectar:", err));

const UsuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

// 🔹 Rota de cadastro
app.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const novoUsuario = new Usuario({ nome, email, senha });
    await novoUsuario.save();
    res.json({ mensagem: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao cadastrar usuário." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
