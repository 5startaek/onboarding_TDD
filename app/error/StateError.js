export default class StateError extends Error {
    constructor(props) {
        super(props + " 상태가 아닙니다.");
        this.name = "StateError";
    }
}