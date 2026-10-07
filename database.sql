-- Создание таблицы объявлений
CREATE TABLE listings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  price integer NOT NULL,
  category text NOT NULL,
  contact text NOT NULL,
  is_sold boolean DEFAULT false NOT NULL
);

-- Включение RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Политика для чтения всеми пользователями
CREATE POLICY "Разрешить чтение всем" ON listings FOR SELECT USING (true);

-- Политика для добавления объявлений (для уровня 3)
CREATE POLICY "Разрешить добавление всем" ON listings FOR INSERT WITH CHECK (true);

-- Политика для обновления (чтобы отмечать как продано, уровень 3)
CREATE POLICY "Разрешить обновление всем" ON listings FOR UPDATE USING (true);

-- Добавление тестовых данных
INSERT INTO listings (title, price, category, contact, is_sold) VALUES
('Учебник по математике', 2000, 'Учеба', '@math_student', false),
('Ноутбук Lenovo', 150000, 'Техника', '@tech_guy', false),
('Рюкзак', 5000, 'Вещи', '@bag_seller', false),
('Калькулятор инженерный', 3000, 'Учеба', '@calc_nerd', false),
('Кроссовки 42 размер', 8000, 'Одежда', '@sneaker_head', false),
('Конспекты по физике', 1000, 'Учеба', '@phys_genius', false);
