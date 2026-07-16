'use client';

import { useState, useEffect, useRef } from 'react';
import { ticketsService } from '@/features/tickets/services/ticketsService';
import { useAuth } from '@/features/auth';
import { formatDate } from '@/utils/formatters';

export function UserTicketDetailModal({ ticket, onClose }) {
    const { user: currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loadingChat, setLoadingChat] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    const chatEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Cargar mensajes del ticket
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

    // Scroll automático al último mensaje
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Manejar envío de mensaje
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        try {
            setSending(true);
            const savedMessage = await ticketsService.sendTicketMessage(ticket.id, newMessage.trim());
            setMessages((prev) => [...prev, savedMessage]);
            setNewMessage('');
            // Mantener el foco en el textarea
            textareaRef.current?.focus();
        } catch (err) {
            alert("No se pudo enviar el mensaje. Inténtalo de nuevo.");
        } finally {
            setSending(false);
        }
    };

    // Manejar Enter para enviar
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    if (!ticket) return null;

    // Mapeo de estados a versiones amigables
    const STATUS_MAP = {
        'ABIERTO': 'Abierto',
        'EN_PROCESO': 'En Proceso',
        'RESUELTO': 'Resuelto'
    };

    // Colores de estados (estilo claro)
    const getStatusStyle = (status) => {
        switch (status) {
            case 'ABIERTO': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'EN_PROCESO': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'RESUELTO': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Formatear área para mostrar
    const getAreaLabel = (area) => {
        if (area === 'ODOO') return 'Odoo';
        if (area === 'SUPPORT') return 'Soporte';
        return area || 'Sin asignar';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Cabecera */}
                <header className="p-6 border-b border-slate-200 flex justify-between items-start gap-4 bg-slate-50 rounded-t-2xl">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold text-blue-600">TICKET #{ticket.id}</span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusStyle(ticket.status)}`}>
                                {STATUS_MAP[ticket.status] || ticket.status}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 truncate">{ticket.title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                {/* Cuerpo con Scroll Interno */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1">

                    {/* Ficha Técnica del Ticket */}
                    <section className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                        <h4 className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Detalles del ticket</h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="block text-slate-500 font-medium text-xs">Área</span>
                                <span className="block mt-1 font-semibold text-slate-900">{getAreaLabel(ticket.area)}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 font-medium text-xs">Fecha de creación</span>
                                <span className="block mt-1 font-mono text-slate-700 text-xs">{formatDate(ticket.createdAt)}</span>
                            </div>
                            {ticket.assignedTo && (
                                <div>
                                    <span className="block text-slate-500 font-medium text-xs">Asignado a</span>
                                    <span className="block mt-1 font-semibold text-slate-900 text-sm">{ticket.assignedTo.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="border-t border-slate-200 pt-3">
                            <span className="block text-slate-500 font-medium text-xs mb-1">Descripción</span>
                            <p className="text-slate-700 text-sm leading-relaxed bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">
                                {ticket.description || 'Sin descripción proporcionada.'}
                            </p>
                        </div>
                    </section>

                    {/* Historial de Mensajes */}
                    <section className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Mensajes</h4>

                        <div className="border border-slate-200 bg-slate-50 rounded-xl p-4 h-64 overflow-y-auto space-y-3 flex flex-col">
                            {loadingChat ? (
                                <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-500">
                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs">Cargando mensajes...</span>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center text-slate-400 text-sm my-auto italic">
                                    No hay mensajes en este ticket.
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    // Determinar si el mensaje es del usuario actual
                                    const isMyMessage = msg.sender?.id === currentUser?.id;
                                    const isAdminMessage = msg.sender?.role === 'ADMIN';
                                    
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col max-w-[85%] ${isMyMessage ? 'self-end items-end' : 'self-start items-start'}`}
                                        >
                                            <span className="text-[10px] text-slate-500 font-medium mb-1 px-1">
                                                {isMyMessage ? 'Tú' : (msg.sender?.name || 'Usuario')}
                                                {isAdminMessage && !isMyMessage && (
                                                    <span className="text-blue-600 font-bold ml-1 text-[9px]">(Admin)</span>
                                                )}
                                            </span>

                                            <div className={`p-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm
                                                ${isMyMessage
                                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}
                                            >
                                                {msg.content}
                                            </div>

                                            <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">
                                                {formatDate(msg.createdAt)}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    </section>

                    {/* Formulario de mensaje */}
                    <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                        <div className="flex-1">
                            <textarea
                                ref={textareaRef}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribe un mensaje..."
                                rows="2"
                                disabled={loadingChat || sending}
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || sending || loadingChat}
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[52px]"
                        >
                            {sending ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Enviar</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}