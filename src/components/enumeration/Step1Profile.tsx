import React, { useState, useRef } from 'react';
import { MapPin, Upload, Plus, X, Camera, Image, FileText, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Outlet } from '../../types';
import imageCompression from 'browser-image-compression';

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

export const Step1Profile: React.FC<Step1Props> = ({
  formData, setFormData, photos, setPhotos, phoneError, setPhoneError, whatsappError, setWhatsappError
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsCompressing(true);
      setShowMenu(false);
      
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      try {
        const selectedFiles = Array.from(e.target.files);
        const compressedFiles = await Promise.all(
          selectedFiles.map(async (file) => {
            // Only compress images, leave PDFs or other files as is
            if (file.type.startsWith('image/')) {
              return await imageCompression(file, options);
            }
            return file;
          })
        );

        setPhotos([...photos, ...compressedFiles]);
      } catch (error) {
        console.error("Compression error:", error);
        alert("Failed to process some images. Please try again.");
      } finally {
        setIsCompressing(false);
        // Reset input value so same file can be picked again if removed
        e.target.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (url: string) => {
    const updated = (formData.photoUrls || []).filter(u => u !== url);
    setFormData({ ...formData, photoUrls: updated });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <section className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-amber-100/50">
        <h2 className="text-xs font-black text-stone-400 uppercase tracking-[0.18em] sm:tracking-[0.3em] mb-8 flex items-center gap-3">
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
              placeholder="For example, Sunny Supermarket"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Outlet Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none"
              >
                <option>Supermarket</option>
                <option>Provision Store</option>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-1">
                    <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Global Positioning System Coordinates (Latitude, Longitude)</label>
                    <a 
                      href="https://www.gps-coordinates.net/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[9px] font-black text-amber-600 hover:text-stone-950 underline uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                    >
                      <MapPin size={10} /> Find on Map
                    </a>
                  </div>
                  <input
                    type="text"
                    value={formData.gps || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const [lat, lng] = val.split(',').map(s => s.trim());
                      setFormData({ 
                        ...formData, 
                        gps: val,
                        latitude: lat || '',
                        longitude: lng || ''
                      });
                    }}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="For example, 6.465422, 3.406448"
                  />
                  <p className="text-[8px] font-medium text-stone-400 italic ml-1 mt-1 uppercase tracking-widest">Format: Latitude, Longitude (Separated by comma)</p>
                </div>          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Street Address</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
      
      <section className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-amber-100/50">
        <h2 className="text-xs font-black text-stone-400 uppercase tracking-[0.18em] sm:tracking-[0.3em] mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <Upload size={16} className="text-amber-600" />
          </div>
          Storefront Photos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
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
          
          <div className="relative">
            <button 
              type="button"
              disabled={isCompressing}
              onClick={() => setShowMenu(true)}
              className={cn(
                "aspect-square w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group",
                isCompressing ? "border-amber-400 bg-amber-50 text-amber-600" : "border-stone-200 text-stone-400 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50"
              )}
            >
              {isCompressing ? (
                <>
                  <Loader2 size={32} className="animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest mt-2 text-center px-2">Optimizing...</span>
                </>
              ) : (
                <>
                  <Plus size={32} className="transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-black uppercase tracking-widest mt-2">Add Photo</span>
                </>
              )}
            </button>

            {/* Hidden Inputs */}
            <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handlePhotoChange} />
            <input type="file" accept="image/*" multiple className="hidden" ref={galleryInputRef} onChange={handlePhotoChange} />
            <input type="file" accept="image/*,application/pdf" className="hidden" ref={fileInputRef} onChange={handlePhotoChange} />

            {/* Upload Menu Overlay */}
            {showMenu && (
              <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowMenu(false)} />
                <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-in fade-in slide-in-from-bottom-10 duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 uppercase tracking-tighter italic">Source Selection</h3>
                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] mt-1">Upload Storefront Evidence</p>
                    </div>
                    <button onClick={() => setShowMenu(false)} className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-stone-950 hover:bg-stone-100 transition-all">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <button 
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-stone-50 hover:bg-amber-50 hover:text-amber-600 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-stone-400 group-hover:text-amber-600 group-hover:scale-110 transition-all">
                        <Camera size={28} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Camera</span>
                    </button>
                    
                    <button 
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-stone-50 hover:bg-amber-50 hover:text-amber-600 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-stone-400 group-hover:text-amber-600 group-hover:scale-110 transition-all">
                        <Image size={28} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Photos</span>
                    </button>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-stone-50 hover:bg-amber-50 hover:text-amber-600 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-stone-400 group-hover:text-amber-600 group-hover:scale-110 transition-all">
                        <FileText size={28} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Files</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => setShowMenu(false)}
                    className="w-full mt-8 py-4 rounded-2xl bg-stone-950 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-xl"
                  >
                    Cancel Selection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
