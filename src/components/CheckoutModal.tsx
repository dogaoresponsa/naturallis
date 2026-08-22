import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShoppingBag, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Send, 
  Clock, 
  Building2, 
  Check, 
  Copy, 
  AlertCircle,
  Sparkles,
  Phone,
  User,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, CartComboItem, CustomerDetails, StoreSettings, DeliveryType, PaymentMethod } from '../types';
import { NEIGHBORHOODS_DATA } from '../data/products';
import { formatCurrency, generateWhatsAppMessage, buildWhatsAppUrl, generateShortOrderId } from '../utils/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  combos: CartComboItem[];
  storeSettings: StoreSettings;
  onOrderCompleted: (orderSummary: any, whatsappUrl: string, rawMessage: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  combos,
  storeSettings,
  onOrderCompleted,
}) => {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState(NEIGHBORHOODS_DATA[0].name);
  const [complement, setComplement] = useState('');
  const [reference, setReference] = useState('');
  const [city, setCity] = useState(storeSettings.city);
  
  const [deliveryOption, setDeliveryOption] = useState<'agora' | 'agendado'>('agora');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [changeFor, setChangeFor] = useState('');
  const [notes, setNotes] = useState('');

  const [copiedPix, setCopiedPix] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Calculate values
  const itemsSubtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const combosSubtotal = combos.reduce((acc, c) => acc + c.combo.price * c.quantity, 0);
  const subtotal = itemsSubtotal + combosSubtotal;

  const isFreeDelivery = subtotal >= storeSettings.freeDeliveryThreshold;

  // Selected neighborhood fee
  const selectedNeighborhoodObj = NEIGHBORHOODS_DATA.find((n) => n.name === neighborhood);
  const rawDeliveryFee = deliveryType === 'delivery' ? (selectedNeighborhoodObj ? selectedNeighborhoodObj.fee : storeSettings.standardDeliveryFee) : 0;
  const deliveryFee = isFreeDelivery || deliveryType === 'retirada' ? 0 : rawDeliveryFee;

  const total = subtotal + deliveryFee;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(storeSettings.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleFinishOrder = () => {
    setErrorMessage('');

    // Validations
    if (!name.trim()) {
      setErrorMessage('Por favor, informe o seu nome.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Por favor, informe um número de WhatsApp válido com DDD.');
      return;
    }

    if (deliveryType === 'delivery') {
      if (!street.trim() || !number.trim()) {
        setErrorMessage('Por favor, informe a Rua e o Número para a entrega.');
        return;
      }
      if (!neighborhood.trim()) {
        setErrorMessage('Por favor, selecione ou informe o seu Bairro.');
        return;
      }
    }

    if (deliveryOption === 'agendado' && (!scheduledDate || !scheduledTime)) {
      setErrorMessage('Por favor, informe a data e o horário desejado para a entrega agendada.');
      return;
    }

    const customerDetails: CustomerDetails = {
      name: name.trim(),
      phone: phone.trim(),
      deliveryType,
      street: street.trim(),
      number: number.trim(),
      neighborhood: neighborhood.trim(),
      complement: complement.trim(),
      reference: reference.trim(),
      city: city.trim(),
      paymentMethod,
      changeFor: paymentMethod === 'dinheiro' ? changeFor : undefined,
      deliveryOption,
      scheduledDate: deliveryOption === 'agendado' ? scheduledDate : undefined,
      scheduledTime: deliveryOption === 'agendado' ? scheduledTime : undefined,
      notes: notes.trim() ? notes.trim() : undefined,
    };

    const orderId = generateShortOrderId();

    const summaryData = {
      items,
      combos,
      customer: customerDetails,
      deliveryFee,
      subtotal,
      discount: 0,
      total,
      storeSettings,
      orderId,
    };

    const formattedMessage = generateWhatsAppMessage(summaryData);
    const whatsappUrl = buildWhatsAppUrl(storeSettings.whatsappNumber, formattedMessage);

    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onOrderCompleted(summaryData, whatsappUrl, formattedMessage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-stone-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div className="p-4 sm:p-5 bg-white text-stone-900 flex items-center justify-between border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl text-stone-900 tracking-tight">Finalizar Pedido</h2>
              <p className="text-xs text-stone-500 font-normal">
                Preencha os dados e receba seu pedido geladinho rapidamente via WhatsApp!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Error notification banner if any */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-700 animate-in shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Delivery Type Switcher */}
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
              1. Como deseja receber seu pedido?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  deliveryType === 'delivery'
                    ? 'border-rose-500 bg-rose-50/50 text-stone-900 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                }`}
              >
                <div className={`p-2 rounded-xl ${deliveryType === 'delivery' ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-stone-900">Entrega Delivery</p>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {isFreeDelivery ? '🎉 Frete Grátis!' : `A partir de ${formatCurrency(5.00)}`}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('retirada')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  deliveryType === 'retirada'
                    ? 'border-rose-500 bg-rose-50/50 text-stone-900 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                }`}
              >
                <div className={`p-2 rounded-xl ${deliveryType === 'retirada' ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-stone-900">Retirada no Balcão</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Grátis • Sem taxa</p>
                </div>
              </button>
            </div>

            {deliveryType === 'retirada' && (
              <div className="mt-2.5 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 font-medium">
                📍 <strong>Local de Retirada:</strong> {storeSettings.address} ({storeSettings.city})
              </div>
            )}
          </div>

          {/* 2. Customer Contact Info */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              2. Seus Dados de Contato
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Seu Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Maria Silva"
                    className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  WhatsApp com DDD *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: (11) 99999-8888"
                    className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Address Information (If delivery) */}
          {deliveryType === 'delivery' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                3. Endereço de Entrega
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Street */}
                <div className="sm:col-span-8">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Rua / Avenida *
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ex: Rua das Flores"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                {/* Number */}
                <div className="sm:col-span-4">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Ex: 123 ou S/N"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                {/* Neighborhood selector */}
                <div className="sm:col-span-6">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Bairro (com taxa de entrega) *
                  </label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
                  >
                    {NEIGHBORHOODS_DATA.map((n) => (
                      <option key={n.name} value={n.name}>
                        {n.name} ({isFreeDelivery ? 'Frete Grátis' : formatCurrency(n.fee)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Complement */}
                <div className="sm:col-span-6">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Complemento (Apto, Bloco, Casa 2)
                  </label>
                  <input
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Ex: Bloco B Apto 42"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                {/* Reference point */}
                <div className="sm:col-span-12">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Ponto de Referência
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ex: Próximo à padaria central, casa com portão branco"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Delivery Schedule */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              4. Quando deseja receber?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryOption('agora')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  deliveryOption === 'agora'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 text-stone-700 bg-white hover:bg-stone-50'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>O quanto antes (hoje)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryOption('agendado')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  deliveryOption === 'agendado'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 text-stone-700 bg-white hover:bg-stone-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar data / hora</span>
              </button>
            </div>

            {deliveryOption === 'agendado' && (
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200 animate-in fade-in">
                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Data Desejada
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Horário Aproximado
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. Payment Method */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              5. Forma de Pagamento
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                }`}
              >
                <QrCode className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs font-bold block">PIX</span>
                <span className="text-[10px] text-emerald-700 font-medium">Mais Rápido</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cartao_entrega')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'cartao_entrega'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-rose-500" />
                <span className="text-xs font-bold block">Cartão</span>
                <span className="text-[10px] text-stone-500 font-medium">Na Entrega</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('dinheiro')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'dinheiro'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                }`}
              >
                <Banknote className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                <span className="text-xs font-bold block">Dinheiro</span>
                <span className="text-[10px] text-stone-500 font-medium">Com Troco</span>
              </button>
            </div>

            {/* Pix key copy preview */}
            {paymentMethod === 'pix' && (
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-stone-500 font-medium text-[11px] block">
                    Chave PIX ({storeSettings.pixKeyType}):
                  </span>
                  <span className="font-mono font-bold text-emerald-800 select-all">
                    {storeSettings.pixKey}
                  </span>
                  <span className="text-[10px] text-stone-500 block font-medium">
                    Titular: {storeSettings.pixName}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            )}

            {/* Change for cash */}
            {paymentMethod === 'dinheiro' && (
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Precisa de troco para quanto?
                </label>
                <input
                  type="text"
                  value={changeFor}
                  onChange={(e) => setChangeFor(e.target.value)}
                  placeholder="Ex: Troco para R$ 50,00 (ou deixe em branco se não precisar)"
                  className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            )}
          </div>

          {/* 6. General observations */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Observações Gerais do Pedido (Opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ex: Chamar no interfone 102, enviar colherzinha descartável, etc."
              className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs text-stone-900 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
        </div>

        {/* Modal Bottom Summary & WhatsApp Submit */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-100 space-y-3">
          {/* Order Totals Recap */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600 font-medium">
              <span>Subtotal dos Geladinhos:</span>
              <span className="font-bold text-stone-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600 font-medium">
              <span>Taxa de Entrega ({deliveryType === 'delivery' ? neighborhood : 'Retirada'}):</span>
              <span className="font-bold text-stone-900">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold">GRÁTIS</span>
                ) : (
                  formatCurrency(deliveryFee)
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-stone-900 pt-1.5 border-t border-stone-200/60">
              <span>Total a Pagar:</span>
              <span className="text-rose-600 text-lg">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Big Green WhatsApp Send Action */}
          <button
            onClick={handleFinishOrder}
            className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            id="checkout-send-whatsapp-btn"
          >
            <Send className="w-5 h-5" />
            <span>Enviar Pedido para o WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
