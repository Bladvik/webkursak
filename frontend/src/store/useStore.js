// frontend/src/store/useStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // <--- ДОДАЙ ЦЕ
// frontend/src/store/useStore.js

export const OFFICIAL_BLUEPRINTS = [
  { 
    id: 'blueprint-1', 
    name: "The Enthusiast (Official)", 
    isOfficial: true,
    thumbnailUrl: '/blueprints/enthusiast.png',
    selectedParts: { 
      Case: 'case-h510', Motherboard: 'mb-b650', CPU: 'cpu-7800x3d', GPU: 'gpu-5090', 
      RAM: 'ram-ddr5-2', PSU: 'psu-1000', SSD: 'ssd-2000', 
      CaseFans: { "Rear": 'fan-lianli', "Top": 'fan-lianli', "Front-1": 'fan-lianli', "Front-2": 'fan-lianli' } 
    }
  },
  { 
    id: 'blueprint-2', 
    name: "The Mid-Tier (Official)", 
    isOfficial: true,
    thumbnailUrl: '/blueprints/mid.png',
    selectedParts: { 
      Case: 'case-h510', Motherboard: 'mb-z790', CPU: 'cpu-13600k', GPU: 'gpu-4070s', 
      RAM: 'ram-ddr5-2', PSU: 'psu-1000', SSD: 'ssd-1000', CaseFans: { "Rear": 'fan-arctic' } 
    }
  },
  { 
    id: 'blueprint-3', 
    name: "Budget Esports King (Official)", 
    isOfficial: true,
    thumbnailUrl: '/blueprints/budget.png',
    selectedParts: { 
      Case: 'case-q300l', Motherboard: 'mb-b450', CPU: 'cpu-3600', GPU: 'gpu-1660s', 
      RAM: 'ram-ddr4-2', PSU: 'psu-550', SSD: 'ssd-1000', CaseFans: { "Rear": 'fan-arctic', "Front-1": 'fan-arctic' } 
    }
  }
];

