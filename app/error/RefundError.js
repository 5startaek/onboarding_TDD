export default class RefundError extends Error {
    constructor(props) {
        super(props);
        this.name = "RefundError";
    }
}