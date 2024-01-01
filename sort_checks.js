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

// Читаем содержимое файла "чеки.txt"
const data = fs.readFileSync('чеки.txt', 'utf-8');
const dataArray = data.split("\n");

fs.truncate('чеки_по_папкам.txt', 0, (err) => {
    if (err) {
        console.error(err);
        return;
    }

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
        const monthReplace = month.replace('.pdf', '').trim();
        const serviceReplace = service.trim();
        const monthService = `/${monthReplace}/${serviceReplace}_${monthReplace}.pdf\n`;
        // записываем новые данные в файл
        fs.appendFileSync('чеки_по_папкам.txt', monthService);
    });
});