// Далі йде твій const useStore = create(...)
export const translations = {
  en: {
    // --- Old Keys ---
    configTitle: "Configuration",
    rgbLabel: "RGB Glow",
    baseColorLabel: "Base Color",
    searchPlaceholder: "Search components...",
    lowestPrice: "Lowest Price",
    highestPrice: "Highest Price",
    az: "A-Z",
    removePart: "Remove Component",
    equipPart: "Equip to Build",
    cart: "Cart",
    admin: "Admin Login",
    back: "← BACK TO MENU",
    all: "All",
    loading: "Loading 3D Models...",
    clearBase: "Reset Base",
    clearRgb: "Turn Off RGB",
    enterConfig: "Enter Configurator",
    slide1Title: "Real-time 3D Visualization",
    slide1Sub: "Experience every angle.",
    slide1Desc: "Build and inspect your dream workstation in a fully interactive 3D environment before making a decision.",
    slide2Title: "Per-Component RGB Customization",
    slide2Sub: "Absolute lighting control.",
    slide2Desc: "Fine-tune the emissive glow and base materials of individual parts. True light casting makes your build truly your own.",
    slide3Title: "Premium Components",
    slide3Sub: "Only the best hardware.",
    slide3Desc: "Swap between top-tier GPUs, CPUs, and cooling systems instantly to find the perfect synergy.",
    equipToSlot: "Equip to",
    removeFromSlot: "Remove from",
    availableSlots: "Available Fan Mounts",
    clickToFocus: "Click a 3D part to edit colors",
    // --- New Editor Keys ---
    workbench: "Workbench",
    loadout: "Loadout",
    catalog: "Catalog",
    goPro: "Go Pro",
    login: "Login",
    logout: "Logout",
    language: "Language",
    telemetry: "System Telemetry",
    estPower: "Est. Power",
    perfScore: "Perf. Score",
    auraStudio: "Aura Studio",
    globalSync: "Global Sync",
    linkZones: "Link all RGB zones",
    masterColor: "Master Color",
    individualZones: "Individual Zones",
    saveCapture: "Save & Capture",
    selectComponent: "Select Component",
    equipped: "Equipped",
    equip: "Equip",
    compatIssue: "Compatibility Issue",
    temp: "Est. Temp",
    sortBy: "Sort By",
    priceAsc: "Price: Low to High",
    priceDesc: "Price: High to Low",
    nameAsc: "Name: A-Z",
    powerDesc: "Power Draw: High to Low",
    totalPrice: "Estimated Cost",
    missingParts: "Missing Critical Parts:",
    systemReady: "System Ready to Build",
    bottleneckWarn: "Bottleneck Warning"
  },
  uk: {
    // --- Old Keys ---
    configTitle: "Конфігурація",
    rgbLabel: "RGB підсвітка",
    baseColorLabel: "Колір бази",
    searchPlaceholder: "Пошук компонентів...",
    lowestPrice: "Найдешевші",
    highestPrice: "Найдорожчі",
    az: "А-Я",
    removePart: "Прибрати компонент",
    equipPart: "Встановити в збірку",
    cart: "Кошик",
    admin: "Вхід для адміна",
    back: "← ПОВЕРНУТИСЯ ДО МЕНЮ",
    all: "Всі",
    loading: "Завантаження 3D моделей...",
    clearBase: "Скинути колір",
    clearRgb: "Вимкнути RGB",
    enterConfig: "Увійти в конфігуратор",
    slide1Title: "3D-візуалізація в реальному часі",
    slide1Sub: "Відчуйте кожен кут.",
    slide1Desc: "Зберіть та огляньте вашу омріяну робочу станцію в повністю інтерактивному 3D середовищі перед прийняттям рішення.",
    slide2Title: "Налаштування RGB для кожного компонента",
    slide2Sub: "Абсолютний контроль освітлення.",
    slide2Desc: "Точно налаштуйте світіння та базові матеріали окремих деталей. Справжнє освітлення робить вашу збірку унікальною.",
    slide3Title: "Преміальні компоненти",
    slide3Sub: "Тільки найкраще обладнання.",
    slide3Desc: "Миттєво змінюйте топові відеокарти, процесори та системи охолодження, щоб знайти ідеальну синергію.",
    equipToSlot: "Встановити у",
    removeFromSlot: "Прибрати з",
    availableSlots: "Доступні кріплення вентиляторів",
    clickToFocus: "Натисніть на 3D деталь для редагування",
    // --- New Editor Keys ---
    workbench: "Майстерня",
    loadout: "Збірка",
    catalog: "Каталог",
    goPro: "Купити Pro",
    login: "Увійти",
    logout: "Вийти",
    language: "Мова",
    telemetry: "Телеметрія",
    estPower: "Потужність",
    perfScore: "Оцінка",
    auraStudio: "Aura Studio",
    globalSync: "Глобальна Синхр.",
    linkZones: "Зв'язати всі зони",
    masterColor: "Головний колір",
    individualZones: "Окремі зони",
    saveCapture: "Зберегти фото",
    selectComponent: "Обрати деталь",
    equipped: "Встановлено",
    equip: "Встановити",
    compatIssue: "Проблема сумісності",
    temp: "Температура",
    sortBy: "Сортування",
    priceAsc: "Ціна: від дешевих",
    priceDesc: "Ціна: від дорогих",
    nameAsc: "Назва: А-Я",
    powerDesc: "Енергоспоживання: Макс.",
    totalPrice: "Орієнтовна вартість",
    missingParts: "Не вистачає деталей:",
    systemReady: "Система готова до збірки",
    bottleneckWarn: "Попередження про вузьке місце"
  },
  it: {
    configTitle: "Configurazione",
    rgbLabel: "Illuminazione RGB",
    baseColorLabel: "Colore Base",
    searchPlaceholder: "Cerca componenti...",
    lowestPrice: "Prezzo più basso",
    highestPrice: "Prezzo più alto",
    az: "A-Z",
    removePart: "Rimuovi Componente",
    equipPart: "Equipaggia",
    cart: "Carrello",
    admin: "Accesso Admin",
    back: "← TORNA AL MENU",
    all: "Tutti",
    loading: "Caricamento Modelli 3D...",
    clearBase: "Reimposta Base",
    clearRgb: "Spegni RGB",
    enterConfig: "Entra nel Configuratore",
    slide1Title: "Visualizzazione 3D in tempo reale",
    slide1Sub: "Scopri ogni angolazione.",
    slide1Desc: "Costruisci ed esplora la tua workstation dei sogni in un ambiente 3D completamente interattivo.",
    slide2Title: "Personalizzazione RGB",
    slide2Sub: "Controllo assoluto dell'illuminazione.",
    slide2Desc: "Regola i bagliori e i materiali base dei singoli componenti. L'illuminazione realistica rende la tua build unica.",
    slide3Title: "Componenti Premium",
    slide3Sub: "Solo il miglior hardware.",
    slide3Desc: "Sostituisci GPU, CPU e sistemi di raffreddamento istantaneamente per trovare la sinergia perfetta.",
    equipToSlot: "Equipaggia su",
    removeFromSlot: "Rimuovi da",
    availableSlots: "Slot ventole disponibili",
    clickToFocus: "Clicca su una parte 3D per modificare i colori",
    workbench: "Laboratorio",
    loadout: "Configurazione",
    catalog: "Catalogo",
    goPro: "Passa a Pro",
    login: "Accedi",
    logout: "Esci",
    language: "Lingua",
    telemetry: "Telemetria",
    estPower: "Potenza Est.",
    perfScore: "Punteggio",
    auraStudio: "Studio Aura",
    globalSync: "Sinc. Globale",
    linkZones: "Collega tutte le zone",
    masterColor: "Colore Principale",
    individualZones: "Zone Singole",
    saveCapture: "Salva e Cattura",
    selectComponent: "Seleziona",
    equipped: "Equipaggiato",
    equip: "Equipaggia",
    compatIssue: "Problema di compatibilità",
    temp: "Temperatura"
  },
  pl: {
    configTitle: "Konfiguracja",
    rgbLabel: "Podświetlenie RGB",
    baseColorLabel: "Kolor Bazowy",
    searchPlaceholder: "Szukaj komponentów...",
    lowestPrice: "Najniższa cena",
    highestPrice: "Najwyższa cena",
    az: "A-Z",
    removePart: "Usuń komponent",
    equipPart: "Zainstaluj",
    cart: "Koszyk",
    admin: "Panel Admina",
    back: "← WSTECZ",
    all: "Wszystkie",
    loading: "Ładowanie modeli 3D...",
    clearBase: "Resetuj kolor",
    clearRgb: "Wyłącz RGB",
    enterConfig: "Wejdź do konfiguratora",
    slide1Title: "Wizualizacja 3D w czasie rzeczywistym",
    slide1Sub: "Doświadcz każdego kąta.",
    slide1Desc: "Zbuduj i obejrzyj swoją wymarzoną stację roboczą w pełni interaktywnym środowisku 3D.",
    slide2Title: "Personalizacja RGB",
    slide2Sub: "Absolutna kontrola oświetlenia.",
    slide2Desc: "Dostosuj blask i materiały poszczególnych części. Prawdziwe rzucanie światła czyni twój zestaw unikalnym.",
    slide3Title: "Komponenty Premium",
    slide3Sub: "Tylko najlepszy sprzęt.",
    slide3Desc: "Natychmiast zmieniaj karty graficzne, procesory i chłodzenie, aby znaleźć idealną synergię.",
    equipToSlot: "Zamontuj w",
    removeFromSlot: "Usuń z",
    availableSlots: "Dostępne miejsca na wentylatory",
    clickToFocus: "Kliknij część 3D, aby edytować kolory",
    workbench: "Warsztat",
    loadout: "Zestaw",
    catalog: "Katalog",
    goPro: "Kup Pro",
    login: "Zaloguj",
    logout: "Wyloguj",
    language: "Język",
    telemetry: "Telemetria",
    estPower: "Moc (W)",
    perfScore: "Wynik",
    auraStudio: "Aura Studio",
    globalSync: "Globalna Synch.",
    linkZones: "Połącz wszystkie strefy",
    masterColor: "Kolor Główny",
    individualZones: "Pojedyncze strefy",
    saveCapture: "Zapisz",
    selectComponent: "Wybierz komponent",
    equipped: "Zainstalowano",
    equip: "Zainstaluj",
    compatIssue: "Problem ze zgodnością",
    temp: "Temperatura"
  },
  es: {
    configTitle: "Configuración",
    rgbLabel: "Brillo RGB",
    baseColorLabel: "Color Base",
    searchPlaceholder: "Buscar componentes...",
    lowestPrice: "Precio más bajo",
    highestPrice: "Precio más alto",
    az: "A-Z",
    removePart: "Quitar componente",
    equipPart: "Equipar",
    cart: "Carrito",
    admin: "Acceso Admin",
    back: "← VOLVER",
    all: "Todo",
    loading: "Cargando modelos 3D...",
    clearBase: "Restablecer Base",
    clearRgb: "Apagar RGB",
    enterConfig: "Entrar al Configurador",
    slide1Title: "Visualización 3D en tiempo real",
    slide1Sub: "Experimenta cada ángulo.",
    slide1Desc: "Construye e inspecciona tu estación de trabajo soñada en un entorno 3D interactivo.",
    slide2Title: "Personalización RGB",
    slide2Sub: "Control de iluminación absoluto.",
    slide2Desc: "Ajusta el brillo y los materiales de piezas individuales. La iluminación realista hace que tu PC sea único.",
    slide3Title: "Componentes Premium",
    slide3Sub: "Solo el mejor hardware.",
    slide3Desc: "Cambia instantáneamente entre GPUs, CPUs y refrigeración para encontrar la sinergia perfecta.",
    equipToSlot: "Equipar en",
    removeFromSlot: "Quitar de",
    availableSlots: "Soportes de ventilador disp.",
    clickToFocus: "Haz clic en una pieza 3D para editar",
    workbench: "Taller",
    loadout: "Equipo",
    catalog: "Catálogo",
    goPro: "Ir a Pro",
    login: "Iniciar",
    logout: "Salir",
    language: "Idioma",
    telemetry: "Telemetría",
    estPower: "Poder Est.",
    perfScore: "Puntuación",
    auraStudio: "Estudio Aura",
    globalSync: "Sinc. Global",
    linkZones: "Vincular zonas",
    masterColor: "Color Maestro",
    individualZones: "Zonas Indiv.",
    saveCapture: "Guardar",
    selectComponent: "Seleccionar",
    equipped: "Equipado",
    equip: "Equipar",
    compatIssue: "Problema de compatibilidad",
    temp: "Temperatura"
  },
  fr: {
    configTitle: "Configuration",
    rgbLabel: "Éclairage RGB",
    baseColorLabel: "Couleur de base",
    searchPlaceholder: "Rechercher...",
    lowestPrice: "Prix le plus bas",
    highestPrice: "Prix le plus élevé",
    az: "A-Z",
    removePart: "Retirer le composant",
    equipPart: "Équiper",
    cart: "Panier",
    admin: "Connexion Admin",
    back: "← RETOUR",
    all: "Tout",
    loading: "Chargement des modèles 3D...",
    clearBase: "Réinitialiser",
    clearRgb: "Éteindre RGB",
    enterConfig: "Entrer dans le configurateur",
    slide1Title: "Visualisation 3D en temps réel",
    slide1Sub: "Découvrez chaque angle.",
    slide1Desc: "Construisez et inspectez votre station de travail de rêve dans un environnement 3D interactif.",
    slide2Title: "Personnalisation RGB",
    slide2Sub: "Contrôle absolu de l'éclairage.",
    slide2Desc: "Ajustez la lueur et les matériaux de chaque pièce. L'éclairage réaliste rend votre PC unique.",
    slide3Title: "Composants Premium",
    slide3Sub: "Le meilleur matériel.",
    slide3Desc: "Basculez instantanément entre les GPU, CPU et systèmes de refroidissement.",
    equipToSlot: "Équiper sur",
    removeFromSlot: "Retirer de",
    availableSlots: "Emplacements ventilateurs",
    clickToFocus: "Cliquez sur une pièce 3D pour éditer",
    workbench: "Atelier",
    loadout: "Équipement",
    catalog: "Catalogue",
    goPro: "Devenir Pro",
    login: "Connexion",
    logout: "Déconnexion",
    language: "Langue",
    telemetry: "Télémétrie",
    estPower: "Puissance",
    perfScore: "Score",
    auraStudio: "Aura Studio",
    globalSync: "Synch. Globale",
    linkZones: "Lier les zones",
    masterColor: "Couleur Principale",
    individualZones: "Zones Indiv.",
    saveCapture: "Enregistrer",
    selectComponent: "Sélectionner",
    equipped: "Équipé",
    equip: "Équiper",
    compatIssue: "Problème de compatibilité",
    temp: "Température"
  },
  de: {
    configTitle: "Konfiguration",
    rgbLabel: "RGB Beleuchtung",
    baseColorLabel: "Grundfarbe",
    searchPlaceholder: "Komponenten suchen...",
    lowestPrice: "Niedrigster Preis",
    highestPrice: "Höchster Preis",
    az: "A-Z",
    removePart: "Komponente entfernen",
    equipPart: "Ausrüsten",
    cart: "Warenkorb",
    admin: "Admin Login",
    back: "← ZURÜCK",
    all: "Alle",
    loading: "Lade 3D-Modelle...",
    clearBase: "Farbe zurücksetzen",
    clearRgb: "RGB ausschalten",
    enterConfig: "Konfigurator starten",
    slide1Title: "Echtzeit 3D-Visualisierung",
    slide1Sub: "Erlebe jeden Winkel.",
    slide1Desc: "Baue und betrachte deine Traum-Workstation in einer interaktiven 3D-Umgebung.",
    slide2Title: "RGB Anpassung",
    slide2Sub: "Absolute Lichtsteuerung.",
    slide2Desc: "Passe das Leuchten und die Materialien einzelner Teile an.",
    slide3Title: "Premium Komponenten",
    slide3Sub: "Nur die beste Hardware.",
    slide3Desc: "Wechsle sofort zwischen GPUs, CPUs und Kühlsystemen.",
    equipToSlot: "Ausrüsten auf",
    removeFromSlot: "Entfernen von",
    availableSlots: "Verfügbare Lüfterplätze",
    clickToFocus: "Klicke auf ein 3D-Teil zum Bearbeiten",
    workbench: "Werkstatt",
    loadout: "Ausrüstung",
    catalog: "Katalog",
    goPro: "Pro werden",
    login: "Anmelden",
    logout: "Abmelden",
    language: "Sprache",
    telemetry: "Telemetrie",
    estPower: "Leistung",
    perfScore: "Leistungspunkt",
    auraStudio: "Aura Studio",
    globalSync: "Globale Synch.",
    linkZones: "Zonen verbinden",
    masterColor: "Hauptfarbe",
    individualZones: "Einzelne Zonen",
    saveCapture: "Speichern",
    selectComponent: "Auswählen",
    equipped: "Ausgerüstet",
    equip: "Ausrüsten",
    compatIssue: "Kompatibilitätsproblem",
    temp: "Temperatur"
  }
};

