import { useNavigate } from "react-router";
import { StoreLogo } from "../components/StoreLogo";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="animated-bg" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <StoreLogo />
            </div>
            
            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <a href="#features" className="text-white/80 hover:text-white transition-colors font-medium">
                Fonctionnalités
              </a>
              <a href="#testimonials" className="text-white/80 hover:text-white transition-colors font-medium">
                Témoignages
              </a>
              <button
                onClick={() => navigate("/login")}
                className="bg-white/15 border border-white/30 text-white px-6 py-2 rounded-xl hover:bg-white/25 transition-all font-medium"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            ✦ Nouvelle plateforme de gestion multi-magasins d'électronique
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
            Gérez votre <span className="text-blue-400">magasin d'électronique</span> comme jamais
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
            ElectroManager est la solution complète pour gérer plusieurs magasins d'électronique, suivre vos stocks en temps réel et optimiser vos ventes de produits technologiques.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 font-poppins"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Commencer gratuitement →
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-white/15 border border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/25 transition-all font-semibold"
            >
              Se connecter
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
              Tout ce dont vous avez besoin pour votre électronique
            </h2>
            <p className="text-lg text-white/80 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
              Des outils puissants pour gérer votre magasin d'électronique efficacement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass border border-white/20 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                🖥️
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Multi-Magasins
              </h3>
              <p className="text-white/80 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Gérez plusieurs magasins d'électronique depuis une seule interface centralisée
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass border border-white/20 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                ♻️
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Gestion des Stocks
              </h3>
              <p className="text-white/80 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Suivez vos inventaires de produits électroniques en temps réel et recevez des alertes de réapprovisionnement
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="glass border border-white/20 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                📱
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Catalogue Produits
              </h3>
              <p className="text-white/80 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Gérez facilement votre catalogue de smartphones, ordinateurs, et accessoires électroniques
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="glass border border-white/20 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                📊
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Analytiques Avancées
              </h3>
              <p className="text-white/80 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Suivez les ventes par catégorie (smartphones, ordinateurs, etc.) et identifiez les tendances du marché
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="glass border border-white/20 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                📈
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Ventes Multi-canaux
              </h3>
              <p className="text-white/80 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Gérez les ventes en magasin et en ligne avec synchronisation automatique des stocks
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="glass border border-white/20 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                🎧
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Support Technique
              </h3>
              <p className="text-white/80 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Gestion des garanties et du service après-vente pour tous vos produits électroniques
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
              Ce que nos clients disent
            </h2>
            <p className="text-lg text-white/80 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
              Rejoignez des milliers de propriétaires de magasins d'électronique qui font confiance à ElectroManager
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="glass border border-white/20 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">
                  ★★★★★
                </div>
              </div>
              <p className="text-white/90 mb-6 italic font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                "ElectroManager a transformé la façon dont je gère mes 3 magasins d'électronique. Le suivi des stocks et des ventes est devenu tellement simple!"
              </p>
              <div className="text-white font-semibold font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Alexandre Dubois, Propriétaire, TechStore
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="glass border border-white/20 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">
                  ★★★★★
                </div>
              </div>
              <p className="text-white/90 mb-6 italic font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                "La gestion des stocks de smartphones et ordinateurs est devenue si efficace. Je reçois des alertes avant même de manquer de produits populaires."
              </p>
              <div className="text-white font-semibold font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Jean Martin, Manager, ElectroShop
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="glass border border-white/20 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">
                  ★★★★★
                </div>
              </div>
              <p className="text-white/90 mb-6 italic font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                "Les analytics m'ont permis d'optimiser mon catalogue et d'augmenter mes ventes de 40% en 6 mois, notamment sur les accessoires mobiles."
              </p>
              <div className="text-white font-semibold font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Sophie Laurent, Directrice, Mobile Center
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-white/20 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/60 mb-6 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
            © 2024 ElectroManager. Tous droits réservés.
          </p>
          <div className="flex justify-center gap-8">
            <a href="#" className="text-white/60 hover:text-white transition-colors font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
              Mentions légales
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
              Confidentialité
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
              Support
            </a>
          </div>
        </div>
      </footer>

          </div>
  );
}
