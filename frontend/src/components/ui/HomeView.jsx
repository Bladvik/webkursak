// frontend/src/components/ui/HomeView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Layers, ChevronRight, HelpCircle,
  Globe, Target, Crosshair, PlayCircle, ArrowRight, CheckSquare,
  LogOut, Palette, Activity, Camera, DollarSign, Zap, Star, Award,
  Monitor, Server, HardDrive, Crown, CheckCircle2
} from 'lucide-react';
import { OFFICIAL_BLUEPRINTS } from '../../store/useStore';

// --- DEEP TRANSLATION DICTIONARY ---
const translations = {
  en: {
    nav_how: "How to Build", nav_rigs: "Featured Rigs", nav_parts: "Top Parts", nav_features: "Features", nav_pricing: "Pricing",
    nav_login: "Login", nav_init: "Initialize", nav_workbench: "Workbench", nav_logout: "Logout",
    hero_badge: "Smart Assistant Active", hero_title1: "Architect Your Setup.", hero_title2: "Validate The Numbers.",
    hero_desc: "You don't need to be an expert to build a perfect PC. Our intelligent diagnostic environment acts as your personal hardware assistant.",
    hero_btn_enter: "Enter Configurator", hero_btn_how: "How it Works",
    stat1_val: "Beta V1.0", stat1_lbl: "Platform Status", stat2_val: "100%", stat2_lbl: "Curated Hardware",
    stat3_val: "Real-Time", stat3_lbl: "Algorithmic Checks", stat4_val: "98%", stat4_lbl: "Accuracy",
    tutorial_title: "How to Build Your Dream PC", tutorial_desc: "Our visual platform makes assembling your rig as easy as playing a game.",
    step1_title: "Select Your Canvas", step1_desc: "Start by choosing a case. The system limits parts to those that physically fit.",
    step2_title: "Snap in Components", step2_desc: "Equip your CPU, RAM, and storage. Watch them assemble in real-time 3D.",
    step3_title: "Consult the Assistant", step3_desc: "Our tool analyzes wattage, bottlenecks, and simulates thermals.",
    tutorial_btn: "Try Configurator", tut_media_note: "Media placeholder",
    rigs_title: "Featured Blueprints", rigs_desc: "Validated, bottleneck-free setups.", rigs_btn_load: "Load in Editor",
    rig1_title: "Enthusiast Blueprint", rig1_desc: "Uncompromising 4K performance for the elite gamer and 3D professional. Features a flagship processor paired with the ultimate GPU for maximum frame rates in ray-traced titles, all housed in a premium chassis with advanced cooling.", rig1_tag: "Ultra 4K",
    rig2_title: "Mid-Tier Sweet Spot", rig2_desc: "The perfect balance of price to performance for high-refresh 1440p gaming. This build handles modern AAA titles effortlessly, utilizing smart component matching to prevent bottlenecks while keeping thermals and noise low.", rig2_tag: "1440p High",
    rig3_title: "Budget Esports King", rig3_desc: "Maximized frames for competitive shooters without breaking the bank. Designed specifically for games like CS2 and Valorant, prioritizing steady 1% lows and minimal input lag in a highly efficient form factor.", rig3_tag: "1080p Comp",
    pro_badge: "Competitive Advantage", pro_title: "Play Like The Pros.", pro_desc: "In tactical shooters, 1% low framerates dictate input latency. We model CPU-bound titles to ensure stability.", pro_btn: "Build Comp Rig",
    pricing_title: "Transparent Access", pricing_desc: "Choose the tier that fits your needs.", pricing_monthly: "Monthly", pricing_yearly: "Yearly",
    tier1_name: "Enthusiast", tier1_desc: "Perfect for single personal builds.", tier1_f1: "Full Hardware Catalog", tier1_f2: "3D Visualizer", tier1_f3: "Basic Compatibility", tier1_f4: "1 Save Slot",
    tier2_name: "Pro", tier2_desc: "For system integrators.", tier2_f1: "Aura Studio Control", tier2_f2: "Thermal Analytics", tier2_f3: "5 Save Slots",
    tier3_name: "Elite", tier3_desc: "The ultimate toolset.", tier3_f1: "Extreme Stress Testing", tier3_f2: "Unlimited Saves", tier3_f3: "Export High-Res Renders",
    btn_free: "Start Free", btn_pro: "Subscribe Pro", btn_elite: "Go Elite", recommended: "Recommended",
    feat_title: "Engineering Excellence", feat_desc: "Advanced tools designed for enthusiasts.",
    f1_title: "Aura Studio Customization", f1_desc: "Sync all RGB zones globally or customize individual components with precision.",
    f2_title: "Deep Telemetry", f2_desc: "Calculates exact wattage, thermals, and simulates 1440p gaming FPS.",
    f3_title: "Capture & Showcase", f3_desc: "Save configurations and auto-render 3D thumbnails for your dashboard.",
    f4_title: "Live Market Pricing", f4_desc: "Track total cost dynamically. Every swap updates the price instantly.",
    top_parts_title: "Top 5 Components", top_parts_desc: "The most selected and highly rated hardware by our community this month.",
    part1_name: "AMD Ryzen 7 7800X3D", part1_desc: "The undisputed king of gaming CPUs. Its massive 3D V-Cache delivers unparalleled framerates in every title.",
    part2_name: "NVIDIA RTX 4070 SUPER", part2_desc: "The 1440p sweet spot. Incredible DLSS 3 performance and power efficiency.",
    part3_name: "NZXT H510 Flow", part3_desc: "A legendary case with perfect airflow, minimalist design, and excellent cable management.",
    part4_name: "G.Skill Trident Z RGB", part4_desc: "Fast, reliable DDR5 RAM with the most beautiful, customizable RGB lightbar on the market.",
    part5_name: "Samsung 990 PRO 2TB", part5_desc: "Blistering fast NVMe speeds ensuring your OS and games load in the blink of an eye.",
    build_with_this: "Build with this"
  },
  uk: {
    nav_how: "Як збирати", nav_rigs: "Готові збірки", nav_parts: "Топ Деталі", nav_features: "Фішки", nav_pricing: "Тарифи",
    nav_login: "Увійти", nav_init: "Почати", nav_workbench: "Майстерня", nav_logout: "Вийти",
    hero_badge: "Розумний асистент", hero_title1: "Спроектуй свою систему.", hero_title2: "Перевір показники.",
    hero_desc: "Не потрібно бути експертом. Наше середовище працює як особистий асистент, виявляючи вузькі місця до покупки.",
    hero_btn_enter: "Конфігуратор", hero_btn_how: "Як це працює",
    stat1_val: "Бета V1.0", stat1_lbl: "Статус", stat2_val: "100%", stat2_lbl: "Відібране обладнання",
    stat3_val: "В реал. часі", stat3_lbl: "Перевірки", stat4_val: "98%", stat4_lbl: "Точність",
    tutorial_title: "Як зібрати ПК мрії", tutorial_desc: "Платформа робить збірку такою ж простою, як гра.",
    step1_title: "Вибери основу", step1_desc: "Система автоматично обмежить вибір тими платами, що фізично помістяться.",
    step2_title: "Додай компоненти", step2_desc: "Спостерігай за збіркою в реальному часі у 3D та налаштовуй RGB.",
    step3_title: "Розумний асистент", step3_desc: "Аналізує потужність, вузькі місця та симулює температуру.",
    tutorial_btn: "Спробувати", tut_media_note: "Анімація",
    rigs_title: "Рекомендовані збірки", rigs_desc: "Перевірені системи без вузьких місць.", rigs_btn_load: "Відкрити",
    rig1_title: "Вибір Ентузіаста", rig1_desc: "Безкомпромісна 4K продуктивність для елітних геймерів та 3D професіоналів. Оснащена флагманським процесором та топовою відеокартою для максимального FPS, у преміальному корпусі з потужним охолодженням.", rig1_tag: "Ультра 4K",
    rig2_title: "Золота Середина", rig2_desc: "Ідеальний баланс ціни та якості для гри в 1440p. Збірка легко справляється з сучасними AAA-іграми завдяки розумному підбору компонентів, що усуває вузькі місця та зберігає тишу.", rig2_tag: "1440p Високі",
    rig3_title: "Король Кіберспорту", rig3_desc: "Максимум кадрів для змагальних шутерів без зайвих витрат. Створена спеціально для ігор на кшталт CS2 та Valorant, гарантуючи стабільний 1% low FPS у компактному форматі.", rig3_tag: "1080p Кіберспорт",
    pro_badge: "Перевага", pro_title: "Грай як ПРО.", pro_desc: "Наш рушій гарантує стабільний 1% low FPS у шутерах для мінімальної затримки.", pro_btn: "Зібрати ПК",
    pricing_title: "Тарифи", pricing_desc: "Обери свій рівень доступу.", pricing_monthly: "Місяць", pricing_yearly: "Рік",
    tier1_name: "Ентузіаст", tier1_desc: "Для однієї збірки.", tier1_f1: "Каталог деталей", tier1_f2: "3D візуалізатор", tier1_f3: "Базові перевірки", tier1_f4: "1 слот збереження",
    tier2_name: "Pro", tier2_desc: "Для спеціалістів.", tier2_f1: "Керування RGB", tier2_f2: "Аналітика температур", tier2_f3: "5 слотів збереження",
    tier3_name: "Elite", tier3_desc: "Безмежні можливості.", tier3_f1: "Стрес-тести", tier3_f2: "Безліміт", tier3_f3: "Експорт рендерів",
    btn_free: "Безкоштовно", btn_pro: "Підписатися", btn_elite: "Стати Elite", recommended: "Рекомендуємо",
    feat_title: "Інженерна досконалість", feat_desc: "Передові інструменти для ентузіастів.",
    f1_title: "Aura Studio", f1_desc: "Синхронізуйте RGB глобально або налаштовуйте кожну деталь окремо.",
    f2_title: "Телеметрія", f2_desc: "Розраховує енергоспоживання, температури та симулює FPS.",
    f3_title: "Збереження", f3_desc: "Автоматичне створення 3D-рендеру вашої збірки для дашборду.",
    f4_title: "Жива ціна", f4_desc: "Кожна додана деталь миттєво оновлює загальну вартість.",
    top_parts_title: "Топ 5 Комплектуючих", top_parts_desc: "Найпопулярніше обладнання нашої спільноти.",
    part1_name: "AMD Ryzen 7 7800X3D", part1_desc: "Беззаперечний король ігрових процесорів. Величезний 3D V-Cache.",
    part2_name: "NVIDIA RTX 4070 SUPER", part2_desc: "Золота середина для 1440p з ідеальною продуктивністю DLSS 3.",
    part3_name: "NZXT H510 Flow", part3_desc: "Легендарний корпус з ідеальним охолодженням.",
    part4_name: "G.Skill Trident Z RGB", part4_desc: "Швидка пам'ять DDR5 з найкрасивішою RGB-підсвіткою.",
    part5_name: "Samsung 990 PRO 2TB", part5_desc: "Блискавична швидкість NVMe для миттєвого завантаження ігор.",
    build_with_this: "Використати це"
  },
  pl: {
    nav_how: "Jak zbudować", nav_rigs: "Gotowe zestawy", nav_parts: "Top Części", nav_features: "Funkcje", nav_pricing: "Cennik",
    nav_login: "Zaloguj", nav_init: "Rozpocznij", nav_workbench: "Warsztat", nav_logout: "Wyloguj",
    hero_badge: "Asystent Aktywny", hero_title1: "Zaprojektuj swój PC.", hero_title2: "Sprawdź liczby.",
    hero_desc: "Nie musisz być ekspertem. Nasze środowisko wykrywa wąskie gardła przed zakupem.",
    hero_btn_enter: "Konfigurator", hero_btn_how: "Jak to działa",
    stat1_val: "Beta V1.0", stat1_lbl: "Status", stat2_val: "100%", stat2_lbl: "Sprawdzony sprzęt", stat3_val: "Na żywo", stat3_lbl: "Testy", stat4_val: "98%", stat4_lbl: "Dokładność",
    tutorial_title: "Jak zbudować PC", tutorial_desc: "Montaż prosty jak w grze.", step1_title: "Wybierz bazę", step1_desc: "System dopasuje kompatybilne części.",
    step2_title: "Dodaj części", step2_desc: "Oglądaj w czasie rzeczywistym w 3D.", step3_title: "Inteligentny Asystent", step3_desc: "Analizuje moc i chłodzenie.",
    tutorial_btn: "Wypróbuj", tut_media_note: "Animacja",
    rigs_title: "Polecane Zestawy", rigs_desc: "Zoptymalizowane konfiguracje.", rigs_btn_load: "Otwórz w edytorze",
    rig1_title: "Zestaw Entuzjasty", rig1_desc: "Bezkompromisowa wydajność 4K. Posiada flagowy procesor i topową kartę graficzną do maksymalnych FPS z ray-tracingiem, zamknięte w obudowie premium.", rig1_tag: "Ultra 4K",
    rig2_title: "Złoty Środek", rig2_desc: "Idealny balans ceny do wydajności dla 1440p. Ten zestaw bez problemu radzi sobie z najnowszymi grami AAA i utrzymuje niskie temperatury.", rig2_tag: "1440p",
    rig3_title: "Król E-sportu", rig3_desc: "Maksymalne klatki w e-sporcie bez rozbijania banku. Zoptymalizowany pod kątem gier takich jak CS2 i Valorant, zapewniając stabilne FPS.", rig3_tag: "1080p",
    pro_badge: "Przewaga", pro_title: "Graj jak Pro.", pro_desc: "Nasz silnik gwarantuje stabilne FPS dla minimalnego opóźnienia.", pro_btn: "Zbuduj PC",
    pricing_title: "Cennik", pricing_desc: "Wybierz plan dla siebie.", pricing_monthly: "Miesiąc", pricing_yearly: "Rok",
    tier1_name: "Entuzjasta", tier1_desc: "Dla jednego PC.", tier1_f1: "Katalog", tier1_f2: "Grafika 3D", tier1_f3: "Kompatybilność", tier1_f4: "1 Zapis",
    tier2_name: "Pro", tier2_desc: "Dla ekspertów.", tier2_f1: "Sterowanie RGB", tier2_f2: "Analiza temperatur", tier2_f3: "5 Zapisów",
    tier3_name: "Elite", tier3_desc: "Dla profesjonalistów.", tier3_f1: "Stress-testy", tier3_f2: "Bez limitu", tier3_f3: "Eksport Renderów",
    btn_free: "Za darmo", btn_pro: "Kup Pro", btn_elite: "Elite", recommended: "Polecamy",
    feat_title: "Inżynieryjna Doskonałość", feat_desc: "Zaawansowane narzędzia dla fanów hardware'u.",
    f1_title: "Aura Studio", f1_desc: "Precyzyjna kontrola nad RGB.", f2_title: "Telemetria", f2_desc: "Symulacja FPS i mocy.",
    f3_title: "Zapis 3D", f3_desc: "Automatyczne rendery.", f4_title: "Ceny na żywo", f4_desc: "Koszty w czasie rzeczywistym.",
    top_parts_title: "Top 5 Części", top_parts_desc: "Najwyżej oceniany sprzęt w tym miesiącu.",
    part1_name: "AMD Ryzen 7 7800X3D", part1_desc: "Najlepszy procesor do gier na rynku.", part2_name: "NVIDIA RTX 4070 SUPER", part2_desc: "Złoty środek dla rozdzielczości 1440p.",
    part3_name: "NZXT H510 Flow", part3_desc: "Legendarna obudowa z idealnym przepływem powietrza.", part4_name: "G.Skill Trident Z RGB", part4_desc: "Niezawodna pamięć DDR5 z pięknym oświetleniem.",
    part5_name: "Samsung 990 PRO 2TB", part5_desc: "Ekstremalnie szybki dysk NVMe.", build_with_this: "Zbuduj z tym"
  },
  it: {
    nav_how: "Come Assemblare", nav_rigs: "Configurazioni", nav_parts: "Componenti", nav_features: "Funzioni", nav_pricing: "Prezzi",
    nav_login: "Accedi", nav_init: "Inizia", nav_workbench: "Laboratorio", nav_logout: "Esci",
    hero_badge: "Assistente Attivo", hero_title1: "Progetta il tuo setup.", hero_title2: "Valida i numeri.",
    hero_desc: "Non serve essere esperti. Il nostro ambiente diagnostico rileva i colli di bottiglia.",
    hero_btn_enter: "Configuratore", hero_btn_how: "Come Funziona",
    stat1_val: "Beta V1.0", stat1_lbl: "Stato", stat2_val: "100%", stat2_lbl: "Hardware", stat3_val: "Real-Time", stat3_lbl: "Controlli", stat4_val: "98%", stat4_lbl: "Precisione",
    tutorial_title: "Come assemblare il PC", tutorial_desc: "Semplice come un gioco.", step1_title: "Scegli la base", step1_desc: "Il sistema adatta i componenti compatibili.",
    step2_title: "Aggiungi Componenti", step2_desc: "Guarda l'assemblaggio in 3D.", step3_title: "Assistente Smart", step3_desc: "Analizza consumi e temperature.",
    tutorial_btn: "Prova Ora", tut_media_note: "Animazione",
    rigs_title: "Configurazioni in Evidenza", rigs_desc: "Setup validati.", rigs_btn_load: "Carica Editor",
    rig1_title: "Entusiasta", rig1_desc: "Prestazioni 4K senza compromessi per i gamer. Dotato del miglior processore e GPU per frame rate massimi con ray-tracing.", rig1_tag: "Ultra 4K",
    rig2_title: "Punto Ottimale", rig2_desc: "Il perfetto equilibrio qualità-prezzo per il gaming a 1440p. Gestisce facilmente i titoli AAA moderni senza surriscaldarsi.", rig2_tag: "1440p",
    rig3_title: "Re degli Esports", rig3_desc: "Frame massimizzati per sparatutto competitivi senza spendere una fortuna. Progettato per CS2 garantisce input lag minimo.", rig3_tag: "1080p",
    pro_badge: "Vantaggio", pro_title: "Gioca come i Pro.", pro_desc: "Garantiamo stabilità dei frame per latenza minima.", pro_btn: "Assembla PC",
    pricing_title: "Prezzi", pricing_desc: "Scegli il tuo piano.", pricing_monthly: "Mensile", pricing_yearly: "Annuale",
    tier1_name: "Iniziato", tier1_desc: "Per una singola build.", tier1_f1: "Catalogo hardware", tier1_f2: "Vista 3D", tier1_f3: "Compatibilità base", tier1_f4: "1 Salvataggio",
    tier2_name: "Pro", tier2_desc: "Per esperti.", tier2_f1: "Controllo RGB", tier2_f2: "Analitica termica", tier2_f3: "5 Salvataggi",
    tier3_name: "Elite", tier3_desc: "Il massimo della potenza.", tier3_f1: "Stress Test", tier3_f2: "Illimitati", tier3_f3: "Render Alta Res",
    btn_free: "Gratis", btn_pro: "Abbonati", btn_elite: "Elite", recommended: "Consigliato",
    feat_title: "Eccellenza", feat_desc: "Strumenti avanzati per appassionati.",
    f1_title: "Aura Studio", f1_desc: "Sincronizza le zone RGB.", f2_title: "Telemetria", f2_desc: "Simulazione esatta di FPS.",
    f3_title: "Salvataggio 3D", f3_desc: "Render automatico.", f4_title: "Prezzi Live", f4_desc: "Monitora il costo in tempo reale.",
    top_parts_title: "Top 5 Componentes", top_parts_desc: "Hardware più scelto dalla community.",
    part1_name: "AMD Ryzen 7 7800X3D", part1_desc: "Il re indiscusso delle CPU gaming.", part2_name: "NVIDIA RTX 4070 SUPER", part2_desc: "La scelta perfetta per giocare a 1440p.",
    part3_name: "NZXT H510 Flow", part3_desc: "Case leggendario con flusso d'aria perfetto.", part4_name: "G.Skill Trident Z RGB", part4_desc: "RAM DDR5 veloce e affidabile.",
    part5_name: "Samsung 990 PRO 2TB", part5_desc: "Velocità NVMe estrema.", build_with_this: "Scegli questo"
  },
  es: {
    nav_how: "Cómo montar", nav_rigs: "PC Destacados", nav_parts: "Top Piezas", nav_features: "Funciones", nav_pricing: "Precios",
    nav_login: "Entrar", nav_init: "Iniciar", nav_workbench: "Taller", nav_logout: "Salir",
    hero_badge: "Asistente Activo", hero_title1: "Diseña tu PC.", hero_title2: "Valida los datos.",
    hero_desc: "Nuestro entorno inteligente previene cuellos de botella.",
    hero_btn_enter: "Configurador", hero_btn_how: "Cómo funciona",
    stat1_val: "Beta V1.0", stat1_lbl: "Estado", stat2_val: "100%", stat2_lbl: "Hardware", stat3_val: "En vivo", stat3_lbl: "Análisis", stat4_val: "98%", stat4_lbl: "Precisión",
    tutorial_title: "Monta tu PC Ideal", tutorial_desc: "Tan fácil como un juego.", step1_title: "Elige la base", step1_desc: "El sistema limita las piezas compatibles.",
    step2_title: "Componentes", step2_desc: "Visualiza en 3D en tiempo real.", step3_title: "Asistente", step3_desc: "Analiza el consumo y temperatura.",
    tutorial_btn: "Pruébalo", tut_media_note: "Animación",
    rigs_title: "Configs Destacadas", rigs_desc: "Sistemas validados.", rigs_btn_load: "Cargar Editor",
    rig1_title: "Entusiasta", rig1_desc: "Rendimiento 4K sin concesiones. Equipado con la mejor CPU y GPU para obtener los máximos FPS en un chasis premium.", rig1_tag: "Ultra 4K",
    rig2_title: "Punto Óptimo", rig2_desc: "El equilibrio perfecto entre precio y rendimiento para jugar a 1440p. Maneja títulos AAA modernos sin esfuerzo.", rig2_tag: "1440p",
    rig3_title: "Rey Esports", rig3_desc: "Máximos FPS para shooters competitivos sin arruinarse. Diseñado para juegos como CS2 priorizando la estabilidad.", rig3_tag: "1080p Comp",
    pro_badge: "Ventaja", pro_title: "Juega como Pro.", pro_desc: "Garantizamos FPS estables para mínima latencia.", pro_btn: "Montar PC",
    pricing_title: "Precios", pricing_desc: "Elige tu plan.", pricing_monthly: "Mes", pricing_yearly: "Año",
    tier1_name: "Básico", tier1_desc: "Para un PC.", tier1_f1: "Catálogo completo", tier1_f2: "Visor 3D", tier1_f3: "Compatibilidad", tier1_f4: "1 Guardado",
    tier2_name: "Pro", tier2_desc: "Para expertos.", tier2_f1: "Control RGB", tier2_f2: "Análisis térmico", tier2_f3: "5 Guardados",
    tier3_name: "Elite", tier3_desc: "Rendimiento extremo.", tier3_f1: "Pruebas de estrés", tier3_f2: "Ilimitado", tier3_f3: "Renders 3D",
    btn_free: "Gratis", btn_pro: "Suscribir", btn_elite: "Elite", recommended: "Recomendado",
    feat_title: "Excelencia", feat_desc: "Herramientas para entusiastas.",
    f1_title: "Aura Studio", f1_desc: "Control total de RGB.", f2_title: "Telemetría", f2_desc: "Simulación de FPS.",
    f3_title: "Renders", f3_desc: "Miniaturas 3D automáticas.", f4_title: "Precios", f4_desc: "Control del presupuesto en tiempo real.",
    top_parts_title: "Top 5 Componentes", top_parts_desc: "Hardware mejor valorado.",
    part1_name: "AMD Ryzen 7 7800X3D", part1_desc: "El rey indiscutible de las CPU.", part2_name: "NVIDIA RTX 4070 SUPER", part2_desc: "Perfecta para 1440p.",
    part3_name: "NZXT H510 Flow", part3_desc: "Flujo de aire perfecto.", part4_name: "G.Skill Trident Z RGB", part4_desc: "RAM DDR5 rápida.",
    part5_name: "Samsung 990 PRO 2TB", part5_desc: "Velocidad NVMe espectacular.", build_with_this: "Usar esta pieza"
  },
  fr: {
    nav_how: "Comment assembler", nav_rigs: "PC Star", nav_parts: "Composants", nav_features: "Fonctions", nav_pricing: "Prix",
    nav_login: "Connexion", nav_init: "Démarrer", nav_workbench: "Atelier", nav_logout: "Quitter",
    hero_badge: "Assistant Actif", hero_title1: "Concevez votre PC.", hero_title2: "Vérifiez les chiffres.",
    hero_desc: "Notre outil prévient les problèmes matériels.", hero_btn_enter: "Configurateur", hero_btn_how: "Comment ça marche",
    stat1_val: "Bêta V1.0", stat1_lbl: "Statut", stat2_val: "100%", stat2_lbl: "Matériel", stat3_val: "En direct", stat3_lbl: "Vérifications", stat4_val: "98%", stat4_lbl: "Précision",
    tutorial_title: "Montez votre PC Rêvé", tutorial_desc: "Aussi simple qu'un jeu.", step1_title: "Choisissez la base", step1_desc: "Limitation auto aux pièces compatibles.",
    step2_title: "Ajoutez les composants", step2_desc: "Visualisez en 3D.", step3_title: "Assistant Intelligent", step3_desc: "Analyse températures et puissance.",
    tutorial_btn: "Essayer", tut_media_note: "Animation",
    rigs_title: "Configurations Star", rigs_desc: "Systèmes validés.", rigs_btn_load: "Ouvrir Éditeur",
    rig1_title: "L'Enthousiaste", rig1_desc: "Des performances 4K sans compromis. Équipé de la meilleure carte graphique pour des FPS maximaux avec ray-tracing.", rig1_tag: "Ultra 4K",
    rig2_title: "Le Choix Idéal", rig2_desc: "L'équilibre parfait pour le jeu en 1440p à haute fréquence. Gère facilement les jeux AAA modernes sans surchauffe.", rig2_tag: "1440p",
    rig3_title: "Roi de l'Esport", rig3_desc: "FPS maximisés pour les jeux compétitifs sans se ruiner. Conçu pour garantir une latence minimale.", rig3_tag: "1080p",
    pro_badge: "Avantage", pro_title: "Jouez comme un Pro.", pro_desc: "FPS stables pour une latence minimale.", pro_btn: "Monter PC",
    pricing_title: "Tarifs", pricing_desc: "Choisissez votre plan.", pricing_monthly: "Mensuel", pricing_yearly: "Annuel",
    tier1_name: "Débutant", tier1_desc: "Pour un seul PC.", tier1_f1: "Catalogue complet", tier1_f2: "Vue 3D", tier1_f3: "Compatibilité base", tier1_f4: "1 Sauvegarde",
    tier2_name: "Pro", tier2_desc: "Pour les experts.", tier2_f1: "Contrôle RGB", tier2_f2: "Analytique thermique", tier2_f3: "5 Sauvegardes",
    tier3_name: "Elite", tier3_desc: "Pour les professionnels.", tier3_f1: "Stress tests", tier3_f2: "Illimité", tier3_f3: "Rendus 3D",
    btn_free: "Gratuit", btn_pro: "Abonnement Pro", btn_elite: "Elite", recommended: "Recommandé",
    feat_title: "Excellence", feat_desc: "Outils pour passionnés.",
    f1_title: "Aura Studio", f1_desc: "Contrôle parfait du RGB.", f2_title: "Télémétrie", f2_desc: "Simulation de FPS.",
    f3_title: "Rendus", f3_desc: "Images générées auto.", f4_title: "Prix en direct", f4_desc: "Coût mis à jour.",
    top_parts_title: "Top 5 Composants", top_parts_desc: "Le meilleur matériel.",
    part1_name: "AMD Ryzen 7 7800X3D", part1_desc: "Le roi des processeurs.", part2_name: "NVIDIA RTX 4070 SUPER", part2_desc: "Parfait pour le 1440p.",
    part3_name: "NZXT H510 Flow", part3_desc: "Un flux d'air parfait.", part4_name: "G.Skill Trident Z RGB", part4_desc: "RAM DDR5 rapide.",
    part5_name: "Samsung 990 PRO 2TB", part5_desc: "Vitesse NVMe fulgurante.", build_with_this: "Utiliser cette pièce"
  },
  de: {
    nav_how: "Bauablauf", nav_rigs: "PC Builds", nav_parts: "Top-Teile", nav_features: "Funktionen", nav_pricing: "Preise",
    nav_login: "Anmelden", nav_init: "Starten", nav_workbench: "Werkstatt", nav_logout: "Abmelden",
    hero_badge: "Assistent Aktiv", hero_title1: "Entwirf dein Setup.", hero_title2: "Überprüfe die Daten.",
    hero_desc: "Unser System verhindert Hardware-Probleme.", hero_btn_enter: "Konfigurator", hero_btn_how: "Wie es funktioniert",
    stat1_val: "Beta", stat1_lbl: "Status", stat2_val: "100%", stat2_lbl: "Hardware", stat3_val: "Echtzeit", stat3_lbl: "Prüfungen", stat4_val: "98%", stat4_lbl: "Genauigkeit",
    tutorial_title: "PC Bauen leicht gemacht", tutorial_desc: "So einfach wie ein Spiel.", step1_title: "Basis wählen", step1_desc: "Auto-Filter für kompatible Teile.",
    step2_title: "Einbauen", step2_desc: "Zusammenbau in 3D ansehen.", step3_title: "Smarter Assistent", step3_desc: "Analysiert Strom und Temperatur.",
    tutorial_btn: "Jetzt testen", tut_media_note: "Animation",
    rigs_title: "Empfohlene Builds", rigs_desc: "Geprüfte Systeme.", rigs_btn_load: "Laden",
    rig1_title: "Enthusiast", rig1_desc: "Kompromisslose 4K-Leistung für Elite-Gamer. Ausgestattet mit der besten GPU für maximale FPS mit Raytracing in einem Premium-Gehäuse.", rig1_tag: "Ultra 4K",
    rig2_title: "Goldene Mitte", rig2_desc: "Die perfekte Balance aus Preis und Leistung für 1440p-Gaming. Bewältigt moderne AAA-Titel mühelos und bleibt kühl.", rig2_tag: "1440p",
    rig3_title: "Esports König", rig3_desc: "Maximale FPS für kompetitive Shooter. Speziell für CS2 entwickelt, garantiert stabile Framerates.", rig3_tag: "1080p",
    pro_badge: "Vorteil", pro_title: "Profimäßig spielen.", pro_desc: "Stabile FPS für minimale Latenz.", pro_btn: "PC Bauen",
    pricing_title: "Preise", pricing_desc: "Wähle deinen Plan.", pricing_monthly: "Monat", pricing_yearly: "Jahr",
    tier1_name: "Starter", tier1_desc: "Für einen PC.", tier1_f1: "Katalog", tier1_f2: "3D Ansicht", tier1_f3: "Kompatibilität", tier1_f4: "1 Speicherplatz",
    tier2_name: "Pro", tier2_desc: "Für Experten.", tier2_f1: "RGB Steuerung", tier2_f2: "Thermik-Analyse", tier2_f3: "5 Speicherplätze",
    tier3_name: "Elite", tier3_desc: "Für die Besten.", tier3_f1: "Stress-Tests", tier3_f2: "Unbegrenzt", tier3_f3: "3D Render Export",
    btn_free: "Kostenlos", btn_pro: "Abonnieren", btn_elite: "Elite", recommended: "Empfohlen",
    feat_title: "Exzellenz", feat_desc: "Tools für Enthusiasten.",
    f1_title: "Aura Studio", f1_desc: "Perfekte RGB-Kontrolle.", f2_title: "Telemetrie", f2_desc: "Exakte FPS-Simulation.",
    f3_title: "3D Render", f3_desc: "Automatische Bilder.", f4_title: "Live Preise", f4_desc: "Echtzeit Budget-Tracking.",
    top_parts_title: "Top 5 Komponenten", top_parts_desc: "Die bestbewertete Hardware.",
    part1_name: "AMD Ryzen 7 7800X3D", part1_desc: "König der Gaming-CPUs.", part2_name: "NVIDIA RTX 4070 SUPER", part2_desc: "Perfekt für 1440p.",
    part3_name: "NZXT H510 Flow", part3_desc: "Toller Airflow.", part4_name: "G.Skill Trident Z", part4_desc: "Schönes RGB DDR5.",
    part5_name: "Samsung 990 PRO 2TB", part5_desc: "Rasante NVMe.", build_with_this: "Auswählen"
  }
};