// Merged Seed Data with 3D Transforms and Validation Metrics
// Merged Seed Data with 3D Transforms and Validation Metrics
// frontend/src/store/useStore.js (Replace initialCatalog and calculateCompatibility)

const initialCatalog = [
  // --- CASES (Holding absolute truth for PSU/SSD placements & scales) ---
  { 
    id: 'case-h510', name: 'NZXT H510 Flow', brand: 'NZXT', type: 'Case', price: 109, performanceScore: 0, powerDraw: 0, 
    compatibility: { formFactor: ['ATX', 'mATX', 'ITX'], maxGpuLengthMm: 381 },image: '/parts/case-h510.png', modelUrl: '/models/case-nzxt.glb', 
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }, 
    ssdSlot: { pos: [1.14, -0.60, -0.99], rot: [1.58, -1.57, 0], scale: [0.15, 0.15, 0.15] },
    psuSlot: { pos: [-1.44, -1.83, 0.09], rot: [0, 20.41, 0], scale: [11.70, 11.70, 11.70] },
    fanSlots: { 
      "Rear": { pos: [-2.12, 1.28, 0.30], rot: [0, 1.60, 0] }, 
      "Top": { pos: [-0.98, 2.18, 0.03], rot: [1.57, 0, 0] }, 
      "Front-1": { pos: [2.07, 1.13, 0.11], rot: [0, 1.55, 0] }, 
      "Front-2": { pos: [2.07, -0.43, 0.08], rot: [0, 1.55, 0] } 
    } 
  },
  { 
    id: 'case-q300l', name: 'Cooler Master Q300L', brand: 'CoolerMaster', type: 'Case', price: 45, performanceScore: 0, powerDraw: 0, 
    compatibility: { formFactor: ['mATX', 'ITX'], maxGpuLengthMm: 360 },image: '/parts/case-q300l.png', modelUrl: '/models/case-cm.glb', 
    transform: { position: [-0.51, 0.13, -0.03], rotation: [0, 0, 0], scale: [1.02, 1.02, 1.02] }, 
    ssdSlot: { pos: [0.79, -0.23, -0.79], rot: [1.58, -1.57, 0], scale: [0.15, 0.15, 0.15] },
    psuSlot: { pos: [-1.72, -1.60, -0.08], rot: [0, 20.41, 3.14], scale: [10.61, 10.61, 10.61] },
    fanSlots: { 
      "Rear": { pos: [-2.33, 1.28, 0.27], rot: [0, 1.60, 0] }, 
      "Top-1": { pos: [-1.29, 2.22, 0.23], rot: [1.57, 0, 0] },
      "Top-2": { pos: [0.21, 2.22, 0.23], rot: [1.57, 0, 0] },
      "Front-1": { pos: [1.30, 1.46, 0.09], rot: [0, 1.56, 0] },
      "Front-2": { pos: [1.30, 0.22, 0.09], rot: [0, 1.56, 0] },
      "Front-3": { pos: [1.30, -1.04, 0.09], rot: [0, 1.56, 0] }
    } 
  },
  
  // --- MOTHERBOARDS ---
  { id: 'mb-b450', name: 'MSI B450 TOMAHAWK MAX', brand: 'MSI', type: 'Motherboard', price: 114, performanceScore: 5, powerDraw: 35, compatibility: { socket: 'AM4', formFactor: 'ATX', ramType: 'DDR4' }, description: 'Сокет: AM4 | Пам\'ять: DDR4. Підтримує процесори AMD Ryzen 3000, 4000 та 5000 серій.',modelUrl: '/models/mobo-msi.glb', transform: { position: [-1.03, 0.56, -0.61], rotation: [0, 0, 0], scale: [0.98, 0.98, 0.98] } },
  { id: 'mb-z790', name: 'MSI MAG Z790 TOMAHAWK', brand: 'MSI', type: 'Motherboard', price: 259, performanceScore: 10, powerDraw: 45, compatibility: { socket: 'LGA1700', formFactor: 'ATX', ramType: 'DDR5' },description: 'Сокет: LGA1700 | Пам\'ять: DDR5. Топова плата для процесорів Intel Core 12, 13 та 14 поколінь.', modelUrl: '/models/mobo-msi.glb', transform: { position: [-1.03, 0.56, -0.61], rotation: [0, 0, 0], scale: [0.98, 0.98, 0.98] } },
  { id: 'mb-b650', name: 'ASUS ROG Strix B650-A', brand: 'ASUS', type: 'Motherboard', price: 219, performanceScore: 10, powerDraw: 40, compatibility: { socket: 'AM5', formFactor: 'ATX', ramType: 'DDR5' },description: 'Сокет: AM5 | Пам\'ять: DDR5. Сучасна плата для процесорів серії AMD Ryzen 7000 та 9000.', modelUrl: '/models/mobo-asus.glb', transform: { position: [-1.08, 0.64, -0.64], rotation: [0, 0, 0], scale: [0.11, 0.11, 0.11] } },

  // --- CPUS ---
  { id: 'cpu-3600', name: 'AMD Ryzen 5 3600', brand: 'AMD', type: 'CPU', price: 89, performanceScore: 35, powerDraw: 65, compatibility: { socket: 'AM4' },description: 'Сокет: AM3. Чудовий 4-ядерний процесор для бюджетних збірок.', modelUrl: '/models/cpu-amd.glb', transform: { position: [-0.88, 1.17, -0.78], rotation: [1.57, 4.71, 0], scale: [0.02, 0.02, 0.02] } },
  { id: 'cpu-7800x3d', name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', type: 'CPU', price: 399, performanceScore: 100, powerDraw: 120, compatibility: { socket: 'AM5' },description: 'Сокет: AM4. Чудовий 6-ядерний процесор для бюджетних збірок.', modelUrl: '/models/cpu-amd.glb', transform: { position: [-0.88, 1.17, -0.78], rotation: [1.57, 4.71, 0], scale: [0.02, 0.02, 0.02] } },
  { id: 'cpu-13600k', name: 'Intel Core i5-13600K', brand: 'Intel', type: 'CPU', price: 299, performanceScore: 85, powerDraw: 181, compatibility: { socket: 'LGA1700' },description: 'Сокет: AM5. Найкращий ігровий процесор у світі завдяки технології 3D V-Cache.', modelUrl: '/models/cpu-intel.glb', transform: { position: [-0.88, 1.18, -0.75], rotation: [1.55, -0.02, 0], scale: [0.23, 0.23, 0.23] } },
  { id: 'cpu-14900k', name: 'Intel Core i9-14900K', brand: 'Intel', type: 'CPU', price: 589, performanceScore: 98, powerDraw: 253, compatibility: { socket: 'LGA1700' },description: 'Сокет: LGA1700. Потужний універсальний процесор для ігор та рендеру.', modelUrl: '/models/cpu-intel.glb', transform: { position: [-0.88, 1.18, -0.75], rotation: [1.55, -0.02, 0], scale: [0.23, 0.23, 0.23] } },

  // --- GPUS ---
  { id: 'gpu-1660s', name: 'NVIDIA GTX 1660 SUPER', brand: 'NVIDIA', type: 'GPU', price: 169, performanceScore: 22, powerDraw: 125, compatibility: { lengthMm: 235 }, modelUrl: '/models/gpu-standard.glb', transform: { position: [-1.26, 0.15, -0.28], rotation: [3.13, 6.28, 0], scale: [0.48, 0.48, 0.48] } },
  { id: 'gpu-4070s', name: 'NVIDIA RTX 4070 SUPER', brand: 'NVIDIA', type: 'GPU', price: 599, performanceScore: 68, powerDraw: 220, compatibility: { lengthMm: 267 }, modelUrl: '/models/gpu-massive.glb', transform: { position: [-0.79, 0.04, -0.22], rotation: [4.72, 3.14, 0], scale: [0.65, 0.65, 0.65] } },
  { id: 'gpu-5090', name: 'NVIDIA RTX 5090 FE', brand: 'NVIDIA', type: 'GPU', price: 1999, performanceScore: 130, powerDraw: 600, compatibility: { lengthMm: 310 }, modelUrl: '/models/gpu-massive.glb', transform: { position: [-0.79, 0.04, -0.22], rotation: [4.72, 3.14, 0], scale: [0.65, 0.65, 0.65] } },

  // --- RAM ---
  { 
    id: 'ram-ddr4-2', name: 'G.Skill Trident Z RGB DDR4 2x8GB', brand: 'G.Skill', type: 'RAM', price: 55, performanceScore: 5, powerDraw: 8, compatibility: { ramType: 'DDR4' }, modelUrl: '/models/ram-gskill.glb', 
    transforms: [
      { position: [-0.10, 1.17, -0.59], rotation: [0, -1.80, -1.57], scale: [0.19, 0.19, 0.19] }, 
      { position: [-0.31, 1.17, -0.59], rotation: [0, -1.80, -1.57], scale: [0.19, 0.19, 0.19] }
    ] 
  },
  { 
    id: 'ram-ddr5-2', name: 'Corsair Vengeance RGB DDR5 2x16GB', brand: 'Corsair', type: 'RAM', price: 115, performanceScore: 10, powerDraw: 10, compatibility: { ramType: 'DDR5' }, modelUrl: '/models/ram-corsair.glb', 
    transforms: [
      { position: [-0.31, 1.19, -0.58], rotation: [1.56, -3.14, 0.03], scale: [2.28, 2.28, 2.28] }, 
      { position: [-0.10, 1.19, -0.58], rotation: [1.56, -3.14, 0.03], scale: [2.28, 2.28, 2.28] }
    ] 
  },

  // --- PSUs & SSDs (Dummy transforms, PCModel overrides them automatically with activeCase slots) ---
  { id: 'psu-550', name: 'EVGA SuperNOVA 550W', brand: 'EVGA', type: 'PSU', price: 79, performanceScore: 0, powerDraw: 0, compatibility: { wattage: 550 }, modelUrl: '/models/psu-evga.glb', transform: { position: [0,0,0], rotation: [0,0,0], scale: [1,1,1] } },
  { id: 'psu-1000', name: 'EVGA SuperNOVA 1000W', brand: 'EVGA', type: 'PSU', price: 169, performanceScore: 0, powerDraw: 0, compatibility: { wattage: 1000 }, modelUrl: '/models/psu-evga.glb', transform: { position: [0,0,0], rotation: [0,0,0], scale: [1,1,1] } },
  { id: 'ssd-1000', name: 'WD Blue SN570 1TB', brand: 'WD', type: 'SSD', price: 55, performanceScore: 5, powerDraw: 5, modelUrl: '/models/ssd-nvme.glb', transform: { position: [0,0,0], rotation: [0,0,0], scale: [1,1,1] } },
  { id: 'ssd-2000', name: 'Samsung 990 PRO 2TB', brand: 'Samsung', type: 'SSD', price: 169, performanceScore: 15, powerDraw: 8, modelUrl: '/models/ssd-nvme.glb', transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] } },

  // --- CASE FANS (Store native scale here, pos/rot come from case) ---
  { id: 'fan-lianli', name: 'Lian Li UNI FAN SL120', brand: 'Lian Li', type: 'CaseFans', price: 29, performanceScore: 0, powerDraw: 5, modelUrl: '/models/fan-rgb.glb', transform: { position: [0,0,0], rotation: [0,0,0], scale: [0.50, 0.50, 0.50] } },
  { id: 'fan-arctic', name: 'Arctic P12 PWM', brand: 'Arctic', type: 'CaseFans', price: 10, performanceScore: 0, powerDraw: 2, modelUrl: '/models/fan-standard.glb', transform: { position: [0,0,0], rotation: [0,0,0], scale: [5.77, 5.77, 5.77] } }
];


