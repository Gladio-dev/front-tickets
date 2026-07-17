'use client';

import { useState, useEffect, useRef } from 'react';
import { ticketsService } from '../services/ticketsService';
import { useAuth } from '@/features/auth';
import { formatDate } from '@/utils/formatters';
import Button from '@/components/Button';

export function TicketDetailModal({ ticket, onClose }) {
    const { user: currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loadingChat, setLoadingChat] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    // Estados para asignación
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [loadingAdmins, setLoadingAdmins] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    const [assigning, setAssigning] = useState(false);
    const [ticketData, setTicketData] = useState(ticket);
    const [loadingTicket, setLoadingTicket] = useState(false);
    const [resolutionText, setResolutionText] = useState('');
    const textareaRef = useRef(null);

    // Nuevos estados para acciones de estado
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const chatEndRef = useRef(null);

    // Cargar mensajes al abrir el modal
    useEffect(() => {
        if (!ticket?.id) return;

        async function loadMessages() {
            try {
                setLoadingChat(true);
                const chatData = await ticketsService.getTicketMessages(ticket.id);
                setMessages(Array.isArray(chatData) ? chatData : []);
            } catch (err) {
                console.error("Error cargando mensajes:", err);
                setMessages([]);
            } finally {
                setLoadingChat(false);
            }
        }

        loadMessages();
    }, [ticket?.id]);

    // Scroll automático al último mensaje
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Cargar admins cuando se abre el modal de asignación
    useEffect(() => {
        if (showAssignModal) {
            fetchAdmins();
        }
    }, [showAssignModal]);

    // Enviar mensaje
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending || !ticketData?.id) return;

        try {
            setSending(true);
            const savedMessage = await ticketsService.sendTicketMessage(ticketData.id, newMessage.trim());
            setMessages((prev) => [...prev, savedMessage]);
            setNewMessage('');
        } catch (err) {
            alert("No se pudo enviar el mensaje. Inténtalo de nuevo.");
        } finally {
            setSending(false);
        }
    };

    // Obtener lista de admins
    const fetchAdmins = async () => {
        try {
            setLoadingAdmins(true);
            const data = await ticketsService.getAdmins();
            setAdmins(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error cargando admins:", err);
            alert("No se pudo cargar la lista de administradores.");
        } finally {
            setLoadingAdmins(false);
        }
    };

    // Asignar admin al ticket
    const handleAssignAdmin = async () => {
        if (!selectedAdminId) {
            alert("Por favor, selecciona un administrador.");
            return;
        }

        if (!ticketData?.id) {
            alert("Error: No se encontró el ticket.");
            return;
        }

        try {
            setAssigning(true);
            await ticketsService.assignTicket(ticketData.id, selectedAdminId);

            const adminAsignado = admins.find(a => a.id === selectedAdminId);
            if (adminAsignado) {
                setTicketData({
                    ...ticketData,
                    assignedTo: adminAsignado
                });
            }

            setShowAssignModal(false);
            setSelectedAdminId(null);

            alert("✅ Administrador asignado correctamente.");
        } catch (err) {
            console.error("Error asignando admin:", err);
            alert("No se pudo asignar el administrador. Inténtalo de nuevo.");
        } finally {
            setAssigning(false);
        }
    };

    // NUEVA FUNCIÓN: Cambiar estado a EN_PROGRESO
    const handleStartProcess = async () => {
        if (!ticketData?.id) return;

        if (!confirm("¿Estás seguro de que quieres iniciar el proceso de este ticket?")) {
            return;
        }

        try {
            setUpdatingStatus(true);
            await ticketsService.startTicketProcess(ticketData.id);

            // Actualizar el ticket localmente
            setTicketData({
                ...ticketData,
                status: 'EN_PROGRESO'
            });

            alert("✅ Ticket en proceso.");
        } catch (err) {
            console.error("Error iniciando proceso:", err);
            alert("No se pudo iniciar el proceso. Inténtalo de nuevo.");
        } finally {
            setUpdatingStatus(false);
        }
    };

    // NUEVA FUNCIÓN: Cambiar estado a RESUELTO
    const handleSolveTicket = async () => {
        if (!ticketData?.id) return;

        if (!confirm("¿Estás seguro de que quieres finalizar este ticket?")) {
            return;
        }

        try {
            setUpdatingStatus(true);
            await ticketsService.solveTicket(ticketData.id, resolutionText.trim());

            // Actualizar el ticket localmente
            setTicketData({
                ...ticketData,
                status: 'RESUELTO'
            });

            alert("✅ Ticket resuelto.");
        } catch (err) {
            console.error("Error resolviendo ticket:", err);
            alert("No se pudo resolver el ticket. Inténtalo de nuevo.");
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Función para cerrar el modal principal
    const handleClose = () => {
        setShowAssignModal(false);
        setSelectedAdminId(null);
        setAdmins([]);
        if (onClose) {
            onClose();
        }
    };

    const handleTextareaChange = (e) => {
        setResolutionText(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };
    // Si no hay ticket, no renderizar nada
    if (!ticket) {
        return null;
    }

    // Si no hay datos del ticket
    if (!ticketData) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
                <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-8">
                    <p className="text-red-400 text-center">Error al cargar los datos del ticket.</p>
                    <button
                        onClick={handleClose}
                        className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        );
    }

    // Función para pintar los estados
    const getStatusStyle = (status) => {
        switch (status) {
            case 'ABIERTO': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'EN_PROGRESO': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'RESUELTO': return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
            default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        }
    };

    return (
        <>
            {/* MODAL PRINCIPAL */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        handleClose();
                    }
                }}
            >
                <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

                    {/* Cabecera */}
                    <header className="p-6 border-b border-slate-800 flex justify-between items-start gap-4 flex-shrink-0">
                        <div className="flex-1 min-w-0">
                            <span className="text-xs font-mono font-bold text-blue-400">Detalles de ticket</span>
                           <div className="flex flex-wrap gap-8"> 
                            <h3 className="text-xl font-bold text-white mt-0.5 truncate">
                                Ticket: #{ticketData.id}
                            </h3>
                            <h3 className="text-xl font-bold text-white mt-0.5 truncate">
                                Título: {ticketData?.title || 'Ticket'}
                            </h3>
                            
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors flex-shrink-0"
                        >
                            ✕
                        </button>
                        
                        
                    </header>
                    
                    {/* Cuerpo */}
                    <div className="p-6 overflow-y-auto space-y-6 flex-1">

                        {/* Ficha Técnica */}
                        <section className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 space-y-4">
                            <h4 className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Metadatos del Reporte</h4>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                                <div>
                                    <span className="block text-slate-500 font-medium">Estado actual</span>
                                    <span className={`inline-block mt-1 px-2 py-0.5 font-bold rounded-sm border uppercase text-[10px] tracking-wider ${getStatusStyle(ticketData.status)}`}>
                                        {ticketData.status || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 font-medium">Área asignada</span>
                                    <span className="block mt-1 font-semibold text-slate-200">{ticketData.area || 'General'}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 font-medium">Tipo de ticket</span>
                                    <span className="block mt-1 font-semibold text-slate-300 italic">{ticketData.type || 'Sin tipificar'}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 font-medium">Fecha reporte</span>
                                    <span className="block mt-1 font-mono text-slate-400">{formatDate(ticketData.createdAt)}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 font-medium">Usuario afectado</span>
                                    <span className="block mt-1 font-semibold text-slate-200">{ticketData.user?.name || 'Anonimo'}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 font-medium">Empresa / Cliente</span>
                                    <span className="block mt-1 font-semibold text-blue-400 font-mono text-[11px]">{ticketData.user?.company || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Asignado a */}
                            <div className="border-t border-slate-800/60 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="block text-slate-500 font-medium text-xs">Asignado a</span>

                                    {ticketData.status === 'ABIERTO' && !ticketData.assignedTo && (
                                        <button
                                            onClick={() => setShowAssignModal(true)}
                                            className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Asignar administrador
                                        </button>
                                    )}
                                </div>

                                {ticketData.assignedTo ? (
                                    <div className="mt-2 flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                                            {ticketData.assignedTo.name?.charAt(0).toUpperCase() || 'A'}
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-slate-200">
                                                {ticketData.assignedTo.name || 'Sin nombre'}
                                            </span>
                                            <span className="text-xs text-slate-400 ml-2">
                                                {ticketData.assignedTo.email}
                                            </span>
                                        </div>
                                        <span className="ml-auto text-[10px] font-mono text-blue-400 bg-blue-600/20 px-2 py-0.5 rounded">
                                            ADMIN
                                        </span>
                                    </div>
                                ) : (
                                    <div className="mt-2 text-sm text-slate-400 italic">
                                        {ticketData.status === 'ABIERTO'
                                            ? 'Sin asignar - Haz clic en el botón para asignar un administrador'
                                            : 'Sin asignar'}
                                    </div>
                                )}
                            </div>

                            {/* NUEVA SECCIÓN: Acciones por estado */}
                            <div className="border-t border-slate-800/60 pt-3">
                                {/* Contenedor principal: ahora es flex-col si está EN_PROCESO para dar espacio al textarea abajo */}
                                <div className={`flex ${ticketData.status === 'EN_PROCESO' ? 'flex-col gap-3' : 'items-center justify-between'}`}>

                                    {/* Fila superior: Acciones y Botones */}
                                    <div className="flex items-center justify-between w-full">
                                        <span className="block text-slate-500 font-medium text-xs">Acciones</span>

                                        <div className="flex gap-2">
                                            {/* Si está ABIERTO */}
                                            {ticketData.status === 'ABIERTO' && (
                                                <button
                                                    onClick={handleStartProcess}
                                                    disabled={updatingStatus}
                                                    className="text-xs px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {updatingStatus ? (
                                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <>
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                            Iniciar proceso
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            {/* Si está EN_PROCESO */}
                                            {ticketData.status === 'EN_PROCESO' && (
                                                <button
                                                    onClick={handleSolveTicket}
                                                /* El botón ahora se deshabilita si está cargando O si el texto está vacío / son solo espacios */
        
                                                    disabled={updatingStatus || !resolutionText.trim()}
                                                    className="text-xs px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40 disabled:hover:bg-green-600 disabled:cursor-not-allowed"
                                                >
                                                    {updatingStatus ? (
                                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <>
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Resolver
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            {/* Si está RESUELTO */}
                                            {ticketData.status === 'RESUELTO' && (
                                                <span className="text-xs text-slate-400 italic">Ticket finalizado</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sección del Campo de Texto (Solo visible en EN_PROCESO) */}
                                    {ticketData.status === 'EN_PROCESO' && (
                                        <div className="w-full">
                                            <textarea
                                                ref={textareaRef}
                                                rows={1}
                                                value={resolutionText}
                                                onChange={handleTextareaChange}
                                                placeholder="Escribe una breve nota de resolución para poder cerrar el ticket..."
                                                className="w-full text-xs px-3 py-2 bg-slate-900/50 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-lg focus:outline-none focus:border-green-600/50 resize-none overflow-hidden transition-colors min-h-[32px] max-h-[120px]"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="border-t border-slate-800/60 pt-3 text-xs">
                                <span className="block text-slate-500 font-medium mb-1">Descripción del problema</span>
                                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-850 whitespace-pre-wrap">
                                    {ticketData.description || 'El usuario no adjuntó ninguna descripción técnica para este caso.'}
                                </p>
                            </div>
                        </section>

                        {/* Chat */}
                        <section className="space-y-3">
                            <h4 className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Bitácora de Mensajes</h4>

                            <div className="border border-slate-800/80 bg-slate-950/50 rounded-xl p-4 h-64 overflow-y-auto space-y-3 flex flex-col">
                                {loadingChat ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-500">
                                        <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs">Sincronizando bitácora...</span>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center text-slate-600 text-xs my-auto italic">
                                        No hay mensajes registrados en este ticket.
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isAdminMessage = msg.sender?.role === 'ADMIN';
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex flex-col max-w-[85%] ${isAdminMessage ? 'self-end items-end' : 'self-start items-start'}`}
                                            >
                                                <span className="text-[10px] text-slate-500 font-medium mb-1 px-1">
                                                    {msg.sender?.name || 'Usuario'}
                                                    {isAdminMessage && <span className="text-blue-400 font-bold ml-1 text-[9px]">(Admin)</span>}
                                                </span>

                                                <div className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap shadow-xs
                                                    ${isAdminMessage
                                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                                        : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}
                                                >
                                                    {msg.content}
                                                </div>

                                                <span className="text-[9px] text-slate-600 font-mono mt-1 px-1">
                                                    {formatDate(msg.createdAt)}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        </section>

                        {/* Formulario */}
                        <form onSubmit={handleSendMessage} className="flex gap-2 items-end flex-shrink-0">
                            <div className="flex-1">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escribe una respuesta..."
                                    rows="2"
                                    disabled={loadingChat || sending}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={!newMessage.trim() || sending || loadingChat}
                            >
                                {sending ? '...' : 'Enviar'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* MODAL DE ASIGNACIÓN */}
            {showAssignModal && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowAssignModal(false);
                            setSelectedAdminId(null);
                        }
                    }}
                >
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">

                        <header className="p-6 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
                            <h3 className="text-lg font-bold text-white">Asignar administrador</h3>
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedAdminId(null);
                                }}
                                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
                            >
                                ✕
                            </button>
                        </header>

                        <div className="p-6 overflow-y-auto flex-1">
                            {loadingAdmins ? (
                                <div className="flex flex-col items-center justify-center h-40 gap-3">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-slate-400 text-sm">Cargando administradores...</span>
                                </div>
                            ) : admins.length === 0 ? (
                                <div className="text-center text-slate-400 text-sm py-8">
                                    No hay administradores disponibles.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {admins.map((admin) => (
                                        <div
                                            key={admin.id}
                                            onClick={() => setSelectedAdminId(admin.id)}
                                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer
                                                ${selectedAdminId === admin.id
                                                    ? 'border-blue-500 bg-blue-600/10'
                                                    : 'border-slate-700 hover:border-slate-500 bg-slate-800/30'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                                                    {admin.name?.charAt(0).toUpperCase() || 'A'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-200 truncate">
                                                        {admin.name || 'Sin nombre'}
                                                    </p>
                                                    <p className="text-xs text-slate-400 truncate">
                                                        {admin.email}
                                                    </p>
                                                </div>
                                                {selectedAdminId === admin.id && (
                                                    <div className="text-blue-500">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-800 flex gap-3 flex-shrink-0">
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedAdminId(null);
                                }}
                                className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
                                disabled={assigning}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAssignAdmin}
                                disabled={!selectedAdminId || assigning}
                                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {assigning ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Asignando...
                                    </>
                                ) : (
                                    'Confirmar asignación'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}