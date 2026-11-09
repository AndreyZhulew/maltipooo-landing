// Demo content — replace with real puppies, reviews and answers later.

// status: "available" | "reserved" | "home"
export const PUPPIES = [
  { id: "bony", name: "Бони", sex: "boy", age: "2 мес", color: "кремовый", weight: "до 2,5 кг", price: 180000, status: "available", photo: "/img/pup-1.jpg",
    about: "Любопытный и ласковый, первым бежит знакомиться. Спокойно спит ночью и уже знает пелёнку." },
  { id: "mia", name: "Мия", sex: "girl", age: "2,5 мес", color: "ред-браун", weight: "до 3 кг", price: 200000, status: "available", photo: "/img/pup-2.jpg",
    about: "Нежная девочка с густой кудрявой шёрсткой. Обожает руки и игрушки-пищалки." },
  { id: "snezhka", name: "Снежка", sex: "girl", age: "2 мес", color: "белый", weight: "до 2 кг", price: 220000, status: "reserved", reservedBy: "Марина", photo: "/img/pup-3.jpg",
    about: "Мини-девочка с бантиком. Спокойная, любит сидеть на коленях." },
  { id: "teddy", name: "Тедди", sex: "boy", age: "3 мес", color: "шампань", weight: "до 3,5 кг", price: 170000, status: "available", photo: "/img/pup-4.jpg",
    about: "Настоящий плюшевый мишка: мягкий, тёплый и очень терпеливый с детьми." },
  { id: "karamel", name: "Карамелька", sex: "girl", age: "2,5 мес", color: "абрикос", weight: "до 3 кг", price: 210000, status: "available", photo: "/img/pup-5.jpg",
    about: "Яркий абрикосовый окрас и весёлый характер. Быстро учится — уже знает «ко мне»." },
  { id: "choco", name: "Шоко", sex: "boy", age: "2 мес", color: "шоколад", weight: "до 2,5 кг", price: 190000, status: "home", photo: "/img/pup-6.jpg",
    about: "Уехал в новую семью в Санкт-Петербург." },
];

export const REVIEWS = [
  { name: "Ольга и Персик", city: "Москва", photo: "/img/grown-1.jpg", text: "Выбирали по видео, Анна показала и щенка, и маму. Персик приехал с полным пакетом документов и игрушкой, адаптировался за пару дней. Прошло полгода — здоров и счастлив." },
  { name: "Дмитрий", city: "Казань", photo: "/img/grown-2.jpg", text: "Боялся брать щенка из другого города, но доставка прошла идеально: всю дорогу присылали фото. Договор, ветпаспорт, чип — всё на месте." },
  { name: "Семья Ивановых", city: "Екатеринбург", photo: "/img/breed.jpg", text: "У дочки аллергия, поэтому выбирали долго. С мальтипу никаких проблем. Спасибо за подробные консультации даже спустя месяцы после покупки!" },
  { name: "Алина", city: "Сочи", photo: "/img/pup-4.jpg", text: "Тедди — наше солнце. Отдельное спасибо за подарочный набор: в первые дни не пришлось бегать по зоомагазинам." },
];

export const FAQ = [
  ["Почему щенки мальтипу стоят дорого?", "Цена складывается из здоровья родителей, их документов и обследований, вакцинации, чипирования и ухода за щенком первые 2–3 месяца. Дешёвый щенок без документов часто оборачивается расходами на лечение."],
  ["Можно ли посмотреть щенка до оплаты?", "Да, обязательно. Покажем малыша и его родителей по видеосвязи или при встрече в питомнике. Без этого мы не берём даже задаток."],
  ["Как забронировать щенка?", "Вносите задаток по договору — и щенок снимается с продажи. Остаток оплачиваете при получении."],
  ["Какие документы будут у щенка?", "Договор купли-продажи, ветеринарный паспорт с отметками о прививках и обработках, чип. Наличие метрики уточняйте по конкретному щенку."],
  ["Мальтипу правда подходят аллергикам?", "Шерсть мальтипу почти не линяет, поэтому многие аллергики чувствуют себя хорошо. Но реакция индивидуальна — рекомендуем пообщаться со щенком лично до покупки."],
  ["Сколько будет весить взрослая собака?", "Чаще всего 2–4 кг. Для каждого щенка указываем прогноз по весу родителей."],
  ["Доставляете ли вы в другие города?", "Да, по всей России и за границу. Щенок едет с сопровождающим, стоимость считаем индивидуально."],
  ["Что делать, если щенок заболеет?", "Сразу напишите нам. На генетические заболевания действует письменная гарантия на 1 год, а по любым вопросам здоровья мы на связи и подскажем проверенного ветеринара."],
];

export const QUIZ = [
  { q: "Для кого вы выбираете щенка?", name: "for", options: ["Для себя", "Для семьи с детьми", "В подарок", "Пока присматриваюсь"] },
  { q: "Мальчик или девочка?", name: "sex", options: ["Мальчик", "Девочка", "Не важно"] },
  { q: "Какой размер вам ближе?", name: "size", options: ["Мини — до 2,5 кг", "Стандарт — 3–4 кг", "Не важно"] },
  { q: "Когда хотите забрать малыша?", name: "when", options: ["Как можно скорее", "В течение месяца", "Через 1–3 месяца", "Пока не знаю"] },
];

// Photo attribution for the temporary images (Wikimedia Commons).
export const CREDITS = [
  ["hero.jpg", "Maltese puppy portrait", "yasmapaz", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Maltese_puppy_portrait.jpg"],
  ["breed.jpg", "Maltipoo female dog headshot (90716)", "Rhododendrites", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Maltipoo_female_dog_headshot_(90716).jpg"],
  ["pup-1.jpg", "Cachorro de Bichon Maltes", "ManuelFD", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Cachorro_de_Bichon_Maltes.JPG"],
  ["pup-2.jpg", "말티즈와 푸들", "Nan4471", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:%EB%A7%90%ED%8B%B0%EC%A6%88%EC%99%80_%ED%91%B8%EB%93%A4.jpg"],
  ["pup-3.jpg", "Maltese puppy blue bow", "yasmapaz", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Maltese_puppy_blue_bow.jpg"],
  ["pup-4.jpg", "Caniche Tito", "Pipirafa", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Caniche_Tito.jpg"],
  ["pup-5.jpg", "Owning the back step", "Living in Monrovia", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Owning_the_back_step_(3641313887).jpg"],
  ["pup-6.jpg", "Baby poodle 1", "피피지기", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Baby_poodle_1.jpg"],
  ["grown-1.jpg", "Poodle en ciudad de Concepción", "Donespacial", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Poodle_en_ciudad_de_Concepci%C3%B3n..jpg"],
  ["grown-2.jpg", "French poodle", "Hierwoerdf", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:French_poodle_.jpg"],
];
