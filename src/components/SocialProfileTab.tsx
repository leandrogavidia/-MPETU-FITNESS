import { motion } from "motion/react";
import { 
  User, 
  Wallet, 
  Copy, 
  Check, 
  Award, 
  CheckCircle, 
  Info,
  UserCheck,
  Sparkles,
  Camera,
  Image as ImageIcon
} from "lucide-react";

interface SocialProfileTabProps {
  walletConnected: boolean;
  walletAddress: string | null;
  userXp: number;
  profileName: string;
  setProfileName: (name: string) => void;
  profileBio: string;
  setProfileBio: (bio: string) => void;
  profilePic: string;
  setProfilePic: (pic: string) => void;
  profileBanner: string;
  setProfileBanner: (banner: string) => void;
  isEditingProfile: boolean;
  setIsEditingProfile: (editing: boolean) => void;
  validatedSessions: string[];
  copyAddressToClipboard: () => void;
  copiedAddress: boolean;
  setActiveTab: (tab: string) => void;
}

export function SocialProfileTab({
  walletConnected,
  walletAddress,
  userXp,
  profileName,
  setProfileName,
  profileBio,
  setProfileBio,
  profilePic,
  setProfilePic,
  profileBanner,
  setProfileBanner,
  isEditingProfile,
  setIsEditingProfile,
  validatedSessions,
  copyAddressToClipboard,
  copiedAddress,
  setActiveTab
}: SocialProfileTabProps) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* 1. SECCIÓN DE BANNER Y DE FOTO DE PERFIL CON CONTROLES DE EDICIÓN */}
      <div className="relative bg-[#082029] border border-teal-800/85 rounded-2xl overflow-hidden shadow-2xl">
        {/* Area del Banner */}
        <div className="h-40 sm:h-52 relative bg-[#05171d] flex items-center justify-center overflow-hidden">
          {profileBanner ? (
            <img 
              src={profileBanner} 
              alt="Banner de Atleta" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-teal-950 via-[#082029] to-cyan-950 opacity-80" />
          )}
          
          {/* Grid de Fondo Sutil */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#09232d_1px,transparent_1px),linear-gradient(to_bottom,#09232d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

          {/* Interfaz de Edición para el Banner */}
          {isEditingProfile && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-4 z-20 backdrop-blur-xs">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/10 rounded-full border border-orange-500/20 mb-2">
                <ImageIcon className="w-3 h-3 text-orange-400" />
                <span className="text-[10px] font-mono text-orange-200 font-bold uppercase tracking-wide">Editar Banner de Fondo</span>
              </div>
              
              {/* Presets del Banner */}
              <div className="flex flex-wrap gap-1.5 justify-center max-w-lg mb-3">
                {[
                  { name: "Ciber Neón", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" },
                  { name: "Gimnasio Acero", url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop" },
                  { name: "Abstracción Cripto", url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop" },
                  { name: "Fuerza Absoluta", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop" }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setProfileBanner(item.url)}
                    className="px-2 py-1 bg-[#05171d]/90 hover:bg-[#14f195]/20 border border-teal-800 rounded-lg text-[9px] text-teal-300 font-mono transition font-bold"
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* URL Custom o Subida Local */}
              <div className="flex gap-2 w-full max-w-sm">
                <input 
                  type="text"
                  placeholder="Pegar URL de banner (.jpg/.png)..."
                  value={profileBanner}
                  onChange={(e) => setProfileBanner(e.target.value)}
                  className="bg-[#05171d] text-[10px] border border-teal-850 rounded-lg py-1 px-2.5 flex-1 text-white focus:outline-none focus:border-orange-400 font-mono"
                />
                
                <label className="bg-orange-400 hover:bg-orange-350 text-black font-extrabold text-[9px] font-mono py-1 px-2.5 rounded-lg flex items-center justify-center cursor-pointer shrink-0 transition">
                  SUBIR
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setProfileBanner(event.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Superposición del Atleta abajo del banner */}
        <div className="p-5 md:p-6 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-5 -mt-10 sm:-mt-14 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">
            
            {/* Foto de Perfil (Avatar) */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-[#14f195] to-orange-400 animate-spin blur-xs opacity-50" style={{ animationDuration: "8s" }} />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#05171d] rounded-full border-4 border-[#082029] flex items-center justify-center shadow-2xl overflow-hidden">
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt="Foto de Perfil" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#05171d] via-[#10303b] to-[#14f195]/20 flex items-center justify-center font-bold text-3xl text-[#14f195] font-mono">
                    {profileName ? profileName.substring(0, 2).toUpperCase() : "AT"}
                  </div>
                )}

                {/* Overla de Edición de Foto de Perfil */}
                {isEditingProfile && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-1 z-10 backdrop-blur-xs">
                    <Camera className="w-4 h-4 text-orange-400 mb-1" />
                    <span className="text-[8px] font-mono font-bold text-orange-200">SUBIR FOTO</span>
                    <label className="text-[8px] text-white underline mt-1 cursor-pointer hover:text-[#14f195]">
                      Examinar
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setProfilePic(event.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden" 
                      />
                    </label>
                  </div>
                )}
              </div>
              
              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-400 to-amber-500 text-black text-[10.5px] font-mono font-black px-2.5 py-0.5 rounded-full border border-teal-900 shadow">
                Lvl {Math.floor(userXp / 100) + 1}
              </span>
            </div>

            {/* Datos de Identidad */}
            <div className="space-y-2 pt-2 md:pt-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {isEditingProfile ? (
                  <input 
                    type="text" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Ingresa tu alias"
                    className="bg-[#05171d] text-sm border border-teal-850 rounded-xl py-1 px-3 text-white font-bold w-48 text-center md:text-left focus:outline-none focus:border-cyan-400 font-sans"
                  />
                ) : (
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5 tracking-tight">
                    {profileName} 
                    <span className="w-2.5 h-2.5 rounded-full bg-[#14f195] animate-pulse" title="Nodo de Atleta Activo" />
                  </h3>
                )}
                
                <span className="font-mono text-[9px] text-[#14f195] bg-[#14f195]/10 px-2 py-0.5 rounded border border-[#14f195]/30 block text-center font-extrabold tracking-wide uppercase">
                  {userXp >= 300 ? "VALIDADOR SUPREMO DE SOLANA" : userXp >= 100 ? "ATLETA INTERMEDIO PoS" : "MINERO DE FUERZA NOVICE"}
                </span>
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-teal-400">
                <Wallet className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span className="text-teal-350 select-all font-semibold break-all max-w-[200px] sm:max-w-none truncate sm:overflow-visible">
                  {walletConnected ? walletAddress : "Invitado: Simulador de Bloques Local"}
                </span>
                {walletConnected && (
                  <button 
                    onClick={copyAddressToClipboard}
                    className="p-1 hover:bg-[#0c2a35] rounded-md text-teal-400 hover:text-white transition cursor-pointer"
                    title="Copiar Clave Pública"
                  >
                    {copiedAddress ? <Check className="w-3 h-3 text-[#14f195]" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Botón de Guardado/Edición en la Esquina */}
          <div className="shrink-0 flex gap-2 self-center md:self-end w-full sm:w-auto">
            {isEditingProfile ? (
              <button
                onClick={() => setIsEditingProfile(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-black font-extrabold text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer shadow transition"
              >
                <Check className="w-3.5 h-3.5" />
                GUARDAR CAMBIOS
              </button>
            ) : (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-950/40 hover:bg-teal-900/40 border border-teal-850 text-teal-300 hover:text-white font-semibold text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <User className="w-3.5 h-3.5 text-teal-400" />
                EDITAR PERFIL WEB3
              </button>
            )}
          </div>
        </div>

        {/* Bloque para elegir de una lista rápida de Fotos de Perfil (Sólo en Edición) */}
        {isEditingProfile && (
          <div className="px-5 pb-5 pt-1.5 border-t border-teal-900/40 bg-[#05171d]/30 text-xs">
            <span className="text-[9px] text-orange-400 font-mono font-bold block mb-2 uppercase">Preajustes de Atletas (Rostros de Rendimiento)</span>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { name: "Atleta Neón", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
                { name: "Culturista SciFi", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" },
                { name: "Corredor Cripto", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
                { name: "Coach Espacial", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setProfilePic(item.url)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#05171d] hover:bg-[#14f195]/10 border border-teal-850 rounded-lg text-teal-300 transition shrink-0"
                >
                  <img src={item.url} alt={item.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                  <span className="font-mono text-[9px] text-teal-200">{item.name}</span>
                </button>
              ))}
              <div className="flex items-center gap-2 max-w-sm flex-1 ml-auto">
                <input 
                  type="text"
                  placeholder="URL directa de foto (.jpg/.png)..."
                  value={profilePic}
                  onChange={(e) => setProfilePic(e.target.value)}
                  className="bg-[#05171d] text-[10px] font-mono border border-teal-850 rounded-lg py-1 px-2.5 w-full text-white focus:outline-none focus:border-orange-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. RECORRIDO DE DOS COLUMNAS ABAJO DEL BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA CHICA: BIOGRAFÍA Y MEDALLAS */}
        <div className="bg-[#082029] border border-teal-800/80 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            <div className="pb-4 border-b border-teal-900/40 text-xs">
              <span className="text-[9px] text-teal-400 font-mono font-bold block mb-1.5 uppercase">BIOGRAFÍA DEL ATLETA</span>
              {isEditingProfile ? (
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Escribe tu bio deportiva en la dApp"
                  rows={3}
                  className="w-full bg-[#05171d] text-xs border border-teal-850 rounded-xl p-2.5 focus:outline-none focus:border-cyan-400 text-teal-100 font-sans"
                />
              ) : (
                <p className="text-teal-200 italic leading-relaxed font-sans">
                  {profileBio}
                </p>
              )}
            </div>

            <div>
              <span className="text-[9px] text-teal-400 font-mono font-bold block mb-3 uppercase">MEDALLERO DE CONSENSO</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "badge_gen", label: "Cosecha Génesis", desc: "Balance inicial obtenido", unlocked: true, color: "text-[#14f195] bg-[#14f195]/10 border-[#14f195]/30" },
                  { id: "badge_con", label: "Consenso Firme", desc: "Simulación de minado activa", unlocked: true, color: "text-cyan-400 bg-cyan-400/10 border-cyan-450" },
                  { id: "badge_pos", label: "Fuerza On-Chain", desc: "Has alcanzado el nivel 2 o más", unlocked: userXp >= 100, color: "text-orange-400 bg-orange-400/10 border-orange-450" },
                  { id: "badge_wh", label: "Titán del Acero", desc: "Has validado ejercicios", unlocked: validatedSessions.length >= 2, color: "text-amber-300 bg-amber-300/10 border-[#14f195]/30" }
                ].map((badge) => (
                  <div 
                    key={badge.id}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center aspect-square transition group relative cursor-pointer ${
                      badge.unlocked 
                        ? badge.color 
                        : "text-teal-700 bg-[#05171d] border-teal-900/40 grayscale"
                    }`}
                  >
                    <Award className="w-5 h-5 mb-0.5" />
                    <span className="text-[7.5px] font-mono leading-none tracking-tighter truncate w-full block">{badge.label.split(" ")[0]}</span>
                    
                    <div className="absolute z-20 bottom-full mb-2 w-40 bg-[#05171d] border border-teal-800 text-xs text-teal-200 p-2.5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition duration-200 text-left scale-95 group-hover:scale-100 font-sans">
                      <p className="font-mono font-bold text-[#14f195]">{badge.label}</p>
                      <p className="text-[10px] text-teal-300 mt-1 leading-normal">{badge.desc}</p>
                      <p className="text-[9px] text-[#14f195] font-mono mt-1 uppercase font-bold">{badge.unlocked ? "✓ Unlocked" : "✖ Locked"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-teal-900/40 mt-4 flex items-center justify-between text-[11px] font-mono text-teal-400">
            <span>SUDOR TOTAL:</span>
            <span className="text-white font-extrabold">{userXp} XP</span>
          </div>
        </div>

        {/* COLUMNA GRANDE: ACTIVIDAD DE LA RED */}
        <div className="bg-[#082029] border border-teal-800/80 rounded-2xl p-5 md:p-6 lg:col-span-2 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-teal-900/40 mb-4">
              <div>
                <span className="text-[9px] bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase font-semibold">
                  Actividad de Red Descentralizada
                </span>
                <h4 className="text-sm font-mono font-extrabold text-white tracking-wide uppercase mt-1">
                  Firma de Sesiones y Auditorías de Bloques
                </h4>
              </div>
              <UserCheck className="w-5 h-5 text-[#14f195]" />
            </div>

            <p className="text-xs text-teal-200 leading-normal mb-5 font-sans">
              A continuación se listan las transacciones criptográficas firmadas por tu nodo local en la simulación de Solana de hoy. Cada bloque valida la anatomía de tu ejercicio y almacena de forma inmutable tus deudas de sudor en Proof of Sweat.
            </p>

            <div className="space-y-3.5">
              {validatedSessions.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-teal-850/60 text-center flex flex-col items-center justify-center gap-2.5">
                  <Award className="w-8 h-8 text-teal-600 animate-pulse" />
                  <p className="text-teal-300 text-xs font-mono uppercase font-bold">Consenso Limpio - No hay bloques validados hoy</p>
                  <p className="text-[11px] text-teal-400 max-w-sm mt-0.5 font-sans">
                    Para acuñar y auditar tus esfuerzos físicos, dirígete al apartado de <strong className="text-white">Ejercicios</strong>, busca tu entrenamiento preferido y presiona "Validar Bloque".
                  </p>
                  <button
                    onClick={() => setActiveTab("exercises")}
                    className="mt-3 px-4 py-2 rounded-lg bg-teal-900 bg-opacity-40 hover:bg-opacity-65 text-teal-300 hover:text-white border border-teal-800 transition font-mono text-xs uppercase cursor-pointer"
                  >
                    Navegar a Ejercicios
                  </button>
                </div>
              ) : (
                validatedSessions.map((sessionId, idx) => {
                  const mockHash = `5gXSwTip${sessionId.toUpperCase().substring(0, 4)}f2ZbR92${idx}Va77`;
                  return (
                    <div key={sessionId} className="p-4 rounded-xl bg-[#05171d]/90 border border-teal-900/60 hover:border-[#14f195]/40 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#14f195]/10 rounded-xl text-[#14f195] border border-[#14f195]/20 shrink-0">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-[#14f195] bg-[#14f195]/15 px-1.5 py-0.5 rounded border border-[#14f195]/20 uppercase font-black font-bold">CONFIRMADO</span>
                            <span className="text-[10px] text-teal-400 font-mono">Bloque #{142 + idx}</span>
                          </div>
                          <h5 className="font-mono text-xs font-bold text-white mt-1 uppercase truncate font-semibold">
                            Ejercicio: {sessionId}
                          </h5>
                          <p className="text-[10px] text-teal-300 font-mono mt-0.5 truncate" title={mockHash}>
                            Hash: <span className="text-cyan-400 font-bold select-all">{mockHash}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 border-teal-900/60 pt-2 sm:pt-0 w-full sm:w-auto">
                        <span className="block text-[11px] font-mono text-white font-bold">+30 Sweat XP</span>
                        <span className="text-[9px] text-[#14f195] font-mono uppercase tracking-wider font-extrabold">+90 $IMP Mined</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-[#05171d]/65 border border-teal-900/40 p-4 rounded-xl flex items-start gap-3 mt-6">
            <Info className="w-5 h-5 text-[#14f195] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-mono font-bold text-white uppercase">Sincronización Multi-Consensus</h5>
              <p className="text-[11px] leading-relaxed text-teal-350 font-sans">
                Tu dirección pública de wallet simula de forma local un nodo del validador. Si conectas una billetera activa como Phantom o Solflare, tus firmas locales serán legibles por otros validadores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
