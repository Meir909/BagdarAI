export type AptitudeCategory = "Verbal" | "Numerical" | "Logical" | "Spatial";

export interface AptitudeOption {
  label: string; // "A" | "B" | "C" | "D"
  en: string;
  ru: string;
  kk: string;
}

export interface AptitudeQuestion {
  id: number;
  category: AptitudeCategory;
  en: string;
  ru: string;
  kk: string;
  options: AptitudeOption[];
  correctOption: string;
}

export interface AptitudeScores {
  Verbal: number;
  Numerical: number;
  Logical: number;
  Spatial: number;
}

export const aptitudeQuestions: AptitudeQuestion[] = [
  // VERBAL (5 questions)
  {
    id: 1, category: "Verbal",
    en: "Book is to Library as Painting is to ___?",
    ru: "Книга относится к Библиотеке так же, как Картина к ___?",
    kk: "Кітап Кітапхана сияқты, Сурет ___-ға қатысты?",
    options: [
      { label: "A", en: "Studio", ru: "Студия", kk: "Студия" },
      { label: "B", en: "Artist", ru: "Художник", kk: "Суретші" },
      { label: "C", en: "Gallery", ru: "Галерея", kk: "Галерея" },
      { label: "D", en: "Canvas", ru: "Холст", kk: "Кенеп" },
    ],
    correctOption: "C",
  },
  {
    id: 2, category: "Verbal",
    en: "Choose the word most similar in meaning to ABUNDANT:",
    ru: "Выберите слово, наиболее близкое по значению к ОБИЛЬНЫЙ:",
    kk: "МОЛ мағынасына ең жақын сөзді таңдаңыз:",
    options: [
      { label: "A", en: "Scarce", ru: "Дефицитный", kk: "Тапшы" },
      { label: "B", en: "Plentiful", ru: "Многочисленный", kk: "Мол" },
      { label: "C", en: "Rare", ru: "Редкий", kk: "Сирек" },
      { label: "D", en: "Minimal", ru: "Минимальный", kk: "Ең аз" },
    ],
    correctOption: "B",
  },
  {
    id: 3, category: "Verbal",
    en: "Which word does NOT belong in the group: Cat, Dog, Eagle, Fish, Rabbit?",
    ru: "Какое слово НЕ принадлежит группе: Кошка, Собака, Орёл, Рыба, Кролик?",
    kk: "Қай сөз топқа ЖАТПАЙДЫ: Мысық, Ит, Бүркіт, Балық, Қоян?",
    options: [
      { label: "A", en: "Cat", ru: "Кошка", kk: "Мысық" },
      { label: "B", en: "Eagle", ru: "Орёл", kk: "Бүркіт" },
      { label: "C", en: "Dog", ru: "Собака", kk: "Ит" },
      { label: "D", en: "Rabbit", ru: "Кролик", kk: "Қоян" },
    ],
    correctOption: "B",
  },
  {
    id: 4, category: "Verbal",
    en: "Complete the analogy: Doctor is to Hospital as Teacher is to ___?",
    ru: "Дополните аналогию: Врач относится к Больнице так же, как Учитель к ___?",
    kk: "Аналогияны толықтырыңыз: Дәрігер Ауруханаға қатысты сияқты, Мұғалім ___-ға қатысты?",
    options: [
      { label: "A", en: "Student", ru: "Ученик", kk: "Оқушы" },
      { label: "B", en: "Book", ru: "Книга", kk: "Кітап" },
      { label: "C", en: "School", ru: "Школа", kk: "Мектеп" },
      { label: "D", en: "Lesson", ru: "Урок", kk: "Сабақ" },
    ],
    correctOption: "C",
  },
  {
    id: 5, category: "Verbal",
    en: "If all Blips are Blops, and some Blops are Blups, then which statement is definitely true?",
    ru: "Если все Блипы — это Блопы, и некоторые Блопы — это Блупы, то какое утверждение точно верно?",
    kk: "Барлық Блиптер Блоп болса, ал кейбір Блоптер Блуп болса, қай тұжырым дәл дұрыс?",
    options: [
      { label: "A", en: "All Blips are Blups", ru: "Все Блипы — Блупы", kk: "Барлық Блиптер Блуп" },
      { label: "B", en: "Some Blips are Blops", ru: "Некоторые Блипы — Блопы", kk: "Кейбір Блиптер Блоп" },
      { label: "C", en: "No Blops are Blips", ru: "Ни один Блоп не является Блипом", kk: "Ешбір Блоп Блип емес" },
      { label: "D", en: "All Blops are Blips", ru: "Все Блопы — Блипы", kk: "Барлық Блоптер Блип" },
    ],
    correctOption: "B",
  },

  // NUMERICAL (5 questions)
  {
    id: 6, category: "Numerical",
    en: "What is 15% of 200?",
    ru: "Чему равно 15% от 200?",
    kk: "200-дің 15% қанша?",
    options: [
      { label: "A", en: "20", ru: "20", kk: "20" },
      { label: "B", en: "30", ru: "30", kk: "30" },
      { label: "C", en: "25", ru: "25", kk: "25" },
      { label: "D", en: "35", ru: "35", kk: "35" },
    ],
    correctOption: "B",
  },
  {
    id: 7, category: "Numerical",
    en: "What is the next number in the series: 2, 6, 18, 54, ___?",
    ru: "Какое следующее число в ряду: 2, 6, 18, 54, ___?",
    kk: "Қатардағы келесі сан: 2, 6, 18, 54, ___?",
    options: [
      { label: "A", en: "108", ru: "108", kk: "108" },
      { label: "B", en: "162", ru: "162", kk: "162" },
      { label: "C", en: "72", ru: "72", kk: "72" },
      { label: "D", en: "216", ru: "216", kk: "216" },
    ],
    correctOption: "B",
  },
  {
    id: 8, category: "Numerical",
    en: "If a train travels 120 km in 2 hours, how far will it travel in 5 hours at the same speed?",
    ru: "Если поезд проезжает 120 км за 2 часа, сколько он проедет за 5 часов с той же скоростью?",
    kk: "Пойыз 2 сағатта 120 км жүрсе, сол жылдамдықпен 5 сағатта қанша жер жүреді?",
    options: [
      { label: "A", en: "240 km", ru: "240 км", kk: "240 км" },
      { label: "B", en: "350 km", ru: "350 км", kk: "350 км" },
      { label: "C", en: "300 km", ru: "300 км", kk: "300 км" },
      { label: "D", en: "360 km", ru: "360 км", kk: "360 км" },
    ],
    correctOption: "C",
  },
  {
    id: 9, category: "Numerical",
    en: "What is the missing number: 3, 7, 13, 21, ___, 43?",
    ru: "Какое пропущенное число: 3, 7, 13, 21, ___, 43?",
    kk: "Жоқ сан қандай: 3, 7, 13, 21, ___, 43?",
    options: [
      { label: "A", en: "29", ru: "29", kk: "29" },
      { label: "B", en: "31", ru: "31", kk: "31" },
      { label: "C", en: "33", ru: "33", kk: "33" },
      { label: "D", en: "27", ru: "27", kk: "27" },
    ],
    correctOption: "B",
  },
  {
    id: 10, category: "Numerical",
    en: "A shirt costs ₸5,000. It is discounted by 20%. What is the sale price?",
    ru: "Рубашка стоит ₸5,000. На неё скидка 20%. Какова цена со скидкой?",
    kk: "Жейде ₸5,000 тұрады. Оған 20% жеңілдік бар. Жеңілдікпен бағасы қанша?",
    options: [
      { label: "A", en: "₸3,500", ru: "₸3,500", kk: "₸3,500" },
      { label: "B", en: "₸4,500", ru: "₸4,500", kk: "₸4,500" },
      { label: "C", en: "₸4,000", ru: "₸4,000", kk: "₸4,000" },
      { label: "D", en: "₸3,000", ru: "₸3,000", kk: "₸3,000" },
    ],
    correctOption: "C",
  },

  // LOGICAL (5 questions)
  {
    id: 11, category: "Logical",
    en: "All cats are animals. Whiskers is a cat. What can we conclude?",
    ru: "Все кошки — животные. Усатик — кошка. Что можно заключить?",
    kk: "Барлық мысықтар — жануарлар. Мұрттық — мысық. Не қорытынды жасауға болады?",
    options: [
      { label: "A", en: "Whiskers is an animal", ru: "Усатик — животное", kk: "Мұрттық — жануар" },
      { label: "B", en: "All animals are cats", ru: "Все животные — кошки", kk: "Барлық жануарлар мысық" },
      { label: "C", en: "Whiskers is not an animal", ru: "Усатик — не животное", kk: "Мұрттық жануар емес" },
      { label: "D", en: "Some cats are not animals", ru: "Некоторые кошки — не животные", kk: "Кейбір мысықтар жануар емес" },
    ],
    correctOption: "A",
  },
  {
    id: 12, category: "Logical",
    en: "Find the pattern: A, C, E, G, ___?",
    ru: "Найдите закономерность: A, C, E, G, ___?",
    kk: "Заңдылықты табыңыз: A, C, E, G, ___?",
    options: [
      { label: "A", en: "H", ru: "H", kk: "H" },
      { label: "B", en: "I", ru: "I", kk: "I" },
      { label: "C", en: "J", ru: "J", kk: "J" },
      { label: "D", en: "K", ru: "K", kk: "K" },
    ],
    correctOption: "B",
  },
  {
    id: 13, category: "Logical",
    en: "If it rains, the ground gets wet. The ground is wet. Which conclusion is valid?",
    ru: "Если идёт дождь, земля становится мокрой. Земля мокрая. Какой вывод верен?",
    kk: "Жаңбыр жауса жер суланады. Жер суланған. Қай қорытынды дұрыс?",
    options: [
      { label: "A", en: "It must have rained", ru: "Обязательно шёл дождь", kk: "Жаңбыр жауған болуы керек" },
      { label: "B", en: "It might have rained", ru: "Возможно, шёл дождь", kk: "Жаңбыр жауған болуы мүмкін" },
      { label: "C", en: "It did not rain", ru: "Дождя не было", kk: "Жаңбыр жаумады" },
      { label: "D", en: "The ground is always wet", ru: "Земля всегда мокрая", kk: "Жер әрдайым суланған" },
    ],
    correctOption: "B",
  },
  {
    id: 14, category: "Logical",
    en: "Three friends Ali, Bek, and Cam finished a race. Ali was not last. Bek was not first. Cam finished after Ali. Who finished first?",
    ru: "Три друга Али, Бек и Кам закончили гонку. Али не был последним. Бек не был первым. Кам финишировал после Али. Кто финишировал первым?",
    kk: "Үш дос Әли, Бек және Кам жарысты аяқтады. Әли соңғы болмады. Бек бірінші болмады. Кам Әлиден кейін финиш жасады. Кім бірінші болды?",
    options: [
      { label: "A", en: "Ali", ru: "Али", kk: "Әли" },
      { label: "B", en: "Bek", ru: "Бек", kk: "Бек" },
      { label: "C", en: "Cam", ru: "Кам", kk: "Кам" },
      { label: "D", en: "Cannot be determined", ru: "Невозможно определить", kk: "Анықтау мүмкін емес" },
    ],
    correctOption: "A",
  },
  {
    id: 15, category: "Logical",
    en: "Which number comes next: 1, 4, 9, 16, 25, ___?",
    ru: "Какое число идёт следующим: 1, 4, 9, 16, 25, ___?",
    kk: "Келесі сан қандай: 1, 4, 9, 16, 25, ___?",
    options: [
      { label: "A", en: "30", ru: "30", kk: "30" },
      { label: "B", en: "36", ru: "36", kk: "36" },
      { label: "C", en: "32", ru: "32", kk: "32" },
      { label: "D", en: "49", ru: "49", kk: "49" },
    ],
    correctOption: "B",
  },

  // SPATIAL (5 questions)
  {
    id: 16, category: "Spatial",
    en: "A cube has 6 faces. How many edges does a cube have?",
    ru: "У куба 6 граней. Сколько рёбер у куба?",
    kk: "Кубтың 6 беті бар. Кубтың неше қыры бар?",
    options: [
      { label: "A", en: "8", ru: "8", kk: "8" },
      { label: "B", en: "10", ru: "10", kk: "10" },
      { label: "C", en: "12", ru: "12", kk: "12" },
      { label: "D", en: "16", ru: "16", kk: "16" },
    ],
    correctOption: "C",
  },
  {
    id: 17, category: "Spatial",
    en: "If you fold a square piece of paper in half twice, then unfold it — how many equal sections does it have?",
    ru: "Если сложить квадратный лист бумаги пополам дважды, а затем развернуть — на сколько равных частей он разделится?",
    kk: "Квадрат қағазды екі рет бүктеп, кейін жазсаңыз — ол неше тең бөлікке бөлінеді?",
    options: [
      { label: "A", en: "2", ru: "2", kk: "2" },
      { label: "B", en: "3", ru: "3", kk: "3" },
      { label: "C", en: "4", ru: "4", kk: "4" },
      { label: "D", en: "8", ru: "8", kk: "8" },
    ],
    correctOption: "C",
  },
  {
    id: 18, category: "Spatial",
    en: "You are facing North. You turn 90° clockwise, then 180° clockwise. Which direction are you now facing?",
    ru: "Вы смотрите на север. Поворачиваетесь на 90° по часовой стрелке, затем на 180° по часовой стрелке. В каком направлении вы теперь смотрите?",
    kk: "Сіз солтүстікке қарасыз. Сағат тілімен 90°, содан кейін 180° бұрыласыз. Қазір қай бағытта тұрсыз?",
    options: [
      { label: "A", en: "North", ru: "Север", kk: "Солтүстік" },
      { label: "B", en: "South", ru: "Юг", kk: "Оңтүстік" },
      { label: "C", en: "East", ru: "Восток", kk: "Шығыс" },
      { label: "D", en: "West", ru: "Запад", kk: "Батыс" },
    ],
    correctOption: "D",
  },
  {
    id: 19, category: "Spatial",
    en: "A rectangular box is 4 cm long, 3 cm wide, and 2 cm tall. What is its volume?",
    ru: "Прямоугольная коробка имеет длину 4 см, ширину 3 см и высоту 2 см. Каков её объём?",
    kk: "Тіктөртбұрышты қораптың ұзындығы 4 см, ені 3 см, биіктігі 2 см. Оның көлемі қанша?",
    options: [
      { label: "A", en: "18 cm³", ru: "18 см³", kk: "18 см³" },
      { label: "B", en: "20 cm³", ru: "20 см³", kk: "20 см³" },
      { label: "C", en: "24 cm³", ru: "24 см³", kk: "24 см³" },
      { label: "D", en: "26 cm³", ru: "26 см³", kk: "26 см³" },
    ],
    correctOption: "C",
  },
  {
    id: 20, category: "Spatial",
    en: "Which shape has the most lines of symmetry: Square, Circle, Rectangle, Triangle?",
    ru: "У какой фигуры больше всего осей симметрии: квадрат, круг, прямоугольник, треугольник?",
    kk: "Қай фигураның симметрия осьтері ең көп: шаршы, шеңбер, тіктөртбұрыш, үшбұрыш?",
    options: [
      { label: "A", en: "Square", ru: "Квадрат", kk: "Шаршы" },
      { label: "B", en: "Rectangle", ru: "Прямоугольник", kk: "Тіктөртбұрыш" },
      { label: "C", en: "Triangle", ru: "Треугольник", kk: "Үшбұрыш" },
      { label: "D", en: "Circle", ru: "Круг", kk: "Шеңбер" },
    ],
    correctOption: "D",
  },
];

export function calculateAptitudeScores(answers: Record<number, string>): AptitudeScores {
  const scores: AptitudeScores = { Verbal: 0, Numerical: 0, Logical: 0, Spatial: 0 };
  for (const q of aptitudeQuestions) {
    if (answers[q.id] === q.correctOption) {
      scores[q.category] += 1;
    }
  }
  return scores;
}

export function getAptitudeStrengths(scores: AptitudeScores): AptitudeCategory[] {
  return (Object.entries(scores) as [AptitudeCategory, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);
}

export const APTITUDE_LABELS: Record<AptitudeCategory, { en: string; ru: string; kk: string; color: string; bg: string }> = {
  Verbal: { en: "Verbal Reasoning", ru: "Вербальное мышление", kk: "Сөздік ойлау", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/30" },
  Numerical: { en: "Numerical Reasoning", ru: "Числовое мышление", kk: "Сандық ойлау", color: "text-green-500", bg: "bg-green-500/10 border-green-500/30" },
  Logical: { en: "Logical Reasoning", ru: "Логическое мышление", kk: "Логикалық ойлау", color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/30" },
  Spatial: { en: "Spatial Reasoning", ru: "Пространственное мышление", kk: "Кеңістіктік ойлау", color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/30" },
};
