const fs = require('fs');

const monthMapping = {
    'январь': 1,
    'февраль': 2,
    'март': 3,
    'апрель': 4,
    'май': 5,
    'июнь': 6,
    'июль': 7,
    'август': 8,
    'сентябрь': 9,
    'октябрь': 10,
    'ноябрь': 11,
    'декабрь': 12
};

const data = fs.readFileSync('чеки.txt', 'utf-8');
const dataArray = data.split("\n");
const paidServices = {};

// Сортировка массива по месяцам
dataArray.sort((a, b) => {
    const [, monthA] = a.split("_");
    const [, monthB] = b.split("_");
    const monthReplaceA = monthA.replace('.pdf', '').trim().toLowerCase();
    const monthReplaceB = monthB.replace('.pdf', '').trim().toLowerCase();
    return monthMapping[monthReplaceA] - monthMapping[monthReplaceB];
});

dataArray.forEach(file => {
    // извлекаем название услуги и месяц из названия файла
    const [service, month] = file.split("_");
    const monthReplace = month.replace('.pdf', '').trim().toLowerCase();
    const serviceReplace = service.trim().toLowerCase();

    if (!paidServices[monthReplace]) {
        paidServices[monthReplace] = new Set();
    }

    // Добавляем услугу в оплаченные для данного месяца
    paidServices[monthReplace].add(serviceReplace);
});

fs.writeFileSync('чеки_по_папкам.txt', '');

Object.keys(paidServices).forEach(month => {
    const unpaidServices = ['газоснабжение', 'гвс', 'домофон', 'капремонт', 'квартплата', 'тбо', 'теплоснабжение', 'хвс', 'электроснабжение']
        .filter(service => !paidServices[month].has(service));

    // Добавляем оплаченные услуги в файл
    paidServices[month].forEach(service => {
        const monthService = `/${month}/${service}_${month}.pdf\n`;
        fs.appendFileSync('чеки_по_папкам.txt', monthService);
    });

    // Если есть неоплаченные услуги, добавляем их в раздел "не оплачены"
    if (unpaidServices.length > 0) {
        const unpaidServicesText = unpaidServices.join('\n');
        fs.appendFileSync('чеки_по_папкам.txt', `не оплачены:\n${month}:\n${unpaidServicesText}\n\n`);
    } else {
        // Если нет неоплаченных услуг, выводим соответствующее сообщение
        fs.appendFileSync('чеки_по_папкам.txt', `не оплачены:\nнеоплаченных услуг нет в месяце ${month}\n\n`);
    }
});


