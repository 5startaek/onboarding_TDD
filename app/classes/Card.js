import {findAllCard, findCard} from "../api/mongo.js";

export default class Card {
    constructor(company, cardNumber, validity, budget, limit, checkStart, checkEnd) {
        this._company = company;
        this._cardNumber = cardNumber;
        this._validity = validity;
        this._budget = budget;
        this._limit = limit;
        this._checkStart = checkStart;
        this._checkEnd = checkEnd;
    }

    get company() {
        return this._company;
    }

    get cardNumber() {
        return this._cardNumber;
    }

    get validity() {
        return this._validity;
    }

    get budget() {
        return this._budget;
    }

    get limit() {
        return this._limit;
    }

    get checkStart() {
        return this._checkStart
    }

    get checkEnd() {
        return this._checkEnd
    }

    set budget(value) {
        this._budget = value;
    }

    set limit(value) {
        this._limit = value;
    }
}

export const createCard = (company, cardNumber, validity, budget, limit, checkStart, checkEnd) => {
    return new Card(company, cardNumber, validity, budget, limit, checkStart, checkEnd);
}

// export const getCard = async (company, cardNumber) => {
//     return await findCard(company, cardNumber);
// }
//
// export const getAllCard = async () => {
//     return await findAllCard();
// }