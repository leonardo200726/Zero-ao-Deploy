import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("."));

// Rota para a página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔹 Conexão com o MongoDB Atlas
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://leonardolourenco_db_user:Mrlka1234.@cluster0.8qbgvkn.mongodb.net/?appName=Cluster0";

// 🔹 Conexão com o banco
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
  .catch(err => console.error("❌ Erro ao conectar:", err));

const UsuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

// 🔹 Rota de cadastro
app.post("/cadastrar", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    // Verificar se o email já está cadastrado
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: "Email já cadastrado!" });
    }

    const novoUsuario = new Usuario({ nome, email, senha });
    await novoUsuario.save();
    res.json({ mensagem: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao cadastrar usuário." });
  }
});

// 🔹 Rota de login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ email, senha });
    if (usuario) {
      res.json({ 
        mensagem: "Login realizado com sucesso!",
        usuario: {
          nome: usuario.nome,
          email: usuario.email
        }
      });
    } else {
      res.status(401).json({ mensagem: "Email ou senha incorretos!" });
    }
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao fazer login." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
