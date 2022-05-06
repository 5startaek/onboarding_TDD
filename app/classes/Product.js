import {findAllProduct, findProduct} from "../api/mongo.js";

export default class Product {
    constructor(name, number, price, refundable) {
        this._name = name;
        this._number = number;
        this._price = price;
        this._refundable = refundable;
    }

    get name() {
        return this._name;
    }

    get number() {
        return this._number;
    }

    get price() {
        return this._price;
    }

    get refundable() {
        return this._refundable;
    }

    set number(value) {
        this._number = value;
    }
}

export const createProduct = (name, number, price, refundable) => {
    return new Product(name, number, price, refundable);
}
//
// export const getProduct = async (name) => {
//     return await findProduct(name);
// }
//
// export const getAllProduct = async () => {
//     return await findAllProduct();
// }