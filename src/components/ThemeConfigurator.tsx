import React, { useState } from 'react';
import { siteConfig } from '../../site.config';
import { Save } from 'lucide-react';

export default function ThemeConfigurator() {
  const [formData, setFormData] = useState({
    title: siteConfig.title,
    description: siteConfig.description,
    logoText: siteConfig.branding.logoText,
    logoImageBase64: '',
    primaryColor: siteConfig.theme?.hexColors?.primary || '#0f172a',
    secondaryColor: siteConfig.theme?.hexColors?.secondary || '#475569',
    accentColor: siteConfig.theme?.hexColors?.accent || '#3b82f6',
  });
  const [saving, setSaving] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoImageBase64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const newSiteConfig = {
        ...siteConfig,
        title: formData.title,
        description: formData.description,
        branding: {
          ...siteConfig.branding,
          logoText: formData.logoText,
        },
        theme: {
          ...siteConfig.theme,
          hexColors: {
            primary: formData.primaryColor,
            secondary: formData.secondaryColor,
            accent: formData.accentColor,
          }
        }
      };

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          siteConfig: newSiteConfig,
          logoImageBase64: formData.logoImageBase64,
          tailwindConfigColors: {
            primary: formData.primaryColor,
            secondary: formData.secondaryColor,
            accent: formData.accentColor,
          }
        })
      });
      
      if (!res.ok) throw new Error('Failed to save config');
      alert('Settings saved successfully! You may need to restart the development server or refresh the page to see full changes.');
    } catch (e) {
      alert('Error saving configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Site Branding & Theme Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2">General Info</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Site Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-accent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-accent outline-none resize-none h-24"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Logo Text</label>
            <input 
              type="text" 
              value={formData.logoText} 
              onChange={e => setFormData({...formData, logoText: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Logo Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-accent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {formData.logoImageBase64 && <img src={formData.logoImageBase64} alt="Logo Preview" className="h-12 mt-2 object-contain" />}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2">Colors</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Color</label>
            <div className="flex gap-3">
              <input 
                type="color" 
                value={formData.primaryColor} 
                onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input 
                type="text" 
                value={formData.primaryColor} 
                onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-accent outline-none uppercase font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Secondary Color</label>
            <div className="flex gap-3">
              <input 
                type="color" 
                value={formData.secondaryColor} 
                onChange={e => setFormData({...formData, secondaryColor: e.target.value})}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input 
                type="text" 
                value={formData.secondaryColor} 
                onChange={e => setFormData({...formData, secondaryColor: e.target.value})}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-accent outline-none uppercase font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Accent Color</label>
            <div className="flex gap-3">
              <input 
                type="color" 
                value={formData.accentColor} 
                onChange={e => setFormData({...formData, accentColor: e.target.value})}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input 
                type="text" 
                value={formData.accentColor} 
                onChange={e => setFormData({...formData, accentColor: e.target.value})}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-accent outline-none uppercase font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end pt-6 border-t border-slate-200 dark:border-slate-800">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}