const t = (key, lang) => translations[lang]?.[key] || translations['en'][key] || key;

function FadeIn({ children, delay = 0, direction = 'up' }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setIsVisible(true); }); },
      { threshold: 0.1 }
    );
    const { current } = domRef;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);

  let transformClass = 'translate-y-10';
  if (direction === 'left') transformClass = 'translate-x-10';
  if (direction === 'right') transformClass = '-translate-x-10';

  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${transformClass}`}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function HomeView() {
  const { setCurrentView, setUi, language, setLanguage, loadConfiguration } = useStore();
  const { isAuthenticated, logout, user, login } = useAuthStore();
  const [langOpen, setLangOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isYearly, setIsYearly] = useState(true);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [successRole, setSuccessRole] = useState(null); 

  const handleLoadOfficial = (blueprintId) => {
    const blueprint = OFFICIAL_BLUEPRINTS.find(b => b.id === blueprintId);
    if (blueprint) {
      loadConfiguration(blueprint, true); 
      setCurrentView('editor'); 
    }
  };
  
  const handleStartBuilding = () => setCurrentView('dashboard');
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const availableLanguages = [
    { code: 'en', label: 'English' }, { code: 'uk', label: 'Українська' },
    { code: 'it', label: 'Italiano' }, { code: 'pl', label: 'Polski' },
    { code: 'es', label: 'Español' }, { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' }
  ];

  const featuredRigs = [
    { id: 1, titleKey: "rig1_title", descKey: "rig1_desc", tagKey: "rig1_tag", image: '/gifs/rig-enthusiast.gif', cpu: "Ryzen 7 7800X3D", gpu: "RTX 5090 FE", price: "$3,450" },
    { id: 2, titleKey: "rig2_title", descKey: "rig2_desc", tagKey: "rig2_tag", image: '/gifs/rig-mid.gif', cpu: "Core i5-13600K", gpu: "RTX 4070 SUPER", price: "$1,650" },
    { id: 3, titleKey: "rig3_title", descKey: "rig3_desc", tagKey: "rig3_tag", image: '/gifs/rig-budget.gif', cpu: "Ryzen 5 3600", gpu: "GTX 1660 SUPER", price: "$650" }
  ];

  const topParts = [
    { id: "p1", name: "part1_name", desc: "part1_desc", icon: Cpu, color: "text-red-500", image: "/parts/cpu-7800x3d.png" },
    { id: "p2", name: "part2_name", desc: "part2_desc", icon: Monitor, color: "text-emerald-500", image: "/parts/gpu-4070s.png" },
    { id: "p3", name: "part3_name", desc: "part3_desc", icon: Server, color: "text-neutral-300", image: "/parts/case-h510.png" },
    { id: "p4", name: "part4_name", desc: "part4_desc", icon: Layers, color: "text-purple-500", image: "/parts/ram-trident.png" },
    { id: "p5", name: "part5_name", desc: "part5_desc", icon: HardDrive, color: "text-blue-500", image: "/parts/ssd-990.png" }
  ];

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');
    const paymentStatus = query.get('payment');

    if (paymentStatus === 'success' && sessionId && isAuthenticated) {
      setIsProcessing(true);
      api.post('/payment/verify-payment', { sessionId })
        .then(res => {
           const newRole = res.data.user.role;
           useAuthStore.setState((state) => ({ user: { ...state.user, role: newRole } }));
           setSuccessRole(newRole); 
           window.history.replaceState({}, document.title, window.location.pathname); 
        })
        .catch(err => {
           console.error(err);
           alert("Помилка підтвердження оплати. Зверніться до підтримки.");
        })
        .finally(() => setIsProcessing(false));
    }
  }, [isAuthenticated]);

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) {
      setUi('loginOpen', true);
      return;
    }
    try {
      setIsProcessing(true);
      const res = await api.post('/payment/create-checkout-session', { plan });
      window.location.href = res.data.url; 
    } catch (err) {
      console.error(err);
      alert("Помилка створення платежу");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => { setActiveSlide((prev) => (prev + 1) % featuredRigs.length); }, 10000);
    return () => clearInterval(timer);
  }, [featuredRigs.length]);

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-300 font-sans selection:bg-blue-600/30 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="p-1.5 bg-neutral-900 border border-neutral-700 rounded-sm">
              <Cpu className="w-6 h-6 text-neutral-100" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-white">PCWITH<span className="text-blue-500">BLADVIK</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">
            <button onClick={() => scrollTo('tutorial')} className="hover:text-white transition-colors">{t('nav_how', language)}</button>
            <button onClick={() => scrollTo('rigs')} className="hover:text-white transition-colors">{t('nav_rigs', language)}</button>
            <button onClick={() => scrollTo('top-parts')} className="hover:text-white transition-colors">{t('nav_parts', language)}</button>
            <button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">{t('nav_features', language)}</button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors">{t('nav_pricing', language)}</button>
          </div>

          <div className="flex items-center gap-4">
            {/* Lang Switcher */}
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 hover:border-neutral-600 rounded bg-neutral-900 text-xs font-bold transition-colors text-white uppercase">
                <Globe className="w-4 h-4 text-neutral-400" /> {language}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#09090b] border border-neutral-800 rounded shadow-2xl overflow-hidden z-50">
                  {availableLanguages.map((lang) => (
                    <button key={lang.code} onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors ${language === lang.code ? 'bg-blue-600/10 text-blue-400' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}>
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* БЛОК АВТОРИЗАЦІЇ */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setUi('loginOpen', true)} className="text-xs font-bold text-neutral-400 hover:text-white transition-colors hidden sm:block">
                  {t('nav_login', language)}
                </button>
                <button onClick={() => setUi('registerOpen', true)} className="text-xs font-bold px-4 py-2 bg-neutral-100 text-black rounded hover:bg-white transition-colors">
                  {t('nav_init', language)}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-neutral-800">
                <button 
                  onClick={() => setCurrentView('dashboard')} 
                  className="text-xs font-bold px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  {t('nav_workbench', language)}
                </button>

                {/* Профіль з Короною */}
                <div className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${user?.role === 'elite' ? 'from-purple-600 to-pink-500' : 'from-blue-600 to-indigo-500'} flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-105 transition-transform border border-white/10`}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    {user?.role === 'elite' && (
                      <Crown className="w-4 h-4 text-yellow-400 absolute -top-2 -right-1 transform rotate-12 drop-shadow-md" />
                    )}
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">
                      {user?.name || 'User'}
                    </span>
                    <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest">Active</span>
                  </div>
                </div>

                <button onClick={logout} className="p-2 text-neutral-500 hover:text-red-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 border-b border-neutral-800 min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#09090b]/80 z-10" />
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 animate-pulse" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#09090b] border border-neutral-800 text-neutral-400 text-[10px] font-bold tracking-widest uppercase mb-8">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              {t('hero_badge', language)}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] text-white mb-6">
              {t('hero_title1', language)}<br />
              {t('hero_title2', language)}
            </h1>
            <p className="text-base md:text-lg text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              {t('hero_desc', language)}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={handleStartBuilding} className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded hover:bg-neutral-200 transition-all">
                {t('hero_btn_enter', language)}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => scrollTo('tutorial')} className="flex items-center justify-center gap-2 px-8 py-4 bg-[#09090b]/50 backdrop-blur border border-neutral-700 hover:border-neutral-500 text-white font-bold uppercase tracking-widest text-sm rounded transition-all">
                <PlayCircle className="w-4 h-4" /> {t('hero_btn_how', language)}
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-neutral-800 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-neutral-800">
          {[
            { label: t('stat1_lbl', language), value: t('stat1_val', language) },
            { label: t('stat2_lbl', language), value: t('stat2_val', language) },
            { label: t('stat3_lbl', language), value: t('stat3_val', language) },
            { label: t('stat4_lbl', language), value: t('stat4_val', language) },
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="flex flex-col items-center justify-center text-center">
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mb-1">{stat.value}</h3>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* TUTORIAL */}
      <section id="tutorial" className="py-24 px-6 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">{t('tutorial_title', language)}</h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">{t('tutorial_desc', language)}</p>
            </div>
          </FadeIn>

          <div className="space-y-24">
            {[
              { step: "01", title: t('step1_title', language), desc: t('step1_desc', language), icon: Layers, gif: "/gifs/tutorial-1.gif" },
              { step: "02", title: t('step2_title', language), desc: t('step2_desc', language), icon: Cpu, gif: "/gifs/tutorial-2.gif" },
              { step: "03", title: t('step3_title', language), desc: t('step3_desc', language), icon: HelpCircle, gif: "/gifs/tutorial-3.gif" }
            ].map((item, index) => (
              <FadeIn key={index} direction={index % 2 === 0 ? 'right' : 'left'}>
                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
                  <div className="md:w-1/2 w-full space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-5xl font-black text-neutral-800">{item.step}</span>
                      <item.icon className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase">{item.title}</h3>
                    <p className="text-neutral-400 leading-relaxed text-lg">{item.desc}</p>
                  </div>
                  <div className="md:w-1/2 w-full">
                    <div className="aspect-video bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden relative shadow-2xl">
                       <img src={item.gif} alt="Tutorial" className="w-full h-full object-cover opacity-80" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* AUTO-CAROUSEL: FEATURED RIGS */}
      <section id="rigs" className="py-24 px-6 border-b border-neutral-800 bg-neutral-900/20">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{t('rigs_title', language)}</h2>
                <p className="text-sm text-neutral-500 font-medium mt-1">{t('rigs_desc', language)}</p>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col md:flex-row mb-8 h-auto min-h-[450px]">
              <div className="md:w-2/3 bg-black relative flex items-center justify-center p-8 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent z-10" />
                {featuredRigs[activeSlide].image ? (
                  <img src={featuredRigs[activeSlide].image} alt="PC Build" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onError={(e) => e.target.style.display = 'none'} />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                   <Cpu className="w-32 h-32 text-neutral-800 group-hover:scale-110 transition-transform duration-1000" />
                </div>
              </div>
              <div className="md:w-1/3 p-8 flex flex-col border-l border-neutral-800 relative">
                <div className="absolute top-0 right-0 w-full h-1 bg-neutral-800">
                   <div className="h-full bg-blue-500" style={{ width: '100%', transition: 'width 10s linear' }} key={activeSlide} />
                </div>
                <div className="inline-block px-2 py-1 bg-neutral-800 text-neutral-300 text-[10px] font-bold uppercase tracking-widest rounded mb-4 w-fit">
                  {t(featuredRigs[activeSlide].tagKey, language)}
                </div>
                <h3 className="text-3xl font-black text-white mb-4">{t(featuredRigs[activeSlide].titleKey, language)}</h3>
                <p className="text-neutral-400 mb-6 text-sm leading-relaxed">{t(featuredRigs[activeSlide].descKey, language)}</p>
                
                <button onClick={() => handleLoadOfficial(OFFICIAL_BLUEPRINTS[activeSlide].id)} className="flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors uppercase text-xs tracking-widest mt-auto w-fit">
                  {t('rigs_btn_load', language)} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRigs.map((rig, i) => (
                <div key={rig.id} onClick={() => setActiveSlide(i)} className={`p-5 border rounded-lg cursor-pointer transition-colors ${activeSlide === i ? 'bg-neutral-800 border-neutral-600' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'}`}>
                  <h4 className="text-white font-bold mb-3">{t(rig.titleKey, language)}</h4>
                  <div className="flex justify-between text-xs font-medium text-neutral-400 mb-4">
                    <span>CPU: {rig.cpu}</span>
                    <span>GPU: {rig.gpu}</span>
                  </div>
                  <div className="text-sm font-black text-white border-t border-neutral-800 pt-3">{rig.price}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TOP 5 COMPONENTS */}
      <section id="top-parts" className="py-24 px-6 border-b border-neutral-800 bg-[#09090b]">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4 flex items-center justify-center gap-3">
                <Star className="w-8 h-8 text-yellow-500" /> {t('top_parts_title', language)}
              </h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">{t('top_parts_desc', language)}</p>
            </div>
          </FadeIn>

          <div className="space-y-6">
            {topParts.map((part, index) => (
              <FadeIn key={part.id} delay={index * 100}>
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col md:flex-row items-center gap-8 hover:bg-neutral-900 transition-colors group">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="text-5xl font-black text-neutral-800 group-hover:text-neutral-700 transition-colors">
                      #{index + 1}
                    </div>
                    <div className="w-32 h-32 bg-black border border-neutral-800 rounded-lg flex items-center justify-center p-2 relative overflow-hidden shrink-0">
                      <img src={part.image} alt={t(part.name, language)} className="w-full h-full object-contain z-10" onError={(e) => e.target.style.display = 'none'} />
                      <part.icon className={`absolute w-12 h-12 opacity-10 ${part.color} z-0`} />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className={`w-4 h-4 ${part.color}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${part.color}`}>Rank {index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{t(part.name, language)}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{t(part.desc, language)}</p>
                  </div>
                  
                  <div className="md:ml-auto w-full md:w-auto">
                     <button onClick={handleStartBuilding} className="w-full md:w-auto px-6 py-3 border border-neutral-700 hover:border-blue-500 hover:text-blue-500 text-white font-bold uppercase tracking-widest text-xs rounded transition-all">
                       {t('build_with_this', language)}
                     </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TOP FEATURES SECTION */}
      <section id="features" className="py-24 px-6 border-b border-neutral-800 bg-[#09090b] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
        
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">{t('feat_title', language)}</h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">{t('feat_desc', language)}</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <FadeIn direction="right">
              <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-xl h-full flex flex-col hover:border-purple-500/50 transition-colors group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors"><Palette className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{t('f1_title', language)}</h3>
                </div>
                <p className="text-neutral-400 leading-relaxed mb-6 flex-1">{t('f1_desc', language)}</p>
                <div className="w-full aspect-video bg-black border border-neutral-800 rounded-lg overflow-hidden relative">
                  <img src="/gifs/feature-rgb.gif" alt="Aura Studio RGB" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left">
              <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-xl h-full flex flex-col hover:border-emerald-500/50 transition-colors group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors"><Activity className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{t('f2_title', language)}</h3>
                </div>
                <p className="text-neutral-400 leading-relaxed mb-6 flex-1">{t('f2_desc', language)}</p>
                <div className="w-full aspect-video bg-black border border-neutral-800 rounded-lg overflow-hidden relative">
                  <img src="/gifs/feature-stats.gif" alt="Telemetry" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-xl h-full flex flex-col hover:border-blue-500/50 transition-colors group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors"><Camera className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{t('f3_title', language)}</h3>
                </div>
                <p className="text-neutral-400 leading-relaxed mb-6 flex-1">{t('f3_desc', language)}</p>
                <div className="w-full aspect-video bg-black border border-neutral-800 rounded-lg overflow-hidden relative">
                  <img src="/gifs/feature-capture.gif" alt="Build Photography" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left">
              <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-xl h-full flex flex-col hover:border-yellow-500/50 transition-colors group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-colors"><DollarSign className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{t('f4_title', language)}</h3>
                </div>
                <p className="text-neutral-400 leading-relaxed mb-6 flex-1">{t('f4_desc', language)}</p>
                <div className="w-full aspect-[21/9] bg-black border border-neutral-800 rounded-lg overflow-hidden relative flex flex-col items-center justify-center">
                  <div className="text-5xl font-black text-emerald-500 group-hover:scale-110 transition-transform">$2,450</div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-2 animate-pulse">Live Updating...</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 border-b border-neutral-800 relative bg-neutral-900/20">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">{t('pricing_title', language)}</h2>
              <p className="text-neutral-400 mb-8">{t('pricing_desc', language)}</p>

              <div className="flex items-center justify-center gap-4">
                <span className={`text-sm font-bold ${!isYearly ? 'text-white' : 'text-neutral-500'}`}>{t('pricing_monthly', language)}</span>
                <button onClick={() => setIsYearly(!isYearly)} className="w-14 h-7 bg-neutral-800 rounded-full relative transition-colors focus:outline-none flex items-center px-1">
                  <div className={`w-5 h-5 bg-blue-500 rounded-full transition-transform ${isYearly ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
                <span className={`text-sm font-bold ${isYearly ? 'text-white' : 'text-neutral-500'}`}>{t('pricing_yearly', language)}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free */}
              <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">{t('tier1_name', language)}</h3>
                <p className="text-xs text-neutral-500 mb-4">{t('tier1_desc', language)}</p>
                <div className="text-4xl font-black text-white mb-6">$0.00</div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-neutral-400"><CheckSquare className="w-4 h-4 text-neutral-500 shrink-0"/> {t('tier1_f1', language)}</li>
                  <li className="flex items-start gap-3 text-sm text-neutral-400"><CheckSquare className="w-4 h-4 text-neutral-500 shrink-0"/> {t('tier1_f2', language)}</li>
                  <li className="flex items-start gap-3 text-sm text-neutral-400"><CheckSquare className="w-4 h-4 text-neutral-500 shrink-0"/> {t('tier1_f3', language)}</li>
                  <li className="flex items-start gap-3 text-sm text-neutral-400"><CheckSquare className="w-4 h-4 text-neutral-500 shrink-0"/> {t('tier1_f4', language)}</li>
                </ul>
                <button onClick={handleStartBuilding} className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded text-sm transition-colors">{t('btn_free', language)}</button>
              </div>

              {/* Pro */}
              <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">{t('tier2_name', language)}</h3>
                <p className="text-xs text-neutral-500 mb-4">{t('tier2_desc', language)}</p>
                <div className="text-4xl font-black text-white mb-6">${isYearly ? '2.50' : '3.00'}<span className="text-sm text-neutral-500 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-white"><CheckSquare className="w-4 h-4 text-blue-500 shrink-0"/> {t('tier2_f1', language)}</li>
                  <li className="flex items-start gap-3 text-sm text-white"><CheckSquare className="w-4 h-4 text-blue-500 shrink-0"/> {t('tier2_f2', language)}</li>
                  <li className="flex items-start gap-3 text-sm text-white"><CheckSquare className="w-4 h-4 text-blue-500 shrink-0"/> {t('tier2_f3', language)}</li>
                </ul>
               
                <button 
                  onClick={() => handleSubscribe('pro')} 
                  disabled={isProcessing || user?.role === 'pro' || user?.role === 'elite'}
                  className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded text-sm transition-colors disabled:opacity-50"
                >
                  {user?.role === 'pro' ? 'Поточний план' : t('btn_pro', language)}
                </button>
              </div>

              {/* Elite - NOW RECOMMENDED */}
              <div className="bg-[#09090b] border border-blue-500/50 p-8 rounded-lg flex flex-col relative shadow-[0_0_30px_rgba(37,99,235,0.1)] transform md:-translate-y-4">
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">{t('recommended', language)}</div>
                <h3 className="text-xl font-bold text-white mb-2">{t('tier3_name', language)}</h3>
                <p className="text-xs text-neutral-500 mb-4">{t('tier3_desc', language)}</p>
                <div className="text-4xl font-black text-white mb-6">
                  {isYearly ? (
                    <div className="flex items-center gap-2"><span className="text-2xl text-neutral-600 line-through">$5.00</span><span>$3.00<span className="text-sm text-neutral-500 font-normal">/mo</span></span></div>
                  ) : (
                    <span>$5.00<span className="text-sm text-neutral-500 font-normal">/mo</span></span>
                  )}
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-white"><CheckSquare className="w-4 h-4 text-emerald-500 shrink-0"/> {t('tier3_f1', language)}</li>
                  <li className="flex items-start gap-3 text-sm text-white"><CheckSquare className="w-4 h-4 text-emerald-500 shrink-0"/> {t('tier3_f2', language)}</li>
                  <li className="flex items-start gap-3 text-sm text-white"><CheckSquare className="w-4 h-4 text-emerald-500 shrink-0"/> {t('tier3_f3', language)}</li>
                </ul>
                <button 
                  onClick={() => handleSubscribe('elite')} 
                  disabled={isProcessing || user?.role === 'elite'}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-sm transition-colors disabled:opacity-50"
                >
                  {user?.role === 'elite' ? 'Поточний план' : t('btn_elite', language)}
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ESPORTS SECTION */}
      <section id="pro" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
          <Target className="w-[500px] h-[500px] text-white" />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <FadeIn direction="right" className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black tracking-widest uppercase mb-6 rounded">
              <Crosshair className="w-3 h-3" /> {t('pro_badge', language)}
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6 uppercase">{t('pro_title', language)}</h2>
            <p className="text-neutral-400 text-sm mb-8 leading-relaxed max-w-lg">
              {t('pro_desc', language)}
            </p>
            <button onClick={() => handleLoadOfficial(OFFICIAL_BLUEPRINTS[2].id)} className="px-6 py-3 bg-[#09090b] border border-neutral-700 hover:border-neutral-500 text-white font-bold uppercase tracking-widest text-xs rounded transition-all">
              {t('pro_btn', language)}
            </button>
          </FadeIn>
          
          <FadeIn direction="left" className="lg:w-1/2 w-full">
            <div className="bg-[#09090b] border border-neutral-800 p-6 rounded-lg shadow-2xl">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">CS2 Telemetry Test</span>
                <span className="text-xs font-black text-emerald-500">360Hz STABLE</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1 text-white"><span>Average FPS</span><span>512</span></div>
                  <div className="h-1 bg-neutral-800"><div className="h-full bg-emerald-500 w-[95%]" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1 text-white"><span>1% Lows</span><span>385</span></div>
                  <div className="h-1 bg-neutral-800"><div className="h-full bg-blue-500 w-[75%]" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1 text-neutral-500"><span>System Latency</span><span>1.2ms</span></div>
                  <div className="h-1 bg-neutral-800"><div className="h-full bg-neutral-600 w-[15%]" /></div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ПОВНОЕКРАННЕ ВІКНО УСПІШНОЇ ОПЛАТИ */}
      <AnimatePresence>
        {successRole && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#09090b]/95 backdrop-blur-xl p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
            >
              {/* Фонове світіння */}
              <div className={`absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-20 ${successRole === 'elite' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>

              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                {language === 'uk' ? 'Оплата успішна!' : 'Payment Successful!'}
              </h2>
              
              <p className="text-neutral-400 mb-8">
                {language === 'uk' 
                  ? `Вітаємо! Ваш акаунт оновлено до рівня ${successRole.toUpperCase()}.` 
                  : `Welcome! Your account has been upgraded to ${successRole.toUpperCase()}.`}
              </p>

              <div className="w-full bg-black/50 border border-neutral-800 rounded-xl p-5 mb-8 text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4 block">
                  {language === 'uk' ? 'Тепер вам доступно:' : 'Now you have access to:'}
                </span>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-neutral-300">
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    {successRole === 'elite' ? (language === 'uk' ? 'Безлімітні збереження' : 'Unlimited Saves') : (language === 'uk' ? '5 слотів збереження' : '5 Save Slots')}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-300">
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    {language === 'uk' ? 'Повний контроль Aura Studio (RGB)' : 'Full Aura Studio RGB Control'}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-300">
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    {language === 'uk' ? 'Теплова аналітика та стрес-тести' : 'Thermal Analytics & Stress Testing'}
                  </li>
                  {successRole === 'elite' && (
                    <li className="flex items-center gap-3 text-sm text-neutral-300">
                      <CheckSquare className="w-4 h-4 text-purple-500" />
                      {language === 'uk' ? 'Експорт високоякісних рендерів' : 'High-Res Render Export'}
                    </li>
                  )}
                </ul>
              </div>

              <button 
                onClick={() => { setSuccessRole(null); setCurrentView('dashboard'); }} 
                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded hover:bg-neutral-200 transition-colors"
              >
                {language === 'uk' ? 'Перейти в Майстерню' : 'Go to Workbench'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}