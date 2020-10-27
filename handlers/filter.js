function FilterDate(Date) {
    Date = Date.split(' ');

    if (Date.length === 2) {
        const MONTHS = [
            'January','Feburary','March','April',
            'May','June','July','August',
            'September','October','November','December'
        ];

        let MONTH_VALID, DAY_VALID = false;
        
        for (let i = 0; i < MONTHS.length; i++) {
            if (Date[0].toLowerCase() == MONTHS[i].toLowerCase()) {
                Date[0] = MONTHS[i];
                MONTH_VALID = true;
                break;
            };
        };

        for (let i = 1; i < 32; i++) {
            if (Date[1] === `${i}`) {
                DAY_VALID = true;
                break;
            };
        };

        if (MONTH_VALID && DAY_VALID) {
            return `${Date[0]} ${Date[1]}`;
        };
    };
    return false;
};

function FilterTime(Time) {
    Time = Time.split(' ');
    
    if (Time.length === 2) {
        const CLOCK = Time[0].split(':');
        const MERIDIEM = Time[1].toLowerCase();

        let MERIDIEM_VALID, HOUR_VALID, MINUTE_VALID = false;
        
        if (Time[0].charAt(':')) {
            for (let i = 1; i < 13; i++) {
                if (CLOCK[0] === `${i}`) {
                    HOUR_VALID = true;
                    break;
                };
            };
            
            for (let i = 0; i < 60; i++) {
                if (CLOCK[1] === `${i}`) {
                    MINUTE_VALID = true;
                    break;
                } else if (CLOCK[1] == `0${i}`) {
                    MINUTE_VALID = true;
                    break;
                };
            };
        };               

        if (MERIDIEM == 'p.m.' || MERIDIEM == 'a.m.') {
            MERIDIEM_VALID = true;
        };

        if (HOUR_VALID && MINUTE_VALID && MERIDIEM_VALID) {
            return `${Time.join(' ').toUpperCase()}`;
        };
    };
    return false;
};

function FilterNumber(Number, Limit) {
    if (!isNaN(Number)) {
        if (Number > Limit) {
            return Number;
        };     
    }; 
    return false;
};

function FilterGame(Game) {
    let words = Game.split(' ');
    
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    };
    Game = words.join(' ');
    return Game;
};

module.exports = {
    Time: FilterTime,
    Date: FilterDate,
    Number: FilterNumber,
    Game: FilterGame
};