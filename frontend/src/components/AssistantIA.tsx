import { useState } from "react";
import { askGroq } from '../services/groqService';

export function AssistantIA() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: "Bonjour! Je suis votre assistant ElectroManager." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      console.log("=== DÉBUT ENVOI MESSAGE ===");
      console.log("Message utilisateur:", userMsg);
      console.log("Type du message:", typeof userMsg);
      console.log("Longueur du message:", userMsg.length);
      
      const response = await askGroq(userMsg);
      
      console.log("=== RÉPONSE REÇUE ===");
      console.log("Type de la réponse:", typeof response);
      console.log("Contenu de la réponse:", response);
      console.log("Longueur de la réponse:", response?.length || 0);
      
      // Vérifier si la réponse est une chaîne de caractères valide
      if (typeof response === 'string' && response.trim().length > 0) {
        setMessages(m => [...m, { role: "assistant", text: response }]);
        console.log("✅ Message ajouté avec succès au chat");
      } else {
        console.error("❌ Réponse invalide:", response);
        setMessages(m => [...m, { role: "assistant", text: "Réponse invalide reçue de l'API. Vérifiez la console." }]);
      }
    } catch (error) {
      console.error("=== ERREUR DANS LE COMPOSANT ===");
      console.error("Erreur:", error);
      console.error("Type d'erreur:", typeof error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Message d'erreur:", errorMessage);
      setMessages(m => [...m, { role: "assistant", text: `Erreur: ${errorMessage}` }]);
    } finally {
      setLoading(false);
      console.log("=== FIN ENVOI MESSAGE ===");
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none", cursor: "pointer", fontSize: 24, color: "white", zIndex: 9999 }}>💬</button>
      {isOpen && (
        <div style={{ position: "fixed", bottom: 90, right: 24, width: 350, height: 450, background: "rgba(15,12,41,0.95)", backdropFilter: "blur(20px)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.2)", display: "flex", flexDirection: "column", zIndex: 9999, padding: 16 }}>
          <div style={{ color: "white", fontWeight: "bold", marginBottom: 12, fontSize: 16 }}>🤖 Assistant ElectroManager</div>
          <div style={{ flex: 1, overflowY: "auto", marginBottom: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left", marginBottom: 8 }}>
                <span style={{ background: m.role === "user" ? "#667eea" : "rgba(255,255,255,0.15)", color: "white", padding: "8px 12px", borderRadius: 12, display: "inline-block", maxWidth: "80%", fontSize: 13 }}>{m.text}</span>
              </div>
            ))}
            {loading && <div style={{ color: "#aaa", fontSize: 13 }}>En train d'écrire...</div>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Votre message..." style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "black", fontSize: 13 }} />
            <button onClick={send} style={{ padding: "8px 16px", borderRadius: 8, background: "#667eea", border: "none", color: "white", cursor: "pointer", fontSize: 13 }}>Envoyer</button>
          </div>
        </div>
      )}
    </div>
  );
}
