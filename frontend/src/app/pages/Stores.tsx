import { useState } from "react";
import { MapPin, Plus, Edit, Trash2, Phone, Mail } from "lucide-react";

interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: "active" | "inactive";
}

export function Stores() {
  const [stores] = useState<Store[]>([
    {
      id: 1,
      name: "Magasin Paris Centre",
      address: "123 Rue de Rivoli, 75001 Paris",
      phone: "+33 1 23 45 67 89",
      email: "paris@store.com",
      manager: "Marie Dupont",
      status: "active"
    },
    {
      id: 2,
      name: "Magasin Lyon Part-Dieu",
      address: "45 Rue de la République, 69002 Lyon",
      phone: "+33 4 78 90 12 34",
      email: "lyon@store.com",
      manager: "Pierre Martin",
      status: "active"
    },
    {
      id: 3,
      name: "Magasin Marseille Vieux-Port",
      address: "78 La Canebière, 13001 Marseille",
      phone: "+33 4 91 23 45 67",
      email: "marseille@store.com",
      manager: "Sophie Bernard",
      status: "active"
    },
    {
      id: 4,
      name: "Magasin Toulouse Capitole",
      address: "12 Place du Capitole, 31000 Toulouse",
      phone: "+33 5 61 23 45 67",
      email: "toulouse@store.com",
      manager: "Jean Dubois",
      status: "inactive"
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestion des Magasins</h2>
          <p className="text-gray-500 mt-1">Gérez vos différents points de vente</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Ajouter un magasin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{store.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    store.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {store.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit size={18} className="text-blue-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-400 mt-0.5" />
                <p className="text-gray-600">{store.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <p className="text-gray-600">{store.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <p className="text-gray-600">{store.email}</p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-gray-500">Responsable</p>
                <p className="font-medium text-gray-800">{store.manager}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