// ==========================================
// 3. РУШІЙ СУМІСНОСТІ ТА ТЕЛЕМЕТРІЇ
// ==========================================
const calculateCompatibility = (selectedParts, catalog) => {
  const issues = [];
  let totalWattage = 0;
  let cpuPower = 0;
  let gpuPower = 0;

  const getPart = (id) => catalog.find(p => p.id === id);

  const cpu = getPart(selectedParts.CPU);
  const mobo = getPart(selectedParts.Motherboard);
  const gpu = getPart(selectedParts.GPU);
  const pcCase = getPart(selectedParts.Case);
  const psu = getPart(selectedParts.PSU);
  const ram = getPart(selectedParts.RAM);
  const ssd = getPart(selectedParts.SSD);

  // Підрахунок ватт із розбивкою
  Object.entries(selectedParts).forEach(([key, val]) => {
    if (val && typeof val === 'string') {
      const part = getPart(val);
      if (part) {
        totalWattage += (part.powerDraw || 0);
        if (key === 'CPU') cpuPower += (part.powerDraw || 0);
        if (key === 'GPU') gpuPower += (part.powerDraw || 0);
      }
    }
  });
  const otherPower = totalWattage - cpuPower - gpuPower;

  // Перевірки на сумісність (Тепер з ПІДКАЗКАМИ)
  if (cpu && mobo && cpu.compatibility?.socket !== mobo.compatibility?.socket) {
    issues.push({
      text: `Socket Mismatch: ${cpu.name} (${cpu.compatibility?.socket}) won't fit the ${mobo.name} (${mobo.compatibility?.socket}).`,
      hint: "Змініть материнську плату або процесор, щоб їхні сокети збігалися."
    });
  }
  if (ram && mobo && ram.compatibility?.ramType !== mobo.compatibility?.ramType) {
    issues.push({
      text: `RAM Mismatch: The ${mobo.name} requires ${mobo.compatibility?.ramType} memory.`,
      hint: `Вам потрібно обрати оперативну пам'ять типу ${mobo.compatibility?.ramType}.`
    });
  }
  if (gpu && pcCase && gpu.compatibility?.lengthMm > pcCase.compatibility?.maxGpuLengthMm) {
    issues.push({
      text: `Clearance Issue: The ${gpu.name} (${gpu.compatibility?.lengthMm}mm) is too long for the ${pcCase.name}.`,
      hint: "Оберіть більш просторий корпус або коротшу відеокарту."
    });
  }
  if (psu && totalWattage > (psu.compatibility?.wattage || 0) * 0.9) {
    issues.push({
      text: `Power Warning: The ${psu.name} may shut down under heavy gaming loads.`,
      hint: `Оберіть блок живлення щонайменше на ${Math.ceil(totalWattage * 1.2 / 50) * 50}W для стабільної роботи.`
    });
  }

  // Логіка включення
  const isBootable = cpu && mobo;
  const isFullyBuilt = cpu && gpu && mobo && ram && psu && ssd;
  
  let overallScore = 0;
  let workloadScore = 0; // Нова оцінка для рендеру/роботи
  let bottleneckAlert = null;
  let fps = { cs2: 0, cyberpunk: 0, warzone: 0, gta: 0 };

  if (isBootable) {
    const cpuScore = cpu.performanceScore || 0;
    const gpuScore = gpu ? gpu.performanceScore : 10;
    const ramScore = ram ? ram.performanceScore : 0;
    const moboScore = mobo.performanceScore || 0;

    let effectiveGamingScore = 0;
    
    // Bottleneck логіка (З ПІДКАЗКАМИ)
    if (gpu && cpuScore - gpuScore > 25) {
      bottleneckAlert = {
        text: `GPU Bottleneck: Your ${cpu.name} is severely held back by the ${gpu.name}.`,
        hint: "Відеокарта занадто слабка. Оновіть GPU, щоб розкрити потенціал процесора."
      };
      effectiveGamingScore = gpuScore + (cpuScore * 0.1); 
    } else if (gpu && gpuScore - cpuScore > 25) {
      bottleneckAlert = {
        text: `CPU Bottleneck: Your ${gpu.name} is too powerful for the ${cpu.name}.`,
        hint: "Процесор не встигає за відеокартою. Оновіть CPU для уникнення підгальмовувань (статерів)."
      };
      effectiveGamingScore = cpuScore + (gpuScore * 0.15); 
    } else {
      effectiveGamingScore = (cpuScore * 0.4) + (gpuScore * 0.6); 
    }

    overallScore = Math.min(100, Math.round(effectiveGamingScore + ramScore + moboScore));
    // Оцінка робочих завдань сильно залежить від процесора та оперативки
    workloadScore = Math.min(100, Math.round((cpuScore * 0.7) + (ramScore * 1.5) + (gpuScore * 0.2)));

    fps.cs2 = Math.floor(80 + (cpuScore * 4.0) + (gpuScore * 1.0));
    fps.cyberpunk = Math.floor(15 + (gpuScore * 1.2) + (cpuScore * 0.2));
    fps.warzone = Math.floor(40 + (cpuScore * 0.8) + (gpuScore * 1.0));
    fps.gta = Math.floor(60 + (cpuScore * 1.5) + (gpuScore * 0.5));
  }

  const baseTemp = 35;
  const heatAdded = totalWattage * 0.055; 
  const estimatedTemp = isBootable ? Math.max(35, Math.round(baseTemp + heatAdded - 20)) : 25; 

  return {
    compatibilityIssues: issues,
    isFullyBuilt,
    systemStats: { 
      totalWattage, 
      powerBreakdown: { cpu: cpuPower, gpu: gpuPower, other: otherPower }, // Додали деталізацію ватт
      performanceScore: overallScore, 
      workloadScore, // Додали оцінку роботи
      estimatedTemp, 
      bottleneckAlert, 
      fps 
    }
  };
};

