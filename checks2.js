// список всех услуг
// import * as fs from "fs";
const fs = require('fs');

const services = ["газоснабжение", "ГВС", "домофон", "капремонт", "квартплата", "ТБО", "теплоснабжение", "ХВС", "электроснабжение"];
// список всех месяцев
const months = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];

// исходный список файлов
const files = fs.readFileSync('чеки.txt', 'utf-8'); // замените на ваш список файлов

// разбиваем список файлов на массив
const fileList = files.split("\n");

// создаем объект для хранения файлов по месяцам
let filesByMonth = {};

// проходим по всем файлам
fileList.forEach(file => {
    // извлекаем название услуги и месяц из названия файла
    const [service, month] = file.split("_");

    // если для данного месяца еще не было файлов, создаем пустой массив
    if (!filesByMonth[month]) {
        filesByMonth[month] = [];
    }

    // добавляем файл в список файлов для данного месяца
    filesByMonth[month].push(file);
});

// создаем объект для хранения недостающих файлов
let missingFiles = {};

// проходим по всем месяцам
months.forEach(month => {
    // проходим по всем услугам
    services.forEach(service => {
        // формируем название файла
        const file = `${service}_${month}.pdf`;

        // если файла нет в списке для данного месяца, добавляем его в список недостающих
        if (!filesByMonth[month].includes(file)) {
            // если для данного месяца еще не было недостающих файлов, создаем пустой массив
            if (!missingFiles[month]) {
                missingFiles[month] = [];
            }

            // добавляем недостающий файл в список
            missingFiles[month].push(file);
        }
    });
});

console.log("Файлы по папкам:");
for (let month in filesByMonth) {
    console.log(`/${month}/`);
    filesByMonth[month].forEach(file => console.log(file));
}

console.log("Не оплачены:");
for (let month in missingFiles) {
    console.log(month + ":");
    missingFiles[month].forEach(file => console.log(file.split("_")[0]));
}
