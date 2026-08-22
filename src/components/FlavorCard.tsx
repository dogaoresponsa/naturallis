import React from 'react';
import { Plus, Minus, Star, Info, Heart, Sparkles } from 'lucide-react';
import { GeladinhoProduct } from '../types';
import { formatCurrency } from '../utils/whatsapp';

interface FlavorCardProps {
  product: GeladinhoProduct;
  quantityInCart: number;
  onAddToCart: (product: GeladinhoProduct) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onOpenDetails: (product: GeladinhoProduct) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
}

export const FlavorCard: React.FC<FlavorCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails,
  isFavorite,
  onToggleFavorite,
}) => {
  const isTracked = product.trackStock !== false;
  const currentStock = isTracked ? (product.stockQuantity ?? 0) : 999;
  const isSoldOut = product.isAvailable === false || (isTracked && currentStock <= 0);
  const isLowStock = isTracked && !isSoldOut && currentStock <= (product.minStockAlert || 5);
  const isAvailable = !isSoldOut;
  const isMaxStockReached = isTracked && quantityInCart >= currentStock;

  return (
    <div
      className={`group relative bg-white rounded-3xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover-card-glow ${
        isAvailable
          ? 'border-stone-200/80 hover:border-rose-200'
          : 'border-stone-200 bg-stone-50/70 opacity-80'
      }`}
      id={`flavor-card-${product.id}`}
    >
      {/* Top badges & image */}
      <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-stone-100 mb-3.5 border border-stone-100 group">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out cursor-pointer ${
            isAvailable ? 'group-hover:scale-108' : 'grayscale-[40%]'
          }`}
          onClick={() => onOpenDetails(product)}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

        {/* Badges container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {isSoldOut ? (
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md bg-rose-600 text-white uppercase tracking-wider">
              Esgotado
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md bg-amber-500 text-white tracking-tight animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Restam {currentStock} un.
            </span>
          ) : null}
          {product.badges.slice(0, 2).map((badge, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-md ${
                badge.includes('Vendido') || badge.includes('Chef')
                  ? 'bg-rose-500 text-white shadow-rose-500/20'
                  : badge.includes('Zero') || badge.includes('Vegano') || badge.includes('Fit')
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : badge.includes('Álcool') || badge.includes('Drink')
                  ? 'bg-purple-600 text-white shadow-purple-600/20'
                  : 'bg-white/95 text-stone-800'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Favorite Heart & Info buttons */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            onClick={() => onToggleFavorite(product.id)}
            className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-90 cursor-pointer shadow-sm ${
              isFavorite ? 'bg-white text-rose-500 shadow-rose-500/20' : 'bg-black/30 text-white hover:bg-black/50'
            }`}
            title={isFavorite ? 'Remover dos favoritos' : 'Favoritar sabor'}
            aria-label="Favoritar"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={() => onOpenDetails(product)}
            className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-md transition-all active:scale-90 cursor-pointer shadow-sm"
            title="Ver detalhes e ingredientes"
            aria-label="Ver detalhes"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Volume tag */}
        <div className="absolute bottom-2.5 left-2.5 text-[11px] font-black text-white bg-black/50 px-2.5 py-0.5 rounded-lg backdrop-blur-md border border-white/10">
          {product.volumeMl}ml
        </div>

        {/* Rating */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[11px] font-black text-stone-800 shadow-sm">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{product.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="flex-1 space-y-1.5 cursor-pointer" onClick={() => onOpenDetails(product)}>
        <div className="flex items-center justify-between gap-1">
          <h3 className="font-black text-lg text-stone-900 leading-snug group-hover:text-rose-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>
        
        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-normal">
          {product.tagline || product.description}
        </p>

        {/* Stock status inline pill */}
        {isTracked && isAvailable && (
          <div className="pt-0.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1.5 ${
              isLowStock 
                ? 'bg-amber-50 text-amber-700 border border-amber-200/80' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLowStock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              {currentStock} {currentStock === 1 ? 'unidade em estoque' : 'unidades em estoque'}
            </span>
          </div>
        )}

        {/* Ingredients preview chips */}
        <div className="flex flex-wrap gap-1 pt-1">
          {product.ingredients.slice(0, 3).map((ing, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md border border-stone-200/50"
            >
              {ing}
            </span>
          ))}
          {product.ingredients.length > 3 && (
            <span className="text-[10px] text-stone-400 font-semibold px-1 self-center">
              +{product.ingredients.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Pricing and Action Control */}
      <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2">
        <div>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] text-stone-400 line-through block font-semibold leading-none">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
          <span className="text-xl font-black text-stone-900 tracking-tight">
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Counter or Add to Cart */}
        {isSoldOut ? (
          <span className="px-3.5 py-1.5 rounded-xl bg-stone-100 text-stone-400 font-bold text-xs border border-stone-200">
            Esgotado
          </span>
        ) : quantityInCart > 0 ? (
          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200/90 rounded-2xl p-1 shadow-xs">
            <button
              onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-xl bg-white hover:bg-rose-100 text-rose-600 font-bold transition-all cursor-pointer shadow-xs active:scale-90"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="w-6 text-center text-xs font-black text-stone-900">
              {quantityInCart}
            </span>

            <button
              onClick={() => {
                if (!isMaxStockReached) {
                  onUpdateQuantity(product.id, quantityInCart + 1);
                }
              }}
              disabled={isMaxStockReached}
              className={`w-7 h-7 flex items-center justify-center rounded-xl font-bold transition-all shadow-xs active:scale-90 ${
                isMaxStockReached 
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white cursor-pointer shadow-rose-500/20'
              }`}
              title={isMaxStockReached ? `Limite de estoque (${currentStock} un.)` : 'Aumentar'}
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAddToCart(product)}
            className="px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md shadow-stone-900/10 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer group/add hover:bg-rose-600"
            id={`add-btn-${product.id}`}
          >
            <Plus className="w-3.5 h-3.5 text-rose-300 group-hover/add:text-white" />
            <span>Adicionar</span>
          </button>
        )}
      </div>
    </div>
  );
};
