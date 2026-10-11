import { useState } from "react";

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
      // 1. On récupère les vraies données produits depuis Django avant de répondre
      let productsContext = "";
      try {
        const productsRes = await fetch("http://localhost:8000/api/products/");
        const productsData = await productsRes.json();
        productsContext = JSON.stringify(productsData.products);
      } catch (e) {
        console.error("Impossible de charger les produits depuis Django:", e);
        productsContext = "[]";
      }

      // 2. On envoie ces données réelles à Groq avec la question de l'utilisateur
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + import.meta.env.VITE_GROQ_API_KEY },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content: "Tu es l'assistant ElectroManager. Voici la liste réelle et à jour des produits en stock (format JSON) : " + productsContext + ". Réponds toujours en français, en langage naturel et clair, JAMAIS avec du code ou du SQL. Utilise uniquement les données ci-dessus pour répondre aux questions sur le stock, les prix ou les produits. Si l'information demandée n'est pas dans ces données, dis-le simplement."
            },
            { role: "user", content: userMsg }
          ]
        })
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Erreur Groq:", data);
      }
      const reply = data?.choices?.[0]?.message?.content || "Je n'ai pas pu répondre.";
      setMessages(m => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", text: "Erreur de connexion." }]);
    }
    setLoading(false);
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