// --- THE COMPATIBILITY ENGINE ---


// --- THE ZUSTAND STORE ---
export const useStore = create(
  persist(
    (set, get) => ({
      // Core Data
      catalog: initialCatalog,
      searchQuery: '',
      sortOption: 'price-asc',
      categoryFilter: 'All',

      // ==========================================
      // НОВИЙ БЛОК: КОЛЬОРИ ТА ПІДСВІТКА (AURA STUDIO)
      // ==========================================
      
      // 1. Головний вимикач світла
      rgbEnabled: true,
      toggleRgbEnabled: (val) => set({ rgbEnabled: val }),

      // 2. Глобальне RGB (Світіння)
      rgbSync: false,
      toggleRgbSync: (val) => set({ rgbSync: val }),
      globalRgbColor: '#00d8ff',
      setGlobalRgbColor: (color) => set({ globalRgbColor: color }),

      // 3. Глобальний базовий колір (Пластик/Метал)
      baseSync: false,
      toggleBaseSync: (val) => set({ baseSync: val }),
      globalBaseColor: '#ffffff',
      setGlobalBaseColor: (color) => set({ globalBaseColor: color }),

      // 4. Індивідуальні кольори деталей
    partColors: {
        CaseFans: { base: '#1a1a1a', rgb: '#00d8ff' },
        RAM: { base: '#000000', rgb: '#00d8ff' },
        GPU: { base: '#333333', rgb: '#00d8ff' },
        Motherboard: { base: '#222222', rgb: '#00d8ff' }
      },
      setPartColor: (partType, colorType, color) => set((state) => ({
        partColors: {
          ...state.partColors,
          [partType]: {
            ...(state.partColors[partType] || { base: '#ffffff', rgb: '#000000' }),
            [colorType]: color
          }
        }
      })),
      // ==========================================
      // НОВА ФУНКЦІЯ: Скидання всіх кольорів до заводських (ОРИГІНАЛЬНИХ)
      resetColors: () => set({
        rgbEnabled: true,
        rgbSync: false,
        baseSync: false,
        globalRgbColor: '#00d8ff', // Залишаємо для палітри
        globalBaseColor: '#ffffff', // Залишаємо для палітри
        partColors: {} // ПОРОЖНІЙ ОБ'ЄКТ = МОДЕЛЬ ВИКОРИСТОВУЄ ОРИГІНАЛЬНІ ТЕКСТУРИ!
      }),
      // App Preferences
      viewerBg: 'dark',
      language: 'en', 
      savedBuilds: [],
      
      // UI Overlays
      ui: { loginOpen: false, registerOpen: false, drawerOpen: false, saveOpen: false },
      
      // Validation & Analytics Outputs
      compatibilityIssues: [],
      systemStats: { totalWattage: 0, performanceScore: 0 },

      // Initial safe configuration based on our seed data
      selectedParts: {
        Case: 'case-h510', Motherboard: 'mb-b650', CPU: 'cpu-7800x3d', GPU: 'gpu-4070s',
        RAM: 'ram-ddr5-2', PSU: 'psu-750', SSD: 'ssd-1000', CaseFans: { "Rear": 'fan-lianli', "Top": null, "Front-1": null, "Front-2": null }
      },
      focusedPartType: null,
      isOfficialBuild: false,

      // ==========================================
      // Логіка перемикання екранів та скидання
      // ==========================================
      currentView: 'home', 
      setCurrentView: (view) => set({ currentView: view }),
      
      currentBuildId: null,

// Скидання збірки до пустого стану
  resetBuild: () => set({
    currentBuildId: null,
    selectedParts: { Case: null, Motherboard: null, CPU: null, GPU: null, RAM: null, PSU: null, SSD: null, CaseFans: {} },
    systemStats: null,
    compatibilityIssues: [],
    isFullyBuilt: false,
    isOfficialBuild: false,
    partColors: {} // скидаємо кольори RGB
  }),

   loadConfiguration: (savedConfig, isOfficial = false) => set((state) => {
        const safeSelectedParts = savedConfig.selectedParts || savedConfig.parts || {};
        const safePartColors = isOfficial ? {} : (savedConfig.partColors || savedConfig.colors || {});
        
        const engineResults = calculateCompatibility(safeSelectedParts, state.catalog);
        const buildId = savedConfig._id || savedConfig.id;

        console.log("📂 [LOAD] Завантажено збірку ID:", buildId, "Офіційна:", isOfficial);

        return {
          currentBuildId: buildId ? String(buildId) : null,
          isOfficialBuild: isOfficial,
          selectedParts: safeSelectedParts,
          partColors: safePartColors,
          
          // ФІКС: Якщо це офіційна збірка, вмикаємо стандартне світло. 
          // Якщо кастомна - дістаємо налаштування з бази (або ставимо дефолт, якщо їх там ще немає)
          rgbEnabled: isOfficial ? true : (savedConfig.rgbEnabled !== undefined ? savedConfig.rgbEnabled : true),
          rgbSync: isOfficial ? false : (savedConfig.rgbSync || false),
          baseSync: isOfficial ? false : (savedConfig.baseSync || false),
          globalRgbColor: isOfficial ? '#00e5ff' : (savedConfig.globalRgbColor || '#00e5ff'),
          globalBaseColor: isOfficial ? '#ffffff' : (savedConfig.globalBaseColor || '#ffffff'),
          
          ...engineResults
        };
      }),

      // НОВЕ: Функція для збереження поточної збірки
      // НОВЕ: Функція для збереження поточної збірки
// Функція для збереження НОВОЇ збірки
// Функція для збереження НОВОЇ збірки з перевіркою лімітів
      saveCurrentBuild: (buildName, userTier = 'user') => set((state) => {
        // 1. Встановлюємо ліміти
        const MAX_SAVES = {
          user: 1,
          pro: 5,
          elite: Infinity
        };

        const limit = MAX_SAVES[userTier] || 1;
        const currentSavesCount = state.savedBuilds ? state.savedBuilds.length : 0;

        // 2. Перевіряємо, чи не перевищено ліміт
        if (currentSavesCount >= limit) {
          // Замість збереження просто повертаємо помилку в UI
          set((state) => ({ ui: { ...state.ui, saveError: `Ліміт вичерпано. Ваша підписка дозволяє ${limit} збережень.` } }));
          return state; 
        }

        console.log("🔴 [SAVE START] Створення нової збірки");
        
        const newBuild = {
          id: String(Date.now()),
          name: buildName || 'My Custom Build',
          date: new Date().toLocaleDateString(),
          selectedParts: { ...state.selectedParts },
          partColors: { ...state.partColors },
          systemStats: { ...state.systemStats }
        };
        
        const updatedSavedBuilds = [...(state.savedBuilds || []), newBuild];
        
        return {
          savedBuilds: updatedSavedBuilds,
          currentBuildId: newBuild.id,
          ui: { ...state.ui, saveOpen: false, saveError: null } // Закриваємо модалку при успіху
        };
      }),

      updateCurrentBuild: () => set((state) => {
        console.log("🔄 [UPDATE START] Спроба оновити збірку ID:", state.currentBuildId);
        
        if (!state.currentBuildId) {
          console.error("❌ [UPDATE ERROR] Немає currentBuildId. Збереження скасовано.");
          return state;
        }
        
        let found = false;
        const updatedBuilds = state.savedBuilds.map(build => {
          if (String(build.id) === String(state.currentBuildId)) {
            found = true;
            return {
              ...build,
              date: new Date().toLocaleDateString(),
              selectedParts: { ...state.selectedParts },
              partColors: { ...state.partColors },
              systemStats: { ...state.systemStats }
            };
          }
          return build;
        });

        // ФІКС: Якщо збірка прийшла з бекенду (MongoDB), її ще немає в локальному масиві браузера.
        // Замість помилки, ми просто додаємо її сюди, щоб вона збереглася!
        if (!found) {
          console.log("⚠️ [UPDATE] Збірка з БД. Додаємо її в локальний масив!");
          updatedBuilds.push({
            id: String(state.currentBuildId),
            name: "Cloud Configuration", // Назва для збережених з БД збірок
            date: new Date().toLocaleDateString(),
            selectedParts: { ...state.selectedParts },
            partColors: { ...state.partColors },
            systemStats: { ...state.systemStats }
          });
        } else {
          console.log("✅ [UPDATE SUCCESS] Збірку успішно перезаписано!");
        }

        return { savedBuilds: updatedBuilds };
      }),
      // --- ACTIONS ---
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortOption: (option) => set({ sortOption: option }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
      setViewerBg: (bg) => set({ viewerBg: bg }),
      setLanguage: (lang) => set({ language: lang }),
      setUi: (modal, isOpen) => set((state) => ({ ui: { ...state.ui, [modal]: isOpen } })),
      setFocusedPartType: (type) => set({ focusedPartType: type }),
      
      setPartColor: (partType, colorType, color) => set((state) => ({
        partColors: {
          ...state.partColors,
          [partType]: {
            ...(state.partColors[partType] || { base: '#ffffff', rgb: '#000000' }),
            [colorType]: color
          }
        }
      })),

      equipPart: (type, partId) => set((state) => {
        const isAlreadyEquipped = state.selectedParts[type] === partId;
        const newSelectedParts = { 
          ...state.selectedParts, 
          [type]: isAlreadyEquipped ? null : partId 
        };
        
        const engineResults = calculateCompatibility(newSelectedParts, state.catalog);
        
        return {
          selectedParts: newSelectedParts,
          ...engineResults
        };
      }),

      setFanInSlot: (slotName, fanId) => set((state) => {
        const newSelectedParts = {
          ...state.selectedParts,
          CaseFans: {
            ...state.selectedParts.CaseFans,
            [slotName]: state.selectedParts.CaseFans[slotName] === fanId ? null : fanId
          }
        };

        const engineResults = calculateCompatibility(newSelectedParts, state.catalog);

        return {
          selectedParts: newSelectedParts,
          ...engineResults
        };
      }),

    }), // <--- ТУТ ЗАКІНЧУЄТЬСЯ ОБ'ЄКТ СТЕЙТУ
    
    // <--- ТУТ ПОЧИНАЮТЬСЯ НАЛАШТУВАННЯ ЗБЕРЕЖЕННЯ (persist)
    {
      name: 'workstation-builder-storage', 
      partialize: (state) => ({
        savedBuilds: state.savedBuilds,
        viewerBg: state.viewerBg,
        language: state.language,
        globalRgbColor: state.globalRgbColor,
        rgbSync: state.rgbSync,
      }),
    }
  ) // <--- ЗАКРИВАЄТЬСЯ ПЕРСИСТ
);

// Перший прорахунок при старті додатку
useStore.setState((state) => calculateCompatibility(state.selectedParts, state.catalog));