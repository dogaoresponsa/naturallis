import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, MessageSquare, HelpCircle, ShieldCheck, Heart, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { REVIEWS_DATA, FAQ_DATA } from '../data/products';

export const TestimonialsAndFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 border-t border-stone-200/80 mt-12">
      {/* 1. Customer Reviews Showcase */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-xs font-black uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Depoimentos Reais</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
            Quem prova, se apaixona!
          </h2>
          <p className="text-sm text-stone-500 mt-1 font-normal">
            Mais de 1.200 geladinhos entregues com nota máxima em cremosidade e sabor artesanal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs hover-card-glow transition-all flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Stars & Verified Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Compra Verificada
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal italic">
                  "{rev.comment}"
                </p>

                {/* Favorite Flavor tag */}
                <div className="inline-flex items-center gap-1.5 bg-stone-50 text-stone-700 border border-stone-200/80 text-[11px] font-bold px-3 py-1 rounded-xl">
                  <Sparkles className="w-3 h-3 text-rose-500" />
                  <span>Sabor Favorito: <strong className="text-stone-900">{rev.favoriteFlavor}</strong></span>
                </div>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100 mt-4">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  className="w-10 h-10 rounded-full object-cover border-2 border-rose-100 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-black text-stone-900">{rev.author}</h4>
                  <p className="text-[10px] text-stone-400 font-medium">{rev.city} • {rev.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. FAQ Accordion */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-black uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Tudo o que você precisa saber sobre nossos geladinhos e entregas.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-black text-stone-900 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${isOpen ? 'bg-rose-50 text-rose-600' : 'bg-stone-100 text-stone-500'}`}>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed font-normal border-t border-stone-100 bg-stone-50/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
