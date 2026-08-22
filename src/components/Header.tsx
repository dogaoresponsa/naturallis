import React from 'react';
import { ShoppingBag, Sparkles, Clock, Phone, MapPin, Shield, Lock } from 'lucide-react';
import { StoreSettings } from '../types';
import { formatCurrency } from '../utils/whatsapp';

interface HeaderProps {
  storeSettings: StoreSettings;
  cartCount: number;
  cartTotal: number;
  isAdminAuthenticated?: boolean;
  onOpenCart: () => void;
  onOpenQuiz: () => void;
  onOpenAdminAuth?: () => void;
  onOpenAdminPanel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  storeSettings,
  cartCount,
  cartTotal,
  isAdminAuthenticated = false,
  onOpenCart,
  onOpenQuiz,
  onOpenAdminAuth,
  onOpenAdminPanel,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-200/70 shadow-xs transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-200 text-xs font-medium py-1.5 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] uppercase tracking-wider font-bold">
              ✨ Destaque
            </span>
            <span className="text-stone-300 text-xs">
              Entrega <strong>GRÁTIS</strong> para pedidos acima de <span className="text-white font-bold">{formatCurrency(storeSettings.freeDeliveryThreshold)}</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-stone-400 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{storeSettings.openingHoursText}</span>
            </div>
            <span className="text-stone-700">•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{storeSettings.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-md shadow-rose-500/20 transform group-hover:scale-105 transition-all">
            <span className="text-lg font-black tracking-tight">G</span>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" title="Loja Aberta" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight leading-none">
                {storeSettings.storeName}
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                Gourmet
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block font-medium mt-0.5">
              {storeSettings.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Mode active badge button (if logged in) */}
          {isAdminAuthenticated ? (
            <button
              onClick={onOpenAdminPanel}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200/80 border border-amber-300 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
              title="Painel do Administrador Ativo"
              id="header-admin-active-btn"
            >
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Modo Lojista</span>
              <span className="sm:hidden">Admin</span>
            </button>
          ) : null}

          {/* Quiz Button for Customers */}
          <button
            onClick={onOpenQuiz}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100/80 hover:bg-stone-200/80 hover:text-stone-900 border border-stone-200/80 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            title="Descubra o sabor perfeito para o seu paladar"
            id="header-quiz-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Descobrir Sabor</span>
          </button>

          {/* WhatsApp Direct contact for Customers */}
          <a
            href={`https://wa.me/${storeSettings.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre os geladinhos gourmet.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl transition-all shadow-xs"
            id="header-whatsapp-btn"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Direto</span>
          </a>

          {/* Customer Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-stone-900/10 active:scale-95 transition-all cursor-pointer"
            id="header-cart-button"
            aria-label="Ver sacola de pedidos"
          >
            <ShoppingBag className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Sacola</span>
            
            {cartCount > 0 && (
              <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-xs">
                {cartCount}
              </span>
            )}

            {cartTotal > 0 && (
              <span className="hidden md:inline text-xs font-bold text-stone-300 pl-1 border-l border-stone-700">
                {formatCurrency(cartTotal)}
              </span>
            )}
          </button>

          {/* Subtle Merchant Access Icon for store manager if not logged in */}
          {!isAdminAuthenticated && onOpenAdminAuth && (
            <button
              onClick={onOpenAdminAuth}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title="Acesso do Lojista / Painel Admin"
              aria-label="Acesso do Lojista"
              id="header-admin-login-btn"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
