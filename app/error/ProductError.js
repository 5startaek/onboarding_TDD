export default class ProductError extends Error {
    constructor(props) {
        super(props);
        this.name = "ProductError";
    }
}