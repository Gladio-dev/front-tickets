// src/features/tickets/components/TicketDetailModal.js
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

    const chatEndRef = useRef(null);

    useEffect(() => {
        if (!ticket?.id) return;

        async function loadChat() {
            try {
                setLoadingChat(true);
                const chatData = await ticketsService.getTicketMessages(ticket.id);
                setMessages(Array.isArray(chatData) ? chatData : []);
            } catch (err) {
                console.error("Error cargando mensajes:", err);
            } finally {
                setLoadingChat(false);
            }
        }

        loadChat();
    }, [ticket?.id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        try {
            setSending(true);
            const savedMessage = await ticketsService.sendTicketMessage(ticket.id, newMessage.trim());
            setMessages((prev) => [...prev, savedMessage]);
            setNewMessage('');
        } catch (err) {
            alert("No se pudo enviar el mensaje. Inténtalo de nuevo.");
        } finally {
            setSending(false);
        }
    };

    if (!ticket) return null;

    // Función interna para pintar los estados con estilo en la ficha técnica
    const getStatusStyle = (status) => {
        switch (status) {
            case 'ABIERTO': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'EN_PROGRESO': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'CERRADO': return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
            default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Cabecera */}
                <header className="p-6 border-b border-slate-800 flex justify-between items-start gap-4">
                    <div>
                        <span className="text-xs font-mono font-bold text-blue-400">AUDITORÍA DE CASO</span>
                        <h3 className="text-xl font-bold text-white mt-0.5">{ticket.title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
                    >
                        ✕
                    </button>
                </header>

                {/* Cuerpo con Scroll Interno */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 layout-dashboard-scroll">

                    {/* 🎯 NUEVA SECCIÓN: Ficha Técnica Detallada del Ticket */}
                    <section className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 space-y-4">
                        <h4 className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Metadatos del Reporte</h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                            <div>
                                <span className="block text-slate-500 font-medium">Estado actual</span>
                                <span className={`inline-block mt-1 px-2 py-0.5 font-bold rounded-sm border uppercase text-[10px] tracking-wider ${getStatusStyle(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <div>
                                <span className="block text-slate-500 font-medium">Área asignada</span>
                                <span className="block mt-1 font-semibold text-slate-200">{ticket.area || 'General'}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 font-medium">Tipo de ticket</span>
                                <span className="block mt-1 font-semibold text-slate-300 italic">{ticket.type || 'Sin tipificar'}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 font-medium">Fecha reporte</span>
                                <span className="block mt-1 font-mono text-slate-400">{formatDate(ticket.createdAt)}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 font-medium">Usuario afectado</span>
                                <span className="block mt-1 font-semibold text-slate-200">{ticket.user?.name || 'Anonimo'}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 font-medium">Empresa / Cliente</span>
                                <span className="block mt-1 font-semibold text-blue-400 font-mono text-[11px]">{ticket.user?.company || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Descripción extendida */}
                        <div className="border-t border-slate-800/60 pt-3 text-xs">
                            <span className="block text-slate-500 font-medium mb-1">Descripción del problema</span>
                            <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-850 whitespace-pre-wrap">
                                {ticket.description || 'El usuario no adjuntó ninguna descripción técnica para este caso.'}
                            </p>
                        </div>
                    </section>

                    {/* Historial de Conversación / Chat */}
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
                                    No hay mensajes registrados en este ticket. Comienza la conversación abajo.
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    // Evaluamos el alineamiento del chat basado en el Rol que guardó Spring Boot
                                    const isAdminMessage = msg.sender?.role === 'ADMIN';
                                    console.log(msg)
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col max-w-[85%] ${isAdminMessage ? 'self-end items-end' : 'self-start items-start'}`}
                                        >
                                            {/* Pintamos siempre el nombre real guardado en la base de datos */}
                                            <span className="text-[10px] text-slate-500 font-medium mb-1 px-1">
                                                {msg.sender?.name || 'Usuario'}
                                                {isAdminMessage && <span className="text-blue-400 font-bold ml-1 text-[9px]">(Admin)</span>}
                                            </span>

                                            {/* Globo de texto con color diferenciado por rol */}
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

                    {/* Formulario de respuestas */}
                    <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                        <div className="flex-1">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe una respuesta interna o mensaje para el cliente..."
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
    );
}