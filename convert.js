
function getPrecision(value) {
    if (Math.floor(value) === value) {
        return 0;
    }

    const split = value.split(".");

    if (!split[1]) {
        return 0;
    }

    return split[1].length || 0;
}

function convertValue(value, conversion, precision) {
    return conversion(value).toFixed(precision);
}

const convertUnitMap = {
    mm: "in",
    cm: "in",
    in: "mm"
};

const conversionMap = {
    mm: {
        in: (value) => parseFloat(value) / 25.4,
    },
    cm: {
        in: (value) => parseFloat(value) / 2.54,
    },
    in: {
        mm: (value) => parseFloat(value) * 25.4,
    }
}

function convert() {
    const elements = document.body.querySelectorAll('*');
    for (const element of elements) {
        if (element.children.length > 0) {
            continue;
        }

        const metricUnits = [
            "mm",
            "cm",
            "m"
        ];

        const standardUnits = [
            "in"
        ];

        const matchUnits = [
            ...metricUnits,
            ...standardUnits
        ];

        const regex = new RegExp(
            '(\\d*\\.?\\d+)\\s?(' + matchUnits.join('|') + '+)'
        );

        let i = 0;

        if (element.innerText && regex.test(element.innerText)) {
            let match = regex.exec(element.innerText);

            //need to adjust for cases where there are multiple measurements in single element text
            let value = match[1];
            let unit = match[2];

            let precision = getPrecision(value);
            let conversion;

            switch (unit) {
                case 'mm':
                    conversion = conversionMap[unit]['in'];

                    // mm to inches, we'll want at least 2 decimal
                    if (precision < 2) {
                        precision = 2;
                    }

                    break;
                case 'cm':
                    conversion = conversionMap[unit]['in'];

                    // cm to inches, we'll want at least 1 decimal
                    if (precision < 1) {
                        precision = 1;
                    }

                    break;
                case 'in':
                    conversion = conversionMap[unit]['mm'];

                    break;
                default:
                    conversion = (value) => parseFloat(value);
            }

            let convertedValue = convertValue(value, conversion, precision);

            if (element.innerText.includes(" (" + convertedValue + convertUnitMap[unit] + ")")) {
                continue;
            }

            let convertedString = match[0] + " (" + convertedValue + convertUnitMap[unit] +")";

            element.innerText = element.innerText.replace(match[0], convertedString);
        }
    }
}

convert();
