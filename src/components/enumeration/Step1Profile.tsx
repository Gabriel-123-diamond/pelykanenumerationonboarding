import React from 'react';
import { MapPin, Upload, Plus, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Outlet } from '../../types';

interface Step1Props {
  formData: Partial<Outlet>;
  setFormData: (data: Partial<Outlet>) => void;
  photos: File[];
  setPhotos: (photos: File[]) => void;
  phoneError: string | null;
  setPhoneError: (err: string | null) => void;
  whatsappError: string | null;
  setWhatsappError: (err: string | null) => void;
}

export const Step1Profile: React.FC<Step1Props> = ({
  formData, setFormData, photos, setPhotos, phoneError, setPhoneError, whatsappError, setWhatsappError
}) => {
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (url: string) => {
    const updated = (formData.photoUrls || []).filter(u => u !== url);
    setFormData({ ...formData, photoUrls: updated });
  };

  const TimeSelect = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
    const [h, m] = (value || '08:00').split(':');
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];

    return (
      <div className="space-y-2">
        <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">{label}</label>
        <div className="flex gap-2">
          <select
            value={h}
            onChange={(e) => onChange(`${e.target.value}:${m}`)}
            className="flex-1 bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none text-center"
          >
            {hours.map(hr => <option key={hr} value={hr}>{hr}</option>)}
          </select>
          <div className="flex items-center text-stone-300 font-black">:</div>
          <select
            value={m}
            onChange={(e) => onChange(`${h}:${e.target.value}`)}
            className="flex-1 bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none text-center"
          >
            {minutes.map(min => <option key={min} value={min}>{min}</option>)}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-amber-100/50">
        <h2 className="text-xs font-black text-stone-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <MapPin size={16} className="text-amber-600" />
          </div>
          Outlet Profile
        </h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Business Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              placeholder="e.g. Sunny Supermarket"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Owner Name</label>
              <input
                type="text"
                value={formData.ownerName || ''}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Manager / Contact</label>
              <input
                type="text"
                value={formData.contactPerson || ''}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Outlet Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none"
              >
                <option>Supermarket</option>
                <option>Grocery Store</option>
                <option>Kiosk</option>
                <option>Corner Shop</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Email (Optional)</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="outlet@example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <TimeSelect 
              label="Opening Time" 
              value={formData.openingTime || '08:00'} 
              onChange={(val) => setFormData({ ...formData, openingTime: val })} 
            />
            <TimeSelect 
              label="Closing Time" 
              value={formData.closingTime || '21:00'} 
              onChange={(val) => setFormData({ ...formData, closingTime: val })} 
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^\d+]/g, '');
                  if (val.length > 0 && val[0] !== '0' && val[0] !== '+') val = '';
                  setFormData({ ...formData, phone: val });
                  if (phoneError) setPhoneError(null);
                }}
                className={cn(
                  "w-full bg-stone-50 border rounded-2xl px-5 py-4 text-sm font-bold transition-all focus:outline-none",
                  phoneError ? "border-amber-600 ring-2 ring-amber-600/20" : "border-stone-100 focus:ring-2 focus:ring-amber-500"
                )}
                placeholder="091... or +234..."
                maxLength={14}
              />
              {phoneError && <p className="text-[9px] font-black text-amber-600 uppercase tracking-tighter ml-1 mt-1">{phoneError}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">WhatsApp Number</label>
              <input
                type="tel"
                value={formData.whatsapp || ''}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^\d+]/g, '');
                  if (val.length > 0 && val[0] !== '0' && val[0] !== '+') val = '';
                  setFormData({ ...formData, whatsapp: val });
                  if (whatsappError) setWhatsappError(null);
                }}
                className={cn(
                  "w-full bg-stone-50 border rounded-2xl px-5 py-4 text-sm font-bold transition-all focus:outline-none",
                  whatsappError ? "border-amber-600 ring-2 ring-amber-600/20" : "border-stone-100 focus:ring-2 focus:ring-amber-500"
                )}
                placeholder="091... or +234..."
                maxLength={14}
              />
              {whatsappError && <p className="text-[9px] font-black text-amber-600 uppercase tracking-tighter ml-1 mt-1">{whatsappError}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">GPS Location (String)</label>
            <input
              type="text"
              value={formData.gps || ''}
              onChange={(e) => setFormData({ ...formData, gps: e.target.value })}
              className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Lat, Long"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Street Address</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Town / Area</label>
              <input
                type="text"
                value={formData.town || ''}
                onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Landmark</label>
              <input
                type="text"
                value={formData.landmark || ''}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-amber-100/50">
        <h2 className="text-xs font-black text-stone-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <Upload size={16} className="text-amber-600" />
          </div>
          Storefront Photos
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Existing Photos */}
          {formData.photoUrls?.map((url, i) => (
            <div key={`existing-${i}`} className="aspect-square bg-stone-50 rounded-2xl overflow-hidden relative group border border-stone-100 shadow-inner">
              <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={`existing-${i}`} />
              <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => removeExistingPhoto(url)}
                  className="bg-white text-stone-950 rounded-full p-2 hover:bg-amber-600 hover:text-white transition-colors shadow-xl"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-amber-600 text-[6px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">Cloud</div>
            </div>
          ))}

          {/* New Photos */}
          {photos.map((photo, i) => (
            <div key={i} className="aspect-square bg-stone-50 rounded-2xl overflow-hidden relative group border border-stone-100 shadow-inner">
              <img src={URL.createObjectURL(photo)} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={`outlet-${i}`} />
              <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => removePhoto(i)}
                  className="bg-white text-stone-950 rounded-full p-2 hover:bg-amber-600 hover:text-white transition-colors shadow-xl"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
          <label className="aspect-square border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center text-stone-400 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer group">
            <Plus size={32} className="transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-black uppercase tracking-widest mt-2">Add Photo</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
        </div>
      </section>
    </div>
  );
};
