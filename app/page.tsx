'use client'

import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  contact: string;
  is_sold: boolean;
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Учеба');
  const [contact, setContact] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Все');

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setListings(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    
    if (!title.trim()) {
      setErrorMsg('Название обязательно');
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0 || numPrice > 1000000) {
      setErrorMsg('Цена должна быть от 0 до 1 000 000');
      return;
    }

    const { error } = await supabase
      .from('listings')
      .insert([{ title, price: numPrice, category, contact, is_sold: false }]);
      
    if (error) {
      setErrorMsg('Ошибка при сохранении в базу. Проверьте ключи и подключение.');
    } else {
      setShowForm(false);
      setTitle(''); setPrice(''); setCategory('Учеба'); setContact('');
      fetchListings();
    }
  }

  async function markAsSold(id: string) {
    const { error } = await supabase
      .from('listings')
      .update({ is_sold: true })
      .eq('id', id);
      
    if (!error) {
      fetchListings();
    }
  }

  // Filter listings before rendering
  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'Все' || listing.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center py-6 mb-8 border-b">
          <h1 className="text-3xl font-bold text-green-600">Барахолка колледжа</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            {showForm ? 'Отмена' : 'Добавить объявление'}
          </button>
        </header>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
            <h2 className="text-xl font-bold mb-4">Новое объявление</h2>
            {errorMsg && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{errorMsg}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название</label>
                <input type="text" className="w-full border rounded p-2" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Цена (₸)</label>
                <input type="number" className="w-full border rounded p-2" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Категория</label>
                <select className="w-full border rounded p-2" value={category} onChange={e => setCategory(e.target.value)}>
                  <option>Учеба</option>
                  <option>Техника</option>
                  <option>Вещи</option>
                  <option>Одежда</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ник в Telegram</label>
                <input type="text" className="w-full border rounded p-2" value={contact} onChange={e => setContact(e.target.value)} />
              </div>
              <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">Сохранить</button>
            </form>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Поиск по названию..." 
            className="flex-1 border rounded p-2"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select 
            className="border rounded p-2 md:w-48"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="Все">Все категории</option>
            <option value="Учеба">Учеба</option>
            <option value="Техника">Техника</option>
            <option value="Вещи">Вещи</option>
            <option value="Одежда">Одежда</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredListings.length === 0 ? (
            <p className="col-span-3 text-center text-slate-500 py-10">Ничего не найдено</p>
          ) : (
            filteredListings.map((listing) => (
              <div key={listing.id} className={`p-5 rounded-lg shadow-sm border transition-colors ${listing.is_sold ? 'bg-slate-200 border-slate-300 text-slate-500' : 'bg-white border-slate-200'}`}>
                <h2 className="text-xl font-semibold mb-2">{listing.title} {listing.is_sold && '(Продано)'}</h2>
                <div className={`text-2xl font-bold mb-4 ${listing.is_sold ? 'text-slate-500' : 'text-green-600'}`}>{listing.price} ₸</div>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className={`${listing.is_sold ? 'bg-slate-300' : 'bg-slate-100'} px-2 py-1 rounded`}>{listing.category}</span>
                  <span>{listing.contact}</span>
                </div>
                {!listing.is_sold && (
                  <button 
                    onClick={() => markAsSold(listing.id)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors text-sm font-medium"
                  >
                    Продано
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
