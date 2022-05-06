export default class CardError extends Error {
    constructor(props) {
        super(props);
        this.name = "CardError";
    }
}